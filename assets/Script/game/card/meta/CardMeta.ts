import '../../../LegacyGlobals';
class CardMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new CardMeta()
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

    SetId() {
        return this._data.setId
    }

    SetMeta() {
        return Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.SetId())
    }

    Index() {
        return this._data.index
    }

    MinVillage() {
        return this._data.min_village
    }

    Rare() {
        return this._data.rare
    }

    Golden() {
        return this._data.golden
    }

    CantSend() {
        let meta = Game.ActivityManager.GetActiveOtherActivityByType(Meta.ActivityMeta.SubTypes.GoldTrade)
        if (meta) {
            if (this.Id() == meta.Param().cardId1 || this.Id() == meta.Param().cardId2) {
                return false
            }
        }
        return this._data.golden
    }

    Name() {
        return GameKit.i18n.sel(this._data.name)
    }
    
}

CardMeta.GetId = function(setId, index) {
    return setId * 100 + index
}

CardMeta.GetMeta = function(setId, index) {
    return Meta.MetaManager.GetMeta(Meta.MetaType.Card, CardMeta.GetId(setId, index))
}

global.Meta.CardMeta = CardMeta