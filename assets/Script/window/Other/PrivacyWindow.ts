import { _decorator, RichText } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('PrivacyWindow')
export default class PrivacyWindow extends UIWindow {
    static windowPath = 'Other/PrivacyWindow';

    @property(RichText)
    label: RichText | null = null;

    onShow() {
    }

    callConfirm() {
        GameKit.PlayerPrefs.SetInt('privacy_read', 1);
        this.closeAnim();
    }
}
