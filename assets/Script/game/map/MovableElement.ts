import { _decorator, Component, find, Vec2, Vec3 } from 'cc';
import AStarPathfinder from './AStarPathfinder';
import PathFollower from './PathFollower';
const { ccclass, property } = _decorator;

@ccclass('MovableElement')
export class MovableElement extends Component {
    @property
    public elementType = 'car';
    @property
    public moveSpeed = 200;
    @property
    public autoPathfinding = true;
    @property
    public loopMovement = false;
    @property([Vec2])
    public waypoints: Vec2[] = [];

    public onMoveComplete: (() => void) | null = null;

    private pathFollower: PathFollower | null = null;
    private gridData: any = null;
    private mapPathManager: any = null;

    onLoad() {
        this.pathFollower = this.getComponent(PathFollower);
        if (!this.pathFollower) {
            this.pathFollower = this.addComponent(PathFollower);
        }
        this.pathFollower.speed = this.moveSpeed;
        this.pathFollower.loop = this.loopMovement;
        this.gridData = null;
        this.mapPathManager = null;
    }

    start() {
        this.findMapPathManager();
        if (this.waypoints.length > 0) {
            this.moveToWaypoints(this.waypoints);
        }
    }

    findMapPathManager() {
        let parent = this.node.parent;
        while (parent) {
            this.mapPathManager = parent.getComponent('MapPathManager');
            if (this.mapPathManager) {
                this.gridData = this.mapPathManager.getGridData();
                break;
            }
            parent = parent.parent;
        }
        if (!this.mapPathManager) {
            const mapNode = find('Canvas/MapNode') || find('MapNode');
            if (mapNode) {
                this.mapPathManager = mapNode.getComponent('MapPathManager');
                if (this.mapPathManager) {
                    this.gridData = this.mapPathManager.getGridData();
                }
            }
        }
    }

    moveTo(targetPos: Vec2 | Vec3, onComplete: ((success: boolean) => void) | null = null) {
        if (!this.pathFollower) {
            return;
        }
        if (!this.autoPathfinding || !this.gridData) {
            this.moveDirectly(targetPos, onComplete);
            return;
        }
        const startPos = this.node.position;
        const path = AStarPathfinder.findPath(this.gridData, startPos, targetPos, {
            allowDiagonal: true,
            heuristic: 'manhattan',
        });
        if (path.length === 0) {
            console.warn('MovableElement: path not found', startPos, targetPos);
            if (onComplete) {
                onComplete(false);
            }
            return;
        }
        const simplifiedPath = AStarPathfinder.simplifyPath(path);
        this.pathFollower.setPath(simplifiedPath, () => {
            if (onComplete) {
                onComplete(true);
            }
            if (this.onMoveComplete) {
                this.onMoveComplete();
            }
        });
    }

    moveDirectly(targetPos: Vec2 | Vec3, onComplete: ((success: boolean) => void) | null = null) {
        if (!this.pathFollower) {
            return;
        }
        const path = [this.node.position, targetPos];
        this.pathFollower.setPath(path, () => {
            if (onComplete) {
                onComplete(true);
            }
            if (this.onMoveComplete) {
                this.onMoveComplete();
            }
        });
    }

    moveToWaypoints(waypoints: (Vec2 | Vec3)[]) {
        if (!this.pathFollower || !waypoints || waypoints.length === 0) {
            return;
        }
        const fullPath: (Vec2 | Vec3)[] = [this.node.position];
        for (const waypoint of waypoints) {
            if (this.autoPathfinding && this.gridData && fullPath.length > 0) {
                const start = fullPath[fullPath.length - 1];
                const path = AStarPathfinder.findPath(this.gridData, start, waypoint, {
                    allowDiagonal: true,
                    heuristic: 'manhattan',
                });
                if (path.length > 0) {
                    fullPath.push(...path.slice(1));
                }
            } else {
                fullPath.push(waypoint);
            }
        }
        if (fullPath.length > 1) {
            this.pathFollower.setPath(fullPath, () => {
                if (this.onMoveComplete) {
                    this.onMoveComplete();
                }
            });
        }
    }

    stop() {
        if (this.pathFollower) {
            this.pathFollower.stop();
        }
    }

    pause() {
        if (this.pathFollower) {
            this.pathFollower.pause();
        }
    }

    resume() {
        if (this.pathFollower) {
            this.pathFollower.resume();
        }
    }

    setSpeed(speed: number) {
        this.moveSpeed = speed;
        if (this.pathFollower) {
            this.pathFollower.setSpeed(speed);
        }
    }

    getElementType() {
        return this.elementType;
    }
}

export default MovableElement;
