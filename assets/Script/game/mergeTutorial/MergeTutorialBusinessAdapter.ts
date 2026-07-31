import '../../LegacyGlobals';

const MergeTutorialBusinessAdapter: any = {}

MergeTutorialBusinessAdapter.GetUserMergePendingRewards = function(owner) {
    if (typeof Game === 'undefined' || !Game.SUserMerge) return {}
    if (Game.SUserMerge.GetPendingRewards) return Game.SUserMerge.GetPendingRewards() || {}
    if (Game.SUserMerge.Data) {
        var data = Game.SUserMerge.Data()
        return data && data.pendingRewards ? data.pendingRewards : {}
    }
    return Game.SUserMerge.data && Game.SUserMerge.data.pendingRewards ? Game.SUserMerge.data.pendingRewards : {}
}

MergeTutorialBusinessAdapter.HasPendingP5GeneratorReward = function(owner) {
    return owner.HasPendingRewardMergeId &&
        owner.HasPendingRewardMergeId(owner.P5GeneratorMergeId)
}

MergeTutorialBusinessAdapter.HasPendingRewardMergeId = function(owner, mergeId) {
    return owner.CountPendingRewardMergeId &&
        owner.CountPendingRewardMergeId(owner.GetUserMergePendingRewards(), mergeId) > 0
}

MergeTutorialBusinessAdapter.GetRewardPieceData = function(owner, reward) {
    if (!reward) return ''
    if (typeof reward === 'string') return reward
    if (reward.t && reward.t !== 'piece') return ''
    return reward.d || ''
}

MergeTutorialBusinessAdapter.GetMergeIdFromDataStr = function(owner, dataStr) {
    if (dataStr === undefined || dataStr === null || dataStr === '') return ''
    var parts = String(dataStr).split('_')
    return parts.length > 0 ? String(parseInt(parts[0], 10) || '') : ''
}

MergeTutorialBusinessAdapter.CountPendingRewardMergeId = function(owner, pendingRewards, mergeId) {
    if (!pendingRewards || typeof pendingRewards !== 'object') return 0
    mergeId = String(mergeId || '')
    if (!mergeId) return 0
    var count = 0
    for (var key in pendingRewards) {
        if (!Object.prototype.hasOwnProperty.call(pendingRewards, key)) continue
        var dataStr = owner.GetRewardPieceData(pendingRewards[key])
        if (owner.GetMergeIdFromDataStr(dataStr) === mergeId) count++
    }
    return count
}

MergeTutorialBusinessAdapter.GetLastPendingRewardMergeId = function(owner) {
    if (typeof Game === 'undefined' || !Game.SUserMerge || !Game.SUserMerge.GetLastPendingRewards) return ''
    var reward = Game.SUserMerge.GetLastPendingRewards()
    return owner.GetMergeIdFromDataStr(owner.GetRewardPieceData(reward))
}

MergeTutorialBusinessAdapter.GetMergeMapData = function(owner) {
    if (typeof Game === 'undefined' || !Game.SUserMerge) return {}
    if (Game.SUserMerge.GetMergeMapData) return Game.SUserMerge.GetMergeMapData() || {}
    if (Game.SUserMerge.Data) {
        var data = Game.SUserMerge.Data()
        return data && data.data ? data.data : {}
    }
    return Game.SUserMerge.data && Game.SUserMerge.data.data ? Game.SUserMerge.data.data : {}
}

MergeTutorialBusinessAdapter.FindBoardCellByMergeId = function(owner, mergeId, excludeCellKey) {
    var cells = owner.FindBoardCellsByMergeId(mergeId, excludeCellKey)
    return cells.length > 0 ? cells[0] : ''
}

MergeTutorialBusinessAdapter.FindBoardCellsByMergeId = function(owner, mergeId, excludeCellKey) {
    mergeId = String(mergeId || '')
    if (!mergeId) return []
    excludeCellKey = owner.NormalizeTileKey(excludeCellKey)
    var mapData = owner.GetMergeMapData()
    var cells = []
    for (var cellKey in mapData) {
        if (!Object.prototype.hasOwnProperty.call(mapData, cellKey)) continue
        if (excludeCellKey && owner.NormalizeTileKey(cellKey) === excludeCellKey) continue
        var dataStr = owner.GetRewardPieceData(mapData[cellKey])
        if (owner.GetMergeIdFromDataStr(dataStr) === mergeId) cells.push(owner.NormalizeTileKey(cellKey))
    }
    return cells
}

MergeTutorialBusinessAdapter.IsBoardCellMergeId = function(owner, cellKey, mergeId) {
    cellKey = owner.NormalizeTileKey(cellKey)
    mergeId = String(mergeId || '')
    if (!cellKey || !mergeId) return false
    var mapData = owner.GetMergeMapData()
    if (!Object.prototype.hasOwnProperty.call(mapData, cellKey)) return false
    return owner.GetMergeIdFromDataStr(owner.GetRewardPieceData(mapData[cellKey])) === mergeId
}

MergeTutorialBusinessAdapter.HasBoardEmptyTile = function(owner) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    if (!levelNode || !levelNode.getEmptyTilePos) {
        owner.DebugGeneratorGuideLog('HasBoardEmptyTile:false:noLevelNode', {
            hasLevelNode: !!levelNode,
            hasGetEmptyTilePos: !!(levelNode && levelNode.getEmptyTilePos),
            sceneActive: owner.IsMergeBoardSceneActive ? owner.IsMergeBoardSceneActive() : false,
        })
        return false
    }
    var emptyTile = levelNode.getEmptyTilePos()
    owner.DebugGeneratorGuideLog('HasBoardEmptyTile:levelNode', {
        emptyTile: emptyTile,
    })
    return !!emptyTile
}

MergeTutorialBusinessAdapter.PrepareGeneratorMergeGuide = function(owner, mergeId) {
    mergeId = String(mergeId || owner.P5GeneratorMergeId)
    var prevState = owner.generatorGuideState || {}
    var prevClaimedCellKey = String(prevState.mergeId || '') === mergeId
        ? owner.NormalizeTileKey(prevState.claimedCellKey)
        : ''
    var validClaimedCellKey = owner.IsBoardCellMergeId(prevClaimedCellKey, mergeId) ? prevClaimedCellKey : ''
    var boardCellKey = owner.FindBoardCellByMergeId(mergeId, validClaimedCellKey) || owner.FindBoardCellByMergeId(mergeId)
    owner.generatorGuideState = owner.generatorGuideState || {}
    owner.generatorGuideState.mergeId = mergeId
    owner.generatorGuideState.boardCellKey = boardCellKey
    owner.generatorGuideState.claimedCellKey = validClaimedCellKey && validClaimedCellKey !== boardCellKey ? validClaimedCellKey : ''
    return !!boardCellKey
}

MergeTutorialBusinessAdapter.EnsureGeneratorGuideDragCells = function(owner, mergeId) {
    mergeId = String(mergeId || owner.P5GeneratorMergeId)
    if (!mergeId) return false
    var cells = owner.FindBoardCellsByMergeId ? owner.FindBoardCellsByMergeId(mergeId) : []
    if (cells.length < 2) return false

    owner.generatorGuideState = owner.generatorGuideState || {}
    var state = owner.generatorGuideState
    if (String(state.mergeId || '') !== mergeId) {
        state.mergeId = mergeId
        state.boardCellKey = ''
        state.claimedCellKey = ''
    }

    var boardCellKey = owner.NormalizeTileKey(state.boardCellKey)
    var claimedCellKey = owner.NormalizeTileKey(state.claimedCellKey)
    if (cells.indexOf(boardCellKey) < 0) boardCellKey = ''
    if (cells.indexOf(claimedCellKey) < 0) claimedCellKey = ''
    if (boardCellKey && claimedCellKey && boardCellKey === claimedCellKey) claimedCellKey = ''

    if (!boardCellKey) {
        for (var i = 0; i < cells.length; i++) {
            if (!claimedCellKey || cells[i] !== claimedCellKey) {
                boardCellKey = cells[i]
                break
            }
        }
    }
    if (!claimedCellKey) {
        for (var j = 0; j < cells.length; j++) {
            if (cells[j] !== boardCellKey) {
                claimedCellKey = cells[j]
                break
            }
        }
    }

    state.mergeId = mergeId
    state.boardCellKey = boardCellKey
    state.claimedCellKey = claimedCellKey
    return !!(boardCellKey && claimedCellKey && boardCellKey !== claimedCellKey)
}

