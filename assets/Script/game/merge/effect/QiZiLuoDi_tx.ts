import { _decorator, Component, instantiate, isValid, Node, NodePool, sp, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('QiZiLuoDiTx')
export class QiZiLuoDiTx extends Component {
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton | null = null;

    private _skeletonPool: NodePool = new NodePool();

    onLoad () {
        this._skeletonPool = new NodePool();
        this.node.active = false;
        if (this.skeleton) {
            this.skeleton.node.active = false;
        }
    }

    start () {
    }

    public PlayEnter (options?: any) {
        if (!this.skeleton) return;

        options = options || {};
        this.node.active = true;

        let effectNode = this._skeletonPool.get();
        if (!effectNode) {
            effectNode = instantiate(this.skeleton.node);
        }

        effectNode.parent = options.parent || this.skeleton.node.parent;
        effectNode.setPosition(options.position || this.skeleton.node.position);
        effectNode.setScale(this.skeleton.node.scale);
        effectNode.setRotation(this.skeleton.node.rotation);
        this.setOpacity(effectNode, 255);
        effectNode.active = true;

        if (options.siblingIndex !== undefined && effectNode.parent) {
            effectNode.setSiblingIndex(Math.max(0, options.siblingIndex));
        }

        const effectSkeleton = effectNode.getComponent(sp.Skeleton);
        if (!effectSkeleton) {
            effectNode.destroy();
            return;
        }

        effectSkeleton.setCompleteListener(() => {
            if (!isValid(effectNode)) return;
            effectNode.active = false;
            effectSkeleton.setCompleteListener(null);
            this._skeletonPool.put(effectNode);
        });
        effectSkeleton.setAnimation(0, 'QiZi_luodi_dh', false);
    }

    private setOpacity (node: Node, opacity: number) {
        let uiOpacity = node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = node.addComponent(UIOpacity);
        }
        uiOpacity.opacity = opacity;
    }
}

export default QiZiLuoDiTx;
