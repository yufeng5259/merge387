import { _decorator, Node, tween, UIOpacity } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('LoadingWindow')
export default class LoadingWindow extends UIWindow {
    public static windowPath = 'Common/LoadingWindow';
    public static isshow = false;
    public static timeId: any = -1;

    @property(Node)
    sp: Node | null = null;

    onShow() {
        GameKit.BackKeyManager.registerBackEvent();
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    onEnable(showParams?: any) {
        if (!this.sp) return;
        tween(this.sp).stop();
        this.sp.active = false;
    }

    onDisable() {
        LoadingWindow.isshow = false;
        LoadingWindow.timeId = -1;
    }

    showModel() {
        if (!this.sp || this.sp.active) return;
        this.sp.active = true;
        const opacity = this.sp.getComponent(UIOpacity) || this.sp.addComponent(UIOpacity);
        opacity.opacity = 0;
        tween(opacity).to(0.3, { opacity: 255 }).start();
    }

    public static Show() {
        if (LoadingWindow.isshow) {
            clearTimeout(LoadingWindow.timeId);
            LoadingWindow.timeId = setTimeout(() => {
                LoadingWindow.Hide();
            }, G.Constance.loadingTime * 1000);
            return;
        }
        LoadingWindow.isshow = true;

        UIRoot.instance.loadingWindow.active = true;

        LoadingWindow.timeId = setTimeout(() => {
            LoadingWindow.Hide();
        }, G.Constance.loadingTime * 1000);

        GameKit.BackKeyManager.registerBackEvent();
    }

    public static Hide() {
        if (!LoadingWindow.isshow) return;
        LoadingWindow.isshow = false;

        if (LoadingWindow.timeId >= 0) clearTimeout(LoadingWindow.timeId);
        LoadingWindow.timeId = -1;

        UIRoot.instance.loadingWindow.active = false;
        GameKit.BackKeyManager.unregisterBackEvent();
    }
}

(global as any).LoadingWindow = LoadingWindow;
