import '../../../LegacyGlobals';
class DynamicPackMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new DynamicPackMeta()
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

    RawPackId() {
        return this._data.rawPackId
    }

    MapId() {
        return this._data.mapId
    }

    PayId() {
        return this._data.payId
    }

    Off() {
        return this._data.off
    }

    OldPriceShopId() {
        return this._data.oldPriceShopId
    }

    Name() {
        return Meta.MetaManager.GetMeta(Meta.MetaType.PackItem, this.RawPackId()).Name()
    }

    Items() {
        let is = this._data.items
        let iss = is.split(';')
        return iss
    }

    Contents() {
        if (!this.contents) {
            this.contents = Game.Content.FromStrings(this._data.items)
        }
        return this.contents
    }
}

DynamicPackMeta.GetMapId = function(mapId) {
    if (mapId <= 5) {
        return 0
    } else if (mapId <= 10) {
        return 1
    } else if (mapId <= 15) {
        return 2
    } else if (mapId <= 20) {
        return 3
    } else if (mapId <= 25) {
        return 4
    } else if (mapId <= 30) {
        return 5
    } else if (mapId <= 35) {
        return 6
    } else if (mapId <= 40) {
        return 7
    } else if (mapId <= 45) {
        return 8
    }
    return 9
}
DynamicPackMeta.GetPayId = function(purchaseMoney) {
    if (purchaseMoney <= 0) {
        return 0
    } else if (purchaseMoney <= 10) {
        return 1
    } else if (purchaseMoney <= 25) {
        return 2
    } else if (purchaseMoney <= 50) {
        return 3
    } else if (purchaseMoney <= 100) {
        return 4
    }
    return 5
}

DynamicPackMeta._CacheMeta = {}
DynamicPackMeta.CacheMeta = function() {
    DynamicPackMeta._CacheMeta = {}
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.DynamicPack)
    for (let id in metas) {
        let meta = metas[id]
        let rawPackId = meta.RawPackId()
        if (!DynamicPackMeta._CacheMeta[rawPackId]) DynamicPackMeta._CacheMeta[rawPackId] = {}
        let mapId = meta.MapId()
        if (!DynamicPackMeta._CacheMeta[rawPackId][mapId]) DynamicPackMeta._CacheMeta[rawPackId][mapId] = {}
        let payId = meta.PayId()
        DynamicPackMeta._CacheMeta[rawPackId][mapId][payId] = meta
    }
}

DynamicPackMeta.FindMeta = function(rawPackId, _mapId, purchaseMoney) {
    let mapId = DynamicPackMeta.GetMapId(_mapId)
    let payId = DynamicPackMeta.GetPayId(purchaseMoney)

    return DynamicPackMeta._CacheMeta[rawPackId][mapId][payId]
}

global.Meta.DynamicPackMeta = DynamicPackMeta