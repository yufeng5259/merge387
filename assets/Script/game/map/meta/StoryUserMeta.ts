import '../../../LegacyGlobals';
//对话角色�?
//正常 
//疑惑
//兴奋
//愤�?
//沉�?

var userETypes={
    normal:1,
    doubt:2,
    excited:3,
    anger:4,
    ponder:5
}
class StoryUserMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new StoryUserMeta()
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
    //角色id
    Rid() {
        return this._data.rId
    }
    //
    //角色资源名称
    ResName() {
        return this._data.resName
    }
    //角色性别0=�?1= �?2�?
    Sex() {
        return this._data.sex
    }
    //角色表情类型
    EType() {
        return Number(this._data.eType)
    }
    //角色名称
    Name() {
        return this._data.name
    }
    //说话内容背景
    ContentBG() {
        return this._data.contentBG
    }
    //头像
    Avatar() {
        return this._data.avatar
    }
    //立绘
    Body() {
        return this._data.body
    }
}
StoryUserMeta.poolData={};
global.Meta.StoryUserMeta = StoryUserMeta