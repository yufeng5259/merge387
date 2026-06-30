import { _decorator, Component, Label, Node, Sprite } from 'cc';
import ContentModel from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('ShopSaleItem')
export class ShopSaleItem extends Component {
    @property(Sprite)
    public spinIcon: Sprite = null;
    @property(Label)
    public spinNum: Label = null;
    @property(Label)
    public spinNumAdd: Label = null;
    @property(Node)
    public popularIcon: Node = null;
    @property(Node)
    public bestValueIcon: Node = null;
    @property(Node)
    public offNode: Node = null;
    @property(Label)
    public offText: Label = null;
    @property(Label)
    public oldText: Label = null;
    @property(ContentModel)
    public contentM: ContentModel = null;
    @property(Label)
    public leftText: Label = null;
    @property(Node)
    public btn_cash: Node = null;
    @property(Node)
    public btn_coin: Node = null;
    @property(Node)
    public btn_ad: Node = null;
    @property(Node)
    public btn_free: Node = null;
    @property(Node)
    public btn_over: Node = null;
    @property(Node)
    public leftNode: Node = null;
    @property(Label)
    public cashLbl: Label = null;
    @property(Label)
    public coinLbl: Label = null;

    public meta: any = null;
    public shopmeta: any = null;
    public mergeId: any = null;

    start() {
    }

    updatePanel(meta: any, index: any, shopmeta: any) {
        this.shopmeta = shopmeta;
        this.meta = meta;
        const num = meta.Count();
        const numAdd = Math.round(meta.Off() * 100);
        const price = meta.PriceString();
        const contentParams: any = {};
        contentParams.infoBtnParams = {
            canTouch: true,
            showInfoBtn: true,
            callback: () => {
                console.log('clicked item', meta.Content().Id());
                UIRoot.instance.openChildWindow('MergeTypeWindow', { mergeId: meta.Content().Id() });
            },
        };

        this.contentM.show(meta.Content(), contentParams);
        this.spinNum.string = String.format(GameKit.i18n.t('ShopSpinNum'), GameKit.StringUtil.formatNumber(num));
        this.leftText.string = GameKit.i18n.t('ShopLeft') + this.meta.sdata.leftNum;
        this.spinNumAdd.string = numAdd <= 0 ? '' : String.format(GameKit.i18n.t('ShopAddPercent'), numAdd);

        if (!meta.OnSale()) {
            this.offNode.active = false;
            this.spinNumAdd.node.active = true;
        } else {
            this.offNode.active = true;
            this.offText.string = String.format(GameKit.i18n.t('OffText'), numAdd);
            this.spinNumAdd.node.active = false;
        }

        this.oldText.node.active = false;
        console.log('多少钱', price);

        this.spinNum.cacheMode = Label.CacheMode.BITMAP;
        this.spinNumAdd.cacheMode = Label.CacheMode.BITMAP;
        this.offText.cacheMode = Label.CacheMode.BITMAP;
        this.oldText.cacheMode = Label.CacheMode.BITMAP;

        this.CurrencyType(price);
    }

    CurrencyType(price: any) {
        this.btn_ad.active = false;
        this.btn_cash.active = false;
        this.btn_coin.active = false;
        this.btn_free.active = false;
        this.btn_over.active = false;
        this.leftNode.active = true;
        if (this.meta.sdata.leftNum <= 0) {
            this.leftNode.active = false;
            this.btn_over.active = true;
            return;
        }
        switch (this.meta.CurrencyType()) {
            case 0:
                this.btn_free.active = true;
                break;
            case 1:
                this.coinLbl.string = price;
                this.btn_coin.active = true;
                break;
            case 7:
                this.cashLbl.string = price;
                this.btn_cash.active = true;
                break;
            default:
                break;
        }
    }

    openCookingRecipeWindow(resultId: any) {
        UIRoot.instance.openChildWindow('MergeCookingRecipeWindow', {
            resultId: resultId,
            toolId: this.mergeId,
            sourceWindow: this,
        });
    }

    onBuy() {
        if (this.meta.sdata.leftNum <= 0) {
            console.log('库存没了');
            return;
        }
        if (this.meta.CurrencyType() != 0) {
            const c = new Game.Content(this.meta.CurrencyType(), 0, this.meta.Price());
            if (Game.ContentCheck.CheckContent(c)) {
                console.log('sale', this.shopmeta.Name());
                const req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name());
                req.SetCallBack((res: any) => {
                    GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res);
                    console.log('sale', res.rewards);
                    UIRoot.instance.openChildWindow('ShopBuySucessWindow', { rewards: res.rewards });
                });
                req.Send();
            }
        } else {
            console.log('sale免费', this.shopmeta.Name());
            const req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name());
            req.SetCallBack((res: any) => {
                GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res);
                console.log('sale', res.rewards);
                UIRoot.instance.openChildWindow('ShopBuySucessWindow', { rewards: res.rewards });
            });
            req.Send();
        }
    }
}

export default ShopSaleItem;
