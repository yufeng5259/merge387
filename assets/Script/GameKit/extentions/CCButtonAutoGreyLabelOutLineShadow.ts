import { _decorator, Button, Color, Component, Label, LabelOutline, LabelShadow } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

interface ButtonWithAutoGray extends Button {
    enableAutoGrayEffect?: boolean;
}

@ccclass('CCButtonAutoGreyLabelOutLineShadow')
@menu('GameKit/extentions/CCButtonAutoGreyLabelOutLineShadow')
@executeInEditMode
export class CCButtonAutoGreyLabelOutLineShadow extends Component {
    @property([Label])
    public labels: Label[] = [];

    @property
    public useInOutLine = true;

    @property
    public outlineColorEnable = new Color();

    @property
    public outlineColorDisable = new Color();

    @property
    public useInShadow = true;

    @property
    public shadowColorEnable = new Color();

    @property
    public shadowColorDisable = new Color();

    private button: ButtonWithAutoGray | null = null;
    private interactable: boolean | null = null;

    update() {
        if (!this.button) {
            this.button = this.getComponent(Button);
            if (!this.button) return;
        }

        if (!this.button.enableAutoGrayEffect) return;
        if (this.interactable === this.button.interactable) return;

        this.interactable = this.button.interactable;
        const outlineColor = this.interactable ? this.outlineColorEnable : this.outlineColorDisable;
        const shadowColor = this.interactable ? this.shadowColorEnable : this.shadowColorDisable;

        this.labels.forEach((label) => {
            if (!label) return;

            if (this.useInOutLine) {
                const outline = label.node.getComponent(LabelOutline);
                if (outline) {
                    outline.color = outlineColor;
                }
            }

            if (this.useInShadow) {
                const shadow = label.node.getComponent(LabelShadow);
                if (shadow) {
                    shadow.color = shadowColor;
                }
            }
        });
    }
}

export default CCButtonAutoGreyLabelOutLineShadow;
