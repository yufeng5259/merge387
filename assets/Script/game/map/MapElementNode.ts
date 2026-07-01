import {
    _decorator,
    Camera,
    Component,
    find,
    instantiate,
    Label,
    Node,
    PolygonCollider2D,
    Prefab,
    ProgressBar,
    tween,
    UIOpacity,
    UITransform,
    Vec2,
    Vec3,
} from 'cc';
import { UserMap } from './UserMap';
const { ccclass, property } = _decorator;
const BUILD_EFFECT_HAMMER1_TIME = 0.35;
const BUILD_EFFECT_HAMMER2_TIME = 0.8;
const BUILD_EFFECT_HAMMER3_TIME = 1.2;

type LevelNodeView = {
    node: Node | null;
    normal: Node | null;
    damage: Node | null;
};

function getNodeTarget(target: any): Node | null {
    return target && target.node ? target.node : target;
}

function getOrAddOpacity(node: Node) {
    return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

function pointInPolygon(point: Vec2 | Vec3, polygon: Vec2[]) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const pi = polygon[i];
        const pj = polygon[j];
        const intersects = (pi.y > point.y) !== (pj.y > point.y)
            && point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x;
        if (intersects) {
            inside = !inside;
        }
    }
    return inside;
}

@ccclass('MapElementNode')
export class MapElementNode extends Component {
    @property(Label)
    public levelLabel: Label | null = null;
    @property(Node)
    public lockIcon: Node | null = null;
    @property(Node)
    public levelNode: Node | null = null;
    @property([Node])
    public levelNodes: Node[] = [];
    @property(Node)
    public EffectNode: Node | null = null;
    @property(Prefab)
    public buildEffect: Prefab | null = null;
    @property(Node)
    public canUpEffect: Node | null = null;
    @property(ProgressBar)
    public costBar: ProgressBar | null = null;
    @property(Label)
    public costlbl: Label | null = null;
    @property(Node)
    public coinBar: Node | null = null;

    public buildID = 0;
    public tiledObject: any = null;
    public unlocked = false;
    public level = 0;
    public maxLevel = 0;
    public stage = 0;
    public meta: any = null;
    public isbuild = false;
    public mbid = '0_0';
    public mapID: any = null;
    public mapData: any = null;

    private _runtimeStateInited = false;
    private ccontent: Node | null = null;
    private cupLevel: Node | null = null;
    private cc_bg: Node | null = null;
    private cc_prelbl: Label | null = null;
    private _levelNodeViews: LevelNodeView[] | null = null;
    private _missingLevelNodeLogged: Record<number, boolean> = {};
    private _costBarRoot: Node | null = null;
    private _coinBarNode: Node | null = null;
    private _lockMask: Node | null = null;
    private _metaMaxLevel = 0;
    private _limitLvText = '';
    private camera: Camera | null = null;

    onLoad() {
        this.initRuntimeState();
    }

    initRuntimeState() {
        if (this._runtimeStateInited) {
            return;
        }
        this._runtimeStateInited = true;
        this.buildID = 0;
        this.tiledObject = null;
        this.unlocked = false;
        this.level = 0;
        this.maxLevel = 0;
        this.stage = 0;
        this.meta = null;
        if (this.canUpEffect) {
            this.canUpEffect.active = false;
        }
        if (this.costBar) {
            this.costBar.progress = 0;
        }
        this.isbuild = false;
        this.mbid = '0_0';
        this.ccontent = null;
        this.cupLevel = null;
        this.cc_prelbl = null;
        this._levelNodeViews = null;
        this._missingLevelNodeLogged = {};
    }

    start() {
    }

