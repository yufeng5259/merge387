import { instantiate, Node, Prefab, SpriteFrame, UITransform, sp } from 'cc';

function getNodeWidth (node: Node) {
    return node.getComponent(UITransform)?.width || 0;
};

function getNodeHeight (node: Node) {
    return node.getComponent(UITransform)?.height || 0;
};

export default class Content  {
    public type: any;
    public cid: any;
    public count: any;

    public static RoundCoin: (num: any) => any;
    public static Types: any;
    public static JokerCardId: any;
    public static Merge: (conts: any[]) => any[];

    constructor (type, cid, count) {
        this.type = type
        this.cid = cid
        this.count = count
    }

    toString() {
        if (this.IsBigNumberCount()) return this.type.toString() + "=" + this.cid.toString() + "=" + BigNumber.format(this.count)
        return this.type.toString() + "=" + this.cid.toString() + "=" + this.count.toString()
    }

    static FromString(str) {
        if (str == null) return null
        let strs = str.split("=")
        try {
            if (Content._IsBigNumberCount(parseInt(strs[0]))) return new Content(parseInt(strs[0]), parseInt(strs[1]), BigNumber.fromFormat(strs[2]))
            return new Content(parseInt(strs[0]), parseInt(strs[1]), parseFloat(strs[2]))
        } catch(e) {}
        return null
    }

    static FromStrings(sstr) {
        if (sstr == null) return []
        let strss = sstr.split(";")
        let conts = []
        strss.forEach(str => {
            if (str) {
                conts.push(Content.FromString(str))
            }
        })
        return conts
    }

    static FromContent(cont) {
        return new Content(cont.type, cont.cid, cont.count)
    }

    static FromContents(conts) {
        let contents = []
        conts.forEach(c => {contents.push(Content.FromContent(c))})
        return contents
    }

    static ToStrings(conts) {
        let str = ""
        conts.forEach(c => {str += c.toString() + ";"})
        if (str.length > 0) str = str.substring(0, str.length - 1)
        return str
    }

    /////////////////////////////////
    ContentType() {
        return this.type
    }
    Type() {
        return this.type
    }

    ContentId() {
        return this.cid
    }
    Id() {
        return this.cid
    }

    ContentCount() {
        return this.count
    }
    Count() {
        return this.count
    }

    SetCount(c) {
        this.count = c
        return this
    }

    //带有格式的数值字符串
    FormatCount() {
        if (this.IsBigNumberCount()) {
            return BigNumber.format(this.Count())
        }
        return GameKit.StringUtil.formatNumber(this.Count())
    }

    //数据是否是大数
    IsBigNumberCount() {
        return Content._IsBigNumberCount(this.Type())
    }

    static _IsBigNumberCount(type) {
        if (false) {
            return true
        }
        return false
    }

    ////////////////////////

