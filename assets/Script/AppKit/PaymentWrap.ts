
//支付
var PaymentWrap: any = {payEnabled: false}

class PaymentItem {
    iapId: any
    price: any
    defaultPrice: any
    priceCurrencySymbol: any
    consumable: any

    constructor (iapId: any, price: any, priceCurrencySymbol: any, consumable: any) {
        this.iapId = iapId
        this.price = price
        this.defaultPrice = price
        this.priceCurrencySymbol = priceCurrencySymbol
        this.consumable = consumable
    }
    
    PriceString() {
        return this.priceCurrencySymbol + " " + this.price.toString().replace(".", BigNumber.dot)
    }
}
PaymentWrap.PaymentItem = PaymentItem

if (typeof FBInstant !== 'undefined') {
    FBInstant.payments.onReady(function() {
        PaymentWrap.payEnabled = true
    }.bind(this))
} 
PaymentWrap.Init = function() {
    if (!G.GameConfig.closePurchase) {
        if (wxTools.usewx) {
            this.payEnabled = AppKit.SdkManager.IsAndroid()
        } else if (fbInTools.usefbIn) {
        } else if (AppKit.SdkManager.IsNative()) {
            PaymentWrap.payEnabled = true
        } else {
            PaymentWrap.payEnabled = true
        }
    }
}

PaymentWrap.PayEnabled = function() {
    if (G.GameConfig.GAME_TEST) {
        return true
    }
    return this.payEnabled
}

PaymentWrap.PayVisiable = function() {
    if (wxTools.usewx) {
        return PaymentWrap.PayEnabled()
    } else if (fbInTools.usefbIn) {
        if (AppKit.SdkManager.IsIos()) return false
        return !G.GameConfig.closePurchase
    }
    return PaymentWrap.PayEnabled()
}

PaymentWrap.GetOnlineList = function() {
    if (wxTools.usewx) {

    } else if (fbInTools.usefbIn) {
        FBInstant.payments.getCatalogAsync()
        .then(function (catalog) {
            Logs.Info("FBInstant.payments.getCatalogAsync()", catalog)
            this.paymentInfo = catalog;
            let list = this.GetList()
            catalog.forEach(function(product) {
                let productID  = product.productID 
                let title = product.title
                let description = product.description
                let price = product.price
                let priceCurrencyCode = product.priceCurrencyCode
                let priceCurrencySymbol = ""//CurrencyCodeInfo.GetSymbol(priceCurrencyCode) //price字符串包含了symbol
                if (list[productID] != null) {
                    list[productID].price = price
                    list[productID].priceCurrencySymbol = priceCurrencySymbol
                    list[productID].title = title
                    list[productID].description = description
                }
            })
        }.bind(this))
        .catch(e => {
            Logs.log("FBInstant.payments.getCatalogAsync fail", e)
        });
    } else if (AppKit.SdkManager.IsNative()) {
        let ids = []
        let subIds = []
        let list = PaymentWrap.GetList()
        for (let id in list) {
            let item = list[id]
            if (item.consumable) {
                ids.push(id)
            } else {
                subIds.push(id)
            }
        }
        AppKit.NativeWrap.call("PaymentClass", "GetOnlineList", {ids:ids, subIds:subIds}, (info) => {
            if (info.success == "false") {
                PaymentWrap.GetOnlineList()
                return
            }
            var products = info.products
            if (products) {
                for (let productID in products) {
                    let product = products[productID]
                    if (list[productID] != null) {
                        list[productID].price = product.price
                        list[productID].priceCurrencySymbol = product.priceCurrencySymbol
                    }
                }
            }
            AppMain.instance.schedule(PaymentWrap.GetOnlineList, 900)
        })
    } else {

    }
}

PaymentWrap.SetByMeta = function(metas) {
    
    try {
        this.itemList = {}
        for (let id in metas) {
            let meta = metas[id]
            this.itemList[meta.Name()] = new PaymentItem(meta.Name(), meta.DefaultPrice(), GameKit.i18n.t("PriceSymbol"), meta.Consumable())
        }
        this.GetOnlineList()
    } catch (e) {
        Logs.Error("PaymentWrap.SetByMeta", e.message)
    }
}

PaymentWrap.GetList = function() {
    if (this.itemList == null) {
        this.itemList = {}
    }
    return this.itemList
}

