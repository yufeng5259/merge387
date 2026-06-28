import { _decorator, ImageAsset, instantiate, Label, Node, Sprite, SpriteFrame, Texture2D, UITransform } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

function fitByHeight(sprite: Sprite, height: number) {
    const spriteFrame = sprite.spriteFrame;
    if (!spriteFrame || height <= 0) return;
    const rect = spriteFrame.rect;
    if (!rect.height) return;
    const width = rect.width * height / rect.height;
    let transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
    transform.setContentSize(width, height);
}

@ccclass('ActivitySlotSymbolPreviewWindow')
export default class ActivitySlotSymbolPreviewWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivitySlotSymbolPreviewWindow';

    @property([Node])
    nodes: Node[] = [];

    @property(Sprite)
    spBg: Sprite | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property([Node])
    bars: Node[] = [];

    @property(Node)
    list: Node | null = null;

    @property(Node)
    maxNode: Node | null = null;

    @property(Node)
    item1: Node | null = null;

    @property(Node)
    item2: Node | null = null;

    @property([SpriteFrame])
    bgSprites: SpriteFrame[] = [];

    meta: any = null;
    metaParam: any = null;
    userdata: any = null;
    symbolId: any = null;
    activityId: any = null;
    currentLimtTime = 0;
    leftTime: number | null = null;

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

        this.activityId = this.meta.Id();
        this.userdata = Game.SUserActivity.GetActivityData(this.activityId);

        this.updateView();

        this.leftTime = 0;
        this.update(0);
    }

    private getActivityRewardTypes() {
        let maxId = Game.ActivityManager.Constance.slotCollectMaxId;
        let typeLimtStr = Meta.ActivityParamsMeta.Types.SlotCollectLimitedReward;
        let typeStr = Meta.ActivityParamsMeta.Types.SlotCollectReward;
        if (this.meta.SubType() === Meta.ActivityMeta.SubTypes.AttackMaster) {
            typeStr = Meta.ActivityParamsMeta.Types.AttackMasterReward;
            typeLimtStr = Meta.ActivityParamsMeta.Types.AttackMasterLimitedReward;
            maxId = Game.ActivityManager.Constance.attackMasterMaxId;
        } else if (this.meta.SubType() === Meta.ActivityMeta.SubTypes.RaidMaster) {
            typeStr = Meta.ActivityParamsMeta.Types.RaidMasterReward;
            typeLimtStr = Meta.ActivityParamsMeta.Types.RaidMasterLimitedReward;
            maxId = Game.ActivityManager.Constance.raidMasterMaxId;
        }
        return { maxId, typeLimtStr, typeStr };
    }

    private getRange(maxId: number, currentId: number) {
        let minId = currentId;
        let lastId = currentId;
        for (let index = 0; index < 5; index++) {
            let nextId = lastId + 1;
            if (nextId > maxId) {
                minId--;
            } else {
                lastId = nextId;
            }
        }
        minId = Math.max(1, minId);
        return { minId, lastId };
    }

    refreshView() {
        let self = this;
        let { maxId, typeLimtStr, typeStr } = this.getActivityRewardTypes();

        let currentId = this.userdata.currentId || 1;
        let { minId, lastId } = this.getRange(maxId, currentId);

        let rewardNodeModel: any;
        let limitRewardNodeModel: any;
        let kbgSpr: Sprite | null = null;

        let rewardReward = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeStr, maxId));
        let rewardLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeLimtStr, maxId));
        if (!this.maxNode) return;
        let bgSpr = GameKit.ControllerTable.GetNode(this.maxNode, 'bg').getComponent(Sprite);
        let kitem1 = GameKit.ControllerTable.GetNode(this.maxNode, 'item1');
        let kitem2 = GameKit.ControllerTable.GetNode(this.maxNode, 'item2');
        let timeOver = false;
        if (maxId == currentId) {
            this.currentLimtTime = this.userdata.limitedTime || 0;
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            if (this.currentLimtTime - currentTime < 0) {
                timeOver = true;
            }
        }
        if (rewardLimt && timeOver == false) {
            kitem1.active = false;
            kitem2.active = true;

            rewardNodeModel = GameKit.ControllerTable.GetNode(kitem2, 'item').getComponent('ContentModel');
            kbgSpr = GameKit.ControllerTable.GetNode(kitem2, 'bg').getComponent(Sprite);
            limitRewardNodeModel = GameKit.ControllerTable.GetNode(kitem2, 'limit').getComponent('ContentModel');

            rewardNodeModel.show(rewardReward);
            limitRewardNodeModel.show(rewardLimt);
        } else {
            kitem1.active = true;
            kitem2.active = false;
            rewardNodeModel = GameKit.ControllerTable.GetNode(kitem1, 'item').getComponent('ContentModel');
            rewardNodeModel.show(rewardReward);
        }

        if (bgSpr) bgSpr.spriteFrame = currentId == maxId ? this.bgSprites[3] : this.bgSprites[2];
        if (kbgSpr) kbgSpr.spriteFrame = currentId == maxId ? this.bgSprites[1] : this.bgSprites[0];

        if (currentId == maxId || !this.list || !this.item1) return;

        let idx = 0;
        for (let i = minId; i < lastId; i++) {
            rewardReward = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeStr, i));
            if (i == currentId) {
                let oldItem = this.list.children[idx];
                oldItem.removeFromParent();

                let newSpItem = instantiate(this.item1);
                newSpItem.parent = this.list;
                newSpItem.active = true;
                rewardNodeModel = GameKit.ControllerTable.GetNode(newSpItem, 'item').getComponent('ContentModel');
                bgSpr = GameKit.ControllerTable.GetNode(newSpItem, 'bg').getComponent(Sprite);
                newSpItem.setSiblingIndex(idx);
                rewardNodeModel.show(rewardReward);

                if (bgSpr) bgSpr.spriteFrame = this.bgSprites[1];

                let enterCloseAnim = newSpItem.getComponent('EnterCloseAnim') as any;
                enterCloseAnim.enterAnim();
            }
            idx++;
        }
    }

    updateView() {
        let self = this;
        let { maxId, typeLimtStr, typeStr } = this.getActivityRewardTypes();

        let currentId = this.userdata.currentId || 1;
        let { minId, lastId } = this.getRange(maxId, currentId);

        let rewardNodeModel: any;
        let limitRewardNodeModel: any;
        let kbgSpr: Sprite | null = null;
        let limitItem: Node;

        let rewardReward = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeStr, maxId));
        let rewardLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeLimtStr, maxId));
        if (!this.maxNode || !this.list || !this.item1 || !this.item2) return;
        let bgSpr = GameKit.ControllerTable.GetNode(this.maxNode, 'bg').getComponent(Sprite);
        let kitem1 = GameKit.ControllerTable.GetNode(this.maxNode, 'item1');
        let kitem2 = GameKit.ControllerTable.GetNode(this.maxNode, 'item2');
        let timeOver = false;
        if (currentId == null) {
            this.currentLimtTime = this.userdata.limitedTime || 0;
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            if (this.currentLimtTime - currentTime < 0) {
                timeOver = true;
            }
        }
        if (rewardLimt && timeOver == false) {
            kitem1.active = false;
            kitem2.active = true;

            rewardNodeModel = GameKit.ControllerTable.GetNode(kitem2, 'item').getComponent('ContentModel');
            kbgSpr = GameKit.ControllerTable.GetNode(kitem2, 'bg').getComponent(Sprite);
            limitRewardNodeModel = GameKit.ControllerTable.GetNode(kitem2, 'limit').getComponent('ContentModel');
            limitItem = limitRewardNodeModel.node.parent;
            (limitItem.getComponent('ActivityLimitReward') as any).setSlotCollectMeta(this.meta, maxId, maxId == currentId ? () => { self.refreshView(); console.log('----'); } : null);

            rewardNodeModel.show(rewardReward);
            limitRewardNodeModel.show(rewardLimt);
        } else {
            kitem1.active = true;
            kitem2.active = false;
            rewardNodeModel = GameKit.ControllerTable.GetNode(kitem1, 'item').getComponent('ContentModel');
            rewardNodeModel.show(rewardReward);
        }

        if (bgSpr) bgSpr.spriteFrame = currentId == maxId ? this.bgSprites[3] : this.bgSprites[2];
        if (kbgSpr) kbgSpr.spriteFrame = currentId == maxId ? this.bgSprites[1] : this.bgSprites[0];

        this.list.removeAllChildren();
        let idx = 0;
        for (let i = minId; i < lastId; i++) {
            let md = this.bars[idx];
            if (!md) continue;

            let micon = GameKit.ControllerTable.GetNode(md, 'icon').getComponent(Sprite);
            let spFx = GameKit.ControllerTable.GetNode(md, 'spFx');
            let lock = GameKit.ControllerTable.GetNode(md, 'lock');
            let circle = GameKit.ControllerTable.GetNode(md, 'circle');

            rewardReward = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeStr, i));
            rewardLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(typeLimtStr, i));

            let timeOver = false;
            if (i == currentId) {
                this.currentLimtTime = this.userdata.limitedTime || 0;
                let currentTime = GameKit.TimeUtil.getCurrentTime();
                if (this.currentLimtTime - currentTime <= 0) {
                    timeOver = true;
                }
            }

            md.active = i >= currentId;

            let newSpItem: Node;
            if (rewardReward && rewardLimt && timeOver == false) {
                newSpItem = instantiate(this.item2);
                newSpItem.parent = this.list;
                newSpItem.active = true;
                rewardNodeModel = GameKit.ControllerTable.GetNode(newSpItem, 'item').getComponent('ContentModel');
                bgSpr = GameKit.ControllerTable.GetNode(newSpItem, 'bg').getComponent(Sprite);
                limitRewardNodeModel = GameKit.ControllerTable.GetNode(newSpItem, 'limit').getComponent('ContentModel');
                limitItem = limitRewardNodeModel.node.parent;
                (limitItem.getComponent('ActivityLimitReward') as any).setSlotCollectMeta(this.meta, i, i == currentId ? () => { self.refreshView(); } : null);

                rewardNodeModel.show(rewardReward);
                limitRewardNodeModel.show(rewardLimt);
            } else {
                newSpItem = instantiate(this.item1);
                newSpItem.parent = this.list;
                newSpItem.active = true;
                rewardNodeModel = GameKit.ControllerTable.GetNode(newSpItem, 'item').getComponent('ContentModel');
                bgSpr = GameKit.ControllerTable.GetNode(newSpItem, 'bg').getComponent(Sprite);

                rewardNodeModel.show(rewardReward);
            }

            if (i == currentId) {
                micon.node.active = true;
                spFx.active = true;
                lock.active = false;
                circle.active = true;
                if (bgSpr) bgSpr.spriteFrame = this.bgSprites[1];

                let sp: SpriteFrame | null = null;
                if (this.meta.SubType() === Meta.ActivityMeta.SubTypes.AttackMaster) {
                    sp = this.bgSprites[4];
                } else if (this.meta.SubType() === Meta.ActivityMeta.SubTypes.RaidMaster) {
                    sp = this.bgSprites[5];
                } else if (this.meta.SubType() === Meta.ActivityMeta.SubTypes.SlotCollect) {
                    sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, this.symbolId.toString());
                }
                let height = micon.node.getComponent(UITransform)?.height || 0;
                micon.spriteFrame = sp;
                fitByHeight(micon, height);
            } else {
                micon.node.active = false;
                spFx.active = false;
                lock.active = true;
                circle.active = false;
                if (bgSpr) bgSpr.spriteFrame = this.bgSprites[0];
            }
            idx++;
        }
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
    }
}
