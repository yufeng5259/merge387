const fs = require('fs');

const auditPath = 'docs/generated/script-migration-20260722/parity-16-method-ast-1502.json';
const outputPath = 'docs/generated/script-migration-20260722/parity-16-method-adjudicated-1502.json';
const baselinePath = 'docs/generated/script-migration-20260722/parity-16-reviewed-delta-baseline-1502.json';
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : { entries: [] };
const baselineByKey = new Map(baseline.entries.map((entry) => [entry.key, entry]));
const targetRoot = 'assets/Script';

const apiCallEquivalences = {
  runAction: 'Cocos 3 tween(...).start()', stopAllActions: 'tween(node).stop()',
  sequence: 'chained tween steps', spawn: 'tween parallel/union composition',
  moveTo: 'tween.to position', scaleTo: 'tween.to scale', fadeIn: 'UIOpacity tween', fadeOut: 'UIOpacity tween',
  loadRes: 'resources.load or bundle.load', loadBundle: 'assetManager.loadBundle',
  getWorldToScreenPoint: 'Camera.worldToScreen', getScreenToWorldPoint: 'Camera.screenToWorld',
  getCameraToWorldPoint: 'Camera.screenToWorld', setPosition: 'Node.setPosition',
  v2: 'new Vec2/new Vec3', v3: 'new Vec3', color: 'new Color',
  callFunc: 'tween.call or direct callback', fadeTo: 'UIOpacity tween', jumpTo: 'position tween sequence',
  moveBy: 'position tween', bezierTo: 'position tween path', rotateBy: 'angle tween', repeat: 'tween.repeat',
  repeatForever: 'tween.repeatForever', delayTime: 'tween.delay', easeBackOut: 'Cocos 3 easing string/function',
  easeElasticOut: 'Cocos 3 easing string/function', easeOut: 'Cocos 3 easing string/function', easeIn: 'Cocos 3 easing string/function',
  easeInOut: 'Cocos 3 easing string/function', easing: 'Cocos 3 tween easing option',
  convertToWorldSpaceAR: 'UITransform.convertToWorldSpaceAR', convertToNodeSpaceAR: 'UITransform.convertToNodeSpaceAR',
  getChildrenCount: 'Node.children.length', setTag: 'explicit tween/node ownership', stopActionByTag: 'tween(node).stop()',
  getAnchorPoint: 'UITransform.anchorPoint', setAnchorPoint: 'UITransform.setAnchorPoint', setContentSize: 'UITransform.setContentSize',
  getBoundingBoxToWorld: 'UITransform.getBoundingBoxToWorld', getOriginalSize: 'SpriteFrame.originalSize', getRect: 'SpriteFrame.rect',
  rect: 'Rect constructor/object', intersects: 'Rect.intersects',
  mag: 'Vec length()', sub: 'Vec subtract()', mul: 'Vec multiplyScalar()', add: 'Vec add()', normalizeSelf: 'Vec normalize()',
  bind: 'lexical arrow callback', callStaticMethod: 'NativeWrap bridge helper', getAndroidBundleCall: 'NativeWrap Android bundle bridge',
};
const languageCalls = new Set(['String', 'Number', 'parseInt', 'parseFloat', 'isFinite', 'isNaN', 'now', 'random', 'min', 'max', 'floor', 'ceil', 'round', 'abs', 'keys', 'values', 'assign', 'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'concat', 'indexOf', 'includes', 'filter', 'map', 'find', 'forEach', 'sort', 'apply', 'format', 't']);
const intentionalCallOmissions = new Set(['log', 'Log', 'Debug', 'Warning', 'error', 'warn']);
const manualStateEquivalences = {
  'game/map/MapElementNode': { _upgradeIconClickNode: '_upgradeIconClickNodes', levelNode: 'typed local/component reference' },
  'game/map/MapNode': { _buildLoadUserCoin: 'source write is never read', buildNode: '@property buildNode' },
  'game/merge/LevelMergeNode': { _visualRefreshHandler: '_visualRefreshDone', _visualRefreshScheduled: '_visualRefreshQueue scheduler', _floatingMergeItemNodes: 'typed floating-node tracking' },
  'game/merge/MergeUI': { _showEmptyTaskGuideFromEvent: '_emptyTaskGuideEventShowCallback', scheduleOnce: 'Component.scheduleOnce method' },
  'GameKit/ui/CoinFlyToTargetAnim': { _flyPool: 'flyPool', _flyPools: 'flyPools', _flyPrototypeNode: 'flyPrototypeNode', spineAnim: 'typed method-local Spine reference' },
  'window/Other/MergeTutorialWindow': { guideInputBlockers: 'typed guideInputBlockers field' },
  'window/UserInfoModel': { currentShowAp: 'currentShowAp field initializer', _pendingResourceNumAnims: 'typed pending animation map' },
};
const fileProtocolRationales = {
  'game/map/MapElementNode': 'Cocos 3 typed view-cache, multi-node click binding, Spine attachment and effect lifecycle replace Cocos 2 node/action helpers.',
  'game/map/MapNode': 'Cocos 3 Promise prefab loading, explicit build queue/timer ownership and UITransform/UIOpacity rendering preserve map load/visibility behavior.',
  'game/map/TownUpgradeFlow': 'Target is generated from the live source with UITransform/Vec/Node/Sprite API substitutions.',
  'game/map/UserMap': 'Class migration preserves reward parsing and build-context calls; prototype methods become class methods.',
  'game/merge/LevelMergeNode': 'Queued visual refresh, stable sibling-order helpers and Cocos 3 tween/vector APIs replace old action/callback scheduling.',
  'game/merge/MergeDes': 'Typed metadata/content helpers and UITransform geometry replace dynamic source helpers.',
  'game/merge/MergeUI': 'Promise claim transaction, P5 tutorial begin/cancel/prepare/claimed protocol, async guide loading and typed UI helpers preserve source side effects.',
  'game/mergeTutorial/MergeTutorialManager': 'Target is generated from live source with explicit Cocos 3 Camera/UITransform/Vec/Color substitutions.',
  'game/user/LevelUpDisplayLock': 'Target is generated from live source; no feature delta remains.',
  'GameKit/ui/CoinFlyToTargetAnim': 'NodePool ownership, typed resource profiles and Cocos 3 tween/vector helpers replace old action nodes while preserving callbacks and target feedback.',
  'Web/MergeOrderLogic': 'Target is generated from live source; no feature delta remains.',
  'Web/NetRequest': 'Full request-body diagnostics are intentionally omitted for the explicit privacy requirement; request and callback behavior is unchanged.',
  'window/GameMainWindow': 'Typed node/badge helpers and tutorial gate methods preserve entry visibility, events and window-open side effects.',
  'window/LoginWindow': 'Cocos 3 scheduling and native bridge helpers replace old platform calls while preserving login transition callbacks.',
  'window/Other/MergeTutorialWindow': 'Graphics/Mask/UITransform/Tween helpers replace old actions and private mask hooks; skip, highlight and generator reward protocols remain connected.',
  'window/UserInfoModel': 'Typed sprite/resource animation helpers plus explicit LevelUpDisplayLock guards preserve registration, AP countdown and display-freeze side effects.',
};

function targetFile(rel) { return `${targetRoot}/${rel}.ts`; }
function normalizeIdentifier(value) { return String(value).replace(/^_+/, '').toLowerCase(); }
function featureIndex(methods, key) {
  const result = new Map();
  for (const row of methods) for (const value of row.target?.[key] || []) {
    if (!result.has(value)) result.set(value, []);
    result.get(value).push(row.method);
  }
  return result;
}
function reachableMethods(start, methodsByName) {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const name = queue.shift();
    const row = methodsByName.get(name);
    for (const call of row?.target?.calls || []) if (methodsByName.has(call) && !seen.has(call)) {
      seen.add(call); queue.push(call);
    }
  }
  return seen;
}

let unreviewed = 0;
let dispositions = 0;
function deltaKey(file, row, category, item) {
  return [file.rel, row.method, category, item, row.source.bodySha256, row.target.bodySha256].join('|');
}
for (const file of audit.report) {
  const text = fs.readFileSync(targetFile(file.rel), 'utf8');
  const methodsByName = new Map(file.methods.map((row) => [row.method, row]));
  const indexes = Object.fromEntries(['stateWrites', 'calls', 'events', 'timers', 'resources'].map((key) => [key, featureIndex(file.methods, key)]));
  const stateNames = new Set([...text.matchAll(/\b(?:this\.)?([A-Za-z_$][\w$]*)\b/g)].map((match) => normalizeIdentifier(match[1])));
  for (const row of file.methods) {
    row.dispositions = [];
    if (row.status !== 'mapped') {
      row.dispositions.push({ category: 'method', item: row.method, disposition: 'defect', evidence: 'No target method mapping.' });
      unreviewed++; continue;
    }
    const reachable = reachableMethods(row.method, methodsByName);
    function resolve(key, category) {
      for (const item of row.delta?.[key] || []) {
        let disposition = null;
        let evidence = null;
        if (category === 'state') {
          const manual = manualStateEquivalences[file.rel]?.[item];
          if (manual) { disposition = 'renamed-or-typed-state'; evidence = manual; }
          else if (stateNames.has(normalizeIdentifier(item))) { disposition = 'field-initializer-or-typed-state'; evidence = `Target declares/references ${item} (normalized identifier match).`; }
        }
        if (!disposition && category === 'call' && apiCallEquivalences[item]) { disposition = 'cocos3-api-mapping'; evidence = apiCallEquivalences[item]; }
        if (!disposition && category === 'call' && languageCalls.has(item)) { disposition = 'language-or-library-equivalent'; evidence = `Equivalent TypeScript/standard-library operation for ${item}.`; }
        if (!disposition && category === 'call' && intentionalCallOmissions.has(item)) { disposition = 'non-business-diagnostic-omission'; evidence = 'Diagnostic call has no state/protocol side effect.'; }
        if (!disposition) {
          const locations = indexes[category === 'state' ? 'stateWrites' : category === 'call' ? 'calls' : category === 'event' ? 'events' : category === 'timer' ? 'timers' : 'resources'].get(item) || [];
          const reachableLocation = locations.find((name) => reachable.has(name));
          if (reachableLocation) { disposition = 'moved-to-reachable-helper'; evidence = `${row.targetMethod} -> ${reachableLocation}`; }
          else if (locations.length) { disposition = 'moved-to-file-protocol-owner'; evidence = `Target method(s): ${locations.join(', ')}`; }
        }
        if (!disposition && category === 'resource' && text.includes(item)) { disposition = 'resource-retained-in-target'; evidence = `Literal retained in ${targetFile(file.rel)}`; }
        if (!disposition && category === 'resource' && !/[/.]/.test(item)) { disposition = 'diagnostic-string-not-resource-path'; evidence = 'String was conservatively detected by keyword but is not a loadable path.'; }
        const key = deltaKey(file, row, category, item);
        if (!disposition && baselineByKey.has(key)) {
          disposition = 'hash-bound-reviewed-delta';
          evidence = baselineByKey.get(key).evidence;
        }
        if (!disposition) {
          disposition = 'unreviewed'; evidence = 'No explicit API, state, helper, protocol-owner, or hash-bound reviewed mapping found.'; unreviewed++;
        }
        dispositions++;
        row.dispositions.push({ category, item, disposition, evidence });
      }
    }
    resolve('stateWritesMissing', 'state'); resolve('callsMissing', 'call'); resolve('eventsMissing', 'event');
    resolve('timersMissing', 'timer'); resolve('resourcesMissing', 'resource');
    function resolveAdded(key, category) {
      for (const item of row.delta?.[key] || []) {
        let disposition = null;
        let evidence = null;
        if (category === 'state' && stateNames.has(normalizeIdentifier(item))) {
          disposition = 'target-added-typed-state'; evidence = `Target explicitly declares/references added state ${item}.`;
        }
        if (!disposition && category === 'call' && languageCalls.has(item)) {
          disposition = 'target-added-language-operation'; evidence = `TypeScript/standard-library operation ${item}.`;
        }
        if (!disposition && category === 'call' && Object.values(apiCallEquivalences).some((value) => value.includes(item))) {
          disposition = 'target-added-cocos3-api'; evidence = `Cocos 3 side of an explicit API mapping: ${item}.`;
        }
        const reviewCategory = `${category}-added`;
        const reviewKey = deltaKey(file, row, reviewCategory, item);
        if (!disposition && baselineByKey.has(reviewKey)) {
          disposition = 'hash-bound-reviewed-target-addition'; evidence = baselineByKey.get(reviewKey).evidence;
        }
        if (!disposition) {
          disposition = 'unreviewed'; evidence = 'Target-added feature lacks a hash-bound reviewed mapping.'; unreviewed++;
        }
        dispositions++;
        row.dispositions.push({ category: reviewCategory, item, disposition, evidence });
      }
    }
    resolveAdded('stateWritesAdded', 'state'); resolveAdded('callsAdded', 'call'); resolveAdded('eventsAdded', 'event');
    resolveAdded('timersAdded', 'timer'); resolveAdded('resourcesAdded', 'resource');
    const metricDelta = row.delta?.metrics || {};
    for (const [metric, value] of Object.entries(metricDelta)) if (value !== 0) {
      dispositions++;
      const key = deltaKey(file, row, 'control-flow', metric);
      const reviewed = baselineByKey.get(key);
      if (!reviewed) {
        unreviewed++;
      }
      row.dispositions.push({ category: 'control-flow', item: metric, disposition: reviewed ? 'hash-bound-reviewed-delta' : 'unreviewed', evidence: reviewed?.evidence || `Target minus source ${metric}: ${value}; no hash-bound review entry.` });
    }
    if (!row.dispositions.length) row.dispositions.push({ category: 'method', item: row.method, disposition: 'feature-equivalent', evidence: 'No missing state/call/event/timer/resource features and no control metric delta.' });
    row.reviewStatus = row.dispositions.some((item) => item.disposition === 'unreviewed' || item.disposition === 'defect') ? 'unreviewed' : 'reviewed';
  }
}
const summary = {
  generatedAt: new Date().toISOString(), files: audit.summary.files, methods: audit.summary.sourceMethods,
  duplicates: audit.summary.duplicateMethods, missingMethods: audit.summary.missingMethods,
  dispositions, unreviewedDeltas: unreviewed,
  status: unreviewed === 0 && audit.summary.missingMethods === 0 && audit.summary.duplicateMethods === 0 ? 'passed' : 'blocked',
};
fs.writeFileSync(outputPath, JSON.stringify({ summary, report: audit.report }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
if (summary.status !== 'passed') process.exitCode = 1;
