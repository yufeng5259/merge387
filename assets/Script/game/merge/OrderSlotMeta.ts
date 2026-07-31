import '../../LegacyGlobals';
class OrderSlotMeta {
    private _data: any = {}

    constructor() { }

    static MakeEntity(data) {
        let meta = new OrderSlotMeta()
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
        return this._data.ID
    }

    Lv() {
        return this._data.lv
    }

    SlotType() {
        return this._data.SlotType
    }

    Layers() {
        return this._data.Layers
    }

    CdTime() {
        return this._data.CdTime
    }
}

global.Meta.OrderSlotMeta = OrderSlotMeta
