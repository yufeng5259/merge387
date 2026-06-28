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
    Vec2,
    Vec3,
    view,
} from 'cc';
const { ccclass, property } = _decorator;

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

function convertToWorldSpaceAR(node: Node, localPosition: Vec3) {
    const transform = node.getComponent(UITransform);
    return transform ? transform.convertToWorldSpaceAR(localPosition) : node.worldPosition.clone().add(localPosition);
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
    public loadedBuildPrefabs: Record<number, Prefab> = {};
    public visibleCheckHalfSize = 150;
    public visibleCheckInterval = 0.2;
    public visibleFadeDuration = 0.4;
    public progressiveLoadInterval = 0.05;
    public pendingBuildIds: number[] = [];
    public buildLayout: Record<number, BuildLayoutItem> | null = null;

    private _buildLoadVersion = 0;
    private _buildQueueLoading = false;
    private _buildLoadingComplete = false;
    private _destroyed = false;
    private _buildElementUpdateDirty = false;
    private _buildElementRefreshScheduled = false;
    private _buildElementRefreshDelay = 0.08;
    private _visibleCheckCallback: (() => void) | null = null;
    private _loadBuildQueueCallback: (() => void) | null = null;
    private _refreshBuildElementCallback: (() => void) | null = null;
    private _openBuildActionToken = 0;

    onLoad() {
        this.buildCount = this.buildNode ? this.buildNode.children.length : 0;
        this.mapControlle = null;
        this.buildObj = {};
        this.dynamicBuilds = {};
        this.loadingBuildPromises = {};
        this.loadedBuildPrefabs = {};
        this.visibleCheckHalfSize = 150;
        this.visibleCheckInterval = 0.2;
        this.visibleFadeDuration = 0.4;
        this.progressiveLoadInterval = 0.05;
        this._buildLoadVersion = 0;
        this._buildQueueLoading = false;
        this._buildLoadingComplete = false;
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
            const req = SR.SRVillage.getUserVillage();
            req.SetCallBack(() => {
                Game.SUserMap.initMapData();
                this.onCanLevelUpEffect();
                if (delayLookBuild) return;
                this.scheduleOnce(() => {
                    if (Object.keys(data.housesUnderUpgrade).length > 0) {
                        this.lookBuild(data.housesUnderUpgrade[Object.keys(data.housesUnderUpgrade)[0]].buildId);
                    } else {
                        this.lookBuild(Game.SUserVillage.GetFirstBuildID());
                    }
                }, 1);
            });
            req.Send();
        });
        Game.SUserMap.initMapData();
    }

    initMapElements() {
        this.prepareDefaultUnlockedBuild();
        GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.CoinEvent, Game.SUser.Coin());
        this.lookBuild(Game.SUserVillage.GetFirstBuildID());
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
        Game.SUserMap.UnlockElement('1_1');
    }

    loadBuilds(callback: any) {
        this.stopBuildSchedules();
        this.cancelBuildElementRefresh();
        this._buildLoadVersion++;
        this._buildLoadingComplete = false;
        const loadVersion = this._buildLoadVersion;
        this.dynamicBuilds = {};
        this.loadingBuildPromises = {};
        if (this.buildNode) {
            this.buildNode.removeAllChildren();
        }
        this.buildLayout = this.getBuildLayout();
        this.pendingBuildIds = this.getBuildIds().filter((buildID) => buildID > 5);
        const firstBuildIds = this.getBuildIds().filter((buildID) => buildID <= 5);
        const tasks = firstBuildIds.map((buildID) => this.createBuildNode(buildID, loadVersion));
        Promise.all(tasks)
            .then(() => {
                if (!this.isBuildLoadVersionActive(loadVersion)) return;
                this.buildCount = this.buildNode ? this.buildNode.children.length : 0;
                this.startProgressiveBuildLoading(loadVersion);
                this.startVisibleCheck();
                this.updateBuildVisibility();
                if (callback) callback();
            })
            .catch((e) => {
                if (!this.isBuildLoadVersionActive(loadVersion)) return;
                error('loadBuilds failed', e);
                this.startProgressiveBuildLoading(loadVersion);
                this.startVisibleCheck();
                if (callback) callback();
            });
    }

    getBuildLayout() {
        const json = this.mapData && this.mapData.json;
        const source = json && typeof json === 'object' && Object.keys(json).length > 0 ? json as any : BUILD_LAYOUT;
        const layout: Record<number, BuildLayoutItem> = {};
        for (const key in source) {
            if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
            const item = source[key];
            const buildID = Number(item.buildID || key);
            layout[buildID] = {
                buildID,
                x: Number(item.x) || 0,
                y: Number(item.y) || 0,
                index: Number(item.index || item.zIndex || buildID),
            };
        }
        return layout;
    }

    getBuildIds() {
        return Object.keys(this.buildLayout || {})
            .map((key) => Number(key))
            .filter((buildID) => buildID > 0)
            .sort((a, b) => a - b);
    }

    createBuildNode(buildID: any, loadVersion?: any): Promise<Node | null> {
        loadVersion = loadVersion || this._buildLoadVersion;
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
        const resName = 'res/village/buildPrefabs/' + buildID + '/' + buildID;
        const loadPromise = new Promise<Node | null>((resolve) => {
            cce.loadRes(resName, Prefab, (err: any, prefab: Prefab) => {
                if (!this.isBuildLoadVersionActive(loadVersion)) {
                    resolve(null);
                    return;
                }
                if (err || !prefab) {
                    error('MapNode load build prefab failed', resName, err);
                    resolve(null);
                    return;
                }
                if (this.dynamicBuilds[buildID]) {
                    resolve(this.dynamicBuilds[buildID]);
                    return;
                }
                const node = instantiate(prefab);
                if (!this.isBuildLoadVersionActive(loadVersion)) {
                    node.destroy();
                    resolve(null);
                    return;
                }
                node.parent = this.buildNode;
                node.name = String(buildID);
                node.setPosition(item.x, item.y);
                node.setSiblingIndex(Math.max(0, item.index - 1));
                this.dynamicBuilds[buildID] = node;
                const mapElementNode = this.getMapElementNode(node);
                if (mapElementNode) {
                    mapElementNode.initData(buildID);
                } else {
                    error('MapNode missing MapElementNode', buildID, resName);
                }
                this.updateOneBuildVisibility(node);
                resolve(node);
            });
        });
        this.loadingBuildPromises[buildID] = loadPromise;
        return loadPromise.then((node) => {
            if (this.loadingBuildPromises[buildID] === loadPromise) {
                delete this.loadingBuildPromises[buildID];
            }
            return node;
        });
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
            if (this._loadBuildQueueCallback) {
                this.scheduleOnce(this._loadBuildQueueCallback, this.progressiveLoadInterval);
            }
        });
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
            const worldPos = convertToWorldSpaceAR(node, corners[i]);
            const screenPos = this.getWorldToScreenPoint(camera, worldPos);
            minX = Math.min(minX, screenPos.x);
            minY = Math.min(minY, screenPos.y);
            maxX = Math.max(maxX, screenPos.x);
            maxY = Math.max(maxY, screenPos.y);
        }
        return maxX >= 0 && minX <= winSize.width && maxY >= 0 && minY <= winSize.height;
    }

    getWorldToScreenPoint(camera: any, worldPos: any) {
        const screenPos = new Vec2();
        if (camera.worldToScreen) {
            const out = new Vec3();
            const result = camera.worldToScreen(worldPos, out) || out;
            return new Vec2(result.x, result.y);
        }
        if (camera.getWorldToScreenPoint) {
            const result = camera.getWorldToScreenPoint(worldPos, screenPos);
            return result || screenPos;
        }
        return new Vec2(worldPos.x, worldPos.y);
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

    lookBuild(buildID: any) {
        const element = this.getBuildNode(buildID);
        if (element) {
            this.lookBuildNode(element);
            return;
        }
        if (this.buildLayout && this.buildLayout[buildID]) {
            this.createBuildNode(buildID).then((node) => {
                if (node) {
                    this.lookBuildNode(node);
                }
            });
        }
    }

    lookBuildNode(element: any) {
        if (!isValid(element)) return;
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
            this.mapControlle.lookBuild(pos);
        }
        this.scheduleOnce(() => {
            this.updateOneBuildVisibility(element);
        }, 0);
    }

    getBuildNode(buildID: any) {
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
