import { _decorator, Color, Component, Label, LabelOutline } from 'cc';

const { ccclass, executeInEditMode, property, requireComponent } = _decorator;

@ccclass('LabelGray')
@requireComponent(Label)
@executeInEditMode
export class LabelGray extends Component {
    @property({ visible: false })
    private _gray = false;

    private initColor: Color | null = null;
    private outColor: Color | null = null;
    private isInit = false;

    @property
    get gray(): boolean {
        return this._gray;
    }

    set gray(value: boolean) {
        this._gray = value;
        this.initText();
    }

    static SetGray(label: Label | null | undefined, gray: boolean): void {
        if (!label || !label.node) {
            return;
        }

        let labelGray = label.node.getComponent(LabelGray);
        if (!labelGray) {
            labelGray = label.node.addComponent(LabelGray);
        }
        labelGray.gray = gray;
    }

    onLoad(): void {
        this.captureInitialColors();
        this.initText();
    }

    initText(): void {
        this.captureInitialColors();

        const label = this.getComponent(Label);
        if (label && this.initColor) {
            label.color = Color.clone(this._gray ? Color.GRAY : this.initColor);
        }

        const outline = this.getComponent(LabelOutline);
        if (outline && this.outColor) {
            outline.color = Color.clone(this._gray ? Color.GRAY : this.outColor);
        }
    }

    private captureInitialColors(): void {
        if (this.isInit) {
            return;
        }

        const label = this.getComponent(Label);
        if (label) {
            this.initColor = Color.clone(label.color);
        }

        const outline = this.getComponent(LabelOutline);
        if (outline) {
            this.outColor = Color.clone(outline.color);
        }

        this.isInit = true;
    }
}

export default LabelGray;
