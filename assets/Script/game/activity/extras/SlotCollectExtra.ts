import { _decorator, Component, Sprite, Label, ProgressBar, Node, tween, UITransform, Vec3 } from 'cc';
import { ContentModel } from '../../items/ContentModel';
const { ccclass, property } = _decorator;

function fitByHeight(sprite: Sprite | null, height?: number) {
    if (!sprite) return;
    const spriteFrame = sprite.spriteFrame;
    if (!spriteFrame) return;
    const rect = spriteFrame.rect;
    if (!rect.height) return;
    const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
    const targetHeight = height || transform.height;
    if (targetHeight <= 0) return;
    transform.setContentSize(rect.width * targetHeight / rect.height, targetHeight);
}

@ccclass('SlotCollectExtra')
export class SlotCollectExtra extends Component {
    @property(Sprite)
    public spSymbol: Sprite | null = null;
    @property(Label)
    public labelProgress: Label | null = null;
    @property(ProgressBar)
    public spProgress: ProgressBar | null = null;
    @property(ContentModel)
    public reward: ContentModel | null = null;
    @property(Node)
    public spHelp: Node | null = null;
    @property(Node)
    public spHelpSymbol: Node | null = null;
    @property([Sprite])
    public spHelpSymbols: Sprite[] = [];
    @property(Label)
    public labelHelpNum1: Label | null = null;
    @property(Label)
    public labelHelpNum2: Label | null = null;
    @property(Label)
    public labelHelpNum3: Label | null = null;
    @property(Label)
    public labelHelpNum4: Label | null = null;
    @property(Label)
    public labelHelpNum5: Label | null = null;

    Show (centerWindow: any, activityMeta: any) {
        const activityId = activityMeta.Id();
        const userdata = Game.SUserActivity.GetActivityData(activityId);
        const currentCount = userdata.currentCount || 0;
        const currentId = userdata.currentId || 1;
        const currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollect, currentId);
        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectReward, currentId));
        if (this.labelProgress) this.labelProgress.string = currentCount.toString() + " / " + currentNeed;
        if (this.spProgress) this.spProgress.progress = currentCount / currentNeed;
        if (this.reward) this.reward.show(currentGet, null);

        let symbolId = activityMeta.Param().symbolId;
        if (!symbolId) {
            if (this.spHelpSymbol) this.spHelpSymbol.active = false;
            symbolId = activityMeta.Param().showSymbolId;
        }
        if (this.spSymbol) {
            this.spSymbol.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString());
            fitByHeight(this.spSymbol);
        }
        const symbolSp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString() + "_s");
        this.spHelpSymbols.forEach(x => {
            x.spriteFrame = symbolSp;
            fitByHeight(x);
        });

        if (activityMeta.SubType() === Meta.ActivityMeta.SubTypes.SlotCollect) {
            if (this.labelHelpNum1) this.labelHelpNum1.string = Game.ActivityManager.Constance.slotCollectAttack.toString();
            if (this.labelHelpNum2) this.labelHelpNum2.string = Game.ActivityManager.Constance.slotCollectBlock.toString();
            if (this.labelHelpNum3) this.labelHelpNum3.string = Game.ActivityManager.Constance.slotCollectRaid.toString();
            if (this.labelHelpNum4) this.labelHelpNum4.string = Game.ActivityManager.Constance.slotCollectPRaid.toString();
            if (this.labelHelpNum5) this.labelHelpNum5.string = Game.ActivityManager.Constance.slotCollectSymbol.toString();
        } else if (activityMeta.SubType() === Meta.ActivityMeta.SubTypes.SlotCollectRank) {
            if (this.labelHelpNum1) this.labelHelpNum1.string = Game.ActivityManager.Constance.slotCollectRankAttack.toString();
            if (this.labelHelpNum2) this.labelHelpNum2.string = Game.ActivityManager.Constance.slotCollectRankBlock.toString();
            if (this.labelHelpNum3) this.labelHelpNum3.string = Game.ActivityManager.Constance.slotCollectRankRaid.toString();
            if (this.labelHelpNum4) this.labelHelpNum4.string = Game.ActivityManager.Constance.slotCollectRankPRaid.toString();
        }
    }

    openHelp () {
        if (!this.spHelp) return;
        tween(this.spHelp).stop();
        if (this.spHelp.active) {
            tween(this.spHelp)
                .to(0.2, { scale: new Vec3(0.001, 0.001, this.spHelp.scale.z) })
                .call(() => {
                    if (this.spHelp) this.spHelp.active = false;
                })
                .start();
        } else {
            this.spHelp.active = true;
            this.spHelp.setScale(0.001, 0.001, this.spHelp.scale.z);
            tween(this.spHelp).to(0.2, { scale: new Vec3(1, 1, this.spHelp.scale.z) }).start();
        }
    }

}
