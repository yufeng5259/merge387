import { _decorator, Component, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnergyFullAnim')
export class EnergyFullAnim extends Component {
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton | null = null;

    onLoad () {
        this.node.active = false;
    }

    start () {
    }

    play (cb?: () => void) {
        this.node.active = true;
        if (!this.skeleton) {
            if (cb) cb();
            return;
        }
        this.skeleton.setAnimation(0, 'animation', false);
        this.skeleton.setToSetupPose();
        this.skeleton.setCompleteListener(() => {
            this.node.active = false;
            if (cb) {
                cb();
            }
        });
    }

    stop () {
        this.node.active = false;
    }
}

export default EnergyFullAnim;
