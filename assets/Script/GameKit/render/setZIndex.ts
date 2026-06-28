import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SetZIndex')
export class SetZIndex extends Component {
    @property
    public zAdd = 0;

    start(): void {
        this.node.setSiblingIndex(this.zAdd);
    }
}

export default SetZIndex;
