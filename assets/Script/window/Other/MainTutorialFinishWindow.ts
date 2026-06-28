import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('MainTutorialFinishWindow')
export default class MainTutorialFinishWindow extends UIWindow {
    static windowPath = 'Other/MainTutorialFinishWindow';

    close_window() {
        this.closeAnim();
    }
}
