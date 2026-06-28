'use strict';

var prompts = [
  {
    name: 'cocos_usage_guide',
    description: 'Essential guide for using Cocos Creator MCP tools 鈥?when and how to use each tool',
    arguments: {},
    handler: function () {
      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: [
              '# Cocos Creator 3.8 MCP Usage Guide',
              '',
              '## Core Rules',
              '1. Do not perform ad hoc manual serialized edits to .fire, .scene, .prefab, or .meta files. Use MCP/editor tools by default; only a dedicated guarded offline .prefab writer may write .prefab files when explicitly opted in and verified.',
              '2. ALWAYS use MCP tools for: creating/modifying nodes, managing components, handling prefabs, asset operations.',
              '3. You CAN directly edit .js/.ts script files with your file editing tools.',
              '4. After editing scripts, call manage_editor(action:"refresh") to sync with the editor.',
              '5. Always call get_scene_hierarchy BEFORE any scene modification to understand current state.',
              '',
              '## Tool Selection Guide',
              '- **Project info**: get_project_info 鈫?understand project before starting',
              '- **Scene tree**: get_scene_hierarchy 鈫?lightweight by default; use includeDetails:true only when necessary',
              '- **Create UI**: create_node 鈫?make nodes (sprite, label, button, etc.)',
              '- **Modify nodes**: update_node 鈫?change position, size, rotation, color, name',
              '- **Components**: manage_components 鈫?add cc.Sprite, cc.Label, cc.Widget, etc.',
              '- **Prefabs**: manage_prefab -> create/save/instantiate/static validate; open/close return blocked results in unattended mode.',
              '- **Scripts**: manage_script / validate_script 鈫?create scripts with Cocos template, validate syntax, bind to nodes',
              '- **Assets**: manage_asset, list_assets, search_project, get_sha 鈫?browse, search, verify project resources',
              '- **Media/assets**: manage_texture, manage_material, manage_shader, manage_vfx, manage_audio, manage_font, manage_atlas, manage_skeleton 鈫?inspect and assign common Cocos assets safely',
              '- **Component discovery**: get_component_schema 鈫?inspect component properties before setting unfamiliar fields',
              '- **Build**: build_project 鈫?compile for web-mobile, android, etc.',
              '- **Batch**: batch_execute 鈫?chain multiple operations in one call',
              '- **Workflows**: get_workflow_templates + run_workflow 鈫?multi-step automation',
              '',
              '## Common Workflow',
              '1. get_project_info 鈫?check project state',
              '2. get_scene_hierarchy 鈫?understand current scene',
              '3. create_node / manage_components 鈫?build scene structure',
              '5. Write .js script files directly',
              '5. manage_editor(action:"refresh") 鈫?sync editor',
              '6. manage_script(action:"bind") 鈫?attach script to node',
              '8. manage_prefab(action:"save") or manage_scene(action:"save") -> persist changes when a proven silent save path exists; otherwise return blocked, not a dialog',
              '',
              '## Prefab Workflow',
              '- Create prefab: build the source node with create_node/manage_components, then run_workflow(template:"prefab_create_commit", variables:{nodeId:"<source_uuid>", prefabPath:"db://assets/mcp-generated/MyPrefab.prefab", prefabName:"MyPrefab"})',
              '- If a source node remains in the scene after prefab creation, run_workflow(template:"prefab_delete_residual_scene_node", variables:{nodePath:"Scene/Canvas/MyPrefab", prefabPath:"db://assets/mcp-generated/MyPrefab.prefab"})',
              '- Modify prefab: unattended prefab open/close is disabled until a proven non-interactive Cocos API exists. Use create/validate/in-place workflows and report blocked steps instead of triggering dialogs.',
              '- Do not make ad hoc serialized .prefab or .meta edits. Use manage_prefab/manage_asset by default; for deterministic replay/recovery, use the guarded offline .prefab writer with explicit opt-in, backup, validation, refresh, and static verification.',
            ].join('\n'),
          },
        }],
      };
    },
  },

  {
    name: 'cocos_workflow_guide',
    description: 'Step-by-step guide for a specific Cocos Editor task',
    arguments: {
      task: {
        description: 'Task type: "create_ui", "create_scene", "modify_prefab", "build", "setup_script"',
        required: true,
      },
    },
    handler: function (args) {
      var guides = {
        create_ui: [
          '# Create UI Panel Workflow',
          '1. get_scene_hierarchy 鈫?find Canvas node UUID',
          '2. create_node(name:"Panel", type:"sprite", parentId:<canvas_uuid>) 鈫?panel node',
          '3. update_node(id:<panel_uuid>, size:{width:600, height:400})',
          '4. create_node(name:"Title", type:"label", parentId:<panel_uuid>)',
          '5. create_node(name:"CloseBtn", type:"button", parentId:<panel_uuid>)',
          '6. manage_components(action:"update", nodeId:<title_uuid>, component:"cc.Label", properties:{string:"My Panel"})',
          '7. manage_scene(action:"save")',
          '',
          'Or use: run_workflow(template:"create_ui_panel", variables:{panelName:"MyPanel", width:600, height:400})',
        ].join('\n'),

        create_scene: [
          '# Create New Scene Workflow',
          '1. manage_scene(action:"create", path:"db://assets/mcp-generated/MyScene.scene") -> creates a scene asset through AssetDB without switching the editor',
          '2. Do not assume the new scene is open; manage_scene(open) is blocked in unattended mode unless a proven silent API is added',
          '3. Only build scene content in the currently open scene; report blocked if the requested scene is not active',
          '4. manage_scene(action:"save") only when a silent save path is proven; otherwise return blocked, not a dialog',
        ].join('\n'),

        modify_prefab: [
          '# Modify Prefab Workflow',
          '1. Unattended prefab open is blocked; do not switch into prefab edit mode automatically',
          '2. Make only in-place or newly-created prefab changes that can be verified without editor close/reopen',
          '3. run_workflow(template:"prefab_save_close_verify", variables:{prefabPath:"db://assets/prefabs/MyPrefab.prefab"}) for dialog-safe save/validate only; it does not close/reopen',
          '',
          '# Create Prefab Workflow',
          '1. get_project_info and get_scene_hierarchy before building the source node.',
          '2. Build the source node in the current scene with create_node/manage_components or batch_execute.',
          '3. run_workflow(template:"prefab_create_commit", variables:{nodeId:"<source_uuid>", prefabPath:"db://assets/mcp-generated/MyPrefab.prefab", prefabName:"MyPrefab"})',
          '4. If a copied source node remains in scene, run_workflow(template:"prefab_delete_residual_scene_node", variables:{nodePath:"Scene/Canvas/MyPrefab", prefabPath:"db://assets/mcp-generated/MyPrefab.prefab"})',
        ].join('\n'),

        build: [
          '# Build Project Workflow',
          '1. manage_scene(action:"save") 鈫?save current scene first',
          '2. build_project(platform:"web-mobile") 鈫?build and wait for result',
          '3. If build fails, check read_console(level:"error")',
        ].join('\n'),

        setup_script: [
          '# Setup Script on Node Workflow',
          '1. Write your .js script file directly (cc.Class extends cc.Component)',
          '2. manage_editor(action:"refresh") 鈫?let editor discover the new script',
          '3. manage_script(action:"bind", path:"db://assets/scripts/MyScript.js", nodeId:<target_uuid>)',
          '4. manage_scene(action:"save") only when a silent save path is proven; otherwise return blocked, not a dialog',
        ].join('\n'),
      };

      var task = (args && args.task) || 'create_ui';
      var text = guides[task] || 'Unknown task: ' + task + '. Available: ' + Object.keys(guides).join(', ');
      return {
        messages: [{
          role: 'user',
          content: { type: 'text', text: text },
        }],
      };
    },
  },

  {
    name: 'cocos_tool_reference',
    description: 'Quick reference card for all available Cocos MCP tools with brief usage examples',
    arguments: {},
    handler: function () {
      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: [
              '# Cocos MCP Tool Quick Reference',
              '',
              '| Tool | Example |',
              '|------|---------|',
              '| get_bridge_health | `{includeTools:false}` |',
              '| get_project_info | `{}` |',
              '| get_editor_state | `{}` |',
              '| manage_scene | `{action:"save"}`; open/create may return blocked if silent AssetDB behavior is not proven |',
              '| get_scene_hierarchy | `{}` or `{depth:2}` |',
              '| get_node_detail | `{id:"<uuid>", includeComponents:true}` |',
              '| create_node | `{name:"Btn", type:"button", parentId:"<uuid>"}` |',
              '| update_node | `{id:"<uuid>", position:{x:100,y:200}, opacity:128}` |',
              '| delete_node | `{id:"<uuid>"}` |',
              '| find_nodes | `{name:"Player*"}` or `{component:"cc.Sprite"}` or `{action:"selected"}` |',
              '| manage_components | `{action:"add", nodeId:"<uuid>", component:"cc.Widget", properties:{isAlignLeft:true}}` |',
              '| manage_animation | `{action:"play", nodeId:"<uuid>", clipName:"idle"}` |',
              '| manage_prefab | `{action:"instantiate", path:"db://assets/prefabs/Item.prefab", parentId:"<uuid>"}` |',
              '| manage_asset | `{action:"get_info", path:"db://assets/textures/bg.png"}` |',
              '| manage_script | `{action:"create", path:"db://assets/scripts/Game.js"}` |',
              '| list_assets | `{type:"sprite-frame", path:"db://assets/textures", maxResults:50}` |',
              '| search_project | `{query:"cc.Class", path:"db://assets/Script", include:["*.js"]}` |',
              '| get_sha | `{path:"db://assets/Script/Game.js"}` |',
              '| validate_script | `{path:"db://assets/Script/Game.js"}` |',
              '| manage_texture | `{action:"list", pattern:"button", maxResults:20}` |',
              '| manage_material | `{action:"assign", nodeId:"<uuid>", path:"db://assets/mat/default.mtl"}` |',
              '| manage_shader | `{action:"list", maxResults:20}` |',
              '| manage_vfx | `{action:"list", maxResults:20}` or `{action:"get_state", nodeId:"<uuid>"}` |',
              '| manage_audio | `{action:"list", maxResults:20}` |',
              '| manage_font | `{action:"list", maxResults:20}` |',
              '| manage_atlas | `{action:"list", maxResults:20}` |',
              '| manage_skeleton | `{action:"list", maxResults:20}` |',
              '| resolve_asset | `{uuid:"<uuid>"}` or `{path:"db://assets/foo.png"}` |',
              '| get_component_schema | `{componentType:"cc.Sprite"}` |',
              '| doctor | `{}` |',
              '| manage_editor | `{action:"undo"}` or `{action:"refresh"}` |',
              '| manage_undo | `{action:"undo"}` |',
              '| execute_menu | `{menuPath:"Developer/Reload"}` |',
              '| find_references | `{uuid:"<asset-uuid>"}` |',
              '| capture_screenshot | `{view:"game"}` |',
              '| read_console | `{level:"error", count:10}` |',
              '| build_project | `{platform:"web-mobile"}` |',
              '| batch_execute | `{steps:[{tool:"create_node",args:{name:"A",type:"empty"}}]}` |',
              '| apply_text_edits | `{path:"db://assets/scripts/Game.js", edits:[{find:"old",replace:"new"}]}` |',
              '| run_workflow | `{template:"create_ui_panel", variables:{panelName:"Shop"}}` |',
              '| get_workflow_templates | `{}` |',
              '',
              'Prefab workflow templates:',
              '- `prefab_create_commit`: create prefab from a scene node, refresh, and verify the asset.',
              '- `prefab_open_for_edit`: returns a blocked result in unattended mode because prefab open can show save dialogs.',
              '- `prefab_save_close_verify`: dialog-safe save/validate without close/reopen.',
              '- `prefab_delete_residual_scene_node`: remove a leftover source node after prefab creation.',
            ].join('\n'),
          },
        }],
      };
    },
  },
];

module.exports = prompts;
