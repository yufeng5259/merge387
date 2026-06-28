import '../../../../LegacyGlobals';
class PassPortShopMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new PassPortShopMeta()
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

    Name(){
        return this._data.name
    }
    
    Type(){
        return this._data.type
    }

    ShopID(){
        return this._data.shopID
    }
    
    Params(){
        return this._data.param
    }
    AddLevel(){
        let para=this.Params()
        return para.buyLevel+para.addLevel
    }
    IsHot(){
        return this._data.isHot||false
    }
}

PassPortShopMeta.GetMetasByType=function(type){
    let metas=Meta.MetaManager.GetMetas(Meta.MetaType.PassPortShop)
    let m=[]
    for (const key in metas) {
        if (Object.hasOwnProperty.call(metas, key)) {
            const element = metas[key];
            if(element.Type()==type){
                m.push(element)
            }
        }
    }

    return m
}

PassPortShopMeta.Type={
    Ticket:1,
    Level:2,
}

global.Meta.PassPortShopMeta = PassPortShopMeta