import '../../LegacyGlobals';
import { Camera, find, UITransform, Vec2, Vec3, view } from 'cc';
import LocalMergeTutorialTestData from './LocalMergeTutorialTestData';


const MergeTutorialManager: any = {
}

function getNodeContentSize(node: any) {
    var transform = node && node.getComponent ? node.getComponent(UITransform) : null
    if (transform) return transform.contentSize
    return { width: node && node.width ? node.width : 100, height: node && node.height ? node.height : 100 }
}

MergeTutorialManager.finish_report_id = 1000130
MergeTutorialManager.MainTutorialGroupId = 100
MergeTutorialManager.StartId = 1000010
MergeTutorialManager.currentId = 0
MergeTutorialManager.currentMeta = null
MergeTutorialManager.currentGuideMeta = null
MergeTutorialManager.mainWindow = null
MergeTutorialManager.finishCallback = null
MergeTutorialManager.isReportingFinish = false
MergeTutorialManager.allowTutorialFinalSave = false
MergeTutorialManager.finishRetryTimer = null
MergeTutorialManager.finishRetryDelay = 2000
MergeTutorialManager.normalOrderDataBackup = null
MergeTutorialManager.hasNormalOrderBackup = false
MergeTutorialManager.ordersHiddenForTutorial = false
MergeTutorialManager.generatorClickProgress = {}
MergeTutorialManager.currentDragStartTile = ''
MergeTutorialManager.triggerQueue = []
MergeTutorialManager.activeTriggerMeta = null
MergeTutorialManager.activeTriggerStepId = 0
MergeTutorialManager.activeTriggerStepMeta = null
MergeTutorialManager.activeTriggerGuideMeta = null
MergeTutorialManager.activeTriggerBlockMode = ''
MergeTutorialManager.pendingTriggerReports = []
MergeTutorialManager.isReportingTrigger = false
MergeTutorialManager.triggerReportRetryTimer = null
MergeTutorialManager.triggerReportRetryDelay = 3000
MergeTutorialManager.completedTriggerReports = {}
MergeTutorialManager.EnableDynamicDragCircleHighlight = false
MergeTutorialManager.MergeDragGuidePreset = {
    baseSize: 150,
    sizeFactor: 0.6,
    minSize: 150,
    maxSize: 320,
    tweenDuration: 0.25,
}
MergeTutorialManager.CompleteTypes = {
    FullscreenClick: 'fullscreen_click',
    MergeDrag: 'merge_drag',
    GeneratorClick: 'generator_click',
    Auto: 'auto',
    TutorialOrderSubmit: 'tutorial_order_submit',
    NodeClick: 'node_click',
    DragToBackpack: 'drag_to_backpack',
    None: 'none',
}
MergeTutorialManager.EventTypes = {
    BackMap: 'back_map',
    Sell: 'sell',
    MergeDragStart: 'merge_drag_start',
    MergeDrag: 'merge_drag',
    GeneratorClick: 'generator_click',
    TutorialOrderSubmit: 'tutorial_order_submit',
    FullscreenClick: 'fullscreen_click',
    NodeClick: 'node_click',
    DragToBackpack: 'drag_to_backpack',
}
MergeTutorialManager.TriggerBlockModes = {
    None: 'none',
    Soft: 'soft',
    Force: 'force',
}

MergeTutorialManager.Clear = function() {
    this.currentId = 0
    this.currentMeta = null
    this.currentGuideMeta = null
    this.mainWindow = null
    this.finishCallback = null
    this.isReportingFinish = false
    this.allowTutorialFinalSave = false
    if (this.finishRetryTimer) {
        clearTimeout(this.finishRetryTimer)
        this.finishRetryTimer = null
    }
    this.normalOrderDataBackup = null
    this.hasNormalOrderBackup = false
    this.ordersHiddenForTutorial = false
    this.generatorClickProgress = {}
    this.currentDragStartTile = ''
    this.triggerQueue = []
    this.activeTriggerMeta = null
    this.activeTriggerStepId = 0
    this.activeTriggerStepMeta = null
    this.activeTriggerGuideMeta = null
    this.activeTriggerBlockMode = ''
    this.pendingTriggerReports = []
    this.isReportingTrigger = false
    if (this.triggerReportRetryTimer) {
        clearTimeout(this.triggerReportRetryTimer)
        this.triggerReportRetryTimer = null
    }
    this.completedTriggerReports = {}
}

MergeTutorialManager.GetCurrentId = function() {
    return this.currentId || this.StartId
}

MergeTutorialManager.GetMeta = function(metaId) {
    return Meta.MetaManager.GetMeta(Meta.MetaType.MergeTutorial, metaId)
}

MergeTutorialManager.GetGuideMeta = function(guideId) {
    if (!guideId) return null
    return Meta.MetaManager.GetMeta(Meta.MetaType.MergeTutorialGuide, guideId)
}

MergeTutorialManager.GetTriggerMeta = function(triggerId) {
    if (!triggerId) return null
    return Meta.MetaManager.GetMeta(Meta.MetaType.MergeTutorialTrigger, triggerId)
}

MergeTutorialManager.GetTriggerMetas = function() {
    return Meta.MetaManager.GetMetas(Meta.MetaType.MergeTutorialTrigger) || {}
}

MergeTutorialManager.IsFinished = function() {
    return true
    if (!Game.SUserMergeTutorial || !Game.SUserMergeTutorial.TutorialId) return false
    var cid = Game.SUserMergeTutorial.TutorialId(this.MainTutorialGroupId)
    if (!cid) return false
    var cmeta = this.GetMeta(cid)
    return !!(cmeta && cmeta.IsEnd && cmeta.IsEnd())
}

MergeTutorialManager.IsRunning = function() {
    return !this.IsFinished() && !!this.currentMeta
}

MergeTutorialManager.ShouldBlockMergeSave = function() {
    return !this.IsFinished() && !this.allowTutorialFinalSave
}

MergeTutorialManager.ClearPendingMergeSaveOps = function() {
    if (SR && SR.SRMerge) {
        SR.SRMerge.ops = []
    }
}

MergeTutorialManager.SetFinishCallback = function(cb) {
    this.finishCallback = cb
}

MergeTutorialManager.SaveServerStep = function(stepId) {
}

MergeTutorialManager.GetWindowInstance = function(windowName) {
    if (!UIRoot || !UIRoot.instance || !UIRoot.instance.GetWindow) return null
    var wnd = UIRoot.instance.GetWindow(windowName)
    if (!wnd || wnd.isFake) return null
    return wnd
}

MergeTutorialManager.IsNodeActive = function(node) {
    return !!(node && node.active !== false && node.activeInHierarchy !== false)
}

MergeTutorialManager.FindNodeByName = function(root, nodeName) {
    if (!root || !nodeName) return null
    if (root.name === nodeName) return root
    var children = root.children || root._children || []
    for (var i = 0; i < children.length; i++) {
        var found = this.FindNodeByName(children[i], nodeName)
        if (found) return found
    }
    return null
}

MergeTutorialManager.FindActiveNodeByName = function(root, nodeName) {
    if (!root || !nodeName) return null
    if (root.name === nodeName && this.IsNodeActive(root)) return root
    var children = root.children || root._children || []
    for (var i = 0; i < children.length; i++) {
        var found = this.FindActiveNodeByName(children[i], nodeName)
        if (found) return found
    }
    return null
}

MergeTutorialManager.FindActiveNodeByNames = function(root, names) {
    if (!root || !names) return null
    for (var i = 0; i < names.length; i++) {
        var node = this.FindActiveNodeByName(root, names[i])
        if (node) return node
    }
    return null
}

MergeTutorialManager.GetNodeByPath = function(root, path) {
    if (!root || !path) return null
    var node = root
    var parts = String(path).split(/[/.>]/).map(x => x.trim()).filter(Boolean)
    for (var i = 0; i < parts.length; i++) {
        if (!node.getChildByName) return null
        node = node.getChildByName(parts[i])
        if (!node) return null
    }
    return node
}

MergeTutorialManager.GetNodeFromObjectPath = function(root, path) {
    if (!root || !path) return null
    var obj = root
    var parts = String(path).split('.').map(x => x.trim()).filter(Boolean)
    for (var i = 0; i < parts.length; i++) {
        if (!obj) return null
        obj = obj[parts[i]]
    }
    if (obj && obj.node) return obj.node
    return obj
}

