import {
    _decorator,
    CCFloat,
    CCInteger,
    Component,
    Enum,
    Node,
    Size,
    Sprite,
    UIOpacity,
    UITransform,
    Vec2,
    Vec3,
    tween,
} from 'cc';
import { CCEaseType, GetEasing } from '../extentions/CCEaseTypes';
import type { CCEasing } from '../extentions/CCEaseTypes';

const { ccclass, executionOrder, property, requireComponent } = _decorator;

type AnimCallback = () => void;
type EnterConfig = {
    easeType?: CCEaseType;
    animTime?: number;
    easeRate?: number;
};
type TweenTargetSpec =
    | { kind: 'node', target: Node, props: Partial<Pick<Node, 'scale' | 'position'>> }
    | { kind: 'opacity', target: UIOpacity, props: Partial<Pick<UIOpacity, 'opacity'>> }
    | { kind: 'transform', target: UITransform, props: Partial<Pick<UITransform, 'contentSize'>> }
    | { kind: 'sprite', target: Sprite, props: Partial<Pick<Sprite, 'fillRange'>> }
    | { kind: 'angle', target: Node, value: number };

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
@requireComponent(UITransform)
@requireComponent(UIOpacity)
export class EnterCloseAnim extends Component {
    @property({
        type: AnimType,
        displayName: 'Enter Anim Type',
        animatable: false,
    })
    enterAnimType = AnimType.Disable;

    @property({ displayName: 'Play Awake' })
    e_playAwake = false;

    @property({
        type: CCFloat,
        displayName: 'Anim Time',
    })
    e_AnimTime = 0.3;

    @property({
        type: CCFloat,
        displayName: 'Delay Time',
    })
    e_DelayTime = 0;

    @property({
        type: CCEaseType,
        displayName: 'Ease Type',
        animatable: false,
    })
    e_easeType = CCEaseType.linear;

    @property({
        type: CCFloat,
        displayName: 'Ease Rate',
        visible() {
            return this.e_easeType === CCEaseType.easeIn
                || this.e_easeType === CCEaseType.easeOut
                || this.e_easeType === CCEaseType.easeInOut
                || this.e_easeType === CCEaseType.easeElasticIn
                || this.e_easeType === CCEaseType.easeElasticOut
                || this.e_easeType === CCEaseType.easeElasticInOut
                || this.e_easeType === CCEaseType.easeBackIn
                || this.e_easeType === CCEaseType.easeBackOut
                || this.e_easeType === CCEaseType.easeBackInOut;
        },
    })
    e_easeRate = 0;

    @property({
        displayName: 'Bezier p0',
        visible() { return this.e_easeType === CCEaseType.easeBezierAction; },
    })
    e_easeBezierP0 = new Vec2();

    @property({
        displayName: 'Bezier p1',
        visible() { return this.e_easeType === CCEaseType.easeBezierAction; },
    })
    e_easeBezierP1 = new Vec2();

    @property({
        displayName: 'Bezier p2',
        visible() { return this.e_easeType === CCEaseType.easeBezierAction; },
    })
    e_easeBezierP2 = new Vec2();

    @property({
        displayName: 'Bezier p3',
        visible() { return this.e_easeType === CCEaseType.easeBezierAction; },
    })
    e_easeBezierP3 = new Vec2();

