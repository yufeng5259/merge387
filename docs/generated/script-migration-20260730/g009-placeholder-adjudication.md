# G009 Placeholder Audit And Adjudication

The source/target AST scan covered all 144 comparable files and initially identified four real migration defects:

- `UserMerge.DefaultOrderData` omitted four persisted order-state fields. Restored.
- `UIRoot.ScreenShake` was empty while the source runs a 16-step shake. Restored with a Cocos 3 tween sequence and final position reset.
- `MessageMailDetailWindow.updateRewardLayoutCenter` returned immediately. Restored using `Layout` and `UITransform` dimensions.
- `MergeTutorialWindow.updateDialogLabelWrap` returned immediately. Restored using Cocos 3 label/dialog transforms.

Post-fix targeted TypeScript diagnostics: 0. Known real-placeholder signature scan: 0.

Remaining scanner hits were adjudicated against source and syntax:

- `UserInfoModel.onLoad`: its seven source object initializations are target class field initializers.
- Two object-return differences: AST text formatting/quote style only; values match after the `UserMerge` field restoration.
- 34 TODO markers: translated user-facing strings in i18n data, not code comments or implementation markers.
- Empty catches: the live source contains 83 empty catch clauses and target contains 71. These are inherited optional parsing/compatibility fallbacks, not new target-only empty overrides; target reduced rather than expanded this pattern.
- Empty lifecycle/base hooks whose source counterparts are also empty remain legitimate extension points.

No fake adapter was found: the tutorial adapters have registered consumers and are covered by G003 protocol evidence; `LegacyGlobals` has broad import consumers and is covered by G006.
