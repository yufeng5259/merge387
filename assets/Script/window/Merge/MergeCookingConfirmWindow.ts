import { _decorator, Label } from 'cc';
import { UIWindow } from "../../GameKit/ui/UIWindow";
import { ContentModel } from '../../game/items/ContentModel';
import { MergeContentUtil } from '../../game/merge/MergeContentUtil';
const { ccclass, property } = _decorator;

@ccclass('MergeCookingConfirmWindow')
export default class MergeCookingConfirmWindow extends UIWindow {
    @property
    public toolContent = 'ContentModel';
    @property
    public resultContent = 'ContentModel';
    @property(Label)
    public titleLabel = null;
    @property(Label)
    public msgLabel = null;
    @property(Label)
    public labelCancel = null;
    @property(Label)
    public labelOk = null;
    @property
    public cancelContent = 'ContentModel';

    public static windowPath = 'Merge/MergeCookingConfirmWindow';

    onShow (showParams: any) {
        // showParams = showParams || {} 
        // this.recipeMeta = showParams.recipeMeta 
        // this.confirmFunc = showParams.confirmFunc || showParams.onConfirm || showParams.onOk 
        // this.cancelFunc = showParams.cancelFunc || showParams.onCancel 
        // this.toolCellKey = showParams.toolCellKey 
        // this.toolId = this.getParamId(showParams, ["toolId", "cookingToolId", "makeToolId"]) 
        // this.resultId = this.getParamId(showParams, ["resultId", "productId", "mergeId", "id"]) 
        // this.resultCount = parseInt(showParams.resultCount || showParams.count || 1) 
        // let costStr = MergeContentUtil.toContentString(showParams.costStr || (this.recipeMeta && this.recipeMeta.CancelCost && this.recipeMeta.CancelCost())) 
        // this.costContent = costStr ? Game.Content.FromString(costStr) : null 
        // if (this.cancelContent && costStr) { 
            // this.cancelContent.node.active = true 
            // this.cancelContent.show(this.costContent, { iconParams: { dontTouch: true } }) 
        // } else if (this.cancelContent) { 
            // this.cancelContent.node.active = false 
        // } 
        // this.updateLabels(showParams) 
        // this.showMergeContent(this.toolContent, this.toolId, 1, true) 
        // this.showMergeContent(this.resultContent, this.resultId, this.resultCount, true) 
    }

    event_close () {
        // this.onCancel() 
    }

    isCookingFinished () {
        // if (!this.toolCellKey) return false 
        // let posArr = this.toolCellKey.split("_") 
        // if (posArr.length < 2) return false 
        // let cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(posArr[0], posArr[1]) 
        // let cookingData = cookingId ? Game.SUserMerge.GetCookingState(cookingId) : null 
        // return cookingData && cookingData.status == "cooking" && GameKit.TimeUtil.getCurrentTime() >= cookingData.finishTime 
    }

    closeIfCookingFinished () {
        // if (!this.isCookingFinished()) return false 
        // console.log("cooking already finished") 
        // this.closeAnim() 
        // return true 
    }

    onConfirm () {
        // if (this.closeIfCookingFinished()) { 
            // return 
        // } 
        // if (this.costContent && !Game.ContentCheck.CheckContent(this.costContent)) { 
            // return 
        // } 
        // this.backToLoadedBeforeConfirm() 
    }

    backToLoadedBeforeConfirm () {
        // if (!this.toolCellKey) { 
            // console.error("MergeCookingConfirmWindow missing toolCellKey") 
            // return 
        // } 
        // let mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode 
        // mergeLevelNode.updateMergeMapEvent({ actionType: "func", funcAction: "cookingBackToLoaded",forceServer:true, toolCellKey: this.toolCellKey }).then((result) => { 
            // if (result.success) { 
                // if (this.confirmFunc) { 
                    // this.confirmFunc() 
                // } 
                // this.closeAnim() 
            // } 
        // }).catch((err) => { 
            // console.error(err, "updateMergeMapEvent_cookingBackToLoaded"); 
        // }) 
    }

    onCancel () {
        // if (this.closeIfCookingFinished()) { 
            // return 
        // } 
        // if (this.cancelFunc) { 
            // this.cancelFunc() 
        // } 
        // this.closeAnim() 
    }

