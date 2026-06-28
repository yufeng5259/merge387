import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CheckSystemOpen')
export class CheckSystemOpen extends Component {
    @property
    public close_key = '';

    onLoad() {
        if (!this.close_key) return;

        this.node.active = !global[this.close_key];
    }
}

export default CheckSystemOpen;
