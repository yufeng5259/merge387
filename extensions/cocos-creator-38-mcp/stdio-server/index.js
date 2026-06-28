#!/usr/bin/env node
'use strict';

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const EditorBridge = require('./bridge');
const toolDefs = require('./tools');
const prompts = require('./prompts');
const resources = require('./resources');
const workflows = require('./workflows');
const versionInfo = require('../util/versionInfo');

const VERSION = versionInfo.getVersionInfo().version;
const DEFAULT_PORT = 6800;

function parseArgs() {
  const args = process.argv.slice(2);
  let port = DEFAULT_PORT;
  let scanStart = DEFAULT_PORT;
  let scanEnd = DEFAULT_PORT + 10;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10) || DEFAULT_PORT;
    }
    if (args[i] === '--scan-start' && args[i + 1]) {
      scanStart = parseInt(args[i + 1], 10) || scanStart;
    }
    if (args[i] === '--scan-end' && args[i + 1]) {
      scanEnd = parseInt(args[i + 1], 10) || scanEnd;
    }
  }
  if (scanStart > scanEnd) {
    var tmp = scanStart;
    scanStart = scanEnd;
    scanEnd = tmp;
  }
  return { port, scanStart, scanEnd };
}

function log(msg) {
  process.stderr.write('[cocos-mcp] ' + msg + '\n');
}

async function main() {
  const { port, scanStart, scanEnd } = parseArgs();
  const bridge = new EditorBridge(port, { scanStart, scanEnd });

  const server = new McpServer({
    name: 'cocos-creator-38-mcp',
    version: VERSION,
    instructions: [
      'You are connected to Cocos Creator 3.8 editor via MCP.',
      'For ANY scene/node/prefab/asset/build operations, you MUST use these MCP tools.',
      'Do not perform ad hoc manual serialized edits to .fire, .scene, .prefab, or .meta files; use MCP/editor tools by default. Only a dedicated guarded offline .prefab writer may write .prefab files when explicitly opted in and verified.',
      'You CAN directly edit .js/.ts script files, but call manage_editor(action:"refresh") afterward to sync.',
      'Always call get_scene_hierarchy before modifying scene nodes to understand current state.',
      'Use get_workflow_templates to see available multi-step operation blueprints.',
    ].join(' '),
  });

  // Register all tools
  for (const def of toolDefs) {
    server.tool(def.name, def.description, def.schema, async (args) => {
      try {
        args = args || {};
        if (def.name === 'get_active_instances') {
          const instances = await bridge.scanInstances();
          return { content: [{ type: 'text', text: JSON.stringify({ activePort: bridge.port, instances }, null, 2) }] };
        }
        if (def.name === 'set_active_instance') {
          const targetPort = Number(args.port || args.id);
          if (!targetPort) {
            return { content: [{ type: 'text', text: 'Error: set_active_instance requires a numeric port.' }], isError: true };
          }
          bridge.setActiveInstance(targetPort);
          const connected = await bridge.ping();
          return {
            content: [{ type: 'text', text: JSON.stringify({ activePort: bridge.port, connected }, null, 2) }],
            isError: !connected,
          };
        }

        const connected = await bridge.ensureConnectedForCall();
        if (!connected) {
          return { content: [{ type: 'text', text: 'Error: Cocos Editor is not connected. Please ensure the editor-plugin is running and the Editor is open.' }], isError: true };
        }
        const result = await bridge.forward(def.name, args);
        return { content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) }] };
      } catch (e) {
        return { content: [{ type: 'text', text: 'Error: ' + e.message }], isError: true };
      }
    });
  }

  // Register workflow tools
  server.tool(
    'run_workflow',
    'Execute a workflow blueprint — a sequence of MCP tool calls. Useful for multi-step operations like creating a complete UI panel, setting up a new scene, or batch modifying nodes. Use get_workflow_templates to see available templates.',
    {
      template: z.string().optional().describe('Name of a built-in workflow template (use get_workflow_templates to list)'),
      steps: z.array(z.object({
        tool: z.string().describe('Tool name to call'),
        args: z.record(z.any()).describe('Arguments for the tool'),
        output_var: z.string().optional().describe('Variable name to store the result UUID'),
      })).optional().describe('Custom workflow steps (alternative to template)'),
      variables: z.record(z.any()).optional().describe('Input variables for template substitution'),
    },
    async (args) => {
      try {
        const result = await workflows.execute(bridge, args);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (e) {
        return { content: [{ type: 'text', text: 'Workflow error: ' + e.message }], isError: true };
      }
    }
  );

  server.tool(
    'get_workflow_templates',
    'List available workflow templates with their descriptions and required variables. Templates are pre-defined multi-step operation blueprints.',
    {},
    async () => {
      const templates = workflows.listTemplates();
      return { content: [{ type: 'text', text: JSON.stringify(templates, null, 2) }] };
    }
  );

  // Register prompts
  for (const p of prompts) {
    server.prompt(p.name, p.description, p.arguments || {}, p.handler);
  }

  // Register resources
  for (const r of resources) {
    server.resource(r.name, r.uri, r.metadata, async (uri) => {
      try {
        const data = await r.handler(bridge);
        return { contents: [{ uri: uri.href, mimeType: r.metadata.mimeType || 'application/json', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return { contents: [{ uri: uri.href, mimeType: 'text/plain', text: 'Error: ' + e.message }] };
      }
    });
  }

  const transport = new StdioServerTransport();
  log('Starting MCP server v' + VERSION + ' (editor port: ' + port + ', scan: ' + scanStart + '-' + scanEnd + ')');
  await server.connect(transport);
  log('MCP server connected via stdio');
}

main().catch((e) => {
  process.stderr.write('Fatal: ' + e.message + '\n');
  process.exit(1);
});
