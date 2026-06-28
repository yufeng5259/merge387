import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TimeDestroy')
export class TimeDestroy extends Component {
    @property
    public t = 0;

    start() {
        this.scheduleOnce(() => {
            this.node.destroy();
        }, this.t);
    }
}

export default TimeDestroy;
