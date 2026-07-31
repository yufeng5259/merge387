# P1 Protocol Audit

- AST coverage: 11 files, 860 source methods, 860 mapped target methods, 0 missing, 0 duplicate.
- Tutorial: latest `MergeTutorialManager` regenerated from live source; P4 transient/build-buy redirects, trigger persistence, P5 ownership and town-upgrade release are present.
- Order/map: latest `MergeOrderLogic` and `TownUpgradeFlow` regenerated from live source; transaction phases, input locks, unlock snapshots, rewards and P5 eligibility are connected to `TownUpgradeTransactionState`.
- Resource display: `UserInfoModel` now preserves held, pending, deferred, in-flight, auto-play and last-presented resource states; `LevelUpDisplayLock.UpdateDisplayResourceValue` advances locked values only at animation arrival.
- Merge effects: `MergeUI` consumes warehouse and source-generator effects; `MergeTypeWindow` carries and consumes `playSourceGeneratorHintOnClose`.
- Network: `IdentityTrace` is consumed by `BatchRequest`, `NetRequest` and `ServerRequest`; trace summaries redact authentication/secrets and do not log a full unredacted request object.
- Targeted TypeScript errors: 0.
