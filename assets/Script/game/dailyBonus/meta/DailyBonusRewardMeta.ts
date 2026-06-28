import '../../../LegacyGlobals';
class DailyBonusRewardMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new DailyBonusRewardMeta()
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

    GetNormal(index) {
        return this._data["normal" + index.toString()]
    }

    GetGold(index) {
        return this._data["gold" + index.toString()]
    }
}

global.Meta.DailyBonusRewardMeta = DailyBonusRewardMeta