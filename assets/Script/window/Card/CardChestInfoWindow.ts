import { _decorator, Button, Color, instantiate, Label, Node, Prefab, ProgressBar, RichText, Sprite, SpriteFrame, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { fitByHeight } from '../../GameKit/render/fixedSizeRatio';
import CardChestOpenWindow from './CardChestOpenWindow';
/** @author fengyong-2019-6-5 */

const { ccclass, property } = _decorator
const C = {
    highChangeNY: 45,
}

/**
 * 卡牌宝箱介绍页面
 * - card_chest_meta_id:number
 */
@ccclass
export default class CardChestInfoWindow extends UIWindow {

    static windowPath = "Card/CardChestInfoWindow";

    meta: any = null
    shopMeta: any = null

    onShow(showParams) {
        this.meta = showParams.meta
        this.shopMeta = showParams.shopMeta
        this.card_chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, showParams.card_chest_meta_id || 1)
        this.load_page()
    }

    load_page() {
        this.label_title.string = new Game.Content(Game.Content.Types.CardChest, this.card_chest_meta.Id(), 1).Name()
        this.label_all_count.string = `x${this.card_chest_meta.CardNum()}`
        this.sp_card_chest.spriteFrame = this.spf_card_chest_list[this.card_chest_meta.Id() - 1]
        this.sp_high_chance_card_1.spriteFrame = this.spf_card_rare_list[this.card_chest_meta.Rare1() - 1]
        this.sp_high_chance_card_2.spriteFrame = this.spf_card_rare_list[this.card_chest_meta.Rare2() - 1]

        let leastRare = this.card_chest_meta.LeastRare()
        if (leastRare > 0) {
            this.spf_card_back.spriteFrame = this.spf_card_rare_list[leastRare - 1]
            fitByHeight(this.spf_card_back)
        } else {
            this.spf_card_back.node.active = false
            this.sp_high_chance.setPosition(this.sp_high_chance.position.x, C.highChangeNY, this.sp_high_chance.position.z)
        }
    }

    /** @type {CardChestMeta} */
    card_chest_meta = null

    /** @type {Label} */
    @property({ tooltip: "标题", type: Label })
    label_title = null

    /** @type {Label} */
    @property({ tooltip: "总个数", type: Label })
    label_all_count = null

    /** @type {Sprite} */
    @property({ tooltip: "箱子sp", type: Sprite })
    sp_card_chest = null

    /** @type {Node} */
    @property({ tooltip: "高概率node", type: Node })
    sp_high_chance = null

    /** @type {Sprite} */
    @property({ tooltip: "高概率卡片1", type: Sprite })
    sp_high_chance_card_1 = null

    /** @type {Sprite} */
    @property({ tooltip: "高概率卡片2", type: Sprite })
    sp_high_chance_card_2 = null

    /** @type {SpriteFrame[]} */
    @property({ tooltip: "箱子对应的spf-list", type: SpriteFrame })
    spf_card_chest_list = []

    /** @type {SpriteFrame[]} */
    @property({ tooltip: "卡片对应的spf-list", type: SpriteFrame })
    spf_card_rare_list = []

    /** @type {Sprite} */
    @property({ tooltip: "保底卡", type: Sprite })
    spf_card_back = null

    event_close() {
        this.closeAnim()
    }

    event_buy() {
        if (this.shopMeta.Type() == Meta.ShopMeta.Types.Chest) {
            let price = this.meta.Price()
            if (Game.SUser.Coin() < price) {
                this.closeAnim()
                let shopWindow = UIRoot.instance.GetWindow("ShopWindow")
                if (shopWindow && shopWindow.tab_node_array) {
                    shopWindow.tab_node_array.changeIndex(1)
                } else {
                    UIRoot.instance.openChildWindow("ShopWindow", {showCoin: true})
                }
                return
            }
    
            let req = SR.SRShop.payFor(this.meta.Id())
            req.SetCallBack(function() {
                this.closeAnim()
                UIRoot.instance.closeChildWindow("ShopWindow")
                CardChestOpenWindow.tryShow()
            }.bind(this))
            req.Send()
        } else {
            AppKit.PaymentWrap.Pay(this.shopMeta.Name(), function(ok) {
                if (ok) {
                    
                    UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"card", showCallback: (wnd) => {
                        wnd.addOnCloseFunc(() => {
                            this.closeAnim()
                            UIRoot.instance.closeChildWindow("ShopWindow")
                        })
                    }})
                    GameKit.SoundManager.playSound("item_purchased")
    
                    AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.shopMeta.Name(), phase: 1})
                } else {
                    AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.shopMeta.Name(), phase: -1})
                }
            }.bind(this))
    
            AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.shopMeta.Name(), phase: 0})
        }
        
    }

}
