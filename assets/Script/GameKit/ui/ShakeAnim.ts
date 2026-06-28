import { _decorator, Component, Tween, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ShakeAnim')
export class ShakeAnim extends Component {
    @property
    public time = 0;

    @property
    public wait = 0;

    @property
    public delay = 0;

    @property
    public degree = 5;

    private playing = true;

    public start(): void {
        this.playing = true;
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
        Tween.stopAllByTarget(this.node);

        const eighth = Math.max(0, this.time / 8);
        const quarter = Math.max(0, this.time / 4);
        const cycle = tween()
            .to(eighth, { angle: -this.degree })
            .to(quarter, { angle: this.degree })
            .to(quarter, { angle: -this.degree })
            .to(quarter, { angle: this.degree })
            .to(eighth, { angle: 0 })
            .delay(Math.max(0, this.wait));

        tween(this.node).repeatForever(cycle).start();
    }

    private stopNow(): void {
        Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        this.playing = true;
    }
}

export default ShakeAnim;
