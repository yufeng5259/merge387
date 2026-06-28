'use strict';

var MCP_SCENE_SCRIPT_VERSION = '2026-06-22-prefab-root-metadata-1';

// ============================================================================
// Cocos Creator 3.8 Scene Script
// Ported from 2.4 format to 3.8 exports.methods pattern
// ============================================================================

try {
  var path = require('path');
  if (typeof Editor !== 'undefined' && Editor.App && Editor.App.path) {
    var editorNodeModules = path.join(Editor.App.path, 'node_modules');
    if (module.paths.indexOf(editorNodeModules) === -1) module.paths.push(editorNodeModules);
  }
} catch (e) {}

var cc = (function () {
  var runtime = (typeof globalThis !== 'undefined' && globalThis.cc) ? globalThis.cc : null;
  try {
    var engine = require('cc');
    runtime = runtime || engine;
    Object.keys(engine).forEach(function (key) {
      if (key === 'loader' || key === 'AssetLibrary' || key === 'url') return;
      if (Object.prototype.hasOwnProperty.call(runtime, key)) return;
      runtime[key] = engine[key];
    });
  } catch (e) {}
  return runtime || {};
})();

function resolveComponentClass(componentName) {
  if (!componentName) return null;
  if (typeof componentName === 'function') return componentName;
  var name = String(componentName);
  var shortName = name.indexOf('cc.') === 0 ? name.substring(3) : name;
  if (cc[shortName]) return cc[shortName];
  if (shortName === 'Scrollbar' && cc.ScrollBar) return cc.ScrollBar;
  if (cc.js && cc.js.getClassByName) {
    return cc.js.getClassByName(name)
      || cc.js.getClassByName('cc.' + shortName)
      || cc.js.getClassByName(shortName)
      || (shortName === 'Scrollbar' ? (cc.js.getClassByName('cc.ScrollBar') || cc.js.getClassByName('ScrollBar')) : null);
  }
  return null;
}

function getComponent(node, componentName) {
  if (!node || !componentName) return null;
  var compClass = resolveComponentClass(componentName);
  try {
    return compClass ? node.getComponent(compClass) : node.getComponent(componentName);
  } catch (e) {
    try { return node.getComponent(String(componentName)); } catch (ignored) {}
  }
  return null;
}

function addComponent(node, componentName) {
  if (!node || !componentName) return null;
  var compClass = resolveComponentClass(componentName);
  if (!compClass) throw new Error('Component class not found: ' + componentName);
  if (!componentTypeAllowsMultiple(componentName)) {
    var existing = getComponent(node, componentName);
    if (existing) return existing;
  }
  return node.addComponent(compClass);
}

function componentTypeAllowsMultiple(componentName) {
  if (!componentName) return false;
  var text = String(componentName);
  var singletons = {
    UITransform: true,
    'cc.UITransform': true,
    Sprite: true,
    'cc.Sprite': true,
    Label: true,
    'cc.Label': true,
    Button: true,
    'cc.Button': true,
    Widget: true,
    'cc.Widget': true,
    Layout: true,
    'cc.Layout': true,
    ScrollView: true,
    'cc.ScrollView': true,
    Scrollbar: true,
    'cc.Scrollbar': true,
    ScrollBar: true,
    'cc.ScrollBar': true,
    Mask: true,
    'cc.Mask': true,
    ProgressBar: true,
    'cc.ProgressBar': true,
    RichText: true,
    'cc.RichText': true,
    BlockInputEvents: true,
    'cc.BlockInputEvents': true,
    UIOpacity: true,
    'cc.UIOpacity': true,
    Canvas: true,
    'cc.Canvas': true,
    Camera: true,
    'cc.Camera': true,
    'sp.Skeleton': true
  };
  return !singletons[text];
}

function getNodeArg(args) {
  args = args || {};
  return args.nodeId || args.id || args.node || args.nodePath || args.path || args.uuid;
}

function mergeProperties(args) {
  var out = {};
  args = args || {};
  Object.keys(args).forEach(function (key) { out[key] = args[key]; });
  if (args.properties) {
    Object.keys(args.properties).forEach(function (key) {
      if (out[key] == null) out[key] = args.properties[key];
    });
  }
  return out;
}

function vec2(value, defaultX, defaultY) {
  function num(v, fallback) {
    var n = Number(v);
    return isNaN(n) ? (fallback || 0) : n;
  }
  if (Array.isArray(value)) return [num(value[0], defaultX), num(value[1], defaultY)];
  if (value && typeof value === 'object') {
    return [
      num(value.x != null ? value.x : value.width, defaultX),
      num(value.y != null ? value.y : value.height, defaultY),
    ];
  }
  return [defaultX || 0, defaultY || 0];
}

function vec3(value, defaultX, defaultY, defaultZ) {
  function num(v, fallback) {
    var n = Number(v);
    return isNaN(n) ? (fallback || 0) : n;
  }
  if (Array.isArray(value)) return [num(value[0], defaultX), num(value[1], defaultY), num(value[2], defaultZ)];
  if (value && typeof value === 'object') {
    return [
      num(value.x, defaultX),
      num(value.y, defaultY),
      num(value.z, defaultZ),
    ];
  }
  return [defaultX || 0, defaultY || 0, defaultZ || 0];
}

function colorValue(value) {
  if (!value) return new cc.Color(255, 255, 255, 255);
  if (typeof value === 'string') return new cc.Color().fromHEX(value);
  if (Array.isArray(value)) return new cc.Color(value[0], value[1], value[2], value[3] != null ? value[3] : 255);
  return new cc.Color(value.r, value.g, value.b, value.a != null ? value.a : 255);
}

function syncButtonSpriteState(node) {
  var button = getComponent(node, 'cc.Button');
  if (!button) return;
  try { button.target = node; } catch (e) {}
  var sprite = getComponent(node, 'cc.Sprite');
  if (!sprite || !sprite.spriteFrame) return;
  try {
    button.normalSprite = sprite.spriteFrame;
    if (cc.Button && cc.Button.Transition && cc.Button.Transition.SPRITE != null) {
      button.transition = cc.Button.Transition.SPRITE;
    }
  } catch (e) {}
}

function refreshSpriteRenderState(nodeOrSprite) {
  var sprite = nodeOrSprite && nodeOrSprite.spriteFrame !== undefined
    ? nodeOrSprite
    : getComponent(nodeOrSprite, 'cc.Sprite');
  if (!sprite) return { refreshed: false, reason: 'sprite-not-found' };
  var actions = [];
  var before = {
    hasSpriteFrame: !!sprite.spriteFrame,
    spriteFrameName: sprite.spriteFrame && sprite.spriteFrame.name || null,
    customMaterial: materialInfo(sprite.customMaterial),
    sharedMaterial0: safeMaterialAt(sprite, 0),
    canRender: safeCanRender(sprite),
    instanceMaterialType: typeof sprite._instanceMaterialType === 'number' ? sprite._instanceMaterialType : null,
  };
  try {
    var currentFrame = sprite.spriteFrame || sprite._spriteFrame || null;
    if (currentFrame) {
      try {
        sprite._spriteFrame = null;
        sprite.spriteFrame = currentFrame;
        actions.push('spriteFrameSetterReapply');
      } catch (reapplyError) {
        try {
          if (typeof sprite._applySpriteFrame === 'function') {
            sprite._applySpriteFrame(null);
            actions.push('_applySpriteFrame');
          }
        } catch (applyFrameError) {}
      }
    }
  } catch (frameError) {}
  try {
    if (typeof sprite.changeMaterialForDefine === 'function') {
      sprite.changeMaterialForDefine();
      actions.push('changeMaterialForDefine');
    }
  } catch (defineError) {}
  try {
    if (typeof sprite.updateMaterial === 'function') {
      sprite.updateMaterial();
      actions.push('updateMaterial');
    }
  } catch (e) {}
  try {
    if (typeof sprite._updateBuiltinMaterial === 'function') {
      sprite._updateBuiltinMaterial();
      actions.push('_updateBuiltinMaterial');
    }
  } catch (e2) {}
  try {
    if (typeof sprite.markForUpdateRenderData === 'function') {
      sprite.markForUpdateRenderData();
      actions.push('markForUpdateRenderData');
    }
  } catch (e3) {}
  try {
    if (typeof sprite._markForUpdateRenderData === 'function') {
      sprite._markForUpdateRenderData();
      actions.push('_markForUpdateRenderData');
    }
  } catch (e4) {}
  try {
    if (typeof sprite.setVertsDirty === 'function') {
      sprite.setVertsDirty();
      actions.push('setVertsDirty');
    }
  } catch (e5) {}
  try {
    if (sprite.node && sprite.node._uiProps) {
      sprite.node._uiProps.colorDirty = true;
      actions.push('nodeUiPropsColorDirty');
    }
  } catch (e6) {}
  var after = {
    hasSpriteFrame: !!sprite.spriteFrame,
    spriteFrameName: sprite.spriteFrame && sprite.spriteFrame.name || null,
    customMaterial: materialInfo(sprite.customMaterial),
    sharedMaterial0: safeMaterialAt(sprite, 0),
    renderMaterial0: safeRenderMaterialAt(sprite, 0),
    canRender: safeCanRender(sprite),
    instanceMaterialType: typeof sprite._instanceMaterialType === 'number' ? sprite._instanceMaterialType : null,
  };
  return {
    refreshed: actions.length > 0,
    actions: actions,
    hasSpriteFrame: after.hasSpriteFrame,
    spriteFrameName: after.spriteFrameName,
    before: before,
    after: after,
  };
}

function materialInfo(material) {
  if (!material) return null;
  return {
    name: material.name || null,
    uuid: material._uuid || material.uuid || null,
    valid: material.isValid !== false,
  };
}

function safeMaterialAt(renderer, index) {
  try {
    if (renderer && typeof renderer.getSharedMaterial === 'function') return materialInfo(renderer.getSharedMaterial(index || 0));
  } catch (e) {}
  try {
    if (renderer && renderer.sharedMaterials && renderer.sharedMaterials.length > (index || 0)) return materialInfo(renderer.sharedMaterials[index || 0]);
  } catch (e2) {}
  try {
    if (renderer && renderer._materials && renderer._materials.length > (index || 0)) return materialInfo(renderer._materials[index || 0]);
  } catch (e3) {}
  return null;
}

function safeRenderMaterialAt(renderer, index) {
  try {
    if (renderer && typeof renderer.getRenderMaterial === 'function') return materialInfo(renderer.getRenderMaterial(index || 0));
  } catch (e) {}
  return null;
}

function safeCanRender(renderer) {
  try {
    if (renderer && typeof renderer._canRender === 'function') return !!renderer._canRender();
  } catch (e) {}
  return null;
}

function nodeColorInfo(node) {
  if (!node) return null;
  var color = null;
  try { color = node.color || null; } catch (e) {}
  if (!color) {
    try {
      var uiComp = node._uiProps && node._uiProps.uiComp || null;
      color = uiComp && (uiComp.color || uiComp._color) || null;
    } catch (e2) {}
  }
  return {
    r: color ? numberOrNull(color.r) : null,
    g: color ? numberOrNull(color.g) : null,
    b: color ? numberOrNull(color.b) : null,
    a: color ? numberOrNull(color.a) : null,
    opacity: node.opacity != null ? numberOrNull(node.opacity) : null,
  };
}

function renderDataInfo(renderData) {
  if (!renderData) return null;
  var chunk = null;
  var vb = null;
  var uvLike = 0;
  try { chunk = renderData.chunk || renderData._chunk || null; } catch (e) {}
  try { vb = chunk && (chunk.vb || chunk.vertexBuffer || chunk._vb) || renderData.vData || renderData._vData || null; } catch (e2) {}
  if (vb && typeof vb.length === 'number') {
    try {
      var limit = Math.min(vb.length, 256);
      for (var i = 0; i < limit; i++) {
        var n = Number(vb[i]);
        if (!isNaN(n) && n > 0 && n < 1) uvLike++;
      }
    } catch (e3) {}
  }
  return {
    valid: true,
    vertDirty: renderData.vertDirty != null ? !!renderData.vertDirty : null,
    textureDirty: renderData.textureDirty != null ? !!renderData.textureDirty : null,
    passDirty: renderData.passDirty != null ? !!renderData.passDirty : null,
    dataLength: renderData.dataLength != null ? numberOrNull(renderData.dataLength) : null,
    vertexCount: renderData.vertexCount != null ? numberOrNull(renderData.vertexCount) : null,
    indicesCount: renderData.indicesCount != null ? numberOrNull(renderData.indicesCount) : null,
    chunkVertexOffset: chunk && chunk.vertexOffset != null ? numberOrNull(chunk.vertexOffset) : null,
    chunkIndexOffset: chunk && chunk.indexOffset != null ? numberOrNull(chunk.indexOffset) : null,
    vertexBufferLength: vb && typeof vb.length === 'number' ? numberOrNull(vb.length) : null,
    uvLikeValueCountInHead: uvLike,
  };
}

function spriteRendererDiagnostics(sprite) {
  if (!sprite) return null;
  var assembler = null;
  var renderData = null;
  var renderEntity = null;
  try { assembler = sprite._assembler || null; } catch (e) {}
  try { renderData = sprite.renderData || sprite._renderData || null; } catch (e2) {}
  try { renderEntity = sprite.renderEntity || sprite._renderEntity || null; } catch (e3) {}
  return {
    assembler: assembler ? {
      name: assembler.name || assembler.constructor && assembler.constructor.name || null,
      hasCreateData: typeof assembler.createData === 'function',
      hasUpdateRenderData: typeof assembler.updateRenderData === 'function',
      hasUpdateUVs: typeof assembler.updateUVs === 'function',
      hasUpdateColor: typeof assembler.updateColor === 'function',
    } : null,
    renderData: renderDataInfo(renderData),
    renderFlag: sprite._renderFlag != null ? !!sprite._renderFlag : null,
    renderEntity: renderEntity ? {
      enabled: renderEntity.enabled != null ? !!renderEntity.enabled : null,
    } : null,
    dstBlendFactor: sprite._dstBlendFactor != null ? numberOrNull(sprite._dstBlendFactor) : null,
    srcBlendFactor: sprite._srcBlendFactor != null ? numberOrNull(sprite._srcBlendFactor) : null,
  };
}

function rectInfo(value) {
  if (!value) return null;
  return {
    x: numberOrNull(value.x),
    y: numberOrNull(value.y),
    width: numberOrNull(value.width),
    height: numberOrNull(value.height),
  };
}

function sizeInfo(value) {
  if (!value) return null;
  return {
    width: numberOrNull(value.width),
    height: numberOrNull(value.height),
  };
}

function vecInfo(value) {
  if (!value) return null;
  return {
    x: numberOrNull(value.x),
    y: numberOrNull(value.y),
  };
}

function numberOrNull(value) {
  var n = Number(value);
  return isNaN(n) ? null : n;
}

function arrayHead(value, limit) {
  if (!Array.isArray(value)) return null;
  return value.slice(0, limit || 12).map(function (item) {
    return typeof item === 'number' ? item : numberOrNull(item);
  });
}

function assetInfo(asset) {
  if (!asset) return null;
  var type = null;
  try { type = cc.js.getClassName(asset) || (asset.constructor && asset.constructor.name) || null; } catch (e) {}
  return {
    type: type,
    name: asset.name || null,
    uuid: asset.uuid || asset._uuid || null,
    valid: asset.isValid !== false,
  };
}

function textureInfo(texture) {
  if (!texture) return null;
  var out = assetInfo(texture) || {};
  out.width = numberOrNull(texture.width || texture._width);
  out.height = numberOrNull(texture.height || texture._height);
  out.nativeUrl = texture.nativeUrl || texture._nativeUrl || null;
  out.loaded = texture.loaded != null ? !!texture.loaded : null;
  out.isDefault = texture._isDefault != null ? !!texture._isDefault : null;
  return out;
}

function imageInfo(image) {
  if (!image) return null;
  var out = assetInfo(image) || {};
  out.width = numberOrNull(image.width || image._width);
  out.height = numberOrNull(image.height || image._height);
  out.nativeUrl = image.nativeUrl || image._nativeUrl || null;
  out.loaded = image.loaded != null ? !!image.loaded : null;
  var data = null;
  try { data = image.data || image._data || null; } catch (e) {}
  out.hasData = !!data;
  out.dataType = data && data.constructor && data.constructor.name || null;
  out.dataLength = data && data.length != null ? numberOrNull(data.length) : null;
  return out;
}

function sampleImagePixelData(image, rect, options) {
  options = options || {};
  if (!image) return { ok: false, reason: 'image missing' };
  var width = Number(image.width || image._width || 0);
  var height = Number(image.height || image._height || 0);
  if (!(width > 0 && height > 0)) return { ok: false, reason: 'image size unavailable', width: width, height: height };
  var data = null;
  try { data = image.data || image._data || null; } catch (e) {}
  if (!data || data.length == null) return { ok: false, reason: 'image pixel data unavailable', width: width, height: height };
  var channels = Math.floor(Number(data.length) / Math.max(1, width * height));
  if (channels !== 4 && channels !== 3) return { ok: false, reason: 'unsupported image data channel count', width: width, height: height, dataLength: Number(data.length), channels: channels };
  var rx = Math.max(0, Math.floor(rect && rect.x != null ? rect.x : 0));
  var ry = Math.max(0, Math.floor(rect && rect.y != null ? rect.y : 0));
  var rw = Math.max(1, Math.floor(rect && rect.width != null ? rect.width : width));
  var rh = Math.max(1, Math.floor(rect && rect.height != null ? rect.height : height));
  var maxSamples = Math.max(4, Number(options.maxSamples || 64));
  var step = Math.max(1, Math.floor(Math.sqrt((rw * rh) / maxSamples)));
  var colors = {};
  var samples = [];
  var sampleCount = 0;
  var visibleCount = 0;
  var nearBlackCount = 0;
  var nearWhiteCount = 0;
  for (var y = ry; y < Math.min(height, ry + rh); y += step) {
    for (var x = rx; x < Math.min(width, rx + rw); x += step) {
      var index = (y * width + x) * channels;
      var r = Number(data[index] || 0);
      var g = Number(data[index + 1] || 0);
      var b = Number(data[index + 2] || 0);
      var a = channels === 4 ? Number(data[index + 3] == null ? 255 : data[index + 3]) : 255;
      var key = r + ',' + g + ',' + b + ',' + a;
      colors[key] = (colors[key] || 0) + 1;
      if (samples.length < 12) samples.push({ x: x, y: y, rgba: [r, g, b, a] });
      sampleCount++;
      if (a > 8) visibleCount++;
      if (r <= 12 && g <= 12 && b <= 12 && a > 8) nearBlackCount++;
      if (r >= 243 && g >= 243 && b >= 243 && a > 8) nearWhiteCount++;
    }
  }
  var unique = Object.keys(colors);
  return {
    ok: true,
    width: width,
    height: height,
    dataLength: Number(data.length),
    channels: channels,
    rect: { x: rx, y: ry, width: rw, height: rh },
    sampleStep: step,
    sampleCount: sampleCount,
    visibleSamples: visibleCount,
    uniqueSampleColors: unique.length,
    nearBlackRatio: visibleCount ? nearBlackCount / visibleCount : 0,
    nearWhiteRatio: visibleCount ? nearWhiteCount / visibleCount : 0,
    dominantColors: unique.sort(function (a, b) { return colors[b] - colors[a]; }).slice(0, 8).map(function (key) { return { rgba: key, count: colors[key] }; }),
    samples: samples,
  };
}

