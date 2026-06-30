import '../../LegacyGlobals';
//用户金币

export class UserCard {
    public data: any;

    constructor(userId?: any) {
        this.data = {
            userId: userId,
            cardData: {},     //卡片数据 id:num
            rewardData: {},     //领奖数据 setId:bool

            freeCount: 0,
            freeTime: 0,

            jokerCount: 0,
            jokerTime: 0,
            jokerGuarData: {},  //{chestId: count}

            starChangeCdTime: {}, //星星换箱子cd时间
            starChangeReset:{}, //星星换箱子刷新消�?
            canBuy:{},//星星换箱子是否可以购�?
        }
    }

    createNew(dbdata) {

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

    CardData() {
        return this.data.cardData
    }

    CardNum(id) {
        return this.data.cardData[id] || 0
    }

    HaveCard(id) {
        return this.data.cardData[id] && this.data.cardData[id] > 0
    }

    SetHaveCards(setId) {
        let cards = []
        for(let i = 1; i <= 9; i++) {
            let cid = Meta.CardMeta.GetId(setId, i)
            if (this.HaveCard(cid)) cards.push(cid)
        }
        return cards
    }

    AddCard(id) {
        let num = this.data.cardData[id] || 0
        this.data.cardData[id] = num + 1
    }

    DeleteCard(id) {
        let num = this.data.cardData[id] || 1
        this.data.cardData[id] = num - 1
    }

    HasgotSetsReward(setId) {
        return !!this.data.rewardData[setId]
    }

    GetSetsReward(setId) {
        this.data.rewardData[setId] = true
    }

    Star() {
        let star = 0
        for (let id in this.data.cardData) {
            if (this.data.cardData[id] <= 0 || id.length >= 6) continue
            let metaCard=Meta.MetaManager.GetMeta(Meta.MetaType.Card, id)
            // if(metaCard){
            //     star += metaCard.Rare()
            // }else{
            //     metaCard=Meta.MetaManager.GetMeta(Meta.MetaType.SubjectCard, id)
            //     if(metaCard){
            //         star += metaCard.Rare()
            //     }
            // }
            if(metaCard){
                star += metaCard.Rare()
            }

            // star += Meta.MetaManager.GetMeta(Meta.MetaType.Card, id).Rare()
        }
        return star
    }

    CheckDailyLimit() {
        let sendCardTime = GameKit.PlayerPrefs.GetInt("sendCardTime", 0)
        if (GameKit.TimeUtil.getCurrentDay() !== sendCardTime) {
            GameKit.PlayerPrefs.SetInt("sendCardCount", 0)
            GameKit.PlayerPrefs.SetInt("sendCardTime", GameKit.TimeUtil.getCurrentDay())
        }
        let sendCardCount = GameKit.PlayerPrefs.GetInt("sendCardCount", 0)
        if (sendCardCount >= G.GameConstance.dailyMaxSendCard) {
            return false
        }
        return true
    }

    /** 获取当前天剩余的count */
    GetDailyCount() {
        let sendCardTime = GameKit.PlayerPrefs.GetInt("sendCardTime", 0)
        if (GameKit.TimeUtil.getCurrentDay() !== sendCardTime) {
            GameKit.PlayerPrefs.SetInt("sendCardCount", 0)
            GameKit.PlayerPrefs.SetInt("sendCardTime", GameKit.TimeUtil.getCurrentDay())
        }
        let sendCardCount = GameKit.PlayerPrefs.GetInt("sendCardCount", 0)
        return G.GameConstance.dailyMaxSendCard - sendCardCount
    }

    //小丑�?
    JokerCount() {
        if (GameKit.TimeUtil.getCurrentTime() > this.data.jokerTime) {
            this.data.jokerCount = 0
        }
        return this.data.jokerCount
    }

    //小丑卡过期时�?
    JokerTime() {
        return this.data.jokerTime
    }

    //小丑卡保底数�?
    JokerGuarData(chestId) {
        if (!this.data.jokerGuarData) return 0
        return this.data.jokerGuarData[chestId] || 0
    }

    //小丑卡购买数�?
    jokerCountData(chestId) {
        if (!this.data.jokerCountData) return 0
        return this.data.jokerCountData[chestId] || 0
    }

    //星星换箱子cd时间 (cd结束时间�?
    StarChangeCdTime(index) {
        this.data.starChangeCdTime = this.data.starChangeCdTime || {}
        return this.data.starChangeCdTime[index] || 0
    }
    
    //星星换箱子重置消�?(金币消�?
    starChangeReset(index) {
        this.data.starChangeReset = this.data.starChangeReset || {}
        return this.data.starChangeReset[index] || 0
    }
    //星星换箱子是否可以购�?
    starChangeCanBuy(index) {
        this.data.canBuy = this.data.canBuy || {}
        return this.data.canBuy[index] || false
    }

}

global.CLOSE_Card = false