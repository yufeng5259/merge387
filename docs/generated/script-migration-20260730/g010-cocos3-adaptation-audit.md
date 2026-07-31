# G010 Cocos Creator 3.8.7 Adaptation Audit

## Static Gates

- Decorator/serialization references: 1853.
- `UITransform`/`UIOpacity` references: 455.
- Cocos 3 tween calls: 181.
- Cocos 3 resource/bundle load calls: 23.
- Spine component references: 89.
- Event registration/unregistration references: 298.
- Migrated code hits for `cc.Class`, CommonJS `require`, `cc.loader`, `runAction`, and `stopAllActions`: 0.

The only CommonJS-like text found by the repository-wide legacy scan is the checked-in minified third-party `libs/pako.ts` bundle; it is vendor payload, not migrated application code or a change introduced by this task.

## Node And UI Properties

All remaining `.x/.y` assignments in migrated code are `Vec2`/`Vec3`, canvas, or plain-data mutations. Width/height assignments target `UITransform`, `LabelOutline`, browser canvas, or plain configuration objects. The exact excluded List/ListItem files were not adjudicated or modified.

## Protocol Review

- Component classes use Cocos 3 decorators and ES module imports.
- Serialized component/node fields use typed `@property` declarations in the newly migrated systems.
- Map focus and weak guide use `UITransform`, `Camera`, `RenderTexture`, `BlockInputEvents`, and `Node.angle` mappings.
- Tutorial animation/input paths use `tween`, `Animation`, `sp.Skeleton`, `BlockInputEvents`, and explicit lifecycle cleanup.
- Resource compatibility uses `resources` and `assetManager` bundles, including the restored concurrent `loadBundleRes` protocol.
- Source event and timer surfaces remain visible in the full AST parity evidence; producer/consumer checks are covered by G003/G004/G007.
