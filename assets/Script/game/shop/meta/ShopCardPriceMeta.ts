import '../../../LegacyGlobals';
class ShopCardPriceMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ShopCardPriceMeta()
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

    Price(id) {
        return this._data["price" + id.toString()]
    }
    //星星换卡牌星星数�?
    PriceStarChest(id) {
        return this._data["priceStarChest" + id.toString()]
    }
}

global.Meta.ShopCardPriceMeta = ShopCardPriceMeta