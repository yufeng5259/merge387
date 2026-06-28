import { _decorator, Component, Label, Node, Prefab, ProgressBar, Sprite, SpriteFrame, UITransform, instantiate } from 'cc';
const { ccclass, property } = _decorator;

const RewardNodePos = {
    x: 100,
    y: 354,
    scaleX: 0.4,
    scaleY: 0.4,
};

type ActivityKind = 'attack' | 'raid' | 'slot';

@ccclass('SlotActivityNode')
export class SlotActivityNode extends Component {
    @property(Node)
    public attackMaster: Node | null = null;
    @property(Node)
    public raidMaster: Node | null = null;
    @property(Node)
    public slotCollect: Node | null = null;
    @property(Node)
    public rewardPanel: Node | null = null;
    @property(Node)
    public vipRewardPanel: Node | null = null;
    @property(Node)
    public allRewardPanel: Node | null = null;
    @property(Node)
    public animHammerRank: Node | null = null;
    @property(Node)
    public animHammerBossRank: Node | null = null;
    @property(Prefab)
    public activityAdd: Prefab | null = null;
    @property(SpriteFrame)
    public bossRankIcon: SpriteFrame | null = null;
    @property(Node)
    public bossRankNode: Node | null = null;
    @property(Label)
    public bossRankCount: Label | null = null;

    public playAnim = false;
    public part1Anim = false;
    public playAnim1 = false;
    public playRewardAnim = false;
    public playSlotAllRewardsAni = false;
    public isShowCard = false;
    public activityMeta: any = null;
    public scActivityMeta: any = null;
    public gbActivityMeta: any = null;
    public userdata: any = null;
    public slotNode: any = null;
    public currentCount: number | null = null;
    public currentId: number | null = null;
    public collectRankScore: number | null = null;
    public bossRankScore: number | null = null;
    public addItemCom: any = null;
    public rewardReward: any = null;
    public rewardNewReward: any = null;
    public rewardLimt: any = null;
    public rewardNewLimt: any = null;
    public preOldTime: number | null = null;
    public currentAddItem: Node | null = null;
    public rewardCallback: (() => void) | null = null;
    public currentAllRewards: any[] = [];
    public chestCard: any[] = [];
    public oldAp = 0;
    public oldCoin = 0;

    start() {
    }

    hideAll() {
        this.playAnim = false;
        this.part1Anim = false;
        this.playAnim1 = false;
        this.playSlotAllRewardsAni = false;
        this.activityMeta = null;
        this.scActivityMeta = null;
        this.gbActivityMeta = null;
        this.setActive(this.attackMaster, false);
        this.setActive(this.raidMaster, false);
        this.setActive(this.slotCollect, false);
        this.setActive(this.rewardPanel, false);
        this.setActive(this.vipRewardPanel, false);
        this.setActive(this.allRewardPanel, false);
        this.currentCount = null;
        this.currentId = null;
        this.collectRankScore = null;
        this.bossRankScore = null;
        if (this.addItemCom?.node) this.addItemCom.node.destroy();
        this.addItemCom = null;
        this.rewardLimt = null;
        this.preOldTime = null;
        this.currentAddItem = null;
    }

    showActivity() {
        this.hideAll();
        this.slotNode = GamePlay.instance?.slotNode || null;
        this.updateActivity();
    }

    updateActivity() {
        if (!G.IsMergeTutorialFinished()) return;
        Game.ActivityManager.checkSubjectCard();

        if (this.activityMeta && !this.activityMeta.IsActive()) {
            this.hideAll();
        } else if (this.scActivityMeta && !this.scActivityMeta.IsActive()) {
            this.hideAll();
        }

        const meta = Game.ActivityManager.GetActiveSlotActivity();
        if (meta) {
            this.activityMeta = meta;
            this.currentAllRewards = [];
            if (meta.SubType() === Meta.ActivityMeta.SubTypes.AttackMaster) {
                this.showAttackMaster();
            } else if (meta.SubType() === Meta.ActivityMeta.SubTypes.RaidMaster) {
                this.showRaidMaster();
            } else if (meta.SubType() === Meta.ActivityMeta.SubTypes.SlotCollect) {
                this.showSlotCollect();
            }
        }

        this.part1Anim = !!this.playAnim;
        if (!this.part1Anim) this.updateActivity2();
        this.updateActivity3();
    }

