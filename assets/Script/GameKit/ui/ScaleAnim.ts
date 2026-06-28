import { _decorator, Component, Tween, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScaleAnim')
export class ScaleAnim extends Component {
    @property
    public minX = 1;

    @property
    public maxX = 1;

    @property
    public minY = 1;

    @property
    public maxY = 1;

    @property
    public time = 0;

    @property
    public delay = 0;

    private playing = true;
    private isstop = false;

    public start(): void {
        this.play();
    }

    public onDisable(): void {
        this.stopNow();
    }

    public onDestroy(): void {
        this.stopNow();
    }

    public update(_dt: number): void {
        if (this.isstop || this.playing) {
            return;
        }

        this.startTween();
    }

    public stop(): void {
        this.isstop = true;
        this.scheduleOnce(() => {
            this.stopNow();
        }, 0.1);
    }

    public play(): void {
        this.isstop = false;
        this.playing = true;
        this.node.setScale(this.minX, this.minY, this.node.scale.z);
        this.scheduleOnce(() => {
            this.playing = false;
            this.startTween();
        }, Math.max(0, this.delay));
    }

    private startTween(): void {
        if (this.isstop || this.playing) {
            return;
        }

        this.playing = true;
        Tween.stopAllByTarget(this.node);

        const z = this.node.scale.z;
        const cycle = tween()
            .to(Math.max(0, this.time), { scale: new Vec3(this.maxX, this.maxY, z) }, { easing: 'quadInOut' })
            .to(Math.max(0, this.time), { scale: new Vec3(this.minX, this.minY, z) }, { easing: 'quadInOut' })
            .delay(Math.max(0, this.delay));

        tween(this.node)
            .repeatForever(cycle)
            .start();
    }

    private stopNow(): void {
        Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        this.playing = false;
    }
}

export default ScaleAnim;
