import { _decorator, Component, Label, Sprite } from 'cc';
import ContentModel from '../items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('MergeTempLibary')
export class MergeTempLibary extends Component {
    @property(Sprite)
    public icon: Sprite | null = null;

    @property(ContentModel)
    public reward_item: ContentModel | null = null;

    @property(Label)
    public dotLabel: Label | null = null;

    public mergeId = -1;
    public envStatus = -1;
    public addtionId = -1;
    public mergeDataStr: any = null;

    onLoad () {
        this.mergeId = -1;
        this.envStatus = -1;
        this.addtionId = -1;
        this.mergeDataStr = null;
    }

    ShowIcon (mergeDataStr: any) {
        if (mergeDataStr == null) {
            this.node.active = false;
            return;
        }

        this.node.active = true;
        if (this.dotLabel) {
            this.dotLabel.string = String(Game.SUserMerge.GetPendingRewardsCount());
        }

        const d = mergeDataStr.d;
        const t = mergeDataStr.t;

        this.mergeDataStr = mergeDataStr;
        console.log(mergeDataStr, '鏁版嵁', d);

        if (t == 'piece') {
            const arr = String(d).split('_');
            this.mergeId = parseInt(arr[0], 10);
            this.envStatus = parseInt(arr[1], 10);
            this.addtionId = parseInt(arr[2], 10);
            const meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.mergeId);
            if (this.icon) {
                this.icon.spriteFrame = GamePlay.instance.mergeRoot.mergeLevelNode.iconAtlas.getSpriteFrame(meta.Icon());
            }
        } else if (t == 'content' || t == 'pack' || t == 'cardChest') {
            const rewards = Game.Content.FromString(d);
            this.reward_item?.show(rewards);
        }
    }

    GetMergeType () {
        return this.mergeDataStr.t;
    }

    GetMergeDataStr () {
        return this.mergeDataStr.d;
    }
}

export default MergeTempLibary;
