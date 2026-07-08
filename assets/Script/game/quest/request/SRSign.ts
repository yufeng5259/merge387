import '../../../LegacyGlobals';

var SRSign: any = {}

SRSign.getSignData = () => {
    let req = new GameKit.ServerRequest("getSignData")
    req.SetCallBack(res => {
        GameKit.DataCache.SetData("signData", res.sign)
    })
    return req
}

SRSign.receiveSignWeekReward = (day, id, mId) => {
    if (id == null && typeof Meta !== "undefined" && Meta.SignMeta) {
        let meta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, day)
        id = meta ? meta.Id() : 0
    }
    if (mId == null) mId = 0

    let req = new GameKit.ServerRequest("receiveSignWeekReward")
    req.SetCallBack(() => {
        let signData = GameKit.DataCache.GetData("signData")
        signData.signWeekRewards = signData.signWeekDay
        GameKit.DataCache.SetData("signData", signData)

        if (GameMainWindow.instance != null) GameMainWindow.instance.updateQuestBadge()
    })
    req.SetRequestBody("day", day)
    req.SetRequestBody("id", id)
    req.SetRequestBody("mId", mId)
    return req
}

SRSign.receiveSignMonthReward = day => {
    let req = new GameKit.ServerRequest("receiveSignMonthReward")
    req.SetRequestBody("day", day)
    req.SetCallBack(() => {
        let signData = GameKit.DataCache.GetData("signData")
        if (!signData.signMonthRewards) signData.signMonthRewards = []
        if (signData.signMonthRewards.indexOf(day) < 0) signData.signMonthRewards.push(day)
        GameKit.DataCache.SetData("signData", signData)

        if (GameMainWindow.instance != null) GameMainWindow.instance.updateQuestBadge()
    })
    return req
}

SR.SRSign = SRSign
