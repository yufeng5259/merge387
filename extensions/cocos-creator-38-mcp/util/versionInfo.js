'use strict';

var fs = require('fs');
var path = require('path');

function readPackage() {
  var packagePath = path.join(__dirname, '..', 'package.json');
  try {
    return JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, ''));
  } catch (e) {
    return {};
  }
}

function getVersionInfo(extra) {
  extra = extra || {};
  var pkg = readPackage();
  var editorVersion = extra.editorVersion || null;
  return {
    pluginName: pkg.name || 'cocos-creator-38-mcp',
    displayName: pkg.displayName || pkg.mcpPackageName || 'cocos-creator-38-mcp',
    version: pkg.version || '0.0.0',
    mcpToolsUpdatedAt: pkg.mcpToolsUpdatedAt || '',
    editorCompatibility: pkg.editor || '>=3.8.0',
    cocosVersion: editorVersion,
    toolCount: extra.toolCount == null ? null : extra.toolCount,
    configPath: extra.configPath || '',
    platform: extra.platform || '',
  };
}

module.exports = {
  getVersionInfo: getVersionInfo,
};
