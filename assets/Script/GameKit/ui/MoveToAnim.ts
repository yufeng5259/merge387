import { _decorator, Component, Tween, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

type MoveToCallback = ((param: unknown) => void) | null;

@ccclass('MoveToAnim')
export class MoveToAnim extends Component {
    @property
    public dis = 0;

    @property
    public disx = 0;

    @property
    public time = 0;

    @property
    public delay = 0;

    private oldPosition = new Vec3();
    private playing = true;
    private cb: MoveToCallback = null;
    private pam: unknown = null;

    public onLoad(): void {
        this.oldPosition.set(this.node.position);
    }

    public start(): void {
        this.playing = true;
    }

    public onStar(cb: MoveToCallback, pam: unknown): void {
        this.cb = cb;
        this.pam = pam;
        this.oldPosition.set(this.node.position);
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

        tween(this.node)
            .by(Math.max(0, this.time), { position: new Vec3(this.disx, this.dis, 0) }, { easing: 'quadInOut' })
            .delay(Math.max(0, this.delay))
            .call(() => {
                if (this.cb) this.cb(this.pam);
            })
            .start();
    }

    private stopNow(): void {
        Tween.stopAllByTarget(this.node);
        this.node.setPosition(this.oldPosition);
        this.unscheduleAllCallbacks();
        this.playing = false;
    }
}

export default MoveToAnim;
