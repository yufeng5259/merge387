import { _decorator, Animation, Component, Game as CocosGame, game, instantiate, isValid, Label, Node, Prefab, resources, RichText, tween, UITransform, Vec3 } from 'cc';
import { MergeDes } from './MergeDes';
import MergeTypes from './MergeTypes';
import { MergeEffectManager } from './MergeEffectManager';
import { MergeTempLibary } from './MergeTempLibary';
import { MergeDialogLibary } from './MergeDialogLibary';
import { MergeOrderGroup } from './MergeOrderGroup';
import MergeEmptyTaskGuide from './MergeEmptyTaskGuide';

const { ccclass, property } = _decorator;

@ccclass('MergeUI')
export class MergeUI extends Component {
    @property(Node)
    public storeButton: Node | null = null;

    @property(Node)
    public mergeDes: Node | null = null;

    @property(MergeOrderGroup)
    public orderGroup: MergeOrderGroup | null = null;

    @property(Node)
    public gridBg: Node | null = null;

    @property(Node)
    public mergeNodeRoot: Node | null = null;

    @property(Node)
    public topUI: Node | null = null;

    @property(Node)
    public bottomUI: Node | null = null;

    @property(Node)
    public notesUI: Node | null = null;

    @property(Node)
    public activitiesUI: Node | null = null;

    @property(MergeTempLibary)
    public notetemp: MergeTempLibary | null = null;

    @property(MergeDialogLibary)
    public noteDialog: MergeDialogLibary | null = null;

    @property(Animation)
    public mergeAdditionDscAnim: Animation | null = null;

    @property(Prefab)
    public levelPrefab: Prefab | null = null;

    @property(MergeEffectManager)
    public mergeEffectManager: MergeEffectManager | null = null;

    public mergeLevelNode: any = null;
    public activityBoxData: any = null;
    private _bottomTouchButton: Node | null = null;
    private _emptyTaskGuideDisposed = false;
    private _emptyTaskGuideVisible = false;
    private _emptyTaskGuideEventShowCallback: Function | null = null;
    private _emptyTaskGuideCallbacks: Array<(guide: Node | null, label: RichText | null) => void> = [];
    private _emptyTaskGuideLoading = false;
    private _emptyTaskArrowClickActionPlaying = false;
    private emptyTaskGuide: Node | null = null;
    private emptyTaskLabel: RichText | null = null;
    private emptyTaskArrow: Node | null = null;
    private _delayNotesUIVisible = false;
    private _pendingNotesUIVisible = false;
    private _orderUiStarted = false;
    private _orderLifecycleRegistered = false;
    private _orderScheduledChargeAt = 0;
    private _eventKey = '';
    private _orderChargeDueHandler!: () => void;
    private _orderForegroundSyncHandler!: () => void;
    private _orderGameShowHandler!: () => void;
    private _orderGameHideHandler!: () => void;
    private _updateOrderStatusHandler!: () => void;
    private _coinEventHandler!: () => void;
    private _pendingRewardsHandler!: () => void;
    private _pendingRewardsRefreshHandler!: () => void;
    private _levelOrderAllCompleteHandler!: () => void;

    onLoad () {
        this._orderChargeDueHandler = this.onOrderChargeDue.bind(this);
        this._orderForegroundSyncHandler = this.onOrderForegroundSync.bind(this);
        this._orderGameShowHandler = this.onOrderGameShow.bind(this);
        this._orderGameHideHandler = this.onOrderGameHide.bind(this);
        this._updateOrderStatusHandler = this.updateOrderStatusAfterOrderRefresh.bind(this);
        this._coinEventHandler = this.onDialogDataChanged.bind(this);
        this._pendingRewardsHandler = this.onPendingRewardsChanged.bind(this);
        this._pendingRewardsRefreshHandler = this.refreshPendingRewardsUI.bind(this);
        this._levelOrderAllCompleteHandler = this.onLevelOrderAllComplete.bind(this);
        this._eventKey = `MergeUI:${this.node.uuid}`;
        this.node.on(Node.EventType.TOUCH_START, this._onBottomUITouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_END, this._onBottomUITouchEnd, this, true);
    }

    CreateMergeLevelNode () {
        if (!this.levelPrefab || !this.mergeNodeRoot) return null;
        const levelNode = instantiate(this.levelPrefab);
        this.mergeLevelNode = levelNode.getComponent('LevelMergeNode');
        levelNode.setPosition(0, 0);
        levelNode.parent = this.mergeNodeRoot;
        levelNode.setSiblingIndex(1);
        return this.mergeLevelNode;
    }

    start () {
        this._emptyTaskGuideDisposed = false;
        this._orderUiStarted = true;
        this.registerOrderLifecycle();
        this.FitScreenUI();
    }

    cancelOrderChargeTimer () {
        this.unschedule(this._orderChargeDueHandler);
        this.unschedule(this._orderForegroundSyncHandler);
        this.unschedule(this._updateOrderStatusHandler);
    }

    registerOrderLifecycle () {
        if (this._orderLifecycleRegistered) return;
        game.on(CocosGame.EVENT_SHOW, this._orderGameShowHandler);
        game.on(CocosGame.EVENT_HIDE, this._orderGameHideHandler);
        const events = GameKit.GameEvent.EventName;
        GameKit.GameEvent.RegisterEvent(events.CoinEvent, this._eventKey, this._coinEventHandler);
        GameKit.GameEvent.RegisterEvent(events.PendingRewardsUpdated, this._eventKey, this._pendingRewardsHandler);
        GameKit.GameEvent.RegisterEvent(events.LevelOrderAllComplete, this._eventKey, this._levelOrderAllCompleteHandler);
        this._orderLifecycleRegistered = true;
    }

    unregisterOrderLifecycle () {
        if (!this._orderLifecycleRegistered) return;
        game.off(CocosGame.EVENT_SHOW, this._orderGameShowHandler);
        game.off(CocosGame.EVENT_HIDE, this._orderGameHideHandler);
        const events = GameKit.GameEvent.EventName;
        GameKit.GameEvent.UnRegisterEvent(events.PendingRewardsUpdated, this._eventKey);
        GameKit.GameEvent.UnRegisterEvent(events.CoinEvent, this._eventKey);
        GameKit.GameEvent.UnRegisterEvent(events.LevelOrderAllComplete, this._eventKey);
        this._orderLifecycleRegistered = false;
    }

