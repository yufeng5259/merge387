/**
 * MergeOrderLogic - local order runtime logic.
 *
 * The server only persists merge snapshots. Order generation, progress, piece
 * removal, and local reward side effects live here so the Cocos client can run
 * the board as a single-player state machine.
 */
type MergeOrderLogicApi = Record<string, any>;
type MergeOrderWindow = Window & { MergeOrderLogic?: MergeOrderLogicApi };
var MergeOrderLogic: MergeOrderLogicApi = {};

MergeOrderLogic.MAX_ORDER_SLOTS = 6;
MergeOrderLogic.ORDER_MODE_NEWBIE = 'newbie';
MergeOrderLogic.ORDER_MODE_NORMAL = 'normal';
MergeOrderLogic.ORDER_TYPE_NEWBIE = 'newbie';
MergeOrderLogic.ORDER_TYPE_NORMAL = 'normal';
MergeOrderLogic.ORDER_TYPE_RECYCLE = 'recycle';
MergeOrderLogic.SLOT_CHARGE_POLICY_VERSION = 2;
MergeOrderLogic.GENERATOR_ELIGIBILITY_VERSION = 1;
MergeOrderLogic.DEFAULT_ROLE_NAME = 'Ava';
MergeOrderLogic.DEFAULT_RANDOM_ORDER_ID = 100000000;
MergeOrderLogic.DEFAULT_RECYCLE_ORDER_ID = 200000000;
MergeOrderLogic.MAX_ORDER_ITEM_COUNT = 3;
MergeOrderLogic.CONTENT_TYPES = {
    COIN: 1,
    JIGSAW: 101,
    ACTIVITY_ITEM: 102
};

MergeOrderLogic.seededRandom = function (seed) {
    var s = parseInt(seed);
    if (isNaN(s) || s <= 0) s = 1;
    return function () {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
};

MergeOrderLogic.seededRandomInt = function (rng, min, max) {
    if (max < min) return min;
    return min + Math.floor(rng() * (max - min + 1));
};

MergeOrderLogic.seedFromString = function (str) {
    if (str == null || str === '') return 1;
    var h = 0;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h) || 1;
};

MergeOrderLogic._nextSeed = function (rng) {
    return Math.floor(rng() * 233280) + 1;
};

MergeOrderLogic._toNumber = function (value, def) {
    var n = Number(value);
    return isFinite(n) ? n : def;
};

MergeOrderLogic._toInt = function (value, def) {
    var n = parseInt(value);
    return isNaN(n) ? def : n;
};

MergeOrderLogic._asArray = function (value) {
    if (value == null || value === '') return [];
    if (Array.isArray(value)) return value.slice();
    if (typeof value === 'string') {
        var text = value.trim();
        if (!text) return [];
        try {
            var parsed = JSON.parse(text);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return text.split(/[;,，；\s]+/).filter(function (item) { return item !== ''; });
        }
    }
    return [value];
};

MergeOrderLogic._parseJsonArray = function (value) {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];
    var text = value.trim();
    if (!text) return [];
    try {
        var parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

MergeOrderLogic._parseWeightedEntries = function (value) {
    var raw = MergeOrderLogic._asArray(value);
    var result = [];
    for (var i = 0; i < raw.length; i++) {
        var item = raw[i];
        if (item == null || item === '') continue;
        if (typeof item === 'object') {
            var id = item.id != null ? item.id : item.value;
            var weight = item.weight != null ? item.weight : item.rate;
            id = MergeOrderLogic._toInt(id, NaN);
            weight = MergeOrderLogic._toNumber(weight, NaN);
            if (!isNaN(id) && isFinite(weight) && weight > 0) {
                result.push({ id: id, weight: weight });
            }
            continue;
        }
        var parts = String(item).split(String(item).indexOf('-') >= 0 ? '-' : '=');
        if (parts.length < 2) continue;
        var parsedId = MergeOrderLogic._toInt(parts[0], NaN);
        var parsedWeight = MergeOrderLogic._toNumber(parts[1], NaN);
        if (!isNaN(parsedId) && isFinite(parsedWeight) && parsedWeight > 0) {
            result.push({ id: parsedId, weight: parsedWeight });
        }
    }
    return result;
};

MergeOrderLogic._weightedPick = function (entries, rng) {
    if (!entries || entries.length <= 0) return null;
    var total = 0;
    for (var i = 0; i < entries.length; i++) total += Number(entries[i].weight) || 0;
    if (total <= 0) return entries[0].id;
    var roll = rng() * total;
    var acc = 0;
    for (var j = 0; j < entries.length; j++) {
        acc += Number(entries[j].weight) || 0;
        if (roll < acc) return entries[j].id;
    }
    return entries[entries.length - 1].id;
};

MergeOrderLogic._seededShuffle = function (arr, rng) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
};

MergeOrderLogic.parseRewardString = function (value) {
    if (value == null || value === '') return [];
    if (Array.isArray(value)) {
        var list = [];
        for (var i = 0; i < value.length; i++) {
            if (!value[i]) continue;
            if (typeof value[i] === 'string') {
                list = list.concat(MergeOrderLogic.parseRewardString(value[i]));
            } else {
                var type = MergeOrderLogic._toInt(value[i].type, NaN);
                var cid = MergeOrderLogic._toInt(value[i].cid, NaN);
                var count = MergeOrderLogic._toNumber(value[i].count, NaN);
                if (!isNaN(type) && !isNaN(cid) && isFinite(count) && count > 0) {
                    list.push({ type: type, cid: cid, count: count });
                }
            }
        }
        return list;
    }
    var text = String(value).trim();
    if (!text || text === '0') return [];
    var parts = text.split(';');
    var result = [];
    for (var p = 0; p < parts.length; p++) {
        var item = parts[p].trim();
        if (!item) continue;
        var segs = item.split('=');
        if (segs.length < 3) continue;
        var parsedType = MergeOrderLogic._toInt(segs[0], NaN);
        var parsedCid = MergeOrderLogic._toInt(segs[1], NaN);
        var parsedCount = MergeOrderLogic._toNumber(segs[2], NaN);
        if (!isNaN(parsedType) && !isNaN(parsedCid) && isFinite(parsedCount) && parsedCount > 0) {
            result.push({ type: parsedType, cid: parsedCid, count: parsedCount });
        }
    }
    return result;
};

MergeOrderLogic.parseRequiredPieces = function (value) {
    var pieces = {};
    if (value == null || value === '') return pieces;
    var items = MergeOrderLogic._asArray(value);
    for (var i = 0; i < items.length; i++) {
        var id = MergeOrderLogic._toInt(items[i], NaN);
        if (isNaN(id) || id <= 0) continue;
        pieces[id] = (pieces[id] || 0) + 1;
    }
    return pieces;
};

MergeOrderLogic._ensureOrderState = function (orderState, seedKey) {
    if (!orderState || typeof orderState !== 'object' || Array.isArray(orderState)) orderState = {};
    if (!Array.isArray(orderState.orders)) orderState.orders = [];
    if (!Array.isArray(orderState.completedOrderIds)) orderState.completedOrderIds = [];
    if (orderState.orderSeed == null || isNaN(parseInt(orderState.orderSeed))) {
        orderState.orderSeed = MergeOrderLogic.seedFromString(seedKey || 'orders');
    }
    if (!orderState.mode) orderState.mode = MergeOrderLogic.ORDER_MODE_NEWBIE;
    if (orderState.newbieNextOrderId == null || isNaN(parseInt(orderState.newbieNextOrderId))) {
        orderState.newbieNextOrderId = 0;
    }
    if (orderState.hardSequenceIndex == null || isNaN(parseInt(orderState.hardSequenceIndex))) {
        orderState.hardSequenceIndex = 0;
    }
    if (orderState.nextRandomOrderId == null || isNaN(parseInt(orderState.nextRandomOrderId))) {
        orderState.nextRandomOrderId = MergeOrderLogic.DEFAULT_RANDOM_ORDER_ID;
    }
    if (orderState.nextRecycleOrderId == null || isNaN(parseInt(orderState.nextRecycleOrderId))) {
        orderState.nextRecycleOrderId = MergeOrderLogic.DEFAULT_RECYCLE_ORDER_ID;
    }
    if (orderState.slotChargePolicyVersion == null || isNaN(parseInt(orderState.slotChargePolicyVersion))) {
        orderState.slotChargePolicyVersion = 0;
    }
    if (!orderState.slotStates || typeof orderState.slotStates !== 'object' || Array.isArray(orderState.slotStates)) {
        orderState.slotStates = {};
    }
    if (!orderState.slotTypeStates || typeof orderState.slotTypeStates !== 'object' || Array.isArray(orderState.slotTypeStates)) {
        orderState.slotTypeStates = {};
    }
    if (!orderState.levelOrderAllCompleteNotified || typeof orderState.levelOrderAllCompleteNotified !== 'object' || Array.isArray(orderState.levelOrderAllCompleteNotified)) {
        orderState.levelOrderAllCompleteNotified = {};
    }
    orderState.waitingForLevelUpgrade = orderState.waitingForLevelUpgrade === true;
    if (orderState.lastCompletedOrder == null || typeof orderState.lastCompletedOrder !== 'object') {
        orderState.lastCompletedOrder = null;
    }
    return orderState;
};

MergeOrderLogic._hasId = function (list, id) {
    if (!list) return false;
    for (var i = 0; i < list.length; i++) {
        if (String(list[i]) === String(id)) return true;
    }
    return false;
};

MergeOrderLogic._pushUniqueId = function (list, id) {
    if (!MergeOrderLogic._hasId(list, id)) list.push(id);
};

MergeOrderLogic._getCurrentTime = function (configProvider) {
    if (configProvider && typeof configProvider.getCurrentTime === 'function') {
        var t = parseInt(configProvider.getCurrentTime());
        if (!isNaN(t)) return t;
    }
    return Math.floor(Date.now() / 1000);
};

MergeOrderLogic._getAllNewbieOrderMetas = function (configProvider) {
    var list = [];
    if (configProvider && typeof configProvider.getAllNewbieOrderMetas === 'function') {
        list = configProvider.getAllNewbieOrderMetas() || [];
    } else if (configProvider && typeof configProvider.getAllOrderMetas === 'function') {
        list = configProvider.getAllOrderMetas() || [];
    }
    list = list.slice().filter(function (meta) { return meta && meta.id != null; });
    list.sort(function (a, b) { return Number(a.id) - Number(b.id); });
    return list;
};

MergeOrderLogic._getNewbieMetaLevel = function (meta) {
    var level = MergeOrderLogic._toInt(meta && meta.level, 0);
    return level > 0 ? level : 0;
};

MergeOrderLogic._getActiveNewbieIds = function (orderState) {
    var ids = [];
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order || order.claimed) continue;
        if (order.orderType === MergeOrderLogic.ORDER_TYPE_NEWBIE || order.mode === MergeOrderLogic.ORDER_MODE_NEWBIE) {
            ids.push(order.orderId);
        }
    }
    return ids;
};

