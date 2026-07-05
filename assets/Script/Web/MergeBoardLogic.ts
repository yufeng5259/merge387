import '../LegacyGlobals';
/**
 * MergeBoardLogic - 前后端共享的棋盘纯逻辑模块
 *
 * 设计原则�?
 *   1. 零依赖：不访�?DB / Redis / Meta 全局对象 / Game 命名空间
 *   2. 纯函数：输入状�?+ configProvider �?输出新状�?+ sideEffects
 *   3. 确定性：队列生成使用 seeded PRNG，前后端�?seed 结果一�?
 *
 * 数据结构约定�?
 *  cookingStates: {
        toolId: number,                  // 工具棋子 id，例如榨汁机 269
        status: "loaded"|"cooking",      // loaded=已投入材料，cooking=制作�?
        ingredients: [{ cellKey, pieceData, pieceId }],
        ingredientIds: number[],         // 已投入材�?id，升�?
        recipeId: number | null,         // mergeCookingRecipe 配方 id
        resultId: number | null,         // 产物棋子 id
        resultCount: number,
        startTime: number,               // 开始时间（秒）
        finishTime: number,              // 完成时间（秒�?
        energyCost: number               // 开始制作消耗体�?
    }
 *   BoardState = {
 *       data: { "col_row": "pieceId_status_bubbleRewardId[=instanceId]" | null },
 *       generatorStates: { instanceId: GeneratorState },
 *       lastRemovedPiece: { cellKey, pieceData, generatorState, operationType, timestamp } | null,
 *       pendingRewards: { index: { t: "piece"|"content"|"pack"|"cardChest", d: string } },
 *       orderData: OrderState | null,          // 订单数据（操作后自动更新 matchedCells�?
 *       warehouse: { index: pieceData } | null  // 仓库数据（用于订单匹配，操作中不修改�?
 *   }
 *
 *   ConfigProvider = {
 *       getElementMeta(pieceId)        �?{ id, nextId, preId, ifCanSell, sellPrice, sellType, funcType, funcParam, type } | null
 *       getGeneratorByMergeId(mergeId) �?{ maxOutputCount, needCharge, chargeTime, delayTime, onetimeDestroy, output, consumeCount } | null
 *       getCurrentTime()              �?number (秒级时间�?
 *   }
 *
 *   OperationResult = {
 *       success: boolean,
 *       errorCode: string,           // 失败时的错误码字符串
 *       errorMsg: string,
 *       boardState: BoardState,      // 操作后的状态（可能已修改）
 *       sideEffects: SideEffect[],   // 需服务器执行的副作�?
 *       ...                          // 各操作特有的附加字段
 *   }
 */

import MergeOrderLogicModule from "./MergeOrderLogic";
import MergeGeneratorModule from "./MergeGenerator";
import MergeContentUtilModule from "../game/merge/MergeContentUtil";

var MergeBoardLogic: any = {};

// ====================================================================
//  常量
// ====================================================================

MergeBoardLogic.BOARD_CONFIG = {
    COLS: 7,
    ROWS: 9,
    MAX_COL: 6,
    MAX_ROW: 8
};

MergeBoardLogic.DEFAULT_WAREHOUSE_CAPACITY = 5;

MergeBoardLogic.PIECE_STATUS = {
    NORMAL: -1,
    SAND_MIN: 0,
    SAND_MAX_1: 3,
    HALF_SAND_1: 4,   // SandHalf（由全沙0-3转化而来�?
    HALF_SAND_2: 5,   // hunt_cobweb（由hunt_paperbox转化而来�?
    HUNT_BOX_1: 6,    // hunt_paperbox_1（全沙）
    HUNT_BOX_2: 7     // hunt_paperbox_2（全沙）
};

// 背景沙子/障碍物状态推进表（来源：mergeBgElements 元数据表�?
// 相邻合成触发；value=-1(NORMAL) 表示沙子完全消除
// 全沙 0/1/2/3 �?半沙4；全�?6/7 �?半沙5；半�?4/5 �?消除(-1)
MergeBoardLogic.SAND_ADVANCE_MAP = {
    0: 4,
    1: 4,
    2: 4,
    3: 4,
    6: 5,
    7: 5
};

MergeBoardLogic.DIRECTIONS = [
    { dc: -1, dr: 0 },
    { dc: 1, dr: 0 },
    { dc: 0, dr: -1 },
    { dc: 0, dr: 1 }
];

MergeBoardLogic.GENERATOR_CONFIG = {
    MIN_QUEUE_SIZE: 3,
    RANDOM_NUM_MIN: 100000,
    RANDOM_NUM_MAX: 900000
};

MergeBoardLogic.UNDO_CONFIG = {
    MAX_TIME: 5 * 60
};

// ====================================================================
//  确定性随机数
// ====================================================================

MergeBoardLogic.seededRandom = function (seed) {
    var s = seed;
    return function () {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
};

MergeBoardLogic.seededRandomInt = function (rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
};

MergeBoardLogic.seedFromString = function (str) {
    if (!str) return Date.now();
    var h = 0;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h) || 1;
};

// ====================================================================
//  工具函数
// ====================================================================

MergeBoardLogic.parsePieceData = function (pieceData) {
    if (!pieceData) return null;
    try {
        var eqParts = pieceData.split('=');
        var basePart = eqParts[0];
        var instanceId = eqParts.length > 1 ? eqParts[1] : null;
        var parts = basePart.split('_');
        if (parts.length < 3) return null;
        return {
            pieceId: parseInt(parts[0]),
            status: parseInt(parts[1]),
            bubbleRewardId: parseInt(parts[2]),
            instanceId: instanceId,
            basePart: basePart
        };
    } catch (e) {
        return null;
    }
};

MergeBoardLogic.parseCellKey = function (cellKey) {
    if (!cellKey) return null;
    try {
        var parts = cellKey.split('_');
        if (parts.length !== 2) return null;
        var col = parseInt(parts[0]);
        var row = parseInt(parts[1]);
        if (isNaN(col) || isNaN(row)) return null;
        return { col: col, row: row };
    } catch (e) {
        return null;
    }
};

MergeBoardLogic.isInBounds = function (col, row) {
    return col >= 0 && col <= MergeBoardLogic.BOARD_CONFIG.MAX_COL &&
        row >= 0 && row <= MergeBoardLogic.BOARD_CONFIG.MAX_ROW;
};

MergeBoardLogic.isSandStatus = function (status) {
    return MergeBoardLogic.SAND_ADVANCE_MAP.hasOwnProperty(status);
};

MergeBoardLogic.parseNeedCharge = function (value) {
    return value === true || value === 'TRUE' || value === 'true' || value === 1 || value === '1';
};

MergeBoardLogic.parseGeneratorRecoverInterval = function (value) {
    if (value == null) return { raw: '', recoverInterval: 0, recoverCount: 0 };
    if (typeof value === 'function') {
        try { value = value(); } catch (e) { value = ''; }
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
        if (value.value !== undefined) value = value.value;
        else if (value.v !== undefined) value = value.v;
        else if (value.default !== undefined) value = value.default;
        else if (value.data !== undefined) value = value.data;
    }
    if (Array.isArray(value)) {
        value = value.join(',');
    }
    var raw = String(value == null ? '' : value).trim();
    if (!raw || raw === '0') return { raw: raw, recoverInterval: 0, recoverCount: 0 };
    var parts = raw.split(/[,，;；]/);
    var recoverInterval = parseInt(parts[0]);
    var recoverCount = parseInt(parts.length > 1 ? parts[1] : '1');
    if (isNaN(recoverInterval) || recoverInterval <= 0) recoverInterval = 0;
    if (isNaN(recoverCount) || recoverCount <= 0) recoverCount = 0;
    if (recoverInterval <= 0 || recoverCount <= 0) {
        recoverInterval = 0;
        recoverCount = 0;
    }
    return { raw: raw, recoverInterval: recoverInterval, recoverCount: recoverCount };
};

MergeBoardLogic.getGeneratorRecoverIntervalConfig = function (generatorConfig) {
    return MergeBoardLogic.getMetaFieldValue(generatorConfig, ['interval', 'Interval', 'string', 'String'], '');
};

MergeBoardLogic.syncGeneratorRecoverConfig = function (generatorState, generatorConfig) {
    if (!generatorState) return generatorState;
    generatorConfig = generatorConfig || {};
    var maxOutputCount = parseInt(generatorConfig.maxOutputCount);
    if (!isNaN(maxOutputCount) && maxOutputCount > 0) {
        generatorState.maxOutputCount = maxOutputCount;
        if (parseInt(generatorState.remainingCount) > maxOutputCount) {
            generatorState.remainingCount = maxOutputCount;
        }
    }
    if (generatorConfig.needCharge !== undefined) {
        generatorState.needCharge = MergeBoardLogic.parseNeedCharge(generatorConfig.needCharge);
    }
    if (generatorConfig.chargeTime !== undefined) generatorState.chargeTime = parseInt(generatorConfig.chargeTime) || 0;
    if (generatorConfig.delayTime !== undefined) generatorState.delayTime = parseInt(generatorConfig.delayTime) || 0;
    if (generatorConfig.onetimeDestroy !== undefined) generatorState.onetimeDestroy = parseInt(generatorConfig.onetimeDestroy) === 1;

    var parsed = MergeBoardLogic.parseGeneratorRecoverInterval(MergeBoardLogic.getGeneratorRecoverIntervalConfig(generatorConfig));
    generatorState.interval = parsed.raw;
    generatorState.recoverInterval = parsed.recoverInterval;
    generatorState.recoverCount = parsed.recoverCount;
    if (generatorState.lastSmallRecoverTime == null || isNaN(parseInt(generatorState.lastSmallRecoverTime))) {
        generatorState.lastSmallRecoverTime = 0;
    }
    if (parsed.recoverInterval <= 0 || parsed.recoverCount <= 0) {
        generatorState.lastSmallRecoverTime = 0;
    }
    return generatorState;
};

MergeBoardLogic.applyGeneratorSmallRecover = function (generatorState, generatorConfig, currentTime) {
    if (!generatorState) return generatorState;
    MergeBoardLogic.syncGeneratorRecoverConfig(generatorState, generatorConfig);
    var recoverInterval = parseInt(generatorState.recoverInterval) || 0;
    var recoverCount = parseInt(generatorState.recoverCount) || 0;
    if (recoverInterval <= 0 || recoverCount <= 0) return generatorState;
    if (parseInt(generatorState.nextRefillTime) > 0) return generatorState;

    var maxOutputCount = parseInt(generatorState.maxOutputCount) || parseInt(generatorConfig && generatorConfig.maxOutputCount) || 0;
    if (maxOutputCount <= 0) return generatorState;
    var remainingCount = parseInt(generatorState.remainingCount);
    if (isNaN(remainingCount)) remainingCount = 0;
    if (remainingCount <= 0) {
        generatorState.lastSmallRecoverTime = 0;
        return generatorState;
    }
    if (remainingCount >= maxOutputCount) {
        generatorState.remainingCount = maxOutputCount;
        generatorState.lastSmallRecoverTime = 0;
        return generatorState;
    }

    currentTime = parseInt(currentTime);
    if (isNaN(currentTime) || currentTime <= 0) currentTime = Math.floor(Date.now() / 1000);
    var lastSmallRecoverTime = parseInt(generatorState.lastSmallRecoverTime) || 0;
    if (lastSmallRecoverTime <= 0 || currentTime <= lastSmallRecoverTime) return generatorState;

    var ticks = Math.floor((currentTime - lastSmallRecoverTime) / recoverInterval);
    if (ticks <= 0) return generatorState;
    remainingCount = Math.min(maxOutputCount, remainingCount + ticks * recoverCount);
    generatorState.remainingCount = remainingCount;
    if (remainingCount >= maxOutputCount) {
        generatorState.remainingCount = maxOutputCount;
        generatorState.lastSmallRecoverTime = 0;
    } else {
        generatorState.lastSmallRecoverTime = lastSmallRecoverTime + ticks * recoverInterval;
    }
    return generatorState;
};

MergeBoardLogic.markGeneratorSmallRecoverAfterConsume = function (generatorState, generatorConfig, currentTime) {
    if (!generatorState) return generatorState;
    MergeBoardLogic.syncGeneratorRecoverConfig(generatorState, generatorConfig);
    var recoverInterval = parseInt(generatorState.recoverInterval) || 0;
    var recoverCount = parseInt(generatorState.recoverCount) || 0;
    if (recoverInterval <= 0 || recoverCount <= 0) return generatorState;
    var maxOutputCount = parseInt(generatorState.maxOutputCount) || parseInt(generatorConfig && generatorConfig.maxOutputCount) || 0;
    var remainingCount = parseInt(generatorState.remainingCount) || 0;
    if (remainingCount <= 0 || remainingCount >= maxOutputCount || parseInt(generatorState.nextRefillTime) > 0) {
        generatorState.lastSmallRecoverTime = 0;
        return generatorState;
    }
    if ((parseInt(generatorState.lastSmallRecoverTime) || 0) <= 0) {
        generatorState.lastSmallRecoverTime = parseInt(currentTime) || Math.floor(Date.now() / 1000);
    }
    return generatorState;
};

MergeBoardLogic.isTruthyConfig = function (value) {
    return value === true || value === 'TRUE' || value === 'true' || value === 1 || value === '1';
};

MergeBoardLogic.isBubbleInstanceId = function (instanceId) {
    return typeof instanceId === 'string' && instanceId.indexOf('b_') === 0;
};

MergeBoardLogic.isBubblePieceData = function (pieceData) {
    var parsed = MergeBoardLogic.parsePieceData(pieceData);
    return !!(parsed && MergeBoardLogic.isBubbleInstanceId(parsed.instanceId));
};

MergeBoardLogic.findBubbleCell = function (boardData, bubbleId) {
    if (!boardData || !bubbleId) return null;
    for (var cellKey in boardData) {
        var parsed = MergeBoardLogic.parsePieceData(boardData[cellKey]);
        if (parsed && parsed.instanceId === bubbleId) return cellKey;
    }
    return null;
};

MergeBoardLogic.buildBubbleId = function (pieceId, boardState, seedKey) {
    var usedNums = {};
    var boardData = boardState && boardState.data ? boardState.data : {};
    var bubblePieces = boardState && boardState.bubblePieces ? boardState.bubblePieces : {};
    for (var cellKey in boardData) {
        var parsed = MergeBoardLogic.parsePieceData(boardData[cellKey]);
        if (!parsed || !MergeBoardLogic.isBubbleInstanceId(parsed.instanceId)) continue;
        var parts = parsed.instanceId.split('_');
        var n = parseInt(parts[parts.length - 1]);
        if (!isNaN(n)) usedNums[n] = true;
    }
    for (var bid in bubblePieces) {
        var bparts = bid.split('_');
        var bn = parseInt(bparts[bparts.length - 1]);
        if (!isNaN(bn)) usedNums[bn] = true;
    }
    var seqNum = 1;
    while (usedNums[seqNum]) seqNum++;
    return 'b_' + pieceId + '_' + MergeBoardLogic.seedFromString(seedKey || String(pieceId)) + '_' + seqNum;
};

MergeBoardLogic.ensureBubbleState = function (boardState) {
    if (!boardState.bubblePieces) boardState.bubblePieces = {};
    if (!boardState.bubbleStats) boardState.bubbleStats = {};
    if (!boardState.bubbleStats.freeUsedTotal) boardState.bubbleStats.freeUsedTotal = 0;
    if (!boardState.bubbleStats.adUsedToday) boardState.bubbleStats.adUsedToday = 0;
    return { bubblePieces: boardState.bubblePieces, bubbleStats: boardState.bubbleStats };
};

MergeBoardLogic.normalizeBubbleDailyStats = function (boardState, configProvider) {
    var bs = MergeBoardLogic.ensureBubbleState(boardState).bubbleStats;
    var now = configProvider && configProvider.getCurrentTime ? configProvider.getCurrentTime() : Math.floor(Date.now() / 1000);
    var day = Math.floor(now / 86400);
    if (bs.adDay !== day) {
        bs.adDay = day;
        bs.adUsedToday = 0;
    }
    return bs;
};

MergeBoardLogic.getBubbleConfig = function (configProvider) {
    var cfg = configProvider && configProvider.getBubbleConfig ? configProvider.getBubbleConfig() : {};
    cfg = cfg || {};
    return {
        lifeTime: Math.max(0, parseInt(cfg.lifeTime) || 0),
        freeCount: Math.max(0, parseInt(cfg.freeCount) || 0),
        adCount: Math.max(0, parseInt(cfg.adCount == null ? 3 : cfg.adCount) || 0),
        adMaxLevel: cfg.adMaxLevel,
        openLevel: Math.max(0, parseInt(cfg.openLevel) || 0),
        expireCoinPieceId: parseInt(cfg.expireCoinPieceId) || 51,
        expireGraceSeconds: Math.max(0, parseInt(cfg.expireGraceSeconds == null ? 2 : cfg.expireGraceSeconds) || 0)
    };
};

MergeBoardLogic.parseBubbleRate = function (rate) {
    if (rate == null || rate === '') return 0;
    if (typeof rate === 'object') {
        if (rate.value !== undefined) return MergeBoardLogic.parseBubbleRate(rate.value);
        if (rate.v !== undefined) return MergeBoardLogic.parseBubbleRate(rate.v);
        if (rate.num !== undefined) return MergeBoardLogic.parseBubbleRate(rate.num);
        if (rate.default !== undefined) return MergeBoardLogic.parseBubbleRate(rate.default);
    }
    if (typeof rate === 'number') return rate > 0 && rate <= 1 ? rate * 100 : Math.max(0, rate);
    var s = String(rate).trim();
    if (!s || s === '0') return 0;
    if (s.indexOf('-') !== -1) {
        var parts = s.split('-');
        var min = MergeBoardLogic.parseBubbleRate(parts[0]);
        var max = MergeBoardLogic.parseBubbleRate(parts[1]);
        if (isNaN(min) || isNaN(max)) return 0;
        if (max < min) { var t = min; min = max; max = t; }
        return { min: Math.max(0, min), max: Math.max(0, max) };
    }
    var n = parseFloat(s);
    if (isNaN(n)) return 0;
    return n > 0 && n <= 1 ? n * 100 : Math.max(0, n);
};

MergeBoardLogic.getBubbleRateThreshold = function (rate) {
    var parsed = MergeBoardLogic.parseBubbleRate(rate);
    if (!parsed) return 0;
    if (typeof parsed === 'object') return Math.max(0, Math.min(100, (parsed.min + parsed.max) / 2));
    return Math.max(0, Math.min(100, parsed));
};

