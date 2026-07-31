# G007 Report-Scope Deep Review

## Coverage

- Report scope: 43 logical scripts.
- Current source additions: 10, migrated and audited under G003/G004.
- Current source deletions: 3, removed and residue-scanned under G005.
- Current comparable scripts: 40, including all 30 report modifications.

## Structural And Behavioral Evidence

`g007-report-43-parity.json` compares each source/target method through TypeScript AST feature extraction. It records method bodies, state writes, calls, event names, timers, resource literals, branches, loops, returns, throws, awaits, callbacks, and hashes.

- Source methods: 1688.
- Mapped target methods: 1688.
- Missing methods: 0.
- Initially found and restored: `NotificationWrap.RequestAuthorization` and `cce.loadBundleRes`.
- The authorization restoration preserves its one-shot flag, native/iOS guard, native bridge class/method, and callback timing.
- The bundle loader restoration preserves loading counts, per-bundle concurrent waiters, one-shot completion, progress callbacks, error telemetry, asset identity fields, dependency tracking, and callback errors while using Cocos 3 `assetManager` bundles.
- Targeted diagnostics for both restored protocols: 0.

The reported 12 duplicate entries are six source and six target `Object.defineProperty` getter callbacks in `MergeGuideHooks`; the generic AST collector labels each callback `get`. Their symmetric source/target occurrence is not a duplicate class method or runtime registration.

Feature deltas remain visible in the JSON rather than being suppressed. They represent the review surface for Cocos API substitutions, typed helper extraction, and state-machine responsibility splits; the source-side methods are nevertheless uniquely accounted for. The large `MergeTutorialManager` is covered together with its six collaborators and hooks by the 558/558 method and protocol evidence in `g003-tutorial-state-machine-audit.md`.
