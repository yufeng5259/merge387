import { _decorator, Component, Node, SpriteFrame, Sprite, Label, instantiate } from 'cc';
import { ContentModel } from '../../game/items/ContentModel';
const { ccclass, property } = _decorator;

let width3 = 450
let width4 = 586
let heightHave = 330
let heightNo = 224
let bgY = 19
@ccclass('GiftContentDesWindow')
export class GiftContentDesWindow extends Component {
    @property(Node)
    public bg = null;
    @property(Node)
    public arrow = null;
    @property([SpriteFrame])
    public bgsSpriteFrames = [];
    @property(Node)
    public reward_layout = null;
    @property(Node)
    public item = null;
    @property(Sprite)
    public bg1 = null;
    @property(Node)
    public boomCards = null;
    @property(Label)
    public boomCardsLabel = null;

    show (reward: any) {
        // let contents=[] 
        // this.reward_layout.destroyAllChildren() 
        // this.bg1.node.active=true 
        // if(reward.ContentId()==Game.UserItems.ToolType.ShiChui){ 
            // contents=Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward) 
        // }else if(reward.ContentId()==Game.UserItems.ToolType.CardsBoom){ 
            // this.bg1.node.active=false 
            // if(this.boomCards){ 
                // this.boomCards.active=true 
            // } 
            // let str=this.boomCardsLabel.string 
            // this.boomCardsLabel.string = str.format(reward.Count()*5+"min") 
        // } 
        // if(this.bg1.node.active){ 
            // this.bg1.spriteFrame=this.bgsSpriteFrames[reward.ContentId()-1] 
        // } 
        // let height=this.bg1.node.height 
        // require("fixedSizeRatio").fitByHeight(this.bg1, height) 
        // for (let i = 0; i < contents.length; i++) { 
            // let content = Game.Content.FromContent(contents[i]) 
            // let newItem = cc.instantiate(this.item) 
            // newItem.parent = this.reward_layout 
            // newItem.y=0 
            // newItem.active = true 
            // newItem.getComponent(ContentModel).show(content) 
        // } 
        // let itemsCount=contents.length; 
        // let maxW = 180 
        // if (itemsCount >= 4) { 
            // this.bg.width = width4 
            // maxW = 250 
        // } 
        // let px = 0 
        // let nx = this.node.getWorldPosition().x 
        // if (nx > maxW) px = nx - maxW 
        // else if (nx < -maxW) px = nx + maxW 
        // this.bg.node.setWorldPosition(cc.v2(px, 0)) 
        // this.bg.node.y = bgY 
        // if (this.node.getWorldPosition().y + bgY + this.bg.height - 20 > UIRoot.instance.winSize.height / 2) { 
            // this.arrow.scaleY = -1 
            // this.arrow.y = -this.arrow.y 
            // this.bg.node.y = -this.bg.node.y - this.bg.node.height 
            // this.node.y -= this.pheight + this.pheight / 5 
        // } 
        // this.scheduleOnce(() => { 
            // this.callClose(); 
        // }, 5) 
    }

    callClose () {
        // if (this.closing) return 
        // this.closing = true 
        // require("EnterCloseAnim").playClose(this.node) 
        // this.scheduleOnce(() => { 
            // this.node.destroy() 
        // }, 0.5) 
    }

}


