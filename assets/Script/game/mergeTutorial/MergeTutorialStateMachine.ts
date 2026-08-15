import '../../LegacyGlobals';

const MergeTutorialStateMachine: any = {}

MergeTutorialStateMachine.ClearTimer = function(owner, timerKey) {
    if (!owner || !owner[timerKey]) return
    clearTimeout(owner[timerKey])
    owner[timerKey] = null
}

MergeTutorialStateMachine.ResetRuntimeState = function(owner) {
    if (!owner) return

    owner.currentId = 0
    owner.currentMeta = null
    owner.currentGuideMeta = null
    owner.mainWindow = null
    owner.finishCallback = null
    owner.isReportingFinish = false
    this.ClearTimer(owner, 'finishRetryTimer')

    owner.generatorClickProgress = {}
    owner.currentDragStartTile = ''

    owner.triggerQueue = []
    owner.activeTriggerMeta = null
    owner.activeTriggerStepId = 0
    owner.activeTriggerStepMeta = null
    owner.activeTriggerGuideMeta = null
    owner.activeTriggerBlockMode = ''
    owner.pendingTriggerReports = []
    owner.isReportingTrigger = false
    owner.savingServerStepIds = {}
    owner.savedServerStepIds = {}
    owner.serverStepSaveCallbacks = {}
    this.ClearTimer(owner, 'triggerReportRetryTimer')
    this.ClearTimer(owner, 'triggerStartRetryTimer')
    this.ClearTimer(owner, 'triggerStepContextRetryTimer')
    this.ClearTimer(owner, 'triggerStateRecoverRetryTimer')
    owner.triggerStateRecoverRetryCount = 0
    owner.completedTriggerReports = {}

    owner.runningActionStepId = 0
    owner.openingTriggerBuildWindowStepId = 0
    owner.pendingTriggerStartSaveTriggerId = 0
    owner.triggerStartStepOverrides = {}
}

MergeTutorialStateMachine.GetCurrentId = function(owner) {
    return owner && (owner.currentId || owner.StartId) || 0
}

MergeTutorialStateMachine.IsMainForcedTutorialStep = function(owner, stepMeta) {
    if (!owner || !stepMeta || !stepMeta.Id) return false
    var id = parseInt(stepMeta.Id(), 10)
    return id >= owner.StartId && id < owner.finish_report_id
}

MergeTutorialStateMachine.GetPlayerPrefs = function() {
    return typeof GameKit !== 'undefined' && GameKit.PlayerPrefs ? GameKit.PlayerPrefs : null
}

MergeTutorialStateMachine.IsValidMainTutorialLocalStepId = function(owner, stepId) {
    if (!owner) return false
    stepId = parseInt(stepId, 10)
    if (!stepId) return false
    var meta = owner.GetMeta ? owner.GetMeta(stepId) : null
    if (!meta) return false
    if (stepId === owner.finish_report_id) return !!(meta.IsEnd && meta.IsEnd())
    return this.IsMainForcedTutorialStep(owner, meta)
}

MergeTutorialStateMachine.SaveLocalMainTutorialStep = function(owner, stepId) {
    if (!owner) return false
    stepId = parseInt(stepId, 10)
    if (!this.IsValidMainTutorialLocalStepId(owner, stepId)) return false
    var prefs = this.GetPlayerPrefs()
    if (!prefs || !prefs.SetInt) return false
    prefs.SetInt(owner.MainTutorialLocalStepKey, stepId)
    return true
}

MergeTutorialStateMachine.LoadLocalMainTutorialStep = function(owner) {
    if (!owner) return 0
    var prefs = this.GetPlayerPrefs()
    if (!prefs || !prefs.GetInt) return 0
    var stepId = parseInt(prefs.GetInt(owner.MainTutorialLocalStepKey, 0), 10) || 0
    if (!stepId) return 0
    if (this.IsValidMainTutorialLocalStepId(owner, stepId)) return stepId
    this.ClearLocalMainTutorialStep(owner)
    return 0
}

MergeTutorialStateMachine.ClearLocalMainTutorialStep = function(owner) {
    if (!owner) return
    var prefs = this.GetPlayerPrefs()
    if (prefs && prefs.DeleteKey) {
        prefs.DeleteKey(owner.MainTutorialLocalStepKey)
    }
}

MergeTutorialStateMachine.ResolveMainTutorialStartId = function(owner) {
    if (!owner) return 0
    var localStepId = this.LoadLocalMainTutorialStep(owner)
    var serverStartId = this.ResolveMainTutorialStartIdFromServer(owner)
    if (localStepId && serverStartId) {
        return this.ResolveMainStepOrderIndex(owner, localStepId) >= this.ResolveMainStepOrderIndex(owner, serverStartId)
            ? localStepId
            : serverStartId
    }
    return localStepId || serverStartId || owner.StartId
}

