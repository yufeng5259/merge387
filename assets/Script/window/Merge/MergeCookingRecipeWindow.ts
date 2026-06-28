import { _decorator, Label } from 'cc';
import { UIWindow } from "../../GameKit/ui/UIWindow";
import { ContentModel } from '../../game/items/ContentModel';
import List from '../../GameKit/ui/list/List';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';
const { ccclass, property } = _decorator;

@ccclass('MergeCookingRecipeWindow')
export class MergeCookingRecipeWindow extends UIWindow {
    @property
    public cookingScrollview = 'List';
    @property
    public materialContent1 = 'ContentModel';
    @property
    public materialContent2 = 'ContentModel';
    @property(Label)
    public labelTime = null;

    public static windowPath = 'Merge/MergeCookingRecipeWindow';

    onShow (showParams: any) {
        // showParams = showParams || {} 
        // this.showParams = showParams 
        // this.mergeTypeWindow = this.getMergeTypeWindow(showParams) 
        // this.mergeTypeWindowActive = this.mergeTypeWindow && this.mergeTypeWindow.node ? this.mergeTypeWindow.node.active : false 
        // this.mergeTypeNameLabelState = this.getMergeTypeNameLabelState(this.mergeTypeWindow) 
        // if (this.mergeTypeWindowActive) { 
            // this.mergeTypeWindow.node.active = false 
        // } 
        // this.resultId = this.getParamId(showParams, ["resultId", "productId", "mergeId", "id"]) 
        // this.toolId = this.getParamId(showParams, ["toolId", "cookingToolId", "makeToolId"]) 
        // this.recipeMeta = this.getRecipeMeta(this.resultId, this.toolId) 
        // this.ingredientIds = this.recipeMeta ? this.recipeMeta.IngredientIds() : [] 
        // this.showMergeContent(this.materialContent1, this.toolId, 1, true) 
        // this.showMergeContent(this.materialContent2, this.resultId, this.recipeMeta ? this.recipeMeta.ResultCount() : 1) 
        // this.updateLabels(showParams) 
        // if (this.cookingScrollview) { 
            // this.cookingScrollview.numItems = this.ingredientIds.length 
        // } 
    }

    onListItemRender (itemNode: any, index: any) {
        // let ingredientId = this.ingredientIds[index] 
        // let contentModel = this.getItemContentModel(itemNode) 
        // if (contentModel) { 
            // this.showMergeContent(contentModel, ingredientId, 1, true) 
        // } 
        // let nameLabel = this.getChildComponent(itemNode, ["labelName", "nameLabel", "name", "title"], cc.Label) 
        // if (nameLabel) { 
            // nameLabel.string = this.getIngredientName(ingredientId, index) 
        // } 
    }

    event_close () {
        // this.closeAnim() 
    }

    onClose () {
        // if (this.mergeTypeWindowActive && this.mergeTypeWindow && cc.isValid(this.mergeTypeWindow.node)) { 
            // let mergeTypeWindow = this.mergeTypeWindow 
            // let nameLabelState = this.mergeTypeNameLabelState 
            // mergeTypeWindow.node.active = true 
            // this.restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState) 
            // EnterCloseAnim.playEnter(mergeTypeWindow.node) 
            // mergeTypeWindow.scheduleOnce(() => { 
                // this.restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState) 
            // }, 0) 
        // } 
        // this.mergeTypeWindow = null 
        // this.mergeTypeWindowActive = false 
        // this.mergeTypeNameLabelState = null 
    }

    getMergeTypeWindow (showParams: any) {
        // if (showParams.sourceWindow && showParams.sourceWindow.node && cc.isValid(showParams.sourceWindow.node)) { 
            // return showParams.sourceWindow 
        // } 
        // if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.GetWindow) { 
            // let mergeTypeWindow = UIRoot.instance.GetWindow("MergeTypeWindow") 
            // if (mergeTypeWindow && mergeTypeWindow.node && cc.isValid(mergeTypeWindow.node)) { 
                // return mergeTypeWindow 
            // } 
        // } 
        // return null 
    }

