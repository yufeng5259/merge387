import { _decorator, Component, Node, UITransform, Widget, view } from 'cc';

const { ccclass, executionOrder } = _decorator;

interface UIRootLike {
    instance?: {
        node?: Node;
        winSize?: {
            height?: number;
        };
    } | null;
}

function getUIRoot(): UIRootLike | null {
    return typeof UIRoot !== 'undefined' ? UIRoot as UIRootLike : null;
}

function getNodeHeight(node: Node | null | undefined): number {
    return node?.getComponent(UITransform)?.height || 0;
}

@ccclass('LongScreenFit')
@executionOrder(100)
export class LongScreenFit extends Component {
    public over = false;

    public onLoad(): void {
        if (!this.enabled || this.over) return;

        const visibleSize = view.getVisibleSize();
        if (visibleSize.height / visibleSize.width > 1250 / 640) {
            const offset = this.getSize();
            const widget = this.getComponent(Widget);
            if (widget && widget.enabled) {
                widget.top += offset;
                widget.updateAlignment();
                widget.enabled = false;
            } else {
                const position = this.node.position;
                this.node.setPosition(position.x, position.y - visibleSize.width / 640 * offset, position.z);
            }
        }

        this.over = true;
    }

    public getSize(): number {
        const root = getUIRoot()?.instance;
        const rootHeight = getNodeHeight(root?.node);
        const winHeight = root?.winSize?.height || view.getVisibleSize().height;
        return Math.max(0, 44 - Math.max(0, (rootHeight - winHeight) / 2));
    }
}

export default LongScreenFit;