MergeOrderLogic._findNextPendingNewbieMeta = function (orderState, configProvider) {
    var metas = MergeOrderLogic._getAllNewbieOrderMetas(configProvider);
    if (metas.length <= 0) {
        orderState.newbieNextOrderId = 0;
        return null;
    }
    var activeIds = MergeOrderLogic._getActiveNewbieIds(orderState);
    for (var i = 0; i < metas.length; i++) {
        var meta = metas[i];
        if (MergeOrderLogic._hasId(activeIds, meta.id)) continue;
        if (MergeOrderLogic._hasId(orderState.completedOrderIds, meta.id)) continue;
        orderState.newbieNextOrderId = meta.id;
        return meta;
    }
    orderState.newbieNextOrderId = Number(metas[metas.length - 1].id) + 1;
    return null;
};

MergeOrderLogic._advanceNewbiePointer = function (orderState, meta, configProvider) {
    var metas = MergeOrderLogic._getAllNewbieOrderMetas(configProvider);
    for (var i = 0; i < metas.length; i++) {
        if (String(metas[i].id) === String(meta.id)) {
            orderState.newbieNextOrderId = metas[i + 1] ? metas[i + 1].id : Number(meta.id) + 1;
            return;
        }
    }
    orderState.newbieNextOrderId = Number(meta.id) + 1;
};

MergeOrderLogic._getLevelNewbieMetas = function (configProvider, playerLevel) {
    var level = MergeOrderLogic._toInt(playerLevel, 1);
    var metas = MergeOrderLogic._getAllNewbieOrderMetas(configProvider);
    return metas.filter(function (meta) {
        return MergeOrderLogic._getNewbieMetaLevel(meta) === level;
    });
};

MergeOrderLogic._hasActiveNewbieOrderForLevel = function (orderState, playerLevel, configProvider) {
    var level = MergeOrderLogic._toInt(playerLevel, 1);
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order || order.claimed) continue;
        if (order.orderType !== MergeOrderLogic.ORDER_TYPE_NEWBIE && order.mode !== MergeOrderLogic.ORDER_MODE_NEWBIE) continue;
        var orderLevel = MergeOrderLogic._toInt(order.level, 0);
        if (!orderLevel && configProvider && typeof configProvider.getOrderMeta === 'function') {
            var meta = configProvider.getOrderMeta(order.orderId);
            orderLevel = MergeOrderLogic._getNewbieMetaLevel(meta);
        }
        if (orderLevel === level) return true;
    }
    return false;
};

MergeOrderLogic._isPlayerLevelNewbieComplete = function (orderState, playerLevel, configProvider) {
    var metas = MergeOrderLogic._getLevelNewbieMetas(configProvider, playerLevel);
    if (metas.length <= 0) return false;
    for (var i = 0; i < metas.length; i++) {
        if (!MergeOrderLogic._hasId(orderState.completedOrderIds, metas[i].id)) return false;
    }
    return !MergeOrderLogic._hasActiveNewbieOrderForLevel(orderState, playerLevel, configProvider);
};

MergeOrderLogic._markLevelOrderAllComplete = function (orderState, playerLevel) {
    var level = MergeOrderLogic._toInt(playerLevel, 1);
    if (!orderState.levelOrderAllCompleteNotified) orderState.levelOrderAllCompleteNotified = {};
    if (orderState.levelOrderAllCompleteNotified[String(level)]) return false;
    orderState.levelOrderAllCompleteNotified[String(level)] = true;
    return true;
};

MergeOrderLogic._getUnlockedSlots = function (playerLevel, configProvider) {
    var level = MergeOrderLogic._toInt(playerLevel, 1);
    var slots = [];
    if (configProvider && typeof configProvider.getOrderSlots === 'function') {
        slots = configProvider.getOrderSlots(level) || [];
    }
    if (!slots || slots.length <= 0) {
        var count = Math.max(1, Math.min(MergeOrderLogic.MAX_ORDER_SLOTS, level || 1));
        for (var i = 0; i < count; i++) {
            slots.push({ id: i + 1, lv: i + 1, slotType: 1, layers: 1, cdTime: 0 });
        }
    }
    slots = slots.slice().map(function (slot, index) {
        var id = slot.id != null ? slot.id : (slot.ID != null ? slot.ID : index + 1);
        return {
            id: MergeOrderLogic._toInt(id, index + 1),
            lv: MergeOrderLogic._toInt(slot.lv, 1),
            slotType: MergeOrderLogic._toInt(slot.slotType != null ? slot.slotType : slot.SlotType, 1),
            layers: Math.max(0, MergeOrderLogic._toInt(slot.layers != null ? slot.layers : slot.Layers, 1)),
            cdTime: Math.max(0, MergeOrderLogic._toInt(slot.cdTime != null ? slot.cdTime : slot.CdTime, 0))
        };
    });
    slots.sort(function (a, b) { return a.id - b.id; });
    if (slots.length > MergeOrderLogic.MAX_ORDER_SLOTS) slots = slots.slice(0, MergeOrderLogic.MAX_ORDER_SLOTS);
    return slots;
};

MergeOrderLogic._getSlotTypeConfigs = function (slots) {
    var configs = {};
    for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        var key = String(slot.slotType);
        if (!configs[key]) {
            configs[key] = {
                slotType: slot.slotType,
                maxLayers: 0,
                cdTime: Math.max(0, MergeOrderLogic._toInt(slot.cdTime, 0)),
                slotIds: []
            };
        }
        configs[key].maxLayers += Math.max(0, MergeOrderLogic._toInt(slot.layers, 1));
        configs[key].slotIds.push(slot.id);
        var cdTime = Math.max(0, MergeOrderLogic._toInt(slot.cdTime, 0));
        if (configs[key].cdTime <= 0 || (cdTime > 0 && cdTime < configs[key].cdTime)) {
            configs[key].cdTime = cdTime;
        }
    }
    return configs;
};

MergeOrderLogic._settleSlotTypeState = function (state, config, now) {
    state.slotType = config.slotType;
    var previousMax = Math.max(0, MergeOrderLogic._toInt(state.maxLayers, config.maxLayers));
    var layers = Math.max(0, MergeOrderLogic._toInt(state.layers, 0));
    if (config.maxLayers > previousMax) layers += config.maxLayers - previousMax;
    state.maxLayers = config.maxLayers;
    state.layers = Math.min(config.maxLayers, layers);
    state.lastSettleAt = Math.max(0, MergeOrderLogic._toInt(state.lastSettleAt, now));
    state.nextLayerAt = Math.max(0, MergeOrderLogic._toInt(state.nextLayerAt, 0));
    var missingLayers = Math.max(0, state.maxLayers - state.layers);
    var pendingLayerAt = Array.isArray(state.pendingLayerAt)
        ? state.pendingLayerAt.map(function (value) {
            return Math.max(0, MergeOrderLogic._toInt(value, 0));
        }).filter(function (value) { return value > 0; })
        : [];
    pendingLayerAt.sort(function (a, b) { return a - b; });

    if (state.layers >= state.maxLayers) {
        state.pendingLayerAt = [];
        state.nextLayerAt = 0;
        state.lastSettleAt = now;
        return state;
    }
    if (config.cdTime <= 0) {
        state.layers = state.maxLayers;
        state.pendingLayerAt = [];
        state.nextLayerAt = 0;
        state.lastSettleAt = now;
        return state;
    }
    if (pendingLayerAt.length <= 0 && missingLayers > 0) {
        var firstLayerAt = state.nextLayerAt > 0 ? state.nextLayerAt : now + config.cdTime;
        for (var missingIndex = 0; missingIndex < missingLayers; missingIndex++) {
            pendingLayerAt.push(firstLayerAt + missingIndex * config.cdTime);
        }
    }
    if (pendingLayerAt.length > missingLayers) pendingLayerAt = pendingLayerAt.slice(0, missingLayers);
    while (pendingLayerAt.length < missingLayers) {
        var lastPendingAt = pendingLayerAt.length > 0
            ? pendingLayerAt[pendingLayerAt.length - 1]
            : now;
        pendingLayerAt.push(lastPendingAt + config.cdTime);
    }

    var lastRecoveredAt = 0;
    while (pendingLayerAt.length > 0 && pendingLayerAt[0] <= now && state.layers < state.maxLayers) {
        lastRecoveredAt = pendingLayerAt.shift();
        state.layers++;
    }
    if (lastRecoveredAt > 0) state.lastSettleAt = lastRecoveredAt;
    pendingLayerAt = pendingLayerAt.slice(0, Math.max(0, state.maxLayers - state.layers));
    state.pendingLayerAt = pendingLayerAt;
    state.nextLayerAt = pendingLayerAt.length > 0 ? pendingLayerAt[0] : 0;
    return state;
};

MergeOrderLogic._isFixedNewbieOrder = function (order) {
    return !!order && (order.usesSlotCharge === false ||
        order.orderType === MergeOrderLogic.ORDER_TYPE_NEWBIE ||
        order.mode === MergeOrderLogic.ORDER_MODE_NEWBIE);
};

MergeOrderLogic._orderUsesSlotCharge = function (order) {
    if (!order) return false;
    if (order.usesSlotCharge != null) return order.usesSlotCharge === true;
    return !MergeOrderLogic._isFixedNewbieOrder(order);
};

MergeOrderLogic._refundFixedOrderCharges = function (state, refundCount) {
    refundCount = Math.max(0, MergeOrderLogic._toInt(refundCount, 0));
    if (!state || refundCount <= 0) return;
    var maxLayers = Math.max(0, MergeOrderLogic._toInt(state.maxLayers, 0));
    var layers = Math.max(0, MergeOrderLogic._toInt(state.layers, 0));
    var refund = Math.min(refundCount, Math.max(0, maxLayers - layers));
    if (refund <= 0) return;
    state.layers = layers + refund;
    var pendingLayerAt = Array.isArray(state.pendingLayerAt) ? state.pendingLayerAt.slice() : [];
    pendingLayerAt.sort(function (a, b) { return Number(a) - Number(b); });
    if (refund >= pendingLayerAt.length) pendingLayerAt = [];
    else pendingLayerAt.splice(pendingLayerAt.length - refund, refund);
    pendingLayerAt = pendingLayerAt.slice(0, Math.max(0, maxLayers - state.layers));
    state.pendingLayerAt = pendingLayerAt;
    state.nextLayerAt = pendingLayerAt.length > 0 ? pendingLayerAt[0] : 0;
};

