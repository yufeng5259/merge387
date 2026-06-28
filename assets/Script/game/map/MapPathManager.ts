import { _decorator, Color, Component, Graphics, Node, UITransform, Vec2 } from 'cc';
import AStarPathfinder from './AStarPathfinder';
const { ccclass, property } = _decorator;

type GridPosition = { x: number; y: number };
type GridData = {
    width: number;
    height: number;
    cellSize: number;
    isWalkable: (x: number, y: number) => boolean;
    worldToGrid: (worldPos: { x: number; y: number }) => GridPosition;
    gridToWorld: (gridPos: GridPosition) => Vec2;
};

@ccclass('MapPathManager')
export class MapPathManager extends Component {
    @property
    public mapWidth = 50;
    @property
    public mapHeight = 50;
    @property
    public cellSize = 100;
    @property([Node])
    public obstacleNodes: Node[] = [];
    @property([Node])
    public pathNodes: Node[] = [];
    @property
    public showDebugGrid = false;
    @property(Color)
    public debugGridColor = Color.WHITE.clone();

    private gridData: GridData | null = null;
    private movableElements: any[] = [];
    private obstacleMap = new Map<string, boolean>();
    private pathMap = new Map<string, boolean>();

    onLoad() {
        this.gridData = null;
        this.movableElements = [];
        this.obstacleMap = new Map();
        this.pathMap = new Map();
        this.initGridData();
        this.updateObstacles();
        this.updatePaths();
    }

    start() {
        this.findMovableElements();
        if (this.showDebugGrid) {
            this.drawDebugGrid();
        }
    }

    initGridData() {
        this.gridData = {
            width: this.mapWidth,
            height: this.mapHeight,
            cellSize: this.cellSize,
            isWalkable: (x: number, y: number) => {
                if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
                    return false;
                }
                const key = `${x}_${y}`;
                if (this.obstacleMap.has(key)) {
                    return false;
                }
                if (this.pathMap.size > 0) {
                    return this.pathMap.has(key);
                }
                return true;
            },
            worldToGrid: (worldPos: { x: number; y: number }) => {
                const x = Math.floor((worldPos.x + this.mapWidth * this.cellSize / 2) / this.cellSize);
                const y = Math.floor((worldPos.y + this.mapHeight * this.cellSize / 2) / this.cellSize);
                return { x, y };
            },
            gridToWorld: (gridPos: GridPosition) => {
                const x = (gridPos.x + 0.5) * this.cellSize - this.mapWidth * this.cellSize / 2;
                const y = (gridPos.y + 0.5) * this.cellSize - this.mapHeight * this.cellSize / 2;
                return new Vec2(x, y);
            },
        };
    }

    updateObstacles() {
        this.ensureGridData();
        this.obstacleMap.clear();
        for (const obstacleNode of this.obstacleNodes) {
            if (!obstacleNode || !obstacleNode.isValid) {
                continue;
            }
            const worldPos = obstacleNode.position;
            const gridPos = this.gridData!.worldToGrid(worldPos);
            const transform = obstacleNode.getComponent(UITransform);
            const width = transform ? transform.width : this.cellSize;
            const height = transform ? transform.height : this.cellSize;
            const gridWidth = Math.ceil(width / this.cellSize);
            const gridHeight = Math.ceil(height / this.cellSize);
            for (let dx = 0; dx < gridWidth; dx++) {
                for (let dy = 0; dy < gridHeight; dy++) {
                    const x = gridPos.x + dx - Math.floor(gridWidth / 2);
                    const y = gridPos.y + dy - Math.floor(gridHeight / 2);
                    this.obstacleMap.set(`${x}_${y}`, true);
                }
            }
        }
    }

    updatePaths() {
        this.ensureGridData();
        this.pathMap.clear();
        for (const pathNode of this.pathNodes) {
            if (!pathNode || !pathNode.isValid) {
                continue;
            }
            const gridPos = this.gridData!.worldToGrid(pathNode.position);
            this.pathMap.set(`${gridPos.x}_${gridPos.y}`, true);
        }
    }

    findMovableElements() {
        this.movableElements = [];
        const components = this.node.getComponentsInChildren(Component);
        for (const component of components) {
            const movableElement = component as any;
            if (movableElement && movableElement.moveTo && movableElement.pause && movableElement.resume) {
                this.movableElements.push(movableElement);
            }
        }
    }

    addMovableElement(element: any) {
        if (this.movableElements.indexOf(element) === -1) {
            this.movableElements.push(element);
        }
    }

    removeMovableElement(element: any) {
        const index = this.movableElements.indexOf(element);
        if (index !== -1) {
            this.movableElements.splice(index, 1);
        }
    }

    getGridData() {
        this.ensureGridData();
        return this.gridData;
    }

    setObstacle(worldPos: any, isObstacle = true) {
        this.ensureGridData();
        const gridPos = this.gridData!.worldToGrid(worldPos);
        const key = `${gridPos.x}_${gridPos.y}`;
        if (isObstacle) {
            this.obstacleMap.set(key, true);
        } else {
            this.obstacleMap.delete(key);
        }
    }

    setPath(worldPos: any, isPath = true) {
        this.ensureGridData();
        const gridPos = this.gridData!.worldToGrid(worldPos);
        const key = `${gridPos.x}_${gridPos.y}`;
        if (isPath) {
            this.pathMap.set(key, true);
        } else {
            this.pathMap.delete(key);
        }
    }

    findPath(start: any, end: any, options: any = {}) {
        this.ensureGridData();
        return AStarPathfinder.findPath(this.gridData, start, end, options);
    }

    drawDebugGrid() {
        const debugNode = new Node('DebugGrid');
        debugNode.parent = this.node;
        debugNode.setSiblingIndex(this.node.children.length - 1);
        const graphics = debugNode.addComponent(Graphics);
        graphics.strokeColor = this.debugGridColor;
        graphics.lineWidth = 1;

        for (let x = 0; x <= this.mapWidth; x++) {
            const worldX = x * this.cellSize - this.mapWidth * this.cellSize / 2;
            graphics.moveTo(worldX, -this.mapHeight * this.cellSize / 2);
            graphics.lineTo(worldX, this.mapHeight * this.cellSize / 2);
        }
        for (let y = 0; y <= this.mapHeight; y++) {
            const worldY = y * this.cellSize - this.mapHeight * this.cellSize / 2;
            graphics.moveTo(-this.mapWidth * this.cellSize / 2, worldY);
            graphics.lineTo(this.mapWidth * this.cellSize / 2, worldY);
        }
        graphics.stroke();
    }

    refresh() {
        this.updateObstacles();
        this.updatePaths();
        this.findMovableElements();
    }

    private ensureGridData() {
        if (!this.gridData) {
            this.initGridData();
        }
    }
}
