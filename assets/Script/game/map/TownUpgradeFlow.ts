import '../../LegacyGlobals';
import { find, Node, Sprite, UITransform, Vec3 } from 'cc';
import { UserMap } from './UserMap';
import LevelUpDisplayLock from '../user/LevelUpDisplayLock';
import TownUpgradeTransactionState from './TownUpgradeTransactionState';

const TownUpgradeFlow: any = {}

TownUpgradeFlow._running = false
TownUpgradeFlow._transactionState = new TownUpgradeTransactionState()
TownUpgradeFlow._currentFlowId = null
TownUpgradeFlow._currentMapID = null
TownUpgradeFlow._currentBuildID = null
TownUpgradeFlow._flowStartTime = 0
TownUpgradeFlow._resourceGainPlans = []
TownUpgradeFlow._heldResourceValues = {}

TownUpgradeFlow.isRunning = function() {
    return !!(TownUpgradeFlow._currentFlowId != null &&
        TownUpgradeFlow._transactionState.isActive(TownUpgradeFlow._currentFlowId))
}

TownUpgradeFlow.getActiveFlowId = function() {
    return TownUpgradeFlow.isRunning() ? TownUpgradeFlow._currentFlowId : null
}

TownUpgradeFlow.getPhase = function() {
    return TownUpgradeFlow.isRunning()
        ? TownUpgradeFlow._transactionState.getPhase(TownUpgradeFlow._currentFlowId)
        : null
}

TownUpgradeFlow.markP5Eligible = function(flowId) {
    if (!TownUpgradeFlow._isActivePhase(flowId)) return false
    return TownUpgradeFlow._transactionState.markP5Eligible(flowId)
}

TownUpgradeFlow._isActivePhase = function(flowId, phase) {
    if (!TownUpgradeFlow._transactionState.isActive(flowId)) return false
    return phase == null || TownUpgradeFlow._transactionState.getPhase(flowId) === phase
}

TownUpgradeFlow._enterPhase = function(flowId, expectedPhase, nextPhase) {
    if (!TownUpgradeFlow._transactionState.advance(flowId, expectedPhase, nextPhase)) {
        TownUpgradeFlow._logStep("phase ignored", "flowId", flowId, "expected", expectedPhase, "actual", TownUpgradeFlow._transactionState.getPhase(flowId), "next", nextPhase)
        return false
    }
    TownUpgradeFlow._logStep("phase", "flowId", flowId, "phase", nextPhase)
    return true
}

TownUpgradeFlow._getInputLockOwner = function(flowId) {
    return "TownUpgradeFlow:" + flowId
}

TownUpgradeFlow._acquireInputLock = function(flowId) {
    var owner = TownUpgradeFlow._getInputLockOwner(flowId)
    TownUpgradeFlow._acquireTouchLock(flowId)
    if (GameKit.BackKeyManager && GameKit.BackKeyManager.acquireBlock) {
        GameKit.BackKeyManager.acquireBlock(owner)
    }
}

TownUpgradeFlow._releaseInputLock = function(flowId) {
    var owner = TownUpgradeFlow._getInputLockOwner(flowId)
    TownUpgradeFlow._releaseTouchLock(flowId)
    if (GameKit.BackKeyManager && GameKit.BackKeyManager.releaseBlock) {
        GameKit.BackKeyManager.releaseBlock(owner)
    }
}

TownUpgradeFlow._acquireTouchLock = function(flowId) {
    var owner = TownUpgradeFlow._getInputLockOwner(flowId)
    if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.AcquireInputLock) {
        UIRoot.instance.AcquireInputLock(owner, true)
    }
}

TownUpgradeFlow._releaseTouchLock = function(flowId) {
    var owner = TownUpgradeFlow._getInputLockOwner(flowId)
    if (typeof UIRoot !== "undefined" && UIRoot.instance && UIRoot.instance.ReleaseInputLock) {
        UIRoot.instance.ReleaseInputLock(owner)
    }
}

TownUpgradeFlow._setPresentationInteractive = function(flowId, phase, interactive) {
    if (!TownUpgradeFlow._isActivePhase(flowId, phase)) return false
    if (!TownUpgradeFlow._transactionState.setInteractive(flowId, interactive)) return false
    if (interactive) TownUpgradeFlow._releaseTouchLock(flowId)
    else TownUpgradeFlow._acquireTouchLock(flowId)
    TownUpgradeFlow._logStep("presentation input", "flowId", flowId, "phase", phase, "interactive", !!interactive)
    return true
}
TownUpgradeFlow._getMainUserInfo = function() {
    return typeof GameMainWindow !== "undefined" && GameMainWindow.instance
        ? GameMainWindow.instance.userinfo
        : null
}

TownUpgradeFlow._holdResourceDisplays = function() {
    var userInfo = TownUpgradeFlow._getMainUserInfo()
    if (!userInfo || !userInfo.holdResourceGain) return
    TownUpgradeFlow._heldResourceValues = {}
    var types = [Game.Content.Types.Coin, Game.Content.Types.Ap, Game.Content.Types.Cash]
    types.forEach(function(type) {
        var from = userInfo.getCurrentResourceLabelNum
            ? Number(userInfo.getCurrentResourceLabelNum(type))
            : Number(userInfo.getUserResourceValue(type))
        if (isFinite(from)) TownUpgradeFlow._heldResourceValues[type] = from
        userInfo.holdResourceGain(type, from)
    })
}

