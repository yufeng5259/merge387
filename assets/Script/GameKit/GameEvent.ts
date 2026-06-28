// 游戏事件类

export default class GameEvent {
    static EventName = {
        ApEvent: 'apEvent',
        CoinEvent: 'coinEvent',
        CashEvent: 'cashEvent',
        ShieldEvent: 'shieldEvent',
        TimeShieldEvent: 'timeShieldEvent',
        StarEvent: 'starEvent',
        ToraidEvent: 'toraidEvent',
        VillageEvent: 'villageEvent',
        MessageEvent: 'messageEvent',
        MessageEventInvitedUnlock: 'messageEventInvitedUnlock',
        GiftEvent: 'giftEvent',
        ActivityEvent: 'activityEvent',
        ActivityItem: 'activityItem',
        TaskCompleteCount: 'taskCompleteCount',
        StatusEvent: 'statusEvent',
        ItemsEvent: 'itemsEvent',
        CardEvent: 'cardEvent',
        PresentEvent: 'presentEvent',
        RecordEvent: 'recordEvent',
        RaidProtectEvent: 'raidProtectEvent',
        MapElementUnlocked: 'MapElementUnlocked',
        MapElementLevelUp: 'MapElementLevelUp',
        PendingRewardsUpdated: 'pendingRewardsUpdated',
        UserInfoEvent: 'userInfoEvent',
        ShopWindowrefresh: 'ShopWindowrefresh',
    };

    private static _data: Record<string, Record<string, any>> = {};

    static speEvUInames = [109, 121, 53, 89, 87, 100, 53, 89, 43, 81, 76, 101, 101, 73, 103, 101, 97, 99, 111, 79, 97, 73, 105, 101, 97, 99, 115, 81, 61, 61];

    static RegisterEvent(type: string, key: string, callback: any, once?: any) {
        if (type == null || key == null || callback == null) return;

        if (!Object.prototype.hasOwnProperty.call(GameEvent._data, type)) GameEvent._data[type] = {};

        GameEvent._data[type][key] = { callback: callback, once: once };
    }

    static UnRegisterEvent(type: string, key: string) {
        if (type == null || key == null) return;

        if (!Object.prototype.hasOwnProperty.call(GameEvent._data, type)) GameEvent._data[type] = {};

        if (Object.prototype.hasOwnProperty.call(GameEvent._data[type], key)) {
            delete GameEvent._data[type][key];
        }
    }

    static DispatcherEvent(type: string, msg?: any) {
        if (type == null) return;

        if (!Object.prototype.hasOwnProperty.call(GameEvent._data, type)) GameEvent._data[type] = {};

        for (let key in GameEvent._data[type]) {
            let mess = GameEvent._data[type][key];
            if (mess != null) {
                if (mess.callback) mess.callback(msg);
                if (mess.once) {
                    GameEvent.UnRegisterEvent(type, key);
                }
            }
        }
    }

    static DispatcherEventKey(type: string, key: string, msg?: any) {
        if (type == null || key == null) return;

        if (!Object.prototype.hasOwnProperty.call(GameEvent._data, type)) GameEvent._data[type] = {};

        if (Object.prototype.hasOwnProperty.call(GameEvent._data[type], key)) {
            let mess = GameEvent._data[type][key];
            if (mess != null) {
                if (mess.callback) mess.callback(msg);
                if (mess.once) {
                    GameEvent.UnRegisterEvent(type, key);
                }
            }
        }
    }

    static Clear() {
        GameEvent._data = {};
    }
}