    Name() {
        if (this.Type() === Content.Types.Coin) {
            return GameKit.i18n.t("ContentNameCoin")
        } else if (this.Type() === Content.Types.Cash) {
            return GameKit.i18n.t("ContentNameCash")
        } else if (this.Type() === Content.Types.Ap) {
            return GameKit.i18n.t("ContentNameAp")
        } else if (this.Type() === Content.Types.Shield || this.Type() === Content.Types.TimeShield || this.Type() === Content.Types.SuperTimeShield) {
            return GameKit.i18n.t("ContentNameShield")
        } else if (this.Type() === Content.Types.Card) {
            //小丑卡
            if (this.ContentId() == Content.JokerCardId) {
                return GameKit.i18n.t("JokerCard")
            }
            let card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, this.ContentId())
            return card_meta.Name()
        } else if (this.Type() === Content.Types.CardChest) {
            return GameKit.i18n.t("ContentNameChest" + this.ContentId())
        } else if (this.Type() === Content.Types.Pack || this.Type() === Content.Types.DynamicPack || this.Type() === Content.Types.RandomPack) {
            return GameKit.i18n.t("ContentNamePack")
        } else if (this.Type() === Content.Types.ShopCoin) {
            return GameKit.i18n.t("ContentNameCoin")
        } else if (this.Type() === Content.Types.Item) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Item, this.ContentId())
            if (!meta) return GameKit.i18n.t("ContentNameUnknown")
            return meta.Name()
        } else if (this.Type() === Content.Types.ActivityItem) {
            let key = "ContentNameActivityItem" + this.ContentId()
            if (!GameKit.i18n.has(key)) key = "ContentNameActivityItemCommon"
            return GameKit.i18n.t(key)
        } else if (this.Type() === Content.Types.Servant) {
            return GameKit.i18n.t("ServantName" + this.Id())
        }else if (this.Type() === Content.Types.Exp) {
            return GameKit.i18n.t("EXP")
        }else if (this.Type() === Content.Types.TaskPoint) {
            return GameKit.i18n.t("TaskPoint")
        }else if (this.Type() === Content.Types.NewGiftPack) {
            let giftMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftPackageItems, this.ContentId())
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, giftMeta.MergeElementID())
            return meta.Name()
        }else if (this.Type() === Content.Types.MergeIcon) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.ContentId())
            return meta.Name()
        }

        return GameKit.i18n.t("ContentNameUnknown")
    }

    Description() {
        if (this.Type() === Content.Types.Coin) {
            return GameKit.i18n.t("ContentNameCoin") + " x " + this.ContentCount()
        } else if (this.Type() === Content.Types.Cash) {
            return GameKit.i18n.t("ContentNameCash") + " x " + this.ContentCount()
        } else if (this.Type() === Content.Types.Ap) {
            return GameKit.i18n.t("ContentNameAp") + " x " + this.ContentCount()
        } else if (this.Type() === Content.Types.Shield) {
            return GameKit.i18n.t("ContentNameShield") + " x " + this.ContentCount()
        } else if (this.Type() === Content.Types.TimeShield || this.Type() === Content.Types.SuperTimeShield) {
            return GameKit.i18n.t("ContentNameShield") + " : " + String.format(GameKit.i18n.t("CountDay"), GameKit.TimeUtil.FormatTime(this.ContentCount()).day)
        } else if (this.Type() === Content.Types.Card) {
            //小丑卡
            if (this.ContentId() == Content.JokerCardId) {
                return GameKit.i18n.t("JokerCard")
            }
            let card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, this.ContentId())
            return card_meta.Name()
        } else if (this.Type() === Content.Types.CardChest) {
            return this.Name() + " x " + this.ContentCount()
        } else if (this.Type() === Content.Types.Pack || this.Type() === Content.Types.DynamicPack) {
            let cons = this.Contents()
            let consString = ""
            for (let i = 0; i < cons.length; i++) {
                if (i != 0) consString += " & "
                let con = cons[i]
                consString += con.Desc()
            }
            return consString
        } else if (this.Type() === Content.Types.RandomPack) {
            return GameKit.i18n.t("ContentNamePack")
        } else if (this.Type() === Content.Types.ShopCoin) {
            return this.Contents()[0].Desc()
        } else if (this.Type() === Content.Types.Item) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Item, this.ContentId())
            if (!meta) return GameKit.i18n.t("ContentNameUnknown")
            return meta.Desc()
        } else if (this.Type() === Content.Types.Servant) {
            return this.Name()
        }else if (this.Type() === Content.Types.Exp) {
            return this.Name()
        }else if (this.Type() === Content.Types.TaskPoint) {
            return this.Name()
        }else if (this.Type() === Content.Types.NewGiftPack) {
            let giftMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftPackageItems, this.ContentId())
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, giftMeta.MergeElementID())
            return meta.Description();
        }

        return GameKit.i18n.t("ContentNameUnknown")
    }
    Desc() {
        return this.Description()
    }

    Icon(sprite, cb) {
        if (!sprite || !sprite.node) return
        let height = getNodeHeight(sprite.node)
        if (this.Type() === Content.Types.Coin) {
            if (this.Count() > 5000000) sprite.spriteFrame = CommonAssets.instance.icon_coinB
            else sprite.spriteFrame = CommonAssets.instance.icon_coin
        } else if (this.Type() === Content.Types.Cash) {
            sprite.spriteFrame = CommonAssets.instance.icon_cash
        } else if (this.Type() === Content.Types.Ap) {
            if (this.Count() > 500) sprite.spriteFrame = CommonAssets.instance.icon_spinB
            else sprite.spriteFrame = CommonAssets.instance.icon_spin
        } else if (this.Type() === Content.Types.Shield) {
            sprite.spriteFrame = CommonAssets.instance.icon_shield
        } else if (this.Type() === Content.Types.TimeShield || this.Type() === Content.Types.SuperTimeShield) {
            sprite.spriteFrame = CommonAssets.instance.icon_shield
        } else if (this.Type() === Content.Types.Card) {
            //小丑卡
            if (this.ContentId() == Content.JokerCardId) {
                let sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.Item, "icon_jokerCard")
                sprite.spriteFrame = sp
            } else {
                let resName = "window/Card/CardModel"
                cce.loadRes(resName, Prefab, function (err, v) {
                    if (err != null) { Logs.Warning(err); return }
                    let cm = instantiate(v)
                    cm.parent = sprite.node
                    cm.setPosition(0, 0)
                    const cardHeight = getNodeHeight(cm)
                    const cardScale = cardHeight ? height / cardHeight : 1
                    cm.setScale(cardScale, cardScale, cardScale)
                    let c = cm.getComponent("CardModel")
                    c.show(this.ContentId(), "no-check")
                    c.show_more_count("reset")
                    if (cb != null) cb()
                }.bind(this))
                return
            }
        } else if (this.Type() === Content.Types.CardChest) {
            //if (this.ContentId() == 1) height *= 0.9
            //if (this.ContentId() == 2) height *= 0.95
            let chestMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, this.ContentId())
            console.log(CommonAssets.Atlases.CardChest,"+++", chestMeta.Icon());
            
            if(chestMeta&&CommonAssets.instance.getByAtlas(CommonAssets.Atlases.CardChest, chestMeta.Icon())){
                //普通卡牌箱子
                console.log("111111111");
                
                sprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.CardChest, chestMeta.Icon())
            }else if(CommonAssets.instance.cardLimitSkinAssets){
                //限时卡牌的箱子
                console.log("222222222");
                
                let spName=CardLimitSkinAssetsSetting.box[this.ContentId().toString()]
                sprite.spriteFrame = CommonAssets.instance.cardLimitSkinAssets[spName]
            }
        } else if (this.Type() === Content.Types.Pack || this.Type() === Content.Types.DynamicPack) {
            sprite.spriteFrame = CommonAssets.instance.icon_pack
        } else if (this.Type() === Content.Types.RandomPack) {
            let jtmeta  = Game.ActivityManager.GetActiveGame2ActivityByType(Meta.ActivityMeta.SubTypes.JackTravel)
            if(jtmeta){

            }else{
                height *= 1.3
            }
            
            sprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.RandomPack, this.ContentId().toString())
        } else if (this.Type() === Content.Types.ShopCoin) {
            sprite.spriteFrame = CommonAssets.instance.icon_coin
        } else if (this.Type() === Content.Types.Item) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Item, this.ContentId())
            if (!meta) {
                sprite.spriteFrame = CommonAssets.instance.icon_pack
            } else {
                let sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.Item, meta.Icon())
                sprite.spriteFrame = sp
            }
        } else if (this.Type() === Content.Types.ActivityItem) {
            sprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.ActivityItem, this.ContentId().toString())
        }else if(this.Type()===Content.Types.BadBoss){
            let resName = 'res/Activity/JackTravel/jt_c3.png';
                cce.loadRes(resName, SpriteFrame, function (err, v) {
                    if (err != null) { Logs.Warning(err); return }
                    if (!sprite || !sprite.node) return
                    sprite.spriteFrame = v
                    if (cb != null) cb()
                }.bind(this))
        } else if (this.Type() === Content.Types.Gift) {

            sprite.spriteFrame=null
            let toolSpineAnimation=CommonAssets.instance.getToolSpineAnimationByKey(this.ContentId());
            if(toolSpineAnimation){
                let nd=new Node()
                nd.parent=sprite.node
                let spine=nd.addComponent(sp.Skeleton)
                spine.skeletonData = toolSpineAnimation.spineUrl;
                spine.setAnimation(0, this.ContentId(), true);
                const giftScale = getNodeWidth(sprite.node) / 117 * 0.5
                nd.setScale(giftScale, giftScale, giftScale)
            }else{
                sprite.spriteFrame=CommonAssets.instance.getByAtlas(CommonAssets.Atlases.toolSpineAtlas, this.ContentId().toString())
            }
                        
        }else if (this.Type() === Content.Types.Exp) {
            sprite.spriteFrame=CommonAssets.instance.icon_exp
        }else if (this.Type() === Content.Types.TaskPoint) {
            sprite.spriteFrame=CommonAssets.instance.icon_TaskPoint
        }else if (this.Type() === Content.Types.NewGiftPack) {
            
            //先从giftPackageItems表中获得棋子id,
            let giftMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftPackageItems, this.ContentId())
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, giftMeta.MergeElementID())
            let iconSpf = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon())
            sprite.spriteFrame=iconSpf;
        }else if (this.Type() === Content.Types.MergeIcon) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.ContentId())
            let iconSpf = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon())
            sprite.spriteFrame=iconSpf;
        }else if (this.Type() === Content.Types.Symbol) {
            let iconSpf = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, this.ContentId().toString())
            sprite.spriteFrame=iconSpf;
        }
        if (cb != null) cb()
    }

    ColorCode() {
        if (this.Type() === Content.Types.Coin) {
            return "<color=#fff000>"
        } else if (this.Type() === Content.Types.Cash) {
            return "<color=#58BD38>"
        } else if (this.Type() === Content.Types.Ap) {
            return "<color=#77e7ff>"
        } else if (this.Type() === Content.Types.Shield) {
            return "<color=#D1843D>" 
        } else if (this.Type() === Content.Types.TimeShield || this.Type() === Content.Types.SuperTimeShield) {
            return "<color=#D1843D>"
        } else if (this.Type() === Content.Types.Card) {
            return "<color=#ffffff>"
        } else if (this.Type() === Content.Types.CardChest) {
            return "<color=#ffffff>"
        } else if (this.Type() === Content.Types.Pack || this.Type() === Content.Types.DynamicPack || this.Type() === Content.Types.RandomPack) {
            return "<color=#ffffff>"
        } else if (this.Type() === Content.Types.ShopCoin) {
            return "<color=#F8EA4E>"
        } else if (this.Type() === Content.Types.RandomPack) {
            return "<color=#ffffff>"
        } else if (this.Type() === Content.Types.Item) {
            if (this.Id() == 2) return "<color=#d9baff>"
            if (this.Id() == 3) return "<color=#ffbca7>"
            return "<color=#F889EB>"
        } else if (this.Type() === Content.Types.Servant) {
            return "<color=#ffffff>"
        } else if (this.Type() === Content.Types.Exp) {
            return "<color=#E1FF00>"
        } else if (this.Type() === Content.Types.TaskPoint) {
            return "<color=#ffffff>"
        } else if (this.Type() === Content.Types.NewGiftPack) {
            return "<color=#ffffff>"
        } 

        return "<color=#F889EB>"
    }

    //pack包含的contents 或者只有自身
    //配置类型会转换为实际道具的content
    Contents() {
        let contents = []
        if (this.Type() === Content.Types.Pack) {
            contents = Meta.MetaManager.GetMeta(Meta.MetaType.PackItem, this.ContentId()).Contents()
        } else if (this.Type() === Content.Types.DynamicPack) {
            let rawPackId = this.ContentId()
            contents = Meta.DynamicPackMeta.FindMeta(rawPackId, Game.SUserVillage.MapId(), Game.SUserRecord.GetPurchaseMoney()).Contents()
        } else {
            contents.push(this)
        }

        for(let i = 0; i < contents.length; i++) {
            let content = contents[i]
            if (content.Type() === Content.Types.ShopCoin) {
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.ShopCoin, Game.SUserVillage.MapId())
                contents[i] = new Content(Content.Types.Coin, 0, Content.RoundCoin(meta.GetCoin(content.ContentId()) * content.Count()))
            }
        }

        return contents
    }

    GetObject() {
        return {
            type: this.type,
            cid: this.cid,
            count: this.count,
        }
    }
};

