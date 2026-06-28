import { _decorator, Button, Color, Component, Label } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

interface ButtonWithAutoGray extends Button {
    enableAutoGrayEffect?: boolean;
}

@ccclass('CCButtonAutoGreyLabel')
@menu('GameKit/extentions/CCButtonAutoGreyLabel')
@executeInEditMode
export class CCButtonAutoGreyLabel extends Component {
    @property([Label])
    public labels: Label[] = [];

    @property(Color)
    public colorEnable = new Color();

    @property(Color)
    public colorDisable = new Color();

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
        const color = this.interactable ? this.colorEnable : this.colorDisable;
        this.labels.forEach((label) => {
            if (label) {
                label.color = color;
            }
        });
    }
}

export default CCButtonAutoGreyLabel;
