# G005 Deleted Window Audit

- Deleted `window/Menu/InviteAndShareWindow.ts` and its meta.
- Deleted `window/Shop/SuperShieldOpenWindow.ts` and its meta.
- Deleted `window/Sys/FacebookBindWindow.ts` and its meta.
- Removed stale commented/dormant dynamic-window path references from `GameMainWindow` and `MenuWindow` without changing active invite behavior.
- Script-scope class/path scan: 0 residues.
- Script-scope UUID scan for all three deleted component UUIDs: 0 residues.
- All six target files confirmed absent.
- `git diff --check` passed for the touched script paths.
- Targeted TypeScript diagnostic filter: 0 diagnostics.

Prefab and resource files were not modified because the task scope is limited to scripts and their corresponding metas.
