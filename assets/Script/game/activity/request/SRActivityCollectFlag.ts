import '../../../LegacyGlobals';
var SRActivityCollectFlag = {}

//领取奖励
SRActivityCollectFlag.CollectReward = function(level) {
    let req = new GameKit.ServerRequest("CollectReward")
    req.SetRequestBody("level", level)
    return req
}

//领取king奖励
SRActivityCollectFlag.CollectKingReward = function(level) {
    let req = new GameKit.ServerRequest("CollectKingReward")
    req.SetRequestBody("level", level)
    return req
}

//批量领取奖励
SRActivityCollectFlag.CollectAllReward = function(levels, levels_king) {
    let req = new GameKit.ServerRequest("CollectAllReward")
    req.SetRequestBody("levels", levels)
    req.SetRequestBody("levels_king", levels_king)
    return req
}

///---------------------------------------------------------------
//购买通行�?
SRActivityCollectFlag.BuyPassport = function(type=1) {
    let req = new GameKit.ServerRequest("BuyPassport")
    req.SetRequestBody("type", type)
    return req
}

SR.SRActivityCollectFlag = SRActivityCollectFlag