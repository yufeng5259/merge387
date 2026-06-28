import '../../../LegacyGlobals';
class AdGetCoinMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new AdGetCoinMeta()
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
        return this._data.id
    }

    //看广告获得的金币
    Coin() {
        return this._data.coin
    }

    //在弹出的提示里看广告获得的金�?
    CoinByTip() {
        return this._data.coinByTip
    }
}

global.Meta.AdGetCoinMeta = AdGetCoinMeta