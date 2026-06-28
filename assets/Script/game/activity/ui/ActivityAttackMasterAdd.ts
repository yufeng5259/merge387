import { _decorator, Component, Label } from 'cc';
import { ContentModel } from '../../items/ContentModel';
const { ccclass, property } = _decorator;

@ccclass('ActivityAttackMasterAdd')
export class ActivityAttackMasterAdd extends Component {
    @property(ContentModel)
    public iconContent: ContentModel | null = null;
    @property(Label)
    public timeLbl: Label | null = null;

    public meta: any = null;
    public userdata: any = null;
    public currentLimtTime = 0;
    public leftTime: number | null = null;

    start() {
    }

    hideNode() {
        this.node.active = false;
    }

    setAttackMeta(meta: any) {
        this.meta = meta;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};
        const currentId = this.userdata.currentId || 1;
        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMasterLimitedReward, currentId));
        this.showLimitedReward(currentGet);
    }

    setIconContent(currentGet: any) {
        if (!this.meta) return;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};
        this.showLimitedReward(currentGet);
    }

    setRaidMeta(meta: any) {
        this.meta = meta;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};
        const currentId = this.userdata.currentId || 1;
        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.RaidMasterLimitedReward, currentId));
        this.showLimitedReward(currentGet);
    }

    setSlotCollectMeta(meta: any) {
        this.meta = meta;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};
        const currentId = this.userdata.currentId || 1;
        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectLimitedReward, currentId));
        this.showLimitedReward(currentGet);
    }

    update(dt: any) {
        if (this.leftTime != null) {
            const currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.currentLimtTime - currentTime;
            if (this.timeLbl) this.timeLbl.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
            if (this.leftTime <= 0) {
                this.closeWindow();
            }
        }
    }

    closeWindow() {
        this.hideNode();
        this.leftTime = null;
        this.currentLimtTime = 0;
    }

    private showLimitedReward(currentGet: any) {
        this.currentLimtTime = this.userdata?.limitedTime || 0;
        if (currentGet && this.iconContent && this.timeLbl && this.currentLimtTime > 0) {
            this.iconContent.show(currentGet, null);
            this.node.active = true;
            this.leftTime = 0;
            this.update(0);
        } else {
            this.closeWindow();
        }
    }
}
