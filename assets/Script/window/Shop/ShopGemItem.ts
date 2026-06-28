import { _decorator, Component, Sprite, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopGemItem')
export class ShopGemItem extends Component {
    @property(Sprite)
    public spinIcon = null;
    @property(Label)
    public spinNum = null;
    @property(Label)
    public spinNumAdd = null;
    @property(Label)
    public spinPrice = null;
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
        // this.spinIcon.spriteFrame = icon 
        // this.spinNum.string = num;//String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(num)) 
        // if(numAdd <= 0){ 
            // this.spinNumAdd.string = "" 
        // }else{ 
            // this.spinNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)         
        // } 
        // if(!meta.OnSale()){ 
            // this.offNode.active = false 
            // this.spinNumAdd.node.active = true 
        // }else{ 
            // this.offNode.active = true 
            // this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd) 
            // this.spinNumAdd.node.active = false 
        // } 
        // this.oldText.node.active = false 
        // if (oldMeta != meta) { 
            // this.oldText.node.active = true 
            // let oldNum = oldMeta.Count() 
            // this.oldText.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(oldNum)) 
        // } 
        // this.spinPrice.string = price 
        // this.spinNum.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.spinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.offText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.oldText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.spinPrice.cacheMode = cc.Label.CacheMode.BITMAP 
    }

    onBuy () {
        // AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) { 
            // if (ok) { 
                // UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"spin", showCallback: (wnd) => {wnd.addOnCloseFunc(() => { 
                    // UIRoot.instance.closeChildWindow("ShopWindow") 
                    // if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta}) 
                // })}}) 
                // GameKit.SoundManager.playSound("item_purchased") 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"spin", name: this.meta.Name(), phase: 1}) 
            // } else { 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"spin", name: this.meta.Name(), phase: -1}) 
            // } 
        // }.bind(this)) 
        // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"spin", name: this.meta.Name(), phase: 0}) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         spinIcon:       cc.Sprite,
//         spinNum:        cc.Label,
//         spinNumAdd:     cc.Label,
//         spinPrice:      cc.Label,
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
//         this.spinIcon.spriteFrame = icon
//         this.spinNum.string = num;//String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(num))
// 
//         if(numAdd <= 0){
//             this.spinNumAdd.string = ""
//         }else{
//             this.spinNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)        
//         }
// 
//         if(!meta.OnSale()){
//             this.offNode.active = false
//             this.spinNumAdd.node.active = true
//         }else{
//             this.offNode.active = true
//             this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd)
//             this.spinNumAdd.node.active = false
//         }
//         
//         // if(index == 2){
//         //     this.popularIcon.active = true
//         //     this.bestValueIcon.active = false
//         // }else if(index == 5){
//         //     this.popularIcon.active = false
//         //     this.bestValueIcon.active = true
//         // }else{
//         //     this.popularIcon.active = false
//         //     this.bestValueIcon.active = false
//         // }
// 
//         this.oldText.node.active = false
//         if (oldMeta != meta) {
//             this.oldText.node.active = true
//             let oldNum = oldMeta.Count()
//             this.oldText.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(oldNum))
//         }
//         this.spinPrice.string = price
// 
//         this.spinNum.cacheMode = cc.Label.CacheMode.BITMAP
//         this.spinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP
//         this.offText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.oldText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.spinPrice.cacheMode = cc.Label.CacheMode.BITMAP
//     },
// 
//     onBuy(){
//         AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) {
//             if (ok) {
//                 UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"spin", showCallback: (wnd) => {wnd.addOnCloseFunc(() => {
//                     UIRoot.instance.closeChildWindow("ShopWindow")
//                     if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta})
//                 })}})
//                 GameKit.SoundManager.playSound("item_purchased")
// 
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"spin", name: this.meta.Name(), phase: 1})
//             } else {
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"spin", name: this.meta.Name(), phase: -1})
//             }
//         }.bind(this))
// 
//         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"spin", name: this.meta.Name(), phase: 0})
//     }
// });
