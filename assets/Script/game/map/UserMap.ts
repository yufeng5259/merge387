import '../../LegacyGlobals';
//大地图数据管�?
class UserMap {

    constructor (userId) {
        this.data = {
            userId: userId,

            elements: [],  // 元素数组，每个元素包�?{mapID:1,id: 1, level: 0, unlocked: false}
        }
    }

    //更新数据
    updateData(data) {
        for (var key in data) {
            this.data[key] = data[key]
        }
        return this
    }

    //获得数据
    getData() {
        let data = {}
        for (var key in this.data) {
            data[key] = data[key]
        }
        return data
    }

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
        return this
    }
    //初始化服务器数据
    initMapData(){
        let obj = Meta.MetaManager.GetMetas(Meta.MetaType.Map)
        let buildObj= Game.SUserVillage.GetBuildings();
        let comObj=Game.SUserVillage.GetComplete();
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const element = obj[key];
                var muserMap = this.initElement(element.MBId());
                muserMap.maxLv = element.MaxLevel();
                muserMap.stage=-1;
                muserMap.stageShow=0;
                //muserMap.unlocked = true;
            }
        }
        for (const key in buildObj) {
            if (Object.hasOwnProperty.call(buildObj, key)) {
                const element = buildObj[key];
                var muserMap = this.initElement(key)
                //{"1_2":{mapId:1,buildId:1,level:0}}
                muserMap.mapID = element.mapId;
                muserMap.id = element.buildId;
                muserMap.level = element.level;
                muserMap.stage = Number(element.stage) || 0;
                muserMap.stageShow=muserMap.stage;
                muserMap.activated = element.activated != null ? !!element.activated : muserMap.level > 0;
                muserMap.unlocked = true;
            }
        }
        for (const key in comObj) {
            if (Object.hasOwnProperty.call(comObj, key)) {
                const element = comObj[key];
                var muserMap = this.initElement(key)
                //{"1_2":{mapId:1,buildId:1,level:0}}
                muserMap.mapID = element.mapId;
                muserMap.id = element.buildId;
                muserMap.level = element.level;
                muserMap.stage = Number(element.stage) || 0;
                muserMap.stageShow=muserMap.stage;
                muserMap.activated = element.activated != null ? !!element.activated : true;
                muserMap.unlocked = true;
                muserMap.complte = true;
            }
        }
        console.log("init building data", Game.SUserMap.data);
    }
    // 初始化元素（如果不存在则创建�?
    initElement(mbId) {
        let element = this.getElement(mbId)
        let mbIds = mbId.split("_");
        if(mbIds.length<2){
            console.log("数据异常",mbId)
        }
        let mId = Number(mbIds[0]);
        let bId = Number(mbIds[1]);
        if (!element) {
            element = {
                sid:mbId,
                mapID:mId,
                id: bId,
                level: 0,
                maxLv:0,
                stage:-1,
                stageShow:0,
                activated:false,
                unlocked: false,
                complte:false
            }
            this.data.elements.push(element);
        }
        return element
    }

    // 获取元素
    getElement(sid) {
        return this.data.elements.find(e => e.sid === sid)
    }
    // 获取元素等级
    GetLevel(sid) {
        let element = this.getElement(sid)
        return element ? element.level : 0
    }
    //是否满级
    IsFullLevel(sid){
        let element = this.getElement(sid)
        return element ? element.level>=element.maxLv : false
    }
    // 获取元素是否解锁
    IsUnlocked(sid) {
        return this.IsLevelUnlocked(sid)
    }
    getNextSId(mbId){
        let mbIds = mbId.split("_");
        let mId = mbIds[0];
        let bId = Number(mbIds[1])+1;
        let sid = mId+"_"+bId;
        return sid
    }

    // 解锁元素（用于第一个元素或特殊解锁�?
    UnlockElement(sid) {
        let element = this.initElement(sid)
        element.unlocked = true
    }

    // 检查是否可以升�?
    CanLevelUp(sid) {
        return this.CanBuy(sid) || this.CanUpgrade(sid)
    }
    //红点,建筑物可升级
    IsRedPoint(){
        for (let index = 0; index < this.data.elements.length; index++) {
            const element = this.data.elements[index];
            if(this.IsLevelUnlocked(element.sid)&&!element.complte){
                let isUp = this.CanLevelUp(element.sid)
                if(isUp){
                    return true;
                }
            }
        }
        return false;
    }

}

UserMap.ElementState = {
    LevelLocked: "levelLocked",
    UnlockedNotBought: "unlockedNotBought",
    Bought: "bought",
    Full: "full",
}

UserMap.prototype.IsLevelUnlocked = function(sid) {
    let element = this.initElement(sid)
    let meta = Meta.MapMeta.GetMetaById(element.mapID, element.id)
    if (!meta) return false
    return Game.SUser.Level() >= meta.LimitLv()
}

UserMap.prototype.IsBought = function(sid) {
    let element = this.getElement(sid)
    if (!element) return false
    if (element.activated != null) return !!element.activated
    return !!(element.unlocked && element.level > 0)
}

UserMap.prototype.IsUnlockedNotBought = function(sid) {
    let element = this.initElement(sid)
    return this.IsLevelUnlocked(sid) && !this.IsBought(sid) && element.level < element.maxLv
}

UserMap.prototype.GetElementState = function(sid) {
    let element = this.initElement(sid)
    if (!this.IsLevelUnlocked(sid)) {
        return UserMap.ElementState.LevelLocked
    }
    if (!this.IsBought(sid)) {
        return UserMap.ElementState.UnlockedNotBought
    }
    if (element.level >= element.maxLv) {
        return UserMap.ElementState.Full
    }
    return UserMap.ElementState.Bought
}

