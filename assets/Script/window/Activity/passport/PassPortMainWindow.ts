import { _decorator, Button, Component, instantiate, Label, Node, ParticleSystem, ProgressBar, UITransform, Vec3, view } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';
import PassPortDesWindow from './PassPortDesWindow';

const { ccclass, property } = _decorator;

const shopId = 1401;

@ccclass('PassPortMainWindow')
export default class PassPortMainWindow extends UIWindow {
    public static windowPath = 'Activity/passport/PassPortMainWindow';
    public static pocker: Record<string, string> = {
        PassPortMainWindow: 'Activity/passport/pocker/PassPortMainWindow',
        PassPortDesWindow: 'Activity/passport/pocker/PassPortDesWindow',
        PassPortHelpWindow: 'Activity/passport/pocker/PassPortHelpWindow',
    };

    @property(Label)
    labelLevel1: Label | null = null;

    @property(ProgressBar)
    quest_progress: ProgressBar | null = null;

    @property(Button)
    buyLevelButton: Button | null = null;

    @property(Node)
    hoverBg: Node | null = null;

    @property(Node)
    hoverLine: Node | null = null;

    @property(Label)
    labelActive: Label | null = null;

    @property(Node)
    maxRewardItem: Node | null = null;

    @property(Button)
    buyPassportButton: Button | null = null;

    @property(Node)
    reward_item: Node | null = null;

