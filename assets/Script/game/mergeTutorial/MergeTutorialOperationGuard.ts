import '../../LegacyGlobals';

const MergeTutorialOperationGuard: any = {}

MergeTutorialOperationGuard.NormalizeOrderParam = function(owner, value) {
    if (value === undefined || value === null) return ''
    return String(value).trim()
}

MergeTutorialOperationGuard.NormalizeTileKey = function(owner, tileKey) {
    if (!tileKey) return ''
    tileKey = String(tileKey)
    if (tileKey.indexOf('lock_') === 0) return tileKey.substring(5)
    return tileKey
}

MergeTutorialOperationGuard.ResolveDynamicTileKey = function(owner, tileKey) {
    tileKey = owner.NormalizeTileKey(tileKey)
    var match = tileKey.match(/^dynamic_(claimed|board)_(\d+)$/)
    if (!match) return tileKey
    var state = owner.generatorGuideState || {}
    if (String(state.mergeId || '') !== String(match[2])) return ''
    return match[1] === 'claimed'
        ? owner.NormalizeTileKey(state.claimedCellKey)
        : owner.NormalizeTileKey(state.boardCellKey)
}

MergeTutorialOperationGuard.ParseMergeDragParam = function(owner, param) {
    if (!param) return null
    var parts = String(param).split('>')
    return {
        from: owner.ResolveDynamicTileKey(parts[0] || ''),
        to: owner.ResolveDynamicTileKey(parts[1] || ''),
    }
}

MergeTutorialOperationGuard.GetCurrentMergeDragParam = function(owner, stepMeta) {
    stepMeta = stepMeta || owner.activeTriggerStepMeta || owner.currentMeta
    if (!stepMeta || stepMeta.CompleteType() !== owner.CompleteTypes.MergeDrag) return null
    var drag = owner.ParseMergeDragParam(stepMeta.CompleteParam())
    if (!drag) return null
    return drag
}

MergeTutorialOperationGuard.GetCurrentDragGuideTiles = function(owner) {
    var stepMeta = owner.activeTriggerStepMeta || owner.currentMeta
    if (stepMeta && stepMeta.CompleteType && stepMeta.CompleteType() === owner.CompleteTypes.DragToBackpack) {
        return {
            from: stepMeta.CompleteParam ? stepMeta.CompleteParam() : 'highest_normal',
            to: 'backpack_button',
        }
    }
    var drag = owner.GetCurrentMergeDragParam(stepMeta)
    if (!drag) return null
    return {
        from: drag.from,
        to: drag.to,
    }
}

MergeTutorialOperationGuard.ParseGeneratorParam = function(owner, param) {
    if (!param) return null
    var parts = String(param).split(':')
    return {
        tile: owner.NormalizeTileKey(parts[0] || ''),
        count: parts[1] ? parseInt(parts[1], 10) : 1,
    }
}

MergeTutorialOperationGuard.MatchTutorialOrderParam = function(owner, completeParam, payload) {
    if (!completeParam) return true
    payload = payload || {}
    var expected = owner.NormalizeOrderParam(completeParam)
    var candidates = [payload.slotIndex, payload.orderId, payload.orderKey]
    for (var i = 0; i < candidates.length; i++) {
        if (owner.NormalizeOrderParam(candidates[i]) === expected) {
            return true
        }
    }
    return false
}

MergeTutorialOperationGuard.MatchDragToBackpackParam = function(owner, completeParam, payload) {
    payload = payload || {}
    var expected = owner.NormalizeOrderParam(completeParam)
    if (!expected || expected === 'highest_normal') return !!payload.success
    var candidates = [payload.targetKey, payload.from, payload.tile, payload.mergeId]
    for (var i = 0; i < candidates.length; i++) {
        if (owner.NormalizeOrderParam(candidates[i]) === expected) return !!payload.success
    }
    return false
}

MergeTutorialOperationGuard.MatchDragToBackpackStartParam = function(owner, completeParam, payload) {
    payload = payload || {}
    var expected = owner.NormalizeOrderParam(completeParam)
    if (!expected || expected === 'highest_normal') {
        var highestItem = owner.GetHighestLvNormalMergeItem ? owner.GetHighestLvNormalMergeItem() : null
        if (!highestItem || !highestItem.node) return false
        var nodeName = highestItem.node.name
        return owner.NormalizeTileKey(payload.from) === owner.NormalizeTileKey(nodeName)
    }
    return owner.NormalizeOrderParam(payload.from) === expected
}

MergeTutorialOperationGuard.MatchCurrentMapBuildPayload = function(owner, expected, payload) {
    if (expected !== 'building_buy_button' && expected !== 'building_upgrade_button') return true
    payload = payload || {}
    var target = owner.GetCurrentMapBuildTarget ? owner.GetCurrentMapBuildTarget() : null
    if (!target) return true
    if (target.mapId && String(payload.mapId || payload.mapID || '') !== String(target.mapId)) return false
    if (target.buildId && String(payload.buildId || payload.buildID || '') !== String(target.buildId)) return false
    return true
}

