var fbInTools = {}
//是facebook instant games 平台
fbInTools.usefbIn = (typeof FBInstant !== 'undefined')

if (fbInTools.usefbIn) {
    //pay
    fbInTools.pay = function(productID, developerPayload, callback) {
        FBInstant.payments.purchaseAsync({
            productID: productID,
            developerPayload: developerPayload,
        }).then(function (purchase) {
            Logs.Info(purchase);
            if (callback != null) callback(true, purchase, "SUCCESS")
        }).catch(e => {
            Logs.Log(productID, "pay fail", e)
            if (callback != null) callback(false, e.message, e.code)
        });
    }
    fbInTools.payAndConsume = function(productID, developerPayload, callback) {
        FBInstant.payments.purchaseAsync({
            productID: productID,
            developerPayload: developerPayload,
        }).then(function (purchase) {
            Logs.Info(purchase);
            if (callback != null) callback(true, purchase, "SUCCESS")
            FBInstant.payments.consumePurchaseAsync(purchase.purchaseToken).then(function (purchase) {
            }).catch(e => {
                Logs.Log(productID, "pay consume fail", e)
            });
        }).catch(e => {
            Logs.Log(productID, "pay fail", e)
            if (callback != null) callback(false, e.message, e.code)
        });
    }
    //比较版本号
    fbInTools.SdkVersionOver = function(ver) {
        let s = FBInstant.getSDKVersion().split('.')
        let v = ver.split('.')
        let index = 0
        while(true) {
            if (s.length > index && v.length > index) {
                if (parseInt(s[index]) > parseInt(v[index])) return 1;
                if (parseInt(s[index]) < parseInt(v[index])) return -1;
            } else if (s.length > index && v.length <= index)
                return 1;
            else if (s.length <= index && v.length > index)
                return -1;
            else 
                break;

            index ++;
        }
        return 0
    }

    fbInTools.PathToFBInPath = function(path) {
        return "res/raw-assets/" + path
    }
} else {
    
}

global.fbInTools = fbInTools