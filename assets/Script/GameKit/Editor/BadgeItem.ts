import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BadgeItem')
export class BadgeItem extends Component {
    @property(Label)
    public label: Label | null = null;

    public num = 0;

    onLoad() {
        this.num = 0;
    }

    SetNum(n: any) {
        if (this.label) {
            this.label.string = n.toString();
        }

        this.node.active = n > 0;
        this.num = n;
    }
}

export default BadgeItem;
