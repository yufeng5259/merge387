
//sdk管理
import { sys } from 'cc';

var SdkManager: any = {}

SdkManager.Init = function(callback) {
    if (this.inited) {
        if (callback!= null) callback()
        return
    }

    AppKit.query = {}

    if (wxTools.usewx) {
        this.wxInit()
    } else if (fbInTools.usefbIn) {
        this.fbInInit()
    } else if (SdkManager.IsNative()) {
        SdkManager.NativeInit()
    } else {

    }

    AppKit.ADWrap.Init()
    AppKit.PaymentWrap.Init()
    AppKit.LeaderBoardWrap.Init()
    AppKit.NotificationWrap.Init()

    if (callback!= null) callback()
    
    this.inited = true
}

SdkManager.logined = function() {

    if (wxTools.usewx) {
        this.wxLogined()
    } else if (fbInTools.usefbIn) {
        this.fbLogined()
    } else {

    }
}

SdkManager.EnterGame = function() {
    AppKit.PaymentWrap.Reorder()
    AppKit.PaymentWrap.Restore()
}

//将本地路径转为 build 路径
SdkManager.AssetsPathToRealPath = function(path) {
    return "res/raw-assets/" + path
}

SdkManager.IsAndroid = function() {
    if (wxTools.usewx) {
        return wx.getSystemInfoSync().system.toLowerCase().contains("android")
    } else if (fbInTools.usefbIn) {
        return FBInstant.getPlatform().toLowerCase().contains("android")
    } else {
        return sys.os == sys.OS.ANDROID
    }
    return false
}

SdkManager.IsIos = function() {
    if (wxTools.usewx) {
        return wx.getSystemInfoSync().system.toLowerCase().contains("ios")
    } else if (fbInTools.usefbIn) {
        return FBInstant.getPlatform().toLowerCase().contains("ios")
    } else {
        return sys.os == sys.OS.IOS
    }
    return false
}

SdkManager.IsNative = function() {
    return sys.isNative
}

SdkManager.IsBrowser = function() {
    return sys.isBrowser
}

SdkManager.IsMobile = function() {
    return sys.isMobile
}

///////////////////////////////////////////
//wechat game
SdkManager.wxInit = function() {
    wx.onShow(function(res){
        Logs.Info("wx.onShow")

        AppKit.query = res.query
        AppKit.shareTicket = res.shareTicket
    }.bind(this))
    
    wx.onHide(function(res){  
        Logs.Info("wx.onHide")
        
    }.bind(this))

    //share
    if (wxTools.SdkVersionOver('1.1.0') >= 0) wx.showShareMenu({withShareTicket: true})
    wx.onShareAppMessage(function() {
        return {
            title: GameKit.i18n.t("ShareTitle"),
            imageUrl: SdkManager.AssetsPathToRealPath('tex/sh01.png'),
            query: wxTools.QueryObjectToString({inviteId: Game.SUser.UserId()}),
        }
    })
    
    //sharedCanvas
    let sharedCanvas = wxTools.OpenDataCanvas()
    if (sharedCanvas) {
        sharedCanvas.width = UIRoot.instance.winSize.width
        sharedCanvas.height = UIRoot.instance.winSize.height
    }

    //GameClub
    if (wxTools.SdkVersionOver('2.0.3') >= 0) {
        this.GameClubButton = wx.createGameClubButton({
            icon: 'light',
            style: {
                left: 2,
                top: wx.getSystemInfoSync().screenHeight - 42,
                width: 40,
                height: 40
            }
        })
    }

    wx.setKeepScreenOn({keepScreenOn:true})

    AppKit.query = wx.getLaunchOptionsSync().query
    AppKit.shareTicket = wx.getLaunchOptionsSync().shareTicket
}

SdkManager.wxLogined = function() {

}
    
SdkManager.wxGameClubButtonHide = function() {
    if (this.GameClubButton) {
        this.GameClubButton.hide()
    }
}

SdkManager.wxGameClubButtonShow = function() {
    if (this.GameClubButton) {
        this.GameClubButton.show()
    }
}

///////////////////////////////////////////
//facebook instant game
SdkManager.fbInInit = function() {
    AppKit.query = FBInstant.getEntryPointData() || {};
}

SdkManager.fbLogined = function() {
    var fbbottimer = function() {
        FBInstant.setSessionData({
            nickname:Game.SUser.Name(),
            //friends:AppKit.UserWrap.friends_results, //好友列表
            playerInfo:{"head": Game.SUser.Avatar(), score:Game.SUser.Star(), level:Game.SUser.Coin()},
            data: SdkManager.GetBotMessage(),
        })
    }

    fbbottimer()
    if (!this._bottimer) this._bottimer = setInterval(() => {fbbottimer()}, 120 * 1000)

}