GiftContentDesWindow.Show = function(content, params, x, y) {
    UIRoot.instance.ShowCantClick()
    let resName = "window/Item/GiftContentDesWindow"
    cce.loadRes(resName, cc.Prefab, function (err, winPre) {
        if (err) {
            Logs.Error("openModelWindow windowPath:" + resName + (err.message || err));
            DialogWindow.Show(GameKit.i18n.t("loadResError"), function() {
                GiftContentDesWindow.Show(content, parent, x, y)
            }.bind(this), nullFunction)
            UIRoot.instance.CloseCantClick()
            return;
        }
        if (winPre == null) {
            UIRoot.instance.CloseCantClick()
            return
        }
        let wnd = cc.instantiate(winPre)
        wnd.parent = params.parent
        wnd.x = params.pos.x
        wnd.y = params.pos.y + params.height / 2 + params.height / 10
        let panel = wnd.getComponent(GiftContentDesWindow)
        panel.pheight = params.height
        panel.show(content)
        UIRoot.instance.CloseCantClick()
    }.bind(this))
}
/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// var width3 = 450
// var width4 = 586
// var heightHave = 330
// var heightNo = 224
// var bgY = 19
// const ContentModel = require("ContentModel")
// var GiftContentDesWindow = cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         bg:cc.Node,
//         arrow: cc.Node,
//         bgsSpriteFrames:[cc.SpriteFrame],
//         reward_layout:cc.Node,
//         item:cc.Node,
//         bg1:cc.Sprite,
//         boomCards:cc.Node,
//         boomCardsLabel:cc.Label,
//     },
// 
//     show (reward) {
//         let contents=[]
//         this.reward_layout.destroyAllChildren()
//         this.bg1.node.active=true
//         if(reward.ContentId()==Game.UserItems.ToolType.ShiChui){
//             contents=Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward)
//         }else if(reward.ContentId()==Game.UserItems.ToolType.CardsBoom){
//             this.bg1.node.active=false
//             if(this.boomCards){
//                 this.boomCards.active=true
//             }
//             let str=this.boomCardsLabel.string
//             this.boomCardsLabel.string = str.format(reward.Count()*5+"min")
//         }
// 
// 
//         
//         if(this.bg1.node.active){
//             this.bg1.spriteFrame=this.bgsSpriteFrames[reward.ContentId()-1]
//         }
// 
//         let height=this.bg1.node.height
//         require("fixedSizeRatio").fitByHeight(this.bg1, height)
// 
//         for (let i = 0; i < contents.length; i++) {
//             let content = Game.Content.FromContent(contents[i])
//             let newItem = cc.instantiate(this.item)
//             newItem.parent = this.reward_layout
//             newItem.y=0
//             // newItem.x = poses[count][i]
//             newItem.active = true
//             newItem.getComponent(ContentModel).show(content)
//         }
//         let itemsCount=contents.length;
// 
//         let maxW = 180
//         if (itemsCount >= 4) {
//             this.bg.width = width4
//             maxW = 250
//         }
// 
//         let px = 0
//         let nx = this.node.getWorldPosition().x
//         if (nx > maxW) px = nx - maxW
//         else if (nx < -maxW) px = nx + maxW
//         this.bg.node.setWorldPosition(cc.v2(px, 0))
//         this.bg.node.y = bgY
// 
//         if (this.node.getWorldPosition().y + bgY + this.bg.height - 20 > UIRoot.instance.winSize.height / 2) {
//             this.arrow.scaleY = -1
//             this.arrow.y = -this.arrow.y
//             this.bg.node.y = -this.bg.node.y - this.bg.node.height
//             this.node.y -= this.pheight + this.pheight / 5
//         }
// 
//         this.scheduleOnce(() => {
//             this.callClose();
//         }, 5)
//     },
// 
//     callClose() {
//         if (this.closing) return
//         this.closing = true
//         require("EnterCloseAnim").playClose(this.node)
//         this.scheduleOnce(() => {
//             this.node.destroy()
//         }, 0.5)
//     }
// 
// });
// 
// GiftContentDesWindow.Show = function(content, params, x, y) {
//     UIRoot.instance.ShowCantClick()
//     let resName = "window/Item/GiftContentDesWindow"
//     cce.loadRes(resName, cc.Prefab, function (err, winPre) {
//                 
//         if (err) {
//             Logs.Error("openModelWindow windowPath:" + resName + (err.message || err));
//             DialogWindow.Show(GameKit.i18n.t("loadResError"), function() {
//                 GiftContentDesWindow.Show(content, parent, x, y)
//             }.bind(this), nullFunction)
//             UIRoot.instance.CloseCantClick()
//             return;
//         }
//         if (winPre == null) {
//             UIRoot.instance.CloseCantClick()
//             return
//         }
// 
//         let wnd = cc.instantiate(winPre)
//         wnd.parent = params.parent
//         wnd.x = params.pos.x
//         wnd.y = params.pos.y + params.height / 2 + params.height / 10
//         let panel = wnd.getComponent(GiftContentDesWindow)
//         panel.pheight = params.height
//         panel.show(content)
//         UIRoot.instance.CloseCantClick()
//     }.bind(this))
// }
