import '../../LegacyGlobals';
//用户身份

class UserStatus {

    constructor (userId) {
        this.data = {
            userId: userId,

            firstPurchase: false,
            purchaseMoney: 0,

            //newPlayerPackTime: 0,         //首次礼包出现时间
            //newPlayerPackdt: 0,           //首次礼包上次记录时间
            newPlayerPackTime2: 0,          //首次礼包过期时间

            doubleTicketTime: 0,            //双倍券时间
            doubleTicketRate: 0,            //双倍券倍率

            vipTime: 0,                     //vip到期时间
            vipToken: "",                   //vip 校验token
            trial: false,
            vipDailyDay: 0,                 //vip 每日奖励上一次day

            vipExtraReward: [],             //vip未获得额外奖�?
            vipExtraTime: 0,                //vip未获得额外奖励剩余时�?
            vipExtraTimeLast: 0,            //vip未获得额外奖励上一次time

            levelBonusOpens: 0,             //购买到了 什么阶段的 等级奖励
            levelBonusGet: [],              //等级奖励已经领取的id
        }
    }

    //更新数据
    updateData(data) {
        for (var key in data) {
            this.data[key] = data[key]
        }
        if (this.thisVip == undefined) {
            if (this.IsVipNow()) {
                this.thisVip = true
            }
        }
        this.data.vipExtraReward = Game.Content.FromContents(this.data.vipExtraReward)
        return this
    }

    //获得数据
    getData() {
        let data = {}
        for (var key in this.data) {
            data[key] = this.data[key]
        }
        return data
    }

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
    }

    UserId() {
        return this.data.userId
    }

    IsFirstPurchased() {
        return this.data.firstPurchase
    }
    
    SetFirstPurchased() {
        this.data.firstPurchase = true
    }

    GetPurchaseMoney() {
        return this.data.purchaseMoney
    }
    
    GetNewPlayerLeftTime() {
        /*this.data.newPlayerPackTime -= GameKit.TimeUtil.getCurrentTime() - this.data.newPlayerPackdt
        this.data.newPlayerPackdt = GameKit.TimeUtil.getCurrentTime()
        this.data.newPlayerPackTime = Math.max(0, this.data.newPlayerPackTime)
        return this.data.newPlayerPackTime*/
        if (this.data.newPlayerPackTime2 == 10) return 0
        return this.data.newPlayerPackTime2 - GameKit.TimeUtil.getCurrentTime()
    }

    DoubleTicketTime() {
        return this.data.doubleTicketTime
    }
    DoubleTicketRate() {
        return this.data.doubleTicketRate
    }

    IsVip() {
        return !!this.thisVip
    }

    IsVipNow() {
        return this.data.vipTime > GameKit.TimeUtil.getCurrentTime()
    }

    VipExtraReward() {
        return Game.Content.Merge(this.data.vipExtraReward)
    }

    VipExtraTime() {
        return this.data.vipExtraTime
    }
    VipExtraTimeLast() {
        return this.data.vipExtraTimeLast
    }
    UpdateExtraTime() {
        this.data.vipExtraTime -= GameKit.TimeUtil.getCurrentTime() - this.data.vipExtraTimeLast
        if (this.data.vipExtraTime <= 0) {
            this.data.vipExtraTime = 0
            this.data.vipExtraReward = []
        }
        this.data.vipExtraTimeLast = GameKit.TimeUtil.getCurrentTime()
    }

    LevelBonusOpens() {
        return this.data.levelBonusOpens
    }

    LevelBonusGet() {
        return this.data.levelBonusGet || []
    }
}

global.Game.UserStatus = UserStatus