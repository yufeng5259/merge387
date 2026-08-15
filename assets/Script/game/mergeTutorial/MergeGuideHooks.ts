import '../../LegacyGlobals';
import MergeTutorialManager from './MergeTutorialManager';

const MergeGuideHooks: any = {}

MergeGuideHooks.GetManager = function() {
    if (typeof Game !== 'undefined' && Game.MergeTutorialManager) {
        return Game.MergeTutorialManager
    }
    return MergeTutorialManager
}

MergeGuideHooks.Call = function(methodName) {
    var manager = this.GetManager()
    if (!manager || typeof manager[methodName] !== 'function') return undefined
    var args = Array.prototype.slice.call(arguments, 1)
    return manager[methodName].apply(manager, args)
}

MergeGuideHooks.IsFinished = function() {
    var result = this.Call('IsFinished')
    return result === undefined ? true : !!result
}

MergeGuideHooks.IsRunning = function() {
    return !!this.Call('IsRunning')
}

MergeGuideHooks.init = function() {
    return this.Call('init')
}

MergeGuideHooks.Clear = function() {
    return this.Call('Clear')
}

MergeGuideHooks.SetFinishCallback = function(cb) {
    return this.Call('SetFinishCallback', cb)
}

MergeGuideHooks.CanAutoOpenSignWindow = function() {
    var result = this.Call('CanAutoOpenSignWindow')
    return result === undefined ? true : !!result
}

MergeGuideHooks.RefreshMainForcedTutorialHiddenControls = function() {
    return this.Call('RefreshMainForcedTutorialHiddenControls')
}

MergeGuideHooks.RefreshCurrentWindow = function() {
    return this.Call('RefreshCurrentWindow')
}

MergeGuideHooks.CloseTutorialWindow = function() {
    return this.Call('CloseTutorialWindow')
}

MergeGuideHooks.CanOperate = function(type, payload) {
    var result = this.Call('CanOperate', type, payload)
    return result === undefined ? true : !!result
}

MergeGuideHooks.CanOperateNodeClick = function(nodeKey, payload) {
    var result = this.Call('CanOperateNodeClick', nodeKey, payload)
    return result === undefined ? true : !!result
}

MergeGuideHooks.Emit = function(eventName, payload) {
    return this.Call('Emit', eventName, payload)
}

MergeGuideHooks.EmitNodeClick = function(nodeKey, payload) {
    return this.Call('EmitNodeClick', nodeKey, payload)
}

MergeGuideHooks.EmitTrigger = function(eventName, payload) {
    return this.Call('EmitTrigger', eventName, payload)
}

MergeGuideHooks.EmitFlowEvent = function(eventKey, payload) {
    return this.Call('EmitFlowEvent', eventKey, payload)
}

MergeGuideHooks.ScheduleTriggerStartRetry = function(delay) {
    return this.Call('ScheduleTriggerStartRetry', delay)
}

MergeGuideHooks.ShouldBlockForceGuideGlobalUi = function() {
    return !!this.Call('ShouldBlockForceGuideGlobalUi')
}

MergeGuideHooks.ShouldBlockMapControl = function() {
    return !!this.Call('ShouldBlockMapControl')
}

MergeGuideHooks.ShouldShowShopEntryButton = function() {
    var result = this.Call('ShouldShowShopEntryButton')
    return result === undefined ? true : !!result
}

MergeGuideHooks.ShouldShowBoardBuildButton = function() {
    var result = this.Call('ShouldShowBoardBuildButton')
    return result === undefined ? true : !!result
}

MergeGuideHooks.ShouldShowStoreButton = function() {
    var result = this.Call('ShouldShowStoreButton')
    return result === undefined ? true : !!result
}

MergeGuideHooks.ShouldHideMainForcedTutorialControls = function() {
    return !!this.Call('ShouldHideMainForcedTutorialControls')
}

MergeGuideHooks.IsWaitingNodeClick = function(nodeKey) {
    return !!this.Call('IsWaitingNodeClick', nodeKey)
}

MergeGuideHooks.ResolveGuideTargetNode = function(targetKey) {
    return this.Call('ResolveGuideTargetNode', targetKey) || null
}

MergeGuideHooks.GetNodeByPath = function(root, path) {
    return this.Call('GetNodeByPath', root, path) || null
}

MergeGuideHooks.GetCurrentMergeDragParam = function(stepMeta) {
    return this.Call('GetCurrentMergeDragParam', stepMeta) || null
}

MergeGuideHooks.ParseGeneratorParam = function(param) {
    return this.Call('ParseGeneratorParam', param) || null
}

MergeGuideHooks.GetMergeIdFromDataStr = function(dataStr) {
    return this.Call('GetMergeIdFromDataStr', dataStr) || ''
}

MergeGuideHooks.GetTriggerMeta = function(triggerId) {
    return this.Call('GetTriggerMeta', triggerId) || null
}

MergeGuideHooks.GetTriggerMetas = function() {
    return this.Call('GetTriggerMetas') || {}
}

Object.defineProperty(MergeGuideHooks, 'mainWindow', {
    get: function() {
        var manager = this.GetManager()
        return manager ? manager.mainWindow : null
    },
})

Object.defineProperty(MergeGuideHooks, 'currentMeta', {
    get: function() {
        var manager = this.GetManager()
        return manager ? manager.currentMeta : null
    },
})

Object.defineProperty(MergeGuideHooks, 'activeTriggerStepMeta', {
    get: function() {
        var manager = this.GetManager()
        return manager ? manager.activeTriggerStepMeta : null
    },
})

Object.defineProperty(MergeGuideHooks, 'CompleteTypes', {
    get: function() {
        var manager = this.GetManager()
        return manager && manager.CompleteTypes ? manager.CompleteTypes : {}
    },
})

Object.defineProperty(MergeGuideHooks, 'EventTypes', {
    get: function() {
        var manager = this.GetManager()
        return manager && manager.EventTypes ? manager.EventTypes : {
            BackMap: 'back_map',
            Sell: 'sell',
            MergeDragStart: 'merge_drag_start',
            MergeDrag: 'merge_drag',
            GeneratorClick: 'generator_click',
            TutorialOrderSubmit: 'tutorial_order_submit',
            NodeClick: 'node_click',
            DragToBackpack: 'drag_to_backpack',
            FlowEvent: 'flow_event',
        }
    },
})

if (typeof Game !== 'undefined') {
    Game.MergeGuideHooks = MergeGuideHooks
}

export default MergeGuideHooks