MergeTutorialBusinessAdapter.CheckGeneratorMergeReady = function(owner, conditionParam, payload) {
    var mergeId = String(conditionParam || (payload && (payload.mergeId || payload.itemId)) || owner.P5GeneratorMergeId)
    if (!mergeId) {
        owner.DebugGeneratorGuideLog('CheckGeneratorMergeReady:false:noMergeId', {
            conditionParam: conditionParam,
            payload: payload,
        })
        return false
    }
    var mainFinished = !!(owner.IsFinished && owner.IsFinished())
    if (!mainFinished) {
        owner.DebugGeneratorGuideLog('CheckGeneratorMergeReady:false:mainNotFinished', {
            mergeId: mergeId,
            payload: payload,
        })
        return false
    }
    var pendingCount = owner.CountPendingRewardMergeId
        ? owner.CountPendingRewardMergeId(owner.GetUserMergePendingRewards(), mergeId)
        : 0
    if (pendingCount <= 0) {
        owner.DebugGeneratorGuideLog('CheckGeneratorMergeReady:false:pendingMissing', {
            mergeId: mergeId,
            lastPendingMergeId: owner.GetLastPendingRewardMergeId ? owner.GetLastPendingRewardMergeId() : '',
            pendingRewards: owner.GetUserMergePendingRewards ? owner.GetUserMergePendingRewards() : {},
            payload: payload,
        })
        return false
    }
    if (payload && payload.source === 'level_reward_claim' && !owner.IsMergeBoardSceneActive()) {
        owner.DebugGeneratorGuideLog('CheckGeneratorMergeReady:true:levelRewardClaimBeforeBoard', {
            mergeId: mergeId,
            pendingCount: pendingCount,
            payload: payload,
        })
        return true
    }
    var hasEmptyTile = owner.HasBoardEmptyTile()
    if (!hasEmptyTile) {
        owner.DebugGeneratorGuideLog('CheckGeneratorMergeReady:false:noEmptyTile', {
            mergeId: mergeId,
            pendingCount: pendingCount,
            sceneActive: owner.IsMergeBoardSceneActive ? owner.IsMergeBoardSceneActive() : false,
        })
        return false
    }
    var prepared = owner.PrepareGeneratorMergeGuide(mergeId)
    owner.DebugGeneratorGuideLog(prepared ? 'CheckGeneratorMergeReady:true' : 'CheckGeneratorMergeReady:false:noBoardGenerator', {
        mergeId: mergeId,
        pendingCount: pendingCount,
        generatorGuideState: owner.generatorGuideState,
    })
    return prepared
}

MergeTutorialBusinessAdapter.GetRewardMergeId = function(owner, reward) {
    return owner.GetMergeIdFromDataStr(owner.GetRewardPieceData(reward))
}

MergeTutorialBusinessAdapter.BeginP5GeneratorTempRewardClaim = function(owner, reward) {
    if (!owner.IsP5GeneratorTempNoteStep()) return true
    var mergeId = String(owner.GetRewardMergeId(reward) || '')
    if (mergeId !== String(owner.P5GeneratorMergeId)) return false
    if (owner.p5GeneratorTempRewardClaiming) return false
    if (owner.generatorGuideState &&
        String(owner.generatorGuideState.mergeId || '') === mergeId &&
        owner.generatorGuideState.claimedCellKey) {
        return false
    }
    owner.p5GeneratorTempRewardClaiming = true
    return true
}

MergeTutorialBusinessAdapter.CancelP5GeneratorTempRewardClaim = function(owner, reward) {
    if (!owner.IsP5GeneratorTempNoteStep()) return
    var mergeId = String(owner.GetRewardMergeId(reward) || '')
    if (mergeId === String(owner.P5GeneratorMergeId)) {
        owner.p5GeneratorTempRewardClaiming = false
    }
}

MergeTutorialBusinessAdapter.RecordGeneratorGuideClaimedCell = function(owner, mergeId, cellKey) {
    mergeId = String(mergeId || owner.P5GeneratorMergeId)
    owner.generatorGuideState = owner.generatorGuideState || {}
    if (!owner.generatorGuideState.boardCellKey || String(owner.generatorGuideState.mergeId || '') !== mergeId) {
        owner.PrepareGeneratorMergeGuide(mergeId)
    }
    owner.generatorGuideState.mergeId = mergeId
    owner.generatorGuideState.claimedCellKey = owner.NormalizeTileKey(cellKey)
    return !!owner.generatorGuideState.claimedCellKey
}

MergeTutorialBusinessAdapter.OnTempRewardClaimed = function(owner, payload) {
    payload = payload || {}
    var mergeId = String(payload.mergeId || owner.GetMergeIdFromDataStr(payload.dataStr) || owner.P5GeneratorMergeId)
    if (owner.IsP5GeneratorTriggerActive && owner.IsP5GeneratorTriggerActive()) {
        if (mergeId !== String(owner.P5GeneratorMergeId)) return false
        if (owner.generatorGuideState &&
            String(owner.generatorGuideState.mergeId || '') === mergeId &&
            owner.generatorGuideState.claimedCellKey) {
            return false
        }
    }
    var recorded = owner.RecordGeneratorGuideClaimedCell(mergeId, payload.cellKey)
    if (recorded && mergeId === String(owner.P5GeneratorMergeId)) {
        owner.p5GeneratorTempRewardClaiming = true
    }
    return recorded
}

MergeTutorialBusinessAdapter.CheckBuildingCoinGate = function(owner, conditionParam) {
    var params = owner.ParseKeyValueParam(conditionParam || '')
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    if (!mapId || !buildId ||
        typeof Meta === 'undefined' || !Meta.MapMeta || !Meta.MapMeta.GetMetaById ||
        typeof Game === 'undefined' || !Game.SUser || !Game.SUser.Coin) {
        return false
    }
    var meta = Meta.MapMeta.GetMetaById(mapId, buildId)
    if (!meta || !meta.Price) {
        return false
    }
    var levels = owner.ParseLevelList(params.levels || params.level || params.lv)
    if (levels.length === 0) levels = [1]
    var needCoin = 0
    for (var i = 0; i < levels.length; i++) {
        needCoin += owner.GetMapBuildLevelPrice(meta, levels[i])
    }
    var coin = Game.SUser.Coin()
    return coin >= needCoin
}

MergeTutorialBusinessAdapter.GetBuildingCoinGateDebugInfo = function(owner, conditionParam) {
    var params = owner.ParseKeyValueParam(conditionParam || '')
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    var result = {
        conditionParam: conditionParam || '',
        mapId: mapId || '',
        buildId: buildId || '',
        levels: [],
        needCoin: 0,
        coin: null,
        pass: false,
        reason: '',
    }
    if (!mapId || !buildId) {
        result.reason = 'missing_map_or_build'
        return result
    }
    if (typeof Meta === 'undefined' || !Meta.MapMeta || !Meta.MapMeta.GetMetaById) {
        result.reason = 'missing_map_meta_accessor'
        return result
    }
    if (typeof Game === 'undefined' || !Game.SUser || !Game.SUser.Coin) {
        result.reason = 'missing_user_coin_accessor'
        return result
    }
    var meta = Meta.MapMeta.GetMetaById(mapId, buildId)
    if (!meta || !meta.Price) {
        result.reason = 'missing_build_meta_price'
        return result
    }
    var levels = owner.ParseLevelList(params.levels || params.level || params.lv)
    if (levels.length === 0) levels = [1]
    result.levels = levels
    var needCoin = 0
    for (var i = 0; i < levels.length; i++) {
        needCoin += owner.GetMapBuildLevelPrice(meta, levels[i])
    }
    var coin = Game.SUser.Coin()
    result.needCoin = needCoin
    result.coin = coin
    result.pass = coin >= needCoin
    result.reason = result.pass ? 'pass' : 'coin_not_enough'
    return result
}

MergeTutorialBusinessAdapter.ParseLevelList = function(owner, value) {
    if (value === undefined || value === null || value === '') return []
    return String(value).split(',').map(function(item) {
        return parseInt(item, 10)
    }).filter(function(item) {
        return !isNaN(item) && item >= 0
    })
}

MergeTutorialBusinessAdapter.GetMapBuildLevelPrice = function(owner, meta, level) {
    var price = meta.Price(level)
    if (Array.isArray(price)) {
        return price.reduce(function(sum, item) {
            var num = Number(item) || 0
            return sum + num
        }, 0)
    }
    return Number(price) || 0
}

MergeTutorialBusinessAdapter.IsMergeBoardFull = function(owner) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    if (levelNode && levelNode.getEmptyTilePos) {
        return !levelNode.getEmptyTilePos()
    }
    if (typeof Game === 'undefined' || !Game.SUserMerge || !Game.SUserMerge.GetMergeMapData) return false
    var mapData = Game.SUserMerge.GetMergeMapData() || {}
    var occupiedCount = 0
    for (var key in mapData) {
        if (Object.prototype.hasOwnProperty.call(mapData, key) && mapData[key]) occupiedCount++
    }
    return occupiedCount >= 49
}

MergeTutorialBusinessAdapter.GetHighestLvNormalMergeItem = function(owner) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    if (!levelNode || !levelNode.GetHighestLvNormalMergeItem) return null
    return levelNode.GetHighestLvNormalMergeItem()
}

