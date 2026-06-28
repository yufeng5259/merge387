import '../../../LegacyGlobals';
//�?
class LevelMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new LevelMeta()
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
    //角色所需经验
    Exp() {
        return this._data.exp
    }
    /**
     * 奖励2=0=100;3=0=200;4=0=300
     * @returns {string}
     */
    Rewards() {
        return this._data.rewards
    }
    
}
global.Meta.LevelMeta = LevelMeta