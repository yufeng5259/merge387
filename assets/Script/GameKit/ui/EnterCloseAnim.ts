import {
    _decorator,
    CCFloat,
    CCInteger,
    Component,
    Enum,
    Node,
    Size,
    Sprite,
    Tween,
    UIOpacity,
    UITransform,
    Vec2,
    Vec3,
    tween,
} from 'cc';
import type { TweenEasing } from 'cc';
import { CCEaseType, GetEasing } from '../extentions/CCEaseTypes';

const { ccclass, executionOrder, property } = _decorator;

type AnimCallback = () => void;
type EaseValue = CCEaseType | TweenEasing | string;
type TweenEasingValue = TweenEasing | ((k: number) => number);
type EnterConfig = {
    easeType?: EaseValue;
    animTime?: number;
    easeRate?: number;
};
type DelayAction<T extends object> = Tween<T> | null;
type TweenTargetSpec =
    | { kind: 'node', target: Node, props: Partial<Pick<Node, 'scale' | 'position' | 'eulerAngles'>> }
    | { kind: 'opacity', target: UIOpacity, props: Partial<Pick<UIOpacity, 'opacity'>> }
    | { kind: 'transform', target: UITransform, props: Partial<Pick<UITransform, 'contentSize'>> }
    | { kind: 'sprite', target: Sprite, props: Partial<Pick<Sprite, 'fillRange'>> };

export enum AnimType {
    Disable = 0,
    Alpha = 1,
    Scale = 2,
    Pos = 3,
    Size = 4,
    Fill = 5,
    Rotation = 6,
    ScaleAlpha = 21,
    PosAlpha = 31,
    PosScale = 32,
    PosScaleAlpha = 321,
    SizeAlpha = 41,
    SizeScale = 42,
    SizePos = 43,
    RotationAlpha = 61,
    RotationScale = 62,
    RotationPos = 63,
    CenterDiffuce = 1001,
}

Enum(AnimType);

@ccclass('EnterCloseAnim')
@executionOrder(-1)
export class EnterCloseAnim extends Component {
    @property({ type: AnimType })
    enterAnimType = AnimType.Disable;

    @property
    e_playAwake = false;

    @property(CCFloat)
    e_AnimTime = 0.3;

    @property(CCFloat)
    e_DelayTime = 0;

    @property
    e_easeType: EaseValue = CCEaseType.linear;

    @property(CCFloat)
    e_easeRate = 0;

    @property
    e_easeBezierP0 = new Vec2();

    @property
    e_easeBezierP1 = new Vec2();

    @property
    e_easeBezierP2 = new Vec2();

    @property
    e_easeBezierP3 = new Vec2();

    @property(CCInteger)
    e_alpha = 0;

    @property
    e_scale = new Vec2();

    @property(CCFloat)
    e_dx = 0;

    @property(CCFloat)
    e_dy = 0;

    @property(CCFloat)
    e_width = 0;

    @property(CCFloat)
    e_height = 0;

    @property(CCFloat)
    e_rotAngle = 0;

    @property({ type: AnimType })
    closeAnimType = AnimType.Disable;

    @property(CCFloat)
    c_AnimTime = 0.3;

    @property(CCFloat)
    c_DelayTime = 0;

    @property
    c_easeType: EaseValue = CCEaseType.linear;

    @property(CCFloat)
    c_easeRate = 0;

    @property
    c_easeBezierP0 = new Vec2();

    @property
    c_easeBezierP1 = new Vec2();

    @property
    c_easeBezierP2 = new Vec2();

    @property
    c_easeBezierP3 = new Vec2();

    @property(CCInteger)
    c_alpha = 0;

    @property
    c_scale = new Vec2();

    @property(CCFloat)
    c_dx = 0;

    @property(CCFloat)
    c_dy = 0;

    @property(CCFloat)
    c_width = 0;

    @property(CCFloat)
    c_height = 0;

    @property(CCFloat)
    c_rotAngle = 0;

    inited = false;
    st_opacity = 255;
    st_scale = new Vec3(1, 1, 1);
    st_pos = new Vec3();
    st_size = new Size();
    st_rotation = new Vec3();

    onLoad() {
        if (!this.enabled) return;
        this.init();
    }

    init() {
        if (this.inited) return;
        this.st_opacity = this.opacity.opacity;
        this.st_scale = this.node.scale.clone();
        this.st_pos = this.node.position.clone();
        this.st_size = this.uiTransform.contentSize.clone();
        this.st_rotation = this.node.eulerAngles.clone();

        if (this.e_playAwake) {
            this.enterAnim();
        }
        this.inited = true;
    }

    start() {
    }

    enterAnim(callback?: AnimCallback) {
        this.init();
        this.stopTweens();
        this.applyEnterStart();
        this.playTweens(this.enterAnimType, this.e_AnimTime, this.e_DelayTime, 'enter', callback);
    }

    _enterAnim() {
        this.enterAnim();
        return null;
    }

    closeAnim(callback?: AnimCallback) {
        this.init();
        this.stopTweens();
        this.playTweens(this.closeAnimType, this.c_AnimTime, this.c_DelayTime, 'close', callback);
    }

