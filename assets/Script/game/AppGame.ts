import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('AppGame')
export class AppGame extends Component {

    public static instance: AppGame | null = null;
    public static inited = false;
    public logined = false;
    public prelogined = false;

    ctor () {
    }

    onLoad () {
        // Logs.Log("Launched AppGame") 
        AppGame.instance = this;
        global.AppGame = AppGame;
    }

    onDestroy () {
        if (AppGame.instance === this) {
            AppGame.instance = null;
        }
    }

    start () {
        // game hide handler was disabled during migration.
            // SR.SRMerge.AutoSendSaveMapLite() 
            // this.leaveTime = GameKit.TimeUtil.getCurrentTime() 
        // }, this) 
        // game show handler was disabled during migration.
            // setTimeout(() => { 
                // if (this.logined && Game.MergeTutorialManager.IsFinished()) { 
                    // if (GameKit.TimeUtil.getCurrentTime() - this.leaveTime < 120) { 
                        // SR.SRUserData.heartBeat().Send() 
                        // return 
                    // } 
                    // if (GameKit.TimeUtil.getCurrentTime() - this.leaveTime > GameKit.TimeUtil.HourInSecond * 1) { 
                        // this.logout() 
                        // return 
                    // } 
                    // this.reqUserData() 
                // } 
            // }, 100); 
        // }, this) 
    }

    logout () {
        this.logined = false;
        this.prelogined = false;
        // GamePlay.instance.node.active = true 
        // Game.SUser = new Game.User() 
        // Game.SUserItems = new Game.UserItems() 
        // Game.SUserVillage = new Game.UserVillage() 
        // Game.SUserSlot = new Game.UserSlot() 
        // Game.SUserMergeTutorial = new Game.UserMergeTutorial() 
        // Game.SUserActivity = new Game.UserActivity() 
        // Game.SUserCard = new Game.UserCard() 
        // Game.SUserStatus = new Game.UserStatus() 
        // Game.SUserRecord = new Game.UserRecord() 
        // Game.SGuild = new Game.Guild(); 
        // Game.SUserMerge = new Game.UserMerge() 
        // Game.SUserStory = new Game.UserStory(Game.SUser.UserId()); 
        // Game.SUserMap = new Game.UserMap(Game.SUser.UserId()) 
        // GamePlay.instance.Clear() 
        // GameKit.DataCache.Clear() 
        // GameKit.WebEvent.Clear() 
        // GameKit.GameEvent.Clear() 
        // Game.ChatMgr.Clear() 
        // if (Game.MergeTutorialManager && Game.MergeTutorialManager.Clear) Game.MergeTutorialManager.Clear() 
        // Game.ActivityManager.Clear() 
        // GameKit.ClockUtil.Clear() 
        // GameKit.BackKeyManager.Clear() 
        // AppKit.NativeWrap.init() 
        // if (this._hbid) { 
            // clearTimeout(this._hbid) 
            // this._hbid = null 
        // } 
        // this.activityItemCache = [] 
        // if (!!this.activityItemCacheTid) clearTimeout(this.activityItemCacheTid) 
        // this.activityItemCacheTid = null 
        // GameMainWindow.isFirstEnter = false 
        // UIRoot.instance.stopShowWindow = true 
        // AppMain.instance.HasError = false 
        // AppMain.instance.unschedule(AppKit.PaymentWrap.GetOnlineList) 
        // UIRoot.instance.openWindow("LoginWindow") 
    }