MergeTutorialStateMachine.ResolveMainTutorialStartIdFromServer = function(owner) {
    if (!owner || !owner.GetSavedServerStepId) return 0
    var savedStepId = parseInt(owner.GetSavedServerStepId(owner.MainTutorialGroupId), 10) || 0
    if (!savedStepId) return 0
    var savedMeta = owner.GetMeta ? owner.GetMeta(savedStepId) : null
    if (!savedMeta) return 0
    if (savedMeta.IsEnd && savedMeta.IsEnd()) return savedStepId
    if (!this.IsMainForcedTutorialStep(owner, savedMeta)) return 0
    var nextId = savedMeta.NextId ? parseInt(savedMeta.NextId(), 10) || 0 : 0
    if (nextId && this.IsValidMainTutorialLocalStepId(owner, nextId)) return nextId
    return savedStepId
}

MergeTutorialStateMachine.ResolveMainStepOrderIndex = function(owner, stepId) {
    if (!owner) return -1
    stepId = parseInt(stepId, 10) || 0
    if (!stepId) return -1
    var curStepId = owner.StartId
    var guard = 0
    var index = 0
    while (curStepId && guard++ < 100) {
        if (curStepId === stepId) return index
        var meta = owner.GetMeta ? owner.GetMeta(curStepId) : null
        if (!meta || !meta.NextId) break
        var nextId = parseInt(meta.NextId(), 10) || 0
        if (!nextId || nextId === curStepId) break
        curStepId = nextId
        index++
    }
    return -1
}

MergeTutorialStateMachine.GetNowMs = function() {
    return typeof Date !== 'undefined' && Date.now ? Date.now() : 0
}

MergeTutorialStateMachine.LoadLocalTriggerProgressMap = function(owner) {
    if (!owner) return {}
    var prefs = this.GetPlayerPrefs()
    if (!prefs || !prefs.GetString) return {}
    var raw = prefs.GetString(owner.TriggerGuideLocalProgressKey, '{}')
    if (!raw) return {}
    try {
        var data = JSON.parse(raw)
        return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
    } catch (e) {
        this.ClearAllLocalTriggerProgress(owner)
        return {}
    }
}

MergeTutorialStateMachine.SaveLocalTriggerProgressMap = function(owner, progressMap) {
    if (!owner) return false
    var prefs = this.GetPlayerPrefs()
    if (!prefs || !prefs.SetString) return false
    prefs.SetString(owner.TriggerGuideLocalProgressKey, JSON.stringify(progressMap || {}))
    return true
}

MergeTutorialStateMachine.ClearAllLocalTriggerProgress = function(owner) {
    if (!owner) return false
    var prefs = this.GetPlayerPrefs()
    if (!prefs) return false
    if (prefs.DeleteKey) {
        prefs.DeleteKey(owner.TriggerGuideLocalProgressKey)
        return true
    }
    if (prefs.SetString) {
        prefs.SetString(owner.TriggerGuideLocalProgressKey, '{}')
        return true
    }
    return false
}

MergeTutorialStateMachine.GetLocalTriggerProgress = function(owner, triggerMeta) {
    if (!owner || !triggerMeta || !triggerMeta.Id) return null
    var progressMap = this.LoadLocalTriggerProgressMap(owner)
    return progressMap[triggerMeta.Id()] || null
}

MergeTutorialStateMachine.SaveLocalTriggerProgress = function(owner, triggerMeta, stepId) {
    if (!owner || !triggerMeta || !triggerMeta.Id) return false
    stepId = parseInt(stepId, 10) || 0
    if (!stepId) return false

    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    if (reportId && stepId >= reportId) {
        return this.ClearLocalTriggerProgress(owner, triggerMeta)
    }
    if (owner.IsTriggerCompleted && owner.IsTriggerCompleted(triggerMeta)) {
        return this.ClearLocalTriggerProgress(owner, triggerMeta)
    }
    if (!this.IsTriggerStepInChain(owner, triggerMeta, stepId)) return false
    if (owner.ShouldPersistLocalTriggerProgress &&
        !owner.ShouldPersistLocalTriggerProgress(triggerMeta, stepId)) {
        return false
    }

    var triggerId = triggerMeta.Id()
    var progressMap = this.LoadLocalTriggerProgressMap(owner)
    progressMap[triggerId] = {
        version: owner.TriggerGuideLocalProgressVersion,
        triggerId: triggerId,
        groupId: owner.GetTriggerGroupId ? owner.GetTriggerGroupId(triggerMeta) : 0,
        stepId: stepId,
        firstStepId: parseInt(triggerMeta.FirstStepId ? triggerMeta.FirstStepId() : 0, 10) || 0,
        completionReportId: reportId,
        savedAt: this.GetNowMs(),
    }
    return this.SaveLocalTriggerProgressMap(owner, progressMap)
}

