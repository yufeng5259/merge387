import '../../LegacyGlobals';
class MergeBgElementsMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new MergeBgElementsMeta()
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
     * 图标路径
     * @returns 
     */
    Icon() {
        return this._data.icon
    }
    /**
     * 合成类型名称
     * @returns {string} 合成类型名称
     */
    Name() {
        return GameKit.i18n.sel(this._data.name)
    }
    /**
     * 下一个id
     * @returns {number} 下一个id
     */
    NextId() {
        return this._data.nextid
    }
    /**
     * 上一个id
     * @returns {number} 上一个id
     */
    PrevId() {
        return this._data.prevId
    }
    /** 
     * 是否是半沙子
    */
    IsHalfSand() {
        return this._data.isHalfSand
    }
}


global.Meta.MergeBgElementsMeta = MergeBgElementsMeta