MergeTutorialManager.ResolveGuideTargetNode = function(targetKey) {
    targetKey = this.NormalizeOrderParam(targetKey)
    if (!targetKey) return null

    if (targetKey === 'shop_entry') {
        var mainWnd = this.GetWindowInstance('GameMainWindow')
        if (mainWnd) {
            if (this.IsNodeActive(mainWnd.btnAdSpin)) return mainWnd.btnAdSpin
            if (mainWnd.userinfo && mainWnd.userinfo.btnCoinAdd && this.IsNodeActive(mainWnd.userinfo.btnCoinAdd.node)) {
                return mainWnd.userinfo.btnCoinAdd.node
            }
        }
        return null
    }

    if (targetKey === 'item_shop_button') {
        var shopWnd = this.GetWindowInstance('ShopWindow')
        if (!shopWnd) return null
        if (shopWnd.treatPageNode) {
            var treatButton = this.FindActiveNodeByNames(shopWnd.treatPageNode, ['buttonEnabled', 'item'])
            if (treatButton) return treatButton
            if (this.IsNodeActive(shopWnd.treatPageNode)) return shopWnd.treatPageNode
        }
        if (shopWnd.coinPageNode) {
            var coinButton = this.FindActiveNodeByNames(shopWnd.coinPageNode, ['buttonEnabled', 'coinItem'])
            if (coinButton) return coinButton
            if (this.IsNodeActive(shopWnd.coinPageNode)) return shopWnd.coinPageNode
        }
        return shopWnd.node
    }

    if (targetKey === 'map_button' || targetKey === 'town_button') {
        var mergeUI = this.GetMergeUI ? this.GetMergeUI() : null
        if (!mergeUI) return null
        if (mergeUI.bottomUI && mergeUI.bottomUI.getChildByName) {
            var buildButton = mergeUI.bottomUI.getChildByName('build_btn')
            if (this.IsNodeActive(buildButton)) return buildButton
        }
        var mapButton = this.FindActiveNodeByNames(mergeUI.node, ['map_button', 'btn_map', 'Button - Map', 'Button - Village', 'btn_village'])
        if (mapButton) return mapButton
        return mergeUI.topUI || mergeUI.bottomUI || mergeUI.node
    }

    if (targetKey === 'back_to_board_button') {
        var gameMainWnd = this.GetWindowInstance('GameMainWindow')
        if (!gameMainWnd) return null
        var mergeButton = this.GetNodeByPath(gameMainWnd.node, 'town/merge')
        if (this.IsNodeActive(mergeButton)) return mergeButton
        var backToBoardNode = this.FindActiveNodeByNames(gameMainWnd.node, ['btn_slot', 'slot_btn', 'btn_merge', 'merge_btn', 'Button - Slot', 'Button - Merge'])
        if (backToBoardNode) return backToBoardNode
        if (this.IsNodeActive(gameMainWnd.spSlots)) return gameMainWnd.spSlots
        return gameMainWnd.node
    }

    if (targetKey === 'backpack_button') {
        var mergeUIForStore = this.GetMergeUI ? this.GetMergeUI() : null
        if (!mergeUIForStore) return null
        if (this.IsNodeActive(mergeUIForStore.storeButton)) return mergeUIForStore.storeButton
        return this.FindActiveNodeByNames(mergeUIForStore.node, ['storeButton', 'store_button', 'backpack_button', 'btn_store', 'btn_backpack'])
    }

    if (targetKey === 'backpack_close_button') {
        var storeWnd = this.GetWindowInstance('StoreWindow')
        if (!storeWnd || !storeWnd.node) return null
        return this.FindActiveNodeByNames(storeWnd.node, ['btn_close', 'closeBtn', 'Close', 'Button - Close', 'btnClose'])
    }

    if (targetKey === 'highest_normal') {
        var highestItem = this.GetHighestLvNormalMergeItem()
        return highestItem ? highestItem.node : null
    }

    if (targetKey.indexOf('mapId=') >= 0 && targetKey.indexOf('buildId=') >= 0) {
        var mapTarget = this.ParseKeyValueParam(targetKey)
        return this.GetMapBuildNode(mapTarget.mapId, mapTarget.buildId)
    }

    if (targetKey === 'building_upgrade_button') {
        var buildWindows = ['MapBuyBuildWindow', 'MapBuildUpgradeWindow', 'MapBuildStageUpgradeWindow', 'MapElementWindow']
        for (var i = 0; i < buildWindows.length; i++) {
            var mapElementWnd = this.GetWindowInstance(buildWindows[i])
            if (!mapElementWnd) continue
            if (mapElementWnd.btnLevelUp && mapElementWnd.btnLevelUp.node) return mapElementWnd.btnLevelUp.node
            return this.FindActiveNodeByNames(mapElementWnd.node, ['btn_lv', 'btn_ build', 'Button - OK'])
        }
        return null
    }

    if (targetKey === 'level_reward_button') {
        var storyWnd = this.GetWindowInstance('StoryWindow')
        if (storyWnd) {
            var storyBtn = this.FindActiveNodeByNames(storyWnd.node, ['btn_1', 'Button - OK'])
            if (storyBtn) return storyBtn
        }
        var levelRewardWnd = this.GetWindowInstance('LevelUpGetRewardWindow')
        if (levelRewardWnd) {
            var levelRewardBtn = this.FindActiveNodeByNames(levelRewardWnd.node, ['Button - OK', 'btn_1'])
            if (levelRewardBtn) return levelRewardBtn
        }
        var rewardWnd = this.GetWindowInstance('GetRewardWindow')
        if (rewardWnd) {
            var rewardBtn = this.FindActiveNodeByNames(rewardWnd.node, ['Button - OK', 'btn_1'])
            if (rewardBtn) return rewardBtn
        }
        return null
    }

    var windowMatch = targetKey.match(/^window:([^/]+)\/(.+)$/)
    if (windowMatch) {
        var wnd = this.GetWindowInstance(windowMatch[1])
        return wnd ? this.GetNodeByPath(wnd.node, windowMatch[2]) : null
    }

    var propMatch = targetKey.match(/^([^.:/]+)\.(.+)$/)
    if (propMatch) {
        var win = this.GetWindowInstance(propMatch[1])
        return win ? this.GetNodeFromObjectPath(win, propMatch[2]) : null
    }

    var currentWindow = UIRoot && UIRoot.instance && UIRoot.instance.currentWindow
    return currentWindow && currentWindow.node ? this.FindNodeByName(currentWindow.node, targetKey) : null
}

MergeTutorialManager.ParseKeyValueParam = function(param) {
    var result = {}
    if (!param) return result
    String(param).split(';').forEach(function(part) {
        var pair = part.split('=')
        if (pair.length < 2) return
        result[pair[0].trim()] = pair.slice(1).join('=').trim()
    })
    return result
}

MergeTutorialManager.GetMapNode = function() {
    if (!GamePlay || !GamePlay.instance) return null
    return GamePlay.instance.mapNode || null
}

MergeTutorialManager.GetMapBuildRootNode = function() {
    var mapNode = this.GetMapNode()
    if (!mapNode) return null
    if (mapNode.buildNode) return mapNode.buildNode
    if (mapNode.node && mapNode.node.getChildByName) {
        return mapNode.node.getChildByName('builds')
    }
    return null
}

MergeTutorialManager.GetMapBuildNode = function(mapId, buildId) {
    var buildRoot = this.GetMapBuildRootNode()
    if (!buildRoot || !buildId) return null
    if (mapId && Game.SUserVillage && Game.SUserVillage.MergeMapId && String(Game.SUserVillage.MergeMapId()) !== String(mapId)) return null
    return buildRoot.getChildByName(String(buildId))
}

MergeTutorialManager.IsMapBuildTarget = function(targetKey) {
    targetKey = this.NormalizeOrderParam(targetKey)
    return targetKey.indexOf('mapId=') >= 0 && targetKey.indexOf('buildId=') >= 0
}

MergeTutorialManager.GetCurrentMapBuildTarget = function() {
    var stepMeta = this.activeTriggerStepMeta || this.currentMeta
    if (!stepMeta || !stepMeta.CompleteParam) return null
    var targetKey = this.NormalizeOrderParam(stepMeta.CompleteParam())
    if (targetKey.indexOf('mapId=') < 0 || targetKey.indexOf('buildId=') < 0) return null
    var target = this.ParseKeyValueParam(targetKey)
    if (!target.buildId) return null
    if (target.mapId && Game.SUserVillage && Game.SUserVillage.MergeMapId && String(Game.SUserVillage.MergeMapId()) !== String(target.mapId)) return null
    return target
}

