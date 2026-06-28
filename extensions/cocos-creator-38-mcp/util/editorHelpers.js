'use strict';

var fs = require('fs');
var path = require('path');

async function sendToPanel(panel, message, args) {
  try {
    return await Editor.Message.request(panel, message, args);
  } catch (e) {
    throw new Error(typeof e === 'object' ? (e.message || String(e)) : String(e));
  }
}

async function sendToMain(message, args) {
  try {
    return await Editor.Message.request(message, args);
  } catch (e) {
    throw new Error(typeof e === 'object' ? (e.message || String(e)) : String(e));
  }
}

function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function dbUrlFromProjectFspath(fspath) {
  try {
    var assetsRoot = path.join(Editor.Project.path, 'assets').replace(/\\/g, '/');
    var normalized = String(fspath || '').replace(/\\/g, '/');
    if (normalized.indexOf(assetsRoot + '/') !== 0) return null;
    return 'db://assets/' + normalized.substring(assetsRoot.length + 1);
  } catch (e) {
    return null;
  }
}

function findSceneUrlByUuid(uuid) {
  if (!uuid) return null;
  var assetsRoot = path.join(Editor.Project.path, 'assets');
  var target = String(uuid);
  function walk(dir) {
    var entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return null; }
    for (var i = 0; i < entries.length; i++) {
      var ent = entries[i];
      if (ent.name.charAt(0) === '.' || ent.name === 'library' || ent.name === 'temp' || ent.name === 'node_modules') continue;
      var full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        var child = walk(full);
        if (child) return child;
        continue;
      }
      if (!ent.isFile() || !/\.scene\.meta$/i.test(ent.name)) continue;
      try {
        var meta = JSON.parse(fs.readFileSync(full, 'utf8'));
        if (String(meta.uuid || '') === target) return dbUrlFromProjectFspath(full.replace(/\.meta$/i, ''));
      } catch (e) {}
    }
    return null;
  }
  return walk(assetsRoot);
}

function findUniquePrefabUrlByBasename(baseName) {
  if (!baseName) return null;
  var assetsRoot = path.join(Editor.Project.path, 'assets');
  var targetFile = String(baseName) + '.prefab';
  var matches = [];
  function walk(dir) {
    if (matches.length > 1) return;
    var entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var ent = entries[i];
      if (ent.name.charAt(0) === '.' || ent.name === 'library' || ent.name === 'temp' || ent.name === 'node_modules') continue;
      var full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name === targetFile) {
        var url = dbUrlFromProjectFspath(full);
        if (url) matches.push(url);
      }
      if (matches.length > 1) return;
    }
  }
  walk(assetsRoot);
  return matches.length === 1 ? matches[0] : null;
}

function timeoutResult(label, ms) {
  return delay(ms).then(function () {
    var err = new Error(label + ' timed out after ' + ms + 'ms');
    err.code = 'ETIMEDOUT';
    throw err;
  });
}

function withTimeout(promise, label, ms) {
  return Promise.race([promise, timeoutResult(label, ms || 5000)]);
}

async function saveScene(opts) {
  opts = opts || {};
  var requestedSceneUrl = opts.path && /\.scene$/i.test(String(opts.path || '')) ? String(opts.path) : null;
  var current = await getCurrentAssetInfo();
  var sceneUrl = requestedSceneUrl || (current && /\.scene$/i.test(String(current.url || '')) ? current.url : null);
  if (!sceneUrl && current && current.assetInfo) {
    var info = current.assetInfo;
    if (/\.scene$/i.test(String(info.url || ''))) sceneUrl = info.url;
    else if (/\.scene$/i.test(String(info.source || ''))) sceneUrl = info.source;
    else if (/\.scene$/i.test(String(info.file || '')) && String(info.source || '').indexOf('db://') === 0) sceneUrl = info.source;
    else if (String(info.importer || '') === 'scene' && String(info.path || '').indexOf('db://') === 0) sceneUrl = /\.scene$/i.test(String(info.path)) ? info.path : String(info.path) + '.scene';
  }
  var currentPrefabUrl = !requestedSceneUrl && current && /\.prefab$/i.test(String(current.url || '')) ? current.url : null;
  if (!sceneUrl && currentPrefabUrl) {
    var prefabSave = await saveCurrentPrefabEditContextViaSceneSave({
      current: current,
      prefabUrl: currentPrefabUrl,
      timeoutMs: opts.timeoutMs,
      settleMs: opts.settleMs,
    });
    if (prefabSave && prefabSave.ok === true) {
      return Object.assign({}, prefabSave, {
        saveApi: 'manage_scene.save_silent.prefab_edit_context',
        message: 'Current prefab edit context saved through scene.save-scene because no current scene asset path was resolved.',
      });
    }
    return Object.assign({
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      path: currentPrefabUrl,
      current: current,
      reason: 'Current editor context is a prefab, but scene.save-scene did not prove a dialog-free clean save.',
    }, prefabSave || {});
  }

  if (sceneUrl) {
    var sceneSaveAttempts = requestedSceneUrl
      ? [
          ['scene', 'save-scene', sceneUrl],
          ['scene', 'save', sceneUrl],
        ]
      : [
          ['scene', 'save-scene', undefined],
          ['scene', 'save-scene', sceneUrl],
          ['scene', 'save', undefined],
          ['scene', 'save', sceneUrl],
        ];
    var sceneErrors = [];
    for (var si = 0; si < sceneSaveAttempts.length; si++) {
      var attempt = sceneSaveAttempts[si];
      try {
        if (attempt[2] === undefined) {
          await withTimeout(Editor.Message.request(attempt[0], attempt[1]), attempt[0] + ' ' + attempt[1], opts.timeoutMs || 5000);
        } else {
          await withTimeout(Editor.Message.request(attempt[0], attempt[1], attempt[2]), attempt[0] + ' ' + attempt[1], opts.timeoutMs || 5000);
        }
        await delay(Number(opts.settleMs || 500));
        return { ok: true, saved: true, path: sceneUrl, sceneMessage: attempt[0] + '.' + attempt[1], message: 'Scene saved silently through scene panel message' };
      } catch (sceneError) {
        sceneErrors.push(attempt[0] + '.' + attempt[1] + ': ' + (sceneError.message || String(sceneError)));
      }
    }
    try {
      await withTimeout(Editor.Message.request('asset-db', 'save-asset', sceneUrl), 'asset-db save scene', opts.timeoutMs || 5000);
      return { ok: true, saved: true, path: sceneUrl, message: 'Scene saved silently through AssetDB' };
    } catch (e) {
      return {
        ok: false,
        skipped: true,
        interactivePromptSuppressed: true,
        path: sceneUrl,
        reason: 'AssetDB silent scene save failed; interactive scene save was suppressed',
        error: e.message || String(e),
        errors: sceneErrors.concat(['asset-db.save-asset: ' + (e.message || String(e))]),
      };
    }
  }

  return {
    ok: false,
    skipped: true,
    interactivePromptSuppressed: true,
    reason: 'Current scene asset path could not be resolved; interactive scene save was suppressed',
    current: current,
  };
}

async function getEditorState() {
  var current = await getCurrentAssetInfo();
  var dirtyState = await querySceneDirtyState();
  var project = null;
  try { project = await getProjectInfo(); } catch (e) { project = { error: e.message || String(e) }; }
  var queue = {};
  try {
    var commandQueue = require('./commandQueue');
    queue = {
      length: commandQueue.getLength ? commandQueue.getLength() : undefined,
      processing: commandQueue.isProcessing ? commandQueue.isProcessing() : undefined,
      maxLength: commandQueue.getMaxLength ? commandQueue.getMaxLength() : undefined,
    };
  } catch (e2) {}
  var url = current && current.url ? String(current.url) : '';
  return {
    ok: true,
    project: project,
    current: current,
    currentAsset: {
      url: url || null,
      uuid: current && current.uuid || null,
      type: /\.prefab$/i.test(url) ? 'prefab' : (/\.scene$/i.test(url) ? 'scene' : (url ? 'asset' : 'unknown')),
      dirtyKnown: dirtyState.known,
      dirty: dirtyState.known ? dirtyState.dirty : null,
      dirtyReason: dirtyState.known
        ? 'Scene dirty state queried through scene.query-dirty.'
        : 'Cocos process lifecycle is human-operated; prefab/scene context switching requires an MCP-safe workflow and is reported as unsupported when dirty state cannot be proven.',
      dirtyError: dirtyState.error || null,
    },
    selection: {
      node: getSelection('node'),
      asset: getSelection('asset'),
    },
    queue: queue,
      automation: {
      unattended: true,
      dialogPolicy: 'allow_existing_asset_open_switch_after_silent_save_preflight; suppress only when dialog-free save/navigation cannot be proven',
      canOpenWithoutDialog: dirtyState.known && dirtyState.dirty === false,
      canCloseWithoutDialog: dirtyState.known && dirtyState.dirty === false && /\.prefab$/i.test(String(current && current.url || '')),
      canSwitchWithoutDialog: dirtyState.known,
      sceneSaveSilent: 'asset-db save-asset when current scene db:// url is resolved',
      prefabSaveSilent: 'blocked by default for dirty prefab edit context; scene.save-scene remains regression-only until a non-popup proof is re-established',
      prefabCloseSilent: 'clean prefab edit context only; dirty prefab close stays blocked until a non-popup save or discard path is proven',
    },
  };
}

async function ensureNoDialogRisk(opts) {
  opts = opts || {};
  var operation = String(opts.operation || opts.action || 'unknown');
  var targetUrl = opts.targetUrl || opts.path || null;
  var state = await getEditorState();
  var blockedOps = {
    open: true,
    switch: true,
    close: true,
    'open_scene': true,
    'open_prefab': true,
    'close_scene': true,
    'close_prefab': true,
    'switch_scene': true,
    'switch_prefab': true,
  };
  if (operation === 'open_scene') {
    return await assessSceneOpenDialogRisk(targetUrl, state);
  }
  if (operation === 'open_prefab' || operation === 'switch_prefab') {
    return await assessPrefabOpenDialogRisk(targetUrl, state, operation);
  }
  if (operation === 'close_prefab') {
    return await assessPrefabCloseDialogRisk(targetUrl, state, operation);
  }
  var needsSwitchGuard = !!blockedOps[operation] || /^open|^close|^switch/.test(operation);
  if (needsSwitchGuard) {
    var boundary = buildMcpContextSwitchBoundary(operation, targetUrl, state);
    return {
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: targetUrl,
      reason: boundary.reason,
      current: state.current,
      editorState: state.currentAsset,
      unsupported: boundary.unsupported,
      missingCapability: boundary.missingCapability,
      supportedMcpAlternatives: boundary.supportedMcpAlternatives,
      safeAlternative: boundary.safeAlternative,
      nextSuggestedFix: boundary.nextSuggestedFix,
      evidence: boundary.evidence || null,
    };
  }
  return {
    ok: true,
    success: true,
    blocked: false,
    operation: operation,
    targetUrl: targetUrl,
    current: state.current,
    editorState: state.currentAsset,
  };
}

async function assessPrefabOpenDialogRisk(targetUrl, state, operation) {
  operation = operation || 'open_prefab';
  var target = normalizeDbUrl(targetUrl);
  var currentUrl = normalizeDbUrl(state && state.currentAsset && state.currentAsset.url);
  var boundary = buildMcpContextSwitchBoundary(operation, target, state);
  if (!target || !/\.prefab$/i.test(target)) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: target || null,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      reason: 'Prefab open preflight requires a db://assets prefab path ending with .prefab.',
    }, boundary);
  }
  var exists = await assetExists(target);
  if (!exists) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: target,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      reason: 'Prefab open preflight blocked because the target prefab asset does not exist: ' + target,
    }, boundary);
  }
  if (currentUrl === target) {
    return {
      ok: true,
      success: true,
      blocked: false,
      skipped: true,
      blockedOperation: operation,
      targetUrl: target,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      supportedCapability: 'mcp_safe_prefab_editor_context_open',
      reason: 'Target prefab is already the current editor context.',
    };
  }
  var save = await saveCurrentBeforeNavigation(target);
  if (!save || save.ok !== true) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: target,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      reason: 'Prefab open preflight blocked because the current editor context could not be saved or proven safe without a dialog.',
      save: save || null,
    }, boundary);
  }
  return {
    ok: true,
    success: true,
    blocked: false,
    skipped: false,
    blockedOperation: operation,
    targetUrl: target,
    current: state && state.current || null,
    editorState: state && state.currentAsset || null,
    supportedCapability: 'mcp_safe_prefab_editor_context_open',
    currentUrl: currentUrl || null,
    save: save,
    reason: 'Prefab open is safe: target exists and current context was saved or proven safe through dialog-free MCP/AssetDB paths.',
  };
}

