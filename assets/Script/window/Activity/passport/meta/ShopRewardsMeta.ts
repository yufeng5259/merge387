import '../../../../LegacyGlobals';
class ShopRewardsMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ShopRewardsMeta()
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

    Item(){
        return this._data.rewards
    }

    Rewards(){
        return Game.Content.FromStrings(this._data.rewards)
    }
}
ShopRewardsMeta.GetRewardsByPackId=function(packId){
    const metas=Meta.MetaManager.GetMetas(Meta.MetaType.ShopRewards)
    let keys=Object.keys(metas)
    for (let index = 0; index < keys.length; index++) {
        const key=keys[index]
        const meta = metas[key];
        if(meta.Id()==packId){
            return meta.Rewards()
        }
    }
    return null
}

global.Meta.ShopRewardsMeta = ShopRewardsMeta