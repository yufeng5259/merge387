import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('PassPortBadge')
export class PassPortBadge extends Component {

    onLoad () {
        // this.UpdateActiveButton() 
        // GameKit.GameEvent.RegisterEvent("passortCollect", "Game", function(data) { 
            // this.node.active=data 
        // }.bind(this)) 
    }

    onDestroy () {
        // GameKit.GameEvent.UnRegisterEvent("passortCollect", "Game") 
    }

    UpdateActiveButton () {
        // this.activityData = Game.SUserActivity.GetPassportCollectFlagData() 
        // if(!this.activityData)return 
        // this.curLv=Math.max(this.activityData.freeLevel,this.activityData.buyLevel) 
        // this.unReceive_freeLevels=[] 
        // for (let index = 0; index <= this.curLv; index++) { 
            // if(!this.activityData.received_free.contains(index)){ 
                // this.unReceive_freeLevels.push(index) 
            // } 
        // } 
        // this.unReceive_buyLevels=[] 
        // for (let index = 0; index <= this.curLv; index++) { 
            // if(!this.activityData.received_passport.contains(index)){ 
                // this.unReceive_buyLevels.push(index) 
            // } 
        // } 
        // this.node.active=(this.unReceive_freeLevels.length>0||this.unReceive_buyLevels.length>0) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         
//     },
// 
//     onLoad () {
//         this.UpdateActiveButton()
//         GameKit.GameEvent.RegisterEvent("passortCollect", "Game", function(data) {
//             this.node.active=data
//         }.bind(this))
//     },
//     onDestroy(){
//         GameKit.GameEvent.UnRegisterEvent("passortCollect", "Game")
//     },
// 
//     UpdateActiveButton(){
//         this.activityData = Game.SUserActivity.GetPassportCollectFlagData()
//         if(!this.activityData)return
//         this.curLv=Math.max(this.activityData.freeLevel,this.activityData.buyLevel)
//         this.unReceive_freeLevels=[]
//         for (let index = 0; index <= this.curLv; index++) {
//             if(!this.activityData.received_free.contains(index)){
//                 this.unReceive_freeLevels.push(index)
//             }
//         }
//         this.unReceive_buyLevels=[]
//         for (let index = 0; index <= this.curLv; index++) {
//             if(!this.activityData.received_passport.contains(index)){
//                 this.unReceive_buyLevels.push(index)
//             }
//         }
//         
//         this.node.active=(this.unReceive_freeLevels.length>0||this.unReceive_buyLevels.length>0)
//     },
// 
// });
