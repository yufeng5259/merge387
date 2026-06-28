param(
  [int]$Port = 6800,
  [ValidateSet("core", "shader", "complete", "dashboard-safe", "release-smoke", "cleanup", "scene-persistence", "automation-flow", "game-demo", "game-demo-preflight", "game-demo-ui", "game-demo-character", "game-demo-physics", "game-demo-vfx", "game-demo-animation", "game-demo-material-shader", "game-demo-prefab", "game-demo-scene-static", "game-demo-runtime", "game-demo-cleanup", "ui-animation", "assets-prefab", "operation-evidence", "reference-graph", "prefab-static-v2", "component-schema-preflight", "script-contract", "resource-fixture", "build-smoke", "asset-negative", "asset-extended-negative", "node-component-readback", "resource-binding-matrix", "texture-spriteframe-boundary", "atlas-boundary", "tilemap-boundary", "material-shader-boundary", "visual-effect-release-subset", "runtime-probe", "runtime-input", "runtime-physics-contact", "delivery-report", "generic-2d-showcase", "generic-2d-showcase-authoring", "generic-2d-showcase-live-authoring-readiness", "generic-2d-showcase-scene-live-authoring-readiness", "generic-2d-showcase-scene-live-authoring-proof", "generic-2d-showcase-prefab-live-authoring-readiness", "generic-2d-showcase-prefab-live-authoring-proof", "generic-2d-showcase-ui-script-live-authoring-readiness", "generic-2d-showcase-ui-script-live-authoring-proof", "generic-2d-showcase-visual-resource-live-authoring-readiness", "generic-2d-showcase-visual-resource-live-authoring-proof", "generic-2d-showcase-scene-prefab-authoring", "generic-2d-showcase-ui-script-authoring", "generic-2d-showcase-visual-resource-authoring", "2d-release-gate", "package-hygiene", "knowledge-domain-integration", "script-negative", "script-refresh-diagnostics", "script-import-bind-timing", "animation-negative", "animation-property-scope", "animation-track-readback", "component-matrix", "component-property-boundary", "ui-spec-negative", "ui-prefab-static-diff", "ui-complete-smoke", "scene-asset-negative", "font-audio-boundary", "vfx-particle-boundary", "physics-boundary", "unsupported-boundary")][string]$Mode = "core",
  [string]$TempDir = "db://assets/__mcp_regression__",
  [string]$ShaderTempDir = "db://assets/__mcp_shader_tests__",
  [string]$UiAnimationTempDir = "db://assets/__mcp_regression__/ui-animation",
  [string]$GameDemoRoot = "db://assets/__mcp_game_demo__",
  [string]$ReportDir = "temp/cocos-creator-38-mcp/reports",
  [string]$LatestCompleteReportPath = "temp/cocos-creator-38-mcp/reports/run-regression-complete-latest.json",
  [string]$SpriteFramePath = "db://internal/default_ui/default_sprite_splash.png/spriteFrame",
  [string]$BuildPlatform = "web-desktop",
  [string[]]$ShaderPresets = @(
    "sprite_circle_mask",
    "sprite_sweep_shine",
    "sprite_water_ripple",
    "sprite_wind_sway",
    "mesh_energy_shield",
    "mesh_noise_dissolve",
    "mesh_motion_vertex"
  ),
  [string]$ExpectedSceneScriptVersion = "2026-06-22-prefab-root-metadata-1",
  [switch]$KeepArtifacts,
  [switch]$NoRuntimeValidation,
  [switch]$NoScreenshot,
  [switch]$CleanupDryRun,
  [switch]$RunRealBuild,
  [switch]$BuildDebug,
  [switch]$NoBuildWait,
  [switch]$SkipBridgeHealth,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$BaseUrl = "http://127.0.0.1:$Port"
$Script:Failures = New-Object System.Collections.Generic.List[string]
$Script:CreatedNodeIds = New-Object System.Collections.Generic.List[string]
$Script:FatalPrecheck = $false
$Script:DashboardLaunchEvidence = $null

function Assert-NoCocosDialogs {
  param([Parameter(Mandatory = $true)][string]$Phase)

  $guardScript = Join-Path $PSScriptRoot "check-cocos-dialogs.ps1"
  if (-not (Test-Path $guardScript)) {
    Write-Host "[WARN] dialog guard script not found: $guardScript"
    return
  }

  $raw = & $guardScript -Json
  $result = $raw | ConvertFrom-Json
  if (-not $result.ok) {
    $dialogText = ($result.dialogs | ForEach-Object { "$($_.processId):$($_.title)" }) -join "; "
    $err = New-Object System.Exception("Cocos modal dialogs detected $Phase. Stop automation before continuing: $dialogText")
    $err.Data["FatalDialogGuard"] = $true
    throw $err
  }
}

function Show-DryRunPlan {
  Write-Host "Cocos MCP regression runner dry run"
  Write-Host "Base URL: $BaseUrl"
  Write-Host "Mode: $Mode"
  Write-Host "ReportDir: $ReportDir"
  if ($Mode -eq "core" -or $Mode -eq "complete") {
    Write-Host "[PLAN] core regression checks will run."
    Write-Host "[PLAN] TempDir: $TempDir"
  }
  if ($Mode -eq "release-smoke") {
    Write-Host "[PLAN] release-smoke regression:"
    Write-Host " - read-only bridge health, scene-script freshness, latest complete report, cleanup evidence, and fresh console baseline"
    Write-Host " - latestCompleteReportPath=$LatestCompleteReportPath"
    Write-Host " - reportPath=$ReportDir/run-regression-release-smoke-latest.json"
    Write-Host " - does not run complete and does not create/delete fixtures"
  }
  if ($Mode -eq "dashboard-safe") {
    Write-Host "[PLAN] dashboard-safe regression:"
    Write-Host " - accepts Dashboard launch flags as warning-only environment evidence"
    Write-Host " - verifies safe status/project/hierarchy/editor-state reads"
    Write-Host " - verifies guarded operation preflight/readback evidence"
    Write-Host " - verifies blocked open/close/switch operations are suppressed"
    Write-Host " - writes reportPath=$ReportDir/dashboard-safe.json"
  }
  if ($Mode -eq "shader" -or $Mode -eq "complete") {
    Write-Host "[PLAN] shader presets:"
    foreach ($preset in $ShaderPresets) {
      $reportPath = "$ReportDir/shader-$preset.json"
      $prefabPath = "$ShaderTempDir/prefabs/$preset.prefab"
      Write-Host " - preset=$preset prefabPath=$prefabPath reportPath=$reportPath autoCreateFixture=true validateRuntime=$(-not $NoRuntimeValidation.IsPresent) captureScreenshot=$(-not $NoScreenshot.IsPresent)"
    }
  }
  if ($Mode -eq "cleanup") {
    Write-Host "[PLAN] cleanup reserved MCP fixture roots:"
    Write-Host " - $TempDir"
    Write-Host " - $ShaderTempDir"
    Write-Host " - $GameDemoRoot"
    Write-Host " - db://assets/__mcp_negative__"
    Write-Host " - db://assets/Generic2DShowcase (reported as intentional-retain-only)"
    Write-Host " - db://assets/GenericInteractiveShowcase (reported as intentional-retain-only)"
    Write-Host "[PLAN] cleanupDryRun=$($CleanupDryRun.IsPresent)"
  }
  if ($Mode -eq "scene-persistence") {
    Write-Host "[PLAN] scene-persistence regression:"
    Write-Host " - creates and deletes a temporary scene node"
    Write-Host " - cleans missing/MCP residue"
    Write-Host " - silently saves current scene and verifies no visible residue remains"
  }
  if ($Mode -eq "ui-animation") {
    Write-Host "[PLAN] ui-animation regression:"
    Write-Host " - uiPrefabPath=$UiAnimationTempDir/GenericAnimatedPanel.prefab"
    Write-Host " - animationPath=$UiAnimationTempDir/GenericPanelMove.anim"
  }
  if ($Mode -eq "assets-prefab") {
    Write-Host "[PLAN] assets-prefab regression:"
    Write-Host " - assetPrefabPath=$TempDir/assets-prefab/SpriteFrameRoundtrip.prefab"
    Write-Host " - spriteFramePath=$SpriteFramePath"
  }
  if ($Mode -eq "operation-evidence" -or $Mode -eq "complete") {
    Write-Host "[PLAN] operation-evidence regression:"
    Write-Host " - verifies mutating tool operationEvidence timing and recent-console fields"
    Write-Host " - fixtureRoot=$TempDir/operation-evidence"
    Write-Host " - spriteFramePath=$SpriteFramePath"
    Write-Host " - skips build/menu/undo/redo/prefab open-close to remain dialog-safe"
  }
  if ($Mode -eq "reference-graph" -or $Mode -eq "complete") {
    Write-Host "[PLAN] reference-graph regression:"
    Write-Host " - validates inspect_reference_graph and validate_project_references without opening scenes/prefabs"
    Write-Host " - checks missing scripts, stale/wrong-type UUIDs, button events, script properties, and material/customMaterial references"
  }
  if ($Mode -eq "prefab-static-v2" -or $Mode -eq "complete") {
    Write-Host "[PLAN] prefab-static-v2 regression:"
    Write-Host " - validates validate_prefab_static_v2 without opening or switching prefab tabs"
    Write-Host " - checks node tree, components, UI controls, script/property bindings, Button events, and SpriteFrame/Material/AnimationClip/AudioClip/Font/Prefab references"
    Write-Host " - includes negative checks for missing expected nodes and stale/wrong-type UUID diagnostics"
  }
  if ($Mode -eq "build-smoke" -or $Mode -eq "complete") {
    Write-Host "[PLAN] build-smoke regression:"
    Write-Host " - validates build_project schema and report chain"
    Write-Host " - BuildPlatform=$BuildPlatform"
    Write-Host " - RunRealBuild=$($RunRealBuild.IsPresent)"
    Write-Host " - BuildDebug=$($BuildDebug.IsPresent)"
    Write-Host " - BuildWait=$(-not $NoBuildWait.IsPresent)"
    Write-Host " - real Cocos build is skipped unless -RunRealBuild is explicitly set"
  }
  if ($Mode -eq "asset-negative" -or $Mode -eq "complete") {
    Write-Host "[PLAN] asset-negative regression:"
    Write-Host " - verifies generic tools refuse hand-created .prefab/.scene/.fire/.meta assets"
    Write-Host " - verifies writable file guards reject outside-project and structured-output paths"
    Write-Host " - fixtureRoot=db://assets/__mcp_negative__ should remain absent after the run"
  }
  if ($Mode -eq "automation-flow") {
    Write-Host "[PLAN] automation-flow regression:"
    Write-Host " - preflights save/open/close dialog risk and requires blocked close/open evidence"
    Write-Host " - creates a UI panel, script, button event, prefab, static validation, then auto-cleans fixtures"
  }
  if ($Mode -eq "animation-property-scope" -or $Mode -eq "complete") {
    Write-Host "[PLAN] animation-property-scope regression:"
    Write-Host " - validates AnimationClip property support matrix without scene/prefab switching"
    Write-Host " - proves transform/position/rotation/scale/angle/opacity are the only supported track properties"
    Write-Host " - verifies color, SpriteFrame, material, and arbitrary UI component tracks return structured unsupported/partial"
  }
  if ($Mode -eq "visual-effect-release-subset" -or $Mode -eq "complete") {
    Write-Host "[PLAN] visual-effect-release-subset regression:"
    Write-Host " - validates release-supported Sprite material/effect presets and source preflight"
    Write-Host " - validates ParticleSystem2D supported property subset"
    Write-Host " - verifies mesh-only effects, runtime-only VFX proof, advanced modules, and shader property animation stay partial/unsupported"
  }
  if ($Mode -eq "unsupported-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] unsupported-boundary regression:"
    Write-Host " - verifies unsupported_capability_matrix covers Timeline/Cutscene, gameplay controllers, unsupported animation/material curves, Spine/IK, complex particles, protected asset edits, process lifecycle, and unsafe context switching"
    Write-Host " - verifies each row returns normalized unsupported shape and remains read-only/dialog-safe"
  }
  if ($Mode -eq "runtime-probe" -or $Mode -eq "complete") {
    Write-Host "[PLAN] runtime-probe regression:"
    Write-Host " - validates runtime_probe capabilities, safe preflight, time wait, and console baseline evidence"
    Write-Host " - verifies preview start/attach/stop/switch return dialog-free blocked/partial results instead of launching unsafe preview control"
    Write-Host " - composes validate_runtime_view with screenshot disabled for local static/runtime-view evidence"
    Write-Host " - verifies visual_validation_matrix standardizes screenshot, non-blank pixels, Canvas bounds, key node visibility, and unsupported/partial result shapes"
  }
  if ($Mode -eq "runtime-input" -or $Mode -eq "complete") {
    Write-Host "[PLAN] runtime-input regression:"
    Write-Host " - validates runtime_input capabilities, node/coordinate/handler preflight, and console baseline evidence"
    Write-Host " - verifies click/touch/keyboard runtime injection stays blocked until dialog-free runtime event injection is proven"
    Write-Host " - rejects unknown actions and invalid coordinates instead of reporting transport-only success"
  }
  if ($Mode -eq "runtime-physics-contact" -or $Mode -eq "complete") {
    Write-Host "[PLAN] runtime-physics-contact regression:"
    Write-Host " - validates runtime_physics_contact capabilities, physics node/schema preflight, and console baseline evidence"
    Write-Host " - verifies runtime contact probe/simulation stays blocked until dialog-free physics stepping and begin/end contact readback are proven"
    Write-Host " - rejects unknown actions and strict missing-body probes instead of reporting static collider setup as runtime contact success"
  }
  if ($Mode -eq "delivery-report" -or $Mode -eq "complete") {
    Write-Host "[PLAN] delivery-report regression:"
    Write-Host " - validates generate_delivery_report schema, temp report writes, latest report readback, release gate summary, and nextSuggestedFix"
    Write-Host " - verifies partial/blocked markers are carried without turning unsupported runtime proof into fake success"
    Write-Host " - rejects structured Cocos asset report paths and outside-project report paths"
  }
  if ($Mode -eq "generic-2d-showcase" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase regression:"
    Write-Host " - validates neutral Generic2DShowcase manifest, plan, runtime-boundary evidence, retained-artifact policy, and delivery report readback"
    Write-Host " - verifies no gameplay/business-specific terms are introduced"
    Write-Host " - rejects non-showcase roots and unknown actions"
  }
  if ($Mode -eq "generic-2d-showcase-authoring" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-authoring regression:"
    Write-Host " - validates retained Generic2DShowcase scene/prefab/UI/script/animation/material/VFX/resource-binding artifact plan"
    Write-Host " - composes Generic2DShowcase boundary, knowledge-domain integration, package hygiene, console, and delivery-report readback"
    Write-Host " - verifies live authoring stays blocked until dialog-free retained asset creation/runtime proof is implemented"
  }
  if ($Mode -eq "generic-2d-showcase-live-authoring-readiness" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-live-authoring-readiness regression:"
    Write-Host " - composes retained authoring slice, package hygiene, and release-gate boundary evidence"
    Write-Host " - returns blocked with explicit missing dialog-free live-authoring capability gaps"
    Write-Host " - verifies no protected Cocos assets are created or hand-edited from the readiness gate"
  }
  if ($Mode -eq "generic-2d-showcase-scene-live-authoring-readiness" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-scene-live-authoring-readiness regression:"
    Write-Host " - verifies retained scene create/save/static validation primitive surface and missing proof gaps"
    Write-Host " - returns blocked without creating/opening/switching retained .scene assets"
    Write-Host " - reports the next dialog-free manage_scene proof task"
  }
  if ($Mode -eq "generic-2d-showcase-scene-live-authoring-proof" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-scene-live-authoring-proof regression:"
    Write-Host " - validates the controlled retained scene proof harness and explicit safety gates"
    Write-Host " - proves preflight/report/prove-without-flags stay blocked without creating/opening/switching retained .scene assets"
    Write-Host " - verifies live proof requires confirmRetainedSceneMutation and a live Cocos Editor context"
  }
  if ($Mode -eq "generic-2d-showcase-prefab-live-authoring-readiness" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-prefab-live-authoring-readiness regression:"
    Write-Host " - verifies retained prefab create/save/static validation primitive surface and missing proof gaps"
    Write-Host " - returns blocked without creating/opening/switching retained .prefab assets"
    Write-Host " - reports the next dialog-free manage_prefab proof task"
  }
  if ($Mode -eq "generic-2d-showcase-prefab-live-authoring-proof" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-prefab-live-authoring-proof regression:"
    Write-Host " - validates the controlled retained prefab proof harness and explicit safety gates"
    Write-Host " - proves preflight/report/prove-without-flags stay blocked without creating/opening/switching retained .prefab assets"
    Write-Host " - verifies live proof requires confirmRetainedPrefabMutation and a live Cocos Editor context"
  }
  if ($Mode -eq "generic-2d-showcase-ui-script-live-authoring-readiness" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-ui-script-live-authoring-readiness regression:"
    Write-Host " - verifies retained UI/script create/import/bind/static validation primitive surface and missing proof gaps"
    Write-Host " - returns blocked without creating/importing/binding retained UI prefab or script assets"
    Write-Host " - reports the next dialog-free create_ui_from_spec/manage_script proof task"
  }
  if ($Mode -eq "generic-2d-showcase-ui-script-live-authoring-proof" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-ui-script-live-authoring-proof regression:"
    Write-Host " - validates the controlled retained UI/script proof harness and explicit safety gates"
    Write-Host " - proves preflight/report/prove-without-flags stay blocked without creating/importing/binding retained UI/script assets"
    Write-Host " - verifies live proof requires confirmRetainedUiScriptMutation and a live Cocos Editor context"
  }
  if ($Mode -eq "generic-2d-showcase-visual-resource-live-authoring-readiness" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-visual-resource-live-authoring-readiness regression:"
    Write-Host " - verifies retained animation/effect/material/VFX/TileMap primitive surface and missing proof gaps"
    Write-Host " - returns blocked without creating/importing/binding retained visual resources"
    Write-Host " - reports the next dialog-free visual-resource proof task"
  }
  if ($Mode -eq "generic-2d-showcase-visual-resource-live-authoring-proof" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-visual-resource-live-authoring-proof regression:"
    Write-Host " - validates the controlled retained visual/resource proof harness and explicit safety gates"
    Write-Host " - proves preflight/report/prove-without-flags stay blocked without creating/importing/binding retained visual resources"
    Write-Host " - verifies live proof requires confirmRetainedVisualResourceMutation and a live Cocos Editor context"
  }
  if ($Mode -eq "generic-2d-showcase-scene-prefab-authoring" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-scene-prefab-authoring regression:"
    Write-Host " - validates retained Generic2DShowcase minimal scene/prefab authoring slice: 2 scenes and 4 prefabs"
    Write-Host " - preflights existing retained artifacts when present and writes delivery-report evidence"
    Write-Host " - verifies live scene/prefab creation remains blocked until dialog-free create/save/static-reference proof exists"
  }
  if ($Mode -eq "generic-2d-showcase-ui-script-authoring" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-ui-script-authoring regression:"
    Write-Host " - validates retained Generic2DShowcase menu UI prefab spec and GenericShowcaseComponent script contract"
    Write-Host " - preflights UI resource map/static validation inputs and writes delivery-report evidence"
    Write-Host " - verifies live UI/script creation remains blocked until dialog-free create/import/bind/static proof exists"
  }
  if ($Mode -eq "generic-2d-showcase-visual-resource-authoring" -or $Mode -eq "complete") {
    Write-Host "[PLAN] generic-2d-showcase-visual-resource-authoring regression:"
    Write-Host " - validates retained Generic2DShowcase animation/material/VFX/TileMap visual-resource plan using supported static preflights"
    Write-Host " - uses existing db://assets/map TileMap evidence when available and writes delivery-report evidence"
    Write-Host " - verifies live visual-resource creation remains blocked until dialog-free create/import/bind/static proof exists"
  }
  if ($Mode -eq "2d-release-gate" -or $Mode -eq "complete") {
    Write-Host "[PLAN] 2d-release-gate regression:"
    Write-Host " - validates run_2d_release_gate capabilities, docs checks, Generic2DShowcase boundary, cleanup inventory, console baseline, delivery report write/readback, and first-failure/nextSuggestedFix"
    Write-Host " - returns blocked instead of fake pass until live complete regression and retained showcase runtime proof are available"
    Write-Host " - rejects unknown actions and unsafe report paths"
  }
  if ($Mode -eq "package-hygiene" -or $Mode -eq "complete") {
    Write-Host "[PLAN] package-hygiene regression:"
    Write-Host " - validates package_hygiene capabilities, extension distribution contents, forbidden temp/fixture artifacts, required release docs, compatibility docs, and release criteria"
    Write-Host " - writes project temp/ hygiene reports and verifies latest report readback"
    Write-Host " - rejects unknown actions, unsafe report paths, and extension paths outside the package"
  }
  if ($Mode -eq "knowledge-domain-integration" -or $Mode -eq "complete") {
    Write-Host "[PLAN] knowledge-domain-integration regression:"
    Write-Host " - validates Scene+Component, Asset+Prefab, Script+UI, Animation+Prefab, Material+Shader, and VFX+Resource integration boundaries"
    Write-Host " - composes Generic2DShowcase/package hygiene/console evidence and delivery-report readback without creating retained protected assets"
    Write-Host " - remains partial until all live Cocos Editor/runtime proof is available"
  }
  if ($Mode -like "game-demo*") {
    Write-Host "[PLAN] game-demo regression:"
    Write-Host " - mode=$Mode root=$GameDemoRoot"
    Write-Host " - integrated game-demo runs preflight/UI/character/physics/VFX/animation/material/prefab/scene/runtime phases"
    Write-Host " - submodes isolate one real production workflow while preserving dialog-free preflight and cleanup"
    Write-Host " - keepArtifacts=$($KeepArtifacts.IsPresent)"
  }
  if ($Mode -eq "asset-extended-negative" -or $Mode -eq "complete") {
    Write-Host "[PLAN] asset-extended-negative regression:"
    Write-Host " - creates neutral text fixtures under $TempDir/asset-extended-negative"
    Write-Host " - verifies create/update/copy/move/overwrite/refresh plus get_info/content readback"
    Write-Host " - verifies missing update, structured source/destination, non-assets path, and existing destination negatives"
  }
  if ($Mode -eq "node-component-readback" -or $Mode -eq "complete") {
    Write-Host "[PLAN] node-component-readback regression:"
    Write-Host " - creates a reserved neutral node tree and verifies hierarchy/detail readback"
    Write-Host " - verifies update_node rename/transform/size/anchor/rotation/scale/opacity/active/reparent/siblingIndex and duplicate_node stable UUID readback"
    Write-Host " - verifies manage_components add/update/remove/list on cc.Layout"
    Write-Host " - includes negative missing-node, deleted-target, circular reparent, duplicate self-parent, and unsupported-component checks"
  }
  if ($Mode -eq "resource-binding-matrix" -or $Mode -eq "complete") {
    Write-Host "[PLAN] resource-binding-matrix regression:"
    Write-Host " - creates neutral resource-binding fixtures under $TempDir/resource-binding-matrix"
    Write-Host " - verifies SpriteFrame, Material, AnimationClip, and Prefab asset readback"
    Write-Host " - records Atlas/Skeleton partial support and missing-asset negative cases"
  }
  if ($Mode -eq "texture-spriteframe-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] texture-spriteframe-boundary regression:"
    Write-Host " - creates a neutral PNG texture under $TempDir/texture-spriteframe-boundary with spaces and non-ASCII characters in the path"
    Write-Host " - verifies AssetDB refresh, texture get_info/subAssets, list path preservation, SpriteFrame binding by path/uuid, and node-detail readback"
    Write-Host " - verifies missing node/path, node without Sprite, missing get_info input, and unsafe refresh negatives"
  }
  if ($Mode -eq "atlas-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] atlas-boundary regression:"
    Write-Host " - creates a neutral TexturePacker-style atlas plist plus sibling PNG under $TempDir/atlas-boundary"
    Write-Host " - verifies atlas list/inspect/frame parsing, SpriteFrame resolve, Editor binding readback when AssetDB subasset UUID exists, and static fallback otherwise"
    Write-Host " - verifies missing atlas/frame and unsafe root negatives, then cleans the reserved fixture root"
  }
  if ($Mode -eq "tilemap-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] tilemap-boundary regression:"
    Write-Host " - prefers existing project TileMap asset db://assets/map/map.tmx when present, otherwise creates a neutral TMX/TSX/PNG fixture under $TempDir/tilemap-boundary"
    Write-Host " - verifies TileMap list/inspect dimensions, tile size, layers, tilesets, image references, and static reference validation"
    Write-Host " - records runtime TiledMap node binding as partial until Editor readback is proven; verifies missing map/tileset and unsafe root negatives"
  }
  if ($Mode -eq "material-shader-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] material-shader-boundary regression:"
    Write-Host " - creates neutral effect/material fixtures under $TempDir/material-shader-boundary"
    Write-Host " - verifies effect property parsing, material property set/readback, Sprite and MeshRenderer assignment"
    Write-Host " - verifies unsupported preset plus missing effect/property/material/node/renderer negatives"
  }
  if ($Mode -eq "vfx-particle-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] vfx-particle-boundary regression:"
    Write-Host " - creates neutral ParticleSystem2D plist/texture fixtures under $TempDir/vfx-particle-boundary"
    Write-Host " - verifies plist get_info/list, file binding, SpriteFrame sync, ParticleSystem2D property readback, play/stop/reset"
    Write-Host " - verifies structured unsupported for advanced particle modules plus missing path/node/asset/component negatives"
  }
  if ($Mode -eq "physics-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] physics-boundary regression:"
    Write-Host " - verifies read-only physics_readback_matrix coverage for offset, size, radius, group, sensor, numeric/type boundaries"
    Write-Host " - creates neutral RigidBody2D/BoxCollider2D/CircleCollider2D scene fixtures"
    Write-Host " - verifies component schema, component/list readback, operation evidence, and cleanup"
    Write-Host " - verifies missing node, unsupported shape/component, and invalid property negatives"
  }
  if ($Mode -eq "script-refresh-diagnostics" -or $Mode -eq "complete") {
    Write-Host "[PLAN] script-refresh-diagnostics regression:"
    Write-Host " - creates one valid neutral Cocos TypeScript script under $TempDir/script-refresh-diagnostics"
    Write-Host " - verifies create/read/refresh/get_info/validate/property-inspection before and after write"
    Write-Host " - validates invalid script sources content-only and verifies they are never imported as assets"
    Write-Host " - verifies missing path, structured asset, missing script, and diagnostics negative cases"
  }
  if ($Mode -eq "script-import-bind-timing" -or $Mode -eq "complete") {
    Write-Host "[PLAN] script-import-bind-timing regression:"
    Write-Host " - imports one valid neutral Cocos TypeScript component script under $TempDir/script-import-bind-timing"
    Write-Host " - refreshes AssetDB, polls for component class registration, then binds it to a temporary node when ready"
    Write-Host " - verifies component list/update and Node property binding readback, or records structured partial if compiler readiness cannot be detected"
    Write-Host " - never imports intentionally invalid scripts; invalid/missing class coverage stays negative-only"
  }
  if ($Mode -eq "script-negative" -or $Mode -eq "complete") {
    Write-Host "[PLAN] script-negative regression:"
    Write-Host " - validates invalid TypeScript, legacy cc.Class, missing export, and missing @ccclass by content only"
    Write-Host " - keeps all script source validation content-only; no script assets are imported"
    Write-Host " - verifies property inspection plus missing script/class negative cases with only temporary scene nodes"
  }
  if ($Mode -eq "script-contract" -or $Mode -eq "complete") {
    Write-Host "[PLAN] script-contract regression:"
    Write-Host " - validates validate_script_contract static Cocos component contracts without importing invalid scripts"
    Write-Host " - checks syntax, @ccclass, exported Component inheritance, expected class, and expected @property declarations"
    Write-Host " - verifies manage_script create rejects invalid contracts before AssetDB import/write"
  }
  if ($Mode -eq "resource-fixture" -or $Mode -eq "complete") {
    Write-Host "[PLAN] resource-fixture regression:"
    Write-Host " - creates neutral texture, SpriteFrame, font, audio, atlas, tilemap, and VFX fixtures under $TempDir/resource-fixtures"
    Write-Host " - verifies list/get_info/static readback, rejects unsupported kinds/non-reserved roots, then cleans the reserved root"
  }
  if ($Mode -eq "animation-negative" -or $Mode -eq "complete") {
    Write-Host "[PLAN] animation-negative regression:"
    Write-Host " - verifies missing node, missing target path, empty clip, empty tracks, unsupported property, and missing asset failures"
    Write-Host " - keeps failures before AnimationClip asset creation; only a temporary scene node is created"
    Write-Host " - fixtureRoot=$TempDir/animation-negative should remain absent after cleanup"
  }
  if ($Mode -eq "animation-track-readback" -or $Mode -eq "complete") {
    Write-Host "[PLAN] animation-track-readback regression:"
    Write-Host " - creates a neutral runtime AnimationClip fixture with position, scale, and opacity tracks"
    Write-Host " - verifies static inspect_tracks readback for target paths, properties, channels, and keyframes"
    Write-Host " - verifies strict malformed-track diagnostics for broken refs, missing bindings, and missing curves"
    Write-Host " - verifies color, SpriteFrame, and material track requests return structured unsupported status"
    Write-Host " - fixtureRoot=$TempDir/animation-track-readback and temporary scene nodes are cleaned up"
  }
  if ($Mode -eq "component-matrix" -or $Mode -eq "complete") {
    Write-Host "[PLAN] component-matrix regression:"
    Write-Host " - creates reserved neutral nodes for Sprite, Label, Button, Layout, RigidBody2D, and BoxCollider2D"
    Write-Host " - verifies component list/detail readback and missing-node/component/physics negatives"
    Write-Host " - all nodes use __mcp_regression_component_* names and are deleted before completion"
  }
  if ($Mode -eq "component-property-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] component-property-boundary regression:"
    Write-Host " - verifies Label/Sprite/Button/Layout/UITransform property readback boundaries"
    Write-Host " - verifies missing component, missing SpriteFrame, invalid grid columns/spacing/cellSize, and missing-node negatives"
    Write-Host " - fixtureRoot=$TempDir/component-property-boundary and __mcp_regression_component_boundary_* nodes are cleaned up"
  }
  if ($Mode -eq "component-schema-preflight" -or $Mode -eq "complete") {
    Write-Host "[PLAN] component-schema-preflight regression:"
    Write-Host " - validates validate_component_properties without scene mutation"
    Write-Host " - covers supported fields, aliases, wrong types, enum/range boundaries, readonly fields, and vector/size shapes"
  }
  if ($Mode -eq "ui-spec-negative" -or $Mode -eq "complete") {
    Write-Host "[PLAN] ui-spec-negative regression:"
    Write-Host " - validates bad specs, unsafe prefab paths, unsupported node types, invalid grid settings, and missing export sources"
    Write-Host " - verifies missing/malformed resource references are diagnosed without opening prefabs and minimal neutral UI export works"
    Write-Host " - fixtureRoot=$TempDir/ui-spec-negative and __mcp_regression_ui_spec_* nodes are cleaned up"
  }
  if ($Mode -eq "ui-prefab-static-diff" -or $Mode -eq "complete") {
    Write-Host "[PLAN] ui-prefab-static-diff regression:"
    Write-Host " - creates a neutral UI prefab from spec without opening/switching prefab tabs"
    Write-Host " - statically diffs deep prefab node tree, components, nested layout, label text, color, size, SpriteFrame UUIDs, and child structure against the spec"
    Write-Host " - verifies missing prefab, mismatched label text, mismatched SpriteFrame UUID, missing child, deep grid spacing mismatch, and duplicate sibling-name negatives"
    Write-Host " - fixtureRoot=$TempDir/ui-prefab-static-diff is cleaned up"
  }
  if ($Mode -eq "ui-complete-smoke" -or $Mode -eq "complete") {
    Write-Host "[PLAN] ui-complete-smoke regression:"
    Write-Host " - validates a larger neutral UI resource map, creates a prefab silently, and statically diffs the result"
    Write-Host " - covers nested panels, grids, labels, buttons, SpriteFrame UUID evidence, and a nested button-label mismatch negative"
    Write-Host " - fixtureRoot=$TempDir/ui-complete-smoke is cleaned up without opening prefab tabs"
  }
  if ($Mode -eq "scene-asset-negative" -or $Mode -eq "complete") {
    Write-Host "[PLAN] scene-asset-negative regression:"
    Write-Host " - creates .scene assets through AssetDB/template without switching the current editor scene"
    Write-Host " - verifies static scene structure, get_info/list, duplicate/rename/move/delete, and blocked open navigation"
    Write-Host " - fixtureRoot=$TempDir/scene-asset-negative is cleaned up"
  }
  if ($Mode -eq "font-audio-boundary" -or $Mode -eq "complete") {
    Write-Host "[PLAN] font-audio-boundary regression:"
    Write-Host " - creates neutral Font and AudioClip fixtures under $TempDir/font-audio-boundary"
    Write-Host " - verifies Font/AudioClip script property bind-kind inference, positive Label/AudioSource binding readback in Editor, and static fallback outside Editor"
    Write-Host " - verifies missing asset/component negatives, then deletes temporary __mcp_regression_font_audio_* scene nodes and resource fixtures"
  }
  Write-Host "[PLAN] bridge health precheck=$(-not $SkipBridgeHealth.IsPresent) expectedSceneScriptVersion=$ExpectedSceneScriptVersion"
}
function Invoke-McpTool {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [hashtable]$Arguments = @{}
  )

  $body = @{ name = $Name; arguments = $Arguments } | ConvertTo-Json -Depth 30
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/tool" -Method Post -ContentType "application/json" -Body $body
  if ($response.error) {
    throw $response.error
  }
  return $response.result
}

