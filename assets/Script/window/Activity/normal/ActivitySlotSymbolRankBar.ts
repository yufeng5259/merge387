import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;

const spXstart = 30
const spXlength = 430
const w2WidthBase = 782
const w2WidthAdd = 308
function getCTComponentSafe(root, key, type) {
//    let n = GameKit.ControllerTable.GetNode(root, key, Node)
    return n ? n.getComponent(type) : null
}
@ccclass('ActivitySlotSymbolRankBar')
export class ActivitySlotSymbolRankBar extends Component {

    start () {
    }

    init () {
        // this.giftCountArr=[2,3,3,3,3]; 
        // this.currentID = 1; 
        // this.nextId = 2; 
        // this.level = 1; 
        // this.data=[]; 
        // let index = 1 
        // while (true) { 
            // let rewards = Game.Content.FromStrings(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPointReward, index)); 
            // let score = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, index) 
            // if(score != null){ 
                 // let a = (index)<2?1:Math.ceil((index-2)/3+1); 
                 // this.data.push({id:index,isOpen:false,rank:a,content:rewards,score:score}); 
            // } else { 
                // break 
            // } 
            // index++ 
        // } 
    }

    setMeta (meta: any, data: any) {
        // this.init(); 
        // this.meta = meta; 
        // this.rankData = data; 
        // this.userData = Game.SUser; 
        // this.lastScore = this.getMyRankScore(); 
        // this.currentData = this.getsRankMetaBySocre(); 
        // this.w1 =  GameKit.ControllerTable.GetNode(this.node, "w1",cc.Node) 
        // this.w2 =  GameKit.ControllerTable.GetNode(this.node, "w2",cc.Node) 
        // this.sm =  GameKit.ControllerTable.GetNode(this.node, "sm",cc.Node) 
        // if (this.sm) this.sm.active = false; 
        // this.onCloseReward(); 
        // this.level = this.currentData?this.currentData.rank:1; 
        // this.currentGiftCount = this.currentData?(this.currentData.id-1):0; 
        // this.rankList = this.getMetasByRank(this.level); 
        // this.maxTotal = this.rankList[this.rankList.length-1]?(this.rankList[this.rankList.length-1].score-this.rankList[0].score):1; 
        // let symbolId = 1 
        // if (this.meta) symbolId = this.meta.Param().symbolId || this.meta.Param().showSymbolId 
        // else symbolId = this.rankData.symbolId 
        // let spSymbol = getCTComponentSafe(this.node, "activityIcon", cc.Sprite) 
        // let sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString()) 
        // let probar = getCTComponentSafe(this.node, "progressBar", cc.ProgressBar) 
        // let tNumCount = getCTComponentSafe(this.node, "numCount", cc.Label) 
        // let giftCount = getCTComponentSafe(this.node, "giftCount", cc.Label) 
        // let barNode = GameKit.ControllerTable.GetNode(this.node, "barFrame",cc.Node) 
        // let maxB = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint,this.currentData.id+1) 
        // this.currentGiftCount = maxB?this.currentGiftCount:this.data.length; 
        // if (giftCount) giftCount.string = this.currentGiftCount+"/"+this.data.length 
        // if (tNumCount) tNumCount.string = ""//this.lastScore+"/"+this.maxTotal 
        // if (spSymbol) spSymbol.spriteFrame = sp  
        // if (spSymbol && sp) require("fixedSizeRatio").fitSpriteInRange2(spSymbol,cc.v2(70,70),cc.v2(sp.getRect().width,sp.getRect().height)) 
        // if (barNode) { 
            // barNode.node.off(cc.Node.EventType.TOUCH_END,this.onClickShowReward1,this); 
            // barNode.node.on(cc.Node.EventType.TOUCH_END,this.onClickShowReward1,this); 
            // barNode.data = this.data[this.data.length-1]; 
        // } 
        // let pre0 = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, (this.rankList[0].id-1)<=0?1:(this.rankList[0].id-1)); 
        // if((this.rankList[0].id-1)<=0){ 
            // pre0 = 0; 
        // } 
        // let maxScore = this.rankList[this.rankList.length-1].score-pre0 
        // if (probar) probar.progress = (this.lastScore-pre0)/maxScore 
        // for (let index = 0; index < this.rankList.length; index++) { 
            // const element = this.rankList[index]; 
            // let dis = element.score-pre0 
            // let tx = spXstart + spXlength*(dis/maxScore); 
            // let rNode = GameKit.ControllerTable.GetNode(this.node, "rewardNode"+(index+1),cc.Node) 
            // if (!rNode) continue 
            // rNode.data = element; 
            // rNode.isOpen = false; 
            // let coinNode = rNode.getChildByName("Sprite - coin") 
            // let rSp = coinNode ? coinNode.getComponent(cc.Sprite) : null; 
            // let indexStr = element.id; 
            // if(element.id>10){ 
                // indexStr = 5+((element.id-10)%5==0?5:(element.id-10)%5) 
            // } 
            // if(this.lastScore>=element.score){ 
                // indexStr = indexStr+"_open" 
                // element.isOpen = true; 
            // } 
            // if (rSp) rSp.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.PresentPack, indexStr) 
            // rNode.x = tx; 
            // rNode.node.off(cc.Node.EventType.TOUCH_END,this.onClickShowReward,this) 
            // rNode.node.on(cc.Node.EventType.TOUCH_END,this.onClickShowReward,this) 
        // } 
        // let w2SpSymbol = getCTComponentSafe(this.node, "w2SpSymbol", cc.Sprite); 
        // if (w2SpSymbol) { 
            // w2SpSymbol.spriteFrame = sp 
            // require("fixedSizeRatio").fitByHeight(w2SpSymbol) 
        // } 
    }

