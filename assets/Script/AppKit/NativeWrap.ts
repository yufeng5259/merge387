//原生方法
import { sys } from 'cc';
import { JSB } from 'cc/env';

type NativeCallback = ((param: any) => void) | null | undefined;
type NativeParam = Record<string, any>;
type NativeBridge = typeof jsb & {
    reflection: {
        callStaticMethod(className: string, methodName: string, signatureOrParam?: string, param?: string): string | void;
    };
};
type NativeWindow = Window & { nativeClientCall?: (paramStr: string) => void };
type NativeWrapper = Record<string, any> & {
    callbacks: Record<string, NativeCallback>;
    timeoutIds: Record<string, ReturnType<typeof setTimeout> | null>;
    index: number;
    budleID: string;
    budleCall: string;
    noIndexCall: string[];
};

function getNativeBridge(): NativeBridge | null {
    return JSB && typeof jsb !== 'undefined' ? jsb as NativeBridge : null;
}

var NativeWrap: NativeWrapper = {callbacks: {}, timeoutIds: {}, index: 0, budleID: "",budleCall: "", noIndexCall: []}

NativeWrap.noIndexCall = ["SDKHandleClassgetQuery"]

NativeWrap.init = function() {
    this.callbacks = {}
    this.timeoutIds = {}
}

NativeWrap.initAndroidBundleID = function(){
    
    let DESIGN_APP_BUDLE_ID_ARRAY = ["com.magicvision.merge"]
    let nativeBridge = getNativeBridge()
    if (!nativeBridge) return

    for (let i = 0; i < DESIGN_APP_BUDLE_ID_ARRAY.length; i++) {
        let result = nativeBridge.reflection.callStaticMethod(DESIGN_APP_BUDLE_ID_ARRAY[i].replace(/\./g,"/")+"/" + "SDKHandleClass", "GetBudleID", "(Ljava/lang/String;)Ljava/lang/String;", JSON.stringify({}));
        if (result) {
            this.budleID = JSON.parse(result).value
            this.budleCall = DESIGN_APP_BUDLE_ID_ARRAY[i].replace(/\./g,"/")+"/"
            console.log("budleID="+this.budleID)
            console.log("budleCall="+this.budleCall)
            break
        }
    }

    if(this.budleCall === ""){
        this.budleID = "com.magicvision.merge"
        this.budleCall = "com/magicvision/merge/"

        console.log("budleID2="+this.budleID)
        console.log("budleCall2="+this.budleCall)
    }
}

