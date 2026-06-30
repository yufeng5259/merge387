import { _decorator, Component, Label, Node, Sprite } from 'cc';
import MultiplePurchaseWindow from './MultiplePurchaseWindow';

const { ccclass, property } = _decorator;

@ccclass('ShopSpinItem')
export class ShopSpinItem extends Component {
    @property(Sprite)
    public spinIcon: Sprite | null = null;

    @property(Label)
    public spinNum: Label | null = null;

    @property(Label)
    public spinNumAdd: Label | null = null;

    @property(Label)
    public spinPrice: Label | null = null;

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

        this.spinIcon.spriteFrame = icon;
        this.spinNum.string = (String as any).format(GameKit.i18n.t('ShopSpinNum'), GameKit.StringUtil.formatNumber(num));

        if (numAdd <= 0) {
            this.spinNumAdd.string = '';
        } else {
            this.spinNumAdd.string = (String as any).format(GameKit.i18n.t('ShopAddPercent'), numAdd);
        }

        if (!meta.OnSale()) {
            this.offNode.active = false;
            this.spinNumAdd.node.active = true;
        } else {
            this.offNode.active = true;
            this.offText.string = (String as any).format(GameKit.i18n.t('OffText'), numAdd);
            this.spinNumAdd.node.active = false;
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
            this.oldText.string = (String as any).format(GameKit.i18n.t('ShopSpinNum'), GameKit.StringUtil.formatNumber(oldNum));
        }
        this.spinPrice.string = price;

        this.spinNum.cacheMode = Label.CacheMode.BITMAP;
        this.spinNumAdd.cacheMode = Label.CacheMode.BITMAP;
        this.offText.cacheMode = Label.CacheMode.BITMAP;
        this.oldText.cacheMode = Label.CacheMode.BITMAP;
        this.spinPrice.cacheMode = Label.CacheMode.BITMAP;
    }

    public onBuy() {
        AppKit.PaymentWrap.Pay(this.meta.Name(), (ok: boolean) => {
            if (ok) {
                UIRoot.instance.openChildWindow('PaySuccessWindow', {
                    from: 'spin',
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
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'spin', name: this.meta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'spin', name: this.meta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'spin', name: this.meta.Name(), phase: 0 });
    }
}
