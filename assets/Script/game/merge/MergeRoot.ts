import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MergeRoot')
export class MergeRoot extends Component {
    @property(Prefab)
    public mergePrefab: Prefab | null = null;

    public mergeNodeUI: any = null;
    public mergeLevelNode: any = null;

    loadMergeLevelMap (levelId: any, cb: any) {
        if (this.mergeNodeUI) {
            this.mergeNodeUI.node.destroy();
            this.mergeNodeUI = null;
            this.mergeLevelNode = null;
        }
        if (!this.mergePrefab) {
            if (cb) cb();
            return;
        }

        const mergeNode = instantiate(this.mergePrefab) as Node;
        mergeNode.setPosition(Vec3.ZERO);
        mergeNode.parent = this.node;
        this.mergeNodeUI = mergeNode.getComponent('MergeUI');
        this.mergeLevelNode = this.mergeNodeUI ? this.mergeNodeUI.CreateMergeLevelNode() : null;
        if (!this.mergeLevelNode) {
            if (cb) cb();
            return;
        }

        let isFirst = false;
        if (Object.keys(Game.SUserMerge.GetMergeMapData()).length === 0) {
            isFirst = true;
        }
        this.mergeLevelNode.InitMergeMap(Game.SUserMerge.GetMergeMapData(), isFirst, () => {
            if (cb) cb();
        });
    }

    start () {
    }
}

export default MergeRoot;
