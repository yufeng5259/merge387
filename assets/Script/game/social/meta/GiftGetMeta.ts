import '../../../LegacyGlobals';
class GiftGetMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new GiftGetMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = data
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

    //礼物获得的金�?
    Coin() {
        return this._data.coin
    }

    //礼物获得的体�?
    Spin() {
        return this._data.spin
    }
}

global.Meta.GiftGetMeta = GiftGetMeta