async function assessPrefabCloseDialogRisk(targetUrl, state, operation) {
  operation = operation || 'close_prefab';
  var target = normalizeDbUrl(targetUrl);
  var currentUrl = normalizeDbUrl(state && state.currentAsset && state.currentAsset.url);
  var current = await getCurrentAssetInfo();
  var prefabUrl = target || currentUrl || (current && /\.prefab$/i.test(String(current.url || '')) ? normalizeDbUrl(current.url) : null);
  var dumpInfo = await queryCurrentPrefabEditDump(current);
  if (!prefabUrl && dumpInfo && (dumpInfo.assetUuid || dumpInfo.prefabUuid)) {
    try { prefabUrl = await withTimeout(Editor.Message.request('asset-db', 'query-url', dumpInfo.assetUuid || dumpInfo.prefabUuid), 'asset-db query-url prefab close preflight', 3000); } catch (queryUrlError) {}
  }
  var boundary = buildMcpContextSwitchBoundary(operation, prefabUrl || target || null, state);
  if (!prefabUrl || !/\.prefab$/i.test(String(prefabUrl))) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: target || null,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      reason: 'Prefab close preflight requires the current prefab edit context to resolve to a db://assets prefab path.',
      missingCapability: 'current_prefab_edit_asset_url_readback',
    }, boundary);
  }
  if (!dumpInfo || dumpInfo.ok !== true || !dumpInfo.rootUuid) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: prefabUrl,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      prefabDump: dumpInfo || null,
      reason: 'Prefab close preflight blocked because current prefab edit metadata could not be read.',
      missingCapability: 'current_prefab_edit_root_uuid_readback',
    }, boundary);
  }
  var dirty = await querySceneDirtyState();
  if (dirty.known !== true) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: prefabUrl,
      dirtyState: dirty,
      reason: 'Prefab close preflight blocked because current dirty state is unknown.',
      missingCapability: 'current_prefab_dirty_state_readback',
    }, boundary);
  }
  var save = dirty.dirty === true ? await saveCurrentPrefabEditContextViaSceneSave({ current: current, prefabUrl: prefabUrl, settleMs: 800 }) : {
    ok: true,
    skipped: true,
    dirtyState: dirty,
    reason: 'Current prefab edit context is already clean.',
  };
  if (!save || save.ok !== true) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: operation,
      targetUrl: prefabUrl,
      dirtyState: dirty,
      save: save || null,
      reason: 'Prefab close preflight blocked because scene.save-scene did not prove clean.',
      missingCapability: save && save.missingCapability || 'dialog_free_prefab_edit_save_clean_readback',
    }, boundary);
  }
  return {
    ok: true,
    success: true,
    blocked: false,
    skipped: false,
    blockedOperation: operation,
    targetUrl: prefabUrl,
    current: state && state.current || null,
    editorState: state && state.currentAsset || null,
    prefabDump: dumpInfo,
    dirtyState: dirty,
    save: save,
    supportedCapability: 'dialog_free_prefab_scene_save_close_readback',
    reason: 'Prefab close is safe: current prefab edit context is clean or was saved with scene.save-scene and verified clean. manage_prefab(close) may call scene.close-scene.',
  };
}

async function querySceneDirtyState() {
  try {
    var dirty = await withTimeout(Editor.Message.request('scene', 'query-dirty'), 'scene query-dirty', 3000);
    return { known: true, dirty: dirty === true };
  } catch (e) {
    return { known: false, dirty: null, error: e.message || String(e) };
  }
}

async function setNodePropertyRecorded(opts) {
  opts = opts || {};
  if (!opts.uuid) throw new Error('setNodePropertyRecorded requires uuid');
  if (!opts.path) throw new Error('setNodePropertyRecorded requires path');
  var dump = opts.dump || { type: opts.type || 'String', value: opts.value };
  var recordingId = null;
  var attempts = [];
  var record = opts.record !== false;

  if (opts.beginRecording !== false) {
    try {
      recordingId = await withTimeout(Editor.Message.request('scene', 'begin-recording', opts.uuid), 'scene begin-recording ' + opts.uuid, opts.timeoutMs || 5000);
      attempts.push({ message: 'scene.begin-recording', ok: true, recordingId: recordingId || null });
    } catch (beginError) {
      attempts.push({ message: 'scene.begin-recording', ok: false, error: beginError.message || String(beginError) });
    }
  }

  try {
    var setResult = await withTimeout(Editor.Message.request('scene', 'set-property', {
      uuid: opts.uuid,
      path: opts.path,
      dump: dump,
      record: record,
    }), 'scene set-property recorded ' + opts.path, opts.timeoutMs || 5000);
    attempts.push({ message: 'scene.set-property', ok: true, result: setResult, record: record, path: opts.path });
  } catch (setError) {
    if (recordingId) {
      try { await withTimeout(Editor.Message.request('scene', 'cancel-recording', recordingId), 'scene cancel-recording ' + recordingId, opts.timeoutMs || 5000); } catch (cancelError) {}
    }
    throw setError;
  }

  if (recordingId) {
    try {
      var endResult = await withTimeout(Editor.Message.request('scene', 'end-recording', recordingId), 'scene end-recording ' + recordingId, opts.timeoutMs || 5000);
      attempts.push({ message: 'scene.end-recording', ok: true, result: endResult, recordingId: recordingId });
    } catch (endError) {
      attempts.push({ message: 'scene.end-recording', ok: false, error: endError.message || String(endError), recordingId: recordingId });
    }
  }

  await delay(Number(opts.settleMs || 300));
  return {
    ok: true,
    success: true,
    uuid: opts.uuid,
    path: opts.path,
    dump: dump,
    record: record,
    recordingId: recordingId || null,
    attempts: attempts,
    sceneMessage: 'scene.set-property(record:true)',
  };
}

async function queryNodeDump(uuid, opts) {
  opts = opts || {};
  if (!uuid) throw new Error('queryNodeDump requires uuid');
  return await withTimeout(Editor.Message.request('scene', 'query-node', uuid), 'scene query-node ' + uuid, opts.timeoutMs || 5000);
}

async function assessSceneOpenDialogRisk(targetUrl, state) {
  var target = normalizeDbUrl(targetUrl);
  var currentUrl = normalizeDbUrl(state && state.currentAsset && state.currentAsset.url);
  var boundary = buildMcpContextSwitchBoundary('open_scene', target, state);
  if (!target || !/\.scene$/i.test(target)) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: 'open_scene',
      targetUrl: target || null,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      reason: 'Scene open preflight requires a db://assets scene path ending with .scene.',
    }, boundary);
  }
  var exists = await assetExists(target);
  if (!exists) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: 'open_scene',
      targetUrl: target,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      reason: 'Scene open preflight blocked because the target scene asset does not exist: ' + target,
    }, boundary);
  }
  if (currentUrl === target) {
    return {
      ok: true,
      success: true,
      blocked: false,
      skipped: true,
      blockedOperation: 'open_scene',
      targetUrl: target,
      current: state && state.current || null,
      editorState: state && state.currentAsset || null,
      alreadyOpen: true,
      supportedCapability: 'mcp_safe_scene_editor_context_open',
      reason: 'Target scene is already open; no editor context switch is needed.',
    };
  }
  var dirty = state && state.currentAsset || {};
  if (dirty.dirtyKnown !== true) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: 'open_scene',
      targetUrl: target,
      current: state && state.current || null,
      editorState: dirty,
      reason: 'Scene open preflight blocked because current scene dirty state could not be proven.',
    }, boundary);
  }
  if (dirty.dirty === true) {
    return Object.assign({
      ok: false,
      success: false,
      blocked: true,
      skipped: true,
      interactivePromptSuppressed: true,
      blockedOperation: 'open_scene',
      targetUrl: target,
      current: state && state.current || null,
      editorState: dirty,
      reason: 'Scene open preflight blocked because current scene is dirty; call save_silent first.',
      safeAlternative: 'Call manage_scene(action:"save_silent") and rerun open_scene preflight.',
    }, boundary);
  }
  return {
    ok: true,
    success: true,
    blocked: false,
    skipped: false,
    blockedOperation: 'open_scene',
    targetUrl: target,
    current: state && state.current || null,
    editorState: dirty,
    supportedCapability: 'mcp_safe_scene_editor_context_open',
    currentUrl: currentUrl || null,
    reason: 'Scene open is safe: target exists and current scene dirty state is known clean.',
  };
}

function normalizeDbUrl(url) {
  return url ? String(url).replace(/\\/g, '/') : '';
}

function inferAssetKind(url, operation) {
  var text = String(url || operation || '').toLowerCase();
  if (text.indexOf('prefab') !== -1 || /\.prefab$/i.test(text)) return 'prefab';
  if (text.indexOf('scene') !== -1 || /\.scene$/i.test(text)) return 'scene';
  return 'asset';
}

function buildMcpContextSwitchBoundary(operation, targetUrl, state) {
  var target = normalizeDbUrl(targetUrl);
  var currentUrl = normalizeDbUrl(state && state.currentAsset && state.currentAsset.url);
  var kind = inferAssetKind(target, operation);
  var verb = /^close/i.test(String(operation || '')) ? 'close' : (/^switch/i.test(String(operation || '')) ? 'switch' : 'open');
  var missingCapability = 'mcp_safe_' + kind + '_editor_context_' + verb;
  return {
    reason: 'MCP cannot safely ' + verb + ' the requested ' + kind + ' editor context unless the target asset exists and dialog-free save/navigation preflight passes. This is an MCP capability boundary, not a human prefab/scene editing task.',
    unsupported: true,
    missingCapability: missingCapability,
    supportedMcpAlternatives: [
      'Create or update ' + kind + ' assets through AssetDB/static workflows before editor context switching.',
      'Save the current asset through save_silent when a db:// path is resolved.',
      'Validate prefab/scene content with static or in-place MCP validators.',
      'Instantiate prefabs into the current scene when scene-level placement is sufficient.',
    ],
    safeAlternative: 'Use AssetDB/static/in-place validation, or open only after the existing asset and silent-save preflight pass.',
    nextSuggestedFix: 'Add and regression-test MCP-safe ' + kind + ' context editing workflows that never require Cocos dialogs or human save participation.',
    evidence: kind === 'prefab' ? {
      probe: 'asset-db.open-asset can enter a prefab edit scene. The target prefab must already exist and the current context must be saved or proven safe through non-interactive paths.',
      limitation: 'Close remains blocked until a Cocos 3.8 main-process close API is proven dialog-free.',
      requiredCapability: 'prefab edit-context identity + dialog-free close readback',
    } : undefined,
    currentUrl: currentUrl || null,
    targetUrl: target || null,
  };
}

