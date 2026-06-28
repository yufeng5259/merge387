'use strict';

var http = require('http');
var path = require('path');
var urlModule = require('url');
var toolRegistry = require('./tools/index');
var logger = require('./util/logger');
var commandQueue = require('./util/commandQueue');
var versionInfo = require('./util/versionInfo');
var editorHelpers = require('./util/editorHelpers');

var httpServer = null;
var config = { port: 6800, host: '127.0.0.1', autoStart: true, platform: 'codex' };
var stdioStatus = { verified: null, toolCount: 0, error: '' };
var MAX_BODY_SIZE = 5 * 1024 * 1024;
global.__COCOS_MCP_SERVER_CONFIG__ = config;

function reloadModules() {
  var root = path.resolve(__dirname, 'tools');
  var utilRoot = path.resolve(__dirname, 'util');
  Object.keys(require.cache).forEach(function (file) {
    var resolved = path.resolve(file);
    if (resolved.indexOf(root) === 0 || resolved.indexOf(utilRoot) === 0) {
      delete require.cache[file];
    }
  });
  logger = require('./util/logger');
  toolRegistry = require('./tools/index');
  commandQueue = require('./util/commandQueue');
  versionInfo = require('./util/versionInfo');
  editorHelpers = require('./util/editorHelpers');
}

function getCompatibilityInfo() {
  var editorVersion = '';
  var profileCounts = toolRegistry.listProfiles ? toolRegistry.listProfiles() : null;
  try { editorVersion = Editor.App.version; } catch (e) {}
  return versionInfo.getVersionInfo({
    editorVersion: editorVersion,
    toolCount: toolRegistry.listAll({ profile: 'core' }).length,
    toolProfile: 'core',
    toolProfileCounts: profileCounts,
    configPath: config._lastConfigPath || '',
    platform: config.platform || '',
  });
}

function getRequestProfile(req) {
  try {
    var parsed = urlModule.parse(req.url, true);
    return parsed && parsed.query && parsed.query.profile || 'core';
  } catch (e) {
    return 'core';
  }
}

