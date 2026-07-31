# Entry, Added, and Deleted Script Audit

## `__game__.js` Mapping

- Target carrier: `assets/Script/LegacyGlobals.ts`.
- Source responsibilities mapped: `window.global`, `Game`, `Meta`, `SR`, `cce`, `CLOSE_Card`, `DISABLE_CardFeature`, `Game.IsCardFeatureClosed`, and `Game.IsCardWindowName`.
- Cocos 3 adaptation: the carrier aliases `globalThis`, `window`, and legacy `global` without adding an unreferenced `__game__.ts`; the source padding-only `__w` string has no runtime responsibility.

## Existing Added Scripts

- Ten pre-existing targets audited with AST method extraction: 163 source methods, 157 direct target mappings, 0 duplicates.
- Three real missing methods were restored: `MergeEmptyTaskGuide.getOrderReminderLevel`, `MergeEmptyTaskGuide.getPlayerLevelForOrderReminder`, and `LevelUpDisplayLock.UpdateDisplayResourceValue`.
- Four `MaskRoundRect` helpers are intentionally superseded by public Cocos 3 `Mask`, `Graphics`, and `UITransform` APIs; the old private `_graphics`/`_updateGraphics` patch is not carried forward.
- `GeneralStotyWindow.setTapVisible` and `setContinueVisible` are inherited from `StoryWindow` and are exercised by the derived class.
- All ten `.ts.meta` files exist. Source UUIDs match after correcting the two message-window metas.

## Remaining Source Deletions

- `LocalMergeTutorialTestData`, `OpeningVideoWindow`, `MapElementWindow`, `CashShopWindow`, and `StoryRole` target scripts/metas remain absent.
- `window/Menu/MessageMailDetailWindow` remains absent; its source UUID is intentionally carried by the new `window/Message/MessageMailDetailWindow` location.
- No deleted script was restored.
