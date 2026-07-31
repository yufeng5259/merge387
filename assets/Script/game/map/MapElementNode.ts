import {
    _decorator,
    assetManager,
    Camera,
    Component,
    find,
    instantiate,
    isValid,
    Label,
    Node,
    PolygonCollider2D,
    Prefab,
    ProgressBar,
    Sprite,
    SpriteFrame,
    sp,
    tween,
    UIOpacity,
    UITransform,
    Vec2,
    Vec3,
} from 'cc';
import { UserMap } from './UserMap';
const { ccclass, property } = _decorator;
const BUILD_SPRITE_RES_BASE = 'res/village/buildPrefabs';
const BUILD_SPRITE_FRAME_CACHE: Record<string, SpriteFrame> = {};
const BUILD_SPRITE_FRAME_LOADING: Record<string, Promise<SpriteFrame | null>> = {};
const LOCK_MASK_RES_BASE = 'res/yun';
const LOCK_MASK_DEFAULT_NAME = '3';
const LOCK_MASK_BY_BUILD_ORDER: Record<number, string> = { 1:'5', 2:'4-1', 3:'1', 4:'3', 5:'1', 6:'4', 7:'4-1', 8:'9', 9:'5', 10:'3', 11:'6', 12:'8', 13:'7', 14:'6', 15:'9', 16:'3', 17:'7', 18:'5', 19:'4-1', 20:'3', 21:'2' };
const LOCK_MASK_SPRITE_FRAME_CACHE: Record<string, SpriteFrame> = {};
const LOCK_MASK_SPRITE_FRAME_LOADING: Record<string, Promise<SpriteFrame | null>> = {};
const BUILD_EFFECT_HAMMER1_TIME = 0.2667;
const BUILD_EFFECT_HAMMER2_TIME = 0.9;
const BUILD_EFFECT_HAMMER3_TIME = 1.5333;
const BUILD_COMPLETE_SPINE_BUNDLE = 'LiveData';
const BUILD_COMPLETE_SPINE_BASE = 'anim/DaDiTu_WeiDang';
const BUILD_COMPLETE_SPINE_ANIM = 'OK';
const BUILD_COMPLETE_SPINE_FALLBACK_TIME = 4;
const BUILD_COMPLETE_SPINE_BASE_WIDTH = 1388.63;
const BUILD_COMPLETE_SPINE_EFFECTS = [
    { name: 'DaDiTu_WeiDang_Hou', layer: 'behind', bounds: { x: -673.35, y: 614.2, width: 1302.37, height: 998.13 } },
    { name: 'DaDiTu_WeiDang_CaiDai', layer: 'front', bounds: { x: -168.18, y: 881.66, width: 265.53, height: 396.37 } },
    { name: 'DaDiTu_WeiDang_Qian', layer: 'front', bounds: { x: -731.51, y: 238.25, width: 1388.63, height: 1266.85 } },
];
const BUILD_COMPLETE_SPINE_DATA_CACHE: Record<string, sp.SkeletonData> = {};
const BUILD_COMPLETE_SPINE_DATA_LOADING: Record<string, Promise<sp.SkeletonData | null>> = {};
const LOCK_SPRITE_ANIMATIONS = ['01', '02'];
const BUILD_DISPLAY_SPINE_BONE = 'DaDiTu_JianZhu';
const BUILD_DISPLAY_SHOW_ANIMATION = 'show';
const BUILD_DISPLAY_IDLE_ANIMATION = 'idle';
const BUILD_DISPLAY_CONTENT_NAME = 'BuildingVisualContent';
const BUILD_DISPLAY_SHOW_DELAY = 0.2;

function loadBuildCompleteSpineData(effectName: string): Promise<sp.SkeletonData | null> {
    if (BUILD_COMPLETE_SPINE_DATA_CACHE[effectName]) return Promise.resolve(BUILD_COMPLETE_SPINE_DATA_CACHE[effectName]);
    if (BUILD_COMPLETE_SPINE_DATA_LOADING[effectName]) return BUILD_COMPLETE_SPINE_DATA_LOADING[effectName];
    BUILD_COMPLETE_SPINE_DATA_LOADING[effectName] = new Promise((resolve) => {
        const load = (bundle: any) => bundle.load(`${BUILD_COMPLETE_SPINE_BASE}/${effectName}`, sp.SkeletonData, (err: any, data: sp.SkeletonData | null) => {
            delete BUILD_COMPLETE_SPINE_DATA_LOADING[effectName];
            if (err || !data) {
                console.warn('MapElementNode load build complete spine failed', effectName, err);
                resolve(null);
                return;
            }
            BUILD_COMPLETE_SPINE_DATA_CACHE[effectName] = data;
            resolve(data);
        });
        const bundle = assetManager.getBundle(BUILD_COMPLETE_SPINE_BUNDLE);
        if (bundle) load(bundle);
        else assetManager.loadBundle(BUILD_COMPLETE_SPINE_BUNDLE, (err, loadedBundle) => err || !loadedBundle ? resolve(null) : load(loadedBundle));
    });
    return BUILD_COMPLETE_SPINE_DATA_LOADING[effectName];
}