async function getCurrentAssetInfo() {
  var sceneUrl = null;
  var sceneUuid = null;
  try {
    var hierarchy = await require('./commandQueue').callSceneScript('get-hierarchy', { depth: 0 }, 3000);
    if (hierarchy && hierarchy.uuid) {
      sceneUuid = hierarchy.uuid;
      var assetInfo = null;
      try {
        sceneUrl = await Editor.Message.request('asset-db', 'query-url', sceneUuid);
      } catch (queryUrlError) {}
      if (sceneUrl) {
        try { assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', sceneUrl); } catch (assetInfoError) {}
      }
      if (!sceneUrl && assetInfo && assetInfo.url) sceneUrl = assetInfo.url;
      if (!sceneUrl && assetInfo && assetInfo.source) sceneUrl = assetInfo.source;
      if (!sceneUrl && assetInfo && assetInfo.path && String(assetInfo.path).indexOf('db://') === 0) sceneUrl = assetInfo.path;
      if (sceneUrl && !/\.scene$/i.test(String(sceneUrl)) && assetInfo && String(assetInfo.importer || '') === 'scene') sceneUrl = String(sceneUrl) + '.scene';
      if (!sceneUrl && assetInfo && /\.scene$/i.test(String(assetInfo.source || ''))) sceneUrl = assetInfo.source;
      if (!sceneUrl && assetInfo && /\.scene$/i.test(String(assetInfo.file || ''))) {
        try {
          var projectAssets = (Editor.Project.path + '/assets').replace(/\\/g, '/');
          var filePath = String(assetInfo.file).replace(/\\/g, '/');
          if (filePath.indexOf(projectAssets + '/') === 0) {
            sceneUrl = 'db://assets/' + filePath.substring(projectAssets.length + 1);
          }
        } catch (fileMapError) {}
      }
      if (!sceneUrl && sceneUuid) sceneUrl = findSceneUrlByUuid(sceneUuid);
      if (sceneUrl && !/\.scene$/i.test(String(sceneUrl)) && assetInfo && String(assetInfo.importer || '') === 'scene') sceneUrl = String(sceneUrl) + '.scene';
      if (!sceneUrl && hierarchy && /-scene$/.test(String(hierarchy.name || ''))) {
        var inferredPrefabUrl = findUniquePrefabUrlByBasename(String(hierarchy.name).replace(/-scene$/, ''));
        if (inferredPrefabUrl) sceneUrl = inferredPrefabUrl;
      }
      if (sceneUrl) return { ok: true, uuid: sceneUuid, url: sceneUrl, assetInfo: assetInfo || null };
    }
  } catch (e) {}
  return { ok: false, uuid: sceneUuid, url: null };
}

async function savePrefab(opts) {
  opts = opts || {};
  var current = await getCurrentAssetInfo();
  var requestedUrl = opts.path && /\.prefab$/i.test(String(opts.path || '')) ? opts.path : null;
  var prefabUrl = requestedUrl || (current && /\.prefab$/i.test(String(current.url || '')) ? current.url : null);
  var errors = [];

  async function tryGuardedPrefabSave(currentInfo, targetUrl) {
    var sceneSave = await saveCurrentPrefabEditContextViaSceneSave({
      current: currentInfo,
      prefabUrl: targetUrl,
      timeoutMs: opts.timeoutMs,
      settleMs: opts.settleMs,
    });
    if (sceneSave && sceneSave.ok) return sceneSave;
    if (sceneSave && sceneSave.errors && sceneSave.errors.length) errors = errors.concat(sceneSave.errors);
    if (sceneSave && sceneSave.reason) errors.push('scene.save-scene prefab save: ' + sceneSave.reason);

    var applySave = await applyCurrentPrefabEditContext({
      current: currentInfo,
      prefabUrl: targetUrl,
      timeoutMs: opts.timeoutMs,
      settleMs: opts.settleMs,
    });
    if (applySave && applySave.ok) return applySave;
    if (applySave && applySave.errors && applySave.errors.length) errors = errors.concat(applySave.errors);
    if (applySave && applySave.reason) errors.push('scene.apply-prefab prefab save: ' + applySave.reason);
    return null;
  }

  if (prefabUrl) {
    if (requestedUrl && (!current || String(current.url || '') !== requestedUrl)) {
      try {
        var requestedUuid = await urlToUuid(requestedUrl);
        var activeDump = await queryCurrentPrefabEditDump(current);
        var activeAssetUuid = activeDump && (activeDump.assetUuid || activeDump.prefabUuid) || null;
        var activeAssetUrl = null;
        if (activeAssetUuid) {
          try { activeAssetUrl = await withTimeout(Editor.Message.request('asset-db', 'query-url', activeAssetUuid), 'asset-db query-url active prefab save target', 3000); } catch (activeAssetUrlError) {}
        }
        if (activeDump && activeDump.ok === true && activeAssetUuid && ((requestedUuid && String(activeAssetUuid) === String(requestedUuid)) || normalizeDbUrl(activeAssetUrl) === normalizeDbUrl(requestedUrl))) {
          var activeGuardedSave = await tryGuardedPrefabSave(current, requestedUrl);
          if (activeGuardedSave && activeGuardedSave.ok) return activeGuardedSave;
        }
      } catch (activeSaveCheckError) {
        errors.push('active prefab edit target check: ' + (activeSaveCheckError.message || String(activeSaveCheckError)));
      }
      try {
        var exists = await assetExists(requestedUrl);
        if (exists) {
          return {
            ok: true,
            saved: true,
            editorSave: false,
            assetDbSave: false,
            staticAsset: true,
            path: requestedUrl,
            current: current,
            message: 'Prefab path is a persisted AssetDB asset and is not the active prefab edit target; no interactive save was invoked.',
          };
        }
      } catch (staticCheckError) {
        errors.push('static prefab asset check: ' + (staticCheckError.message || String(staticCheckError)));
      }
    }
    if (!requestedUrl || (current && String(current.url || '') === prefabUrl)) {
      var guardedSave = await tryGuardedPrefabSave(current, prefabUrl);
      if (guardedSave && guardedSave.ok) return guardedSave;
    }
    errors.push('asset-db.save-asset(serialized content) is disabled for dirty prefab edit contexts because it can leave the editor dirty and trigger Cocos save dialogs.');
  }

  return {
    ok: false,
    skipped: true,
    interactivePromptSuppressed: true,
    path: prefabUrl,
    reason: prefabUrl
      ? 'Silent prefab save failed; interactive save-scene fallback was suppressed'
      : 'Current prefab asset path could not be resolved; interactive save-scene fallback was suppressed',
    errors: errors,
    current: current,
  };
}

async function saveCurrentPrefabEditContextViaSceneSave(opts) {
  opts = opts || {};
  if (opts.__mcpRegressionSimulateDirtyCurrentPrefab === true) {
    var simulatedPrefabUrl = opts.prefabUrl || opts.path || 'db://assets/__mcp_regression__/prefab-edit-context/Simulated.prefab';
    var simulatedDirtyBefore = opts.__mcpRegressionSimulateDirtyUnknown === true
      ? { known: false, dirty: null, error: 'simulated dirty-state readback failure' }
      : { known: true, dirty: opts.__mcpRegressionSimulateDirty !== false };
    if (simulatedDirtyBefore.known !== true) {
      return {
        ok: false,
        skipped: true,
        interactivePromptSuppressed: true,
        current: opts.current || { ok: true, url: simulatedPrefabUrl, uuid: opts.uuid || 'simulated-prefab-uuid' },
        path: simulatedPrefabUrl,
        prefabDump: opts.__mcpRegressionSimulateRootDumpFailure === true ? { ok: false, error: 'simulated root dump failure' } : { ok: true, rootUuid: 'simulated-root-uuid' },
        dirtyBefore: simulatedDirtyBefore,
        reason: 'Current prefab edit dirty state was not available for scene.save-scene.',
        missingCapability: 'current_prefab_dirty_state_readback',
      };
    }
    return {
      ok: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      current: opts.current || { ok: true, url: simulatedPrefabUrl, uuid: opts.uuid || 'simulated-prefab-uuid' },
      path: simulatedPrefabUrl,
      prefabDump: opts.__mcpRegressionSimulateRootDumpFailure === true ? { ok: false, error: 'simulated root dump failure' } : { ok: true, rootUuid: 'simulated-root-uuid' },
      dirtyBefore: simulatedDirtyBefore,
      reason: 'scene.save-scene is disabled for unattended current prefab edit-context automation because recent live validation showed it can surface a native save dialog before MCP regains control.',
      missingCapability: 'dialog_free_prefab_edit_mode_save_api',
      disabledUnsafeApi: 'Editor.Message.request("scene", "save-scene")',
      safetyPolicy: 'blocked-by-default-unless-explicit-regression-opt-in',
    };
  }
  var current = opts.current || await getCurrentAssetInfo();
  var prefabUrl = opts.prefabUrl || opts.path || (current && current.url || null);
  var allowRealSceneSaveProbe = opts.__mcpRegressionAllowRealSceneSaveProbe === true;
  if (!prefabUrl || !/\.prefab$/i.test(String(prefabUrl))) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl || null,
      reason: 'Current prefab edit context cannot be scene-saved because no db:// prefab URL was resolved.',
      missingCapability: 'current_prefab_edit_asset_url_readback',
    };
  }

  var dumpInfo = await queryCurrentPrefabEditDump(current);
  var dirtyBefore = await querySceneDirtyState();
  if (dirtyBefore.known !== true) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo || null,
      dirtyBefore: dirtyBefore,
      reason: 'Current prefab edit dirty state was not available for scene.save-scene.',
      missingCapability: 'current_prefab_dirty_state_readback',
    };
  }
  if (allowRealSceneSaveProbe !== true) {
    return {
      ok: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo || null,
      dirtyBefore: dirtyBefore,
      reason: 'scene.save-scene is disabled for unattended current prefab edit-context automation because recent live validation showed it can surface a native save dialog before MCP regains control.',
      missingCapability: dirtyBefore.dirty === true
        ? 'dialog_free_prefab_edit_mode_save_api'
        : 'dialog_free_prefab_edit_mode_save_api',
      supportedMcpAlternatives: [
        'Keep working through static prefab export and validation paths that do not switch or close editor context.',
        'Use dialog-safe open/switch only from a clean current context already proven by scene.query-dirty=false.',
        'Add a newly proven non-interactive prefab edit save API with readback and regression coverage before re-enabling automatic save.',
      ],
      nextSuggestedFix: 'Do not probe scene.save-scene from unattended prefab edit-context flows until a non-popup save path is proven and regression-tested.',
      disabledUnsafeApi: 'Editor.Message.request("scene", "save-scene")',
      safetyPolicy: 'blocked-by-default-unless-explicit-regression-opt-in',
    };
  }
  var errors = [];
  try {
    await withTimeout(Editor.Message.request('scene', 'save-scene'), 'scene save-scene current prefab edit context', opts.timeoutMs || 8000);
  } catch (e) {
    errors.push('scene.save-scene: ' + (e.message || String(e)));
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      dirtyBefore: dirtyBefore,
      errors: errors,
      reason: 'scene.save-scene failed for the current prefab edit context; no interactive save fallback was invoked.',
      missingCapability: 'dialog_free_prefab_edit_mode_save_api',
    };
  }

  await delay(Number(opts.settleMs || 1000));
  var dirtyAfter = await querySceneDirtyState();
  if (dirtyAfter.known !== true || dirtyAfter.dirty !== false) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      sceneMessage: 'scene.save-scene',
      dirtyBefore: dirtyBefore,
      dirtyAfter: dirtyAfter,
      errors: ['scene.save-scene returned, but scene.query-dirty did not prove clean.'],
      reason: 'scene.save-scene was not accepted as dialog-free prefab edit save because clean dirty-state could not be proven.',
      missingCapability: 'dialog_free_prefab_edit_save_clean_readback',
    };
  }

  return {
    ok: true,
    success: true,
    saved: true,
    editorSave: true,
    assetDbSave: false,
    serializedContentSave: false,
    sceneMessage: 'scene.save-scene',
    supportedCapability: 'dialog_free_prefab_edit_scene_save_clean_readback',
    path: prefabUrl,
    current: current,
    prefabDump: dumpInfo,
    rootDumpAvailable: !!(dumpInfo && dumpInfo.ok === true && dumpInfo.rootUuid),
    dirtyBefore: dirtyBefore,
    dirtyAfter: dirtyAfter,
    disabledSavePath: 'cce.Utils.serialize + asset-db.save-asset is not used for prefab edit mode save.',
    message: 'Prefab edit context saved through scene.save-scene and verified clean through scene.query-dirty.',
  };
}

