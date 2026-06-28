import { _decorator, Button, Label, Node, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('DialogWindow')
export default class DialogWindow extends UIWindow {
    public static windowPath = 'Common/DialogWindow';

    @property(Node)
    titleNode: Node | null = null;

    @property(Label)
    titleLbl: Label | null = null;

    @property(Label)
    labelMsg: Label | null = null;

    @property(Node)
    btnConfirm: Node | null = null;

    @property(Node)
    btnCancel: Node | null = null;

    @property(Label)
    labelConfirm: Label | null = null;

    @property(Label)
    labelCancel: Label | null = null;

    confirmFunc: Function | null = null;
    cancelFunc: Function | null = null;
    confirmStr: string | null = null;
    cancelStr: string | null = null;
    countDown: number | null = null;
    titleStr: string | null = null;
    inCountDown: number | null = null;
    oldConfirmStr: string | null = null;

    onShow(showParams: any) {
        if (this.labelMsg) this.labelMsg.string = showParams.msg || '';
        this.confirmFunc = showParams.confirmFunc;
        this.cancelFunc = showParams.cancelFunc;
        this.confirmStr = showParams.confirmStr;
        this.cancelStr = showParams.cancelStr;
        this.countDown = showParams.countDown;
        this.titleStr = showParams.titleStr;

        if (this.cancelFunc == null) {
            if (this.btnCancel) this.btnCancel.active = false;
            if (this.btnConfirm) this.btnConfirm.setPosition(new Vec3(0, this.btnConfirm.position.y, this.btnConfirm.position.z));
        }
        if (this.titleNode) this.titleNode.active = false;
        if (this.titleStr) {
            if (this.titleNode) this.titleNode.active = true;
            if (this.titleLbl) this.titleLbl.string = this.titleStr;
        }
        if (this.labelConfirm) this.labelConfirm.string = GameKit.i18n.t('YES');
        if (this.confirmStr && this.labelConfirm) {
            this.labelConfirm.string = this.confirmStr;
        }

        if (this.labelCancel) this.labelCancel.string = GameKit.i18n.t('NO');
        if (this.cancelStr && this.labelCancel) {
            this.labelCancel.string = this.cancelStr;
        }

        if (this.countDown && this.labelConfirm && this.btnConfirm) {
            this.inCountDown = this.countDown;
            this.oldConfirmStr = this.labelConfirm.string;

            let confirmButton = this.btnConfirm.getComponent(Button);
            if (confirmButton) confirmButton.interactable = false;
            this.labelConfirm.string = this.inCountDown.toString();

            this.schedule(() => {
                if (this.inCountDown == null || !this.labelConfirm || !this.btnConfirm) return;
                this.inCountDown--;
                this.labelConfirm.string = this.inCountDown.toString();
                if (this.inCountDown == 0) {
                    this.labelConfirm.string = this.oldConfirmStr || '';
                    this.oldConfirmStr = null;
                    let button = this.btnConfirm.getComponent(Button);
                    if (button) button.interactable = true;
                }
            }, 1, this.inCountDown - 1);
        }

        GameKit.BackKeyManager.registerBackEvent(() => {
            if (this.inCountDown) return;
            GameKit.SoundManager.playSound('se_back');
            if (this.cancelFunc == null) this.onConfirm();
            else this.onCancel();
        });

        GameKit.SoundManager.playSound('se_open');
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
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

    static Show(msg: any, conc: any, canc: any, confirmStr: any = null, cancelStr: any = null) {
        UIRoot.instance.openChildWindow('DialogWindow', { msg: msg, confirmFunc: conc, cancelFunc: canc, confirmStr: confirmStr, cancelStr: cancelStr });
    }
}

global.DialogWindow = DialogWindow;