MergeOrderLogic._ensureSlotTypeStates = function (orderState, slots, now) {
    var configs = MergeOrderLogic._getSlotTypeConfigs(slots);
    var activeChargeByType = {};
    var activeFixedByType = {};
    var needsPolicyMigration = MergeOrderLogic._toInt(orderState.slotChargePolicyVersion, 0) <
        MergeOrderLogic.SLOT_CHARGE_POLICY_VERSION;
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order || order.claimed) continue;
        var typeKey = String(MergeOrderLogic._toInt(order.slotType, 1));
        if (MergeOrderLogic._orderUsesSlotCharge(order)) {
            activeChargeByType[typeKey] = (activeChargeByType[typeKey] || 0) + 1;
        } else {
            activeFixedByType[typeKey] = (activeFixedByType[typeKey] || 0) + 1;
        }
    }
    if (needsPolicyMigration && MergeOrderLogic._isFixedNewbieOrder(orderState.lastCompletedOrder)) {
        var completedSlotType = MergeOrderLogic._toInt(orderState.lastCompletedOrder.slotType, NaN);
        if (isNaN(completedSlotType)) {
            var configKeys = Object.keys(configs);
            if (configKeys.length === 1) completedSlotType = MergeOrderLogic._toInt(configKeys[0], NaN);
        }
        if (!isNaN(completedSlotType)) {
            var completedTypeKey = String(completedSlotType);
            activeFixedByType[completedTypeKey] = (activeFixedByType[completedTypeKey] || 0) + 1;
        }
    }

    for (var key in configs) {
        var config = configs[key];
        var state = orderState.slotTypeStates[key];
        var hadSlotTypeState = !!state && typeof state === 'object' && !Array.isArray(state);
        if (!hadSlotTypeState) {
            var oldLayerEnds = [];
            for (var s = 0; s < config.slotIds.length; s++) {
                var oldState = orderState.slotStates[String(config.slotIds[s])];
                var oldEnd = MergeOrderLogic._toInt(oldState && oldState.cdEndTime, 0);
                if (oldEnd > now) oldLayerEnds.push(oldEnd);
            }
            oldLayerEnds.sort(function (a, b) { return a - b; });
            var blockedCount = oldLayerEnds.length;
            var initialLayers = Math.max(0, config.maxLayers - (activeChargeByType[key] || 0) - blockedCount);
            var missingLayers = Math.max(0, config.maxLayers - initialLayers);
            var pendingLayerAt = oldLayerEnds.slice(0, missingLayers);
            var syntheticCount = Math.max(0, missingLayers - pendingLayerAt.length);
            for (var syntheticIndex = 0; syntheticIndex < syntheticCount; syntheticIndex++) {
                pendingLayerAt.push(now + (syntheticIndex + 1) * config.cdTime);
            }
            pendingLayerAt.sort(function (a, b) { return a - b; });
            state = {
                slotType: config.slotType,
                layers: initialLayers,
                maxLayers: config.maxLayers,
                pendingLayerAt: pendingLayerAt,
                nextLayerAt: pendingLayerAt.length > 0 ? pendingLayerAt[0] : 0,
                lastSettleAt: now
            };
            orderState.slotTypeStates[key] = state;
        }
        MergeOrderLogic._settleSlotTypeState(state, config, now);
        if (needsPolicyMigration && hadSlotTypeState) {
            MergeOrderLogic._refundFixedOrderCharges(state, activeFixedByType[key] || 0);
        }
        for (var legacyIndex = 0; legacyIndex < config.slotIds.length; legacyIndex++) {
            delete orderState.slotStates[String(config.slotIds[legacyIndex])];
        }
    }
    for (var stateKey in orderState.slotTypeStates) {
        if (!configs[stateKey]) delete orderState.slotTypeStates[stateKey];
    }
    orderState.slotChargePolicyVersion = MergeOrderLogic.SLOT_CHARGE_POLICY_VERSION;
    return configs;
};

MergeOrderLogic._hasSlotCharge = function (orderState, slot) {
    var state = orderState.slotTypeStates[String(slot.slotType)];
    return !!state && MergeOrderLogic._toInt(state.layers, 0) > 0;
};

MergeOrderLogic._findNearestCoolingEmptySlot = function (orderState, slots) {
    var best = null;
    var bestAt = 0;
    var hasEmptySlot = false;
    for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        if (MergeOrderLogic._findOrderBySlotId(orderState, slot.id)) continue;
        hasEmptySlot = true;
        var state = orderState.slotTypeStates[String(slot.slotType)];
        if (!state) return null;
        if (MergeOrderLogic._toInt(state.layers, 0) > 0) return null;
        var nextLayerAt = MergeOrderLogic._toInt(state.nextLayerAt, 0);
        if (nextLayerAt <= 0) return null;
        if (!best || nextLayerAt < bestAt ||
            (nextLayerAt === bestAt && Number(slot.id) < Number(best.id))) {
            best = slot;
            bestAt = nextLayerAt;
        }
    }
    return hasEmptySlot ? best : null;
};

MergeOrderLogic._forceRecoverSlotCharge = function (orderState, slot, now) {
    var key = String(slot.slotType);
    var state = orderState.slotTypeStates[key];
    if (!state) return false;
    var maxLayers = Math.max(0, MergeOrderLogic._toInt(state.maxLayers, 0));
    var layers = Math.max(0, MergeOrderLogic._toInt(state.layers, 0));
    if (maxLayers <= 0 || layers >= maxLayers) return false;
    var pendingLayerAt = Array.isArray(state.pendingLayerAt) ? state.pendingLayerAt.slice() : [];
    pendingLayerAt = pendingLayerAt.map(function (value) {
        return Math.max(0, MergeOrderLogic._toInt(value, 0));
    }).filter(function (value) { return value > 0; });
    pendingLayerAt.sort(function (a, b) { return a - b; });
    if (pendingLayerAt.length <= 0) {
        var nextLayerAt = MergeOrderLogic._toInt(state.nextLayerAt, 0);
        if (nextLayerAt <= 0) return false;
        pendingLayerAt.push(nextLayerAt);
    }
    pendingLayerAt.shift();
    state.layers = Math.min(maxLayers, layers + 1);
    pendingLayerAt = pendingLayerAt.slice(0, Math.max(0, maxLayers - state.layers));
    state.pendingLayerAt = pendingLayerAt;
    state.nextLayerAt = pendingLayerAt.length > 0 ? pendingLayerAt[0] : 0;
    state.lastSettleAt = now;
    return true;
};

MergeOrderLogic._consumeSlotCharge = function (orderState, slot, slotTypeConfigs, now) {
    var key = String(slot.slotType);
    var state = orderState.slotTypeStates[key];
    var config = slotTypeConfigs[key];
    if (!state || !config || MergeOrderLogic._toInt(state.layers, 0) <= 0) return false;
    state.layers = Math.max(0, MergeOrderLogic._toInt(state.layers, 0) - 1);
    state.lastSettleAt = now;
    if (config.cdTime <= 0) {
        state.layers = state.maxLayers;
        state.pendingLayerAt = [];
        state.nextLayerAt = 0;
        return true;
    }
    var pendingLayerAt = Array.isArray(state.pendingLayerAt) ? state.pendingLayerAt.slice() : [];
    pendingLayerAt = pendingLayerAt.map(function (value) {
        return Math.max(0, MergeOrderLogic._toInt(value, 0));
    }).filter(function (value) { return value > 0; });
    pendingLayerAt.sort(function (a, b) { return a - b; });
    var lastPendingAt = pendingLayerAt.length > 0 ? pendingLayerAt[pendingLayerAt.length - 1] : now;
    pendingLayerAt.push(Math.max(now, lastPendingAt) + config.cdTime);
    pendingLayerAt = pendingLayerAt.slice(0, Math.max(0, state.maxLayers - state.layers));
    state.pendingLayerAt = pendingLayerAt;
    state.nextLayerAt = pendingLayerAt.length > 0 ? pendingLayerAt[0] : 0;
    return true;
};

MergeOrderLogic.getNextOrderChargeAt = function (orderState, playerLevel, configProvider) {
    if (!orderState || !orderState.slotTypeStates) return 0;
    var nearest = 0;
    for (var key in orderState.slotTypeStates) {
        var nextLayerAt = MergeOrderLogic._toInt(orderState.slotTypeStates[key].nextLayerAt, 0);
        if (nextLayerAt > 0 && (!nearest || nextLayerAt < nearest)) nearest = nextLayerAt;
    }
    return nearest;
};

MergeOrderLogic._findOrderBySlotId = function (orderState, slotId) {
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (order && Number(order.slotId) === Number(slotId) && !order.claimed) return order;
    }
    return null;
};

MergeOrderLogic._normalizeExistingSlots = function (orderState, slots, limit, now) {
    limit = Math.max(0, MergeOrderLogic._toInt(limit, slots.length));
    var activeSlots = slots.slice(0, Math.min(slots.length, limit));
    var byId = {};
    var slotIndexById = {};
    for (var s = 0; s < activeSlots.length; s++) {
        byId[String(activeSlots[s].id)] = activeSlots[s];
        slotIndexById[String(activeSlots[s].id)] = s;
    }
    var candidates = [];
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order) continue;
        candidates.push(order);
    }
    candidates.sort(function (a, b) {
        var as = Number(a.slotId != null ? a.slotId : a.slotIndex);
        var bs = Number(b.slotId != null ? b.slotId : b.slotIndex);
        if (isNaN(as)) as = 999;
        if (isNaN(bs)) bs = 999;
        if (as !== bs) return as - bs;
        return (Number(a.orderId) || 0) - (Number(b.orderId) || 0);
    });
    orderState.orders = [];

    var usedSlotIds = {};
    var assignToSlot = function (normalizedOrder, slot) {
        normalizedOrder.usesSlotCharge = MergeOrderLogic._orderUsesSlotCharge(normalizedOrder);
        normalizedOrder.slotId = slot.id;
        normalizedOrder.slotType = slot.slotType;
        normalizedOrder.slotCdTime = slot.cdTime || 0;
        normalizedOrder.slotIndex = slotIndexById[String(slot.id)] || 0;
        orderState.orders.push(normalizedOrder);
        usedSlotIds[String(slot.id)] = true;
    };

    for (var index = 0; index < candidates.length; index++) {
        var candidate = candidates[index];
        var preferredSlotId = candidate.slotId != null
            ? MergeOrderLogic._toInt(candidate.slotId, NaN)
            : NaN;
        if (isNaN(preferredSlotId) && candidate.slotIndex != null) {
            var preferredIndex = MergeOrderLogic._toInt(candidate.slotIndex, NaN);
            if (!isNaN(preferredIndex) && activeSlots[preferredIndex]) {
                preferredSlotId = activeSlots[preferredIndex].id;
            }
        }
        var preferredSlot = byId[String(preferredSlotId)];
        if (preferredSlot && !usedSlotIds[String(preferredSlot.id)]) {
            assignToSlot(candidate, preferredSlot);
        }
    }

    // slotId is persistent ownership. Invalid or duplicate legacy entries are dropped
    // instead of being moved into another logical slot.
};

