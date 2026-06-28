import { _decorator, Component, find, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapPathExample')
export class MapPathExample extends Component {
    @property(Node)
    public mapPathManagerNode: Node | null = null;
    @property(Node)
    public carNode: Node | null = null;
    @property(Node)
    public personNode: Node | null = null;

    private mapPathManager: any = null;

    onLoad() {
        this.mapPathManager = null;
        if (this.mapPathManagerNode) {
            this.mapPathManager = this.mapPathManagerNode.getComponent('MapPathManager');
        } else {
            const mapNode = find('Canvas/MapNode') || find('MapNode');
            if (mapNode) {
                this.mapPathManager = mapNode.getComponent('MapPathManager');
            }
        }
    }

    start() {
        this.example1_CarMoveToTarget();
    }

    example1_CarMoveToTarget() {
        if (!this.carNode) {
            console.warn('MapPathExample: carNode is not set');
            return;
        }
        const movableElement = this.carNode.getComponent('MovableElement') as any;
        if (!movableElement) {
            console.warn('MapPathExample: carNode missing MovableElement');
            return;
        }
        const targetPos = new Vec2(500, 600);
        movableElement.moveTo(targetPos, (success: boolean) => {
            if (success) {
                console.log('MapPathExample: car reached target');
            } else {
                console.warn('MapPathExample: car cannot reach target');
            }
        });
    }

    example2_PersonMoveAlongWaypoints() {
        if (!this.personNode) {
            console.warn('MapPathExample: personNode is not set');
            return;
        }
        const movableElement = this.personNode.getComponent('MovableElement') as any;
        if (!movableElement) {
            console.warn('MapPathExample: personNode missing MovableElement');
            return;
        }
        const waypoints = [
            new Vec2(100, 100),
            new Vec2(200, 200),
            new Vec2(300, 300),
            new Vec2(400, 400),
        ];
        movableElement.moveToWaypoints(waypoints);
    }

    example3_DynamicObstacle() {
        if (!this.mapPathManager) {
            console.warn('MapPathExample: MapPathManager not found');
            return;
        }
        const obstaclePos = new Vec2(300, 400);
        this.mapPathManager.setObstacle(obstaclePos, true);
        this.mapPathManager.refresh();
        console.log('MapPathExample: obstacle added', obstaclePos);
        this.scheduleOnce(() => {
            this.mapPathManager.setObstacle(obstaclePos, false);
            this.mapPathManager.refresh();
            console.log('MapPathExample: obstacle removed');
        }, 3);
    }

    example4_FindPath() {
        if (!this.mapPathManager) {
            console.warn('MapPathExample: MapPathManager not found');
            return;
        }
        const start = new Vec2(0, 0);
        const end = new Vec2(500, 600);
        const path = this.mapPathManager.findPath(start, end, {
            allowDiagonal: true,
            heuristic: 'manhattan',
        });
        if (path.length > 0) {
            console.log('MapPathExample: path found', path.length);
        } else {
            console.warn('MapPathExample: path not found');
        }
    }

    example5_ControlMovement() {
        if (!this.carNode) {
            return;
        }
        const movableElement = this.carNode.getComponent('MovableElement') as any;
        if (!movableElement) {
            return;
        }
        movableElement.pause();
        this.scheduleOnce(() => {
            movableElement.resume();
        }, 2);
    }
}
