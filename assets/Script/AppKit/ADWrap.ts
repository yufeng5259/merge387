//import Advertise from '../libs/yzAd'

//广告
type ADWrapper = Record<string, any>;
type AdWindow = Window & { yzad_Advertise?: new (...args: any[]) => any };

var ADWrap: ADWrapper = {}

ADWrap.VideoId = "video"
ADWrap.FullpageId = "skipvideo"
ADWrap.BannerId = "banner"

ADWrap.Init = function() {
    this.adEnabled = false
    this.waitTime = 0

    this.videoLoaded = false
    this.fullpageLoaded = false
    this.bannerLoaded = false

    this.videoInstant = null
    this.fullpageInstant = null
    this.bannerInstant = null

    this.videoCount = 0
    this.fullpageCount = 0

    if (wxTools.usewx) {
        if (wxTools.SdkVersionOver('2.0.4') >= 0) {
            this.adEnabled = G.GameConfig.wxad_enable
            this.VideoId = G.GameConfig.wxad_video
            this.wxVideoCallback = null
            
            this.BannerId = G.GameConfig.wxad_banner
            this.bannerInstant = wx.createBannerAd({
                adUnitId: this.BannerId,
                style: {
                    left: wx.getSystemInfoSync().screenWidth - 400,
                    top: wx.getSystemInfoSync().screenHeight - 115,
                    //width: 400,
                    realHeight: 115,
                }
            })
            this.bannerInstant.onResize((res) => {
                this.bannerInstant.style = {
                    left: wx.getSystemInfoSync().screenWidth - res.width,
                    top: wx.getSystemInfoSync().screenHeight - res.height,
                    width: res.width,
                    height: res.height,
                }
            })
        }
    } else if (fbInTools.usefbIn) {
        let apis = FBInstant.getSupportedAPIs();
        this.adEnabled = apis.indexOf("getRewardedVideoAsync") > -1 && apis.indexOf("getInterstitialAdAsync") > -1
        if (G.GameConfig.useYzAd) {
            var Advertise = (window as AdWindow).yzad_Advertise
            if (!Advertise) return
            let rad_high = G.GameConfig.fbad_rad_high,
            rad_low = G.GameConfig.fbad_rad_low,
            rad_any = G.GameConfig.fbad_rad_any,
            iad_high = G.GameConfig.fbad_iad_high,
            iad_low = G.GameConfig.fbad_iad_low,
            iad_any = G.GameConfig.fbad_iad_any
            this.yzAd = new Advertise([iad_high,iad_low,iad_any],[rad_high,rad_low,rad_any]);
            this.adEnabled = this.yzAd.suportAD()
        } else {
            this.VideoId = G.GameConfig.fbad_rad_any
            this.FullpageId = G.GameConfig.fbad_iad_any
        }
    } else if (AppKit.SdkManager.IsNative()) {
        this.adEnabled = true
        if (G.GameConfig.useYzAd) {
            AppKit.NativeWrap.call("yzad/ADCenter", "initAd", {configJson : JSON.stringify(G.GameConfig.adsConfig)})
        } else {
            this.adEnabled = false
        }
    } else {

    }
    
    if (G.GameConfig.GAME_TEST) {
        this.adEnabled = true
    }

    if (G.GameConfig.closeAdvertisement) this.adEnabled = false
    // keivn 2022.05.07
    if (AppKit.NativeWrap.isNewApp()) this.adEnabled = false

    this.PrepareFullPage()
    this.PrepareVideo()
}

ADWrap.AdEnabled = function() {
    return this.adEnabled
}

