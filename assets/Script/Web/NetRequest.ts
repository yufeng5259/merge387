
type NetRequestCallback = (res?: any) => void;

type NetRequestData = Record<string, any>;

export default class NetRequest {
    data: NetRequestData;
    callbacks: NetRequestCallback[];
    errorCallbacks: NetRequestCallback[];
    url: string;
    useEncrypt: boolean | number;
    silence: any = false;
    req: XMLHttpRequest | null = null;
    identityTrace: IdentityTraceRecord | null = null;

    constructor (server: string) {
        this.data = {}
        this.callbacks = []
        this.errorCallbacks = []

        this.url = server
        this.useEncrypt = true
    }

    SetRequestBody(key: string, body: any) {
        this.data[key] = body
    }

    SetCallBack(func: NetRequestCallback) {
        this.callbacks.push(func)
    }

    ClearCallBack() {
        this.callbacks = []
    }

    SetErrorCallBack(func: NetRequestCallback) {
        this.errorCallbacks.push(func)
    }

    SetSilence(func: any) {
        this.silence = func
    }

    SetEncrypt(n: boolean | number) {
        this.useEncrypt = n
    }

    Send() {
        this.identityTrace = IdentityTrace.BuildTrace(this.url, this.data, 'net');
        IdentityTrace.LogRequest(this.identityTrace);
        Logs.Debug("NetRequest context:", {
            currentUser: IdentityTrace.CurrentUserState(),
            method: this.data.method,
        })
        if (!this.silence) LoadingWindow.Show()
        if (wxTools.usewx) {
            wx.request({
                url: this.url, 
                data: this.useEncrypt ? JSON.stringify({arr:encryptCode.stringToBytes(encryptCode.simplecode(pako.gzip(JSON.stringify(this.data), {to:"string"})))}) : this.data,
                header: {
                    ["Content-Type"]: this.useEncrypt ? "application/json" : "application/json",
                },
                method: "POST",
                dataType: "json",
                responseType: "arraybuffer",
                success: function(res) {
                    if (!this.silence) LoadingWindow.Hide()
                    this.okCallback(this.useEncrypt ? JSON.parse(pako.ungzip(encryptCode.simplecode(encryptCode.arrayBufferToString(res.data)), {to:"string"})) : res.data)
                }.bind(this),
                fail: function(res) {
                    if (!this.silence) LoadingWindow.Hide()
                    this.errorCallbacks.forEach(function(x) {
                        if (x!=null)x(res)
                    })
                    IdentityTrace.LogNetFail('wxFail', this.identityTrace, res, this.data)
                }.bind(this),
            })
        } else {
            this.req = new XMLHttpRequest();
            this.req.responseType = this.useEncrypt ? "arraybuffer" : "json"
            this.req.open('POST', this.url, true)
            this.req.setRequestHeader("Content-Type", this.useEncrypt ? "application/json" : "application/json")

            this.req.onload = function(e) { 
                e = e || {msg:"unknown"}
                if (!this.silence) LoadingWindow.Hide()
                if (this.req.readyState == 4 && (this.req.status >= 200 && this.req.status < 400)) {
                    let res = this.useEncrypt ? JSON.parse(pako.ungzip(encryptCode.simplecode(encryptCode.arrayBufferToString(this.req.response)), {to:"string"})) : this.req.response
                    this.okCallback(res)
                } else {
                    this.errorCallbacks.forEach(function(x) {
                        if (x!=null)x(e)
                    })
                    AppKit.LogEventWrap.logEvent("http_net_fail", {url:IdentityTrace.SafeUrl(this.url), method:this.data.method, readyState:this.req.readyState, code:this.req.status})
                    IdentityTrace.LogNetFail('httpStatusFail', this.identityTrace, {readyState:this.req.readyState, code:this.req.status}, this.data)
                }
            }.bind(this)
            this.req.ontimeout = function(e) {
                if (!this.silence) LoadingWindow.Hide()
                this.errorCallbacks.forEach(function(x) {
                    if (x!=null)x(e)
                })
                AppKit.LogEventWrap.logEvent("http_net_fail", {url:IdentityTrace.SafeUrl(this.url), method:this.data.method, code:0, msg:"ontimeout"})
                IdentityTrace.LogNetFail('httpTimeout', this.identityTrace, e, this.data)
            }.bind(this)
            this.req.onerror = function(e) {
                e = e || {code:-1, msg:"unknown"}
                if (!this.silence) LoadingWindow.Hide()
                this.errorCallbacks.forEach(function(x) {
                    if (x!=null)x(e)
                })
                AppKit.LogEventWrap.logEvent("http_net_fail", {url:IdentityTrace.SafeUrl(this.url), method:this.data.method, code:e.code||-1, stage:"onerror"})
                IdentityTrace.LogNetFail('httpError', this.identityTrace, e, this.data)
            }.bind(this)

            this.req.send(this.useEncrypt ? JSON.stringify({arr:encryptCode.stringToBytes(encryptCode.simplecode(pako.gzip(JSON.stringify(this.data), {to:"string"})))}) : JSON.stringify(this.data))
        }
    }

    okCallback(res: any) {
        if (res && IdentityTrace.IsIdentityError(res.errorCode)) {
            IdentityTrace.LogResponse('netIdentityError', this.identityTrace, res, this.data)
        }
        this.callbacks.forEach(function(x) {
            if (x!=null)x(res)
        })
        return true
    }
}
import IdentityTrace, { IdentityTraceRecord } from './IdentityTrace';
