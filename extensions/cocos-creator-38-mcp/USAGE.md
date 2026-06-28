# Cocos Creator 3.8 MCP Usage

This extension exposes the current Cocos Creator project through an MCP bridge.
It should not create project-specific AI rule files or business documentation.

## Start The Bridge

1. Open the Cocos Creator project.
2. Open the `MCP Server` panel.
3. Select the AI client profile if needed.
4. Set the port if the default `6800` is unavailable.
5. Click `Start` or `Restart`.

The panel shows the active port, bridge version, stdio verification status, and
available tools.

## Client Configuration

Use the MCP config returned by `configure_client` or the panel status as a guide.
The stdio command points at:

```text
extensions/cocos-creator-38-mcp/stdio-server/index.js
```

Pass the current panel port with `--port <port>`.

## First Chat Prompt

If the AI client does not automatically discover the MCP server, provide this
short reminder:

```text
Use the cocos-creator-38-mcp server for Cocos Creator work. Before changing
scenes, prefabs, nodes, components, or assets, call get_project_info and
get_scene_hierarchy. Use MCP tools instead of editing .scene, .prefab, .fire, or
.meta files directly.
```

## Verification

Ask the AI client to run:

1. `get_project_info`
2. `get_scene_hierarchy`
3. `read_console`
4. `doctor` if the bridge or editor state is unclear

For live mutation preflight from PowerShell:

```powershell
extensions/cocos-creator-38-mcp/scripts/check-safe-session.ps1 -Port 6800
```

## Local Cocos Source Lookup

`Select Engine Source` stores machine-local Cocos source lookup data under:

```text
settings/cocos-creator-38-mcp/engine-paths.json
settings/cocos-creator-38-mcp/engine-paths.md
```

This is optional and only helps tools such as `search_cocos_engine_api` inspect
local Cocos editor/engine APIs.

## Regression Runner

With Cocos Creator open and the MCP bridge running:

```powershell
extensions/cocos-creator-38-mcp/scripts/run-regression.ps1 -Mode release-smoke
```

Regression output belongs under `temp/cocos-creator-38-mcp/`.
