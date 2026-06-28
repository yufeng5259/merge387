# AI Client Setup

This extension no longer bootstraps project rule files. Configure the AI client
to launch the MCP stdio bridge and keep project-specific instructions outside
the extension.

## Stdio Command

From the Cocos project root:

```text
node extensions/cocos-creator-38-mcp/stdio-server/index.js --port 6800
```

Use the actual port shown in the MCP panel.

## Expected First Check

After connecting, ask the client to call:

```text
get_project_info
```

Then call `get_scene_hierarchy` before scene or prefab mutations.

## Operating Reminder

```text
Use MCP tools for Cocos scenes, prefabs, nodes, components, assets, script
binding, and editor state. Do not directly edit .scene, .prefab, .fire, or .meta
files.
```

## Troubleshooting

- Restart the MCP service from the Cocos panel if tools are missing.
- Confirm the client port matches the panel port.
- Reopen the AI client project window if it does not reload MCP config.
- Use `doctor` and `read_console` for bridge or editor failures.