function Invoke-McpRaw {
  param([Parameter(Mandatory = $true)][string]$Path)
  return Invoke-RestMethod -Uri "$BaseUrl$Path" -Method Get
}

function Add-Check {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][scriptblock]$Body
  )

  Write-Host "[RUN] $Name"
  try {
    Assert-NoCocosDialogs "before $Name"
    & $Body | Out-Null
    Assert-NoCocosDialogs "after $Name"
    Write-Host "[PASS] $Name"
  } catch {
    $message = "${Name}: $($_.Exception.Message)"
    $Script:Failures.Add($message)
    Write-Host "[FAIL] $message"
    if ($_.Exception.Data -and $_.Exception.Data["FatalRegressionPrecheck"]) { $Script:FatalPrecheck = $true }
    if ($_.Exception.Data -and $_.Exception.Data["FatalDialogGuard"]) { throw }
  }
}

function Get-FirstUuid {
  param([Parameter(Mandatory = $true)]$Result)
  if ($Result.uuid) { return $Result.uuid }
  if ($Result.id) { return $Result.id }
  if ($Result.nodeId) { return $Result.nodeId }
  if ($Result.node -and $Result.node.uuid) { return $Result.node.uuid }
  if ($Result.node -and $Result.node.id) { return $Result.node.id }
  if ($Result.created -and $Result.created.uuid) { return $Result.created.uuid }
  if ($Result.created -and $Result.created.id) { return $Result.created.id }
  if ($Result.result -and $Result.result.uuid) { return $Result.result.uuid }
  throw "Cannot find node uuid in result: $($Result | ConvertTo-Json -Depth 10)"
}

