# G003 Tutorial State-Machine Audit

## Migrated modules

- `MergeGuideHooks`
- `MergeTutorialBusinessAdapter`
- `MergeTutorialOperationGuard`
- `MergeTutorialStateMachine`
- `MergeTutorialTargetResolver`
- `MergeTutorialUIController`
- Updated `MergeTutorialManager` integration

## Protocol closure

- `MergeTutorialManager` imports all five collaborators and contains 227 collaborator references covering state persistence/recovery, trigger queues, retry timers, operation gating, target resolution, business state, UI show/hide, skip, reconnect, and reward flows.
- `MergeGuideHooks` delegates the public compatibility contract to the manager and registers `Game.MergeGuideHooks`.
- `AppGame` imports `MergeGuideHooks`, establishing the runtime registration path before gameplay consumers execute.
- Manager registration is single-owner: one `Game.MergeTutorialManager` assignment and one ES default export.

## Evidence

- AST method parity: 7 files, `558/558`, missing `0` (`tutorial-method-parity.json`).
- Duplicate report: 12 entries are the same seven named property getter bodies counted as repeated `get` methods on both source and target; no migration-introduced duplicate exists.
- Feature deltas: 10 methods, all adjudicated Cocos 3 adaptations (`Vec2/Vec3`, `UITransform`, `Camera.worldToScreen/screenToWorld`, `view`, `find`, `isValid`, ES import replacing dynamic require).
- UUID parity: 7/7 TS metas preserve source script UUIDs.
- Isolated TypeScript syntax: 8 tutorial files, errors `0`.
- Project typecheck filter: tutorial module diagnostics `0`.
- Legacy Cocos API scan in tutorial TS: only the valid Cocos 3 `UITransform.convertToWorldSpaceAR` helper calls remain.
