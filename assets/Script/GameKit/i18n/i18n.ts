import '../../LegacyGlobals';
import { Label, RichText, sys } from 'cc';
import { EDITOR } from 'cc/env';

import ar from './data/ar';
import de from './data/de';
import en from './data/en';
import es from './data/es';
import fr from './data/fr';
import he from './data/he';
import it from './data/it';
import ja from './data/ja';
import ko from './data/ko';
import pt from './data/pt';
import zh from './data/zh';
import zh_tw from './data/zh_tw';
import Polyglot from './polyglot';

type LanguageCode = keyof typeof phrasesByLanguage;
type TranslateOptions = Record<string, string | number | boolean | null | undefined> | number;
type LocalizedObject = Record<string, string>;
type RightLanguageText = Label | RichText;

const phrasesByLanguage = {
    ar,
    de,
    en,
    es,
    fr,
    he,
    it,
    ja,
    ko,
    pt,
    zh,
    zh_tw,
};

const supportList = Object.keys(phrasesByLanguage) as LanguageCode[];
const polyglot = new Polyglot({ phrases: en, allowMissing: true });
const polyglotEn = new Polyglot({ phrases: en, allowMissing: true });

let lang = normalizeLanguage(sys.languageCode || sys.language);
let data = phrasesByLanguage[lang];

const userLanguage = sys.localStorage.getItem('user_language');
if (isSupportedLanguage(userLanguage)) {
    lang = userLanguage;
    data = phrasesByLanguage[lang];
}

polyglot.replace(data);

function normalizeLanguage(language: string): LanguageCode {
    const normalized = language.toLowerCase().replace('-', '_');
    if (!EDITOR && isSupportedLanguage(normalized)) {
        return normalized;
    }
    return 'en';
}

function isSupportedLanguage(language: unknown): language is LanguageCode {
    return typeof language === 'string' && supportList.includes(language as LanguageCode);
}

function updateRightLanguage(this: RightLanguageText): void {
    const rightToLeft = i18n.isLangRight();
    if (rightToLeft && this.horizontalAlign === Label.HorizontalAlign.LEFT && !this.ARABIC_Right) {
        this.ARABIC_Right = true;
        this.horizontalAlign = Label.HorizontalAlign.RIGHT;
    }
    if (!rightToLeft && this.ARABIC_Right) {
        this.ARABIC_Right = undefined;
        this.horizontalAlign = Label.HorizontalAlign.LEFT;
    }
    this.RightLanguage = rightToLeft;
}

Label.prototype.updateRightLanguage = updateRightLanguage;
RichText.prototype.updateRightLanguage = updateRightLanguage;

export const i18n = {
    init(language: string): void {
        lang = normalizeLanguage(language);
        data = phrasesByLanguage[lang];
        polyglot.replace(data);
        sys.localStorage.setItem('user_language', lang);
    },

    getLang(): string {
        return lang;
    },

    changeto(nextLanguage: string): void {
        const normalized = normalizeLanguage(nextLanguage);
        if (lang === normalized) {
            return;
        }

        this.init(normalized);
        BigNumber.setLanguage();
        UIRoot.instance.getComponentsInChildren('LabelLocalized').forEach((component: { onLoad?: () => void }) => {
            component.onLoad?.();
        });
        UIRoot.instance.getComponentsInChildren(Label).forEach((label: Label) => {
            label.updateRightLanguage?.();
        });
        UIRoot.instance.getComponentsInChildren(RichText).forEach((richText: RichText) => {
            richText.updateRightLanguage?.();
        });
    },

    isLangRight(): boolean {
        return lang === 'ar' || lang === 'he';
    },

    t(key: string, opt?: TranslateOptions): string {
        if (!this.has(key)) {
            return polyglotEn.t(key, opt);
        }
        return polyglot.t(key, opt);
    },

    has(key: string): boolean {
        return polyglot.has(key);
    },

    sel(obj: string | LocalizedObject): string {
        if (typeof obj !== 'object') {
            return obj;
        }

        return obj[lang] || obj.en || (Object.keys(obj).length > 0 ? obj[Object.keys(obj)[0]] : '');
    },
};

GameKit.i18n = i18n;

export default i18n;
