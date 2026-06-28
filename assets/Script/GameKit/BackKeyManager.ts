import { input, Input, EventKeyboard, KeyCode } from 'cc';

type BackKeyCallback = (() => void) | undefined;

export default class BackKeyManager {
    static callbacks: BackKeyCallback[] = [];
    private static initialized = false;

    static init() {
        if (BackKeyManager.initialized) return;
        BackKeyManager.initialized = true;
        input.on(Input.EventType.KEY_UP, BackKeyManager.onKeyUp, BackKeyManager);
    }

    static Clear() {
        BackKeyManager.callbacks = [];
    }

    static registerBackEvent(callback?: () => void) {
        BackKeyManager.callbacks.push(callback);
    }

    static unregisterBackEvent() {
        if (BackKeyManager.callbacks.length <= 0) return;
        BackKeyManager.callbacks.pop();
    }

    static callEvnet() {
        if (BackKeyManager.callbacks.length <= 0) return;
        const call = BackKeyManager.callbacks[BackKeyManager.callbacks.length - 1];
        if (call) call();
    }

    private static onKeyUp(e: EventKeyboard) {
        if (e.keyCode == KeyCode.MOBILE_BACK || e.keyCode == KeyCode.ESCAPE) {
            BackKeyManager.callEvnet();
        }
    }
}
