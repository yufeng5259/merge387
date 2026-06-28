import '../../../LegacyGlobals';
class ShopDailyMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ShopDailyMeta()
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
    //0、免�?
    //1、金�?
    //7、钻�?
    //货币类型
    CurrencyType() {
        return this._data.currencyType
    }
    //价格
    Price() {
        return this._data.price
    }
    //奖励字符�?9=101001=1
    ItemId() {
        return this._data.itemId
    }
    //物品数量
    Count() {
        return this.Content().Contents()[0].Count()||this._data.count
    }
    //纯UI表现,打折
    Off() {
        return this._data.off||0
    }
    //纯UI表现,促销
    OnSale() {
        return this._data.onsale||false
    }
    //排序
    Sort() {
        return this._data.sort || 0
    }
    //静态库�?
    Num() {
        return this._data.num
    }
    //奖励单元
    Content() {
        if (!this.content) {
            
            this.content = Game.Content.FromString(this.ItemId())
        }
        return this.content
    }
    //是否显示广告按钮,如果广告准备�?且AD==0,因为表中是那么填写的
    HasAd(){
        return this._data.Ad==0
    }
    //设置服务器数�?
    setServerMeta(sdata){
        this.sdata = sdata;
    }
    PriceString() {
        return GameKit.StringUtil.formatNumber(this.Price())
    }
}
ShopDailyMeta.Cype={
    free:0,
    gold:1,
    cash:7
}
ShopDailyMeta.GetAllSorted = function() {
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.ShopDaily) || {}
    let result = []
    for (let id in metas) {
        result.push(metas[id])
    }
    result.sort(function(a, b) {
        if (a.Sort() !== b.Sort()) return a.Sort() - b.Sort()
        return a.Id() - b.Id()
    })
    return result
}

ShopDailyMeta.GetByType = function(type) {
    let result = []
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.ShopDaily) || {}
    for (let id in metas) {
        let meta = metas[id]
        if (meta.Type() === type) result.push(meta)
    }
    result.sort(function(a, b) {
        if (a.Sort() !== b.Sort()) return a.Sort() - b.Sort()
        return a.Id() - b.Id()
    })
    return result
}

ShopDailyMeta.GetByTypeIndex = function(type, index) {
    return ShopDailyMeta.GetByType(type)[index] || null
}

ShopDailyMeta.GetRandomByType = function(type) {
    let metas = ShopDailyMeta.GetByType(type)
    if (metas.length <= 0) return null

    let totalWeight = 0
    metas.forEach(function(meta) {
        totalWeight += Math.max(0, meta.Weight())
    })
    if (totalWeight <= 0) return metas[0]

    let random = (typeof G !== 'undefined' && G.getRandomFloat) ? G.getRandomFloat(0, totalWeight) : Math.random() * totalWeight
    let current = 0
    for (let i = 0; i < metas.length; i++) {
        current += Math.max(0, metas[i].Weight())
        if (random <= current) return metas[i]
    }
    return metas[metas.length - 1]
}

global.Meta.ShopDailyMeta = ShopDailyMeta
