import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('SimpleItemBuyWindow')
export default class SimpleItemBuyWindow extends UIWindow {
    static windowPath = 'Shop/SimpleItemBuyWindow';

    @property(ContentModel)
    contentModel: ContentModel | null = null;

    @property(Label)
    labelPrice: Label | null = null;

    itemId: any = null;
    shopMeta: any = null;

    onShow(showParams: any) {
        this.itemId = showParams.itemId;

        let shopMetaId = Meta.ShopMeta.Types.Item * 100 + this.itemId;
        this.shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopMetaId);
        if (!this.shopMeta) {
            this.close();
            return;
        }

        this.labelPrice.string = this.shopMeta.PriceString();

        this.contentModel.show(this.shopMeta.Content(), null);
    }

    onClose() {
    }

    update(dt?: number) {
    }

    callClose() {
        this.closeAnim();
    }

    callBuy() {
        AppKit.PaymentWrap.Pay(this.shopMeta.Name(), function(ok) {
            if (ok) {
                this.closeAnim();
                GameKit.SoundManager.playSound('item_purchased');

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'item', name: this.shopMeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'item', name: this.shopMeta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'item', name: this.shopMeta.Name(), phase: 0 });
    }
}
