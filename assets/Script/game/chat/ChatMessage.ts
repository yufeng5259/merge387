import '../../LegacyGlobals';
//用户信息�?

class ChatMessage {

    constructor () {
        this.data = {
            userId: 0,
            userInfo: {},
            message: "",
            timeStamp: 0,
        }
    }

    //更新数据
    updateData(msg) {
        let data = msg
        for (let key in data) {
            this.data[key] = data[key]
        }
        this.user = new Game.User().updateData(this.data.userInfo)
        return this
    }

    //获得数据
    getData() {
        let da = {}
        for (let key in this.data) {
            da[key] = this.data[key]
        }
        return da
    }

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
        return this
    }

    UserId() {
        return this.data.userId
    }

    TimeStamp() {
        return this.data.timeStamp
    }

    Message() {
        return this.data.message
    }

    User() {
        return this.user
    }
}

global.Game.ChatMessage = ChatMessage