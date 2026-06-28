import '../../../LegacyGlobals';
class GuildBossMonsterMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new GuildBossMonsterMeta()
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
    Hp() {
        return this._data.hp
    }
    Avtart() {
        return this._data.avtart
    }
    //奖励1
    Reward() {
        return this._data.reward
    }
    Name(){
        return this._data.name+"Lv."+this._data.id
    }    
}
GuildBossMonsterMeta.GetBossList = function(){
    let obj = Meta.MetaManager.GetMetas(Meta.MetaType.GuildBossMonster)
    return obj
}
GuildBossMonsterMeta.GetById = id => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.GuildBossMonster, id)
}
global.Meta.GuildBossMonsterMeta = GuildBossMonsterMeta