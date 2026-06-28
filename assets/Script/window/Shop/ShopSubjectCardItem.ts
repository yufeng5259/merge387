import { _decorator, Component, Node, Sprite } from 'cc';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { ContentModel } from '../../game/items/ContentModel';
import { SpriteGray } from '../../GameKit/render/SpriteGray';
import { LabelGray } from '../../GameKit/render/LabelGray';
import { SpriteItem } from '../../GameKit/ui/SpriteItem';
const { ccclass, property } = _decorator;

@ccclass('ShopSubjectCardItem')
export class ShopSubjectCardItem extends Component {
    @property(Node)
    public buttonContainer = null;
    @property
    public svt = 'ScrollViewTool';
    @property(Node)
    public reward_item = null;
    @property(Node)
    public leftArrow = null;
    @property(Node)
    public rightArrow = null;
    @property(Sprite)
    public bg = null;

    start () {
    }

    updatePanel (meta: any) {
        // this.meta = meta 
        // this.leftTime = 0 
        // this.bg.spriteFrame=CommonAssets.instance.cardLimitSkinAssets.shopItemBg 
        // this.create_svt() 
    }

    create_svt () {
        // let para=this.meta.Param().pack 
        // let activeData=Game.SUserActivity.GetActivityData(this.meta.Id()) 
        // let id_list = [] 
        // para.forEach((element,id) => { 
            // id_list.push(id) 
        // }); 
        // this.svt.setItem(id_list, (index, id, node) => { 
            // node.y=0 
            // let timeLabel=GameKit.ControllerTable.GetComponent(node,'timeLabel',cc.Label) 
            // this.updateTime(timeLabel) 
            // let reward_layout=GameKit.ControllerTable.GetNode(node,'layout') 
            // let btn_buy=GameKit.ControllerTable.GetComponent(node,'buttonEnabled',cc.Button) 
            // let priceLabel=GameKit.ControllerTable.GetComponent(node,'price',cc.Label) 
            // let shopid=para[index].shopId 
            // priceLabel.string=Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopid).PriceString() 
            // if(activeData&&activeData.isBuy&&activeData.isBuy[shopid]==1){ 
                // btn_buy.interactable=false 
            // }else{ 
                // btn_buy.interactable=true 
            // } 
            // let currentGet = Game.Content.FromStrings(para[index].rewards) 
            // currentGet.forEach((reward,idx) => { 
                // let reward_node = cc.instantiate(this.reward_item) 
                // reward_node.parent = reward_layout 
                // reward_node.y=0 
                // reward_node.active = true 
                // reward_node.getComponent(ContentModel).show(reward) 
                // reward_node.name="item_"+"_"+idx 
                // if(reward.type==Game.Content.Types.Gift){ 
                    // reward_node.getChildByName("info").active=true 
                // }else if(reward.type== Game.Content.Types.CardChest){ 
                    // if(reward.cid==14||reward.cid==15){ 
                        // reward_node.getChildByName("info").active=true 
                    // }else{ 
                        // reward_node.getChildByName("info").active=false 
                    // } 
                // } 
                // else{ 
                    // reward_node.getChildByName("info").active=false 
                // } 
            // }); 
            // btn_buy.clickEvents[0].customEventData = `${index}` // 保存按钮对应的buy-item-index 
        // }) 
        // this.svt.node.on("onScrollEnded",(newIndex)=>{ 
            // this.setCheckIndex(newIndex) 
        // }) 
        // this.currentIndex=0 
        // this.leftArrow.active=false 
    }

    updateUI () {
        // for (const key in this.svt.items) { 
            // if (Object.hasOwnProperty.call(this.svt.items, key)) { 
                // const node = this.svt.items[key]; 
                // let timeLabel=GameKit.ControllerTable.GetComponent(node,'timeLabel',cc.Label) 
                // this.updateTime(timeLabel) 
            // } 
        // } 
    }

    updateTime (labelTimer: any) {
        // if (this.leftTime != null) { 
            // let currentTime = GameKit.TimeUtil.getCurrentTime() 
            // this.leftTime = this.meta.EndTime() - currentTime 
            // labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true) 
            // if (this.leftTime <= 0) { 
                // this.leftTime = null 
            // } 
        // } 
    }

    update () {
        // this.updateUI() 
    }

    onClickArrow (e: any, offset: any) {
        // let newIndex=this.currentIndex+parseInt(offset) 
        // if(newIndex==2){ 
            // this.rightArrow.active=false 
            // this.leftArrow.active=true 
        // }else if(newIndex==0){ 
            // this.leftArrow.active=false 
            // this.rightArrow.active=true 
        // }else{ 
            // this.leftArrow.active=true 
            // this.rightArrow.active=true 
        // } 
        // this.onCheckClick(null,newIndex) 
    }

