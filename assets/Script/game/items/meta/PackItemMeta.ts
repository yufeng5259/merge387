import '../../../LegacyGlobals';
class PackItemMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new PackItemMeta()
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

    Name() {
        return this._data.name
    }

    Items() {
        let is = this._data.items
        let iss = is.split(';')
        return iss
    }

    Contents() {
        if (!this.contents) {
            let iss = this.Items()
            this.contents = []
            iss.forEach(x => {
                this.contents.push(Game.Content.FromString(x))
            });
        }
        return this.contents
    }
}

global.Meta.PackItemMeta = PackItemMeta