TownUpgradeFlow._prepareResourceRewardDisplays = function(rewards) {
    var userInfo = TownUpgradeFlow._getMainUserInfo()
    var fromValues = {}
    var toValues = {}
    var totals = {}
    ;(rewards || []).forEach(function(reward) {
        if (!reward) return
        var content = Game.Content.FromContent(reward)
        var type = content.Type()
        if (type === Game.Content.Types.ShopCoin) type = Game.Content.Types.Coin
        if (type !== Game.Content.Types.Coin && type !== Game.Content.Types.Ap && type !== Game.Content.Types.Cash) return
        totals[type] = (totals[type] || 0) + (Number(content.Count()) || 0)
    })
    for (var type in totals) {
        var numericType = Number(type)
        if (typeof LevelUpDisplayLock !== "undefined" && LevelUpDisplayLock.IsResourceLocked(numericType)) {
            var lockedFrom = Number(LevelUpDisplayLock.GetDisplayResourceValue(Game.SUser, numericType))
            if (isFinite(lockedFrom)) {
                fromValues[type] = lockedFrom
                toValues[type] = lockedFrom + totals[type]
                continue
            }
        }
        var currentTo = userInfo && userInfo.getUserResourceValue
            ? Number(userInfo.getUserResourceValue(numericType))
            : NaN
        if (isFinite(currentTo)) {
            toValues[type] = currentTo
            fromValues[type] = Math.max(0, currentTo - totals[type])
        }
    }
    TownUpgradeFlow._resourceGainPlans = userInfo && userInfo.prepareResourceGains
        ? userInfo.prepareResourceGains(rewards, { fromValues: fromValues, toValues: toValues, hold: true })
        : []
    if (userInfo && userInfo.releaseResourceGainHold) {
        var preparedTypes = {}
        TownUpgradeFlow._resourceGainPlans.forEach(function(plan) {
            preparedTypes[plan.contentType] = true
        })
        var types = [Game.Content.Types.Coin, Game.Content.Types.Ap, Game.Content.Types.Cash]
        types.forEach(function(type) {
            if (!preparedTypes[type]) userInfo.releaseResourceGainHold(type)
        })
    }
}

TownUpgradeFlow._finishResourceRewardDisplays = function() {
    var userInfo = TownUpgradeFlow._getMainUserInfo()
    var plans = TownUpgradeFlow._resourceGainPlans || []
    plans.forEach(function(plan) {
        if (userInfo && userInfo.releaseResourceGainHold) userInfo.releaseResourceGainHold(plan.contentType)
        if (userInfo && userInfo.getPendingResourceNumAnim &&
            userInfo.getPendingResourceNumAnim(plan.contentType)) {
            userInfo.playPendingResourceNumAnim(plan.contentType)
        }
    })
    if (userInfo && userInfo.releaseResourceGainHold) {
        userInfo.releaseResourceGainHold(Game.Content.Types.Coin)
        userInfo.releaseResourceGainHold(Game.Content.Types.Ap)
        userInfo.releaseResourceGainHold(Game.Content.Types.Cash)
    }
    TownUpgradeFlow._resourceGainPlans = []
    TownUpgradeFlow._heldResourceValues = {}
}

TownUpgradeFlow._cancelResourceDisplays = function() {
    var userInfo = TownUpgradeFlow._getMainUserInfo()
    if (userInfo && userInfo.cancelResourceGain) {
        userInfo.cancelResourceGain(Game.Content.Types.Coin)
        userInfo.cancelResourceGain(Game.Content.Types.Ap)
        userInfo.cancelResourceGain(Game.Content.Types.Cash)
    }
    TownUpgradeFlow._resourceGainPlans = []
    TownUpgradeFlow._heldResourceValues = {}
}

TownUpgradeFlow._logStep = function(label) {
    var now = Date.now()
    var start = TownUpgradeFlow._flowStartTime || now
    var args = ["[TownUpgradeFlow][+" + (now - start) + "ms]", label]
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    if (typeof Logs !== "undefined" && Logs.Log) {
        Logs.Log.apply(Logs, args)
        return
    }
    console.log.apply(console, args)
}