MergeOrderLogic._getOrderLevelConfig = function (playerLevel, configProvider) {
    if (configProvider && typeof configProvider.getOrderLevelConfig === 'function') {
        return configProvider.getOrderLevelConfig(playerLevel) || null;
    }
    return null;
};

MergeOrderLogic._getOrderMax = function (levelConfig, slots) {
    var max = levelConfig ? MergeOrderLogic._toInt(levelConfig.orderMax, slots.length) : slots.length;
    if (max <= 0) max = slots.length;
    return Math.max(1, Math.min(slots.length, max));
};

MergeOrderLogic._getHardSequence = function (levelConfig) {
    if (!levelConfig || levelConfig.hardSequence == null) return [1];
    var items = MergeOrderLogic._asArray(levelConfig.hardSequence);
    var result = [];
    for (var i = 0; i < items.length; i++) {
        var n = MergeOrderLogic._toInt(items[i], NaN);
        if (!isNaN(n) && n > 0) result.push(n);
    }
    return result.length > 0 ? result : [1];
};

MergeOrderLogic._peekDifficulty = function (orderState, levelConfig) {
    var seq = MergeOrderLogic._getHardSequence(levelConfig);
    var index = MergeOrderLogic._toInt(orderState.hardSequenceIndex, 0);
    return seq[index % seq.length] || 1;
};

MergeOrderLogic._advanceDifficulty = function (orderState) {
    var index = MergeOrderLogic._toInt(orderState.hardSequenceIndex, 0);
    orderState.hardSequenceIndex = index + 1;
};

MergeOrderLogic._nextDifficulty = function (orderState, levelConfig) {
    var difficulty = MergeOrderLogic._peekDifficulty(orderState, levelConfig);
    MergeOrderLogic._advanceDifficulty(orderState);
    return difficulty;
};

MergeOrderLogic._rollItemCount = function (levelConfig, rng) {
    var entries = MergeOrderLogic._parseWeightedEntries(levelConfig ? levelConfig.itemNumRate : null);
    if (entries.length <= 0) return 1;
    var picked = MergeOrderLogic._weightedPick(entries, rng);
    picked = MergeOrderLogic._toInt(picked, 1);
    return Math.max(1, Math.min(MergeOrderLogic.MAX_ORDER_ITEM_COUNT, picked));
};

MergeOrderLogic._getPlanRows = function (levelConfig, difficulty) {
    if (!levelConfig) return [];
    var key = 'hard' + difficulty + 'Plan';
    var rows = MergeOrderLogic._parseJsonArray(levelConfig[key]);
    if (!rows || rows.length <= 0) return [];
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        var row = Array.isArray(rows[i]) ? rows[i] : [rows[i]];
        var levels = [];
        for (var j = 0; j < row.length && levels.length < MergeOrderLogic.MAX_ORDER_ITEM_COUNT; j++) {
            var lv = MergeOrderLogic._toInt(row[j], NaN);
            if (!isNaN(lv) && lv > 0) levels.push(lv);
        }
        if (levels.length > 0) result.push(levels);
    }
    return result;
};

MergeOrderLogic._selectPlanLevels = function (levelConfig, difficulty, itemCount, rng) {
    var candidates = MergeOrderLogic._getPlanLevelCandidates(levelConfig, difficulty, itemCount, rng);
    return candidates.length > 0 ? candidates[0].slice(0, MergeOrderLogic.MAX_ORDER_ITEM_COUNT) : [];
};

MergeOrderLogic._getPlanLevelCandidates = function (levelConfig, difficulty, itemCount, rng) {
    rng = typeof rng === 'function' ? rng : MergeOrderLogic.seededRandom(1);
    var rows = MergeOrderLogic._getPlanRows(levelConfig, difficulty);
    if (rows.length <= 0) return [[1]];
    var maxCount = Math.max(1, Math.min(
        MergeOrderLogic.MAX_ORDER_ITEM_COUNT,
        MergeOrderLogic._toInt(itemCount, 1)
    ));
    var grouped = {};
    for (var i = 0; i < rows.length; i++) {
        var count = rows[i].length;
        if (count <= 0 || count > maxCount) continue;
        if (!grouped[count]) grouped[count] = [];
        grouped[count].push(rows[i]);
    }
    var candidates = [];
    for (var size = maxCount; size >= 1; size--) {
        var group = grouped[size] || [];
        if (group.length <= 0) continue;
        var shuffled = MergeOrderLogic._seededShuffle(group.slice(), rng);
        for (var j = 0; j < shuffled.length; j++) {
            candidates.push(shuffled[j].slice(0, MergeOrderLogic.MAX_ORDER_ITEM_COUNT));
        }
    }
    return candidates;
};

MergeOrderLogic._getElementMeta = function (pieceId, configProvider) {
    if (configProvider && typeof configProvider.getElementMeta === 'function') {
        return configProvider.getElementMeta(pieceId);
    }
    return null;
};

MergeOrderLogic._getAllElementMetas = function (configProvider) {
    var list = [];
    if (configProvider && typeof configProvider.getAllElementMetas === 'function') {
        list = configProvider.getAllElementMetas() || [];
    }
    var byId = {};
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (!item || item.id == null) continue;
        byId[String(item.id)] = item;
    }
    var computing = {};
    var computeLevel = function (id) {
        var meta = byId[String(id)];
        if (!meta) return 0;
        var own = MergeOrderLogic._toInt(meta.level, 0);
        if (own > 0) return own;
        if (computing[String(id)]) return 1;
        computing[String(id)] = true;
        var preId = meta.preId != null ? meta.preId : meta.prevId;
        if (preId == null || Number(preId) < 0 || !byId[String(preId)]) own = 1;
        else own = computeLevel(preId) + 1;
        delete computing[String(id)];
        meta.level = own;
        return own;
    };
    var enabled = [];
    for (var j = 0; j < list.length; j++) {
        computeLevel(list[j].id);
        if (MergeOrderLogic._getOrderPieceLevel(list[j]) > 0) {
            enabled.push(list[j]);
        }
    }
    return enabled;
};

MergeOrderLogic._getOrderPieceLevel = function (meta) {
    if (!meta) return 0;
    var orderLv = MergeOrderLogic._toInt(meta.orderLv, 0);
    return orderLv > 0 ? orderLv : 0;
};

MergeOrderLogic._isGeneratorPiece = function (pieceId, configProvider) {
    if (configProvider && typeof configProvider.isGeneratorPiece === 'function') {
        return !!configProvider.isGeneratorPiece(pieceId);
    }
    return false;
};

MergeOrderLogic.resolveUnlockedLineTypesFromGenerators = function (pieceIds, configProvider) {
    var highestBySeries = {};
    pieceIds = Array.isArray(pieceIds) ? pieceIds : [];
    for (var i = 0; i < pieceIds.length; i++) {
        var pieceId = pieceIds[i];
        var generator = configProvider && configProvider.getGeneratorByMergeId
            ? configProvider.getGeneratorByMergeId(pieceId)
            : null;
        if (!generator || generator.series == null || generator.series === '') continue;
        var level = configProvider && configProvider.getPieceLevel
            ? MergeOrderLogic._toInt(configProvider.getPieceLevel(pieceId), 0)
            : 0;
        var key = String(generator.series);
        var current = highestBySeries[key];
        if (!current || level > current.level || (level === current.level && Number(pieceId) > Number(current.pieceId))) {
            highestBySeries[key] = { pieceId: pieceId, level: level, generator: generator };
        }
    }

    var unlocked = {};
    for (var series in highestBySeries) {
        var lineTypes = highestBySeries[series].generator.unlockElementsType;
        lineTypes = MergeOrderLogic._asArray(lineTypes);
        for (var lineIndex = 0; lineIndex < lineTypes.length; lineIndex++) {
            var lineType = MergeOrderLogic._toInt(lineTypes[lineIndex], NaN);
            if (!isNaN(lineType)) unlocked[String(lineType)] = lineType;
        }
    }
    var result = [];
    for (var unlockedKey in unlocked) result.push(unlocked[unlockedKey]);
    result.sort(function (a, b) { return Number(a) - Number(b); });
    return result;
};

MergeOrderLogic.resolveAvailableGeneratorPieceIds = function (boardData, warehouseData, configProvider) {
    var pieceIds = [];
    var seen = {};
    var addPieceData = function (pieceData) {
        var parsed = null;
        if (configProvider && typeof configProvider.parsePieceData === 'function') {
            parsed = configProvider.parsePieceData(pieceData);
        } else {
            parsed = MergeOrderLogic._parsePieceData(pieceData);
        }
        var pieceId = parsed ? MergeOrderLogic._toInt(parsed.pieceId, NaN) : NaN;
        if (isNaN(pieceId) || pieceId <= 0) return;

        var status = parsed.status != null ? MergeOrderLogic._toInt(parsed.status, NaN) : -1;
        if (isNaN(status) || status !== -1) return;
        if (parsed.bubbleRewardId != null && isNaN(MergeOrderLogic._toInt(parsed.bubbleRewardId, NaN))) return;

        if (configProvider && typeof configProvider.isBubblePieceData === 'function') {
            if (configProvider.isBubblePieceData(pieceData)) return;
        } else if (parsed.instanceId && String(parsed.instanceId).indexOf('b_') === 0) {
            return;
        }
        if (seen[String(pieceId)]) return;
        seen[String(pieceId)] = true;
        pieceIds.push(pieceId);
    };
    var key;
    boardData = boardData || {};
    warehouseData = warehouseData || {};
    for (key in boardData) addPieceData(boardData[key]);
    for (key in warehouseData) addPieceData(warehouseData[key]);
    return pieceIds;
};

MergeOrderLogic.resolveUnlockedLineTypesFromSnapshot = function (boardData, warehouseData, configProvider) {
    return MergeOrderLogic.resolveUnlockedLineTypesFromGenerators(
        MergeOrderLogic.resolveAvailableGeneratorPieceIds(boardData, warehouseData, configProvider),
        configProvider
    );
};

MergeOrderLogic._getUnlockedLineTypes = function (playerLevel, configProvider, boardData, warehouseData) {
    var list = [];
    if (configProvider && typeof configProvider.getUnlockedLineTypes === 'function') {
        list = configProvider.getUnlockedLineTypes(playerLevel, boardData, warehouseData) || [];
    } else if (configProvider && typeof configProvider.getUnlockedSeries === 'function') {
        list = configProvider.getUnlockedSeries(playerLevel, boardData, warehouseData) || [];
    }
    list = list.slice();
    list.sort(function (a, b) { return Number(a) - Number(b); });
    return list;
};

MergeOrderLogic._getUnlockedSeries = MergeOrderLogic._getUnlockedLineTypes;

