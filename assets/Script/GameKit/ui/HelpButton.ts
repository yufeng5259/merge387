import { _decorator, Button, Component, EventTouch, Node } from 'cc';
import { bindGuardedClick, unbindGuardedClick } from './TouchClickGuard';

const { ccclass, property } = _decorator;

@ccclass('HelpButton')
export class HelpButton extends Component {
    @property
    public titleKey = '';

    @property
    public helpKey = '';

    public onEnable(): void {
        bindGuardedClick(this.node, this, this.onTouchEnd, {
            shouldEnd: () => {
                const button = this.node.getComponent(Button);
                return !button || button.interactable;
            },
        });
    }

    public onDisable(): void {
        unbindGuardedClick(this.node, this);
    }

    private onTouchEnd(_event: EventTouch): void {
        Game.HelpWindow.Show(GameKit.i18n.t(this.titleKey), this.helpKey);
    }
}

export default HelpButton;
