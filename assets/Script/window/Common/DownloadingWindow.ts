// 加载蒙板

import { _decorator, Node, ProgressBar, tween, UIOpacity } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('DownloadingWindow')
export default class DownloadingWindow extends UIWindow {
    static windowPath = "Common/DownloadingWindow";

    @property(Node)
    sp: Node = null;

    @property(ProgressBar)
    progress: ProgressBar = null;

    completeFunc = null;
    progressFunc = null;

    static Show(completeFunc, progressFunc) {
        UIRoot.instance.openChildWindow("DownloadingWindow", {completeFunc:completeFunc, progressFunc:progressFunc});
    }

    onShow(showParams) {
        this.completeFunc = showParams.completeFunc;
        this.progressFunc = showParams.progressFunc;

        GameKit.BackKeyManager.registerBackEvent();

        this.scheduleOnce(this.showModel.bind(this), 2);
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    onEnable() {
        tween(this.sp).stop();
        this.sp.active = false;
    }

    onDisable() {
    }

    showModel() {
        if (!this.sp.active) {
            this.sp.active = true;
            const opacity = this.sp.getComponent(UIOpacity) || this.sp.addComponent(UIOpacity);
            opacity.opacity = 0;
            tween(opacity).to(0.3, { opacity: 255 }).start();
        }
    }

    update() {
        this.progress.progress = this.progressFunc ? this.progressFunc() : 0;
        if (this.completeFunc && this.completeFunc()) {
            this.close();
        }
    }
}
