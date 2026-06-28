import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('SuperShieldOpenWindow')
export default class SuperShieldOpenWindow extends UIWindow {
    static windowPath = 'Shop/SuperShieldOpenWindow';

    childWindowChain: any = null;

    onShow(showParams: any) {
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        this.closeAnim();
        UIRoot.instance.openChildWindow('ShopWindow', { showShield: true });
    }
}
