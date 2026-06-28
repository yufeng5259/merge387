import { _decorator, Component, instantiate, Node, Prefab, SpriteAtlas, UITransform, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, executeInEditMode, property } = _decorator;

declare const Editor: any;

type IconToIdMap = { [iconName: string]: number };

function editorLog(method: 'log' | 'warn' | 'error', ...args: any[]) {
    if (typeof Editor !== 'undefined' && Editor && Editor[method]) {
        Editor[method](...args);
    } else if (console && console[method]) {
        console[method](...args);
    }
}

function getNodeModule(name: string): any {
    if (!EDITOR) return null;
    try {
        const req = (globalThis as any).__non_webpack_require__ || (globalThis as any).require || (0, eval)('require');
        return req ? req(name) : null;
    } catch (error) {
        return null;
    }
}

function getProjectPath(): string {
    if (typeof Editor === 'undefined' || !Editor) return '';
    if (Editor.remote && Editor.remote.projectPath) return Editor.remote.projectPath;
    if (Editor.Project && Editor.Project.path) return Editor.Project.path;
    if (Editor.projectPath) return Editor.projectPath;
    return '';
}

function loadMergeJsonData(jsonFilePath: string): any {
    if (!EDITOR) {
        throw new Error('Cannot load JSON outside the editor.');
    }

    const fs = getNodeModule('fs');
    const path = getNodeModule('path');
    if (!fs || !path) {
        throw new Error('Node fs/path modules are unavailable.');
    }

    const inputPath = (jsonFilePath || '').trim();
    if (!inputPath) {
        throw new Error('Please set jsonFilePath first.');
    }

    const candidatePaths: string[] = [];
    if (path.isAbsolute(inputPath)) {
        candidatePaths.push(inputPath);
    } else {
        const projectPath = getProjectPath();
        if (!projectPath) {
            throw new Error('Cannot resolve project path for JSON file.');
        }
        candidatePaths.push(path.resolve(projectPath, inputPath));
    }

    let fullPath = '';
    for (let i = 0; i < candidatePaths.length; i++) {
        const candidate = candidatePaths[i];
        if (candidate && fs.existsSync(candidate)) {
            fullPath = candidate;
            break;
        }
    }

    if (!fullPath) {
        throw new Error('JSON file does not exist: ' + inputPath);
    }

    editorLog('log', '[LevelMergeItemEditor] JSON:', fullPath);
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function addMergeElementToMap(map: IconToIdMap, key: string, value: any) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (value.icon && value.id !== undefined) {
            map[value.icon] = Number(value.id);
        }
        return;
    }

    if (Array.isArray(value) && value.length >= 3) {
        const id = key !== '' && !Number.isNaN(Number(key)) ? Number(key) : Number(value[0]);
        const icon = value[2];
        if (icon && id !== undefined && !Number.isNaN(id)) {
            map[icon] = id;
        }
    }
}

function getComponentByClassName(node: Node | null, className: string): any {
    if (!node) return null;
    const named = node.getComponent(className) as any;
    if (named) return named;

    const components = (node as any)._components || [];
    for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        const ctor = comp && comp.constructor;
        const compName = ctor && (ctor.name || ctor.__className__);
        if (compName === className) return comp;
    }
    return null;
}

@ccclass('LevelMergeItemEditor')
@executeInEditMode
export class LevelMergeItemEditor extends Component {
    @property
    public doItemCheck = false;

    @property(SpriteAtlas)
    public iconAtlas: SpriteAtlas | null = null;

    @property
    public doChangeIconAtlas = false;

    @property(SpriteAtlas)
    public envIconAtlas: SpriteAtlas | null = null;

    @property
    public doChangeEnvIconAtlas = false;

    @property(Prefab)
    public mergeItemTemple: Prefab | null = null;

    @property
    public doChangeMergeItem = false;

    @property(Node)
    public mergeItemParent: Node | null = null;

    @property
    public addMergeRow = 0;

    @property
    public addMergeItemRow = false;

    @property
    public addMergeColumn = 0;

    @property
    public addMergeItemColumn = false;

    @property
    public doClearMergeItems = false;

    @property
    public jsonFilePath = 'meta_dev/meta_client.json';

    @property
    public loadJsonData = false;

    public static _iconToIdMap: IconToIdMap | null = null;
    public static _instance: LevelMergeItemEditor | null = null;

    private checkMap: { [key: string]: Node } = {};

    public static findIdByIconName(iconName: any) {
        if (!this._iconToIdMap || !iconName) return 0;
        const mergeId = this._iconToIdMap[iconName];
        return mergeId !== undefined ? mergeId : 0;
    }

