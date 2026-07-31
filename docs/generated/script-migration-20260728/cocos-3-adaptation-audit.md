# Cocos Creator 3.8.7 Adaptation Audit

Scope: 133 live comparable targets plus the `LegacyGlobals` entry mapping and four newly migrated scripts.

## Gates

- Legacy global API scan in the 133-file scope: `cc.* = 0`, CommonJS `require(...) = 0`, `runAction = 0`, `stopAllActions = 0`, direct `node.width/height/opacity/scaleX/scaleY/anchorX/anchorY = 0`.
- Coordinate conversion uses `UITransform.convertToWorldSpaceAR/convertToNodeSpaceAR`; opacity uses `UIOpacity`; actions use `tween`/`Tween`; node dimensions and anchors use `UITransform`.
- Component scripts use `_decorator`, `@ccclass`, typed `@property`, and Cocos 3 lifecycle callbacks. Service/state modules intentionally remain plain ES modules.
- Resource and Spine paths use Cocos 3 `resources`/`assetManager`, `SpriteFrame`, and `sp.Skeleton` APIs. Event binding uses `Node.EventType`/`input` with matching cleanup.
- `HotUpdate` uses Cocos 3 native asset-manager access and guards non-native execution; source callback/retry/restart semantics are preserved.
- Metadata audit: 134/134 live target metas parse and contain UUIDs; 133 direct script UUIDs match. The sole mismatch is the intentional `__game__.js -> LegacyGlobals.ts` infrastructure mapping, which preserves the existing serialized `LegacyGlobals` identity.
- Exact exclusions remain byte-identical to baseline hashes.

No Cocos 2 API regression was found inside the migration scope. Whole-repository matches outside the live 145 action set (`libs/wx_lib.ts`, `QuestInvitePage.ts`, comments in the two exact exclusions) are pre-existing and outside this task's permitted write scope.
