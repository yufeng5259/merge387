import '../../../LegacyGlobals';
class RandomPackMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new RandomPackMeta()
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

    PackId() {
        return this._data.packId
    }

    Type() {
        return this._data.type
    }

    MinVillage() {
        return this._data.minVillage
    }

    MaxVillage() {
        return this._data.maxVillage
    }

    Item() {
        return this._data.item
    }
}

RandomPackMeta.Types = {
    Spin: "spin",
    Coin: "coin",
    ServantFood: "servantFood",
    ServantExp: "servantExp",
    ChestId: "chestId",
}

RandomPackMeta._CacheMeta = {}
RandomPackMeta.CacheMeta = function() {
    RandomPackMeta._CacheMeta = {}
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.RandomPack)
    for (let id in metas) {
        let meta = metas[id]
        let packId = meta.PackId()
        if (!RandomPackMeta._CacheMeta[packId]) RandomPackMeta._CacheMeta[packId] = []
        RandomPackMeta._CacheMeta[packId].push(meta)
    }
}

RandomPackMeta.FindMeta = function(packId) {
    let mapId = Game.SUserVillage.MapId()
    let metas1 = RandomPackMeta._CacheMeta[packId]
    let metas = []
    metas1.forEach(x => {
        if (x.MinVillage() <= mapId && x.MaxVillage() >= mapId) {
            metas.push(x)
        }
    })
    return metas
}

RandomPackMeta.FindItemsRange = function(packId) {
    let metas = RandomPackMeta.FindMeta(packId)
    let data = {}
    metas.forEach(x => {
        let d = {min:-1, max:0}
        let items = x.Item().split(";")
        items.forEach(c => {
            let cs = c.split(":")
            let r = parseFloat(cs[1])
            let ns = cs[0].split("-")
            let n1 = parseInt(BigNumber.fromFormat(ns[0]))
            let n2 = parseInt(BigNumber.fromFormat(ns[1]))
            if (d.min < 0 || n1 < d.min) d.min = n1
            if (n2 > d.max) d.max = n2
        })
        data[x.Type()] = d
    })
    return data
}

global.Meta.RandomPackMeta = RandomPackMeta