    _closeAnim() {
        this.closeAnim();
        return null;
    }

    getDelayAnim<T extends object>(DelayTime: number, action: DelayAction<T>): DelayAction<T> {
        return action;
    }

    getEnterEasing(): TweenEasingValue {
        return this.normalizeEasing(this.e_easeType, this.e_easeRate, this.e_easeBezierP0, this.e_easeBezierP1, this.e_easeBezierP2, this.e_easeBezierP3);
    }

    getCloseEasing(): TweenEasingValue {
        return this.normalizeEasing(this.c_easeType, this.c_easeRate, this.c_easeBezierP0, this.c_easeBezierP1, this.c_easeBezierP2, this.c_easeBezierP3);
    }

    static playEnter(node: Node, config?: EnterConfig) {
        if (!node) return;
        node.getComponentsInChildren(EnterCloseAnim).forEach((x2) => {
            if (x2.enabled && x2.node.active) {
                if (config) {
                    x2.init();
                    const easeType = x2.e_easeType;
                    const animTime = x2.e_AnimTime;
                    const easeRate = x2.e_easeRate;
                    if (config.easeType !== undefined) x2.e_easeType = config.easeType;
                    if (config.animTime !== undefined) x2.e_AnimTime = config.animTime;
                    if (config.easeRate !== undefined) x2.e_easeRate = config.easeRate;
                    x2.enterAnim();
                    x2.e_easeType = easeType;
                    x2.e_AnimTime = animTime;
                    x2.e_easeRate = easeRate;
                } else {
                    x2.enterAnim();
                }
            }
        });
    }

    static playEnterImmediately(node: Node) {
        if (!node) return;
        node.getComponentsInChildren(EnterCloseAnim).forEach((x2) => {
            if (x2.enabled && x2.node.active) {
                x2.init();
                x2.stopTweens();
                x2.applyEnterStart();
                x2.applyEnterEnd();
            }
        });
    }

    static playClose(node: Node) {
        if (!node) return;
        node.getComponentsInChildren(EnterCloseAnim).forEach((x2) => {
            if (x2.enabled && x2.node.active) {
                x2.closeAnim();
            }
        });
    }

    static playCloseImmediately(node: Node) {
        if (!node) return;
        node.getComponentsInChildren(EnterCloseAnim).forEach((x2) => {
            if (x2.enabled && x2.node.active) {
                x2.init();
                x2.stopTweens();
                x2.applyCloseEnd();
            }
        });
    }

    private get opacity() {
        let opacity = this.node.getComponent(UIOpacity);
        if (!opacity) opacity = this.node.addComponent(UIOpacity);
        return opacity;
    }

    private get uiTransform() {
        let transform = this.node.getComponent(UITransform);
        if (!transform) transform = this.node.addComponent(UITransform);
        return transform;
    }

    private stopTweens() {
        tween(this.node).stop();
        tween(this.opacity).stop();
        tween(this.uiTransform).stop();
        let sprite = this.node.getComponent(Sprite);
        if (sprite) tween(sprite).stop();
    }

    private playTweens(type: number, animTime: number, delayTime: number, mode: 'enter' | 'close', callback?: AnimCallback) {
        const targets = this.getTweenTargets(type, mode);
        if (targets.length === 0) {
            if (callback) callback();
            return;
        }

        let remaining = targets.length;
        const done = () => {
            remaining--;
            if (remaining <= 0 && callback) callback();
        };
        const easing = mode === 'enter' ? this.getEnterEasing() : this.getCloseEasing();

        targets.forEach((spec) => this.playTweenTarget(spec, animTime, delayTime, easing, done));
    }

    private getTweenTargets(type: number, mode: 'enter' | 'close'): TweenTargetSpec[] {
        const list: TweenTargetSpec[] = [];
        this.eachAnimType(type, (type1) => {
            switch (type1) {
                case AnimType.Alpha:
                    list.push({ kind: 'opacity', target: this.opacity, props: { opacity: mode === 'enter' ? this.st_opacity : this.c_alpha } });
                    break;
                case AnimType.Scale:
                    list.push({
                        kind: 'node',
                        target: this.node,
                        props: { scale: mode === 'enter' ? this.st_scale.clone() : new Vec3(this.nonZero(this.c_scale.x), this.nonZero(this.c_scale.y), this.st_scale.z) },
                    });
                    break;
                case AnimType.Pos:
                    list.push({ kind: 'node', target: this.node, props: { position: mode === 'enter' ? this.st_pos.clone() : this.st_pos.clone().add(new Vec3(this.c_dx, this.c_dy, 0)) } });
                    break;
                case AnimType.Size:
                    list.push({ kind: 'transform', target: this.uiTransform, props: { contentSize: mode === 'enter' ? this.st_size.clone() : new Size(this.c_width, this.c_height) } });
                    break;
                case AnimType.Fill: {
                    let sprite = this.node.getComponent(Sprite);
                    if (sprite) list.push({ kind: 'sprite', target: sprite, props: { fillRange: mode === 'enter' ? 1 : 0 } });
                    break;
                }
                case AnimType.Rotation:
                    list.push({ kind: 'node', target: this.node, props: { eulerAngles: mode === 'enter' ? this.st_rotation.clone() : this.st_rotation.clone().add(new Vec3(0, 0, this.c_rotAngle)) } });
                    break;
            }
        });

        if (type === AnimType.CenterDiffuce) {
            list.push({ kind: 'node', target: this.node, props: { position: mode === 'enter' ? this.st_pos.clone() : new Vec3(0, 0, this.st_pos.z) } });
        }

        return list;
    }

