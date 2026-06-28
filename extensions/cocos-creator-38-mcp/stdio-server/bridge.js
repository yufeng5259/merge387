'use strict';

class EditorBridge {
  constructor(port, options) {
    this.port = port || 6800;
    options = options || {};
    this.host = options.host || '127.0.0.1';
    this.scanStart = options.scanStart || 6800;
    this.scanEnd = options.scanEnd || 6810;
    this.activePort = null;
    this.baseUrl = 'http://' + this.host + ':' + this.port;
    this._pingCache = null;
    this._pingCacheTime = 0;
  }

  setPort(port) {
    this.port = Number(port) || this.port;
    this.baseUrl = 'http://' + this.host + ':' + this.port;
    this.invalidateCache();
  }

  setActiveInstance(port) {
    this.activePort = Number(port) || null;
    if (this.activePort) this.setPort(this.activePort);
    return this.activePort;
  }

  async ping() {
    var now = Date.now();
    if (this._pingCache !== null && now - this._pingCacheTime < 2000) {
      return this._pingCache;
    }
    try {
      var resp = await fetch(this.baseUrl + '/api/ping', {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      this._pingCache = resp.ok;
    } catch (e) {
      this._pingCache = false;
    }
    this._pingCacheTime = now;
    return this._pingCache;
  }

  async _getStatusForPort(port, timeout) {
    try {
      var resp = await fetch('http://' + this.host + ':' + port + '/api/status', {
        method: 'GET',
        signal: AbortSignal.timeout(timeout || 600),
      });
      if (!resp.ok) return null;
      var status = await resp.json();
      status.host = this.host;
      status.port = status.port || port;
      status.id = String(status.port);
      status.active = Number(status.port) === Number(this.port);
      return status;
    } catch (e) {
      return null;
    }
  }

  async scanInstances() {
    var ports = [];
    for (var p = this.scanStart; p <= this.scanEnd; p++) ports.push(p);
    if (ports.indexOf(this.port) === -1) ports.unshift(this.port);

    var seen = {};
    var checks = ports.map(async (port) => {
      if (seen[port]) return null;
      seen[port] = true;
      return await this._getStatusForPort(port, 600);
    });
    var results = await Promise.all(checks);
    return results.filter(Boolean).sort(function (a, b) { return Number(a.port) - Number(b.port); });
  }

  async ensureConnectedForCall() {
    if (await this.ping()) return true;

    var instances = await this.scanInstances();
    if (instances.length === 1) {
      this.setPort(instances[0].port);
      return true;
    }
    if (instances.length > 1) {
      throw new Error('Multiple Cocos MCP editor instances are running. Call get_active_instances, then set_active_instance with the target port before using editor tools.');
    }
    return false;
  }

  async forward(toolName, args) {
    await this.ensureConnectedForCall();
    var resp = await fetch(this.baseUrl + '/api/tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: toolName, arguments: args || {} }),
      signal: AbortSignal.timeout(60000),
    });
    if (!resp.ok) {
      var text = await resp.text().catch(function () { return ''; });
      throw new Error('Editor responded with HTTP ' + resp.status + (text ? ': ' + text : ''));
    }
    var data = await resp.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.result !== undefined ? data.result : data;
  }

  async getStatus() {
    try {
      var resp = await fetch(this.baseUrl + '/api/status', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      return null;
    }
  }

  async getTools() {
    try {
      var resp = await fetch(this.baseUrl + '/api/tools', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) return [];
      var data = await resp.json();
      return data.tools || data || [];
    } catch (e) {
      return [];
    }
  }

  invalidateCache() {
    this._pingCache = null;
  }
}

module.exports = EditorBridge;