    getMergeTypeNameLabelState (mergeTypeWindow: any) {
        // if (!mergeTypeWindow || !mergeTypeWindow.nameLabel || !mergeTypeWindow.nameLabel.node) { 
            // return null 
        // } 
        // let labelNode = mergeTypeWindow.nameLabel.node 
        // return { 
            // string: mergeTypeWindow.nameLabel.string, 
            // active: labelNode.active, 
            // opacity: labelNode.opacity, 
            // x: labelNode.x, 
            // y: labelNode.y, 
        // } 
    }

    restoreMergeTypeNameLabel (mergeTypeWindow: any, nameLabelState: any) {
        // if (!nameLabelState || !mergeTypeWindow || !mergeTypeWindow.nameLabel || !cc.isValid(mergeTypeWindow.nameLabel.node)) { 
            // return 
        // } 
        // let labelNode = mergeTypeWindow.nameLabel.node 
        // mergeTypeWindow.nameLabel.string = nameLabelState.string 
        // labelNode.active = nameLabelState.active 
        // labelNode.opacity = nameLabelState.opacity 
        // labelNode.x = nameLabelState.x 
        // labelNode.y = nameLabelState.y 
    }

    getParamId (params: any, keys: any) {
        // for (let i = 0; i < keys.length; i++) { 
            // let value = params[keys[i]] 
            // if (value != null && value !== "") { 
                // return parseInt(value) 
            // } 
        // } 
        // return 0 
    }

    getRecipeMeta (resultId: any, toolId: any) {
        // if (!resultId || !toolId || typeof Meta === "undefined" || !Meta.MergeCookingRecipeMeta) { 
            // return null 
        // } 
        // let list = Meta.MergeCookingRecipeMeta.GetRecipesByToolId(toolId) || [] 
        // for (let i = 0; i < list.length; i++) { 
            // if (list[i].ResultId() == resultId) { 
                // return list[i] 
            // } 
        // } 
        // return null 
    }

    updateLabels (showParams: any) {
        // let titleLabel = this.getLabel("titleLabel") 
        // if (titleLabel) { 
            // titleLabel.string = showParams.title || (this.recipeMeta ? this.recipeMeta.ResultName() : "") 
        // } 
        // let timeLabel = this.labelTime || this.getLabel("timeLabel") 
        // if (timeLabel) { 
            // let makeTime = this.recipeMeta ? this.recipeMeta.MakeTime() : showParams.time 
            // timeLabel.string = typeof makeTime === "string" ? makeTime : this.formatTime(makeTime) 
        // } 
    }

    formatTime (seconds: any) {
        // seconds = parseInt(seconds) || 0 
        // if (typeof GameKit !== "undefined" && GameKit.TimeUtil && GameKit.TimeUtil.FormatRemainTimeSimple) { 
            // return GameKit.TimeUtil.FormatRemainTimeSimple(seconds, false) 
        // } 
        // let minute = Math.floor(seconds / 60) 
        // let second = seconds % 60 
        // return (minute < 10 ? "0" + minute : "" + minute) + ":" + (second < 10 ? "0" + second : "" + second) 
    }

    showMergeContent (contentModel: any, mergeId: any, count: any, showInfoBtn: any) {
        // if (!contentModel) { 
            // return 
        // } 
        // if (!mergeId) { 
            // contentModel.clear && contentModel.clear() 
            // contentModel.node.active = false 
            // return 
        // } 
        // contentModel.node.active = true 
        // contentModel.show(this.getMergeContent(mergeId, count), { 
            // iconParams: { dontTouch: !showInfoBtn }, 
            // infoBtnParams: { 
                // canTouch: false, 
                // showInfoBtn: !!showInfoBtn, 
            // } 
        // }) 
    }

