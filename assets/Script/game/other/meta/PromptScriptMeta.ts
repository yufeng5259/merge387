import '../../../LegacyGlobals';
class PromptScriptMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new PromptScriptMeta()
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

    //描述
    Desc() {
        return GameKit.i18n.sel(this._data.desc)
    }
}

global.Meta.PromptScriptMeta = PromptScriptMeta