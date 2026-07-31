# Full 145 Script Action Audit

- Live source actions: 145 unique families (`120 modified + 14 added + 11 deleted`).
- Resolved dispositions: `119 existing-cocos3-reviewed + 14 source-added-migrated + 11 source-deleted + 1 equivalent-infrastructure`.
- Script hashes: all 145 source actions have SHA-256 evidence; all 134 live targets have target SHA-256 evidence.
- Comparable live scripts: 133 direct JS-to-TS pairs, 2,886 source methods.
- AST result: 2,885 direct mappings, one explicit engine adaptation, two source-and-target duplicate overrides.

## Explicit adaptation

`GameKit/ui/UIWindow::ctor` is represented by Cocos 3 class field initializers (`childWindows`, `isChild`, `parentWindow`, `closeFuncs`, `closing`). Cocos 2 `cc.Class.ctor` is not a Cocos 3 component lifecycle callback, so adding a dead `ctor()` would reduce correctness. Runtime initialization duties are present and the source method is adjudicated as `engine-lifecycle-adapted`.

## Duplicate adjudication

`Web/MergeBoardLogic::checkAndDeductResource` is duplicated in both the live source and target in the same order. The target preserves the source override behavior; this is recorded as source parity, not a migration-introduced duplicate.

## Deleted-path audit

All 11 source-deleted target script and matching meta paths are absent. Name scan findings are limited to localization keys and intentional replacement paths: the deleted `window/Menu/MessageMailDetailWindow` is replaced by `window/Message/MessageMailDetailWindow`; no stale import of the deleted module remains.

Machine evidence: `source-script-manifest.json`, `live-method-parity.json`, `live-comparable-files.json`, and `execution-baseline.json`.