MergeTutorialBusinessAdapter.GetBoardBuildButtonNodes = function(owner) {
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (!mergeUI) return []
    var nodes = []
    var addNode = function(node) {
        if (node && nodes.indexOf(node) < 0) nodes.push(node)
    }
    addNode(mergeUI.buildButton)
    addNode(mergeUI.hammerButton)
    if (mergeUI.noteDialog) addNode(mergeUI.noteDialog.node || mergeUI.noteDialog)
    if (mergeUI.bottomUI && mergeUI.bottomUI.getChildByName) {
        addNode(mergeUI.bottomUI.getChildByName('build_btn'))
        addNode(mergeUI.bottomUI.getChildByName('chuizi'))
    }
    if (mergeUI.topUI && owner.GetNodeByPath) {
        addNode(owner.GetNodeByPath(mergeUI.topUI, 'table/view/content/notesUI/notedialog'))
    }
    return nodes
}

MergeTutorialBusinessAdapter.GetMainForcedTutorialBoardMapButton = function(owner) {
    var nodes = owner.GetBoardBuildButtonNodes ? owner.GetBoardBuildButtonNodes() : []
    for (var i = 0; i < nodes.length; i++) {
        if (owner.IsNodeActive(nodes[i])) return nodes[i]
    }
    return nodes.length > 0 ? nodes[0] : null
}

MergeTutorialBusinessAdapter.GetBoardBuildButtonGuideTargetNode = function(owner) {
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (!mergeUI) return null
    var getBottomNode = function(name) {
        return mergeUI.bottomUI && mergeUI.bottomUI.getChildByName
            ? mergeUI.bottomUI.getChildByName(name)
            : null
    }
    var candidates = [
        getBottomNode('chuizi'),
        mergeUI.hammerButton,
        getBottomNode('build_btn'),
        mergeUI.buildButton,
    ]
    for (var i = 0; i < candidates.length; i++) {
        if (owner.IsNodeActive(candidates[i])) return candidates[i]
    }
    return null
}

MergeTutorialBusinessAdapter.RefreshBoardBuildButtonVisibility = function(owner) {
    var nodes = owner.GetBoardBuildButtonNodes ? owner.GetBoardBuildButtonNodes() : []
    if (nodes.length <= 0) return
    if (!owner.ShouldShowBoardBuildButton()) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].active = false
        }
        var hiddenMergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
        if (hiddenMergeUI && hiddenMergeUI.UpdateNotesUIVisibleSafe) {
            hiddenMergeUI.UpdateNotesUIVisibleSafe()
        } else if (hiddenMergeUI && hiddenMergeUI._updateNotesUIVisible) {
            hiddenMergeUI._updateNotesUIVisible()
        }
        return
    }
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (mergeUI && mergeUI.RefreshUpgradeButtonVisible) {
        mergeUI.RefreshUpgradeButtonVisible()
        if (mergeUI.UpdateNotesUIVisibleSafe) {
            mergeUI.UpdateNotesUIVisibleSafe()
        } else if (mergeUI._updateNotesUIVisible) {
            mergeUI._updateNotesUIVisible()
        }
        return
    }
    if (mergeUI && mergeUI._updateUpgradeButtonVisible &&
        typeof Game !== 'undefined' && Game.SUserMap && Game.SUserMap.IsRedPoint) {
        mergeUI._updateUpgradeButtonVisible(Game.SUserMap.IsRedPoint())
        if (mergeUI.UpdateNotesUIVisibleSafe) {
            mergeUI.UpdateNotesUIVisibleSafe()
        } else if (mergeUI._updateNotesUIVisible) {
            mergeUI._updateNotesUIVisible()
        }
        return
    }
    nodes[0].active = true
}

MergeTutorialBusinessAdapter.ShouldShowBoardBuildButtonForP4 = function(owner) {
    if (owner.IsP4Completed && owner.IsP4Completed()) return true
    if (!owner.IsP4TriggerActive()) return false
    if (!owner.activeTriggerStepMeta || !owner.activeTriggerStepMeta.CompleteParam) return true
    return owner.NormalizeOrderParam(owner.activeTriggerStepMeta.CompleteParam()) === 'town_button'
}

MergeTutorialBusinessAdapter.ShouldShowBoardBuildButton = function(owner) {
    if (typeof Game === 'undefined' || !Game.SUserMergeTutorial) return true
    if (owner.ShouldHideMainForcedTutorialControls()) return false
    if (!owner.GetTriggerMeta || !owner.GetTriggerMeta(owner.P4TriggerId)) return true
    return owner.ShouldShowBoardBuildButtonForP4
        ? owner.ShouldShowBoardBuildButtonForP4()
        : MergeTutorialBusinessAdapter.ShouldShowBoardBuildButtonForP4(owner)
}

MergeTutorialBusinessAdapter.ShouldShowStoreButton = function(owner) {
    if (typeof Game === 'undefined' || !Game.SUserMergeTutorial) return true
    if (owner.ShouldHideMainForcedTutorialControls()) return false
    if (!owner.GetTriggerMeta || !owner.GetTriggerMeta(owner.P5GeneratorTriggerId)) return true
    return owner.IsP5GeneratorCompleted()
}

MergeTutorialBusinessAdapter.ShouldShowShopEntryButton = function(owner) {
    if (typeof Game === 'undefined' || !Game.SUserMergeTutorial) return true
    if (owner.ShouldHideMainForcedTutorialControls()) return false
    if (!owner.GetTriggerMeta || !owner.GetTriggerMeta(owner.P5GeneratorTriggerId)) return true
    return owner.IsP5GeneratorCompleted()
}

MergeTutorialBusinessAdapter.HideMainForcedTutorialSellButton = function(owner) {
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    var mergeDes = mergeUI && mergeUI.mergeDes ? mergeUI.mergeDes : null
    if (mergeDes && mergeDes.sellButton) mergeDes.sellButton.active = false
}

MergeTutorialBusinessAdapter.RefreshMainShopEntryVisibility = function(owner) {
    var gameMainWindow = typeof GameMainWindow !== 'undefined'
        ? GameMainWindow
        : (typeof global !== 'undefined' ? global.GameMainWindow : null)
    if (gameMainWindow &&
        gameMainWindow.instance &&
        gameMainWindow.instance.refreshShopEntryVisibility) {
        gameMainWindow.instance.refreshShopEntryVisibility()
    }
}

MergeTutorialBusinessAdapter.RefreshMainForcedTutorialHiddenControls = function(owner) {
    owner.RefreshBoardBuildButtonVisibility()
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (mergeUI && mergeUI.storeButton) {
        mergeUI.storeButton.active = owner.ShouldShowStoreButton()
    }
    owner.RefreshMainShopEntryVisibility()
    if (owner.ShouldHideMainForcedTutorialControls()) owner.HideMainForcedTutorialSellButton()
}

MergeTutorialBusinessAdapter.BindNodeClickTargetIfNeeded = function(owner, stepMeta) {
    if (!stepMeta || !stepMeta.CompleteType || stepMeta.CompleteType() !== owner.CompleteTypes.NodeClick) return
    var completeParam = owner.NormalizeOrderParam(stepMeta.CompleteParam())
    if (completeParam === 'item_shop_button') {
        var shopWnd = owner.GetWindowInstance ? owner.GetWindowInstance('ShopWindow') : null
        if (shopWnd && shopWnd.bindMergeTutorialNodeClick) {
            shopWnd.bindMergeTutorialNodeClick()
        }
    }
}

MergeTutorialBusinessAdapter.ShouldHideTempRewardForGuide = function(owner) {
    return !!owner.generatorRewardFlyPlaying
}

MergeTutorialBusinessAdapter.SetTempRewardVisibleForGuide = function(owner, visible) {
    owner.generatorRewardFlyPlaying = !visible
    var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
    if (!mergeUI || !mergeUI.notetemp || !mergeUI.notetemp.node) return false
    if (visible) {
        if (mergeUI.refreshPendingRewardsUI) {
            mergeUI.refreshPendingRewardsUI()
        } else {
            mergeUI.notetemp.node.active = true
        }
    } else {
        mergeUI.notetemp.node.active = false
        if (mergeUI._updateNotesUIVisible) mergeUI._updateNotesUIVisible()
    }
    return true
}

MergeTutorialBusinessAdapter.MatchTriggerSelector = function(owner, triggerMeta, payload) {
    if (!triggerMeta || !triggerMeta.Id) return false
    payload = payload || {}
    var triggerId = payload.triggerId || payload.trigger_id || payload.tutorialTriggerId
    if (triggerId && String(triggerMeta.Id()) !== String(triggerId)) return false
    var firstStepId = payload.firstStepId || payload.first_step_id
    if (firstStepId && triggerMeta.FirstStepId && String(triggerMeta.FirstStepId()) !== String(firstStepId)) return false
    var completionReportId = payload.completionReportId || payload.completion_report_id
    if (completionReportId && triggerMeta.CompletionReportId && String(triggerMeta.CompletionReportId()) !== String(completionReportId)) return false
    return true
}

