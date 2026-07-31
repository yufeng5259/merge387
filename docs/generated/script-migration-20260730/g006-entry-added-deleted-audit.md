# G006 Entry, Existing Additions, And Deletions Audit

## `__game__.js` Responsibility Mapping

The source entry performs only these runtime duties: establish the global alias; initialize `Game`, `Meta`, `SR`, and `cce`; initialize `CLOSE_Card` and `DISABLE_CardFeature`; and install `Game.IsCardFeatureClosed` plus `Game.IsCardWindowName`.

`LegacyGlobals.ts` carries every one of those duties and additionally aliases the namespaces safely across `globalThis`, browser `window`, and a pre-existing `global`. It is imported by the migrated application and domain modules, so this is active infrastructure rather than an unreferenced compatibility shell. Creating `__game__.ts` would duplicate initialization and is intentionally rejected.

## Existing Source Additions

- Audited 14 existing target additions with `g006-existing-added-parity.json`.
- 182 source methods, 182 mapped target methods, 0 missing, 0 duplicate.
- Feature-set deltas are retained as explicit Cocos 2 to Cocos 3 API, TypeScript, lifecycle, and helper extraction adaptations for the G007/G010 review gates; no missing method was concealed by the audit.
- IdentityTrace is a side-effect-only top-level module in both source and target, hence its valid method count is zero.

## Existing Source Deletions

- Checked all 11 manifest entries classified `source-deleted`.
- Target script present: 0.
- Target meta present: 0.

The three deletion conflicts are handled separately by G005 and are now also absent.
