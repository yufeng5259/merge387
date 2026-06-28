import '../../LegacyGlobals';
import { Node, Sprite } from 'cc';
import { EDITOR } from 'cc/env';

type TimerId = ReturnType<typeof window.setTimeout>;
type TimerRegistry = Record<string, TimerId[]>;
type TimerType = 'timeouts' | 'intervals';
type TimerStateWindow = Window & {
    timeouts?: TimerRegistry;
    intervals?: TimerRegistry;
    osetTimeout?: typeof window.setTimeout;
    osetInterval?: typeof window.setInterval;
    oclearTimeout?: typeof window.clearTimeout;
    oclearInterval?: typeof window.clearInterval;
    clearAllTimeout: (namespace?: string) => void;
    clearAllInterval: (namespace?: string) => void;
};
type LegacyGlobal = {
    nullFunction: () => void;
    addFunction: (func?: () => void, func2?: () => void) => () => void;
};
type LegacySprite = Sprite & {
    _onTextureLoaded?: () => void;
};

const timerWindow = window as unknown as TimerStateWindow;
const legacyGlobal = global as LegacyGlobal;

function stringInsert(this: string, index: number, value: string): string {
    const text = String(this);
    return text.slice(0, index) + value + text.slice(index);
}

function stringPrototypeFormat(this: string, ...args: unknown[]): string {
    let result = String(this);
    if (args.length <= 0) {
        return result;
    }

    if (args.length === 1 && args[0] && typeof args[0] === 'object') {
        const values = args[0] as Record<string, unknown>;
        Object.keys(values).forEach((key) => {
            const value = values[key];
            if (value !== undefined) {
                result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
            }
        });
        return result;
    }

    args.forEach((value, index) => {
        if (value !== undefined) {
            result = result.replace(new RegExp(`\\{${index}\\}`, 'g'), String(value));
        }
    });
    return result;
}

function staticStringFormat(): null;
function staticStringFormat(format: string, ...args: unknown[]): string;
function staticStringFormat(format?: string, ...args: unknown[]): string | null {
    if (format == null) {
        return null;
    }

    let result = String(format);
    args.forEach((value, index) => {
        result = result.replace(new RegExp(`\\{${index}\\}`, 'gm'), String(value));
    });
    return result;
}

function stringContains(this: string, item: string): boolean {
    return String(this).indexOf(item) > -1;
}

String.prototype.insert = stringInsert;
String.prototype.format = stringPrototypeFormat;
String.format = staticStringFormat;

if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = stringContains;
}

Math.clamp = function (value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
};

Math.lerp = function (from: number, to: number, ratio: number): number {
    const clampedRatio = Math.clamp(ratio, 0, 1);
    return from + (to - from) * clampedRatio;
};

if (typeof Array.prototype.includes !== 'function') {
    Array.prototype.includes = function <T>(this: T[], item: T, fromIndex?: number): boolean {
        const start = fromIndex == null ? 0 : fromIndex;
        return this.indexOf(item, start) > -1;
    };
}

if (typeof Array.prototype.contains !== 'function') {
    Array.prototype.contains = function <T>(this: T[], item: T): boolean {
        return this.indexOf(item) > -1;
    };
}

if (typeof Array.prototype.removeAt !== 'function') {
    Array.prototype.removeAt = function <T>(this: T[], index: number): T[] {
        if (index > -1) {
            this.splice(index, 1);
        }
        return this;
    };
}

if (typeof Array.prototype.remove !== 'function') {
    Array.prototype.remove = function <T>(this: T[], item: T): T[] {
        const index = this.indexOf(item);
        if (index > -1) {
            this.removeAt(index);
        }
        return this;
    };
}

if (typeof Array.prototype.insert !== 'function') {
    Array.prototype.insert = function <T>(this: T[], index: number, item: T): T[] {
        this.splice(index, 0, item);
        return this;
    };
}

if (typeof Array.prototype.derangedArray !== 'function') {
    Array.prototype.derangedArray = function <T>(this: T[]): T[] {
        for (let i = this.length; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const x = this[i - 1];
            this[i - 1] = this[j];
            this[j] = x;
        }
        return this;
    };
}

