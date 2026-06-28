import { _decorator, Label, Node, RichText, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('CongratsWindow')
export default class CongratsWindow extends UIWindow {
    static windowPath = 'Shop/CongratsWindow';

    @property(RichText)
    labelMessage: RichText | null = null;

    @property(Label)
    labelRate: Label | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Node)
    spGet: Node | null = null;

    @property(Node)
    spBtn: Node | null = null;

    showRate: any = null;
    rate: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.showRate = showParams.showRate;
        this.rate = Game.SUserStatus.DoubleTicketRate() * 100;
        if (this.showRate) {
            this.rate = this.showRate;
            this.spGet.active = false;
            this.spBtn.active = false;
            let pos = this.labelMessage.node.position;
            this.labelMessage.node.setPosition(new Vec3(pos.x, pos.y + 30, pos.z));
        }

        this.labelMessage.string = (String as any).format(GameKit.i18n.t('NewPlayerCongratsDes2'), this.rate);
        this.labelRate.string = '' + this.rate + '%';

        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = Game.SUserStatus.DoubleTicketTime() - currentTime;

            this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);

            if (this.leftTime <= 0) {
                this.leftTime = null;
                if (this.showRate) this.labelTimer.string = '';
                else this.closeAnim();
            }
        }
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        let m = Game.ActivityManager.GetActiveShopActivityByType(Meta.ActivityMeta.SubTypes.SalePack);
        this.closeAnim(() => {
            if (m) UIRoot.instance.openChildWindow('ActivitySalePackWindow', { meta: m });
        });
    }
}
