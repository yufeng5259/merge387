import { _decorator, Component, isValid } from 'cc';
import { EnterCloseAnim } from './EnterCloseAnim';

const { ccclass } = _decorator;

@ccclass('UIWindow')
export class UIWindow extends Component {
    public _windowName = '';
    public childWindows: any[] = [];
    public childWindowChain: any = null;
    public isChild = false;
    public parentWindow: any = null;
    public closeFuncs: Function[] = [];
    public closing = false;

    onShow (showParams?: any) {
    }

    onShowBack (showParams?: any) {
    }

    onClose () {
    }

    onHide () {
    }

    show (showParams?: any) {
        if (this.node) this.node.active = true;
        this.onShowBack(showParams);
    }

    hide () {
        if (this.node) this.node.active = false;
        this.onHide();
    }

    close () {
        if (!this.node || !isValid(this.node)) return;

        this.onClose();

        for (let i = this.childWindows.length - 1; i >= 0; i--) {
            let wnd = this.childWindows[i];
            if (wnd && typeof wnd.close === 'function') wnd.close();
        }

        let closeFuncs = this.closeFuncs.slice();
        this._onWindowClose();
        this.node.removeFromParent();
        this.node.destroy();

        for (let i = closeFuncs.length - 1; i >= 0; i--) {
            let func = closeFuncs[i];
            if (typeof func === 'function') func();
        }

        if (GameKit.AutoWindowQueue) GameKit.AutoWindowQueue.drainLater();
    }

    closeAllChildren () {
        for (let i = this.childWindows.length - 1; i >= 0; i--) {
            let wnd = this.childWindows[i];
            if (wnd && typeof wnd.closeAnim === 'function') wnd.closeAnim();
            else if (wnd && typeof wnd.close === 'function') wnd.close();
        }
    }

    _onAddChildWindow (wnd: any) {
        if (wnd && this.childWindows.indexOf(wnd) < 0) this.childWindows.push(wnd);
    }

    _onRemoveChildWindow (wnd: any) {
        let index = this.childWindows.indexOf(wnd);
        if (index >= 0) this.childWindows.splice(index, 1);
    }

    GetChildWindows () {
        return this.childWindows;
    }

    _onWindowShow (showParams?: any) {
        if (this.isChild) {
            GameKit.BackKeyManager.registerBackEvent(() => {
                this.closeAnim();
            });
        } else if (!showParams || showParams.isFirst !== false) {
            GameKit.BackKeyManager.registerBackEvent();
        }

        this.onShow(showParams);
    }

    _onWindowClose () {
        GameKit.BackKeyManager.unregisterBackEvent();

        if (UIRoot && UIRoot.instance && UIRoot.instance.windowInstance) {
            UIRoot.instance.windowInstance[this._windowName] = null;
        }

        if (this.isChild && this.parentWindow && isValid(this.parentWindow.node)) {
            this.parentWindow._onRemoveChildWindow(this);
        }
    }

    addOnCloseFunc (func: Function) {
        this.closeFuncs.push(func);
    }

    clearOnCloseFunc () {
        this.closeFuncs = [];
    }

    closeAnim (callback?: Function) {
        if (!this.node || !isValid(this.node) || this.closing) return;
        this.closing = true;

        let finish = () => {
            this.close();
            if (typeof callback === 'function') callback();
        };

        let anims = this.getComponentsInChildren(EnterCloseAnim);
        if (UIRoot && UIRoot.instance && UIRoot.instance.ShowCantClick) {
            UIRoot.instance.ShowCantClick(true);
        }

        if (!anims || anims.length <= 0) {
            if (UIRoot && UIRoot.instance && UIRoot.instance.CloseCantClick) {
                UIRoot.instance.CloseCantClick();
            }
            finish();
            return;
        }

        let firstAnim = anims[0];
        let closedByAnim = false;
        if (firstAnim && typeof firstAnim.closeAnim === 'function') {
            firstAnim.closeAnim(() => {
                closedByAnim = true;
                if (UIRoot && UIRoot.instance && UIRoot.instance.CloseCantClick) {
                    UIRoot.instance.CloseCantClick();
                }
                finish();
            });

            for (let i = 1; i < anims.length; i++) {
                if (anims[i] && typeof anims[i].closeAnim === 'function') anims[i].closeAnim();
            }

            this.scheduleOnce(() => {
                if (!closedByAnim && this.node && isValid(this.node)) {
                    if (UIRoot && UIRoot.instance && UIRoot.instance.CloseCantClick) {
                        UIRoot.instance.CloseCantClick();
                    }
                    finish();
                }
            }, 0);
            return;
        }

        if (UIRoot && UIRoot.instance && UIRoot.instance.CloseCantClick) {
            UIRoot.instance.CloseCantClick();
        }
        finish();
    }
}
