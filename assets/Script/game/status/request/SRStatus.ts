import '../../../LegacyGlobals';
var SRStatus = {}

//获取身份标记
//getUserStatus
SRStatus.getUserStatus = function() {
    let req = new GameKit.ServerRequest("getUserStatus")
    req.SetCallBack(function(res) {
        Game.SUserStatus.updateData(res.userdata)
        if (res.vipDailyReward) {
            GameKit.DataCache.SetData("vipDailyReward", res.vipDailyReward)
        }
    })
    return req
}

//等级奖励领奖
//getLevelBonusReward
SRStatus.getLevelBonusReward = function(id) {
    let req = new GameKit.ServerRequest("getLevelBonusReward")
    req.SetRequestBody("rewardId", id)
    return req
}

SR.SRStatus = SRStatus