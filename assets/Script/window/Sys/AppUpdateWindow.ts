import { _decorator, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('AppUpdateWindow')
export default class AppUpdateWindow extends UIWindow {
    static windowPath = 'Sys/AppUpdateWindow';

    @property(Node)
    btnClose: Node | null = null;

    onShow(showParams: any) {
        if (AppKit.NativeWrap.mustUpdateNewVersion()) {
            this.btnClose.active = false;
        }
        GameKit.BackKeyManager.registerBackEvent();
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    callClose() {
        this.closeAnim();
        AppKit.LogEventWrap.logEvent('app_update_close', { version: AppKit.NativeWrap.getVersion() });
    }

    callGo() {
        AppKit.NativeWrap.openMarket();
        AppKit.LogEventWrap.logEvent('app_update_go', { version: AppKit.NativeWrap.getVersion() });
    }
}