MergeTutorialStateMachine.ClearLocalTriggerProgress = function(owner, triggerMeta) {
    if (!owner || !triggerMeta || !triggerMeta.Id) return false
    var progressMap = this.LoadLocalTriggerProgressMap(owner)
    var triggerId = triggerMeta.Id()
    if (!Object.prototype.hasOwnProperty.call(progressMap, triggerId)) return false
    delete progressMap[triggerId]
    return this.SaveLocalTriggerProgressMap(owner, progressMap)
}

MergeTutorialStateMachine.IsMainForcedTutorialActive = function(owner) {
    if (!owner) return false
    return !owner.activeTriggerStepMeta && this.IsMainForcedTutorialStep(owner, owner.currentMeta)
}

MergeTutorialStateMachine.FindTriggerStepMetaInChain = function(owner, triggerMeta, targetStepId) {
    if (!owner || !triggerMeta || !triggerMeta.FirstStepId) return null
    targetStepId = parseInt(targetStepId, 10) || 0
    if (!targetStepId) return null

    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    var stepId = parseInt(triggerMeta.FirstStepId(), 10) || 0
    var guard = 0
    while (stepId && guard++ < 100) {
        var meta = owner.GetMeta ? owner.GetMeta(stepId) : null
        if (!meta) {
            break
        }
        if (stepId === targetStepId) return meta
        if (reportId && stepId === reportId) break
        stepId = parseInt(meta.NextId ? meta.NextId() : 0, 10) || 0
    }
    return null
}

MergeTutorialStateMachine.ResolveTriggerStepOrderIndex = function(owner, triggerMeta, targetStepId) {
    if (!owner || !triggerMeta || !triggerMeta.FirstStepId) return -1
    targetStepId = parseInt(targetStepId, 10) || 0
    if (!targetStepId) return -1

    var stepId = parseInt(triggerMeta.FirstStepId(), 10) || 0
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    var guard = 0
    var index = 0
    while (stepId && guard++ < 100) {
        if (stepId === targetStepId) return index
        var meta = owner.GetMeta ? owner.GetMeta(stepId) : null
        if (!meta) break
        if (reportId && stepId === reportId) break
        stepId = parseInt(meta.NextId ? meta.NextId() : 0, 10) || 0
        index++
    }
    return -1
}

MergeTutorialStateMachine.IsTriggerStepInChain = function(owner, triggerMeta, stepId) {
    return this.ResolveTriggerStepOrderIndex(owner, triggerMeta, stepId) >= 0
}

MergeTutorialStateMachine.IsLocalTriggerProgressUsable = function(owner, progress, triggerMeta) {
    if (!owner || !progress || !triggerMeta || !triggerMeta.Id) return false
    var triggerId = parseInt(triggerMeta.Id(), 10) || 0
    var progressTriggerId = parseInt(progress.triggerId, 10) || 0
    if (!triggerId || progressTriggerId !== triggerId) return false

    var groupId = owner.GetTriggerGroupId ? owner.GetTriggerGroupId(triggerMeta) : 0
    if (groupId && parseInt(progress.groupId, 10) !== groupId) return false

    var firstStepId = parseInt(triggerMeta.FirstStepId ? triggerMeta.FirstStepId() : 0, 10) || 0
    if (firstStepId && parseInt(progress.firstStepId, 10) !== firstStepId) return false

    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    if (reportId && parseInt(progress.completionReportId, 10) !== reportId) return false
    if (owner.IsTriggerCompleted && owner.IsTriggerCompleted(triggerMeta)) return false

    var stepId = parseInt(progress.stepId, 10) || 0
    if (!stepId || (reportId && stepId >= reportId)) return false
    if (!this.IsTriggerStepInChain(owner, triggerMeta, stepId)) return false

    var savedAt = parseInt(progress.savedAt, 10) || 0
    var now = this.GetNowMs()
    if (savedAt && now && owner.TriggerGuideLocalProgressTtl && now - savedAt > owner.TriggerGuideLocalProgressTtl) return false

    return true
}

MergeTutorialStateMachine.GetUsableLocalTriggerStepId = function(owner, triggerMeta) {
    if (!owner) return 0
    var progress = this.GetLocalTriggerProgress(owner, triggerMeta)
    if (!progress) return 0
    if (this.IsLocalTriggerProgressUsable(owner, progress, triggerMeta)) {
        return parseInt(progress.stepId, 10) || 0
    }
    this.ClearLocalTriggerProgress(owner, triggerMeta)
    return 0
}

MergeTutorialStateMachine.ResolveBestSavedTriggerStepId = function(owner, triggerMeta) {
    if (!owner || !triggerMeta) return 0
    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    var serverStepId = owner.GetSavedTriggerStepId ? owner.GetSavedTriggerStepId(triggerMeta) : 0
    if (reportId && serverStepId >= reportId) {
        this.ClearLocalTriggerProgress(owner, triggerMeta)
        return reportId
    }

    var localStepId = this.GetUsableLocalTriggerStepId(owner, triggerMeta)
    if (!serverStepId) return localStepId
    if (!localStepId) return serverStepId

    var serverIndex = this.ResolveTriggerStepOrderIndex(owner, triggerMeta, serverStepId)
    var localIndex = this.ResolveTriggerStepOrderIndex(owner, triggerMeta, localStepId)
    if (serverIndex < 0) return localStepId
    if (localIndex > serverIndex) return localStepId
    return serverStepId
}