Content.RoundCoin = function(num) {
    num = Math.round(num)
    let len = num.toString().length
    let ro = Math.pow(10, len - 3)
    return Math.round(num / ro) * ro
}

Content.Types = {
    BadBoss:999,        //翻箱子魔王
    Coin: 1,            //金币
    Cash: 7,            //现金7=0=1
    Ap: 2,              //体力
    Exp:8,              //经验值

    Shield: 3,          //护盾
    TimeShield: 13,     //时效护盾
    SuperTimeShield: 14,//超级时效护盾
    
    Card: 4,            //卡片,id11小丑卡
    CardChest: 5,       //卡片箱子

    Item: 6,            //道具
    Servant: 16,        //随从,宠物

    NewGiftPack:18,     //二合道具包
    Pack: 10,           //道具包
    DynamicPack: 12,    //动态道具包
    RandomPack: 15,     //随机道具包,小丑箱
    ShopCoin: 11,       //商店金币

    Jigsaw: 101,        //拼图
    Symbol: 110,        //收集物品110-15-1
    ActivityItem: 102,  // 活动item道具
    MergeIcon:9,          //棋子 9=20=1  棋子=棋子id=棋子数量


    JackTicket:20,      //jack机票
    Gift:21,             //各种功能道具 //1:限时老虎机双倍金币道具（金蛋）  2:限时建造村庄折扣（木槌） 3:限时村庄完成建造奖励(石锤),4:气球活动,5:卡牌加倍,6:老虎机加倍

    TaskExp:19,        //任务经验
    TaskPoint:17,        //任务积分
}

Content.JokerCardId = 11

//整合数据 保证一个类型只有一条数据
var _Merge = function(cont, conttysts) {
    //同类型数据相加
    if (cont.Count() == 0) return
    let conttystKey = cont.Type().toString() + "=" + cont.ContentId().toString()
    if (!conttysts.hasOwnProperty(conttystKey)) { conttysts[conttystKey] = 0 }
    if (cont.IsBigNumberCount()) conttysts[conttystKey] = BigNumber.add(conttysts[conttystKey], cont.Count())
    else conttysts[conttystKey] += cont.Count()
}
Content.Merge = function(conts) {
    let conttysts = {}
    for (let i = 0; i < conts.length; i++) {
        let contcs = conts[i].Contents()
        contcs.forEach(cont => {_Merge(cont, conttysts)})
    }

    let contstrs = []
    for (let conttystKey in conttysts) {
        let conttystCount = conttysts[conttystKey]
        contstrs.push(conttystKey + "=" + conttystCount.toString())
    }

    let result = []
    contstrs.forEach(function(x){
        result.push(Content.FromString(x))
    })
    return result
};


(global as any).Game.Content = Content;
