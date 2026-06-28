/**
 * MergeGenerator - reusable generator output algorithms.
 *
 * SpawnType:
 *   1 FIXED        output ["id-count", ...] expands to one ordered batch.
 *   2 NON_RESET    output ["id-count", ...] expands to one fixed-count shuffled batch.
 *   3 PRD          output ["id-prob", ...] generates maxOutputCount items with PRD boost.
 *   4 FULL_RANDOM  output ["id-weight", ...] generates maxOutputCount independent rolls.
 *
 * InitialSequence is parsed here, but consumed by board-level logic because it is
 * shared by generator id rather than by generator instance.
 */
type MergeGeneratorApi = Record<string, any>;
type MergeGeneratorConfig = Record<string, any> & {
    spawnType: number;
    items: any[];
    maxOutputCount: number;
    initialSequence: any[];
};
type MergeGeneratorWindow = Window & {
    MergeGenerator?: MergeGeneratorApi;
};

var MergeGenerator: MergeGeneratorApi = {};

MergeGenerator.SpawnType = { FIXED: 1, NON_RESET: 2, PRD: 3, FULL_RANDOM: 4 };

MergeGenerator._stepSeed = function (s) {
    return (s * 9301 + 49297) % 233280;
};

MergeGenerator.seedFromString = function (str) {
    if (str == null || str === '') return 1;
    var h = 0;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h) || 1;
};

MergeGenerator._rand = function (seed) {
    var s = ((seed % 233280) + 233280) % 233280;
    var n = MergeGenerator._stepSeed(s);
    return { seed: n, value: n / 233280 };
};

MergeGenerator._firstDefined = function (raw, keys) {
    raw = raw || {};
    for (var i = 0; i < keys.length; i++) {
        if (raw[keys[i]] !== undefined && raw[keys[i]] !== null) return raw[keys[i]];
    }
    return undefined;
};

MergeGenerator._parseInitialSequence = function (v) {
    if (v == null) return [];
    if (typeof v === 'object' && !Array.isArray(v)) {
        if (v.value !== undefined) v = v.value;
        else if (v.v !== undefined) v = v.v;
        else if (v.default !== undefined) v = v.default;
        else if (v.data !== undefined) v = v.data;
        else if (v.list !== undefined) v = v.list;
        else if (v.items !== undefined) v = v.items;
    }
    if (typeof v === 'string') {
        var s = v.trim();
        if (!s) return [];
        try {
            v = JSON.parse(s);
        } catch (e) {
            var cleaned = s;
            if (cleaned.charAt(0) === '[' && cleaned.charAt(cleaned.length - 1) === ']') {
                cleaned = cleaned.substring(1, cleaned.length - 1);
            }
            if (!cleaned) return [];
            v = cleaned.split(/[,;，；\s]+/);
        }
    }
    if (!Array.isArray(v)) return [];
    var out = [];
    for (var i = 0; i < v.length; i++) {
        var id = parseInt(v[i]);
        if (!isNaN(id)) out.push(id);
    }
    return out;
};

MergeGenerator._splitOutputItem = function (cfg) {
    if (typeof cfg !== 'string') return null;
    var sep = cfg.indexOf('-') >= 0 ? '-' : (cfg.indexOf('=') >= 0 ? '=' : '');
    if (!sep) return null;
    var sp = cfg.split(sep);
    if (sp.length < 2) return null;
    var id = parseInt(sp[0]);
    var num = parseFloat(sp[1]);
    if (isNaN(id) || isNaN(num) || num <= 0) return null;
    return { id: id, num: num };
};

MergeGenerator.parseOutput = function (output) {
    var items = [];
    if (typeof output === 'string') {
        try { output = JSON.parse(output); } catch (e) {
            var single = MergeGenerator._splitOutputItem(output);
            return single ? [single] : items;
        }
    }
    if (!Array.isArray(output)) return items;
    for (var i = 0; i < output.length; i++) {
        var parsed = MergeGenerator._splitOutputItem(output[i]);
        if (parsed) items.push(parsed);
    }
    return items;
};

