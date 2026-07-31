import { _decorator, Camera, Canvas, Component, Node, Prefab, Rect, UITransform, Vec3, instantiate, isValid, js, tween, view } from 'cc';
import { BlockInputEvents, Button, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

let canMultiWindow = ["DialogWindow", "GetRewardWindow", "SimpleRewardWindow", "MergeTypeWindow"];

@ccclass('UIRoot')
export class UIRoot extends Component {
    @property
    public cantClick: any = null;

    @property(Node)
    public loadingWindow: Node | null = null;

    @property(Camera)
    public mainCamera: Camera | null = null;

    @property(Node)
    public bl_top: Node | null = null;

    @property(Node)
    public bl_bottom: Node | null = null;

    @property(Node)
    public bl_left: Node | null = null;

    @property(Node)
    public bl_right: Node | null = null;

    public static instance: UIRoot | null = null;

    public winSize: Rect = new Rect();
    public loadOver = false;
    public winPres: Record<string, Prefab> = {};
    public windowInstance: Record<string, any> = {};
    public toastInstance: Record<string, any> = {};
    public currentWindowName = '';
    public currentWindow: any = null;
    public stopShowWindow = false;

    onLoad() {
        const ssize = view.getVisibleSize();
        this.winSize = new Rect(0, 0, ssize.width, ssize.height);
        const canvas = this.node.getComponent(Canvas);
        const transform = this.node.getComponent(UITransform)!;

        if (ssize.height / ssize.width > 1136 / 640) {
            if (canvas) {
                (canvas as any).fitHeight = false;
                (canvas as any).fitWidth = true;
            }
            this.winSize = new Rect(this.node.position.x, this.node.position.y, transform.contentSize.width, transform.contentSize.height);
            if (ssize.height / ssize.width > 1386 / 640) {
                this.winSize.height = 1386 * ssize.width / 640;
            }
        } else if (ssize.height / ssize.width < 1136 / 640) {
            this.winSize = new Rect(this.node.position.x, this.node.position.y, transform.contentSize.width, transform.contentSize.height);
            if (ssize.height / ssize.width < 1136 / 852) {
                this.winSize.width = 852 * ssize.height / 1136;
            }
        } else {
            this.winSize = new Rect(this.node.position.x, this.node.position.y, transform.contentSize.width, transform.contentSize.height);
        }

        if (this.bl_top) {
            this.bl_top.active = true;
            this.bl_top.setPosition(ssize.width / 2, (ssize.height + this.winSize.height) / 2);
        }
        if (this.bl_bottom) {
            this.bl_bottom.active = true;
            this.bl_bottom.setPosition(ssize.width / 2, (ssize.height - this.winSize.height) / 2);
        }
        if (this.bl_left) {
            this.bl_left.active = true;
            this.bl_left.setPosition((ssize.width - this.winSize.width) / 2, ssize.height / 2);
        }
        if (this.bl_right) {
            this.bl_right.active = true;
            this.bl_right.setPosition((ssize.width + this.winSize.width) / 2, ssize.height / 2);
        }

        UIRoot.instance = this;
        (global as any).UIRoot = UIRoot;
        (window as any).UIRoot = UIRoot;
        this.loadOver = true;
        this.winPres = {};
        this.windowInstance = {};
        this.toastInstance = {};
        this.currentWindowName = '';
        this.currentWindow = null;
    }

    start() {
    }

    getOrAddWindowComponent(wnd: Node, windowName: string): any {
        const windowClass = js.getClassByName(windowName) as any;
        let windowC = windowClass ? wnd.getComponent(windowClass) : null;
        if (!windowC) windowC = wnd.getComponent(windowName);
        if (!windowC && windowClass) windowC = wnd.addComponent(windowClass);
        return windowC;
    }

    preloadWindow(windowName: string, callback: Function | null = null) {
        if (AppKit.SdkManager.IsNative()) return;
        const windowClass = js.getClassByName(windowName) as any;
        let windowPath = windowName;
        if (windowClass && windowClass.windowPath) windowPath = windowClass.windowPath;
        const resName = 'window/' + windowPath;
        cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err || !winPre) return;
            (winPre as any).data.active = false;
            const wnd = instantiate(winPre);
            wnd.parent = this.node;
            wnd.setPosition(3000, 3000);
            wnd.getComponent(UITransform)!.setContentSize(2, 2);

            const opacity = wnd.getComponent(UIOpacity) || wnd.addComponent(UIOpacity);
            opacity.opacity = 0;
            wnd.getComponentsInChildren(Button).forEach(button => button.enabled = false);
            wnd.getComponentsInChildren(BlockInputEvents).forEach(blockInput => blockInput.enabled = false);

            wnd.active = true;
            AppMain.instance.scheduleOnce(() => {
                wnd.active = false;
                wnd.destroy();
                cce.releaseRes(resName, Prefab);
            }, 0.8);
            if (callback != null) callback(wnd);
        });
    }

    openWindow(windowName: string, showParams: any = {}) {
        showParams = showParams || {};
        if (this.currentWindowName === windowName) {
            const _showParams = showParams || {};
            _showParams.isFirst = false;
            if (showParams.preshowCallback != null) showParams.preshowCallback();
            if (this.currentWindow) this.currentWindow._onWindowShow(_showParams);
            if (showParams.showCallback != null) showParams.showCallback(this.currentWindow);
            return;
        }

        this.ShowCantClick();
        const showWindow = (winPre: Prefab) => {
            if (this.currentWindow != null) {
                this.currentWindow.close();
                this.currentWindow = null;
                if (wxTools.usewx) wx.triggerGC();
            }
            this.currentWindowName = windowName;
            if (showParams.preshowCallback != null) showParams.preshowCallback();
            const wnd = instantiate(winPre);
            const windowC = this.getOrAddWindowComponent(wnd, this.currentWindowName);
            this.currentWindow = windowC;
            this.windowInstance[this.currentWindowName] = windowC;
            wnd.parent = this.node;
            wnd.getComponent(UITransform)!.setContentSize(this.winSize.width, this.winSize.height);
            windowC._windowName = this.currentWindowName;
            wnd.active = true;
            windowC._onWindowShow(showParams);
            if (showParams.showCallback != null) showParams.showCallback(windowC);
            this.CloseCantClick();
            Logs.Debug('Main Window Show', windowName, wnd.uuid);
        };

        if (this.winPres.hasOwnProperty(windowName)) {
            showWindow(this.winPres[windowName]);
        } else {
            let windowPath = windowName;
            if (showParams.meta) {
                try {
                    const windowClass = js.getClassByName(windowName) as any;
                    if (windowClass && typeof windowClass.SetSkin === 'function') {
                        windowClass.SetSkin(showParams.meta);
                    }
                } catch (error) {
                }
            }
            const windowClass = js.getClassByName(windowName) as any;
            if (windowClass && windowClass.windowPath) windowPath = windowClass.windowPath;
            const resName = 'window/' + windowPath;
            cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
                if (err) {
                    Logs.Error('openWindow windowPath' + windowPath + (err.message || err));
                    DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                        this.openWindow(windowName, showParams);
                    });
                    this.CloseCantClick();
                    return;
                }
                if (winPre == null) {
                    this.CloseCantClick();
                    return;
                }
                (winPre as any).data.active = false;
                if (!AppKit.SdkManager.IsNative()) this.winPres[windowName] = winPre;
                showWindow(winPre);
            });
        }
    }

    openChildWindow(windowName: string, showParams: any = {}) {
        showParams = showParams || {};
        if (!~canMultiWindow.indexOf(windowName) && this.windowInstance[windowName] != null) {
            const _showParams = showParams || {};
            _showParams.isFirst = false;
            if (showParams.preshowCallback != null) showParams.preshowCallback();
            this.windowInstance[windowName].show(_showParams);
            if (showParams.showCallback != null) showParams.showCallback(this.windowInstance[windowName]);
            return this.windowInstance[windowName];
        }

        this.windowInstance[windowName] = { isFake: true, show: function() {}, close: function() {} };
        this.ShowCantClick();
        const showWindow = (winPre: Prefab) => {
            if (this.stopShowWindow) {
                this.CloseCantClick();
                return;
            }
            if (showParams.preshowCallback != null) showParams.preshowCallback();
            const wnd = instantiate(winPre);
            const windowC = this.getOrAddWindowComponent(wnd, windowName);
            this.windowInstance[windowName] = windowC;
            if (this.currentWindow && this.currentWindow._onAddChildWindow) this.currentWindow._onAddChildWindow(windowC);
            wnd.parent = this.node;
            wnd.getComponent(UITransform)!.setContentSize(this.winSize.width, this.winSize.height);
            windowC._windowName = windowName;
            windowC.isChild = true;
            windowC.parentWindow = this.currentWindow;
            wnd.active = true;
            windowC._onWindowShow(showParams);
            if (showParams.showCallback != null) showParams.showCallback(windowC);
            this.CloseCantClick();
            Logs.Debug('Child Window Show', windowName, wnd.uuid);
        };

        if (this.winPres.hasOwnProperty(windowName)) {
            showWindow(this.winPres[windowName]);
        } else {
            let windowPath = windowName;
            if (showParams.meta) {
                try {
                    const windowClass = js.getClassByName(windowName) as any;
                    if (windowClass && typeof windowClass.SetSkin === 'function') {
                        windowClass.SetSkin(showParams.meta);
                    }
                } catch (error) {
                }
            }
            const windowClass = js.getClassByName(windowName) as any;
            if (windowClass && windowClass.windowPath) windowPath = windowClass.windowPath;
            const resName = 'window/' + windowPath;
            cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
                if (err) {
                    Logs.Error('openChildWindow windowPath' + windowPath + (err.message || err));
                    DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                        this.openChildWindow(windowName, showParams);
                    }, nullFunction);
                    this.CloseCantClick();
                    return;
                }
                if (winPre == null) {
                    this.CloseCantClick();
                    return;
                }
                (winPre as any).data.active = false;
                if (!AppKit.SdkManager.IsNative()) this.winPres[windowName] = winPre;
                showWindow(winPre);
            });
        }
    }

    openModelWindow(windowName: string, showParams: any = {}) {
        showParams = showParams || {};
        if (!~canMultiWindow.indexOf(windowName) && this.windowInstance[windowName] != null) {
            const _showParams = showParams || {};
            _showParams.isFirst = false;
            if (showParams.preshowCallback != null) showParams.preshowCallback();
            this.windowInstance[windowName].show(_showParams);
            if (showParams.showCallback != null) showParams.showCallback(this.windowInstance[windowName]);
            return this.windowInstance[windowName];
        }

        this.windowInstance[windowName] = { isFake: true, show: function() {}, close: function() {} };
        this.ShowCantClick();
        const showWindow = (winPre: Prefab) => {
            if (this.stopShowWindow) {
                this.CloseCantClick();
                return;
            }
            if (showParams.preshowCallback != null) showParams.preshowCallback();
            const wnd = instantiate(winPre);
            const windowC = this.getOrAddWindowComponent(wnd, windowName);
            this.windowInstance[windowName] = windowC;
            wnd.parent = this.node;
            wnd.getComponent(UITransform)!.setContentSize(this.winSize.width, this.winSize.height);
            windowC._windowName = windowName;
            windowC.isChild = true;
            wnd.active = true;
            windowC._onWindowShow(showParams);
            if (showParams.showCallback != null) showParams.showCallback(windowC);
            this.CloseCantClick();
            Logs.Debug('Model Window Show', windowName, wnd.uuid);
        };

        if (this.winPres.hasOwnProperty(windowName)) {
            showWindow(this.winPres[windowName]);
        } else {
            let windowPath = windowName;
            const windowClass = js.getClassByName(windowName) as any;
            if (windowClass && windowClass.windowPath) windowPath = windowClass.windowPath;
            const resName = 'window/' + windowPath;
            cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
                if (err) {
                    Logs.Error('openModelWindow windowPath' + windowPath + (err.message || err));
                    DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                        this.openModelWindow(windowName, showParams);
                    }, nullFunction);
                    this.CloseCantClick();
                    return;
                }
                if (winPre == null) {
                    this.CloseCantClick();
                    return;
                }
                (winPre as any).data.active = false;
                if (!AppKit.SdkManager.IsNative()) this.winPres[windowName] = winPre;
                showWindow(winPre);
            });
        }
    }

    closeChildWindow(windowName: string) {
        if (this.windowInstance.hasOwnProperty(windowName) && this.windowInstance[windowName] != null) {
            this.windowInstance[windowName].close();
        }
    }

    GetWindow(windowName: string) {
        if (this.windowInstance.hasOwnProperty(windowName) && this.windowInstance[windowName] != null) {
            return this.windowInstance[windowName];
        }
        return null;
    }

    ShowCantClick(noloading?: any) {
        if (this.cantClick && typeof this.cantClick.show === 'function') this.cantClick.show(noloading);
    }

    CloseCantClick() {
        if (this.cantClick && typeof this.cantClick.close === 'function') this.cantClick.close();
    }

    ScreenShake() {
        const target = GamePlay.instance?.node as Node | undefined;
        if (!target) return;
        const origin = target.position.clone();
        const duration = 0.03;
        const distance = 6;
        const offsets = [
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
        ];
        let sequence = tween(target);
        offsets.forEach(([x, y]) => {
            sequence = sequence.by(duration, { position: new Vec3(x, y, 0) });
        });
        sequence.call(() => target.setPosition(origin)).start();
    }

    ShowToast(message: any, params: any = {}, toastViewName?: string) {
        if (message === undefined || message === null || String(message) === '') return;
        params = params || {};
        const windowName = toastViewName || 'ToastWindow';
        let existing = this.toastInstance[windowName];
        if (existing && (!existing.node || !isValid(existing.node))) {
            this.toastInstance[windowName] = null;
            existing = null;
        }
        if (existing && existing.show && !existing.isFake) {
            existing.show(String(message), params);
            return existing;
        }

        const ToastCls = js.getClassByName(windowName) as any;
        const resName = ToastCls && ToastCls.prefabResPath ? ToastCls.prefabResPath : 'toast/ToastWindow';
        const mountAndShow = (winPre: Prefab) => {
            const wnd = instantiate(winPre);
            wnd.parent = this.node;
            wnd.getComponent(UITransform)!.setContentSize(this.winSize.width, this.winSize.height);
            let comp: any = ToastCls ? wnd.getComponent(ToastCls) : null;
            if (!comp) comp = wnd.getComponent('ToastWindow');
            if (!comp) {
                wnd.destroy();
                return;
            }
            this.toastInstance[windowName] = comp;
            wnd.active = true;
            comp.show(String(message), params);
            return comp;
        };

        if (this.winPres.hasOwnProperty(windowName)) {
            return mountAndShow(this.winPres[windowName]);
        }

        cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err || !winPre) {
                if (err) Logs.Error('ShowToast load ' + resName, err.message || err);
                return;
            }
            (winPre as any).data.active = false;
            if (!AppKit.SdkManager.IsNative()) this.winPres[windowName] = winPre;
            mountAndShow(winPre);
        });
    }
}

(global as any).UIRoot = UIRoot;
(window as any).UIRoot = UIRoot;
export default UIRoot;
