import { _decorator, Animation, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('AnimOverDestroy')
export class AnimOverDestroy extends Component {
    start() {
        const animation = this.getComponent(Animation);
        if (!animation) return;

        animation.once(Animation.EventType.FINISHED, () => {
            this.node.destroy();
        }, this);
    }
}

export default AnimOverDestroy;
