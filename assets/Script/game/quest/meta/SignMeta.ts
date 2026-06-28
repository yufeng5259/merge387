import '../../../LegacyGlobals';
class SignMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new SignMeta()
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

    //签到类型 SignMeta.Types
    Type() {
        return this._data.type
    }

    //天数
    Day() {
        return this._data.day
    }
    Reward(curmapLv) {

        if (!this.reward) {
            this.reward = Game.Content.FromStrings(this._data.reward)
            this.reward = Game.Content.Merge(this.reward)
        }
        return this.reward
    }
}

SignMeta.Types = {
    Week: 1,
    Month: 2,
}
//获取月或日meta
SignMeta.GetByTypeDay = (type, day) => {
    // 暴力枚举
    let data = null;
    let obj = Meta.MetaManager.GetMetas(Meta.MetaType.Sign);
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            if(element.Type() ==type&&element.Day() == day){
                data = element;
            }
        }
    }
    return data
}
SignMeta.GetById = id => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.Sign, id)
}

global.Meta.SignMeta = SignMeta