import { _decorator, Label } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('CardsBoomOpenWindow')
export default class CardsBoomOpenWindow extends UIWindow {
    public static windowPath = 'Activity/optionalGiftPack/CardsBoomOpenWindow';

    @property(Label)
    timeLabel: Label | null = null;

    meta: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        if (this.timeLabel) this.timeLabel.node.active = true;
        this.leftTime = 0;
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;
            if (this.timeLabel) {
                this.timeLabel.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            }
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
}
