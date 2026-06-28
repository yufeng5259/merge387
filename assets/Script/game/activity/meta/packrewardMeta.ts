import '../../../LegacyGlobals';
import GiftData from "../../../window/Activity/gift/GiftData";
// 包物品数�?
class packrewardMeta {
    static packTableData: packDataItem[] = [];
    static isInited = false;
    static GetValue: (id: any) => packrewardMeta | null;
    static GeTableData: () => any;
    static ParsePackData: () => void;
    static GetValueByPackIDAndLevel: (packID: any, level: any, packObj: any) => void;
    static Destroy: () => void;

    _data: any = {};

    constructor() {}

    static MakeEntity(data: any) {
        let meta = new packrewardMeta()
        meta.UpdateData(data)
        console.log('==========');
        return meta
    }

    UpdateData(data: any) {
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

    // Price(){
    //     this._data.price
    // }
    Item(){
        return this._data.item
    }
   
}
packrewardMeta.GetValue = function(id) {
    let meta = Meta.MetaManager.GetMeta(Meta.MetaType.packreward, id)
    if (!meta) return null
    return meta;
    // return meta.getValue(key)
}
// 根据包的id解析一下数�?
packrewardMeta.GeTableData = function() {
    let meta = Meta.MetaManager.GetMetas(Meta.MetaType.packreward)
    return meta;
}
packrewardMeta.ParsePackData=function(){
    if(this.isInited)return;
    this.isInited=true
    let dt=this.GeTableData();
    // console.log(dt,'zzzz');
    for (const key in dt) {
        if (Object.hasOwnProperty.call(dt, key)) {
            const element = dt[key];
            // let it=new packDataItem(element._data);
            // this.packTableData.push(it);
        }
    }
    
    console.log(this.packTableData);
}

packrewardMeta.GetValueByPackIDAndLevel = function(packID: any, level: any, packObj: any) {
    let dt=this.GeTableData();
    for (const key in dt) {
        if (Object.hasOwnProperty.call(dt, key)) {
            const it = dt[key]._data;
            let ar=GiftData.format_string_2_array(it.maplimited,',',/\[|]/g)
            let levelRange=[parseInt(ar[0]),parseInt(ar[1])]
            // console.log(packID,it.packid,"++",level,levelRange);
            if(it.packid.toString()==packID.toString()&&((level>=levelRange[0]&&level<=levelRange[1]))){
                packObj.bounce=Object.assign({},it);
                // console.log( packObj.bounce,'zzzzz');
                return ;
            }
        }
    }
}
// 活动结束时删除所有数�?
packrewardMeta.Destroy=function(){
    this.packTableData=[]
    this.isInited=false;
}

global.Meta.packrewardMeta = packrewardMeta

class packDataItem{
    packId = -1;
    levelRange = [0, 0];
    bounds: any[] = [];
    constructor(it: any) {
        this.packId=it.packid
        let ar=GiftData.format_string_2_array(it.maplimited,',',/\[|]/g)
        this.levelRange=[parseInt(ar[0]),parseInt(ar[1])]

        let strArr=it.item.split(";");
        for (let index = 0; index < strArr.length; index++) {
            const element = strArr[index];
            let ar=element.split("=");
            let obj: any = {}
            obj.type=parseInt(ar[0])
            obj.sub=parseInt(ar[1])
            obj.count=parseInt(ar[2])
            this.bounds.push(obj)
            
        }

        // console.log(this.bounds);
    }
    checkExist(level: any){
        return this.levelRange.indexOf(level)>-1
    }
}
