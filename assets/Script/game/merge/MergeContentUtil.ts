export const MergeContentUtil: any = {};

MergeContentUtil.CASH_TYPE = 7;
MergeContentUtil.DEFAULT_CID = 0;

MergeContentUtil.isBlankCost = function (value) {
    return value === undefined || value === null || String(value).trim() === '' || String(value).trim() === '0';
};

MergeContentUtil.readField = function (source, keys) {
    if (!source) return undefined;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = source[key];
        if (value !== undefined && value !== null && value !== '') return value;
    }
    for (var k in source) {
        var normalized = String(k || '').replace(/[\s_\-]/g, '').toLowerCase();
        for (var j = 0; j < keys.length; j++) {
            if (normalized === String(keys[j]).replace(/[\s_\-]/g, '').toLowerCase()) {
                var v = source[k];
                if (v !== undefined && v !== null && v !== '') return v;
            }
        }
    }
    return undefined;
};

MergeContentUtil.normalizeOne = function (value, defaultType) {
    if (MergeContentUtil.isBlankCost(value)) return null;
    defaultType = defaultType || MergeContentUtil.CASH_TYPE;

    if (typeof value === 'number') {
        if (!isFinite(value) || value <= 0) return null;
        return { type: defaultType, cid: MergeContentUtil.DEFAULT_CID, count: value };
    }

    if (typeof value === 'string') {
        var text = value.trim();
        if (MergeContentUtil.isBlankCost(text)) return null;
        if (text.indexOf('=') === -1) {
            var amount = parseFloat(text);
            if (isNaN(amount) || amount <= 0) return null;
            return { type: defaultType, cid: MergeContentUtil.DEFAULT_CID, count: amount };
        }
        var parts = text.split('=');
        if (parts.length < 3) return null;
        var type = parseInt(parts[0]);
        var cid = parseInt(parts[1]);
        var count = parseFloat(parts[2]);
        if (isNaN(type) || isNaN(cid) || isNaN(count) || count <= 0) return null;
        return { type: type, cid: cid, count: count };
    }

    if (Array.isArray(value)) {
        return null;
    }

    if (typeof value === 'object') {
        var raw = MergeContentUtil.readField(value, ['value', 'v', 'num', 'count', 'Count', 'amount', 'price', 'cost']);
        var typeValue = MergeContentUtil.readField(value, ['type', 'Type', 'contentType', 'ContentType']);
        var cidValue = MergeContentUtil.readField(value, ['cid', 'id', 'Id', 'contentId', 'ContentId']);
        if (typeValue !== undefined || cidValue !== undefined) {
            var objectType = parseInt(typeValue == null ? defaultType : typeValue);
            var objectCid = parseInt(cidValue == null ? MergeContentUtil.DEFAULT_CID : cidValue);
            var objectCount = parseFloat(raw);
            if (isNaN(objectType) || isNaN(objectCid) || isNaN(objectCount) || objectCount <= 0) return null;
            return { type: objectType, cid: objectCid, count: objectCount };
        }
        return MergeContentUtil.normalizeOne(raw, defaultType);
    }

    return null;
};

MergeContentUtil.normalizeList = function (value, defaultType) {
    if (MergeContentUtil.isBlankCost(value)) return [];
    if (Array.isArray(value)) {
        var list = [];
        for (var i = 0; i < value.length; i++) {
            list = list.concat(MergeContentUtil.normalizeList(value[i], defaultType));
        }
        return list;
    }
    if (typeof value === 'string' && value.indexOf(';') !== -1) {
        var parts = value.split(';');
        var result = [];
        for (var j = 0; j < parts.length; j++) {
            result = result.concat(MergeContentUtil.normalizeList(parts[j], defaultType));
        }
        return result;
    }
    var one = MergeContentUtil.normalizeOne(value, defaultType);
    return one ? [one] : [];
};

MergeContentUtil.toContentString = function (value, defaultType) {
    var list = MergeContentUtil.normalizeList(value, defaultType);
    if (list.length === 0) return '';
    var parts = [];
    for (var i = 0; i < list.length; i++) {
        parts.push(list[i].type + '=' + list[i].cid + '=' + list[i].count);
    }
    return parts.join(';');
};

if (typeof window !== 'undefined') {
    (window as any).MergeContentUtil = MergeContentUtil;
}
if (typeof Game !== 'undefined') {
    Game.MergeContentUtil = MergeContentUtil;
}
if (typeof global !== 'undefined') {
    global.MergeContentUtil = MergeContentUtil;
}

export default MergeContentUtil;
