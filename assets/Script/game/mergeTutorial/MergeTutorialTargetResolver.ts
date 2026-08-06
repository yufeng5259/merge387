import '../../LegacyGlobals';
import { Camera, find, isValid, Node, UITransform, Vec2, Vec3, view } from 'cc';

function nodeToWorld(node: Node, point: Vec2 | Vec3) {
    const transform = node && node.getComponent(UITransform);
    return transform ? transform.convertToWorldSpaceAR(new Vec3(point.x, point.y, 'z' in point ? point.z : 0)) : new Vec3();
}

function getUiTransform(node: Node | null | undefined) {
    return node ? node.getComponent(UITransform) : null;
}

const MergeTutorialTargetResolver: any = {}

MergeTutorialTargetResolver.GetWindowInstance = function(owner, windowName) {
    if (typeof UIRoot === 'undefined' || !UIRoot.instance || !UIRoot.instance.GetWindow) return null
    var wnd = UIRoot.instance.GetWindow(windowName)
    if (!wnd || wnd.isFake) return null
    return wnd
}

MergeTutorialTargetResolver.GetRawWindowInstance = function(owner, windowName) {
    if (typeof UIRoot === 'undefined' || !UIRoot.instance || !UIRoot.instance.windowInstance) return null
    if (!Object.prototype.hasOwnProperty.call(UIRoot.instance.windowInstance, windowName)) return null
    return UIRoot.instance.windowInstance[windowName]
}

MergeTutorialTargetResolver.IsWindowOpenOrLoading = function(owner, windowName) {
    var wnd = owner.GetRawWindowInstance ? owner.GetRawWindowInstance(windowName) : this.GetRawWindowInstance(owner, windowName)
    if (!wnd) return false
    if (wnd.isFake) return true
    if (!wnd.node) return true
    if (!isValid(wnd.node)) return false
    if (wnd.node.isValid === false) return false
    return wnd.node.active !== false
}

MergeTutorialTargetResolver.IsMergeBoardSceneActive = function(owner) {
    return !!(typeof GamePlay !== 'undefined' &&
        GamePlay.instance &&
        GamePlay.Scenes &&
        GamePlay.instance.currentScene === GamePlay.Scenes.Slot)
}

MergeTutorialTargetResolver.IsNodeActive = function(owner, node) {
    return !!(node && node.active !== false && node.activeInHierarchy !== false)
}

MergeTutorialTargetResolver.FindNodeByName = function(owner, root, nodeName) {
    if (!root || !nodeName) return null
    if (root.name === nodeName) return root
    var children = root.children || root._children || []
    for (var i = 0; i < children.length; i++) {
        var found = this.FindNodeByName(owner, children[i], nodeName)
        if (found) return found
    }
    return null
}

MergeTutorialTargetResolver.FindActiveNodeByName = function(owner, root, nodeName) {
    if (!root || !nodeName) return null
    if (root.name === nodeName && this.IsNodeActive(owner, root)) return root
    var children = root.children || root._children || []
    for (var i = 0; i < children.length; i++) {
        var found = this.FindActiveNodeByName(owner, children[i], nodeName)
        if (found) return found
    }
    return null
}

MergeTutorialTargetResolver.FindActiveNodeByNames = function(owner, root, names) {
    if (!root || !names) return null
    for (var i = 0; i < names.length; i++) {
        var node = this.FindActiveNodeByName(owner, root, names[i])
        if (node) return node
    }
    return null
}

