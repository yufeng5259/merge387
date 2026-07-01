import { EventTouch, Node, UITransform } from 'cc';

type TouchPoint = { x: number, y: number };

type GuardedClickOptions = {
    moveThreshold?: number;
    stopPropagation?: boolean;
    useCapture?: boolean;
    passBoundTarget?: boolean;
    shouldStart?: (event: EventTouch, node: Node) => boolean;
    shouldEnd?: (event: EventTouch, node: Node) => boolean;
};

type GuardedClickRecord = {
    owner: any;
    onStart: (event: EventTouch) => void;
    onEnd: (event: EventTouch) => void;
    onCancel: (event: EventTouch) => void;
    useCapture: boolean;
};

const GUARDED_CLICK_RECORDS = '__guardedClickRecords';

function getRecords(node: Node): GuardedClickRecord[] {
    const data = node as any;
    if (!data[GUARDED_CLICK_RECORDS]) {
        data[GUARDED_CLICK_RECORDS] = [];
    }
    return data[GUARDED_CLICK_RECORDS];
}

export function getTouchLocation(event?: any): TouchPoint | null {
    const pos = event?.getUILocation ? event.getUILocation() : event?.getLocation?.();
    if (!pos) {
        return null;
    }
    return { x: pos.x, y: pos.y };
}

export function isTouchInNode(event: any, node: Node | null | undefined): boolean {
    const pos = getTouchLocation(event);
    const transform = node?.getComponent(UITransform);
    if (!pos || !transform) {
        return false;
    }
    const rect = transform.getBoundingBoxToWorld();
    return pos.x >= rect.x && pos.x <= rect.x + rect.width && pos.y >= rect.y && pos.y <= rect.y + rect.height;
}

export function isTouchMoved(startPos: TouchPoint, endPos: TouchPoint, threshold: number): boolean {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    return dx * dx + dy * dy > threshold * threshold;
}

export function unbindGuardedClick(node: Node | null | undefined, owner: any): void {
    if (!node) {
        return;
    }
    const records = getRecords(node);
    for (let i = records.length - 1; i >= 0; i--) {
        const record = records[i];
        if (record.owner !== owner) {
            continue;
        }
        node.off(Node.EventType.TOUCH_START, record.onStart, owner, record.useCapture);
        node.off(Node.EventType.TOUCH_END, record.onEnd, owner, record.useCapture);
        node.off(Node.EventType.TOUCH_CANCEL, record.onCancel, owner, record.useCapture);
        records.splice(i, 1);
    }
}

export function bindGuardedClick(
    node: Node | null | undefined,
    owner: any,
    callback: (event: EventTouch) => void,
    options: GuardedClickOptions = {},
): void {
    if (!node) {
        return;
    }

    // One guarded business click per node/owner. Rebinding list/render items replaces
    // the previous guarded click while leaving unrelated owners/listeners intact.
    unbindGuardedClick(node, owner);

    const moveThreshold = options.moveThreshold ?? 20;
    const stopPropagation = options.stopPropagation === true;
    const useCapture = options.useCapture === true;
    let startPos: TouchPoint | null = null;
    let startedInside = false;

    const clear = () => {
        startPos = null;
        startedInside = false;
    };

    const onStart = (event: EventTouch) => {
        startPos = getTouchLocation(event);
        startedInside = !!startPos && isTouchInNode(event, node) && (options.shouldStart ? options.shouldStart(event, node) : true);
    };

    const onEnd = (event: EventTouch) => {
        const endPos = getTouchLocation(event);
        if (
            !startedInside ||
            !startPos ||
            !endPos ||
            !isTouchInNode(event, node) ||
            isTouchMoved(startPos, endPos, moveThreshold) ||
            (options.shouldEnd && !options.shouldEnd(event, node))
        ) {
            clear();
            return;
        }

        clear();
        if (stopPropagation) {
            (event as any).stopPropagation?.();
        }
        if (options.passBoundTarget) {
            (event as any).boundTarget = node;
        }
        callback.call(owner, event);
    };

    const onCancel = () => {
        clear();
    };

    node.on(Node.EventType.TOUCH_START, onStart, owner, useCapture);
    node.on(Node.EventType.TOUCH_END, onEnd, owner, useCapture);
    node.on(Node.EventType.TOUCH_CANCEL, onCancel, owner, useCapture);
    getRecords(node).push({ owner, onStart, onEnd, onCancel, useCapture });
}
