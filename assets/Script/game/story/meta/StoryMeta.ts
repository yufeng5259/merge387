import '../../../LegacyGlobals';

class StoryMeta {
    private _data: any = {};

    static MakeEntity(data: any) {
        const meta = new StoryMeta();
        meta.UpdateData(data);
        return meta;
    }

    UpdateData(data: any) {
        this._data = {};
        for (const key in data) {
            this._data[key] = data[key];
        }
    }

    Data() {
        return this._data;
    }

    Id() {
        return this._data.id;
    }

    BlID() {
        return this._data.blID;
    }

    StoryContent() {
        return this._data.storyContent;
    }

    StoryUserID() {
        return this._data.storyUserID;
    }

    ChapterImage() {
        return this._data.chapterImage;
    }

    EId() {
        return this._data.eId;
    }

    ChapterName() {
        return this._data.chapterName;
    }

    GetRoleMeata(eid: any) {
        return Meta.MetaManager.GetMeta(Meta.MetaType.StoryUser, eid);
    }

    getContentList(m: any, b: any, l: any, s: any) {
        const hasStage = s != null && s !== '';
        const key = m + '_' + b + '_' + l + (hasStage ? '_' + s : '');
        const bid = m + '_' + b;
        const blsID = b + '_' + l + (hasStage ? '_' + s : '');
        if (!this._data.Clist) {
            this._data.Clist = {};
        }
        if (this._data.Clist[key]) {
            return this._data.Clist[key];
        }
        this._data.Clist[key] = [];
        const obj = Meta.MetaManager.GetMetas(Meta.MetaType.MapStory + bid) || {};
        Object.keys(obj).forEach(id => {
            const element = obj[id];
            if (element.BlID() === blsID) {
                this._data.Clist[key].push(element);
            }
        });
        return this._data.Clist[key];
    }

    getContentListByBID() {
    }
}

global.Meta.StoryMeta = StoryMeta;
export default StoryMeta;
