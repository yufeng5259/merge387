import { _decorator, Component, Tween, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('RotateAnim')
export class RotateAnim extends Component {
    @property
    public time = 0;

    @property
    public delay = 0;

    @property
    public clockwise = true;

    @property
    public outDegree = 0;

    @property
    public step = 0;

    private oldRotate = 0;
    private playing = true;

    public onLoad(): void {
        this.oldRotate = this.node.angle;
    }

    public start(): void {
        this.playing = true;
        this.scheduleOnce(() => {
            this.playing = false;
            this.play();
        }, Math.max(0, this.delay));
    }

    public onDisable(): void {
        this.stopNow();
    }

    public onDestroy(): void {
        this.stopNow();
    }

    public update(_dt: number): void {
        if (!this.playing) {
            this.play();
        }
    }

    public stop(): void {
        this.scheduleOnce(() => {
            this.stopNow();
        }, 0.1);
    }

    private play(): void {
        if (this.playing) {
            return;
        }

        this.playing = true;
        Tween.stopAllByTarget(this.node);

        if (this.step === 0) {
            if (this.outDegree !== 0) {
                this.playSwing();
            } else {
                this.playFullRotation();
            }
        } else {
            this.playSteppedRotation();
        }
    }

    private playSwing(): void {
        const direction = this.clockwise ? 1 : -1;
        const halfDegree = this.outDegree / 2 * direction;
        const cycle = tween()
            .by(Math.max(0, this.time / 2), { angle: halfDegree }, { easing: 'quadOut' })
            .by(Math.max(0, this.time), { angle: -this.outDegree * direction }, { easing: 'quadInOut' })
            .by(Math.max(0, this.time / 2), { angle: halfDegree }, { easing: 'quadIn' })
            .delay(Math.max(0, this.delay));

        tween(this.node)
            .repeatForever(cycle)
            .start();
    }

    private playFullRotation(): void {
        const degree = this.clockwise ? 360 : -360;
        const cycle = tween()
            .by(Math.max(0, this.time), { angle: degree })
            .delay(Math.max(0, this.delay));

        tween(this.node)
            .repeatForever(cycle)
            .start();
    }

    private playSteppedRotation(): void {
        const degree = this.clockwise ? this.step : -this.step;
        const cycle = tween()
            .by(0.0001, { angle: degree })
            .delay(Math.max(0, this.time * this.step / 360));

        tween(this.node)
            .repeatForever(cycle)
            .start();
    }

    private stopNow(): void {
        Tween.stopAllByTarget(this.node);
        this.node.angle = this.oldRotate;
        this.unscheduleAllCallbacks();
        this.playing = false;
    }
}

export default RotateAnim;
