import '../../../LegacyGlobals';
//id	blID	storyContent	storyUserID	chapterImage
//章节对话�?
class MapStoryMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new MapStoryMeta()
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
    //Town.XLSX(BuildID+LEVEL)
    BlID() {
        return this._data.blID
    }
    //章节内容
    StoryContent() {
        return this._data.storyContent
    }
    //StoryUser.XLSX =ID
    StoryUserID() {
        return this._data.storyUserID
    }
    //章节插图
    ChapterImage() {
        return this._data.chapterImage
    }
    //表情id
    EId() {
        return this._data.eId
    }
    //章节名称
    ChapterName(){
        return this._data.chapterName
    }
    //根据用户角色表id获取用户数据
    GetRoleMeata(eid){
        let meta =Meta.MetaManager.GetMeta(Meta.MetaType.StoryUser,eid);
        return meta;
    }
    //对话列表地图,建筑�?等级
    getContentList(m,b,l,s){
        let hasStage = s != null && s !== "";
        let key = m+"_"+b+"_"+l+(hasStage?"_"+s:"");
        let bid = m+"_"+b;
        let blsID = b+"_"+l+(hasStage?"_"+s:"")
        if(!this._data.Clist){
            this._data.Clist={}
        }
        if(this._data.Clist[key]){
            return this._data.Clist[key];
        }
        this._data.Clist[key] = [];
        var obj = Meta.MetaManager.GetMetas(Meta.MetaType.MapStory+bid)
        obj.forEach(element => {
            if(element.BlID()===blsID){
                this._data.Clist[key].push(element);
            }
        });
        return this._data.Clist[key];
    }
    //通过bid返回等级对话列表
    getContentListByBID(){

    }

}


global.Meta.MapStoryMeta = MapStoryMeta