UserMap.prototype.CanBuy = function(sid) {
    let context = this.GetBuildActionContext(sid)
    return !!(context && context.state === UserMap.ElementState.UnlockedNotBought && Game.SUser.Coin() >= context.price)
}

UserMap.prototype.CanUpgrade = function(sid) {
    let context = this.GetBuildActionContext(sid)
    return !!(context && context.state === UserMap.ElementState.Bought && Game.SUser.Coin() >= context.price)
}

UserMap.prototype.GetNextActionLevel = function(sid) {
    let element = this.initElement(sid)
    return this.IsBought(sid) ? element.level : 0
}

UserMap.prototype.GetStagePriceIndex = function(element, priceList) {
    let stage = element && element.stage != null ? Number(element.stage) : 0
    if (isNaN(stage) || stage < 0) stage = 0
    if (!Array.isArray(priceList) || priceList.length <= 0) return 0
    return Math.min(stage, priceList.length - 1)
}

UserMap.prototype.GetCurrentStage = function(element, priceList) {
    let stage = element && element.stage != null ? Number(element.stage) : 0
    if (isNaN(stage) || stage < 0) stage = 0
    if (!Array.isArray(priceList) || priceList.length <= 0) return stage
    return Math.min(stage, priceList.length)
}

UserMap.prototype.SumStagePrice = function(priceList, count) {
    if (!Array.isArray(priceList)) return 0
    let total = 0
    count = Math.max(0, Math.min(count, priceList.length))
    for (let i = 0; i < count; i++) {
        total += Number(priceList[i]) || 0
    }
    return total
}

UserMap.prototype.ParseStageReward = function(rewardStr) {
    let rewards = []
    if (!rewardStr) return rewards
    let parts = String(rewardStr).split("_")
    for (let i = 0; i < parts.length; i++) {
        if (!parts[i]) continue
        let content = Game.Content.FromString(parts[i])
        if (content) rewards.push(content)
    }
    return rewards
}

UserMap.prototype.ParseStageRewardGroups = function(rewardStr) {
    if (!rewardStr) return []
    let stages = String(rewardStr).split(";")
    let groups = []
    for (let i = 0; i < stages.length; i++) {
        groups.push(this.ParseStageReward(stages[i]))
    }
    return groups
}

UserMap.prototype.GetStageRewards = function(rewardStr, stage, maxStage) {
    let groups = this.ParseStageRewardGroups(rewardStr)
    if (groups.length <= 0) return []
    stage = Number(stage)
    if (isNaN(stage) || stage < 0) stage = 0
    if (maxStage > 0) stage = Math.min(stage, maxStage - 1)
    stage = Math.min(stage, groups.length - 1)
    return groups[stage] || []
}

UserMap.prototype.GetStageBigReward = function(rewardStr) {
    let groups = this.ParseStageRewardGroups(rewardStr)
    for (let i = groups.length - 1; i >= 0; i--) {
        let rewards = groups[i]
        if (rewards && rewards.length > 0) return rewards[rewards.length - 1]
    }
    return null
}

UserMap.prototype.GetBuildActionContext = function(sid, actionLevelOverride) {
    let element = this.initElement(sid)
    let meta = Meta.MapMeta.GetMetaById(element.mapID, element.id)
    let state = this.GetElementState(sid)
    let actionLevel = actionLevelOverride != null ? actionLevelOverride : this.GetNextActionLevel(sid)
    let rawPrice = meta ? meta.Price(actionLevel) : 0
    let priceList = Array.isArray(rawPrice) ? rawPrice : []
    let isStageUpgrade = priceList.length > 1
    let maxStage = isStageUpgrade ? priceList.length : 1
    let stageIndex = this.GetStagePriceIndex(element, priceList)
    let currentStage = this.GetCurrentStage(element, priceList)
    let price = isStageUpgrade ? (Number(priceList[stageIndex]) || 0) : (meta ? meta.ActionPrice(actionLevel, 0) : 0)
    let rewardStr = meta ? meta.Reward(actionLevel) : ""
    let displayRewards = isStageUpgrade
        ? this.GetStageRewards(rewardStr, stageIndex, maxStage)
        : Game.Content.Merge(Game.Content.FromStrings(rewardStr))
    let rewards = Game.Content.Merge(displayRewards)
    let bigReward = isStageUpgrade ? this.GetStageBigReward(rewardStr) : null
    let windowName = null

    if (state === UserMap.ElementState.UnlockedNotBought) windowName = "MapBuyBuildWindow"
    else if (state === UserMap.ElementState.Full) windowName = "MapBuildMaxLevelWindow"
    else if (state === UserMap.ElementState.Bought) windowName = isStageUpgrade ? "MapBuildStageUpgradeWindow" : "MapBuildUpgradeWindow"

    return {
        sid: sid,
        mapID: element.mapID,
        buildID: element.id,
        meta: meta,
        element: element,
        state: state,
        actionLevel: actionLevel,
        rawPrice: rawPrice,
        priceList: priceList,
        price: price,
        stage: element.stage,
        currentStage: currentStage,
        stageIndex: stageIndex,
        maxStage: maxStage,
        isStageUpgrade: isStageUpgrade,
        isLocked: state === UserMap.ElementState.LevelLocked,
        isFull: state === UserMap.ElementState.Full,
        isBought: this.IsBought(sid),
        displayRewards: displayRewards,
        rewards: rewards,
        rewardStr: rewardStr,
        bigReward: bigReward,
        stagePaidPrice: this.SumStagePrice(priceList, currentStage),
        stageTotalPrice: this.SumStagePrice(priceList, priceList.length),
        canAction: state !== UserMap.ElementState.LevelLocked && state !== UserMap.ElementState.Full && Game.SUser.Coin() >= price,
        windowName: windowName,
    }
}

global.Game.UserMap = UserMap
