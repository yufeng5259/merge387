import '../../../../LegacyGlobals';
class NewPassPortTaskMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new NewPassPortTaskMeta()
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
    //任务图标
    Icon(){
        return this._data.icon
    }
    //任务名称
    Name(){
        return GameKit.i18n.sel(this._data.name)
    }
    //任务需求计�?
    Count(){
        return parseInt(this._data.count)
    }
    //道具奖励 �?1=10=1 表示1个道具id�?0的道具，数量�?
    ItemReward(){
        return Game.Content.FromStrings(this._data.itemReward)
    }

    ExpValue(){
        return this._data.expValue
    }

    //任务类型
    Type(){
        return this._data.type
    }
    //任务时间（s�?
    Time(){
        return this._data.time
    }
    //剩余时间
    RemainingTime(){
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        let dayIndex = GameKit.TimeUtil.getCurrentDay(currentTime)
        let dayStart = dayIndex * GameKit.TimeUtil.DayInSecond - GameKit.TimeUtil.TimeZoneInSecond
        let endTime = dayStart + this.Time()
        let remain = endTime - currentTime
        if (remain < 0) remain = 0
        return remain
    }

    //根据任务类型获取任务列表
    /**
     * 获取未过期的任务列表
     * @param {number} type 任务类型
     * @returns {NewPassPortTaskMeta[]} 任务列表
     */
    static GetTaskByType(type){
        let metas=Meta.MetaManager.GetMetas(Meta.MetaType.NewpassPortTask)
        let metaArr=[]
        for (let key in metas) {
            let meta=metas[key]
            if(meta.Type() === type&&meta.RemainingTime()>0){
                metaArr.push(meta)
            }
        }
        return metaArr;
    }
}

global.Meta.NewPassPortTaskMeta = NewPassPortTaskMeta