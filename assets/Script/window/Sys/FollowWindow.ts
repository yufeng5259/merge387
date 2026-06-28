import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('FollowWindow')
export default class FollowWindow extends UIWindow {
    static windowPath = 'Sys/FollowWindow';

    close_window() {
        this.closeAnim();
    }
}
