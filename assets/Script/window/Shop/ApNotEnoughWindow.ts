import { _decorator, Label, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

// 建筑商店
@ccclass('ApNotEnoughWindow')
export default class ApNotEnoughWindow extends UIWindow {
    public static windowPath = 'Shop/ApNotEnoughWindow';

    @property(Label)
    labelAp: Label | null = null;

    @property(Label)
    labelPrice: Label | null = null;

    @property(Label)
    labelWait: Label | null = null;

    @property(Label)
    labelWait2: Label | null = null;

    @property(Node)
    spPay: Node | null = null;

    @property(Node)
    spPlay: Node | null = null;

    @property(Label)
    labelOff: Label | null = null;

    shopMeta: any = null;
    apRemainTime = 0;
    lastUpdateTime: number | null = null;

    onShow(showParams: any) {
        this.shopMeta = showParams.meta;

        if (this.labelAp) this.labelAp.string = '+' + this.shopMeta.Count().toString();

        if (this.labelPrice) this.labelPrice.string = this.shopMeta.PriceString();

        if (this.spPay) this.spPay.active = AppKit.PaymentWrap.PayEnabled();
        if (this.spPlay) this.spPlay.active = !AppKit.PaymentWrap.PayEnabled();

        this.apRemainTime = G.GameConstance.apRecover - (Game.SUser.ApRecover() + GameKit.TimeUtil.getCurrentTime() - 1 - Game.SUser.ApRecoverLast());

        if (this.labelOff) this.labelOff.string = String.format(GameKit.i18n.t('NotEnoughOff'), 100 * this.shopMeta.Off());
    }

    onClose() {
    }

    update(dt: number) {
        const cTime = GameKit.TimeUtil.getCurrentTime();
        dt = this.lastUpdateTime ? cTime - this.lastUpdateTime : dt;
        this.lastUpdateTime = cTime;

        this.apRemainTime -= dt;
        if (this.apRemainTime <= 0) {
            this.closeAnim();
            return;
        }

        let apRecoverSpins = G.GameConstance.apRecoverSpins;
        if (Game.SUserStatus.IsVip()) {
            apRecoverSpins = G.GameConstance.vipApRecoverSpins;
        }
        if (this.labelWait) this.labelWait.string = String.format(GameKit.i18n.t('NotEnoughApWait'), apRecoverSpins, GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime));
        if (this.labelWait2) this.labelWait2.string = String.format(GameKit.i18n.t('NotEnoughApWait2'), apRecoverSpins, GameKit.TimeUtil.FormatRemainTimeSimple(this.apRemainTime));
    }

    callClose() {
        this.closeAnim();
    }

    callBuy() {
        AppKit.PaymentWrap.Pay(this.shopMeta.Name(), function(this: ApNotEnoughWindow, ok: boolean) {
            if (ok) {
                this.closeAnim();
                if (ApNotEnoughWindow.OpenMulti()) UIRoot.instance.openChildWindow('MultiplePurchaseWindow', { meta: this.shopMeta });

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'spin', name: this.shopMeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'spin', name: this.shopMeta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'spin', name: this.shopMeta.Name(), phase: 0 });
    }

    public static OpenMulti() {
        const activities = Game.ActivityManager.GetAllActiveActivityList();
        for (let i = 0; i < activities.length; i++) {
            const meta = activities[i];
            if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.SubType() === Meta.ActivityMeta.SubTypes.Lucky10) return true;
        }

        return false;
    }
}