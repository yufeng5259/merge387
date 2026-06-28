import { _decorator, Component, ParticleSystem2D } from 'cc';

const { ccclass, property } = _decorator;

type ParticleAnimCallback = (() => void) | null;

@ccclass('ParticleAnim')
export class ParticleAnim extends Component {
    @property(ParticleSystem2D)
    public anim: ParticleSystem2D | null = null;

    private completeCb: ParticleAnimCallback = null;

    public onLoad(): void {
        this.node.active = false;
        this.anim?.stopSystem();
        this.completeCb = null;
    }

    public start(): void {
    }

    public play(x: number, y: number, delay: number, cb: ParticleAnimCallback): void {
        this.unscheduleAllCallbacks();
        this.node.active = true;
        this.completeCb = cb;
        this.node.setPosition(x, y, this.node.position.z);

        const startDelay = Math.max(0, delay || 0);
        this.scheduleOnce(() => {
            this.anim?.resetSystem();
        }, startDelay);

        this.scheduleOnce(() => {
            if (this.completeCb) {
                this.completeCb();
            }
            this.node.active = false;
        }, this.getAnimDuration());
    }

    public stop(): void {
        this.unscheduleAllCallbacks();
        this.anim?.stopSystem();
        this.node.active = false;
    }

    private getAnimDuration(): number {
        if (!this.anim) {
            return 0;
        }

        return Math.max(0, this.anim.duration) + Math.max(0, this.anim.life) + Math.max(0, this.anim.lifeVar);
    }
}

export default ParticleAnim;
