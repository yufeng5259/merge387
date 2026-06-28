import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

const C = {
    BASE_PATH: "Card",      // set-icon的基础path
    SET_ICON_FILENAME: "set-icon",
}
@ccclass('CardSubjectSet')
export class CardSubjectSet extends Component {
    @property(Label)
    public labelSubject = null;

    event_info_subject () {
        // UIRoot.instance.openChildWindow(this.subjectMeta.Panel(),{meta:this.subjectMeta}) 
    }

    createActivityCard (all_set_meta: any) {
        // this.subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard) 
        // this.leftTime=0 
        // let arr=this.subjectMeta.Param().sets 
        // this.activity_id_list=arr 
        // this.all_set_meta=all_set_meta 
        // let cont=this.node.getChildByName("content") 
        // for (let index = 0; index < 3; index++) { 
            // let node=cont.children[index] 
            // if(index<arr.length){ 
                // node.active=true 
                // let id=arr[index] 
                // let sp_icon = GameKit.ControllerTable.GetNode(node, "icon").getComponent(cc.Sprite) 
                // let label_set_name = GameKit.ControllerTable.GetNode(node, "label-set-name").getComponent(cc.Label) 
                // let pb = GameKit.ControllerTable.GetNode(node, "progress").getComponent(cc.ProgressBar) 
                // let label_pb = GameKit.ControllerTable.GetNode(node, "label-progress").getComponent(cc.Label) 
                // let completed = GameKit.ControllerTable.GetNode(node, "label-completed") 
                // let sp_lock = GameKit.ControllerTable.GetNode(node, "lock").getComponent(cc.Sprite) 
                // let label_lock = GameKit.ControllerTable.GetNode(node, "label-lock").getComponent(cc.Label) 
                // let meta = this.all_set_meta[id] 
                // label_set_name.string = meta.Name() 
                // cce.loadRes(`${C.BASE_PATH}/${meta.Res()}/${C.SET_ICON_FILENAME}`, cc.SpriteFrame, (err, res) => { 
                    // if (!err && sp_icon) { 
                        // sp_icon.spriteFrame = res 
                    // } 
                // }) 
                // let count = 0 
                // for (let i = 1; i <= 9; i++) { 
                    // count += Game.SUserCard.HaveCard(id * 100 + i) ? 1 : 0 
                // } 
                // pb.progress = count / 9 
                // label_pb.string = `${count} / 9` 
                // label_lock.string = String.format(GameKit.i18n.t("CardAllSetWindowLock"), meta.MinVillage()) 
                // let flag_lock = Game.SUserVillage.MapId() < meta.MinVillage() && count <= 0 // true表示被lock 
                // sp_lock.node.active = flag_lock 
                // node.getComponent(cc.Button).interactable = !flag_lock 
                // require("SpriteGray").SetGray(sp_icon, flag_lock) 
                // sp_icon.node.color = flag_lock ? cc.color(50, 50, 50) : cc.Color.WHITE 
                // label_set_name.node.active = !flag_lock 
                // node.on("click", () => { 
                    // UIRoot.instance.openChildWindow("CardSingleSetWindow", { single_set_meta: meta }) 
                // }) 
            // }else{ 
                // node.active=false 
            // } 
        // } 
    }

    update_compelete () {
        // let cont=this.node.getChildByName("content") 
        // let len=this.activity_id_list.length 
        // for (let index = 0; index < len ;index++) { 
            // let node=cont.children[index] 
            // if(node.active){ 
                // let id=this.activity_id_list[index] 
                // let meta = this.all_set_meta[id] 
                // let pb = GameKit.ControllerTable.GetNode(node, "progress").getComponent(cc.ProgressBar) 
                // let completed = GameKit.ControllerTable.GetNode(node, "label-completed") 
                // let is_get_reward = Game.SUserCard.HasgotSetsReward(meta.Id()) 
                // is_get_reward=pb.progress===1 
                // pb.node.active = !is_get_reward 
                // completed.active = is_get_reward 
            // } 
        // } 
    }

    update () {
        // this.updateTime(this.labelSubject) 
    }

