import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import PlayAudio from '../../GameKit/Editor/PlayAudio';
import SpriteGray from '../../GameKit/render/SpriteGray';
import { fitByHeight } from '../../GameKit/render/fixedSizeRatio';
import CardChestOpenWindow from './CardChestOpenWindow';
import CardJoinGroupWindow from './CardJoinGroupWindow';
import { CardSubjectSet } from './CardSubjectSet';
/**
 * @author fengyong 2019-5-14
 */
 const { ccclass, property } = cc._decorator
 const C = {
     BASE_PATH: "Card",      // set-icon的基础path
     SET_ICON_FILENAME: "set-icon",
 }
 
 /**
  * 卡片所有集合界面
  */
 @ccclass
 export default class CardAllSetWindow extends UIWindow {

    static windowPath = "Card/CardAllSetWindow"
    /** @type {cc.Button} */
    @property(cc.Button)
    btnButtonChang = null

    /** @type {cc.Label} */
    @property(cc.Label)
    ChangLabel = null

    /** @type {cc.node} */
    @property(cc.Node)
    btnButtonShop = null
    
    /** @type {cc.Node} */
    @property(cc.Node)
    btnWatchFree = null

    /** @type {cc.Label} */
    @property(cc.Label)
    labelFree = null

    @property(cc.Node)
    subjectContent=null

    /** @type {cc.Label} */
    @property(cc.Label)
    CardThemeLbl = null
    
    onLoad(){
    if(AppKit.NativeWrap.isNewApp())
        {
            this.btnButtonShop.destroy()
        }
    }

    onShow(showParams) {
        this.CardThemeMeta=Game.ActivityManager.GetActiveGameActivityByType(Meta.ActivityMeta.SubTypes.CardTheme)
        this.leftTime=0

        this.Card_issue = this.CardThemeMeta.Card_issue()
        this.get_data()
        this.create_svt()

        this.scheduleOnce(() => {
            //GamePlay.instance.node.active = false
        }, 1);

        let shownInfo = GameKit.PlayerPrefs.GetBool("UserCardEntered")
        if (!shownInfo) {
            UIRoot.instance.openChildWindow("CardInfoWindow")
            GameKit.PlayerPrefs.SetBool("UserCardEntered", true)
        }
        
        GameKit.BackKeyManager.registerBackEvent(() => {
            //GamePlay.instance.node.active = true
            PlayAudio.playClose()
            this.closeAnim()
        })

        if (showParams.setId) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, showParams.setId)
            UIRoot.instance.openChildWindow("CardSingleSetWindow", { single_set_meta: meta })
        }

        if (Game.SUserCard.JokerCount() > 0) {
            UIRoot.instance.openChildWindow("JokerCardWindow")
        }
        
        this.labelFree.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`
        this.btnWatchFree.active = (Game.SUserVillage.MapId() >= G.GameConstance.cardSystemStartLevel) && Game.SUserVillage.MapId() >= G.GameConfig.FreeChestLevel && AppKit.ADWrap.AdEnabled() && (Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount) && !AppKit.NativeWrap.isNewApp()
        
        //activityLeft
        this.SetActivityLeft()
        //this.ChangLabel.string = String.format(GameKit.i18n.t("CardChangeWindowLouckButton"),20)
        

    }

    onClose() {
        //GamePlay.instance.node.active = true
        GameKit.BackKeyManager.unregisterBackEvent()
        //卸载限时卡牌的内容
        if(this.subjectItem){
            this.subjectContent.removeAllChildren()
            this.subjectItem.destroy()
            this.subjectItem=null
        }
        this.subjectContent.active=false
        //------------------------------
        for (let index in this.svt.items) {
            let sp = GameKit.ControllerTable.GetComponent(this.svt.items[index], "icon", cc.Sprite)
            cce.releaseSpriteFrame(sp)
        }

        CardJoinGroupWindow.TryShow()
    }

    /** 所有set的meta数据 */
    all_set_meta;
    subject_allMeta;
    /** 
     * 获取数据
     * CardSetsMeta(/meta/public/cardSets.xlsx)
     * - id
     * - name           名字
     * - min_village    开放需要的村庄等级
     * - reward         奖励(contentString字符串,用";"分割)
     * - [注意] 此模块可以直接在游戏预览中获取
     */
    get_data() {
        this.subject_allMeta = Meta.MetaManager.GetMetas(Meta.MetaType.CardSets)
        this.all_set_meta = Meta.CardSetsMeta.getMetasByIssue(this.Card_issue);
    }

    /** @type {ScrollViewTool} */
    @property(ScrollViewTool)
    svt = null

    /**
     * 创建svt
     * CardSetsMeta(/meta/public/cardSets.xlsx)
     * - id
     * - name           名字
     * - min_village    开放需要的村庄等级
     * - reward         奖励(contentString字符串,用";"分割)
     */
    create_svt() {
        // 创建svt
        let id_list = []
        for (let id in this.all_set_meta) {
            let obj=this.all_set_meta[id]
            if(!obj.IsActivityCard()){
                //普通卡
                id_list.push(id)
            }else{
                //限时卡
                
            }
        }
        this.svt.setItem(id_list, (index, id, node) => {
            // 获取子节点
            let sp_icon = GameKit.ControllerTable.GetNode(node, "icon").getComponent(cc.Sprite)
            let label_set_name = GameKit.ControllerTable.GetNode(node, "label-set-name").getComponent(cc.Label)
            let pb = GameKit.ControllerTable.GetNode(node, "progress").getComponent(cc.ProgressBar)
            let label_pb = GameKit.ControllerTable.GetNode(node, "label-progress").getComponent(cc.Label)
            let completed = GameKit.ControllerTable.GetNode(node, "label-completed")
            let sp_lock = GameKit.ControllerTable.GetNode(node, "lock").getComponent(cc.Sprite)
            let label_lock = GameKit.ControllerTable.GetNode(node, "label-lock").getComponent(cc.Label)
            // 获取单个数据
            let meta = this.subject_allMeta[id]
            // 根据数据修改子节点样式
            //label_set_name.string = id.toString() + "." + meta.Name();
            label_set_name.string = meta.Name();
            cce.loadRes(`${C.BASE_PATH}/${meta.Res()}/${C.SET_ICON_FILENAME}`, cc.SpriteFrame, (err, res) => {
                if (!err && sp_icon) {
                    sp_icon.spriteFrame = res
                    fitByHeight(sp_icon, 183)
                }
            })
            let count = 0
            for (let i = 1; i <= 9; i++) {
                count += Game.SUserCard.HaveCard(id * 100 + i) ? 1 : 0
            }
            pb.progress = count / 9
            label_pb.string = `${count} / 9`
            // 判定是否为lock
            label_lock.string = String.format(GameKit.i18n.t("CardAllSetWindowLock"), meta.MinVillage())
            let flag_lock = Game.SUserVillage.MapId() < meta.MinVillage() && count <= 0 // true表示被lock
            sp_lock.node.active = flag_lock
            node.getComponent(cc.Button).interactable = !flag_lock
            SpriteGray.SetGray(sp_icon, flag_lock)
            sp_icon.node.color = flag_lock ? cc.color(50, 50, 50) : cc.Color.WHITE
            label_set_name.node.active = !flag_lock
            // 点击事件跳转
            node.on("click", () => {
                UIRoot.instance.openChildWindow("CardSingleSetWindow", { single_set_meta: meta })
            })
        })
        

        this.subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)
        if(this.subjectMeta){
            this.subjectContent.height=300
            this.subjectContent.parent=this.svt.itemsContent
            this.svt.itemsContent.insertChild(this.subjectContent,0)
            this.subjectContent.y=0
            this.subjectContent.active=true
            
            UIRoot.instance.ShowCantClick(true)
            GamePlay.instance.preloadSubjectPrefab(this.subjectMeta.ShortName()).then((res)=>{
                if(res==1){
                    //新资源
                    if(this.subjectItem){
                        this.subjectContent.removeAllChildren()
                        this.subjectItem.destroy()
                        this.subjectItem=null
                    }
                    this.subjectItem=cc.instantiate(CommonAssets.instance.subjectPrefab)
                    this.subjectItem.x=this.subjectItem.y=0
                    this.subjectItem.parent=this.subjectContent
                    this.subjectItem.getComponent(CardSubjectSet).createActivityCard(this.subject_allMeta)
                }else{
                    if(!this.subjectItem){
                        this.subjectItem=cc.instantiate(CommonAssets.instance.subjectPrefab)
                        this.subjectItem.x=this.subjectItem.y=0
                        this.subjectItem.parent=this.subjectContent
                        this.subjectItem.getComponent(("CardSubjectSet")).createActivityCard(this.subject_allMeta)
                    }
                }
               
                // 判断领奖状态
                this.update_compelete()
                UIRoot.instance.CloseCantClick()
            }).catch((err)=>{
                // this.update_compelete()
                UIRoot.instance.CloseCantClick()
            })
        }else{
            if(this.subjectItem){
                this.subjectContent.removeAllChildren()
                this.subjectItem.destroy()
                this.subjectItem=null
            }
            this.subjectContent.active=false

            // 判断领奖状态
            this.update_compelete()
        }
    }
    /** 更新领奖后的completed的显示 */
    update_compelete() {
        for (let id in this.all_set_meta) {
            let obj=this.all_set_meta[id]
            if(!obj.IsActivityCard()){
                let iid =id-(15*(this.Card_issue-1))-1;
                let node = this.svt.items[iid];
                let meta = this.all_set_meta[id];
                let pb = GameKit.ControllerTable.GetNode(node, "progress").getComponent(cc.ProgressBar)
                let completed = GameKit.ControllerTable.GetNode(node, "label-completed")
                let is_get_reward = Game.SUserCard.HasgotSetsReward(meta.Id())
                pb.node.active = !is_get_reward
                completed.active = is_get_reward

            }
        }

        if(this.subjectMeta&&this.subjectItem){
            this.subjectItem.getComponent(CardSubjectSet).update_compelete()
        }
    }

    event_close() {
        //GamePlay.instance.node.active = true
        this.closeAnim()
    }

    event_info() {
        UIRoot.instance.openChildWindow("CardInfoWindow")
    }

    event_shop() {
        UIRoot.instance.openChildWindow("ShopWindow", { showChest: true })
    }

    event_change() {
        let req = SR.SRCard.changeStarNum()
            req.SetCallBack(function(res){          
                UIRoot.instance.openChildWindow("CardChangeWindow", { showChest: true ,"res":res })
            })
            req.Send()
    }
    
    event_watchFree() {
        if (Game.SUserCard.data.freeCount >= G.GameConstance.dailyFreeChestCount) return

        AppKit.ADWrap.ShowVideo(() => {
            let req = SR.SRCard.watchChest()
            req.SetCallBack(() => {
                this.svt.flushData()
                
                CardChestOpenWindow.tryShow()
                
                this.labelFree.string = `(${G.GameConstance.dailyFreeChestCount-Game.SUserCard.data.freeCount} / ${G.GameConstance.dailyFreeChestCount})`
                this.btnWatchFree.active = Game.SUserCard.data.freeCount < G.GameConstance.dailyFreeChestCount && Game.SUserVillage.MapId() >= G.GameConfig.FreeChestLevel && !AppKit.NativeWrap.isNewApp()
            })
            req.Send()
        }, "freeChest")
    }
    
    /** @type {cc.Node} */
    @property(cc.Node)
    activityLeft = null

    SetActivityLeft() {
        
        let activities = Game.ActivityManager.GetAllShowActivityList()
        let metas = []
        
        activities.forEach(meta => {
            if (meta.Type() == Meta.ActivityMeta.Types.Other && meta.SubType() == Meta.ActivityMeta.SubTypes.CrazySet) {
                metas.push(meta)
            }
        })

        metas.forEach(meta => {
            let badgeName = meta.Icon()
            if (badgeName) {
                if (badgeName.startsWith("http")) {
                    let resName = 'res/Activity/badge/ActivityDaysSaleBadge'
                    cce.loadRes(resName, cc.Prefab, (err, winPre) => {
                        if (err || !winPre) return
                        let wnd = cc.instantiate(winPre)
                        let badge = wnd.getComponent("ActivityBadge")
                        badge.setMeta(meta, () => {
                            this.SetActivityBadge(badge)
                        })
                    })
                } else {
                    let resName = 'res/Activity/badge/' + badgeName
                    cce.loadRes(resName, cc.Prefab, (err, winPre) => {
                        if (err || !winPre) return
                        let wnd = cc.instantiate(winPre)
                        let badge = wnd.getComponent("ActivityBadge")
                        badge.setMeta(meta)
                        this.SetActivityBadge(badge)
                    })
                }
            }
        })
    }
    SetActivityBadge(badge) {
        this.activityBadgeData = this.activityBadgeData || {}
        if (this.activityBadgeData[badge.meta.Id()]) return
        //if (!badge.isleft) return

        let isleft = badge.isleft
        this.activityBadgeData[badge.meta.Id()] = badge
        badge.node.parent = this.activityLeft
        badge.node.x = 0
        if (!isleft) {
            badge.node.children[0].x = -badge.node.children[0].x
        }
    }
    update(){
        this.updateTime()
    }

    updateTime(){
        if (this.leftTime != null) {

            let currentTime = GameKit.TimeUtil.getCurrentTime()

            this.leftTime = this.CardThemeMeta.EndTime() - currentTime

            this.CardThemeLbl.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true)

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }
    }
}
