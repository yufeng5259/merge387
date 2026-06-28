import { _decorator, Component } from 'cc';
import { SpriteItem } from '../../GameKit/ui/SpriteItem';
const { ccclass } = _decorator;

@ccclass('CardSubjectBgImage')
export class CardSubjectBgImage extends Component {

    start () {
        // let subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard) 
        // if(!subjectMeta)return 
        // this.node.getComponent(cc.Sprite).spriteFrame=CommonAssets.instance.cardLimitSkinAssets.cardBg 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// let SpriteItem=require('SpriteItem')
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         
//     },
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     // onLoad () {},
// 
//     start () {
//         let subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)
//         if(!subjectMeta)return
// 
//         this.node.getComponent(cc.Sprite).spriteFrame=CommonAssets.instance.cardLimitSkinAssets.cardBg
//     },
// });
