import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('FullLoadingWindow')
export default class FullLoadingWindow extends UIWindow {
    static windowPath = 'Common/FullLoadingWindow';
    static isshow = false;

    showFunc: any = null;

    onShow(showParams: any) {
        this.showFunc = addFunction(this.showFunc, showParams.showFunc);

        if (FullLoadingWindow.isshow) return;
        FullLoadingWindow.isshow = true;

        ChangeSceneManager.instance.show(this.showFunc);

        GameKit.BackKeyManager.registerBackEvent();
    }

    onClose() {
        FullLoadingWindow.isshow = false;
        ChangeSceneManager.instance.hide();

        GameKit.BackKeyManager.unregisterBackEvent();
    }

    static Show(cb: any) {
        UIRoot.instance.openModelWindow('FullLoadingWindow', { showFunc: cb });
    }

    static Hide() {
        UIRoot.instance.closeChildWindow('FullLoadingWindow');
    }
}
