import { _decorator, Component, Enum, Sprite, SpriteFrame, UITransform, Vec2 } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executionOrder, executeInEditMode, property, requireComponent } = _decorator;

enum RatioType {
    width = 1,
    height = 2,
    box = 3,
}

Enum(RatioType);

function cloneVec2(value: Readonly<Vec2> | null | undefined): Vec2 {
    return value ? new Vec2(value.x, value.y) : new Vec2();
}

function getUITransform(node: Component['node'] | null): UITransform | null {
    return node ? node.getComponent(UITransform) : null;
}

@ccclass('SpriteFitSize')
@executionOrder(-1)
@executeInEditMode
@requireComponent(Sprite)
export class SpriteFitSize extends Component {
    @property({ type: RatioType, visible: false })
    private _N$type = RatioType.box;

    @property({ visible: false })
    private _N$maxSize = new Vec2();

    public sprite: Sprite | null = null;
    public spriteFrame: SpriteFrame | null = null;
    public inited = false;

    @property({ type: RatioType })
    get type(): RatioType {
        return this._N$type;
    }

    set type(value: RatioType) {
        this._N$type = value;
        this.updateSize();
    }

    @property
    get maxSize(): Vec2 {
        return this._N$maxSize;
    }

    set maxSize(value: Vec2) {
        this._N$maxSize = cloneVec2(value);
        this.updateSize();
    }

    @property
    get do(): boolean {
        return false;
    }

    set do(_value: boolean) {
        if (EDITOR) {
            this.updateSize();
        }
    }

    start(): void {
        if (this.inited) {
            return;
        }
        this.sprite = this.getComponent(Sprite);
        this.spriteFrame = this.sprite ? this.sprite.spriteFrame : null;
        this.inited = true;
        if (EDITOR) {
            return;
        }
        this.updateSize();
    }

    update(): void {
        if (!this.sprite) {
            return;
        }

        if (this.sprite.spriteFrame !== this.spriteFrame) {
            this.spriteFrame = this.sprite.spriteFrame;
            this.updateSize();
            return;
        }

        if (!this.isSizeMatched()) {
            this.updateSize();
        }
    }

    isSizeMatched(): boolean {
        const targetSize = this.getTargetSize();
        const transform = this.getComponent(UITransform);
        if (!targetSize || !transform) {
            return true;
        }

        return Math.abs(transform.width - targetSize.x) < 0.01
            && Math.abs(transform.height - targetSize.y) < 0.01;
    }

    getTargetSize(): Vec2 | null {
        if (!this.inited || !this.spriteFrame) {
            return null;
        }

        const rect = this.spriteFrame.getRect();
        const originalWidth = rect.width;
        const originalHeight = rect.height;
        if (originalWidth <= 0 || originalHeight <= 0) {
            return null;
        }

        const scale = this.getTargetScale(originalWidth, originalHeight);
        if (scale == null) {
            return null;
        }

        return new Vec2(
            originalWidth * scale * this.node.scale.x,
            originalHeight * scale * this.node.scale.y,
        );
    }

    updateSize(): void {
        const targetSize = this.getTargetSize();
        const transform = this.getComponent(UITransform);
        if (!targetSize || !transform) {
            return;
        }

        transform.width = targetSize.x;
        transform.height = targetSize.y;
    }

    private getTargetScale(originalWidth: number, originalHeight: number): number | null {
        let maxWidth = this._N$maxSize.x;
        let maxHeight = this._N$maxSize.y;

        if (this._N$type === RatioType.width) {
            return maxWidth / originalWidth;
        }

        if (this._N$type === RatioType.height) {
            return maxHeight / originalHeight;
        }

        if (this._N$type === RatioType.box) {
            const ownTransform = this.getComponent(UITransform);
            const parentTransform = getUITransform(this.node.parent);

            if (maxWidth <= 0 && parentTransform) {
                maxWidth = parentTransform.width;
            }
            if (maxHeight <= 0 && parentTransform) {
                maxHeight = parentTransform.height;
            }
            if (maxWidth <= 0 && ownTransform) {
                maxWidth = ownTransform.width;
            }
            if (maxHeight <= 0 && ownTransform) {
                maxHeight = ownTransform.height;
            }
            if (maxWidth <= 0 || maxHeight <= 0) {
                return null;
            }

            return Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
        }

        return null;
    }
}

export default SpriteFitSize;
