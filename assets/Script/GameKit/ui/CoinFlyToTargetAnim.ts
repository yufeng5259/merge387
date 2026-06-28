import {
    _decorator,
    Animation,
    Component,
    instantiate,
    isValid,
    Node,
    NodePool,
    Sprite,
    SpriteFrame,
    Tween,
    tween,
    UIOpacity,
    UITransform,
    Vec2,
    Vec3,
    warn,
} from 'cc';
import FramesAnimation from '../render/FramesAnimation';

const { ccclass, property } = _decorator;

type FlyCallback = () => void;
type ArriveCallback = (worldPos: Vec3, flyNode: Node) => void;

interface ResourceCollectProfile {
    count: number;
    spread: number;
    popTime: number;
    flyTime: number;
    groups: number;
    hitScale: number;
    hitShake: number;
}

interface ResourceCollectOptions {
    cb?: FlyCallback;
    arriveCb?: ArriveCallback;
    globalFromPos?: Vec2 | Vec3 | { x?: number; y?: number; z?: number };
    fromWorldPos?: Vec2 | Vec3 | { x?: number; y?: number; z?: number };
    globalToPos?: Vec2 | Vec3 | { x?: number; y?: number; z?: number };
    toWorldPos?: Vec2 | Vec3 | { x?: number; y?: number; z?: number };
    contentType?: string | number;
    level?: string | number;
    animCount?: number;
    textures?: SpriteFrame[];
    spriteFrame?: SpriteFrame | null;
    targetNode?: Node | null;
}