function New-TempNode {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [string]$Type = "empty",
    [hashtable]$Properties = @{}
  )

  $result = Invoke-McpTool "create_node" @{ name = $Name; type = $Type; properties = $Properties }
  $id = Get-FirstUuid $result
  $Script:CreatedNodeIds.Add($id)
  return $id
}

function Remove-NodeQuietly {
  param([Parameter(Mandatory = $true)][string]$Id)
  try {
    Invoke-McpTool "delete_node" @{ id = $Id; silent = $true; missingOk = $true } | Out-Null
  } catch {
    Write-Host "[WARN] cleanup node failed: $Id - $($_.Exception.Message)"
  }
}

function Remove-AssetQuietly {
  param([Parameter(Mandatory = $true)][string]$Path)
  try {
    Invoke-McpTool "manage_asset" @{ action = "delete"; path = $Path; silent = $true; missingOk = $true } | Out-Null
  } catch {
    Write-Host "[WARN] cleanup asset failed: $Path - $($_.Exception.Message)"
  }
}

function Remove-MissingNodesQuietly {
  $deletedAny = $false
  try {
    $hierarchy = Invoke-McpTool "get_scene_hierarchy"
    $stack = New-Object System.Collections.Generic.List[object]
    $stack.Add($hierarchy)
    while ($stack.Count -gt 0) {
      $node = $stack[$stack.Count - 1]
      $stack.RemoveAt($stack.Count - 1)
      if ($node.name -eq "(Missing Node)" -and $node.uuid) {
        Remove-NodeQuietly $node.uuid
        $deletedAny = $true
      }
      if ($node.children) {
        foreach ($child in $node.children) {
          $stack.Add($child)
        }
      }
    }
  } catch {
    Write-Host "[WARN] cleanup missing nodes failed: $($_.Exception.Message)"
  }
  return $deletedAny
}

function Remove-ReservedMcpNodesQuietly {
  $deletedAny = $false
  try {
    $hierarchy = Invoke-McpTool "get_scene_hierarchy" @{ depth = 30 }
    $stack = New-Object System.Collections.Generic.List[object]
    $stack.Add($hierarchy)
    while ($stack.Count -gt 0) {
      $node = $stack[$stack.Count - 1]
      $stack.RemoveAt($stack.Count - 1)
      if ($node.name -and $node.name -like "__mcp_*" -and $node.uuid) {
        Remove-NodeQuietly $node.uuid
        $deletedAny = $true
        continue
      }
      if ($node.children) {
        foreach ($child in $node.children) {
          $stack.Add($child)
        }
      }
    }
  } catch {
    Write-Host "[WARN] cleanup reserved MCP nodes failed: $($_.Exception.Message)"
  }
  return $deletedAny
}

function Save-SceneQuietly {
  param([string]$Reason = "post-cleanup")
  try {
    $save = Invoke-McpTool "manage_scene" @{ action = "save_silent"; sinceTs = [DateTimeOffset]::Now.ToUnixTimeMilliseconds(); readConsole = $true }
    if ($save -and $save.ok -ne $false) {
      Write-Host "[PASS] Scene persisted after $Reason"
    } else {
      Write-Host "[WARN] scene save after $Reason returned non-ok result: $($save | ConvertTo-Json -Depth 20)"
    }
  } catch {
    Write-Host "[WARN] scene save after $Reason failed: $($_.Exception.Message)"
  }
}

function Get-CocosLaunchFlagEvidence {
  param([Parameter(Mandatory = $true)][string]$Phase)

  $dashboardProcesses = @(Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "CocosCreator.exe" -and
    $_.CommandLine -like "*--project*" -and
    $_.CommandLine -like "*$PWD*" -and
    $_.CommandLine -match "--can-show-upgrade-dialog\s+true"
  } | ForEach-Object {
    [pscustomobject]@{
      processId = $_.ProcessId
      commandLine = $_.CommandLine
    }
  })

  $evidence = [pscustomobject]@{
    phase = $Phase
    observedFlag = "--can-show-upgrade-dialog true"
    dashboardLaunchAccepted = $true
    globalDialogFlagIsStandaloneFailure = $false
    warningCount = $dashboardProcesses.Count
    policy = "warning_only"
    reason = "Cocos Dashboard may add this flag during normal startup; regression failure is based on operation-level dialog guards, fresh console evidence, and dirty-state readback."
    findings = $dashboardProcesses
  }
  if ($dashboardProcesses.Count -gt 0) {
    Write-Host "[WARN] Dashboard launch flag observed $Phase; continuing because operation-level dialog guards remain authoritative."
    foreach ($process in $dashboardProcesses) {
      Write-Host "[WARN] CocosCreator.exe $($process.processId): $($process.commandLine)"
    }
  }
  $Script:DashboardLaunchEvidence = $evidence
  return $evidence
}

function Get-SceneNameSnapshot {
  param([object]$Scene)

  $names = New-Object System.Collections.Generic.List[string]
  function Add-SceneNodeName {
    param([object]$Node, [System.Collections.Generic.List[string]]$Names)
    if ($null -eq $Node) { return }
    $Names.Add([string]$Node.name)
    foreach ($child in @($Node.children)) {
      Add-SceneNodeName $child $Names
    }
  }

  Add-SceneNodeName $Scene $names
  return @($names)
}

function Get-ConsoleErrorBuckets {
  param([object[]]$ConsoleEntries)

  $bridgeLog = @($ConsoleEntries | Where-Object {
    ([string]$_.message -like "*HTTP bridge started*") -or ([string]$_.msg -like "*HTTP bridge started*")
  } | Select-Object -Last 1)[0]
  $bridgeTs = 0
  if ($bridgeLog -and $bridgeLog.ts) {
    $bridgeTs = [int64]$bridgeLog.ts
  }
  $allErrors = @($ConsoleEntries | Where-Object { $_.level -eq "error" })
  $postBridgeErrors = @($allErrors | Where-Object { [int64]$_.ts -ge $bridgeTs })

  return [pscustomobject]@{
    bridgeTs = $bridgeTs
    bridgeMessage = if ($bridgeLog) { $bridgeLog.message } else { $null }
    startupErrors = $allErrors
    postBridgeErrors = $postBridgeErrors
  }
}

function Assert-BridgeTools {
  param([string[]]$RequiredTools)
  $status = Invoke-McpRaw "/api/status"
  $available = @($status.tools)
  $missing = @()
  foreach ($tool in $RequiredTools) {
    if ($available -notcontains $tool) { $missing += $tool }
  }
  if ($missing.Count -gt 0) {
    $err = New-Object System.Exception("MCP bridge is running but missing required tools: $($missing -join ', '). Reload/restart the Cocos extension or bridge so it picks up the latest plugin files. Current toolCount=$($available.Count).")
    $err.Data["FatalRegressionPrecheck"] = $true
    throw $err
  }
}

function Assert-BridgeHealth {
  if ($SkipBridgeHealth) {
    Write-Host "[WARN] Bridge health precheck skipped by -SkipBridgeHealth"
    return
  }

  $healthStartedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  Assert-NoCocosDialogs "before bridge health precheck"
  $health = Invoke-McpTool "get_bridge_health" @{
    expectedSceneScriptVersion = $ExpectedSceneScriptVersion
    includeTools = $false
    includeRecentErrors = $true
    errorLimit = 5
    sinceTs = $healthStartedAt
  }
  Assert-NoCocosDialogs "after bridge health precheck"
  if (-not $health.ok) {
    $queueBusyChecks = @($health.checks | Where-Object {
      $_.name -eq "queue_idle" -and -not $_.ok -and $_.details -and $_.details.length -eq 0 -and $_.details.processing -eq $true
    })
    if ($queueBusyChecks.Count -gt 0) {
      Write-Host "[WARN] Bridge health queue is transiently processing with empty queue; waiting briefly before retrying health."
      Start-Sleep -Seconds 12
      $health = Invoke-McpTool "get_bridge_health" @{
        expectedSceneScriptVersion = $ExpectedSceneScriptVersion
        includeTools = $false
        includeRecentErrors = $true
        errorLimit = 5
        sinceTs = $healthStartedAt
      }
    }
  }

  if (-not $health.ok) {
    $failedNonRecentChecks = @($health.checks | Where-Object { -not $_.ok -and $_.name -ne "recent_errors" })
    $recentErrorChecks = @($health.checks | Where-Object { $_.name -eq "recent_errors" -and -not $_.ok })
    $recentErrorJson = ($recentErrorChecks | ConvertTo-Json -Depth 12 -Compress)
    if ($failedNonRecentChecks.Count -eq 0 -and $recentErrorJson -match "No scene loaded|Scene operation timeout: get-hierarchy") {
      $probe = $null
      try {
        $probe = Invoke-McpTool "get_scene_hierarchy" @{ depth = 1 }
      } catch {}
      if ($probe -and $probe.name) {
        Write-Host "[WARN] Bridge health recent_errors only contains stale scene recovery probe errors; current scene hierarchy is available, so continuing."
        $health.ok = $true
        $health.status = "ok"
      }
    }
  }

  if (-not $health.ok) {
    $failedChecks = @($health.checks | Where-Object { -not $_.ok } | ForEach-Object {
      "$($_.name)=$($_.details | ConvertTo-Json -Depth 8 -Compress)"
    })
    $err = New-Object System.Exception("Bridge health precheck failed: $($failedChecks -join '; ')")
    $err.Data["FatalRegressionPrecheck"] = $true
    throw $err
  }

  Write-Host "[PASS] Bridge health: tools=$($health.toolCount), sceneScript=$($health.sceneScript.actualVersion), queueLength=$($health.queue.length)"
}

function Test-Startup {
  Add-Check "HTTP status and startup checks" {
    $status = Invoke-McpRaw "/api/status"
    if ($null -eq $status) { throw "empty /api/status response" }
    $info = Invoke-McpTool "get_project_info"
    if (-not $info.path) { throw "get_project_info did not return project path" }
    if (-not $info.version) { throw "get_project_info did not return Cocos version" }
    $state = Invoke-McpTool "get_editor_state"
    if ($state.current -and $state.current.ok -eq $false -and -not $state.current.uuid -and -not $state.current.url) {
      $openDefault = Invoke-McpTool "manage_scene" @{ action = "open"; path = "db://assets/scene.scene" }
      if (-not ($openDefault.ok -or $openDefault.opened)) {
        throw "No scene is loaded and default scene could not be opened safely: $($openDefault | ConvertTo-Json -Depth 20)"
      }
      Start-Sleep -Seconds 5
    }
    $hierarchy = Invoke-McpTool "get_scene_hierarchy"
    if (-not $hierarchy.name) { throw "get_scene_hierarchy did not return scene root" }
  }
}

