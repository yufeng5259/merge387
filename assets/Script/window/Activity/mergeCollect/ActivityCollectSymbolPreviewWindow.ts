import { _decorator, Component, ImageAsset, isValid, Label, Node, ProgressBar, Sprite, SpriteFrame, Texture2D } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivityCollectSymbolPreviewWindow')
export default class ActivityCollectSymbolPreviewWindow extends UIWindow {
    public static windowPath = 'Activity/newcollect/ActivityCollectSymbolPreviewWindow';

    @property(Node)
    top1Node: Node | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Component)
    list: Component | null = null;

    @property(ProgressBar)
    progressBar: ProgressBar | null = null;

    @property(Sprite)
    icon: Sprite | null = null;

    spBg: Sprite | null = null;
    meta: any = null;
    activityId: any = null;
    metaParam: any = null;
    userdata: any = null;
    symbolId: any = null;
    previewMinId = 0;
    previewMaxId = 0;
    leftTime: number | null = null;
    _currentTimeLabel: Label | null = null;
    _currentItem2: Node | null = null;
    _currentPlus: Node | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.activityId = this.meta.Id();
        this.metaParam = this.meta.Param();
        this.userdata = Game.SUserActivity.GetActivityData(this.activityId);

        console.log(this.userdata);

        if (!this.userdata || Object.keys(this.userdata).length === 0) {
            console.log(this.activityId, 'userdata is null', this.userdata);
            return;
        }

        this.symbolId = this.metaParam.symbolId || this.metaParam.showSymbolId;
        if (this.icon) {
            this.icon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, this.symbolId.toString());
        }

        let img = this.meta.Image();
        if (img) {
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
        }

        let maxId = Game.ActivityManager.Constance.slotCollectMaxId;
        let currentId = this.userdata.currentId || 1;
        let windowSize = 5;
        let maxShowId = Math.min(currentId + windowSize - 1, maxId - 1);
        let minId = maxShowId - windowSize + 1;
        if (minId < 1) {
            minId = 1;
            maxShowId = Math.min(maxId - 1, minId + windowSize - 1);
        }
        this.previewMinId = minId;
        this.previewMaxId = maxShowId;

        if (this.progressBar) {
            this.progressBar.progress = maxId > 1 ? (currentId - 1) / (maxId - 1) : 0;
        }

        if (this.list) {
            (this.list as any).numItems = Math.max(0, this.previewMaxId - this.previewMinId + 1);
        }
        if (this.top1Node) {
            this.showItemNode(this.top1Node, maxId);
        }

        this.leftTime = 0;
        this.update(0);
    }

    onItemRender(node: Node, index: number) {
        let itemId = this.previewMaxId - index;
        this.showItemNode(node, itemId);
    }

    showItemNode(node: Node, itemId: number) {
        let typeLimtStr = Meta.ActivityParamsMeta.Types.SlotCollectLimitedReward;
        let typeStr = Meta.ActivityParamsMeta.Types.SlotCollectReward;
        let rewardReward = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeStr, itemId));
        let rewardLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeLimtStr, itemId));

        let limitTime = Meta.ActivityParamsMeta.GetValue('slotCollectLimitedTime', itemId);

        let selectBg = GameKit.ControllerTable.GetNode(node, 'bg');
        let item1 = GameKit.ControllerTable.GetNode(node, 'item1');
        let item2 = GameKit.ControllerTable.GetNode(node, 'item2');
        let plus = GameKit.ControllerTable.GetNode(node, 'plus');

        selectBg.active = itemId == this.userdata.currentId;

        item1.getComponent('ContentModel').show(rewardReward);

        if (rewardLimt) {
            item2.getComponent('ContentModel').show(rewardLimt);
            plus.active = true;

            let timespr = GameKit.ControllerTable.GetNode(item2, 'timespr');
            timespr.active = !!limitTime;

            let timeLabel = GameKit.ControllerTable.GetComponent(item2, 'timelabel', Label);
            if (timeLabel && timespr.active) {
                if (itemId == this.userdata.currentId) {
                    this.userdata.limitedTime = limitTime + 10;
                    let remain = (this.userdata.limitedTime || 0) - GameKit.TimeUtil.getCurrentTime();
                    if (remain <= 0) {
                        item2.active = false;
                        plus.active = false;
                        this._currentTimeLabel = null;
                        this._currentItem2 = null;
                        this._currentPlus = null;
                    } else {
                        timeLabel.string = GameKit.TimeUtil.FormatRemainTimeSimple(remain, true);
                        this._currentTimeLabel = timeLabel;
                        this._currentItem2 = item2;
                        this._currentPlus = plus;
                    }
                } else {
                    timeLabel.string = GameKit.TimeUtil.FormatRemainTimeSimple(limitTime, false);
                }
            }
        } else {
            item2.active = false;
            plus.active = false;
        }
    }

    onClose() {
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

        if (this._currentTimeLabel && isValid(this._currentTimeLabel.node) && this.userdata && this.userdata.limitedTime) {
            let remain = this.userdata.limitedTime - GameKit.TimeUtil.getCurrentTime();
            if (remain <= 0) {
                if (this._currentItem2 && isValid(this._currentItem2)) this._currentItem2.active = false;
                if (this._currentPlus && isValid(this._currentPlus)) this._currentPlus.active = false;
                this._currentTimeLabel = null;
                this._currentItem2 = null;
                this._currentPlus = null;
            } else {
                this._currentTimeLabel.string = GameKit.TimeUtil.FormatRemainTimeSimple(remain, true);
            }
        }
    }

    close_window() {
        this.closeAnim();
    }
}