SdkManager.GetBotMessage = function() {
    let result = []

    if (!AppGame.instance.logined) return result

    let currentTime = GameKit.TimeUtil.getCurrentTime()
    let needTime = 0

    /*needTime = Game.SUser.GetFullApTime()
    if (needTime > 0) {
        let lastTime = GameKit.PlayerPrefs.GetInt("FB_BOT_APFULL_LASTTIME", 0)
        if (SdkManager.FB_BOT_APFULL || lastTime > currentTime || currentTime > lastTime + GameKit.TimeUtil.HourInSecond * 10) {
            result.push([{
                "bg": "img_share_tili",//可以是http地址，也可以是以img_开头的变量配置到gameId.json文件中，也可以是head_xxx:表示使用playerId为xxx的头像
                "t": "You have got full spins!",//可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                "st": "We have enough spins to play and get more coins!",//（选填）可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                "da":{//默认动作,类似bts内元素
                    "u": "game_play",//当u值为game_play时点击按钮可以进入游戏(还可传入合法链接)
                    "pld": {
                        type: "bot_apFull"
                    },
                },
                "tm": Math.ceil(needTime),//客户端设置定时闹钟时传入(0:时立刻发送;-1:服务端决定发送时间)
                //"pms": {"nk":"nickname"},//用于模板填充
                "bts": [//按钮（选填）
                    {
                        "t": "Play!",
                        "u": "game_play",
                        "pld": {
                            type: "bot_apFull"
                        },
                    }
                ],
            }])
            let sendadd = 60 - (currentTime + needTime) % 3600
            sendadd = sendadd >= 0 ? sendadd : 3600 + sendadd
            GameKit.PlayerPrefs.SetInt("FB_BOT_APFULL_LASTTIME", currentTime + needTime + sendadd)
            SdkManager.FB_BOT_APFULL = true
        }
    }*/

    /*needTime = Game.SUserSlot.DailyBonusRemainTime()
    if (needTime > 0) {
        //let lastTime = GameKit.PlayerPrefs.GetInt("FB_BOT_DAILYBONUS_LASTTIME", 0)
        //if (SdkManager.FB_BOT_DAILYBONUS || lastTime > currentTime) {
            result.push([{
                "bg": "img_share_libao",//可以是http地址，也可以是以img_开头的变量配置到gameId.json文件中，也可以是head_xxx:表示使用playerId为xxx的头像
                "t": "Daily bonus is available now!",//可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                "st": "Come and play daily Wheel of Fortune!",//（选填）可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                "da":{//默认动作,类似bts内元素
                    "u": "game_play",//当u值为game_play时点击按钮可以进入游戏(还可传入合法链接)
                    "pld": {
                        type: "bot_bonusReady"
                    },
                },
                "tm": Math.ceil(needTime),//客户端设置定时闹钟时传入(0:时立刻发送;-1:服务端决定发送时间)
                //"pms": {"nk":"nickname"},//用于模板填充
                "bts": [//按钮（选填）
                    {
                        "t": "Spin!",
                        "u": "game_play",
                        "pld": {
                            type: "bot_bonusReady"
                        },
                    }
                ],
            }])
        //    GameKit.PlayerPrefs.SetInt("FB_BOT_DAILYBONUS_LASTTIME", currentTime + needTime)
        //    SdkManager.FB_BOT_DAILYBONUS = true
        //}
    }*/

    /*needTime = Game.SUserSlot.data.systemUserEffectTime[1] - currentTime
    if (needTime > 0) {
        let lastTime = GameKit.PlayerPrefs.GetInt("FB_BOT_OTHERS_LASTTIME", 0)
        if (SdkManager.FB_BOT_OTHERS || lastTime > currentTime || currentTime > lastTime + GameKit.TimeUtil.HourInSecond * 12) {
            result.push([{
                "bg": "img_share_shouji",//可以是http地址，也可以是以img_开头的变量配置到gameId.json文件中，也可以是head_xxx:表示使用playerId为xxx的头像
                "t": "Someone has invaded your bussiness!",//可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                "st": "Let’s revenge!",//（选填）可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                "da":{//默认动作,类似bts内元素
                    "u": "game_play",//当u值为game_play时点击按钮可以进入游戏(还可传入合法链接)
                    "pld": {
                        type: "bot_invaded"
                    },
                },
                "tm": Math.ceil(needTime),//客户端设置定时闹钟时传入(0:时立刻发送;-1:服务端决定发送时间)
                //"pms": {"nk":"nickname"},//用于模板填充
                "bts": [//按钮（选填）
                    {
                        "t": "Revenge!",
                        "u": "game_play",
                        "pld": {
                            type: "bot_invaded"
                        },
                    }
                ],
            }])
            let sendadd = 60 - (currentTime + needTime) % 3600
            sendadd = sendadd >= 0 ? sendadd : 3600 + sendadd
            GameKit.PlayerPrefs.SetInt("FB_BOT_OTHERS_LASTTIME", currentTime + needTime + sendadd)
            SdkManager.FB_BOT_OTHERS = true
        }
    }*/

    let shopActivity = Game.ActivityManager.GetActiveShopActivity()
    let gameActivity = null
    let activity = null
    if (shopActivity != null && gameActivity == null) {
        activity = shopActivity
    } else if (shopActivity == null && gameActivity != null) {
        activity = gameActivity
    } else if (shopActivity != null && gameActivity != null) {
        activity = shopActivity.EndTime() < gameActivity.EndTime() ? shopActivity : gameActivity
    }
    if (activity) {
        needTime = activity.EndTime() - GameKit.TimeUtil.HourInSecond * 1 - currentTime
        if (needTime > 0) {
            let lastTime = GameKit.PlayerPrefs.GetInt("FB_BOT_ACTIVITY_LASTTIME", 0)
            if (SdkManager.FB_BOT_ACTIVITY || lastTime > currentTime || currentTime > lastTime + GameKit.TimeUtil.HourInSecond * 2) {
                result.push([{
                    "bg": "img_share_libao",//可以是http地址，也可以是以img_开头的变量配置到gameId.json文件中，也可以是head_xxx:表示使用playerId为xxx的头像
                    "t": "Activity will end!",//可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                    "st": activity.Name() + " will end in an hour!",//（选填）可以使用普通文本，也可使用以text_开头的变量配置到gameId.json文件里
                    "da":{//默认动作,类似bts内元素
                        "u": "game_play",//当u值为game_play时点击按钮可以进入游戏(还可传入合法链接)
                        "pld": {
                            type: "bot_activity"
                        },
                    },
                    "tm": Math.ceil(needTime),//客户端设置定时闹钟时传入(0:时立刻发送;-1:服务端决定发送时间)
                    //"pms": {"nk":"nickname"},//用于模板填充
                    "bts": [//按钮（选填）
                        {
                            "t": "Play!",
                            "u": "game_play",
                            "pld": {
                                type: "bot_activity"
                            },
                        }
                    ],
                }])
                let sendadd = 60 - (currentTime + needTime) % 3600
                sendadd = sendadd >= 0 ? sendadd : 3600 + sendadd
                GameKit.PlayerPrefs.SetInt("FB_BOT_ACTIVITY_LASTTIME", currentTime + needTime + sendadd)
                SdkManager.FB_BOT_ACTIVITY = true
            }
        }
    }

    return result
}

