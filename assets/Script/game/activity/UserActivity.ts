import '../../LegacyGlobals';
//用户活动

class UserActivity {

    constructor (userId) {
        this.data = {
            userId: userId,
            activityData: {},
            symbolRankData: {},
            collectFlagData: {},
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

    GetActivityData(activityId) {
        return this.data.activityData[activityId] || {}
    }

    GetSymbolRankData() {
        return this.data.symbolRankData || {}
    }

    GetCollectFlagData() {
        return this.data.collectFlagData || {}
    }

    GetPassportCollectFlagData() {
        return this.data.passportCollectFlagData || {}
    }

    GetGameActivityBadgeState() {
        return false
    }
    GetGameActivityBadgeStateByType(type) {
        let activityMeta = Game.ActivityManager.GetActiveGameActivityByType(type)
        if (!activityMeta) return false
        return false
    }
}

global.Game.UserActivity = UserActivity