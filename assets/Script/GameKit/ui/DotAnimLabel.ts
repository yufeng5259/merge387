import { _decorator, Component, Label, RichText } from 'cc';

const { ccclass, executeInEditMode, property } = _decorator;

type I18nRuntime = {
    t: (key: string) => string;
};

function getI18n(): I18nRuntime | null {
    if (typeof GameKit === 'undefined' || !GameKit.i18n) {
        return null;
    }
    return GameKit.i18n as I18nRuntime;
}

function updateRightLanguage(target: object): void {
    if (!('updateRightLanguage' in target)) {
        return;
    }

    const update = (target as { updateRightLanguage?: unknown }).updateRightLanguage;
    if (typeof update === 'function') {
        update.call(target);
    }
}

@ccclass('DotAnimLabel')
@executeInEditMode
export class DotAnimLabel extends Component {
    @property
    public delay = 1;

    @property({ visible: false })
    private _N$textKey = 'TEXT_KEY';

    @property({
        multiline: true,
        tooltip: 'Enter i18n key here',
    })
    get textKey(): string {
        return this._N$textKey;
    }

    set textKey(value: string) {
        this._N$textKey = value;
        this.updateText();
    }

    @property
    public isBold = false;

    private dotCount = 0;
    private dotT = 0;

    public onLoad(): void {
        this.dotCount = 0;
        this.dotT = 0;
        this.updateText();
    }

    public update(dt: number): void {
        this.dotT += dt;
        if (this.dotT < this.delay) {
            return;
        }

        this.dotCount++;
        if (this.dotCount > 3) {
            this.dotCount -= 4;
        }

        this.dotT = 0;
        this.updateText();
    }

    private getLocalizedText(): string {
        const i18n = getI18n();
        return i18n ? i18n.t(this.textKey) : this.textKey;
    }

    private updateText(): void {
        const text = this.getLocalizedText();
        const dots = '.'.repeat(this.dotCount);
        const label = this.getComponent(Label);
        if (label) {
            label.string = `${text}${dots}`;
            label.cacheMode = Label.CacheMode.BITMAP;
            updateRightLanguage(label);
        }

        const richText = this.getComponent(RichText);
        if (richText) {
            const richString = `${text}${dots}`;
            richText.string = this.isBold ? `<b>${richString}</b>` : richString;
            updateRightLanguage(richText);
        }
    }
}

export default DotAnimLabel;