MergeBoardLogic.rollBubbleDrop = function (rate, seedKey) {
    var threshold = MergeBoardLogic.getBubbleRateThreshold(rate);
    if (threshold <= 0) return false;
    if (threshold >= 100) return true;
    var rng = MergeBoardLogic.seededRandom(MergeBoardLogic.seedFromString(seedKey || String(rate)));
    var roll = rng() * 100;
    return roll < threshold;
};

MergeBoardLogic.rollBubbleDropInfo = function (rate, seedKey) {
    var threshold = MergeBoardLogic.getBubbleRateThreshold(rate);
    var info = {
        rate: rate,
        threshold: threshold,
        roll: null,
        hit: false,
        seedKey: seedKey || String(rate)
    };
    if (threshold <= 0) return info;
    if (threshold >= 100) {
        info.roll = 0;
        info.hit = true;
        return info;
    }
    var rng = MergeBoardLogic.seededRandom(MergeBoardLogic.seedFromString(info.seedKey));
    info.roll = rng() * 100;
    info.hit = info.roll < threshold;
    return info;
};

MergeBoardLogic.getCurrentPlayerLevel = function (boardState, configProvider) {
    var level = parseInt(boardState && boardState.playerLevel);
    if (!isNaN(level) && level > 0) return level;
    try {
        if (configProvider && configProvider.getPlayerLevel) {
            level = parseInt(configProvider.getPlayerLevel());
            if (!isNaN(level) && level > 0) return level;
        }
    } catch (e) { }
    try {
        if (typeof Game !== 'undefined' && Game.SUser && Game.SUser.Level) {
            level = parseInt(Game.SUser.Level());
            if (!isNaN(level) && level > 0) return level;
        }
    } catch (e) { }
    return Math.max(0, parseInt(boardState && boardState.playerLevel) || 0);
};

MergeBoardLogic.normalizeMetaFieldName = function (key) {
    return String(key || '').replace(/[\s_\-]/g, '').toLowerCase();
};

MergeBoardLogic.unwrapMetaFieldValue = function (value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (value.value !== undefined) return value.value;
        if (value.v !== undefined) return value.v;
        if (value.num !== undefined) return value.num;
        if (value.default !== undefined) return value.default;
    }
    return value;
};

MergeBoardLogic.getMetaFieldValue = function (meta, keys, defaultValue) {
    if (!meta) return defaultValue;
    var expected = {};
    for (var i = 0; i < keys.length; i++) expected[MergeBoardLogic.normalizeMetaFieldName(keys[i])] = true;

    var readDirectKey = function (src) {
        if (!src) return undefined;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (src[key] === undefined || src[key] === null) continue;
            var value = src[key];
            if (typeof value === 'function') {
                try { value = value.call(src); } catch (e) { continue; }
            }
            return MergeBoardLogic.unwrapMetaFieldValue(value);
        }
        return undefined;
    };

    var readFrom = function (src) {
        if (!src) return undefined;
        for (var key in src) {
            if (!expected[MergeBoardLogic.normalizeMetaFieldName(key)]) continue;
            var value = src[key];
            if (typeof value === 'function') {
                try { value = value.call(src); } catch (e) { continue; }
            }
            return MergeBoardLogic.unwrapMetaFieldValue(value);
        }
        return undefined;
    };

    var direct = readDirectKey(meta);
    if (direct !== undefined && direct !== null) return direct;
    direct = readDirectKey(meta._data);
    if (direct !== undefined && direct !== null) return direct;
    direct = readFrom(meta);
    if (direct !== undefined && direct !== null) return direct;
    direct = readFrom(meta._data);
    if (direct !== undefined && direct !== null) return direct;
    return defaultValue;
};

MergeBoardLogic.BUBBLE_RATE_FIELD_KEYS = [
    'bubbleRate', 'bubblerate', 'BubbleRate', 'bubble_rate',
    'generatorBubbleRate', 'GeneratorBubbleRate', 'generateBubbleRate',
    'bubbleProbability', 'BubbleProbability', 'bubbleProb', 'BubbleProb',
    'bubbleChance', 'BubbleChance', 'bubbleCreateRate', 'bubbleSpawnRate'
];

MergeBoardLogic.BUBBLE_COST_FIELD_KEYS = [
    'bubbleCost', 'bubblecost', 'BubbleCost', 'bubble_cost',
    'generatorBubbleCost', 'GeneratorBubbleCost'
];

MergeBoardLogic.BUBBLE_PARAM_FIELD_KEYS = [
    'bubbleParam', 'bubbleparam', 'BubbleParam', 'bubble_param',
    'generatorBubbleParam', 'GeneratorBubbleParam'
];

MergeBoardLogic.getMetaBubbleRate = function (meta) {
    return MergeBoardLogic.getMetaFieldValue(meta, MergeBoardLogic.BUBBLE_RATE_FIELD_KEYS, null);
};

MergeBoardLogic.hasMetaBubbleRate = function (meta) {
    var rate = MergeBoardLogic.getMetaBubbleRate(meta);
    return rate !== null && rate !== undefined && rate !== '';
};

MergeBoardLogic.getMetaBubbleCost = function (meta) {
    return MergeBoardLogic.getMetaFieldValue(meta, MergeBoardLogic.BUBBLE_COST_FIELD_KEYS, '');
};

MergeBoardLogic.getMetaBubbleParam = function (meta) {
    var param = MergeBoardLogic.getMetaFieldValue(meta, MergeBoardLogic.BUBBLE_PARAM_FIELD_KEYS, {});
    if (typeof param === 'string') {
        try { return JSON.parse(param); } catch (e) { return param; }
    }
    return param || {};
};

MergeBoardLogic.resolveBubbleMeta = function (generatedMeta, sourceGeneratorMeta, sourceName) {
    var hasSourceRate = MergeBoardLogic.hasMetaBubbleRate(sourceGeneratorMeta);
    var rateMeta = hasSourceRate ? sourceGeneratorMeta : generatedMeta;
    if (!rateMeta) return { meta: generatedMeta || sourceGeneratorMeta, source: hasSourceRate ? (sourceName || 'generator') : 'generated' };

    var merged: Record<string, any> = {};
    var copy = function (src) {
        if (!src) return;
        for (var k in src) merged[k] = src[k];
    };
    copy(generatedMeta);
    if (hasSourceRate) {
        merged.bubbleRate = MergeBoardLogic.getMetaBubbleRate(sourceGeneratorMeta);
        merged.id = generatedMeta && generatedMeta.id != null ? generatedMeta.id : sourceGeneratorMeta.id;
        merged.bubbleRateSourceId = sourceGeneratorMeta.id;
        if (sourceGeneratorMeta.preferBubbleRewardConfig) {
            var sourceBubbleParam = MergeBoardLogic.getMetaFieldValue(sourceGeneratorMeta, MergeBoardLogic.BUBBLE_PARAM_FIELD_KEYS, null);
            if (typeof sourceBubbleParam === 'string') {
                try { sourceBubbleParam = JSON.parse(sourceBubbleParam); } catch (e) { }
            }
            var sourceBubbleCost = MergeBoardLogic.getMetaBubbleCost(sourceGeneratorMeta);
            if (sourceBubbleParam !== undefined && sourceBubbleParam !== null && sourceBubbleParam !== '') {
                merged.bubbleParam = sourceBubbleParam;
            }
            if (sourceBubbleCost !== undefined && sourceBubbleCost !== null && sourceBubbleCost !== '') {
                merged.bubbleCost = sourceBubbleCost;
            }
        }
    } else {
        copy(sourceGeneratorMeta);
        copy(generatedMeta);
    }
    return { meta: merged, source: hasSourceRate ? (sourceName || 'generator') : 'generated' };
};

MergeBoardLogic.resolveGeneratorIdFromBoard = function (boardData, instanceId) {
    if (!boardData || !instanceId) return null;
    for (var cellKey in boardData) {
        var data = boardData[cellKey];
        if (!data || typeof data !== 'string' || data.indexOf('=') === -1) continue;
        var parts = data.split('=');
        if (parts[1] !== instanceId) continue;
        var parsed = MergeBoardLogic.parsePieceData(parts[0]);
        if (parsed && !isNaN(parsed.pieceId) && parsed.pieceId > 0) return parsed.pieceId;
    }
    var prefix = parseInt(String(instanceId).split('_')[0]);
    return isNaN(prefix) ? null : prefix;
};

MergeBoardLogic.resolveBubbleClaimCost = function (info, configProvider) {
    var normalize = function (value) {
        return MergeBoardLogic.normalizeConsumeString(value || '');
    };

    var consumeStr = normalize(info && info.cost);
    if (consumeStr) return consumeStr;

    var ids = [];
    if (info) {
        if (info.bubbleCostSourceId !== undefined && info.bubbleCostSourceId !== null) ids.push(info.bubbleCostSourceId);
        if (info.sourceGeneratorId !== undefined && info.sourceGeneratorId !== null) ids.push(info.sourceGeneratorId);
        if (info.bubbleRateSourceId !== undefined && info.bubbleRateSourceId !== null) ids.push(info.bubbleRateSourceId);
    }
    for (var i = 0; i < ids.length; i++) {
        var sourceId = parseInt(ids[i]);
        if (isNaN(sourceId)) continue;
        var generatorConfig = configProvider && configProvider.getGeneratorByMergeId ? configProvider.getGeneratorByMergeId(sourceId) : null;
        consumeStr = normalize(MergeBoardLogic.getMetaBubbleCost(generatorConfig));
        if (consumeStr) return consumeStr;
        var sourceMeta = configProvider && configProvider.getElementMeta ? configProvider.getElementMeta(sourceId) : null;
        consumeStr = normalize(MergeBoardLogic.getMetaBubbleCost(sourceMeta));
        if (consumeStr) return consumeStr;
    }

    if (info && info.pieceId != null && configProvider && configProvider.getElementMeta) {
        var pieceMeta = configProvider.getElementMeta(info.pieceId);
        consumeStr = normalize(MergeBoardLogic.getMetaBubbleCost(pieceMeta));
        if (consumeStr) return consumeStr;
    }
    return '';
};

MergeBoardLogic.findBubbleSpawnCell = function (boardData, resultKey, rng) {
    var coords = MergeBoardLogic.parseCellKey(resultKey);
    if (!coords) return null;
    var dirs = [
        { dc: -1, dr: 0 },
        { dc: 0, dr: -1 },
        { dc: 1, dr: 0 },
        { dc: 0, dr: 1 },
        { dc: -1, dr: 0 }
    ];
    var seen = {};
    for (var i = 0; i < dirs.length; i++) {
        var col = coords.col + dirs[i].dc;
        var row = coords.row + dirs[i].dr;
        if (!MergeBoardLogic.isInBounds(col, row)) continue;
        var key = col + '_' + row;
        if (seen[key]) continue;
        seen[key] = true;
        if (!boardData[key]) return { key: key, col: col, row: row };
    }
    var empty = [];
    var cfg = MergeBoardLogic.BOARD_CONFIG;
    for (var r = 0; r <= cfg.MAX_ROW; r++) {
        for (var c = 0; c <= cfg.MAX_COL; c++) {
            var k = c + '_' + r;
            if (!boardData[k]) empty.push({ key: k, col: c, row: r });
        }
    }
    if (empty.length === 0) return null;
    rng = rng || Math.random;
    return empty[Math.floor(rng() * empty.length)];
};

MergeBoardLogic.cleanupBubblePieces = function (boardState) {
    var state = MergeBoardLogic.ensureBubbleState(boardState);
    var active = {};
    var boardData = boardState.data || {};
    for (var cellKey in boardData) {
        var parsed = MergeBoardLogic.parsePieceData(boardData[cellKey]);
        if (parsed && MergeBoardLogic.isBubbleInstanceId(parsed.instanceId)) active[parsed.instanceId] = true;
    }
    for (var bubbleId in state.bubblePieces) {
        if (!active[bubbleId]) delete state.bubblePieces[bubbleId];
    }
};

MergeBoardLogic.expireBubblePieces = function (boardState, configProvider, options) {
    MergeBoardLogic.ensureBubbleState(boardState);
    options = options || {};
    var cfg = MergeBoardLogic.getBubbleConfig(configProvider);
    var now = configProvider && configProvider.getCurrentTime ? configProvider.getCurrentTime() : Math.floor(Date.now() / 1000);
    var expired = [];
    var boardData = boardState.data || {};
    for (var bubbleId in boardState.bubblePieces) {
        if (options.excludeBubbleId && bubbleId === options.excludeBubbleId) continue;
        var info = boardState.bubblePieces[bubbleId];
        if (!info) continue;
        var expireAt = parseInt(info.expireAt) || 0;
        var graceSeconds = Math.max(0, parseInt(options.graceSeconds == null ? cfg.expireGraceSeconds : options.graceSeconds) || 0);
        if (expireAt <= 0 || now <= expireAt + graceSeconds) continue;
        var cellKey = MergeBoardLogic.findBubbleCell(boardData, bubbleId);
        if (cellKey) {
            boardData[cellKey] = cfg.expireCoinPieceId + '_-1_-1';
            expired.push({ bubbleId: bubbleId, cellKey: cellKey, pieceId: info.pieceId });
        }
        delete boardState.bubblePieces[bubbleId];
    }
    return { changed: expired.length > 0, expired: expired };
};

MergeBoardLogic.createBubbleAfterMerge = function (result, boardState, resultKey, pieceId, meta, configProvider, seedKey, debugOptions) {
    debugOptions = debugOptions || {};
    var bubbleRate = MergeBoardLogic.getMetaBubbleRate(meta);
    result.bubbleDebug = {
        pieceId: pieceId,
        resultKey: resultKey,
        bubbleRate: bubbleRate,
        metaSource: debugOptions.metaSource || '',
        metaPieceId: debugOptions.metaPieceId || (meta && meta.id) || null,
        bubbleRateSourceId: debugOptions.bubbleRateSourceId || (meta && meta.bubbleRateSourceId) || null,
        sourceGeneratorId: debugOptions.sourceGeneratorId || null,
        reason: ''
    };
    if (!meta || bubbleRate == null || bubbleRate === '') {
        result.bubbleDebug.reason = 'no_rate';
        return null;
    }
    var cfg = MergeBoardLogic.getBubbleConfig(configProvider);
    var level = configProvider && configProvider.getPieceLevel ? configProvider.getPieceLevel(pieceId) : 0;
    var playerLevel = MergeBoardLogic.getCurrentPlayerLevel(boardState, configProvider);
    result.bubbleDebug.openLevel = cfg.openLevel;
    result.bubbleDebug.playerLevel = playerLevel;
    if (cfg.openLevel > 0 && playerLevel < cfg.openLevel) {
        result.bubbleDebug.reason = 'level_locked';
        return null;
    }
    var baseSeedKey = seedKey || (resultKey + ':' + pieceId);
    var rollInfo = MergeBoardLogic.rollBubbleDropInfo(bubbleRate, baseSeedKey + ':drop');
    result.bubbleDebug.threshold = rollInfo.threshold;
    result.bubbleDebug.roll = rollInfo.roll;
    result.bubbleDebug.seedKey = rollInfo.seedKey;
    if (!rollInfo.hit) {
        result.bubbleDebug.reason = 'roll_miss';
        return null;
    }
    var spawnRng = MergeBoardLogic.seededRandom(MergeBoardLogic.seedFromString(baseSeedKey + ':spawn'));
    var spawn = MergeBoardLogic.findBubbleSpawnCell(boardState.data, resultKey, spawnRng);
    if (!spawn) {
        result.bubbleDebug.reason = 'no_spawn_cell';
        return null;
    }
    MergeBoardLogic.ensureBubbleState(boardState);
    var bubbleId = MergeBoardLogic.buildBubbleId(pieceId, boardState, seedKey || spawn.key);
    var basePieceData = pieceId + '_-1_-1';
    var now = configProvider && configProvider.getCurrentTime ? configProvider.getCurrentTime() : Math.floor(Date.now() / 1000);
    boardState.data[spawn.key] = basePieceData + '=' + bubbleId;
    var bubbleCost = MergeBoardLogic.getMetaBubbleCost(meta);
    var bubbleParam = MergeBoardLogic.getMetaBubbleParam(meta);
    boardState.bubblePieces[bubbleId] = {
        bubbleId: bubbleId,
        pieceId: pieceId,
        pieceData: basePieceData,
        createdAt: now,
        expireAt: cfg.lifeTime > 0 ? now + cfg.lifeTime : 0,
        cost: bubbleCost || '',
        param: bubbleParam || {},
        bubbleRateSourceId: meta && meta.bubbleRateSourceId,
        sourceGeneratorId: debugOptions.sourceGeneratorId || null,
        level: level
    };
    result.bubbleCreated = {
        bubbleId: bubbleId,
        cellKey: spawn.key,
        pieceData: boardState.data[spawn.key],
        expireAt: boardState.bubblePieces[bubbleId].expireAt,
        bubbleInfo: JSON.parse(JSON.stringify(boardState.bubblePieces[bubbleId]))
    };
    result.bubbleDebug.reason = 'created';
    return result.bubbleCreated;
};

MergeBoardLogic.resolveBubbleTarget = function (boardState, cellKeyOrBubbleId) {
    var boardData = boardState.data || {};
    var cell = MergeBoardLogic.resolveCell(boardData, cellKeyOrBubbleId);
    if (cell && MergeBoardLogic.isBubblePieceData(cell.data)) {
        var parsed = MergeBoardLogic.parsePieceData(cell.data);
        return { cellKey: cell.key, pieceData: cell.data, parsed: parsed, bubbleId: parsed.instanceId };
    }
    var foundKey = MergeBoardLogic.findBubbleCell(boardData, cellKeyOrBubbleId);
    if (!foundKey) return null;
    var p = MergeBoardLogic.parsePieceData(boardData[foundKey]);
    return { cellKey: foundKey, pieceData: boardData[foundKey], parsed: p, bubbleId: cellKeyOrBubbleId };
};

