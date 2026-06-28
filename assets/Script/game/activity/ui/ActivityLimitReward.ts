import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActivityLimitReward')
export class ActivityLimitReward extends Component {
    @property(Label)
    public timeLbl: Label | null = null;

    public meta: any = null;
    public userdata: any = null;
    public currentLimtTime = 0;
    public leftTime: number | null = null;
    public ifUpdate = false;
    public cb: (() => void) | null = null;

    start() {
    }

    hideNode() {
        this.ifUpdate = false;
        this.node.active = false;
    }

    setIconContent(currentGet: any) {
        if (!this.meta) return;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};
        this.currentLimtTime = this.userdata.limitedTime || 0;

        if (currentGet && this.timeLbl && this.currentLimtTime > 0) {
            this.node.active = true;
            this.leftTime = 0;
            this.update(0);
        } else {
            this.closeWindow();
        }
    }

    setSlotCollectMeta(meta: any, id: any, cb: (() => void) | null = null) {
        this.meta = meta;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};
        const currentId = this.userdata.currentId || 1;
        this.ifUpdate = false;

        const limitTime = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectLimitedTime, id);
        if (id == currentId) {
            this.cb = cb;
            if (this.timeLbl) this.timeLbl.string = GameKit.TimeUtil.FormatRemainTimeSimple(limitTime, false);
            this.currentLimtTime = this.userdata.limitedTime || 0;
            const currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.currentLimtTime - currentTime;
            if (this.leftTime > 0) {
                if (this.timeLbl) this.timeLbl.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
                this.ifUpdate = true;
            } else {
                this.closeWindow();
            }
        } else if (this.timeLbl) {
            this.timeLbl.string = GameKit.TimeUtil.FormatRemainTimeSimple(limitTime, false);
        }
    }

    update(dt: any) {
        if (!this.ifUpdate) return;
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
        this.ifUpdate = false;
        if (this.timeLbl) this.timeLbl.string = GameKit.TimeUtil.FormatRemainTimeSimple(0, false);
        this.leftTime = null;
        this.currentLimtTime = 0;

        if (this.cb) {
            const enterCloseAnim = this.getComponent("EnterCloseAnim") as any;
            if (enterCloseAnim && enterCloseAnim.closeAnim) {
                enterCloseAnim.closeAnim(() => {
                    this.scheduleOnce(() => {
                        if (this.cb) this.cb();
                    }, 0.1);
                });
            } else {
                this.cb();
            }
        }
    }
}
