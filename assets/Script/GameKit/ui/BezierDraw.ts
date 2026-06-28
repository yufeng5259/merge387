import { _decorator, Component, instantiate, Node, Vec2 } from 'cc';
import FuncTools from '../FuncTools';

const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('BezierDraw')
@executeInEditMode
export default class BezierDraw extends Component {
    @property({ tooltip: 'start point' })
    public p_start = Vec2.ZERO.clone();

    @property({ tooltip: 'end point' })
    public p_end = new Vec2(1, 0);

    @property({ tooltip: 'control point near start' })
    public p_start_control = new Vec2(0, 1);

    @property({ tooltip: 'control point near end' })
    public p_end_control = new Vec2(1, 1);

    @property({ type: Node, tooltip: 'fill sprite node template' })
    public sf_node: Node | null = null;

    @property({ tooltip: 'fill item count' })
    public fill_number = 8;

    @property({ tooltip: 'set true once to refresh generated items' })
    public UPDATE = false;

    public item_array: Node[] = [];

    update(): void {
        if (!this.UPDATE) {
            return;
        }

        this.UPDATE = false;
        this.create_all_item();
        this.change_all_item_rotation();
    }

    create_all_item(): void {
        this.node.destroyAllChildren();
        this.item_array = [];

        if (!this.sf_node || this.fill_number <= 0) {
            return;
        }

        const denominator = Math.max(1, this.fill_number - 1);
        for (let i = 0; i < this.fill_number; i++) {
            const node = instantiate(this.sf_node);
            node.active = true;
            node.parent = this.node;

            const position = this.B(i / denominator, this.p_start, this.p_start_control, this.p_end_control, this.p_end);
            node.setPosition(position.x, position.y);
            this.item_array.push(node);
        }
    }

    change_all_item_rotation(): void {
        for (let i = 0; i < this.item_array.length; i++) {
            const current = this.item_array[i];
            const neighbor = i === 0 ? this.item_array[i + 1] : this.item_array[i - 1];
            if (!current || !neighbor) {
                continue;
            }

            const currentPosition = current.position;
            const neighborPosition = neighbor.position;
            const dx = currentPosition.x - neighborPosition.x;
            const dy = currentPosition.y - neighborPosition.y;
            current.angle = FuncTools.Vector2ToAngle(dx, dy) + 90;
        }
    }

    B(t: number, p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): Vec2 {
        const oneMinusT = 1 - t;
        const px = p0.x * Math.pow(oneMinusT, 3)
            + 3 * p1.x * t * Math.pow(oneMinusT, 2)
            + 3 * p2.x * Math.pow(t, 2) * oneMinusT
            + p3.x * Math.pow(t, 3);
        const py = p0.y * Math.pow(oneMinusT, 3)
            + 3 * p1.y * t * Math.pow(oneMinusT, 2)
            + 3 * p2.y * Math.pow(t, 2) * oneMinusT
            + p3.y * Math.pow(t, 3);

        return new Vec2(px, py);
    }
}