    onClickShowReward1 (event: any) {
        // if (!this.w1 || !this.sm) return 
        // if (!this.w1init) { 
            // let w1item = GameKit.ControllerTable.GetNode(this.node,"w1Item") 
            // if (!w1item) return 
            // let rewards = event.target.data.content 
            // for (let i = 0; i < rewards.length; i++) { 
                // let n1 = cc.instantiate(w1item) 
                // n1.parent = w1item.parent 
                // n1.active = true 
                // n1.getComponent("ContentModel").show(rewards[i]) 
            // } 
            // this.w1init = true 
        // } 
        // this.showRNode(this.w1) 
        // this.sm.active = true; 
    }

    onClickShowReward (event: any) {
        // if (!this.w2 || !this.sm) return 
        // let cArr = event.target.data.content; 
        // let w2item1 = GameKit.ControllerTable.GetNode(this.node,"w2Item1"); 
        // let itemNode = GameKit.ControllerTable.GetNode(this.node,"itemNode"); 
        // let w2bg = GameKit.ControllerTable.GetNode(this.node,"w2bg"); 
        // if (!w2item1 || !itemNode || !w2bg) return 
        // w2item1.active = false; 
        // itemNode.destroyAllChildren() 
        // for (let index = 0; index < cArr.length; index++) { 
            // const element = cArr[index]; 
            // let newItem = cc.instantiate(w2item1) 
            // newItem.parent = itemNode 
            // newItem.y = 0; 
            // newItem.active = true 
            // let newItemS = newItem.node.getComponent("ContentModel"); 
            // newItemS.show(element) 
        // } 
        // w2bg.width = w2WidthBase + w2WidthAdd * Math.max(0, cArr.length - 2) 
        // let needLbl = getCTComponentSafe(this.node, "needLbl", cc.Label) 
        // if (needLbl) needLbl.string = event.target.data.score; 
        // this.w2.x = event.target.x; 
        // this.showRNode(this.w2) 
        // this.sm.active = true; 
    }

