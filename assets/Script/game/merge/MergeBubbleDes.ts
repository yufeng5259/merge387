import { _decorator, Component, Node } from 'cc';
import ContentModel from '../items/ContentModel';

const { ccclass, property } = _decorator;

function getMergeContentUtil() {
    return (Game && Game.MergeContentUtil) || (global && global.MergeContentUtil) || null;
}

@ccclass('MergeBubbleDes')
export class MergeBubbleDes extends Component {
    @property(Node)
    public btn_broken: Node | null = null;
    @property(Node)
    public btn_ad: Node | null = null;
    @property(Node)
    public btn_free: Node | null = null;
    @property(Node)
    public btn_diamond: Node | null = null;

    public tx: any = null;
    public ty: any = null;
    public meta: any = null;

    start() {
    }

    ShowDes(meta: any, tx: any, ty: any) {
        this.tx = tx;
        this.ty = ty;
        this.meta = meta;
        if (Game.SUserMerge.BubbleFreeCount() > 0) {
            this.showFree();
        } else {
            this.showBuy();
        }
    }

    showFree() {
        if (this.btn_broken) this.btn_broken.active = true;
        if (this.btn_free) this.btn_free.active = true;
        if (this.btn_ad) this.btn_ad.active = false;
        if (this.btn_diamond) this.btn_diamond.active = false;
    }

    showBuy() {
        if (this.btn_broken) this.btn_broken.active = true;
        if (this.btn_free) this.btn_free.active = false;
        if (this.btn_ad) this.btn_ad.active = AppKit.ADWrap.AdEnabled() && Game.SUserMerge.BubbleAdCount() > 0;
        if (this.btn_diamond) this.btn_diamond.active = true;
        const util = getMergeContentUtil();
        const bubbleCost = util ? util.toContentString(this.meta.BubbleCost()) : '';
        const diamondItemModel = this.btn_diamond
            ? GameKit.ControllerTable.GetComponent(this.btn_diamond, 'itemModel', ContentModel)
            : null;
        if (diamondItemModel) {
            diamondItemModel.show(Game.Content.FromString(bubbleCost), { iconParams: { dontTouch: true } });
        }
    }

    onClickBroken() {
        const iconSpriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, this.meta.Icon());
        UIRoot.instance.openChildWindow('MergeDialogWindow', {
            titleStr: GameKit.i18n.t('GuestConfirmTitle'),
            showRichText: true,
            iconSpriteFrame: iconSpriteFrame,
            showIconBubble: true,
            richTextStr: GameKit.i18n.t('Merge_Broken_Des'),
            confirmStr: GameKit.i18n.t('Merge_Break'),
            confirmFunc: function () {
                GamePlay.instance.mergeRoot.mergeLevelNode.BrokenBubble(this.tx, this.ty);
            }.bind(this),
            cancelStr: GameKit.i18n.t('Merge_Cancel'),
            cancelFunc: () => {
            },
        });
    }

    onClickFree() {
        GamePlay.instance.mergeRoot.mergeLevelNode.ClaimBubble(this.tx, this.ty, 'free');
    }

    onClickAD() {
        GamePlay.instance.mergeRoot.mergeLevelNode.ClaimBubble(this.tx, this.ty, 'ad');
    }

    onClickDiamond() {
        const util = getMergeContentUtil();
        const bubbleCost = util ? util.toContentString(this.meta.BubbleCost()) : '';
        const costContent = Game.Content.FromString(bubbleCost);
        if (Game.ContentCheck.CheckContent(costContent)) {
            const iconSpriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, this.meta.Icon());
            UIRoot.instance.openChildWindow('MergeDialogWindow', {
                titleStr: GameKit.i18n.t('GuestConfirmTitle'),
                contentConfirmStr: bubbleCost,
                showRichText: true,
                iconSpriteFrame: iconSpriteFrame,
                showIconBubble: true,
                richTextStr: GameKit.i18n.t('Merge_Broken_Des'),
                confirmStr: GameKit.i18n.t('Merge_Break'),
                confirmFunc: function () {
                    GamePlay.instance.mergeRoot.mergeLevelNode.ClaimBubble(this.tx, this.ty, 'cash');
                }.bind(this),
            });
        }
    }
}

export default MergeBubbleDes;
