import { Enum, easing } from 'cc';
import type { TweenEasing } from 'cc';

const DEFAULT_RATE = 2;
const DEFAULT_ELASTIC_PERIOD = 0.3;
const DEFAULT_BACK_OVERSHOOT = 1.70158;
const TWO_PI = Math.PI * 2;

export enum CCEaseType {
    linear = 0,
    easeIn = 1,
    easeOut = 2,
    easeInOut = 3,
    easeExponentialIn = 4,
    easeExponentialOut = 5,
    easeExponentialInOut = 6,
    easeSineIn = 7,
    easeSineOut = 8,
    easeSineInOut = 9,
    easeElasticIn = 10,
    easeElasticOut = 11,
    easeElasticInOut = 12,
    easeBounceIn = 13,
    easeBounceOut = 14,
    easeBounceInOut = 15,
    easeBackIn = 16,
    easeBackOut = 17,
    easeBackInOut = 18,
    easeQuadraticActionIn = 19,
    easeQuadraticActionOut = 20,
    easeQuadraticActionInOut = 21,
    easeQuarticActionIn = 22,
    easeQuarticActionOut = 23,
    easeQuarticActionInOut = 24,
    easeQuinticActionIn = 25,
    easeQuinticActionOut = 26,
    easeQuinticActionInOut = 27,
    easeCircleActionIn = 28,
    easeCircleActionOut = 29,
    easeCircleActionInOut = 30,
    easeCubicActionIn = 31,
    easeCubicActionOut = 32,
    easeCubicActionInOut = 33,
    easeBezierAction = 34,
}

Enum(CCEaseType);

export type CCEasing = TweenEasing | ((k: number) => number);

function toNumber(value: unknown, fallback: number) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toPositiveNumber(value: unknown, fallback: number) {
    const parsed = toNumber(value, fallback);
    return parsed > 0 ? parsed : fallback;
}

function powerIn(rate = DEFAULT_RATE) {
    return (k: number) => Math.pow(k, rate);
}

function powerOut(rate = DEFAULT_RATE) {
    return (k: number) => Math.pow(k, 1 / rate);
}

function powerInOut(rate = DEFAULT_RATE) {
    return (k: number) => {
        const doubled = k * 2;
        if (doubled < 1) {
            return 0.5 * Math.pow(doubled, rate);
        }

        return 1 - 0.5 * Math.pow(2 - doubled, rate);
    };
}

function elasticIn(period = DEFAULT_ELASTIC_PERIOD) {
    return (k: number) => {
        if (k === 0 || k === 1) return k;
        const shifted = k - 1;
        return -Math.pow(2, 10 * shifted) * Math.sin((shifted - period / 4) * TWO_PI / period);
    };
}

function elasticOut(period = DEFAULT_ELASTIC_PERIOD) {
    return (k: number) => {
        if (k === 0 || k === 1) return k;
        return Math.pow(2, -10 * k) * Math.sin((k - period / 4) * TWO_PI / period) + 1;
    };
}

function elasticInOut(period = DEFAULT_ELASTIC_PERIOD) {
    return (k: number) => {
        if (k === 0 || k === 1) return k;

        let doubled = k * 2;
        const offset = period / 4;
        doubled -= 1;

        if (doubled < 0) {
            return -0.5 * Math.pow(2, 10 * doubled) * Math.sin((doubled - offset) * TWO_PI / period);
        }

        return Math.pow(2, -10 * doubled) * Math.sin((doubled - offset) * TWO_PI / period) * 0.5 + 1;
    };
}

function backIn(overshoot = DEFAULT_BACK_OVERSHOOT) {
    return (k: number) => k * k * ((overshoot + 1) * k - overshoot);
}

function backOut(overshoot = DEFAULT_BACK_OVERSHOOT) {
    return (k: number) => {
        if (k === 0) return 0;
        const shifted = k - 1;
        return shifted * shifted * ((overshoot + 1) * shifted + overshoot) + 1;
    };
}

function backInOut(overshoot = DEFAULT_BACK_OVERSHOOT) {
    const scaled = overshoot * 1.525;
    return (k: number) => {
        let doubled = k * 2;
        if (doubled < 1) {
            return doubled * doubled * ((scaled + 1) * doubled - scaled) / 2;
        }

        doubled -= 2;
        return doubled * doubled * ((scaled + 1) * doubled + scaled) / 2 + 1;
    };
}

function bezierValue(p0: number, p1: number, p2: number, p3: number) {
    return (k: number) => {
        const inverse = 1 - k;
        return inverse * inverse * inverse * p0
            + 3 * k * inverse * inverse * p1
            + 3 * k * k * inverse * p2
            + k * k * k * p3;
    };
}

export function linear(): (k: number) => number;
export function linear(k: number): number;
export function linear(k?: number) {
    if (k === undefined) return easing.linear;
    return easing.linear(k);
}

function getNamedEasing(name: string): CCEasing {
    const key = name.split('.').pop() || name;
    return namedEasing[key] || easing.linear;
}

