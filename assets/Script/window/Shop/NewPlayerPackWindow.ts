import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('NewPlayerPackWindow')
export default class NewPlayerPackWindow extends UIWindow {
    public static windowPath = 'Shop/NewPlayerPackWindow';

    @property([ContentModel])
    items: ContentModel[] = [];

    @property(Label)
    labelPrice: Label | null = null;

    @property(Label)
    labelTime: Label | null = null;

    @property(Label)
    labelOff: Label | null = null;

    shopId = 0;
    shopMeta: any = null;
    contents: any[] = [];
    leftTime: any = null;

    onShow() {
        this.shopId = 505;
        this.shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.shopId);
        this.contents = Game.Content.Merge(this.shopMeta.Content().Contents());
        this.items.forEach((x, i) => {
            x.show(this.contents[i], null);
        });

        if (this.labelPrice) this.labelPrice.string = this.shopMeta.PriceString();
        if (this.labelOff) this.labelOff.string = Math.round(this.shopMeta.Off() * 100).toString() + '%';

        this.leftTime = Game.SUserStatus.GetNewPlayerLeftTime();
        this.update(0);

        AppKit.LogEventWrap.logEvent('window_newplayer');
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            this.leftTime = Game.SUserStatus.GetNewPlayerLeftTime();

            if (this.labelTime) this.labelTime.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);

            if (this.leftTime <= 0) {
                if (this.labelTime) this.labelTime.string = '';
                this.leftTime = null;
            }
        }
    }

    callBuy() {
        let shopmeta = this.shopMeta;
        AppKit.PaymentWrap.Pay(shopmeta.Name(), function(this: NewPlayerPackWindow, ok: boolean) {
            if (ok) {
                GameKit.SoundManager.playSound('item_purchased');

                UIRoot.instance.openChildWindow('PaySuccessWindow', { from: 'pack', showCallback: (wnd: any) => {
                    wnd.addOnCloseFunc(() => {
                        if (this.node) this.closeAnim();
                    });
                } });

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'pack', name: shopmeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'pack', name: shopmeta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'pack', name: shopmeta.Name(), phase: 0 });
    }

    callCongrats() {
        UIRoot.instance.openChildWindow('CongratsWindow', { showRate: 100 });
    }

    close_window() {
        this.closeAnim();
    }
}
