# G008 Live Manifest Audit

## Current Manifest

- Total actions: 159.
- Modified: 121.
- Added: 24.
- Deleted: 14.
- Equivalent infrastructure: 1 (`__game__.js` -> `LegacyGlobals.ts`).
- Existing Cocos 3 reviewed: 120.
- Source additions migrated: 24.
- Source deletions applied: 14.
- Exact exclusions: 2, tracked separately with locked hashes.

Every manifest entry has exactly one disposition. Regeneration after G003-G005 removed all target-missing and deletion-conflict states.

## Full Comparable Audit

`g008-live-159-parity.json` covers all 144 comparable non-excluded source/target files:

- Source methods: 3242.
- Directly mapped target methods: 3241.
- Missing business methods after adjudication: 0.
- The sole structural exception is source `UIWindow.ctor`, whose four assignments are target class field initializers (`childWindows`, `isChild`, `parentWindow`, `closeFuncs`). Adding a legacy-style constructor to a Cocos 3 component is rejected because the initialized state is already equivalent.
- Duplicate collector entries are symmetric source/target getter callbacks or source-defined duplicates; no target-only duplicate was introduced.

The two exact exclusions are absent from the comparable-file set and remain protected by their SHA256 gates.
