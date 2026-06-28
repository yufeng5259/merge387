import { _decorator, Component, Tween, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScaleRotateAnim')
export class ScaleRotateAnim extends Component {
    @property
    public minX = 1;

    @property
    public maxX = 1;

    @property
    public minY = 1;

    @property
    public maxY = 1;

    @property
    public fromRotation = 0;

    @property
    public toRotation = 0;

    @property
    public time = 0;

    @property
    public delay = 0;

    private playing = true;

    public start(): void {
        this.playing = true;
        this.node.setScale(this.minX, this.minY, this.node.scale.z);
        this.node.angle = this.fromRotation;
        this.scheduleOnce(() => {
            this.playing = false;
            this.startLoop();
        }, Math.max(0, this.delay));
    }

    public update(_dt: number): void {
        if (this.playing) {
            return;
        }

        this.startLoop();
    }

    public stop(): void {
        this.scheduleOnce(() => {
            this.stopNow();
        }, 0.1);
    }

    public onDisable(): void {
        this.stopNow();
    }

    public onDestroy(): void {
        this.stopNow();
    }

    private startLoop(): void {
        if (this.playing) {
            return;
        }

        this.playing = true;
        this.schedule(this.playOnce, 4);
    }

    private playOnce(): void {
        Tween.stopAllByTarget(this.node);
        const z = this.node.scale.z;
        const duration = Math.max(0, this.time);

        tween(this.node)
            .to(duration, { scale: new Vec3(this.maxX, this.maxY, z) }, { easing: 'quadInOut' })
            .to(duration, { scale: new Vec3(this.minX, this.minY, z) }, { easing: 'quadInOut' })
            .start();

        tween(this.node)
            .to(duration, { angle: this.toRotation }, { easing: 'quadInOut' })
            .to(duration, { angle: this.fromRotation }, { easing: 'quadInOut' })
            .start();
    }

    private stopNow(): void {
        Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        this.playing = false;
    }
}

export default ScaleRotateAnim;
