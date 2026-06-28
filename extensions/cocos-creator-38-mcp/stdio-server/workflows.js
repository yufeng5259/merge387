'use strict';

var templates = {
  create_ui_panel: {
    description: 'Create a standard UI panel with background, title, close button, and content area',
    variables: ['panelName', 'width', 'height', 'parentId'],
    steps: [
      { tool: 'get_scene_hierarchy', args: { depth: 2, includeDetails: false } },
      { tool: 'create_node', args: { name: '${panelName}', type: 'sprite', parentId: '${parentId}' }, output_var: 'panel_uuid' },
      { tool: 'update_node', args: { id: '${panel_uuid}', size: { width: '${width}', height: '${height}' } } },
      { tool: 'create_node', args: { name: 'Title', type: 'label', parentId: '${panel_uuid}' }, output_var: 'title_uuid' },
      { tool: 'update_node', args: { id: '${title_uuid}', position: { x: 0, y: '${height_half}' } } },
      { tool: 'create_node', args: { name: 'CloseBtn', type: 'button', parentId: '${panel_uuid}' }, output_var: 'close_uuid' },
      { tool: 'create_node', args: { name: 'Content', type: 'empty', parentId: '${panel_uuid}' }, output_var: 'content_uuid' },
    ],
  },

  setup_standard_scene_layers: {
    description: 'Add standard layer structure (Background, UI, Popup) to the currently open scene',
    variables: [],
    steps: [
      { tool: 'get_scene_hierarchy', args: { depth: 2, includeDetails: false } },
      { tool: 'create_node', args: { name: 'Background', type: 'sprite' } },
      { tool: 'create_node', args: { name: 'UI', type: 'empty' } },
      { tool: 'create_node', args: { name: 'Popup', type: 'empty' } },
    ],
  },

  attach_script_to_node: {
    description: 'Create a script file, refresh editor, then bind it to a node as a component',
    variables: ['scriptPath', 'scriptContent', 'nodeId'],
    steps: [
      { tool: 'manage_script', args: { action: 'create', path: '${scriptPath}', content: '${scriptContent}' } },
      { tool: 'manage_editor', args: { action: 'refresh' } },
      { tool: 'manage_script', args: { action: 'bind', path: '${scriptPath}', nodeId: '${nodeId}' } },
    ],
  },

  create_button_with_handler: {
    description: 'Create a button node and attach a script with click handler',
    variables: ['buttonName', 'parentId', 'scriptPath', 'handlerMethod'],
    steps: [
      { tool: 'get_scene_hierarchy', args: { depth: 2, includeDetails: false } },
      { tool: 'create_node', args: { name: '${buttonName}', type: 'button', parentId: '${parentId}' }, output_var: 'btn_uuid' },
      { tool: 'manage_script', args: { action: 'create', path: '${scriptPath}' } },
      { tool: 'manage_editor', args: { action: 'refresh' } },
      { tool: 'manage_script', args: { action: 'bind', path: '${scriptPath}', nodeId: '${btn_uuid}' } },
    ],
  },

  prefab_create_commit: {
    description: 'Create a prefab from an existing scene node, refresh assets, and verify the generated prefab through Cocos MCP',
    variables: ['nodeId', 'prefabPath', 'prefabName'],
    steps: [
      { tool: 'get_project_info', args: {} },
      { tool: 'get_scene_hierarchy', args: { depth: 2, includeDetails: false, maxChildren: 80 } },
      { tool: 'manage_prefab', args: { action: 'create', nodeId: '${nodeId}', path: '${prefabPath}' } },
      { tool: 'manage_asset', args: { action: 'refresh', path: '${prefabPath}' } },
      { tool: 'manage_asset', args: { action: 'get_info', path: '${prefabPath}' } },
      { tool: 'list_assets', args: { type: 'prefab', path: 'db://assets', pattern: '${prefabName}', maxResults: 20 } },
    ],
  },

  prefab_open_for_edit: {
    description: 'Blocked in unattended mode: prefab open can show dirty-save dialogs; use in-place prefab asset validation instead',
    variables: ['prefabPath'],
    steps: [
      { tool: 'get_project_info', args: {} },
      { tool: 'manage_prefab', args: { action: 'open', path: '${prefabPath}' } },
    ],
  },

  prefab_save_close_verify: {
    description: 'Dialog-safe prefab verification: save via non-interactive path when possible and validate without close/reopen',
    variables: ['prefabPath'],
    steps: [
      { tool: 'manage_prefab', args: { action: 'save', path: '${prefabPath}' } },
      { tool: 'prefab_reopen_validate', args: { path: '${prefabPath}', verifyInPlace: true } },
      { tool: 'manage_asset', args: { action: 'refresh', path: '${prefabPath}' } },
      { tool: 'manage_asset', args: { action: 'get_info', path: '${prefabPath}' } },
    ],
  },

  prefab_delete_residual_scene_node: {
    description: 'Delete a known leftover scene node after prefab creation and confirm that the prefab asset still exists',
    variables: ['nodePath', 'prefabPath'],
    steps: [
      { tool: 'get_node_detail', args: { path: '${nodePath}', includeComponents: false, includeChildren: false, silent: true, missingOk: true }, output_var: 'residual_node_uuid', continueOnError: true },
      { tool: 'delete_node', args: { id: '${residual_node_uuid}', silent: true, missingOk: true }, continueOnError: true, skipIfUnresolved: true },
      { tool: 'manage_asset', args: { action: 'get_info', path: '${prefabPath}' } },
    ],
  },

  batch_create_nodes: {
    description: 'Quickly scaffold a list of child nodes under a parent (all empty by default)',
    variables: ['parentId', 'nodeNames'],
    steps: [],
    expandable: true,
  },
};