export function GetEasing(type: CCEaseType | string, ...args: unknown[]): CCEasing {
    if (typeof type === 'string') {
        return getNamedEasing(type);
    }

    switch (type) {
        case CCEaseType.easeIn:
            return powerIn(toPositiveNumber(args[0], DEFAULT_RATE));
        case CCEaseType.easeOut:
            return powerOut(toPositiveNumber(args[0], DEFAULT_RATE));
        case CCEaseType.easeInOut:
            return powerInOut(toPositiveNumber(args[0], DEFAULT_RATE));
        case CCEaseType.easeExponentialIn:
            return easing.expoIn;
        case CCEaseType.easeExponentialOut:
            return easing.expoOut;
        case CCEaseType.easeExponentialInOut:
            return easing.expoInOut;
        case CCEaseType.easeSineIn:
            return easing.sineIn;
        case CCEaseType.easeSineOut:
            return easing.sineOut;
        case CCEaseType.easeSineInOut:
            return easing.sineInOut;
        case CCEaseType.easeElasticIn:
            return elasticIn(toPositiveNumber(args[0], DEFAULT_ELASTIC_PERIOD));
        case CCEaseType.easeElasticOut:
            return elasticOut(toPositiveNumber(args[0], DEFAULT_ELASTIC_PERIOD));
        case CCEaseType.easeElasticInOut:
            return elasticInOut(toPositiveNumber(args[0], DEFAULT_ELASTIC_PERIOD));
        case CCEaseType.easeBounceIn:
            return easing.bounceIn;
        case CCEaseType.easeBounceOut:
            return easing.bounceOut;
        case CCEaseType.easeBounceInOut:
            return easing.bounceInOut;
        case CCEaseType.easeBackIn:
            return backIn(toPositiveNumber(args[0], DEFAULT_BACK_OVERSHOOT));
        case CCEaseType.easeBackOut:
            return backOut(toPositiveNumber(args[0], DEFAULT_BACK_OVERSHOOT));
        case CCEaseType.easeBackInOut:
            return backInOut(toPositiveNumber(args[0], DEFAULT_BACK_OVERSHOOT));
        case CCEaseType.easeQuadraticActionIn:
            return easing.quadIn;
        case CCEaseType.easeQuadraticActionOut:
            return easing.quadOut;
        case CCEaseType.easeQuadraticActionInOut:
            return easing.quadInOut;
        case CCEaseType.easeQuarticActionIn:
            return easing.quartIn;
        case CCEaseType.easeQuarticActionOut:
            return easing.quartOut;
        case CCEaseType.easeQuarticActionInOut:
            return easing.quartInOut;
        case CCEaseType.easeQuinticActionIn:
            return easing.quintIn;
        case CCEaseType.easeQuinticActionOut:
            return easing.quintOut;
        case CCEaseType.easeQuinticActionInOut:
            return easing.quintInOut;
        case CCEaseType.easeCircleActionIn:
            return easing.circIn;
        case CCEaseType.easeCircleActionOut:
            return easing.circOut;
        case CCEaseType.easeCircleActionInOut:
            return easing.circInOut;
        case CCEaseType.easeCubicActionIn:
            return easing.cubicIn;
        case CCEaseType.easeCubicActionOut:
            return easing.cubicOut;
        case CCEaseType.easeCubicActionInOut:
            return easing.cubicInOut;
        case CCEaseType.easeBezierAction: {
            const offset = args.length >= 5 ? 1 : 0;
            return bezierValue(
                toNumber(args[offset], 0),
                toNumber(args[offset + 1], 0),
                toNumber(args[offset + 2], 1),
                toNumber(args[offset + 3], 1),
            );
        }
        default:
            return easing.linear;
    }
}

const namedEasing: Record<string, CCEasing> = {
    linear: easing.linear,
    easeIn: powerIn(),
    easeOut: powerOut(),
    easeInOut: powerInOut(),
    easeExponentialIn: easing.expoIn,
    easeExponentialOut: easing.expoOut,
    easeExponentialInOut: easing.expoInOut,
    easeSineIn: easing.sineIn,
    easeSineOut: easing.sineOut,
    easeSineInOut: easing.sineInOut,
    easeElasticIn: elasticIn(),
    easeElasticOut: elasticOut(),
    easeElasticInOut: elasticInOut(),
    easeBounceIn: easing.bounceIn,
    easeBounceOut: easing.bounceOut,
    easeBounceInOut: easing.bounceInOut,
    easeBackIn: backIn(),
    easeBackOut: backOut(),
    easeBackInOut: backInOut(),
    easeQuadraticActionIn: easing.quadIn,
    easeQuadraticActionOut: easing.quadOut,
    easeQuadraticActionInOut: easing.quadInOut,
    easeQuarticActionIn: easing.quartIn,
    easeQuarticActionOut: easing.quartOut,
    easeQuarticActionInOut: easing.quartInOut,
    easeQuinticActionIn: easing.quintIn,
    easeQuinticActionOut: easing.quintOut,
    easeQuinticActionInOut: easing.quintInOut,
    easeCircleActionIn: easing.circIn,
    easeCircleActionOut: easing.circOut,
    easeCircleActionInOut: easing.circInOut,
    easeCubicActionIn: easing.cubicIn,
    easeCubicActionOut: easing.cubicOut,
    easeCubicActionInOut: easing.cubicInOut,
};

export const CCEaseTypes = {
    Types: CCEaseType,
    GetEasing,
};

cce.CCEaseTypes = CCEaseTypes;
cce.linear = linear;

export default CCEaseTypes;
