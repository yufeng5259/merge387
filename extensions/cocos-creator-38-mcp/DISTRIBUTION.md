# Distribution Contents

This extension package intentionally contains only runtime/distribution files:

- Cocos extension entrypoints (`main.js`, `scene-script.js`, `panel/`, `i18n/`).
- MCP stdio bridge (`stdio-server/`).
- Runtime utility code (`tools/`, `util/`).
- Regression and safe-session diagnostic scripts (`scripts/`),
  including `check-safe-session.ps1` for verifying that live/mutating MCP
  automation is allowed before an AI edits editor state.
- User-facing setup docs required after copying the extension (`USAGE.md`, `CLIENT-SETUP.md`).
- Generic MCP templates under `templates/`.

Do not add process notes, temporary reports, screenshots, or regression artifacts to this extension directory. Runtime output belongs under project `temp/cocos-creator-38-mcp/`.

Before copying or publishing the package, run `run_regression_suite(mode:"package-hygiene")` or `scripts/run-regression.ps1 -Mode package-hygiene` from the project root. The hygiene gate rejects package-local `temp/`, reserved `__mcp_*` fixtures, planning-only artifacts, nested agent state, and protected Cocos serialized `.scene`/`.prefab`/`.fire`/`.meta` files.
