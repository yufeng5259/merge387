# G011 Static And Protocol Verification

- `node tools/verify-script-migration-20260728.js` with the 2026-07-30 output directory: 144 comparable files, missing relative imports 0, 145 metas checked, UUID mismatches 0, exclusion hashes 2/2 match.
- `node tools/verify-touched-typescript-20260730.js`: 145 touched/comparable files, touched diagnostics 0.
- Project-wide `npx tsc --noEmit --pretty false`: launched successfully but exits before source checking because TypeScript 6 rejects the repository's deprecated `moduleResolution=node10` unless `ignoreDeprecations` is configured. This pre-existing project configuration was not changed because it is outside the script-only migration scope.
- `git diff --check -- assets/Script`: passed; only line-ending conversion warnings were emitted.
- Deleted window class/path/UUID scan: 0 residues.
- Full method protocol audit: 3241 direct mappings plus one `UIWindow.ctor` field-initializer adjudication, missing business methods 0.
- Tutorial producer/consumer and lifecycle protocol: G003 evidence.
- Map focus, weak guide, metadata, and map-window consumer protocol: G004 evidence.
- `__game__` runtime entry responsibilities: G006 evidence.
- Bundle loading and notification authorization protocols restored and re-audited under G007.

No package lint, test, or build scripts are defined in `package.json`; the available static, AST, import, UUID, hash, and diff checks were run instead.