TownUpgradeFlow.start = function(params) {
    if (TownUpgradeFlow.isRunning()) {
        TownUpgradeFlow._logStep("start ignored: already running", "mapID", TownUpgradeFlow._currentMapID, "buildID", TownUpgradeFlow._currentBuildID)
        return null
    }
    params = params || {}
    var meta = params.meta
    if (!meta) return null

    TownUpgradeFlow._flowStartTime = Date.now()
    var mapID = params.mapID || meta.MapId()
    var buildID = params.buildID || meta.BuildID()
    var flowId = TownUpgradeFlow._transactionState.start({ mapID: mapID, buildID: buildID })
    TownUpgradeFlow._currentFlowId = flowId
    TownUpgradeFlow._currentMapID = mapID
    TownUpgradeFlow._currentBuildID = buildID
    var mbid = mapID + "_" + buildID
    var oldElement = Game.SUserMap.initElement(mbid)
    var oldLevel = oldElement.level
    var oldStage = oldElement.stage
    var oldUserLevel = Game.SUser.Level()
    var actionLevel = params.actionLevel != null ? params.actionLevel : Game.SUserMap.GetNextActionLevel(mbid)
    var oldContext = Game.SUserMap.GetBuildActionContext(mbid, actionLevel)
    TownUpgradeFlow._beforeUnlockedBuildIDs = TownUpgradeFlow._snapshotUnlockedBuildIDs(mapID)

    TownUpgradeFlow._running = true
    TownUpgradeFlow._acquireInputLock(flowId)
    TownUpgradeFlow._pendingUnlockedBuildID = null
    TownUpgradeFlow._registerUnlockCapture()
    TownUpgradeFlow._logStep("start accepted", "flowId", flowId, "mapID", mapID, "buildID", buildID, "mbid", mbid, "oldLevel", oldLevel, "oldStage", oldStage, "oldUserLevel", oldUserLevel, "actionLevel", actionLevel, "unlockedBuildID", TownUpgradeFlow._getNewUnlockedBuildID(mapID, oldUserLevel, TownUpgradeFlow._beforeUnlockedBuildIDs))
    if (params.tutorialNodeKey && Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
        Game.MergeTutorialManager.EmitNodeClick(params.tutorialNodeKey, params.tutorialPayload || {})
    }
    GameKit.DataCache.RemoveData("GET_EXP")
    TownUpgradeFlow._hijackedRewards = []
    TownUpgradeFlow._rewardHijacked = false
    GameKit.DataCache.SetData("HijackGetReward", function(rewards){
        if (!TownUpgradeFlow._isActivePhase(flowId, "requesting") &&
            !TownUpgradeFlow._isActivePhase(flowId, "refreshing")) return
        TownUpgradeFlow._rewardHijacked = true
        TownUpgradeFlow._hijackedRewards = rewards || []
        TownUpgradeFlow._logStep("hijack rewards", "count", TownUpgradeFlow._hijackedRewards.length)
    })
    TownUpgradeFlow._holdResourceDisplays()
    var req = SR.SRVillage.levelUpElement(mapID, buildID)
    req.SetCallBack(function(res) {
        if (!TownUpgradeFlow._enterPhase(flowId, "requesting", "refreshing")) return
        TownUpgradeFlow._logStep("levelUpElement success", "flowId", flowId, "mapID", mapID, "buildID", buildID, "res", res)

        var expReward = GameKit.DataCache.GetData("GET_EXP")
        GameKit.DataCache.RemoveData("GET_EXP")
        TownUpgradeFlow._logStep("refreshVillage before")
        TownUpgradeFlow._refreshVillage(flowId, function() {
            if (!TownUpgradeFlow._isActivePhase(flowId, "refreshing")) return
            TownUpgradeFlow._logStep("refreshVillage done")
            var newElement = Game.SUserMap.initElement(mbid)
            var levelChangedByBuild = newElement.level > oldLevel
            var showLevel = newElement.level || oldLevel
            var storyStage = newElement.stage != null ? Number(newElement.stage) : 0
            if (isNaN(storyStage) || storyStage < 0) storyStage = 0
            var useHijackedRewards = TownUpgradeFlow._rewardHijacked
            var rewards = useHijackedRewards
                ? TownUpgradeFlow._hijackedRewards.slice()
                : (oldContext ? oldContext.rewards.slice() : [])
            if (expReward) rewards.push(expReward)
            TownUpgradeFlow._prepareResourceRewardDisplays(rewards)
            var levelChanged = Game.SUser.Level() > oldUserLevel
            var unlockedBuildID = TownUpgradeFlow._pendingUnlockedBuildID || TownUpgradeFlow._getNewUnlockedBuildID(mapID, oldUserLevel, TownUpgradeFlow._beforeUnlockedBuildIDs)
            TownUpgradeFlow._logStep("after refresh", "unlockedBuildID", unlockedBuildID, "pendingUnlockedBuildID", TownUpgradeFlow._pendingUnlockedBuildID, "mapID", mapID, "buildID", buildID, "newLevel", newElement.level, "newStage", newElement.stage, "levelChanged", levelChanged, "rewardCount", rewards.length, "userLevel", Game.SUser.Level())

            if (params.window && params.window.close_window) {
                TownUpgradeFlow._logStep("close upgrade window")
                params.window.close_window()
            }

            if (levelChangedByBuild && GameKit.SoundManager && GameKit.SoundManager.playBuildLevelUpSound) {
                GameKit.SoundManager.playBuildLevelUpSound()
            }

            if (!TownUpgradeFlow._enterPhase(flowId, "refreshing", "building_animation")) return
            TownUpgradeFlow._playBuildAnimation(flowId, buildID, {
                buildID: buildID,
                level: newElement.level,
                stage: newElement.stage,
                oldLv: oldLevel,
                oldStage: oldStage,
            }, function() {
                if (!TownUpgradeFlow._enterPhase(flowId, "building_animation", "reward_fly")) return
                TownUpgradeFlow._logStep("playBuildAnimation done", "buildID", buildID)
                TownUpgradeFlow._playRewards(flowId, params.fromNode, rewards, function() {
                    if (!TownUpgradeFlow._isActivePhase(flowId, "reward_fly")) return
                    TownUpgradeFlow._logStep("playRewards done", "buildID", buildID)
                    TownUpgradeFlow._finishResourceRewardDisplays()
                    if (!TownUpgradeFlow._enterPhase(flowId, "reward_fly", "level_reward")) return
                    TownUpgradeFlow._showLevelUpIfNeeded(flowId, levelChanged, function() {
                        if (!TownUpgradeFlow._enterPhase(flowId, "level_reward", "story")) return
                        TownUpgradeFlow._logStep("showLevelUpIfNeeded done", "buildID", buildID)
                        TownUpgradeFlow._openStory(flowId, meta, showLevel, storyStage, function() {
                            if (!TownUpgradeFlow._enterPhase(flowId, "story", "unlock_camera")) return
                            TownUpgradeFlow._logStep("openStory done", "buildID", buildID)
                            TownUpgradeFlow._finishAfterUnlockLook(flowId, unlockedBuildID, mapID, oldUserLevel)
                        })
                    })
                }, params.fromWorldPos)
            })
        })
    })
    req.SetErrorCallBack(function(res) {
        if (!TownUpgradeFlow._isActivePhase(flowId, "requesting")) return
        TownUpgradeFlow._logStep("levelUpElement error", "mapID", mapID, "buildID", buildID, "res", res)
        TownUpgradeFlow._cancelResourceDisplays()
        TownUpgradeFlow._finish(flowId, "request_error")
    })
    TownUpgradeFlow._logStep("levelUpElement send", "mapID", mapID, "buildID", buildID)
    req.Send()
    return flowId
}

