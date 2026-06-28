'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var childProcess = require('child_process');
var versionInfo = require('./versionInfo');

var PACKAGE_NAME = 'cocos38-dev-mcp-plugin';
var SKILL_NAME = 'cocos38-dev';

function fileExists(filePath) {
  try { return fs.existsSync(filePath); } catch (e) { return false; }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeIfExists(targetPath) {
  if (!fileExists(targetPath)) return;
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function normalizeSlash(value) {
  return String(value || '').replace(/\\/g, '/');
}

function getProjectRoot() {
  var extensionRoot = path.resolve(__dirname, '..');
  return path.resolve(extensionRoot, '..', '..');
}

function getDefaultCodexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
}

function getSkillSourcePath(args) {
  args = args || {};
  if (args.skillPath) return path.resolve(String(args.skillPath));
  return path.join(getDefaultCodexHome(), 'skills', SKILL_NAME);
}

function listFiles(root) {
  var files = [];
  function walk(dir) {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(function (entry) {
      var full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (shouldSkipDirectory(entry.name, full)) return;
        walk(full);
      } else if (entry.isFile()) {
        if (shouldSkipFile(entry.name, full)) return;
        files.push(full);
      }
    });
  }
  walk(root);
  return files;
}

function shouldSkipDirectory(name, fullPath) {
  var base = String(name || '').toLowerCase();
  if (base === 'node_modules' || base === '.git' || base === '.svn' || base === '.hg') return true;
  if (base === 'dist' || base === 'temp' || base === '.cache') return true;
  if (base === '__pycache__') return true;
  return false;
}

function shouldSkipFile(name, fullPath) {
  var base = String(name || '').toLowerCase();
  if (base.endsWith('.log') || base.endsWith('.tmp') || base.endsWith('.bak')) return true;
  if (base === 'thumbs.db' || base === '.ds_store') return true;
  return false;
}