MergeOrderLogic._calculateLineScores = function (requiredPieces, configProvider) {
    var scores = {};
    var coinValue = 0;
    for (var pieceId in requiredPieces) {
        var count = requiredPieces[pieceId] || 0;
        var meta = MergeOrderLogic._getElementMeta(pieceId, configProvider) || {};
        var lineType = meta.type != null && meta.type !== '' ? String(meta.type) : '0';
        var score = Math.max(0, MergeOrderLogic._toNumber(meta.orderScore, 0)) * count;
        var gold = Math.max(0, MergeOrderLogic._toNumber(meta.goldPrice, 0)) * count;
        scores[lineType] = (scores[lineType] || 0) + score;
        coinValue += gold;
    }
    return {
        lineScores: scores,
        coinValue: Math.max(0, Math.floor(coinValue))
    };
};

MergeOrderLogic._getPressureByLineType = function (orderState, configProvider) {
    var pressure = {};
    var addScores = function (scores) {
        if (!scores) return;
        for (var lineType in scores) {
            pressure[String(lineType)] = (pressure[String(lineType)] || 0) + (Number(scores[lineType]) || 0);
        }
    };
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order || order.claimed) continue;
        if (!order.lineScores) {
            var calc = MergeOrderLogic._calculateLineScores(order.requiredPieces || {}, configProvider);
            order.lineScores = calc.lineScores;
            if (order.coinValue == null) order.coinValue = calc.coinValue;
        }
        addScores(order.lineScores);
    }
    if (orderState.lastCompletedOrder) {
        addScores(orderState.lastCompletedOrder.lineScores || orderState.lastCompletedOrder.seriesScores);
    }
    return pressure;
};

MergeOrderLogic._getPressureBySeries = MergeOrderLogic._getPressureByLineType;

MergeOrderLogic._sortLineTypesByPressure = function (lineTypes, pressure) {
    return lineTypes.slice().sort(function (a, b) {
        var diff = (Number(pressure[String(a)]) || 0) - (Number(pressure[String(b)]) || 0);
        if (diff !== 0) return diff;
        return Number(a) - Number(b);
    });
};

MergeOrderLogic._choosePieceForLevel = function (elements, lineType, level, usedIds, configProvider, rng) {
    var candidates = [];
    for (var i = 0; i < elements.length; i++) {
        var meta = elements[i];
        if (!meta || meta.id == null) continue;
        if (MergeOrderLogic._isGeneratorPiece(meta.id, configProvider)) continue;
        if (lineType != null && String(meta.type) !== String(lineType)) continue;
        if (usedIds[String(meta.id)]) continue;
        var metaLevel = MergeOrderLogic._getOrderPieceLevel(meta);
        if (metaLevel === level) candidates.push(meta);
    }
    if (candidates.length <= 0) return null;
    return candidates[MergeOrderLogic.seededRandomInt(rng, 0, candidates.length - 1)] || null;
};

MergeOrderLogic._choosePiecesForPlan = function (levels, lineTypes, orderState, elements, configProvider, rng) {
    var required = {};
    var used = {};
    var pressure = MergeOrderLogic._getPressureByLineType(orderState, configProvider);
    for (var i = 0; i < levels.length && i < MergeOrderLogic.MAX_ORDER_ITEM_COUNT; i++) {
        var allowDuplicateForSameLevel = false;
        for (var j = 0; j < i; j++) {
            if (levels[j] === levels[i]) {
                allowDuplicateForSameLevel = true;
                break;
            }
        }
        var usedForPick = allowDuplicateForSameLevel ? {} : used;
        var pieceMeta = null;
        var pickedLineType = null;
        var sortedLineTypes = MergeOrderLogic._sortLineTypesByPressure(lineTypes, pressure);
        for (var lineIndex = 0; lineIndex < sortedLineTypes.length; lineIndex++) {
            var candidate = MergeOrderLogic._choosePieceForLevel(
                elements, sortedLineTypes[lineIndex], levels[i], usedForPick, configProvider, rng
            );
            if (candidate) {
                pieceMeta = candidate;
                pickedLineType = sortedLineTypes[lineIndex];
                break;
            }
        }
        if (!pieceMeta) return {};
        var pieceId = pieceMeta.id;
        used[String(pieceId)] = true;
        required[pieceId] = (required[pieceId] || 0) + 1;
        var score = Math.max(0, MergeOrderLogic._toNumber(pieceMeta.orderScore, 0));
        pressure[String(pickedLineType)] = (pressure[String(pickedLineType)] || 0) + score;
    }
    return required;
};

MergeOrderLogic._choosePiecesFromPlanCandidates = function (planCandidates, lineTypes, orderState, elements, configProvider, rng) {
    if (!Array.isArray(planCandidates) || planCandidates.length <= 0) return null;
    for (var i = 0; i < planCandidates.length; i++) {
        var levels = planCandidates[i];
        if (!Array.isArray(levels) || levels.length <= 0) continue;
        var requiredPieces = MergeOrderLogic._choosePiecesForPlan(
            levels, lineTypes, orderState, elements, configProvider, rng
        );
        if (Object.keys(requiredPieces).length > 0) {
            return {
                levels: levels.slice(0, MergeOrderLogic.MAX_ORDER_ITEM_COUNT),
                requiredPieces: requiredPieces
            };
        }
    }
    return null;
};

MergeOrderLogic._createBaseOrder = function (params) {
    var requiredPieces = params.requiredPieces || {};
    var matchedCells = {};
    var orderType = params.orderType || MergeOrderLogic.ORDER_TYPE_NORMAL;
    var usesSlotCharge = params.usesSlotCharge != null
        ? params.usesSlotCharge === true
        : orderType !== MergeOrderLogic.ORDER_TYPE_NEWBIE;
    for (var pieceId in requiredPieces) matchedCells[pieceId] = [];
    var order: any = {
        orderId: params.orderId,
        slotId: params.slotId,
        slotIndex: params.slotIndex || 0,
        slotType: params.slotType || 1,
        slotCdTime: params.slotCdTime || 0,
        requiredPieces: requiredPieces,
        matchedCells: matchedCells,
        completed: false,
        claimed: false,
        rewards: params.rewards || [],
        activityRewards: params.activityRewards || [],
        additionRewards: params.additionRewards || [],
        collectRewards: params.collectRewards || [],
        roleName: params.roleName || MergeOrderLogic.DEFAULT_ROLE_NAME,
        mode: params.mode || MergeOrderLogic.ORDER_MODE_NORMAL,
        orderType: orderType,
        usesSlotCharge: usesSlotCharge,
        coinValue: params.coinValue || 0,
        lineScores: params.lineScores || params.seriesScores || {},
        difficulty: params.difficulty || 0,
        itemLevels: params.itemLevels || [],
        createdAt: params.createdAt || 0
    };
    if (params.generatorEligibilityVersion != null) {
        order.generatorEligibilityVersion = MergeOrderLogic._toInt(params.generatorEligibilityVersion, 0);
    }
    return order;
};

MergeOrderLogic._createNewbieOrderFromMeta = function (meta, slot, slotIndex, orderState, configProvider) {
    var requiredPieces = MergeOrderLogic.parseRequiredPieces(meta.content);
    var calc = MergeOrderLogic._calculateLineScores(requiredPieces, configProvider);
    MergeOrderLogic._advanceNewbiePointer(orderState, meta, configProvider);
    return MergeOrderLogic._createBaseOrder({
        orderId: meta.id,
        slotId: slot.id,
        slotIndex: slotIndex,
        slotType: slot.slotType,
        slotCdTime: slot.cdTime || 0,
        requiredPieces: requiredPieces,
        rewards: MergeOrderLogic._buildCoinReward(calc.coinValue),
        activityRewards: [],
        additionRewards: [],
        roleName: meta.roleName || MergeOrderLogic.DEFAULT_ROLE_NAME,
        mode: MergeOrderLogic.ORDER_MODE_NEWBIE,
        orderType: MergeOrderLogic.ORDER_TYPE_NEWBIE,
        level: MergeOrderLogic._getNewbieMetaLevel(meta),
        coinValue: calc.coinValue,
        lineScores: calc.lineScores,
        createdAt: MergeOrderLogic._getCurrentTime(configProvider)
    });
};

MergeOrderLogic._buildCoinReward = function (coinValue) {
    coinValue = Math.max(0, Math.floor(Number(coinValue) || 0));
    return coinValue > 0 ? [{ type: MergeOrderLogic.CONTENT_TYPES.COIN, cid: 0, count: coinValue }] : [];
};

MergeOrderLogic._normalizeRewardList = function (value) {
    if (value == null || value === '') return [];
    if (typeof value === 'string') return MergeOrderLogic.parseRewardString(value);
    if (Array.isArray(value)) {
        var list = [];
        for (var i = 0; i < value.length; i++) {
            list = list.concat(MergeOrderLogic._normalizeRewardList(value[i]));
        }
        return list;
    }
    if (typeof value !== 'object') return [];
    if (value.rewards != null && value.type == null && value.cid == null && value.count == null) {
        return MergeOrderLogic._normalizeRewardList(value.rewards);
    }
    if (value.reward != null && value.type == null && value.cid == null && value.count == null) {
        return MergeOrderLogic._normalizeRewardList(value.reward);
    }
    var type = value.type;
    var cid = value.cid != null ? value.cid : (value.contentId != null ? value.contentId : value.id);
    var count = value.count != null ? value.count : value.num;
    try { if (type == null && value.Type) type = value.Type(); } catch (e) { }
    try { if (type == null && value.ContentType) type = value.ContentType(); } catch (e) { }
    try { if (cid == null && value.ContentId) cid = value.ContentId(); } catch (e2) { }
    try { if (cid == null && value.Id) cid = value.Id(); } catch (e3) { }
    try { if (count == null && value.Count) count = value.Count(); } catch (e4) { }
    try { if (count == null && value.ContentCount) count = value.ContentCount(); } catch (e5) { }
    type = MergeOrderLogic._toInt(type, NaN);
    cid = MergeOrderLogic._toInt(cid, NaN);
    count = MergeOrderLogic._toNumber(count, NaN);
    if (isNaN(type) || isNaN(cid) || !isFinite(count) || count <= 0) return [];
    return [{ type: type, cid: cid, count: count }];
};

MergeOrderLogic._normalizeOrderRewardFields = function (order, configProvider) {
    if (!order || order.claimed) return order;
    if (!order.requiredPieces || typeof order.requiredPieces !== 'object') {
        order.requiredPieces = MergeOrderLogic.parseRequiredPieces(order.content);
    }
    order.activityRewards = MergeOrderLogic._normalizeRewardList(order.activityRewards);
    order.additionRewards = MergeOrderLogic._normalizeRewardList(order.additionRewards);
    if (!Array.isArray(order.collectRewards)) order.collectRewards = [];

    var calc = MergeOrderLogic._calculateLineScores(order.requiredPieces, configProvider);
    order.lineScores = calc.lineScores;
    delete order.seriesScores;
    order.coinValue = calc.coinValue;
    order.rewards = MergeOrderLogic._buildCoinReward(calc.coinValue);
    return order;
};

