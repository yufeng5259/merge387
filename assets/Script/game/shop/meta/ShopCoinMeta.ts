import '../../../LegacyGlobals';
class ShopCoinMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ShopCoinMeta()
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

    MapId() {
        return this._data.mapId || this._data.id
    }

    GetCoin(id) {
        return this._data["coin" + id.toString()]
    }
}

global.Meta.ShopCoinMeta = ShopCoinMeta