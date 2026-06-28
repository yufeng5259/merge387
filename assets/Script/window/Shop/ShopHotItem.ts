import { _decorator, Component, Sprite, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopHotItem')
export class ShopHotItem extends Component {
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
    @property(Label)
    public leftText = null;
    @property
    public contentM = 'require(ContentModel)';
    @property(Node)
    public btn_buy = null;
    @property(Node)
    public btn_over = null;
    @property(Node)
    public leftNode = null;

    start () {
    }

    updatePanel (meta: any, index: any, shopmeta: any) {
        // this.shopmeta = shopmeta; 
        // this.meta = meta 
        // let num = meta.Count() 
        // let numAdd = Math.round(meta.Off() * 100) 
        // let price = meta.PriceString() 
        // let contentParams = {} 
        // contentParams.infoBtnParams={ 
            // canTouch:true, 
            // showInfoBtn:true, 
            // callback:()=>{ 
                // console.log("点击了物品",meta.Content().Id()); 
                // UIRoot.instance.openChildWindow("MergeTypeWindow", { mergeId: meta.Content().Id() }) 
            // } 
        // } 
        // this.contentM.show(meta.Content(),contentParams); 
        // this.spinNum.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(num)) 
        // this.leftText.string = GameKit.i18n.t("ShopLeft")+this.meta.sdata.leftNum 
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
        // this.spinPrice.string = price 
        // this.spinNum.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.spinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.offText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.oldText.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.spinPrice.cacheMode = cc.Label.CacheMode.BITMAP 
        // this.btn_buy.active = true; 
        // this.btn_over.active = false; 
        // this.leftNode.active = true; 
        // if(this.meta.sdata.leftNum<=0){ 
            // this.btn_buy.active = false; 
            // this.leftNode.active = false; 
            // this.btn_over.active = true; 
            // return; 
        // } 
    }

    onBuy () {
        // console.log("热卖购买",this.shopmeta.Id()); 
        // if(this.meta.sdata.leftNum<=0){ 
            // console.log("没了"); 
            // return 
        // } 
        // if(this.meta.CurrencyType()!=0){ 
            // let c =new Game.Content(this.meta.CurrencyType(),0,this.meta.Price()) 
            // if(Game.ContentCheck.CheckContent(c)){ 
                // let req = SR.SRShop.BuyByShop(this.shopmeta.Id(),this.shopmeta.Name()); 
                // req.SetCallBack((res)=>{ 
                    // console.log("热卖",res); 
                    // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res) 
                    // UIRoot.instance.openChildWindow("ShopBuySucessWindow",{"rewards":res.rewards}) 
                // }) 
                // req.Send(); 
            // } 
        // }else{ 
            // console.log("货币类型不对",this.meta.CurrencyType()); 
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
//         spinPrice:      cc.Label,
//         popularIcon:    cc.Node,
//         bestValueIcon:  cc.Node,
//         offNode:        cc.Node,
//         offText:        cc.Label,
//         oldText:        cc.Label,
//         leftText:       cc.Label,
//         contentM:       require("ContentModel"),
//         btn_buy:        cc.Node,
//         btn_over:       cc.Node,//缺货
//         leftNode:       cc.Node,//库存node
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
//     updatePanel(meta, index,shopmeta){
//         this.shopmeta = shopmeta;
//         this.meta = meta
//         let num = meta.Count()
//         let numAdd = Math.round(meta.Off() * 100)
//         let price = meta.PriceString()
// 
//         let contentParams = {}
//         contentParams.infoBtnParams={
//             canTouch:true,
//             showInfoBtn:true,
//             callback:()=>{
//                 console.log("点击了物品",meta.Content().Id());
//                 UIRoot.instance.openChildWindow("MergeTypeWindow", { mergeId: meta.Content().Id() })
//             }
//         }
//         this.contentM.show(meta.Content(),contentParams);
//         this.spinNum.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(num))
//         this.leftText.string = GameKit.i18n.t("ShopLeft")+this.meta.sdata.leftNum
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
//         // if (oldMeta != meta) {
//         //     this.oldText.node.active = true
//         //     let oldNum = oldMeta.Count()
//         //     this.oldText.string = String.format(GameKit.i18n.t("ShopSpinNum"), GameKit.StringUtil.formatNumber(oldNum))
//         // }
//         this.spinPrice.string = price
// 
//         this.spinNum.cacheMode = cc.Label.CacheMode.BITMAP
//         this.spinNumAdd.cacheMode = cc.Label.CacheMode.BITMAP
//         this.offText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.oldText.cacheMode = cc.Label.CacheMode.BITMAP
//         this.spinPrice.cacheMode = cc.Label.CacheMode.BITMAP
//         
//         this.btn_buy.active = true;
//         this.btn_over.active = false;
//         this.leftNode.active = true;
//         if(this.meta.sdata.leftNum<=0){
//             this.btn_buy.active = false;
//             this.leftNode.active = false;
//             this.btn_over.active = true;
//             return;
//         }
//     },
// 
//     onBuy(){
//         console.log("热卖购买",this.shopmeta.Id());
//         if(this.meta.sdata.leftNum<=0){
//             console.log("没了");
//             
//             return
//         }
//         if(this.meta.CurrencyType()!=0){
//             let c =new Game.Content(this.meta.CurrencyType(),0,this.meta.Price())
//             if(Game.ContentCheck.CheckContent(c)){
//                 let req = SR.SRShop.BuyByShop(this.shopmeta.Id(),this.shopmeta.Name());
//                 req.SetCallBack((res)=>{
//                     console.log("热卖",res);
//                     GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, res)
//                     UIRoot.instance.openChildWindow("ShopBuySucessWindow",{"rewards":res.rewards})
//                 })
//                 req.Send();
//             }
//         }else{
//             console.log("货币类型不对",this.meta.CurrencyType());
//             
//         }
//     }
// });
