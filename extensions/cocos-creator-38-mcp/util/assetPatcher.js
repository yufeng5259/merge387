'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');

function isStructuredAssetPath(dbPath) {
  return /\.(scene|prefab|meta)$/i.test(String(dbPath || ''));
}

function normalizeError(err) {
  if (!err) return '';
  return err.message || String(err);
}

async function safeCreateAsset(dbPath, content, callback) {
  if (isStructuredAssetPath(dbPath)) {
    return callback('Refusing to create structured Cocos asset through text asset API: ' + dbPath);
  }

  try {
    await Editor.Message.request('asset-db', 'create-asset', dbPath, String(content || ''));
    callback(null, 'Asset created: ' + dbPath);
  } catch (e) {
    var projectPath = Editor.Project.path;
    var fspath = null;
    if (String(dbPath).indexOf('db://assets') === 0) {
      var rel = dbPath.replace('db://assets/', '');
      fspath = path.join(projectPath, 'assets', rel);
    }

    if (fspath) {
      try {
        var dir = path.dirname(fspath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fspath, String(content || ''), 'utf8');
        try {
          await Editor.Message.request('asset-db', 'refresh-asset', dbPath);
        } catch (refreshErr) {}
        try {
          await Editor.Message.request('asset-db', 'reimport-asset', dbPath);
        } catch (reimportErr) {}
        callback(null, 'Asset created via filesystem: ' + dbPath);
      } catch (fsErr) {
        callback('Create failed: ' + normalizeError(fsErr));
      }
    } else {
      callback('Create failed: ' + normalizeError(e));
    }
  }
}

async function safeSaveExistingAsset(dbPath, content, callback) {
  if (isStructuredAssetPath(dbPath)) {
    return callback('Refusing to save structured Cocos asset through text asset API: ' + dbPath);
  }

  try {
    var projectPath = Editor.Project.path;
    var fspath = null;
    if (String(dbPath).indexOf('db://assets') === 0) {
      var rel = dbPath.replace('db://assets/', '');
      fspath = path.join(projectPath, 'assets', rel);
    }

    if (fspath && fs.existsSync(fspath)) {
      fs.writeFileSync(fspath, String(content || ''), 'utf8');
      try {
        await Editor.Message.request('asset-db', 'refresh-asset', dbPath);
      } catch (refreshErr) {}
      callback(null, 'Asset saved: ' + dbPath);
    } else {
      callback('Asset does not exist: ' + dbPath);
    }
  } catch (e) {
    callback('Save failed: ' + normalizeError(e));
  }
}

module.exports = {
  safeCreateAsset: safeCreateAsset,
  safeSaveExistingAsset: safeSaveExistingAsset,
  isStructuredAssetPath: isStructuredAssetPath,
};
