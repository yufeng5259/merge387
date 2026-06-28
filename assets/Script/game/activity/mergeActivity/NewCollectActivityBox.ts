import { _decorator, Label, ProgressBar, Sprite } from 'cc';
import { ActivityBadge } from '../ui/ActivityBadge';
import { ContentModel } from '../../items/ContentModel';
const { ccclass, property } = _decorator;

@ccclass('NewCollectActivityBox')
export class NewCollectActivityBox extends ActivityBadge {
    @property(ProgressBar)
    public progress: ProgressBar | null = null;
    @property(Label)
    public progress_label: Label | null = null;
    @property(Sprite)
    public miniIcon: Sprite | null = null;
    @property(ContentModel)
    public rewardItem: ContentModel | null = null;

    public meta: any = null;
    public userdata: any = null;
    public oldCurrentId: number | null = null;
    public oldCurrentCount: number | null = null;

    setMeta(meta: any, cpcb?: any) {
        this.meta = meta;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id());

        if (this.btn) {
            this.btn.on("click", () => {
                if (GamePlay.instance.isBusy()) return;
                const icon_goto = this.meta.IconGoto();
                if (icon_goto == "panel") {
                    UIRoot.instance.openChildWindow(this.meta.Panel(), { meta: this.meta });
                } else if (icon_goto == "window") {
                    const panelClass = (globalThis as any)[this.meta.Panel()];
                    if (panelClass && panelClass.Show) panelClass.Show(this.meta);
                } else {
                    UIRoot.instance.openChildWindow(icon_goto, { meta: this.meta });
                }
            }, this);
        }

        if (this.labelCountDown) {
            (this as any).leftTime = 0;
            this.update(0);
        }

        const metaParam = this.meta.Param();
        const symbolId = metaParam.symbolId;
        if (this.icon) this.icon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString());
        if (this.miniIcon) this.miniIcon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString());

        let { currentId, currentCount } = this.userdata;
        currentId = currentId || 1;
        currentCount = currentCount || 0;
        const currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollect, currentId);
        if (currentNeed) {
            if (this.progress) this.progress.progress = currentCount / currentNeed;
            if (this.progress_label) this.progress_label.string = currentCount + " / " + currentNeed;
        }

        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectReward, currentId));
        if (currentGet && this.rewardItem) this.rewardItem.show(currentGet, null);

        this.oldCurrentId = currentId;
        this.oldCurrentCount = currentCount;
    }

    updateShow() {
        if (!this.meta) return;

        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id());
        const currentCount = this.userdata.currentCount || 0;
        const currentId = this.userdata.currentId || 1;
        const currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollect, currentId);

        if ((!this.oldCurrentId || this.oldCurrentId == currentId) &&
            currentId === Game.ActivityManager.Constance.slotCollectMaxId && currentCount === currentNeed) {
            return;
        }

        let oldCurrentId = this.oldCurrentId;
        let oldCurrentCount = this.oldCurrentCount;

        const playAnim = (animCount: number, fromCount: number, need: number) => {
            const animStep = Math.ceil(animCount / 20);
            const animTimes = Math.ceil(animCount / animStep);
            const animDelay = Math.max(0.1, 0.3 - Math.max(0, animCount - 5) * 0.03);
            for (let i = 0; i < animTimes; i++) {
                this.scheduleOnce(() => {
                    const cc1 = Math.min(fromCount + (i + 1) * animStep, need);
                    if (this.progress) this.progress.progress = cc1 / need;
                    if (this.progress_label) this.progress_label.string = cc1 + " / " + need;
                    GameKit.SoundManager.playSound("HammersThrow-01");
                }, (i + 1) * animDelay);
            }
            return animTimes * animDelay + 0.3;
        };

        const showFinal = () => {
            if (this.progress) this.progress.progress = currentCount / currentNeed;
            if (this.progress_label) this.progress_label.string = currentCount + " / " + currentNeed;
            const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectReward, currentId));
            if (currentGet && this.rewardItem) this.rewardItem.show(currentGet, null);
        };

        const showAdd = () => {
            if (oldCurrentId != null && oldCurrentCount != null && (oldCurrentId !== currentId || (oldCurrentId == currentId && currentCount == currentNeed))) {
                const lastNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollect, oldCurrentId);
                const animCount = lastNeed - oldCurrentCount;
                const animTime = playAnim(animCount, oldCurrentCount, lastNeed);
                this.scheduleOnce(() => {
                    if (oldCurrentId == null) return;
                    oldCurrentId++;
                    oldCurrentCount = 0;
                    if (oldCurrentId > Game.ActivityManager.Constance.slotCollectMaxId) {
                        oldCurrentId = null;
                        oldCurrentCount = null;
                        showFinal();
                        return;
                    }

                    const nextGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectReward, oldCurrentId));
                    if (nextGet && this.rewardItem) this.rewardItem.show(nextGet, null);
                    const nextNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollect, oldCurrentId);
                    if (this.progress) this.progress.progress = 0;
                    if (this.progress_label) this.progress_label.string = "0 / " + nextNeed;
                    showAdd();
                }, animTime);
            } else if (oldCurrentCount != null && oldCurrentCount !== currentCount) {
                const animCount = currentCount - oldCurrentCount;
                const animTime = playAnim(animCount, oldCurrentCount, currentNeed);
                this.scheduleOnce(() => {
                    showFinal();
                }, animTime);
            } else {
                showFinal();
            }
        };

        showAdd();
        this.oldCurrentCount = currentCount;
        this.oldCurrentId = currentId;
    }
}
