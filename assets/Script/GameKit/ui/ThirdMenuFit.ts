import { _decorator, Component, Widget } from 'cc';

const { ccclass, executionOrder, property } = _decorator;

@ccclass('ThirdMenuFit')
@executionOrder(101)
export class ThirdMenuFit extends Component {
    @property
    public distance = 80;

    private over = false;

    public onLoad(): void {
        if (!this.enabled || this.over) return;

        if (wxTools.usewx) {
            const widget = this.getComponent(Widget);
            if (widget && widget.enabled) {
                widget.updateAlignment();
                widget.enabled = false;
            }
            this.node.setPosition(this.node.position.x, this.node.position.y - this.distance, this.node.position.z);
        }

        this.over = true;
    }
}

export default ThirdMenuFit;
