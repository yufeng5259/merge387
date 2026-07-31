const ts = require('typescript');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const sourceRoot = process.env.AUDIT_SOURCE_ROOT || 'F:/qiguobing/git/creator/test/coinbeach2415/assets/Script';
const targetRoot = process.env.AUDIT_TARGET_ROOT || 'assets/Script';
const defaultFiles = [
  'game/map/MapElementNode', 'game/map/MapNode', 'game/map/TownUpgradeFlow', 'game/map/UserMap',
  'game/merge/LevelMergeNode', 'game/merge/MergeDes', 'game/merge/MergeUI',
  'game/mergeTutorial/MergeTutorialManager', 'game/user/LevelUpDisplayLock',
  'GameKit/ui/CoinFlyToTargetAnim', 'Web/MergeOrderLogic', 'Web/NetRequest',
  'window/GameMainWindow', 'window/LoginWindow', 'window/Other/MergeTutorialWindow', 'window/UserInfoModel',
];
const files = process.env.AUDIT_FILES ? JSON.parse(process.env.AUDIT_FILES) : defaultFiles;
const outputPath = process.env.AUDIT_OUTPUT || 'docs/generated/script-migration-20260722/parity-16-method-ast-1502.json';

function propertyName(node) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) return node.text;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return '';
}

function assignedMethodName(node) {
  if (!ts.isBinaryExpression(node) || node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) return '';
  if (!ts.isFunctionExpression(node.right) && !ts.isArrowFunction(node.right)) return '';
  if (!ts.isPropertyAccessExpression(node.left)) return '';
  const owner = node.left.expression;
  if (!ts.isIdentifier(owner) && !(ts.isPropertyAccessExpression(owner) && owner.name.text === 'prototype')) return '';
  if (!ts.isExpressionStatement(node.parent) || !ts.isSourceFile(node.parent.parent)) return '';
  return node.left.name.text;
}

function collectMethods(file, scriptKind) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind);
  const methods = new Map();
  const duplicates = [];
  function add(name, body, kind) {
    if (!name || !body) return;
    if (methods.has(name)) {
      duplicates.push({ name, firstKind: methods.get(name).kind, duplicateKind: kind });
      return;
    }
    methods.set(name, { body, kind });
  }
  function addObjectMethods(object, kind) {
    for (const member of object.properties) {
      if (ts.isMethodDeclaration(member)) add(propertyName(member.name), member.body, kind);
      else if (ts.isPropertyAssignment(member) && (ts.isFunctionExpression(member.initializer) || ts.isArrowFunction(member.initializer))) {
        add(propertyName(member.name), member.initializer.body, kind);
      }
    }
  }
  for (const statement of ast.statements) {
    if (ts.isClassDeclaration(statement)) {
      for (const member of statement.members) if (ts.isMethodDeclaration(member)) add(propertyName(member.name), member.body, 'class-method');
      continue;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) addObjectMethods(declaration.initializer, 'top-level-object-method');
        else if (declaration.initializer && ts.isCallExpression(declaration.initializer)) {
          for (const arg of declaration.initializer.arguments) if (ts.isObjectLiteralExpression(arg)) addObjectMethods(arg, 'component-object-method');
        }
      }
      continue;
    }
    if (!ts.isExpressionStatement(statement)) continue;
    const expression = statement.expression;
    if (ts.isCallExpression(expression)) {
      for (const arg of expression.arguments) if (ts.isObjectLiteralExpression(arg)) addObjectMethods(arg, 'component-object-method');
      continue;
    }
    const name = assignedMethodName(expression);
    if (name) add(name, expression.right.body, 'top-level-assignment-method');
  }
  return { text, methods, duplicates };
}

function callName(expression) {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  return expression.getText().replace(/\s+/g, ' ').slice(0, 120);
}

