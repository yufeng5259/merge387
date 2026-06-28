import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShieldAnim')
export class ShieldAnim extends Component {
    @property(Node)
    public light: Node | null = null;
    @property(Node)
    public shield: Node | null = null;

    start () {
    }

    play (posX: number, posY: number, waitTime: number, cb?: () => void) {
        this.node.active = true;
        this.node.setPosition(0, 0, 0);
        this.node.setScale(1, 1, 1);

        this.scaleIn(this.light);
        this.scaleIn(this.shield);

        const startPos = this.node.position.clone();
        const targetPos = new Vec3(startPos.x + posX, startPos.y + posY, startPos.z);
        tween(this.node)
            .delay(waitTime)
            .to(1, { position: targetPos, scale: new Vec3(0.1, 0.1, 1) }, { easing: 'backIn' })
            .call(() => {
                if (cb) {
                    cb();
                }
                this.node.active = false;
            })
            .start();
    }

    stop () {
        this.stopNodeTween(this.light);
        this.stopNodeTween(this.shield);
        this.stopNodeTween(this.node);
        this.node.active = false;
    }

    private scaleIn (node: Node | null) {
        if (!node) return;
        this.stopNodeTween(node);
        node.setScale(0, 0, 1);
        tween(node)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }

    private stopNodeTween (node: Node | null) {
        if (!node) return;
        Tween.stopAllByTarget(node);
    }
}

export default ShieldAnim;
