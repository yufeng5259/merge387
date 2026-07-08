import '../../LegacyGlobals';

type LevelUpDisplayLockOptions = {
    oldLevel?: number;
    newLevel?: number;
    oldExpInfo?: any;
    rewards?: any[];
};

const LevelUpDisplayLock = {
    _locked: false,
    _oldLevel: null as number | null,
    _newLevel: null as number | null,
    _oldExpInfo: null as any,
    _rewards: null as any[] | null,

    _toNumber(value: any, defaultValue: number) {
        const num = Number(value);
        return isFinite(num) ? num : defaultValue;
    },

    Begin(options?: LevelUpDisplayLockOptions) {
        const opts = options || {};
        const oldLevel = Math.floor(this._toNumber(opts.oldLevel, 0));
        const newLevel = Math.floor(this._toNumber(opts.newLevel, 0));
        const rewards = opts.rewards || [];
        if (oldLevel <= 0 || newLevel <= oldLevel) return false;
        if (!rewards || rewards.length <= 0) return false;

        this._locked = true;
        this._oldLevel = oldLevel;
        this._newLevel = newLevel;
        this._oldExpInfo = opts.oldExpInfo || null;
        this._rewards = rewards;
        return true;
    },

    IsLocked() {
        return !!this._locked;
    },

    GetOldLevel() {
        return this._oldLevel;
    },

    GetNewLevel() {
        return this._newLevel;
    },

    GetRewards() {
        return this._rewards || [];
    },

    GetDisplayLevel(user: any) {
        if (this.IsLocked() && this._oldLevel != null) {
            return this._oldLevel;
        }
        if (user && user.Level) return user.Level();
        return 0;
    },

    GetDisplayExpInfo(user: any) {
        if (this.IsLocked()) {
            const oldInfo = this._oldExpInfo || {};
            const need = Math.max(1, this._toNumber(oldInfo.need, 1));
            return {
                current: need,
                need,
                progress: 1,
                totalExp: this._toNumber(oldInfo.totalExp, 0),
                levelStartExp: this._toNumber(oldInfo.levelStartExp, 0),
                nextLevelExp: this._toNumber(oldInfo.nextLevelExp, need),
            };
        }
        if (user && user.GetLevelExpInfo) return user.GetLevelExpInfo();
        return {
            current: 0,
            need: 1,
            progress: 0,
            totalExp: 0,
            levelStartExp: 0,
            nextLevelExp: 1,
        };
    },

    GetLevelWindowText(showParams: any, user: any) {
        const params = showParams || {};
        const newLevel = params.newLevel != null ? params.newLevel : this.GetNewLevel();
        if (newLevel != null) return String(newLevel);
        if (user && user.Level) return String(user.Level());
        return '';
    },

    Release(options?: { dispatch?: boolean }) {
        const opts = options || {};
        if (!this.IsLocked()) return false;

        this.Reset();

        if (opts.dispatch !== false &&
            typeof GameKit !== 'undefined' &&
            GameKit.GameEvent &&
            GameKit.GameEvent.DispatcherEvent &&
            GameKit.GameEvent.EventName) {
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.UserInfoEvent);
        }
        return true;
    },

    Reset() {
        this._locked = false;
        this._oldLevel = null;
        this._newLevel = null;
        this._oldExpInfo = null;
        this._rewards = null;
    },
};

Game.LevelUpDisplayLock = LevelUpDisplayLock;

export default LevelUpDisplayLock;