MergeTutorialBusinessAdapter.GetPayloadValueCandidates = function(owner, payload) {
    payload = payload || {}
    return [
        payload.value,
        payload.count,
        payload.level,
        payload.coin,
        payload.itemId,
        payload.mergeId,
        payload.rewardMergeId,
        payload.orderCount,
        payload.triggerParam,
        payload.id,
    ]
}

MergeTutorialBusinessAdapter.MatchTriggerParam = function(owner, expected, payload, eventName) {
    if (expected === undefined || expected === null || expected === '') return true
    expected = String(expected)
    var candidates = owner.GetPayloadValueCandidates
        ? owner.GetPayloadValueCandidates(payload)
        : MergeTutorialBusinessAdapter.GetPayloadValueCandidates(owner, payload)
    for (var i = 0; i < candidates.length; i++) {
        if (candidates[i] === undefined || candidates[i] === null) continue
        if (String(candidates[i]) === expected) return true
        if (eventName && (eventName.indexOf('_reach') >= 0 || eventName.indexOf('_count') >= 0)) {
            var expectedNum = parseFloat(expected)
            var candidateNum = parseFloat(candidates[i])
            if (!isNaN(expectedNum) && !isNaN(candidateNum) && candidateNum >= expectedNum) return true
        }
    }
    return false
}

MergeTutorialBusinessAdapter.MatchTriggerCondition = function(owner, conditionType, conditionParam, payload) {
    conditionType = conditionType || 'none'
    payload = payload || {}
    if (conditionType === 'none' || conditionType === '') return true
    if (conditionType === 'board_full') {
        return payload.boardFull === true || payload.isBoardFull === true || owner.IsMergeBoardFull()
    }
    if (conditionType === 'board_has_empty') {
        return payload.boardHasEmpty === true || payload.hasEmpty === true
    }
    if (conditionType === 'item_on_board') {
        if (!conditionParam) return !!payload.itemOnBoard
        return String(payload.itemId || payload.mergeId || '') === String(conditionParam)
    }
    if (conditionType === 'generator_merge_ready') {
        return owner.CheckGeneratorMergeReady(conditionParam, payload)
    }
    if (conditionType === 'building_coin_gate') {
        var payloadPass = payload.buildingCoinGate === true || payload.passBuildingCoinGate === true
        return payloadPass || owner.CheckBuildingCoinGate(conditionParam)
    }
    return payload[conditionType] === true
}

MergeTutorialBusinessAdapter.MatchTriggerMeta = function(owner, triggerMeta, eventName, payload) {
    if (!triggerMeta || !triggerMeta.Enabled || !triggerMeta.Enabled()) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:disabled', triggerMeta, payload)
        return false
    }
    if (owner.ShouldSkipCompletedTrigger(triggerMeta)) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:completed', triggerMeta, payload)
        return false
    }
    if (triggerMeta.TriggerEvent() !== eventName) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:eventMismatch', triggerMeta, payload)
        return false
    }
    if (!owner.MatchTriggerSelector(triggerMeta, payload)) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:selectorMismatch', triggerMeta, payload)
        return false
    }
    var isFinished = owner.IsFinished()
    if (!triggerMeta.AllowDuringForced() && !isFinished) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:mainForcedNotFinished', triggerMeta, payload)
        return false
    }
    if (!owner.MatchTriggerParam(triggerMeta.TriggerParam(), payload, eventName)) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:paramMismatch', triggerMeta, payload)
        return false
    }
    var conditionMatched = owner.MatchTriggerCondition(triggerMeta.ConditionType(), triggerMeta.ConditionParam(), payload)
    if (!conditionMatched) {
        owner.DebugP5TriggerMatchLog('MatchTriggerMeta:false:conditionMismatch', triggerMeta, payload)
        return false
    }
    owner.DebugP5TriggerMatchLog('MatchTriggerMeta:true', triggerMeta, payload)
    return true
}

MergeTutorialBusinessAdapter.CanResumeP4SavedStep = function(owner, triggerMeta, savedStepMeta) {
    if (!triggerMeta || !triggerMeta.Id || triggerMeta.Id() !== owner.P4TriggerId) return true
    if (!savedStepMeta || !savedStepMeta.CompleteParam) return true

    var params = owner.ParseKeyValueParam(triggerMeta.ConditionParam ? triggerMeta.ConditionParam() : '')
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    if (!mapId || !buildId || !owner.GetBuildActionContextByTarget) return true

    var context = owner.GetBuildActionContextByTarget({ mapId: mapId, buildId: buildId })
    if (!context || !context.state) return true

    var state = String(context.state)
    var completeParam = owner.NormalizeOrderParam(savedStepMeta.CompleteParam())
    var isMapBuildClick = owner.IsMapBuildTarget(completeParam) && completeParam.indexOf('mapId=') === 0
    if (completeParam === 'town_button' ||
        completeParam === 'building_buy_button') {
        return state === 'unlockedNotBought'
    }
    if (isMapBuildClick) {
        if (owner.IsP4StepAfterBuildBuyStep && owner.IsP4StepAfterBuildBuyStep(triggerMeta, savedStepMeta)) {
            return state === 'bought' || state === 'full'
        }
        return state === 'unlockedNotBought'
    }
    if (completeParam === 'building_upgrade_button' ||
        completeParam === 'level_reward_button' ||
        completeParam === 'back_to_board_button') {
        return state === 'bought' || state === 'full'
    }
    return true
}

MergeTutorialBusinessAdapter.IsP4TransientFlowStep = function(owner, stepMeta) {
    if (!stepMeta || !stepMeta.CompleteType || !stepMeta.CompleteParam) return false
    if (stepMeta.CompleteType() !== owner.CompleteTypes.FlowEvent) return false
    return owner.NormalizeOrderParam(stepMeta.CompleteParam()).indexOf('town_upgrade_flow_done') === 0
}

MergeTutorialBusinessAdapter.IsTownUpgradeFlowRunning = function(owner) {
    return !!(typeof Game !== 'undefined' &&
        Game.TownUpgradeFlow &&
        Game.TownUpgradeFlow.isRunning &&
        Game.TownUpgradeFlow.isRunning())
}

MergeTutorialBusinessAdapter.ShouldPersistLocalTriggerProgress = function(owner, triggerMeta, stepId) {
    if (!triggerMeta || !triggerMeta.Id) return false
    var stepMeta = owner.GetMeta ? owner.GetMeta(stepId) : null
    if (triggerMeta.Id() === owner.P4TriggerId &&
        owner.IsP4TransientFlowStep &&
        owner.IsP4TransientFlowStep(stepMeta)) {
        return false
    }
    return true
}

MergeTutorialBusinessAdapter.GetP4TriggerBuildTargetParam = function(owner, triggerMeta) {
    if (!triggerMeta || !triggerMeta.ConditionParam) return null
    var params = owner.ParseKeyValueParam(triggerMeta.ConditionParam())
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    if (!mapId || !buildId) return null
    return {
        mapId: mapId,
        buildId: buildId,
    }
}

MergeTutorialBusinessAdapter.GetP4TriggerBuildContext = function(owner, triggerMeta) {
    var target = owner.GetP4TriggerBuildTargetParam ? owner.GetP4TriggerBuildTargetParam(triggerMeta) : null
    if (!target || !owner.GetBuildActionContextByTarget) return null
    return owner.GetBuildActionContextByTarget(target)
}

MergeTutorialBusinessAdapter.IsP4BuildStateBoughtOrFull = function(owner, context) {
    var state = context && context.state ? String(context.state) : ''
    return state === 'bought' || state === 'full'
}

MergeTutorialBusinessAdapter.GetP4BuildBuyStepId = function(owner, triggerMeta) {
    return owner.FindTriggerStepIdByCompleteParam
        ? owner.FindTriggerStepIdByCompleteParam(triggerMeta, 'building_buy_button')
        : 0
}

MergeTutorialBusinessAdapter.IsP4StepAfterBuildBuyStep = function(owner, triggerMeta, stepMeta) {
    if (!triggerMeta || !stepMeta || !stepMeta.Id) return false
    var buyStepId = owner.GetP4BuildBuyStepId ? owner.GetP4BuildBuyStepId(triggerMeta) : 0
    if (!buyStepId || !owner.ResolveTriggerStepOrderIndex) return false
    var buyIndex = owner.ResolveTriggerStepOrderIndex(triggerMeta, buyStepId)
    var stepIndex = owner.ResolveTriggerStepOrderIndex(triggerMeta, stepMeta.Id())
    return buyIndex >= 0 && stepIndex > buyIndex
}