async function queryCurrentPrefabEditDump(current) {
  current = current || await getCurrentAssetInfo();
  var hierarchy = null;
  var rootUuid = null;
  try {
    hierarchy = await require('./commandQueue').callSceneScript('get-hierarchy', { depth: 3, maxChildren: 50 }, 3000);
    rootUuid = hierarchy && hierarchy.uuid || current && current.uuid || null;
  } catch (e) {
    rootUuid = current && current.uuid || null;
  }
  if (!rootUuid) {
    return { ok: false, current: current, hierarchy: hierarchy, error: 'Current prefab edit root uuid could not be resolved.' };
  }
  var candidates = [];
  function addCandidate(uuid, name, depth) {
    if (!uuid) return;
    for (var i = 0; i < candidates.length; i++) {
      if (candidates[i].uuid === uuid) return;
    }
    candidates.push({ uuid: uuid, name: name || null, depth: depth || 0 });
  }
  function walkHierarchy(node, depth) {
    if (!node || depth > 3) return;
    addCandidate(node.uuid, node.name, depth);
    var children = node.children || [];
    for (var i = 0; i < children.length; i++) walkHierarchy(children[i], depth + 1);
  }
  walkHierarchy(hierarchy, 0);
  if (!candidates.length) addCandidate(rootUuid, null, 0);
  function inferPrefabContentRootFromHierarchy(tree, prefabUrl) {
    if (!tree || !prefabUrl || !/\.prefab$/i.test(String(prefabUrl || ''))) return null;
    var prefabBaseName = path.basename(String(prefabUrl), '.prefab');
    function isLikelyEditorCameraNode(node) {
      if (!node) return false;
      var name = String(node.name || '');
      var components = Array.isArray(node.components) ? node.components : [];
      if (name === 'Camera') return true;
      return components.indexOf('cc.Camera') !== -1;
    }
    function firstMeaningfulChild(node) {
      if (!node || !Array.isArray(node.children)) return null;
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (!child) continue;
        if (isLikelyEditorCameraNode(child)) continue;
        return child;
      }
      return null;
    }
    var direct = firstMeaningfulChild(tree);
    if (direct && String(direct.name || '') === prefabBaseName) {
      return { uuid: direct.uuid || null, name: direct.name || null, depth: 1, source: 'scene_root_child' };
    }
    var canvasHost = null;
    if (Array.isArray(tree.children)) {
      for (var ci = 0; ci < tree.children.length; ci++) {
        var child = tree.children[ci];
        if (!child) continue;
        if (String(child.name || '') === 'should_hide_in_hierarchy') {
          canvasHost = child;
          break;
        }
      }
    }
    var nested = firstMeaningfulChild(canvasHost);
    if (nested) {
      return {
        uuid: nested.uuid || null,
        name: nested.name || null,
        depth: canvasHost ? 2 : 1,
        source: canvasHost ? 'should_hide_in_hierarchy_child' : 'scene_root_fallback',
      };
    }
    return null;
  }
  var errors = [];
  for (var ci = 0; ci < candidates.length; ci++) {
    var candidate = candidates[ci];
    try {
      var dump = await withTimeout(Editor.Message.request('scene', 'query-node', candidate.uuid), 'scene query-node ' + candidate.uuid, 5000);
      var prefab = dump && dump.__prefab__ || null;
      var prefabStateInfo = prefab && prefab.prefabStateInfo || null;
      if (!prefab) continue;
      return {
        ok: true,
        current: current,
        hierarchy: hierarchy,
        rootUuid: prefab && prefab.rootUuid || candidate.uuid,
        nodeUuid: candidate.uuid,
        nodeName: candidate.name || null,
        nodeDepth: candidate.depth,
        prefabUuid: prefab && prefab.uuid || null,
        assetUuid: prefabStateInfo && prefabStateInfo.assetUuid || null,
        prefabStateInfo: prefabStateInfo ? {
          state: prefabStateInfo.state,
          isApplicable: !!prefabStateInfo.isApplicable,
          isRevertable: !!prefabStateInfo.isRevertable,
          isUnwrappable: !!prefabStateInfo.isUnwrappable,
        } : null,
        hasPrefabDump: true,
      };
    } catch (e2) {
      errors.push(candidate.uuid + ': ' + (e2.message || String(e2)));
    }
  }
  var inferredRoot = inferPrefabContentRootFromHierarchy(hierarchy, current && current.url || null);
  if (inferredRoot && inferredRoot.uuid) {
    return {
      ok: true,
      current: current,
      hierarchy: hierarchy,
      rootUuid: inferredRoot.uuid,
      nodeUuid: inferredRoot.uuid,
      nodeName: inferredRoot.name || null,
      nodeDepth: inferredRoot.depth,
      prefabUuid: null,
      assetUuid: null,
      prefabStateInfo: null,
      hasPrefabDump: false,
      inferred: true,
      inferenceSource: inferredRoot.source,
      warning: 'Prefab edit root was inferred from hierarchy because __prefab__.rootUuid was unavailable.',
    };
  }
  return {
    ok: false,
    current: current,
    hierarchy: hierarchy,
    rootUuid: rootUuid,
    candidates: candidates,
    errors: errors,
    error: 'No current prefab edit node exposed __prefab__.rootUuid.',
  };
}

async function applyCurrentPrefabEditContext(opts) {
  opts = opts || {};
  var current = opts.current || await getCurrentAssetInfo();
  var prefabUrl = opts.prefabUrl || (current && current.url || null);
  var dumpInfo = await queryCurrentPrefabEditDump(current);
  if (!dumpInfo || dumpInfo.ok !== true || !dumpInfo.rootUuid) {
    return {
      ok: false,
      skipped: true,
      current: current,
      prefabDump: dumpInfo || null,
      errors: ['scene.query-node current prefab dump: ' + ((dumpInfo && dumpInfo.error) || 'missing __prefab__.rootUuid')],
      reason: 'Current editor context does not expose prefab edit metadata required for dialog-free apply-prefab save.',
      missingCapability: 'current_prefab_edit_root_uuid_readback',
    };
  }
  try {
    await withTimeout(Editor.Message.request('scene', 'apply-prefab', dumpInfo.rootUuid), 'scene apply-prefab ' + dumpInfo.rootUuid, opts.timeoutMs || 5000);
    await delay(Number(opts.settleMs || 800));
    var dirtyAfter = await querySceneDirtyState();
    if (dirtyAfter.known !== true || dirtyAfter.dirty !== false) {
      return {
        ok: false,
        skipped: true,
        interactivePromptSuppressed: true,
        current: current,
        path: prefabUrl,
        prefabDump: dumpInfo,
        dirtyAfter: dirtyAfter,
        errors: ['scene.apply-prefab returned, but scene.query-dirty did not prove clean.'],
        reason: 'Prefab apply was not accepted as dialog-free save because clean dirty-state could not be proven after apply-prefab.',
        missingCapability: 'dialog_free_prefab_apply_clean_readback',
      };
    }
    return {
      ok: true,
      saved: true,
      editorSave: true,
      assetDbSave: false,
      path: prefabUrl,
      current: current,
      prefabDump: dumpInfo,
      sceneMessage: 'scene.apply-prefab',
      dirtyAfter: dirtyAfter,
      supportedCapability: 'dialog_free_dirty_prefab_apply_before_navigation',
      message: 'Prefab edit context saved through Cocos Inspector apply-prefab API and verified clean through scene.query-dirty.',
    };
  } catch (e) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      error: e.message || String(e),
      errors: ['scene.apply-prefab: ' + (e.message || String(e))],
      reason: 'Dialog-free prefab apply failed; interactive save fallback was suppressed.',
      missingCapability: 'dialog_free_prefab_apply_before_navigation',
    };
  }
}

async function saveCurrentPrefabEditContextViaAssetDbSerialize(opts) {
  opts = opts || {};
  var current = opts.current || await getCurrentAssetInfo();
  var prefabUrl = opts.prefabUrl || opts.path || (current && current.url || null);
  if (!prefabUrl || !/\.prefab$/i.test(String(prefabUrl))) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl || null,
      reason: 'Current prefab edit context cannot be AssetDB-saved because no db:// prefab URL was resolved.',
      missingCapability: 'current_prefab_edit_asset_url_readback',
    };
  }

  var dumpInfo = await queryCurrentPrefabEditDump(current);
  if (!dumpInfo || dumpInfo.ok !== true || !dumpInfo.rootUuid) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo || null,
      reason: 'Current prefab edit metadata was not available for Cocos serializer save.',
      missingCapability: 'current_prefab_edit_root_uuid_readback',
    };
  }

  var serializeResult = null;
  try {
    serializeResult = await require('./commandQueue').callSceneScript('serialize-current-prefab-edit-context', {
      rootUuid: dumpInfo.rootUuid,
      nodeUuid: dumpInfo.nodeUuid,
      prefabUuid: dumpInfo.prefabUuid || dumpInfo.assetUuid || current && current.uuid || null,
      returnContent: true,
    }, opts.timeoutMs || 8000);
  } catch (serializeError) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      error: serializeError.message || String(serializeError),
      reason: 'Cocos scene process failed to serialize the current prefab edit context.',
      missingCapability: 'current_prefab_edit_context_serialize_readback',
    };
  }

  var content = serializeResult && serializeResult.content;
  if (!serializeResult || serializeResult.ok !== true || typeof content !== 'string' || !content.trim()) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      serialize: serializeResult || null,
      reason: 'Cocos serializer did not return non-empty prefab content.',
      missingCapability: serializeResult && serializeResult.missingCapability || 'current_prefab_edit_context_serialize_readback',
    };
  }

  var saveTarget = prefabUrl;
  var saveErrors = [];
  try {
    await withTimeout(Editor.Message.request('asset-db', 'save-asset', saveTarget, content), 'asset-db save-asset serialized prefab', opts.timeoutMs || 8000);
  } catch (saveByUrlError) {
    saveErrors.push('asset-db.save-asset(url, content): ' + (saveByUrlError.message || String(saveByUrlError)));
    var uuid = current && current.uuid || await urlToUuid(prefabUrl);
    if (uuid) {
      try {
        saveTarget = uuid;
        await withTimeout(Editor.Message.request('asset-db', 'save-asset', uuid, content), 'asset-db save-asset serialized prefab uuid', opts.timeoutMs || 8000);
      } catch (saveByUuidError) {
        saveErrors.push('asset-db.save-asset(uuid, content): ' + (saveByUuidError.message || String(saveByUuidError)));
      }
    }
  }

  if (saveErrors.length && saveTarget === prefabUrl) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      serialize: {
        ok: true,
        serializeKind: serializeResult.serializeKind,
        serializer: serializeResult.serializer,
        contentLength: serializeResult.contentLength,
        hasPrefabType: serializeResult.hasPrefabType,
        rootUuid: serializeResult.rootUuid,
        prefabUuid: serializeResult.prefabUuid,
      },
      saveErrors: saveErrors,
      reason: 'AssetDB rejected serialized prefab content; interactive save fallback was suppressed.',
      missingCapability: 'dialog_free_prefab_assetdb_serialized_save',
    };
  }

  await delay(Number(opts.settleMs || 800));
  var dirtyAfter = await querySceneDirtyState();
  if (dirtyAfter.known !== true || dirtyAfter.dirty !== false) {
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      current: current,
      path: prefabUrl,
      prefabDump: dumpInfo,
      saveTarget: saveTarget,
      serialize: {
        ok: true,
        serializeKind: serializeResult.serializeKind,
        serializer: serializeResult.serializer,
        contentLength: serializeResult.contentLength,
        hasPrefabType: serializeResult.hasPrefabType,
        rootUuid: serializeResult.rootUuid,
        prefabUuid: serializeResult.prefabUuid,
      },
      dirtyAfter: dirtyAfter,
      saveErrors: saveErrors,
      reason: 'Serialized prefab AssetDB save returned, but scene.query-dirty did not prove clean.',
      missingCapability: 'dialog_free_prefab_edit_save_clean_readback',
    };
  }

  return {
    ok: true,
    success: true,
    saved: true,
    editorSave: false,
    assetDbSave: true,
    serializedContentSave: true,
    sceneMessage: 'asset-db.save-asset(serialized content)',
    supportedCapability: 'dialog_free_prefab_edit_serialize_assetdb_save_clean_readback',
    path: prefabUrl,
    saveTarget: saveTarget,
    current: current,
    prefabDump: dumpInfo,
    serialize: {
      ok: true,
      serializeKind: serializeResult.serializeKind,
      serializer: serializeResult.serializer,
      contentLength: serializeResult.contentLength,
      hasPrefabType: serializeResult.hasPrefabType,
      rootUuid: serializeResult.rootUuid,
      prefabUuid: serializeResult.prefabUuid,
      nodeUuid: serializeResult.nodeUuid,
      nodeName: serializeResult.nodeName,
      attempts: serializeResult.attempts || [],
    },
    dirtyAfter: dirtyAfter,
    saveErrors: saveErrors,
    message: 'Prefab edit context serialized in the scene process, saved through AssetDB, and verified clean through scene.query-dirty.',
  };
}