MergeBoardLogic.bubbleClaim = function (boardState, cellKeyOrBubbleId, method, configProvider) {
    var result = _baseResult(boardState);
    result.bubbleClaimed = null;
    result.resourceRequired = null;
    MergeBoardLogic.ensureBubbleState(boardState);
    var target = MergeBoardLogic.resolveBubbleTarget(boardState, cellKeyOrBubbleId);
    if (!target) {
        result.errorCode = 'BUBBLE_NOT_FOUND';
        result.errorMsg = 'bubble not found';
        return result;
    }
    var info = boardState.bubblePieces[target.bubbleId];
    if (!info) {
        result.errorCode = 'BUBBLE_NOT_FOUND';
        result.errorMsg = 'bubble data not found';
        return result;
    }
    var cfg = MergeBoardLogic.getBubbleConfig(configProvider);
    var expireResult = MergeBoardLogic.expireBubblePieces(boardState, configProvider, {
        excludeBubbleId: target.bubbleId,
        graceSeconds: cfg.expireGraceSeconds
    });
    var now = configProvider && configProvider.getCurrentTime ? configProvider.getCurrentTime() : Math.floor(Date.now() / 1000);
    var expireAt = parseInt(info.expireAt) || 0;
    if (expireAt > 0 && now > expireAt + cfg.expireGraceSeconds) {
        var expiredCellKey = MergeBoardLogic.findBubbleCell(boardState.data, target.bubbleId);
        if (expiredCellKey) {
            boardState.data[expiredCellKey] = cfg.expireCoinPieceId + '_-1_-1';
        }
        delete boardState.bubblePieces[target.bubbleId];
        result.errorCode = 'BUBBLE_EXPIRED';
        result.errorMsg = 'bubble expired';
        result.bubbleExpired = [{ bubbleId: target.bubbleId, cellKey: expiredCellKey || target.cellKey, pieceId: info.pieceId }];
        return result;
    }
    if (expireResult.changed && !boardState.bubblePieces[target.bubbleId]) {
        result.errorCode = 'BUBBLE_EXPIRED';
        result.errorMsg = 'bubble expired';
        result.bubbleExpired = expireResult.expired;
        return result;
    }
    method = method || 'free';
    var stats = MergeBoardLogic.normalizeBubbleDailyStats(boardState, configProvider);
    if (method === 'free') {
        if (stats.freeUsedTotal >= cfg.freeCount) {
            result.errorCode = 'BUBBLE_FREE_LIMIT';
            result.errorMsg = 'free bubble limit reached';
            return result;
        }
        stats.freeUsedTotal++;
    } else if (method === 'ad') {
        var maxLevel = cfg.adMaxLevel;
        if (maxLevel !== 'N' && maxLevel !== 'n' && maxLevel !== undefined && maxLevel !== null && maxLevel !== '') {
            maxLevel = parseInt(maxLevel);
            if (!isNaN(maxLevel) && info.level > maxLevel) {
                result.errorCode = 'BUBBLE_AD_LEVEL_LIMIT';
                result.errorMsg = 'bubble ad level limit';
                return result;
            }
        }
        if (stats.adUsedToday >= cfg.adCount) {
            result.errorCode = 'BUBBLE_AD_LIMIT';
            result.errorMsg = 'daily ad bubble limit reached';
            return result;
        }
        stats.adUsedToday++;
    } else if (method === 'cash' || method === 'diamond') {
        var bubbleConsumeStr = MergeBoardLogic.resolveBubbleClaimCost(info, configProvider);
        if (!bubbleConsumeStr || !MergeBoardLogic.parseConsumeString(bubbleConsumeStr)) {
            result.errorCode = 'BUBBLE_INVALID_METHOD';
            result.errorMsg = 'bubble cost invalid';
            return result;
        }
        info.cost = bubbleConsumeStr;
        result.resourceRequired = { consumeStr: bubbleConsumeStr };
        var resCheck = MergeBoardLogic.checkAndDeductResource(boardState, result.resourceRequired.consumeStr);
        if (!resCheck.success) {
            result.errorCode = resCheck.errorCode;
            result.errorMsg = resCheck.errorMsg;
            return result;
        }
    } else {
        result.errorCode = 'BUBBLE_INVALID_METHOD';
        result.errorMsg = 'invalid bubble claim method';
        return result;
    }
    boardState.data[target.cellKey] = target.parsed.basePart;
    delete boardState.bubblePieces[target.bubbleId];
    boardState.lastRemovedPiece = null;
    MergeBoardLogic.recordObtainedPiece(boardState, boardState.data[target.cellKey]);
    result.bubbleClaimed = { bubbleId: target.bubbleId, cellKey: target.cellKey, pieceData: boardState.data[target.cellKey], method: method };
    result.success = true;
    return _postProcessResult(result);
};

MergeBoardLogic.bubbleBreak = function (boardState, cellKeyOrBubbleId, configProvider) {
    var result = _baseResult(boardState);
    result.bubbleBroken = null;
    MergeBoardLogic.ensureBubbleState(boardState);
    var target = MergeBoardLogic.resolveBubbleTarget(boardState, cellKeyOrBubbleId);
    if (!target) {
        result.errorCode = 'BUBBLE_NOT_FOUND';
        result.errorMsg = 'bubble not found';
        return result;
    }
    var cfg = MergeBoardLogic.getBubbleConfig(configProvider);
    boardState.data[target.cellKey] = cfg.expireCoinPieceId + '_-1_-1';
    delete boardState.bubblePieces[target.bubbleId];
    boardState.lastRemovedPiece = null;
    result.bubbleBroken = { bubbleId: target.bubbleId, cellKey: target.cellKey, pieceData: boardState.data[target.cellKey] };
    result.success = true;
    return _postProcessResult(result);
};

/**
 * 兼容 col_row �?row_col 格式查找格子
 */
MergeBoardLogic.resolveCell = function (boardData, cellKey) {
    if (!boardData || !cellKey) return null;
    var v = boardData[cellKey];
    if (v) return { key: cellKey, data: v };
    var p = cellKey.split('_');
    if (p.length === 2) {
        var alt = p[1] + '_' + p[0];
        if (boardData[alt]) return { key: alt, data: boardData[alt] };
    }
    return null;
};

/**
 * 查找下一个空格子（从上往�? 从左往右）
 */
MergeBoardLogic.findNextEmptyCell = function (boardData) {
    var cfg = MergeBoardLogic.BOARD_CONFIG;
    for (var row = cfg.MAX_ROW; row >= 0; row--) {
        for (var col = 0; col <= cfg.MAX_COL; col++) {
            var key = col + '_' + row;
            if (!boardData[key]) {
                return { col: col, row: row, key: key };
            }
        }
    }
    return null;
};

/**
 * 查找下一个空格，排除即将被本次操作占用的格子
 */
MergeBoardLogic.findNextEmptyCellExcept = function (boardData, exceptKeys) {
    var cfg = MergeBoardLogic.BOARD_CONFIG;
    exceptKeys = exceptKeys || {};
    for (var row = cfg.MAX_ROW; row >= 0; row--) {
        for (var col = 0; col <= cfg.MAX_COL; col++) {
            var key = col + '_' + row;
            if (!exceptKeys[key] && !boardData[key]) {
                return { col: col, row: row, key: key };
            }
        }
    }
    return null;
};

MergeBoardLogic.normalizeBool = function (value) {
    if (value === true || value === 1) return true;
    if (value === false || value === 0 || value == null) return false;
    var text = String(value).trim().toLowerCase();
    if (!text || text === '0' || text === 'false' || text === 'no' || text === 'n') return false;
    return true;
};

MergeBoardLogic.getMetaField = function (meta, camelName, lowerName) {
    if (!meta) return undefined;
    if (meta[camelName] !== undefined) return meta[camelName];
    if (lowerName && meta[lowerName] !== undefined) return meta[lowerName];
    return undefined;
};

/**
 * Normalize pendingRewards to an index map and wrap legacy string entries.
 */
MergeBoardLogic.normalizePendingRewards = function (boardState) {
    if (!boardState) return {};
    var rewards = boardState.pendingRewards;
    if (!rewards || typeof rewards !== 'object') {
        boardState.pendingRewards = {};
        return boardState.pendingRewards;
    }
    if (Array.isArray(rewards)) {
        var map = {};
        for (var i = 0; i < rewards.length; i++) {
            if (rewards[i] !== undefined && rewards[i] !== null) {
                map[i] = typeof rewards[i] === 'string' ? { t: 'piece', d: rewards[i] } : rewards[i];
            }
        }
        boardState.pendingRewards = map;
    } else {
        for (var key in rewards) {
            if (typeof rewards[key] === 'string') {
                rewards[key] = { t: 'piece', d: rewards[key] };
            }
        }
    }
    return boardState.pendingRewards;
};

MergeBoardLogic.parsePendingRewardEntry = function (entry) {
    if (entry === undefined || entry === null) return null;
    if (typeof entry === 'string') return { t: 'piece', d: entry };
    if (typeof entry !== 'object') return null;
    var rewardType = entry.t != null ? entry.t : entry.type;
    var rewardData = entry.d != null ? entry.d : entry.data;
    if (rewardType == null && rewardData == null && entry.pieceData != null) {
        rewardType = 'piece';
        rewardData = entry.pieceData;
    }
    if (rewardType == null) rewardType = 'piece';
    return { t: String(rewardType), d: rewardData == null ? '' : String(rewardData) };
};

MergeBoardLogic.addPendingRewards = function (boardState, entries) {
    var result = _baseResult(boardState);
    if (entries === undefined || entries === null) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'missing pending reward entries';
        return result;
    }
    var list = Array.isArray(entries) ? entries : [entries];
    if (list.length === 0) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'empty pending reward entries';
        return result;
    }

    var pendingRewards = MergeBoardLogic.normalizePendingRewards(boardState);
    var rewardIndexes = [];
    for (var i = 0; i < list.length; i++) {
        var parsed = MergeBoardLogic.parsePendingRewardEntry(list[i]);
        if (!parsed || !parsed.t || parsed.d === '') continue;
        var rewardIndex = 0;
        while (pendingRewards[String(rewardIndex)] !== undefined) rewardIndex++;
        pendingRewards[String(rewardIndex)] = parsed;
        rewardIndexes.push(String(rewardIndex));
    }

    if (rewardIndexes.length === 0) {
        result.errorCode = 'INVALID_REWARD_DATA';
        result.errorMsg = 'no valid pending reward entries';
        return result;
    }
    boardState.lastRemovedPiece = null;
    result.success = true;
    result.rewardIndexes = rewardIndexes;
    result.pendingRewards = pendingRewards;
    return _postProcessResult(result);
};

/**
 * 检�?instanceId 是否在棋盘上
 */
MergeBoardLogic.isGeneratorOnBoard = function (boardData, instanceId) {
    for (var cellKey in boardData) {
        var cellData = boardData[cellKey];
        if (cellData && cellData.indexOf('=') !== -1) {
            var cellInstanceId = cellData.split('=')[1];
            if (cellInstanceId === instanceId) return true;
        }
    }
    return false;
};

MergeBoardLogic.needsFuncInstance = function (meta) {
    return meta && (
        meta.funcType === 'threeToOneType' ||
        meta.funcType === 'threeToOneOrder' ||
        meta.funcType === 'cooking'
    );
};

MergeBoardLogic.buildPlacedPieceData = function (pieceId, boardState, configProvider, seedKey) {
    var boardData = boardState.data;
    var pieceData = pieceId + '_-1_-1';
    var generatorConfig = configProvider.getGeneratorByMergeId(pieceId);
    if (generatorConfig) {
        var instanceId = MergeBoardLogic.generateInstanceId(pieceId, boardData);
        pieceData += '=' + instanceId;
        var queueSeed = MergeBoardLogic.seedFromString((seedKey || '') + ':' + pieceId);
        boardState.generatorStates[instanceId] = MergeBoardLogic.buildGeneratorState(generatorConfig, pieceId, queueSeed);
        // 首次出现�?generatorId 时初始化共享初始序列
        MergeBoardLogic.ensureInitialSequence(boardState, pieceId, generatorConfig);
        return { pieceData: pieceData, instanceId: instanceId, generatorConfig: generatorConfig };
    }

    var meta = configProvider.getElementMeta(pieceId);
    if (MergeBoardLogic.needsFuncInstance(meta)) {
        pieceData += '=' + MergeBoardLogic.generateFuncPieceInstanceId(pieceId, boardData);
    }
    return { pieceData: pieceData, instanceId: null, generatorConfig: null };
};

/**
 * 清理 generatorStates 中棋盘上已不存在的孤立状�?
 * 前后端都应在操作前调用，保证 generatorStates �?boardData 一�?
 */
MergeBoardLogic.cleanupOrphanedStates = function (boardState) {
    var boardData = boardState.data;
    var generatorStates = boardState.generatorStates;
    if (!generatorStates) return;
    var boardInstanceIds = {};
    for (var k in boardData) {
        var v = boardData[k];
        if (v && typeof v === 'string' && v.indexOf('=') !== -1) {
            boardInstanceIds[v.split('=')[1]] = true;
        }
    }
    for (var id in generatorStates) {
        if (!boardInstanceIds[id]) {
            delete generatorStates[id];
        }
    }
};

// ====================================================================
//  生成器队列（确定性随机）
// ====================================================================

/**
 * 生成棋子队列
 * @param {Object} generatorConfig - 来自 configProvider.getGeneratorByMergeId
 * @param {number} count - 队列长度
 * @param {number} seed - 随机种子
 * @returns {{ queue: number[], newSeed: number }}
 */
/**
 * 生成棋子队列（委�?MergeGenerator，无持久 produceState 的无状态调用）
 * 注：固定/非重�?PRD 等有状态模式应优先�?refillGeneratorQueue 以延续状态；
 *     本函数保留旧签名仅作兜底/默认完全随机使用�?
 * @param {Object} generatorConfig - 来自 configProvider.getGeneratorByMergeId
 * @param {number} count - 队列长度
 * @param {number} seed - 随机种子
 * @returns {{ queue: number[], newSeed: number }}
 */
MergeBoardLogic.generatePieceQueue = function (generatorConfig, count, seed) {
    var empty = { queue: [], newSeed: seed };
    var MG = MergeBoardLogic._getMergeGenerator();
    if (!MG || !generatorConfig || !generatorConfig.output) return empty;
    var cfg = MG.normalizeConfig(generatorConfig);
    if (!cfg.items || cfg.items.length === 0) return empty;
    var state = MG.createState(cfg, seed);
    var maxCount = count || generatorConfig.maxOutputCount || 10;
    var fr = MG.buildOutputBatch ? MG.buildOutputBatch(cfg, state, maxCount) : MG.fillQueue(cfg, state, maxCount);
    var produceState = fr.produceState || fr.state;
    return { queue: fr.queue, newSeed: produceState.seed };
};

// ====================================================================
//  生成器实�?ID / 功能棋子实例 ID
// ====================================================================

/**
 * 确定性生成器 instanceId：pieceId_0_seqNum
 * 扫描 boardData 中所有带 = �?instanceId 尾号，取最小空�?
 * 基于棋盘实际数据而非 generatorStates，避免泄漏的孤立状态导致前后端 seqNum 偏移
 */
MergeBoardLogic.generateInstanceId = function (generatorPieceId, boardData) {
    var usedNums = {};
    if (boardData) {
        for (var k in boardData) {
            var v = boardData[k];
            if (!v || typeof v !== 'string' || v.indexOf('=') === -1) continue;
            var cid = v.split('=')[1];
            if (cid && cid.indexOf('f_') === 0) continue;
            var parts = cid.split('_');
            var lastNum = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastNum)) usedNums[lastNum] = true;
        }
    }
    var seqNum = 1;
    while (usedNums[seqNum]) seqNum++;
    return generatorPieceId + '_0_' + seqNum;
};

/**
 * 确定性功能棋�?instanceId：f_pieceId_0_seqNum
 * 扫描 boardData 中已有的 f_ 前缀 instanceId，取最小空�?
 */
MergeBoardLogic.generateFuncPieceInstanceId = function (pieceId, boardData) {
    var usedNums = {};
    if (boardData) {
        for (var k in boardData) {
            var v = boardData[k];
            if (!v || typeof v !== 'string' || v.indexOf('=f_') === -1) continue;
            var fid = v.split('=')[1];
            var parts = fid.split('_');
            var lastNum = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastNum)) usedNums[lastNum] = true;
        }
    }
    var seqNum = 1;
    while (usedNums[seqNum]) seqNum++;
    return 'f_' + pieceId + '_0_' + seqNum;
};

// ====================================================================
//  生成器状态构�?
// ====================================================================

/**
 * 构建初始 generatorState
 * @param {Object} generatorConfig - configProvider.getGeneratorByMergeId 返回�?
 * @param {number} generatorId - 生成器棋�?ID
 * @param {number} queueSeed - 队列随机种子
 * @returns {Object} generatorState
 */
MergeBoardLogic.buildGeneratorState = function (generatorConfig, generatorId, queueSeed) {
    var maxOutputCount = generatorConfig.maxOutputCount || 10;
    var needCharge = MergeBoardLogic.parseNeedCharge(generatorConfig.needCharge);
    var chargeTime = generatorConfig.chargeTime || 0;
    var delayTime = generatorConfig.delayTime || 0;
    var onetimeDestroy = parseInt(generatorConfig.onetimeDestroy) === 1;
    var recoverCfg = MergeBoardLogic.parseGeneratorRecoverInterval(
        MergeBoardLogic.getGeneratorRecoverIntervalConfig(generatorConfig)
    );

    var state = {
        generatorId: generatorId,
        maxOutputCount: maxOutputCount,
        remainingCount: maxOutputCount,
        queue: [],
        needCharge: needCharge,
        chargeTime: chargeTime,
        delayTime: delayTime,
        onetimeDestroy: onetimeDestroy,
        nextRefillTime: 0,
        coolingStartTime: 0,
        lastRefillTime: 0,
        isCooling: false,
        queueSeed: queueSeed,
        produceState: null,
        producedCount: 0,
        interval: recoverCfg.raw,
        recoverInterval: recoverCfg.recoverInterval,
        recoverCount: recoverCfg.recoverCount,
        lastSmallRecoverTime: 0
    };
    // �?MergeGenerator 初始�?produceState 并填充首个队�?
    MergeBoardLogic.refillGeneratorQueue(state, generatorConfig);
    return state;
};

// ====================================================================
//  棋盘效果：气泡奖�?& 沙子转换
// ====================================================================

/**
 * 推进指定格子周围的沙�?障碍物状态（合成触发，基�?SAND_ADVANCE_MAP 查找表）
 * 全沙(0-3)→半�?4)，全�?6/7)→半�?5)，半�?4/5)→消�?-1)
 */
MergeBoardLogic.advanceSandStatus = function (boardData, cellKey) {
    var coords = MergeBoardLogic.parseCellKey(cellKey);
    if (!coords) return;

    var DIRS = MergeBoardLogic.DIRECTIONS;
    var advanceMap = MergeBoardLogic.SAND_ADVANCE_MAP;
    for (var i = 0; i < DIRS.length; i++) {
        var nearCol = coords.col + DIRS[i].dc;
        var nearRow = coords.row + DIRS[i].dr;
        if (!MergeBoardLogic.isInBounds(nearCol, nearRow)) continue;

        var nearKey = nearCol + '_' + nearRow;
        var nearData = boardData[nearKey];
        if (!nearData) continue;

        var parsed = MergeBoardLogic.parsePieceData(nearData);
        if (!parsed) continue;
        // 有气泡的格子不推进沙子状态（气泡优先，等下一次合成触发气泡解锁）
        if (parsed.bubbleRewardId !== -1) continue;
        if (!advanceMap.hasOwnProperty(parsed.status)) continue;

        var nextStatus = advanceMap[parsed.status];
        var instancePart = parsed.instanceId ? ('=' + parsed.instanceId) : '';
        boardData[nearKey] = parsed.pieceId + '_' + nextStatus + '_' + parsed.bubbleRewardId + instancePart;
    }
};

