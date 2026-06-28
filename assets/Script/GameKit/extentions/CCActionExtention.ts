import { Node, Size, Sprite, TweenAction, UITransform } from 'cc';
import { cce } from '../../LegacyGlobals';

type SizeLike = Size | { x?: number; y?: number; width?: number; height?: number } | number;
type UpdateCallback = (delta: number, ratio: number) => void;

function toFiniteNumber(value: unknown, fallback = 0) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : fallback;
}

function readSize(sizeOrWidth: SizeLike, height?: number) {
    if (typeof sizeOrWidth === 'number') {
        return new Size(sizeOrWidth, height != null ? height : sizeOrWidth);
    }

    const source = sizeOrWidth || {};
    const width = 'width' in source ? source.width : source.x;
    const resolvedHeight = 'height' in source ? source.height : source.y;
    return new Size(toFiniteNumber(width), toFiniteNumber(resolvedHeight));
}

function getUITransform(target: unknown) {
    return target instanceof Node ? target.getComponent(UITransform) : null;
}

class CceTweenAction extends TweenAction<object> {
    private readonly cloneFactory: () => TweenAction<any>;
    private readonly reverseFactory: () => TweenAction<any>;

    constructor(duration: number, onUpdate: (target: unknown, ratio: number) => void, cloneFactory: () => TweenAction<any>, reverseFactory: () => TweenAction<any>) {
        super(toFiniteNumber(duration), {}, {
            onUpdate(target?: object, ratio?: number) {
                onUpdate(target, toFiniteNumber(ratio));
            },
        });

        this.cloneFactory = cloneFactory;
        this.reverseFactory = reverseFactory;
    }

    clone() {
        return this.cloneFactory();
    }

    reverse() {
        return this.reverseFactory();
    }
}

function createAction(duration: number, onUpdate: (target: unknown, ratio: number) => void, clone: () => TweenAction<any>, reverse: () => TweenAction<any>) {
    return new CceTweenAction(duration, onUpdate, clone, reverse);
}

export function sizeBy(duration: number, deltaSizeOrWidth: SizeLike, deltaHeight?: number) {
    const delta = readSize(deltaSizeOrWidth, deltaHeight);
    let startWidth: number | null = null;
    let startHeight: number | null = null;

    return createAction(
        duration,
        (target, ratio) => {
            const transform = getUITransform(target);
            if (!transform) return;

            if (startWidth == null || startHeight == null) {
                startWidth = transform.width;
                startHeight = transform.height;
            }

            transform.setContentSize(startWidth + delta.width * ratio, startHeight + delta.height * ratio);
        },
        () => sizeBy(duration, delta),
        () => sizeBy(duration, new Size(-delta.width, -delta.height)),
    );
}

export function sizeTo(duration: number, sizeOrWidth: SizeLike, height?: number) {
    const end = readSize(sizeOrWidth, height);
    let startWidth: number | null = null;
    let startHeight: number | null = null;

    return createAction(
        duration,
        (target, ratio) => {
            const transform = getUITransform(target);
            if (!transform) return;

            if (startWidth == null || startHeight == null) {
                startWidth = transform.width;
                startHeight = transform.height;
            }

            transform.setContentSize(
                startWidth + (end.width - startWidth) * ratio,
                startHeight + (end.height - startHeight) * ratio,
            );
        },
        () => sizeTo(duration, end),
        () => sizeTo(duration, new Size(startWidth != null ? startWidth : end.width, startHeight != null ? startHeight : end.height)),
    );
}

export function fillTo(duration: number, fillRange: number) {
    const targetFillRange = toFiniteNumber(fillRange);
    let startFillRange: number | null = null;

    return createAction(
        duration,
        (target, ratio) => {
            const sprite = target instanceof Node ? target.getComponent(Sprite) : null;
            if (!sprite) return;

            if (startFillRange == null) {
                startFillRange = sprite.fillRange;
            }

            sprite.fillRange = startFillRange + (targetFillRange - startFillRange) * ratio;
        },
        () => fillTo(duration, targetFillRange),
        () => fillTo(duration, startFillRange != null ? startFillRange : targetFillRange),
    );
}

export function fillIn(duration: number) {
    return fillTo(duration, 1);
}

export function fillOut(duration: number) {
    return fillTo(duration, 0);
}

export function updateValue(duration: number, callback: UpdateCallback) {
    let previousRatio = 0;

    return createAction(
        duration,
        (_target, ratio) => {
            if (callback) {
                callback(ratio - previousRatio, ratio);
            }
            previousRatio = ratio;
        },
        () => updateValue(duration, callback),
        () => updateValue(duration, callback),
    );
}

cce.sizeBy = sizeBy;
cce.sizeTo = sizeTo;
cce.fillTo = fillTo;
cce.fillIn = fillIn;
cce.fillOut = fillOut;
cce.updateValue = updateValue;

export default {
    sizeBy,
    sizeTo,
    fillTo,
    fillIn,
    fillOut,
    updateValue,
};