function getEffectivePort(requestedPort) {
  if (httpServer) return config.port;
  return Number(requestedPort || config.port || 6800);
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function pathExists(fs, target) {
  try { return fs.existsSync(target); } catch (e) { return false; }
}

function getWorkspaceRoot(fs, cocosRoot) {
  var parent = path.dirname(cocosRoot);
  var projectMarkers = ['.git', '.mcp.json', '.cursor'];
  for (var i = 0; i < projectMarkers.length; i++) {
    if (pathExists(fs, path.join(cocosRoot, projectMarkers[i]))) return cocosRoot;
  }
  for (var j = 0; j < projectMarkers.length; j++) {
    if (pathExists(fs, path.join(parent, projectMarkers[j]))) return parent;
  }
  return cocosRoot;
}

function getRelativeStdioPath(workspaceRoot, cocosRoot) {
  var stdioPath = path.join(cocosRoot, 'extensions', 'cocos-creator-38-mcp', 'stdio-server', 'index.js');
  var rel = path.relative(workspaceRoot, stdioPath).replace(/\\/g, '/');
  return rel && rel.indexOf('..') !== 0 ? rel : stdioPath.replace(/\\/g, '/');
}


function truthyProfileValue(value, fallback) {
  if (value === undefined || value === null || value === '') return !!fallback;
  if (value === true || value === 'true' || value === '1' || value === 1) return true;
  if (value === false || value === 'false' || value === '0' || value === 0) return false;
  return !!value;
}

function readJsonBody(req, res, callback) {
  var chunks = [];
  var total = 0;
  var aborted = false;

  req.on('data', function (chunk) {
    if (aborted) return;
    total += chunk.length;
    if (total > MAX_BODY_SIZE) {
      aborted = true;
      logger.log('warn', 'HTTP request body too large: ' + total + ' bytes');
      sendJson(res, 413, { error: 'Request body too large (max ' + MAX_BODY_SIZE + ' bytes)' });
      try { req.destroy(); } catch (e) {}
      return;
    }
    chunks.push(chunk);
  });

  req.on('end', function () {
    if (aborted) return;
    try {
      callback(null, JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
    } catch (e) {
      callback(e);
    }
  });
}

function createMcpFrameParser(onMessage) {
  var buffer = Buffer.alloc(0);
  return function (chunk) {
    buffer = Buffer.concat([buffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8')]);
    while (buffer.length > 0) {
      var headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd !== -1) {
        var header = buffer.slice(0, headerEnd).toString('utf8');
        var match = header.match(/content-length:\s*(\d+)/i);
        if (!match) {
          buffer = buffer.slice(headerEnd + 4);
          continue;
        }
        var len = Number(match[1]);
        var bodyStart = headerEnd + 4;
        if (buffer.length < bodyStart + len) return;
        var body = buffer.slice(bodyStart, bodyStart + len).toString('utf8');
        buffer = buffer.slice(bodyStart + len);
        try { onMessage(JSON.parse(body)); } catch (e) {}
        continue;
      }

      var newline = buffer.indexOf('\n');
      if (newline === -1) return;
      var line = buffer.slice(0, newline).toString('utf8').trim();
      buffer = buffer.slice(newline + 1);
      if (!line || line.indexOf('{') !== 0) continue;
      try { onMessage(JSON.parse(line)); } catch (e) {}
    }
  };
}

function writeMcpRequest(child, rpc) {
  child.stdin.write(JSON.stringify(rpc) + '\n');
}

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  var url = req.url.split('?')[0];

  if (req.method === 'GET' && url === '/api/ping') {
    sendJson(res, 200, { ok: true, version: getCompatibilityInfo().version });
    return;
  }

  if (req.method === 'GET' && url === '/api/status') {
    (async function () {
      var sceneName = '';
      try { sceneName = Editor.Scene && Editor.Scene.uuid || ''; } catch (e) {}
      sendJson(res, 200, {
        running: true,
        version: getCompatibilityInfo().version,
        compatibility: getCompatibilityInfo(),
        currentScene: sceneName,
        projectPath: Editor.Project ? Editor.Project.path : '',
        port: config.port,
        platform: config.platform,
        configPath: config._lastConfigPath || '',
        queue: {
          length: commandQueue.getLength(),
          processing: commandQueue.isProcessing(),
          maxLength: commandQueue.getMaxLength(),
        },
        toolProfile: 'core',
        toolProfileCounts: toolRegistry.listProfiles ? toolRegistry.listProfiles() : null,
        tools: toolRegistry.listAll({ profile: 'core' }).map(function (t) { return t.name; }),
      });
    })();
    return;
  }

  if (req.method === 'GET' && url === '/api/tools') {
    var profile = getRequestProfile(req);
    sendJson(res, 200, {
      profile: profile,
      defaultProfile: 'core',
      profileCounts: toolRegistry.listProfiles ? toolRegistry.listProfiles() : null,
      tools: toolRegistry.listAll({ profile: profile }),
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/reload') {
    try {
      reloadModules();
      logger.log('info', 'MCP modules reloaded through /api/reload');
      sendJson(res, 200, {
        ok: true,
        tools: toolRegistry.listAll({ profile: 'core' }).length,
        toolProfileCounts: toolRegistry.listProfiles ? toolRegistry.listProfiles() : null,
        reloaded: ['tools', 'util'],
        note: 'HTTP route changes in main.js require restarting the MCP service.',
      });
    } catch (e) {
      logger.log('error', 'MCP module reload failed: ' + e.message);
      sendJson(res, 500, { ok: false, error: e.message });
    }
    return;
  }

  if (req.method === 'POST' && url === '/api/verify_stdio') {
    _verifyStdioServer();
    sendJson(res, 200, { ok: true, status: getStdioStatusPayload() });
    return;
  }

  if (req.method === 'POST' && url === '/api/build-install-package') {
    readJsonBody(req, res, function (err, body) {
      if (err) {
        sendJson(res, 400, { error: 'Invalid JSON: ' + err.message });
        return;
      }
      toolRegistry.call('build_install_package', body || {}).then(function (result) {
        sendJson(res, 200, { result: result });
      }).catch(function (e) {
        sendJson(res, 200, { error: e.message });
      });
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/tool') {
    readJsonBody(req, res, function (err, body) {
      if (err) {
        sendJson(res, 400, { error: 'Invalid JSON: ' + err.message });
        return;
      }
      var name = body.name || body.tool || body.toolName;
      var args = body.arguments !== undefined ? body.arguments : (body.args !== undefined ? body.args : {});
      if (!args || typeof args !== 'object' || Array.isArray(args)) {
        sendJson(res, 400, { error: '"arguments" or "args" must be a JSON object' });
        return;
      }

      if (!name) {
        sendJson(res, 400, { error: 'Missing "name", "tool", or "toolName" field' });
        return;
      }

      if (commandQueue.getLength() >= commandQueue.getMaxLength()) {
        sendJson(res, 429, { error: 'Scene command queue full, retry later' });
        return;
      }

      toolRegistry.call(name, args).then(function (result) {
        sendJson(res, 200, { result: result });
      }).catch(function (e) {
        sendJson(res, 200, { error: e.message });
      });
    });
    return;
  }

  if (req.method === 'POST' && url === '/mcp') {
    readJsonBody(req, res, function (err, rpc) {
      if (err) {
        sendJson(res, 400, { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null });
        return;
      }
      handleLegacyRpc(rpc).then(function (result) {
        sendJson(res, 200, result);
      }).catch(function (e) {
        sendJson(res, 400, { jsonrpc: '2.0', error: { code: -32700, message: e.message }, id: null });
      });
    });
    return;
  }

  sendJson(res, 404, { error: 'Not found. Available: GET /api/ping, GET /api/status, GET /api/tools, POST /api/tool, POST /api/verify_stdio, POST /api/build-install-package' });
}

async function handleLegacyRpc(rpc) {
  var id = rpc.id;
  var method = rpc.method;
  var params = rpc.params || {};

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0', id: id,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: { name: 'cocos-creator-38-mcp', version: getCompatibilityInfo().version },
        capabilities: { tools: {} },
      },
    };
  }
  if (method === 'notifications/initialized') return {};
  if (method === 'ping') return { jsonrpc: '2.0', id: id, result: {} };
  if (method === 'tools/list') {
    return { jsonrpc: '2.0', id: id, result: { tools: toolRegistry.listAll({ profile: 'core' }) } };
  }
  if (method === 'tools/call') {
    try {
      var result = await toolRegistry.call(params.name, params.arguments || {});
      return { jsonrpc: '2.0', id: id, result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] } };
    } catch (e) {
      return { jsonrpc: '2.0', id: id, result: { content: [{ type: 'text', text: 'Error: ' + e.message }], isError: true } };
    }
  }
  return { jsonrpc: '2.0', id: id, error: { code: -32601, message: 'Method not found: ' + method } };
}

function _start() {
  if (httpServer) {
    console.log('[MCP] Server already running on port ' + config.port);
    try {
      Editor.Message.send('cocos-creator-38-mcp', 'status-changed', { running: true, port: config.port, platform: config.platform });
    } catch (e) {}
    return;
  }

  try {
    reloadModules();
    logger.log('info', 'MCP modules reloaded');
  } catch (e) {
    console.error('[MCP] Failed to reload modules: ' + e.message);
    return;
  }

  function tryStart(port, retriesLeft) {
    config.port = port;
    httpServer = http.createServer(handleRequest);
    httpServer.on('error', function (err) {
      try { httpServer.close(); } catch (e) {}
      httpServer = null;

      if (err && err.code === 'EADDRINUSE' && retriesLeft > 0) {
        var nextPort = port + 1;
        logger.log('warn', 'Port ' + port + ' is in use, trying ' + nextPort);
        setTimeout(function () { tryStart(nextPort, retriesLeft - 1); }, 100);
        return;
      }

      console.error('[MCP] Failed to start: ' + err.message);
      logger.log('error', err.message);
      try {
        Editor.Message.send('cocos-creator-38-mcp', 'status-changed', { running: false, error: err.message });
      } catch (e) {}
    });

    httpServer.listen(config.port, config.host, function () {
      _writeMcpConfig();
      try { Editor.Profile.setConfig('cocos-creator-38-mcp', 'port', config.port, 'project'); } catch (e) {}
      var msg = 'HTTP bridge started [' + config.platform + ']: http://' + config.host + ':' + config.port;
      console.log('[MCP] ' + msg);
      logger.log('info', msg);
      try {
        Editor.Message.send('cocos-creator-38-mcp', 'status-changed', { running: true, port: config.port, platform: config.platform, configPath: config._lastConfigPath });
      } catch (e) {}
      _verifyStdioServer();
    });
  }

  tryStart(config.port, 10);
}

function _writeMcpConfig() {
  var fs = require('fs');
  var cocosRoot = Editor.Project ? Editor.Project.path : '';
  if (!cocosRoot) return;

  var workspaceRoot = getWorkspaceRoot(fs, cocosRoot);
  var platform = config.platform || 'codex';
  var stdioCmdPath = getRelativeStdioPath(workspaceRoot, cocosRoot);
  var mcpJson = {
    mcpServers: {
      'cocos-creator-38-mcp': {
        command: 'node',
        args: [stdioCmdPath, '--port', String(config.port)],
        env: {}
      }
    }
  };

  var targetPath;
  if (platform === 'cursor') {
    var cursorDir = path.join(workspaceRoot, '.cursor');
    if (!fs.existsSync(cursorDir)) { try { fs.mkdirSync(cursorDir, { recursive: true }); } catch (e) {} }
    targetPath = path.join(cursorDir, 'mcp.json');
  } else {
    targetPath = path.join(workspaceRoot, '.mcp.json');
  }

  try {
    fs.writeFileSync(targetPath, JSON.stringify(mcpJson, null, 2), 'utf8');
    config._lastConfigPath = path.relative(workspaceRoot, targetPath).replace(/\\/g, '/');
    logger.log('info', 'MCP config written → ' + config._lastConfigPath + ' [' + platform + ']');
  } catch (e) {
    logger.log('error', 'Failed to write MCP config: ' + e.message);
  }

}

function _verifyStdioServer() {
  var spawn = require('child_process').spawn;
  var cocosRoot = Editor.Project ? Editor.Project.path : '';
  if (!cocosRoot) {
    logger.log('error', 'stdio 验证跳过: 无法获取项目路径');
    return;
  }

  stdioStatus = { verified: null, toolCount: 0, error: '' };
  logger.log('info', '正在验证 stdio MCP 服务...');
  _notifyPanel();

  var stdioPaths = path.join(cocosRoot, 'extensions', 'cocos-creator-38-mcp', 'stdio-server', 'index.js');
  var child;
  try {
    child = spawn('node', [stdioPaths, '--port', String(config.port)], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: path.dirname(cocosRoot),
      windowsHide: true
    });
  } catch (e) {
    var errMsg = '无法启动进程 — ' + e.message;
    stdioStatus = { verified: false, toolCount: 0, error: errMsg };
    logger.log('error', 'stdio 验证失败: ' + errMsg);
    _notifyPanel();
    return;
  }

  var stdout = '';
  var stderr = '';
  var done = false;
  var sawServerInfo = false;
  var timer = setTimeout(function () {
    if (done) return;
    done = true;
    try { child.kill(); } catch (e) {}
    stdioStatus = { verified: false, toolCount: 0, error: '验证超时 (5s)' };
    var timeoutMsg = 'stdio 验证超时 (5s)';
    if (stderr) timeoutMsg += ' — ' + stderr.substring(0, 200);
    logger.log('error', timeoutMsg);
    _notifyPanel();
  }, 5000);

  var parseStdout = createMcpFrameParser(function (resp) {
    if (resp.result && resp.result.serverInfo && !sawServerInfo) {
      sawServerInfo = true;
      try {
        writeMcpRequest(child, { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
      } catch (e) {}
    }
    if (resp.result && resp.result.tools) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      var toolCount = resp.result.tools.length;
      stdioStatus = { verified: true, toolCount: toolCount, error: '' };
      var okMsg = '✓ stdio MCP 服务验证成功 (' + toolCount + ' 个工具)';
      logger.log('success', okMsg);
      console.log('[MCP] ' + okMsg);
      try { child.kill(); } catch (e) {}
      _notifyPanel();
    }
  });

  child.stdout.on('data', function (data) {
    stdout += data.toString('utf8');
    parseStdout(data);
  });

  child.stderr.on('data', function (data) { stderr += data.toString('utf8'); });

  child.on('error', function (err) {
    if (done) return;
    done = true;
    clearTimeout(timer);
    stdioStatus = { verified: false, toolCount: 0, error: err.message };
    logger.log('error', 'stdio 验证失败: ' + err.message);
    _notifyPanel();
  });

  child.on('exit', function (code) {
    if (done) return;
    done = true;
    clearTimeout(timer);
    var errMsg = '进程退出 (code: ' + code + ')';
    if (stderr) errMsg += ' — ' + stderr.substring(0, 200);
    stdioStatus = { verified: false, toolCount: 0, error: errMsg };
    logger.log('error', 'stdio 验证失败: ' + errMsg);
    _notifyPanel();
  });

  try {
    writeMcpRequest(child, {
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'cocos-mcp-verifier', version: getCompatibilityInfo().version }
      }
    });
  } catch (e) {}
}

