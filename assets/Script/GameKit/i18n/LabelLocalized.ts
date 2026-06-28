import { _decorator, Component, Label, RichText } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

type I18nRuntime = {
    t: (key: string, opt?: unknown) => string;
    sel: (data: unknown) => string;
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

@ccclass('LabelLocalized')
@menu('GameKit/Editor/LabelLocalized')
@executeInEditMode
export class LabelLocalized extends Component {
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
        this.updateLocalizedText();
    }

    @property
    public isBold = false;

    private _runtimeTextData: unknown = null;

    setTextData(textData: unknown): void {
        this._runtimeTextData = textData;
        this.updateLocalizedText();
    }

    onLoad(): void {
        this.updateLocalizedText();
    }

    private getLocalizedText(): string {
        const i18n = getI18n();
        if (!i18n) {
            return this.textKey;
        }

        if (this._runtimeTextData != null) {
            return i18n.sel(this._runtimeTextData);
        }

        return i18n.t(this.textKey);
    }

    private updateLocalizedText(): void {
        const text = this.getLocalizedText();
        const label = this.getComponent(Label);
        if (label) {
            label.string = text;
            label.cacheMode = Label.CacheMode.BITMAP;
            updateRightLanguage(label);
        }

        const richText = this.getComponent(RichText);
        if (richText) {
            richText.string = this.isBold ? `<b>${text}</b>` : text;
            updateRightLanguage(richText);
        }
    }
}

export default LabelLocalized;
