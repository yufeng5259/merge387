import '../../../../LegacyGlobals';
class ActivityChoosePackMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ActivityChoosePackMeta()
        meta.UpdateData(data)
        // console.log('==========');
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

    DataList(){
        let dt=JSON.parse(this.Data().packprice)
        return dt
    }
}
ActivityChoosePackMeta.getActivityChoosePackItem=function(activeId){
    let meta=Meta.MetaManager.GetMeta(Meta.MetaType.ActivityChoosePack,activeId)
    return meta.DataList()
}
ActivityChoosePackMeta.get_buy_price_str=function(shopId) {
    return shopId
        ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId).PriceString()
        : GameKit.i18n.t("heist_main_window_free")
}
global.Meta.ActivityChoosePackMeta = ActivityChoosePackMeta