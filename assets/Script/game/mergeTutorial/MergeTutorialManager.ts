import '../../LegacyGlobals';
import { Camera, Color, find, isValid, Node, UITransform, Vec2, Vec3, view } from 'cc';
import MergeTutorialBusinessAdapter from './MergeTutorialBusinessAdapter';
import MergeTutorialOperationGuard from './MergeTutorialOperationGuard';
import MergeTutorialStateMachine from './MergeTutorialStateMachine';
import MergeTutorialTargetResolver from './MergeTutorialTargetResolver';
import MergeTutorialUIController from './MergeTutorialUIController';

function nodeToWorld(node: Node, point: Vec2 | Vec3) {
    const transform = node && node.getComponent(UITransform)
    return transform ? transform.convertToWorldSpaceAR(new Vec3(point.x, point.y, 'z' in point ? point.z : 0)) : new Vec3()
}

const MergeTutorialManager: any = {
}

MergeTutorialManager.finish_report_id = 1000130
MergeTutorialManager.MainTutorialGroupId = 100
MergeTutorialManager.StartId = 1000010
MergeTutorialManager.MainTutorialLocalStepKey = 'MergeTutorial_MainForcedStep'
MergeTutorialManager.TriggerGuideLocalProgressKey = 'MergeTutorial_TriggerGuideProgress'
MergeTutorialManager.TriggerGuideLocalProgressVersion = 1
MergeTutorialManager.TriggerGuideLocalProgressTtl = 7 * 24 * 60 * 60 * 1000
MergeTutorialManager.currentId = 0
MergeTutorialManager.currentMeta = null
MergeTutorialManager.currentGuideMeta = null
MergeTutorialManager.mainWindow = null
MergeTutorialManager.finishCallback = null
MergeTutorialManager.isReportingFinish = false
MergeTutorialManager.finishRetryTimer = null
MergeTutorialManager.finishRetryDelay = 2000
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
MergeTutorialManager.savingServerStepIds = {}
MergeTutorialManager.savedServerStepIds = {}
MergeTutorialManager.serverStepSaveCallbacks = {}
MergeTutorialManager.completedTriggerReports = {}
MergeTutorialManager.triggerStartRetryTimer = null
MergeTutorialManager.triggerStartRetryDelay = 300
MergeTutorialManager.triggerStepContextRetryTimer = null
MergeTutorialManager.triggerStepContextRetryDelay = 300
MergeTutorialManager.triggerStateRecoverRetryTimer = null
MergeTutorialManager.triggerStateRecoverRetryDelay = 300
MergeTutorialManager.triggerStateRecoverRetryCount = 0
MergeTutorialManager.triggerStateRecoverRetryMaxCount = 20
MergeTutorialManager.openingTriggerBuildWindowStepId = 0
MergeTutorialManager.pendingTriggerStartSaveTriggerId = 0
MergeTutorialManager.triggerStartStepOverrides = {}
MergeTutorialManager.TriggerStartBlockWindows = [
    'LevelUpGetRewardWindow',
    'GetRewardWindow',
    'MainTutorialFinishWindow',
    'StoryWindow',
    'CardChestOpenWindow',
    'CardCollectWindow',
]
MergeTutorialManager.MapBuildGuideDiameter = 150
MergeTutorialManager.MainTutorialUseCircleHighlight = false
MergeTutorialManager.HighlightFrameEnabled = true
MergeTutorialManager.HighlightFrameColor = new Color(174, 255, 58, 255)
MergeTutorialManager.HighlightFrameLineWidth = 6
MergeTutorialManager.HighlightFramePadding = 0
MergeTutorialManager.MergeDragGuidePreset = {
    tileCount: 2.5,
    fallbackSize: 215,
    rectPadding: 24,
    rectFallbackTileSize: 80,
    rectMinSize: 80,
    cornerRadius: 18,
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
    FlowEvent: 'flow_event',
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
    FlowEvent: 'flow_event',
}
MergeTutorialManager.TriggerBlockModes = {
    None: 'none',
    Soft: 'soft',
    Force: 'force',
}
MergeTutorialManager.runningActionStepId = 0

MergeTutorialManager.ShouldSkipCompletedTrigger = function(triggerMeta) {
    return !!(triggerMeta &&
        triggerMeta.Once &&
        triggerMeta.Once() &&
        this.IsTriggerCompleted(triggerMeta))
}

MergeTutorialManager.CanAutoOpenSignWindow = function() {
    if (this.IsFinished && !this.IsFinished()) return false
    if (this.ShouldBlockForceGuideGlobalUi && this.ShouldBlockForceGuideGlobalUi()) return false
    return true
}

MergeTutorialManager.Clear = function() {
    MergeTutorialStateMachine.ResetRuntimeState(this)
}

MergeTutorialManager.GetCurrentId = function() {
    return MergeTutorialStateMachine.GetCurrentId(this)
}

MergeTutorialManager.IsMainForcedTutorialStep = function(stepMeta) {
    return MergeTutorialStateMachine.IsMainForcedTutorialStep(this, stepMeta)
}

MergeTutorialManager.GetPlayerPrefs = function() {
    return MergeTutorialStateMachine.GetPlayerPrefs()
}

MergeTutorialManager.IsValidMainTutorialLocalStepId = function(stepId) {
    return MergeTutorialStateMachine.IsValidMainTutorialLocalStepId(this, stepId)
}

MergeTutorialManager.SaveLocalMainTutorialStep = function(stepId) {
    return MergeTutorialStateMachine.SaveLocalMainTutorialStep(this, stepId)
}

MergeTutorialManager.LoadLocalMainTutorialStep = function() {
    return MergeTutorialStateMachine.LoadLocalMainTutorialStep(this)
}

MergeTutorialManager.ClearLocalMainTutorialStep = function() {
    return MergeTutorialStateMachine.ClearLocalMainTutorialStep(this)
}

