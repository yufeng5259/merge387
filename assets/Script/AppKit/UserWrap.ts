import { sys } from 'cc';
import StringUtil from "../GameKit/StringUtil";
import PlayerPrefs from "../GameKit/PlayerPrefs";

//用户
var UserWrap: any = {}

UserWrap.LoginAndGetUserInfo = function(callback) {
    console.log("---------静默登录--------"+JSON.stringify(Game.SUser))
    let lastSource = GameKit.PlayerPrefs.GetLastString("lastSource","")
    let lastAccountId = GameKit.PlayerPrefs.GetLastString("lastAccountId")
    var SUser = Game.SUser
    if (wxTools.usewx) {
        var self = this
        wx.getUserInfo({
            //lang: "zh_CN",
            success: function (res) {
                Logs.Log("wx.getUserInfo.success")
                SUser.thirdUserInfo = true
                SUser.data["name"] = res.userInfo.nickName
                SUser.data["avatar"] = res.userInfo.avatarUrl
                SUser.data["country"] = res.userInfo.country
                SUser.data["province"] = res.userInfo.province
                SUser.data["city"] = res.userInfo.city
                SUser.data["gender"] = res.userInfo.gender
                SUser.data["language"] = res.userInfo.language
                wx.login({
                    success: function(res) {
                        Logs.Log("wx.login.success", res.code)
                        SUser.accountId = res.code
                        SUser.from = "weixin"
                        if (callback != null) callback(true)
                    },
                    fail: function (res) {
                        Logs.Log("wx.login.fail", res.errMsg)
                        UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                            UserWrap.LoginAndGetUserInfo()
                        }.bind(self)})
                    },
                })
            },
            fail: function (res) {
                Logs.Log("wx.getUserInfo.fail", res.errMsg)
                if (UserWrap.WaitCallBack) UserWrap.WaitCallBack()
                if (wxTools.SdkVersionOver('2.0.1') >= 0) {
                    //self.progress.node.active = false
                    if (!self.wxloginButton) {
                        let ratio = wx.getSystemInfoSync().screenWidth / UIRoot.instance.winSize.width
                        self.wxloginButton = wx.createUserInfoButton({
                            type: 'image',
                            image: AppKit.SdkManager.AssetsPathToRealPath('Texture/btn_login_wx.png'),
                            style: {
                                left: (UIRoot.instance.winSize.width / 2 - 113) * ratio,
                                top: (UIRoot.instance.winSize.height / 2 + 330) * ratio,
                                width: 226 * ratio,
                                height: 98 * ratio,
                            }
                        })
                        self.wxloginButton.onTap((res) => {
                            try {
                                if (~res.errMsg.indexOf('fail')) {
                                    self.wxloginButton.hide()
                                    //self.progress.node.active = true
                                    Logs.Log("self.wxloginButton.onTap error", res)
                                    UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                                        UserWrap.LoginAndGetUserInfo()
                                    }.bind(self)})
                                } else {
                                    Logs.Log("wx.createUserInfoButton success")
                                    self.wxloginButton.destroy()
                                    //self.progress.node.active = true

                                    SUser.thirdUserInfo = true
                                    SUser.data["name"] = res.userInfo.nickName
                                    SUser.data["avatar"] = res.userInfo.avatarUrl
                                    SUser.data["country"] = res.userInfo.country
                                    SUser.data["province"] = res.userInfo.province
                                    SUser.data["city"] = res.userInfo.city
                                    SUser.data["gender"] = res.userInfo.gender
                                    SUser.data["language"] = res.userInfo.language
                                    wx.login({
                                        success: function(res) {
                                            Logs.Log("wx.login.success", res.code)
                                            SUser.accountId = res.code
                                            SUser.from = "weixin"
                                            if (callback != null) callback(true)
                                        },
                                        fail: function (res) {
                                            Logs.Log("wx.login.fail", res.errMsg)
                                            UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                                                UserWrap.LoginAndGetUserInfo()
                                            }.bind(self)})
                                        },
                                    })
                                }
                            }
                            catch (e) {
                                self.wxloginButton.hide()
                                //self.progress.node.active = true
                                UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                                    UserWrap.LoginAndGetUserInfo()
                                }.bind(self)})
                            } 
                        })
                        self.wxloginButton.show()
                    } else {
                        self.wxloginButton.show()
                    }
                }
                else if (~res.errMsg.indexOf('auth deny') || ~res.errMsg.indexOf('auth denied')) {
                    // 处理用户拒绝授权的情况
                    wx.showModal({
                        title: GameKit.i18n.t("wxUserinfoDenyTitle"),
                        content: GameKit.i18n.t("wxUserinfoDenyDes"),
                        cancelText: GameKit.i18n.t("Cancel"),
                        confirmText: GameKit.i18n.t("wxUserinfoDenyConfirm"),
                        success: function(res) {
                            if (res.confirm === true) {
                                wx.openSetting({
                                    success: function(res) {
                                        UserWrap.LoginAndGetUserInfo()
                                    },
                                    fail: function() {
                                        Logs.Log("wx.openSetting error")
                                        UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                                            UserWrap.LoginAndGetUserInfo()
                                        }.bind(self)})
                                    },
                                })
                            } else {
                                UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                                    UserWrap.LoginAndGetUserInfo()
                                }.bind(self)})
                            }
                        },
                        fail: function() {
                            UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                                UserWrap.LoginAndGetUserInfo()
                            }.bind(self)})
                        },
                    })
                } else {
                    UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                        UserWrap.LoginAndGetUserInfo()
                    }.bind(self)})
                }
            },
        }) 
    } else if (fbInTools.usefbIn) {
        SUser.thirdUserInfo = true
        
        SUser.data["accountId"] = "fb_" + FBInstant.player.getID()

        FBInstant.player.getSignedPlayerInfoAsync("skyfox")
        .then(function (result) {
            SUser.accountId = "fb_" + result.getPlayerID(); // same value as FBInstant.player.getID()
            SUser.from = "fbIn"
            
            FBInstant.context.switchAsync(null)
            .then(function() {
                if (callback != null) callback(true)
            })
            .catch(e => {
                if (callback != null) callback(true)
            });
        })
        .catch(e => {
            UIRoot.instance.openChildWindow("DialogWindow", {msg:GameKit.i18n.t("ErrorLogin"), confirmFunc:function() {
                UserWrap.LoginAndGetUserInfo()
            }.bind(self)})
        });

        SUser.data["name"] = FBInstant.player.getName() || ""
        SUser.data["avatar"] = FBInstant.player.getPhoto() || ""
        SUser.data["country"] = FBInstant.getLocale() || "unknown"
        if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"
    } else if (AppKit.SdkManager.IsNative()) {
        console.log("最后登录平台",lastSource);
        if(lastSource == null || lastSource.length === 0){
            console.log("如果最后登录平台不存在,那就是新人,直接走游客模式,静默登录");
            UserWrap.NativeGuestLogin(callback) 
        }else{
            switch (lastSource) {
                case "app_fb":
                    AppKit.NativeWrap.call("FBSdk", "getUserInfo", null, function(info) {
                    let userId = info.userId
                        if (userId) {
                            SUser.thirdUserInfo = true
                            SUser.from = "app_fb"
                            SUser.accountId = "fb_" + userId
                            SUser.data["accountId"] = "fb_" + userId
                            SUser.thirdNoThisTime = false
                            if (info.name) {
                                SUser.data["name"] = info.name
                                SUser.data["avatar"] = info.avatar
                                SUser.data["fullName"] = info.fullName
                                SUser.data["country"] = info.country
                                if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"
                            } else {
                                SUser.thirdNoThisTime = true
                            }

                            if (callback != null) callback(true)
                        }else{
                             if (UserWrap.WaitCallBack) UserWrap.WaitCallBack()
                        }
                    })
                    break;
                case "app_google":
                    console.log("安卓项目sdk-GGSdk===getUserInfo补全");
                    
                    break;
                case "app_as":
                    AppKit.NativeWrap.call("SDKHandleClass", "getAppStoreUserInfo", null, function(info) {
                        let userId = info.userId
                        if (userId) {
                            SUser.thirdUserInfo = true
                            SUser.from = "app_as"
                            SUser.accountId = "as_" + userId
                            SUser.data["accountId"] = "as_" + userId
                            SUser.thirdNoThisTime = false
            
                            SUser.thirdNoThisTime = true
            
                            if (callback != null) callback(true)
                        } else {
                            if (UserWrap.WaitCallBack) UserWrap.WaitCallBack()
                        }
                    }, 5);
                    break; 
                default:
                    let userId =  PlayerPrefs.GetString("BrowserAccount", "")
                    if (userId == null || userId.length === 0) {
                        userId = StringUtil.getRandomString(24)
                        PlayerPrefs.SetString("BrowserAccount", userId)
                    }
                    GameKit.PlayerPrefs.SetLastString("lastSource","browser")
                    SUser.accountId = userId
                    SUser.thirdUserInfo = false
                    Game.SUser.from = "browser"
                    SUser.data["country"] = sys.language
                    if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"
                    console.log("游客模式");
                    
                    if (callback != null) callback(true)
                    break;
            }
        }
        //测试模式
    } else if(G.GameConfig.GAME_TEST){
        console.log("最后登录平台",lastSource);
        //if(lastSource == null || lastSource.length === 0)
        UserWrap.GameTestSDK(lastSource,function(userId){
            SUser.thirdUserInfo = true
            SUser.from = lastSource
            SUser.accountId = UserWrap.GetPlatfom(lastSource)+userId
            SUser.data["accountId"] = SUser.accountId
            SUser.data["name"] = "GAME_TEST-模式"
            SUser.data["avatar"] = ""
            SUser.data["fullName"] = "大GAME_TEST-模式"
            SUser.data["country"] = sys.language
            if (callback != null) callback(true)
        })
    }else{
        //浏览器模式
        console.log(lastAccountId,"最后账号<  >最后平台",lastSource);
        if (UserWrap.WaitCallBack) UserWrap.WaitCallBack();
        let accCode = PlayerPrefs.GetString("BrowserAccount", "")
        if(lastSource == null || lastSource.length === 0){
            if (accCode == null || accCode.length === 0) {
                accCode = StringUtil.getRandomString(24)
                PlayerPrefs.SetString("BrowserAccount", accCode)
                lastSource = "browser"
                //lastSource = "app_google"
                //lastSource = "app_as"
                GameKit.PlayerPrefs.SetLastString("lastSource","browser")
                GameKit.PlayerPrefs.SetLastString("lastAccountId",accCode)
            }else{
                GameKit.PlayerPrefs.SetLastString("lastSource","browser")
                GameKit.PlayerPrefs.SetLastString("lastAccountId",accCode)
            }
        }else{
            accCode = lastAccountId
        }
        SUser.accountId = accCode
        SUser.thirdUserInfo = false
        Game.SUser.from = "browser"
        SUser.data["country"] = sys.language
        if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"
        console.log("最后登录平台",Game.SUser.Source(),Game.SUser.from,"平台信息",Game.SUser);

        if (callback != null) callback(true)
    }
}

