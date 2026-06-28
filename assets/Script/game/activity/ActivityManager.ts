import '../../LegacyGlobals';

import { Prefab, instantiate } from 'cc'

const ActivityManager: any = {
    Constance: {},
}

ActivityManager.Clear = function() {
    this.Constance = {}
    this.localData = null
    
    if (this.SlotCollectRankI) {
        clearInterval(this.SlotCollectRankI)
        this.SlotCollectRankI = null
    }
}

//----------------将部分不能使用的活动删除�?
ActivityManager.DeleteNoEffectActivity=function(){
    const object=Game.SUserActivity.data.activityData
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            if(Object.hasOwnProperty.call(element,"isBuy")){
                // console.log(element,key);
                if(element.isBuy==false){
                    Game.ActivityManager.disableDymicLocalActivity(key)
                }
            }
        }
    }
}

///-----------------将道具添加到activities�?
ActivityManager.AddLocalDymicActiveToolList=function(){
    let toolActivities=Game.SUserItems.getDymicActiveToolList()
    toolActivities.forEach(_data => {
        let meta=Meta.ActivityMeta.MakeEntity(_data)
        let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Activity)
        if(!metas[meta.Id()]){
            // metas[meta.Id()]=meta
            Game.ActivityManager.setLocalActivityIcon(meta)
            GameKit.GameEvent.DispatcherEvent('ActivityChange', meta)
        }else{
            if (GameMainWindow.instance) {
                GameMainWindow.instance.UpdateActivityBadge(meta)
            }
        }
        metas[meta.Id()]=meta
    });
}


// 登陆完成 
ActivityManager.logined = function() {
    this.DeleteNoEffectActivity()
    this.AddLocalDymicActiveToolList()

    let activities = this.GetAllShowActivityList()

    activities.sort((a,b) => {
        if (a.Type() == b.Type()) {
            return a.SubType() - b.SubType()
        }
        return a.Type() - b.Type()
    })

    activities.forEach(meta => {
        this.setLocalActivityIcon(meta)
        this.setLocalActivityBox(meta)
        
    })
        
    var scmeta = Game.ActivityManager.GetActiveSlotCollectRankActivity()
    if (scmeta) {
        if (this.SlotCollectRankI) {
            clearInterval(this.SlotCollectRankI)
            this.SlotCollectRankI = null
        }
        this.SlotCollectRankI = setInterval(() => {
            let req = SR.SRActivity.getUserActivity()
            req.SetSilence(true)
            req.Send()
            if (this.SlotCollectRankI && !scmeta.IsActive()) {
                clearInterval(this.SlotCollectRankI)
                this.SlotCollectRankI = null
            }
        }, 600000);
    }
}

//获取Constance meta
ActivityManager.GetConstance = function(data) {
    
    try {
        for(let id in data) {
            let kvp = data[id]
            this.Constance[kvp.key] = kvp.value
            if (typeof kvp.value === "string") {
                if ((kvp.value.startsWith("[") && kvp.value.endsWith("]")) || (kvp.value.startsWith("{") && kvp.value.endsWith("}"))) {
                    this.Constance[kvp.key] = JSON.parse(kvp.value)
                }
            }
        }
    } catch (e) {
        Logs.Error("ActivityManager.GetConstance", e.message)
    }
}

// local
ActivityManager.GetLocalData = function() {
    if (!this.localData) {
        this.localData = GameKit.PlayerPrefs.GetObject("activity_local_data", {})

    }   
    return this.localData
}

ActivityManager.FlushLocalData = function() {
    GameKit.PlayerPrefs.SetObject("activity_local_data", this.localData)
}
/**
 * 
 * @param {*} meta 
 * @returns 
 */
