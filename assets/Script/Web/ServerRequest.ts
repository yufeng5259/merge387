import NetRequest from "./NetRequest";
import WebEvent from "./WebEvent";
import { i18n } from "../GameKit/i18n/i18n";

type ServerRequestCallback = (res?: any) => void;

export default class ServerRequest extends NetRequest {
    serverErrorCallbacks: ServerRequestCallback[];
    netErrorCallbacks: ServerRequestCallback[];

    constructor (method: string) {
        super(G.GameConfig.server + "/portcol")
        this.SetRequestBody("userId", Game.SUser.UserId())
        this.SetRequestBody("rid", Game.SUser.GetRequestId())
        this.SetRequestBody("uuid", Game.SUser.Uuid())
        this.SetRequestBody("method", method)

        this.serverErrorCallbacks = []
        this.netErrorCallbacks = []

        this.errorCallbacks.push(function() {
            let serverDown = G.GameConfig.serverDown
            if (GameKit.TimeUtil.getCurrentTime() >= serverDown.startTime && GameKit.TimeUtil.getCurrentTime() <= serverDown.endTime) {
                this.netErrorCallbacks.forEach(function(x) {
                    if (x!=null)x()
                })
                UIRoot.instance.openChildWindow("DialogWindow", {msg:i18n.sel(serverDown.msg), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                    if (UIRoot.instance.currentWindowName == "LoginWindow") {
                        UIRoot.instance.GetWindow("LoginWindow").getAppInfo()
                        UIRoot.instance.GetWindow("LoginWindow").setProgress(0.2, true)
                    } else {
                        AppGame.instance.logout()
                    }
                }.bind(this), countDown: 5})
                return
            }
            UIRoot.instance.openChildWindow("DialogWindow", {msg:i18n.t("ErrorRetry"), confirmFunc:function() {
                this.Send()
            }.bind(this), cancelFunc: () => {
                this.netErrorCallbacks.forEach(function(x) {
                    if (x!=null)x()
                })
            }})
        }.bind(this))
    }

    SetErrorCallBack(func: ServerRequestCallback) {
        this.serverErrorCallbacks.push(func)
    }

    SetNetErrorCallBack(func: ServerRequestCallback) {
        this.netErrorCallbacks.push(func)
    }

    okCallback(res: any) {
        Logs.Debug("ServerRequest resp:", res)
        var dispatEvent = () => {
            if (res.timestamp != null) GameKit.TimeUtil.UpdateServerTime(res.timestamp)
            if (res.events != null) {
                for (let type in res.events) {
                    WebEvent.DispatcherEvent(type, res.events[type])
                }
            }
        }
        if (res.errorCode !== ErrorCode.SUCCESS) {
            if (res.errorCode == null) res.errorCode = ErrorCode.UNKNOWN_CLIENT
            this.serverErrorCallbacks.forEach(function(x) {
                if (x!=null)x(res)
            })
            Logs.Warning("ServerRequest error " + "method:" + this.data.method + " msg:" + JSON.stringify(res.msg || "") + " code:" + res.errorCode)
            //AppMain.instance.logerror({msg:"ServerRequest error " + "method:" + this.data.method + " msg:" + JSON.stringify(res.msg || "") + " code:" + res.errorCode, url:"", line:""})
            AppKit.LogEventWrap.logEvent("http_api_fail", {api:this.data.method, body:JSON.stringify(this.data), code:res.errorCode, msg:"ServerRequest error " + JSON.stringify(res.msg || "")})
            
            if (ErrorCode.muteError(res.errorCode)) {
                dispatEvent();
                return true
            }

            let ErrorMsgKey = "ErrorMsg" + res.errorCode.toString()
            let ErrorMsg = i18n.t(ErrorMsgKey)
            if (ErrorMsg === ErrorMsgKey) ErrorMsg = i18n.t("ErrorNormal")
            if (ErrorCode.tipError(res.errorCode)) {
                dispatEvent();
                UIRoot.instance.openChildWindow("DialogWindow", {msg:ErrorMsg + "\nCode:" + res.errorCode.toString(), confirmFunc:function() {}})
                return true
            } else {
                UIRoot.instance.openChildWindow("DialogWindow", {msg:ErrorMsg + "\nCode:" + res.errorCode.toString(), confirmFunc:function() {
                    AppGame.instance.logout()
                }})
                return false
            }
        }
        dispatEvent();

        this.callbacks.forEach(function(x) {
            if (x!=null)x(res.result)
        })
        return true
    }
}
