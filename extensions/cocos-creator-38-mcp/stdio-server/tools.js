'use strict';

var z = require('zod');
var toolProfile = require('../util/toolProfile');

function def(name, description, schemaObj) {
  return { name: name, description: description, schema: schemaObj };
}

var tools = [
  def('get_project_info',
    'Get current Cocos Creator project info: project path, engine version, current scene, design resolution.',
    {}
  ),

  def('manage_scene',
    'Scene operations: create/save/list/get_info/validate_static/delete/duplicate/rename/move scene assets. Open is allowed only when MCP proves the current scene is clean; otherwise it returns a blocked/missing capability result.',
    {
      action: z.enum(['create', 'open', 'save', 'save_silent', 'list', 'get_info', 'validate_static', 'delete', 'duplicate', 'rename', 'move']).describe('Operation to perform'),
      scenePath: z.string().optional().describe('Scene db path for open, e.g. "db://assets/scenes/Main.scene"'),
      path: z.string().optional().describe('Alias for scenePath'),
      destPath: z.string().optional().describe('Destination scene db path for duplicate or move'),
      name: z.string().optional().describe('New name for rename, or display name for create'),
      designWidth: z.number().optional().describe('Design resolution width for create-scene template'),
      designHeight: z.number().optional().describe('Design resolution height for create-scene template'),
      creationMode: z.enum(['template', 'serialize']).optional().describe('Scene creation mode (default "template"; "serialize" falls back to template in 3.8)'),
      open: z.boolean().optional().describe('For create only: request opening after creation; open is allowed only when MCP proves it is safe'),
      missingOk: z.boolean().optional().describe('For delete: succeed when the scene asset is already missing'),
      silent: z.boolean().optional().describe('Suppress intermediate notifications when supported'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after the operation'),
    }
  ),

  def('get_scene_hierarchy',
    'Get the node tree of the currently open scene. Defaults are lightweight; set includeDetails:true only when needed. Call this BEFORE modifying scene nodes.',
    {
      depth: z.number().optional().describe('Max depth to traverse (default 10)'),
      rootId: z.string().optional().describe('UUID of root node to start from (default scene root)'),
      includeDetails: z.boolean().optional().describe('Return transform/component details (default false for performance)'),
      maxChildren: z.number().optional().describe('Max children per node to return (default 30, max 500)'),
    }
  ),

  def('get_node_detail',
    'Get detailed state for one scene or prefab-edit node without dumping the whole hierarchy.',
    {
      id: z.string().optional().describe('Node UUID'),
      path: z.string().optional().describe('Node path, e.g. "Canvas/Panel/Button"'),
      includeComponents: z.boolean().optional().describe('Include component list and key component state (default true)'),
      includeChildren: z.boolean().optional().describe('Include one-level child summaries (default false)'),
      silent: z.boolean().optional().describe('Treat missing nodes as a skipped result'),
      missingOk: z.boolean().optional().describe('Treat missing nodes as a skipped result'),
    }
  ),

  def('create_node',
    'Create a new node in the scene. Supports types: empty, sprite, label, button, canvas, editbox, scrollview, layout, progressbar, toggle, richtext.',
    {
      name: z.string().describe('Node name'),
      type: z.enum(['empty', 'sprite', 'label', 'button', 'canvas', 'editbox', 'scrollview', 'layout', 'progressbar', 'toggle', 'richtext']).optional().describe('Node type (default "empty")'),
      parentId: z.string().optional().describe('Parent node UUID (default scene Canvas or root)'),
      position: z.object({ x: z.number(), y: z.number() }).optional().describe('Position {x, y}'),
      size: z.object({ width: z.number(), height: z.number() }).optional().describe('Size {width, height}'),
      rotation: z.number().optional().describe('Rotation angle in degrees'),
      scale: z.object({ x: z.number(), y: z.number(), z: z.number().optional() }).optional().describe('Scale {x, y, z?}'),
      opacity: z.number().optional().describe('Opacity 0-255'),
      active: z.boolean().optional().describe('Initial active state'),
      anchor: z.object({ x: z.number(), y: z.number() }).optional().describe('Anchor point {x, y}'),
      siblingIndex: z.number().optional().describe('Initial sibling index under parent'),
      zIndex: z.number().optional().describe('Alias for siblingIndex'),
      layer: z.number().optional().describe('Node layer bitmask'),
      inheritParentLayer: z.boolean().optional().describe('Inherit parent layer for created node and descendants unless layer is explicit (default true)'),
      properties: z.record(z.any()).optional().describe('Additional properties like color, opacity, anchorPoint'),
      layout: z.enum(['center', 'full', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).optional().describe('Widget layout preset for node positioning'),
      skipDefaultSprite: z.boolean().optional().describe('Skip automatic internal default sprite assignment for sprite/button nodes'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications in batch operations'),
    }
  ),

  def('update_node',
    'Update node properties: position, size, rotation, scale, color, opacity, name, active, anchor, parentId, and siblingIndex/zIndex.',
    {
      id: z.string().describe('Node UUID'),
      name: z.string().optional().describe('New node name'),
      position: z.object({ x: z.number(), y: z.number() }).optional().describe('New position'),
      size: z.object({ width: z.number(), height: z.number() }).optional().describe('New size'),
      rotation: z.number().optional().describe('Rotation in degrees'),
      scale: z.object({ x: z.number(), y: z.number() }).optional().describe('Scale {x, y}'),
      color: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe('Color {r, g, b, a?}'),
      opacity: z.number().optional().describe('Opacity 0-255'),
      active: z.boolean().optional().describe('Node active state'),
      anchor: z.object({ x: z.number(), y: z.number() }).optional().describe('Anchor point {x, y}'),
      zIndex: z.number().optional().describe('Sibling z-order'),
      siblingIndex: z.number().optional().describe('Sibling index under current/new parent'),
      parentId: z.string().optional().describe('New parent node UUID for reparenting'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications in batch operations'),
    }
  ),

  def('duplicate_node',
    'Duplicate an existing scene node, optionally under a new parent and sibling index, with stable UUID/readback evidence.',
    {
      id: z.string().describe('Source node UUID'),
      parentId: z.string().optional().describe('Optional destination parent node UUID; defaults to source parent'),
      name: z.string().optional().describe('Optional duplicate node name'),
      siblingIndex: z.number().optional().describe('Optional sibling index for the duplicate'),
      index: z.number().optional().describe('Alias for siblingIndex'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications in batch operations'),
    }
  ),

  def('delete_node',
    'Delete a node from the scene by UUID.',
    {
      id: z.string().describe('Node UUID to delete'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Treat missing nodes as a skipped result'),
      missingOk: z.boolean().optional().describe('Treat missing nodes as a skipped result'),
      detachOnly: z.boolean().optional().describe('Detach from the scene tree without immediately destroying the node'),
      destroy: z.boolean().optional().describe('Set false to detach from the scene tree without immediately destroying the node'),
    }
  ),

  def('find_nodes',
    'Search nodes by name pattern, component type, or path. Also supports getting the currently selected node.',
    {
      action: z.enum(['search', 'selected']).optional().describe('"search" to find nodes, "selected" to get editor selection (default "search")'),
      name: z.string().optional().describe('Node name or glob pattern to search'),
      component: z.string().optional().describe('Component type name to filter (e.g. "cc.Sprite", "cc.Label")'),
      path: z.string().optional().describe('Node path like "Canvas/Panel/Title"'),
    }
  ),

  def('manage_components',
    'Add, remove, update, or query components on a node. Supports all built-in and custom components.',
    {
      action: z.enum(['add', 'remove', 'update', 'list']).describe('Operation to perform'),
      nodeId: z.string().optional().describe('Target node UUID'),
      id: z.string().optional().describe('Alias for nodeId'),
      component: z.string().optional().describe('Component type (e.g. "cc.Sprite", "cc.Label", "cc.Button", "cc.Widget", or custom script name)'),
      componentType: z.string().optional().describe('Alias for component'),
      componentId: z.string().optional().describe('Component UUID for remove/update when type is ambiguous'),
      properties: z.record(z.any()).optional().describe('Component properties to set (for add/update)'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications in batch operations'),
      allowDuplicate: z.boolean().optional().describe('Allow adding a duplicate component type when the caller has proven that the component supports multiple instances; default false skips duplicate add idempotently'),
    }
  ),

  def('manage_node_tree',
    'High-level generic node tree apply/preview/validate/cleanup wrapper over create_node, update_node, delete_node, and manage_components with singleton guard and readback diff.',
    {
      action: z.enum(['preview', 'apply', 'validate', 'cleanup']).optional().describe('Workflow action'),
      rootId: z.string().optional().describe('Parent/root node UUID for apply or cleanup target'),
      parentId: z.string().optional().describe('Alias for rootId as apply parent'),
      rootPath: z.string().optional().describe('Scene node path for parent/root lookup'),
      tree: z.record(z.any()).optional().describe('Node tree spec root'),
      spec: z.record(z.any()).optional().describe('Spec wrapper with root/tree'),
      root: z.record(z.any()).optional().describe('Alias for tree'),
      preserveExistingByPath: z.boolean().optional().describe('Update matching existing children by path/name instead of creating duplicates'),
      overwriteChildren: z.boolean().optional().describe('Reserved for future strict child replacement'),
      strictComponents: z.boolean().optional().describe('Fail on component readback mismatch when enabled'),
      strictResources: z.boolean().optional().describe('Reserved for resource-bound node tree validation'),
      dryRun: z.boolean().optional().describe('Validate/preview without mutation'),
      readback: z.boolean().optional().describe('Read back node details and diff after apply; default true'),
      tolerance: z.number().optional().describe('Numeric tolerance for readback diff; default 0.5'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors for cleanup'),
    }
  ),

  def('manage_prefab_edit_context',
    'Generic safe prefab edit-context workflow wrapper: preflight, open, save, validate, guarded close-or-block, and recover diagnostics without unproven dialogs.',
    {
      action: z.enum(['preflight', 'open', 'save', 'validate', 'closeOrBlock', 'recover']).optional().describe('Prefab edit-context action'),
      path: z.string().optional().describe('Prefab db path'),
      prefabPath: z.string().optional().describe('Alias for path'),
      targetPrefabPath: z.string().optional().describe('Alias for path'),
      allowSaveDirty: z.boolean().optional().describe('Allow proven silent save of current dirty prefab context during preflight'),
      trySave: z.boolean().optional().describe('Alias for allowSaveDirty'),
      strict: z.boolean().optional().describe('Strict static validation'),
      includeTree: z.boolean().optional().describe('Include static tree in validation'),
      includeGraph: z.boolean().optional().describe('Include reference graph in validation'),
      editorOpenable: z.boolean().optional().describe('Include static editor-openable metadata check'),
      settleMs: z.number().optional().describe('Save/readback settle time'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console output for editor operations'),
      __mcpRegressionSimulateUnsafeCurrentPrefab: z.boolean().optional().describe('Regression-only unsafe context simulation gate'),
      simulateUnsafeCurrentPrefab: z.boolean().optional(),
      simulateDirtyUnknown: z.boolean().optional(),
      simulateRootDumpFailure: z.boolean().optional(),
      simulateDirty: z.boolean().optional(),
      simulateCurrentPrefabPath: z.string().optional(),
    }
  ),

  def('validate_component_properties',
    'Schema-aware preflight validation for supported component property writes before scene mutation.',
    {
      component: z.string().optional().describe('Component type, e.g. cc.Label'),
      componentType: z.string().optional().describe('Alias for component'),
      type: z.string().optional().describe('Alias for component'),
      action: z.enum(['add', 'update', 'remove', 'list']).optional().describe('Intended manage_components action'),
      operation: z.string().optional().describe('Alias for action'),
      properties: z.record(z.any()).optional().describe('Properties to preflight'),
      strict: z.boolean().optional().describe('Throw when diagnostics are present'),
    }
  ),

  def('manage_animation',
    'Control animations: play, stop, pause, resume, query clips on a node.',
    {
      action: z.enum(['play', 'stop', 'pause', 'resume', 'list_clips']).describe('Animation action'),
      nodeId: z.string().describe('Node UUID with cc.Animation component'),
      clipName: z.string().optional().describe('Animation clip name (for play)'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for mutating animation actions'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating animation actions'),
    }
  ),

  def('manage_animation_clip',
    'Create .anim assets through AssetDB and bind/clear AnimationClip entries on a node Animation component.',
    {
      action: z.enum(['create_asset', 'bind_asset', 'create_and_bind', 'create_from_runtime_tracks', 'bind_generated', 'create_runtime_clip', 'validate', 'inspect_tracks', 'track_support_status', 'track_support_matrix', 'validate_track_scope', 'clear']).describe('Animation clip operation'),
      path: z.string().optional().describe('Animation clip asset path, e.g. db://assets/animations/Run.anim'),
      nodeId: z.string().optional().describe('Node UUID/path with or without cc.Animation component'),
      id: z.string().optional().describe('Alias for nodeId'),
      nodePath: z.string().optional().describe('Stable scene/prefab node path; preferred when UUIDs can be re-instantiated after prefab open/reopen'),
      clipName: z.string().optional().describe('Clip name'),
      name: z.string().optional().describe('Alias for clipName'),
      duration: z.number().optional().describe('Clip duration in seconds'),
      sample: z.number().optional().describe('Animation sample rate'),
      speed: z.number().optional().describe('Playback speed'),
      wrapMode: z.string().optional().describe('Wrap mode hint, e.g. Loop'),
      playOnLoad: z.boolean().optional().describe('Set Animation.playOnLoad'),
      property: z.string().optional().describe('Simple property to animate when curveData is omitted'),
      from: z.any().optional().describe('Start value for simple clip'),
      to: z.any().optional().describe('Mid value for simple clip'),
      fromY: z.any().optional().describe('Start Y scale for simple clip'),
      toY: z.any().optional().describe('Mid Y scale for simple clip'),
      includeScaleY: z.boolean().optional().describe('Generate scaleY with scaleX simple clip'),
      curveData: z.record(z.any()).optional().describe('Raw Cocos curveData JSON'),
      events: z.array(z.any()).optional().describe('Animation events'),
      keyframes: z.array(z.any()).optional().describe('Animation track specs or legacy keyframe specs'),
      tracks: z.array(z.any()).optional().describe('Runtime track specs: targetPath, property, keys[{time,value}]'),
      expectedPaths: z.array(z.string()).optional().describe('Animated node paths that must resolve from the animated root'),
      expectedProperties: z.array(z.string()).optional().describe('Animated properties expected in inspect_tracks output'),
      propertyName: z.string().optional().describe('Alias for property in track_support_status'),
      trackProperty: z.string().optional().describe('Alias for property in track_support_status'),
      requireTracks: z.boolean().optional().describe('Fail validation when no tracks/keyframes are present'),
      requireDefaultClip: z.boolean().optional().describe('Fail validation when the generated clip is not defaultClip'),
      requirePlayOnLoad: z.boolean().optional().describe('Fail validation when Animation.playOnLoad is false'),
      strict: z.boolean().optional().describe('Throw on validation failure; defaults to true'),
      failOnPartial: z.boolean().optional().describe('For validate_track_scope, fail partial/unproven track properties as well as unsupported properties'),
      overwrite: z.boolean().optional().describe('Replace an existing .anim asset at the same path'),
      allowEmpty: z.boolean().optional().describe('Allow intentional placeholder clips with no tracks'),
      content: z.any().optional().describe('Raw serialized AnimationClip content for advanced callers'),
      silent: z.boolean().optional().describe('Suppress intermediate scene notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for mutating animation clip actions'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating animation clip actions'),
    }
  ),

  def('manage_physics',
    'Add, update, or list Cocos 2D physics components on nodes: RigidBody2D and common Collider2D shapes.',
    {
      action: z.enum(['add_rigidbody', 'update_rigidbody', 'add_collider', 'update_collider', 'add_bundle', 'list']).describe('Physics operation'),
      nodeId: z.string().optional().describe('Target node UUID'),
      id: z.string().optional().describe('Alias for nodeId'),
      component: z.string().optional().describe('Explicit component name'),
      componentName: z.string().optional().describe('Alias for component'),
      rigidbodyComponent: z.string().optional().describe('Explicit rigidbody component, default cc.RigidBody2D'),
      colliderComponent: z.string().optional().describe('Explicit collider component'),
      shape: z.enum(['box', 'circle', 'polygon', 'capsule']).optional().describe('Collider shape'),
      collider: z.string().optional().describe('Alias for shape/component'),
      properties: z.record(z.any()).optional().describe('Properties for a single add/update operation'),
      rigidbodyProperties: z.record(z.any()).optional().describe('RigidBody properties for add_bundle'),
      bodyProperties: z.record(z.any()).optional().describe('Alias for rigidbodyProperties'),
      colliderProperties: z.record(z.any()).optional().describe('Collider properties for add_bundle'),
      silent: z.boolean().optional().describe('Suppress intermediate scene notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for mutating physics actions'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating physics actions'),
    }
  ),

  def('physics_readback_matrix',
    'Read-only matrix for Cocos 2D physics RigidBody2D/Collider2D property write/readback support, including offset, size, radius, group, sensor, and numeric/type boundaries.',
    {
      components: z.array(z.string()).optional().describe('Optional component filter, e.g. cc.RigidBody2D, cc.BoxCollider2D, cc.CircleCollider2D'),
    }
  ),

  def('manage_prefab',
    'Prefab operations: create from node, save, instantiate, open/switch with preflight, close with save-clean readback, and wrapped prefab IPC instance actions.',
    {
      action: z.enum([
        'create',
        'create_from_json',
        'open',
        'save',
        'save_silent',
        'close',
        'close_silent',
        'recover_or_close_silent',
        'instantiate',
        'apply_prefab_instance',
        'restore_prefab_instance',
        'unlink_prefab_instance',
        'create_ipc_probe',
      ]).describe('Prefab operation'),
      nodeId: z.string().optional().describe('Source node UUID for create'),
      path: z.string().optional().describe('Prefab db path, e.g. "db://assets/prefabs/MyPanel.prefab"'),
      content: z.string().optional().describe('Prefab JSON content for create_from_json'),
      parentId: z.string().optional().describe('Parent node UUID (for instantiate)'),
      name: z.string().optional().describe('Optional instantiated node name'),
      nodeName: z.string().optional().describe('Alias for name when instantiating a prefab'),
      position: z.object({ x: z.number(), y: z.number() }).optional().describe('Position for instantiated prefab'),
      overwrite: z.boolean().optional().describe('Replace an existing prefab at path for create/create_from_json'),
      trySave: z.boolean().optional().describe('For recover_or_close_silent, attempt proven scene.save-scene before close when dirty'),
      execute: z.boolean().optional().describe('For recover_or_close_silent, set false to inspect without closing'),
      inspectOnly: z.boolean().optional().describe('For recover_or_close_silent, return recovery plan only'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for mutating prefab actions'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating prefab actions'),
    }
  ),

  def('inspect_prefab_edit_context_recovery',
    'Inspect the current prefab edit context and return a dialog-free recovery plan. Read-only unless trySave:true is explicitly supplied.',
    {
      path: z.string().optional().describe('Expected current prefab db path'),
      trySave: z.boolean().optional().describe('Attempt proven scene.save-scene and dirty readback as part of inspection'),
      __mcpRegressionSimulateDirtyCurrentPrefab: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateDirty: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateDirtyUnknown: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateRootDumpFailure: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateSaveSceneFailure: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateDiscardCloseSupported: z.boolean().optional().describe('Regression-only simulation flag'),
    }
  ),

  def('recover_prefab_edit_context',
    'Recover or close the current prefab edit context only when MCP can prove a dialog-free path; otherwise return structured blocked evidence.',
    {
      path: z.string().optional().describe('Expected current prefab db path'),
      trySave: z.boolean().optional().describe('Attempt proven scene.save-scene before close when dirty'),
      execute: z.boolean().optional().describe('Set false to inspect without closing'),
      inspectOnly: z.boolean().optional().describe('Return recovery plan only'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after recovery attempt'),
      __mcpRegressionSimulateDirtyCurrentPrefab: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateDirty: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateDirtyUnknown: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateRootDumpFailure: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateSaveSceneFailure: z.boolean().optional().describe('Regression-only simulation flag'),
      __mcpRegressionSimulateDiscardCloseSupported: z.boolean().optional().describe('Regression-only simulation flag'),
    }
  ),

  def('prefab_validate',
    'Validate a prefab asset without editing it: file, .meta, uuid, AssetDB info, static script/button bindings, and recent console errors.',
    {
      path: z.string().optional().describe('Prefab db path, e.g. "db://assets/prefabs/MyPanel.prefab"'),
      prefabPath: z.string().optional().describe('Alias for path'),
      readStatic: z.boolean().optional().describe('Read serialized prefab JSON for static node/component/event summaries (default true)'),
      expectComponents: z.array(z.record(z.any())).optional().describe('Static component assertions. For scripts use scriptPath or scriptUuid; optional nodePath and properties.'),
      expectButtonClickEvents: z.array(z.record(z.any())).optional().describe('Static Button click event assertions with buttonNodePath, targetNodePath, component, handler, customEventData.'),
      readConsole: z.boolean().optional().describe('Set false to skip recent console error check'),
      consoleCount: z.number().optional().describe('Number of recent console errors to include'),
      sinceTs: z.number().optional().describe('Only count console errors at or after this timestamp in milliseconds'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
    }
  ),

  def('prefab_diff_summary',
    'Summarize differences between two prefab or hierarchy snapshots: nodes, components, and key UI properties.',
    {
      before: z.record(z.any()).optional().describe('Before snapshot object from get_scene_hierarchy or serialized prefab JSON'),
      after: z.record(z.any()).optional().describe('After snapshot object from get_scene_hierarchy or serialized prefab JSON'),
      beforePath: z.string().optional().describe('Before snapshot file path or prefab db path'),
      afterPath: z.string().optional().describe('After snapshot file path or prefab db path'),
    }
  ),

  def('prefab_safe_edit_plan',
    'Return a dialog-safe prefab edit plan and capability boundary without opening, closing, switching, or mutating prefab assets.',
    {
      path: z.string().optional().describe('Prefab db:// path to inspect'),
      prefabPath: z.string().optional().describe('Alias for path'),
      intendedEdits: z.array(z.any()).optional().describe('Optional planned node/component edits to classify'),
      includeWorkflowTemplates: z.boolean().optional().describe('Include prefab workflow templates (default true)'),
    }
  ),

  def('asset_discovery_matrix',
    'Read-only matrix for project asset discovery/import/readback coverage across textures, SpriteFrames, atlases, tilemaps, fonts, audio, scripts, prefabs, scenes, materials, effects, animations, and skeleton-like resources.',
    {
      root: z.string().optional().describe('db://assets root to scan, default db://assets'),
      path: z.string().optional().describe('Alias for root'),
      families: z.array(z.string()).optional().describe('Optional family filter, e.g. texture, spriteFrame, atlas, tilemap, font, audio, script, prefab, scene, material, effect, animation, skeleton'),
      maxSamples: z.number().optional().describe('Max sample assets per family, default 5'),
      maxFiles: z.number().optional().describe('Max files to scan under root, default 20000'),
    }
  ),

  def('asset_reference_binding_matrix',
    'Read-only matrix for asset reference binding support across SpriteFrame, Material, Font, AudioClip, Prefab, AnimationClip, Atlas, SkeletonData, and generic UUID references.',
    {
      root: z.string().optional().describe('db://assets root to scan, default db://assets'),
      path: z.string().optional().describe('Alias for root'),
      families: z.array(z.string()).optional().describe('Optional family filter, e.g. SpriteFrame, Material, Font, AudioClip, Prefab, AnimationClip, Atlas, SkeletonData, GenericUUID'),
      maxSamples: z.number().optional().describe('Max sample assets per family, default 3'),
      maxFiles: z.number().optional().describe('Max files to scan under root, default 20000'),
    }
  ),

  def('create_ui_from_spec',
    'Create a Cocos UI node tree from a platform-neutral UI spec and commit it to a prefab.',
    {
      spec: z.record(z.any()).optional().describe('UI spec object matching extensions/cocos-creator-38-mcp/templates/ui/ui-spec.schema.json'),
      specPath: z.string().optional().describe('Path to a JSON UI spec, e.g. extensions/cocos-creator-38-mcp/templates/ui/examples/GenericPanel.json'),
      parentId: z.string().optional().describe('Parent node UUID for the temporary source tree'),
      prefabPath: z.string().optional().describe('Override output prefab db path'),
      cleanupSource: z.boolean().optional().describe('Delete the temporary source node after prefab creation (default true)'),
      overwrite: z.boolean().optional().describe('Replace an existing prefab at the target path'),
      readConsole: z.boolean().optional().describe('Read recent console errors during prefab validation'),
      consoleCount: z.number().optional().describe('Number of recent console errors to include'),
    }
  ),

  def('export_ui_spec_from_node',
    'Export a platform-neutral UI spec from a live node tree or a prefab asset.',
    {
      nodeId: z.string().optional().describe('Root node UUID to export'),
      id: z.string().optional().describe('Alias for nodeId'),
      path: z.string().optional().describe('Root node path to export'),
      prefabPath: z.string().optional().describe('Prefab db path to export without manually editing it'),
      outputPrefabPath: z.string().optional().describe('Prefab path to place in the exported spec'),
      outputPath: z.string().optional().describe('Project-relative, absolute, or db:// path to write the exported JSON spec'),
      name: z.string().optional().describe('Override spec name'),
      description: z.string().optional().describe('Override spec description'),
    }
  ),

  def('validate_ui_resource_map',
    'Validate resource references in a platform-neutral UI spec without creating nodes, opening prefabs, or switching editor tabs.',
    {
      spec: z.record(z.any()).optional().describe('UI spec object to inspect for resource references'),
      specPath: z.string().optional().describe('Path to a JSON UI spec'),
      prefabPath: z.string().optional().describe('Override prefab db path used only in the returned evidence'),
      strict: z.boolean().optional().describe('Throw when unresolved or malformed resource references are found'),
    }
  ),

  def('validate_ui_prefab_static',
    'Statically diff a generated UI prefab against a platform-neutral UI spec without opening or switching prefab tabs.',
    {
      spec: z.record(z.any()).optional().describe('UI spec object to validate against'),
      specPath: z.string().optional().describe('Path to a JSON UI spec'),
      prefabPath: z.string().optional().describe('Override prefab db path'),
      strict: z.boolean().optional().describe('Throw when static diff mismatches are found'),
      includeTree: z.boolean().optional().describe('Include parsed prefab tree in the response'),
    }
  ),

  def('export_prefab_full_spec',
    'Read-only full prefab static export: serialized node/component tree, transform/UITransform, raw component properties, asset references, prefab info, and missing custom component diagnostics without opening prefab tabs.',
    {
      path: z.string().optional().describe('Prefab db:// path, project-relative path, absolute path, or absolute source prefab path'),
      prefabPath: z.string().optional().describe('Alias for path'),
      snapshot: z.array(z.any()).optional().describe('Optional serialized prefab object array'),
      content: z.string().optional().describe('Optional serialized prefab JSON string'),
      subtreePath: z.string().optional().describe('Optional source node path to export as the root'),
      nodePath: z.string().optional().describe('Alias for subtreePath'),
      outputPath: z.string().optional().describe('Writable JSON output path; protected Cocos asset extensions are refused'),
      includeGraph: z.boolean().optional().describe('Include full reference graph edges/nodes, default true'),
      includeRawNodes: z.boolean().optional().describe('Include raw serialized node objects, default true'),
    }
  ),

  def('inspect_prefab_full_static',
    'Alias of export_prefab_full_spec for read-only full prefab static inspection without opening or mutating prefab assets.',
    {
      path: z.string().optional().describe('Prefab db:// path, project-relative path, absolute path, or absolute source prefab path'),
      prefabPath: z.string().optional().describe('Alias for path'),
      snapshot: z.array(z.any()).optional().describe('Optional serialized prefab object array'),
      content: z.string().optional().describe('Optional serialized prefab JSON string'),
      subtreePath: z.string().optional().describe('Optional source node path to export as the root'),
      nodePath: z.string().optional().describe('Alias for subtreePath'),
      outputPath: z.string().optional().describe('Writable JSON output path'),
      includeGraph: z.boolean().optional().describe('Include full reference graph edges/nodes, default true'),
      includeRawNodes: z.boolean().optional().describe('Include raw serialized node objects, default true'),
    }
  ),

  def('offline_prefab_read_spec',
    'Read-only offline prefab inspection for Cocos serialized .prefab JSON without opening editor tabs.',
    {
      path: z.string().optional().describe('Prefab db:// path, project-relative path, absolute path, or snapshot source label'),
      prefabPath: z.string().optional().describe('Alias for path'),
      snapshot: z.array(z.any()).optional().describe('Optional serialized prefab object array'),
      content: z.string().optional().describe('Optional serialized prefab JSON string'),
      includeTree: z.boolean().optional().describe('Include parsed node tree'),
      includeGraph: z.boolean().optional().describe('Include asset reference graph'),
    }
  ),

  def('inspect_prefab_offline_static',
    'Alias of offline_prefab_read_spec for offline static prefab inspection.',
    {
      path: z.string().optional().describe('Prefab db:// path, project-relative path, absolute path, or snapshot source label'),
      prefabPath: z.string().optional().describe('Alias for path'),
      snapshot: z.array(z.any()).optional().describe('Optional serialized prefab object array'),
      content: z.string().optional().describe('Optional serialized prefab JSON string'),
      includeTree: z.boolean().optional().describe('Include parsed node tree'),
      includeGraph: z.boolean().optional().describe('Include asset reference graph'),
    }
  ),

  def('validate_prefab_offline_integrity',
    'Validate serialized .prefab integrity offline: cc.Prefab/root, __id__ ranges, child/component refs, asset refs, and custom components.',
    {
      path: z.string().optional().describe('Prefab db:// path, project-relative path, or absolute path'),
      prefabPath: z.string().optional().describe('Alias for path'),
      snapshot: z.array(z.any()).optional().describe('Optional serialized prefab object array'),
      content: z.string().optional().describe('Optional serialized prefab JSON string'),
      includeGraph: z.boolean().optional().describe('Include asset reference graph'),
      strict: z.boolean().optional().describe('Throw when integrity diagnostics are present'),
    }
  ),

  def('offline_prefab_write_from_full_spec',
    'Explicit opt-in guarded offline .prefab writer from raw full prefab spec/source prefab. Writes only db://assets .prefab files with backup, validation, rollback, AssetDB refresh, and static verification.',
    {
      spec: z.record(z.any()).optional().describe('Full prefab spec object with raw node/component data'),
      specPath: z.string().optional().describe('Full prefab spec JSON path'),
      path: z.string().optional().describe('Source prefab/full spec path'),
      sourcePath: z.string().optional().describe('Alias for path'),
      subtreePath: z.string().optional().describe('Optional source subtree path'),
      nodePath: z.string().optional().describe('Alias for subtreePath'),
      prefabPath: z.string().describe('Target prefab db://assets/.../*.prefab path'),
      name: z.string().optional().describe('Output/root name override'),
      rootName: z.string().optional().describe('Output/root name override'),
      overwrite: z.boolean().optional().describe('Overwrite existing target prefab'),
      dryRun: z.boolean().optional().describe('Validate and report without writing'),
      backup: z.boolean().optional().describe('Backup existing target before replace; default true'),
      rollbackOnFailure: z.boolean().optional().describe('Restore backup/remove new file on validation failure; default true'),
      strictResources: z.boolean().optional().describe('Fail before write when asset references are unresolved'),
      customComponentPolicy: z.enum(['report', 'require', 'strip-missing']).optional().describe('Custom component policy. strip-missing removes unresolved custom script components while preserving visual nodes/components.'),
      stripMissingCustomComponents: z.boolean().optional().describe('Alias for customComponentPolicy:"strip-missing"'),
      buttonEventPolicy: z.enum(['report', 'strip-broken']).optional().describe('Button click event policy. strip-broken removes invalid event bindings for visual-only prefab migration.'),
      stripBrokenButtonClickEvents: z.boolean().optional().describe('Alias for buttonEventPolicy:"strip-broken"'),
      resourceRemap: z.record(z.any()).optional().describe('Resource remap direct map or wrapper'),
      resourceMap: z.record(z.any()).optional().describe('Alias/wrapper for resourceRemap'),
      remap: z.record(z.any()).optional().describe('Alias/wrapper for resourceRemap'),
      map: z.record(z.any()).optional().describe('Alias/wrapper for resourceRemap'),
      resourceRemapPath: z.string().optional().describe('JSON remap file path'),
      resourceMapPath: z.string().optional().describe('Alias for resourceRemapPath'),
      remapPath: z.string().optional().describe('Alias for resourceRemapPath'),
      mapPath: z.string().optional().describe('Alias for resourceRemapPath'),
      tolerance: z.number().optional().describe('Diff tolerance, default 0.5'),
      includeExportAfter: z.boolean().optional().describe('Include exported target full spec'),
    }
  ),

  def('create_prefab_from_full_spec_offline',
    'Alias of offline_prefab_write_from_full_spec for explicit offline full-spec .prefab creation.',
    {
      spec: z.record(z.any()).optional().describe('Full prefab spec object with raw node/component data'),
      specPath: z.string().optional().describe('Full prefab spec JSON path'),
      path: z.string().optional().describe('Source prefab/full spec path'),
      sourcePath: z.string().optional().describe('Alias for path'),
      subtreePath: z.string().optional().describe('Optional source subtree path'),
      nodePath: z.string().optional().describe('Alias for subtreePath'),
      prefabPath: z.string().describe('Target prefab db://assets/.../*.prefab path'),
      name: z.string().optional(),
      rootName: z.string().optional(),
      overwrite: z.boolean().optional(),
      dryRun: z.boolean().optional(),
      backup: z.boolean().optional(),
      rollbackOnFailure: z.boolean().optional(),
      strictResources: z.boolean().optional(),
      customComponentPolicy: z.enum(['report', 'require', 'strip-missing']).optional(),
      stripMissingCustomComponents: z.boolean().optional(),
      buttonEventPolicy: z.enum(['report', 'strip-broken']).optional(),
      stripBrokenButtonClickEvents: z.boolean().optional(),
      resourceRemap: z.record(z.any()).optional(),
      resourceMap: z.record(z.any()).optional(),
      remap: z.record(z.any()).optional(),
      map: z.record(z.any()).optional(),
      resourceRemapPath: z.string().optional(),
      resourceMapPath: z.string().optional(),
      remapPath: z.string().optional(),
      mapPath: z.string().optional(),
      tolerance: z.number().optional(),
      includeExportAfter: z.boolean().optional(),
    }
  ),

  def('offline_prefab_patch',
    'Guarded offline .prefab patch using structured JSON graph operations. Supports update_node_transform, reorder_children, append_prefab_subtree, normalize_sprite_atlas_references, normalize_prefab_openable_metadata, and migrate_deprecated_label_effect_components.',
    {
      path: z.string().optional().describe('Source prefab path'),
      prefabPath: z.string().optional().describe('Alias for path and default write target'),
      outputPath: z.string().optional().describe('Optional output prefab path'),
      targetPath: z.string().optional().describe('Alias for outputPath'),
      operations: z.array(z.record(z.any())).describe('Patch operations'),
      overwrite: z.boolean().optional().describe('Overwrite target; default true for patch'),
      dryRun: z.boolean().optional(),
      backup: z.boolean().optional(),
      rollbackOnFailure: z.boolean().optional(),
      strictResources: z.boolean().optional(),
    }
  ),

  def('diff_prefab_full_spec',
    'Compare two full prefab specs or prefab assets, including nodes, transform/UITransform, components, key serialized properties, and resource references with numeric tolerance.',
    {
      sourceSpec: z.record(z.any()).optional().describe('Source/original full prefab spec object'),
      originalSpec: z.record(z.any()).optional().describe('Alias for sourceSpec'),
      leftSpec: z.record(z.any()).optional().describe('Alias for sourceSpec'),
      beforeSpec: z.record(z.any()).optional().describe('Alias for sourceSpec'),
      targetSpec: z.record(z.any()).optional().describe('Target/current full prefab spec object'),
      currentSpec: z.record(z.any()).optional().describe('Alias for targetSpec'),
      rightSpec: z.record(z.any()).optional().describe('Alias for targetSpec'),
      afterSpec: z.record(z.any()).optional().describe('Alias for targetSpec'),
      sourcePath: z.string().optional().describe('Source/original prefab or full spec JSON path'),
      originalPath: z.string().optional().describe('Alias for sourcePath'),
      leftPath: z.string().optional().describe('Alias for sourcePath'),
      beforePath: z.string().optional().describe('Alias for sourcePath'),
      targetPath: z.string().optional().describe('Target/current prefab or full spec JSON path'),
      currentPath: z.string().optional().describe('Alias for targetPath'),
      rightPath: z.string().optional().describe('Alias for targetPath'),
      afterPath: z.string().optional().describe('Alias for targetPath'),
      sourceSubtreePath: z.string().optional().describe('Optional source subtree path'),
      originalSubtreePath: z.string().optional().describe('Alias for sourceSubtreePath'),
      targetSubtreePath: z.string().optional().describe('Optional target subtree path'),
      currentSubtreePath: z.string().optional().describe('Alias for targetSubtreePath'),
      tolerance: z.number().optional().describe('Numeric tolerance for transform/size comparison, default 0.5'),
      strict: z.boolean().optional().describe('Throw when any diff is found'),
      outputPath: z.string().optional().describe('Writable JSON diff report path'),
    }
  ),

  def('validate_prefab_against_full_spec',
    'Validate a target prefab asset against a full prefab spec or original prefab subtree, returning structured diff diagnostics and optional strict failure.',
    {
      spec: z.record(z.any()).optional().describe('Source/original full prefab spec object'),
      sourceSpec: z.record(z.any()).optional().describe('Alias for spec'),
      originalSpec: z.record(z.any()).optional().describe('Alias for spec'),
      sourcePath: z.string().optional().describe('Source/original prefab or full spec JSON path'),
      originalPath: z.string().optional().describe('Alias for sourcePath'),
      prefabPath: z.string().optional().describe('Target/current prefab path'),
      path: z.string().optional().describe('Alias for target/current prefab path'),
      targetPath: z.string().optional().describe('Alias for target/current prefab path'),
      currentPath: z.string().optional().describe('Alias for target/current prefab path'),
      sourceSubtreePath: z.string().optional().describe('Optional source subtree path'),
      originalSubtreePath: z.string().optional().describe('Alias for sourceSubtreePath'),
      targetSubtreePath: z.string().optional().describe('Optional target subtree path'),
      currentSubtreePath: z.string().optional().describe('Alias for targetSubtreePath'),
      tolerance: z.number().optional().describe('Numeric tolerance, default 0.5'),
      strict: z.boolean().optional().describe('Throw when any diff is found'),
      outputPath: z.string().optional().describe('Writable JSON diff report path'),
    }
  ),

  def('create_prefab_from_full_spec',
    'Replay a supported subset of a full prefab spec through Cocos Editor APIs into a prefab, then export/diff for acceptance; unsupported/custom/spine/raw properties are reported as structured partial diagnostics.',
    {
      spec: z.record(z.any()).optional().describe('Full prefab spec object'),
      specPath: z.string().optional().describe('Full prefab spec JSON path'),
      path: z.string().optional().describe('Source prefab/full spec path'),
      sourcePath: z.string().optional().describe('Alias for path'),
      subtreePath: z.string().optional().describe('Optional source subtree path'),
      nodePath: z.string().optional().describe('Alias for subtreePath'),
      prefabPath: z.string().optional().describe('Requested output prefab db:// path'),
      name: z.string().optional().describe('Output/root name override'),
      rootName: z.string().optional().describe('Output/root name override'),
      overwrite: z.boolean().optional().describe('Overwrite existing target prefab'),
      strictResources: z.boolean().optional().describe('Fail before creation when source references cannot be resolved'),
      strictCustomComponents: z.boolean().optional().describe('Fail before creation when source custom script components cannot be resolved and replayed'),
      customComponentPolicy: z.enum(['skip', 'report', 'require']).optional().describe('Custom component handling policy; report is the default, require blocks missing scripts'),
      strictSkeleton: z.boolean().optional().describe('Fail before creation when sp.Skeleton replay/readback is not fully proven'),
      resourceRemap: z.record(z.any()).optional().describe('Generic resource remap: original UUID/path -> current project UUID/db path'),
      resourceRoots: z.array(z.string()).optional().describe('Generic source/current resource roots used for diagnostics or future remap building'),
      importRoots: z.array(z.record(z.any())).optional().describe('Generic import root mappings, e.g. { sourceRoot, targetRoot }; no business defaults'),
      readConsole: z.boolean().optional().describe('Read recent console errors during creation/validation'),
      cleanupSource: z.boolean().optional().describe('Cleanup temporary source node when safe'),
      tolerance: z.number().optional().describe('Diff numeric tolerance, default 0.5'),
      includeReplaySpec: z.boolean().optional().describe('Include generated intermediate UI spec'),
      includeExportAfter: z.boolean().optional().describe('Include full spec exported from created prefab'),
      skipUnprovenSkeletonComponents: z.boolean().optional().describe('Skip sp.Skeleton components when editor write/readback is not proven; node structure is still replayed and partial diagnostics report skipped components'),
      allowLargeReplay: z.boolean().optional().describe('Explicitly allow one-shot replay when node count exceeds maxReplayNodes; callers must provide enough timeout and accept cleanup responsibility'),
      maxReplayNodes: z.number().optional().describe('Safe one-shot replay node threshold before create_prefab_from_full_spec blocks without mutation; default 160'),
      fallbackToOffline: z.boolean().optional().describe('When editor replay is blocked, allow explicit fallback to guarded offline prefab writer only if offlineWrite is also true'),
      offlineWrite: z.boolean().optional().describe('Explicit opt-in to guarded offline .prefab writing fallback'),
      dryRun: z.boolean().optional().describe('For offline fallback, validate and report without writing'),
      backup: z.boolean().optional().describe('For offline fallback, backup existing target before replace; default true'),
      rollbackOnFailure: z.boolean().optional().describe('For offline fallback, rollback failed writes; default true'),
      authoringMode: z.enum(['source-node-create-prefab', 'prefab-edit-context', 'offline-prefab-write']).optional().describe('Replay authoring path; offline-prefab-write is an explicit opt-in guarded offline fallback/recovery/replay lane'),
    }
  ),

  def('prefab_replay_pipeline',
    'Parameterized full prefab replay pipeline: export source, replay target, export target, diff, static validate, and optional editor-openable check with structured stop-on-failure.',
    {
      sourcePath: z.string().optional().describe('Source prefab/full spec path'),
      path: z.string().optional().describe('Alias for sourcePath'),
      spec: z.record(z.any()).optional().describe('Full prefab spec object'),
      specPath: z.string().optional().describe('Full prefab spec JSON path'),
      sourceSubtreePath: z.string().optional().describe('Optional source subtree path'),
      subtreePath: z.string().optional().describe('Alias for sourceSubtreePath'),
      targetPrefabPath: z.string().optional().describe('Target prefab db://assets path'),
      prefabPath: z.string().optional().describe('Alias for targetPrefabPath'),
      targetPath: z.string().optional().describe('Alias for targetPrefabPath'),
      rootName: z.string().optional().describe('Target root name override'),
      resourceRemap: z.record(z.any()).optional().describe('Direct remap or wrapper map'),
      resourceMap: z.record(z.any()).optional(),
      remap: z.record(z.any()).optional(),
      map: z.record(z.any()).optional(),
      resourceRemapPath: z.string().optional(),
      resourceMapPath: z.string().optional(),
      remapPath: z.string().optional(),
      mapPath: z.string().optional(),
      reportPath: z.string().optional().describe('Writable JSON pipeline report path'),
      overwrite: z.boolean().optional(),
      strictResources: z.boolean().optional(),
      strictCustomComponents: z.boolean().optional(),
      strictSkeleton: z.boolean().optional(),
      strictLayout: z.boolean().optional(),
      strictStatic: z.boolean().optional(),
      tolerance: z.number().optional().describe('Diff numeric tolerance, default 0.5'),
      cleanupSource: z.boolean().optional(),
      openableCheck: z.boolean().optional(),
      readConsole: z.boolean().optional(),
      includeRawNodes: z.boolean().optional(),
      includeReplaySpec: z.boolean().optional(),
      includeCreateResult: z.boolean().optional(),
      includeDiff: z.boolean().optional(),
      ignoreRootName: z.boolean().optional(),
      allowLargeReplay: z.boolean().optional(),
      maxReplayNodes: z.number().optional(),
      authoringMode: z.enum(['source-node-create-prefab', 'prefab-edit-context']).optional(),
    }
  ),

  def('validate_prefab_static_v2',
    'Read-only prefab static validation v2: node tree, components, UI controls, scripts/properties, Button events, and asset reference UUID/type diagnostics without opening prefab tabs.',
    {
      path: z.string().optional().describe('Prefab db path, e.g. "db://assets/prefabs/MyPanel.prefab"'),
      prefabPath: z.string().optional().describe('Alias for path'),
      snapshot: z.array(z.any()).optional().describe('Optional in-memory serialized prefab object array for negative/static tests'),
      content: z.string().optional().describe('Optional serialized prefab JSON content for negative/static tests'),
      expectNodePaths: z.array(z.string()).optional().describe('Expected static node paths'),
      expectedNodePaths: z.array(z.string()).optional().describe('Alias for expectNodePaths'),
      expectComponents: z.array(z.record(z.any())).optional().describe('Expected components; supports component/type, nodePath, scriptPath/scriptUuid, and properties'),
      expectedComponents: z.array(z.record(z.any())).optional().describe('Alias for expectComponents'),
      expectButtonClickEvents: z.array(z.record(z.any())).optional().describe('Expected Button click events with buttonNodePath, targetNodePath, component, handler, and customEventData'),
      expectedButtonClickEvents: z.array(z.record(z.any())).optional().describe('Alias for expectButtonClickEvents'),
      expectReferenceTypes: z.array(z.string()).optional().describe('Expected resolved asset reference types such as SpriteFrame, Material, AnimationClip, AudioClip, Font, Prefab'),
      expectedReferenceTypes: z.array(z.string()).optional().describe('Alias for expectReferenceTypes'),
      expectReferences: z.array(z.record(z.any())).optional().describe('Expected resolved reference edges; supports ownerNodePath, component/ownerComponent, propertyName, expectedType, uuid'),
      expectedReferences: z.array(z.record(z.any())).optional().describe('Alias for expectReferences'),
      expected: z.record(z.any()).optional().describe('Grouped expectations: nodePaths, components, buttonClickEvents, referenceTypes, references'),
      strict: z.boolean().optional().describe('Throw when static validation diagnostics are present'),
      includeTree: z.boolean().optional().describe('Include parsed tree and flat node evidence'),
      includeGraph: z.boolean().optional().describe('Include reference graph edges/nodes'),
      editorOpenable: z.boolean().optional().describe('Run static Cocos Creator prefab-openable metadata diagnostics without opening the prefab'),
      strictEditorOpenable: z.boolean().optional().describe('Require Creator-openable PrefabInfo/CompPrefabInfo/transform metadata and fail diagnostics when missing'),
    }
  ),

  def('validate_prefab_editor_openable',
    'Validate that a prefab is statically Creator-openable, then safely open/readback/guarded-close it without asking the user to save.',
    {
      path: z.string().optional().describe('Prefab db path, e.g. db://assets/prefabs/MyPanel.prefab'),
      prefabPath: z.string().optional().describe('Alias for path'),
      strict: z.boolean().optional().describe('Run strict static validation before opening'),
      strictEditorOpenable: z.boolean().optional().describe('Require Creator-openable metadata before opening'),
      failOnWarnings: z.boolean().optional().describe('Fail if fresh warnings are emitted during open/readback/close'),
      readConsole: z.boolean().optional().describe('Collect console evidence during editor operations'),
      consoleCount: z.number().optional().describe('Console entry limit'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      closeAfterOpen: z.boolean().optional().describe('Guarded-close after readback; default true'),
    }
  ),

  def('validate_prefab_material_references',
    'Statically validate that Sprite customMaterial references in a prefab are backed by existing project .mtl assets.',
    {
      prefabPath: z.string().optional().describe('Prefab db path'),
      path: z.string().optional().describe('Alias for prefabPath'),
      strict: z.boolean().optional().describe('Throw when missing material references are found'),
    }
  ),

  def('inspect_reference_graph',
    'Build a read-only static reference graph for targeted Cocos serialized assets without opening scenes/prefabs or editing protected assets.',
    {
      path: z.string().optional().describe('db:// path or project-relative path to a serialized Cocos asset'),
      prefabPath: z.string().optional().describe('Alias for path when scanning a prefab'),
      scenePath: z.string().optional().describe('Alias for path when scanning a scene'),
      paths: z.array(z.string()).optional().describe('Multiple targeted asset paths'),
      mode: z.enum(['targeted', 'release-gate']).optional().describe('Targeted single/multi-asset scan or release-gate scan'),
      root: z.string().optional().describe('Root db:// path for release-gate/all scans'),
      all: z.boolean().optional().describe('Scan all supported serialized assets under root'),
      releaseGate: z.boolean().optional().describe('Return release-gate validation semantics'),
      maxAssets: z.number().optional().describe('Maximum assets to scan in release-gate/all mode'),
      includeNodes: z.boolean().optional().describe('Include node/component graph nodes'),
      includeEdges: z.boolean().optional().describe('Include reference edges'),
      strict: z.boolean().optional().describe('Throw when broken references are found'),
    }
  ),

  def('validate_project_references',
    'Validate targeted or release-gate project references and fail on missing scripts, stale UUIDs, wrong asset types, broken button events, script property mismatches, or material/customMaterial gaps.',
    {
      path: z.string().optional().describe('db:// path or project-relative path to a serialized Cocos asset'),
      prefabPath: z.string().optional().describe('Alias for path when scanning a prefab'),
      scenePath: z.string().optional().describe('Alias for path when scanning a scene'),
      paths: z.array(z.string()).optional().describe('Multiple targeted asset paths'),
      mode: z.enum(['targeted', 'release-gate']).optional().describe('Targeted single/multi-asset scan or release-gate scan'),
      root: z.string().optional().describe('Root db:// path for release-gate/all scans'),
      all: z.boolean().optional().describe('Scan all supported serialized assets under root'),
      releaseGate: z.boolean().optional().describe('Return release-gate validation semantics'),
      maxAssets: z.number().optional().describe('Maximum assets to scan in release-gate/all mode'),
      includeNodes: z.boolean().optional().describe('Include node/component graph nodes'),
      includeEdges: z.boolean().optional().describe('Include reference edges'),
      strict: z.boolean().optional().describe('Throw when broken references are found'),
    }
  ),

  def('manage_asset',
    'Asset operations: create, delete, move, copy, get_info, refresh. Works with any asset type.',
    {
      action: z.enum(['create', 'update', 'write', 'delete', 'move', 'copy', 'get_info', 'refresh']).describe('Asset operation'),
      path: z.string().optional().describe('Asset db path, e.g. "db://assets/textures/bg.png"'),
      content: z.string().optional().describe('File content (for create with text-based assets)'),
      destPath: z.string().optional().describe('Destination path (for move/copy)'),
      overwrite: z.boolean().optional().describe('Allow overwrite where supported'),
      missingOk: z.boolean().optional().describe('Treat missing assets as skipped for delete'),
      silent: z.boolean().optional().describe('Suppress expected missing/delete noise'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
    }
  ),

  def('manage_resource_fixture',
    'Create, list, inspect, and delete neutral project-owned resource fixtures under reserved MCP cleanup roots for texture/SpriteFrame, font, audio, atlas, tilemap, and VFX regression coverage.',
    {
      action: z.enum(['policy', 'create', 'import', 'list', 'get_info', 'inspect', 'delete', 'cleanup']).optional().describe('Fixture operation, default create'),
      kind: z.enum(['texture', 'sprite-frame', 'font', 'audio', 'audio-clip', 'atlas', 'tilemap', 'vfx', 'particle']).optional().describe('Neutral fixture kind'),
      type: z.string().optional().describe('Alias for kind'),
      root: z.string().optional().describe('Reserved fixture root, default db://assets/__mcp_regression__/resource-fixtures'),
      fixtureRoot: z.string().optional().describe('Alias for root'),
      path: z.string().optional().describe('Explicit fixture asset path under a reserved root'),
      assetPath: z.string().optional().describe('Alias for path'),
      name: z.string().optional().describe('Fixture file base name'),
      pattern: z.string().optional().describe('List filter pattern'),
      maxResults: z.number().optional().describe('Maximum list results'),
      content: z.string().optional().describe('Optional text content override for text fixtures'),
      properties: z.record(z.any()).optional().describe('Optional VFX plist properties'),
      overwrite: z.boolean().optional().describe('Replace existing fixture asset when true'),
      dryRun: z.boolean().optional().describe('For delete/cleanup, report target without deleting'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect fresh console evidence after operation'),
    }
  ),

  def('manage_script',
    'Script operations: create (with Cocos template), read, write, delete, validate syntax, bind to node as component.',
    {
      action: z.enum(['create', 'read', 'write', 'delete', 'validate', 'bind']).describe('Script operation'),
      path: z.string().optional().describe('Script db path, e.g. "db://assets/scripts/GameCtrl.js"'),
      content: z.string().optional().describe('Script content (for create/write)'),
      nodeId: z.string().optional().describe('Node UUID (for bind action)'),
      className: z.string().optional().describe('Script class name (for bind, if different from filename)'),
      expectedClass: z.string().optional().describe('Expected exported Component class name for contract validation'),
      expectedProperties: z.array(z.record(z.any())).optional().describe('Expected @property declarations for contract validation'),
      validateContract: z.boolean().optional().describe('Set false to skip Cocos component contract preflight on create/write'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Treat missing scripts as a skipped result for delete operations'),
      missingOk: z.boolean().optional().describe('Treat missing scripts as a skipped result for delete operations'),
    }
  ),

  def('inspect_script_properties',
    'Inspect serialized @property declarations in a Cocos script so AI can bind Node, Component, Prefab, and asset references safely.',
    {
      path: z.string().optional().describe('Script db path, project path, or absolute path'),
      content: z.string().optional().describe('Script source to inspect directly'),
    }
  ),

  def('validate_script_contract',
    'Validate a Cocos Creator 3.8 component script contract without importing it: syntax, @ccclass, exported Component subclass, expected class, and expected @property declarations.',
    {
      path: z.string().optional().describe('Script db path, project path, or absolute path'),
      scriptPath: z.string().optional().describe('Alias for path'),
      content: z.string().optional().describe('Script source to validate directly'),
      expectedClass: z.string().optional().describe('Expected exported Component class name'),
      className: z.string().optional().describe('Alias for expectedClass'),
      expectedProperties: z.array(z.record(z.any())).optional().describe('Expected @property declarations with name, optional type, and optional bindKind'),
      expectProperties: z.array(z.record(z.any())).optional().describe('Alias for expectedProperties'),
      strict: z.boolean().optional().describe('Throw when contract diagnostics are present'),
    }
  ),

  def('bind_node_property',
    'Bind a scene or prefab node, or a component on that node, to a script/component property through the editor scene context.',
    {
      nodeId: z.string().describe('Node UUID/path that owns the script/component property'),
      component: z.string().optional().describe('Script/component class name that owns the property'),
      componentType: z.string().optional().describe('Alias for component'),
      propertyName: z.string().describe('Property name to bind'),
      targetNodeId: z.string().optional().describe('Node UUID/path to assign to the property'),
      targetPath: z.string().optional().describe('Alias for targetNodeId'),
      valueType: z.string().optional().describe('Expected value type: Node, Label, Sprite, or another component name'),
      clear: z.boolean().optional().describe('Clear the property instead of binding a target'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for binding'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after binding'),
    }
  ),

  def('bind_asset_property',
    'Bind an asset such as Prefab, SpriteFrame, Font, or AudioClip to a script/component property through the editor scene context.',
    {
      nodeId: z.string().describe('Node UUID/path that owns the script/component property'),
      component: z.string().optional().describe('Script/component class name that owns the property'),
      componentType: z.string().optional().describe('Alias for component'),
      propertyName: z.string().describe('Property name to bind'),
      assetPath: z.string().optional().describe('Asset db path, e.g. db://assets/prefabs/Card.prefab'),
      path: z.string().optional().describe('Alias for assetPath'),
      uuid: z.string().optional().describe('Asset UUID or sub-asset UUID'),
      assetType: z.string().optional().describe('Expected asset type, e.g. Prefab, SpriteFrame, Font, AudioClip'),
      clear: z.boolean().optional().describe('Clear the property instead of binding an asset'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for binding'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after binding'),
    }
  ),

  def('refresh_sprite_render_state',
    'Refresh cc.Sprite material/render state after SpriteFrame or atlas binding, returning readback and console evidence.',
    {
      nodeId: z.string().optional().describe('Node UUID/path containing cc.Sprite'),
      id: z.string().optional().describe('Alias for nodeId'),
      path: z.string().optional().describe('Alias for nodeId'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for refresh'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after refresh'),
    }
  ),

  def('inspect_sprite_runtime_state',
    'Inspect runtime cc.Sprite, SpriteFrame, Texture, ImageAsset, UV, material, and renderability state for a scene or prefab-edit node.',
    {
      nodeId: z.string().optional().describe('Node UUID/path containing cc.Sprite'),
      id: z.string().optional().describe('Alias for nodeId'),
      path: z.string().optional().describe('Alias for nodeId'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for inspect'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after inspect'),
    }
  ),

  def('inspect_bound_property',
    'Inspect the current value of one script/component property on a node, useful for verifying node/component/asset bindings.',
    {
      nodeId: z.string().describe('Node UUID/path that owns the script/component property'),
      component: z.string().optional().describe('Script/component class name that owns the property'),
      componentType: z.string().optional().describe('Alias for component'),
      propertyName: z.string().describe('Property name to inspect'),
    }
  ),

  def('bind_button_click',
    'Bind, replace, append, or clear a cc.Button click event handler on a scene or prefab-edit node.',
    {
      nodeId: z.string().describe('Button node UUID/path'),
      buttonNodeId: z.string().optional().describe('Alias for nodeId'),
      targetNodeId: z.string().optional().describe('Node UUID/path that owns the handler component'),
      targetPath: z.string().optional().describe('Alias for targetNodeId'),
      component: z.string().optional().describe('Target script/component class name'),
      componentType: z.string().optional().describe('Alias for component'),
      handler: z.string().optional().describe('Handler method name'),
      method: z.string().optional().describe('Alias for handler'),
      customEventData: z.string().optional().describe('Optional custom event data string'),
      append: z.boolean().optional().describe('Append without replacing existing target+component binding'),
      clear: z.boolean().optional().describe('Clear matching click events instead of adding one'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for click binding'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after click binding'),
    }
  ),

  def('simulate_ui_event',
    'Simulate a simple UI event such as click or touch on a scene node for verification.',
    {
      nodeId: z.string().describe('Node UUID/path to receive the UI event'),
      event: z.enum(['click', 'touch-start', 'touch-end', 'touch-move']).optional().describe('Event type, default click'),
      eventType: z.string().optional().describe('Alias for event'),
      position: z.array(z.number()).optional().describe('Optional [x,y] event position'),
      silent: z.boolean().optional().describe('Suppress intermediate scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for simulated event'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after simulated event'),
    }
  ),

  def('runtime_input',
    'Runtime input simulation boundary and preflight. Validates target/coordinates/handler/readback evidence and blocks unsafe runtime event injection until preview control is proven.',
    {
      action: z.enum(['capabilities', 'status', 'preflight', 'simulate', 'click', 'touch', 'keyboard', 'key-down', 'key-up', 'directional']).optional().describe('Input action; runtime injection actions return blocked until preview/event injection support is proven'),
      event: z.enum(['click', 'touch-start', 'touch-end', 'touch-move', 'key-down', 'key-up', 'keyboard', 'directional']).optional().describe('Input event kind'),
      eventType: z.string().optional().describe('Alias for event'),
      kind: z.string().optional().describe('Alias for event when action=simulate'),
      type: z.string().optional().describe('Alias for event when action=simulate'),
      nodeId: z.string().optional().describe('Target UI node UUID/path'),
      targetNodeId: z.string().optional().describe('Alias for nodeId'),
      nodePath: z.string().optional().describe('Alias for nodeId'),
      targetPath: z.string().optional().describe('Alias for nodeId'),
      position: z.array(z.number()).optional().describe('Optional local [x,y] coordinate for click/touch preflight'),
      coordinates: z.array(z.number()).optional().describe('Alias for position'),
      point: z.record(z.any()).optional().describe('Optional {x,y} coordinate'),
      x: z.number().optional().describe('Optional x coordinate'),
      y: z.number().optional().describe('Optional y coordinate'),
      key: z.string().optional().describe('Keyboard key name for keyboard/key-down/key-up preflight'),
      direction: z.string().optional().describe('Directional input name'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      waitMs: z.number().optional().describe('Runtime probe wait before console read'),
      view: z.enum(['scene', 'game']).optional().describe('Runtime probe view target'),
      inspectScreenshotTargets: z.boolean().optional().describe('Ask runtime_probe to inspect screenshot targets'),
      consoleCount: z.number().optional().describe('Console entries to inspect'),
      count: z.number().optional().describe('Alias for consoleCount'),
      readWarnings: z.boolean().optional().describe('Include warnings in console evidence, default true'),
      failOnWarnings: z.boolean().optional().describe('Treat warnings as failures'),
      strict: z.boolean().optional().describe('Throw on invalid coordinate preflight'),
      hints: z.array(z.string()).optional().describe('Console error hint filters'),
      warningHints: z.array(z.string()).optional().describe('Console warning hint filters'),
    }
  ),

  def('runtime_physics_contact',
    'Runtime physics contact probe boundary. Preflights physics nodes/schemas/runtime probe/console evidence and blocks simulation/contact claims until dialog-free runtime stepping/readback exists.',
    {
      action: z.enum(['capabilities', 'status', 'preflight', 'probe', 'simulate', 'contact', 'wait', 'wait-for-contact']).optional().describe('Contact probe action; runtime simulation actions return blocked until stepping/contact readback support is proven'),
      actorNodeId: z.string().optional().describe('Actor/body A node UUID/path'),
      targetNodeId: z.string().optional().describe('Target/body B node UUID/path'),
      bodyA: z.string().optional().describe('Alias for actorNodeId'),
      bodyB: z.string().optional().describe('Alias for targetNodeId'),
      nodeA: z.string().optional().describe('Alias for actorNodeId'),
      nodeB: z.string().optional().describe('Alias for targetNodeId'),
      nodeId: z.string().optional().describe('Alias for actorNodeId'),
      otherNodeId: z.string().optional().describe('Alias for targetNodeId'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      waitMs: z.number().optional().describe('Runtime probe wait before console read'),
      timeoutMs: z.number().optional().describe('Future contact wait timeout; currently documented evidence only'),
      view: z.enum(['scene', 'game']).optional().describe('Runtime probe view target'),
      inspectScreenshotTargets: z.boolean().optional().describe('Ask runtime_probe to inspect screenshot targets'),
      consoleCount: z.number().optional().describe('Console entries to inspect'),
      count: z.number().optional().describe('Alias for consoleCount'),
      readWarnings: z.boolean().optional().describe('Include warnings in console evidence, default true'),
      failOnWarnings: z.boolean().optional().describe('Treat warnings as failures'),
      strict: z.boolean().optional().describe('Throw when actor/target pair is not provided'),
      hints: z.array(z.string()).optional().describe('Console error hint filters'),
      warningHints: z.array(z.string()).optional().describe('Console warning hint filters'),
    }
  ),

  def('list_assets',
    'List and search project assets by type, path pattern, or name. Returns db paths and metadata.',
    {
      type: z.enum(['all', 'script', 'texture', 'sprite-frame', 'prefab', 'scene', 'animation-clip', 'audio-clip', 'font', 'material']).optional().describe('Filter by asset type (default "all")'),
      path: z.string().optional().describe('Directory db path to list, e.g. "db://assets/textures"'),
      pattern: z.string().optional().describe('Name pattern to search'),
      maxResults: z.number().optional().describe('Max assets to return (default 200, max 500)'),
    }
  ),

  def('find_asset_by_role',
    'Find a project asset by generic asset role such as default_icon, default_button_bg, or panel_bg.',
    {
      role: z.string().describe('Generic asset role key from extensions/cocos-creator-38-mcp/templates/asset-roles.json'),
      category: z.string().optional().describe('Optional category hint such as button, currency, item, panel, font, or audio'),
      type: z.string().optional().describe('Optional expected asset type override'),
      includeMissing: z.boolean().optional().describe('Include candidate details when configured assets are missing'),
    }
  ),

  def('validate_asset_conventions',
    'Validate the generic asset role template against AssetDB and return missing role assets and convention hints.',
    {
      category: z.string().optional().describe('Optional category filter'),
      includeFound: z.boolean().optional().describe('Include found roles in results; default only missing roles'),
    }
  ),

  def('search_project',
    'Search text files in the project or assets folder. Skips .prefab/.fire/.meta and generated folders.',
    {
      query: z.string().describe('Text to search for'),
      path: z.string().optional().describe('Root db path, absolute project path, or project-relative path (default db://assets)'),
      include: z.array(z.string()).optional().describe('Include globs, e.g. ["*.js", "*.ts", "Script/**/*.js"]'),
      exclude: z.array(z.string()).optional().describe('Exclude globs or substrings'),
      maxResults: z.number().optional().describe('Max matches to return (default 50, max 500)'),
      contextLines: z.number().optional().describe('Context lines around each match (default 0, max 5)'),
    }
  ),

  def('get_sha',
    'Compute sha256/sha1/md5 for an asset or project file, useful for verifying generated content.',
    {
      path: z.string().describe('Asset db path, absolute project path, or project-relative path'),
      algorithm: z.enum(['sha256', 'sha1', 'md5']).optional().describe('Hash algorithm (default sha256)'),
    }
  ),

  def('validate_script',
    'Validate JavaScript/TypeScript syntax and optional Cocos component contract from a db path, project path, or direct content.',
    {
      path: z.string().optional().describe('Script db path or project file path'),
      content: z.string().optional().describe('Script source to validate directly'),
      expectedClass: z.string().optional().describe('Expected exported Component class name'),
      className: z.string().optional().describe('Alias for expectedClass'),
      expectedProperties: z.array(z.record(z.any())).optional().describe('Expected @property declarations with name, optional type, and optional bindKind'),
      expectProperties: z.array(z.record(z.any())).optional().describe('Alias for expectedProperties'),
      strict: z.boolean().optional().describe('Throw when contract diagnostics are present'),
    }
  ),

  def('manage_undo',
    'Explicit undo/redo wrapper for editor scene operations.',
    {
      action: z.enum(['undo', 'redo']).describe('Undo or redo'),
    }
  ),

  def('manage_texture',
    'Texture utilities: list textures, inspect texture/sprite-frame assets, or assign a spriteFrame to a Sprite node.',
    {
      action: z.enum(['list', 'get_info', 'set_sprite_frame']).describe('Texture operation'),
      path: z.string().optional().describe('Asset db path or search root'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      nodeId: z.string().optional().describe('Target node UUID for set_sprite_frame'),
      uuid: z.string().optional().describe('Texture or sprite-frame UUID'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for operation evidence'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Collect recent console errors after operation (default true)'),
      silent: z.boolean().optional().describe('Suppress scene panel notifications'),
    }
  ),

  def('manage_material',
    'Material utilities: list/create/inspect/update material assets or assign a material to a render component.',
    {
      action: z.enum(['list', 'get_info', 'create_material', 'set_property', 'inspect_properties', 'assign', 'validate_runtime_compile']).describe('Material operation'),
      path: z.string().optional().describe('Material db path or search root'),
      effectPath: z.string().optional().describe('Effect asset db path for create_material'),
      effectUuid: z.string().optional().describe('Effect asset UUID for create_material'),
      name: z.string().optional().describe('Material asset name'),
      properties: z.record(z.any()).optional().describe('Initial material property values'),
      propertyName: z.string().optional().describe('Property name for set_property'),
      value: z.any().optional().describe('Property value for set_property'),
      expectedType: z.string().optional().describe('Expected asset type for UUID-like property values'),
      overwrite: z.boolean().optional().describe('Allow replacing an existing .mtl/.effect asset, default true'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      nodeId: z.string().optional().describe('Target node UUID for assign'),
      uuid: z.string().optional().describe('Material UUID'),
      componentType: z.string().optional().describe('Render component type, e.g. cc.Sprite (default)'),
      slot: z.number().optional().describe('Material slot index (default 0)'),
      save: z.boolean().optional().describe('Save the current scene silently after assignment when supported'),
      saveScene: z.boolean().optional().describe('Alias for save'),
      silent: z.boolean().optional().describe('Suppress scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for material mutations or runtime shader validation'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating material actions'),
      waitMs: z.number().optional().describe('Milliseconds to wait after triggering render before reading console'),
      captureScreenshot: z.boolean().optional().describe('Capture scene/game screenshot to trigger rendering, default true'),
      view: z.enum(['scene', 'game']).optional().describe('View to capture for runtime compile validation'),
    }
  ),

  def('manage_shader',
    'Shader/effect utilities: list, inspect, and create project-owned effect assets without editing generated metadata.',
    {
      action: z.enum(['list', 'get_info', 'create_effect', 'release_subset', 'preset_status', 'validate_effect_source']).describe('Shader operation'),
      path: z.string().optional().describe('Shader db path or search root'),
      content: z.string().optional().describe('Effect source content for create_effect'),
      preset: z.string().optional().describe('Built-in effect preset, e.g. sprite_builtin_clone, sprite_tint, sprite_tint_glow, sprite_circle_mask, sprite_sweep_shine, sprite_water_ripple, sprite_wind_sway, mesh_energy_shield, mesh_noise_dissolve, mesh_motion_vertex, or outline'),
      name: z.string().optional().describe('Alias for preset in preset_status'),
      overwrite: z.boolean().optional().describe('Allow replacing an existing .effect asset, default true'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for create_effect'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after create_effect'),
    }
  ),

  def('manage_visual_effect',
    'High-level reusable visual-effect authoring: create preset effect/material assets, assign to a renderer, and optionally validate runtime shader compilation.',
    {
      action: z.enum(['create_preset', 'release_subset', 'preset_status']).describe('Visual-effect operation'),
      preset: z.string().optional().describe('Preset name, currently outline, sprite_tint_glow, sprite_circle_mask, sprite_sweep_shine, sprite_water_ripple, sprite_wind_sway, mesh_energy_shield, mesh_noise_dissolve, or mesh_motion_vertex'),
      nodeId: z.string().optional().describe('Target renderer node UUID/path when assign is not false'),
      componentType: z.string().optional().describe('Renderer component type, default cc.Sprite'),
      effectPath: z.string().optional().describe('Output .effect db path'),
      materialPath: z.string().optional().describe('Output .mtl db path'),
      materialName: z.string().optional().describe('Material asset name'),
      properties: z.record(z.any()).optional().describe('Material property overrides'),
      overwrite: z.boolean().optional().describe('Allow replacing existing effect/material assets, default true'),
      assign: z.boolean().optional().describe('Assign material to node, default true'),
      validateRuntime: z.boolean().optional().describe('Run runtime shader compile validation, default true'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after visual-effect authoring'),
      waitMs: z.number().optional().describe('Runtime validation wait milliseconds'),
      captureScreenshot: z.boolean().optional().describe('Capture scene/game screenshot to trigger render, default true'),
      view: z.enum(['scene', 'game']).optional().describe('View to capture for runtime validation'),
      silent: z.boolean().optional().describe('Suppress scene panel notifications'),
    }
  ),

  def('manage_audio',
    'Audio utilities: list audio clips, inspect clips, or assign an AudioClip to a cc.AudioSource node.',
    {
      action: z.enum(['list', 'get_info', 'assign', 'binding_status']).describe('Audio operation'),
      path: z.string().optional().describe('Audio clip db path or search root'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      nodeId: z.string().optional().describe('Target node UUID for assign'),
      uuid: z.string().optional().describe('AudioClip UUID'),
      properties: z.record(z.any()).optional().describe('Additional cc.AudioSource properties'),
      silent: z.boolean().optional().describe('Suppress scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for assign'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after assign'),
      requireReadback: z.boolean().optional().describe('Fail assign when AudioClip UUID readback does not match (default true)'),
      readbackTimeoutMs: z.number().optional().describe('Readback polling timeout in milliseconds'),
    }
  ),

  def('manage_font',
    'Font utilities: list fonts, inspect font assets, or assign a font to a cc.Label node.',
    {
      action: z.enum(['list', 'get_info', 'assign', 'binding_status']).describe('Font operation'),
      path: z.string().optional().describe('Font db path or search root'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      nodeId: z.string().optional().describe('Target label node UUID for assign'),
      uuid: z.string().optional().describe('Font UUID'),
      silent: z.boolean().optional().describe('Suppress scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for assign'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after assign'),
      requireReadback: z.boolean().optional().describe('Fail assign when Font UUID readback does not match (default true)'),
      readbackTimeoutMs: z.number().optional().describe('Readback polling timeout in milliseconds'),
    }
  ),

  def('manage_atlas',
    'Atlas utilities: list, inspect plist/atlas assets, resolve SpriteFrame entries, and bind supported atlas SpriteFrames to Sprite nodes.',
    {
      action: z.enum(['list', 'get_info', 'inspect', 'resolve_sprite_frame', 'bind_sprite_frame', 'binding_status']).describe('Atlas operation'),
      path: z.string().optional().describe('Atlas db path or search root'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      frameName: z.string().optional().describe('Atlas frame name for resolve/bind'),
      nodeId: z.string().optional().describe('Target Sprite node UUID for bind_sprite_frame'),
      uuid: z.string().optional().describe('Resolved SpriteFrame UUID override'),
      requireReadback: z.boolean().optional().describe('Fail bind when SpriteFrame UUID readback does not match (default true)'),
      readbackTimeoutMs: z.number().optional().describe('Readback polling timeout in milliseconds'),
      silent: z.boolean().optional().describe('Suppress scene notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after operation'),
    }
  ),

  def('manage_tilemap',
    'TileMap/Tiled utilities: list TMX/TSX assets, inspect TMX maps and referenced tilesets/images, and validate static references.',
    {
      action: z.enum(['list', 'get_info', 'inspect', 'validate_references', 'binding_status']).describe('TileMap operation'),
      path: z.string().optional().describe('TMX/TSX db path or search root'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after operation'),
    }
  ),

  def('manage_skeleton',
    'Skeleton animation utilities: list and inspect Spine/DragonBones skeleton assets.',
    {
      action: z.enum(['list', 'get_info']).describe('Skeleton operation'),
      path: z.string().optional().describe('Skeleton db path or search root'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
    }
  ),

  def('resolve_asset',
    'Resolve an asset by db path or UUID, including AssetDB metadata and sub-assets when available.',
    {
      path: z.string().optional().describe('Asset db path'),
      uuid: z.string().optional().describe('Asset UUID'),
    }
  ),

  def('doctor',
    'Run non-mutating diagnostics for the Cocos MCP bridge and current editor connection.',
    {}
  ),

  def('get_bridge_health',
    'Read-only startup health contract for MCP/Cocos/tooling state: project, version, tool count, queue, scene-script version, capability matrix, and recent errors.',
    {
      expectedSceneScriptVersion: z.string().optional().describe('Expected loaded scene-script version'),
      includeTools: z.boolean().optional().describe('Include full tool name list'),
      includeRecentErrors: z.boolean().optional().describe('Include recent MCP error logs (default true)'),
      errorLimit: z.number().optional().describe('Recent error limit'),
      sinceTs: z.number().optional().describe('Only include errors at or after this timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
    }
  ),

  def('refresh_cocos_engine_paths',
    'Write a manually selected Cocos Creator engine/editor source directory to settings/cocos-creator-38-mcp/engine-paths.json and .md for later API lookup. No automatic path detection is performed.',
    {
      path: z.string().optional().describe('Manually selected Cocos engine/editor source root directory'),
      sourceRoot: z.string().optional().describe('Alias for path'),
      engineSourcePath: z.string().optional().describe('Alias for path'),
    }
  ),

  def('get_cocos_engine_paths',
    'Read the manually configured Cocos Creator engine/editor source paths from settings/cocos-creator-38-mcp/engine-paths.json. Returns manual_source_path_required when not configured.',
    {}
  ),

  def('search_cocos_engine_api',
    'Read-only search for Cocos Creator editor IPC/API usage under the manually configured local source roots from settings/cocos-creator-38-mcp/engine-paths.json.',
    {
      query: z.string().optional().describe('Single text pattern to search'),
      patterns: z.array(z.string()).optional().describe('Multiple text patterns to search'),
      roots: z.array(z.string()).optional().describe('Root aliases or absolute roots: editor, engine3d, app, resources'),
      extensions: z.array(z.string()).optional().describe('File extensions to include, default JS/TS/JSON/MD'),
      maxResults: z.number().optional().describe('Maximum match count, capped by tool'),
      maxFiles: z.number().optional().describe('Maximum file count, capped by tool'),
      includeContext: z.boolean().optional().describe('Include matching line text; default true'),
      caseSensitive: z.boolean().optional().describe('Case-sensitive search; default false'),
    }
  ),

  def('execute_menu',
    'Execute a Cocos Creator editor menu command by menu path.',
    {
      menuPath: z.string().describe('Menu path to execute'),
    }
  ),

  def('get_editor_state',
    'Get lightweight editor state: project info, selection, status queue, and recent errors.',
    {}
  ),

  def('get_active_instances',
    'Scan local Cocos MCP editor HTTP bridges and list running Cocos Creator instances. Use this when more than one Cocos Creator 3.8 project may be open.',
    {}
  ),

  def('set_active_instance',
    'Select the active Cocos Editor bridge instance by port. Call get_active_instances first when multiple projects are open.',
    {
      port: z.number().optional().describe('HTTP bridge port of the target editor instance, e.g. 6800'),
      id: z.string().optional().describe('Alias for port; numeric strings are accepted'),
    }
  ),

  def('configure_client',
    'Return MCP client configuration for this Cocos project and platform without writing project rule files.',
    {
      platform: z.string().optional().describe('Target client platform, e.g. codex, claude, cursor, cline, roo, trae, windsurf, gemini, qwen, opencode, zed'),
      port: z.number().optional().describe('Editor HTTP bridge port (default 6800)'),
      syncRules: z.boolean().optional().describe('Deprecated compatibility flag; project rule synchronization is no longer performed'),
    }
  ),

  def('get_component_schema',
    'Inspect Cocos component properties and callable methods by component type.',
    {
      componentType: z.string().optional().describe('Component type, e.g. cc.Sprite, cc.Label, cc.ParticleSystem'),
      component: z.string().optional().describe('Alias for componentType'),
    }
  ),

  def('manage_vfx',
    'Particle/VFX utilities: list particle assets, inspect them, and control cc.ParticleSystem on nodes.',
    {
      action: z.enum(['release_subset', 'property_status', 'create_asset', 'list', 'get_info', 'add_particle', 'bind_file', 'update', 'play', 'stop', 'reset', 'get_state']).describe('VFX operation'),
      path: z.string().optional().describe('Particle asset db path or search root'),
      property: z.string().optional().describe('ParticleSystem2D property name for property_status'),
      propertyName: z.string().optional().describe('Alias for property in property_status'),
      pattern: z.string().optional().describe('Name pattern for list'),
      maxResults: z.number().optional().describe('Max assets to return for list (default 50)'),
      nodeId: z.string().optional().describe('Target node UUID'),
      id: z.string().optional().describe('Alias for nodeId'),
      uuid: z.string().optional().describe('Particle asset UUID for bind_file'),
      spriteFramePath: z.string().optional().describe('SpriteFrame image db path to sync onto ParticleSystem2D.spriteFrame/_spriteFrame when binding a particle file'),
      spriteFrameUuid: z.string().optional().describe('SpriteFrame UUID to sync onto ParticleSystem2D.spriteFrame/_spriteFrame when binding a particle file'),
      texturePath: z.string().optional().describe('Texture image db path used when creating a plist. Defaults to a project/internal particle texture copied beside the plist'),
      clearSpriteFrame: z.boolean().optional().describe('Clear ParticleSystem2D spriteFrame/_spriteFrame during bind_file when no sprite frame is provided'),
      overwrite: z.boolean().optional().describe('Replace an existing plist and generated sibling texture when creating particle assets'),
      properties: z.record(z.any()).optional().describe('ParticleSystem properties for add_particle/update'),
      silent: z.boolean().optional().describe('Suppress scene panel notifications'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for mutating VFX actions'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating VFX actions'),
    }
  ),

  def('manage_editor',
    'Editor utility operations: refresh asset database, undo, redo, get/set selection, execute menu command.',
    {
      action: z.enum(['refresh', 'save_silent', 'close_silent', 'ensure_no_dialog_risk', 'undo', 'redo', 'get_selection', 'set_selection', 'execute_menu']).describe('Editor action'),
      selectionType: z.string().optional().describe('Selection type: "node" or "asset" (for selection actions)'),
      ids: z.array(z.string()).optional().describe('UUIDs to select (for set_selection)'),
      menuPath: z.string().optional().describe('Menu path (for execute_menu)'),
      path: z.string().optional().describe('Asset db path to refresh (for refresh, default db://assets/)'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for mutating editor actions'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after mutating editor actions'),
    }
  ),

  def('find_references',
    'Find all references to a node or asset UUID across the current scene.',
    {
      uuid: z.string().describe('UUID of the node or asset to find references for'),
    }
  ),

  def('capture_screenshot',
    'Capture a screenshot of the editor scene view or game view.',
    {
      view: z.enum(['scene', 'game']).optional().describe('"scene" for editor view, "game" for game preview (default "scene")'),
      savePath: z.string().optional().describe('File path to save screenshot (optional, returns base64 if not set)'),
      debugTargets: z.boolean().optional().describe('Return candidate editor capture targets without capturing'),
      capture: z.boolean().optional().describe('When debugTargets is true, set capture true to also capture and save an image'),
      allowNonViewFallback: z.boolean().optional().describe('Allow non-matching editor windows as a diagnostic fallback; default false'),
      inspectLayout: z.boolean().optional().describe('Inspect main editor DOM layout to infer a scene/game panel crop rectangle before capture'),
    }
  ),

  def('validate_runtime_view',
    'Validate screenshot availability, console errors, key node visibility, and UI bounds against the Canvas.',
    {
      view: z.enum(['scene', 'game']).optional().describe('View to capture, default scene'),
      savePath: z.string().optional().describe('Optional project-relative path to save screenshot'),
      checkScreenshot: z.boolean().optional().describe('Capture and validate screenshot bytes, default true'),
      minScreenshotBytes: z.number().optional().describe('Minimum screenshot byte size heuristic, default 1000'),
      requireNonBlank: z.boolean().optional().describe('Fail if screenshot pixel sampling indicates blank/all-white content'),
      requirePixelContent: z.boolean().optional().describe('Require PNG pixel analysis even when requireNonBlank is false'),
      minUniqueSampleColors: z.number().optional().describe('Minimum sampled unique RGBA colors for pixel-content checks, default 2'),
      rejectAllWhite: z.boolean().optional().describe('Fail all-white screenshots, default true when requireNonBlank is set'),
      rejectAllBlack: z.boolean().optional().describe('Fail all-black screenshots'),
      maxPixelSamples: z.number().optional().describe('Maximum approximate pixel samples for PNG analysis, default 1024'),
      checkConsole: z.boolean().optional().describe('Check read_console(error), default true'),
      failOnConsoleError: z.boolean().optional().describe('Alias behavior for checkConsole'),
      keyNodes: z.array(z.string()).optional().describe('Node UUIDs or paths that must exist and be active'),
      nodeIds: z.array(z.string()).optional().describe('Alias for keyNodes'),
      checkBounds: z.boolean().optional().describe('Check key nodes stay inside Canvas bounds'),
      canvasId: z.string().optional().describe('Canvas UUID/path, default Canvas'),
    }
  ),

  def('visual_validation_matrix',
    'Read-only visual validation standard matrix for screenshot target/capture, non-blank pixel checks, Canvas bounds, key node visibility, console baseline evidence, and structured unsupported/partial results.',
    {
      view: z.enum(['scene', 'game']).optional().describe('View to validate, default scene'),
      savePath: z.string().optional().describe('Optional screenshot save path used by examples'),
      keyNodes: z.array(z.string()).optional().describe('Key node UUIDs or names to require visible/resolved'),
      nodeIds: z.array(z.string()).optional().describe('Alias for keyNodes'),
      canvasId: z.string().optional().describe('Canvas UUID/name/path, default Canvas'),
      checkScreenshot: z.boolean().optional().describe('Whether canonical runtime_probe validate should capture screenshot'),
      minScreenshotBytes: z.number().optional().describe('Minimum screenshot byte size'),
      requireNonBlank: z.boolean().optional().describe('Require non-blank screenshot'),
      requirePixelContent: z.boolean().optional().describe('Require pixel color diversity'),
      minUniqueSampleColors: z.number().optional().describe('Minimum unique sampled colors'),
      rejectAllWhite: z.boolean().optional().describe('Reject all-white captures, default true'),
      rejectAllBlack: z.boolean().optional().describe('Reject all-black captures'),
      maxPixelSamples: z.number().optional().describe('Maximum PNG samples for pixel analysis'),
      checkBounds: z.boolean().optional().describe('Whether canonical runtime_probe validate should check Canvas bounds'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for examples'),
      consoleCount: z.number().optional().describe('Console entries to inspect'),
      count: z.number().optional().describe('Alias for consoleCount'),
      strict: z.boolean().optional().describe('Strict runtime validation example flag'),
      includeExamples: z.boolean().optional().describe('Include canonical example calls, default true'),
    }
  ),

  def('runtime_probe',
    'Dialog-safe runtime/preview probe: preflight preview lifecycle support, wait, inspect console baseline, and delegate optional runtime view checks without unsafe preview process control.',
    {
      action: z.enum(['capabilities', 'status', 'preflight', 'wait', 'validate', 'start', 'attach', 'stop', 'switch', 'start_preview', 'stop_preview', 'switch_preview']).optional().describe('Probe action; unsafe preview lifecycle actions return structured blocked evidence'),
      view: z.enum(['scene', 'game']).optional().describe('Scene/game view target for target discovery or runtime validation'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      waitMs: z.number().optional().describe('Safe time wait in milliseconds'),
      frameWaitMs: z.number().optional().describe('Alias for waitMs; frame-step wait remains partial unless supported by bridge'),
      consoleCount: z.number().optional().describe('Console entries to inspect'),
      count: z.number().optional().describe('Alias for consoleCount'),
      readWarnings: z.boolean().optional().describe('Include warnings in console evidence, default true'),
      failOnWarnings: z.boolean().optional().describe('Treat warnings as failures'),
      inspectScreenshotTargets: z.boolean().optional().describe('Use capture_screenshot(debugTargets:true,capture:false) when available'),
      checkScreenshot: z.boolean().optional().describe('For validate action, delegate screenshot capture/pixel checks to validate_runtime_view'),
      savePath: z.string().optional().describe('Optional screenshot save path for validate action'),
      minScreenshotBytes: z.number().optional().describe('Minimum screenshot byte size for validate action'),
      requireNonBlank: z.boolean().optional().describe('Require non-blank screenshot when checkScreenshot is true'),
      requirePixelContent: z.boolean().optional().describe('Require PNG pixel analysis when checkScreenshot is true'),
      minUniqueSampleColors: z.number().optional().describe('Minimum sampled unique colors for pixel checks'),
      rejectAllWhite: z.boolean().optional().describe('Reject all-white screenshots'),
      rejectAllBlack: z.boolean().optional().describe('Reject all-black screenshots'),
      maxPixelSamples: z.number().optional().describe('Maximum approximate pixel samples for PNG analysis'),
      keyNodes: z.array(z.string()).optional().describe('Node UUIDs or paths that must exist/active during validate action'),
      nodeIds: z.array(z.string()).optional().describe('Alias for keyNodes'),
      checkBounds: z.boolean().optional().describe('Check key node bounds against Canvas during validate action'),
      canvasId: z.string().optional().describe('Canvas UUID/path, default Canvas'),
      strict: z.boolean().optional().describe('Throw when validate_runtime_view fails instead of returning partial evidence'),
      hints: z.array(z.string()).optional().describe('Console error hint filters'),
      warningHints: z.array(z.string()).optional().describe('Console warning hint filters'),
    }
  ),


  def('begin_verification_session',
    'Start a lightweight verification session and return a console baseline timestamp for later checks.',
    {
      label: z.string().optional().describe('Human-readable verification label'),
      includeConsoleBaseline: z.boolean().optional().describe('Capture recent console entries, default true'),
      consoleCount: z.number().optional().describe('Recent console entries to capture'),
    }
  ),

  def('ensure_no_dialog_risk',
    'Preflight an editor operation and block open/close/switch actions that could show Cocos save dialogs in unattended automation.',
    {
      operation: z.string().optional().describe('Operation to preflight, e.g. open_scene, close_prefab, switch_scene, save_silent'),
      action: z.string().optional().describe('Alias for operation'),
      path: z.string().optional().describe('Target db:// path'),
      targetUrl: z.string().optional().describe('Alias for path'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after preflight'),
    }
  ),

  def('prefab_reopen_validate',
    'Dialog-safe prefab validation. Defaults to save/validate in place; close/reopen is disabled in unattended mode because Cocos can show save dialogs.',
    {
      path: z.string().optional().describe('Prefab db:// path'),
      prefabPath: z.string().optional().describe('Alias for path'),
      expectedMaterialUuid: z.string().optional().describe('Material UUID expected in serialized prefab'),
      expectedText: z.array(z.string()).optional().describe('Text snippets expected in serialized prefab'),
      verifyInPlace: z.boolean().optional().describe('Validate after save without close/reopen; default true'),
      sinceTs: z.number().optional().describe('Console baseline timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      consoleCount: z.number().optional().describe('Console entries to inspect'),
    }
  ),

  def('generate_delivery_report',
    'Generate a stable 2D delivery validation report under project temp/. Aggregates manifest/assets/static/reference/runtime/console/cleanup evidence, partial/blocked items, first failure, release gate, and nextSuggestedFix.',
    {
      reportPath: z.string().optional().describe('Timestamped report path under project temp/; defaults to temp/cocos-creator-38-mcp/reports/delivery-report-<timestamp>.json'),
      latestPath: z.string().optional().describe('Deterministic latest report path under project temp/; defaults to temp/cocos-creator-38-mcp/reports/delivery-report-latest.json'),
      label: z.string().optional().describe('Report label'),
      manifest: z.record(z.any()).optional().describe('Full or compact manifest input'),
      manifestSummary: z.record(z.any()).optional().describe('Precomputed manifest summary'),
      changedAssets: z.array(z.record(z.any())).optional().describe('Changed asset evidence'),
      createdAssets: z.array(z.record(z.any())).optional().describe('Created asset evidence'),
      updatedAssets: z.array(z.record(z.any())).optional().describe('Updated asset evidence'),
      validation: z.record(z.any()).optional().describe('Validation evidence bundle'),
      staticValidation: z.record(z.any()).optional().describe('Static validation evidence'),
      referenceGraph: z.record(z.any()).optional().describe('Reference graph evidence'),
      runtimeValidation: z.record(z.any()).optional().describe('Runtime validation evidence'),
      runtimeProbe: z.record(z.any()).optional().describe('Runtime probe evidence'),
      consoleEvidence: z.record(z.any()).optional().describe('Console baseline evidence'),
      cleanup: z.record(z.any()).optional().describe('Cleanup evidence'),
      partial: z.array(z.record(z.any())).optional().describe('Partial capability markers'),
      unsupported: z.array(z.record(z.any())).optional().describe('Unsupported capability markers'),
      blocked: z.array(z.record(z.any())).optional().describe('Blocked operation markers'),
      failures: z.array(z.record(z.any())).optional().describe('Failure markers'),
      regressionReportPath: z.string().optional().describe('Optional existing regression report to summarize into the delivery report'),
      includeRegressionReport: z.boolean().optional().describe('Read regressionReportPath when provided; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure when the generated report is not passed'),
    }
  ),

  def('generic_2d_showcase',
    'Generic2DShowcase manifest/report boundary. Produces a neutral showcase manifest, validation plan, runtime-boundary evidence, and delivery report without game-specific systems or fake runtime success.',
    {
      action: z.enum(['manifest', 'plan', 'preflight', 'report', 'status']).optional().describe('Showcase action; preflight/report write a delivery report and return partial until live editor authoring/runtime proof is available'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeRuntimePreflight: z.boolean().optional().describe('Compose runtime_probe preflight evidence; default true'),
      includeInventory: z.boolean().optional().describe('Include reserved fixture inventory evidence; default true'),
      strict: z.boolean().optional().describe('Reserved for future live authoring gate'),
    }
  ),

  def('generic_2d_showcase_authoring',
    'Retained Generic2DShowcase authoring boundary. Plans/preflights neutral retained scene/prefab/UI/script/animation/material/VFX/resource-binding artifacts and blocks unsafe live authoring until dialog-free proof exists.',
    {
      action: z.enum(['capabilities', 'manifest', 'plan', 'preflight', 'author', 'report', 'status']).optional().describe('Authoring action; author returns blocked unless retained live authoring/runtime proof is implemented'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      allowLiveAuthoring: z.boolean().optional().describe('Reserved; true currently throws unsupported until dialog-free proof exists'),
      includePackageHygiene: z.boolean().optional().describe('Compose package_hygiene evidence; default true'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure unless retained authoring fully passes'),
    }
  ),

  def('generic_2d_showcase_prefab_live_authoring_readiness',
    'Readiness/gap gate for Generic2DShowcase retained prefab live authoring. Verifies manage_prefab/prefab_validate primitive surface and reports missing dialog-free prefab create/save/static proof without mutating protected assets.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'report', 'status']).optional().describe('Prefab readiness action; preflight/report returns blocked with retained prefab create/save/static gaps'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained prefab live authoring remains blocked'),
    }
  ),


  def('generic_2d_showcase_ui_script_live_authoring_readiness',
    'Readiness/gap gate for Generic2DShowcase retained UI/script live authoring. Verifies create_ui_from_spec/manage_script/validate UI+script primitive surface and reports missing dialog-free UI prefab/script create/import/bind/static proof without mutating protected assets.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'report', 'status']).optional().describe('UI/script readiness action; preflight/report returns blocked with retained UI/script create/import/bind/static gaps'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained UI/script live authoring remains blocked'),
    }
  ),


  def('generic_2d_showcase_visual_resource_live_authoring_readiness',
    'Readiness/gap gate for Generic2DShowcase retained visual/resource live authoring. Verifies animation/material/effect/VFX/TileMap primitive surface and reports missing dialog-free create/import/bind/readback proof without mutating protected assets.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'report', 'status']).optional().describe('Visual/resource readiness action; preflight/report returns blocked with retained visual-resource create/import/bind/readback gaps'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      tilemapPath: z.string().optional().describe('Project-owned TileMap source path; default db://assets/map/map.tmx'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained visual/resource live authoring remains blocked'),
    }
  ),


  def('generic_2d_showcase_live_authoring_readiness',
    'Readiness/gap gate for promoting Generic2DShowcase retained boundaries to live Cocos Editor authoring. Composes scene, prefab, UI/script, visual/resource sub-gates plus retained slice evidence and reports missing dialog-free create/save/bind/readback/runtime capabilities without mutating protected assets.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'report', 'status']).optional().describe('Readiness action; preflight/report returns blocked with explicit missing live-authoring capabilities'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while live authoring remains blocked'),
    }
  ),

  def('generic_2d_showcase_scene_live_authoring_proof',
    'Controlled proof harness for Generic2DShowcase retained scene live authoring. Defaults to blocked/read-only; action:"prove" needs explicit safety flags and a live Cocos Editor MCP context before it can call manage_scene create/save_silent/validate_static.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'prove', 'report', 'status']).optional().describe('Proof action; preflight/report/status are read-only blocked evidence, prove needs explicit safety flags'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      sceneName: z.string().optional().describe('Retained scene name: Generic2DStart or Generic2DPlayground'),
      scenePath: z.string().optional().describe('Retained scene db://assets path; must be one of the Generic2DShowcase retained scenes'),
      path: z.string().optional().describe('Alias for scenePath'),
      allowLiveProof: z.boolean().optional().describe('Required true for action:"prove" to attempt live retained scene creation'),
      confirmRetainedSceneMutation: z.boolean().optional().describe('Required true with allowLiveProof before retained .scene creation can be attempted'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while proof remains blocked'),
    }
  ),


  def('generic_2d_showcase_scene_live_authoring_readiness',
    'Readiness/gap gate for the first Generic2DShowcase live authoring capability: dialog-free retained scene create/save/static validation. Verifies manage_scene primitive surface and reports remaining proof gaps without creating protected scene assets.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'report', 'status']).optional().describe('Scene readiness action; preflight/report returns blocked with explicit retained scene create/save/static gaps'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained scene live authoring remains blocked'),
    }
  ),

  def('generic_2d_showcase_prefab_live_authoring_proof',
    'Controlled proof harness for Generic2DShowcase retained prefab live authoring. Defaults to blocked/read-only; prove requires allowLiveProof:true, confirmRetainedPrefabMutation:true, and a live Cocos Editor context before source-node/create/save/static validation is attempted.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'prove', 'report', 'status']).optional().describe('Prefab proof action; preflight/report are read-only, prove is gated by explicit safety flags'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      prefabName: z.string().optional().describe('Retained prefab name such as GenericActor or GenericProjectile'),
      prefabPath: z.string().optional().describe('Retained prefab db:// path under db://assets/Generic2DShowcase/prefabs'),
      path: z.string().optional().describe('Alias for prefabPath'),
      allowLiveProof: z.boolean().optional().describe('Required true for action:prove to attempt live retained prefab proof'),
      confirmRetainedPrefabMutation: z.boolean().optional().describe('Required true with allowLiveProof before retained prefab mutation is allowed'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained prefab live proof remains blocked'),
    }
  ),

  def('generic_2d_showcase_ui_script_live_authoring_proof',
    'Controlled proof harness for Generic2DShowcase retained UI/script live authoring. Defaults to blocked/read-only; prove requires allowLiveProof:true, confirmRetainedUiScriptMutation:true, and a live Cocos Editor context before script create/import, UI prefab create, bind, and static validation are attempted.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'prove', 'report', 'status']).optional().describe('UI/script proof action; preflight/report are read-only, prove is gated by explicit safety flags'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      allowLiveProof: z.boolean().optional().describe('Required true for action:prove to attempt live retained UI/script proof'),
      confirmRetainedUiScriptMutation: z.boolean().optional().describe('Required true with allowLiveProof before retained UI/script mutation is allowed'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained UI/script live proof remains blocked'),
    }
  ),

  def('generic_2d_showcase_visual_resource_live_authoring_proof',
    'Controlled proof harness for Generic2DShowcase retained visual/resource live authoring. Defaults to blocked/read-only; prove requires allowLiveProof:true, confirmRetainedVisualResourceMutation:true, and a live Cocos Editor context before retained animation/effect/material/VFX/TileMap create/import/static validation is attempted.',
    {
      action: z.enum(['capabilities', 'manifest', 'preflight', 'prove', 'report', 'status']).optional().describe('Visual/resource proof action; preflight/report are read-only, prove is gated by explicit safety flags'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      tilemapPath: z.string().optional().describe('Existing project TileMap source under db://assets; defaults to db://assets/map/map.tmx'),
      allowLiveProof: z.boolean().optional().describe('Required true for action:prove to attempt live retained visual/resource proof'),
      confirmRetainedVisualResourceMutation: z.boolean().optional().describe('Required true with allowLiveProof before retained visual/resource mutation is allowed'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure while retained visual/resource live proof remains blocked'),
    }
  ),

  def('generic_2d_showcase_scene_prefab_authoring',
    'Minimal retained Generic2DShowcase scene/prefab authoring slice boundary. Plans/preflights retained scenes and prefabs, validates existing artifacts when present, and blocks unsafe live creation until dialog-free proof exists.',
    {
      action: z.enum(['capabilities', 'manifest', 'plan', 'preflight', 'author', 'report', 'status']).optional().describe('Scene/prefab authoring action; author returns blocked unless live dialog-free retained creation is implemented'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      allowLiveAuthoring: z.boolean().optional().describe('Reserved; true currently throws unsupported until dialog-free scene/prefab creation exists'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure unless retained scene/prefab authoring fully passes'),
    }
  ),

  def('generic_2d_showcase_ui_script_authoring',
    'Minimal retained Generic2DShowcase UI/script authoring slice boundary. Plans/preflights retained menu UI prefab plus GenericShowcaseComponent script contract and blocks unsafe live creation until dialog-free proof exists.',
    {
      action: z.enum(['capabilities', 'manifest', 'plan', 'preflight', 'author', 'report', 'status']).optional().describe('UI/script authoring action; author returns blocked unless live dialog-free retained creation/import/bind is implemented'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      allowLiveAuthoring: z.boolean().optional().describe('Reserved; true currently throws unsupported until dialog-free UI/script creation exists'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure unless retained UI/script authoring fully passes'),
    }
  ),

  def('generic_2d_showcase_visual_resource_authoring',
    'Minimal retained Generic2DShowcase animation/material/VFX/TileMap visual-resource authoring slice boundary. Plans/preflights retained visual resources, uses existing project TileMap evidence when available, and blocks unsafe live creation until dialog-free proof exists.',
    {
      action: z.enum(['capabilities', 'manifest', 'plan', 'preflight', 'author', 'report', 'status']).optional().describe('Visual-resource authoring action; author returns blocked unless live dialog-free retained creation/import/bind is implemented'),
      root: z.string().optional().describe('Showcase root, must be under db://assets/Generic2DShowcase'),
      tilemapPath: z.string().optional().describe('Existing project TileMap source path under db://assets; defaults to db://assets/map/map.tmx'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      allowLiveAuthoring: z.boolean().optional().describe('Reserved; true currently throws unsupported until dialog-free visual-resource creation exists'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure unless retained visual-resource authoring fully passes'),
    }
  ),

  def('run_2d_release_gate',
    '2D release gate boundary. Composes docs checks, Generic2DShowcase boundary, delivery report, cleanup inventory, console baseline, and optional latest complete report into one release-gate report.',
    {
      action: z.enum(['capabilities', 'status', 'preflight', 'report']).optional().describe('Release gate action; preflight/report write release-gate report and return blocked until live complete/showcase runtime proof is available'),
      reportPath: z.string().optional().describe('Release gate report path under project temp/'),
      latestPath: z.string().optional().describe('Latest release gate report path under project temp/'),
      latestCompleteReportPath: z.string().optional().describe('Optional latest complete regression report path'),
      includeLatestCompleteReport: z.boolean().optional().describe('Require latest complete report to pass; default false for local boundary regression'),
      includeShowcase: z.boolean().optional().describe('Compose Generic2DShowcase preflight evidence; default true'),
      includeInventory: z.boolean().optional().describe('Include reserved fixture inventory; default true'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Reserved for future pass-only release gate'),
    }
  ),

  def('package_hygiene',
    'Package and documentation hygiene scanner for the Cocos Creator 3.8 MCP extension. Audits distribution contents, forbidden generated artifacts, required release docs, compatibility, and release criteria.',
    {
      action: z.enum(['capabilities', 'scan', 'report', 'status']).optional().describe('Package hygiene action; scan/report/status write a JSON report under project temp/'),
      extensionPath: z.string().optional().describe('Project-relative extension path; must stay under extensions/cocos-creator-38-mcp'),
      reportPath: z.string().optional().describe('Timestamped hygiene report path under project temp/'),
      latestPath: z.string().optional().describe('Latest hygiene report path under project temp/'),
      includeNodeModules: z.boolean().optional().describe('Include node_modules in file scan; default false'),
      strict: z.boolean().optional().describe('Mark strictFailure when hygiene does not pass'),
    }
  ),

  def('build_install_package',
    'Build a distributable install zip for the generic Cocos Creator 3.8 MCP extension and cocos38-dev skill.',
    {
      outputDir: z.string().optional().describe('Project-relative output directory. Defaults to dist/mcp-packages.'),
      skillPath: z.string().optional().describe('Optional absolute cocos38-dev skill source path. Defaults to CODEX_HOME/.codex skill location.'),
    }
  ),

  def('knowledge_domain_integration',
    'Knowledge-domain integration boundary for generic 2D release readiness. Plans/preflights Scene+Component, Asset+Prefab, Script+UI, Animation+Prefab, Material+Shader, and VFX+Resource without faking live editor/runtime proof.',
    {
      action: z.enum(['capabilities', 'manifest', 'plan', 'preflight', 'report', 'status']).optional().describe('Integration action; preflight/report write a delivery report and return partial until all live evidence is proven'),
      reportPath: z.string().optional().describe('Delivery report path under project temp/'),
      latestPath: z.string().optional().describe('Latest delivery report path under project temp/'),
      includeShowcase: z.boolean().optional().describe('Compose Generic2DShowcase plan evidence; default true'),
      includePackageHygiene: z.boolean().optional().describe('Compose package_hygiene evidence; default true'),
      includeConsole: z.boolean().optional().describe('Read fresh console baseline; default true'),
      strict: z.boolean().optional().describe('Mark strictFailure unless all integration slices are fully passed'),
    }
  ),

  def('run_regression_suite',
    'Run generic MCP regression checks. Shader mode creates/verifies generic shader presets; cleanup mode removes reserved test fixtures.',
    {
      mode: z.enum(['core', 'shader', 'complete', 'release-smoke', 'cleanup', 'scene-persistence', 'automation-flow', 'game-demo', 'game-demo-preflight', 'game-demo-ui', 'game-demo-character', 'game-demo-physics', 'game-demo-vfx', 'game-demo-animation', 'game-demo-material-shader', 'game-demo-prefab', 'game-demo-scene-static', 'game-demo-runtime', 'game-demo-cleanup', 'ui-animation', 'assets-prefab', 'operation-evidence', 'reference-graph', 'prefab-static-v2', 'prefab-static-v2-openable-metadata-smoke', 'prefab-static-v2-openable-negative', 'prefab-editor-openable-smoke', 'offline-prefab-openable-metadata-smoke', 'full-prefab-static', 'offline-prefab-read-static', 'offline-prefab-integrity-negative', 'offline-prefab-write-smoke', 'offline-prefab-write-rollback', 'offline-prefab-resource-remap', 'prefab-static-duplicate-sibling-warning', 'offline-prefab-custom-property-ignore', 'offline-prefab-strip-missing-custom-components', 'offline-prefab-strip-broken-button-events', 'offline-prefab-ui-renderer-default-material', 'offline-prefab-patch-smoke', 'offline-prefab-patch-append-subtree', 'full-spec-offline-prefab-roundtrip', 'dirty-context-blocks-editor-fallback-offline-available', 'full-prefab-replay-smoke', 'full-prefab-replay-negative', 'full-prefab-replay-layout-smoke', 'full-prefab-replay-cleanup', 'full-prefab-replay-large-guard', 'full-prefab-replay-large-smoke', 'component-singleton-guard', 'full-prefab-replay-resource-remap-wrapper', 'manage-node-tree-smoke', 'manage-node-tree-singleton-guard', 'prefab-edit-context-blocked-dirty', 'prefab-replay-pipeline-smoke', 'prefab-replay-pipeline-negative', 'prefab-edit-context-unsafe-preflight', 'full-prefab-replay-blocks-unsafe-current-prefab', 'full-prefab-replay-no-empty-root-on-blocked-preflight', 'create-prefab-blocks-empty-root-on-open-dump-failure', 'create-prefab-dialog-guard', 'prefab-edit-context-recovery-inspect', 'prefab-edit-context-dirty-save-fail-blocks', 'dirty-prefab-no-manual-save-gate', 'prefab-edit-context-discard-close-proof', 'full-prefab-replay-recovers-or-blocks-dirty-current-prefab', 'prefab-ipc-create-lifecycle-smoke', 'prefab-ipc-restore-instance-smoke', 'prefab-ipc-unlink-instance-smoke', 'prefab-ipc-save-close-switch-gate-smoke', 'prefab-offline-writer-policy-gate-smoke', 'full-prefab-resource-remap-smoke', 'full-prefab-resource-remap-negative', 'full-prefab-spine-skeleton-smoke', 'full-prefab-custom-component-negative', 'full-prefab-component-property-smoke', 'component-property-replay-matrix', 'duplicate-component-preflight-matrix', 'spine-skeleton-binding-smoke', 'spine-skeleton-missing-resource-negative', 'custom-component-resolve-smoke', 'custom-component-missing-negative', 'full-prefab-diff-root-rename-smoke', 'full-prefab-diff-subtree-smoke', 'label-outline-shadow-richtext-replay-smoke', 'label-outline-warning-negative', 'component-schema-preflight', 'script-contract', 'resource-fixture', 'build-smoke', 'asset-negative', 'asset-extended-negative', 'node-component-readback', 'resource-binding-matrix', 'texture-spriteframe-boundary', 'atlas-boundary', 'sprite-atlas-render-smoke', 'sprite-atlas-rotated-frame-smoke', 'sprite-material-normalization-smoke', 'prefab-visual-open-screenshot-gate', 'tilemap-boundary', 'material-shader-boundary', 'visual-effect-release-subset', 'runtime-probe', 'runtime-input', 'runtime-physics-contact', 'delivery-report', 'generic-2d-showcase', 'generic-2d-showcase-authoring', 'generic-2d-showcase-live-authoring-readiness', 'generic-2d-showcase-scene-live-authoring-readiness', 'generic-2d-showcase-scene-live-authoring-proof', 'generic-2d-showcase-prefab-live-authoring-readiness', 'generic-2d-showcase-prefab-live-authoring-proof', 'generic-2d-showcase-ui-script-live-authoring-readiness', 'generic-2d-showcase-ui-script-live-authoring-proof', 'generic-2d-showcase-visual-resource-live-authoring-readiness', 'generic-2d-showcase-visual-resource-live-authoring-proof', 'generic-2d-showcase-scene-prefab-authoring', 'generic-2d-showcase-ui-script-authoring', 'generic-2d-showcase-visual-resource-authoring', '2d-release-gate', 'package-hygiene', 'knowledge-domain-integration', 'script-negative', 'script-refresh-diagnostics', 'script-import-bind-timing', 'animation-negative', 'animation-property-scope', 'animation-track-readback', 'component-matrix', 'component-property-boundary', 'ui-spec-negative', 'ui-prefab-static-diff', 'ui-complete-smoke', 'ui-scrollview-smoke', 'cocos38-ui-prefab-smoke', 'scene-asset-negative', 'font-audio-boundary', 'vfx-particle-boundary', 'physics-boundary']).optional().describe('Regression mode'),
      preset: z.string().optional().describe('Shader/visual preset for shader mode, default sprite_circle_mask; also supports sprite_sweep_shine, sprite_water_ripple, sprite_wind_sway, mesh_energy_shield, mesh_noise_dissolve, and mesh_motion_vertex'),
      nodeId: z.string().optional().describe('Renderer node UUID for assignment/runtime validation'),
      componentType: z.string().optional().describe('Renderer component type, default cc.Sprite'),
      prefabPath: z.string().optional().describe('Prefab path for reopen validation'),
      reportPath: z.string().optional().describe('Project-relative or db path for JSON report'),
      latestCompleteReportPath: z.string().optional().describe('release-smoke only: project-relative path to the latest complete regression report; defaults to temp/cocos-creator-38-mcp/reports/run-regression-complete-latest.json'),
      validateRuntime: z.boolean().optional().describe('Run runtime compile validation when nodeId is supplied, default true'),
      captureScreenshot: z.boolean().optional().describe('Capture screenshot during runtime validation, default true'),
      waitMs: z.number().optional().describe('Runtime validation wait milliseconds'),
      cleanup: z.boolean().optional().describe('Reserved for future fixture cleanup'),
      cleanupPaths: z.array(z.string()).optional().describe('db://assets paths to remove in cleanup mode; defaults to reserved MCP regression fixture roots'),
      dryRun: z.boolean().optional().describe('For cleanup mode, report what would be removed without deleting assets/nodes'),
      autoCreateFixture: z.boolean().optional().describe('Create a Sprite/MeshRenderer test node when nodeId is omitted, default true'),
      parentId: z.string().optional().describe('Optional parent node UUID/path for auto-created fixture'),
      fixtureName: z.string().optional().describe('Optional name for auto-created fixture node'),
      uiPrefabPath: z.string().optional().describe('UI prefab db path for ui-animation regression mode'),
      animationPath: z.string().optional().describe('AnimationClip db path for ui-animation regression mode'),
      assetPrefabPath: z.string().optional().describe('Prefab db path for assets-prefab regression mode'),
      spriteFramePath: z.string().optional().describe('SpriteFrame db path for assets-prefab regression mode'),
      buildPlatform: z.string().optional().describe('Target platform for build-smoke mode, default web-desktop'),
      runRealBuild: z.boolean().optional().describe('build-smoke only: explicit gate to run a real Cocos build; default false skips real build'),
      buildDebug: z.boolean().optional().describe('build-smoke real build debug flag'),
      buildWait: z.boolean().optional().describe('build-smoke real build wait flag'),
      expectedSceneScriptVersion: z.string().optional().describe('Expected scene-script version for stale scene-script diagnostics'),
      keepDemo: z.boolean().optional().describe('game-demo only: keep generated demo assets and nodes instead of cleaning them up'),
      demoRoot: z.string().optional().describe('game-demo only: root db://assets folder for generated demo assets'),
      allowBlockedClose: z.boolean().optional().describe('automation-flow/game-demo: treat dialog-suppressed close as expected instead of a failure'),
      slowToolMs: z.number().optional().describe('Regression report threshold for slow tool evidence, default 500ms'),
    }
  ),

  def('read_console',
    'Read recent Cocos Editor console log entries (errors, warnings, info).',
    {
      level: z.enum(['all', 'error', 'warn', 'info', 'log']).optional().describe('Filter by log level (default "all")'),
      count: z.number().optional().describe('Number of recent entries to return (default 50)'),
      limit: z.number().optional().describe('Alias for count'),
      sinceTs: z.number().optional().describe('Only return log entries at or after this timestamp'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
    }
  ),

  def('build_project',
    'Build the Cocos Creator project for a target platform. Returns build status.',
    {
      platform: z.string().describe('Target platform: "web-mobile", "web-desktop", "android", "ios", "win32", "mac"'),
      debug: z.boolean().optional().describe('Build in debug mode (default false)'),
      wait: z.boolean().optional().describe('Wait for build to complete before returning (default true, max 120s)'),
      sinceTs: z.number().optional().describe('Console baseline timestamp for build'),
      startedAt: z.number().optional().describe('Alias for sinceTs'),
      readConsole: z.boolean().optional().describe('Read fresh console errors after build/start'),
    }
  ),

  def('batch_execute',
    'Execute multiple tool calls in sequence. Reduces round-trips.',
    {
      steps: z.array(z.object({
        tool: z.string().describe('Tool name'),
        args: z.record(z.any()).describe('Tool arguments'),
        id: z.string().optional().describe('Step ID for referencing result'),
      })).describe('Array of tool calls to execute in order'),
      stopOnError: z.boolean().optional().describe('Stop execution on first error (default true)'),
    }
  ),

  def('get_mcp_capabilities',
    'Return the Cocos MCP capability matrix so callers can distinguish supported, partial, and unsupported work before editing Cocos assets.',
    {
      domain: z.string().optional().describe('Optional domain filter, e.g. animation, vfx, material, spine, prefab'),
    }
  ),

  def('get_reserved_fixture_policy',
    'Return the centralized reserved MCP fixture roots, scene-node name patterns, and retention/cleanup policy.',
    {
      cleanupPaths: z.array(z.string()).optional().describe('Additional caller-supplied cleanup roots to include in the policy view'),
    }
  ),

  def('inspect_reserved_fixtures',
    'Read-only inventory of reserved MCP fixture assets and scene nodes; detects stale __mcp_* and Generic2DShowcase artifacts without cleanup mutation.',
    {
      cleanupPaths: z.array(z.string()).optional().describe('Additional caller-supplied cleanup roots to inspect'),
      includeSceneNodes: z.boolean().optional().describe('Inspect active scene nodes for reserved names'),
      depth: z.number().optional().describe('Scene hierarchy depth when includeSceneNodes is enabled'),
      maxChildren: z.number().optional().describe('Maximum scene children to inspect'),
    }
  ),

  def('unsupported_capability_matrix',
    'Read-only standard unsupported/partial boundary matrix for Timeline/Cutscene, gameplay controllers, unsupported animation/material curves, Spine/IK, complex particles, protected asset edits, process lifecycle, and unsafe context switching.',
    {
      capability: z.string().optional().describe('Capability key or alias to filter, e.g. cutscene, gameplay, material_animation, spine'),
      key: z.string().optional().describe('Alias for capability'),
      domain: z.string().optional().describe('Category/domain filter'),
      category: z.string().optional().describe('Alias for domain'),
    }
  ),

  def('report_unsupported',
    'Return a standardized unsupported MCP capability response without editing project assets.',
    {
      missingCapability: z.string().optional().describe('Capability key that is missing'),
      capability: z.string().optional().describe('Alias for missingCapability'),
      requestedWork: z.string().optional().describe('User-requested work that cannot be safely completed'),
      request: z.string().optional().describe('Alias for requestedWork'),
      supportedAlternatives: z.array(z.any()).optional().describe('Safe alternatives MCP can perform'),
      alternatives: z.array(z.any()).optional().describe('Alias for supportedAlternatives'),
      suggestedTooling: z.string().optional().describe('Suggested MCP tool improvement task'),
      nextToolTask: z.string().optional().describe('Alias for suggestedTooling'),
      message: z.string().optional().describe('Clear user-facing unsupported reason'),
    }
  ),

  def('apply_text_edits',
    'Apply find-and-replace text edits to a file. Useful for modifying scripts with precise replacements.',
    {
      path: z.string().describe('File db path or absolute file path'),
      edits: z.array(z.object({
        find: z.string().optional().describe('Text to find'),
        replace: z.string().optional().describe('Replacement text'),
        insertAfter: z.string().optional().describe('Insert replace text after this marker'),
        insertBefore: z.string().optional().describe('Insert replace text before this marker'),
        delete: z.string().optional().describe('Delete this text'),
        all: z.boolean().optional().describe('Replace all occurrences (default false)'),
      })).describe('Array of find-replace edits'),
    }
  ),
];

var decoratedTools = tools.map(function (tool) {
  var result = {};
  Object.keys(tool).forEach(function (key) { result[key] = tool[key]; });
  result.profile = toolProfile.inferToolProfile(tool.name);
  result.recommended = result.profile === 'core';
  return result;
});

function filterTools(profile) {
  return toolProfile.filterTools(decoratedTools, profile || 'core');
}

module.exports = filterTools('core');
module.exports.allTools = decoratedTools;
module.exports.filterTools = filterTools;
module.exports.profileCounts = toolProfile.summarizeTools(decoratedTools);




