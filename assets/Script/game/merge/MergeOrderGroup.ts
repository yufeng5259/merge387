import { _decorator, Component, instantiate, Layout, Node, Tween, tween, UIOpacity, Vec3 } from 'cc';
import MergeOrder from './MergeOrder';

const { ccclass, property } = _decorator;

function getOrAddOpacity (node: Node) {
    return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

@ccclass('MergeOrderGroup')
export class MergeOrderGroup extends Component {
    @property([MergeOrder])
    public orderList: MergeOrder[] = [];

    @property(Node)
    public orderItem: Node | null = null;

    public _orderKeyByUuid: any = {};
    public _lastCompleteStateByOrderKey: any = {};
    public _lastSortedOrderKeys: string[] = [];
    public _orderNodeDefaultPos: Vec3[] = [];
    public _isPlayingClaimAnim = false;
    public _pendingOrdersForInit: any = null;
    public _hasInitOrderListOnce = false;

    onLoad () {
        this._initOrderListFromOrderItem();
    }

    start () {
        this._cacheOrderNodeDefaultPos();
        this._isPlayingClaimAnim = false;
        this._pendingOrdersForInit = null;
        this._hasInitOrderListOnce = false;
        this._ensureRuntimeState();
    }

    _initOrderListFromOrderItem () {
        this.orderList = [];
        if (!this.orderItem) return;
        const parent = this.orderItem.parent || this.node;
        const sourceIndex = this.orderItem.getSiblingIndex();
        for (let i = 0; i < 8; i++) {
            const itemNode = i === 0 ? this.orderItem : instantiate(this.orderItem);
            if (i > 0) {
                itemNode.parent = parent;
                itemNode.setSiblingIndex(sourceIndex + i);
            }
            itemNode.active = false;
            const order = itemNode.getComponent(MergeOrder);
            if (order) {
                this.orderList.push(order);
            }
        }
    }

    _summarizeOrderData (order: any) {
        if (!order) return null;
        return {
            orderId: order.orderId,
            slotIndex: order.slotIndex,
            roleName: order.roleName,
            requiredPieces: order.requiredPieces,
            completed: order.completed,
            claimed: order.claimed,
            matchedCells: order.matchedCells,
        };
    }

    _ensureRuntimeState () {
        if (!this._orderKeyByUuid) this._orderKeyByUuid = {};
        if (!this._lastCompleteStateByOrderKey) this._lastCompleteStateByOrderKey = {};
        if (!this._lastSortedOrderKeys) this._lastSortedOrderKeys = [];
    }

    _resetRuntimeState () {
        this._orderKeyByUuid = {};
        this._lastCompleteStateByOrderKey = {};
        this._lastSortedOrderKeys = [];
    }

    _buildOrderIdentityKey (order: any) {
        if (!order) return '';
        if (order.orderId != null) return String(order.orderId);
        const requiredPieces = order.requiredPieces || {};
        const requiredPieceKeys = Object.keys(requiredPieces).sort();
        const requiredPiecePart = requiredPieceKeys.map(k => `${k}:${requiredPieces[k]}`).join('|');
        return [
            order.slotIndex,
            order.roleName,
            requiredPiecePart,
        ].join('#');
    }

    _buildOrderDataKey (order: any) {
        if (!order) return '';
        const requiredPieces = order.requiredPieces || {};
        const requiredPieceKeys = Object.keys(requiredPieces).sort();
        const requiredPiecePart = requiredPieceKeys.map(k => `${k}:${requiredPieces[k]}`).join('|');
        const rewardsPart = JSON.stringify(order.rewards || []);
        const collectRewardsPart = JSON.stringify(order.collectRewards || []);
        const additionRewardsPart = JSON.stringify(order.additionRewards || []);
        return [
            order.orderId,
            order.slotIndex,
            order.roleName,
            requiredPiecePart,
            rewardsPart,
            collectRewardsPart,
            additionRewardsPart,
        ].join('#');
    }

    _getOrderLayout () {
        const layout = this.node.getComponent(Layout);
        if (layout) return layout;
        if (this.orderList && this.orderList.length > 0 && this.orderList[0].node.parent) {
            return this.orderList[0].node.parent.getComponent(Layout);
        }
        if (this.orderItem && this.orderItem.parent) {
            return this.orderItem.parent.getComponent(Layout);
        }
        return null;
    }

    _updateLayout () {
        const layout = this._getOrderLayout();
        if (layout) layout.updateLayout();
        return layout;
    }

    _snapshotActiveOrderPosByKey () {
        this._ensureRuntimeState();
        const posByKey: any = {};
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (!order || !order.node.active) continue;
            const key = this._orderKeyByUuid[order.node.uuid];
            if (!key) continue;
            posByKey[key] = order.node.position.clone();
        }
        return posByKey;
    }

    _getActiveOrdersBySiblingIndex () {
        return this.orderList
            .filter(order => !!order && order.node.active)
            .sort((a, b) => a.node.getSiblingIndex() - b.node.getSiblingIndex());
    }

    _moveNodeTo (node: Node, duration: number, toPos: Vec3) {
        Tween.stopAllByTarget(node);
        tween(node).to(duration, { position: toPos.clone() }, { easing: 'cubicOut' as any }).start();
    }

    _moveOrdersFromOldPos (oldPosByKey: any, duration: any) {
        const layout = this._getOrderLayout();
        const layoutWasEnabled = !!(layout && layout.enabled);
        const targetPosByKey = this._snapshotActiveOrderPosByKey();
        if (layout && layoutWasEnabled) layout.enabled = false;
        let hasMove = false;
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (!order || !order.node.active) continue;
            const key = this._orderKeyByUuid[order.node.uuid];
            const fromPos = oldPosByKey[key];
            const toPos = targetPosByKey[key];
            if (!fromPos || !toPos) continue;
            if (fromPos.equals && fromPos.equals(toPos)) continue;
            hasMove = true;
            order.node.position = fromPos.clone ? fromPos.clone() : fromPos;
            this._moveNodeTo(order.node, duration, toPos);
        }
        if (layout && layoutWasEnabled) {
            this.scheduleOnce(() => {
                layout.enabled = true;
                layout.updateLayout();
            }, hasMove ? duration : 0);
        }
    }

    _cacheOrderNodeDefaultPos () {
        this._orderNodeDefaultPos = this.orderList.map(order => order.node.position.clone());
    }

    _restoreOrderNodeTransformByIndex (index: any) {
        if (!this._orderNodeDefaultPos || this._orderNodeDefaultPos.length !== this.orderList.length) {
            this._cacheOrderNodeDefaultPos();
        }
        const order = this.orderList[index];
        if (!order) return;
        Tween.stopAllByTarget(order.node);
        order.node.setScale(Vec3.ONE);
        getOrAddOpacity(order.node).opacity = 255;
        const defaultPos = this._orderNodeDefaultPos[index];
        if (defaultPos) order.node.position = defaultPos.clone();
    }

    _findReusableOrderForData (orderData: any, usedOrders: any[]) {
        const identityKey = this._buildOrderIdentityKey(orderData);
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (usedOrders.indexOf(order) !== -1) continue;
            if (!order.node.active) continue;
            if (this._orderKeyByUuid[order.node.uuid] === identityKey) {
                return order;
            }
        }
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (usedOrders.indexOf(order) !== -1) continue;
            if (!order.node.active) return order;
        }
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (usedOrders.indexOf(order) === -1) return order;
        }
        return null;
    }

    _buildDisplayOrderDataList (orders: any) {
        const sourceOrders = orders || [];
        const sourceOrderByIdentityKey: any = {};
        for (let i = 0; i < sourceOrders.length; i++) {
            sourceOrderByIdentityKey[this._buildOrderIdentityKey(sourceOrders[i])] = sourceOrders[i];
        }

        const result: any[] = [];
        const usedIdentityKeys: any = {};
        const activeOrders = this._getActiveOrdersBySiblingIndex();
        for (let i = 0; i < activeOrders.length; i++) {
            const oldKey = this._orderKeyByUuid[activeOrders[i].node.uuid];
            const orderData = sourceOrderByIdentityKey[oldKey];
            if (!orderData) continue;
            result.push(orderData);
            usedIdentityKeys[oldKey] = true;
        }

        for (let i = 0; i < sourceOrders.length; i++) {
            const key = this._buildOrderIdentityKey(sourceOrders[i]);
            if (usedIdentityKeys[key]) continue;
            result.push(sourceOrders[i]);
        }
        return result;
    }

    _applyInitOrderList (orders: any) {
        this._ensureRuntimeState();
        orders = this._buildDisplayOrderDataList(orders || []);
        const oldPosByKey = this._snapshotActiveOrderPosByKey();
        const oldOrderIdentityKeys: any = {};
        for (const key in this._orderKeyByUuid) {
            oldOrderIdentityKeys[this._orderKeyByUuid[key]] = true;
        }
        const nextOrderKeys = orders.map((order: any) => this._buildOrderDataKey(order));
        const currentOrderKeys = this._getActiveOrdersBySiblingIndex()
            .map(order => this._buildOrderDataKey(order._orderData));
        if (currentOrderKeys.length === nextOrderKeys.length) {
            let same = true;
            for (let i = 0; i < nextOrderKeys.length; i++) {
                if (currentOrderKeys[i] !== nextOrderKeys[i]) {
                    same = false;
                    break;
                }
            }
            if (same) {
                this._hasInitOrderListOnce = true;
                return;
            }
        }

        const usedOrders: MergeOrder[] = [];
        let hasNewOrder = false;
        for (let i = 0; i < orders.length && i < this.orderList.length; i++) {
            const orderData = orders[i];
            const order = this._findReusableOrderForData(orderData, usedOrders);
            if (!order) continue;
            usedOrders.push(order);
            const identityKey = this._buildOrderIdentityKey(orderData);
            const dataKey = this._buildOrderDataKey(orderData);
            const oldIdentityKey = this._orderKeyByUuid[order.node.uuid];
            const oldDataKey = this._buildOrderDataKey(order._orderData);
            if (this._hasInitOrderListOnce && !oldOrderIdentityKeys[identityKey]) {
                hasNewOrder = true;
            }
            if (oldIdentityKey !== identityKey) {
                const defaultIndex = this.orderList.indexOf(order);
                this._restoreOrderNodeTransformByIndex(defaultIndex);
                delete oldPosByKey[identityKey];
            }
            order.node.active = true;
            if (oldIdentityKey !== identityKey || oldDataKey !== dataKey) {
                order.Init(orderData);
            }
            order._orderData = orderData;
            this._orderKeyByUuid[order.node.uuid] = identityKey;
            order.node.setSiblingIndex(i);
        }
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (usedOrders.indexOf(order) === -1) {
                this._restoreOrderNodeTransformByIndex(i);
                order.node.active = false;
                order._orderData = null;
                delete this._orderKeyByUuid[order.node.uuid];
            }
        }
        this._lastSortedOrderKeys = this._getActiveOrdersBySiblingIndex()
            .map(order => this._orderKeyByUuid[order.node.uuid] || '');
        this._updateLayout();
        this._moveOrdersFromOldPos(oldPosByKey, 0.22);
        if (hasNewOrder && GameKit.SoundManager && GameKit.SoundManager.playOrderNewSound) {
            GameKit.SoundManager.playOrderNewSound();
        }
        this._hasInitOrderListOnce = true;
    }

    InitOrderList (orders: any) {
        if (this._isPlayingClaimAnim) {
            this._pendingOrdersForInit = orders;
            return;
        }
        this._applyInitOrderList(orders);
    }

    BeginClaimTransition () {
        this._isPlayingClaimAnim = true;
    }

    EndClaimTransition () {
        this._isPlayingClaimAnim = false;
        this._flushPendingInitOrderList();
    }

    _flushPendingInitOrderList () {
        if (!this._pendingOrdersForInit) return;
        const pendingOrders = this._pendingOrdersForInit;
        this._pendingOrdersForInit = null;
        this._applyInitOrderList(pendingOrders);
    }

    PlayClaimedOrderRemoveAnim (claimedOrderRef: any, cb: any) {
        const activeOrders = this._getActiveOrdersBySiblingIndex();
        let claimedOrder: MergeOrder | null = null;
        if (claimedOrderRef && claimedOrderRef.node) {
            claimedOrder = claimedOrderRef;
        } else {
            const claimedSlotIndex = claimedOrderRef;
            claimedOrder = activeOrders.filter(o => Number(o.slotIndex) === Number(claimedSlotIndex))[0] || null;
        }
        if (!claimedOrder) {
            this.EndClaimTransition();
            if (cb) cb();
            return;
        }

        const claimedIndex = activeOrders.indexOf(claimedOrder);
        const actionDuration = 0.2;
        const moveDuration = 0.22;
        const layout = this._getOrderLayout();
        const layoutWasEnabled = !!(layout && layout.enabled);
        const followOrders = activeOrders.slice(claimedIndex + 1);
        const oldPosByUuid: any = {};
        const targetPosByUuid: any = {};
        followOrders.forEach(order => {
            oldPosByUuid[order.node.uuid] = order.node.position.clone();
        });
        for (let i = claimedIndex + 1; i < activeOrders.length; i++) {
            const order = activeOrders[i];
            const targetOrder = activeOrders[i - 1];
            if (!order || !targetOrder) continue;
            targetPosByUuid[order.node.uuid] = targetOrder.node.position.clone();
        }

        Tween.stopAllByTarget(claimedOrder.node);
        const opacity = getOrAddOpacity(claimedOrder.node);
        if (claimedOrder.PlayLeave) claimedOrder.PlayLeave();
        tween(claimedOrder.node)
            .to(actionDuration, { scale: Vec3.ZERO }, { easing: 'cubicOut' as any })
            .call(() => {
                claimedOrder!.node.active = false;
                opacity.opacity = 255;
                claimedOrder!.node.setScale(Vec3.ONE);
                if (layout && layoutWasEnabled) layout.enabled = false;
                followOrders.forEach(order => {
                    if (!order.node.active) return;
                    const toPos = targetPosByUuid[order.node.uuid];
                    const fromPos = oldPosByUuid[order.node.uuid];
                    if (!fromPos || !toPos) return;
                    order.node.position = fromPos.clone ? fromPos.clone() : fromPos;
                    this._moveNodeTo(order.node, moveDuration, toPos);
                });
                this.scheduleOnce(() => {
                    if (layout && layoutWasEnabled) {
                        layout.enabled = true;
                        layout.updateLayout();
                    }
                    followOrders.forEach(order => {
                        if (!order.node.active) return;
                        const toPos = targetPosByUuid[order.node.uuid];
                        if (toPos) order.node.position = toPos.clone ? toPos.clone() : toPos;
                    });
                    this.EndClaimTransition();
                    if (cb) cb();
                }, moveDuration);
            })
            .start();
        tween(opacity).to(actionDuration, { opacity: 0 }).start();
    }

    HideOrderCompleteBtn () {
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (order) order.HideCompleteBtn();
        }
    }

    _isOrderComplete (order: any, stageIds: any) {
        if (!order.ids || order.ids.length === 0) return false;
        const s = stageIds ? stageIds.concat() : [];
        for (let i = 0; i < order.ids.length; i++) {
            const idx = s.indexOf(parseInt(order.ids[i], 10));
            if (idx === -1) return false;
            s.splice(idx, 1);
        }
        return true;
    }

    _sortActiveOrdersByComplete (stageIds: any) {
        const activeOrders = this._getActiveOrdersBySiblingIndex();
        const oldPosByKey = this._snapshotActiveOrderPosByKey();
        const orderIndexByUuid: any = {};
        activeOrders.forEach((order, index) => {
            orderIndexByUuid[order.node.uuid] = index;
        });
        activeOrders.sort((a, b) => {
            const aComplete = this._isOrderComplete(a, stageIds);
            const bComplete = this._isOrderComplete(b, stageIds);
            if (aComplete === bComplete) {
                return orderIndexByUuid[a.node.uuid] - orderIndexByUuid[b.node.uuid];
            }
            return aComplete ? -1 : 1;
        });
        const nextSortedKeys = activeOrders.map(order => this._orderKeyByUuid[order.node.uuid] || '');
        let sameOrder = this._lastSortedOrderKeys.length === nextSortedKeys.length;
        if (sameOrder) {
            for (let i = 0; i < nextSortedKeys.length; i++) {
                if (this._lastSortedOrderKeys[i] !== nextSortedKeys[i]) {
                    sameOrder = false;
                    break;
                }
            }
        }
        if (sameOrder) return;
        for (let i = 0; i < activeOrders.length; i++) {
            activeOrders[i].node.setSiblingIndex(i);
        }
        this._lastSortedOrderKeys = nextSortedKeys;
        this._updateLayout();
        this._moveOrdersFromOldPos(oldPosByKey, 0.22);
    }

    CheckOrderComplete (stageIds: any) {
        this._ensureRuntimeState();
        this._sortActiveOrdersByComplete(stageIds);
        const allcompleteIds: number[] = [];
        const completeOrderIds: number[] = [];
        let hasNewCompleteOrder = false;
        for (let i = 0; i < this.orderList.length; i++) {
            const order = this.orderList[i];
            if (order.node.active) {
                const key = this._orderKeyByUuid[order.node.uuid];
                const isCompleteNow = this._isOrderComplete(order, stageIds);
                const hasLastState = Object.prototype.hasOwnProperty.call(this._lastCompleteStateByOrderKey, key);
                const shouldPlayCompleteAnim = hasLastState && !this._lastCompleteStateByOrderKey[key] && isCompleteNow;
                if (shouldPlayCompleteAnim) hasNewCompleteOrder = true;
                const completeIds = order.CheckComplete(stageIds, shouldPlayCompleteAnim);
                this._lastCompleteStateByOrderKey[key] = isCompleteNow;
                allcompleteIds.push(...completeIds);
                if (isCompleteNow) completeOrderIds.push(...completeIds);
            }
        }
        return {
            completeIds: allcompleteIds.slice(),
            completeOrderIds: completeOrderIds.slice(),
            hasNewCompleteOrder: hasNewCompleteOrder,
        };
    }
}

export default MergeOrderGroup;
