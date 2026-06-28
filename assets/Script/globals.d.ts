declare const SR: any;
declare const Game: any;
declare const GameKit: any;
declare const G: any;
declare const Meta: any;
declare const AppKit: any;
declare const AppGame: any;
declare const GamePlay: any;
declare const UIRoot: any;
declare const DialogWindow: any;
declare const nullFunction: any;
declare const BigNumber: any;
declare var cce: any;
declare const addFunction: any;
declare const ChangeSceneManager: any;
declare const global: any;
declare const CommonAssets: any;
declare const CCTools: any;
declare const Logs: any;
declare const CardLimitSkinAssetsSetting: any;
declare const GameMainWindow: any;
declare const wxTools: any;
declare const wx: any;
declare const PassPortDesWindow: any;
declare const CardChestOpenWindow: any;
declare const LoadingWindow: any;
declare const AppMain: any;
declare const clearAllTimeout: any;
declare const clearAllInterval: any;

interface StringConstructor {
    format(): null;
    format(format: string, ...args: any[]): string;
}
interface String {
    insert(index: number, value: string): string;
    format(...args: any[]): string;
    contains(item: string): boolean;
}
interface Math {
    clamp(value: number, min: number, max: number): number;
    lerp(from: number, to: number, ratio: number): number;
}
interface Array<T> {
    includes(item: T, fromIndex?: number): boolean;
    contains(item: T): boolean;
    removeAt(index: number): this;
    remove(item: T): this;
    insert(index: number, item: T): this;
    derangedArray(): this;
    indexesOf(item: T): number[];
}
interface Window {
    cce: any;
    __errorHandler?: (url: any, line: any, msg: any, stack: any) => void;
    timeouts: Record<string, Array<ReturnType<typeof setTimeout>>>;
    intervals: Record<string, Array<ReturnType<typeof setInterval>>>;
    osetTimeout: typeof setTimeout;
    osetInterval: typeof setInterval;
    oclearTimeout: typeof clearTimeout;
    oclearInterval: typeof clearInterval;
    clearAllTimeout(namespace?: string): void;
    clearAllInterval(namespace?: string): void;
}
declare module 'cc' {
    interface Node {
        readonly node: Node;
    }
    interface Sprite {
        _onTextureLoaded?: () => void;
    }
    interface Label {
        updateRightLanguage?: () => void;
        ARABIC_Right?: boolean;
        RightLanguage?: boolean;
    }
    interface RichTextComponent {
        updateRightLanguage?: () => void;
        ARABIC_Right?: boolean;
        RightLanguage?: boolean;
    }
}
declare const fbInTools: any;
declare const CLOSE_Card: any;
declare const FBInstant: any;
declare const encryptCode: any;
declare const pako: any;
declare const Base64: any;
declare const ErrorCode: any;
declare const CC_DEV: any;
declare const MergeOrderLogic: any;
