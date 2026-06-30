import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SetZIndex')
export class SetZIndex extends Component {
    @property
    public zAdd = 0;

    start(): void {
        this.updateSiblingIndex();
    }

    lateUpdate(): void {
        this.updateSiblingIndex();
    }

    private updateSiblingIndex(): void {
        const parent = this.node.parent;
        if (!parent) return;

        const targetIndex = Math.min(this.zAdd, parent.children.length - 1);
        if (this.node.getSiblingIndex() !== targetIndex) {
            this.node.setSiblingIndex(targetIndex);
        }
    }
}

export default SetZIndex;
