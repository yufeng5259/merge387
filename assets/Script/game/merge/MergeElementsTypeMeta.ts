import '../../LegacyGlobals';
class MergeElementsTypeMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new MergeElementsTypeMeta()
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
     * 合成类型名称
     * @returns {string} 合成类型名称
     */
    Name() {
        return GameKit.i18n.sel(this._data.name)
    }
    /**
     * 合成等级
     * @returns {number[]} 合成等级
     */
    Levels() {
        return this._data.levels||[]
    }
}
global.Meta.MergeElementsTypeMeta = MergeElementsTypeMeta