TownUpgradeFlow._registerUnlockCapture = function() {
    GameKit.DataCache.SetData("TownUpgradeFlowDelayUnlockLookBuild", true)
    if (!GameKit.WebEvent || !GameKit.WebEvent.EventName || !GameKit.WebEvent.RegisterEvent) return
    GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, "TownUpgradeFlow", function(data) {
        var buildID = TownUpgradeFlow._getEventUnlockedBuildID(data)
        TownUpgradeFlow._logStep("unlock event", "unlockedBuildID", buildID, "data", data)
        if (buildID) TownUpgradeFlow._pendingUnlockedBuildID = buildID
    })
}

TownUpgradeFlow._snapshotUnlockedBuildIDs = function(mapID) {
    var result = {}
    if (!Game.SUserMap || !Game.SUserMap.data || !Game.SUserMap.data.elements) return result
    mapID = Number(mapID)
    for (var i = 0; i < Game.SUserMap.data.elements.length; i++) {
        var element = Game.SUserMap.data.elements[i]
        if (!element || !element.unlocked) continue
        if (mapID && Number(element.mapID) !== mapID) continue
        result[Number(element.id)] = true
    }
    return result
}

TownUpgradeFlow._pickFirstNewUnlockedBuildID = function(ids) {
    if (!ids || ids.length <= 0) return null
    var unique = []
    for (var i = 0; i < ids.length; i++) {
        var id = Number(ids[i])
        if (id <= 0 || unique.indexOf(id) >= 0) continue
        unique.push(id)
    }
    unique.sort(function(a, b) { return a - b })
    if (unique.length <= 0) return null

    var before = TownUpgradeFlow._beforeUnlockedBuildIDs || {}
    var hasBefore = Object.keys(before).length > 0
    for (var j = 0; j < unique.length; j++) {
        if (!before[unique[j]]) return unique[j]
    }
    return hasBefore ? null : unique[0]
}

TownUpgradeFlow._getEventUnlockedBuildID = function(data) {
    if (!data) return null
    var ids = []
    var directID = TownUpgradeFlow._getBuildIDFromUnlockItem(data)
    if (directID) ids.push(directID)

    if (Array.isArray(data.housesUnderUpgrade)) {
        for (var i = 0; i < data.housesUnderUpgrade.length; i++) {
            var arrItem = data.housesUnderUpgrade[i]
            var arrBuildID = TownUpgradeFlow._getBuildIDFromUnlockItem(arrItem)
            if (arrBuildID) ids.push(arrBuildID)
        }
    }

    var houses = data && data.housesUnderUpgrade
    if (houses && !Array.isArray(houses)) {
        for (var key in houses) {
            if (!Object.hasOwnProperty.call(houses, key)) continue
            var item = houses[key]
            var buildID = TownUpgradeFlow._getBuildIDFromUnlockItem(item)
            if (buildID) ids.push(buildID)
        }
    }
    return TownUpgradeFlow._pickFirstNewUnlockedBuildID(ids)
}

TownUpgradeFlow._getBuildIDFromUnlockItem = function(item) {
    if (!item) return null
    var mapID = TownUpgradeFlow._currentMapID
    var itemMapID = item.mapId != null ? item.mapId : (item.mapID != null ? item.mapID : item.map_id)
    if (itemMapID != null && mapID != null && String(itemMapID) !== String(mapID)) return null
    var buildID = item.buildId != null ? item.buildId : (item.buildID != null ? item.buildID : item.build_id)
    buildID = Number(buildID)
    return buildID > 0 ? buildID : null
}

