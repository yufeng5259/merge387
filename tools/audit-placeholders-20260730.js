const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const sourceRoot = 'F:/qiguobing/git/creator/test/coinbeach2415/assets/Script';
const targetRoot = 'assets/Script';
const files = require('../docs/generated/script-migration-20260730/live-comparable-files.json');

function nameOf(node) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return '';
}

function methods(file, kind) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const found = new Map();
  const add = (name, body) => { if (name && body && !found.has(name)) found.set(name, body); };
  const object = value => value.properties.forEach(member => {
    if (ts.isMethodDeclaration(member)) add(nameOf(member.name), member.body);
    if (ts.isPropertyAssignment(member) && (ts.isFunctionExpression(member.initializer) || ts.isArrowFunction(member.initializer))) add(nameOf(member.name), member.initializer.body);
  });
  function visit(node) {
    if (ts.isClassDeclaration(node)) node.members.forEach(member => { if (ts.isMethodDeclaration(member)) add(nameOf(member.name), member.body); });
    if (ts.isCallExpression(node)) node.arguments.forEach(arg => { if (ts.isObjectLiteralExpression(arg)) object(arg); });
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(node.left) && (ts.isFunctionExpression(node.right) || ts.isArrowFunction(node.right))) add(node.left.name.text, node.right.body);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return { text, found, ast };
}

function literalReturn(body) {
  if (!ts.isBlock(body) || body.statements.length !== 1 || !ts.isReturnStatement(body.statements[0])) return null;
  const value = body.statements[0].expression;
  if (!value || value.kind === ts.SyntaxKind.NullKeyword || value.kind === ts.SyntaxKind.TrueKeyword || value.kind === ts.SyntaxKind.FalseKeyword || ts.isNumericLiteral(value) || ts.isArrayLiteralExpression(value) || ts.isObjectLiteralExpression(value)) return value ? value.getText() : 'undefined';
  return null;
}

const findings = [];
for (const rel of files) {
  const source = methods(path.join(sourceRoot, `${rel}.js`), ts.ScriptKind.JS);
  const target = methods(path.join(targetRoot, `${rel}.ts`), ts.ScriptKind.TS);
  for (const [name, targetBody] of target.found) {
    const sourceBody = source.found.get(name);
    if (!sourceBody) continue;
    const sourceCount = ts.isBlock(sourceBody) ? sourceBody.statements.length : 1;
    const targetCount = ts.isBlock(targetBody) ? targetBody.statements.length : 1;
    if (targetCount === 0 && sourceCount > 0) findings.push({ rel, method: name, kind: 'empty-target-nonempty-source' });
    const targetLiteral = literalReturn(targetBody);
    const sourceLiteral = literalReturn(sourceBody);
    if (targetLiteral !== null && sourceLiteral !== targetLiteral) findings.push({ rel, method: name, kind: 'fixed-return-diverges', targetLiteral, sourceLiteral });
  }
  const marker = /TODO|FIXME|not implemented|unimplemented|未实现/gi;
  for (const match of target.text.matchAll(marker)) findings.push({ rel, kind: 'placeholder-marker', marker: match[0] });
  function catchVisit(node) {
    if (ts.isCatchClause(node) && node.block.statements.length === 0) findings.push({ rel, kind: 'empty-catch' });
    ts.forEachChild(node, catchVisit);
  }
  catchVisit(target.ast);
}

const result = { generatedAt: new Date().toISOString(), files: files.length, findings };
fs.writeFileSync('docs/generated/script-migration-20260730/g009-placeholder-audit.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ files: files.length, findings: findings.length, byKind: findings.reduce((a, x) => ((a[x.kind] = (a[x.kind] || 0) + 1), a), {}) }, null, 2));
if (findings.length) process.exitCode = 1;
