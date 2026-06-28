import '../../../LegacyGlobals';

class MergeTutorialMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new MergeTutorialMeta()
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

    Type() {
        return this._data.type
    }

    Des() {
        return this._data.des || ""
    }

    NextId() {
        return this._data.next_id
    }

    StartType() {
        return this._data.start_type || ""
    }

    StartParam() {
        return this._data.start_param || ""
    }

    ActionType() {
        return this._data.action_type || ""
    }

    ActionParam() {
        return this._data.action_param || ""
    }

    CompleteType() {
        return this._data.complete_type || ""
    }

    CompleteParam() {
        return this._data.complete_param || ""
    }

    GuideId() {
        return this._data.guide_id || 0
    }

    ForbidEvents() {
        return this._data.forbid_events || ""
    }

    SaveServer() {
        return !!this._data.save_server
    }

    Remark() {
        return this._data.remark || ""
    }

    IsEnd() {
        return this.Type() === MergeTutorialMeta.Types.End
    }

    ForbidEventList() {
        if (!this.ForbidEvents()) return []
        return this.ForbidEvents().split(',').map(x => x.trim()).filter(Boolean)
    }

}

MergeTutorialMeta.Types = {
    Normal: 0,
    End: 200,
}

global.Meta.MergeTutorialMeta = MergeTutorialMeta
