
import WebEvent from "./WebEvent";
import { i18n } from "../GameKit/i18n/i18n";

type BatchRequestItem = Record<string, any> & {
    data: Record<string, any>;
};

type BatchRequestCallback = (res?: any) => void;

export default class BatchRequest {
    url: string;
    data: Record<string, any>;
    msgs: BatchRequestItem[];
    beforeMsgs: BatchRequestItem[];
    callback: BatchRequestCallback | null = null;
    errorCallback: BatchRequestCallback | null = null;
    someoneErrorCallback: BatchRequestCallback | null = null;
    silence: any = false;
    req: XMLHttpRequest | null = null;

    constructor (reqs?: BatchRequestItem[], reqs2?: BatchRequestItem[]) {
        this.url = G.GameConfig.server + "/portcol"
        this.data = {}
        this.msgs = reqs || []
        this.beforeMsgs = reqs2 || []
        this.SetRequestBody("msgs", [])
        this.SetRequestBody("beforeMsgs", [])
        this.SetRequestBody("userId", Game.SUser.UserId())
        this.SetRequestBody("rid", Game.SUser.GetRequestId())
        this.SetRequestBody("uuid", Game.SUser.Uuid())
        this.SetRequestBody("batch", true)
    }

    SetRequestBody(key: string, body: any) {
        this.data[key] = body
    }

    AddRequest(req: BatchRequestItem) {
        this.msgs.push(req)
    }

    AddBeforeRequest(req: BatchRequestItem) {
        this.beforeMsgs.push(req)
    }

    SetCallBack(func: BatchRequestCallback) {
        this.callback = func
    }

    SetErrorCallBack(func: BatchRequestCallback) {
        this.errorCallback = func
    }

    SetSomeOneErrorCallBack(func: BatchRequestCallback) {
        this.someoneErrorCallback = func
    }

    SetSilence(func: any) {
        this.silence = func
    }

    Send() {
        Logs.Debug("BatchRequest req:", this)
        if (!this.silence) LoadingWindow.Show()
        this.msgs.forEach(function(m) {
            if (m && m.localOnly) return
            this.data.msgs.push(m.data)
        }.bind(this))
        this.beforeMsgs.forEach(function(m) {
            if (m && m.localOnly) return
            this.data.beforeMsgs.push(m.data)
        }.bind(this))
        this.beforeMsgs.forEach(function(m) {
            if (m && m.localOnly && m.localResult && m.okCallback) m.okCallback(m.localResult)
        })
        this.msgs.forEach(function(m) {
            if (m && m.localOnly && m.localResult && m.okCallback) m.okCallback(m.localResult)
        })
        if (this.data.msgs.length === 0 && this.data.beforeMsgs.length === 0) {
            if (!this.silence) LoadingWindow.Hide()
            if (this.callback != null) this.callback([])
            return
        }
        if (wxTools.usewx) {
            wx.request({
                url: this.url, 
                data: JSON.stringify({arr:encryptCode.stringToBytes(encryptCode.simplecode(pako.gzip(JSON.stringify(this.data), {to:"string"})))}),
                header: {
                    ["Content-Type"]: "application/json",
                },
                method: "POST",
                dataType: "json",
                responseType: "arraybuffer",
                success: function(res) {
                    if (!this.silence) LoadingWindow.Hide()
                    this.okCallback(JSON.parse(pako.ungzip(encryptCode.simplecode(encryptCode.arrayBufferToString(res.data)), {to:"string"})))
                }.bind(this),
                fail: function(res) {
                    if (!this.silence) LoadingWindow.Hide()
                    if (this.errorCallback != null) {
                        this.errorCallback(res)
                    }
                }.bind(this),
            })
        } else {
            this.req = new XMLHttpRequest();
            this.req.responseType = "arraybuffer"
            this.req.open('POST', this.url, true)
            this.req.setRequestHeader("Content-Type", "application/json")

            this.req.onload = function(e) { 
                e = e || {msg:"unknown"}
                if (!this.silence) LoadingWindow.Hide()
                if (this.req.readyState == 4 && (this.req.status >= 200 && this.req.status < 400)) {
                    let rawRes = pako.ungzip(encryptCode.simplecode(encryptCode.arrayBufferToString(this.req.response)), {to:"string"})
                    let res = JSON.parse(rawRes)
                    this.okCallback(res)
                } else {
                    if (this.errorCallback != null) {
                        this.errorCallback(e)
                    }
                    AppKit.LogEventWrap.logEvent("http_net_fail", {url:this.url, body:JSON.stringify(this.data), header: this.req.getAllResponseHeaders(), readyState:this.req.readyState, code:this.req.status})
                }
            }.bind(this)
            this.req.ontimeout = function(e) {
                if (!this.silence) LoadingWindow.Hide()
                if (this.errorCallback != null) {
                    this.errorCallback(e)
                }
                AppKit.LogEventWrap.logEvent("http_net_fail", {url:this.url, body:JSON.stringify(this.data), code:0, msg:"ontimeout"})
            }.bind(this)
            this.req.onerror = function(e) {
                e = e || {code:-1, msg:"unknown"}
                if (!this.silence) LoadingWindow.Hide()
                if (this.errorCallback != null) {
                    this.errorCallback(e)
                }
                AppKit.LogEventWrap.logEvent("http_net_fail", {url:this.url, body:JSON.stringify(this.data), header: this.req.getAllResponseHeaders(), code:e.code||-1, msg:"onerror" + e.toString()})
            }.bind(this)

            this.req.send(JSON.stringify({arr:encryptCode.stringToBytes(encryptCode.simplecode(pako.gzip(JSON.stringify(this.data), {to:"string"})))}))
        }
    }