MergeTutorialBusinessAdapter.FindP4PostBuyMapBuildClickStepId = function(owner, triggerMeta) {
    if (!triggerMeta || !triggerMeta.FirstStepId) return 0
    var buyStepId = owner.GetP4BuildBuyStepId ? owner.GetP4BuildBuyStepId(triggerMeta) : 0
    if (!buyStepId) return 0

    var stepId = parseInt(triggerMeta.FirstStepId(), 10) || 0
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    var passedBuyStep = false
    var guard = 0
    while (stepId && guard++ < 100) {
        var meta = owner.GetMeta ? owner.GetMeta(stepId) : null
        if (!meta) break
        if (stepId === buyStepId) {
            passedBuyStep = true
        } else if (passedBuyStep && meta.CompleteType && meta.CompleteType() === owner.CompleteTypes.NodeClick) {
            var completeParam = owner.NormalizeOrderParam(meta.CompleteParam ? meta.CompleteParam() : '')
            if (owner.IsMapBuildTarget && owner.IsMapBuildTarget(completeParam)) return stepId
        }
        if (reportId && stepId === reportId) break
        stepId = parseInt(meta.NextId ? meta.NextId() : 0, 10) || 0
    }
    return 0
}

MergeTutorialBusinessAdapter.ResolveP4NextNonTransientStepId = function(owner, triggerMeta, stepMeta) {
    if (!triggerMeta || !stepMeta || !stepMeta.NextId) return 0
    var nextId = parseInt(stepMeta.NextId(), 10) || 0
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    var guard = 0
    while (nextId && guard++ < 100) {
        var nextMeta = owner.FindTriggerStepMetaInChain
            ? owner.FindTriggerStepMetaInChain(triggerMeta, nextId)
            : (owner.GetMeta ? owner.GetMeta(nextId) : null)
        if (!nextMeta) return nextId
        if (reportId && nextId === reportId) return nextId
        if (!owner.IsP4TransientFlowStep || !owner.IsP4TransientFlowStep(nextMeta)) return nextId
        nextId = parseInt(nextMeta.NextId ? nextMeta.NextId() : 0, 10) || 0
    }
    return 0
}

MergeTutorialBusinessAdapter.ResolveP4CompletedBuildBuyStepNextIdFromState = function(owner, triggerMeta, stepMeta) {
    if (!triggerMeta || !triggerMeta.Id || triggerMeta.Id() !== owner.P4TriggerId) return 0
    if (!stepMeta || !stepMeta.CompleteParam) return 0
    if (owner.IsTownUpgradeFlowRunning && owner.IsTownUpgradeFlowRunning()) return 0

    var completeParam = owner.NormalizeOrderParam(stepMeta.CompleteParam())
    if (completeParam !== 'building_buy_button') return 0

    var context = owner.GetP4TriggerBuildContext ? owner.GetP4TriggerBuildContext(triggerMeta) : null
    if (!owner.IsP4BuildStateBoughtOrFull || !owner.IsP4BuildStateBoughtOrFull(context)) return 0
    return owner.ResolveP4NextNonTransientStepId ? owner.ResolveP4NextNonTransientStepId(triggerMeta, stepMeta) : 0
}

MergeTutorialBusinessAdapter.ResolveP4SavedTriggerStepId = function(owner, triggerMeta, savedStepId) {
    savedStepId = parseInt(savedStepId, 10) || 0
    if (!triggerMeta || !triggerMeta.Id || triggerMeta.Id() !== owner.P4TriggerId || !savedStepId) return savedStepId

    var savedStepMeta = owner.FindTriggerStepMetaInChain ? owner.FindTriggerStepMetaInChain(triggerMeta, savedStepId) : null
    if (!savedStepMeta) return savedStepId

    var completedBuyNextId = owner.ResolveP4CompletedBuildBuyStepNextIdFromState
        ? owner.ResolveP4CompletedBuildBuyStepNextIdFromState(triggerMeta, savedStepMeta)
        : 0
    if (completedBuyNextId) {
        owner.LogP4Reconnect('resolve:completedBuyStepNext', {
            triggerId: triggerMeta.Id(),
            savedStepId: savedStepId,
            nextStepId: completedBuyNextId,
        })
        return completedBuyNextId
    }

    var shouldResolveFromState = false
    if (owner.CanResumeP4SavedStep && !owner.CanResumeP4SavedStep(triggerMeta, savedStepMeta)) {
        shouldResolveFromState = true
    }
    if (owner.IsP4TransientFlowStep &&
        owner.IsP4TransientFlowStep(savedStepMeta) &&
        !(owner.IsTownUpgradeFlowRunning && owner.IsTownUpgradeFlowRunning())) {
        var transientNextId = owner.ResolveP4TransientStepNextIdFromState
            ? owner.ResolveP4TransientStepNextIdFromState(triggerMeta, savedStepMeta)
            : 0
        if (transientNextId) {
            owner.LogP4Reconnect('resolve:transientStepNext', {
                triggerId: triggerMeta.Id(),
                savedStepId: savedStepId,
                nextStepId: transientNextId,
            })
            return transientNextId
        }
        shouldResolveFromState = true
    }
    if (!shouldResolveFromState) return savedStepId

    var stateStepId = owner.ResolveP4ReconnectStep ? owner.ResolveP4ReconnectStep(triggerMeta) : 0
    if (stateStepId) {
        owner.LogP4Reconnect('resolve:savedStepRedirect', {
            triggerId: triggerMeta.Id(),
            savedStepId: savedStepId,
            stateStepId: stateStepId,
        })
        return stateStepId
    }
    return savedStepId
}

MergeTutorialBusinessAdapter.ResolveP4TransientStepNextIdFromState = function(owner, triggerMeta, stepMeta) {
    if (!triggerMeta || !triggerMeta.Id || triggerMeta.Id() !== owner.P4TriggerId) return 0
    if (!owner.IsP4TransientFlowStep || !owner.IsP4TransientFlowStep(stepMeta)) return 0
    if (owner.IsTownUpgradeFlowRunning && owner.IsTownUpgradeFlowRunning()) return 0

    var target = owner.GetTriggerBuildTargetParam ? owner.GetTriggerBuildTargetParam(stepMeta) : null
    var context = owner.GetBuildActionContextByTarget ? owner.GetBuildActionContextByTarget(target) : null
    var state = context && context.state ? String(context.state) : ''
    if (state !== 'bought' && state !== 'full') return 0
    return parseInt(stepMeta.NextId ? stepMeta.NextId() : 0, 10) || 0
}

MergeTutorialBusinessAdapter.TryAdvanceP4TransientStepFromState = function(owner, stepMeta) {
    var nextId = owner.ResolveP4TransientStepNextIdFromState
        ? owner.ResolveP4TransientStepNextIdFromState(owner.activeTriggerMeta, stepMeta)
        : 0
    if (!nextId) return false
    owner.LogP4Reconnect('runtime:transientStepNext', {
        triggerId: owner.activeTriggerMeta && owner.activeTriggerMeta.Id ? owner.activeTriggerMeta.Id() : 0,
        stepId: stepMeta && stepMeta.Id ? stepMeta.Id() : 0,
        nextStepId: nextId,
    })
    owner.nextTriggerStep()
    return true
}

MergeTutorialBusinessAdapter.TryRedirectP4CompletedBuildBuyStepFromState = function(owner, stepMeta) {
    var nextId = owner.ResolveP4CompletedBuildBuyStepNextIdFromState
        ? owner.ResolveP4CompletedBuildBuyStepNextIdFromState(owner.activeTriggerMeta, stepMeta)
        : 0
    if (!nextId || nextId === owner.activeTriggerStepId) return false

    var fromStepId = stepMeta && stepMeta.Id ? stepMeta.Id() : owner.activeTriggerStepId
    owner.LogP4Reconnect('runtime:completedBuyStepNext', {
        triggerId: owner.activeTriggerMeta && owner.activeTriggerMeta.Id ? owner.activeTriggerMeta.Id() : 0,
        stepId: fromStepId,
        nextStepId: nextId,
    })
    owner.activeTriggerStepId = nextId
    if (owner.SaveLocalTriggerProgress && owner.activeTriggerMeta) {
        owner.SaveLocalTriggerProgress(owner.activeTriggerMeta, nextId)
    }
    if (owner.SetTriggerTutorialId && owner.activeTriggerMeta) {
        owner.SetTriggerTutorialId(owner.activeTriggerMeta, nextId)
    }
    owner.startTriggerStep()
    return true
}

