import '../../LegacyGlobals';

//slot数据

export class UserSlot {
    public data: any;

    constructor (userId?: any) {
        this.data = {
            userId: userId,

            toraidUser: {userId:0, name:"", avatar:"", coin:0, expire:0, isFriend:false},

            dailyBonusDid: 0,
            dailyBonusDt: 0,
            dailyBonusTr: 0,
            dailyBonusTime:0,
        }
    }

    //更新数据
    updateData(data) {
        for (var key in data) {
            this.data[key] = data[key]
        }
        if (this.data.slotData.dailyBonusCount == null) this.data.slotData.dailyBonusCount = {normal:0, gold:0}
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
        return this
    }

    UserId() {
        return this.data.userId
    }

    ToraidUser() {
        if (this.data.toraidUser.isFriend && !this.data.toraidUser.name) {
            let friend = Game.SUser.FriendsList()[this.data.toraidUser.userId]
            if (friend == null) {
                this.data.toraidUser.name = GameKit.i18n.t("PlayerDefaultName")
                this.data.toraidUser.avatar = ""
            } else {
                this.data.toraidUser.name = friend.Name()
                this.data.toraidUser.avatar = friend.Avatar()
                this.data.toraidUser.isVip = friend.IsVip()
            }
        }
        return this.data.toraidUser
    }

    ToraidCoin() {
        return this.data.toraidUser.coin
    }
    
    UpdateDailyBonus() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        
        if (this.data.dailyBonusDid > 0) {
            this.data.dailyBonusDt += currentTime - this.data.dailyBonusTr
            let recPoint = Math.floor(this.data.dailyBonusDt / G.GameConstance.dailyBonusCD)
            if (recPoint > 0) {
                this.data.dailyBonusDt = 0
                this.data.dailyBonusDid = 0
            }
            //this.data.dailyBonusDt -= recPoint * G.GameConstance.dailyBonusCD
            //this.data.dailyBonusDid -= recPoint
            //if (this.data.dailyBonusDid <= 0) {
            //    this.data.dailyBonusDid = 0
            //    this.data.dailyBonusDt = 0
            //}
        }
        this.data.dailyBonusTr = currentTime
    }

    DailyBonusRemainTime() {
        if (this.data.dailyBonusDid <= 0) return 0
        return G.GameConstance.dailyBonusCD - (GameKit.TimeUtil.getCurrentTime() - this.data.dailyBonusTr + this.data.dailyBonusDt)
    }
    DailyBonusDid() {
        return this.data.dailyBonusDid
    }
    
    CanGetDailyBonus() {
        return this.data.dailyBonusDid < G.GameConstance.dailybonusMaxCount
    }

    IsFirstGoldBonus() {
        let goldCount = this.data.slotData.dailyBonusCount["gold"] || 0
        return goldCount <= 0
    }
}
