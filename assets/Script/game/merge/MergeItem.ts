import { _decorator, Component, Node, Sprite, sp, CCInteger, Label, ProgressBar, Tween, isValid, UIOpacity, Vec3 } from 'cc';
import MergeTypes from './MergeTypes';
import MergeTileFunctionUtil from './MergeTileFunctionUtil';
import MergeTileCapabilityKeys from './capabilities/MergeTileCapabilityKeys';
import MergeGeneratorCapability from './capabilities/MergeGeneratorCapability';

const { ccclass, property } = _decorator;

@ccclass('MergeItem')
export class MergeItem extends Component {
    @property
    public mergeId = 0;
    @property(Node)
    public bottomRect: Node | null = null;
    @property(Sprite)
    public icon: Sprite | null = null;
    @property(sp.Skeleton)
    public bubble_anim: sp.Skeleton | null = null;
    @property(Sprite)
    public icon_bubble_anim: Sprite | null = null;
    @property(sp.Skeleton)
    public iconAnim: sp.Skeleton | null = null;
    @property(CCInteger)
    public envStatus = 0;
    @property(Sprite)
    public envIcon: Sprite | null = null;
    @property(CCInteger)
    public addtionId = -1;
    @property(Sprite)
    public additionIcon: Sprite | null = null;
    @property(Label)
    public additionLabel: Label | null = null;
    @property(Sprite)
    public okIcon: Sprite | null = null;
    @property(Sprite)
    public energyicon: Sprite | null = null;
    @property(Sprite)
    public icon_lock: Sprite | null = null;
    @property(Node)
    public hg: Node | null = null;
    @property(ProgressBar)
    public clock: ProgressBar | null = null;
    @property(sp.Skeleton)
    public shiningAnim: sp.Skeleton | null = null;
    @property(Node)
    public cooking: Node | null = null;

    public BASE_ANIM_URL = 'res/merge/anim/';
    public tx = -1;
    public ty = -1;
    public initAdditionX = 0;
    public cookingTanhao: Node | null = null;
    public cookingCycle: Node | null = null;
    public cookingTimeProgress: ProgressBar | null = null;
    public cookingTimeLabel: Label | null = null;
    public cookingData: any = null;
    private _iconAnimLoadKey = 0;
    private _capabilities: any = {};

    onLoad() {
        this.BASE_ANIM_URL = 'res/merge/anim/';
        this._iconAnimLoadKey = 0;
        this.hideIconAnim();
        this.tx = -1;
        this.ty = -1;
        this.initAdditionX = this.additionIcon && this.additionIcon.node ? this.additionIcon.node.position.x : 0;
        this.HideShiningAnim();
        if (this.okIcon) this.okIcon.node.active = false;
        if (this.energyicon) this.energyicon.node.active = false;
        if (this.clock) this.clock.node.active = false;
        if (this.hg) this.hg.active = false;
        if (this.cooking) this.cooking.active = false;
        this.hideBubbleAnim();
        if (this.bottomRect) this.bottomRect.active = false;

        this._capabilities = {};
        this._registerCapability(new MergeGeneratorCapability());
    }