/**
 * 检查并解锁气泡奖励（合成后调用�?
 * @returns {{ count: number }}
 */
MergeBoardLogic.checkAndUnlockBubbleRewards = function (boardData, cellKey, pendingRewards) {
    if (!boardData || !cellKey) return { count: 0 };
    var coords = MergeBoardLogic.parseCellKey(cellKey);
    if (!coords) return { count: 0 };

    if (!pendingRewards) pendingRewards = {};
    var count = 0;
    var PS = MergeBoardLogic.PIECE_STATUS;
    var DIRS = MergeBoardLogic.DIRECTIONS;

    var advanceMap = MergeBoardLogic.SAND_ADVANCE_MAP;

    for (var i = 0; i < DIRS.length; i++) {
        var nearCol = coords.col + DIRS[i].dc;
        var nearRow = coords.row + DIRS[i].dr;
        if (!MergeBoardLogic.isInBounds(nearCol, nearRow)) continue;

        var nearKey = nearCol + '_' + nearRow;
        var nearData = boardData[nearKey];
        if (!nearData) continue;

        var parsed = MergeBoardLogic.parsePieceData(nearData);
        if (!parsed) continue;

        var instancePart = parsed.instanceId ? ('=' + parsed.instanceId) : '';

        if (parsed.bubbleRewardId !== -1) {
            var pieceData = parsed.bubbleRewardId + '_' + PS.NORMAL + '_' + PS.NORMAL;
            var rewardIndex = 0;
            while (pendingRewards[rewardIndex] !== undefined) rewardIndex++;
            pendingRewards[rewardIndex] = { t: 'piece', d: pieceData };
            count++;
            // 全沙状态（0-3/6/7）在解锁气泡的同时推进为半沙�?/5�?
            var newStatus = parsed.status;
            if (advanceMap.hasOwnProperty(parsed.status) && advanceMap[parsed.status] !== -1) {
                newStatus = advanceMap[parsed.status];
            }
            boardData[nearKey] = parsed.pieceId + '_' + newStatus + '_' + PS.NORMAL + instancePart;
        } else if (advanceMap.hasOwnProperty(parsed.status)) {
            // 无气泡且有障碍物状态：推进沙子/障碍物状�?
            var nextStatus = advanceMap[parsed.status];
            boardData[nearKey] = parsed.pieceId + '_' + nextStatus + '_' + parsed.bubbleRewardId + instancePart;
        }
    }

    return { count: count };
};

// ====================================================================
//  资源追踪（前端批量操作本地校验）
// ====================================================================

/**
 * 解析消耗字符串 "type=cid=count" �?{ type, cid, count }
 * 兼容 Content.FromString 格式，如 "2=0=1" 表示消�?1 点体�?
 * @param {string} str - 消耗配置字符串
 * @returns {{ type: number, cid: number, count: number } | null}
 */
MergeBoardLogic.parseConsumeString = function (str) {
    var list = MergeBoardLogic.parseConsumeList(str);
    return list.length > 0 ? list[0] : null;
};

MergeBoardLogic.parseConsumeList = function (value) {
    var util = MergeBoardLogic._getMergeContentUtil();
    if (util && util.normalizeList) return util.normalizeList(value, 7);
    if (!value) return [];
    try {
        var s = String(value).trim();
        if (s === '' || s === '0') return [];
        if (s.indexOf(';') !== -1) {
            var merged = [];
            var chunks = s.split(';');
            for (var i = 0; i < chunks.length; i++) merged = merged.concat(MergeBoardLogic.parseConsumeList(chunks[i]));
            return merged;
        }
        if (s.indexOf('=') === -1) {
            var amount = parseFloat(s);
            if (isNaN(amount) || amount <= 0) return [];
            return [{ type: 7, cid: 0, count: amount }];
        }
        var parts = s.split('=');
        if (parts.length < 3) return [];
        var type = parseInt(parts[0]);
        var cid = parseInt(parts[1]);
        var count = parseFloat(parts[2]);
        if (isNaN(type) || isNaN(cid) || isNaN(count) || count <= 0) return [];
        return [{ type: type, cid: cid, count: count }];
    } catch (e) {
        return [];
    }
};

MergeBoardLogic.normalizeConsumeString = function (value) {
    var util = MergeBoardLogic._getMergeContentUtil();
    if (util && util.toContentString) return util.toContentString(value, 7);
    var list = MergeBoardLogic.parseConsumeList(value);
    var result = [];
    for (var i = 0; i < list.length; i++) {
        result.push(list[i].type + '=' + list[i].cid + '=' + list[i].count);
    }
    return result.join(';');
};

/**
 * 校验并扣除本地资源（仅当 boardState.resources 存在时生效）
 *
 * boardState.resources 格式: { "type_cid": balance }
 *   �? { "2_0": 50 } 表示体力(type=2, cid=0)余额 50
 *
 * 前端在批量操作前初始化此字段，共享逻辑每次 generate 自动扣除�?
 * 余额不足时直接返回失败，避免向服务器发出注定失败的请求�?
 * 服务器不设置此字段，仍走原有�?_handleGenerateResource 流程�?
 *
 * @param {Object} boardState - 必须含有 resources 字段才会生效
 * @param {string} consumeStr - 消耗字符串 "type=cid=count"
 * @returns {{ success: boolean, errorCode?: string, errorMsg?: string }}
 */
MergeBoardLogic.checkAndDeductResource = function (boardState, consumeStr) {
    var consume = MergeBoardLogic.parseConsumeString(consumeStr);
    if (!consume) return { success: true };

    
    
    var resources = boardState.resources;
    if (!resources) return { success: true };

    var key = consume.type + '_' + consume.cid;
    var current = resources[key];

    if (current === undefined || current === null) current = 0;

    if (current < consume.count) {
        return {
            success: false,
            errorCode: 'RESOURCE_NOT_ENOUGH',
            errorMsg: '资源不足',
            resourceType: consume.type,
            resourceCid: consume.cid,
            required: consume.count,
            current: current
        };
    }

    resources[key] = current - consume.count;
    return { success: true, newBalance: resources[key] };
};

MergeBoardLogic.normalizeObtainedPieces = function (obtainedPieces) {
    var ids = {};
    if (Array.isArray(obtainedPieces)) {
        for (var i = 0; i < obtainedPieces.length; i++) {
            var id = parseInt(obtainedPieces[i]);
            if (!isNaN(id) && id > 0) ids[id] = true;
        }
    } else if (obtainedPieces && typeof obtainedPieces === 'object') {
        for (var k in obtainedPieces) {
            var keyId = parseInt(k);
            var valueId = parseInt(obtainedPieces[k]);
            if (!isNaN(keyId) && keyId > 0) ids[keyId] = true;
            else if (!isNaN(valueId) && valueId > 0) ids[valueId] = true;
        }
    }
    var list = [];
    for (var idKey in ids) list.push(parseInt(idKey));
    list.sort(function (a, b) { return a - b; });
    return list;
};

MergeBoardLogic.ensureObtainedPieces = function (boardState) {
    if (!boardState) return [];
    boardState.obtainedPieces = MergeBoardLogic.normalizeObtainedPieces(boardState.obtainedPieces);
    return boardState.obtainedPieces;
};

MergeBoardLogic.extractObtainedPieceId = function (pieceData) {
    var parsed = MergeBoardLogic.parsePieceData(pieceData);
    if (!parsed || isNaN(parsed.pieceId) || parsed.pieceId <= 0) return null;
    if (parsed.status !== MergeBoardLogic.PIECE_STATUS.NORMAL) return null;
    return parsed.pieceId;
};

MergeBoardLogic.recordObtainedPiece = function (boardState, pieceData) {
    var pieceId = MergeBoardLogic.extractObtainedPieceId(pieceData);
    if (!pieceId) return false;
    var obtainedPieces = MergeBoardLogic.ensureObtainedPieces(boardState);
    for (var i = 0; i < obtainedPieces.length; i++) {
        if (obtainedPieces[i] === pieceId) return false;
    }
    obtainedPieces.push(pieceId);
    obtainedPieces.sort(function (a, b) { return a - b; });
    return true;
};

MergeBoardLogic.recordObtainedPieces = function (boardState, pieceDatas) {
    if (!Array.isArray(pieceDatas)) pieceDatas = [pieceDatas];
    var changed = false;
    for (var i = 0; i < pieceDatas.length; i++) {
        changed = MergeBoardLogic.recordObtainedPiece(boardState, pieceDatas[i]) || changed;
    }
    return changed;
};

// ====================================================================
//  辅助：结果对象工�?
// ====================================================================

function _baseResult(boardState): any {
    return {
        success: false,
        errorCode: '',
        errorMsg: '',
        boardState: boardState,
        sideEffects: []
    };
}

/**
 * 操作成功后的统一后处理：自动更新订单进度（matchedCells / completed�?
 * 只要 boardState.orderData 存在，就�?MergeOrderLogic 重新计算
 * 同时检�?boardState.warehouse（如果存在）以匹配仓库中的棋�?
 * 前后端共用此函数，保证订单进度始终与棋盘数据同步
 */
function _postProcessResult(result: any) {
    if (!result.success) return result;
    var bs = result.boardState;
    if (!bs || !bs.orderData || !bs.orderData.orders || bs.orderData.orders.length === 0) return result;
    try {
        var MergeOrderLogic = MergeBoardLogic._getMergeOrderLogic();
        if (MergeOrderLogic) {
            MergeOrderLogic.checkAllOrderProgress(bs.data, bs.warehouse || null, bs.orderData);
        }
    } catch (e) { }
    return result;
}

// ====================================================================
//  核心操作：移�?
// ====================================================================

/**
 * Claim one pending piece reward onto the board.
 */
MergeBoardLogic.claimPendingReward = function (boardState, rewardIndex, targetCellKey, configProvider) {
    var result = _baseResult(boardState);
    if (!boardState || !boardState.data) {
        result.errorCode = 'INVALID_BOARD';
        result.errorMsg = 'invalid board';
        return result;
    }

    var pendingRewards = MergeBoardLogic.normalizePendingRewards(boardState);
    if (rewardIndex === undefined || rewardIndex === null || rewardIndex === '') {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'missing rewardIndex';
        return result;
    }

    var key = String(rewardIndex);
    var reward = MergeBoardLogic.parsePendingRewardEntry(pendingRewards[key]);
    if (reward === undefined || reward === null) {
        result.errorCode = 'REWARD_NOT_FOUND';
        result.errorMsg = 'pending reward not found';
        return result;
    }
    pendingRewards[key] = reward;
    if (reward.t !== 'piece') {
        if (reward.t === 'content' || reward.t === 'pack' || reward.t === 'cardChest') {
            delete pendingRewards[key];
            boardState.lastRemovedPiece = null;
            result.success = true;
            result.reward = reward;
            result.rewardIndex = key;
            result.pendingRewards = pendingRewards;
            result.content = reward.d;
            result.sideEffects.push({
                type: reward.t === 'cardChest' ? 'claimPendingCardChest' : 'claimPendingContent',
                params: { content: reward.d, rewardType: reward.t }
            });
            return _postProcessResult(result);
        }
        result.errorCode = 'UNSUPPORTED_REWARD_TYPE';
        result.errorMsg = 'unsupported pending reward type';
        result.reward = reward;
        result.rewardIndex = key;
        return result;
    }

    var target = null;
    if (targetCellKey) {
        var coords = MergeBoardLogic.parseCellKey(targetCellKey);
        if (!coords || !MergeBoardLogic.isInBounds(coords.col, coords.row)) {
            result.errorCode = 'INVALID_PARAMS';
            result.errorMsg = 'invalid target cell';
            return result;
        }
        target = { col: coords.col, row: coords.row, key: coords.col + '_' + coords.row };
    } else {
        target = MergeBoardLogic.findNextEmptyCell(boardState.data);
    }
    if (!target) {
        result.errorCode = 'BOARD_FULL';
        result.errorMsg = 'board full';
        return result;
    }
    if (boardState.data[target.key]) {
        result.errorCode = 'CELL_OCCUPIED';
        result.errorMsg = 'target cell occupied';
        return result;
    }

    var pieceData = reward.d;
    var parsed = MergeBoardLogic.parsePieceData(pieceData);
    if (!parsed || isNaN(parsed.pieceId) || parsed.pieceId <= 0) {
        result.errorCode = 'INVALID_REWARD_DATA';
        result.errorMsg = 'invalid pending reward data';
        return result;
    }

    if (!boardState.generatorStates || typeof boardState.generatorStates !== 'object') {
        boardState.generatorStates = {};
    }
    if (!parsed.instanceId && configProvider) {
        var generatorConfig = configProvider.getGeneratorByMergeId ? configProvider.getGeneratorByMergeId(parsed.pieceId) : null;
        var meta = configProvider.getElementMeta ? configProvider.getElementMeta(parsed.pieceId) : null;
        if (generatorConfig || MergeBoardLogic.needsFuncInstance(meta)) {
            var placed = MergeBoardLogic.buildPlacedPieceData(parsed.pieceId, boardState, configProvider, key + ':' + target.key);
            var placedParsed = MergeBoardLogic.parsePieceData(placed.pieceData);
            var instancePart = placedParsed && placedParsed.instanceId ? ('=' + placedParsed.instanceId) : '';
            pieceData = parsed.pieceId + '_' + parsed.status + '_' + parsed.bubbleRewardId + instancePart;
        }
    }

    boardState.data[target.key] = pieceData;
    delete pendingRewards[key];
    boardState.lastRemovedPiece = null;
    MergeBoardLogic.recordObtainedPiece(boardState, pieceData);

    result.success = true;
    result.reward = reward;
    result.rewardIndex = key;
    result.cellKey = target.key;
    result.pieceData = pieceData;
    result.pendingRewards = pendingRewards;
    return _postProcessResult(result);
};

/**
 * 移动棋子（支持单步移动和交换�?
 * @param {Object} boardState
 * @param {string} fromCellKey - 源位�?
 * @param {string} toCellKey   - 目标位置
 * @returns {OperationResult}
 */
MergeBoardLogic.move = function (boardState, fromCellKey, toCellKey) {
    var result = _baseResult(boardState);
    var boardData = boardState.data;

    if (!fromCellKey || !toCellKey) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '缺少位置参数';
        return result;
    }

    var fromCell = MergeBoardLogic.resolveCell(boardData, fromCellKey);
    if (!fromCell) {
        result.errorCode = 'PIECE_NOT_FOUND';
        result.errorMsg = 'piece not found';
        return result;
    }

    var toCoords = MergeBoardLogic.parseCellKey(toCellKey);
    if (!toCoords || !MergeBoardLogic.isInBounds(toCoords.col, toCoords.row)) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '目标位置无效';
        return result;
    }
    var toKey = toCoords.col + '_' + toCoords.row;

    if (fromCell.key === toKey) {
        result.success = true;
        return _postProcessResult(result);
    }

    if (boardData[toKey]) {
        var temp = boardData[toKey];
        boardData[toKey] = fromCell.data;
        boardData[fromCell.key] = temp;
    } else {
        boardData[toKey] = fromCell.data;
        boardData[fromCell.key] = null;
    }

    boardState.lastRemovedPiece = null;
    result.success = true;
    return _postProcessResult(result);
};

/**
 * 批量移动
 * @param {Object} boardState
 * @param {Array<{fromKey:string, toKey:string}>} moves
 * @returns {OperationResult}
 */
MergeBoardLogic.batchMove = function (boardState, moves) {
    var result = _baseResult(boardState);
    if (!Array.isArray(moves) || moves.length === 0) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '缺少移动列表';
        return result;
    }
    for (var i = 0; i < moves.length; i++) {
        var m = moves[i];
        var sub = MergeBoardLogic.move(boardState, m.fromKey, m.toKey);
        if (!sub.success) {
            result.errorCode = sub.errorCode;
            result.errorMsg = 'move step ' + (i + 1) + ' failed: ' + sub.errorMsg;
            return result;
        }
    }
    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  核心操作：合�?
// ====================================================================

/**
 * 合成两个相同棋子
 * @param {Object} boardState
 * @param {string} cellKey1 - 被拖拽棋子位�?
 * @param {string} cellKey2 - 目标棋子位置（合成后新棋子放在此处）
 * @param {Object} configProvider
 * @returns {OperationResult} 附加字段: generatorCreated
 */
