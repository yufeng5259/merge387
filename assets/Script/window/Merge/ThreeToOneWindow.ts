import { UIWindow } from '../../GameKit/ui/UIWindow';
import ContentModel from '../../game/items/ContentModel';
const { ccclass, property, executeInEditMode } = cc._decorator
/**
 * Store界面
 * - 包含各类按钮的点击事件处理
 * merge时仓库界面
 * @class
 */
@ccclass
class ThreeToOneWindow extends UIWindow {

    static windowPath = "Merge/ThreeToOneWindow"
    @property(cc.Label)
    titleLabel = null
    @property(cc.Label)
    desLabel = null
    @property(ContentModel)
    mergeContentModelArr = []
    @property(cc.Node)
    selectButton = null


    onShow(showParams) {
        this.funcOptions = showParams.funcOptions
        this.instanceId = showParams.instanceId
        this.cellKey = showParams.cellKey
        // this.pickPieceData = showParams.pickPieceData
        this.targetCellKey = showParams.targetCellKey
        this.selectButton.active = false
        this.lastSelectContent = null
        // console.log("onShow",this.funcOptions,this.instanceId);
        this.unSelectContent()
        let self=this
        this.mergeContentModelArr.forEach((mergeContentModel, index) => {
            let mergeStr = this.funcOptions[index]
            let mergeData = mergeStr.split('_')
            let mergeId = parseInt(mergeData[0], 10)
            let content = Game.Content.FromString("9=" + mergeId + "=1")
            // console.log("content",content);

            mergeContentModel.show(content,{iconParams:{dontTouch:true}})
            mergeContentModel.node.off(cc.Node.EventType.TOUCH_END);
            mergeContentModel.node.on(cc.Node.EventType.TOUCH_END, function(e) {
                self.selectButton.active = true
                self.unSelectContent()
                self.selectContent(this)
                e.stopPropagation()
            }.bind(mergeContentModel), this)
        });
    }
    unSelectContent() {
        this.mergeContentModelArr.forEach((mergeContentModel, index) => {
            let bg1 = GameKit.ControllerTable.GetNode(mergeContentModel.node, "bg1")
            let bg2 = GameKit.ControllerTable.GetNode(mergeContentModel.node, "bg2")
            let gou = GameKit.ControllerTable.GetNode(mergeContentModel.node, "gou")
            bg1.active = true;
            bg2.active = false;
            gou.active = false;
        });
    }
    selectContent(mergeContentModel) {
        this.pickPieceData = mergeContentModel.content.Id() + "_-1_-1"
        let bg1 = GameKit.ControllerTable.GetNode(mergeContentModel.node, "bg1")
        let bg2 = GameKit.ControllerTable.GetNode(mergeContentModel.node, "bg2")
        let gou = GameKit.ControllerTable.GetNode(mergeContentModel.node, "gou")
        bg1.active = false;
        bg2.active = true;
        gou.active = true;

        console.log("点击了物品",this.pickPieceData);
    }
    onClickThreeToOne() {
        GamePlay.instance.mergeRoot.mergeLevelNode.updateMergeMapEvent({ actionType: "func", cellKey: this.cellKey, funcAction: "pick", pickPieceData: this.pickPieceData, targetCellKey: this.targetCellKey,forceSend: true }).then((res) => {
            console.log("onClickThreeToOne", res);

            GameKit.PlayerPrefs.DeleteKey(this.instanceId)
            this.closeAnim()
        });
    }


    /** 点击事件：close */
    event_close() {
        this.pickPieceData = null;
        this.closeAnim()
    }


}