MergeTutorialStateMachine.FindTriggerMetaByStepId = function(owner, stepId) {
    if (!owner) return null
    var metas = owner.GetTriggerMetas ? owner.GetTriggerMetas() : {}
    for (var id in metas) {
        if (!Object.prototype.hasOwnProperty.call(metas, id)) continue
        if (this.IsTriggerStepInChain(owner, metas[id], stepId)) return metas[id]
    }
    return null
}

MergeTutorialStateMachine.SyncLocalTriggerProgressAfterServerSave = function(owner, stepId) {
    if (!owner) return false
    stepId = parseInt(stepId, 10) || 0
    if (!stepId) return false
    var triggerMeta = this.FindTriggerMetaByStepId(owner, stepId)
    if (!triggerMeta) return false

    var localStepId = this.GetUsableLocalTriggerStepId(owner, triggerMeta)
    if (!localStepId) return false
    var localIndex = this.ResolveTriggerStepOrderIndex(owner, triggerMeta, localStepId)
    var serverIndex = this.ResolveTriggerStepOrderIndex(owner, triggerMeta, stepId)
    if (serverIndex >= 0 && localIndex <= serverIndex) {
        return this.ClearLocalTriggerProgress(owner, triggerMeta)
    }
    return false
}

MergeTutorialStateMachine.ResolveTriggerStartStepId = function(owner, triggerMeta) {
    if (!owner || !triggerMeta || !triggerMeta.FirstStepId) return 0
    var firstStepId = parseInt(triggerMeta.FirstStepId(), 10) || 0
    var savedStepId = this.ResolveBestSavedTriggerStepId(owner, triggerMeta)
    if (!savedStepId) {
        return firstStepId
    }

    var reportId = parseInt(triggerMeta.CompletionReportId ? triggerMeta.CompletionReportId() : 0, 10) || 0
    if (reportId && savedStepId >= reportId) {
        return reportId
    }
    var stepId = firstStepId
    var guard = 0
    while (stepId && guard++ < 100) {
        var meta = owner.GetMeta ? owner.GetMeta(stepId) : null
        if (!meta) {
            break
        }
        if (stepId === savedStepId) {
            return savedStepId
        }
        if (reportId && stepId === reportId) break
        stepId = parseInt(meta.NextId ? meta.NextId() : 0, 10) || 0
    }
    return firstStepId
}

MergeTutorialStateMachine.ShouldResumeSavedTriggerProgress = function(owner, triggerMeta) {
    if (!owner || !triggerMeta || !triggerMeta.Id) return false
    if (triggerMeta.Enabled && !triggerMeta.Enabled()) {
        return false
    }
    if (owner.IsTriggerQueued && owner.IsTriggerQueued(triggerMeta.Id())) {
        return false
    }
    if (owner.IsTriggerCompleted && owner.IsTriggerCompleted(triggerMeta)) {
        return false
    }

    var savedStepId = this.ResolveBestSavedTriggerStepId(owner, triggerMeta)
    if (!savedStepId) {
        return false
    }
    var savedStepMeta = this.FindTriggerStepMetaInChain(owner, triggerMeta, savedStepId)
    if (!savedStepMeta) {
        return false
    }
    var resolvedStepId = this.ResolveTriggerStartStepId(owner, triggerMeta)
    return !!resolvedStepId
}

MergeTutorialStateMachine.IsTriggerQueued = function(owner, triggerId) {
    if (!owner) return false
    if (owner.pendingTriggerStartSaveTriggerId && owner.pendingTriggerStartSaveTriggerId === triggerId) return true
    if (owner.activeTriggerMeta && owner.activeTriggerMeta.Id && owner.activeTriggerMeta.Id() === triggerId) return true
    var queue = owner.triggerQueue || []
    for (var i = 0; i < queue.length; i++) {
        if (queue[i] && queue[i].Id && queue[i].Id() === triggerId) return true
    }
    return false
}

MergeTutorialStateMachine.SetTriggerStartStepOverride = function(owner, triggerMeta, stepId) {
    if (!owner || !triggerMeta || !triggerMeta.Id) return false
    stepId = parseInt(stepId, 10) || 0
    if (!stepId) return false
    owner.triggerStartStepOverrides = owner.triggerStartStepOverrides || {}
    owner.triggerStartStepOverrides[triggerMeta.Id()] = stepId
    return true
}

