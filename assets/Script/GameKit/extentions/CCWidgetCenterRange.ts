import { _decorator, Component, Node, UITransform, Widget } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('CCWidgetCenterRange')
@menu('GameKit/extentions/CCWidgetCenterRange')
@executeInEditMode
export class CCWidgetCenterRange extends Component {
    @property({ visible: false })
    private _N$vertical = false;

    @property({ visible: false })
    private _N$verticalNeedHeight = 0;

    @property({ visible: false })
    private _N$horizontal = false;

    @property({ visible: false })
    private _N$horizontalNeedWidth = 0;

    private widget: Widget | null = null;
    private target: Node | null = null;
    private verticalCenterPos = 0;
    private horizontalCenterPos = 0;

    @property
    get vertical() {
        return this._N$vertical;
    }

    set vertical(value: boolean) {
        this._N$vertical = value;
        this.resetWidget();
    }

    @property
    get verticalNeedHeight() {
        return this._N$verticalNeedHeight;
    }

    set verticalNeedHeight(value: number) {
        this._N$verticalNeedHeight = value;
        this.resetWidget();
    }

    @property
    get horizontal() {
        return this._N$horizontal;
    }

    set horizontal(value: boolean) {
        this._N$horizontal = value;
        this.resetWidget();
    }

    @property
    get horizontalNeedWidth() {
        return this._N$horizontalNeedWidth;
    }

    set horizontalNeedWidth(value: number) {
        this._N$horizontalNeedWidth = value;
        this.resetWidget();
    }

    onLoad() {
        this.updateAlignmentRange();
    }

    start() {
        this.updateAlignmentRange();
    }

    update() {
        this.updateAlignmentRange();
    }

    private resetWidget() {
        this.widget = null;
        this.target = null;
        this.updateAlignmentRange();
    }

    private updateAlignmentRange() {
        if (!this.vertical && !this.horizontal) return;

        if (!this.widget) {
            this.widget = this.getComponent(Widget);
            if (!this.widget) return;

            if (this.vertical) this.verticalCenterPos = this.widget.verticalCenter;
            if (this.horizontal) this.horizontalCenterPos = this.widget.horizontalCenter;
            this.target = this.widget.target || this.node.parent;
        }

        if (!this.target) return;

        const targetTransform = this.target.getComponent(UITransform);
        if (!targetTransform) return;

        if (this.vertical) {
            if (this.verticalNeedHeight > 0 && targetTransform.height < this.verticalNeedHeight) {
                this.widget.verticalCenter = targetTransform.height / this.verticalNeedHeight * this.verticalCenterPos;
            } else {
                this.widget.verticalCenter = this.verticalCenterPos;
            }
        }

        if (this.horizontal) {
            if (this.horizontalNeedWidth > 0 && targetTransform.width < this.horizontalNeedWidth) {
                this.widget.horizontalCenter = targetTransform.width / this.horizontalNeedWidth * this.horizontalCenterPos;
            } else {
                this.widget.horizontalCenter = this.horizontalCenterPos;
            }
        }
    }
}

export default CCWidgetCenterRange;
