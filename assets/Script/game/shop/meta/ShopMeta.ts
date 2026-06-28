import '../../../LegacyGlobals';
class ShopMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ShopMeta()
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

    Type() {
        return this._data.type
    }

    TagType() {
        return this._data.tagType
    }

    Name() {
        return this._data.name
    }

    DefaultPrice() {
        return this._data.price
    }

    Price() {
        if (this.Type() === ShopMeta.Types.Chest) {
            return Meta.MetaManager.GetMeta(Meta.MetaType.ShopCardPrice, Game.SUserVillage.MapId()).Price(this.DefaultPrice())
        } else if (this.Type() === ShopMeta.Types.CoinPack) {
            return Game.Content.FromString(this.DefaultPrice()).Contents()[0].Count()
        }
        return this.DefaultPrice()
    }

    PriceString() {
        if (this.Type() === ShopMeta.Types.Chest || this.Type() === ShopMeta.Types.CoinPack) {
            return GameKit.StringUtil.formatNumber(this.Price())
        }
        return AppKit.PaymentWrap.GetItem(this.Name()).PriceString()
    }

    Content() {
        if (!this.content) {
            let contentType = Game.Content.Types.Ap
            let contentId = 0
            let contentCount = this._data.count
            if (this.Type() === ShopMeta.Types.ShopCoin) {
                contentType = Game.Content.Types.ShopCoin
                contentId = this._data.count
                contentCount = 1
            } else if (this.Type() === ShopMeta.Types.Pack || this.Type() === ShopMeta.Types.CoinPack) {
                contentType = Game.Content.Types.Pack
                contentId = this._data.count
                contentCount = 1
            } else if (this.Type() === ShopMeta.Types.DynamicPack) {
                contentType = Game.Content.Types.DynamicPack
                contentId = this._data.count
                contentCount = 1
            } else if (this.Type() === ShopMeta.Types.Chest) {
                contentType = Game.Content.Types.CardChest
                contentId = parseInt(this._data.name)
                contentCount = 1
            } else if (this.Type() === ShopMeta.Types.PayChest) {
                contentType = Game.Content.Types.CardChest
                contentId = parseInt(this._data.count)
                contentCount = 1
            } else if (this.Type() === ShopMeta.Types.PayJocker) {
                contentType = Game.Content.Types.RandomPack
                contentId = parseInt(this._data.count)
                contentCount = 1
            } else if (this.Type() === ShopMeta.Types.Item || this.Type() === ShopMeta.Types.Items || this.Type() === ShopMeta.Types.Treat || 
            this.Type() === ShopMeta.Types.ActivityItem || this.Type() === ShopMeta.Types.SuperShield) {
                this.content = Game.Content.FromString(this._data.count)
                return this.content
            }
            this.content = new Game.Content(contentType, contentId, contentCount)
        }
        return this.content
    }

    Count() {
        return this.Content().Contents()[0].Count()
    }

    RawCount() {
        return this._data.count
    }

    Sort() {
        return this._data.sort || 0
    }

    Num() {
        return this._data.num
    }
    //纯UI表现
    Consumable() {
        return this._data.consumable
    }
    //纯UI表现
    Off() {
        return this._data.off
    }
    //纯UI表现
    OnSale() {
        return this._data.onsale
    }

    InShop() {
        return this._data.inShop
    }

    IsHot(){
        return this._data.label=="HOT"
    }

    Index(){
        let ar=this.DefaultPrice().split(".");
        return ar[ar.length-1]||0
    }
}

ShopMeta.Types = {
    Spin: 1,
    ShopCoin: 2,
    Chest: 3,
    PayChest: 33,
    PayJocker: 34,
    Servant: 4,
    Pack: 5,
    DynamicPack: 55,
    Item: 6,
    Items: 60,
    Treat: 7,
    CoinPack: 8,
    ActivityItem: 9,
    DailyBonus: 10,
    VIP: 11,
    SuperShield: 12,
    LevelBonus: 13,
    Gem:100,
    Sale:101,
    Hot:102
}

////////////////////////////////////////
ShopMeta.GetByType = function(type) {
    if (!this._GetByTypeResult) {
        this._GetByTypeResult = {}
        let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Shop)
        for(let id in metas) {
            let meta = metas[id]
            let ntype = meta.Type()
            if (!this._GetByTypeResult[ntype]) this._GetByTypeResult[ntype] = []
            this._GetByTypeResult[ntype].push(meta)
        }
    }
    return this._GetByTypeResult[type]
}

ShopMeta.GetByTypeIndex = function(type, index) {
    if (!ShopMeta.GetByType(type)) return null
    return ShopMeta.GetByType(type)[index]
}
ShopMeta.GetByTypeCount = function(type, count) {
    if (!ShopMeta.GetByType(type)) return null
    let metas = ShopMeta.GetByType(type)
    for(let id in metas) {
        let meta = metas[id]
        if (meta.RawCount() == count) {
            return meta
        }
    }
    return null
}

ShopMeta.GetShopIdByName = function(name) {
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Shop)
    for(let id in metas) {
        let meta = metas[id]
        if (meta.Name() == name) {
            return meta.Id()
        }
    }
    return null
}

ShopMeta.get_buy_item_type=function(shopId) {
    return shopId
        ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId).Type() === Meta.ShopMeta.Types.CoinPack ? "coin" : "money"
        : "free"
}

global.Meta.ShopMeta = ShopMeta
