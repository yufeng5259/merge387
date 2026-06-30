import { _decorator, Label, Sprite } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { UserInfoModel } from '../UserInfoModel';

import { User } from '../../game/user/User';
const { ccclass, property } = _decorator;

@ccclass('InvitedNewUserWindow')
export default class InvitedNewUserWindow extends UIWindow {
    public static windowPath = 'Menu/InvitedNewUserWindow';

    @property(Sprite)
    spAvatar: Sprite | null = null;

    @property(Label)
    labelSpin: Label | null = null;

    @property(Label)
    labelDes: Label | null = null;

    onShow(showParams: any) {
        const data = showParams.data;

        (UserInfoModel as any).SetAvatar(this.spAvatar, new User().updateData(data['user']));

        const add = this.get_add_number();

        if (this.labelSpin) this.labelSpin.string = '+' + add.toString();

        let strkey = 'NewUserInvitedDes';
        if (AppKit.SdkManager.IsNative()) strkey = 'NewUserInvitedDesApp';
        if (this.labelDes) this.labelDes.string = String.format(GameKit.i18n.t(strkey), data['user']['name'], add.toString());
    }

    onClose() {

    }

    update(dt: any) {

    }

    callClose() {
        this.closeAnim();
    }

    get_add_number() {
        const data = G.GameConstance.spinsPerInvite;
        const mapId = Game.SUserVillage.MapId();
        let is = 0;
        for (const mid in data) {
            if (mapId >= parseInt(mid)) {
                is = data[mid];
            } else {
                break;
            }
        }
        return is;
    }
}
