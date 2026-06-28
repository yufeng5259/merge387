import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('CustomWidget')
@executeInEditMode
export class CustomWidget extends Component {
    @property(Node)
    public target: Node | null = null;

    @property
    public left = 0;

    @property
    public right = 0;

    @property
    public top = 0;

    @property
    public bottom = 0;

    @property
    public always = true;

    @property
    public reset = false;

    private _editoralways = false;

    onLoad() {
        if (EDITOR && this.always) {
            this._editoralways = true;
        }
        this.execute();
    }

    onEnable() {
        if (EDITOR && this.always) {
            if (this.target && !this.target.isChildOf(this.node)) {
                this.node.setPosition(0, 0, 0);
            }
            this._editoralways = true;
        }
        this.execute();
    }

    update(dt: number) {
        if (this.reset) {
            this._editoralways = true;
            this.reset = false;
            this.execute();
        }
        if (this.always) {
            this.execute();
        }
    }

    execute() {
        if (!this.target || !this.node) return;
        if (EDITOR && !this._editoralways) return;
        if (EDITOR && this._editoralways) this._editoralways = false;

        const targetTransform = this.target.getComponent(UITransform);
        const transform = this.node.getComponent(UITransform);
        if (!targetTransform || !transform) return;

        const width = targetTransform.width - this.left - this.right;
        const height = targetTransform.height - this.top - this.bottom;
        transform.setContentSize(width, height);

        if (!this.target.isChildOf(this.node)) {
            const targetWorldPos = this.target.worldPosition;
            const dx = targetWorldPos.x - targetTransform.anchorX * targetTransform.width + transform.anchorX * transform.width + this.left;
            const dy = targetWorldPos.y - targetTransform.anchorY * targetTransform.height + transform.anchorY * transform.height + this.bottom;
            this.node.setWorldPosition(new Vec3(dx, dy, this.node.worldPosition.z));
        }
    }
}

export default CustomWidget;
