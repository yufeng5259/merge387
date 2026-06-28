import '../../../LegacyGlobals';
// fendou 2021-9-23

var SRActivityFlytoSky = {}
SR.SRActivityFlytoSky = SRActivityFlytoSky

/**
 * 付费购买
 * @param {number} activityMetaId
 */
 SRActivityFlytoSky.activityFlytoSkyBuy = (activityMetaId,packId) => {
    let sr = new GameKit.ServerRequest("activityFlytoSkyBuy")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    sr.SetRequestBody("packId", packId)
    return sr
}

/**
 * 免费购买(包括验证和获取奖�?
 * @param {number} activityMetaId
 */
 SRActivityFlytoSky.activityFlytoSkyFree = (activityMetaId,packId) => {
    let sr = new GameKit.ServerRequest("activityFlytoSkyFree")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    sr.SetRequestBody("packId", packId)
    return sr
}

/**
 * 请求过关时是否有关卡额外奖励
 * @param {number} activityMetaId
 */
 SRActivityFlytoSky.askFlytoSkyFinishVillage = (packId) => {
    let sr = new GameKit.ServerRequest("askFlytoSkyFinishVillage")
    sr.SetRequestBody("packId", packId)
    return sr
}

SRActivityFlytoSky._getActivityFlytoSkyData = (activityMetaId) => {
    let sr = new GameKit.ServerRequest("getActivityFlytoSkyData")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    return sr
}

//服务器初始化用，前端无用
SRActivityFlytoSky._getActivityChoosePackData = (activityMetaId) => {
    let sr = new GameKit.ServerRequest("getActivityChoosePackData")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    return sr
}
///自选礼包购�?
SRActivityFlytoSky._getActivityChoosePackBuy = (activityMetaId,packId,rewards,totalPackCount) => {
    let sr = new GameKit.ServerRequest("choosePackBuy")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    sr.SetRequestBody("packId", packId)
    sr.SetRequestBody("totalPackCount", totalPackCount)
    sr.SetRequestBody("rewards", rewards)
    return sr
}
