'use strict';

var logger = require('./logger');

var state = {
  buildId: '',
  platform: '',
  debug: false,
  status: 'idle',
  startedAt: 0,
  finishedAt: 0,
  error: '',
  result: null,
  eventsInstalled: false,
  listenerWarnings: [],
};

function now() { return Date.now(); }

function createBuildId(platform) { return String(platform || 'build') + '-' + now(); }

function clone(v) { return JSON.parse(JSON.stringify(v)); }

function markStarted(input) {
  input = input || {};
  state.buildId = input.buildId || createBuildId(input.platform);
  state.platform = input.platform || '';
  state.debug = !!input.debug;
  state.status = 'running';
  state.startedAt = now();
  state.finishedAt = 0;
  state.error = '';
  state.result = null;
  logger.log('build', 'build started: ' + state.platform);
  return getState();
}

function markFailed(error, result) {
  state.status = 'failed';
  state.finishedAt = now();
  state.error = error ? String(error) : 'Build failed';
  state.result = result || null;
  logger.log('error', 'build failed: ' + state.error);
  return getState();
}

function markSucceeded(result) {
  state.status = 'success';
  state.finishedAt = now();
  state.error = '';
  state.result = result || null;
  logger.log('success', 'build succeeded');
  return getState();
}

function getState() { return clone(state); }

function handleFinish(payload) {
  var error = payload && (payload.error || payload.err || (Array.isArray(payload.errors) && payload.errors.length ? payload.errors.join('; ') : ''));
  if (error) markFailed(error, payload);
  else markSucceeded(payload);
}

function installEditorBuildListeners() {
  if (state.eventsInstalled) return { installed: true, warnings: state.listenerWarnings.slice() };
  state.eventsInstalled = true;
  state.listenerWarnings = [];

  try {
    if (typeof Editor === 'undefined') {
      state.listenerWarnings.push('Editor is not available');
      return { installed: false, warnings: state.listenerWarnings.slice() };
    }

    state.listenerWarnings.push('Build event listeners use message system in 3.8');
    return { installed: true, warnings: state.listenerWarnings.slice() };
  } catch (e) {
    state.listenerWarnings.push('Failed to install listeners: ' + e.message);
    return { installed: false, warnings: state.listenerWarnings.slice() };
  }
}

function errorLogsSince(ts, limit) {
  return logger.getLogs({ limit: limit || 200 }).filter(function (entry) {
    if (ts && entry.time && entry.time < ts) return false;
    return entry.level === 'error' || /build|error|failed/i.test(String(entry.msg || ''));
  });
}

module.exports = {
  markStarted: markStarted,
  markFailed: markFailed,
  markSucceeded: markSucceeded,
  getState: getState,
  installEditorBuildListeners: installEditorBuildListeners,
  errorLogsSince: errorLogsSince,
};
