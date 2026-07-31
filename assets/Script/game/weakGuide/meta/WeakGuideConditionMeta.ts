import '../../../LegacyGlobals';

export default class WeakGuideConditionMeta {
    private _data: Record<string, any> = {};
    static MakeEntity(data: Record<string, any>) { const meta = new WeakGuideConditionMeta(); meta.UpdateData(data); return meta; }
    UpdateData(data: Record<string, any>) { this._data = data || {}; }
    Data() { return this._data; }
    Id() { return this._number('id'); }
    GuideId() { return this._number('guide_id'); }
    Rule() { const value = this._data.rule; return value == null ? '' : String(value); }
    ParamRaw() { return this._data.param || ''; }
    Param() {
        const value = this.ParamRaw();
        if (value && typeof value === 'object') return value;
        if (!value || typeof value !== 'string') return {};
        try { const parsed = JSON.parse(value); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; }
        catch { return {}; }
    }
    Remark() { const value = this._data.remark; return value == null ? '' : String(value); }
    private _number(key: string) { const value = Number(this._data[key]); return Number.isNaN(value) ? 0 : value; }
}

Meta.WeakGuideConditionMeta = WeakGuideConditionMeta;
