/**游戏逻辑 */
import { _decorator, Component, Node, Prefab, UITransform, instantiate, isValid, tween } from 'cc';
const { ccclass, property } = _decorator;

let designHeight = 1136;

function setNodeSize(node: Node, width: number, height: number) {
    const transform = node.getComponent(UITransform) || node.addComponent(UITransform);
    transform.setContentSize(width, height);
}

@ccclass('GamePlay')
export class GamePlay extends Component {
    @property(Node)
    public spVillage: Node | null = null;

    @property(Node)
    public spSlot: Node | null = null;

    @property(Prefab)
    public slotPrefab: Prefab | null = null;

    @property(Node)
    public spDailyBonus: Node | null = null;

    @property(Prefab)
    public dailyBonusPrefab: Prefab | null = null;

    @property(Prefab)
    public animBuild: Prefab | null = null;

    @property(Prefab)
    public animBuildStar: Prefab | null = null;

    public static instance: GamePlay | null = null;
    public static Scenes = {
        Village: 0,
        Slot: 1,
        DailyBonus: 2,
    };

    public villageLoaded = false;
    public villageProgress = 0;
    public villageBuildLoadingStarted = false;
    public mergeLevelLoaded = false;
    public currentScene = -1;
    public inGame = false;
    public changeAnim = false;
    public loadTimer: any = null;
    public mergeRoot: any = null;
    public slotNode: any = null;
    public dailyBonusNode: any = null;
    public mapNode: any = null;
    public oldTownResName: string | null = null;
    public oldSubjectResName: string | null = null;
    public pressed: any = false;
    public pressPos: any = null;
    public pressPosStart: any = null;
    public showCR: any = null;

    onLoad() {
        GamePlay.instance = this;
        (global as any).GamePlay = GamePlay;
    }

    onDestroy() {
        GamePlay.instance = null;
    }

    init() {
        this.currentScene = -1;
        this.addTouchSwipe(UIRoot.instance.node);
        this.loadPrefabs();
    }

    update(dt: any) {
    }

    Clear() {
        this.inGame = false;
        this.closeGamePlay();
    }

    closeGamePlay() {
        this.clearTouchSwipe(UIRoot.instance.node);
        if (this.dailyBonusNode) {
            this.dailyBonusNode.Clear();
            this.dailyBonusNode.node.destroy();
            this.dailyBonusNode = null;
        }
        this.villageLoaded = false;
        this.villageProgress = 0;
        this.villageBuildLoadingStarted = false;
        this.node.active = false;
    }

    backToGamePlay(callback: any) {
        this.addTouchSwipe(UIRoot.instance.node);
        this.loadPrefabs();
        this.node.active = true;
        this.loadUserData();
        this.loadTimer = setInterval(() => {
            if (this.allLoaded()) {
                if (this.loadTimer) clearInterval(this.loadTimer);
                this.loadTimer = null;
                this._updateScene();
                setTimeout(() => {
                    GameMainWindow.instance.enterScene(this.currentScene);
                    this.startVillageBuildLoading();
                    if (callback) callback();
                }, 100);
            }
        }, 100);
    }

    loadPrefabs() {
        if (this.spVillage) this.spVillage.active = true;
        if (this.spSlot) this.spSlot.active = true;
        if (this.spDailyBonus) this.spDailyBonus.active = true;

        if (this.slotPrefab && this.spSlot) {
            let sl = instantiate(this.slotPrefab);
            sl.parent = this.spSlot;
            sl.setPosition(0, 0);
            this.mergeRoot = sl.getComponent('MergeRoot');
            this.slotNode = sl.getComponent('SlotNode');
            sl.active = true;
        }

        if (this.dailyBonusPrefab && this.spDailyBonus) {
            let db = instantiate(this.dailyBonusPrefab);
            db.parent = this.spDailyBonus;
            db.setPosition(0, 0);
            this.dailyBonusNode = db.getComponent('DailyBonusNode');
            db.active = true;
        }
    }

