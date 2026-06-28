import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('CardLimitSubjectOpenWindowTester')
@menu('Editor-Tools/ActivityGameShowTester')
@executeInEditMode
export class CardLimitSubjectOpenWindowTester extends Component {
    @property([Node])
    public nodes = [];
    @property(Sprite)
    public spBg = null;
    @property
    public readStr = '';
    @property
    public reset;
    @property
    public ImageURL = '';
    @property
    public pack = '';
    @property
    public sets = '';
    @property
    public checkUpdate;
    @property
    public newStr = '';

    readStrShow () {
        // this.metaParam={} 
        // if(this.readStr!=''){ 
            // this.metaParam=JSON.parse(this.readStr) 
        // } 
        // this.newStr="" 
        // this.nodes.forEach(x => { 
            // CCTools.SetNodeByParam(x, this.metaParam[x.name]) 
        // }) 
        // if(this.metaParam.pack){ 
            // this.pack=JSON.stringify(this.metaParam.pack) 
        // } 
        // if(this.metaParam.sets){ 
            // this.sets=JSON.stringify(this.metaParam.sets) 
        // } 
    }

    checkAndUpdate () {
        // this.showBg() 
        // this.getParams() 
    }

    showBg () {
        // let url = this.ImageURL 
        // if(url==='')return 
        // let url1=`db://assets/resources/res/Activity/images/${url}.png/${url}` 
        // let uuid=Editor.remote.assetdb.urlToUuid(url1) 
        // cce.loaderLoad({type: "uuid", uuid: uuid}, function (err, v) { 
            // if (err) { 
                // cc.error(err.message || err); 
                // return; 
            // } 
            // this.spBg.spriteFrame=v 
        // }.bind(this)); 
    }

    getParams () {
        // let dt={} 
        // if(this.pack===''){ 
            // Editor.log('礼包不能为空') 
            // return 
        // } 
        // dt.pack=JSON.parse(this.pack) 
        // if(this.sets===''){ 
            // Editor.log('卡组不能为空') 
            // return 
        // } 
        // dt.sets=JSON.parse(this.sets) 
        // dt.ui={} 
        // this.nodes.forEach(x => { 
            // if(!dt.ui[x.name]){ 
                // dt.ui[x.name]={} 
            // } 
            // this.GetNodeParam(x,dt.ui[x.name]) 
        // }) 
        // this.newStr=JSON.stringify(dt) 
    }

    GetNodeParam (node: any, obj: any) {
        // obj.x=node.x 
        // obj.y=node.y 
        // if(node.getComponent(cc.RichText)){ 
            // obj.width=node.width 
            // obj.height=node.height 
            // if(!obj.label)obj.label={} 
            // obj.label.fontSize=node.getComponent(cc.RichText).fontSize 
            // obj.label.maxWidth=node.getComponent(cc.RichText).maxWidth 
            // obj.label.string=node.getComponent(cc.RichText).string 
        // } 
        // if(node.getComponent(cc.LabelOutline)){ 
            // let color=node.getComponent(cc.LabelOutline).color 
            // obj.outline={color:[color.getR(),color.getG(),color.getB()],width:node.getComponent(cc.LabelOutline).width} 
        // } 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
//     editor: {
//         menu:"Editor-Tools/ActivityGameShowTester",
//         executeInEditMode: true,
//     }, 
//     properties: {
//         nodes: [cc.Node],
//         spBg:cc.Sprite,
//         readStr: {
//             default:"",
//             tooltip:"初始数据"
//         },
//         reset: {
//             get () {
//                 return false;
//             },
//             set (value) {
//                 CC_EDITOR && this.readStrShow()
//             },
//             tooltip:"显示初始数据"
//         },
//         ImageURL:{
//             default:"",
//             tooltip:"背景图"
//         },
//         pack:{
//             default:"",
//             tooltip:"礼包"
//         },
//         sets:{
//             default:"",
//             tooltip:"开启的卡组"
//         },
//         checkUpdate:{
//             get(){
//                 return false
//             },
//             set (value){
//                 CC_EDITOR&&this.checkAndUpdate()
//             },
//             tooltip:"更新数据"
//         },
//         newStr:"",
//     },
// 
//     readStrShow(){
//         // Editor.log(this.readStr);
//         this.metaParam={}
//         if(this.readStr!=''){
//             this.metaParam=JSON.parse(this.readStr)
//         }
//         
//         this.newStr=""
// 
//         this.nodes.forEach(x => {
//             CCTools.SetNodeByParam(x, this.metaParam[x.name])
//         })
// 
//         if(this.metaParam.pack){
//             this.pack=JSON.stringify(this.metaParam.pack)
//         }
// 
//         if(this.metaParam.sets){
//             this.sets=JSON.stringify(this.metaParam.sets)
//         }
//     },
//     checkAndUpdate(){
//         this.showBg()
// 
//         this.getParams()
//     },
//     showBg(){
//         let url = this.ImageURL
//         if(url==='')return
//         let url1=`db://assets/resources/res/Activity/images/${url}.png/${url}`
//         let uuid=Editor.remote.assetdb.urlToUuid(url1)
//         cce.loaderLoad({type: "uuid", uuid: uuid}, function (err, v) {
//             if (err) {
//                 cc.error(err.message || err);
//                 return;
//             }
//             this.spBg.spriteFrame=v
//         }.bind(this));
//     },
//     getParams(){
//         let dt={}
//         if(this.pack===''){
//             Editor.log('礼包不能为空')
//             return
//         }
//         dt.pack=JSON.parse(this.pack)
//         if(this.sets===''){
//             Editor.log('卡组不能为空')
//             return
//         }
//         dt.sets=JSON.parse(this.sets)
// 
//         dt.ui={}
//         this.nodes.forEach(x => {
//             if(!dt.ui[x.name]){
//                 dt.ui[x.name]={}
//             }
//             this.GetNodeParam(x,dt.ui[x.name])
//         })
//         this.newStr=JSON.stringify(dt)
//     },
//     GetNodeParam(node,obj){
//         obj.x=node.x
//         obj.y=node.y
//         if(node.getComponent(cc.RichText)){
//             obj.width=node.width
//             obj.height=node.height
//             if(!obj.label)obj.label={}
//             obj.label.fontSize=node.getComponent(cc.RichText).fontSize
//             obj.label.maxWidth=node.getComponent(cc.RichText).maxWidth
//             obj.label.string=node.getComponent(cc.RichText).string
//         }
//         if(node.getComponent(cc.LabelOutline)){
//             let color=node.getComponent(cc.LabelOutline).color
//             obj.outline={color:[color.getR(),color.getG(),color.getB()],width:node.getComponent(cc.LabelOutline).width}
//         }
//     }
// });
