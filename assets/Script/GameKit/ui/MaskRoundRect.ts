import { _decorator, Component, Graphics, Mask, UITransform } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executeInEditMode, menu, property } = _decorator;

@ccclass('MaskRoundRect')
@executeInEditMode(true)
@menu('GameKit/UI/MaskRoundRect')
export default class MaskRoundRect extends Component {
    @property
    public radius = 15;

    private lastWidth = -1;
    private lastHeight = -1;
    private lastAnchorX = -1;
    private lastAnchorY = -1;
    private lastRadius = -1;

    public onLoad() {
        this.refreshMask();
    }

    public onEnable() {
        this.refreshMask();
    }

    public update() {
        if (!EDITOR) return;
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        const size = transform.contentSize;
        const anchor = transform.anchorPoint;
        if (this.lastWidth !== size.width || this.lastHeight !== size.height ||
            this.lastAnchorX !== anchor.x || this.lastAnchorY !== anchor.y || this.lastRadius !== this.radius) {
            this.refreshMask();
        }
    }

    public refreshMask() {
        const mask = this.node.getComponent(Mask) || this.node.addComponent(Mask);
        mask.type = Mask.Type.GRAPHICS_STENCIL;
        this.drawMask();
    }

    public drawMask() {
        const transform = this.node.getComponent(UITransform);
        const graphics = this.node.getComponent(Graphics) || this.node.addComponent(Graphics);
        if (!transform || !graphics) return false;
        const size = transform.contentSize;
        if (size.width <= 0 || size.height <= 0) return false;
        const anchor = transform.anchorPoint;
        const x = -size.width * anchor.x;
        const y = -size.height * anchor.y;
        const radius = Math.min(Math.max(this.radius, 0), size.width / 2, size.height / 2);
        graphics.clear();
        graphics.roundRect(x, y, size.width, size.height, radius);
        graphics.fill();
        this.lastWidth = size.width;
        this.lastHeight = size.height;
        this.lastAnchorX = anchor.x;
        this.lastAnchorY = anchor.y;
        this.lastRadius = this.radius;
        return true;
    }

    public setRadius(radius: number) {
        this.radius = radius;
        this.refreshMask();
    }
}
