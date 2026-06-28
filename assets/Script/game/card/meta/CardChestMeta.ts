import '../../../LegacyGlobals';
class CardChestMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new CardChestMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
        if(this._data.name){
            this._nameJson=JSON.parse(this._data.name)
        }
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    CardNum() {
        return this._data.cardNum
    }

    Rare1() {
        return this._data.rare1
    }

    Rare2() {
        return this._data.rare2
    }

    LeastRare() {
        return this._data.leastRare
    }

    JokerChestCount() {
        return this._data.jokerChestCount
    }

    JokerChestGuar() {
        return this._data.jokerChestGuar
    }

    Icon() {
        return this._data.icon
    }
    Name(){
        if(this._nameJson){
            return this._nameJson[GameKit.i18n.getLang()]
        }
        return ""
    }
}

global.Meta.CardChestMeta = CardChestMeta