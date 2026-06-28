import { _decorator, Label } from 'cc';
import { UIWindow } from "../../GameKit/ui/UIWindow";
import { ContentModel } from '../../game/items/ContentModel';
import MergeTypes from '../../game/merge/MergeTypes';
const { ccclass, property } = _decorator;

@ccclass('ScissorsWindow')
export class ScissorsWindow extends UIWindow {
    @property(Label)
    public titleLabel = null;
    @property(Label)
    public desLabel = null;
    @property
    public scissorsContentModel = 'ContentModel';
    @property
    public dropItemContentModel = 'ContentModel';
    @property([ContentModel])
    public mergeContentModelArr = [];

    public static windowPath = 'Merge/ScissorsWindow';

    onShow (showParams: any) {
        // this.scissorsMeta = showParams.scissorsMeta 
        // this.dropMeta = showParams.dropMeta 
        // this.cellKey1 = showParams.cellKey1 
        // this.cellKey2 = showParams.cellKey2 
        // let preid = this.dropMeta.PrevId() 
        // this.pickPieceData = { 
            // cutPieces: null, 
            // degradedScissors: null 
        // } 
        // this.scissorsContentModel.show(Game.Content.FromString("9=" + this.scissorsMeta.Id() + "=1"), { iconParams: { dontTouch: true } }) 
        // this.dropItemContentModel.show(Game.Content.FromString("9=" + this.dropMeta.Id() + "=1"), { iconParams: { dontTouch: true } }) 
        // this.mergeContentModelArr.forEach((mergeContentModel) => { 
            // let content = Game.Content.FromString("9=" + preid + "=1") 
            // mergeContentModel.show(content, { iconParams: { dontTouch: true } }) 
        // }) 
    }

    onClickOk () {
        // let mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode 
        // mergeLevelNode.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.MERGE, cellKey1: this.cellKey1, cellKey2: this.cellKey2, forceSend: true }).then((result) => { 
            // this.pickPieceData.cutPieces = result.cutPieces 
            // this.pickPieceData.degradedScissors = result.degradedScissors 
            // this.closeAnim() 
        // }).catch((err) => { 
            // cc.error(err, "ScissorsWindow updateMergeMapEvent") 
        // }) 
    }

    event_close () {
        // this.pickPieceData = null 
        // this.closeAnim() 
    }

}


module.exports = ScissorsWindow
/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// let UIWindow = require("UIWindow")
// let ContentModel = require('ContentModel')
// var MergeTypes = require('MergeTypes')
// 
// let ScissorsWindow = cc.Class({
//     extends: UIWindow,
// 
//     statics: {
//         windowPath: "Merge/ScissorsWindow"
//     },
// 
//     properties: {
//         titleLabel: cc.Label,
//         desLabel: cc.Label,
//         scissorsContentModel: ContentModel,
//         dropItemContentModel: ContentModel,
//         mergeContentModelArr: [ContentModel],
//     },
// 
//     onShow(showParams) {
//         this.scissorsMeta = showParams.scissorsMeta
//         this.dropMeta = showParams.dropMeta
//         this.cellKey1 = showParams.cellKey1
//         this.cellKey2 = showParams.cellKey2
// 
//         let preid = this.dropMeta.PrevId()
//         this.pickPieceData = {
//             cutPieces: null,
//             degradedScissors: null
//         }
//         // this.pickPieceData = preid + "_-1_-1"
// 
//         this.scissorsContentModel.show(Game.Content.FromString("9=" + this.scissorsMeta.Id() + "=1"), { iconParams: { dontTouch: true } })
//         this.dropItemContentModel.show(Game.Content.FromString("9=" + this.dropMeta.Id() + "=1"), { iconParams: { dontTouch: true } })
// 
//         this.mergeContentModelArr.forEach((mergeContentModel) => {
//             let content = Game.Content.FromString("9=" + preid + "=1")
//             mergeContentModel.show(content, { iconParams: { dontTouch: true } })
//         })
//     },
// 
//     onClickOk() {
//         let mergeLevelNode = GamePlay.instance.mergeRoot.mergeLevelNode
//         mergeLevelNode.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.MERGE, cellKey1: this.cellKey1, cellKey2: this.cellKey2, forceSend: true }).then((result) => {
//             this.pickPieceData.cutPieces = result.cutPieces
//             this.pickPieceData.degradedScissors = result.degradedScissors
//             this.closeAnim()
//         }).catch((err) => {
//             cc.error(err, "ScissorsWindow updateMergeMapEvent")
//         })
//     },
// 
//     event_close() {
//         this.pickPieceData = null
//         this.closeAnim()
//     },
// })
// 
// module.exports = ScissorsWindow