MergeBoardLogic.merge = function (boardState, cellKey1, cellKey2, configProvider) {
    var result = _baseResult(boardState);
    result.generatorCreated = null;
    result.cutPieces = null;
    result.degradedScissors = null;

    var boardData = boardState.data;

    boardState.lastRemovedPiece = null;

    // ---------- 参数校验 ----------
    if (!cellKey1 || !cellKey2) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '缺少棋子位置参数';
        return result;
    }
    if (cellKey1 === cellKey2) {
        result.errorCode = 'MERGE_SAME_CELL';
        result.errorMsg = 'cannot merge the same cell';
        return result;
    }

    var r1 = MergeBoardLogic.resolveCell(boardData, cellKey1);
    var r2 = MergeBoardLogic.resolveCell(boardData, cellKey2);
    if (r1 && r2 && (MergeBoardLogic.isBubblePieceData(r1.data) || MergeBoardLogic.isBubblePieceData(r2.data))) {
        result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
        result.errorMsg = 'bubble piece cannot merge';
        return result;
    }
    if (!r1 || !r2) {
        result.errorCode = 'PIECE_NOT_FOUND';
        result.errorMsg = 'piece not found';
        return result;
    }
    if (r1.key === r2.key) {
        result.errorCode = 'MERGE_SAME_CELL';
        result.errorMsg = 'cannot merge the same cell';
        return result;
    }
    // ---------- 解析棋子 ----------
    var piece1Base = r1.data.split('=')[0];
    var piece2Base = r2.data.split('=')[0];
    var oldInstanceId1 = r1.data.indexOf('=') !== -1 ? r1.data.split('=')[1] : null;
    var oldInstanceId2 = r2.data.indexOf('=') !== -1 ? r2.data.split('=')[1] : null;

    var p1Parts = piece1Base.split('_');
    var p2Parts = piece2Base.split('_');

    if (p1Parts.length < 3 || p2Parts.length < 3) {
        result.errorCode = 'PARSE_PIECE_ERROR';
        result.errorMsg = '棋子数据解析失败';
        return result;
    }

    var pieceId1 = parseInt(p1Parts[0]);
    var pieceId2 = parseInt(p2Parts[0]);
    var meta1 = configProvider.getElementMeta(pieceId1);
    var meta2 = configProvider.getElementMeta(pieceId2);
    var isScissors1 = meta1 && meta1.funcType === 'scissors';
    var isScissors2 = meta2 && meta2.funcType === 'scissors';
    if ((isScissors1 || isScissors2) && !(isScissors1 && isScissors2)) {
        var scissorsMeta = isScissors1 ? meta1 : meta2;
        var scissorsPieceId = isScissors1 ? pieceId1 : pieceId2;
        var scissorsKey = isScissors1 ? r1.key : r2.key;
        var targetKey = isScissors1 ? r2.key : r1.key;
        var targetMeta = isScissors1 ? meta2 : meta1;
        var targetPieceId = isScissors1 ? pieceId2 : pieceId1;
        if (!targetMeta) {
            result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
            result.errorMsg = 'piece config not found';
            return result;
        }
        if (!MergeBoardLogic.isTruthyConfig(targetMeta.ifCanCut)) {
            result.errorCode = 'CANNOT_CUT';
            result.errorMsg = 'piece cannot be cut';
            return result;
        }

        var prePieceId = targetMeta.preId;
        if (!prePieceId || prePieceId === -1 || prePieceId === '-1') {
            result.errorCode = 'MIN_LEVEL_REACHED';
            result.errorMsg = 'level 1 piece cannot be cut';
            return result;
        }
        prePieceId = parseInt(prePieceId);
        if (isNaN(prePieceId)) {
            result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
            result.errorMsg = 'piece config not found';
            return result;
        }

        var scissorsPrePieceId = scissorsMeta ? scissorsMeta.preId : null;
        var shouldDegradeScissors = scissorsPrePieceId && scissorsPrePieceId !== -1 && scissorsPrePieceId !== '-1';
        var extraCell = null;
        if (shouldDegradeScissors) {
            var except = {};
            except[r1.key] = true;
            except[r2.key] = true;
            extraCell = MergeBoardLogic.findNextEmptyCellExcept(boardData, except);
            if (!extraCell) {
                result.errorCode = 'BOARD_FULL';
                result.errorMsg = 'board is full';
                return result;
            }
            scissorsPrePieceId = parseInt(scissorsPrePieceId);
            if (isNaN(scissorsPrePieceId)) {
                result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
                result.errorMsg = 'piece config not found';
                return result;
            }
        }

        boardData[r1.key] = null;
        boardData[r2.key] = null;
        if (oldInstanceId1) delete boardState.generatorStates[oldInstanceId1];
        if (oldInstanceId2) delete boardState.generatorStates[oldInstanceId2];

        var cut1 = MergeBoardLogic.buildPlacedPieceData(prePieceId, boardState, configProvider, r1.key + ':' + targetPieceId + ':cut1');
        var cut2 = MergeBoardLogic.buildPlacedPieceData(prePieceId, boardState, configProvider, r2.key + ':' + targetPieceId + ':cut2');
        var cut2Key = shouldDegradeScissors ? extraCell.key : scissorsKey;
        boardData[targetKey] = cut1.pieceData;
        boardData[cut2Key] = cut2.pieceData;

        result.cutPieces = [
            { cellKey: targetKey, pieceData: cut1.pieceData },
            { cellKey: cut2Key, pieceData: cut2.pieceData }
        ];
        if (shouldDegradeScissors) {
            var degradedScissors = MergeBoardLogic.buildPlacedPieceData(scissorsPrePieceId, boardState, configProvider, scissorsKey + ':' + scissorsPieceId + ':degrade');
            boardData[scissorsKey] = degradedScissors.pieceData;
            result.degradedScissors = { cellKey: scissorsKey, pieceData: degradedScissors.pieceData };
        }
        var cutBubble1 = MergeBoardLogic.checkAndUnlockBubbleRewards(boardData, targetKey, boardState.pendingRewards);
        var cutBubble2 = MergeBoardLogic.checkAndUnlockBubbleRewards(boardData, cut2Key, boardState.pendingRewards);
        var cutBubbleCount = (cutBubble1.count || 0) + (cutBubble2.count || 0);
        if (cutBubbleCount > 0) {
            result.sideEffects.push({ type: 'popBubble', params: { count: cutBubbleCount } });
        }
        result.sideEffects.push({ type: 'recordMerge', params: { count: 1 } });
        result.success = true;
        return _postProcessResult(result);
    }
    if (pieceId1 !== pieceId2) {
        result.errorCode = 'MERGE_TYPE_MISMATCH';
        result.errorMsg = '棋子类型不匹配，无法合成';
        return result;
    }

    // ---------- 查配�?----------
    var currentMeta = meta1;
    if (!currentMeta) {
        result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
        result.errorMsg = 'piece config not found';
        return result;
    }
    var nextPieceId = currentMeta.nextId;
    if (!nextPieceId || nextPieceId === -1 || nextPieceId === '-1') {
        result.errorCode = 'MAX_LEVEL_REACHED';
        result.errorMsg = '已达到最高等级，无法继续合成';
        return result;
    }

    // ---------- 清空被合成格�?----------
    boardData[r1.key] = null;
    boardData[r2.key] = null;

    // ---------- 清理旧生成器状态（两个棋子都被消耗，无条件删除） ----------
    if (oldInstanceId1) {
        delete boardState.generatorStates[oldInstanceId1];
    }
    if (oldInstanceId2) {
        delete boardState.generatorStates[oldInstanceId2];
    }

    // ---------- 构建新棋�?----------
    var newPieceData = nextPieceId + '_-1_-1';
    var currentTime = configProvider.getCurrentTime();

    var generatorConfig = configProvider.getGeneratorByMergeId(nextPieceId);
    var nextMeta = null;
    if (generatorConfig) {
        var instanceId = MergeBoardLogic.generateInstanceId(nextPieceId, boardData);
        newPieceData += '=' + instanceId;

        var queueSeed = MergeBoardLogic.seedFromString(r1.key + ':' + r2.key + ':' + nextPieceId);
        var generatorState = MergeBoardLogic.buildGeneratorState(generatorConfig, nextPieceId, queueSeed);
        boardState.generatorStates[instanceId] = generatorState;
        // InitialSequence inheritance: low generator remainder comes before the new generator's sequence.
        MergeBoardLogic.inheritInitialSequence(boardState, pieceId1, nextPieceId, generatorConfig);

        result.generatorCreated = {
            cellKey: r1.key,
            instanceId: instanceId,
            generatorId: nextPieceId,
            maxOutputCount: generatorState.maxOutputCount,
            needCharge: generatorState.needCharge,
            chargeTime: generatorState.chargeTime,
            delayTime: generatorState.delayTime,
            onetimeDestroy: generatorState.onetimeDestroy,
            remainingCount: generatorState.maxOutputCount,
            nextRefillTime: 0,
            lastRefillTime: 0,
            isCooling: false
        };
    } else {
        nextMeta = configProvider.getElementMeta(nextPieceId);
        if (nextMeta && (nextMeta.funcType === 'threeToOneType' || nextMeta.funcType === 'threeToOneOrder')) {
            newPieceData += '=' + MergeBoardLogic.generateFuncPieceInstanceId(nextPieceId, boardData);
        }
    }

    boardData[r1.key] = newPieceData;
    MergeBoardLogic.recordObtainedPiece(boardState, newPieceData);

    // ---------- 气泡奖励 ----------
    var bubbleResult = MergeBoardLogic.checkAndUnlockBubbleRewards(boardData, r1.key, boardState.pendingRewards);
    if (bubbleResult.count > 0) {
        result.sideEffects.push({ type: 'popBubble', params: { count: bubbleResult.count } });
    }

    if (!generatorConfig) {
        if (!nextMeta) nextMeta = configProvider.getElementMeta(nextPieceId);
        MergeBoardLogic.createBubbleAfterMerge(result, boardState, r1.key, nextPieceId, nextMeta, configProvider, r1.key + ':' + r2.key + ':' + nextPieceId);
    }

    result.sideEffects.push({ type: 'recordMerge', params: { count: 1 } });

    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  核心操作：点击生成器
// ====================================================================

/**
 * 点击生成器产出棋�?
 * @param {Object} boardState
 * @param {Object} params - { instanceId?, generatorCellKey?, targetCellKey }
 *   instanceId �?generatorCellKey 二选一；优�?generatorCellKey（更可靠�?
 * @param {Object} configProvider
 * @returns {OperationResult} 附加字段: produced, generatedPieceId, cooling, remainingTime,
 *          generatorExploded, generatorCellKey, resourceRequired
 */
MergeBoardLogic.generate = function (boardState, params, configProvider) {
    var result = _baseResult(boardState);
    result.produced = false;
    result.generatedPieceId = null;
    result.cooling = false;
    result.remainingTime = 0;
    result.generatorExploded = false;
    result.generatorCellKey = null;
    result.resourceRequired = null;
    result.generatedPieceData = null;
    result.generatedCellKey = null;

    var boardData = boardState.data;
    boardState.lastRemovedPiece = null;

    // ---------- 解析参数 ----------
    var instanceId = params.instanceId || null;
    var targetCellKey = params.targetCellKey;

    // 优先�?generatorCellKey 提取 instanceId（棋盘格子上的值是服务端权威值，
    // 前后�?Math.random() 不一致会导致合成产生的新生成�?instanceId 不匹配）
    if (params.generatorCellKey) {
        var gCell = MergeBoardLogic.resolveCell(boardData, params.generatorCellKey);
        if (gCell && gCell.data && gCell.data.indexOf('=') !== -1) {
            instanceId = gCell.data.split('=')[1];
        }
    }

    if (!instanceId) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'missing generator id';
        return result;
    }
    if (!targetCellKey) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '缺少目标位置';
        return result;
    }

    var generatorState = boardState.generatorStates[instanceId];
    if (!generatorState && instanceId) {
        // 回退：前端传�?instanceId �?Math.random() 不一致而找不到�?
        // 从棋盘中�?pieceId 前缀扫描，如果恰好唯一匹配则采�?
        var prefix = instanceId.split('_')[0];
        var candidates = [];
        for (var key in boardData) {
            var cd = boardData[key];
            if (!cd || cd.indexOf('=') === -1) continue;
            var cid = cd.split('=')[1];
            if (cid && cid.split('_')[0] === prefix && boardState.generatorStates[cid]) {
                candidates.push(cid);
            }
        }
        if (candidates.length === 1) {
            instanceId = candidates[0];
            generatorState = boardState.generatorStates[instanceId];
        }
    }
    if (!generatorState) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '生成器不存在';
        return result;
    }

    if (!generatorState.generatorId) {
        generatorState.generatorId = MergeBoardLogic.resolveGeneratorIdFromBoard(boardData, instanceId);
    }

    var generatorConfig = configProvider.getGeneratorByMergeId(generatorState.generatorId);
    if (!generatorConfig) {
        result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
        result.errorMsg = '生成器配置不存在';
        return result;
    }

    MergeBoardLogic.syncGeneratorRecoverConfig(generatorState, generatorConfig);
    MergeBoardLogic.ensureInitialSequence(boardState, generatorState.generatorId, generatorConfig);

    var currentTime = configProvider.getCurrentTime();
    var needCharge = MergeBoardLogic.parseNeedCharge(generatorConfig.needCharge);
    var onetimeDestroy = parseInt(generatorConfig.onetimeDestroy) === 1;
    var delayTime = generatorConfig.delayTime || 0;

    // ---------- 充能型：时间到自动刷�?----------
    if (needCharge && generatorState.nextRefillTime > 0 && currentTime >= generatorState.nextRefillTime) {
        MergeBoardLogic.refillGeneratorQueue(generatorState, generatorConfig);
        generatorState.remainingCount = generatorState.maxOutputCount;
        generatorState.lastRefillTime = currentTime;
        generatorState.nextRefillTime = 0;
        generatorState.coolingStartTime = 0;
        generatorState.lastSmallRecoverTime = 0;
    }

    MergeBoardLogic.applyGeneratorSmallRecover(generatorState, generatorConfig, currentTime);

    // ---------- 一次性宝箱：倒计时结�?----------
    if (generatorState.delayTime === undefined) generatorState.delayTime = delayTime;
    var delayCountdownJustFinished = false;
    if (!needCharge && onetimeDestroy && delayTime > 0 &&
        generatorState.nextRefillTime > 0 && currentTime >= generatorState.nextRefillTime) {
        generatorState.nextRefillTime = 0;
        delayCountdownJustFinished = true;
    }

    // ---------- 补充队列 ----------
    if (!generatorState.queue || generatorState.queue.length <= 0) {
        MergeBoardLogic.refillGeneratorQueue(generatorState, generatorConfig);
    }

    // ---------- 检查剩余次�?----------
    if (generatorState.remainingCount <= 0) {
        if (onetimeDestroy) {
            // 爆炸销�?
            for (var ck in boardData) {
                if (boardData[ck] && boardData[ck].indexOf('=' + instanceId) !== -1) {
                    result.generatorCellKey = ck;
                    boardData[ck] = null;
                    break;
                }
            }
            delete boardState.generatorStates[instanceId];
            result.generatorExploded = true;
            result.success = true;
            return _postProcessResult(result);
        }
        if (!needCharge) {
            MergeBoardLogic.refillGeneratorQueue(generatorState, generatorConfig);
            generatorState.remainingCount = generatorState.maxOutputCount;
        } else {
            if (generatorState.nextRefillTime <= 0) {
                generatorState.nextRefillTime = currentTime + (generatorState.chargeTime || 0);
                generatorState.coolingStartTime = currentTime;
                generatorState.lastSmallRecoverTime = 0;
            }
            result.cooling = true;
            result.remainingTime = Math.ceil(generatorState.nextRefillTime - currentTime);
            result.success = true;
            return _postProcessResult(result);
        }
    }

    // ---------- 一次性宝箱倒计时进行中 ----------
    if (!needCharge && onetimeDestroy && delayTime > 0 &&
        generatorState.nextRefillTime > 0 && currentTime < generatorState.nextRefillTime) {
        result.success = true;
        return _postProcessResult(result);
    }

    // ---------- 一次性宝箱开启倒计�?----------
    if (!delayCountdownJustFinished && !needCharge && onetimeDestroy && delayTime > 0 &&
        generatorState.nextRefillTime === 0 &&
        generatorState.remainingCount === generatorState.maxOutputCount) {
        generatorState.nextRefillTime = currentTime + delayTime;
        generatorState.coolingStartTime = currentTime;
        result.success = true;
        return _postProcessResult(result);
    }

    // ---------- 资源消耗（标记给服务器执行�?----------
    var consumeCountStr = MergeBoardLogic.normalizeConsumeString(generatorConfig.consumeCount);
    if (consumeCountStr) {
        result.resourceRequired = { consumeStr: consumeCountStr };
    }

    // ---------- 本地资源校验（boardState.resources 存在时生效） ----------
    if (result.resourceRequired) {
        var resCheck = MergeBoardLogic.checkAndDeductResource(boardState, result.resourceRequired.consumeStr);
        if (!resCheck.success) {
            result.errorCode = resCheck.errorCode;
            result.errorMsg = resCheck.errorMsg;
            return result;
        }
    }

    // ---------- 目标位置检�?----------
    if (boardData[targetCellKey]) {
        result.errorCode = 'CELL_OCCUPIED';
        result.errorMsg = '位置 ' + targetCellKey + ' 已被占用';
        return result;
    }

    // ---------- 决定产出棋子：初始序列优先（ID共享），其次队列 ----------
    var generatedPieceId;
    var initHead = MergeBoardLogic.peekInitialSequence(boardState, generatorState.generatorId);
    if (initHead != null) {
        // 走初始序列：消耗共享初始序列，不动实例队列
        generatedPieceId = MergeBoardLogic.shiftInitialSequence(boardState, generatorState.generatorId);
    } else if (params.generatedPieceId != null) {
        // 前端传入 generatedPieceId 时以前端为准（与 UI 预览�?queue[0] 同步�?
        generatedPieceId = parseInt(params.generatedPieceId);
        if (generatorState.queue && generatorState.queue.length > 0) {
            generatorState.queue.shift();
        }
    } else {
        if (!generatorState.queue || generatorState.queue.length <= 0) {
            MergeBoardLogic.refillGeneratorQueue(generatorState, generatorConfig);
        }
        generatedPieceId = generatorState.queue.shift();
    }
    if (generatedPieceId == null || isNaN(parseInt(generatedPieceId))) {
        result.errorCode = 'GENERATOR_QUEUE_EMPTY';
        result.errorMsg = 'generator output queue is empty';
        return result;
    }
    generatedPieceId = parseInt(generatedPieceId);
    generatorState.remainingCount--;
    generatorState.producedCount = (parseInt(generatorState.producedCount) || 0) + 1;

    var generatedPieceData = generatedPieceId + '_-1_-1';
    boardData[targetCellKey] = generatedPieceData;
    MergeBoardLogic.recordObtainedPiece(boardState, generatedPieceData);
    result.produced = true;
    result.generatedPieceId = generatedPieceId;
    result.generatedPieceData = generatedPieceData;
    result.generatedCellKey = targetCellKey;

    var generatedMeta = configProvider.getElementMeta ? configProvider.getElementMeta(generatedPieceId) : null;
    var sourceGeneratorMeta = null;
    var bubbleMetaSourceName = 'generator';
    if (MergeBoardLogic.hasMetaBubbleRate(generatorConfig)) {
        sourceGeneratorMeta = {};
        for (var gcKey in generatorConfig) sourceGeneratorMeta[gcKey] = generatorConfig[gcKey];
        sourceGeneratorMeta.id = generatorState.generatorId;
        sourceGeneratorMeta.preferBubbleRewardConfig = true;
        bubbleMetaSourceName = 'generatorConfig';
    } else {
        sourceGeneratorMeta = configProvider.getElementMeta ? configProvider.getElementMeta(generatorState.generatorId) : null;
    }
    var bubbleMetaResult = MergeBoardLogic.resolveBubbleMeta(generatedMeta, sourceGeneratorMeta, bubbleMetaSourceName);
    var bubbleMeta = bubbleMetaResult.meta;
    var bubbleMetaSource = bubbleMetaResult.source;
    MergeBoardLogic.createBubbleAfterMerge(
        result,
        boardState,
        targetCellKey,
        generatedPieceId,
        bubbleMeta,
        configProvider,
        instanceId + ':' + targetCellKey + ':' + generatedPieceId + ':' + generatorState.producedCount + ':' + (generatorState.queueSeed || 0),
        {
            metaSource: bubbleMetaSource,
            metaPieceId: bubbleMeta && bubbleMeta.id,
            bubbleRateSourceId: bubbleMeta && bubbleMeta.bubbleRateSourceId,
            sourceGeneratorId: generatorState.generatorId
        }
    );

    // ---------- 充能型用完设置冷�?----------
    if (needCharge && generatorState.remainingCount === 0) {
        if (generatorState.coolingStartTime === 0) generatorState.coolingStartTime = currentTime;
        if (generatorState.nextRefillTime === 0) {
            generatorState.nextRefillTime = currentTime + (generatorState.chargeTime || 0);
        }
        generatorState.lastSmallRecoverTime = 0;
    } else {
        MergeBoardLogic.markGeneratorSmallRecoverAfterConsume(generatorState, generatorConfig, currentTime);
    }

    // ---------- 一次性用完：清理 ----------
    if (onetimeDestroy && generatorState.remainingCount === 0) {
        for (var ck2 in boardData) {
            if (boardData[ck2] && boardData[ck2].indexOf(instanceId) !== -1 && ck2 !== targetCellKey) {
                result.generatorCellKey = ck2;
                boardData[ck2] = null;
                break;
            }
        }
        delete boardState.generatorStates[instanceId];
        result.generatorExploded = true;
    }

    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  核心操作：收�?/ 售卖 / 删除
