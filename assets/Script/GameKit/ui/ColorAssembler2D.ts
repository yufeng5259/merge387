import { _decorator, Color, Component, UIRenderer } from 'cc';

const { ccclass, executeInEditMode, property, requireComponent } = _decorator;

function defaultColor(): Color {
    return new Color(255, 255, 255, 255);
}

function cloneColor(value: Readonly<Color> | null | undefined): Color {
    return value ? Color.clone(value) : defaultColor();
}

function cloneColors(colors: readonly Color[] | null | undefined): Color[] {
    return colors && colors.length > 0 ? colors.map((color) => cloneColor(color)) : [];
}

@ccclass('ColorAssembler2D')
@executeInEditMode
@requireComponent(UIRenderer)
export default class ColorAssembler2D extends Component {
    @property({ type: [Color], visible: false })
    private _colors: Color[] = [];

    @property({ type: [Color] })
    get colors(): Color[] {
        return this._colors;
    }

    set colors(colors: Color[]) {
        this._colors = cloneColors(colors);
        this._updateColors();
    }

    public onEnable(): void {
        this._updateColors();
    }

    public onDisable(): void {
        this._updateColors();
    }

    public _updateColors(): void {
        const renderer = this.getComponent(UIRenderer);
        if (!renderer) {
            return;
        }

        renderer.color = cloneColor(this._colors[0] || renderer.color);
        renderer.updateRenderer();
    }
}
