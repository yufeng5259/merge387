type TraceValue = null | string | number | boolean | TraceSummary | TraceValue[];

interface TraceSummary {
    [key: string]: TraceValue;
}

export interface IdentityTraceRecord {
    traceId: string;
    source: string;
    url: string;
    method: string;
    userId: unknown;
    rid: unknown;
    uuidPrefix: string;
    batch: boolean;
    beforeMethods: string[];
    methods: string[];
    currentUser: TraceSummary;
    requestBody: TraceSummary;
    createdAt: number;
}

const sensitiveKeys = /(?:authorization|cookie|pass(?:word|wd)?|secret|token|session|uuid|api[_-]?key|credential)/i;

function identityTraceId () {
    return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000000).toString(36)}`;
}

function safeUrl (url: unknown) {
    return String(url || '').split(/[?#]/, 1)[0];
}

function isIdentityError (code: unknown) {
    return code === 201 || code === 202 || code === 203;
}

function shortUuid (uuid: unknown) {
    if (uuid == null) return '';
    const text = String(uuid);
    return text.length <= 12 ? text : `${text.substring(0, 8)}...${text.substring(text.length - 4)}`;
}

function safeRead<T> (read: () => T, defaultValue: T): T {
    try {
        const value = read();
        return value == null ? defaultValue : value;
    } catch {
        return defaultValue;
    }
}

function currentUserState (): TraceSummary {
    const user = safeRead(() => Game && Game.SUser ? Game.SUser : null, null);
    if (!user) return {};
    return {
        hasUserId: !!safeRead(() => user.UserId(), 0),
        hasRid: safeRead(() => user.rid, null) != null,
        hasUuid: !!safeRead(() => user.Uuid(), ''),
        hasAccountId: !!safeRead(() => user.AccountId(), ''),
        logining: safeRead(() => user.logining, false),
        login: safeRead(() => user.login, false),
        logined: safeRead(() => user.logined, false),
    };
}

function summarizeValue (value: unknown, depth: number, key = ''): TraceValue {
    if (sensitiveKeys.test(key)) return '[redacted]';
    if (value == null || typeof value === 'number' || typeof value === 'boolean') return value as null | number | boolean;
    if (typeof value === 'string') {
        return value.length <= 120 ? value : { type: 'string', length: value.length, head: value.substring(0, 80) };
    }
    if (Array.isArray(value)) {
        const result: TraceSummary = { type: 'array', length: value.length };
        if (depth > 0) result.sample = value.slice(0, 3).map((item) => summarizeValue(item, depth - 1));
        return result;
    }
    if (typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const keys = Object.keys(record);
        if (depth <= 0) return { type: 'object', keyCount: keys.length, keys: keys.slice(0, 20) };
        const result: TraceSummary = { type: 'object', keyCount: keys.length };
        for (const childKey of keys.slice(0, 20)) {
            result[childKey] = summarizeValue(record[childKey], depth - 1, childKey);
        }
        if (keys.length > 20) result.moreKeys = keys.length - 20;
        return result;
    }
    return String(value);
}

function summarizeRequestBody (data: unknown): TraceSummary {
    const summary = summarizeValue(data || {}, 2);
    return typeof summary === 'object' && summary != null && !Array.isArray(summary) ? summary : { value: summary };
}

function telemetryRequestSummary (data: unknown): TraceSummary {
    const request = data && typeof data === 'object' ? data as Record<string, unknown> : {};
    return {
        method: request.method == null ? '' : String(request.method),
        batch: request.batch === true,
        beforeMethods: methodList(request.beforeMsgs),
        methods: methodList(request.msgs),
        keyCount: Object.keys(request).length,
        keys: Object.keys(request).filter((key) => !sensitiveKeys.test(key)).slice(0, 20),
    };
}

function telemetryResponseSummary (response: unknown): TraceSummary {
    const value = response && typeof response === 'object' ? response as Record<string, unknown> : {};
    return {
        errorCode: typeof value.errorCode === 'number' || typeof value.errorCode === 'string' ? value.errorCode : '',
        hasMessage: value.msg != null && String(value.msg).length > 0,
        messageLength: value.msg == null ? 0 : String(value.msg).length,
        keyCount: Object.keys(value).length,
        keys: Object.keys(value).filter((key) => !sensitiveKeys.test(key)).slice(0, 20),
    };
}

function methodList (list: unknown): string[] {
    if (!Array.isArray(list)) return [];
    return list.map((item) => item && item.method ? String(item.method) : 'unknown');
}

function buildTrace (url: string, data?: Record<string, unknown>, source?: string): IdentityTraceRecord {
    const request = data || {};
    return {
        traceId: identityTraceId(),
        source: source || 'request',
        url: safeUrl(url),
        method: String(request.method || ''),
        userId: request.userId == null ? '[missing]' : '[present]',
        rid: request.rid == null ? '[missing]' : '[present]',
        uuidPrefix: request.uuid == null ? '[missing]' : '[present]',
        batch: request.batch === true,
        beforeMethods: methodList(request.beforeMsgs),
        methods: methodList(request.msgs),
        currentUser: currentUserState(),
        requestBody: telemetryRequestSummary(request),
        createdAt: Math.floor(Date.now() / 1000),
    };
}

function logEvent (name: string, payload: Record<string, unknown>) {
    try {
        if (typeof AppKit !== 'undefined' && AppKit.LogEventWrap?.logEvent) AppKit.LogEventWrap.logEvent(name, payload);
    } catch {
        // Telemetry must never interrupt the request path.
    }
}

function logRequest (trace: IdentityTraceRecord) {
    console.warn('[IdentityTrace][request]', {
        traceId: trace.traceId,
        source: trace.source,
        url: trace.url,
        method: trace.method,
        batch: trace.batch,
        beforeMethods: trace.beforeMethods,
        methods: trace.methods,
    });
}

function logResponse (label: string, trace: IdentityTraceRecord | null, response: Record<string, unknown>, requestBody: unknown) {
    const payload = {
        trace: trace || {},
        response: telemetryResponseSummary(response),
        requestBody: telemetryRequestSummary(requestBody),
        currentUser: currentUserState(),
    };
    console.warn(`[IdentityTrace][${label}]`, payload);
    logEvent('identity_trace_error', {
        label,
        traceId: trace?.traceId,
        method: trace?.method,
        code: response?.errorCode,
        hasMessage: response?.msg != null,
        messageLength: response?.msg == null ? 0 : String(response.msg).length,
    });
}

function logNetFail (label: string, trace: IdentityTraceRecord | null, error: unknown, requestBody: unknown) {
    console.warn(`[IdentityTrace][${label}]`, {
        trace: trace || {},
        error: telemetryResponseSummary(error),
        requestBody: telemetryRequestSummary(requestBody),
        currentUser: currentUserState(),
    });
}

const IdentityTrace = {
    BuildTrace: buildTrace,
    CurrentUserState: currentUserState,
    IsIdentityError: isIdentityError,
    LogRequest: logRequest,
    LogResponse: logResponse,
    LogNetFail: logNetFail,
    SafeUrl: safeUrl,
    ShortUuid: shortUuid,
    SummarizeRequestBody: summarizeRequestBody,
    TelemetryRequestSummary: telemetryRequestSummary,
    TelemetryResponseSummary: telemetryResponseSummary,
};

export default IdentityTrace;