    public static getIconToIdMap() {
        return this._iconToIdMap;
    }

    public static isDataLoaded() {
        return this._iconToIdMap !== null && this._iconToIdMap !== undefined;
    }

    public static getInstance() {
        return this._instance;
    }

    changeIconAtlas() {
        if (!EDITOR) return;
        if (!this.iconAtlas) {
            editorLog('warn', 'Please set iconAtlas first.');
            return;
        }

        const levelMergeNode = this._getLevelMergeNodeComponent();
        if (levelMergeNode) {
            levelMergeNode.iconAtlas = this.iconAtlas;
        }

        const comps = this.node.getComponentsInChildren('MergeItemEditor') as any[];
        for (let i = 0; i < comps.length; i++) {
            comps[i].iconAtlas = this.iconAtlas;
            comps[i].additionIconAtlas = this.iconAtlas;
        }
        editorLog('log', 'Updated MergeItemEditor iconAtlas count:', comps.length);
    }

    changeEnvIconAtlas() {
        if (!EDITOR) return;
        if (!this.envIconAtlas) {
            editorLog('warn', 'Please set envIconAtlas first.');
            return;
        }

        const levelMergeNode = this._getLevelMergeNodeComponent();
        if (levelMergeNode) {
            levelMergeNode.envIconAtlas = this.envIconAtlas;
        }

        const comps = this.node.getComponentsInChildren('MergeItemEditor') as any[];
        for (let i = 0; i < comps.length; i++) {
            comps[i].envIconAtlas = this.envIconAtlas;
        }
        editorLog('log', 'Updated MergeItemEditor envIconAtlas count:', comps.length);
    }

    _getLevelMergeNodeComponent() {
        if (!EDITOR || !this.node) return null;

        const candidates: Node[] = [this.node];
        if (this.node.parent) candidates.push(this.node.parent);
        for (let i = 0; i < this.node.children.length; i++) {
            candidates.push(this.node.children[i]);
        }

        for (let i = 0; i < candidates.length; i++) {
            const component = getComponentByClassName(candidates[i], 'LevelMergeNode');
            if (component) return component;
        }
        return null;
    }

    changeMergeItem() {
        if (!this.mergeItemTemple || !this.mergeItemParent) return;

        const itemChildren = this.node.children.filter((child) => !!getComponentByClassName(child, 'MergeItem'));
        const items: any[] = [];
        for (let i = 0; i < itemChildren.length; i++) {
            const child = itemChildren[i];
            const item = getComponentByClassName(child, 'MergeItem');
            const editorItem = getComponentByClassName(child, 'MergeItemEditor');
            items.push({
                name: child.name,
                active: child.active,
                position: child.position.clone(),
                mergeData: item && item.GetMergeData ? item.GetMergeData() : '',
                mergeId: item ? item.mergeId : 0,
                envStatus: item ? item.envStatus : -1,
                addtionId: item ? item.addtionId : -1,
                editorItem: editorItem ? {
                    iconId: editorItem.iconId,
                    iconAtlas: editorItem.iconAtlas,
                    iconFrames: editorItem.iconFrames,
                    showEnv: editorItem.showEnv,
                    envStatus: editorItem.envStatus,
                    envIconAtlas: editorItem.envIconAtlas,
                    envIconFrames: editorItem.envIconFrames,
                    showAddition: editorItem.showAddition,
                    additionId: editorItem.additionId,
                    additionIconAtlas: editorItem.additionIconAtlas,
                    additionIconFrames: editorItem.additionIconFrames,
                } : null,
            });
            child.removeFromParent();
        }

        for (let i = 0; i < items.length; i++) {
            const data = items[i];
            const child = instantiate(this.mergeItemTemple);
            child.name = data.name || 'merge_item_' + i;
            child.active = data.active;
            child.setPosition(data.position);

            const item = getComponentByClassName(child, 'MergeItem');
            if (item) {
                if (data.mergeData && item.SetMergeData) {
                    item.SetMergeData(data.mergeData);
                } else {
                    item.mergeId = data.mergeId;
                    item.envStatus = data.envStatus;
                    item.addtionId = data.addtionId;
                }
            }

            const editorItem = getComponentByClassName(child, 'MergeItemEditor');
            if (editorItem && data.editorItem) {
                Object.assign(editorItem, data.editorItem);
            }

            this.mergeItemParent.addChild(child);
            this.checkMap[child.name] = child;
        }
    }

