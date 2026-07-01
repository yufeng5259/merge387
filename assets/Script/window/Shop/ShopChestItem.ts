import { _decorator, Component, Label, Sprite, UITransform } from 'cc';
import { fitByHeight } from '../../GameKit/render/fixedSizeRatio';
import CardChestOpenWindow from '../Card/CardChestOpenWindow';

const { ccclass, property } = _decorator;

@ccclass('ShopChestItem')
export class ShopChestItem extends Component {
    @property(Sprite)
    public icon: Sprite | null = null;

    @property(Label)
    public itemName: Label | null = null;

    @property(Label)
    public price: Label | null = null;

    public meta: any = null;

    public start() {
    }

    public updatePanel(meta: any, index: number, icon: any) {
        this.meta = meta;

        const transform = this.icon?.node.getComponent(UITransform);
        if (transform) {
            transform.height *= 1 - 0.05 * (3 - index);
        }
        this.icon.spriteFrame = icon;
        fitByHeight(this.icon);

        this.itemName.string = this.meta.Content().Name();
        this.price.string = this.meta.PriceString();
        this.node.setSiblingIndex(index + 1);
    }

    public onBuy() {
        const price = this.meta.Price();
        if (Game.SUser.Coin() < price) {
            if (GameKit.SoundManager && GameKit.SoundManager.playPurchaseNotEnoughSound) {
                GameKit.SoundManager.playPurchaseNotEnoughSound();
            }
            return;
        }

        const req = SR.SRShop.payFor(this.meta.Id());
        req.SetCallBack((v: any) => {
            const cardWindow = UIRoot.instance.GetWindow('CardAllSetWindow');
            if (cardWindow) {
                cardWindow.svt.flushData();
            }
            UIRoot.instance.openChildWindow('CardChestOpenWindow', {
                chest: v.chest,
                showCallback: (wnd: any) => {
                    wnd.addOnCloseFunc(() => {
                    });
                },
            });
        });
        req.Send();
    }

    public onInfo() {
        UIRoot.instance.openChildWindow('CardChestInfoWindow', {
            meta: this.meta,
            card_chest_meta_id: this.meta.Type() === Meta.ShopMeta.Types.Chest ? this.meta.DefaultPrice() : this.meta.RawCount(),
            shopMeta: this.meta,
        });
    }

    public updateAdPanel(icon: any) {
        this.icon.spriteFrame = icon;
        fitByHeight(this.icon);

        this.itemName.string = GameKit.i18n.t('ContentNameChest4');
        this.price.string = `(${G.GameConstance.dailyFreeChestCount - Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`;
        this.itemName.node.parent.getChildByName('flash').active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount;
    }

    public updateAdMagicalPanel(icon: any, meta: any) {
        this.meta = meta;
        this.icon.spriteFrame = icon;
        fitByHeight(this.icon);

        this.itemName.string = GameKit.i18n.t('ContentNameChest7');
        this.price.string = this.meta.PriceString();
    }

    public onWatch() {
        if (Game.SUserCard.data.freeCount >= G.GameConstance.dailyFreeChestCount) {
            return;
        }

        AppKit.ADWrap.ShowVideo(() => {
            const req = SR.SRCard.watchChest();
            req.SetCallBack(() => {
                if (GameKit.SoundManager && GameKit.SoundManager.playDailyFreeChestOpenSound) {
                    GameKit.SoundManager.playDailyFreeChestOpenSound();
                }
                const cardWnd = UIRoot.instance.GetWindow('CardAllSetWindow');
                if (cardWnd) {
                    cardWnd.svt.flushData();
                    cardWnd.labelFree.string = `(${G.GameConstance.dailyFreeChestCount - Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`;
                    cardWnd.btnWatchFree.active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount;
                }
                CardChestOpenWindow.tryShow();

                this.price.string = `(${G.GameConstance.dailyFreeChestCount - Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`;
                this.itemName.node.parent.getChildByName('flash').active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount;
            });
            req.Send();
        }, 'freeChest');
    }

    public onBuyMagical() {
        AppKit.PaymentWrap.Pay(this.meta.Name(), (ok: boolean) => {
            if (ok) {
                UIRoot.instance.openChildWindow('PaySuccessWindow', { from: 'card' });
                GameKit.SoundManager.playSound('item_purchased');
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'chest', name: this.meta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'chest', name: this.meta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'chest', name: this.meta.Name(), phase: 0 });
    }
}
