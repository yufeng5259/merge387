import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('JueSeWanChengTx')
export class JueSeWanChengTx extends Component {
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton | null = null;

    public _isPlaying = false;

    onLoad () {
        this.node.active = false;
        this._isPlaying = false;
    }

    start () {
    }

    PlayEnter () {
        if (!this.skeleton) return;

        this._isPlaying = true;
        this.node.active = true;
        this.skeleton.node.active = true;
        this.skeleton.setCompleteListener(() => {
            if (!this._isPlaying || !this.skeleton) return;
            this._isPlaying = false;
            this.node.active = false;
            this.skeleton.setCompleteListener(null);
        });
        this.skeleton.setAnimation(0, 'JueSeWanChengLiZi_dh', false);
    }
}

export default JueSeWanChengTx;