PaymentWrap.GetItem = function(id) {
    return this.GetList()[id]
}

PaymentWrap.Pay = function(id, callback) {
    if (G.GameConfig.GAME_TEST && !AppKit.SdkManager.IsNative()) {
        PaymentWrap.PayOver(id, callback, true, "", 0, "", {})
        return
    }
    if (!AppKit.PaymentWrap.PayEnabled()) {
        if (fbInTools.usefbIn) {
            DialogWindow.Show(GameKit.i18n.t("PayDisableFBIn"), nullFunction)
        } else {
            DialogWindow.Show(GameKit.i18n.t("PayDisable"), nullFunction)
        }
        return
    }
    
    let item = this.GetList()[id]
    if (item == null) return

    AppKit.LogEventWrap.logEvent("pay_click", {id: id})
    LoadingWindow.Show()

    if (wxTools.usewx) {
        let price = PaymentWrap.GetItem(id).price
        wx.requestMidasPayment({
            mode: 'game',
            env: 0,
            offerId: G.GameConfig.wxOfferId,
            currencyType: 'CNY',
            buyQuantity: price,
            platform:"android",
            zoneId: "1",
            success() {
                // 支付成功
                PaymentWrap.PayOver(id, callback, true, "", 0)
            },
            fail({ errMsg, errCode }) {
                // 支付失败
                PaymentWrap.PayOver(id, callback, false, errMsg, errCode)
            }
        })
    } else if (fbInTools.usefbIn) {
        if (item.consumable) {
            fbInTools.payAndConsume(id, "sf_pay", function(ok, msg, code) {
                PaymentWrap.PayOver(id, callback, ok, msg, code)
            })
        } else {
            fbInTools.pay(id, "sf_pay", function(ok, msg, code) {
                PaymentWrap.PayOver(id, callback, ok, msg, code)
            })
        }
    } else if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("PaymentClass", "callPay", {productId: id}, function(info) {
            PaymentWrap.PayOver(id, callback, info.success, info.msg, info.code, info.reason, info)
            //AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")
        })
    } else {
        LoadingWindow.Hide()
    }
}