MergeOrderLogic._getRandomRoleName = function (configProvider, rng) {
    if (configProvider && typeof configProvider.getRandomOrderRoleName === 'function') {
        var name = configProvider.getRandomOrderRoleName(rng);
        if (name) return name;
    }
    return MergeOrderLogic.DEFAULT_ROLE_NAME;
};

MergeOrderLogic._createRandomOrderForSlot = function (orderState, slot, slotIndex, playerLevel, configProvider, lineTypes) {
    var levelConfig = MergeOrderLogic._getOrderLevelConfig(playerLevel, configProvider);
    if (!levelConfig) return null;
    var elements = MergeOrderLogic._getAllElementMetas(configProvider);
    if (elements.length <= 0) return null;

    var rng = MergeOrderLogic.seededRandom(orderState.orderSeed);
    var difficulty = MergeOrderLogic._peekDifficulty(orderState, levelConfig);
    var itemCount = MergeOrderLogic._rollItemCount(levelConfig, rng);
    var planCandidates = MergeOrderLogic._getPlanLevelCandidates(levelConfig, difficulty, itemCount, rng);
    if (!Array.isArray(lineTypes)) {
        lineTypes = MergeOrderLogic._getUnlockedLineTypes(playerLevel, configProvider);
    }
    if (lineTypes.length <= 0) return null;
    var pickedPlan = MergeOrderLogic._choosePiecesFromPlanCandidates(
        planCandidates, lineTypes, orderState, elements, configProvider, rng
    );
    if (!pickedPlan) return null;
    var levels = pickedPlan.levels;
    var requiredPieces = pickedPlan.requiredPieces;

    var calc = MergeOrderLogic._calculateLineScores(requiredPieces, configProvider);
    var orderId = orderState.nextRandomOrderId++;
    MergeOrderLogic._advanceDifficulty(orderState);
    orderState.orderSeed = MergeOrderLogic._nextSeed(rng);
    orderState.lastCompletedOrder = null;
    return MergeOrderLogic._createBaseOrder({
        orderId: orderId,
        slotId: slot.id,
        slotIndex: slotIndex,
        slotType: slot.slotType,
        slotCdTime: slot.cdTime || 0,
        requiredPieces: requiredPieces,
        rewards: MergeOrderLogic._buildCoinReward(calc.coinValue),
        roleName: MergeOrderLogic._getRandomRoleName(configProvider, rng),
        mode: MergeOrderLogic.ORDER_MODE_NORMAL,
        orderType: MergeOrderLogic.ORDER_TYPE_NORMAL,
        coinValue: calc.coinValue,
        lineScores: calc.lineScores,
        difficulty: difficulty,
        itemLevels: levels,
        generatorEligibilityVersion: MergeOrderLogic.GENERATOR_ELIGIBILITY_VERSION,
        createdAt: MergeOrderLogic._getCurrentTime(configProvider)
    });
};

MergeOrderLogic._parsePieceData = function (dataStr) {
    if (!dataStr || typeof dataStr !== 'string') return null;
    if (MergeOrderLogic.isBubblePieceData(dataStr)) return null;
    var base = dataStr.split('=')[0];
    var parts = base.split('_');
    var pieceId = MergeOrderLogic._toInt(parts[0], NaN);
    var status = MergeOrderLogic._toInt(parts[1], -1);
    if (isNaN(pieceId) || status !== -1) return null;
    return { pieceId: pieceId };
};

MergeOrderLogic._buildPieceIndex = function (boardData, warehouseData) {
    var index = {};
    var flat = [];
    var add = function (pieceId, cellKey, fromWarehouse) {
        if (!index[pieceId]) index[pieceId] = [];
        index[pieceId].push(cellKey);
        flat.push({ pieceId: pieceId, cellKey: cellKey, fromWarehouse: !!fromWarehouse });
    };
    if (boardData) {
        for (var cellKey in boardData) {
            var parsed = MergeOrderLogic._parsePieceData(boardData[cellKey]);
            if (parsed) add(parsed.pieceId, cellKey, false);
        }
    }
    if (warehouseData) {
        for (var warehouseKey in warehouseData) {
            var wParsed = MergeOrderLogic._parsePieceData(warehouseData[warehouseKey]);
            if (wParsed) add(wParsed.pieceId, 'warehouse_' + warehouseKey, true);
        }
    }
    return { index: index, flat: flat };
};

MergeOrderLogic._hasActiveRecycleOrder = function (orderState) {
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (order && !order.claimed && order.orderType === MergeOrderLogic.ORDER_TYPE_RECYCLE) return true;
    }
    return false;
};

MergeOrderLogic._createRecycleOrderForSlot = function (orderState, slot, slotIndex, playerLevel, configProvider, boardData, warehouseData) {
    if (!boardData && !warehouseData) return null;
    if (MergeOrderLogic._hasActiveRecycleOrder(orderState)) return null;
    var levelConfig = MergeOrderLogic._getOrderLevelConfig(playerLevel, configProvider);
    var threshold = MergeOrderLogic._toInt(levelConfig ? levelConfig.hard4ChestLv : 0, 0);
    if (threshold <= 0) return null;
    var pieceIndex = MergeOrderLogic._buildPieceIndex(boardData, warehouseData);
    var candidates = [];
    var seenIds = {};
    for (var i = 0; i < pieceIndex.flat.length; i++) {
        var item = pieceIndex.flat[i];
        if (seenIds[String(item.pieceId)]) continue;
        var meta = MergeOrderLogic._getElementMeta(item.pieceId, configProvider) || {};
        var level = MergeOrderLogic._getOrderPieceLevel(meta);
        if (level <= threshold) continue;
        seenIds[String(item.pieceId)] = true;
        candidates.push({
            pieceId: item.pieceId,
            level: level,
            score: MergeOrderLogic._toNumber(meta.orderScore, 0),
            gold: MergeOrderLogic._toNumber(meta.goldPrice, 0)
        });
    }
    if (candidates.length <= 0) return null;
    candidates.sort(function (a, b) {
        if (b.level !== a.level) return b.level - a.level;
        if (b.score !== a.score) return b.score - a.score;
        return a.pieceId - b.pieceId;
    });
    candidates = candidates.slice(0, MergeOrderLogic.MAX_ORDER_ITEM_COUNT);
    var requiredPieces = {};
    for (var c = 0; c < candidates.length; c++) requiredPieces[candidates[c].pieceId] = 1;
    var calc = MergeOrderLogic._calculateLineScores(requiredPieces, configProvider);
    var orderId = orderState.nextRecycleOrderId++;
    return MergeOrderLogic._createBaseOrder({
        orderId: orderId,
        slotId: slot.id,
        slotIndex: slotIndex,
        slotType: slot.slotType,
        slotCdTime: slot.cdTime || 0,
        requiredPieces: requiredPieces,
        rewards: MergeOrderLogic._buildCoinReward(calc.coinValue),
        roleName: MergeOrderLogic.DEFAULT_ROLE_NAME,
        mode: MergeOrderLogic.ORDER_MODE_NORMAL,
        orderType: MergeOrderLogic.ORDER_TYPE_RECYCLE,
        coinValue: calc.coinValue,
        lineScores: calc.lineScores,
        difficulty: 4,
        createdAt: MergeOrderLogic._getCurrentTime(configProvider)
    });
};

MergeOrderLogic._getActiveOrderCount = function (orderState) {
    var count = 0;
    for (var i = 0; i < orderState.orders.length; i++) {
        if (orderState.orders[i] && !orderState.orders[i].claimed) count++;
    }
    return count;
};

MergeOrderLogic._cleanOrders = function (orderState) {
    var clean = [];
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (order && !order.claimed) clean.push(order);
    }
    orderState.orders = clean;
};

MergeOrderLogic._isRandomOrderEligibleForLineTypes = function (order, lineTypes, configProvider) {
    if (!order || order.orderType !== MergeOrderLogic.ORDER_TYPE_NORMAL) return true;
    var allowed = {};
    lineTypes = Array.isArray(lineTypes) ? lineTypes : [];
    for (var i = 0; i < lineTypes.length; i++) allowed[String(lineTypes[i])] = true;
    var required = order.requiredPieces || {};
    var hasRequiredPiece = false;
    for (var pieceId in required) {
        if (MergeOrderLogic._toInt(required[pieceId], 0) <= 0) continue;
        hasRequiredPiece = true;
        var meta = MergeOrderLogic._getElementMeta(pieceId, configProvider);
        if (!meta || MergeOrderLogic._getOrderPieceLevel(meta) <= 0) return false;
        if (MergeOrderLogic._isGeneratorPiece(pieceId, configProvider)) return false;
        if (!allowed[String(meta.type)]) return false;
    }
    return hasRequiredPiece;
};

MergeOrderLogic._rerollLegacyRandomOrder = function (orderState, order, playerLevel, configProvider, lineTypes) {
    var levelConfig = MergeOrderLogic._getOrderLevelConfig(playerLevel, configProvider);
    if (!levelConfig || !Array.isArray(lineTypes) || lineTypes.length <= 0) return false;
    var elements = MergeOrderLogic._getAllElementMetas(configProvider);
    if (elements.length <= 0) return false;

    var rng = MergeOrderLogic.seededRandom(orderState.orderSeed);
    var difficulty = MergeOrderLogic._toInt(order.difficulty, 0);
    if (difficulty <= 0) difficulty = MergeOrderLogic._peekDifficulty(orderState, levelConfig);
    var levels = [];
    var hadSavedLevels = false;
    if (Array.isArray(order.itemLevels)) {
        for (var i = 0; i < order.itemLevels.length && levels.length < MergeOrderLogic.MAX_ORDER_ITEM_COUNT; i++) {
            var itemLevel = MergeOrderLogic._toInt(order.itemLevels[i], 0);
            if (itemLevel > 0) levels.push(itemLevel);
        }
        hadSavedLevels = levels.length > 0;
    }
    var planCandidates = [];
    if (levels.length <= 0) {
        var itemCount = MergeOrderLogic._rollItemCount(levelConfig, rng);
        planCandidates = MergeOrderLogic._getPlanLevelCandidates(levelConfig, difficulty, itemCount, rng);
    } else {
        planCandidates = [levels];
    }
    var pickedPlan = MergeOrderLogic._choosePiecesFromPlanCandidates(
        planCandidates, lineTypes, orderState, elements, configProvider, rng
    );
    if (!pickedPlan && hadSavedLevels) {
        planCandidates = MergeOrderLogic._getPlanLevelCandidates(levelConfig, difficulty, levels.length, rng);
        pickedPlan = MergeOrderLogic._choosePiecesFromPlanCandidates(
            planCandidates, lineTypes, orderState, elements, configProvider, rng
        );
    }
    if (!pickedPlan) return false;
    levels = pickedPlan.levels;
    var requiredPieces = pickedPlan.requiredPieces;

    var calc = MergeOrderLogic._calculateLineScores(requiredPieces, configProvider);
    var matchedCells = {};
    for (var pieceId in requiredPieces) matchedCells[pieceId] = [];
    order.requiredPieces = requiredPieces;
    order.matchedCells = matchedCells;
    order.completed = false;
    order.claimed = false;
    order.matchedCount = 0;
    order.requiredCount = 0;
    order.progressStatus = 'none';
    order.coinValue = calc.coinValue;
    order.lineScores = calc.lineScores;
    delete order.seriesScores;
    order.rewards = MergeOrderLogic._buildCoinReward(calc.coinValue);
    order.difficulty = difficulty;
    order.itemLevels = levels;
    order.generatorEligibilityVersion = MergeOrderLogic.GENERATOR_ELIGIBILITY_VERSION;
    orderState.orderSeed = MergeOrderLogic._nextSeed(rng);
    return true;
};