TownUpgradeFlow._getNewUnlockedBuildID = function(mapID, oldUserLevel, beforeUnlockedBuildIDs) {
    if (typeof Meta === "undefined" || !Meta.MetaManager || !Meta.MapMeta || !Game.SUserMap || !Game.UserMap) return null
    var metas = Meta.MetaManager.GetMetas(Meta.MetaType.Map)
    if (!metas) return null
    mapID = Number(mapID)
    beforeUnlockedBuildIDs = beforeUnlockedBuildIDs || TownUpgradeFlow._beforeUnlockedBuildIDs || {}
    var hasBefore = Object.keys(beforeUnlockedBuildIDs).length > 0
    var list = []
    for (var key in metas) {
        if (!Object.hasOwnProperty.call(metas, key)) continue
        var meta = metas[key]
        if (!meta || Number(meta.MapId()) !== mapID) continue
        if (hasBefore && beforeUnlockedBuildIDs[Number(meta.BuildID())]) continue
        if (Game.SUserMap.GetElementState(meta.MBId()) !== Game.UserMap.ElementState.UnlockedNotBought) continue
        list.push(meta)
    }
    if (list.length <= 0) return null
    list.sort(function(a, b) {
        return a.BuildID() - b.BuildID()
    })
    return list[0].BuildID()
}

TownUpgradeFlow._finishAfterUnlockLook = function(flowId, buildID, mapID, oldUserLevel) {
    if (!TownUpgradeFlow._isActivePhase(flowId, "unlock_camera")) return
    if (!buildID) {
        buildID = TownUpgradeFlow._getNewUnlockedBuildID(mapID || TownUpgradeFlow._currentMapID, oldUserLevel)
    }
    TownUpgradeFlow._logStep("finishAfterUnlockLook", "flowId", flowId, "unlockedBuildID", buildID, "mapID", mapID || TownUpgradeFlow._currentMapID, "oldUserLevel", oldUserLevel, "userLevel", Game.SUser.Level())
    TownUpgradeFlow._lookBuild(buildID, function() {
        if (!TownUpgradeFlow._isActivePhase(flowId, "unlock_camera")) return
        TownUpgradeFlow._logStep("finishAfterUnlockLook done", "flowId", flowId, "source", "lookBuild")
        TownUpgradeFlow._finish(flowId, "completed")
    })
}

TownUpgradeFlow._lookBuild = function(buildID, cb) {
    if (!buildID) {
        TownUpgradeFlow._logStep("lookBuild skipped: no unlockedBuildID")
        if (cb) cb(false)
        return
    }
    var mapNode = GamePlay.instance && GamePlay.instance.mapNode
    if (!mapNode || !mapNode.lookBuild) {
        TownUpgradeFlow._logStep("lookBuild skipped: mapNode missing", "buildID", buildID)
        if (cb) cb(false)
        return
    }
    if (mapNode.onCanLevelUpEffect) mapNode.onCanLevelUpEffect()
    TownUpgradeFlow._logStep("lookBuild start", "buildID", buildID)
    mapNode.lookBuild(buildID, cb)
}

TownUpgradeFlow._refreshVillage = function(flowId, cb) {
    var reqV = SR.SRVillage.getUserVillage()
    reqV.SetCallBack(function() {
        if (!TownUpgradeFlow._isActivePhase(flowId, "refreshing")) return
        TownUpgradeFlow._logStep("getUserVillage success")
        Game.SUserMap.initMapData()
        if (GamePlay.instance && GamePlay.instance.mapNode && GamePlay.instance.mapNode.onCanLevelUpEffect) {
            GamePlay.instance.mapNode.onCanLevelUpEffect()
        }
        if (cb) cb()
    })
    reqV.SetErrorCallBack(function(res) {
        if (!TownUpgradeFlow._isActivePhase(flowId, "refreshing")) return
        TownUpgradeFlow._logStep("getUserVillage error", "res", res)
        if (cb) cb()
    })
    TownUpgradeFlow._logStep("getUserVillage send")
    reqV.Send()
}

TownUpgradeFlow._playBuildAnimation = function(flowId, buildID, eventData, cb) {
    if (!TownUpgradeFlow._isActivePhase(flowId, "building_animation")) return
    var mapNode = GamePlay.instance && GamePlay.instance.mapNode
    if (!mapNode || !mapNode.playElementLevelUpAnimation) {
        TownUpgradeFlow._logStep("playBuildAnimation skipped: mapNode missing", "buildID", buildID)
        if (cb) cb()
        return
    }
    TownUpgradeFlow._logStep("playBuildAnimation start", "buildID", buildID, "eventData", eventData)
    mapNode.playElementLevelUpAnimation(buildID, function() {
        if (!TownUpgradeFlow._isActivePhase(flowId, "building_animation")) return
        TownUpgradeFlow._logStep("dispatch MapElementLevelUp", "buildID", buildID)
        GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MapElementLevelUp, eventData)
        if (cb) cb()
    }, eventData)
}

