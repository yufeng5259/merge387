import '../../LegacyGlobals';
import ChildWindowChain from '../../GameKit/ui/ChildWindowChain';
// 检测花费是否足�?
const Content = Game.Content

const ContentCheck: any = {}

ContentCheck.GetCurrentApRecoverLast = function() {
    try {
        if (GameKit && GameKit.TimeUtil && GameKit.TimeUtil.getCurrentTime) {
            return GameKit.TimeUtil.getCurrentTime() - 1
        }
    } catch (e) {}
    return Math.floor(Date.now() / 1000)
}

ContentCheck.UpdateApBeforeRead = function() {
    try {
        if (Game.SUser && Game.SUser.UpdateApTime) Game.SUser.UpdateApTime()
    } catch (e) {}
}

ContentCheck.CheckContents = function(contents) {
    if (!contents || contents.length == 0) return true

    contents = Content.Merge(contents)
    for (let i = 0; i < contents.length; i++) {
        if (!ContentCheck.CheckContent(contents[i])) return false
    }
    return true
}
/**客户端消费并发送ap，coin，cash事件去更�?,服务器更新后刷新UI*/
ContentCheck.ClientUseConten = function(content) {
    if (!content) return
    let type = content.type
    let count = content.count
    if (count <= 0) return

    if (type == Content.Types.Coin) {
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.CoinEvent, { coin: Game.SUser.Coin() - count })
    } else if (type == Content.Types.Ap) {
        ContentCheck.UpdateApBeforeRead()
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.ApEvent, {
            ap: Game.SUser.Ap() - count,
            apRecover: 0,
            apRecoverLast: ContentCheck.GetCurrentApRecoverLast()
        })
    } else if (type == Content.Types.Cash) {
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.CashEvent, { cash: Game.SUser.Cash() - count })
    }
}

ContentCheck.UpdateByResources = function(resources) {
    if (!resources) return
    if (resources["1_0"] != null) {
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.CoinEvent, { coin: resources["1_0"] })
    }
    if (resources["2_0"] != null) {
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.ApEvent, { ap: resources["2_0"] })
    }
    if (resources["7_0"] != null) {
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.CashEvent, { cash: resources["7_0"] })
    }
}

ContentCheck.CheckContent = function(content) {
    let type = content.Type()

    console.log(type,'ContentCheck.CheckContent',content);

    if (type == Content.Types.Coin) {
        return ContentCheck.CheckCoin(content.Count())
    } else if (type == Content.Types.Ap) {
        return ContentCheck.CheckAp(content.Count())
    } else if (type == Content.Types.Item) {
        return ContentCheck.CheckItem(content.Id(), content.Count())
    } else if (type == Content.Types.Cash) {
        return ContentCheck.CheckCash(content.Count())
    }
    return true
}

ContentCheck.CheckCoin = function(price, showShop = false, onlyNotEnough = false) {
    let userdata = Game.SUser.Coin()
    if (userdata >= price) {
        return true
    } else {
        UIRoot.instance.openChildWindow("HowToWindow")
        return false
        if (showShop) {
            UIRoot.instance.openChildWindow("ShopWindow", {showCoin: true})
        } else {
            if (Game.ActivityManager.checkSpecialOffer()) return false
            
            let dis = price - userdata
            let coinNotEnoughShop = G.GameConstance.coinNotEnoughShop
            for (let i = 0; i < coinNotEnoughShop.length; i++) {
                let id = coinNotEnoughShop[i]
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, id)
                if (meta.Count() >= dis || i == coinNotEnoughShop.length-1) {
                    UIRoot.instance.openChildWindow("CoinNotEnoughWindow", {meta: meta, showCallback: (window) => {
                        if (onlyNotEnough) return
                        window.addOnCloseFunc(() => {
                            if (!AppKit.ADWrap.IsVideoPrepared()) return
                            let adCoinTime = GameKit.PlayerPrefs.GetInt("adCoinTime", 0)
                            if (GameKit.TimeUtil.getCurrentHalfDay() !== adCoinTime) {
                                GameKit.PlayerPrefs.SetInt("adCoinCount", 0)
                                GameKit.PlayerPrefs.SetInt("adCoinTime", GameKit.TimeUtil.getCurrentHalfDay())
                            }
                            let adCoinCount = GameKit.PlayerPrefs.GetInt("adCoinCount", 0)
                            if (adCoinCount < (AppKit.PaymentWrap.PayEnabled() ? G.GameConfig.adCoinCount : (G.GameConfig.adCoinCount * 2))) {
                                let adCoinTipCount = GameKit.PlayerPrefs.GetInt("adCoinTipCount", 0)
                                adCoinTipCount++
                                GameKit.PlayerPrefs.SetInt("adCoinTipCount", adCoinTipCount)
                                if (adCoinTipCount >= 3) {
                                    UIRoot.instance.openChildWindow("WatchGetCoinWindow")
                                    GameKit.PlayerPrefs.SetInt("adCoinTipCount", 0)
                                }
                            }
                        })
                    }})
                    break
                }
            }
        }
    }
    return false
}

