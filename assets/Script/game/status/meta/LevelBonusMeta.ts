import '../../../LegacyGlobals';
class LevelBonusMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new LevelBonusMeta()
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

    MapId() {
        return this._data.mapId
    }

    Level() {
        return this._data.level
    }

    Reward() {
        if (!this.reward) {
            this.reward = Game.Content.FromString(this._data.reward)
        }
        return this.reward
    }
}

global.Meta.LevelBonusMeta = LevelBonusMeta