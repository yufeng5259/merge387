import { _decorator, Label, Sprite } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ContentDesWindow')
export default class ContentDesWindow extends UIWindow {
    static windowPath = 'Item/ContentDesWindow';

    @property(Label)
    labelName: Label | null = null;

    @property(Label)
    lebelDes: Label | null = null;

    @property(Label)
    labelNum: Label | null = null;

    @property(Sprite)
    icon: Sprite | null = null;

    content: any = null;

    onShow(showParams: any) {
        this.content = showParams.content;

        this.labelName.string = this.content.Name();
        this.lebelDes.string = this.content.Desc();
        this.labelNum.string = this.content.Count() > 0 ? GameKit.i18n.t('multiplyx') + BigNumber.format(this.content.Count()) : '';
        this.content.Icon(this.icon);
    }

    onClose() {
        cce.releaseSpriteFrame(this.icon);
    }

    onConfirm() {
        this.close();
    }
}
