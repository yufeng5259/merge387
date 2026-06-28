import { _decorator, Component, Node, instantiate } from 'cc';
import { ContentModel } from '../../game/items/ContentModel';
const { ccclass, property } = _decorator;

let width3 = 450
let width4 = 586
let heightHave = 330
let heightNo = 224
let bgY = 19
@ccclass('InviteRewardsPanel')
export class InviteRewardsPanel extends Component {
    @property(Node)
    public bg = null;
    @property(Node)
    public arrow = null;
    @property(Node)
    public reward_layout = null;
    @property(Node)
    public item = null;

    show (meta: any) {
        // let contents=meta.Contents() 
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
        // this.bg.node.setWorldPosition(cc.v2(px+100, 0)) 
        // this.bg.node.y = bgY-30 
        // this.arrow.y = this.arrow.y-30 
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


InviteRewardsPanel.Show = function(packId, params, x, y) {
    UIRoot.instance.ShowCantClick()
    let resName = "window/Item/InviteRewardsPanel"
    cce.loadRes(resName, cc.Prefab, function (err, winPre) {
        if (err) {
            Logs.Error("openModelWindow windowPath:" + resName + (err.message || err));
            DialogWindow.Show(GameKit.i18n.t("loadResError"), function() {
                RandomChestPanel.Show(packId, parent, x, y)
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
        let panel = wnd.getComponent(InviteRewardsPanel)
        panel.pheight = params.height
        panel.show(packId)
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
// var InviteRewardsPanel = cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         bg: cc.Node,
//         arrow: cc.Node,
//         reward_layout:cc.Node,
//         item:cc.Node,
//     },
// 
//     show (meta) {
//         let contents=meta.Contents()
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
// 
//         let px = 0
//         let nx = this.node.getWorldPosition().x
//         if (nx > maxW) px = nx - maxW
//         else if (nx < -maxW) px = nx + maxW
//         this.bg.node.setWorldPosition(cc.v2(px+100, 0))
//         this.bg.node.y = bgY-30
//         this.arrow.y = this.arrow.y-30
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
// InviteRewardsPanel.Show = function(packId, params, x, y) {
//     UIRoot.instance.ShowCantClick()
//     let resName = "window/Item/InviteRewardsPanel"
//     cce.loadRes(resName, cc.Prefab, function (err, winPre) {
//                 
//         if (err) {
//             Logs.Error("openModelWindow windowPath:" + resName + (err.message || err));
//             DialogWindow.Show(GameKit.i18n.t("loadResError"), function() {
//                 RandomChestPanel.Show(packId, parent, x, y)
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
//         let panel = wnd.getComponent(InviteRewardsPanel)
//         panel.pheight = params.height
//         panel.show(packId)
//         UIRoot.instance.CloseCantClick()
//     }.bind(this))
// }
