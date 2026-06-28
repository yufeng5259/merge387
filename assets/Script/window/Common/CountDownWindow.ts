import { _decorator, Label, Node, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('CountDownWindow')
export default class CountDownWindow extends UIWindow {
    static windowPath = 'Common/CountDownWindow';

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
        this.labelMsg.string = showParams.msg || '';
        this.confirmFunc = showParams.confirmFunc;
        this.cancelFunc = showParams.cancelFunc;

        if (this.cancelFunc == null) {
            this.btnCancel.active = false;
            this.btnConfirm.setPosition(new Vec3(0, this.btnConfirm.position.y, this.btnConfirm.position.z));
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

        this.labelTime.string = Math.ceil(this.time).toString();
        if (this.time <= 0) {
            if (this.cancelFunc != null) {
                this.cancelFunc();
            } else if (this.confirmFunc != null) {
                this.confirmFunc();
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

    static Show(time: any, msg: any, conc: any, canc: any) {
        UIRoot.instance.openChildWindow('CountDownWindow', { time: time, msg: msg, confirmFunc: conc, cancelFunc: canc });
    }
}

global.CountDownWindow = CountDownWindow;
