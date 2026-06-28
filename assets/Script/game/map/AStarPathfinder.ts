import { _decorator, Component, Vec2 } from 'cc';
const { ccclass } = _decorator;

type GridPos = { x: number; y: number };
type PathNode = GridPos & {
    g: number;
    h: number;
    f: number;
    parent: PathNode | null;
};

@ccclass('AStarPathfinder')
export class AStarPathfinder extends Component {
    static findPath (grid: any, start: any, end: any, options: any = {}) {
        const allowDiagonal = options.allowDiagonal !== false;
        const heuristic = options.heuristic || 'manhattan';

        const startNode = this.worldToGrid(start, grid);
        const endNode = this.worldToGrid(end, grid);
        if (!startNode || !endNode) return [];
        if (startNode.x === endNode.x && startNode.y === endNode.y) return [start];
        if (!grid.isWalkable(endNode.x, endNode.y)) return [];

        const openList: string[] = [];
        const closedList = new Set<string>();
        const nodeData = new Map<string, PathNode>();
        const startKey = this.getNodeKey(startNode);
        const startData: PathNode = {
            x: startNode.x,
            y: startNode.y,
            g: 0,
            h: this.calculateHeuristic(startNode, endNode, heuristic),
            f: 0,
            parent: null,
        };
        startData.f = startData.g + startData.h;
        nodeData.set(startKey, startData);
        openList.push(startKey);

        while (openList.length > 0) {
            let currentKey = openList[0];
            let currentIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                const key = openList[i];
                const data = nodeData.get(key)!;
                const currentData = nodeData.get(currentKey)!;
                if (data.f < currentData.f || (data.f === currentData.f && data.h < currentData.h)) {
                    currentKey = key;
                    currentIndex = i;
                }
            }

            openList.splice(currentIndex, 1);
            closedList.add(currentKey);
            const current = nodeData.get(currentKey)!;
            if (current.x === endNode.x && current.y === endNode.y) {
                const path = [];
                let node: PathNode | null = current;
                while (node) {
                    path.unshift(this.gridToWorld({ x: node.x, y: node.y }, grid));
                    node = node.parent;
                }
                return path;
            }

            const neighbors = this.getNeighbors(current, grid, allowDiagonal);
            for (const neighbor of neighbors) {
                const neighborKey = this.getNodeKey(neighbor);
                if (closedList.has(neighborKey)) continue;

                const moveCost = neighbor.x !== current.x && neighbor.y !== current.y ? 1.414 : 1;
                const g = current.g + moveCost;
                let neighborData = nodeData.get(neighborKey);
                if (!neighborData) {
                    neighborData = {
                        x: neighbor.x,
                        y: neighbor.y,
                        g,
                        h: this.calculateHeuristic(neighbor, endNode, heuristic),
                        f: 0,
                        parent: current,
                    };
                    neighborData.f = neighborData.g + neighborData.h;
                    nodeData.set(neighborKey, neighborData);
                    openList.push(neighborKey);
                } else if (g < neighborData.g) {
                    neighborData.g = g;
                    neighborData.f = neighborData.g + neighborData.h;
                    neighborData.parent = current;
                }
            }
        }

        return [];
    }

    static getNeighbors (node: GridPos, grid: any, allowDiagonal: boolean) {
        const neighbors: GridPos[] = [];
        const directions: GridPos[] = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
        ];
        if (allowDiagonal) {
            directions.push(
                { x: 1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: -1 },
                { x: -1, y: 1 },
            );
        }

        for (const dir of directions) {
            const x = node.x + dir.x;
            const y = node.y + dir.y;
            if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) continue;
            if (!grid.isWalkable(x, y)) continue;
            if (dir.x !== 0 && dir.y !== 0) {
                if (!grid.isWalkable(node.x + dir.x, node.y) || !grid.isWalkable(node.x, node.y + dir.y)) continue;
            }
            neighbors.push({ x, y });
        }
        return neighbors;
    }

    static calculateHeuristic (node: GridPos, end: GridPos, type: string) {
        const dx = Math.abs(node.x - end.x);
        const dy = Math.abs(node.y - end.y);
        switch (type) {
            case 'euclidean':
                return Math.sqrt(dx * dx + dy * dy);
            case 'diagonal':
                return Math.max(dx, dy);
            case 'manhattan':
            default:
                return dx + dy;
        }
    }

    static worldToGrid (worldPos: any, grid: any) {
        if (grid.worldToGrid) return grid.worldToGrid(worldPos);
        const cellSize = grid.cellSize || 100;
        const x = Math.floor((worldPos.x + grid.width * cellSize / 2) / cellSize);
        const y = Math.floor((worldPos.y + grid.height * cellSize / 2) / cellSize);
        return { x, y };
    }

    static gridToWorld (gridPos: GridPos, grid: any) {
        if (grid.gridToWorld) return grid.gridToWorld(gridPos);
        const cellSize = grid.cellSize || 100;
        const x = (gridPos.x + 0.5) * cellSize - grid.width * cellSize / 2;
        const y = (gridPos.y + 0.5) * cellSize - grid.height * cellSize / 2;
        return new Vec2(x, y);
    }

    static getNodeKey (node: GridPos) {
        return `${node.x}_${node.y}`;
    }

    static simplifyPath (path: any[]) {
        if (path.length <= 2) return path;
        const simplified = [path[0]];
        let lastDir: any = null;
        for (let i = 1; i < path.length - 1; i++) {
            const dir = path[i].subtract(path[i - 1]).normalize();
            const nextDir = path[i + 1].subtract(path[i]).normalize();
            if (!lastDir || !dir.equals(nextDir, 0.01)) {
                simplified.push(path[i]);
                lastDir = dir;
            }
        }
        simplified.push(path[path.length - 1]);
        return simplified;
    }
}

export default AStarPathfinder;
