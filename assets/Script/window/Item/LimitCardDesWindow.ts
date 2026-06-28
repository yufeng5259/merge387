import { _decorator, Component, Node, Sprite, Label, instantiate } from 'cc';
import { ContentModel } from '../../game/items/ContentModel';
import { SpriteItem } from '../../GameKit/ui/SpriteItem';
const { ccclass, property } = _decorator;

let width3 = 450
let width4 = 586
let heightHave = 330
let heightNo = 224
let bgY = 19
@ccclass('LimitCardDesWindow')
export class LimitCardDesWindow extends Component {
    @property(Node)
    public bg = null;
    @property(Node)
    public arrow = null;
    @property(Sprite)
    public bg1 = null;
    @property(Label)
    public limitLabel = null;
    @property(Label)
    public countLabel = null;

    onLoad () {
        // if (this.bg) this._bgInitPos = { x: this.bg.x, y: this.bg.y } 
        // if (this.arrow) this._arrowInitPos = { x: this.arrow.x, y: this.arrow.y } 
    }

    show (reward: any) {
        // let subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard) 
        // let contents=[] 
        // let chestId = reward && typeof reward.ContentId === "function" ? reward.ContentId() : (reward ? reward.cid : 0) 
        // this.chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId) 
        // let str=this.countLabel.string 
        // if (this.chest_meta) { 
            // this.countLabel.string = str.format(this.chest_meta.CardNum()) 
        // } 
        // if (CommonAssets.instance.cardLimitSkinAssets && CommonAssets.instance.cardLimitSkinAssets.desItemBg) { 
            // this.bg1.spriteFrame = CommonAssets.instance.cardLimitSkinAssets.desItemBg 
        // } 
        // let height=this.bg1.node.height 
        // require("fixedSizeRatio").fitByHeight(this.bg1, height) 
        // let itemsCount=contents.length; 
        // if (this.bg && this._bgInitPos) { 
            // this.bg.setPosition(this._bgInitPos.x, this._bgInitPos.y) 
            // this.bg.width = width3 
        // } 
        // if (this.arrow && this._arrowInitPos) { 
            // this.arrow.setPosition(this._arrowInitPos.x, this._arrowInitPos.y) 
            // this.arrow.scaleY = 1 
        // } 
        // if (itemsCount >= 4) { 
            // this.bg.width = width4 
        // } 
        // this.bg.node.y = bgY 
        // if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.winSize) { 
            // let margin = 20 
            // let halfW = UIRoot.instance.winSize.width / 2 
            // let panelHalfW = this.bg ? this.bg.width / 2 : 0 
            // let minX = -halfW + margin + panelHalfW 
            // let maxX = halfW - margin - panelHalfW 
            // let oldX = this.node.x 
            // let x = oldX 
            // if (x < minX) x = minX 
            // else if (x > maxX) x = maxX 
            // this.node.x = x 
            // let deltaX = x - oldX 
            // if (this.arrow && deltaX !== 0) { 
                // this.arrow.x -= deltaX 
            // } 
        // } 
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


LimitCardDesWindow.Show = function(content, params, x, y) {
    UIRoot.instance.ShowCantClick()
    let resName = "window/Item/LimitCardDesWindow"
    cce.loadRes(resName, cc.Prefab, function (err, winPre) {
        if (err) {
            Logs.Error("openModelWindow windowPath:" + resName + (err.message || err));
            DialogWindow.Show(GameKit.i18n.t("loadResError"), function() {
                LimitCardDesWindow.Show(content, parent, x, y)
            }.bind(this), nullFunction)
            UIRoot.instance.CloseCantClick()
            return;
        }
        if (winPre == null) {
            UIRoot.instance.CloseCantClick()
            return
        }
        let wnd = cc.instantiate(winPre)
        wnd.parent = params.parent || UIRoot.instance.node
        wnd.x = params.pos.x
        wnd.y = params.pos.y + params.height / 2 + params.height / 10
        let panel = wnd.getComponent(LimitCardDesWindow)
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
// let SpriteItem=require('SpriteItem')
// 
// var LimitCardDesWindow = cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         bg:cc.Node,
//         arrow: cc.Node,
//         bg1:cc.Sprite,
//         limitLabel:cc.Label,
//         countLabel:cc.Label,
//     },
//     onLoad () {
//         if (this.bg) this._bgInitPos = { x: this.bg.x, y: this.bg.y }
//         if (this.arrow) this._arrowInitPos = { x: this.arrow.x, y: this.arrow.y }
//     },
// 
//     show (reward) {
//         let subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)
//         // let para=subjectMeta.Param().ui
// 
//         let contents=[]
//         let chestId = reward && typeof reward.ContentId === "function" ? reward.ContentId() : (reward ? reward.cid : 0)
//         this.chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId)
//         // console.log(this.chest_meta);
//         let str=this.countLabel.string
//         if (this.chest_meta) {
//             this.countLabel.string = str.format(this.chest_meta.CardNum())
//         }
// 
//         
//         if (CommonAssets.instance.cardLimitSkinAssets && CommonAssets.instance.cardLimitSkinAssets.desItemBg) {
//             this.bg1.spriteFrame = CommonAssets.instance.cardLimitSkinAssets.desItemBg
//         }
// 
//         let height=this.bg1.node.height
//         require("fixedSizeRatio").fitByHeight(this.bg1, height)
//         let itemsCount=contents.length;
// 
//         if (this.bg && this._bgInitPos) {
//             this.bg.setPosition(this._bgInitPos.x, this._bgInitPos.y)
//             this.bg.width = width3
//         }
//         if (this.arrow && this._arrowInitPos) {
//             this.arrow.setPosition(this._arrowInitPos.x, this._arrowInitPos.y)
//             this.arrow.scaleY = 1
//         }
// 
//         if (itemsCount >= 4) {
//             this.bg.width = width4
//         }
// 
//         this.bg.node.y = bgY
// 
//         // 参�?RandomChestPanel：水�?clamp 整个面板，避免直�?setWorldPosition 导致内容偏移异常
//         if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.winSize) {
//             let margin = 20
//             let halfW = UIRoot.instance.winSize.width / 2
//             let panelHalfW = this.bg ? this.bg.width / 2 : 0
//             let minX = -halfW + margin + panelHalfW
//             let maxX = halfW - margin - panelHalfW
//             let oldX = this.node.x
//             let x = oldX
//             if (x < minX) x = minX
//             else if (x > maxX) x = maxX
//             this.node.x = x
//             let deltaX = x - oldX
//             if (this.arrow && deltaX !== 0) {
//                 this.arrow.x -= deltaX
//             }
//         }
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
// LimitCardDesWindow.Show = function(content, params, x, y) {
//     UIRoot.instance.ShowCantClick()
//     let resName = "window/Item/LimitCardDesWindow"
//     cce.loadRes(resName, cc.Prefab, function (err, winPre) {
//                 
//         if (err) {
//             Logs.Error("openModelWindow windowPath:" + resName + (err.message || err));
//             DialogWindow.Show(GameKit.i18n.t("loadResError"), function() {
//                 LimitCardDesWindow.Show(content, parent, x, y)
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
//         wnd.parent = params.parent || UIRoot.instance.node
//         wnd.x = params.pos.x
//         wnd.y = params.pos.y + params.height / 2 + params.height / 10
//         let panel = wnd.getComponent(LimitCardDesWindow)
//         panel.pheight = params.height
//         panel.show(content)
//         UIRoot.instance.CloseCantClick()
//     }.bind(this))
// }
