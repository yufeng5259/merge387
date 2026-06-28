import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

type SpineAnimCallback = (() => void) | null | undefined;

@ccclass('SpineAnim')
export class SpineAnim extends Component {
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton | null = null;

    private isPlaying = false;

    public onLoad(): void {
        this.node.active = false;
        this.isPlaying = false;
    }

    public start(): void {}

    public playOnce(animationName: string, cb?: SpineAnimCallback): void {
        this.isPlaying = true;
        this.node.active = true;

        if (!this.skeleton) {
            this.node.active = false;
            this.isPlaying = false;
            if (cb) cb();
            return;
        }

        this.skeleton.setAnimation(0, animationName, false);
        this.skeleton.setToSetupPose();
        this.skeleton.setCompleteListener(() => {
            this.node.active = false;
            this.isPlaying = false;
            if (cb) cb();
        });
    }

    public playLoop(animationName: string): void {
        this.isPlaying = true;
        this.node.active = true;

        if (!this.skeleton) return;
        this.skeleton.setAnimation(0, animationName, true);
        this.skeleton.setToSetupPose();
    }

    public stop(): void {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        this.node.active = false;
    }
}

export default SpineAnim;
