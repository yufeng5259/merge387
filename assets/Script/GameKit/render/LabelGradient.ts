import { _decorator, Color, Component, Label } from 'cc';

const { ccclass, executeInEditMode, property, requireComponent } = _decorator;

function createDefaultColor(): Color {
    return new Color(255, 255, 255, 255);
}

function cloneColor(value: Readonly<Color> | null | undefined): Color {
    return value ? Color.clone(value) : createDefaultColor();
}

@ccclass('LabelGradient')
@executeInEditMode
@requireComponent(Label)
export class LabelGradient extends Component {
    @property({ type: Color, visible: false })
    private _colorFrom = createDefaultColor();

    @property({ type: Color, visible: false })
    private _colorTo = createDefaultColor();

    @property({ visible: false })
    private _horizontal = false;

    @property({ type: Color })
    get colorFrom(): Color {
        return this._colorFrom;
    }

    set colorFrom(value: Color) {
        this._colorFrom = cloneColor(value);
        this._updateRenderData();
    }

    @property({ type: Color })
    get colorTo(): Color {
        return this._colorTo;
    }

    set colorTo(value: Color) {
        this._colorTo = cloneColor(value);
        this._updateRenderData();
    }

    @property
    get horizontal(): boolean {
        return this._horizontal;
    }

    set horizontal(value: boolean) {
        this._horizontal = value;
        this._updateRenderData();
    }

    onLoad(): void {
        if (typeof AppKit !== 'undefined' && AppKit.SdkManager?.IsNative?.()) {
            this.enabled = false;
        }
    }

    onEnable(): void {
        this._updateRenderData();
    }

    onDisable(): void {
        this._updateRenderData();
    }

    _updateRenderData(): void {
        const label = this.node.getComponent(Label);
        if (label) {
            label.updateRenderData(true);
        }
    }
}

export default LabelGradient;
