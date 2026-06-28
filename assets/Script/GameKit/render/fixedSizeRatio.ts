import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, UITransform, Vec2 } from 'cc';

const { ccclass, executionOrder, executeInEditMode, property } = _decorator;

export enum RatioType {
    free = 0,
    width = 1,
    height = 2,
}

Enum(RatioType);

type SpriteTarget = Sprite | Node | Component | null | undefined;

function resolveNode(target: SpriteTarget): Node | null {
    if (!target) {
        return null;
    }
    if (target instanceof Node) {
        return target;
    }
    return target.node || null;
}

function ensureUITransform(node: Node): UITransform {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

function getSize(node: Node): Vec2 {
    const transform = ensureUITransform(node);
    return new Vec2(transform.width, transform.height);
}

function setSize(node: Node, width: number, height: number): void {
    ensureUITransform(node).setContentSize(width, height);
}

@ccclass('FixedSizeRatio')
@executionOrder(-1)
@executeInEditMode
export class FixedSizeRatio extends Component {
    @property({ type: RatioType, visible: false })
    private _N$type = RatioType.free;

    @property
    public keepRawRatio = false;

    public width = 0;
    public height = 0;
    public sprite: Sprite | null = null;
    public spriteFrame: SpriteFrame | null = null;
    public inited = false;

    @property({ type: RatioType })
    get type(): RatioType {
        return this._N$type;
    }

    set type(value: RatioType) {
        this._N$type = value;
        this.cacheCurrentSize();
    }

    static fitSpriteInRange(sprite: SpriteTarget, range?: Vec2 | null): void {
        const node = resolveNode(sprite);
        if (!node) {
            return;
        }

        const size = getSize(node);
        const targetRange = range || size;
        const fix = node.getComponent(FixedSizeRatio) || node.addComponent(FixedSizeRatio);
        if (fix.keepRawRatio) {
            fix.sprite = fix.getComponent(Sprite);
            if (fix.sprite) {
                CCTools.ResizeSprite(fix.sprite);
            }
        }

        const current = getSize(node);
        if (current.x <= targetRange.x && current.y <= targetRange.y) {
            return;
        }

        const isWidthLimited = current.x / targetRange.x > current.y / targetRange.y;
        if (isWidthLimited) {
            fix.setWidth();
            setSize(node, targetRange.x, current.y);
        } else {
            fix.setHeight();
            setSize(node, current.x, targetRange.y);
        }
        fix.update();
    }

    static fitByHeight(sprite: SpriteTarget, height?: number | null): void {
        const node = resolveNode(sprite);
        if (!node) {
            return;
        }

        const current = getSize(node);
        const targetHeight = height == null ? current.y : height;
        CCTools.ResizeSprite(node);

        const spriteComponent = node.getComponent(Sprite);
        if (spriteComponent) {
            spriteComponent.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        const fix = node.getComponent(FixedSizeRatio) || node.addComponent(FixedSizeRatio);
        fix.setHeight();
        setSize(node, getSize(node).x, targetHeight);
        fix.update();
    }

    static fitSpriteInRange2(sprite: SpriteTarget, range: Vec2, originSize: Vec2): void {
        const node = resolveNode(sprite);
        if (!node || !range || !originSize || originSize.x <= 0 || originSize.y <= 0) {
            return;
        }

        const scaleX = range.x / originSize.x;
        const scaleY = range.y / originSize.y;
        const scale = scaleX > 1 || scaleY > 1 ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
        setSize(node, scale * originSize.x, scale * originSize.y);
    }

    start(): void {
        if (this.inited) {
            return;
        }

        this.cacheCurrentSize();
        this.sprite = this.getComponent(Sprite);
        this.spriteFrame = this.sprite ? this.sprite.spriteFrame : null;
        this.inited = true;

        if (
            this.sprite
            && (this.sprite.sizeMode === Sprite.SizeMode.TRIMMED || this.sprite.sizeMode === Sprite.SizeMode.RAW)
        ) {
            this.sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            this.keepRawRatio = true;
        }

        if (CCTools.WidgetUpdateAlignment(this)) {
            this.update();
        }
    }

    update(): void {
        if (this._N$type === RatioType.free) {
            return;
        }

        if (this.sprite && this.spriteFrame !== this.sprite.spriteFrame) {
            this.spriteFrame = this.sprite.spriteFrame;
            if (this._N$type === RatioType.width) {
                const currentWidth = this.width;
                if (this.keepRawRatio) {
                    CCTools.ResizeSprite(this.sprite);
                }
                this.setWidth();
                setSize(this.node, currentWidth, getSize(this.node).y);
            } else {
                const currentHeight = this.height;
                if (this.keepRawRatio) {
                    CCTools.ResizeSprite(this.sprite);
                }
                this.setHeight();
                setSize(this.node, getSize(this.node).x, currentHeight);
            }
        }

        const current = getSize(this.node);
        if (Math.abs(this.width - current.x) < 0.01 && Math.abs(this.height - current.y) < 0.01) {
            return;
        }

        if (this._N$type === RatioType.width) {
            const nextHeight = this.width !== 0 ? current.x * this.height / this.width : current.y;
            setSize(this.node, current.x, nextHeight);
        } else {
            const nextWidth = this.height !== 0 ? current.y * this.width / this.height : current.x;
            setSize(this.node, nextWidth, current.y);
        }

        this.cacheCurrentSize();
    }

    setWidth(): void {
        this._N$type = RatioType.width;
        this.cacheCurrentSize();
        this.cacheSpriteState();
    }

    setHeight(): void {
        this._N$type = RatioType.height;
        this.cacheCurrentSize();
        this.cacheSpriteState();
    }

    private cacheCurrentSize(): void {
        const size = getSize(this.node);
        this.width = size.x;
        this.height = size.y;
    }

    private cacheSpriteState(): void {
        this.sprite = this.getComponent(Sprite);
        this.spriteFrame = this.sprite ? this.sprite.spriteFrame : null;
        this.inited = true;
    }
}

export const fitSpriteInRange = FixedSizeRatio.fitSpriteInRange;
export const fitByHeight = FixedSizeRatio.fitByHeight;
export const fitSpriteInRange2 = FixedSizeRatio.fitSpriteInRange2;

export default FixedSizeRatio;