    showCooking(meta?: any) {
        if (!this.cooking) return;
        meta = meta || Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.mergeId);
        let show = false;
        let cookingData = null;
        let isCooking = false;
        let isDone = false;
        if (meta && meta.FunctionType() === MergeTypes.MergeFunctionType.COOKING) {
            let cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(this.tx, this.ty);
            cookingData = cookingId ? Game.SUserMerge.GetCookingState(cookingId) : null;
            show = !!(cookingData && cookingData.status == 'cooking');
            if (show) {
                isDone = GameKit.TimeUtil.getCurrentTime() >= cookingData.finishTime;
                isCooking = !isDone;
            }
        }
        this.cooking.active = show;
        this.cookingTanhao = GameKit.ControllerTable.GetNode(this.cooking, 'tanhao');
        this.cookingCycle = GameKit.ControllerTable.GetNode(this.cooking, 'cycle');
        this.cookingTimeProgress = GameKit.ControllerTable.GetComponent(this.cooking, 'time_progress', ProgressBar);
        this.cookingTimeLabel = GameKit.ControllerTable.GetComponent(this.cooking, 'time_label', Label);
        this.cookingData = isCooking ? cookingData : null;
        if (isCooking) {
            this.PlayIconAnim('animation', true);
        } else {
            this.resetIconAnimPose();
        }
        this.refreshCookingStateNodes(isCooking, isDone);
        this.refreshCookingProgress();
    }

    refreshCookingStateNodes(isCooking: boolean, isDone: boolean) {
        if (this.cookingTanhao) this.cookingTanhao.active = !!isDone;
        if (this.cookingCycle) this.cookingCycle.active = !!isCooking;
        if (this.cookingTimeProgress && this.cookingTimeProgress.node) {
            this.cookingTimeProgress.node.active = !!isCooking;
        }
        if (this.cookingTimeLabel && this.cookingTimeLabel.node) {
            this.cookingTimeLabel.node.active = !!isCooking;
        }
    }

    refreshCookingProgress() {
        if (!this.cookingData || !this.cookingTimeProgress) return;
        let currentTime = GameKit.TimeUtil.getCurrentTime();
        let totalTime = Math.max(0, this.cookingData.finishTime - this.cookingData.startTime);
        let leftTime = Math.max(0, this.cookingData.finishTime - currentTime);
        let progress = totalTime > 0 ? (totalTime - leftTime) / totalTime : 1;
        this.cookingTimeProgress.progress = Math.min(1, Math.max(0, progress));
        if (this.cookingTimeLabel) {
            this.cookingTimeLabel.string = GameKit.TimeUtil.FormatRemainTimeSimple(leftTime, false);
        }
        if (leftTime <= 0) {
            this.cookingData = null;
            this.resetIconAnimPose();
            this.refreshCookingStateNodes(false, true);
        }
    }

    update(dt: number) {
        this._forEachCapability((c: any) => {
            if (c.update) c.update(dt);
        });
        if (this.cooking && this.cooking.active) {
            this.refreshCookingProgress();
        }
    }

    _registerCapability(capability: any) {
        capability.bind(this);
        this._capabilities[capability.key] = capability;
    }

    getCapability(key: string) {
        return this._capabilities[key] || null;
    }

    _forEachCapability(fn: Function) {
        for (let k in this._capabilities) {
            fn(this._capabilities[k], k);
        }
    }

    refreshCapabilities() {
        this._forEachCapability((c: any) => {
            if (c.onTileDataChanged) c.onTileDataChanged();
        });
    }

    _getGeneratorCapability() {
        return this.getCapability(MergeTileCapabilityKeys.GENERATOR);
    }

    resolveSameCellDoubleTap(ctx: any) {
        if (this.IsBubble()) {
            return { intent: MergeTypes.MergeDoubleTapIntent.BROKEN_BUBBLE, cellKey: ctx.endPosName };
        }
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.mergeId);
        if (MergeTileFunctionUtil.opensThreeToOneImmediately(meta)) {
            let cellkeyarr = ctx.endPosName.split('_');
            let tx = parseInt(cellkeyarr[0], 10);
            let ty = parseInt(cellkeyarr[1], 10);
            return { intent: MergeTypes.MergeDoubleTapIntent.OPEN_THREE_TO_ONE, mergeId: this.GetMergeId(), fromTilePos: { x: tx, y: ty }, cellKey: ctx.endPosName };
        }
        let gen = this._getGeneratorCapability();
        if (gen) {
            let r = gen.tryResolveDoubleTapProduce(ctx);
            if (r) return r;
        }
        if (meta.FunctionType() === MergeTypes.MergeFunctionType.COOKING) {
            let cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(this.tx, this.ty);
            let cookingData = cookingId ? Game.SUserMerge.GetCookingState(cookingId) : null;
            if (cookingData && cookingData.status == 'cooking' && GameKit.TimeUtil.getCurrentTime() >= cookingData.finishTime) {
                return { intent: MergeTypes.MergeDoubleTapIntent.COOKING_DONE, cellKey: ctx.endPosName };
            }
        }
        if (meta.FunctionType() === MergeTypes.MergeFunctionType.Hourglass) {
            return { intent: MergeTypes.MergeDoubleTapIntent.USE_HOURGLASS, cellKey: ctx.endPosName };
        }
        if (meta.IfCanSell() && meta.SellType() === MergeTypes.MergeActionType.COLLECT) {
            return { intent: MergeTypes.MergeDoubleTapIntent.COLLECT_SELL, cellKey: ctx.endPosName };
        }
        return { intent: MergeTypes.MergeDoubleTapIntent.NONE };
    }

    GetMergeId() {
        return this.mergeId;
    }

    GetEnvStatus() {
        return this.envStatus;
    }

    GetAddtionId() {
        return this.addtionId;
    }

    GetMergeData() {
        return this.mergeId + '_' + this.envStatus + '_' + this.addtionId;
    }

    SetMergeData(mergeDataStr: string) {
        let mergeData = mergeDataStr.split('_');
        this.mergeId = parseInt(mergeData[0], 10);
        this.envStatus = parseInt(mergeData[1], 10);
        this.addtionId = parseInt(mergeData[2], 10);
    }

    GetMergeStageId() {
        return this.envIcon && this.envIcon.node.active ? null : this.mergeId;
    }

    StopAllActions() {
        if (this.icon && this.icon.node) Tween.stopAllByTarget(this.icon.node);
    }

    hideIconAnim() {
        if (this.iconAnim && this.iconAnim.node) {
            this.iconAnim.node.active = false;
        }
    }

    tryShowIconAnim(meta: any) {
        this._iconAnimLoadKey = (this._iconAnimLoadKey || 0) + 1;
        let loadKey = this._iconAnimLoadKey;
        this.hideIconAnim();
        if (this.icon && this.icon.node) {
            this.icon.node.active = this.mergeId > 0 && !this.IsBubble();
        }

        if (this.IsBubble() || !meta || !this.iconAnim || !this.iconAnim.node || !meta.Iconspine) return;
        let iconSpine = meta.Iconspine();
        if (!iconSpine) return;
        let resName = this.BASE_ANIM_URL + iconSpine;
        cce.loadRes(resName, sp.SkeletonData, (err: any, skeletonData: any) => {
            if (loadKey !== this._iconAnimLoadKey || !isValid(this.node)) return;
            if (err || !skeletonData) {
                console.log('load anim fail', resName, err);
                this.hideIconAnim();
                if (this.icon && this.icon.node) {
                    this.icon.node.active = this.mergeId > 0 && !this.IsBubble();
                }
                return;
            }
            if (!this.iconAnim) return;
            this.iconAnim.skeletonData = skeletonData;
            this.iconAnim.node.active = true;
            if (this.icon && this.icon.node) {
                this.icon.node.active = false;
            }
            this.iconAnim.clearTracks();
            this.iconAnim.setToSetupPose();
            if (this.cookingData) {
                this.PlayIconAnim('animation', true);
            }
        });
    }

    resetIconAnimPose() {
        if (!this.iconAnim || !this.iconAnim.node || !this.iconAnim.skeletonData) return;
        this.iconAnim.clearTracks();
        this.iconAnim.setToSetupPose();
    }

    PlayIconAnim(animName: string, loop = false) {
        if (!this.iconAnim || !this.iconAnim.node || !this.iconAnim.skeletonData || !animName) return false;
        if ((this.iconAnim as any).findAnimation && !(this.iconAnim as any).findAnimation(animName)) return false;
        this.iconAnim.node.active = true;
        if (this.icon && this.icon.node) {
            this.icon.node.active = false;
        }
        this.iconAnim.setAnimation(0, animName, loop);
        return true;
    }

    InitMergeItem(tx: number, ty: number, dataStr: string) {
        this.node.name = tx + '_' + ty;
        this.setTilePos(tx, ty);
        let mergeDataStr = Game.SUserMerge.ParseMergeMapData(dataStr);

        let isBubble = this.IsBubble();
        if (isBubble) {
            this.showBubbleIdle();
        } else {
            this.hideBubbleAnim();
        }

        this.SetMergeData(mergeDataStr);
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.mergeId);
        if (this.icon && meta) {
            this.icon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon());
        }
        if (this.icon_bubble_anim && this.icon) this.icon_bubble_anim.spriteFrame = this.icon.spriteFrame;
        if (this.icon && this.icon.node) {
            this.icon.node.setPosition(0, 0);
            this.icon.node.setScale(1, 1);
            this.icon.node.active = this.mergeId > 0 && !isBubble;
        }
        this.tryShowIconAnim(meta);

        let bgMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeBgElements, this.envStatus);
        if (bgMeta) {
            if (this.envIcon) {
                this.envIcon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIconBg, bgMeta.Icon());
                this.envIcon.node.active = true;
            }
            let additionMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.addtionId);
            if (additionMeta && !bgMeta.IsHalfSand()) {
                if (this.additionIcon) {
                    this.additionIcon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, additionMeta.Icon());
                    this.additionIcon.node.active = true;
                }
            } else if (this.additionIcon) {
                this.additionIcon.node.active = false;
            }
        } else {
            if (this.envIcon) this.envIcon.node.active = false;
            if (this.additionIcon) this.additionIcon.node.active = false;
        }

        if (this.icon_lock && this.additionIcon) this.icon_lock.node.active = this.additionIcon.node.active;
        if (this.hg && meta) this.hg.active = this.envStatus === -1 && (meta.IsMaxLevel() || meta.PrevId() !== -1 && meta.NextId() == -1);

        this.HideShiningAnim();
        this.refreshCapabilities();
        this.showCooking(meta);
    }

    HalfTransparent() {
        this.setIconOpacity(128);
    }

    RestoreTransparent() {
        this.setIconOpacity(255);
    }

    InitGenerator() {
        this.refreshCapabilities();
    }

    GetGeneratorInstanceId() {
        let g = this._getGeneratorCapability();
        return g ? g.GetGeneratorInstanceId() : null;
    }

    IfCanGenerate() {
        let g = this._getGeneratorCapability();
        return g ? g.IfCanGenerate() : false;
    }

    IsBubble() {
        return Game.SUserMerge.GetBubbleByTilePos(this.tx, this.ty) != null;
    }

    IfNeedOpen() {
        let g = this._getGeneratorCapability();
        return g ? g.IfNeedOpen() : false;
    }

    GetOpenTime() {
        let g = this._getGeneratorCapability();
        return g ? g.GetOpenTime() : '';
    }

    GetTouchEnable() {
        let blocked = false;
        this._forEachCapability((c: any) => {
            if (c.blocksTouch && c.blocksTouch()) blocked = true;
        });
        return !blocked;
    }

    IfCanDrag() {
        return (this.envStatus === -1 || this.IsBubble()) && this.GetTouchEnable();
    }

    IfCanMerge() {
        let bgMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeBgElements, this.envStatus);
        return (this.envStatus === -1 || bgMeta.IsHalfSand()) && this.IsBubble() == false;
    }

    IsCanSelect() {
        return this.IfCanMerge() || this.IsBubble();
    }

    IfHasAddition() {
        return !!(this.additionIcon && this.additionIcon.node.active);
    }

    IsHalfSand() {
        let bgMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeBgElements, this.envStatus);
        return bgMeta && bgMeta.IsHalfSand();
    }

    IsFullSand() {
        let bgMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeBgElements, this.envStatus);
        return this.envStatus > -1 && bgMeta && !bgMeta.IsHalfSand();
    }

    setItem(id: any, tx: number, ty: number, spriteFrame: any) {
        this.setIcon(spriteFrame, id);
        this.setTilePos(tx, ty);
    }

    CheckComplete(completeIds: any[], completeOrderIds: any[]) {
        completeIds = completeIds || [];
        completeOrderIds = completeOrderIds || [];
        let canUse = this.envStatus === -1 && this.IsBubble() == false;
        let done = completeIds.indexOf(this.mergeId) >= 0 && canUse;
        let inCompleteOrder = completeOrderIds.indexOf(this.mergeId) >= 0 && canUse;
        if (this.okIcon) this.okIcon.node.active = done;
        if (this.bottomRect) this.bottomRect.active = inCompleteOrder;
    }

    ShowShiningAnim() {
        if (!this.shiningAnim) return;
        this.shiningAnim.node.active = true;
    }

    HideShiningAnim() {
        if (!this.shiningAnim) return;
        this.shiningAnim.node.active = false;
    }

    hideBubbleAnim() {
        if (!this.bubble_anim || !this.bubble_anim.node) return;
        if ((this.bubble_anim as any).setCompleteListener) {
            (this.bubble_anim as any).setCompleteListener(null);
        }
        if (this.bubble_anim.clearTracks) {
            this.bubble_anim.clearTracks();
        }
        this.bubble_anim.node.active = false;
    }

    showBubbleIdle() {
        if (!this.bubble_anim || !this.bubble_anim.node) return false;
        this.bubble_anim.node.active = true;
        if ((this.bubble_anim as any).setCompleteListener) {
            (this.bubble_anim as any).setCompleteListener(null);
        }
        if (this.bubble_anim.clearTracks) {
            this.bubble_anim.clearTracks();
        }
        if (this.bubble_anim.setToSetupPose) {
            this.bubble_anim.setToSetupPose();
        }
        if ((this.bubble_anim as any).findAnimation && !(this.bubble_anim as any).findAnimation('idle')) return false;
        this.bubble_anim.setAnimation(0, 'idle', true);
        return true;
    }

    playBubbleBrokenOnce(cb?: Function) {
        if (!this.bubble_anim || !this.bubble_anim.node) {
            if (cb) cb();
            return false;
        }
        if ((this.bubble_anim as any).findAnimation && !(this.bubble_anim as any).findAnimation('broken')) {
            this.hideBubbleAnim();
            if (cb) cb();
            return false;
        }
        this.bubble_anim.node.active = true;
        if ((this.bubble_anim as any).setCompleteListener) {
            (this.bubble_anim as any).setCompleteListener(null);
        }
        if (this.bubble_anim.clearTracks) {
            this.bubble_anim.clearTracks();
        }
        if (this.bubble_anim.setToSetupPose) {
            this.bubble_anim.setToSetupPose();
        }

        let finished = false;
        let finish = () => {
            if (finished) return;
            finished = true;
            if (this.bubble_anim && (this.bubble_anim as any).setCompleteListener) {
                (this.bubble_anim as any).setCompleteListener(null);
            }
            this.hideBubbleAnim();
            if (cb) cb();
        };
        let trackEntry = this.bubble_anim.setAnimation(0, 'broken', false);
        if ((this.bubble_anim as any).setTrackCompleteListener && trackEntry) {
            (this.bubble_anim as any).setTrackCompleteListener(trackEntry, finish);
        } else if ((this.bubble_anim as any).setCompleteListener) {
            (this.bubble_anim as any).setCompleteListener(finish);
        } else {
            this.scheduleOnce(finish, 0.5);
        }
        return true;
    }

    setIcon(spriteFrame: any, mergeId?: any) {
        if (this.icon) this.icon.spriteFrame = spriteFrame;
        if (mergeId !== undefined) this.mergeId = mergeId;
        if (this.icon && this.icon.node) this.icon.node.active = this.mergeId > 0 && !this.IsBubble();
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.mergeId);
        this.tryShowIconAnim(meta);
    }

    setTilePos(tx: number, ty: number) {
        this.tx = tx;
        this.ty = ty;
    }

    hideIcon() {
        Tween.stopAllByTarget(this.node);
        this.node.setScale(Vec3.ONE);
        this.tx = -1;
        this.ty = -1;
        this._iconAnimLoadKey = (this._iconAnimLoadKey || 0) + 1;
        this.hideIconAnim();
        this.hideBubbleAnim();
        if (this.icon) this.icon.spriteFrame = null;
        if (this.cooking) this.cooking.active = false;
    }

    private setIconOpacity(opacity: number) {
        if (!this.icon || !this.icon.node) return;
        let uiOpacity = this.icon.node.getComponent(UIOpacity) || this.icon.node.addComponent(UIOpacity);
        uiOpacity.opacity = opacity;
    }
}

export default MergeItem