function Invoke-DashboardSafeRegression {
  $reportPath = "$ReportDir/dashboard-safe.json"
  $startedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  $status = $null
  $projectInfo = $null
  $hierarchy = $null
  $editorStateBefore = $null
  $guardedPreflight = $null
  $blockedOpen = $null
  $blockedCloseScene = $null
  $health = $null
  $editorStateAfter = $null
  $evidence = [ordered]@{}

  Add-Check "Dashboard-safe operation-level dialog evidence" {
    $status = Invoke-McpRaw "/api/status"
    $evidence.status = $status
    if ($null -eq $status) { throw "empty /api/status response" }
    $projectInfo = Invoke-McpTool "get_project_info"
    $evidence.projectInfo = $projectInfo
    if (-not $projectInfo.path) { throw "get_project_info did not return project path" }
    $hierarchy = Invoke-McpTool "get_scene_hierarchy" @{ depth = 1 }
    $evidence.hierarchy = $hierarchy
    if (-not $hierarchy.name) { throw "get_scene_hierarchy did not return scene root" }
    $editorStateBefore = Invoke-McpTool "get_editor_state"
    $evidence.editorStateBefore = $editorStateBefore
    if (-not $editorStateBefore.automation) { throw "get_editor_state did not return automation dialog policy evidence" }

    $guardedPreflight = Invoke-McpTool "ensure_no_dialog_risk" @{
      operation = "open_scene"
      path = $editorStateBefore.currentAsset.url
      sinceTs = $startedAt
      readConsole = $true
    }
    $evidence.guardedPreflight = $guardedPreflight
    if (-not $guardedPreflight) { throw "ensure_no_dialog_risk open_scene returned empty result" }
    if ($guardedPreflight.interactivePromptSuppressed -eq $true -and $editorStateBefore.currentAsset.dirty -eq $false) {
      throw "clean current scene open preflight was suppressed unexpectedly: $($guardedPreflight | ConvertTo-Json -Depth 20)"
    }

    $blockedOpen = Invoke-McpTool "ensure_no_dialog_risk" @{
      operation = "open_prefab"
      path = "db://assets/__mcp_regression__/dashboard-safe/BlockedOpen.prefab"
      sinceTs = $startedAt
      readConsole = $true
    }
    $evidence.blockedOpen = $blockedOpen
    if (-not ($blockedOpen.interactivePromptSuppressed -eq $true -or $blockedOpen.blocked -eq $true -or $blockedOpen.status -eq "blocked")) {
      throw "open_prefab preflight should return blocked/suppressed evidence, got: $($blockedOpen | ConvertTo-Json -Depth 20)"
    }

    $blockedCloseScene = Invoke-McpTool "ensure_no_dialog_risk" @{
      operation = "close_scene"
      path = $editorStateBefore.currentAsset.url
      sinceTs = $startedAt
      readConsole = $true
    }
    $evidence.blockedCloseScene = $blockedCloseScene
    if (-not ($blockedCloseScene.interactivePromptSuppressed -eq $true -or $blockedCloseScene.blocked -eq $true -or $blockedCloseScene.status -eq "blocked")) {
      throw "close_scene preflight should return blocked/suppressed evidence, got: $($blockedCloseScene | ConvertTo-Json -Depth 20)"
    }

    $health = Invoke-McpTool "get_bridge_health" @{
      expectedSceneScriptVersion = $ExpectedSceneScriptVersion
      includeTools = $false
      includeRecentErrors = $true
      errorLimit = 10
      sinceTs = $startedAt
    }
    $evidence.bridgeHealth = $health
    if (-not $health.ok) { throw "get_bridge_health failed after dashboard-safe checks: $($health | ConvertTo-Json -Depth 20)" }
    $editorStateAfter = Invoke-McpTool "get_editor_state"
    $evidence.editorStateAfter = $editorStateAfter
    if ($editorStateAfter.currentAsset.dirty -eq $true) { throw "dashboard-safe regression left editor dirty" }
  }

  $status = $evidence.status
  $projectInfo = $evidence.projectInfo
  $hierarchy = $evidence.hierarchy
  $editorStateBefore = $evidence.editorStateBefore
  $guardedPreflight = $evidence.guardedPreflight
  $blockedOpen = $evidence.blockedOpen
  $blockedCloseScene = $evidence.blockedCloseScene
  $health = $evidence.bridgeHealth
  $editorStateAfter = $evidence.editorStateAfter

  $summary = [pscustomobject]@{
    dashboardLaunchAccepted = $true
    globalDialogFlagIsStandaloneFailure = $false
    safeOperationsPassed = [bool]($status -and $projectInfo.path -and $hierarchy.name -and $editorStateBefore.automation)
    guardedOperationsPassed = [bool]($guardedPreflight -and $guardedPreflight.ok -ne $false)
    blockedOperationsSuppressed = [bool](
      ($blockedOpen.interactivePromptSuppressed -eq $true -or $blockedOpen.blocked -eq $true -or $blockedOpen.status -eq "blocked") -and
      ($blockedCloseScene.interactivePromptSuppressed -eq $true -or $blockedCloseScene.blocked -eq $true -or $blockedCloseScene.status -eq "blocked")
    )
    freshConsoleErrors = @($health.freshConsoleErrors).Count
    freshConsoleWarnings = @($health.freshConsoleWarnings).Count
    dirtyAfter = [bool]($editorStateAfter.currentAsset.dirty -eq $true)
  }
  $report = [pscustomobject]@{
    ok = $summary.safeOperationsPassed -and $summary.guardedOperationsPassed -and $summary.blockedOperationsSuppressed -and $summary.freshConsoleErrors -eq 0 -and $summary.freshConsoleWarnings -eq 0 -and -not $summary.dirtyAfter
    mode = "dashboard-safe"
    startedAt = $startedAt
    reportPath = $reportPath
    dashboardLaunch = $Script:DashboardLaunchEvidence
    summary = $summary
    evidence = $evidence
  }
  $reportText = $report | ConvertTo-Json -Depth 60
  New-Item -ItemType Directory -Force -Path (Split-Path $reportPath) | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $PWD $reportPath), $reportText, [System.Text.UTF8Encoding]::new($false))
  if (-not $report.ok) { throw "dashboard-safe regression failed: $reportText" }
  Write-Host "[REPORT] $reportPath"
}

function Invoke-CoreRegression {
  Test-Startup

  Add-Check "R1 asset directory and SpriteFrame binding" {
    Invoke-McpTool "manage_asset" @{ action = "create"; path = $TempDir; type = "directory" } | Out-Null
    $nodeId = New-TempNode "__mcp_regression_sprite_path__" "sprite" @{ width = 120; height = 80 }
    Invoke-McpTool "manage_texture" @{ action = "set_sprite_frame"; nodeId = $nodeId; path = $SpriteFramePath } | Out-Null
    $detail = Invoke-McpTool "get_node_detail" @{ id = $nodeId; includeComponents = $true }
    $detailText = $detail | ConvertTo-Json -Depth 30
    if ($detailText -notmatch "@f9941") { throw "SpriteFrame subasset uuid was not assigned" }
    Remove-NodeQuietly $nodeId
  }

  Add-Check "R4 button serialization smoke" {
    $buttonId = New-TempNode "__mcp_regression_button__" "button" @{ text = "Click"; fontSize = 24; width = 180; height = 70 }
    Invoke-McpTool "manage_texture" @{ action = "set_sprite_frame"; nodeId = $buttonId; path = $SpriteFramePath } | Out-Null
    $prefabPath = "$TempDir/button.prefab"
    Invoke-McpTool "manage_prefab" @{ action = "create"; path = $prefabPath; nodeId = $buttonId } | Out-Null
    Invoke-McpTool "prefab_validate" @{ path = $prefabPath } | Out-Null
    $openResult = Invoke-McpTool "manage_prefab" @{ action = "open"; path = $prefabPath }
    if (-not $openResult.interactivePromptSuppressed) { throw "manage_prefab(open) should be suppressed in unattended regression mode" }
    $closeResult = Invoke-McpTool "manage_prefab" @{ action = "close"; path = $prefabPath }
    if (-not $closeResult.interactivePromptSuppressed) { throw "manage_prefab(close) should be suppressed in unattended regression mode" }
    Remove-NodeQuietly $buttonId
  }

  Add-Check "R5 unresolved variable guard" {
    $result = $null
    try {
      $result = Invoke-McpTool "batch_execute" @{
        steps = @(
          @{ tool = "get_node_detail"; args = @{ id = '${missing_uuid}' } }
        )
      }
    } catch {
      if ($_.Exception.Message -match "Unresolved batch_execute variable") { return }
      throw
    }
    $text = $result | ConvertTo-Json -Depth 30
    if ($text -match "Unresolved batch_execute variable") { return }
    throw "batch_execute accepted an unresolved variable"
  }

  Add-Check "R6 workflow templates are available" {
    $templates = Invoke-McpTool "get_workflow_templates"
    $text = $templates | ConvertTo-Json -Depth 30
    if ($text -notmatch "prefab_create_commit") { throw "prefab_create_commit workflow missing" }
    if ($text -notmatch "prefab_save_close_verify") { throw "prefab_save_close_verify workflow missing" }
  }

  Add-Check "R8 console and asset hygiene" {
    $errors = Invoke-McpTool "read_console" @{ level = "error"; limit = 20 }
    $errorText = $errors | ConvertTo-Json -Depth 20
    if ($errorText -match "Cannot read properties of undefined") {
      throw "console still contains prefab undefined-index error"
    }
  }
}

function Invoke-ShaderRegression {
  Test-Startup
  Add-Check "Shader required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "begin_verification_session", "prefab_reopen_validate", "manage_visual_effect")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Shader capability presence" {
    $capabilities = Invoke-McpTool "get_mcp_capabilities"
    $text = $capabilities | ConvertTo-Json -Depth 30
    if ($text -notmatch "sprite_circle_mask") { throw "shader capability matrix does not mention shader presets" }
  }

  if ($Script:FatalPrecheck) { return }

  foreach ($preset in $ShaderPresets) {
    Add-Check "Shader preset $preset" {
      $reportPath = "$ReportDir/shader-$preset.json"
      $prefabPath = "$ShaderTempDir/prefabs/$preset.prefab"
      $result = Invoke-McpTool "run_regression_suite" @{
        mode = "shader"
        preset = $preset
        autoCreateFixture = $true
        prefabPath = $prefabPath
        reportPath = $reportPath
        validateRuntime = (-not $NoRuntimeValidation.IsPresent)
        captureScreenshot = (-not $NoScreenshot.IsPresent)
      }
      $text = $result | ConvertTo-Json -Depth 50
      if (-not $result.success) { throw "shader regression failed for ${preset}: $text" }
      if ($text -notmatch $preset) { throw "shader regression result did not mention preset $preset" }
      Write-Host "[REPORT] $reportPath"
    }
  }
}

