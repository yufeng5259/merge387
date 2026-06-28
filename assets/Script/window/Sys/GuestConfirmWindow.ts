import { _decorator, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('GuestConfirmWindow')
export default class GuestConfirmWindow extends UIWindow {
    static windowPath = 'Sys/GuestConfirmWindow';

    @property(Node)
    btnApple: Node | null = null;

    guestCallback: any = null;
    connectCallback: any = null;
    appstoreCallback: any = null;

    onShow(param: any) {
        this.guestCallback = param.guestCallback;
        this.connectCallback = param.connectCallback;
        this.appstoreCallback = param.appstoreCallback;
        GameKit.BackKeyManager.registerBackEvent();

        this.btnApple.active = AppKit.SdkManager.IsIos() && AppKit.NativeWrap.callDirect('SDKHandleClass', 'loginWithAppStoreEnabled');
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    guest() {
        if (this.guestCallback) this.guestCallback();
        this.closeAnim();
    }

    connect() {
        if (this.connectCallback) this.connectCallback();
        this.closeAnim();
    }

    connectWithApple() {
        if (this.appstoreCallback) this.appstoreCallback();
        this.closeAnim();
    }
}
