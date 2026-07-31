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
        const mask = this.getMask();
        mask.type = Mask.Type.GRAPHICS_STENCIL;
        this.patchMask(mask);
        this.drawMask();
    }

    public getMask() {
        return this.node.getComponent(Mask) || this.node.addComponent(Mask);
    }

    public getGraphics(mask?: Mask) {
        const node = mask?.node || this.node;
        return node.getComponent(Graphics) || node.addComponent(Graphics);
    }

    public patchMask(mask: Mask) {
        mask.type = Mask.Type.GRAPHICS_STENCIL;
    }

    public drawMask() {
        const transform = this.node.getComponent(UITransform);
        const graphics = this.getGraphics();
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

    public drawRoundRectPath(graphics: Graphics, x: number, y: number, width: number, height: number, radius: number) {
        const right = x + width;
        const top = y + height;
        graphics.moveTo(x + radius, y);
        graphics.lineTo(right - radius, y);
        graphics.quadraticCurveTo(right, y, right, y + radius);
        graphics.lineTo(right, top - radius);
        graphics.quadraticCurveTo(right, top, right - radius, top);
        graphics.lineTo(x + radius, top);
        graphics.quadraticCurveTo(x, top, x, top - radius);
        graphics.lineTo(x, y + radius);
        graphics.quadraticCurveTo(x, y, x + radius, y);
        graphics.close();
    }

    public setRadius(radius: number) {
        this.radius = radius;
        this.refreshMask();
    }
}
