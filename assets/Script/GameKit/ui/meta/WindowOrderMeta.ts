import '../../../LegacyGlobals';
class WindowOrderMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new WindowOrderMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    Group() {
        return this._data.group || ""
    }

    Priority() {
        return this._data.priority || 0
    }

    Stage() {
        return this._data.stage || ""
    }

    WindowName() {
        return this._data.windowName || ""
    }

    WindowNames() {
        return this._data.windowNames || []
    }

    Reason() {
        return this._data.reason || ""
    }

    Enabled() {
        return this._data.enabled !== false
    }

    ContainsWindow(windowName) {
        if (!windowName) return false
        if (this.WindowName() == windowName) return true
        return this.WindowNames().indexOf(windowName) >= 0
    }
}

WindowOrderMeta.Stages = {
    GlobalBlocking: "global_blocking",
    LoginFirstChain: "login_first_chain",
    TutorialOrUnlockChain: "tutorial_or_unlock_chain",
    MapOrFeatureFollowup: "map_or_feature_followup",
    RuntimeReward: "runtime_reward",
}

global.Meta.WindowOrderMeta = WindowOrderMeta