function featureSet(body, sourceText) {
  const stateWrites = new Set();
  const calls = new Set();
  const events = new Set();
  const timers = new Set();
  const resources = new Set();
  const metrics = { branches: 0, loops: 0, returns: 0, throws: 0, awaits: 0, callbacks: 0 };
  function visit(node) {
    if (ts.isBinaryExpression(node) && ts.isPropertyAccessExpression(node.left) && node.left.expression.kind === ts.SyntaxKind.ThisKeyword) {
      stateWrites.add(node.left.name.text);
    }
    if ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) && ts.isPropertyAccessExpression(node.operand) && node.operand.expression.kind === ts.SyntaxKind.ThisKeyword) {
      stateWrites.add(node.operand.name.text);
    }
    if (ts.isCallExpression(node)) {
      const name = callName(node.expression);
      calls.add(name);
      if (/Event|Dispatcher|Register|UnRegister|emit|\bon$|\boff$/.test(name)) {
        for (const arg of node.arguments) if (ts.isStringLiteralLike(arg)) events.add(arg.text);
      }
      if (/setTimeout|setInterval|schedule|scheduleOnce|unschedule|clearTimeout|clearInterval/.test(name)) timers.add(name);
      if (node.arguments.some((arg) => ts.isArrowFunction(arg) || ts.isFunctionExpression(arg))) metrics.callbacks++;
    }
    if (ts.isIfStatement(node) || ts.isSwitchStatement(node) || ts.isConditionalExpression(node)) metrics.branches++;
    if (ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node)) metrics.loops++;
    if (ts.isReturnStatement(node)) metrics.returns++;
    if (ts.isThrowStatement(node)) metrics.throws++;
    if (ts.isAwaitExpression(node)) metrics.awaits++;
    if (ts.isStringLiteralLike(node) && /(?:window|prefab|resources|spine|texture|LiveData|AvatarWindow|MergeTutorialWindow)[/A-Za-z0-9_.-]*/i.test(node.text)) resources.add(node.text);
    ts.forEachChild(node, visit);
  }
  visit(body);
  return {
    stateWrites: [...stateWrites].sort(), calls: [...calls].sort(), events: [...events].sort(),
    timers: [...timers].sort(), resources: [...resources].sort(), metrics,
    bodySha256: crypto.createHash('sha256').update(body.getText().replace(/\s+/g, ' ').trim()).digest('hex').toUpperCase(),
  };
}

function difference(source, target) {
  const targetSet = new Set(target || []);
  return (source || []).filter((value) => !targetSet.has(value));
}

const report = [];
for (const rel of files) {
  const source = collectMethods(path.join(sourceRoot, rel + '.js'), ts.ScriptKind.JS);
  const target = collectMethods(path.join(targetRoot, rel + '.ts'), ts.ScriptKind.TS);
  const rows = [];
  for (const [name, sourceEntry] of [...source.methods.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const targetEntry = target.methods.get(name) || (name === 'ctor' ? target.methods.get('onLoad') : null);
    const sf = featureSet(sourceEntry.body, source.text);
    const tf = targetEntry ? featureSet(targetEntry.body, target.text) : null;
    rows.push({
      method: name, sourceKind: sourceEntry.kind, targetKind: targetEntry?.kind || null,
      targetMethod: targetEntry ? (name === 'ctor' && !target.methods.has(name) ? 'onLoad' : name) : null,
      status: targetEntry ? 'mapped' : 'missing', source: sf, target: tf,
      delta: tf ? {
        stateWritesMissing: difference(sf.stateWrites, tf.stateWrites), callsMissing: difference(sf.calls, tf.calls),
        eventsMissing: difference(sf.events, tf.events), timersMissing: difference(sf.timers, tf.timers),
        resourcesMissing: difference(sf.resources, tf.resources), metrics: Object.fromEntries(Object.keys(sf.metrics).map((key) => [key, tf.metrics[key] - sf.metrics[key]])),
        stateWritesAdded: difference(tf.stateWrites, sf.stateWrites), callsAdded: difference(tf.calls, sf.calls),
        eventsAdded: difference(tf.events, sf.events), timersAdded: difference(tf.timers, sf.timers),
        resourcesAdded: difference(tf.resources, sf.resources),
      } : null,
    });
  }
  report.push({ rel, sourceMethodCount: source.methods.size, targetMethodCount: target.methods.size, sourceDuplicates: source.duplicates, targetDuplicates: target.duplicates, methods: rows });
}
const summary = {
  generatedAt: new Date().toISOString(), files: report.length,
  sourceMethods: report.reduce((n, file) => n + file.sourceMethodCount, 0),
  mappedMethods: report.reduce((n, file) => n + file.methods.filter((row) => row.status === 'mapped').length, 0),
  missingMethods: report.reduce((n, file) => n + file.methods.filter((row) => row.status === 'missing').length, 0),
  duplicateMethods: report.reduce((n, file) => n + file.sourceDuplicates.length + file.targetDuplicates.length, 0),
  methodsWithFeatureDeltas: report.reduce((n, file) => n + file.methods.filter((row) => row.delta && (row.delta.stateWritesMissing.length || row.delta.callsMissing.length || row.delta.eventsMissing.length || row.delta.timersMissing.length || row.delta.resourcesMissing.length)).length, 0),
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ summary, report }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
