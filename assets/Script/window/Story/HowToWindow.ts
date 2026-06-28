import { _decorator } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('HowToWindow')
export default class HowToWindow extends UIWindow {
    static windowPath = 'Story/HowToWindow';

    onShow(showParams: any) {
    }

    close_window() {
        this.closeAnim();
    }
}