PaymentWrap.PayOver = function(id, callback, ok, msg, code, reason, info) {
    LoadingWindow.Hide()
    //if (code == "USER_INPUT") return
    
    if (code == "PENDING") {
        DialogWindow.Show(GameKit.i18n.t("PayPending"), nullFunction)
        return
    }
    
    if (ok) {
        AppKit.LogEventWrap.logEvent("pay_success", {productId:id, OrderId:info?info.OrderId:"null"})

        /*let reqlog = new GameKit.NetRequest(G.GameConfig.server + "/logpayment")
        reqlog.SetSilence(true)
        reqlog.SetRequestBody("userId", Game.SUser.UserId())
        reqlog.SetRequestBody("itemId", id)
        reqlog.SetRequestBody("price", PaymentWrap.GetItem(id).defaultPrice)
        reqlog.Send()*/

        let shopId = Meta.ShopMeta.GetShopIdByName(id)
        let shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId)
        if (shopMeta.Type() == Meta.ShopMeta.Types.VIP) {
            AppKit.LogEventWrap.logEvent("subscription_success", {productId:id, OrderId:info?info.OrderId:"null", Token:info?info.Token:"null"})
        }
        let reqps = SR.SRShop.paySuccess(shopId)
        reqps.SetRequestBody("productId", id)
        if (GameKit.DataCache.GetData("MultiplePurchase")) reqps.SetRequestBody("multiple", true)
        GameKit.DataCache.RemoveData("MultiplePurchase")
        if (AppKit.SdkManager.IsNative()) {
            if (AppKit.SdkManager.IsAndroid()) {
                reqps.SetRequestBody("GooglePlay", true)
                reqps.SetRequestBody("productId", info.productId)
                reqps.SetRequestBody("OrderId", info.OrderId)
                reqps.SetRequestBody("PurchaseData", info.PurchaseData)
                reqps.SetRequestBody("DataSignature", info.DataSignature)
                reqps.SetRequestBody("Token", info.Token)
            } else if (AppKit.SdkManager.IsIos()) {
                reqps.SetRequestBody("AppStore", true)
                reqps.SetRequestBody("productId", info.productId)
                reqps.SetRequestBody("OrderId", info.OrderId)
                reqps.SetRequestBody("Token", info.Token)
            }
        }
        let lastPurchaseMoney = Game.SUserRecord.GetPurchaseMoney()
        reqps.SetCallBack((res) => {
            if (AppKit.SdkManager.IsNative()) {
                AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")
            }

            if (callback != null) callback(true, res)

            AppKit.LogEventWrap.logEvent("pay_callback", {times:res.times, productId:id, OrderId:info?info.OrderId:"null"})
            AppKit.LogEventWrap.logAppAnalytic("af_purchase", {af_revenue:shopMeta.DefaultPrice(), af_currency:"USD", af_content_id:id})

            let purchaseCount = Game.SUserRecord.GetPurchaseCount()
            if (purchaseCount == 1) {
                AppKit.LogEventWrap.logEvent("purchased1")
            } else if (purchaseCount == 3) {
                AppKit.LogEventWrap.logEvent("purchased3")
            } else if (purchaseCount == 10) {
                AppKit.LogEventWrap.logEvent("purchased10")
            }
                
            let purchaseMoney = Game.SUserRecord.GetPurchaseMoney()
            var ptimes = [5,25,50,100,500,1000]
            ptimes.forEach(x => {
                if (purchaseMoney >= x && lastPurchaseMoney < x) {
                    AppKit.LogEventWrap.logEvent("purchase_" + x + "_USD")
                }
            })
    
            if (id == "cm.pack.5") {
                AppKit.LogEventWrap.logEvent("purchase_starter_pack")
            }
        })
        reqps.SetErrorCallBack((res) => {
            if (res.errorCode == ErrorCode.PAYMENT_VERIFY_ERROR && AppKit.SdkManager.IsNative()) {
                AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")
            }
            let ErrorMsgKey = "ErrorMsg" + res.errorCode.toString()
            let ErrorMsg = GameKit.i18n.t(ErrorMsgKey)
            if (ErrorMsg === ErrorMsgKey) ErrorMsg = GameKit.i18n.t("ErrorNormal")
            UIRoot.instance.openChildWindow("DialogWindow", {msg:ErrorMsg + " Code:" + res.errorCode.toString(), confirmFunc:function() {
                if (AppKit.SdkManager.IsNative()) UIRoot.instance.openChildWindow("PayFailWindow", {data:{productId:id,code:res.errorCode,msg:res.msg,OrderId:info.OrderId}})
            }})
        })
        reqps.SetNetErrorCallBack((res) => {
            if (AppKit.SdkManager.IsNative()) UIRoot.instance.openChildWindow("PayFailWindow", {data:{productId:id,code:res.errorCode,msg:res.msg,OrderId:info.OrderId}})
        })
        reqps.Send()

    } else {
        if (code == "USER_INPUT") {
            if (AppKit.SdkManager.IsNative()) UIRoot.instance.openChildWindow("PayFailWindow", {data:{productId:id,code:code,msg:msg,reason:reason}})
        } else {
            if (callback != null) callback(false, msg, code)
            DialogWindow.Show(GameKit.i18n.t("PayFail") + "\n(" + (code || "-1") + " " + (reason || "") + ")", () => {
                if (AppKit.SdkManager.IsNative()) UIRoot.instance.openChildWindow("PayFailWindow", {data:{productId:id,code:code,msg:msg,reason:reason}})
                UIRoot.instance.openChildWindow("PayFailWindow", {data:{productId:id,code:code,msg:msg,reason:reason}})
            })

            AppKit.LogEventWrap.logEvent("pay_fail", {id: id, msg: msg || "", code: code || "", reason: reason || ""})
        }
    }
}