    @property({
        type: CCInteger,
        range: [0, 255, 1],
        slide: true,
        displayName: 'Alpha From',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Alpha
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Alpha
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Alpha
                );
        },
    })
    e_alpha = 0;

    @property({
        displayName: 'Scale From',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Scale
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Scale
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Scale
                );
        },
    })
    e_scale = new Vec2();

    @property({
        type: CCFloat,
        displayName: 'DX',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Pos
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Pos
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Pos
                );
        },
    })
    e_dx = 0;

    @property({
        type: CCFloat,
        displayName: 'DY',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Pos
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Pos
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Pos
                );
        },
    })
    e_dy = 0;

    @property({
        type: CCFloat,
        displayName: 'Height From',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Size
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Size
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Size
                );
        },
    })
    e_height = 0;

    @property({
        type: CCFloat,
        displayName: 'Width From',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Size
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Size
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Size
                );
        },
    })
    e_width = 0;

    @property({
        type: CCFloat,
        displayName: 'Rotation From',
        visible() {
            return this.enterAnimType < 1000
                && (
                    this.enterAnimType % 10 === AnimType.Rotation
                    || Math.floor(this.enterAnimType / 10) % 10 === AnimType.Rotation
                    || Math.floor(this.enterAnimType / 100) % 10 === AnimType.Rotation
                );
        },
    })
    e_rotAngle = 0;

    @property({
        type: AnimType,
        displayName: 'Close Anim Type',
        animatable: false,
    })
    closeAnimType = AnimType.Disable;

    @property({
        type: CCFloat,
        displayName: 'Anim Time',
    })
    c_AnimTime = 0.3;

    @property({
        type: CCFloat,
        displayName: 'Delay Time',
    })
    c_DelayTime = 0;

    @property({
        type: CCEaseType,
        displayName: 'Ease Type',
        animatable: false,
    })
    c_easeType = CCEaseType.linear;

    @property({
        type: CCFloat,
        displayName: 'Ease Rate',
        visible() {
            return this.c_easeType === CCEaseType.easeIn
                || this.c_easeType === CCEaseType.easeOut
                || this.c_easeType === CCEaseType.easeInOut
                || this.c_easeType === CCEaseType.easeElasticIn
                || this.c_easeType === CCEaseType.easeElasticOut
                || this.c_easeType === CCEaseType.easeElasticInOut
                || this.c_easeType === CCEaseType.easeBackIn
                || this.c_easeType === CCEaseType.easeBackOut
                || this.c_easeType === CCEaseType.easeBackInOut;
        },
    })
    c_easeRate = 0;

    @property({
        displayName: 'Bezier p0',
        visible() { return this.c_easeType === CCEaseType.easeBezierAction; },
    })
    c_easeBezierP0 = new Vec2();

    @property({
        displayName: 'Bezier p1',
        visible() { return this.c_easeType === CCEaseType.easeBezierAction; },
    })
    c_easeBezierP1 = new Vec2();

    @property({
        displayName: 'Bezier p2',
        visible() { return this.c_easeType === CCEaseType.easeBezierAction; },
    })
    c_easeBezierP2 = new Vec2();

    @property({
        displayName: 'Bezier p3',
        visible() { return this.c_easeType === CCEaseType.easeBezierAction; },
    })
    c_easeBezierP3 = new Vec2();

    @property({
        type: CCInteger,
        range: [0, 255, 1],
        slide: true,
        displayName: 'Alpha To',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Alpha
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Alpha
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Alpha
                );
        },
    })
    c_alpha = 0;

    @property({
        displayName: 'Scale To',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Scale
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Scale
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Scale
                );
        },
    })
    c_scale = new Vec2();

    @property({
        type: CCFloat,
        displayName: 'DX',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Pos
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Pos
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Pos
                );
        },
    })
    c_dx = 0;

    @property({
        type: CCFloat,
        displayName: 'DY',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Pos
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Pos
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Pos
                );
        },
    })
    c_dy = 0;

    @property({
        type: CCFloat,
        displayName: 'Height To',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Size
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Size
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Size
                );
        },
    })
    c_height = 0;

    @property({
        type: CCFloat,
        displayName: 'Width To',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Size
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Size
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Size
                );
        },
    })
    c_width = 0;

    @property({
        type: CCFloat,
        displayName: 'Rotation To',
        visible() {
            return this.closeAnimType < 1000
                && (
                    this.closeAnimType % 10 === AnimType.Rotation
                    || Math.floor(this.closeAnimType / 10) % 10 === AnimType.Rotation
                    || Math.floor(this.closeAnimType / 100) % 10 === AnimType.Rotation
                );
        },
    })
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
        this.inited = true;

        if (this.e_playAwake) {
            this.stopTweens();
            this.playEnterTweens();
        }
    }

    start() {
    }

    enterAnim(callback?: AnimCallback) {
        this.init();
        this.stopTweens();
        this.playEnterTweens(callback);
    }

    _enterAnim() {
        this.enterAnim();
        return null;
    }

    closeAnim(callback?: AnimCallback) {
        this.init();
        this.stopTweens();
        this.playCloseTweens(callback);
    }

    _closeAnim() {
        this.closeAnim();
        return null;
    }

    getEnterEasing(): CCEasing {
        if (this.e_easeType === CCEaseType.easeBezierAction) {
            return GetEasing(this.e_easeType, this.e_easeBezierP0.y, this.e_easeBezierP1.y, this.e_easeBezierP2.y, this.e_easeBezierP3.y);
        }
        return GetEasing(this.e_easeType, this.e_easeRate);
    }

    getCloseEasing(): CCEasing {
        if (this.c_easeType === CCEaseType.easeBezierAction) {
            return GetEasing(this.c_easeType, this.c_easeBezierP0.y, this.c_easeBezierP1.y, this.c_easeBezierP2.y, this.c_easeBezierP3.y);
        }
        return GetEasing(this.c_easeType, this.c_easeRate);
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
        return this.node.getComponent(UIOpacity)!;
    }

    private get uiTransform() {
        return this.node.getComponent(UITransform)!;
    }

    private stopTweens() {
        tween(this.node).stop();
        tween(this.opacity).stop();
        tween(this.uiTransform).stop();
        let sprite = this.node.getComponent(Sprite);
        if (sprite) tween(sprite).stop();
    }

    private playEnterTweens(callback?: AnimCallback) {
        const targets = this.getEnterTweenTargets();
        this.playTweens(targets, this.e_AnimTime, this.e_DelayTime, this.getEnterEasing(), callback);
    }

    private playCloseTweens(callback?: AnimCallback) {
        const targets = this.getCloseTweenTargets();
        this.playTweens(targets, this.c_AnimTime, this.c_DelayTime, this.getCloseEasing(), callback);
    }

    private playTweens(targets: TweenTargetSpec[], animTime: number, delayTime: number, easing: CCEasing, callback?: AnimCallback) {
        if (targets.length === 0) {
            if (callback) callback();
            return;
        }

        let remaining = targets.length;
        const done = () => {
            remaining--;
            if (remaining <= 0 && callback) callback();
        };

        targets.forEach((spec) => this.playTweenTarget(spec, animTime, delayTime, easing, done));
    }

    private getEnterTweenTargets(): TweenTargetSpec[] {
        const list: TweenTargetSpec[] = [];
        this.eachAnimType(this.enterAnimType, (type1) => {
            switch (type1) {
                case AnimType.Alpha:
                    this.opacity.opacity = this.st_opacity;
                    list.push({ kind: 'opacity', target: this.opacity, props: { opacity: this.st_opacity } });
                    this.opacity.opacity = this.e_alpha;
                    break;
                case AnimType.Scale:
                    this.node.setScale(this.st_scale);
                    list.push({
                        kind: 'node',
                        target: this.node,
                        props: { scale: this.node.scale.clone() },
                    });
                    this.node.setScale(this.nonZero(this.e_scale.x), this.nonZero(this.e_scale.y), this.st_scale.z);
                    break;
                case AnimType.Pos:
                    this.node.setPosition(this.st_pos);
                    list.push({ kind: 'node', target: this.node, props: { position: this.node.position.clone() } });
                    this.node.setPosition(this.node.position.x + this.e_dx, this.node.position.y + this.e_dy, this.node.position.z);
                    break;
                case AnimType.Size:
                    this.uiTransform.setContentSize(this.st_size);
                    list.push({ kind: 'transform', target: this.uiTransform, props: { contentSize: this.uiTransform.contentSize.clone() } });
                    this.uiTransform.setContentSize(this.e_width, this.e_height);
                    break;
                case AnimType.Fill: {
                    let sprite = this.node.getComponent(Sprite);
                    if (sprite) {
                        sprite.fillRange = 0;
                        list.push({ kind: 'sprite', target: sprite, props: { fillRange: 1 } });
                    }
                    break;
                }
                case AnimType.Rotation:
                    this.node.setRotationFromEuler(this.st_rotation);
                    list.push({ kind: 'angle', target: this.node, value: this.node.angle });
                    this.node.angle += this.e_rotAngle;
                    break;
            }
        });

        if (this.enterAnimType === AnimType.CenterDiffuce) {
            this.node.setPosition(this.st_pos);
            list.push({ kind: 'node', target: this.node, props: { position: this.node.position.clone() } });
            this.node.setPosition(0, 0, this.st_pos.z);
        }

        return list;
    }

    private getCloseTweenTargets(): TweenTargetSpec[] {
        const list: TweenTargetSpec[] = [];
        this.eachAnimType(this.closeAnimType, (type1) => {
            switch (type1) {
                case AnimType.Alpha:
                    list.push({ kind: 'opacity', target: this.opacity, props: { opacity: this.c_alpha } });
                    break;
                case AnimType.Scale:
                    list.push({ kind: 'node', target: this.node, props: { scale: new Vec3(this.nonZero(this.c_scale.x), this.nonZero(this.c_scale.y), this.node.scale.z) } });
                    break;
                case AnimType.Pos:
                    list.push({ kind: 'node', target: this.node, props: { position: this.node.position.clone().add(new Vec3(this.c_dx, this.c_dy, 0)) } });
                    break;
                case AnimType.Size:
                    list.push({ kind: 'transform', target: this.uiTransform, props: { contentSize: new Size(this.c_width, this.c_height) } });
                    break;
                case AnimType.Fill: {
                    let sprite = this.node.getComponent(Sprite);
                    if (sprite) list.push({ kind: 'sprite', target: sprite, props: { fillRange: 0 } });
                    break;
                }
                case AnimType.Rotation:
                    list.push({ kind: 'angle', target: this.node, value: this.node.angle + this.c_rotAngle });
                    break;
            }
        });

        if (this.closeAnimType === AnimType.CenterDiffuce) {
            list.push({ kind: 'node', target: this.node, props: { position: new Vec3(0, 0, this.node.position.z) } });
        }

        return list;
    }

    private playTweenTarget(spec: TweenTargetSpec, animTime: number, delayTime: number, easing: CCEasing, done: AnimCallback): void {
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
            case 'angle': {
                let tw = tween(spec.target);
                if (delayTime > 0) tw = tw.delay(delayTime);
                tw.to(animTime, { angle: spec.value }, { easing }).call(done).start();
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
                    this.node.setScale(this.nonZero(this.c_scale.x), this.nonZero(this.c_scale.y), this.node.scale.z);
                    break;
                case AnimType.Pos:
                    this.node.setPosition(this.node.position.x + this.c_dx, this.node.position.y + this.c_dy, this.node.position.z);
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
                    this.node.angle += this.c_rotAngle;
                    break;
            }
        });

        if (this.closeAnimType === AnimType.CenterDiffuce) {
            this.node.setPosition(0, 0, this.node.position.z);
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

    private nonZero(value: number) {
        return value === 0 ? 0.001 : value;
    }
}
