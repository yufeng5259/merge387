import '../../../LegacyGlobals';
class giftActivityMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new giftActivityMeta()
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

    Price(){
        this._data.price
    }
}
giftActivityMeta.GetValue = function(id) {
    let meta = Meta.MetaManager.GetMeta(Meta.MetaType.giftActivity, id)
    if (!meta) return null
    return meta;
    // return meta.getValue(key)
}
giftActivityMeta.GeTableData = function() {
    let meta = Meta.MetaManager.GetMetas(Meta.MetaType.giftActivity)
    return meta;
}
// 本期活动的数�?
// giftActivityMeta.currentActiveData=[]
giftActivityMeta.GetValueByAciveID = function(activeID) {
    let dt=this.GeTableData();
    let keys=Object.keys(dt);
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const it=dt[key];
        if(it._data.activityId==activeID){
            return it._data;
        }
    }
    return null;
}
// // 获取完整数据
// giftActivityMeta.GetValue = function(activeID) {
//     let dt=this.GetValueByAciveID(activeID);
//     let keys=Object.keys(dt);
//     for (let index = 0; index < keys.length; index++) {
//         const key = keys[index];
//         const it=dt[key];
//         if(it._data.activityId==activeID){
//             return it._data.clone();
//         }
//     }
//     return null;
// }
// // 本期活动的数�?
// giftActivityMeta.currentActiveData=[]
// giftActivityMeta.GetCurrentActiveData = function() {
//     let dt=GetValueByAciveID(this.get_active_id());

// }

global.Meta.giftActivityMeta = giftActivityMeta