import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MergeRoleNode')
export class MergeRoleNode extends Component {
    @property(sp.Skeleton)
    public ske: sp.Skeleton | null = null;

    @property
    public nameIdle = 'idle';

    @property
    public nameHappy = 'happy';

    @property
    public nameLeave = 'leave';

    @property
    public nameShow = 'show';

    onLoad () {
        if (!this.ske) {
            this.ske = this.getComponent(sp.Skeleton);
        }
    }

    start () {
    }

    _play (name: any, loop: any, nextName?: any, nextLoop?: any) {
        if (!this.ske || !name) return;
        this.ske.setAnimation(0, name, !!loop);
        if (nextName) {
            this.ske.addAnimation(0, nextName, !!nextLoop);
        }
    }

    playIdle () {
        this._play(this.nameIdle, true);
    }

    playHappy () {
        this._play(this.nameHappy, false, this.nameIdle, true);
    }

    playLeave () {
        this._play(this.nameLeave, false);
    }

    playShow () {
        this._play(this.nameShow, false, this.nameIdle, true);
    }

    playComplete () {
        this.playHappy();
    }
}

export default MergeRoleNode;
