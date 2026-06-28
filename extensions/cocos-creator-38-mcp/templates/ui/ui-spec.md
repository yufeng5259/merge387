# Cocos MCP UI Spec

`ui-spec.schema.json` defines a platform-neutral JSON structure for AI-generated Cocos UI. It is consumed by MCP tools such as `create_ui_from_spec` and `export_ui_spec_from_node`.

Core node types:

- `group`: empty container node.
- `sprite`: node with `cc.Sprite`.
- `label`: node with `cc.Label`; requires `text`.
- `button`: node with `cc.Button`, optional child label.
- `toggle`: node with real `cc.Toggle`; requires `toggle`.
- `progressbar` / `progressBar` / `progress`: node with real
  `cc.ProgressBar`; requires `progressBar`.
- `richtext` / `richText`: node with real `cc.RichText`.
- `grid`: container with `cc.Layout`; requires `grid`.
- `panel`: framed UI container, usually a sprite-backed root or card.
- `scrollview`: container with `cc.ScrollView`; requires `scrollView`.

Common fields:

- `position`, `size`, `anchor`: two-number arrays.
- `scale`: two- or three-number array. When present, strict validation compares
  the serialized node scale.
- `euler` / `eulerAngles` and `rotation`: optional rotation fields. `rotation`
  maps to the z euler angle for static validation.
- `active`: optional node active state.
- `siblingIndex`: optional expected child order under the parent.
- `mixedLayout`: set `true` only when a node intentionally combines free
  `position` with Widget/Layout-managed placement.
- `requiredText`: for labels, strict validation fails when the readback text is
  empty.
- `color`: `#RRGGBB`, `#RRGGBBAA`, or `{ "r": 255, "g": 255, "b": 255, "a": 255 }`.
- `text`, `font`, `fontSize`, `lineHeight`, `textStyle`: label-related fields.
- `spriteFrame`: resource reference for sprite-backed nodes.
- `prefabPath`: output prefab path, always `db://assets/.../*.prefab`.
- `authoringMode`: optional MCP authoring flow. Use
  `source-node-create-prefab` for unattended production work until MCP has a
  proven non-popup dirty prefab edit save/close path. `prefab-edit-context`
  remains a blocked research/regression mode unless a future MCP version
  re-proves it with readback and no-dialog evidence.

Widget fields:

- `widget`: adds and validates `cc.Widget`.
- Supported keys include `alignMode`, `isAlignTop`, `isAlignBottom`,
  `isAlignLeft`, `isAlignRight`, `isAlignHorizontalCenter`,
  `isAlignVerticalCenter`, `top`, `bottom`, `left`, `right`,
  `horizontalCenter`, `verticalCenter`, and optional `target`.
- A node with `widget` must not also rely on free `position` unless
  `mixedLayout:true` is explicitly set.

Layout validation fields:

- `grid.type`, `resizeMode`, `startAxis`, `affectedByScale`,
  `expectedChildCount`, `spacing`, `cellSize`, and `padding` are checked by
  strict static validation when provided.
- Layout children must declare an explicit `size`; otherwise strict validation
  fails.
- Layout-managed children must not rely on free `position` unless
  `mixedLayout:true` is explicitly set.

ScrollView fields:

- `scrollView.direction`: `vertical`, `horizontal`, or `both`.
- `scrollView.contentSize`: two-number `[width, height]` for the generated
  `Content` node.
- `scrollView.layout`: content `cc.Layout` settings. `type` may be `vertical`,
  `horizontal`, or `grid`; `spacing`, `padding`, and `cellSize` follow the
  `grid` conventions.
- `scrollView.items`: ordinary UI spec nodes created under `Content`.

Generated ScrollView structure:

```text
ScrollViewRoot
`-- View
    `-- Content
        |-- ItemA
        |-- ItemB
        `-- ItemC
```

The root receives `cc.ScrollView`, `View` receives `cc.Mask`, `Content`
receives `cc.Layout`, and `cc.ScrollView.content` is bound to `Content`.
Cocos Creator 3.8 does not expose a separate public `view` property in this
project MCP contract; the view relationship is verified by node structure and
`cc.Mask` evidence.

Advanced control fields:

- `toggle.checkMarkNode`: child node whose `cc.Sprite` is bound to
  `cc.Toggle.checkMark`; defaults to `Checkmark`.
- `toggle.isChecked`: expected checked state.
- `toggle.normalSprite`, `pressedSprite`, `hoverSprite`, `disabledSprite`:
  SpriteFrame references for Toggle/Button sprite states.
- Toggle visuals should include explicit `Background`, `Checkmark`, and
  non-empty label child nodes when generated for production-style UI.
- `progressBar.barNode`: child node whose `cc.Sprite` is bound to
  `cc.ProgressBar.barSprite`; defaults to `Bar`.
- `progressBar.progress`, `mode`, `totalLength`, and `reverse` are compared by
  strict static validation when present.
- `richText.string` or top-level `text` provides `cc.RichText.string`.
- `fontSize`, `lineHeight`, and `maxWidth` are compared for RichText when
  present. `requiredText:true` fails when the RichText string is empty.

Resource references:

- `{ "role": "green_button_bg" }` for role lookup through `templates/asset-roles.json`.
- `{ "path": "db://assets/ui/button.png/spriteFrame" }` for explicit project assets.
- `{ "uuid": "..." }` when the asset is already known.
- `"db://internal/default_ui/default_sprite_splash.png/spriteFrame"` is the
  accepted built-in fallback SpriteFrame when no project asset is supplied.

When a visual resource is not specified or cannot be found under `db://assets`, MCP tools should first try suitable built-in resources under `db://internal` and record the exact db URL used.

Examples:

- `examples/GenericPanel.json`
- `examples/GenericGrid.json`
- `examples/GenericListItem.json`
