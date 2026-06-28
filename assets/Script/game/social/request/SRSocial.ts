import '../../../LegacyGlobals';

var SRSocial = {}

//获取排行
SRSocial.getFriendsRank = function() {
    let req = new GameKit.ServerRequest("getFriendsRank")
    req.SetSilence(true)
    req.SetCallBack(res => {
        let data = res.list

        let friends = Game.SUser.FriendsList()
        for (let i = 0; i < data.length; i++) {
            if (friends[data[i].userId]) friends[data[i].userId].updateData(data[i])
        }
    })
    return req
}
SRSocial.getCountryRank = function() {
    let req = new GameKit.ServerRequest("getCountryRank")
    req.SetRequestBody("country", Game.SUser.Country())
    req.SetSilence(true)
    return req
}
SRSocial.getGlobalRank = function() {
    let req = new GameKit.ServerRequest("getGlobalRank")
    req.SetSilence(true)
    return req
}

//获取礼物信息
SRSocial.getGifts = function() {
    let req = new GameKit.ServerRequest("getGifts")
    req.SetSilence(true)
    return req
}
SRSocial.giftsSpinSend = function(friendUserId) {
    let req = new GameKit.ServerRequest("giftsSpinSend")
    req.SetRequestBody("friendUserId", friendUserId)
    return req
}
SRSocial.giftsCoinSend = function(friendUserId) {
    let req = new GameKit.ServerRequest("giftsCoinSend")
    req.SetRequestBody("friendUserId", friendUserId)
    return req
}
SRSocial.giftsSpinCollect = function(friendUserId) {
    let req = new GameKit.ServerRequest("giftsSpinCollect")
    req.SetRequestBody("friendUserId", friendUserId)
    return req
}
SRSocial.giftsCoinCollect = function(friendUserId) {
    let req = new GameKit.ServerRequest("giftsCoinCollect")
    req.SetRequestBody("friendUserId", friendUserId)
    return req
}
SRSocial.giftsSpinAll = function(sendList, collectList) {
    let req = new GameKit.ServerRequest("giftsSpinAll")
    req.SetRequestBody("sendList", sendList)
    req.SetRequestBody("collectList", collectList)
    return req
}
SRSocial.giftsCoinAll = function(sendList, collectList) {
    let req = new GameKit.ServerRequest("giftsCoinAll")
    req.SetRequestBody("sendList", sendList)
    req.SetRequestBody("collectList", collectList)
    return req
}
SRSocial.giftsCardCollect = function(index) {
    let req = new GameKit.ServerRequest("giftsCardCollect")
    req.SetRequestBody("index", index)
    return req
}


SR.SRSocial = SRSocial