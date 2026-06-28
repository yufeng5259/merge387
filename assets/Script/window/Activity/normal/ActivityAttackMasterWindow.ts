import { _decorator, Label, Node, ProgressBar, RichText, Vec3 } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';
import { ContentModel } from '../../../game/items/ContentModel';
import { ActivityAttackMasterAdd } from '../../../game/activity/ui/ActivityAttackMasterAdd';

const { ccclass, property } = _decorator;

@ccclass('ActivityAttackMasterWindow')
export default class ActivityAttackMasterWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivityAttackMasterWindow';

    @property(RichText)
    labelDes: RichText | null = null;

    @property(Label)
    labelProgress: Label | null = null;

    @property(ProgressBar)
    spProgress: ProgressBar | null = null;

    @property(Label)
    labelReward: Label | null = null;

    @property(Label)
    labelFinalReward: Label | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(ContentModel)
    reward: ContentModel | null = null;

    @property(ActivityAttackMasterAdd)
    addItem: ActivityAttackMasterAdd | null = null;

    @property(Node)
    barNode: Node | null = null;

    @property(Node)
    barTiaoNode: Node | null = null;

    meta: any = null;
    userdata: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id()) || {};

        let currentCount = this.userdata.currentCount || 0;
        let currentId = this.userdata.currentId || 1;
        let currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMaster, currentId);
        let currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMasterReward, currentId));
        let currentGetLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMasterLimitedReward, currentId));
        let currentLimtTime = this.userdata.limitedTime || 0;
        let limtTime = currentLimtTime - GameKit.TimeUtil.getCurrentTime();

        if (this.labelDes) {
            this.labelDes.string = (String as any).format(GameKit.i18n.t('ActivityAttackMasterDes'), currentNeed, currentGet.ColorCode() + BigNumber.format(currentGet.Contents()[0].Count()), currentGet.Name());
        }
        if (this.labelProgress) this.labelProgress.string = currentCount.toString() + '/' + currentNeed;
        if (this.spProgress) this.spProgress.progress = currentCount / currentNeed;
        if (this.reward) this.reward.show(currentGet, null);
        if (currentGetLimt && limtTime > 0) {
            if (this.barNode) this.barNode.setPosition(new Vec3(0, this.barNode.position.y, this.barNode.position.z));
            if (this.addItem) this.addItem.setAttackMeta(this.meta);
        } else {
            if (this.barNode) this.barNode.setPosition(new Vec3(45, this.barNode.position.y, this.barNode.position.z));
            if (this.addItem) this.addItem.setAttackMeta(this.meta);
        }

        this.leftTime = 0;
        this.update(0);
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            this.leftTime = 1;

            if (this.labelTimer) {
                this.labelTimer.string = (String as any).format(GameKit.i18n.t('ActivityAttackMasterTimeleft'), GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false));
            }

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    close_window() {
        this.closeAnim();
    }

    callGo() {
        this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Slot); });
    }
}
