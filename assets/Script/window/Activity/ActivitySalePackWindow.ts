import { _decorator, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivitySalePackWindow')
export default class ActivitySalePackWindow extends UIWindow {
    public static windowPath = 'Activity/ActivitySalePackWindow';

    @property([Node])
    nodes: Node[] = [];

    @property([Component])
    items: Component[] = [];

    @property(Label)
    labelPrice: Label | null = null;

    @property(Label)
    labelOldPrice: Label | null = null;

    @property(Node)
    labelOldPriceLine: Node | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Label)
    labelOff: Label | null = null;

    @property(Sprite)
    spBg: Sprite | null = null;

    @property(Node)
    spDecoration: Node | null = null;

    meta: any = null;
    metaParam: any = null;
    shopId: any = null;
    shopMeta: any = null;
    contents: any[] = [];
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta
        this.metaParam = this.meta.Param()
        
        this.shopId = this.meta.ShopId()
        this.shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.shopId)
        this.contents = Game.Content.Merge(this.shopMeta.Content().Contents())

        this.items.forEach((x, i) => {
            (x as any).show(this.contents[i])
            if (!this.contents[i]) x.node.active = false
        })
        
        if (this.labelPrice) this.labelPrice.string = this.shopMeta.PriceString()

        if (this.shopMeta.Type() == Meta.ShopMeta.Types.DynamicPack) {
            let packMeta = Meta.DynamicPackMeta.FindMeta(this.shopMeta.Content().Id(), Game.SUserVillage.MapId(), Game.SUserRecord.GetPurchaseMoney())
            if (packMeta.OldPriceShopId()) {
                let oldPriceShopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, packMeta.OldPriceShopId())
                if (oldPriceShopMeta) {
                    if (this.labelOldPrice) this.labelOldPrice.string = oldPriceShopMeta.PriceString()
                } else {
                    if (!this.metaParam.oldPriceLine) this.metaParam.oldPriceLine = {}
                    this.metaParam.oldPriceLine.width = 0
                    if (this.labelOldPrice) this.labelOldPrice.string = ""
                }
            } else {
                if (!this.metaParam.oldPriceLine) this.metaParam.oldPriceLine = {}
                this.metaParam.oldPriceLine.width = 0
                if (this.labelOldPrice) this.labelOldPrice.string = ""
            }
        } else {
            if (this.metaParam.oldPriceShopId) {
                let oldPriceShopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, this.metaParam.oldPriceShopId)
                if (oldPriceShopMeta) {
                    if (this.labelOldPrice) this.labelOldPrice.string = oldPriceShopMeta.PriceString()
                } else {
                    if (!this.metaParam.oldPriceLine) this.metaParam.oldPriceLine = {}
                    this.metaParam.oldPriceLine.width = 0
                    if (this.labelOldPrice) this.labelOldPrice.string = ""
                }
            } else {
                if (!this.metaParam.oldPriceLine) this.metaParam.oldPriceLine = {}
                this.metaParam.oldPriceLine.width = 0
                if (this.labelOldPrice) this.labelOldPrice.string = ""
            }
        }

        let rawNames = []
        this.nodes.forEach(x => {
            CCTools.SetNodeByParam(x, this.metaParam[x.name])
            rawNames.push(x.name)
        })
        for (let name in this.metaParam) {
            if (rawNames.indexOf(name) >= 0) continue;
            if (name == "badgeTime" || name == "oldPriceShopId") continue;
            let nnode = new Node(name)
            if (this.spDecoration) nnode.parent = this.spDecoration
            CCTools.SetNodeByParam(nnode, this.metaParam[name])
        }

        if (this.shopMeta.Type() == Meta.ShopMeta.Types.DynamicPack) {
            let packMeta = Meta.DynamicPackMeta.FindMeta(this.shopMeta.Content().Id(), Game.SUserVillage.MapId(), Game.SUserRecord.GetPurchaseMoney())
            if (this.labelOff) this.labelOff.string = Math.round(packMeta.Off() * 100).toString() + "%"
        } else {
            if (this.labelOff) this.labelOff.string = Math.round(this.shopMeta.Off() * 100).toString() + "%"
        }

        let img = this.meta.Image()
        if (img.startsWith("http")) {
            cce.loaderLoad({url: img, type: "png"}, (err: any, v: ImageAsset) => {
                if (err != null) { Logs.Warning(err); return }
                if (!this.spBg || !this.node) return
                this.spBg.spriteFrame = createSpriteFrame(v)
            })
        } else {
            let resName = 'res/Activity/images/' + img
            cce.loadRes(resName, SpriteFrame, (err: any, v: SpriteFrame) => {
                if (err != null) { Logs.Warning(err); return }
                if (!this.spBg || !this.node) return
                this.spBg.spriteFrame = v
            })
        }

        this.leftTime = 0
        this.update(0)
    }

    update(dt?: number) {
        if (this.leftTime != null) {

            let currentTime = GameKit.TimeUtil.getCurrentTime()
            
            this.leftTime = this.meta.EndTime() - currentTime

            if (this.labelTimer) this.labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false)

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }
    }

    close_window() {
        this.closeAnim()
    }

    callBuy() {
        let shopmeta = this.shopMeta
        let congrats = Game.SUserStatus.DoubleTicketTime()
        let congratsR = Game.SUserStatus.DoubleTicketRate()
        AppKit.PaymentWrap.Pay(shopmeta.Name(), (ok: boolean) => {
            if (ok) {
                GameKit.SoundManager.playSound("item_purchased")

                UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"pack", showCallback: (wnd) => {
                    wnd.addOnCloseFunc(() => {
                        if (this.node) this.closeAnim()
                    })
                }})

                let purchasedActivityId = GameKit.PlayerPrefs.GetObject("purchasedActivityId", [])
                purchasedActivityId.push(this.meta.Id())
                GameKit.PlayerPrefs.SetObject("purchasedActivityId", purchasedActivityId)
                GameMainWindow.instance.RemoveActivityBadge(this.meta.Id())
                Game.ActivityManager.logined()

                AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"pack", name: shopmeta.Name(), phase: 1})

                if (congrats > GameKit.TimeUtil.getCurrentTime()) {
                    AppKit.LogEventWrap.logEvent("CongratsDetail", {id: shopmeta.Name(), rate: congratsR, leftTime: congrats-GameKit.TimeUtil.getCurrentTime()})
                }
            } else {
                AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"pack", name: shopmeta.Name(), phase: -1})
            }
        })

        AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"pack", name: shopmeta.Name(), phase: 0})
    }
}
