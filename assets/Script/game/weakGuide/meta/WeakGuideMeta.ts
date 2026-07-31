import '../../../LegacyGlobals';

export default class WeakGuideMeta {
    private _data: Record<string, any> = {};
    static MakeEntity(data: Record<string, any>) { const meta = new WeakGuideMeta(); meta.UpdateData(data); return meta; }
    UpdateData(data: Record<string, any>) { this._data = data || {}; }
    Data() { return this._data; }
    Id() { return this._number('id'); }
    Des() { return this._string('des'); }
    Scene() { return this._string('scene'); }
    Priority() { return this._number('priority'); }
    FlowRaw() { return this._data.flow || ''; }
    Flow() { const flow = this._parseJson(this.FlowRaw(), []); return Array.isArray(flow) ? flow : []; }
    ShowTimeoutMs() { return this._number('show_timeout_ms'); }
    DisableAtLevel() { return this._number('disable_at_level'); }
    MaxSuccessCount() { return this._number('max_success_count'); }
    MaxShowPerEntry() { return this._number('max_show_per_entry'); }
    Enabled() {
        let value = this._data.enabled;
        if (value == null || value === '') return true;
        if (typeof value === 'string') { value = value.trim().toLowerCase(); return value !== '0' && value !== 'false'; }
        return value !== false && value !== 0;
    }
    Remark() { return this._string('remark'); }
    private _string(key: string) { const value = this._data[key]; return value == null ? '' : String(value); }
    private _number(key: string) { const value = Number(this._data[key]); return Number.isNaN(value) ? 0 : value; }
    private _parseJson(value: any, fallback: any) {
        if (value && typeof value === 'object') return value;
        if (!value || typeof value !== 'string') return fallback;
        try { return JSON.parse(value); } catch { return fallback; }
    }
}

Meta.WeakGuideMeta = WeakGuideMeta;
