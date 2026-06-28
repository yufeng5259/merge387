import { _decorator, Component, Node, Tween, tween, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpinAnim')
export class SpinAnim extends Component {
    @property(Node)
    public light: Node | null = null;
    @property(Node)
    public spin: Node | null = null;

    start () {
    }

    play (posX: number, posY: number, waitTime: number, cb?: () => void) {
        this.prepareAnim();
        this.node.setPosition(0, 0, 0);
        this.node.setScale(1, 1, 1);
        this.playMoveTo(new Vec3(posX, posY, 0), waitTime, cb);
    }

    playToTarget (globalFromPos: Vec3, globalToPos: Vec3, waitTime: number, cb?: () => void) {
        this.prepareAnim();
        const fromPos = this.convertParentWorldToLocal(globalFromPos);
        const toPos = this.convertParentWorldToLocal(globalToPos);
        this.node.setPosition(fromPos);
        this.node.setScale(1, 1, 1);
        this.playMoveTo(new Vec3(toPos.x - fromPos.x, toPos.y - fromPos.y, toPos.z - fromPos.z), waitTime, cb);
    }

    stop () {
        this.stopNodeTween(this.light);
        this.stopNodeTween(this.spin);
        this.stopNodeTween(this.node);
        this.node.active = false;
    }

    private prepareAnim () {
        this.node.active = true;
        this.scaleIn(this.light, 0.2);
        this.scaleIn(this.spin, 0);
    }

    private playMoveTo (delta: Vec3, waitTime: number, cb?: () => void) {
        const startPos = this.node.position.clone();
        const targetPos = new Vec3(startPos.x + delta.x, startPos.y + delta.y, startPos.z + delta.z);
        tween(this.node)
            .delay(waitTime)
            .to(1.2, { position: targetPos, scale: new Vec3(0.1, 0.1, 1) }, { easing: 'backIn' })
            .call(() => {
                if (cb) {
                    cb();
                }
                this.node.active = false;
                if (GameKit && GameKit.SoundManager) {
                    GameKit.SoundManager.playSound('spins_bar');
                }
            })
            .start();
    }

    private scaleIn (node: Node | null, startScale: number) {
        if (!node) return;
        this.stopNodeTween(node);
        node.setScale(startScale, startScale, 1);
        tween(node)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }

    private convertParentWorldToLocal (worldPos: Vec3) {
        const parent = this.node.parent;
        const transform = parent ? parent.getComponent(UITransform) : null;
        return transform ? transform.convertToNodeSpaceAR(worldPos) : worldPos;
    }

    private stopNodeTween (node: Node | null) {
        if (!node) return;
        Tween.stopAllByTarget(node);
    }
}

export default SpinAnim;