function resolveVar(value, vars) {
  if (typeof value === 'string') {
    return value.replace(/\$\{(\w+)\}/g, function (_, key) {
      if (key === 'height_half' && vars.height) return Math.round(Number(vars.height) / 2 - 20);
      return vars[key] !== undefined ? vars[key] : '${' + key + '}';
    });
  }
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(function (v) { return resolveVar(v, vars); });
  if (value && typeof value === 'object') {
    var out = {};
    for (var k in value) {
      if (value.hasOwnProperty(k)) out[k] = resolveVar(value[k], vars);
    }
    return out;
  }
  return value;
}

function findUnresolvedVar(value) {
  if (typeof value === 'string') {
    var match = value.match(/\$\{\w+\}/);
    return match ? match[0] : null;
  }
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      var foundArray = findUnresolvedVar(value[i]);
      if (foundArray) return foundArray;
    }
  } else if (value && typeof value === 'object') {
    var keys = Object.keys(value);
    for (var k = 0; k < keys.length; k++) {
      var foundObject = findUnresolvedVar(value[keys[k]]);
      if (foundObject) return foundObject;
    }
  }
  return null;
}

function extractUuid(result) {
  if (!result) return null;
  if (typeof result === 'string') {
    var m = result.match(/[0-9a-f]{8}-[0-9a-f]{4}/i);
    return m ? result : null;
  }
  if (result.uuid) return result.uuid;
  if (result.id) return result.id;
  return null;
}

async function execute(bridge, args) {
  var steps;
  var vars = args.variables || {};

  if (args.template) {
    var tpl = templates[args.template];
    if (!tpl) throw new Error('Unknown template: ' + args.template + '. Use get_workflow_templates to list available ones.');
    steps = JSON.parse(JSON.stringify(tpl.steps));
  } else if (args.steps && args.steps.length > 0) {
    steps = args.steps;
  } else {
    throw new Error('Provide either "template" or "steps"');
  }

  var results = [];
  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    var resolvedArgs = resolveVar(step.args, vars);
    var unresolvedVar = findUnresolvedVar(resolvedArgs);
    if (unresolvedVar && step.skipIfUnresolved) {
      results.push({ step: i, tool: step.tool, success: true, skipped: true, reason: 'Unresolved variable: ' + unresolvedVar });
      continue;
    }
    try {
      var result = await bridge.forward(step.tool, resolvedArgs);
      results.push({ step: i, tool: step.tool, success: true, result: result });
      if (step.output_var) {
        var uuid = extractUuid(result);
        if (uuid) vars[step.output_var] = uuid;
      }
    } catch (e) {
      results.push({ step: i, tool: step.tool, success: false, error: e.message });
      if (!step.continueOnError) break;
    }
  }

  return { stepsExecuted: results.length, totalSteps: steps.length, results: results };
}

function listTemplates() {
  var list = [];
  for (var name in templates) {
    if (templates.hasOwnProperty(name)) {
      list.push({
        name: name,
        description: templates[name].description,
        variables: templates[name].variables,
        stepCount: templates[name].steps.length,
      });
    }
  }
  return list;
}

module.exports = { execute: execute, listTemplates: listTemplates, templates: templates };
