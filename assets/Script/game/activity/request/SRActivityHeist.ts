import '../../../LegacyGlobals';
var SRActivityHeist = {}
SR.SRActivityHeist = SRActivityHeist

/**
 * 增加购买次数(一般是1�?
 * @param {number} activityMetaId
 */
SRActivityHeist.activityHeistAddBuyCount = (activityMetaId) => {
    let sr = new GameKit.ServerRequest("activityHeistAddBuyCount")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    return sr
}

/**
 * 免费购买(包括验证和增加次�?
 * @param {number} activityMetaId
 */
SRActivityHeist.activityHeistFreeBuy = (activityMetaId) => {
    let sr = new GameKit.ServerRequest("activityHeistFreeBuy")
    sr.SetRequestBody("activityMetaId", activityMetaId)
    return sr
}
