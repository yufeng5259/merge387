import {
    _decorator,
    Component,
    error,
    instantiate,
    isValid,
    JsonAsset,
    Node,
    Prefab,
    tween,
    UIOpacity,
    UITransform,
    Vec3,
    view,
} from 'cc';
const { ccclass, property } = _decorator;
const BUILD_RENDER_ORDER_Y_SCALE = 1;
const BUILD_PREFAB_POSITION_OVERRIDE_MAX_ID = 21;
const BUILD_MAX_ID = 38;

const BUILD_LAYOUT: Record<number, { x: number; y: number; index: number }> = {
    1: { x: 267.845, y: -1436.43, index: 1 },
    2: { x: -82.493, y: -1327.19, index: 2 },
    3: { x: 445.927, y: -996.48, index: 3 },
    4: { x: -489.483, y: -1058.938, index: 4 },
    5: { x: -258.41, y: -861.261, index: 5 },
    6: { x: 39, y: -760, index: 6 },
    7: { x: -198.951, y: -618.75, index: 7 },
    8: { x: -1179.267, y: -537.086, index: 8 },
    9: { x: -918.517, y: -382.79, index: 9 },
    10: { x: -645.703, y: -346.657, index: 10 },
    11: { x: -457.97, y: -446.763, index: 11 },
    12: { x: -202.717, y: -238.607, index: 12 },
    13: { x: -439.727, y: -157.852, index: 13 },
    14: { x: -157.288, y: -41.044, index: 14 },
    15: { x: 98.738, y: -136.165, index: 15 },
    16: { x: 149.237, y: -461.66, index: 16 },
    17: { x: 400.291, y: -573.24, index: 17 },
    18: { x: 631.246, y: -680.187, index: 18 },
    19: { x: 904.64, y: -807.799, index: 19 },
    20: { x: 1462.698, y: -518.862, index: 20 },
    21: { x: 645.401, y: -258.313, index: 21 },
    22: { x: 424.806, y: 10.172, index: 22 },
    23: { x: 396.579, y: 220.395, index: 23 },
    24: { x: 632, y: 112, index: 24 },
    25: { x: 975, y: -65, index: 25 },
    26: { x: 938.889, y: 278.714, index: 26 },
    27: { x: 703.025, y: 608.546, index: 27 },
    28: { x: -301.153, y: 240.923, index: 28 },
    29: { x: -882.704, y: -61.311, index: 29 },
    30: { x: -1276.046, y: -237.2, index: 30 },
    31: { x: -1497.649, y: -357.176, index: 31 },
    32: { x: -1526.532, y: -126.023, index: 32 },
    33: { x: -1208.695, y: 30.884, index: 33 },
    34: { x: -843.849, y: 241.332, index: 34 },
    35: { x: -108.236, y: 531.911, index: 35 },
    36: { x: -378.035, y: 648.709, index: 36 },
    37: { x: -838.6, y: 523.818, index: 37 },
    38: { x: -1224.508, y: 359.307, index: 38 },
    39: { x: -1446, y: 212, index: 39 },
};

type BuildLayoutSourceItem = { buildID?: number | string; x?: number | string; y?: number | string; index?: number | string; zIndex?: number | string };
type BuildLayoutItem = { buildID: number; x: number; y: number; index: number };

