import '../../../LegacyGlobals';
class TaskMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new TaskMeta()
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

    //任务类型 TaskMeta.Types
    Type() {
        return this._data.type
    }

    Name() {
        return GameKit.i18n.sel(this._data.name)
    }

    Description() {
        return GameKit.i18n.sel(this._data.description)
    }

    //任务目标 TaskMeta.Targets
    Target() {
        return this._data.target
    }
    //任务icon
    TaskIcon() {
        return this._data.target
    }
    //任务需求计�?
    Count() {
        return this._data.count
    }

    Reward() {
        if (!this.reward) {
            this.reward = Game.Content.FromStrings(this._data.reward)
            this.reward = Game.Content.Merge(this.reward)
        }
        return this.reward
    }

    //前往
    Goto() {
        return this._data.goto
    }
    
    //前置任务
    Before() {
        return this._data.before
    }
}

TaskMeta.Types = {
    Daily: 1,
}

TaskMeta.Targets = {
    spin: "spin",
    giftspin: "giftspin",
    shareraid: "shareraid",
    shareattack: "shareattack",
    attack: "attack",
    raid: "raid",
    raidcoin: "raidcoin",
    spentcoin: "spentcoin",
    build: "build",

    levelup:"levelup",
}

TaskMeta.GetById = (id) => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.Task, id)
}

global.Meta.TaskMeta = TaskMeta
