import '../../../LegacyGlobals';
class RankRewardMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new RankRewardMeta()
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

    //类型
    Rank() {
        return this._data.rankNum
    }
    
    //名字
    MapMin() {
        return this._data.mapMin
    }

    //描述
    MapMax() {
        return this._data.mapMax
    }

    //图标
    Reward() {
        return this._data.reward
    }
}
RankRewardMeta.GetShootRewards = function(rank){
    let STR = "";
    let mapId = Game.SUserVillage.MapId()
    let obj = Meta.MetaManager.GetMetas(Meta.MetaType.RankReward)
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            if(rank==element.Rank()&&mapId>=element.MapMin()&&mapId<=element.MapMax()){
                STR = element.Reward();
            }
        }
    }

    return STR
}
global.Meta.RankRewardMeta = RankRewardMeta