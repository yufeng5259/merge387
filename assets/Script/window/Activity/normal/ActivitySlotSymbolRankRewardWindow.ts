import { _decorator, Component, instantiate, Label, Node } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ActivitySlotSymbolRankRewardWindow')
export default class ActivitySlotSymbolRankRewardWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivitySlotSymbolRankRewardWindow';

    @property([Node])
    nodes: Node[] = [];

    @property(Node)
    spWin: Node | null = null;

    @property(Node)
    spLose: Node | null = null;

    @property(Component)
    userinfo: Component | null = null;

    @property(Label)
    labelRank: Label | null = null;

    @property(Component)
    spDailyItem: Component | null = null;

    @property(Node)
    spDailyItemParent: Node | null = null;

    meta: any = null;
    userdata: any = null;
    metaParam: any = null;
    showParam: any = null;
    oldCoin: number | null = null;
    oldAp: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.userdata = Game.SUserActivity.GetSymbolRankData();
        if (this.meta == null) {
            if (this.userdata.activityId) this.meta = Game.ActivityManager.GetMeta(this.userdata.activityId);
        }
        if (this.meta) {
            this.metaParam = this.meta.Param();
            this.showParam = this.metaParam.__info;

            this.nodes.forEach(x => {
                CCTools.SetNodeByParam(x, this.showParam[x.name]);
            });
        }

        let addAps = 0;
        let addCoins = 0;

        let uids = Object.keys(this.userdata.rank);
        uids.sort((a, b) => {
            return this.userdata.rank[b].score - this.userdata.rank[a].score;
        });
        let selfRank = uids.indexOf(Game.SUser.UserId().toString());
        let rewards = Game.Content.FromStrings(Meta.RankRewardMeta.GetShootRewards(selfRank + 1)) || [];
        rewards = Game.Content.Merge(rewards);
        rewards.forEach(reward => {
            if (!this.spDailyItem || !this.spDailyItemParent) return;
            let itemHandle = instantiate(this.spDailyItem.node);
            itemHandle.parent = this.spDailyItemParent;
            (itemHandle.getComponent('ContentModel') as any).show(reward);
            if (reward.Type() == Game.Content.Types.Ap) {
                addAps += reward.Count();
            } else if (reward.Type() == Game.Content.Types.Coin) {
                addCoins += reward.Count();
            }
        });
        if (this.spDailyItem) this.spDailyItem.node.active = false;

        if (selfRank < 50) {
            if (this.spWin) this.spWin.active = true;
            if (this.spLose) this.spLose.active = false;

            if (this.userinfo) (this.userinfo as any).show(Game.SUser);
            if (this.labelRank) this.labelRank.string = (selfRank + 1).toString();
        } else {
            if (this.spWin) this.spWin.active = false;
            if (this.spLose) this.spLose.active = true;
        }

        let randomPack = GameKit.DataCache.GetData('UserRandomPack');
        if (randomPack) {
            let randomPackReward = randomPack.rewards || [];
            randomPackReward.forEach(x => {
                let reward = Game.Content.FromContent(x);
                if (reward.Type() == Game.Content.Types.Ap) {
                    addAps += reward.Count();
                } else if (reward.Type() == Game.Content.Types.Coin) {
                    addCoins += reward.Count();
                }
            });
        }

        setTimeout(() => {
            CardChestOpenWindow.tryShow();
        }, 600);

        if (addCoins > 0 && GameMainWindow.instance) {
            this.oldCoin = Game.SUser.Coin() - addCoins;
            GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin, 0);
        }
        if (addAps > 0 && GamePlay.instance.slotNode) {
            this.oldAp = Game.SUser.Ap() - addAps;
            GamePlay.instance.slotNode.getComponent('UserInfoModel').stopApAt(this.oldAp);
        }
    }

    onClose() {
    }

    update() {
    }

    close_window() {
        this.closeAnim();

        if (this.oldCoin != null && GameMainWindow.instance) {
            GameMainWindow.instance.playAddCoinAnim();
            GameMainWindow.instance.scheduleOnce(() => {
                GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, Game.SUser.Coin(), 0.8);
            }, 1);
        }
        if (this.oldAp != null && GamePlay.instance.slotNode) {
            let slot = GamePlay.instance.slotNode;
            slot.isSpining = true;
            slot.getComponent('UserInfoModel').playApAnim(() => {
                slot.makeIdle();
            });
            slot.showSpinAddNumAnim(Game.SUser.Ap() - this.oldAp);
        }
    }
}
