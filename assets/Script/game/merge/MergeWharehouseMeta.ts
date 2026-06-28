import '../../LegacyGlobals';
class MergeWharehouseMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new MergeWharehouseMeta()
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
        return this._data.id
    }
    /**
     * 格子索引
     * @returns {number} 格子索引
     */
    Index() {
        return this._data.index
    }
    /**
     * 
     * @returns {string} 物品价格
     */
    Price() {
        return Game.Content.FromString(this._data.price)
    }
}



global.Meta.MergeWharehouseMeta = MergeWharehouseMeta