import '../../LegacyGlobals';

const MergeTutorialUIController: any = {}

MergeTutorialUIController.RefreshCurrentWindow = function(owner) {
    if (!owner.mainWindow || !owner.mainWindow.showMeta) return
    if (owner.activeTriggerStepMeta) {
        owner.mainWindow.showMeta(owner.activeTriggerStepMeta, owner.activeTriggerGuideMeta)
    } else if (owner.currentMeta) {
        owner.mainWindow.showMeta(owner.currentMeta, owner.currentGuideMeta)
    }
}

MergeTutorialUIController.CloseTutorialWindow = function(owner) {
    if (typeof UIRoot !== 'undefined' && UIRoot && UIRoot.instance && UIRoot.instance.closeChildWindow) {
        UIRoot.instance.closeChildWindow('MergeTutorialWindow')
    } else if (owner.mainWindow && owner.mainWindow.close) {
        owner.mainWindow.close()
    }
    owner.mainWindow = null
}

MergeTutorialUIController.ShowMainWindow = function(owner) {
    if (!owner.currentMeta) return
    if (!owner.currentGuideMeta && owner.currentMeta.CompleteType() !== owner.CompleteTypes.FullscreenClick) return
    if (typeof UIRoot === 'undefined' || !UIRoot || !UIRoot.instance || !UIRoot.instance.openChildWindow) return
    UIRoot.instance.openChildWindow('MergeTutorialWindow', {
        meta: owner.currentMeta,
        guideMeta: owner.currentGuideMeta,
        showCallback: function(wnd) {
            if (wnd && wnd.showMeta) {
                wnd.showMeta(owner.currentMeta, owner.currentGuideMeta)
            }
        },
    })
}

MergeTutorialUIController.ShowTriggerWindow = function(owner) {
    if (!owner.activeTriggerStepMeta) return
    if (!owner.activeTriggerGuideMeta && owner.activeTriggerStepMeta.CompleteType() !== owner.CompleteTypes.FullscreenClick) return
    if (typeof UIRoot === 'undefined' || !UIRoot || !UIRoot.instance || !UIRoot.instance.openChildWindow) return
    UIRoot.instance.openChildWindow('MergeTutorialWindow', {
        meta: owner.activeTriggerStepMeta,
        guideMeta: owner.activeTriggerGuideMeta,
        showCallback: function(wnd) {
            if (wnd && wnd.showMeta) {
                wnd.showMeta(owner.activeTriggerStepMeta, owner.activeTriggerGuideMeta)
            }
            owner.RunStepActionIfNeeded(owner.activeTriggerStepMeta, wnd)
        },
    })
}

MergeTutorialUIController.RunStepActionIfNeeded = function(owner, stepMeta, wnd) {
    if (!stepMeta || !stepMeta.ActionType) return false
    var actionType = stepMeta.ActionType()
    if (!actionType) return false
    var stepId = stepMeta.Id ? stepMeta.Id() : 0
    if (owner.runningActionStepId === stepId) return false
    if (actionType === 'play_generator_reward_fly') {
        owner.runningActionStepId = stepId
        var mergeId = stepMeta.ActionParam ? stepMeta.ActionParam() : owner.P5GeneratorMergeId
        if (owner.LogGeneratorRewardFly) {
            owner.LogGeneratorRewardFly('RunStepActionIfNeeded:play_generator_reward_fly', {
                stepId: stepId,
                mergeId: mergeId,
                hasWindow: !!wnd,
                hasPlayGeneratorRewardFly: !!(wnd && wnd.playGeneratorRewardFly),
            })
        }
        if (wnd && wnd.playGeneratorRewardFly) {
            wnd.playGeneratorRewardFly(mergeId, function() {
                if (owner.LogGeneratorRewardFly) {
                    owner.LogGeneratorRewardFly('RunStepActionIfNeeded:generator_reward_fly_done', {
                        stepId: stepId,
                        mergeId: mergeId,
                    })
                }
                owner.EmitFlowEvent('generator_reward_fly_done')
            })
            return true
        }
        if (owner.LogGeneratorRewardFly) {
            owner.LogGeneratorRewardFly('RunStepActionIfNeeded:noWindowSkipAnimation', {
                stepId: stepId,
                mergeId: mergeId,
            })
        }
        owner.EmitFlowEvent('generator_reward_fly_done')
        return true
    }
    return false
}

export default MergeTutorialUIController