MergeGenerator._asCount = function (num) {
    var n = Math.round(parseFloat(num) || 0);
    return n > 0 ? n : 0;
};

MergeGenerator._asProbability = function (num) {
    var n = parseFloat(num) || 0;
    if (n > 1) n = n / 100;
    if (n < 0) n = 0;
    if (n > 1) n = 1;
    return n;
};

MergeGenerator._expandCountItems = function (items, mergeSameId) {
    var out = [];
    if (!items) return out;
    if (mergeSameId) {
        var counts = {};
        var order = [];
        for (var i = 0; i < items.length; i++) {
            var id = items[i].id;
            if (counts[id] === undefined) {
                counts[id] = 0;
                order.push(id);
            }
            counts[id] += MergeGenerator._asCount(items[i].num);
        }
        for (var oi = 0; oi < order.length; oi++) {
            var oid = order[oi];
            for (var c = 0; c < counts[oid]; c++) out.push(oid);
        }
        return out;
    }
    for (var j = 0; j < items.length; j++) {
        var count = MergeGenerator._asCount(items[j].num);
        for (var k = 0; k < count; k++) out.push(items[j].id);
    }
    return out;
};

MergeGenerator._shuffle = function (list, state) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var r = MergeGenerator._rand(state.seed);
        state.seed = r.seed;
        var j = Math.floor(r.value * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
};

MergeGenerator._weightedPick = function (weightedItems, state) {
    if (!weightedItems || weightedItems.length === 0) return null;
    var total = 0;
    for (var i = 0; i < weightedItems.length; i++) total += weightedItems[i].weight;
    if (total <= 0) return weightedItems[0].id;
    var r = MergeGenerator._rand(state.seed);
    state.seed = r.seed;
    var x = r.value * total;
    var acc = 0;
    var picked = weightedItems[0].id;
    for (var j = 0; j < weightedItems.length; j++) {
        acc += weightedItems[j].weight;
        picked = weightedItems[j].id;
        if (x < acc) break;
    }
    return picked;
};

MergeGenerator.normalizeConfig = function (raw) {
    raw = raw || {};
    var spawnType = parseInt(MergeGenerator._firstDefined(raw, ['spawnType', 'SpawnType']));
    if (spawnType !== 1 && spawnType !== 2 && spawnType !== 3 && spawnType !== 4) {
        spawnType = MergeGenerator.SpawnType.FULL_RANDOM;
    }

    var items = MergeGenerator.parseOutput(MergeGenerator._firstDefined(raw, ['output', 'Output']));
    var maxOutputCount = parseInt(MergeGenerator._firstDefined(raw, ['maxOutputCount', 'MaxOutputCount']));
    if (isNaN(maxOutputCount) || maxOutputCount <= 0) maxOutputCount = 10;

    var cfg: MergeGeneratorConfig = {
        spawnType: spawnType,
        items: items,
        maxOutputCount: maxOutputCount,
        initialSequence: MergeGenerator._parseInitialSequence(MergeGenerator._firstDefined(raw, ['initialSequence', 'InitialSequence']))
    };

    if (spawnType === MergeGenerator.SpawnType.FIXED) {
        cfg.fixedBatch = MergeGenerator._expandCountItems(items, false);
    } else if (spawnType === MergeGenerator.SpawnType.NON_RESET) {
        cfg.nonResetBatch = MergeGenerator._expandCountItems(items, true);
    } else if (spawnType === MergeGenerator.SpawnType.PRD) {
        cfg.prdId = parseInt(MergeGenerator._firstDefined(raw, ['prdId', 'PrdId']));
        cfg.prdChangeRate = MergeGenerator._asProbability(MergeGenerator._firstDefined(raw, ['prdChangeRate', 'PrdChangeRate']));
        cfg.prdBase = 0;
        cfg.prdOthers = [];
        for (var p = 0; p < items.length; p++) {
            var prob = MergeGenerator._asProbability(items[p].num);
            if (items[p].id === cfg.prdId) cfg.prdBase += prob;
            else cfg.prdOthers.push({ id: items[p].id, weight: prob });
        }
        if (cfg.prdBase > 1) cfg.prdBase = 1;
    } else {
        cfg.weightedItems = [];
        for (var w = 0; w < items.length; w++) {
            cfg.weightedItems.push({ id: items[w].id, weight: items[w].num });
        }
    }
    return cfg;
};