MergeTutorialManager.ResolveMainTutorialStartId = function() {
    return MergeTutorialStateMachine.ResolveMainTutorialStartId(this)
}

MergeTutorialManager.GetNowMs = function() {
    return MergeTutorialStateMachine.GetNowMs()
}

MergeTutorialManager.LoadLocalTriggerProgressMap = function() {
    return MergeTutorialStateMachine.LoadLocalTriggerProgressMap(this)
}

MergeTutorialManager.SaveLocalTriggerProgressMap = function(progressMap) {
    return MergeTutorialStateMachine.SaveLocalTriggerProgressMap(this, progressMap)
}

MergeTutorialManager.ClearAllLocalTriggerProgress = function() {
    return MergeTutorialStateMachine.ClearAllLocalTriggerProgress(this)
}

MergeTutorialManager.GetLocalTriggerProgress = function(triggerMeta) {
    return MergeTutorialStateMachine.GetLocalTriggerProgress(this, triggerMeta)
}

MergeTutorialManager.SaveLocalTriggerProgress = function(triggerMeta, stepId) {
    return MergeTutorialStateMachine.SaveLocalTriggerProgress(this, triggerMeta, stepId)
}

MergeTutorialManager.ClearLocalTriggerProgress = function(triggerMeta) {
    return MergeTutorialStateMachine.ClearLocalTriggerProgress(this, triggerMeta)
}

MergeTutorialManager.IsMainForcedTutorialActive = function() {
    return MergeTutorialStateMachine.IsMainForcedTutorialActive(this)
}

MergeTutorialManager.ShouldHideMainForcedTutorialControls = function() {
    return !!(typeof Game !== 'undefined' &&
        Game.SUserMergeTutorial &&
        this.IsFinished &&
        !this.IsFinished())
}

MergeTutorialManager.GetBoardBuildButtonNodes = function() {
    return MergeTutorialBusinessAdapter.GetBoardBuildButtonNodes(this)
}

MergeTutorialManager.GetMainForcedTutorialBoardMapButton = function() {
    return MergeTutorialBusinessAdapter.GetMainForcedTutorialBoardMapButton(this)
}

MergeTutorialManager.GetBoardBuildButtonGuideTargetNode = function() {
    return MergeTutorialBusinessAdapter.GetBoardBuildButtonGuideTargetNode(this)
}

MergeTutorialManager.RefreshBoardBuildButtonVisibility = function() {
    return MergeTutorialBusinessAdapter.RefreshBoardBuildButtonVisibility(this)
}

MergeTutorialManager.ShouldBlockForceGuideGlobalUi = function() {
    return this.IsMainForcedTutorialActive()
}

MergeTutorialManager.ShouldShowBoardBuildButton = function() {
    return MergeTutorialBusinessAdapter.ShouldShowBoardBuildButton(this)
}

MergeTutorialManager.ShouldShowStoreButton = function() {
    return MergeTutorialBusinessAdapter.ShouldShowStoreButton(this)
}

MergeTutorialManager.ShouldShowShopEntryButton = function() {
    return MergeTutorialBusinessAdapter.ShouldShowShopEntryButton(this)
}

MergeTutorialManager.HideMainForcedTutorialSellButton = function() {
    return MergeTutorialBusinessAdapter.HideMainForcedTutorialSellButton(this)
}

MergeTutorialManager.RefreshMainShopEntryVisibility = function() {
    return MergeTutorialBusinessAdapter.RefreshMainShopEntryVisibility(this)
}

MergeTutorialManager.RefreshMainForcedTutorialHiddenControls = function() {
    return MergeTutorialBusinessAdapter.RefreshMainForcedTutorialHiddenControls(this)
}

MergeTutorialManager.GetHighlightShape = function(defaultShape) {
    if (this.IsMainForcedTutorialActive()) {
        return this.MainTutorialUseCircleHighlight ? 'circle' : 'rect'
    }
    return defaultShape || 'circle'
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
    // return true
    if (!Game.SUserMergeTutorial || !Game.SUserMergeTutorial.TutorialId) return false
    var cid = Game.SUserMergeTutorial.TutorialId(this.MainTutorialGroupId)
    if (!cid) return false
    var cmeta = this.GetMeta(cid)
    return !!(cmeta && cmeta.IsEnd && cmeta.IsEnd())
}

MergeTutorialManager.IsRunning = function() {
    return !this.IsFinished() && !!this.currentMeta
}

MergeTutorialManager.SetFinishCallback = function(cb) {
    this.finishCallback = cb
}

MergeTutorialManager.GetServerStepGroupId = function(stepId) {
    stepId = parseInt(stepId, 10)
    if (!stepId) return 0
    return Math.floor(stepId / 10000)
}

MergeTutorialManager.GetSavedServerStepId = function(groupId) {
    if (!groupId || typeof Game === 'undefined' || !Game.SUserMergeTutorial || !Game.SUserMergeTutorial.TutorialId) return 0
    return parseInt(Game.SUserMergeTutorial.TutorialId(groupId), 10) || 0
}

MergeTutorialManager.IsServerStepSaved = function(stepId) {
    stepId = parseInt(stepId, 10)
    if (!stepId) return false
    if (this.savedServerStepIds && this.savedServerStepIds[stepId]) return true
    var groupId = this.GetServerStepGroupId(stepId)
    var savedId = this.GetSavedServerStepId(groupId)
    return !!(savedId && savedId >= stepId)
}

MergeTutorialManager.ShouldSkipSaveServerStep = function(stepId) {
    stepId = parseInt(stepId, 10)
    if (!stepId) return true
    if (this.savingServerStepIds && this.savingServerStepIds[stepId]) return true
    return !!(this.IsServerStepSaved && this.IsServerStepSaved(stepId))
}

