import { _decorator, Component, instantiate, Node, Prefab } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AddPrefab')
export class AddPrefab extends Component {
    @property(Prefab)
    public prefab: Prefab | null = null;

    public preNode: Node | null = null;

    onLoad() {
        if (!this.prefab) return;
        this.preNode = instantiate(this.prefab);
        this.node.addChild(this.preNode);
        this.preNode.setPosition(0, 0);
    }

    start() {
    }
}

export default AddPrefab;