async function closePrefab(opts) {
  opts = opts || {};
  var current = await getCurrentAssetInfo();
  var prefabUrl = opts.path && /\.prefab$/i.test(String(opts.path || '')) ? normalizeDbUrl(opts.path) : null;
  var currentUrl = normalizeDbUrl(current && current.url);
  if (!prefabUrl && currentUrl && /\.prefab$/i.test(currentUrl)) prefabUrl = currentUrl;
  if (!prefabUrl || !/\.prefab$/i.test(String(prefabUrl))) {
    var state = await getEditorState();
    var boundary = buildMcpContextSwitchBoundary(opts.action || 'close_prefab', opts.path || null, state);
    return {
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      action: 'close',
      path: opts.path || null,
      reason: 'Current editor context is not a resolved db:// prefab edit context; close suppressed.',
      unsupported: boundary.unsupported,
      missingCapability: 'current_prefab_edit_asset_url_readback',
      supportedMcpAlternatives: boundary.supportedMcpAlternatives,
      safeAlternative: boundary.safeAlternative,
      nextSuggestedFix: boundary.nextSuggestedFix,
      evidence: boundary.evidence || null,
      current: current,
    };
  }
  if (currentUrl && currentUrl !== prefabUrl) {
    return {
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      action: 'close',
      path: prefabUrl,
      current: current,
      reason: 'Requested prefab close target is not the current editor prefab context; close suppressed.',
      missingCapability: 'current_prefab_close_target_identity_readback',
    };
  }

  var dumpInfo = await queryCurrentPrefabEditDump(current);
  if (!dumpInfo || dumpInfo.ok !== true || !dumpInfo.rootUuid) {
    var dirtyForMissingDump = await querySceneDirtyState();
    var saveForMissingDump = null;
    var dirtyAfterMissingDumpSave = dirtyForMissingDump;
    if (dirtyForMissingDump.known === true && dirtyForMissingDump.dirty === true) {
      saveForMissingDump = await saveCurrentPrefabEditContextViaSceneSave({
        current: current,
        prefabUrl: prefabUrl,
        timeoutMs: opts.timeoutMs || 8000,
        settleMs: opts.settleMs || 1000,
      });
      dirtyAfterMissingDumpSave = saveForMissingDump && saveForMissingDump.dirtyAfter || await querySceneDirtyState();
    }
    if (dirtyForMissingDump.known === true && dirtyAfterMissingDumpSave.known === true && dirtyAfterMissingDumpSave.dirty === false) {
      try {
        await withTimeout(Editor.Message.request('scene', 'close-scene'), 'scene close-scene clean prefab edit context without dump', opts.timeoutMs || 8000);
        await delay(Number(opts.closeSettleMs || opts.settleMs || 1000));
        var cleanAfter = await getCurrentAssetInfo();
        var cleanHierarchy = null;
        try { cleanHierarchy = await require('./commandQueue').callSceneScript('get-hierarchy', { depth: 1 }, 3000); } catch (cleanHierarchyError) {}
        return {
          ok: true,
          success: true,
          closed: true,
          action: 'close',
          path: prefabUrl,
          previous: current,
          current: cleanAfter,
          hierarchy: cleanHierarchy ? { name: cleanHierarchy.name || null, uuid: cleanHierarchy.uuid || null } : null,
          prefabDump: dumpInfo || null,
          dirtyBefore: dirtyForMissingDump,
          saveBeforeClose: saveForMissingDump,
          dirtyAfterSave: dirtyAfterMissingDumpSave,
          closeMessage: 'scene.close-scene',
          saveMessage: saveForMissingDump ? 'scene.save-scene' : null,
          supportedCapability: saveForMissingDump ? 'dialog_free_prefab_scene_save_close_readback_without_root_dump' : 'dialog_free_clean_prefab_close_readback',
          message: saveForMissingDump
            ? 'Dirty prefab edit context was saved with scene.save-scene, verified clean, then closed; full prefab dump was unavailable.'
            : 'Clean prefab edit context was closed through scene.close-scene; full prefab dump was unavailable but dirty-state was clean.',
        };
      } catch (cleanCloseError) {
        return {
          ok: false,
          success: false,
          skipped: true,
          blocked: true,
          interactivePromptSuppressed: true,
          action: 'close',
          path: prefabUrl,
          current: current,
          prefabDump: dumpInfo || null,
          dirtyBefore: dirtyForMissingDump,
          saveBeforeClose: saveForMissingDump,
          dirtyAfterSave: dirtyAfterMissingDumpSave,
          errors: ['scene.close-scene: ' + (cleanCloseError.message || String(cleanCloseError))],
          reason: 'scene.close-scene failed for a clean prefab edit context with missing prefab dump.',
          missingCapability: 'dialog_free_prefab_close_api',
        };
      }
    }
    return {
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      action: 'close',
      path: prefabUrl,
      current: current,
      prefabDump: dumpInfo || null,
      dirtyBefore: dirtyForMissingDump,
      saveBeforeClose: saveForMissingDump,
      dirtyAfterSave: dirtyAfterMissingDumpSave,
      reason: 'Current prefab edit metadata was not available; close suppressed.',
      missingCapability: dirtyForMissingDump.known !== true
        ? 'current_prefab_dirty_state_readback'
        : (saveForMissingDump && saveForMissingDump.ok !== true ? (saveForMissingDump.missingCapability || 'dialog_free_prefab_edit_save_clean_readback') : 'current_prefab_edit_root_uuid_readback'),
    };
  }

  var dirtyBefore = await querySceneDirtyState();
  var saveBeforeClose = null;
  var dirtyAfterSave = dirtyBefore;
  if (dirtyBefore.known !== true) {
    return {
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      action: 'close',
      path: prefabUrl,
      current: current,
      prefabDump: dumpInfo,
      dirtyBefore: dirtyBefore,
      reason: 'Current prefab dirty state is unknown; close suppressed.',
      missingCapability: 'current_prefab_dirty_state_readback',
    };
  }
  if (dirtyBefore.dirty === true || opts.alwaysApplyBeforeClose === true) {
    saveBeforeClose = await saveCurrentPrefabEditContextViaSceneSave({
      current: current,
      prefabUrl: prefabUrl,
      timeoutMs: opts.timeoutMs || 8000,
      settleMs: opts.settleMs || 1000,
    });
    if (!saveBeforeClose || saveBeforeClose.ok !== true) {
      return {
        ok: false,
        success: false,
        skipped: true,
        blocked: true,
        interactivePromptSuppressed: true,
        action: 'close',
        path: prefabUrl,
        current: current,
        prefabDump: dumpInfo,
        dirtyBefore: dirtyBefore,
        saveBeforeClose: saveBeforeClose || null,
        errors: saveBeforeClose && saveBeforeClose.errors || [],
        reason: 'scene.save-scene did not prove a clean current prefab edit context; close suppressed to avoid a Cocos save dialog.',
        missingCapability: saveBeforeClose && saveBeforeClose.missingCapability || 'dialog_free_prefab_edit_save_clean_readback',
      };
    }
    dirtyAfterSave = saveBeforeClose.dirtyAfter || await querySceneDirtyState();
    if (dirtyAfterSave.known !== true || dirtyAfterSave.dirty !== false) {
      return {
        ok: false,
        success: false,
        skipped: true,
        blocked: true,
        interactivePromptSuppressed: true,
        action: 'close',
        path: prefabUrl,
        current: current,
        prefabDump: dumpInfo,
        saveBeforeClose: saveBeforeClose,
        dirtyBefore: dirtyBefore,
        dirtyAfterSave: dirtyAfterSave,
        reason: 'scene.save-scene returned, but scene.query-dirty did not prove clean; close suppressed.',
        missingCapability: 'dialog_free_prefab_edit_save_clean_readback',
      };
    }
  }

  try {
    await withTimeout(Editor.Message.request('scene', 'close-scene'), 'scene close-scene current prefab edit context', opts.timeoutMs || 8000);
  } catch (closeError) {
    return {
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      action: 'close',
      path: prefabUrl,
      current: current,
      prefabDump: dumpInfo,
      saveBeforeClose: saveBeforeClose,
      dirtyBefore: dirtyBefore,
      dirtyAfterSave: dirtyAfterSave,
      errors: ['scene.close-scene: ' + (closeError.message || String(closeError))],
      reason: 'scene.close-scene failed for the current prefab edit context.',
      missingCapability: 'dialog_free_prefab_close_api',
    };
  }

  await delay(Number(opts.closeSettleMs || opts.settleMs || 1000));
  var after = await getCurrentAssetInfo();
  var afterUrl = normalizeDbUrl(after && after.url);
  var hierarchy = null;
  try { hierarchy = await require('./commandQueue').callSceneScript('get-hierarchy', { depth: 1 }, 3000); } catch (hierarchyError) {}
  if (afterUrl === prefabUrl) {
    return {
      ok: false,
      success: false,
      partial: true,
      interactivePromptSuppressed: true,
      action: 'close',
      path: prefabUrl,
      previous: current,
      current: after,
      hierarchy: hierarchy,
      prefabDump: dumpInfo,
      saveBeforeClose: saveBeforeClose,
      dirtyBefore: dirtyBefore,
      dirtyAfterSave: dirtyAfterSave,
      closeMessage: 'scene.close-scene',
      reason: 'scene.close-scene returned, but MCP still reads the same prefab as current.',
      missingCapability: 'dialog_free_prefab_close_readback',
    };
  }

  return {
    ok: true,
    success: true,
    closed: true,
    action: 'close',
    path: prefabUrl,
    previous: current,
    current: after,
    hierarchy: hierarchy ? { name: hierarchy.name || null, uuid: hierarchy.uuid || null } : null,
    prefabDump: dumpInfo,
    dirtyBefore: dirtyBefore,
    saveBeforeClose: saveBeforeClose,
    dirtyAfterSave: dirtyAfterSave,
    closeMessage: 'scene.close-scene',
    saveMessage: dirtyBefore.dirty === true || opts.alwaysApplyBeforeClose === true ? 'scene.save-scene' : null,
    disabledSavePath: 'scene.apply-prefab-scene is not available in this Cocos 3.8.7 project; cce.Utils.serialize + asset-db.save-asset is not used for prefab edit mode save.',
    supportedCapability: 'dialog_free_prefab_scene_save_close_readback',
    message: 'Prefab edit context was saved when dirty, closed through scene.close-scene, and verified no longer current.',
  };
}

async function closeSilent(opts) {
  opts = opts || {};
  return await closePrefab(Object.assign({}, opts, { action: opts.action || 'close_silent' }));
}

function getPrefabEditContextRecoveryApiEvidence() {
  return [
    {
      api: 'Editor.Message.request("scene", "query-dirty")',
      status: 'proven',
      evidence: 'Used by querySceneDirtyState() with readback of known dirty state.',
    },
    {
      api: 'Editor.Message.request("scene", "save-scene")',
      status: 'disabled-for-unattended-prefab-save',
      evidence: 'Historical readback existed, but live automation surfaced native save dialogs. MCP now blocks this path by default unless an explicit regression-only opt-in is used.',
    },
    {
      api: 'Editor.Message.request("scene", "close-scene")',
      status: 'proven-clean-only',
      evidence: 'Used by closePrefab() only after clean dirty-state proof; not accepted as dirty discard.',
    },
    {
      api: 'dialog-free dirty prefab discard close',
      status: 'not-found',
      evidence: 'Local Cocos 3.8.7 source search did not identify a documented IPC that discards dirty prefab edit context without save/confirm dialog.',
    },
  ];
}

function makeDirtyPrefabRecoveryBlocked(reason, extra) {
  extra = extra || {};
  return Object.assign({
    ok: false,
    success: false,
    status: 'blocked',
    blocked: true,
    skipped: true,
    interactivePromptSuppressed: true,
    noProtectedAssetManualWrite: true,
    noPrefabOpenCloseOrSwitch: true,
    missingCapability: extra.missingCapability || 'dialog_free_dirty_prefab_discard_close_api',
    reason: reason || 'Dirty prefab edit context recovery is blocked because MCP cannot prove a dialog-free discard/close path.',
    researchedApis: extra.researchedApis || getPrefabEditContextRecoveryApiEvidence(),
    nextSuggestedFix: extra.nextSuggestedFix || 'Find and verify a Cocos Creator editor IPC/API that can discard and close a dirty prefab edit context without dialogs, then add readback and regression coverage.',
  }, extra);
}

