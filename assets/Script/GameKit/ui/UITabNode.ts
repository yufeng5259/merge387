import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UITabNode')
export class UITabNode extends Component {
    @property(Node)
    public enabledNode: Node | null = null;

    @property(Node)
    public disabledNode: Node | null = null;

    public start(): void {
    }

    public enable(): void {
        if (this.enabledNode) this.enabledNode.active = true;
        if (this.disabledNode) this.disabledNode.active = false;
    }

    public disable(): void {
        if (this.enabledNode) this.enabledNode.active = false;
        if (this.disabledNode) this.disabledNode.active = true;
    }
}

export default UITabNode;
