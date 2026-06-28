import '../../../LegacyGlobals';
class GuildMsgMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new GuildMsgMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
        return this;
    }
    /**
     * 
     * @returns 聊天信息ID
     */
    getMsdID(){
        return this._data.id;
    }
    /**
     * 
     * @returns 聊天角色ID
     */
    getMsgUID(){
        return this._data.userId;
    }
    /**
     * 
     * @returns 聊天角色info
     */
    getMsgUserInfo(){
        return this._data.userInfo;
    }
    /**
     * 
     * @returns 聊天内容
     */
    getMsgStr(){
        return this._data.message;
    }
    /**
     * 
     * @returns 聊天内容创建事件
     */
    getMsgTimeStamp(){
        return this._data.timeStamp;
    }
    /**
     * 
     * @returns 聊天内容过去时间
     */
    getMsgTimed(){
        return GameKit.TimeUtil.getCurrentTime()-this._data.timeStamp;
    }
    /**
     * 
     * @returns 礼物数量
     */
    getMsgTypeCount(){
        return this._data.count;
    }
    /**
     * 
     * @returns 聊天信息类型
     */
    getMsgType(){
        return this._data.type;
    }
}

global.Game.GuildMsgMeta = GuildMsgMeta
