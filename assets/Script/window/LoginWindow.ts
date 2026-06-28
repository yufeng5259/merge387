import { _decorator, Game as CocosGame, game, Label, Node, ProgressBar, sys, UITransform } from 'cc';
import { UIWindow } from '../GameKit/ui/UIWindow';
import { HotUpdate } from '../AppKit/HotUpdate';

const { ccclass, property } = _decorator;
var DESIGN_APP_BUDLE_ID = "com.magicvision.merge";
var fb_started = false;


@ccclass('LoginWindow')
export default class LoginWindow extends UIWindow {
    public static windowPath = 'LoginWindow';

    @property(ProgressBar) progress: ProgressBar | null = null;
    @property(Node) spmask: Node | null = null;
    @property(Node) btnFB: Node | null = null;
    @property(Node) btnApple: Node | null = null;
    @property(Node) btnGG: Node | null = null;
    @property(Node) btnGuest: Node | null = null;
    @property(Node) spUpdating: Node | null = null;
    @property(Node) loginNew: Node | null = null;
    @property(Label) label_version: Label | null = null;
    @property(HotUpdate) hotUpdate: HotUpdate | null = null;

    pause = false;
    noenter = false;
    metaLoaded = false;
    onLoad(){
        let budleID = AppKit.NativeWrap.getBudleID();
        console.log("LoginWindow onLoad budleID==="+budleID);
    }
    // LIFE-CYCLE CALLBACKS:

    onShow () {
        this.pause = true
        this.progress.node.parent.active = false
        //this.spUpdating.active = false
        this.noenter = false

        UIRoot.instance.stopShowWindow = false

        AppKit.LogEventWrap.logEvent("loginwindow_start")

        this.btnFB.active = false
        this.btnGuest.active = false
        this.btnApple.active = false
        this.btnGG.active = false

        if (fbInTools.usefbIn) {
            if (fb_started) {
                this.getAppInfo()
            } else {
                FBInstant.startGameAsync()
                .then(function () {
                    AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"ready"})
                    fb_started = true
                    this.getAppInfo()

                    //facebook bot shortcut
                    AppKit.SdkManager.fbSetCutAndBot()
                }.bind(this))
                .catch(function (e) { console.error(e); });
            }
        } else {
            this.getAppInfo()
        }

        //preload
        GamePlay.instance.preloadFirst()
        UIRoot.instance.preloadWindow("GameMainWindow")

        setTimeout(() => {
            UIRoot.instance.preloadWindow("MergeTutorialWindow")
            setTimeout(() => {
                GameKit.SoundManager.preloadSound()
        
                setTimeout(() => {
                    GamePlay.instance.preloadAnim()
                }, 5 * 1000);
            }, 7 * 1000);
        }, 5 * 1000);

        this.label_version.string = G.GameConfig.version        
    }
    setProgress (p, f = false) {
        if (!this.progress) return
        if (this.progress.progress > p && p > 0 && !f) return
        this.progress.progress = p
        this.setMaskWidth()
    }
    update (dt) {
        if (this.progress && this.progress.progress < 0.9 && !this.pause) {
            this.progress.progress += dt * 0.015
            this.setMaskWidth()
        }
    }
    getAppInfo () {
        // vs false sublime ok
        // old app
        try {
            if (AppKit.SdkManager.IsAndroid()) {
                let budleID = AppKit.NativeWrap.getBudleID();
                if (budleID === DESIGN_APP_BUDLE_ID) {
                    // 新游�?beachcoin
                    var version = AppKit.NativeWrap.getVersion();
                    if (GameKit.StringUtil.VersionOver(version, "0.0.0") < 0) {
                        // 强制更新
                        let isForce = true;
                        if(isForce){
                            DialogWindow.Show("We have transfer to New App, please jump to Google Play to update.", () => {
                                sys.openURL("https://play.google.com/store/apps/details?id="+DESIGN_APP_BUDLE_ID)
                                this.getAppInfo()
                            });
                            return;
                        }else{
                            DialogWindow.Show("We have transfer to New App, please jump to Google Play to update.", () => {
                                sys.openURL("https://play.google.com/store/apps/details?id="+DESIGN_APP_BUDLE_ID)
                                // this.getAppInfo()
                            });
                            // return;
                        }   
                    }
                }else{
                    // coinBeach
                    let isUpdate = false;
                    if (isUpdate) {
                        // DialogWindow.Show("We have transfer to New App, please uninstall old and jump to Google Play to download", () => {
                        //     sys.openURL("https://play.google.com/store/apps/details?id="+DESIGN_APP_BUDLE_ID)
                        //     this.getAppInfo()
                        // });
                        // return;
                        UIRoot.instance.openChildWindow("AppUpdateWindow")
                    }
                }
            }
        } catch(e) {
            console.log("LoginWindow getAppInfo Error:"+e);
        }
        
        let getAppInfoOver = function(res) {
            Logs.Log("app_info ok")
            for (let key in res) {
                G.GameConfig[key] = res[key]
            }
            if (AppKit.SdkManager.IsIos()) {
                let iosconfig = {}
                for (let key in G.GameConfig) {
                    if (key.endsWith("_ios")) {
                        let oriKey = key.replace("_ios", "")
                        //G.GameConfig[oriKey] = G.GameConfig[key]
                        iosconfig[oriKey] = G.GameConfig[key]
                    }
                }
                for (let key in iosconfig) {
                    G.GameConfig[key] = iosconfig[key]
                }
            }

            AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"appInfo"})

            let getAppInfoOver2 = function() {
                Logs.Log("app_info_2 ok")

                let getAppInfoOver3 = function() {
                    Logs.Log("app_info_3 ok")
                    //sdk init
                    AppKit.SdkManager.Init()

                    //remote load
                    if ((window as any).remoteDownloader) {
                        (window as any).remoteDownloader.REMOTE_SERVER_ROOT = G.GameConfig.RemoteDownloadServer
                    }

                    this.pause = false
                    this.progress.node.parent.active = true

                    this.GetUserInfo()
                    this.getMeta()

                }.bind(this)

                if (AppKit.SdkManager.IsNative() && !(AppKit.NativeWrap.isReview() && AppKit.SdkManager.IsIos())) {
                    this.hotUpdate.checkUpdate(G.GameConfig.huversion, getAppInfoOver3.bind(this), (n) => {
                        if (n == -1) {
                            //DialogWindow.Show(GameKit.i18n.t("LoginWindowNeedUpdate"), nullFunction)
                            this.progress.node.parent.active = true
                            this.progress.progress = 0
                            //this.spUpdating.active = true
                            this.setMaskWidth()
                        } else {
                            if (n < 0.98) {
                                this.progress.progress = n
                                this.setMaskWidth()
                            }
                        }
                    }, (e) => {
                        UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                            Logs.Error("hot_update error", e)
                            this.setProgress(0, true)
                            this.getAppInfo()
                        }.bind(this), countDown: 5})
                    })
                } else {
                    getAppInfoOver3()
                }

            }.bind(this)

            if (AppKit.SdkManager.IsNative() && AppKit.NativeWrap.hasNewVersion()) {
                if (AppKit.NativeWrap.mustUpdateNewVersion()) {
                    UIRoot.instance.openChildWindow("AppUpdateWindow")
                } else {
                    UIRoot.instance.openChildWindow("AppUpdateWindow", {showCallback:(win) => {
                        this.noenter = true
                        win.addOnCloseFunc(() => {
                            getAppInfoOver2()
                            this.noenter = false
                        })
                    }})
                }
            } else {
                getAppInfoOver2()
            }

            this.RecordGame();
            
        }.bind(this)

        if (fbInTools.usefbIn) {
            let res = {
            }

            getAppInfoOver(res)

            return
        }

        let req = null
        if (G.GameConfig.portal.contains("//47.239.") || G.GameConfig.portal.contains("//172.16.") || G.GameConfig.portal.contains("//192.168.") || G.GameConfig.portal.contains("127.0.0.1") || G.GameConfig.portal.contains("//localhost")) {
            req = new GameKit.NetRequest(G.GameConfig.portal)
            req.SetSilence(true)
            req.SetCallBack(function(res) {
                getAppInfoOver(res)
            }.bind(this))
        } else {
            req = new GameKit.DownloadRequest(G.GameConfig.portal)
            req.SetEncrypt(true)
            req.SetCallBack(function(_res) {
                try {
                    let res = JSON.parse(_res)
                    getAppInfoOver(res)
                } catch(e) {
                    Logs.Error("app_info JSON.parse error", e)
                    UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                        this.setProgress(0, true)
                        this.getAppInfo()
                    }.bind(this), countDown: 5})
                    return
                }
            }.bind(this))
        }
        req.SetErrorCallBack(function(res) {
            //Logs.Error("getAppInfo error", res, GameKit.TimeUtil._getCurrentTime())
            UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                this.setProgress(0, true)
                this.getAppInfo()
            }.bind(this), countDown: 5})
        }.bind(this))
        req.Send()
    }
    getMeta() {
        let jsbMetaFilePath = ""
        if (AppKit.SdkManager.IsNative() && window.jsb) { jsbMetaFilePath = (jsb as any).fileUtils.getWritablePath() + 'game.meta' }
        let getMetaOver = function(res) {
            try {
                Meta.MetaManager.init(res)
                GameKit.PlayerPrefs.SetString("meta_version", res.version)
                this.setProgress(0.3)
                Logs.Log("game data ok")
                this.Prompt()
            } catch(e) {
                Logs.Error("game data init error", e)
                if (AppKit.SdkManager.IsNative() && window.jsb) {
                    if ((jsb as any).fileUtils.isFileExist(jsbMetaFilePath)) {
                        (jsb as any).fileUtils.removeFile(jsbMetaFilePath)
                    }
                }
                UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                    this.setProgress(0.2, true)
                    this.getMeta()
                }.bind(this)})
                return
            }
            
            this.metaLoaded = true
            AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"meta"})
        }.bind(this)

         if (AppKit.SdkManager.IsNative() && window.jsb) {
            let localMetaVersion = GameKit.PlayerPrefs.GetString("meta_version")
            if (localMetaVersion == G.GameConfig.metaVersion) {
                if (jsb && (jsb as any).fileUtils.isFileExist(jsbMetaFilePath)) {
                    try {
                        let rawdata = (jsb as any).fileUtils.getDataFromFile(jsbMetaFilePath)
                        let data = JSON.parse(encryptCode.simplecode(encryptCode.Uint8ArrayToString(rawdata, true)))
                        getMetaOver(data)
                    } catch(e) {
                        Logs.Error("game data JSON.parse error", e)
                        if ((jsb as any).fileUtils.isFileExist(jsbMetaFilePath)) {
                            (jsb as any).fileUtils.removeFile(jsbMetaFilePath)
                        }
                        UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                            this.setProgress(0.2, true)
                            this.getMeta()
                        }.bind(this)})
                        return
                    }
                    return
                }
            }
        }

        Logs.Log("game data start")
        this.setProgress(0.2)
        let req = null
        if (G.GameConfig.GAME_TEST) {
            req = new GameKit.NetRequest(G.GameConfig.meta_server)
            req.SetSilence(true)
            req.SetCallBack(function(res) {
                getMetaOver(res)
            }.bind(this))
        } else {
            req = new GameKit.DownloadRequest(G.GameConfig.meta_server + G.GameConfig.metaVersion + ".txt")
            req.SetEncrypt(true)
            req.SetCallBack(function(_res) {
                
                try {
                    let res = JSON.parse(_res)
                    getMetaOver(res)

                    if (AppKit.SdkManager.IsNative() && window.jsb) {
                        let metaBytes = encryptCode.stringToUint8Array(encryptCode.simplecode(JSON.stringify(res)), true);
                        (jsb as any).fileUtils.writeDataToFile(metaBytes, jsbMetaFilePath)
                    }
                    
                } catch(e) {
                    Logs.Error("game data JSON.parse error", e)
                    if (jsb && (jsb as any).fileUtils.isFileExist(jsbMetaFilePath)) {
                        (jsb as any).fileUtils.removeFile(jsbMetaFilePath)
                    }
                    UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                        this.setProgress(0.2, true)
                        this.getMeta()
                    }.bind(this)})
                    return
                }
            }.bind(this))
        }
        req.SetErrorCallBack(function(res) {
            //Logs.Error("game data error", res)
            UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                this.setProgress(0.2, true)
                this.getMeta()
            }.bind(this)})
        }.bind(this))
        req.Send()
    }
    _GetUserInfo() {
        this.progress.node.parent.active = true
        this.btnFB.active = false
        this.btnGuest.active = false
        this.btnApple.active = false
        this.btnGG.active = false
        this.pause = false
        
        AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"userInfo"})

        this.login()
    }
    GetUserInfo () {

        var SUser = Game.SUser
        AppKit.UserWrap.SetWait(() => {
            this.progress.node.parent.active = false
            if (AppKit.SdkManager.IsNative()) {
                this.btnFB.active = true
                this.btnGuest.active = true
                if (AppKit.SdkManager.IsIos() && AppKit.NativeWrap.callDirect("SDKHandleClass", "loginWithAppStoreEnabled")) this.btnApple.active = true
            }else{
                console.log("测试登录失败");
                this.btnFB.active = true
                this.btnGuest.active = true
                this.btnApple.active = true
                this.btnGG.active = true
            }
            this.pause = true
        })
        AppKit.UserWrap.LoginAndGetUserInfo(this._GetUserInfo.bind(this))   
        GamePlay.instance.init()
    }
    GetUserInfo_AppStoreLogin() {
        AppKit.UserWrap.NativeAppStoreLogin(this._GetUserInfo.bind(this))
    }
    GetUserInfo_FBLogin() {
        AppKit.UserWrap.NativeFBLogin(this._GetUserInfo.bind(this))
    }
    GetUserInfo_GGLogin() {
        AppKit.UserWrap.NativeGGLogin(this._GetUserInfo.bind(this))
    }
    GetUserInfo_GuestLogin() {
        UIRoot.instance.openChildWindow("GuestConfirmWindow", {connectCallback:() => {
            AppKit.UserWrap.NativeFBLogin(this._GetUserInfo.bind(this))
        },guestCallback:() => {
            AppKit.UserWrap.NativeGuestLogin(this._GetUserInfo.bind(this))
        },appstoreCallback:() => {
            AppKit.UserWrap.NativeAppStoreLogin(this._GetUserInfo.bind(this))
        }})
    }
    login () {
        Logs.Log("login start")
        this.setProgress(0.4)
        
        let req = SR.SRLogin.login(Game.SUser.accountId, Game.SUser.from)
        req.SetSilence(true)
        req.SetCallBack(function(res) {
            this.setProgress(0.5)
            Logs.Log("login ok")
            Game.SUser.updateData(res.user)
            
            this.getGameData()

            GameKit.SoundManager.playBgmByName(GameKit.SoundManager.SoundNames.BGM_Menu)

            AppKit.LogEventWrap.setUserId(Game.SUser.UserId())

            let entryLogged = GameKit.DataCache.GetData("entrylogged")
            if (!entryLogged) {
                AppKit.LogEventWrap.logEvent("EntryDetail", {entry:AppKit.query.type || "normal"})
                GameKit.DataCache.SetData("entrylogged", true)
            }

            AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"login"})

            if (wxTools.usewx) {
                AppKit.LogEventWrap.logEvent("login", wx.getSystemInfoSync())
            }

            let cday = GameKit.TimeUtil.getCurrentDay()
            if (Game.SUser.isfirst) {
                GameKit.PlayerPrefs.SetInt("UserFirstEnterDay", cday)
            } else {
                let fday = GameKit.PlayerPrefs.GetInt("UserFirstEnterDay", cday)
                if (cday - fday == 1) {
                    AppKit.LogEventWrap.logEvent("retention2")
                } else if (cday - fday == 6) {
                    AppKit.LogEventWrap.logEvent("retention7")
                } else if (cday - fday == 13) {
                    AppKit.LogEventWrap.logEvent("retention14")
                } else if (cday - fday == 27) {
                    AppKit.LogEventWrap.logEvent("retention28")
                }
            }
        }.bind(this))
        req.SetErrorCallBack(function(res) {
            //Logs.Error("login error", res)
            //UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                this.setProgress(0.4, true)
            //    this.login()
            //}.bind(this)})
        }.bind(this))
        req.Send()
    }
    /*updateInfo() {
        var SUser = Game.SUser
        if (SUser.thirdUserInfo) {
            let reqUUI = SR.SRUserInfo.updateInfo()
            if (AppKit.query && AppKit.query.inviteId) reqUUI.SetRequestBody("inviteId", AppKit.query.inviteId)
            reqUUI.SetSilence(true)
            reqUUI.SetCallBack((res) => {
                Logs.Log("update userinfo ok")
            
                AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"updateUserInfo"})

                this.updateFriends()
            })
            reqUUI.SetErrorCallBack(function(res) {
                Logs.Log("updataInfo error", res)
                //UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                    this.setProgress(0.5, true)
                //    this.login()
                //}.bind(this)})
            }.bind(this))
            reqUUI.Send()
        } else {
            AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"updateUserInfo"})

            this.updateFriends()
        }
    }
    updateFriends() {
        var SUser = Game.SUser
        AppKit.UserWrap.GetFriends((friends) => {
            //if (friends != null) {
                let reqUUF = SR.SRUserInfo.updateFriends(friends)
                reqUUF.SetSilence(true)
                reqUUF.SetCallBack((res) => {
                    Logs.Log("update friends ok")
            
                    AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"updateFriends"})
                    
                    this.getGameData()
                })
                reqUUF.SetErrorCallBack(function(res) {
                    Logs.Log("updataFriends error", res)
                    //UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                        this.setProgress(0.5, true)
                    //    this.login()
                    //}.bind(this)})
                }.bind(this))
                reqUUF.Send()
            //} else {
            //    this.getGameData()
            //}
        })
    },*/

    getGameData() {
        
        Logs.Log("User Data start")
        let SUser = Game.SUser
        let reqb = []
        let breqb = []

        AppKit.SdkManager.GetQuery(() => {
            AppKit.UserWrap.GetFriends((friends) => {
                if (SUser.thirdUserInfo || true) {
                    let reqUUI = SR.SRUserInfo.updateInfo()
                    if (AppKit.query && AppKit.query.inviteId) reqUUI.SetRequestBody("inviteId", AppKit.query.inviteId)
                    breqb.push(reqUUI)
                }

                breqb.push(SR.SRUserInfo.updateFriends(friends))
                breqb.push(SR.SRStatus.getUserStatus())
                breqb.push(SR.SRActivity.getUserActivity())
                breqb.push(SR.SRSlot.getUserSlot())
                breqb.push(SR.SRSocial.getFriendsRank())
                breqb.push(SR.SRUserData.getData())

                reqb.push(SR.SRUserInfo.getInfo())
                reqb.push(SR.SRItems.getUserItems())
                reqb.push(SR.SRVillage.getUserVillage())
                reqb.push(SR.SRMerge.getMergeMap())
                //reqb.push(SR.SRChat.getChats())
                reqb.push(SR.SRMergeTutorial.getData())
                if (!CLOSE_Card) reqb.push(SR.SRCard.getUserCard())

                reqb.push(SR.SRSign.getSignData())
                reqb.push(SR.SRTask.getTaskList())
                //通行证活动请�?
                reqb.push(SR.SRActivityPassport.getTaskList())
                reqb.push(SR.SRVillage.getPresentList())
                reqb.push(SR.SRRecord.getUserRecord())

                let reqGameData = new GameKit.BatchRequest(reqb, breqb)
                reqGameData.SetSilence(true)
                reqGameData.SetCallBack(function() {
                    this.setProgress(0.6)
                    Logs.Log("User Data ok")
                    SUser.login = true
                    SUser.logined = true
                    SUser.logining = false
                    
                    AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"userData"})
                    
                    this.schedule(function() {
                        if (this.metaLoaded) {

                            AppGame.instance.login()
                            
                            this.unscheduleAllCallbacks()
                            if (!Game.MergeTutorialManager.IsFinished()) {
                                Game.SUser.data.ap = G.GameConstance.initSpin
                                Game.SUser.data.apRecover = 0
                                Game.SUser.data.apRecoverLast = GameKit.TimeUtil.getCurrentTime()
                                Game.SUser.data.coin = G.GameConstance.initCoin
                                Game.SUser.data.shield = 0
                                if (SR && SR.SRMerge && SR.SRMerge.ApplyLatestLocalResourceShadow) {
                                    SR.SRMerge.ApplyLatestLocalResourceShadow("tutorialInit")
                                }
                                Game.SUserSlot.data.realToraidUser = Game.SUserSlot.data.toraidUser
                                Game.SUserSlot.data.toraidUser = {userId:0, name:GameKit.i18n.t("TutorialTargetName3"), avatar:GameKit.i18n.t("TutorialTargetAvatar3"), coin:210000, expire:0, isFriend:false}
                            } else {
                                GamePlay.instance.preloadGames()
                            }

                            if (GameKit.PlayerPrefs.GetInt("privacy_read") != 1) {
                                //login in first time
                                UIRoot.instance.openChildWindow("PrivacyWindow", {
                                    showCallback: (window) => {
                                        window.addOnCloseFunc(() => {
                                            this.EnterGamePlay()
                                        })
                                    }
                                })
                                return
                            }else{
                                this.EnterGamePlay()
                            }
                        }
                    }.bind(this), 0.1)
                }.bind(this))
                reqGameData.SetSomeOneErrorCallBack(function(e) {
                    this.setProgress(0.6)
                    Logs.Log("User Data one error", e.method, e)
                }.bind(this))
                reqGameData.SetErrorCallBack(function(e) {
                    this.setProgress(0.6)
                    Logs.Log("User Data error", e)
                    UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmStr:GameKit.i18n.t("Reconnect"), confirmFunc:function() {
                    this.setProgress(0, true)
                    this.login()
                    }.bind(this)})
                }.bind(this))
                reqGameData.Send()

                AppGame.instance.prelogin()
            })
        })
    }
    EnterGamePlay() {
        let gameplay = GamePlay.instance
        gameplay.node.active = true
        gameplay.loadUserData()
        this.schedule(function() {
            if (gameplay.allLoaded() && !this.noenter) {
                this.unscheduleAllCallbacks()
            
                AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"enterGamePlay"})

                this.OpenMainMenuWindow()
            }
        }.bind(this), 0.1)
    }
    OpenMainMenuWindow() {
        this.setProgress(0.95)
        
        
        UIRoot.instance.openWindow("GameMainWindow", {showCallback: function() {

            GamePlay.instance.EnterGame()
            AppKit.LogEventWrap.logEvent("LoadDetail", {phase:"enterMainWindow"})
        }})
    }
    RecordGame() {
        if (G.GameConfig.closeRecordGame) return
        if (global._startRecordingTi) {
            (window as any).oclearTimeout(global._startRecordingTi)
            global._startRecordingTi = null
        }
        if (!global._startRecordingTime) {
            let recordTime = sys.localStorage.getItem("GameRecord_time");
            if (recordTime == null) recordTime = 0;
            if (G.GameConfig.forceRecordGame) recordTime = Math.min(recordTime, 10 * GameKit.TimeUtil.MinuteInSecond)
            recordTime = Number.parseFloat(recordTime)
            if (recordTime < 15 * GameKit.TimeUtil.MinuteInSecond) {
                AppKit.NativeWrap.call("SDKHandleClass", "startRecording")
                global._startRecordingTi = (window as any).osetTimeout(() => {
                    AppKit.NativeWrap.call("SDKHandleClass", "stopRecording")
                    let recordTime = sys.localStorage.getItem("GameRecord_time");
                    if (recordTime == null) recordTime = 0;
                    recordTime = Number.parseFloat(recordTime)
                    recordTime += GameKit.TimeUtil.getCurrentTime() - global._startRecordingTime
                    sys.localStorage.setItem("GameRecord_time", recordTime);
                    global._startRecordingTime = null
                    global._startRecordingTi = null
                }, (15 * GameKit.TimeUtil.MinuteInSecond-recordTime)*1000)
                global._startRecordingTime = GameKit.TimeUtil.getCurrentTime()
                
                if (!global._startRecordingEvent) {
                    global._startRecordingEvent = true
                    game.on(CocosGame.EVENT_HIDE, () => {
                        if (global._startRecordingTime) {
                            AppKit.NativeWrap.call("SDKHandleClass", "stopRecording")
                            let recordTime = sys.localStorage.getItem("GameRecord_time");
                            if (recordTime == null) recordTime = 0;
                            recordTime = Number.parseFloat(recordTime)
                            recordTime += GameKit.TimeUtil.getCurrentTime() - global._startRecordingTime
                            sys.localStorage.setItem("GameRecord_time", recordTime);
                            global._startRecordingTime = null
                        }
                    })
                    
                    game.on(CocosGame.EVENT_SHOW, () => {
                        this.RecordGame()
                    })
                }
            }
        }
    }
    //loading界面提示文体轮播
    Prompt(){        
        // this.count = 0;
        // this.callback = function () {
        //     if (!this.spUpdating) {
        //         this.unschedule(this.callback);
        //     }
        //     let metas = Meta.MetaManager.GetMetas(Meta.MetaType.PromptScript)
        //     let keys=Object.keys(metas)
        //     let next = Math.floor((Math.random()*keys.length)+1);
        //     this.spUpdating.string = metas[next].Desc();
        // }
        // this.schedule(this.callback, 3);
    }
    private getOrAddTransform(node: Node | null) {
        if (!node) return null;
        return node.getComponent(UITransform) || node.addComponent(UITransform);
    }

    private setMaskWidth() {
        if (!this.spmask || !this.progress || !this.progress.barSprite) return;
        const maskTransform = this.getOrAddTransform(this.spmask);
        const barTransform = this.getOrAddTransform(this.progress.barSprite.node);
        if (!maskTransform || !barTransform) return;
        maskTransform.setContentSize(barTransform.width * this.progress.barSprite.fillRange, maskTransform.height);
    }
}