MergeTutorialStateMachine.PeekTriggerStartStepOverride = function(owner, triggerMeta) {
    if (!owner || !triggerMeta || !triggerMeta.Id || !owner.triggerStartStepOverrides) return 0
    return parseInt(owner.triggerStartStepOverrides[triggerMeta.Id()], 10) || 0
}

MergeTutorialStateMachine.TakeTriggerStartStepOverride = function(owner, triggerMeta) {
    if (!owner || !triggerMeta || !triggerMeta.Id || !owner.triggerStartStepOverrides) return 0
    var triggerId = triggerMeta.Id()
    var stepId = parseInt(owner.triggerStartStepOverrides[triggerId], 10) || 0
    delete owner.triggerStartStepOverrides[triggerId]
    return stepId
}

MergeTutorialStateMachine.EnqueueTrigger = function(owner, triggerMeta, deferStart) {
    if (!owner || !triggerMeta || this.IsTriggerQueued(owner, triggerMeta.Id())) {
        return false
    }
    owner.triggerQueue = owner.triggerQueue || []
    owner.triggerQueue.push(triggerMeta)
    owner.triggerQueue.sort(function(a, b) {
        return (b.Priority ? b.Priority() : 0) - (a.Priority ? a.Priority() : 0)
    })
    if (!deferStart && owner.TryStartNextTrigger) owner.TryStartNextTrigger()
    return true
}

MergeTutorialStateMachine.EnqueueTriggerAtStep = function(owner, triggerMeta, stepId, deferStart) {
    if (!owner || !triggerMeta || !stepId) return false
    if (this.IsTriggerQueued(owner, triggerMeta.Id())) return false
    this.SetTriggerStartStepOverride(owner, triggerMeta, stepId)
    return this.EnqueueTrigger(owner, triggerMeta, deferStart)
}

MergeTutorialStateMachine.ScheduleTriggerStartRetry = function(owner, delay) {
    if (!owner || owner.triggerStartRetryTimer) {
        return
    }
    var retryDelay = delay == null ? owner.triggerStartRetryDelay : delay
    owner.triggerStartRetryTimer = setTimeout(function() {
        owner.triggerStartRetryTimer = null
        if (owner.TryStartNextTrigger) owner.TryStartNextTrigger()
    }, Math.max(0, Number(retryDelay) || 0))
}

MergeTutorialStateMachine.StartTrigger = function(owner, triggerMeta) {
    if (!owner || !triggerMeta) return
    var overrideStepId = this.TakeTriggerStartStepOverride(owner, triggerMeta)
    var startStepId = overrideStepId || this.ResolveTriggerStartStepId(owner, triggerMeta)
    if (!startStepId) {
        if (owner.TryStartNextTrigger) owner.TryStartNextTrigger()
        return
    }
    this.SaveLocalTriggerProgress(owner, triggerMeta, startStepId)
    if (owner.SaveTriggerStartStepIfNeeded && owner.SaveTriggerStartStepIfNeeded(triggerMeta, startStepId)) {
        return
    }
    this.BeginTriggerAtStep(owner, triggerMeta, startStepId)
}

MergeTutorialStateMachine.BeginTriggerAtStep = function(owner, triggerMeta, stepId) {
    if (!owner || !triggerMeta || !stepId) return
    owner.activeTriggerMeta = triggerMeta
    owner.activeTriggerBlockMode = triggerMeta.BlockMode ? triggerMeta.BlockMode() : owner.TriggerBlockModes.None
    owner.activeTriggerStepId = stepId
    this.SaveLocalTriggerProgress(owner, triggerMeta, stepId)
    if (!owner.activeTriggerStepId) {
        this.ClearActiveTriggerState(owner)
        if (owner.TryStartNextTrigger) owner.TryStartNextTrigger()
        return
    }
    if (owner.startTriggerStep) owner.startTriggerStep()
}

MergeTutorialStateMachine.SaveTriggerStartStepIfNeeded = function(owner, triggerMeta, stepId) {
    return false
}

MergeTutorialStateMachine.ClearActiveTriggerState = function(owner) {
    if (!owner) return
    if (owner.CancelTriggerStepContextRetry) owner.CancelTriggerStepContextRetry()
    owner.activeTriggerMeta = null
    owner.activeTriggerStepId = 0
    owner.activeTriggerStepMeta = null
    owner.activeTriggerGuideMeta = null
    owner.activeTriggerBlockMode = ''
    owner.runningActionStepId = 0
    owner.openingTriggerBuildWindowStepId = 0
}