MergeTutorialManager.AddServerStepSaveCallback = function(stepId, onSuccess, onError) {
    if (typeof onSuccess !== 'function' && typeof onError !== 'function') return
    this.serverStepSaveCallbacks = this.serverStepSaveCallbacks || {}
    this.serverStepSaveCallbacks[stepId] = this.serverStepSaveCallbacks[stepId] || []
    this.serverStepSaveCallbacks[stepId].push({
        onSuccess: onSuccess,
        onError: onError,
    })
}

MergeTutorialManager.FlushServerStepSaveCallbacks = function(stepId, success, res) {
    if (!this.serverStepSaveCallbacks || !this.serverStepSaveCallbacks[stepId]) return
    var callbacks = this.serverStepSaveCallbacks[stepId]
    delete this.serverStepSaveCallbacks[stepId]
    for (var i = 0; i < callbacks.length; i++) {
        var cb = success ? callbacks[i].onSuccess : callbacks[i].onError
        if (typeof cb !== 'function') continue
        try {
            cb(res)
        } catch (e) {
            console.error('MergeTutorialManager SaveServerStep callback error', e)
        }
    }
}

MergeTutorialManager.SaveServerStep = function(stepId, onSuccess, onError, options) {
    stepId = parseInt(stepId, 10)
    options = options || {}
    if (!stepId) {
        if (typeof onError === 'function') onError({ error: 'invalid_step' })
        return false
    }
    this.savingServerStepIds = this.savingServerStepIds || {}
    this.savedServerStepIds = this.savedServerStepIds || {}
    if (this.savingServerStepIds[stepId]) {
        this.AddServerStepSaveCallback(stepId, onSuccess, onError)
        return true
    }
    if (this.savedServerStepIds[stepId]) {
        if (typeof onSuccess === 'function') onSuccess({ skipped: true })
        return true
    }
    if (!options.force && this.IsServerStepSaved && this.IsServerStepSaved(stepId)) {
        if (typeof onSuccess === 'function') onSuccess({ skipped: true })
        return true
    }
    if (typeof SR === 'undefined' || !SR.SRMergeTutorial || !SR.SRMergeTutorial.finishStep) {
        if (typeof onError === 'function') onError({ error: 'save_unavailable' })
        return false
    }
    this.AddServerStepSaveCallback(stepId, onSuccess, onError)
    this.savingServerStepIds[stepId] = true
    var req = SR.SRMergeTutorial.finishStep(stepId)
    if (!req || !req.SetCallBack || !req.Send) {
        delete this.savingServerStepIds[stepId]
        this.FlushServerStepSaveCallbacks(stepId, false, { error: 'invalid_request' })
        return false
    }
    req.SetCallBack(function(res) {
        delete MergeTutorialManager.savingServerStepIds[stepId]
        MergeTutorialManager.savedServerStepIds[stepId] = true
        if (res && res.userTutorial && Game.SUserMergeTutorial && Game.SUserMergeTutorial.updateData) {
            Game.SUserMergeTutorial.updateData(res.userTutorial)
        }
        if (MergeTutorialManager.SyncLocalTriggerProgressAfterServerSave) {
            MergeTutorialManager.SyncLocalTriggerProgressAfterServerSave(stepId)
        }
        MergeTutorialManager.FlushServerStepSaveCallbacks(stepId, true, res)
    })
    var onRequestError = function(res) {
        delete MergeTutorialManager.savingServerStepIds[stepId]
        if (res && Number(res.errorCode) === 1803) {
            MergeTutorialManager.savedServerStepIds[stepId] = true
            if (MergeTutorialManager.SyncLocalTriggerProgressAfterServerSave) {
                MergeTutorialManager.SyncLocalTriggerProgressAfterServerSave(stepId)
            }
            MergeTutorialManager.FlushServerStepSaveCallbacks(stepId, true, res)
            return
        }
        MergeTutorialManager.FlushServerStepSaveCallbacks(stepId, false, res)
    }
    if (req.SetErrorCallBack) req.SetErrorCallBack(onRequestError)
    if (req.SetNetErrorCallBack) req.SetNetErrorCallBack(function() {
        delete MergeTutorialManager.savingServerStepIds[stepId]
        MergeTutorialManager.FlushServerStepSaveCallbacks(stepId, false, { error: 'net_error' })
    })
    req.Send()
    return true
}

MergeTutorialManager.GetWindowInstance = function(windowName) {
    return MergeTutorialTargetResolver.GetWindowInstance(this, windowName)
}

MergeTutorialManager.GetRawWindowInstance = function(windowName) {
    return MergeTutorialTargetResolver.GetRawWindowInstance(this, windowName)
}

MergeTutorialManager.IsWindowOpenOrLoading = function(windowName) {
    return MergeTutorialTargetResolver.IsWindowOpenOrLoading(this, windowName)
}

MergeTutorialManager.IsMergeBoardSceneActive = function() {
    return MergeTutorialTargetResolver.IsMergeBoardSceneActive(this)
}

MergeTutorialManager.ShouldTriggerStartOnMergeBoard = function(triggerMeta) {
    if (!triggerMeta) return false

    var startStepId = (this.PeekTriggerStartStepOverride ? this.PeekTriggerStartStepOverride(triggerMeta) : 0) ||
        (this.ResolveTriggerStartStepId
        ? this.ResolveTriggerStartStepId(triggerMeta)
        : (triggerMeta.FirstStepId ? triggerMeta.FirstStepId() : 0))
    var stepMeta = startStepId ? this.GetMeta(startStepId) : null
    if (!stepMeta || !stepMeta.CompleteParam) return false
    return this.NormalizeOrderParam(stepMeta.CompleteParam()) === 'town_button'
}

MergeTutorialManager.IsNodeActive = function(node) {
    return MergeTutorialTargetResolver.IsNodeActive(this, node)
}

MergeTutorialManager.FindNodeByName = function(root, nodeName) {
    return MergeTutorialTargetResolver.FindNodeByName(this, root, nodeName)
}

MergeTutorialManager.FindActiveNodeByName = function(root, nodeName) {
    return MergeTutorialTargetResolver.FindActiveNodeByName(this, root, nodeName)
}

