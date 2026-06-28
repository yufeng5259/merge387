import { _decorator, Component, Tween, tween, UISkew } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SkewAnim')
export class SkewAnim extends Component {
    @property
    public minX = 0;

    @property
    public maxX = 0;

    @property
    public minY = 0;

    @property
    public maxY = 0;

    @property
    public time = 0;

    @property
    public delay = 0;

    private playing = true;
    private skew: UISkew | null = null;

    public start(): void {
        this.playing = true;
        this.ensureSkew().setSkew(this.minX, this.minY);
        this.scheduleOnce(() => {
            this.playing = false;
        }, Math.max(0, this.delay));
    }

    public update(_dt: number): void {
        if (this.playing) return;
        this.play();
    }

    public stop(): void {
        this.scheduleOnce(() => {
            this.stopNow();
        }, 0.1);
    }

    private play(): void {
        this.playing = true;
        const skew = this.ensureSkew();
        Tween.stopAllByTarget(skew);

        const duration = Math.max(0, this.time);
        const cycle = tween()
            .to(duration, { x: this.maxX, y: this.maxY }, { easing: 'quadInOut' })
            .to(duration, { x: this.minX, y: this.minY }, { easing: 'quadInOut' })
            .delay(Math.max(0, this.delay));

        tween(skew).repeatForever(cycle).start();
    }

    private stopNow(): void {
        if (this.skew) Tween.stopAllByTarget(this.skew);
        this.unscheduleAllCallbacks();
        this.playing = true;
    }

    private ensureSkew(): UISkew {
        if (!this.skew) this.skew = this.node.getComponent(UISkew) || this.node.addComponent(UISkew);
        return this.skew;
    }
}

export default SkewAnim;
