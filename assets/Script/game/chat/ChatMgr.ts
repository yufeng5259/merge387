import '../../LegacyGlobals';
var ChatMgr = {_msgs:[], lastMsg:null}

ChatMgr.init = function() {
    this.intervalID = setInterval(function(){
       SR.SRChat.getLastChat(this.lastChatTime).Send()
    }.bind(this), 1500)
}

ChatMgr.Clear = function() {
    clearInterval(this.intervalID)
    this._msgs = []
    this.lastMsg = null
}

ChatMgr.addMessage = function(msgs) {
    this.newMessage = []
    for (let i = 0; i < msgs.length; i++) {
        let cm = new Game.ChatMessage()
        cm.updateData(msgs[i])
        this._msgs.push(cm)
        this.newMessage.push(cm)
    }
    if (this._msgs.length > 200) {
        this._msgs = this._msgs.slice(this._msgs.length - 200)
    }
}

ChatMgr.getMessages = function() {
    return this._msgs
}
ChatMgr.getNewMessages = function() {
    return this.newMessage
}

ChatMgr.getLastMessages = function() {
    return this.lastMsg
}

ChatMgr.setLastMessages = function(msg, timeStamp) {
    this.lastChatTime = timeStamp
    if (!msg) return
    let cm = new Game.ChatMessage()
    this.lastMsg = cm.updateData(msg)
}

global.Game.ChatMgr = ChatMgr