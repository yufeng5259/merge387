import { _decorator, Button, Component, EventTouch, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HelpButton')
export class HelpButton extends Component {
    @property
    public titleKey = '';

    @property
    public helpKey = '';

    public onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(_event: EventTouch): void {
        const button = this.node.getComponent(Button);
        if (button && !button.interactable) {
            return;
        }

        Game.HelpWindow.Show(GameKit.i18n.t(this.titleKey), this.helpKey);
    }
}

export default HelpButton;
