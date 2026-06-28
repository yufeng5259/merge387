import '../../LegacyGlobals';
class Guild {
    public static TEAMTYPE = {
        OPEN: 0,
        CLOSED: 1,
    };
    public static CREATETYPE = {
        CREATE: 0,
        EDITOR: 1,
    };
    public static CREATE_Money = 50000000;
    public static MembersCount = {
        Lv1: 30,
        Lv2: 50,
    };
    public static APMax = {
        Lv1: 10,
        Lv2: 15,
    };
    public static Badge: any[] = [];
    public static msgList: any = {};
    public static askList: any = {};
    public static ApLimtTime = 12 * 60 * 60;
    public static CarLimtTime = 12 * 60 * 60;

    public data: any;
    public guildInfo: any;

    constructor() {
        this.data = {
            legionId: 0,
            legionName: '',
            legionBadge: '',
            legionExplain: '',
            legionType: 0,
            legionDemand: 0,
            legionStarsNumber: 0,
            legionLevel: 1,
            legionNumber: [],
            establishEstablish: 0,
            legionSearchBadge: '',
        };
        this.guildInfo = {};
    }

    updateData(msg: any) {
        if (msg == null) return;
        const data = msg;
        for (const key in data) {
            this.data[key] = data[key];
        }
        return this;
    }

    getData() {
        const da: any = {};
        for (const key in this.data) {
            da[key] = this.data[key];
        }
        return da;
    }

    setData(key: any, value: any) {
        this.data[key] = value;
        return this;
    }

    isGuildMaster() {
        return this.data.legionNumber.length > 0 && Game.SUser.UserId() == this.data.legionNumber[0];
    }

    GuildId() {
        return this.data.legionId;
    }

    GuildName() {
        return this.data.legionName;
    }

    GuildlegionSearchBadge() {
        return this.data.legionSearchBadge;
    }

    GuildBadge() {
        return this.data.legionBadge;
    }

    GuildNeedStars() {
        return this.data.legionDemand;
    }

    GuildLegionType() {
        return this.data.legionType;
    }

    GuildlegionExplain() {
        return this.data.legionExplain;
    }

    CheckStr(str: any) {
        return RegExp(/^([A-Z]|[a-z]|[\d]|[\s*]|[-,.?:;'"!`])*$/).test(str);
    }

    getCurBossHp() {
        return this.data.legionBoss ? this.data.legionBoss.bossHp : 0;
    }

    getActivityActive() {
        return this.data.legionBoss;
    }

    getBossRankData() {
        return this.data.legionBoss ? this.data.legionBoss.bossRank : [];
    }
}

global.Game.Guild = Guild;

export default Guild;
