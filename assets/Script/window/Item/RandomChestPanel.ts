import { _decorator, Component, Node, Label, instantiate } from 'cc';
const { ccclass, property } = _decorator;

let width3 = 450
let width4 = 586
let heightHave = 330
let heightNo = 224
let bgY = 19
@ccclass('RandomChestPanel')
export class RandomChestPanel extends Component {
    @property(Node)
    public bg = null;
    @property(Node)
    public arrow = null;
    @property(Node)
    public spJoker = null;
    @property(Label)
    public labelJokerDes = null;
    @property(Label)
    public labelJokerBack = null;
    @property(Label)
    public labelJokerPurchase = null;
    @property(Node)
    public spCard = null;
    @property(Node)
    public spSpin = null;
    @property(Node)
    public spCoin = null;
    @property(Node)
    public spSerExp = null;
    @property(Node)
    public spSerFood = null;

    onLoad () {
        // if (this.bg) this._bgInitPos = { x: this.bg.x, y: this.bg.y } 
        // if (this.arrow) this._arrowInitPos = { x: this.arrow.x, y: this.arrow.y } 
    }

    show (packId: any) {
        // if (this.bg) { 
            // if (!this._bgInitPos) this._bgInitPos = { x: this.bg.x, y: this.bg.y } 
            // this.bg.setPosition(this._bgInitPos.x, this._bgInitPos.y) 
            // this.bg.width = width3 
            // this.bg.height = heightHave 
        // } 
        // if (this.arrow && this._arrowInitPos) { 
            // this.arrow.setPosition(this._arrowInitPos.x, this._arrowInitPos.y) 
            // this.arrow.scaleY = 1 
        // } 
        // if (this.spSpin) this.spSpin.active = false 
        // if (this.spCoin) this.spCoin.active = false 
        // if (this.spSerFood) this.spSerFood.active = false 
        // if (this.spSerExp) this.spSerExp.active = false 
        // if (this.spCard) this.spCard.active = false 
        // if (this.spJoker) this.spJoker.active = true 
        // if (this.labelJokerBack && this.labelJokerBack.node) { 
            // this.labelJokerBack.node.stopAllActions() 
            // this.labelJokerBack.node.scale = 1 
        // } 
        // let items = Meta.RandomPackMeta.FindItemsRange(packId) 
        // let haveJoker = false 
        // let itemsCount = 0 
        // for (let type in items) { 
            // if (type == Meta.RandomPackMeta.Types.Spin) { 
                // this.spSpin.active = true 
                // let labelCount = GameKit.ControllerTable.GetComponent(this.spSpin, "labelCount", cc.Label) 
                // let labelName = GameKit.ControllerTable.GetComponent(this.spSpin, "labelName", cc.Label) 
                // let min = BigNumber.format(items[type].min) 
                // let max = BigNumber.format(items[type].max) 
                // labelCount.string = min == max ? `${min}` : `${min}-${max}` 
                // labelName.string = new Game.Content(Game.Content.Types.Ap, 0, 1).Name() 
                // itemsCount++ 
            // } else if (type == Meta.RandomPackMeta.Types.Coin) { 
                // this.spCoin.active = true 
                // let labelCount = GameKit.ControllerTable.GetComponent(this.spCoin, "labelCount", cc.Label) 
                // let labelName = GameKit.ControllerTable.GetComponent(this.spCoin, "labelName", cc.Label) 
                // let min = BigNumber.format(items[type].min) 
                // let max = BigNumber.format(items[type].max) 
                // labelCount.string = min == max ? `${min}` : `${min}-${max}` 
                // labelName.string = new Game.Content(Game.Content.Types.Coin, 0, 1).Name() 
                // itemsCount++ 
            // } else if (type == Meta.RandomPackMeta.Types.ServantFood) { 
                // this.spSerFood.active = true 
                // let labelCount = GameKit.ControllerTable.GetComponent(this.spSerFood, "labelCount", cc.Label) 
                // let labelName = GameKit.ControllerTable.GetComponent(this.spSerFood, "labelName", cc.Label) 
                // let min = BigNumber.format(items[type].min) 
                // let max = BigNumber.format(items[type].max) 
                // labelCount.string = min == max ? `${min}` : `${min}-${max}` 
                // labelName.string = new Game.Content(Game.Content.Types.Item, 3, 1).Name() 
                // itemsCount++ 
            // } else if (type == Meta.RandomPackMeta.Types.ServantExp) { 
                // this.spSerExp.active = true 
                // let labelCount = GameKit.ControllerTable.GetComponent(this.spSerExp, "labelCount", cc.Label) 
                // let labelName = GameKit.ControllerTable.GetComponent(this.spSerExp, "labelName", cc.Label) 
                // let min = BigNumber.format(items[type].min) 
                // let max = BigNumber.format(items[type].max) 
                // labelCount.string = min == max ? `${min}` : `${min}-${max}` 
                // labelName.string = new Game.Content(Game.Content.Types.Item, 2, 1).Name() 
                // itemsCount++ 
            // } else if (type == Meta.RandomPackMeta.Types.ChestId) { 
                // this.spCard.active = true 
                // let labelCount = GameKit.ControllerTable.GetComponent(this.spCard, "labelCount", cc.Label) 
                // let labelName = GameKit.ControllerTable.GetComponent(this.spCard, "labelName", cc.Label) 
                // let chestId = items[type].min 
                // let chestMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId) 
                // labelCount.string = `${chestMeta.CardNum()}x` 
                // labelName.string = GameKit.i18n.t("ContentNameCard") 
                // itemsCount++ 
                // if (chestMeta.JokerChestCount() > 0) { 
                    // haveJoker = true 
                    // this.labelJokerDes.string = String.format(GameKit.i18n.t("RandomChestRate"), chestMeta.JokerChestCount()) 
                    // this.labelJokerBack.string = String.format(GameKit.i18n.t("RandomChestBack"), Game.SUserCard.JokerGuarData(chestId), chestMeta.JokerChestGuar()) 
                    // this.labelJokerPurchase.string = String.format(GameKit.i18n.t("RandomJockerChest"), Game.SUserCard.jokerCountData(chestId), chestMeta.JokerChestCount()) 
                    // if (chestMeta.JokerChestCount() == 1) this.labelJokerDes.string = "" 
                    // if (chestMeta.JokerChestGuar() == 1) { 
                        // this.labelJokerBack.string = "x 1" 
                        // labelCount.string = `${chestMeta.CardNum() - 1}x` 
                    // } 
                    // if (chestMeta.JokerChestGuar() - Game.SUserCard.JokerGuarData(chestId) == 1) { 
                        // this.labelJokerBack.node.runAction(cc.sequence(cc.scaleTo(0.3, 1.05), cc.scaleTo(0.3, 1)).repeatForever()) 
                    // } 
                // } 
            // } 
        // } 
        // if (!haveJoker) { 
            // this.spJoker.active = false 
            // this.bg.height = heightNo 
        // } 
        // if (itemsCount >= 4) { 
            // this.bg.width = width4 
        // } 
        // if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.winSize) { 
            // let margin = 20 
            // let halfW = UIRoot.instance.winSize.width / 2 
            // let panelHalfW = this.bg ? this.bg.width / 2 : 0 
            // let minX = -halfW + margin + panelHalfW 
            // let maxX = halfW - margin - panelHalfW 
            // let oldNodeX = this.node.x 
            // let x = oldNodeX 
            // if (x < minX) x = minX 
            // else if (x > maxX) x = maxX 
            // this.node.x = x 
            // let deltaX = x - oldNodeX 
            // if (this.arrow && deltaX !== 0) { 
                // this.arrow.x -= deltaX 
            // } 
        // } 
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


RandomChestPanel.Show = function(packId, params, x, y) {
    UIRoot.instance.ShowCantClick()
    let resName = "window/Item/RandomChestPanel"
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
        let panel = wnd.getComponent(RandomChestPanel)
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
// 
// // Debug toggle:
// // - set to true to print clamp diagnostics
// // - or set `window.__DEBUG_RANDOM_CHEST_PANEL__ = true` at runtime
// // var __RCP_DEBUG__ = true
// // function __rcpDebugOn () {
// //     if (__RCP_DEBUG__) return true
// //     try { return (typeof window !== "undefined" && window.__DEBUG_RANDOM_CHEST_PANEL__ === true) } catch (e) { return false }
// // }
// // function __rcpLog () {
// //     if (!__rcpDebugOn() || !console || !console.log) return
// //     try { console.log.apply(console, arguments) } catch (e) {}
// // }
// // function __rcpWarn () {
// //     if (!__rcpDebugOn() || !console || !console.warn) return
// //     try { console.warn.apply(console, arguments) } catch (e) {}
// // }
// // function __rcpErr () {
// //     if (!console || !console.error) return
// //     try { console.error.apply(console, arguments) } catch (e) {}
// // }
// 
// var RandomChestPanel = cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         bg: cc.Node,
//         arrow: cc.Node,
// 
//         spJoker: cc.Node,
//         labelJokerDes: cc.Label,
//         labelJokerBack: cc.Label,
//         labelJokerPurchase: cc.Label,
// 
//         spCard: cc.Node,
//         spSpin: cc.Node,
//         spCoin: cc.Node,
//         spSerExp: cc.Node,
//         spSerFood: cc.Node,
//     },
// 
//     onLoad () {
//         // cache initial positions so repeated show() calls won't drift
//         if (this.bg) this._bgInitPos = { x: this.bg.x, y: this.bg.y }
//         if (this.arrow) this._arrowInitPos = { x: this.arrow.x, y: this.arrow.y }
//     },
// 
//     show (packId) {
//         // reset state (important if this panel is reused from a pool)
//         // __rcpLog("[RandomChestPanel] show begin", {
//         //     packId: packId,
//         //     node: this.node ? { x: this.node.x, y: this.node.y, active: this.node.active } : null,
//         //     bg: this.bg ? { x: this.bg.x, y: this.bg.y, w: this.bg.width, h: this.bg.height, ax: this.bg.anchorX, sx: this.bg.scaleX } : null
//         // })
//         if (this.bg) {
//             if (!this._bgInitPos) this._bgInitPos = { x: this.bg.x, y: this.bg.y }
//             this.bg.setPosition(this._bgInitPos.x, this._bgInitPos.y)
//             this.bg.width = width3
//             this.bg.height = heightHave
//         }
//         if (this.arrow && this._arrowInitPos) {
//             this.arrow.setPosition(this._arrowInitPos.x, this._arrowInitPos.y)
//             this.arrow.scaleY = 1
//         }
//         if (this.spSpin) this.spSpin.active = false
//         if (this.spCoin) this.spCoin.active = false
//         if (this.spSerFood) this.spSerFood.active = false
//         if (this.spSerExp) this.spSerExp.active = false
//         if (this.spCard) this.spCard.active = false
//         if (this.spJoker) this.spJoker.active = true
//         if (this.labelJokerBack && this.labelJokerBack.node) {
//             this.labelJokerBack.node.stopAllActions()
//             this.labelJokerBack.node.scale = 1
//         }
// 
//         let items = Meta.RandomPackMeta.FindItemsRange(packId)
//         let haveJoker = false
//         let itemsCount = 0
//         for (let type in items) {
//             if (type == Meta.RandomPackMeta.Types.Spin) {
//                 this.spSpin.active = true
//                 let labelCount = GameKit.ControllerTable.GetComponent(this.spSpin, "labelCount", cc.Label)
//                 let labelName = GameKit.ControllerTable.GetComponent(this.spSpin, "labelName", cc.Label)
//                 let min = BigNumber.format(items[type].min)
//                 let max = BigNumber.format(items[type].max)
//                 labelCount.string = min == max ? `${min}` : `${min}-${max}`
//                 labelName.string = new Game.Content(Game.Content.Types.Ap, 0, 1).Name()
//                 itemsCount++
//             } else if (type == Meta.RandomPackMeta.Types.Coin) {
//                 this.spCoin.active = true
//                 let labelCount = GameKit.ControllerTable.GetComponent(this.spCoin, "labelCount", cc.Label)
//                 let labelName = GameKit.ControllerTable.GetComponent(this.spCoin, "labelName", cc.Label)
//                 let min = BigNumber.format(items[type].min)
//                 let max = BigNumber.format(items[type].max)
//                 labelCount.string = min == max ? `${min}` : `${min}-${max}`
//                 labelName.string = new Game.Content(Game.Content.Types.Coin, 0, 1).Name()
//                 itemsCount++
//             } else if (type == Meta.RandomPackMeta.Types.ServantFood) {
//                 this.spSerFood.active = true
//                 let labelCount = GameKit.ControllerTable.GetComponent(this.spSerFood, "labelCount", cc.Label)
//                 let labelName = GameKit.ControllerTable.GetComponent(this.spSerFood, "labelName", cc.Label)
//                 let min = BigNumber.format(items[type].min)
//                 let max = BigNumber.format(items[type].max)
//                 labelCount.string = min == max ? `${min}` : `${min}-${max}`
//                 labelName.string = new Game.Content(Game.Content.Types.Item, 3, 1).Name()
//                 itemsCount++
//             } else if (type == Meta.RandomPackMeta.Types.ServantExp) {
//                 this.spSerExp.active = true
//                 let labelCount = GameKit.ControllerTable.GetComponent(this.spSerExp, "labelCount", cc.Label)
//                 let labelName = GameKit.ControllerTable.GetComponent(this.spSerExp, "labelName", cc.Label)
//                 let min = BigNumber.format(items[type].min)
//                 let max = BigNumber.format(items[type].max)
//                 labelCount.string = min == max ? `${min}` : `${min}-${max}`
//                 labelName.string = new Game.Content(Game.Content.Types.Item, 2, 1).Name()
//                 itemsCount++
//             } else if (type == Meta.RandomPackMeta.Types.ChestId) {
//                 this.spCard.active = true
//                 let labelCount = GameKit.ControllerTable.GetComponent(this.spCard, "labelCount", cc.Label)
//                 let labelName = GameKit.ControllerTable.GetComponent(this.spCard, "labelName", cc.Label)
//                 let chestId = items[type].min
//                 let chestMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId)
//                 labelCount.string = `${chestMeta.CardNum()}x`
//                 labelName.string = GameKit.i18n.t("ContentNameCard")
//                 itemsCount++
// 
//                 if (chestMeta.JokerChestCount() > 0) {
//                     haveJoker = true
//                     this.labelJokerDes.string = String.format(GameKit.i18n.t("RandomChestRate"), chestMeta.JokerChestCount())
//                     this.labelJokerBack.string = String.format(GameKit.i18n.t("RandomChestBack"), Game.SUserCard.JokerGuarData(chestId), chestMeta.JokerChestGuar())
//                     this.labelJokerPurchase.string = String.format(GameKit.i18n.t("RandomJockerChest"), Game.SUserCard.jokerCountData(chestId), chestMeta.JokerChestCount())
//                     if (chestMeta.JokerChestCount() == 1) this.labelJokerDes.string = ""
//                     if (chestMeta.JokerChestGuar() == 1) {
//                         this.labelJokerBack.string = "x 1"
//                         labelCount.string = `${chestMeta.CardNum() - 1}x`
//                     }
//                     if (chestMeta.JokerChestGuar() - Game.SUserCard.JokerGuarData(chestId) == 1) {
//                         this.labelJokerBack.node.runAction(cc.sequence(cc.scaleTo(0.3, 1.05), cc.scaleTo(0.3, 1)).repeatForever())
//                     }
//                 }
//             }
//         }
// 
//         if (!haveJoker) {
//             this.spJoker.active = false
//             this.bg.height = heightNo
//         }
//         if (itemsCount >= 4) {
//             this.bg.width = width4
//         }
//         // __rcpLog("[RandomChestPanel] after build items", {
//         //     itemsCount: itemsCount,
//         //     haveJoker: haveJoker,
//         //     bg: this.bg ? { x: this.bg.x, y: this.bg.y, w: this.bg.width, h: this.bg.height, ax: this.bg.anchorX, sx: this.bg.scaleX } : null
//         // })
// 
//         // clamp whole panel horizontally so it won't exceed safe-area (strict 20px margin)
//         if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.winSize) {
//             let margin = 20
//             let halfW = UIRoot.instance.winSize.width / 2
//             let panelHalfW = this.bg ? this.bg.width / 2 : 0
// 
//             let minX = -halfW + margin + panelHalfW
//             let maxX = halfW - margin - panelHalfW
// 
//             let oldNodeX = this.node.x
//             let x = oldNodeX
//             if (x < minX) x = minX
//             else if (x > maxX) x = maxX
// 
//             // __rcpLog("[RandomChestPanel] clamp panel", {
//             //     halfW: halfW,
//             //     panelHalfW: panelHalfW,
//             //     minX: minX,
//             //     maxX: maxX,
//             //     beforeX: oldNodeX,
//             //     afterX: x,
//             // })
//             this.node.x = x
// 
//             // node 水平移动了 deltaX，为了让箭头在世界坐标保持不动，反向平移 arrow 本地坐标
//             let deltaX = x - oldNodeX
//             if (this.arrow && deltaX !== 0) {
//                 this.arrow.x -= deltaX
//                 // __rcpLog("[RandomChestPanel] adjust arrow offset", {
//                 //     deltaX: deltaX,
//                 //     arrowLocalAfter: { x: this.arrow.x, y: this.arrow.y },
//                 // })
//             }
//         }
//         
// 
//         // if (this.node.getWorldPosition().y + bgY + this.bg.height - 20 > UIRoot.instance.winSize.height / 2) {
//         //     this.arrow.scaleY = -1
//         //     this.arrow.y = -this.arrow.y
//         //     this.bg.y = -this.bg.y - this.bg.height
//         //     this.node.y -= this.pheight + this.pheight / 5
//         // }
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
// RandomChestPanel.Show = function(packId, params, x, y) {
//     UIRoot.instance.ShowCantClick()
//     let resName = "window/Item/RandomChestPanel"
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
//         let panel = wnd.getComponent(RandomChestPanel)
//         panel.pheight = params.height
//         panel.show(packId)
//         UIRoot.instance.CloseCantClick()
//     }.bind(this))
// }