MergeTutorialManager.GetNodeWorldGeometry = function(node, padding) {
    if (!node) return null
    var worldPos = this.GetNodeGuideWorldPos(node)
    if (!worldPos) return null
    var scale = node.getWorldScale ? node.getWorldScale(new Vec3()) : new Vec3(1, 1, 1)
    var size = getNodeContentSize(node)
    var width = Math.abs((size.width || 100) * (scale.x || 1))
    var height = Math.abs((size.height || 100) * (scale.y || 1))
    var diameter = Math.max(width, height, 100) + (padding || 30)
    return {
        shape: 'circle',
        x: worldPos.x,
        y: worldPos.y,
        width: diameter,
        height: diameter,
        tweenDuration: 0.2,
    }
}

MergeTutorialManager.GetNodeGuideWorldPos = function(node) {
    if (!node) return null
    var worldPos = node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO)
    if (this.IsMapBuildNode(node)) {
        var camera = this.GetVillageCamera()
        if (camera) {
            var screenPos = new Vec3()
            camera.worldToScreen(new Vec3(worldPos.x, worldPos.y, worldPos.z || 0), screenPos)
            return this.ConvertScreenPointToUiWorldPos(screenPos)
        }
    }
    return worldPos
}

MergeTutorialManager.ConvertScreenPointToUiWorldPos = function(screenPos) {
    if (!screenPos) return null
    var uiCamera = UIRoot && UIRoot.instance ? UIRoot.instance.mainCamera : null
    var point = new Vec3(screenPos.x, screenPos.y, screenPos.z || 0)
    if (uiCamera) {
        var out = new Vec3()
        uiCamera.screenToWorld(point, out)
        return new Vec2(out.x, out.y)
    }
    var visibleSize = view.getVisibleSize()
    if (UIRoot && UIRoot.instance && UIRoot.instance.node) {
        var localPos = new Vec3(screenPos.x - visibleSize.width / 2, screenPos.y - visibleSize.height / 2, 0)
        return UIRoot.instance.node.getComponent(UITransform)!.convertToWorldSpaceAR(localPos)
    }
    return new Vec2(screenPos.x - visibleSize.width / 2, screenPos.y - visibleSize.height / 2)
}

MergeTutorialManager.GetVillageCamera = function() {
    var cameraNode = find('Canvas/VillageCamera')
    return cameraNode ? cameraNode.getComponent(Camera) : null
}

MergeTutorialManager.IsMapBuildNode = function(node) {
    var buildRoot = this.GetMapBuildRootNode()
    return !!(node && buildRoot && node.parent === buildRoot)
}

MergeTutorialManager.GetNodeWorldPos = function(targetKey) {
    var node = this.ResolveGuideTargetNode(targetKey)
    if (!node) return null
    return this.GetNodeGuideWorldPos(node)
}

MergeTutorialManager.GetNodeHighlightGeometry = function(targetKey) {
    return this.GetNodeWorldGeometry(this.ResolveGuideTargetNode(targetKey), 30)
}

MergeTutorialManager.MatchNodeClickParam = function(completeParam, payload) {
    if (!completeParam) return true
    payload = payload || {}
    var expected = this.NormalizeOrderParam(completeParam)
    var candidates = [payload.nodeKey, payload.targetKey, payload.key, payload.node]
    for (var i = 0; i < candidates.length; i++) {
        if (this.NormalizeOrderParam(candidates[i]) === expected) return true
    }
    return false
}

MergeTutorialManager.EmitNodeClick = function(nodeKey, payload) {
    payload = payload || {}
    payload.nodeKey = nodeKey
    this.Emit(this.EventTypes.NodeClick, payload)
}

MergeTutorialManager.IsWaitingNodeClick = function(nodeKey) {
    var stepMeta = this.activeTriggerStepMeta || this.currentMeta
    return !!(stepMeta && stepMeta.CompleteType && stepMeta.CompleteType() === this.CompleteTypes.NodeClick && this.MatchNodeClickParam(stepMeta.CompleteParam(), { nodeKey: nodeKey }))
}

MergeTutorialManager.RefreshCurrentWindow = function() {
    if (!this.mainWindow || !this.mainWindow.showMeta) return
    if (this.activeTriggerStepMeta) {
        this.mainWindow.showMeta(this.activeTriggerStepMeta, this.activeTriggerGuideMeta)
    } else if (this.currentMeta) {
        this.mainWindow.showMeta(this.currentMeta, this.currentGuideMeta)
    }
}

MergeTutorialManager.BindNodeClickTargetIfNeeded = function(stepMeta) {
    if (!stepMeta || !stepMeta.CompleteType || stepMeta.CompleteType() !== this.CompleteTypes.NodeClick) return
    var completeParam = this.NormalizeOrderParam(stepMeta.CompleteParam())
    if (completeParam === 'item_shop_button') {
        var shopWnd = this.GetWindowInstance('ShopWindow')
        if (shopWnd && shopWnd.bindMergeTutorialNodeClick) {
            shopWnd.bindMergeTutorialNodeClick()
        }
    }
}

MergeTutorialManager.GetTriggerGroupId = function(triggerMeta) {
    if (!triggerMeta) return 0
    if (triggerMeta.GroupId) return triggerMeta.GroupId()
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10)
    return reportId ? Math.floor(reportId / 10000) : 0
}

MergeTutorialManager.IsTriggerCompleted = function(triggerMeta) {
    if (!triggerMeta) return true
    var reportId = parseInt(triggerMeta.CompletionReportId(), 10)
    if (!reportId) return false
    if (this.completedTriggerReports && this.completedTriggerReports[reportId]) return true
    var groupId = this.GetTriggerGroupId(triggerMeta)
    if (!groupId || !Game.SUserMergeTutorial || !Game.SUserMergeTutorial.TutorialId) return false
    var savedId = parseInt(Game.SUserMergeTutorial.TutorialId(groupId), 10) || 0
    return savedId >= reportId
}

MergeTutorialManager.GetPayloadValueCandidates = function(payload) {
    payload = payload || {}
    return [
        payload.value,
        payload.count,
        payload.level,
        payload.coin,
        payload.itemId,
        payload.orderCount,
        payload.triggerParam,
        payload.id,
    ]
}