MergeGenerator.createState = function (config, seed) {
    var s = (seed == null) ? 1 : (seed | 0);
    s = ((s % 233280) + 233280) % 233280 || 1;
    return {
        spawnType: config ? config.spawnType : MergeGenerator.SpawnType.FULL_RANDOM,
        seed: s,
        prdMiss: 0
    };
};

MergeGenerator._result = function (pieceId, state) {
    return { pieceId: pieceId, state: state, produceState: state };
};

MergeGenerator._nextPrd = function (config, state) {
    if (config.prdId == null || isNaN(config.prdId)) {
        return MergeGenerator._nextFull(config, state);
    }
    var chance = config.prdBase + (state.prdMiss || 0) * (config.prdChangeRate || 0);
    if (chance > 1) chance = 1;
    var r = MergeGenerator._rand(state.seed);
    state.seed = r.seed;
    if (r.value < chance) {
        state.prdMiss = 0;
        return MergeGenerator._result(config.prdId, state);
    }
    state.prdMiss = (state.prdMiss || 0) + 1;
    var other = MergeGenerator._weightedPick(config.prdOthers, state);
    if (other == null) {
        state.prdMiss = 0;
        return MergeGenerator._result(config.prdId, state);
    }
    return MergeGenerator._result(other, state);
};

MergeGenerator._nextFull = function (config, state) {
    var weighted = config.weightedItems;
    if (!weighted) {
        weighted = [];
        for (var i = 0; i < (config.items || []).length; i++) {
            weighted.push({ id: config.items[i].id, weight: config.items[i].num });
        }
    }
    return MergeGenerator._result(MergeGenerator._weightedPick(weighted, state), state);
};

MergeGenerator.next = function (config, state) {
    if (!config || !config.items || config.items.length === 0) {
        return MergeGenerator._result(null, state);
    }
    if (!state) state = MergeGenerator.createState(config, 1);
    if (config.spawnType === MergeGenerator.SpawnType.PRD) return MergeGenerator._nextPrd(config, state);
    if (config.spawnType === MergeGenerator.SpawnType.FULL_RANDOM) return MergeGenerator._nextFull(config, state);

    var batch = MergeGenerator.buildOutputBatch(config, state, 1).queue;
    return MergeGenerator._result(batch.length > 0 ? batch[0] : null, state);
};

MergeGenerator.buildOutputBatch = function (config, state, count) {
    if (!config || !config.items || config.items.length === 0) {
        return { queue: [], state: state, produceState: state };
    }
    if (!state) state = MergeGenerator.createState(config, 1);

    var queue = [];
    if (config.spawnType === MergeGenerator.SpawnType.FIXED) {
        queue = (config.fixedBatch || []).slice();
    } else if (config.spawnType === MergeGenerator.SpawnType.NON_RESET) {
        queue = MergeGenerator._shuffle(config.nonResetBatch || [], state);
    } else {
        var n = parseInt(count || config.maxOutputCount);
        if (isNaN(n) || n <= 0) n = config.maxOutputCount || 10;
        for (var i = 0; i < n; i++) {
            var r = config.spawnType === MergeGenerator.SpawnType.PRD
                ? MergeGenerator._nextPrd(config, state)
                : MergeGenerator._nextFull(config, state);
            if (r.pieceId == null) break;
            queue.push(r.pieceId);
        }
    }
    return { queue: queue, state: state, produceState: state };
};

MergeGenerator.fillQueue = function (config, state, count) {
    return MergeGenerator.buildOutputBatch(config, state, count);
};

MergeGenerator.buildInitialSequence = function (config) {
    return (config && config.initialSequence) ? config.initialSequence.slice() : [];
};

if (typeof window !== 'undefined') {
    (window as MergeGeneratorWindow).MergeGenerator = MergeGenerator;
}
if (typeof Game !== 'undefined') {
    Game.MergeGenerator = MergeGenerator;
}

export default MergeGenerator;
