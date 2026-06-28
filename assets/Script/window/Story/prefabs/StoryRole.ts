import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StoryRole')
export class StoryRole extends Component {
    @property(Node)
    public levelNode = null;
    @property(Label)
    public nameLab = null;

    start () {
    }

    init () {
        // for (let i = 1; i < 6; i++) { 
            // const element = this.levelNode.node.getChildByName(i+""); 
            // element.node.active = false; 
            // if(this.roleMeta.EType()==i){ 
                // element.node.active = true; 
            // } 
        // } 
        // this.nameLab.string = GameKit.i18n.sel(this.roleMeta.Name()); 
    }

    showInfo (data: any) {
        // this.meta = data; 
        // this.roleMeta = this.meta.GetRoleMeata(this.meta.EId()) 
        // this.init(); 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         levelNode:cc.Node,
//         nameLab:cc.Label
//     },
// 
// 
//     start () {
//     },
//     init(){
//         //5中状态
//         for (let i = 1; i < 6; i++) {
//             const element = this.levelNode.node.getChildByName(i+"");
//             element.node.active = false;
//             if(this.roleMeta.EType()==i){
//                 element.node.active = true;
//             }
//         }
//         this.nameLab.string = GameKit.i18n.sel(this.roleMeta.Name());
//     },
// 
//     showInfo(data){
//         //this.storyMeta
//         this.meta = data;
//         this.roleMeta = this.meta.GetRoleMeata(this.meta.EId())
//         this.init();
//         
//     }
// });
