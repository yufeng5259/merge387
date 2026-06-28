import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('MessageMailDetailWindow')
export default class MessageMailDetailWindow extends UIWindow {
    static windowPath = 'Menu/MessageMailDetailWindow';

    @property(Label)
    labelTitle: Label | null = null;

    @property(Label)
    labelMsg: Label | null = null;

    onShow(showParams: any) {
        if (!showParams.present) return;
        if (showParams.present.title) this.labelTitle.string = showParams.present.title;
        if (showParams.present.msg) this.labelMsg.string = showParams.present.msg;
    }

    call_close() {
        this.closeAnim();
    }
}
