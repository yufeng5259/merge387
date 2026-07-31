# G004 Map Focus And Weak Guide Audit

## Scope

- `game/map/BuildingFocusEffect`
- `game/weakGuide/meta/WeakGuideConditionMeta`
- `game/weakGuide/meta/WeakGuideMeta`
- `window/Other/WeakGuideWindow`

## Parity Evidence

- AST method audit: 62 source methods, 62 mapped target methods, 0 missing, 0 duplicate.
- Detailed machine-readable evidence: `g004-method-parity.json`.
- Source UUIDs are preserved in all four target TypeScript metas.
- Targeted TypeScript diagnostic filter across the four modules, `MetaManager`, and four map-window consumers: 0 diagnostics.

## Protocol Wiring

- `MetaManager` imports both weak-guide meta entities, registers their meta types, and materializes both tables through `SetTypeData`.
- `WeakGuideWindow` preserves the source window path, lifecycle, pointer refresh, target invalidation callback, dialog state, and Spine restart protocol.
- Target center conversion reproduces the source world bounding-box center while accounting for Cocos 3 `UITransform` anchors.
- `BuildingFocusEffect` preserves camera capture, Gaussian blur, focused-node cloning, map-info hiding, focus placement, and cleanup behavior.
- Camera scaling reads the compatibility `zoomRatio` maintained by the migrated `MapControlle`; invalid values fall back to the source default of 1.
- `MapBuyBuildWindow`, `MapBuildUpgradeWindow`, `MapBuildStageUpgradeWindow`, and `MapBuildMaxLevelWindow` resolve the prefab `BuildingFocusEffect` component, show it after the building node is displayed, and clear it on close.

## Cocos 3 Mappings

- `cc.Class` -> decorated ES6 classes.
- node width/height/anchor conversion -> `UITransform`.
- `rotation` -> `Node.angle` with the same numeric sign used by the repository's compatibility mapping.
- camera world/screen conversion -> `Camera.worldToScreen`.
- render texture and sprite frame creation -> Cocos 3 `RenderTexture`, `Texture2D`, and `SpriteFrame` APIs.
- cloned-node event blocking -> `BlockInputEvents`.

## Boundary

The live source exposes weak-guide metadata through `MetaManager` and the weak-guide window through its dynamic window path; it does not contain a separate weak-guide scheduler. No unsupported scheduler behavior was invented. Prefab and resource edits are outside this task's write scope.
