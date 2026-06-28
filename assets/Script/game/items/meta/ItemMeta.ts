import '../../../LegacyGlobals';
class ItemMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ItemMeta()
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

    //类型
    Type() {
        return this._data.type
    }
    
    //名字
    Name() {
        return GameKit.i18n.sel(this._data.name)
    }

    //描述
    Desc() {
        return GameKit.i18n.sel(this._data.desc)
    }

    //图标
    Icon() {
        return this._data.icon
    }
}

global.Meta.ItemMeta = ItemMeta