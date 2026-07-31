import { _decorator, Button, Color, Component, ImageAsset, isValid, Label, LabelOutline, Node, ProgressBar, Sprite, SpriteFrame, Texture2D, Tween, tween, UITransform, Vec3 } from 'cc';
import NumAnim from '../GameKit/ui/NumAnim';
import { bindGuardedClick } from '../GameKit/ui/TouchClickGuard';
import LevelUpDisplayLock from '../game/user/LevelUpDisplayLock';

import { User } from '../game/user/User';
const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('UserInfoModel')
export class UserInfoModel extends Component {
    @property(Node)
    public avatarNode: Node | null = null;

    @property(Sprite)
    public avatarSprite: Sprite | null = null;

    @property(Label)
    public labelName: Label | null = null;

    @property(Label)
    public labelLevel: Label | null = null;

    @property(ProgressBar)
    public expProgress: ProgressBar | null = null;

    @property(Label)
    public labelAp: Label | null = null;

    @property(Sprite)
    public spriteApFull: Sprite | null = null;

    @property(Label)
    public labelApFull: Label | null = null;

    @property(Label)
    public labelApRemain: Label | null = null;

    @property
    public energyFullAnim: any = null;

    @property(Button)
    public btnApAdd: Button | null = null;

    @property(Label)
    public labelCoin: Label | null = null;

    @property(Button)
    public btnCoinAdd: Button | null = null;

    @property(Sprite)
    public spriteCoin: Sprite | null = null;

    @property(Label)
    public cashLabel: Label | null = null;

    @property(Sprite)
    public cashIcon: Sprite | null = null;

    @property(Button)
    public btnCashAdd: Button | null = null;

    @property(Label)
    public labelStar: Label | null = null;

    @property([Node])
    public shields: Node[] = [];

    @property(Node)
    public spVip: Node | null = null;

    public currentShowAp = 0;
    public User: any = null;
    public isSelf = false;
    public lastUpdateTime = 0;
    public hiden = false;
    public apStop = false;
    public showAp = 0;
    public apRemainTime: number | null = null;
    public apDisplayLocked = false;
    public lockedShowAp: any = null;
    private _pendingResourceNumAnims: Record<string, { from: number; to: number; duration: number }> = {};
    private _deferredResourceNumAnims: Record<string, { from: number; to: number; duration: number }> = {};
    private _resourceGainHolds: Record<string, boolean> = {};
    private _resourceGainHoldValues: Record<string, number> = {};
    private _resourceGainFlights: Record<string, { target: number }> = {};
    private _resourceGainAutoPlay: Record<string, () => void> = {};
    private _displayedResourceValues: Record<string, number> = {};
    private _lastPresentedResourceTargets: Record<string, number> = {};
    public genderMale: Node | null = null;
    public genderFemale: Node | null = null;

    public updateShowAp() {
    }

    public onLoad() {
    }

    public canOperateP4GlobalUi() {
        const tutorialManager = Game.MergeTutorialManager;
        if (tutorialManager?.ShouldBlockForceGuideGlobalUi?.()) return false;
        if (tutorialManager?.ShouldBlockP4GlobalUi?.()) return false;
        return true;
    }

    public show(User: any) {
        if (User == null) {
            return;
        }

        this.User = User;
        this.isSelf = User === Game.SUser;

        if (this.avatarNode) {
            const icon = GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite);
            const frame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
            UserInfoModel.SetAvatar(icon, frame, this.User, this.isSelf);
        }

