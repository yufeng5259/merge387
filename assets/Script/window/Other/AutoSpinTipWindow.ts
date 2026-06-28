import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('AutoSpinTipWindow')
export default class AutoSpinTipWindow extends UIWindow {
    static windowPath = 'Other/AutoSpinTipWindow';

    close_window() {
        this.closeAnim();
    }
}
