import '../../../../LegacyGlobals';
class PassPortMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new PassPortMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
        this._rewardsPack=this.RewardsPack()
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    Level(){
        return parseInt(this._data.level)
    }

    Exp(){
        
        return parseInt(this._data.exp)
    }

    RewardsPack(){
        let dt=JSON.parse(this.Data().pack)
        return dt
    }
    BuyRewardID(){
        return this._rewardsPack[0]
    }
    FreeRewardID(){
        return this._rewardsPack[1]
    }
}

PassPortMeta.GetMetaByLevel=function(lv){
    const metas=Meta.MetaManager.GetMetas(Meta.MetaType.PassPort)
    let keys=Object.keys(metas)
    let meta=null
    for (let index = 0; index < keys.length; index++) {
        const key=keys[index]
        meta = metas[key];
        if(meta.Level()==lv){
            return meta
        }
    }
    return meta
}

PassPortMeta.GetById = (id) => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.PassPort, id)
}

global.Meta.PassPortMeta = PassPortMeta