    onCheckClick (e: any, newIndex: any) {
        // if(newIndex==2){ 
            // this.rightArrow.active=false 
            // this.leftArrow.active=true 
        // }else if(newIndex==0){ 
            // this.leftArrow.active=false 
            // this.rightArrow.active=true 
        // }else{ 
            // this.leftArrow.active=true 
            // this.rightArrow.active=true 
        // } 
        // let toggleItems=this.buttonContainer.children; 
        // for (let index = 0; index < toggleItems.length; index++) { 
            // const toggle = toggleItems[index]; 
            // if(index==newIndex){ 
                // if(toggle.getChildByName('checkmark').active==false){ 
                    // toggle.getChildByName('checkmark').active=true 
                    // this.svt.ScrollToIndexByTime(index,0.5) 
                    // this.currentIndex=index 
                // } 
            // }else{ 
                // toggle.getChildByName('checkmark').active=false 
            // } 
        // } 
    }

    setCheckIndex (newIndex: any) {
        // this.currentIndex=newIndex 
        // if(newIndex==2){ 
            // this.rightArrow.active=false 
            // this.leftArrow.active=true 
        // }else if(newIndex==0){ 
            // this.leftArrow.active=false 
            // this.rightArrow.active=true 
        // }else{ 
            // this.leftArrow.active=true 
            // this.rightArrow.active=true 
        // } 
        // let toggleItems=this.buttonContainer.children; 
        // for (let index = 0; index < toggleItems.length; index++) { 
            // const toggle = toggleItems[index]; 
            // if(index==newIndex){ 
                // toggle.getChildByName('checkmark').active=true 
            // }else{ 
                // toggle.getChildByName('checkmark').active=false 
            // } 
        // } 
    }

    onInfo (e: any, index: any) {
        // let meta=Game.ActivityManager.GetMeta(this.meta.Id()) 
        // UIRoot.instance.openChildWindow(meta.Panel(),{meta:meta,showCallback: (wnd) => { 
        // }}) 
    }

