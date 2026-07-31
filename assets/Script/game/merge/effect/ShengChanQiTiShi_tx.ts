import { _decorator, Component, instantiate, isValid, Node, NodePool, sp, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

interface EffectOptions { parent?: Node; position?: Readonly<Node['position']>; }

@ccclass('ShengChanQiTiShiTx')
export class ShengChanQiTiShiTx extends Component {
    @property(sp.Skeleton) public shengChanQiTiShi_tx: sp.Skeleton | null = null;
    private skeletonPool = new NodePool();

    onLoad () {
        this.skeletonPool = new NodePool();
        this.node.active = false;
        if (this.shengChanQiTiShi_tx) this.shengChanQiTiShi_tx.node.active = false;
    }

    start () {
    }

    PlayEnter (options: EffectOptions = {}) {
        if (!this.shengChanQiTiShi_tx) return;
        this.node.active = true;
        const effectNode = this.skeletonPool.get() || instantiate(this.shengChanQiTiShi_tx.node);
        effectNode.parent = options.parent || this.shengChanQiTiShi_tx.node.parent;
        effectNode.setPosition(options.position || this.shengChanQiTiShi_tx.node.position);
        effectNode.setScale(this.shengChanQiTiShi_tx.node.scale);
        effectNode.setRotation(this.shengChanQiTiShi_tx.node.rotation);
        const opacity = effectNode.getComponent(UIOpacity) || effectNode.addComponent(UIOpacity);
        opacity.opacity = 255;
        effectNode.active = true;
        const skeleton = effectNode.getComponent(sp.Skeleton);
        if (!skeleton) { effectNode.destroy(); return; }
        skeleton.setCompleteListener(() => {
            if (!isValid(effectNode)) return;
            effectNode.active = false;
            skeleton.setCompleteListener(null);
            this.skeletonPool.put(effectNode);
        });
        skeleton.setAnimation(0, 'ShengChanQiTiShi_tx', false);
    }
}

export default ShengChanQiTiShiTx;
