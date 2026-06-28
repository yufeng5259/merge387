import '../../../LegacyGlobals';
var SRCard = {}

// old-api

// //获取用户游戏数据
// SRCard.getData = function() {
//     let req = new GameKit.ServerRequest("getUserCard")
//     req.SetCallBack(function(res) {
//         Game.SUserCard.updateData(res.userdata)
//     })
//     return req
// }

// SRCard.getReward = function(setId) {
//     let req = new GameKit.ServerRequest("getCardReward")
//     req.SetRequestBody("setId", setId)
//     req.SetCallBack(function(res) {
//         Game.SUserCard.GetSetsReward(setId)
//     })
//     return req
// }

// new-api

/**
 * 获取用户游戏数据
 * 大概�?Game.SUserCard.CardNum() 方法功能相同
 */
SRCard.getUserCard = () => {
    let req = new GameKit.ServerRequest("getUserCard")
    req.SetCallBack(function(res) {
        Game.SUserCard.updateData(res.userdata)
    })
    return req
}

/**
 * 获取卡牌奖励
 * @param {number} setId
 */
SRCard.getCardReward = (setId) => {
    let req = new GameKit.ServerRequest("getCardReward")
    req.SetRequestBody("setId", setId)
    return req
}

/**
 * 向朋友赠送卡�?
 * @param {number} friendUserId 朋友的user-id
 * @param {number[]} ids 卡片id列表
 */
SRCard.cardSend = (friendUserId, ids) => {
    let req = new GameKit.ServerRequest("cardSend")
    req.SetRequestBody("friendUserId", friendUserId)
    req.SetRequestBody("ids", ids)
    return req
}

// 广告箱子
SRCard.watchChest = () => {
    let req = new GameKit.ServerRequest("watchChest")
    return req
}

//换小丑卡
SRCard.changeJoker = (cid) => {
    let req = new GameKit.ServerRequest("changeJoker")
    req.SetRequestBody("chooseId", cid)
    return req
}
//星星换卡�?
SRCard.changeStar = (ChestType,deleteCard)=>{
    let req = new GameKit.ServerRequest("treasureChestExchange")
    req.SetRequestBody("msg",{"ChestType": ChestType,"deleteCard":deleteCard})
    return req
}
//星星换卡牌奖励次�?
SRCard.changeStarNum = ()=>{
    let req = new GameKit.ServerRequest("numberOfAwards")
    return req
}
//星星换卡牌刷新宝�?
SRCard.changeStarRefresh = (type,coin)=>{
    let req = new GameKit.ServerRequest("coinRefreshCase")
    req.SetRequestBody("msg",{"type": type,"coin":coin})
    return req
}

SR.SRCard = SRCard

SRCard.recordJokerCountData = (jockerBoxId,cb)=>{
    let req = new GameKit.ServerRequest("recordJokerCountData")
    req.SetRequestBody("msg",jockerBoxId)
    req.SetCallBack(function(res) {
        cb(res);
    })
    return req
}