import '../../LegacyGlobals';
import { find, Node, Sprite, UITransform, Vec3 } from 'cc';

import { UserMap } from './UserMap';
const TownUpgradeFlow: any = {}

TownUpgradeFlow._running = false

TownUpgradeFlow.isRunning = function() {
    return TownUpgradeFlow._running
}

TownUpgradeFlow.start = function(params) {
    if (TownUpgradeFlow._running) return
    params = params || {}
    var meta = params.meta
    if (!meta) return

    var mapID = params.mapID || meta.MapId()
    var buildID = params.buildID || meta.BuildID()
    var mbid = mapID + "_" + buildID
    var oldElement = Game.SUserMap.initElement(mbid)
    var oldLevel = oldElement.level
    var oldStage = oldElement.stage
    var oldUserLevel = Game.SUser.Level()
    var actionLevel = params.actionLevel != null ? params.actionLevel : Game.SUserMap.GetNextActionLevel(mbid)
    var oldContext = Game.SUserMap.GetBuildActionContext(mbid, actionLevel)

    TownUpgradeFlow._running = true
    TownUpgradeFlow._pendingUnlockedBuildID = null
    TownUpgradeFlow._registerUnlockCapture()
    GameKit.DataCache.RemoveData("GET_EXP")
    TownUpgradeFlow._hijackedRewards = []
    TownUpgradeFlow._rewardHijacked = false
    GameKit.DataCache.SetData("HijackGetReward", function(rewards){
        TownUpgradeFlow._rewardHijacked = true
        TownUpgradeFlow._hijackedRewards = rewards || []
    })
    var req = SR.SRVillage.levelUpElement(mapID, buildID)
    req.SetCallBack(function(res) {
        console.log("levelUpElement",res);

        var expReward = GameKit.DataCache.GetData("GET_EXP")
        GameKit.DataCache.RemoveData("GET_EXP")
        TownUpgradeFlow._refreshVillage(function() {
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
            var levelChanged = Game.SUser.Level() > oldUserLevel
            var unlockedBuildID = TownUpgradeFlow._pendingUnlockedBuildID || TownUpgradeFlow._getNewUnlockedBuildID(mapID, oldUserLevel)

            if (params.window && params.window.close_window) {
                params.window.close_window()
            }

            TownUpgradeFlow._playBuildAnimation(buildID, {
                buildID: buildID,
                level: newElement.level,
                stage: newElement.stage,
                oldLv: oldLevel,
                oldStage: oldStage,
            }, function() {
                if (!levelChangedByBuild) {
                    TownUpgradeFlow._playRewards(params.fromNode, rewards, function() {
                        TownUpgradeFlow._showLevelUpIfNeeded(levelChanged, function() {
                            TownUpgradeFlow._openStory(meta, showLevel, storyStage, function() {
                                TownUpgradeFlow._finish()
                            })
                        })
                    }, params.fromWorldPos)
                    return
                }
                TownUpgradeFlow._playRewards(params.fromNode, rewards, function() {
                    TownUpgradeFlow._showLevelUpIfNeeded(levelChanged, function() {
                        TownUpgradeFlow._openStory(meta, showLevel, storyStage, function() {
                            TownUpgradeFlow._lookBuild(unlockedBuildID)
                            TownUpgradeFlow._finish()
                        })
                    })
                }, params.fromWorldPos)
            })
        })
    })
    req.SetErrorCallBack(function() {
        TownUpgradeFlow._finish()
    })
    req.Send()
}

TownUpgradeFlow._registerUnlockCapture = function() {
    GameKit.DataCache.SetData("TownUpgradeFlowDelayUnlockLookBuild", true)
    if (!GameKit.WebEvent || !GameKit.WebEvent.EventName || !GameKit.WebEvent.RegisterEvent) return
    GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, "TownUpgradeFlow", function(data) {
        var buildID = TownUpgradeFlow._getEventUnlockedBuildID(data)
        if (buildID) TownUpgradeFlow._pendingUnlockedBuildID = buildID
    })
}