function getOrAddOpacity(node: Node) {
    return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

function setOpacity(node: Node, opacity: number) {
    getOrAddOpacity(node).opacity = opacity;
}

function getOpacity(node: Node) {
    return getOrAddOpacity(node).opacity;
}

@ccclass('MapNode')
export class MapNode extends Component {
    @property(Node)
    public buildNode: Node | null = null;
    @property(Prefab)
    public buildPrefab: Prefab | null = null;
    @property(JsonAsset)
    public mapData: JsonAsset | null = null;
    @property
    public enableBuildVisibilityCulling = false;

    public buildCount = 0;
    public mapControlle: any = null;
    public buildObj: Record<string, any> = {};
    public dynamicBuilds: Record<number, Node> = {};
    public loadingBuildPromises: Record<number, Promise<Node | null>> = {};
    public loadingBuildPrefabPromises: Record<number, Promise<Prefab | null>> = {};
    public loadedBuildPrefabs: Record<number, Prefab> = {};
    public visibleCheckHalfSize = 150;
    public visibleCheckInterval = 0.2;
    public visibleFadeDuration = 0.4;
    public progressiveLoadInterval = 0.05;
    public initialBuildLoadInterval = 0;
    public buildPrefabPreloadConcurrency = 2;
    public pendingBuildIds: number[] = [];
    public buildLayout: Record<number, BuildLayoutItem> | null = null;

    private _buildLoadVersion = 0;
    private _buildQueueLoading = false;
    private _buildLoadingComplete = false;
    private _initialBuildLoading = false;
    private _buildLoadStartTime = 0;
    private _destroyed = false;
    private _buildElementUpdateDirty = false;
    private _buildElementRefreshScheduled = false;
    private _buildElementRefreshDelay = 0.08;
    private _visibleCheckCallback: (() => void) | null = null;
    private _loadBuildQueueCallback: (() => void) | null = null;
    private _refreshBuildElementCallback: (() => void) | null = null;
    private _openBuildActionToken = 0;
    private _buildLoadTimer: ReturnType<typeof setTimeout> | null = null;
    private _buildPrefabPreloadQueue: number[] = [];
    private _buildPrefabPreloadActiveCount = 0;
    private _shadowRoot: Node | null = null;

    onLoad() {
        this.buildCount = this.buildNode ? this.buildNode.children.length : 0;
        this.mapControlle = null;
        this.buildObj = {};
        this.dynamicBuilds = {};
        this.loadingBuildPromises = {};
        this.loadedBuildPrefabs = {};
        this.loadingBuildPrefabPromises = {};
        this.visibleCheckHalfSize = 150;
        this.visibleCheckInterval = 0.2;
        this.visibleFadeDuration = 0.4;
        this.progressiveLoadInterval = 0.05;
        this.initialBuildLoadInterval = this.isNativeRuntime() ? 0.02 : 0;
        this.buildPrefabPreloadConcurrency = this.isNativeRuntime() ? 1 : 2;
        this._buildLoadVersion = 0;
        this._buildQueueLoading = false;
        this._buildLoadingComplete = false;
        this._initialBuildLoading = false;
        this._buildLoadStartTime = 0;
        this._destroyed = false;
        this._buildElementUpdateDirty = false;
        this._buildElementRefreshScheduled = false;
        this._buildElementRefreshDelay = 0.08;
    }

    onDestroy() {
        this._destroyed = true;
        this._buildLoadVersion++;
        this.pendingBuildIds = [];
        this.cancelBuildElementRefresh();
        this.stopBuildSchedules();
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.MapElementLevelUp, 'MapNode');
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.CoinEvent, 'MapNode');
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.MapElementUnlocked, 'MapNode');
        GameKit.WebEvent.UnRegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, 'MapNode');
    }

    stopBuildSchedules() {
        if (this._visibleCheckCallback) {
            this.unschedule(this._visibleCheckCallback);
            this._visibleCheckCallback = null;
        }
        if (this._loadBuildQueueCallback) {
            this.unschedule(this._loadBuildQueueCallback);
            this._loadBuildQueueCallback = null;
        }
        this._buildQueueLoading = false;
        this._initialBuildLoading = false;
        this.clearBuildLoadTimer();
        this._buildPrefabPreloadQueue = [];
        this._buildPrefabPreloadActiveCount = 0;
    }

    isNativeRuntime() {
        return typeof AppKit !== 'undefined' && AppKit.SdkManager && AppKit.SdkManager.IsNative && AppKit.SdkManager.IsNative();
    }

    clearBuildLoadTimer() {
        if (this._buildLoadTimer) clearTimeout(this._buildLoadTimer);
        this._buildLoadTimer = null;
    }

    cancelBuildElementRefresh() {
        if (this._refreshBuildElementCallback) {
            this.unschedule(this._refreshBuildElementCallback);
        }
        this._buildElementRefreshScheduled = false;
    }

    pauseProgressiveBuildLoading() {
        if (this._loadBuildQueueCallback) {
            this.unschedule(this._loadBuildQueueCallback);
        }
        if (this._buildElementRefreshScheduled) {
            this.cancelBuildElementRefresh();
            this._buildElementUpdateDirty = true;
        }
        this._buildQueueLoading = false;
    }

    resumeProgressiveBuildLoading() {
        this.refreshBuildElementsIfDirty();
        if (this._initialBuildLoading) return;
        if (this._buildLoadingComplete || !this.pendingBuildIds || this.pendingBuildIds.length <= 0) return;
        const loadVersion = this._buildLoadVersion;
        if (!this.isBuildLoadVersionActive(loadVersion)) return;
        if (!this._loadBuildQueueCallback) {
            this._loadBuildQueueCallback = () => {
                this.loadNextBuildFromQueue(loadVersion);
            };
        }
        if (this._buildQueueLoading) return;
        this.unschedule(this._loadBuildQueueCallback);
        this.scheduleOnce(this._loadBuildQueueCallback, this.progressiveLoadInterval);
    }

    isBuildLoadingComplete() {
        return !!this._buildLoadingComplete;
    }

    isBuildLoadVersionActive(loadVersion: any) {
        return !this._destroyed
            && this.node
            && isValid(this.node)
            && this.buildNode
            && isValid(this.buildNode)
            && loadVersion === this._buildLoadVersion;
    }

    initEvent() {
        this.mapControlle = this.node.getComponent('MapControlle');
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.MapElementLevelUp, 'MapNode', () => {
            this.onCanLevelUpEffect();
            this.updateBuildShadows();
            if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshCurrentWindow) {
                Game.MergeTutorialManager.RefreshCurrentWindow();
            }
        });
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.CoinEvent, 'MapNode', () => {
            this.requestBuildElementRefresh();
        });
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.MapElementUnlocked, 'MapNode', (data: any) => {
            console.log('MapNode unlock building', data);
            this.onCanLevelUpEffect();
            this.scheduleOnce(() => {
                this.lookBuild(data.buildID);
            }, 1);
        });
        GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, 'MapNode', (data: any) => {
            console.log('MapNode unlock buildings event', data.housesUnderUpgrade);
            const delayLookBuild = GameKit.DataCache.GetData('TownUpgradeFlowDelayUnlockLookBuild');
            const beforeUnlockedBuildIDs = this.getUnlockedBuildIDMap();
            const req = SR.SRVillage.getUserVillage();
            req.SetCallBack(() => {
                Game.SUserMap.initMapData();
                this.onCanLevelUpEffect();
                this.updateBuildShadows();
                if (delayLookBuild) return;
                this.scheduleOnce(() => {
                    const buildID = this.getFirstNewUnlockedBuildID(beforeUnlockedBuildIDs, data);
                    this.lookBuild(buildID || Game.SUserVillage.GetFirstBuildID());
                }, 1);
            });
            req.Send();
        });
        Game.SUserMap.initMapData();
        this.updateBuildShadows();
    }

    initMapElements() {
        this.prepareDefaultUnlockedBuild();
        this.updateBuildShadows();
        GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.CoinEvent, Game.SUser.Coin());
        this.restoreInitialMapView();
    }

    showInfo() {
        console.log('MapNode init map elements');
        if (this.mapControlle == null) {
            this.initEvent();
        }
        this.prepareDefaultUnlockedBuild();
        this.loadBuilds(() => {
            this.initMapElements();
        });
    }

    prepareDefaultUnlockedBuild() {
        if (this.hasVillageBuildState()) return;
        Game.SUserMap.UnlockElement('1_1');
    }

    restoreInitialMapView(callback?: (success: boolean) => void) {
        if (this.mapControlle == null) this.initEvent();
        if (this.mapControlle?.resetViewState) this.mapControlle.resetViewState();
        const buildID = Game.SUserVillage?.GetFirstBuildID ? Game.SUserVillage.GetFirstBuildID() : 1;
        this.lookBuild(buildID || 1, callback);
        return true;
    }

    hasVillageBuildState() {
        const village = Game.SUserVillage;
        if (!village) return false;
        const buildings = village.GetBuildings ? village.GetBuildings() : null;
        const completed = village.GetComplete ? village.GetComplete() : null;
        return !!((buildings && Object.keys(buildings).length) || (completed && Object.keys(completed).length));
    }

    getUnlockedBuildIDMap() {
        const result: Record<number, boolean> = {};
        const elements = Game.SUserMap?.data?.elements;
        if (!Array.isArray(elements)) return result;
        const mapID = this.getCurrentMapID();
        for (const element of elements) {
            if (!element?.unlocked || (mapID && String(element.mapID) !== String(mapID))) continue;
            result[Number(element.id)] = true;
        }
        return result;
    }

    getBuildIDFromUnlockItem(item: any) {
        if (!item) return null;
        const mapID = this.getCurrentMapID();
        const itemMapID = item.mapId != null ? item.mapId : (item.mapID != null ? item.mapID : item.map_id);
        if (itemMapID != null && mapID && String(itemMapID) !== String(mapID)) return null;
        const buildID = Number(item.buildId != null ? item.buildId : (item.buildID != null ? item.buildID : item.build_id));
        return this.isSupportedBuildID(buildID) ? buildID : null;
    }

    getEventUnlockedBuildIDs(data: any) {
        const ids: number[] = [];
        if (!data) return ids;
        const add = (item: any) => {
            const id = this.getBuildIDFromUnlockItem(item);
            if (id) ids.push(id);
        };
        add(data);
        if (Array.isArray(data.housesUnderUpgrade)) data.housesUnderUpgrade.forEach(add);
        else if (data.housesUnderUpgrade) Object.keys(data.housesUnderUpgrade).forEach((key) => add(data.housesUnderUpgrade[key]));
        return ids.filter((id, index) => ids.indexOf(id) === index).sort((a, b) => a - b);
    }

    getFirstNewUnlockedBuildID(beforeUnlockedBuildIDs: Record<number, boolean>, eventData: any) {
        const before = beforeUnlockedBuildIDs || {};
        const mapID = this.getCurrentMapID();
        for (const id of this.getEventUnlockedBuildIDs(eventData)) {
            if (!before[id] && this.isUnlockedNotBoughtBuild(mapID, id)) return id;
        }
        const elements = Game.SUserMap?.data?.elements;
        if (!Array.isArray(elements)) return null;
        const ids = elements
            .filter((element: any) => element?.unlocked && !before[Number(element.id)]
                && this.isSupportedBuildID(Number(element.id))
                && (!mapID || String(element.mapID) === String(mapID))
                && this.isUnlockedNotBoughtBuild(mapID, element.id))
            .map((element: any) => Number(element.id))
            .sort((a: number, b: number) => a - b);
        return ids.length ? ids[0] : null;
    }

    isUnlockedNotBoughtBuild(mapID: any, buildID: any) {
        if (!Game.SUserMap?.GetElementState || !Game.UserMap?.ElementState) return true;
        return Game.SUserMap.GetElementState(`${mapID}_${buildID}`) === Game.UserMap.ElementState.UnlockedNotBought;
    }

    loadBuilds(callback: any) {
        this.stopBuildSchedules();
        this.cancelBuildElementRefresh();
        this._buildLoadVersion++;
        this._buildLoadingComplete = false;
        const loadVersion = this._buildLoadVersion;
        this.dynamicBuilds = {};
        this.loadingBuildPromises = {};
        this.loadingBuildPrefabPromises = {};
        this.loadedBuildPrefabs = {};
        this._initialBuildLoading = true;
        this._buildLoadStartTime = Date.now();
        const positionOverrides = this.getPrefabBuildPositionOverrides();
        if (this.buildNode) {
            this.buildNode.removeAllChildren();
        }
        this.buildLayout = this.getBuildLayout(positionOverrides);
        const buildIds = this.getBuildIds();
        if (!this.useCommonBuildPrefab()) this.preloadBuildPrefabs(buildIds, loadVersion);
        this.pendingBuildIds = buildIds.filter((buildID) => buildID > 5);
        const firstBuildIds = buildIds.filter((buildID) => buildID <= 5);
        this.loadInitialBuilds(firstBuildIds, loadVersion)
            .then(() => {
                if (!this.isBuildLoadVersionActive(loadVersion)) return;
                this._initialBuildLoading = false;
                this.buildCount = this.buildNode ? this.buildNode.children.length : 0;
                this.startProgressiveBuildLoading(loadVersion);
                this.startVisibleCheck();
                this.updateBuildVisibility();
                if (callback) callback();
            })
            .catch((e) => {
                if (!this.isBuildLoadVersionActive(loadVersion)) return;
                this._initialBuildLoading = false;
                error('loadBuilds failed', e);
                this.startProgressiveBuildLoading(loadVersion);
                this.startVisibleCheck();
                if (callback) callback();
            });
    }

    loadInitialBuilds(buildIds: number[], loadVersion: number) {
        return new Promise<void>((resolve) => {
            let index = 0;
            const loadNext = () => {
                if (!this.isBuildLoadVersionActive(loadVersion) || index >= buildIds.length) return resolve();
                this.createBuildNode(buildIds[index++], loadVersion).then(() => {
                    if (!this.isBuildLoadVersionActive(loadVersion) || index >= buildIds.length) return resolve();
                    this.scheduleBuildLoadTimer(loadNext, this.initialBuildLoadInterval);
                });
            };
            loadNext();
        });
    }

    getPrefabBuildPositionOverrides() {
        const overrides: Record<number, { x: number; y: number }> = {};
        for (const child of this.buildNode?.children || []) {
            const buildID = Number(child.name);
            if (this.isSupportedBuildID(buildID) && buildID <= BUILD_PREFAB_POSITION_OVERRIDE_MAX_ID) overrides[buildID] = { x: child.position.x, y: child.position.y };
        }
        return overrides;
    }

    getBuildLayout(positionOverrides?: Record<number, { x: number; y: number }>) {
        const json = this.mapData && this.mapData.json;
        const source = (json && typeof json === 'object' && Object.keys(json).length > 0 ? json : BUILD_LAYOUT) as Record<string, BuildLayoutSourceItem>;
        const layout: Record<number, BuildLayoutItem> = {};
        for (const key in source) {
            if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
            const item = source[key];
            const buildID = Number(item.buildID || key);
            if (!this.isSupportedBuildID(buildID)) continue;
            layout[buildID] = {
                buildID,
                x: Number(item.x) || 0,
                y: Number(item.y) || 0,
                index: Number(item.index || item.zIndex || buildID),
            };
        }
        for (const key in positionOverrides || {}) {
            const buildID = Number(key);
            if (layout[buildID]) Object.assign(layout[buildID], positionOverrides![buildID]);
        }
        return layout;
    }

    getBuildIds() {
        return Object.keys(this.buildLayout || {})
            .map((key) => Number(key))
            .filter((buildID) => buildID > 0)
            .sort((a, b) => a - b);
    }

    isSupportedBuildID(buildID: number) {
        const id = Number(buildID);
        return id >= 1 && id <= BUILD_MAX_ID;
    }

    createBuildNode(buildID: any, loadVersion?: any): Promise<Node | null> {
        loadVersion = loadVersion || this._buildLoadVersion;
        if (!this.isSupportedBuildID(Number(buildID))) return Promise.resolve(null);
        if (!this.isBuildLoadVersionActive(loadVersion)) {
            return Promise.resolve(null);
        }
        if (this.dynamicBuilds[buildID]) {
            return Promise.resolve(this.dynamicBuilds[buildID]);
        }
        if (this.loadingBuildPromises[buildID]) {
            return this.loadingBuildPromises[buildID];
        }
        const item = this.buildLayout && this.buildLayout[buildID];
        if (!item) {
            return Promise.resolve(null);
        }
        const resName = this.getBuildPrefabResName(buildID);
        const loadPromise = this.requestBuildPrefab(buildID, loadVersion).then((prefab) => {
                if (!this.isBuildLoadVersionActive(loadVersion)) {
                    return null;
                }
                if (!prefab) return null;
                if (this.dynamicBuilds[buildID]) {
                    return this.dynamicBuilds[buildID];
                }
                const node = instantiate(prefab);
                if (!this.isBuildLoadVersionActive(loadVersion)) {
                    node.destroy();
                    return null;
                }
                node.parent = this.buildNode;
                node.name = String(buildID);
                node.setPosition(item.x, item.y);
                this.dynamicBuilds[buildID] = node;
                const mapElementNode = this.getMapElementNode(node);
                if (mapElementNode) {
                    mapElementNode.initData(buildID, undefined, { waitForSprite: !this.useCommonBuildPrefab() });
                } else {
                    error('MapNode missing MapElementNode', buildID, resName);
                }
                this.refreshBuildRenderOrder();
                this.updateOneBuildVisibility(node);
                return node;
        });
        this.loadingBuildPromises[buildID] = loadPromise;
        return loadPromise.then((node) => {
            if (this.loadingBuildPromises[buildID] === loadPromise) {
                delete this.loadingBuildPromises[buildID];
            }
            return node;
        });
    }

    getBuildPrefabResName(buildID: number) { return `res/village/buildPrefabs/${buildID}/${buildID}`; }
    useCommonBuildPrefab() { return !!this.buildPrefab; }

    requestBuildPrefab(buildID: number, loadVersion: number): Promise<Prefab | null> {
        if (this.buildPrefab) return Promise.resolve(this.buildPrefab);
        if (this.loadedBuildPrefabs[buildID]) return Promise.resolve(this.loadedBuildPrefabs[buildID]);
        if (this.loadingBuildPrefabPromises[buildID]) return this.loadingBuildPrefabPromises[buildID];
        this.removeBuildIdFromPreloadQueue(buildID);
        const resName = this.getBuildPrefabResName(buildID);
        const promise = new Promise<Prefab | null>((resolve) => cce.loadRes(resName, Prefab, (err: any, prefab: Prefab | null) => {
            if (!this.isBuildLoadVersionActive(loadVersion) || err || !prefab) {
                if (err) error('MapNode load build prefab failed', resName, err);
                resolve(null);
                return;
            }
            this.loadedBuildPrefabs[buildID] = prefab;
            resolve(prefab);
        }));
        this.loadingBuildPrefabPromises[buildID] = promise;
        return promise.then((prefab) => {
            delete this.loadingBuildPrefabPromises[buildID];
            return prefab;
        }, (err) => {
            delete this.loadingBuildPrefabPromises[buildID];
            throw err;
        });
    }

    preloadBuildPrefabs(buildIds: number[], loadVersion: number) {
        this._buildPrefabPreloadQueue = this.useCommonBuildPrefab() ? [] : buildIds.slice();
        this._buildPrefabPreloadActiveCount = 0;
        this.loadNextBuildPrefabInBackground(loadVersion);
    }

    removeBuildIdFromPreloadQueue(buildID: number) {
        this._buildPrefabPreloadQueue = this._buildPrefabPreloadQueue.filter((id) => id !== buildID);
    }

    loadNextBuildPrefabInBackground(loadVersion: number) {
        if (!this.isBuildLoadVersionActive(loadVersion)) return;
        while (this._buildPrefabPreloadActiveCount < this.buildPrefabPreloadConcurrency && this._buildPrefabPreloadQueue.length) {
            const buildID = this._buildPrefabPreloadQueue.shift()!;
            if (this.loadedBuildPrefabs[buildID]) continue;
            this._buildPrefabPreloadActiveCount++;
            this.requestBuildPrefab(buildID, loadVersion).then(() => {
                this._buildPrefabPreloadActiveCount = Math.max(0, this._buildPrefabPreloadActiveCount - 1);
                this.loadNextBuildPrefabInBackground(loadVersion);
            }, () => {
                this._buildPrefabPreloadActiveCount = Math.max(0, this._buildPrefabPreloadActiveCount - 1);
                this.loadNextBuildPrefabInBackground(loadVersion);
            });
        }
    }

    startProgressiveBuildLoading(loadVersion: any) {
        loadVersion = loadVersion || this._buildLoadVersion;
        if (this._loadBuildQueueCallback) {
            this.unschedule(this._loadBuildQueueCallback);
        }
        this._loadBuildQueueCallback = () => {
            this.loadNextBuildFromQueue(loadVersion);
        };
        this.loadNextBuildFromQueue(loadVersion);
    }

    loadNextBuildFromQueue(loadVersion: any) {
        if (!this.isBuildLoadVersionActive(loadVersion)) return;
        if (!this.shouldContinueBuildLoading()) {
            this._buildQueueLoading = false;
            return;
        }
        if (this._buildQueueLoading) return;
        if (!this.pendingBuildIds || this.pendingBuildIds.length <= 0) {
            this.finishProgressiveBuildLoading(loadVersion);
            return;
        }
        const buildID = this.pendingBuildIds.shift();
        this._buildQueueLoading = true;
        this.createBuildNode(buildID, loadVersion).then(() => {
            if (!this.isBuildLoadVersionActive(loadVersion)) return;
            this._buildQueueLoading = false;
            this.buildCount = this.buildNode ? this.buildNode.children.length : 0;
            this.updateBuildVisibility();
            if (!this.shouldContinueBuildLoading()) return;
            if (!this.pendingBuildIds || this.pendingBuildIds.length <= 0) {
                this.finishProgressiveBuildLoading(loadVersion);
                return;
            }
            this.scheduleNextBuildLoad(loadVersion, this.progressiveLoadInterval);
        });
    }

    scheduleNextBuildLoad(loadVersion: number, delay: number) {
        if (!this.isBuildLoadVersionActive(loadVersion)) return;
        if (!this._loadBuildQueueCallback) this._loadBuildQueueCallback = () => this.loadNextBuildFromQueue(loadVersion);
        this.scheduleBuildLoadTimer(this._loadBuildQueueCallback, delay);
    }

    scheduleBuildLoadTimer(callback: () => void, delay: number) {
        this.clearBuildLoadTimer();
        let timeout = Math.max(0, Number(delay) || 0) * 1000;
        if (timeout <= 0 && this.useCommonBuildPrefab() && this.isNativeRuntime()) timeout = 16;
        this._buildLoadTimer = setTimeout(() => {
            this._buildLoadTimer = null;
            if (!this._destroyed) callback();
        }, timeout);
    }

    getBuildRenderOrder(node: Node, layoutItem?: BuildLayoutItem | null) {
        const y = Number(layoutItem?.y ?? node.position.y) || 0;
        const tieIndex = Number(layoutItem?.index ?? node.name) || 0;
        return Math.round(-y * BUILD_RENDER_ORDER_Y_SCALE) + tieIndex;
    }

    refreshBuildRenderOrder() {
        if (!this.buildNode) return;
        const children = this.buildNode.children.slice().sort((a, b) => {
            const aItem = this.buildLayout?.[Number(a.name)];
            const bItem = this.buildLayout?.[Number(b.name)];
            const delta = this.getBuildRenderOrder(a, aItem) - this.getBuildRenderOrder(b, bItem);
            return delta || Number(a.name) - Number(b.name);
        });
        children.forEach((child, index) => child.setSiblingIndex(index));
    }

    getCurrentMapID() {
        if (Game.SUserVillage?.MergeMapId) return Game.SUserVillage.MergeMapId();
        if (Game.SUserVillage?.MapId) return Game.SUserVillage.MapId();
        return 1;
    }

    getBuildShadowRoot() {
        if (this._shadowRoot?.isValid) return this._shadowRoot;
        const parent = this.buildNode?.parent || this.node;
        this._shadowRoot = parent.getChildByName('yinying');
        return this._shadowRoot;
    }

    isBuildShadowUnlocked(buildID: number) {
        return !!(Game.SUserMap?.IsLevelUnlocked && Game.SUserMap.IsLevelUnlocked(`${this.getCurrentMapID()}_${buildID}`));
    }

    updateBuildShadows() {
        for (const shadowNode of this.getBuildShadowRoot()?.children || []) {
            const buildID = Number(shadowNode.name);
            shadowNode.active = this.isSupportedBuildID(buildID) && this.isBuildShadowUnlocked(buildID);
        }
    }

    getWorldToScreenPoint(camera: any, worldPos: Vec3) {
        const output = new Vec3();
        return camera?.worldToScreen ? camera.worldToScreen(worldPos, output) : worldPos.clone();
    }

    shouldContinueBuildLoading() {
        if (this.node && this.node.activeInHierarchy) return true;
        const gamePlay = typeof GamePlay !== 'undefined' ? GamePlay : null;
        return !!(gamePlay
            && gamePlay.instance
            && gamePlay.instance.shouldKeepVillageBuildLoadingInBackground
            && gamePlay.instance.shouldKeepVillageBuildLoadingInBackground());
    }

    finishProgressiveBuildLoading(loadVersion: any) {
        if (!this.isBuildLoadVersionActive(loadVersion)) return;
        if (this._loadBuildQueueCallback) {
            this.unschedule(this._loadBuildQueueCallback);
            this._loadBuildQueueCallback = null;
        }
        this.pendingBuildIds = [];
        this._buildQueueLoading = false;
        this._buildLoadingComplete = true;
        console.log(`建筑物全部加载完成，耗时：${Date.now() - (this._buildLoadStartTime || Date.now())}ms`);
        this.updateBuildVisibility();
    }

    refreshBuildElementsIfDirty() {
        if (!this._buildElementUpdateDirty) return;
        if (!this.node || !this.node.activeInHierarchy) return;
        this._buildElementUpdateDirty = false;
        this.onCanLevelUpEffect();
    }

    requestBuildElementRefresh() {
        if (!this.node || !this.node.activeInHierarchy) {
            this._buildElementUpdateDirty = true;
            return;
        }
        if (this._buildElementRefreshScheduled) return;
        if (!this._refreshBuildElementCallback) {
            this._refreshBuildElementCallback = () => {
                this._buildElementRefreshScheduled = false;
                this.onCanLevelUpEffect();
            };
        }
        this._buildElementRefreshScheduled = true;
        this.scheduleOnce(this._refreshBuildElementCallback, this._buildElementRefreshDelay);
    }

    startVisibleCheck() {
        if (!this.enableBuildVisibilityCulling) {
            this.showAllLoadedBuilds();
            return;
        }
        if (this._visibleCheckCallback) {
            this.unschedule(this._visibleCheckCallback);
        }
        this._visibleCheckCallback = () => {
            this.updateBuildVisibility();
        };
        this.schedule(this._visibleCheckCallback, this.visibleCheckInterval);
    }

    updateBuildVisibility() {
        if (!this.enableBuildVisibilityCulling) {
            this.showAllLoadedBuilds();
            return;
        }
        for (const buildID in this.dynamicBuilds) {
            if (!Object.prototype.hasOwnProperty.call(this.dynamicBuilds, buildID)) continue;
            this.updateOneBuildVisibility(this.dynamicBuilds[buildID]);
        }
    }

    showAllLoadedBuilds() {
        if (this._visibleCheckCallback) {
            this.unschedule(this._visibleCheckCallback);
            this._visibleCheckCallback = null;
        }
        for (const buildID in this.dynamicBuilds) {
            if (!Object.prototype.hasOwnProperty.call(this.dynamicBuilds, buildID)) continue;
            const node: any = this.dynamicBuilds[buildID];
            if (isValid(node)) {
                node.active = true;
                setOpacity(node, 255);
                node._mapVisibleState = true;
                node._mapFadeInPlaying = false;
                this.stopBuildFade(node);
            }
        }
    }

    updateOneBuildVisibility(node: any) {
        if (!isValid(node)) return;
        node.active = true;
        if (!this.enableBuildVisibilityCulling) {
            setOpacity(node, 255);
            node._mapVisibleState = true;
            node._mapFadeInPlaying = false;
            this.stopBuildFade(node);
            return;
        }
        const isVisible = this.isBuildVisibleInCamera(node);
        if (isVisible) {
            this.fadeInBuildNode(node);
        } else {
            this.stopBuildFade(node);
            node._mapVisibleState = false;
            node._mapFadeInPlaying = false;
            setOpacity(node, 0);
        }
    }

    fadeInBuildNode(node: any) {
        if (!isValid(node)) return;
        if (node._mapVisibleState && getOpacity(node) >= 255) return;
        if (node._mapVisibleState && node._mapFadeInPlaying) return;
        node._mapVisibleState = true;
        this.stopBuildFade(node);
        const opacity = getOrAddOpacity(node);
        if (opacity.opacity >= 255) {
            node._mapFadeInPlaying = false;
            return;
        }
        node._mapFadeInPlaying = true;
        tween(opacity)
            .to(this.visibleFadeDuration, { opacity: 255 })
            .call(() => {
                if (!isValid(node)) return;
                setOpacity(node, 255);
                node._mapFadeInPlaying = false;
            })
            .start();
    }

    stopBuildFade(node: any) {
        if (isValid(node)) {
            tween(getOrAddOpacity(node)).stop();
        }
    }

    isBuildVisibleInCamera(node: any) {
        if (!this.mapControlle || !this.mapControlle.camera) return true;
        const halfSize = this.visibleCheckHalfSize;
        const corners = [
            new Vec3(-halfSize, -halfSize, 0),
            new Vec3(-halfSize, halfSize, 0),
            new Vec3(halfSize, -halfSize, 0),
            new Vec3(halfSize, halfSize, 0),
        ];
        const winSize = view.getVisibleSize();
        const camera = this.mapControlle.camera;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < corners.length; i++) {
            const worldPos = node.getComponent(UITransform)!.convertToWorldSpaceAR(corners[i]);
            const screenPos = new Vec3();
            camera.worldToScreen(worldPos, screenPos);
            minX = Math.min(minX, screenPos.x);
            minY = Math.min(minY, screenPos.y);
            maxX = Math.max(maxX, screenPos.x);
            maxY = Math.max(maxY, screenPos.y);
        }
        return maxX >= 0 && minX <= winSize.width && maxY >= 0 && minY <= winSize.height;
    }

    playElementLevelUpAnimation(buildID: any, callback: any, eventData: any) {
        const element = this.getBuildNode(buildID);
        if (!element) {
            if (callback) callback();
            return;
        }
        const mapElementNode = this.getMapElementNode(element);
        if (!mapElementNode) {
            if (callback) callback();
            return;
        }
        const isStageOnly = eventData && eventData.level === eventData.oldLv;
        const playFunc = isStageOnly && mapElementNode.playStageLevelUpAnimation
            ? mapElementNode.playStageLevelUpAnimation
            : mapElementNode.playLevelUpAnimation;
        if (!playFunc) {
            if (callback) callback();
            return;
        }
        playFunc.call(mapElementNode, () => {
            if (callback) callback();
        });
    }

    onLevelNode(buildID: any, level: any) {
        const element = this.getBuildNode(buildID);
        if (element) {
            const mapElementNode = this.getMapElementNode(element);
            mapElementNode.playLevelUpAnimation(() => {
                const m = Game.SUserVillage.MergeMapId();
                const b = buildID;
                const mMeta = Meta.MapMeta.GetMetaById(m, b);
                const obj = { level, meta: mMeta, record: false };
                UIRoot.instance.openChildWindow('StoryWindow', obj);
            });
        }
    }

    onLevelStageNode(buildID: any) {
        const element = this.getBuildNode(buildID);
        if (element) {
            const mapElementNode = this.getMapElementNode(element);
            mapElementNode.playStageLevelUpAnimation(() => {});
        }
    }

    onCanLevelUpEffect() {
        if (!this.node || !this.node.activeInHierarchy) {
            this._buildElementUpdateDirty = true;
            return;
        }
        const userCoin = Game.SUser.Coin();
        for (const buildID in this.dynamicBuilds) {
            if (!Object.prototype.hasOwnProperty.call(this.dynamicBuilds, buildID)) continue;
            const element = this.dynamicBuilds[buildID];
            if (!isValid(element)) continue;
            const mapElementNode = this.getMapElementNode(element);
            if (mapElementNode) {
                mapElementNode.updateElement(userCoin);
            }
        }
    }

    getFirstCanLevelUpBuildContext() {
        if (Game.SUserMap.initMapData) {
            Game.SUserMap.initMapData();
        }
        let mapID = Game.SUserVillage.MergeMapId();
        if (mapID == null && Game.SUserVillage.MapId) {
            mapID = Game.SUserVillage.MapId();
        }
        mapID = Number(mapID);
        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.Map);
        if (!metas || !Game.SUserMap.GetBuildActionContext) return null;
        const canActionList = [];
        for (const key in metas) {
            if (!Object.prototype.hasOwnProperty.call(metas, key)) continue;
            const meta = metas[key];
            if (!meta || Number(meta.MapId()) !== mapID) continue;
            if (!this.isSupportedBuildID(Number(meta.BuildID()))) continue;
            const sid = meta.MBId ? meta.MBId() : mapID + '_' + meta.BuildID();
            const context = Game.SUserMap.GetBuildActionContext(sid);
            if (!context || !context.windowName || !context.canAction || context.isLocked || context.isFull) {
                continue;
            }
            canActionList.push(context);
        }
        if (canActionList.length <= 0) return null;
        canActionList.sort((a, b) => {
            if (a.buildID !== b.buildID) return a.buildID - b.buildID;
            return a.actionLevel - b.actionLevel;
        });
        return canActionList[0];
    }

    openCanLevelUpBuild(callback: any) {
        const context = this.getFirstCanLevelUpBuildContext();
        if (!context) {
            if (callback) callback(false, null);
            return false;
        }
        this.openBuildAction(context.buildID, callback);
        return true;
    }

    openBuildAction(buildID: any, callback: any) {
        const token = (this._openBuildActionToken || 0) + 1;
        this._openBuildActionToken = token;
        this.getOrCreateBuildNode(buildID, (element: Node | null) => {
            if (this._openBuildActionToken !== token) return;
            if (!isValid(element)) {
                if (callback) callback(false, null);
                return;
            }
            if (!this.mapControlle) {
                this.mapControlle = this.node.getComponent('MapControlle');
            }
            this.lookBuildNode(element);
            const lookDuration = this.mapControlle && this.mapControlle.lookBuildDuration != null
                ? Number(this.mapControlle.lookBuildDuration)
                : 0;
            const openDelay = Math.max(lookDuration || 0, 0) + 0.05;
            this.scheduleOnce(() => {
                if (this._openBuildActionToken !== token || !isValid(element)) return;
                const mapElementNode = this.getMapElementNode(element);
                if (mapElementNode && mapElementNode.showLevelInfo) {
                    mapElementNode.showLevelInfo();
                    if (callback) callback(true, mapElementNode);
                    return;
                }
                if (callback) callback(false, null);
            }, openDelay);
        });
    }

    getOrCreateBuildNode(buildID: any, callback: any) {
        const element = this.getBuildNode(buildID);
        if (element) {
            if (callback) callback(element);
            return;
        }
        if (!this.buildLayout) {
            this.buildLayout = this.getBuildLayout();
        }
        if (this.buildLayout && this.buildLayout[buildID]) {
            this.createBuildNode(buildID).then((node) => {
                if (callback) callback(node);
            });
            return;
        }
        if (callback) callback(null);
    }

    lookBuild(buildID: any, callback?: (success: boolean) => void) {
        const element = this.getBuildNode(buildID);
        if (element) {
            this.lookBuildNode(element, callback);
            return;
        }
        if (this.buildLayout && this.buildLayout[buildID]) {
            this.createBuildNode(buildID).then((node) => {
                if (node) {
                    this.lookBuildNode(node, callback);
                } else if (callback) {
                    callback(false);
                }
            });
            return;
        }
        if (callback) callback(false);
    }

    lookBuildNode(element: any, callback?: (success: boolean) => void) {
        if (!isValid(element)) {
            if (callback) callback(false);
            return;
        }
        element.active = true;
        setOpacity(element, 255);
        element._mapVisibleState = true;
        element._mapFadeInPlaying = false;
        this.stopBuildFade(element);
        const pos = element.position.clone();
        if (!this.mapControlle) {
            this.mapControlle = this.node.getComponent('MapControlle');
        }
        if (this.mapControlle && this.mapControlle.lookBuild) {
            this.mapControlle.lookBuild(pos, callback);
        } else if (callback) {
            callback(false);
        }
        this.scheduleOnce(() => {
            this.updateOneBuildVisibility(element);
        }, 0);
    }

    getBuildNode(buildID: any) {
        if (!this.isSupportedBuildID(Number(buildID))) return null;
        return this.dynamicBuilds && this.dynamicBuilds[buildID]
            ? this.dynamicBuilds[buildID]
            : (this.buildNode ? this.buildNode.getChildByName(buildID + '') : null);
    }

    getMapElementNode(node: any) {
        if (!isValid(node)) return null;
        const mapElementNode = node.getComponent('MapElementNode');
        if (mapElementNode) {
            return mapElementNode;
        }
        const components = node.getComponents(Component);
        for (let i = 0; i < components.length; i++) {
            const component: any = components[i];
            if (component && component.initData && component.updateElement && component.showLevelInfo) {
                return component;
            }
        }
        return null;
    }
}
