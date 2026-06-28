import { _decorator, Component, Sprite, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopChestItem')
export class ShopChestItem extends Component {
    @property(Sprite)
    public icon = null;
    @property(Label)
    public itemName = null;
    @property(Label)
    public price = null;

    start () {
    }

    updatePanel (meta: any, index: any, icon: any) {
        // this.meta = meta 
        // this.icon.node.height *= 1 - 0.05 * (3-index) 
        // this.icon.spriteFrame = icon 
        // require("fixedSizeRatio").fitByHeight(this.icon) 
        // this.itemName.string = this.meta.Content().Name() 
        // this.price.string = this.meta.PriceString() 
        // this.node.setSiblingIndex(index+1) 
    }

    onBuy () {
        // let price = this.meta.Price() 
        // if (Game.SUser.Coin() < price) { 
            // return 
        // } 
        // let req = SR.SRShop.payFor(this.meta.Id()) 
        // req.SetCallBack(function(v) { 
            // if (UIRoot.instance.GetWindow("CardAllSetWindow")) { 
                // UIRoot.instance.GetWindow("CardAllSetWindow").svt.flushData() 
            // } 
            // UIRoot.instance.openChildWindow("CardChestOpenWindow", { 
                // chest: v.chest, showCallback: (wnd) => { 
                    // wnd.addOnCloseFunc(() => { 
                    // }); 
                // } 
            // }) 
        // }.bind(this)) 
        // req.Send() 
    }

    onInfo () {
        // UIRoot.instance.openChildWindow("CardChestInfoWindow", { meta: this.meta, card_chest_meta_id: this.meta.Type() == Meta.ShopMeta.Types.Chest?this.meta.DefaultPrice():this.meta.RawCount(), shopMeta: this.meta }) 
    }

    updateAdPanel (icon: any) {
        // this.icon.spriteFrame = icon 
        // require("fixedSizeRatio").fitByHeight(this.icon) 
        // this.itemName.string = GameKit.i18n.t("ContentNameChest4") 
        // this.price.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})` 
        // this.itemName.node.parent.getChildByName("flash").active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount 
    }

    updateAdMagicalPanel (icon: any, meta: any) {
        // this.meta = meta 
        // this.icon.spriteFrame = icon 
        // require("fixedSizeRatio").fitByHeight(this.icon) 
        // this.itemName.string = GameKit.i18n.t("ContentNameChest7")         
        // this.price.string = this.meta.PriceString() 
    }

    onWatch () {
        // if (Game.SUserCard.data.freeCount >= G.GameConstance.dailyFreeChestCount) return 
        // AppKit.ADWrap.ShowVideo(() => { 
            // let req = SR.SRCard.watchChest() 
            // req.SetCallBack(() => { 
                // let cardWnd = UIRoot.instance.GetWindow("CardAllSetWindow") 
                // if (cardWnd) { 
                    // cardWnd.svt.flushData() 
                    // cardWnd.labelFree.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})` 
                    // cardWnd.btnWatchFree.active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount 
                // } 
                // require("CardChestOpenWindow").tryShow() 
                // this.price.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})` 
                // this.itemName.node.parent.getChildByName("flash").active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount 
            // }) 
            // req.Send() 
        // }, "freeChest") 
    }

    onBuyMagical () {
        // AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) { 
            // if (ok) { 
                // UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"card"}) 
                // GameKit.SoundManager.playSound("item_purchased") 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 1}) 
            // } else { 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: -1}) 
            // } 
        // }.bind(this)) 
        // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 0}) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         icon: cc.Sprite,
//         itemName: cc.Label,
//         price: cc.Label,
//     },
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     // onLoad () {},
// 
//     start() {
// 
//     },
// 
//     updatePanel(meta, index, icon) {
//         this.meta = meta
// 
//         this.icon.node.height *= 1 - 0.05 * (3-index)
//         this.icon.spriteFrame = icon
//         require("fixedSizeRatio").fitByHeight(this.icon)
// 
//         this.itemName.string = this.meta.Content().Name()
// 
//         this.price.string = this.meta.PriceString()
//         this.node.setSiblingIndex(index+1)
//     },
//     //金币宝箱
//     onBuy() {
//         //判断金币是否足够购买
//         let price = this.meta.Price()
//         if (Game.SUser.Coin() < price) {
//             //UIRoot.instance.GetWindow("ShopWindow").tab_node_array.changeIndex(1)
//             return
//         }
// 
//         let req = SR.SRShop.payFor(this.meta.Id())
//         
//         req.SetCallBack(function(v) {
//             if (UIRoot.instance.GetWindow("CardAllSetWindow")) {
//                 UIRoot.instance.GetWindow("CardAllSetWindow").svt.flushData()
//             }
//             UIRoot.instance.openChildWindow("CardChestOpenWindow", {
//                 chest: v.chest, showCallback: (wnd) => {
//                     wnd.addOnCloseFunc(() => {
//                     });
//                     
//                 }
//             })
//         }.bind(this))
//         req.Send()
//     },
// 
//     onInfo() {
//         UIRoot.instance.openChildWindow("CardChestInfoWindow", { meta: this.meta, card_chest_meta_id: this.meta.Type() == Meta.ShopMeta.Types.Chest?this.meta.DefaultPrice():this.meta.RawCount(), shopMeta: this.meta })
//     },
//     
//     updateAdPanel(icon) {
//         this.icon.spriteFrame = icon
//         require("fixedSizeRatio").fitByHeight(this.icon)
// 
//         this.itemName.string = GameKit.i18n.t("ContentNameChest4")
//         
//         this.price.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`
//         this.itemName.node.parent.getChildByName("flash").active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount
// 
//     },
//     updateAdMagicalPanel(icon,meta) {
//         this.meta = meta
//         this.icon.spriteFrame = icon
//         require("fixedSizeRatio").fitByHeight(this.icon)
// 
//         this.itemName.string = GameKit.i18n.t("ContentNameChest7")        
//         this.price.string = this.meta.PriceString()
//     },
// 
//     //视频宝箱
//     onWatch() {
//         if (Game.SUserCard.data.freeCount >= G.GameConstance.dailyFreeChestCount) return
// 
//         AppKit.ADWrap.ShowVideo(() => {
//             let req = SR.SRCard.watchChest()
//             req.SetCallBack(() => {
//                 let cardWnd = UIRoot.instance.GetWindow("CardAllSetWindow")
//                 if (cardWnd) {
//                     cardWnd.svt.flushData()
//                     cardWnd.labelFree.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`
//                     cardWnd.btnWatchFree.active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount
//                 }
//                 require("CardChestOpenWindow").tryShow()
//                 
//                 this.price.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`
//                 this.itemName.node.parent.getChildByName("flash").active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount
//             })
//             req.Send()
//         }, "freeChest")
//     },
//     //魔法宝箱
//     onBuyMagical(){        
//         AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) {
//             if (ok) {
//                 UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"card"})
//                 GameKit.SoundManager.playSound("item_purchased")
// 
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 1})
//             } else {
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: -1})
//             }
//         }.bind(this))
// 
//         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 0})
// 
//     },
// });
