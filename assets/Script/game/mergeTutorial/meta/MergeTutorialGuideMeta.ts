import '../../../LegacyGlobals';
class MergeTutorialGuideMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new MergeTutorialGuideMeta()
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

    GuideType() {
        return this._data.guide_type || ""
    }

    TargetType() {
        return this._data.target_type || ""
    }

    TargetFrom() {
        return this._data.target_from || ""
    }

    TargetTo() {
        return this._data.target_to || ""
    }

    DialogText() {
        return this._data.dialog_text || ""
    }

    DialogRect() {
        return this._data.dialog_rect || ""
    }

    Mask() {
        return !!this._data.mask
    }

    HighlightType() {
        return this._data.highlight_type || ""
    }

    HighlightParam() {
        return this._data.highlight_param || ""
    }

    Remark() {
        return this._data.remark || ""
    }

    HighlightParamList() {
        if (!this.HighlightParam()) return []
        return this.HighlightParam().split(',').map(x => x.trim()).filter(Boolean)
    }
}

MergeTutorialGuideMeta.GuideTypes = {
    Dialog: "dialog",
    Drag: "drag",
    Click: "click",
    OrderSubmit: "order_submit",
    None: "none",
}

MergeTutorialGuideMeta.TargetTypes = {
    None: "none",
    Tile: "tile",
    Order: "order",
    Node: "node",
}

MergeTutorialGuideMeta.HighlightTypes = {
    None: "none",
    Tile: "tile",
    Order: "order",
    Node: "node",
}

global.Meta.MergeTutorialGuideMeta = MergeTutorialGuideMeta