function Invoke-ReleaseSmokeRegression {
  Add-Check "Release smoke required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "get_bridge_health",
      "mcp_scene_script_version",
      "verify_console_baseline",
      "read_console"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Release smoke bridge/report/cleanup/console gate" {
    $reportPath = "$ReportDir/run-regression-release-smoke-latest.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "release-smoke"
      latestCompleteReportPath = $LatestCompleteReportPath
      cleanupPaths = @($TempDir, $ShaderTempDir, $GameDemoRoot)
      expectedSceneScriptVersion = $ExpectedSceneScriptVersion
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "release-smoke regression failed: $text" }
    if (-not $result.releaseGate -or -not $result.releaseGate.passed) { throw "release-smoke did not return passed releaseGate evidence: $text" }
    if (-not $result.operationEvidence -or @($result.operationEvidence).Count -lt 3) { throw "release-smoke did not return operationEvidence for bridge/report/cleanup/console checks: $text" }
    if ($text -notmatch "latestCompleteReport") { throw "release-smoke did not include latestCompleteReport evidence: $text" }
    if ($text -notmatch "cleanup") { throw "release-smoke did not include cleanup evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-CleanupRegression {
  Test-Startup
  Add-Check "Cleanup required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "manage_asset", "get_scene_hierarchy", "delete_node", "get_reserved_fixture_policy", "inspect_reserved_fixtures")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Reserved fixture policy is available" {
    $policy = Invoke-McpTool "get_reserved_fixture_policy" @{ cleanupPaths = @($TempDir, $ShaderTempDir, $GameDemoRoot) }
    $text = $policy | ConvertTo-Json -Depth 50
    if (-not $policy.success) { throw "reserved fixture policy failed: $text" }
    if ($text -notmatch "__mcp_regression__" -or $text -notmatch "Generic2DShowcase") { throw "reserved fixture policy missing expected roots: $text" }
  }

  Add-Check "Cleanup reserved regression fixtures" {
    $reportPath = "$ReportDir/cleanup.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "cleanup"
      cleanupPaths = @($TempDir, $ShaderTempDir, $GameDemoRoot)
      dryRun = $CleanupDryRun.IsPresent
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 50
    if (-not $result.success) { throw "cleanup regression failed: $text" }
    if ($text -notmatch "inventoryBefore" -or $text -notmatch "inventoryAfter" -or $text -notmatch "staleAssetCount") { throw "cleanup regression missing inventory evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ScenePersistenceRegression {
  Test-Startup
  Add-Check "Scene persistence required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "create_node", "delete_node", "manage_scene", "get_scene_hierarchy", "read_console")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Scene mutation cleanup is persisted" {
    $reportPath = "$ReportDir/scene-persistence.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "scene-persistence"
      reportPath = $reportPath
      cleanup = $true
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "scene-persistence regression failed: $text" }
    if ($text -notmatch "finalSceneSave") { throw "scene-persistence did not report final scene save evidence: $text" }
    if ($text -notmatch "restartConsistencyContract") { throw "scene-persistence did not report restart consistency contract: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AutomationFlowRegression {
  Test-Startup
  Add-Check "Automation flow required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "get_editor_state",
      "ensure_no_dialog_risk",
      "manage_editor",
      "manage_prefab",
      "prefab_reopen_validate",
      "bind_button_click",
      "simulate_ui_event"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Automation flow dialog-safe panel prefab" {
    $reportPath = "$ReportDir/automation-flow.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "automation-flow"
      reportPath = $reportPath
      cleanup = (-not $KeepArtifacts.IsPresent)
      allowBlockedClose = $true
    }
    $text = $result | ConvertTo-Json -Depth 80
    if (-not $result.success) { throw "automation-flow regression failed: $text" }
    if ($text -notmatch "interactivePromptSuppressed") { throw "automation-flow did not return dialog suppression evidence: $text" }
    if ($text -notmatch "simulate_ui_event") { throw "automation-flow did not exercise UI event simulation: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-GameDemoRegression {
  param(
    [string]$GameDemoMode = "game-demo",
    [switch]$Showcase
  )
  Test-Startup
  Add-Check "Game demo required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "get_editor_state",
      "ensure_no_dialog_risk",
      "manage_asset",
      "create_node",
      "manage_components",
      "manage_script",
      "bind_button_click",
      "simulate_ui_event",
      "manage_physics",
      "manage_animation_clip",
      "manage_visual_effect",
      "manage_vfx",
      "manage_prefab",
      "prefab_reopen_validate",
      "manage_scene",
      "read_console"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "MCP Adventure Mini Demo $GameDemoMode automation" {
    $reportName = $GameDemoMode -replace "[^A-Za-z0-9_-]", "_"
    if ($Showcase.IsPresent) { $reportName = "$reportName-showcase" }
    $reportPath = "$ReportDir/$reportName.json"
    $keepGeneratedDemo = $KeepArtifacts.IsPresent -or $Showcase.IsPresent
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = $GameDemoMode
      reportPath = $reportPath
      demoRoot = $GameDemoRoot
      keepDemo = $keepGeneratedDemo
      cleanup = (-not $keepGeneratedDemo)
      captureScreenshot = (-not $NoScreenshot.IsPresent)
      allowBlockedClose = $true
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "$GameDemoMode regression failed: $text" }
    if ($text -notmatch "summary") { throw "$GameDemoMode did not emit enhanced summary evidence: $text" }
    if ($text -notmatch "toolsUsed") { throw "$GameDemoMode did not emit tool usage evidence: $text" }
    if ($text -notmatch "interactivePromptSuppressed") { throw "$GameDemoMode did not prove dialog suppression: $text" }
    if ($GameDemoMode -eq "game-demo" -or $GameDemoMode -eq "game-demo-scene-static") {
      if ($text -notmatch "MCPAdventure.scene") { throw "$GameDemoMode did not create static scene evidence: $text" }
    }
    if ($GameDemoMode -eq "game-demo" -or $GameDemoMode -eq "game-demo-material-shader") {
      if ($text -notmatch "sprite_sweep_shine") { throw "$GameDemoMode did not exercise shader/material workflow: $text" }
    }
    if ($GameDemoMode -eq "game-demo" -or $GameDemoMode -eq "game-demo-vfx") {
      if ($text -notmatch "CoinCollect") { throw "$GameDemoMode did not exercise VFX workflow: $text" }
    }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-UiAnimationRegression {
  Test-Startup
  Add-Check "UI animation required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "create_ui_from_spec", "manage_animation_clip", "prefab_reopen_validate")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "UI spec plus AnimationClip prefab roundtrip" {
    $reportPath = "$ReportDir/ui-animation.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "ui-animation"
      uiPrefabPath = "$UiAnimationTempDir/GenericAnimatedPanel.prefab"
      animationPath = "$UiAnimationTempDir/GenericPanelMove.anim"
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 80
    if (-not $result.success) { throw "ui-animation regression failed: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AssetsPrefabRegression {
  Test-Startup
  Add-Check "Assets prefab required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "manage_texture", "manage_prefab", "prefab_reopen_validate")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "SpriteFrame asset binding and prefab roundtrip" {
    $reportPath = "$ReportDir/assets-prefab.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "assets-prefab"
      assetPrefabPath = "$TempDir/assets-prefab/SpriteFrameRoundtrip.prefab"
      spriteFramePath = $SpriteFramePath
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 80
    if (-not $result.success) { throw "assets-prefab regression failed: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-OperationEvidenceRegression {
  Test-Startup
  Add-Check "Operation evidence required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_asset",
      "manage_animation_clip",
      "manage_visual_effect",
      "create_node",
      "manage_components",
      "manage_texture",
      "bind_node_property",
      "bind_asset_property",
      "manage_physics",
      "simulate_ui_event",
      "manage_editor"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Mutating tools return operation evidence" {
    $reportPath = "$ReportDir/operation-evidence.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "operation-evidence"
      cleanupPaths = @("$TempDir/operation-evidence")
      spriteFramePath = $SpriteFramePath
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "operation-evidence regression failed: $text" }
    if ($text -notmatch "evidenceCount") { throw "operation-evidence regression did not return evidence summary: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ReferenceGraphRegression {
  Test-Startup
  Add-Check "Reference graph required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "inspect_reference_graph",
      "validate_project_references"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Reference graph static validation" {
    $reportPath = "$ReportDir/reference-graph.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "reference-graph"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "reference-graph regression failed: $text" }
    if ($text -notmatch "reference_graph_targeted_static") { throw "reference-graph regression did not include targeted static case: $text" }
    if ($text -notmatch "reference_graph_release_gate_static") { throw "reference-graph regression did not include release-gate static case: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-PrefabStaticV2Regression {
  Test-Startup
  Add-Check "Prefab static v2 required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "validate_prefab_static_v2",
      "prefab_safe_edit_plan",
      "inspect_reference_graph"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Prefab static v2 validation" {
    $reportPath = "$ReportDir/prefab-static-v2.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "prefab-static-v2"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "prefab-static-v2 regression failed: $text" }
    if ($text -notmatch "prefab_static_v2_validation") { throw "prefab-static-v2 regression did not include static v2 case: $text" }
    if ($text -notmatch "prefab_safe_edit_plan_boundary") { throw "prefab-static-v2 regression did not include prefab-safe edit plan boundary: $text" }
    if ($text -notmatch "noPrefabTabOpenOrSwitch") { throw "prefab-static-v2 regression did not prove dialog-free static validation: $text" }
    if ($text -notmatch "negativeCount") { throw "prefab-static-v2 regression did not include negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-BuildSmokeRegression {
  Test-Startup
  Add-Check "Build smoke required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "build_project", "get_bridge_health")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Build project gated smoke" {
    $reportPath = "$ReportDir/build-smoke.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "build-smoke"
      buildPlatform = $BuildPlatform
      runRealBuild = $RunRealBuild.IsPresent
      buildDebug = $BuildDebug.IsPresent
      buildWait = (-not $NoBuildWait.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "build-smoke regression failed: $text" }
    if (-not $RunRealBuild.IsPresent -and $text -notmatch "skippedRealBuild") { throw "build-smoke did not prove real build was gated/skipped: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AssetNegativeRegression {
  Test-Startup
  Add-Check "Asset negative required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "manage_asset", "read_console")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Asset write guards reject unsafe targets" {
    $reportPath = "$ReportDir/asset-negative.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "asset-negative"
      negativeAssetRoot = "db://assets/__mcp_negative__"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "asset-negative regression failed: $text" }
    if ($text -notmatch "protectedExtensions") { throw "asset-negative regression did not return protected extension evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AssetExtendedNegativeRegression {
  Test-Startup
  Add-Check "Asset extended negative required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "manage_asset", "read_console")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Asset create/update/move/copy/refresh readback and negatives" {
    $reportPath = "$ReportDir/asset-extended-negative.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "asset-extended-negative"
      cleanupPaths = @("$TempDir/asset-extended-negative")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "asset-extended-negative regression failed: $text" }
    if ($text -notmatch "updated_content_readback") { throw "asset-extended-negative regression did not return update content readback: $text" }
    if ($text -notmatch "copy_info_and_content") { throw "asset-extended-negative regression did not return copy readback: $text" }
    if ($text -notmatch "move_info") { throw "asset-extended-negative regression did not return move readback: $text" }
    if ($text -notmatch "refresh_result") { throw "asset-extended-negative regression did not return refresh evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "asset-extended-negative regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-NodeComponentReadbackRegression {
  Test-Startup
  Add-Check "Node/component readback required tools loaded" {
    Assert-BridgeTools @("run_regression_suite", "create_node", "update_node", "duplicate_node", "delete_node", "get_node_detail", "get_scene_hierarchy", "manage_components")
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Node and component CRUD readback" {
    $reportPath = "$ReportDir/node-component-readback.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "node-component-readback"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "node-component-readback regression failed: $text" }
    if ($text -notmatch "readbackCount") { throw "node-component-readback regression did not return readback evidence: $text" }
    if ($text -notmatch "duplicate_childA") { throw "node-component-readback regression did not return duplicate readback evidence: $text" }
    if ($text -notmatch "updated_childA") { throw "node-component-readback regression did not return transform/layout readback evidence: $text" }
    if ($text -notmatch "deleted_target_negative") { throw "node-component-readback regression did not return deleted-target negative evidence: $text" }
    if ($text -notmatch "circular reparent") { throw "node-component-readback regression did not return circular reparent negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ResourceBindingMatrixRegression {
  Test-Startup
  Add-Check "Resource binding matrix required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "asset_reference_binding_matrix",
      "bind_asset_property",
      "inspect_bound_property",
      "manage_material",
      "manage_animation_clip",
      "manage_prefab",
      "manage_atlas",
      "manage_skeleton"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Resource binding matrix readback and negatives" {
    $reportPath = "$ReportDir/resource-binding-matrix.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "resource-binding-matrix"
      cleanupPaths = @("$TempDir/resource-binding-matrix")
      spriteFramePath = $SpriteFramePath
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "resource-binding-matrix regression failed: $text" }
    if ($text -notmatch "asset_reference_binding_matrix_boundary") { throw "resource-binding-matrix regression did not include asset reference binding matrix boundary: $text" }
    if ($text -notmatch "targetCount") { throw "resource-binding-matrix regression did not return binding target matrix evidence: $text" }
    if ($text -notmatch "partialCount") { throw "resource-binding-matrix regression did not return partial support evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "resource-binding-matrix regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-TextureSpriteFrameBoundaryRegression {
  Test-Startup
  Add-Check "Texture/SpriteFrame boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_texture",
      "manage_asset",
      "create_node",
      "delete_node",
      "get_node_detail",
      "inspect_bound_property"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Texture import, SpriteFrame subasset, and binding readback" {
    $reportPath = "$ReportDir/texture-spriteframe-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "texture-spriteframe-boundary"
      cleanupPaths = @("$TempDir/texture-spriteframe-boundary")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
      spriteFramePath = $SpriteFramePath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "texture-spriteframe-boundary regression failed: $text" }
    if ($text -notmatch "generated_texture_info") { throw "texture-spriteframe-boundary regression did not return generated texture info: $text" }
    if ($text -notmatch "non_ascii_texture_list") { throw "texture-spriteframe-boundary regression did not return non-ASCII list evidence: $text" }
    if ($text -notmatch "internal_spriteframe_binding_readback") { throw "texture-spriteframe-boundary regression did not return internal SpriteFrame bind evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "texture-spriteframe-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AtlasBoundaryRegression {
  Test-Startup
  Add-Check "Atlas boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_resource_fixture",
      "manage_atlas",
      "bind_asset_property",
      "inspect_bound_property",
      "create_node",
      "delete_node"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Atlas parse, resolve, bind/static fallback, and negatives" {
    $reportPath = "$ReportDir/atlas-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "atlas-boundary"
      cleanupPaths = @("$TempDir/atlas-boundary")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "atlas-boundary regression failed: $text" }
    if ($text -notmatch "atlas_fixture") { throw "atlas-boundary regression did not return atlas fixture evidence: $text" }
    if ($text -notmatch "atlas_inspect") { throw "atlas-boundary regression did not return inspect evidence: $text" }
    if ($text -notmatch "atlas_resolve_sprite_frame") { throw "atlas-boundary regression did not return SpriteFrame resolve evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "atlas-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-TilemapBoundaryRegression {
  Test-Startup
  Add-Check "TileMap boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_tilemap",
      "manage_resource_fixture"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "TileMap static inspect, reference validation, and negatives" {
    $reportPath = "$ReportDir/tilemap-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "tilemap-boundary"
      cleanupPaths = @("$TempDir/tilemap-boundary")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "tilemap-boundary regression failed: $text" }
    if ($text -notmatch "tilemap_inspect") { throw "tilemap-boundary regression did not return inspect evidence: $text" }
    if ($text -notmatch "tilemap_validate_references") { throw "tilemap-boundary regression did not return reference validation evidence: $text" }
    if ($text -notmatch "tileset_inspect") { throw "tilemap-boundary regression did not return tileset inspect evidence: $text" }
    if ($text -notmatch "partialCount") { throw "tilemap-boundary regression did not return runtime partial boundary evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "tilemap-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-MaterialShaderBoundaryRegression {
  Test-Startup
  Add-Check "Material shader boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_shader",
      "manage_material",
      "manage_asset",
      "create_node",
      "delete_node",
      "manage_components",
      "inspect_bound_property"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Material shader boundary readback and negatives" {
    $reportPath = "$ReportDir/material-shader-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "material-shader-boundary"
      cleanupPaths = @("$TempDir/material-shader-boundary")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "material-shader-boundary regression failed: $text" }
    if ($text -notmatch "effect_properties") { throw "material-shader-boundary regression did not return effect property evidence: $text" }
    if ($text -notmatch "material_updated_properties") { throw "material-shader-boundary regression did not return material property readback evidence: $text" }
    if ($text -notmatch "sprite_customMaterial_readback") { throw "material-shader-boundary regression did not return Sprite material readback evidence: $text" }
    if ($text -notmatch "mesh_material_assignment") { throw "material-shader-boundary regression did not return MeshRenderer assignment evidence: $text" }
    if ($text -notmatch "unsupportedCount") { throw "material-shader-boundary regression did not return unsupported preset evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "material-shader-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-VisualEffectReleaseSubsetRegression {
  Test-Startup
  Add-Check "Visual effect release subset required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_visual_effect",
      "manage_shader",
      "manage_vfx"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Visual effect release subset matrix and boundaries" {
    $reportPath = "$ReportDir/visual-effect-release-subset.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "visual-effect-release-subset"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "visual-effect-release-subset regression failed: $text" }
    if ($text -notmatch "supportedPresets") { throw "visual-effect-release-subset regression did not return preset matrix evidence: $text" }
    if ($text -notmatch "particleSupportedProperties") { throw "visual-effect-release-subset regression did not return ParticleSystem2D property evidence: $text" }
    if ($text -notmatch "unsupportedCount") { throw "visual-effect-release-subset regression did not return unsupported evidence: $text" }
    if ($text -notmatch "partialCount") { throw "visual-effect-release-subset regression did not return partial evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "visual-effect-release-subset regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-UnsupportedBoundaryRegression {
  Test-Startup
  Add-Check "Unsupported boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "unsupported_capability_matrix",
      "report_unsupported",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Unsupported capability matrix, aliases, and result-shape guard" {
    $reportPath = "$ReportDir/unsupported-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "unsupported-boundary"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "unsupported-boundary regression failed: $text" }
    if ($text -notmatch "unsupported_capability_matrix_boundary") { throw "unsupported-boundary regression did not include matrix boundary: $text" }
    if ($text -notmatch "timeline_or_cutscene_authoring") { throw "unsupported-boundary regression did not cover Timeline/Cutscene: $text" }
    if ($text -notmatch "arbitrary_custom_component_behavior_synthesis") { throw "unsupported-boundary regression did not cover arbitrary gameplay controllers: $text" }
    if ($text -notmatch "shader_or_material_property_animation_curves") { throw "unsupported-boundary regression did not cover shader/material animation curves: $text" }
    if ($text -notmatch "spine_or_skeletal_animation_authoring") { throw "unsupported-boundary regression did not cover Spine/Skeleton authoring: $text" }
    if ($text -notmatch "complex_particle_module_authoring_beyond_exposed_properties") { throw "unsupported-boundary regression did not cover complex particle modules: $text" }
    if ($text -notmatch "manual_serialized_edits_to_scene_prefab_meta_fire") { throw "unsupported-boundary regression did not cover protected Cocos asset hand edits: $text" }
    if ($text -notmatch "requiredResultShape") { throw "unsupported-boundary regression did not return required result shape: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-RuntimeProbeRegression {
  Test-Startup
  Add-Check "Runtime probe required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "runtime_probe",
      "visual_validation_matrix",
      "validate_runtime_view",
      "verify_console_baseline",
      "read_console",
      "capture_screenshot"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Runtime probe preflight, wait, console, and blocked preview lifecycle" {
    $reportPath = "$ReportDir/runtime-probe.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "runtime-probe"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "runtime-probe regression failed: $text" }
    if ($text -notmatch "visual_validation_matrix_boundary") { throw "runtime-probe regression did not include visual validation matrix boundary: $text" }
    if ($text -notmatch "non_blank_pixel_content") { throw "runtime-probe regression did not return non-blank/pixel-content visual evidence: $text" }
    if ($text -notmatch "canvas_bounds") { throw "runtime-probe regression did not return Canvas bounds visual evidence: $text" }
    if ($text -notmatch "key_node_visibility") { throw "runtime-probe regression did not return key node visibility evidence: $text" }
    if ($text -notmatch "runtime_probe_preflight") { throw "runtime-probe regression did not return preflight evidence: $text" }
    if ($text -notmatch "runtime_probe_wait") { throw "runtime-probe regression did not return wait evidence: $text" }
    if ($text -notmatch "dialog_free_preview_control") { throw "runtime-probe regression did not return preview lifecycle boundary: $text" }
    if ($text -notmatch "consoleEvidence") { throw "runtime-probe regression did not return console baseline evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "runtime-probe regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-RuntimeInputRegression {
  Test-Startup
  Add-Check "Runtime input required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "runtime_input",
      "runtime_probe",
      "validate_runtime_view",
      "verify_console_baseline",
      "read_console"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Runtime input preflight and blocked event injection boundaries" {
    $reportPath = "$ReportDir/runtime-input.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "runtime-input"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "runtime-input regression failed: $text" }
    if ($text -notmatch "runtime_input_preflight") { throw "runtime-input regression did not return preflight evidence: $text" }
    if ($text -notmatch "runtime_input_click_blocked") { throw "runtime-input regression did not return click blocked evidence: $text" }
    if ($text -notmatch "runtime_input_keyboard_blocked") { throw "runtime-input regression did not return keyboard blocked evidence: $text" }
    if ($text -notmatch "dialog_free_runtime_input_event_injection") { throw "runtime-input regression did not return runtime input injection boundary: $text" }
    if ($text -notmatch "negativeCount") { throw "runtime-input regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-RuntimePhysicsContactRegression {
  Test-Startup
  Add-Check "Runtime physics contact required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "runtime_physics_contact",
      "runtime_probe",
      "manage_physics",
      "get_component_schema",
      "verify_console_baseline",
      "read_console"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Runtime physics contact preflight and blocked stepping/contact boundaries" {
    $reportPath = "$ReportDir/runtime-physics-contact.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "runtime-physics-contact"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "runtime-physics-contact regression failed: $text" }
    if ($text -notmatch "runtime_physics_contact_preflight") { throw "runtime-physics-contact regression did not return preflight evidence: $text" }
    if ($text -notmatch "runtime_physics_contact_probe_blocked") { throw "runtime-physics-contact regression did not return probe blocked evidence: $text" }
    if ($text -notmatch "dialog_free_runtime_physics_contact_stepping") { throw "runtime-physics-contact regression did not return contact stepping boundary: $text" }
    if ($text -notmatch "get_component_schema") { throw "runtime-physics-contact regression did not exercise physics schema evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "runtime-physics-contact regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-DeliveryReportRegression {
  Test-Startup
  Add-Check "Delivery report required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Delivery report schema, temp writes, summary, and negative boundaries" {
    $reportPath = "$ReportDir/delivery-report.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "delivery-report"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "delivery-report regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-021") { throw "delivery-report regression did not return schema version evidence: $text" }
    if ($text -notmatch "delivery_report_generator") { throw "delivery-report regression did not run delivery report case: $text" }
    if ($text -notmatch "changedAssetCount") { throw "delivery-report regression did not return changed asset evidence: $text" }
    if ($text -notmatch "releaseGateStatus") { throw "delivery-report regression did not return release gate evidence: $text" }
    if ($text -notmatch "nextSuggestedFix") { throw "delivery-report regression did not return nextSuggestedFix evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "delivery-report regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseRegression {
  Test-Startup
  Add-Check "Generic2DShowcase required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase",
      "generate_delivery_report",
      "runtime_probe",
      "manage_resource_fixture",
      "manage_tilemap",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase manifest, boundary evidence, and delivery report" {
    $reportPath = "$ReportDir/generic-2d-showcase.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-022") { throw "generic-2d-showcase regression did not return schema version evidence: $text" }
    if ($text -notmatch "Generic2DShowcase") { throw "generic-2d-showcase regression did not return showcase evidence: $text" }
    if ($text -notmatch "sceneCount") { throw "generic-2d-showcase regression did not return scene evidence: $text" }
    if ($text -notmatch "resourceKindCount") { throw "generic-2d-showcase regression did not return resource evidence: $text" }
    if ($text -notmatch "delivery_report_readback") { throw "generic-2d-showcase regression did not return delivery report readback: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseAuthoringRegression {
  Test-Startup
  Add-Check "Generic2DShowcase authoring required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_authoring",
      "generic_2d_showcase",
      "knowledge_domain_integration",
      "package_hygiene",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained authoring boundary, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-authoring.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-authoring"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-authoring regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-026") { throw "generic-2d-showcase-authoring regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_retained_authoring_boundary") { throw "generic-2d-showcase-authoring regression did not run authoring case: $text" }
    if ($text -notmatch "retainedArtifactCount") { throw "generic-2d-showcase-authoring regression did not return retained artifact evidence: $text" }
    if ($text -notmatch "Generic2DShowcaseRetainedAuthoring") { throw "generic-2d-showcase-authoring regression did not return delivery report readback: $text" }
    if ($text -notmatch "author_blocked") { throw "generic-2d-showcase-authoring regression did not return blocked author evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-authoring regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseLiveAuthoringReadinessRegression {
  Test-Startup
  Add-Check "Generic2DShowcase live authoring readiness required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_live_authoring_readiness",
      "generic_2d_showcase_scene_live_authoring_readiness",
      "generic_2d_showcase_prefab_live_authoring_readiness",
      "generic_2d_showcase_ui_script_live_authoring_readiness",
      "generic_2d_showcase_visual_resource_live_authoring_readiness",
      "generic_2d_showcase_authoring",
      "generic_2d_showcase_scene_prefab_authoring",
      "generic_2d_showcase_ui_script_authoring",
      "generic_2d_showcase_visual_resource_authoring",
      "run_2d_release_gate",
      "package_hygiene",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase live authoring readiness gap gate, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-live-authoring-readiness.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-live-authoring-readiness"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-live-authoring-readiness regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-030") { throw "generic-2d-showcase-live-authoring-readiness regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_live_authoring_readiness_gate") { throw "generic-2d-showcase-live-authoring-readiness regression did not run readiness case: $text" }
    if ($text -notmatch "missingCapabilityCount") { throw "generic-2d-showcase-live-authoring-readiness regression did not return missing capability evidence: $text" }
    if ($text -notmatch "dialog_free_retained_showcase_live_authoring") { throw "generic-2d-showcase-live-authoring-readiness regression did not return live authoring blocked capability: $text" }
    if ($text -notmatch "Generic2DShowcaseLiveAuthoringReadiness") { throw "generic-2d-showcase-live-authoring-readiness regression did not return delivery report readback: $text" }
    if ($text -notmatch "slice_aggregation") { throw "generic-2d-showcase-live-authoring-readiness regression did not return slice aggregation readback: $text" }
    if ($text -notmatch "readiness_gate_aggregation") { throw "generic-2d-showcase-live-authoring-readiness regression did not return readiness sub-gate aggregation readback: $text" }
    if ($text -notmatch "readinessGateCount") { throw "generic-2d-showcase-live-authoring-readiness regression did not return readiness sub-gate count evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-live-authoring-readiness regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseSceneLiveAuthoringReadinessRegression {
  Test-Startup
  Add-Check "Generic2DShowcase scene live authoring readiness required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_scene_live_authoring_readiness",
      "generic_2d_showcase_scene_prefab_authoring",
      "manage_scene",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained scene live readiness gap gate, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-scene-live-authoring-readiness.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-scene-live-authoring-readiness"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-scene-live-authoring-readiness regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-031") { throw "generic-2d-showcase-scene-live-authoring-readiness regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_scene_live_authoring_readiness_gate") { throw "generic-2d-showcase-scene-live-authoring-readiness regression did not run readiness case: $text" }
    if ($text -notmatch "dialog_free_manage_scene_create_save_validate_static") { throw "generic-2d-showcase-scene-live-authoring-readiness regression did not return scene live capability gap: $text" }
    if ($text -notmatch "Generic2DShowcaseSceneLiveAuthoringReadiness") { throw "generic-2d-showcase-scene-live-authoring-readiness regression did not return delivery report readback: $text" }
    if ($text -notmatch "mutation_suppressed") { throw "generic-2d-showcase-scene-live-authoring-readiness regression did not prove mutation suppression: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-scene-live-authoring-readiness regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseSceneLiveAuthoringProofRegression {
  Test-Startup
  Add-Check "Generic2DShowcase scene live authoring proof required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_scene_live_authoring_proof",
      "generic_2d_showcase_scene_live_authoring_readiness",
      "manage_scene",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained scene live proof harness, safety gates, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-scene-live-authoring-proof.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-scene-live-authoring-proof"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-scene-live-authoring-proof regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-032") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_scene_live_authoring_proof_harness") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not run proof harness case: $text" }
    if ($text -notmatch "explicit_live_proof_authorization") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not prove default authorization block: $text" }
    if ($text -notmatch "confirm_retained_scene_mutation") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not prove confirmation guard: $text" }
    if ($text -notmatch "live_cocos_editor_context") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not prove live editor context guard: $text" }
    if ($text -notmatch "Generic2DShowcaseSceneLiveAuthoringProof") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not return delivery report readback: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-scene-live-authoring-proof regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcasePrefabLiveAuthoringReadinessRegression {
  Test-Startup
  Add-Check "Generic2DShowcase prefab live authoring readiness required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_prefab_live_authoring_readiness",
      "generic_2d_showcase_scene_prefab_authoring",
      "manage_prefab",
      "prefab_validate",
      "validate_prefab_static_v2",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained prefab live readiness gap gate, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-prefab-live-authoring-readiness.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-prefab-live-authoring-readiness"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-prefab-live-authoring-readiness regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-033") { throw "generic-2d-showcase-prefab-live-authoring-readiness regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_prefab_live_authoring_readiness_gate") { throw "generic-2d-showcase-prefab-live-authoring-readiness regression did not run readiness case: $text" }
    if ($text -notmatch "dialog_free_manage_prefab_create_save_validate_static") { throw "generic-2d-showcase-prefab-live-authoring-readiness regression did not return prefab live capability gap: $text" }
    if ($text -notmatch "Generic2DShowcasePrefabLiveAuthoringReadiness") { throw "generic-2d-showcase-prefab-live-authoring-readiness regression did not return delivery report readback: $text" }
    if ($text -notmatch "mutation_suppressed") { throw "generic-2d-showcase-prefab-live-authoring-readiness regression did not prove mutation suppression: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-prefab-live-authoring-readiness regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcasePrefabLiveAuthoringProofRegression {
  Test-Startup
  Add-Check "Generic2DShowcase prefab live authoring proof required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_prefab_live_authoring_proof",
      "generic_2d_showcase_prefab_live_authoring_readiness",
      "create_node",
      "manage_prefab",
      "prefab_validate",
      "validate_prefab_static_v2",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained prefab live proof harness, safety gates, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-prefab-live-authoring-proof.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-prefab-live-authoring-proof"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-prefab-live-authoring-proof regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-037") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_prefab_live_authoring_proof_harness") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not run proof harness case: $text" }
    if ($text -notmatch "explicit_live_proof_authorization") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not prove default authorization block: $text" }
    if ($text -notmatch "confirm_retained_prefab_mutation") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not prove confirmation guard: $text" }
    if ($text -notmatch "live_cocos_editor_context") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not prove live editor context guard: $text" }
    if ($text -notmatch "Generic2DShowcasePrefabLiveAuthoringProof") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not return delivery report readback: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-prefab-live-authoring-proof regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseUiScriptLiveAuthoringReadinessRegression {
  Test-Startup
  Add-Check "Generic2DShowcase UI/script live authoring readiness required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_ui_script_live_authoring_readiness",
      "generic_2d_showcase_ui_script_authoring",
      "create_ui_from_spec",
      "validate_ui_resource_map",
      "validate_ui_prefab_static",
      "manage_script",
      "validate_script_contract",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained UI/script live readiness gap gate, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-ui-script-live-authoring-readiness.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-ui-script-live-authoring-readiness"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-034") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_ui_script_live_authoring_readiness_gate") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not run readiness case: $text" }
    if ($text -notmatch "dialog_free_retained_ui_script_authoring") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not return UI/script live capability gap: $text" }
    if ($text -notmatch "Generic2DShowcaseUiScriptLiveAuthoringReadiness") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not return delivery report readback: $text" }
    if ($text -notmatch "GenericShowcaseComponent") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not return script target evidence: $text" }
    if ($text -notmatch "GenericMenuPanel") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not return UI target evidence: $text" }
    if ($text -notmatch "mutation_suppressed") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not prove mutation suppression: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-ui-script-live-authoring-readiness regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseUiScriptLiveAuthoringProofRegression {
  Test-Startup
  Add-Check "Generic2DShowcase UI/script live authoring proof required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_ui_script_live_authoring_proof",
      "generic_2d_showcase_ui_script_live_authoring_readiness",
      "create_ui_from_spec",
      "validate_ui_prefab_static",
      "validate_prefab_static_v2",
      "manage_script",
      "manage_editor",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained UI/script live proof harness, safety gates, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-ui-script-live-authoring-proof.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-ui-script-live-authoring-proof"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-ui-script-live-authoring-proof regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-038") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_ui_script_live_authoring_proof_harness") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not run proof harness case: $text" }
    if ($text -notmatch "explicit_live_proof_authorization") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not prove default authorization block: $text" }
    if ($text -notmatch "confirm_retained_ui_script_mutation") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not prove confirmation guard: $text" }
    if ($text -notmatch "live_cocos_editor_context") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not prove live editor context guard: $text" }
    if ($text -notmatch "Generic2DShowcaseUiScriptLiveAuthoringProof") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not return delivery report readback: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-ui-script-live-authoring-proof regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseVisualResourceLiveAuthoringReadinessRegression {
  Test-Startup
  Add-Check "Generic2DShowcase visual/resource live authoring readiness required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_visual_resource_live_authoring_readiness",
      "generic_2d_showcase_visual_resource_authoring",
      "manage_animation_clip",
      "manage_shader",
      "manage_material",
      "manage_visual_effect",
      "manage_vfx",
      "manage_tilemap",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained visual/resource live readiness gap gate, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-visual-resource-live-authoring-readiness.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-visual-resource-live-authoring-readiness"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-035") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_visual_resource_live_authoring_readiness_gate") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not run readiness case: $text" }
    if ($text -notmatch "dialog_free_retained_visual_resource_authoring") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return visual/resource live capability gap: $text" }
    if ($text -notmatch "Generic2DShowcaseVisualResourceLiveAuthoringReadiness") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return delivery report readback: $text" }
    if ($text -notmatch "GenericShowcaseMotion") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return animation target evidence: $text" }
    if ($text -notmatch "GenericShowcaseMaterial") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return material target evidence: $text" }
    if ($text -notmatch "GenericShowcaseParticle") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return VFX target evidence: $text" }
    if ($text -notmatch "GenericShowcaseTileMap") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return TileMap target evidence: $text" }
    if ($text -notmatch "mutation_suppressed") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not prove mutation suppression: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-visual-resource-live-authoring-readiness regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseScenePrefabAuthoringRegression {
  Test-Startup
  Add-Check "Generic2DShowcase scene/prefab authoring required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_scene_prefab_authoring",
      "manage_scene",
      "manage_prefab",
      "prefab_validate",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase scene/prefab retained authoring boundary, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-scene-prefab-authoring.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-scene-prefab-authoring"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-scene-prefab-authoring regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-027") { throw "generic-2d-showcase-scene-prefab-authoring regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_scene_prefab_authoring_boundary") { throw "generic-2d-showcase-scene-prefab-authoring regression did not run scene/prefab case: $text" }
    if ($text -notmatch "sceneCount") { throw "generic-2d-showcase-scene-prefab-authoring regression did not return scene evidence: $text" }
    if ($text -notmatch "prefabCount") { throw "generic-2d-showcase-scene-prefab-authoring regression did not return prefab evidence: $text" }
    if ($text -notmatch "Generic2DShowcaseScenePrefabAuthoring") { throw "generic-2d-showcase-scene-prefab-authoring regression did not return delivery report readback: $text" }
    if ($text -notmatch "author_blocked") { throw "generic-2d-showcase-scene-prefab-authoring regression did not return blocked author evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-scene-prefab-authoring regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseUiScriptAuthoringRegression {
  Test-Startup
  Add-Check "Generic2DShowcase UI/script authoring required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_ui_script_authoring",
      "validate_script_contract",
      "validate_ui_resource_map",
      "validate_ui_prefab_static",
      "create_ui_from_spec",
      "manage_script",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase UI/script retained authoring boundary, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-ui-script-authoring.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-ui-script-authoring"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-ui-script-authoring regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-028") { throw "generic-2d-showcase-ui-script-authoring regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_ui_script_authoring_boundary") { throw "generic-2d-showcase-ui-script-authoring regression did not run UI/script case: $text" }
    if ($text -notmatch "GenericShowcaseComponent") { throw "generic-2d-showcase-ui-script-authoring regression did not return script contract evidence: $text" }
    if ($text -notmatch "GenericMenuPanel") { throw "generic-2d-showcase-ui-script-authoring regression did not return UI prefab evidence: $text" }
    if ($text -notmatch "Generic2DShowcaseUiScriptAuthoring") { throw "generic-2d-showcase-ui-script-authoring regression did not return delivery report readback: $text" }
    if ($text -notmatch "author_blocked") { throw "generic-2d-showcase-ui-script-authoring regression did not return blocked author evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-ui-script-authoring regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseVisualResourceAuthoringRegression {
  Test-Startup
  Add-Check "Generic2DShowcase visual/resource authoring required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_visual_resource_authoring",
      "manage_animation_clip",
      "manage_shader",
      "manage_visual_effect",
      "manage_vfx",
      "manage_tilemap",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase visual/resource retained authoring boundary, report, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-visual-resource-authoring.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-visual-resource-authoring"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-visual-resource-authoring regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-029") { throw "generic-2d-showcase-visual-resource-authoring regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_visual_resource_authoring_boundary") { throw "generic-2d-showcase-visual-resource-authoring regression did not run visual/resource case: $text" }
    if ($text -notmatch "GenericShowcaseMotion") { throw "generic-2d-showcase-visual-resource-authoring regression did not return animation evidence: $text" }
    if ($text -notmatch "GenericShowcaseMaterial") { throw "generic-2d-showcase-visual-resource-authoring regression did not return material evidence: $text" }
    if ($text -notmatch "GenericShowcaseParticle") { throw "generic-2d-showcase-visual-resource-authoring regression did not return VFX evidence: $text" }
    if ($text -notmatch "db://assets/map/map.tmx") { throw "generic-2d-showcase-visual-resource-authoring regression did not return TileMap evidence: $text" }
    if ($text -notmatch "Generic2DShowcaseVisualResourceAuthoring") { throw "generic-2d-showcase-visual-resource-authoring regression did not return delivery report readback: $text" }
    if ($text -notmatch "author_blocked") { throw "generic-2d-showcase-visual-resource-authoring regression did not return blocked author evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-visual-resource-authoring regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-Generic2DShowcaseVisualResourceLiveAuthoringProofRegression {
  Test-Startup
  Add-Check "Generic2DShowcase visual/resource live authoring proof required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "generic_2d_showcase_visual_resource_live_authoring_proof",
      "generic_2d_showcase_visual_resource_live_authoring_readiness",
      "manage_animation_clip",
      "manage_shader",
      "manage_material",
      "manage_vfx",
      "manage_tilemap",
      "manage_asset",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic2DShowcase retained visual/resource live proof harness, safety gates, and negative guards" {
    $reportPath = "$ReportDir/generic-2d-showcase-visual-resource-live-authoring-proof.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "generic-2d-showcase-visual-resource-live-authoring-proof"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression failed: $text" }
    if ($text -notmatch "2026-05-17-task-039") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not return schema version evidence: $text" }
    if ($text -notmatch "generic_2d_showcase_visual_resource_live_authoring_proof_harness") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not run proof harness case: $text" }
    if ($text -notmatch "explicit_live_proof_authorization") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not prove default authorization block: $text" }
    if ($text -notmatch "confirm_retained_visual_resource_mutation") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not prove confirmation guard: $text" }
    if ($text -notmatch "live_cocos_editor_context") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not prove live editor context guard: $text" }
    if ($text -notmatch "Generic2DShowcaseVisualResourceLiveAuthoringProof") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not return delivery report readback: $text" }
    if ($text -notmatch "negativeCount") { throw "generic-2d-showcase-visual-resource-live-authoring-proof regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-2DReleaseGateRegression {
  Test-Startup
  Add-Check "2D release gate required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "run_2d_release_gate",
      "generic_2d_showcase",
      "generate_delivery_report",
      "verify_console_baseline",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "2D release gate boundary, report, and negative guards" {
    $reportPath = "$ReportDir/2d-release-gate.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "2d-release-gate"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "2d-release-gate regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-023") { throw "2d-release-gate regression did not return schema version evidence: $text" }
    if ($text -notmatch "two_d_release_gate_boundary") { throw "2d-release-gate regression did not run release gate case: $text" }
    if ($text -notmatch "releaseGateStatus") { throw "2d-release-gate regression did not return release gate evidence: $text" }
    if ($text -notmatch "latest_report_readback") { throw "2d-release-gate regression did not return report readback evidence: $text" }
    if ($text -notmatch "nextSuggestedFix") { throw "2d-release-gate regression did not return nextSuggestedFix evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "2d-release-gate regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-PackageHygieneRegression {
  Test-Startup
  Add-Check "Package hygiene required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "package_hygiene",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Package hygiene distribution/docs scan and negative guards" {
    $reportPath = "$ReportDir/package-hygiene.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "package-hygiene"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "package-hygiene regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-024") { throw "package-hygiene regression did not return schema version evidence: $text" }
    if ($text -notmatch "package_hygiene_boundary") { throw "package-hygiene regression did not run package hygiene case: $text" }
    if ($text -notmatch "forbiddenCount") { throw "package-hygiene regression did not return forbidden artifact evidence: $text" }
    if ($text -notmatch "requiredDocCount") { throw "package-hygiene regression did not return required docs evidence: $text" }
    if ($text -notmatch "latest_report_readback") { throw "package-hygiene regression did not return report readback evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "package-hygiene regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-KnowledgeDomainIntegrationRegression {
  Test-Startup
  Add-Check "Knowledge-domain integration required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "knowledge_domain_integration",
      "generic_2d_showcase",
      "package_hygiene",
      "generate_delivery_report",
      "get_mcp_capabilities"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Knowledge-domain integration boundary, report, and negative guards" {
    $reportPath = "$ReportDir/knowledge-domain-integration.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "knowledge-domain-integration"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "knowledge-domain-integration regression failed: $text" }
    if ($text -notmatch "2026-05-16-task-025") { throw "knowledge-domain-integration regression did not return schema version evidence: $text" }
    if ($text -notmatch "knowledge_domain_integration_boundary") { throw "knowledge-domain-integration regression did not run integration case: $text" }
    if ($text -notmatch "Scene\\+Component") { throw "knowledge-domain-integration regression did not return Scene+Component evidence: $text" }
    if ($text -notmatch "Asset\\+Prefab") { throw "knowledge-domain-integration regression did not return Asset+Prefab evidence: $text" }
    if ($text -notmatch "Script\\+UI") { throw "knowledge-domain-integration regression did not return Script+UI evidence: $text" }
    if ($text -notmatch "Animation\\+Prefab") { throw "knowledge-domain-integration regression did not return Animation+Prefab evidence: $text" }
    if ($text -notmatch "Material\\+Shader") { throw "knowledge-domain-integration regression did not return Material+Shader evidence: $text" }
    if ($text -notmatch "VFX\\+Resource") { throw "knowledge-domain-integration regression did not return VFX+Resource evidence: $text" }
    if ($text -notmatch "latest_report_readback") { throw "knowledge-domain-integration regression did not return report readback evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "knowledge-domain-integration regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-VfxParticleBoundaryRegression {
  Test-Startup
  Add-Check "VFX particle boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_vfx",
      "manage_asset",
      "create_node",
      "delete_node",
      "report_unsupported"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "VFX particle asset, readback, controls, unsupported, and negatives" {
    $reportPath = "$ReportDir/vfx-particle-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "vfx-particle-boundary"
      cleanupPaths = @("$TempDir/vfx-particle-boundary")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "vfx-particle-boundary regression failed: $text" }
    if ($text -notmatch "particle_asset_created") { throw "vfx-particle-boundary regression did not return particle asset evidence: $text" }
    if ($text -notmatch "particle_file_binding") { throw "vfx-particle-boundary regression did not return file binding evidence: $text" }
    if ($text -notmatch "particle_updated_state") { throw "vfx-particle-boundary regression did not return property readback evidence: $text" }
    if ($text -notmatch "scene_particle_list") { throw "vfx-particle-boundary regression did not return scene list evidence: $text" }
    if ($text -notmatch "unsupportedCount") { throw "vfx-particle-boundary regression did not return unsupported module evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "vfx-particle-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-PhysicsBoundaryRegression {
  Test-Startup
  Add-Check "Physics boundary required tools loaded" {
      Assert-BridgeTools @(
        "run_regression_suite",
        "physics_readback_matrix",
        "manage_physics",
      "manage_components",
      "get_component_schema",
      "create_node",
      "delete_node"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Physics component readback, schema, partials, and negatives" {
    $reportPath = "$ReportDir/physics-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "physics-boundary"
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "physics-boundary regression failed: $text" }
    if ($text -notmatch "physics_readback_matrix_boundary") { throw "physics-boundary regression did not include physics readback matrix boundary: $text" }
    if ($text -notmatch "propertyCount") { throw "physics-boundary regression did not return physics readback matrix property evidence: $text" }
    if ($text -notmatch "box_components") { throw "physics-boundary regression did not return box component readback: $text" }
    if ($text -notmatch "circle_components") { throw "physics-boundary regression did not return circle component readback: $text" }
    if ($text -notmatch "physics_component_schema") { throw "physics-boundary regression did not return schema readback: $text" }
    if ($text -notmatch "partialCount") { throw "physics-boundary regression did not return partial evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "physics-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ScriptNegativeRegression {
  Test-Startup
  Add-Check "Script negative required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_script",
      "inspect_script_properties",
      "create_node",
      "delete_node",
      "manage_components"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Script static contract negatives without invalid asset import" {
    $reportPath = "$ReportDir/script-negative.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "script-negative"
      cleanupPaths = @("$TempDir/script-negative")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "script-negative regression failed: $text" }
    if ($text -notmatch "importedInvalidAssets") { throw "script-negative regression did not prove invalid scripts stayed content-only: $text" }
    if ($text -notmatch "negativeCount") { throw "script-negative regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ScriptRefreshDiagnosticsRegression {
  Test-Startup
  Add-Check "Script refresh diagnostics required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_script",
      "validate_script",
      "inspect_script_properties",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Script create-write-refresh diagnostics without invalid asset import" {
    $reportPath = "$ReportDir/script-refresh-diagnostics.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "script-refresh-diagnostics"
      cleanupPaths = @("$TempDir/script-refresh-diagnostics")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "script-refresh-diagnostics regression failed: $text" }
    if ($text -notmatch "created_script_info") { throw "script-refresh-diagnostics regression did not return created asset info readback: $text" }
    if ($text -notmatch "updated_script_properties") { throw "script-refresh-diagnostics regression did not return updated property readback: $text" }
    if ($text -notmatch "invalid_content_asset_absence") { throw "script-refresh-diagnostics regression did not prove invalid content stayed asset-free: $text" }
    if ($text -notmatch "negativeCount") { throw "script-refresh-diagnostics regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ScriptImportBindTimingRegression {
  Test-Startup
  Add-Check "Script import/bind timing required tools loaded" {
    Assert-BridgeTools @(      "run_regression_suite",      "manage_script",      "validate_script",      "inspect_script_properties",      "manage_asset",      "manage_components",      "bind_node_property",      "inspect_bound_property",      "create_node",      "delete_node"    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Script import readiness and component binding timing" {
    $reportPath = "$ReportDir/script-import-bind-timing.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "script-import-bind-timing"
      cleanupPaths = @("$TempDir/script-import-bind-timing")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "script-import-bind-timing regression failed: $text" }
    if ($text -notmatch "script_component_ready_poll") { throw "script-import-bind-timing regression did not return readiness polling evidence: $text" }
    if (($text -notmatch "script_bound_node_property") -and ($text -notmatch "partialCount")) { throw "script-import-bind-timing regression did not return bind readback or structured partial evidence: $text" }
    if ($text -notmatch "importedInvalidAssets") { throw "script-import-bind-timing regression did not prove invalid scripts stayed unimported: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ScriptContractRegression {
  Test-Startup
  Add-Check "Script contract required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_script",
      "validate_script",
      "validate_script_contract",
      "inspect_script_properties"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Script static component contract hardening" {
    $reportPath = "$ReportDir/script-contract.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "script-contract"
      cleanupPaths = @("$TempDir/script-contract")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "script-contract regression failed: $text" }
    if ($text -notmatch "script_contract_static_hardening") { throw "script-contract regression did not include static contract case: $text" }
    if ($text -notmatch "validate_script_contract") { throw "script-contract regression did not return contract tool evidence: $text" }
    if ($text -notmatch "importedInvalidAssets") { throw "script-contract regression did not prove invalid scripts stayed unimported: $text" }
    if ($text -notmatch "negativeCount") { throw "script-contract regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ResourceFixtureRegression {
  Test-Startup
  Add-Check "Resource fixture required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "asset_discovery_matrix",
      "manage_resource_fixture",
      "manage_asset",
      "list_assets",
      "get_reserved_fixture_policy"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Generic resource fixture manager" {
    $reportPath = "$ReportDir/resource-fixture.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "resource-fixture"
      cleanupPaths = @("$TempDir/resource-fixtures")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "resource-fixture regression failed: $text" }
    if ($text -notmatch "asset_discovery_matrix_boundary") { throw "resource-fixture regression did not include asset discovery matrix boundary: $text" }
    if ($text -notmatch "familyCount") { throw "resource-fixture regression did not return asset family matrix evidence: $text" }
    if ($text -notmatch "resource_fixture_manager") { throw "resource-fixture regression did not include fixture manager case: $text" }
    if ($text -notmatch "createdCount") { throw "resource-fixture regression did not return create evidence: $text" }
    if ($text -notmatch "listedCount") { throw "resource-fixture regression did not return list evidence: $text" }
    if ($text -notmatch "cleanupVerified") { throw "resource-fixture regression did not return cleanup evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "resource-fixture regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AnimationNegativeRegression {
  Test-Startup
  Add-Check "Animation negative required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_animation_clip",
      "create_node",
      "delete_node",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Animation negative boundaries without asset leakage" {
    $reportPath = "$ReportDir/animation-negative.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "animation-negative"
      cleanupPaths = @("$TempDir/animation-negative")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "animation-negative regression failed: $text" }
    if ($text -notmatch "createdAnimationAssets") { throw "animation-negative regression did not prove no animation asset leakage: $text" }
    if ($text -notmatch "negativeCount") { throw "animation-negative regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AnimationTrackReadbackRegression {
  Test-Startup
  Add-Check "Animation track readback required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_animation_clip",
      "create_node",
      "delete_node",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Animation track static readback and unsupported boundaries" {
    $reportPath = "$ReportDir/animation-track-readback.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "animation-track-readback"
      cleanupPaths = @("$TempDir/animation-track-readback")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "animation-track-readback regression failed: $text" }
    if ($text -notmatch "inspect_tracks") { throw "animation-track-readback regression did not return inspect_tracks readback evidence: $text" }
    if ($text -notmatch "unsupportedCount") { throw "animation-track-readback regression did not return unsupported boundary evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "animation-track-readback regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-AnimationPropertyScopeRegression {
  Test-Startup
  Add-Check "Animation property scope required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_animation_clip"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Animation property support matrix and unsupported boundaries" {
    $reportPath = "$ReportDir/animation-property-scope.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "animation-property-scope"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "animation-property-scope regression failed: $text" }
    if ($text -notmatch "matrixVersion") { throw "animation-property-scope regression did not return matrix evidence: $text" }
    if ($text -notmatch "supportedProperties") { throw "animation-property-scope regression did not return supported property evidence: $text" }
    if ($text -notmatch "unsupportedCount") { throw "animation-property-scope regression did not return unsupported boundary evidence: $text" }
    if ($text -notmatch "partialCount") { throw "animation-property-scope regression did not return partial boundary evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "animation-property-scope regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ComponentMatrixRegression {
  Test-Startup
  Add-Check "Component matrix required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "create_node",
      "delete_node",
      "get_node_detail",
      "manage_components",
      "manage_physics"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Component matrix readback and negatives" {
    $reportPath = "$ReportDir/component-matrix.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "component-matrix"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "component-matrix regression failed: $text" }
    if ($text -notmatch "readbackCount") { throw "component-matrix regression did not return readback evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "component-matrix regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ComponentPropertyBoundaryRegression {
  Test-Startup
  Add-Check "Component property boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "create_node",
      "update_node",
      "delete_node",
      "get_node_detail",
      "manage_components",
      "bind_asset_property",
      "inspect_bound_property",
      "create_ui_from_spec",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Component property boundary readbacks and negatives" {
    $reportPath = "$ReportDir/component-property-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "component-property-boundary"
      cleanupPaths = @("$TempDir/component-property-boundary")
      spriteFramePath = $SpriteFramePath
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "component-property-boundary regression failed: $text" }
    if ($text -notmatch "label_properties") { throw "component-property-boundary regression did not return Label readback evidence: $text" }
    if ($text -notmatch "sprite_properties") { throw "component-property-boundary regression did not return Sprite readback evidence: $text" }
    if ($text -notmatch "button_properties") { throw "component-property-boundary regression did not return Button readback evidence: $text" }
    if ($text -notmatch "layout_properties") { throw "component-property-boundary regression did not return Layout readback evidence: $text" }
    if ($text -notmatch "ui_transform_properties") { throw "component-property-boundary regression did not return UITransform readback evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "component-property-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-ComponentSchemaPreflightRegression {
  Test-Startup
  Add-Check "Component schema preflight required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "validate_component_properties",
      "manage_components",
      "get_component_schema"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Component schema-aware preflight positives and negatives" {
    $reportPath = "$ReportDir/component-schema-preflight.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "component-schema-preflight"
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "component-schema-preflight regression failed: $text" }
    if ($text -notmatch "component_schema_preflight") { throw "component-schema-preflight regression did not include schema case: $text" }
    if ($text -notmatch "positiveCount") { throw "component-schema-preflight regression did not return positive evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "component-schema-preflight regression did not return negative evidence: $text" }
    if ($text -notmatch "mutationAttempted") { throw "component-schema-preflight regression did not prove no-mutation preflight evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-UiSpecNegativeRegression {
  Test-Startup
  Add-Check "UI spec negative required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "create_ui_from_spec",
      "export_ui_spec_from_node",
      "validate_ui_resource_map",
      "create_node",
      "delete_node",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "UI spec negatives and neutral export readback" {
    $reportPath = "$ReportDir/ui-spec-negative.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "ui-spec-negative"
      cleanupPaths = @("$TempDir/ui-spec-negative")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "ui-spec-negative regression failed: $text" }
    if ($text -notmatch "unresolvedResources") { throw "ui-spec-negative regression did not return missing-resource evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "ui-spec-negative regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-UiPrefabStaticDiffRegression {
  Test-Startup
  Add-Check "UI prefab static diff required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "create_ui_from_spec",
      "validate_ui_prefab_static",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "UI prefab static diff readback and negatives" {
    $reportPath = "$ReportDir/ui-prefab-static-diff.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "ui-prefab-static-diff"
      cleanupPaths = @("$TempDir/ui-prefab-static-diff")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "ui-prefab-static-diff regression failed: $text" }
    if ($text -notmatch "validate_ui_prefab_static") { throw "ui-prefab-static-diff regression did not return static diff evidence: $text" }
    if ($text -notmatch "diffCount") { throw "ui-prefab-static-diff regression did not return diff evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "ui-prefab-static-diff regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-UiCompleteSmokeRegression {
  Test-Startup
  Add-Check "UI complete smoke required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "create_ui_from_spec",
      "validate_ui_resource_map",
      "validate_ui_prefab_static",
      "manage_asset"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "UI complete smoke prefab readback and nested negative" {
    $reportPath = "$ReportDir/ui-complete-smoke.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "ui-complete-smoke"
      cleanupPaths = @("$TempDir/ui-complete-smoke")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "ui-complete-smoke regression failed: $text" }
    if ($text -notmatch "validate_ui_resource_map") { throw "ui-complete-smoke regression did not return resource-map evidence: $text" }
    if ($text -notmatch "validate_ui_prefab_static") { throw "ui-complete-smoke regression did not return static-diff evidence: $text" }
    if ($text -notmatch "resourceEvidenceCount") { throw "ui-complete-smoke regression did not return SpriteFrame evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "ui-complete-smoke regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-SceneAssetNegativeRegression {
  Test-Startup
  Add-Check "Scene asset negative required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_scene",
      "manage_asset",
      "read_console"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Scene asset static validation and safe navigation" {
    $reportPath = "$ReportDir/scene-asset-negative.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "scene-asset-negative"
      cleanupPaths = @("$TempDir/scene-asset-negative")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "scene-asset-negative regression failed: $text" }
    if ($text -notmatch "safeOpen") { throw "scene-asset-negative regression did not return safe-open navigation evidence: $text" }
    if ($text -notmatch "validate_static") { throw "scene-asset-negative regression did not return static validation evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "scene-asset-negative regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

function Invoke-FontAudioBoundaryRegression {
  Test-Startup
  Add-Check "Font/audio boundary required tools loaded" {
    Assert-BridgeTools @(
      "run_regression_suite",
      "manage_font",
      "manage_audio",
      "manage_resource_fixture",
      "inspect_script_properties",
      "create_node",
      "manage_components",
      "delete_node"
    )
  }

  if ($Script:FatalPrecheck) { return }

  Add-Check "Font/audio binding status and negatives" {
    $reportPath = "$ReportDir/font-audio-boundary.json"
    $result = Invoke-McpTool "run_regression_suite" @{
      mode = "font-audio-boundary"
      cleanupPaths = @("$TempDir/font-audio-boundary")
      cleanup = (-not $KeepArtifacts.IsPresent)
      reportPath = $reportPath
    }
    $text = $result | ConvertTo-Json -Depth 100
    if (-not $result.success) { throw "font-audio-boundary regression failed: $text" }
    if ($text -notmatch "fixtureCount") { throw "font-audio-boundary regression did not return fixture evidence: $text" }
    if ($text -notmatch "font_assign|staticOnly") { throw "font-audio-boundary regression did not return font readback/static evidence: $text" }
    if ($text -notmatch "audio_assign|staticOnly") { throw "font-audio-boundary regression did not return audio readback/static evidence: $text" }
    if ($text -notmatch "negativeCount") { throw "font-audio-boundary regression did not return negative evidence: $text" }
    Write-Host "[REPORT] $reportPath"
  }
}

if ($DryRun) {
  Show-DryRunPlan
  exit 0
}
Write-Host "Cocos MCP regression runner"
Write-Host "Base URL: $BaseUrl"
Write-Host "Mode: $Mode"
Get-CocosLaunchFlagEvidence "before regression mode $Mode" | Out-Null
Assert-NoCocosDialogs "before regression mode $Mode"
if ($Mode -eq "release-smoke") {
  Write-Host "[INFO] Using release-smoke mode-local bridge health check with a fresh console baseline."
} else {
  Assert-BridgeHealth
}

switch ($Mode) {
  "core" { Invoke-CoreRegression }
  "shader" { Invoke-ShaderRegression }
  "dashboard-safe" { Invoke-DashboardSafeRegression }
  "release-smoke" { Invoke-ReleaseSmokeRegression }
  "cleanup" { Invoke-CleanupRegression }
  "scene-persistence" { Invoke-ScenePersistenceRegression }
  "automation-flow" { Invoke-AutomationFlowRegression }
  "game-demo" { Invoke-GameDemoRegression -Showcase:$KeepArtifacts.IsPresent }
  "game-demo-preflight" { Invoke-GameDemoRegression -GameDemoMode "game-demo-preflight" }
  "game-demo-ui" { Invoke-GameDemoRegression -GameDemoMode "game-demo-ui" }
  "game-demo-character" { Invoke-GameDemoRegression -GameDemoMode "game-demo-character" }
  "game-demo-physics" { Invoke-GameDemoRegression -GameDemoMode "game-demo-physics" }
  "game-demo-vfx" { Invoke-GameDemoRegression -GameDemoMode "game-demo-vfx" }
  "game-demo-animation" { Invoke-GameDemoRegression -GameDemoMode "game-demo-animation" }
  "game-demo-material-shader" { Invoke-GameDemoRegression -GameDemoMode "game-demo-material-shader" }
  "game-demo-prefab" { Invoke-GameDemoRegression -GameDemoMode "game-demo-prefab" }
  "game-demo-scene-static" { Invoke-GameDemoRegression -GameDemoMode "game-demo-scene-static" }
  "game-demo-runtime" { Invoke-GameDemoRegression -GameDemoMode "game-demo-runtime" }
  "game-demo-cleanup" { Invoke-GameDemoRegression -GameDemoMode "game-demo-cleanup" }
  "ui-animation" { Invoke-UiAnimationRegression }
  "assets-prefab" { Invoke-AssetsPrefabRegression }
  "operation-evidence" { Invoke-OperationEvidenceRegression }
  "reference-graph" { Invoke-ReferenceGraphRegression }
  "prefab-static-v2" { Invoke-PrefabStaticV2Regression }
  "build-smoke" { Invoke-BuildSmokeRegression }
  "asset-negative" { Invoke-AssetNegativeRegression }
  "asset-extended-negative" { Invoke-AssetExtendedNegativeRegression }
  "node-component-readback" { Invoke-NodeComponentReadbackRegression }
  "resource-binding-matrix" { Invoke-ResourceBindingMatrixRegression }
  "texture-spriteframe-boundary" { Invoke-TextureSpriteFrameBoundaryRegression }
  "atlas-boundary" { Invoke-AtlasBoundaryRegression }
  "tilemap-boundary" { Invoke-TilemapBoundaryRegression }
  "material-shader-boundary" { Invoke-MaterialShaderBoundaryRegression }
  "visual-effect-release-subset" { Invoke-VisualEffectReleaseSubsetRegression }
  "unsupported-boundary" { Invoke-UnsupportedBoundaryRegression }
  "runtime-probe" { Invoke-RuntimeProbeRegression }
  "runtime-input" { Invoke-RuntimeInputRegression }
  "runtime-physics-contact" { Invoke-RuntimePhysicsContactRegression }
  "delivery-report" { Invoke-DeliveryReportRegression }
  "generic-2d-showcase" { Invoke-Generic2DShowcaseRegression }
  "generic-2d-showcase-authoring" { Invoke-Generic2DShowcaseAuthoringRegression }
  "generic-2d-showcase-live-authoring-readiness" { Invoke-Generic2DShowcaseLiveAuthoringReadinessRegression }
  "generic-2d-showcase-scene-live-authoring-readiness" { Invoke-Generic2DShowcaseSceneLiveAuthoringReadinessRegression }
  "generic-2d-showcase-scene-live-authoring-proof" { Invoke-Generic2DShowcaseSceneLiveAuthoringProofRegression }
  "generic-2d-showcase-prefab-live-authoring-readiness" { Invoke-Generic2DShowcasePrefabLiveAuthoringReadinessRegression }
  "generic-2d-showcase-prefab-live-authoring-proof" { Invoke-Generic2DShowcasePrefabLiveAuthoringProofRegression }
  "generic-2d-showcase-ui-script-live-authoring-readiness" { Invoke-Generic2DShowcaseUiScriptLiveAuthoringReadinessRegression }
  "generic-2d-showcase-ui-script-live-authoring-proof" { Invoke-Generic2DShowcaseUiScriptLiveAuthoringProofRegression }
  "generic-2d-showcase-visual-resource-live-authoring-readiness" { Invoke-Generic2DShowcaseVisualResourceLiveAuthoringReadinessRegression }
  "generic-2d-showcase-visual-resource-live-authoring-proof" { Invoke-Generic2DShowcaseVisualResourceLiveAuthoringProofRegression }
  "generic-2d-showcase-scene-prefab-authoring" { Invoke-Generic2DShowcaseScenePrefabAuthoringRegression }
  "generic-2d-showcase-ui-script-authoring" { Invoke-Generic2DShowcaseUiScriptAuthoringRegression }
  "generic-2d-showcase-visual-resource-authoring" { Invoke-Generic2DShowcaseVisualResourceAuthoringRegression }
  "2d-release-gate" { Invoke-2DReleaseGateRegression }
  "package-hygiene" { Invoke-PackageHygieneRegression }
  "knowledge-domain-integration" { Invoke-KnowledgeDomainIntegrationRegression }
  "vfx-particle-boundary" { Invoke-VfxParticleBoundaryRegression }
  "script-negative" { Invoke-ScriptNegativeRegression }
  "script-refresh-diagnostics" { Invoke-ScriptRefreshDiagnosticsRegression }
  "script-import-bind-timing" { Invoke-ScriptImportBindTimingRegression }
  "script-contract" { Invoke-ScriptContractRegression }
  "resource-fixture" { Invoke-ResourceFixtureRegression }
  "animation-negative" { Invoke-AnimationNegativeRegression }
  "animation-property-scope" { Invoke-AnimationPropertyScopeRegression }
  "animation-track-readback" { Invoke-AnimationTrackReadbackRegression }
  "component-matrix" { Invoke-ComponentMatrixRegression }
  "component-property-boundary" { Invoke-ComponentPropertyBoundaryRegression }
  "component-schema-preflight" { Invoke-ComponentSchemaPreflightRegression }
  "ui-spec-negative" { Invoke-UiSpecNegativeRegression }
  "ui-prefab-static-diff" { Invoke-UiPrefabStaticDiffRegression }
  "ui-complete-smoke" { Invoke-UiCompleteSmokeRegression }
  "scene-asset-negative" { Invoke-SceneAssetNegativeRegression }
  "font-audio-boundary" { Invoke-FontAudioBoundaryRegression }
  "physics-boundary" { Invoke-PhysicsBoundaryRegression }
  "complete" {
    Invoke-CoreRegression
    Invoke-ScenePersistenceRegression
    Invoke-AutomationFlowRegression
    Invoke-GameDemoRegression
    Invoke-ShaderRegression
    Invoke-OperationEvidenceRegression
    Invoke-ReferenceGraphRegression
    Invoke-PrefabStaticV2Regression
    Invoke-BuildSmokeRegression
    Invoke-AssetNegativeRegression
    Invoke-AssetExtendedNegativeRegression
    Invoke-NodeComponentReadbackRegression
    Invoke-ResourceBindingMatrixRegression
    Invoke-TextureSpriteFrameBoundaryRegression
    Invoke-AtlasBoundaryRegression
    Invoke-TilemapBoundaryRegression
    Invoke-MaterialShaderBoundaryRegression
    Invoke-VisualEffectReleaseSubsetRegression
    Invoke-RuntimeProbeRegression
    Invoke-RuntimeInputRegression
    Invoke-RuntimePhysicsContactRegression
    Invoke-DeliveryReportRegression
    Invoke-Generic2DShowcaseRegression
    Invoke-2DReleaseGateRegression
    Invoke-VfxParticleBoundaryRegression
    Invoke-ScriptNegativeRegression
    Invoke-ScriptRefreshDiagnosticsRegression
    Invoke-ScriptImportBindTimingRegression
    Invoke-ScriptContractRegression
    Invoke-ResourceFixtureRegression
    Invoke-AnimationNegativeRegression
    Invoke-AnimationPropertyScopeRegression
    Invoke-AnimationTrackReadbackRegression
    Invoke-ComponentMatrixRegression
    Invoke-ComponentPropertyBoundaryRegression
    Invoke-ComponentSchemaPreflightRegression
    Invoke-UiSpecNegativeRegression
    Invoke-UiPrefabStaticDiffRegression
    Invoke-UiCompleteSmokeRegression
    Invoke-SceneAssetNegativeRegression
    Invoke-FontAudioBoundaryRegression
    Invoke-PhysicsBoundaryRegression
  }
  default { throw "Unsupported mode: $Mode" }
}

Assert-NoCocosDialogs "after regression mode $Mode"

if (-not $KeepArtifacts) {
  $sceneMutatedByFinalCleanup = $false
  foreach ($nodeId in @($Script:CreatedNodeIds)) {
    Remove-NodeQuietly $nodeId
    $sceneMutatedByFinalCleanup = $true
  }
  if ($Mode -eq "core" -or $Mode -eq "complete") {
    Remove-AssetQuietly $TempDir
  }
  $deletedMissing = Remove-MissingNodesQuietly
  if ($deletedMissing) { $sceneMutatedByFinalCleanup = $true }
  if ($sceneMutatedByFinalCleanup) {
    Save-SceneQuietly "runner final cleanup"
  }
}

if ($Script:Failures.Count -gt 0) {
  Write-Host ""
  Write-Host "Regression failed:"
  foreach ($failure in $Script:Failures) {
    Write-Host " - $failure"
  }
  exit 1
}

Write-Host ""
Write-Host "Regression passed."