MergeTutorialTargetResolver.GetNodeByPath = function(owner, root, path) {
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

MergeTutorialTargetResolver.GetNodeFromObjectPath = function(owner, root, path) {
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

MergeTutorialTargetResolver.ResolveGuideTargetNode = function(owner, targetKey) {
    targetKey = owner.NormalizeOrderParam(targetKey)
    if (!targetKey) return null

    if (targetKey === 'shop_entry') {
        var mainWnd = owner.GetWindowInstance('GameMainWindow')
        if (mainWnd) {
            if (owner.IsNodeActive(mainWnd.btnAdSpin)) return mainWnd.btnAdSpin
            if (mainWnd.userinfo && mainWnd.userinfo.btnCoinAdd && owner.IsNodeActive(mainWnd.userinfo.btnCoinAdd.node)) {
                return mainWnd.userinfo.btnCoinAdd.node
            }
        }
        return null
    }

    if (targetKey === 'item_shop_button') {
        var shopWnd = owner.GetWindowInstance('ShopWindow')
        if (!shopWnd) return null
        if (shopWnd.treatPageNode) {
            var treatButton = owner.FindActiveNodeByNames(shopWnd.treatPageNode, ['buttonEnabled', 'item'])
            if (treatButton) return treatButton
            if (owner.IsNodeActive(shopWnd.treatPageNode)) return shopWnd.treatPageNode
        }
        if (shopWnd.coinPageNode) {
            var coinButton = owner.FindActiveNodeByNames(shopWnd.coinPageNode, ['buttonEnabled', 'coinItem'])
            if (coinButton) return coinButton
            if (owner.IsNodeActive(shopWnd.coinPageNode)) return shopWnd.coinPageNode
        }
        return shopWnd.node
    }

    if (targetKey === 'map_button' || targetKey === 'town_button') {
        var mergeUI = owner.GetMergeUI ? owner.GetMergeUI() : null
        if (!mergeUI) return null
        var buildButton = owner.GetBoardBuildButtonGuideTargetNode ? owner.GetBoardBuildButtonGuideTargetNode() : null
        if (owner.IsNodeActive(buildButton)) return buildButton
        var mapButton = owner.FindActiveNodeByNames(mergeUI.node, ['map_button', 'btn_map', 'Button - Map', 'Button - Village', 'btn_village'])
        if (mapButton) return mapButton
        return null
    }

    if (targetKey === 'back_to_board_button') {
        var gameMainWnd = owner.GetWindowInstance('GameMainWindow')
        if (!gameMainWnd) return null
        var mergeButton = owner.GetNodeByPath(gameMainWnd.node, 'town/merge')
        if (owner.IsNodeActive(mergeButton)) return mergeButton
        var backToBoardNode = owner.FindActiveNodeByNames(gameMainWnd.node, ['btn_slot', 'slot_btn', 'btn_merge', 'merge_btn', 'Button - Slot', 'Button - Merge'])
        if (backToBoardNode) return backToBoardNode
        if (owner.IsNodeActive(gameMainWnd.spSlots)) return gameMainWnd.spSlots
        return gameMainWnd.node
    }

    if (targetKey === 'backpack_button') {
        var mergeUIForStore = owner.GetMergeUI ? owner.GetMergeUI() : null
        if (!mergeUIForStore) return null
        if (owner.IsNodeActive(mergeUIForStore.storeButton)) return mergeUIForStore.storeButton
        return owner.FindActiveNodeByNames(mergeUIForStore.node, ['storeButton', 'store_button', 'backpack_button', 'btn_store', 'btn_backpack'])
    }

    if (targetKey === 'temp_note') {
        var mergeUIForTemp = owner.GetMergeUI ? owner.GetMergeUI() : null
        if (!mergeUIForTemp || !mergeUIForTemp.notetemp) return null
        if (mergeUIForTemp.notetemp.icon && owner.IsNodeActive(mergeUIForTemp.notetemp.icon.node)) return mergeUIForTemp.notetemp.icon.node
        if (owner.IsNodeActive(mergeUIForTemp.notetemp.node)) return mergeUIForTemp.notetemp.node
        return null
    }

    if (targetKey === 'backpack_close_button') {
        var storeWnd = owner.GetWindowInstance('StoreWindow')
        if (!storeWnd || !storeWnd.node) return null
        return owner.FindActiveNodeByNames(storeWnd.node, ['btn_close', 'closeBtn', 'Close', 'Button - Close', 'btnClose'])
    }

    if (targetKey === 'mergeUI/topUI/table/view/content/orders') {
        return owner.GetOrderSubmitTargetNode()
    }

    if (targetKey.indexOf('mergeUI/') === 0) {
        var mergeUIRoot = owner.GetMergeUI ? owner.GetMergeUI() : null
        if (!mergeUIRoot || !mergeUIRoot.node) return null
        return owner.GetNodeByPath(mergeUIRoot.node, targetKey.replace(/^mergeUI\//, ''))
    }

    if (targetKey === 'highest_normal') {
        var highestItem = owner.GetHighestLvNormalMergeItem()
        return highestItem ? highestItem.node : null
    }

    if (targetKey.indexOf('mapId=') >= 0 && targetKey.indexOf('buildId=') >= 0) {
        var mapTarget = owner.ParseKeyValueParam(targetKey)
        return owner.GetMapBuildNode(mapTarget.mapId, mapTarget.buildId)
    }

    if (targetKey === 'building_buy_button') {
        var buyWnd = owner.GetWindowInstance('MapBuyBuildWindow')
        if (!buyWnd) return null
        if (buyWnd.btnLevelUp && buyWnd.btnLevelUp.node) return buyWnd.btnLevelUp.node
        return owner.FindActiveNodeByNames(buyWnd.node, ['btn_lv', 'btn_ build', 'Button - OK'])
    }

    if (targetKey === 'building_upgrade_button') {
        var buildWindows = ['MapBuildUpgradeWindow', 'MapBuildStageUpgradeWindow']
        for (var i = 0; i < buildWindows.length; i++) {
            var mapElementWnd = owner.GetWindowInstance(buildWindows[i])
            if (!mapElementWnd) continue
            if (mapElementWnd.btnLevelUp && mapElementWnd.btnLevelUp.node) return mapElementWnd.btnLevelUp.node
            return owner.FindActiveNodeByNames(mapElementWnd.node, ['btn_lv', 'btn_ build', 'Button - OK'])
        }
        return null
    }

    if (targetKey === 'level_reward_button') {
        var storyWnd = owner.GetWindowInstance('StoryWindow')
        if (storyWnd) {
            var storyBtn = owner.FindActiveNodeByNames(storyWnd.node, ['btn_1', 'Button - OK'])
            if (storyBtn) return storyBtn
        }
        var levelRewardWnd = owner.GetWindowInstance('LevelUpGetRewardWindow')
        if (levelRewardWnd) {
            var levelRewardBtn = owner.FindActiveNodeByNames(levelRewardWnd.node, ['Button - OK', 'btn_1'])
            if (levelRewardBtn) return levelRewardBtn
        }
        var rewardWnd = owner.GetWindowInstance('GetRewardWindow')
        if (rewardWnd) {
            var rewardBtn = owner.FindActiveNodeByNames(rewardWnd.node, ['Button - OK', 'btn_1'])
            if (rewardBtn) return rewardBtn
        }
        return null
    }

    var windowMatch = targetKey.match(/^window:([^/]+)\/(.+)$/)
    if (windowMatch) {
        var wnd = owner.GetWindowInstance(windowMatch[1])
        return wnd ? owner.GetNodeByPath(wnd.node, windowMatch[2]) : null
    }

    var propMatch = targetKey.match(/^([^.:/]+)\.(.+)$/)
    if (propMatch) {
        var win = owner.GetWindowInstance(propMatch[1])
        return win ? owner.GetNodeFromObjectPath(win, propMatch[2]) : null
    }

    var currentWindow = typeof UIRoot !== 'undefined' && UIRoot.instance && UIRoot.instance.currentWindow
    return currentWindow && currentWindow.node ? owner.FindNodeByName(currentWindow.node, targetKey) : null
}

MergeTutorialTargetResolver.ParseKeyValueParam = function(owner, param) {
    var result = {}
    if (!param) return result
    String(param).split(';').forEach(function(part) {
        var pair = part.split('=')
        if (pair.length < 2) return
        result[pair[0].trim()] = pair.slice(1).join('=').trim()
    })
    return result
}

MergeTutorialTargetResolver.GetMapNode = function(owner) {
    if (typeof GamePlay === 'undefined' || !GamePlay.instance) return null
    return GamePlay.instance.mapNode || null
}

MergeTutorialTargetResolver.GetMapBuildRootNode = function(owner) {
    var mapNode = owner.GetMapNode()
    if (!mapNode) return null
    if (mapNode.buildNode) return mapNode.buildNode
    if (mapNode.node && mapNode.node.getChildByName) {
        return mapNode.node.getChildByName('builds')
    }
    return null
}

MergeTutorialTargetResolver.GetMapBuildNode = function(owner, mapId, buildId) {
    var buildRoot = owner.GetMapBuildRootNode()
    if (!buildRoot || !buildId) return null
    if (mapId && typeof Game !== 'undefined' && Game.SUserVillage && Game.SUserVillage.MergeMapId && String(Game.SUserVillage.MergeMapId()) !== String(mapId)) return null
    return buildRoot.getChildByName(String(buildId))
}

MergeTutorialTargetResolver.IsMapBuildTarget = function(owner, targetKey) {
    targetKey = owner.NormalizeOrderParam(targetKey)
    return targetKey.indexOf('mapId=') >= 0 && targetKey.indexOf('buildId=') >= 0
}

MergeTutorialTargetResolver.GetCurrentMapBuildTarget = function(owner) {
    var stepMeta = owner.activeTriggerStepMeta || owner.currentMeta
    if (!stepMeta || !stepMeta.CompleteParam) return null
    var targetKey = owner.NormalizeOrderParam(stepMeta.CompleteParam())
    if (targetKey.indexOf('mapId=') < 0 || targetKey.indexOf('buildId=') < 0) return null
    var target = owner.ParseKeyValueParam(targetKey)
    if (!target.buildId) return null
    if (target.mapId && typeof Game !== 'undefined' && Game.SUserVillage && Game.SUserVillage.MergeMapId && String(Game.SUserVillage.MergeMapId()) !== String(target.mapId)) return null
    return target
}

MergeTutorialTargetResolver.GetNodeWorldGeometry = function(owner, node, padding) {
    var transform = getUiTransform(node)
    if (!transform) return null
    var worldPos = owner.GetNodeGuideWorldPos(node)
    var getScale = new Vec2(0, 0)
    var scale = node.getWorldScale(getScale)
    var width = Math.abs((transform.contentSize.width || 100) * (scale.x || 1))
    var height = Math.abs((transform.contentSize.height || 100) * (scale.y || 1))
    var diameter = Math.max(width, height, 100) + (padding || 30)
    return {
        shape: owner.GetHighlightShape('circle'),
        x: worldPos.x,
        y: worldPos.y,
        width: diameter,
        height: diameter,
        tweenDuration: 0.2,
    }
}

MergeTutorialTargetResolver.GetMapBuildWorldGeometry = function(owner, node) {
    if (!getUiTransform(node)) return null
    var worldPos = owner.GetNodeGuideWorldPos(node)
    if (!worldPos) return null
    var diameter = owner.MapBuildGuideDiameter || 150
    return {
        shape: owner.GetHighlightShape('circle'),
        x: worldPos.x,
        y: worldPos.y,
        width: diameter,
        height: diameter,
        tweenDuration: 0.2,
    }
}

MergeTutorialTargetResolver.GetNodeGuideWorldPos = function(owner, node) {
    if (!getUiTransform(node)) return null
    var worldPos = nodeToWorld(node, new Vec2(0, 0))
    if (owner.IsMapBuildNode(node)) {
        var camera = owner.GetVillageCamera()
        var screenPos = owner.GetCameraWorldToScreenPoint(camera, worldPos)
        if (screenPos) {
            return owner.ConvertScreenPointToUiWorldPos(screenPos)
        }
    }
    return worldPos
}

MergeTutorialTargetResolver.GetCameraWorldToScreenPoint = function(owner, camera, worldPos) {
    if (!camera || !worldPos || !camera.worldToScreen) return null
    var out = new Vec3(0, 0, 0)
    var result = null
    try {
        result = camera.worldToScreen(new Vec3(worldPos.x, worldPos.y, worldPos.z || 0), out)
    } catch (e) {
        try {
            result = camera.worldToScreen(new Vec3(worldPos.x, worldPos.y, worldPos.z || 0))
        } catch (ignore) {
            result = null
        }
    }
    result = result || out
    return result ? new Vec2(result.x, result.y) : null
}

MergeTutorialTargetResolver.ConvertScreenPointToUiWorldPos = function(owner, screenPos) {
    if (!screenPos) return null
    var uiCamera = typeof UIRoot !== 'undefined' && UIRoot.instance ? UIRoot.instance.mainCamera : null
    var point = new Vec3(screenPos.x, screenPos.y, screenPos.z || 0)
    if (uiCamera) {
        var out = new Vec3(0, 0, 0)
        var result = null
        try {
            if (typeof uiCamera.screenToWorld === 'function') {
                result = uiCamera.screenToWorld(point, out)
                result = result || out
            }
        } catch (e) {
            result = null
        }
        if (result) return new Vec2(result.x, result.y)
    }
    if (typeof UIRoot !== 'undefined' && UIRoot.instance && UIRoot.instance.node && getUiTransform(UIRoot.instance.node)) {
        var localPos = new Vec2(screenPos.x - view.getVisibleSize().width / 2, screenPos.y - view.getVisibleSize().height / 2)
        return nodeToWorld(UIRoot.instance.node, localPos)
    }
    return new Vec2(screenPos.x - view.getVisibleSize().width / 2, screenPos.y - view.getVisibleSize().height / 2)
}

MergeTutorialTargetResolver.GetVillageCamera = function(owner) {
    var cameraNode = find && find('Canvas/VillageCamera')
    return cameraNode ? cameraNode.getComponent(Camera) : null
}

MergeTutorialTargetResolver.IsMapBuildNode = function(owner, node) {
    var buildRoot = owner.GetMapBuildRootNode()
    return !!(node && buildRoot && node.parent === buildRoot)
}

MergeTutorialTargetResolver.GetNodeWorldPos = function(owner, targetKey) {
    var node = owner.ResolveGuideTargetNode(targetKey)
    if (!getUiTransform(node)) return null
    return owner.GetNodeGuideWorldPos(node)
}

MergeTutorialTargetResolver.GetNodeHighlightGeometry = function(owner, targetKey) {
    var node = owner.ResolveGuideTargetNode(targetKey)
    if (!node) return null
    if (owner.IsMapBuildTarget(targetKey) || owner.IsMapBuildNode(node)) {
        return owner.GetMapBuildWorldGeometry(node)
    }
    return owner.GetNodeWorldGeometry(node, 30)
}

MergeTutorialTargetResolver.GetSpriteFrameByMergeId = function(owner, mergeId) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    if (levelNode && levelNode.GetSpriteFrameByMergeId) return levelNode.GetSpriteFrameByMergeId(mergeId)
    if (levelNode && levelNode.iconAtlas && typeof Meta !== 'undefined' && Meta.MetaManager && Meta.MetaType) {
        var meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId)
        if (meta && meta.Icon) return levelNode.iconAtlas.getSpriteFrame(meta.Icon())
    }
    return null
}

MergeTutorialTargetResolver.GetUiWorldCenter = function(owner) {
    if (typeof UIRoot !== 'undefined' && UIRoot.instance && UIRoot.instance.node && getUiTransform(UIRoot.instance.node)) {
        return nodeToWorld(UIRoot.instance.node, new Vec2(0, 0))
    }
    return new Vec2(0, 0)
}

MergeTutorialTargetResolver.GetUiLocalSize = function(owner) {
    var node = typeof UIRoot !== 'undefined' && UIRoot.instance ? UIRoot.instance.node : null
    var transform = getUiTransform(node)
    var winSize = view.getVisibleSize()
    return {
        width: transform && transform.contentSize.width ? transform.contentSize.width : winSize.width,
        height: transform && transform.contentSize.height ? transform.contentSize.height : winSize.height,
    }
}

MergeTutorialTargetResolver.GetUiFixedWorldPoint = function(owner, localPos) {
    if (typeof UIRoot !== 'undefined' && UIRoot.instance && UIRoot.instance.node && getUiTransform(UIRoot.instance.node)) {
        return nodeToWorld(UIRoot.instance.node, localPos)
    }
    return localPos
}

MergeTutorialTargetResolver.GetGeneratorRewardFlyFixedWorldPoint = function(owner, pointType) {
    var size = owner.GetUiLocalSize()
    var preset = owner.GeneratorRewardFlyScreenPreset || {}
    var halfWidth = size.width / 2
    var halfHeight = size.height / 2
    if (pointType === 'from') {
        return owner.GetUiFixedWorldPoint(new Vec2(
            halfWidth - (preset.fromRight || 72),
            -halfHeight + (preset.fromBottom || 72)
        ))
    }
    if (pointType === 'temp') {
        return owner.GetUiFixedWorldPoint(new Vec2(
            -halfWidth + (preset.tempLeft || 72),
            halfHeight - (preset.tempTop || 140)
        ))
    }
    return owner.GetUiFixedWorldPoint(new Vec2(0, 0))
}

MergeTutorialTargetResolver.GetGeneratorRewardFlyPoints = function(owner) {
    return {
        from: owner.GetGeneratorRewardFlyFixedWorldPoint('from'),
        center: owner.GetGeneratorRewardFlyFixedWorldPoint('center'),
        to: owner.GetGeneratorRewardFlyFixedWorldPoint('temp'),
    }
}

MergeTutorialTargetResolver.Clamp = function(owner, value, min, max) {
    return Math.max(min, Math.min(max, value))
}

MergeTutorialTargetResolver.GetMergeTileWorldSize = function(owner) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    if (!levelNode || !levelNode.getMergeBoardLayout || !levelNode.node) return 0
    var layout = levelNode.getMergeBoardLayout()
    if (!layout || !layout.itemSize) return 0
    var scale = new Vec2(1, 1)
    if (levelNode.node.getWorldScale) {
        try {
            levelNode.node.getWorldScale(scale)
        } catch (e) {
            scale = new Vec2(1, 1)
        }
    }
    return Math.max(
        Math.abs((layout.itemSize.x || 0) * (scale.x || 1)),
        Math.abs((layout.itemSize.y || 0) * (scale.y || 1))
    )
}

MergeTutorialTargetResolver.GetMergeBoardWorldGeometry = function(owner, preset) {
    var levelNode = owner.GetMergeLevelNode ? owner.GetMergeLevelNode() : null
    if (!levelNode || !levelNode.getMergeBoardLayout || !levelNode.node || !getUiTransform(levelNode.node)) return null
    var layout = levelNode.getMergeBoardLayout()
    if (!layout || !layout.nodeSize) return null
    var boardWidth = layout.nodeSize.x != null ? layout.nodeSize.x : layout.nodeSize.width
    var boardHeight = layout.nodeSize.y != null ? layout.nodeSize.y : layout.nodeSize.height
    if (boardWidth == null || boardHeight == null) return null
    var scale = new Vec2(1, 1)
    if (levelNode.node.getWorldScale) {
        try {
            levelNode.node.getWorldScale(scale)
        } catch (e) {
            scale = new Vec2(1, 1)
        }
    }
    var width = Math.abs(boardWidth * (scale.x || 1))
    var height = Math.abs(boardHeight * (scale.y || 1))
    if (width <= 0 || height <= 0) return null
    var center = nodeToWorld(levelNode.node, new Vec2(0, 0))
    if (!center) return null
    preset = preset || owner.MergeDragGuidePreset || {}
    return {
        shape: 'rect',
        x: center.x,
        y: center.y,
        width: width,
        height: height,
        cornerRadius: Math.min(preset.cornerRadius || 18, width / 2, height / 2),
        tweenDuration: preset.tweenDuration || 0.25,
    }
}

MergeTutorialTargetResolver.BuildTileHighlightGeometry = function(owner, worldPos, preset) {
    if (!worldPos) return null
    preset = preset || owner.MergeDragGuidePreset || {}
    if (owner.GetHighlightShape('circle') !== 'circle') {
        return owner.BuildRectHighlightGeometry(worldPos, worldPos, preset)
    }
    var tileSize = owner.GetMergeTileWorldSize()
    var diameter = tileSize > 0
        ? tileSize * (preset.tileCount || 2.5)
        : (preset.fallbackSize || 215)
    return {
        shape: owner.GetHighlightShape('circle'),
        x: worldPos.x,
        y: worldPos.y,
        width: diameter,
        height: diameter,
        tweenDuration: preset.tweenDuration || 0.25,
    }
}

MergeTutorialTargetResolver.BuildDynamicHighlightGeometry = function(owner, worldA, worldB, preset) {
    if (!worldA || !worldB) return null
    preset = preset || owner.MergeDragGuidePreset || {}
    if (owner.GetHighlightShape('circle') !== 'circle') {
        return owner.BuildRectHighlightGeometry(worldA, worldB, preset)
    }
    return owner.BuildTileHighlightGeometry(worldB, preset)
}

MergeTutorialTargetResolver.BuildGeneratorMergeDragHighlightGeometry = function(owner, worldA, worldB, preset) {
    if (!worldA || !worldB) return null
    preset = preset || owner.MergeDragGuidePreset || {}
    var boardGeometry = owner.GetMergeBoardWorldGeometry ? owner.GetMergeBoardWorldGeometry(preset) : null
    if (boardGeometry) return boardGeometry
    var rectPreset = {}
    for (var key in preset) {
        if (Object.prototype.hasOwnProperty.call(preset, key)) rectPreset[key] = preset[key]
    }
    return owner.BuildRectHighlightGeometry(worldA, worldB, rectPreset)
}

MergeTutorialTargetResolver.BuildRectHighlightGeometry = function(owner, worldA, worldB, preset) {
    if (!worldA) return null
    worldB = worldB || worldA
    preset = preset || owner.MergeDragGuidePreset || {}
    var tileSize = owner.GetMergeTileWorldSize()
    if (tileSize <= 0) tileSize = preset.rectFallbackTileSize || 80
    var padding = preset.rectPadding || 24
    var minSize = preset.rectMinSize || tileSize
    var width = Math.max(Math.abs(worldB.x - worldA.x) + tileSize + padding, minSize)
    var height = Math.max(Math.abs(worldB.y - worldA.y) + tileSize + padding, minSize)
    var radius = Math.min(preset.cornerRadius || 18, width / 2, height / 2)
    return {
        shape: 'rect',
        x: (worldA.x + worldB.x) / 2,
        y: (worldA.y + worldB.y) / 2,
        width: width,
        height: height,
        cornerRadius: radius,
        tweenDuration: preset.tweenDuration || 0.25,
    }
}

MergeTutorialTargetResolver.BuildOrderHighlightGeometry = function(owner, worldPos, preset) {
    if (!worldPos) return null
    preset = preset || {}
    var size = preset.size || 120
    var shape = owner.GetHighlightShape('circle')
    var radius = Math.min(preset.cornerRadius || owner.MergeDragGuidePreset.cornerRadius || 18, size / 2)
    return {
        shape: shape,
        x: worldPos.x,
        y: worldPos.y,
        width: size,
        height: size,
        cornerRadius: shape === 'circle' ? undefined : radius,
        tweenDuration: preset.tweenDuration || 0.25,
    }
}

MergeTutorialTargetResolver.GetMergeUI = function(owner) {
    if (typeof GamePlay === 'undefined' || !GamePlay.instance) return null
    if (!GamePlay.instance.mergeRoot) return null
    return GamePlay.instance.mergeRoot.mergeNodeUI || null
}

MergeTutorialTargetResolver.GetMergeLevelNode = function(owner) {
    if (typeof GamePlay === 'undefined' || !GamePlay.instance) return null
    if (!GamePlay.instance.mergeRoot) return null
    return GamePlay.instance.mergeRoot.mergeLevelNode || null
}

MergeTutorialTargetResolver.GetOrderSubmitOrder = function(owner) {
    var mergeUI = owner.GetMergeUI()
    if (!mergeUI || !mergeUI.node) return null
    var ordersRoot = owner.GetNodeByPath(mergeUI.node, 'topUI/table/view/content/orders')
    if (!ordersRoot && mergeUI.topUI) {
        ordersRoot = owner.GetNodeByPath(mergeUI.topUI, 'table/view/content/orders')
    }
    if (!ordersRoot) return null
    var children = ordersRoot.children || ordersRoot._children || []
    for (var i = 0; i < children.length; i++) {
        var child = children[i]
        if (!owner.IsNodeActive(child)) continue
        var order = child.getComponent ? child.getComponent('MergeOrder') : null
        if (order && owner.IsNodeActive(order.completeBtn)) return order
        return { node: child, completeBtn: null }
    }
    if (children.length > 0) return { node: children[0], completeBtn: null }
    return { node: ordersRoot, completeBtn: null }
}

MergeTutorialTargetResolver.GetOrderSubmitTargetNode = function(owner) {
    var order = owner.GetOrderSubmitOrder()
    if (!order) return null
    return owner.IsNodeActive(order.completeBtn) ? order.completeBtn : order.node
}

MergeTutorialTargetResolver.GetOrderSubmitHighlightNode = function(owner) {
    var order = owner.GetOrderSubmitOrder()
    return order ? order.node : null
}

MergeTutorialTargetResolver.GetNodeWorldRect = function(owner, node) {
    var transform = getUiTransform(node)
    if (!transform) return null
    var rect = transform.getBoundingBoxToWorld()
    if (!rect || rect.width == null || rect.height == null) return null
    return rect
}

MergeTutorialTargetResolver.MergeWorldRects = function(owner, rects) {
    if (!rects || rects.length <= 0) return null
    var minX = null
    var minY = null
    var maxX = null
    var maxY = null
    for (var i = 0; i < rects.length; i++) {
        var rect = rects[i]
        if (!rect || rect.width == null || rect.height == null) continue
        var x1 = rect.x
        var y1 = rect.y
        var x2 = rect.x + rect.width
        var y2 = rect.y + rect.height
        minX = minX == null ? x1 : Math.min(minX, x1)
        minY = minY == null ? y1 : Math.min(minY, y1)
        maxX = maxX == null ? x2 : Math.max(maxX, x2)
        maxY = maxY == null ? y2 : Math.max(maxY, y2)
    }
    if (minX == null || minY == null || maxX == null || maxY == null) return null
    return {
        x: minX,
        y: minY,
        width: Math.max(0, maxX - minX),
        height: Math.max(0, maxY - minY),
    }
}

MergeTutorialTargetResolver.GetOrderSubmitHighlightRect = function(owner) {
    var order = owner.GetOrderSubmitOrder()
    if (!order) return null
    var rects = []
    var roleNode = order.currentRoleNode || (order.mergeRoleNode ? order.mergeRoleNode.node : null)
    if (roleNode) {
        var roleRect = owner.GetNodeWorldRect(roleNode)
        if (roleRect) rects.push(roleRect)
    }
    var btnRect = owner.GetNodeWorldRect(order.completeBtn)
    if (btnRect) rects.push(btnRect)
    if (rects.length > 0) return owner.MergeWorldRects(rects)
    return owner.GetNodeWorldRect(order.node)
}

MergeTutorialTargetResolver.BuildRectHighlightGeometryFromWorldRect = function(owner, rect, preset) {
    if (!rect || rect.width == null || rect.height == null) return null
    preset = preset || {}
    var padding = preset.padding != null ? preset.padding : 0
    var width = Math.max(0, rect.width + padding)
    var height = Math.max(0, rect.height + padding)
    var radius = Math.min(preset.cornerRadius || owner.MergeDragGuidePreset.cornerRadius || 18, width / 2, height / 2)
    return {
        shape: 'rect',
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        width: width,
        height: height,
        cornerRadius: radius,
        tweenDuration: preset.tweenDuration || 0.25,
    }
}

MergeTutorialTargetResolver.GetOrderSubmitHighlightGeometry = function(owner, preset) {
    return owner.BuildRectHighlightGeometryFromWorldRect(owner.GetOrderSubmitHighlightRect(), preset)
}

export default MergeTutorialTargetResolver
