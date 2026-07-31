# Script Migration Final Report - 2026-07-30

## Result

The live source action set contains 159 uniquely classified script actions: 121 modified, 24 added, and 14 deleted. All non-excluded actions have a target disposition. The complete per-file ledger is `source-script-manifest.json`.

## Delivered Systems

- Migrated the six tutorial collaborators plus `MergeGuideHooks`, regenerated `MergeTutorialManager`, and connected application registration. Tutorial evidence: `g003-tutorial-state-machine-audit.md` and `tutorial-method-parity.json` (558/558 methods).
- Migrated `BuildingFocusEffect`, both weak-guide meta entities, and `WeakGuideWindow`; connected `MetaManager` and four map-window consumers. Evidence: `g004-map-weak-guide-audit.md` (62/62 methods).
- Deleted InviteAndShareWindow, SuperShieldOpenWindow, and FacebookBindWindow TS/meta pairs and removed script-scope path/class/UUID residues. Evidence: `g005-deleted-window-audit.md`.
- Mapped `__game__.js` duties to the active `LegacyGlobals.ts` infrastructure; audited 14 existing additions (182/182 methods) and 11 already-absent deletions. Evidence: `g006-entry-added-deleted-audit.md`.
- Deep-reviewed all 43 report scripts. The 40 live comparable scripts map 1688/1688 methods after restoring `NotificationWrap.RequestAuthorization` and `cce.loadBundleRes`. Evidence: `g007-report-43-deep-review.md`.
- Audited all 144 live comparable files: 3241 directly mapped methods plus the source `UIWindow.ctor` state represented by target field initializers; missing business methods 0. Evidence: `g008-live-manifest-audit.md`.
- Restored four placeholder defects: order snapshot fields, screen shake, reward layout centering, and tutorial dialog wrapping. Evidence: `g009-placeholder-adjudication.md`.

## Cocos 3 Adaptation

Migrated application code has zero `cc.Class`, CommonJS `require`, `cc.loader`, `runAction`, or `stopAllActions` hits. Decorators, `UITransform`/`UIOpacity`, tweens, asset bundles, Spine, and event surfaces were reviewed in `g010-cocos3-adaptation-audit.md`. The vendored minified pako payload is explicitly outside the application-code legacy API judgment.

## Verification

- Comparable files: 144.
- Missing relative imports: 0.
- Metas checked: 145; UUID mismatches: 0.
- Touched/comparable TypeScript diagnostics: 0 across 145 files.
- Deleted script residues: 0.
- `git diff --check -- assets/Script`: passed.
- List exclusion hashes: 2/2 unchanged.
- Post-cleaner AST: 3241 direct mappings plus one field-initializer adjudication; business missing 0.
- No lint/test/build scripts exist in `package.json`.
- Project-wide TypeScript execution is blocked before source checking by the repository's existing TypeScript 6 `moduleResolution=node10` deprecation error. This configuration is outside the script-only scope.
- Creator editor/native runtime smoke testing is unavailable from the shell and remains the runtime validation gap.

## Scope Protection

Only `assets/Script` scripts and their corresponding metas were changed for product migration. Prefab, scene, image, animation, audio, JSON, atlas, and other resource changes already in the worktree were preserved and not modified by this task.

## Final Gates

- AI slop cleaner: `g012-ai-slop-cleaner-report.md`.
- Post-cleaner verification: `g012-post-cleaner-parity.json`, `g011-typescript-filter.json`, and `g011-static-verification.md`.
- Code review: `APPROVE`.
- Architecture status: `CLEAR`.
- Review evidence: `g012-final-review.md` and `g012-review-fix-evidence.md`.
