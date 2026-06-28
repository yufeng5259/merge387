
type DownloadRequestCallback = (res?: any) => void;

export default class DownloadRequest {
    callbacks: DownloadRequestCallback[];
    errorCallbacks: DownloadRequestCallback[];
    url: string;
    useEncrypt: boolean | number;
    data: Record<string, any> = {};
    req: XMLHttpRequest | null = null;

    constructor (server: string) {
        this.callbacks = []
        this.errorCallbacks = []

        this.url = server
        this.useEncrypt = false
    }

    SetCallBack(func: DownloadRequestCallback) {
        this.callbacks.push(func)
    }

    SetErrorCallBack(func: DownloadRequestCallback) {
        this.errorCallbacks.push(func)
    }

    SetEncrypt(n: boolean | number) {
        this.useEncrypt = n
    }

    Send() {
        Logs.Debug("DownloadRequest req:", this)

        this.req = new XMLHttpRequest();
        this.req.open('GET', this.url, true)
        this.req.onload = function(e) { 
            e = e || {msg:"unknown"}
            if (this.req.readyState == 4 && (this.req.status >= 200 && this.req.status < 400)) {
                this.okCallback(this.useEncrypt ? encryptCode.simplecode(Base64.decode(this.req.response)) : this.req.response)
            } else {
                this.errorCallbacks.forEach(function(x) {
                    if (x!=null)x(e)
                })
                AppKit.LogEventWrap.logEvent("http_net_fail", {url:this.url, body:JSON.stringify(this.data), header: this.req.getAllResponseHeaders(), readyState:this.req.readyState, code:this.req.status})
            }
        }.bind(this)
        this.req.ontimeout = function(e) {
            this.errorCallbacks.forEach(function(x) {
                if (x!=null)x(e)
            })
            AppKit.LogEventWrap.logEvent("http_net_fail", {url:this.url, body:JSON.stringify(this.data), code:0, msg:"ontimeout"})
        }.bind(this)
        this.req.onerror = function(e) {
            e = e || {code:-1, msg:"unknown"}
            this.errorCallbacks.forEach(function(x) {
                if (x!=null)x(e)
            })
            AppKit.LogEventWrap.logEvent("http_net_fail", {url:this.url, body:JSON.stringify(this.data), header: this.req.getAllResponseHeaders(), code:e.code||-1, msg:"onerror" + e.toString()})
        }.bind(this)
        this.req.send()
    }

    okCallback(res: any) {
        this.callbacks.forEach(function(x) {
            if (x!=null)x(res)
        })
        return true
    }
}