TownUpgradeFlow._getEventUnlockedBuildID = function(data) {
    var houses = data && data.housesUnderUpgrade
    if (!houses) return null
    var ids = []
    for (var key in houses) {
        if (!Object.prototype.hasOwnProperty.call(houses, key)) continue
        var item = houses[key]
        if (item && item.buildId) ids.push(item.buildId)
    }
    if (ids.length <= 0) return null
    ids.sort(function(a, b) { return a - b })
    return ids[0]
}

TownUpgradeFlow._getNewUnlockedBuildID = function(mapID, oldUserLevel) {
    if (typeof Meta === "undefined" || !Meta.MetaManager || !Meta.MapMeta || !Game.SUserMap || !UserMap) return null
    var metas = Meta.MetaManager.GetMetas(Meta.MetaType.Map)
    if (!metas) return null
    var list = []
    for (var key in metas) {
        if (!Object.prototype.hasOwnProperty.call(metas, key)) continue
        var meta = metas[key]
        if (!meta || meta.MapId() !== mapID) continue
        if (meta.LimitLv() <= oldUserLevel || meta.LimitLv() > Game.SUser.Level()) continue
        if (Game.SUserMap.GetElementState(meta.MBId()) !== UserMap.ElementState.UnlockedNotBought) continue
        list.push(meta)
    }
    if (list.length <= 0) return null
    list.sort(function(a, b) {
        if (a.LimitLv() !== b.LimitLv()) return a.LimitLv() - b.LimitLv()
        return a.BuildID() - b.BuildID()
    })
    return list[0].BuildID()
}

TownUpgradeFlow._lookBuild = function(buildID) {
    if (!buildID) return
    var mapNode = GamePlay.instance && GamePlay.instance.mapNode
    if (!mapNode || !mapNode.lookBuild) return
    if (mapNode.onCanLevelUpEffect) mapNode.onCanLevelUpEffect()
    mapNode.lookBuild(buildID)
}

TownUpgradeFlow._refreshVillage = function(cb) {
    var reqV = SR.SRVillage.getUserVillage()
    reqV.SetCallBack(function() {
        Game.SUserMap.initMapData()
        if (GamePlay.instance && GamePlay.instance.mapNode && GamePlay.instance.mapNode.onCanLevelUpEffect) {
            GamePlay.instance.mapNode.onCanLevelUpEffect()
        }
        if (cb) cb()
    })
    reqV.SetErrorCallBack(function() {
        if (cb) cb()
    })
    reqV.Send()
}

TownUpgradeFlow._playBuildAnimation = function(buildID, eventData, cb) {
    var mapNode = GamePlay.instance && GamePlay.instance.mapNode
    if (!mapNode || !mapNode.playElementLevelUpAnimation) {
        if (cb) cb()
        return
    }
    mapNode.playElementLevelUpAnimation(buildID, function() {
        GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MapElementLevelUp, eventData)
        if (cb) cb()
    }, eventData)
}

TownUpgradeFlow._playRewards = function(fromNode, rewards, cb, fromWorldPos) {
    rewards = rewards || []
    var expRewards = []
    var itemRewards = []
    rewards.forEach(function(reward) {
        if (!reward) return
        if (reward.Type() === Game.Content.Types.Exp) expRewards.push(reward)
        else itemRewards.push(reward)
    })

    TownUpgradeFlow._playRewardGroup(fromNode, itemRewards, TownUpgradeFlow._getItemTargetNode(), function() {
        TownUpgradeFlow._playRewardGroup(fromNode, expRewards, TownUpgradeFlow._getExpTargetNode(), cb, fromWorldPos)
    }, fromWorldPos)
}

