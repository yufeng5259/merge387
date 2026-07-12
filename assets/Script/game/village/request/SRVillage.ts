import '../../../LegacyGlobals';

var SRVillage: any = {}

SRVillage.getUserVillage = function() {
    let req = new GameKit.ServerRequest("getUserVillage")
    req.SetCallBack(function(res) {
        console.log("灏忛晣淇℃伅",res);
        
        Game.SUserVillage.updateData(res.userVillage)
    })
    return req
}

SRVillage.getPeopleUserVillage = function(uid) {
    let req = new GameKit.ServerRequest("getPeopleUserVillage")
    req.SetRequestBody("otherUserId", uid)
    return req
}

SRVillage.getVillageNews = function() {
    return new GameKit.ServerRequest("getVillageNews")
}

SRVillage.getPresentList = function() {
    let req = new GameKit.ServerRequest("getPresentList")
    req.SetCallBack(function(res) {
        GameKit.DataCache.SetData("UserPresentList", res.list)
    })
    return req
}

SRVillage.applyPendingRewards = function(res) {
    if (!res || !res.pendingRewards || typeof Game === 'undefined' || !Game.SUserMerge) return
    Game.SUserMerge.UpdateMergePendingRewards(res.pendingRewards)
    GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated, {
        pendingRewards: res.pendingRewards,
    })
}

SRVillage.collectPresentBatch = function() {
    let req = new GameKit.ServerRequest("collectPresentBatch")
    req.SetCallBack(function(res) {
        SRVillage.applyPendingRewards(res)
        if (res && res.list) GameKit.DataCache.SetData("UserPresentList", res.list)
    })
    return req
}

SRVillage.collectPresent = function(id) {
    let req = new GameKit.ServerRequest("collectPresent")
    req.SetRequestBody("presentId", id)
    req.SetCallBack(function(res) {
        SRVillage.applyPendingRewards(res)
        let presentList = GameKit.DataCache.GetData("UserPresentList")
        if (presentList && presentList[id]) {
            presentList[id].received = true
            GameKit.DataCache.SetData("UserPresentList", presentList)
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.PresentEvent, presentList)
        }
    })
    return req
}

SRVillage.levelUpElement = function(mapId, buildId) {
    let req = new GameKit.ServerRequest("levelUpMapElement")
    req.SetRequestBody("mapId", mapId)
    req.SetRequestBody("buildId", buildId)
    return req
}

SRVillage.buildUnlocked = function(mapID, buildID) {
    return new GameKit.ServerRequest("buildUnlocked")
}

SR.SRVillage = SRVillage