    @property(Component)
    svt_reward: any = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Node)
    animFlagFly: Node | null = null;

    activityMeta: any = null;
    activityId: any = null;
    activityData: any = null;
    curLv = 0;
    leftTime: number | null = null;
    content: any = null;
    unReceive_freeLevels: any[] = [];
    unReceive_buyLevels: any[] = [];

    private getTransform(node: Node | null) {
        return node ? node.getComponent(UITransform) : null;
    }

    private getNodeHeight(node: Node | null) {
        return this.getTransform(node)?.height || 0;
    }

    private setNodeHeight(node: Node | null, height: number) {
        const transform = node ? node.getComponent(UITransform) || node.addComponent(UITransform) : null;
        if (transform) transform.setContentSize(transform.width, height);
    }

    private convertToWorldSpaceAR(node: Node, localPosition: Vec3) {
        const transform = this.getTransform(node);
        return transform ? transform.convertToWorldSpaceAR(localPosition) : localPosition;
    }

    private convertToNodeSpaceAR(node: Node, worldPosition: Vec3) {
        const transform = this.getTransform(node);
        return transform ? transform.convertToNodeSpaceAR(worldPosition) : worldPosition;
    }

    onShow(showParams: any) {
        this.activityMeta=showParams.meta

        this.activityId = this.activityMeta.Id()

        const visibleSize = view.getVisibleSize()
        const hoverBgTransform = this.hoverBg.getComponent(UITransform) || this.hoverBg.addComponent(UITransform)
        hoverBgTransform.setContentSize(visibleSize.width, visibleSize.height)
        this.hoverBg.setPosition(0, this.hoverBg.position.y, this.hoverBg.position.z)
        
        this.UpdateBar()


        this.quest_progress.node.on(Node.EventType.TOUCH_END, (e: any) => {
            let parent = this.quest_progress.node.parent
            let dpos = this.convertToNodeSpaceAR(this.node, this.convertToWorldSpaceAR(parent, Vec3.ZERO))
            PassPortDesWindow.Show(this.content, {parent:this.node, pos:dpos, height:this.getNodeHeight(parent)})
            e.stopPropagation()
        
        }, this)

        this.UpdateRewardList()
        this.updateLine()
        this.leftTime = 0
    }
    event_buy_level(){
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("PassPortShopWindow")
    }
    event_buy_passport(){
        if (GamePlay.instance.isBusy()) return
        if(!this.activityData.buyPassport){
            UIRoot.instance.openChildWindow("PassPortTicketWindow")
        }else{
            //涓€閿敹闆?
            this.UpdateData()
            this.UpdateActiveButton()

            let req = SR.SRActivityPassport.collectAllReward(this.unReceive_freeLevels,this.unReceive_buyLevels)
            req.SetCallBack(function(res) {
                this.collectOver()
            }.bind(this))
            req.Send()
        }
    }
    event_open_Info(){

    }
    event_open_Help(){
        UIRoot.instance.openChildWindow("PassPortHelpWindow")
    }
    onClose() {
        
    }

    update(dt?: number) {
        if (this.leftTime != null) {

            let currentTime = GameKit.TimeUtil.getCurrentTime()
            
            this.leftTime = this.activityMeta.EndTime() - currentTime

            this.labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + ": " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true)

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }

        
        this.updateLine()
    }
    updateLine(){
        let ity=this.svt_reward.startPos - (this.curLv+1) * this.svt_reward.itemSize
        let p1=this.convertToWorldSpaceAR(this.svt_reward.itemsContent, new Vec3(0,ity,0))
        let p2=this.convertToNodeSpaceAR(this.hoverLine.parent, p1)
        this.hoverLine.setPosition(this.hoverLine.position.x, p2.y, this.hoverLine.position.z)

        if(!this.checkInView(this.hoverLine)){
            if(this.checkDown(this.hoverLine)){
                this.setNodeHeight(this.hoverBg, 100)
                return
            }else{
                p1=this.convertToWorldSpaceAR(this.svt_reward.itemsContent.parent.parent, Vec3.ZERO)
            }
        }
        let p3=this.convertToNodeSpaceAR(this.hoverBg.parent, Vec3.ZERO)
        this.hoverBg.setPosition(this.hoverBg.position.x, p3.y, this.hoverBg.position.z)
        
        let p4=this.convertToWorldSpaceAR(this.hoverBg.parent, this.hoverBg.position)
        let dist = this.getDistance(p1,p4)
        this.setNodeHeight(this.hoverBg, dist)
    }
    checkInView(n: Node){
        let offset = this.svt_reward.scrollView.getScrollOffset()
        let max = -offset.y
        let min = -offset.y - this.getNodeHeight(this.svt_reward.scrollView.node)

        let p1=this.convertToWorldSpaceAR(n.parent, n.position)
        let p2=this.convertToNodeSpaceAR(this.svt_reward.itemsContent, p1)
        let itemMax=p2.y
        let itemMin = itemMax - 0


        let csize = 2
        if (itemMax > min - csize && itemMin < max + csize) { return true }
        return false
    }
    checkDown(n: Node){
        let offset = this.svt_reward.scrollView.getScrollOffset()
        let max = -offset.y
        let min = -offset.y - this.getNodeHeight(this.svt_reward.scrollView.node)

        let p1=this.convertToWorldSpaceAR(n.parent, n.position)
        let p2=this.convertToNodeSpaceAR(this.svt_reward.itemsContent, p1)
        let itemMax=p2.y
        let itemMin = itemMax - 0


        let csize = 2
        // if (itemMax > min - csize && itemMin < max + csize) { return true }
        return (itemMax < min - csize)
    }
    getDistance(start: Vec3, end: Vec3){
        var pos = new Vec3(start.x - end.x, start.y - end.y, 0);
        var dis = Math.sqrt(pos.x*pos.x + pos.y*pos.y);
        return dis;
    }

    UpdateData() {
        this.activityData = Game.SUserActivity.GetPassportCollectFlagData()
        if (this.activityData.activityId != this.activityId) {
            this.activityData = {activityId:this.activityId,freeLevel:0,buyLevel:-1, exp:0, buyPassport:false, received_passport:[], received_free:[]}
        }
    }

    UpdateBar() {
        this.UpdateData()

        let metas= Meta.MetaManager.GetMetas(Meta.MetaType.PassPort)
        // let freeLevel=this.activityData.freeLevel
        let buyLevel=this.activityData.buyLevel
        let levelExp=this.activityData.exp   

        const ids=Object.keys(metas)
        let lv=0
        let meta=null
        for (let i = 0; i < ids.length; i++) {
            const id=ids[i]
            meta=metas[id]
            if(levelExp>=meta.Exp()){
                levelExp-=meta.Exp()
                // lv=meta.Level()
                lv++
            }
        }
        
        while (levelExp>=meta.Exp()) {
            levelExp-=meta.Exp()
            lv++
        }
        
        ///--------------------------------------------------------杩涘害鏉?
        // console.log(lv,'zzz');
        //褰撳墠鍓╀綑缁忛獙
        let curExp=levelExp
        this.activityData.freeLevel=lv
        let curLv=lv

        let curMeta=Meta.PassPortMeta.GetMetaByLevel(curLv)
        
        let progress=curExp/curMeta.Exp()
        this.quest_progress.node.getChildByName("quest-progress-string").getComponent(Label).string=curExp+"/"+curMeta.Exp()
        this.quest_progress.progress=progress

        this.curLv=Math.max(curLv,buyLevel)
        let nextLv=this.curLv+1
        

        // console.log(parseInt(this.labelLevel1.string),"ssss");
        let fromNum;
        if(!parseInt(this.labelLevel1.string)){
            this.labelLevel1.string=nextLv.toString()
        }else{
            fromNum=parseInt(this.labelLevel1.string)||0
            let result=nextLv
            let rawAti=(result-fromNum)*0.02
            let ati=rawAti < 0.6 ? 0.6 : (rawAti > 1.5 ? 1.5 : rawAti);
            (this.labelLevel1.getComponent("NumAnim") as any).playAnim(fromNum, result, ati)
        }
        //----------------------------------------------------------------

        // this.buyLevelButton.interactable=this.activityData.buyPassport
        if(!this.activityData.buyPassport){
            this.labelActive.string="Activate"
        }else{
            this.labelActive.string="Collect"
            this.UpdateActiveButton()
            this.buyPassportButton.interactable=(this.unReceive_freeLevels.length>0||this.unReceive_buyLevels.length>0)
        }

        ///------------------------------------------------------
        

        //褰撳墠10鍏崇殑濂栧姳
        let next10Lv=this.curLv
        do {
            next10Lv++
        } while ((next10Lv%10)!=0)
            
        meta=Meta.PassPortMeta.GetMetaByLevel(next10Lv)
        let reward_layout_buy=this.maxRewardItem.getChildByName("bkg-light").getChildByName("reward-layout-buy")
        let buyRewards = Meta.ShopRewardsMeta.GetRewardsByPackId(meta.BuyRewardID())
        reward_layout_buy.destroyAllChildren()
        buyRewards.forEach((reward,idx) => {
            let reward_node = instantiate(this.reward_item)
            reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z)
            reward_node.parent = reward_layout_buy
            reward_node.active = true;
            (reward_node.getComponent("ContentModel") as any).show(reward)
        });

        let reward_layout_free=this.maxRewardItem.getChildByName("bkg-light").getChildByName("reward-layout-free")
        let freeRewards = Meta.ShopRewardsMeta.GetRewardsByPackId(meta.FreeRewardID())
        reward_layout_free.destroyAllChildren()
        freeRewards.forEach((reward,idx) => {
            let reward_node = instantiate(this.reward_item)
            reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z)
            reward_node.parent = reward_layout_free
            reward_node.active = true;
            (reward_node.getComponent("ContentModel") as any).show(reward)
        });
        let clctBonus_badge_label=this.maxRewardItem.getChildByName("clctBonus_badge").getChildByName("labelLevel").getComponent(Label)
        clctBonus_badge_label.string=next10Lv.toString()
    }

    UpdateActiveButton(){
        this.unReceive_freeLevels=[]
        for (let index = 0; index <= this.curLv; index++) {
            if(!this.activityData.received_free.contains(index)){
                this.unReceive_freeLevels.push(index)
            }
        }
        this.unReceive_buyLevels=[]
        for (let index = 0; index <= this.curLv; index++) {
            if(!this.activityData.received_passport.contains(index)){
                this.unReceive_buyLevels.push(index)
            }
        }

        GameKit.GameEvent.DispatcherEvent("passortCollect", (this.unReceive_freeLevels.length>0||this.unReceive_buyLevels.length>0))

        // if(GameMainWindow.instance){
        //     const badge=GameMainWindow.instance.SetBadgeNum(this.activityMeta.Id())
        //     if(badge){
        //         let bb=badge.node.getChildByName("badge")
        //         bb.active=(this.unReceive_freeLevels.length>0||this.unReceive_buyLevels.length>0)
        //         console.log(bb.active);
        //     }
        // }
    }
    UpdateRewardList() {
        const metas=Meta.MetaManager.GetMetas(Meta.MetaType.PassPort)
        const ids=Object.keys(metas)

        //瓒呰繃閰嶇疆鏁版嵁鍒欐寜瀹為檯绛夌骇鍘诲鐞?
        let id_list = []
        let i=0
        let id: any=0
        let idx=0
        for (i = 0; i < ids.length; i++) {
            id=ids[i]
            id_list.push(id)
            idx=i
        }
        // console.log(idx,'aaa',ids.length,this.curLv,id);
        let next10Lv=idx
        if(this.curLv>=idx){
            next10Lv=idx
            do {
                next10Lv++
                id_list.push(id)
            } while ((next10Lv%10)!=0||this.curLv>=next10Lv)
        }

        this.svt_reward.setItem(id_list, (index, id, node) => {
            let meta=metas[id]

            let level = index
            // let level = meta.Level()
            let clctBonus_badge=GameKit.ControllerTable.GetNode(node, 'clctBonus_badge')
            let reward_item=GameKit.ControllerTable.GetNode(node, "reward-item")
            reward_item.active=false
            let labelLevel = GameKit.ControllerTable.GetComponent(node, 'labelLevel', Label)
            let labelIcon = GameKit.ControllerTable.GetNode(node, 'labelIcon')
            labelIcon.active=false

            let buyItem=GameKit.ControllerTable.GetNode(node, 'buy_item')
            let buy_icon_state=GameKit.ControllerTable.GetNode(buyItem, 'icon_state')
            let buy_lock=GameKit.ControllerTable.GetNode(buyItem, 'buy-lock')
            let buy_lock_particle=GameKit.ControllerTable.GetComponent(buyItem, 'buy_lock_particle', ParticleSystem)
            let buy_reward_layout=GameKit.ControllerTable.GetNode(buyItem, "reward-layout")
            let buy_quest_btn=GameKit.ControllerTable.GetNode(buyItem, "quest-btn")
            buy_quest_btn.active=false
            buy_icon_state.active=false
            buy_lock.active=true
            buy_lock_particle.node.active=false

            // let lv=Math.max()

            if(level<=this.curLv){
                if(this.activityData.received_passport.contains(level)){
                    //宸茬粡棰嗗彇浜?
                    buy_lock.active=false
                    buy_quest_btn.active=false
                    buy_icon_state.active=true
                }else{
                    //寰呴鍙?
                    if(this.activityData.buyPassport){
                        buy_lock.active=false
                        buy_quest_btn.active=true
                        buy_icon_state.active=false
                    }else{
                        buy_lock.active=true
                        buy_quest_btn.active=false
                        buy_icon_state.active=false
                    }
                }
                
            }else{
                //鏈縺娲?
                buy_lock.active=true
                buy_quest_btn.active=false
                buy_icon_state.active=false
            }
            // if(this.activityData.received_passport.contains(level)){
            //     //宸茬粡棰嗗彇浜?
            //     buy_lock.active=false
            //     buy_quest_btn.active=false
            //     buy_icon_state.active=true
            // }else{
            //     buy_icon_state.active=false
            //     //鏈鍙?

            //     console.log(level,"aaaa",this.activityData.buyLevel);
            //     if(level<=this.activityData.buyLevel){
            //         //寰呴鍙?
            //         buy_lock.active=false
            //         buy_quest_btn.active=true
            //     }else{
            //         //鏈縺娲?
            //         buy_lock.active=true
            //         buy_quest_btn.active=false
            //     }
            // }

            let buyRewards = Meta.ShopRewardsMeta.GetRewardsByPackId(meta.BuyRewardID())
            buy_reward_layout.destroyAllChildren()
            buyRewards.forEach((reward,idx) => {
                let reward_node = instantiate(reward_item)
                reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z)
                reward_node.parent = buy_reward_layout
                reward_node.active = true
                reward_node.getComponent("ContentModel").show(reward)
            });

            buy_quest_btn.targetOff(this)
            buy_quest_btn.on("click", () => {
                if (GamePlay.instance.isBusy()) return
                let req = SR.SRActivityPassport.collectPassportReward(level,meta.BuyRewardID())
                req.SetCallBack(function(res) {
                    this.collectOver()
                }.bind(this))
                req.Send()
            }, this)



            let freeItem=GameKit.ControllerTable.GetNode(node, 'free_item', Node)
            let free_icon_state=GameKit.ControllerTable.GetNode(freeItem, 'icon_state')
            let free_lock=GameKit.ControllerTable.GetNode(freeItem, 'buy-lock')
            let free_lock_particle=GameKit.ControllerTable.GetComponent(freeItem, 'buy_lock_particle', ParticleSystem)
            let free_reward_layout=GameKit.ControllerTable.GetNode(freeItem, "reward-layout")
            let free_quest_btn=GameKit.ControllerTable.GetNode(freeItem, "quest-btn")
            
            free_lock.active=false
            free_lock_particle.node.active=false
            if(level<=this.curLv){
                if(this.activityData.received_free.contains(level)){
                    free_lock.active=false
                    free_quest_btn.active=false
                    free_icon_state.active=true
                }else{
                    //寰呴鍙?
                    free_lock.active=false
                    free_quest_btn.active=true
                    free_icon_state.active=false
                }
            }else{
                //鏈縺娲?
                free_lock.active=true
                free_quest_btn.active=false
                free_icon_state.active=false
            }


            // if(this.activityData.received_free.contains(level)){
            //     //宸茬粡棰嗗彇浜?
            //     free_lock.active=false
            //     free_quest_btn.active=false
            //     free_icon_state.active=true
            // }else{
            //     free_icon_state.active=false
            //     //鏈鍙?
            //     console.log(level,"bbbb",this.activityData.buyLevel);
            //     if(level<=this.activityData.freeLevel){
            //         //寰呴鍙?
            //         free_lock.active=false
            //         free_quest_btn.active=true
            //     }else{
            //         //鏈縺娲?
            //         free_lock.active=true
            //         free_quest_btn.active=false
            //     }
            // }

            let freeRewards = Meta.ShopRewardsMeta.GetRewardsByPackId(meta.FreeRewardID())
            free_reward_layout.destroyAllChildren()
            freeRewards.forEach((reward,idx) => {
                let reward_node = instantiate(reward_item)
                reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z)
                reward_node.parent = free_reward_layout
                reward_node.active = true
                reward_node.getComponent("ContentModel").show(reward)
            });

            if(level!=this.curLv){
                labelLevel.string = level
                labelIcon.active=false
            }else{
                labelLevel.string = ""
                labelIcon.active=true
            }

            free_quest_btn.targetOff(this)
            free_quest_btn.on("click", () => {
                if (GamePlay.instance.isBusy()) return
                let req = SR.SRActivityPassport.cllectFreeReward(level,meta.FreeRewardID())
                req.SetCallBack(function(res) {
                    this.collectOver()
                }.bind(this))
                req.Send()
            }, this)
        })

        this.svt_reward.DirectToIndex(this.curLv)
    }
    ArrSubtraction(arr1, arr2) {
        let a=arr1.concat()
        let b=arr2.concat()
        for (let index = 0; index < b.length; index++) {
            a.shift()
        }
        return a
    }
    AddRewardList() {
        const metas=Meta.MetaManager.GetMetas(Meta.MetaType.PassPort)
        const ids=Object.keys(metas)

        //瓒呰繃閰嶇疆鏁版嵁鍒欐寜瀹為檯绛夌骇鍘诲鐞?
        let id_list = []
        let i=0
        let id: any=0
        let idx=0
        for (i = 0; i < ids.length; i++) {
            id=ids[i]
            id_list.push(id)
            idx=i
        }
        // console.log(idx,'aaa',ids.length,this.curLv,id);
        let next10Lv=idx
        if(this.curLv>=idx){
            next10Lv=idx
            do {
                next10Lv++
                id_list.push(id)
            } while ((next10Lv%10)!=0||this.curLv>=next10Lv)
        }

        let exist_list=this.svt_reward.data;
        let newList=this.ArrSubtraction(id_list,exist_list)
        // console.log(newList);
        
        if(newList.length==0)return

        // console.log(id_list,'zzz');

        this.svt_reward.addItem(newList, (index, id, node) => {
            let meta=metas[id]

            let level = index
            // let level = meta.Level()
            let clctBonus_badge=GameKit.ControllerTable.GetNode(node, 'clctBonus_badge')
            let reward_item=GameKit.ControllerTable.GetNode(node, "reward-item")
            reward_item.active=false
            let labelLevel = GameKit.ControllerTable.GetComponent(node, 'labelLevel', Label)
            let labelIcon = GameKit.ControllerTable.GetNode(node, 'labelIcon')
            labelIcon.active=false

            let buyItem=GameKit.ControllerTable.GetNode(node, 'buy_item')
            let buy_icon_state=GameKit.ControllerTable.GetNode(buyItem, 'icon_state')
            let buy_lock=GameKit.ControllerTable.GetNode(buyItem, 'buy-lock')
            let buy_lock_particle=GameKit.ControllerTable.GetComponent(buyItem, 'buy_lock_particle', ParticleSystem)
            let buy_reward_layout=GameKit.ControllerTable.GetNode(buyItem, "reward-layout")
            let buy_quest_btn=GameKit.ControllerTable.GetNode(buyItem, "quest-btn")
            buy_quest_btn.active=false
            buy_icon_state.active=false
            buy_lock.active=true
            buy_lock_particle.node.active=false


            if(level<=this.curLv){
                if(this.activityData.received_passport.contains(level)){
                    //宸茬粡棰嗗彇浜?
                    buy_lock.active=false
                    buy_quest_btn.active=false
                    buy_icon_state.active=true
                }else{
                    //寰呴鍙?
                    if(this.activityData.buyPassport){
                        buy_lock.active=false
                        buy_quest_btn.active=true
                        buy_icon_state.active=false
                    }else{
                        buy_lock.active=true
                        buy_quest_btn.active=false
                        buy_icon_state.active=false
                    }
                }
                
            }else{
                //鏈縺娲?
                buy_lock.active=true
                buy_quest_btn.active=false
                buy_icon_state.active=false
            }
            // if(this.activityData.received_passport.contains(level)){
            //     //宸茬粡棰嗗彇浜?
            //     buy_lock.active=false
            //     buy_quest_btn.active=false
            //     buy_icon_state.active=true
            // }else{
            //     buy_icon_state.active=false
            //     //鏈鍙?

            //     console.log(level,"aaaa",this.activityData.buyLevel);
            //     if(level<=this.activityData.buyLevel){
            //         //寰呴鍙?
            //         buy_lock.active=false
            //         buy_quest_btn.active=true
            //     }else{
            //         //鏈縺娲?
            //         buy_lock.active=true
            //         buy_quest_btn.active=false
            //     }
            // }

            let buyRewards = Meta.ShopRewardsMeta.GetRewardsByPackId(meta.BuyRewardID())
            buy_reward_layout.destroyAllChildren()
            buyRewards.forEach((reward,idx) => {
                let reward_node = instantiate(reward_item)
                reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z)
                reward_node.parent = buy_reward_layout
                reward_node.active = true
                reward_node.getComponent("ContentModel").show(reward)
            });

            buy_quest_btn.targetOff(this)
            buy_quest_btn.on("click", () => {
                if (GamePlay.instance.isBusy()) return
                let req = SR.SRActivityPassport.collectPassportReward(level,meta.BuyRewardID())
                req.SetCallBack(function(res) {
                    this.collectOver()
                }.bind(this))
                req.Send()
            }, this)



            let freeItem=GameKit.ControllerTable.GetNode(node, 'free_item', Node)
            let free_icon_state=GameKit.ControllerTable.GetNode(freeItem, 'icon_state')
            let free_lock=GameKit.ControllerTable.GetNode(freeItem, 'buy-lock')
            let free_lock_particle=GameKit.ControllerTable.GetComponent(freeItem, 'buy_lock_particle', ParticleSystem)
            let free_reward_layout=GameKit.ControllerTable.GetNode(freeItem, "reward-layout")
            let free_quest_btn=GameKit.ControllerTable.GetNode(freeItem, "quest-btn")
            
            free_lock.active=false
            free_lock_particle.node.active=false
            if(level<=this.curLv){
                if(this.activityData.received_free.contains(level)){
                    free_lock.active=false
                    free_quest_btn.active=false
                    free_icon_state.active=true
                }else{
                    //寰呴鍙?
                    free_lock.active=false
                    free_quest_btn.active=true
                    free_icon_state.active=false
                }
            }else{
                //鏈縺娲?
                free_lock.active=true
                free_quest_btn.active=false
                free_icon_state.active=false
            }


            // if(this.activityData.received_free.contains(level)){
            //     //宸茬粡棰嗗彇浜?
            //     free_lock.active=false
            //     free_quest_btn.active=false
            //     free_icon_state.active=true
            // }else{
            //     free_icon_state.active=false
            //     //鏈鍙?
            //     console.log(level,"bbbb",this.activityData.buyLevel);
            //     if(level<=this.activityData.freeLevel){
            //         //寰呴鍙?
            //         free_lock.active=false
            //         free_quest_btn.active=true
            //     }else{
            //         //鏈縺娲?
            //         free_lock.active=true
            //         free_quest_btn.active=false
            //     }
            // }

            let freeRewards = Meta.ShopRewardsMeta.GetRewardsByPackId(meta.FreeRewardID())
            free_reward_layout.destroyAllChildren()
            freeRewards.forEach((reward,idx) => {
                let reward_node = instantiate(reward_item)
                reward_node.setPosition(reward_node.position.x, 0, reward_node.position.z)
                reward_node.parent = free_reward_layout
                reward_node.active = true
                reward_node.getComponent("ContentModel").show(reward)
            });

            if(level!=this.curLv){
                labelLevel.string = level
                labelIcon.active=false
            }else{
                labelLevel.string = ""
                labelIcon.active=true
            }

            free_quest_btn.targetOff(this)
            free_quest_btn.on("click", () => {
                if (GamePlay.instance.isBusy()) return
                let req = SR.SRActivityPassport.cllectFreeReward(level,meta.FreeRewardID())
                req.SetCallBack(function(res) {
                    this.collectOver()
                }.bind(this))
                req.Send()
            }, this)
        })

        this.svt_reward.DirectToIndex(this.curLv)
    }

    GetOneFlag() {
    }

    //////////////////////////////////////
    callClose() {
        this.closeAnim()
    }

    callPurchaseOver() {
        this.UpdateBar()

        this.AddRewardList()
        this.updateLine()

        this.svt_reward.flushData()
        this.svt_reward.ScrollToIndex(this.curLv)
        
        // let id = this.shopMeta.Name()
        // AppKit.PaymentWrap.Pay(id, function(ok, res) {
        //     if (ok) {
        //         GameKit.SoundManager.playSound("item_purchased")

        //         this.activityData.buyKing = true
        //         this.UpdateBuyButton()

        //         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"kingPassport", name: id, phase: 1})
        //     } else {
        //         AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"kingPassport", name: id, phase: -1})
        //     }
        // }.bind(this))

        // AppKit.LogEventWrap.logEvent("ShopDetail", {itemType:"kingPassport", name: id, phase: 0})
    }

    collectOver() {
        this.UpdateData()
        this.UpdateActiveButton()
        this.buyPassportButton.interactable=(this.unReceive_freeLevels.length>0||this.unReceive_buyLevels.length>0)
        this.svt_reward.flushData()

    }

    callOpenPurchase() {
        // if (this.activityData.buyKing) return
        // UIRoot.instance.openChildWindow("CollectFlagPurchaseWindow")
    }

    public static SetSkin(meta: any) {
        let skin=meta.ShortName()
        let object=(PassPortMainWindow as any)[skin]
        if(object){
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    const element = object[key];
                    const win = (global as any)[key]
                    if(win){
                        win.windowPath=element
                    }
                }
            }
        }
    }
}
