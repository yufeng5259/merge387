import '../../../LegacyGlobals';
//�?
class MapMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new MapMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }
//id	mapId	buildID	showname	price1	price2	price3	price4	price5

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }
    //地图ID
    MapId() {
        return this._data.mapId
    }
    //建筑ID
    BuildID() {
        return this._data.buildID
    }
    //mbid
    MBId(){
        return this._data.mapId+"_"+this._data.buildID
    }
    //建筑物名�?
    Showname() {
        return this._data.showname
    }
    //最大等�?
    MaxLevel() {
        return this._data.maxLevel
    }
    //等级开启条�?
    LimitLv() {
        return this._data.LimitLv
    }
    //升级所需金币
    Price1() {
        return this._data.price1
    }
    Price2() {
        return this._data.price2
    }
    Price3() {
        return this._data.price3
    }
    Price4() {
        return this._data.price4
    }
    Price5() {
        return this._data.price5
    }
    //根据等级返回所需金币
    Price(lv,st=null) {
        let price = this._data["price"+lv]
        if (st == null) return price || 0
        if (price == null) return 0
        if (!Array.isArray(price)) return price || 0
        return price[st] || 0
    }
    //购买建筑所需金币
    Price0() {
        return this.Price(0)
    }
    //当前动作需要的金币，兼容新版单值价格和旧版阶段价格
    ActionPrice(lv, st=null) {
        let price = this.Price(lv)
        if (Array.isArray(price)) {
            if (st != null && price[st] != null) return price[st] || 0
            if (price.length === 1) return price[0] || 0
            return this.PriceTotal(lv)
        }
        return price || 0
    }
    //获取当前等级的最大阶�?
    GetPriceMaxStage(lv){
        let pList = this.Price(lv)
        if (!Array.isArray(pList)) return 1
        return pList.length;
    }
    //获取当前阶段到下一个阶段金币百分比
    GetPricePre(lv,st=0){

        let total = this.PriceNextPer(lv,st);
        let cur =Game.SUser.Coin();
        let pre = cur/total
        return pre>=1?1:pre;
    }
    //获取当前等级�?至当前阶段金币百分比
    PricePre(lv,st=-1){
        let total = this.PriceTotal(lv);
        let cur =st==-1?0:this.PriceNextPer(lv,st);
        if (total <= 0) return 1
        return cur/total;
    }
    //获取当前等级最大累加金�?
    PriceTotal(lv){
        let total = 0;
        let pList = this.Price(lv);
        if (!Array.isArray(pList)) return pList || 0
        for (let i = 0; i < pList.length; i++) {
            total+=pList[i];
        }
        return total;
    }
    //获取当前等级�?至当前阶段金�?
    PriceNextPer(lv,nextST){
        let needExp =0;
        let pList = this.Price(lv);
        if (!Array.isArray(pList)) return pList || 0
        for (let i = 0; i < pList.length; i++) {
            if(nextST>=i){
                needExp+=pList[i];
            }
        }
        return needExp
    }
    //升级后获得奖�?
    Reward1() {
        return this._data.reward1
    }
    Reward2() {
        return this._data.reward2
    }
    Reward3() {
        return this._data.reward3
    }
    Reward4() {
        return this._data.reward4
    }
    Reward5() {
        return this._data.reward5
    }
    //根据等级返回奖励
    Reward(lv,st=null) {
        let reward = this._data["reward"+lv]
        if (st == null) return reward || ""
        if (reward == null) return ""
        if (!Array.isArray(reward)) return reward || ""
        return reward[st] || ""
    }
    //购买建筑奖励
    Reward0() {
        return this.Reward(0)
    }
    isCanUp(level,st){
        var curCost = Game.SUser.Coin();
        var needCost =this.ActionPrice(level,st);//读表

        return curCost>=needCost;
    }
    GetPriceStr(lv,st){
        return Game.SUser.Coin()+"/"+this.Price(lv,st)
    }
}
//根据mapID和buildID获得MapMeta
MapMeta.GetMetaById = function(mapID,buildID){
    let mapMeta =null;
    let obj = Meta.MetaManager.GetMetas(Meta.MetaType.Map)
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            if(mapID==element.MapId()&&buildID==element.BuildID()){
                mapMeta = element;
                return mapMeta;
            }
        }
    }
    return mapMeta
}
global.Meta.MapMeta = MapMeta
