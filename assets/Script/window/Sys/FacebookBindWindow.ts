import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('FacebookBindWindow')
export default class FacebookBindWindow extends UIWindow {
    public static windowPath = 'Sys/FacebookBindWindow';

    close_window() {
        this.closeAnim();
    }

    connect() {
        AppKit.UserWrap.NativeFBLogin(() => {
            let req = SR.SRLogin.bindAccount(Game.SUser.accountId, Game.SUser.from);
            req.SetCallBack(() => {
                this.close();
                AppGame.instance.logout();
            });
            req.Send();
        });
    }
}