MergeTutorialBusinessAdapter.ResolveP4ReconnectStep = function(owner, triggerMeta) {
    if (!triggerMeta || !triggerMeta.Id || triggerMeta.Id() !== owner.P4TriggerId) return 0
    if (owner.IsP4Completed && owner.IsP4Completed()) {
        owner.LogP4Reconnect('resolve:skip:completed', {
            triggerId: triggerMeta.Id(),
        })
        return 0
    }

    var firstStepId = parseInt(triggerMeta.FirstStepId ? triggerMeta.FirstStepId() : 0, 10) || 0
    var params = owner.ParseKeyValueParam(triggerMeta.ConditionParam ? triggerMeta.ConditionParam() : '')
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    var context = mapId && buildId && owner.GetBuildActionContextByTarget
        ? owner.GetBuildActionContextByTarget({ mapId: mapId, buildId: buildId })
        : null
    var firstStepConditionMatched = !!(owner.MatchTriggerCondition &&
        owner.MatchTriggerCondition(triggerMeta.ConditionType ? triggerMeta.ConditionType() : '', triggerMeta.ConditionParam ? triggerMeta.ConditionParam() : '', {}))
    var coinGateInfo = owner.GetBuildingCoinGateDebugInfo
        ? owner.GetBuildingCoinGateDebugInfo(triggerMeta.ConditionParam ? triggerMeta.ConditionParam() : '')
        : null

    owner.LogP4Reconnect('resolve:firstStepCheck', {
        triggerId: triggerMeta.Id(),
        firstStepId: firstStepId,
        conditionType: triggerMeta.ConditionType ? triggerMeta.ConditionType() : '',
        conditionParam: triggerMeta.ConditionParam ? triggerMeta.ConditionParam() : '',
        conditionMatched: firstStepConditionMatched,
        mapId: mapId,
        buildId: buildId,
        contextState: context && context.state ? String(context.state) : '',
        isVillageSceneActive: owner.IsVillageSceneActive ? owner.IsVillageSceneActive() : false,
        isMergeBoardSceneActive: owner.IsMergeBoardSceneActive ? owner.IsMergeBoardSceneActive() : false,
        coinGate: coinGateInfo,
    })

    if (context && context.state) {
        var state = String(context.state)
        if (state === 'unlockedNotBought') {
            if (!firstStepConditionMatched) {
                owner.LogP4Reconnect('resolve:firstStepBlocked:coinGate', {
                    triggerId: triggerMeta.Id(),
                    firstStepId: firstStepId,
                    coinGate: coinGateInfo,
                })
                return 0
            }
            if (owner.IsVillageSceneActive && owner.IsVillageSceneActive()) {
                var villageStepId = owner.FindTriggerStepIdByCompleteParam(triggerMeta, 'mapId=' + mapId + ';buildId=' + buildId) || firstStepId
                owner.LogP4Reconnect('resolve:firstStepVillageTarget', {
                    triggerId: triggerMeta.Id(),
                    stepId: villageStepId,
                })
                return villageStepId
            }
            owner.LogP4Reconnect('resolve:firstStepSlotTarget', {
                triggerId: triggerMeta.Id(),
                stepId: firstStepId,
            })
            return firstStepId
        }
        if (state === 'bought') {
            var boughtStepId = (owner.FindP4PostBuyMapBuildClickStepId ? owner.FindP4PostBuyMapBuildClickStepId(triggerMeta) : 0) ||
                owner.FindTriggerStepIdByCompleteParam(triggerMeta, 'building_upgrade_button') ||
                firstStepId
            owner.LogP4Reconnect('resolve:boughtTarget', {
                triggerId: triggerMeta.Id(),
                stepId: boughtStepId,
            })
            return boughtStepId
        }
        if (state === 'full') {
            var fullStepId = owner.FindTriggerStepIdByCompleteParam(triggerMeta, 'back_to_board_button') || 0
            owner.LogP4Reconnect('resolve:fullTarget', {
                triggerId: triggerMeta.Id(),
                stepId: fullStepId,
            })
            return fullStepId
        }
    }

    if (firstStepConditionMatched) {
        owner.LogP4Reconnect('resolve:firstStepNoContextTarget', {
            triggerId: triggerMeta.Id(),
            stepId: firstStepId,
        })
        return firstStepId
    }
    owner.LogP4Reconnect('resolve:noStep', {
        triggerId: triggerMeta.Id(),
        firstStepId: firstStepId,
        coinGate: coinGateInfo,
    })
    return 0
}

MergeTutorialBusinessAdapter.CanResumeP5GeneratorSavedStep = function(owner, triggerMeta, savedStepMeta) {
    if (!triggerMeta || !triggerMeta.Id || triggerMeta.Id() !== owner.P5GeneratorTriggerId) return true
    if (owner.HasPendingP5GeneratorReward && owner.HasPendingP5GeneratorReward()) return true
    if (owner.IsP5GeneratorMergeDragStep &&
        owner.IsP5GeneratorMergeDragStep(savedStepMeta) &&
        owner.EnsureGeneratorGuideDragCells &&
        owner.EnsureGeneratorGuideDragCells(owner.P5GeneratorMergeId)) {
        return true
    }
    return false
}

MergeTutorialBusinessAdapter.HasSavedP5GeneratorProgress = function(owner) {
    var triggerMeta = owner.GetTriggerMeta ? owner.GetTriggerMeta(owner.P5GeneratorTriggerId) : null
    if (!triggerMeta) return false
    var savedStepId = owner.GetSavedTriggerStepId ? owner.GetSavedTriggerStepId(triggerMeta) : 0
    if (!savedStepId) return false
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    if (reportId && savedStepId >= reportId) return false
    return !!(owner.FindTriggerStepMetaInChain && owner.FindTriggerStepMetaInChain(triggerMeta, savedStepId))
}

MergeTutorialBusinessAdapter.ShouldRestoreP5PendingRewardFromSavedProgress = function(owner) {
    if (!owner.HasSavedP5GeneratorProgress || !owner.HasSavedP5GeneratorProgress()) return false
    return !!(owner.HasPendingP5GeneratorReward && owner.HasPendingP5GeneratorReward())
}

MergeTutorialBusinessAdapter.IsP5GeneratorStepAfterBackToBoard = function(owner, stepMeta) {
    if (!stepMeta || !stepMeta.Id) return false
    if (!owner.activeTriggerMeta ||
        !owner.activeTriggerMeta.Id ||
        owner.activeTriggerMeta.Id() !== owner.P5GeneratorTriggerId) return false
    var stepId = parseInt(stepMeta.Id(), 10) || 0
    var firstStepId = parseInt(owner.activeTriggerMeta.FirstStepId ? owner.activeTriggerMeta.FirstStepId() : 0, 10) || 0
    var reportId = parseInt(owner.activeTriggerMeta.CompletionReportId ? owner.activeTriggerMeta.CompletionReportId() : 0, 10) || 0
    if (!stepId || stepId === firstStepId) return false
    if (reportId && stepId >= reportId) return false
    return true
}

MergeTutorialBusinessAdapter.EnsureP5GeneratorBoardReadyForStep = function(owner, stepMeta) {
    if (!owner.IsP5GeneratorStepAfterBackToBoard(stepMeta)) return true
    if (owner.IsP5GeneratorMergeDragStep &&
        owner.IsP5GeneratorMergeDragStep(stepMeta) &&
        owner.EnsureGeneratorGuideDragCells &&
        owner.EnsureGeneratorGuideDragCells(owner.P5GeneratorMergeId)) {
        return true
    }
    if (owner.CheckGeneratorMergeReady(owner.P5GeneratorMergeId, { source: 'p5_step_context' })) return true
    owner.CloseTutorialWindow()
    owner.ScheduleTriggerStepContextRetry()
    return false
}

MergeTutorialBusinessAdapter.CanStartP5GeneratorBoardFallback = function(owner) {
    var triggerMeta = owner.GetTriggerMeta ? owner.GetTriggerMeta(owner.P5GeneratorTriggerId) : null
    if (!triggerMeta) return false
    if (owner.activeTriggerMeta || (owner.IsTriggerQueued && owner.IsTriggerQueued(owner.P5GeneratorTriggerId))) return false
    if (owner.IsP5GeneratorCompleted && owner.IsP5GeneratorCompleted()) return false
    if (owner.GetSavedTriggerStepId && owner.GetSavedTriggerStepId(triggerMeta)) return false
    if (owner.IsFinished && !owner.IsFinished()) return false
    var p4Trigger = owner.GetTriggerMeta ? owner.GetTriggerMeta(owner.P4TriggerId) : null
    if (p4Trigger && owner.IsP4Completed && !owner.IsP4Completed()) return false
    if (!owner.IsMergeBoardSceneActive || !owner.IsMergeBoardSceneActive()) return false
    if (!owner.HasPendingP5GeneratorReward || !owner.HasPendingP5GeneratorReward()) return false
    return owner.CheckGeneratorMergeReady(owner.P5GeneratorMergeId, { source: 'board_fallback' })
}