MergeTutorialStateMachine.StartTriggerStep = function(owner) {
    if (!owner) return
    if (owner.CancelTriggerStepContextRetry) owner.CancelTriggerStepContextRetry()
    if (!owner.activeTriggerMeta || !owner.activeTriggerStepId) return
    owner.activeTriggerStepMeta = owner.GetMeta ? owner.GetMeta(owner.activeTriggerStepId) : null
    if (!owner.activeTriggerStepMeta) {
        console.warn('MergeTutorialManager missing trigger step meta', owner.activeTriggerStepId)
        this.ClearActiveTriggerState(owner)
        if (owner.TryStartNextTrigger) owner.TryStartNextTrigger()
        return
    }
    if (owner.activeTriggerStepMeta.IsEnd && owner.activeTriggerStepMeta.IsEnd()) {
        if (owner.CompleteActiveTrigger) owner.CompleteActiveTrigger()
        return
    }
    if (owner.EnsureTriggerStepStartContext && !owner.EnsureTriggerStepStartContext(owner.activeTriggerStepMeta)) {
        return
    }
    owner.activeTriggerGuideMeta = owner.GetGuideMeta ? owner.GetGuideMeta(owner.activeTriggerStepMeta.GuideId()) : null
    if (owner.BindNodeClickTargetIfNeeded) owner.BindNodeClickTargetIfNeeded(owner.activeTriggerStepMeta)
    if (owner.RefreshMainForcedTutorialHiddenControls) owner.RefreshMainForcedTutorialHiddenControls()
    if (owner.activeTriggerStepMeta.CompleteType() === owner.CompleteTypes.Auto) {
        if (owner.nextTriggerStep) owner.nextTriggerStep()
        return
    }
    if (owner.activeTriggerStepMeta.CompleteType() === owner.CompleteTypes.FlowEvent && !owner.activeTriggerGuideMeta) {
        if (owner.CloseTutorialWindow) owner.CloseTutorialWindow()
        if (owner.RunStepActionIfNeeded) owner.RunStepActionIfNeeded(owner.activeTriggerStepMeta, null)
        return
    }
    if (owner.showTriggerWindow) owner.showTriggerWindow()
}

MergeTutorialStateMachine.ShouldForceSaveTriggerStep = function(owner, stepId) {
    return !!(owner && (parseInt(stepId, 10) || 0))
}

MergeTutorialStateMachine.NextTriggerStep = function(owner) {
    if (!owner || !owner.activeTriggerStepMeta) return
    var lastId = owner.activeTriggerStepMeta.Id ? owner.activeTriggerStepMeta.Id() : 0
    var nextId = owner.activeTriggerStepMeta.NextId()
    if (!nextId) {
        if (owner.CompleteActiveTrigger) owner.CompleteActiveTrigger()
        return
    }
    var nextMeta = owner.GetMeta ? owner.GetMeta(nextId) : null
    if (owner.activeTriggerMeta) {
        this.SaveLocalTriggerProgress(owner, owner.activeTriggerMeta, nextId)
    }
    var saveStepId = owner.GetTriggerServerSaveStepId
        ? owner.GetTriggerServerSaveStepId(owner.activeTriggerMeta, lastId, nextId)
        : lastId
    var saveStepMeta = owner.GetTriggerServerSaveStepMeta
        ? owner.GetTriggerServerSaveStepMeta(owner.activeTriggerMeta, owner.activeTriggerStepMeta, nextMeta)
        : owner.activeTriggerStepMeta
    if (owner.ShouldSaveTriggerServerStep &&
        owner.ShouldSaveTriggerServerStep(owner.activeTriggerMeta, saveStepMeta, saveStepId, nextMeta)) {
        var saveOptions = this.ShouldForceSaveTriggerStep(owner, saveStepId) ? { force: true } : null
        if (owner.SaveServerStep) owner.SaveServerStep(saveStepId, null, null, saveOptions)
    }
    owner.activeTriggerStepId = nextId
    if (owner.SetTriggerTutorialId && owner.activeTriggerMeta) {
        owner.SetTriggerTutorialId(owner.activeTriggerMeta, nextId)
    } else if (typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId && owner.activeTriggerMeta) {
        Game.SUserMergeTutorial.SetTutorialId(owner.GetTriggerGroupId(owner.activeTriggerMeta), nextId)
    }
    if (owner.startTriggerStep) owner.startTriggerStep()
}

MergeTutorialStateMachine.CompleteActiveTrigger = function(owner) {
    if (!owner) return
    var triggerMeta = owner.activeTriggerMeta
    this.ClearActiveTriggerState(owner)
    if (owner.CloseTutorialWindow) owner.CloseTutorialWindow()
    if (triggerMeta && owner.MarkTriggerCompletedAndReport) {
        owner.MarkTriggerCompletedAndReport(triggerMeta)
    }
    if (owner.RefreshMainForcedTutorialHiddenControls) owner.RefreshMainForcedTutorialHiddenControls()
    if (owner.TryStartNextTrigger) owner.TryStartNextTrigger()
}

MergeTutorialStateMachine.CanSkipActiveTrigger = function(owner) {
    return false
}

MergeTutorialStateMachine.SkipActiveTrigger = function(owner) {
    if (!this.CanSkipActiveTrigger(owner)) return false
    this.CompleteActiveTrigger(owner)
    return true
}

