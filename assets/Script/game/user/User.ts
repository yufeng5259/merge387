import '../../LegacyGlobals';
//用户�?
const i18n = typeof GameKit !== 'undefined' && GameKit.i18n ? GameKit.i18n : { t: (key: string) => key }
export class User {
    public static Genders = {
        Unknown: "0",
        Male: "1",
        Female: "2",
    };
    data: any
    rid: number
    logining: boolean
    login: boolean
    logined: boolean
    friendsInfo: any
    isfirst: boolean
    thirdUserInfo: any
    thirdNoThisTime: any
    superTimeShieldLeft: number

    [key: string]: any

    constructor () {
        this.data = {
            userId: 0,
            //account
            accountId:"0",
            uuid: "",
            source: "",
            firstLogin: 0,
            lastLogin: 0,
            conLoginDays: 1,
            allLoginDays: 1,
            isfirst: false,

            channelId:{},

            //user_info
            name: i18n.t("PlayerDefaultName"),  //名字
            avatar: "",                     //头像
            country: "",                    //国家
            friends: [],                    //好友id列表
            deleteFriends:[],               //被删除好友id列表
            friendsList: {},                //好友列表{id:User}
            candidateFriends:[],            //待添加id好友数组
            CfriendsList:{},                //待添加id好友{id:user}
            fullName: "",

            legionId:0,                     //军团ID

            //user_data
            ap: 0,                          //体力
            apRecover: 0,                   //体力恢复已经走过的时�?
            apRecoverLast: 0,               //上一次计算体力恢复的时间

            coin: 0,                        //金币
            cash: 0,                        //现金
            //cashTask: [],                   //现金获取

            shield: 0,                      //护盾
            adshield: 0,                    //护盾
            timeShield: 0,                  //时间护盾
            timeShieldLast: 0,              //时间护盾 上一次计算时�?
            superTimeShield: 0,             //超级时间护盾
            superTimeShieldLast: 0,         //超级时间护盾 上一次计算时�?
            star: 0,                        //星级
            isCanDi:false,                  //是否待确定好�?
            flytoskyActivityId:0,//当前活动的id

            // invitationCode:"",//用户邀请码
            // invitationNum:0,//用户已经成功邀请的用户数量
            // beInvited:0,//是否已经领过被邀请奖�?0：否 1：是
            exp:0,
            level:1,
        }
        //request id
        this.rid = 0,
        this.logining = false       //正在登陆
        this.login = false          //登陆状�?
        this.logined = false        //曾经登陆�?

        this.friendsInfo = {}       //好友信息
        
        
    }

    //更新数据
    updateData(msg) {
        if (msg == null) return
        let data = msg
        for (let key in data) {
            this.data[key] = data[key]
        }
        if (this.data.isfirst) this.isfirst = true
        if (this.data.backReward) {
            let rewards = []
            this.data.backReward.forEach(x=>{rewards.push(Game.Content.FromContent(x))})
            this.data.backReward = rewards
        }

        if(this.IsSelf()){
            if(Game.SUserMerge){
                Game.SUserMerge.UpDatePlayerLevel(this.Level())
            }
        }

        return this
    }