MergeTutorialManager.MatchTriggerParam = function(expected, payload, eventName) {
    if (expected === undefined || expected === null || expected === '') return true
    expected = String(expected)
    var candidates = this.GetPayloadValueCandidates(payload)
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

MergeTutorialManager.MatchTriggerCondition = function(conditionType, conditionParam, payload) {
    conditionType = conditionType || 'none'
    payload = payload || {}
    if (conditionType === 'none' || conditionType === '') return true
    if (conditionType === 'board_full') {
        return payload.boardFull === true || payload.isBoardFull === true || this.IsMergeBoardFull()
    }
    if (conditionType === 'board_has_empty') {
        return payload.boardHasEmpty === true || payload.hasEmpty === true
    }
    if (conditionType === 'item_on_board') {
        if (!conditionParam) return !!payload.itemOnBoard
        return String(payload.itemId || payload.mergeId || '') === String(conditionParam)
    }
    if (conditionType === 'building_coin_gate') {
        return payload.buildingCoinGate === true || payload.passBuildingCoinGate === true || this.CheckBuildingCoinGate(conditionParam)
    }
    return payload[conditionType] === true
}

MergeTutorialManager.CheckBuildingCoinGate = function(conditionParam) {
    var params = this.ParseKeyValueParam(conditionParam || '')
    var mapId = params.mapId || params.mapID || params.map_id
    var buildId = params.buildId || params.buildID || params.build_id
    if (!mapId || !buildId || !Meta.MapMeta || !Meta.MapMeta.GetMetaById || !Game.SUser || !Game.SUser.Coin) return false
    var meta = Meta.MapMeta.GetMetaById(mapId, buildId)
    if (!meta || !meta.Price) return false
    var levels = this.ParseLevelList(params.levels || params.level || params.lv)
    if (levels.length === 0) levels = [1]
    var needCoin = 0
    for (var i = 0; i < levels.length; i++) {
        needCoin += this.GetMapBuildLevelPrice(meta, levels[i])
    }
    return Game.SUser.Coin() >= needCoin
}

MergeTutorialManager.ParseLevelList = function(value) {
    if (value === undefined || value === null || value === '') return []
    return String(value).split(',').map(function(item) {
        return parseInt(item, 10)
    }).filter(function(item) {
        return !isNaN(item) && item > 0
    })
}

MergeTutorialManager.GetMapBuildLevelPrice = function(meta, level) {
    var price = meta.Price(level)
    if (Array.isArray(price)) {
        return price.reduce(function(sum, item) {
            var num = Number(item) || 0
            return sum + num
        }, 0)
    }
    return Number(price) || 0
}

MergeTutorialManager.MatchTriggerSelector = function(triggerMeta, payload) {
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

MergeTutorialManager.IsMergeBoardFull = function() {
    var levelNode = this.GetMergeLevelNode ? this.GetMergeLevelNode() : null
    if (levelNode && levelNode.getEmptyTilePos) {
        return !levelNode.getEmptyTilePos()
    }
    if (!Game.SUserMerge || !Game.SUserMerge.GetMergeMapData) return false
    var mapData = Game.SUserMerge.GetMergeMapData() || {}
    var occupiedCount = 0
    for (var key in mapData) {
        if (Object.prototype.hasOwnProperty.call(mapData, key) && mapData[key]) occupiedCount++
    }
    return occupiedCount >= 49
}

MergeTutorialManager.GetHighestLvNormalMergeItem = function() {
    var levelNode = this.GetMergeLevelNode ? this.GetMergeLevelNode() : null
    if (!levelNode || !levelNode.GetHighestLvNormalMergeItem) return null
    return levelNode.GetHighestLvNormalMergeItem()
}

MergeTutorialManager.MatchTriggerMeta = function(triggerMeta, eventName, payload) {
    if (!triggerMeta || !triggerMeta.Enabled || !triggerMeta.Enabled()) return false
    if (triggerMeta.TriggerEvent() !== eventName) return false
    if (!this.MatchTriggerSelector(triggerMeta, payload)) return false
    if (triggerMeta.Once && triggerMeta.Once() && this.IsTriggerCompleted(triggerMeta)) return false
    if (!triggerMeta.AllowDuringForced() && !this.IsFinished()) return false
    if (!this.MatchTriggerParam(triggerMeta.TriggerParam(), payload, eventName)) return false
    return this.MatchTriggerCondition(triggerMeta.ConditionType(), triggerMeta.ConditionParam(), payload)
}

MergeTutorialManager.IsTriggerQueued = function(triggerId) {
    if (this.activeTriggerMeta && this.activeTriggerMeta.Id && this.activeTriggerMeta.Id() === triggerId) return true
    for (var i = 0; i < this.triggerQueue.length; i++) {
        if (this.triggerQueue[i] && this.triggerQueue[i].Id && this.triggerQueue[i].Id() === triggerId) return true
    }
    return false
}

MergeTutorialManager.EnqueueTrigger = function(triggerMeta, deferStart) {
    if (!triggerMeta || this.IsTriggerQueued(triggerMeta.Id())) return false
    this.triggerQueue.push(triggerMeta)
    this.triggerQueue.sort(function(a, b) {
        return (b.Priority ? b.Priority() : 0) - (a.Priority ? a.Priority() : 0)
    })
    if (!deferStart) this.TryStartNextTrigger()
    return true
}

MergeTutorialManager.EmitTrigger = function(eventName, payload) {
    var metas = this.GetTriggerMetas()
    var matched = []
    for (var id in metas) {
        if (!Object.prototype.hasOwnProperty.call(metas, id)) continue
        var meta = metas[id]
        if (this.MatchTriggerMeta(meta, eventName, payload || {})) {
            matched.push(meta)
        }
    }
    for (var i = 0; i < matched.length; i++) {
        this.EnqueueTrigger(matched[i], true)
    }
    this.TryStartNextTrigger()
}

MergeTutorialManager.TryStartNextTrigger = function() {
    if (this.activeTriggerMeta || this.isReportingFinish) return
    if (this.currentMeta && !this.IsFinished()) return
    if (!this.triggerQueue || this.triggerQueue.length === 0) return
    var triggerMeta = this.triggerQueue.shift()
    if (!triggerMeta) return
    this.StartTrigger(triggerMeta)
}

MergeTutorialManager.StartTrigger = function(triggerMeta) {
    if (!triggerMeta) return
    this.activeTriggerMeta = triggerMeta
    this.activeTriggerBlockMode = triggerMeta.BlockMode ? triggerMeta.BlockMode() : this.TriggerBlockModes.None
    this.activeTriggerStepId = triggerMeta.FirstStepId ? triggerMeta.FirstStepId() : 0
    if (!this.activeTriggerStepId) {
        this.ClearActiveTriggerState()
        this.TryStartNextTrigger()
        return
    }
    this.startTriggerStep()
}

MergeTutorialManager.ClearActiveTriggerState = function() {
    this.activeTriggerMeta = null
    this.activeTriggerStepId = 0
    this.activeTriggerStepMeta = null
    this.activeTriggerGuideMeta = null
    this.activeTriggerBlockMode = ''
}

MergeTutorialManager.startTriggerStep = function() {
    if (!this.activeTriggerMeta || !this.activeTriggerStepId) return
    this.activeTriggerStepMeta = this.GetMeta(this.activeTriggerStepId)
    if (!this.activeTriggerStepMeta) {
        console.warn('MergeTutorialManager missing trigger step meta', this.activeTriggerStepId)
        this.ClearActiveTriggerState()
        this.TryStartNextTrigger()
        return
    }
    if (this.activeTriggerStepMeta.IsEnd && this.activeTriggerStepMeta.IsEnd()) {
        this.CompleteActiveTrigger()
        return
    }
    this.activeTriggerGuideMeta = this.GetGuideMeta(this.activeTriggerStepMeta.GuideId())
    this.BindNodeClickTargetIfNeeded(this.activeTriggerStepMeta)
    if (this.activeTriggerStepMeta.CompleteType() === this.CompleteTypes.Auto) {
        this.nextTriggerStep()
        return
    }
    this.showTriggerWindow()
}

MergeTutorialManager.showTriggerWindow = function() {
    if (!this.activeTriggerStepMeta) return
    if (!this.activeTriggerGuideMeta && this.activeTriggerStepMeta.CompleteType() !== this.CompleteTypes.FullscreenClick) return
    if (!UIRoot || !UIRoot.instance || !UIRoot.instance.openChildWindow) return
    UIRoot.instance.openChildWindow('MergeTutorialWindow', {
        meta: this.activeTriggerStepMeta,
        guideMeta: this.activeTriggerGuideMeta,
        showCallback: function(wnd) {
            if (wnd && wnd.showMeta) {
                wnd.showMeta(MergeTutorialManager.activeTriggerStepMeta, MergeTutorialManager.activeTriggerGuideMeta)
            }
        },
    })
}

MergeTutorialManager.nextTriggerStep = function() {
    if (!this.activeTriggerStepMeta) return
    if (this.activeTriggerStepMeta.SaveServer && this.activeTriggerStepMeta.SaveServer()) {
        this.SaveServerStep(this.activeTriggerStepMeta.Id())
    }
    var nextId = this.activeTriggerStepMeta.NextId()
    if (!nextId) {
        this.CompleteActiveTrigger()
        return
    }
    this.activeTriggerStepId = nextId
    if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId && this.activeTriggerMeta) {
        Game.SUserMergeTutorial.SetTutorialId(this.GetTriggerGroupId(this.activeTriggerMeta), nextId)
    }
    this.startTriggerStep()
}

MergeTutorialManager.CompleteActiveTrigger = function() {
    var triggerMeta = this.activeTriggerMeta
    this.ClearActiveTriggerState()
    if (this.mainWindow && this.mainWindow.close) {
        this.mainWindow.close()
    }
    if (triggerMeta) {
        this.MarkTriggerCompletedAndReport(triggerMeta)
    }
    this.TryStartNextTrigger()
}

MergeTutorialManager.MarkTriggerCompletedAndReport = function(triggerMeta) {
    if (!triggerMeta) return
    var reportId = parseInt(triggerMeta.CompletionReportId(), 10)
    var groupId = this.GetTriggerGroupId(triggerMeta)
    if (!reportId || !groupId) return
    this.completedTriggerReports[reportId] = true
    if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(groupId, reportId)
    }
    this.QueueTriggerReport(reportId, groupId)
}

