import { _decorator, instantiate, isValid, Label, Node, RichText, sp, Sprite, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const poses: Record<number, number[]> = {
    1: [0],
    2: [-120, 120],
    3: [-160, 0, 160],
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

    private fitByHeight(sprite: Sprite, height: number) {
        const spriteFrame = sprite.spriteFrame;
        if (!spriteFrame || height <= 0) return;
        const rect = spriteFrame.rect;
        if (!rect.height) return;
        const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
        transform.setContentSize(rect.width * height / rect.height, height);
    }

    private convertToWorldSpaceAR(node: Node, localPosition: Vec3) {
        const transform = node.getComponent(UITransform);
        return transform ? transform.convertToWorldSpaceAR(localPosition) : localPosition;
    }

    private convertToNodeSpaceAR(node: Node, worldPosition: Vec3) {
        const transform = node.getComponent(UITransform);
        return transform ? transform.convertToNodeSpaceAR(worldPosition) : worldPosition;
    }

    private updateSkeletonWorldTransform(skeleton: sp.Skeleton | null) {
        const runtimeSkeleton: any = skeleton;
        if (runtimeSkeleton && runtimeSkeleton.updateWorldTransform) {
            runtimeSkeleton.updateWorldTransform();
        }
    }

    onShow(showParams: any) {
        UIRoot.instance.closeChildWindow('GetRewardWindow');
        this.prepareSpineShow(this.SpineOk);
        this.prepareSpineShow(this.SpineBg);
        let contents = showParams.contents;
        contents = Game.Content.Merge(contents);
        this.oldCoin = showParams.oldCoin;
        this.noChest = showParams.noChest;

        if (!this.item || !this.labelDes || !this.labelLV) return;
        this.item.active = false;

        let rewardStr = '';
        let count = Math.min(3, contents.length);
        this.labelLV.string = Game.SUser.Level().toString();
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
        for (let i = 0; i < count; i++) {
            let content = Game.Content.FromContent(contents[i]);
            let newItem = instantiate(this.item);
            newItem.parent = this.item.parent;
            newItem.setPosition(poses[count][i], newItem.position.y, newItem.position.z);
            newItem.active = true;

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

        this.labelDes.string = String.format(GameKit.i18n.t('GetRewardWindowDes'), rewardStr);

        GameKit.BackKeyManager.registerBackEvent();

        GameKit.SoundManager.playSound('slot_item_win');
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
        return spineNode.uuid || (spineNode as any)._id || spineNode.name;
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
        let worldPos = this.convertToWorldSpaceAR(this.SpineBg, bonePos);
        let localPos = this.convertToNodeSpaceAR(this._levelBoneLabelNode.parent, worldPos);
        this._levelBoneLabelNode.setPosition(localPos);
    }

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

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
        this.clearDelayedSpineShow();
        this.clearSpineCompleteListeners();
        this.clearLevelLabelBone();

        this._icons.forEach(x => { cce.releaseSpriteFrame(x); });

        if (this.oldCoin != null) {
            if (GameMainWindow.instance) GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, Game.SUser.Coin(), 0.8);
        }
    }

    lateUpdate() {
        this.updateLevelLabelPosition();
    }

    close_window() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('level_reward_button');
        }
        if (this.chestCard.length > 0) {
            if (!this.noChest && CardChestOpenWindow.tryShow(null, this.chestCard && this.chestCard.length > 0 ? this.chestCard.shift() : null)) {
                return;
            }
        } else if (this.randomPackChest.length > 0) {
            if (!this.noChest && CardChestOpenWindow.tryShow()) {
                this.randomPackChest = [];
                return;
            }
        }

        this.closeAnim();

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
}