NativeWrap.call = function(className: string, method: string, param: NativeParam | null = null, callback?: NativeCallback, waitTime = 0) {
    param = param || {}
    param.callId = className+method+this.index.toString()
    if (NativeWrap.noIndexCall.contains(className+method)) param.callId = className+method
    this.index++
    this.callbacks[param.callId] = callback

    if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos()) {
        try {
            let nativeBridge = getNativeBridge()
            if (!nativeBridge) throw new Error("native bridge unavailable")
            nativeBridge.reflection.callStaticMethod(className.replace(/\//g, ""), method + ":", JSON.stringify(param));
        } catch(e) {
            param.success = false
            NativeWrap.nativeClientCall(JSON.stringify(param))
        }
    } else if(AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsAndroid()) {
        try {
            let nativeBridge = getNativeBridge()
            if (!nativeBridge) throw new Error("native bridge unavailable")
            // console.log("call className="+className+" method="+method+" callback="+callback+" param="+param);
            nativeBridge.reflection.callStaticMethod(NativeWrap.getAndroidBundleCall() + className, method, "(Ljava/lang/String;)V", JSON.stringify(param));
        } catch(e) {
            param.success = false
            NativeWrap.nativeClientCall(JSON.stringify(param))
        }
    }

    if (waitTime > 0) {
        this.timeoutIds[param.callId] = setTimeout(() => {
            param.success = false
            NativeWrap.nativeClientCall(JSON.stringify(param))
        }, waitTime * 1000)
    }
}

NativeWrap.callDirect = function(className: string, method: string, param: NativeParam | null = null) {
    param = param || {}

    if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos()) {
        try {
            let nativeBridge = getNativeBridge()
            if (!nativeBridge) return null
            return nativeBridge.reflection.callStaticMethod(className.replace(/\//g, ""), method + ":", JSON.stringify(param));
        } catch(e) {
            return null
        }
    } else if(AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsAndroid()) {
        try {
            let nativeBridge = getNativeBridge()
            if (!nativeBridge) return null
            // console.log("callDirect className="+className+" method="+method+" param="+param);
            var result = nativeBridge.reflection.callStaticMethod(NativeWrap.getAndroidBundleCall() + className, method, "(Ljava/lang/String;)Ljava/lang/String;", JSON.stringify(param));
            return typeof result === 'string' ? JSON.parse(result).value : null;
        } catch(e) {
            return null
        }
    }
    return null
}

NativeWrap.nativeClientCall = function(paramStr: string) {
    if (!paramStr) return
    let param = JSON.parse(paramStr)
    if (!param || !param.callId) return
    let callback = NativeWrap.callbacks[param.callId]
    if (callback) callback(param)
    NativeWrap.callbacks[param.callId] = null
    if (NativeWrap.timeoutIds[param.callId] != null) {
        clearTimeout(NativeWrap.timeoutIds[param.callId])
        NativeWrap.timeoutIds[param.callId] = null
    }
}

NativeWrap.getVersion = function() {
    return NativeWrap.callDirect("SDKHandleClass", "GetVersion") || "0"
}

NativeWrap.isReview = function() {
    return GameKit.StringUtil.VersionOver(NativeWrap.getVersion(), G.GameConfig.review_max_version) > 0
}

NativeWrap.hasNewVersion = function() {
    return GameKit.StringUtil.VersionOver(G.GameConfig.max_version, AppKit.NativeWrap.getVersion()) > 0
}
NativeWrap.mustUpdateNewVersion = function() {
    return GameKit.StringUtil.VersionOver(AppKit.NativeWrap.getVersion(), G.GameConfig.min_version) < 0
}
//震动 duration:毫秒
NativeWrap.Vibrate=function(duration=200){
    let sw = sys.localStorage.getItem("SettingSwitch_zhendong")
    if (sw != null && !(sw == "true" || sw > 0)) return
    return NativeWrap.call("SDKHandleClass", "Vibrate",{duration:duration})
}

NativeWrap.openComment = function() {
    let appId = ""
    if (AppKit.SdkManager.IsIos()) appId = G.GameConfig.appId
    return NativeWrap.call("SDKHandleClass", "OpenComment", {appId:appId})
}
NativeWrap.openMarket = function() {
    if (AppKit.SdkManager.IsIos()) {
        let appId = ""
        appId = G.GameConfig.appId
        return NativeWrap.call("SDKHandleClass", "LaunchMarket", {appId:appId})
    } else if (AppKit.SdkManager.IsAndroid()) {
        let DESIGN_APP_BUDLE_ID = "com.magicvision.merge";
        return sys.openURL("https://play.google.com/store/apps/details?id="+DESIGN_APP_BUDLE_ID)
    }
}

NativeWrap.getBudleID = function() {
    return NativeWrap.callDirect("SDKHandleClass", "GetBudleID") || ""
}

NativeWrap.deleteAppleAuthorization = function() {
    if (AppKit.SdkManager.IsIos()) {
        return NativeWrap.callDirect("SDKHandleClass", "deleteAppleAuthorization") || ""
    }
}

NativeWrap.callAdjustTrackEvent = function(paramStr) {
    if (paramStr){
        console.log("js NativeWrap.callAdjustTrackEvent00"+" paramStr="+paramStr);
        let eventKey = {
            "fb_login":"kbn7xl",
            "点分享按钮":"j7p30f",
            "送好友卡牌":"jpu2y7",
            "点邀请好友按钮":"5tcxpj",
            "看广告":"40bv53",
            "累计付费大于10美金":"ghjvi6",
            "累计付费大于20美金":"sybpmi",
            "累计付费大于5美金":"a27t5d",
            "解锁地图01":"sn7byu",
            "解锁地图02":"9jvdvy",
            "解锁地图03":"z45g3o",
            "解锁地图04":"9yapfp",
            "解锁地图05":"j3eiwd",
            "解锁地图06":"9zlhx0",
            "解锁地图07":"5ifmmb",
            "解锁地图08":"3vdobc",
            "解锁地图09":"3y2f6y",
            "解锁地图10":"f67eln",
            "解锁地图11":"qf7v7d",
            "解锁地图12":"45ne2l",
            "解锁地图13":"qxq1ay",
            "解锁地图14":"hkw3cg",
            "解锁地图15":"87zt3t",
            "解锁地图16":"ypwtzw",
            "解锁地图17":"4ms9kn",
            "解锁地图18":"huikk0",
            "解锁地图19":"qizl7s",
            "解锁地图20":"b8ys2q",
            "":"",
            "":"",
        }; 
        paramStr = eventKey[paramStr];
        console.log("js NativeWrap.callAdjustTrackEvent01"+" paramStr="+paramStr);
        let result = NativeWrap.callDirect("SDKHandleClass", "AdjustTrackEvent", {key:paramStr});
        console.log("js NativeWrap.callAdjustTrackEvent02="+result+" paramStr="+paramStr);
    }
}

NativeWrap.getAndroidBundleCall = function() {
    if (this.budleCall === "") {
        this.initAndroidBundleID()
    }
    if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsAndroid()) {
        return this.budleCall
    }
    return ""
}

NativeWrap.isNewApp = function() {
    return false
};


(window as NativeWindow).nativeClientCall = NativeWrap.nativeClientCall
export default NativeWrap