MergeTutorialManager.QueueTriggerReport = function(reportId, groupId) {
    for (var i = 0; i < this.pendingTriggerReports.length; i++) {
        if (this.pendingTriggerReports[i].reportId === reportId) return
    }
    this.pendingTriggerReports.push({ reportId: reportId, groupId: groupId })
    this.FlushTriggerReports()
}

MergeTutorialManager.FlushTriggerReports = function() {
    if (this.isReportingTrigger || !this.pendingTriggerReports || this.pendingTriggerReports.length === 0) return
    var item = this.pendingTriggerReports[0]
    this.isReportingTrigger = true
    var req = SR.SRMergeTutorial.finishStep(item.reportId)
    req.SetCallBack(function(res) {
        MergeTutorialManager.isReportingTrigger = false
        MergeTutorialManager.pendingTriggerReports.shift()
        if (res && res.userTutorial && Game.SUserMergeTutorial && Game.SUserMergeTutorial.updateData) {
            Game.SUserMergeTutorial.updateData(res.userTutorial)
        }
        MergeTutorialManager.FlushTriggerReports()
    })
    var retry = function() {
        MergeTutorialManager.isReportingTrigger = false
        MergeTutorialManager.ScheduleTriggerReportRetry()
    }
    req.SetErrorCallBack(retry)
    req.SetNetErrorCallBack(retry)
    req.Send()
}

MergeTutorialManager.ScheduleTriggerReportRetry = function() {
    if (this.triggerReportRetryTimer) return
    this.triggerReportRetryTimer = setTimeout(function() {
        MergeTutorialManager.triggerReportRetryTimer = null
        MergeTutorialManager.FlushTriggerReports()
    }, this.triggerReportRetryDelay)
}

MergeTutorialManager.init = function() {
    if (this.IsFinished()) return
    this.ClearPendingMergeSaveOps()
    this.BackupAndHideNormalOrders()
    this.currentId = this.StartId
    this.currentDragStartTile = ''
    if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(this.MainTutorialGroupId, this.currentId)
    }
    this.tryStartStep()
}

MergeTutorialManager.tryStartStep = function() {
    this.currentMeta = this.GetMeta(this.currentId)
    if (!this.currentMeta) {
        console.error('MergeTutorialManager missing meta', this.currentId)
        return
    }
    if (this.currentMeta.IsEnd && this.currentMeta.IsEnd()) {
        this.finishForcedTutorial()
        return
    }
    if (this.currentMeta.StartType() === 'window') {
        if (!UIRoot || !UIRoot.instance || UIRoot.instance.currentWindowName !== this.currentMeta.StartParam()) {
            return
        }
    }
    this.startStep()
}

MergeTutorialManager.startStep = function() {
    if (!this.currentMeta) return
    this.currentGuideMeta = this.GetGuideMeta(this.currentMeta.GuideId())
    this.BindNodeClickTargetIfNeeded(this.currentMeta)
    var actionResult = this.applyAction()
    if (actionResult === false) return
    if (this.currentMeta.CompleteType() === this.CompleteTypes.Auto) {
        this.nextStep()
        return
    }
    this.showWindow()
}

MergeTutorialManager.applyAction = function() {
    var actionType = this.currentMeta.ActionType()
    var actionParam = this.currentMeta.ActionParam()
    if (!actionType) return true
    if (actionType === 'create_tutorial_order') {
        return this.CreateTutorialOrder(actionParam)
    }
    return true
}

MergeTutorialManager.showWindow = function() {
    if (!this.currentGuideMeta && this.currentMeta.CompleteType() !== this.CompleteTypes.FullscreenClick) return
    if (!UIRoot || !UIRoot.instance || !UIRoot.instance.openChildWindow) return
    UIRoot.instance.openChildWindow('MergeTutorialWindow', {
        meta: this.currentMeta,
        guideMeta: this.currentGuideMeta,
        showCallback: function(wnd) {
            if (wnd && wnd.showMeta) {
                wnd.showMeta(MergeTutorialManager.currentMeta, MergeTutorialManager.currentGuideMeta)
            }
        },
    })
}

MergeTutorialManager.nextStep = function() {
    if (!this.currentMeta) return
    var lastId = this.currentMeta.Id()
    if (this.currentMeta.SaveServer()) {
        this.SaveServerStep(lastId)
    }
    var nextId = this.currentMeta.NextId()
    if (!nextId) return
    var nextMeta = this.GetMeta(nextId)
    this.currentId = nextId
    if (nextMeta && nextMeta.IsEnd && nextMeta.IsEnd()) {
        this.currentMeta = nextMeta
        this.finishForcedTutorial()
        return
    }
    if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(this.MainTutorialGroupId, nextId)
    }
    this.generatorClickProgress = {}
    this.currentDragStartTile = ''
    this.tryStartStep()
}

MergeTutorialManager.finishForcedTutorial = function() {
    if (this.isReportingFinish) return
    this.isReportingFinish = true
    this.finishForcedTutorialSave()
}

MergeTutorialManager.finishForcedTutorialSave = function() {
    this._syncMergeMapsFromSceneChildren(function() {
        MergeTutorialManager.finishForcedTutorialReport()
    }, function(error) {
        MergeTutorialManager.retryFinishForcedTutorial('saveMapLite', error)
    })
}

MergeTutorialManager.finishForcedTutorialReport = function() {
    var req = SR.SRMergeTutorial.finishStep(this.finish_report_id)
    req.SetCallBack(function(res) {
        MergeTutorialManager.finishForcedTutorialGetInfo(res && res.userTutorial)
    })
    req.SetErrorCallBack(function(error) {
        MergeTutorialManager.retryFinishForcedTutorial('finishStep', error)
    })
    req.SetNetErrorCallBack(function(error) {
        MergeTutorialManager.retryFinishForcedTutorial('finishStepNet', error)
    })
    req.Send()
}

MergeTutorialManager.finishForcedTutorialGetInfo = function(userTutorialData) {
    this.getInfo(function() {
        MergeTutorialManager.completeForcedTutorial(userTutorialData)
    }, function(error) {
        MergeTutorialManager.retryGetInfo(userTutorialData, error)
    })
}

MergeTutorialManager.completeForcedTutorial = function(userTutorialData) {
    if (this.finishRetryTimer) {
        clearTimeout(this.finishRetryTimer)
        this.finishRetryTimer = null
    }
    if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.updateData && userTutorialData) {
        Game.SUserMergeTutorial.updateData(userTutorialData)
    }
    if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(this.MainTutorialGroupId, this.finish_report_id)
    }
    this.currentId = this.finish_report_id
    this.currentMeta = this.GetMeta(this.finish_report_id)
    this.currentGuideMeta = null
    this.isReportingFinish = false
    this.allowTutorialFinalSave = false
    this.ClearPendingMergeSaveOps()
    this.RestoreNormalOrders()
    if (this.mainWindow && this.mainWindow.close) {
        this.mainWindow.close()
    }
    var cb = this.finishCallback
    this.finishCallback = null
    if (cb) {
        cb()
    }
    this.TryStartNextTrigger()
}

MergeTutorialManager.retryFinishForcedTutorial = function(stage, error) {
    this.allowTutorialFinalSave = false
    this.ClearPendingMergeSaveOps()
    if (this.finishRetryTimer) return
    this.finishRetryTimer = setTimeout(function() {
        MergeTutorialManager.finishRetryTimer = null
        MergeTutorialManager.finishForcedTutorialSave()
    }, this.finishRetryDelay)
}

MergeTutorialManager.retryGetInfo = function(userTutorialData, error) {
    if (this.finishRetryTimer) return
    this.finishRetryTimer = setTimeout(function() {
        MergeTutorialManager.finishRetryTimer = null
        MergeTutorialManager.finishForcedTutorialGetInfo(userTutorialData)
    }, this.finishRetryDelay)
}

MergeTutorialManager.CloneData = function(data) {
    if (data === undefined || data === null) return data
    return JSON.parse(JSON.stringify(data))
}

MergeTutorialManager.HasNormalOrders = function(orderData) {
    return !!(orderData && Array.isArray(orderData.orders) && orderData.orders.length > 0)
}