MergeTutorialOperationGuard.MatchNodeClickParam = function(owner, completeParam, payload) {
    if (!completeParam) return true
    payload = payload || {}
    var expected = owner.NormalizeOrderParam(completeParam)
    var candidates = [payload.nodeKey, payload.targetKey, payload.key, payload.node]
    for (var i = 0; i < candidates.length; i++) {
        if (owner.NormalizeOrderParam(candidates[i]) === expected) {
            return owner.MatchCurrentMapBuildPayload(expected, payload)
        }
    }
    return false
}

MergeTutorialOperationGuard.MatchFlowEventParam = function(owner, completeParam, payload) {
    if (!completeParam) return true
    payload = payload || {}
    var expected = owner.ParseKeyValueParam(completeParam)
    var eventKey = expected.event || expected.eventName || expected.nodeKey || expected.key
    if (!eventKey) {
        eventKey = String(completeParam).split(';')[0]
    }
    if (eventKey && !owner.MatchNodeClickParam(eventKey, payload)) return false
    if (expected.mapId && String(payload.mapId || payload.mapID || '') !== String(expected.mapId)) return false
    if (expected.buildId && String(payload.buildId || payload.buildID || '') !== String(expected.buildId)) return false
    return true
}

MergeTutorialOperationGuard.IsBuildWindowStepMapBuildClick = function(owner, stepMeta, payload) {
    if (!stepMeta || !stepMeta.CompleteType || stepMeta.CompleteType() !== owner.CompleteTypes.NodeClick) return false
    payload = payload || {}

    var completeParam = owner.NormalizeOrderParam(stepMeta.CompleteParam ? stepMeta.CompleteParam() : '')
    var wantsBuyWindow = completeParam === 'building_buy_button'
    var wantsUpgradeWindow = completeParam === 'building_upgrade_button'
    if (!wantsBuyWindow && !wantsUpgradeWindow) return false

    var nodeKey = owner.NormalizeOrderParam(payload.nodeKey || payload.targetKey || payload.key || payload.node)
    if (!nodeKey || !owner.IsMapBuildTarget || !owner.IsMapBuildTarget(nodeKey)) return false

    var clickedTarget = owner.ParseKeyValueParam(nodeKey)
    clickedTarget.mapId = clickedTarget.mapId || clickedTarget.mapID || clickedTarget.map_id || payload.mapId || payload.mapID || payload.map_id
    clickedTarget.buildId = clickedTarget.buildId || clickedTarget.buildID || clickedTarget.build_id || payload.buildId || payload.buildID || payload.build_id
    if (!clickedTarget.mapId || !clickedTarget.buildId) return false

    var expectedTarget = owner.GetTriggerBuildTargetParam ? owner.GetTriggerBuildTargetParam(stepMeta) : null
    if (!expectedTarget) return false
    if (expectedTarget.mapId && String(clickedTarget.mapId) !== String(expectedTarget.mapId)) return false
    if (expectedTarget.buildId && String(clickedTarget.buildId) !== String(expectedTarget.buildId)) return false

    if (typeof Game === 'undefined' || !Game.SUserMap || !Game.SUserMap.GetBuildActionContext) return false
    var context = Game.SUserMap.GetBuildActionContext(clickedTarget.mapId + '_' + clickedTarget.buildId)
    if (!context || !context.windowName) return false
    if (wantsBuyWindow) return context.windowName === 'MapBuyBuildWindow'
    return context.windowName === 'MapBuildUpgradeWindow' || context.windowName === 'MapBuildStageUpgradeWindow'
}

MergeTutorialOperationGuard.IsWaitingNodeClick = function(owner, nodeKey) {
    var stepMeta = owner.activeTriggerStepMeta || owner.currentMeta
    return !!(stepMeta &&
        stepMeta.CompleteType &&
        stepMeta.CompleteType() === owner.CompleteTypes.NodeClick &&
        owner.MatchNodeClickParam(stepMeta.CompleteParam(), { nodeKey: nodeKey }))
}

MergeTutorialOperationGuard.ShouldBlockGuideInput = function(owner) {
    if (owner.activeTriggerStepMeta) {
        return !!(owner.activeTriggerBlockMode === owner.TriggerBlockModes.Force &&
            owner.activeTriggerStepMeta.CompleteType &&
            owner.activeTriggerStepMeta.CompleteType() !== owner.CompleteTypes.FullscreenClick)
    }
    if (!owner.IsMainForcedTutorialActive()) return false
    if (!owner.currentGuideMeta) return false
    if (owner.currentMeta &&
        owner.currentMeta.CompleteType &&
        owner.currentMeta.CompleteType() === owner.CompleteTypes.FullscreenClick) {
        return false
    }
    var guideType = owner.currentGuideMeta.GuideType ? owner.currentGuideMeta.GuideType() : ''
    var highlightType = owner.currentGuideMeta.HighlightType ? owner.currentGuideMeta.HighlightType() : ''
    return !!(guideType === 'drag' ||
        guideType === 'click' ||
        guideType === 'order_submit' ||
        highlightType === 'tile' ||
        highlightType === 'order' ||
        highlightType === 'node')
}