TownUpgradeFlow._playRewardGroup = function(fromNode, rewards, targetNode, cb, fromWorldPos) {
    if (!rewards || rewards.length <= 0) {
        if (cb) cb()
        return
    }
    if (!GameMainWindow.instance || !GameMainWindow.instance.coinFlyToTargetAnim || (!fromNode && !fromWorldPos) || !targetNode) {
        if (cb) cb()
        return
    }
    fromWorldPos = fromWorldPos || TownUpgradeFlow._convertToWorldSpaceAR(fromNode)
    var toWorldPos = TownUpgradeFlow._convertToWorldSpaceAR(targetNode)
    var index = 0
    var playNext = function() {
        if (index >= rewards.length) {
            if (cb) cb()
            return
        }
        var reward = rewards[index++]
        TownUpgradeFlow._getRewardIcon(reward, function(spriteFrame) {
            if (!spriteFrame) {
                playNext()
                return
            }
            GameMainWindow.instance.coinFlyToTargetAnim.PlayCollectAnim(spriteFrame, fromWorldPos, toWorldPos, Math.max(1, Math.min(8, Math.ceil(reward.Count()))), playNext)
        })
    }
    playNext()
}

TownUpgradeFlow._getRewardIcon = function(reward, cb) {
    var n = new Node("town_reward_icon")
    var sp = n.addComponent(Sprite)
    var done = false
    var finish = function() {
        if (done) return
        done = true
        var spriteFrame = sp.spriteFrame
        n.destroy()
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

TownUpgradeFlow._showLevelUpIfNeeded = function(levelChanged, cb) {
    if (!levelChanged) {
        if (cb) cb()
        return
    }
    var getrewards = GameKit.DataCache.GetData("LevelUPGetReward")
    GameKit.DataCache.RemoveData("LevelUPGetReward")
    if (!getrewards || getrewards.length <= 0) {
        if (cb) cb()
        return
    }
    var rewards = []
    getrewards.forEach(function(x) {
        rewards.push(Game.Content.FromContent(x))
    })
    UIRoot.instance.openChildWindow("LevelUpGetRewardWindow", {contents: rewards, showCallback: function(wnd) {
        wnd.addOnCloseFunc(function() {
            if (cb) cb()
        })
    }})
}

TownUpgradeFlow._openStory = function(meta, level, stage, cb) {
    var open = function() {
        var list = Game.SUserStory.getContentList(meta.MapId(), meta.BuildID(), level, stage)
        if (!list || list.length <= 0) {
            if (cb) cb()
            return
        }
        UIRoot.instance.openChildWindow("StoryWindow", {level: level, stage: stage, meta: meta, record: false, skipRewards: true, showCallback: function(wnd) {
            wnd.addOnCloseFunc(function() {
                if (cb) cb()
            })
        }})
    }
    var url = G.GameConfig.storyPortal + meta.MBId() + ".txt"
    Game.SUserStory.loadStory(url, meta.MBId(), function() {
        open()
    })
}

TownUpgradeFlow._finish = function() {
    TownUpgradeFlow._running = false
    TownUpgradeFlow._hijackedRewards = []
    TownUpgradeFlow._rewardHijacked = false
    TownUpgradeFlow._pendingUnlockedBuildID = null
    GameKit.DataCache.RemoveData("HijackGetReward")
    GameKit.DataCache.RemoveData("TownUpgradeFlowDelayUnlockLookBuild")
    if (GameKit.WebEvent && GameKit.WebEvent.EventName && GameKit.WebEvent.UnRegisterEvent) {
        GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, "TownUpgradeFlow")
    }
    if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshCurrentWindow) {
        Game.MergeTutorialManager.RefreshCurrentWindow()
    }
}

TownUpgradeFlow._convertToWorldSpaceAR = function(node) {
    if (!node) return new Vec3()
    var transform = node.getComponent(UITransform)
    return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone()
}

global.Game.TownUpgradeFlow = TownUpgradeFlow
export default TownUpgradeFlow
