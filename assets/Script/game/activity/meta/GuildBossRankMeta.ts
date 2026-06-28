import '../../../LegacyGlobals';
class GuildBossRankMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new GuildBossRankMeta()
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

    //名字
    Rank() {
        return this._data.rank
    }
    Score() {
        return this._data.score
    }
    //奖励1
    Reward() {
        return this._data.reward
    }    
}
GuildBossRankMeta.GetById = id => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.GuildBossRank, id)
}

global.Meta.GuildBossRankMeta = GuildBossRankMeta