    canSyncOrderUI () {
        return this.isValidNode(this.node) && this.node.activeInHierarchy !== false
            && !!Game.SUserMerge?.GetOrders && !!this.orderGroup?.InitOrderList
            && !!this.mergeLevelNode?.updateOrderStatus;
    }

    scheduleNextOrderCharge () {
        this.unschedule(this._orderChargeDueHandler);
        const nextChargeAt = SR?.SRMerge?.GetNextOrderChargeAt?.() || 0;
        this._orderScheduledChargeAt = nextChargeAt;
        if (!nextChargeAt) return;
        const now = GameKit.TimeUtil.getCurrentTime();
        this.scheduleOnce(this._orderChargeDueHandler, Math.max(0, nextChargeAt - now) + 0.1);
    }

    onOrderChargeDue () {
        this._orderScheduledChargeAt = 0;
        if (this.canSyncOrderUI()) this.InitOrderList();
    }

    onOrderGameHide () {
        this.cancelOrderChargeTimer();
        this.unschedule(this._pendingRewardsRefreshHandler);
    }

    onOrderGameShow () {
        this.schedulePendingRewardsRefresh();
        if (!this._orderUiStarted) return;
        this.unschedule(this._orderForegroundSyncHandler);
        this.scheduleOnce(this._orderForegroundSyncHandler, 0.1);
    }

    onOrderForegroundSync () {
        if (!this.canSyncOrderUI() || AppGame?.instance?.logined === false) return;
        const now = GameKit.TimeUtil.getCurrentTime();
        if (AppGame?.instance?.leaveTime && now - AppGame.instance.leaveTime > GameKit.TimeUtil.HourInSecond) return;
        if (this.shouldRebuildOrderListOnForeground() || (this._orderScheduledChargeAt > 0 && this._orderScheduledChargeAt <= now)) {
            this.InitOrderList();
            return;
        }
        this.unschedule(this._updateOrderStatusHandler);
        this.scheduleOnce(this._updateOrderStatusHandler);
        this.scheduleNextOrderCharge();
    }

    shouldRebuildOrderListOnForeground () {
        const mergeData = Game.SUserMerge?.data || {};
        const orderData = mergeData.orderData || {};
        if (this.isValidNode(this.emptyTaskGuide) && this.emptyTaskGuide!.active) return true;
        if (orderData.waitingForLevelUpgrade === true) return true;
        const currentLevel = Number.parseInt(Game.SUser?.Level?.());
        if (!Number.isFinite(currentLevel) || currentLevel <= 0) return false;
        let snapshotLevel = Number.parseInt(orderData.playerLevel);
        if (!Number.isFinite(snapshotLevel) || snapshotLevel <= 0) snapshotLevel = Number.parseInt(mergeData.playerLevel);
        return Number.isFinite(snapshotLevel) && snapshotLevel > 0 && snapshotLevel !== currentLevel;
    }

    updateOrderStatusAfterOrderRefresh () {
        if (this.canSyncOrderUI()) this.mergeLevelNode.updateOrderStatus();
    }

    onDestroy () {
        this.node.off(Node.EventType.TOUCH_START, this._onBottomUITouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_END, this._onBottomUITouchEnd, this, true);
        this.ClearAll();
    }

    ClearAll () {
        this._emptyTaskGuideDisposed = true;
        this._orderUiStarted = false;
        this.cancelOrderChargeTimer();
        this.unregisterOrderLifecycle();
        this.clearEmptyTaskGuide();
    }

    onEnable () {
        this.registerOrderLifecycle();
        this.schedulePendingRewardsRefresh();
        if (this._orderUiStarted) {
            this.onDialogDataChanged();
            this.onOrderGameShow();
        }
    }

    onDisable () {
        this.cancelOrderChargeTimer();
        this.unschedule(this._pendingRewardsRefreshHandler);
        this.unregisterOrderLifecycle();
    }

    onLevelOrderAllComplete () {
        this.scheduleEmptyTaskGuideFromEvent();
    }

    scheduleEmptyTaskGuideFromEvent () {
        this.cancelEmptyTaskGuideEventSchedule();
        const callback = () => {
            this._emptyTaskGuideEventShowCallback = null;
            this.showEmptyTaskGuide();
        };
        this._emptyTaskGuideEventShowCallback = callback;
        this.scheduleOnce(callback, MergeEmptyTaskGuide.EventShowDelaySeconds);
    }

    cancelEmptyTaskGuideEventSchedule () {
        if (!this._emptyTaskGuideEventShowCallback) return;
        this.unschedule(this._emptyTaskGuideEventShowCallback as any);
        this._emptyTaskGuideEventShowCallback = null;
    }

    getNodeByPath (root: Node | null, path: string) {
        if (!root || !path) return null;
        let node: Node | null = root;
        for (const part of path.split(/[/.>]/).map(item => item.trim()).filter(Boolean)) {
            node = node?.getChildByName(part) || null;
            if (!node) return null;
        }
        return node;
    }

    isValidNode (node: Node | null) {
        return !!node && isValid(node);
    }

    getEmptyTaskGuideContainer () {
        return this.getNodeByPath(this.topUI, MergeEmptyTaskGuide.ContainerPathFromTopUI) ||
            this.getNodeByPath(this.node, MergeEmptyTaskGuide.ContainerPathFromMergeUI);
    }

    refreshEmptyTaskGuideMessage () {
        if (this.emptyTaskLabel) this.emptyTaskLabel.string = MergeEmptyTaskGuide.getTaskEmptyMessage(GameKit.i18n);
    }

    bringEmptyTaskGuideContainerToTop (container: Node) {
        if (container.parent) container.setSiblingIndex(container.parent.children.length - 1);
    }

    showEmptyTaskGuide () {
        this._emptyTaskGuideVisible = true;
        const container = this.getEmptyTaskGuideContainer();
        if (!container) return;
        if (!this.emptyTaskGuide) {
            this.loadEmptyTaskGuide(() => {
                if (this._emptyTaskGuideVisible) this.showEmptyTaskGuide();
            });
            return;
        }
        if (this._emptyTaskGuideDisposed || !this.emptyTaskGuide) return;
        this.bringEmptyTaskGuideContainerToTop(container);
        this.emptyTaskGuide.parent = container;
        this.emptyTaskGuide.setPosition(0, MergeEmptyTaskGuide.GuideOffsetY);
        this.emptyTaskGuide.setSiblingIndex(container.children.length - 1);
        this.emptyTaskGuide.active = this._emptyTaskGuideVisible;
        this.refreshEmptyTaskGuideMessage();
        this.showEmptyTaskArrow();
    }

