import { _decorator, Button, Color, Component, ImageAsset, Label, LabelOutline, Node, ProgressBar, Sprite, SpriteFrame, Texture2D, Tween, tween, Vec3 } from 'cc';
import NumAnim from '../GameKit/ui/NumAnim';
import { bindGuardedClick } from '../GameKit/ui/TouchClickGuard';

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
    public genderMale: Node | null = null;
    public genderFemale: Node | null = null;

    public updateShowAp() {
    }

    public onLoad() {
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
            UserInfoModel.SetAvatar(icon, frame, this.User);
        }

        if (this.isSelf) {
            GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.UserInfoEvent, this.uuid, () => {
                if (this.avatarNode) {
                    const icon = GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite);
                    const frame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
                    UserInfoModel.SetAvatar(icon, frame, this.User);
                }
                this.updateBaseInfo();
            });

            if (this.avatarSprite) {
                bindGuardedClick(this.avatarSprite.node, this, () => {
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
        this.closeCoin();
        this.closeAp();
        this.closeShield();
        this.closeVip();
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
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ApEvent, this.uuid, () => {
                this._setAp();
            });
        }
    }

    public _setAp() {
        if (!this.User) {
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
        const apNum = this.User.Ap();
        this.setApWithNum(apNum);
    }

    public setCash() {
        this.updateCash();
        if (this.cashLabel && this.isSelf) {
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CashEvent, this.uuid, () => {
                this.updateCash();
            });
        }
        if (this.btnCashAdd && this.isSelf) {
            this.btnCashAdd.node.on('click', () => {
                if (GamePlay.instance.isBusy()) {
                    return;
                }
                UIRoot.instance.openChildWindow('ShopWindow', { showCash: true });
            }, this);
        }
    }

    public updateCash() {
        if (this.cashLabel) {
            this.cashLabel.string = this.User.Cash();
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
            GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.CoinEvent, this.uuid, () => {
                this.updateCoin();
            });
        }
        if (this.btnCoinAdd) {
            this.btnCoinAdd.node.on('click', () => {
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
        if (this.labelCoin) {
            this.labelCoin.string = GameKit.StringUtil.formatNumber(this.User.Coin());
        }
    }

    public changeCoin(from: number, to: number, duration: number) {
        if (from === to && duration !== 0) {
            return;
        }
        if (this.labelCoin) {
            let numAnim = this.labelCoin.getComponent(NumAnim);
            if (numAnim == null) {
                numAnim = this.labelCoin.addComponent(NumAnim);
                numAnim.targetLabel = this.labelCoin;
            }
            numAnim.playAnim(from, to, duration);
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
            this.labelLevel.string = this.User.Level().toString();
        }
        if (this.expProgress) {
            if (this.User.GetLevelExpInfo) {
                this.expProgress.progress = this.User.GetLevelExpInfo().progress;
            } else {
                const levelExp = Meta.MetaManager.GetMeta(Meta.MetaType.Level, this.User.Level()).Exp();
                this.expProgress.progress = this.User.Exp() / levelExp;
            }
        }
    }

    public static SetAvatar(sprite: Sprite | null, frame: Sprite | null, User: any) {
        if (sprite == null) {
            return;
        }

        try {
            const avatarArrData = User.Avatar().split(';');
            const avatar = avatarArrData[0];
            const frameName = avatarArrData[1] || '1';
            if (frame) {
                frame.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, frameName);
            }

            (sprite as any)._avatar = avatar;
            sprite.spriteFrame = CommonAssets.instance.avatar_default;
            if (avatar != null && avatar.length > 0) {
                cce.loaderLoad({ url: avatar, type: 'jpg' }, (err: any, tex: ImageAsset) => {
                    if (err == null && tex != null && (sprite as any)._avatar === (tex as any)._rawUrl) {
                        if (sprite.node) {
                            sprite.spriteFrame = createSpriteFrame(tex);
                        }
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
