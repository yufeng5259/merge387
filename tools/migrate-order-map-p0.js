const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

let order = read('F:/qiguobing/git/creator/test/coinbeach2415/assets/Script/Web/MergeOrderLogic.js');
order = order
  .replace('var MergeOrderLogic = {};', `type MergeOrderLogicApi = Record<string, any>;
type MergeOrderWindow = Window & { MergeOrderLogic?: MergeOrderLogicApi };
var MergeOrderLogic: MergeOrderLogicApi = {};`)
  .replace(/if \(typeof module !== 'undefined' && module\.exports\) \{[\s\S]*?\} else if \(typeof window !== 'undefined'\) \{\s*window\.MergeOrderLogic = MergeOrderLogic;\s*\}/, `if (typeof window !== 'undefined') {
    (window as MergeOrderWindow).MergeOrderLogic = MergeOrderLogic;
}`)
  .replace(/\s*$/, '\n\nexport default MergeOrderLogic;\n');
order = order
  .replace(/var order = \{\r?\n\s*orderId: params\.orderId,/, 'var order: any = {\n        orderId: params.orderId,')
  .replace(/var result = \{\r?\n\s*success: false,/, 'var result: any = {\n        success: false,');
fs.writeFileSync('assets/Script/Web/MergeOrderLogic.ts', order, 'utf8');

let town = read('F:/qiguobing/git/creator/test/coinbeach2415/assets/Script/game/map/TownUpgradeFlow.js');
town = town
  .replace(/var LevelUpDisplayLock = require\("LevelUpDisplayLock"\)\r?\nvar TownUpgradeTransactionState = require\("TownUpgradeTransactionState"\)\r?\nvar TownUpgradeFlow = \{\}/, `import '../../LegacyGlobals';
import { find, Node, Sprite, UITransform, Vec3 } from 'cc';
import { UserMap } from './UserMap';
import LevelUpDisplayLock from '../user/LevelUpDisplayLock';
import TownUpgradeTransactionState from './TownUpgradeTransactionState';

const TownUpgradeFlow: any = {}`)
  .replace(/\bcc\.v2\(0,\s*0\)/g, 'Vec3.ZERO')
  .replace(/([A-Za-z0-9_.$]+)\.convertToWorldSpaceAR\(Vec3\.ZERO\)/g, 'TownUpgradeFlow._convertToWorldSpaceAR($1)')
  .replace(/new cc\.Node\(/g, 'new Node(')
  .replace(/cc\.Sprite\b/g, 'Sprite')
  .replace(/\bcc\.find\b/g, 'find')
  .replace(/module\.exports = TownUpgradeFlow\s*$/, `TownUpgradeFlow._convertToWorldSpaceAR = function(node) {
    if (!node) return new Vec3()
    var transform = node.getComponent(UITransform)
    return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone()
}

global.Game.TownUpgradeFlow = TownUpgradeFlow
export default TownUpgradeFlow`);
fs.writeFileSync('assets/Script/game/map/TownUpgradeFlow.ts', town, 'utf8');
