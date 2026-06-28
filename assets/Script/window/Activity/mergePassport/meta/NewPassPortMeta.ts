import '../../../../LegacyGlobals';
class NewPassPortMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new NewPassPortMeta()
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
    FreeContents(){
        return this._data.contents
    }
    BuyContents(){
        return this._data.buyContents
    }
}

NewPassPortMeta.GetMetaByLevel=function(lv){
    const metas=Meta.MetaManager.GetMetas(Meta.MetaType.NewpassPort)
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

NewPassPortMeta.GetById = (id) => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.NewpassPort, id)
}

global.Meta.NewPassPortMeta = NewPassPortMeta