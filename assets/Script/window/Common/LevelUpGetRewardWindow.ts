import { _decorator, instantiate, isValid, Label, Layout, Node, RichText, ScrollView, sp, Sprite, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import LevelUpDisplayLock from '../../game/user/LevelUpDisplayLock';

const { ccclass, property } = _decorator;

const poses: Record<number, number[]> = {
    1: [0],
    2: [-120, 120],
    3: [-160, 0, 160],
};
const rewardLayouts: Record<number, { positions: number[]; scale: number }> = {
    1: { positions: [0], scale: 1 },
    2: { positions: [-120, 120], scale: 1 },
    3: { positions: [-160, 0, 160], scale: 1 },
    4: { positions: [-210, -70, 70, 210], scale: 0.75 },
};

@ccclass('LevelUpGetRewardWindow')
export default class LevelUpGetRewardWindow extends UIWindow {
    public static windowPath = 'Common/LevelUpGetRewardWindow';

    @property(Node)
    item: Node | null = null;

    @property(Node)
    SpineOk: Node | null = null;

    @property(Node)
    SpineBg: Node | null = null;

    @property(RichText)
    labelDes: RichText | null = null;

    @property(Label)
    labelLV: Label | null = null;

    @property(ScrollView)
    rewardScroll: ScrollView | null = null;

    oldCoin: any = null;
    oldAp: any = null;
    noChest: any = null;
    chestCard: any[] = [];
    randomPackChest: any[] = [];
    _icons: Sprite[] = [];
    _delayedSpineShowCallback: (() => void) | null = null;
    _spinePlayTokens: Record<string, number> = {};
    _levelBoneSkeleton: sp.Skeleton | null = null;
    _levelBone: any = null;
    _levelBoneLabelNode: Node | null = null;
    showParams: any = null;
    _levelRewardFlowFinished = false;
    _closingLevelRewardFlow = false;
    _waitingLevelRewardChest = false;
    _releaseLevelLockAfterRewardFly = false;
    _levelRewardFlowToken = 0;
    _rewardItems: Node[] = [];
    _rewardContents: any[] = [];

    private fitByHeight(sprite: Sprite, height: number) {
        const spriteFrame = sprite.spriteFrame;
        if (!spriteFrame || height <= 0) return;
        const rect = spriteFrame.rect;
        if (!rect.height) return;
        const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
        transform.setContentSize(rect.width * height / rect.height, height);
    }

    private updateSkeletonWorldTransform(skeleton: sp.Skeleton | null) {
        const runtimeSkeleton: any = skeleton;
        if (runtimeSkeleton && runtimeSkeleton.updateWorldTransform) {
            runtimeSkeleton.updateWorldTransform();
        }
    }

    onShow(showParams: any) {
        this._levelRewardFlowToken++;
        this.showParams = showParams || {};
        this._levelRewardFlowFinished = false;
        this._closingLevelRewardFlow = false;
        this._waitingLevelRewardChest = false;
        this._releaseLevelLockAfterRewardFly = false;
        UIRoot.instance.closeChildWindow('GetRewardWindow');
        if (GameKit.SoundManager && GameKit.SoundManager.playNewAreaUnlockSound) {
            GameKit.SoundManager.playNewAreaUnlockSound();
        }
        this.prepareSpineShow(this.SpineOk);
        this.prepareSpineShow(this.SpineBg);
        let contents = this.showParams.contents || [];
        contents = Game.Content.Merge(contents);
        this.oldCoin = this.showParams.oldCoin;
        this.noChest = this.showParams.noChest;

        if (!this.item || !this.labelDes || !this.labelLV) return;
        this.item.active = false;
        this.clearRewardItems();

        let rewardStr = '';
        let count = contents.length;
        const rewardLayout = rewardLayouts[Math.min(4, Math.max(1, count))];
        const rewardScroll = this.getRewardScrollView();
        const useRewardScroll = !!(count > 4 && rewardScroll?.content);
        if (rewardScroll) rewardScroll.node.active = useRewardScroll;
        this.labelLV.string = String(LevelUpDisplayLock.GetLevelWindowText(this.showParams, Game.SUser));
        this.attachLevelLabelToSpineBg();
        this.playShowSpinesAfterWindowEnter();
        /*let addAps = 0
        let addCoins = 0
        contents.forEach(reward => {
            if (reward.Type() == Game.Content.Types.Ap) {
                addAps += reward.Count()
            } else if (reward.Type() == Game.Content.Types.Coin) {
                addCoins += reward.Count()
            }
        })
        if (addCoins > 0 && GameMainWindow.instance) {
            this.oldCoin = Game.SUser.Coin() - addCoins
            GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin, 0)
        }
        if (addAps > 0 && GamePlay.instance.slotNode) {
            this.oldAp = Game.SUser.Ap() - addAps
            GamePlay.instance.slotNode.getComponent("UserInfoModel").stopApAt(this.oldAp)
        }*/
        this.chestCard = [];
        this.randomPackChest = [];

        this._icons = [];
        this._rewardItems = [];
        this._rewardContents = [];
        for (let i = 0; i < count; i++) {
            let content = Game.Content.FromContent(contents[i]);
            let newItem = instantiate(this.item);
            if (useRewardScroll && rewardScroll?.content) {
                newItem.parent = rewardScroll.content;
                newItem.setScale(this.item.scale.x * rewardLayouts[4].scale, this.item.scale.y * rewardLayouts[4].scale, this.item.scale.z);
                newItem.setPosition(0, 0, newItem.position.z);
            } else {
                newItem.parent = this.item.parent;
                newItem.setScale(this.item.scale.x * rewardLayout.scale, this.item.scale.y * rewardLayout.scale, this.item.scale.z);
                const lastPosition = rewardLayout.positions[rewardLayout.positions.length - 1];
                const x = i < rewardLayout.positions.length ? rewardLayout.positions[i] : lastPosition + 140 * (i - rewardLayout.positions.length + 1);
                newItem.setPosition(x, newItem.position.y, newItem.position.z);
            }
            newItem.active = true;
            this._rewardItems.push(newItem);
            this._rewardContents.push(content);

            let newIcon = GameKit.ControllerTable.GetComponent(newItem, 'icon', Sprite);
            let newCount = GameKit.ControllerTable.GetComponent(newItem, 'count', Label);
            content.Icon(newIcon, () => {
                this.fitByHeight(newIcon, 125);
            });
            this._icons.push(newIcon);
            newCount.string = GameKit.StringUtil.formatNumber(content.Count());
            if (content.Type() == Game.Content.Types.CardChest) {
                this.chestCard.push(content.Id());
            } else if (content.Type() == Game.Content.Types.RandomPack) {
                this.randomPackChest.push(content.Id());
            }

            let nameadd = '';
            if (i != 0) {
                if (i == count - 1) nameadd = ' ' + GameKit.i18n.t('and') + ' ';
                else nameadd = ', ';
            }
            rewardStr += nameadd + content.ColorCode() + content.Name() + '</color>';
        }

        if (useRewardScroll && rewardScroll?.content) {
            rewardScroll.content.getComponent(Layout)?.updateLayout();
            rewardScroll.scrollToLeft(0);
        }

        this.labelDes.string = String.format(GameKit.i18n.t('GetRewardWindowDes'), rewardStr);

        GameKit.BackKeyManager.registerBackEvent();

        GameKit.SoundManager.playSound('slot_item_win');
    }

    getRewardScrollView() {
        if (this.rewardScroll && isValid(this.rewardScroll.node)) return this.rewardScroll;
        const scrollNode = this.item?.parent?.getChildByName('rewardScroll');
        return scrollNode?.getComponent(ScrollView) || null;
    }

    clearRewardItems() {
        this._rewardItems.forEach(item => {
            if (!isValid(item)) return;
            item.removeFromParent();
            item.destroy();
        });
        this._rewardItems = [];
        this._rewardContents = [];
    }

    prepareSpineShow(spineNode: Node | null) {
        if (!spineNode) return;

        let skeleton = spineNode.getComponent(sp.Skeleton);
        if (!skeleton) return;

        if (skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }
        if (skeleton.clearTracks) {
            skeleton.clearTracks();
        }
        if (skeleton.setToSetupPose) {
            skeleton.setToSetupPose();
        }
    }

    playShowSpinesAfterWindowEnter() {
        this.clearDelayedSpineShow();

        let delay = this.getWindowEnterVisibleDelay();
        this._delayedSpineShowCallback = () => {
            this._delayedSpineShowCallback = null;
            if (!isValid(this.node)) return;
            this.playShowThenIdle(this.SpineOk);
            this.playShowThenIdle(this.SpineBg);
        };

        this.scheduleOnce(this._delayedSpineShowCallback, delay);
    }

    getWindowEnterVisibleDelay() {
        let enterAnim: any = this.node.getComponent('EnterCloseAnim');
        if (!enterAnim || !enterAnim.enabled || !enterAnim.e_playAwake || enterAnim.enterAnimType === 0) return 0;
        return enterAnim.e_DelayTime || 0;
    }

    clearDelayedSpineShow() {
        if (!this._delayedSpineShowCallback) return;
        this.unschedule(this._delayedSpineShowCallback);
        this._delayedSpineShowCallback = null;
    }

    playShowThenIdle(spineNode: Node | null) {
        if (!spineNode) return;

        let skeleton = spineNode.getComponent(sp.Skeleton);
        if (!skeleton) return;

        let tokenKey = this.getSpinePlayTokenKey(spineNode);
        let playToken = (this._spinePlayTokens[tokenKey] || 0) + 1;
        this._spinePlayTokens[tokenKey] = playToken;

        if (skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }
        if (skeleton.clearTracks) {
            skeleton.clearTracks();
        }
        if (skeleton.setToSetupPose) {
            skeleton.setToSetupPose();
        }

        if (skeleton.findAnimation && !skeleton.findAnimation('show')) {
            this.playSpineIdle(skeleton);
            return;
        }

        let trackEntry = null;
        try {
            trackEntry = skeleton.setAnimation(0, 'show', false);
        } catch (e) {
            this.playSpineIdle(skeleton);
            return;
        }

        let finished = false;
        let switchToIdle = () => {
            if (finished) return;
            if (this._spinePlayTokens[tokenKey] !== playToken) return;
            finished = true;
            if (!isValid(this.node) || !isValid(spineNode)) return;
            if (skeleton.setCompleteListener) {
                skeleton.setCompleteListener(null);
            }
            this.playSpineIdle(skeleton);
        };

        if (skeleton.setTrackCompleteListener && trackEntry) {
            skeleton.setTrackCompleteListener(trackEntry, switchToIdle);
        } else {
            this.scheduleOnce(switchToIdle, this.getSpineAnimationDuration(skeleton, 'show', 1.6));
        }
    }

    getSpinePlayTokenKey(spineNode: Node) {
        return spineNode.uuid || spineNode.name;
    }

    playSpineIdle(skeleton: sp.Skeleton | null) {
        if (!skeleton) return;
        if (skeleton.findAnimation && !skeleton.findAnimation('idle')) return;
        skeleton.setAnimation(0, 'idle', true);
    }

    getSpineAnimationDuration(skeleton: sp.Skeleton | null, animName: string, defaultDuration: number) {
        if (!skeleton || !skeleton.findAnimation) return defaultDuration;
        let anim = skeleton.findAnimation(animName);
        if (anim && anim.duration > 0) return anim.duration;
        return defaultDuration;
    }

    attachLevelLabelToSpineBg() {
        this._levelBoneSkeleton = null;
        this._levelBone = null;
        this._levelBoneLabelNode = null;

        if (!this.SpineBg || !this.labelLV || !this.labelLV.node) return;
        let skeleton = this.SpineBg.getComponent(sp.Skeleton);
        if (!skeleton || !skeleton.findBone) return;

        this.updateSkeletonWorldTransform(skeleton);

        let bone = skeleton.findBone('Level');
        if (!bone) return;

        this._levelBoneSkeleton = skeleton;
        this._levelBone = bone;
        this._levelBoneLabelNode = this.labelLV.node;
        this._levelBoneLabelNode.active = true;
        this.updateLevelLabelPosition();
    }

    updateLevelLabelPosition() {
        if (!this._levelBoneSkeleton || !this._levelBone || !this._levelBoneLabelNode || !this.SpineBg) return;
        if (!isValid(this.SpineBg) || !isValid(this._levelBoneLabelNode)) return;
        if (!this._levelBoneLabelNode.parent) return;

        this.updateSkeletonWorldTransform(this._levelBoneSkeleton);

        let bonePos = new Vec3(this._levelBone.worldX || 0, this._levelBone.worldY || 0, 0);
        let worldPos = this.SpineBg.getComponent(UITransform)!.convertToWorldSpaceAR(bonePos);
        let localPos = this._levelBoneLabelNode.parent.getComponent(UITransform)!.convertToNodeSpaceAR(worldPos);
        this._levelBoneLabelNode.setPosition(localPos);
    }

    findLevelBone(skeleton: any) { try { this.updateSkeletonWorldTransform(skeleton); return skeleton?.findBone?.('Level') || null; } catch { return null; } }
    getLevelBonePosition(bone: any) { return bone ? new Vec3(bone.worldX || 0, bone.worldY || 0, 0) : null; }
    playMergeRewardsToBoardButton(done: () => void) { this.createMergeRewardFlyPlan(plan => this.playMergeRewardFlyPlan(plan, done)); }
    getMergeRewards(rewards: any[]) { return (rewards || []).map(value => Game.Content.FromContent(value)).filter(value => value && (value.Type() === Game.Content.Types.MergeIcon || value.Type() === Game.Content.Types.NewGiftPack)); }
    getLevelRewardFlyFromNode(contentType?: any) {
        if (contentType != null) {
            for (let i = 0; i < this._rewardContents.length; i++) {
                const content = this._rewardContents[i];
                const item = this._rewardItems[i];
                let type = content?.Type();
                if (type === Game.Content.Types.ShopCoin) type = Game.Content.Types.Coin;
                if (type === contentType && item && isValid(item) && item.active) return item;
            }
        }
        return this._rewardItems.find(item => isValid(item) && item.active) || this.node;
    }
    getMergeBoardButtonNode() { return GameMainWindow.instance?.node?.getChildByPath?.('town/merge') || null; }
    getRewardIconFrame(reward: any, done: (frame: any) => void) { const node = new Node('level_reward_fly_icon'); const sprite = node.addComponent(Sprite); reward.Icon(sprite, () => { done(sprite.spriteFrame); node.destroy(); }); }

    clearLevelLabelBone() {
        this._levelBoneSkeleton = null;
        this._levelBone = null;
        this._levelBoneLabelNode = null;
    }

    clearSpineCompleteListeners() {
        let spineNodes = [this.SpineOk, this.SpineBg];
        spineNodes.forEach(spineNode => {
            if (!spineNode) return;
            let tokenKey = this.getSpinePlayTokenKey(spineNode);
            this._spinePlayTokens[tokenKey] = (this._spinePlayTokens[tokenKey] || 0) + 1;
            let skeleton = spineNode.getComponent(sp.Skeleton);
            if (skeleton && skeleton.setCompleteListener) {
                skeleton.setCompleteListener(null);
            }
        });
    }

    onShowBack(showParams: any) {
        this.onShow(showParams);
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
        this.clearDelayedSpineShow();
        this.clearSpineCompleteListeners();
        this.clearLevelLabelBone();

        this._icons.forEach(x => { cce.releaseSpriteFrame(x); });
        if (!this._releaseLevelLockAfterRewardFly) {
            this.finishLevelRewardFlow();
        }
        if (Game.MergeTutorialManager?.ScheduleTriggerStartRetry) {
            Game.MergeTutorialManager.ScheduleTriggerStartRetry(0);
        }
    }

    lateUpdate() {
        this.updateLevelLabelPosition();
    }

    close_window() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('level_reward_button');
        }
        if (this._closingLevelRewardFlow || this._waitingLevelRewardChest) return;
        if (this.chestCard.length > 0) {
            if (!this.noChest) {
                this._waitingLevelRewardChest = true;
                const chestId = this.chestCard[0];
                if (CardChestOpenWindow.tryShow(() => {
                    this._waitingLevelRewardChest = false;
                    this.continueCloseAfterChest();
                }, chestId)) {
                    this.chestCard.shift();
                    return;
                }
                this._waitingLevelRewardChest = false;
            }
        } else if (this.randomPackChest.length > 0) {
            if (!this.noChest) {
                this._waitingLevelRewardChest = true;
                if (CardChestOpenWindow.tryShow(() => {
                    this._waitingLevelRewardChest = false;
                    this.continueCloseAfterChest();
                })) {
                    this.randomPackChest = [];
                    return;
                }
                this._waitingLevelRewardChest = false;
            }
        }
        this.continueCloseAfterChest();

        /*if (this.oldCoin != null && GameMainWindow.instance) {
            GameMainWindow.instance.playAddCoinAnim()
            GameMainWindow.instance.scheduleOnce(() => {
                GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, Game.SUser.Coin(), 0.8)
            }, 1)
        }
        if (this.oldAp != null && GamePlay.instance.slotNode) {
            let slot = GamePlay.instance.slotNode
            slot.isSpining = true
            slot.getComponent("UserInfoModel").playApAnim(function(){
                slot.makeIdle()
            })
            slot.showSpinAddNumAnim(Game.SUser.Ap() - this.oldAp)
        }*/
    }

    private continueCloseAfterChest() {
        if (this._closingLevelRewardFlow) return;
        this._closingLevelRewardFlow = true;
        const flowState = { token: this._levelRewardFlowToken, rewardDoneCallback: this.showParams?.rewardDoneCallback, finished: false };
        this.createMergeRewardFlyPlan((plan: any) => {
            if (flowState.token !== this._levelRewardFlowToken) return;
            this._releaseLevelLockAfterRewardFly = true;
            this.closeAnim(() => this.playMergeRewardFlyPlan(plan, () => this.finishLevelRewardFly(flowState, 'animation')));
        });
    }

    private createMergeRewardFlyPlan(done: (plan: any) => void) {
        const rewards = LevelUpDisplayLock.GetRewards() || [];
        const mergeRewards = this.getMergeRewards(rewards);
        const resourceRewards = this.getTopResourceRewards(rewards);
        if (!mergeRewards.length && !resourceRewards.length) return done(null);

        const fromNode = this.getLevelRewardFlyFromNode();
        const targetNode = mergeRewards.length ? this.getMergeBoardButtonNode() : null;
        const plan: any = {
            fromWorldPos: fromNode?.worldPosition.clone() || null,
            toWorldPos: targetNode?.worldPosition.clone() || null,
            entries: [],
            resourceRewards,
            resourceFromWorldPos: {},
        };
        resourceRewards.forEach(reward => {
            let type = reward.Type();
            if (type === Game.Content.Types.ShopCoin) type = Game.Content.Types.Coin;
            if (plan.resourceFromWorldPos[type]) return;
            plan.resourceFromWorldPos[type] = this.getLevelRewardFlyFromNode(type)?.worldPosition.clone() || plan.fromWorldPos;
        });
        if (!fromNode || !targetNode || !mergeRewards.length) return done(plan);

        let index = 0;
        const next = () => {
            if (index >= mergeRewards.length) return done(plan);
            const reward = mergeRewards[index++];
            const holder = new Node('level_reward_fly_icon');
            const sprite = holder.addComponent(Sprite);
            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                if (sprite.spriteFrame) plan.entries.push({ spriteFrame: sprite.spriteFrame, count: Math.max(1, Math.min(8, Math.ceil(reward.Count?.() || reward.count || 1))) });
                holder.destroy();
                next();
            };
            reward.Icon(sprite, finish);
            if (sprite.spriteFrame) finish();
        };
        next();
    }

    private playMergeRewardFlyPlan(plan: any, done: () => void) {
        const player = GameMainWindow.instance?.coinFlyToTargetAnim;
        if (!plan) return done?.();
        const playResources = () => this.playLevelResourceRewardFlies(plan, done);
        if (!plan.entries?.length || !plan.fromWorldPos || !plan.toWorldPos || !player?.PlayCollectAnim) return playResources();
        let index = 0;
        const next = () => {
            if (index >= plan.entries.length) return playResources();
            const entry = plan.entries[index++];
            player.PlayCollectAnim(entry.spriteFrame, plan.fromWorldPos, plan.toWorldPos, entry.count, next);
        };
        next();
    }

    playLevelResourceRewardFlies(plan: any, done?: () => void) {
        if (!plan?.resourceRewards?.length) {
            LevelUpDisplayLock.Release();
            return done?.();
        }
        const userInfo = typeof GameMainWindow !== 'undefined' ? GameMainWindow.instance?.userinfo : null;
        const resourcePlans = this.prepareLevelResourceNumAnims(userInfo, plan.resourceRewards);
        if (!userInfo?.playResourceGainAnim || !resourcePlans.length) return done?.();

        let index = 0;
        const playNext = () => {
            if (index >= resourcePlans.length) return done?.();
            const resourcePlan = resourcePlans[index++];
            userInfo.playResourceGainAnim(resourcePlan.contentType, {
                ...resourcePlan,
                fromWorldPos: plan.resourceFromWorldPos[resourcePlan.contentType] || plan.fromWorldPos,
                cb: playNext,
            });
        };
        playNext();
    }

    prepareLevelResourceNumAnims(userInfo: any, rewards: any[]) {
        const fromValues: Record<string, any> = {};
        [Game.Content.Types.Coin, Game.Content.Types.Ap, Game.Content.Types.Cash].forEach(type => {
            if (LevelUpDisplayLock.IsResourceLocked(type)) {
                fromValues[type] = LevelUpDisplayLock.GetDisplayResourceValue(Game.SUser, type);
            }
        });
        const plans = userInfo?.prepareResourceGains
            ? userInfo.prepareResourceGains(rewards, { fromValues, hold: true })
            : [];
        LevelUpDisplayLock.Release();
        return plans;
    }

    getTopResourceRewards(rewards: any[]) {
        return (rewards || []).map(reward => Game.Content.FromContent(reward)).filter(content => {
            if (!content) return false;
            const type = content.Type();
            return type === Game.Content.Types.Coin || type === Game.Content.Types.ShopCoin ||
                type === Game.Content.Types.Ap || type === Game.Content.Types.Cash;
        });
    }

    finishLevelRewardFly(flowToken: any, _source?: string) {
        const flowState = flowToken && typeof flowToken === 'object' ? flowToken : null;
        const token = flowState ? flowState.token : flowToken;
        if (token != null && token !== this._levelRewardFlowToken) return false;
        if (flowState?.finished || (!flowState && this._levelRewardFlowFinished)) return false;
        if (flowState) flowState.finished = true;
        this._releaseLevelLockAfterRewardFly = false;
        this.finishLevelRewardFlow(flowState?.rewardDoneCallback);
        return true;
    }

    private finishLevelRewardFlow(rewardDoneCallback?: () => void) {
        if (this._levelRewardFlowFinished) return;
        this._levelRewardFlowFinished = true;
        LevelUpDisplayLock.Release();
        const callback = rewardDoneCallback || this.showParams?.rewardDoneCallback;
        if (typeof callback === 'function') callback();
    }
}
