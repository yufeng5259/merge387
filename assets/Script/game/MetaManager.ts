import '../LegacyGlobals';

import '../GameKit/ui/meta/WindowOrderMeta'
import './mergeTutorial/meta/MergeTutorialMeta'
import './mergeTutorial/meta/MergeTutorialGuideMeta'
import './mergeTutorial/meta/MergeTutorialTriggerMeta'
import './shop/meta/ShopDailyMeta'
import './shop/meta/ShopHotMeta'
import './merge/OrderMeta'
import './merge/OrderSlotMeta'
import './story/meta/StoryMeta'

const MetaManager: any = {_data:{}}

Meta.MetaType = {
    Shop: "shop",
    ShopCoin: "shopCoin",
    ShopDaily: "shopDaily",
    ShopHot: "shopHot",
    AdGetCoin: "adGetCoin",
    SystemUser: "systemUser",
    GiftGet: "giftGet",
    WindowOrder: "windowOrder",
    DailyBonusReward: "dailyBonusReward",
    PackItem: "packItem",
    DynamicPack: "dynamicPack",
    RandomPack: "randomPack",
    CardSets: "cardSets",
    Card: "card",
    CardTemp: "cardTemp",//收集活动的备份数据 card
    CardAll: "CardAll",//收集活动的备份数据  card+subjectCard
    ShopCardPrice: "shopCardPrice",
    CardChest: "cardChest",
    
    Activity: "activity",
    ActivityParams: "activityParams",
    ActivityParamstemp: "activityParamstemp",//收集活动的备份数据
    ActivityParamsb: "activityParamsb",//限时卡牌开启时的收集奖励表数据
    CannonReward:"cannonreward",

    Task: "task",
    Sign: "sign",
    Item: "item",
    CashShop: "cashShop",
    CashTask: "cashTask",
    LevelBonus: "levelBonus",
    RankReward:"RankReward",
    
    giftActivity:"giftActivity",
    packreward:"packreward",

    InviteRewards:"inviteRewards",

    ChoosePackReward:"ChoosePackReward",
    ActivityChoosePack:"ActivityChoosePack",
    GuildBossMonster:"guildBossMonster",
    GuildBossRank:"guildBossRank",
	PassPort:"passPort",
    PassPortShop:"passPortShop",
    PassPortTask:"passPortTask",
    ShopRewards:"shopRewards",

    //loginWindow轮播文字
    PromptScript:"promptScript",
    SubjectCard:"SubjectCard",


    // 合成
    MergeGenerater:"mergeGenerater",
    MergeElements:"mergeElements",
    MergeType:"mergeType",
    MergeOrders:"mergeOrders",
    Order:"order",
    OrderSlot:"orderSlot",
    MergeWharehouse:"mergeWharehouse",
    MergeBgElements:"mergeBgElements",
    MergeCookingRecipe:"mergeCookingRecipe",
    NewpassPort:"newpassPort",
    NewpassPortTask:"newpassPortTask",
    //小镇
    StoryUser:"storyUser",
    Map:"map",
    Level:"level",
    MapStory:"MapStory",

    GiftPackageItems:"giftPackageItems",
    MergeTutorial:"mergeTutorial",
    MergeTutorialGuide:"mergeTutorialGuide",
    MergeTutorialTrigger:"mergeTutorialTrigger",

    Story:"Story"

}

