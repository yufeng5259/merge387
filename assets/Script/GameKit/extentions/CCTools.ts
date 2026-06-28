import {
    Color,
    Component,
    ImageAsset,
    Label,
    LabelOutline,
    LabelShadow,
    Node,
    RichText,
    Scene,
    Sprite,
    SpriteFrame,
    Texture2D,
    UIOpacity,
    UIRenderer,
    UISkew,
    UITransform,
    Vec2,
    Widget,
} from 'cc';
import { EDITOR } from 'cc/env';
import { CCLabelMaxLines } from './CCLabelMaxLines';

type NodeTarget = Node | Component | null | undefined;
type DynamicComponent = Component & Record<string, any>;
type NodeParam = Record<string, any>;
type LifecycleComponent = { onLoad?: () => void };

function resolveNode(target: NodeTarget) {
    if (!target) return null;
    if (target instanceof Node) return target;
    return target.node || null;
}

function ensureUITransform(node: Node) {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

function ensureOpacity(node: Node) {
    return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

function toColor(value: unknown, fallbackAlpha = 255) {
    if (Array.isArray(value)) {
        return new Color(
            Number(value[0]) || 0,
            Number(value[1]) || 0,
            Number(value[2]) || 0,
            value[3] != null ? Number(value[3]) || 0 : fallbackAlpha,
        );
    }

    if (value instanceof Color) {
        return value.clone();
    }

    return new Color(255, 255, 255, fallbackAlpha);
}

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

function setRenderableColor(node: Node, color: Color) {
    const renderers = node.getComponents(UIRenderer);
    renderers.forEach(renderer => {
        renderer.color = color;
    });
}

function setMaxLines(node: Node, value: number) {
    const maxLines = node.getComponent(CCLabelMaxLines) || node.addComponent(CCLabelMaxLines);
    maxLines.maxLines = value;
}

function callOnLoad(component: Component) {
    (component as unknown as LifecycleComponent).onLoad?.();
}

const CCTools = {
    WidgetUpdateAlignment(target: NodeTarget) {
        const node = resolveNode(target);
        if (!node || EDITOR) return false;

        let changed = false;

        const lsf = node.getComponent('LongScreenFit') as DynamicComponent | null;
        if (lsf != null && lsf.enabled) {
            callOnLoad(lsf);
            lsf.enabled = false;
            changed = true;
        }

        const widget = node.getComponent(Widget);
        if (widget != null && widget.enabled) {
            widget.updateAlignment();
            if (widget.alignMode === Widget.AlignMode.ONCE || widget.alignMode === Widget.AlignMode.ON_WINDOW_RESIZE) {
                widget.enabled = false;
            }
            changed = true;
        }

        const tmf = node.getComponent('ThirdMenuFit') as DynamicComponent | null;
        if (tmf != null && tmf.enabled) {
            callOnLoad(tmf);
            tmf.enabled = false;
            changed = true;
        }

        return changed;
    },

    WidgetsUpdateAlignment(target: NodeTarget) {
        const node = resolveNode(target);
        if (!node) return;

        node.getComponentsInChildren(Widget).forEach(widget => {
            CCTools.WidgetUpdateAlignment(widget.node);
        });
    },

    ResizeSprite(spriteTarget: NodeTarget) {
        const node = resolveNode(spriteTarget);
        if (!node) return;

        const sprite = node.getComponent(Sprite);
        const rect = sprite?.spriteFrame?.getRect();
        if (!rect) return;

        ensureUITransform(node).setContentSize(rect.width, rect.height);
    },

    SetNodeByParam(target: NodeTarget, param: NodeParam) {
        const node = resolveNode(target);
        if (!node || !param) return;

        if (param.active != null) node.active = param.active;
        if (param.x != null || param.y != null) {
            const position = node.position;
            node.setPosition(param.x != null ? param.x : position.x, param.y != null ? param.y : position.y, position.z);
        }
        if (param.rotation != null) node.angle = param.rotation;

        const transform = ensureUITransform(node);
        if (param.anchorX != null || param.anchorY != null) {
            transform.setAnchorPoint(
                param.anchorX != null ? param.anchorX : transform.anchorX,
                param.anchorY != null ? param.anchorY : transform.anchorY,
            );
        }
        if (param.skewX != null || param.skewY != null) {
            const skew = node.getComponent(UISkew) || node.addComponent(UISkew);
            const currentSkew = skew.getSkew();
            skew.setSkew(param.skewX != null ? param.skewX : currentSkew.x, param.skewY != null ? param.skewY : currentSkew.y);
        }

        if (param.scale != null) {
            node.setScale(param.scale, param.scale, node.scale.z);
        }
        if (param.scaleX != null || param.scaleY != null) {
            const scale = node.scale;
            node.setScale(param.scaleX != null ? param.scaleX : scale.x, param.scaleY != null ? param.scaleY : scale.y, scale.z);
        }

        if (param.width != null || param.height != null) {
            transform.setContentSize(
                param.width != null ? param.width : transform.contentSize.width,
                param.height != null ? param.height : transform.contentSize.height,
            );
        }

        if (param.color != null) setRenderableColor(node, toColor(param.color));
        if (param.opacity != null) ensureOpacity(node).opacity = param.opacity;

        if (param.label != null) {
            let label: Label | RichText | null = node.getComponent(Label) || node.getComponent(RichText);
            if (label == null) {
                const text = param.label.string != null ? GameKit.i18n.sel(param.label.string) : '';
                label = typeof text === 'string' && text.includes('</') ? node.addComponent(RichText) : node.addComponent(Label);
            }

            if (param.label.string != null) label.string = GameKit.i18n.sel(param.label.string);
            if (param.label.fontSize != null) label.fontSize = param.label.fontSize;
            if (param.label.lineHeight != null) label.lineHeight = param.label.lineHeight;
            if (label instanceof RichText && param.label.maxWidth != null) label.maxWidth = param.label.maxWidth;
            if (param.label.maxLines != null) setMaxLines(node, param.label.maxLines);
        }

        if (param.outline != null) {
            const labelOutline = node.getComponent(LabelOutline) || node.addComponent(LabelOutline);
            const label = node.getComponent(Label);
            if (label) label.cacheMode = Label.CacheMode.NONE;

            if (param.outline.color != null) labelOutline.color = toColor(param.outline.color);
            if (param.outline.width != null) labelOutline.width = param.outline.width;
        }

        if (param.shadow != null) {
            const labelShadow = node.getComponent(LabelShadow) || node.addComponent(LabelShadow);
            const label = node.getComponent(Label);
            if (label) label.cacheMode = Label.CacheMode.NONE;

            const alpha = param.shadow.opacity != null ? param.shadow.opacity : 255;
            if (param.shadow.color != null || param.shadow.opacity != null) {
                labelShadow.color = toColor(param.shadow.color, alpha);
            }
            if (param.shadow.dx != null || param.shadow.dy != null) {
                labelShadow.offset = new Vec2(param.shadow.dx || 0, param.shadow.dy || 0);
            }
        }

        if (param.sprite != null) {
            const sprite = node.getComponent(Sprite) || node.addComponent(Sprite);
            const img = param.sprite.image;
            if (img && !EDITOR) {
                if (img.startsWith('http')) {
                    cce.loaderLoad({ url: img, type: 'png' }, (err: any, v: ImageAsset) => {
                        if (err != null) { Logs.Warning(err); return; }
                        if (!sprite || !node) return;
                        sprite.spriteFrame = createSpriteFrame(v);
                    });
                } else {
                    const resName = 'res/Activity/images/' + img;
                    cce.loadRes(resName, SpriteFrame, (err: any, v: SpriteFrame) => {
                        if (err != null) { Logs.Warning(err); return; }
                        if (!sprite || !node) return;
                        sprite.spriteFrame = v;
                    });
                }
            }
        }

        const animationKeys = ['blinkAnim', 'moveAnim', 'loopMoveAnim', 'rotateAnim', 'scaleAnim', 'skewAnim', 'shakeAnim'];
        animationKeys.forEach(key => {
            if (param[key] == null) return;

            const componentName = key.charAt(0).toUpperCase() + key.slice(1);
            const component = (node.getComponent(componentName) || node.addComponent(componentName)) as DynamicComponent | null;
            if (!component) return;

            Object.keys(param[key]).forEach(paramKey => {
                if (param[key][paramKey] != null) component[paramKey] = param[key][paramKey];
            });
        });
    },

    getComponentInParent(root: NodeTarget, comp: any) {
        let node = resolveNode(root);
        let component: Component | null = null;

        while (node && node !== UIRoot.instance && !(node instanceof Scene)) {
            component = node.getComponent(comp);
            if (component != null) break;
            node = node.parent;
        }

        return component;
    },
};

global.CCTools = CCTools;

export default CCTools;