PaymentWrap.Reorder = function() {
    if (fbInTools.usefbIn) {
        FBInstant.payments.getPurchasesAsync().then(function (purchases) {
            purchases.forEach(purchase => {
                FBInstant.payments.consumePurchaseAsync(purchase.purchaseToken)
            })
        });
    } else if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("PaymentClass", "callReorder", null, function(info) {
            if (info.success) {
                let id = info.productId
                AppKit.LogEventWrap.logEvent("pay_success", {productId:info.productId, OrderId:info.OrderId})
                /*let req = new GameKit.NetRequest(G.GameConfig.server + "/logpayment")
                req.SetSilence(true)
                req.SetRequestBody("userId", Game.SUser.UserId())
                req.SetRequestBody("itemId", id)
                req.SetRequestBody("price", PaymentWrap.GetItem(id).defaultPrice)
                req.Send()
                AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")*/

                let shopId = Meta.ShopMeta.GetShopIdByName(id)
                let shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId)
                let reqps = SR.SRShop.paySuccess(shopId)
                reqps.SetRequestBody("productId", id)
                if (AppKit.SdkManager.IsNative()) {
                    if (AppKit.SdkManager.IsAndroid()) {
                        reqps.SetRequestBody("GooglePlay", true)
                        reqps.SetRequestBody("productId", info.productId)
                        reqps.SetRequestBody("OrderId", info.OrderId)
                        reqps.SetRequestBody("PurchaseData", info.PurchaseData)
                        reqps.SetRequestBody("DataSignature", info.DataSignature)
                        reqps.SetRequestBody("Token", info.Token)
                    } else if (AppKit.SdkManager.IsIos()) {
                        reqps.SetRequestBody("AppStore", true)
                        reqps.SetRequestBody("productId", info.productId)
                        reqps.SetRequestBody("OrderId", info.OrderId)
                        reqps.SetRequestBody("Token", info.Token)
                    }
                }
                let lastPurchaseMoney = Game.SUserRecord.GetPurchaseMoney()
                reqps.SetCallBack((res) => {
        
                    if (AppKit.SdkManager.IsNative()) {
                        AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")
                    }
                    
                    UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"pack"})
        
                    AppKit.LogEventWrap.logEvent("pay_callback", {productId:info.productId, OrderId:info.OrderId})
                    AppKit.LogEventWrap.logAppAnalytic("af_purchase", {af_revenue:shopMeta.DefaultPrice(), af_currency:"USD", af_content_id:id})

                    let purchaseCount = Game.SUserRecord.GetPurchaseCount()
                    if (purchaseCount == 1) {
                        AppKit.LogEventWrap.logEvent("purchased1")
                    } else if (purchaseCount == 3) {
                        AppKit.LogEventWrap.logEvent("purchased3")
                    } else if (purchaseCount == 10) {
                        AppKit.LogEventWrap.logEvent("purchased10")
                    }
                        
                    let purchaseMoney = Game.SUserRecord.GetPurchaseMoney()
                    var ptimes = [5,25,50,100,500,1000]
                    ptimes.forEach(x => {
                        if (purchaseMoney >= x && lastPurchaseMoney < x) {
                            AppKit.LogEventWrap.logEvent("purchase_" + x + "_USD")
                        }
                    })
            
                    if (id == "cm.pack.5") {
                        AppKit.LogEventWrap.logEvent("purchase_starter_pack")
                    }
                })
                reqps.SetErrorCallBack((res) => {
                    if (res.errorCode == ErrorCode.PAYMENT_VERIFY_ERROR && AppKit.SdkManager.IsNative()) {
                        AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")
                    }
                })
                reqps.Send()
            } else {
                if (info.code != "No product") {
                    AppKit.LogEventWrap.logEvent("pay_fail", {msg: info.msg, code: info.code})
                    AppKit.NativeWrap.call("PaymentClass", "callProductPayOver")
                }
            }
        }, 5)
    }
}

PaymentWrap.Restore = function() {
    if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("PaymentClass", "callRestore", null, function(res) {
            let ids = res.pids || []
            let reqb = []
            ids.forEach(info => {
                if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsAndroid()) {
                    let shopId = Meta.ShopMeta.GetShopIdByName(info.productId)
                    let reqps = SR.SRShop.paySuccess(shopId)

                    reqps.SetRequestBody("GooglePlay", true)
                    reqps.SetRequestBody("productId", info.productId)
                    reqps.SetRequestBody("OrderId", info.OrderId)
                    reqps.SetRequestBody("PurchaseData", info.PurchaseData)
                    reqps.SetRequestBody("DataSignature", info.DataSignature)
                    reqps.SetRequestBody("Token", info.Token)
                    
                    reqb.push(reqps)
                }
            })
            if (reqb.length > 0) {
                let reqRestore = new GameKit.BatchRequest([], reqb)
                reqRestore.SetCallBack(function() {
                    UIRoot.instance.openChildWindow("PaySuccessWindow", {from:"pack"})
                })
                reqRestore.Send()
            }
        }, 5)
    }
}

export default PaymentWrap