MergeTutorialBusinessAdapter.StartP5GeneratorGuideFromBoardFallback = function(owner) {
    var canStart = owner.CanStartP5GeneratorBoardFallback
        ? owner.CanStartP5GeneratorBoardFallback()
        : MergeTutorialBusinessAdapter.CanStartP5GeneratorBoardFallback(owner)
    if (!canStart) return false
    var triggerMeta = owner.GetTriggerMeta ? owner.GetTriggerMeta(owner.P5GeneratorTriggerId) : null
    if (!triggerMeta) return false
    var animationStepId = parseInt(triggerMeta.FirstStepId ? triggerMeta.FirstStepId() : 0, 10) + 10
    if (!owner.GetMeta || !owner.GetMeta(animationStepId)) return false
    if (!owner.EnqueueTriggerAtStep(triggerMeta, animationStepId, true)) return false
    owner.TryStartNextTrigger()
    return true
}

MergeTutorialBusinessAdapter.GetTriggerBuildTargetParam = function(owner, stepMeta) {
    var params: Record<string, any> = {}
    if (stepMeta && stepMeta.CompleteParam) {
        params = owner.ParseKeyValueParam(stepMeta.CompleteParam())
    }
    if ((!params.mapId && !params.mapID && !params.map_id) ||
        (!params.buildId && !params.buildID && !params.build_id)) {
        var triggerParams: Record<string, any> = owner.activeTriggerMeta && owner.activeTriggerMeta.ConditionParam
            ? owner.ParseKeyValueParam(owner.activeTriggerMeta.ConditionParam())
            : {}
        if (!params.mapId && !params.mapID && !params.map_id) {
            params.mapId = triggerParams.mapId || triggerParams.mapID || triggerParams.map_id
        }
        if (!params.buildId && !params.buildID && !params.build_id) {
            params.buildId = triggerParams.buildId || triggerParams.buildID || triggerParams.build_id
        }
    }
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    if (!mapId || !buildId) return null
    return {
        mapId: mapId,
        buildId: buildId,
    }
}

MergeTutorialBusinessAdapter.IsTriggerBuildWindowStep = function(owner, stepMeta) {
    if (!stepMeta || !stepMeta.CompleteType || stepMeta.CompleteType() !== owner.CompleteTypes.NodeClick) return false
    var completeParam = owner.NormalizeOrderParam(stepMeta.CompleteParam ? stepMeta.CompleteParam() : '')
    return completeParam === 'building_buy_button' || completeParam === 'building_upgrade_button'
}

MergeTutorialBusinessAdapter.GetBuildActionContextByTarget = function(owner, target) {
    if (!target || !target.mapId || !target.buildId ||
        typeof Game === 'undefined' || !Game.SUserMap || !Game.SUserMap.GetBuildActionContext) {
        return null
    }
    var sid = target.mapId + '_' + target.buildId
    return Game.SUserMap.GetBuildActionContext(sid)
}

MergeTutorialBusinessAdapter.OpenTriggerBuildWindow = function(owner, stepMeta, target, context) {
    if (!target || !context || !context.windowName ||
        typeof UIRoot === 'undefined' || !UIRoot.instance || !UIRoot.instance.openChildWindow) {
        return false
    }
    var stepId = stepMeta && stepMeta.Id ? stepMeta.Id() : 0
    if (owner.openingTriggerBuildWindowStepId === stepId) return false
    owner.openingTriggerBuildWindowStepId = stepId

    var openWindow = function(mNode) {
        UIRoot.instance.openChildWindow(context.windowName, {
            meta: context.meta,
            mapData: context.element,
            mNode: mNode || null,
            buildID: target.buildId,
            showCallback: function() {
                owner.openingTriggerBuildWindowStepId = 0
                if (owner.activeTriggerStepId === stepId && owner.startTriggerStep) {
                    owner.startTriggerStep()
                }
            },
        })
    }

    var mapNode = owner.GetMapNode ? owner.GetMapNode() : null
    if (mapNode && mapNode.getOrCreateBuildNode) {
        mapNode.getOrCreateBuildNode(target.buildId, function(node) {
            openWindow(node)
        })
        return true
    }
    openWindow(null)
    return true
}

MergeTutorialBusinessAdapter.EnsureTriggerBuildWindow = function(owner, stepMeta) {
    var isBuildWindowStep = owner.IsTriggerBuildWindowStep
        ? owner.IsTriggerBuildWindowStep(stepMeta)
        : MergeTutorialBusinessAdapter.IsTriggerBuildWindowStep(owner, stepMeta)
    if (!isBuildWindowStep) return true
    var target = owner.GetTriggerBuildTargetParam
        ? owner.GetTriggerBuildTargetParam(stepMeta)
        : MergeTutorialBusinessAdapter.GetTriggerBuildTargetParam(owner, stepMeta)
    var context = owner.GetBuildActionContextByTarget
        ? owner.GetBuildActionContextByTarget(target)
        : MergeTutorialBusinessAdapter.GetBuildActionContextByTarget(owner, target)
    if (!context || !context.windowName) {
        return true
    }

    var rawWindow = owner.GetRawWindowInstance ? owner.GetRawWindowInstance(context.windowName) : null
    var existing = (owner.GetWindowInstance ? owner.GetWindowInstance(context.windowName) : null) ||
        (rawWindow && !rawWindow.isFake ? rawWindow : null)
    if (existing) {
        return true
    }
    if (rawWindow && rawWindow.isFake) {
        if (owner.CloseTutorialWindow) owner.CloseTutorialWindow()
        if (owner.ScheduleTriggerStepContextRetry) owner.ScheduleTriggerStepContextRetry()
        return false
    }
    if (owner.CloseTutorialWindow) owner.CloseTutorialWindow()
    if (owner.OpenTriggerBuildWindow) {
        owner.OpenTriggerBuildWindow(stepMeta, target, context)
    } else {
        MergeTutorialBusinessAdapter.OpenTriggerBuildWindow(owner, stepMeta, target, context)
    }
    return false
}

MergeTutorialBusinessAdapter.TryEmitPendingRewardReady = function(owner, mergeId, extraPayload) {
    mergeId = String(mergeId || owner.GetLastPendingRewardMergeId())
    if (!mergeId || !owner.EmitTrigger) {
        owner.DebugGeneratorGuideLog('TryEmitPendingRewardReady:false:notReady', {
            mergeId: mergeId,
            hasEmitTrigger: !!owner.EmitTrigger,
        })
        return false
    }
    var payload = {
        mergeId: mergeId,
        itemId: mergeId,
        rewardMergeId: mergeId,
        triggerParam: mergeId,
    }
    extraPayload = extraPayload || {}
    for (var key in extraPayload) {
        if (!Object.prototype.hasOwnProperty.call(extraPayload, key)) continue
        payload[key] = extraPayload[key]
    }
    var matchedCount = owner.EmitTrigger('pending_reward_ready', payload) || 0
    owner.DebugGeneratorGuideLog('TryEmitPendingRewardReady:emitResult', {
        mergeId: mergeId,
        matchedCount: matchedCount,
        queued: owner.IsTriggerQueued ? owner.IsTriggerQueued(owner.P5GeneratorTriggerId) : false,
        triggerQueueLength: owner.triggerQueue ? owner.triggerQueue.length : 0,
    })
    if (matchedCount > 0 || owner.IsTriggerQueued(owner.P5GeneratorTriggerId)) return true
    return false
}

MergeTutorialBusinessAdapter.HasPendingLevelRewardDataForP5 = function(owner) {
    try {
        if (typeof GameKit === 'undefined' || !GameKit.DataCache || !GameKit.DataCache.GetData) return false
        var rewards = GameKit.DataCache.GetData('LevelUPGetReward')
        if (Array.isArray(rewards)) return rewards.length > 0
        return !!rewards
    } catch (e) {
        return false
    }
}

MergeTutorialBusinessAdapter.IsLevelRewardWindowOpenOrLoadingForP5 = function(owner) {
    var windowNames = ['LevelUpGetRewardWindow', 'GetRewardWindow']
    for (var i = 0; i < windowNames.length; i++) {
        try {
            if (owner.IsWindowOpenOrLoading && owner.IsWindowOpenOrLoading(windowNames[i])) return true
        } catch (e) {}
    }
    return false
}

MergeTutorialBusinessAdapter.IsP5OnlineRewardFlowActive = function(owner) {
    if (owner.levelRewardClaimClickedForP5) return true
    if (owner.HasPendingLevelRewardDataForP5 && owner.HasPendingLevelRewardDataForP5()) return true
    if (owner.IsLevelRewardWindowOpenOrLoadingForP5 && owner.IsLevelRewardWindowOpenOrLoadingForP5()) return true
    return false
}

