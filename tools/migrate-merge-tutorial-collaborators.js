const fs = require('fs');
const path = require('path');

const sourceDir = 'F:/qiguobing/git/creator/test/coinbeach2415/assets/Script/game/mergeTutorial';
const targetDir = 'assets/Script/game/mergeTutorial';
const modules = [
  'MergeTutorialBusinessAdapter',
  'MergeTutorialOperationGuard',
  'MergeTutorialStateMachine',
  'MergeTutorialTargetResolver',
  'MergeTutorialUIController',
];

function targetMeta(sourceMeta) {
  const { uuid } = JSON.parse(fs.readFileSync(sourceMeta, 'utf8'));
  return JSON.stringify({
    ver: '4.0.24',
    importer: 'typescript',
    imported: true,
    uuid,
    files: [],
    subMetas: {},
    userData: { simulateGlobals: [] },
  }, null, 2) + '\n';
}

function convertModule(name) {
  const sourceFile = path.join(sourceDir, `${name}.js`);
  let body = fs.readFileSync(sourceFile, 'utf8').replace(/^\uFEFF/, '');
  body = body
    .replace(new RegExp(`var ${name} = \\{\\}`), `const ${name}: any = {}`)
    .replace(new RegExp(`module\\.exports = ${name}\\s*$`), `export default ${name}`);
  if (name === 'MergeTutorialBusinessAdapter') {
    body = body
      .replace(/(GetTriggerBuildTargetParam = function\(owner, stepMeta\) \{\r?\n\s*)var params = \{\}/, '$1var params: Record<string, any> = {}')
      .replace(/var triggerParams = owner\.activeTriggerMeta/, 'var triggerParams: Record<string, any> = owner.activeTriggerMeta');
  }

  let header = `import '../../LegacyGlobals';\n`;
  if (name === 'MergeTutorialTargetResolver') {
    header += `import { Camera, find, isValid, Node, UITransform, Vec2, Vec3, view } from 'cc';\n\n`;
    header += `function nodeToWorld(node: Node, point: Vec2 | Vec3) {\n`;
    header += `    const transform = node && node.getComponent(UITransform);\n`;
    header += `    return transform ? transform.convertToWorldSpaceAR(new Vec3(point.x, point.y, 'z' in point ? point.z : 0)) : new Vec3();\n`;
    header += `}\n`;
    header += `\nfunction getUiTransform(node: Node | null | undefined) {\n`;
    header += `    return node ? node.getComponent(UITransform) : null;\n`;
    header += `}\n`;
    body = body
      .replace(/typeof cc !== 'undefined' && cc\.isValid && !cc\.isValid\(([^)]+)\)/g, '!isValid($1)')
      .replace(/\bcc\.v2\(/g, 'new Vec2(')
      .replace(/\bcc\.v3\(/g, 'new Vec3(')
      .replace(/\bcc\.winSize\b/g, 'view.getVisibleSize()')
      .replace(/\bcc\.find\b/g, 'find')
      .replace(/\bcc\.Camera\b/g, 'Camera')
      .replace(/([A-Za-z0-9_.$()]+)\.convertToWorldSpaceAR\(([^\n]+)\)/g, 'nodeToWorld($1, $2)')
      .replace(/camera\.getWorldToScreenPoint\(/g, 'camera.worldToScreen(')
      .replace(/camera\.getScreenToWorldPoint\(/g, 'camera.screenToWorld(')
      .replace(/uiCamera\.getScreenToWorldPoint/g, 'uiCamera.screenToWorld')
      .replace(/uiCamera\.getCameraToWorldPoint/g, 'uiCamera.screenToWorld')
      .replace(/\.getWorldToScreenPoint\b/g, '.worldToScreen')
      .replace(/!node \|\| !node\.convertToWorldSpaceAR/g, '!getUiTransform(node)')
      .replace(/UIRoot\.instance\.node\.convertToWorldSpaceAR/g, 'getUiTransform(UIRoot.instance.node)')
      .replace(/!levelNode\.node\.convertToWorldSpaceAR/g, '!getUiTransform(levelNode.node)')
      .replace(/var winSize = typeof cc !== 'undefined' && view\.getVisibleSize\(\) \? view\.getVisibleSize\(\) : null/, 'var transform = getUiTransform(node)\n    var winSize = view.getVisibleSize()')
      .replace(/width: node && node\.width \? node\.width : \(winSize && winSize\.width\) \|\| 0/, 'width: transform && transform.contentSize.width ? transform.contentSize.width : winSize.width')
      .replace(/height: node && node\.height \? node\.height : \(winSize && winSize\.height\) \|\| 0/, 'height: transform && transform.contentSize.height ? transform.contentSize.height : winSize.height');
    body = body
      .replace(/(GetNodeWorldGeometry = function\(owner, node, padding\) \{\r?\n)    if \(!getUiTransform\(node\)\) return null/, '$1    var transform = getUiTransform(node)\n    if (!transform) return null')
      .replace(/\(node\.width \|\| 100\)/, '(transform.contentSize.width || 100)')
      .replace(/\(node\.height \|\| 100\)/, '(transform.contentSize.height || 100)');
  }

  fs.writeFileSync(path.join(targetDir, `${name}.ts`), `${header}\n${body}`, 'utf8');
  fs.writeFileSync(path.join(targetDir, `${name}.ts.meta`), targetMeta(`${sourceFile}.meta`), 'utf8');
}

for (const name of modules) convertModule(name);

const hooksSource = path.join(sourceDir, 'MergeGuideHooks.js');
let hooks = fs.readFileSync(hooksSource, 'utf8').replace(/^\uFEFF/, '');
hooks = hooks
  .replace('var MergeGuideHooks = {}', `import '../../LegacyGlobals';\nimport MergeTutorialManager from './MergeTutorialManager';\n\nconst MergeGuideHooks: any = {}`)
  .replace(/\s*try \{\s*return require\("MergeTutorialManager"\)\s*\} catch \(e\) \{\s*return null\s*\}/m, '\n    return MergeTutorialManager')
  .replace(/module\.exports = MergeGuideHooks\s*$/, 'export default MergeGuideHooks');
fs.writeFileSync(path.join(targetDir, 'MergeGuideHooks.ts'), hooks, 'utf8');
fs.writeFileSync(path.join(targetDir, 'MergeGuideHooks.ts.meta'), targetMeta(`${hooksSource}.meta`), 'utf8');

console.log(JSON.stringify({ migrated: [...modules, 'MergeGuideHooks'] }, null, 2));