MergeTutorialManager.FindActiveNodeByNames = function(root, names) {
    return MergeTutorialTargetResolver.FindActiveNodeByNames(this, root, names)
}

MergeTutorialManager.GetNodeByPath = function(root, path) {
    return MergeTutorialTargetResolver.GetNodeByPath(this, root, path)
}

MergeTutorialManager.GetNodeFromObjectPath = function(root, path) {
    return MergeTutorialTargetResolver.GetNodeFromObjectPath(this, root, path)
}

MergeTutorialManager.ResolveGuideTargetNode = function(targetKey) {
    return MergeTutorialTargetResolver.ResolveGuideTargetNode(this, targetKey)
}

MergeTutorialManager.ParseKeyValueParam = function(param) {
    return MergeTutorialTargetResolver.ParseKeyValueParam(this, param)
}

MergeTutorialManager.GetSavedTriggerStepId = function(triggerMeta) {
    if (!triggerMeta || typeof Game === 'undefined' || !Game.SUserMergeTutorial || !Game.SUserMergeTutorial.TutorialId) return 0
    var groupId = this.GetTriggerGroupId(triggerMeta)
    if (!groupId) return 0
    return parseInt(Game.SUserMergeTutorial.TutorialId(groupId), 10) || 0
}

MergeTutorialManager.FindTriggerStepMetaInChain = function(triggerMeta, targetStepId) {
    return MergeTutorialStateMachine.FindTriggerStepMetaInChain(this, triggerMeta, targetStepId)
}

MergeTutorialManager.ResolveTriggerStepOrderIndex = function(triggerMeta, targetStepId) {
    return MergeTutorialStateMachine.ResolveTriggerStepOrderIndex(this, triggerMeta, targetStepId)
}

MergeTutorialManager.IsTriggerStepInChain = function(triggerMeta, stepId) {
    return MergeTutorialStateMachine.IsTriggerStepInChain(this, triggerMeta, stepId)
}

MergeTutorialManager.IsLocalTriggerProgressUsable = function(progress, triggerMeta) {
    return MergeTutorialStateMachine.IsLocalTriggerProgressUsable(this, progress, triggerMeta)
}

MergeTutorialManager.GetUsableLocalTriggerStepId = function(triggerMeta) {
    return MergeTutorialStateMachine.GetUsableLocalTriggerStepId(this, triggerMeta)
}

MergeTutorialManager.ResolveBestSavedTriggerStepId = function(triggerMeta) {
    return MergeTutorialStateMachine.ResolveBestSavedTriggerStepId(this, triggerMeta)
}

MergeTutorialManager.FindTriggerMetaByStepId = function(stepId) {
    return MergeTutorialStateMachine.FindTriggerMetaByStepId(this, stepId)
}

MergeTutorialManager.SyncLocalTriggerProgressAfterServerSave = function(stepId) {
    return MergeTutorialStateMachine.SyncLocalTriggerProgressAfterServerSave(this, stepId)
}

MergeTutorialManager.ResolveTriggerStartStepId = function(triggerMeta) {
    return MergeTutorialStateMachine.ResolveTriggerStartStepId(this, triggerMeta)
}

MergeTutorialManager.ShouldResumeSavedTriggerProgress = function(triggerMeta) {
    return MergeTutorialStateMachine.ShouldResumeSavedTriggerProgress(this, triggerMeta)
}

MergeTutorialManager.GetTriggerServerSaveStepId = function(triggerMeta, lastId, nextId) {
    return parseInt(lastId, 10) || 0
}

MergeTutorialManager.GetTriggerServerSaveStepMeta = function(triggerMeta, lastMeta, nextMeta) {
    return lastMeta || null
}

MergeTutorialManager.ShouldSaveTriggerServerStep = function(triggerMeta, saveStepMeta, saveStepId, nextMeta) {
    if (!triggerMeta || !saveStepId || !saveStepMeta) return false
    if (!saveStepMeta.SaveServer || !saveStepMeta.SaveServer()) return false
    if (nextMeta && nextMeta.IsEnd && nextMeta.IsEnd()) return false
    return true
}

MergeTutorialManager.SetTriggerTutorialId = function(triggerMeta, stepId) {
    if (!triggerMeta || !triggerMeta.Id || typeof Game === 'undefined' || !Game.SUserMergeTutorial || !Game.SUserMergeTutorial.SetTutorialId) return false
    stepId = parseInt(stepId, 10) || 0
    if (!stepId) return false

    var groupId = this.GetTriggerGroupId(triggerMeta)
    if (!groupId) return false
    var currentId = Game.SUserMergeTutorial.TutorialId
        ? parseInt(Game.SUserMergeTutorial.TutorialId(groupId), 10) || 0
        : 0
    if (currentId) {
        var currentIndex = this.ResolveTriggerStepOrderIndex ? this.ResolveTriggerStepOrderIndex(triggerMeta, currentId) : -1
        var nextIndex = this.ResolveTriggerStepOrderIndex ? this.ResolveTriggerStepOrderIndex(triggerMeta, stepId) : -1
        if (currentIndex >= 0 && nextIndex >= 0 && currentIndex > nextIndex) return false
        if (currentIndex < 0 && currentId > stepId) return false
    }
    Game.SUserMergeTutorial.SetTutorialId(groupId, stepId)
    return true
}

MergeTutorialManager.TryResumeSavedTriggerProgress = function() {
    return false
}

MergeTutorialManager.IsVillageSceneActive = function() {
    return !!(typeof GamePlay !== 'undefined' &&
        GamePlay.instance &&
        GamePlay.Scenes &&
        GamePlay.instance.currentScene === GamePlay.Scenes.Village)
}