MergeTutorialManager.BackupAndHideNormalOrders = function() {
    if (!Game || !Game.SUserMerge || !Game.SUserMerge.GetOrderData || !Game.SUserMerge.UpdateOrders) return
    var currentOrderData = Game.SUserMerge.GetOrderData() || {}
    if (!this.hasNormalOrderBackup) {
        if (!this.HasNormalOrders(currentOrderData)) return
        this.normalOrderDataBackup = this.CloneData(currentOrderData)
        this.hasNormalOrderBackup = true
    }
    var hiddenOrderData = this.CloneData(this.normalOrderDataBackup || {})
    hiddenOrderData.orders = []
    hiddenOrderData.completedOrderIds = []
    hiddenOrderData.orderSeed = hiddenOrderData.orderSeed || 1
    Game.SUserMerge.UpdateOrders(hiddenOrderData)
    this.ordersHiddenForTutorial = true
    this.RefreshOrderUI()
}

MergeTutorialManager.ApplyNormalOrdersBackup = function() {
    if (!this.hasNormalOrderBackup || !Game || !Game.SUserMerge || !Game.SUserMerge.UpdateOrders) return
    if (!this.HasNormalOrders(this.normalOrderDataBackup)) return
    Game.SUserMerge.UpdateOrders(this.CloneData(this.normalOrderDataBackup))
    this.ordersHiddenForTutorial = false
    this.RefreshOrderUI()
    this.RefreshOrderUIDelayed()
}

MergeTutorialManager.ClearNormalOrdersBackup = function() {
    this.normalOrderDataBackup = null
    this.hasNormalOrderBackup = false
    this.ordersHiddenForTutorial = false
}

MergeTutorialManager.RestoreNormalOrders = function() {
    this.ApplyNormalOrdersBackup()
    this.ClearNormalOrdersBackup()
    this.RefreshOrderUI()
}

MergeTutorialManager.ParseMergeDragParam = function(param) {
    if (!param) return null
    var parts = param.split('>')
    return {
        from: this.NormalizeTileKey(parts[0] || ''),
        to: this.NormalizeTileKey(parts[1] || ''),
    }
}

MergeTutorialManager.GetCurrentMergeDragParam = function() {
    if (!this.currentMeta || this.currentMeta.CompleteType() !== this.CompleteTypes.MergeDrag) return null
    var drag = this.ParseMergeDragParam(this.currentMeta.CompleteParam())
    if (!drag) return null
    if (this.currentDragStartTile) {
        drag.from = this.NormalizeTileKey(this.currentDragStartTile)
    }
    return drag
}

MergeTutorialManager.GetCurrentDragGuideTiles = function() {
    var stepMeta = this.activeTriggerStepMeta || this.currentMeta
    if (stepMeta && stepMeta.CompleteType && stepMeta.CompleteType() === this.CompleteTypes.DragToBackpack) {
        return {
            from: stepMeta.CompleteParam ? stepMeta.CompleteParam() : 'highest_normal',
            to: 'backpack_button',
        }
    }
    var drag = this.GetCurrentMergeDragParam()
    if (!drag) return null
    return {
        from: drag.from,
        to: drag.to,
    }
}

MergeTutorialManager.UpdateMergeDragGuideStartTile = function(tileKey, oldTileKey) {
    if (!this.currentMeta || this.currentMeta.CompleteType() !== this.CompleteTypes.MergeDrag) return false
    if (oldTileKey && !this.CanOperate(this.EventTypes.MergeDragStart, { from: oldTileKey })) return false
    tileKey = this.NormalizeTileKey(tileKey)
    if (!tileKey) return false
    this.currentDragStartTile = tileKey
    if (this.mainWindow) {
        if (this.mainWindow.refreshDragGuidePosition) this.mainWindow.refreshDragGuidePosition()
        if (this.mainWindow.refreshDragHighlightPosition) this.mainWindow.refreshDragHighlightPosition()
    }
    return true
}

MergeTutorialManager.ParseGeneratorParam = function(param) {
    if (!param) return null
    var parts = param.split(':')
    return {
        tile: this.NormalizeTileKey(parts[0] || ''),
        count: parts[1] ? parseInt(parts[1], 10) : 1,
    }
}

MergeTutorialManager.NormalizeTileKey = function(tileKey) {
    if (!tileKey) return ''
    tileKey = String(tileKey)
    if (tileKey.indexOf('lock_') === 0) return tileKey.substring(5)
    return tileKey
}

MergeTutorialManager.Clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

MergeTutorialManager.BuildDynamicHighlightGeometry = function(worldA, worldB, preset) {
    if (!worldA || !worldB) return null
    preset = preset || this.MergeDragGuidePreset || {}
    if (!this.EnableDynamicDragCircleHighlight) {
        var fixedSize = preset.baseSize || preset.minSize || 150
        return {
            shape: 'circle',
            x: worldA.x,
            y: worldA.y,
            width: fixedSize,
            height: fixedSize,
            tweenDuration: preset.tweenDuration || 0.25,
        }
    }
    var center = new Vec2((worldA.x + worldB.x) / 2, (worldA.y + worldB.y) / 2)
    var dx = worldA.x - worldB.x
    var dy = worldA.y - worldB.y
    var distance = Math.sqrt(dx * dx + dy * dy)
    var baseSize = preset.baseSize || 150
    var sizeFactor = preset.sizeFactor || 0.6
    var diameter = this.Clamp(baseSize + distance * sizeFactor, preset.minSize || 150, preset.maxSize || 320)
    return {
        shape: 'circle',
        x: center.x,
        y: center.y,
        width: diameter,
        height: diameter,
        tweenDuration: preset.tweenDuration || 0.25,
    }
}

MergeTutorialManager.MatchStepComplete = function(stepMeta, eventName, payload, progressPrefix) {
    if (!stepMeta) return false
    var completeType = stepMeta.CompleteType()
    var completeParam = stepMeta.CompleteParam()
    payload = payload || {}
    if (completeType !== eventName) return false
    if (completeType === this.CompleteTypes.FullscreenClick) return true
    if (completeType === this.CompleteTypes.MergeDrag) {
        var drag = stepMeta === this.currentMeta ? this.GetCurrentMergeDragParam() : this.ParseMergeDragParam(completeParam)
        return !!(drag && this.NormalizeTileKey(payload.from) === drag.from && this.NormalizeTileKey(payload.to) === drag.to)
    }
    if (completeType === this.CompleteTypes.GeneratorClick) {
        var gen = this.ParseGeneratorParam(completeParam)
        if (!gen || this.NormalizeTileKey(payload.tile) !== gen.tile) {
            return false
        }
        var key = (progressPrefix || 'step') + '_' + stepMeta.Id() + '_' + gen.tile
        this.generatorClickProgress[key] = (this.generatorClickProgress[key] || 0) + 1
        return this.generatorClickProgress[key] >= gen.count
    }
    if (completeType === this.CompleteTypes.TutorialOrderSubmit) {
        return this.MatchTutorialOrderParam(completeParam, payload)
    }
    if (completeType === this.CompleteTypes.NodeClick) {
        return this.MatchNodeClickParam(completeParam, payload)
    }
    if (completeType === this.CompleteTypes.DragToBackpack) {
        return this.MatchDragToBackpackParam(completeParam, payload)
    }
    return false
}

MergeTutorialManager.MatchCurrentComplete = function(eventName, payload) {
    return this.MatchStepComplete(this.currentMeta, eventName, payload, 'main')
}

MergeTutorialManager.MatchActiveTriggerComplete = function(eventName, payload) {
    return this.MatchStepComplete(this.activeTriggerStepMeta, eventName, payload, 'trigger')
}