MergeTutorialOperationGuard.ShouldUseFullScreenGuideBlocker = function(owner) {
    if (!owner.activeTriggerStepMeta ||
        owner.activeTriggerBlockMode !== owner.TriggerBlockModes.Force ||
        !owner.activeTriggerStepMeta.CompleteType ||
        owner.activeTriggerStepMeta.CompleteType() === owner.CompleteTypes.FullscreenClick) {
        return false
    }
    if (!owner.activeTriggerGuideMeta) return true
    var guideType = owner.activeTriggerGuideMeta.GuideType ? owner.activeTriggerGuideMeta.GuideType() : ''
    var highlightType = owner.activeTriggerGuideMeta.HighlightType ? owner.activeTriggerGuideMeta.HighlightType() : ''
    var mask = owner.activeTriggerGuideMeta.Mask ? owner.activeTriggerGuideMeta.Mask() : false
    return !mask || guideType === 'none' || highlightType === 'none'
}

MergeTutorialOperationGuard.ShouldBlockMapControl = function(owner) {
    return !!(owner.activeTriggerStepMeta &&
        owner.activeTriggerBlockMode === owner.TriggerBlockModes.Force)
}

MergeTutorialOperationGuard.ShouldUseStaticMergeDragGuideTiles = function(owner) {
    var stepMeta = owner.activeTriggerStepMeta || owner.currentMeta
    if (owner.IsP5GeneratorMergeDragStep && owner.IsP5GeneratorMergeDragStep(stepMeta)) return true
    return owner.IsMainForcedTutorialActive() &&
        owner.currentMeta &&
        owner.currentMeta.CompleteType &&
        owner.currentMeta.CompleteType() === owner.CompleteTypes.MergeDrag
}

MergeTutorialOperationGuard.ShouldAllowMergeDragMove = function(owner, tileKey) {
    if (!owner.ShouldUseStaticMergeDragGuideTiles()) return true
    var drag = owner.GetCurrentMergeDragParam()
    if (!drag) return true
    tileKey = owner.NormalizeTileKey(tileKey)
    return tileKey === drag.from || tileKey === drag.to
}

MergeTutorialOperationGuard.UpdateMergeDragGuideStartTile = function(owner, tileKey, oldTileKey) {
    if (!owner.currentMeta || owner.currentMeta.CompleteType() !== owner.CompleteTypes.MergeDrag) return false
    if (owner.ShouldUseStaticMergeDragGuideTiles()) return false
    if (oldTileKey && !owner.CanOperate(owner.EventTypes.MergeDragStart, { from: oldTileKey })) return false
    tileKey = owner.NormalizeTileKey(tileKey)
    if (!tileKey) return false
    owner.currentDragStartTile = tileKey
    if (owner.mainWindow) {
        if (owner.mainWindow.refreshDragGuidePosition) owner.mainWindow.refreshDragGuidePosition()
        if (owner.mainWindow.refreshDragHighlightPosition) owner.mainWindow.refreshDragHighlightPosition()
    }
    return true
}

MergeTutorialOperationGuard.MatchStepComplete = function(owner, stepMeta, eventName, payload, progressPrefix) {
    if (!stepMeta) return false
    var completeType = stepMeta.CompleteType()
    var completeParam = stepMeta.CompleteParam()
    payload = payload || {}
    if (completeType !== eventName) return false
    if (completeType === owner.CompleteTypes.FullscreenClick) return true
    if (completeType === owner.CompleteTypes.MergeDrag) {
        var drag = stepMeta === owner.currentMeta ? owner.GetCurrentMergeDragParam() : owner.ParseMergeDragParam(completeParam)
        return !!(drag && owner.NormalizeTileKey(payload.from) === drag.from && owner.NormalizeTileKey(payload.to) === drag.to)
    }
    if (completeType === owner.CompleteTypes.GeneratorClick) {
        var gen = owner.ParseGeneratorParam(completeParam)
        if (!gen || owner.NormalizeTileKey(payload.tile) !== gen.tile) {
            return false
        }
        var key = (progressPrefix || 'step') + '_' + stepMeta.Id() + '_' + gen.tile
        owner.generatorClickProgress[key] = (owner.generatorClickProgress[key] || 0) + 1
        return owner.generatorClickProgress[key] >= gen.count
    }
    if (completeType === owner.CompleteTypes.TutorialOrderSubmit) {
        return owner.MatchTutorialOrderParam(completeParam, payload)
    }
    if (completeType === owner.CompleteTypes.NodeClick) {
        return owner.MatchNodeClickParam(completeParam, payload)
    }
    if (completeType === owner.CompleteTypes.DragToBackpack) {
        return owner.MatchDragToBackpackParam(completeParam, payload)
    }
    if (completeType === owner.CompleteTypes.FlowEvent) {
        return owner.MatchFlowEventParam(completeParam, payload)
    }
    return false
}

