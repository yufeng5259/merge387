import '../../../LegacyGlobals';
class CashShopMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new CashShopMeta()
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

    Price() {
        return this._data.price
    }

    Item() {
        if (!this.items) {
            this.items = Game.Content.FromStrings(this._data.item)
        }
        return this.items
    }
}

global.Meta.CashShopMeta = CashShopMeta