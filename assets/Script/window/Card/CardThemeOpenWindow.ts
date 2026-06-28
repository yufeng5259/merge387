import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('CardThemeOpenWindow')
export default class CardThemeOpenWindow extends UIWindow {
    static windowPath = 'Card/CardThemeOpenWindow';

    childWindowChain: any = null;
    meta: any = null;

    onShow(showParams: any) {
        console.log('theme card:', showParams.meta.Card_issue());
        this.meta = showParams.meta;
    }

    onClose() {
    }

    callClose() {
        this.closeAnim(() => {
        });
    }

    callGo() {
        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        this.closeAnim();
        UIRoot.instance.openChildWindow('CardAllSetWindow', { Card_issue: this.meta.Card_issue(), showCallback: (wnd) => {
            wnd.addOnCloseFunc(() => {
            });
        } });
    }
}
