import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('AccountSwitchWindow')
export default class AccountSwitchWindow extends UIWindow {
    public static windowPath = 'Sys/AccountSwitchWindow';

    showParams: any = {};

    onShow(param: any) {
        this.showParams = param || {};
        GameKit.BackKeyManager.registerBackEvent();
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    //鍒囨崲FB
    onClickFB() {
        if (Game.SUser.GetChannelId('app_fb')) {
            console.log('宸茬粡鍒囨崲FB娓犻亾浜?');
        }
        let curAccountID = Game.SUser.accountId;
        AppKit.UserWrap.NativeFBLogin(() => {
            console.log('old=', curAccountID);
            console.log('new=', Game.SUser.accountId);
            console.log('缁戝畾鐨勮处鍙风櫥褰?', Game.SUser.accountId);

            let req = SR.SRLogin.switchChannels();
            req.SetCallBack((res: any) => {
                this.close();
                if (res.user) Game.OUser.updateData(res.user);
                if (res.user) Game.SUser.updateData(res.user);
                console.log('鍒囨崲鎴愬姛', res.user.accountId, Game.SUser.accountId);
                GameKit.PlayerPrefs.SetLastString('lastSource', 'app_fb');
                GameKit.PlayerPrefs.SetLastString('lastAccountId', Game.SUser.accountId);

                AppGame.instance.logout();
            });
            req.SetErrorCallBack(function(res: any) {
                ErrorCode.ShowToast(res.errorCode);
                if (res.errorCode == ErrorCode.BOUNDACCOUNT_ERROR) {
                    UIRoot.instance.openChildWindow('AccountHintWindow');
                }
            });
            req.Send();
        });
        AppKit.LogEventWrap.logEvent('FB鍒囨崲');
    }

    //鍒囨崲璋锋瓕
    onClickGG() {
        if (Game.SUser.GetChannelId('app_google')) {
            console.log('宸茬粡鍒囨崲璋锋瓕娓犻亾浜?');
        }
        this._handleSwitchAccount(AppKit.UserWrap.NativeGGLogin, 'app_google');
        AppKit.LogEventWrap.logEvent('璋锋瓕鍒囨崲');
    }

    //鍒囨崲鑻规灉
    onClickApple() {
        if (Game.SUser.GetChannelId('app_as')) {
            console.log('宸茬粡鍒囨崲鑻规灉娓犻亾浜?');
        }
        this._handleSwitchAccount(AppKit.UserWrap.NativeAppStoreLogin, 'app_as');
        AppKit.LogEventWrap.logEvent('鑻规灉鍒囨崲');
    }

    //閫氱敤鏂规硶
    _handleSwitchAccount(nativeLogin: any, source: any) {
        nativeLogin(() => {
            let req = SR.SRLogin.switchChannels();
            req.SetCallBack((res: any) => {
                this.close();

                if (res.user) {
                    Game.OUser.updateData(res.user);
                    Game.SUser.updateData(res.user);
                }

                console.log('鍒囨崲鎴愬姛', res.user && res.user.accountId, Game.SUser.accountId);

                GameKit.PlayerPrefs.SetLastString('lastSource', source);
                GameKit.PlayerPrefs.SetLastString('lastAccountId', Game.SUser.accountId);

                AppGame.instance.logout();
            });

            req.SetErrorCallBack(function(res: any) {
                ErrorCode.ShowToast(res.errorCode);
                if (res.errorCode == ErrorCode.BOUNDACCOUNT_ERROR) {
                    UIRoot.instance.openChildWindow('AccountHintWindow');
                }
            });

            req.Send();
        });
    }
}