MergeTutorialBusinessAdapter.ShouldAcceptPendingRewardReadyUpdateForP5 = function(owner, mergeId) {
    if (String(mergeId || '') !== String(owner.P5GeneratorMergeId)) return true
    if (owner.ShouldRestoreP5PendingRewardFromSavedProgress &&
        owner.ShouldRestoreP5PendingRewardFromSavedProgress()) return true
    return !!(owner.IsP5OnlineRewardFlowActive && owner.IsP5OnlineRewardFlowActive())
}

MergeTutorialBusinessAdapter.ShouldDelayPendingRewardReadyForP5 = function(owner, mergeId) {
    if (String(mergeId || '') !== String(owner.P5GeneratorMergeId)) return false
    if (owner.ShouldRestoreP5PendingRewardFromSavedProgress &&
        owner.ShouldRestoreP5PendingRewardFromSavedProgress()) return false
    if (owner.levelRewardClaimClickedForP5) return false
    return true
}

MergeTutorialBusinessAdapter.OnLevelRewardButtonClickedForP5 = function(owner, payload) {
    if (!owner.IsLevelRewardWindowOpenOrLoadingForP5()) return false
    owner.levelRewardClaimClickedForP5 = true
    var mergeId = String(owner.P5GeneratorMergeId)
    if (owner.HasPendingP5GeneratorReward && owner.HasPendingP5GeneratorReward()) {
        owner.pendingRewardReadyMergeIds = owner.pendingRewardReadyMergeIds || {}
        owner.pendingRewardReadyMergeIds[mergeId] = true
    }
    var flowId = payload && payload.townUpgradeFlowId
    var townFlow = typeof Game !== 'undefined' ? Game.TownUpgradeFlow : null
    if (flowId != null && townFlow && townFlow.getActiveFlowId &&
        townFlow.getActiveFlowId() === flowId && townFlow.markP5Eligible) {
        if (!townFlow.markP5Eligible(flowId)) return false
        owner.townUpgradeP5PendingFlowId = flowId
        owner.DebugGeneratorGuideLog('OnLevelRewardButtonClickedForP5:deferTownUpgrade', {
            flowId: flowId,
            mergeId: mergeId,
        })
        return true
    }
    return owner.TryConsumePendingRewardReadyNotifications({ source: 'level_reward_claim' })
}

MergeTutorialBusinessAdapter.ReleaseTownUpgradeP5 = function(owner, flowId) {
    if (flowId == null || owner.townUpgradeP5PendingFlowId !== flowId) return false
    owner.townUpgradeP5PendingFlowId = null
    owner.DebugGeneratorGuideLog('ReleaseTownUpgradeP5', { flowId: flowId })
    return owner.TryConsumePendingRewardReadyNotifications({
        source: 'town_upgrade_presentation_done',
        townUpgradeFlowId: flowId,
    })
}

MergeTutorialBusinessAdapter.NotifyPendingRewardsUpdated = function(owner, nextRewards, prevRewards) {
    var mergeId = String(owner.P5GeneratorMergeId)
    var prevCount = owner.CountPendingRewardMergeId(prevRewards, mergeId)
    var nextCount = owner.CountPendingRewardMergeId(nextRewards, mergeId)
    owner.DebugGeneratorGuideLog('NotifyPendingRewardsUpdated', {
        mergeId: mergeId,
        prevCount: prevCount,
        nextCount: nextCount,
        lastPendingMergeId: owner.GetLastPendingRewardMergeId ? owner.GetLastPendingRewardMergeId() : '',
        nextRewards: nextRewards,
        prevRewards: prevRewards,
    })
    if (nextCount <= prevCount) {
        owner.DebugGeneratorGuideLog('NotifyPendingRewardsUpdated:false:notIncreased', {
            mergeId: mergeId,
            prevCount: prevCount,
            nextCount: nextCount,
        })
        return false
    }
    if (owner.ShouldAcceptPendingRewardReadyUpdateForP5 &&
        !owner.ShouldAcceptPendingRewardReadyUpdateForP5(mergeId)) {
        owner.DebugGeneratorGuideLog('NotifyPendingRewardsUpdated:false:coldBootPendingReward', {
            mergeId: mergeId,
            hasPendingLevelRewardData: owner.HasPendingLevelRewardDataForP5(),
            isLevelRewardWindowOpen: owner.IsLevelRewardWindowOpenOrLoadingForP5(),
            hasSavedP5GeneratorProgress: owner.HasSavedP5GeneratorProgress ? owner.HasSavedP5GeneratorProgress() : false,
        })
        return false
    }
    owner.pendingRewardReadyMergeIds = owner.pendingRewardReadyMergeIds || {}
    owner.pendingRewardReadyMergeIds[mergeId] = true
    if (owner.ShouldDelayPendingRewardReadyForP5(mergeId)) {
        owner.DebugGeneratorGuideLog('NotifyPendingRewardsUpdated:false:waitLevelRewardClaim', {
            mergeId: mergeId,
            hasPendingLevelRewardData: owner.HasPendingLevelRewardDataForP5(),
            isLevelRewardWindowOpen: owner.IsLevelRewardWindowOpenOrLoadingForP5(),
        })
        return false
    }
    var consumed = owner.TryConsumePendingRewardReadyNotification(mergeId)
    owner.DebugGeneratorGuideLog('NotifyPendingRewardsUpdated:consumeResult', {
        mergeId: mergeId,
        consumed: consumed,
        pendingRewardReadyMergeIds: owner.pendingRewardReadyMergeIds,
    })
    return consumed
}

MergeTutorialBusinessAdapter.TryConsumePendingRewardReadyNotification = function(owner, mergeId, emitPayload) {
    mergeId = String(mergeId || owner.P5GeneratorMergeId)
    if (!owner.pendingRewardReadyMergeIds || !owner.pendingRewardReadyMergeIds[mergeId]) {
        owner.DebugGeneratorGuideLog('TryConsumePendingRewardReadyNotification:false:noPendingFlag', {
            mergeId: mergeId,
            pendingRewardReadyMergeIds: owner.pendingRewardReadyMergeIds,
        })
        return false
    }
    if (owner.IsP5GeneratorCompleted && owner.IsP5GeneratorCompleted()) {
        owner.DebugGeneratorGuideLog('TryConsumePendingRewardReadyNotification:false:completed', {
            mergeId: mergeId,
        })
        delete owner.pendingRewardReadyMergeIds[mergeId]
        return false
    }
    if (owner.ShouldDelayPendingRewardReadyForP5(mergeId)) {
        owner.DebugGeneratorGuideLog('TryConsumePendingRewardReadyNotification:false:waitLevelRewardClaim', {
            mergeId: mergeId,
            hasPendingLevelRewardData: owner.HasPendingLevelRewardDataForP5(),
            isLevelRewardWindowOpen: owner.IsLevelRewardWindowOpenOrLoadingForP5(),
        })
        return false
    }
    if (!owner.TryEmitPendingRewardReady(mergeId, emitPayload)) {
        owner.DebugGeneratorGuideLog('TryConsumePendingRewardReadyNotification:false:emitFailed', {
            mergeId: mergeId,
            pendingRewardReadyMergeIds: owner.pendingRewardReadyMergeIds,
        })
        return false
    }
    delete owner.pendingRewardReadyMergeIds[mergeId]
    if (String(mergeId) === String(owner.P5GeneratorMergeId)) {
        owner.levelRewardClaimClickedForP5 = false
    }
    owner.DebugGeneratorGuideLog('TryConsumePendingRewardReadyNotification:true', {
        mergeId: mergeId,
    })
    return true
}

MergeTutorialBusinessAdapter.TryConsumePendingRewardReadyNotifications = function(owner, emitPayload) {
    owner.pendingRewardReadyMergeIds = owner.pendingRewardReadyMergeIds || {}
    var p5MergeId = String(owner.P5GeneratorMergeId)
    if (owner.HasPendingP5GeneratorReward &&
        owner.HasPendingP5GeneratorReward() &&
        !owner.pendingRewardReadyMergeIds[p5MergeId] &&
        owner.ShouldRestoreP5PendingRewardFromSavedProgress &&
        owner.ShouldRestoreP5PendingRewardFromSavedProgress() &&
        !(owner.IsP5GeneratorCompleted && owner.IsP5GeneratorCompleted()) &&
        !(owner.IsTriggerQueued && owner.IsTriggerQueued(owner.P5GeneratorTriggerId))) {
        owner.pendingRewardReadyMergeIds[p5MergeId] = true
        owner.DebugGeneratorGuideLog('TryConsumePendingRewardReadyNotifications:restoreP5Flag', {
            mergeId: p5MergeId,
        })
    }
    var consumed = false
    for (var mergeId in owner.pendingRewardReadyMergeIds) {
        if (!Object.prototype.hasOwnProperty.call(owner.pendingRewardReadyMergeIds, mergeId)) continue
        consumed = owner.TryConsumePendingRewardReadyNotification(mergeId, emitPayload) || consumed
    }
    return consumed
}

export default MergeTutorialBusinessAdapter