//初始数据
MetaManager.init = function(rawMetaData: any) {
    this.Clean()

    let metaData: any = {}
    for (let table in rawMetaData) {
        metaData[table] = {}
        let rawData = rawMetaData[table]
        let keys = rawData.keys
        if (keys) {
            for (let kid in rawData) {
                if (kid != "keys") {
                    let id = parseInt(kid)
                    metaData[table][id] = {}
                    for (let i = 0; i < keys.length; i++) {
                        metaData[table][id][keys[i]] = rawData[kid][i]
                    }
                }
            }
        }
    }

    console.log('metaData',metaData);

    this.GetConstance(metaData.constance)

    this.SetTypeData(Meta.MetaType.Item, Meta.ItemMeta.MakeEntity, metaData[Meta.MetaType.Item] || {})
    this.SetTypeData(Meta.MetaType.Shop, Meta.ShopMeta.MakeEntity, metaData[Meta.MetaType.Shop] || {})
    this.SetTypeData(Meta.MetaType.ShopCoin, Meta.ShopCoinMeta.MakeEntity, metaData[Meta.MetaType.ShopCoin] || {})
    this.SetTypeData(Meta.MetaType.ShopDaily, Meta.ShopDailyMeta.MakeEntity, metaData[Meta.MetaType.ShopDaily] || {})
    this.SetTypeData(Meta.MetaType.ShopHot, Meta.ShopHotMeta.MakeEntity, metaData[Meta.MetaType.ShopHot] || {})
    AppKit.PaymentWrap.SetByMeta(MetaManager.GetMetas(Meta.MetaType.Shop))
    this.SetTypeData(Meta.MetaType.PackItem, Meta.PackItemMeta.MakeEntity, metaData[Meta.MetaType.PackItem] || {})
    this.SetTypeData(Meta.MetaType.DynamicPack, Meta.DynamicPackMeta.MakeEntity, metaData[Meta.MetaType.DynamicPack] || {})
    Meta.DynamicPackMeta.CacheMeta()
    this.SetTypeData(Meta.MetaType.RandomPack, Meta.RandomPackMeta.MakeEntity, metaData[Meta.MetaType.RandomPack] || {})
    Meta.RandomPackMeta.CacheMeta()
    this.SetTypeData(Meta.MetaType.AdGetCoin, Meta.AdGetCoinMeta.MakeEntity, metaData[Meta.MetaType.AdGetCoin] || {})
    this.SetTypeData(Meta.MetaType.SystemUser, Meta.SystemUserMeta.MakeEntity, metaData[Meta.MetaType.SystemUser] || {})
    Meta.SystemUserMeta.CacheUser()
    this.SetTypeData(Meta.MetaType.GiftGet, Meta.GiftGetMeta.MakeEntity, metaData[Meta.MetaType.GiftGet] || {})
    this.SetTypeData(Meta.MetaType.WindowOrder, Meta.WindowOrderMeta.MakeEntity, metaData[Meta.MetaType.WindowOrder] || {})
    this.SetTypeData(Meta.MetaType.MergeTutorial, Meta.MergeTutorialMeta.MakeEntity, metaData[Meta.MetaType.MergeTutorial] || {})
    this.SetTypeData(Meta.MetaType.MergeTutorialGuide, Meta.MergeTutorialGuideMeta.MakeEntity, metaData[Meta.MetaType.MergeTutorialGuide] || {})
    this.SetTypeData(Meta.MetaType.MergeTutorialTrigger, Meta.MergeTutorialTriggerMeta.MakeEntity, metaData[Meta.MetaType.MergeTutorialTrigger] || {})
    this.SetTypeData(Meta.MetaType.DailyBonusReward, Meta.DailyBonusRewardMeta.MakeEntity, metaData[Meta.MetaType.DailyBonusReward] || {})
    this.SetTypeData(Meta.MetaType.CardSets, Meta.CardSetsMeta.MakeEntity, metaData[Meta.MetaType.CardSets] || {})
    this.SetTypeData(Meta.MetaType.Card, Meta.CardMeta.MakeEntity, metaData[Meta.MetaType.Card] || {})
    // this.MergeTypeData(Meta.MetaType.Card, Meta.CardMeta.MakeEntity, metaData[Meta.MetaType.SubjectCard] || {})//合并数据
    this.SetTypeData(Meta.MetaType.SubjectCard, Meta.CardMeta.MakeEntity, metaData[Meta.MetaType.SubjectCard] || {})//限时主题卡，因为数据结构一样的，所以还是用CardMeta
    this.SetTypeData(Meta.MetaType.CardTemp, Meta.CardMeta.MakeEntity, metaData[Meta.MetaType.Card] || {})
    this.SetTypeData(Meta.MetaType.CardAll, Meta.CardMeta.MakeEntity, this.MergeData(metaData[Meta.MetaType.Card],metaData[Meta.MetaType.SubjectCard]) || {})
    // CardTemp: "cardTemp",//收集活动的备份数据 card
    // CardAll: "CardAll",
    // console.log(this.GetMetas(Meta.MetaType.CardTemp),'1111');
    // console.log(this.GetMetas(Meta.MetaType.CardAll),'pppp');

    this.SetTypeData(Meta.MetaType.ShopCardPrice, Meta.ShopCardPriceMeta.MakeEntity, metaData[Meta.MetaType.ShopCardPrice] || {})
    this.SetTypeData(Meta.MetaType.CardChest, Meta.CardChestMeta.MakeEntity, metaData[Meta.MetaType.CardChest] || {})
    
    this.SetTypeData(Meta.MetaType.Activity, Meta.ActivityMeta.MakeEntity, metaData[Meta.MetaType.Activity] || {})
    Game.ActivityManager.GetConstance(metaData.activityConstance)
    this.SetTypeData(Meta.MetaType.ActivityParams, Meta.ActivityParamsMeta.MakeEntity, metaData[Meta.MetaType.ActivityParams] || {})
    this.SetTypeData(Meta.MetaType.ActivityParamstemp, Meta.ActivityParamsMeta.MakeEntity, metaData[Meta.MetaType.ActivityParams] || {})
    this.SetTypeData(Meta.MetaType.ActivityParamsb, Meta.ActivityParamsMeta.MakeEntity, metaData[Meta.MetaType.ActivityParamsb] || {})

    this.SetTypeData(Meta.MetaType.RankReward, Meta.RankRewardMeta.MakeEntity, metaData[Meta.MetaType.RankReward] || {})
    this.SetTypeData(Meta.MetaType.Task, Meta.TaskMeta.MakeEntity, metaData[Meta.MetaType.Task] || {})
    this.SetTypeData(Meta.MetaType.Sign, Meta.SignMeta.MakeEntity, metaData[Meta.MetaType.Sign] || {})
    this.SetTypeData(Meta.MetaType.CashShop, Meta.CashShopMeta.MakeEntity, metaData[Meta.MetaType.CashShop] || {})
    this.SetTypeData(Meta.MetaType.CashTask, Meta.CashTaskMeta.MakeEntity, metaData[Meta.MetaType.CashTask] || {})
    this.SetTypeData(Meta.MetaType.LevelBonus, Meta.LevelBonusMeta.MakeEntity, metaData[Meta.MetaType.LevelBonus] || {})
    // 金蛋活动
    this.SetTypeData(Meta.MetaType.giftActivity, Meta.giftActivityMeta.MakeEntity, metaData[Meta.MetaType.giftActivity] || {})
    this.SetTypeData(Meta.MetaType.packreward, Meta.packrewardMeta.MakeEntity, metaData[Meta.MetaType.packreward] || {})
    //邀请好友奖励
    this.SetTypeData(Meta.MetaType.InviteRewards, Meta.InviteRewardsMeta.MakeEntity, metaData[Meta.MetaType.InviteRewards] || {})
    //自选礼包
    this.SetTypeData(Meta.MetaType.ChoosePackReward, Meta.ChoosePackRewardPackMeta.MakeEntity, metaData[Meta.MetaType.ChoosePackReward] || {})
    this.SetTypeData(Meta.MetaType.ActivityChoosePack, Meta.ActivityChoosePackMeta.MakeEntity, metaData[Meta.MetaType.ActivityChoosePack] || {})

    //工会boss
    this.SetTypeData(Meta.MetaType.GuildBossMonster, Meta.GuildBossMonsterMeta.MakeEntity, metaData[Meta.MetaType.GuildBossMonster] || {})
    this.SetTypeData(Meta.MetaType.GuildBossRank, Meta.GuildBossRankMeta.MakeEntity, metaData[Meta.MetaType.GuildBossRank] || {})

    //通行证
    this.SetTypeData(Meta.MetaType.PassPort, Meta.PassPortMeta.MakeEntity, metaData[Meta.MetaType.PassPort] || {})
    this.SetTypeData(Meta.MetaType.PassPortShop, Meta.PassPortShopMeta.MakeEntity, metaData[Meta.MetaType.PassPortShop] || {})
    this.SetTypeData(Meta.MetaType.PassPortTask, Meta.PassPortTaskMeta.MakeEntity, metaData[Meta.MetaType.PassPortTask] || {})
    this.SetTypeData(Meta.MetaType.ShopRewards, Meta.ShopRewardsMeta.MakeEntity, metaData[Meta.MetaType.ShopRewards] || {})
    // 合成icon
    this.SetTypeData(Meta.MetaType.MergeGenerater, Meta.MergeGeneraterMeta.MakeEntity, metaData[Meta.MetaType.MergeGenerater] || {})
    this.SetTypeData(Meta.MetaType.MergeElements, Meta.MergeElementsMeta.MakeEntity, metaData[Meta.MetaType.MergeElements] || {})
    this.SetTypeData(Meta.MetaType.MergeType, Meta.MergeElementsTypeMeta.MakeEntity, metaData[Meta.MetaType.MergeType] || {})
	this.SetTypeData(Meta.MetaType.MergeOrders, Meta.MergeOrdersMeta.MakeEntity, metaData[Meta.MetaType.MergeOrders] || {})
    this.SetTypeData(Meta.MetaType.Order, Meta.OrderMeta.MakeEntity, metaData[Meta.MetaType.Order] || {})
    this.SetTypeData(Meta.MetaType.OrderSlot, Meta.OrderSlotMeta.MakeEntity, metaData[Meta.MetaType.OrderSlot] || {})
    this.SetTypeData(Meta.MetaType.MergeWharehouse, Meta.MergeWharehouseMeta.MakeEntity, metaData[Meta.MetaType.MergeWharehouse] || {})
    this.SetTypeData(Meta.MetaType.MergeBgElements, Meta.MergeBgElementsMeta.MakeEntity, metaData[Meta.MetaType.MergeBgElements] || {})
    this.SetTypeData(Meta.MetaType.MergeCookingRecipe, Meta.MergeCookingRecipeMeta.MakeEntity, metaData[Meta.MetaType.MergeCookingRecipe] || {})
    //新通行证
    this.SetTypeData(Meta.MetaType.NewpassPort, Meta.NewPassPortMeta.MakeEntity, metaData[Meta.MetaType.NewpassPort] || {})
    this.SetTypeData(Meta.MetaType.NewpassPortTask, Meta.NewPassPortTaskMeta.MakeEntity, metaData[Meta.MetaType.NewpassPortTask] || {})

    this.SetTypeData(Meta.MetaType.StoryUser, Meta.StoryUserMeta.MakeEntity, metaData[Meta.MetaType.StoryUser] || {})
    this.SetTypeData(Meta.MetaType.Map, Meta.MapMeta.MakeEntity, metaData[Meta.MetaType.Map] || {})
    this.SetTypeData(Meta.MetaType.Level, Meta.LevelMeta.MakeEntity, metaData[Meta.MetaType.Level] || {})
    this.SetTypeData(Meta.MetaType.GiftPackageItems, Meta.GiftPackageItemsMeta.MakeEntity, metaData[Meta.MetaType.GiftPackageItems] || {})
    this.SetTypeData(Meta.MetaType.Story, Meta.StoryMeta.MakeEntity, metaData[Meta.MetaType.Story] || {})

}