TownUpgradeFlow._playRewards = function(flowId, fromNode, rewards, cb, fromWorldPos) {
    if (!TownUpgradeFlow._isActivePhase(flowId, "reward_fly")) return
    rewards = rewards || []
    var resourceRewards = []
    var itemRewards = []
    rewards.forEach(function(reward) {
        if (!reward) return
        if (TownUpgradeFlow._isUserInfoResourceReward(reward)) resourceRewards.push(reward)
        else itemRewards.push(reward)
    })
    if (resourceRewards.length > 1) resourceRewards = Game.Content.Merge(resourceRewards)

    TownUpgradeFlow._logStep("playRewards start", "total", rewards.length, "itemRewards", itemRewards.length, "resourceRewards", resourceRewards.length, "hasFromNode", !!fromNode, "hasFromWorldPos", !!fromWorldPos)
    TownUpgradeFlow._playRewardGroup(flowId, fromNode, itemRewards, TownUpgradeFlow._getItemTargetNode(), function() {
        TownUpgradeFlow._playResourceRewardGroup(flowId, fromNode, resourceRewards, cb, fromWorldPos)
    }, fromWorldPos)
}

TownUpgradeFlow._isUserInfoResourceReward = function(reward) {
    if (!reward || !reward.Type) return false
    var type = reward.Type()
    return type === Game.Content.Types.Exp ||
        type === Game.Content.Types.Ap ||
        type === Game.Content.Types.Coin ||
        type === Game.Content.Types.ShopCoin ||
        type === Game.Content.Types.Cash
}

TownUpgradeFlow._getRewardFlyCount = function(reward) {
    var count = reward && reward.Count ? Number(reward.Count()) : 1
    if (isNaN(count) || count <= 0) return 1
    return Math.ceil(count)
}

TownUpgradeFlow._playRewardGroup = function(flowId, fromNode, rewards, targetNode, cb, fromWorldPos) {
    if (!rewards || rewards.length <= 0) {
        TownUpgradeFlow._logStep("playRewardGroup skipped: empty")
        if (cb) cb()
        return
    }
    if (!GameMainWindow.instance || !GameMainWindow.instance.coinFlyToTargetAnim || (!fromNode && !fromWorldPos) || !targetNode) {
        TownUpgradeFlow._logStep("playRewardGroup skipped: missing anim target", "count", rewards.length, "hasGameMainWindow", !!GameMainWindow.instance, "hasFromNode", !!fromNode, "hasFromWorldPos", !!fromWorldPos, "hasTargetNode", !!targetNode)
        if (cb) cb()
        return
    }
    fromWorldPos = fromWorldPos || TownUpgradeFlow._convertToWorldSpaceAR(fromNode)
    var toWorldPos = TownUpgradeFlow._convertToWorldSpaceAR(targetNode)
    var index = 0
    var playNext = function() {
        if (!TownUpgradeFlow._isActivePhase(flowId, "reward_fly")) return
        if (index >= rewards.length) {
            TownUpgradeFlow._logStep("playRewardGroup done", "count", rewards.length)
            if (cb) cb()
            return
        }
        var reward = rewards[index++]
        TownUpgradeFlow._logStep("playReward start", "index", index, "count", rewards.length, "type", reward.Type(), "rewardCount", reward.Count())
        if (reward.Type() === Game.Content.Types.Exp) {
            var mergeNodeUI = typeof GamePlay !== "undefined" && GamePlay.instance && GamePlay.instance.mergeRoot && GamePlay.instance.mergeRoot.mergeNodeUI
            if (mergeNodeUI && mergeNodeUI.PlayCoinFlyToTargetAnimNew) {
                mergeNodeUI.PlayCoinFlyToTargetAnimNew(fromWorldPos, TownUpgradeFlow._getRewardFlyCount(reward), null, Game.Content.Types.Exp, toWorldPos, playNext)
            } else {
                TownUpgradeFlow._logStep("playReward skipped: missing mergeNodeUI", "index", index, "type", reward.Type())
                playNext()
            }
            return
        }
        TownUpgradeFlow._getRewardIcon(reward, function(spriteFrame) {
            if (!spriteFrame) {
                TownUpgradeFlow._logStep("playReward skipped: icon missing", "index", index)
                playNext()
                return
            }
            GameMainWindow.instance.coinFlyToTargetAnim.PlayCollectAnim(spriteFrame, fromWorldPos, toWorldPos, Math.max(1, Math.min(8, Math.ceil(reward.Count()))), playNext)
        })
    }
    playNext()
}

