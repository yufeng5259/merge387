import { _decorator, Component } from 'cc';
import { ContentModel } from '../../items/ContentModel';
const { ccclass, property } = _decorator;

@ccclass('BuildKingExtra')
export class BuildKingExtra extends Component {
    @property(ContentModel)
    public content1: ContentModel | null = null;
    @property(ContentModel)
    public content2: ContentModel | null = null;

    Show (centerWindow: any, activityMeta: any) {
        const restr = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.BuildMaster, Game.SUserVillage.MapId() + 1);
        const rewards = Game.Content.FromStrings(restr);
        if (this.content1) this.content1.show(rewards[0], null);
        if (this.content2) this.content2.show(rewards[1], null);
    }

}