//清空
MetaManager.Clean = function() {
    this._data = {}
}

MetaManager.MergeData = function(data1, data2){
    for (let id in data2) {
        data1[id]=data2[id]
    }
    return data1
}

MetaManager.MergeTypeData = function(metaType, entityMethod, data){
    try {
        for (let id in data) {
            let meta = data[id]
            // let meta = entityMethod(md)
            this._data[metaType][meta.Id()] = meta
        }
    } catch (e) {
        Logs.Error("MetaManager.SetTypeData", metaType, e.message)
    }
}
MetaManager.DeleteTypeData = function(metaType, entityMethod, data){
    try {
        for (let id in data) {
            let meta = data[id]
            // let meta = entityMethod(md)
            if(this._data[metaType][meta.Id()]){
                delete this._data[metaType][meta.Id()]
            }
            // this._data[metaType][meta.Id()] = meta
            // console.log(meta.Id(),'xxx',meta);
        }
    } catch (e) {
        Logs.Error("MetaManager.SetTypeData", metaType, e.message)
    }
}
MetaManager.UpdateTypeData = function(metaType, entityMethod, data){
    try {
        this._data[metaType] = {}
        for (let id in data) {
            let meta = data[id]
            // let meta = entityMethod(md)
            this._data[metaType][meta.Id()] = meta
            // console.log(meta.Id(),'xxx',meta);
        }
    } catch (e) {
        Logs.Error("MetaManager.SetTypeData", metaType, e.message)
    }
}

