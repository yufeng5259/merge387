import { _decorator, Color, Component, Label, LabelOutline, Node, Sprite } from 'cc';
import MultiplePurchaseWindow from './MultiplePurchaseWindow';

const { ccclass, property } = _decorator;

const TypeTreatFoodItemId = 3;

@ccclass('ShopTreatItem')
export class ShopTreatItem extends Component {
    @property(Sprite)
    public spIcon: Sprite | null = null;

    @property(Label)
    public labelName: Label | null = null;

    @property(Label)
    public labelNum: Label | null = null;

    @property(Label)
    public labelNumAdd: Label | null = null;

    @property(Label)
    public labelPrice: Label | null = null;

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

    public updatePanel(meta: any, _index: number, icon: any, oldMeta: any) {
        this.meta = meta;
        const num = meta.Count();
        const numAdd = Math.round(meta.Off() * 100);
        const price = meta.PriceString();
        const content = meta.Content();

        this.spIcon.spriteFrame = icon;
        this.labelName.string = content.Name();
        this.labelNum.string = GameKit.StringUtil.formatNumber(num);
        this.labelNum.color = content.Id() === TypeTreatFoodItemId ? new Color().fromHEX('#ffa45b') : new Color().fromHEX('#ff7bff');

        const outline = this.labelNum.node.getComponent(LabelOutline);
        if (outline) {
            outline.color = content.Id() === TypeTreatFoodItemId ? new Color().fromHEX('#601200') : new Color().fromHEX('#390370');
        }

        if (numAdd <= 0) {
            this.labelNumAdd.string = '';
        } else {
            this.labelNumAdd.string = (String as any).format(GameKit.i18n.t('ShopAddPercent'), numAdd);
        }

        if (!meta.OnSale()) {
            this.offNode.active = false;
            this.labelNumAdd.node.active = true;
            if (content.Id() === TypeTreatFoodItemId) {
                this.labelNumAdd.string = (String as any).format(GameKit.i18n.t('ShopTreatFoodTime'), Math.round(G.GameConstance.servantFoodTime * content.Count() / 3600));
            }
        } else {
            this.offNode.active = true;
            this.offText.string = (String as any).format(GameKit.i18n.t('OffText'), numAdd);
            this.labelNumAdd.node.active = false;
        }

        this.popularIcon.active = false;
        this.bestValueIcon.active = false;

        this.oldText.node.active = false;
        if (oldMeta !== meta) {
            this.oldText.node.active = true;
            const oldNum = oldMeta.Count();
            this.oldText.string = GameKit.StringUtil.formatNumber(oldNum) + ' ' + content.Name();
        }

        this.labelPrice.string = price;

        this.labelNum.cacheMode = Label.CacheMode.BITMAP;
        this.labelNumAdd.cacheMode = Label.CacheMode.BITMAP;
        this.offText.cacheMode = Label.CacheMode.BITMAP;
        this.oldText.cacheMode = Label.CacheMode.BITMAP;
        this.labelPrice.cacheMode = Label.CacheMode.BITMAP;
    }

    public onBuy() {
        AppKit.PaymentWrap.Pay(this.meta.Name(), (ok: boolean) => {
            if (ok) {
                UIRoot.instance.openChildWindow('PaySuccessWindow', {
                    from: 'treat',
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
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'treat', name: this.meta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'treat', name: this.meta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'treat', name: this.meta.Name(), phase: 0 });
    }
}