function _notifyPanel() {
  var status = getStdioStatusPayload();
  try {
    Editor.Message.send('cocos-creator-38-mcp', 'status-changed', status);
  } catch (e) {}
}

function getStdioStatusPayload() {
  var status = {
    running: !!httpServer, port: config.port, platform: config.platform,
    configPath: config._lastConfigPath || '',
    compatibility: getCompatibilityInfo(),
  };
  if (stdioStatus.verified === true) {
    status.stdioVerified = true;
    status.stdioToolCount = stdioStatus.toolCount;
  } else if (stdioStatus.verified === false) {
    status.stdioVerified = false;
    status.stdioError = stdioStatus.error;
  }
  return status;
}

function _stop() {
  if (!httpServer) return;
  try { httpServer.close(); } catch (e) {}
  httpServer = null;
  console.log('[MCP] Server stopped');
  logger.log('info', 'Server stopped');
  try {
    Editor.Message.send('cocos-creator-38-mcp', 'status-changed', { running: false });
  } catch (e) {}
}

// ─── Cocos Creator 3.8 Extension Exports ─────────────────────

exports.methods = {
  start: function () { _start(); },
  stop: function () { _stop(); },
  restart: function () {
    _stop();
    setTimeout(function () { _start(); }, 300);
  },
  openPanel: function () { Editor.Panel.open('cocos-creator-38-mcp'); },

  getStatus: function () {
    var status = {
      running: !!httpServer,
      port: config.port,
      autoStart: config.autoStart,
      platform: config.platform,
      configPath: config._lastConfigPath || '',
      compatibility: getCompatibilityInfo(),
      toolProfile: 'core',
      toolProfileCounts: toolRegistry.listProfiles ? toolRegistry.listProfiles() : null,
      tools: toolRegistry.listAll({ profile: 'core' }),
    };
    if (stdioStatus.verified === true) {
      status.stdioVerified = true;
      status.stdioToolCount = stdioStatus.toolCount;
    } else if (stdioStatus.verified === false) {
      status.stdioVerified = false;
      status.stdioError = stdioStatus.error;
    }
    return status;
  },

  getLogs: function (opts) {
    return logger.getLogs(opts);
  },

  clearLogs: function () {
    logger.clear();
    return true;
  },

  setConfig: async function (cfg) {
    if (cfg) {
      if (cfg.port != null) config.port = Number(cfg.port);
      if (cfg.autoStart != null) config.autoStart = truthyProfileValue(cfg.autoStart, true);
      if (cfg.platform != null) config.platform = cfg.platform;

      try {
        await Editor.Profile.setConfig('cocos-creator-38-mcp', 'port', config.port, 'project');
        await Editor.Profile.setConfig('cocos-creator-38-mcp', 'autoStart', config.autoStart, 'project');
        await Editor.Profile.setConfig('cocos-creator-38-mcp', 'platform', config.platform, 'project');
      } catch (e) {}
    }
    return config;
  },

  buildInstallPackage: async function (opts) {
    opts = opts || {};
    try {
      var result = await toolRegistry.call('build_install_package', opts);
      logger.log(result.ok ? 'success' : 'error', 'Build install package ' + (result.ok ? 'ok' : 'failed'));
      return result;
    } catch (e) {
      logger.log('error', 'Build install package failed: ' + e.message);
      throw e;
    }
  },

  selectCocosEngineSource: async function () {
    try {
      var startPath = '';
      try {
        var current = editorHelpers.getCocosEnginePaths({});
        startPath = current && (current.manualPath || current.sourceRoot) || '';
      } catch (e) {}
      if (!startPath) {
        try { startPath = Editor.Project.path || ''; } catch (e2) {}
      }
      var selected = await Editor.Dialog.select({
        path: startPath,
        type: 'directory',
      });
      var selectedPath = selected && selected.filePaths && selected.filePaths[0];
      if (!selectedPath) {
        return { ok: false, success: false, status: 'cancelled', cancelled: true };
      }
      var result = editorHelpers.writeCocosEnginePathsDocs({
        path: selectedPath,
        source: 'mcp-panel-manual',
      });
      logger.log(result.ok ? 'success' : 'warn', 'Manual Cocos engine source path configured: ' + selectedPath);
      return result;
    } catch (e) {
      logger.log('error', 'Select Cocos engine source failed: ' + (e.message || String(e)));
      return { ok: false, success: false, status: 'failed', error: e.message || String(e) };
    }
  },

  getLogFilesStatus: function () {
    return logger.getLogFilesStatus();
  },

  clearLogFiles: function () {
    return logger.clearLogFiles();
  },
};

exports.load = async function () {
  console.log('[MCP] Plugin v' + getCompatibilityInfo().version + ' loaded (Cocos Creator 3.8)');
  logger.log('info', 'MCP plugin loaded');

  try {
    var port = await Editor.Profile.getConfig('cocos-creator-38-mcp', 'port', 'project');
    var autoStart = await Editor.Profile.getConfig('cocos-creator-38-mcp', 'autoStart', 'project');
    var platform = await Editor.Profile.getConfig('cocos-creator-38-mcp', 'platform', 'project');
    if (port) config.port = Number(port);
    config.autoStart = truthyProfileValue(autoStart, true);
    try { await Editor.Profile.setConfig('cocos-creator-38-mcp', 'autoStart', config.autoStart, 'project'); } catch (e) {}
    if (platform) config.platform = String(platform);
  } catch (e) {
    console.warn('[MCP] Failed to load profile config, using defaults:', e.message || e);
  }

  if (config.autoStart) {
    setTimeout(function () {
      if (!httpServer) _start();
    }, 1000);
  }
};

exports.unload = function () {
  _stop();
  console.log('[MCP] Plugin unloaded');
};