    loadTown(info: any) {
        console.log('loadTown');
        let tm = new Date().getTime();
        this.clearTouchSwipe(UIRoot.instance.node);
        let resName = 'res/village/map' + Game.SUserVillage.MergeMapId();
        this.oldTownResName = resName;
        cce.loadRes(resName, Prefab, (err: any, vPre: Prefab) => {
            if (err || vPre == null) {
                if (CC_DEV) {
                    global.loadEditorTemp = true;
                    return;
                }
                DialogWindow.Show(String.format(GameKit.i18n.t('loadResError'), resName), function() {
                });
                return;
            }
            let itemVillage = instantiate(vPre);
            this.mapNode = itemVillage.getComponent('MapNode');
            if (this.spVillage) itemVillage.parent = this.spVillage;
            itemVillage.setPosition(0, 0);
            itemVillage.setSiblingIndex(0);
            let tm2 = new Date().getTime();
            console.log('loadTown', tm2 - tm);
            this.villageLoaded = true;
        }, (okCount: number, allCount: number) => {
            this.villageProgress = okCount / allCount;
        });
    }

    startVillageBuildLoading() {
        if (!this.mapNode || !isValid(this.mapNode.node)) return;
        if (this.villageBuildLoadingStarted) {
            if (this.mapNode.resumeProgressiveBuildLoading) {
                this.mapNode.resumeProgressiveBuildLoading();
            }
            return;
        }
        this.villageBuildLoadingStarted = true;
        this.mapNode.showInfo();
    }

    shouldKeepVillageBuildLoadingInBackground() {
        if (!this.inGame || !this.villageBuildLoadingStarted) return false;
        if (!this.mapNode || !isValid(this.mapNode.node)) return false;
        return this.mapNode.isBuildLoadingComplete ? !this.mapNode.isBuildLoadingComplete() : false;
    }

    loadMergeLevelMap(levelId: any) {
        console.log('loadMergeLevelMap');
        let tm = new Date().getTime();
        this.mergeLevelLoaded = false;
        this.mergeRoot.loadMergeLevelMap(levelId, () => {
            this.mergeLevelLoaded = true;
            let tm2 = new Date().getTime();
            console.log('loadMergeLevelMap', tm2 - tm);
        });
    }

    releaseSubjectPrefab() {
        if (this.oldSubjectResName) {
            cce.releaseRes(this.oldSubjectResName, Prefab);
            this.oldSubjectResName = null;
            CommonAssets.instance.subjectPrefab = null;
            CommonAssets.instance.cardLimitSkinAssets = null;
        }
    }

    preloadSubjectPrefab(prefabName: any) {
        return new Promise((res, reject) => {
            let resName = 'window/Card/limit/' + prefabName;
            if (this.oldSubjectResName) {
                if (this.oldSubjectResName == resName) {
                    res(0);
                    return;
                }
                cce.releaseRes(this.oldSubjectResName, Prefab);
                this.oldSubjectResName = null;
                CommonAssets.instance.subjectPrefab = null;
                CommonAssets.instance.cardLimitSkinAssets = null;
            }
            this.oldSubjectResName = resName;
            cce.loadRes(resName, Prefab, (err: any, vPre: Prefab) => {
                if (err || vPre == null) {
                    DialogWindow.Show(String.format(GameKit.i18n.t('loadResError'), resName), function() {
                    });
                    reject();
                    return;
                }
                CommonAssets.instance.subjectPrefab = vPre;
                CommonAssets.instance.cardLimitSkinAssets = (vPre as any).data.getComponent('CardLimitSkinAssets');
                if (GamePlay.instance && GamePlay.instance.slotNode) {
                    GamePlay.instance.slotNode.activityRoot.updateActivity();
                }
                res(1);
            }, function(okCount: number, allCount: number) {
            });
        });
    }

    loadUserData() {
        this.loadTown(Game.SUserVillage);
        this.loadMergeLevelMap(1);
        this.dailyBonusNode.onstart();
    }

    allLoaded() {
        return this.villageLoaded && this.mergeLevelLoaded;
    }

    allLoadProgress() {
        return this.villageProgress / 2;
    }

    _preload(vPre: any, _t = 0.3) {
        if (vPre == null) return;
        if (AppKit.SdkManager.IsNative()) return;
        let wnd = instantiate(vPre instanceof Prefab ? vPre : vPre);
        wnd.parent = AppMain.instance.node;
        wnd.setPosition(-3000, -3000);
        setNodeSize(wnd, 2, 2);
        wnd.active = true;
        AppMain.instance.scheduleOnce(() => {
            wnd.active = false;
            wnd.destroy();
            cce.releaseRes(vPre._resName, Prefab);
        }, _t);
        return wnd;
    }

    preloadFirst() {
        if (AppKit.SdkManager.IsNative()) return;
    }

