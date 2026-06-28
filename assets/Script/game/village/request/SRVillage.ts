import '../../../LegacyGlobals';

var SRVillage = {}

SRVillage.getUserVillage = function() {
    let req = new GameKit.ServerRequest("getUserVillage")
    req.SetCallBack(function(res) {
        console.log("小镇信息",res);
        
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

SRVillage.collectPresent = function(id) {
    let req = new GameKit.ServerRequest("collectPresent")
    req.SetRequestBody("presentId", id)
    req.SetCallBack(function(res) {
        let presentList = GameKit.DataCache.GetData("UserPresentList")
        if (presentList) {
            presentList[id].received = true
            GameKit.DataCache.SetData("UserPresentList", presentList)
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
