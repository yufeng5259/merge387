/*if (GameMainWindow.instance) {
GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin, 0)
GameMainWindow.instance.playAddCoinAnim()
GameMainWindow.instance.scheduleOnce(() => {
GameMainWindow.instance.userinfo.changeCoin(oldCoin, Game.SUser.Coin(), 0.8)
}, 1)
}*/
import { _decorator, Component, Sprite, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopCoinItem')
export class ShopCoinItem extends Component {
    @property(Sprite)
    public coinIcon = null;
    @property(Label)
    public coinNum = null;
    @property(Label)
    public coinNumAdd = null;
    @property(Label)
    public coinPrice = null;
    @property(Node)
    public popularIcon = null;
    @property(Node)
    public bestValueIcon = null;
    @property(Node)
    public offNode = null;
    @property(Label)
    public offText = null;
    @property(Label)
    public oldText = null;

    start () {
    }

    updatePanel (meta: any, index: any, icon: any, oldMeta: any) {
        // this.meta = meta 
        // let num = meta.Count() 
        // let numAdd = Math.round(meta.Off() * 100) 
        // let price = meta.PriceString() 
        // this.coinIcon.spriteFrame = icon 
        // this.coinNum.string = GameKit.StringUtil.formatNumber(num) 
        // if(numAdd == 0){ 
            // this.coinNumAdd.string = "" 
        // }else{ 
            // this.coinNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)         
        // } 
        // if(!meta.OnSale()){ 
            // this.offNode.active = false 
            // this.coinNumAdd.node.active = true 
        // }else{ 
            // this.offNode.active = true 
            // this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd) 
            // this.coinNumAdd.node.active = false 
        // } 
        // if(index == 2){ 
            // this.popularIcon.active = true 
            // this.bestValueIcon.active = false 
        // }else if(index == 5){ 
            // this.popularIcon.active = false 
            // this.bestValueIcon.active = true 
        // }else{ 
            // this.popularIcon.active = false 
            // this.bestValueIcon.active = false 
        // } 
        // this.oldText.node.active = false 
        // if (oldMeta != meta) { 
            // this.oldText.node.active = true 
            // let oldNum = oldMeta.Count() 
            // this.oldText.string = GameKit.StringUtil.formatNumber(oldNum) 
        // } 
        // this.coinPrice.string = price 
        // this.coinNum.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.coinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.offText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.oldText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.coinPrice.cacheMode = cc.Label.CacheMode.BITMAP 
    }

    onBuy () {
        // AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) { 
            // if (ok) { 
                // let oldCoin = Game.SUser.Coin() 
                // UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"coin", showCallback: (wnd) => { 
                    // wnd.addOnCloseFunc(() => { 
                        // UIRoot.instance.closeChildWindow("ShopWindow") 
                        // if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta}) 
                    // }) 
                // }}) 
                // GameKit.SoundManager.playSound("item_purchased") 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"coin", name: this.meta.Name(), phase: 1}) 
            // } else { 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"coin", name: this.meta.Name(), phase: -1}) 
            // } 
        // }.bind(this)) 
        // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"coin", name: this.meta.Name(), phase: 0}) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         coinIcon:       cc.Sprite,
//         coinNum:        cc.Label,
//         coinNumAdd:     cc.Label,
//         coinPrice:      cc.Label,
//         popularIcon:    cc.Node,
//         bestValueIcon:  cc.Node,
//         offNode:        cc.Node,
//         offText:        cc.Label,
//         oldText:        cc.Label,
//     },
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     // onLoad () {},
// 
//     start () {
// 
//     },
// 
//     updatePanel(meta, index, icon, oldMeta){
//         this.meta = meta
//         let num = meta.Count()
//         let numAdd = Math.round(meta.Off() * 100)
//         let price = meta.PriceString()
// 
//         this.coinIcon.spriteFrame = icon
//         this.coinNum.string = GameKit.StringUtil.formatNumber(num)
// 
//         if(numAdd == 0){
//             this.coinNumAdd.string = ""
//         }else{
//             this.coinNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)        
//         }
// 
//         if(!meta.OnSale()){
//             this.offNode.active = false
//             this.coinNumAdd.node.active = true
//         }else{
//             this.offNode.active = true
//             this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd)
//             this.coinNumAdd.node.active = false
//         }
//         
//         if(index == 2){
//             this.popularIcon.active = true
//             this.bestValueIcon.active = false
//         }else if(index == 5){
//             this.popularIcon.active = false
//             this.bestValueIcon.active = true
//         }else{
//             this.popularIcon.active = false
//             this.bestValueIcon.active = false
//         }
// 
//         this.oldText.node.active = false
//         if (oldMeta != meta) {
//             this.oldText.node.active = true
//             let oldNum = oldMeta.Count()
//             this.oldText.string = GameKit.StringUtil.formatNumber(oldNum)
//         }
//         this.coinPrice.string = price
// 
//         this.coinNum.cacheMode = cc.Label.CacheMode.BITMAP
//         this.coinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP
//         this.offText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.oldText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.coinPrice.cacheMode = cc.Label.CacheMode.BITMAP
//     },
// 
//     onBuy(){
//         AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) {
//             if (ok) {
//                 let oldCoin = Game.SUser.Coin()
//                 
//                 UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"coin", showCallback: (wnd) => {
//                     wnd.addOnCloseFunc(() => {
//                         UIRoot.instance.closeChildWindow("ShopWindow")
//                         if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta})
//                     })
//                 }})
//                 GameKit.SoundManager.playSound("item_purchased")
//                 /*if (GameMainWindow.instance) {
//                     GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin, 0)
//                     GameMainWindow.instance.playAddCoinAnim()
//                     GameMainWindow.instance.scheduleOnce(() => {
//                         GameMainWindow.instance.userinfo.changeCoin(oldCoin, Game.SUser.Coin(), 0.8)
//                     }, 1)
//                 }*/
// 
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"coin", name: this.meta.Name(), phase: 1})
//             } else {
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"coin", name: this.meta.Name(), phase: -1})
//             }
//         }.bind(this))
// 
//         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"coin", name: this.meta.Name(), phase: 0})
//     }
// });
