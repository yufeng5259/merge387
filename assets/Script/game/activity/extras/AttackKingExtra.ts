import { _decorator, Component, Label, ProgressBar } from 'cc';
import { ContentModel } from '../../items/ContentModel';
const { ccclass, property } = _decorator;

@ccclass('AttackKingExtra')
export class AttackKingExtra extends Component {
    @property(Label)
    public labelProgress: Label | null = null;
    @property(ProgressBar)
    public spProgress: ProgressBar | null = null;
    @property(ContentModel)
    public reward: ContentModel | null = null;

    Show (centerWindow: any, activityMeta: any) {
        const activityId = activityMeta.Id();
        const userdata = Game.SUserActivity.GetActivityData(activityId);
        const currentCount = userdata.currentCount || 0;
        const currentId = userdata.currentId || 1;
        const currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMaster, currentId);
        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMasterReward, currentId));

        if (this.labelProgress) this.labelProgress.string = currentCount.toString() + " / " + currentNeed;
        if (this.spProgress) this.spProgress.progress = currentCount / currentNeed;
        if (this.reward) this.reward.show(currentGet, null);
    }

}
