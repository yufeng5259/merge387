import { _decorator, Component, ImageAsset, Label, Node, RichText, Sprite, SpriteFrame, Texture2D } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivitySlotSymbolShowWindow')
export default class ActivitySlotSymbolShowWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivitySlotSymbolShowWindow';

    @property([Node])
    nodes: Node[] = [];

    @property(Node)
    spDecoration: Node | null = null;

    @property(Sprite)
    spBg: Sprite | null = null;

    @property(RichText)
    labelDes1: RichText | null = null;

    @property(RichText)
    labelDes2: RichText | null = null;

    @property(Component)
    extra: Component | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Component)
    addItem: Component | null = null;

    @property(Node)
    barNode: Node | null = null;

    @property(Node)
    barTiaoNode: Node | null = null;

    meta: any = null;
    metaParam: any = null;
    userdata: any = null;
    symbolId: any = null;
    activityId: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.metaParam = this.meta.Param();
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id());

        this.symbolId = this.metaParam.symbolId || this.metaParam.showSymbolId;

        let rawNames: string[] = [];
        this.nodes.forEach(x => {
            CCTools.SetNodeByParam(x, this.metaParam[x.name]);
            rawNames.push(x.name);
        });
        for (let name in this.metaParam) {
            if (rawNames.indexOf(name) >= 0) continue;
            if (name == 'badgeTime' || name == 'oldPriceShopId') continue;
            let nnode = new Node(name);
            if (this.spDecoration) nnode.parent = this.spDecoration;
            CCTools.SetNodeByParam(nnode, this.metaParam[name]);
        }

        let img = this.meta.Image();
        if (img.startsWith('http')) {
            cce.loaderLoad({ url: img, type: 'png' }, (err: any, v: ImageAsset) => {
                if (err != null) { Logs.Warning(err); return; }
                if (!this.spBg || !this.node) return;
                this.spBg.spriteFrame = createSpriteFrame(v);
            });
        } else {
            let resName = 'res/Activity/images/' + img;
            cce.loadRes(resName, SpriteFrame, (err: any, v: SpriteFrame) => {
                if (err != null) { Logs.Warning(err); return; }
                if (!this.spBg || !this.node) return;
                this.spBg.spriteFrame = v;
            });
        }

        this.activityId = this.meta.Id();
        this.userdata = Game.SUserActivity.GetActivityData(this.activityId);

        let currentId = this.userdata.currentId || 1;
        let currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollect, currentId);
        let currentGetLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectLimitedReward, currentId));
        let currentLimtTime = this.userdata.limitedTime || 0;
        let limtTime = currentLimtTime - GameKit.TimeUtil.getCurrentTime();
        if (this.labelDes1) this.labelDes1.string = String.format(GameKit.i18n.t('ActivitySlotCollectLabel1'), currentNeed, this.symbolId);
        if (this.labelDes2) this.labelDes2.string = String.format(GameKit.i18n.t('ActivitySlotCollectLabel2'), this.symbolId);

        if (this.extra) (this.extra as any).Show(null, this.meta);

        if (currentGetLimt && limtTime > 0) {
            if (this.barNode) this.barNode.setPosition(0, this.barNode.position.y, this.barNode.position.z);
            if (this.addItem) (this.addItem as any).setAttackMeta(this.meta);
        } else {
            if (this.barNode) this.barNode.setPosition(45, this.barNode.position.y, this.barNode.position.z);
            if (this.addItem) (this.addItem as any).setAttackMeta(this.meta);
        }
        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
        cce.releaseSpriteFrame(this.spBg);
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = 0;

            this.leftTime = this.meta.EndTime() - currentTime;

            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            }

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    close_window() {
        this.closeAnim();
    }

    callBuy() {
        if (this.childWindowChain) {
            this.closeAnim();
            return;
        }
        this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Slot); });
    }
}
