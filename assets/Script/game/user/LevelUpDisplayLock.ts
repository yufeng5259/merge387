import '../../LegacyGlobals';

const LevelUpDisplayLock: any = {}
LevelUpDisplayLock._locked = false
LevelUpDisplayLock._oldLevel = null
LevelUpDisplayLock._newLevel = null
LevelUpDisplayLock._oldExpInfo = null
LevelUpDisplayLock._rewards = null
LevelUpDisplayLock._oldResourceValues = null

LevelUpDisplayLock.ResourceTypes = {
    Coin: 1,
    Ap: 2,
    Cash: 7,
}

LevelUpDisplayLock._toNumber = function(value, defaultValue) {
    var num = Number(value)
    return isFinite(num) ? num : defaultValue
}

LevelUpDisplayLock.Begin = function(options) {
    options = options || {}
    var oldLevel = Math.floor(LevelUpDisplayLock._toNumber(options.oldLevel, 0))
    var newLevel = Math.floor(LevelUpDisplayLock._toNumber(options.newLevel, 0))
    var rewards = options.rewards || []
    if (oldLevel <= 0 || newLevel <= oldLevel) return false
    if (!rewards || rewards.length <= 0) return false

    LevelUpDisplayLock._locked = true
    LevelUpDisplayLock._oldLevel = oldLevel
    LevelUpDisplayLock._newLevel = newLevel
    LevelUpDisplayLock._oldExpInfo = options.oldExpInfo || null
    LevelUpDisplayLock._rewards = rewards
    LevelUpDisplayLock._oldResourceValues = {}

    var oldResourceValues = options.oldResourceValues || {}
    for (var i = 0; i < rewards.length; i++) {
        var reward = rewards[i]
        if (!reward) continue
        var type = typeof reward.Type === "function" ? reward.Type() : reward.type
        var count = typeof reward.Count === "function" ? reward.Count() : reward.count
        type = Number(type)
        count = Number(count)
        if (!isFinite(type) || !isFinite(count) || count <= 0) continue
        if (type !== LevelUpDisplayLock.ResourceTypes.Coin &&
            type !== LevelUpDisplayLock.ResourceTypes.Ap &&
            type !== LevelUpDisplayLock.ResourceTypes.Cash) continue

        var oldValue = LevelUpDisplayLock._toNumber(oldResourceValues[type], null)
        if (oldValue != null) LevelUpDisplayLock._oldResourceValues[type] = oldValue
    }
    return true
}

LevelUpDisplayLock.IsLocked = function() {
    return !!LevelUpDisplayLock._locked
}

LevelUpDisplayLock.GetOldLevel = function() {
    return LevelUpDisplayLock._oldLevel
}

LevelUpDisplayLock.GetNewLevel = function() {
    return LevelUpDisplayLock._newLevel
}

LevelUpDisplayLock.GetRewards = function() {
    return LevelUpDisplayLock._rewards || []
}

LevelUpDisplayLock.IsResourceLocked = function(type) {
    if (!LevelUpDisplayLock.IsLocked() || !LevelUpDisplayLock._oldResourceValues) return false
    return Object.prototype.hasOwnProperty.call(LevelUpDisplayLock._oldResourceValues, Number(type))
}

LevelUpDisplayLock.GetDisplayResourceValue = function(user, type) {
    type = Number(type)
    if (LevelUpDisplayLock.IsResourceLocked(type)) {
        return LevelUpDisplayLock._oldResourceValues[type]
    }
    if (!user) return null
    if (type === LevelUpDisplayLock.ResourceTypes.Coin && user.Coin) return user.Coin()
    if (type === LevelUpDisplayLock.ResourceTypes.Ap && user.Ap) return user.Ap()
    if (type === LevelUpDisplayLock.ResourceTypes.Cash && user.Cash) return user.Cash()
    return null
}

LevelUpDisplayLock.UpdateDisplayResourceValue = function(type, value) {
    type = Number(type)
    value = Number(value)
    if (!LevelUpDisplayLock.IsResourceLocked(type) || !isFinite(value)) return false
    LevelUpDisplayLock._oldResourceValues[type] = value
    return true
}

LevelUpDisplayLock.GetDisplayLevel = function(user) {
    if (LevelUpDisplayLock.IsLocked() && LevelUpDisplayLock._oldLevel != null) {
        return LevelUpDisplayLock._oldLevel
    }
    if (user && user.Level) return user.Level()
    return 0
}

LevelUpDisplayLock.GetDisplayExpInfo = function(user) {
    if (LevelUpDisplayLock.IsLocked()) {
        var oldInfo = LevelUpDisplayLock._oldExpInfo || {}
        var need = Math.max(1, LevelUpDisplayLock._toNumber(oldInfo.need, 1))
        return {
            current: need,
            need: need,
            progress: 1,
            totalExp: LevelUpDisplayLock._toNumber(oldInfo.totalExp, 0),
            levelStartExp: LevelUpDisplayLock._toNumber(oldInfo.levelStartExp, 0),
            nextLevelExp: LevelUpDisplayLock._toNumber(oldInfo.nextLevelExp, need),
        }
    }
    if (user && user.GetLevelExpInfo) return user.GetLevelExpInfo()
    return {
        current: 0,
        need: 1,
        progress: 0,
        totalExp: 0,
        levelStartExp: 0,
        nextLevelExp: 1,
    }
}

LevelUpDisplayLock.GetLevelWindowText = function(showParams, user) {
    showParams = showParams || {}
    var newLevel = showParams.newLevel != null ? showParams.newLevel : LevelUpDisplayLock.GetNewLevel()
    if (newLevel != null) return String(newLevel)
    if (user && user.Level) return String(user.Level())
    return ""
}

LevelUpDisplayLock.Release = function(options) {
    options = options || {}
    if (!LevelUpDisplayLock.IsLocked()) return false

    LevelUpDisplayLock._locked = false
    LevelUpDisplayLock._oldLevel = null
    LevelUpDisplayLock._newLevel = null
    LevelUpDisplayLock._oldExpInfo = null
    LevelUpDisplayLock._rewards = null
    LevelUpDisplayLock._oldResourceValues = null

    if (options.dispatch !== false &&
        typeof GameKit !== "undefined" &&
        GameKit.GameEvent &&
        GameKit.GameEvent.DispatcherEvent &&
        GameKit.GameEvent.EventName) {
        GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.UserInfoEvent)
    }
    return true
}

LevelUpDisplayLock.Reset = function() {
    LevelUpDisplayLock._locked = false
    LevelUpDisplayLock._oldLevel = null
    LevelUpDisplayLock._newLevel = null
    LevelUpDisplayLock._oldExpInfo = null
    LevelUpDisplayLock._rewards = null
    LevelUpDisplayLock._oldResourceValues = null
}

if (typeof global !== "undefined") {
    global.Game = global.Game || {}
    global.Game.LevelUpDisplayLock = LevelUpDisplayLock
}

export default LevelUpDisplayLock
