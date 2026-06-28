import { _decorator, ImageAsset, Label, Node, RichText, Sprite, SpriteFrame, Texture2D } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivityDaysSaleWindow')
export default class ActivityDaysSaleWindow extends UIWindow {
    public static windowPath = 'Activity/ActivityDaysSaleWindow';

    @property(Node)
    spClose: Node | null = null;

    @property(Node)
    spButton: Node | null = null;

    @property(Sprite)
    spBg: Sprite | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Label)
    labelButton: Label | null = null;

    @property(RichText)
    labelMessage: RichText | null = null;

    @property(RichText)
    labelMessageShadow: RichText | null = null;

    meta: any = null;
    metaParam: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.metaParam = this.meta.Param();

        CCTools.SetNodeByParam(this.spClose, this.metaParam.close);

        CCTools.SetNodeByParam(this.labelButton, this.metaParam.labelButton);
        CCTools.SetNodeByParam(this.spButton, this.metaParam.button);

        CCTools.SetNodeByParam(this.labelTimer, this.metaParam.timer);
        CCTools.SetNodeByParam(this.labelMessage, this.metaParam.message);
        CCTools.SetNodeByParam(this.labelMessageShadow, this.metaParam.message_shadow);

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

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = this.meta.EndTime() - currentTime;

            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
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
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        this.closeAnim(() => {
            UIRoot.instance.openChildWindow('ShopWindow');

            AppKit.LogEventWrap.logEvent('openshop_activitysale');
        });
    }
}