function copyTree(sourceRoot, targetRoot) {
  var copied = [];
  var files = listFiles(sourceRoot);
  files.forEach(function (filePath) {
    var rel = path.relative(sourceRoot, filePath);
    var target = path.join(targetRoot, rel);
    ensureDir(path.dirname(target));
    fs.copyFileSync(filePath, target);
    copied.push(normalizeSlash(path.relative(targetRoot, target)));
  });
  return copied;
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function buildForbiddenTerms() {
  return [
    '.' + 'tmp/',
    '.' + 'omx/',
    'omx' + '_wiki/',
    'docs/' + 'ai/',
    'AG' + 'ENTS.md',
    'CLA' + 'UDE.md',
  ];
}

function scanForbiddenTerms(roots) {
  var terms = buildForbiddenTerms();
  var matches = [];
  roots.forEach(function (root) {
    if (!fileExists(root)) return;
    listFiles(root).forEach(function (filePath) {
      var ext = path.extname(filePath).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.zip', '.ico', '.ttf', '.otf', '.mp3', '.wav'].indexOf(ext) >= 0) return;
      var text = '';
      try { text = fs.readFileSync(filePath, 'utf8'); } catch (e) { return; }
      terms.forEach(function (term) {
        if (text.indexOf(term) === -1) return;
        matches.push({
          file: normalizeSlash(filePath),
          term: term,
        });
      });
    });
  });
  return {
    ok: matches.length === 0,
    termsChecked: terms.length,
    matches: matches,
  };
}

function writeReadme(filePath, manifest) {
  var lines = [
    '# Cocos38 Dev MCP Install Package',
    '',
    'This package installs the generic Cocos Creator 3.8 MCP extension and the generic `cocos38-dev` Codex skill.',
    '',
    'It is a reusable tooling package. It does not include project gameplay code, project prefabs, project scenes, project resources, or project data.',
    '',
    '## Contents',
    '',
    '- `extensions/cocos-creator-38-mcp/`',
    '- `skills/cocos38-dev/`',
    '- `install.ps1`',
    '- `install.sh`',
    '- `manifest.json`',
    '',
    '## Version',
    '',
    '- Version: `' + manifest.version + '`',
    '- MCP tools updated at: `' + manifest.mcpToolsUpdatedAt + '`',
    '',
    '## Windows Install',
    '',
    '```powershell',
    '.\\install.ps1 -ProjectPath C:\\path\\to\\cocos-project -Force',
    '```',
    '',
    'If `-ProjectPath` is omitted, the script uses the current directory. If `-CodexHome` is omitted, it uses `$env:CODEX_HOME` or `$HOME\\.codex`.',
    '',
    '## macOS/Linux Install',
    '',
    '```bash',
    './install.sh --project-path /path/to/cocos-project --force',
    '```',
    '',
    'If `--project-path` is omitted, the script uses the current directory. If `--codex-home` is omitted, it uses `$CODEX_HOME` or `$HOME/.codex`.',
    '',
    '## Verify After Install',
    '',
    '1. Open the Cocos Creator project.',
    '2. Open the MCP panel and start or restart the MCP service.',
    '3. Check `/api/status` and confirm the version above.',
    '4. Call `get_project_info` and confirm the MCP metadata is present.',
    '5. Use `$cocos38-dev` for Cocos Creator 3.8 work.',
    '',
    '## Notes',
    '',
    '- Existing target folders are not overwritten unless `-Force` or `--force` is supplied.',
    '- Existing `.mcp.json` is merged only when it can be parsed safely.',
    '- If automatic config merge fails, the installer prints the JSON snippet to add manually.',
    '',
  ];
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function writeInstallPs1(filePath) {
  var text = [
    'param(',
    '  [string]$ProjectPath = (Get-Location).Path,',
    '  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }),',
    '  [switch]$Force',
    ')',
    '',
    '$ErrorActionPreference = "Stop"',
    '$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path',
    '$ExtensionSource = Join-Path $PackageRoot "extensions\\cocos-creator-38-mcp"',
    '$SkillSource = Join-Path $PackageRoot "skills\\cocos38-dev"',
    '$ExtensionTarget = Join-Path $ProjectPath "extensions\\cocos-creator-38-mcp"',
    '$SkillTarget = Join-Path $CodexHome "skills\\cocos38-dev"',
    '',
    'function Copy-InstallTree($Source, $Target) {',
    '  if (!(Test-Path -LiteralPath $Source)) { throw "Missing source: $Source" }',
    '  if (Test-Path -LiteralPath $Target) {',
    '    if (!$Force) { throw "Target exists: $Target. Re-run with -Force to overwrite." }',
    '    $Backup = "$Target.backup.$(Get-Date -Format yyyyMMddHHmmss)"',
    '    Move-Item -LiteralPath $Target -Destination $Backup',
    '    Write-Host "Backed up $Target -> $Backup"',
    '  }',
    '  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Target) | Out-Null',
    '  Copy-Item -LiteralPath $Source -Destination $Target -Recurse -Force',
    '}',
    '',
    'Copy-InstallTree $ExtensionSource $ExtensionTarget',
    'Copy-InstallTree $SkillSource $SkillTarget',
    '',
    '$McpPath = Join-Path $ProjectPath ".mcp.json"',
    '$Server = @{',
    '  command = "node"',
    '  args = @("extensions/cocos-creator-38-mcp/stdio-server/index.js", "--port", "6801")',
    '  env = @{}',
    '}',
    '$Snippet = @{ mcpServers = @{ "cocos-creator-38-mcp" = $Server } } | ConvertTo-Json -Depth 8',
    'try {',
    '  if (Test-Path -LiteralPath $McpPath) {',
    '    $Json = Get-Content -Raw -LiteralPath $McpPath | ConvertFrom-Json',
    '    if (-not $Json.mcpServers) { $Json | Add-Member -MemberType NoteProperty -Name mcpServers -Value ([pscustomobject]@{}) }',
    '    $Json.mcpServers | Add-Member -MemberType NoteProperty -Name "cocos-creator-38-mcp" -Value ([pscustomobject]$Server) -Force',
    '    $Json | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $McpPath -Encoding UTF8',
    '    Write-Host "Updated $McpPath"',
    '  } else {',
    '    $Snippet | Set-Content -LiteralPath $McpPath -Encoding UTF8',
    '    Write-Host "Created $McpPath"',
    '  }',
    '} catch {',
    '  Write-Warning "Could not safely update .mcp.json. Add this snippet manually:"',
    '  Write-Host $Snippet',
    '}',
    '',
    'Write-Host "Installed Cocos MCP extension to $ExtensionTarget"',
    'Write-Host "Installed cocos38-dev skill to $SkillTarget"',
    'Write-Host "Next: open Cocos Creator, start/restart MCP, then verify /api/status and get_project_info."',
    '',
  ].join('\n');
  fs.writeFileSync(filePath, text, 'utf8');
}

function writeInstallSh(filePath) {
  var text = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    'PROJECT_PATH="$(pwd)"',
    'CODEX_HOME_VALUE="${CODEX_HOME:-$HOME/.codex}"',
    'FORCE=0',
    '',
    'while [[ $# -gt 0 ]]; do',
    '  case "$1" in',
    '    --project-path) PROJECT_PATH="$2"; shift 2 ;;',
    '    --codex-home) CODEX_HOME_VALUE="$2"; shift 2 ;;',
    '    --force) FORCE=1; shift ;;',
    '    *) echo "Unknown argument: $1" >&2; exit 2 ;;',
    '  esac',
    'done',
    '',
    'PACKAGE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
    'EXTENSION_SOURCE="$PACKAGE_ROOT/extensions/cocos-creator-38-mcp"',
    'SKILL_SOURCE="$PACKAGE_ROOT/skills/cocos38-dev"',
    'EXTENSION_TARGET="$PROJECT_PATH/extensions/cocos-creator-38-mcp"',
    'SKILL_TARGET="$CODEX_HOME_VALUE/skills/cocos38-dev"',
    '',
    'copy_install_tree() {',
    '  local source="$1"',
    '  local target="$2"',
    '  [[ -d "$source" ]] || { echo "Missing source: $source" >&2; exit 1; }',
    '  if [[ -e "$target" ]]; then',
    '    if [[ "$FORCE" != "1" ]]; then',
    '      echo "Target exists: $target. Re-run with --force to overwrite." >&2',
    '      exit 1',
    '    fi',
    '    local backup="$target.backup.$(date +%Y%m%d%H%M%S)"',
    '    mv "$target" "$backup"',
    '    echo "Backed up $target -> $backup"',
    '  fi',
    '  mkdir -p "$(dirname "$target")"',
    '  cp -R "$source" "$target"',
    '}',
    '',
    'copy_install_tree "$EXTENSION_SOURCE" "$EXTENSION_TARGET"',
    'copy_install_tree "$SKILL_SOURCE" "$SKILL_TARGET"',
    '',
    'MCP_PATH="$PROJECT_PATH/.mcp.json"',
    'SNIPPET=\'{"mcpServers":{"cocos-creator-38-mcp":{"command":"node","args":["extensions/cocos-creator-38-mcp/stdio-server/index.js","--port","6801"],"env":{}}}}\'',
    'if command -v node >/dev/null 2>&1; then',
    '  node - "$MCP_PATH" "$SNIPPET" <<\'NODE\'',
    'const fs = require("fs");',
    'const target = process.argv[2];',
    'const snippet = JSON.parse(process.argv[3]);',
    'let doc = {};',
    'if (fs.existsSync(target)) doc = JSON.parse(fs.readFileSync(target, "utf8"));',
    'doc.mcpServers = doc.mcpServers || {};',
    'doc.mcpServers["cocos-creator-38-mcp"] = snippet.mcpServers["cocos-creator-38-mcp"];',
    'fs.writeFileSync(target, JSON.stringify(doc, null, 2) + "\\n", "utf8");',
    'NODE',
    '  echo "Updated $MCP_PATH"',
    'else',
    '  echo "Node is not available; add this .mcp.json snippet manually:" >&2',
    '  echo "$SNIPPET"',
    'fi',
    '',
    'echo "Installed Cocos MCP extension to $EXTENSION_TARGET"',
    'echo "Installed cocos38-dev skill to $SKILL_TARGET"',
    'echo "Next: open Cocos Creator, start/restart MCP, then verify /api/status and get_project_info."',
    '',
  ].join('\n');
  fs.writeFileSync(filePath, text, 'utf8');
  try { fs.chmodSync(filePath, 0o755); } catch (e) {}
}

function zipDirectory(sourceDir, zipPath) {
  removeIfExists(zipPath);
  ensureDir(path.dirname(zipPath));
  if (process.platform === 'win32') {
    var ps = [
      '$ErrorActionPreference = "Stop";',
      'Add-Type -AssemblyName System.IO.Compression.FileSystem;',
      '[IO.Compression.ZipFile]::CreateFromDirectory(' + JSON.stringify(sourceDir) + ', ' + JSON.stringify(zipPath) + ', [IO.Compression.CompressionLevel]::Optimal, $false);',
    ].join(' ');
    childProcess.execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], { stdio: 'pipe' });
  } else {
    childProcess.execFileSync('zip', ['-qr', zipPath, '.'], { cwd: sourceDir, stdio: 'pipe' });
  }
}

