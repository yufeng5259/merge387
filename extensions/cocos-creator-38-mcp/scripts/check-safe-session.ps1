param(
  [int]$Port = 6800,
  [string]$ExpectedSceneScriptVersion = "2026-06-22-prefab-root-metadata-1",
  [switch]$Json
)

$ErrorActionPreference = "Stop"

$baseUrl = "http://127.0.0.1:$Port"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$startedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$issues = New-Object System.Collections.Generic.List[object]
$warnings = New-Object System.Collections.Generic.List[object]
$checks = New-Object System.Collections.Generic.List[object]

function Add-Check {
  param(
    [string]$Name,
    [bool]$Ok,
    [object]$Details = $null
  )
  $checks.Add([pscustomobject]@{
    name = $Name
    ok = $Ok
    details = $Details
  })
  if (-not $Ok) {
    $issues.Add([pscustomobject]@{
      name = $Name
      details = $Details
    })
  }
}

function Add-Warning {
  param(
    [string]$Name,
    [object]$Details = $null
  )
  $warnings.Add([pscustomobject]@{
    name = $Name
    details = $Details
  })
}

function Invoke-McpTool {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [hashtable]$Arguments = @{}
  )
  $body = @{ name = $Name; arguments = $Arguments } | ConvertTo-Json -Depth 20
  $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/tool" -ContentType "application/json" -Body $body -TimeoutSec 30
  if ($response.error) {
    throw "$Name failed: $($response.error | ConvertTo-Json -Depth 10 -Compress)"
  }
  return $response.result
}

try {
  $status = Invoke-RestMethod -Method Get -Uri "$baseUrl/api/status" -TimeoutSec 10
  Add-Check "bridge_http" $true @{ port = $Port; toolCount = @($status.tools).Count }
} catch {
  Add-Check "bridge_http" $false @{ port = $Port; error = $_.Exception.Message }
}

try {
  $projectInfo = Invoke-McpTool "get_project_info"
  Add-Check "project_info" ([bool]$projectInfo.path) @{
    path = $projectInfo.path
    version = $projectInfo.version
    toolCount = $projectInfo.mcp.toolCount
  }
} catch {
  Add-Check "project_info" $false @{ error = $_.Exception.Message }
}

try {
  $hierarchy = Invoke-McpTool "get_scene_hierarchy" @{ depth = 1 }
  Add-Check "scene_hierarchy" ([bool]$hierarchy.name) @{
    name = $hierarchy.name
    uuid = $hierarchy.uuid
    childrenCount = $hierarchy.childrenCount
  }
} catch {
  Add-Check "scene_hierarchy" $false @{ error = $_.Exception.Message }
}

$unsafe = @()
try {
  $unsafe = @(Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "CocosCreator.exe" -and
    $_.CommandLine -like "*--project*" -and
    $_.CommandLine -like "*$projectRoot*" -and
    $_.CommandLine -match "--can-show-upgrade-dialog\s+true"
  } | ForEach-Object {
    [pscustomobject]@{
      processId = $_.ProcessId
      commandLine = $_.CommandLine
    }
  })
  Add-Check "launch_flag_scan" $true @{
    observedFlag = "--can-show-upgrade-dialog true"
    warningCount = $unsafe.Count
    findings = $unsafe
    policy = "warning_only"
  }
  if ($unsafe.Count -gt 0) {
    Add-Warning "launch_flag_warning" @{
      observedFlag = "--can-show-upgrade-dialog true"
      warningCount = $unsafe.Count
      reason = "Cocos Creator may add this flag during normal manual startup; operation-level dialog guards still block unsafe open/close/switch/save actions."
      findings = $unsafe
    }
  }
} catch {
  Add-Check "launch_flag_scan" $false @{ error = $_.Exception.Message }
}

try {
  $health = Invoke-McpTool "get_bridge_health" @{
    expectedSceneScriptVersion = $ExpectedSceneScriptVersion
    includeTools = $false
    includeRecentErrors = $true
    errorLimit = 5
    sinceTs = $startedAt
  }
  Add-Check "bridge_health" ([bool]$health.ok) @{
    status = $health.status
    toolCount = $health.toolCount
    launchSafety = $health.launchSafety
    sceneScript = $health.sceneScript
  }
  if ($health.launchSafety -and $health.launchSafety.ok -eq $false) {
    Add-Check "launch_safety" $false $health.launchSafety
  } else {
    Add-Check "launch_safety" $true $health.launchSafety
  }
  if ($health.sceneScript -and $health.sceneScript.loadedMatchesDisk -eq $false) {
    Add-Check "scene_script_loaded_matches_disk" $false $health.sceneScript
  } else {
    Add-Check "scene_script_loaded_matches_disk" $true $health.sceneScript
  }
} catch {
  Add-Check "bridge_health" $false @{ error = $_.Exception.Message }
}

$ok = ($issues.Count -eq 0)
$result = [pscustomobject]@{
  ok = $ok
  status = if ($ok) { "ready" } else { "blocked" }
  projectRoot = $projectRoot
  port = $Port
  expectedSceneScriptVersion = $ExpectedSceneScriptVersion
  startedAt = $startedAt
  checks = $checks
  issues = $issues
  warnings = $warnings
  mutatingAutomationAllowed = $ok
  nextSuggestedFix = if ($ok) {
    "Safe session checks passed; mutating live MCP automation may proceed with per-operation console baselines."
  } else {
    "Resolve blocked checks before mutating live MCP automation: ensure the MCP extension scene-script reloads so loadedMatchesDisk is true, close actual editor dialogs, resolve dirty-state risks, then rerun this script."
  }
}

if ($Json) {
  $result | ConvertTo-Json -Depth 40
} else {
  if ($ok) {
    Write-Host "[PASS] Cocos MCP session is safe for mutating live automation."
    foreach ($warning in $warnings) {
      Write-Host " - warning $($warning.name): $($warning.details | ConvertTo-Json -Depth 12 -Compress)"
    }
  } else {
    Write-Host "[BLOCKED] Cocos MCP session is not safe for mutating live automation."
    foreach ($issue in $issues) {
      Write-Host " - $($issue.name): $($issue.details | ConvertTo-Json -Depth 12 -Compress)"
    }
    Write-Host "[NEXT] $($result.nextSuggestedFix)"
  }
}

if (-not $ok) { exit 2 }

