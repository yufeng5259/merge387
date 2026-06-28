import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChapterTalkNode')
export class ChapterTalkNode extends Component {
    @property(Node)
    public msgLbl = null;

    start () {
        // this.init(); 
    }

    init () {
        // this.msgLbl = GameKit.ControllerTable.GetNode(this.node, "msgLbl").getComponent(cc.Label); 
        // this.nameLbl = GameKit.ControllerTable.GetNode(this.node, "nameLbl").getComponent(cc.Label); 
        // this.userNode =GameKit.ControllerTable.GetNode(this.node, "userNode"); 
        // this.bgsp =GameKit.ControllerTable.GetNode(this.node, "bgNode"); 
        // this.userNode.removeAllChildren(); 
        // this.colorList = ["#D55482","#349DE7","#7D6FE3"] 
    }

    showInfo (data: any) {
        // this.init(); 
        // this.storyMeta = data; 
        // this.eid = this.storyMeta.EId(); 
        // this.roleMeta = this.storyMeta.GetRoleMeata(this.eid); 
        // this.bgsp.getChildByName("bg0").node.active = false; 
        // this.bgsp.getChildByName("bg1").node.active = false; 
        // this.bgsp.getChildByName("bg2").node.active = false; 
        // this.bgsp.getChildByName("bg"+this.roleMeta.Sex()).node.active = true; 
        // this.msgLbl.color =  this.colorList[this.roleMeta.Sex()]; 
        // this.nameLbl.string = GameKit.i18n.sel(this.roleMeta.Name()); 
        // this.msgLbl.string = GameKit.i18n.sel(this.storyMeta.StoryContent()); 
        // this.loadUrlPrefab(); 
    }

    loadUrlPrefab () {
        // let self = this; 
        // let resName='res/Story/role/'+this.roleMeta.ResName(); 
        // cce.loadRes(resName, cc.Prefab, function (err, vPre) { 
            // if (err || vPre == null) { 
                // if (CC_DEV) { 
                    // global.loadEditorTemp = true 
                    // return 
                // } 
                // DialogWindow.Show(String.format(GameKit.i18n.t("loadResError"), villageName), function() { 
                // }.bind(this)) 
                // return; 
            // } 
            // this.scheduleOnce(function() { 
                // let roleNode = cc.instantiate(vPre); 
                // roleNode.parent = self.userNode; 
                // let StoryRole=roleNode.getComponent("StoryRole"); 
                // roleNode.x=roleNode.y=0; 
                // StoryRole.showInfo(self.storyMeta); 
            // },0.1) 
        // }.bind(this)); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         msgLbl:cc.Node,
//     },
// 
// 
//     start () {
//         this.init();
//     },
//     init(){
//         this.msgLbl = GameKit.ControllerTable.GetNode(this.node, "msgLbl").getComponent(cc.Label);
//         this.nameLbl = GameKit.ControllerTable.GetNode(this.node, "nameLbl").getComponent(cc.Label);
//         this.userNode =GameKit.ControllerTable.GetNode(this.node, "userNode");
//         this.bgsp =GameKit.ControllerTable.GetNode(this.node, "bgNode");
//         this.userNode.removeAllChildren();
//         this.colorList = ["#D55482","#349DE7","#7D6FE3"]
//     },
// 
//     showInfo(data){
//         this.init();
//         this.storyMeta = data;
//         this.eid = this.storyMeta.EId();
//         this.roleMeta = this.storyMeta.GetRoleMeata(this.eid);
//         this.bgsp.getChildByName("bg0").node.active = false;
//         this.bgsp.getChildByName("bg1").node.active = false;
//         this.bgsp.getChildByName("bg2").node.active = false;
//         this.bgsp.getChildByName("bg"+this.roleMeta.Sex()).node.active = true;
//         this.msgLbl.color =  this.colorList[this.roleMeta.Sex()];
//         this.nameLbl.string = GameKit.i18n.sel(this.roleMeta.Name());
//         this.msgLbl.string = GameKit.i18n.sel(this.storyMeta.StoryContent());
//         this.loadUrlPrefab();
// 
//     },
//     loadUrlPrefab(){
//         let self = this;
//         let resName='res/Story/role/'+this.roleMeta.ResName();
//         cce.loadRes(resName, cc.Prefab, function (err, vPre) {
//             
//             if (err || vPre == null) {
//                 if (CC_DEV) {
//                     global.loadEditorTemp = true
//                     return
//                 }
//                 DialogWindow.Show(String.format(GameKit.i18n.t("loadResError"), villageName), function() {
// 
//                 }.bind(this))
//                 return;
//             }
//             this.scheduleOnce(function() {
//                 let roleNode = cc.instantiate(vPre);
//                 roleNode.parent = self.userNode;
//                 let StoryRole=roleNode.getComponent("StoryRole");
//                 roleNode.x=roleNode.y=0;
//                 StoryRole.showInfo(self.storyMeta);
//             },0.1)
//             
//         }.bind(this));
//     },
// });
