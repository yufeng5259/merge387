import { _decorator, Component, Sprite, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

const TypeTreatFoodItemId = 3
@ccclass('ShopTreatItem')
export class ShopTreatItem extends Component {
    @property(Sprite)
    public spIcon = null;
    @property(Label)
    public labelName = null;
    @property(Label)
    public labelNum = null;
    @property(Label)
    public labelNumAdd = null;
    @property(Label)
    public labelPrice = null;
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
        // let content = meta.Content() 
        // this.spIcon.spriteFrame = icon 
        // this.labelName.string=content.Name() 
        // this.labelNum.string = GameKit.StringUtil.formatNumber(num) 
        // this.labelNum.node.color = content.Id() == TypeTreatFoodItemId ? cc.color().fromHEX("#ffa45b") : cc.color().fromHEX("#ff7bff") 
        // this.labelNum.node.getComponent(cc.LabelOutline).color = content.Id() == TypeTreatFoodItemId ? cc.color().fromHEX("#601200") : cc.color().fromHEX("#390370") 
        // if(numAdd <= 0){ 
            // this.labelNumAdd.string = "" 
        // }else{ 
            // this.labelNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)         
        // } 
        // if(!meta.OnSale()){ 
            // this.offNode.active = false 
            // this.labelNumAdd.node.active = true 
            // if (content.Id() == TypeTreatFoodItemId) { 
                // this.labelNumAdd.string = String.format(GameKit.i18n.t("ShopTreatFoodTime"), Math.round(G.GameConstance.servantFoodTime*content.Count()/3600)) 
            // } 
        // }else{ 
            // this.offNode.active = true 
            // this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd) 
            // this.labelNumAdd.node.active = false 
        // } 
        // { 
            // this.popularIcon.active = false 
            // this.bestValueIcon.active = false 
        // } 
        // this.oldText.node.active = false 
        // if (oldMeta != meta) { 
            // this.oldText.node.active = true 
            // let oldNum = oldMeta.Count() 
            // this.oldText.string = GameKit.StringUtil.formatNumber(oldNum) + " " + content.Name() 
        // } 
        // this.labelPrice.string = price 
        // this.labelNum.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.labelNumAdd.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.offText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.oldText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.labelPrice.cacheMode = cc.Label.CacheMode.BITMAP 
    }

    onBuy () {
        // AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) { 
            // if (ok) { 
                // UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"treat", showCallback: (wnd) => {wnd.addOnCloseFunc(() => { 
                    // UIRoot.instance.closeChildWindow("ShopWindow") 
                    // if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta}) 
                // })}}) 
                // GameKit.SoundManager.playSound("item_purchased") 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"treat", name: this.meta.Name(), phase: 1}) 
            // } else { 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"treat", name: this.meta.Name(), phase: -1}) 
            // } 
        // }.bind(this)) 
        // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"treat", name: this.meta.Name(), phase: 0}) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// const TypeTreatFoodItemId = 3
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         spIcon:       cc.Sprite,
//         labelName:cc.Label,
//         labelNum:        cc.Label,
//         labelNumAdd:     cc.Label,
//         labelPrice:      cc.Label,
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
//         let content = meta.Content()
// 
//         this.spIcon.spriteFrame = icon
//         this.labelName.string=content.Name()
//         this.labelNum.string = GameKit.StringUtil.formatNumber(num)
//         this.labelNum.node.color = content.Id() == TypeTreatFoodItemId ? cc.color().fromHEX("#ffa45b") : cc.color().fromHEX("#ff7bff")
//         this.labelNum.node.getComponent(cc.LabelOutline).color = content.Id() == TypeTreatFoodItemId ? cc.color().fromHEX("#601200") : cc.color().fromHEX("#390370")
//         
//         if(numAdd <= 0){
//             this.labelNumAdd.string = ""
//         }else{
//             this.labelNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)        
//         }
// 
//         if(!meta.OnSale()){
//             this.offNode.active = false
//             this.labelNumAdd.node.active = true
//             if (content.Id() == TypeTreatFoodItemId) {
//                 this.labelNumAdd.string = String.format(GameKit.i18n.t("ShopTreatFoodTime"), Math.round(G.GameConstance.servantFoodTime*content.Count()/3600))
//             }
//         }else{
//             this.offNode.active = true
//             this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd)
//             this.labelNumAdd.node.active = false
//         }
//         
//         {
//             this.popularIcon.active = false
//             this.bestValueIcon.active = false
//         }
// 
//         this.oldText.node.active = false
//         if (oldMeta != meta) {
//             this.oldText.node.active = true
//             let oldNum = oldMeta.Count()
//             this.oldText.string = GameKit.StringUtil.formatNumber(oldNum) + " " + content.Name()
//         }
// 
//         this.labelPrice.string = price
// 
//         this.labelNum.cacheMode = cc.Label.CacheMode.BITMAP
//         this.labelNumAdd.cacheMode = cc.Label.CacheMode.BITMAP
//         this.offText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.oldText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.labelPrice.cacheMode = cc.Label.CacheMode.BITMAP
//     },
// 
//     onBuy(){
//         AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) {
//             if (ok) {
//                 UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"treat", showCallback: (wnd) => {wnd.addOnCloseFunc(() => {
//                     UIRoot.instance.closeChildWindow("ShopWindow")
//                     if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta})
//                 })}})
//                 GameKit.SoundManager.playSound("item_purchased")
// 
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"treat", name: this.meta.Name(), phase: 1})
//             } else {
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"treat", name: this.meta.Name(), phase: -1})
//             }
//         }.bind(this))
// 
//         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"treat", name: this.meta.Name(), phase: 0})
//     }
// });