MergeTutorialManager.FindTriggerStepIdByCompleteParam = function(triggerMeta, completeParam) {
    if (!triggerMeta || !triggerMeta.FirstStepId) return 0
    completeParam = this.NormalizeOrderParam(completeParam)
    var stepId = parseInt(triggerMeta.FirstStepId(), 10) || 0
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    var guard = 0
    while (stepId && guard++ < 100) {
        var meta = this.GetMeta(stepId)
        if (!meta) break
        if (this.NormalizeOrderParam(meta.CompleteParam ? meta.CompleteParam() : '') === completeParam) return stepId
        if (reportId && stepId === reportId) break
        stepId = parseInt(meta.NextId ? meta.NextId() : 0, 10) || 0
    }
    return 0
}

MergeTutorialManager.RecoverTriggerAtStep = function(triggerMeta, stepId) {
    if (!triggerMeta || !stepId) return false
    if (this.activeTriggerMeta || (this.IsTriggerQueued && this.IsTriggerQueued(triggerMeta.Id()))) return false
    if (!this.FindTriggerStepMetaInChain || !this.FindTriggerStepMetaInChain(triggerMeta, stepId)) return false
    if (!this.EnqueueTriggerAtStep(triggerMeta, stepId, true)) return false
    this.TryStartNextTrigger()
    return true
}

MergeTutorialManager.TryRecoverTriggerProgressFromState = function() {
    return false
}

MergeTutorialManager.CancelTriggerStateRecoverRetry = function() {
    if (this.triggerStateRecoverRetryTimer) {
        clearTimeout(this.triggerStateRecoverRetryTimer)
        this.triggerStateRecoverRetryTimer = null
    }
    this.triggerStateRecoverRetryCount = 0
}

MergeTutorialManager.TryRecoverTriggerProgressFromStateWithRetry = function() {
    return false
}

MergeTutorialManager.ResolveSceneIdFromStartParam = function(startParam) {
    if (typeof GamePlay === 'undefined' || !GamePlay.Scenes) return null
    startParam = String(startParam || '').toLowerCase()
    if (startParam === 'slot' || startParam === 'board' || startParam === 'merge') {
        return GamePlay.Scenes.Slot
    }
    if (startParam === 'village' || startParam === 'town' || startParam === 'map') {
        return GamePlay.Scenes.Village
    }
    return null
}

MergeTutorialManager.CancelTriggerStepContextRetry = function() {
    if (!this.triggerStepContextRetryTimer) return
    clearTimeout(this.triggerStepContextRetryTimer)
    this.triggerStepContextRetryTimer = null
}

MergeTutorialManager.ScheduleTriggerStepContextRetry = function(delay) {
    if (this.triggerStepContextRetryTimer) return
    var retryDelay = delay == null ? this.triggerStepContextRetryDelay : delay
    this.triggerStepContextRetryTimer = setTimeout(function() {
        MergeTutorialManager.triggerStepContextRetryTimer = null
        MergeTutorialManager.startTriggerStep()
    }, Math.max(0, Number(retryDelay) || 0))
}

MergeTutorialManager.EnsureTriggerStepScene = function(stepMeta) {
    if (!stepMeta || !stepMeta.StartType || stepMeta.StartType() !== 'scene') {
        return true
    }
    var sceneId = this.ResolveSceneIdFromStartParam(stepMeta.StartParam ? stepMeta.StartParam() : '')
    if (sceneId === null || sceneId === undefined) {
        return true
    }
    if (typeof GamePlay === 'undefined' || !GamePlay.instance) {
        return true
    }

    var gamePlay = GamePlay.instance
    if (gamePlay.currentScene === sceneId) {
        return true
    }
    this.CloseTutorialWindow()

    var retryStepId = this.activeTriggerStepId
    var onSceneReady = function() {
        MergeTutorialManager.CancelTriggerStepContextRetry()
        if (MergeTutorialManager.activeTriggerStepId === retryStepId) {
            MergeTutorialManager.startTriggerStep()
        }
    }
    if (gamePlay.isChangeAnim && gamePlay.isChangeAnim()) {
        this.ScheduleTriggerStepContextRetry()
        return false
    }
    if (gamePlay.changeScene) {
        this.ScheduleTriggerStepContextRetry()
        gamePlay.changeScene(sceneId, onSceneReady)
        return false
    }
    return true
}

MergeTutorialManager.EnsureTriggerStepStartContext = function(stepMeta) {
    return this.EnsureTriggerStepScene(stepMeta)
}

MergeTutorialManager.GetMapNode = function() {
    return MergeTutorialTargetResolver.GetMapNode(this)
}

MergeTutorialManager.GetMapBuildRootNode = function() {
    return MergeTutorialTargetResolver.GetMapBuildRootNode(this)
}

MergeTutorialManager.GetMapBuildNode = function(mapId, buildId) {
    return MergeTutorialTargetResolver.GetMapBuildNode(this, mapId, buildId)
}

MergeTutorialManager.IsMapBuildTarget = function(targetKey) {
    return MergeTutorialTargetResolver.IsMapBuildTarget(this, targetKey)
}

MergeTutorialManager.GetCurrentMapBuildTarget = function() {
    return MergeTutorialTargetResolver.GetCurrentMapBuildTarget(this)
}

MergeTutorialManager.GetNodeWorldGeometry = function(node, padding) {
    return MergeTutorialTargetResolver.GetNodeWorldGeometry(this, node, padding)
}

MergeTutorialManager.GetMapBuildWorldGeometry = function(node) {
    return MergeTutorialTargetResolver.GetMapBuildWorldGeometry(this, node)
}

MergeTutorialManager.GetNodeGuideWorldPos = function(node) {
    return MergeTutorialTargetResolver.GetNodeGuideWorldPos(this, node)
}

MergeTutorialManager.GetCameraWorldToScreenPoint = function(camera, worldPos) {
    return MergeTutorialTargetResolver.GetCameraWorldToScreenPoint(this, camera, worldPos)
}

MergeTutorialManager.ConvertScreenPointToUiWorldPos = function(screenPos) {
    return MergeTutorialTargetResolver.ConvertScreenPointToUiWorldPos(this, screenPos)
}