MergeOrderLogic._migrateLegacyRandomOrders = function (orderState, playerLevel, configProvider, lineTypes) {
    if (configProvider && typeof configProvider.isGeneratorEligibilityReady === 'function' &&
        !configProvider.isGeneratorEligibilityReady()) return;
    var index = 0;
    while (index < orderState.orders.length) {
        var order = orderState.orders[index];
        if (!order || order.claimed || order.orderType !== MergeOrderLogic.ORDER_TYPE_NORMAL ||
            MergeOrderLogic._toInt(order.generatorEligibilityVersion, 0) >= MergeOrderLogic.GENERATOR_ELIGIBILITY_VERSION) {
            index++;
            continue;
        }
        if (MergeOrderLogic._isRandomOrderEligibleForLineTypes(order, lineTypes, configProvider)) {
            order.generatorEligibilityVersion = MergeOrderLogic.GENERATOR_ELIGIBILITY_VERSION;
            index++;
            continue;
        }

        orderState.orders.splice(index, 1);
        if (MergeOrderLogic._rerollLegacyRandomOrder(orderState, order, playerLevel, configProvider, lineTypes)) {
            orderState.orders.splice(index, 0, order);
            index++;
        }
    }
};

MergeOrderLogic._trimOrdersToLimit = function (orderState, limit) {
    limit = Math.max(0, MergeOrderLogic._toInt(limit, 0));
    if (!orderState || !Array.isArray(orderState.orders) || orderState.orders.length <= limit) return;
    orderState.orders = orderState.orders.slice(0, limit);
};

MergeOrderLogic.syncOrdersForPlayerLevel = function (orderState, playerLevel, configProvider, seedKey, boardData, warehouseData) {
    orderState = MergeOrderLogic._ensureOrderState(orderState, seedKey);
    var level = MergeOrderLogic._toInt(playerLevel, 1);
    var slots = MergeOrderLogic._getUnlockedSlots(level, configProvider);
    var now = MergeOrderLogic._getCurrentTime(configProvider);
    var levelConfig = MergeOrderLogic._getOrderLevelConfig(level, configProvider);
    var orderMax = MergeOrderLogic._getOrderMax(levelConfig, slots);
    var addedOrders = [];
    var levelOrderAllComplete = false;
    var generatorEligibilityReady = !(configProvider &&
        typeof configProvider.isGeneratorEligibilityReady === 'function') ||
        configProvider.isGeneratorEligibilityReady();
    var unlockedLineTypes = generatorEligibilityReady
        ? MergeOrderLogic._getUnlockedLineTypes(level, configProvider, boardData || {}, warehouseData || {})
        : [];

    orderState.playerLevel = level;
    MergeOrderLogic._cleanOrders(orderState);
    for (var orderIndex = 0; orderIndex < orderState.orders.length; orderIndex++) {
        MergeOrderLogic._normalizeOrderRewardFields(orderState.orders[orderIndex], configProvider);
    }
    var activeSlots = slots.slice(0, orderMax);
    MergeOrderLogic._normalizeExistingSlots(orderState, slots, orderMax, now);
    MergeOrderLogic._trimOrdersToLimit(orderState, orderMax);
    if (generatorEligibilityReady) {
        MergeOrderLogic._migrateLegacyRandomOrders(orderState, level, configProvider, unlockedLineTypes);
    }
    var slotTypeConfigs = MergeOrderLogic._ensureSlotTypeStates(orderState, activeSlots, now);

    var slotIndex;
    for (slotIndex = 0; slotIndex < activeSlots.length && MergeOrderLogic._getActiveOrderCount(orderState) < orderMax; slotIndex++) {
        var slot = activeSlots[slotIndex];
        if (MergeOrderLogic._findOrderBySlotId(orderState, slot.id)) continue;
        var pendingMeta = MergeOrderLogic._findNextPendingNewbieMeta(orderState, configProvider);
        if (!pendingMeta || MergeOrderLogic._getNewbieMetaLevel(pendingMeta) > level) break;
        var meta = pendingMeta;
        var newbieOrder = MergeOrderLogic._createNewbieOrderFromMeta(meta, slot, slotIndex, orderState, configProvider);
        if (!newbieOrder) continue;
        orderState.orders.push(newbieOrder);
        addedOrders.push(newbieOrder);
    }

    var nextPendingNewbie = MergeOrderLogic._findNextPendingNewbieMeta(orderState, configProvider);
    var nextNewbieLocked = !!nextPendingNewbie && MergeOrderLogic._getNewbieMetaLevel(nextPendingNewbie) > level;
    orderState.waitingForLevelUpgrade = nextNewbieLocked &&
        MergeOrderLogic._isPlayerLevelNewbieComplete(orderState, level, configProvider);
    if (orderState.waitingForLevelUpgrade) {
        levelOrderAllComplete = MergeOrderLogic._markLevelOrderAllComplete(orderState, level);
    }
    if (!nextPendingNewbie) {
        orderState.mode = MergeOrderLogic.ORDER_MODE_NORMAL;
        for (slotIndex = 0; generatorEligibilityReady && slotIndex < activeSlots.length &&
            MergeOrderLogic._getActiveOrderCount(orderState) < orderMax; slotIndex++) {
            var recycleSlot = activeSlots[slotIndex];
            if (MergeOrderLogic._findOrderBySlotId(orderState, recycleSlot.id)) continue;
            if (!MergeOrderLogic._hasSlotCharge(orderState, recycleSlot)) continue;
            var recycleOrder = MergeOrderLogic._createRecycleOrderForSlot(
                orderState, recycleSlot, slotIndex, level, configProvider, boardData, warehouseData
            );
            if (!recycleOrder) continue;
            if (!MergeOrderLogic._consumeSlotCharge(orderState, recycleSlot, slotTypeConfigs, now)) continue;
            orderState.orders.push(recycleOrder);
            addedOrders.push(recycleOrder);
            break;
        }
        for (slotIndex = 0; slotIndex < activeSlots.length && MergeOrderLogic._getActiveOrderCount(orderState) < orderMax; slotIndex++) {
            var normalSlot = activeSlots[slotIndex];
            if (MergeOrderLogic._findOrderBySlotId(orderState, normalSlot.id)) continue;
            if (!MergeOrderLogic._hasSlotCharge(orderState, normalSlot)) continue;
            var normalOrder = MergeOrderLogic._createRandomOrderForSlot(
                orderState, normalSlot, slotIndex, level, configProvider, unlockedLineTypes
            );
            if (!normalOrder) continue;
            if (!MergeOrderLogic._consumeSlotCharge(orderState, normalSlot, slotTypeConfigs, now)) continue;
            orderState.orders.push(normalOrder);
            addedOrders.push(normalOrder);
        }
        if (generatorEligibilityReady && MergeOrderLogic._getActiveOrderCount(orderState) <= 0) {
            var forceSlot = MergeOrderLogic._findNearestCoolingEmptySlot(orderState, activeSlots);
            if (forceSlot) {
                var forcedOrder = MergeOrderLogic._createRandomOrderForSlot(
                    orderState, forceSlot, activeSlots.indexOf(forceSlot), level, configProvider, unlockedLineTypes
                );
                if (forcedOrder &&
                    MergeOrderLogic._forceRecoverSlotCharge(orderState, forceSlot, now) &&
                    MergeOrderLogic._consumeSlotCharge(orderState, forceSlot, slotTypeConfigs, now)) {
                    orderState.orders.push(forcedOrder);
                    addedOrders.push(forcedOrder);
                }
            }
        }
    } else {
        orderState.mode = MergeOrderLogic.ORDER_MODE_NEWBIE;
    }

    if (boardData || warehouseData) {
        MergeOrderLogic.checkAllOrderProgress(boardData || {}, warehouseData || {}, orderState);
    } else {
        MergeOrderLogic.sortOrdersForDisplay(orderState);
    }
    return {
        orderState: orderState,
        addedOrders: addedOrders,
        mode: orderState.mode,
        waitingForLevelUpgrade: orderState.waitingForLevelUpgrade,
        levelOrderAllComplete: levelOrderAllComplete,
        levelOrderAllCompleteLevel: level,
        nextChargeAt: MergeOrderLogic.getNextOrderChargeAt(orderState, level, configProvider)
    };
};

MergeOrderLogic.generateSingleOrder = function (orderState, slotIndex, configProvider) {
    orderState = MergeOrderLogic._ensureOrderState(orderState);
    var slot = { id: slotIndex + 1, slotType: 1, cdTime: 0 };
    return MergeOrderLogic._createRandomOrderForSlot(
        orderState,
        slot,
        slotIndex,
        orderState.playerLevel || 1,
        configProvider
    );
};

MergeOrderLogic.generateOrders = function (orderState, count, configProvider) {
    orderState = MergeOrderLogic._ensureOrderState(orderState);
    var added = [];
    for (var i = 0; i < count; i++) {
        var order = MergeOrderLogic.generateSingleOrder(orderState, i, configProvider);
        if (!order) break;
        orderState.orders.push(order);
        added.push(order);
    }
    MergeOrderLogic.sortOrdersForDisplay(orderState);
    return added;
};

MergeOrderLogic.isBubblePieceData = function (pieceData) {
    if (!pieceData || typeof pieceData !== 'string' || pieceData.indexOf('=') === -1) return false;
    var instanceId = pieceData.split('=')[1];
    return typeof instanceId === 'string' && instanceId.indexOf('b_') === 0;
};

MergeOrderLogic._getOrderProgressRank = function (order) {
    if (!order) return 3;
    if (order.completed) return 0;
    if ((order.matchedCount || 0) > 0) return 1;
    return 2;
};

