import { _decorator, Label, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('CoinNotEnoughWindow')
export default class CoinNotEnoughWindow extends UIWindow {
    public static windowPath = 'Shop/CoinNotEnoughWindow';

    @property(Label)
    labelCoin: Label | null = null;

    @property(Label)
    labelPrice: Label | null = null;

    @property(Node)
    spPay: Node | null = null;

    @property(Node)
    spPlay: Node | null = null;

    @property(Label)
    labelOff: Label | null = null;

    shopMeta: any = null;

    onShow(showParams: any) {
        this.shopMeta = showParams.meta;

        if (this.labelCoin) this.labelCoin.string = '+' + this.shopMeta.Count().toString();

        if (this.labelPrice) this.labelPrice.string = this.shopMeta.PriceString();

        if (this.spPay) this.spPay.active = AppKit.PaymentWrap.PayEnabled();
        if (this.spPlay) this.spPlay.active = !AppKit.PaymentWrap.PayEnabled();

        if (this.labelOff) this.labelOff.string = String.format(GameKit.i18n.t('NotEnoughOff'), 100 * this.shopMeta.Off());
    }

    onClose() {

    }

    callClose() {
        this.closeAnim();
    }

    callBuy() {
        AppKit.PaymentWrap.Pay(this.shopMeta.Name(), function(this: CoinNotEnoughWindow, ok: boolean) {
            if (ok) {
                GameKit.SoundManager.playSound('item_purchased');
                this.closeAnim();
                if (CoinNotEnoughWindow.OpenMulti()) UIRoot.instance.openChildWindow('MultiplePurchaseWindow', { meta: this.shopMeta });

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'coin', name: this.shopMeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'coin', name: this.shopMeta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'coin', name: this.shopMeta.Name(), phase: 0 });
    }

    callPlay() {
        this.addOnCloseFunc(function() {
            GameMainWindow.instance.closeAllChildren();
            GamePlay.instance.changeScene(GamePlay.Scenes.Slot);
        });
        this.closeAnim();
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