    initData(buildID: any) {
        this.initRuntimeState();
        this.buildID = buildID;
        this.mapID = Game.SUserVillage.MergeMapId();
        this.mbid = this.mapID + '_' + this.buildID;
        this.meta = Meta.MapMeta.GetMetaById(this.mapID, this.buildID);
        Game.SUserMap.initElement(this.mbid);
        this.node.off(Node.EventType.TOUCH_END, this.showLevelInfo, this);
        this.node.off(Node.EventType.TOUCH_END, this.showLevelInfo, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.showLevelInfo, this, true);
        this.ccontent = GameKit.ControllerTable.GetNode(this.coinBar, 'content');
        this.cupLevel = this.coinBar ? this.coinBar.getChildByName('upLevel') : null;
        this.cc_bg = GameKit.ControllerTable.GetNode(this.coinBar, 'bg');
        this.cc_bg = GameKit.ControllerTable.GetNode(this.coinBar, 'bg1');
        this.cc_prelbl = GameKit.ControllerTable.GetComponent(this.coinBar, 'perlbl', Label);
        this.cacheViewRefs();
        this.updateElement();
    }

    cacheViewRefs() {
        this._costBarRoot = this.costBar && this.costBar.node && this.costBar.node.parent ? this.costBar.node.parent : null;
        this._coinBarNode = getNodeTarget(this.coinBar);
        this._lockMask = this.lockIcon ? this.lockIcon.getChildByName('mask') : null;
        this._metaMaxLevel = this.meta && this.meta.MaxLevel ? this.meta.MaxLevel() : (this.levelNodes ? this.levelNodes.length : 0);
        this._limitLvText = this.meta && this.meta.LimitLv ? 'LV.' + this.meta.LimitLv() : '';
        this._levelNodeViews = [];

        for (let i = 0; i < this._metaMaxLevel; i++) {
            const levelNode = this.levelNodes && this.levelNodes[i] ? this.levelNodes[i] : null;
            this._levelNodeViews[i] = {
                node: levelNode,
                normal: this.getControllerNode(levelNode, 'normal'),
                damage: this.getControllerNode(levelNode, 'damage'),
            };
        }
    }

    getNodeTarget(target: any) {
        return getNodeTarget(target);
    }

    getControllerNode(root: any, name: any) {
        if (!root) {
            return null;
        }
        try {
            return GameKit.ControllerTable.GetNode(root, name);
        } catch (e) {
            return root.getChildByName ? root.getChildByName(name) : null;
        }
    }

    setNodeActive(node: any, active: any) {
        node = getNodeTarget(node);
        if (node && node.active !== active) {
            node.active = active;
        }
    }

    setNodeOpacity(node: any, opacity: any) {
        node = getNodeTarget(node);
        if (node) {
            const uiOpacity = getOrAddOpacity(node);
            if (uiOpacity.opacity !== opacity) {
                uiOpacity.opacity = opacity;
            }
        }
    }

    setLabelString(label: any, text: any) {
        if (label && label.string !== text) {
            label.string = text;
        }
    }

    setProgress(progressBar: any, progress: any) {
        if (progressBar && progressBar.progress !== progress) {
            progressBar.progress = progress;
        }
    }

