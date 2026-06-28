import '../../../LegacyGlobals';
class CardSetsMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new CardSetsMeta()
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

    Res() {
        if (global.loadEditorTemp) return "Beach"
        return this._data.res
    }

    Name() {
        return GameKit.i18n.sel(this._data.name)
    }
    //卡组期数,每期15�?
    Card_issue() {
        return this._data.card_issue
    }

    MinVillage() {
        return this._data.min_village
    }

    Reward() {
        let id=Math.floor(Game.SUserVillage.MapId()/50)
        let key='reward'+id
        if (!this.reward) {
            this.reward = Game.Content.FromStrings(this._data[key])
            this.reward = Game.Content.Merge(this.reward)
        }
        return this.reward
    }

    Color() {
        return this._data.color
    }

    IsActivityCard(){
        return Boolean(this._data.isActive)
    }
}
CardSetsMeta.getMetasByIssue=function (issueID) {
    let out = {};
    let targetIssue = Number(issueID);
    let obj = Meta.MetaManager.GetMetas(Meta.MetaType.CardSets);
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            if (Number(element.Card_issue()) === targetIssue) {
                out[key] = element;
            }
        }
    }
    return out;
}

CardSetsMeta.getCardMetasByIssue = function(issueID) {
    let out = {};
    let setMetas = CardSetsMeta.getMetasByIssue(issueID);
    let setIdMap = {};

    for (const key in setMetas) {
        if (Object.hasOwnProperty.call(setMetas, key)) {
            let setMeta = setMetas[key];
            setIdMap[setMeta.Id()] = true;
        }
    }

    let cardMetas = Meta.MetaManager.GetMetas(Meta.MetaType.Card);
    for (const key in cardMetas) {
        if (Object.hasOwnProperty.call(cardMetas, key)) {
            const element = cardMetas[key];
            if (setIdMap[element.SetId()]) {
                out[key] = element;
            }
        }
    }

    return out;
}

global.Meta.CardSetsMeta = CardSetsMeta