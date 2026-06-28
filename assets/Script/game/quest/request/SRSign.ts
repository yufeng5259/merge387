import '../../../LegacyGlobals';
var SRSign = {}

// 获取签到信息
SRSign.getSignData = () => {
    let req = new GameKit.ServerRequest("getSignData")
    req.SetCallBack(res => {
        GameKit.DataCache.SetData("signData", res.sign)
    })
    return req
}

// 领取周（天）签到奖励
SRSign.receiveSignWeekReward = (day,id,mId) => {
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

// 领取月签到奖�?
SRSign.receiveSignMonthReward = day => {
    let req = new GameKit.ServerRequest("receiveSignMonthReward")
    req.SetRequestBody("day", day)
    req.SetCallBack(() => {
        let signData = GameKit.DataCache.GetData("signData")
        signData.signMonthRewards.push(day)
        GameKit.DataCache.SetData("signData", signData)

        if (GameMainWindow.instance != null) GameMainWindow.instance.updateQuestBadge()
    })
    return req
}

SR.SRSign = SRSign