    onBuy (e: any, index: any) {
        // let node = this.svt.items[index] 
        // let btn_buy=GameKit.ControllerTable.GetComponent(node,'buttonEnabled',cc.Button) 
        // let priceLabel=GameKit.ControllerTable.GetComponent(node,'price',cc.Label) 
        // btn_buy.interactable=false 
        // let para=this.meta.Param().pack 
        // let shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, para[index].shopId) 
        // let oldAp = Game.SUser.Ap() 
        // let oldCoin = Game.SUser.Coin() 
        // let apCount=0 
        // let coinCount=0 
        // let currentGet = Game.Content.FromStrings(para[index].rewards) 
        // currentGet.forEach((reward,idx) => { 
            // if(reward.Type() == Game.Content.Types.Ap){ 
                // apCount+=reward.Count() 
            // } else if (reward.Type() == Game.Content.Types.Coin) { 
                // coinCount+=reward.Count() 
            // } 
        // }) 
        // AppKit.PaymentWrap.Pay(shopmeta.Name(), function(ok) { 
            // if (ok) { 
                // UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"pack", showCallback: (wnd) => {wnd.addOnCloseFunc(() => { 
                    // SpriteGray.SetGray(btn_buy,true) 
                    // LabelGray.SetGray(priceLabel,true) 
                    // UIRoot.instance.closeChildWindow("ShopWindow") 
                    // if(apCount>0){ 
                        // if (GamePlay.instance&&GamePlay.instance.slotNode) { 
                            // GamePlay.instance.slotNode.showStoreAddSpinAnim(apCount) 
                            // oldAp += apCount 
                            // if (GamePlay.instance) GamePlay.instance.slotNode.userinfo.stopApAt(oldAp) 
                        // } 
                    // } 
                    // if(coinCount>0){ 
                        // if (GameMainWindow.instance) { 
                            // GameMainWindow.instance.playAddCoinAnim() 
                            // GameMainWindow.instance.scheduleOnce(() => { 
                                // GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin + coinCount, 0.8) 
                            // }, 1) 
                        // } 
                    // } 
                // })}}) 
                // GameKit.SoundManager.playSound("item_purchased") 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"subject", name: shopmeta.Name(), phase: 1}) 
            // } else { 
                // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"subject", name: shopmeta.Name(), phase: -1}) 
            // } 
        // }.bind(this)) 
        // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"subject", name: shopmeta.Name(), phase: 0}) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// const ScrollViewTool = require("ScrollViewTool")
// const ContentModel = require("ContentModel")
// let SpriteGray = require('SpriteGray')
// let LabelGray = require('LabelGray')
// let SpriteItem=require('SpriteItem')
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         buttonContainer:cc.Node,
//         svt :ScrollViewTool,
//         reward_item:cc.Node,
//         leftArrow:cc.Node,
//         rightArrow:cc.Node,
//         bg:cc.Sprite,
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
//     updatePanel(meta){
//         this.meta = meta
//         this.leftTime = 0
//         
//         this.bg.spriteFrame=CommonAssets.instance.cardLimitSkinAssets.shopItemBg
// 
//         this.create_svt()
//     },
//     create_svt() {
//         let para=this.meta.Param().pack
//         // console.log(para,this.meta);
//         let activeData=Game.SUserActivity.GetActivityData(this.meta.Id())
//         // console.log(activeData);
//         let id_list = []
//         para.forEach((element,id) => {
//             id_list.push(id)
//         });
//         this.svt.setItem(id_list, (index, id, node) => {
//             node.y=0
//             // let alable=GameKit.ControllerTable.GetComponent(node,'availableLabel',cc.Label)
//             // alable.string='available '+(index+1)+'/'+id_list.length
// 
//             let timeLabel=GameKit.ControllerTable.GetComponent(node,'timeLabel',cc.Label)
//             this.updateTime(timeLabel)
// 
//             let reward_layout=GameKit.ControllerTable.GetNode(node,'layout')
//             let btn_buy=GameKit.ControllerTable.GetComponent(node,'buttonEnabled',cc.Button)
//             let priceLabel=GameKit.ControllerTable.GetComponent(node,'price',cc.Label)
//             let shopid=para[index].shopId
//             priceLabel.string=Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopid).PriceString()
//             if(activeData&&activeData.isBuy&&activeData.isBuy[shopid]==1){
//                 btn_buy.interactable=false
//             }else{
//                 btn_buy.interactable=true
//             }
// 
//             let currentGet = Game.Content.FromStrings(para[index].rewards)
//             currentGet.forEach((reward,idx) => {
//                 let reward_node = cc.instantiate(this.reward_item)
//                 reward_node.parent = reward_layout
//                 reward_node.y=0
//                 reward_node.active = true
//                 reward_node.getComponent(ContentModel).show(reward)
//                 
//                 reward_node.name="item_"+"_"+idx
//                 if(reward.type==Game.Content.Types.Gift){
//                     reward_node.getChildByName("info").active=true
//                 }else if(reward.type== Game.Content.Types.CardChest){
//                     if(reward.cid==14||reward.cid==15){
//                         reward_node.getChildByName("info").active=true
//                     }else{
//                         reward_node.getChildByName("info").active=false
//                     }
//                 }
//                 else{
//                     reward_node.getChildByName("info").active=false
//                 }
//             });
//             btn_buy.clickEvents[0].customEventData = `${index}` // 保存按钮对应的buy-item-index
//         })
// 
// 
//         this.svt.node.on("onScrollEnded",(newIndex)=>{
//             this.setCheckIndex(newIndex)
//         })
// 
//         this.currentIndex=0
//         this.leftArrow.active=false
//     },
//     updateUI(){
//         for (const key in this.svt.items) {
//             if (Object.hasOwnProperty.call(this.svt.items, key)) {
//                 const node = this.svt.items[key];
//                 let timeLabel=GameKit.ControllerTable.GetComponent(node,'timeLabel',cc.Label)
//                 this.updateTime(timeLabel)
//             }
//         }
//         
//     },
//     updateTime(labelTimer){
//         if (this.leftTime != null) {
// 
//             let currentTime = GameKit.TimeUtil.getCurrentTime()
// 
//             this.leftTime = this.meta.EndTime() - currentTime
// 
//             labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true)
// 
//             if (this.leftTime <= 0) {
//                 this.leftTime = null
//             }
//         }
//     },
//     update(){
//         this.updateUI()
//     },
//     onClickArrow(e,offset){
//         let newIndex=this.currentIndex+parseInt(offset)
//         if(newIndex==2){
//             this.rightArrow.active=false
//             this.leftArrow.active=true
//         }else if(newIndex==0){
//             this.leftArrow.active=false
//             this.rightArrow.active=true
//         }else{
//             this.leftArrow.active=true
//             this.rightArrow.active=true
//         }
//         this.onCheckClick(null,newIndex)
//     },
//     onCheckClick(e,newIndex){
//         // console.log(newIndex);
// 
//         if(newIndex==2){
//             this.rightArrow.active=false
//             this.leftArrow.active=true
//         }else if(newIndex==0){
//             this.leftArrow.active=false
//             this.rightArrow.active=true
//         }else{
//             this.leftArrow.active=true
//             this.rightArrow.active=true
//         }
//         let toggleItems=this.buttonContainer.children;
//         for (let index = 0; index < toggleItems.length; index++) {
//             const toggle = toggleItems[index];
//             if(index==newIndex){
//                 if(toggle.getChildByName('checkmark').active==false){
//                     toggle.getChildByName('checkmark').active=true
//                     this.svt.ScrollToIndexByTime(index,0.5)
//                     this.currentIndex=index
//                 }
//             }else{
//                 toggle.getChildByName('checkmark').active=false
//             }
//             
//         }
//     },
//     setCheckIndex(newIndex){
//         this.currentIndex=newIndex
//         if(newIndex==2){
//             this.rightArrow.active=false
//             this.leftArrow.active=true
//         }else if(newIndex==0){
//             this.leftArrow.active=false
//             this.rightArrow.active=true
//         }else{
//             this.leftArrow.active=true
//             this.rightArrow.active=true
//         }
//         let toggleItems=this.buttonContainer.children;
//         for (let index = 0; index < toggleItems.length; index++) {
//             const toggle = toggleItems[index];
//             if(index==newIndex){
//                 toggle.getChildByName('checkmark').active=true
//             }else{
//                 toggle.getChildByName('checkmark').active=false
//             }
//             
//         }
//     },
//     onInfo(e,index){
//         let meta=Game.ActivityManager.GetMeta(this.meta.Id())
//         UIRoot.instance.openChildWindow(meta.Panel(),{meta:meta,showCallback: (wnd) => {
//             // wnd.addOnCloseFunc(() => {
//             //     UIRoot.instance.closeChildWindow("ShopWindow")
//             // })
//         }})
//         // console.log(index);
//         // UIRoot.instance.openChildWindow("CardChestInfoWindow", { meta: this.meta, card_chest_meta_id: this.meta.Type() == Meta.ShopMeta.Types.Chest?this.meta.DefaultPrice():this.meta.RawCount(), shopMeta: this.meta })
//     },
// 
//     onBuy(e,index){
//         
//         // console.log(index);
//         let node = this.svt.items[index]
//         let btn_buy=GameKit.ControllerTable.GetComponent(node,'buttonEnabled',cc.Button)
//         let priceLabel=GameKit.ControllerTable.GetComponent(node,'price',cc.Label)
//         btn_buy.interactable=false
// 
//         let para=this.meta.Param().pack
//         let shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, para[index].shopId)
// 
//         let oldAp = Game.SUser.Ap()
//         let oldCoin = Game.SUser.Coin()
// 
//         let apCount=0
//         let coinCount=0
//         let currentGet = Game.Content.FromStrings(para[index].rewards)
//         currentGet.forEach((reward,idx) => {
//             if(reward.Type() == Game.Content.Types.Ap){
//                 apCount+=reward.Count()
//             } else if (reward.Type() == Game.Content.Types.Coin) {
//                 coinCount+=reward.Count()
//             }
//         })
//         
//         AppKit.PaymentWrap.Pay(shopmeta.Name(), function(ok) {
//             if (ok) {
//                 UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"pack", showCallback: (wnd) => {wnd.addOnCloseFunc(() => {
//                    
//                     SpriteGray.SetGray(btn_buy,true)
//                     LabelGray.SetGray(priceLabel,true)
// 
//                     UIRoot.instance.closeChildWindow("ShopWindow")
// 
//                     // //礼包含有金币或体力则播放动画
//                     if(apCount>0){
//                         if (GamePlay.instance&&GamePlay.instance.slotNode) {
//                             GamePlay.instance.slotNode.showStoreAddSpinAnim(apCount)
//                             oldAp += apCount
//                             if (GamePlay.instance) GamePlay.instance.slotNode.userinfo.stopApAt(oldAp)
//                         }
//                     }
// 
//                     if(coinCount>0){
//                         if (GameMainWindow.instance) {
//                             GameMainWindow.instance.playAddCoinAnim()
//                             GameMainWindow.instance.scheduleOnce(() => {
//                                 GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin + coinCount, 0.8)
//                             }, 1)
//                         }
//                     }
//                     // if (require("MultiplePurchaseWindow").OpenMulti()) UIRoot.instance.openChildWindow("MultiplePurchaseWindow", {meta:this.meta})
//                 })}})
//                 GameKit.SoundManager.playSound("item_purchased")
// 
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"subject", name: shopmeta.Name(), phase: 1})
//             } else {
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"subject", name: shopmeta.Name(), phase: -1})
//             }
//         }.bind(this))
// 
//         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"subject", name: shopmeta.Name(), phase: 0})
//     }
// });
