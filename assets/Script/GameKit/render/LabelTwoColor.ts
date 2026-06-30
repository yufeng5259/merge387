import { _decorator, Color, Component, instantiate, Label, Mask, Node, RichText, UITransform } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executeInEditMode, property } = _decorator;

const CHILD_NAME = '_TwoColor_child';

function createDefaultColor(): Color {
    return new Color(255, 255, 255, 255);
}

function cloneColor(value: Readonly<Color> | null | undefined): Color {
    return value ? Color.clone(value) : createDefaultColor();
}

function ensureUITransform(node: Node): UITransform {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

@ccclass('LabelTwoColor')
@executeInEditMode
export class LabelTwoColor extends Component {
    @property({ visible: false })
    private _colorTo = createDefaultColor();

    @property({ visible: false })
    private _offset = 0;

    public child: Node | null = null;
    public cLabel: Node | null = null;
    public inited = false;

    @property
    get colorTo(): Color {
        return this._colorTo;
    }

    set colorTo(value: Color) {
        this._colorTo = cloneColor(value);
        this._updateRenderData(true);
    }

    @property
    get offset(): number {
        return this._offset;
    }

    set offset(value: number) {
        this._offset = value;
        if (!this.child) {
            this._updateRenderData(true);
            return;
        }
        this.updateChildTransform();
    }

    start(): void {
        this._updateRenderData(true);
    }

    update(): void {
        this._updateRenderData();
        this.inited = true;
    }

    _updateRenderData(force = false): void {
        if (!this.enabled) {
            return;
        }

        this.ensureChildNodes();
        this.updateChildTransform();
        this.syncLabel(force);
        this.syncRichText(force);
    }

    private ensureChildNodes(): void {
        const child = this.node.getChildByName(CHILD_NAME);
        if (child && !this.child) {
            this.child = child;
            this.cLabel = child.children[0] || null;
        }

        if (!this.child || (EDITOR && !this.child.active) || !this.cLabel) {
            this.createChildNodes();
        }
    }

    private createChildNodes(): void {
        const clonedLabel = instantiate(this.node);
        clonedLabel.name = `${this.node.name}_TwoColor_label`;

        const duplicate = clonedLabel.getComponent(LabelTwoColor);
        if (duplicate) {
            clonedLabel.removeComponent(duplicate);
        }

        const nestedChild = clonedLabel.getChildByName(CHILD_NAME);
        if (nestedChild) {
            nestedChild.parent = null;
            nestedChild.destroy();
        }

        const maskNode = new Node(CHILD_NAME);
        maskNode.parent = this.node;
        maskNode.setPosition(0, 0, 0);
        maskNode.addComponent(Mask);

        clonedLabel.parent = maskNode;
        clonedLabel.setPosition(0, 0, 0);
        clonedLabel.setScale(1, 1, 1);

        this.child = maskNode;
        this.cLabel = clonedLabel;
    }

    private updateChildTransform(): void {
        if (!this.child) {
            return;
        }

        const sourceTransform = this.node.getComponent(UITransform);
        const childTransform = ensureUITransform(this.child);
        const labelTransform = this.cLabel ? ensureUITransform(this.cLabel) : null;
        const sourceWidth = sourceTransform ? sourceTransform.width : 0;
        const sourceHeight = sourceTransform ? sourceTransform.height : 0;
        const heightScale = Math.max(1 - this._offset, 0.0001);

        childTransform.setAnchorPoint(0.5, heightScale);
        childTransform.width = sourceWidth;
        childTransform.height = sourceHeight / 2 / heightScale;

        if (labelTransform) {
            labelTransform.width = sourceWidth;
            labelTransform.height = sourceHeight;
        }
    }

    private syncLabel(force: boolean): void {
        if (!this.cLabel) {
            return;
        }

        const source = this.getComponent(Label);
        const target = this.cLabel.getComponent(Label);
        if (!source || !target) {
            return;
        }

        if (force || target.string !== source.string) {
            target.string = source.string;
        }
        target.horizontalAlign = source.horizontalAlign;
        target.verticalAlign = source.verticalAlign;
        target.fontSize = source.fontSize;
        target.color = cloneColor(this._colorTo);
    }

    private syncRichText(force: boolean): void {
        if (!this.cLabel) {
            return;
        }

        const source = this.getComponent(RichText);
        const target = this.cLabel.getComponent(RichText);
        if (!source || !target) {
            return;
        }

        if (force || target.string !== source.string) {
            target.string = source.string;
        }
        target.horizontalAlign = source.horizontalAlign;
        target.fontSize = source.fontSize;
        target.fontColor = cloneColor(this._colorTo);
    }
}

export default LabelTwoColor;
