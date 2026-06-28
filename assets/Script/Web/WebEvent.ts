//网络事件类
//在需要获取网络消息的地方 RegisterEvent， 服务器收到消息后调用DispatcherEvent

type WebEventCallback = (msg?: any) => void;
type WebEventRecord = {
    callback?: WebEventCallback;
    once?: boolean;
};
type WebEventData = Record<string, Record<string, WebEventRecord>>;
type WebEventApi = Record<string, any> & {
    EventName: Record<string, string>;
    _data: WebEventData;
};

let WebEvent: WebEventApi = {
    EventName: {},
    _data: {},
}

WebEvent.EventName = {
    UnlockBuildingsEvent:"unlockBuildingsEvent",
    LevelUpEvent: "levelUpEvent",
    ExpEvent: "expEvent",
    ApEvent: "apEvent",
    CoinEvent: "coinEvent",
    CashEvent: "cashEvent",
    ShieldEvent: "shieldEvent",
    TimeShieldEvent: "timeShieldEvent",
    StarEvent: "starEvent",
    ToraidEvent: "toraidEvent",
    VillageEvent: "villageEvent",
    MessageEvent: "messageEvent",
    MessageEventInvitedUnlock: "messageEventInvitedUnlock",
    GiftEvent: "giftEvent",
    ActivityEvent: "activityEvent",
    ActivityItem: "activityItem",
    TaskCompleteCount: "taskCompleteCount",
    GetReward: "getReward",
    StatusEvent: "statusEvent",
    ItemsEvent: "itemsEvent",
    CardEvent: "cardEvent",
    CardChest: "cardChest",
    RandomPack: "randomPack",
    PresentEvent: "presentEvent",
    RecordEvent: "recordEvent",
    SlotCollectRankEvent: "slotCollectRankEvent",
    FlytoskyTool:"flytoskyTool",//获取道具的接口事件  contentId是道具类型id，endtime：是道具有效期 -1为道具结束了.
    PendingRewardsUpdated: "pendingRewardsUpdated",//奖励临时数据更新时执行
    GetNewReward:"getNewReward",//新的领取奖励事件
}

WebEvent._data = {}

WebEvent.RegisterEvent = function(type, key, callback, once) {
    if (type == null || key == null || callback == null) return
    
    if (!WebEvent._data.hasOwnProperty(type)) WebEvent._data[type] = {}

    WebEvent._data[type][key] = {callback: callback, once: once}
}

WebEvent.UnRegisterEvent = function(type, key) {
    if (type == null || key == null) return
    
    if (!WebEvent._data.hasOwnProperty(type)) WebEvent._data[type] = {}
   
    if (WebEvent._data[type].hasOwnProperty(key)) {
        delete WebEvent._data[type][key]
    }
}

WebEvent.DispatcherEvent = function(type, msg) {
    if (type == null) return
    
    if (!WebEvent._data.hasOwnProperty(type)) WebEvent._data[type] = {}

    for (let key in WebEvent._data[type]) {
        let mess = WebEvent._data[type][key]
        if (mess != null) {
            //AppMain.instance.scheduleOnce(function() {
                if (mess.callback) mess.callback(msg)
                if (mess.once) {
                    WebEvent.UnRegisterEvent(type, key)
                }
            //}, 0)
        }
    }
}

WebEvent.DispatcherEventKey = function(type, key, msg) {
    if (type == null || key == null) return
    
    if (!WebEvent._data.hasOwnProperty(type)) WebEvent._data[type] = {}

    if (WebEvent._data[type].hasOwnProperty(key)) {
        let mess = WebEvent._data[type][key]
        if (mess != null) {
            //AppMain.instance.scheduleOnce(function() {
                if (mess.callback) mess.callback(msg)
                if (mess.once) {
                    WebEvent.UnRegisterEvent(type, key)
                }
            //}, 0)
        }
    }
}

WebEvent.Clear = function() {
    WebEvent._data = {}
}

export default WebEvent
