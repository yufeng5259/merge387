import { _decorator, Component, EventHandler, EventTouch, Node } from 'cc';
import { stopTouchPropagation } from './TouchClickGuard';

const { ccclass, property } = _decorator;

@ccclass('EventListenerEx')
export class EventListenerEx extends Component {
    @property([EventHandler])
    public clickEvents: EventHandler[] = [];

    @property([EventHandler])
    public pressEvents: EventHandler[] = [];

    @property
    public inScrollView = false;

    private _pressed = false;

    public onEnable(): void {
        this._registerEvent();
    }

    public _registerEvent(): void {
        this.node.on(Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    public _onTouchBegan(event: EventTouch): void {
        this._pressed = true;
        EventHandler.emitEvents(this.pressEvents, event, true);
        this.node.emit('press', this);
        this.stopPropagationIfNeeded(event);
    }

    public _onTouchMove(event: EventTouch): void {
        if (!this._pressed) {
            return;
        }

        this.stopPropagationIfNeeded(event);
    }

    public _onTouchEnded(event: EventTouch): void {
        if (this._pressed) {
            EventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
            EventHandler.emitEvents(this.pressEvents, event, false);
        }

        this._pressed = false;
        this.stopPropagationIfNeeded(event);
    }

    public _onTouchCancel(event: EventTouch): void {
        if (!event.simulate && this._pressed) {
            EventHandler.emitEvents(this.pressEvents, event, false);
        }

        this._pressed = false;
    }

    public onDisable(): void {
        this._pressed = false;
        this.node.off(Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    private stopPropagationIfNeeded(event: EventTouch): void {
        if (!this.inScrollView) {
            stopTouchPropagation(event);
        }
    }
}

export default EventListenerEx;