TownUpgradeFlow._playResourceRewardGroup = function(flowId, fromNode, rewards, cb, fromWorldPos) {
    if (!rewards || rewards.length <= 0) {
        TownUpgradeFlow._logStep("playResourceRewardGroup skipped: empty")
        if (cb) cb()
        return
    }
    var mergeNodeUI = typeof GamePlay !== "undefined" && GamePlay.instance && GamePlay.instance.mergeRoot && GamePlay.instance.mergeRoot.mergeNodeUI
    if (!mergeNodeUI || !mergeNodeUI.PlayCoinFlyToTargetAnimNew || (!fromNode && !fromWorldPos)) {
        TownUpgradeFlow._logStep("playResourceRewardGroup skipped: missing anim target", "count", rewards.length, "hasMergeNodeUI", !!mergeNodeUI, "hasFromNode", !!fromNode, "hasFromWorldPos", !!fromWorldPos)
        if (cb) cb()
        return
    }
    fromWorldPos = fromWorldPos || TownUpgradeFlow._convertToWorldSpaceAR(fromNode)
    var index = 0
    var playNext = function() {
        if (!TownUpgradeFlow._isActivePhase(flowId, "reward_fly")) return
        if (index >= rewards.length) {
            TownUpgradeFlow._logStep("playResourceRewardGroup done", "count", rewards.length)
            if (cb) cb()
            return
        }
        var reward = rewards[index++]
        var type = reward.Type()
        var toWorldPos = null
        TownUpgradeFlow._logStep("playResourceReward start", "index", index, "count", rewards.length, "type", type, "rewardCount", reward.Count())
        if (type === Game.Content.Types.Exp) {
            var expTargetNode = TownUpgradeFlow._getExpTargetNode()
            if (!expTargetNode) {
                TownUpgradeFlow._logStep("playResourceReward skipped: exp target missing", "index", index)
                playNext()
                return
            }
            toWorldPos = TownUpgradeFlow._convertToWorldSpaceAR(expTargetNode)
        }
        mergeNodeUI.PlayCoinFlyToTargetAnimNew(fromWorldPos, TownUpgradeFlow._getRewardFlyCount(reward), null, type, toWorldPos, playNext)
    }
    playNext()
}

TownUpgradeFlow._getRewardIcon = function(reward, cb) {
    var n = new Node("town_reward_icon")
    var sp = n.addComponent(Sprite)
    var startTime = Date.now()
    var done = false
    var finish = function() {
        if (done) return
        done = true
        var spriteFrame = sp.spriteFrame
        n.destroy()
        TownUpgradeFlow._logStep("reward icon loaded", "type", reward.Type(), "cost", Date.now() - startTime)
        cb(spriteFrame)
    }
    reward.Icon(sp, finish)
    if (sp.spriteFrame) {
        finish()
    }
}

TownUpgradeFlow._getItemTargetNode = function() {
    if (GameMainWindow.instance && GameMainWindow.instance.node) {
        var target = find("town/merge", GameMainWindow.instance.node)
        if (target) return target
    }
    return find("GameMainWindow/town/merge")
}

TownUpgradeFlow._getExpTargetNode = function() {
    var win = GameMainWindow.instance
    if (!win) return null
    if (win.node) {
        var progress = find("public/UserInfo/avatar/exp_progress", win.node)
        if (progress) return progress
    }
    var rootProgress = find("GameMainWindow/public/UserInfo/avatar/exp_progress")
    if (rootProgress) return rootProgress
    if (!win.userinfo) return null
    if (win.userinfo.node) return win.userinfo.node
    return null
}

TownUpgradeFlow._skipLevelRewardTutorialIfNeeded = function(flowId) {
    if (!Game.MergeTutorialManager ||
        !Game.MergeTutorialManager.IsWaitingNodeClick ||
        !Game.MergeTutorialManager.EmitNodeClick) {
        return
    }
    if (!Game.MergeTutorialManager.IsWaitingNodeClick('level_reward_button')) return
    Game.MergeTutorialManager.EmitNodeClick('level_reward_button', {
        source: 'town_upgrade_flow',
        skipped: true,
        townUpgradeFlowId: flowId,
    })
}

TownUpgradeFlow._showLevelUpIfNeeded = function(flowId, levelChanged, cb) {
    if (!TownUpgradeFlow._isActivePhase(flowId, "level_reward")) return
    TownUpgradeFlow._logStep("showLevelUpIfNeeded start", "levelChanged", levelChanged)
    if (!levelChanged) {
        TownUpgradeFlow._skipLevelRewardTutorialIfNeeded(flowId)
        TownUpgradeFlow._logStep("showLevelUpIfNeeded skipped: no user level up")
        if (cb) cb()
        return
    }
    var getrewards = GameKit.DataCache.GetData("LevelUPGetReward")
    GameKit.DataCache.RemoveData("LevelUPGetReward")
    if (!getrewards || getrewards.length <= 0) {
        TownUpgradeFlow._skipLevelRewardTutorialIfNeeded(flowId)
        TownUpgradeFlow._logStep("showLevelUpIfNeeded skipped: user level up no rewards")
        if (cb) cb()
        return
    }
    var rewards = []
    getrewards.forEach(function(x) {
        rewards.push(Game.Content.FromContent(x))
    })
    TownUpgradeFlow._logStep("open LevelUpGetRewardWindow", "rewardCount", rewards.length)
    UIRoot.instance.openChildWindow("LevelUpGetRewardWindow", {
        contents: rewards,
        townUpgradeFlowId: flowId,
        showCallback: function(wnd) {
            TownUpgradeFlow._setPresentationInteractive(flowId, "level_reward", true)
            wnd.addOnCloseFunc(function() {
                TownUpgradeFlow._setPresentationInteractive(flowId, "level_reward", false)
            })
        },
        rewardDoneCallback: function() {
            if (!TownUpgradeFlow._isActivePhase(flowId, "level_reward")) return
            TownUpgradeFlow._logStep("LevelUpGetRewardWindow rewardDoneCallback")
            if (cb) cb()
        }
    })
}