// ====================================================================

/**
 * @param {string} operationType - "collect" | "sell" | "delete"
 * @returns {OperationResult}
 */
MergeBoardLogic.removePiece = function (boardState, cellKey, operationType, configProvider) {
    var result = _baseResult(boardState);
    var boardData = boardState.data;

    if (!cellKey) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '缺少棋子位置参数';
        return result;
    }

    var pieceData = boardData[cellKey];
    if (!pieceData) {
        result.errorCode = 'PIECE_NOT_FOUND';
        result.errorMsg = 'piece not found';
        return result;
    }

    if (MergeBoardLogic.isBubblePieceData(pieceData)) {
        result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
        result.errorMsg = 'bubble piece cannot be collected, sold, or deleted';
        return result;
    }

    var basePart = pieceData.split('=')[0];
    var pieceId = parseInt(basePart.split('_')[0]);
    var instanceId = pieceData.indexOf('=') !== -1 ? pieceData.split('=')[1] : null;

    var pieceMeta = configProvider.getElementMeta(pieceId);
    if (!pieceMeta) {
        result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
        result.errorMsg = 'piece config not found';
        return result;
    }

    var sellType = MergeBoardLogic.getMetaField(pieceMeta, 'sellType', 'selltype');
    var ifCanSell = MergeBoardLogic.normalizeBool(MergeBoardLogic.getMetaField(pieceMeta, 'ifCanSell', 'ifcansell'));
    var sellPrice = MergeBoardLogic.getMetaField(pieceMeta, 'sellPrice', 'sellprice');

    if (sellType && sellType !== operationType) {
        result.errorCode = 'INVALID_OPERATION_TYPE';
        result.errorMsg = '该棋子不支持' + operationType + '操作';
        return result;
    }

    if ((operationType === 'sell' || operationType === 'collect' || operationType === 'delete') && !ifCanSell) {
        result.errorCode = 'CANNOT_SELL';
        result.errorMsg = 'piece cannot be sold';
        return result;
    }

    if (operationType !== 'delete') {
        if (!sellPrice || sellPrice === 0 || sellPrice === '0') {
            result.errorCode = 'NO_REWARD';
            result.errorMsg = 'piece has no reward';
            return result;
        }
        result.sideEffects.push({ type: 'addReward', params: { sellPrice: String(sellPrice) } });
    }

    // 保存撤销信息
    var currentTime = configProvider.getCurrentTime();
    var gsBackup = instanceId && boardState.generatorStates[instanceId]
        ? JSON.parse(JSON.stringify(boardState.generatorStates[instanceId]))
        : null;
    boardState.lastRemovedPiece = {
        cellKey: cellKey,
        pieceData: pieceData,
        generatorState: gsBackup,
        operationType: operationType,
        timestamp: currentTime
    };

    boardData[cellKey] = null;
    if (instanceId && boardState.generatorStates[instanceId]) {
        delete boardState.generatorStates[instanceId];
    }

    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  核心操作：撤销
// ====================================================================

MergeBoardLogic.undo = function (boardState, configProvider) {
    var result = _baseResult(boardState);
    var boardData = boardState.data;

    var lastRemoved = boardState.lastRemovedPiece;
    if (!lastRemoved) {
        result.errorCode = 'NO_UNDO_OPERATION';
        result.errorMsg = 'no undo operation';
        return result;
    }

    var currentTime = configProvider.getCurrentTime();
    if (currentTime - lastRemoved.timestamp > MergeBoardLogic.UNDO_CONFIG.MAX_TIME) {
        result.errorCode = 'UNDO_TIMEOUT';
        result.errorMsg = 'undo operation timed out';
        return result;
    }

    if (boardData[lastRemoved.cellKey]) {
        result.errorCode = 'CELL_OCCUPIED';
        result.errorMsg = '原位置已被占用，无法撤销';
        return result;
    }

    boardData[lastRemoved.cellKey] = lastRemoved.pieceData;

    if (lastRemoved.generatorState && lastRemoved.pieceData.indexOf('=') !== -1) {
        var restoreInstanceId = lastRemoved.pieceData.split('=')[1];
        boardState.generatorStates[restoreInstanceId] = lastRemoved.generatorState;
    }

    if (lastRemoved.operationType === 'sell' || lastRemoved.operationType === 'collect') {
        var undoPieceId = parseInt(lastRemoved.pieceData.split('_')[0]);
        var undoMeta = configProvider.getElementMeta(undoPieceId);
        var undoSellPrice = MergeBoardLogic.getMetaField(undoMeta, 'sellPrice', 'sellprice');
        if (undoMeta && undoSellPrice && undoSellPrice !== 0 && undoSellPrice !== '0') {
            result.sideEffects.push({ type: 'deductReward', params: { sellPrice: String(undoSellPrice) } });
        }
    }

    boardState.lastRemovedPiece = null;
    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  功能性棋子：沙漏
// ====================================================================

/**
 * 沙漏：全棋盘冷却中的生成器减�?CD，使用后消失
 */
MergeBoardLogic.funcHourglass = function (boardState, cellKey, configProvider) {
    var result = _baseResult(boardState);
    var boardData = boardState.data;

    var r = MergeBoardLogic.resolveCell(boardData, cellKey);
    if (!r) {
        result.errorCode = 'PIECE_NOT_FOUND';
        result.errorMsg = 'piece not found';
        return result;
    }

    if (MergeBoardLogic.isBubblePieceData(r.data)) {
        result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
        result.errorMsg = 'bubble piece cannot use function';
        return result;
    }
    var pieceId = parseInt(r.data.split('=')[0].split('_')[0]);
    var meta = configProvider.getElementMeta(pieceId);
    if (!meta || meta.funcType !== 'hourglass') {
        result.errorCode = 'INVALID_OPERATION_TYPE';
        result.errorMsg = 'invalid operation type';
        return result;
    }

    var param = meta.funcParam;
    if (typeof param === 'string') { try { param = JSON.parse(param); } catch (e) { param = {}; } }
    param = param || {};

    var sec = Math.max(0, parseInt(param.reduceSeconds) || 60);
    var now = configProvider.getCurrentTime();
    var states = boardState.generatorStates || {};
    result.reduceSeconds = sec;
    result.hourglassReduced = [];

    for (var id in states) {
        var s = states[id];
        if (s && s.nextRefillTime > now) {
            var before = s.nextRefillTime;
            s.nextRefillTime = Math.max(now, s.nextRefillTime - sec);
            result.hourglassReduced.push({
                instanceId: id,
                before: before,
                after: s.nextRefillTime
            });
        }
    }
    result.reducedCount = result.hourglassReduced.length;

    boardState.lastRemovedPiece = null;
    boardData[r.key] = null;

    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  功能性棋子：三选一
// ====================================================================

/**
 * 根据 mergeType 分类 + 等级筛选候选棋�?
 * 需�?configProvider.getCandidatePieceIds(typeId, level) 支持
 */
MergeBoardLogic._computeThreeToOneTypeOptions = function (funcParam, instanceId, configProvider) {
    var types = funcParam.mergeType || [];
    var level = Math.max(1, parseInt(funcParam.level) || 1);
    if (types.length === 0) return [];

    var rng = instanceId
        ? MergeBoardLogic.seededRandom(MergeBoardLogic.seedFromString(instanceId))
        : null;

    var used = {};
    var options = [];
    for (var i = 0; i < types.length; i++) {
        var allCandidates = configProvider.getCandidatePieceIds(types[i], level);
        var candidates = [];
        for (var j = 0; j < allCandidates.length; j++) {
            if (!used[allCandidates[j]]) candidates.push(allCandidates[j]);
        }
        if (candidates.length > 0) {
            var idx = rng
                ? MergeBoardLogic.seededRandomInt(rng, 0, candidates.length - 1)
                : Math.floor(Math.random() * candidates.length);
            var pid = candidates[idx];
            used[pid] = true;
            options.push(pid + '_-1_-1');
        }
    }
    return options;
};

/**
 * 从订单所需棋子的上一级中随机取最�?3 �?
 */
MergeBoardLogic._computeThreeToOneOrderOptions = function (orderData, instanceId, configProvider) {
    if (!orderData || !orderData.orders) return [];

    var preIds = [];
    var seen = {};
    for (var i = 0; i < orderData.orders.length; i++) {
        var o = orderData.orders[i];
        if (o.claimed) continue;
        for (var pidStr in o.requiredPieces) {
            var meta = configProvider.getElementMeta(parseInt(pidStr));
            if (!meta) continue;
            var pre = meta.preId;
            if (pre == null || pre === -1 || pre === '-1') continue;
            var pid = parseInt(pre);
            if (seen[pid]) continue;
            seen[pid] = true;
            preIds.push(pid);
        }
    }
    if (preIds.length === 0) return [];

    var rng = instanceId
        ? MergeBoardLogic.seededRandom(MergeBoardLogic.seedFromString(instanceId))
        : null;

    var pool = preIds.slice();
    var options = [];
    var need = Math.min(3, pool.length);
    for (var j = 0; j < need; j++) {
        var idx = rng
            ? MergeBoardLogic.seededRandomInt(rng, 0, pool.length - 1)
            : Math.floor(Math.random() * pool.length);
        options.push(pool[idx] + '_-1_-1');
        pool.splice(idx, 1);
    }
    return options;
};

/**
 * 三选一开箱：返回可选项（确定性，前后端结果一致）
 * @returns {OperationResult} 附加 funcOptions, funcInstanceId
 */
MergeBoardLogic.funcOpen = function (boardState, cellKey, configProvider) {
    var result = _baseResult(boardState);
    result.funcOptions = [];
    result.funcInstanceId = null;

    var boardData = boardState.data;
    var r = MergeBoardLogic.resolveCell(boardData, cellKey);
    if (!r) {
        result.errorCode = 'PIECE_NOT_FOUND';
        result.errorMsg = 'piece not found';
        return result;
    }

    if (MergeBoardLogic.isBubblePieceData(r.data)) {
        result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
        result.errorMsg = 'bubble piece cannot use function';
        return result;
    }
    var pieceId = parseInt(r.data.split('=')[0].split('_')[0]);
    var instanceId = r.data.indexOf('=') !== -1 ? r.data.split('=')[1] : null;

    var meta = configProvider.getElementMeta(pieceId);

    if (!meta || !meta.funcType) {
        result.errorCode = 'INVALID_OPERATION_TYPE';
        result.errorMsg = '该棋子无功能类型';
        return result;
    }

    var funcType = meta.funcType;
    var funcParam = meta.funcParam;
    if (typeof funcParam === 'string') { try { funcParam = JSON.parse(funcParam); } catch (e) { funcParam = {}; } }
    funcParam = funcParam || {};

    if (!instanceId) {
        instanceId = MergeBoardLogic.generateFuncPieceInstanceId(pieceId, boardData);
        boardData[r.key] = r.data + '=' + instanceId;
    }

    var options = [];
    if (funcType === 'threeToOneType') {
        options = MergeBoardLogic._computeThreeToOneTypeOptions(funcParam, instanceId, configProvider);
    } else if (funcType === 'threeToOneOrder') {
        options = MergeBoardLogic._computeThreeToOneOrderOptions(boardState.orderData, instanceId, configProvider);
    } else {
        result.errorCode = 'INVALID_OPERATION_TYPE';
        result.errorMsg = '该功能类型不支持open操作';
        return result;
    }
    if (options.length === 0) {
        result.errorCode = 'NO_FUNC_OPTIONS';
        result.errorMsg = 'no function options';
        return result;
    }

    result.funcOptions = options;
    result.funcInstanceId = instanceId;
    result.success = true;
    return _postProcessResult(result);
};

/**
 * 三选一确认选择
 */
MergeBoardLogic.funcPick = function (boardState, cellKey, pickPieceData, targetCellKey, configProvider) {
    var result = _baseResult(boardState);
    var boardData = boardState.data;

    if (!pickPieceData || !targetCellKey) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '缺少pickPieceData或targetCellKey';
        return result;
    }

    var r = MergeBoardLogic.resolveCell(boardData, cellKey);
    if (!r) {
        result.errorCode = 'PIECE_NOT_FOUND';
        result.errorMsg = 'piece not found';
        return result;
    }

    if (MergeBoardLogic.isBubblePieceData(r.data)) {
        result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
        result.errorMsg = 'bubble piece cannot use function';
        return result;
    }
    var pieceId = parseInt(r.data.split('=')[0].split('_')[0]);
    var instanceId = r.data.indexOf('=') !== -1 ? r.data.split('=')[1] : null;
    var meta = configProvider.getElementMeta(pieceId);

    if (!meta || !meta.funcType) {
        result.errorCode = 'INVALID_OPERATION_TYPE';
        result.errorMsg = '该棋子无功能类型';
        return result;
    }

    var funcType = meta.funcType;
    var funcParam = meta.funcParam;
    if (typeof funcParam === 'string') { try { funcParam = JSON.parse(funcParam); } catch (e) { funcParam = {}; } }
    funcParam = funcParam || {};

    var options = [];
    if (funcType === 'threeToOneType') {
        options = MergeBoardLogic._computeThreeToOneTypeOptions(funcParam, instanceId, configProvider);
    } else if (funcType === 'threeToOneOrder') {
        options = MergeBoardLogic._computeThreeToOneOrderOptions(boardState.orderData, instanceId, configProvider);
    }

    var basePick = (pickPieceData || '').split('=')[0];
    var valid = false;
    for (var i = 0; i < options.length; i++) {
        if (options[i].split('=')[0] === basePick) { valid = true; break; }
    }
    if (!valid) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = '所选棋子不合法';
        return result;
    }

    var parsed = MergeBoardLogic.parseCellKey(targetCellKey);
    if (!parsed || !MergeBoardLogic.isInBounds(parsed.col, parsed.row)) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'targetCellKey无效';
        return result;
    }
    var targetKey = parsed.col + '_' + parsed.row;
    var isSameCell = (targetKey === r.key);
    if (!isSameCell && boardData[targetKey]) {
        result.errorCode = 'CELL_OCCUPIED';
        result.errorMsg = '目标格子已有棋子';
        return result;
    }

    boardState.lastRemovedPiece = null;
    boardData[r.key] = null;
    boardData[targetKey] = pickPieceData;
    MergeBoardLogic.recordObtainedPiece(boardState, pickPieceData);

    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  初始化棋盘：为生成器和功能棋子补�?instanceId + generatorState
// ====================================================================

/**
 * 初始化棋盘数据：遍历 boardState.data，为生成器补�?instanceId 和确定性队列，
 * 为功能棋子补�?instanceId。前后端使用相同�?seed 规则，保证队列一致�?
 *
 * @param {Object} boardState - BoardState 对象（data 中只包含 "pieceId_status_bubbleRewardId" �?instanceId�?
 * @param {Object} configProvider - ConfigProvider 接口
 * @returns {Object} boardState（已原地修改�?
 */
// ====================================================================
//  Cooking tool
// ====================================================================

MergeBoardLogic.COOKING_STATUS = {
    LOADED: 'loaded',
    COOKING: 'cooking'
};

MergeBoardLogic.normalizeIngredientIds = function (ids) {
    var arr = [];
    if (typeof ids === 'string') {
        try { ids = JSON.parse(ids); } catch (e) { ids = String(ids).split(/[,+]/); }
    }
    if (!Array.isArray(ids)) return arr;
    for (var i = 0; i < ids.length; i++) {
        var id = parseInt(ids[i]);
        if (!isNaN(id)) arr.push(id);
    }
    arr.sort(function (a, b) { return a - b; });
    return arr;
};

MergeBoardLogic.buildRecipeKey = function (ids) {
    return MergeBoardLogic.normalizeIngredientIds(ids).join('+');
};

MergeBoardLogic._resolveCookingTool = function (boardState, cellKey, configProvider) {
    var boardData = boardState.data;
    var r = MergeBoardLogic.resolveCell(boardData, cellKey);
    if (!r) return { errorCode: 'PIECE_NOT_FOUND', errorMsg: 'cooking tool not found' };
    var parsed = MergeBoardLogic.parsePieceData(r.data);
    if (!parsed) return { errorCode: 'PARSE_PIECE_ERROR', errorMsg: 'tool data parse failed' };
    if (MergeBoardLogic.isBubbleInstanceId(parsed.instanceId)) {
        return { errorCode: 'BUBBLE_OPERATION_FORBIDDEN', errorMsg: 'bubble piece cannot use cooking' };
    }
    var meta = configProvider.getElementMeta(parsed.pieceId);
    if (!meta || meta.funcType !== 'cooking') {
        return { errorCode: 'INVALID_OPERATION_TYPE', errorMsg: 'piece is not a cooking tool' };
    }
    var instanceId = parsed.instanceId;
    if (!instanceId) {
        instanceId = MergeBoardLogic.generateFuncPieceInstanceId(parsed.pieceId, boardData);
        boardData[r.key] = r.data + '=' + instanceId;
    }
    if (!boardState.cookingStates) boardState.cookingStates = {};
    return { cell: r, pieceId: parsed.pieceId, instanceId: instanceId, meta: meta };
};

MergeBoardLogic._getCookingState = function (boardState, instanceId) {
    if (!boardState.cookingStates) boardState.cookingStates = {};
    return boardState.cookingStates[instanceId] || null;
};