MergeTutorialOperationGuard.CanOperateByStepMeta = function(owner, stepMeta, type, payload, useCurrentDrag) {
    if (!stepMeta) return true
    payload = payload || {}
    var forbidEvents = stepMeta.ForbidEventList ? stepMeta.ForbidEventList() : []
    if (forbidEvents.indexOf(type) >= 0) return false
    var completeType = stepMeta.CompleteType()
    var completeParam = stepMeta.CompleteParam()
    if (type === owner.EventTypes.MergeDragStart && completeType === owner.CompleteTypes.DragToBackpack) {
        return owner.MatchDragToBackpackStartParam(completeParam, payload)
    }
    if (type === owner.EventTypes.MergeDrag && completeType === owner.CompleteTypes.DragToBackpack) {
        return owner.MatchDragToBackpackStartParam(completeParam, payload)
    }
    if (type === owner.EventTypes.MergeDragStart) {
        if (completeType !== owner.CompleteTypes.MergeDrag) return false
        var startDrag = useCurrentDrag ? owner.GetCurrentMergeDragParam() : owner.ParseMergeDragParam(completeParam)
        return !!(startDrag && owner.NormalizeTileKey(payload.from) === startDrag.from)
    }
    if (type === owner.EventTypes.MergeDrag && completeType === owner.CompleteTypes.MergeDrag) {
        var drag = useCurrentDrag ? owner.GetCurrentMergeDragParam() : owner.ParseMergeDragParam(completeParam)
        return !!(drag && owner.NormalizeTileKey(payload.from) === drag.from && owner.NormalizeTileKey(payload.to) === drag.to)
    }
    if (type === owner.EventTypes.GeneratorClick && completeType === owner.CompleteTypes.GeneratorClick) {
        var gen = owner.ParseGeneratorParam(completeParam)
        return !!(gen && owner.NormalizeTileKey(payload.tile) === gen.tile)
    }
    if (type === owner.EventTypes.TutorialOrderSubmit && completeType === owner.CompleteTypes.TutorialOrderSubmit) {
        return owner.MatchTutorialOrderParam(completeParam, payload)
    }
    if (type === owner.EventTypes.NodeClick && completeType === owner.CompleteTypes.NodeClick) {
        if (owner.IsBuildWindowStepMapBuildClick && owner.IsBuildWindowStepMapBuildClick(stepMeta, payload)) {
            return true
        }
        return owner.MatchNodeClickParam(completeParam, payload)
    }
    if (type === owner.EventTypes.DragToBackpack && completeType === owner.CompleteTypes.DragToBackpack) {
        return owner.MatchDragToBackpackParam(completeParam, payload)
    }
    if (type === owner.EventTypes.FlowEvent && completeType === owner.CompleteTypes.FlowEvent) {
        return owner.MatchFlowEventParam(completeParam, payload)
    }
    if (type === owner.EventTypes.MergeDrag ||
        type === owner.EventTypes.GeneratorClick ||
        type === owner.EventTypes.TutorialOrderSubmit ||
        type === owner.EventTypes.NodeClick ||
        type === owner.EventTypes.DragToBackpack ||
        type === owner.EventTypes.FlowEvent) {
        return false
    }
    return true
}

MergeTutorialOperationGuard.CanOperate = function(owner, type, payload) {
    if (owner.activeTriggerStepMeta && owner.activeTriggerBlockMode === owner.TriggerBlockModes.Force) {
        return owner.CanOperateByStepMeta(owner.activeTriggerStepMeta, type, payload, false)
    }
    if (owner.ShouldBlockForceGuideGlobalUi && owner.ShouldBlockForceGuideGlobalUi()) {
        return false
    }
    if (owner.IsFinished()) {
        return true
    }
    if (owner.isReportingFinish) {
        return false
    }
    if (!owner.currentMeta) {
        return true
    }
    return owner.CanOperateByStepMeta(owner.currentMeta, type, payload, true)
}

MergeTutorialOperationGuard.CanOperateNodeClick = function(owner, nodeKey, payload) {
    payload = payload || {}
    payload.nodeKey = nodeKey
    return owner.CanOperate(owner.EventTypes.NodeClick, payload)
}

export default MergeTutorialOperationGuard