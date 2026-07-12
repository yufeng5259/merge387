import '../../LegacyGlobals';
class MergeOrdersMeta {
    _data = {}
    constructor() { }

    static MakeEntity(data) {
        let meta = new MergeOrdersMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }
    _getFirst(keys, defaultValue) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (this._data[key] !== undefined && this._data[key] !== null && this._data[key] !== '') {
                return this._data[key]
            }
        }
        return defaultValue
    }
    Id() {
        return this._getFirst(['id', 'ID', 'Id'], 0)
    }
    /**
     * 地图id
     * @returns 
     */
    Level() {
        return this._getFirst(['level', 'Level', 'lv', 'Lv'], 0)
    }
    MapId() {
        return this._getFirst(['mapId', 'MapId'], this.Level())
    }
    /**
     * 订单内容
     * @returns {string} 订单内容
     */
    Content() {
        return this._getFirst(['content', 'Content'], '')
    }
    /**
     * 奖励
     * @returns {string} 奖励
     */
    Reward() {
        return this._getFirst(['reward', 'Reward'], '')
    }
    AdditionReward() {
        return this._getFirst(['additionReward', 'AdditionReward'], '')
    }
    /**
     * 难度
     * @returns {number} 难度
     */
    Difficulty() {
        return this._getFirst(['difficulty', 'Difficulty'], 1)
    }
    /**
     * 最大物品奖�?
     * @returns {number} 最大物品奖�?
     */
    MaxItemReward() {
        return this._getFirst(['maxItemReward', 'MaxItemReward'], 1)
    }
    /**
    /**角色名称 */
    RoleName() {
        return this._getFirst(['roleName', 'RoleName'], '')
    }
}


global.Meta.MergeOrdersMeta = MergeOrdersMeta