//设置meta类型数据
MetaManager.SetTypeData = function(metaType, entityMethod, data) {
    try {
        this._data[metaType] = {}
        for (let id in data) {
            let md = data[id]
            let meta = entityMethod(md)
            this._data[metaType][meta.Id()] = meta
            // console.log(meta.Id(),'xxx',meta);
        }
    } catch (e) {
        Logs.Error("MetaManager.SetTypeData", metaType, e.message)
    }
}
//合并剧情数据id=1_1
MetaManager.InitTypeStoryData = function(metaType, entityMethod, data){
    try {
        if(this._data[metaType]==undefined){
            this._data[metaType]={};
        }
        for (let id in data) {
            let md = data[id]
            let meta = entityMethod(md)
            this._data[metaType][meta.Id()] = meta
            // console.log(meta.Id(),'xxx',meta);
        }
    } catch (e) {
        Logs.Error("MetaManager.SetTypeData", metaType, e.message)
    }
}
//获得某条meta
MetaManager.GetMeta = function(metaType, id) {
    if (this._data[metaType] == null) return null
    return this._data[metaType][id]
}

//获得某类型meta
MetaManager.GetMetas = function(metaType) {
    return this._data[metaType]
}

//设定常量
MetaManager.GetConstance = function(data) {
    
    try {
        for(let id in data) {
            let kvp = data[id]
            G.GameConstance[kvp.key] = kvp.value
            if (typeof kvp.value === "string") {
                if ((kvp.value.startsWith("[") && kvp.value.endsWith("]")) || (kvp.value.startsWith("{") && kvp.value.endsWith("}"))) {
                    G.GameConstance[kvp.key] = JSON.parse(kvp.value)
                }
            }
        }
    } catch (e) {
        Logs.Error("MetaManager.GetConstance", e.message)
    }
}

global.Meta.MetaManager = MetaManager