async function inspectPrefabEditContextRecovery(opts) {
  opts = opts || {};
  if (opts.__mcpRegressionSimulateDirtyCurrentPrefab === true) {
    var simulatedDirty = opts.__mcpRegressionSimulateDirtyUnknown === true
      ? { known: false, dirty: null, error: 'simulated dirty-state readback failure' }
      : { known: true, dirty: opts.__mcpRegressionSimulateDirty !== false };
    var simulatedDump = opts.__mcpRegressionSimulateRootDumpFailure === true
      ? { ok: false, error: 'simulated root dump failure' }
      : { ok: true, rootUuid: 'simulated-root-uuid', nodeUuid: 'simulated-root-uuid' };
    var currentUrl = opts.path || 'db://assets/__mcp_regression__/prefab-edit-context/DirtyRecoveryFixture.prefab';
    var save = null;
    if (simulatedDirty.known === true && simulatedDirty.dirty === true && opts.trySave === true) {
      save = opts.__mcpRegressionSimulateSaveSceneFailure === true
        ? {
            ok: false,
            skipped: true,
            interactivePromptSuppressed: true,
            path: currentUrl,
            reason: 'simulated scene.save-scene failure',
            missingCapability: 'dialog_free_prefab_edit_mode_save_api',
            errors: ['scene.save-scene: simulated failure'],
          }
        : {
            ok: true,
            success: true,
            saved: true,
            path: currentUrl,
            sceneMessage: 'scene.save-scene',
            dirtyAfter: { known: true, dirty: false },
          };
    }
    var canCleanClose = simulatedDirty.known === true && simulatedDirty.dirty === false;
    var canSaveThenClose = simulatedDirty.known === true && simulatedDirty.dirty === true && save && save.ok === true;
    var discardSupported = opts.__mcpRegressionSimulateDiscardCloseSupported === true;
    var strategy = canCleanClose ? 'clean-close' : (canSaveThenClose ? 'save-then-close' : (discardSupported ? 'discard-then-close' : 'blocked'));
    var simulatedMissingCapability = null;
    if (strategy === 'blocked') {
      simulatedMissingCapability = simulatedDirty.known !== true
        ? 'current_prefab_dirty_state_readback'
        : 'dialog_free_dirty_prefab_discard_close_api';
    }
    return {
      ok: true,
      success: true,
      status: strategy === 'blocked' ? 'blocked' : 'passed',
      blocked: strategy === 'blocked',
      simulated: true,
      isPrefabContext: true,
      currentPrefab: { url: currentUrl, uuid: opts.uuid || 'simulated-prefab-uuid' },
      dirtyKnown: simulatedDirty.known,
      dirty: simulatedDirty.dirty,
      dirtyError: simulatedDirty.error || null,
      dirtyState: simulatedDirty,
      prefabDump: simulatedDump,
      attemptedSafeSave: save,
      recommendedStrategy: strategy,
      supportedStrategies: ['inspect', 'clean-close-with-readback', 'save-then-close-with-readback'].concat(discardSupported ? ['discard-then-close-with-readback'] : []),
      unsupportedStrategies: discardSupported ? [] : ['dirty-discard-close-without-proven-editor-api'],
      dialogRisk: strategy === 'blocked' ? 'dirty-or-unknown-current-prefab-context' : 'guarded-by-readback',
      canProveNoDialog: strategy !== 'blocked',
      missingCapability: simulatedMissingCapability,
      researchedApis: getPrefabEditContextRecoveryApiEvidence(),
      nextSuggestedFix: strategy === 'blocked'
        ? 'Do not close/switch/replay. Add a proven dialog-free dirty prefab discard close API or manually recover the editor outside MCP.'
        : 'Call recover_prefab_edit_context/manage_prefab(recover_or_close_silent) to execute the recommended guarded strategy.',
    };
  }

  var state = null;
  var current = null;
  var currentUrl = null;
  var dirty = null;
  var dumpInfo = null;
  var save = null;
  try { state = await getEditorState(); } catch (stateError) { state = { ok: false, error: stateError.message || String(stateError) }; }
  current = state && state.current || await getCurrentAssetInfo();
  currentUrl = normalizeDbUrl(current && current.url || state && state.currentAsset && state.currentAsset.url || opts.path || null);
  var isPrefabContext = /\.prefab$/i.test(String(currentUrl || ''));
  if (!isPrefabContext) {
    return {
      ok: true,
      success: true,
      status: 'not_applicable',
      blocked: false,
      isPrefabContext: false,
      currentPrefab: currentUrl ? { url: currentUrl, uuid: current && current.uuid || null } : null,
      dirtyKnown: state && state.currentAsset ? state.currentAsset.dirtyKnown : null,
      dirty: state && state.currentAsset ? state.currentAsset.dirty : null,
      recommendedStrategy: 'none',
      supportedStrategies: ['inspect'],
      unsupportedStrategies: [],
      dialogRisk: 'none',
      canProveNoDialog: true,
      reason: 'Current editor context is not a prefab edit context.',
    };
  }

  dirty = await querySceneDirtyState();
  try { dumpInfo = await queryCurrentPrefabEditDump(current); } catch (dumpError) { dumpInfo = { ok: false, error: dumpError.message || String(dumpError) }; }
  if (dirty.known === true && dirty.dirty === true && opts.trySave === true) {
    save = await saveCurrentPrefabEditContextViaSceneSave({
      current: current,
      prefabUrl: currentUrl,
      timeoutMs: opts.timeoutMs || 8000,
      settleMs: opts.settleMs || 1000,
    });
    dirty = save && save.dirtyAfter || await querySceneDirtyState();
  }

  var cleanClose = dirty.known === true && dirty.dirty === false;
  var saveThenClose = save && save.ok === true && dirty.known === true && dirty.dirty === false;
  var recommended = cleanClose ? 'clean-close' : (saveThenClose ? 'save-then-close' : 'blocked');
  var missingCapability = null;
  if (dirty.known !== true) missingCapability = 'current_prefab_dirty_state_readback';
  else if (dirty.dirty === true && save && save.ok !== true) missingCapability = 'dialog_free_dirty_prefab_discard_close_api';
  else if (dirty.dirty === true) missingCapability = 'dialog_free_dirty_prefab_discard_close_api';
  else if (!dumpInfo || dumpInfo.ok !== true || !dumpInfo.rootUuid) missingCapability = 'current_prefab_edit_root_uuid_readback';

  return {
    ok: true,
    success: true,
    status: recommended === 'blocked' ? 'blocked' : 'passed',
    blocked: recommended === 'blocked',
    isPrefabContext: true,
    currentPrefab: { url: currentUrl, uuid: current && current.uuid || state && state.currentAsset && state.currentAsset.uuid || null },
    current: current,
    dirtyKnown: dirty.known,
    dirty: dirty.known ? dirty.dirty : null,
    dirtyError: dirty.error || null,
    dirtyState: dirty,
    prefabDump: dumpInfo || null,
    attemptedSafeSave: save,
    recommendedStrategy: recommended,
    supportedStrategies: ['inspect', 'clean-close-with-readback', 'save-then-close-with-readback'],
    unsupportedStrategies: ['dirty-discard-close-without-proven-editor-api'],
    dialogRisk: recommended === 'blocked' ? 'dirty-or-unknown-current-prefab-context' : 'guarded-by-readback',
    canProveNoDialog: recommended !== 'blocked',
    missingCapability: missingCapability,
    researchedApis: getPrefabEditContextRecoveryApiEvidence(),
    reason: recommended === 'blocked'
      ? 'MCP cannot prove a dialog-free recovery path for the current prefab edit context.'
      : 'MCP can close the current prefab edit context through a guarded clean/save-clean close path.',
    nextSuggestedFix: recommended === 'blocked'
      ? 'Do not close/switch/replay. Add a proven dialog-free dirty prefab discard close API or manually recover the editor outside MCP.'
      : 'Call recover_prefab_edit_context/manage_prefab(recover_or_close_silent) to execute the recommended guarded strategy.',
  };
}

async function recoverPrefabEditContext(opts) {
  opts = opts || {};
  var plan = await inspectPrefabEditContextRecovery(Object.assign({}, opts, { trySave: opts.trySave === true }));
  if (!plan || plan.isPrefabContext !== true) {
    return Object.assign({
      ok: true,
      success: true,
      status: 'not_applicable',
      recovered: false,
      closed: false,
      recoveryPlan: plan,
      reason: 'No prefab edit context recovery was required.',
    }, plan || {});
  }
  if (plan.recommendedStrategy === 'blocked' || plan.blocked === true || plan.canProveNoDialog !== true) {
    return makeDirtyPrefabRecoveryBlocked(plan.reason || 'Prefab edit context recovery is blocked.', {
      currentPrefab: plan.currentPrefab || null,
      dirtyKnown: plan.dirtyKnown,
      dirty: plan.dirty,
      dirtyError: plan.dirtyError || null,
      prefabDump: plan.prefabDump || null,
      attemptedSafeSave: plan.attemptedSafeSave || null,
      recoveryPlan: plan,
      missingCapability: plan.missingCapability || 'dialog_free_dirty_prefab_discard_close_api',
    });
  }
  if (opts.execute === false || opts.inspectOnly === true) {
    return Object.assign({}, plan, {
      ok: true,
      success: true,
      status: 'dry_run',
      recovered: false,
      closed: false,
      reason: 'Recovery plan was inspected only; no editor close was executed.',
    });
  }
  return await closePrefab({
    path: plan.currentPrefab && plan.currentPrefab.url || opts.path || null,
    action: opts.action || 'recover_or_close_silent',
    timeoutMs: opts.timeoutMs,
    settleMs: opts.settleMs,
    closeSettleMs: opts.closeSettleMs,
  });
}

async function saveCurrentBeforeNavigation(targetUrl) {
  var current = await getCurrentAssetInfo();
  var currentUrl = current && current.url ? String(current.url) : '';
  if (!currentUrl && current && current.uuid) {
    var dirtyWithoutUrl = await querySceneDirtyState();
    if (dirtyWithoutUrl.known && dirtyWithoutUrl.dirty === false) {
      return {
        ok: true,
        skipped: true,
        current: current,
        dirtyState: dirtyWithoutUrl,
        reason: 'Current editor context has a UUID but no db:// URL; scene.query-dirty proves it is clean, so navigation can proceed without a save dialog.',
      };
    }
    var dumpWithoutUrl = await queryCurrentPrefabEditDump(current);
    var dumpAssetUuid = dumpWithoutUrl && (dumpWithoutUrl.assetUuid || dumpWithoutUrl.prefabUuid) || null;
    var dumpUrl = null;
    if (dumpAssetUuid) {
      try { dumpUrl = await withTimeout(Editor.Message.request('asset-db', 'query-url', dumpAssetUuid), 'asset-db query-url current prefab dump asset', 3000); } catch (queryDumpUrlError) {}
    }
    if (dumpUrl && /\.prefab$/i.test(String(dumpUrl))) {
      var sceneSaveWithoutUrl = await saveCurrentPrefabEditContextViaSceneSave({ current: current, prefabUrl: dumpUrl, settleMs: 800 });
      if (sceneSaveWithoutUrl && sceneSaveWithoutUrl.ok) {
        return {
          ok: true,
          saved: true,
          current: current,
          save: sceneSaveWithoutUrl,
          dirtyState: dirtyWithoutUrl,
          reason: 'Current prefab edit context had no db:// URL, but its prefab asset UUID resolved to a URL and scene.save-scene proved it clean.',
        };
      }
      return {
        ok: false,
        skipped: true,
        interactivePromptSuppressed: true,
        reason: 'Navigation suppressed because current prefab edit context was dirty and scene.save-scene did not prove it clean.',
        current: current,
        dirtyState: dirtyWithoutUrl,
        prefabDump: dumpWithoutUrl,
        resolvedPrefabUrl: dumpUrl,
        save: sceneSaveWithoutUrl,
      };
    }
    var applyWithoutUrl = await applyCurrentPrefabEditContext({ current: current, settleMs: 800 });
    if (applyWithoutUrl && applyWithoutUrl.ok) {
      return {
        ok: true,
        saved: true,
        current: current,
        save: applyWithoutUrl,
        dirtyState: dirtyWithoutUrl,
        reason: 'Current editor context had no db:// URL, but prefab edit metadata was read and scene.apply-prefab saved it without a dialog.',
      };
    }
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      reason: 'Navigation suppressed because the current editor asset has a UUID but no db:// URL and clean dirty-state or dialog-free prefab apply-save could not be proven; opening another asset may trigger a Cocos save dialog',
      current: current,
      dirtyState: dirtyWithoutUrl,
      save: applyWithoutUrl || null,
    };
  }
  if (!currentUrl || currentUrl === targetUrl) {
    return { ok: true, skipped: true, reason: 'No different current asset to save before navigation', current: current };
  }
  if (/\.prefab$/i.test(currentUrl)) {
    var prefabSave = await savePrefab({ settleMs: 800 });
    if (prefabSave && prefabSave.ok) {
      return { ok: true, saved: true, current: currentUrl, save: prefabSave };
    }
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      reason: 'Navigation suppressed because current prefab could not be proven saved silently',
      current: current,
      save: prefabSave,
    };
  }
  if (/\.scene$/i.test(currentUrl)) {
    var sceneSave = await saveScene({ settleMs: 800 });
    if (sceneSave && sceneSave.ok) {
      return { ok: true, saved: true, current: currentUrl, save: sceneSave };
    }
    return {
      ok: false,
      skipped: true,
      interactivePromptSuppressed: true,
      reason: 'Navigation suppressed because current scene could not be saved silently',
      current: current,
      save: sceneSave,
    };
  }
  return { ok: true, skipped: true, reason: 'Current editor asset is not scene/prefab', current: current };
}

