import { _decorator, Component, Tween, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('LoopMoveAnim')
export class LoopMoveAnim extends Component {
    @property
    public disx = 0;

    @property
    public disy = 0;

    @property
    public time = 0;

    @property
    public delay = 0;

    private oldPosition = new Vec3();
    private playing = true;

    public onLoad(): void {
        this.oldPosition.set(this.node.position);
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
        if (!this.playing) this.play();
    }

    public stop(): void {
        this.scheduleOnce(() => {
            this.stopNow();
        }, 0.1);
    }

    private play(): void {
        if (this.playing) return;

        this.playing = true;
        Tween.stopAllByTarget(this.node);

        const forward = new Vec3(this.disx, this.disy, 0);
        const backward = new Vec3(-this.disx, -this.disy, 0);
        const cycle = tween()
            .by(Math.max(0, this.time), { position: forward })
            .by(Math.max(0, this.time), { position: backward })
            .delay(Math.max(0, this.delay));

        tween(this.node)
            .repeatForever(cycle)
            .start();
    }

    private stopNow(): void {
        Tween.stopAllByTarget(this.node);
        this.node.setPosition(this.oldPosition);
        this.unscheduleAllCallbacks();
        this.playing = false;
    }
}

export default LoopMoveAnim;
