import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ActivitySpecialOfferWindow')
export default class ActivitySpecialOfferWindow extends UIWindow {
    public static windowPath = 'Activity/ActivitySpecialOfferWindow';

    @property(Label)
    labelTimer: Label | null = null;

    @property(Label)
    labelCoin: Label | null = null;

    @property(Label)
    labelSpin: Label | null = null;

    @property(Label)
    labelOff: Label | null = null;

    @property(Label)
    labelPrice: Label | null = null;

    meta: any = null;
    shopMeta: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;

        this.shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.meta.ShopId());
        let contents = this.shopMeta.Content().Contents();

        contents.forEach((x: any) => {
            if (x.Type() === Game.Content.Types.Ap) {
                if (this.labelSpin) this.labelSpin.string = (String as any).format(GameKit.i18n.t('ActivitySpecialOfferSpin'), x.Count());
            } else if (x.Type() === Game.Content.Types.Coin) {
                if (this.labelCoin) this.labelCoin.string = (String as any).format(GameKit.i18n.t('ActivitySpecialOfferCoin'), BigNumber.format(x.Count()));
            }
        });

        if (this.labelOff) this.labelOff.string = (String as any).format(GameKit.i18n.t('OffText'), Math.round(this.shopMeta.Off() * 100));
        if (this.labelPrice) this.labelPrice.string = this.shopMeta.PriceString();

        this.leftTime = 0;
        this.update(0);
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = 0;

            this.leftTime = this.meta.UserTime() - currentTime + Game.ActivityManager.GetLocalData()[this.meta.Id()].startTime;

            if (this.labelTimer) this.labelTimer.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    close_window() {
        this.closeAnim();
    }

    callBuy() {
        AppKit.PaymentWrap.Pay(this.shopMeta.Name(), (ok: boolean) => {
            if (ok) {
                this.closeAnim();
                Game.ActivityManager.disableLocalActivity(this.meta.Id());

                UIRoot.instance.openChildWindow('PaySuccessWindow', { from: 'pack' });

                GameKit.SoundManager.playSound('item_purchased');

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'pack', name: this.shopMeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'pack', name: this.shopMeta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'pack', name: this.shopMeta.Name(), phase: 0 });
    }
}
