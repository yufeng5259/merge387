// @ts-nocheck
import * as cc from 'cc';

// fengyong-2019-4-1

const { _decorator, CCBoolean } = cc;
const { ccclass, property, menu } = _decorator;

var DoType = cc.Enum({
    All: 0,
    DEL: 1,
})
var buildPos = {
    '1': { x: 267.845, y: -1436.43, index: 1 },
    '2': { x: -82.493, y: -1327.19, index: 2 },
    '3': { x: 445.927, y: -996.48, index: 3 },
    '4': { x: -489.483, y: -1058.938, index: 4 },
    '5': { x: -258.41, y: -861.261, index: 5 },
    '6': { x: 39, y: -760, index: 6 },
    '7': { x: -198.951, y: -618.75, index: 7 },
    '8': { x: -1179.267, y: -537.086, index: 8 },
    '9': { x: -918.517, y: -382.79, index: 9 },
    '10': { x: -645.703, y: -346.657, index: 10 },
    '11': { x: -457.97, y: -446.763, index: 11 },
    '12': { x: -202.717, y: -238.607, index: 12 },
    '13': { x: -439.727, y: -157.852, index: 13 },
    '14': { x: -157.288, y: -41.044, index: 14 },
    '15': { x: 98.738, y: -136.165, index: 15 },
    '16': { x: 149.237, y: -461.66, index: 16 },
    '17': { x: 400.291, y: -573.24, index: 17 },
    '18': { x: 631.246, y: -680.187, index: 18 },
    '19': { x: 904.64, y: -807.799, index: 19 },
    '20': { x: 1462.698, y: -518.862, index: 20 },
    '21': { x: 645.401, y: -258.313, index: 21 },
    '22': { x: 424.806, y: 10.172, index: 22 },
    '23': { x: 396.579, y: 220.395, index: 23 },
    '24': { x: 632, y: 112, index: 24 },
    '25': { x: 975, y: -65, index: 25 },
    '26': { x: 938.889, y: 278.714, index: 26 },
    '27': { x: 703.025, y: 608.546, index: 27 },
    '28': { x: -301.153, y: 240.923, index: 28 },
    '29': { x: -882.704, y: -61.311, index: 29 },
    '30': { x: -1276.046, y: -237.2, index: 30 },
    '31': { x: -1497.649, y: -357.176, index: 31 },
    '32': { x: -1526.532, y: -126.023, index: 32 },
    '33': { x: -1208.695, y: 30.884, index: 33 },
    '34': { x: -843.849, y: 241.332, index: 34 },
    '35': { x: -108.236, y: 531.911, index: 35 },
    '36': { x: -378.035, y: 648.709, index: 36 },
    '37': { x: -838.6, y: 523.818, index: 37 },
    '38': { x: -1224.508, y: 359.307, index: 38 },
    '39': { x: -1446, y: 212, index: 39 }
}
/**
 * 一个批量导入build-spf的工具
 * - [用法] 写入build-name和5个load-name,导入1-5的sp/sp_dam/sp_shadow
 * - [要求] 命名格式为 name1, name1_dam, name1_shadow,部分公用组件不导入
 * - [注意] 成功后请手动删除脚本组件
 */
@ccclass('TReBuild')
@menu("Editor-Tools/TReBuild")
export class TReBuild extends cc.Component {
    @property({ type:DoType })
    private doType = DoType.All

    @property({ type: CCBoolean })
    private get do() { return false }
    private set do(v: boolean) {
        if (typeof CC_EDITOR !== 'undefined' && CC_EDITOR) this.load_Build()
    }

    private load_Build() {
        const bn: cc.Node = this.node;
        Editor.log(`load:bn`, bn.childrenCount);
        if (this.doType == DoType.DEL) {
            bn.destroyAllChildren()
            return;
        }
        if (this.doType !== DoType.All) {
            Editor.log("type error");
            return;
        }

        new Promise((res, rej) => {
            let loadResNum = 0;
            let allResNum = 0;

            const keys = Object.keys(buildPos).sort((a, b) => Number(a) - Number(b));

            keys.forEach((k) => {
                const item = buildPos[k];
                const index = item.index;

                // 按你的实际目录改这里：
                // 例如 prefab 在 db://assets/resources/res/village/buildPrefabs/xx.prefab
                const prefabUrl = `db://assets/resources/res/village/buildPrefabs/${index}/${index}.prefab`;
                const uuid = Editor.assetdb.remote.urlToUuid(prefabUrl);

                if (!uuid) {
                    Editor.log(`[TReBuild] uuid not found, index=${index}, url=${prefabUrl}`);
                    return;
                }

                allResNum++;

                cc.assetManager.loadAny(uuid, (err, prefab: cc.Prefab) => {
                    loadResNum++;

                    if (err || !prefab) {
                        Editor.log(`[TReBuild] load prefab fail, index=${index}, err=${err}`);
                    } else {
                        // 已有同名节点先删，避免重复
                        const old = bn.getChildByName(`${index}`);
                        if (old) old.destroy();

                        const nd = cc.instantiate(prefab);
                        nd.name = `${index}`;
                        nd.parent = bn;
                        nd.x = item.x;
                        nd.y = item.y;

                        Editor.log(`[TReBuild] create id=${index}, x=${item.x}, y=${item.y}`);
                    }

                    if (loadResNum === allResNum) {
                        Editor.log(`load:over total=${allResNum}`);
                        res();
                    }
                });
            });

            // 一个可加载资源都没有时，避免卡死
            if (allResNum === 0) {
                Editor.log(`load:over total=0`);
                res();
            }
        });
    }

}
