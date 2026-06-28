import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('AddFriendsOpenWindow')
export default class AddFriendsOpenWindow extends UIWindow {
    public static windowPath = 'Friends/AddFriendsOpenWindow';

    is_back_click: any = undefined;

    onShow(showParams: any) {

    }

    onClose() {

    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        // this.closeAnim()
        // ShopWindow.Show()
    }

    event_back(e: any, cb: any, delay?: any) {
        if (this.is_back_click !== undefined) { return; }
        this.is_back_click = 0;
        // let action = moveTo(C.IN_ANIMATION_TIME, 0, 0)
        // UIRoot.instance.mainCamera.node.stopAllActions()
        // UIRoot.instance.mainCamera.node.runAction(action).easing(easeBackIn(1.4))
        this.closeAnim(cb);
    }

    event_13_friends() {
        this.event_back(null, () => {
            if (!Game.SUser.IsGuest()) {
                let req = SR.SRGuild.verificationLegion({ userId: Game.SUser.UserId() });
                req.SetCallBack(function (this: AddFriendsOpenWindow, res: any) {
                    if (res.legionId > 0) {
                        let req = SR.SRGuild.checkGuildInfo(Game.SUser.GuildId());
                        req.SetCallBack(function (res: any) {
                            Game.Guild.askList = {};
                            res.user.forEach((ele: any) => {
                                Game.SGuild.guildInfo[ele.userId] = ele;
                            });
                            Game.SGuild.updateData(res.legion);
                            UIRoot.instance.openChildWindow('GuildGameMainWindow', '1');
                        }.bind(this));
                        req.Send();
                    } else {
                        Game.SUser.setData('legionId', 0);
                        UIRoot.instance.openChildWindow('GuildGameMainWindow', '1');
                    }
                }.bind(this));
                req.Send();
            } else {
                UIRoot.instance.openChildWindow('AccountBindWindow');
            }
        }, 100);
        AppKit.LogEventWrap.logEvent('menu_friends');
    }
}
