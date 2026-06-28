import '../../../LegacyGlobals';
class GiftPackageItemsMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new GiftPackageItemsMeta()
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

    //棋子ID(mergeElement表id)
    MergeElementID() {
        return this._data.mergeElementID
    }
    
    //图标
    Icon() {
        return this._data.icon
    }
}

global.Meta.GiftPackageItemsMeta = GiftPackageItemsMeta