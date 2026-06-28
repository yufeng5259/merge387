import '../../../LegacyGlobals';
class SystemUserMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new SystemUserMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    UserId() {
        return this._data.id
    }

    MapId() {
        return this._data.mapId
    }

    Name() {
        return this._data.name
    }

    Avatar() {
        return this._data.avatar
    }

    IsVip() {
        return this._data.isVip
    }

    UserInfo() {
        return {userId:this.UserId(), name:this.Name(), avatar:this.Avatar(), isVip:this.IsVip()}
    }
}

SystemUserMeta.CacheUser = function() {
    this.result = {}
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.SystemUser)
    for(let id in metas) {
        let meta = metas[id]
        let mapId = meta.MapId()
        if (!this.result.hasOwnProperty(mapId)) this.result[mapId] = []
        this.result[mapId].push(meta)
    }
}

SystemUserMeta.GetUser = function(mapId, lastUserId) {
    let result = this.result[mapId]
    if (!result || result.length <= 0) return null
    let r = result[G.getRandomInt(0, result.length)]
    if (r.UserId() === lastUserId) {
        return SystemUserMeta.GetUser(mapId, lastUserId)
    }
    return r
}

SystemUserMeta.uniIdStart = 2201
SystemUserMeta.uniIdEnd = 2400
SystemUserMeta.getRandomUsers = function (count) {
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.SystemUser)
    let uniIds = []
    for (let i = SystemUserMeta.uniIdStart; i <= SystemUserMeta.uniIdEnd; i++) {
        uniIds.push(i)
    }
    let ids = GameKit.FuncTools.getRandomCount(uniIds, count)
    let data = {}
    ids.forEach(id => {
        data[id] = metas[id]
    })
    return data
}
SystemUserMeta.getSeedRandomUsers = function (count, seed) {
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.SystemUser)
    let uniIds = []
    for (let i = SystemUserMeta.uniIdStart; i <= SystemUserMeta.uniIdEnd; i++) {
        uniIds.push(i)
    }
    let ids = GameKit.FuncTools.getSeedRandomCount(uniIds, count, seed)
    let data = {}
    ids.forEach(id => {
        data[id] = metas[id]
    })
    return data
}

global.Meta.SystemUserMeta = SystemUserMeta