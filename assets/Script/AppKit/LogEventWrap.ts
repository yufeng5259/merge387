//记录消息
type LogEventWrapper = Record<string, any>;

var LogEventWrap: LogEventWrapper = {}

LogEventWrap.logEvent = function(eventName, parameters) {
    parameters = parameters || {}
    parameters.userId = Game.SUser.UserId()
    parameters.playerName = Game.SUser.Name()
    parameters.type = Game.SUser.isfirst ? "new_player" : "old_player"
    parameters.version = G.GameConfig.version
    if (AppKit.SdkManager.IsNative()) parameters.version += "(" + AppKit.NativeWrap.getVersion() + ")"

    Logs.Info("logevent", eventName, parameters)
    if (fbInTools.usefbIn) {
        FBInstant.logEvent(
            eventName,
            1,
            parameters
        );
    } else if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("FBSdk", "logEvent", {eventName:eventName, parameters:parameters}, null)
        AppKit.NativeWrap.call("SDKHandleClass", "logEvent", {eventName:eventName, parameters:parameters}, null)
    } else {
        Logs.Log(eventName, parameters)
    }
}

LogEventWrap.logEventFirst = function (eventName, parameters) {
    if (!GameKit.PlayerPrefs.GetBool("logEventf_" + eventName)) {
        LogEventWrap.logEvent(eventName, parameters)
        GameKit.PlayerPrefs.SetBool("logEventf_" + eventName, true)
    }
}

LogEventWrap.logAppAnalytic = function(eventName, parameters) {
    parameters = parameters || {}
    if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("AppAnalytic", "logEvent", {eventName:eventName, parameters:parameters}, null)
    }
}

LogEventWrap.logAppAnalyticFirst = function (eventName, parameters) {
    if (!GameKit.PlayerPrefs.GetBool("analytic_" + eventName)) {
        LogEventWrap.logAppAnalytic(eventName, parameters)
        GameKit.PlayerPrefs.SetBool("analytic_" + eventName, true)
    }
}

LogEventWrap.setUserId = function(_id) {
    if (_id == "" || _id == null) return
    if (AppKit.SdkManager.IsNative()) {
        AppKit.NativeWrap.call("SDKHandleClass", "setUserId", {userId:_id.toString()}, null)
    }
}
export default LogEventWrap
