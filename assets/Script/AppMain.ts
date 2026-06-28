import { _decorator, Component, SpriteFrame, assetManager, game } from 'cc';
import SoundManager from './GameKit/SoundManager';
const { ccclass, property } = _decorator;

let lastErrorLog = {}
@ccclass('AppMain')
export class AppMain extends Component {
    @property([SpriteFrame])
    public spriteLoad = [];

    public static instance = null;
    public static inited = false;

    onLoad () {
        // if (AppMain.inited) return 
        // AppMain.instance = this 
        // Game.OUser = new Game.User(); 
        // Game.SUser = new Game.User(); 
        // Game.SUserStory = new Game.UserStory(Game.SUser.UserId()); 
        // Game.SUserMap = new Game.UserMap(Game.SUser.UserId()) 
        // Logs.m_Level = Logs.Level.Log; 
        // Logs.enableDebug = false; 
        // if (!CC_DEBUG) { 
            // if (AppKit.SdkManager.IsNative()) { 
                // window['__errorHandler'] = function (url, line, msg, stack) { 
                    // if (!this.HasError) { 
                        // if (msg && msg.contains && msg.contains("fullscreen")) return 
                        // console.log("~~## ERROR ##~~", "onerror", Game.SUser!=null?Game.SUser.UserId():"", msg, url, line) 
                        // this.logerror({msg:JSON.stringify(msg), url:url, line:line, stack:stack}) 
                        // if (!url || !url.contains("cocos2d")) { 
                            // UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorNormal"), confirmFunc:function() { 
                                // AppGame.instance.logout() 
                            // }}) 
                        // } 
                        // this.HasError = true 
                    // } 
                // }.bind(this) 
            // } else { 
                // window.onerror = function(msg, url, line) { 
                    // if (!this.HasError) { 
                        // if (msg && msg.contains && msg.contains("fullscreen")) return true 
                        // console.log("~~## ERROR ##~~", "onerror", Game.SUser!=null?Game.SUser.UserId():"", msg, url, line) 
                        // this.logerror({msg:JSON.stringify(msg), url:url, line:line}) 
                        // UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorNormal"), confirmFunc:function() { 
                            // AppGame.instance.logout() 
                        // }}) 
                        // this.HasError = true 
                    // } 
                    // return true 
                // }.bind(this) 
                // window.onunhandledrejection = function (event) { 
                    // console.log(event) 
                    // let reason = event.reason || {} 
                    // let [msg, url, line] = [reason.stack || reason.message || "", "", 0] 
                    // if (!this.HasError) { 
                        // if (msg && msg.contains && msg.contains("fullscreen")) return true 
                        // console.log("~~## ERROR ##~~", "onerror unhandledrejection", Game.SUser!=null?Game.SUser.UserId():"", msg, url, line) 
                        // this.logerror({msg:JSON.stringify(msg), url:url, line:line}) 
                        // UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorNormal"), confirmFunc:function() { 
                            // AppGame.instance.logout() 
                        // }}) 
                        // this.HasError = true 
                    // } 
                    // return true 
                // }.bind(this) 
            // } 
        // } 
		// global.deviceId = GameKit.PlayerPrefs.GetString("deviceId", "unknown") 
        // AppKit.NativeWrap.call("SDKHandleClass", "GetDeviceId", null, function(info) { 
            // global.deviceId = info.deviceId || "unknown" 
            // GameKit.PlayerPrefs.SetString("deviceId", info.deviceId) 
        // }) 
        // if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos()) { 
        // } 
    }

    logerror (msg: any) {
        // if (lastErrorLog.msg===msg.msg.toString()&&lastErrorLog.url===msg.url.toString()&&lastErrorLog.line===msg.line.toString()) return 
        // if (wxTools.usewx) { 
            // let req = new GameKit.NetRequest(G.GameConfig.server + "/logerror") 
            // req.SetSilence(true) 
            // req.SetRequestBody("userId", Game.SUser.UserId()) 
            // req.SetRequestBody("msg", msg.msg.toString()) 
            // req.SetRequestBody("url", msg.url.toString()) 
            // req.SetRequestBody("line", msg.line.toString()) 
            // req.Send() 
        // } 
        // AppKit.LogEventWrap.logEvent("logerror", { 
            // msg: (msg.msg || "").toString(), 
            // url: (msg.url || "").toString(), 
            // line: (msg.line || "").toString(), 
            // stack: (msg.stack || "").toString(), 
        // }) 
        // lastErrorLog.msg = msg.msg.toString() 
        // lastErrorLog.url = msg.url.toString() 
        // lastErrorLog.line = msg.line.toString() 
    }

    start () {
        // if (AppMain.inited) return 
        // AppMain.inited = true 
        // AppKit.LogEventWrap.logEvent("app_start") 
        // GameKit.SoundManager.init() 
        // GameKit.BackKeyManager.init() 
        // AppGame.instance.logout() 
    }

    onDestroy () {
    }

    public static RestartApp() {
        AppMain.inited = false
        SoundManager.stopAllAudioSources()
        clearAllTimeout()
        clearAllInterval()
        assetManager.releaseAll()
        game.restart()
    }
}
