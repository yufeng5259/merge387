import { _decorator, Button, Node, sys } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('AppCommentWindow')
export default class AppCommentWindow extends UIWindow {
    public static windowPath = 'Sys/AppCommentWindow';

    @property([Node])
    stars: Node[] = [];

    @property(Button)
    btnOk: Button | null = null;

    star = 0;
    firstStar = 0;

    onShow(showParams: any) {
        GameKit.BackKeyManager.registerBackEvent();
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    //update (dt) {},

    callClose() {
        this.closeAnim();
        AppKit.LogEventWrap.logEvent('app_comment_close');
        GameKit.PlayerPrefs.SetInt('AppCommentCloseTime', GameKit.TimeUtil.getCurrentTime());
    }

    callGo() {
        //this.closeAnim()
        //AppKit.NativeWrap.openComment()
        //AppKit.LogEventWrap.logEvent("app_comment_go")
        if (this.star >= G.GameConfig.leastRateStar) {
            this.closeAnim();
            GameKit.PlayerPrefs.SetBool('AppCommentOk', true);
            AppKit.NativeWrap.openComment();
            AppKit.LogEventWrap.logEvent('app_comment_go');
            return;
        }
        this.closeAnim();
        GameKit.PlayerPrefs.SetBool('AppCommentOk', true);
        sys.openURL(`mailto:coingangster@163.com?subject=Advice&body=uid:${Game.SUser.UserId()}star:${this.star}`);
    }

    clickStar(e: any, st: any) {
        let star = parseInt(st);
        this.star = star;
        if (!this.firstStar) this.firstStar = star;

        if (star >= G.GameConfig.leastRateStar && this.firstStar >= G.GameConfig.leastRateStar) {
            this.closeAnim();
            GameKit.PlayerPrefs.SetBool('AppCommentOk', true);
            AppKit.NativeWrap.openComment();
            AppKit.LogEventWrap.logEvent('app_comment_go');
            return;
        }

        if (this.btnOk) this.btnOk.interactable = true;
        for (let i = 0; i < 5; i++) {
            if (this.stars[i]) this.stars[i].active = i < star;
        }
    }

    static TryShow() {
        if (!AppKit.SdkManager.IsNative()) return false;
        if (G.GameConfig.closeComment) return false;
        if (AppKit.NativeWrap.isReview() && AppKit.SdkManager.IsIos()) return false;
        if (GameKit.PlayerPrefs.GetBool('AppCommentOk')) return false;
        if (GameKit.TimeUtil.getCurrentTime() - GameKit.PlayerPrefs.GetInt('AppCommentCloseTime', 0) < GameKit.TimeUtil.DayInSecond * 3) return false;

        UIRoot.instance.openChildWindow('AppCommentWindow');
        return true;
    }
}

global.AppCommentWindow = AppCommentWindow;
