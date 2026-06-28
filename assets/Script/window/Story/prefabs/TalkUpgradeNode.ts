import { _decorator, Component, Label, Button, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TalkUpgradeNode')
export class TalkUpgradeNode extends Component {
    @property(Label)
    public costLbl = null;
    @property(Button)
    public btnUp = null;
    @property(Node)
    public infoNode = null;

    start () {
        // this.init(); 
    }

    init () {
    }

    showWindow (data: any, l: any) {
        // this.meta = data; 
        // this.level = l; 
        // this.init(); 
        // this.costLbl.string=Game.SUser.Coin()+"/"+this.meta.Price(this.level); 
        // this.btnUp.interactable = this.meta.isCanUp(l) 
        // this.btnUp.enableAutoGrayEffect = !this.meta.isCanUp(l) 
        // this.meta.isCanUp(l); 
    }

    onlevelUp () {
        // let self = this; 
        // let req = SR.SRVillage.levelUpElement(this.meta.MapId(),this.meta.BuildID()) 
        // req.SetCallBack(function(res) { 
            // upvillage(); 
        // }) 
        // req.Send() 
        // var upvillage = function() { 
            // var reqV = SR.SRVillage.getUserVillage(); 
            // reqV.SetCallBack(function(res) { 
                // Game.SUserMap.initMapData(); 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MapElementLevelUp, { 
                // buildID: self.meta.BuildID(),level:Number(this.level+1) 
            // }) 
            // }) 
            // reqV.Send() 
        // } 
    }

    onShowInfo () {
        // this.infoNode.node.active = !this.infoNode.node.active; 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         costLbl:cc.Label,
//         btnUp:cc.Button,
//         infoNode:cc.Node,
//     },
// 
// 
//     start () {
//         this.init();
//     },
//     init(){
//         
//     },
// 
//     showWindow(data,l){
//         this.meta = data;
//         
//         this.level = l;
//         this.init();
//         this.costLbl.string=Game.SUser.Coin()+"/"+this.meta.Price(this.level);
//         this.btnUp.interactable = this.meta.isCanUp(l)
//         this.btnUp.enableAutoGrayEffect = !this.meta.isCanUp(l)
//         this.meta.isCanUp(l);
//     },
//     onlevelUp(){
//         let self = this;
//         let req = SR.SRVillage.levelUpElement(this.meta.MapId(),this.meta.BuildID())
//         req.SetCallBack(function(res) {
//             upvillage();
//         })
//         req.Send()
//         var upvillage = function() {
//             var reqV = SR.SRVillage.getUserVillage();
//             reqV.SetCallBack(function(res) {
//                 Game.SUserMap.initMapData();
//             // 触发升级事件
//             GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MapElementLevelUp, {
//                 buildID: self.meta.BuildID(),level:Number(this.level+1)
//             })
//             
//             })
//             reqV.Send()
//         }
//     },
//     onShowInfo(){
//         this.infoNode.node.active = !this.infoNode.node.active;
//     }
// });