MergeTutorialManager.CanOperateByStepMeta = function(stepMeta, type, payload, useCurrentDrag) {
    if (!stepMeta) return true
    payload = payload || {}
    var forbidEvents = stepMeta.ForbidEventList ? stepMeta.ForbidEventList() : []
    if (forbidEvents.indexOf(type) >= 0) return false
    var completeType = stepMeta.CompleteType()
    var completeParam = stepMeta.CompleteParam()
    if (type === this.EventTypes.MergeDragStart && completeType === this.CompleteTypes.DragToBackpack) {
        return this.MatchDragToBackpackStartParam(completeParam, payload)
    }
    if (type === this.EventTypes.MergeDrag && completeType === this.CompleteTypes.DragToBackpack) {
        return this.MatchDragToBackpackStartParam(completeParam, payload)
    }
    if (type === this.EventTypes.MergeDragStart) {
        if (completeType !== this.CompleteTypes.MergeDrag) return false
        var startDrag = useCurrentDrag ? this.GetCurrentMergeDragParam() : this.ParseMergeDragParam(completeParam)
        return !!(startDrag && this.NormalizeTileKey(payload.from) === startDrag.from)
    }
    if (type === this.EventTypes.MergeDrag && completeType === this.CompleteTypes.MergeDrag) {
        var drag = useCurrentDrag ? this.GetCurrentMergeDragParam() : this.ParseMergeDragParam(completeParam)
        return !!(drag && this.NormalizeTileKey(payload.from) === drag.from && this.NormalizeTileKey(payload.to) === drag.to)
    }
    if (type === this.EventTypes.GeneratorClick && completeType === this.CompleteTypes.GeneratorClick) {
        var gen = this.ParseGeneratorParam(completeParam)
        return !!(gen && this.NormalizeTileKey(payload.tile) === gen.tile)
    }
    if (type === this.EventTypes.TutorialOrderSubmit && completeType === this.CompleteTypes.TutorialOrderSubmit) {
        return this.MatchTutorialOrderParam(completeParam, payload)
    }
    if (type === this.EventTypes.NodeClick && completeType === this.CompleteTypes.NodeClick) {
        return this.MatchNodeClickParam(completeParam, payload)
    }
    if (type === this.EventTypes.DragToBackpack && completeType === this.CompleteTypes.DragToBackpack) {
        return this.MatchDragToBackpackParam(completeParam, payload)
    }
    if (type === this.EventTypes.MergeDrag || type === this.EventTypes.GeneratorClick || type === this.EventTypes.TutorialOrderSubmit || type === this.EventTypes.NodeClick || type === this.EventTypes.DragToBackpack) {
        return false
    }
    return true
}

MergeTutorialManager.CanOperate = function(type, payload) {
    if (this.activeTriggerStepMeta && this.activeTriggerBlockMode === this.TriggerBlockModes.Force) {
        return this.CanOperateByStepMeta(this.activeTriggerStepMeta, type, payload, false)
    }
    if (this.IsFinished()) return true
    if (this.isReportingFinish) return false
    if (!this.currentMeta) return true
    return this.CanOperateByStepMeta(this.currentMeta, type, payload, true)
}
MergeTutorialManager.NormalizeOrderParam = function(value) {
    if (value === undefined || value === null) return ''
    return String(value).trim()
}

MergeTutorialManager.MatchTutorialOrderParam = function(completeParam, payload) {
    if (!completeParam) return true
    payload = payload || {}
    var expected = this.NormalizeOrderParam(completeParam)
    var candidates = [payload.tutorialOrderId, payload.orderId, payload.orderKey]
    for (var i = 0; i < candidates.length; i++) {
        if (this.NormalizeOrderParam(candidates[i]) === expected) {
            return true
        }
    }
    return false
}

MergeTutorialManager.MatchDragToBackpackParam = function(completeParam, payload) {
    payload = payload || {}
    var expected = this.NormalizeOrderParam(completeParam)
    if (!expected || expected === 'highest_normal') return !!payload.success
    var candidates = [payload.targetKey, payload.from, payload.tile, payload.mergeId]
    for (var i = 0; i < candidates.length; i++) {
        if (this.NormalizeOrderParam(candidates[i]) === expected) return !!payload.success
    }
    return false
}

MergeTutorialManager.MatchDragToBackpackStartParam = function(completeParam, payload) {
    payload = payload || {}
    var expected = this.NormalizeOrderParam(completeParam)
    if (!expected || expected === 'highest_normal') {
        var highestItem = this.GetHighestLvNormalMergeItem()
        if (!highestItem || !highestItem.node) return false
        var nodeName = highestItem.node.name
        return this.NormalizeTileKey(payload.from) === this.NormalizeTileKey(nodeName)
    }
    return this.NormalizeOrderParam(payload.from) === expected
}

MergeTutorialManager.ParseRequiredPieces = function(content) {
    if (Game.MergeOrderLogic && Game.MergeOrderLogic.parseRequiredPieces) {
        return Game.MergeOrderLogic.parseRequiredPieces(this.NormalizeOrderParam(content))
    }
    var pieces = {}
    var text = this.NormalizeOrderParam(content)
    if (!text) return pieces
    var ids = text.split(';')
    for (var i = 0; i < ids.length; i++) {
        var pieceId = parseInt(ids[i])
        if (!isNaN(pieceId)) {
            pieces[pieceId] = (pieces[pieceId] || 0) + 1
        }
    }
    return pieces
}

MergeTutorialManager.ParseRewardString = function(rewardStr) {
    if (Game.MergeOrderLogic && Game.MergeOrderLogic.parseRewardString) {
        return Game.MergeOrderLogic.parseRewardString(this.NormalizeOrderParam(rewardStr))
    }
    var result = []
    var text = this.NormalizeOrderParam(rewardStr)
    if (!text) return result
    var parts = text.split(';')
    for (var i = 0; i < parts.length; i++) {
        var segs = parts[i].split('=')
        if (segs.length < 3) continue
        var type = parseInt(segs[0])
        var cid = parseInt(segs[1])
        var count = parseFloat(segs[2])
        if (!isNaN(type) && !isNaN(cid) && !isNaN(count)) {
            result.push({ type: type, cid: cid, count: count })
        }
    }
    return result
}

MergeTutorialManager.CreateTutorialOrderFromMeta = function(orderId) {
    var meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeOrders, orderId)
    if (!meta) return null

    var requiredPieces = this.ParseRequiredPieces(meta.Content())
    var matchedCells = {}
    for (var pieceId in requiredPieces) {
        matchedCells[pieceId] = []
    }

    return {
        claimed: false,
        orderId: Number(orderId),
        isTutorialOrder: true,
        tutorialOrderId: Number(orderId),
        tutorialOrderKey: this.NormalizeOrderParam(orderId),
        rewards: this.ParseRewardString(meta.Reward()),
        roleName: meta.RoleName(),
        completed: false,
        slotIndex: 0,
        matchedCells: matchedCells,
        requiredPieces: requiredPieces,
        activityRewards: [],
        additionRewards: this.ParseRewardString(meta.AdditionReward()),
    }
}

MergeTutorialManager.CreateTutorialOrder = function(orderParam) {
    if (!Game || !Game.SUserMerge) return false

    var orderId = parseInt(orderParam)
    var order = null
    if (!isNaN(orderId)) {
        order = this.CreateTutorialOrderFromMeta(orderId)
    }
    if (!order && LocalMergeTutorialTestData && LocalMergeTutorialTestData.GetTutorialOrder) {
        order = LocalMergeTutorialTestData.GetTutorialOrder(orderParam)
    }
    if (!order) {
        console.error('MergeTutorialManager.CreateTutorialOrder missing order', orderParam)
        return false
    }

    var orderData = Game.SUserMerge.GetOrderData ? Game.SUserMerge.GetOrderData() : null
    if (!orderData) orderData = {}
    orderData.orders = []
    orderData.completedOrderIds = []
    orderData.orderSeed = orderData.orderSeed || 1
    orderData.orders.push(order)

    var boardData = Game.SUserMerge.GetMergeMapData ? Game.SUserMerge.GetMergeMapData() : null
    var warehouseData = Game.SUserMerge.GetStoreData ? Game.SUserMerge.GetStoreData() : null
    if (Game.MergeOrderLogic && boardData && warehouseData) {
        Game.MergeOrderLogic.checkAllOrderProgress(boardData, warehouseData, orderData)
    }

    Game.SUserMerge.UpdateOrders(orderData)
    this.RefreshOrderUI()
    return true
}

MergeTutorialManager.RefreshOrderUI = function() {
    var mergeUI = this.GetMergeUI()
    if (mergeUI && mergeUI.InitOrderList) {
        mergeUI.InitOrderList()
    }
    var levelNode = this.GetMergeLevelNode()
    if (levelNode && levelNode.updateOrderStatus) {
        levelNode.updateOrderStatus()
    }
}

MergeTutorialManager.RefreshOrderUIDelayed = function() {
    setTimeout(function() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshOrderUI) {
            Game.MergeTutorialManager.RefreshOrderUI()
        }
    }, 0)
}

MergeTutorialManager.GetMergeUI = function() {
    if (!GamePlay.instance.mergeRoot) return null
    return GamePlay.instance.mergeRoot.mergeNodeUI || null
}

