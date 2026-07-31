const fs = require('fs');
const path = require('path');

const sourceRoot = 'F:/qiguobing/git/creator/test/coinbeach2415/assets/Script';
const targetRoot = 'assets/Script';
const files = [
  'game/map/MapElementNode', 'game/map/MapNode', 'game/map/TownUpgradeFlow', 'game/map/UserMap',
  'game/merge/LevelMergeNode', 'game/merge/MergeDes', 'game/merge/MergeUI',
  'game/mergeTutorial/MergeTutorialManager', 'game/user/LevelUpDisplayLock',
  'GameKit/ui/CoinFlyToTargetAnim', 'Web/MergeOrderLogic', 'Web/NetRequest',
  'window/GameMainWindow', 'window/LoginWindow', 'window/Other/MergeTutorialWindow', 'window/UserInfoModel',
];
const fieldEquivalences = {
  'game/map/MapElementNode': { _upgradeIconClickNode: '_upgradeIconClickNodes supports all bound nodes' },
  'game/map/MapNode': { _buildLoadUserCoin: 'source writes but never reads this value; no business state consumer exists' },
  'game/merge/LevelMergeNode': {
    _visualRefreshHandler: '_visualRefreshDone plus explicit task queue',
    _visualRefreshScheduled: '_visualRefreshQueue length and scheduler state',
  },
  'game/merge/MergeUI': { _showEmptyTaskGuideFromEvent: '_emptyTaskGuideEventShowCallback closure' },
  'GameKit/ui/CoinFlyToTargetAnim': {
    _flyPool: 'flyPool: NodePool', _flyPools: 'flyPools: Record<string, NodePool>', _flyPrototypeNode: 'flyPrototypeNode: Node',
  },
};

function symbols(text, isTypeScript = false) {
  const methods = new Set();
  for (const match of text.matchAll(/^(?:[A-Za-z_$][\w$]*\.(?:prototype\.)?)?([A-Za-z_$][\w$]*)\s*=\s*function\b/gm)) methods.add(match[1]);
  for (const match of text.matchAll(/^ {4}(?:(?:public|private|protected|static|async)\s+)*([A-Za-z_$][\w$]*)\s*\(/gm)) methods.add(match[1]);
  methods.delete('if'); methods.delete('for'); methods.delete('while'); methods.delete('switch');
  const fields = new Set([...text.matchAll(/\bthis\.([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1]));
  if (isTypeScript) {
    for (const match of text.matchAll(/^ {4}(?:(?:public|private|protected|static|readonly)\s+)*([A-Za-z_$][\w$]*)\s*(?::|=)/gm)) fields.add(match[1]);
  }
  const resources = new Set([...text.matchAll(/["']([^"']*(?:resources|prefab|spine|texture|window)[^"']*)["']/gi)].map((m) => m[1]));
  return { methods: [...methods].sort(), fields: [...fields].sort(), resources: [...resources].sort() };
}

function metrics(text) {
  const count = (regex) => (text.match(regex) || []).length;
  return {
    branches: count(/\b(?:if|switch|case)\b/g), loops: count(/\b(?:for|while)\b/g),
    events: count(/\b(?:on|off|RegisterEvent|UnRegisterEvent|emit|Emit)\b/g),
    timers: count(/\b(?:setTimeout|setInterval|schedule|scheduleOnce)\b/g),
    asyncCallbacks: count(/\b(?:Promise|then|SetCallBack|SetErrorCallBack|async|await)\b/g),
  };
}

const report = files.map((rel) => {
  const sourcePath = path.join(sourceRoot, rel + '.js');
  const targetPath = path.join(targetRoot, rel + '.ts');
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const targetText = fs.readFileSync(targetPath, 'utf8');
  const source = symbols(sourceText);
  const target = symbols(targetText, true);
  const targetMethods = new Set(target.methods);
  const targetFields = new Set(target.fields);
  const equivalents = fieldEquivalences[rel] || {};
  return {
    rel,
    source: { ...metrics(sourceText), methodCount: source.methods.length, fieldCount: source.fields.length, resources: source.resources },
    target: { ...metrics(targetText), methodCount: target.methods.length, fieldCount: target.fields.length, resources: target.resources },
    missingMethods: source.methods.filter((name) => !targetMethods.has(name) && !(name === 'ctor' && targetMethods.has('onLoad'))),
    fieldEquivalences: equivalents,
    missingFields: source.fields.filter((name) => !targetFields.has(name) && !equivalents[name]),
  };
});

const summary = {
  generatedAt: new Date().toISOString(),
  files: report.length,
  missingMethodCount: report.reduce((n, row) => n + row.missingMethods.length, 0),
  missingFieldCount: report.reduce((n, row) => n + row.missingFields.length, 0),
};
fs.writeFileSync('docs/generated/script-migration-20260722/parity-16-1502.json', JSON.stringify({ summary, report }, null, 2) + '\n');
console.log(JSON.stringify({ summary, gaps: report.filter((row) => row.missingMethods.length || row.missingFields.length).map((row) => ({ rel: row.rel, methods: row.missingMethods, fields: row.missingFields })) }, null, 2));
