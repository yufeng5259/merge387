import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('FlyToSkySkin')
export class FlyToSkySkin extends Component {

    onLoad () {
        // this.meta=Game.ActivityManager.GetMeta(Game.SUser.data.flytoskyActivityId); 
        // let badgeName = this.meta.Icon() 
        // if(badgeName=="flytoSky"){ 
            // this.node.getChildByName("bg").getChildByName("bd_red_ribbon").active=true 
            // this.node.getChildByName("bg").getChildByName("cover_dream").active=false 
            // this.node.getChildByName("bg").getChildByName("bd_red_ribbon_dream").active=false 
            // return 
        // }else if(badgeName=="dreamgarden"){ 
            // this.node.getChildByName("bg").getChildByName("bd_red_ribbon").active=false 
            // this.node.getChildByName("bg").getChildByName("cover_dream").active=true 
            // this.node.getChildByName("bg").getChildByName("bd_red_ribbon_dream").active=true 
            // return 
        // } 
        // this.node.getChildByName("bg").getChildByName("bd_red_ribbon").active=true 
        // this.node.getChildByName("bg").getChildByName("cover_dream").active=false 
        // this.node.getChildByName("bg").getChildByName("bd_red_ribbon_dream").active=false 
    }

    start () {
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// // Learn cc.Class:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
// //  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//     },
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     onLoad () {
//         this.meta=Game.ActivityManager.GetMeta(Game.SUser.data.flytoskyActivityId);
//         let badgeName = this.meta.Icon()
//         if(badgeName=="flytoSky"){
//             this.node.getChildByName("bg").getChildByName("bd_red_ribbon").active=true
//             this.node.getChildByName("bg").getChildByName("cover_dream").active=false
//             this.node.getChildByName("bg").getChildByName("bd_red_ribbon_dream").active=false
//             return
//         }else if(badgeName=="dreamgarden"){
//             this.node.getChildByName("bg").getChildByName("bd_red_ribbon").active=false
//             this.node.getChildByName("bg").getChildByName("cover_dream").active=true
//             this.node.getChildByName("bg").getChildByName("bd_red_ribbon_dream").active=true
//             return
//         }
// 
//         this.node.getChildByName("bg").getChildByName("bd_red_ribbon").active=true
//         this.node.getChildByName("bg").getChildByName("cover_dream").active=false
//         this.node.getChildByName("bg").getChildByName("bd_red_ribbon_dream").active=false
//         // console.log(this.meta);
//     },
// 
//     start () {
// 
//     },
// 
//     // update (dt) {},
// });
