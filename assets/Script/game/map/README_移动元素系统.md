# 地图移动元素系统使用说明

## 概述

这个系统为地图添加了移动元素功能，支持汽车、人物等元素在地图上沿着路径移动。系统使用A*算法进行路径查找，可以自动避开障碍物。

## 核心组件

### 1. AStarPathfinder (A*路径查找算法)
- **文件**: `AStarPathfinder.js`
- **功能**: 实现A*路径查找算法，用于在地图上查找从起点到终点的最优路径
- **主要方法**:
  - `findPath(grid, start, end, options)`: 查找路径
  - `simplifyPath(path)`: 简化路径，移除不必要的中间点

### 2. PathFollower (路径跟随组件)
- **文件**: `PathFollower.js`
- **功能**: 让节点沿着指定路径移动
- **属性**:
  - `speed`: 移动速度（像素/秒）
  - `loop`: 是否循环移动
  - `arrivalThreshold`: 到达目标点的距离阈值

### 3. MovableElement (可移动元素组件)
- **文件**: `MovableElement.js`
- **功能**: 可移动元素的基类，支持汽车、人物等
- **属性**:
  - `elementType`: 元素类型（car/person/animal等）
  - `moveSpeed`: 移动速度
  - `autoPathfinding`: 是否自动寻路
  - `waypoints`: 路径点数组

### 4. MapPathManager (地图路径管理器)
- **文件**: `MapPathManager.js`
- **功能**: 管理地图上的所有移动元素和路径系统
- **属性**:
  - `mapWidth/Height`: 地图尺寸（格子数）
  - `cellSize`: 每个格子的大小（像素）
  - `obstacleNodes`: 障碍物节点数组
  - `pathNodes`: 路径节点数组

## 使用方法

### 步骤1: 设置地图路径管理器

1. 在地图根节点上添加 `MapPathManager` 组件
2. 配置地图参数：
   - `mapWidth`: 地图宽度（格子数）
   - `mapHeight`: 地图高度（格子数）
   - `cellSize`: 每个格子的大小（像素，默认100）

### 步骤2: 定义障碍物和路径

**方式1: 使用节点数组**
- 将障碍物节点拖入 `obstacleNodes` 数组
- 将路径节点拖入 `pathNodes` 数组

**方式2: 代码设置**
```javascript
const mapPathManager = mapNode.getComponent("MapPathManager");
mapPathManager.setObstacle(cc.v2(100, 200), true); // 设置障碍物
mapPathManager.setPath(cc.v2(300, 400), true); // 设置路径
```

### 步骤3: 创建移动元素

1. 创建一个节点（如汽车、人物）
2. 添加 `MovableElement` 组件
3. 配置属性：
   - `elementType`: 设置为 "car" 或 "person" 等
   - `moveSpeed`: 设置移动速度
   - `autoPathfinding`: 是否使用A*寻路

### 步骤4: 控制移动

**方式1: 移动到指定位置（自动寻路）**
```javascript
const movableElement = carNode.getComponent("MovableElement");
movableElement.moveTo(cc.v2(500, 600), () => {
    console.log("到达目标位置");
});
```

**方式2: 使用预设路径点**
```javascript
const movableElement = carNode.getComponent("MovableElement");
movableElement.moveToWaypoints([
    cc.v2(100, 100),
    cc.v2(200, 200),
    cc.v2(300, 300)
]);
```

**方式3: 直接移动（不使用寻路）**
```javascript
movableElement.moveDirectly(cc.v2(500, 600));
```

## 高级功能

### 路径简化
系统会自动简化路径，移除不必要的中间点，使移动更平滑。

### 循环移动
设置 `loopMovement` 为 true，元素会在路径上循环移动。

### 动态障碍物
可以在运行时动态添加或移除障碍物：
```javascript
mapPathManager.setObstacle(cc.v2(100, 200), true); // 添加障碍物
mapPathManager.setObstacle(cc.v2(100, 200), false); // 移除障碍物
mapPathManager.refresh(); // 刷新
```

### 调试网格
在编辑器中设置 `showDebugGrid` 为 true，可以显示网格线，方便调试。

## 算法说明

### A*算法
- **启发式函数**: 支持曼哈顿距离、欧几里得距离、对角线距离
- **移动方式**: 支持4方向或8方向移动
- **性能优化**: 使用路径简化减少不必要的路径点

### 路径查找流程
1. 将世界坐标转换为网格坐标
2. 使用A*算法查找路径
3. 简化路径，移除冗余点
4. 返回世界坐标路径点数组

## 注意事项

1. **网格大小**: 确保 `cellSize` 与实际地图比例匹配
2. **障碍物大小**: 大障碍物会自动标记多个格子
3. **路径定义**: 如果定义了 `pathNodes`，元素只能在路径上移动
4. **性能**: 对于大地图，建议合理设置网格大小，避免网格过细

## 示例场景

### 汽车沿着道路移动
1. 创建道路节点，添加到 `pathNodes`
2. 创建汽车节点，添加 `MovableElement` 组件
3. 设置汽车的起点和终点，调用 `moveTo()`

### 人物巡逻
1. 创建多个路径点
2. 设置 `loopMovement` 为 true
3. 使用 `moveToWaypoints()` 设置巡逻路径




