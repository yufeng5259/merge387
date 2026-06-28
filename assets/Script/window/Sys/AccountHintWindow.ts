import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('AccountHintWindow')
export default class AccountHintWindow extends UIWindow {
    static windowPath = 'Sys/AccountHintWindow';

    showParams: any = {};

    onShow(param: any) {
        this.showParams = param || {};
        GameKit.BackKeyManager.registerBackEvent();
    }

    onClickGM() {
        console.log('contact GM');
    }

    onClickLogin() {
        Game.SUser.accountId = Game.OUser.AccountId();
        Game.SUser.data['accountId'] = Game.OUser.AccountId();
        GameKit.PlayerPrefs.SetLastString('lastAccountId', Game.SUser.accountId);
        AppGame.instance.logout();
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }
}
