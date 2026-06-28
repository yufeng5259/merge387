import { _decorator, Component, Node, tween, Tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

function toVec3(pos: Vec2 | Vec3 | any) {
    return pos instanceof Vec3 ? pos.clone() : new Vec3(pos.x || 0, pos.y || 0, pos.z || 0);
}

@ccclass('PathFollower')
export class PathFollower extends Component {
    @property
    public speed = 200;
    @property
    public loop = false;
    @property
    public arrivalThreshold = 5;
    @property
    public autoStart = false;

    public onPathComplete: (() => void) | null = null;

    private currentPath: (Vec2 | Vec3)[] = [];
    private currentTargetIndex = 0;
    private isMoving = false;
    private moveTween: Tween<Node> | null = null;

    onLoad() {
        this.currentPath = [];
        this.currentTargetIndex = 0;
        this.isMoving = false;
        this.moveTween = null;
    }

    start() {
        if (this.autoStart && this.currentPath.length > 0) {
            this.startMove();
        }
    }

    setPath(path: (Vec2 | Vec3)[], onComplete: (() => void) | null = null) {
        if (!path || path.length === 0) {
            console.warn('PathFollower: path is empty');
            return;
        }
        this.currentPath = path;
        this.currentTargetIndex = 0;
        this.onPathComplete = onComplete;
        this.startMove();
    }

    startMove() {
        if (this.currentPath.length === 0) {
            return;
        }
        this.isMoving = true;
        this.moveToNextPoint();
    }

    moveToNextPoint() {
        if (this.currentTargetIndex >= this.currentPath.length) {
            this.isMoving = false;
            if (this.loop) {
                this.currentTargetIndex = 0;
                this.scheduleOnce(() => {
                    this.startMove();
                }, 0.1);
            } else if (this.onPathComplete) {
                this.onPathComplete();
                this.onPathComplete = null;
            }
            return;
        }

        const targetPos = toVec3(this.currentPath[this.currentTargetIndex]);
        const currentPos = this.node.position.clone();
        const distance = currentPos.clone().subtract(targetPos).length();
        if (distance < this.arrivalThreshold) {
            this.currentTargetIndex++;
            this.moveToNextPoint();
            return;
        }

        const moveTime = distance / this.speed;
        const direction = targetPos.clone().subtract(currentPos);
        this.node.angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
        if (this.moveTween) {
            Tween.stopAllByTarget(this.node);
        }
        this.moveTween = tween(this.node)
            .to(moveTime, { position: targetPos }, { easing: 'linear' })
            .call(() => {
                this.currentTargetIndex++;
                this.moveToNextPoint();
            })
            .start();
    }

    stop() {
        this.isMoving = false;
        if (this.moveTween) {
            Tween.stopAllByTarget(this.node);
            this.moveTween = null;
        }
    }

    pause() {
        if (this.moveTween) {
            Tween.stopAllByTarget(this.node);
            this.moveTween = null;
        }
    }

    resume() {
        if (this.isMoving && this.currentPath.length > 0) {
            this.moveToNextPoint();
        }
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    getCurrentPath() {
        return this.currentPath;
    }

    getIsMoving() {
        return this.isMoving;
    }

    onDestroy() {
        this.stop();
    }
}

export default PathFollower;