async function openScene(url) {
  url = normalizeDbUrl(url);
  var current = await getCurrentAssetInfo();
  if (normalizeDbUrl(current && current.url) === normalizeDbUrl(url)) {
    return {
      ok: true,
      success: true,
      opened: false,
      alreadyOpen: true,
      path: url,
      current: current,
      reason: 'Target scene is already the current editor context; no editor tab switch was needed.',
    };
  }
  var state = await getEditorState();
  var risk = await assessSceneOpenDialogRisk(url, state);
  if (!risk || risk.ok !== true || risk.blocked === true) {
    return Object.assign({
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      path: url,
      current: current,
    }, risk || {});
  }
  var targetUuid = await urlToUuid(url);
  var openErrors = [];
  try {
    await withTimeout(Editor.Message.request('asset-db', 'open-asset', url), 'asset-db open-asset ' + url, 5000);
  } catch (openByUrlError) {
    openErrors.push('asset-db.open-asset(url): ' + (openByUrlError.message || String(openByUrlError)));
    if (targetUuid) {
      try {
        await withTimeout(Editor.Message.request('asset-db', 'open-asset', targetUuid), 'asset-db open-asset ' + targetUuid, 5000);
      } catch (openByUuidError) {
        openErrors.push('asset-db.open-asset(uuid): ' + (openByUuidError.message || String(openByUuidError)));
      }
    }
  }
  var timeoutMs = 10000;
  var started = Date.now();
  var verified = null;
  while (Date.now() - started < timeoutMs) {
    await delay(250);
    verified = await getCurrentAssetInfo();
    if (normalizeDbUrl(verified && verified.url) === url) {
      var dirtyAfter = await querySceneDirtyState();
      return {
        ok: true,
        success: true,
        opened: true,
        alreadyOpen: false,
        path: url,
        uuid: targetUuid || verified.uuid || null,
        previous: current,
        current: verified,
        supportedCapability: 'mcp_safe_scene_editor_context_open',
        openMessage: 'asset-db.open-asset',
        dirtyAfterOpen: dirtyAfter,
        message: 'Scene opened through MCP-safe workflow after proving current scene was clean.',
      };
    }
  }
  var boundary = buildMcpContextSwitchBoundary('open_scene', url, state);
  return {
    ok: false,
    success: false,
    skipped: true,
    blocked: false,
    partial: true,
    interactivePromptSuppressed: true,
    reason: 'Scene open command returned but MCP could not verify that the target scene became current before timeout.',
    path: url,
    current: current,
    verifiedCurrent: verified,
    openErrors: openErrors,
    unsupported: boundary.unsupported,
    missingCapability: 'mcp_safe_scene_editor_context_open_verification',
    supportedMcpAlternatives: boundary.supportedMcpAlternatives,
    safeAlternative: boundary.safeAlternative,
    nextSuggestedFix: boundary.nextSuggestedFix,
    evidence: boundary.evidence || null,
  };
}

async function openPrefab(url) {
  url = normalizeDbUrl(url);
  var current = await getCurrentAssetInfo();
  if (normalizeDbUrl(current && current.url) === normalizeDbUrl(url)) {
    return {
      ok: true,
      success: true,
      opened: false,
      alreadyOpen: true,
      path: url,
      current: current,
      reason: 'Target prefab is already the current editor context; no editor tab switch was needed.',
    };
  }
  var state = await getEditorState();
  var risk = await assessPrefabOpenDialogRisk(url, state, 'open_prefab');
  if (!risk || risk.ok !== true || risk.blocked === true) {
    return Object.assign({
      ok: false,
      success: false,
      skipped: true,
      blocked: true,
      interactivePromptSuppressed: true,
      path: url,
      current: current,
    }, risk || {});
  }
  var targetUuid = await urlToUuid(url);
  var targetName = path.basename(url, '.prefab');
  var openErrors = [];
  try {
    await withTimeout(Editor.Message.request('asset-db', 'open-asset', url), 'asset-db open-asset ' + url, 5000);
  } catch (openByUrlError) {
    openErrors.push('asset-db.open-asset(url): ' + (openByUrlError.message || String(openByUrlError)));
    if (targetUuid) {
      try {
        await withTimeout(Editor.Message.request('asset-db', 'open-asset', targetUuid), 'asset-db open-asset ' + targetUuid, 5000);
      } catch (openByUuidError) {
        openErrors.push('asset-db.open-asset(uuid): ' + (openByUuidError.message || String(openByUuidError)));
      }
    }
  }
  var timeoutMs = 10000;
  var started = Date.now();
  var verified = null;
  var hierarchy = null;
  while (Date.now() - started < timeoutMs) {
    await delay(250);
    verified = await getCurrentAssetInfo();
    if (normalizeDbUrl(verified && verified.url) === url) {
      var dirtyAfterUrl = await querySceneDirtyState();
      return {
        ok: true,
        success: true,
        opened: true,
        alreadyOpen: false,
        path: url,
        uuid: targetUuid || verified.uuid || null,
        previous: current,
        current: verified,
        supportedCapability: 'mcp_safe_prefab_editor_context_open',
        openMessage: 'asset-db.open-asset',
        dirtyAfterOpen: dirtyAfterUrl,
        verification: 'current_asset_url',
        message: 'Prefab opened through MCP-safe workflow after proving target exists and current context was dialog-free saved or safe.',
      };
    }
    try {
      var dump = await queryCurrentPrefabEditDump(verified);
      var dumpAssetUuid = dump && (dump.assetUuid || dump.prefabUuid) || null;
      var dumpUrl = null;
      if (dumpAssetUuid) {
        try { dumpUrl = await withTimeout(Editor.Message.request('asset-db', 'query-url', dumpAssetUuid), 'asset-db query-url open-prefab verify', 3000); } catch (dumpUrlError) {}
      }
      if (normalizeDbUrl(dumpUrl) === url) {
        var dirtyAfterDump = await querySceneDirtyState();
        return {
          ok: true,
          success: true,
          opened: true,
          alreadyOpen: false,
          path: url,
          uuid: targetUuid || dumpAssetUuid || verified && verified.uuid || null,
          previous: current,
          current: verified,
          prefabDump: dump,
          supportedCapability: 'mcp_safe_prefab_editor_context_open',
          openMessage: 'asset-db.open-asset',
          dirtyAfterOpen: dirtyAfterDump,
          verification: 'prefab_dump_asset_uuid',
          message: 'Prefab opened through MCP-safe workflow; current prefab edit dump asset UUID resolves to the target prefab URL.',
        };
      }
    } catch (dumpVerifyError) {}
    try {
      hierarchy = await require('./commandQueue').callSceneScript('get-hierarchy', { depth: 1 }, 3000);
      if (hierarchy && String(hierarchy.name || '').indexOf(targetName) === 0) {
        var dirtyAfterName = await querySceneDirtyState();
        return {
          ok: true,
          success: true,
          opened: true,
          alreadyOpen: false,
          path: url,
          uuid: targetUuid || null,
          previous: current,
          current: verified,
          hierarchy: { uuid: hierarchy.uuid || null, name: hierarchy.name || null },
          supportedCapability: 'mcp_safe_prefab_editor_context_open',
          openMessage: 'asset-db.open-asset',
          dirtyAfterOpen: dirtyAfterName,
          verification: 'prefab_edit_scene_name',
          message: 'Prefab opened through MCP-safe workflow; Cocos reports a prefab edit scene whose name matches the target prefab.',
        };
      }
    } catch (hierarchyError) {}
  }
  var boundary = buildMcpContextSwitchBoundary('open_prefab', url, state);
  return {
    ok: false,
    success: false,
    skipped: true,
    blocked: false,
    partial: true,
    interactivePromptSuppressed: true,
    reason: 'Prefab open command returned but MCP could not verify that the target prefab became current before timeout.',
    path: url,
    current: current,
    verifiedCurrent: verified,
    hierarchy: hierarchy,
    openErrors: openErrors,
    unsupported: boundary.unsupported,
    missingCapability: 'mcp_safe_prefab_editor_context_open_verification',
    supportedMcpAlternatives: boundary.supportedMcpAlternatives,
    safeAlternative: boundary.safeAlternative,
    nextSuggestedFix: boundary.nextSuggestedFix,
    evidence: boundary.evidence || null,
  };
}

async function getProjectInfo() {
  try {
    var versionInfo = require('./versionInfo');
    var serverConfig = global.__COCOS_MCP_SERVER_CONFIG__ || {};
    var sceneUuid = null;
    var toolCount = null;
    try {
      var toolRegistry = require('../tools/index');
      toolCount = toolRegistry.listAll().length;
    } catch (e) {}
    try {
      sceneUuid = Editor.Scene && Editor.Scene.uuid || null;
    } catch (e) {}
    return {
      path: Editor.Project.path,
      version: Editor.App.version,
      currentSceneUuid: sceneUuid,
      cocosEngine: getCocosEnginePaths(),
      mcp: versionInfo.getVersionInfo({
        editorVersion: Editor.App.version,
        toolCount: toolCount,
        configPath: serverConfig._lastConfigPath || '',
        platform: serverConfig.platform || '',
      }),
    };
  } catch (e) {
    return { error: 'Failed to get project info: ' + e.message };
  }
}

function existingDir(value) {
  if (!value) return null;
  try {
    var resolved = path.resolve(String(value));
    return fs.existsSync(resolved) && fs.statSync(resolved).isDirectory() ? resolved : null;
  } catch (e) {
    return null;
  }
}

function uniqueStrings(values) {
  var seen = {};
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    if (!value) continue;
    var key = String(value).replace(/\\/g, '/').toLowerCase();
    if (seen[key]) continue;
    seen[key] = true;
    out.push(value);
  }
  return out;
}

function getCocosEnginePathDocPaths(projectRoot) {
  var root = projectRoot || (Editor.Project && Editor.Project.path) || '';
  return {
    jsonPath: root ? path.join(root, 'settings', 'cocos-creator-38-mcp', 'engine-paths.json') : '',
    markdownPath: root ? path.join(root, 'settings', 'cocos-creator-38-mcp', 'engine-paths.md') : '',
  };
}

function readDocumentedCocosEnginePaths(projectRoot) {
  var docPaths = getCocosEnginePathDocPaths(projectRoot);
  if (!docPaths.jsonPath || !fs.existsSync(docPaths.jsonPath)) {
    return {
      ok: false,
      source: 'settings/cocos-creator-38-mcp/engine-paths.json',
      status: 'manual_source_path_required',
      missingCapability: 'manual_cocos_engine_source_path_configuration',
      message: 'Cocos engine/editor source path is not configured. Use the MCP panel button "Select Engine Source" or call refresh_cocos_engine_paths with a path.',
      docPaths: docPaths,
      searchRoots: [],
    };
  }
  try {
    var parsed = JSON.parse(fs.readFileSync(docPaths.jsonPath, 'utf8'));
    var searchRoots = Array.isArray(parsed.searchRoots) ? parsed.searchRoots.filter(existingDir) : [];
    var isManual = parsed.source === 'manual' || parsed.source === 'mcp-panel-manual';
      var out = Object.assign({}, parsed, {
        ok: isManual && searchRoots.length > 0,
      source: 'settings/cocos-creator-38-mcp/engine-paths.json',
      configuredSource: parsed.source || '',
      status: isManual && searchRoots.length > 0 ? 'passed' : 'manual_source_path_required',
      searchRoots: uniqueStrings(searchRoots),
      docPaths: docPaths,
    });
    if (!isManual) {
      out.missingCapability = 'manual_cocos_engine_source_path_configuration';
      out.message = 'Existing cocos-engine-paths.json was not manually configured and is ignored. Use the MCP panel button "Select Engine Source" to write the real source path.';
    }
    return out;
  } catch (e) {
    return {
      ok: false,
      source: 'settings/cocos-creator-38-mcp/engine-paths.json',
      docPaths: docPaths,
      error: e.message || String(e),
      searchRoots: [],
    };
  }
}

function getCocosEnginePaths(opts) {
  opts = opts || {};
  var projectRoot = opts.projectRoot || (Editor.Project && Editor.Project.path) || '';
  return readDocumentedCocosEnginePaths(projectRoot);
}

