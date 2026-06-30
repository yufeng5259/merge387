import { _decorator, Animation, Component, instantiate, isValid, Label, Node, Prefab, UITransform, Vec3, view } from 'cc';
import { MergeDes } from './MergeDes';
import MergeTypes from './MergeTypes';
import { MergeEffectManager } from './MergeEffectManager';
import { MergeTempLibary } from './MergeTempLibary';
import { MergeDialogLibary } from './MergeDialogLibary';
import { MergeOrderGroup } from './MergeOrderGroup';

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

    onLoad () {
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
        this.FitScreenUI();
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.CoinEvent, 'MergeUI', this.onDialogDataChanged.bind(this));
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated, 'MergeUI', this.onPendingRewardsChanged.bind(this));
    }

    ClearAll () {
        if (GameKit && GameKit.GameEvent) {
            GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated, 'MergeUI');
            GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.CoinEvent, 'MergeUI');
        }
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

    PlayCoinFlyToTargetAnim (globalFromPos: Vec3, animCount: number, textures: any, contentType?: any, toWorldPos?: Vec3, cb?: Function) {
        const userInfo = GameMainWindow.instance.userinfo;
        let resolvedToWorldPos = toWorldPos;
        if (resolvedToWorldPos === undefined || resolvedToWorldPos === null) {
            const t = contentType !== undefined && contentType !== null ? contentType : Game.Content.Types.Coin;
            let targetNode = userInfo.labelCoin.node;
            if (t === Game.Content.Types.Ap) {
                targetNode = userInfo.labelAp && userInfo.labelAp.node ? userInfo.labelAp.node : userInfo.labelApFull.node;
            } else if (t === Game.Content.Types.Cash) {
                targetNode = userInfo.cashLabel.node;
            }
            const targetTransform = targetNode.getComponent(UITransform);
            resolvedToWorldPos = targetTransform ? targetTransform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
        }
        GameMainWindow.instance.coinFlyToTargetAnim.PlayAnim(globalFromPos, resolvedToWorldPos, 1.0, 0.15, animCount, textures, cb, (worldPos: Vec3, flyNode: Node) => {
            if (!flyNode || !isValid(flyNode)) return;
            this.PlayShouJiJinBiEnter(worldPos, {
                parent: flyNode.parent,
                position: flyNode.position,
                siblingIndex: flyNode.getSiblingIndex(),
            });
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
        if (this.noteDialog) this.noteDialog.node.active = Game.SUserMap.IsRedPoint();
        this._updateNotesUIVisible();
    }

    onPendingRewardsChanged () {
        this.notetemp?.ShowIcon(Game.SUserMerge.GetLastPendingRewards());
        this._updateNotesUIVisible();
    }

    FitScreenUI () {
        GameKit.MergeUtil.getSize();
        const ssize = view.getVisibleSize();
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

    PlayAdditionDscAnim (dscStr = '鍦ㄦ矙瀛愬倣杩涜鍚堟垚鏉ヨВ閿佸鍔憋紒') {
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
            this.PlayAdditionDscAnim('姝ｅ湪鍚屾妫嬬洏锛岃绋嶅€欌€?');
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
            this.PlayAdditionDscAnim('姝ｅ湪鎻愬彇锛岃绋嶅€欌€?');
            return false;
        }

        const iconNode = this.notetemp?.icon ? this.notetemp.icon.node : null;
        const iconTransform = iconNode ? iconNode.getComponent(UITransform) : null;
        const noteWorldPos = iconTransform ? iconTransform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
        const emptyPos = lvl.getEmptyTilePos(noteWorldPos);
        if (!emptyPos) {
            this.PlayAdditionDscAnim('娌℃湁绌烘牸瀛愪簡锛屼笉鑳芥彁鍙栦复鏃舵暟鎹紒');
            return false;
        }
        if (!this.notetemp?.GetMergeDataStr()) {
            this.PlayAdditionDscAnim('娌℃湁涓存椂鏁版嵁锛屼笉鑳芥彁鍙栦复鏃舵暟鎹紒');
            return false;
        }

        const mergeType = this.notetemp.GetMergeType();
        const dataStr = this.notetemp.GetMergeDataStr();
        const rewardIndex = Game.SUserMerge.GetLastPendingRewardsKey(dataStr);

        if (rewardIndex === undefined || rewardIndex === null) {
            this.PlayAdditionDscAnim('娌℃湁涓存椂鏁版嵁锛屼笉鑳芥彁鍙栦复鏃舵暟鎹紒');
            return false;
        }

        const refGlobal = noteWorldPos;
        const needsBoardCell = mergeType === 'piece' || !mergeType;
        const emptyNow = needsBoardCell ? lvl.getEmptyTilePos(refGlobal) : null;
        if (needsBoardCell && !emptyNow) {
            this.PlayAdditionDscAnim('棰嗗彇鎴愬姛锛屼絾褰撳墠娌℃湁鍙敤绌烘牸锛岃鏁寸悊妫嬬洏鍚庨噸璇?');
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
            storeRect.xMax < targetRect.xMin ||
            storeRect.xMin > targetRect.xMax ||
            storeRect.yMax < targetRect.yMin ||
            storeRect.yMin > targetRect.yMax
        );
    }

    GetStoreButtonGlobalPos () {
        const transform = this.storeButton ? this.storeButton.getComponent(UITransform) : null;
        return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : Vec3.ZERO;
    }
}

export default MergeUI;
