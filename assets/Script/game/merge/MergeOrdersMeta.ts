import '../../LegacyGlobals';
class MergeOrdersMeta {
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
    Id() {
        return this._data.id
    }
    /**
     * 地图id
     * @returns 
     */
    MapId() {
        return this._data.mapId
    }
    /**
     * 订单内容
     * @returns {string} 订单内容
     */
    Content() {
        return this._data.content
    }
    /**
     * 奖励
     * @returns {string} 奖励
     */
    Reward() {
        return this._data.reward
    }
    AdditionReward() {
        return this._data.additionReward
    }
    /**
     * 难度
     * @returns {number} 难度
     */
    Difficulty() {
        return this._data.difficulty
    }
    /**
     * 最大物品奖�?
     * @returns {number} 最大物品奖�?
     */
    MaxItemReward() {
        return this._data.maxItemReward
    }
    /**
    /**角色名称 */
    RoleName() {
        return this._data.roleName
    }
}


global.Meta.MergeOrdersMeta = MergeOrdersMeta