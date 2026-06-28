import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('AdvancedWidget')
@executeInEditMode
export class AdvancedWidget extends Component {
    @property(Node)
    public targetLeft: Node | null = null;

    @property
    public left = 0;

    @property(Node)
    public targetRight: Node | null = null;

    @property
    public right = 0;

    @property(Node)
    public targetTop: Node | null = null;

    @property
    public top = 0;

    @property(Node)
    public targetBottom: Node | null = null;

    @property
    public bottom = 0;

    @property
    public always = true;

    private _editoralways = false;

    onLoad() {
        if (EDITOR && this.always) {
            this._editoralways = true;
        }
        this.execute();
    }

    onEnable() {
        if (EDITOR && this.always) {
            this.node.setPosition(0, 0, 0);
            this._editoralways = true;
            this.execute();
        }
    }

    update(dt: number) {
        if (this.always) {
            this.execute();
        }
    }

    execute() {
        if (!this.node) return;
        if (EDITOR && !this._editoralways) return;
        if (EDITOR && this._editoralways) this._editoralways = false;

        const targetLeftTransform = this.targetLeft && this.targetLeft.getComponent(UITransform);
        const targetRightTransform = this.targetRight && this.targetRight.getComponent(UITransform);
        const targetTopTransform = this.targetTop && this.targetTop.getComponent(UITransform);
        const targetBottomTransform = this.targetBottom && this.targetBottom.getComponent(UITransform);
        const transform = this.node.getComponent(UITransform);

        if (!this.targetLeft || !this.targetRight || !this.targetTop || !this.targetBottom) return;
        if (!targetLeftTransform || !targetRightTransform || !targetTopTransform || !targetBottomTransform || !transform) return;

        const leftWorldPos = this.targetLeft.worldPosition;
        const rightWorldPos = this.targetRight.worldPosition;
        const topWorldPos = this.targetTop.worldPosition;
        const bottomWorldPos = this.targetBottom.worldPosition;

        const boundl = leftWorldPos.x - targetLeftTransform.anchorX * targetLeftTransform.width + this.left;
        const boundr = rightWorldPos.x + (1 - targetRightTransform.anchorX) * targetRightTransform.width + this.right;
        const boundb = bottomWorldPos.y - targetBottomTransform.anchorY * targetBottomTransform.height + this.bottom;
        const boundt = topWorldPos.y + (1 - targetTopTransform.anchorY) * targetTopTransform.height + this.top;

        transform.setContentSize(boundr - boundl, boundt - boundb);
        this.node.setWorldPosition(new Vec3((boundr + boundl) / 2, (boundb + boundt) / 2, this.node.worldPosition.z));
    }
}

export default AdvancedWidget;
