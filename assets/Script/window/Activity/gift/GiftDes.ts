import { _decorator, Component, SpriteFrame, Node, Sprite } from 'cc';
import { ContentModel } from '../../../game/items/ContentModel';
const { ccclass, property } = _decorator;

@ccclass('GiftDes')
export class GiftDes extends Component {
    @property([SpriteFrame])
    public bgsSpriteFrames = [];
    @property(Node)
    public reward_layout = null;
    @property(Node)
    public item = null;
    @property(Sprite)
    public bg = null;

    show (reward: any) {
        // let contents=[] 
        // this.reward_layout.destroyAllChildren() 
        // if(reward.ContentId()==Game.UserItems.ToolType.Muchui){ 
            // contents=Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward) 
        // } 
        // this.bg.spriteFrame=this.bgsSpriteFrames[reward.ContentId()-1] 
        // for (let i = 0; i < contents.length; i++) { 
            // let content = Game.Content.FromContent(contents[i]) 
            // let newItem = cc.instantiate(this.item) 
            // newItem.parent = this.reward_layout 
            // newItem.y=0 
            // newItem.active = true 
            // newItem.getComponent(ContentModel).show(content) 
        // } 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// const ContentModel = require("ContentModel")
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         bgsSpriteFrames:[cc.SpriteFrame],
//         reward_layout:cc.Node,
//         item:cc.Node,
//         bg:cc.Sprite
//     },
// 
//     show(reward){
//         let contents=[]
//         this.reward_layout.destroyAllChildren()
//         if(reward.ContentId()==Game.UserItems.ToolType.Muchui){
//             contents=Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward)
// 
//         }
//         this.bg.spriteFrame=this.bgsSpriteFrames[reward.ContentId()-1]
//         // let re= reward
//         // let contents = showParams.contents
//         // contents = Game.Content.Merge(contents)
//         // this.oldCoin = showParams.oldCoin
//         // this.noChest = showParams.noChest
// 
//         // this._icons = []
//         // if(contents.length==0){
// 
//         // }else{
// 
//         // }
//         for (let i = 0; i < contents.length; i++) {
//             let content = Game.Content.FromContent(contents[i])
//             let newItem = cc.instantiate(this.item)
//             newItem.parent = this.reward_layout
//             newItem.y=0
//             // newItem.x = poses[count][i]
//             newItem.active = true
//             newItem.getComponent(ContentModel).show(content)
//             // let newIcon = GameKit.ControllerTable.GetComponent(newItem, "icon", cc.Sprite)
//             // let newCount = GameKit.ControllerTable.GetComponent(newItem, "count", cc.Label)
//             // content.Icon(newIcon, () => {
//             //     require("fixedSizeRatio").fitByHeight(newIcon, 125)
//             // })
//             // newCount.string = GameKit.StringUtil.formatNumber(content.Count())
//         }
// 
//         
// 
//     },
// });
