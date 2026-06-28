import { _decorator, Label, RichText } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('CardCrazySetWindow')
export default class CardCrazySetWindow extends UIWindow {
    static windowPath = 'Card/CardCrazySetWindow';

    @property(RichText)
    labelDes: RichText | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    meta: any = null;
    metaParam: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.metaParam = this.meta.Param();

        this.labelDes.string = (String as any).format(GameKit.i18n.t('CardCrazySetDes'), this.metaParam.rate);

        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;

            this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        if (UIRoot.instance.GetWindow('CardAllSetWindow')) {
            this.closeAnim();
        } else {
            this.closeAnim(() => {
                UIRoot.instance.openChildWindow('CardAllSetWindow');
            });
        }
    }
}
