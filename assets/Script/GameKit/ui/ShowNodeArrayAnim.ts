import { _decorator, Component, Enum, Node, Sprite } from 'cc';

const { ccclass, executeInEditMode, property } = _decorator;

const ShowNodeArrayAnimType = {
    INTERVAL_TIME: 0,
    ALL_TIME: 1,
};
Enum(ShowNodeArrayAnimType);

type ShowNodeArrayAnimTypeValue = typeof ShowNodeArrayAnimType[keyof typeof ShowNodeArrayAnimType];

const TOOLTIP = {
    PREVIEW: 'Preview once, then reset to false.',
    NODE_ARRAY: 'Nodes to show in order. If empty, all children are used.',
    TYPE: 'Interval-time mode or total-time mode.',
    TIME: 'Interval time or total duration, depending on mode.',
};

@ccclass('ShowNodeArrayAnim')
@executeInEditMode
export class ShowNodeArrayAnim extends Component {
    @property({ tooltip: TOOLTIP.PREVIEW })
    public preview = false;

    @property({ tooltip: TOOLTIP.NODE_ARRAY, type: [Node] })
    public node_array: Node[] = [];

    @property({ tooltip: TOOLTIP.TYPE, type: ShowNodeArrayAnimType })
    public type: ShowNodeArrayAnimTypeValue = ShowNodeArrayAnimType.ALL_TIME;

    @property({ tooltip: TOOLTIP.TIME })
    public time = 2;

    public update(_dt: number): void {
        if (!this.preview) return;

        this.preview = false;
        if (this.node_array.length === 0) this.node_array = Array.from(this.node.children);
    }

    public play_anim(): Promise<void> {
        return new Promise((resolve) => {
            if (this.node_array.length === 0) this.node_array = Array.from(this.node.children);
            if (this.node_array.length === 0) {
                resolve();
                return;
            }

            if (this.node_array[0].position.y > this.node_array[this.node_array.length - 1].position.y) {
                this.node_array.reverse();
            }

            for (const node of this.node_array) {
                node.active = false;
            }

            const interval = this.type === ShowNodeArrayAnimType.INTERVAL_TIME
                ? this.time
                : this.time / this.node_array.length;

            this.schedule(() => {
                const node = this.node_array.shift();
                if (node) node.active = true;

                if (this.node_array.length === 0) {
                    this.unscheduleAllCallbacks();
                    resolve();
                }
            }, interval);
        });
    }

    public hide(): void {
        this.node_array.forEach((node) => {
            const sprite = node.getComponent(Sprite);
            if (sprite) sprite.fillRange = 0;
        });
    }
}

export default ShowNodeArrayAnim;
