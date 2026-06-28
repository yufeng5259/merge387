import { _decorator, Button, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('AccountBindWindow')
export default class AccountBindWindow extends UIWindow {
    public static windowPath = 'Sys/AccountBindWindow';

    @property(Label)
    lab_GG: Label | null = null;

    @property(Label)
    lab_FB: Label | null = null;

    @property(Label)
    lab_APPLE: Label | null = null;

    @property(Button)
    btn_GG: Button | null = null;

    @property(Button)
    btn_FB: Button | null = null;

    @property(Button)
    btn_APPLE: Button | null = null;

    showParams: any = {};

    // 绐楀彛鏄剧ず鏃剁紦瀛樺弬鏁般€佹敞鍐岃繑鍥為敭骞跺垵濮嬪寲鐣岄潰銆?
    onShow(param: any) {
        console.log('鏆傛椂鍏抽棴,涓婄嚎鍚庡紑濮嬫帴鍏DK,娴嬭瘯');
        this.onClose();
        this.showParams = param || {};
        this.refeshData();
    }

    // 绐楀彛鍏抽棴鏃舵敞閿€杩斿洖閿簨浠讹紝閬垮厤娈嬬暀鐩戝惉銆?
    onClose() {
        this.closeAnim();
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    refeshData() {
        if (Game.SUser.GetChannelId('app_as')) {
            if (this.lab_APPLE) this.lab_APPLE.string = Game.SUser.Name();
            if (this.btn_APPLE) this.btn_APPLE.interactable = false;
            //this.btn_APPLE.enableAutoGrayEffect = true;
        }
        if (Game.SUser.GetChannelId('app_fb')) {
            if (this.lab_FB) this.lab_FB.string = Game.SUser.Name();
            if (this.btn_FB) this.btn_FB.interactable = false;
            //this.btn_FB.enableAutoGrayEffect = true;
        }
        if (Game.SUser.GetChannelId('app_google')) {
            if (this.lab_GG) this.lab_GG.string = Game.SUser.Name();
            if (this.btn_GG) this.btn_GG.interactable = false;
            //this.btn_GG.enableAutoGrayEffect = true;
        }
    }

    onClickFB() {
        AppKit.UserWrap.NativeFBLogin(() => {
            let req = SR.SRLogin.bindChannels();
            req.SetCallBack((res: any) => {
                this.close();
                console.log('缁戝畾鎴愬姛', res);
                if (res.user) Game.SUser.updateData(res.user);
                //AppGame.instance.logout()
                UIRoot.instance.ShowToast('Bind sucess');
            });
            req.SetErrorCallBack(function(res: any) {
                ErrorCode.ShowToast(res.errorCode);
            });
            req.Send();
        });
        AppKit.LogEventWrap.logEvent('FB缁戝畾');
    }

    onClickGG() {
        AppKit.UserWrap.NativeGGLogin(() => {
            let req = SR.SRLogin.bindChannels();
            req.SetCallBack((res: any) => {
                this.close();
                console.log('缁戝畾鎴愬姛', res);
                if (res.user) Game.SUser.updateData(res.user);
                //AppGame.instance.logout()
                UIRoot.instance.ShowToast('Bind sucess');
            });
            req.SetErrorCallBack(function(res: any) {
                ErrorCode.ShowToast(res.errorCode);
            });
            req.Send();
        });
        AppKit.LogEventWrap.logEvent('璋锋瓕缁戝畾');
    }

    onClickApple() {
        AppKit.UserWrap.NativeAppStoreLogin(() => {
            let req = SR.SRLogin.bindChannels();
            req.SetCallBack((res: any) => {
                this.close();
                console.log('缁戝畾鎴愬姛', res);
                if (res.user) Game.SUser.updateData(res.user);
                //AppGame.instance.logout()
                UIRoot.instance.ShowToast('Bind sucess');
            });
            req.SetErrorCallBack(function(res: any) {
                ErrorCode.ShowToast(res.errorCode);
            });
            req.Send();
        });
        AppKit.LogEventWrap.logEvent('鑻规灉缁戝畾');
    }

    onClickSwitch() {
        UIRoot.instance.openChildWindow('AccountSwitchWindow');
    }
}
