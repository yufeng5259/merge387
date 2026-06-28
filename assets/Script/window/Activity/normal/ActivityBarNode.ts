import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActivityBarNode')
export class ActivityBarNode extends Component {
    @property(Node)
    public barNode = null;

    onEnable () {
        // this.node.children[0].getComponent(cc.Mask).enabled = true 
    }

    playAmin (meta: any, data: any, callback: any) {
        // if (this.playing) return 
        // this.oldScore = data; 
        // this.setMeta(meta); 
        // this.time = 0.5; 
        // this.playing = true 
        // this.delay = 1.5; 
        // this.disx = -220; 
        // this.scheduleOnce(function() { 
            // this.barNode.node.runAction(cc.sequence( 
                // cc.moveBy(this.time, this.disx, 0).easing(cce.CCEaseTypes.GetEasing(cce.CCEaseTypes.Types.easeInOut)), 
                // cc.delayTime(0.9), 
                // cc.callFunc(() => { 
                    // let oldConnets =  this.getContents(); 
                    // this.showRewards = false 
                    // if(oldConnets.length>0){ 
                        // var showR = () => { 
                            // let rewards = oldConnets.shift() 
                            // UIRoot.instance.openChildWindow("GetRewardWindow", { 
                                // contents: rewards, 
                                // showCallback: (wnd) => { 
                                    // wnd.addOnCloseFunc(() => { 
                                        // let rs = Game.Content.Merge(rewards) 
                                        // rs.forEach(fReward => { 
                                            // if (fReward.Type() == Game.Content.Types.Coin) { 
                                                // if (GamePlay.instance.slotNode.activityRoot.oldCoin != null && GameMainWindow.instance) { 
                                                    // GameMainWindow.instance.playAddCoinAnim()  
                                                    // GameMainWindow.instance.scheduleOnce(() => { 
                                                        // GameMainWindow.instance.userinfo.changeCoin(GamePlay.instance.slotNode.activityRoot.oldCoin, GamePlay.instance.slotNode.activityRoot.oldCoin + fReward.Count(), 0.8) 
                                                        // GamePlay.instance.slotNode.activityRoot.oldCoin += fReward.Count() 
                                                    // }, 1) 
                                                // } 
                                            // } else if (fReward.Type() == Game.Content.Types.Ap) { 
                                                // if (GamePlay.instance.slotNode.activityRoot.oldAp != null && GamePlay.instance.slotNode) { 
                                                    // let slot = GamePlay.instance.slotNode 
                                                    // slot.isSpining = true 
                                                    // slot.getComponent("UserInfoModel").playApAnim(function(){ 
                                                        // slot.makeIdle() 
                                                    // }) 
                                                    // slot.showSpinAddNumAnim(fReward.Count()) 
                                                    // GamePlay.instance.slotNode.activityRoot.oldAp += fReward.Count() 
                                                    // let animTime = 1.5 
                                                    // this.scheduleOnce(() => { 
                                                        // if (GamePlay.instance) GamePlay.instance.slotNode.userinfo.stopApAt(GamePlay.instance.slotNode.activityRoot.oldAp) 
                                                    // }, animTime) 
                                                // } 
                                            // } 
                                        // }) 
                                        // if(oldConnets.length>0){ 
                                            // showR(); 
                                        // } else { 
                                            // this.playing = false 
                                            // if (callback) callback() 
                                        // } 
                                    // }) 
                                // } 
                            // }) 
                        // } 
                        // showR(); 
                        // this.showRewards = true 
                    // } 
                // }), 
                // cc.delayTime(0.6), 
                // cc.moveBy(this.time, -(this.disx-10), 0).easing(cce.CCEaseTypes.GetEasing(cce.CCEaseTypes.Types.easeInOut)), 
                // cc.callFunc(() => { 
                    // if (!this.showRewards) { 
                        // this.playing = false 
                        // if (callback) callback() 
                    // } 
                // }), 
            // )) 
        // }.bind(this), 0.2) 
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

    setMeta (meta: any) {
        // this.init(); 
        // this.meta = meta; 
        // this.rankData = Game.SUserActivity.GetSymbolRankData(); 
        // this.userData = Game.SUser; 
        // this.lastScore = this.getMyRankScore(); 
        // this.currentID = this.meta.id||1; 
        // this.nextId = this.currentID+1; 
        // this.currentData = this.getsRankMetaBySocre(); 
        // this.level = this.currentData?this.currentData.rank:1; 
        // this.currentGiftCount = this.currentData?this.currentData.id:0 
        // this.rankList = this.getMetasByRank(this.level); 
        // this.maxTotal = (this.rankList[this.rankList.length-1]?this.rankList[this.rankList.length-1].score:1); 
        // let symbolId = this.meta.Param().symbolId || this.meta.Param().showSymbolId 
        // let spSymbol = GameKit.ControllerTable.GetComponent(this.node, "activityIcon",cc.Sprite) 
        // let sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString() + "_s") 
        // let probar = GameKit.ControllerTable.GetComponent(this.node, "progressBar",cc.ProgressBar) 
        // let tNumCount = GameKit.ControllerTable.GetComponent(this.node, "numCount",cc.Label) 
        // spSymbol.spriteFrame = sp  
        // require("fixedSizeRatio").fitByHeight(spSymbol) 
        // let maxS = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, (this.rankList[0].id-1)<=0?1:(this.rankList[0].id-1)); 
        // if((this.rankList[0].id-1)<=0){ 
            // maxS = 0; 
        // } 
        // let maxScore = this.rankList[this.rankList.length-1].score-maxS 
        // let per = Math.max(0, (this.oldScore-maxS)/maxScore) 
        // tNumCount.string = this.lastScore+"/"+maxScore 
        // probar.progress = per; 
        // this.scheduleOnce(() => { 
            // probar.node.runAction(cce.updateValue(0.7, (_dt, p) => { 
                // let per = Math.max(0, (this.oldScore + (this.lastScore - this.oldScore) * p - maxS)/maxScore) 
                // probar.progress = per; 
            // })) 
        // }, 0.7) 
        // for (let index = 0; index < this.rankList.length; index++) { 
            // const element = this.rankList[index]; 
            // let dis = element.score-maxS 
            // let tx = 22 + 188*(dis/maxScore); 
            // let rNode = GameKit.ControllerTable.GetNode(this.node, "rewardNode"+(index+1),cc.Node) 
            // let rSp = rNode.getChildByName("Sprite - coin").getComponent(cc.Sprite); 
            // let indexStr = element.id; 
            // if(element.id>10){ 
                // indexStr = 5+((element.id-10)%5==0?5:(element.id-10)%5) 
            // } 
            // if(this.lastScore>=element.score){ 
                // indexStr = indexStr+"_open" 
            // } 
            // rSp.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.PresentPack, indexStr) 
            // rNode.x = tx; 
        // } 
    }

    getsRankMetaBySocre () {
        // for (let index = 0; index < this.data.length; index++) { 
            // const element = this.data[index]; 
            // if(this.getMyRankScore()<=element.score){ 
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

    getsRankMetaByOldSocre () {
        // for (let index = 0; index < this.data.length; index++) { 
            // const element = this.data[index]; 
            // if(this.oldScore<=element.score){ 
                // return element; 
            // } 
        // } 
        // return null; 
    }

    getContents () {
        // let rewards = []; 
        // let oldData = this.getsRankMetaByOldSocre(); 
        // let currtentS = this.getMyRankScore(); 
        // if(oldData==null){ 
            // return rewards; 
        // }; 
        // for (let index = oldData.id-1; index < this.data.length; index++) { 
            // const element = this.data[index]; 
            // if(currtentS>=element.score){ 
                // rewards.push(element.content); 
            // } 
        // } 
        // return rewards; 
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         barNode:cc.Node,
//     },
//     onEnable() {
//         
//         this.node.children[0].getComponent(cc.Mask).enabled = true
//     },
// 
//     playAmin(meta,data, callback){
//         if (this.playing) return
//         this.oldScore = data;
//         this.setMeta(meta);
//         this.time = 0.5;
//         this.playing = true
//         this.delay = 1.5;
//         this.disx = -220;
//         this.scheduleOnce(function() {
//             this.barNode.node.runAction(cc.sequence(
//                 cc.moveBy(this.time, this.disx, 0).easing(cce.CCEaseTypes.GetEasing(cce.CCEaseTypes.Types.easeInOut)),
//                 cc.delayTime(0.9),
//                 cc.callFunc(() => {
//                     let oldConnets =  this.getContents();
//                     this.showRewards = false
//                     if(oldConnets.length>0){
//                         //Game.Content.Merge(oldConnets)
//                         var showR = () => {
//                             let rewards = oldConnets.shift()
//                             UIRoot.instance.openChildWindow("GetRewardWindow", {
//                                 contents: rewards,
//                                 showCallback: (wnd) => {
//                                     //console.log("show",oldConnets.length);
//                                     wnd.addOnCloseFunc(() => {
//                                         let rs = Game.Content.Merge(rewards)
//                                         rs.forEach(fReward => {
//                                             if (fReward.Type() == Game.Content.Types.Coin) {
//                                                 if (GamePlay.instance.slotNode.activityRoot.oldCoin != null && GameMainWindow.instance) {
//                                                     GameMainWindow.instance.playAddCoinAnim() 
//                                                     GameMainWindow.instance.scheduleOnce(() => {
//                                                         GameMainWindow.instance.userinfo.changeCoin(GamePlay.instance.slotNode.activityRoot.oldCoin, GamePlay.instance.slotNode.activityRoot.oldCoin + fReward.Count(), 0.8)
//                                                         GamePlay.instance.slotNode.activityRoot.oldCoin += fReward.Count()
//                                                     }, 1)
//                                                 }
//                                             } else if (fReward.Type() == Game.Content.Types.Ap) {
//                                                 if (GamePlay.instance.slotNode.activityRoot.oldAp != null && GamePlay.instance.slotNode) {
//                                                     let slot = GamePlay.instance.slotNode
//                                                     slot.isSpining = true
//                                                     slot.getComponent("UserInfoModel").playApAnim(function(){
//                                                         slot.makeIdle()
//                                                     })
//                                                     slot.showSpinAddNumAnim(fReward.Count())
//                                                     GamePlay.instance.slotNode.activityRoot.oldAp += fReward.Count()
//                                                     let animTime = 1.5
//                                                     this.scheduleOnce(() => {
//                                                         if (GamePlay.instance) GamePlay.instance.slotNode.userinfo.stopApAt(GamePlay.instance.slotNode.activityRoot.oldAp)
//                                                     }, animTime)
//                                                 }
//                                             }
//                                         })
// 
//                                         //console.log("add",oldConnets.length);
//                                         if(oldConnets.length>0){
//                                             showR();
//                                         } else {
//                                             this.playing = false
//                                             if (callback) callback()
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                         showR();
//                         this.showRewards = true
//                     }
//                 }),
//                 cc.delayTime(0.6),
//                 cc.moveBy(this.time, -(this.disx-10), 0).easing(cce.CCEaseTypes.GetEasing(cce.CCEaseTypes.Types.easeInOut)),
//                 cc.callFunc(() => {
//                     if (!this.showRewards) {
//                         this.playing = false
//                         if (callback) callback()
//                     }
//                 }),
//             ))
//         }.bind(this), 0.2)
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
//     setMeta(meta){
//         this.init();
//         this.meta = meta;
//         this.rankData = Game.SUserActivity.GetSymbolRankData();
//         this.userData = Game.SUser;
//         this.lastScore = this.getMyRankScore();
//         this.currentID = this.meta.id||1;
//         this.nextId = this.currentID+1;
//         this.currentData = this.getsRankMetaBySocre();
//         this.level = this.currentData?this.currentData.rank:1;
//         this.currentGiftCount = this.currentData?this.currentData.id:0
//         this.rankList = this.getMetasByRank(this.level);
//         this.maxTotal = (this.rankList[this.rankList.length-1]?this.rankList[this.rankList.length-1].score:1);
// 
//         let symbolId = this.meta.Param().symbolId || this.meta.Param().showSymbolId
//         let spSymbol = GameKit.ControllerTable.GetComponent(this.node, "activityIcon",cc.Sprite)
//         let sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString() + "_s")
//         let probar = GameKit.ControllerTable.GetComponent(this.node, "progressBar",cc.ProgressBar)
//         let tNumCount = GameKit.ControllerTable.GetComponent(this.node, "numCount",cc.Label)
//         
//         spSymbol.spriteFrame = sp 
//         require("fixedSizeRatio").fitByHeight(spSymbol)
//         let maxS = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, (this.rankList[0].id-1)<=0?1:(this.rankList[0].id-1));
//         if((this.rankList[0].id-1)<=0){
//             maxS = 0;
//         }
// 
//         let maxScore = this.rankList[this.rankList.length-1].score-maxS
//         let per = Math.max(0, (this.oldScore-maxS)/maxScore)
//        
//         tNumCount.string = this.lastScore+"/"+maxScore
//         probar.progress = per;
//         this.scheduleOnce(() => {
//             probar.node.runAction(cce.updateValue(0.7, (_dt, p) => {
//                 let per = Math.max(0, (this.oldScore + (this.lastScore - this.oldScore) * p - maxS)/maxScore)
//                 probar.progress = per;
//             }))
//         }, 0.7)
// 
//         for (let index = 0; index < this.rankList.length; index++) {
//             const element = this.rankList[index];
//             let dis = element.score-maxS
//             let tx = 22 + 188*(dis/maxScore);
//             let rNode = GameKit.ControllerTable.GetNode(this.node, "rewardNode"+(index+1),cc.Node)
//             let rSp = rNode.getChildByName("Sprite - coin").getComponent(cc.Sprite);
//             let indexStr = element.id;
//             if(element.id>10){
//                 indexStr = 5+((element.id-10)%5==0?5:(element.id-10)%5)
//                 
//             }
//             if(this.lastScore>=element.score){
//                 indexStr = indexStr+"_open"
//             }
//             rSp.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.PresentPack, indexStr)
//             //require("fixedSizeRatio").fitByHeight(rSp)
//             rNode.x = tx;
//         }
//     },
//     //根据分数返回我的rankdata
//     getsRankMetaBySocre(){
//         for (let index = 0; index < this.data.length; index++) {
//             const element = this.data[index];
//             if(this.getMyRankScore()<=element.score){
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
//     //根据分数返回rankdata
//     getsRankMetaByOldSocre(){
//         for (let index = 0; index < this.data.length; index++) {
//             const element = this.data[index];
//             if(this.oldScore<=element.score){
//                 return element;
//             }
//         }
//         return null;
//     },
//     //返回奖励数组
//     getContents(){
//         let rewards = [];
//         let oldData = this.getsRankMetaByOldSocre();
//         let currtentS = this.getMyRankScore();
//         if(oldData==null){
//             return rewards;
//         };
//         for (let index = oldData.id-1; index < this.data.length; index++) {
//             const element = this.data[index];
//             if(currtentS>=element.score){
//                 rewards.push(element.content);
//             }
//         }
//         return rewards;
//     },
// 
// });
