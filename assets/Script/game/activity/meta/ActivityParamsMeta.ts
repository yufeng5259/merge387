import '../../../LegacyGlobals';
class ActivityParamsMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new ActivityParamsMeta()
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

    getValue(key) {
        return this._data[key]
    }
}

ActivityParamsMeta.Types = {
    //AttackMaster
    AttackMaster: "attackMaster",
    AttackMasterReward: "attackMasterReward",
    AttackMasterLimitedReward: "attackMasterLimitedReward",
    AttackMasterLimitedTime: "attackMasterLimitedTime",
    
    //RaidMaster
    RaidMaster: "raidMaster",
    RaidMasterReward: "raidMasterReward",
    RaidMasterLimitedReward: "raidMasterLimitedReward",
    RaidMasterLimitedTime: "raidMasterLimitedTime",

    BuildMaster: "buildMaster",
    Cannon: "cannon",
    
    //SlotCollect
    SlotCollect: "slotCollect",
    SlotCollectReward: "slotCollectReward",
    SlotCollectLimitedReward: "slotCollectLimitedReward",
    SlotCollectLimitedTime: "slotCollectLimitedTime",

    //SlotCollectRank
    SlotCollectRankReward: "slotCollectRankReward",
    SlotCollectRankPoint: "slotCollectRankPoint",
    SlotCollectRankPointReward: "slotCollectRankPointReward",

    NormalPassport: "normalPassport",
    KingPassport: "kingPassport",
    CoinSlotReward: "coinSlotReward",
}

ActivityParamsMeta.GetValue = function(key, id) {
    let meta = Meta.MetaManager.GetMeta(Meta.MetaType.ActivityParams, id)
    if (!meta) return null
    return meta.getValue(key)
}

global.Meta.ActivityParamsMeta = ActivityParamsMeta