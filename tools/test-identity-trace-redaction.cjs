const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const file = 'assets/Script/Web/IdentityTrace.ts';
const source = fs.readFileSync(file, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: file,
}).outputText;
const sandboxModule = { exports: {} };
const sinkValues = [];
const sandbox = {
  module: sandboxModule,
  exports: sandboxModule.exports,
  console: { warn(...args) { sinkValues.push(args); } },
  AppKit: { LogEventWrap: { logEvent(...args) { sinkValues.push(args); } } },
  Game: { SUser: {
    UserId: () => 'USER_SECRET',
    GetRequestId: () => 'RID_SECRET',
    Uuid: () => 'UUID_SECRET',
    AccountId: () => 'ACCOUNT_SECRET',
    Source: () => 'SOURCE_SECRET',
    rid: 'RID_SECRET',
    logining: false,
    login: true,
    logined: true,
  } },
  Date,
  Math,
};
vm.runInNewContext(compiled, sandbox, { filename: file });
const trace = sandboxModule.exports.default;
function loadModule(moduleFile, requires) {
  const moduleSource = fs.readFileSync(moduleFile, 'utf8');
  const output = ts.transpileModule(moduleSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: moduleFile,
  }).outputText;
  const loaded = { exports: {} };
  sandbox.module = loaded;
  sandbox.exports = loaded.exports;
  sandbox.require = (name) => requires[name] || {};
  vm.runInNewContext(`(function (exports, module, require) { ${output}\n})(exports, module, require);`, sandbox, { filename: moduleFile });
  return loaded.exports.default;
}

let lastRequest;
class XMLHttpRequestStub {
  constructor() { lastRequest = this; this.readyState = 4; this.status = 500; }
  open() {}
  setRequestHeader() {}
  send() {}
}
Object.assign(sandbox, {
  Logs: {
    Debug(...args) { sinkValues.push(args); },
    Warning(...args) { sinkValues.push(args); },
  },
  LoadingWindow: { Show() {}, Hide() {} },
  XMLHttpRequest: XMLHttpRequestStub,
  wxTools: { usewx: false },
  G: { GameConfig: { server: 'https://example.test/api?token=URL_SECRET' } },
  pako: { gzip: (value) => value },
  encryptCode: {
    stringToBytes: (value) => value,
    simplecode: (value) => value,
  },
  ErrorCode: {
    SUCCESS: 0,
    UNKNOWN_CLIENT: -1,
    muteError: () => true,
    tipError: () => false,
  },
  UIRoot: { instance: { openChildWindow() {} } },
  GameKit: {
    TimeUtil: { UpdateServerTime() {}, getCurrentTime: () => 0 },
    i18n: { t: (key) => key },
  },
  AppGame: { instance: { logout() {} } },
});
const identityModule = { __esModule: true, default: trace };
const NetRequest = loadModule('assets/Script/Web/NetRequest.ts', { './IdentityTrace': identityModule });
const netRequest = new NetRequest('https://example.test/api?token=URL_SECRET');
netRequest.SetRequestBody('method', 'netMethod');
netRequest.SetRequestBody('genericValue', 'GENERIC_REQUEST_SECRET');
netRequest.Send();
lastRequest.onerror({ code: -1, detail: 'GENERIC_ERROR_SECRET' });

const BatchRequest = loadModule('assets/Script/Web/BatchRequest.ts', {
  './IdentityTrace': identityModule,
  './WebEvent': { default: {} },
  '../GameKit/i18n/i18n': { i18n: { t: (key) => key } },
});
const batchRequest = new BatchRequest([{ data: { method: 'batchMethod', genericValue: 'GENERIC_REQUEST_SECRET' }, okCallback: () => true }]);
batchRequest.Send();
lastRequest.onerror({ code: -1, detail: 'GENERIC_ERROR_SECRET' });
batchRequest.okCallback({ errorCode: 201, msg: 'MESSAGE_SECRET', timestamp: 0 });

const ServerRequest = loadModule('assets/Script/Web/ServerRequest.ts', {
  './IdentityTrace': identityModule,
  './NetRequest': { __esModule: true, default: NetRequest },
  './WebEvent': { default: { EventName: {}, DispatcherEvent() {} } },
  '../GameKit/i18n/i18n': { i18n: { t: (key) => key } },
});
const serverRequest = Object.create(ServerRequest.prototype);
Object.assign(serverRequest, {
  data: { method: 'serverMethod', genericValue: 'GENERIC_REQUEST_SECRET' },
  identityTrace: trace.BuildTrace('https://example.test/api?token=URL_SECRET', {}, 'server'),
  serverErrorCallbacks: [],
  callbacks: [],
});
serverRequest.okCallback({ errorCode: 201, msg: 'MESSAGE_SECRET', timestamp: 0 });
const request = {
  method: 'login',
  authToken: 'AUTH_SECRET',
  idToken: 'ID_SECRET',
  nested: { api_key: 'API_SECRET', passwordHash: 'PASS_SECRET', safe: 'visible' },
  msgs: [{ method: 'child', credentialValue: 'CREDENTIAL_SECRET' }],
  genericValue: 'GENERIC_REQUEST_SECRET',
};
const diagnostic = JSON.stringify(trace.SummarizeRequestBody(request));
const telemetry = JSON.stringify(trace.TelemetryRequestSummary(request));
const record = trace.BuildTrace('https://example.test/api?token=URL_SECRET', request, 'test');
trace.LogRequest(record);
trace.LogResponse('response', record, { errorCode: 201, msg: 'MESSAGE_SECRET', data: 'GENERIC_RESPONSE_SECRET' }, request);
trace.LogNetFail('failure', record, { code: -1, detail: 'GENERIC_ERROR_SECRET' }, request);
const sinks = JSON.stringify(sinkValues);
for (const secret of ['AUTH_SECRET', 'ID_SECRET', 'API_SECRET', 'PASS_SECRET', 'CREDENTIAL_SECRET']) {
  assert(!diagnostic.includes(secret), `diagnostic leaked ${secret}`);
  assert(!telemetry.includes(secret), `telemetry leaked ${secret}`);
}
for (const secret of ['AUTH_SECRET', 'ID_SECRET', 'API_SECRET', 'PASS_SECRET', 'CREDENTIAL_SECRET', 'GENERIC_REQUEST_SECRET', 'GENERIC_RESPONSE_SECRET', 'GENERIC_ERROR_SECRET', 'MESSAGE_SECRET', 'URL_SECRET', 'USER_SECRET', 'UUID_SECRET', 'ACCOUNT_SECRET', 'SOURCE_SECRET', 'RID_SECRET']) {
  assert(!sinks.includes(secret), `logging sink leaked ${secret}`);
}
assert(telemetry.includes('login'));
assert(telemetry.includes('child'));
assert(!telemetry.includes('authToken'));
assert(!telemetry.includes('idToken'));
console.log('identity trace redaction: PASS');
