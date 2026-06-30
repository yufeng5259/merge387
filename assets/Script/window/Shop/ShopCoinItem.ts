import { _decorator, Component, Label, Node, Sprite } from 'cc';
import MultiplePurchaseWindow from './MultiplePurchaseWindow';

const { ccclass, property } = _decorator;

@ccclass('ShopCoinItem')
export class ShopCoinItem extends Component {
    @property(Sprite)
    public coinIcon: Sprite | null = null;

    @property(Label)
    public coinNum: Label | null = null;

    @property(Label)
    public coinNumAdd: Label | null = null;

    @property(Label)
    public coinPrice: Label | null = null;

    @property(Node)
    public popularIcon: Node | null = null;

    @property(Node)
    public bestValueIcon: Node | null = null;

    @property(Node)
    public offNode: Node | null = null;

    @property(Label)
    public offText: Label | null = null;

    @property(Label)
    public oldText: Label | null = null;

    public meta: any = null;

    public start() {
    }

    public updatePanel(meta: any, index: number, icon: any, oldMeta: any) {
        this.meta = meta;
        const num = meta.Count();
        const numAdd = Math.round(meta.Off() * 100);
        const price = meta.PriceString();

        this.coinIcon.spriteFrame = icon;
        this.coinNum.string = GameKit.StringUtil.formatNumber(num);

        if (numAdd === 0) {
            this.coinNumAdd.string = '';
        } else {
            this.coinNumAdd.string = (String as any).format(GameKit.i18n.t('ShopAddPercent'), numAdd);
        }

        if (!meta.OnSale()) {
            this.offNode.active = false;
            this.coinNumAdd.node.active = true;
        } else {
            this.offNode.active = true;
            this.offText.string = (String as any).format(GameKit.i18n.t('OffText'), numAdd);
            this.coinNumAdd.node.active = false;
        }

        if (index === 2) {
            this.popularIcon.active = true;
            this.bestValueIcon.active = false;
        } else if (index === 5) {
            this.popularIcon.active = false;
            this.bestValueIcon.active = true;
        } else {
            this.popularIcon.active = false;
            this.bestValueIcon.active = false;
        }

        this.oldText.node.active = false;
        if (oldMeta !== meta) {
            this.oldText.node.active = true;
            const oldNum = oldMeta.Count();
            this.oldText.string = GameKit.StringUtil.formatNumber(oldNum);
        }
        this.coinPrice.string = price;

        this.coinNum.cacheMode = Label.CacheMode.BITMAP;
        this.coinNumAdd.cacheMode = Label.CacheMode.BITMAP;
        this.offText.cacheMode = Label.CacheMode.BITMAP;
        this.oldText.cacheMode = Label.CacheMode.BITMAP;
        this.coinPrice.cacheMode = Label.CacheMode.BITMAP;
    }

    public onBuy() {
        AppKit.PaymentWrap.Pay(this.meta.Name(), (ok: boolean) => {
            if (ok) {
                UIRoot.instance.openChildWindow('PaySuccessWindow', {
                    from: 'coin',
                    showCallback: (wnd: any) => {
                        wnd.addOnCloseFunc(() => {
                            UIRoot.instance.closeChildWindow('ShopWindow');
                            if (MultiplePurchaseWindow.OpenMulti()) {
                                UIRoot.instance.openChildWindow('MultiplePurchaseWindow', { meta: this.meta });
                            }
                        });
                    },
                });
                GameKit.SoundManager.playSound('item_purchased');
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'coin', name: this.meta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'coin', name: this.meta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'coin', name: this.meta.Name(), phase: 0 });
    }
}
