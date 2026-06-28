import { _decorator, Color, Component, Label, Vec2 } from 'cc';

const { ccclass, executeInEditMode, property } = _decorator;

function defaultShadowColor(): Color {
    return new Color(255, 255, 255, 255);
}

function cloneColor(value: Readonly<Color> | null | undefined): Color {
    return value ? Color.clone(value) : defaultShadowColor();
}

function opacityToAlpha(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
}

@ccclass('LabelShadowEx')
@executeInEditMode
export class LabelShadowEx extends Component {
    @property({ type: Color, visible: false })
    private _N$color = defaultShadowColor();

    @property({ visible: false })
    private _N$opacity = 255;

    @property({ visible: false })
    private _N$dx = 0;

    @property({ visible: false })
    private _N$dy = 0;

    @property({ type: Color })
    get color(): Color {
        return this._N$color;
    }

    set color(value: Color) {
        this._N$color = cloneColor(value);
        this._updateRenderData();
    }

    @property
    get opacity(): number {
        return this._N$opacity;
    }

    set opacity(value: number) {
        this._N$opacity = opacityToAlpha(value);
        this._updateRenderData();
    }

    @property
    get dx(): number {
        return this._N$dx;
    }

    set dx(value: number) {
        this._N$dx = value;
        this._updateRenderData();
    }

    @property
    get dy(): number {
        return this._N$dy;
    }

    set dy(value: number) {
        this._N$dy = value;
        this._updateRenderData();
    }

    public onLoad(): void {
        this._updateRenderData(true);
    }

    public onEnable(): void {
        this._updateRenderData(true);
    }

    public onDisable(): void {
        this.setLabelShadowEnabled(false);
    }

    public getUniName(): string {
        return this.node.name;
    }

    public _updateRenderData(_force = false): void {
        if (!this.node || !this.enabled) {
            return;
        }

        this.applyShadowToLabel();
    }

    private applyShadowToLabel(): void {
        const label = this.getComponent(Label);
        if (!label) {
            return;
        }

        const shadowColor = cloneColor(this._N$color);
        shadowColor.a = opacityToAlpha(this._N$opacity);
        label.enableShadow = true;
        label.shadowColor = shadowColor;
        label.shadowOffset = new Vec2(this._N$dx, this._N$dy);
        label.shadowBlur = 0;
        label.updateRenderData(true);
    }

    private setLabelShadowEnabled(enabled: boolean): void {
        const label = this.getComponent(Label);
        if (label) {
            label.enableShadow = enabled;
            label.updateRenderData(true);
        }
    }
}

export default LabelShadowEx;
