import '../../../LegacyGlobals';
class ActivityMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ActivityMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    //名字
    ShortName() {
        return this._data.shortName || ""
    }
    Name() {
        return this._data.name
    }

    //类型
    Type() {
        return this._data.type
    }

    //子类�?
    SubType() {
        return this._data.subType
    }

    //描述
    Description() {
        return this._data.description
    }

    //图标
    Icon() {
        return this._data.icon
    }

    //图标跳转
    IconGoto() {
        return this._data.icon_goto
    }

    //面板
    Panel() {
        return this._data.panel
    }

    //插图
    Image() {
        return this._data.image
    }

    //显示时间
    PrepareTime() {
        return this._data.prepare_time
    }

    //开始时�?
    StartTime() {
        return this._data.start_time
    }

    //结束时间
    EndTime() {
        return this._data.end_time
    }

    //消失时间
    FinishTime() {
        return this._data.finish_time
    }

    //参数
    Param() {
        return this._data.param || {}
    }
    //卡组期数,每期15�?
    Card_issue() {
        return this._data.param.card_issue||1
    }
    //是否用户计时
    IsUserTime() {
        return !!this._data.user_time
    }

    //用户活动时间
    UserTime() {
        return this._data.user_time
    }

    //生效条件
    EnableTrigger() {
        if (!this._data.enable_trigger) return []
        if (this.enable_trigger == null) {
            this.enable_trigger = this._data.enable_trigger.split(";")
        }
        return this.enable_trigger
    }

    //商品id
    ShopId() {
        return this._data.shop_id
    }

    //商店ids
    ShopIds() {
        return this._data.shop_ids
    }

    HelpKey() {
        return this._data.help_key
    }

    //是否动态创�?-如各种道�?金蛋，气球等
    IsDymicTool(){
        return this._data.dymic || false
    }


    // Helper //

    //是否显示
    IsShowing() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        return (currentTime >= this.PrepareTime() && currentTime <= this.FinishTime())
    }
    //是否在活动中
    IsActive() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        return (currentTime >= this.StartTime() && currentTime <= this.EndTime())
    }
    //是否活动预告阶段
    IsPreShowing() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        return (currentTime >= this.PrepareTime() && currentTime < this.StartTime())
    }
    //是否活动收尾阶段
    IsEnding() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        return (currentTime > this.EndTime() && currentTime <= this.FinishTime())
    }

    //是否在多次触发的cd�?
    IsInManyTimesCd() {
        let localData = Game.ActivityManager.GetLocalData()[this.Id()]
        if (!localData) {
            return false
        }
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        return currentTime < localData.startTime + this.UserTime() + this.Param().cd
    }
    Activity_sorting(){
        return this._data.activity_sorting
    }
}

ActivityMeta.Types = {
    Pay: 1,
    Game: 2,
    Other: 3,
    Game2:4,
}

ActivityMeta.SubTypes = {
    //Pay
    SpecialOffer: 1,
    DaysSale: 2,
    Lucky10: 3,
    SalePack: 4,
    LadderPack: 5,
    PayFlyToSky:6,
    PayChoosePack:7,//自选礼�?
    PassPort:8,//通行�?
    HappyChoosePack:9,//新自选礼�?
    KittyBank:10,//储存�?
    CongRats:11,//6倍优惠卷
    SubjectCard:12,//限时卡牌活动
    NewPassPort:13,//新通行�?
    
    //Game
    AttackMaster: 1,
    RaidMaster: 2,
    BuildMaster: 3,
    Jigsaw: 4,
    Minigame: 5,
    Cannon: 6,
    SlotCollect: 7,
    SlotCollectRank: 8,
    CoinSlot: 9,
    NewCollect:11,//新收�?0服务端有内容，不能用10
    
    //Other
    GoldTrade: 1,
    BlackJack: 2,
    HugeSpins: 3,
    CollectFlag: 4,
    CrazySet: 5,
    BalloonFrenzy: 6,
    GuildBoss:8,
    NewCollectFlag:9,
    

    //Game2
    JackTravel:1,
    BetBlast:2,//老虎机加倍活�? // Complex
    CardTheme:10,
    VSBattle:12
    
}
ActivityMeta.GameSubTypesOrder = {
    201: 6,
    202: 7,
    203: 8,
    204: 98,
    205: 10,
    206: 99,
    207: 5,
    208: 4,
    209: 9,
    301: 10,
    302: 100,
    303: 11,
}

global.Meta.ActivityMeta = ActivityMeta