ContentCheck.CheckAp = function(price) {
    ContentCheck.UpdateApBeforeRead()
    let userdata = Game.SUser.Ap()
    if (userdata >= price) {
        return true
    } else {
        //
        UIRoot.instance.openChildWindow("ApNotEnoughDialogWindow")
        return false
        if (Game.ActivityManager.checkSpecialOffer()) return false

        let dis = price - userdata
        let apNotEnoughShop = G.GameConstance.apNotEnoughShop
        //console.log(apNotEnoughShop)
        for (let i = 0; i < apNotEnoughShop.length; i++) {
            let id = apNotEnoughShop[i]
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, id)
            if (meta.Count() >= dis || i == apNotEnoughShop.length-1) {
                let chain = new ChildWindowChain()

                chain.add("NewPlayerPackWindow", () => {return Game.SUserStatus.GetNewPlayerLeftTime() != 0})

                let saleActivity = Game.ActivityManager.GetActiveShopActivityByType(Meta.ActivityMeta.SubTypes.SalePack)
                if (saleActivity) chain.add("ActivitySalePackWindow", null, {meta:saleActivity})
                
                chain.add("ApNotEnoughWindow", null, {meta:meta})
                /*chain.add("InviteWindow", () => {
                    return !G.GameConfig.closeShare
                })*/
                chain.add("WatchGetSpinWindow", () => {
                    if (!AppKit.ADWrap.IsVideoPrepared()) return false
                    let adSpinTime = GameKit.PlayerPrefs.GetInt("adSpinTime", 0)
                    if (GameKit.TimeUtil.getCurrentHalfDay() !== adSpinTime) {
                        GameKit.PlayerPrefs.SetInt("adSpinCount", 0)
                        GameKit.PlayerPrefs.SetInt("adSpinTime", GameKit.TimeUtil.getCurrentHalfDay())
                    }
                    let adSpinCount = GameKit.PlayerPrefs.GetInt("adSpinCount", 0)
                    if (adSpinCount < (AppKit.PaymentWrap.PayEnabled() ? G.GameConfig.adSpinCount : (G.GameConfig.adSpinCount * 2))) {
                        return true
                    }
                    return false
                })
                chain.start()
                break
            }
        }
    }
    return false
}
ContentCheck.CheckCash = function(price) {
    let userdata = Game.SUser.Cash()
    if (userdata >= price) {
        return true
    } else {
        UIRoot.instance.GetWindow("ShopWindow").tab_node_array.changeIndex(0)
        //UIRoot.instance.openChildWindow("ShopWindow", {showCash: true})
    }
    return false
}

ContentCheck.CheckItem = function(id, count) {
    let userCount = Game.SUserItems.getNum(id)
    if (userCount >= count) {
        return true
    }
    UIRoot.instance.openChildWindow("SimpleItemBuyWindow", {itemId: id})

    return false
}

Game.ContentCheck = ContentCheck
