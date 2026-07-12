import { _decorator, Animation, Component, instantiate, isValid, Label, Node, Prefab, RichText, tween, UITransform, Vec3 } from 'cc';
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
    private emptyTaskGuide: Node | null = null;
    private emptyTaskLabel: RichText | null = null;
    private emptyTaskArrow: Node | null = null;
    private _delayNotesUIVisible = false;
    private _pendingNotesUIVisible = false;

    onLoad () {
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
        this.FitScreenUI();
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.CoinEvent, 'MergeUI', this.onDialogDataChanged.bind(this));
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated, 'MergeUI', this.onPendingRewardsChanged.bind(this));
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.LevelOrderAllComplete, 'MergeUI', this.onLevelOrderAllComplete.bind(this));
    }

    onDestroy () {
        this.node.off(Node.EventType.TOUCH_START, this._onBottomUITouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_END, this._onBottomUITouchEnd, this, true);
        this.ClearAll();
    }

    ClearAll () {
        this._emptyTaskGuideDisposed = true;
        if (GameKit && GameKit.GameEvent) {
            GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated, 'MergeUI');
            GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.CoinEvent, 'MergeUI');
            GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.LevelOrderAllComplete, 'MergeUI');
        }
        this.clearEmptyTaskGuide();
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
            const prefab = UIRoot.instance?.winPres?.MergeTutorialWindow;
            if (!prefab) return;
            const windowNode = instantiate(prefab);
            this.emptyTaskGuide = windowNode.getChildByName('EmptyTaskGuide');
            const labelNode = this.getNodeByPath(this.emptyTaskGuide, 'dialoggirl/msg');
            this.emptyTaskLabel = labelNode?.getComponent(RichText) || null;
            this.emptyTaskGuide?.removeFromParent();
            windowNode.destroy();
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
        this.emptyTaskArrow!.active = false;
        this.emptyTaskArrow!.setScale(Vec3.ONE);
    }

    showEmptyTaskArrow () {
        this.emptyTaskArrow = this.getEmptyTaskArrowNode();
        if (!this.emptyTaskArrow) return;
        this.emptyTaskArrow.active = true;
        tween(this.emptyTaskArrow).stop();
        this.playEmptyTaskArrowClickAction(this.emptyTaskArrow);
    }

    playEmptyTaskArrowClickAction (arrow: Node) {
        tween(arrow).repeatForever(
            tween().to(0.15, { scale: new Vec3(0.88, 0.88, 1) }).to(0.18, { scale: Vec3.ONE }).delay(0.45)
        ).start();
    }

    loadEmptyTaskGuide (callback: (guide: Node | null, label: RichText | null) => void) {
        if (this.emptyTaskGuide) {
            callback(this.emptyTaskGuide, this.emptyTaskLabel);
            return;
        }
        const prefab = UIRoot.instance?.winPres?.MergeTutorialWindow;
        this.finishEmptyTaskGuideLoad(prefab ? this.createEmptyTaskGuideFromPrefab(prefab) : null, callback);
    }

    createEmptyTaskGuideFromPrefab (prefab: Prefab) {
        const windowNode = instantiate(prefab);
        const guide = windowNode.getChildByName('EmptyTaskGuide');
        const label = this.getNodeByPath(guide, 'dialoggirl/msg')?.getComponent(RichText) || null;
        guide?.removeFromParent();
        windowNode.destroy();
        return { guide, label };
    }

    finishEmptyTaskGuideLoad (result: { guide: Node | null; label: RichText | null } | null, callback?: (guide: Node | null, label: RichText | null) => void) {
        if (this._emptyTaskGuideDisposed) {
            result?.guide?.destroy();
            return;
        }
        this.emptyTaskGuide = result?.guide || null;
        this.emptyTaskLabel = result?.label || null;
        callback?.(this.emptyTaskGuide, this.emptyTaskLabel);
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
        if (this.noteDialog) this.noteDialog.node.active = Game.SUserMap.IsRedPoint();
        this.ShowMergeDes(null);
        this.InitOrderList();
        this.notetemp?.ShowIcon(Game.SUserMerge.GetLastPendingRewards());
        this._updateNotesUIVisible();
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
        if (type === Game.Content.Types.Coin) return 0;
        if (type === Game.Content.Types.Exp) return 1;
        if (type === Game.Content.Types.Ap) return 2;
        if (type === Game.Content.Types.Cash) return 3;
        return null;
    }

    isValidFlySpineAnimIndex (spineAnimIndex: any) {
        const index = Number.parseInt(spineAnimIndex, 10);
        return Number.isFinite(index) && index >= 0 && index <= 3;
    }

    PlayCoinFlyToTargetAnim (globalFromPos: Vec3, animCount: number, textures: any, contentType?: any, toWorldPos?: Vec3, cb?: Function, options: any = {}) {
        const userInfo = GameMainWindow.instance.userinfo;
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
            if (options.playBpCoinFlySound) GameKit.SoundManager?.playBpCoinFlySound?.();
            this.PlayShouJiJinBiEnter(worldPos, {
                parent: flyNode.parent,
                position: flyNode.position,
                siblingIndex: flyNode.getSiblingIndex(),
            });
            if (!numAnimPlayed) {
                numAnimPlayed = true;
                userInfo?.playPendingResourceNumAnim?.(contentType ?? Game.Content.Types.Coin);
            }
        }, options);
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
        if (this.noteDialog) this.noteDialog.node.active = Game.SUserMap.IsRedPoint();
        this.UpdateNotesUIVisibleSafe();
    }

    onPendingRewardsChanged () {
        this.notetemp?.ShowIcon(Game.SUserMerge.GetLastPendingRewards());
        this.UpdateNotesUIVisibleSafe();
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
        if (typeof SR !== 'undefined' && SR.SRMerge && SR.SRMerge.SyncLocalOrders) {
            SR.SRMerge.SyncLocalOrders('InitOrderList');
        }
        this.orderGroup?.InitOrderList(Game.SUserMerge.GetOrders());
        this.updateEmptyTaskGuideByOrders(Game.SUserMerge.GetOrders());
        this.scheduleOnce(() => {
            this.mergeLevelNode?.updateOrderStatus();
        });
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

    onClickOpenMergeTypeWindow () {
        SR.SRMerge.AutoSendSaveMapLite();
        const mergeId = this.mergeDes?.getComponent(MergeDes)?.GetMergeId();
        UIRoot.instance.openChildWindow('MergeTypeWindow', { mergeId: mergeId });
    }

    onClickOpenStore () {
        SR.SRMerge.AutoSendSaveMapLite();
        UIRoot.instance.openChildWindow('StoreWindow');
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('backpack_button');
        }
    }

    onClickOpenVillage () {
        console.log('onClickOpenVillage');
        SR.SRMerge.AutoSendSaveMapLite();
        GamePlay.instance.changeScene(GamePlay.Scenes.Village);
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('map_button');
            Game.MergeTutorialManager.EmitNodeClick('town_button');
        }
    }

    onClickDialogNote () {
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
        lvl.SetNetRunning(true);

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
                this._finishTempNoteExtract(true);
            },
        });
        Promise.resolve(requestPromise).then((result: any) => {
            if (!result || !result.success || result.opId !== opId) {
                const msg = result && (result.errorMsg || result.errorCode) ? (result.errorMsg || result.errorCode) : 'claim reward failed';
                console.error(result, msg);
                this._finishTempNoteExtract(true);
                return;
            }

            console.log('claim reward success');
            lvl.SetNetRunning(true);
            if (mergeType === 'content' || mergeType === 'pack' || mergeType === 'cardChest') {
                this._finishTempNoteExtract(true);
            } else {
                lvl.ExtractTempData(result.pieceData || dataStr, result.cellKey || cellKey, refGlobal, () => {
                    this._finishTempNoteExtract(true);
                });
            }
            this.InitOrderList();
        }).catch((err) => {
            console.error(err, 'claim error');
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