    updateTime (labelTimer: any) {
        // if (this.leftTime != null) { 
            // let currentTime = GameKit.TimeUtil.getCurrentTime() 
            // this.leftTime = this.subjectMeta.EndTime() - currentTime 
            // labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true) 
            // if (this.leftTime <= 0) { 
                // this.leftTime = null 
            // } 
        // } 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// const C = {
//     BASE_PATH: "Card",      // set-icon的基础path
//     SET_ICON_FILENAME: "set-icon",
// }
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         
//         labelSubject:cc.Label,
//     },
//     event_info_subject(){
//         UIRoot.instance.openChildWindow(this.subjectMeta.Panel(),{meta:this.subjectMeta})
//     },
//     createActivityCard(all_set_meta){
//         this.subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)
//         this.leftTime=0
//         let arr=this.subjectMeta.Param().sets
//         this.activity_id_list=arr
//         this.all_set_meta=all_set_meta
//         let cont=this.node.getChildByName("content")
//         for (let index = 0; index < 3; index++) {
//             let node=cont.children[index]
//             
//             if(index<arr.length){
//                 node.active=true
// 
//                 let id=arr[index]
//                  // 获取子节点
//                 let sp_icon = GameKit.ControllerTable.GetNode(node, "icon").getComponent(cc.Sprite)
//                 let label_set_name = GameKit.ControllerTable.GetNode(node, "label-set-name").getComponent(cc.Label)
//                 let pb = GameKit.ControllerTable.GetNode(node, "progress").getComponent(cc.ProgressBar)
//                 let label_pb = GameKit.ControllerTable.GetNode(node, "label-progress").getComponent(cc.Label)
//                 let completed = GameKit.ControllerTable.GetNode(node, "label-completed")
//                 let sp_lock = GameKit.ControllerTable.GetNode(node, "lock").getComponent(cc.Sprite)
//                 let label_lock = GameKit.ControllerTable.GetNode(node, "label-lock").getComponent(cc.Label)
//                 // 获取单个数据
//                 let meta = this.all_set_meta[id]
//                 // 根据数据修改子节点样式
//                 //label_set_name.string = id.toString() + "." + meta.Name()
//                 label_set_name.string = meta.Name()
//                 cce.loadRes(`${C.BASE_PATH}/${meta.Res()}/${C.SET_ICON_FILENAME}`, cc.SpriteFrame, (err, res) => {
//                     if (!err && sp_icon) {
//                         sp_icon.spriteFrame = res
//                     }
//                 })
//                 let count = 0
//                 for (let i = 1; i <= 9; i++) {
//                     count += Game.SUserCard.HaveCard(id * 100 + i) ? 1 : 0
//                 }
//                 pb.progress = count / 9
//                 label_pb.string = `${count} / 9`
//                 // 判定是否为lock
//                 label_lock.string = String.format(GameKit.i18n.t("CardAllSetWindowLock"), meta.MinVillage())
//                 let flag_lock = Game.SUserVillage.MapId() < meta.MinVillage() && count <= 0 // true表示被lock
//                 sp_lock.node.active = flag_lock
//                 node.getComponent(cc.Button).interactable = !flag_lock
//                 require("SpriteGray").SetGray(sp_icon, flag_lock)
//                 sp_icon.node.color = flag_lock ? cc.color(50, 50, 50) : cc.Color.WHITE
//                 label_set_name.node.active = !flag_lock
//                 // 点击事件跳转
//                 node.on("click", () => {
//                     UIRoot.instance.openChildWindow("CardSingleSetWindow", { single_set_meta: meta })
//                 })
// 
//             }else{
//                 node.active=false
//             }
//             
//         }
// 
//     },
//     update_compelete(){
//         let cont=this.node.getChildByName("content")
//         let len=this.activity_id_list.length
//         for (let index = 0; index < len ;index++) {
//             let node=cont.children[index]
//             if(node.active){
//                 let id=this.activity_id_list[index]
//                 let meta = this.all_set_meta[id]
//                 let pb = GameKit.ControllerTable.GetNode(node, "progress").getComponent(cc.ProgressBar)
//                 let completed = GameKit.ControllerTable.GetNode(node, "label-completed")
//                 let is_get_reward = Game.SUserCard.HasgotSetsReward(meta.Id())
//                 is_get_reward=pb.progress===1
//                 // console.log(pb.progress,'sss');
//                 pb.node.active = !is_get_reward
//                 completed.active = is_get_reward
// 
//                 // console.log('xxx',id);
//             }
//             
//         }
//     },
//     update(){
//         this.updateTime(this.labelSubject)
//     },
// 
//     updateTime(labelTimer){
//         if (this.leftTime != null) {
// 
//             let currentTime = GameKit.TimeUtil.getCurrentTime()
// 
//             this.leftTime = this.subjectMeta.EndTime() - currentTime
// 
//             labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true)
// 
//             if (this.leftTime <= 0) {
//                 this.leftTime = null
//             }
//         }
//     }
// });