    //获得数据
    getData() {
        let da = {}
        for (let key in this.data) {
            da[key] = this.data[key]
        }
        return da
    }

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
        return this
    }

    //获得第三方数�?
    getThirdData() {
        let keys = ["name", "avatar", "country"]
        if (wxTools.usewx) {
            keys = ["name", "avatar", "country", "province", "city", "gender", "language"]
        } else if (fbInTools.usefbIn) {
        } else if (AppKit.SdkManager.IsNative() && this.thirdUserInfo) {
            keys = ["name", "avatar", "fullName", "country"]
        } else {
            keys = ["country"]
        }
        if (this.thirdNoThisTime) {
            keys = []
        }
        let da = {}
        keys.forEach(function (key) {
            da[key] = this.data[key]
        }.bind(this))
        return da
    }

    //获得数据
    getUserAccount() {
        let da = {}
        let keys = ["accountId", "uuid", "source", "firstLogin", "lastLogin", "conLoginDays", "allLoginDays"]
        keys.forEach(function (key) {
            da[key] = this.data[key]
        }.bind(this))
        return da
    }

    //获得数据
    getUserInfo() {
        let da = {}
        let keys = ["name", "avatar", "country", "province", "city", "gender", "language", "signName", "isVip"]
        keys.forEach(function (key) {
            da[key] = this.data[key]
        }.bind(this))
        return da
    }

    //获得数据
    getUserData() {
        let da = {}
        let keys = ["ap", "apRecover", "apRecoverLast"]
        keys.forEach(function (key) {
            da[key] = this.data[key]
        }.bind(this))
        return da
    }
    //返回删除后的好友
    getFriends(x){
        let xx = x||false;
        let newInfo = {};
        let newList = [];
        let newIDlist = [];
        let fListInfo = this.data.friendsList;
        let canInfo = this.data.CfriendsList;
        
        for (const key in canInfo) {
            if (Object.prototype.hasOwnProperty.call(canInfo, key)) {
                const element = canInfo[key];
                element.data.isCanDi = true;
                newInfo[key] = element;
                newList.push(element)
                newIDlist.push(key)
            }
        }
        for (const key in fListInfo) {
            if (Object.prototype.hasOwnProperty.call(fListInfo, key)) {
                const element = fListInfo[key];
                newInfo[key] = element;
                if(newIDlist.indexOf(key) != -1)continue
                newList.push(element)
            }
        }
       


        // let dList = this.data.deleteFriends||[];
        // let fList = this.data.friends;
        // let fIndex = -1;
        // for (let index = 0; index < dList.length; index++) {
        //     const Uid = dList[index];
        //     fIndex = fList.indexOf(Uid)
        //     if(fIndex!=-1){
        //         delete fListInfo[Uid];
        //     }
        // }

        if(xx==true){
            return newList;
        }else{
            return newInfo;
        }
    }
    //待添加好友数�?
    getCandidateFriends(){
        return this.data.candidateFriends;
    }
    setDelFriend(uid){
        let fIndex = -1
        let fList = this.data.friends;
        this.data.deleteFriends=this.data.deleteFriends||[]
        if(this.data.deleteFriends.indexOf(uid)==-1){
            this.data.deleteFriends.push(uid);
        }
        fIndex = fList.indexOf(uid)
        if(fIndex!=-1){
            // delete this.data.friendsList[uid];
            delete this.data.friendsList[uid];
        }
        
    }
    //获得渠道
    GetChannelId(key){
        return this.data.channelId[key]||null
    }
    //用户id
    Id() {
        return this.data.userId
    }
    UserId() {
        return this.data.userId
    }
    //军团ID
    GuildId(){
        return this.data.legionId==null?0:this.data.legionId;
    }
    HasGuild(){
        return this.GuildId()>0;
    }
    AccountId() {
        return this.data.accountId
    }
    ThirdId() {
        return this.AccountId().replace("fb_", "").replace("wx_", "").replace("as_", "")
    }

    Source() {
        return this.data.source
    }
    IsFacebook() {
        return this.data.source.indexOf("fb") !== -1
    }
    IsWeixin() {
        return this.data.source.indexOf("wx") !== -1
    }
    IsAppStore() {
        return this.data.source.indexOf("as") !== -1
    }
    IsGuest() {
        return this.data.source.indexOf("guest") !== -1
    }

    //用户登陆识别码（当前消息发送的uuid与最后一次登陆记录的uuid不同时，判断被其他地方登陆下线）
    Uuid() {
        return this.data.uuid
    }

    //网络请求id
    GetRequestId() {
        this.rid ++
        return this.rid
    }

    //名字
    Name() {
        return this.data.name
    }

    //头像
    Avatar() {
        return this.data.avatar
    }

    //地区
    Country() {
        return this.data.country
    }

    //好友列表
    FriendsList() {
        return this.data.friendsList
    }

    //体力
    Ap() {
        return this.data.ap
    }
    AP() {
        return this.Ap()
    }

    //体力恢复时间
    ApRecover() {
        return this.data.apRecover
    }

    //体力上次计算时间
    ApRecoverLast() {
        return this.data.apRecoverLast
    }

    GetApRuntimeConfig() {
        let apMax = G.GameConstance.apMax
        let apRecoverSpins = G.GameConstance.apRecoverSpins
        if (Game.SUserStatus.IsVip()) {
            apMax = G.GameConstance.vipApMax
            apRecoverSpins = G.GameConstance.vipApRecoverSpins
        }
        let HugeSpinsMeta = Game.ActivityManager.GetActiveOtherActivityByType(Meta.ActivityMeta.SubTypes.HugeSpins)
        if (HugeSpinsMeta) {
            apMax += HugeSpinsMeta.Param().spinMaxAdd
        }
        return {
            apMax: apMax,
            apRecoverSpins: apRecoverSpins
        }
    }

    GetValidNumber(value, defaultValue) {
        let num = Number(value)
        return isFinite(num) ? num : defaultValue
    }

    //更新AP状�?
    UpdateApTime() {
        let apRuntime = this.GetApRuntimeConfig()
        let apMax = this.GetValidNumber(apRuntime.apMax, null)
        let apRecoverSpins = this.GetValidNumber(apRuntime.apRecoverSpins, null)
        let apRecoverTime = this.GetValidNumber(G.GameConstance.apRecover, null)
        if (apMax == null || apMax <= 0 || apRecoverSpins == null || apRecoverSpins <= 0 || apRecoverTime == null || apRecoverTime <= 0) {
            return false
        }

        let now = this.GetValidNumber(GameKit.TimeUtil.getCurrentTime(), Math.floor(Date.now() / 1000)) - 1
        let n = this.GetValidNumber(this.Ap(), 0)
        this.data.apRecover = this.GetValidNumber(this.data.apRecover, 0)
        this.data.apRecoverLast = this.GetValidNumber(this.data.apRecoverLast, now)
        if (n >= apMax) {
            this.data.apRecover = 0
            this.data.apRecoverLast = now
            this.data.ap = n
            return true
        }

        this.data.apRecover += now - this.data.apRecoverLast
        let recPoint = Math.max(0, Math.floor(this.data.apRecover / apRecoverTime))
        this.data.apRecover -= recPoint * apRecoverTime
        n += recPoint * apRecoverSpins
        if (n >= apMax) {
            n = apMax
            this.data.apRecover = 0
        } 
        this.data.apRecoverLast = now

        this.data.ap = n
        return true
    }

    GetFullApTime() {
        let apRuntime = this.GetApRuntimeConfig()
        let apMax = this.GetValidNumber(apRuntime.apMax, null)
        let apRecoverSpins = this.GetValidNumber(apRuntime.apRecoverSpins, null)
        let apRecoverTime = this.GetValidNumber(G.GameConstance.apRecover, null)
        if (apMax == null || apMax <= 0 || apRecoverSpins == null || apRecoverSpins <= 0 || apRecoverTime == null || apRecoverTime <= 0) {
            return 0
        }

        this.UpdateApTime()
        
        let n = this.GetValidNumber(this.Ap(), 0)
        if (n >= apMax) return 0

        let apRecover = this.GetValidNumber(this.ApRecover(), 0)
        return Math.max(0, Math.ceil((apMax - n) / apRecoverSpins) * apRecoverTime - apRecover)
    }

    //金币
    Coin() {
        return this.data.coin
    }

    Cash() {
        return this.data.cash
    }

    //护盾
    Shield() {
        return this.RawShield() + this.ADShield()
    }
    RawShield() {
        return this.data.shield
    }
    ADShield() {
        return this.data.adshield
    }
    
    TimeShield() {
        return this.data.timeShield
    }
    UpdateTimeShield() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()

        if (this.SuperTimeShield() <= 0) {
            this.data.timeShieldLast += (this.superTimeShieldLeft || 0)
            this.data.timeShield -= currentTime - this.data.timeShieldLast
            this.data.timeShield = Math.max(0, this.data.timeShield)
        }

        this.data.timeShieldLast = currentTime
    }
    
    SuperTimeShield() {
        return this.data.superTimeShield
    }
    UpdateSuperTimeShield() {
        let currentTime = GameKit.TimeUtil.getCurrentTime()

        this.data.superTimeShield -= currentTime - this.data.superTimeShieldLast
        this.data.superTimeShield = Math.max(0, this.data.superTimeShield)

        this.data.superTimeShieldLast = currentTime
    }

    GetShieldMax() {
        let mapId = Game.SUserVillage.MapId()
        let m = 0
        for (let id in G.GameConstance.shieldMax) {
            let s = G.GameConstance.shieldMax[id]
            if (mapId >= id && s > m) m = s
        }
        return m
    }

    //星级
    Star() {
        if (this.Id() !== Game.SUser.Id()) return this.data.star || 0
        
        return Game.SUserCard.Star()
    }

    //星级
    IsVip() {
        if (G.GameConfig.closeVIP) return false
        if (!G.GameConfig.GAME_TEST && !AppKit.SdkManager.IsNative()) return false

        if (this !== Game.SUser) return this.data.isVip
        
        return Game.SUserStatus.IsVip()
    }
    //增加EXP
    Exp(){
        return this.data.exp||0;
    }
    //最大经�?
    MaxExp(){
        return this.data.maxExp||1;
    }
    GetLevelTotalExp(level) {
        level = Math.floor(this.GetValidNumber(level, 0))
        if (level <= 0) return 0
        if (typeof Meta === "undefined" || !Meta.MetaManager || !Meta.MetaType) return 0
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Level, level)
        if (!meta || !meta.Exp) return 0
        return Math.max(0, this.GetValidNumber(meta.Exp(), 0))
    }
    GetLevelExpInfo() {
        let level = Math.max(1, Math.floor(this.GetValidNumber(this.Level(), 1)))
        let totalExp = Math.max(0, this.GetValidNumber(this.Exp(), 0))
        let levelStartExp = this.GetLevelTotalExp(level - 1)
        let nextLevelExp = this.GetLevelTotalExp(level)
        if (nextLevelExp <= levelStartExp) {
            nextLevelExp = levelStartExp + Math.max(1, this.GetValidNumber(this.MaxExp(), 1))
        }
        let need = Math.max(1, nextLevelExp - levelStartExp)
        let current = Math.max(0, Math.min(need, totalExp - levelStartExp))
        return {
            current: current,
            need: need,
            progress: Math.clamp(current / need, 0, 1),
            totalExp: totalExp,
            levelStartExp: levelStartExp,
            nextLevelExp: nextLevelExp
        }
    }
    //增加等级用戶
    Level(){
        return this.data.level;
    }

    //是否是自�?
    IsSelf(){
        return this.Id() === Game.SUser.Id()
    }
    


}


export default User
