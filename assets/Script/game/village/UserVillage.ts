import '../../LegacyGlobals';

//村庄数据

export class UserVillage {
    public data: any;

    constructor (userId?: any) {
        this.data = {
            userId: userId,

            mapId: 1,
            housesUnderUpgrade:{},//正在升级的建筑物{"1_1":{mapId:1,buildId:1,level:0,stage:-1}}
            upgradedHouse:{}//已完成的建筑物{"1_1":{mapId:1,buildId:1,level:0,stage:-1}}
        }
    }

    //更新数据
    updateData(data) {
        for (var key in data) {
            this.data[key] = data[key]
        }
        return this
    }

    //获得数据
    getData() {
        let data = {}
        for (var key in this.data) {
            data[key] = this.data[key]
        }
        return data
    }

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
        return this
    }
    //合并数据
    mergeData(key,data){
        for (var e in data[key]) {
            this.data[key][e]=data[key][e]
        }
        console.log(this.data[key])
    }

    MapId() {
        return this.data.mapId
    }
    MergeMapId() {
        return this.data.mergeMapId
    }

    //正在升级的建筑物{"1_1":{mapId:1,buildId:1,level:0}}
    //获得正在建造中建筑
    GetBuildings(){
        return this.data.housesUnderUpgrade;
    }

    //已完成的建筑物{"1_1":{mapId:1,buildId:1,level:0}}
    //获得已经完成的建�?
    GetComplete(){
        return this.data.upgradedHouse;
    }
    //通过"1_1""map_build"获得
    GetBuildingByID(mbId){
        var obj =this.GetBuildings();
        return obj[mbId]
    }
    //获得第一个正在建造的建筑物id
    GetFirstBuildID(){
        var obj = this.GetBuildings();
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                let ele = obj[key];
                let bid = ele.buildId;
                return bid;
            }
        }
        return 1;
    }
}