function spriteFrameRuntimeInfo(spriteFrame) {
  if (!spriteFrame) return null;
  var texture = null;
  var image = null;
  var vertices = null;
  var uv = null;
  var uvSliced = null;
  try { texture = spriteFrame.texture || spriteFrame._texture || null; } catch (e) {}
  try { image = texture && (texture.image || texture._image || texture._mipmaps && texture._mipmaps[0]) || null; } catch (e2) {}
  try { vertices = spriteFrame.vertices || spriteFrame._vertices || null; } catch (e3) {}
  try { uv = spriteFrame.uv || spriteFrame._uv || null; } catch (e4) {}
  try { uvSliced = spriteFrame.uvSliced || spriteFrame._uvSliced || null; } catch (e5) {}
  return {
    asset: assetInfo(spriteFrame),
    rect: rectInfo(spriteFrame.rect || spriteFrame._rect),
    originalSize: sizeInfo(spriteFrame.originalSize || spriteFrame._originalSize),
    offset: vecInfo(spriteFrame.offset || spriteFrame._offset),
    rotated: !!(spriteFrame.rotated || spriteFrame._rotated),
    packable: spriteFrame.packable != null ? !!spriteFrame.packable : null,
    pixelsToUnit: numberOrNull(spriteFrame.pixelsToUnit || spriteFrame._pixelsToUnit),
    pivot: vecInfo(spriteFrame.pivot || spriteFrame._pivot),
    texture: textureInfo(texture),
    image: imageInfo(image),
    imagePixelSample: sampleImagePixelData(image, spriteFrame.rect || spriteFrame._rect, { maxSamples: 96 }),
    uvLength: Array.isArray(uv) ? uv.length : null,
    uvHead: arrayHead(uv, 16),
    uvSlicedLength: Array.isArray(uvSliced) ? uvSliced.length : null,
    uvSlicedHead: arrayHead(uvSliced, 16),
    vertices: vertices ? {
      rawPositionLength: Array.isArray(vertices.rawPosition) ? vertices.rawPosition.length : null,
      indexesLength: Array.isArray(vertices.indexes) ? vertices.indexes.length : null,
      uvLength: Array.isArray(vertices.uv) ? vertices.uv.length : null,
      nuvLength: Array.isArray(vertices.nuv) ? vertices.nuv.length : null,
      rawPositionHead: arrayHead(vertices.rawPosition, 12),
      indexesHead: arrayHead(vertices.indexes, 12),
      uvHead: arrayHead(vertices.uv, 12),
      nuvHead: arrayHead(vertices.nuv, 12),
      minPos: vertices.minPos || null,
      maxPos: vertices.maxPos || null,
    } : null,
  };
}

// ---------------------------------------------------------------------------
// Utility: find a node by UUID by traversing the scene graph
// In 3.8, cc.engine.getInstanceById is not available.
// ---------------------------------------------------------------------------
function findNodeByUuid(root, uuid) {
  if (!root || !uuid) return null;
  if (root.uuid === uuid) return root;
  var children = root.children || [];
  for (var i = 0; i < children.length; i++) {
    var found = findNodeByUuid(children[i], uuid);
    if (found) return found;
  }
  return null;
}

function findNode(id) {
  if (!id) return null;
  var scene = cc.director.getScene();
  if (!scene) return null;
  // Try direct UUID match via scene graph traversal
  var node = findNodeByUuid(scene, id);
  if (node) return node;
  // Try cc.find as a path-based fallback
  try {
    var found = cc.find(id);
    if (found) return found;
  } catch (e) {}
  return null;
}

function findNodeByPath(pathOrId) {
  if (!pathOrId) return null;
  if (typeof pathOrId === 'string' && /^__mcp_missing_/.test(pathOrId)) return null;
  // Try UUID-based lookup first
  var direct = findNode(pathOrId);
  if (direct) return direct;
  var scene = cc.director.getScene();
  if (!scene) return null;
  var p = String(pathOrId).replace(/^\/+|\/+$/g, '');
  if (!p) return scene;
  var parts = p.split('/').filter(function (s) { return !!s; });
  var current = scene;
  // If the first part matches the scene name, skip it
  if (parts.length && current.name === parts[0]) parts.shift();
  for (var i = 0; i < parts.length; i++) {
    var next = null;
    var children = current.children || [];
    for (var ci = 0; ci < children.length; ci++) {
      if (children[ci].name === parts[i]) { next = children[ci]; break; }
    }
    if (!next) return null;
    current = next;
  }
  return current;
}

function findNodeRelative(root, relativePath) {
  if (!root) return null;
  var p = String(relativePath || '').replace(/^\/+|\/+$/g, '');
  if (!p || p === '.' || p === root.name) return root;
  var parts = p.split('/').filter(function (s) { return !!s && s !== '.'; });
  var current = root;
  if (parts.length && parts[0] === root.name) parts.shift();
  for (var i = 0; i < parts.length; i++) {
    var next = null;
    var kids = current.children || [];
    for (var k = 0; k < kids.length; k++) {
      if (kids[k].name === parts[i]) { next = kids[k]; break; }
    }
    if (!next) return null;
    current = next;
  }
  return current;
}

function normalizeAnimationTracks(args) {
  var input = args.tracks || args.keyframes || args.curves || [];
  if (!Array.isArray(input)) throw new Error('tracks/keyframes must be an array');
  return input.map(function (item, index) {
    item = item || {};
    var keys = item.keys || item.keyframes || item.frames || item.values || [];
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('Animation track #' + index + ' has no keys');
    }
    return {
      targetPath: String(item.targetPath || item.nodePath || item.path || item.node || ''),
      property: String(item.property || item.prop || 'position'),
      keys: keys.map(function (key, keyIndex) {
        key = key || {};
        var time = key.time != null ? key.time : (key.frame != null ? Number(key.frame) / Number(args.sample || 30) : null);
        if (time == null || isNaN(Number(time))) throw new Error('Animation track #' + index + ' key #' + keyIndex + ' has no valid time');
        return { time: Number(time), value: key.value != null ? key.value : key };
      })
    };
  });
}

function animationValueComponents(value, count) {
  if (Array.isArray(value)) return value.slice(0, count).map(Number);
  if (value && typeof value === 'object') {
    if (count === 1) return [Number(value.value != null ? value.value : (value.x != null ? value.x : (value.y != null ? value.y : value.angle)))];
    return [
      Number(value.x != null ? value.x : value[0] || 0),
      Number(value.y != null ? value.y : value[1] || 0),
      Number(value.z != null ? value.z : value[2] || 0)
    ].slice(0, count);
  }
  return [Number(value)];
}

function animationPropertyInfo(property) {
  var p = String(property || '').replace(/^node\./, '');
  if (p === 'position' || p === 'scale' || p === 'eulerAngles') return { kind: 'vector', components: 3, property: p };
  if (p === 'rotation') return { kind: 'vector', components: 3, property: 'eulerAngles' };
  if (p === 'angle' || p === 'opacity') return { kind: 'real', components: 1, property: p };
  throw new Error('Unsupported animation property: ' + property);
}

function assignAnimationCurve(curve, points) {
  if (!curve) throw new Error('Animation curve channel is unavailable');
  if (typeof curve.assignSorted === 'function') {
    curve.assignSorted(points);
    return;
  }
  if (typeof curve.assignSortedKeyFrames === 'function') {
    curve.assignSortedKeyFrames(points);
    return;
  }
  if (curve._times != null && curve._values != null) {
    curve._times = points.map(function (p) { return p[0]; });
    curve._values = points.map(function (p) { return p[1]; });
    return;
  }
  throw new Error('Unsupported animation curve API in this Cocos version');
}

function getAnimationTrackCount(clip) {
  var tracks = clip && (clip._tracks || clip.tracks);
  return Array.isArray(tracks) ? tracks.length : 0;
}

function getAnimationKeyframeCount(clip) {
  var tracks = clip && (clip._tracks || clip.tracks) || [];
  var count = 0;
  for (var i = 0; i < tracks.length; i++) {
    var channels = typeof tracks[i].channels === 'function' ? tracks[i].channels() : (tracks[i]._channels || []);
    for (var c = 0; c < channels.length; c++) {
      var curve = channels[c] && channels[c].curve;
      var times = curve && (curve._times || curve.times);
      if (Array.isArray(times)) count += times.length;
    }
  }
  return count;
}

function serializeRuntimeAsset(asset) {
  var serializers = [];
  if (typeof EditorExtends !== 'undefined' && EditorExtends.serialize) serializers.push(EditorExtends.serialize);
  if (typeof cce !== 'undefined' && cce.Utils && cce.Utils.serialize) serializers.push(cce.Utils.serialize);
  for (var i = 0; i < serializers.length; i++) {
    try {
      var out = serializers[i](asset);
      if (typeof out === 'string' && out.trim()) return out;
      if (out && typeof out === 'object') return JSON.stringify(out, null, 2);
    } catch (e) {}
  }
  return null;
}

function getSerializableTypeName(value) {
  if (!value) return null;
  try {
    if (cc && cc.js && cc.js.getClassName) return cc.js.getClassName(value) || null;
  } catch (e) {}
  return value.constructor && value.constructor.name || typeof value;
}

function makePrefabAssetFromRootNode(rootNode, prefabUuid) {
  if (!rootNode) throw new Error('Prefab root node is required');
  var PrefabClass = cc.Prefab || (cc.js && cc.js.getClassByName && (cc.js.getClassByName('cc.Prefab') || cc.js.getClassByName('Prefab')));
  if (!PrefabClass) throw new Error('cc.Prefab class is not available in scene process');
  var prefab = new PrefabClass();
  if (typeof prefab.initDefault === 'function' && prefabUuid) {
    try { prefab.initDefault(prefabUuid); } catch (e) {}
  }
  prefab.data = rootNode;
  if (prefabUuid) {
    try { prefab._uuid = prefabUuid; } catch (e2) {}
    try { prefab.uuid = prefabUuid; } catch (e3) {}
  }
  var PrefabInfoClass = cc._PrefabInfo || (cc.js && cc.js.getClassByName && cc.js.getClassByName('cc.PrefabInfo'));
  if (PrefabInfoClass) {
    var prefabInfo = rootNode._prefab || rootNode.prefab || null;
    if (!prefabInfo) {
      try { prefabInfo = new PrefabInfoClass(); } catch (infoError) { prefabInfo = null; }
    }
    if (prefabInfo) {
      prefabInfo.asset = prefab;
      prefabInfo.root = rootNode;
      if (!prefabInfo.fileId && rootNode.uuid) prefabInfo.fileId = rootNode.uuid;
      try { rootNode._prefab = prefabInfo; } catch (assignError) {}
    }
  }
  return prefab;
}

function assignAssetUuid(asset, uuid) {
  if (!asset || !uuid) return;
  try { asset._uuid = uuid; } catch (e1) {}
  try { asset.uuid = uuid; } catch (e2) {}
}

function getNodePrefabLink(node) {
  var prefabInfo = node && (node._prefab || node.prefab) || null;
  if (!prefabInfo) return null;
  var asset = prefabInfo.asset || null;
  var instance = prefabInfo.instance || null;
  var assetUuid = asset && (asset._uuid || asset.uuid) || null;
  return {
    rootUuid: prefabInfo.root && prefabInfo.root.uuid || node.uuid || null,
    uuid: assetUuid,
    assetUuid: assetUuid,
    fileId: prefabInfo.fileId || null,
    hasInstance: !!instance,
    prefabStateInfo: instance ? {
      rootUuid: prefabInfo.root && prefabInfo.root.uuid || node.uuid || null,
      assetUuid: assetUuid,
    } : null,
  };
}

function makePrefabAssetWithEditorPrefabUtils(rootNode, prefabUuid) {
  if (!rootNode) return null;
  var PrefabUtils = null;
  if (typeof EditorExtends !== 'undefined' && EditorExtends.PrefabUtils) PrefabUtils = EditorExtends.PrefabUtils;
  if (!PrefabUtils && typeof Editor !== 'undefined' && Editor.require) PrefabUtils = Editor.require('scene://utils/prefab');
  if (!PrefabUtils || typeof PrefabUtils.createPrefabFrom !== 'function' || typeof PrefabUtils.createAppliedPrefab !== 'function') return null;
  PrefabUtils.createPrefabFrom(rootNode);
  var prefabInfo = rootNode._prefab || rootNode.prefab || null;
  if (prefabInfo && prefabInfo.asset) assignAssetUuid(prefabInfo.asset, prefabUuid);
  if (typeof PrefabUtils.setPrefabSync === 'function') {
    try { PrefabUtils.setPrefabSync(rootNode, true); } catch (syncError) {}
  }
  var applied = PrefabUtils.createAppliedPrefab(rootNode);
  assignAssetUuid(applied, prefabUuid);
  return applied;
}

function getComponentByName(node, componentName) {
  if (!node || !componentName) return null;
  var byClass = getComponent(node, componentName);
  if (byClass) return byClass;
  var comps = node.components || [];
  var customComps = [];
  for (var i = 0; i < comps.length; i++) {
    var comp = comps[i];
    var className = cc.js.getClassName(comp) || comp.constructor.name || '';
    var shortName = className.split('.').pop();
    if (className === componentName || shortName === componentName || comp.name === componentName) return comp;
    if (className && className.indexOf('cc.') !== 0) customComps.push(comp);
  }
  if (customComps.length === 1) return customComps[0];
  return null;
}

function markNodeChanged(node) {
  if (!node) return;
  try {
    if (cc && cc.director && cc.director.getScene()) {
      cc.director.getScene().emit && cc.director.getScene().emit('change');
    }
  } catch (e) {}
  try {
    if (Editor && Editor.Message) {
      Editor.Message.send && Editor.Message.send('scene', 'node-change', node.uuid);
    }
  } catch (e2) {}
}

function setNodeName(node, name) {
  if (!node || name == null) return;
  var nextName = String(name);
  node.name = nextName;
  try { node._name = nextName; } catch (e) {}
  markNodeChanged(node);
}

function findComponentWithProperty(node, propertyName) {
  if (!node || !propertyName) return null;
  var comps = node.components || [];
  for (var i = 0; i < comps.length; i++) {
    try {
      if (propertyName in comps[i]) return comps[i];
    } catch (e) {}
  }
  return null;
}

function resolveReferenceValue(args) {
  args = args || {};
  if (args.clear) return Promise.resolve(null);
  var kind = args.valueKind || 'node';
  if (kind === 'node' || kind === 'component') {
    var targetNode = findNodeByPath(args.targetNodeId || args.targetPath);
    if (!targetNode) throw new Error('Target node not found: ' + (args.targetNodeId || args.targetPath));
    if (kind === 'node') return Promise.resolve(targetNode);
    var compType = args.valueType || args.targetComponent || args.componentValueType;
    var comp = getComponentByName(targetNode, compType);
    if (!comp) throw new Error('Target component not found: ' + compType);
    return Promise.resolve(comp);
  }
  if (kind === 'asset') {
    var assetUuid = args.assetUuid || args.uuid;
    if (!assetUuid) throw new Error('assetUuid is required');
    return new Promise(function (resolve, reject) {
      cc.assetManager.loadAny({ uuid: assetUuid }, function (err, asset) {
        if (err) {
          reject(new Error('Failed to load asset: ' + err.message));
          return;
        }
        resolve(asset);
      });
    });
  }
  throw new Error('Unsupported reference binding kind: ' + kind);
}

function resolveReferenceValueSync(args) {
  args = args || {};
  if (args.clear) return null;
  var kind = args.valueKind || 'node';
  if (kind === 'node' || kind === 'component') {
    var targetNode = findNodeByPath(args.targetNodeId || args.targetPath);
    if (!targetNode) throw new Error('Target node not found: ' + (args.targetNodeId || args.targetPath));
    if (kind === 'node') return targetNode;
    var compType = args.valueType || args.targetComponent || args.componentValueType;
    var comp = getComponentByName(targetNode, compType);
    if (!comp) throw new Error('Target component not found: ' + compType);
    return comp;
  }
  if (kind === 'asset') {
    var assetUuid = args.assetUuid || args.uuid;
    if (!assetUuid) throw new Error('assetUuid is required');
    var asset = null;
    try {
      if (cc.assetManager && cc.assetManager.assets) {
        asset = cc.assetManager.assets.get(assetUuid) || null;
      }
    } catch (e) {}
    if (!asset) {
      throw new Error('Asset is not loaded in scene context: ' + assetUuid + '. Load or reference the asset before binding.');
    }
    return asset;
  }
  throw new Error('Unsupported reference binding kind: ' + kind);
}