    hideEmptyTaskGuide () {
        this.cancelEmptyTaskGuideEventSchedule();
        this._emptyTaskGuideVisible = false;
        if (this.isValidNode(this.emptyTaskGuide)) this.emptyTaskGuide!.active = false;
        this.hideEmptyTaskArrow();
    }

    clearEmptyTaskGuide () {
        this.cancelEmptyTaskGuideEventSchedule();
        this.hideEmptyTaskArrow();
        if (this.isValidNode(this.emptyTaskGuide)) this.emptyTaskGuide!.destroy();
        this.emptyTaskGuide = null;
        this.emptyTaskLabel = null;
        this.emptyTaskArrow = null;
    }

    getEmptyTaskArrowNode () {
        return this.getNodeByPath(this.topUI, MergeEmptyTaskGuide.ArrowPathFromTopUI) ||
            this.getNodeByPath(this.node, MergeEmptyTaskGuide.ArrowPathFromMergeUI);
    }

    hideEmptyTaskArrow () {
        if (!this.isValidNode(this.emptyTaskArrow)) return;
        tween(this.emptyTaskArrow!).stop();
        this._emptyTaskArrowClickActionPlaying = false;
        this.emptyTaskArrow!.active = false;
        this.emptyTaskArrow!.setScale(Vec3.ONE);
    }

    showEmptyTaskArrow () {
        this.emptyTaskArrow = this.getEmptyTaskArrowNode();
        if (!this.emptyTaskArrow) return;
        this.emptyTaskArrow.active = true;
        if (this._emptyTaskArrowClickActionPlaying) return;
        tween(this.emptyTaskArrow).stop();
        this.playEmptyTaskArrowClickAction(this.emptyTaskArrow);
    }

    playEmptyTaskArrowClickAction (arrow: Node) {
        this._emptyTaskArrowClickActionPlaying = true;
        tween(arrow).repeatForever(
            tween().to(0.15, { scale: new Vec3(0.88, 0.88, 1) }).to(0.18, { scale: Vec3.ONE }).delay(0.45)
        ).start();
    }

    loadEmptyTaskGuide (callback: (guide: Node | null, label: RichText | null) => void) {
        if (this.emptyTaskGuide) {
            callback(this.emptyTaskGuide, this.emptyTaskLabel);
            return;
        }
        this._emptyTaskGuideCallbacks.push(callback);
        if (this._emptyTaskGuideLoading) return;
        this._emptyTaskGuideLoading = true;
        const prefab = UIRoot.instance?.winPres?.MergeTutorialWindow;
        if (prefab) {
            this.finishEmptyTaskGuideLoad(this.createEmptyTaskGuideFromPrefab(prefab));
            return;
        }
        resources.load('window/Other/MergeTutorialWindow', Prefab, (error, loadedPrefab) => {
            if (error || !loadedPrefab) {
                Logs.Warning('load EmptyTaskGuide failed', error);
                this.finishEmptyTaskGuideLoad(null);
                return;
            }
            this.finishEmptyTaskGuideLoad(this.createEmptyTaskGuideFromPrefab(loadedPrefab));
        });
    }

    createEmptyTaskGuideFromPrefab (prefab: Prefab) {
        const windowNode = instantiate(prefab);
        const guide = windowNode.getChildByName('EmptyTaskGuide');
        const label = this.getNodeByPath(guide, 'dialoggirl/msg')?.getComponent(RichText) || null;
        guide?.removeFromParent();
        windowNode.destroy();
        return { guide, label };
    }

    finishEmptyTaskGuideLoad (result: { guide: Node | null; label: RichText | null } | null) {
        this._emptyTaskGuideLoading = false;
        const callbacks = this._emptyTaskGuideCallbacks;
        this._emptyTaskGuideCallbacks = [];
        if (this._emptyTaskGuideDisposed) {
            result?.guide?.destroy();
            return;
        }
        this.emptyTaskGuide = result?.guide || null;
        this.emptyTaskLabel = result?.label || null;
        for (const callback of callbacks) callback(this.emptyTaskGuide, this.emptyTaskLabel);
    }

    updateEmptyTaskGuideByOrders (orders: any[]) {
        if (MergeEmptyTaskGuide.shouldShowForUserMerge(Game.SUserMerge)) this.showEmptyTaskGuide();
        else if (MergeEmptyTaskGuide.shouldHideForOrders(orders)) this.hideEmptyTaskGuide();
    }

    BeginDelayNotesUIVisible () { this._delayNotesUIVisible = true; }
    EndDelayNotesUIVisible () {
        this._delayNotesUIVisible = false;
        if (this._pendingNotesUIVisible) {
            this._pendingNotesUIVisible = false;
            this._updateNotesUIVisible();
        }
    }
    UpdateNotesUIVisibleSafe () {
        if (this._delayNotesUIVisible) this._pendingNotesUIVisible = true;
        else this._updateNotesUIVisible();
    }

    SetActivityBox (box: any) {
        if (AppKit.NativeWrap.isNewApp()) return;
        this.activityBoxData = this.activityBoxData || {};
        if (this.activityBoxData[box.meta.Id()]) return;

        this.activityBoxData[box.meta.Id()] = box;
        box.node.parent = this.activitiesUI;
        box.node.setPosition(0, box.node.position.y, box.node.position.z);
        this._updateActivitiesUIVisible();
    }

    UpdateActivityBox (meta: any) {
        if (this.activityBoxData && this.activityBoxData[meta.Id()]) {
            const box = this.activityBoxData[meta.Id()];
            if (box && box.meta.EndTime() != meta.EndTime()) {
                box.updateMeta(meta);
            }
        }
    }

    RemoveActivityBox (id: any) {
        if (this.activityBoxData && this.activityBoxData[id]) {
            this.activityBoxData[id].node.removeFromParent();
            this.activityBoxData[id].node.destroy();
            this.activityBoxData[id] = null;
            this._updateActivitiesUIVisible();
        }
    }

