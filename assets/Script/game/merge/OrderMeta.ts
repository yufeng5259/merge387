import '../../LegacyGlobals';
class OrderMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new OrderMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }

    Id() {
        return this._data.lv
    }

    Lv() {
        return this._data.lv
    }

    OrderMax() {
        return this._data.orderMax
    }

    HardSequence() {
        return this._data.hardSequence
    }

    ItemNumRate() {
        return this._data.ItemNumRate
    }

    Hard4ChestLv() {
        return this._data.hard4ChestLv
    }

    Hard4Plan() {
        return this._data.hard4Plan
    }

    Hard3Plan() {
        return this._data.hard3Plan
    }

    Hard2Plan() {
        return this._data.hard2Plan
    }

    Hard1Plan() {
        return this._data.hard1Plan
    }
}

global.Meta.OrderMeta = OrderMeta