//////////////////////////////
//video
ADWrap.ShowVideo = function(callback, source = "", failcallback = null) {
    if (G.GameConfig.GAME_TEST) {
        this.ShowVideoSuccess(callback)
        return
    }
    if (!this.AdEnabled()) return
    
    if (this.IsVideoPrepared()) {
        if (wxTools.usewx) {
            this.wxVideoCallback = callback
            this.videoInstant.show()
        } else if (fbInTools.usefbIn) {
            if (G.GameConfig.useYzAd) {
                this.yzAd.showRAD()
                .then(()=>{
                    this.ShowVideoSuccess(callback)
                }).catch(e => {
                    Logs.Log("ShowVideo error", e)
                    setTimeout(() => {
                        ADWrap.PrepareVideo()
                    }, 5000);
                    if (failcallback != null) failcallback()
                });
            } else {
                this.videoInstant.showAsync()
                .then(function() {
                    this.ShowVideoSuccess(callback)
                }.bind(this)).catch(e => {
                    Logs.Log("ShowVideo error", e)
                    setTimeout(() => {
                        ADWrap.PrepareVideo()
                    }, 5000);
                    if (failcallback != null) failcallback()
                });
            }
        } else if (AppKit.SdkManager.IsNative()) {
            if (G.GameConfig.useYzAd) {
                AppKit.NativeWrap.call("yzad/ADCenter", "showVideo", null, (res) => {
                    if (res.success) {
                        this.ShowVideoSuccess(callback)
                        AppKit.LogEventWrap.logEvent("video_show")
                    } else {
                        if (failcallback != null) failcallback()
                    }
                })
            } else {
                if (AppKit.NativeWrap.callDirect("AdmobSdk", "isVideoPrepared")) {
                    AppKit.NativeWrap.call("AdmobSdk", "showVideo", null, (res) => {
                        if (res.success) {
                            this.ShowVideoSuccess(callback)
                            AppKit.LogEventWrap.logEvent("video_show", {source: "admob"})
                        } else {
                            if (failcallback != null) failcallback()
                        }
                    })
                } else {
                    AppKit.NativeWrap.call("FBSdk", "showVideo", null, (res) => {
                        if (res.success || res.succeess/*java回调参数写错 保留兼容*/) {
                            this.ShowVideoSuccess(callback)
                            AppKit.LogEventWrap.logEvent("video_show", {source: "fb"})
                        } else {
                            if (failcallback != null) failcallback()
                        }
                    })
                }
            }
        } else {
            
        }
        this.waitTime = 0

        this.videoCount++
        AppKit.LogEventWrap.logEvent("AdWatch", {source: source, result: this.videoCount})
    } else {
        LoadingWindow.Show()
        setTimeout(() => {
            LoadingWindow.Hide()
            this.waitTime += 0.5
            if (this.waitTime >= 1) {
                this.waitTime = 0
                if (fbInTools.usefbIn) {
                    AppKit.ShareWrap.inviteNew(GameKit.i18n.t("ShareInviteNew"), 'tex/sh01.png', {type:"spain_invite_adnotfull"}, ()=>{this.ShowVideoSuccess(callback)}, "spain_invite_adnotfull", false, failcallback)
                }
                else {
                    DialogWindow.Show(GameKit.i18n.t("AdNotReady"), nullFunction)
                    if (failcallback != null) failcallback()
                }
                return
            }
            ADWrap.ShowVideo(callback, source, failcallback)
        }, 500);
        return
    }
}
ADWrap.ShowVideoSuccess = function(callback) {
    if (callback != null) callback(true)
    this.videoInstant = null
    this.videoLoaded = false
    this.PrepareVideo()
    let adWatched = Game.SUserRecord.AdTimes() + 1
    if (adWatched == 10) {
        AppKit.LogEventWrap.logEvent("ad_view_10")
    } else if (adWatched == 20) {
        AppKit.LogEventWrap.logEvent("ad_view_20")
    } else if (adWatched == 50) {
        AppKit.LogEventWrap.logEvent("ad_view_50")
    } else if (adWatched == 100) {
        AppKit.LogEventWrap.logEvent("ad_view_100")
    }
    AppKit.NativeWrap.callAdjustTrackEvent("看广告");
}

ADWrap.PrepareVideo = function() {
    if (!this.AdEnabled()) return
    if (wxTools.usewx) {
        if (this.videoInstant == null) {
            this.videoInstant = wx.createRewardedVideoAd({
                adUnitId: this.VideoId
            })
            this.videoInstant.onClose(function(res){
                if (wxTools.SdkVersionOver('2.1.0') < 0 || res.isEnded) {
                    this.ShowVideoSuccess(this.wxVideoCallback)
                    this.wxVideoCallback = null
                }
            }.bind(this))
        }
        this.videoInstant.load()
        .then(function() {
            this.videoLoaded = true
        }.bind(this)).catch(function(e) {
            if (e.errMsg === "CLIENT_UNSUPPORTED_OPERATION") {
                this.adEnabled = false
            } else {
                setTimeout(() => {
                    ADWrap.PrepareVideo()
                }, 5000);
            }
        }.bind(this));
    } else if (fbInTools.usefbIn) {
        if (G.GameConfig.useYzAd) {
            
        } else {
            FBInstant.getRewardedVideoAsync(this.VideoId).then(function(rewardedVideo) {
                this.videoInstant = rewardedVideo
                return rewardedVideo.loadAsync();
            }.bind(this)).then(function() {
                this.videoLoaded = true
                Logs.Log("video loaded")
            }.bind(this)).catch(function(e) {
                if (e.code === "CLIENT_UNSUPPORTED_OPERATION") {
                    this.adEnabled = false
                } else {
                    setTimeout(() => {
                        ADWrap.PrepareVideo()
                    }, 5000);
                }
            }.bind(this));
        }
    } else if (AppKit.SdkManager.IsNative()) {
    } else {

    }
}

