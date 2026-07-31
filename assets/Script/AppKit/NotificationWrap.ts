import { Game as CocosGame, game, sys } from 'cc';

var NotificationWrap: any = {cid: 10}

NotificationWrap.Init = function() {
    if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("NotificationClass", "Init", null, () => {
        })
    }

    game.on(CocosGame.EVENT_SHOW, () => {
        NotificationWrap.CancelAll()
    })
        
    game.on(CocosGame.EVENT_HIDE, () => {
        NotificationWrap.SetAll()
    })
    
    this.switch_raid = sys.localStorage.getItem("Notification_switch_raid")
    if (this.switch_raid == null) this.switch_raid = true
    else this.switch_raid = this.switch_raid > 0
    this.switch_general = sys.localStorage.getItem("Notification_switch_general")
    if (this.switch_general == null) this.switch_general = true
    else this.switch_general = this.switch_general > 0

    this.inited = true
}

NotificationWrap.RequestAuthorization = function() {
    if (this.authorizationRequested) return
    this.authorizationRequested = true

    if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos()) {
        AppKit.NativeWrap.call("NotificationClass", "RequestAuthorization", null, () => {
        })
    }
}

NotificationWrap.SetMessage = function(time, title, message) {
    let obj: any = {}
    obj.title = title
    obj.message = message
    obj.time = time
    obj.id = NotificationWrap.cid
    NotificationWrap.cid++
    if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("NotificationClass", "SetMessage", obj, null)
    } else {
        Logs.Debug("Notification", time, title, message)
    }
}

NotificationWrap.CancelAll = function() {
    if (!this.inited) return
    if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("NotificationClass", "CancelAll", null, null)
    }
    //NotificationWrap.cid = 1
}


NotificationWrap.SetAll = function() {
    if (!this.inited) return

    if (!Game.SUser) return
    if (!AppGame.instance.logined) return

    let currentTime = GameKit.TimeUtil.getCurrentTime()
    let needTime = 0

    if (this.switch_general) {
        needTime = Game.SUser.GetFullApTime()
        if (needTime > 0) {
            NotificationWrap.SetMessage(needTime, GameKit.i18n.t("NotificationTitleApFull"), GameKit.i18n.t("NotificationDesApFull"))
        }

        needTime = Game.SUserSlot.DailyBonusRemainTime()
        if (needTime > 0) {
            NotificationWrap.SetMessage(needTime, GameKit.i18n.t("NotificationTitleDailyBonus"), GameKit.i18n.t("NotificationDesDailyBonus"))
        }
    }

    if (this.switch_raid) {
        needTime = Game.SUserSlot.data.systemUserEffectTime[0] - currentTime
        if (needTime > GameKit.TimeUtil.HourInSecond) {
            if (Game.SUser.Coin() > 300000) {
                NotificationWrap.SetMessage(needTime, GameKit.i18n.t("NotificationTitleAttack"), GameKit.i18n.t("NotificationDesAttack"))
            }
        }
    }

    if (this.switch_general) {
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
                NotificationWrap.SetMessage(needTime, GameKit.i18n.t("NotificationTitleActivity"), String.format(GameKit.i18n.t("NotificationDesActivity"), activity.Name()))
            }
        }
    }
    
    NotificationWrap.SetMessage(GameKit.TimeUtil.DayInSecond * 3, GameKit.i18n.t("NotificationTitleBack"), GameKit.i18n.t("NotificationDesBack"))
    NotificationWrap.SetMessage(GameKit.TimeUtil.DayInSecond * 7, GameKit.i18n.t("NotificationTitleBack2"), GameKit.i18n.t("NotificationDesBack2"))
    NotificationWrap.SetMessage(GameKit.TimeUtil.DayInSecond * 14, GameKit.i18n.t("NotificationTitleBack2"), GameKit.i18n.t("NotificationDesBack2"))
    NotificationWrap.SetMessage(GameKit.TimeUtil.DayInSecond * 30, GameKit.i18n.t("NotificationTitleBack2"), GameKit.i18n.t("NotificationDesBack2"))
}

NotificationWrap.getRaidSwitch = function() {
    return this.switch_raid
}
NotificationWrap.getGeneralSwitch = function() {
    return this.switch_general
}
NotificationWrap.changeRaidSwitch = function() {
    this.switch_raid = !this.switch_raid
    sys.localStorage.setItem("Notification_switch_raid", this.switch_raid?1:0)
}
NotificationWrap.changeGeneralSwitch = function() {
    this.switch_general = !this.switch_general
    sys.localStorage.setItem("Notification_switch_general", this.switch_general?1:0)
}
export default NotificationWrap
