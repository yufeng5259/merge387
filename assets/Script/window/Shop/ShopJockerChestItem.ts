import { _decorator, Component, Sprite, Label, Node } from 'cc';
import { SpriteGray } from '../../GameKit/render/SpriteGray';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';
const { ccclass, property } = _decorator;

@ccclass('ShopJockerChestItem')
export class ShopJockerChestItem extends Component {
    @property(Sprite)
    public icon = null;
    @property(Label)
    public itemName = null;
    @property(Label)
    public itemNameGray = null;
    @property(Label)
    public price = null;
    @property(Node)
    public soldOutNode = null;
    @property(Label)
    public gailv = null;
    @property(Node)
    public gailvNode = null;
    @property(Node)
    public hot = null;

    start () {
    }

    updatePanel (meta: any, index: any, icon: any, isHot: any) {
        // this.meta = meta 
        // this.icon.node.height *= 1 - 0.05 * (3-index) 
        // this.icon.spriteFrame = icon 
        // let maxScale=0.7 
        // this.icon.node.scale=(index)/5*0.1+0.6 
        // require("fixedSizeRatio").fitByHeight(this.icon) 
        // let chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, this.meta.RawCount()); 
        // this.itemName.string = chest_meta.Name() 
        // this.itemNameGray.string=chest_meta.Name() 
        // this.itemNameGray.node.active=false 
        // this.soldOutNode.active=false; 
        // SpriteGray.SetGray(this.icon,false) 
        // this.node.getChildByName("bg").getChildByName("buttonEnabled").getComponent(cc.Button).interactable=true 
        // this.node.getChildByName("bg").getChildByName("Button - Info").getComponent(cc.Button).interactable=true 
        // this.hot.active=isHot 
        // if(chest_meta.JokerChestGuar()==1){ 
            // this.gailvNode.active=true 
        // }else{ 
            // this.gailvNode.active=false 
        // } 
        // let arr=this.node.getComponentsInChildren("SpriteGray") 
        // arr.forEach(cp => { 
            // cp.gray=false 
        // }); 
        // let arr1=this.node.getComponentsInChildren("LabelGray") 
        // arr1.forEach(cp => { 
            // cp.gray=false 
        // }); 
        // this.price.string = this.meta.PriceString() 
        // this.node.setSiblingIndex(index+1) 
        // this.checkSoldOut() 
    }

    checkSoldOut () {
        // let chestId=this.meta.RawCount() 
        // let chestMeta=Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId) 
        // if(Game.SUserCard.jokerCountData(chestId)>=chestMeta.JokerChestCount()){ 
            // this.soldOut() 
        // } 
    }

    soldOut () {
        // this.itemName.node.active=true 
        // this.itemNameGray.node.active=true 
        // this.soldOutNode.active=true; 
        // EnterCloseAnim.playEnter(this.soldOutNode) 
        // SpriteGray.SetGray(this.icon,true) 
        // this.node.getChildByName("bg").getChildByName("buttonEnabled").getComponent(cc.Button).interactable=false 
        // this.node.getChildByName("bg").getChildByName("Button - Info").getComponent(cc.Button).interactable=false 
        // let arr=this.node.getComponentsInChildren("SpriteGray") 
        // arr.forEach(cp => { 
            // cp.gray=true 
        // }); 
        // let arr1=this.node.getComponentsInChildren("LabelGray") 
        // arr1.forEach(cp => { 
            // cp.gray=true 
        // }); 
    }

    onInfo (e: any) {
        // let idStr=this.meta.Id().toString(); 
        // let packId=parseInt(idStr.charAt(idStr.length-1)); 
        // let parent=this.node.parent.parent.parent.parent.parent.parent; 
        // let dpos = parent.convertToNodeSpaceAR(e.target.convertToWorldSpaceAR(cc.Vec2.ZERO)) 
        // require("RandomChestPanel").Show(packId, {parent:parent, pos:dpos, height:70}) 
    }

