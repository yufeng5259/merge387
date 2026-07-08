import '../../LegacyGlobals';

type ShopDataCallback = (success: boolean, data: any) => void;

type ShopDataOptions = {
    force?: boolean;
    silence?: boolean;
};

const ShopData = {
    _data: null as any,
    _requesting: false,
    _callbacks: [] as ShopDataCallback[],

    GetInfo(callback?: ShopDataCallback, options?: ShopDataOptions | boolean) {
        const opts = options || {};
        const force = options === true || (typeof opts === 'object' && opts.force === true);
        const silence = typeof opts === 'object' ? opts.silence !== false : true;

        if (!force && this._data != null) {
            if (callback) callback(true, this._data);
            return;
        }

        if (callback) this._callbacks.push(callback);
        if (this._requesting) return;

        this._requesting = true;

        if (typeof SR === 'undefined' || !SR.SRShop || !SR.SRShop.shopGetInfo) {
            this.finishRequest(false, null);
            return;
        }

        const req = SR.SRShop.shopGetInfo();
        if (req.SetSilence) req.SetSilence(silence);
        req.SetCallBack((res: any) => {
            const data = res && res.data ? res.data : null;
            if (!data) {
                this.finishRequest(false, null);
                return;
            }
            this._data = data;
            this.finishRequest(true, data);
        });
        if (req.SetErrorCallBack) {
            req.SetErrorCallBack(() => {
                this.finishRequest(false, null);
            });
        }
        req.Send();
    },

    Refresh(callback?: ShopDataCallback, options?: ShopDataOptions) {
        this.GetInfo(callback, { ...(options || {}), force: true });
    },

    Clear() {
        this._data = null;
    },

    SetData(data: any) {
        this._data = data || null;
    },

    GetData() {
        return this._data;
    },

    finishRequest(success: boolean, data: any) {
        this._requesting = false;
        const callbacks = this._callbacks;
        this._callbacks = [];
        callbacks.forEach((cb) => {
            if (cb) cb(success, data);
        });
    },
};

Game.ShopData = ShopData;

export default ShopData;
