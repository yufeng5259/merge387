import { _decorator, Label, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('WatchDoubleSpinCoinWindow')
export default class WatchDoubleSpinCoinWindow extends UIWindow {
    public static windowPath = 'Other/WatchDoubleSpinCoinWindow';

    @property(Label)
    labelMsg: Label | null = null;

    @property(Node)
    btnConfirm: Node | null = null;

    @property(Node)
    btnCancel: Node | null = null;

    @property(Label)
    labelTime: Label | null = null;

    time = 0;
    confirmFunc: any = null;
    cancelFunc: any = null;

    onShow(showParams: any) {
        this.time = showParams.time;
        if (this.labelMsg) this.labelMsg.string = showParams.msg || '';
        this.confirmFunc = showParams.confirmFunc;
        this.cancelFunc = showParams.cancelFunc;

        if (this.cancelFunc == null) {
            if (this.btnCancel) this.btnCancel.active = false;
            if (this.btnConfirm) this.btnConfirm.setPosition(0, this.btnConfirm.position.y, this.btnConfirm.position.z);
        }

        GameKit.BackKeyManager.registerBackEvent(() => {
            GameKit.SoundManager.playSound('se_back');
            if (this.cancelFunc == null) this.onConfirm();
            else this.onCancel();
        });

        GameKit.SoundManager.playSound('se_open');
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    update(dt: number) {
        if (this.time <= 0) return;
        this.time -= dt;

        if (this.labelTime) this.labelTime.string = String(Math.ceil(this.time));
        if (this.time <= 0) {
            if (this.cancelFunc != null) {
                this.cancelFunc();
            } else {
                if (this.confirmFunc != null) {
                    this.confirmFunc();
                }
            }
            this.close();
        }
    }

    onConfirm() {
        if (this.confirmFunc != null) {
            this.confirmFunc();
        }
        this.close();
    }

    onCancel() {
        if (this.cancelFunc != null) {
            this.cancelFunc();
        }
        this.close();
    }
}
