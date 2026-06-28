'use strict';

var logger = require('./logger');

var MAX_QUEUE_LENGTH = 100;
var commandQueue = [];
var isProcessingCommand = false;

function enqueue(fn, timeout) {
  timeout = timeout || 65000;
  if (commandQueue.length >= MAX_QUEUE_LENGTH) {
    return Promise.reject(new Error('Command queue full (' + MAX_QUEUE_LENGTH + '), try again later'));
  }

  return new Promise(function (resolve, reject) {
    var settled = false;
    var timeoutId = setTimeout(function () {
      if (settled) return;
      settled = true;
      logger.log('error', 'Command queue item timeout (' + timeout + 'ms)');
      isProcessingCommand = false;
      reject(new Error('Command queue item timeout (' + timeout + 'ms)'));
      processNext();
    }, timeout);

    commandQueue.push({
      fn: fn,
      timeoutId: timeoutId,
      resolve: function (value) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(value);
      },
      reject: function (err) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        reject(err);
      },
    });
    processNext();
  });
}

function processNext() {
  if (isProcessingCommand || commandQueue.length === 0) return;
  isProcessingCommand = true;
  var item = commandQueue.shift();
  try {
    item.fn(function (err, result) {
      isProcessingCommand = false;
      if (err) item.reject(err);
      else item.resolve(result);
      processNext();
    });
  } catch (e) {
    logger.log('error', 'Command exception: ' + e.message);
    isProcessingCommand = false;
    item.reject(e);
    processNext();
  }
}

function callSceneScript(method, args, timeout) {
  timeout = timeout || 15000;
  var pluginName = 'cocos-creator-38-mcp';
  var startedAt = Date.now();

  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (!settled) {
        settled = true;
        reject(new Error('Scene operation timeout: ' + method + ' (' + timeout + 'ms)'));
      }
    }, timeout);

    Editor.Message.request('scene', 'execute-scene-script', {
      name: pluginName,
      method: method,
      args: args != null ? [args] : [],
    }).then(function (result) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      var elapsed = Date.now() - startedAt;
      if (elapsed >= 500) logger.log('warn', 'Slow scene op ' + method + ': ' + elapsed + 'ms');
      resolve(result);
    }).catch(function (err) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      var msg = typeof err === 'object' ? (err.message || String(err)) : String(err);
      reject(new Error(msg));
    });
  });
}

function enqueueSceneOp(method, args, timeout) {
  timeout = timeout || 15000;
  return enqueue(function (done) {
    callSceneScript(method, args, timeout)
      .then(function (result) { done(null, result); })
      .catch(function (err) { done(err); });
  }, timeout + 5000).catch(function (err) {
    var msg = String(err && err.message ? err.message : err);
    if (args && (args.missingOk || args.silent) && /not found|does not exist|missing/i.test(msg)) {
      return { ok: true, skipped: true, reason: msg };
    }
    throw new Error('Scene operation failed: ' + method + ' - ' + err.message);
  });
}

module.exports = {
  enqueue: enqueue,
  callSceneScript: callSceneScript,
  enqueueSceneOp: enqueueSceneOp,
  getLength: function () { return commandQueue.length; },
  isProcessing: function () { return isProcessingCommand; },
  getMaxLength: function () { return MAX_QUEUE_LENGTH; },
};