SdkManager.fbSetCutAndBot = function() {
    var createShortCut = function() {
        let scc = GameKit.PlayerPrefs.GetInt("CreateShortCut", 0)
        if (scc >= 2) return
        FBInstant.canCreateShortcutAsync()
        .then(function(canCreateShortcut) {
            if (canCreateShortcut) {
                FBInstant.createShortcutAsync()
                .then(function() {
                    GameKit.PlayerPrefs.SetInt("CreateShortCut", 2)
                })
                .catch(function() {
                    scc++
                    GameKit.PlayerPrefs.SetInt("CreateShortCut", scc)
                });
            }
        });
    }
    FBInstant.player.canSubscribeBotAsync().then(
        can_subscribe => {
            if (!can_subscribe) {
                //createShortCut()
                //return
                console.log("can't subscribe")
            }
            AppKit.LogEventWrap.logEvent("bot_subscribe", {result: -1})
            FBInstant.player.subscribeBotAsync().then(function () {
                AppKit.LogEventWrap.logEvent("bot_subscribe", {result: 1})
                createShortCut()
            }).catch(function (e) {
                console.log("subscribeBotAsync e", e)
                AppKit.LogEventWrap.logEvent("bot_subscribe", {result: 0})
                createShortCut()
            });
       }
    ).catch(function (e) {
       AppKit.LogEventWrap.logEvent("bot_subscribe", {result: 0})
       createShortCut()
    });
}

//Native
SdkManager.NativeInit = function() {
    
}

SdkManager.GetQuery = function(callback) {
    let isg = GameKit.PlayerPrefs.GetBool("isGetQuery", false)
    if (isg) {
        if(callback) callback()
        return
    }
    GameKit.PlayerPrefs.SetBool("isGetQuery", true)
    SdkManager.FBGetQuery(() => {
        
        if (Object.keys(AppKit.query).length <= 0 && AppKit.SdkManager.IsNative()) {
            AppKit.NativeWrap.call("SDKHandleClass", "getQuery", null, (res) => {
                if (res.queryUrl) {
                    let url = unescape(res.queryUrl)
                    url = url.replace("coingang://query=", "")
                    let appquery = JSON.parse(url)
                    for (let key in appquery) {
                        AppKit.query[key] = appquery[key]
                    }
                }
                if(callback) callback()
            }, 5)
        } else {
            if(callback) callback()
        }
    })
}

SdkManager.FBGetQuery = function(callback) {
    if (AppKit.SdkManager.IsNative() && Game.SUser.IsFacebook()) {
        AppKit.NativeWrap.call("FBSdk", "getQuery", null, (res) => {
            if (res.success) {
                AppKit.query = res.query || {}
            }
            if(callback) callback()
        }, 7)
        return
    }
    
    if(callback) callback()
}

export default SdkManager