TownUpgradeFlow._openStory = function(flowId, meta, level, stage, cb) {
    if (!TownUpgradeFlow._isActivePhase(flowId, "story")) return
    TownUpgradeFlow._logStep("openStory start", "mbid", meta.MBId(), "level", level, "stage", stage)
    var open = function() {
        if (!TownUpgradeFlow._isActivePhase(flowId, "story")) return
        var list = Game.SUserStory.getContentList(meta.MapId(), meta.BuildID(), level, stage)
        if (!list || list.length <= 0) {
            TownUpgradeFlow._logStep("openStory skipped: no content", "mbid", meta.MBId(), "level", level, "stage", stage)
            if (cb) cb()
            return
        }
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.CloseTutorialWindow) {
            TownUpgradeFlow._logStep("openStory close tutorial window")
            Game.MergeTutorialManager.CloseTutorialWindow()
        }
        TownUpgradeFlow._logStep("open StoryWindow", "mbid", meta.MBId(), "contentCount", list.length)
        UIRoot.instance.openChildWindow("StoryWindow", {level: level, stage: stage, meta: meta, record: false, skipRewards: true, townUpgradeFlowId: flowId, showCallback: function(wnd) {
            TownUpgradeFlow._setPresentationInteractive(flowId, "story", true)
            wnd.addOnCloseFunc(function() {
                if (!TownUpgradeFlow._isActivePhase(flowId, "story")) return
                TownUpgradeFlow._setPresentationInteractive(flowId, "story", false)
                TownUpgradeFlow._logStep("StoryWindow closed", "mbid", meta.MBId())
                if (cb) cb()
            })
        }})
    }
    var url = G.GameConfig.storyPortal + meta.MBId() + ".txt"
    TownUpgradeFlow._logStep("loadStory before StoryWindow", "mbid", meta.MBId(), "url", url)
    Game.SUserStory.loadStory(url, meta.MBId(), function(success) {
        if (!TownUpgradeFlow._isActivePhase(flowId, "story")) return
        TownUpgradeFlow._logStep("loadStory before StoryWindow done", "mbid", meta.MBId(), "success", success)
        if (!success) {
            if (cb) cb()
            return
        }
        open()
    })
}

TownUpgradeFlow._finish = function(flowId, source) {
    flowId = flowId == null ? TownUpgradeFlow._currentFlowId : flowId
    if (!TownUpgradeFlow._transactionState.finish(flowId)) return false
    var finished = TownUpgradeFlow._transactionState.consumeFinished()
    var mapID = finished.mapID
    var buildID = finished.buildID
    TownUpgradeFlow._logStep("finish", "flowId", flowId, "source", source, "mapID", mapID, "buildID", buildID)
    if ((TownUpgradeFlow._resourceGainPlans && TownUpgradeFlow._resourceGainPlans.length > 0) ||
        (TownUpgradeFlow._heldResourceValues && Object.keys(TownUpgradeFlow._heldResourceValues).length > 0)) {
        TownUpgradeFlow._cancelResourceDisplays()
    }
    TownUpgradeFlow._running = false
    TownUpgradeFlow._currentFlowId = null
    TownUpgradeFlow._hijackedRewards = []
    TownUpgradeFlow._rewardHijacked = false
    TownUpgradeFlow._pendingUnlockedBuildID = null
    TownUpgradeFlow._beforeUnlockedBuildIDs = null
    TownUpgradeFlow._currentMapID = null
    TownUpgradeFlow._currentBuildID = null
    GameKit.DataCache.RemoveData("HijackGetReward")
    GameKit.DataCache.RemoveData("TownUpgradeFlowDelayUnlockLookBuild")
    if (GameKit.WebEvent && GameKit.WebEvent.EventName && GameKit.WebEvent.UnRegisterEvent) {
        GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, "TownUpgradeFlow")
    }
    TownUpgradeFlow._releaseInputLock(flowId)
    if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitFlowEvent) {
        Game.MergeTutorialManager.EmitFlowEvent('town_upgrade_flow_done', {
            mapId: mapID,
            buildId: buildID,
            flowId: flowId,
        })
    }
    if (finished.p5Eligible && Game.MergeTutorialManager && Game.MergeTutorialManager.ReleaseTownUpgradeP5) {
        Game.MergeTutorialManager.ReleaseTownUpgradeP5(flowId)
    }
    if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshCurrentWindow) {
        Game.MergeTutorialManager.RefreshCurrentWindow()
    }
    return true
}

global.Game.TownUpgradeFlow = TownUpgradeFlow
TownUpgradeFlow._convertToWorldSpaceAR = function(node) {
    if (!node) return new Vec3()
    var transform = node.getComponent(UITransform)
    return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone()
}

global.Game.TownUpgradeFlow = TownUpgradeFlow
export default TownUpgradeFlow