MergeBoardLogic.cookingPut = function (boardState, toolCellKey, ingredientCellKeys, configProvider) {
    var result = _baseResult(boardState);
    result.cookingState = null;
    if (!Array.isArray(ingredientCellKeys) || ingredientCellKeys.length === 0) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'missing ingredientCellKeys';
        return result;
    }
    var tool = MergeBoardLogic._resolveCookingTool(boardState, toolCellKey, configProvider);
    if (tool.errorCode) {
        result.errorCode = tool.errorCode;
        result.errorMsg = tool.errorMsg;
        return result;
    }
    var current = MergeBoardLogic._getCookingState(boardState, tool.instanceId);
    if (current && current.status === MergeBoardLogic.COOKING_STATUS.COOKING) {
        result.errorCode = 'COOKING_BUSY';
        result.errorMsg = 'cooking tool is busy';
        return result;
    }
    var ingredients = current && Array.isArray(current.ingredients) ? current.ingredients.slice() : [];
    for (var i = 0; i < ingredientCellKeys.length; i++) {
        var cell = MergeBoardLogic.resolveCell(boardState.data, ingredientCellKeys[i]);
        if (!cell || cell.key === tool.cell.key) {
            result.errorCode = 'PIECE_NOT_FOUND';
            result.errorMsg = 'ingredient not found';
            return result;
        }
        var p = MergeBoardLogic.parsePieceData(cell.data);
        if (p && MergeBoardLogic.isBubbleInstanceId(p.instanceId)) {
            result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
            result.errorMsg = 'bubble piece cannot be cooking ingredient';
            return result;
        }
        if (!p || p.status !== MergeBoardLogic.PIECE_STATUS.NORMAL || p.bubbleRewardId !== MergeBoardLogic.PIECE_STATUS.NORMAL) {
            result.errorCode = 'INVALID_INGREDIENT';
            result.errorMsg = 'ingredient is not available';
            return result;
        }
        var meta = configProvider.getElementMeta(p.pieceId);
        if (!meta || meta.funcType || configProvider.getGeneratorByMergeId(p.pieceId)) {
            result.errorCode = 'INVALID_INGREDIENT';
            result.errorMsg = 'ingredient cannot be a tool or generator';
            return result;
        }
    }
    for (var j = 0; j < ingredientCellKeys.length; j++) {
        var c = MergeBoardLogic.resolveCell(boardState.data, ingredientCellKeys[j]);
        var parsed = MergeBoardLogic.parsePieceData(c.data);
        ingredients.push({ cellKey: c.key, pieceData: c.data, pieceId: parsed.pieceId });
        boardState.data[c.key] = null;
    }
    var state = {
        toolId: tool.pieceId,
        status: MergeBoardLogic.COOKING_STATUS.LOADED,
        ingredients: ingredients,
        ingredientIds: MergeBoardLogic.normalizeIngredientIds(ingredients.map(function (x) { return x.pieceId; })),
        recipeId: null,
        resultId: null,
        resultCount: 0,
        startTime: 0,
        finishTime: 0,
        energyCost: 0
    };
    boardState.cookingStates[tool.instanceId] = state;
    boardState.lastRemovedPiece = null;
    result.cookingState = state;
    result.cookingInstanceId = tool.instanceId;
    result.success = true;
    return _postProcessResult(result);
};

MergeBoardLogic.cookingTakeBack = function (boardState, toolCellKey, targetCellKeys, configProvider, ingredientIndex) {
    var result = _baseResult(boardState);
    var tool = MergeBoardLogic._resolveCookingTool(boardState, toolCellKey, configProvider);
    if (tool.errorCode) {
        result.errorCode = tool.errorCode;
        result.errorMsg = tool.errorMsg;
        return result;
    }
    var state = MergeBoardLogic._getCookingState(boardState, tool.instanceId);
    if (!state || !Array.isArray(state.ingredients) || state.ingredients.length === 0) {
        result.errorCode = 'COOKING_EMPTY';
        result.errorMsg = 'no cooking ingredients';
        return result;
    }
    if (state.status === MergeBoardLogic.COOKING_STATUS.COOKING) {
        result.errorCode = 'COOKING_BUSY';
        result.errorMsg = 'cooking tool is busy';
        return result;
    }
    var selectedIndex = parseInt(ingredientIndex);
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= state.ingredients.length) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'ingredientIndex invalid';
        return result;
    }
    var targets = Array.isArray(targetCellKeys) ? targetCellKeys.slice() : [];
    var targetKey = null;
    if (targets[0]) {
        var coords = MergeBoardLogic.parseCellKey(targets[0]);
        if (!coords || !MergeBoardLogic.isInBounds(coords.col, coords.row)) {
            result.errorCode = 'INVALID_PARAMS';
            result.errorMsg = 'targetCellKey invalid';
            return result;
        }
        targetKey = coords.col + '_' + coords.row;
        if (boardState.data[targetKey]) {
            result.errorCode = 'CELL_OCCUPIED';
            result.errorMsg = 'target cell occupied';
            return result;
        }
    } else {
        var empty = MergeBoardLogic.findNextEmptyCell(boardState.data);
        if (!empty) {
            result.errorCode = 'BOARD_FULL';
            result.errorMsg = 'board full';
            return result;
        }
        targetKey = empty.key;
    }
    var ingredient = state.ingredients.splice(selectedIndex, 1)[0];
    boardState.data[targetKey] = ingredient.pieceData;
    state.ingredientIds = MergeBoardLogic.normalizeIngredientIds(state.ingredients.map(function (x) { return x.pieceId; }));
    if (state.ingredients.length > 0) {
        boardState.cookingStates[tool.instanceId] = state;
        result.cookingState = state;
    } else {
        delete boardState.cookingStates[tool.instanceId];
    }
    boardState.lastRemovedPiece = null;
    result.cookingReturned = [{ cellKey: targetKey, pieceData: ingredient.pieceData }];
    result.cookingInstanceId = tool.instanceId;
    result.success = true;
    return _postProcessResult(result);
};

MergeBoardLogic.cookingStart = function (boardState, toolCellKey, recipeId, configProvider) {
    var result = _baseResult(boardState);
    result.cookingState = null;
    result.resourceRequired = null;
    var tool = MergeBoardLogic._resolveCookingTool(boardState, toolCellKey, configProvider);
    if (tool.errorCode) {
        result.errorCode = tool.errorCode;
        result.errorMsg = tool.errorMsg;
        return result;
    }
    var state = MergeBoardLogic._getCookingState(boardState, tool.instanceId);
    if (!state || !Array.isArray(state.ingredients) || state.ingredients.length === 0) {
        result.errorCode = 'COOKING_EMPTY';
        result.errorMsg = 'no cooking ingredients';
        return result;
    }
    if (state.status === MergeBoardLogic.COOKING_STATUS.COOKING) {
        result.errorCode = 'COOKING_BUSY';
        result.errorMsg = 'cooking tool is busy';
        return result;
    }
    var recipe = configProvider.getCookingRecipe ? configProvider.getCookingRecipe(recipeId) : null;
    if (!recipe) {
        result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
        result.errorMsg = 'cooking recipe not found';
        return result;
    }
    if (parseInt(recipe.toolId) !== parseInt(tool.pieceId)) {
        result.errorCode = 'INVALID_OPERATION_TYPE';
        result.errorMsg = 'recipe does not match tool';
        return result;
    }
    var currentKey = MergeBoardLogic.buildRecipeKey(state.ingredients.map(function (x) { return x.pieceId; }));
    var recipeKey = MergeBoardLogic.buildRecipeKey(recipe.ingredientIds);
    if (currentKey !== recipeKey) {
        result.errorCode = 'INVALID_INGREDIENT';
        result.errorMsg = 'ingredients do not match recipe';
        return result;
    }
    var playerLevel = boardState.playerLevel || 0;
    if (recipe.unlockLevel && playerLevel < recipe.unlockLevel) {
        result.errorCode = 'LOCKED';
        result.errorMsg = 'recipe locked';
        return result;
    }
    var now = configProvider.getCurrentTime();
    state.status = MergeBoardLogic.COOKING_STATUS.COOKING;
    state.recipeId = recipe.id;
    state.resultId = recipe.resultId;
    state.resultCount = recipe.resultCount || 1;
    state.startTime = now;
    state.finishTime = now + (recipe.makeTime || 0);
    state.energyCost = 0;
    state.ingredientIds = MergeBoardLogic.normalizeIngredientIds(state.ingredients.map(function (x) { return x.pieceId; }));
    boardState.cookingStates[tool.instanceId] = state;
    boardState.lastRemovedPiece = null;
    result.cookingState = state;
    result.cookingInstanceId = tool.instanceId;
    result.remainingTime = Math.max(0, state.finishTime - now);
    result.success = true;
    return _postProcessResult(result);
};
MergeBoardLogic.cookingQuickFinish = function (boardState, toolCellKey, configProvider) {
    var result = _baseResult(boardState);
    result.cookingState = null;
    result.resourceRequired = null;
    var tool = MergeBoardLogic._resolveCookingTool(boardState, toolCellKey, configProvider);
    if (tool.errorCode) {
        result.errorCode = tool.errorCode;
        result.errorMsg = tool.errorMsg;
        return result;
    }
    var state = MergeBoardLogic._getCookingState(boardState, tool.instanceId);
    if (!state || state.status !== MergeBoardLogic.COOKING_STATUS.COOKING) {
        result.errorCode = 'COOKING_NOT_STARTED';
        result.errorMsg = 'cooking not started';
        return result;
    }
    var now = configProvider.getCurrentTime();
    if (now >= state.finishTime) {
        result.errorCode = 'COOKING_ALREADY_READY';
        result.errorMsg = 'cooking already ready';
        result.remainingTime = 0;
        return result;
    }
    var recipe = configProvider.getCookingRecipe ? configProvider.getCookingRecipe(state.recipeId) : null;
    if (!recipe) {
        result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
        result.errorMsg = 'cooking recipe not found';
        return result;
    }
    var quickCost = MergeBoardLogic.normalizeConsumeString(recipe.quickCost || '');
    if (!MergeBoardLogic.parseConsumeString(quickCost)) {
        result.errorCode = 'INVALID_CONFIG';
        result.errorMsg = 'quickCost invalid';
        return result;
    }
    result.resourceRequired = { consumeStr: quickCost };
    var resCheck = MergeBoardLogic.checkAndDeductResource(boardState, result.resourceRequired.consumeStr);
    if (!resCheck.success) {
        result.errorCode = resCheck.errorCode;
        result.errorMsg = resCheck.errorMsg;
        return result;
    }
    state.finishTime = now;
    boardState.cookingStates[tool.instanceId] = state;
    boardState.lastRemovedPiece = null;
    result.cookingState = state;
    result.cookingInstanceId = tool.instanceId;
    result.remainingTime = 0;
    result.success = true;
    return _postProcessResult(result);
};

MergeBoardLogic.cookingBackToLoaded = function (boardState, toolCellKey, configProvider) {
    var result = _baseResult(boardState);
    result.cookingState = null;
    result.resourceRequired = null;
    var tool = MergeBoardLogic._resolveCookingTool(boardState, toolCellKey, configProvider);
    if (tool.errorCode) {
        result.errorCode = tool.errorCode;
        result.errorMsg = tool.errorMsg;
        return result;
    }
    var state = MergeBoardLogic._getCookingState(boardState, tool.instanceId);
    if (!state || state.status !== MergeBoardLogic.COOKING_STATUS.COOKING) {
        result.errorCode = 'COOKING_NOT_STARTED';
        result.errorMsg = 'cooking not started';
        return result;
    }
    var now = configProvider.getCurrentTime();
    if (now >= state.finishTime) {
        result.errorCode = 'COOKING_ALREADY_READY';
        result.errorMsg = 'cooking already ready';
        result.remainingTime = 0;
        return result;
    }
    var recipe = configProvider.getCookingRecipe ? configProvider.getCookingRecipe(state.recipeId) : null;
    if (!recipe) {
        result.errorCode = 'PIECE_CONFIG_NOT_FOUND';
        result.errorMsg = 'cooking recipe not found';
        return result;
    }
    
    var cancelCost = MergeBoardLogic.normalizeConsumeString(recipe.cancelCost || '');
    if (!MergeBoardLogic.parseConsumeString(cancelCost)) {
        result.errorCode = 'INVALID_CONFIG';
        result.errorMsg = 'cancelCost invalid';
        return result;
    }
    result.resourceRequired = { consumeStr: cancelCost };
    var resCheck = MergeBoardLogic.checkAndDeductResource(boardState, result.resourceRequired.consumeStr);
    if (!resCheck.success) {
        result.errorCode = resCheck.errorCode;
        result.errorMsg = resCheck.errorMsg;
        return result;
    }
    state.status = MergeBoardLogic.COOKING_STATUS.LOADED;
    state.recipeId = null;
    state.resultId = null;
    state.resultCount = 0;
    state.startTime = 0;
    state.finishTime = 0;
    state.energyCost = 0;
    state.ingredientIds = MergeBoardLogic.normalizeIngredientIds(state.ingredients.map(function (x) { return x.pieceId; }));
    boardState.cookingStates[tool.instanceId] = state;
    boardState.lastRemovedPiece = null;
    result.cookingState = state;
    result.cookingInstanceId = tool.instanceId;
    result.remainingTime = 0;
    result.success = true;
    return _postProcessResult(result);
};

MergeBoardLogic.cookingClaim = function (boardState, toolCellKey, targetCellKey, configProvider) {
    var result = _baseResult(boardState);
    result.cookingOutput = null;
    var tool = MergeBoardLogic._resolveCookingTool(boardState, toolCellKey, configProvider);
    if (tool.errorCode) {
        result.errorCode = tool.errorCode;
        result.errorMsg = tool.errorMsg;
        return result;
    }
    var state = MergeBoardLogic._getCookingState(boardState, tool.instanceId);
    if (!state || state.status !== MergeBoardLogic.COOKING_STATUS.COOKING) {
        result.errorCode = 'COOKING_NOT_STARTED';
        result.errorMsg = 'cooking not started';
        return result;
    }
    var now = configProvider.getCurrentTime();
    if (now < state.finishTime) {
        result.errorCode = 'COOKING_NOT_READY';
        result.errorMsg = 'cooking not ready';
        result.remainingTime = Math.ceil(state.finishTime - now);
        return result;
    }
    var resultCount = Math.max(1, parseInt(state.resultCount) || 1);
    var targetKeys = [];
    if (targetCellKey) {
        var coords = MergeBoardLogic.parseCellKey(targetCellKey);
        if (!coords || !MergeBoardLogic.isInBounds(coords.col, coords.row)) {
            result.errorCode = 'INVALID_PARAMS';
            result.errorMsg = 'targetCellKey invalid';
            return result;
        }
        var k = coords.col + '_' + coords.row;
        if (boardState.data[k]) {
            result.errorCode = 'CELL_OCCUPIED';
            result.errorMsg = 'target cell occupied';
            return result;
        }
        targetKeys.push(k);
    }
    while (targetKeys.length < resultCount) {
        var except = {};
        for (var i = 0; i < targetKeys.length; i++) except[targetKeys[i]] = true;
        var empty = MergeBoardLogic.findNextEmptyCellExcept(boardState.data, except);
        if (!empty) {
            result.errorCode = 'BOARD_FULL';
            result.errorMsg = 'board full';
            return result;
        }
        targetKeys.push(empty.key);
    }
    var outputs = [];
    for (var j = 0; j < resultCount; j++) {
        var placed = MergeBoardLogic.buildPlacedPieceData(state.resultId, boardState, configProvider, tool.instanceId + ':cooking:' + state.recipeId + ':' + j);
        boardState.data[targetKeys[j]] = placed.pieceData;
        MergeBoardLogic.recordObtainedPiece(boardState, placed.pieceData);
        outputs.push({ cellKey: targetKeys[j], pieceData: placed.pieceData, pieceId: state.resultId });
    }
    delete boardState.cookingStates[tool.instanceId];
    boardState.lastRemovedPiece = null;
    result.cookingOutput = outputs;
    result.cookingInstanceId = tool.instanceId;
    result.success = true;
    return _postProcessResult(result);
};

// ====================================================================
//  Board initialization
// ====================================================================

MergeBoardLogic.initBoard = function (boardState, configProvider) {
    var boardData = boardState.data;
    if (!boardData) return boardState;
    if (!boardState.generatorStates) boardState.generatorStates = {};

    for (var k in boardData) {
        var v = boardData[k];
        if (!v || typeof v !== 'string') continue;

        var splitParts = v.split('=');
        var basePart = splitParts[0];
        var instanceId = splitParts.length > 1 ? splitParts[1] : null;
        var pid = parseInt(basePart.split('_')[0]);
        if (isNaN(pid)) continue;

        var generatorConfig = configProvider.getGeneratorByMergeId(pid);
        if (generatorConfig) {
            if (!instanceId) {
                instanceId = MergeBoardLogic.generateInstanceId(pid, boardData);
                boardData[k] = v + '=' + instanceId;
            }
            var queueSeed = MergeBoardLogic.seedFromString(k + ':' + pid);
            var state = MergeBoardLogic.buildGeneratorState(generatorConfig, pid, queueSeed);
            boardState.generatorStates[instanceId] = state;
            continue;
        }

        if (instanceId) continue;

        var meta = configProvider.getElementMeta(pid);
        if (MergeBoardLogic.needsFuncInstance(meta)) {
            boardData[k] = v + '=' + MergeBoardLogic.generateFuncPieceInstanceId(pid, boardData);
        }
    }

    return boardState;
};

// ====================================================================
//  MergeOrderLogic 延迟引用（避免循环依赖）
// ====================================================================

var _cachedMergeOrderLogic: any = MergeOrderLogicModule;
var _cachedMergeContentUtil: any = MergeContentUtilModule;

/**
 * 获取 MergeOrderLogic 引用（延迟加载）
 * Node.js 环境�?require，浏览器环境�?window 读取
 * 外部也可通过 setMergeOrderLogic 手动注入
 */
MergeBoardLogic._getMergeOrderLogic = function () {
    if (_cachedMergeOrderLogic) return _cachedMergeOrderLogic;
    if (typeof window !== 'undefined' && (window as any).MergeOrderLogic) {
        _cachedMergeOrderLogic = (window as any).MergeOrderLogic || null;
    }
    return _cachedMergeOrderLogic;
};

MergeBoardLogic.setMergeOrderLogic = function (mol) {
    _cachedMergeOrderLogic = mol;
};

MergeBoardLogic._getMergeContentUtil = function () {
    if (_cachedMergeContentUtil) return _cachedMergeContentUtil;
    if (!_cachedMergeContentUtil && typeof window !== 'undefined' && (window as any).MergeContentUtil) {
        _cachedMergeContentUtil = (window as any).MergeContentUtil || null;
    }
    if (!_cachedMergeContentUtil && typeof Game !== 'undefined' && Game.MergeContentUtil) {
        _cachedMergeContentUtil = Game.MergeContentUtil;
    }
    return _cachedMergeContentUtil;
};