if (typeof Array.prototype.indexesOf !== 'function') {
    Array.prototype.indexesOf = function <T>(this: T[], item: T): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.length; i++) {
            if (this[i] === item) {
                result.push(i);
            }
        }
        return result;
    };
}

if (!Object.prototype.hasOwnProperty.call(Node.prototype, 'node')) {
    Object.defineProperty(Node.prototype, 'node', {
        get(this: Node): Node {
            return this;
        },
        enumerable: false,
        configurable: true,
    });
}

const spritePrototype = Sprite.prototype as LegacySprite;
if (!spritePrototype._onTextureLoaded) {
    spritePrototype._onTextureLoaded = function (this: Sprite): void {
        if (this.spriteFrame) {
            const spriteFrame = this.spriteFrame;
            this.spriteFrame = null;
            this.spriteFrame = spriteFrame;
        }
    };
}

legacyGlobal.nullFunction = function (): void {};
legacyGlobal.addFunction = function (func?: () => void, func2?: () => void): () => void {
    return function (): void {
        if (typeof func === 'function') {
            func();
        }
        if (typeof func2 === 'function') {
            func2();
        }
    };
};

function isTimerRegistry(value: unknown): value is TimerRegistry {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function bindTimer<T extends (...args: any[]) => any>(func: T): T {
    return func.bind(timerWindow) as T;
}

function isLegacyTimerWrapper(func: unknown): boolean {
    if (typeof func !== 'function') {
        return false;
    }
    return Function.prototype.toString.call(func).includes('removeTimer');
}

function bindOriginalTimeout(func: unknown): typeof window.setTimeout {
    if (typeof func !== 'function' || isLegacyTimerWrapper(func)) {
        return function (): ReturnType<typeof window.setTimeout> {
            return 0 as ReturnType<typeof window.setTimeout>;
        };
    }
    return bindTimer(func as typeof window.setTimeout);
}

function bindOriginalInterval(func: unknown): typeof window.setInterval {
    if (typeof func !== 'function' || isLegacyTimerWrapper(func)) {
        return function (): ReturnType<typeof window.setInterval> {
            return 0 as ReturnType<typeof window.setInterval>;
        };
    }
    return bindTimer(func as typeof window.setInterval);
}

function bindOriginalClear(func: unknown): typeof window.clearTimeout {
    if (typeof func !== 'function' || isLegacyTimerWrapper(func)) {
        return function (): void {};
    }
    return bindTimer(func as typeof window.clearTimeout);
}

function ensureTimerState(): void {
    if (!isTimerRegistry(timerWindow.timeouts)) {
        timerWindow.timeouts = {};
    }
    if (!isTimerRegistry(timerWindow.intervals)) {
        timerWindow.intervals = {};
    }
    if (typeof timerWindow.osetTimeout !== 'function' || isLegacyTimerWrapper(timerWindow.osetTimeout)) {
        timerWindow.osetTimeout = bindOriginalTimeout(timerWindow.setTimeout);
    }
    if (typeof timerWindow.osetInterval !== 'function' || isLegacyTimerWrapper(timerWindow.osetInterval)) {
        timerWindow.osetInterval = bindOriginalInterval(timerWindow.setInterval);
    }
    if (typeof timerWindow.oclearTimeout !== 'function' || isLegacyTimerWrapper(timerWindow.oclearTimeout)) {
        timerWindow.oclearTimeout = bindOriginalClear(timerWindow.clearTimeout);
    }
    if (typeof timerWindow.oclearInterval !== 'function' || isLegacyTimerWrapper(timerWindow.oclearInterval)) {
        timerWindow.oclearInterval = bindOriginalClear(timerWindow.clearInterval);
    }
}

function restoreNativeTimers(): void {
    if (typeof timerWindow.osetTimeout === 'function' && !isLegacyTimerWrapper(timerWindow.osetTimeout)) {
        timerWindow.setTimeout = timerWindow.osetTimeout;
    }
    if (typeof timerWindow.osetInterval === 'function' && !isLegacyTimerWrapper(timerWindow.osetInterval)) {
        timerWindow.setInterval = timerWindow.osetInterval;
    }
    if (typeof timerWindow.oclearTimeout === 'function' && !isLegacyTimerWrapper(timerWindow.oclearTimeout)) {
        timerWindow.clearTimeout = timerWindow.oclearTimeout;
    }
    if (typeof timerWindow.oclearInterval === 'function' && !isLegacyTimerWrapper(timerWindow.oclearInterval)) {
        timerWindow.clearInterval = timerWindow.oclearInterval;
    }
}

function getRegistry(type: TimerType): TimerRegistry {
    ensureTimerState();
    return type === 'timeouts' ? timerWindow.timeouts! : timerWindow.intervals!;
}

function parseTimerArgs(type: TimerType, args: unknown[]): { namespace: string; args: unknown[] } {
    const firstArg = args[0];
    const namespace = typeof firstArg === 'function' ? 'no_ns' : String(firstArg);
    if (namespace !== 'no_ns') {
        args.splice(0, 1);
    }

    const registry = getRegistry(type);
    if (!registry[namespace]) {
        registry[namespace] = [];
    }

    return {
        namespace,
        args,
    };
}

function removeTimer(type: TimerType, timerId?: TimerId): void {
    const clearTimer = type === 'timeouts' ? timerWindow.oclearTimeout : timerWindow.oclearInterval;
    if (typeof clearTimer === 'function') {
        clearTimer(timerId);
    }
    if (timerId == null) {
        return;
    }

    const registry = getRegistry(type);
    Object.keys(registry).some((namespace) => {
        const timers = registry[namespace];
        const index = timers.indexOf(timerId);
        if (index < 0) {
            return false;
        }

        timers.splice(index, 1);
        if (timers.length === 0) {
            delete registry[namespace];
        }
        return true;
    });
}

function clearAllTimer(type: TimerType, namespace?: string): void {
    const registry = getRegistry(type);
    const timers = namespace ? [...(registry[namespace] || [])] : Object.keys(registry).reduce<TimerId[]>((result, key) => {
        result.push(...registry[key]);
        return result;
    }, []);

    timers.forEach((timerId) => removeTimer(type, timerId));
}

if (EDITOR) {
    ensureTimerState();
    restoreNativeTimers();
    timerWindow.clearAllTimeout = function (): void {};
    timerWindow.clearAllInterval = function (): void {};
} else {
    ensureTimerState();

    timerWindow.setTimeout = function (...rawArgs: Parameters<typeof window.setTimeout>): ReturnType<typeof window.setTimeout> {
        const parsed = parseTimerArgs('timeouts', [...rawArgs]);
        if (typeof timerWindow.osetTimeout !== 'function') {
            return 0 as ReturnType<typeof window.setTimeout>;
        }
        const timerId = timerWindow.osetTimeout(...(parsed.args as Parameters<typeof window.setTimeout>));
        timerWindow.timeouts![parsed.namespace].push(timerId);
        return timerId;
    } as typeof window.setTimeout;

    timerWindow.setInterval = function (...rawArgs: Parameters<typeof window.setInterval>): ReturnType<typeof window.setInterval> {
        const parsed = parseTimerArgs('intervals', [...rawArgs]);
        if (typeof timerWindow.osetInterval !== 'function') {
            return 0 as ReturnType<typeof window.setInterval>;
        }
        const timerId = timerWindow.osetInterval(...(parsed.args as Parameters<typeof window.setInterval>));
        timerWindow.intervals![parsed.namespace].push(timerId);
        return timerId;
    } as typeof window.setInterval;

    timerWindow.clearTimeout = function (...rawArgs: Parameters<typeof window.clearTimeout>): void {
        removeTimer('timeouts', rawArgs[0]);
    } as typeof window.clearTimeout;

    timerWindow.clearInterval = function (...rawArgs: Parameters<typeof window.clearInterval>): void {
        removeTimer('intervals', rawArgs[0]);
    } as typeof window.clearInterval;

    timerWindow.clearAllTimeout = function (namespace?: string): void {
        clearAllTimer('timeouts', namespace);
    };

    timerWindow.clearAllInterval = function (namespace?: string): void {
        clearAllTimer('intervals', namespace);
    };
}