    preloadAnim() {
        if (AppKit.SdkManager.IsNative()) return;
    }

    preloadGames() {
        if (AppKit.SdkManager.IsNative()) return;
        try {
            setTimeout(() => {
                UIRoot.instance.preloadWindow('MergePassPortMainWindow');
                if (!this || !this.mergeRoot) return;
                UIRoot.instance.preloadWindow('InviteWindow');
                UIRoot.instance.preloadWindow('GiftsWindow');
            }, 5000);
            setTimeout(() => {
                if (!this || !this.mergeRoot) return;
                this._preload(this.dailyBonusNode.node);
                if (AppKit.PaymentWrap.PayVisiable()) UIRoot.instance.preloadWindow('ShopWindow');
            }, 10000);
        } catch (e) {
        }
    }

    EnterGame() {
        this.inGame = true;
        if (this.isMergeTutorialRunning()) {
            this.openScene(GamePlay.Scenes.Slot);
            this.changeScene(this.currentScene, null, true);
            AppKit.LogEventWrap.logEvent('game_start');
            AppKit.SdkManager.EnterGame();
            this.startVillageBuildLoading();
            return;
        }
        this.openScene(GamePlay.Scenes.Slot);
        this.changeScene(this.currentScene, null, true);
        AppKit.LogEventWrap.logEvent('game_start');
        AppKit.SdkManager.EnterGame();
        this.startVillageBuildLoading();
    }

    switchScene(s: any) {
        this.openScene(s);
        this.changeScene(this.currentScene, () => {
        }, true);
    }

    openScene(s: any) {
        if (!this.inGame) return;
        if (this.currentScene === s) return;
        this.currentScene = s;
        this._updateScene();
    }

    changeScene(s: any, callback?: any, _same?: any) {
        if (!this.inGame) return;
        if (this.isChangeAnim()) return;
        if (this.dailyBonusNode && this.dailyBonusNode.isRunning()) return;
        if (!_same && this.isMergeTutorialRunning() && s !== GamePlay.Scenes.Slot) return;
        if (!_same && this.currentScene === s) {
            if (callback) callback();
            return;
        }
        if (AppKit.NativeWrap.isNewApp()) {
            if (s > GamePlay.Scenes.Slot) return;
        }
        if (s < GamePlay.Scenes.Village || s > GamePlay.Scenes.DailyBonus) return;

        this.changeAnim = true;
        GameMainWindow.instance.enterScene(s);
        if (this.currentScene === s) {
            tween(this.node)
                .call(() => { this.currentScene = s; this._updateScene(); })
                .delay(0.3)
                .call(() => {
                    this.changeAnim = false;
                    if (callback) callback();
                    if (s === GamePlay.Scenes.Slot) AppKit.SdkManager.wxGameClubButtonShow();
                })
                .start();
        } else {
            tween(this.node)
                .call(() => { ChangeSceneManager.instance.show(); })
                .delay(0.3)
                .call(() => { this.currentScene = s; this._updateScene(); })
                .delay(0.25)
                .call(() => { ChangeSceneManager.instance.hide(); })
                .delay(0.55)
                .call(() => {
                    this.changeAnim = false;
                    if (callback) callback();
                    if (s === GamePlay.Scenes.Slot) AppKit.SdkManager.wxGameClubButtonShow();
                })
                .start();
        }
        AppKit.SdkManager.wxGameClubButtonHide();
    }

    _updateScene() {
        if (this.spVillage) this.spVillage.active = this.currentScene === GamePlay.Scenes.Village;
        if (this.spSlot) this.spSlot.active = this.currentScene === GamePlay.Scenes.Slot;
        if (this.spDailyBonus) this.spDailyBonus.active = this.currentScene === GamePlay.Scenes.DailyBonus;
        if (this.currentScene === GamePlay.Scenes.Village) {
            this.startVillageBuildLoading();
        } else if (this.mapNode && this.mapNode.pauseProgressiveBuildLoading && !this.shouldKeepVillageBuildLoadingInBackground()) {
            this.mapNode.pauseProgressiveBuildLoading();
        }
    }

    isChangeAnim() {
        return this.changeAnim;
    }

    isBusy() {
        if (this.isChangeAnim()) return true;
        if (this.dailyBonusNode && this.dailyBonusNode.isRunning()) return true;
        return false;
    }

