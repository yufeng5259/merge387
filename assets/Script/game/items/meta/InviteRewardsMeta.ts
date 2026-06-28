import '../../../LegacyGlobals';
class InviteRewardsMeta {
    constructor() {}

    static MakeEntity(data) {
        let meta = new InviteRewardsMeta()
        meta.UpdateData(data)
        // console.log('==========InviteRewardsMeta',meta.Id(),meta.InviteCount(),meta.Items());
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

    InviteCount() {
        return this._data.invite
    }

    Items() {
        let is = this._data.reward
        let iss = is.split(';')
        return iss
    }

    Contents() {
        if (!this.contents) {
            let iss = this.Items()
            this.contents = []
            iss.forEach(x => {
                this.contents.push(Game.Content.FromString(x))
            });
        }
        return this.contents
    }
}
InviteRewardsMeta.GetContentByInviteCount=function(count){
    let metasObj = Meta.MetaManager.GetMetas(Meta.MetaType.InviteRewards)
    let meta=null;
    for (const key in metasObj) {
        if (Object.hasOwnProperty.call(metasObj, key)) {
            const met = metasObj[key];
            if(met.InviteCount()==count){
                meta=met;
                break;
            }
        }
    }
    
    return meta;
}

global.Meta.InviteRewardsMeta = InviteRewardsMeta