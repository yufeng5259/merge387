import { _decorator, Button, Label, Node, RichText, Sprite } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('MergeDialogWindow')
export default class MergeDialogWindow extends UIWindow {
    public static windowPath = 'Merge/MergeDialogWindow';

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

    @property
    modelConfirm: any = null;

    @property(Label)
    labelConfirm: Label | null = null;

    @property(Label)
    labelCancel: Label | null = null;

    @property(Sprite)
    icon: Sprite | null = null;

    @property(Sprite)
    icon_bubble: Sprite | null = null;

    @property(RichText)
    richText: RichText | null = null;

    confirmFunc: any = null;
    cancelFunc: any = null;
    confirmStr: any = null;
    cancelStr: any = null;
    countDown: any = null;
    titleStr: any = null;
    contentConfirmStr: any = null;
    inCountDown: any = null;
    oldConfirmStr: any = null;

    onShow(showParams: any) {
        showParams = showParams || {};

        const richTextStr = showParams.richTextStr || showParams.richTextMsg || '';
        const showRichText = !!showParams.showRichText && !!richTextStr;

        if (this.labelMsg) {
            this.labelMsg.node.active = !showRichText;
            this.labelMsg.string = showRichText ? '' : (showParams.msg || '');
        }
        if (this.richText) {
            this.richText.node.active = showRichText;
            this.richText.string = showRichText ? richTextStr : '';
        }

        if (this.icon) {
            this.icon.node.active = showRichText;
            this.icon.spriteFrame = showParams.iconSpriteFrame ? showParams.iconSpriteFrame : null;
        }

        if (this.icon_bubble) {
            if (showParams.showBubble !== undefined) {
                this.icon_bubble.node.active = showParams.showBubble;
            } else {
                this.icon_bubble.node.active = showRichText;
            }
        }

        this.confirmFunc = showParams.confirmFunc;
        this.cancelFunc = showParams.cancelFunc;
        this.confirmStr = showParams.confirmStr;
        this.cancelStr = showParams.cancelStr;
        this.countDown = showParams.countDown;
        this.titleStr = showParams.titleStr;
        this.contentConfirmStr = showParams.contentConfirmStr;

        if (this.cancelFunc == null) {
            if (this.btnCancel) this.btnCancel.active = false;
            if (this.btnConfirm) this.btnConfirm.setPosition(0, this.btnConfirm.position.y, this.btnConfirm.position.z);
        }
        if (this.titleNode) this.titleNode.active = false;
        if (this.titleStr && this.titleNode && this.titleLbl) {
            this.titleNode.active = true;
            this.titleLbl.string = this.titleStr;
        }
        if (this.labelConfirm) {
            this.labelConfirm.node.active = true;
            this.labelConfirm.string = GameKit.i18n.t('YES');
            if (this.confirmStr) {
                this.labelConfirm.string = this.confirmStr;
            }
        }

        if (this.modelConfirm) {
            this.modelConfirm.node.active = false;
            if (this.contentConfirmStr && this.labelConfirm) {
                this.modelConfirm.show(Game.Content.FromString(this.contentConfirmStr));
                this.modelConfirm.node.active = true;
                this.labelConfirm.node.active = false;
            }
        }

        if (this.labelCancel) {
            this.labelCancel.string = GameKit.i18n.t('NO');
            if (this.cancelStr) {
                this.labelCancel.string = this.cancelStr;
            }
        }

        if (this.countDown && this.labelConfirm && this.btnConfirm) {
            this.inCountDown = this.countDown;
            this.oldConfirmStr = this.labelConfirm.string;

            const confirmButton = this.btnConfirm.getComponent(Button);
            if (confirmButton) confirmButton.interactable = false;
            this.labelConfirm.string = this.inCountDown.toString();

            this.schedule(() => {
                this.inCountDown--;
                if (!this.labelConfirm || !this.btnConfirm) return;
                this.labelConfirm.string = this.inCountDown.toString();
                if (this.inCountDown === 0) {
                    this.labelConfirm.string = this.oldConfirmStr;
                    this.oldConfirmStr = null;
                    const button = this.btnConfirm.getComponent(Button);
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

    public static Show(msg: any, conc: any, canc: any, confirmStr: any = null, cancelStr: any = null, options: any = null) {
        const showParams = options || {};
        showParams.msg = msg;
        showParams.confirmFunc = conc;
        showParams.cancelFunc = canc;
        showParams.confirmStr = confirmStr;
        showParams.cancelStr = cancelStr;
        UIRoot.instance.openChildWindow('MergeDialogWindow', showParams);
    }
}

(global as any).MergeDialogWindow = MergeDialogWindow;