MergeTutorialManager.GetMergeLevelNode = function() {
    if (!GamePlay.instance.mergeRoot) return null
    return GamePlay.instance.mergeRoot.mergeLevelNode || null
}

MergeTutorialManager.GetTutorialOrderBySlotIndex = function(slotIndex) {
    if (!Game || !Game.SUserMerge || !Game.SUserMerge.GetOrderData) return null
    var orderData = Game.SUserMerge.GetOrderData()
    var orders = orderData && orderData.orders ? orderData.orders : []
    for (var i = 0; i < orders.length; i++) {
        var order = orders[i]
        if (order && order.isTutorialOrder && Number(order.slotIndex) === Number(slotIndex)) {
            return order
        }
    }
    return null
}

MergeTutorialManager.TryClaimTutorialOrder = function(slotIndex, orderNode) {
    var order = this.GetTutorialOrderBySlotIndex(slotIndex)
    if (!order) return false
    if (!this.CanOperate('tutorial_order_submit', { slotIndex: slotIndex, orderId: order.orderId, tutorialOrderId: order.tutorialOrderId, orderKey: order.tutorialOrderKey })) {
        return true
    }

    var orderState = Game.SUserMerge.GetOrderData()
    var boardData = Game.SUserMerge.GetMergeMapData()
    var warehouseData = Game.SUserMerge.GetStoreData()
    if (!Game.MergeOrderLogic || !orderState || !orderState.orders) return true

    Game.MergeOrderLogic.checkAllOrderProgress(boardData, warehouseData, orderState)
    if (!order.completed) {
        var mergeUI = this.GetMergeUI()
        if (mergeUI && mergeUI.PlayAdditionDscAnim) {
            mergeUI.PlayAdditionDscAnim('订单还未完成')
        }
        return true
    }

    var orderData = order.matchedCells || {}
    var globalPosByMergeId = orderNode && orderNode.getIconWorldPosByMergeIdMap ? orderNode.getIconWorldPosByMergeIdMap() : {}
    var storeDataStrArr = this.GetStoreDataByMatchedCells(orderData)
    var removedPieces = Game.MergeOrderLogic.removePiecesForOrder(order, boardData, warehouseData)
    Game.MergeOrderLogic.compactWarehouse(warehouseData)
    order.claimed = true

    this.RemoveTutorialOrder(order)
    this.PlayTutorialOrderClaimAnim(orderNode, order, orderData, globalPosByMergeId, storeDataStrArr, function() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.Emit) {
            Game.MergeTutorialManager.Emit('tutorial_order_submit', {
                slotIndex: slotIndex,
                orderId: order.orderId,
                tutorialOrderId: order.tutorialOrderId,
                orderKey: order.tutorialOrderKey,
                removedPieces: removedPieces,
            })
        }
    })
    return true
}

MergeTutorialManager.GetStoreDataByMatchedCells = function(orderData) {
    var storeDataStrArr = []
    if (!orderData || !Game.SUserMerge || !Game.SUserMerge.GetStoreData) return storeDataStrArr
    var storeData = Game.SUserMerge.GetStoreData()
    for (var mergeIdKey in orderData) {
        if (!Object.prototype.hasOwnProperty.call(orderData, mergeIdKey)) continue
        var pnameArr = orderData[mergeIdKey] || []
        pnameArr.forEach(function(pname) {
            if (pname.indexOf('warehouse') > -1) {
                var storeIndex = pname.split('_')[1]
                var mergeDataStr = storeData[storeIndex]
                storeDataStrArr.push(mergeDataStr)
            }
        })
    }
    return storeDataStrArr
}

MergeTutorialManager.RemoveTutorialOrder = function(order) {
    var orderState = Game.SUserMerge.GetOrderData()
    if (!orderState || !orderState.orders) return
    orderState.orders = orderState.orders.filter(function(item) {
        return item !== order
    })
    Game.SUserMerge.UpdateOrders(orderState)
}

MergeTutorialManager.GetTutorialOrderCoinReward = function(order) {
    var coin = 0
    var rewards = []
    if (order && order.rewards) rewards = rewards.concat(order.rewards)
    if (order && order.additionRewards) rewards = rewards.concat(order.additionRewards)
    for (var i = 0; i < rewards.length; i++) {
        var reward = rewards[i]
        if (!reward) continue
        if (Number(reward.type) === Game.Content.Types.Coin) {
            coin += Number(reward.count) || 0
        }
    }
    return coin
}

MergeTutorialManager.ApplyTutorialOrderCoinReward = function(order) {
    if (!Game || !Game.SUser) return
    var addCoin = this.GetTutorialOrderCoinReward(order)
    if (!addCoin) return
    var oldCoin = Game.SUser.Coin ? Game.SUser.Coin() : (Game.SUser.data && Game.SUser.data.coin) || 0
    var newCoin = oldCoin + addCoin
    if (Game.SUser.data) {
        Game.SUser.data.coin = newCoin
    }
    if (typeof GameMainWindow !== 'undefined' && GameMainWindow.instance && GameMainWindow.instance.userinfo) {
        GameMainWindow.instance.userinfo.changeCoin(oldCoin, newCoin, 0.8)
    } else if (typeof GameKit !== 'undefined' && GameKit.WebEvent) {
        GameKit.WebEvent.DispatcherEvent(GameKit.WebEvent.EventName.CoinEvent, { coin: newCoin })
    }
}

MergeTutorialManager.PlayTutorialOrderClaimAnim = function(orderNode, order, orderData, globalPosByMergeId, storeDataStrArr, cb) {
    var levelNode = this.GetMergeLevelNode()
    var mergeUI = this.GetMergeUI()
    var finish = function() {
        MergeTutorialManager.ApplyTutorialOrderCoinReward(order)
        if (mergeUI && mergeUI.InitOrderList) {
            mergeUI.InitOrderList()
        }
        if (cb) cb()
    }

    if (!levelNode || !levelNode.ClaimOrderReward) {
        finish()
        return
    }

    levelNode.ClaimOrderReward(orderData, globalPosByMergeId, storeDataStrArr, function() {
        if (orderNode && orderNode.showRewardAnim) {
            orderNode.showRewardAnim(function() {
                finish()
            })
        } else {
            finish()
        }
    })
}

MergeTutorialManager.Emit = function(eventName, payload) {
    if (this.MatchCurrentComplete(eventName, payload || {})) {
        this.nextStep()
        return
    }
    if (this.MatchActiveTriggerComplete(eventName, payload || {})) {
        this.nextTriggerStep()
    }
}
// Keep the old method name for existing call sites. Final tutorial save must use
// SUserMerge data, not scene nodes that may still be moving during animations.
MergeTutorialManager._syncMergeMapsFromSceneChildren = function(successCallback, errorCallback) {
    if (!Game || !Game.SUserMerge || !Game.SUserMerge.GetMergeMapData) {
        if (errorCallback) errorCallback(new Error('merge map data missing'))
        return
    }
    var mapData = Game.SUserMerge.GetMergeMapData() || {}
    this.allowTutorialFinalSave = true
    let req = SR.SRMerge.saveMapLite("init", { mapData: Object.assign({}, mapData), lite: false })
    req.SetCallBack(function(res) {
        MergeTutorialManager.allowTutorialFinalSave = false
        MergeTutorialManager.ApplyNormalOrdersBackup()
        if (successCallback) successCallback(res)
    })
    req.SetErrorCallBack(function(error) {
        MergeTutorialManager.allowTutorialFinalSave = false
        if (errorCallback) errorCallback(error)
    })
    req.SetNetErrorCallBack(function(error) {
        MergeTutorialManager.allowTutorialFinalSave = false
        if (errorCallback) errorCallback(error)
    })
    req.Send()
}

//最后新手引导完成后调用获取用户信息
MergeTutorialManager.getInfo = function(successCallback, errorCallback) {
    let req = SR.SRUserInfo.getInfo()
    req.SetCallBack(function(res) {
        if (successCallback) successCallback(res)
    })
    req.SetErrorCallBack(function(error) {
        if (errorCallback) errorCallback(error)
    })
    req.SetNetErrorCallBack(function(error) {
        if (errorCallback) errorCallback(error)
    })
    req.Send()
}

Game.MergeTutorialManager = MergeTutorialManager
export default MergeTutorialManager