ActivityManager.setLocalActivityBox = function(meta) {
    if (meta.Type() == Meta.ActivityMeta.Types.Game
    && meta.Param().showInMerge == true
) {
        let resName = 'res/Activity/' + meta.Icon()
        cce.loadRes(resName, Prefab, function (err, winPre) {
            if (err || !winPre) return
            let wnd = instantiate(winPre)
            let box = wnd.getComponent("ActivityBadge")
            box.setMeta(meta)
            setTimeout(() => {
                if (GamePlay.instance.mergeRoot.mergeNodeUI) {
                    GamePlay.instance.mergeRoot.mergeNodeUI.SetActivityBox(box)
                }
            }, 100);
        })
        return

    }

}
//设定活动图标
ActivityManager.setLocalActivityIcon = function(meta) {
    if (meta.Param().showBadge === true) {
        let resName;
        if(meta.Icon().contains("/")){
            resName = 'res/Activity/' + meta.Icon()
        }else{
            resName = 'res/Activity/badge/' + meta.Icon()
        }
        cce.loadRes(resName, Prefab, function (err, winPre) {
            if (err || !winPre) return
            let wnd = instantiate(winPre)
            let badge = wnd.getComponent("ActivityBadge")
            badge.setMeta(meta)
            setTimeout(() => {
                if (GameMainWindow.instance) {
                    GameMainWindow.instance.SetActivityBadge(badge)
                }
            }, 100);
        })
        return
    }
    
    if (meta.Type() == Meta.ActivityMeta.Types.Other && (meta.SubType() == Meta.ActivityMeta.SubTypes.CrazySet || meta.IsDymicTool())) {
        let resName = 'res/Activity/badge/' + meta.Icon()
        cce.loadRes(resName, Prefab, function (err, winPre) {
            if (err || !winPre) return
            let wnd = instantiate(winPre)
            let badge = wnd.getComponent("ActivityBadge")
            badge.setMeta(meta)
            setTimeout(() => {
                if (GameMainWindow.instance) {
                    GameMainWindow.instance.SetActivityBadge(badge)
                }
            }, 100);
        })
        return
    }

    if (meta.Type() == Meta.ActivityMeta.Types.Pay) {
        let badgeName = meta.Icon()
        if (badgeName) {
            if (badgeName.startsWith("http")) {
                let resName = 'res/Activity/badge/ActivityDaysSaleBadge'
                cce.loadRes(resName, Prefab, function (err, winPre) {
                    if (err || !winPre) return
                    let wnd = instantiate(winPre)
                    let badge = wnd.getComponent("ActivityBadge")
                    badge.setMeta(meta, () => {
                        if (GameMainWindow.instance) GameMainWindow.instance.SetActivityBadge(badge)
                    })
                })
            } else {
                let resName = 'res/Activity/badge/' + badgeName
                cce.loadRes(resName, Prefab, function (err, winPre) {
                    if (err || !winPre) return
                    let wnd = instantiate(winPre)
                    let badge = wnd.getComponent("ActivityBadge")
                    badge.setMeta(meta)
                    if (GameMainWindow.instance) {
                        GameMainWindow.instance.SetActivityBadge(badge)
                    }
                })
            }
        }
    }
}

// 开启某个本地活�?
ActivityManager.activeLocalActivity = function(activityId) {
    let meta = this.GetMeta(activityId)

    let localdata = this.localData[activityId] || {}

    localdata.isActive = true
    localdata.startTime = GameKit.TimeUtil.getCurrentTime()

    this.localData[activityId] = localdata
    this.FlushLocalData()

    this.setLocalActivityIcon(meta)

    UIRoot.instance.openChildWindow(meta.Panel(), {meta: meta})
}

// 关闭某个本地活动
ActivityManager.disableLocalActivity = function(activityId) {
    let localdata = this.localData[activityId] || {}

    localdata.isActive = false

    this.localData[activityId] = localdata
    this.FlushLocalData()

    if (GameMainWindow.instance) GameMainWindow.instance.RemoveActivityBadge(activityId)
}

// 检测开启本地时间的活动
ActivityManager.checkLocalActivity = function() {
    let localData = this.GetLocalData()

    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Activity)
    //let result = []

    for(let activityId in metas) {
        let meta = metas[activityId]
        if (meta.IsActive()) {
            if (meta.IsUserTime()) {
                if (!this.CheckEnable(meta)) continue
                if (localData[activityId] != null) continue
                if (meta.IsInManyTimesCd()) continue
                if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.SubType() === Meta.ActivityMeta.SubTypes.SpecialOffer) continue
                //result.push(meta)
                ActivityManager.activeLocalActivity(meta.Id())
            }
        }
    }
}

// getter
ActivityManager.GetMeta = function(activityId) {
	return Meta.MetaManager.GetMeta(Meta.MetaType.Activity, activityId)
}

//获取正在显示中的活动列表
ActivityManager.GetAllShowActivityList = function() {

    //获取正在开启的本地活动
    this.GetLocalData()
    this.checkLocalActivity()

    let currentTime = GameKit.TimeUtil.getCurrentTime()

    for (let activityId in this.localData) {
        if (this.localData[activityId].isActive) {
            let meta = this.GetMeta(activityId)
            if (!meta) {
                this.localData[activityId].isActive = false
            } else {
                if (currentTime > this.localData[activityId].startTime + meta.UserTime()) {
                    this.localData[activityId].isActive = false
                }
            }
        }
    }

    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Activity)
    let result = []

    for(let activityId in metas) {
    //for (let i = 0; i < list.length; i++) {
        
        let meta = metas[activityId]
        if (meta.IsShowing()) {
            if (!this.CheckEnable(meta)) continue
            if (meta.IsUserTime()) {
                if (!this.localData[activityId] || !this.localData[activityId].isActive) {
                    continue
                }
            }

            result.push(meta)
        }
    }

    return result
}