MergeTutorialStateMachine.MarkTriggerCompletedAndReport = function(owner, triggerMeta) {
    if (!owner || !triggerMeta) return
    var reportId = parseInt(triggerMeta.CompletionReportId(), 10)
    var groupId = owner.GetTriggerGroupId ? owner.GetTriggerGroupId(triggerMeta) : 0
    if (!reportId || !groupId) {
        return
    }
    this.ClearLocalTriggerProgress(owner, triggerMeta)
    owner.completedTriggerReports = owner.completedTriggerReports || {}
    owner.completedTriggerReports[reportId] = true
    if (typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(groupId, reportId)
    }
    if (owner.QueueTriggerReport) owner.QueueTriggerReport(reportId, groupId)
}

MergeTutorialStateMachine.QueueTriggerReport = function(owner, reportId, groupId) {
    if (!owner) return
    owner.pendingTriggerReports = owner.pendingTriggerReports || []
    for (var i = 0; i < owner.pendingTriggerReports.length; i++) {
        if (owner.pendingTriggerReports[i].reportId === reportId) {
            return
        }
    }
    owner.pendingTriggerReports.push({ reportId: reportId, groupId: groupId })
    if (owner.FlushTriggerReports) owner.FlushTriggerReports()
}

MergeTutorialStateMachine.FlushTriggerReports = function(owner) {
    if (!owner || owner.isReportingTrigger || !owner.pendingTriggerReports || owner.pendingTriggerReports.length === 0) return
    var item = owner.pendingTriggerReports[0]
    owner.isReportingTrigger = true
    var req = SR.SRMergeTutorial.finishStep(item.reportId)
    req.SetCallBack(function(res) {
        owner.isReportingTrigger = false
        owner.pendingTriggerReports.shift()
        if (res && res.userTutorial && typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.updateData) {
            Game.SUserMergeTutorial.updateData(res.userTutorial)
        }
        if (owner.FlushTriggerReports) owner.FlushTriggerReports()
    })
    var retry = function() {
        owner.isReportingTrigger = false
        if (owner.ScheduleTriggerReportRetry) owner.ScheduleTriggerReportRetry()
    }
    req.SetErrorCallBack(retry)
    req.SetNetErrorCallBack(retry)
    req.Send()
}

MergeTutorialStateMachine.ScheduleTriggerReportRetry = function(owner) {
    if (!owner || owner.triggerReportRetryTimer) return
    owner.triggerReportRetryTimer = setTimeout(function() {
        owner.triggerReportRetryTimer = null
        if (owner.FlushTriggerReports) owner.FlushTriggerReports()
    }, owner.triggerReportRetryDelay)
}

MergeTutorialStateMachine.InitMainOrTrigger = function(owner) {
    if (!owner) return
    if (owner.IsFinished()) {
        if (owner.ClearLocalMainTutorialStep) owner.ClearLocalMainTutorialStep()
        if (owner.RefreshMainForcedTutorialHiddenControls) owner.RefreshMainForcedTutorialHiddenControls()
        var resumed = owner.TryResumeSavedTriggerProgress ? owner.TryResumeSavedTriggerProgress() : false
        if (!resumed && owner.TryRecoverTriggerProgressFromStateWithRetry) {
            owner.TryRecoverTriggerProgressFromStateWithRetry()
        }
        if (owner.TryConsumePendingRewardReadyNotifications) owner.TryConsumePendingRewardReadyNotifications()
        if (owner.TryStartNextTrigger) owner.TryStartNextTrigger()
        return
    }
    owner.currentId = owner.ResolveMainTutorialStartId ? owner.ResolveMainTutorialStartId() : owner.StartId
    owner.currentDragStartTile = ''
    if (owner.SaveLocalMainTutorialStep) owner.SaveLocalMainTutorialStep(owner.currentId)
    if (typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(owner.MainTutorialGroupId, owner.currentId)
    }
    if (owner.RefreshMainForcedTutorialHiddenControls) owner.RefreshMainForcedTutorialHiddenControls()
    if (owner.tryStartStep) owner.tryStartStep()
}

MergeTutorialStateMachine.TryStartMainStep = function(owner) {
    if (!owner) return
    owner.currentMeta = owner.GetMeta ? owner.GetMeta(owner.currentId) : null
    if (!owner.currentMeta) {
        console.error('MergeTutorialManager missing meta', owner.currentId)
        return
    }
    if (owner.currentMeta.IsEnd && owner.currentMeta.IsEnd()) {
        if (owner.finishForcedTutorial) owner.finishForcedTutorial()
        return
    }
    if (owner.currentMeta.StartType && owner.currentMeta.StartType() === 'window') {
        if (typeof UIRoot === 'undefined' || !UIRoot.instance || UIRoot.instance.currentWindowName !== owner.currentMeta.StartParam()) {
            return
        }
    }
    if (owner.startStep) owner.startStep()
}

