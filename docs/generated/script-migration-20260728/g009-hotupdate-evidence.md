# G009 HotUpdate migration evidence

## Scope

- Source: `F:/qiguobing/git/creator/test/coinbeach2415/assets/Script/AppKit/HotUpdate.js`
- Target: `assets/Script/AppKit/HotUpdate.ts`
- Target runtime: Cocos Creator 3.8.7, using `native.AssetsManager`, `native.EventAssetsManager`, `native.fileUtils`, and `sys`.

## Migrated behavior

- Restored completion, progress, and error callback storage and dispatch.
- Restored local-manifest validation, remote-version gate, update check, update start, retry, and restart branches.
- Restored all asset-manager event cases, including progress payloads, manifest failures, per-asset errors, decompression errors, failed-update retry dialog, and finished-update restart.
- Restored instantaneous download-speed smoothing and terminal hot-update statistics.
- Persisted the updated search paths as JSON before adding them to native file search paths and restarting.
- Restored native initialization, verification callback, Android concurrency limit, UI reveal, and listener cleanup.
- Removed the commented-out pseudo implementation. No `jsb.*` or `cc.sys` legacy access remains.

## Verification

- AST parity report: `g009-hotupdate-method-parity.json`
  - source methods: 20
  - mapped methods: 20
  - missing methods: 0
  - duplicate methods: 0
- TypeScript isolated transpilation: 0 diagnostics; emitted output size 12,911 bytes.
- Project TypeScript diagnostic filter: no diagnostics for `assets/Script/AppKit/HotUpdate.ts`.
- Placeholder/legacy scan (`TODO`, `FIXME`, commented control-flow, `jsb.`, `cc.sys`): 0 matches.
- `git diff --check -- assets/Script/AppKit/HotUpdate.ts`: clean.

## AST delta adjudication

The parity report retains a small number of structural feature deltas that are deliberate adaptations rather than missing behavior:

- `clearEventCallback()` centralizes the source's repeated `setEventCallback(null)` and listener-null assignments; `checkCb`, `updateCb`, and `onDestroy` call it at the same terminal points.
- Bound check/update callbacks are stored explicitly so teardown is observable and reliable under the Creator 3 event-callback API.
- Retry resets speed and terminal statistics before `downloadFailedAssets()` so a retry emits an independent measurement; the source already resets these for the initial update.
- `JSON.stringify(newPaths)` uses the storage API's string contract while `native.fileUtils.addSearchPath(newPaths, true)` still receives the live path array.