    getsRankMetaBySocre () {
        // let ele; 
        // for (let index = 0; index < this.data.length; index++) { 
            // const element = this.data[index]; 
            // if(this.getMyRankScore()<element.score){ 
                // return element; 
            // } 
        // } 
        // return this.data[this.data.length-1]; 
    }

    getMyRankScore () {
        // let myData = this.rankData.rank[this.userData.data.userId] 
        // return myData?myData.score:0; 
    }

    getMetaById (id: any) {
        // let ele; 
        // this.data.forEach(element => { 
            // if(element.id==id){ 
                // ele = element; 
            // } 
        // }); 
        // return ele; 
    }

    getMetasByRank (rank: any) {
        // let dataList=[]; 
        // for (let index = 0; index < this.data.length; index++) { 
            // const element = this.data[index]; 
            // if(element.rank==rank){ 
                // dataList.push(element) 
            // } 
        // } 
        // return dataList; 
    }

    onCloseReward () {
        // if(this.w1 && this.w1.active){ 
            // this.hideRNode(this.w1); 
            // if (this.sm) this.sm.active = false; 
        // } 
        // if(this.w2 && this.w2.active){ 
            // this.hideRNode(this.w2); 
            // if (this.sm) this.sm.active = false; 
        // } 
    }

    showRNode (rNode: any) {
        // if (!rNode || !rNode.node) return 
        // rNode.node.active = true 
        // rNode.node.scale = 0.001 
        // rNode.node.runAction(cc.scaleTo(0.2,1,1)) 
        // rNode.active = true 
    }

