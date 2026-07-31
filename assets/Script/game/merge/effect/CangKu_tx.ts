import { _decorator, Component, instantiate, isValid, Node, NodePool, sp, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

interface EffectOptions { parent?: Node; position?: Readonly<Node['position']>; }

@ccclass('CangKuTx')
export class CangKuTx extends Component {
    @property(sp.Skeleton) public cangKu_tx: sp.Skeleton | null = null;
    private initialized = false;
    private putEntered = false;
    private putLeaving = false;
    private putAnimationVersion = 0;
    private skeletonPool = new NodePool();

    onLoad () { this._initOnce(); }

    start () {
    }

    private _initOnce () {
        if (this.initialized) return;
        this.initialized = true;
        this.skeletonPool = new NodePool();
    }

    PlayPutEnter () {
        this._initOnce();
        if (!this.cangKu_tx || (this.putEntered && !this.putLeaving)) return;
        this.putAnimationVersion++;
        this.putEntered = true;
        this.putLeaving = false;
        this.node.active = this.cangKu_tx.node.active = true;
        this.cangKu_tx.setCompleteListener(null);
        this.cangKu_tx.setAnimation(0, 'FangRuCangKu_chuxian', true);
    }

    PlayPutLeave () {
        this._initOnce();
        if (!this.cangKu_tx) return;
        this.putEntered = false;
        this.putLeaving = true;
        this.node.active = this.cangKu_tx.node.active = true;
        const version = ++this.putAnimationVersion;
        this.cangKu_tx.setCompleteListener(() => {
            if (version !== this.putAnimationVersion || !this.putLeaving) return;
            this.putLeaving = false;
            this.cangKu_tx!.node.active = false;
            this.node.active = false;
            this.cangKu_tx!.setCompleteListener(null);
        });
        this.cangKu_tx.setAnimation(0, 'FangRuCangKu_xiaoshi', false);
    }

    CancelPutPreview () {
        this._initOnce();
        if (!this.cangKu_tx) return;
        this.putAnimationVersion++;
        this.putEntered = this.putLeaving = false;
        this.cangKu_tx.setCompleteListener(null);
        this.cangKu_tx.clearTracks();
        this.cangKu_tx.node.active = this.node.active = false;
    }

    PlayTakeOut (options: EffectOptions = {}) {
        this._initOnce();
        if (!this.cangKu_tx) return;
        const effectNode = this.skeletonPool.get() || instantiate(this.cangKu_tx.node);
        effectNode.parent = options.parent || this.cangKu_tx.node.parent;
        effectNode.setPosition(options.position || this.cangKu_tx.node.position);
        effectNode.setScale(this.cangKu_tx.node.scale);
        effectNode.setRotation(this.cangKu_tx.node.rotation);
        this.setOpacity(effectNode, 255);
        effectNode.active = true;
        const skeleton = effectNode.getComponent(sp.Skeleton);
        if (!skeleton) { effectNode.destroy(); return; }
        skeleton.setCompleteListener(() => {
            if (!isValid(effectNode)) return;
            effectNode.active = false;
            skeleton.setCompleteListener(null);
            this.skeletonPool.put(effectNode);
        });
        skeleton.setAnimation(0, 'QuChuCangKu_xiaoshi', false);
    }

    private setOpacity (node: Node, opacity: number) {
        const component = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        component.opacity = opacity;
    }
}

export default CangKuTx;