//获取正在活动中的活动列表
ActivityManager.GetAllActiveActivityList = function() {
    let list = this.GetAllShowActivityList()
    let result = []

    for (let i = 0; i < list.length; i++) {
        let meta = list[i]
        if (meta.IsActive()) {
            result.push(meta)
        }
    }

    return result
}

//是否满足 活动生效条件
ActivityManager.CheckEnable = function(meta) {
    if (meta.Type() == Meta.ActivityMeta.Types.Pay) {
        if (!AppKit.PaymentWrap.PayVisiable()) return false
    }
    let enableTriggers = meta.EnableTrigger()
    for (let i = 0; i < enableTriggers.length; i++) {
        let trig = enableTriggers[i]
        if (trig.indexOf(">=") > -1) {
            let strs = trig.split(">=")
            if (!this.CheckTrigger(strs[0], ">=", strs[1])) return false
        } else if (trig.indexOf("<=") > -1) {
            let strs = trig.split("<=")
            if (!this.CheckTrigger(strs[0], "<=", strs[1])) return false
        } else if (trig.indexOf("!=") > -1) {
            let strs = trig.split("!=")
            if (!this.CheckTrigger(strs[0], "!=",  strs[1])) return false
        } else if (trig.indexOf("=") > -1) {
            let strs = trig.split("=")
            if (!this.CheckTrigger(strs[0], "=",  strs[1])) return false
        } else if (trig.indexOf(">") > -1) {
            let strs = trig.split(">")
            if (!this.CheckTrigger(strs[0], ">",  strs[1])) return false
        } else if (trig.indexOf("<") > -1) {
            let strs = trig.split("<")
            if (!this.CheckTrigger(strs[0], "<",  strs[1])) return false
        }
    }

    return true
}

ActivityManager.CheckTrigger = function(key, operator, _value) {
    let userValue = 0
    let value = _value

    if (key === "level") {
        userValue = Game.SUser.Level()
        value = parseInt(_value)
    } else if (key === "mapId") {
        userValue = Game.SUserVillage.MapId()
        value = parseInt(_value)
    } else if (key === "userGroup") {
        let sets = _value.split("/")
        userValue = Game.SUser.UserId() % parseInt(sets[1])
        value = parseInt(sets[0])
    } else if (key === "buyItem") {
        value = parseInt(_value)
        let purchasedActivityId = GameKit.PlayerPrefs.GetObject("purchasedActivityId", [])
        if (operator === "!=") {
            return !purchasedActivityId.contains(value)
        }
        return purchasedActivityId.contains(value)
    } else if (key === "purchaseMoney") {
        value = parseFloat(_value)
        userValue = Game.SUserRecord.GetPurchaseMoney()
    } else if (key === "purchaseMoneyAvg") {
        value = parseFloat(_value)
        userValue = Game.SUserRecord.GetPurchaseMoneyAvg()
    }

    if (operator === ">=") {
        return userValue >= value
    } else if (operator === "<=") {
        return userValue <= value
    } else if (operator === "!=") {
        return userValue != value
    } else if (operator === "=") {
        return userValue == value
    } else if (operator === ">") {
        return userValue > value
    } else if (operator === "<") {
        return userValue < value
    }
    
    return true
}

//根据类型查找正在激活的活动
ActivityManager.GetActiveActivity = function(type,subtype) {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === type && meta.SubType() == subtype) return meta
    }

    return null
}

ActivityManager.GetActiveShopActivity = function() {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.ShopIds()) return meta
    }

    return null
}
ActivityManager.GetActiveShopActivityByType = function(subtype) {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.SubType() == subtype) return meta
    }

    return null
}

ActivityManager.GetActiveGameActivities = function() {
    let activities = ActivityManager.GetAllActiveActivityList()
    let result = []
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]        
        if (meta.Type() === (Meta.ActivityMeta.Types.Game||Meta.ActivityMeta.Types.Game2)) result.push(meta)
    }
    
    return result
}
ActivityManager.GetActiveSlotActivity = function() {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Game && (meta.SubType() == Meta.ActivityMeta.SubTypes.AttackMaster || meta.SubType() == Meta.ActivityMeta.SubTypes.RaidMaster 
        || meta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollect)) return meta
    }

    return null
}
ActivityManager.GetActiveSlotCollectActivity = function() {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Game && (meta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollect || meta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollectRank)) return meta
    }

    return null
}
ActivityManager.GetActiveSlotCollectRankActivity = function() {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Game && meta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollectRank) return meta
    }

    return null
}
ActivityManager.GetActiveGameActivityByType = function(subtype) {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === (Meta.ActivityMeta.Types.Game||Meta.ActivityMeta.Types.Game2) && meta.SubType() == subtype) return meta
    }

    return null
}