UserWrap.SetWait = function(c) {
    UserWrap.WaitCallBack = c
}
//FB登录
UserWrap.NativeFBLogin = function(callback) {
    var SUser = Game.SUser
    LoadingWindow.Show()
    AppKit.NativeWrap.call("FBSdk", "login", null, function(info) {
        LoadingWindow.Hide()
        SUser.from = "app_fb"
        let userId = info.userId
        if (userId) {
            SUser.thirdUserInfo = true
            SUser.accountId = "fb_" + userId
            SUser.data["accountId"] = "fb_" + userId

            SUser.data["name"] = info.name
            SUser.data["avatar"] = info.avatar
            SUser.data["fullName"] = info.fullName
            SUser.data["country"] = info.country
            if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"

            //AppKit.LogEventWrap.logAppAnalytic("fb_login")
            AppKit.NativeWrap.callAdjustTrackEvent("fb_login");

            if (callback != null) callback(true)
        } else {

        }
    })
    if(G.GameConfig.GAME_TEST){
        console.log("测试用FB登录");
        //UserWrap.GameTestData("fb_","app_fb");
        UserWrap.GameTestSDK("app_fb",function(userId){
            SUser.from = "app_fb"
            SUser.thirdUserInfo = true
            SUser.accountId = "fb_" + userId
            SUser.data["accountId"] = "fb_" + userId
            SUser.data["name"] = "脸书"
            SUser.data["avatar"] = ""
            SUser.data["fullName"] = "大脸书"
            SUser.data["country"] = sys.language
            if (callback != null) callback(true)
        })
    }
}
//谷歌登录
UserWrap.NativeGGLogin = function(callback) {
    var SUser = Game.SUser
    LoadingWindow.Show()
    //谷歌需要新增加安卓端接口,目前是测试用FB
    
    AppKit.NativeWrap.call("FBSdk", "login", null, function(info) {
        console.log("谷歌需要新增加安卓端接口,目前是测试用FB");
        LoadingWindow.Hide()
        SUser.from = "app_google"
        let userId = info.userId
        if (userId) {
            SUser.thirdUserInfo = true
            SUser.accountId = "gg_" + userId
            SUser.data["accountId"] = "gg_" + userId

            SUser.data["name"] = info.name
            SUser.data["avatar"] = info.avatar
            SUser.data["fullName"] = info.fullName
            SUser.data["country"] = info.country
            if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"

            //AppKit.LogEventWrap.logAppAnalytic("fb_login")
            AppKit.NativeWrap.callAdjustTrackEvent("google_login");

            if (callback != null) callback(true)
        } else {
            console.log("调用sdk失败");
        }
    })
    if(G.GameConfig.GAME_TEST){
        console.log("测试用谷歌登录");
        //UserWrap.GameTestData("gg_","app_google");
        UserWrap.GameTestSDK("app_google",function(userId){
            SUser.from = "app_google"
            SUser.thirdUserInfo = true
            SUser.accountId = "gg_" + userId
            SUser.data["accountId"] = "gg_" + userId
            SUser.data["name"] = "谷歌"
            SUser.data["avatar"] = ""
            SUser.data["fullName"] = "大谷歌"
            SUser.data["country"] = sys.language
            if (callback != null) callback(true)
        })
    }
}
//苹果登录
UserWrap.NativeAppStoreLogin = function(callback) {
    var SUser = Game.SUser
    
    LoadingWindow.Show()
    AppKit.NativeWrap.call("SDKHandleClass", "loginWithAppStore", null, function(info) {
        LoadingWindow.Hide()
        SUser.from = "app_as"
        let userId = info.userId
        if (userId) {
            SUser.thirdUserInfo = true
            SUser.accountId = "as_" + userId
            SUser.data["accountId"] = "as_" + userId

            SUser.data["name"] = info.name
            SUser.data["avatar"] = ""
            SUser.data["fullName"] = info.fullName
            SUser.data["country"] = sys.language
            if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"

            if (callback != null) callback(true)
        } else {

        }
    })
    if(G.GameConfig.GAME_TEST){
        console.log("测试用苹果登录");
        //UserWrap.GameTestData("as_","app_as");

        UserWrap.GameTestSDK("app_as",function(userId){
            SUser.from = "app_as"
            SUser.thirdUserInfo = true
            SUser.accountId = "as_" + userId
            SUser.data["accountId"] = "as_" + userId
            SUser.data["name"] = "苹果"
            SUser.data["avatar"] = ""
            SUser.data["fullName"] = "大苹果"
            SUser.data["country"] = sys.language
            if (callback != null) callback(true)
        })
        
    }
}
//游客登录
UserWrap.NativeGuestLogin = function(callback) {
    var SUser = Game.SUser
    AppKit.NativeWrap.call("SDKHandleClass", "GetDeviceId", null, function(info) {
        let userId = info.deviceId
        if (!userId) {
            userId = PlayerPrefs.GetString("BrowserAccount", "")
            if (userId == null || userId.length === 0) {
                userId = StringUtil.getRandomString(24)
                PlayerPrefs.SetString("BrowserAccount", userId)
            }
        }
        
        SUser.from = "app_guest"
        SUser.accountId = userId
        SUser.thirdUserInfo = false
        
        SUser.data["country"] = sys.language
        if (SUser.data["country"].startsWith("zh_")) SUser.data["country"] = "zh"

        if (callback != null) callback(true)
    })
}
//测试数据
UserWrap.GameTestData = function (platformType,from) {

    let accountIdlist = Game.SUser.data.accountId.split("_")
    let key = platformType+accountIdlist[accountIdlist.length-1]
    Game.SUser.accountId = key
    Game.SUser.from = from
    let accCode = PlayerPrefs.GetString(key, "")
   if (accCode == null || accCode.length === 0) {
        PlayerPrefs.SetString("BrowserAccount", accCode)
    }
}
//测试数据sdk
UserWrap.GameTestSDK = function (lastSource,callback) {
    let uid = "xx"
     switch (lastSource) {
        case"app_fb":
            fetch("http://172.16.7.15:2580/fb")
            .then((r) => r.json())
            .then((data) => {
                console.log(data.id)
                uid = data.id
                GameKit.PlayerPrefs.SetLastString("lastSource","app_fb")
                callback(uid)
            })
            .catch(console.error);
        break
        case"app_google":
            fetch("http://172.16.7.15:2580/gg")
            .then((r) => r.json())
            .then((data) => {
                console.log(data.id)
                uid = data.id
                GameKit.PlayerPrefs.SetLastString("lastSource","app_google")
                callback(uid)
            })
            .catch(console.error);
        break
        case"app_as":
            fetch("http://172.16.7.15:2580/as")
            .then((r) => r.json())
            .then((data) => {
                console.log(data.id)
                uid = data.id
                GameKit.PlayerPrefs.SetLastString("lastSource","app_as")
                callback(uid)
            })
            .catch(console.error);
        break
        default:
            uid = PlayerPrefs.GetString("BrowserAccount", "")
            if (uid == null || uid.length === 0) {
                uid = StringUtil.getRandomString(24)
                PlayerPrefs.SetString("BrowserAccount", uid)
            }
            GameKit.PlayerPrefs.SetLastString("lastSource","browser")
            callback(uid)
        break
    }
}
//返回平台码
UserWrap.GetPlatfom = function (lastSource) {
    let Platfom = ""
     switch (lastSource) {
        case"app_fb":
            Platfom="fb_"
        break
        case"app_google":
            Platfom="gg_"
        break
        case"app_as":
            Platfom="as_"
        break
        default:
           Platfom=""
        break
    }
    return Platfom
}
//data
UserWrap.UserGetData = function(key, callback, value) {
    if (fbInTools.usefbIn) {
        if (typeof key === "object") {
            FBInstant.player.getDataAsync(key)
            .then(function(data) {
                if (callback != null) callback(data)
            });
        } else {
            FBInstant.player.getDataAsync([key])
            .then(function(data) {
                if (data.hasOwnProperty(key)) {
                    if (callback != null) callback(data[key])
                } else {
                    if (value != null) {
                        if (callback != null) callback(value)
                    } else {
                        if (callback != null) callback(null)
                    }
                }
            });
        }
    } else {
        if (callback != null) callback(PlayerPrefs.GetString(key, value || null))
    }
}
UserWrap.UserSetData = function(key, value, callback) {
    if (fbInTools.usefbIn) {
        if (typeof key === "object") {
            FBInstant.player.setDataAsync(key)
            .then(function() {
                if (value != null) value(true)
            });
        } else {
            FBInstant.player.setDataAsync({
                key: value,
            })
            .then(function() {
                if (callback != null) callback(true)
            });
        }
    } else {
        if (callback != null) callback(PlayerPrefs.SetString(key, value && value.toString() || ""))
    }
}
UserWrap.UserFlushData = function(callback) {
    if (fbInTools.usefbIn) {
        FBInstant.player.flushDataAsync()
        .then(function() {
            if (callback != null) callback(true)
        });
    } else {
        if (callback != null) callback(true)
    }
}


