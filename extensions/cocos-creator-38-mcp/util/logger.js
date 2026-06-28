'use strict';

var fs = require('fs');
var path = require('path');

var MAX_LOGS = 500;
var logs = [];
var ensuredDirs = {};
var filePanelTimer = null;

function pad(n) {
  return String(n).length < 2 ? '0' + n : String(n);
}

function formatTime(date) {
  return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

function formatDate(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function notifyPanel(channel, payload) {
  try {
    if (typeof Editor !== 'undefined' && Editor.Message) {
      Editor.Message.send('cocos-creator-38-mcp', channel, payload);
    }
  } catch (e) {}
}

function notifyPanelDebounced(channel, payload, delay) {
  if (filePanelTimer) return;
  filePanelTimer = setTimeout(function () {
    filePanelTimer = null;
    notifyPanel(channel, payload);
  }, delay || 500);
}

function getProjectRoot() {
  try {
    if (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) {
      return Editor.Project.path;
    }
  } catch (e) {}
  return process.cwd();
}

function getLogsDir() {
  return path.join(getProjectRoot(), 'temp', 'cocos-creator-38-mcp', 'logs');
}

function ensureDir(dir) {
  if (ensuredDirs[dir]) return;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  ensuredDirs[dir] = true;
}

function writeFileLog(entry) {
  try {
    var logsDir = getLogsDir();
    ensureDir(logsDir);
    var filePath = path.join(logsDir, formatDate(new Date(entry.ts)) + '.log');
    var line = '[' + entry.time + '] [' + entry.level + '] ' + entry.message + '\n';
    fs.appendFile(filePath, line, 'utf8', function () {});
    notifyPanelDebounced('log-files-changed', { file: path.basename(filePath) }, 1000);
  } catch (e) {}
}

function log(level, msg) {
  var now = new Date();
  var entry = {
    time: formatTime(now),
    ts: now.getTime(),
    level: level,
    msg: msg,
    type: level,
    message: msg
  };
  logs.push(entry);
  if (logs.length > MAX_LOGS) logs.shift();
  writeFileLog(entry);
  notifyPanel('logs-changed', { entry: entry, logs: getLogs({ limit: 300 }) });
}

function getLogs(opts) {
  opts = opts || {};
  var count = opts.count || opts.limit || 100;
  var level = opts.level || 'all';
  var filtered = level === 'all' ? logs : logs.filter(function (l) { return l.level === level; });
  var sinceTs = Number(opts.sinceTs || opts.startedAt || 0) || 0;
  if (sinceTs > 0) filtered = filtered.filter(function (l) { return Number(l.ts || 0) >= sinceTs; });
  return filtered.slice(-count);
}

function clear() {
  logs.length = 0;
  notifyPanel('logs-changed', { logs: [] });
}

function getLogFilesStatus() {
  var logsDir = getLogsDir();
  var result = { count: 0, latest: null, dir: logsDir };
  try {
    if (fs.existsSync(logsDir)) {
      var files = fs.readdirSync(logsDir).filter(function (f) { return f.endsWith('.log'); });
      result.count = files.length;
      if (files.length > 0) {
        files.sort();
        result.latest = { name: files[files.length - 1] };
      }
    }
  } catch (e) {
    result.error = e.message;
  }
  return result;
}

function clearLogFiles() {
  var logsDir = getLogsDir();
  try {
    if (fs.existsSync(logsDir)) {
      var files = fs.readdirSync(logsDir).filter(function (f) { return f.endsWith('.log'); });
      for (var i = 0; i < files.length; i++) {
        try { fs.unlinkSync(path.join(logsDir, files[i])); } catch (e) {}
      }
    }
  } catch (e) {}
  return true;
}

module.exports = {
  log: log,
  getLogs: getLogs,
  clear: clear,
  getLogsDir: getLogsDir,
  getLogFilesStatus: getLogFilesStatus,
  clearLogFiles: clearLogFiles
};