    clearMergeItem() {
        this.checkMap = {};
        if (this.mergeItemParent) {
            this.mergeItemParent.removeAllChildren();
        }
    }

    addRow() {
        if (!this.mergeItemTemple || !this.mergeItemParent || !GameKit || !GameKit.MergeUtil) return;
        const gridSize = GameKit.MergeUtil.DEFAULT_GRID_SIZE;
        const row = this.addMergeRow;
        for (let x = 0; x < gridSize.x; x++) {
            this.addMergeItemAt(x, row);
        }
    }

    addColumn() {
        if (!this.mergeItemTemple || !this.mergeItemParent || !GameKit || !GameKit.MergeUtil) return;
        const gridSize = GameKit.MergeUtil.DEFAULT_GRID_SIZE;
        const column = this.addMergeColumn;
        for (let y = 0; y < gridSize.y; y++) {
            this.addMergeItemAt(column, y);
        }
    }

    do_merge_check() {
        if (!GameKit || !GameKit.MergeUtil) return;

        this.checkMap = {};
        const itemChildren = (this.mergeItemParent || this.node).children.filter((child) => !!getComponentByClassName(child, 'MergeItem'));
        for (let i = 0; i < itemChildren.length; i++) {
            const child = itemChildren[i];
            const p = child.position;
            const tp = GameKit.MergeUtil.px2tile(p.x, p.y, GameKit.MergeUtil.DEFAULT_BOARD_LAYOUT);
            const key = tp.x + '_' + tp.y;
            if (this.checkMap[key]) {
                editorLog('log', child.name, 'duplicate merge item:', key);
                child.removeFromParent();
                continue;
            }
            child.name = key;
            this.checkMap[key] = child;
            const p2 = GameKit.MergeUtil.tile2px(tp.x, tp.y, GameKit.MergeUtil.DEFAULT_BOARD_LAYOUT);
            child.setPosition(new Vec3(p2.x, p2.y, 0));
        }

        const transform = this.node.getComponent(UITransform);
        const layout = GameKit.MergeUtil.DEFAULT_BOARD_LAYOUT;
        if (transform && layout && layout.nodeSize) {
            transform.setContentSize(layout.nodeSize.x, layout.nodeSize.y);
        }

        const children = (this.mergeItemParent || this.node).children.slice();
        children.sort((a, b) => a.name.localeCompare(b.name));
        for (let i = 0; i < children.length; i++) {
            children[i].setSiblingIndex(i);
        }
    }

    onLoad() {
        this.checkMap = {};
        if (EDITOR) {
            LevelMergeItemEditor._instance = this;
        }
    }

    start() {
        if (!EDITOR) return;
        setTimeout(() => {
            if (this.jsonFilePath) {
                this.loadJsonFile();
            }
        }, 150);
    }

    loadJsonFile() {
        if (!EDITOR) return;
        if (!this.jsonFilePath) {
            editorLog('warn', 'Please set jsonFilePath first.');
            return;
        }

        try {
            const jsonData = loadMergeJsonData(this.jsonFilePath);
            const map: IconToIdMap = {};
            const mergeElements = jsonData && jsonData.mergeElements;
            if (Array.isArray(mergeElements)) {
                for (let i = 0; i < mergeElements.length; i++) {
                    addMergeElementToMap(map, '', mergeElements[i]);
                }
            } else if (mergeElements && typeof mergeElements === 'object') {
                for (const key in mergeElements) {
                    if (Object.prototype.hasOwnProperty.call(mergeElements, key)) {
                        addMergeElementToMap(map, key, mergeElements[key]);
                    }
                }
            }
            LevelMergeItemEditor._iconToIdMap = map;
            editorLog('log', 'Loaded mergeElements:', Object.keys(map).length);
        } catch (error: any) {
            editorLog('error', 'Failed to load JSON:', error && error.message ? error.message : error);
            LevelMergeItemEditor._iconToIdMap = {};
        }
    }

    private addMergeItemAt(x: number, y: number) {
        if (!this.mergeItemTemple || !this.mergeItemParent || !GameKit || !GameKit.MergeUtil) return;
        const key = x + '_' + y;
        if (this.checkMap[key]) return;

        const child = instantiate(this.mergeItemTemple);
        child.name = key;
        child.active = true;
        const pos = GameKit.MergeUtil.tile2px(x, y, GameKit.MergeUtil.DEFAULT_BOARD_LAYOUT);
        child.setPosition(new Vec3(pos.x, pos.y, 0));
        this.mergeItemParent.addChild(child);
        this.checkMap[key] = child;
    }
}

export default LevelMergeItemEditor;
