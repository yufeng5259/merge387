import '../../../../LegacyGlobals';
class ChoosePackRewardPackMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ChoosePackRewardPackMeta()
        meta.UpdateData(data)
        console.log('==========');
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

    PackId(){
        return this._data.packid
    }

    Item(){
        return this._data.reward
    }

    CheckInLevel(level){
        let mapArr=JSON.parse(this._data.map)
        let min=mapArr[0]
        let max=mapArr[1]
        return (level>=min&&level<=max)
    }
}
ChoosePackRewardPackMeta.getChoosePackRewardsByLevel=function(packId,level){
    let metas=Meta.MetaManager.GetMetas(Meta.MetaType.ChoosePackReward)
    let keys=Object.keys(metas)
    for (let index = 0; index < keys.length; index++) {
        const key=keys[index]
        const meta = metas[key];
        if(meta.PackId()==packId&&meta.CheckInLevel(level)){
            return meta
        }
    }
    return null
}
global.Meta.ChoosePackRewardPackMeta = ChoosePackRewardPackMeta