    updateActivity2() {
        if (this.playSlotAllRewardsAni) return;
        const scmeta = Game.ActivityManager.GetActiveSlotCollectRankActivity();
        if (scmeta) {
            this.scActivityMeta = scmeta;
            this.updateCollectRank();
        }
    }

    updateActivity3() {
        if (this.playSlotAllRewardsAni) return;
        const gbmeta = Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Other, Meta.ActivityMeta.SubTypes.GuildBoss);
        if (gbmeta) {
            this.gbActivityMeta = gbmeta;
            this.updateBosstRank();
        }
    }

    showResultList() {
        this.ShowAllRewards();
    }

    checkActivity() {
        if ((this.activityMeta && !this.activityMeta.IsActive()) || (this.scActivityMeta && !this.scActivityMeta.IsActive())) {
            this.updateActivity();
        }
    }

    isAnim() {
        return this.playAnim || this.playAnim1 || this.playSlotAllRewardsAni;
    }

    showAttackMaster() {
        this.showMaster('attack');
    }

    showRaidMaster() {
        this.showMaster('raid');
    }

    showSlotCollect() {
        this.showMaster('slot');
    }

    initReward() {
        const itemHandle = this.rewardPanel;
        if (!itemHandle) return;
        const spReward = this.getNode(itemHandle, 'spReward');
        const spRewardFx = this.getNode(itemHandle, 'spRewardFx');
        const spBg = this.getNode(itemHandle, 'spBg');
        const spDes = this.getNode(itemHandle, 'spDes');
        const spBtn = this.getNode(itemHandle, 'spBtn');
        const vipNode = this.getNode(itemHandle, 'vipNode');
        const labelVipReward = this.getNode(itemHandle, 'labelVipReward')?.getComponent(Label);
        const spRewardAdd = this.getNode(itemHandle, 'Spriteconadd');

        if (spReward) {
            spReward.active = true;
            spReward.setPosition(RewardNodePos.x, RewardNodePos.y, spReward.position.z);
            spReward.setScale(RewardNodePos.scaleX, RewardNodePos.scaleY, spReward.scale.z);
        }
        this.setActive(spRewardFx, false);
        this.setActive(spRewardAdd, false);
        this.setActive(spBg, false);
        this.setActive(spDes, false);
        this.setActive(spBtn, false);
        this.setActive(vipNode, false);
        if (labelVipReward) labelVipReward.string = '';
        itemHandle.active = true;
    }

    stayReward() {
        if (!this.activityMeta) return;
        this.oldAp = Game.SUser.Ap();
        this.oldCoin = Game.SUser.Coin();
    }

    ShowReward(callback: (() => void) | null = null) {
        this.rewardCallback = callback;
        this.playAnim = true;
        this.playRewardAnim = true;
        if (!this.rewardReward) {
            this.ShowNext();
            return;
        }

        const labelVipReward = this.rewardPanel ? this.getNode(this.rewardPanel, 'labelVipReward')?.getComponent(Label) : null;
        if (labelVipReward) this.SetVipRewardLabel(labelVipReward, this.rewardReward);
    }

    ShowAllRewards() {
        if (!this.allRewardPanel || this.currentAllRewards.length === 0) return;
        const itemHandle = this.allRewardPanel;
        const spItem = this.getNode(itemHandle, 'spItem');
        const con = this.getNode(itemHandle, 'rewardCon');
        const vipCon = this.getNode(itemHandle, 'vipCon');
        const collectButton = this.getNode(itemHandle, 'collectButton');
        const vipNode = this.getNode(itemHandle, 'vipNode');
        if (!spItem || !con || !vipCon) return;

        if (GameMainWindow.instance) GameMainWindow.instance.hideUI();
        this.playSlotAllRewardsAni = true;
        itemHandle.active = true;
        if (collectButton) collectButton.active = true;
        con.removeAllChildren();
        vipCon.removeAllChildren();
        const isVip = Game.SUserStatus.IsVip();
        vipNode && (vipNode.active = isVip);
        vipCon.active = isVip;

        this.chestCard = [];
        this.currentAllRewards.forEach((content) => {
            this.addContentItem(spItem, con, content);
            if (content.Type && content.Type() === Game.Content.Types.CardChest) this.chestCard.push(content.Id());
            if (isVip) {
                const vipReward = this.GetVipReward(content);
                this.addContentItem(spItem, vipCon, vipReward);
                if (vipReward.Type && vipReward.Type() === Game.Content.Types.CardChest) this.chestCard.push(vipReward.Id());
            }
        });
    }

    ShowRewardNoAnim(callback: (() => void) | null = null) {
        this.rewardCallback = callback;
        if (this.rewardReward) this.currentAllRewards.push(Game.Content.FromContent(this.rewardReward));
        if (this.rewardLimt && this.shouldIncludeLimitReward()) this.currentAllRewards.push(Game.Content.FromContent(this.rewardLimt));
        this.ShowNext(0.1);
    }

    GetRewardOk1() {
        if (this.playRewardAnim || this.isShowCard) return;
        this.onCardShowComplete();
    }

    onCardShowComplete() {
        let apCount = 0;
        let coinCount = 0;
        while (this.currentAllRewards.length > 0) {
            const content = this.currentAllRewards.shift();
            const fReward = this.GetAfterVipReward(content);
            if (fReward.Type() === Game.Content.Types.Ap) {
                apCount += fReward.Count();
            } else if (fReward.Type() === Game.Content.Types.Coin) {
                coinCount += fReward.Count();
            }
        }

        if (apCount > 0 && GamePlay.instance) {
            GamePlay.instance.slotNode.showStoreAddSpinAnim(apCount);
            this.oldAp += apCount;
            this.scheduleOnce(() => {
                if (GamePlay.instance) GamePlay.instance.slotNode.userinfo.stopApAt(this.oldAp);
            }, 1.5);
        }

        if (coinCount > 0 && GameMainWindow.instance) {
            GameMainWindow.instance.playAddCoinAnim();
            GameMainWindow.instance.scheduleOnce(() => {
                GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin + coinCount, 0.8);
                this.oldCoin += coinCount;
            }, 1);
        }

        if (GameMainWindow.instance) GameMainWindow.instance.showUI();
        this.isShowCard = false;
        this.playSlotAllRewardsAni = false;
        this.setActive(this.allRewardPanel, false);
        this.updateActivity2();
        this.updateActivity3();
    }

    onCardShowOver() {
        this.onCardShowComplete();
    }

    GetRewardOk() {
        if (this.playRewardAnim) return;
        const fReward = this.GetAfterVipReward(this.rewardReward);
        if (!fReward) {
            this.ShowNext();
            return;
        }

        if (this.rewardLimt && this.shouldIncludeLimitReward() && fReward.type === this.rewardLimt.type) {
            fReward.count += this.rewardLimt.count;
        }

        if (fReward.Type() === Game.Content.Types.Ap && GamePlay.instance) {
            GamePlay.instance.slotNode.showSpinAddNumAnim(fReward.Count(), true);
            this.oldAp += fReward.Count();
            this.scheduleOnce(() => {
                if (GamePlay.instance) GamePlay.instance.slotNode.userinfo.stopApAt(this.oldAp);
            }, 1.5);
        } else if (fReward.Type() === Game.Content.Types.Coin && GameMainWindow.instance) {
            GameMainWindow.instance.playAddCoinAnim();
            GameMainWindow.instance.scheduleOnce(() => {
                GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin + fReward.Count(), 0.8);
                this.oldCoin += fReward.Count();
            }, 1);
        }

        this.ShowNext(0.1);
    }

    ShowNext(animTime = 0.1) {
        if (!this.rewardNewReward) {
            this.playRewardAnim = false;
            this.playAnim = false;
            if (this.rewardCallback) this.rewardCallback();
            return;
        }

        const rewardNode = this.rewardPanel ? this.getNode(this.rewardPanel, 'rewardNode')?.getComponent('ContentModel') as any : null;
        const labelVipReward = this.rewardPanel ? this.getNode(this.rewardPanel, 'labelVipReward')?.getComponent(Label) : null;
        if (rewardNode?.show) rewardNode.show(this.rewardNewReward);
        if (labelVipReward) this.SetVipRewardLabel(labelVipReward, this.rewardNewReward);

        this.scheduleOnce(() => {
            if (this.rewardCallback) this.rewardCallback();
            this.playAnim = false;
            this.playRewardAnim = false;
            if (this.addItemCom?.setIconContent) this.addItemCom.setIconContent(this.rewardNewLimt);
            if (this.currentAddItem) {
                this.currentAddItem.active = true;
                const enterCloseAnim = this.currentAddItem.getComponent('EnterCloseAnim') as any;
                if (enterCloseAnim?.enterAnim) enterCloseAnim.enterAnim();
            }
        }, animTime);
    }

    SetVipRewardLabel(labelVipReward: Label, content: any) {
        if (!Game.SUserStatus.IsVip() || !content) {
            labelVipReward.string = '';
            return;
        }

        if (content.Type() === Game.Content.Types.Ap) {
            labelVipReward.string = '+ ' + BigNumber.format(Math.floor(content.Count() * G.GameConstance.vipSlotActivityAdd));
        } else if (content.Type() === Game.Content.Types.Coin) {
            labelVipReward.string = '+ ' + BigNumber.format(Game.Content.RoundCoin(content.Count() * G.GameConstance.vipSlotActivityAdd));
        } else {
            labelVipReward.string = '';
        }
    }

    GetAfterVipReward(reward: any) {
        if (!reward || !Game.SUserStatus.IsVip()) return reward;
        const vipReward = Game.Content.FromContent(reward);
        if (vipReward.Type() === Game.Content.Types.Ap) {
            vipReward.SetCount(vipReward.Count() + Math.floor(vipReward.Count() * G.GameConstance.vipSlotActivityAdd));
        } else if (vipReward.Type() === Game.Content.Types.Coin) {
            vipReward.SetCount(vipReward.Count() + Game.Content.RoundCoin(vipReward.Count() * G.GameConstance.vipSlotActivityAdd));
        }
        return vipReward;
    }

    GetVipReward(reward: any) {
        if (!reward || !Game.SUserStatus.IsVip()) return reward;
        const vipReward = Game.Content.FromContent(reward);
        if (vipReward.Type() === Game.Content.Types.Ap) {
            vipReward.SetCount(Math.floor(vipReward.Count() * G.GameConstance.vipSlotActivityAdd));
        } else if (vipReward.Type() === Game.Content.Types.Coin) {
            vipReward.SetCount(Game.Content.RoundCoin(vipReward.Count() * G.GameConstance.vipSlotActivityAdd));
        }
        return vipReward;
    }

    ShowVipReward(animTime = 0.1) {
        if (!this.vipRewardPanel || !this.rewardReward) return;
        const rewardNode = this.getNode(this.vipRewardPanel, 'rewardNode')?.getComponent('ContentModel') as any;
        if (rewardNode?.show) rewardNode.show(this.GetVipReward(this.rewardReward));
        this.scheduleOnce(() => {
            if (this.vipRewardPanel) this.vipRewardPanel.active = true;
            GameKit.SoundManager.playSound('chest_card');
        }, animTime);
    }

    GetVipOk() {
        this.setActive(this.vipRewardPanel, false);
        this.ShowNext();
    }

    updateBosstRank() {
        let add = SR.SRGuild.BossCount;
        if (!this.animHammerBossRank || !this.bossRankNode || !this.bossRankCount || add <= 0) return;
        const sprite = this.animHammerBossRank.getComponent(Sprite);
        if (sprite) sprite.spriteFrame = CommonAssets.instance.bossRankIcon || this.bossRankIcon;
        this.fitSpriteInRange(this.animHammerBossRank);
        add = Math.min(add, 10);
        this.bossRankCount.string = 'X' + add;
        this.playAnim1 = true;

        const enterCloseAnim = this.bossRankNode.getComponent('EnterCloseAnim') as any;
        const finish = () => {
            SR.SRGuild.BossCount = 0;
            this.playAnim1 = false;
            if (this.bossRankNode) this.bossRankNode.active = false;
        };
        this.bossRankNode.active = true;
        if (enterCloseAnim?.enterAnim && enterCloseAnim?.closeAnim) {
            enterCloseAnim.enterAnim(() => enterCloseAnim.closeAnim(finish));
        } else {
            this.scheduleOnce(finish, 0.2);
        }
    }

    updateCollectRank() {
        if (!this.scActivityMeta) return;
        const rankData = Game.SUserActivity.GetSymbolRankData();
        if (this.collectRankScore == null) {
            if (!rankData.activityId || rankData.activityId !== this.scActivityMeta.Id()) {
                this.collectRankScore = 0;
            } else {
                this.collectRankScore = rankData.rank[Game.SUser.UserId()].score;
            }

            const symbolId = this.scActivityMeta.Param().symbolId || this.scActivityMeta.Param().showSymbolId;
            const sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString());
            const sprite = this.animHammerRank?.getComponent(Sprite);
            if (sprite) sprite.spriteFrame = sp;
            if (this.animHammerRank) this.fitSpriteInRange(this.animHammerRank);
            return;
        }

        const newScore = rankData.rank[Game.SUser.UserId()].score;
        const add = newScore - this.collectRankScore;
        if (add <= 0 || !GameMainWindow.instance) return;
        const oldCollectRankScore = this.collectRankScore;
        this.collectRankScore = newScore;
        this.playAnim = true;

        this.scheduleOnce(() => {
            const actBarNode = GameMainWindow.instance.slotCollectRankActivityBar?.children?.[0];
            const actBar = actBarNode?.getComponent('ActivityBarNode') as any;
            if (oldCollectRankScore === 0) {
                UIRoot.instance.openChildWindow('ActivitySlotSymbolRankWindow', {
                    showCallback: (wnd: any) => {
                        this.playAnim = true;
                        wnd.addOnCloseFunc(() => {
                            this.playAnim = false;
                        });
                        if (actBar?.playAmin) actBar.playAmin(this.scActivityMeta, oldCollectRankScore, () => {});
                    },
                });
            } else if (actBar?.playAmin) {
                actBar.playAmin(this.scActivityMeta, oldCollectRankScore, () => {
                    this.playAnim = false;
                });
            } else {
                this.playAnim = false;
            }
        }, 0.2);
    }

    private showMaster(kind: ActivityKind) {
        if (!this.activityMeta) return;
        const config = this.getActivityConfig(kind);
        const root = config.node;
        if (!root) return;

        this.userdata = Game.SUserActivity.GetActivityData(this.activityMeta.Id()) || {};
        const currentCount = this.userdata.currentCount || 0;
        const currentId = this.userdata.currentId || 1;
        const currentNeed = Meta.ActivityParamsMeta.GetValue(config.needType, currentId);
        const currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(config.rewardType, currentId)).Contents()[0];
        let currentGetLimt = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(config.limitRewardType, currentId));
        if (currentGetLimt) currentGetLimt = currentGetLimt.Contents()[0];

        if ((!this.currentId || this.currentId === currentId) && (!this.currentCount || this.currentCount === currentCount) && currentId === config.maxId && currentCount === currentNeed) {
            root.active = false;
            return;
        }

        this.initReward();
        const labelProgress = this.getNode(root, 'labelProgressNode')?.getComponent(Label);
        const spProgress = this.getNode(root, 'spProgressNode')?.getComponent(ProgressBar);
        const spSymbol = this.getComponentFromTable(root, 'spSymbol', Sprite);
        const animHammer = this.getNode(root, 'animHammer');
        const rewardNode = this.rewardPanel ? this.getNode(this.rewardPanel, 'rewardNode')?.getComponent('ContentModel') as any : null;
        const rewardNodeAdd = this.rewardPanel ? this.getNode(this.rewardPanel, 'Spriteconadd')?.getComponent('ContentModel') as any : null;
        const addItem = this.getNode(root, 'activityAttackMasterAdd');

        if (kind === 'slot') {
            const symbolId = this.activityMeta.Param().symbolId || this.activityMeta.Param().showSymbolId;
            const sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString());
            if (spSymbol) spSymbol.spriteFrame = sp;
            const hammerSprite = animHammer?.getComponent(Sprite);
            if (hammerSprite) hammerSprite.spriteFrame = sp;
            if (spSymbol?.node) this.fitByHeight(spSymbol.node, 50);
            if (animHammer) this.fitByHeight(animHammer);
        }

        const symbolNode = spSymbol?.node;
        if (symbolNode) {
            symbolNode.targetOff(this);
            symbolNode.on('click', () => {
                if (!G.IsMergeTutorialFinished()) return;
                if (GamePlay.instance.isBusy()) return;
                UIRoot.instance.openChildWindow('ActivitySlotSymbolPreviewWindow', { meta: this.activityMeta, showCallback: () => {} });
            }, this);
        }

        if (labelProgress) labelProgress.string = currentCount.toString() + ' / ' + currentNeed;
        if (spProgress) spProgress.progress = currentNeed ? currentCount / currentNeed : 0;
        if (rewardNode?.show) rewardNode.show(currentGet);
        if (rewardNodeAdd?.show) rewardNodeAdd.show(currentGetLimt);

        this.rewardReward = currentGet;
        this.rewardLimt = currentGetLimt;
        this.preOldTime = this.userdata.limitedTime || 0;
        this.currentAddItem = addItem;
        this.currentCount = currentCount;
        this.currentId = currentId;
        root.active = true;

        if (addItem && this.activityAdd) {
            if (!this.addItemCom) {
                const tempAddItem = instantiate(this.activityAdd);
                tempAddItem.parent = addItem;
                tempAddItem.setPosition(0, 0, tempAddItem.position.z);
                tempAddItem.active = true;
                this.addItemCom = tempAddItem.getComponent('ActivityAttackMasterAdd');
            }
            if (kind === 'attack' && this.addItemCom?.setAttackMeta) this.addItemCom.setAttackMeta(this.activityMeta);
            if (kind === 'raid' && this.addItemCom?.setRaidMeta) this.addItemCom.setRaidMeta(this.activityMeta);
            if (kind === 'slot' && this.addItemCom?.setSlotCollectMeta) this.addItemCom.setSlotCollectMeta(this.activityMeta);
        }
    }

    private getActivityConfig(kind: ActivityKind) {
        if (kind === 'attack') {
            return {
                node: this.attackMaster,
                needType: Meta.ActivityParamsMeta.Types.AttackMaster,
                rewardType: Meta.ActivityParamsMeta.Types.AttackMasterReward,
                limitRewardType: Meta.ActivityParamsMeta.Types.AttackMasterLimitedReward,
                maxId: Game.ActivityManager.Constance.attackMasterMaxId,
            };
        }
        if (kind === 'raid') {
            return {
                node: this.raidMaster,
                needType: Meta.ActivityParamsMeta.Types.RaidMaster,
                rewardType: Meta.ActivityParamsMeta.Types.RaidMasterReward,
                limitRewardType: Meta.ActivityParamsMeta.Types.RaidMasterLimitedReward,
                maxId: Game.ActivityManager.Constance.raidMasterMaxId,
            };
        }
        return {
            node: this.slotCollect,
            needType: Meta.ActivityParamsMeta.Types.SlotCollect,
            rewardType: Meta.ActivityParamsMeta.Types.SlotCollectReward,
            limitRewardType: Meta.ActivityParamsMeta.Types.SlotCollectLimitedReward,
            maxId: Game.ActivityManager.Constance.slotCollectMaxId,
        };
    }

    private getNode(root: Node, name: string): Node | null {
        return (GameKit.ControllerTable.GetNode(root, name) as Node) || null;
    }

    private getComponentFromTable<T extends Component>(root: Node, name: string, ctor: new (...args: any[]) => T): T | null {
        return (GameKit.ControllerTable.GetComponent(root, name, ctor) as T) || null;
    }

    private addContentItem(template: Node, parent: Node, content: any) {
        const newItem = instantiate(template);
        newItem.parent = parent;
        newItem.active = true;
        const contentModel = newItem.getComponent('ContentModel') as any;
        if (contentModel?.show) contentModel.show(content);
    }

    private shouldIncludeLimitReward() {
        return !!(this.slotNode && this.preOldTime != null && this.slotNode.oldTimeLimt < this.preOldTime && this.addItemCom?.node?.active);
    }

    private fitByHeight(node: Node, height = 50) {
        const transform = node.getComponent(UITransform);
        if (!transform || transform.height === 0) return;
        const scale = height / transform.height;
        node.setScale(scale, scale, node.scale.z);
    }

    private fitSpriteInRange(node: Node) {
        const transform = node.getComponent(UITransform);
        if (!transform) return;
        const max = Math.max(transform.width, transform.height);
        if (max <= 0) return;
        const scale = Math.min(1, 80 / max);
        node.setScale(scale, scale, node.scale.z);
    }

    private setActive(node: Node | null, active: boolean) {
        if (node) node.active = active;
    }
}