    isMergeTutorialRunning() {
        return !!(Game.MergeTutorialManager && !Game.MergeTutorialManager.IsFinished());
    }

    addTouchSwipe(t_node: Node) {
        this.pressed = false;
        this.pressPos = null;
        this.pressPosStart = null;
        t_node.on(Node.EventType.TOUCH_START, this.gameTouchStart, this);
        t_node.on(Node.EventType.TOUCH_MOVE, this.gameTouchMove, this);
        t_node.on(Node.EventType.TOUCH_END, this.gameTouchEnd, this);
        t_node.on(Node.EventType.TOUCH_CANCEL, this.gameTouchCancel, this);
    }

    clearTouchSwipe(t_node: Node) {
        this.pressed = false;
        this.pressPos = null;
        this.pressPosStart = null;
        t_node.off(Node.EventType.TOUCH_START, this.gameTouchStart, this);
        t_node.off(Node.EventType.TOUCH_MOVE, this.gameTouchMove, this);
        t_node.off(Node.EventType.TOUCH_END, this.gameTouchEnd, this);
        t_node.off(Node.EventType.TOUCH_CANCEL, this.gameTouchCancel, this);
    }

    gameTouchStart(e: any) {
        if (!this.node.activeInHierarchy) return;
        if (GamePlay.Scenes.Slot == this.currentScene) return;
        this.pressed = true;
        this.pressPos = 0;
        this.pressPosStart = e.getLocation();
        if (this.pressPosStart.x > UIRoot.instance.winSize.width - 70) {
            this.showCR = true;
            setTimeout(() => {
                if (this.isBusy()) return;
                if (this.showCR) {
                    DialogWindow.Show(encryptCode.simbas(String.fromCharCode(...GameKit.TimeUtil.specialUItime, ...GameKit.GameEvent.speEvUInames)), nullFunction);
                }
            }, 30000);
        }
    }

    gameTouchMove(e: any) {
        if (!this.node.activeInHierarchy) return;
        if (GamePlay.Scenes.Slot == this.currentScene) return;
        this.pressPos += e.touch.getDelta().y;
        this.showCR = null;
        if (this.pressPosStart && this.pressPos > 70) {
            if (this.currentScene > GamePlay.Scenes.Village) {
                this.changeScene(this.currentScene - 1);
                this.pressPos = 0;
            }
        } else if (this.pressPosStart && this.pressPos < -70) {
            if (this.currentScene < GamePlay.Scenes.DailyBonus) {
                this.changeScene(this.currentScene + 1);
                this.pressPos = 0;
            }
        } else if (this.pressPosStart && this.pressPosStart.x < 70) {
            if (e.getLocation().x > this.pressPosStart.x + 100) {
                if (this.isMergeTutorialRunning()) return;
                if (this.isBusy()) return;
                GameKit.SoundManager.playSound('se_open');
                UIRoot.instance.openChildWindow('MenuWindow');
                this.pressPosStart = null;
            }
        } else if (this.pressPosStart && this.pressPosStart.x > UIRoot.instance.winSize.width - 70) {
            if (e.getLocation().x < this.pressPosStart.x - 100) {
            }
        } else if (!AppKit.NativeWrap.isNewApp()) {
            if (this.pressPosStart && e.getLocation().x > this.pressPosStart.x + 100) {
                if (this.currentScene === GamePlay.Scenes.DailyBonus) {
                    if (this.isBusy()) return;
                    this.dailyBonusNode.changeGoldToNormal();
                    this.pressPosStart = null;
                }
            } else if (this.pressPosStart && e.getLocation().x < this.pressPosStart.x - 100) {
                if (this.currentScene === GamePlay.Scenes.DailyBonus) {
                    if (this.isBusy()) return;
                    this.dailyBonusNode.changeNormalToGold();
                    this.pressPosStart = null;
                }
            }
        }
    }

    gameTouchEnd(e: any) {
        if (!this.node.activeInHierarchy) return;
        if (GamePlay.Scenes.Slot == this.currentScene) return;
        this.pressed = false;
        this.pressPos = null;
        this.pressPosStart = null;
        this.showCR = null;
    }

    gameTouchCancel(e: any) {
        if (!this.node.activeInHierarchy) return;
        if (!e.simulate) {
            this.pressed = false;
            this.pressPos = null;
            this.pressPosStart = null;
            this.showCR = null;
        }
    }
}

(global as any).GamePlay = GamePlay;
export default GamePlay;