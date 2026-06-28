import '../../../../LegacyGlobals';
class PassPortTaskMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new PassPortTaskMeta()
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

    Icon(){
        return this._data.icon
    }

    Name(){
        return this._data.name
    }

    Des(){
        return this._data.des
    }

    MaxCount(){
        return parseInt(this._data.max)
    }

    Exp(){
        return parseInt(this._data.exp)
    }
    //计数目标
    Count(){
        return parseInt(this._data.count)
    }
    //任务目标 TaskMeta.Targets
    Target() {
        return this._data.target
    }
}
PassPortTaskMeta.GetById = (id) => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.PassPortTask, id)
}

global.Meta.PassPortTaskMeta = PassPortTaskMeta