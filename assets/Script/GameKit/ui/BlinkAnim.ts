import { _decorator, Component, Tween, tween, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BlinkAnim')
export class BlinkAnim extends Component {
    @property
    public minAlpha = 75;

    @property
    public maxAlpha = 255;

    @property
    public duration = 1;

    @property
    public delay = 0;

    private executingFlag = false;
    private opacity: UIOpacity | null = null;

    public start(): void {
        this.executingFlag = false;
    }

    public update(): void {
        if (this.executingFlag) {
            return;
        }

        this.executingFlag = true;
        const opacity = this.ensureOpacity();
        Tween.stopAllByTarget(opacity);

        const cycle = tween(opacity)
            .to(Math.max(0, this.duration), { opacity: this.minAlpha }, { easing: 'quadInOut' })
            .to(Math.max(0, this.duration), { opacity: this.maxAlpha }, { easing: 'quadInOut' })
            .delay(Math.max(0, this.delay));

        tween(opacity)
            .repeatForever(cycle)
            .start();
    }

    public stop(): void {
        this.scheduleOnce(() => {
            this.stopBlink();
            this.unscheduleAllCallbacks();
        }, 0.1);
    }

    protected onDisable(): void {
        this.stopBlink();
    }

    protected onDestroy(): void {
        this.stopBlink();
    }

    private ensureOpacity(): UIOpacity {
        if (!this.opacity || !this.opacity.isValid) {
            this.opacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);
        }

        return this.opacity;
    }

    private stopBlink(): void {
        const opacity = this.opacity || this.getComponent(UIOpacity);
        if (opacity) {
            Tween.stopAllByTarget(opacity);
        }
        this.executingFlag = false;
    }
}

export default BlinkAnim;