ADWrap.IsVideoPrepared = function() {
    if (G.GameConfig.GAME_TEST) return true
    if (!this.AdEnabled()) return false
    if (wxTools.usewx) {
        return this.videoLoaded
    } else if (fbInTools.usefbIn) {
        if (G.GameConfig.useYzAd) {
            return this.yzAd.hasRAD()
        } else {
            return this.videoLoaded
        }
    } else if (AppKit.SdkManager.IsNative()) {
        if (G.GameConfig.useYzAd) {
            return AppKit.NativeWrap.callDirect("yzad/ADCenter", "isVideoPrepared")
        } else {
            return AppKit.NativeWrap.callDirect("FBSdk", "isVideoPrepared") || AppKit.NativeWrap.callDirect("AdmobSdk", "isVideoPrepared")
        }
    }
    return false
}

//////////////////////////////
//full page
ADWrap.ShowFullPage = function(callback, source = "") {
    if (!this.AdEnabled()) return
    if (wxTools.usewx) { return }

    if (this.IsFullPagePrepared()) {
        if (fbInTools.usefbIn) {
            if (G.GameConfig.useYzAd) {
                this.yzAd.showIAD().then(()=>{
                    if (callback != null) callback(true)
                })
            } else {
                this.fullpageInstant.showAsync()
                .then(function() {
                    if (callback != null) callback(true)
                    this.fullpageInstant = null
                    this.fullpageLoaded = false        
                    this.PrepareFullPage()
                }.bind(this)).catch(e => {
                    Logs.Log("ShowFullPage error", e)
                    setTimeout(() => {
                        ADWrap.PrepareFullPage()
                    }, 5000);
                });
            }
        } else if (AppKit.SdkManager.IsNative()) {
            if (G.GameConfig.useYzAd) {
                AppKit.NativeWrap.call("yzad/ADCenter", "showInterstitial", null, (res) => {
                    if (res.success) {
                        if (callback != null) callback(true)
                    } else {
                    }
                })
            }
        }
        this.waitTime = 0

        this.fullpageCount++
        AppKit.LogEventWrap.logEvent("AdFullpage", {source: source, result: this.fullpageCount})
    } else {
        //LoadingWindow.Show()
        setTimeout(() => {
            //LoadingWindow.Hide()
            this.waitTime += 0.5
            if (this.waitTime > 3) {
                this.waitTime = 0
                //DialogWindow.Show(GameKit.i18n.t("AdNotReady"), nullFunction)
                return
            }
            ADWrap.ShowFullPage(callback, source)
        }, 500);
        return
    }
}

ADWrap.PrepareFullPage = function() {
    if (!this.AdEnabled()) return
    if (fbInTools.usefbIn) {
        if (G.GameConfig.useYzAd) {
        } else {
            FBInstant.getInterstitialAdAsync(this.FullpageId).then(function(interstitial) {
                this.fullpageInstant = interstitial
                return interstitial.loadAsync();
            }.bind(this)).then(function() {
                this.fullpageLoaded = true
                Logs.Log("fullpage loaded")
            }.bind(this)).catch(function(e) {
                if (e.code === "CLIENT_UNSUPPORTED_OPERATION") {
                    this.adEnabled = false
                } else {
                    setTimeout(() => {
                        ADWrap.PrepareFullPage()
                    }, 5000);
                }
            }.bind(this));
        }
    } else {

    }
}

ADWrap.IsFullPagePrepared = function() {
    if (!this.AdEnabled()) return false
    if (fbInTools.usefbIn) {
        if (G.GameConfig.useYzAd) {
            return this.yzAd.hasIAD()
        } else {
            return this.fullpageLoaded
        }
    } else if (AppKit.SdkManager.IsNative()) {
        if (G.GameConfig.useYzAd) {
            return AppKit.NativeWrap.callDirect("yzad/ADCenter", "isInterstitialPrepared")
        }
    }
    return false
}

//////////////////////////////
//Banner
ADWrap.ShowBanner = function(callback, source = "") {
    if (!this.AdEnabled()) return
    if (wxTools.usewx) {
        this.bannerInstant.show()
    } else if (fbInTools.usefbIn) {

    } else {
        
    }
}

ADWrap.HideBanner = function() {
    if (!this.AdEnabled()) return
    if (wxTools.usewx) {
        this.bannerInstant.hide()
    } else if (fbInTools.usefbIn) {

    } else {

    }
}

export default ADWrap