function listZipEntries(zipPath) {
  try {
    if (process.platform === 'win32') {
      var ps = 'Add-Type -AssemblyName System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead(' + JSON.stringify(zipPath) + '); try { $z.Entries | ForEach-Object { $_.FullName } } finally { $z.Dispose() }';
      return childProcess.execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], { encoding: 'utf8' })
        .split(/\r?\n/).filter(Boolean);
    }
    return childProcess.execFileSync('unzip', ['-Z1', zipPath], { encoding: 'utf8' })
      .split(/\r?\n/).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function buildInstallPackage(args) {
  args = args || {};
  var projectRoot = getProjectRoot();
  var extensionRoot = path.resolve(__dirname, '..');
  var skillSource = getSkillSourcePath(args);
  var packageInfo = versionInfo.getVersionInfo({});
  var version = packageInfo.version || '0.0.0';
  var updatedAt = packageInfo.mcpToolsUpdatedAt || '';
  var outputRoot = path.resolve(projectRoot, args.outputDir || path.join('dist', 'mcp-packages'));
  var packageId = PACKAGE_NAME + '-' + version;
  var stagingRoot = path.join(outputRoot, packageId);
  var zipPath = path.join(outputRoot, packageId + '.zip');
  var warnings = [];

  if (!fileExists(extensionRoot)) throw new Error('MCP extension root not found: ' + extensionRoot);
  if (!fileExists(skillSource)) throw new Error('cocos38-dev skill root not found: ' + skillSource);

  var pollution = scanForbiddenTerms([extensionRoot, skillSource]);
  if (!pollution.ok) {
    return {
      ok: false,
      success: false,
      status: 'failed',
      reason: 'distribution_pollution_detected',
      offendingFiles: pollution.matches,
      termsChecked: pollution.termsChecked,
      outputPath: normalizeSlash(zipPath),
      warnings: warnings,
      errors: ['Project-specific terms were found in generic distribution inputs.'],
    };
  }

  removeIfExists(stagingRoot);
  ensureDir(stagingRoot);
  ensureDir(path.join(stagingRoot, 'extensions'));
  ensureDir(path.join(stagingRoot, 'skills'));

  var copiedExtension = copyTree(extensionRoot, path.join(stagingRoot, 'extensions', 'cocos-creator-38-mcp'));
  var copiedSkill = copyTree(skillSource, path.join(stagingRoot, 'skills', SKILL_NAME));

  var manifest = {
    name: PACKAGE_NAME,
    version: version,
    mcpToolsUpdatedAt: updatedAt,
    generatedAt: new Date().toISOString(),
    includes: {
      mcpExtension: 'extensions/cocos-creator-38-mcp',
      skill: 'skills/cocos38-dev',
    },
    installTargets: {
      extension: 'project/extensions/cocos-creator-38-mcp',
      skill: 'CODEX_HOME/skills/cocos38-dev',
    },
    verification: [
      'Open Cocos Creator and start or restart MCP.',
      'Check /api/status for this version.',
      'Call get_project_info and confirm MCP metadata.',
    ],
  };
  writeJson(path.join(stagingRoot, 'manifest.json'), manifest);
  writeReadme(path.join(stagingRoot, 'README.md'), manifest);
  writeInstallPs1(path.join(stagingRoot, 'install.ps1'));
  writeInstallSh(path.join(stagingRoot, 'install.sh'));

  var stagedPollution = scanForbiddenTerms([stagingRoot]);
  if (!stagedPollution.ok) {
    removeIfExists(stagingRoot);
    return {
      ok: false,
      success: false,
      status: 'failed',
      reason: 'staged_distribution_pollution_detected',
      offendingFiles: stagedPollution.matches,
      termsChecked: stagedPollution.termsChecked,
      outputPath: normalizeSlash(zipPath),
      warnings: warnings,
      errors: ['Project-specific terms were found in staged install package.'],
    };
  }

  zipDirectory(stagingRoot, zipPath);
  var zipEntries = listZipEntries(zipPath).map(normalizeSlash);
  var requiredEntries = ['manifest.json', 'README.md', 'install.ps1', 'install.sh'];
  var missingEntries = requiredEntries.filter(function (entry) {
    return zipEntries.indexOf(entry) < 0;
  });
  if (!zipEntries.some(function (entry) { return entry.indexOf('extensions/cocos-creator-38-mcp/') === 0; })) missingEntries.push('extensions/cocos-creator-38-mcp/');
  if (!zipEntries.some(function (entry) { return entry.indexOf('skills/cocos38-dev/') === 0; })) missingEntries.push('skills/cocos38-dev/');
  if (missingEntries.length) throw new Error('Install package zip missing required entries: ' + missingEntries.join(', '));

  var stat = fs.statSync(zipPath);
  return {
    ok: true,
    success: true,
    status: 'passed',
    name: PACKAGE_NAME,
    version: version,
    mcpToolsUpdatedAt: updatedAt,
    outputPath: normalizeSlash(zipPath),
    stagingPath: normalizeSlash(stagingRoot),
    includedFilesCount: copiedExtension.length + copiedSkill.length + 4,
    includedRoots: [
      'extensions/cocos-creator-38-mcp',
      'skills/cocos38-dev',
    ],
    zipSizeBytes: stat.size,
    zipEntriesCount: zipEntries.length,
    zipEntriesSample: zipEntries.slice(0, 20),
    pollutionScan: {
      ok: stagedPollution.ok,
      termsChecked: stagedPollution.termsChecked,
      matches: stagedPollution.matches,
    },
    warnings: warnings,
    errors: [],
  };
}

module.exports = {
  buildInstallPackage: buildInstallPackage,
  scanForbiddenTerms: scanForbiddenTerms,
  buildForbiddenTerms: buildForbiddenTerms,
};
