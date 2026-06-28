import { _decorator, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivityGameShowWindow')
export default class ActivityGameShowWindow extends UIWindow {
    public static windowPath = 'Activity/ActivityGameShowWindow';

    @property([Node])
    nodes: Node[] = [];

    @property(Sprite)
    spBg: Sprite | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Node)
    spDecoration: Node | null = null;

    meta: any = null;
    metaParam: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.metaParam = this.meta.Param();

        let rawNames: string[] = [];
        this.nodes.forEach(x => {
            CCTools.SetNodeByParam(x, this.metaParam[x.name]);
            rawNames.push(x.name);
        });
        for (let name in this.metaParam) {
            if (rawNames.indexOf(name) >= 0) continue;
            if (name == 'badgeTime' || name == 'oldPriceShopId' || name.startsWith('__')) continue;
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
        let meta = this.meta;

        if (meta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollectRank) {
            if (this.childWindowChain) {
                this.closeAnim();
                return;
            }
        }

        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        if (!meta.IsActive()) {
            this.closeAnim(() => {
                DialogWindow.Show(GameKit.i18n.t('ActivityCenterTimeEnd'), nullFunction);
            });
            return;
        }

        let icon_goto = meta.IconGoto();
        if (icon_goto == 'panel') {
            if (meta.Panel() == 'ActivityGameShowWindow') this.closeAnim();
            else this.closeAnim(() => { UIRoot.instance.openChildWindow(meta.Panel(), { meta: meta }); });
        } else if (icon_goto == 'slot') {
            this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Slot); });
        } else if (icon_goto == 'village') {
            this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Village); });
        } else if (icon_goto == 'window') {
            this.closeAnim(() => { UIRoot.instance.openChildWindow(meta.Panel(), { meta: meta }); });
        } else {
            this.closeAnim(() => { UIRoot.instance.openChildWindow(icon_goto, { meta: meta }); });
        }
    }
}
