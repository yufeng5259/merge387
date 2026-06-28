import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ExecuteTime')
export class ExecuteTime extends Component {
    @property
    public onloadString = '';

    @property
    public startString = '';

    @property
    public enableString = '';

    onLoad() {
        console.log(this.onloadString, 'onload');
    }

    start() {
        console.log(this.startString, 'start');
    }

    onEnable() {
        console.log(this.enableString, 'onEnable');
    }
}

export default ExecuteTime;
