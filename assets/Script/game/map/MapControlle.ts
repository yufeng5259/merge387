import {
    _decorator,
    Camera,
    Component,
    find,
    instantiate,
    isValid,
    Label,
    Node,
    NodePool,
    sp,
    Tween,
    tween,
    UIOpacity,
    UITransform,
    Vec2,
    Vec3,
    view,
} from 'cc';
import { stopTouchPropagation } from '../../GameKit/ui/TouchClickGuard';
const { ccclass, property } = _decorator;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function getOrAddTransform(node: Node) {
    return node.getComponent(UITransform) || node.addComponent(UITransform);
}

function getOrAddOpacity(node: Node) {
    return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

@ccclass('MapControlle')
export class MapControlle extends Component {
    @property
    public fingerIncreaseRate = 1;
    @property(Node)
    public mapPieceNode: Node | null = null;
    @property(Label)
    public descLabel: Label | null = null;
    @property
    public increaseRate = 10000;
    @property
    public defaultScale = 0.5;
    @property
    public minZoomRatio = 0.4;
    @property
    public maxZoomRatio = 0.4;
    @property
    public clickEffectMoveThreshold = 8;
    @property
    public clickEffectHoldThreshold = 0.5;
    @property
    public lookBuildDuration = 1;

    private begin = new Vec3();
    private isMoving = false;
    private isSingleTouchMoving = false;
    private isPinching = false;
    private inertiaVelocity = new Vec3();
    private dragVelocity = new Vec3();
    private lastTouchDelta = new Vec3();
    private lastTouchTime = 0;
    private lastTouchDeltaTime = 0;
    private inertiaDamping = 0.94;
    private inertiaMinSpeed = 10;
    private inertiaMaxSpeed = 3000;
    private inertiaVelocityScale = 1;
    private inertiaVelocitySmooth = 0.35;
    private inertiaMaxReleaseDelay = 0.12;
    private clickEffectPool: NodePool | null = null;
    private activeClickEffects: Node[] = [];
    private clickEffectStartLocation: Vec2 | null = null;
    private clickEffectStartTime = 0;
    private clickEffectTouchActive = false;
    private clickEffectMoved = false;
    private clickEffectMultiTouch = false;
    private clickEffectTemplate: Node | null = null;
    private clickEffectParent: Node | null = null;
    private camera: (Camera & { zoomRatio?: number }) | null = null;
    private cameraMoveTween: Tween<Node> | null = null;

    onLoad() {
        this.begin = new Vec3(0, 0, 0);
        this.isMoving = false;
        this.isSingleTouchMoving = false;
        this.isPinching = false;
        this.inertiaVelocity = new Vec3(0, 0, 0);
        this.dragVelocity = new Vec3(0, 0, 0);
        this.lastTouchDelta = new Vec3(0, 0, 0);
        this.lastTouchTime = 0;
        this.lastTouchDeltaTime = 0;
        this.clickEffectPool = new NodePool();
        this.activeClickEffects = [];
        this.clickEffectStartLocation = null;
        this.clickEffectMoved = false;
        this.clickEffectMultiTouch = false;

        const cameraNode = find('Canvas/Main Camera') || find('Canvas/VillageCamera');
        this.camera = cameraNode ? cameraNode.getComponent(Camera) as Camera & { zoomRatio?: number } : null;
        if (!this.camera) {
            console.log('MapControlle: camera not found');
            return;
        }

        if (this.mapPieceNode) {
            const mapTransform = this.mapPieceNode.getComponent(UITransform);
            if (mapTransform) {
                getOrAddTransform(this.node).setContentSize(mapTransform.contentSize);
            }
        }

        this.resetViewState();
        this.node.on(Node.EventType.TOUCH_START, this.onStartTouch, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMapClickEffectTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.releaseTouchesEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.releaseTouchesEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.MOUSE_WHEEL, this.onStartWheel, this);
        this.initClickEffectPool();
    }

    resetViewState() {
        if (!this.camera || !this.camera.node) return false;
        this.stopInertia();
        this.isMoving = false;
        this.isSingleTouchMoving = false;
        this.isPinching = false;
        this.clearClickGestureState();
        if (this.cameraMoveTween) {
            Tween.stopAllByTarget(this.camera.node);
            this.cameraMoveTween = null;
        }
        let defaultScale = Number(this.defaultScale);
        if (isNaN(defaultScale) || defaultScale <= 0) defaultScale = 1;
        this.setCameraZoomRatio(defaultScale);
        this.camera.node.setPosition(Vec3.ZERO);
        this.begin = this.camera.node.position.clone();
        return true;
    }

    onStartWheel(event: any) {
        if (this.isMapControlBlocked()) {
            stopTouchPropagation(event);
            return;
        }
        if (!this.camera) {
            return;
        }
        const scale = this.getCameraZoomRatio() - event.getScrollY() / this.increaseRate * -1;
        const screenPos = event.getLocation();
        const realPos = new Vec3();
        this.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0), realPos);
        const targetPos = this.camera.node.parent.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(realPos.x, realPos.y, 0));
        this.smoothOperate(this.camera, targetPos, scale);
        stopTouchPropagation(event);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onStartTouch, this);
        this.node.off(Node.EventType.TOUCH_END, this.onMapClickEffectTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.releaseTouchesEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.releaseTouchesEnd, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.MOUSE_WHEEL, this.onStartWheel, this);
        this.clearClickEffectPool();
    }

    onStartTouch(event: any) {
        if (this.isMapControlBlocked()) {
            this.stopInertia();
            this.isMoving = false;
            this.isSingleTouchMoving = false;
            this.isPinching = false;
            stopTouchPropagation(event);
            return;
        }
        this.recordClickEffectTouchStart(event);
        if (this.cameraMoveTween) {
            Tween.stopAllByTarget(this.node);
            this.cameraMoveTween = null;
        }
        this.stopInertia();
        this.begin = this.node.position.clone();
        this.isSingleTouchMoving = false;
        this.isPinching = false;
    }

    releaseTouchesEnd(event: any) {
        if (this.isMapControlBlocked()) {
            this.stopInertia();
            this.isMoving = false;
            this.isSingleTouchMoving = false;
            this.isPinching = false;
            stopTouchPropagation(event);
            return;
        }
        const touches = event.getTouches();
        if (touches.length <= 1) {
            if (this.isMoving && this.isSingleTouchMoving && !this.isPinching) {
                this.startInertia();
            } else {
                this.stopInertia();
            }
            this.isMoving = false;
            this.isSingleTouchMoving = false;
            this.isPinching = false;
        }
        stopTouchPropagation(event);
    }

    onTouchMove(event: any) {
        if (this.isMapControlBlocked()) {
            this.stopInertia();
            this.isMoving = false;
            this.isSingleTouchMoving = false;
            this.isPinching = false;
            stopTouchPropagation(event);
            return;
        }
        if (!this.camera) {
            return;
        }
        this.recordClickEffectTouchMove(event);
        const touches = event.getTouches();
        if (touches.length === 1) {
            const touch = touches[0];
            if (this.isMoving || touch.getDelta().length() > 1) {
                this.isMoving = true;
                this.isSingleTouchMoving = true;
                this.isPinching = false;
                const mapDelta = new Vec3(event.getDeltaX(), event.getDeltaY(), 0);
                this.recordTouchDelta(mapDelta);
                this.begin = this.begin.add(mapDelta);
                this.applyCameraPosition(this.begin);
            }
        } else if (touches.length === 2) {
            this.isMoving = true;
            this.isSingleTouchMoving = false;
            this.isPinching = true;
            this.stopInertia();

            const touch1 = touches[0];
            const touch2 = touches[1];
            const delta1 = new Vec2(touch1.getDelta().x, touch1.getDelta().y);
            const delta2 = new Vec2(touch2.getDelta().x, touch2.getDelta().y);
            const touchPoint1 = this.camera.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touch1.getLocation().x, touch1.getLocation().y, 0));
            const touchPoint2 = this.camera.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touch2.getLocation().x, touch2.getLocation().y, 0));
            const distance = touchPoint1.clone().subtract(touchPoint2.clone());
            const delta = this.multiplyScalar(delta1.subtract(delta2), this.fingerIncreaseRate);
            const currentZoom = this.getCameraZoomRatio();
            let targetScale: number;
            if (Math.abs(distance.x) > Math.abs(distance.y)) {
                targetScale = (distance.x + delta.x) / distance.x * currentZoom;
            } else {
                targetScale = (distance.y + delta.y) / distance.y * currentZoom;
            }

            const centerX = (touch1.getLocation().x + touch2.getLocation().x) / 2;
            const centerY = (touch1.getLocation().y + touch2.getLocation().y) / 2;
            const realPos = new Vec3();
            this.camera.screenToWorld(new Vec3(centerX, centerY, 0), realPos);
            const targetPos = this.camera.node.parent.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(realPos.x, realPos.y, 0));
            this.smoothOperate(this.camera, targetPos, targetScale);
        }
        stopTouchPropagation(event);
    }

    initClickEffectPool() {
        this.clickEffectTemplate = this.node.getChildByName('DianJiTx');
        if (!this.clickEffectTemplate) {
            return;
        }
        this.clickEffectParent = this.clickEffectTemplate.parent || this.node;
        this.clickEffectTemplate.active = false;
    }

    clearClickEffectPool() {
        if (this.activeClickEffects) {
            for (let i = 0; i < this.activeClickEffects.length; i++) {
                const effectNode = this.activeClickEffects[i];
                if (!isValid(effectNode)) {
                    continue;
                }
                const skeleton = effectNode.getComponent(sp.Skeleton);
                if (skeleton && skeleton.setCompleteListener) {
                    skeleton.setCompleteListener(null);
                }
                effectNode.destroy();
            }
            this.activeClickEffects.length = 0;
        }
        if (this.clickEffectPool) {
            this.clickEffectPool.clear();
        }
    }

    recordClickEffectTouchStart(event: any) {
        this.clickEffectStartLocation = event && event.getLocation ? event.getLocation().clone() : null;
        this.clickEffectStartTime = Date.now() / 1000;
        this.clickEffectTouchActive = true;
        this.clickEffectMoved = false;
        this.clickEffectMultiTouch = false;
        if (event && event.getTouches && event.getTouches().length > 1) {
            this.clickEffectMultiTouch = true;
        }
    }

    clearClickGestureState() {
        this.clickEffectStartLocation = null;
        this.clickEffectStartTime = 0;
        this.clickEffectTouchActive = false;
        this.clickEffectMoved = false;
        this.clickEffectMultiTouch = false;
    }

    isSingleTapGesture(event: any, nowTime?: number) {
        if (!event || !event.getLocation) return true;
        if (event.getTouches && event.getTouches().length > 1) return false;
        if (this.isPinching || this.isMoving || this.isSingleTouchMoving) return false;
        if (!this.clickEffectTouchActive) return true;
        if (this.clickEffectMultiTouch || this.clickEffectMoved) return false;
        if (this.clickEffectStartLocation && event.getLocation().subtract(this.clickEffectStartLocation).length() > this.clickEffectMoveThreshold) return false;
        const now = nowTime != null ? nowTime : Date.now() / 1000;
        if (this.clickEffectStartTime > 0 && now - this.clickEffectStartTime > this.clickEffectHoldThreshold) return false;
        return true;
    }

    recordClickEffectTouchMove(event: any) {
        if (!event || !event.getTouches) {
            return;
        }
        const touches = event.getTouches();
        if (touches.length > 1) {
            this.clickEffectMultiTouch = true;
            this.clickEffectMoved = true;
            return;
        }
        if (!this.clickEffectStartLocation || !event.getLocation) {
            return;
        }
        const moveDistance = event.getLocation().subtract(this.clickEffectStartLocation).length();
        if (moveDistance > this.clickEffectMoveThreshold) {
            this.clickEffectMoved = true;
        }
    }

    onMapClickEffectTouchEnd(event: any) {
        if (this.isMapControlBlocked()) {
            return;
        }
        if (!event || !event.getLocation) {
            return;
        }
        if (!this.isSingleTapGesture(event)) return;
        this.playClickEffectAtScreenPos(event.getLocation());
    }

    playClickEffectAtScreenPos(screenPos: any) {
        if (!this.clickEffectTemplate) {
            this.initClickEffectPool();
        }
        if (!this.clickEffectTemplate || !this.clickEffectParent || !this.camera) {
            return;
        }
        const worldPos = new Vec3();
        this.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0), worldPos);
        const localPos = this.clickEffectParent.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y, 0));
        const effectNode = this.getClickEffectNode();
        if (!effectNode) {
            return;
        }
        effectNode.setPosition(localPos);
        effectNode.active = true;
        this.playClickEffectAnimation(effectNode);
    }

    getClickEffectNode() {
        if (!this.clickEffectTemplate) {
            return null;
        }
        let effectNode = this.clickEffectPool && this.clickEffectPool.size() > 0 ? this.clickEffectPool.get() : null;
        if (!effectNode) {
            effectNode = instantiate(this.clickEffectTemplate);
        }
        effectNode.parent = this.clickEffectParent;
        effectNode.setScale(this.clickEffectTemplate.scale);
        effectNode.angle = this.clickEffectTemplate.angle;
        getOrAddOpacity(effectNode).opacity = this.clickEffectTemplate.getComponent(UIOpacity)?.opacity ?? 255;
        effectNode.setSiblingIndex(this.clickEffectTemplate.getSiblingIndex());
        this.activeClickEffects.push(effectNode);
        return effectNode;
    }

    playClickEffectAnimation(effectNode: Node | null) {
        const skeleton = effectNode && effectNode.getComponent(sp.Skeleton);
        if (!effectNode || !skeleton) {
            this.recycleClickEffectNode(effectNode);
            return;
        }
        const animName = 'DianJi_dh';
        const finish = () => {
            this.recycleClickEffectNode(effectNode);
        };
        if (skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }
        if (skeleton.clearTracks) {
            skeleton.clearTracks();
        }
        if (skeleton.setToSetupPose) {
            skeleton.setToSetupPose();
        }
        const trackEntry = skeleton.setAnimation(0, animName, false);
        if (skeleton.setTrackCompleteListener && trackEntry) {
            skeleton.setTrackCompleteListener(trackEntry, finish);
            return;
        }
        if (skeleton.setCompleteListener) {
            skeleton.setCompleteListener(finish);
            return;
        }
        this.scheduleOnce(finish, this.getSpineAnimationDuration(skeleton, animName, 0.5));
    }

    recycleClickEffectNode(effectNode: Node | null) {
        if (!effectNode || !isValid(effectNode)) {
            return;
        }
        const skeleton = effectNode.getComponent(sp.Skeleton);
        if (skeleton && skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }
        effectNode.active = false;
        const index = this.activeClickEffects ? this.activeClickEffects.indexOf(effectNode) : -1;
        if (index >= 0) {
            this.activeClickEffects.splice(index, 1);
        }
        if (this.clickEffectPool) {
            this.clickEffectPool.put(effectNode);
        } else {
            effectNode.destroy();
        }
    }

    getSpineAnimationDuration(skeleton: any, animName: any, defaultDuration: any) {
        if (!skeleton || !skeleton.skeletonData || !skeleton.skeletonData.getRuntimeData) {
            return defaultDuration;
        }
        const runtimeData = skeleton.skeletonData.getRuntimeData();
        const animations = runtimeData && runtimeData.animations;
        if (!animations) {
            return defaultDuration;
        }
        for (let i = 0; i < animations.length; i++) {
            if (animations[i] && animations[i].name === animName) {
                return animations[i].duration || defaultDuration;
            }
        }
        return defaultDuration;
    }

    getScreenToWorldPoint(screenPos: any) {
        const worldPos = new Vec3();
        if (!this.camera) return worldPos;
        this.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, screenPos.z || 0), worldPos);
        return worldPos;
    }

    smoothOperate(camera: Camera & { zoomRatio?: number }, targetPos: Vec3, targetScale: number) {
        if (targetScale > this.maxZoomRatio || targetScale < this.minZoomRatio) {
            return;
        }
        targetScale = clamp(targetScale, this.minZoomRatio, this.maxZoomRatio);
        const uiTouchPos = this.multiplyScalar(targetPos.clone().subtract(this.node.position.clone()), this.getCameraZoomRatio());
        let mapPos = targetPos.clone().subtract(this.divide(uiTouchPos, targetScale));
        mapPos = this.dealScalePos(mapPos, targetScale);
        this.setCameraZoomRatio(targetScale);
        this.node.setPosition(mapPos);
        this.begin = mapPos.clone();
        if (this.descLabel && isValid(this.descLabel.node)) {
            this.descLabel.string = `${Math.floor(targetScale * 100)}%`;
        }
    }

    recordTouchDelta(delta: Vec3) {
        const now = Date.now() / 1000;
        this.lastTouchDeltaTime = this.lastTouchTime > 0 ? Math.max(now - this.lastTouchTime, 1 / 120) : 1 / 60;
        this.lastTouchTime = now;
        this.lastTouchDelta = delta.clone();
        const instantVelocity = new Vec3(delta.x / this.lastTouchDeltaTime, delta.y / this.lastTouchDeltaTime, 0);
        const smooth = this.inertiaVelocitySmooth;
        if (this.dragVelocity.x === 0 && this.dragVelocity.y === 0) {
            this.dragVelocity = instantVelocity;
        } else {
            this.dragVelocity.x = this.dragVelocity.x * (1 - smooth) + instantVelocity.x * smooth;
            this.dragVelocity.y = this.dragVelocity.y * (1 - smooth) + instantVelocity.y * smooth;
        }
    }

    applyCameraPosition(pos: any) {
        let targetPos = pos.clone ? pos.clone() : new Vec3(pos.x, pos.y, pos.z || 0);
        targetPos = this.dealScalePos(targetPos, this.getCameraZoomRatio());
        this.node.setPosition(targetPos);
        this.begin = targetPos.clone();
        return targetPos;
    }

    stopInertia() {
        this.inertiaVelocity = new Vec3(0, 0, 0);
        this.dragVelocity = new Vec3(0, 0, 0);
        this.lastTouchDelta = new Vec3(0, 0, 0);
        this.lastTouchTime = 0;
        this.lastTouchDeltaTime = 0;
    }

    isMergeTutorialMapControlBlocked() {
        return !!(Game.MergeTutorialManager
            && Game.MergeTutorialManager.ShouldBlockMapControl
            && Game.MergeTutorialManager.ShouldBlockMapControl());
    }

    isTownUpgradeFlowMapControlBlocked() {
        return !!(Game.TownUpgradeFlow
            && Game.TownUpgradeFlow.isRunning
            && Game.TownUpgradeFlow.isRunning());
    }

    isMapControlBlocked() {
        return this.isMergeTutorialMapControlBlocked() || this.isTownUpgradeFlowMapControlBlocked();
    }

    startInertia() {
        const now = Date.now() / 1000;
        if (!this.dragVelocity || this.lastTouchDeltaTime <= 0 || now - this.lastTouchTime > this.inertiaMaxReleaseDelay) {
            this.stopInertia();
            return;
        }
        const velocity = new Vec3(this.dragVelocity.x * this.inertiaVelocityScale, this.dragVelocity.y * this.inertiaVelocityScale, 0);
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed < this.inertiaMinSpeed) {
            this.stopInertia();
            return;
        }
        if (speed > this.inertiaMaxSpeed) {
            const ratio = this.inertiaMaxSpeed / speed;
            velocity.x *= ratio;
            velocity.y *= ratio;
        }
        this.inertiaVelocity = velocity;
    }

    update(dt: any) {
        if (this.isMoving || !this.inertiaVelocity) {
            return;
        }
        const velocity = this.inertiaVelocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed < this.inertiaMinSpeed) {
            this.stopInertia();
            return;
        }
        dt = Math.min(dt, 1 / 30);
        const currentPos = this.node.position;
        const targetX = currentPos.x + velocity.x * dt;
        const targetY = currentPos.y + velocity.y * dt;
        const targetPos = this.applyCameraPosition(new Vec3(targetX, targetY, currentPos.z));
        if (Math.abs(targetPos.x - targetX) > 0.01) {
            velocity.x = 0;
        }
        if (Math.abs(targetPos.y - targetY) > 0.01) {
            velocity.y = 0;
        }
        const damping = Math.pow(this.inertiaDamping, dt * 60);
        velocity.x *= damping;
        velocity.y *= damping;
        if (Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) < this.inertiaMinSpeed) {
            this.stopInertia();
        }
    }

    multiplyScalar(p: any, ratio: any) {
        p.x = p.x * ratio;
        p.y = p.y * ratio;
        if (typeof p.z === 'number') {
            p.z = p.z * ratio;
        }
        return p;
    }

    divide(a: any, b: any) {
        a.x = a.x / b;
        a.y = a.y / b;
        if (typeof a.z === 'number') {
            a.z = a.z / b;
        }
        return a;
    }

    dealScalePos(targetPos: any, zoomRatio: any) {
        if (!this.mapPieceNode) {
            return targetPos;
        }
        const winSize = view.getVisibleSize();
        const mapTransform = this.mapPieceNode.getComponent(UITransform);
        if (!mapTransform) {
            return targetPos;
        }
        const maxX = ((mapTransform.width * this.mapPieceNode.scale.x - winSize.width / zoomRatio) / 2);
        const maxY = ((mapTransform.height * this.mapPieceNode.scale.y - winSize.height / zoomRatio) / 2);
        targetPos.x = clamp(targetPos.x, -maxX, maxX);
        targetPos.y = clamp(targetPos.y, -maxY, maxY);
        return targetPos;
    }

    lookBuild(p: any) {
        this.stopInertia();
        this.isMoving = false;
        let targetPos = p.clone ? p.clone() : new Vec3(p.x, p.y, p.z || 0);
        targetPos = new Vec3(-targetPos.x, -targetPos.y, targetPos.z || 0);
        targetPos = this.dealScalePos(targetPos, this.getCameraZoomRatio());
        if (this.cameraMoveTween) {
            Tween.stopAllByTarget(this.node);
        }
        this.cameraMoveTween = tween(this.node)
            .to(this.lookBuildDuration, { position: targetPos }, { easing: 'sineOut' })
            .call(() => {
                this.cameraMoveTween = null;
            })
            .start();
    }

    private getCameraZoomRatio() {
        return this.camera && typeof this.camera.zoomRatio === 'number' ? this.camera.zoomRatio : this.defaultScale;
    }

    private setCameraZoomRatio(value: number) {
        if (this.camera) {
            this.camera.zoomRatio = value;
        }
    }

}
