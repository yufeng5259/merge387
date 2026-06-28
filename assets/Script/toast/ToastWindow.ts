import { _decorator, Animation, isValid, Label } from 'cc';
import { IToast } from './IToast';

const { ccclass, property } = _decorator;

@ccclass('ToastWindow')
export class ToastWindow extends IToast {
    @property(Label)
    public msgLabel: Label | null = null;

    @property(Animation)
    public additionAnim: Animation | null = null;

    public static prefabResPath = 'toast/ToastWindow';

    show(messageOrOptions: any, params?: any) {
        const message = typeof messageOrOptions === 'object'
            ? messageOrOptions && messageOrOptions.message
            : messageOrOptions;
        if (this.msgLabel) this.msgLabel.string = String(message || '');

        if (this.additionAnim) {
            this.additionAnim.once(Animation.EventType.FINISHED, () => this.close());
            this.additionAnim.play();
            return;
        }

        const duration = Number((params && params.duration) || (messageOrOptions && messageOrOptions.duration)) || 0;
        if (duration > 0) this.scheduleOnce(() => this.close(), duration);
    }

    close() {
        if (!this.node || !isValid(this.node)) return;
        this.node.removeFromParent();
        this.node.destroy();
    }
}

export default ToastWindow;
