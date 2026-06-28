import { _decorator, Button, Label } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('PassPortOpenWindow')
export default class PassPortOpenWindow extends UIWindow {
    static windowPath = 'Activity/passport/PassPortOpenWindow';

    @property(Button)
    goButton: Button | null = null;

    @property(Label)
    timeLabel: Label | null = null;

    showParams: any = null;
    meta: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.showParams = showParams;
        this.meta = showParams.meta;
        this.timeLabel.node.active = true;
        this.goButton.interactable = true;
        this.leftTime = 0;
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;
            this.timeLabel.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        this.closeAnim(() => {
            if (!this.childWindowChain) {
                UIRoot.instance.openChildWindow('PassPortMainWindow', this.showParams);
            }
        });
    }
}