MergeTutorialManager.GetVillageCamera = function() {
    return MergeTutorialTargetResolver.GetVillageCamera(this)
}

MergeTutorialManager.IsMapBuildNode = function(node) {
    return MergeTutorialTargetResolver.IsMapBuildNode(this, node)
}

MergeTutorialManager.GetNodeWorldPos = function(targetKey) {
    return MergeTutorialTargetResolver.GetNodeWorldPos(this, targetKey)
}

MergeTutorialManager.GetNodeHighlightGeometry = function(targetKey) {
    return MergeTutorialTargetResolver.GetNodeHighlightGeometry(this, targetKey)
}

MergeTutorialManager.MatchNodeClickParam = function(completeParam, payload) {
    return MergeTutorialOperationGuard.MatchNodeClickParam(this, completeParam, payload)
}

MergeTutorialManager.MatchCurrentMapBuildPayload = function(expected, payload) {
    return MergeTutorialOperationGuard.MatchCurrentMapBuildPayload(this, expected, payload)
}

MergeTutorialManager.MatchFlowEventParam = function(completeParam, payload) {
    return MergeTutorialOperationGuard.MatchFlowEventParam(this, completeParam, payload)
}

MergeTutorialManager.IsBuildWindowStepMapBuildClick = function(stepMeta, payload) {
    return MergeTutorialOperationGuard.IsBuildWindowStepMapBuildClick(this, stepMeta, payload)
}

MergeTutorialManager.EmitNodeClick = function(nodeKey, payload) {
    payload = payload || {}
    payload.nodeKey = nodeKey
    this.Emit(this.EventTypes.NodeClick, payload)
}

MergeTutorialManager.EmitFlowEvent = function(eventKey, payload) {
    payload = payload || {}
    payload.nodeKey = eventKey
    payload.event = eventKey
    this.Emit(this.EventTypes.FlowEvent, payload)
}

MergeTutorialManager.IsWaitingNodeClick = function(nodeKey) {
    return MergeTutorialOperationGuard.IsWaitingNodeClick(this, nodeKey)
}

MergeTutorialManager.ShouldBlockGuideInput = function() {
    return MergeTutorialOperationGuard.ShouldBlockGuideInput(this)
}

MergeTutorialManager.ShouldUseFullScreenGuideBlocker = function() {
    return MergeTutorialOperationGuard.ShouldUseFullScreenGuideBlocker(this)
}

MergeTutorialManager.ShouldBlockMapControl = function() {
    return MergeTutorialOperationGuard.ShouldBlockMapControl(this)
}

MergeTutorialManager.RefreshCurrentWindow = function() {
    return MergeTutorialUIController.RefreshCurrentWindow(this)
}

MergeTutorialManager.CloseTutorialWindow = function() {
    return MergeTutorialUIController.CloseTutorialWindow(this)
}

