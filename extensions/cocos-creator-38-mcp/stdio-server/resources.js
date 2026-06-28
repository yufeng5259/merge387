'use strict';

var resources = [
  {
    name: 'Editor Status',
    uri: 'cocos://editor/status',
    metadata: {
      description: 'Current Cocos Editor connection status, version, and open scene info',
      mimeType: 'application/json',
    },
    handler: async function (bridge) {
      var status = await bridge.getStatus();
      if (!status) {
        return { connected: false, message: 'Cocos Editor is not reachable. Make sure the editor is running with the cocos-creator-38-mcp plugin enabled.' };
      }
      return status;
    },
  },

  {
    name: 'Available Tools',
    uri: 'cocos://editor/tools',
    metadata: {
      description: 'List of tool names available on the Editor plugin side',
      mimeType: 'application/json',
    },
    handler: async function (bridge) {
      var tools = await bridge.getTools();
      return { count: tools.length, tools: tools.map(function (t) { return t.name || t; }) };
    },
  },
];

module.exports = resources;