MergeBoardLogic.setMergeContentUtil = function (util) {
    _cachedMergeContentUtil = util;
};

MergeBoardLogic.checkAndDeductResource = function (boardState, consumeStr) {
    var consumes = MergeBoardLogic.parseConsumeList(consumeStr);
    if (consumes.length === 0) return { success: true };

    var resources = boardState.resources;
    if (!resources) return { success: true };

    for (var i = 0; i < consumes.length; i++) {
        var consume = consumes[i];
        var key = consume.type + '_' + consume.cid;
        var current = resources[key];
        if (current === undefined || current === null) current = 0;
        if (current < consume.count) {
            return {
                success: false,
                errorCode: 'RESOURCE_NOT_ENOUGH',
                errorMsg: '资源不足',
                resourceType: consume.type,
                resourceCid: consume.cid,
                required: consume.count,
                current: current
            };
        }
    }

    var newBalances = {};
    for (var j = 0; j < consumes.length; j++) {
        var item = consumes[j];
        var balanceKey = item.type + '_' + item.cid;
        resources[balanceKey] = (resources[balanceKey] || 0) - item.count;
        newBalances[balanceKey] = resources[balanceKey];
    }
    return { success: true, newBalances: newBalances };
};

// ====================================================================
//  MergeGenerator 延迟引用（生成器产出算法模块�?
// ====================================================================

var _cachedMergeGenerator: any = MergeGeneratorModule;

/**
 * 获取 MergeGenerator 引用（延迟加载）
 * Node.js 环境�?require，浏览器/Cocos 环境�?window / Game 读取
 */
MergeBoardLogic._getMergeGenerator = function () {
    if (_cachedMergeGenerator) return _cachedMergeGenerator;
    if (!_cachedMergeGenerator && typeof window !== 'undefined' && (window as any).MergeGenerator) {
        _cachedMergeGenerator = (window as any).MergeGenerator || null;
    }
    if (!_cachedMergeGenerator && typeof Game !== 'undefined' && Game.MergeGenerator) {
        _cachedMergeGenerator = Game.MergeGenerator;
    }
    return _cachedMergeGenerator;
};

MergeBoardLogic.setMergeGenerator = function (mg) {
    _cachedMergeGenerator = mg;
};

MergeBoardLogic.parseInitialSequenceValue = function (value) {
    if (value == null) return [];
    if (typeof value === 'function') {
        try { value = value(); } catch (e) { return []; }
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
        if (value.value !== undefined) value = value.value;
        else if (value.v !== undefined) value = value.v;
        else if (value.default !== undefined) value = value.default;
        else if (value.data !== undefined) value = value.data;
        else if (value.list !== undefined) value = value.list;
        else if (value.items !== undefined) value = value.items;
    }
    if (typeof value === 'string') {
        var s = value.trim();
        if (!s) return [];
        try {
            value = JSON.parse(s);
        } catch (e2) {
            if (s.charAt(0) === '[' && s.charAt(s.length - 1) === ']') {
                s = s.substring(1, s.length - 1);
            }
            value = s.split(/[,;，；\s]+/);
        }
    }
    if (!Array.isArray(value)) return [];
    var out = [];
    for (var i = 0; i < value.length; i++) {
        var id = parseInt(value[i]);
        if (!isNaN(id)) out.push(id);
    }
    return out;
};

MergeBoardLogic.readInitialSequenceField = function (source) {
    if (!source) return null;
    var directKeys = ['initialSequence', 'InitialSequence', 'initial_sequence', 'Initial_Sequence'];
    for (var i = 0; i < directKeys.length; i++) {
        var key = directKeys[i];
        if (source[key] !== undefined && source[key] !== null) return source[key];
    }
    for (var k in source) {
        var normalized = String(k || '').replace(/[\s_\-\ufeff]/g, '').toLowerCase();
        if (normalized === 'initialsequence') return source[k];
    }
    return null;
};

MergeBoardLogic.getConfiguredInitialSequence = function (generatorId, generatorConfig) {
    var value = MergeBoardLogic.readInitialSequenceField(generatorConfig);
    var seq = MergeBoardLogic.parseInitialSequenceValue(value);
    if (seq.length > 0) return seq;

    var MG = MergeBoardLogic._getMergeGenerator();
    if (MG && MG.normalizeConfig && MG.buildInitialSequence) {
        try {
            seq = MG.buildInitialSequence(MG.normalizeConfig(generatorConfig));
            if (seq.length > 0) return seq;
        } catch (e) { }
    }

    try {
        if (typeof Meta !== 'undefined' && Meta.MergeGeneraterMeta && Meta.MergeGeneraterMeta.GetGenerateByMergeId) {
            var meta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(generatorId);
            if (meta) {
                if (typeof meta.InitialSequence === 'function') {
                    seq = MergeBoardLogic.parseInitialSequenceValue(meta.InitialSequence());
                    if (seq.length > 0) return seq;
                }
                if (typeof meta.GetFieldValue === 'function') {
                    seq = MergeBoardLogic.parseInitialSequenceValue(meta.GetFieldValue(['InitialSequence', 'initialSequence'], null));
                    if (seq.length > 0) return seq;
                }
                seq = MergeBoardLogic.parseInitialSequenceValue(MergeBoardLogic.readInitialSequenceField(meta._data || meta));
                if (seq.length > 0) return seq;
            }
        }
    } catch (e2) { }

    return [];
};

// ====================================================================
//  InitialSequence: shared by generator id, and inherited on generator merge.
//  存储�?boardState.initialSequences[generatorId] = [剩余产出id...]
//  同一 generatorId 的所有实例共享同一条剩余序列（满足「A1点几个，A2接着点」）
// ====================================================================

MergeBoardLogic._ensureInitialSequenceMap = function (boardState) {
    if (!boardState.initialSequences) boardState.initialSequences = {};
    return boardState.initialSequences;
};

/** 首次出现�?generatorId 时用 config 初始化（已存在则不覆盖，实现 ID 共享�?*/
MergeBoardLogic.ensureInitialSequence = function (boardState, generatorId, generatorConfig) {
    var map = MergeBoardLogic._ensureInitialSequenceMap(boardState);
    if (map[generatorId] === undefined) {
        map[generatorId] = MergeBoardLogic.getConfiguredInitialSequence(generatorId, generatorConfig);
    }
    return map[generatorId];
};

/** 查看下一个初始序列产出（不消耗），无则返�?null */
MergeBoardLogic.peekInitialSequence = function (boardState, generatorId) {
    var map = boardState && boardState.initialSequences;
    if (map && map[generatorId] && map[generatorId].length > 0) return map[generatorId][0];
    return null;
};

/** 消耗一个初始序列产出，无则返回 null */
MergeBoardLogic.shiftInitialSequence = function (boardState, generatorId) {
    var map = boardState && boardState.initialSequences;
    if (map && map[generatorId] && map[generatorId].length > 0) return map[generatorId].shift();
    return null;
};

MergeBoardLogic.inheritInitialSequence = function (boardState, lowGeneratorId, highGeneratorId, highGeneratorConfig) {
    var map = MergeBoardLogic._ensureInitialSequenceMap(boardState);
    var lowRemain = (map[lowGeneratorId] || []).slice();
    var highSeq = MergeBoardLogic.getConfiguredInitialSequence(highGeneratorId, highGeneratorConfig);
    if (map[highGeneratorId] !== undefined) {
        var existing = Array.isArray(map[highGeneratorId]) ? map[highGeneratorId] : [];
        var legacyLowOnly = existing.length === lowRemain.length;
        if (legacyLowOnly) {
            for (var i = 0; i < lowRemain.length; i++) {
                if (existing[i] !== lowRemain[i]) {
                    legacyLowOnly = false;
                    break;
                }
            }
        }
        if (!legacyLowOnly || highSeq.length === 0) return existing;
    }
    map[highGeneratorId] = lowRemain.concat(highSeq);
    return map[highGeneratorId];
};

/**
 * �?MergeGenerator 重新补充生成器队列，并持久化 produceState（跨补充延续：固定循环位�?非重置剩�?PRD保底计数�?
 */
MergeBoardLogic.refillGeneratorQueue = function (generatorState, generatorConfig) {
    var MG = MergeBoardLogic._getMergeGenerator();
    if (!MG) {
        generatorState.queue = generatorState.queue || [];
        return generatorState;
    }
    var cfg = MG.normalizeConfig(generatorConfig);
    if (!generatorState.produceState) {
        var seed = generatorState.queueSeed || MergeBoardLogic.seedFromString(String(generatorState.generatorId));
        generatorState.produceState = MG.createState(cfg, seed);
    }
    var fr = MG.buildOutputBatch ? MG.buildOutputBatch(cfg, generatorState.produceState, generatorState.maxOutputCount) : MG.fillQueue(cfg, generatorState.produceState, generatorState.maxOutputCount);
    var produceState = fr.produceState || fr.state;
    generatorState.queue = fr.queue;
    generatorState.produceState = produceState;
    generatorState.queueSeed = produceState.seed;
    return generatorState;
};

// ====================================================================
//  仓库操作（公共代码：棋盘格子 <-> 仓库�?
//  数据结构：boardState.warehouse = { index: pieceData }；boardState.warehouseCapacity
// ====================================================================

/** 仓库当前条目�?*/
MergeBoardLogic.getWarehouseCount = function (boardState) {
    var w = boardState.warehouse || {};
    var n = 0;
    for (var k in w) if (w[k] != null && w[k] !== '') n++;
    return n;
};

/** 紧凑化仓库：重排�?0..n-1 连续索引 */
MergeBoardLogic.compactWarehouse = function (warehouse) {
    var items = [];
    for (var k in warehouse) {
        var v = warehouse[k];
        if (v != null && v !== '') items.push(v);
    }
    var out = {};
    for (var i = 0; i < items.length; i++) out[String(i)] = items[i];
    return out;
};

/** 加入仓库（受 warehouseCapacity 限制）；成功返回索引，已满返�?false */
MergeBoardLogic.addPieceToWarehouse = function (boardState, pieceData) {
    if (!boardState.warehouse) boardState.warehouse = {};
    var capacity = parseInt(boardState.warehouseCapacity);
    if (isNaN(capacity) || capacity <= 0) {
        capacity = MergeBoardLogic.DEFAULT_WAREHOUSE_CAPACITY;
        boardState.warehouseCapacity = capacity;
    }
    var count = MergeBoardLogic.getWarehouseCount(boardState);
    if (count >= capacity) return false;
    var idx = 0;
    while (boardState.warehouse[String(idx)] != null && boardState.warehouse[String(idx)] !== '') idx++;
    boardState.warehouse[String(idx)] = pieceData;
    return idx;
};

/** 棋盘格子 -> 仓库 */
MergeBoardLogic.prepareWarehousePieceForGrid = function (boardState, pieceData, configProvider, seedKey) {
    var parsed = MergeBoardLogic.parsePieceData(pieceData);
    if (!parsed || !configProvider) return pieceData;
    if (!boardState.generatorStates) boardState.generatorStates = {};

    var generatorConfig = configProvider.getGeneratorByMergeId ? configProvider.getGeneratorByMergeId(parsed.pieceId) : null;
    var meta = configProvider.getElementMeta ? configProvider.getElementMeta(parsed.pieceId) : null;
    var needsInstance = generatorConfig || MergeBoardLogic.needsFuncInstance(meta);
    if (!needsInstance) return pieceData;

    if (parsed.instanceId) {
        if (generatorConfig && !boardState.generatorStates[parsed.instanceId]) {
            var queueSeed = MergeBoardLogic.seedFromString((seedKey || '') + ':' + parsed.pieceId);
            boardState.generatorStates[parsed.instanceId] = MergeBoardLogic.buildGeneratorState(generatorConfig, parsed.pieceId, queueSeed);
            MergeBoardLogic.ensureInitialSequence(boardState, parsed.pieceId, generatorConfig);
        }
        return pieceData;
    }

    var placed = MergeBoardLogic.buildPlacedPieceData(parsed.pieceId, boardState, configProvider, seedKey);
    var placedParsed = MergeBoardLogic.parsePieceData(placed.pieceData);
    var instancePart = placedParsed && placedParsed.instanceId ? ('=' + placedParsed.instanceId) : '';
    return parsed.pieceId + '_' + parsed.status + '_' + parsed.bubbleRewardId + instancePart;
};

MergeBoardLogic.movePieceDataToWarehouse = function (boardState, pieceData) {
    var result: any = { success: false, errorCode: '', errorMsg: '', boardState: boardState };
    if (!MergeBoardLogic.parsePieceData(pieceData)) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'invalid pieceData';
        return result;
    }
    if (MergeBoardLogic.isBubblePieceData(pieceData)) {
        result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN';
        result.errorMsg = 'bubble piece cannot move to warehouse';
        return result;
    }
    var idx = MergeBoardLogic.addPieceToWarehouse(boardState, pieceData);
    if (idx === false) {
        result.errorCode = 'WAREHOUSE_FULL';
        result.errorMsg = 'warehouse full';
        return result;
    }
    boardState.lastRemovedPiece = null;
    result.success = true;
    result.warehouseIndex = idx;
    result.warehouse = boardState.warehouse;
    return _postProcessResult(result);
};

MergeBoardLogic.movePieceFromGridToWarehouse = function (boardState, cellKey) {
    var result: any = { success: false, errorCode: '', errorMsg: '', boardState: boardState };
    var pieceData = boardState.data ? boardState.data[cellKey] : null;
    if (!pieceData) { result.errorCode = 'PIECE_NOT_FOUND'; result.errorMsg = 'grid cell is empty'; return result; }
    if (MergeBoardLogic.isBubblePieceData(pieceData)) { result.errorCode = 'BUBBLE_OPERATION_FORBIDDEN'; result.errorMsg = '气泡棋子不能放入仓库'; return result; }
    var idx = MergeBoardLogic.addPieceToWarehouse(boardState, pieceData);
    if (idx === false) { result.errorCode = 'WAREHOUSE_FULL'; result.errorMsg = '仓库已满'; return result; }
    boardState.data[cellKey] = null;
    boardState.lastRemovedPiece = null;
    result.success = true;
    result.warehouseIndex = idx;
    result.warehouse = boardState.warehouse;
    return _postProcessResult(result);
};

/** 仓库 -> 棋盘（下一个空格） */
MergeBoardLogic.movePieceFromWarehouseToGrid = function (boardState, warehouseIndex, configProvider) {
    var result: any = { success: false, errorCode: '', errorMsg: '', boardState: boardState };
    var key = String(warehouseIndex);
    var pieceData = boardState.warehouse ? boardState.warehouse[key] : null;
    if (!pieceData) { result.errorCode = 'WAREHOUSE_ITEM_NOT_FOUND'; result.errorMsg = 'warehouse item not found'; return result; }
    var empty = MergeBoardLogic.findNextEmptyCell(boardState.data);
    if (!empty) { result.errorCode = 'BOARD_FULL'; result.errorMsg = '棋盘已满'; return result; }
    pieceData = MergeBoardLogic.prepareWarehousePieceForGrid(boardState, pieceData, configProvider, key + ':' + empty.key);
    boardState.data[empty.key] = pieceData;
    delete boardState.warehouse[key];
    boardState.warehouse = MergeBoardLogic.compactWarehouse(boardState.warehouse);
    boardState.lastRemovedPiece = null;
    result.success = true;
    result.cellKey = empty.key;
    result.pieceData = pieceData;
    result.warehouse = boardState.warehouse;
    return _postProcessResult(result);
};

/** 升级仓库容量（容�?1；货币消耗由调用方处理） */
MergeBoardLogic.batchMoveFromWarehouseByData = function (boardState, pieceDatas, configProvider) {
    var result: any = {
        success: false,
        errorCode: '',
        errorMsg: '',
        boardState: boardState,
        placedPieces: [],
        failedPieces: []
    };
    if (!Array.isArray(pieceDatas) || pieceDatas.length === 0) {
        result.errorCode = 'INVALID_PARAMS';
        result.errorMsg = 'pieceDatas invalid';
        return result;
    }
    if (!boardState.warehouse) boardState.warehouse = {};

    for (var i = 0; i < pieceDatas.length; i++) {
        var requestedPieceData = pieceDatas[i];
        var foundIndex = null;
        for (var index in boardState.warehouse) {
            if (boardState.warehouse[index] === requestedPieceData) {
                foundIndex = index;
                break;
            }
        }
        if (foundIndex === null) {
            result.failedPieces.push({ pieceData: requestedPieceData, reason: 'NOT_FOUND_IN_WAREHOUSE' });
            continue;
        }

        var empty = MergeBoardLogic.findNextEmptyCell(boardState.data);
        if (!empty) {
            result.failedPieces.push({ pieceData: requestedPieceData, reason: 'BOARD_FULL' });
            continue;
        }

        var placedPieceData = MergeBoardLogic.prepareWarehousePieceForGrid(boardState, requestedPieceData, configProvider, foundIndex + ':' + empty.key);
        boardState.data[empty.key] = placedPieceData;
        delete boardState.warehouse[foundIndex];
        result.placedPieces.push({
            pieceData: placedPieceData,
            sourcePieceData: requestedPieceData,
            cellKey: empty.key,
            col: empty.col,
            row: empty.row
        });
    }

    if (result.placedPieces.length > 0) {
        boardState.warehouse = MergeBoardLogic.compactWarehouse(boardState.warehouse);
        boardState.lastRemovedPiece = null;
    }
    result.success = result.placedPieces.length > 0 || result.failedPieces.length < pieceDatas.length;
    if (!result.success) {
        result.errorCode = result.failedPieces.length > 0 ? result.failedPieces[0].reason : 'MOVE_FAILED';
        result.errorMsg = result.errorCode;
    }
    result.warehouse = boardState.warehouse;
    return _postProcessResult(result);
};

MergeBoardLogic.upgradeWarehouseCapacity = function (boardState) {
    var capacity = parseInt(boardState.warehouseCapacity);
    if (isNaN(capacity) || capacity <= 0) capacity = MergeBoardLogic.DEFAULT_WAREHOUSE_CAPACITY;
    boardState.warehouseCapacity = capacity + 1;
    return { success: true, warehouseCapacity: boardState.warehouseCapacity };
};

// ====================================================================
//  导出（兼�?Node.js / 浏览器）
// ====================================================================

if (typeof window !== 'undefined') {
    (window as any).MergeBoardLogic = MergeBoardLogic;
}
Game.MergeBoardLogic = MergeBoardLogic;

export default MergeBoardLogic;