MergeOrderLogic.sortOrdersForDisplay = function (orderState) {
    if (!orderState || !Array.isArray(orderState.orders)) return;
    orderState.orders.sort(function (a, b) {
        var ar = MergeOrderLogic._getOrderProgressRank(a);
        var br = MergeOrderLogic._getOrderProgressRank(b);
        if (ar !== br) return ar - br;
        var av = Number(a.coinValue) || 0;
        var bv = Number(b.coinValue) || 0;
        if (av !== bv) return bv - av;
        var as = Number(a.slotId != null ? a.slotId : a.slotIndex) || 0;
        var bs = Number(b.slotId != null ? b.slotId : b.slotIndex) || 0;
        if (as !== bs) return as - bs;
        return (Number(a.orderId) || 0) - (Number(b.orderId) || 0);
    });
    for (var i = 0; i < orderState.orders.length; i++) {
        orderState.orders[i].slotIndex = i;
    }
};

MergeOrderLogic.checkAllOrderProgress = function (boardData, warehouseData, orderState) {
    if (!orderState || !Array.isArray(orderState.orders)) return;
    var pieceIndex = MergeOrderLogic._buildPieceIndex(boardData, warehouseData).index;
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order || order.claimed) continue;
        var required = order.requiredPieces || {};
        var matchedCount = 0;
        var requiredCount = 0;
        var allMatched = true;
        order.matchedCells = {};
        for (var pieceId in required) {
            var need = Math.max(0, MergeOrderLogic._toInt(required[pieceId], 0));
            requiredCount += need;
            var available = pieceIndex[pieceId] || [];
            var matched = available.slice(0, need);
            order.matchedCells[pieceId] = matched;
            matchedCount += matched.length;
            if (matched.length < need) allMatched = false;
        }
        order.requiredCount = requiredCount;
        order.matchedCount = matchedCount;
        order.completed = requiredCount > 0 && allMatched;
        order.progressStatus = order.completed ? 'complete' : (matchedCount > 0 ? 'partial' : 'none');
    }
    MergeOrderLogic.sortOrdersForDisplay(orderState);
};

MergeOrderLogic.compactWarehouse = function (warehouseData) {
    if (!warehouseData || typeof warehouseData !== 'object') return {};
    var items = [];
    for (var index in warehouseData) {
        if (warehouseData[index]) items.push(warehouseData[index]);
    }
    for (var key in warehouseData) delete warehouseData[key];
    for (var i = 0; i < items.length; i++) warehouseData[i] = items[i];
    return warehouseData;
};

MergeOrderLogic.removePiecesForOrder = function (order, boardData, warehouseData) {
    var removedPieces = [];
    if (!order || !order.matchedCells) return removedPieces;
    for (var pieceId in order.matchedCells) {
        var cells = order.matchedCells[pieceId] || [];
        var need = Math.max(0, MergeOrderLogic._toInt((order.requiredPieces || {})[pieceId], 0));
        var removed = 0;
        for (var i = 0; i < cells.length && removed < need; i++) {
            var cellKey = cells[i];
            if (cellKey.indexOf('warehouse_') === 0) {
                var warehouseIndex = cellKey.replace('warehouse_', '');
                if (warehouseData && warehouseData[warehouseIndex]) {
                    delete warehouseData[warehouseIndex];
                    removed++;
                    removedPieces.push(cellKey);
                }
            } else if (boardData && boardData[cellKey] && !MergeOrderLogic.isBubblePieceData(boardData[cellKey])) {
                boardData[cellKey] = null;
                removed++;
                removedPieces.push(cellKey);
            }
        }
    }
    return removedPieces;
};

MergeOrderLogic.calculateActivityRewards = function (orderMeta, activeActivities, rng) {
    if (!activeActivities || activeActivities.length === 0 || !orderMeta) return [];
    var maxItemReward = Math.max(1, MergeOrderLogic._toInt(orderMeta.maxItemReward, 1));
    var result = [];
    for (var i = 0; i < activeActivities.length && result.length < 2; i++) {
        var activity = activeActivities[i];
        if (!activity || !activity.bonusList || activity.bonusList.length <= 0) continue;
        var bonus = activity.bonusList.length === 1
            ? activity.bonusList[0]
            : activity.bonusList[MergeOrderLogic.seededRandomInt(rng, 0, activity.bonusList.length - 1)];
        if (!bonus) continue;
        var reward = {
            type: bonus.type,
            cid: bonus.cid,
            count: bonus.count,
            activityId: activity.id
        };
        if (reward.type === MergeOrderLogic.CONTENT_TYPES.ACTIVITY_ITEM ||
            reward.type === MergeOrderLogic.CONTENT_TYPES.JIGSAW) {
            reward.count = MergeOrderLogic.seededRandomInt(rng, 1, maxItemReward);
        }
        result.push(reward);
    }
    return result;
};

MergeOrderLogic._findOrderByDisplaySlot = function (orderState, slotIndex) {
    for (var i = 0; i < orderState.orders.length; i++) {
        if (Number(orderState.orders[i].slotIndex) === Number(slotIndex)) {
            return { order: orderState.orders[i], index: i };
        }
    }
    return { order: null, index: -1 };
};

MergeOrderLogic._findOrderByClaimTarget = function (orderState, claimTarget) {
    var orderId = null;
    var slotIndex = claimTarget;
    if (claimTarget && typeof claimTarget === 'object') {
        orderId = claimTarget.orderId;
        slotIndex = claimTarget.slotIndex;
    }
    if (orderId !== undefined && orderId !== null && orderId !== '') {
        for (var i = 0; i < orderState.orders.length; i++) {
            if (String(orderState.orders[i].orderId) === String(orderId)) {
                return { order: orderState.orders[i], index: i };
            }
        }
    }
    return MergeOrderLogic._findOrderByDisplaySlot(orderState, slotIndex);
};

MergeOrderLogic.claimOrder = function (orderState, slotIndex, boardData, warehouseData, configProvider, playerLevel) {
    var result: any = {
        success: false,
        errorCode: '',
        errorMsg: '',
        sideEffects: [],
        newOrder: null,
        removedPieces: []
    };
    orderState = MergeOrderLogic._ensureOrderState(orderState);
    var level = MergeOrderLogic._toInt(playerLevel, orderState.playerLevel || 1);
    var claimSlots = MergeOrderLogic._getUnlockedSlots(level, configProvider);
    var claimLevelConfig = MergeOrderLogic._getOrderLevelConfig(level, configProvider);
    var claimOrderMax = MergeOrderLogic._getOrderMax(claimLevelConfig, claimSlots);
    MergeOrderLogic._ensureSlotTypeStates(
        orderState,
        claimSlots.slice(0, claimOrderMax),
        MergeOrderLogic._getCurrentTime(configProvider)
    );
    for (var orderIndex = 0; orderIndex < orderState.orders.length; orderIndex++) {
        MergeOrderLogic._normalizeOrderRewardFields(orderState.orders[orderIndex], configProvider);
    }
    MergeOrderLogic.checkAllOrderProgress(boardData || {}, warehouseData || {}, orderState);

    var found = MergeOrderLogic._findOrderByClaimTarget(orderState, slotIndex);
    var order = found.order;
    if (!order) {
        result.errorCode = 'ORDER_NOT_FOUND';
        result.errorMsg = 'order not found';
        return result;
    }
    if (!order.completed) {
        result.errorCode = 'ORDER_NOT_COMPLETED';
        result.errorMsg = 'order not completed';
        return result;
    }
    if (order.claimed) {
        result.errorCode = 'ORDER_ALREADY_CLAIMED';
        result.errorMsg = 'order already claimed';
        return result;
    }

    var removedPieces = MergeOrderLogic.removePiecesForOrder(order, boardData || {}, warehouseData || {});
    MergeOrderLogic.compactWarehouse(warehouseData || {});
    result.removedPieces = removedPieces;

    var baseRewards = (order.rewards || []).concat(order.additionRewards || []);
    if (baseRewards.length > 0) {
        result.sideEffects.push({ type: 'giveOrderBaseRewards', params: { rewards: baseRewards } });
    }
    if (order.activityRewards && order.activityRewards.length > 0) {
        result.sideEffects.push({
            type: 'giveOrderActivityRewards',
            params: { rewards: order.activityRewards, orderId: order.orderId }
        });
    }
    result.sideEffects.push({ type: 'recordCompleteOrder', params: { count: 1 } });

    var collectScore = configProvider && configProvider.getCollectFlagOrderScore
        ? Number(configProvider.getCollectFlagOrderScore()) || 0
        : 0;
    if (collectScore > 0) {
        result.sideEffects.push({ type: 'addCollectScore', params: { score: collectScore } });
    }
    if (order.collectRewards && order.collectRewards.length > 0) {
        result.sideEffects.push({ type: 'addNewCollectRewards', params: { collectRewards: order.collectRewards } });
    }

    orderState.playerLevel = level;
    MergeOrderLogic._pushUniqueId(orderState.completedOrderIds, order.orderId);
    orderState.lastCompletedOrder = {
        orderId: order.orderId,
        orderType: order.orderType,
        slotType: order.slotType,
        usesSlotCharge: MergeOrderLogic._orderUsesSlotCharge(order),
        lineScores: order.lineScores || order.seriesScores || MergeOrderLogic._calculateLineScores(order.requiredPieces || {}, configProvider).lineScores
    };
    orderState.orders.splice(found.index, 1);

    var syncResult = MergeOrderLogic.syncOrdersForPlayerLevel(
        orderState,
        level,
        configProvider,
        null,
        boardData || {},
        warehouseData || {}
    );
    result.newOrder = syncResult.addedOrders && syncResult.addedOrders.length > 0 ? syncResult.addedOrders[0] : null;
    result.levelOrderAllComplete = syncResult.levelOrderAllComplete;
    result.levelOrderAllCompleteLevel = syncResult.levelOrderAllCompleteLevel;
    result.success = true;
    return result;
};

MergeOrderLogic.refreshActivityRewards = function (orderState, configProvider) {
    if (!orderState || !Array.isArray(orderState.orders)) return;
    var activeActivities = configProvider && configProvider.getActiveOrderBonusActivities
        ? configProvider.getActiveOrderBonusActivities()
        : [];
    for (var i = 0; i < orderState.orders.length; i++) {
        var order = orderState.orders[i];
        if (!order || order.claimed) continue;
        var orderMeta = configProvider && configProvider.getOrderMeta ? configProvider.getOrderMeta(order.orderId) : null;
        if (!orderMeta) continue;
        var rng = MergeOrderLogic.seededRandom(MergeOrderLogic.seedFromString(order.orderId + '_act'));
        order.activityRewards = MergeOrderLogic.calculateActivityRewards(orderMeta, activeActivities, rng);
    }
};

if (typeof window !== 'undefined') {
    (window as MergeOrderWindow).MergeOrderLogic = MergeOrderLogic;
}
if (typeof Game !== 'undefined') {
    Game.MergeOrderLogic = MergeOrderLogic;
}

export default MergeOrderLogic;
