const fs = require('fs');

const source = 'F:/qiguobing/git/creator/test/coinbeach2415/assets/Script/game/mergeTutorial/MergeTutorialManager.js';
const target = 'assets/Script/game/mergeTutorial/MergeTutorialManager.ts';
let body = fs.readFileSync(source, 'utf8').replace(/^\uFEFF/, '');

body = body
  .replace('var MergeTutorialManager = {', 'const MergeTutorialManager: any = {')
  .replace(/^var MergeTutorialStateMachine = require\("MergeTutorialStateMachine"\)\r?\n/m, '')
  .replace(/^var MergeTutorialTargetResolver = require\("MergeTutorialTargetResolver"\)\r?\n/m, '')
  .replace(/^var MergeTutorialOperationGuard = require\("MergeTutorialOperationGuard"\)\r?\n/m, '')
  .replace(/^var MergeTutorialBusinessAdapter = require\("MergeTutorialBusinessAdapter"\)\r?\n/m, '')
  .replace(/^var MergeTutorialUIController = require\("MergeTutorialUIController"\)\r?\n/m, '')
  .replace(/typeof cc !== 'undefined' && cc\.color\s*\? cc\.color\(([^)]+)\)\s*:\s*\{ r: 174, g: 255, b: 58, a: 255 \}/m, 'new Color($1)')
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
  .replace(/UIRoot\.instance\.node\.convertToWorldSpaceAR\(/g, 'nodeToWorld(UIRoot.instance.node, ')
  .replace(/levelNode\.node\.convertToWorldSpaceAR\(/g, 'nodeToWorld(levelNode.node, ')
  .replace(/node\.convertToWorldSpaceAR\(/g, 'nodeToWorld(node, ')
  .replace(/\.convertToWorldSpaceAR\b/g, '.getComponent(UITransform)')
  .replace(/\.getWorldToScreenPoint\b/g, '.worldToScreen')
  .replace(/module\.exports = MergeTutorialManager\s*$/, 'export default MergeTutorialManager');

body = body.replace(
  /(MergeTutorialManager\.GetTriggerBuildTargetParam = function\(stepMeta\) \{\r?\n\s*)var params = \{\}/,
  '$1var params: any = {}',
).replace(
  /(GetTriggerBuildTargetParam[\s\S]*?)var triggerParams = this\.activeTriggerMeta/,
  '$1var triggerParams: any = this.activeTriggerMeta',
);

const header = `import '../../LegacyGlobals';
import { Camera, Color, find, isValid, Node, UITransform, Vec2, Vec3, view } from 'cc';
import MergeTutorialBusinessAdapter from './MergeTutorialBusinessAdapter';
import MergeTutorialOperationGuard from './MergeTutorialOperationGuard';
import MergeTutorialStateMachine from './MergeTutorialStateMachine';
import MergeTutorialTargetResolver from './MergeTutorialTargetResolver';
import MergeTutorialUIController from './MergeTutorialUIController';

function nodeToWorld(node: Node, point: Vec2 | Vec3) {
    const transform = node && node.getComponent(UITransform)
    return transform ? transform.convertToWorldSpaceAR(new Vec3(point.x, point.y, 'z' in point ? point.z : 0)) : new Vec3()
}

`;

fs.writeFileSync(target, header + body, 'utf8');