function describeBoundValue(value) {
  var assigned = null;
  if (value && value.uuid) assigned = value.uuid;
  else if (value && value.node && value.node.uuid) assigned = value.node.uuid;
  var assetValid = true;
  try {
    if (value && value.isValid === false) assetValid = false;
  } catch (e) {}
  return {
    assigned: assigned ? String(assigned) : null,
    assignedType: value ? String(cc.js.getClassName(value) || value.constructor && value.constructor.name || typeof value) : null,
    assignedName: value && value.name ? String(value.name) : null,
    assignedNode: value && value.node ? { uuid: String(value.node.uuid || ''), name: String(value.node.name || '') } : null,
    assetValid: assetValid,
    cleared: value == null,
  };
}

// ---------------------------------------------------------------------------
// Utility: safely get numeric value with fixed decimals
// ---------------------------------------------------------------------------
function toFixed3(v) {
  return v != null && typeof v.toFixed === 'function' ? Number(v.toFixed(3)) : Number(v) || 0;
}

// ---------------------------------------------------------------------------
// Utility: read node opacity via UIOpacity component (3.8 pattern)
// ---------------------------------------------------------------------------
function getNodeOpacity(node) {
  var uiOpacity = getComponent(node, 'cc.UIOpacity');
  return uiOpacity ? uiOpacity.opacity : 255;
}

function setNodeOpacity(node, val) {
  var uiOpacity = getComponent(node, 'cc.UIOpacity');
  if (!uiOpacity) {
    uiOpacity = addComponent(node, 'cc.UIOpacity');
  }
  uiOpacity.opacity = val;
}

function normalizeComponentPropertyName(componentName, propertyName) {
  var comp = String(componentName || '');
  var prop = String(propertyName || '');
  if (comp === 'cc.Sprite' || comp === 'Sprite') {
    if (prop === 'atlas' || prop === '_atlas') return 'spriteAtlas';
    if (prop === 'frame' || prop === '_spriteFrame') return 'spriteFrame';
  }
  return prop;
}

// ---------------------------------------------------------------------------
// Utility: recursively normalize instantiated/created UI nodes to a render
// layer. Cocos prefab children can retain edit-time layers that differ from the
// runtime parent/mount; for UI authoring commands the least surprising default
// is to inherit the parent layer unless an explicit layer is provided.
// ---------------------------------------------------------------------------
function syncNodeLayerDeep(node, layer) {
  if (!node || layer == null) return;
  node.layer = Number(layer);
  var children = node.children || [];
  for (var i = 0; i < children.length; i++) {
    syncNodeLayerDeep(children[i], layer);
  }
}

// ---------------------------------------------------------------------------
// Utility: read node color 鈥?prefer Sprite component color, fallback null
// ---------------------------------------------------------------------------
function getNodeColor(node) {
  var sprite = getComponent(node, 'cc.Sprite');
  if (sprite) {
    var c = sprite.color;
    return [c.r, c.g, c.b, c.a];
  }
  var label = getComponent(node, 'cc.Label');
  if (label) {
    var lc = label.color;
    return [lc.r, lc.g, lc.b, lc.a];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Utility: read UITransform size and anchor
// ---------------------------------------------------------------------------
function getUITransform(node) {
  return getComponent(node, 'cc.UITransform');
}

function getNodeSize(node) {
  var ut = getUITransform(node);
  if (ut) {
    var cs = ut.contentSize;
    return [cs.width, cs.height];
  }
  return [0, 0];
}

function getNodeAnchor(node) {
  var ut = getUITransform(node);
  if (ut) {
    var ap = ut.anchorPoint;
    return [ap.x, ap.y];
  }
  return [0.5, 0.5];
}

function getNodePath(node) {
  if (!node) return '';
  var names = [];
  var current = node;
  while (current) {
    names.push(String(current.name || ''));
    current = current.parent || null;
  }
  return names.reverse().join('/');
}

function getWorldBoundsInfo(node) {
  var uiTransform = getUITransform(node);
  if (!uiTransform || typeof uiTransform.getBoundingBoxToWorld !== 'function') return null;
  try {
    var rect = uiTransform.getBoundingBoxToWorld();
    return {
      x: numberOrNull(rect.x),
      y: numberOrNull(rect.y),
      width: numberOrNull(rect.width),
      height: numberOrNull(rect.height),
    };
  } catch (e) {}
  return null;
}

function visibleSpriteSnapshot(node, sprite, options) {
  options = options || {};
  var uiTransform = getUITransform(node);
  var spriteFrame = null;
  var spriteAtlas = null;
  try { spriteFrame = sprite.spriteFrame || sprite._spriteFrame || null; } catch (e) {}
  try { spriteAtlas = sprite.spriteAtlas || sprite._atlas || null; } catch (e2) {}
  return {
    nodeId: String(node.uuid || ''),
    nodeName: String(node.name || ''),
    nodePath: getNodePath(node),
    active: !!node.active,
    activeInHierarchy: !!node.activeInHierarchy,
    siblingIndex: typeof node.getSiblingIndex === 'function' ? node.getSiblingIndex() : null,
    opacity: getNodeOpacity(node),
    color: nodeColorInfo(node),
    size: getNodeSize(node),
    anchor: getNodeAnchor(node),
    worldBounds: getWorldBoundsInfo(node),
    layer: node.layer != null ? node.layer : null,
    sprite: {
      enabled: sprite.enabled !== false,
      type: sprite.type != null ? sprite.type : null,
      sizeMode: sprite.sizeMode != null ? sprite.sizeMode : null,
      trim: sprite.trim != null ? !!sprite.trim : null,
      grayscale: sprite.grayscale != null ? !!sprite.grayscale : null,
      fillType: sprite.fillType != null ? sprite.fillType : null,
      fillCenter: sprite.fillCenter ? { x: numberOrNull(sprite.fillCenter.x), y: numberOrNull(sprite.fillCenter.y) } : null,
      fillStart: sprite.fillStart != null ? numberOrNull(sprite.fillStart) : null,
      fillRange: sprite.fillRange != null ? numberOrNull(sprite.fillRange) : null,
    },
    spriteFrame: spriteFrameRuntimeInfo(spriteFrame),
    atlas: assetInfo(spriteAtlas),
    uiTransform: uiTransform ? {
      width: numberOrNull(uiTransform.width),
      height: numberOrNull(uiTransform.height),
      anchorX: numberOrNull(uiTransform.anchorX),
      anchorY: numberOrNull(uiTransform.anchorY),
    } : null,
    sharedMaterial0: safeMaterialAt(sprite, 0),
    renderMaterial0: safeRenderMaterialAt(sprite, 0),
    renderer: spriteRendererDiagnostics(sprite),
    canRender: safeCanRender(sprite),
    visibleCandidate: !!node.activeInHierarchy && sprite.enabled !== false && getNodeOpacity(node) > 0 && !!spriteFrame,
  };
}

function collectSpriteSnapshots(root, options) {
  options = options || {};
  var includeInactive = options.includeInactive === true;
  var maxDepth = Number(options.maxDepth);
  if (isNaN(maxDepth)) maxDepth = -1;
  var out = [];
  (function walk(node, depth) {
    if (!node) return;
    if (maxDepth >= 0 && depth > maxDepth) return;
    var sprite = getComponent(node, 'cc.Sprite');
    if (sprite && (includeInactive || node.activeInHierarchy)) {
      out.push(visibleSpriteSnapshot(node, sprite, options));
    }
    var children = node.children || [];
    for (var i = 0; i < children.length; i++) walk(children[i], depth + 1);
  })(root, 0);
  out.sort(function (a, b) {
    var ai = a && a.siblingIndex != null ? a.siblingIndex : 0;
    var bi = b && b.siblingIndex != null ? b.siblingIndex : 0;
    return ai - bi;
  });
  return out;
}

// ---------------------------------------------------------------------------
// Serialize a node's state for transport
// ---------------------------------------------------------------------------
function getAssetUuid(asset) {
  if (!asset) return null;
  return asset._uuid || asset.uuid || asset.nativeUrl || null;
}

function serializeNodeState(node, includeComponents, includeChildren) {
  var data = { exists: !!node };
  if (!node) return data;
  var pos = node.getPosition();
  var scl = node.getScale();
  var size = getNodeSize(node);
  var anchor = getNodeAnchor(node);

  data.uuid = node.uuid;
  data.name = node.name;
  data.active = node.active;
  data.layer = node.layer != null ? node.layer : null;
  data.position = [toFixed3(pos.x), toFixed3(pos.y)];
  data.position3 = [toFixed3(pos.x), toFixed3(pos.y), toFixed3(pos.z)];
  data.size = size;
  data.anchor = anchor;
  data.scale = [toFixed3(scl.x), toFixed3(scl.y)];
  data.scale3 = [toFixed3(scl.x), toFixed3(scl.y), toFixed3(scl.z)];
  data.rotation = toFixed3(node.angle || 0);
  data.angle = data.rotation;
  data.opacity = getNodeOpacity(node);
  data.color = getNodeColor(node);
  data.childrenCount = node.children.length;
  data.parent = node.parent ? { uuid: node.parent.uuid, name: node.parent.name } : null;
  data.siblingIndex = typeof node.getSiblingIndex === 'function' ? node.getSiblingIndex() : 0;
  data.prefabLink = getNodePrefabLink(node);

  // Label text
  var label = getComponent(node, 'cc.Label');
  if (label) {
    data.labelText = label.string;
    data.fontSize = label.fontSize;
    data.lineHeight = label.lineHeight;
    data.fontUuid = getAssetUuid(label.font);
    data.fontName = label.font ? (label.font.name || null) : null;
  }
  // Button
  var button = getComponent(node, 'cc.Button');
  if (button) {
    data.hasButton = true;
    data.buttonInteractable = button.interactable;
    data.clickEvents = (button.clickEvents || []).map(function (eventHandler) {
      var target = null;
      try {
        if (eventHandler && eventHandler.target) {
          target = {
            uuid: String(eventHandler.target.uuid || ''),
            name: String(eventHandler.target.name || ''),
          };
        }
      } catch (e) {}
      return {
        target: target,
        component: String((eventHandler && eventHandler.component) || ''),
        handler: String((eventHandler && eventHandler.handler) || ''),
        customEventData: String((eventHandler && eventHandler.customEventData) || ''),
      };
    });
  }
  // Sprite
  var sprite = getComponent(node, 'cc.Sprite');
  if (sprite) {
    var spriteAtlas = null;
    try { spriteAtlas = sprite.spriteAtlas || sprite._atlas || null; } catch (spriteAtlasError) {}
    data.hasSprite = true;
    data.spriteFrame = sprite.spriteFrame ? sprite.spriteFrame.name : null;
    data.spriteFrameUuid = getAssetUuid(sprite.spriteFrame);
    data.atlasUuid = getAssetUuid(spriteAtlas);
    data.atlasName = spriteAtlas ? (spriteAtlas.name || null) : null;
  }
  var audioSource = getComponent(node, 'cc.AudioSource');
  if (audioSource) {
    data.hasAudioSource = true;
    data.audioClipUuid = getAssetUuid(audioSource.clip);
    data.audioClipName = audioSource.clip ? (audioSource.clip.name || null) : null;
    data.audioSourcePlaying = !!audioSource.playing;
  }
  var layout = getComponent(node, 'cc.Layout');
  if (layout) {
    data.hasLayout = true;
    data.layout = {
      spacingX: layout.spacingX || 0,
      spacingY: layout.spacingY || 0,
      paddingLeft: layout.paddingLeft || 0,
      paddingRight: layout.paddingRight || 0,
      paddingTop: layout.paddingTop || 0,
      paddingBottom: layout.paddingBottom || 0
    };
    if (layout.cellSize) data.layout.cellSize = [layout.cellSize.width || 0, layout.cellSize.height || 0];
  }

  if (includeComponents) {
    data.components = (node.components || []).map(function (c) {
      return {
        type: cc.js.getClassName(c) || c.constructor.name || 'Unknown',
        uuid: c.uuid,
        enabled: c.enabled
      };
    });
  }
  if (includeChildren) {
    data.children = [];
    var kids = node.children || [];
    for (var i = 0; i < kids.length; i++) {
      data.children.push(serializeNodeState(kids[i], includeComponents, true));
    }
  }
  return data;
}

// ---------------------------------------------------------------------------
// Recursively collect nodes matching criteria
// ---------------------------------------------------------------------------
function collectNodes(root, result, depth, maxDepth) {
  if (!root) return;
  if (maxDepth >= 0 && depth > maxDepth) return;
  result.push({ node: root, depth: depth });
  var children = root.children || [];
  for (var i = 0; i < children.length; i++) {
    collectNodes(children[i], result, depth + 1, maxDepth);
  }
}

// ---------------------------------------------------------------------------
// applyProperties: auto-resolve UUID values to loaded assets (port from 2.4)
// ---------------------------------------------------------------------------
function loadAssetByUuid(uuid) {
  return new Promise(function (resolve, reject) {
    cc.assetManager.loadAny({ uuid: uuid }, function (err, asset) {
      if (err) {
        reject(new Error('Failed to load asset: ' + (err.message || err)));
        return;
      }
      resolve(asset || null);
    });
  });
}

function skeletonAnimationNames(component) {
  var data = component && (component.skeletonData || component._skeletonData || component._N$skeletonData);
  var names = [];
  try {
    var skeletonJson = data && (data.skeletonJson || data._skeletonJson);
    var animations = skeletonJson && skeletonJson.animations;
    if (animations) names = Object.keys(animations);
  } catch (e) {}
  return names;
}

function waitForNextFrame() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0);
  });
}

async function waitForSkeletonAnimations(component) {
  if (!component || String(cc.js.getClassName(component) || '').indexOf('Skeleton') === -1) return [];
  var names = skeletonAnimationNames(component);
  if (names.length) return names;
  for (var i = 0; i < 5; i++) {
    await waitForNextFrame();
    names = skeletonAnimationNames(component);
    if (names.length) return names;
  }
  return names;
}

async function applyProperties(node, component, props) {
  if (!props) return;
  var keys = Object.keys(props);
  var deferredSkeletonAnimation = {};

  for (var ki = 0; ki < keys.length; ki++) {
    var key = keys[ki];
    var value = props[key];

    if (key === 'node' || key === 'uuid' || key === '_id') continue;

    // Event handler arrays (clickEvents, etc.)
    var isEventProp = Array.isArray(value) &&
      (key.toLowerCase().endsWith('events') || key === 'clickEvents');

    if (isEventProp) {
      var eventHandlers = [];
      for (var ei = 0; ei < value.length; ei++) {
        var item = value[ei];
        if (typeof item === 'object' && (item.target || item.component || item.handler)) {
          var handler = new cc.Component.EventHandler();
          if (item.target) {
            var targetNode = findNode(item.target);
            if (targetNode) handler.target = targetNode;
          }
          if (item.component) handler.component = item.component;
          if (item.handler) handler.handler = item.handler;
          if (item.customEventData !== undefined) handler.customEventData = String(item.customEventData);
          eventHandlers.push(handler);
        } else {
          eventHandlers.push(item);
        }
      }
      component[key] = eventHandlers;
      continue;
    }

    // Detect if value looks like a UUID (long hex string with optional @suffix)
    var isUuidValue = typeof value === 'string' && value.length > 20 && /^[0-9a-f-]+(@[0-9a-f]+)?$/i.test(value);

    if (isUuidValue) {
      try {
        var SpriteFrame = cc.SpriteFrame;
        var needsSpriteFrame = key.toLowerCase().includes('sprite') || key.toLowerCase().includes('frame');
        var asset = await loadAssetByUuid(value);
        if (asset) {
          if (asset instanceof cc.Texture2D && needsSpriteFrame && SpriteFrame) {
            var sf = new SpriteFrame();
            sf.texture = asset;
            component[key] = sf;
          } else {
            component[key] = asset;
          }
        }
      } catch (e) {
        component[key] = value;
      }
      continue;
    }

    if ((key === 'defaultAnimation' || key === 'animation') && component && String(cc.js.getClassName(component) || '').indexOf('Skeleton') !== -1) {
      deferredSkeletonAnimation[key] = value == null ? '' : String(value);
      continue;
    }

    // Simple property assignment
    try { component[key] = value; } catch (e) {}
  }

  var animationKeys = Object.keys(deferredSkeletonAnimation);
  if (animationKeys.length) {
    var availableAnimations = await waitForSkeletonAnimations(component);
    for (var ai = 0; ai < animationKeys.length; ai++) {
      var animationKey = animationKeys[ai];
      var animationName = deferredSkeletonAnimation[animationKey];
      if (animationName && !availableAnimations.length) continue;
      if (animationName && availableAnimations.length && availableAnimations.indexOf(animationName) === -1) continue;
      try { component[animationKey] = animationName; } catch (e1) {}
    }
  }
}

// ---------------------------------------------------------------------------
// Exports: 3.8 scene-script format
// ---------------------------------------------------------------------------