//friend
UserWrap.GetFriends = function(callback) {
    /*if (G.GameConfig.GAME_TEST1) {
        let results = []
        results.push("10001")
        results.push("XNb6itMMNjcP4XJrh5J5hn36aaa")
        results.push("3FjGaZtenwZ4wQaaJYDtcTr3")
        results.push("FzyybNDK6t557HbMsEDfQbbj")
        results.push("bGreS3GAEdNfR7xPyNbTEkZp")
        results.push("ec2Fa4SdJ6bj2H")
        results.push("yAAEtbtXhwjexsEnkaphSbQ41")
        results.push("yAAEtbtXhwjexsEnkaphSbQ42")
        results.push("yAAEtbtXhwjexsEnkaphSbQ4")
        results.push("Sfwt6tZ4ta3eXEwArXRSDh2J")
        results.push("hyRnQmkjtT6WSr4nM6FfJfky")
        if (callback != null) callback(results)
        return
    }*/
    if (fbInTools.usefbIn) {
        let results = []
        let _results = []
        FBInstant.player.getConnectedPlayersAsync()
        .then(function(players) {
            players.forEach(player => {
                let _pid = player.getID()
                let pid = "fb_" + _pid
                Game.SUser.friendsInfo[pid] = {
                    accountId: pid,
                    name: player.getName() || "",
                    avatar: player.getPhoto() || "",
                }
                results.push(pid)
                _results.push(_pid)
            })
            if (callback != null) callback(results)
            
            UserWrap.friends_results = _results

            let req = new XMLHttpRequest();
            req.responseType = "json"
            req.open('POST', "https://fb-bot.capjoy.com/api/v0/upload_55", true)
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
            req.send("data={action:\"friends\",playerId:\""+FBInstant.player.getID()+"\",payload:"+JSON.stringify(UserWrap.friends_results)+"}")
        })
        .catch(e => {
            if (callback != null) callback(results)
        });
    } else if (AppKit.SdkManager.IsNative() && Game.SUser.IsFacebook()) {
        AppKit.NativeWrap.call("FBSdk", "getFriends", {userId: Game.SUser.ThirdId()}, (res) => {
            let results = []
            let _results = []
            let ids = res.ids || []
            ids.forEach(_pid => {
                let pid = "fb_" + _pid
                Game.SUser.friendsInfo[pid] = {
                    accountId: pid,
                }
                results.push(pid)
                _results.push(_pid)
            })
            if (callback != null) callback(results)
            
            UserWrap.friends_results = _results

            // let req = new XMLHttpRequest();
            // req.responseType = "json"
            // req.open('POST', "https://fb-bot.capjoy.com/api/v0/upload_55", true)
            // req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
            // req.send("data={action:\"friends\",playerId:\""+Game.SUser.ThirdId()+"\",payload:"+JSON.stringify(UserWrap.friends_results)+"}")
        }, 8)
    } else {
        if (callback != null) callback(null)
    }
}

export default UserWrap