function buildCocosEnginePathsMarkdown(snapshot) {
  var lines = [];
  lines.push('# Cocos Engine Paths');
  lines.push('');
  lines.push('This file is written by cocos-creator-38-mcp after a user manually selects the Cocos engine/editor source directory.');
  lines.push('');
  lines.push('- Generated at: `' + (snapshot.generatedAt || '') + '`');
  lines.push('- Project path: `' + (snapshot.projectPath || '') + '`');
  lines.push('- Cocos Creator version: `' + (snapshot.version || '') + '`');
  lines.push('- Source: `' + (snapshot.source || '') + '`');
  lines.push('- Status: `' + (snapshot.ok ? 'ok' : 'missing') + '`');
  if (snapshot.manualPath) lines.push('- Manual path: `' + snapshot.manualPath + '`');
  lines.push('');
  lines.push('## Paths');
  lines.push('');
  ['manualPath', 'sourceRoot', 'resourcesPath', 'engine3dPath', 'engineEditorPath', 'appAsarUnpackedPath'].forEach(function (key) {
    if (snapshot[key]) lines.push('- `' + key + '`: `' + snapshot[key] + '`');
  });
  lines.push('');
  lines.push('## Search Roots');
  lines.push('');
  (snapshot.searchRoots || []).forEach(function (root) {
    lines.push('- `' + root + '`');
  });
  lines.push('');
  lines.push('## Agent Rule');
  lines.push('');
  lines.push('When a Cocos Creator 3.8 editor IPC/API is unclear, agents should use `get_cocos_engine_paths` and `search_cocos_engine_api` against this manually selected local source root before declaring the capability unsupported. If this file is missing or status is missing, ask the user to click the MCP panel button "Select Engine Source". This does not relax dialog-safety or protected asset rules.');
  lines.push('');
  return lines.join('\n');
}

function writeCocosEnginePathsDocs(opts) {
  opts = opts || {};
  var projectRoot = opts.projectRoot || (Editor.Project && Editor.Project.path) || '';
  if (!projectRoot) throw new Error('Cannot write cocos engine path docs without Editor.Project.path');
  var selectedPath = opts.path || opts.sourceRoot || opts.engineSourcePath || opts.manualPath;
  var sourceRoot = existingDir(selectedPath);
  if (!sourceRoot) throw new Error('A valid manually selected Cocos engine/editor source directory is required');
  var docPaths = getCocosEnginePathDocPaths(projectRoot);
  var engine3dPath = existingDir(path.join(sourceRoot, 'resources', '3d')) || (path.basename(sourceRoot).toLowerCase() === '3d' ? sourceRoot : null);
  var engineEditorPath = existingDir(path.join(sourceRoot, 'engine', 'editor')) || existingDir(path.join(sourceRoot, 'editor')) || (path.basename(sourceRoot).toLowerCase() === 'editor' ? sourceRoot : null);
  var resourcesPath = engine3dPath ? path.dirname(path.dirname(engine3dPath)) : null;
  var appAsarUnpackedPath = existingDir(path.join(sourceRoot, 'app.asar.unpacked'));
  var searchRoots = uniqueStrings([
    sourceRoot,
    engineEditorPath,
    engine3dPath,
    appAsarUnpackedPath,
  ]);
  var snapshot = {
    ok: searchRoots.length > 0,
    source: opts.source || 'manual',
    version: (Editor.App && Editor.App.version) || '',
    manualPath: sourceRoot,
    sourceRoot: sourceRoot,
    resourcesPath: resourcesPath,
    engine3dPath: engine3dPath,
    engineEditorPath: engineEditorPath,
    appAsarUnpackedPath: appAsarUnpackedPath,
    searchRoots: searchRoots,
    generatedAt: new Date().toISOString(),
    projectPath: projectRoot,
    docPaths: docPaths,
  };
  if (!fs.existsSync(path.dirname(docPaths.jsonPath))) fs.mkdirSync(path.dirname(docPaths.jsonPath), { recursive: true });
  fs.writeFileSync(docPaths.jsonPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  fs.writeFileSync(docPaths.markdownPath, buildCocosEnginePathsMarkdown(snapshot), 'utf8');
  return {
    ok: snapshot.ok,
    success: snapshot.ok,
    status: snapshot.ok ? 'passed' : 'missing_engine_paths',
    paths: snapshot,
    written: [docPaths.jsonPath, docPaths.markdownPath],
  };
}

function searchCocosEngineApi(opts) {
  opts = opts || {};
  var detected = getCocosEnginePaths({});
  var patterns = [];
  if (Array.isArray(opts.patterns)) patterns = opts.patterns;
  else if (opts.query) patterns = [opts.query];
  patterns = patterns.map(function (item) { return String(item || '').trim(); }).filter(Boolean);
  if (patterns.length === 0) throw new Error('query or patterns is required');

  var maxResults = Math.max(1, Math.min(Number(opts.maxResults || 50), 200));
  var maxFiles = Math.max(1, Math.min(Number(opts.maxFiles || 8000), 50000));
  var includeContext = opts.includeContext !== false;
  var caseSensitive = !!opts.caseSensitive;
  var allowedExts = opts.extensions && opts.extensions.length
    ? opts.extensions.map(function (item) { return String(item).toLowerCase(); })
    : ['.js', '.ts', '.json', '.md', '.d.ts', '.mjs', '.cjs'];
  var rootAliases = {
    source: detected.sourceRoot,
    manual: detected.manualPath,
    resources: detected.resourcesPath,
    engine3d: detected.engine3dPath,
    editor: detected.engineEditorPath,
    app: detected.appAsarUnpackedPath,
  };
  var requestedRoots = opts.roots && opts.roots.length ? opts.roots : ['editor', 'engine3d', 'source'];
  var roots = [];
  for (var r = 0; r < requestedRoots.length; r++) {
    var requested = String(requestedRoots[r] || '');
    var candidate = rootAliases[requested] || requested;
    var existing = existingDir(candidate);
    if (existing) roots.push(existing);
  }
  roots = uniqueStrings(roots);
  if (roots.length === 0) {
    return {
      ok: false,
      success: false,
      status: 'missing_engine_paths',
      missingCapability: 'manual_cocos_engine_source_path_configuration',
      message: 'No manually configured Cocos engine source roots are available. Use the MCP panel button "Select Engine Source" or call refresh_cocos_engine_paths with a path.',
      query: patterns,
      detected: detected,
      results: [],
      searchedFiles: 0,
    };
  }

  function matchesText(haystack, needle) {
    if (caseSensitive) return haystack.indexOf(needle) >= 0;
    return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
  }

  function shouldSkipDir(name) {
    return name === 'node_modules' || name === '.git' || name === 'temp' || name === 'library';
  }

  var results = [];
  var searchedFiles = 0;
  var skippedFiles = 0;
  function walk(dir) {
    if (searchedFiles >= maxFiles || results.length >= maxResults) return;
    var entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      if (searchedFiles >= maxFiles || results.length >= maxResults) return;
      var ent = entries[i];
      var full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!shouldSkipDir(ent.name)) walk(full);
        continue;
      }
      if (!ent.isFile()) continue;
      var lower = ent.name.toLowerCase();
      var allowed = allowedExts.some(function (ext) { return lower.slice(-ext.length) === ext; });
      if (!allowed) continue;
      searchedFiles++;
      var text;
      try {
        var stat = fs.statSync(full);
        if (stat.size > 1024 * 1024 * 2) { skippedFiles++; continue; }
        text = fs.readFileSync(full, 'utf8');
      } catch (e) {
        skippedFiles++;
        continue;
      }
      var lines = text.split(/\r?\n/);
      for (var lineIndex = 0; lineIndex < lines.length && results.length < maxResults; lineIndex++) {
        var line = lines[lineIndex];
        var matched = patterns.filter(function (pattern) { return matchesText(line, pattern); });
        if (matched.length === 0) continue;
        results.push({
          file: full,
          relativeFile: roots.reduce(function (best, root) {
            if (full.indexOf(root) === 0) {
              var rel = path.relative(root, full);
              if (!best || rel.length < best.length) return rel;
            }
            return best;
          }, null),
          line: lineIndex + 1,
          matched: matched,
          text: includeContext ? line.trim().slice(0, 500) : undefined,
        });
      }
    }
  }

  for (var rootIndex = 0; rootIndex < roots.length; rootIndex++) walk(roots[rootIndex]);
  return {
    ok: true,
    success: true,
    status: 'passed',
    query: patterns,
    roots: roots,
    detected: detected,
    searchedFiles: searchedFiles,
    skippedFiles: skippedFiles,
    resultCount: results.length,
    truncated: results.length >= maxResults || searchedFiles >= maxFiles,
    results: results,
  };
}

async function refreshAssetDb(url) {
  var target = url || 'db://assets/';
  var path = require('path');
  var fs = require('fs');

  async function refreshOne(assetUrl, shouldReimport) {
    try {
      await Editor.Message.request('asset-db', 'refresh-asset', assetUrl);
    } catch (e) {}
    if (shouldReimport) {
      try {
        await Editor.Message.request('asset-db', 'reimport-asset', assetUrl);
      } catch (e) {}
    }
  }

  if (target === 'db://assets/' || target === 'db://assets') {
    var assetsPath = path.join(Editor.Project.path, 'assets');
    var refreshed = [];
    try {
      var names = fs.readdirSync(assetsPath).filter(function (name) {
        return name && name.slice(-5) !== '.meta';
      });
      for (var i = 0; i < names.length; i++) {
        var childUrl = 'db://assets/' + names[i];
        await refreshOne(childUrl, false);
        refreshed.push(childUrl);
      }
    } catch (e) {}
    return refreshed.length > 0
      ? 'Asset database refreshed: ' + refreshed.join(', ')
      : 'Asset database refresh skipped: db://assets/ has no child assets';
  }

  try {
    await Editor.Message.request('asset-db', 'refresh-asset', target);
  } catch (e) {}
  try {
    await Editor.Message.request('asset-db', 'reimport-asset', target);
  } catch (e) {}
  return 'Asset database refreshed: ' + target;
}

async function assetExists(url) {
  try {
    var info = await Editor.Message.request('asset-db', 'query-asset-info', url);
    return !!(info && info.uuid);
  } catch (e) {
    return false;
  }
}

function assetExistsSync(url) {
  try {
    var path = require('path');
    var fs = require('fs');
    var projectPath = Editor.Project.path;
    if (String(url).indexOf('db://assets') === 0) {
      var rel = url.replace('db://assets', '');
      var fsp = path.join(projectPath, 'assets', rel);
      return fs.existsSync(fsp);
    }
    return false;
  } catch (e) {
    return false;
  }
}

async function urlToUuid(url) {
  try {
    var info = await Editor.Message.request('asset-db', 'query-asset-info', url);
    return (info && info.uuid) || null;
  } catch (e) {
    return null;
  }
}

function urlToUuidSync(url) {
  return null;
}

function urlToFspath(url) {
  try {
    var path = require('path');
    var projectPath = Editor.Project.path;
    if (String(url).indexOf('db://assets') === 0) {
      var rel = url.replace('db://assets', '');
      return path.join(projectPath, 'assets', rel);
    }
    if (String(url).indexOf('db://internal') === 0) {
      return null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function getSelection(type) {
  try {
    return Editor.Selection.getSelected(type || 'node') || [];
  } catch (e) {
    return [];
  }
}

function setSelection(type, ids) {
  try {
    type = type || 'node';
    ids = ids || [];
    Editor.Selection.clear(type);
    for (var i = 0; i < ids.length; i++) {
      Editor.Selection.select(type, ids[i]);
    }
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  sendToPanel: sendToPanel,
  sendToMain: sendToMain,
  saveScene: saveScene,
  getEditorState: getEditorState,
  ensureNoDialogRisk: ensureNoDialogRisk,
  buildMcpContextSwitchBoundary: buildMcpContextSwitchBoundary,
  savePrefab: savePrefab,
  queryCurrentPrefabEditDump: queryCurrentPrefabEditDump,
  applyCurrentPrefabEditContext: applyCurrentPrefabEditContext,
  saveCurrentPrefabEditContextViaSceneSave: saveCurrentPrefabEditContextViaSceneSave,
  saveCurrentPrefabEditContextViaAssetDbSerialize: saveCurrentPrefabEditContextViaAssetDbSerialize,
  closePrefab: closePrefab,
  closeSilent: closeSilent,
  inspectPrefabEditContextRecovery: inspectPrefabEditContextRecovery,
  recoverPrefabEditContext: recoverPrefabEditContext,
  saveCurrentBeforeNavigation: saveCurrentBeforeNavigation,
  openScene: openScene,
  openPrefab: openPrefab,
  getProjectInfo: getProjectInfo,
  refreshAssetDb: refreshAssetDb,
  assetExists: assetExists,
  assetExistsSync: assetExistsSync,
  urlToUuid: urlToUuid,
  urlToUuidSync: urlToUuidSync,
  urlToFspath: urlToFspath,
  getSelection: getSelection,
  setSelection: setSelection,
  querySceneDirtyState: querySceneDirtyState,
  setNodePropertyRecorded: setNodePropertyRecorded,
  queryNodeDump: queryNodeDump,
  getCocosEnginePaths: getCocosEnginePaths,
  writeCocosEnginePathsDocs: writeCocosEnginePathsDocs,
  searchCocosEngineApi: searchCocosEngineApi,
};
