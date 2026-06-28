import { _decorator, Component, Sprite, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopSaleItem')
export class ShopSaleItem extends Component {
    @property(Sprite)
    public spinIcon = null;
    @property(Label)
    public spinNum = null;
    @property(Label)
    public spinNumAdd = null;
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
    @property
    public contentM = 'require(ContentModel)';
    @property(Label)
    public leftText = null;
    @property(Node)
    public btn_cash = null;
    @property(Node)
    public btn_coin = null;
    @property(Node)
    public btn_ad = null;
    @property(Node)
    public btn_free = null;
    @property(Node)
    public btn_over = null;
    @property(Node)
    public leftNode = null;
    @property(Label)
    public cashLbl = null;
    @property(Label)
    public coinLbl = null;

    start () {
    }

    updatePanel (meta: any, index: any, shopmeta: any) {
        // this.shopmeta = shopmeta; 
        // this.meta = meta 
        // let num = meta.Count() 
        // let numAdd = Math.round(meta.Off() * 100) 
        // let price = meta.PriceString() 
        // let contentParams = {} 
        // contentParams.infoBtnParams = { 
            // canTouch: true, 
            // showInfoBtn: true, 
            // callback: () => { 
                // console.log("clicked item", meta.Content().Id()); 
                // UIRoot.instance.openChildWindow("MergeTypeWindow", { mergeId: meta.Content().Id() }) 
            // } 
        // } 
        // this.contentM.show(meta.Content(), contentParams); 
        // this.spinNum.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(num)) 
        // this.leftText.string = GameKit.i18n.t("ShopLeft") + this.meta.sdata.leftNum 
        // if (numAdd <= 0) { 
            // this.spinNumAdd.string = "" 
        // } else { 
            // this.spinNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd) 
        // } 
        // if (!meta.OnSale()) { 
            // this.offNode.active = false 
            // this.spinNumAdd.node.active = true 
        // } else { 
            // this.offNode.active = true 
            // this.offText.string = String.format(GameKit.i18n.t("OffText"), numAdd) 
            // this.spinNumAdd.node.active = false 
        // } 
        // this.oldText.node.active = false 
        // console.log("多少钱",price); 
        // this.spinNum.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.spinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.offText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.oldText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.CurrencyType(price); 
    }

    CurrencyType (price: any) {
        // this.btn_ad.active = false; 
        // this.btn_cash.active = false; 
        // this.btn_coin.active = false; 
        // this.btn_free.active = false; 
        // this.btn_over.active = false; 
        // this.leftNode.active = true; 
        // if(this.meta.sdata.leftNum<=0){ 
            // this.leftNode.active = false; 
            // this.btn_over.active = true; 
            // return; 
        // } 
        // switch (this.meta.CurrencyType()) { 
            // case 0: 
                // this.btn_free.active = true; 
                // break; 
            // case 1: 
                // this.coinLbl.string = price 
                // this.btn_coin.active = true;  
                // break; 
            // case 7: 
                // this.cashLbl.string = price 
                // this.btn_cash.active = true;  
                // break; 
            // default: 
                // break; 
        // } 
    }

    openCookingRecipeWindow (resultId: any) {
        // UIRoot.instance.openChildWindow("MergeCookingRecipeWindow", { 
            // resultId: resultId, 
            // toolId: this.mergeId, 
            // sourceWindow: this 
        // }) 
    }

    onBuy () {
        // if(this.meta.sdata.leftNum<=0){ 
            // console.log("库存没了"); 
            // return 
        // } 
        // if(this.meta.CurrencyType()!=0){ 
            // let c =new Game.Content(this.meta.CurrencyType(),0,this.meta.Price()) 
            // if(Game.ContentCheck.CheckContent(c)){ 
                // console.log("sale", this.shopmeta.Name()); 
                // let req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name()); 
                // req.SetCallBack((res) => { 
                    // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res) 
                    // console.log("sale", res.rewards); 
                    // UIRoot.instance.openChildWindow("ShopBuySucessWindow", {"rewards": res.rewards}) 
                // }) 
                // req.Send(); 
            // } 
        // }else{ 
                // console.log("sale免费", this.shopmeta.Name()); 
                // let req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name()); 
                // req.SetCallBack((res) => { 
                    // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res) 
                    // console.log("sale", res.rewards); 
                    // UIRoot.instance.openChildWindow("ShopBuySucessWindow", {"rewards": res.rewards}) 
                // }) 
                // req.Send(); 
        // } 
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
//         popularIcon:    cc.Node,
//         bestValueIcon:  cc.Node,
//         offNode:        cc.Node,
//         offText:        cc.Label,
//         oldText:        cc.Label,
//         contentM:       require("ContentModel"),
//         leftText:       cc.Label,
//         btn_cash:       cc.Node,//钻石按钮
//         btn_coin:       cc.Node,//金币按钮
//         btn_ad:         cc.Node,//视频按钮
//         btn_free:       cc.Node,//免费按钮
//         btn_over:       cc.Node,//缺货
//         leftNode:       cc.Node,//库存node
//         cashLbl:        cc.Label,
//         coinLbl:        cc.Label,
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
//     updatePanel(meta, index, shopmeta){
//         this.shopmeta = shopmeta;
//         this.meta = meta
//         let num = meta.Count()
//         let numAdd = Math.round(meta.Off() * 100)
//         let price = meta.PriceString()
//         let contentParams = {}
//         contentParams.infoBtnParams = {
//             canTouch: true,
//             showInfoBtn: true,
//             callback: () => {
//                 console.log("clicked item", meta.Content().Id());
//                 UIRoot.instance.openChildWindow("MergeTypeWindow", { mergeId: meta.Content().Id() })
//             }
//         }
//         this.contentM.show(meta.Content(), contentParams);
//         this.spinNum.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(num))
//         this.leftText.string = GameKit.i18n.t("ShopLeft") + this.meta.sdata.leftNum
//         if (numAdd <= 0) {
//             this.spinNumAdd.string = ""
//         } else {
//             this.spinNumAdd.string = String.format(GameKit.i18n.t("ShopAddPercent"), numAdd)
//         }
// 
//         if (!meta.OnSale()) {
//             this.offNode.active = false
//             this.spinNumAdd.node.active = true
//         } else {
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
//         // if (oldMeta != meta) {
//         //     this.oldText.node.active = true
//         //     let oldNum = oldMeta.Count()
//         //     this.oldText.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(oldNum))
//         // }
//         //this.spinPrice.string = price
//         console.log("多少钱",price);
//         
// 
//         this.spinNum.cacheMode = cc.Label.CacheMode.BITMAP
//         this.spinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP
//         this.offText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.oldText.cacheMode = cc.Label.CacheMode.BITMAP
// 
//         this.CurrencyType(price);
//     },
//     CurrencyType(price){
//         //0、免费
//         //1、金币
//         //7、钻石
//         this.btn_ad.active = false;
//         this.btn_cash.active = false;
//         this.btn_coin.active = false;
//         this.btn_free.active = false;
//         this.btn_over.active = false;
//         this.leftNode.active = true;
//         if(this.meta.sdata.leftNum<=0){
//             this.leftNode.active = false;
//             this.btn_over.active = true;
//             return;
//         }
//         switch (this.meta.CurrencyType()) {
//             case 0:
//                 this.btn_free.active = true;
//                 break;
//             case 1:
//                 //广告统一处理
//                 // if (this.meta.HasAd()&&AppKit.ADWrap.IsVideoPrepared()) {
//                 //     this.btn_ad.active =true;
//                 //     return;
//                 // }
//                 this.coinLbl.string = price
//                 this.btn_coin.active = true; 
//                 break;
//             case 7:
//                 //广告统一处理
//                 // if (this.meta.HasAd()&&AppKit.ADWrap.IsVideoPrepared()) {
//                 //     this.btn_ad.active =true;
//                 //     return;
//                 // }
//                 this.cashLbl.string = price
//                 this.btn_cash.active = true; 
//                 break;
//         
//             default:
//                 break;
//         }
//     },
//     openCookingRecipeWindow(resultId) {
//         UIRoot.instance.openChildWindow("MergeCookingRecipeWindow", {
//             resultId: resultId,
//             toolId: this.mergeId,
//             sourceWindow: this
//         })
//     },
// 
//     onBuy(){
//         if(this.meta.sdata.leftNum<=0){
//             console.log("库存没了");
//             return
//         }
//         if(this.meta.CurrencyType()!=0){
//             let c =new Game.Content(this.meta.CurrencyType(),0,this.meta.Price())
//             if(Game.ContentCheck.CheckContent(c)){
//                 console.log("sale", this.shopmeta.Name());
//                 let req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name());
//                 req.SetCallBack((res) => {
//                     GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res)
//                     console.log("sale", res.rewards);
//                     UIRoot.instance.openChildWindow("ShopBuySucessWindow", {"rewards": res.rewards})
//                 })
//                 req.Send();
//             }
//         }else{
//                 console.log("sale免费", this.shopmeta.Name());
//                 let req = SR.SRShop.BuyByShop(this.shopmeta.Id(), this.shopmeta.Name());
//                 req.SetCallBack((res) => {
//                     GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res)
//                     console.log("sale", res.rewards);
//                     UIRoot.instance.openChildWindow("ShopBuySucessWindow", {"rewards": res.rewards})
//                 })
//                 req.Send();
//         }
//         
//     }
// });
