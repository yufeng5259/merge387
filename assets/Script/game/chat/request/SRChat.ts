import '../../../LegacyGlobals';
var SRChat = {}

//获取消息
SRChat.getChats = function(timeStamp) {
    let req = new GameKit.ServerRequest("getChats")
    timeStamp = timeStamp || GameKit.TimeUtil.getCurrentTime() - 30
    req.SetRequestBody("timeStamp", timeStamp)
    req.SetSilence(true)
    req.SetCallBack(function(res) {
        Game.ChatMgr.addMessage(res.chats)
        Game.ChatMgr.lastTime = res.timeStamp
    })
    return req
}

//获取最近一条消�?
SRChat.getLastChat = function(timeStamp) {
    let req = new GameKit.ServerRequest("getLastChat")
    timeStamp = timeStamp || GameKit.TimeUtil.getCurrentTime()
    req.SetRequestBody("timeStamp", timeStamp)
    req.SetSilence(true)
    req.SetCallBack(function(res) {
        Game.ChatMgr.setLastMessages(res.chat, res.timeStamp)
    })
    return req
}

//发送消�?
SRChat.sendChat = function(message) {
    let req = new GameKit.ServerRequest("sendChat")
    req.SetRequestBody("message", message)
    req.SetRequestBody("userInfo", Game.SUser.getUserInfo())
    req.SetSilence(true)
    req.SetCallBack(function(res) {
    })
    return req
}

SR.SRChat = SRChat