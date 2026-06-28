type PhraseValue = string | PhraseMap;
export interface PhraseMap {
    [key: string]: PhraseValue;
}
type FlatPhraseMap = Record<string, string>;
type TranslateOptions = Record<string, string | number | boolean | null | undefined> | number;

const delimiter = '||||';
const pluralTypes: Record<string, (n: number) => number> = {
    chinese: () => 0,
    german: (n) => (n !== 1 ? 1 : 0),
    french: (n) => (n > 1 ? 1 : 0),
    russian: (n) => (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
    czech: (n) => (n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2),
    polish: (n) => (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
    icelandic: (n) => (n % 10 !== 1 || n % 100 === 11 ? 1 : 0),
};

const pluralTypeToLanguages: Record<string, string[]> = {
    chinese: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
    german: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
    french: ['fr', 'tl', 'pt-br'],
    russian: ['hr', 'ru'],
    czech: ['cs', 'sk'],
    polish: ['pl'],
    icelandic: ['is'],
};

export type PolyglotOptions = {
    phrases?: PhraseMap;
    locale?: string;
    allowMissing?: boolean;
    warn?: (message: string) => void;
};

export default class Polyglot {
    static VERSION = '1.0.0';

    phrases: FlatPhraseMap = {};
    currentLocale: string;
    allowMissing: boolean;
    warn: (message: string) => void;

    constructor(options: PolyglotOptions = {}) {
        this.currentLocale = options.locale || 'en';
        this.allowMissing = !!options.allowMissing;
        this.warn = options.warn || defaultWarn;
        this.extend(options.phrases || {});
    }

    locale(newLocale?: string): string {
        if (newLocale) {
            this.currentLocale = newLocale;
        }
        return this.currentLocale;
    }

    extend(morePhrases: PhraseMap, prefix?: string): void {
        Object.keys(morePhrases).forEach((key) => {
            const phrase = morePhrases[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (isPhraseMap(phrase)) {
                this.extend(phrase, fullKey);
            } else {
                this.phrases[fullKey] = phrase;
            }
        });
    }

    unset(morePhrases: string | PhraseMap, prefix?: string): void {
        if (typeof morePhrases === 'string') {
            delete this.phrases[morePhrases];
            return;
        }

        Object.keys(morePhrases).forEach((key) => {
            const phrase = morePhrases[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (isPhraseMap(phrase)) {
                this.unset(phrase, fullKey);
            } else {
                delete this.phrases[fullKey];
            }
        });
    }

    clear(): void {
        this.phrases = {};
    }

    replace(phrases: PhraseMap): void {
        this.clear();
        this.extend(phrases);
    }

    t(key: string, options?: TranslateOptions): string {
        const normalizedOptions = normalizeOptions(options);
        let phrase: string | undefined;

        if (typeof this.phrases[key] === 'string') {
            phrase = this.phrases[key];
        } else if (typeof normalizedOptions._ === 'string') {
            phrase = normalizedOptions._;
        } else if (this.allowMissing) {
            phrase = key;
        } else {
            this.warn(`Missing translation for key: "${key}"`);
            return key;
        }

        return interpolate(choosePluralForm(phrase, this.currentLocale, normalizedOptions.smart_count), normalizedOptions);
    }

    has(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.phrases, key);
    }
}

function isPhraseMap(value: PhraseValue): value is PhraseMap {
    return typeof value === 'object' && value !== null;
}

function normalizeOptions(options?: TranslateOptions): Record<string, string | number | boolean | null | undefined> {
    if (options == null) {
        return {};
    }
    if (typeof options === 'number') {
        return { smart_count: options };
    }
    return options;
}

function choosePluralForm(text: string, locale: string, count: string | number | boolean | null | undefined): string {
    if (count == null) {
        return text;
    }

    const numericCount = Number(count);
    if (!Number.isFinite(numericCount)) {
        return text;
    }

    const texts = text.split(delimiter);
    return (texts[pluralTypeIndex(locale, numericCount)] || texts[0]).trim();
}

function pluralTypeIndex(locale: string, count: number): number {
    const pluralType = pluralTypeName(locale);
    return pluralTypes[pluralType](count);
}

function pluralTypeName(locale: string): string {
    const map = langToPluralTypeMap();
    return map[locale] || map.en;
}

function langToPluralTypeMap(): Record<string, string> {
    const map: Record<string, string> = {};
    Object.keys(pluralTypeToLanguages).forEach((type) => {
        pluralTypeToLanguages[type].forEach((language) => {
            map[language] = type;
        });
    });
    return map;
}

function interpolate(phrase: string, options: Record<string, string | number | boolean | null | undefined>): string {
    let result = phrase;
    Object.keys(options).forEach((key) => {
        if (key === '_') {
            return;
        }
        const value = options[key];
        const replacement = value == null ? '' : String(value).replace(/\$/g, '$$$$');
        result = result.replace(new RegExp(`%\\{${escapeRegExp(key)}\\}`, 'g'), replacement);
    });
    return result;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function defaultWarn(message: string): void {
    console.warn(`WARNING: ${message}`);
}