    updateElement(userCoin?: any) {
        const element = Game.SUserMap.initElement(this.mbid);
        this.level = element.level;
        this.maxLevel = element.maxLv;
        this.unlocked = Game.SUserMap.IsLevelUnlocked(this.mbid);
        this.stage = element.stage;
        const bought = Game.SUserMap.IsBought(this.mbid);
        const state = !this.unlocked
            ? UserMap.ElementState.LevelLocked
            : (!bought
                ? UserMap.ElementState.UnlockedNotBought
                : (this.level >= this.maxLevel ? UserMap.ElementState.Full : UserMap.ElementState.Bought));

        this.setNodeActive(this._costBarRoot, false);
        this.setNodeActive(this._coinBarNode, this.unlocked && state !== UserMap.ElementState.Full);
        let pricePre = 0;
        if (state !== UserMap.ElementState.Full) {
            const actionLevel = bought ? this.level : 0;
            pricePre = this.getActionPricePre(actionLevel, element, userCoin);
            const pricePreText = Math.floor(pricePre * 1000) / 10 + '%';
            this.setProgress(this.costBar, pricePre);
            this.setLabelString(this.costlbl, pricePreText);
            this.setLabelString(this.cc_prelbl, pricePreText);
        }
        this.updateCoinBarUpgradeState(pricePre);
        this.canPlayLevelUpAnimation();
        if (this.lockIcon) {
            this.setNodeActive(this.lockIcon, !this.unlocked);
            this.setNodeOpacity(this._lockMask, 255);
        }
        if (this.levelNode) {
            this.setNodeActive(this.levelNode, this.unlocked);
        }
        if (this.levelLabel) {
            this.setLabelString(this.levelLabel, this._limitLvText);
        }

        const showLevel = bought ? Math.max(1, this.level) : 0;
        for (let i = 0; i < this._metaMaxLevel; i++) {
            const view = this._levelNodeViews && this._levelNodeViews[i];
            if (view && view.node) {
                this.setNodeActive(view.node, this.unlocked && bought && showLevel === i + 1);
                this.setNodeActive(view.normal, true);
                this.setNodeActive(view.damage, false);
            } else if (!this._missingLevelNodeLogged[i]) {
                this._missingLevelNodeLogged[i] = true;
                console.log('MapElementNode levelNodes config mismatch', i);
            }
        }

        const firstLevelView = this._levelNodeViews && this._levelNodeViews[0];
        if (this.unlocked && !bought && firstLevelView && firstLevelView.node) {
            this.setNodeActive(firstLevelView.node, true);
            this.setNodeActive(firstLevelView.damage, true);
            this.setNodeActive(firstLevelView.normal, false);
        }
    }

    getActionPricePre(actionLevel: any, element: any, userCoin: any) {
        if (!this.meta) {
            return 0;
        }
        const price = this.meta.Price(actionLevel);
        let needCost = 0;
        if (Array.isArray(price) && price.length > 1) {
            const stageIndex = Game.SUserMap && Game.SUserMap.GetStagePriceIndex
                ? Game.SUserMap.GetStagePriceIndex(element, price)
                : Math.max(0, (element && element.stage != null ? Number(element.stage) : 0) || 0);
            needCost = Number(price[stageIndex]) || 0;
        } else {
            needCost = this.meta.ActionPrice(actionLevel, 0);
        }
        const coin = userCoin != null ? userCoin : Game.SUser.Coin();
        return needCost > 0 ? Math.min(coin / needCost, 1) : 1;
    }

    updateCoinBarUpgradeState(pricePre: any) {
        if (!this.ccontent || !this.cupLevel) {
            return;
        }
        const canUpgrade = pricePre >= 1;
        this.setNodeActive(this.ccontent, !canUpgrade);
        this.setNodeActive(this.cupLevel, canUpgrade);
    }

    private scheduleBuildAnimationSound(delay: number, playFunc: (soundManager: any) => void) {
        if (!GameKit.SoundManager) return;
        this.scheduleOnce(() => {
            if (!this.node || !this.node.isValid || !GameKit.SoundManager) return;
            playFunc(GameKit.SoundManager);
        }, delay);
    }

    private playBuildAnimationSounds() {
        if (!GameKit.SoundManager) return;
        if (GameKit.SoundManager.loadSoundByPath && GameKit.SoundManager.SoundPaths) {
            GameKit.SoundManager.loadSoundByPath(GameKit.SoundManager.SoundPaths.BuildHammer1);
            GameKit.SoundManager.loadSoundByPath(GameKit.SoundManager.SoundPaths.BuildHammer2);
        }
        this.scheduleBuildAnimationSound(BUILD_EFFECT_HAMMER1_TIME, (soundManager) => {
            if (soundManager.playBuildHammer1Sound) soundManager.playBuildHammer1Sound();
        });
        this.scheduleBuildAnimationSound(BUILD_EFFECT_HAMMER2_TIME, (soundManager) => {
            if (soundManager.playBuildHammer2Sound) soundManager.playBuildHammer2Sound();
        });
        this.scheduleBuildAnimationSound(BUILD_EFFECT_HAMMER3_TIME, (soundManager) => {
            if (soundManager.playBuildHammer2Sound) soundManager.playBuildHammer2Sound();
        });
    }