    hideRNode (rNode: any) {
        // if (!rNode || !rNode.node) return 
        // rNode.node.runAction(cc.sequence(cc.scaleTo(0.2,0.001,0.001), cc.callFunc(() => { 
            // rNode.node.active = false 
            // rNode.active = false 
        // }))) 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// const spXstart = 30
// const spXlength = 430
// const w2WidthBase = 782
// const w2WidthAdd = 308
// function getCTComponentSafe(root, key, type) {
//     let n = GameKit.ControllerTable.GetNode(root, key, cc.Node)
//     return n ? n.getComponent(type) : null
// }
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//     },
//     // LIFE-CYCLE CALLBACKS:
// 
//     // onLoad () {},
// 
//     start () {
//        
//     },
//     init(){
//         this.giftCountArr=[2,3,3,3,3];
//         this.currentID = 1;
//         this.nextId = 2;
//         this.level = 1;
//         this.data=[];
//         let index = 1
//         while (true) {
//             let rewards = Game.Content.FromStrings(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPointReward, index));
//             let score = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, index)
//             if(score != null){
//                  let a = (index)<2?1:Math.ceil((index-2)/3+1);
//                  this.data.push({id:index,isOpen:false,rank:a,content:rewards,score:score});
//             } else {
//                 break
//             }
//             index++
//         }
//     },
//     // update (dt) {},
//     //设置数据
//     setMeta(meta,data){
//         this.init();
//         this.meta = meta;
//         this.rankData = data;
//         this.userData = Game.SUser;
//         this.lastScore = this.getMyRankScore();
//         //this.rankData.lastScore
//         // console.log(this.getsRankMetaBySocre());
//         //this.currentID = this.meta.id||1;
//         //this.nextId = this.currentID+1;
//         this.currentData = this.getsRankMetaBySocre();
//         this.w1 =  GameKit.ControllerTable.GetNode(this.node, "w1",cc.Node)
//         this.w2 =  GameKit.ControllerTable.GetNode(this.node, "w2",cc.Node)
//         this.sm =  GameKit.ControllerTable.GetNode(this.node, "sm",cc.Node)
//         if (this.sm) this.sm.active = false;
//         this.onCloseReward();
//         this.level = this.currentData?this.currentData.rank:1;
//         this.currentGiftCount = this.currentData?(this.currentData.id-1):0;
// 
//         this.rankList = this.getMetasByRank(this.level);
//         this.maxTotal = this.rankList[this.rankList.length-1]?(this.rankList[this.rankList.length-1].score-this.rankList[0].score):1;
// 
//         let symbolId = 1
//         if (this.meta) symbolId = this.meta.Param().symbolId || this.meta.Param().showSymbolId
//         else symbolId = this.rankData.symbolId
//         let spSymbol = getCTComponentSafe(this.node, "activityIcon", cc.Sprite)
//         let sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString())
//         let probar = getCTComponentSafe(this.node, "progressBar", cc.ProgressBar)
//         let tNumCount = getCTComponentSafe(this.node, "numCount", cc.Label)
//         let giftCount = getCTComponentSafe(this.node, "giftCount", cc.Label)
//         let barNode = GameKit.ControllerTable.GetNode(this.node, "barFrame",cc.Node)
//         let maxB = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint,this.currentData.id+1)
//         this.currentGiftCount = maxB?this.currentGiftCount:this.data.length;
//         if (giftCount) giftCount.string = this.currentGiftCount+"/"+this.data.length
//         if (tNumCount) tNumCount.string = ""//this.lastScore+"/"+this.maxTotal
//         if (spSymbol) spSymbol.spriteFrame = sp 
//         // require("fixedSizeRatio").fitByHeight(spSymbol)
//         if (spSymbol && sp) require("fixedSizeRatio").fitSpriteInRange2(spSymbol,cc.v2(70,70),cc.v2(sp.getRect().width,sp.getRect().height))
//         if (barNode) {
//             barNode.node.off(cc.Node.EventType.TOUCH_END,this.onClickShowReward1,this);
//             barNode.node.on(cc.Node.EventType.TOUCH_END,this.onClickShowReward1,this);
//             barNode.data = this.data[this.data.length-1];
//         }
//         let pre0 = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, (this.rankList[0].id-1)<=0?1:(this.rankList[0].id-1));
//         if((this.rankList[0].id-1)<=0){
//             pre0 = 0;
//         }
// 
//         let maxScore = this.rankList[this.rankList.length-1].score-pre0
//         if (probar) probar.progress = (this.lastScore-pre0)/maxScore
//         for (let index = 0; index < this.rankList.length; index++) {
//             const element = this.rankList[index];
//             let dis = element.score-pre0
//             let tx = spXstart + spXlength*(dis/maxScore);
//             let rNode = GameKit.ControllerTable.GetNode(this.node, "rewardNode"+(index+1),cc.Node)
//             if (!rNode) continue
//             // let cModel = rNode.getComponent("ContentModel");
//             rNode.data = element;
//             rNode.isOpen = false;
//             // cModel.show(element.content);
//             let coinNode = rNode.getChildByName("Sprite - coin")
//             let rSp = coinNode ? coinNode.getComponent(cc.Sprite) : null;
//             let indexStr = element.id;
//             if(element.id>10){
//                 indexStr = 5+((element.id-10)%5==0?5:(element.id-10)%5)
//                 
//             }
//             if(this.lastScore>=element.score){
//                 indexStr = indexStr+"_open"
//                 element.isOpen = true;
//             }
//             if (rSp) rSp.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.PresentPack, indexStr)
//             //require("fixedSizeRatio").fitByHeight(rSp)
//             rNode.x = tx;
//             rNode.node.off(cc.Node.EventType.TOUCH_END,this.onClickShowReward,this)
//             rNode.node.on(cc.Node.EventType.TOUCH_END,this.onClickShowReward,this)
//         }
//     
//         let w2SpSymbol = getCTComponentSafe(this.node, "w2SpSymbol", cc.Sprite);
//         if (w2SpSymbol) {
//             w2SpSymbol.spriteFrame = sp
//             require("fixedSizeRatio").fitByHeight(w2SpSymbol)
//         }
//        
//     },
//     onClickShowReward1(event){
//         if (!this.w1 || !this.sm) return
//         // console.log("click"+event.target.data);
//         if (!this.w1init) {
//             let w1item = GameKit.ControllerTable.GetNode(this.node,"w1Item")
//             if (!w1item) return
//             let rewards = event.target.data.content
//             for (let i = 0; i < rewards.length; i++) {
//                 let n1 = cc.instantiate(w1item)
//                 n1.parent = w1item.parent
//                 n1.active = true
//                 n1.getComponent("ContentModel").show(rewards[i])
//             }
//             this.w1init = true
//         }
// 
//         this.showRNode(this.w1)
//         this.sm.active = true;
// 
//     },
//     onClickShowReward(event){
//         if (!this.w2 || !this.sm) return
//         // console.log("click"+event.target.data);
//         let cArr = event.target.data.content;
//         let w2item1 = GameKit.ControllerTable.GetNode(this.node,"w2Item1");
//         let itemNode = GameKit.ControllerTable.GetNode(this.node,"itemNode");
//         let w2bg = GameKit.ControllerTable.GetNode(this.node,"w2bg");
//         if (!w2item1 || !itemNode || !w2bg) return
//         w2item1.active = false;
//         itemNode.destroyAllChildren()
//         for (let index = 0; index < cArr.length; index++) {
//             const element = cArr[index];
//             let newItem = cc.instantiate(w2item1)
//             newItem.parent = itemNode
//             //newItem.x = index*newItem.width;
//             newItem.y = 0;
//             newItem.active = true
//             let newItemS = newItem.node.getComponent("ContentModel");
//             newItemS.show(element)
//         }
//         w2bg.width = w2WidthBase + w2WidthAdd * Math.max(0, cArr.length - 2)
//         //itemNode.width = cArr.length*w2item1.width;
//         //itemNode.y = 2;
//         //itemNode.x = 40+(itemNode.parent.width-(itemNode.width))/2;
//         let needLbl = getCTComponentSafe(this.node, "needLbl", cc.Label)
//         if (needLbl) needLbl.string = event.target.data.score;
//         this.w2.x = event.target.x;
//         this.showRNode(this.w2)
//         this.sm.active = true;
// 
//     },
//     //根据分数返回rankdata
//     getsRankMetaBySocre(){
//         let ele;
//         for (let index = 0; index < this.data.length; index++) {
//             const element = this.data[index];
//             if(this.getMyRankScore()<element.score){
//                 // console.log(element);
//                 return element;
//             }
//         }
//         return this.data[this.data.length-1];
//     },
//     getMyRankScore(){
//         let myData = this.rankData.rank[this.userData.data.userId]
//         return myData?myData.score:0;
//     },
//     //根据索引id获取数据{id：1，rank：1，content：{2=0=50}}
//     getMetaById(id){
//         let ele;
//         this.data.forEach(element => {
//             if(element.id==id){
//                 ele = element;
//             }
//         });
//         return ele;
//     },
//     //根据rank获取数组
//     getMetasByRank(rank){
//         let dataList=[];
//         for (let index = 0; index < this.data.length; index++) {
//             const element = this.data[index];
//             if(element.rank==rank){
//                 dataList.push(element)
//             }
//         }
//         return dataList;
//     },
//     onCloseReward(){
// 
//         if(this.w1 && this.w1.active){
//             this.hideRNode(this.w1);
//             if (this.sm) this.sm.active = false;
//         }
//         if(this.w2 && this.w2.active){
//             this.hideRNode(this.w2);
//             if (this.sm) this.sm.active = false;
//         }
//     },
//     showRNode(rNode) {
//         if (!rNode || !rNode.node) return
//         rNode.node.active = true
//         rNode.node.scale = 0.001
//         rNode.node.runAction(cc.scaleTo(0.2,1,1))
//         rNode.active = true
//     },
//     hideRNode(rNode) {
//         if (!rNode || !rNode.node) return
//         rNode.node.runAction(cc.sequence(cc.scaleTo(0.2,0.001,0.001), cc.callFunc(() => {
//             rNode.node.active = false
//             rNode.active = false
//         })))
//     },
// });
