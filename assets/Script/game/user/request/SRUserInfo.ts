import '../../../LegacyGlobals';
var SRUserInfo = {}

//获取用户信息
SRUserInfo.getInfo = function() {
    let req = new GameKit.ServerRequest("getUserInfo")
    req.SetCallBack(function(res) {
        Game.SUser.updateData(res.userinfo)
    })
    return req
}

//更新用户信息
SRUserInfo.updateInfo = function() {
    let req = new GameKit.ServerRequest("updateUserInfo")
    req.SetRequestBody("userinfo", Game.SUser.getThirdData())
    req.SetCallBack(function(res) {
        Game.SUser.updateData(res.userinfo)
    })
    return req
}

//更新用户好友 
SRUserInfo.updateFriends = function(friends) {
    let req = new GameKit.ServerRequest("updateUserFriends")
    req.SetRequestBody("friends", friends)
    req.SetCallBack(function(res) {
        for (let uid in res.friendsList) {
            let data = res.friendsList[uid]
            if (data.name == null) {
                let fdata = Game.SUser.friendsInfo[data.accountId]
                data.name = fdata.name
                data.avatar = fdata.avatar
            }
            Game.SUser.data.friendsList[uid] = new Game.User().updateData(data)
        }
        for (const key in res.CfriendsList) {
            const element = res.CfriendsList[key];
            Game.SUser.data.CfriendsList[key] = new Game.User().updateData(element)

        }
        
        
    })
    return req
}

SR.SRUserInfo = SRUserInfo