// // fengyong-2019-4-1

import { _decorator, CCBoolean, Enum, Component } from 'cc';
const { ccclass, property, menu } = _decorator;

var DoType = Enum({
    All: 0,
})
// /**
//  * 一个批量导入build-spf的工具
//  * - [用法] 写入build-name和5个load-name,导入1-5的sp/sp_dam/sp_shadow
//  * - [要求] 命名格式为 name1, name1_dam, name1_shadow,部分公用组件不导入
//  * - [注意] 成功后请手动删除脚本组件
//  */

@ccclass('TLoadBuildingPointList')
@menu("Editor-Tools/TLoadBuildingPointList")
export class TLoadBuildingPointList extends Component {
    @property({ type:DoType })
    private doType = DoType.All
    @property({ type: CCBoolean })
    private get do() { return false }
    private set do(v: boolean) {
        // CC_EDITOR && this.load_Build()
    }
    private load_Build() {
//        //获得levelNode
        // let bn:cc.Node = this.node;
        // Editor.log(`load:bn`,bn.childrenCount)
        // let buildlength = bn.childrenCount+1;
        // new Promise((res, rej) => {
        // let loadResNum = 0;
        // let allResNum = 0;
        // let txt = {}
        // if (this.doType == DoType.All) {
        // allResNum++
        // for (let index = 1; index < buildlength; index++) {
        // const element:cc.Node = bn.getChildByName(index+"");
        // txt[index]={x:element.x,y:element.y,index:index}
        // }
        // Editor.log("输出=xy",txt)
        // loadResNum++
        // }else{
        // Editor.log("type error")
        // }

        // if (loadResNum == allResNum) {
        // Editor.log(`load:over`)
        // res()
        // }
        // })
    }
}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// // fengyong-2019-4-1
// 
// const { ccclass, property, menu } = cc._decorator;
// 
// var DoType = cc.Enum({
//     All: 0,
// })
// 
// /**
//  * 一个批量导入build-spf的工具
//  * - [用法] 写入build-name和5个load-name,导入1-5的sp/sp_dam/sp_shadow
//  * - [要求] 命名格式为 name1, name1_dam, name1_shadow,部分公用组件不导入
//  * - [注意] 成功后请手动删除脚本组件
//  */
// @ccclass
// @menu("Editor-Tools/TLoadBuildingPointList")
// export class TLoadBuildingPointList extends cc.Component {
//     @property({ type:DoType })
//     private doType = DoType.All
// 
//     @property()
//     private get do() { return false }
//     private set do(v: boolean) {
//         CC_EDITOR && this.load_Build()
//     }
// 
//     private load_Build() {
//         //获得levelNode
//         let bn:cc.Node = this.node;
//         Editor.log(`load:bn`,bn.childrenCount)
//         let buildlength = bn.childrenCount+1;
//         new Promise((res, rej) => {
//             let loadResNum = 0;
//             let allResNum = 0;
//             let txt = {}
//             if (this.doType == DoType.All) {
//                 allResNum++
//                 for (let index = 1; index < buildlength; index++) {
//                     const element:cc.Node = bn.getChildByName(index+"");
//                     txt[index]={x:element.x,y:element.y,index:index}
//                 }
//                 Editor.log("输出=xy",txt)
//                 loadResNum++
//             }else{
//                 Editor.log("type error")
//             }
//             
//             if (loadResNum == allResNum) {
//                 Editor.log(`load:over`)
//                 res()
//             }
//         })
//     }
// 
// }
