import { _decorator, CCInteger, Component, Label, RichText, UITransform } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('CCLabelMaxLines')
@menu('GameKit/extentions/CCLabelMaxLines')
@executeInEditMode
export class CCLabelMaxLines extends Component {
    @property({ visible: false })
    private _N$maxLines = 0;

    @property({ type: CCInteger, range: [0, Number.MAX_VALUE, 1] })
    get maxLines() {
        return this._N$maxLines;
    }

    set maxLines(value: number) {
        this._N$maxLines = value;
        this.setLines();
    }

    @property({ displayName: 'Actual Font Size', readonly: true })
    get actualFontSize() {
        const label = this.getComponent(Label);
        if (label) {
            return label.actualFontSize || 0;
        }

        const richText = this.getComponent(RichText);
        if (richText) {
            return richText.fontSize || 0;
        }

        return 0;
    }

    onLoad() {
        this.setLines();
    }

    onEnable() {
        this.setLines();
    }

    setLines() {
        const maxLines = Math.max(0, Math.floor(this.maxLines));
        if (maxLines <= 0) {
            return;
        }

        const label = this.getComponent(Label);
        if (label) {
            const transform = this.ensureUITransform();
            label.overflow = Label.Overflow.CLAMP;
            label.enableWrapText = true;
            transform.setContentSize(transform.contentSize.width, label.lineHeight * maxLines);
        }

        const richText = this.getComponent(RichText);
        if (richText) {
            const transform = this.ensureUITransform();
            const width = richText.maxWidth > 0 ? richText.maxWidth : transform.contentSize.width;
            if (width > 0) {
                richText.maxWidth = width;
            }
            transform.setContentSize(transform.contentSize.width, richText.lineHeight * maxLines);
        }
    }

    private ensureUITransform() {
        return this.getComponent(UITransform) || this.addComponent(UITransform);
    }
}

export default CCLabelMaxLines;
