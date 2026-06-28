import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('CardSystemOpenWindow')
export default class CardSystemOpenWindow extends UIWindow {
    static windowPath = 'Card/CardSystemOpenWindow';

    childWindowChain: any = null;

    onShow(showParams: any) {
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
        UIRoot.instance.openChildWindow('CardAllSetWindow', { showCallback: (wnd) => {
            wnd.addOnCloseFunc(() => {
            });
        } });
    }
}