    getMergeContent (mergeId: any, count: any) {
        // return Game.Content.FromString("9=" + mergeId + "=" + (count || 1)) 
    }

    getIngredientName (ingredientId: any, index: any) {
        // if (this.recipeMeta) { 
            // let names = this.recipeMeta.IngredientNames() || [] 
            // let name = typeof GameKit !== "undefined" && GameKit.i18n ? GameKit.i18n.sel(names[index]) : "" 
            // if (name) { 
                // return name 
            // } 
        // } 
        // if (typeof Meta === "undefined" || !Meta.MetaManager) { 
            // return "" 
        // } 
        // let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, ingredientId) 
        // return meta ? meta.Name() : "" 
    }

    getItemContentModel (itemNode: any) {
        // if (!itemNode) { 
            // return null 
        // } 
        // let contentModel = itemNode.getComponent(ContentModel) 
        // if (contentModel) { 
            // return contentModel 
        // } 
        // return this.getChildComponent(itemNode, ["content", "item", "itemModel", "contentModel", "materialContent"], ContentModel) 
    }

    getLabel (nodeName: any) {
        // return this.getChildComponent(this.node, [nodeName], cc.Label) 
    }

    getChildComponent (root: any, nodeNames: any, component: any) {
        // if (!root) { 
            // return null 
        // } 
        // for (let i = 0; i < nodeNames.length; i++) { 
            // let node = this.findChild(root, nodeNames[i]) 
            // if (node) { 
                // let comp = node.getComponent(component) 
                // if (comp) { 
                    // return comp 
                // } 
            // } 
        // } 
        // return null 
    }

