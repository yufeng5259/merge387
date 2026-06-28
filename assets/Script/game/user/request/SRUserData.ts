import '../../../LegacyGlobals';
var SRUserData = {}

//获取用户游戏数据
SRUserData.getData = function() {
    let req = new GameKit.ServerRequest("getUserData")
    req.SetCallBack(function(res) {
        Game.SUser.updateData(res.userdata)
        if (SR && SR.SRMerge && SR.SRMerge.ApplyLatestLocalResourceShadow) {
            SR.SRMerge.ApplyLatestLocalResourceShadow("getUserData")
        }
    })
    return req
}

//看视频获得体�?
SRUserData.finishVideoAp = function() {
    let req = new GameKit.ServerRequest("finishVideoAp")
    return req
}

//看视频获得金�?
SRUserData.finishVideoCoin = function(byTip = false) {
    let req = new GameKit.ServerRequest("finishVideoCoin")
    req.SetRequestBody("byTip", !!byTip)
    return req
}

//看视频获得金�?
SRUserData.finishVideoSlotCoin6 = function() {
    let req = new GameKit.ServerRequest("finishVideoSlotCoin6")
    return req
}

//看视频获得盾�?
SRUserData.finishVideoShield = function() {
    let req = new GameKit.ServerRequest("finishVideoShield")
    return req
}

//看视频获得小礼物
SRUserData.finishVideoPeterGift = function() {
    let req = new GameKit.ServerRequest("finishVideoPeterGift")
    return req
}

//看视频获得小礼物
SRUserData.finishVideoLuckyDraw = function() {
    let req = new GameKit.ServerRequest("finishVideoLuckyDraw")
    return req
}

//心跳
SRUserData.heartBeat = function() {
    let req = new GameKit.ServerRequest("heartBeat")
    req.SetSilence(true)
    return req
}

//现金任务奖励
SRUserData.cashTaskGet = function(taskId) {
    let req = new GameKit.ServerRequest("cashTaskGet")
    req.SetRequestBody("taskId", taskId)
    return req
}

//现金兑换
SRUserData.cashExchange = function(shopId) {
    let req = new GameKit.ServerRequest("cashExchange")
    req.SetRequestBody("shopId", shopId)
    return req
}
/////////////////////新增merge
// //领取升级奖励
// SRUserData.getLevelReward = function(level) {
//     let req = new GameKit.ServerRequest("getLevelReward")
//     req.SetRequestBody("level", level)
//     return req
// }
//保存用户头像，昵称和头像�?
SRUserData.saveAvatarInfo = function(avatar,name) {
    let req = new GameKit.ServerRequest("setUserAvatar")
    req.SetRequestBody("avatar", avatar)
    req.SetRequestBody("name", name)
    return req
}


SR.SRUserData = SRUserData