exports.methods = {

  'mcp-script-version'() {
    return {
      version: MCP_SCENE_SCRIPT_VERSION,
      hasAnimationClipTool: true,
      now: Date.now(),
    };
  },

  // =========================================================================
  // set-property
  // =========================================================================
  'set-property'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var prop = args.property || args.prop;
    var value = args.value;
    if (prop == null) throw new Error('No property specified');

    if (prop === 'name' || prop === '_name') {
      setNodeName(node, value);
    }
    // Position
    else if (prop === 'x' || prop === 'position.x') {
      var p = node.getPosition();
      node.setPosition(Number(value), p.y, p.z);
    } else if (prop === 'y' || prop === 'position.y') {
      var p2 = node.getPosition();
      node.setPosition(p2.x, Number(value), p2.z);
    } else if (prop === 'z' || prop === 'position.z') {
      var p3 = node.getPosition();
      node.setPosition(p3.x, p3.y, Number(value));
    } else if (prop === 'position') {
      var arr = Array.isArray(value) ? value : [value, 0, 0];
      node.setPosition(Number(arr[0]) || 0, Number(arr[1]) || 0, Number(arr[2]) || 0);
    }
    // Scale
    else if (prop === 'scaleX' || prop === 'scale.x') {
      var s = node.getScale();
      node.setScale(Number(value), s.y, s.z);
    } else if (prop === 'scaleY' || prop === 'scale.y') {
      var s2 = node.getScale();
      node.setScale(s2.x, Number(value), s2.z);
    } else if (prop === 'scale') {
      if (Array.isArray(value)) {
        node.setScale(Number(value[0]) || 1, Number(value[1]) || 1, Number(value[2]) || 1);
      } else {
        var sv = Number(value) || 1;
        node.setScale(sv, sv, sv);
      }
    }
    // Size (via UITransform)
    else if (prop === 'width') {
      var ut = getUITransform(node);
      if (ut) { var cs = ut.contentSize; ut.setContentSize(Number(value), cs.height); }
    } else if (prop === 'height') {
      var ut2 = getUITransform(node);
      if (ut2) { var cs2 = ut2.contentSize; ut2.setContentSize(cs2.width, Number(value)); }
    } else if (prop === 'size') {
      var ut3 = getUITransform(node);
      if (ut3 && Array.isArray(value)) {
        ut3.setContentSize(Number(value[0]) || 0, Number(value[1]) || 0);
      }
    }
    // Anchor (via UITransform)
    else if (prop === 'anchorX') {
      var ut4 = getUITransform(node);
      if (ut4) { var ap = ut4.anchorPoint; ut4.setAnchorPoint(Number(value), ap.y); }
    } else if (prop === 'anchorY') {
      var ut5 = getUITransform(node);
      if (ut5) { var ap2 = ut5.anchorPoint; ut5.setAnchorPoint(ap2.x, Number(value)); }
    } else if (prop === 'anchor') {
      var ut6 = getUITransform(node);
      if (ut6 && Array.isArray(value)) {
        ut6.setAnchorPoint(Number(value[0]) || 0.5, Number(value[1]) || 0.5);
      }
    }
    // Opacity (via UIOpacity)
    else if (prop === 'opacity') {
      setNodeOpacity(node, Number(value));
    }
    // Color (via Sprite or Label)
    else if (prop === 'color') {
      var arr2 = Array.isArray(value) ? value : [255, 255, 255, 255];
      var newColor = new cc.Color(arr2[0], arr2[1], arr2[2], arr2[3] != null ? arr2[3] : 255);
      var spr = getComponent(node, 'cc.Sprite');
      if (spr) { spr.color = newColor; }
      var lbl = getComponent(node, 'cc.Label');
      if (lbl) { lbl.color = newColor; }
    }
    // Angle (still available in 3.8 for 2D)
    else if (prop === 'angle' || prop === 'rotation') {
      node.angle = Number(value);
    }
    // Active
    else if (prop === 'active') {
      node.active = !!value;
    }
    // Layer / visibility mask support for camera-rendered checks.
    else if (prop === 'layer') {
      node.layer = Number(value);
    }
    // Name
    else if (prop === 'name') {
      node.name = String(value);
    }
    // Sibling index (replaces zIndex)
    else if (prop === 'zIndex' || prop === 'siblingIndex') {
      node.setSiblingIndex(Number(value));
    }
    // Label string
    else if (prop === 'string' || prop === 'label' || prop === 'text') {
      var labelComp = getComponent(node, 'cc.Label');
      if (labelComp) labelComp.string = String(value);
    }
    // Generic component property: "ComponentName.propName"
    else if (prop.indexOf('.') !== -1) {
      var dotParts = prop.split('.');
      var compName = dotParts[0];
      var compProp = dotParts.slice(1).join('.');
      var comp = getComponentByName(node, compName);
      if (comp && compProp in comp) {
        comp[compProp] = value;
      } else {
        throw new Error('Component property not found: ' + prop);
      }
    }
    else {
      throw new Error('Unknown property: ' + prop);
    }

    return { success: true, property: prop };
  },

  // =========================================================================
  // query-current-scene
  // =========================================================================
  'query-current-scene'() {
    var scene = cc.director.getScene();
    if (!scene) return { uuid: null, name: null };
    return { uuid: scene.uuid || null, name: scene.name || null };
  },

  // =========================================================================
  // get-hierarchy
  // =========================================================================
  'get-hierarchy'(args) {
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');

    // Support both `depth` (2.4 compat) and `maxDepth`
    var maxDepth = -1;
    if (args) {
      if (args.depth != null) maxDepth = Number(args.depth);
      if (args.maxDepth != null) maxDepth = Number(args.maxDepth);
    }
    var maxChildren = (args && args.maxChildren != null) ? Math.min(Number(args.maxChildren), 500) : 30;
    var includeDetails = !!(args && args.includeDetails);
    var rootId = args && (args.root || args.uuid || args.rootId || args.nodeId);

    var root = rootId ? findNodeByPath(rootId) : scene;
    if (!root) throw new Error('Root node not found');

    function isEditorInternalNode(node) {
      var name = node.name || '';
      return name === 'Editor Scene' || name === 'gizmoRoot' || name.indexOf('__editor') === 0;
    }

    function buildHierarchy(node, depth) {
      if (maxDepth >= 0 && depth > maxDepth) return null;
      if (isEditorInternalNode(node)) return null;
      var entry = {
        uuid: node.uuid,
        name: node.name,
        active: node.active,
        childrenCount: node.children.length
      };
      var comps = node.components || [];
      entry.components = comps.map(function (c) {
        return cc.js.getClassName(c) || c.constructor.name || 'Unknown';
      });
      if (includeDetails) {
        var pos = node.getPosition ? node.getPosition() : {};
        entry.position = { x: pos.x || 0, y: pos.y || 0, z: pos.z || 0 };
        var scale = node.getScale ? node.getScale() : {};
        entry.scale = { x: scale.x || 1, y: scale.y || 1, z: scale.z || 1 };
        entry.angle = node.angle || 0;
        entry.rotation = entry.angle;
        entry.layer = node.layer != null ? node.layer : null;
        var ut = getUITransform(node);
        if (ut) {
          var cs = ut.contentSize || {};
          entry.size = { width: cs.width || 0, height: cs.height || 0 };
          var ap = ut.anchorPoint || {};
          entry.anchor = { x: ap.x != null ? ap.x : 0.5, y: ap.y != null ? ap.y : 0.5 };
        }
        entry.opacity = getNodeOpacity(node);
      }
      entry.children = [];
      var kids = node.children || [];
      var limit = Math.min(kids.length, maxChildren);
      for (var i = 0; i < limit; i++) {
        var child = buildHierarchy(kids[i], depth + 1);
        if (child) entry.children.push(child);
      }
      if (kids.length > limit) {
        entry.truncated = true;
        entry.totalChildren = kids.length;
      }
      return entry;
    }

    return buildHierarchy(root, 0);
  },

  // =========================================================================
  // get-node-detail
  // =========================================================================
  'get-node-detail'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var includeComponents = args.components !== false && args.includeComponents !== false;
    var includeChildren = args.children === true || args.includeChildren === true;
    return serializeNodeState(node, includeComponents, includeChildren);
  },

  // =========================================================================
  // serialize-node-tree
  // =========================================================================
  'serialize-node-tree'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);
    return serializeNodeState(node, true, true);
  },

  // =========================================================================
  // update-node-transform
  // =========================================================================
  'update-node-transform'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    if (args.name != null) {
      setNodeName(node, args.name);
    }
    if (args.position != null || args.x != null || args.y != null || args.z != null) {
      var oldPos = node.getPosition();
      var pos = args.position != null ? vec3(args.position, oldPos.x, oldPos.y, oldPos.z) : [
        args.x != null ? Number(args.x) : oldPos.x,
        args.y != null ? Number(args.y) : oldPos.y,
        args.z != null ? Number(args.z) : oldPos.z,
      ];
      node.setPosition(pos[0], pos[1], pos[2]);
    }
    if (args.scale != null || args.scaleX != null || args.scaleY != null || args.scaleZ != null) {
      var oldScale = node.getScale();
      var scl = args.scale;
      if (scl != null) {
        if (Array.isArray(scl) || typeof scl === 'object') {
          var sv3 = vec3(scl, oldScale.x, oldScale.y, oldScale.z);
          node.setScale(sv3[0], sv3[1], sv3[2]);
        } else {
          var sv = Number(scl) || 1;
          node.setScale(sv, sv, sv);
        }
      } else {
        node.setScale(
          args.scaleX != null ? Number(args.scaleX) : oldScale.x,
          args.scaleY != null ? Number(args.scaleY) : oldScale.y,
          args.scaleZ != null ? Number(args.scaleZ) : oldScale.z
        );
      }
    }
    if (args.euler != null || args.eulerAngles != null) {
      var oldEuler = node.eulerAngles;
      var ev = vec3(args.euler != null ? args.euler : args.eulerAngles, oldEuler.x, oldEuler.y, oldEuler.z);
      node.eulerAngles = new cc.Vec3(ev[0], ev[1], ev[2]);
    }
    if (args.rotation != null || args.angle != null) {
      node.angle = Number(args.rotation != null ? args.rotation : args.angle) || 0;
    }
    if (args.size != null || args.width != null || args.height != null) {
      var ut = getUITransform(node);
      if (ut) {
        var oldSize = ut.contentSize;
        var size = args.size != null ? vec2(args.size, oldSize.width, oldSize.height) : [
          args.width != null ? Number(args.width) : oldSize.width,
          args.height != null ? Number(args.height) : oldSize.height,
        ];
        ut.setContentSize(size[0], size[1]);
      }
    }
    if (args.anchor != null || args.anchorX != null || args.anchorY != null) {
      var ut2 = getUITransform(node);
      if (ut2) {
        var oldAnchor = ut2.anchorPoint;
        var anchor = args.anchor != null ? vec2(args.anchor, oldAnchor.x, oldAnchor.y) : [
          args.anchorX != null ? Number(args.anchorX) : oldAnchor.x,
          args.anchorY != null ? Number(args.anchorY) : oldAnchor.y,
        ];
        ut2.setAnchorPoint(anchor[0], anchor[1]);
      }
    }
    if (args.opacity != null) {
      setNodeOpacity(node, Number(args.opacity));
    }
    if (args.color != null) {
      var newColor = colorValue(args.color);
      var spr = getComponent(node, 'cc.Sprite');
      if (spr) { spr.color = newColor; }
      var lbl = getComponent(node, 'cc.Label');
      if (lbl) { lbl.color = newColor; }
    }
    if (args.active != null) {
      node.active = !!args.active;
    }
    if (args.layer != null) {
      node.layer = Number(args.layer);
    }
    if (args.siblingIndex != null || args.zIndex != null) {
      node.setSiblingIndex(Number(args.siblingIndex != null ? args.siblingIndex : args.zIndex));
    }

    return serializeNodeState(node, false, false);
  },

  // =========================================================================
  // create-node
  // =========================================================================
  'create-node'(args) {
    args = mergeProperties(args);
    var type = args.type || 'empty';
    var name = args.name || type;
    var parentId = args.parent || args.parentUuid || args.parentId;
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');

    var parent = parentId ? findNodeByPath(parentId) : null;
    if (!parent) {
      // Default: attach to first child of scene (the Canvas node) or scene itself
      var kids = scene.children || [];
      parent = kids.length > 0 ? kids[0] : scene;
    }

    var newNode = new cc.Node(name);
    setNodeName(newNode, name);

    // All visible 2D nodes need UITransform in 3.8
    if (type !== 'empty' || args.addUITransform || args.size || args.anchor) {
      var ut = addComponent(newNode, 'cc.UITransform');
      if (args.size) {
        var initialSize = vec2(args.size, 0, 0);
        ut.setContentSize(initialSize[0], initialSize[1]);
      }
      if (args.anchor) {
        var initialAnchor = vec2(args.anchor, 0.5, 0.5);
        ut.setAnchorPoint(initialAnchor[0], initialAnchor[1]);
      }
    }

    switch (type) {
      case 'canvas': {
        if (!getUITransform(newNode)) {
          addComponent(newNode, 'cc.UITransform');
        }
        var canvas = addComponent(newNode, 'cc.Canvas');
        // Add Widget for full-screen stretching
        try {
          var widget = addComponent(newNode, 'cc.Widget');
          widget.isAlignTop = true;
          widget.isAlignBottom = true;
          widget.isAlignLeft = true;
          widget.isAlignRight = true;
          widget.top = 0;
          widget.bottom = 0;
          widget.left = 0;
          widget.right = 0;
        } catch (e) {}
        // Add Camera child node
        try {
          var cameraNode = new cc.Node('Camera');
          cameraNode.layer = newNode.layer;
          newNode.addChild(cameraNode);
          var cam = cameraNode.addComponent(cc.Camera);
        } catch (e) {}
        break;
      }
      case 'sprite': {
        if (!getUITransform(newNode)) {
          addComponent(newNode, 'cc.UITransform');
        }
        var sprite = addComponent(newNode, 'cc.Sprite');
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        var uiT = getUITransform(newNode);
        if (!args.size) {
          uiT.setContentSize(100, 100);
        }
        if (args.color) {
          sprite.color = colorValue(args.color);
        }
        break;
      }
      case 'button': {
        if (!getUITransform(newNode)) {
          addComponent(newNode, 'cc.UITransform');
        }
        var btnSprite = addComponent(newNode, 'cc.Sprite');
        btnSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        var btnUT = getUITransform(newNode);
        if (!args.size) {
          btnUT.setContentSize(160, 40);
        }
        addComponent(newNode, 'cc.Button');
        syncButtonSpriteState(newNode);
        if (args.skipDefaultLabel !== true) {
          var labelNode = new cc.Node('Label');
          labelNode.layer = newNode.layer;
          var labelUT = addComponent(labelNode, 'cc.UITransform');
          labelUT.setContentSize(160, 40);
          var labelComp = addComponent(labelNode, 'cc.Label');
          labelComp.string = args.text || args.label || 'Button';
          labelComp.fontSize = args.fontSize || 20;
          labelComp.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
          labelComp.verticalAlign = cc.Label.VerticalAlign.CENTER;
          labelComp.overflow = cc.Label.Overflow.CLAMP;
          labelNode.parent = newNode;
        }
        break;
      }
      case 'label': {
        if (!getUITransform(newNode)) {
          addComponent(newNode, 'cc.UITransform');
        }
        var lblComp = addComponent(newNode, 'cc.Label');
        lblComp.string = args.text || args.label || 'Label';
        lblComp.fontSize = args.fontSize || 24;
        if (args.size && cc.Label && cc.Label.Overflow) {
          lblComp.overflow = cc.Label.Overflow.CLAMP;
        }
        if (args.color) {
          lblComp.color = colorValue(args.color);
        }
        break;
      }
      case 'empty':
      default: {
        // Just a bare node, UITransform added above if requested
        break;
      }
    }

    // Some UI components (notably Label with auto-sizing defaults) may mutate
    // UITransform while they are initialized. Re-apply explicit layout inputs
    // after component setup so MCP create_node readback reflects requested
    // automation values instead of component defaults.
    if (args.size) {
      var explicitSizeTransform = getUITransform(newNode);
      if (explicitSizeTransform) {
        var explicitSize = vec2(args.size, 0, 0);
        explicitSizeTransform.setContentSize(explicitSize[0], explicitSize[1]);
      }
    }
    if (args.anchor) {
      var explicitAnchorTransform = getUITransform(newNode);
      if (explicitAnchorTransform) {
        var explicitAnchor = vec2(args.anchor, 0.5, 0.5);
        explicitAnchorTransform.setAnchorPoint(explicitAnchor[0], explicitAnchor[1]);
      }
    }

    // Apply transform
    if (args.position) {
      var finalPos = vec3(args.position, 0, 0, 0);
      newNode.setPosition(finalPos[0], finalPos[1], finalPos[2]);
    }
    if (args.scale) {
      if (Array.isArray(args.scale) || typeof args.scale === 'object') {
        var scaleVec = vec3(args.scale, 1, 1, 1);
        newNode.setScale(scaleVec[0], scaleVec[1], scaleVec[2]);
      } else {
        var sv = Number(args.scale) || 1;
        newNode.setScale(sv, sv, sv);
      }
    }
    if (args.opacity != null) {
      setNodeOpacity(newNode, Number(args.opacity));
    }
    if (args.angle != null) {
      newNode.angle = Number(args.angle);
    }
    if (args.euler != null || args.eulerAngles != null) {
      var createEuler = vec3(args.euler != null ? args.euler : args.eulerAngles, 0, 0, 0);
      newNode.eulerAngles = new cc.Vec3(createEuler[0], createEuler[1], createEuler[2]);
    }
    if (args.rotation != null) {
      newNode.angle = Number(args.rotation);
    }
    if (args.active === false) {
      newNode.active = false;
    }
    if (args.layer != null) {
      newNode.layer = Number(args.layer);
    } else if (args.inheritParentLayer !== false && parent.layer != null) {
      newNode.layer = parent.layer;
    }
    if (args.siblingIndex != null || args.zIndex != null) {
      newNode.setSiblingIndex(Number(args.siblingIndex != null ? args.siblingIndex : args.zIndex));
    }

    // Layout widget presets (center/full/top/bottom/left/right/corners)
    if (args.layout) {
      try {
        var layoutWidget = getComponent(newNode, 'cc.Widget') || addComponent(newNode, 'cc.Widget');
        layoutWidget.alignMode = cc.Widget.AlignMode ? cc.Widget.AlignMode.ONCE : 0;
        switch (args.layout) {
          case 'center':
            layoutWidget.isAlignHorizontalCenter = true; layoutWidget.isAlignVerticalCenter = true;
            layoutWidget.horizontalCenter = 0; layoutWidget.verticalCenter = 0; break;
          case 'full':
            layoutWidget.isAlignTop = true; layoutWidget.isAlignBottom = true;
            layoutWidget.isAlignLeft = true; layoutWidget.isAlignRight = true;
            layoutWidget.top = 0; layoutWidget.bottom = 0; layoutWidget.left = 0; layoutWidget.right = 0; break;
          case 'top':
            layoutWidget.isAlignTop = true; layoutWidget.isAlignHorizontalCenter = true;
            layoutWidget.top = 0; layoutWidget.horizontalCenter = 0; break;
          case 'bottom':
            layoutWidget.isAlignBottom = true; layoutWidget.isAlignHorizontalCenter = true;
            layoutWidget.bottom = 0; layoutWidget.horizontalCenter = 0; break;
          case 'left':
            layoutWidget.isAlignLeft = true; layoutWidget.isAlignVerticalCenter = true;
            layoutWidget.left = 0; layoutWidget.verticalCenter = 0; break;
          case 'right':
            layoutWidget.isAlignRight = true; layoutWidget.isAlignVerticalCenter = true;
            layoutWidget.right = 0; layoutWidget.verticalCenter = 0; break;
          case 'top-left':
            layoutWidget.isAlignTop = true; layoutWidget.isAlignLeft = true;
            layoutWidget.top = 0; layoutWidget.left = 0; break;
          case 'top-right':
            layoutWidget.isAlignTop = true; layoutWidget.isAlignRight = true;
            layoutWidget.top = 0; layoutWidget.right = 0; break;
          case 'bottom-left':
            layoutWidget.isAlignBottom = true; layoutWidget.isAlignLeft = true;
            layoutWidget.bottom = 0; layoutWidget.left = 0; break;
          case 'bottom-right':
            layoutWidget.isAlignBottom = true; layoutWidget.isAlignRight = true;
            layoutWidget.bottom = 0; layoutWidget.right = 0; break;
        }
      } catch (e) {}
    }

    if (args.layer != null || args.inheritParentLayer !== false) {
      syncNodeLayerDeep(newNode, newNode.layer);
    }
    newNode.parent = parent;
    if (args.defaultSpriteUuid) {
      var spriteForFrame = getComponent(newNode, 'cc.Sprite');
      if (spriteForFrame) {
        return new Promise(function (resolve) {
          var request = { uuid: args.defaultSpriteUuid };
          var spriteFrameClass = resolveComponentClass('cc.SpriteFrame') || cc.SpriteFrame;
          if (spriteFrameClass) request.type = spriteFrameClass;
          cc.assetManager.loadAny(request, function (err, asset) {
            if (err || !asset) {
              try {
                cc.assetManager.loadAny(args.defaultSpriteUuid, function (fallbackErr, fallbackAsset) {
                  if (!fallbackErr && fallbackAsset) {
                    try { spriteForFrame.spriteFrame = fallbackAsset; refreshSpriteRenderState(spriteForFrame); syncButtonSpriteState(newNode); } catch (e) {}
                  }
                  resolve(serializeNodeState(newNode, true, false));
                });
              } catch (fallbackThrow) {
                resolve(serializeNodeState(newNode, true, false));
              }
              return;
            }
            if (!err && asset) {
              try { spriteForFrame.spriteFrame = asset; refreshSpriteRenderState(spriteForFrame); syncButtonSpriteState(newNode); } catch (e) {}
            }
            resolve(serializeNodeState(newNode, true, false));
          });
        });
      }
    }

    return serializeNodeState(newNode, true, false);
  },

  // =========================================================================
  // duplicate-node
  // =========================================================================
  'duplicate-node'(args) {
    var sourceId = getNodeArg(args);
    if (!sourceId) throw new Error('id is required');
    var source = findNodeByPath(sourceId);
    if (!source) throw new Error('Node not found: ' + sourceId);

    var scene = cc.director.getScene();
    if (source === scene) throw new Error('Cannot duplicate the scene root');

    var parentId = args.parentId || args.parent || args.parentUuid;
    var parent = parentId ? findNodeByPath(parentId) : source.parent;
    if (!parent) throw new Error('Parent node not found: ' + (parentId || '<source parent>'));
    if (parent === source) throw new Error('Cannot duplicate a node under itself');
    var ancestor = parent;
    while (ancestor) {
      if (ancestor === source) throw new Error('Cannot duplicate a node under its own descendant');
      ancestor = ancestor.parent;
    }

    var copy = cc.instantiate(source);
    copy.name = args.name || (source.name + '_copy');
    parent.addChild(copy);
    if (args.layer != null || copy.layer !== parent.layer) {
      syncNodeLayerDeep(copy, args.layer != null ? Number(args.layer) : parent.layer);
    }
    if (args.siblingIndex != null || args.index != null) {
      copy.setSiblingIndex(Number(args.siblingIndex != null ? args.siblingIndex : args.index));
    } else if (parent === source.parent && typeof source.getSiblingIndex === 'function') {
      copy.setSiblingIndex(source.getSiblingIndex() + 1);
    }
    return {
      success: true,
      source: serializeNodeState(source, false, false),
      node: serializeNodeState(copy, true, true)
    };
  },

  // =========================================================================
  // serialize-current-scene
  // =========================================================================
  'serialize-current-scene'(args) {
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');

    var maxDepth = args && args.maxDepth != null ? args.maxDepth : -1;
    var includeComponents = args ? args.components !== false : true;

    function serializeRecursive(node, depth) {
      var data = serializeNodeState(node, includeComponents, false);
      data.children = [];
      if (maxDepth < 0 || depth < maxDepth) {
        var kids = node.children || [];
        for (var i = 0; i < kids.length; i++) {
          data.children.push(serializeRecursive(kids[i], depth + 1));
        }
      }
      return data;
    }

    return {
      sceneName: scene.name,
      sceneUuid: scene.uuid,
      tree: serializeRecursive(scene, 0)
    };
  },

  // =========================================================================
  // serialize-current-prefab-edit-context
  // =========================================================================
  'serialize-current-prefab-edit-context'(args) {
    args = args || {};
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');
    var hierarchy = this['get-hierarchy'] ? this['get-hierarchy']({ depth: 3, maxChildren: 80 }) : null;
    var requestedUuid = args.rootUuid || args.nodeUuid || args.uuid || null;
    var candidates = [];
    function addCandidate(node, reason) {
      if (!node) return;
      for (var i = 0; i < candidates.length; i++) {
        if (candidates[i].node === node) return;
      }
      candidates.push({ node: node, reason: reason });
    }
    if (requestedUuid) addCandidate(findNodeByPath(requestedUuid), 'requested_uuid');
    var children = scene.children || [];
    for (var ci = 0; ci < children.length; ci++) addCandidate(children[ci], 'scene_child');
    addCandidate(scene, 'scene');

    var attempts = [];
    for (var i = 0; i < candidates.length; i++) {
      var node = candidates[i].node;
      if (!node) continue;
      var prefabInfo = node._prefab || node.prefab || null;
      var prefabUuid = args.prefabUuid || (prefabInfo && prefabInfo.asset && (prefabInfo.asset._uuid || prefabInfo.asset.uuid)) || null;
      var rootUuid = args.rootUuid || (prefabInfo && prefabInfo.root && prefabInfo.root.uuid) || node.uuid || null;
      var serializeCandidates = [];
      if (prefabInfo && prefabInfo.asset) serializeCandidates.push({ value: prefabInfo.asset, kind: 'prefab_info_asset' });
      if (args.preferEditorPrefabUtils !== false) {
        try {
          var editorPrefab = makePrefabAssetWithEditorPrefabUtils(node, prefabUuid || args.prefabUuid || null);
          if (editorPrefab) {
            serializeCandidates.push({ value: editorPrefab, kind: 'editor_prefab_utils_applied_prefab' });
            var editorPrefabInfo = node._prefab || node.prefab || null;
            if (!prefabUuid && editorPrefabInfo && editorPrefabInfo.asset) prefabUuid = editorPrefabInfo.asset._uuid || editorPrefabInfo.asset.uuid || null;
            if (editorPrefabInfo && editorPrefabInfo.root && editorPrefabInfo.root.uuid) rootUuid = editorPrefabInfo.root.uuid;
          } else {
            attempts.push({ candidate: candidates[i].reason, nodeUuid: node.uuid || null, nodeName: node.name || null, kind: 'editor_prefab_utils_applied_prefab', ok: false, error: 'PrefabUtils unavailable or missing createPrefabFrom/createAppliedPrefab in scene process.' });
          }
        } catch (editorPrefabError) {
          attempts.push({ candidate: candidates[i].reason, nodeUuid: node.uuid || null, nodeName: node.name || null, kind: 'editor_prefab_utils_applied_prefab', ok: false, error: editorPrefabError.message || String(editorPrefabError) });
        }
      }
      try { serializeCandidates.push({ value: makePrefabAssetFromRootNode(node, prefabUuid), kind: 'new_cc_prefab_with_root_node' }); } catch (makeError) {
        attempts.push({ candidate: candidates[i].reason, nodeUuid: node.uuid || null, nodeName: node.name || null, kind: 'new_cc_prefab_with_root_node', ok: false, error: makeError.message || String(makeError) });
      }
      serializeCandidates.push({ value: node, kind: 'root_node' });
      for (var si = 0; si < serializeCandidates.length; si++) {
        var entry = serializeCandidates[si];
        try {
          var content = serializeRuntimeAsset(entry.value);
          var contentString = typeof content === 'string' ? content : '';
          var hasPrefabType = contentString.indexOf('"__type__": "cc.Prefab"') >= 0 || contentString.indexOf('"__type__":"cc.Prefab"') >= 0;
          attempts.push({
            candidate: candidates[i].reason,
            kind: entry.kind,
            ok: !!contentString,
            typeName: getSerializableTypeName(entry.value),
            nodeUuid: node.uuid || null,
            nodeName: node.name || null,
            rootUuid: rootUuid,
            prefabUuid: prefabUuid,
            contentLength: contentString.length,
            hasPrefabType: hasPrefabType,
          });
          var allowedKind = !args.requireSerializeKind || entry.kind === args.requireSerializeKind;
          if (contentString && allowedKind && (args.requirePrefabType === false || hasPrefabType || entry.kind !== 'root_node')) {
            return {
              ok: true,
              success: true,
              content: args.returnContent === false ? null : contentString,
              contentLength: contentString.length,
              serializeKind: entry.kind,
              typeName: getSerializableTypeName(entry.value),
              rootUuid: rootUuid,
              prefabUuid: prefabUuid,
              nodeUuid: node.uuid || null,
              nodeName: node.name || null,
              sceneName: scene.name || null,
              hasPrefabType: hasPrefabType,
              hierarchy: hierarchy,
              attempts: attempts,
              serializer: (typeof cce !== 'undefined' && cce.Utils && cce.Utils.serialize) ? 'cce.Utils.serialize' : ((typeof EditorExtends !== 'undefined' && EditorExtends.serialize) ? 'EditorExtends.serialize' : 'unknown'),
            };
          }
        } catch (serializeError) {
          attempts.push({ candidate: candidates[i].reason, kind: entry.kind, ok: false, error: serializeError.message || String(serializeError), nodeUuid: node.uuid || null, nodeName: node.name || null });
        }
      }
    }
    return {
      ok: false,
      success: false,
      sceneName: scene.name || null,
      requestedUuid: requestedUuid,
      requiredSerializeKind: args.requireSerializeKind || null,
      hierarchy: hierarchy,
      attempts: attempts,
      error: 'No current prefab edit candidate could be serialized through Cocos runtime serializers.',
      missingCapability: 'current_prefab_edit_context_serialize_readback',
    };
  },

  // =========================================================================
  // serialize-empty-scene-asset
  // =========================================================================
  'serialize-empty-scene-asset'(args) {
    // In 3.8 scene scripts, we cannot access Editor.serialize or Editor.assetdb.
    // Return a minimal JSON representation that the main process can use.
    var sceneName = (args && args.name) || 'New Scene';
    return {
      __type__: 'cc.SceneAsset',
      _name: sceneName,
      scene: {
        __type__: 'cc.Scene',
        _name: sceneName,
        _children: [],
        _active: true
      },
      _note: 'This is a minimal scene descriptor. Actual scene creation should be done via Editor.Message in the main process.'
    };
  },

  // =========================================================================
  // delete-node
  // =========================================================================
  'delete-node'(args) {
    var nodeId = getNodeArg(args);
    if (!nodeId) throw new Error('id is required');
    var node = findNodeByPath(nodeId);
    if (!node) {
      if (args && (args.missingOk || args.silent)) {
        return { success: true, ok: true, skipped: true, id: nodeId, reason: 'Node already missing' };
      }
      throw new Error('Node not found: ' + nodeId);
    }

    var scene = cc.director.getScene();
    if (node === scene) throw new Error('Cannot delete the scene root');

    var info = { uuid: node.uuid, name: node.name };
    node.removeFromParent();
    if (!(args && (args.detachOnly === true || args.destroy === false))) {
      node.destroy();
    }
    return { success: true, deleted: info };
  },

  // =========================================================================
  // manage-components
  // =========================================================================
  async 'manage-components'(args) {
    var action = args.action || args.type || 'list';
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    switch (action) {
      case 'list': {
        var comps = node.components || [];
        return {
          components: comps.map(function (c) {
            var className = cc.js.getClassName(c) || c.constructor.name || 'Unknown';
            var props = {};
            try {
              var keys = Object.keys(c);
              for (var ki = 0; ki < keys.length; ki++) {
                var k = keys[ki];
                if (k.charAt(0) === '_') continue;
                var val = c[k];
                var t = typeof val;
                if (t === 'string' || t === 'number' || t === 'boolean') {
                  props[k] = val;
                }
              }
            } catch (e) {}
            if (className === 'cc.Label' || className === 'Label') {
              try {
                props.fontUuid = getAssetUuid(c.font);
                props.fontName = c.font ? (c.font.name || null) : null;
              } catch (labelAssetReadError) {}
            }
            if (className === 'cc.AudioSource' || className === 'AudioSource') {
              try {
                props.clipUuid = getAssetUuid(c.clip);
                props.clipName = c.clip ? (c.clip.name || null) : null;
                props.playing = !!c.playing;
              } catch (audioAssetReadError) {}
            }
            return { type: className, uuid: c.uuid, enabled: c.enabled, properties: props };
          })
        };
      }
      case 'add': {
        var compName = args.component || args.componentName || args.componentType;
        if (!compName) throw new Error('No component name specified');
        var comp = addComponent(node, compName);
        if (!comp) throw new Error('Failed to add component: ' + compName);
        if (args.properties) {
          await applyProperties(node, comp, args.properties);
        }
        return {
          success: true,
          component: {
            type: cc.js.getClassName(comp) || comp.constructor.name,
            uuid: comp.uuid,
            enabled: comp.enabled
          }
        };
      }
      case 'remove': {
        var rCompName = args.component || args.componentName || args.componentType;
        var rCompUuid = args.componentUuid || args.componentId;
        var target = null;
        if (rCompUuid) {
          var allComps = node.components || [];
          for (var ri = 0; ri < allComps.length; ri++) {
            if (allComps[ri].uuid === rCompUuid) { target = allComps[ri]; break; }
          }
        } else if (rCompName) {
          target = getComponentByName(node, rCompName);
        }
        if (!target) throw new Error('Component not found');
        target.destroy();
        return { success: true };
      }
      case 'reparent': {
        var newParentId = args.parentId || args.parent || args.parentUuid;
        if (!newParentId) throw new Error('parentId is required for reparent');
        var newParent = findNodeByPath(newParentId);
        if (!newParent) throw new Error('Parent node not found: ' + newParentId);
        if (newParent === node) throw new Error('Cannot reparent a node to itself');
        var ancestor = newParent;
        while (ancestor) {
          if (ancestor === node) throw new Error('Cannot reparent a node under its own descendant');
          ancestor = ancestor.parent;
        }
        node.parent = newParent;
        if (args.siblingIndex != null) node.setSiblingIndex(Number(args.siblingIndex));
        return { success: true, node: serializeNodeState(node, true, false) };
      }
      case 'set-sibling-index': {
        if (args.siblingIndex == null && args.index == null) throw new Error('siblingIndex is required');
        node.setSiblingIndex(Number(args.siblingIndex != null ? args.siblingIndex : args.index));
        return { success: true, node: serializeNodeState(node, true, false) };
      }
      case 'update': {
        var uCompName = args.component || args.componentName || args.componentType;
        var uComp = getComponentByName(node, uCompName);
        if (!uComp) throw new Error('Component not found: ' + uCompName);
        if (args.properties) {
          await applyProperties(node, uComp, args.properties);
        }
        return { success: true, type: cc.js.getClassName(uComp) || uComp.constructor.name };
      }
      default:
        throw new Error('Unknown manage-components action: ' + action);
    }
  },

  // =========================================================================
  // bind-reference-property
  // =========================================================================
  'bind-reference-property'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var propertyName = args.propertyName || args.property;
    if (!propertyName) throw new Error('propertyName is required');

    var componentName = args.component || args.componentName || args.componentType;
    var component = componentName ? getComponentByName(node, componentName) : findComponentWithProperty(node, propertyName);
    if (!component) {
      throw new Error(componentName ? ('Component not found: ' + componentName) : ('No component has property: ' + propertyName));
    }
    var assignPropertyName = normalizeComponentPropertyName(componentName || (cc.js.getClassName(component) || ''), propertyName);

    if ((args.valueKind || 'node') === 'asset' && !args.clear) {
      return resolveReferenceValue(args).then(function (value) {
        component[assignPropertyName] = value;
        if (componentName === 'cc.Sprite' && (assignPropertyName === 'spriteFrame' || assignPropertyName === 'spriteAtlas')) {
          refreshSpriteRenderState(component);
          syncButtonSpriteState(node);
        }
        var loadedInfo = describeBoundValue(value);
        return {
          success: true,
          nodeId: String(node.uuid || ''),
          component: String(cc.js.getClassName(component) || component.constructor.name || componentName || 'Component'),
          propertyName: String(assignPropertyName),
          requestedPropertyName: String(propertyName),
          assigned: loadedInfo.assigned,
          assignedType: loadedInfo.assignedType,
          assignedName: loadedInfo.assignedName,
          assignedNode: loadedInfo.assignedNode,
          cleared: loadedInfo.cleared,
        };
      });
    }

    var value = resolveReferenceValueSync(args);
    component[assignPropertyName] = value;
    if (componentName === 'cc.Sprite' && (assignPropertyName === 'spriteFrame' || assignPropertyName === 'spriteAtlas')) {
      refreshSpriteRenderState(component);
      syncButtonSpriteState(node);
    }
    var valueInfo = describeBoundValue(value);
    return {
      success: true,
      nodeId: String(node.uuid || ''),
      component: String(cc.js.getClassName(component) || component.constructor.name || componentName || 'Component'),
      propertyName: String(assignPropertyName),
      requestedPropertyName: String(propertyName),
      assigned: valueInfo.assigned,
      assignedType: valueInfo.assignedType,
      assignedName: valueInfo.assignedName,
      assignedNode: valueInfo.assignedNode,
      cleared: valueInfo.cleared,
    };
  },

  'refresh-sprite-render-state'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);
    var sprite = getComponent(node, 'cc.Sprite');
    if (!sprite) throw new Error('Component not found: cc.Sprite');
    var result = refreshSpriteRenderState(sprite);
    syncButtonSpriteState(node);
    return Object.assign({
      success: true,
      nodeId: String(node.uuid || ''),
      nodeName: String(node.name || ''),
      component: 'cc.Sprite',
    }, result);
  },

  'inspect-sprite-runtime-state'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);
    var sprite = getComponent(node, 'cc.Sprite');
    if (!sprite) throw new Error('Component not found: cc.Sprite');
    var uiTransform = getComponent(node, 'cc.UITransform');
    var spriteFrame = null;
    var sharedMaterial0 = null;
    var renderMaterial0 = null;
    try { spriteFrame = sprite.spriteFrame || sprite._spriteFrame || null; } catch (e) {}
    try { sharedMaterial0 = sprite.getSharedMaterial ? sprite.getSharedMaterial(0) : (sprite.sharedMaterials && sprite.sharedMaterials[0]) || null; } catch (e2) {}
    try { renderMaterial0 = sprite.getRenderMaterial ? sprite.getRenderMaterial(0) : (sprite._renderMaterials && sprite._renderMaterials[0]) || null; } catch (e3) {}
    return {
      success: true,
      nodeId: String(node.uuid || ''),
      nodeName: String(node.name || ''),
      nodeActive: !!node.active,
      component: 'cc.Sprite',
      sprite: {
        enabled: sprite.enabled !== false,
        type: sprite.type != null ? sprite.type : null,
        sizeMode: sprite.sizeMode != null ? sprite.sizeMode : null,
        trim: sprite.trim != null ? !!sprite.trim : null,
        grayscale: sprite.grayscale != null ? !!sprite.grayscale : null,
        color: nodeColorInfo(node),
      },
      uiTransform: uiTransform ? {
        width: numberOrNull(uiTransform.width),
        height: numberOrNull(uiTransform.height),
        anchorX: numberOrNull(uiTransform.anchorX),
        anchorY: numberOrNull(uiTransform.anchorY),
      } : null,
      spriteFrame: spriteFrameRuntimeInfo(spriteFrame),
      sharedMaterial0: materialInfo(sharedMaterial0),
      renderMaterial0: materialInfo(renderMaterial0),
      renderer: spriteRendererDiagnostics(sprite),
      canRender: safeCanRender(sprite),
    };
  },

  'inspect-visible-sprites-under-node'(args) {
    var nodeId = getNodeArg(args);
    var root = findNodeByPath(nodeId);
    if (!root) throw new Error('Node not found: ' + nodeId);
    var snapshots = collectSpriteSnapshots(root, {
      includeInactive: args.includeInactive === true,
      maxDepth: args.maxDepth,
    });
    return {
      success: true,
      rootNodeId: String(root.uuid || ''),
      rootNodeName: String(root.name || ''),
      rootNodePath: getNodePath(root),
      includeInactive: args.includeInactive === true,
      maxDepth: args.maxDepth != null ? Number(args.maxDepth) : null,
      spriteCount: snapshots.length,
      sprites: snapshots,
    };
  },

  // =========================================================================
  // inspect-bound-property
  // =========================================================================
  'inspect-bound-property'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var propertyName = args.propertyName || args.property;
    if (!propertyName) throw new Error('propertyName is required');

    var componentName = args.component || args.componentName || args.componentType;
    var component = componentName ? getComponentByName(node, componentName) : findComponentWithProperty(node, propertyName);
    if (!component) {
      throw new Error(componentName ? ('Component not found: ' + componentName) : ('No component has property: ' + propertyName));
    }
    var inspectPropertyName = normalizeComponentPropertyName(componentName || (cc.js.getClassName(component) || ''), propertyName);

    var value = null;
    try { value = component[inspectPropertyName]; } catch (e) {}
    var valueType = null;
    try {
      if (value) valueType = cc.js.getClassName(value) || (value.constructor && value.constructor.name) || typeof value;
    } catch (e) {
      valueType = typeof value;
    }
    var valueInfo = describeBoundValue(value);
    var info = {
      exists: value !== undefined && value !== null,
      nodeId: String(node.uuid || ''),
      component: String(cc.js.getClassName(component) || component.constructor.name || componentName || 'Component'),
      propertyName: String(inspectPropertyName),
      requestedPropertyName: String(propertyName),
      valueType: valueType ? String(valueType) : null,
      uuid: valueInfo.assigned,
      name: valueInfo.assignedName,
      node: valueInfo.assignedNode,
      assetValid: valueInfo.assetValid,
      missingAsset: !!(valueInfo.assigned && valueInfo.assetValid === false),
    };
    return JSON.parse(JSON.stringify(info));
  },

  // =========================================================================
  // bind-button-click
  // =========================================================================
  'bind-button-click'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var button = getComponent(node, 'cc.Button');
    if (!button) throw new Error('Button component not found on node: ' + (node.name || nodeId));

    var targetNodeId = args.targetNodeId || args.targetPath || args.target || args.targetNode;
    var componentName = args.component || args.componentName || args.componentType;
    var handlerName = args.handler || args.handlerName || args.method || args.methodName;
    var customEventData = args.customEventData;
    var replace = args.append ? false : true;

    var current = Array.isArray(button.clickEvents) ? button.clickEvents.slice() : [];

    function eventTargetUuid(eventHandler) {
      try {
        return eventHandler && eventHandler.target && eventHandler.target.uuid ? String(eventHandler.target.uuid) : '';
      } catch (e) {
        return '';
      }
    }

    function sameBinding(eventHandler) {
      if (!eventHandler) return false;
      var targetMatches = !targetNodeId || eventTargetUuid(eventHandler) === String(targetNodeId);
      var componentMatches = !componentName || String(eventHandler.component || '') === String(componentName);
      var handlerMatches = !handlerName || String(eventHandler.handler || '') === String(handlerName);
      if (args.clear) return targetMatches && componentMatches && handlerMatches;
      return targetMatches && componentMatches;
    }

    var before = current.length;
    if (args.clear || replace) {
      current = current.filter(function (eventHandler) { return !sameBinding(eventHandler); });
    }

    var added = null;
    if (!args.clear) {
      if (!targetNodeId) throw new Error('targetNodeId is required');
      if (!componentName) throw new Error('component is required');
      if (!handlerName) throw new Error('handler is required');

      var targetNode = findNodeByPath(targetNodeId);
      if (!targetNode) throw new Error('Target node not found: ' + targetNodeId);
      var targetComp = getComponentByName(targetNode, componentName);
      if (!targetComp) throw new Error('Target component not found: ' + componentName);
      if (typeof targetComp[handlerName] !== 'function') {
        throw new Error('Handler method not found: ' + componentName + '.' + handlerName);
      }

      var eventHandler = new cc.Component.EventHandler();
      eventHandler.target = targetNode;
      eventHandler.component = componentName;
      eventHandler.handler = handlerName;
      if (customEventData !== undefined) eventHandler.customEventData = String(customEventData);
      current.push(eventHandler);
      added = eventHandler;
    }

    button.clickEvents = current;

    function summarize(eventHandler) {
      return {
        target: eventTargetUuid(eventHandler),
        targetName: eventHandler && eventHandler.target ? String(eventHandler.target.name || '') : '',
        component: String((eventHandler && eventHandler.component) || ''),
        handler: String((eventHandler && eventHandler.handler) || ''),
        customEventData: String((eventHandler && eventHandler.customEventData) || ''),
      };
    }

    return JSON.parse(JSON.stringify({
      success: true,
      nodeId: String(node.uuid || ''),
      buttonNode: String(node.name || ''),
      beforeCount: before,
      afterCount: current.length,
      removedCount: before - (args.clear ? current.length : (current.length - (added ? 1 : 0))),
      added: added ? summarize(added) : null,
      events: current.map(summarize),
      cleared: !!args.clear,
    }));
  },

  // =========================================================================
  // manage-animation
  // =========================================================================
  'manage-animation'(args) {
    var action = args.action || 'list_clips';
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var animComp = getComponent(node, 'cc.Animation');
    if (!animComp) throw new Error('No Animation component on node: ' + (node.name || nodeId));

    switch (action) {
      case 'play': {
        var clipName = args.clip || args.clipName;
        if (clipName) {
          animComp.play(clipName);
        } else {
          animComp.play();
        }
        return { success: true, action: 'play', clip: clipName || '(default)' };
      }
      case 'stop': {
        animComp.stop();
        return { success: true, action: 'stop' };
      }
      case 'pause': {
        animComp.pause();
        return { success: true, action: 'pause' };
      }
      case 'resume': {
        animComp.resume();
        return { success: true, action: 'resume' };
      }
      case 'list_clips': {
        var clips = animComp.clips || [];
        return {
          clips: clips.map(function (clip) {
            return {
              name: clip ? clip.name : '(null)',
              duration: clip ? clip.duration : 0,
              speed: clip ? clip.speed : 1
            };
          })
        };
      }
      case 'get_info': {
        var state = null;
        var currentClip = args.clip || args.clipName;
        if (currentClip) {
          try { state = animComp.getState(currentClip); } catch (e) {}
        }
        return {
          defaultClip: animComp.defaultClip ? animComp.defaultClip.name : null,
          clipCount: (animComp.clips || []).length,
          playOnLoad: animComp.playOnLoad,
          currentState: state ? {
            name: state.name,
            isPlaying: state.isPlaying,
            isPaused: state.isPaused,
            time: state.time,
            duration: state.duration
          } : null
        };
      }
      default:
        throw new Error('Unknown manage-animation action: ' + action);
    }
  },

  // =========================================================================
  // manage-animation-clip
  // =========================================================================
  'manage-animation-clip'(args) {
    var action = args.action || 'bind_generated';
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var animComp = getComponent(node, 'cc.Animation');
    if (!animComp) animComp = addComponent(node, 'cc.Animation');

    switch (action) {
      case 'validate': {
        var expectedUuid = args.uuid || args.assetUuid || null;
        var expectedName = args.clipName || args.name || null;
        var clips = animComp.clips || [];
        var foundClip = null;
        for (var vi = 0; vi < clips.length; vi++) {
          var vc = clips[vi];
          if (!vc) continue;
          var vcUuid = vc._uuid || vc.uuid || '';
          if ((expectedUuid && vcUuid === expectedUuid) || (expectedName && vc.name === expectedName) || (!expectedUuid && !expectedName && vi === 0)) {
            foundClip = vc;
            break;
          }
        }
        var paths = (args.expectedPaths || args.animatedPaths || []).map(function (p) { return String(p || ''); });
        var missingPaths = [];
        for (var pi = 0; pi < paths.length; pi++) {
          if (!findNodeRelative(node, paths[pi])) missingPaths.push(paths[pi]);
        }
        var defaultClip = animComp.defaultClip || animComp._defaultClip || null;
        var result = {
          success: true,
          action: 'validate',
          nodeId: node.uuid,
          clipCount: clips.length,
          clipName: foundClip ? foundClip.name : null,
          clipUuid: foundClip ? (foundClip._uuid || foundClip.uuid || null) : null,
          defaultClip: defaultClip ? defaultClip.name : null,
          defaultClipUuid: defaultClip ? (defaultClip._uuid || defaultClip.uuid || null) : null,
          playOnLoad: !!animComp.playOnLoad,
          trackCount: foundClip ? getAnimationTrackCount(foundClip) : 0,
          keyframeCount: foundClip ? getAnimationKeyframeCount(foundClip) : 0,
          animatedPaths: paths,
          missingPaths: missingPaths,
        };
        var errors = [];
        if (!foundClip) errors.push('clip_not_bound');
        if (args.requireTracks !== false && result.trackCount <= 0) errors.push('empty_tracks');
        if (args.requireTracks !== false && result.keyframeCount <= 0) errors.push('empty_keyframes');
        if (missingPaths.length) errors.push('missing_paths:' + missingPaths.join(','));
        var defaultMatchesFound = false;
        if (defaultClip && foundClip) {
          var defaultUuid = defaultClip._uuid || defaultClip.uuid || '';
          var foundUuid = foundClip._uuid || foundClip.uuid || '';
          defaultMatchesFound = defaultClip === foundClip || (!!defaultUuid && !!foundUuid && defaultUuid === foundUuid) || (!!defaultClip.name && defaultClip.name === foundClip.name);
        }
        if (args.requireDefaultClip !== false && !defaultMatchesFound) errors.push('default_clip_mismatch');
        if (args.requirePlayOnLoad === true && !animComp.playOnLoad) errors.push('playOnLoad_false');
        result.valid = errors.length === 0;
        result.errors = errors;
        if (!result.valid && args.strict !== false) throw new Error('Animation validation failed: ' + errors.join('; '));
        return result;
      }
      case 'bind_asset': {
        var assetUuid = args.uuid || args.assetUuid;
        if (!assetUuid) throw new Error('uuid is required for bind_asset');
        return new Promise(function (resolve, reject) {
          var request = cc.AnimationClip ? { uuid: assetUuid, type: cc.AnimationClip } : { uuid: assetUuid };
          cc.assetManager.loadAny(request, function (err, clip) {
            if (err) return reject(err);
            if (!clip) return reject(new Error('AnimationClip asset not loaded: ' + assetUuid));
            if (typeof clip.createEvaluator !== 'function') {
              return reject(new Error('Loaded asset is not a runtime AnimationClip: ' + assetUuid));
            }
            var clips = (animComp.clips || []).filter(function (c) {
              if (!c || typeof c.createEvaluator !== 'function') return false;
              var uuid = c._uuid || c.uuid || '';
              return uuid !== assetUuid && c.name !== clip.name;
            });
            clips.push(clip);
            try { animComp._clips = clips; } catch (e) {}
            animComp.clips = clips;
            try { animComp._defaultClip = clip; } catch (e) {}
            animComp.defaultClip = clip;
            if (args.playOnLoad != null) animComp.playOnLoad = !!args.playOnLoad;
            resolve({
              success: true,
              action: 'bind_asset',
              nodeId: node.uuid,
              clipName: clip.name || args.clipName || '(clip)',
              uuid: assetUuid,
              clipCount: clips.length,
              defaultClip: animComp.defaultClip ? animComp.defaultClip.name : null,
            });
          });
        });
      }
      case 'bind_generated':
      case 'create_runtime_clip': {
        if (!cc.AnimationClip) throw new Error('cc.AnimationClip is not available in scene context');
        var clip = new cc.AnimationClip();
        clip.name = args.clipName || args.name || 'mcp_generated_clip';
        clip.duration = Number(args.duration || 1);
        clip.speed = Number(args.speed || 1);
        clip.wrapMode = args.wrapMode || cc.AnimationClip.WrapMode.Loop;

        // Creator's public curve API has changed across 3.x versions, so this
        // generated clip is intentionally minimal. It verifies clip creation,
        // binding, defaultClip, and playOnLoad without manually editing .anim.
        var clips = (animComp.clips || []).filter(function (c) { return c && c.name !== clip.name; });
        clips.push(clip);
        animComp.clips = clips;
        animComp.defaultClip = clip;
        if (args.playOnLoad != null) animComp.playOnLoad = !!args.playOnLoad;

        return {
          success: true,
          action: action,
          nodeId: node.uuid,
          clipName: clip.name,
          duration: clip.duration,
          clipCount: clips.length,
          defaultClip: animComp.defaultClip ? animComp.defaultClip.name : null,
          note: 'Generated runtime AnimationClip bound to cc.Animation. Curve authoring requires a future editor-asset implementation.',
        };
      }
      case 'create_from_runtime_tracks': {
        if (!cc.AnimationClip) throw new Error('cc.AnimationClip is not available in scene context');
        if (!cc.animation || !cc.animation.TrackPath || !cc.animation.VectorTrack || !cc.animation.RealTrack) {
          throw new Error('Cocos runtime track API is unavailable; cannot create editor-visible AnimationClip tracks');
        }
        var runtimeTracks = normalizeAnimationTracks(args);
        if (!runtimeTracks.length) throw new Error('At least one animation track is required');
        var missing = [];
        for (var rp = 0; rp < runtimeTracks.length; rp++) {
          if (!findNodeRelative(node, runtimeTracks[rp].targetPath)) missing.push(runtimeTracks[rp].targetPath);
        }
        if (missing.length) throw new Error('Animation target path not found from root ' + node.name + ': ' + missing.join(', '));

        var rtClip = new cc.AnimationClip();
        rtClip.name = args.clipName || args.name || 'mcp_generated_clip';
        rtClip.duration = Number(args.duration || 1);
        rtClip.sample = Number(args.sample || 30);
        rtClip.speed = Number(args.speed || 1);
        rtClip.wrapMode = args.wrapMode || cc.AnimationClip.WrapMode.Loop;

        var builtPaths = [];
        for (var ti = 0; ti < runtimeTracks.length; ti++) {
          var spec = runtimeTracks[ti];
          var info = animationPropertyInfo(spec.property);
          var track = info.kind === 'real' ? new cc.animation.RealTrack() : new cc.animation.VectorTrack();
          var pathBuilder = new cc.animation.TrackPath();
          if (spec.targetPath) pathBuilder.toHierarchy(String(spec.targetPath));
          pathBuilder.toProperty(info.property);
          track.path = pathBuilder;
          if (typeof track.componentsCount === 'number') track.componentsCount = info.components;
          var channels = typeof track.channels === 'function' ? track.channels() : (track._channels || []);
          for (var ch = 0; ch < info.components; ch++) {
            var points = spec.keys.map(function (key) {
              var comps = animationValueComponents(key.value, info.components);
              var value = comps[ch] != null && !isNaN(comps[ch]) ? comps[ch] : 0;
              return [key.time, value];
            }).sort(function (a, b) { return a[0] - b[0]; });
            assignAnimationCurve(channels[ch].curve, points);
          }
          if (typeof rtClip.addTrack === 'function') rtClip.addTrack(track);
          else {
            if (!rtClip._tracks) rtClip._tracks = [];
            rtClip._tracks.push(track);
          }
          builtPaths.push(spec.targetPath);
        }

        var rtClips = (animComp.clips || []).filter(function (c) { return c && c.name !== rtClip.name; });
        rtClips.push(rtClip);
        try { animComp._clips = rtClips; } catch (e) {}
        animComp.clips = rtClips;
        try { animComp._defaultClip = rtClip; } catch (e) {}
        animComp.defaultClip = rtClip;
        if (args.playOnLoad != null) animComp.playOnLoad = !!args.playOnLoad;

        var trackCount = getAnimationTrackCount(rtClip);
        var keyframeCount = getAnimationKeyframeCount(rtClip);
        if (trackCount <= 0 || keyframeCount <= 0) throw new Error('Generated AnimationClip has no runtime tracks/keyframes');
        var serialized = args.returnContent === false ? null : serializeRuntimeAsset(rtClip);
        if (args.requireSerialized !== false && (!serialized || serialized.indexOf('_tracks') < 0)) {
          throw new Error('Generated AnimationClip could not be serialized with Cocos 3.8 _tracks');
        }

        return {
          success: true,
          action: 'create_from_runtime_tracks',
          nodeId: node.uuid,
          clipName: rtClip.name,
          duration: rtClip.duration,
          sample: rtClip.sample,
          clipCount: rtClips.length,
          defaultClip: animComp.defaultClip ? animComp.defaultClip.name : null,
          playOnLoad: !!animComp.playOnLoad,
          trackCount: trackCount,
          keyframeCount: keyframeCount,
          animatedPaths: builtPaths,
          missingPaths: [],
          serializedFormat: serialized && serialized.indexOf('_tracks') >= 0 ? 'cocos-3.8-tracks' : 'runtime-only',
          content: serialized,
        };
      }
      case 'clear': {
        var clearName = args.clipName || args.name || null;
        if (clearName) {
          animComp.clips = (animComp.clips || []).filter(function (c) { return c && c.name !== clearName; });
          if (animComp.defaultClip && animComp.defaultClip.name === clearName) animComp.defaultClip = null;
        } else {
          try { animComp._clips = []; } catch (e) {}
          animComp.clips = [];
          try { animComp._defaultClip = null; } catch (e) {}
          animComp.defaultClip = null;
        }
        return { success: true, action: 'clear', clipCount: (animComp.clips || []).length };
      }
      default:
        throw new Error('Unknown manage-animation-clip action: ' + action);
    }
  },

  // =========================================================================
  // manage-physics
  // =========================================================================
  'manage-physics'(args) {
    var action = args.action || 'list';
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    function numberOrNull(value) {
      if (value === undefined || value === null || value === '') return null;
      var n = Number(value);
      return isNaN(n) ? null : n;
    }

    function readProp(comp, key, fallback) {
      if (!comp) return fallback;
      if (comp[key] !== undefined) return comp[key];
      var privateKey = '_' + key;
      if (comp[privateKey] !== undefined) return comp[privateKey];
      return fallback;
    }

    function readVec(value, widthHeight) {
      if (!value) return null;
      if (Array.isArray(value)) return [numberOrNull(value[0]) || 0, numberOrNull(value[1]) || 0];
      if (typeof value === 'object') {
        var x = widthHeight ? (value.width !== undefined ? value.width : value.x) : (value.x !== undefined ? value.x : value.width);
        var y = widthHeight ? (value.height !== undefined ? value.height : value.y) : (value.y !== undefined ? value.y : value.height);
        return [numberOrNull(x) || 0, numberOrNull(y) || 0];
      }
      return null;
    }

    function makeVec2Value(value) {
      var xy = vec2(value, 0, 0);
      if (cc.Vec2) return new cc.Vec2(xy[0], xy[1]);
      return { x: xy[0], y: xy[1] };
    }

    function makeSizeValue(value) {
      var xy = vec2(value, 0, 0);
      if (cc.Size) return new cc.Size(xy[0], xy[1]);
      return { width: xy[0], height: xy[1] };
    }

    function setProps(comp, props) {
      if (!props) return;
      var remaining = {};
      var keys = Object.keys(props);
      for (var pi = 0; pi < keys.length; pi++) {
        var key = keys[pi];
        if (key === 'offset') comp.offset = makeVec2Value(props[key]);
        else if (key === 'size') comp.size = makeSizeValue(props[key]);
        else remaining[key] = props[key];
      }
      applyProperties(node, comp, remaining);
    }

    function readPhysicsComponent(comp, fallbackType) {
      var name = cc.js.getClassName(comp) || fallbackType || comp.constructor.name || '';
      var out = { type: name, uuid: comp.uuid, enabled: comp.enabled };
      if (/RigidBody2D/i.test(name)) {
        out.properties = {
          type: readProp(comp, 'type', null),
          enabledContactListener: !!readProp(comp, 'enabledContactListener', false),
          bullet: !!readProp(comp, 'bullet', false),
          awakeOnLoad: !!readProp(comp, 'awakeOnLoad', false),
          gravityScale: numberOrNull(readProp(comp, 'gravityScale', null)),
          linearDamping: numberOrNull(readProp(comp, 'linearDamping', null)),
          angularDamping: numberOrNull(readProp(comp, 'angularDamping', null)),
          fixedRotation: !!readProp(comp, 'fixedRotation', false),
          allowSleep: !!readProp(comp, 'allowSleep', false),
        };
      } else if (/Collider2D/i.test(name)) {
        out.properties = {
          sensor: !!readProp(comp, 'sensor', false),
          tag: numberOrNull(readProp(comp, 'tag', null)),
          group: numberOrNull(readProp(comp, 'group', null)),
          density: numberOrNull(readProp(comp, 'density', null)),
          friction: numberOrNull(readProp(comp, 'friction', null)),
          restitution: numberOrNull(readProp(comp, 'restitution', null)),
          offset: readVec(readProp(comp, 'offset', null), false),
        };
        if (/BoxCollider2D|CapsuleCollider2D/i.test(name)) out.properties.size = readVec(readProp(comp, 'size', null), true);
        if (/CircleCollider2D/i.test(name)) out.properties.radius = numberOrNull(readProp(comp, 'radius', null));
        if (/CapsuleCollider2D/i.test(name)) out.properties.direction = readProp(comp, 'direction', null);
        if (/PolygonCollider2D/i.test(name)) {
          var points = readProp(comp, 'points', null) || [];
          out.properties.points = Array.isArray(points) ? points.map(function (pt) { return readVec(pt, false); }).filter(Boolean) : [];
        }
      }
      return out;
    }

    function addOrUpdate(componentName, props) {
      var comp = getComponent(node, componentName);
      if (!comp) comp = addComponent(node, componentName);
      setProps(comp, props);
      return comp;
    }

    switch (action) {
      case 'add_rigidbody':
      case 'update_rigidbody': {
        var rbName = args.component || args.componentName || 'cc.RigidBody2D';
        var rb = addOrUpdate(rbName, args.properties);
        return { success: true, nodeId: node.uuid, component: cc.js.getClassName(rb) || rbName, readback: readPhysicsComponent(rb, rbName) };
      }
      case 'add_collider':
      case 'update_collider': {
        var shape = String(args.shape || args.collider || 'box').toLowerCase();
        var compName = args.component || args.componentName;
        if (!compName) {
          compName = shape === 'circle' ? 'cc.CircleCollider2D'
            : shape === 'polygon' ? 'cc.PolygonCollider2D'
            : shape === 'capsule' ? 'cc.CapsuleCollider2D'
            : 'cc.BoxCollider2D';
        }
        var collider = addOrUpdate(compName, args.properties);
        if (typeof collider.apply === 'function') {
          try { collider.apply(); } catch (e) {}
        }
        return { success: true, nodeId: node.uuid, component: cc.js.getClassName(collider) || compName, readback: readPhysicsComponent(collider, compName) };
      }
      case 'add_bundle': {
        var rb2 = addOrUpdate(args.rigidbodyComponent || 'cc.RigidBody2D', args.rigidbodyProperties || args.bodyProperties || {});
        var shape2 = String(args.shape || 'box').toLowerCase();
        var colliderName = args.colliderComponent || (shape2 === 'circle' ? 'cc.CircleCollider2D' : 'cc.BoxCollider2D');
        var col2 = addOrUpdate(colliderName, args.colliderProperties || {});
        if (typeof col2.apply === 'function') {
          try { col2.apply(); } catch (e2) {}
        }
        return {
          success: true,
          nodeId: node.uuid,
          rigidbody: cc.js.getClassName(rb2) || 'cc.RigidBody2D',
          collider: cc.js.getClassName(col2) || colliderName,
          rigidbodyReadback: readPhysicsComponent(rb2, args.rigidbodyComponent || 'cc.RigidBody2D'),
          colliderReadback: readPhysicsComponent(col2, colliderName),
        };
      }
      case 'list': {
        var result = [];
        var comps = node.components || [];
        for (var i = 0; i < comps.length; i++) {
          var name = cc.js.getClassName(comps[i]) || comps[i].constructor.name || '';
          if (/RigidBody|Collider/i.test(name)) result.push(readPhysicsComponent(comps[i], name));
        }
        return { components: result };
      }
      default:
        throw new Error('Unknown manage-physics action: ' + action);
    }
  },

  // =========================================================================
  // assign-material
  // =========================================================================
  'assign-material'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var materialUuid = args.materialUuid || args.material;
    if (!materialUuid) throw new Error('No material UUID specified');

    var requestedComponent = args.componentType || args.component || args.componentName || null;
    var renderer = requestedComponent ? getComponentByName(node, requestedComponent) : null;
    if (!renderer) {
      renderer = getComponent(node, 'cc.Sprite') ||
                 getComponent(node, 'cc.MeshRenderer') ||
                 getComponent(node, 'cc.Label');
    }
    if (!renderer) throw new Error('No renderer component found on node');

    var slotIndex = args.slot != null ? Number(args.slot) : 0;

    return new Promise(function (resolve, reject) {
      cc.assetManager.loadAny(materialUuid, function (err, asset) {
        if (err) {
          reject(new Error('Failed to load material: ' + err.message));
          return;
        }
        try {
          if (renderer.setMaterial) {
            renderer.setMaterial(asset, slotIndex);
          } else if (renderer.material != null) {
            renderer.material = asset;
          } else {
            reject(new Error('Cannot assign material to this renderer'));
            return;
          }
          if ('customMaterial' in renderer) {
            renderer.customMaterial = asset;
          } else if ('_customMaterial' in renderer) {
            renderer._customMaterial = asset;
          }
          var assigned = null;
          try {
            if (renderer.getSharedMaterial) {
              assigned = renderer.getSharedMaterial(slotIndex);
            } else if (renderer.getRenderMaterial) {
              assigned = renderer.getRenderMaterial(slotIndex);
            } else if (renderer.sharedMaterial) {
              assigned = renderer.sharedMaterial;
            } else {
              assigned = renderer.material;
            }
          } catch (e3) {}
          var assignedInfo = describeBoundValue(assigned);
          if (assignedInfo.assigned && String(assignedInfo.assigned) !== String(materialUuid)) {
            reject(new Error('Assigned material UUID mismatch: expected ' + materialUuid + ', got ' + assignedInfo.assigned));
            return;
          }
          resolve({
            success: true,
            nodeId: String(node.uuid || ''),
            rendererNodeUuid: String(node.uuid || ''),
            component: String(cc.js.getClassName(renderer) || renderer.constructor.name || requestedComponent || 'Renderer'),
            material: materialUuid,
            materialUuid: materialUuid,
            assignedMaterialUuid: assignedInfo.assigned || materialUuid,
            assignedMaterialName: assignedInfo.assignedName || null,
            slot: slotIndex
          });
        } catch (e) {
          reject(new Error('Error assigning material: ' + e.message));
        }
      });
    });
  },

  // =========================================================================
  // get-component-schema
  // =========================================================================
  'get-component-schema'(args) {
    var compName = args.component || args.componentName || args.componentType;
    if (!compName) throw new Error('No component name specified');

    // Try to find an existing instance on a node, or create a temp node
    var nodeId = getNodeArg(args);
    var comp = null;

    if (nodeId) {
      var node = findNodeByPath(nodeId);
      if (node) comp = getComponentByName(node, compName);
    }

    // If no instance, try to create a temporary one to inspect
    var tempNode = null;
    if (!comp) {
      try {
        tempNode = new cc.Node('__schema_temp__');
        comp = tempNode.addComponent(compName);
      } catch (e) {
        if (tempNode) tempNode.destroy();
        throw new Error('Cannot instantiate component: ' + compName);
      }
    }

    var schema = {
      type: cc.js.getClassName(comp) || comp.constructor.name || compName,
      properties: {}
    };

    try {
      // Enumerate accessible properties
      var allKeys = Object.keys(comp);
      // Also check prototype
      var proto = Object.getPrototypeOf(comp);
      if (proto) {
        var descriptors = Object.getOwnPropertyDescriptors(proto);
        for (var dk in descriptors) {
          if (allKeys.indexOf(dk) === -1 && dk.charAt(0) !== '_') allKeys.push(dk);
        }
      }

      for (var i = 0; i < allKeys.length; i++) {
        var key = allKeys[i];
        if (key.charAt(0) === '_') continue;
        if (key === 'constructor' || key === 'node' || key === 'uuid') continue;
        try {
          var val = comp[key];
          var t = typeof val;
          if (t === 'function') continue;
          schema.properties[key] = {
            type: t,
            value: (t === 'string' || t === 'number' || t === 'boolean') ? val : String(val)
          };
        } catch (e) {}
      }
    } finally {
      if (tempNode) tempNode.destroy();
    }

    return schema;
  },

  // =========================================================================
  // manage-vfx
  // =========================================================================
  'manage-vfx'(args) {
    var action = args.action || 'list';
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    // In 3.8, 2D particles use ParticleSystem2D
    var ps = getComponent(node, 'cc.ParticleSystem2D') || getComponent(node, 'cc.ParticleSystem');

    switch (action) {
      case 'play': {
        if (!ps) throw new Error('No ParticleSystem component found');
        ps.resetSystem();
        return { success: true, action: 'play' };
      }
      case 'stop': {
        if (!ps) throw new Error('No ParticleSystem component found');
        ps.stopSystem();
        return { success: true, action: 'stop' };
      }
      case 'create': {
        var is2D = args.is2D !== false; // default to 2D
        if (is2D) {
          var ps2d = getComponent(node, 'cc.ParticleSystem2D');
          if (!ps2d) {
            ps2d = addComponent(node, 'cc.ParticleSystem2D');
          }
          if (args.properties) {
            var pKeys = Object.keys(args.properties);
            for (var pi = 0; pi < pKeys.length; pi++) {
              try { ps2d[pKeys[pi]] = args.properties[pKeys[pi]]; } catch (e) {}
            }
          }
          return { success: true, action: 'create', type: 'ParticleSystem2D' };
        } else {
          var ps3d = getComponent(node, 'cc.ParticleSystem');
          if (!ps3d) {
            ps3d = addComponent(node, 'cc.ParticleSystem');
          }
          if (args.properties) {
            var p3Keys = Object.keys(args.properties);
            for (var p3i = 0; p3i < p3Keys.length; p3i++) {
              try { ps3d[p3Keys[p3i]] = args.properties[p3Keys[p3i]]; } catch (e) {}
            }
          }
          return { success: true, action: 'create', type: 'ParticleSystem' };
        }
      }
      case 'add_particle':
      case 'update': {
        if (!ps) {
          ps = addComponent(node, 'cc.ParticleSystem2D');
        }
        if (args.properties) {
          applyProperties(node, ps, args.properties);
        }
        return { nodeId: node.uuid, component: cc.js.getClassName(ps) || 'ParticleSystem2D', action: action };
      }
      case 'bind_file': {
        if (!ps) ps = addComponent(node, 'cc.ParticleSystem2D');
        var particleUuid = args.assetUuid || args.uuid;
        if (!particleUuid) throw new Error('assetUuid or uuid is required');
        return new Promise(function (resolve, reject) {
          cc.assetManager.loadAny({ uuid: particleUuid }, function (err, asset) {
            if (err) return reject(err);
            if (!asset) return reject(new Error('Particle asset not loaded: ' + particleUuid));
            try { ps.file = asset; } catch (e) { return reject(e); }
            function finish(spriteFrame) {
              try {
                if (spriteFrame) {
                  ps.spriteFrame = spriteFrame;
                  ps._spriteFrame = spriteFrame;
                } else if (args.clearSpriteFrame) {
                  ps.spriteFrame = null;
                  ps._spriteFrame = null;
                }
              } catch (e) {
                return reject(e);
              }
              if (args.properties) applyProperties(node, ps, args.properties);
              try {
                if (ps.resetSystem) ps.resetSystem();
              } catch (resetError) {}
              resolve({
                success: true,
                action: 'bind_file',
                nodeId: node.uuid,
                component: cc.js.getClassName(ps) || 'ParticleSystem2D',
                fileUuid: asset.uuid || particleUuid,
                fileName: asset.name || null,
                spriteFrameUuid: spriteFrame ? spriteFrame.uuid : null,
                spriteFrameName: spriteFrame ? spriteFrame.name : null,
                hasFile: !!ps.file,
                hasSpriteFrame: !!(ps.spriteFrame || ps._spriteFrame),
              });
            }
            var spriteFrameUuid = args.spriteFrameUuid || null;
            if (!spriteFrameUuid) return finish(null);
            cc.assetManager.loadAny({ uuid: spriteFrameUuid }, function (frameErr, spriteFrame) {
              if (frameErr) return reject(frameErr);
              finish(spriteFrame || null);
            });
          });
        });
      }
      case 'reset': {
        if (!ps) throw new Error('No ParticleSystem component found');
        ps.resetSystem();
        return { success: true, action: 'reset' };
      }
      case 'get_state': {
        if (!ps) throw new Error('No ParticleSystem component found');
        var currentFile = null;
        var currentSpriteFrame = null;
        try { currentFile = ps.file || ps._file || null; } catch (e) {}
        try { currentSpriteFrame = ps.spriteFrame || ps._spriteFrame || null; } catch (e2) {}
        return {
          nodeId: node.uuid,
          active: node.active,
          enabled: ps.enabled,
          fileUuid: currentFile ? (currentFile.uuid || currentFile._uuid || null) : null,
          fileName: currentFile ? (currentFile.name || null) : null,
          spriteFrameUuid: currentSpriteFrame ? (currentSpriteFrame.uuid || currentSpriteFrame._uuid || null) : null,
          spriteFrameName: currentSpriteFrame ? (currentSpriteFrame.name || null) : null,
          hasFile: !!currentFile,
          hasSpriteFrame: !!currentSpriteFrame,
          totalParticles: ps.totalParticles,
          emissionRate: ps.emissionRate,
          duration: ps.duration,
          life: ps.life,
          angle: ps.angle,
          startSize: ps.startSize,
          endSize: ps.endSize,
          positionType: ps.positionType,
          autoRemoveOnFinish: ps.autoRemoveOnFinish,
        };
      }
      case 'list': {
        var result = [];
        function findParticleSystems(n) {
          var p2d = getComponent(n, 'cc.ParticleSystem2D');
          var p3d = getComponent(n, 'cc.ParticleSystem');
          if (p2d) result.push({ node: n.name, uuid: n.uuid, type: 'ParticleSystem2D' });
          if (p3d) result.push({ node: n.name, uuid: n.uuid, type: 'ParticleSystem' });
          var kids = n.children || [];
          for (var ci = 0; ci < kids.length; ci++) findParticleSystems(kids[ci]);
        }
        findParticleSystems(node);
        return { particles: result };
      }
      default:
        throw new Error('Unknown manage-vfx action: ' + action);
    }
  },

  // =========================================================================
  // create-prefab (disabled 鈥?requires Editor asset DB access from main process)
  // =========================================================================
  'create-prefab'(args) {
    // In 3.8, prefab creation/saving requires the asset database which is not
    // accessible from the scene script context. This must be handled in the
    // main process via Editor.Message.request('asset-db', ...).
    throw new Error('create-prefab is not available from the scene script in 3.8. Use the main process to create prefab assets via Editor.Message.');
  },

  // =========================================================================
  // save-prefab (disabled 鈥?requires Editor asset DB access)
  // =========================================================================
  'save-prefab'(args) {
    throw new Error('save-prefab is not available from the scene script in 3.8. Use the main process to save prefab assets via Editor.Message.');
  },

  // =========================================================================
  // close-prefab
  // =========================================================================
  'close-prefab'(args) {
    // In 3.8, prefab editing mode is managed by the editor. From scene script
    // context, we cannot directly close prefab mode. Return a note.
    return {
      success: false,
      message: 'close-prefab must be handled from the main process via Editor.Message in 3.8.'
    };
  },

  // =========================================================================
  // instantiate-prefab
  // =========================================================================
  'instantiate-prefab'(args) {
    var prefabUuid = args.uuid || args.prefabUuid || args.prefab;
    if (!prefabUuid) throw new Error('No prefab UUID specified');

    var parentId = args.parent || args.parentUuid || args.parentId;
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');

    var parent = parentId ? findNodeByPath(parentId) : null;
    if (!parent) {
      var kids = scene.children || [];
      parent = kids.length > 0 ? kids[0] : scene;
    }

    return new Promise(function (resolve, reject) {
      cc.assetManager.loadAny(prefabUuid, function (err, prefab) {
        if (err) {
          reject(new Error('Failed to load prefab: ' + err.message));
          return;
        }
        try {
          var instance = cc.instantiate(prefab);
          var registeredPrefabLink = null;
          try {
            if (typeof EditorExtends !== 'undefined' && EditorExtends.PrefabUtils && typeof EditorExtends.PrefabUtils.addPrefabInstance === 'function') {
              EditorExtends.PrefabUtils.addPrefabInstance(instance);
              registeredPrefabLink = getNodePrefabLink(instance);
            }
          } catch (registerError) {
            registeredPrefabLink = { error: registerError.message || String(registerError) };
          }
          if (args.name) setNodeName(instance, args.name);
          instance.parent = parent;
          if (args.position) {
            var instancePos = vec3(args.position, 0, 0, 0);
            instance.setPosition(instancePos[0], instancePos[1], instancePos[2]);
          }
          var state = serializeNodeState(instance, true, true);
          if (!state.prefabLink && registeredPrefabLink) state.prefabLink = registeredPrefabLink;
          state.registeredPrefabLink = registeredPrefabLink;
          resolve(state);
        } catch (e) {
          reject(new Error('Failed to instantiate prefab: ' + e.message));
        }
      });
    });
  },

  // =========================================================================
  // find-gameobjects
  // =========================================================================
  'find-gameobjects'(args) {
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');

    var name = args.name;
    var component = args.component || args.componentName;
    var tag = args.tag;
    var active = args.active; // undefined means any
    var maxResults = args.maxResults || 100;

    var results = [];

    function search(node, path) {
      if (results.length >= maxResults) return;

      var match = true;

      if (name != null) {
        if (args.exactMatch) {
          if (node.name !== name) match = false;
        } else {
          if (node.name.toLowerCase().indexOf(name.toLowerCase()) === -1) match = false;
        }
      }

      if (match && component) {
        var found = getComponentByName(node, component);
        if (!found) match = false;
      }

      if (match && active != null) {
        if (node.active !== active) match = false;
      }

      if (match && name == null && component == null && tag == null && active == null) {
        // No filters 鈥?include all
      }

      if (match) {
        results.push({
          uuid: node.uuid,
          name: node.name,
          path: path,
          active: node.active,
          childrenCount: node.children.length
        });
      }

      var kids = node.children || [];
      for (var i = 0; i < kids.length; i++) {
        search(kids[i], path + '/' + kids[i].name);
      }
    }

    search(scene, scene.name);
    return { results: results, total: results.length };
  },

  // =========================================================================
  // find-references
  // =========================================================================
  'find-references'(args) {
    var targetId = args.uuid || args.node || args.targetId;
    if (!targetId) throw new Error('No target UUID specified');

    var targetType = args.targetType || 'auto';
    var additionalIds = args.additionalIds || [];

    var targetNode = findNodeByPath(targetId);
    var scene = cc.director.getScene();
    if (!scene) throw new Error('No scene loaded');

    var detectedType = targetType;
    if (targetType === 'auto') {
      detectedType = targetNode ? 'node' : 'asset';
    }

    // Build UUID variants (compressed/decompressed)
    var targetVariants = [targetId];
    try {
      if (typeof Editor !== 'undefined' && Editor.Utils && Editor.Utils.UuidUtils) {
        var compressed = Editor.Utils.UuidUtils.compressUuid(targetId);
        var decompressed = Editor.Utils.UuidUtils.decompressUuid(targetId);
        if (compressed && compressed !== targetId) targetVariants.push(compressed);
        if (decompressed && decompressed !== targetId) targetVariants.push(decompressed);
      }
    } catch (e) {}

    if (Array.isArray(additionalIds)) {
      for (var ai = 0; ai < additionalIds.length; ai++) {
        var aid = additionalIds[ai];
        if (targetVariants.indexOf(aid) === -1) targetVariants.push(aid);
        try {
          if (typeof Editor !== 'undefined' && Editor.Utils && Editor.Utils.UuidUtils) {
            var ac = Editor.Utils.UuidUtils.compressUuid(aid);
            var ad = Editor.Utils.UuidUtils.decompressUuid(aid);
            if (ac && targetVariants.indexOf(ac) === -1) targetVariants.push(ac);
            if (ad && targetVariants.indexOf(ad) === -1) targetVariants.push(ad);
          }
        } catch (e) {}
      }
    }

    var references = [];

    function matchesTarget(val) {
      if (!val) return false;
      // Direct node match
      if (targetNode && val === targetNode) return true;
      // UUID match with variants
      var uuid = val.uuid || val._uuid || '';
      if (uuid) {
        for (var vi = 0; vi < targetVariants.length; vi++) {
          if (uuid === targetVariants[vi]) return true;
        }
      }
      // String match
      if (typeof val === 'string') {
        for (var si = 0; si < targetVariants.length; si++) {
          if (val === targetVariants[si]) return true;
        }
      }
      return false;
    }

    function searchNode(node) {
      var comps = node.components || [];
      for (var ci = 0; ci < comps.length; ci++) {
        var comp = comps[ci];
        var compType = cc.js.getClassName(comp) || comp.constructor.name || 'Unknown';
        try {
          var keys = Object.keys(comp);
          for (var ki = 0; ki < keys.length; ki++) {
            var k = keys[ki];
            if (k.charAt(0) === '_') continue;
            if (k === 'node' || k === 'uuid' || k === 'name') continue;
            try {
              var val = comp[k];
              if (val === null || val === undefined) continue;
              if (matchesTarget(val)) {
                references.push({
                  nodeId: node.uuid, nodeName: node.name,
                  component: compType, componentIndex: ci,
                  property: k
                });
                continue;
              }
              // Check arrays (EventHandler, asset arrays, etc.)
              if (Array.isArray(val)) {
                for (var arrI = 0; arrI < val.length; arrI++) {
                  if (matchesTarget(val[arrI])) {
                    references.push({
                      nodeId: node.uuid, nodeName: node.name,
                      component: compType, componentIndex: ci,
                      property: k + '[' + arrI + ']'
                    });
                  }
                  // EventHandler target check
                  if (val[arrI] && typeof val[arrI] === 'object' && val[arrI].target) {
                    if (matchesTarget(val[arrI].target)) {
                      references.push({
                        nodeId: node.uuid, nodeName: node.name,
                        component: compType, componentIndex: ci,
                        property: k + '[' + arrI + '].target'
                      });
                    }
                  }
                }
              }
            } catch (e) {}
          }
        } catch (e) {}
      }

      var kids = node.children || [];
      for (var i = 0; i < kids.length; i++) {
        searchNode(kids[i]);
      }
    }

    searchNode(scene);
    return {
      targetId: targetId,
      targetType: detectedType,
      referenceCount: references.length,
      references: references,
      total: references.length
    };
  },

  // =========================================================================
  // inspect-runtime-node
  // =========================================================================
  'inspect-runtime-node'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var pos = node.getPosition();
    var scl = node.getScale();
    var rot = node.eulerAngles;
    var worldPos = node.worldPosition;

    var data = {
      uuid: node.uuid,
      name: node.name,
      active: node.active,
      activeInHierarchy: node.activeInHierarchy,
      layer: node.layer,
      // Local transform
      localPosition: [toFixed3(pos.x), toFixed3(pos.y), toFixed3(pos.z)],
      localScale: [toFixed3(scl.x), toFixed3(scl.y), toFixed3(scl.z)],
      localRotation: [toFixed3(rot.x), toFixed3(rot.y), toFixed3(rot.z)],
      angle: node.angle,
      // World transform
      worldPosition: [toFixed3(worldPos.x), toFixed3(worldPos.y), toFixed3(worldPos.z)],
      // Hierarchy
      parent: node.parent ? { uuid: node.parent.uuid, name: node.parent.name } : null,
      childrenCount: node.children.length,
      siblingIndex: node.getSiblingIndex(),
      // UITransform
      size: getNodeSize(node),
      anchor: getNodeAnchor(node),
      // Opacity
      opacity: getNodeOpacity(node),
      // Color
      color: getNodeColor(node)
    };

    // Component details
    data.components = (node.components || []).map(function (c) {
      var className = cc.js.getClassName(c) || c.constructor.name || 'Unknown';
      var info = { type: className, uuid: c.uuid, enabled: c.enabled, properties: {} };
      try {
        var keys = Object.keys(c);
        for (var ki = 0; ki < keys.length; ki++) {
          var k = keys[ki];
          if (k.charAt(0) === '_') continue;
          if (k === 'node' || k === 'constructor') continue;
          try {
            var val = c[k];
            var t = typeof val;
            if (t === 'function') continue;
            if (t === 'string' || t === 'number' || t === 'boolean') {
              info.properties[k] = val;
            } else if (val && val.uuid) {
              info.properties[k] = { uuid: val.uuid, type: cc.js.getClassName(val) || typeof val };
            }
          } catch (e) {}
        }
      } catch (e) {}
      return info;
    });

    return data;
  },

  // =========================================================================
  // call-component-method
  // =========================================================================
  'call-component-method'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var compName = args.component || args.componentName || args.componentType;
    var methodName = args.method || args.methodName;
    if (!methodName) throw new Error('No method name specified');

    var comp = null;
    if (compName) {
      comp = getComponentByName(node, compName);
    } else {
      // Try to find the method on any component
      var comps = node.components || [];
      for (var i = 0; i < comps.length; i++) {
        if (typeof comps[i][methodName] === 'function') {
          comp = comps[i];
          break;
        }
      }
    }

    if (!comp) throw new Error('Component not found' + (compName ? ': ' + compName : ''));
    if (typeof comp[methodName] !== 'function') throw new Error('Method not found: ' + methodName);

    var methodArgs = args.args || args.arguments || [];
    if (!Array.isArray(methodArgs)) methodArgs = [methodArgs];

    var result;
    try {
      result = comp[methodName].apply(comp, methodArgs);
    } catch (e) {
      throw new Error('Method call failed: ' + e.message);
    }

    // Try to serialize the result
    var serializedResult;
    try {
      var t = typeof result;
      if (result == null || t === 'string' || t === 'number' || t === 'boolean') {
        serializedResult = result;
      } else {
        serializedResult = JSON.parse(JSON.stringify(result));
      }
    } catch (e) {
      serializedResult = String(result);
    }

    return { success: true, result: serializedResult };
  },

  // =========================================================================
  // simulate-ui-event
  // =========================================================================
  'simulate-ui-event'(args) {
    var nodeId = getNodeArg(args);
    var node = findNodeByPath(nodeId);
    if (!node) throw new Error('Node not found: ' + nodeId);

    var eventType = args.event || args.eventType || 'click';

    // In 3.8, we can dispatch events via node.emit or the Input system
    switch (eventType) {
      case 'click': {
        // Trigger button click if Button component exists
        var button = getComponent(node, 'cc.Button');
        if (button && button.clickEvents) {
          for (var i = 0; i < button.clickEvents.length; i++) {
            var handler = button.clickEvents[i];
            if (handler) {
              try {
                var targetNode = findNodeByPath(handler.target && handler.target.uuid ? handler.target.uuid : handler._componentId);
                if (targetNode) {
                  var targetComp = getComponentByName(targetNode, handler.component);
                  if (targetComp && typeof targetComp[handler.handler] === 'function') {
                    targetComp[handler.handler].call(targetComp, button, handler.customEventData);
                  }
                }
              } catch (e) {}
            }
          }
        }
        // Also emit the touch-end event
        try {
          node.emit(cc.Node.EventType.TOUCH_END, {
            getLocation: function () { return new cc.Vec2(0, 0); },
            touch: null,
            bubbles: true
          });
        } catch (e) {}
        return { success: true, event: 'click', node: node.name };
      }
      case 'touch-start': {
        var pos = args.position || [0, 0];
        try {
          node.emit(cc.Node.EventType.TOUCH_START, {
            getLocation: function () { return new cc.Vec2(pos[0], pos[1]); },
            touch: null,
            bubbles: true
          });
        } catch (e) {}
        return { success: true, event: 'touch-start', node: node.name };
      }
      case 'touch-end': {
        var pos2 = args.position || [0, 0];
        try {
          node.emit(cc.Node.EventType.TOUCH_END, {
            getLocation: function () { return new cc.Vec2(pos2[0], pos2[1]); },
            touch: null,
            bubbles: true
          });
        } catch (e) {}
        return { success: true, event: 'touch-end', node: node.name };
      }
      case 'touch-move': {
        var pos3 = args.position || [0, 0];
        try {
          node.emit(cc.Node.EventType.TOUCH_MOVE, {
            getLocation: function () { return new cc.Vec2(pos3[0], pos3[1]); },
            touch: null,
            bubbles: true
          });
        } catch (e) {}
        return { success: true, event: 'touch-move', node: node.name };
      }
      case 'toggle': {
        var toggle = getComponent(node, 'cc.Toggle');
        if (toggle) {
          toggle.isChecked = !toggle.isChecked;
          try { node.emit('toggle', toggle); } catch (e) {}
        }
        return { success: true, event: 'toggle', node: node.name, isChecked: toggle ? toggle.isChecked : null };
      }
      case 'slider': {
        var slider = getComponent(node, 'cc.Slider');
        if (slider && args.value != null) {
          slider.progress = Number(args.value);
          try { node.emit('slide', slider); } catch (e) {}
        }
        return { success: true, event: 'slider', node: node.name, progress: slider ? slider.progress : null };
      }
      case 'editbox-submit':
      case 'editbox': {
        var editBox = getComponent(node, 'cc.EditBox');
        if (editBox && args.value != null) {
          editBox.string = String(args.value);
          try { node.emit('editing-did-ended', editBox); } catch (e) {}
        }
        return { success: true, event: 'editbox', node: node.name, string: editBox ? editBox.string : null };
      }
      default:
        // Generic event emit
        try {
          node.emit(eventType, args.data || {});
        } catch (e) {}
        return { success: true, event: eventType, node: node.name };
    }
  }

};

// ---------------------------------------------------------------------------
// Lifecycle hooks
// ---------------------------------------------------------------------------
exports.load = function () {
  // Scene script loaded
};

exports.unload = function () {
  // Scene script unloaded
};