    private playTweenTarget(spec: TweenTargetSpec, animTime: number, delayTime: number, easing: TweenEasingValue, done: AnimCallback): void {
        switch (spec.kind) {
            case 'node': {
                let tw = tween(spec.target);
                if (delayTime > 0) tw = tw.delay(delayTime);
                tw.to(animTime, spec.props, { easing }).call(done).start();
                break;
            }
            case 'opacity': {
                let tw = tween(spec.target);
                if (delayTime > 0) tw = tw.delay(delayTime);
                tw.to(animTime, spec.props, { easing }).call(done).start();
                break;
            }
            case 'transform': {
                let tw = tween(spec.target);
                if (delayTime > 0) tw = tw.delay(delayTime);
                tw.to(animTime, spec.props, { easing }).call(done).start();
                break;
            }
            case 'sprite': {
                let tw = tween(spec.target);
                if (delayTime > 0) tw = tw.delay(delayTime);
                tw.to(animTime, spec.props, { easing }).call(done).start();
                break;
            }
        }
    }

    private applyEnterStart() {
        this.eachAnimType(this.enterAnimType, (type1) => {
            switch (type1) {
                case AnimType.Alpha:
                    this.opacity.opacity = this.e_alpha;
                    break;
                case AnimType.Scale:
                    this.node.setScale(this.nonZero(this.e_scale.x), this.nonZero(this.e_scale.y), this.st_scale.z);
                    break;
                case AnimType.Pos:
                    this.node.setPosition(this.st_pos.x + this.e_dx, this.st_pos.y + this.e_dy, this.st_pos.z);
                    break;
                case AnimType.Size:
                    this.uiTransform.setContentSize(this.e_width, this.e_height);
                    break;
                case AnimType.Fill: {
                    let sprite = this.node.getComponent(Sprite);
                    if (sprite) sprite.fillRange = 0;
                    break;
                }
                case AnimType.Rotation:
                    this.node.setRotationFromEuler(this.st_rotation.x, this.st_rotation.y, this.st_rotation.z + this.e_rotAngle);
                    break;
            }
        });

        if (this.enterAnimType === AnimType.CenterDiffuce) {
            this.node.setPosition(0, 0, this.st_pos.z);
        }
    }

    private applyEnterEnd() {
        this.opacity.opacity = this.st_opacity;
        this.node.setScale(this.st_scale);
        this.node.setPosition(this.st_pos);
        this.uiTransform.setContentSize(this.st_size);
        this.node.setRotationFromEuler(this.st_rotation);
        let sprite = this.node.getComponent(Sprite);
        if (sprite) sprite.fillRange = 1;
    }

    private applyCloseEnd() {
        this.eachAnimType(this.closeAnimType, (type1) => {
            switch (type1) {
                case AnimType.Alpha:
                    this.opacity.opacity = this.c_alpha;
                    break;
                case AnimType.Scale:
                    this.node.setScale(this.nonZero(this.c_scale.x), this.nonZero(this.c_scale.y), this.st_scale.z);
                    break;
                case AnimType.Pos:
                    this.node.setPosition(this.st_pos.x + this.c_dx, this.st_pos.y + this.c_dy, this.st_pos.z);
                    break;
                case AnimType.Size:
                    this.uiTransform.setContentSize(this.c_width, this.c_height);
                    break;
                case AnimType.Fill: {
                    let sprite = this.node.getComponent(Sprite);
                    if (sprite) sprite.fillRange = 0;
                    break;
                }
                case AnimType.Rotation:
                    this.node.setRotationFromEuler(this.st_rotation.x, this.st_rotation.y, this.st_rotation.z + this.c_rotAngle);
                    break;
            }
        });

        if (this.closeAnimType === AnimType.CenterDiffuce) {
            this.node.setPosition(0, 0, this.st_pos.z);
        }
    }

    private eachAnimType(type: number, handler: (type1: number) => void) {
        if (type <= 0 || type >= 1000) return;
        let typeid = type;
        do {
            handler(typeid % 10);
            typeid = Math.floor(typeid / 10);
        } while (typeid > 0);
    }

    private normalizeEasing(easeType: EaseValue, easeRate: number, p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): TweenEasingValue {
        if (typeof easeType === 'number') {
            if (easeType === CCEaseType.easeBezierAction) {
                return GetEasing(easeType, p0.y, p1.y, p2.y, p3.y);
            }
            return GetEasing(easeType, easeRate);
        }
        if (typeof easeType === 'string' && easeType.length > 0) {
            return GetEasing(easeType);
        }
        return GetEasing(CCEaseType.linear);
    }

    private nonZero(value: number) {
        return value === 0 ? 0.001 : value;
    }
}
