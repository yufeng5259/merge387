import { _decorator, Component, Label, Node, Sprite } from 'cc';
import ContentModel from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('ShopHotItem')
export class ShopHotItem extends Component {
    @property(Sprite)
    public spinIcon: Sprite = null;
    @property(Label)
    public spinNum: Label = null;
    @property(Label)
    public spinNumAdd: Label = null;
    @property(Label)
    public spinPrice: Label = null;
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
    @property(Label)
    public leftText: Label = null;
    @property(ContentModel)
    public contentM: ContentModel = null;
    @property(Node)
    public btn_buy: Node = null;
    @property(Node)
    public btn_over: Node = null;
    @property(Node)
    public leftNode: Node = null;

    public meta: any = null;
    public shopmeta: any = null;

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
                console.log('点击了物品', meta.Content().Id());
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
        this.spinPrice.string = price;

        this.spinNum.cacheMode = Label.CacheMode.BITMAP;
        this.spinNumAdd.cacheMode = Label.CacheMode.BITMAP;
        this.offText.cacheMode = Label.CacheMode.BITMAP;
        this.oldText.cacheMode = Label.CacheMode.BITMAP;
        this.spinPrice.cacheMode = Label.CacheMode.BITMAP;

        this.btn_buy.active = true;
        this.btn_over.active = false;
        this.leftNode.active = true;
        if (this.meta.sdata.leftNum <= 0) {
            this.btn_buy.active = false;
            this.leftNode.active = false;
            this.btn_over.active = true;
        }
    }

    onBuy() {
        console.log('热卖购买', this.shopmeta.Id());
        if (this.meta.sdata.leftNum <= 0) {
            console.log('没了');
            return;
        }
        if (this.meta.CurrencyType() != 0) {
            const c = new Game.Content(this.meta.CurrencyType(), 0, this.meta.Price());
            if (Game.ContentCheck.CheckContent(c)) {
                const req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name());
                req.SetCallBack((res: any) => {
                    console.log('热卖', res);
                    GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res);
                    UIRoot.instance.openChildWindow('ShopBuySucessWindow', { rewards: res.rewards });
                });
                req.Send();
            }
        } else {
            console.log('货币类型不对', this.meta.CurrencyType());
        }
    }
}

export default ShopHotItem;
