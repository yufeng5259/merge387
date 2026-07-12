import '../../LegacyGlobals';

export default class UserStory {
    public data: any;
    private _talkData: any;

    constructor (userId: any) {
        this.data = {
            userId: userId,
        };
        this._talkData = {};
    }

    updateData (data: any) {
        for (var key in data) {
            this.data[key] = data[key];
        }
        return this;
    }

    getData () {
        let data: any = {};
        for (var key in this.data) {
            data[key] = this.data[key];
        }
        return data;
    }

    setData (key: any, value: any) {
        this.data[key] = value;
        return this;
    }

    initData (data: any, typeKey: any) {
        let metaData: any = {};
        typeKey = Meta.MetaType.MapStory + typeKey;
        metaData[typeKey] = {};
        let rawData = data;
        let keys = rawData.keys;
        if (keys) {
            for (let kid in rawData) {
                if (kid !== 'keys') {
                    let id = kid;
                    metaData[typeKey][id] = {};
                    for (let i = 0; i < keys.length; i++) {
                        metaData[typeKey][id][keys[i]] = rawData[kid][i];
                    }
                }
            }
        }
        Meta.MetaManager.InitTypeStoryData(typeKey, Meta.MapStoryMeta.MakeEntity, metaData[typeKey]);
    }

    getStoryPortal () {
        let portal = G.GameConfig.storyPortal;
        return portal;
    }

    getStoryUrl (bid: any) {
        let portal = this.getStoryPortal();
        return portal + bid + '.txt';
    }

    loadStory (url: any, bid: any, callback?: (success: boolean) => void) {
        if (Meta.MetaManager.GetMetas(Meta.MetaType.MapStory + bid)) {
            console.log('story loaded', bid);
            if (callback) callback(true);
            return;
        }

        url = this.getStoryUrl(bid);
        let req: any = null;
        if (this.isLocalPortal(url) || url.indexOf('//47.239.') >= 0) {
            req = new GameKit.NetRequest(url);
            req.SetSilence(true);
            req.SetCallBack(function(this: UserStory, _res: any) {
                if (callback) callback(true);
            }.bind(this));
        } else {
            req = new GameKit.DownloadRequest(url);
            req.SetCallBack(function(this: UserStory, _res: any) {
                try {
                    let res = JSON.parse(_res);
                    Game.SUserStory.initData(res, bid);
                    if (callback) callback(true);
                } catch (e) {
                    if (callback) callback(false);
                    Logs.Error('story JSON.parse error', url);
                    return;
                }
            }.bind(this));
        }
        req.SetErrorCallBack(function(this: UserStory, _res: any) {
            if (callback) callback(false);
            Logs.Error('load story data error', url);
        }.bind(this));
        req.Send();
    }

    getContenListAll (bid: any) {
        var obj = Meta.MetaManager.GetMetas(Meta.MetaType.MapStory + bid);
        var list: any[] = [];
        for (var i in obj) {
            let element = obj[i];
            list.push(element);
        }
        return list;
    }

    getContenListNow (m: any, b: any, l: any) {
    }

    getContentList (m: any, b: any, l: any, s: any) {
        let storyIds = this.getStoryBlIds(b, l, s);
        let key = m + '_' + storyIds.join('|');
        let bid = m + '_' + b;
        if (!this._talkData.Clist) {
            this._talkData.Clist = {};
        }
        if (this._talkData.Clist[key]) {
            return this._talkData.Clist[key];
        }
        this._talkData.Clist[key] = [];
        var obj = Meta.MetaManager.GetMetas(Meta.MetaType.MapStory + bid);

        for (var i in obj) {
            let element = obj[i];
            if (storyIds.indexOf(element.BlID()) >= 0) {
                this._talkData.Clist[key].push(element);
            }
        }
        return this._talkData.Clist[key];
    }

    getStoryBlIds (b: any, l: any, s: any) {
        let baseId = b + '_' + l;
        let ids: any[] = [];
        let hasStage = s != null && s !== '';
        if (hasStage) {
            let stage: any = Number(s);
            if (isNaN(stage)) stage = s;
            ids.push(baseId + '_' + stage);
            if (stage === 0) ids.push(baseId);
        } else {
            ids.push(baseId);
            ids.push(baseId + '_0');
        }
        return ids;
    }

    private isLocalPortal (portal: string) {
        return portal.indexOf('//10.0.') >= 0 ||
            portal.indexOf('//192.168.') >= 0 ||
            portal.indexOf('127.0.0.1') >= 0 ||
            portal.indexOf('//localhost') >= 0;
    }
}
