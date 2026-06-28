import { _decorator, Component, instantiate, Node, sp, Sprite, UITransform, Vec3 } from 'cc';
import ContentModel from '../items/ContentModel';
import MergeTypes from './MergeTypes';
import { MergeRoleNode } from './MergeRoleNode';

const { ccclass, property } = _decorator;

function debugLog (phase: string, payload: any) {
    if (SR && SR.SRMerge && SR.SRMerge.DebugMergeOrder === false) return;
    try {
        console.log('[MergeOrderDebug][MergeOrder.' + phase + ']', payload);
    } catch (e) { }
}

function debugClone (value: any) {
    if (SR && SR.SRMerge && SR.SRMerge.DebugClone) {
        return SR.SRMerge.DebugClone(value);
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (e) {
        return value;
    }
}

function worldPos (node: Node | null) {
    if (!node) return null;
    const transform = node.getComponent(UITransform);
    return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone();
}

function showInfoNode (node: Node, active: boolean) {
    const info = node.getChildByName('info');
    if (info) info.active = active;
}

@ccclass('MergeOrder')
export class MergeOrder extends Component {
    @property([sp.SkeletonData])
    public roleSpines: sp.SkeletonData[] = [];

    @property([Node])
    public roleNodes: Node[] = [];

    @property(MergeRoleNode)
    public mergeRoleNode: MergeRoleNode | null = null;

    @property(Node)
    public orderItem_layout: Node | null = null;

    @property([Node])
    public orderItems: Node[] = [];

    @property(Node)
    public completeBtn: Node | null = null;

    @property(Node)
    public light: Node | null = null;

    @property(Node)
    public light1: Node | null = null;

    @property(Node)
    public reward_layout: Node | null = null;

    @property(Node)
    public activityRewards_layout: Node | null = null;

    @property(Node)
    public additionalRewards_layout: Node | null = null;

    @property([Node])
    public rewardItems: Node[] = [];

    @property([Node])
    public activityRewards: Node[] = [];

    @property([Node])
    public additionalRewards: Node[] = [];

    public slotIndex = -1;
    public ids: string[] = [];
    public isComplete = false;
    public globalPosList: any[] = [];
    public currentRoleNode: Node | null = null;
    public orderCompleteAnimKey = '';
    public _orderData: any = null;

    onLoad () {
        if (this.light) this.light.active = false;
        if (this.light1) this.light1.active = false;
    }

    start () {
        if (this.completeBtn) {
            this.completeBtn.off(Node.EventType.TOUCH_END, this.onClickCompleteBtn, this);
            this.completeBtn.on(Node.EventType.TOUCH_END, this.onClickCompleteBtn, this);
        }
    }

    _getRoleComp () {
        return this.currentRoleNode ? this.currentRoleNode.getComponent(MergeRoleNode) : this.mergeRoleNode;
    }

    _findRoleSpine (roleName: any) {
        if (!this.roleSpines || this.roleSpines.length <= 0) return null;
        const roleNameStr = roleName == null ? '' : String(roleName).toLowerCase();
        for (let i = 0; i < this.roleSpines.length; i++) {
            const spineData = this.roleSpines[i];
            if (!spineData || !spineData.name) continue;
            if (String(spineData.name).toLowerCase() === roleNameStr) {
                return spineData;
            }
        }
        console.warn('MergeOrder role spine not found', roleName);
        return this.roleSpines[0];
    }

    _findRoleNode (roleName: any) {
        const roleNameStr = roleName == null || roleName === '' ? 'Ava' : String(roleName);
        const roleComp = this.mergeRoleNode || null;
        if (!roleComp || !roleComp.node) {
            console.warn('MergeOrder roleName not found', roleNameStr);
            return null;
        }
        const roleNode = roleComp.node;
        const roleSpine = this._findRoleSpine(roleNameStr);
        const skeleton = roleComp.ske || roleNode.getComponent(sp.Skeleton);
        if (skeleton && roleSpine) {
            skeleton.skeletonData = roleSpine;
            roleComp.ske = skeleton;
        }
        return roleNode;
    }

    _expandRequiredPieceIds (requiredPieces: any) {
        const ids: string[] = [];
        requiredPieces = requiredPieces || {};
        const keys = Object.keys(requiredPieces).sort((a, b) => Number(a) - Number(b));
        for (let i = 0; i < keys.length; i++) {
            const id = parseInt(keys[i], 10);
            if (isNaN(id) || id <= 0) continue;
            let count = parseInt(requiredPieces[keys[i]], 10);
            if (isNaN(count) || count <= 0) count = 1;
            for (let c = 0; c < count; c++) {
                ids.push(String(id));
            }
        }
        return ids;
    }

    PlayShow () {
        const roleComp = this._getRoleComp();
        if (roleComp && roleComp.playShow) {
            roleComp.playShow();
        }
    }

    PlayComplete () {
        const roleComp = this._getRoleComp();
        if (roleComp && roleComp.playHappy) {
            const skeleton = this.light ? this.light.getComponent(sp.Skeleton) : null;
            if (skeleton) skeleton.setAnimation(0, 'JueSeWanChen_tx', false);
            roleComp.playHappy();
        }
    }

    PlayLeave () {
        const roleComp = this._getRoleComp();
        if (roleComp && roleComp.playLeave) {
            roleComp.playLeave();
        }
    }

    _normalizeRewardContents (rewards: any) {
        let list: any[] = [];
        if (!rewards) return list;
        const pushContent = (item: any) => {
            if (!item) return;
            if (typeof item === 'string') {
                try {
                    list = list.concat(item.indexOf(';') >= 0 ? Game.Content.FromStrings(item) : [Game.Content.FromString(item)]);
                } catch (e) { }
                return;
            }
            if (Array.isArray(item)) {
                item.forEach(pushContent);
                return;
            }
            try {
                let type = item.type;
                let cid = item.cid != null ? item.cid : (item.contentId != null ? item.contentId : item.id);
                let count = item.count != null ? item.count : item.num;
                if (type == null && item.Type) type = item.Type();
                if (cid == null && item.ContentId) cid = item.ContentId();
                if (cid == null && item.Id) cid = item.Id();
                if (count == null && item.Count) count = item.Count();
                type = Number(type);
                cid = Number(cid);
                count = Number(count);
                if (isFinite(type) && isFinite(cid) && isFinite(count) && count > 0) {
                    list.push(Game.Content.FromContent({ type: type, cid: cid, count: count }));
                }
            } catch (e) { }
        };
        pushContent(rewards);
        return list.filter(item => !!item);
    }

    Init (order: any) {
        order = order || {};
        this._orderData = order;
        this.roleNodes.forEach(rnode => {
            if (rnode) rnode.active = false;
        });
        this.slotIndex = order.slotIndex;
        const roleNode = this._findRoleNode(order.roleName);
        this.currentRoleNode = roleNode;
        if (roleNode) {
            roleNode.active = true;
            this.PlayShow();
        }

        this.isComplete = false;
        const ids = this._expandRequiredPieceIds(order.requiredPieces);
        this.ids = ids;
        this.orderCompleteAnimKey = order.orderId != null ? String(order.orderId) : this.slotIndex + ':' + ids.join('_');
        debugLog('Init', {
            orderId: order.orderId,
            slotIndex: order.slotIndex,
            requiredPieces: debugClone(order.requiredPieces),
            ids: ids.concat(),
            matchedCells: debugClone(order.matchedCells),
            completed: order.completed,
        });

        const orderItemTemplate = this.orderItem_layout ? GameKit.ControllerTable.GetNode(this.orderItem_layout, 'item') : null;
        for (let i = 0; i < 3; i++) {
            let item = this.orderItems[i];
            if (!item && orderItemTemplate) {
                item = instantiate(orderItemTemplate);
                item.parent = this.orderItem_layout;
                this.orderItems[i] = item;
            }
            if (!item) continue;
            const icon = GameKit.ControllerTable.GetComponent(item, 'icon', Sprite) as Sprite | null;
            if (icon && icon.node) icon.node.active = false;
            const okNode = GameKit.ControllerTable.GetNode(item, 'ok');
            const rewardItem = GameKit.ControllerTable.GetComponent(item, 'rewarditem', ContentModel) as ContentModel | null;
            if (i < ids.length) {
                item.active = true;
                if (okNode) okNode.active = false;
                const iconId = parseInt(ids[i], 10);
                const content = Game.Content.FromString(Game.Content.Types.MergeIcon + '=+' + iconId + '=1');
                if (rewardItem) rewardItem.show(content, { infoBtnParams: { canTouch: false, showInfoBtn: false }, iconParams: { forceTouch: true } });
            } else {
                item.active = false;
            }
        }

        if (this.light) this.light.active = false;
        if (this.completeBtn) this.completeBtn.active = false;
        if (this.light1) this.light1.active = false;

        this.refreshRewardItems(this._normalizeRewardContents(order.rewards));
        this.refreshActivityRewards(order);
        this.refreshAdditionalRewards(order);
    }

    private refreshRewardItems (rewards: any[]) {
        const rewardlayout2 = this.reward_layout ? GameKit.ControllerTable.GetNode(this.reward_layout, 'rewardlayout_2') : null;
        const rewardTemplate = rewardlayout2 ? GameKit.ControllerTable.GetNode(rewardlayout2, 'item') : null;
        for (let i = 0; i < 3; i++) {
            let rewardNode = this.rewardItems[i];
            if (!rewardNode && rewardTemplate) {
                rewardNode = instantiate(rewardTemplate);
                rewardNode.parent = rewardlayout2;
                this.rewardItems[i] = rewardNode;
            }
            if (!rewardNode) continue;
            if (i < rewards.length) {
                const reward = rewards[i];
                rewardNode.active = true;
                const contentModel = rewardNode.getComponent(ContentModel);
                if (contentModel) contentModel.show(reward);
                showInfoNode(rewardNode, reward.type === Game.Content.Types.RandomPack || reward.type === Game.Content.Types.Gift);
            } else {
                rewardNode.active = false;
            }
        }
    }

    private refreshActivityRewards (order: any) {
        const activityContentArr: any[] = [];
        if (order.collectRewards && order.collectRewards.length) {
            order.collectRewards.forEach((reward: any) => {
                const activityData = Meta.MetaManager.GetMeta(Meta.MetaType.Activity, reward.activityId);
                if (!activityData) return;
                const param = activityData.Param() || {};
                const symbolId = param.symbolId || param.showSymbolId;
                if (symbolId == null) return;
                activityContentArr.push({ cid: symbolId, type: 110, count: reward.count, activityId: reward.activityId });
            });
        }

        const template = this.activityRewards_layout ? GameKit.ControllerTable.GetNode(this.activityRewards_layout, 'item') : null;
        const activityRewardsContent = activityContentArr.length > 0 ? Game.Content.FromContents(activityContentArr) : [];
        for (let i = 0; i < 2; i++) {
            let activityReward = this.activityRewards[i];
            if (!activityReward && template) {
                activityReward = instantiate(template);
                activityReward.parent = this.activityRewards_layout;
                this.activityRewards[i] = activityReward;
            }
            if (!activityReward) continue;
            if (i < activityRewardsContent.length) {
                const content = activityRewardsContent[i];
                activityReward.active = true;
                const contentModel = activityReward.getComponent(ContentModel);
                if (contentModel) contentModel.show(content, { activityId: activityContentArr[i].activityId });
                showInfoNode(activityReward, content.type === Game.Content.Types.RandomPack || content.type === Game.Content.Types.Gift);
            } else {
                activityReward.active = false;
            }
        }
        for (let i = 2; i < this.activityRewards.length; i++) {
            if (this.activityRewards[i]) this.activityRewards[i].active = false;
        }
    }

    private refreshAdditionalRewards (order: any) {
        const additionalRewards = order.additionRewards && order.additionRewards.length ? Game.Content.FromContents(order.additionRewards) : [];
        const template = this.additionalRewards_layout ? GameKit.ControllerTable.GetNode(this.additionalRewards_layout, 'item') : null;
        for (let i = 0; i < 1; i++) {
            let additionalReward = this.additionalRewards[i];
            if (!additionalReward && template) {
                additionalReward = instantiate(template);
                additionalReward.parent = this.additionalRewards_layout;
                this.additionalRewards[i] = additionalReward;
            }
            if (!additionalReward) continue;
            if (i < additionalRewards.length) {
                const content = additionalRewards[i];
                additionalReward.active = true;
                const contentModel = additionalReward.getComponent(ContentModel);
                if (contentModel) contentModel.show(content);
                showInfoNode(additionalReward, content.type === Game.Content.Types.RandomPack || content.type === Game.Content.Types.Gift);
            } else {
                additionalReward.active = false;
            }
        }
        for (let i = 1; i < this.additionalRewards.length; i++) {
            if (this.additionalRewards[i]) this.additionalRewards[i].active = false;
        }
    }

    GetSlotIndex () {
        if (!this.node.active) {
            return -1;
        }
        return this.slotIndex;
    }

    CheckComplete (stageIds: any, shouldPlayCompleteAnim: any) {
        const completeIds: number[] = [];
        let okCount = 0;
        const newstageIds = stageIds ? stageIds.concat() : [];
        this.globalPosList = [];
        for (let i = 0; i < this.orderItems.length; i++) {
            const item = this.orderItems[i];
            if (!item) continue;
            const okNode = GameKit.ControllerTable.GetNode(item, 'ok');
            const icon = GameKit.ControllerTable.GetComponent(item, 'icon', Sprite) as Sprite | null;
            if (item.active && i < this.ids.length) {
                if (okNode) okNode.active = false;
                const iconId = parseInt(this.ids[i], 10);
                const idx = newstageIds.indexOf(iconId);
                if (idx !== -1) {
                    newstageIds.splice(idx, 1);
                    if (okNode) okNode.active = true;
                    completeIds.push(iconId);
                    okCount++;
                }
                this.globalPosList.push({
                    id: iconId,
                    globalPos: icon && icon.node ? worldPos(icon.node) : null,
                });
            }
        }

        const wasComplete = this.isComplete || !!(this.completeBtn && this.completeBtn.active);
        const isCompleteNow = okCount === this.ids.length;
        if (isCompleteNow || wasComplete) {
            debugLog('CheckComplete', {
                orderId: this._orderData ? this._orderData.orderId : null,
                slotIndex: this.slotIndex,
                ids: this.ids ? this.ids.concat() : [],
                requiredPieces: this._orderData ? debugClone(this._orderData.requiredPieces) : null,
                matchedCells: this._orderData ? debugClone(this._orderData.matchedCells) : null,
                stageIds: stageIds ? stageIds.concat() : [],
                completeIds: completeIds.concat(),
                okCount: okCount,
                idsLength: this.ids.length,
                wasComplete: wasComplete,
                isCompleteNow: isCompleteNow,
            });
        }
        if (isCompleteNow) {
            if (shouldPlayCompleteAnim && !wasComplete) {
                this.PlayComplete();
            }
            this.isComplete = true;
            if (this.light) this.light.active = true;
            if (this.completeBtn) this.completeBtn.active = true;
            if (this.light1) this.light1.active = true;
        } else {
            if (this.completeBtn) this.completeBtn.active = false;
            if (this.light1) this.light1.active = false;
            if (this.light) this.light.active = false;
            this.isComplete = false;
        }
        return completeIds;
    }

    HideCompleteBtn () {
        if (this.completeBtn) this.completeBtn.active = false;
        if (this.light1) this.light1.active = false;
        this.isComplete = false;
        if (this.light) this.light.active = false;
    }

    PlayCompleteBtnEffect () {
        const mergeUI = GamePlay.instance && GamePlay.instance.mergeRoot ? GamePlay.instance.mergeRoot.mergeNodeUI : null;
        const completeBtnWorldPos = this.completeBtn ? worldPos(this.completeBtn) : null;
        if (completeBtnWorldPos && mergeUI && mergeUI.PlayJueSeWanChengEnter) {
            mergeUI.PlayJueSeWanChengEnter(completeBtnWorldPos.clone());
        }
    }

    getIconWorldPosByMergeIdMap () {
        const map: any = {};
        if (!this.ids || !this.orderItems) return map;
        for (let i = 0; i < this.orderItems.length; i++) {
            if (i >= this.ids.length) break;
            const item = this.orderItems[i];
            if (!item || !item.active) continue;
            const icon = GameKit.ControllerTable.GetComponent(item, 'icon', Sprite) as Sprite | null;
            if (!icon || !icon.node) continue;
            const wp = worldPos(icon.node);
            if (wp) map[String(this.ids[i])] = wp.clone();
        }
        return map;
    }

    onClickCompleteBtn () {
        const mergeRoot = GamePlay.instance ? GamePlay.instance.mergeRoot : null;
        const mergeLevelNode = mergeRoot ? mergeRoot.mergeLevelNode : null;
        const mergeUI = mergeRoot ? mergeRoot.mergeNodeUI : null;
        if (!mergeLevelNode || !mergeUI) return;
        if (mergeLevelNode.IsNetRunning && mergeLevelNode.IsNetRunning()) {
            if (mergeUI.PlayAdditionDscAnim) mergeUI.PlayAdditionDscAnim('正在操作，请稍候');
            return;
        }
        const slotIndex = this.GetSlotIndex();
        if (slotIndex === -1) return;

        this.PlayCompleteBtnEffect();
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.TryClaimTutorialOrder && Game.MergeTutorialManager.TryClaimTutorialOrder(slotIndex, this)) {
            return;
        }

        const orderId = this._orderData && this._orderData.orderId;
        const orderBeforeClaim = orderId != null && Game.SUserMerge.GetOrderDataByOrderId
            ? Game.SUserMerge.GetOrderDataByOrderId(orderId)
            : Game.SUserMerge.GetOrderDataBySlotIndex(slotIndex);
        const boardData = Game.SUserMerge.GetMergeMapData();
        const warehouseData = Game.SUserMerge.GetStoreData();
        debugLog('onClickCompleteBtn.beforeClaim', {
            orderId: orderBeforeClaim ? orderBeforeClaim.orderId : null,
            uiOrderId: orderId,
            slotIndex: slotIndex,
            slotIndexType: typeof slotIndex,
            uiIds: this.ids ? this.ids.concat() : [],
            uiIsComplete: this.isComplete,
            completeBtnActive: this.completeBtn ? this.completeBtn.active : null,
            order: debugClone(orderBeforeClaim),
            pieceCounts: SR && SR.SRMerge && SR.SRMerge.DebugCountPieces ? SR.SRMerge.DebugCountPieces(boardData, warehouseData) : null,
            boardData: debugClone(boardData),
            warehouseData: debugClone(warehouseData),
        });

        if (mergeUI.orderGroup && mergeUI.orderGroup.BeginClaimTransition) mergeUI.orderGroup.BeginClaimTransition();
        if (mergeUI.HideOrderCompleteBtn) mergeUI.HideOrderCompleteBtn();

        const currentOrder = orderBeforeClaim || Game.SUserMerge.GetOrderDataBySlotIndex(slotIndex);
        if (!currentOrder) {
            console.error('order claim missing order data', { orderId: orderId, slotIndex: slotIndex });
            if (mergeUI.orderGroup && mergeUI.orderGroup.EndClaimTransition) mergeUI.orderGroup.EndClaimTransition();
            return;
        }

        const orderData = currentOrder.matchedCells || {};
        const globalPosByMergeId = this.getIconWorldPosByMergeIdMap();
        const storeDataStrArr: any[] = [];
        for (const mergeIdKey in orderData) {
            if (!Object.prototype.hasOwnProperty.call(orderData, mergeIdKey)) continue;
            const pnameArr = orderData[mergeIdKey];
            pnameArr.forEach((pname: string) => {
                if (pname.indexOf('warehouse') > -1) {
                    const storeIndex = pname.split('_')[1];
                    const mergeDataStr = Game.SUserMerge.GetStoreData()[storeIndex];
                    storeDataStrArr.push(mergeDataStr);
                }
            });
        }

        mergeLevelNode.SetNetRunning(true);
        mergeLevelNode.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.CLAIM_ORDER, slotIndex: slotIndex, orderId: orderId, forceServer: true }).then(() => {
            mergeLevelNode.ClaimOrderReward(orderData, globalPosByMergeId, storeDataStrArr, () => {
                this.showRewardAnim(() => {
                    mergeUI.orderGroup.PlayClaimedOrderRemoveAnim(this, () => {
                        mergeUI.InitOrderList();
                        mergeLevelNode.SetNetRunning(false);
                    });
                });
            });
        }).catch((err: any) => {
            console.error(err, 'order claim error');
            if (mergeUI.orderGroup && mergeUI.orderGroup.EndClaimTransition) mergeUI.orderGroup.EndClaimTransition();
            mergeLevelNode.SetNetRunning(false);
        });
    }

    showRewardAnim (cb: any) {
        this.scheduleOnce(() => {
            this.playActivityRewardAnim(() => {
                this.playRewardItemAnim(this.rewardItems.concat(this.additionalRewards), cb);
            });
        });
    }

    playActivityRewardAnim (cb: any) {
        const activityData: any[] = [];
        for (let index = 0; index < this.activityRewards.length; index++) {
            const rewardNode = this.activityRewards[index];
            if (!rewardNode || !rewardNode.active) continue;
            rewardNode.active = false;
            const contentModel = rewardNode.getComponent(ContentModel);
            if (contentModel && contentModel.content && contentModel.params && contentModel.icon) {
                const activityId = contentModel.params.activityId;
                const fromWorldPos = contentModel.icon.node ? worldPos(contentModel.icon.node) : null;
                if (activityId && fromWorldPos) {
                    activityData.push({
                        activityId: activityId,
                        animCount: contentModel.content.Count(),
                        fromWorldPos: fromWorldPos,
                    });
                }
            }
        }
        GamePlay.instance.mergeRoot.mergeNodeUI.PlayCollectAnimation(activityData, cb);
    }

    playRewardItemAnim (rewardItems: any, cb: any) {
        const flyRewardData: any[] = [];
        for (let i = 0; i < rewardItems.length; i++) {
            const rewardNode = rewardItems[i];
            if (!rewardNode || !rewardNode.active) continue;
            const contentModel = rewardNode.getComponent(ContentModel);
            rewardNode.active = false;
            if (contentModel && contentModel.content && contentModel.icon) {
                const reward = contentModel.content;
                const globalFromPos = contentModel.icon.node ? worldPos(contentModel.icon.node) : null;
                if (globalFromPos) {
                    flyRewardData.push({
                        contentType: reward.Type(),
                        globalFromPos: globalFromPos,
                        spriteFrame: contentModel.icon.spriteFrame,
                    });
                }
            }
        }

        if (flyRewardData.length <= 0) {
            if (cb) cb();
            return;
        }

        let finishedCount = 0;
        const finishOne = () => {
            finishedCount++;
            if (finishedCount >= flyRewardData.length && cb) {
                cb();
            }
        };

        for (let i = 0; i < flyRewardData.length; i++) {
            const data = flyRewardData[i];
            GamePlay.instance.mergeRoot.mergeNodeUI.PlayCoinFlyToTargetAnim(data.globalFromPos, Math.floor(Math.random() * 8) + 1, [data.spriteFrame], data.contentType, undefined, finishOne);
        }
    }
}

export default MergeOrder;