MergeTutorialStateMachine.StartMainStep = function(owner) {
    if (!owner || !owner.currentMeta) return
    owner.currentGuideMeta = owner.GetGuideMeta ? owner.GetGuideMeta(owner.currentMeta.GuideId()) : null
    if (owner.BindNodeClickTargetIfNeeded) owner.BindNodeClickTargetIfNeeded(owner.currentMeta)
    if (owner.RefreshMainForcedTutorialHiddenControls) owner.RefreshMainForcedTutorialHiddenControls()
    if (owner.currentMeta.CompleteType() === owner.CompleteTypes.Auto) {
        if (owner.nextStep) owner.nextStep()
        return
    }
    if (owner.showWindow) owner.showWindow()
}

MergeTutorialStateMachine.NextMainStep = function(owner) {
    if (!owner || !owner.currentMeta) return
    var lastId = owner.currentMeta.Id()
    if (owner.currentMeta.SaveServer && owner.currentMeta.SaveServer()) {
        if (owner.SaveServerStep) owner.SaveServerStep(lastId, null, null, { force: true })
    }
    var nextId = owner.currentMeta.NextId()
    if (!nextId) return
    var nextMeta = owner.GetMeta ? owner.GetMeta(nextId) : null
    owner.currentId = nextId
    if (owner.SaveLocalMainTutorialStep) owner.SaveLocalMainTutorialStep(nextId)
    if (nextMeta && nextMeta.IsEnd && nextMeta.IsEnd()) {
        owner.currentMeta = nextMeta
        if (owner.finishForcedTutorial) owner.finishForcedTutorial()
        return
    }
    if (typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(owner.MainTutorialGroupId, nextId)
    }
    owner.generatorClickProgress = {}
    owner.currentDragStartTile = ''
    if (owner.tryStartStep) owner.tryStartStep()
}

MergeTutorialStateMachine.FinishForcedTutorial = function(owner) {
    if (!owner) return
    if (owner.isReportingFinish) {
        return
    }
    owner.isReportingFinish = true
    if (owner.finishForcedTutorialReport) owner.finishForcedTutorialReport()
}

MergeTutorialStateMachine.SkipForcedTutorial = function(owner) {
    if (!owner) return
    if (owner.IsFinished && owner.IsFinished()) return
    if (owner.isReportingFinish) return
    if (!owner.currentMeta || !this.IsMainForcedTutorialStep(owner, owner.currentMeta)) return
    this.FinishForcedTutorial(owner)
}

MergeTutorialStateMachine.FinishForcedTutorialReport = function(owner) {
    if (!owner) return
    var req = SR.SRMergeTutorial.finishStep(owner.finish_report_id)
    req.SetCallBack(function(res) {
        if (owner.completeForcedTutorial) owner.completeForcedTutorial(res && res.userTutorial)
    })
    req.SetErrorCallBack(function(error) {
        if (owner.retryFinishForcedTutorial) owner.retryFinishForcedTutorial('finishStep', error)
    })
    req.SetNetErrorCallBack(function(error) {
        if (owner.retryFinishForcedTutorial) owner.retryFinishForcedTutorial('finishStepNet', error)
    })
    req.Send()
}

MergeTutorialStateMachine.CompleteForcedTutorial = function(owner, userTutorialData) {
    if (!owner) return
    this.ClearTimer(owner, 'finishRetryTimer')
    if (typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.updateData && userTutorialData) {
        Game.SUserMergeTutorial.updateData(userTutorialData)
    }
    if (typeof Game !== 'undefined' && Game.SUserMergeTutorial && Game.SUserMergeTutorial.SetTutorialId) {
        Game.SUserMergeTutorial.SetTutorialId(owner.MainTutorialGroupId, owner.finish_report_id)
    }
    if (owner.ClearLocalMainTutorialStep) owner.ClearLocalMainTutorialStep()
    owner.currentId = owner.finish_report_id
    owner.currentMeta = owner.GetMeta ? owner.GetMeta(owner.finish_report_id) : null
    owner.currentGuideMeta = null
    owner.isReportingFinish = false
    if (owner.RefreshMainForcedTutorialHiddenControls) owner.RefreshMainForcedTutorialHiddenControls()
    if (owner.mainWindow && owner.mainWindow.close) {
        owner.mainWindow.close()
    }
    var cb = owner.finishCallback
    owner.finishCallback = null
    if (cb) {
        cb()
    }
}

MergeTutorialStateMachine.RetryFinishForcedTutorial = function(owner, stage, error) {
    if (!owner || owner.finishRetryTimer) return
    owner.finishRetryTimer = setTimeout(function() {
        owner.finishRetryTimer = null
        if (owner.finishForcedTutorialReport) owner.finishForcedTutorialReport()
    }, owner.finishRetryDelay)
}

export default MergeTutorialStateMachine
