import '../../../LegacyGlobals';
class CashTaskMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new CashTaskMeta()
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
        return this._data.mapId
    }

    Item() {
        return this._data.item
    }

    NeedId() {
        return this._data.needId
    }

    Img() {
        return this._data.img
    }

    Description() {
        return this._data.desc
    }
}

global.Meta.CashTaskMeta = CashTaskMeta