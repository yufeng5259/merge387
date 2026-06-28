import '../../../LegacyGlobals';
class MergeTutorialTriggerMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new MergeTutorialTriggerMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = data
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    Des() {
        return this._data.des || ""
    }

    TriggerEvent() {
        return this._data.trigger_event || ""
    }

    TriggerParam() {
        return this._data.trigger_param || ""
    }

    ConditionType() {
        return this._data.condition_type || ""
    }

    ConditionParam() {
        return this._data.condition_param || ""
    }

    FirstStepId() {
        return this._data.first_step_id || 0
    }

    CompletionReportId() {
        return this._data.completion_report_id || 0
    }

    Priority() {
        return this._data.priority || 0
    }

    Once() {
        return !!this._data.once
    }

    AllowDuringForced() {
        return !!this._data.allow_during_forced
    }

    BlockMode() {
        return this._data.block_mode || MergeTutorialTriggerMeta.BlockModes.None
    }

    Enabled() {
        return this._data.enabled !== false
    }

    Remark() {
        return this._data.remark || ""
    }

    GroupId() {
        let reportId = parseInt(this.CompletionReportId(), 10)
        if (!reportId) return 0
        return Math.floor(reportId / 10000)
    }
}

MergeTutorialTriggerMeta.BlockModes = {
    None: "none",
    Soft: "soft",
    Force: "force",
}

global.Meta.MergeTutorialTriggerMeta = MergeTutorialTriggerMeta