    prelogin () {
        if (this.prelogined) return;
        this.prelogined = true;
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.MessageEvent, "Game", function (data) { 
            // let NewMessageNum = GameKit.DataCache.GetData("NewMessageNum") 
            // if (NewMessageNum == null) NewMessageNum = 0 
            // NewMessageNum++ 
            // GameKit.DataCache.SetData("NewMessageNum", NewMessageNum) 
            // if (!this.logined) return 
            // if (data.isFriend && !data.user) { 
                // data.user = Game.SUser.FriendsList()[data.userId].getUserInfo() 
            // } 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MessageEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.GiftEvent, "Game", function (data) { 
            // let GiftsNum = GameKit.DataCache.GetData("GiftsNum") 
            // if (GiftsNum == null) GiftsNum = 0 
            // GiftsNum++ 
            // GameKit.DataCache.SetData("GiftsNum", GiftsNum) 
            // if (!this.logined) return 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.GiftEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CardChest, "Game", function (data) { 
            // let chestArr = GameKit.DataCache.GetData("UserCardChestArr") 
            // if (!chestArr) { 
                // chestArr = [] 
            // } 
            // chestArr = chestArr.concat(data) 
            // GameKit.DataCache.SetData("UserCardChestArr", chestArr) 
            // GameKit.DataCache.SetData("UserCardChest", data.chest) 
            // CardChestOpenWindow enqueueShow disabled during migration.
            // console.log("GameKit.WebEvent.EventName.CardChest", data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.RandomPack, "Game", function (data) { 
            // let randomPackArr = GameKit.DataCache.GetData("UserRandomPackArr") || [] 
            // randomPackArr = randomPackArr.concat(data) 
            // GameKit.DataCache.SetData("UserRandomPackArr", randomPackArr) 
            // CardChestOpenWindow enqueueShow disabled during migration.
            // console.log("GameKit.WebEvent.EventName.RandomPack", data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.SlotCollectRankEvent, "Game", function (data) { 
            // GameKit.DataCache.SetData("SlotCollectRankEnd", true) 
            // if (!this.logined) return 
            // UIRoot.instance.openChildWindow("ActivitySlotSymbolRankWindow", { 
                // showCallback: (wnd) => { 
                    // wnd.addOnCloseFunc(() => { 
                        // UIRoot.instance.openChildWindow("ActivitySlotSymbolRankRewardWindow") 
                    // }) 
                // } 
            // }) 
        // }.bind(this)) 
    }

    login () {
        this.logined = true;
        this.prelogined = false;
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ApEvent, "Game", function (data) { 
            // Game.SUser.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ApEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CoinEvent, "Game", function (data) { 
            // Game.SUser.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.CoinEvent, data) 
            // if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitTrigger) { 
                // Game.MergeTutorialManager.EmitTrigger('coin_reach', { coin: Game.SUser.Coin() }) 
            // } 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CashEvent, "Game", function (data) { 
            // Game.SUser.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.CashEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ShieldEvent, "Game", function (data) { 
            // Game.SUser.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ShieldEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.TimeShieldEvent, "Game", function (data) { 
            // Game.SUser.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.TimeShieldEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ToraidEvent, "Game", function (data) { 
            // Game.SUserSlot.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ToraidEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.VillageEvent, "Game", function (data) { 
            // Game.SUserVillage.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.VillageEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ActivityEvent, "Game", function (data) { 
            // Game.SUserActivity.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ActivityEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ActivityItem, "Game", function (data) { 
            // let contents = [] 
            // data.contents.forEach(x => { 
                // contents.push(Game.Content.FromContent(x)) 
                // this.activityItemCache.push(Game.Content.FromContent(x)) 
            // }) 
            // if (!!this.activityItemCacheTid) clearTimeout(this.activityItemCacheTid) 
            // this.activityItemCacheTid = setTimeout(() => { 
                // let conts = Game.Content.Merge(this.activityItemCache) 
                // GameKit.AutoWindowQueue.enqueue("SimpleRewardWindow", { contents: conts }, { stage: "runtime_reward", source: "activity_item" }) 
                // this.activityItemCacheTid = null 
                // this.activityItemCache = [] 
            // }, 1800); 
            // data.contents = contents 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ActivityItem, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.TaskCompleteCount, "Game", function (data) { 
            // GameKit.DataCache.SetData("UserTaskCompleteCount", data.count || 0) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.TaskCompleteCount, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.GetReward, "Game", function (data) { 
            // let rewards = [] 
            // data.rewards.forEach(x => { 
                // let c = Game.Content.FromContent(x) 
                // switch (c.Type()) { 
                    // case Game.Content.Types.Servant: 
                        // break; 
                    // case Game.Content.Types.Exp: 
                        // GameKit.DataCache.SetData("GET_EXP", c) 
                        // break; 
                    // default: 
                        // rewards.push(c) 
                        // break; 
                // } 
            // }) 
            // let hg = GameKit.DataCache.GetData("HijackGetReward") 
            // if (hg != null) { 
                // hg(rewards) 
                // GameKit.DataCache.RemoveData("HijackGetReward") 
                // return 
            // } 
            // if (rewards == null || rewards.length == 0) return; 
            // if (data.simple) GameKit.AutoWindowQueue.enqueue("SimpleRewardWindow", { contents: rewards }, { stage: "runtime_reward", source: "get_reward" }) 
            // else { 
                // GameKit.AutoWindowQueue.enqueue("GetRewardWindow", { 
                    // contents: rewards, showCallback: (wnd) => { 
                        // wnd.addOnCloseFunc(() => { 
                            // console.log("婵傛牕濮崇紒鎾存将,閺嶈宓侀柆鎾冲徔閺夈儲绨Ο鈥虫健鏉╂稖顢戦崥搴ｇ敾閹垮秳缍?) 
                        // }) 
                    // } 
                // }) 
            // } 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.StatusEvent, "Game", function (data) { 
            // Game.SUserStatus.updateData(data.userdata) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.StatusEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.RecordEvent, "Game", function (data) { 
            // Game.SUserRecord.updateData(data.userdata) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.RecordEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ItemsEvent, "Game", function (data) { 
            // Game.SUserItems.updateData(data) 
            // Game.ActivityManager.AddLocalDymicActiveToolList() 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.ItemsEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CardEvent, "Game", function (data) { 
            // Game.SUserCard.updateData(data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.CardEvent, data) 
        // }.bind(this)) 
        // GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.PresentEvent, "Game", function (data) { 
            // GameKit.DataCache.SetData("UserPresentList", data) 
            // GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.PresentEvent, data) 
        // }.bind(this)) 
}

}