        if (this.isSelf) {
            GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.UserInfoEvent, this.uuid, () => {
                if (this.avatarNode) {
                    const icon = GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite);
                    const frame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
                    UserInfoModel.SetAvatar(icon, frame, this.User, this.isSelf);
                }
                this.updateBaseInfo();
            });

            if (this.avatarSprite) {
                bindGuardedClick(this.avatarSprite.node, this, () => {
                    if (!this.canOperateP4GlobalUi()) return;
                    UIRoot.instance.openChildWindow('AvatarWindow', { user: this.User });
                });
            }
        }

        this.updateBaseInfo();

        if (this.genderMale) {
            this.genderMale.active = User.Gender() === User.Genders.Male;
        }
        if (this.genderFemale) {
            this.genderFemale.active = User.Gender() === User.Genders.genderFemale;
        }

        this.setAp();
        this.setCoin();
        this.setCash();
        this.setStar();
        this.setShield();
        this.setVip();
        this.refreshLevelUpResourceDisplay();
    }

    public update(dt: number) {
        const cTime = GameKit.TimeUtil.getCurrentTime();
        const delta = this.lastUpdateTime ? cTime - this.lastUpdateTime : dt;
        this.lastUpdateTime = cTime;
        if (this.isApRecoverUpdater()) {
            this.updateAp(delta);
        }
    }

    public onClose() {
        this.clearResourceGainPresentation();
        this.closeUserInfo();
        this.closeCoin();
        this.closeAp();
        this.closeCash();
        this.closeShield();
        this.closeVip();
    }

    public onDestroy() {
        this.onClose();
    }

    public closeUserInfo() {
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.UserInfoEvent, this.uuid);
    }

    public closeCash() {
        if (this.cashLabel && this.isSelf) {
            GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.CashEvent, this.uuid);
        }
    }

    public onDisable() {
        this.hiden = true;
    }

    public onEnable() {
        if (this.hiden && (this.labelAp || this.labelApFull || this.labelApRemain || this.spriteApFull)) {
            this._setAp();
        }
    }

    public setAp() {
        if ((this.labelAp || this.labelApFull || this.labelApRemain || this.spriteApFull) && this.isSelf) {
            this._setAp();
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ApEvent, this.uuid, (data: any) => {
                if (!this.playResourceNumAnimFromEvent(data, Game.Content.Types.Ap)) this._setAp();
            });
        }
    }

    public _setAp() {
        if (!this.User) {
            return;
        }
        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Ap);
        if (lockedValue != null) {
            this.apStop = true;
            this.showAp = lockedValue;
            this.stopResourceNumAnimAt(Game.Content.Types.Ap, lockedValue);
            this.setApWithNum(lockedValue);
            return;
        }
        if (this.apDisplayLocked) {
            this.apStop = true;
            this.setApWithNum(this.lockedShowAp);
            return;
        }
        this.apStop = false;
        if (this.isSelf && Game.SUser && Game.SUser.GetFullApTime) {
            Game.SUser.GetFullApTime();
        } else if (this.User.UpdateApTime) {
            this.User.UpdateApTime();
        }
        if (this.getPendingResourceNumAnim(Game.Content.Types.Ap)) return;
        const apNum = this.User.Ap();
        this.setApWithNum(apNum);
    }

    public setCash() {
        this.updateCash();
        if (this.cashLabel && this.isSelf) {
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CashEvent, this.uuid, (data: any) => {
                if (!this.playResourceNumAnimFromEvent(data, Game.Content.Types.Cash)) this.updateCash();
            });
        }
        if (this.btnCashAdd && this.isSelf) {
            this.btnCashAdd.node.on('click', () => {
                if (!this.canOperateP4GlobalUi()) return;
                if (GamePlay.instance.isBusy()) {
                    return;
                }
                UIRoot.instance.openChildWindow('ShopWindow', { showCash: true });
            }, this);
        }
    }

    public updateCash() {
        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Cash);
        if (lockedValue != null) {
            this.stopResourceNumAnimAt(Game.Content.Types.Cash, lockedValue);
            if (this.cashLabel) this.cashLabel.string = String(lockedValue);
            return;
        }
        if (this.getPendingResourceNumAnim(Game.Content.Types.Cash)) return;
        if (this.cashLabel) {
            this.cashLabel.string = String(this.User.Cash());
        }
    }

    public getApRuntimeConfig() {
        if (this.User && this.User.GetApRuntimeConfig) {
            return this.User.GetApRuntimeConfig();
        }

        let apMax = G.GameConstance.apMax;
        let apRecoverSpins = G.GameConstance.apRecoverSpins;
        if (Game.SUserStatus.IsVip()) {
            apMax = G.GameConstance.vipApMax;
            apRecoverSpins = G.GameConstance.vipApRecoverSpins;
        }

        const HugeSpinsMeta = Game.ActivityManager.GetActiveOtherActivityByType(Meta.ActivityMeta.SubTypes.HugeSpins);
        if (HugeSpinsMeta) {
            apMax += HugeSpinsMeta.Param().spinMaxAdd;
        }

        return {
            apMax,
            apRecoverSpins,
        };
    }

    public isApRecoverUpdater() {
        if (this.apStop) return true;
        if (!this.isSelf) return false;

        let mainWindow: any = null;
        try {
            if (UIRoot && UIRoot.instance && UIRoot.instance.GetWindow) {
                mainWindow = UIRoot.instance.GetWindow('GameMainWindow');
            }
        } catch (e) {
        }
        if (mainWindow && mainWindow.userinfo) {
            return mainWindow.userinfo === this;
        }
        return true;
    }

    public getApRemainContainer() {
        if (!this.labelApRemain || !this.labelApRemain.node) return null;
        const node = this.labelApRemain.node;
        const parent = node.parent;
        if (!parent) return node;

        const childCount = parent.children ? parent.children.length : ((parent as any)._children ? (parent as any)._children.length : 0);
        return childCount === 1 ? parent : node;
    }

    public setApWithNum(apNum: any) {
        const apRuntime = this.getApRuntimeConfig();
        const apMax = apRuntime.apMax;
        const apRecoverSpins = apRuntime.apRecoverSpins;

        const apRecoverTime = isFinite(Number(G.GameConstance.apRecover)) ? Number(G.GameConstance.apRecover) : 0;
        const apRecover = isFinite(Number(this.User.ApRecover())) ? Number(this.User.ApRecover()) : 0;
        const apRecoverLast = isFinite(Number(this.User.ApRecoverLast())) ? Number(this.User.ApRecoverLast()) : GameKit.TimeUtil.getCurrentTime() - 1;
        this.apRemainTime = apRecoverTime - (apRecover + GameKit.TimeUtil.getCurrentTime() - 1 - apRecoverLast);
        if (apRecoverTime > 0 && this.apRemainTime <= 0) {
            this.apRemainTime = this.apRemainTime % apRecoverTime;
            if (this.apRemainTime <= 0) this.apRemainTime += apRecoverTime;
        }
        const ap = isFinite(Number(apNum)) ? Number(apNum) : 0;
        const maxAp = isFinite(Number(apMax)) ? parseInt(apMax, 10) : 0;

        if (this.labelAp) {
            this.labelAp.string = ap.toString();
        }
        if (this.labelApFull) {
            this.labelApFull.string = String(ap);
        }
        if (this.spriteApFull) {
            this.spriteApFull.fillRange = Math.clamp(ap / maxAp, 0, 1);
        }
        if (this.labelApRemain) {
            const apRemainContainer = this.getApRemainContainer();
            if (ap < maxAp) {
                if (apRemainContainer) apRemainContainer.active = true;
                this.labelApRemain.string = GameKit.TimeUtil.FormatRemainTimeSimple(Math.ceil(this.apRemainTime || 0));
            } else {
                if (apRemainContainer) apRemainContainer.active = false;
                this.labelApRemain.string = '';
            }
        }
    }

    public recoverApByCountdown() {
        if (!this.User || !this.User.UpdateApTime) return false;
        return this.User.UpdateApTime();
    }

    public stopApAt(ap: any) {
        this.apStop = true;
        this.showAp = ap;
        this.setApWithNum(ap);
    }

    public changeAp(from: number, to: number, duration: number) {
        if (from === to && duration !== 0) return;
        this.apStop = false;
        this.setApWithNum(from);
        this.playLabelNumAnim(this.labelAp || this.labelApFull, from, to, duration);
        if (duration > 0) this.scheduleOnce(() => this.setApWithNum(to), duration);
        else this.setApWithNum(to);
    }

    public lockApDisplay(ap: any) {
        this.apDisplayLocked = true;
        this.lockedShowAp = ap;
        this.stopApAt(ap);
    }

    public unlockApDisplay() {
        this.apDisplayLocked = false;
        this.lockedShowAp = null;
    }

    public playApAnim(cb: any) {
        this.energyFullAnim.play(() => {
            this.apStop = false;
            this._setAp();
            if (cb != null) {
                cb();
            }
        });
    }

    public updateAp(dt: number) {
        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Ap);
        if (lockedValue != null) {
            this.apStop = true;
            this.showAp = lockedValue;
            this.stopResourceNumAnimAt(Game.Content.Types.Ap, lockedValue);
            this.setApWithNum(lockedValue);
            return;
        }
        if (this.apRemainTime == null) {
            return;
        }

        const apRuntime = this.getApRuntimeConfig();
        const apMax = apRuntime.apMax;
        const apRecoverSpins = apRuntime.apRecoverSpins;
        if (this.apStop) {
            if (this.showAp < apMax) {
                this.apRemainTime -= dt;
                if (this.apRemainTime <= 0) {
                    this.showAp = Math.min(apMax, this.showAp + apRecoverSpins);
                    this.setApWithNum(this.showAp);
                } else if (this.labelApRemain) {
                    this.labelApRemain.string = GameKit.TimeUtil.FormatRemainTimeSimple(Math.ceil(this.apRemainTime));
                }
            }
        } else if (this.User.Ap() < apMax) {
            this.apRemainTime -= dt;
            if (Math.ceil(this.apRemainTime) <= 0) {
                if (this.recoverApByCountdown()) {
                    this.setApWithNum(this.User.Ap());
                } else {
                    this._setAp();
                }
                if (SR && SR.SRMerge && SR.SRMerge.SaveLocalMergeSnapshot) {
                    SR.SRMerge.SaveLocalMergeSnapshot('apRecover');
                }
            } else if (this.labelApRemain) {
                this.labelApRemain.string = GameKit.TimeUtil.FormatRemainTimeSimple(Math.ceil(this.apRemainTime));
            }
        }
    }

    public closeAp() {
        if ((this.labelAp || this.labelApFull || this.labelApRemain || this.spriteApFull) && this.isSelf) {
            GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.ApEvent, this.uuid);
        }
    }

    public setCoin() {
        this.updateCoin();
        if (this.labelCoin && this.isSelf) {
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CoinEvent, this.uuid, (data: any) => {
                if (!this.playResourceNumAnimFromEvent(data, Game.Content.Types.Coin)) this.updateCoin();
            });
        }
        if (this.btnCoinAdd) {
            this.btnCoinAdd.node.on('click', () => {
                if (!this.canOperateP4GlobalUi()) return;
                if (GamePlay.instance.isBusy()) {
                    return;
                }
                UIRoot.instance.openChildWindow('ApNotEnoughDialogWindow');
                AppKit.LogEventWrap.logEvent('openshop_coin');
            }, this);
        }
    }

    public closeCoin() {
        if (this.labelCoin && this.isSelf) {
            GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.CoinEvent, this.uuid);
        }
    }

    public updateCoin() {
        const lockedValue = this.getLevelUpLockedResourceValue(Game.Content.Types.Coin);
        if (lockedValue != null) {
            this.stopResourceNumAnimAt(Game.Content.Types.Coin, lockedValue);
            if (this.labelCoin) this.labelCoin.string = GameKit.StringUtil.formatNumber(lockedValue);
            return;
        }
        if (this.getPendingResourceNumAnim(Game.Content.Types.Coin)) return;
        if (this.labelCoin) {
            this.labelCoin.string = GameKit.StringUtil.formatNumber(this.User.Coin());
        }
    }

    public formatResourceNum(contentType: any, value: any) {
        if (contentType === Game.Content.Types.Coin) return GameKit.StringUtil.formatNumber(value);
        return value != null ? String(value) : '';
    }

    public setResourceLabelNum(contentType: any, value: any) {
        if (contentType === Game.Content.Types.Coin && this.labelCoin) this.labelCoin.string = this.formatResourceNum(contentType, value);
        else if (contentType === Game.Content.Types.Ap) this.setApWithNum(value);
        else if (contentType === Game.Content.Types.Cash && this.cashLabel) this.cashLabel.string = this.formatResourceNum(contentType, value);
    }

    public changeCoin(from: number, to: number, duration: number) {
        if (from === to && duration !== 0) {
            return;
        }
        if (this.labelCoin) {
            this.playLabelNumAnim(this.labelCoin, from, to, duration);
        }
        if (this.spriteCoin && duration > 0) {
            Tween.stopAllByTarget(this.spriteCoin.node);
            tween(this.spriteCoin.node)
                .repeatForever(tween<Node>().to(0.1, { scale: new Vec3(1.2, 1.2, this.spriteCoin.node.scale.z) }).to(0.1, { scale: new Vec3(1, 1, this.spriteCoin.node.scale.z) }))
                .start();
            this.scheduleOnce(() => {
                if (!this.spriteCoin) {
                    return;
                }
                Tween.stopAllByTarget(this.spriteCoin.node);
                tween(this.spriteCoin.node).to(0.1, { scale: new Vec3(1, 1, this.spriteCoin.node.scale.z) }).start();
            }, duration);
        }
    }

    private playLabelNumAnim(label: Label | null, from: number, to: number, duration: number) {
        if (!label) return;
        let numAnim = label.getComponent(NumAnim);
        if (!numAnim) {
            numAnim = label.addComponent(NumAnim);
            numAnim.targetLabel = label;
        }
        numAnim.playAnim(from, to, duration);
    }

    public changeCash(from: number, to: number, duration: number) {
        if (from === to && duration !== 0) return;
        this.playLabelNumAnim(this.cashLabel, from, to, duration);
    }

    public normalizeResourceContentType(contentType: any) {
        const type = Number(contentType);
        if (type === Game.Content.Types.ShopCoin) return Game.Content.Types.Coin;
        return type === Game.Content.Types.Coin || type === Game.Content.Types.Ap || type === Game.Content.Types.Cash ? type : null;
    }

    public getResourceKey(contentType: any) {
        const type = this.normalizeResourceContentType(contentType);
        return type == null ? null : String(type);
    }

    public isMainResourceUserInfo() {
        return typeof GameMainWindow !== 'undefined' && GameMainWindow.instance?.userinfo === this;
    }

    public getUserResourceValue(contentType: any) {
        const type = this.normalizeResourceContentType(contentType);
        const user = this.User || Game.SUser;
        if (!user || type == null) return null;
        if (type === Game.Content.Types.Coin && user.Coin) return Number(user.Coin());
        if (type === Game.Content.Types.Ap && user.Ap) return Number(user.Ap());
        if (type === Game.Content.Types.Cash && user.Cash) return Number(user.Cash());
        return null;
    }

    public getResourceValueFromEvent(data: any, contentType: any) {
        if (!data) return this.getUserResourceValue(contentType);
        if (data.__to != null) return Number(data.__to);
        const type = this.normalizeResourceContentType(contentType);
        if (type === Game.Content.Types.Coin && data.coin != null) return Number(data.coin);
        if (type === Game.Content.Types.Ap && data.ap != null) return Number(data.ap);
        if (type === Game.Content.Types.Cash && data.cash != null) return Number(data.cash);
        return this.getUserResourceValue(type);
    }

    public setDisplayedResourceValue(contentType: any, value: number) {
        const key = this.getResourceKey(contentType);
        const numericValue = Number(value);
        if (key != null && isFinite(numericValue)) this._displayedResourceValues[key] = numericValue;
    }

    public isResourceGainHeld(contentType: any) {
        const key = this.getResourceKey(contentType);
        return key != null && this._resourceGainHolds[key] === true;
    }

    public getResourceGainHoldValue(contentType: any) {
        const key = this.getResourceKey(contentType);
        if (key == null) return null;
        const value = Number(this._resourceGainHoldValues[key]);
        return isFinite(value) ? value : null;
    }

    public holdResourceGain(contentType: any, from: number) {
        const type = this.normalizeResourceContentType(contentType);
        const key = this.getResourceKey(type);
        if (key == null) return false;
        this._resourceGainHolds[key] = true;
        this.cancelAutoResourceGain(type);
        const value = Number(from);
        if (isFinite(value)) {
            this._resourceGainHoldValues[key] = value;
            this.stopResourceNumAnimAt(type, value, true);
            if (type === Game.Content.Types.Ap) { this.apStop = true; this.showAp = value; }
        }
        return true;
    }

    public releaseResourceGainHold(contentType: any) {
        const key = this.getResourceKey(contentType);
        if (key == null) return;
        delete this._resourceGainHolds[key];
        delete this._resourceGainHoldValues[key];
    }

    public prepareResourceGain(contentType: any, options: any = {}) {
        const type = this.normalizeResourceContentType(contentType);
        const key = this.getResourceKey(type);
        if (key == null) return false;
        const to = options.to != null ? Number(options.to) : Number(this.getUserResourceValue(type));
        const pending = this.getPendingResourceNumAnim(type);
        let from = options.from != null ? Number(options.from) : Number(pending?.from ?? this.getCurrentResourceLabelNum(type));
        const count = Number(options.count);
        if (!isFinite(from) && isFinite(to) && isFinite(count)) from = to - count;
        if (!isFinite(from) || !isFinite(to) || to <= from) return false;
        if (pending && to <= Number(pending.to)) return true;
        const presentedTarget = Number(this._lastPresentedResourceTargets[key]);
        if (!pending && isFinite(presentedTarget) && to <= presentedTarget) return true;
        const flight = this._resourceGainFlights[key];
        if (flight && pending && to > Number(flight.target)) {
            const deferred = this._deferredResourceNumAnims[key];
            const deferredFrom = deferred ? Math.min(deferred.from, flight.target) : flight.target;
            this._deferredResourceNumAnims[key] = { from: deferredFrom, to, duration: this.getResourceNumAnimDuration(deferredFrom, to, options.duration) };
            return true;
        }
        this.stopResourceNumAnimAt(type, from, true);
        this.queueResourceNumAnim(type, from, to, this.getResourceNumAnimDuration(from, to, options.duration));
        if (type === Game.Content.Types.Ap) { this.apStop = true; this.showAp = from; }
        if (options.hold === true) this.holdResourceGain(type, from);
        if (options.autoPlay === true && !this.isResourceGainHeld(type)) this.scheduleAutoResourceGain(type);
        return true;
    }

    public prepareResourceGains(contents: any[], options: any = {}) {
        const totals: Record<string, { contentType: any; count: number }> = {};
        for (const rawContent of contents || []) {
            const content = Game.Content.FromContent(rawContent);
            if (!content) continue;
            const type = this.normalizeResourceContentType(content.Type());
            const key = this.getResourceKey(type);
            const count = Number(content.Count());
            if (key == null || !isFinite(count) || count <= 0) continue;
            totals[key] ||= { contentType: type, count: 0 };
            totals[key].count += count;
        }
        const plans: any[] = [];
        for (const key in totals) {
            const total = totals[key];
            const to = Number(options.toValues?.[key] ?? this.getUserResourceValue(total.contentType));
            const pending = this.getPendingResourceNumAnim(total.contentType);
            const from = Number(options.fromValues?.[key] ?? pending?.from ?? Math.max(0, to - total.count));
            if (!isFinite(from) || !isFinite(to) || to <= from) continue;
            this.prepareResourceGain(total.contentType, { from, to, count: total.count, hold: options.hold !== false, autoPlay: options.autoPlay === true });
            plans.push({ contentType: total.contentType, count: total.count, from, to });
        }
        return plans;
    }

    public scheduleAutoResourceGain(contentType: any) {
        const type = this.normalizeResourceContentType(contentType);
        const key = this.getResourceKey(type);
        if (key == null || this.isResourceGainHeld(type)) return;
        this.cancelAutoResourceGain(type);
        const play = () => {
            delete this._resourceGainAutoPlay[key];
            if (!isValid(this.node) || this.isResourceGainHeld(type)) return;
            const pending = this.getPendingResourceNumAnim(type);
            if (pending) this.playResourceGainAnim(type, { count: pending.to - pending.from });
        };
        this._resourceGainAutoPlay[key] = play;
        this.scheduleOnce(play, 0);
    }

    public cancelAutoResourceGain(contentType: any) {
        const key = this.getResourceKey(contentType);
        if (key == null) return;
        const play = this._resourceGainAutoPlay[key];
        if (play) this.unschedule(play);
        delete this._resourceGainAutoPlay[key];
    }

    public getResourceGainFallbackWorldPos() {
        return isValid(UIRoot.instance?.node) ? UIRoot.instance.node.worldPosition.clone() : null;
    }

    public playResourceGainAnim(contentType: any, options: any = {}) {
        const type = this.normalizeResourceContentType(contentType);
        const key = this.getResourceKey(type);
        if (key == null) { options.cb?.(); return false; }
        this.cancelAutoResourceGain(type);
        this.releaseResourceGainHold(type);
        let pending = this.getPendingResourceNumAnim(type);
        const requestedTo = Number(options.to ?? this.getUserResourceValue(type));
        if (!pending) {
            const lastTarget = Number(this._lastPresentedResourceTargets[key]);
            if (isFinite(lastTarget) && isFinite(requestedTo) && requestedTo <= lastTarget) { options.cb?.(); return false; }
            this.prepareResourceGain(type, { from: options.from, to: requestedTo, count: options.count, duration: options.duration });
            pending = this.getPendingResourceNumAnim(type);
        }
        if (!pending) { options.cb?.(); return false; }
        if (this._resourceGainFlights[key]) { options.cb?.(); return true; }
        const fromWorldPos = options.fromWorldPos || (isValid(options.fromNode) ? options.fromNode.worldPosition.clone() : this.getResourceGainFallbackWorldPos());
        const mergeNodeUI = GamePlay.instance?.mergeRoot?.mergeNodeUI;
        const mainWindow = GameMainWindow.instance;
        const targetNode = mergeNodeUI?.getUserInfoResourceTargetNode?.(this, type);
        let count = Number(options.count);
        if (!isFinite(count) || count <= 0) count = pending.to - pending.from;
        if (!fromWorldPos || !mergeNodeUI?.PlayCoinFlyToTargetAnimNew || !mainWindow?.coinFlyToTargetAnim || !targetNode) {
            this.playPendingResourceNumAnim(type);
            options.cb?.();
            return false;
        }
        const flightTarget = Number(pending.to);
        this._resourceGainFlights[key] = { target: flightTarget };
        const finish = () => {
            delete this._resourceGainFlights[key];
            const deferred = this._deferredResourceNumAnims[key];
            if (deferred) { delete this._deferredResourceNumAnims[key]; this.queueResourceNumAnim(type, deferred.from, deferred.to, deferred.duration); }
            const nextPending = this.getPendingResourceNumAnim(type);
            const presented = Number(this._lastPresentedResourceTargets[key]);
            if (nextPending && isFinite(presented) && presented >= flightTarget && nextPending.to > presented) {
                this.playResourceGainAnim(type, { count: nextPending.to - presented, cb: options.cb });
                return;
            }
            if (nextPending) this.playPendingResourceNumAnim(type);
            options.cb?.();
        };
        mergeNodeUI.PlayCoinFlyToTargetAnimNew(fromWorldPos, count, options.textures || null, type, options.toWorldPos, finish, options.flyOptions);
        return true;
    }

    public cancelResourceGain(contentType: any, refresh = true) {
        const type = this.normalizeResourceContentType(contentType);
        const key = this.getResourceKey(type);
        if (key == null) return;
        this.cancelAutoResourceGain(type);
        delete this._resourceGainHolds[key]; delete this._resourceGainHoldValues[key]; delete this._resourceGainFlights[key];
        delete this._pendingResourceNumAnims[key]; delete this._deferredResourceNumAnims[key];
        const value = Number(this.getUserResourceValue(type));
        if (isFinite(value)) this._lastPresentedResourceTargets[key] = value;
        if (refresh && isFinite(value)) this.setResourceLabelNum(type, value);
    }

    public clearResourceGainPresentation() {
        for (const key in this._resourceGainAutoPlay) this.unschedule(this._resourceGainAutoPlay[key]);
        this._pendingResourceNumAnims = {};
        this._deferredResourceNumAnims = {};
        this._resourceGainHolds = {};
        this._resourceGainHoldValues = {};
        this._resourceGainFlights = {};
        this._resourceGainAutoPlay = {};
    }

    public getLevelUpLockedResourceValue(contentType: any) {
        if (!this.isSelf || !LevelUpDisplayLock.IsResourceLocked(contentType)) return null;
        return LevelUpDisplayLock.GetDisplayResourceValue(this.User, contentType);
    }

    public refreshLevelUpResourceDisplay() {
        if (!this.isSelf) return;
        for (const type of [Game.Content.Types.Ap, Game.Content.Types.Coin, Game.Content.Types.Cash]) {
            const value = this.getLevelUpLockedResourceValue(type);
            if (value != null) { this.stopResourceNumAnimAt(type, value); this.setResourceLabelNum(type, value); }
        }
        this.updateCoin();
        this.updateCash();
    }

    public stopResourceNumAnimAt(contentType: any, value: number, keepPending = false) {
        const key = this.getResourceKey(contentType);
        if (!keepPending && key != null) delete this._pendingResourceNumAnims[key];
        const label = contentType === Game.Content.Types.Coin ? this.labelCoin : contentType === Game.Content.Types.Ap ? (this.labelAp || this.labelApFull) : contentType === Game.Content.Types.Cash ? this.cashLabel : null;
        const numAnim = label?.getComponent(NumAnim);
        if (!numAnim) return;
        numAnim.stopAt(Number(value) || 0);
    }

    public playResourceNumAnimFromEvent(data: any, contentType: any) {
        const lockedValue = this.getLevelUpLockedResourceValue(contentType);
        if (lockedValue != null) { this.stopResourceNumAnimAt(contentType, lockedValue); this.setResourceLabelNum(contentType, lockedValue); return true; }
        if (!data || data.__resourceAnim !== true || data.__from == null || data.__to == null || data.__from === data.__to) return false;
        const duration = this.getResourceNumAnimDuration(data.__from, data.__to, data.__animDuration);
        if (data.__animOnArrive === true) {
            this.queueResourceNumAnim(contentType, data.__from, data.__to, duration);
            return true;
        }
        return this.playResourceNumAnim(contentType, data.__from, data.__to, duration);
    }

    public getPendingResourceNumAnim(contentType: any) {
        return contentType == null ? null : this._pendingResourceNumAnims[String(contentType)] || null;
    }

    public queueResourceNumAnim(contentType: any, from: number, to: number, duration: number) {
        const key = this.getResourceKey(contentType);
        if (key == null || !isFinite(from) || !isFinite(to) || to <= from) return null;
        const existing = this._pendingResourceNumAnims[key];
        if (existing && to >= existing.to) {
            existing.from = Math.min(existing.from, from);
            existing.to = to;
            existing.duration = this.getResourceNumAnimDuration(existing.from, to, duration);
            return existing;
        }
        this._pendingResourceNumAnims[key] = { from, to, duration };
        return this._pendingResourceNumAnims[key];
    }

    public playPendingResourceNumAnim(contentType: any) {
        const key = String(contentType);
        const anim = this._pendingResourceNumAnims[key];
        if (!anim) return false;
        delete this._pendingResourceNumAnims[key];
        this.cancelAutoResourceGain(contentType);
        this.releaseResourceGainHold(contentType);
        const current = this.getCurrentResourceLabelNum(contentType);
        const from = current == null ? anim.from : current;
        LevelUpDisplayLock.UpdateDisplayResourceValue(contentType, anim.to);
        this._lastPresentedResourceTargets[key] = Number(anim.to);
        return this.playResourceNumAnim(contentType, from, anim.to, this.getResourceNumAnimDuration(from, anim.to, anim.duration));
    }

    private playResourceNumAnim(contentType: any, from: number, to: number, duration: number) {
        if (contentType === Game.Content.Types.Coin) this.changeCoin(from, to, duration);
        else if (contentType === Game.Content.Types.Ap) this.changeAp(from, to, duration);
        else if (contentType === Game.Content.Types.Cash) this.changeCash(from, to, duration);
        else return false;
        return true;
    }

    private getCurrentResourceLabelNum(contentType: any) {
        const text = this.getResourceLabelString(contentType);
        if (text == null) return null;
        const value = Number(String(text).replace(/[^\d.-]/g, ''));
        return isFinite(value) ? value : null;
    }

    public getResourceLabelString(contentType: any) {
        if (contentType === Game.Content.Types.Coin) return this.labelCoin ? this.labelCoin.string : null;
        if (contentType === Game.Content.Types.Ap) return this.labelAp ? this.labelAp.string : (this.labelApFull ? this.labelApFull.string : null);
        if (contentType === Game.Content.Types.Cash) return this.cashLabel ? this.cashLabel.string : null;
        return null;
    }

    private getResourceNumAnimDuration(from: number, to: number, maxDuration?: number) {
        const delta = Math.abs(Number(to) - Number(from));
        if (!isFinite(delta)) return 0.8;
        if (delta <= 0) return 0;
        const limit = isFinite(Number(maxDuration)) && Number(maxDuration) > 0 ? Number(maxDuration) : this.getResourceNumAnimMaxDuration();
        return Math.min(Math.max(delta / this.getResourceNumAnimSpeed(), this.getResourceNumAnimMinDuration()), limit);
    }

    public getResourceNumAnimSpeed() {
        return 45;
    }

    public getResourceNumAnimMinDuration() {
        return 0.15;
    }

    public getResourceNumAnimMaxDuration() {
        return 0.8;
    }

    public setStar() {
        this.updateStar();
    }

    public closeStar() {
    }

    public updateStar() {
        if (this.labelStar) {
            this.labelStar.string = this.User.Star().toString();
        }
    }

    public setShield() {
        this.updateShield();
        if (this.shields.length > 0 && this.isSelf) {
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ShieldEvent, this.uuid, () => {
                this.updateShield();
            });
        }
    }

    public closeShield() {
        if (this.shields.length > 0 && this.isSelf) {
            GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.ShieldEvent, this.uuid);
        }
    }

    public updateShield() {
        if (this.shields.length > 0 && this.isSelf) {
            for (let i = 0; i < this.shields.length; i++) {
                this.shields[i].active = i < this.User.RawShield();
            }
        }
    }

    public setShieldWithNum(num: number) {
        if (this.shields.length > 0 && this.isSelf) {
            for (let i = 0; i < this.shields.length; i++) {
                this.shields[i].active = i < num;
            }
        }
    }

    public changeShield(from: number, to: number, dt = 0.6) {
        if (this.shields.length > 0 && this.isSelf) {
            for (let i = from; i < to; i++) {
                const shield = this.shields[i];
                shield.setScale(0, 0, shield.scale.z);
                shield.active = true;
                tween(shield)
                    .delay((i - from) * dt + 2)
                    .to(0.2, { scale: new Vec3(1, 1, shield.scale.z) }, { easing: 'backOut' })
                    .start();
            }
        }
    }

    public setVip() {
        this.updateVip();
        if (this.isSelf) {
            GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.StatusEvent, this.uuid, () => {
                this.updateVip();
            });
        }
    }

    public updateVip() {
        if (this.spVip) {
            this.spVip.active = !!this.User.IsVip();
        }
        if (this.labelName) {
            UserInfoModel.SetName(this.labelName, this.User);
        }
    }

    public closeVip() {
        if (this.isSelf) {
            GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.StatusEvent, this.uuid);
        }
    }

    public Flush() {
        this.updateCoin();
        this.updateShield();
        this._setAp();
    }

    private updateBaseInfo() {
        if (this.labelName) {
            this.labelName.string = this.User.Name();
        }
        if (this.labelLevel) {
            const level = this.isSelf ? LevelUpDisplayLock.GetDisplayLevel(this.User) : this.User.Level();
            this.labelLevel.string = String(level);
        }
        if (this.expProgress) {
            if (this.isSelf) {
                this.expProgress.progress = LevelUpDisplayLock.GetDisplayExpInfo(this.User).progress;
            } else if (this.User.GetLevelExpInfo) {
                this.expProgress.progress = this.User.GetLevelExpInfo().progress;
            } else {
                const levelExp = Meta.MetaManager.GetMeta(Meta.MetaType.Level, this.User.Level()).Exp();
                this.expProgress.progress = this.User.Exp() / levelExp;
            }
        }
    }

    public static SetAvatar(sprite: Sprite | null, frame: Sprite | null, User: any, useProfileAvatarScale = false) {
        if (sprite == null) {
            return;
        }

        try {
            if (User == null && frame && (frame as any).Avatar) {
                User = frame;
                frame = null;
            }
            if (User == null) return;
            const roleDir = 'res/profile_role';
            const frameDir = 'res/profileframe';
            const avatarArrData = User.Avatar().split(';');
            let avatar = avatarArrData[0] || `${roleDir}/Ava`;
            let frameName = avatarArrData[1] || `${frameDir}/profile frame_1`;
            if (avatar.indexOf('http') !== 0 && avatar.indexOf('/') < 0) avatar = `${roleDir}/${avatar}`;
            if (/^\d+$/.test(frameName)) {
                const index = parseInt(frameName, 10);
                frameName = index <= 1 ? `${frameDir}/profile frame_1` : `${frameDir}/profile-frame_${index}`;
            } else if (frameName.indexOf('/') < 0) {
                frameName = `${frameDir}/${frameName}`;
            }
            if (frame) {
                (frame as any)._avatarFrame = frameName;
                cce.loadRes(frameName, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
                    if (!err && spriteFrame && (frame as any)._avatarFrame === frameName) frame.spriteFrame = spriteFrame;
                });
            }

            (sprite as any)._avatar = avatar;
            const applyAvatar = (spriteFrame: SpriteFrame) => {
                if (spriteFrame) sprite.spriteFrame = spriteFrame;
                if (useProfileAvatarScale && spriteFrame) {
                    const fitSize = sprite.getComponent('SpriteFitSize') as any;
                    if (fitSize) fitSize.enabled = false;
                    sprite.trim = false;
                    sprite.sizeMode = Sprite.SizeMode.RAW;
                    const transform = sprite.node.getComponent(UITransform);
                    const originalSize = spriteFrame.originalSize;
                    if (transform && originalSize) transform.setContentSize(originalSize);
                    sprite.node.setScale(0.4, 0.4, sprite.node.scale.z);
                }
            };
            applyAvatar(CommonAssets.instance.avatar_default);
            if (avatar.indexOf(`${roleDir}/`) === 0) {
                cce.loadRes(avatar, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
                    if (!err && spriteFrame && (sprite as any)._avatar === avatar) applyAvatar(spriteFrame);
                });
            } else if (avatar.length > 0) {
                cce.loaderLoad({ url: avatar, type: 'jpg' }, (err: any, tex: ImageAsset) => {
                    if (err == null && tex != null && (sprite as any)._avatar === (tex as any)._rawUrl) {
                        if (sprite.node) applyAvatar(createSpriteFrame(tex));
                    }
                }, true);
            }
        } catch (e) {
        }
    }

    public static SetName(labelName: Label, User: any) {
        labelName.string = User.Name();
        if ((labelName.node as any)._old_color) {
            labelName.color = (labelName.node as any)._old_color;
        }
        const outline = labelName.getComponent(LabelOutline);
        if (outline && (outline as any)._old_color) {
            outline.color = (outline as any)._old_color;
        }

        if (User.IsVip()) {
            (labelName.node as any)._old_color = labelName.color;
            labelName.color = new Color(255, 216, 0);
            const vipOutline = labelName.getComponent(LabelOutline);
            if (vipOutline) {
                (vipOutline as any)._old_color = vipOutline.color;
                vipOutline.color = new Color(255, 255, 255);
            }
        }
        labelName.node.active = !labelName.node.active;
        labelName.node.active = !labelName.node.active;
    }
}
