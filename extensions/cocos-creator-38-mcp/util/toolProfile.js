'use strict';

var CORE_TOOL_NAMES = [
  'get_project_info',
  'get_active_instances',
  'set_active_instance',
  'get_editor_state',
  'doctor',
  'get_mcp_capabilities',
  'configure_client',
  'read_console',
  'verify_console_baseline',
  'get_scene_hierarchy',
  'get_node_detail',
  'query_node_dump',
  'find_nodes',
  'create_node',
  'update_node',
  'delete_node',
  'duplicate_node',
  'manage_node_tree',
  'manage_components',
  'get_component_schema',
  'validate_component_properties',
  'manage_asset',
  'list_assets',
  'resolve_asset',
  'find_asset_by_role',
  'inspect_reference_graph',
  'manage_prefab',
  'manage_prefab_edit_context',
  'validate_prefab_static_v2',
  'validate_prefab_editor_openable',
  'export_prefab_full_spec',
  'create_prefab_from_full_spec',
  'diff_prefab_full_spec',
  'validate_prefab_against_full_spec',
  'prefab_replay_pipeline',
  'manage_script',
  'manage_editor',
  'search_project',
  'apply_text_edits',
  'run_regression_suite',
  'run_workflow',
  'batch_execute',
  'begin_verification_session',
  'ensure_no_dialog_risk',
  'report_unsupported',
  'build_install_package',
  'prefab_ipc_capability_matrix',
];

var CORE_TOOL_SET = {};
CORE_TOOL_NAMES.forEach(function (name) { CORE_TOOL_SET[name] = true; });

function normalizeProfile(profile) {
  var value = String(profile || 'core').toLowerCase();
  if (value === 'all' || value === 'core' || value === 'full' || value === 'internal' || value === 'deprecated') return value;
  return 'core';
}

function inferToolProfile(name) {
  name = String(name || '');
  if (CORE_TOOL_SET[name]) return 'core';
  if (
    name.indexOf('generic_2d_showcase') === 0 ||
    name.indexOf('__mcp_') === 0 ||
    name.indexOf('prove_') === 0 ||
    name.indexOf('recover_') === 0 ||
    name.indexOf('diagnose_') === 0 ||
    name.indexOf('inspect_reserved_fixtures') === 0 ||
    name.indexOf('get_reserved_fixture_policy') === 0 ||
    name.indexOf('manage_resource_fixture') === 0 ||
    name.indexOf('unsupported_capability_matrix') === 0 ||
    name.indexOf('knowledge_domain_integration') === 0 ||
    name.indexOf('package_hygiene') === 0 ||
    name.indexOf('run_2d_release_gate') === 0 ||
    name.indexOf('physics_readback_matrix') === 0 ||
    name.indexOf('visual_validation_matrix') === 0 ||
    name.indexOf('asset_discovery_matrix') === 0 ||
    name.indexOf('asset_reference_binding_matrix') === 0 ||
    name.indexOf('runtime_probe') === 0 ||
    name.indexOf('runtime_input') === 0 ||
    name.indexOf('runtime_physics_contact') === 0 ||
    name.indexOf('mcp_scene_script_version') === 0 ||
    name.indexOf('dialog_safe_') === 0 ||
    name.indexOf('prefab_safe_edit_plan') === 0 ||
    name.indexOf('prefab_reopen_validate') === 0 ||
    name.indexOf('inspect_prefab_edit_context_recovery') === 0
  ) {
    return 'internal';
  }
  if (
    name.indexOf('offline_prefab_') === 0 ||
    name.indexOf('inspect_prefab_offline_static') === 0 ||
    name.indexOf('create_prefab_from_full_spec_offline') === 0 ||
    name.indexOf('prefab_validate') === 0
  ) {
    return 'deprecated';
  }
  return 'full';
}

function isVisibleInProfile(toolProfile, requestedProfile) {
  requestedProfile = normalizeProfile(requestedProfile);
  toolProfile = String(toolProfile || '');
  if (toolProfile !== 'core' && toolProfile !== 'full' && toolProfile !== 'internal' && toolProfile !== 'deprecated') {
    toolProfile = inferToolProfile(toolProfile);
  }
  if (requestedProfile === 'all') return true;
  if (requestedProfile === 'internal') return toolProfile === 'internal';
  if (requestedProfile === 'deprecated') return toolProfile === 'deprecated';
  if (requestedProfile === 'full') return toolProfile !== 'internal';
  return toolProfile === 'core';
}

function summarizeTools(tools) {
  var summary = { core: 0, full: 0, internal: 0, deprecated: 0, all: 0 };
  (tools || []).forEach(function (tool) {
    var profile = inferToolProfile(tool && tool.name || tool);
    if (summary[profile] == null) summary[profile] = 0;
    summary[profile] += 1;
    summary.all += 1;
  });
  summary.defaultProfile = 'core';
  return summary;
}

function decorateTool(tool) {
  var profile = inferToolProfile(tool && tool.name);
  var result = {};
  Object.keys(tool || {}).forEach(function (key) { result[key] = tool[key]; });
  result.profile = profile;
  result.recommended = profile === 'core';
  return result;
}

function filterTools(tools, profile) {
  profile = normalizeProfile(profile);
  return (tools || [])
    .map(decorateTool)
    .filter(function (tool) { return isVisibleInProfile(tool.profile, profile); });
}

module.exports = {
  CORE_TOOL_NAMES: CORE_TOOL_NAMES.slice(),
  CORE_TOOL_SET: CORE_TOOL_SET,
  normalizeProfile: normalizeProfile,
  inferToolProfile: inferToolProfile,
  isVisibleInProfile: isVisibleInProfile,
  summarizeTools: summarizeTools,
  decorateTool: decorateTool,
  filterTools: filterTools,
};