    okCallback(res: any) {
        Logs.Debug("BatchRequest resp:", res)
        GameKit.TimeUtil.UpdateServerTime(res.timestamp)
        if (res.errorCode !== ErrorCode.SUCCESS) {
            if (res.errorCode == null) res.errorCode = ErrorCode.UNKNOWN_CLIENT
            if (this.errorCallback != null) {
                this.errorCallback(res)
            }
            Logs.Warning("BatchRequest error " + "method:" + this.data.method + " msg:" + JSON.stringify(res.msg || "") + " code:" + res.errorCode)
            //AppMain.instance.logerror({msg:"BatchRequest error " + JSON.stringify(res.msg || "") + " msg:" + res.errorCode, url:"", line:""})
            let apis = []
            for (let i = 0; i < this.beforeMsgs.length; i++) { if (!this.beforeMsgs[i].localOnly) apis.push(this.beforeMsgs[i].data.method) }
            for (let i = 0; i < this.msgs.length; i++) { if (!this.msgs[i].localOnly) apis.push(this.msgs[i].data.method) }
            AppKit.LogEventWrap.logEvent("http_batch_fail", {apis:JSON.stringify(apis), code:res.errorCode, msg:"BatchRequest error " + JSON.stringify(res.msg || "")})
            if (!ErrorCode.muteError(res.errorCode)) {
                let ErrorMsgKey = "ErrorMsg" + res.errorCode.toString()
                let ErrorMsg = i18n.t(ErrorMsgKey)
                if (ErrorMsg === ErrorMsgKey) ErrorMsg = i18n.t("ErrorNormal")
                UIRoot.instance.openChildWindow("DialogWindow", {msg:ErrorMsg + " Code:" + res.errorCode.toString(), confirmFunc:function() {
                    AppGame.instance.logout()
                }})
            }
            return false
        }

        if (res.events != null) {
            for (let type in res.events) {
                WebEvent.DispatcherEvent(type, res.events[type])
            }
        }

        let results: Record<string, any> = {}
        res.result.forEach(function(x) {
            results[x.method] = x
        })

        for (let i = 0; i < this.beforeMsgs.length; i++) {
            let msg = this.beforeMsgs[i]
            if (msg && msg.localOnly) continue
            let method = msg.data.method
            if (results.hasOwnProperty(method)) {
                let result = results[method]
                if (!msg.okCallback(result)) {
                    if (this.someoneErrorCallback != null) {
                        res.method = method
                        this.someoneErrorCallback(res)
                    }
                    //AppMain.instance.logerror({msg:"BatchRequest error " + "method:" + method + " msg:" + res.msg || "" + " code:" + res.errorCode, url:"", line:""})
                    return false
                }
            } else {
                if (this.errorCallback != null) {
                    this.errorCallback(res)
                }
                AppMain.instance.logerror({msg:"BatchRequest error no method " + method + res.errorCode, url:"", line:""})
                return false
            }
        }

        for (let i = 0; i < this.msgs.length; i++) {
            let msg = this.msgs[i]
            if (msg && msg.localOnly) continue
            let method = msg.data.method
            if (results.hasOwnProperty(method)) {
                let result = results[method]
                if (!msg.okCallback(result)) {
                    if (this.someoneErrorCallback != null) {
                        res.method = method
                        this.someoneErrorCallback(res)
                    }
                    //AppMain.instance.logerror({msg:"BatchRequest error " + "method:" + method + " msg:" + res.msg || "" + " code:" + res.errorCode, url:"", line:""})
                    return false
                }
            } else {
                if (this.errorCallback != null) {
                    this.errorCallback(res)
                }
                AppMain.instance.logerror({msg:"BatchRequest error no method " + method + res.errorCode, url:"", line:""})
                return false
            }
        }

        if (this.callback != null) {
            this.callback(res.result)
        }

        return true
    }
}