    private playRenovateFinishSound() {
        if (GameKit.SoundManager && GameKit.SoundManager.playRenovateSound) {
            GameKit.SoundManager.playRenovateSound();
        }
    }

    playUnlockAnimation() {
        this.node.setScale(new Vec3(0, 0, 0));
        tween(this.node)
            .to(0.3, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    playLevelUpAnimation(callback: any) {
        this.isbuild = true;
        const nd = this.buildEffect ? instantiate(this.buildEffect) : null;
        if (nd && this.EffectNode) {
            nd.parent = this.EffectNode;
        }
        const t = ((nd && (nd.getComponent('TimeDestroy') as any)?.t) || 0) / 1.2;
        this.playBuildAnimationSounds();
        this.scheduleOnce(() => {
            this.isbuild = false;
            this.playRenovateFinishSound();
            this.updateElement();
            if (callback) {
                callback();
            }
        }, t);
    }

    playStageLevelUpAnimation(callback: any) {
        this.isbuild = true;
        const nd = this.buildEffect ? instantiate(this.buildEffect) : null;
        if (nd && this.EffectNode) {
            nd.parent = this.EffectNode;
        }
        const t = ((nd && (nd.getComponent('TimeDestroy') as any)?.t) || 0) / 1.2;
        this.scheduleOnce(() => {
            this.isbuild = false;
            if (callback) {
                callback();
            }
        }, t);
    }

    canPlayLevelUpAnimation() {
        const nextLevel = this.level + 1;
        return this.unlocked && this.meta && this.meta.isCanUp ? this.meta.isCanUp(nextLevel) : false;
    }

    showLevelInfo(e: any) {
        const cameraNode = find('Canvas/VillageCamera');
        this.camera = cameraNode ? cameraNode.getComponent(Camera) : null;
        const collider = this.node.getComponent(PolygonCollider2D);
        const hasPolygon = collider && collider.points && collider.points.length >= 3;
        if (hasPolygon && e && e.getLocation) {
            const screenPos = e.getLocation();
            let cameraPos = new Vec3(screenPos.x, screenPos.y, 0);
            if (this.camera) {
                cameraPos = this.camera.screenToWorld(cameraPos, new Vec3());
            }
            const localPos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(cameraPos);
            if (!pointInPolygon(localPos, collider.points)) {
                return;
            }
        }

        if (Game.TownUpgradeFlow && Game.TownUpgradeFlow.isRunning && Game.TownUpgradeFlow.isRunning()) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
            return;
        }
        if (this.isbuild) {
            console.log('MapElementNode cannot show level info while building', this.mbid, this.isbuild);
            return;
        }
        const context = Game.SUserMap.GetBuildActionContext(this.mbid);
        if (!context || !context.windowName) {
            console.log('MapElementNode cannot show level info', this.mbid, context ? context.state : null);
            return;
        }

        if (this.node.parent && this.node.parent.parent) {
            const mc: any = this.node.parent.parent.getComponent('MapControlle');
            const pos = this.node.position.clone();
            if (mc && mc.lookBuild) {
                mc.lookBuild(pos);
            }
        }
        const obj = { meta: this.meta, mapData: this.mapData, mNode: this.node };
        UIRoot.instance.openChildWindow(context.windowName, obj);
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('mapId=' + this.mapID + ';buildId=' + this.buildID, {
                mapId: this.mapID,
                buildId: this.buildID,
            });
        }
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
    }

    getMapElementWindowName() {
        const context = Game.SUserMap.GetBuildActionContext(this.mbid);
        return context ? context.windowName : null;
    }

    hideNode() {
        if (this.EffectNode) {
            this.EffectNode.active = false;
        }
        if (this.canUpEffect) {
            this.canUpEffect.active = false;
        }
        if (this.costBar && this.costBar.node.parent) {
            this.costBar.node.parent.active = false;
        }
        if (this.coinBar) {
            this.coinBar.active = false;
        }
    }
}
