import { _decorator, isValid, Node, RichText, sp, UITransform, Vec2, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

type WeakGuideOptions = {
    resolveTargetNode?: () => Node | null;
    getTargetNode?: () => Node | null;
    pointerOffset?: Vec2;
    pointerRotation?: number;
    dialogText?: string;
    onTargetInvalid?: () => void;
};

@ccclass('WeakGuideWindow')
export default class WeakGuideWindow extends UIWindow {
    static windowPath = 'Other/WeakGuideWindow';

    @property(Node) arrow5: Node | null = null;
    @property(sp.Skeleton) arrow5Spine: sp.Skeleton | null = null;
    @property(Node) guide: Node | null = null;
    @property(Node) dialog: Node | null = null;
    @property(RichText) dialogLabel: RichText | null = null;

    private resolveTargetNode: (() => Node | null) | null = null;
    private pointerOffset = new Vec2();
    private pointerRotation = 0;
    private onTargetInvalid: (() => void) | null = null;
    private showingWeakGuide = false;

    onShow() { this.clearWeakGuide(); }
    onClose() { this.hideWeakGuide(); }
    update() { this._refreshPointer(false); }

    showWeakGuide(options: WeakGuideOptions = {}) {
        this.resolveTargetNode = options.resolveTargetNode || options.getTargetNode || null;
        this.pointerOffset.set(options.pointerOffset || Vec2.ZERO);
        this.pointerRotation = options.pointerRotation || 0;
        this.onTargetInvalid = typeof options.onTargetInvalid === 'function' ? options.onTargetInvalid : null;
        this.showingWeakGuide = true;
        this.setDialogText(options.dialogText || '');
        this._refreshPointer(true);
    }

    hideWeakGuide() {
        this.resolveTargetNode = null;
        this.pointerOffset.set(Vec2.ZERO);
        this.pointerRotation = 0;
        this.onTargetInvalid = null;
        this.showingWeakGuide = false;
        this._setHandVisible(false);
        if (this.guide) this.guide.active = false;
        if (this.dialog) this.dialog.active = false;
    }

    clearWeakGuide() { this.hideWeakGuide(); }
    isShowing() { return !!(this.showingWeakGuide && this.arrow5?.active); }

    setDialogText(text: unknown) {
        const visible = !!text;
        if (this.dialog) this.dialog.active = visible;
        if (this.guide) this.guide.active = visible;
        if (visible && this.dialogLabel) this.dialogLabel.string = String(text);
    }

    refreshPointer(forceRestart = false) { return this._refreshPointer(forceRestart); }

    private _refreshPointer(forceRestart: boolean) {
        if (!this.arrow5 || !this.resolveTargetNode) return false;
        const targetNode = this.resolveTargetNode();
        if (!this.isTargetValid(targetNode)) { this._handleTargetInvalid(); return false; }
        const worldPos = this.getTargetWorldCenter(targetNode!);
        const parentTransform = this.arrow5.parent?.getComponent(UITransform);
        if (!worldPos || !parentTransform) { this._handleTargetInvalid(); return false; }
        const localPos = parentTransform.convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y));
        this.arrow5.setPosition(localPos.x + this.pointerOffset.x, localPos.y + this.pointerOffset.y);
        this.arrow5.angle = this.pointerRotation;
        this._setHandVisible(true);
        if (forceRestart) this._restartHandSpine();
        return true;
    }

    private _setHandVisible(visible: boolean) {
        if (!this.arrow5) return;
        this.arrow5.active = visible;
    }

    private _restartHandSpine() {
        const skeleton = this.arrow5Spine || this.arrow5?.getComponentInChildren(sp.Skeleton) || null;
        if (!skeleton) return;
        skeleton.setToSetupPose();
        skeleton.setAnimation(0, (skeleton as any).defaultAnimation || 'idle', true);
    }

    private _handleTargetInvalid() {
        if (!this.showingWeakGuide) return;
        const callback = this.onTargetInvalid;
        this.hideWeakGuide();
        callback?.();
    }

    isTargetValid(node: Node | null) { return !!(node && isValid(node) && node.activeInHierarchy && node.parent); }

    getTargetWorldCenter(node: Node) {
        const transform = node.getComponent(UITransform);
        if (!transform) return null;
        const { width, height } = transform.contentSize;
        return transform.convertToWorldSpaceAR(new Vec3(
            (0.5 - transform.anchorX) * width,
            (0.5 - transform.anchorY) * height,
        ));
    }
}
