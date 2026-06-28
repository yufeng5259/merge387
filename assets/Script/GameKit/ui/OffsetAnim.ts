import { _decorator, Button, Component, EventTouch, Node } from 'cc';

const { ccclass, property } = _decorator;

interface OffsetButtonNode extends Node {
    offsetAnim?: OffsetAnim;
}

@ccclass('OffsetAnim')
export class OffsetAnim extends Component {
    @property
    public offsetX = 0;

    @property
    public offsetY = 0;

    @property(Button)
    public button: Button | null = null;

    private oldY = 0;
    private oldX = 0;

    public onLoad(): void {
        const buttonNode = this.buttonNode;
        if (buttonNode) {
            buttonNode.offsetAnim = this;
        }

        this.oldY = this.node.position.y;
        this.oldX = this.node.position.x;
    }

    public onEnable(): void {
        const buttonNode = this.buttonNode;
        if (!buttonNode) {
            return;
        }

        buttonNode.on(Node.EventType.TOUCH_START, this.onButtonPress, this);
        buttonNode.on(Node.EventType.TOUCH_END, this.onButtonRelease, this);
        buttonNode.on(Node.EventType.TOUCH_CANCEL, this.onButtonRelease, this);
    }

    public onDisable(): void {
        const buttonNode = this.buttonNode;
        if (buttonNode) {
            buttonNode.off(Node.EventType.TOUCH_START, this.onButtonPress, this);
            buttonNode.off(Node.EventType.TOUCH_END, this.onButtonRelease, this);
            buttonNode.off(Node.EventType.TOUCH_CANCEL, this.onButtonRelease, this);
        }

        this.restorePosition();
    }

    public start(): void {
    }

    public onButtonPress(_event: EventTouch): void {
        this.node.setPosition(this.oldX + this.offsetX, this.oldY + this.offsetY, this.node.position.z);
    }

    public onButtonRelease(event: EventTouch): void {
        if (!event.simulate) {
            this.restorePosition();
        }
    }

    private get buttonNode(): OffsetButtonNode | null {
        return this.button ? this.button.node as OffsetButtonNode : null;
    }

    private restorePosition(): void {
        this.node.setPosition(this.oldX, this.oldY, this.node.position.z);
    }
}

export default OffsetAnim;