ActivityManager.GetActiveOtherActivityByType = function(subtype) {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Other && meta.SubType() == subtype) return meta
    }

    return null
}
ActivityManager.GetActiveGame2ActivityByType = function(subtype) {
    let activities = ActivityManager.GetAllActiveActivityList()
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Game2 && meta.SubType() == subtype) return meta
    }

    return null
}
// helper
// 活动结束
ActivityManager.ActivityOver = function(activityId) {
    let meta = this.GetMeta(activityId)
    if (meta.IsUserTime()) {
        Game.ActivityManager.disableLocalActivity(activityId)
    }
    if(meta.IsDymicTool){
       Game.ActivityManager.disableDymicLocalActivity(activityId)
       GameKit.GameEvent.DispatcherEvent('ActivityChange', meta)
    }
        
    if (GameMainWindow.instance) GameMainWindow.instance.RemoveActivityBadge(activityId)

    if (GamePlay.instance.slotNode) {
        let slotActivityRoot = GamePlay.instance.slotNode.activityRoot
        if (slotActivityRoot.activityMeta && slotActivityRoot.activityMeta.Id() === activityId) {
            slotActivityRoot.hideAll()
        }
    }
}
//删除动态创建的活动数据
ActivityManager.disableDymicLocalActivity=function(activityId){
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Activity)
    if(metas[activityId]){
       delete metas[activityId]
    }
}

// 检测开启special offer 活动
ActivityManager.checkSpecialOffer = function() {
    let localData = this.GetLocalData()
    for (let activityId in localData) {
        if (localData[activityId].isActive) {
            let meta = this.GetMeta(activityId)
            if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.SubType() === Meta.ActivityMeta.SubTypes.SpecialOffer) {
                return
            }
        }
    }
    if (ActivityManager.GetActiveShopActivity()) return

    if (G.getRandomFloat(0, 1) < 0.8) return
    
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Activity)
    let result = []
    let weights = []

    for(let activityId in metas) {
        let meta = metas[activityId]
        if (meta.IsActive()) {
            if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.SubType() === Meta.ActivityMeta.SubTypes.SpecialOffer) { 
                if (!this.CheckEnable(meta)) {
                    continue
                }
                if (meta.IsInManyTimesCd()) continue

                result.push(meta)
                weights.push(meta.Param().ratio)
            }
        }
    }

    if (result.length <= 0) return

    let activityMeta = result[GameKit.FuncTools.getIndexByWeight(weights)]

    ActivityManager.activeLocalActivity(activityMeta.Id())

    AppKit.LogEventWrap.logEvent("activity_activelocal_specialoffer", {id: activityMeta.Id()})

    return true
}

/**收集活动
 * 1.新收集活�?
 * 2.原正常收集活�?
 */
ActivityManager.GetActiveNewCollectActivities = function() {
    let activities = ActivityManager.GetAllActiveActivityList()
    let result = []
    for (let i = 0; i < activities.length; i++) {
        let meta = activities[i]
        if (meta.Type() === Meta.ActivityMeta.Types.Game && (meta.SubType() === Meta.ActivityMeta.SubTypes.NewCollect || meta.SubType() === Meta.ActivityMeta.SubTypes.SlotCollect || meta.SubType() === Meta.ActivityMeta.SubTypes.SlotCollectRank)) result.push(meta)
    }
    return result
}

//检测限时卡牌开�?
ActivityManager.checkSubjectCard= function(){
    let subjectMeta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)
    if(subjectMeta){
        if(!CardLimitSkinAssetsSetting.isActive){
            CardLimitSkinAssetsSetting.isActive=true
            Meta.MetaManager.UpdateTypeData(Meta.MetaType.ActivityParams,null,Meta.MetaManager.GetMetas(Meta.MetaType.ActivityParamsb))
            let SubjectCardMetaAll=Meta.MetaManager.GetMetas(Meta.MetaType.CardAll)
            Meta.MetaManager.UpdateTypeData(Meta.MetaType.Card, null, SubjectCardMetaAll || {})//限时卡牌活动开启时合并普通卡牌数�?
            GamePlay.instance.preloadSubjectPrefab(subjectMeta.ShortName())
        }
        
    }else{
        if(CardLimitSkinAssetsSetting.isActive){
            CardLimitSkinAssetsSetting.isActive=false
            Meta.MetaManager.UpdateTypeData(Meta.MetaType.ActivityParams,null,Meta.MetaManager.GetMetas(Meta.MetaType.ActivityParamstemp))

            let CardMeta=Meta.MetaManager.GetMetas(Meta.MetaType.CardTemp)
            Meta.MetaManager.UpdateTypeData(Meta.MetaType.Card, null, CardMeta || {})//普通卡牌数�?
            GamePlay.instance.releaseSubjectPrefab()
        }
    }
}

Game.ActivityManager = ActivityManager