    updateLabels (showParams: any) {
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

}

// (global as any).MergeCookingConfirmWindow = MergeCookingConfirmWindow;
// (window as any).MergeCookingConfirmWindow = MergeCookingConfirmWindow;
/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// let UIWindow = require("UIWindow")
// let ContentModel = require("ContentModel")
// let MergeContentUtil = require("../../game/merge/MergeContentUtil")
// 
// let MergeCookingConfirmWindow = cc.Class({
//     extends: UIWindow,
// 
//     statics: {
//         windowPath: "Merge/MergeCookingConfirmWindow",
//     },
// 
//     properties: {
//         toolContent: ContentModel,
//         resultContent: ContentModel,
//         titleLabel: cc.Label,
//         msgLabel: cc.Label,
//         labelCancel: cc.Label,
//         labelOk: cc.Label,
//         cancelContent: ContentModel,
//     },
// 
//     onShow(showParams) {
//         showParams = showParams || {}
//         this.recipeMeta = showParams.recipeMeta
//         this.confirmFunc = showParams.confirmFunc || showParams.onConfirm || showParams.onOk
//         this.cancelFunc = showParams.cancelFunc || showParams.onCancel
//         this.toolCellKey = showParams.toolCellKey
//         this.toolId = this.getParamId(showParams, ["toolId", "cookingToolId", "makeToolId"])
//         this.resultId = this.getParamId(showParams, ["resultId", "productId", "mergeId", "id"])
//         this.resultCount = parseInt(showParams.resultCount || showParams.count || 1)
//         let costStr = MergeContentUtil.toContentString(showParams.costStr || (this.recipeMeta && this.recipeMeta.CancelCost && this.recipeMeta.CancelCost()))
//         this.costContent = costStr ? Game.Content.FromString(costStr) : null
//         if (this.cancelContent && costStr) {
//             this.cancelContent.node.active = true
//             this.cancelContent.show(this.costContent, { iconParams: { dontTouch: true } })
//         } else if (this.cancelContent) {
//             this.cancelContent.node.active = false
//         }
// 
//         this.updateLabels(showParams)
//         this.showMergeContent(this.toolContent, this.toolId, 1, true)
//         this.showMergeContent(this.resultContent, this.resultId, this.resultCount, true)
//     },
// 
//     event_close() {
//         this.onCancel()
//     },
// 
//     isCookingFinished() {
//         if (!this.toolCellKey) return false
//         let posArr = this.toolCellKey.split("_")
//         if (posArr.length < 2) return false
//         let cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(posArr[0], posArr[1])
//         let cookingData = cookingId ? Game.SUserMerge.GetCookingState(cookingId) : null
//         return cookingData && cookingData.status == "cooking" && GameKit.TimeUtil.getCurrentTime() >= cookingData.finishTime
//     },
// 
//     closeIfCookingFinished() {
//         if (!this.isCookingFinished()) return false
//         console.log("cooking already finished")
//         this.closeAnim()
//         return true
//     },
// 
//     onConfirm() {
//         if (this.closeIfCookingFinished()) {
//             return
//         }
//         if (this.costContent && !Game.ContentCheck.CheckContent(this.costContent)) {
//             return
//         }
//         this.backToLoadedBeforeConfirm()
//     },
// 
//     backToLoadedBeforeConfirm() {
//         if (!this.toolCellKey) {
//             console.error("MergeCookingConfirmWindow missing toolCellKey")
//             return
//         }
//         let mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode
//         mergeLevelNode.updateMergeMapEvent({ actionType: "func", funcAction: "cookingBackToLoaded",forceServer:true, toolCellKey: this.toolCellKey }).then((result) => {
//             // console.log('updateMergeMapEvent_cookingBackToLoaded', result);
//             if (result.success) {
//                 if (this.confirmFunc) {
//                     this.confirmFunc()
//                 }
//                 this.closeAnim()
//             }
//         }).catch((err) => {
//             console.error(err, "updateMergeMapEvent_cookingBackToLoaded");
//         })
//     },
// 
//     onCancel() {
//         if (this.closeIfCookingFinished()) {
//             return
//         }
//         if (this.cancelFunc) {
//             this.cancelFunc()
//         }
//         this.closeAnim()
//     },
// 
//     updateLabels(showParams) {
//         // if (this.titleLabel) {
//         //     this.titleLabel.string = showParams.title || "Stop"
//         // }
//         // if (this.msgLabel) {
//         //     this.msgLabel.string = showParams.msg || "Are you sure you want to\nstop production and return\nthe raw materials?"
//         // }
//         // if (this.labelCancel) {
//         //     this.labelCancel.string = showParams.cancelStr || "Cancel"
//         // }
//         // if (this.labelOk) {
//         //     this.labelOk.string = showParams.confirmStr || showParams.okStr || "Ok"
//         // }
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
//     showMergeContent(contentModel, mergeId, count, showInfoBtn) {
//         if (!contentModel) {
//             return
//         }
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
// })
// 
// module.exports = MergeCookingConfirmWindow