    onBuyJocker () {
        // if (GamePlay.instance.isBusy()) return 
        // AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) { 
            // if (ok) { 
                // let sr =SR.SRCard.recordJokerCountData(this.meta.RawCount(),(res)=>{ 
                    // UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"card"}) 
                    // GameKit.SoundManager.playSound("item_purchased") 
                    // this.checkSoldOut() 
                    // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 1})    
                // }); 
                // sr.Send(); 
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
// let SpriteGray = require('SpriteGray')
// let EnterCloseAnim = require('EnterCloseAnim')
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         icon: cc.Sprite,
//         itemName: cc.Label,
//         itemNameGray:cc.Label,
//         price: cc.Label,
//         soldOutNode:cc.Node,
//         gailv:cc.Label,
//         gailvNode:cc.Node,
//         hot:cc.Node,
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
//     updatePanel(meta, index, icon,isHot) {
//         this.meta = meta
// 
//         this.icon.node.height *= 1 - 0.05 * (3-index)
//         this.icon.spriteFrame = icon
//         let maxScale=0.7
//         // let minScale
//         this.icon.node.scale=(index)/5*0.1+0.6
//         require("fixedSizeRatio").fitByHeight(this.icon)
// 
//         let chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, this.meta.RawCount());
//         // console.log(chest_meta.Name())
//         
//         this.itemName.string = chest_meta.Name()
//         this.itemNameGray.string=chest_meta.Name()
// 
//         this.itemNameGray.node.active=false
//         this.soldOutNode.active=false;
//         SpriteGray.SetGray(this.icon,false)
//         // this.icon.node.getComponent("SpriteGray").enabled=false;
//         // console.log(this.node.getChildByName("bg").getChildByName("buttonEnabled"))
//         this.node.getChildByName("bg").getChildByName("buttonEnabled").getComponent(cc.Button).interactable=true
//         this.node.getChildByName("bg").getChildByName("Button - Info").getComponent(cc.Button).interactable=true
// 
//         this.hot.active=isHot
//         if(chest_meta.JokerChestGuar()==1){
//             this.gailvNode.active=true
//         }else{
//             this.gailvNode.active=false
//         }
//         // this.gailvNode.getChildByName("name").getComponent(cc.Label).string=Math.floor(chest_meta.JokerChestGuar()/100)
// 
//         let arr=this.node.getComponentsInChildren("SpriteGray")
//         arr.forEach(cp => {
//             cp.gray=false
//         });
// 
//         let arr1=this.node.getComponentsInChildren("LabelGray")
//         arr1.forEach(cp => {
//             cp.gray=false
//         });
// 
// 
// 
//         this.price.string = this.meta.PriceString()
//         this.node.setSiblingIndex(index+1)
// 
// 
//         this.checkSoldOut()
//     },
//     checkSoldOut(){
//         let chestId=this.meta.RawCount()
//         // console.log(chestId)
//         let chestMeta=Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId)
//         if(Game.SUserCard.jokerCountData(chestId)>=chestMeta.JokerChestCount()){
//             this.soldOut()
//         }
//     },
//     soldOut(){
//         //置灰
//         // #2E561A
//         this.itemName.node.active=true
//         this.itemNameGray.node.active=true
//         this.soldOutNode.active=true;
//         // this.soldOutNode.getComponent("EnterCloseAnim").
//         EnterCloseAnim.playEnter(this.soldOutNode)
//         // this.icon.node.getComponent("SpriteGray").enabled=true;
//         SpriteGray.SetGray(this.icon,true)
//         this.node.getChildByName("bg").getChildByName("buttonEnabled").getComponent(cc.Button).interactable=false
//         this.node.getChildByName("bg").getChildByName("Button - Info").getComponent(cc.Button).interactable=false
// 
//         let arr=this.node.getComponentsInChildren("SpriteGray")
//         arr.forEach(cp => {
//             cp.gray=true
//         });
// 
//         let arr1=this.node.getComponentsInChildren("LabelGray")
//         arr1.forEach(cp => {
//             cp.gray=true
//         });
// 
//     },
//     //金币宝箱
//     // onBuy() {
//     //     //判断金币是否足够购买
//     //     let price = this.meta.Price()
//     //     if (Game.SUser.Coin() < price) {
//     //         //UIRoot.instance.GetWindow("ShopWindow").tab_node_array.changeIndex(1)
//     //         return
//     //     }
// 
//     //     let req = SR.SRShop.payFor(this.meta.Id())
//     //     req.SetCallBack(function() {
//     //         if (UIRoot.instance.GetWindow("CardAllSetWindow")) {
//     //             UIRoot.instance.GetWindow("CardAllSetWindow").svt.flushData()
//     //         }
//     //         require("CardChestOpenWindow").tryShow()
//     //     }.bind(this))
//     //     req.Send()
//     // },
// 
//     onInfo(e) {
//         let idStr=this.meta.Id().toString();
//         let packId=parseInt(idStr.charAt(idStr.length-1));
//         let parent=this.node.parent.parent.parent.parent.parent.parent;
//         
//         let dpos = parent.convertToNodeSpaceAR(e.target.convertToWorldSpaceAR(cc.Vec2.ZERO))
//         // console.log(parent,dpos,e.target.convertToWorldSpaceAR(cc.Vec2.ZERO));
//         require("RandomChestPanel").Show(packId, {parent:parent, pos:dpos, height:70})
//     },
//     //魔法宝箱
//     onBuyJocker(){
//         if (GamePlay.instance.isBusy()) return
//         AppKit.PaymentWrap.Pay(this.meta.Name(), function(ok) {
//             if (ok) {
//                 let sr =SR.SRCard.recordJokerCountData(this.meta.RawCount(),(res)=>{
//             
//                     UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"card"})
//                     GameKit.SoundManager.playSound("item_purchased")
// 
//                     this.checkSoldOut()
// 
//                     AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 1})   
//                 });
//                 sr.Send();
//                 
//             } else {
//                 AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: -1})
//             }
//         }.bind(this))
// 
//         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"chest", name: this.meta.Name(), phase: 0})
// 
//     },
// });