MergeTutorialManager.BindNodeClickTargetIfNeeded = function(stepMeta) {
    return MergeTutorialBusinessAdapter.BindNodeClickTargetIfNeeded(this, stepMeta)
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

MergeTutorialManager.GetHighestLvNormalMergeItem = function() {
    return MergeTutorialBusinessAdapter.GetHighestLvNormalMergeItem(this)
}

MergeTutorialManager.IsTriggerQueued = function(triggerId) {
    return MergeTutorialStateMachine.IsTriggerQueued(this, triggerId)
}

MergeTutorialManager.SetTriggerStartStepOverride = function(triggerMeta, stepId) {
    return MergeTutorialStateMachine.SetTriggerStartStepOverride(this, triggerMeta, stepId)
}

MergeTutorialManager.PeekTriggerStartStepOverride = function(triggerMeta) {
    return MergeTutorialStateMachine.PeekTriggerStartStepOverride(this, triggerMeta)
}

MergeTutorialManager.TakeTriggerStartStepOverride = function(triggerMeta) {
    return MergeTutorialStateMachine.TakeTriggerStartStepOverride(this, triggerMeta)
}

MergeTutorialManager.EnqueueTrigger = function(triggerMeta, deferStart) {
    return MergeTutorialStateMachine.EnqueueTrigger(this, triggerMeta, deferStart)
}

MergeTutorialManager.EnqueueTriggerAtStep = function(triggerMeta, stepId, deferStart) {
    return MergeTutorialStateMachine.EnqueueTriggerAtStep(this, triggerMeta, stepId, deferStart)
}

MergeTutorialManager.EmitTrigger = function(eventName, payload) {
    return 0
}

MergeTutorialManager.TryStartNextTrigger = function() {
    if (this.activeTriggerMeta || this.isReportingFinish) {
        return
    }
    if (this.currentMeta && !this.IsFinished()) {
        return
    }
    if (!this.triggerQueue || this.triggerQueue.length === 0) {
        return
    }
    if (this.ShouldDelayTriggerStart()) {
        this.ScheduleTriggerStartRetry()
        return
    }
    var triggerMeta = this.triggerQueue.shift()
    if (!triggerMeta) {
        return
    }
    this.StartTrigger(triggerMeta)
}

MergeTutorialManager.ShouldDelayTriggerStart = function() {
    var nextTrigger = this.triggerQueue && this.triggerQueue.length > 0 ? this.triggerQueue[0] : null
    if (this.ShouldTriggerStartOnMergeBoard(nextTrigger) && !this.IsMergeBoardSceneActive()) {
        return true
    }

    var blockWindows = this.TriggerStartBlockWindows || []
    for (var i = 0; i < blockWindows.length; i++) {
        if (this.IsWindowOpenOrLoading(blockWindows[i])) {
            return true
        }
    }
    return false
}

MergeTutorialManager.ScheduleTriggerStartRetry = function(delay) {
    return MergeTutorialStateMachine.ScheduleTriggerStartRetry(this, delay)
}

MergeTutorialManager.StartTrigger = function(triggerMeta) {
    return MergeTutorialStateMachine.StartTrigger(this, triggerMeta)
}

MergeTutorialManager.BeginTriggerAtStep = function(triggerMeta, stepId) {
    return MergeTutorialStateMachine.BeginTriggerAtStep(this, triggerMeta, stepId)
}

MergeTutorialManager.SaveTriggerStartStepIfNeeded = function(triggerMeta, stepId) {
    return MergeTutorialStateMachine.SaveTriggerStartStepIfNeeded(this, triggerMeta, stepId)
}

MergeTutorialManager.ClearActiveTriggerState = function() {
    return MergeTutorialStateMachine.ClearActiveTriggerState(this)
}

MergeTutorialManager.startTriggerStep = function() {
    return MergeTutorialStateMachine.StartTriggerStep(this)
}

MergeTutorialManager.showTriggerWindow = function() {
    return MergeTutorialUIController.ShowTriggerWindow(this)
}

MergeTutorialManager.RunStepActionIfNeeded = function(stepMeta, wnd) {
    return MergeTutorialUIController.RunStepActionIfNeeded(this, stepMeta, wnd)
}

MergeTutorialManager.ShouldForceSaveTriggerStep = function(stepId) {
    return MergeTutorialStateMachine.ShouldForceSaveTriggerStep(this, stepId)
}

MergeTutorialManager.nextTriggerStep = function() {
    return MergeTutorialStateMachine.NextTriggerStep(this)
}

MergeTutorialManager.CompleteActiveTrigger = function() {
    return MergeTutorialStateMachine.CompleteActiveTrigger(this)
}

MergeTutorialManager.CanSkipActiveTrigger = function() {
    return MergeTutorialStateMachine.CanSkipActiveTrigger(this)
}

MergeTutorialManager.SkipActiveTrigger = function() {
    return MergeTutorialStateMachine.SkipActiveTrigger(this)
}

MergeTutorialManager.ShouldShowSkipButton = function(stepMeta) {
    if (this.IsMainForcedTutorialStep && this.IsMainForcedTutorialStep(stepMeta)) return true
    return !!(this.CanSkipActiveTrigger && this.CanSkipActiveTrigger())
}

MergeTutorialManager.SkipCurrentTutorial = function() {
    if (this.CanSkipActiveTrigger && this.CanSkipActiveTrigger()) {
        return this.SkipActiveTrigger()
    }
    if (this.currentMeta &&
        this.IsMainForcedTutorialStep &&
        this.IsMainForcedTutorialStep(this.currentMeta) &&
        !(this.IsFinished && this.IsFinished())) {
        this.SkipForcedTutorial()
        return true
    }
    return false
}

MergeTutorialManager.MarkTriggerCompletedAndReport = function(triggerMeta) {
    return MergeTutorialStateMachine.MarkTriggerCompletedAndReport(this, triggerMeta)
}

MergeTutorialManager.QueueTriggerReport = function(reportId, groupId) {
    return MergeTutorialStateMachine.QueueTriggerReport(this, reportId, groupId)
}

MergeTutorialManager.FlushTriggerReports = function() {
    return MergeTutorialStateMachine.FlushTriggerReports(this)
}

MergeTutorialManager.ScheduleTriggerReportRetry = function() {
    return MergeTutorialStateMachine.ScheduleTriggerReportRetry(this)
}

MergeTutorialManager.init = function() {
    return MergeTutorialStateMachine.InitMainOrTrigger(this)
}

MergeTutorialManager.tryStartStep = function() {
    return MergeTutorialStateMachine.TryStartMainStep(this)
}

MergeTutorialManager.startStep = function() {
    return MergeTutorialStateMachine.StartMainStep(this)
}

MergeTutorialManager.showWindow = function() {
    return MergeTutorialUIController.ShowMainWindow(this)
}

MergeTutorialManager.nextStep = function() {
    return MergeTutorialStateMachine.NextMainStep(this)
}

MergeTutorialManager.finishForcedTutorial = function() {
    return MergeTutorialStateMachine.FinishForcedTutorial(this)
}

MergeTutorialManager.SkipForcedTutorial = function() {
    return MergeTutorialStateMachine.SkipForcedTutorial(this)
}

MergeTutorialManager.finishForcedTutorialReport = function() {
    return MergeTutorialStateMachine.FinishForcedTutorialReport(this)
}

MergeTutorialManager.completeForcedTutorial = function(userTutorialData) {
    return MergeTutorialStateMachine.CompleteForcedTutorial(this, userTutorialData)
}

MergeTutorialManager.retryFinishForcedTutorial = function(stage, error) {
    return MergeTutorialStateMachine.RetryFinishForcedTutorial(this, stage, error)
}

MergeTutorialManager.ParseMergeDragParam = function(param) {
    return MergeTutorialOperationGuard.ParseMergeDragParam(this, param)
}

MergeTutorialManager.ParseGeneratorParam = function(param) {
    return MergeTutorialOperationGuard.ParseGeneratorParam(this, param)
}

MergeTutorialManager.GetCurrentMergeDragParam = function(stepMeta) {
    return MergeTutorialOperationGuard.GetCurrentMergeDragParam(this, stepMeta)
}

MergeTutorialManager.GetCurrentDragGuideTiles = function() {
    return MergeTutorialOperationGuard.GetCurrentDragGuideTiles(this)
}

MergeTutorialManager.GetSpriteFrameByMergeId = function(mergeId) {
    return MergeTutorialTargetResolver.GetSpriteFrameByMergeId(this, mergeId)
}

MergeTutorialManager.GetUiWorldCenter = function() {
    return MergeTutorialTargetResolver.GetUiWorldCenter(this)
}

MergeTutorialManager.GetUiLocalSize = function() {
    return MergeTutorialTargetResolver.GetUiLocalSize(this)
}

MergeTutorialManager.GetUiFixedWorldPoint = function(localPos) {
    return MergeTutorialTargetResolver.GetUiFixedWorldPoint(this, localPos)
}

MergeTutorialManager.ShouldUseStaticMergeDragGuideTiles = function() {
    return MergeTutorialOperationGuard.ShouldUseStaticMergeDragGuideTiles(this)
}

MergeTutorialManager.ShouldAllowMergeDragMove = function(tileKey) {
    return MergeTutorialOperationGuard.ShouldAllowMergeDragMove(this, tileKey)
}

MergeTutorialManager.UpdateMergeDragGuideStartTile = function(tileKey, oldTileKey) {
    return MergeTutorialOperationGuard.UpdateMergeDragGuideStartTile(this, tileKey, oldTileKey)
}

MergeTutorialManager.NormalizeTileKey = function(tileKey) {
    return MergeTutorialOperationGuard.NormalizeTileKey(this, tileKey)
}

MergeTutorialManager.Clamp = function(value, min, max) {
    return MergeTutorialTargetResolver.Clamp(this, value, min, max)
}

MergeTutorialManager.GetMergeTileWorldSize = function() {
    return MergeTutorialTargetResolver.GetMergeTileWorldSize(this)
}

MergeTutorialManager.GetMergeBoardWorldGeometry = function(preset) {
    return MergeTutorialTargetResolver.GetMergeBoardWorldGeometry(this, preset)
}

MergeTutorialManager.BuildTileHighlightGeometry = function(worldPos, preset) {
    return MergeTutorialTargetResolver.BuildTileHighlightGeometry(this, worldPos, preset)
}

MergeTutorialManager.BuildDynamicHighlightGeometry = function(worldA, worldB, preset) {
    return MergeTutorialTargetResolver.BuildDynamicHighlightGeometry(this, worldA, worldB, preset)
}

MergeTutorialManager.BuildGeneratorMergeDragHighlightGeometry = function(worldA, worldB, preset) {
    return MergeTutorialTargetResolver.BuildGeneratorMergeDragHighlightGeometry(this, worldA, worldB, preset)
}

MergeTutorialManager.BuildRectHighlightGeometry = function(worldA, worldB, preset) {
    return MergeTutorialTargetResolver.BuildRectHighlightGeometry(this, worldA, worldB, preset)
}

MergeTutorialManager.BuildOrderHighlightGeometry = function(worldPos, preset) {
    return MergeTutorialTargetResolver.BuildOrderHighlightGeometry(this, worldPos, preset)
}

MergeTutorialManager.MatchStepComplete = function(stepMeta, eventName, payload, progressPrefix) {
    return MergeTutorialOperationGuard.MatchStepComplete(this, stepMeta, eventName, payload, progressPrefix)
}

MergeTutorialManager.MatchCurrentComplete = function(eventName, payload) {
    return this.MatchStepComplete(this.currentMeta, eventName, payload, 'main')
}

MergeTutorialManager.MatchActiveTriggerComplete = function(eventName, payload) {
    return this.MatchStepComplete(this.activeTriggerStepMeta, eventName, payload, 'trigger')
}

MergeTutorialManager.CanOperateByStepMeta = function(stepMeta, type, payload, useCurrentDrag) {
    return MergeTutorialOperationGuard.CanOperateByStepMeta(this, stepMeta, type, payload, useCurrentDrag)
}

MergeTutorialManager.CanOperate = function(type, payload) {
    return MergeTutorialOperationGuard.CanOperate(this, type, payload)
}

MergeTutorialManager.CanOperateNodeClick = function(nodeKey, payload) {
    return MergeTutorialOperationGuard.CanOperateNodeClick(this, nodeKey, payload)
}
MergeTutorialManager.NormalizeOrderParam = function(value) {
    return MergeTutorialOperationGuard.NormalizeOrderParam(this, value)
}

MergeTutorialManager.MatchTutorialOrderParam = function(completeParam, payload) {
    return MergeTutorialOperationGuard.MatchTutorialOrderParam(this, completeParam, payload)
}

MergeTutorialManager.MatchDragToBackpackParam = function(completeParam, payload) {
    return MergeTutorialOperationGuard.MatchDragToBackpackParam(this, completeParam, payload)
}

MergeTutorialManager.MatchDragToBackpackStartParam = function(completeParam, payload) {
    return MergeTutorialOperationGuard.MatchDragToBackpackStartParam(this, completeParam, payload)
}

MergeTutorialManager.GetMergeUI = function() {
    return MergeTutorialTargetResolver.GetMergeUI(this)
}

MergeTutorialManager.GetMergeLevelNode = function() {
    return MergeTutorialTargetResolver.GetMergeLevelNode(this)
}

MergeTutorialManager.GetOrderSubmitOrder = function() {
    return MergeTutorialTargetResolver.GetOrderSubmitOrder(this)
}

MergeTutorialManager.GetOrderSubmitTargetNode = function() {
    return MergeTutorialTargetResolver.GetOrderSubmitTargetNode(this)
}

MergeTutorialManager.GetOrderSubmitHighlightNode = function() {
    return MergeTutorialTargetResolver.GetOrderSubmitHighlightNode(this)
}

MergeTutorialManager.GetNodeWorldRect = function(node) {
    return MergeTutorialTargetResolver.GetNodeWorldRect(this, node)
}

MergeTutorialManager.MergeWorldRects = function(rects) {
    return MergeTutorialTargetResolver.MergeWorldRects(this, rects)
}

MergeTutorialManager.GetOrderSubmitHighlightRect = function() {
    return MergeTutorialTargetResolver.GetOrderSubmitHighlightRect(this)
}

MergeTutorialManager.BuildRectHighlightGeometryFromWorldRect = function(rect, preset) {
    return MergeTutorialTargetResolver.BuildRectHighlightGeometryFromWorldRect(this, rect, preset)
}

MergeTutorialManager.GetOrderSubmitHighlightGeometry = function(preset) {
    return MergeTutorialTargetResolver.GetOrderSubmitHighlightGeometry(this, preset)
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
Game.MergeTutorialManager = MergeTutorialManager
export default MergeTutorialManager