function toNumber(value: unknown, fallback: number): number {
    const parsed = typeof value === 'number' ? value : parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toInt(value: unknown, fallback: number): number {
    const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clonePosition(position: Vec3): Vec3 {
    return new Vec3(position.x, position.y, position.z);
}

function makeVec3(pos?: Vec2 | Vec3 | { x?: number; y?: number; z?: number } | null): Vec3 {
    if (!pos) {
        return new Vec3();
    }

    return new Vec3(toNumber(pos.x, 0), toNumber(pos.y, 0), toNumber('z' in pos ? pos.z : 0, 0));
}

function ensureOpacity(node: Node): UIOpacity {
    return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

function setNodeOpacity(node: Node, opacity: number): void {
    ensureOpacity(node).opacity = opacity;
}

function stopNodeTweens(node: Node): void {
    Tween.stopAllByTarget(node);
    const opacity = node.getComponent(UIOpacity);
    if (opacity) {
        Tween.stopAllByTarget(opacity);
    }
}

function quadraticBezier(out: Vec3, start: Vec3, control: Vec3, end: Vec3, ratio: number): Vec3 {
    const inv = 1 - ratio;
    out.x = inv * inv * start.x + 2 * inv * ratio * control.x + ratio * ratio * end.x;
    out.y = inv * inv * start.y + 2 * inv * ratio * control.y + ratio * ratio * end.y;
    out.z = inv * inv * start.z + 2 * inv * ratio * control.z + ratio * ratio * end.z;
    return out;
}

function cubicBezier(out: Vec3, start: Vec3, control1: Vec3, control2: Vec3, end: Vec3, ratio: number): Vec3 {
    const inv = 1 - ratio;
    const inv2 = inv * inv;
    const ratio2 = ratio * ratio;
    out.x = inv2 * inv * start.x + 3 * inv2 * ratio * control1.x + 3 * inv * ratio2 * control2.x + ratio2 * ratio * end.x;
    out.y = inv2 * inv * start.y + 3 * inv2 * ratio * control1.y + 3 * inv * ratio2 * control2.y + ratio2 * ratio * end.y;
    out.z = inv2 * inv * start.z + 3 * inv2 * ratio * control1.z + 3 * inv * ratio2 * control2.z + ratio2 * ratio * end.z;
    return out;
}

@ccclass('CoinFlyToTargetAnim')
export class CoinFlyToTargetAnim extends Component {
    @property([Animation])
    public anims: Animation[] = [];

    @property(Node)
    public flyerTemplate: Node | null = null;

    private flyPool = new NodePool();
    private flyPrototypeNode: Node | null = null;

    public onLoad(): void {
        this.flyPool = new NodePool();
        this.flyPrototypeNode = null;

        if (this.anims && this.anims.length > 0) {
            this.flyPrototypeNode = this.anims[0].node;
            for (const animation of this.anims) {
                const node = animation.node;
                node.active = false;
                this.flyPool.put(node);
            }
        }

        if (!this.flyerTemplate && !this.flyPrototypeNode) {
            warn('CoinFlyToTargetAnim: please configure anims or flyerTemplate');
        }
    }

    protected onDestroy(): void {
        this.flyPool.clear();
    }

    public SetAnimationTextures(textures: SpriteFrame[]): void {
        const comps = this.node.getComponentsInChildren(FramesAnimation);
        comps.forEach((comp) => {
            comp.SetTextures(textures);
        });
    }

    public PlayResourceCollectAnim(options: ResourceCollectOptions = {}): void {
        const cb = options.cb;
        const fromWorldPos = makeVec3(options.globalFromPos || options.fromWorldPos);
        const toWorldPos = makeVec3(options.globalToPos || options.toWorldPos);
        const fromLocalPos = this.toLocalPos(fromWorldPos);
        const toLocalPos = this.toLocalPos(toWorldPos);
        const profile = this.getResourceCollectProfile(options.contentType, options.level, options.animCount);
        const wantedCount = Math.max(1, profile.count);
        const flyNodes = this.acquireFlyNodes(wantedCount);

        if (flyNodes.length === 0) {
            if (cb) cb();
            return;
        }

        if (typeof GameKit !== 'undefined' && GameKit.SoundManager) {
            GameKit.SoundManager.playSound('HammersThrow-01');
        }

        let completedCount = 0;
        const expected = flyNodes.length;
        const groupSize = Math.max(1, Math.ceil(expected / profile.groups));

        flyNodes.forEach((flyNode, index) => {
            this.prepareResourceFlyNode(flyNode, options.textures, options.spriteFrame || null);

            const angle = Math.PI * 2 * index / expected + (Math.random() - 0.5) * 0.7;
            const radius = profile.spread * (0.28 + Math.random() * 0.5);
            const startOffset = new Vec3(Math.cos(angle) * radius * 0.35, Math.sin(angle) * radius * 0.25, 0);
            const cloudOffset = new Vec3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.65 + Math.min(profile.spread * 0.25, 24),
                0,
            );
            const startPos = new Vec3(fromLocalPos.x + startOffset.x, fromLocalPos.y + startOffset.y, fromLocalPos.z);
            const cloudPos = new Vec3(fromLocalPos.x + cloudOffset.x, fromLocalPos.y + cloudOffset.y, fromLocalPos.z);
            const finalTargetPos = new Vec3(
                toLocalPos.x + (Math.random() - 0.5) * 24,
                toLocalPos.y + (Math.random() - 0.5) * 18,
                toLocalPos.z,
            );
            const midY = Math.max(cloudPos.y, finalTargetPos.y) + 70 + Math.random() * 80;
            const control1 = new Vec3(cloudPos.x + (Math.random() - 0.5) * 100, midY, cloudPos.z);
            const control2 = new Vec3((cloudPos.x + finalTargetPos.x) * 0.5 + (Math.random() - 0.5) * 120, midY - 20, finalTargetPos.z);
            const groupIndex = Math.floor(index / groupSize);
            const startDelay = groupIndex * 0.16 + (index % groupSize) * 0.045;
            const startScale = 0.75 + Math.random() * 0.25;
            const peakScale = 1.08 + Math.random() * 0.1;
            const endScale = 0.55 + Math.random() * 0.2;
            const rotateDegree = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 300);

            stopNodeTweens(flyNode);
            flyNode.setPosition(startPos);
            flyNode.setScale(new Vec3(startScale, startScale, 1));
            flyNode.angle = Math.random() * 60 - 30;
            setNodeOpacity(flyNode, 255);

            this.scheduleOnce(() => {
                if (!isValid(this) || !isValid(flyNode)) {
                    return;
                }

                this.playResourceFlyTween(
                    flyNode,
                    cloudPos,
                    control1,
                    control2,
                    finalTargetPos,
                    profile,
                    groupIndex,
                    peakScale,
                    endScale,
                    rotateDegree,
                    () => {
                        if (!isValid(this)) {
                            return;
                        }

                        if (options.arriveCb) {
                            options.arriveCb(toWorldPos, flyNode);
                        }
                        if (index === expected - 1) {
                            this.playTargetFeedback(options.targetNode || null, profile);
                        }

                        this.releaseFlyNode(flyNode);
                        completedCount++;
                        if (completedCount >= expected && cb) {
                            cb();
                        }
                    },
                );
            }, startDelay);
        });
    }

    public PlayAnim(
        globalFromPos: Vec2 | Vec3 | { x?: number; y?: number; z?: number },
        globalToPos: Vec2 | Vec3 | { x?: number; y?: number; z?: number },
        time = 1.0,
        delay = 0.15,
        animCount?: number,
        textures?: SpriteFrame[],
        cb?: FlyCallback,
        arriveCb?: ArriveCallback,
    ): void {
        const fromWorldPos = makeVec3(globalFromPos);
        const toWorldPos = makeVec3(globalToPos);
        const fromLocalPos = this.toLocalPos(fromWorldPos);
        const toLocalPos = this.toLocalPos(toWorldPos);
        const reverseVec = new Vec3(fromLocalPos.x - toLocalPos.x, fromLocalPos.y - toLocalPos.y, 0);
        const reverseLength = Math.hypot(reverseVec.x, reverseVec.y);
        const baseReverseDir = reverseLength > 1
            ? new Vec2(reverseVec.x / reverseLength, reverseVec.y / reverseLength)
            : new Vec2(0, 1);

        const editorCount = this.anims && this.anims.length > 0 ? this.anims.length : 0;
        const defaultCount = editorCount > 0 ? editorCount : 8;
        const wantCount = animCount !== undefined && animCount !== null ? Math.max(1, animCount) : defaultCount;
        const flyNodes = this.acquireFlyNodes(wantCount);

        if (flyNodes.length === 0) {
            if (cb) cb();
            return;
        }

        let completedCount = 0;
        const expected = flyNodes.length;

        flyNodes.forEach((flyNode, index) => {
            flyNode.children.forEach((child) => {
                child.active = true;
            });
            this.applyTexturesToFlyNode(flyNode, textures);

            flyNode.setPosition(fromLocalPos);
            flyNode.setScale(Vec3.ONE);
            setNodeOpacity(flyNode, 255);

            const finalTargetPos = new Vec3(
                toLocalPos.x + (Math.random() - 0.5) * 20,
                toLocalPos.y + (Math.random() - 0.5) * 20,
                toLocalPos.z,
            );
            const reverseDist = 50 + Math.random() * 100;
            const randomAngle = (Math.random() - 0.5) * Math.PI;
            const cosAngle = Math.cos(randomAngle);
            const sinAngle = Math.sin(randomAngle);
            const reverseDir = new Vec2(
                baseReverseDir.x * cosAngle - baseReverseDir.y * sinAngle,
                baseReverseDir.x * sinAngle + baseReverseDir.y * cosAngle,
            );
            const reversePos = new Vec3(
                fromLocalPos.x + reverseDir.x * reverseDist + (Math.random() - 0.5) * 60,
                fromLocalPos.y + reverseDir.y * reverseDist + (Math.random() - 0.5) * 60,
                fromLocalPos.z,
            );

            stopNodeTweens(flyNode);

            this.scheduleOnce(() => {
                if (!isValid(this) || !isValid(flyNode)) {
                    return;
                }

                const reverseTime = time * 0.3;
                const flyTime = time * 0.7;
                const arriveLeadTime = Math.min(0.12, Math.max(0.03, flyTime * 0.25));
                const arriveWaitTime = Math.max(0, flyTime - arriveLeadTime);
                let arrived = false;

                tween(flyNode)
                    .to(reverseTime, { position: reversePos }, { easing: 'quadOut' })
                    .to(flyTime, { position: finalTargetPos }, {
                        easing: 'quadInOut',
                        onUpdate: (_target, ratio = 0) => {
                            if (!arrived && ratio >= arriveWaitTime / flyTime) {
                                arrived = true;
                                if (arriveCb && isValid(this) && isValid(flyNode)) {
                                    arriveCb(toWorldPos, flyNode);
                                }
                            }
                        },
                    })
                    .call(() => {
                        if (!isValid(this)) {
                            return;
                        }

                        this.releaseFlyNode(flyNode);
                        completedCount++;
                        if (completedCount >= expected && cb) {
                            cb();
                        }
                    })
                    .start();
            }, delay + index * 0.05);
        });
    }

    public PlayCollectAnim(
        spriteFrame: SpriteFrame,
        globalFromPos: Vec2 | Vec3 | { x?: number; y?: number; z?: number },
        globalToPos: Vec2 | Vec3 | { x?: number; y?: number; z?: number },
        animCount: number,
        cb?: FlyCallback,
    ): void {
        if (!animCount || animCount <= 0) {
            if (cb) cb();
            return;
        }

        const fromWorldPos = makeVec3(globalFromPos);
        const toWorldPos = makeVec3(globalToPos);
        const fromLocalPos = this.toLocalPos(fromWorldPos);
        const toLocalPos = this.toLocalPos(toWorldPos);
        const animStep = Math.ceil(animCount / 20);
        const animTimes = Math.ceil(animCount / animStep);
        const animDelay = Math.max(0.1, 0.3 - Math.max(0, animCount - 5) * 0.03);

        let completedCount = 0;
        for (let i = 0; i < animTimes; i++) {
            this.scheduleOnce(() => {
                if (!isValid(this)) {
                    return;
                }

                const flyNode = this.acquireFlyNode();
                if (!flyNode) {
                    return;
                }

                flyNode.children.forEach((child) => {
                    child.active = false;
                });

                const sprite = flyNode.getComponent(Sprite) || flyNode.addComponent(Sprite);
                sprite.enabled = true;
                sprite.spriteFrame = spriteFrame;

                flyNode.setPosition(fromLocalPos);
                flyNode.setScale(Vec3.ONE);
                flyNode.angle = 0;
                setNodeOpacity(flyNode, 255);

                if (typeof GameKit !== 'undefined' && GameKit.SoundManager) {
                    GameKit.SoundManager.playSound('HammersThrow-01');
                }

                this.playJumpCollectTween(flyNode, toLocalPos, () => {
                    if (!isValid(this)) {
                        return;
                    }

                    this.releaseFlyNode(flyNode);
                    completedCount++;
                    if (completedCount >= animTimes && cb) {
                        cb();
                    }
                });
            }, i * animDelay);
        }
    }

    private acquireFlyNodes(count: number): Node[] {
        const flyNodes: Node[] = [];
        for (let i = 0; i < count; i++) {
            const flyNode = this.acquireFlyNode();
            if (!flyNode) {
                break;
            }
            flyNodes.push(flyNode);
        }
        return flyNodes;
    }

    private acquireFlyNode(): Node | null {
        let node = this.flyPool.get();
        if (!node) {
            if (this.flyerTemplate && isValid(this.flyerTemplate)) {
                node = instantiate(this.flyerTemplate);
            } else if (this.flyPrototypeNode && isValid(this.flyPrototypeNode)) {
                node = instantiate(this.flyPrototypeNode);
            } else {
                warn('CoinFlyToTargetAnim: unable to create fly node');
                return null;
            }
        }

        node.parent = this.node;
        node.active = true;
        return node;
    }

    private releaseFlyNode(node: Node): void {
        if (!node || !isValid(node)) {
            return;
        }

        stopNodeTweens(node);
        node.setScale(Vec3.ONE);
        node.angle = 0;
        setNodeOpacity(node, 255);

        const sprite = node.getComponent(Sprite);
        if (sprite) {
            sprite.enabled = false;
        }

        node.active = false;
        this.flyPool.put(node);
    }

    private applyTexturesToFlyNode(flyNode: Node, textures?: SpriteFrame[]): void {
        if (!textures || textures.length === 0 || !flyNode || !isValid(flyNode)) {
            return;
        }

        const comps = flyNode.getComponentsInChildren(FramesAnimation);
        comps.forEach((comp) => {
            comp.SetTextures(textures);
        });
    }

    private toLocalPos(worldPos: Vec3): Vec3 {
        const parent = this.node.parent;
        if (!parent) {
            return clonePosition(worldPos);
        }

        const transform = parent.getComponent(UITransform);
        if (!transform) {
            return clonePosition(worldPos);
        }

        return transform.convertToNodeSpaceAR(worldPos, new Vec3());
    }

    private getResourceCollectProfile(contentType: unknown, level: unknown, fallbackCount?: number): ResourceCollectProfile {
        const type = toInt(contentType, 10);
        const lv = Math.max(1, toInt(level || 1, 1));
        const table: ResourceCollectProfile[] = type === 7
            ? [
                { count: 3, spread: 44, popTime: 0.12, flyTime: 0.52, groups: 1, hitScale: 1.08, hitShake: 0 },
                { count: 5, spread: 44, popTime: 0.17, flyTime: 0.68, groups: 1, hitScale: 1.10, hitShake: 0 },
                { count: 7, spread: 64, popTime: 0.22, flyTime: 0.82, groups: 2, hitScale: 1.12, hitShake: 0 },
                { count: 9, spread: 82, popTime: 0.26, flyTime: 0.96, groups: 3, hitScale: 1.14, hitShake: 1 },
            ]
            : [
                { count: 3, spread: 32, popTime: 0.12, flyTime: 0.52, groups: 1, hitScale: 1.08, hitShake: 0 },
                { count: 5, spread: 48, popTime: 0.17, flyTime: 0.68, groups: 1, hitScale: 1.10, hitShake: 0 },
                { count: 8, spread: 70, popTime: 0.22, flyTime: 0.83, groups: 2, hitScale: 1.12, hitShake: 0 },
                { count: 12, spread: 90, popTime: 0.25, flyTime: 0.95, groups: 3, hitScale: 1.14, hitShake: 1 },
                { count: 14, spread: 110, popTime: 0.30, flyTime: 1.05, groups: 3, hitScale: 1.16, hitShake: 2 },
            ];

        const profile = table[Math.min(lv, table.length) - 1];
        if (fallbackCount !== undefined && fallbackCount !== null && fallbackCount > 0 && !level) {
            return { ...profile, count: fallbackCount };
        }

        return profile;
    }

    private prepareResourceFlyNode(flyNode: Node, textures?: SpriteFrame[], spriteFrame?: SpriteFrame | null): void {
        const useSprite = !!spriteFrame;
        flyNode.children.forEach((child) => {
            child.active = !useSprite;
        });

        let sprite = flyNode.getComponent(Sprite);
        if (useSprite) {
            sprite = sprite || flyNode.addComponent(Sprite);
            sprite.enabled = true;
            sprite.spriteFrame = spriteFrame;
        } else if (sprite) {
            sprite.enabled = false;
        }

        this.applyTexturesToFlyNode(flyNode, textures);
    }

    private playTargetFeedback(targetNode: Node | null, profile: ResourceCollectProfile): void {
        if (!targetNode || !isValid(targetNode)) {
            return;
        }

        const originalScale = clonePosition(targetNode.scale);
        const originalPos = clonePosition(targetNode.position);
        stopNodeTweens(targetNode);

        const feedback = tween(targetNode)
            .to(0.08, { scale: new Vec3(originalScale.x * profile.hitScale, originalScale.y * profile.hitScale, originalScale.z) })
            .to(0.16, { scale: originalScale }, { easing: 'backOut' });

        if (profile.hitShake > 0) {
            for (let i = 0; i < profile.hitShake; i++) {
                feedback
                    .to(0.04, { position: new Vec3(originalPos.x + 4, originalPos.y, originalPos.z) })
                    .to(0.04, { position: new Vec3(originalPos.x - 4, originalPos.y, originalPos.z) })
                    .to(0.04, { position: originalPos });
            }
        }

        feedback.call(() => {
            if (isValid(targetNode)) {
                targetNode.setPosition(originalPos);
                targetNode.setScale(originalScale);
            }
        }).start();
    }

    private playResourceFlyTween(
        flyNode: Node,
        cloudPos: Vec3,
        control1: Vec3,
        control2: Vec3,
        finalTargetPos: Vec3,
        profile: ResourceCollectProfile,
        groupIndex: number,
        peakScale: number,
        endScale: number,
        rotateDegree: number,
        complete: FlyCallback,
    ): void {
        const opacity = ensureOpacity(flyNode);
        const path = { ratio: 0 };
        const startBezierPos = clonePosition(cloudPos);

        tween(flyNode)
            .to(profile.popTime, { position: cloudPos, scale: new Vec3(peakScale, peakScale, flyNode.scale.z) }, { easing: 'quadOut' })
            .delay(profile.groups > 1 ? 0.04 * groupIndex : 0)
            .call(() => {
                path.ratio = 0;
            })
            .to(profile.flyTime, { angle: flyNode.angle + rotateDegree }, { easing: 'linear' })
            .call(complete)
            .start();

        tween(path)
            .delay(profile.popTime + (profile.groups > 1 ? 0.04 * groupIndex : 0))
            .to(profile.flyTime, { ratio: 1 }, {
                easing: 'quadInOut',
                onUpdate: () => {
                    if (isValid(flyNode)) {
                        const pos = cubicBezier(new Vec3(), startBezierPos, control1, control2, finalTargetPos, path.ratio);
                        flyNode.setPosition(pos);
                    }
                },
            })
            .start();

        tween(flyNode)
            .delay(profile.popTime + (profile.groups > 1 ? 0.04 * groupIndex : 0))
            .to(profile.flyTime * 0.55, { scale: new Vec3(peakScale, peakScale, flyNode.scale.z) })
            .to(profile.flyTime * 0.45, { scale: new Vec3(endScale, endScale, flyNode.scale.z) }, { easing: 'quadIn' })
            .start();

        tween(opacity)
            .delay(profile.popTime + (profile.groups > 1 ? 0.04 * groupIndex : 0) + profile.flyTime * 0.68)
            .to(profile.flyTime * 0.32, { opacity: 80 })
            .start();
    }

    private playJumpCollectTween(flyNode: Node, toLocalPos: Vec3, complete: FlyCallback): void {
        stopNodeTweens(flyNode);

        const opacity = ensureOpacity(flyNode);
        const jump = { ratio: 0 };
        const start = clonePosition(flyNode.position);
        const control = new Vec3((start.x + toLocalPos.x) * 0.5, Math.max(start.y, toLocalPos.y) + 120, start.z);

        tween(flyNode)
            .to(0.7, { angle: flyNode.angle + 360, scale: new Vec3(0.4, 0.4, flyNode.scale.z) }, { easing: 'linear' })
            .call(complete)
            .start();

        tween(jump)
            .to(0.7, { ratio: 1 }, {
                easing: 'quadInOut',
                onUpdate: () => {
                    if (isValid(flyNode)) {
                        flyNode.setPosition(quadraticBezier(new Vec3(), start, control, toLocalPos, jump.ratio));
                    }
                },
            })
            .start();

        tween(opacity)
            .to(0.7, { opacity: 100 }, { easing: 'quadIn' })
            .start();
    }
}

export default CoinFlyToTargetAnim;
