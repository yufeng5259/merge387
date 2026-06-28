import '../../../LegacyGlobals';
// fendou 2021-9-23

var SRActivityPassport = {}
SR.SRActivityPassport = SRActivityPassport

/**
 * 获取任务列表
 * @param {number} activityMetaId
 */
 SRActivityPassport.getTaskList = (buyLevel) => {
    let sr = new GameKit.ServerRequest("GetTaskList")
    return sr
}

/**
 * 购买通行�?
 * @param {number} activityMetaId
 */
 SRActivityPassport.buyPassport = (buyLevel) => {
    let sr = new GameKit.ServerRequest("BuyPassport")
    sr.SetRequestBody("buyLevel", buyLevel)
    return sr
}

/**
 * //购买通行证等�?
 * @param {number} activityMetaId
 */
 SRActivityPassport.buyLevelPassport = (buyLevel) => {
    let sr = new GameKit.ServerRequest("BuyLevelPassport")
    sr.SetRequestBody("buyLevel", buyLevel)
    return sr
}

/**
 * //领取免费奖励
 * @param {number} activityMetaId
 */
 SRActivityPassport.cllectFreeReward = (level,packId) => {
    let sr = new GameKit.ServerRequest("CollectFreeReward")
    sr.SetRequestBody("packId", packId)
    sr.SetRequestBody("level", level)
    return sr
}
//领取通行证奖�?
SRActivityPassport.collectPassportReward = (level,packId) => {
    let sr = new GameKit.ServerRequest("CollectPassportReward")
    sr.SetRequestBody("packId", packId)
    sr.SetRequestBody("level", level)
    return sr
}

//领取所有奖�?
SRActivityPassport.collectAllReward = (free_levels,buy_levels) => {
    let sr = new GameKit.ServerRequest("CollectAllRewards")
    sr.SetRequestBody("free_levels", free_levels)
    sr.SetRequestBody("buy_levels", buy_levels)
    return sr
}
//--------------------------------------------------
//新通信证领取任�?
SRActivityPassport.NewPassportCollectTask = (taskId) => {
    let sr = new GameKit.ServerRequest("NewPassportCollectTask")
    sr.SetRequestBody("taskId", taskId)
    return sr
}
//新通信证领取免费奖�?
SRActivityPassport.NewPassportCollectFree=(level)=>{
    let sr = new GameKit.ServerRequest("NewPassportCollectFree")
    sr.SetRequestBody("level", level)
    return sr
}
//新通信证领取收费奖�?
SRActivityPassport.NewPassportCollectBuy=(level)=>{
    let sr = new GameKit.ServerRequest("NewPassportCollectBuy")
    sr.SetRequestBody("level", level)
    return sr
}