    findChild (root: any, nodeName: any) {
        // if (!root) { 
            // return null 
        // } 
        // if (root.name === nodeName) { 
            // return root 
        // } 
        // for (let i = 0; i < root.children.length; i++) { 
            // let child = this.findChild(root.children[i], nodeName) 
            // if (child) { 
                // return child 
            // } 
        // } 
        // return null 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// let UIWindow = require("UIWindow")
// let ContentModel = require("ContentModel")
// const List = require("List")
// let EnterCloseAnim = require("EnterCloseAnim")
// 
// let MergeCookingRecipeWindow = cc.Class({
//     extends: UIWindow,
// 
//     statics: {
//         windowPath: "Merge/MergeCookingRecipeWindow",
//     },
// 
//     properties: {
//         cookingScrollview: List,
//         materialContent1: ContentModel,
//         materialContent2: ContentModel,
//         labelTime: cc.Label,
//     },
// 
//     onShow(showParams) {
//         showParams = showParams || {}
//         this.showParams = showParams
//         this.mergeTypeWindow = this.getMergeTypeWindow(showParams)
//         this.mergeTypeWindowActive = this.mergeTypeWindow && this.mergeTypeWindow.node ? this.mergeTypeWindow.node.active : false
//         this.mergeTypeNameLabelState = this.getMergeTypeNameLabelState(this.mergeTypeWindow)
//         if (this.mergeTypeWindowActive) {
//             this.mergeTypeWindow.node.active = false
//         }
// 
//         this.resultId = this.getParamId(showParams, ["resultId", "productId", "mergeId", "id"])
//         this.toolId = this.getParamId(showParams, ["toolId", "cookingToolId", "makeToolId"])
//         this.recipeMeta = this.getRecipeMeta(this.resultId, this.toolId)
//         this.ingredientIds = this.recipeMeta ? this.recipeMeta.IngredientIds() : []
//         
// 
//         this.showMergeContent(this.materialContent1, this.toolId, 1, true)
//         this.showMergeContent(this.materialContent2, this.resultId, this.recipeMeta ? this.recipeMeta.ResultCount() : 1)
//         this.updateLabels(showParams)
// 
//         if (this.cookingScrollview) {
//             this.cookingScrollview.numItems = this.ingredientIds.length
//         }
//     },
// 
//     onListItemRender(itemNode, index) {
//         let ingredientId = this.ingredientIds[index]
//         let contentModel = this.getItemContentModel(itemNode)
//         if (contentModel) {
//             this.showMergeContent(contentModel, ingredientId, 1, true)
//         }
// 
//         let nameLabel = this.getChildComponent(itemNode, ["labelName", "nameLabel", "name", "title"], cc.Label)
//         if (nameLabel) {
//             nameLabel.string = this.getIngredientName(ingredientId, index)
//         }
//     },
// 
//     event_close() {
//         this.closeAnim()
//     },
// 
//     onClose() {
//         if (this.mergeTypeWindowActive && this.mergeTypeWindow && cc.isValid(this.mergeTypeWindow.node)) {
//             let mergeTypeWindow = this.mergeTypeWindow
//             let nameLabelState = this.mergeTypeNameLabelState
//             mergeTypeWindow.node.active = true
//             this.restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState)
//             EnterCloseAnim.playEnter(mergeTypeWindow.node)
//             mergeTypeWindow.scheduleOnce(() => {
//                 this.restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState)
//             }, 0)
//         }
//         this.mergeTypeWindow = null
//         this.mergeTypeWindowActive = false
//         this.mergeTypeNameLabelState = null
//     },
// 
//     getMergeTypeWindow(showParams) {
//         if (showParams.sourceWindow && showParams.sourceWindow.node && cc.isValid(showParams.sourceWindow.node)) {
//             return showParams.sourceWindow
//         }
// 
//         if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.GetWindow) {
//             let mergeTypeWindow = UIRoot.instance.GetWindow("MergeTypeWindow")
//             if (mergeTypeWindow && mergeTypeWindow.node && cc.isValid(mergeTypeWindow.node)) {
//                 return mergeTypeWindow
//             }
//         }
//         return null
//     },
// 
//     getMergeTypeNameLabelState(mergeTypeWindow) {
//         if (!mergeTypeWindow || !mergeTypeWindow.nameLabel || !mergeTypeWindow.nameLabel.node) {
//             return null
//         }
// 
//         let labelNode = mergeTypeWindow.nameLabel.node
//         return {
//             string: mergeTypeWindow.nameLabel.string,
//             active: labelNode.active,
//             opacity: labelNode.opacity,
//             x: labelNode.x,
//             y: labelNode.y,
//         }
//     },
// 
//     restoreMergeTypeNameLabel(mergeTypeWindow, nameLabelState) {
//         if (!nameLabelState || !mergeTypeWindow || !mergeTypeWindow.nameLabel || !cc.isValid(mergeTypeWindow.nameLabel.node)) {
//             return
//         }
// 
//         let labelNode = mergeTypeWindow.nameLabel.node
//         mergeTypeWindow.nameLabel.string = nameLabelState.string
//         labelNode.active = nameLabelState.active
//         labelNode.opacity = nameLabelState.opacity
//         labelNode.x = nameLabelState.x
//         labelNode.y = nameLabelState.y
//     },
// 
//     getParamId(params, keys) {
//         for (let i = 0; i < keys.length; i++) {
//             let value = params[keys[i]]
//             if (value != null && value !== "") {
//                 return parseInt(value)
//             }
//         }
//         return 0
//     },
// 
//     getRecipeMeta(resultId, toolId) {
//         if (!resultId || !toolId || typeof Meta === "undefined" || !Meta.MergeCookingRecipeMeta) {
//             return null
//         }
// 
//         let list = Meta.MergeCookingRecipeMeta.GetRecipesByToolId(toolId) || []
//         for (let i = 0; i < list.length; i++) {
//             if (list[i].ResultId() == resultId) {
//                 return list[i]
//             }
//         }
//         return null
//     },
// 
//     updateLabels(showParams) {
//         let titleLabel = this.getLabel("titleLabel")
//         if (titleLabel) {
//             titleLabel.string = showParams.title || (this.recipeMeta ? this.recipeMeta.ResultName() : "")
//         }
// 
//         // let methodLabel = this.getLabel("methodLabel")
//         // if (methodLabel) {
//         //     methodLabel.string = showParams.method || (this.recipeMeta ? this.recipeMeta.ToolName() : "")
//         // }
// 
//         let timeLabel = this.labelTime || this.getLabel("timeLabel")
//         if (timeLabel) {
//             let makeTime = this.recipeMeta ? this.recipeMeta.MakeTime() : showParams.time
//             timeLabel.string = typeof makeTime === "string" ? makeTime : this.formatTime(makeTime)
//         }
//     },
// 
//     formatTime(seconds) {
//         seconds = parseInt(seconds) || 0
//         if (typeof GameKit !== "undefined" && GameKit.TimeUtil && GameKit.TimeUtil.FormatRemainTimeSimple) {
//             return GameKit.TimeUtil.FormatRemainTimeSimple(seconds, false)
//         }
// 
//         let minute = Math.floor(seconds / 60)
//         let second = seconds % 60
//         return (minute < 10 ? "0" + minute : "" + minute) + ":" + (second < 10 ? "0" + second : "" + second)
//     },
// 
//     showMergeContent(contentModel, mergeId, count, showInfoBtn) {
//         if (!contentModel) {
//             return
//         }
// 
//         if (!mergeId) {
//             contentModel.clear && contentModel.clear()
//             contentModel.node.active = false
//             return
//         }
// 
//         contentModel.node.active = true
//         contentModel.show(this.getMergeContent(mergeId, count), {
//             iconParams: { dontTouch: !showInfoBtn },
//             infoBtnParams: {
//                 canTouch: false,
//                 showInfoBtn: !!showInfoBtn,
//             }
//         })
//     },
// 
//     getMergeContent(mergeId, count) {
//         return Game.Content.FromString("9=" + mergeId + "=" + (count || 1))
//     },
// 
//     getIngredientName(ingredientId, index) {
//         if (this.recipeMeta) {
//             let names = this.recipeMeta.IngredientNames() || []
//             let name = typeof GameKit !== "undefined" && GameKit.i18n ? GameKit.i18n.sel(names[index]) : ""
//             if (name) {
//                 return name
//             }
//         }
// 
//         if (typeof Meta === "undefined" || !Meta.MetaManager) {
//             return ""
//         }
// 
//         let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, ingredientId)
//         return meta ? meta.Name() : ""
//     },
// 
//     getItemContentModel(itemNode) {
//         if (!itemNode) {
//             return null
//         }
// 
//         let contentModel = itemNode.getComponent(ContentModel)
//         if (contentModel) {
//             return contentModel
//         }
// 
//         return this.getChildComponent(itemNode, ["content", "item", "itemModel", "contentModel", "materialContent"], ContentModel)
//     },
// 
//     getLabel(nodeName) {
//         return this.getChildComponent(this.node, [nodeName], cc.Label)
//     },
// 
//     getChildComponent(root, nodeNames, component) {
//         if (!root) {
//             return null
//         }
// 
//         for (let i = 0; i < nodeNames.length; i++) {
//             let node = this.findChild(root, nodeNames[i])
//             if (node) {
//                 let comp = node.getComponent(component)
//                 if (comp) {
//                     return comp
//                 }
//             }
//         }
//         return null
//     },
// 
//     findChild(root, nodeName) {
//         if (!root) {
//             return null
//         }
//         if (root.name === nodeName) {
//             return root
//         }
//         for (let i = 0; i < root.children.length; i++) {
//             let child = this.findChild(root.children[i], nodeName)
//             if (child) {
//                 return child
//             }
//         }
//         return null
//     },
// })
// 
// module.exports = MergeCookingRecipeWindow