    InitUI () {
        if (this.mergeAdditionDscAnim) this.mergeAdditionDscAnim.node.active = false;
        this.RefreshUpgradeButtonVisible();
        this.ShowMergeDes(null);
        this.InitOrderList();
        this.refreshPendingRewardsUI();
        this._updateActivitiesUIVisible();
    }

    _updateActivitiesUIVisible () {
        if (this.activitiesUI) this.activitiesUI.active = this.activitiesUI.children.length > 0;
    }

    _updateNotesUIVisible () {
        if (this.notesUI) this.notesUI.active = !!(this.notetemp?.node.active || this.noteDialog?.node.active);
    }

    PlayHeChengShiEnter (worldPos: Vec3) {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayHeChengShiEnter) return;
        this.mergeEffectManager.PlayHeChengShiEnter(worldPos);
    }

    PlayHeChengShiLeave () {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayHeChengShiLeave) return;
        this.mergeEffectManager.PlayHeChengShiLeave();
    }

    PlayJueSeWanChengEnter (worldPos: Vec3) {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayJueSeWanChengEnter) return;
        this.mergeEffectManager.PlayJueSeWanChengEnter(worldPos);
    }

    PlayShouJiJinBiEnter (worldPos: Vec3, options?: any) {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayShouJiJinBiEnter) return;
        this.mergeEffectManager.PlayShouJiJinBiEnter(worldPos, options);
    }

    PlayShaGePoSuiEnter (worldPos: Vec3, options?: any) {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayShaGePoSuiEnter) return;
        this.mergeEffectManager.PlayShaGePoSuiEnter(worldPos, options);
    }

    PlayQiZiLuoDiEnter (worldPos: Vec3, options?: any) {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayQiZiLuoDiEnter) return;
        this.mergeEffectManager.PlayQiZiLuoDiEnter(worldPos, options);
    }

    PlayQiZiHeChengEnter (worldPos: Vec3, options?: any) {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayQiZiHeChengEnter) return;
        this.mergeEffectManager.PlayQiZiHeChengEnter(worldPos, options);
    }

    PlayCangKuPutEnter () {
        this.mergeEffectManager?.PlayCangKuPutEnter(this.GetStoreButtonGlobalPos());
    }

    PlayCangKuPutLeave () { this.mergeEffectManager?.PlayCangKuPutLeave(); }
    CancelCangKuPutPreview () { this.mergeEffectManager?.CancelCangKuPutPreview(); }
    PlayCangKuTakeOut (worldPos: Vec3) { this.mergeEffectManager?.PlayCangKuTakeOut(worldPos); }
    PlayShengChanQiTiShiEnter (worldPos: Vec3) { this.mergeEffectManager?.PlayShengChanQiTiShiEnter(worldPos); }

    getUserInfoResourceTargetNode (userInfo: any, contentType: any) {
        const type = contentType ?? Game.Content.Types.Coin;
        if (type === Game.Content.Types.Ap) {
            const root = userInfo.labelAp?.node.parent || userInfo.labelApFull?.node.parent;
            return root?.getChildByName('icon') || userInfo.labelAp?.node || userInfo.labelApFull?.node;
        }
        if (type === Game.Content.Types.Cash) {
            const root = userInfo.cashLabel?.node.parent;
            return userInfo.cashIcon?.node || root?.getChildByName('icon') || userInfo.cashLabel?.node;
        }
        const root = userInfo.labelCoin?.node.parent;
        return root?.getChildByName('icon') || userInfo.spriteCoin?.node || userInfo.labelCoin?.node;
    }

    getFlySpineAnimIndexByContentType (contentType: any) {
        const type = contentType ?? Game.Content.Types.Coin;
        if (type === Game.Content.Types.Coin || type === Game.Content.Types.ShopCoin) return 0;
        if (type === Game.Content.Types.Exp) return 1;
        if (type === Game.Content.Types.Ap) return 2;
        if (type === Game.Content.Types.Cash) return 3;
        return null;
    }

    _updateUpgradeButtonVisible (canUpgrade: boolean) {
        const hammer = this.bottomUI?.getChildByName('hammerButton') || this.bottomUI?.getChildByName('hammer_btn');
        const build = this.bottomUI?.getChildByName('buildButton') || this.bottomUI?.getChildByName('build_btn');
        if (hammer) hammer.active = !!canUpgrade;
        if (build) build.active = !canUpgrade;
    }

    RefreshUpgradeButtonVisible () {
        const canUpgrade = Game.SUserMap.IsRedPoint();
        if (this.noteDialog) this.noteDialog.node.active = canUpgrade;
        this._updateUpgradeButtonVisible(canUpgrade);
        return canUpgrade;
    }

    isValidFlySpineAnimIndex (spineAnimIndex: any) {
        const index = Number.parseInt(spineAnimIndex, 10);
        return Number.isFinite(index) && index >= 0 && index <= 3;
    }

    shouldPlayBpCoinFlySound (contentType: any, options?: any) {
        if (options?.playBpCoinFlySound != null) return !!options.playBpCoinFlySound;
        const type = contentType ?? Game.Content.Types.Coin;
        return type === Game.Content.Types.Coin || type === Game.Content.Types.ShopCoin;
    }

    vibrateResourceArrive (contentType: any) {
        const type = contentType ?? Game.Content.Types.Coin;
        if (type === Game.Content.Types.Ap || type === Game.Content.Types.Coin || type === Game.Content.Types.ShopCoin) {
            AppKit.NativeWrap?.VibrateShortSequence?.();
        }
    }

    PlayCoinFlyToTargetAnim (globalFromPos: Vec3, animCount: number, textures: any, contentType?: any, toWorldPos?: Vec3, cb?: Function, options: any = {}) {
        const userInfo = GameMainWindow.instance.userinfo;
        const playSound = this.shouldPlayBpCoinFlySound(contentType, options);
        let resolvedToWorldPos = toWorldPos;
        if (resolvedToWorldPos === undefined || resolvedToWorldPos === null) {
            const targetNode = this.getUserInfoResourceTargetNode(userInfo, contentType);
            if (!targetNode) return;
            const targetTransform = targetNode.getComponent(UITransform);
            resolvedToWorldPos = targetTransform ? targetTransform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
        }
        if (options.spineAnimIndex == null) options.spineAnimIndex = this.getFlySpineAnimIndexByContentType(contentType);
        if (this.isValidFlySpineAnimIndex(options.spineAnimIndex)) {
            options.spineAnimIndex = Number.parseInt(options.spineAnimIndex, 10);
            textures = null;
        }
        let numAnimPlayed = false;
        GameMainWindow.instance.coinFlyToTargetAnim.PlayAnim(globalFromPos, resolvedToWorldPos, 1.0, 0.15, animCount, textures, cb, (worldPos: Vec3, flyNode: Node) => {
            if (!flyNode || !isValid(flyNode)) return;
            if (playSound) GameKit.SoundManager?.playBpCoinFlySound?.();
            this.PlayShouJiJinBiEnter(worldPos, {
                parent: flyNode.parent,
                position: flyNode.position,
                siblingIndex: flyNode.getSiblingIndex(),
            });
            if (!numAnimPlayed) {
                numAnimPlayed = true;
                const type = contentType ?? Game.Content.Types.Coin;
                if (userInfo?.playPendingResourceNumAnim?.(type)) this.vibrateResourceArrive(type);
            }
        }, options);
    }

    PlayCoinFlyToTargetAnimNew (globalFromPos: Vec3, animCount: number, textures: any, contentType?: any, toWorldPos?: Vec3, cb?: Function, options: any = {}) {
        animCount = Number(animCount);
        if (!Number.isFinite(animCount) || animCount <= 0) {
            cb?.();
            return;
        }
        const userInfo = GameMainWindow.instance.userinfo;
        let targetNode = this.getUserInfoResourceTargetNode(userInfo, contentType);
        let resolvedToWorldPos = toWorldPos;
        if (resolvedToWorldPos == null) {
            if (!targetNode) return;
            resolvedToWorldPos = targetNode.getComponent(UITransform)?.convertToWorldSpaceAR(Vec3.ZERO) || targetNode.worldPosition;
        }
        if (options.spineAnimIndex == null) options.spineAnimIndex = this.getFlySpineAnimIndexByContentType(contentType);
        if (this.isValidFlySpineAnimIndex(options.spineAnimIndex)) {
            options.spineAnimIndex = Number.parseInt(options.spineAnimIndex, 10);
            textures = null;
        }
        let numAnimPlayed = false;
        const arrive = (worldPos: Vec3, flyNode: Node) => {
            if (!flyNode || !isValid(flyNode)) return;
            if (this.shouldPlayBpCoinFlySound(contentType, options)) GameKit.SoundManager?.playBpCoinFlySound?.();
            this.PlayShouJiJinBiEnter(worldPos, { parent: flyNode.parent, position: flyNode.position, siblingIndex: flyNode.getSiblingIndex() });
            if (!numAnimPlayed) {
                numAnimPlayed = true;
                const type = contentType ?? Game.Content.Types.Coin;
                if (userInfo?.playPendingResourceNumAnim?.(type)) this.vibrateResourceArrive(type);
            }
        };
        const flyAnim = GameMainWindow.instance.coinFlyToTargetAnim;
        if (!flyAnim) return cb?.();
        if (!flyAnim.PlayResourceCollectAnim) {
            flyAnim.PlayAnim(globalFromPos, resolvedToWorldPos, 1, 0.15, animCount, textures, cb, arrive, options);
            return;
        }
        flyAnim.PlayResourceCollectAnim({
            globalFromPos, globalToPos: resolvedToWorldPos, contentType, animCount, textures,
            spriteFrame: textures?.[0] || null, spineAnimIndex: options.spineAnimIndex, targetNode,
            cb, arriveCb: arrive, flySpeed: Number(options.flySpeed) > 0 ? Number(options.flySpeed) : 600,
            minFlyTime: Number(options.minFlyTime) > 0 ? Number(options.minFlyTime) : null,
            maxFlyTime: Number(options.maxFlyTime) > 0 ? Number(options.maxFlyTime) : 1.4,
        });
    }

    PlayCollectAnimation (activityData: any[], cb?: Function) {
        let successCount = 0;
        const totalCount = activityData.length;
        if (successCount >= totalCount) {
            if (cb) cb();
            return;
        }
        for (const data of activityData) {
            const fromWorldPos = data.fromWorldPos;
            const animCount = data.animCount;
            const activityId = data.activityId;
            const box = this.activityBoxData && this.activityBoxData[activityId];
            if (box) {
                const icon = box.icon;
                const iconTransform = icon.node.getComponent(UITransform);
                const toWorldPos = iconTransform ? iconTransform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
                GameMainWindow.instance.coinFlyToTargetAnim.PlayCollectAnim(icon.spriteFrame, fromWorldPos, toWorldPos, animCount, () => {
                    if (box.updateShow) box.updateShow();
                    successCount++;
                    if (successCount >= totalCount && cb) cb();
                });
            } else {
                successCount++;
                if (successCount >= totalCount && cb) cb();
            }
        }
    }

    onDialogDataChanged (data?: any) {
        const canUpgrade = Game.SUserMap.IsRedPoint();
        if (this.noteDialog) this.noteDialog.node.active = canUpgrade;
        this._updateUpgradeButtonVisible(canUpgrade);
        this.UpdateNotesUIVisibleSafe();
    }

    onPendingRewardsChanged () {
        this.refreshPendingRewardsUI();
    }

    schedulePendingRewardsRefresh () {
        this.unschedule(this._pendingRewardsRefreshHandler);
        this.scheduleOnce(this._pendingRewardsRefreshHandler);
    }

    refreshPendingRewardsUI () {
        if (!this.isValidNode(this.node) || !this.node.activeInHierarchy || !this.notetemp?.ShowIcon || !Game.SUserMerge?.GetLastPendingRewards) return false;
        try {
            if (Game.MergeTutorialManager?.ShouldHideTempRewardForGuide?.()) this.notetemp.node.active = false;
            else this.notetemp.ShowIcon(Game.SUserMerge.GetLastPendingRewards());
            this.UpdateNotesUIVisibleSafe();
            return true;
        } catch (_) {
            return false;
        }
    }

    FitScreenUI () {
        GameKit.MergeUtil.getSize();
        const ssize = GameKit.MergeUtil.getWinSize();
        const gridTransform = this.gridBg ? this.gridBg.getComponent(UITransform) : null;
        const bottomTransform = this.bottomUI ? this.bottomUI.getComponent(UITransform) : null;
        const gridSize = gridTransform ? { width: gridTransform.width, height: gridTransform.height } : { width: 0, height: 0 };
        const bottomSize = bottomTransform ? { width: bottomTransform.width, height: bottomTransform.height } : { width: 0, height: 0 };
        if (GameKit.MergeUtil.isLongScreen()) {
            const nw = ssize.width - 10;
            const scale = gridSize.width > 0 ? nw / gridSize.width : 1;
            this.gridBg?.setScale(scale, scale);
            const bottomY = -(ssize.height / 2 - bottomSize.height / 2 - 50);
            if (this.bottomUI) this.bottomUI.setPosition(this.bottomUI.position.x, bottomY, this.bottomUI.position.z);
            const gridY = bottomY + bottomSize.height / 2 + (gridSize.height * (this.gridBg?.scale.y || 1)) / 2 + 10;
            if (this.gridBg) this.gridBg.setPosition(this.gridBg.position.x, gridY, this.gridBg.position.z);
            if (this.topUI) this.topUI.setPosition(this.topUI.position.x, gridY + (gridSize.height * (this.gridBg?.scale.y || 1)) / 2 + 20, this.topUI.position.z);
        } else {
            this.gridBg?.setScale(0.9, 0.9);
            const bottomY = -(ssize.height / 2 - bottomSize.height / 2 - 30);
            if (this.bottomUI) this.bottomUI.setPosition(this.bottomUI.position.x, bottomY, this.bottomUI.position.z);
            const gridY = bottomY + bottomSize.height / 2 + (gridSize.height * (this.gridBg?.scale.y || 1)) / 2;
            if (this.gridBg) this.gridBg.setPosition(this.gridBg.position.x, gridY, this.gridBg.position.z);
            if (this.topUI) this.topUI.setPosition(this.topUI.position.x, gridY + (gridSize.height * (this.gridBg?.scale.y || 1)) / 2, this.topUI.position.z);
        }
        this._bringMergeGridToTop();
    }

    _bringMergeGridToTop () {
        if (!this.gridBg || !this.gridBg.parent) return;
        this.gridBg.setSiblingIndex(this.gridBg.parent.children.length - 1);
    }

    _isTouchInNode (e: any, node: Node | null) {
        if (!e || !node) return false;
        const transform = node.getComponent(UITransform);
        if (!transform || !e.getLocation) return false;
        const touchPoint = e.getLocation();
        const rect = transform.getBoundingBoxToWorld();
        return touchPoint.x >= rect.x &&
            touchPoint.x <= rect.x + rect.width &&
            touchPoint.y >= rect.y &&
            touchPoint.y <= rect.y + rect.height;
    }

    _isNodeOrChildOf (node: Node | null, parent: Node | null) {
        while (node) {
            if (node === parent) return true;
            node = node.parent;
        }
        return false;
    }

    _stopEventPropagation (e: any) {
        if (e && e.stopPropagation) e.stopPropagation();
    }

    _getBottomButtonAtTouch (e: any) {
        const buildButton = this.bottomUI ? this.bottomUI.getChildByName('build_btn') : null;
        if (this._isTouchInNode(e, buildButton)) return buildButton;
        if (this._isTouchInNode(e, this.storeButton)) return this.storeButton;
        return null;
    }

    _onBottomUITouchStart (e: any) {
        this._bottomTouchButton = this._getBottomButtonAtTouch(e);
        if (this._bottomTouchButton && e && e.target && !this._isNodeOrChildOf(e.target, this._bottomTouchButton)) {
            this._stopEventPropagation(e);
        }
    }

    _onBottomUITouchEnd (e: any) {
        const button = this._bottomTouchButton;
        this._bottomTouchButton = null;
        if (!button || button !== this._getBottomButtonAtTouch(e)) return;
        if (e && e.target && this._isNodeOrChildOf(e.target, button)) return;
        this._stopEventPropagation(e);
        if (button.name === 'build_btn') {
            this.onClickOpenVillage();
        } else if (button === this.storeButton || button.name === 'store_btn') {
            this.onClickOpenStore();
        }
    }

    PlayWaitCreateAnimItems () {
        if (!this.mergeEffectManager || !this.mergeEffectManager.PlayTiShiEnter || !this.mergeLevelNode) return;
        const waitCreateAnimItemsTilePos = this.mergeLevelNode.waitCreateAnimItemsTilePos;
        while (waitCreateAnimItemsTilePos.length > 0) {
            const tilePos = waitCreateAnimItemsTilePos.shift();
            const layout = this.mergeLevelNode.getMergeBoardLayout();
            const localPos = GameKit.MergeUtil.tile2px(tilePos.x, tilePos.y, layout);
            const transform = GamePlay.instance.mergeRoot.mergeLevelNode.node.getComponent(UITransform);
            const worldPos = transform ? transform.convertToWorldSpaceAR(new Vec3(localPos.x, localPos.y, 0)) : new Vec3(localPos.x, localPos.y, 0);
            this.mergeEffectManager.PlayTiShiEnter(worldPos);
        }
    }

    PlayAdditionDscAnim (dscStr = '在沙子旁进行合成来解锁奖励！') {
        const additionAnim = this.mergeAdditionDscAnim;
        if (!additionAnim) return;
        const label = GameKit.ControllerTable.GetNode(additionAnim.node, 'label').getComponent(Label);
        if (label) label.string = dscStr;
        additionAnim.node.active = true;
        additionAnim.once(Animation.EventType.FINISHED, () => {
            additionAnim.node.active = false;
        });
        additionAnim.play();
    }

    PlayCollectAdditionAnimGroup (groupData: any[], groupMeta: any[], pbcb?: Function, allcb?: Function) {
        const promiseChain = groupData.reduce((prevPromise, item, index) => {
            return prevPromise.then(() => {
                if (pbcb) pbcb(item.mergeItem, groupMeta[index]);
                return this.PlayCollectAdditionAnim(item.tempDataStr, item.tempSpf, item.globalPos).then(() => {
                    this.notetemp?.ShowIcon({ t: 'piece', d: item.tempDataStr });
                });
            });
        }, Promise.resolve());

        promiseChain.then(() => {
            if (allcb) allcb();
        });
    }

    PlayCollectAdditionAnim (tempDataStr: any, additionSpf: any, globalPos: Vec3) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const anim = GamePlay.instance.mergeRoot.raidAnim;
                const iconNode = this.notetemp?.icon ? this.notetemp.icon.node : null;
                const iconTransform = iconNode ? iconNode.getComponent(UITransform) : null;
                const toGlobalPos = iconTransform ? iconTransform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
                anim.play2(globalPos, toGlobalPos, additionSpf, () => {
                    resolve();
                });
            }, 0);
        });
    }

    InitOrderList () {
        if (!this.canSyncOrderUI()) return;
        if (typeof SR !== 'undefined' && SR.SRMerge && SR.SRMerge.SyncLocalOrders) {
            SR.SRMerge.SyncLocalOrders('InitOrderList');
        }
        const orders = Game.SUserMerge.GetOrders();
        this.orderGroup!.InitOrderList(orders);
        this.updateEmptyTaskGuideByOrders(orders);
        this.unschedule(this._updateOrderStatusHandler);
        this.scheduleOnce(this._updateOrderStatusHandler);
        this.scheduleNextOrderCharge();
    }

    HideOrderCompleteBtn () {
        this.orderGroup?.HideOrderCompleteBtn();
    }

    CheckOrderComplete (stageIds: any) {
        return this.orderGroup?.CheckOrderComplete(stageIds);
    }

    ShakeStoreButton () {
        GameKit.ShakeAnimTool.Shake(this.storeButton, 3);
    }

    ShowMergeDes (meta: any, mergeItem?: any) {
        this.mergeDes?.getComponent(MergeDes)?.Show(meta, mergeItem);
    }

    canOperateMergeTutorialNodeClick (nodeKey: string) {
        return Game.MergeTutorialManager?.CanOperateNodeClick?.(nodeKey) ?? true;
    }

    onClickOpenMergeTypeWindow () {
        if (!this.canOperateMergeTutorialNodeClick('merge_type_button')) return false;
        SR.SRMerge.AutoSendSaveMapLite();
        const mergeId = this.mergeDes?.getComponent(MergeDes)?.GetMergeId();
        UIRoot.instance.openChildWindow('MergeTypeWindow', { mergeId, playSourceGeneratorHintOnClose: true });
    }

    GetMergeSourceGeneratorIds (mergeId: any) {
        const meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId);
        if (!meta) return [];
        const typeMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeType, meta.Type());
        const levels = typeMeta ? typeMeta.Levels() : [];
        const mergeIndex = levels.indexOf(mergeId);
        const sourceIds: any[] = [];
        const addSourceIds = (targetMergeId: any) => {
            const ids = Meta.MergeGeneraterMeta.GetAllMetaIdsByMergeId(targetMergeId) || [];
            ids.forEach((id: any) => { if (!sourceIds.includes(id)) sourceIds.push(id); });
        };
        addSourceIds(mergeId);
        for (let i = 0; i < mergeIndex; i++) addSourceIds(levels[i]);
        return sourceIds;
    }

    GetMergeItemLevel (mergeId: any) {
        const meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId);
        if (!meta) return -1;
        const typeMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeType, meta.Type());
        return typeMeta ? typeMeta.Levels().indexOf(mergeId) : -1;
    }

    FindMergeSourceGeneratorNode (mergeId: any) {
        if (!this.mergeLevelNode?.node) return null;
        const sourceIds = this.GetMergeSourceGeneratorIds(mergeId);
        if (sourceIds.length === 0) return null;
        let bestNode: Node | null = null;
        let bestLevel = -1;
        for (const node of this.mergeLevelNode.node.children) {
            if (!node?.active) continue;
            const mergeItem: any = node.getComponent('MergeItem');
            if (!mergeItem) continue;
            const generatorMergeId = mergeItem.GetMergeId();
            if (!sourceIds.includes(generatorMergeId)) continue;
            const level = this.GetMergeItemLevel(generatorMergeId);
            if (bestNode && level <= bestLevel) continue;
            bestNode = node;
            bestLevel = level;
        }
        return bestNode;
    }

    PlayMergeSourceGeneratorHint (mergeId: any) {
        const generatorNode = this.FindMergeSourceGeneratorNode(mergeId);
        if (isValid(generatorNode)) this.PlayShengChanQiTiShiEnter(generatorNode!.worldPosition.clone());
    }

    onClickOpenStore () {
        if (!this.canOperateMergeTutorialNodeClick('backpack_button')) return false;
        SR.SRMerge.AutoSendSaveMapLite();
        UIRoot.instance.openChildWindow('StoreWindow');
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('backpack_button');
        }
    }

    onClickOpenVillage () {
        if (!this.canOperateMergeTutorialNodeClick('town_button')) return false;
        console.log('onClickOpenVillage');
        SR.SRMerge.AutoSendSaveMapLite();
        GamePlay.instance.changeScene(GamePlay.Scenes.Village);
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('map_button');
            Game.MergeTutorialManager.EmitNodeClick('town_button');
        }
    }

    onClickDialogNote () {
        if (!this.canOperateMergeTutorialNodeClick('town_button')) return false;
        SR.SRMerge.AutoSendSaveMapLite();
        if (GamePlay.instance.mergeRoot.mergeLevelNode.IsNetRunning()) {
            this.PlayAdditionDscAnim('婵繐绲藉﹢顏堝触鐏炵虎鍔勬俊顐㈩儑濞插繘鏁嶅畝鍐惧殲缂佸绉撮埀顒佺憿閳?');
            return;
        }
        GamePlay.instance.changeScene(GamePlay.Scenes.Village, () => {
        });
        GamePlay.instance.mapNode.openCanLevelUpBuild();
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('map_button');
            Game.MergeTutorialManager.EmitNodeClick('town_button');
        }
    }

    _finishTempNoteExtract (needUnlock: any) {
        if (needUnlock && GamePlay.instance && GamePlay.instance.mergeRoot && GamePlay.instance.mergeRoot.mergeLevelNode) {
            GamePlay.instance.mergeRoot.mergeLevelNode.SetNetRunning(false);
        }
        if (this.notetemp) {
            this.notetemp.ShowIcon(Game.SUserMerge.GetLastPendingRewards());
            this._updateNotesUIVisible();
        }
    }

    onClickTempNote () {
        if (!this.canOperateMergeTutorialNodeClick('temp_note')) return false;
        const lvl = GamePlay.instance.mergeRoot.mergeLevelNode;
        if (lvl.IsNetRunning()) {
            this.PlayAdditionDscAnim('婵繐绲藉﹢顏堝箵閹邦剙绲块柨娑樼焷椤曨剛绮欏鍛亾濞嗗备鍋?');
            return false;
        }

        const iconNode = this.notetemp?.icon ? this.notetemp.icon.node : null;
        const iconTransform = iconNode ? iconNode.getComponent(UITransform) : null;
        const noteWorldPos = iconTransform ? iconTransform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
        const emptyPos = lvl.getEmptyTilePos(noteWorldPos);
        if (!emptyPos) {
            this.PlayAdditionDscAnim('婵炲备鍓濆﹢浣虹矚閻戞澹愰悗娑欏姃缁繝鏁嶇仦鑲╃憹闁煎疇濮よぐ渚€宕ｉ弽锕€顦查柡鍐煐閺嗙喖骞戦鍡欑＜');
            return false;
        }
        if (!this.notetemp?.GetMergeDataStr()) {
            this.PlayAdditionDscAnim('婵炲备鍓濆﹢浣圭▔鐎涙ɑ顦ч柡浣哄瀹撲線鏁嶇仦鑲╃憹闁煎疇濮よぐ渚€宕ｉ弽锕€顦查柡鍐煐閺嗙喖骞戦鍡欑＜');
            return false;
        }

        const mergeType = this.notetemp.GetMergeType();
        const dataStr = this.notetemp.GetMergeDataStr();
        const rewardIndex = Game.SUserMerge.GetLastPendingRewardsKey(dataStr);
        const tutorialMergeId = Game.MergeTutorialManager?.GetMergeIdFromDataStr
            ? Game.MergeTutorialManager.GetMergeIdFromDataStr(dataStr)
            : (dataStr ? String(Number.parseInt(String(dataStr).split('_')[0], 10) || '') : '');

        if (rewardIndex === undefined || rewardIndex === null) {
            this.PlayAdditionDscAnim('婵炲备鍓濆﹢浣圭▔鐎涙ɑ顦ч柡浣哄瀹撲線鏁嶇仦鑲╃憹闁煎疇濮よぐ渚€宕ｉ弽锕€顦查柡鍐煐閺嗙喖骞戦鍡欑＜');
            return false;
        }

        const refGlobal = noteWorldPos;
        const needsBoardCell = mergeType === 'piece' || !mergeType;
        const emptyNow = needsBoardCell ? lvl.getEmptyTilePos(refGlobal) : null;
        if (needsBoardCell && !emptyNow) {
            this.PlayAdditionDscAnim('濡澘妫楄ぐ鍥箣閹邦剙顫犻柨娑樺缁叉崘銇愰幘鍐差枀婵炲备鍓濆﹢渚€宕ｉ婊勬殢缂佸瞼鍎ら悧鎼佹晬瀹€鍐惧殲闁轰礁顕幃濠偽涚€ｎ剚纾搁柛姘叄閸ｅ摜鎷?');
            return false;
        }
        if (Game.MergeTutorialManager?.BeginP5GeneratorTempRewardClaim &&
            !Game.MergeTutorialManager.BeginP5GeneratorTempRewardClaim(dataStr)) return false;
        const cancelP5GeneratorTempRewardClaim = () => {
            Game.MergeTutorialManager?.CancelP5GeneratorTempRewardClaim?.(dataStr);
        };
        if (tutorialMergeId) Game.MergeTutorialManager?.PrepareGeneratorMergeGuide?.(tutorialMergeId);
        const opId = GameKit.StringUtil.getRandomString(16);
        const cellKey = emptyNow ? (emptyNow.x + '_' + emptyNow.y) : null;
        const requestPromise = lvl.updateMergeMapEvent({
            actionType: MergeTypes.MergeActionType.CLAIM_REWARD,
            rewardIndex: rewardIndex,
            cellKey: cellKey,
            opId: opId,
            forceServer: true,
            serverErrorCallback: (err: any) => {
                console.error(err, 'claim error');
                cancelP5GeneratorTempRewardClaim();
                this._finishTempNoteExtract(true);
            },
        });
        Promise.resolve(requestPromise).then((result: any) => {
            if (!result || !result.success || result.opId !== opId) {
                const msg = result && (result.errorMsg || result.errorCode) ? (result.errorMsg || result.errorCode) : 'claim reward failed';
                console.error(result, msg);
                cancelP5GeneratorTempRewardClaim();
                this._finishTempNoteExtract(true);
                return;
            }

            console.log('claim reward success');
            this._finishTempNoteExtract(false);
            const claimedCellKey = result.cellKey || cellKey;
            if (tutorialMergeId) {
                Game.MergeTutorialManager?.OnTempRewardClaimed?.({
                    mergeId: tutorialMergeId,
                    cellKey: claimedCellKey,
                    dataStr: result.pieceData || dataStr,
                });
            }
            const emitTempNoteClick = () => Game.MergeTutorialManager?.EmitNodeClick?.('temp_note');
            if (mergeType === 'content' || mergeType === 'pack' || mergeType === 'cardChest') {
                emitTempNoteClick();
            } else {
                lvl.ExtractTempData(result.pieceData || dataStr, claimedCellKey, refGlobal, () => {
                    this._finishTempNoteExtract(false);
                    emitTempNoteClick();
                });
            }
            this.InitOrderList();
        }).catch((err) => {
            console.error(err, 'claim error');
            cancelP5GeneratorTempRewardClaim();
            this._finishTempNoteExtract(true);
        });

        return true;
    }

    IfMergeHitTestStoreButton (tg: Node) {
        const storeRect = this.storeButton?.getComponent(UITransform)?.getBoundingBoxToWorld();
        const targetRect = tg.getComponent(UITransform)?.getBoundingBoxToWorld();
        if (!storeRect || !targetRect) return false;
        return !(
            storeRect.x + storeRect.width < targetRect.x ||
            storeRect.x > targetRect.x + targetRect.width ||
            storeRect.y + storeRect.height < targetRect.y ||
            storeRect.y > targetRect.y + targetRect.height
        );
    }

    GetStoreButtonGlobalPos () {
        const transform = this.storeButton ? this.storeButton.getComponent(UITransform) : null;
        return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
    }
}

export default MergeUI;
