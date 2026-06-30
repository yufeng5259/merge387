type UserActivityData = {
    userId: any;
    activityData: Record<string, any>;
    symbolRankData: any;
    collectFlagData: any;
    passportCollectFlagData?: any;
    [key: string]: any;
};

export class UserActivity {
    public data: UserActivityData;

    constructor(userId?: any) {
        this.data = {
            userId,
            activityData: {},
            symbolRankData: {},
            collectFlagData: {},
        };
    }

    public updateData(data: Record<string, any>) {
        for (const key in data) {
            this.data[key] = data[key];
        }
        return this;
    }

    public getData() {
        const data: Record<string, any> = {};
        for (const key in this.data) {
            data[key] = this.data[key];
        }
        return data;
    }

    public setData(key: string, value: any) {
        this.data[key] = value;
    }

    public UserId() {
        return this.data.userId;
    }

    public GetActivityData(activityId: any) {
        return this.data.activityData[activityId] || {};
    }

    public GetSymbolRankData() {
        return this.data.symbolRankData || {};
    }

    public GetCollectFlagData() {
        return this.data.collectFlagData || {};
    }

    public GetPassportCollectFlagData() {
        return this.data.passportCollectFlagData || {};
    }

    public GetGameActivityBadgeState() {
        return false;
    }

    public GetGameActivityBadgeStateByType(type: any) {
        const activityMeta = Game.ActivityManager.GetActiveGameActivityByType(type);
        if (!activityMeta) return false;
        return false;
    }
}
