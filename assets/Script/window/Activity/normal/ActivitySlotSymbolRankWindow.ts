import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function fitByHeight(sprite: Sprite, height?: number) {
    const spriteFrame = sprite.spriteFrame;
    if (!spriteFrame) return;
    const rect = spriteFrame.rect;
    if (!rect.height) return;
    const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
    const targetHeight = height || transform.height;
    if (targetHeight <= 0) return;
    transform.setContentSize(rect.width * targetHeight / rect.height, targetHeight);
}

@ccclass('ActivitySlotSymbolRankWindow')
export default class ActivitySlotSymbolRankWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivitySlotSymbolRankWindow';

    @property(Node)
    spTitle: Node | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Component)
    svt: Component | null = null;

    @property(Node)
    spItemSelf: Node | null = null;

    @property([SpriteFrame])
    cup_sf_array: SpriteFrame[] = [];

    @property(Node)
    labelGetJoin: Node | null = null;

    @property(Sprite)
    spGetJoinSymbol: Sprite | null = null;

    @property(RichText)
    labelDes2: RichText | null = null;

    @property(Node)
    infoModel: Node | null = null;

    @property(Component)
    infoPanel: Component | null = null;

    @property(Component)
    rankBar: Component | null = null;

    meta: any = null;
    data: any = null;
    metaParam: any = null;
    showParam: any = null;
    symbolId: any = null;
    leftTime: number | null = null;
    showOver = false;
    showJoin = false;
    refreshing = false;
    selfRank = -1;
    item1: any = null;
    item2: any = null;
    item3: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.data = Game.SUserActivity.GetSymbolRankData();

        if (this.meta == null && this.data.activityId) {
            this.meta = Game.ActivityManager.GetMeta(this.data.activityId);
        }
        if (this.meta && this.data.activityId != this.meta.Id()) {
            this.data = { activityId: this.meta.Id(), rank: {}, updateTime: GameKit.TimeUtil.getCurrentTime(), collect: false };
        }

        if ((this.meta == null || !this.meta.IsActive()) && !this.data.collect) {
            setTimeout(() => {
                this.close();
                SR.SRActivity.getUserActivity().Send();
            }, 10);
            return;
        }

        if (this.meta) {
            this.metaParam = this.meta.Param();
            this.showParam = this.metaParam.__info;
            if (this.spTitle) CCTools.SetNodeByParam(this.spTitle, this.showParam.title);

            this.symbolId = this.metaParam.symbolId || this.metaParam.showSymbolId;
        } else {
            this.symbolId = this.data.symbolId;
        }

        if ((this.meta == null || !this.meta.IsActive()) && this.data.collect) {
            this.set_over();
            this.showOver = true;
        } else if (this.data == null || this.data.activityId == null || this.data.activityId != this.meta.Id() || this.data.rank == null || Object.keys(this.data.rank).length == 0) {
            this.set_join();
            if (this.rankBar) (this.rankBar as any).setMeta(this.meta, this.data);
            this.showJoin = true;
        } else {
            if (GameKit.TimeUtil.getCurrentTime() - this.data.updateTime > GameKit.TimeUtil.MinuteInSecond * 10) {
                let req = SR.SRActivity.getUserActivity();
                req.SetCallBack(() => {
                    this.data = Game.SUserActivity.GetSymbolRankData();
                    this.set_svt();
                });
                req.Send();
            } else {
                this.set_svt();
            }
        }

        if (this.labelDes2) this.labelDes2.string = String.format(GameKit.i18n.t('ActivitySlotCollectRankInfoLabel2'), this.symbolId);
        if (this.meta && this.infoPanel) (this.infoPanel as any).Show(null, this.meta);

        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = 0;

            if (this.meta) this.leftTime = this.meta.EndTime() - currentTime;

            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            }

            if (!this.showJoin && !this.showOver && !this.refreshing && (GameKit.TimeUtil.getCurrentTime() - this.data.updateTime > 605 || this.leftTime <= 0)) {
                let req = SR.SRActivity.getUserActivity();
                req.SetCallBack(() => {
                    this.data = Game.SUserActivity.GetSymbolRankData();
                    this.set_svt();
                    this.refreshing = false;
                });
                req.Send();
                this.refreshing = true;
            }

            if (this.leftTime <= 0) {
                if (this.labelTimer) this.labelTimer.string = GameKit.i18n.t('ActivityCenterTimeEnd');
                this.leftTime = null;
            }
        }
    }

    close_window() {
        this.closeAnim();
    }

    set_user_item(index: number, id: any, itemHandle: Node) {
        let userinfo = GameKit.ControllerTable.GetNode(itemHandle, 'userinfo').getComponent('UserInfoModel') as any;
        let cup = GameKit.ControllerTable.GetNode(itemHandle, 'cup').getComponent(Sprite);
        let index_label = GameKit.ControllerTable.GetNode(itemHandle, 'index_label').getComponent(Label);
        let level_label = GameKit.ControllerTable.GetNode(itemHandle, 'level_label').getComponent(Label);
        let bgSelf = GameKit.ControllerTable.GetNode(itemHandle, 'bgSelf');
        this.item1 = GameKit.ControllerTable.GetComponent(itemHandle, 'item1', 'ContentModel');
        this.item2 = GameKit.ControllerTable.GetComponent(itemHandle, 'item2', 'ContentModel');
        this.item3 = GameKit.ControllerTable.GetComponent(itemHandle, 'item3', 'ContentModel');
        let symbol = GameKit.ControllerTable.GetComponent(itemHandle, 'symbol', Sprite);

        let rank = index + 1;
        let data = this.data.rank[id];

        if (id == Game.SUser.UserId()) userinfo.show(Game.SUser);
        else userinfo.show(new Game.User().updateData(data));

        if (rank < 4) {
            cup.node.active = true;
            cup.spriteFrame = this.cup_sf_array[index];
            index_label.node.active = false;
        } else {
            cup.node.active = false;
            index_label.node.active = true;
            index_label.string = rank.toString();
        }

        bgSelf.active = id == Game.SUser.UserId();

        level_label.string = data.score.toString();
        symbol.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, this.symbolId.toString());
        fitByHeight(symbol);

        this.item1.clear();
        this.item2.clear();
        this.item3.clear();
        if (index < 50) {
            let rewards = Game.Content.FromStrings(Meta.RankRewardMeta.GetShootRewards(rank)) || [];
            for (let index = 0; index < rewards.length; index++) {
                const element = rewards[index];
                this['item' + (index + 1)].show(element);
            }
        }
    }

    set_svt() {
        if (this.rankBar) (this.rankBar as any).setMeta(this.meta, this.data);
        let uids = Object.keys(this.data.rank);
        uids.sort((a, b) => {
            return this.data.rank[b].score - this.data.rank[a].score;
        });

        if (this.svt) {
            (this.svt as any).setItem(uids, (index: number, id: any, itemHandle: Node) => {
                this.set_user_item(index, id, itemHandle);
            });
        }

        this.selfRank = uids.indexOf(Game.SUser.UserId().toString());
        if (this.spItemSelf) this.set_user_item(this.selfRank, Game.SUser.UserId(), this.spItemSelf);

        this.onScroll();
    }

    set_join() {
        if (!this.spItemSelf) return;
        this.spItemSelf.active = true;
        let userinfo = GameKit.ControllerTable.GetNode(this.spItemSelf, 'userinfo').getComponent('UserInfoModel') as any;
        let label_getjoin = GameKit.ControllerTable.GetComponent(this.spItemSelf, 'label_getjoin', RichText);
        let level_label = GameKit.ControllerTable.GetNode(this.spItemSelf, 'level_label');
        userinfo.show(Game.SUser);
        label_getjoin.node.active = true;
        label_getjoin.string = String.format(GameKit.i18n.t('ActivitySlotCollectRankGetJoin'), this.symbolId);
        level_label.parent.active = false;

        if (this.labelGetJoin) this.labelGetJoin.active = true;
        if (this.spGetJoinSymbol) {
            this.spGetJoinSymbol.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, this.symbolId.toString());
            fitByHeight(this.spGetJoinSymbol);
        }
    }

    set_over() {
        this.set_svt();
        if (this.svt) (this.svt as any).DirectToIndex(this.selfRank);
        this.onScroll();
    }

    onScroll() {
        if (this.selfRank >= 0 && this.spItemSelf && this.svt) {
            let svt = this.svt as any;
            this.spItemSelf.active = this.spItemSelf.position.y > svt.scrollView.content.position.y + svt.scrollView.content.parent.position.y - this.selfRank * svt.itemSize;
        }
    }

    callInfo() {
        if (this.showOver && !this.meta) return;
        if (!this.infoPanel || !this.infoModel) return;
        this.infoPanel.node.active = true;
        this.infoPanel.node.setScale(0.001, 0.001, 0.001);
        tween(this.infoPanel.node).to(0.2, { scale: new Vec3(1, 1, 1) }).start();
        this.infoModel.active = true;
    }

    callInfoHide() {
        if (!this.infoPanel || !this.infoModel) return;
        tween(this.infoPanel.node)
            .to(0.2, { scale: new Vec3(0.001, 0.001, 0.001) })
            .call(() => {
                if (this.infoPanel) this.infoPanel.node.active = false;
                if (this.infoModel) this.infoModel.active = false;
            })
            .start();
    }
}