type LevelNodeView = {
    node: Node | null;
    normal: Node | null;
    damage: Node | null;
    normalSprite: Sprite | null;
    damageSprite: Sprite | null;
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
    private _lockMaskSprite: Sprite | null = null;
    private _lockSpriteNode: Node | null = null;
    private _lockSkeleton: sp.Skeleton | null = null;
    private _coinProgressSprite: Sprite | null = null;
    private _currentLockMaskKey = '';
    private _appliedLockMaskKey = '';
    private _lockMaskLoadToken = 0;
    private _upgradeIconClickNodes: Node[] = [];
    private _metaMaxLevel = 0;
    private _limitLvText = '';
    private camera: Camera | null = null;
    private _currentBuildSpriteKey: string | null = null;
    private _buildSpriteLoadToken = 0;
    private _buildSoundToken = 0;
    private _buildCompleteEffectToken = 0;
    private _buildCompleteEffectNodes: Node[] = [];
    private _buildCompleteEffectPreloadPromise: Promise<(sp.SkeletonData | null)[]> | null = null;
    private _usesSharedLevelView = false;
    private _buildingDisplaySkeleton: sp.Skeleton | null = null;
    private _buildingDisplayContent: Node | null = null;
    private _buildingDisplayAnimationToken = 0;
    private _buildingDisplayWarningLogged = false;
    private _buildingDisplayShowCallback: (() => void) | null = null;

    onLoad() {
        this.initRuntimeState();
    }

    onDestroy() {
        this.clearBuildingDisplayAnimationListener();
        this.clearBuildCompleteEffects();
        this.unbindUpgradeIconClick();
        this._buildSpriteLoadToken++;
        this._lockMaskLoadToken++;
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
        this._currentBuildSpriteKey = null;
        this._buildSpriteLoadToken = 0;
        this._buildSoundToken = 0;
        this._usesSharedLevelView = false;
        this._buildingDisplaySkeleton = null;
        this._buildingDisplayContent = null;
        this._buildingDisplayAnimationToken = 0;
        this._buildingDisplayWarningLogged = false;
        this._buildingDisplayShowCallback = null;
    }

    start() {
    }

    initData(buildID: any, userCoin?: any, options?: any) {
        this.initRuntimeState();
        options = options || {};
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
        this.bindUpgradeIconClick();
        this.prepareBuildingDisplayAnimation();
        return this.updateElement(userCoin, options.waitForSprite !== false);
    }

    getBuildingDisplaySkeleton() {
        if (this._buildingDisplaySkeleton?.node && isValid(this._buildingDisplaySkeleton.node)) return this._buildingDisplaySkeleton;
        const skeletons = this.node ? this.node.getComponents(sp.Skeleton) : [];
        for (const skeleton of skeletons) {
            const value: any = skeleton;
            if (value.findAnimation?.(BUILD_DISPLAY_SHOW_ANIMATION) && value.findAnimation?.(BUILD_DISPLAY_IDLE_ANIMATION)) {
                this._buildingDisplaySkeleton = skeleton;
                return skeleton;
            }
        }
        return null;
    }

    logBuildingDisplayWarningOnce(message: any) {
        if (this._buildingDisplayWarningLogged) return;
        this._buildingDisplayWarningLogged = true;
        console.warn('MapElementNode building display spine unavailable', this.buildID, message);
    }

    getBuildingBoneCompensation(bone: any) {
        const { a, b, c, d, worldX, worldY } = bone;
        const determinant = Number(a) * Number(d) - Number(b) * Number(c);
        if (!Number.isFinite(determinant) || Math.abs(determinant) < 0.0001) return null;
        const scaleX = Math.sqrt(a * a + c * c);
        const scaleY = Math.sqrt(b * b + d * d);
        if (scaleX < 0.0001 || scaleY < 0.0001) return null;
        return {
            x: (-d * worldX + b * worldY) / determinant,
            y: (c * worldX - a * worldY) / determinant,
            angle: -Math.atan2(c, a) * 180 / Math.PI,
            scaleX: 1 / scaleX,
            scaleY: 1 / scaleY,
        };
    }

    ensureBuildingVisualAttached(silent = false) {
        if (this._buildingDisplayContent && isValid(this._buildingDisplayContent)) return true;
        const skeleton = this.getBuildingDisplaySkeleton() as any;
        if (!skeleton?.attachUtil) {
            if (!silent) this.logBuildingDisplayWarningOnce('missing root sp.Skeleton with show/idle');
            return false;
        }
        try {
            skeleton.setToSetupPose();
            skeleton._skeleton?.updateWorldTransform?.();
            const bone = skeleton.findBone?.(BUILD_DISPLAY_SPINE_BONE);
            const compensation = bone ? this.getBuildingBoneCompensation(bone) : null;
            const attachedNodes = skeleton.attachUtil.generateAttachedNodes(BUILD_DISPLAY_SPINE_BONE);
            const boneNode: Node | null = attachedNodes?.[0] || null;
            if (!boneNode || !compensation) {
                this.logBuildingDisplayWarningOnce(`missing bone ${BUILD_DISPLAY_SPINE_BONE}`);
                return false;
            }
            const content = new Node(BUILD_DISPLAY_CONTENT_NAME);
            content.setPosition(compensation.x, compensation.y);
            content.angle = compensation.angle;
            content.setScale(compensation.scaleX, compensation.scaleY, 1);
            content.parent = boneNode;
            if (this.levelNode && isValid(this.levelNode) && this.levelNode.parent === this.node) this.levelNode.parent = content;
            const attachedRoot = skeleton.attachUtil.getAttachedRootNode?.();
            if (attachedRoot?.parent === this.node) attachedRoot.setSiblingIndex(0);
            this._buildingDisplayContent = content;
            return true;
        } catch (error: any) {
            this.logBuildingDisplayWarningOnce(error?.message || error);
            return false;
        }
    }

    clearBuildingDisplayAnimationListener() {
        this._buildingDisplayAnimationToken++;
        if (this._buildingDisplayShowCallback) {
            this.unschedule(this._buildingDisplayShowCallback);
            this._buildingDisplayShowCallback = null;
        }
        const skeleton = this._buildingDisplaySkeleton;
        if (skeleton?.node && isValid(skeleton.node)) skeleton.setCompleteListener(null);
    }

    prepareBuildingDisplayAnimation() {
        if (!this.ensureBuildingVisualAttached(true)) return false;
        this.playBuildingIdleAnimation(this._buildingDisplaySkeleton, this._buildingDisplayAnimationToken);
        return true;
    }

    playBuildingIdleAnimation(skeleton: sp.Skeleton | null, token: number) {
        if (token !== this._buildingDisplayAnimationToken || !skeleton?.node || !isValid(skeleton.node)) return;
        try {
            const value: any = skeleton;
            skeleton.setCompleteListener(null);
            skeleton.paused = false;
            const idle = value.findAnimation?.(BUILD_DISPLAY_IDLE_ANIMATION);
            const isStatic = (idle?.timelines && idle.timelines.length === 0) || (idle && Number(idle.duration) <= 0);
            if (isStatic) {
                skeleton.clearTrack(0);
                skeleton.setToSetupPose();
                value._skeleton?.updateWorldTransform?.();
                skeleton.paused = true;
            } else {
                skeleton.setAnimation(0, BUILD_DISPLAY_IDLE_ANIMATION, true);
            }
        } catch (error: any) {
            this.logBuildingDisplayWarningOnce(error?.message || error);
        }
    }

    playBuildingUpgradeShowAnimation() {
        if (!this.ensureBuildingVisualAttached()) return;
        const skeleton = this._buildingDisplaySkeleton;
        this.clearBuildingDisplayAnimationListener();
        const token = this._buildingDisplayAnimationToken;
        this.playBuildingIdleAnimation(skeleton, token);
        this._buildingDisplayShowCallback = () => {
            this._buildingDisplayShowCallback = null;
            if (token !== this._buildingDisplayAnimationToken || !skeleton?.node || !isValid(skeleton.node)) return;
            skeleton.paused = false;
            skeleton.setCompleteListener((entry: any) => {
                const name = entry?.animation?.name || '';
                if (token === this._buildingDisplayAnimationToken && (!name || name === BUILD_DISPLAY_SHOW_ANIMATION)) {
                    this.playBuildingIdleAnimation(skeleton, token);
                }
            });
            skeleton.setAnimation(0, BUILD_DISPLAY_SHOW_ANIMATION, false);
        };
        this.scheduleOnce(this._buildingDisplayShowCallback, BUILD_DISPLAY_SHOW_DELAY);
    }

    cacheViewRefs() {
        this._costBarRoot = this.costBar && this.costBar.node && this.costBar.node.parent ? this.costBar.node.parent : null;
        this._coinBarNode = getNodeTarget(this.coinBar);
        this._lockMask = this.lockIcon ? this.lockIcon.getChildByName('mask') : null;
        this._lockMaskSprite = this._lockMask ? this._lockMask.getComponent(Sprite) : null;
        this._lockSpriteNode = this.lockIcon ? this.lockIcon.getChildByName('lockSprite') : null;
        this._lockSkeleton = this._lockSpriteNode ? this._lockSpriteNode.getComponent(sp.Skeleton) : null;
        const coinProgressNode = this.getControllerNode(this.coinBar, 'progress');
        this._coinProgressSprite = coinProgressNode ? coinProgressNode.getComponent(Sprite) : null;
        this._metaMaxLevel = this.meta && this.meta.MaxLevel ? this.meta.MaxLevel() : (this.levelNodes ? this.levelNodes.length : 0);
        this._limitLvText = this.meta && this.meta.LimitLv ? 'LV.' + this.meta.LimitLv() : '';
        this._levelNodeViews = [];

        const validLevelNodes = (this.levelNodes || []).filter((node) => node && isValid(node));
        this._usesSharedLevelView = validLevelNodes.length === 1;
        if (this._usesSharedLevelView) {
            this._levelNodeViews[0] = this.createLevelNodeView(validLevelNodes[0], 1);
            return;
        }
        for (let i = 0; i < this._metaMaxLevel; i++) {
            const levelNode = this.levelNodes && this.levelNodes[i] ? this.levelNodes[i] : null;
            this._levelNodeViews[i] = this.createLevelNodeView(levelNode, i + 1);
        }
    }

    createLevelNodeView(levelNode: Node | null, level: number): LevelNodeView {
        return { node: levelNode, normal: this.getControllerNode(levelNode, 'normal'), damage: this.getControllerNode(levelNode, 'damage'),
            normalSprite: this.getBuildLevelSprite(levelNode, level, false), damageSprite: this.getBuildLevelSprite(levelNode, level, true) };
    }

    syncLockSpriteAnimations(shouldPlay: boolean) {
        const skeleton: any = this._lockSkeleton;
        if (!skeleton?.node || !isValid(skeleton.node)) return;
        if (!shouldPlay || !this._lockSpriteNode?.active) {
            skeleton.clearTracks();
            return;
        }
        LOCK_SPRITE_ANIMATIONS.forEach((name, index) => {
            if (!skeleton.findAnimation || skeleton.findAnimation(name)) skeleton.setAnimation(index, name, true);
        });
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

    getControllerComponent(root: any, name: string, componentType: any) {
        try {
            return GameKit.ControllerTable.GetComponent(root, name, componentType);
        } catch (e) {
            return this.getControllerNode(root, name)?.getComponent(componentType) || null;
        }
    }

    getBuildLevelSprite(levelNode: Node | null, level: number, isDamage: boolean) {
        const root = this.getControllerNode(levelNode, isDamage ? 'damage' : 'normal');
        if (!root || !root.getChildByName) {
            return null;
        }
        const spriteNode = isDamage
            ? (root.getChildByName('1z') || root.getChildByName(level + 'z'))
            : root.getChildByName(String(level));
        return spriteNode ? spriteNode.getComponent(Sprite) : null;
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

    setSpriteFillProgress(sprite: Sprite | null, progress: number) {
        if (!sprite) return;
        sprite.type = Sprite.Type.FILLED;
        sprite.fillType = Sprite.FillType.HORIZONTAL;
        sprite.fillStart = 0;
        sprite.fillRange = progress;
    }

    getBuildSpriteResName(buildID: any, spriteName: string) {
        return BUILD_SPRITE_RES_BASE + '/' + buildID + '/res/' + spriteName+"/spriteFrame";
    }

    getLockMaskSpriteName(buildID: any) {
        const buildOrder = Number(buildID);
        return buildOrder > 0 ? (LOCK_MASK_BY_BUILD_ORDER[buildOrder] || LOCK_MASK_DEFAULT_NAME) : LOCK_MASK_DEFAULT_NAME;
    }

    getLockMaskResName(buildID: any) {
        return `${LOCK_MASK_RES_BASE}/${this.getLockMaskSpriteName(buildID)}/spriteFrame`;
    }

    loadLockMaskSpriteFrame(buildID: any): Promise<SpriteFrame | null> {
        const spriteName = this.getLockMaskSpriteName(buildID);
        if (LOCK_MASK_SPRITE_FRAME_CACHE[spriteName]) return Promise.resolve(LOCK_MASK_SPRITE_FRAME_CACHE[spriteName]);
        if (LOCK_MASK_SPRITE_FRAME_LOADING[spriteName]) return LOCK_MASK_SPRITE_FRAME_LOADING[spriteName];
        const resName = this.getLockMaskResName(buildID);
        LOCK_MASK_SPRITE_FRAME_LOADING[spriteName] = new Promise((resolve) => {
            cce.loadRes(resName, SpriteFrame, (err: any, spriteFrame: SpriteFrame | null) => {
                delete LOCK_MASK_SPRITE_FRAME_LOADING[spriteName];
                if (err || !spriteFrame) {
                    console.warn('MapElementNode load lock mask failed', resName, err);
                    resolve(null);
                    return;
                }
                LOCK_MASK_SPRITE_FRAME_CACHE[spriteName] = spriteFrame;
                resolve(spriteFrame);
            });
        });
        return LOCK_MASK_SPRITE_FRAME_LOADING[spriteName];
    }

    updateLockMaskSprite() {
        const sprite = this._lockMaskSprite || (this._lockMask ? this._lockMask.getComponent(Sprite) : null);
        if (!sprite || !this.buildID) return;
        const spriteName = this.getLockMaskSpriteName(this.buildID);
        if (this._appliedLockMaskKey === spriteName && sprite.spriteFrame) return;
        this._currentLockMaskKey = spriteName;
        const token = ++this._lockMaskLoadToken;
        this.loadLockMaskSpriteFrame(this.buildID).then((spriteFrame) => {
            if (!spriteFrame || token !== this._lockMaskLoadToken || this._currentLockMaskKey !== spriteName || !sprite.node.isValid) return;
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            (sprite as any).trim = false;
            this._appliedLockMaskKey = spriteName;
        });
    }

    loadBuildSpriteFrame(buildID: any, spriteName: string): Promise<SpriteFrame | null> {
        const key = buildID + '/' + spriteName;
        if (BUILD_SPRITE_FRAME_CACHE[key]) {
            return Promise.resolve(BUILD_SPRITE_FRAME_CACHE[key]);
        }
        if (BUILD_SPRITE_FRAME_LOADING[key]) {
            return BUILD_SPRITE_FRAME_LOADING[key];
        }

        const resName = this.getBuildSpriteResName(buildID, spriteName);
        BUILD_SPRITE_FRAME_LOADING[key] = new Promise((resolve) => {
            cce.loadRes(resName, SpriteFrame, (err: any, spriteFrame: SpriteFrame | null) => {
                delete BUILD_SPRITE_FRAME_LOADING[key];
                if (err || !spriteFrame) {
                    console.error('MapElementNode load build sprite failed', resName, err);
                    resolve(null);
                    return;
                }
                BUILD_SPRITE_FRAME_CACHE[key] = spriteFrame;
                resolve(spriteFrame);
            });
        });

        return BUILD_SPRITE_FRAME_LOADING[key];
    }

    updateDynamicBuildSprite(spriteName: string, sprite: Sprite | null, waitForSprite?: boolean) {
        if (!spriteName || !sprite || !this.buildID) {
            return Promise.resolve(null);
        }

        const key = this.buildID + '/' + spriteName;
        if (this._currentBuildSpriteKey === key && sprite.spriteFrame) {
            return Promise.resolve(sprite.spriteFrame);
        }

        this._currentBuildSpriteKey = key;
        const token = ++this._buildSpriteLoadToken;
        const loadPromise = this.loadBuildSpriteFrame(this.buildID, spriteName).then((spriteFrame) => {
            if (!spriteFrame) return null;
            if (token !== this._buildSpriteLoadToken || this._currentBuildSpriteKey !== key) return null;
            if (!sprite || !sprite.node || !sprite.node.isValid) return null;

            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            (sprite as any).trim = false;
            return spriteFrame;
        });

        return waitForSprite === false ? Promise.resolve(null) : loadPromise;
    }

    updateElement(userCoin?: any, waitForSprite?: boolean) {
        waitForSprite = waitForSprite !== false;
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
            this.setSpriteFillProgress(this._coinProgressSprite, pricePre);
            this.setLabelString(this.costlbl, pricePreText);
            this.setLabelString(this.cc_prelbl, pricePreText);
        }
        this.updateCoinBarUpgradeState(pricePre);
        this.canPlayLevelUpAnimation();
        if (this.lockIcon) {
            this.setNodeActive(this.lockIcon, !this.unlocked);
            this.syncLockSpriteAnimations(!this.unlocked);
            this.setNodeOpacity(this._lockMask, 255);
            if (!this.unlocked) this.updateLockMaskSprite();
        }
        if (this.levelNode) {
            this.setNodeActive(this.levelNode, this.unlocked);
        }
        if (this.levelLabel) {
            this.setLabelString(this.levelLabel, this._limitLvText);
        }

        const showLevel = bought ? Math.max(1, this.level) : 0;
        if (this._usesSharedLevelView) return this.updateSharedLevelView(bought, showLevel, waitForSprite);
        const activeLevelIndex = this.unlocked && bought ? showLevel - 1 : -1;
        for (let i = 0; i < this._metaMaxLevel; i++) {
            const view = this._levelNodeViews && this._levelNodeViews[i];
            if (view && view.node) {
                const shouldActive = activeLevelIndex === i;
                this.setNodeActive(view.node, shouldActive);
                if (shouldActive) {
                    this.setNodeActive(view.normal, true);
                    this.setNodeActive(view.damage, false);
                }
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

        const activeView = this._levelNodeViews && activeLevelIndex >= 0 ? this._levelNodeViews[activeLevelIndex] : null;
        if (activeView && activeView.normalSprite) {
            return this.updateDynamicBuildSprite(String(activeLevelIndex + 1), activeView.normalSprite, waitForSprite);
        }
        if (this.unlocked && !bought && firstLevelView && firstLevelView.damageSprite) {
            return this.updateDynamicBuildSprite('1z', firstLevelView.damageSprite, waitForSprite);
        }
        return Promise.resolve(null);
    }

    updateSharedLevelView(bought: boolean, showLevel: number, waitForSprite: boolean) {
        const view = this._levelNodeViews?.[0];
        if (!view?.node) return Promise.resolve(null);
        this.setNodeActive(view.node, this.unlocked);
        if (!this.unlocked) return Promise.resolve(null);
        this.setNodeActive(view.normal, bought);
        this.setNodeActive(view.damage, !bought);
        if (bought && view.normalSprite) return this.updateDynamicBuildSprite(String(showLevel), view.normalSprite, waitForSprite);
        if (!bought && view.damageSprite) return this.updateDynamicBuildSprite('1z', view.damageSprite, waitForSprite);
        return Promise.resolve(null);
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

    bindUpgradeIconClick() {
        this.unbindUpgradeIconClick();
        this._upgradeIconClickNodes = this.getUpgradeIconClickNodes();
        for (const node of this._upgradeIconClickNodes) node.on(Node.EventType.TOUCH_END, this.onUpgradeIconClick, this);
    }

    getUpgradeIconClickNodes() {
        const root = this.cupLevel || getNodeTarget(this.coinBar);
        if (!root) return [];
        const nodes: Node[] = [];
        const collect = (node: Node) => {
            if (!node.isValid) return;
            const transform = node.getComponent(UITransform);
            if ((transform && transform.contentSize.width > 0 && transform.contentSize.height > 0) || node.children.length === 0) nodes.push(node);
            node.children.forEach(collect);
        };
        collect(root);
        return nodes.length > 0 ? nodes : [root];
    }

    unbindUpgradeIconClick() {
        for (const node of this._upgradeIconClickNodes) {
            if (node && node.isValid) node.off(Node.EventType.TOUCH_END, this.onUpgradeIconClick, this);
        }
        this._upgradeIconClickNodes = [];
    }

    onUpgradeIconClick(event: any) {
        if (event && event.stopPropagation) event.stopPropagation();
        this.showLevelInfo({ skipHitTest: true, stopPropagation() {} });
    }

    private getBuildEffectSkeleton(node: Node | null): sp.Skeleton | null {
        if (!node) return null;
        const skeleton = node.getComponent(sp.Skeleton);
        if (skeleton) return skeleton;
        const children = node.children || [];
        for (let i = 0; i < children.length; i++) {
            const childSkeleton = this.getBuildEffectSkeleton(children[i]);
            if (childSkeleton) return childSkeleton;
        }
        return null;
    }

    private getBuildEffectDelay(effectNode: Node | null, animationTime: number) {
        const skeleton = this.getBuildEffectSkeleton(effectNode);
        const timeScale = skeleton && skeleton.timeScale ? skeleton.timeScale : 1;
        return Math.max(0, animationTime / timeScale);
    }

    private scheduleBuildAnimationSound(effectNode: Node | null, animationTime: number, playFunc: (soundManager: any) => void) {
        if (!GameKit.SoundManager) return;
        const token = this._buildSoundToken;
        const delay = this.getBuildEffectDelay(effectNode, animationTime);
        this.scheduleOnce(() => {
            if (token !== this._buildSoundToken) return;
            if (!this.node || !this.node.isValid || !GameKit.SoundManager) return;
            playFunc(GameKit.SoundManager);
        }, delay);
    }

    private playBuildAnimationSounds(effectNode: Node | null) {
        this._buildSoundToken++;
        if (!GameKit.SoundManager) return;
        if (GameKit.SoundManager.loadSoundByPath && GameKit.SoundManager.SoundPaths) {
            GameKit.SoundManager.loadSoundByPath(GameKit.SoundManager.SoundPaths.BuildHammer1);
            GameKit.SoundManager.loadSoundByPath(GameKit.SoundManager.SoundPaths.BuildHammer2);
        }
        this.scheduleBuildAnimationSound(effectNode, BUILD_EFFECT_HAMMER1_TIME, (soundManager) => {
            if (soundManager.playBuildHammer1Sound) soundManager.playBuildHammer1Sound();
        });
        this.scheduleBuildAnimationSound(effectNode, BUILD_EFFECT_HAMMER2_TIME, (soundManager) => {
            if (soundManager.playBuildHammer2Sound) soundManager.playBuildHammer2Sound();
        });
        this.scheduleBuildAnimationSound(effectNode, BUILD_EFFECT_HAMMER3_TIME, (soundManager) => {
            if (soundManager.playBuildHammer2Sound) soundManager.playBuildHammer2Sound();
        });
    }

    private playRenovateFinishSound() {
        if (GameKit.SoundManager && GameKit.SoundManager.playRenovateSound) {
            GameKit.SoundManager.playRenovateSound();
        }
    }

    preloadBuildCompleteEffects() {
        if (!this._buildCompleteEffectPreloadPromise) {
            this._buildCompleteEffectPreloadPromise = Promise.all(BUILD_COMPLETE_SPINE_EFFECTS.map((effect) => loadBuildCompleteSpineData(effect.name)));
        }
        return this._buildCompleteEffectPreloadPromise;
    }

    getBuildCompleteEffectWorldPos() {
        const source = this.getCurrentBuildViewNode() || this.node;
        const transform = source.getComponent(UITransform);
        return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : source.worldPosition.clone();
    }

    getCurrentBuildViewNode() {
        for (const view of this._levelNodeViews || []) {
            if (!view || !view.node || !view.node.active) continue;
            if (view.normal?.active && view.normalSprite?.node) return view.normalSprite.node;
            if (view.damage?.active && view.damageSprite?.node) return view.damageSprite.node;
            return view.node;
        }
        return this.levelNode || this.node;
    }

    getBuildCompleteEffectScale() {
        const source = this.getCurrentBuildViewNode() || this.node;
        const width = source.getComponent(UITransform)?.contentSize.width || 180;
        return Math.max(0.08, Math.min(0.45, width / BUILD_COMPLETE_SPINE_BASE_WIDTH));
    }

    getBuildCompleteEffectOffset(effectInfo: any, scale: number) {
        const bounds = effectInfo.bounds || {};
        return new Vec3(-((Number(bounds.x) || 0) + (Number(bounds.width) || 0) / 2) * scale,
            -((Number(bounds.y) || 0) + (Number(bounds.height) || 0) / 2) * scale, 0);
    }

    getBuildCompleteEffectParent(effectInfo: any) {
        return effectInfo.layer === 'behind' ? this.node : (this.EffectNode || this.node);
    }

    applyBuildCompleteEffectLayer(effectNode: Node, effectInfo: any, parent: Node) {
        effectNode.setSiblingIndex(effectInfo.layer === 'behind'
            ? Math.max(0, this.levelNode?.parent === parent ? this.levelNode.getSiblingIndex() : 0)
            : Math.max(0, parent.children.length - 1));
    }

    removeBuildCompleteEffectNode(effectNode: Node) {
        const index = this._buildCompleteEffectNodes.indexOf(effectNode);
        if (index >= 0) this._buildCompleteEffectNodes.splice(index, 1);
    }

    clearBuildCompleteEffects() {
        this._buildCompleteEffectToken++;
        this._buildCompleteEffectNodes.forEach((node) => { if (node.isValid) node.destroy(); });
        this._buildCompleteEffectNodes = [];
    }

    createBuildCompleteSpineNode(effectInfo: any, skeletonData: sp.SkeletonData | null, worldPos: Vec3, token: number, scale: number) {
        if (!skeletonData || token !== this._buildCompleteEffectToken || !this.node.isValid) return;
        const parent = this.getBuildCompleteEffectParent(effectInfo);
        if (!parent?.isValid) return;
        const effectNode = new Node(effectInfo.name);
        effectNode.parent = parent;
        const transform = parent.getComponent(UITransform);
        effectNode.setPosition((transform ? transform.convertToNodeSpaceAR(worldPos) : worldPos.clone()).add(this.getBuildCompleteEffectOffset(effectInfo, scale)));
        effectNode.setScale(scale, scale, scale);
        this.applyBuildCompleteEffectLayer(effectNode, effectInfo, parent);
        const skeleton = effectNode.addComponent(sp.Skeleton);
        skeleton.skeletonData = skeletonData;
        skeleton.clearTracks();
        skeleton.setToSetupPose();
        this._buildCompleteEffectNodes.push(effectNode);
        let finished = false;
        const destroyEffect = () => {
            if (finished) return;
            finished = true;
            this.removeBuildCompleteEffectNode(effectNode);
            if (effectNode.isValid) effectNode.destroy();
        };
        skeleton.setCompleteListener(destroyEffect);
        skeleton.setAnimation(0, BUILD_COMPLETE_SPINE_ANIM, false);
        this.scheduleOnce(destroyEffect, BUILD_COMPLETE_SPINE_FALLBACK_TIME);
    }

    playBuildCompleteEffects() {
        this.clearBuildCompleteEffects();
        if (!this.node.isValid || !this.EffectNode) return;
        const token = this._buildCompleteEffectToken;
        const worldPos = this.getBuildCompleteEffectWorldPos();
        const scale = this.getBuildCompleteEffectScale();
        this.preloadBuildCompleteEffects().then((datas) => {
            if (token !== this._buildCompleteEffectToken || !this.node.isValid) return;
            BUILD_COMPLETE_SPINE_EFFECTS.forEach((effect, index) => this.createBuildCompleteSpineNode(effect, datas[index], worldPos, token, scale));
        });
    }

    finishBuildAnimation(callback: any) {
        this.isbuild = false;
        this.playRenovateFinishSound();
        const readyPromise = this.updateElement();
        if (readyPromise && readyPromise.then) {
            readyPromise.then(() => {
                this.playBuildingUpgradeShowAnimation();
                if (callback) callback();
            });
            return;
        }
        this.playBuildingUpgradeShowAnimation();
        if (callback) callback();
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
        this.playBuildCompleteEffects();
        const nd = this.buildEffect ? instantiate(this.buildEffect) : null;
        if (!nd || !this.EffectNode) {
            this.finishBuildAnimation(callback);
            return;
        }
        if (nd && this.EffectNode) {
            nd.parent = this.EffectNode;
        }
        const t = ((nd && (nd.getComponent('TimeDestroy') as any)?.t) || 0) / 1.2;
        this.playBuildAnimationSounds(nd);
        this.scheduleOnce(() => {
            this.finishBuildAnimation(callback);
        }, t);
    }

    playStageLevelUpAnimation(callback: any) {
        this.playBuildCompleteEffects();
        this.isbuild = true;
        const nd = this.buildEffect ? instantiate(this.buildEffect) : null;
        if (!nd || !this.EffectNode) {
            this.isbuild = false;
            if (callback) callback();
            return;
        }
        if (nd && this.EffectNode) {
            nd.parent = this.EffectNode;
        }
        const t = ((nd && (nd.getComponent('TimeDestroy') as any)?.t) || 0) / 1.2;
        this.playBuildAnimationSounds(nd);
        this.scheduleOnce(() => {
            this.isbuild = false;
            this.playRenovateFinishSound();
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
        if (!this.shouldOpenByTouchGesture(e)) return;
        const cameraNode = find('Canvas/Main Camera') || find('Canvas/VillageCamera');
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
        const tutorialNodeKey = 'mapId=' + this.mapID + ';buildId=' + this.buildID;
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.CanOperate
            && !Game.MergeTutorialManager.CanOperate(Game.MergeTutorialManager.EventTypes.NodeClick, {
                nodeKey: tutorialNodeKey,
                mapId: this.mapID,
                buildId: this.buildID,
            })) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
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
            Game.MergeTutorialManager.EmitNodeClick(tutorialNodeKey, {
                mapId: this.mapID,
                buildId: this.buildID,
            });
        }
        this.clearMapClickGestureState();
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
    }

    shouldOpenByTouchGesture(e: any, nowTime?: number) {
        if (!e || e.skipHitTest || !e.getLocation || !this.node?.parent?.parent) return true;
        const controller: any = this.node.parent.parent.getComponent('MapControlle');
        return !(controller?.isSingleTapGesture && !controller.isSingleTapGesture(e, nowTime));
    }

    clearMapClickGestureState() {
        const controller: any = this.node?.parent?.parent?.getComponent('MapControlle');
        if (controller?.clearClickGestureState) controller.clearClickGestureState();
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
