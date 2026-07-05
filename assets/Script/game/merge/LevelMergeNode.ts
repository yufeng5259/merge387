import { _decorator, Component, Game as CocosGame, game, instantiate, isValid, Node, NodePool, Prefab, SpriteAtlas, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';
import MergeItem from './MergeItem';
import MergeUtil from './MergeUtil';
import MergeTypes from './MergeTypes';

const { ccclass, property } = _decorator;

type AnyRecord = Record<string, any>;
type Callback = () => void;

@ccclass('LevelMergeNode')
export class LevelMergeNode extends Component {
    @property
    public gridSize = MergeUtil.DEFAULT_GRID_SIZE.clone();
    @property
    public mergeBoardNodeSize = MergeUtil.DEFAULT_BOARD_LAYOUT.nodeSize.clone();
    @property
    public mergeBoardItemSize = MergeUtil.DEFAULT_BOARD_LAYOUT.itemSize.clone();
    @property
    public mergeBoardCellOffset = MergeUtil.DEFAULT_BOARD_LAYOUT.offset;
    @property(Prefab)
    public itemTemple: Prefab = null!;
    @property(Node)
    public picFrame: Node = null!;
    @property(SpriteAtlas)
    public iconAtlas: SpriteAtlas = null!;
    @property(SpriteAtlas)
    public envIconAtlas: SpriteAtlas = null!;

    public itemPool = new NodePool();
    public touchStartNode: Node | null = null;
    public touchStartPosName: string | null = null;
    public lastTouchStartPosName: string | null = null;
    public lastSelectMergeItem: MergeItem | null = null;
    public waitCreateAnimItemsTilePos: Vec2[] = [];
    public selectMergeId = -1;
    public itemCanDrag = false;
    public pressPosStart: Vec2 | null = null;
    public activeTouchId: any = null;
    public isTouchSettling = false;
    private _mergeTouchEffectCellKey: string | null = null;
    private _isNetRunning = false;
    private _breakingBubbleByCellKey: AnyRecord = {};
    private _pendingGeneratedCells: AnyRecord = {};
    private _onGameShowRefreshBubbleCountdown: Callback | null = null;
    private _scissorsTransparentNodes: MergeItem[] = [];
    private twoCanMergeTweens: Array<{ stop: () => void }> = [];
    private twoCanMergeAnimSchedule: Callback | null = null;
    private twoCanMergeAnimRestoreState: Array<{ node: Node, scale: Vec3, position: Vec3 }> = [];
    private initMergeMapData: AnyRecord = {};
    // =========================================================================
    // 生命周期
    // =========================================================================

    onLoad() {
        this.itemPool = new NodePool()

        /** @type {Node|null} 当前手指拖动的棋子节点 */
        this.touchStartNode = null
        /** @type {string|null} 拖动起点格键 "tx_ty" */
        this.touchStartPosName = null
        /** @type {string|null} 上一手结束时的格键，用于双击判定 */
        this.lastTouchStartPosName = null
        /** @type {MergeItem|null} 上一手选中过的 MergeItem（与当前节点比较判断是否双击同棋） */
        this.lastSelectMergeItem = null

        this.waitCreateAnimItemsTilePos = []

        this.selectMergeId = -1
        this.picFrame.active = false
        this.itemCanDrag = false
        this.activeTouchId = null
        this.isTouchSettling = false
        this._mergeTouchEffectCellKey = null

        this.twoCanMergeTweens = []
        this.twoCanMergeAnimSchedule = null
        this.twoCanMergeAnimRestoreState = []

        /** saveMap 请求进行中时禁止再次提交，避免并发写档 */
        this._isNetRunning = false
        this._breakingBubbleByCellKey = {}
        this._pendingGeneratedCells = {}
        this._onGameShowRefreshBubbleCountdown = null

        this._syncMergeMapsFromSceneChildren()
    }
    /**是否正在操作
     * 在操作棋盘时，禁止再次操作
     */
    IsNetRunning() {
        return this._isNetRunning
    }
    SetNetRunning(isNetRunning?: any) {
        this._isNetRunning = isNetRunning
    }


    start() {
        this.registerEvents()
        this.refreshBubbleCountdown()
        this.schedule(this.refreshBubbleCountdown, 1)
        this._onGameShowRefreshBubbleCountdown = () => {
            this.refreshBubbleCountdown()
        }
        game.on(CocosGame.EVENT_SHOW, this._onGameShowRefreshBubbleCountdown, this)
    }

    onDestroy() {
        this._clearMergeTouchEffect()
        this.unschedule(this.refreshBubbleCountdown)
        if (this._onGameShowRefreshBubbleCountdown) {
            game.off(CocosGame.EVENT_SHOW, this._onGameShowRefreshBubbleCountdown, this)
            this._onGameShowRefreshBubbleCountdown = null
        }
        this.clearItemPool()
    }

    // =========================================================================
    // 地图与数据（与 MergeItem / 服务器对齐）
    // =========================================================================

    /**
     * 根据子节点世界位置重建三件套（编辑器摆好的棋盘进游戏时用一次）。
     */
    _syncMergeMapsFromSceneChildren() {
        this.initMergeMapData = {}
        for (let i = 0; i < this.node.children.length; i++) {
            let child = this.node.children[i]
            let mergeItem = child.getComponent(MergeItem)
            if (!mergeItem) continue
            let tp = GameKit.MergeUtil.px2tile(child.position.x, child.position.y, this.getMergeBoardLayout())
            let key = tp.x + '_' + tp.y
            this.initMergeMapData[key] = mergeItem.GetMergeData()
        }
    }

    /** @param {string} posName "tx_ty" */
    _parseTileKey(posName?: any) {
        let arr = posName.split('_')
        let obj={ tx: parseInt(arr[0], 10), ty: parseInt(arr[1], 10) }
        return obj
    }

    /**
     * 本棋盘传给 MergeUtil 的布局；MergeUI 等外部可从 mergeLevelNode 取同一套参数。
     * @returns {{ nodeSize: Vec2, itemSize: Vec2, offset: number }}
     */
    getMergeBoardLayout() {
        return {
            nodeSize: this.mergeBoardNodeSize,
            itemSize: this.mergeBoardItemSize,
            offset: this.mergeBoardCellOffset,
        }
    }

    /** @param {number} mergeId @returns {SpriteFrame} */
    GetSpriteFrameByMergeId(mergeId?: any) {
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId)
        return this.iconAtlas.getSpriteFrame(meta.Icon())
    }

    /**
     * @param {Object.<string,string>} mapData 键为 "tx_ty"，值为数据串；isFirst 时先向服务器拉平再铺盘
     */
    InitMergeMap(mapData?: any, isFirst: any = false, cb?: any) {
        let initForMergeData = () => {
            for (let key in Game.SUserMerge.GetMergeMapData()) {
                let { tx, ty } = this._parseTileKey(key)
                let dataStr = Game.SUserMerge.GetMergeMapData()[key]
                if (!dataStr) continue

                let childNode = this.getItem()
                const childPos = GameKit.MergeUtil.tile2px(tx, ty, this.getMergeBoardLayout())
                childNode.setPosition(childPos.x, childPos.y, 0)
                childNode.parent = this.node
                let mergeItem = childNode.getComponent(MergeItem)
                mergeItem.InitMergeItem(tx, ty, Game.SUserMerge.ParseMergeMapData(dataStr))
            }

            GamePlay.instance.mergeRoot.mergeNodeUI.InitUI()
            this.updateOrderStatus()
            this.PlayTwoCanMergeAnim()

            if (cb) cb()
        }
        let itemChilds = this.node.children.filter(child => child.getComponent(MergeItem))
        while (itemChilds.length > 0) {
            this.putItem(itemChilds.shift())
        }
        if (isFirst) {
            if (Game.MergeTutorialManager && Game.MergeTutorialManager.ShouldBlockMergeSave && Game.MergeTutorialManager.ShouldBlockMergeSave()) {
                if (SR.SRMerge.InitLocalMergeMap) {
                    SR.SRMerge.InitLocalMergeMap(this.initMergeMapData)
                } else {
                    Game.SUserMerge.UpdateMergeMap(this.initMergeMapData)
                }
                initForMergeData()
                return
            }
            let req = SR.SRMerge.saveMapLite("init", { mapData: this.initMergeMapData, lite: false })
            req.SetCallBack(res => {
                initForMergeData()
            })
            req.Send()
        } else {
            initForMergeData()
        }
    }

    /** 订单系统传入已完成 id 列表，刷新各格 ok 标 */
    updateStageCompleteItem(completeIds?: any, completeOrderIds?: any) {
        completeIds = completeIds || []
        completeOrderIds = completeOrderIds || []
        this.node.children.forEach(node => {
            let item = node.getComponent(MergeItem)
            if (item) item.CheckComplete(completeIds, completeOrderIds)
        });
    }

    /**
     * 订单交付：从棋盘或仓库取棋子飞到目标点后销毁并刷新订单 UI。
     * @param {Node} orderNode
     * @param {Object.<string, string[]>} orderData matchedCells：键为需求 mergeId（与订单槽位一致）
     * @param {Object.<string, Vec2>|Array<{id:number, globalPos:Vec2}>} globalPosSource 键为 mergeId 的世界坐标表；或旧版 {id, globalPos} 数组
     * @param {Function} [cb]
     */
    ClaimOrderReward(orderData?: any, globalPosSource?: any, storeDataStrArr?: any, cb?: any) {
        let self = GamePlay.instance.mergeRoot.mergeLevelNode

        let storeBtnGlobalPos = GamePlay.instance.mergeRoot.mergeNodeUI.GetStoreButtonGlobalPos()
        let storeBtnLocalPos = self.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(storeBtnGlobalPos.x, storeBtnGlobalPos.y, storeBtnGlobalPos.z || 0), new Vec3())
        let matchNodes = []
        let mergeDataStr, itemNode
        const warehouseMergeData = Array.isArray(storeDataStrArr) ? storeDataStrArr : []
        let usePosMap = globalPosSource && typeof globalPosSource === 'object' && !Array.isArray(globalPosSource)
        const lookupPosFromMap = (mergeIdKey) => {
            if (!usePosMap) return null
            let w = globalPosSource[mergeIdKey]
            if (!w) w = globalPosSource[String(parseInt(mergeIdKey, 10))]
            return w || null
        }


        for (const mergeIdKey in orderData) {
            if (!Object.prototype.hasOwnProperty.call(orderData, mergeIdKey)) continue
            let slotGlobalPos = lookupPosFromMap(mergeIdKey)
            const pnameArr = orderData[mergeIdKey]
            pnameArr.forEach(pname => {
                if (pname.indexOf('warehouse') > -1) {
                    mergeDataStr = warehouseMergeData.shift()
                    if (!mergeDataStr) {
                        console.error("warehouse order reward missing merge data", pname)
                        return
                    }
                    itemNode = this.getItem()
                    itemNode.setPosition(storeBtnLocalPos)
                    itemNode.parent = this.node
                    itemNode.getComponent(MergeItem).InitMergeItem(0, 0, mergeDataStr)
                } else {
                    itemNode = self.node.getChildByName(pname);
                    if (!itemNode) {
                        console.error("itemNode not found", pname);
                        return;
                    }
                    mergeDataStr = itemNode.getComponent(MergeItem).GetMergeData()
                }
                let globalPos = null
                if (!usePosMap && Array.isArray(globalPosSource)) {
                    let mergeId = mergeDataStr.split('_')[0]
                    let posIdx = globalPosSource.findIndex(pos => String(pos.id) === String(mergeId))
                    let raw = posIdx >= 0 ? globalPosSource.splice(posIdx, 1)[0].globalPos : null
                    globalPos = raw && raw.clone ? raw.clone() : raw
                } else if (usePosMap && slotGlobalPos) {
                    globalPos = slotGlobalPos.clone()
                }
                let mergeItem = itemNode.getComponent(MergeItem)
                if (mergeItem && mergeItem.bottomRect) {
                    mergeItem.bottomRect.active = false
                }
                matchNodes.push({ itemNode: itemNode, globalPos: globalPos, pname: pname })
            })
        }

        self.removeNodeAnimFromOrder(matchNodes, cb)


        self.touchStartNode = null
        self.touchStartPosName = null
        self.selectMergeId = -1;
        self.picFrame.active = false;
        GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(null);
        self.lastSelectMergeItem = null;
        self.lastTouchStartPosName = null;

    }
    _getMergeStageIds() {
        let mergeStageIds = []
        this.node.children.forEach(node => {
            let item = node.getComponent(MergeItem)
            if (item&&item.IfCanMerge()) mergeStageIds.push(item.GetMergeStageId())
        });
        return mergeStageIds
    }
    /** 汇总棋盘+仓库里的 mergeId，交给订单 UI 计算完成度并刷新皇冠标记 
     * 在提取，合成，领取任务后要更新该方法
    */
    updateOrderStatus(completeEffectWorldPos?: any) {
        let self = GamePlay.instance.mergeRoot.mergeLevelNode
        let stageIds = self._getMergeStageIds()
        let storeIds = Game.SUserMerge.GetWarehouseDataId()
        let allIds = stageIds.concat(storeIds)
        if (allIds.length > 0) {
            let completeResult = GamePlay.instance.mergeRoot.mergeNodeUI.CheckOrderComplete(allIds)
            self.updateStageCompleteItem(completeResult.completeIds, completeResult.completeOrderIds)
            if (completeResult.hasNewCompleteOrder && completeEffectWorldPos) {
                GamePlay.instance.mergeRoot.mergeNodeUI.PlayJueSeWanChengEnter(completeEffectWorldPos)
            }
        }
    }
    /**
     * 订单交付飞行动画：单段 tween，位移+缩放到终点共用 quartInOut，整条曲线连续；多条同时出发、同时到达。
     * @param {{ itemNode: Node, globalPos: Vec2|null, pname: string }[]} matchNodes
     * @param {Function} [cb]
     */
    removeNodeAnimFromOrder(matchNodes?: any, cb?: any) {
        let self = this
        if (!matchNodes || matchNodes.length === 0) {
            if (cb) cb()
            return
        }
        const cleanupAfterFly = (pname, itemNode) => {
            if (pname && pname.indexOf('warehouse') === -1) {

            }
            self.putItem(itemNode)
        }
        let pending = 0
        let cbDone = false
        const finishOne = () => {
            pending--
            if (pending === 0 && !cbDone) {
                cbDone = true
                if (cb) cb()
            }
        }

        let maxTm = 0
        const flyMetas = []
        matchNodes.forEach((entry) => {
            let itemNode = entry.itemNode
            let globalPos = entry.globalPos ? entry.globalPos.clone() : null
            let pname = entry.pname
            if (!itemNode || !isValid(itemNode)) {
                flyMetas.push({ kind: 'invalid' })
                return
            }
            if (!globalPos) {
                flyMetas.push({ kind: 'noglobal', pname, itemNode })
                return
            }
            let startPos = itemNode.position.clone()
            let endPos = self.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(globalPos.x, globalPos.y, globalPos.z || 0), new Vec3())
            let dx = endPos.x - startPos.x
            let dy = endPos.y - startPos.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            let tm = Math.max((dist / 320) * 0.55, 0.45)
            maxTm = Math.max(maxTm, tm)
            flyMetas.push({
                kind: 'fly',
                pname,
                itemNode,
                startPos,
                endPos,
                dist,
            })
        })
        if (maxTm <= 0) {
            maxTm = 0.45
        }
        pending = flyMetas.length
        if (pending === 0) {
            if (cb) cb()
            return
        }
        this.scheduleOnce(() => {
            flyMetas.forEach((meta) => {
                if (meta.kind === 'invalid') {
                    finishOne()
                    return
                }
                if (meta.kind === 'noglobal') {
                    cleanupAfterFly(meta.pname, meta.itemNode)
                    finishOne()
                    return
                }
                let { itemNode, startPos, endPos, pname } = meta
                let tm = maxTm
                itemNode.setSiblingIndex(self.node.children.length)
                Tween.stopAllByTarget(itemNode)
                itemNode.setPosition(startPos)
                tween(itemNode)
                    .to(tm, {
                        position: new Vec3(endPos.x, endPos.y, endPos.z || 0),
                        scale: new Vec3(0.6, 0.6, 0.6),
                    }, { easing: 'quartInOut' })
                    .call(() => {
                        cleanupAfterFly(pname, itemNode)
                        finishOne()
                    })
                    .start()
            })
        })


    }
    /**
     * @param {object} args 业务参数，含 actionType（见 MergeTypes.MergeActionType）等
     * @returns {Promise|undefined} 已在请求中则直接 return undefined
     */
    _vibrate(duration: any = 80) {
        if (typeof AppKit === 'undefined' || !AppKit.NativeWrap || !AppKit.NativeWrap.Vibrate) return
        AppKit.NativeWrap.Vibrate(duration)
    }

    _vibrateForMergeAction(actionType?: any) {
        if (actionType === MergeTypes.MergeActionType.MOVE || actionType === MergeTypes.MergeActionType.GENERATE) {
            this._vibrate(80)
        } else if (actionType === MergeTypes.MergeActionType.MERGE) {
            this._vibrate(120)
        }
    }

    updateMergeMapEvent(args?: any) {
        // if (this.IsNetRunning()) return
        this.SetNetRunning(true)
        return Promise.resolve()
            .then(() => SR.SRMerge.saveMap(args))
            .then(result => {
                if (result && result.success) {
                    this._vibrateForMergeAction(args && args.actionType)
                    if (result.__serverPromise && typeof result.__serverPromise.then === "function") {
                        result.__serverPromise.catch((err) => {
                            console.error(err, "updateMergeMapEvent server persist error")
                        })
                    }
                    this.PlayTwoCanMergeAnim()
                    return result
                }

                throw new Error(result ? result.message : 'saveMap failed')
            })
            .then(result => {
                this.SetNetRunning(false)
                return result
            }, error => {
                this.SetNetRunning(false)
                throw error
            })
    }

    // =========================================================================
    // 节点池（getItem 后务必 InitMergeItem 重置表现与数据）
    // =========================================================================

    /** @returns {Node} */
    getItem() {
        let node = null
        if (this.itemPool.size() > 0) {
            node = this.itemPool.get()
        } else {
            node = instantiate(this.itemTemple)
        }
        node!.setScale(1, 1, 1);
        return node
    }

    putItem(itemNode?: any) {
        if (itemNode && isValid(itemNode)) {
            Tween.stopAllByTarget(itemNode)
            this.itemPool.put(itemNode)
        }
    }

    clearItemPool() {
        this.itemPool.clear()
    }

    // =========================================================================
    // 触摸：选子、拖拽、落点判定（双击意图委托 MergeItem）
    // =========================================================================

    _getTouchUILocation(touchOrEvent?: any) {
        if (touchOrEvent && touchOrEvent.getUILocation) {
            let pos = touchOrEvent.getUILocation()
            return new Vec2(pos.x, pos.y)
        }
        if (touchOrEvent && touchOrEvent.getLocation) {
            let pos = touchOrEvent.getLocation()
            return new Vec2(pos.x, pos.y)
        }
        return new Vec2()
    }

    _getTouchLocalPoint(touchOrEvent?: any) {
        let pos = this._getTouchUILocation(touchOrEvent)
        return this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0), new Vec3())
    }

    registerEvents() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    _applyScissorsTransparent(startMergeItem?: any) {
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, startMergeItem.mergeId)
        if (!meta || meta.FunctionType() !== MergeTypes.MergeFunctionType.SCISSORS) return
        this._scissorsTransparentNodes = []
        this.node.children.forEach(child => {
            let mi = child.getComponent(MergeItem)
            if (!mi || mi === startMergeItem) return
            let itemMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mi.mergeId)
            if (itemMeta && !itemMeta.IfCanCut()) {
                mi.HalfTransparent()
                this._scissorsTransparentNodes.push(mi)
            }
        })
    }

    _restoreScissorsTransparent() {
        if (!this._scissorsTransparentNodes || this._scissorsTransparentNodes.length === 0) return
        this._scissorsTransparentNodes.forEach(mi => {
            if (mi && mi.node && isValid(mi.node)) {
                mi.RestoreTransparent()
            }
        })
        this._scissorsTransparentNodes = []
    }

    _parseTutorialTileList(value?: any) {
        if (!value) return []
        return value.split(';').map(x => x.trim()).filter(Boolean)
    }

    _getCurrentMergeTutorialRule() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.currentMeta) {
            let completeType = Game.MergeTutorialManager.currentMeta.CompleteType ? Game.MergeTutorialManager.currentMeta.CompleteType() : ''
            if (completeType === Game.MergeTutorialManager.CompleteTypes.MergeDrag) {
                let drag = Game.MergeTutorialManager.GetCurrentMergeDragParam ? Game.MergeTutorialManager.GetCurrentMergeDragParam() : null
                if (drag) {
                    return {
                        type: 'merge_drag',
                        startTiles: [drag.from],
                        dropTiles: [drag.to],
                        triggerEnd: '',
                    }
                }
            }
            if (completeType === Game.MergeTutorialManager.CompleteTypes.GeneratorClick) {
                let gen = Game.MergeTutorialManager.ParseGeneratorParam ? Game.MergeTutorialManager.ParseGeneratorParam(Game.MergeTutorialManager.currentMeta.CompleteParam()) : null
                return {
                    type: 'click_generator_only',
                    startTiles: gen && gen.tile ? [gen.tile] : [],
                    dropTiles: [],
                    triggerEnd: '',
                }
            }
        }
        return null
    }

    _isTutorialStartTileAllowed(tileKey?: any) {
        let rule = this._getCurrentMergeTutorialRule()
        if (!rule || !rule.startTiles || rule.startTiles.length === 0) return true
        return rule.startTiles.indexOf(tileKey) >= 0
    }

    _isTutorialClickGeneratorOnlyRule() {
        let rule = this._getCurrentMergeTutorialRule()
        return !!(rule && rule.type === 'click_generator_only')
    }

    _isTutorialDropTileAllowed(tileKey?: any) {
        let rule = this._getCurrentMergeTutorialRule()
        if (rule && rule.type === 'click_generator_only') return false
        if (!rule || !rule.dropTiles || rule.dropTiles.length === 0) return true
        return rule.dropTiles.indexOf(tileKey) >= 0
    }

    _isMergeTutorialDragRuleActive() {
        let rule = this._getCurrentMergeTutorialRule()
        return !!(rule && rule.type === 'merge_drag')
    }

    scheduleTwoCanMergeHintAfterIdle(delay: any = 0) {
        this.scheduleOnce(() => {
            if (!this.node || !isValid(this.node)) return
            this.PlayTwoCanMergeAnim()
        }, delay)
    }

    _handleTutorialRejectedAction(startPos?: any, startMergeItem?: any, flyDuration?: any) {
        this._flyback(startPos, startMergeItem.node, flyDuration, () => {
            this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
            this.lastSelectMergeItem = startMergeItem
            this.lastTouchStartPosName = this.touchStartPosName
            this.scheduleTwoCanMergeHintAfterIdle()
        })
    }

    _refreshMergeItemFromMap(mergeItem?: any, cellKey?: any) {
        if (!mergeItem || !cellKey) return false
        let mapData = Game.SUserMerge.GetMergeMapData()
        let dataStr = mapData ? mapData[cellKey] : null
        if (!dataStr) {
            if (mergeItem.node && isValid(mergeItem.node)) {
                this.putItem(mergeItem.node)
            }
            return false
        }
        let tile = this._parseTileKey(cellKey)
        if (isNaN(tile.tx) || isNaN(tile.ty)) return false
        mergeItem.InitMergeItem(tile.tx, tile.ty, Game.SUserMerge.ParseMergeMapData(dataStr))
        return true
    }

    _refreshExpiredBubbleCells(expired?: any, excludeKeys?: any) {
        if (!expired || !Array.isArray(expired)) return
        excludeKeys = excludeKeys || {}
        expired.forEach(item => {
            if (!item || !item.cellKey || excludeKeys[item.cellKey]) return
            let itemNode = this.node.getChildByName(item.cellKey)
            let mergeItem = itemNode ? itemNode.getComponent(MergeItem) : null
            if (mergeItem) {
                this._refreshMergeItemFromMap(mergeItem, item.cellKey)
            }
        })
    }

    _tryCompleteMergeTutorialStep(startTileKey?: any, dropTileKey?: any) {
        let rule = this._getCurrentMergeTutorialRule()
        return
    }

    _isCookingRecipeIngredient(dropMergeItem?: any, startMergeItem?: any) {
        if (!dropMergeItem || !startMergeItem || !Meta.MergeCookingRecipeMeta) return false
        let dropMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, dropMergeItem.mergeId)
        if (!dropMeta || dropMeta.FunctionType() !== MergeTypes.MergeFunctionType.COOKING) return false
        let recipes = Meta.MergeCookingRecipeMeta.GetRecipesByToolId(dropMergeItem.mergeId) || []
        for (let i = 0; i < recipes.length; i++) {
            let ingredientIds = recipes[i].IngredientIds() || []
            for (let j = 0; j < ingredientIds.length; j++) {
                if (ingredientIds[j] == startMergeItem.mergeId) {
                    return true
                }
            }
        }
        return false
    }

    _isCookingToolBusy(mergeItem?: any) {
        if (!mergeItem) return false
        let cookingId = Game.SUserMerge.getGeneratorIdByMergeTilePos(mergeItem.tx, mergeItem.ty)
        let cookingData = cookingId ? Game.SUserMerge.GetCookingState(cookingId) : null
        return cookingData && cookingData.status == "cooking"
    }

    _refreshAllMergeItemCapabilities() {
        this.node.children.forEach(node => {
            let item = node.getComponent(MergeItem)
            if (!item) return
            if (item.refreshCapabilities) item.refreshCapabilities()
            if (item.showCooking) item.showCooking()
        })
    }

    /**
     * 执行 MergeItem.resolveSameCellDoubleTap 的意图（弹窗、产出、开启生成器、收集等）。
     * @param {*} startMergeItem MergeItem
     * @param {{ intent: string }} tapResult
     * @returns {boolean} true 则 onTouchEnd 应直接 return
     */
    _applyMergeDoubleTapResult(startMergeItem?: any, tapResult?: any) {
        if (!tapResult) return false
        let intent = tapResult.intent
        switch (intent) {
            case MergeTypes.MergeDoubleTapIntent.OPEN_THREE_TO_ONE:
                //打开3合1窗口
                let instanceId = Game.SUserMerge.getGeneratorIdByMergeTilePos(tapResult.fromTilePos.x, tapResult.fromTilePos.y)
                let funcOptions = null;
                let showThreeToOneWindowCallback = (mergeDataStr) => {
                    if (!mergeDataStr) return;
                    GamePlay.instance.mergeRoot.mergeLevelNode.DeleteSelectMergeItem(startMergeItem.node, tapResult.cellKey, false, { actionType: "delete", showAnim: false });

                    this.CreateFromWharehouse(tapResult.cellKey, mergeDataStr)
                    GamePlay.instance.mergeRoot.mergeNodeUI.PlayWaitCreateAnimItems()
                    this.updateOrderStatus()
                }
                if (instanceId) {
                    funcOptions = GameKit.PlayerPrefs.GetObject(instanceId)
                    if (!funcOptions) {
                        this.updateMergeMapEvent({ actionType: "func", cellKey: tapResult.cellKey, funcAction: "open" }).then((result) => {
                            funcOptions = result.funcOptions
                            GameKit.PlayerPrefs.SetObject(instanceId, funcOptions)
                            UIRoot.instance.openChildWindow("ThreeToOneWindow", {
                                instanceId: instanceId,
                                cellKey: tapResult.cellKey,
                                targetCellKey: tapResult.cellKey,
                                funcOptions: funcOptions, showCallback: (wnd) => {
                                    wnd.addOnCloseFunc(() => {
                                        showThreeToOneWindowCallback(wnd.pickPieceData)
                                    });
                                }
                            })
                        });
                    } else {
                        UIRoot.instance.openChildWindow("ThreeToOneWindow", {
                            instanceId: instanceId,
                            cellKey: tapResult.cellKey,
                            targetCellKey: tapResult.cellKey,
                            funcOptions: funcOptions, showCallback: (wnd) => {
                                wnd.addOnCloseFunc(() => {
                                    showThreeToOneWindowCallback(wnd.pickPieceData)
                                });
                            }
                        })
                    }

                } else {
                    console.warn("missing generator data; server data should be checked");
                }


                return true
            case MergeTypes.MergeDoubleTapIntent.OPEN_MERGE_GENERATOR:
                var generatorTileKey = tapResult.cellKey || (tapResult.fromTilePos ? tapResult.fromTilePos.x + '_' + tapResult.fromTilePos.y : '')
                if (Game.MergeTutorialManager && !Game.MergeTutorialManager.CanOperate('generator_click', { tile: generatorTileKey })) {
                    GameKit.ShakeAnimTool.Shake(startMergeItem.node, 3)
                    return true
                }
                this.OpenGenerator(
                    tapResult.mergeId,
                    tapResult.instanceId,
                    tapResult.onetimeDestroy,
                    tapResult.remainingCount,
                    tapResult.cellKey,
                    startMergeItem.node,
                    () => {
                        GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(null)
                    }
                )
                return true
            case MergeTypes.MergeDoubleTapIntent.GENERATE_ITEM:
                //生成物品
                var generatorTileKey = tapResult.cellKey || (tapResult.fromTilePos ? tapResult.fromTilePos.x + '_' + tapResult.fromTilePos.y : '')
                if (Game.MergeTutorialManager && !Game.MergeTutorialManager.CanOperate('generator_click', { tile: generatorTileKey })) {
                    GameKit.ShakeAnimTool.Shake(startMergeItem.node, 3)
                    return true
                }
                this.generateNewItem(tapResult.gid, tapResult.generateTilePos, tapResult.fromTilePos, tapResult.instanceId, tapResult.remainingCount)
                return true
            case MergeTypes.MergeDoubleTapIntent.NO_EMPTY_TILE:
                //没有空格子，不能产出
                if (GameKit.SoundManager && GameKit.SoundManager.playGeneratorBoardFullSound) {
                    GameKit.SoundManager.playGeneratorBoardFullSound()
                }
                this._vibrate(160)
                GameKit.ShakeAnimTool.Shake(startMergeItem.node, 3)
                setTimeout(() => {
                    GamePlay.instance.mergeRoot.mergeNodeUI.PlayAdditionDscAnim("没有空格子了，不能产出！");
                }, 0)
                return true
            case MergeTypes.MergeDoubleTapIntent.GENERATE_CONSUME_FAIL:
                //消耗不足，不能产出
                console.warn('generator consume check failed');
                return true
            case MergeTypes.MergeDoubleTapIntent.COOKING_DONE:
                this.generateCookingResultItems(tapResult.cellKey)
                return true
            case MergeTypes.MergeDoubleTapIntent.USE_HOURGLASS:
                this.updateMergeMapEvent({
                    actionType: "func",
                    cellKey: tapResult.cellKey,
                    funcAction: "use",
                    forceSend: true
                }).then((result) => {
                    if (result && result.success) {
                        this._refreshAllMergeItemCapabilities()
                        this.DeleteSelectMergeItem(startMergeItem.node, tapResult.cellKey, false, { showAnim: true })
                    } else {
                        GameKit.ShakeAnimTool.Shake(startMergeItem.node, 3)
                    }
                }).catch((err) => {
                    console.error(err, "updateMergeMapEvent_UseHourglass")
                    GameKit.ShakeAnimTool.Shake(startMergeItem.node, 3)
                })
                return true
            case MergeTypes.MergeDoubleTapIntent.COLLECT_SELL: {
                //收集出售
                let globalFromPos = startMergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())
                this.DeleteSelectMergeItem(null, null, true, { actionType: MergeTypes.MergeActionType.COLLECT, cellKey: tapResult.cellKey, forceSend: true }, () => {
                    let textures = []
                    for (let i = 0; i < 5; i++) {
                        textures.push(startMergeItem.icon.spriteFrame)
                    }
                    let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, startMergeItem.mergeId)
                    let contentType = MergeTypes.MergeTypeToContentTypes[meta.Type()]
                    if (contentType) {
                        GamePlay.instance.mergeRoot.mergeNodeUI.PlayCoinFlyToTargetAnim(globalFromPos, Math.floor(Math.random() * 8) + 1, textures, contentType, undefined, () => { })
                    } else {
                        GamePlay.instance.mergeRoot.mergeNodeUI.PlayCoinFlyToTargetAnim(globalFromPos, Math.floor(Math.random() * 8) + 1, textures, undefined, undefined, () => { })
                    }
                });
                return true
            }
            case MergeTypes.MergeDoubleTapIntent.BROKEN_BUBBLE: {
                let mergeNodeUI = GamePlay.instance.mergeRoot.mergeNodeUI
                let mergeDes = mergeNodeUI ? mergeNodeUI.mergeDes : null
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, startMergeItem.GetMergeId())
                if (!mergeDes || !mergeDes.bubbleDesNode || !meta) return false
                mergeNodeUI.ShowMergeDes(meta, startMergeItem)
                mergeDes.bubbleDesNode.onClickBroken()
                return true
            }
            default:
                return false
        }
    }

    /** 选中可合并格：高亮 + 记录拖动起点；全沙格带附加则抖动提示 */
    _getMergeNodeUI() {
        if (typeof GamePlay === 'undefined' || !GamePlay.instance || !GamePlay.instance.mergeRoot) return null
        return GamePlay.instance.mergeRoot.mergeNodeUI || null
    }

    _clearMergeTouchEffect() {
        if (!this._mergeTouchEffectCellKey) return
        this._mergeTouchEffectCellKey = null
        let mergeNodeUI = this._getMergeNodeUI()
        if (mergeNodeUI && mergeNodeUI.PlayHeChengShiLeave) {
            mergeNodeUI.PlayHeChengShiLeave()
        }
    }

    _updateMergeTouchEffect(touchPoint?: any) {
        if (!this.touchStartNode || !this.touchStartPosName || !this.itemCanDrag) {
            this._clearMergeTouchEffect()
            return
        }

        let boardLayout = this.getMergeBoardLayout()
        let tp = GameKit.MergeUtil.px2tile(touchPoint.x, touchPoint.y, boardLayout)
        let endPosName = tp.x + '_' + tp.y
        if (!this.ifInGrid(tp.x, tp.y) || endPosName === this.touchStartPosName) {
            this._clearMergeTouchEffect()
            return
        }
        if (!this._isTutorialDropTileAllowed(endPosName)) {
            this._clearMergeTouchEffect()
            return
        }

        let dropNode = this.node.getChildByName(endPosName)
        let dropMergeItem = dropNode ? dropNode.getComponent(MergeItem) : null
        let startMergeItem = this.touchStartNode.getComponent(MergeItem)
        let meta = startMergeItem ? Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, startMergeItem.mergeId) : null
        let canMerge = dropMergeItem && startMergeItem && meta && GameKit.MergeUtil.CheckIfCanMerge(dropMergeItem, startMergeItem, meta)
        if (!canMerge) {
            this._clearMergeTouchEffect()
            return
        }
        if (this._mergeTouchEffectCellKey === endPosName) return

        this._mergeTouchEffectCellKey = endPosName
        let mergeNodeUI = this._getMergeNodeUI()
        if (mergeNodeUI && mergeNodeUI.PlayHeChengShiEnter) {
            mergeNodeUI.PlayHeChengShiEnter(dropMergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3()))
        }
    }

    _getTouchId(touch?: any) {
        if (!touch) return null
        if (touch.getID) return touch.getID()
        if (touch.getId) return touch.getId()
        return 0
    }

    _getActiveTouch(e?: any) {
        let touches = e && e.getTouches ? e.getTouches() : []
        if (e && e.touch && this.activeTouchId != null && this._getTouchId(e.touch) === this.activeTouchId) {
            return e.touch
        }
        if (this.activeTouchId == null) return null
        for (let i = 0; i < touches.length; i++) {
            if (this._getTouchId(touches[i]) === this.activeTouchId) return touches[i]
        }
        return null
    }

    _releaseActiveTouch() {
        this.activeTouchId = null
    }

    _beginTouchSettling() {
        this.isTouchSettling = true
        this.scheduleOnce(() => {
            this.isTouchSettling = false
        }, 0)
    }

    onTouchStart(e?: any) {
        if (this.activeTouchId != null || this.isTouchSettling) return
        this._clearMergeTouchEffect()
        this.itemCanDrag = false;
        if (this.IsNetRunning()) return;
        this.touchStartNode = null
        this.touchStartPosName = null

        this.pressPosStart = this._getTouchUILocation(e)
        var touches = e.getTouches();
        if (touches.length == 1) {
            //
            var touch1 = touches[0]
            var touchPoint1 = this._getTouchLocalPoint(touch1);
            let tp = GameKit.MergeUtil.px2tile(touchPoint1.x, touchPoint1.y, this.getMergeBoardLayout())
            let pname = tp.x + '_' + tp.y;

            let itemNode = this.node.getChildByName(pname);
            if (!itemNode) {
                return;
            }
            if (Game.SUserMerge.CheckTilePosIsEmpty(pname)) {
                return;
            }
            let mergeItem = itemNode.getComponent(MergeItem);
            if (!mergeItem) {
                return;
            }

            if (!this._isTutorialStartTileAllowed(pname)) {
                return
            }
            if (Game.MergeTutorialManager && (Game.MergeTutorialManager.currentMeta || Game.MergeTutorialManager.activeTriggerStepMeta)) {
                let stepMeta = Game.MergeTutorialManager.activeTriggerStepMeta || Game.MergeTutorialManager.currentMeta
                let completeType = stepMeta && stepMeta.CompleteType ? stepMeta.CompleteType() : ''
                if (completeType === 'merge_drag' && !Game.MergeTutorialManager.CanOperate('merge_drag_start', { from: pname })) {
                    return
                }
                if (completeType === 'generator_click' && !Game.MergeTutorialManager.CanOperate('generator_click', { tile: pname })) {
                    return
                }
                if (completeType === 'drag_to_backpack' && !Game.MergeTutorialManager.CanOperate('merge_drag_start', { from: pname, targetKey: 'highest_normal' })) {
                    return
                }
            }

            this._applyScissorsTransparent(mergeItem)

            this.itemCanDrag = mergeItem.IfCanDrag();
            if (mergeItem.IsCanSelect()) {
                this.showRec(mergeItem, GameKit.MergeUtil.tile2px(tp.x, tp.y, this.getMergeBoardLayout()))
            } else {
                if (mergeItem.IfHasAddition()) {
                    GameKit.ShakeAnimTool.Shake(mergeItem.additionIcon.node, 3)
                    GamePlay.instance.mergeRoot.mergeNodeUI.PlayAdditionDscAnim();
                }
                return;
            }

            itemNode.setSiblingIndex(this.node.children.length)
            this.bringPicFrameToTop()
            this.touchStartNode = itemNode
            this.touchStartPosName = pname
            this.activeTouchId = this._getTouchId(touch1)
        }
    }

    /** 拖动中跟随手指；超过阈值才算真正拖拽，才清双击状态 */
    onTouchMove(e?: any) {
        if (this.IsNetRunning()) {
            this._clearMergeTouchEffect()
            return
        }
        if (this.itemCanDrag == false) {
            this._clearMergeTouchEffect()
            return
        }
        var touch1 = this._getActiveTouch(e)
        if (touch1) {
            var screenDist = this.pressPosStart ? Vec2.distance(this.pressPosStart, this._getTouchUILocation(touch1)) : 0
            if (screenDist < 15) return
            if (this._isTutorialClickGeneratorOnlyRule()) {
                this.itemCanDrag = false
                this._clearMergeTouchEffect()
                return
            }
            this.picFrame.active = false;
            var touchPoint1 = this._getTouchLocalPoint(touch1);
            if (this.touchStartNode) {
            this.touchStartNode.setPosition(touchPoint1)
            }
            this._updateMergeTouchEffect(touchPoint1)
            this.lastSelectMergeItem = null;
            this.lastTouchStartPosName = null;
        }
    }
    /**
     * 落点：网外/仓库/空地/同格点击/合并/交换。同格短距点击走 resolveSameCellDoubleTap。
     */
    onTouchEnd(e?: any) {
        let touch1 = this._getActiveTouch(e)
        if (!touch1) return
        this._releaseActiveTouch()
        this._beginTouchSettling()

        this._clearMergeTouchEffect()
        this._restoreScissorsTransparent()
        if (this.IsNetRunning()) return
        if (!this.touchStartNode) return
        let touchPoint1 = this._getTouchLocalPoint(touch1)
        let boardLayout = this.getMergeBoardLayout()
        let screenDist = this.pressPosStart ? Vec2.distance(this.pressPosStart, this._getTouchUILocation(touch1)) : 0
        let isTap = screenDist < 40

        let tp = GameKit.MergeUtil.px2tile(touchPoint1.x, touchPoint1.y, boardLayout)
        let endPosName = tp.x + '_' + tp.y

        if (isTap && this.touchStartPosName && this.touchStartPosName !== endPosName) {
            let sp = this.touchStartPosName.split('_')
            tp = { x: parseInt(sp[0]), y: parseInt(sp[1]) }
            endPosName = this.touchStartPosName
        }

        let dropNode = this.node.getChildByName(endPosName);
        let startParts = this.touchStartPosName.split('_')
        let startTx = startParts[0]
        let startTy = startParts[1]
        let startPos = GameKit.MergeUtil.tile2px(startTx, startTy, boardLayout)
        let endPos = GameKit.MergeUtil.tile2px(tp.x, tp.y, boardLayout)
        let startMergeItem = this.touchStartNode.getComponent(MergeItem)
        let dropMergeItem = dropNode ? dropNode.getComponent(MergeItem) : null
        let tmToEnd = Vec3.distance(touchPoint1, new Vec3(endPos.x, endPos.y, 0)) / 300 * 0.1
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, startMergeItem.mergeId)

        if (Game.MergeTutorialManager && Game.MergeTutorialManager.activeTriggerStepMeta) {
            let triggerCompleteType = Game.MergeTutorialManager.activeTriggerStepMeta.CompleteType ? Game.MergeTutorialManager.activeTriggerStepMeta.CompleteType() : ''
            if (triggerCompleteType === 'drag_to_backpack' && GamePlay.instance.mergeRoot.mergeNodeUI.IfMergeHitTestStoreButton(this.touchStartNode)) {
                this._touchEndOutsideGrid(startPos, startMergeItem, tmToEnd)
                return
            }
        }

        if (!this.ifInGrid(tp.x, tp.y)) {
            if (this._isTutorialClickGeneratorOnlyRule()) {
                this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                return
            }
            let tmFly = Vec3.distance(touchPoint1, new Vec3(startPos.x, startPos.y, 0)) / 300 * 0.1
            this._touchEndOutsideGrid(startPos, startMergeItem, tmFly)
            return
        }

        if (!dropNode) {
            if (!this.itemCanDrag) {
                this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                return
            }
            this._touchEndMoveToEmptyCell(endPosName, endPos, startMergeItem, tmToEnd)
            return
        }

        if (!this.itemCanDrag) {
            this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
            this.lastSelectMergeItem = startMergeItem
            this.lastTouchStartPosName = this.touchStartPosName
            return
        }

        if (this.touchStartPosName === endPosName) {
            this._touchEndSameCellTap(touch1, endPos, endPosName, startMergeItem, dropMergeItem, dropNode)
            return
        }

        if (Game.MergeTutorialManager && !Game.MergeTutorialManager.CanOperate('merge_drag', { from: this.touchStartPosName, to: endPosName })) {
            this._handleTutorialRejectedAction(startPos, startMergeItem, tmToEnd)
            return
        }

        if (!this._isTutorialDropTileAllowed(endPosName)) {
            this._handleTutorialRejectedAction(startPos, startMergeItem, tmToEnd)
            return
        }

        if (meta && meta.FunctionType() === MergeTypes.MergeFunctionType.SCISSORS) {
            let dropMeta = dropMergeItem ? Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, dropMergeItem.mergeId) : null

            if (dropMeta && dropMeta.IfCanCut()&&dropMergeItem.IfCanMerge()) {
                //至少有两个空格子，要不然飞回去，并提示，且要return
                let emptyPos = GamePlay.instance.mergeRoot.mergeLevelNode.getEmptyTilePos();
                if (!emptyPos) {
                    this._flyback(startPos, startMergeItem.node, tmToEnd, () => {
                        this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                        this.lastSelectMergeItem = startMergeItem
                        this.lastTouchStartPosName = this.touchStartPosName
                    })
                    GamePlay.instance.mergeRoot.mergeNodeUI.PlayAdditionDscAnim("少于两个空格子，不能使用！");
                    return
                }
                UIRoot.instance.openChildWindow("ScissorsWindow", {
                    scissorsMeta: meta, dropMeta: dropMeta,cellKey1:this.touchStartPosName,cellKey2:endPosName, showCallback: (wnd) => {
                        wnd.addOnCloseFunc(() => {
                            if (wnd.pickPieceData) {
                                let { cutPieces, degradedScissors } = wnd.pickPieceData
                                // degradedScissors: 剪刀降级，拖动的剪刀飞回原格并刷新为低档剪刀
                                // cutPieces: 被剪目标格 + 第二块剪开棋子（无降级时第二块在剪刀原格）
                                this.stopLastTwoCanMergeAnim()
                                let boardLayout = this.getMergeBoardLayout()
                                let { tx: cutOx, ty: cutOy } = this._parseTileKey(endPosName)
                                let cutOriginPos = GameKit.MergeUtil.tile2px(cutOx, cutOy, boardLayout)
                                let playCutPieceShake = (cutNode) => {
                                    if (!cutNode || !isValid(cutNode)) return
                                    EnterCloseAnim.playEnter(cutNode, {
                                        easeType: 11,
                                        animTime: 2,
                                        easeRate: 0.2,
                                    })
                                }
                                let list = cutPieces || []
                                let cutPieceShakeEnterTime = 2
                                let maxCutPieceAnimEnd = 0
                                for (let cutPiece of list) {
                                    if (!cutPiece.cellKey || cutPiece.pieceData == null || cutPiece.pieceData === '') continue
                                    let { tx, ty } = this._parseTileKey(cutPiece.cellKey)
                                    let toPos = GameKit.MergeUtil.tile2px(tx, ty, boardLayout)
                                    let cellNode = this.node.getChildByName(cutPiece.cellKey)
                                    if (!cellNode) {
                                        cellNode = this.getItem()
                                        cellNode.parent = this.node
                                    }
                                    Tween.stopAllByTarget(cellNode)
                                    cellNode.setPosition(cutOriginPos.x, cutOriginPos.y, 0)
                                    let mi = cellNode.getComponent(MergeItem)
                                    if (mi) mi.InitMergeItem(tx, ty, cutPiece.pieceData)
                                    let dx = toPos.x - cutOriginPos.x
                                    let dy = toPos.y - cutOriginPos.y
                                    let dist = Math.sqrt(dx * dx + dy * dy)
                                    if (dist < 2) {
                                        cellNode.setPosition(toPos.x, toPos.y, 0)
                                        playCutPieceShake(cellNode)
                                        maxCutPieceAnimEnd = Math.max(maxCutPieceAnimEnd, cutPieceShakeEnterTime)
                                    } else {
                                        let tm = dist / 300 * 0.20
                                        if (tm < 0.20) tm = 0.20
                                        maxCutPieceAnimEnd = Math.max(maxCutPieceAnimEnd, tm + cutPieceShakeEnterTime)
                                        tween(cellNode)
                                            .to(tm, { position: new Vec3(toPos.x, toPos.y, 0) }, { easing: 'quadOut' })
                                            .call(() => {
                                                playCutPieceShake(cellNode)
                                            })
                                            .start()
                                    }
                                }
                                let scheduleTwoCanMergeHintAfterCut = (degradedFlyTm) => {
                                    let delay = Math.max(maxCutPieceAnimEnd, degradedFlyTm || 0)
                                    if (delay < 0.05) delay = 0.05
                                    this.scheduleOnce(() => {
                                        if (!isValid(this.node)) return
                                        this.PlayTwoCanMergeAnim()
                                    }, delay)
                                }
                                let finishScissorsMergeUI = () => {
                                    this.touchStartNode = null
                                    this.touchStartPosName = null
                                    this.itemCanDrag = false
                                    this.picFrame.active = false
                                    this.lastSelectMergeItem = null
                                    this.lastTouchStartPosName = null
                                    GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(null)
                                    this.updateOrderStatus()
                                }
                                if (degradedScissors) {
                                    let { tx, ty } = this._parseTileKey(degradedScissors.cellKey)
                                    let degPos = GameKit.MergeUtil.tile2px(tx, ty, boardLayout)
                                    let p = startMergeItem.node.position
                                    let dx = p.x - degPos.x
                                    let dy = p.y - degPos.y
                                    let degFlyTm = Math.sqrt(dx * dx + dy * dy) / 300 * 0.1
                                    if (degFlyTm < 0.08) degFlyTm = 0.08
                                    scheduleTwoCanMergeHintAfterCut(degFlyTm)
                                    this._flyback(degPos, startMergeItem.node, degFlyTm, () => {
                                        startMergeItem.node.setPosition(degPos.x, degPos.y, 0)
                                        startMergeItem.InitMergeItem(tx, ty, degradedScissors.pieceData)
                                        finishScissorsMergeUI()
                                    })
                                } else {
                                    scheduleTwoCanMergeHintAfterCut(0)
                                    finishScissorsMergeUI()
                                }

                            } else {
                                this._flyback(startPos, startMergeItem.node, tmToEnd, () => {
                                    this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                                    this.lastSelectMergeItem = startMergeItem
                                    this.lastTouchStartPosName = this.touchStartPosName
                                })
                            }
                        });
                    }
                })
                return
            } else {
                this._flyback(startPos, startMergeItem.node, tmToEnd, () => {
                    this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                    this.lastSelectMergeItem = startMergeItem
                    this.lastTouchStartPosName = this.touchStartPosName
                })
                return
            }
        } else if (this._isCookingRecipeIngredient(dropMergeItem, startMergeItem)) {
            
            //原料棋子放到工具上，先判断公共代码
            // 投入棋子参数:{
            //     userId,
            //     type: "func",
            //     funcAction: "cookingPut",
            //     toolCellKey: "3_4",              // 榨汁机所在格子，也可用 cellKey
            //     ingredientCellKeys: ["2_4"]      // 要投入的食材格子，可多个
            //   }
              
            //   取回投入棋子参数:
            //   {
            //     userId,
            //     type: "func",
            //     funcAction: "cookingTakeBack",
            //     toolCellKey: "3_4",
            //     targetCellKeys: ["2_4"]          // 可选，不传则自动找空格
            //   }
            // dropMergeItem.PlayIconAnim("animation",true);
            let mergeNodeUI=GamePlay.instance.mergeRoot.mergeNodeUI;
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, dropMergeItem.mergeId)
            let flyBackCookingIngredient = () => {
                this._flyback(startPos, startMergeItem.node, tmToEnd, () => {
                    this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                    this.lastSelectMergeItem = startMergeItem
                    this.lastTouchStartPosName = this.touchStartPosName
                })
            }
            if (this._isCookingToolBusy(dropMergeItem)) {
                flyBackCookingIngredient()
                return
            }
            this.updateMergeMapEvent({ actionType: "func", funcAction: "cookingPut",forceServer:true, toolCellKey: endPosName,ingredientCellKeys:[this.touchStartPosName] }).then((result) => {
                if(result.success){
                    //投入成功，startMergeItem要被删除
                    //cookingdes里显示已经获取的原料棋子,传state1
                    this.DeleteSelectMergeItem(startMergeItem.node, this.touchStartPosName, false, { showAnim: false }, () => {
                        this.lastSelectMergeItem = dropMergeItem
                        this.lastTouchStartPosName = endPosName
                        this.showRec(dropMergeItem, endPos, endPosName, true)
                        mergeNodeUI.ShowMergeDes(meta,dropMergeItem)
                    })
                }else{
                    //飞回去
                    flyBackCookingIngredient()
                }
            }).catch((err) => {
                console.error(err, "updateMergeMapEvent_CookingPut");
                flyBackCookingIngredient()
            })
            
            return
        }

        this._touchEndMergeOrSwap(tp, endPosName, endPos, startPos, touchPoint1, startMergeItem, dropMergeItem, meta, tmToEnd)
    }

    onTouchCancel(e?: any) {
        let touch1 = this._getActiveTouch(e)
        if (!touch1) return

        this._clearMergeTouchEffect()
        this._restoreScissorsTransparent()
        this._releaseActiveTouch()
        this._beginTouchSettling()
        if (!this.touchStartNode || !this.touchStartPosName) return

        let startMergeItem = this.touchStartNode.getComponent(MergeItem)
        let startParts = this.touchStartPosName.split('_')
        let startPos = GameKit.MergeUtil.tile2px(startParts[0], startParts[1], this.getMergeBoardLayout())
        if (startMergeItem) {
            if (this.itemCanDrag && !this._isTutorialClickGeneratorOnlyRule()) {
                let touchPoint1 = this._getTouchLocalPoint(touch1)
                this.touchStartNode.setPosition(touchPoint1)
                if (GamePlay.instance.mergeRoot.mergeNodeUI.IfMergeHitTestStoreButton(this.touchStartNode)) {
                    let flyDuration = Vec3.distance(touchPoint1, new Vec3(startPos.x, startPos.y, 0)) / 300 * 0.1
                    this._touchEndOutsideGrid(startPos, startMergeItem, flyDuration)
                    return
                }
            }
            this._flyback(startPos, startMergeItem.node, 0.1, () => {
                this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                this.lastSelectMergeItem = startMergeItem
                this.lastTouchStartPosName = this.touchStartPosName
                this.scheduleTwoCanMergeHintAfterIdle()
            })
        }
    }

    /**
     * 落点在网格外：命中仓库则入仓或满库飞回，否则飞回起点。
     * @param {Vec2} startPos 起点格像素中心
     * @param {MergeItem} startMergeItem
     * @param {number} flyDuration moveTo 时长
     */
    _touchEndOutsideGrid(startPos?: any, startMergeItem?: any, flyDuration?: any) {
        let dragNode = this.touchStartNode
        if (GamePlay.instance.mergeRoot.mergeNodeUI.IfMergeHitTestStoreButton(dragNode)) {
            //拖到仓库按钮上
            if (Game.SUserMerge.GetStoreCanPut()) {
                //如果可以放入仓库，则放入仓库
                Promise.resolve(SR.SRMerge.AutoSendSaveMapLite()).then(() => {
                    let req = SR.SRMerge.MovePieceFromGridToWarehouse(this.touchStartPosName)
                    req.SetCallBack(() => {
                        if (Game.MergeTutorialManager && Game.MergeTutorialManager.Emit) {
                            Game.MergeTutorialManager.Emit('drag_to_backpack', {
                                success: true,
                                from: this.touchStartPosName,
                                targetKey: 'highest_normal',
                                mergeId: startMergeItem.GetMergeId ? startMergeItem.GetMergeId() : null,
                            })
                        }
                        if (GameKit.SoundManager && GameKit.SoundManager.playWarehousePutSound) {
                            GameKit.SoundManager.playWarehousePutSound()
                        }
                        this.DeleteSelectMergeItem(dragNode, this.touchStartPosName, false, {})
                        this.updateOrderStatus()
                    })
                    req.Send()
                }).catch((err) => {
                    console.error(err, "AutoSendSaveMapLite before MovePieceFromGridToWarehouse");
                    this._flyback(startPos, startMergeItem.node, flyDuration, () => {
                        this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                        this.lastSelectMergeItem = startMergeItem
                        this.lastTouchStartPosName = this.touchStartPosName
                    })
                })
            } else {
                this._flyback(startPos, startMergeItem.node, flyDuration, () => {
                    this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                    this.lastSelectMergeItem = startMergeItem
                    this.lastTouchStartPosName = this.touchStartPosName
                })
                setTimeout(() => {
                    GamePlay.instance.mergeRoot.mergeNodeUI.ShakeStoreButton()
                    GamePlay.instance.mergeRoot.mergeNodeUI.PlayAdditionDscAnim('仓库已满，请先清理仓库！')
                }, 0)
            }
            return
        }
        //拖到网格外，且没有命中仓库，则飞回起点
        this._flyback(startPos, startMergeItem.node, flyDuration, () => {
            this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
            this.lastSelectMergeItem = startMergeItem
            this.lastTouchStartPosName = this.touchStartPosName
        })
    }

    /**
     * 拖到空格：已校验 canDrag；更新三件套并发 MOVE。
     */
    _touchEndMoveToEmptyCell(endPosName?: any, endPos?: any, startMergeItem?: any, moveDuration?: any) {
        let dragNode = this.touchStartNode
        let tutorialFromKey = this.touchStartPosName

        Tween.stopAllByTarget(dragNode)
        tween(dragNode)
            .to(Math.max(0, moveDuration || 0), { position: new Vec3(endPos.x, endPos.y, 0) }, { easing: 'quadOut' })
            .call(() => {
                this.showRec(startMergeItem, endPos, this.touchStartPosName, true)
                this.touchStartNode = null
                this.touchStartPosName = null
            })
            .start()
        this.lastSelectMergeItem = startMergeItem
        this.lastTouchStartPosName = endPosName
        this.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.MOVE, fromKey: this.touchStartPosName, toKey: endPosName }).then((result) => {
            this._refreshExpiredBubbleCells(result && result.bubbleExpired, { [tutorialFromKey]: true, [endPosName]: true })
            this._refreshMergeItemFromMap(startMergeItem, endPosName)
            this.updateOrderStatus()
            if (Game.MergeTutorialManager && Game.MergeTutorialManager.UpdateMergeDragGuideStartTile) {
                Game.MergeTutorialManager.UpdateMergeDragGuideStartTile(endPosName, tutorialFromKey)
            }
        }).catch((err) => {
            console.error(err, "updateMergeMapEvent_MoveToEmptyCell");
        });
    }

    /**
     * 落回起点的点击 / 短距移动：双击意图、更新 last 选中。
     */
    _touchEndSameCellTap(touch1?: any, endPos?: any, endPosName?: any, startMergeItem?: any, dropMergeItem?: any, dropNode?: any) {
        this.touchStartNode.setPosition(endPos.x, endPos.y, 0)
        let dist1 = this.pressPosStart ? Vec2.distance(this.pressPosStart, this._getTouchUILocation(touch1)) : 0
        if (dist1 < 40) {
            // this.showRec(startMergeItem, endPos, this.touchStartPosName, true)
            if (this.lastSelectMergeItem && this.lastSelectMergeItem.node == dropNode) {
                //双击意图
                let doubleTapCtx = {
                    endPosName: endPosName,
                    getEmptyTilePos: () => this.getEmptyTilePosByOrder(startMergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())),
                }
                let tapResult = startMergeItem.resolveSameCellDoubleTap(doubleTapCtx)
                let intent = tapResult.intent
                if (intent != MergeTypes.MergeDoubleTapIntent.NO_EMPTY_TILE) {
                    this.showRec(startMergeItem, endPos, this.touchStartPosName, true)
                }
                // UIRoot.instance.ShowToast("双击意图");

                if (this._applyMergeDoubleTapResult(startMergeItem, tapResult)) {
                    return
                }
            } else {
                this._vibrate(50)
                this.showRec(startMergeItem, endPos, this.touchStartPosName, true)
            }
        }
        this.lastSelectMergeItem = dropMergeItem
        this.lastTouchStartPosName = endPosName
    }
    _flyback(pos?: any, nod?: any, tm?: any, cb?: any) {
        Tween.stopAllByTarget(nod)
        tween(nod)
            .to(Math.max(0, tm || 0), { position: new Vec3(pos.x, pos.y, pos.z || 0) }, { easing: 'quadOut' })
            .call(() => {
                if (cb) cb();
            })
            .start()
    }

    /**
     * 两格均有子：可合并则升级+爆沙+MERGE；否则交换（需目标可拖）。
     * @param {number} tmDragToEndCell 手指到落点格中心的时长系数 0.2（目标不可拖时飞回沿用此值，与历史逻辑一致）
     */
    _touchEndMergeOrSwap(tp?: any, endPosName?: any, endPos?: any, startPos?: any, touchPoint1?: any, startMergeItem?: any, dropMergeItem?: any, meta?: any, tmDragToEndCell?: any) {
        let dragNode = this.touchStartNode
        // 先停「可合并」循环 tween 并还原 icon，再 putItem；否则 tween 仍挂在被回收的棋子上，入池/复用后会异常缩放甚至像被删除
        this.stopLastTwoCanMergeAnim()

        if (GameKit.MergeUtil.CheckIfCanMerge(dropMergeItem, startMergeItem, meta)) {
            
            //如果可以合并，则升级+爆沙+MERGE
            if (dragNode && isValid(dragNode)) {
                Tween.stopAllByTarget(dragNode)
                let dragMi = dragNode.getComponent(MergeItem)
                if (dragMi && dragMi.icon && dragMi.icon.node && isValid(dragMi.icon.node)) {
                    Tween.stopAllByTarget(dragMi.icon.node)
                }
            }


            let cellKey1 = endPosName;
            let cellKey2 = this.touchStartPosName;
            let recycleMergedSourceNode = () => {
                let sourceNode = this.node.getChildByName(cellKey2) || dragNode
                if (!sourceNode || !isValid(sourceNode) || sourceNode === dropMergeItem.node) return
                Tween.stopAllByTarget(sourceNode)
                let sourceMi = sourceNode.getComponent(MergeItem)
                if (sourceMi && sourceMi.icon && sourceMi.icon.node && isValid(sourceMi.icon.node)) {
                    Tween.stopAllByTarget(sourceMi.icon.node)
                }
                this.putItem(sourceNode)
            }
            let flybackMergedSourceNode = () => {
                let sourceNode = this.node.getChildByName(cellKey2) || dragNode
                if (!sourceNode || !isValid(sourceNode)) return
                this._flyback(startPos, sourceNode, tmDragToEndCell, () => {
                    this.showRec(startMergeItem, startPos, cellKey2, true)
                    this.lastSelectMergeItem = startMergeItem
                    this.lastTouchStartPosName = cellKey2
                    this.touchStartNode = sourceNode
                    this.touchStartPosName = cellKey2
                    this.itemCanDrag = startMergeItem.IfCanDrag()
                })
            }

            let additionGroup = []
            let additionGroupMeta = []
            let halfId = 4

            let hasAddition = this.findFullSandAround(tp.x, tp.y).some((item) => item.mergeItem.addtionId > -1)

            let additionHandler = (targetTx?: any, targetTy?: any) => {
                additionGroup = []
                additionGroupMeta = []
                halfId = 4

                let breakSandToHalf = (mergeItem, tx, ty, addtionId) => {
                    let newMergeData = mergeItem.mergeId + '_' + halfId + '_' + addtionId
                    if (GamePlay.instance.mergeRoot.mergeNodeUI && GamePlay.instance.mergeRoot.mergeNodeUI.PlayShaGePoSuiEnter) {
                        let globalPos = mergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())
                        GamePlay.instance.mergeRoot.mergeNodeUI.PlayShaGePoSuiEnter(globalPos)
                    }
                    mergeItem.InitMergeItem(tx, ty, newMergeData)
                }

                let fullSandAround = this.findFullSandAround(targetTx != null ? targetTx : tp.x, targetTy != null ? targetTy : tp.y)
                if (fullSandAround.length > 0) {
                    fullSandAround.forEach((item) => {
                        let tx = item.nx
                        let ty = item.ny
                        let aroundMergeItem = item.mergeItem
                        let addtionId = aroundMergeItem.addtionId
                        let newMergeData = aroundMergeItem.mergeId + '_' + halfId + '_' + addtionId
                        if (addtionId > -1) {
                            let tempDataStr = addtionId + '_-1_-1'
                            let tempSpf = this.iconAtlas.getSpriteFrame(Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, addtionId).Icon())
                            let globalPos = aroundMergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())
                            let additionMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, addtionId)
                            additionGroupMeta.push(additionMeta)
                            additionGroup.push({ tempDataStr: tempDataStr, tempSpf: tempSpf, globalPos: globalPos, mergeItem: aroundMergeItem })
                            breakSandToHalf(aroundMergeItem, tx, ty, addtionId)
                        } else {
                            breakSandToHalf(aroundMergeItem, tx, ty, addtionId)
                        }
                    })
                }
            }




            this.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.MERGE, cellKey1: cellKey1, cellKey2: cellKey2 }).then((result) => {
                recycleMergedSourceNode()
                // let b=GameKit.TimeUtil.getCurrentTime()

                let nextId = meta.NextId()
                let envStatus = dropMergeItem.GetEnvStatus()
                if (envStatus == 4) {
                    envStatus = -1;
                }
                let tempDataStr = nextId + "_" + envStatus + "_-1"
                let mergeEffectFromLevel = SR.SRMerge.MergeBoardLogicConfigProvider.getPieceLevel(dropMergeItem.GetMergeId())
                let mergeEffectToLevel = SR.SRMerge.MergeBoardLogicConfigProvider.getPieceLevel(nextId)
                if (GameKit.SoundManager && GameKit.SoundManager.playMergeSoundByLevel) {
                    GameKit.SoundManager.playMergeSoundByLevel(mergeEffectToLevel)
                }
                if(result.bubbleCreated){
                    this.applyBubbleCreatedResult(dropMergeItem.tx + "_" + dropMergeItem.ty, result.bubbleCreated)
                }
                

                dropMergeItem.InitMergeItem(dropMergeItem.tx, dropMergeItem.ty, tempDataStr)
                let mergeUI = GamePlay.instance.mergeRoot.mergeNodeUI
                if (mergeUI && mergeUI.PlayQiZiHeChengEnter && mergeEffectFromLevel >= 3) {
                    mergeUI.PlayQiZiHeChengEnter(dropMergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3()), {
                        fromLevel: mergeEffectFromLevel,
                        toLevel: mergeEffectToLevel
                    })
                }
                


                additionHandler(dropMergeItem.tx, dropMergeItem.ty)
                this._refreshExpiredBubbleCells(result && result.bubbleExpired, { [cellKey1]: true, [cellKey2]: true })
                this._refreshMergeItemFromMap(dropMergeItem, cellKey1)

                if (additionGroup.length > 0) {
                    GamePlay.instance.mergeRoot.mergeNodeUI.PlayCollectAdditionAnimGroup(additionGroup, additionGroupMeta, (mergeItem, itemMeta) => {
                        mergeItem.InitMergeItem(mergeItem.tx, mergeItem.ty, mergeItem.mergeId + '_' + mergeItem.GetEnvStatus() + '_-1')
                    })

                    SR.SRMerge.AutoSendSaveMapLite()
                }

                this.showRec(dropMergeItem, endPos, endPosName, true)
                this.lastSelectMergeItem = dropMergeItem
                this.lastTouchStartPosName = endPosName
                this.touchStartNode = null
                this.touchStartPosName = null
                this.itemCanDrag = false

                this.updateOrderStatus(dropMergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3()))
                this._tryCompleteMergeTutorialStep(cellKey2, cellKey1)
                if (Game.MergeTutorialManager) {
                    Game.MergeTutorialManager.Emit('merge_drag', { from: cellKey2, to: cellKey1 })
                }
                GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated)
            }).catch((err) => {
                console.error(err, "updateMergeMapEvent_MergeOrSwap");
                flybackMergedSourceNode()
            });

            return
        }
        if (!dropMergeItem.IfCanDrag()) {
            //如果不能拖拽，则飞回起点
            this._flyback(startPos, startMergeItem.node, tmDragToEndCell, () => {
                this.showRec(startMergeItem, startPos, this.touchStartPosName, true)
                this.lastSelectMergeItem = startMergeItem
                this.lastTouchStartPosName = this.touchStartPosName
            })
            return
        }

        if (this._isMergeTutorialDragRuleActive()) {
            this._handleTutorialRejectedAction(startPos, startMergeItem, tmDragToEndCell)
            return
        }

        let fromCellKey = this.touchStartPosName

        this.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.MOVE, fromKey: fromCellKey, toKey: endPosName }).then((result) => {
            this._refreshExpiredBubbleCells(result && result.bubbleExpired, { [fromCellKey]: true, [endPosName]: true })
            this._refreshMergeItemFromMap(dropMergeItem, fromCellKey)
            this._refreshMergeItemFromMap(startMergeItem, endPosName)
            this.updateOrderStatus()
        })
        let swapTm = Vec3.distance(touchPoint1, new Vec3(startPos.x, startPos.y, 0)) / 300 * 0.1
        this.scheduleOnce(() => {
            Tween.stopAllByTarget(dragNode)
            tween(dragNode)
                .to(Math.max(0, swapTm || 0), { position: new Vec3(endPos.x, endPos.y, 0) }, { easing: 'quadOut' })
                .call(() => {
                    this.showRec(startMergeItem, endPos, endPosName, true)
                })
                .start()
            Tween.stopAllByTarget(dropMergeItem.node)
            tween(dropMergeItem.node)
                .to(Math.max(0, swapTm || 0), { position: new Vec3(startPos.x, startPos.y, 0) }, { easing: 'quadOut' })
                .start()
        })
        this.lastSelectMergeItem = startMergeItem
        this.lastTouchStartPosName = endPosName
    }
    //处理气泡棋子,从tx，ty产生一个fake棋子，跳到空白坐标位置
    jumpBubbleNode(cellKey1?: any,cellKey2?: any, mergeDataStr?: any) {
        let boardLayout = this.getMergeBoardLayout()
        let obj1=this._parseTileKey(cellKey1)
        let tx1=obj1.tx;
        let ty1=obj1.ty;
        let obj2=this._parseTileKey(cellKey2)
        let tx2=obj2.tx;
        let ty2=obj2.ty;
        let fromPos = GameKit.MergeUtil.tile2px(tx1, ty1, boardLayout)

        let toPos = GameKit.MergeUtil.tile2px(tx2, ty2, boardLayout)
        let fakeNode = this.getItem()
        fakeNode.name = cellKey2
        fakeNode.setPosition(fromPos.x, fromPos.y, 0)
        fakeNode.parent = this.node
        fakeNode.setSiblingIndex(this.node.children.length)

        let fakeItem = fakeNode.getComponent(MergeItem)
        
        fakeItem.InitMergeItem(tx2, ty2, mergeDataStr)
        

        this.playItemJumpAnim(fakeNode, fromPos, toPos, {
            startScale: 0,
            maxScale: 1.2,
            endScale: 1,
            delay: 0,
        }, () => {
            EnterCloseAnim.playEnter(fakeNode, {
                easeType: 11,
                animTime: 2,
                easeRate: 0.2,
            })
            this.updateOrderStatus()
            this.PlayTwoCanMergeAnim()
        })

        return fakeNode
    }

    applyBubbleCreatedResult(sourceCellKey?: any, bubbleCreated?: any) {
        if (!bubbleCreated || !bubbleCreated.cellKey || !bubbleCreated.pieceData) return null
        if (GameKit.SoundManager && GameKit.SoundManager.playBubbleSpawnSound) {
            GameKit.SoundManager.playBubbleSpawnSound()
        }
        return this.jumpBubbleNode(sourceCellKey, bubbleCreated.cellKey, bubbleCreated.pieceData)
    }



    // =========================================================================
    // 格子几何与空位搜索
    // =========================================================================

    /** 上下左右四邻，返回带全沙环境且含 mergeItem 的列表（合并后爆沙用） */
    _getMergeMapDataForPlacement() {
        try {
            if (Game && Game.SUserMerge && Game.SUserMerge.GetMergeMapData) {
                return Game.SUserMerge.GetMergeMapData() || {}
            }
        } catch (e) {
            console.warn("[LevelMergeNode] GetMergeMapData failed", e)
        }
        return {}
    }

    _isCellOccupiedForPlacement(cellKey?: any) {
        if (!cellKey) return true
        if (this._pendingGeneratedCells && this._pendingGeneratedCells[cellKey]) return true
        if (this.node && this.node.getChildByName(cellKey)) return true
        let mapData = this._getMergeMapDataForPlacement()
        return !!(mapData && mapData[cellKey])
    }

    _reserveGeneratedCell(cellKey?: any) {
        if (!cellKey || this._isCellOccupiedForPlacement(cellKey)) return false
        if (!this._pendingGeneratedCells) this._pendingGeneratedCells = {}
        this._pendingGeneratedCells[cellKey] = true
        return true
    }

    _releaseGeneratedCell(cellKey?: any) {
        if (this._pendingGeneratedCells && cellKey) {
            delete this._pendingGeneratedCells[cellKey]
        }
    }

    findFullSandAround(tx?: any, ty?: any) {
        let arr = []
        // 4个方向的偏移量：上、下、左、右
        let directions = [
            { dx: 0, dy: 1 },   // 上
            { dx: 0, dy: -1 },  // 下
            { dx: -1, dy: 0 },  // 左
            { dx: 1, dy: 0 }    // 右
        ]
        for (let i = 0; i < directions.length; i++) {
            let nx = tx + directions[i].dx
            let ny = ty + directions[i].dy
            if (this.ifInGrid(nx, ny)) {
                let node = this.node.getChildByName(nx + '_' + ny);
                if (node) {
                    let mergeItem = node.getComponent(MergeItem)
                    if (mergeItem && mergeItem.IsFullSand()) {
                        arr.push({ nx: nx, ny: ny, mergeItem: mergeItem })
                    }
                }
            }
        }
        return arr
    }
    /**
     * 从 globalPos 所在格开始，顺时针螺旋向外搜索最近的空格子。
     * radius=1 从正上方开始；后续层从上一层末尾位置（左上方）延续螺旋。
     * @param {Vec2} globalPos 世界坐标参考点
     * @returns {Vec2|null} tile 坐标，无空格返回 null
     */
    getEmptyTilePosByOrder(globalPos?: any) {
        let nodePos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(globalPos.x, globalPos.y, globalPos.z || 0), new Vec3());
        let centerTile = GameKit.MergeUtil.px2tile(nodePos.x, nodePos.y, this.getMergeBoardLayout())
        let cx = centerTile.x;
        let cy = centerTile.y;
        let maxRadius = Math.max(this.gridSize.x, this.gridSize.y);
        let topStartX = cx
        for (let r = 1; r <= maxRadius; r++) {
            let minX = cx - r, maxX = cx + r, minY = cy - r, maxY = cy + r

            for (let x = topStartX; x <= maxX; x++) {
                if (this.ifInGrid(x, maxY) && !this._isCellOccupiedForPlacement(x + '_' + maxY))
                    return new Vec2(x, maxY);
            }
            for (let y = maxY - 1; y >= minY; y--) {
                if (this.ifInGrid(maxX, y) && !this._isCellOccupiedForPlacement(maxX + '_' + y))
                    return new Vec2(maxX, y);
            }
            for (let x = maxX - 1; x >= minX; x--) {
                if (this.ifInGrid(x, minY) && !this._isCellOccupiedForPlacement(x + '_' + minY))
                    return new Vec2(x, minY);
            }
            for (let y = minY + 1; y <= maxY - 1; y++) {
                if (this.ifInGrid(minX, y) && !this._isCellOccupiedForPlacement(minX + '_' + y))
                    return new Vec2(minX, y);
            }
            for (let x = minX; x < topStartX; x++) {
                if (this.ifInGrid(x, maxY) && !this._isCellOccupiedForPlacement(x + '_' + maxY))
                    return new Vec2(x, maxY);
            }

            topStartX = minX
        }

        return null;
    }
    /**
     * 获取空格子数量（仅统计，无序）
     * @returns 
     */
    GetEmptyTileCount() {
        let emptyTiles = []
        for (let tx = 0; tx < this.gridSize.x; tx++) {
            for (let ty = 0; ty < this.gridSize.y; ty++) {
                if (!this._isCellOccupiedForPlacement(tx + '_' + ty)) {
                    emptyTiles.push(new Vec2(tx, ty));
                }
            }
        }
        return emptyTiles.length
    }
    /**
     * 返回某一空位的 tile 坐标（Vec2 的 x,y 为格子下标）。
     * 注意：有参考点时用 tile 下标与节点空间坐标做距离比较，与 tile 像素中心不一致，仅作近似；产出落点请优先 getEmptyTilePosByOrder。
     * @param {Vec2|null} globalPos 世界坐标参考点，可空
     * @returns {Vec2|null}
     */
    getEmptyTilePos(globalPos?: any) {
        let emptyTiles = []
        for (let tx = 0; tx < this.gridSize.x; tx++) {
            for (let ty = 0; ty < this.gridSize.y; ty++) {
                if (!this._isCellOccupiedForPlacement(tx + '_' + ty)) {
                    emptyTiles.push(new Vec2(tx, ty));
                }
            }
        }

        if (emptyTiles.length === 0) {
            return null;
        }

        if (!globalPos) {
            return emptyTiles[0];
        }

        let nodePos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(globalPos.x, globalPos.y, globalPos.z || 0), new Vec3());
        let centerTile = GameKit.MergeUtil.px2tile(nodePos.x, nodePos.y, this.getMergeBoardLayout())

        let nearestTile = null;
        let minDistance = Infinity;
        for (let i = 0; i < emptyTiles.length; i++) {
            let tile = emptyTiles[i];
            let dx = tile.x - centerTile.x;
            let dy = tile.y - centerTile.y;
            let distance = dx * dx + dy * dy;
            if (distance < minDistance) {
                minDistance = distance;
                nearestTile = tile;
            }
        }

        return nearestTile;
    }
    /**
     * 是否在网格内
     * @param {*} tx 
     * @param {*} ty 
     * @returns 
     */
    ifInGrid(tx?: any, ty?: any) {
        return tx >= 0 && tx < this.gridSize.x && ty >= 0 && ty < this.gridSize.y
    }

    /**
     * 选中框 + 可选弹描述；并重启「可合并提示」动画。
     * @param {*} mergeItem
     * @param {Vec2} pos 选中框本地坐标
     * @param {string} [posName]
     * @param {boolean} [showAnim] 为 true 时弹 MergeDes 与弹性入场
     */
    showRec(mergeItem?: any, pos?: any, posName?: any, showAnim?: any) {
        let id = mergeItem ? mergeItem.mergeId : -1;
        if (!pos || !id) {
            this.picFrame.active = false;
            return;
        }

        this.picFrame.setPosition(pos.x, pos.y, pos.z || 0);
        this.picFrame.active = true;
        this.bringPicFrameToTop()
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, id)

        GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(meta, mergeItem);
        if (showAnim) {

            EnterCloseAnim.playEnter(this.picFrame)
            // 使用弹性缓动，增加动画时间，减小easeRate来增加抖动次数
            EnterCloseAnim.playEnter(mergeItem.node, {
                easeType: 11,  // easeElasticOut 的值
                animTime: 2,  // 增加动画时间，让抖动更慢
                easeRate: 0.2   // 减小easeRate，增加抖动次数（值越小振荡越多）
            })
        }
    }
    /**
     * 延迟后若仍存在一对可合成棋子，则对其 icon 做循环缩放+靠拢提示（stopLastTwoCanMergeAnim 可停）。
     */
    bringPicFrameToTop() {
        if (this.picFrame && this.picFrame.active) {
            this.picFrame.setSiblingIndex(this.node.children.length)
        }
    }

    PlayTwoCanMergeAnim() {
        this.stopLastTwoCanMergeAnim()
        let canMergeItems = GameKit.MergeUtil.GetCanMergeItems(Game.SUserMerge.GetMergeMapData(), (posName) => {
            let n = this.node.getChildByName(posName)
            if (!n) return false
            let mi = n.getComponent(MergeItem)
            return !!(mi && mi.IfCanMerge())
        }, (posName) => {
            let n = this.node.getChildByName(posName)
            if (!n) return false
            let mi = n.getComponent(MergeItem)
            return !!(mi && mi.IfCanDrag())
        })
        if (canMergeItems.length < 2) return


        let animCallback = () => {
            let itemNode1 = this.node.getChildByName(canMergeItems[0])
            let itemNode2 = this.node.getChildByName(canMergeItems[1])
            if (!itemNode1 || !itemNode2) return

            let mi1 = itemNode1.getComponent(MergeItem)
            let mi2 = itemNode2.getComponent(MergeItem)
            if (!mi1 || !mi2 || !mi1.icon || !mi2.icon) return

            let icon1 = mi1.icon.node
            let icon2 = mi2.icon.node
            if (!icon1 || !icon2) return

            let pos1 = icon1.position.clone()
            let pos2 = icon2.position.clone()
            let scale1 = icon1.scale.clone()
            let scale2 = icon2.scale.clone()
            this.twoCanMergeAnimRestoreState = [
                { node: icon1, scale: scale1, position: pos1.clone() },
                { node: icon2, scale: scale2, position: pos2.clone() }
            ]

            let wp1 = icon1.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())
            let wp2 = icon2.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())
            let dir = new Vec3(wp2.x - wp1.x, wp2.y - wp1.y, 0)
            dir.normalize()
            let distance = Vec3.distance(wp1, wp2)

            let offsetDist = 10
            let delta1 = new Vec3(0, 0, 0)
            let delta2 = new Vec3(0, 0, 0)
            if (distance >= 88) {
                if (mi1.GetEnvStatus() != 4) {
                    let targetWorldPos1 = new Vec3(wp1.x + dir.x * offsetDist, wp1.y + dir.y * offsetDist, 0)
                    let targetLocalPos1 = icon1.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(targetWorldPos1, new Vec3())
                    delta1 = new Vec3(targetLocalPos1.x - pos1.x, targetLocalPos1.y - pos1.y, targetLocalPos1.z - pos1.z)
                }
                if (mi2.GetEnvStatus() != 4) {
                    let targetWorldPos2 = new Vec3(wp2.x - dir.x * offsetDist, wp2.y - dir.y * offsetDist, 0)
                    let targetLocalPos2 = icon2.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(targetWorldPos2, new Vec3())
                    delta2 = new Vec3(targetLocalPos2.x - pos2.x, targetLocalPos2.y - pos2.y, targetLocalPos2.z - pos2.z)
                }
            }

            let scaleUp = 0.9
            let dur = 0.5
            let breatheCount = 3
            let pauseTime = 1.5
            let createLoopTween = (node: Node, origPos: Vec3, origScale: Vec3, delta: Vec3) => {
                Tween.stopAllByTarget(node)
                node.setScale(origScale)
                node.setPosition(origPos)

                let loopTween = tween()
                for (let i = 0; i < breatheCount; i++) {
                    loopTween
                        .to(dur, {
                            scale: new Vec3(origScale.x * scaleUp, origScale.y * scaleUp, origScale.z * scaleUp),
                            position: new Vec3(origPos.x + delta.x, origPos.y + delta.y, origPos.z + delta.z)
                        }, { easing: 'sineOut' })
                        .to(dur, {
                            scale: origScale.clone(),
                            position: origPos.clone()
                        }, { easing: 'sineIn' })
                }
                loopTween.delay(pauseTime)

                return tween(node)
                    .repeatForever(
                        loopTween
                    )
                    .start()
            }

            this.twoCanMergeTweens = [
                createLoopTween(icon1, pos1, scale1, delta1),
                createLoopTween(icon2, pos2, scale2, delta2)
            ]
        }

        this.twoCanMergeAnimSchedule = animCallback
        this.scheduleOnce(animCallback, 2.0)
    }
    /**停止上次提示两个可以合成棋子的动画 */
    stopLastTwoCanMergeAnim() {
        // 取消延迟调度（如果存在）
        if (this.twoCanMergeAnimSchedule) {
            this.unschedule(this.twoCanMergeAnimSchedule)
            this.twoCanMergeAnimSchedule = null
        }
        // 停止所有正在运行的tween动画
        if (this.twoCanMergeTweens && this.twoCanMergeTweens.length > 0) {
            this.twoCanMergeTweens.forEach(tween => {
                if (tween) {
                    tween.stop()
                }
            })
            this.twoCanMergeTweens = []
        }
        // 将 icon 的 scale 和坐标还原到动画前的状态
        if (this.twoCanMergeAnimRestoreState && this.twoCanMergeAnimRestoreState.length > 0) {
            this.twoCanMergeAnimRestoreState.forEach(state => {
                if (state && state.node && isValid(state.node)) {
                    state.node.setScale(state.scale)
                    state.node.setPosition(state.position)
                }
            })
            this.twoCanMergeAnimRestoreState = []
        }
    }
    /**
     * 移除指定格棋子并入池；可选播缩小动画；needUpdateServer 时附带 args 再 saveMap。
     */
    DeleteSelectMergeItem(node?: any, pName?: any, needUpdateServer?: any, args?: any, cb?: any) {
        args = args || {}
        if (Game.MergeTutorialManager && (args.actionType === MergeTypes.MergeActionType.REMOVE || args.actionType === MergeTypes.MergeActionType.COLLECT || args.actionType === 'delete' || args.actionType === 'sell')) {
            if (!Game.MergeTutorialManager.CanOperate('sell', { cellKey: pName || this.lastTouchStartPosName, actionType: args.actionType })) {
                return
            }
        }
        let lastNode = node || this.lastSelectMergeItem.node;
        let posName = pName || this.lastTouchStartPosName;
        Tween.stopAllByTarget(lastNode);
        if (args.showAnim) {
            tween(lastNode)
                .to(0.3, { scale: new Vec3(0, 0, 0) })
                .call(() => {
                    this.putItem(lastNode);
                })
                .start();
        } else {
            this.putItem(lastNode);
        }
        this.touchStartNode = null
        this.touchStartPosName = null
        this.selectMergeId = -1;
        this.picFrame.active = false;
        GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(null);
        this.lastSelectMergeItem = null;
        this.lastTouchStartPosName = null;

        args.cellKey = posName;

        if (needUpdateServer) {
            this.updateMergeMapEvent(args).then((result) => {
                if (result && result.success && (args.actionType === 'delete' || args.actionType === 'sell') && args.forceSend && GameKit.SoundManager && GameKit.SoundManager.playCommonDeleteSound) {
                    GameKit.SoundManager.playCommonDeleteSound()
                }
                if (cb) cb();
                this.updateOrderStatus()
            });
        } else {
            if (cb) cb();
            this.updateOrderStatus()
        }


    }
    /**
     * 播放物品跳跃动画
     * @param {Node} node 要动画的节点
     * @param {Vec2} fromPos 起始位置
     * @param {Vec2} toPos 目标位置
     * @param {Object} options 可选参数
     * @param {number} options.startScale 起始缩放，默认0
     * @param {number} options.maxScale 最大缩放倍数，默认1.2
     * @param {number} options.slideDistanceRatio 滑动距离比例，默认0.15
     * @param {number} options.jumpHeightRatio 跳跃高度比例，默认0.3
     * @param {number} options.slideTime 滑动时间，默认0.2
     * @param {number} options.delay 延迟时间，默认0.1
     */
    playItemJumpAnim(node?: any, fromPos?: any, toPos?: any, options: AnyRecord = {}, cb?: any) {
        let fromVec = new Vec3(fromPos.x, fromPos.y, fromPos.z || 0);
        let toVec = new Vec3(toPos.x, toPos.y, toPos.z || 0);
        let dist = Vec3.distance(fromVec, toVec);
        let tm = dist / 300 * 0.5;
        tm = Math.max(tm / 1.2, 0.3);

        let startScale = options.startScale !== undefined ? options.startScale : 0;
        let maxScale = options.maxScale || 1.2;
        let endScale = options.endScale || 1;
        let slideDistanceRatio = options.slideDistanceRatio || 0.15;
        let jumpHeightRatio = options.jumpHeightRatio || 0.3;
        let slideTime = options.slideTime || 0.2;
        let scaleUpTime = options.scaleUpTime || tm * 0.5;
        let scaleDownTime = options.scaleDownTime || tm * 0.5;
        let delay = options.delay !== undefined ? options.delay : 0.1;

        let originalScale = 1;
        node.setScale(startScale, startScale, startScale);

        this.scheduleOnce(() => {
            if (!node || !isValid(node)) {
                if (cb) cb()
                return
            }
            Tween.stopAllByTarget(node)

            // 计算接近目标位置（在目标位置之前一点，用于跳跃落地）
            let slideDistance = Math.min(dist * slideDistanceRatio, 30);
            let moveDirection = new Vec3(toVec.x - fromVec.x, toVec.y - fromVec.y, 0);
            moveDirection.normalize();
            let nearPos = new Vec3(toVec.x - moveDirection.x * slideDistance, toVec.y - moveDirection.y * slideDistance, 0);

            // 计算跳跃高度（根据距离动态调整）
            let jumpHeight = Math.min(dist * jumpHeightRatio, 100);

            // 保存原始缩放
            // let originalScale = node.scale;

            // 跳跃动画：跳到接近目标位置
            const jumpState = { ratio: 0 };
            const scaleState = { value: startScale };
            tween(jumpState)
                .to(tm, { ratio: 1 }, {
                    easing: 'quadOut',
                    onUpdate: () => {
                        let ratio = jumpState.ratio;
                        node.setPosition(
                            fromVec.x + (nearPos.x - fromVec.x) * ratio,
                            fromVec.y + (nearPos.y - fromVec.y) * ratio + Math.sin(Math.PI * ratio) * jumpHeight,
                            0
                        );
                    },
                })
                .to(slideTime, { ratio: 1 }, {
                    easing: 'quadOut',
                    onUpdate: () => {
                        node.setPosition(toVec);
                    },
                })
                .call(() => {
                    node.setPosition(toVec);
                    if (cb) cb();
                })
                .start();
            tween(scaleState)
                .to(scaleUpTime, { value: originalScale * maxScale }, {
                    easing: 'quadOut',
                    onUpdate: () => node.setScale(scaleState.value, scaleState.value, scaleState.value),
                })
                .to(scaleDownTime, { value: originalScale * endScale }, {
                    easing: 'quadOut',
                    onUpdate: () => node.setScale(scaleState.value, scaleState.value, scaleState.value),
                })
                .start()
        }, delay)
    }

    /**直接创建棋子都用这个方法 */
    /** 仓库放入棋盘：在 posName 格创建棋子并发 MOVE 存档 */
    CreateFromWharehouse(posName?: any, mergeDataStr?: any) {
        let { tx, ty } = this._parseTileKey(posName)
        this.waitCreateAnimItemsTilePos.push(new Vec2(tx, ty));

        let child = this.getItem()
        let pos = GameKit.MergeUtil.tile2px(tx, ty, this.getMergeBoardLayout())
        child.setPosition(pos.x, pos.y, 0)
        child.parent = this.node
        let mergeItem = child.getComponent(MergeItem)

        mergeItem.InitMergeItem(tx, ty, mergeDataStr)
        this.updateOrderStatus()
    }
    /** UI 还原卖出等：先 UNDO 存档再在格子上缩放入场 */
    UndoItemFromUI(posName?: any, mergeDataStr?: any, cb?: any) {
        let { tx, ty } = this._parseTileKey(posName)
        this.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.UNDO, forceSend: true }).then(() => {
            let child = this.getItem()
            let pos = GameKit.MergeUtil.tile2px(tx, ty, this.getMergeBoardLayout())
            child.setPosition(pos.x, pos.y, 0)
            child.parent = this.node
            child.setScale(0, 0, 0);
            let mergeItem = child.getComponent(MergeItem)
            mergeItem.InitMergeItem(tx, ty, mergeDataStr)

            tween(child)
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .call(() => {

                })
                .start();

            if (cb) cb();
            this.updateOrderStatus()
        });

    }
    /**扎破气泡棋子
     * 销毁气泡
     */
    getBubbleLifetime() {
        if (!G || !G.GameConstance) return 0
        let lifetime = G.GameConstance.bubbleLifetime
        if (lifetime == null) lifetime = G.GameConstance.bubbleLifeTime
        lifetime = parseFloat(lifetime)
        return isNaN(lifetime) ? 0 : lifetime
    }

    getBubbleExpireAt(bubbleData?: any) {
        if (!bubbleData) return 0
        let expireAt = parseFloat(bubbleData.expireAt)
        if (expireAt > 0) return expireAt
        let createdAt = parseFloat(bubbleData.createdAt)
        let lifetime = this.getBubbleLifetime()
        if (isNaN(createdAt) || lifetime <= 0) return 0
        return createdAt + lifetime
    }

    refreshBubbleCountdown() {
        let lifetime = this.getBubbleLifetime()
        if (lifetime <= 0 || !GamePlay.instance || !GamePlay.instance.mergeRoot) return
        let mapData = Game.SUserMerge.GetMergeMapData()
        let now = GameKit.TimeUtil.getCurrentTime()
        for (let cellKey in mapData) {
            let tile = this._parseTileKey(cellKey)
            if (isNaN(tile.tx) || isNaN(tile.ty)) continue
            let bubbleData = Game.SUserMerge.GetBubbleByTilePos(tile.tx, tile.ty)
            if (!bubbleData) continue
            let expireAt = this.getBubbleExpireAt(bubbleData)
            if (expireAt > 0 && now >= expireAt) {
                this.BrokenBubble(tile.tx, tile.ty, { isExpire: true })
            }
        }
    }

    applyBubbleBrokenResult(broken?: any) {
        if (!broken || !broken.cellKey || !broken.pieceData) return
        let tile = this._parseTileKey(broken.cellKey)
        if (isNaN(tile.tx) || isNaN(tile.ty)) return

        let mapData = Game.SUserMerge.GetMergeMapData()
        mapData[broken.cellKey] = broken.pieceData
        if (broken.bubbleId && Game.SUserMerge.Data().bubblePieces) {
            delete Game.SUserMerge.Data().bubblePieces[broken.bubbleId]
        }

        let itemNode = this.node.getChildByName(broken.cellKey)
        if (itemNode) {
            let mergeItem = itemNode.getComponent(MergeItem)
            if (mergeItem) {
                mergeItem.InitMergeItem(tile.tx, tile.ty, Game.SUserMerge.ParseMergeMapData(broken.pieceData))
            }
        }

        if (GamePlay.instance && GamePlay.instance.mergeRoot && GamePlay.instance.mergeRoot.mergeNodeUI) {
            GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(null)
        }
        this.updateOrderStatus()
    }

    applyBubbleClaimedResult(claimed?: any) {
        if (GameKit.SoundManager && GameKit.SoundManager.playBubbleOpenSound) {
            GameKit.SoundManager.playBubbleOpenSound()
        }
        this.applyBubbleBrokenResult(claimed)
    }

    /**获取棋盘上等级最高的普通棋子 */
    GetHighestLvNormalMergeItem(){
        let bestMergeItem = null
        let bestLevel = -1

        let getPieceLevel = (meta) => {
            if (!meta) return -1
            let typeMeta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeType, meta.Type())
            if (!typeMeta) return -1

            let levels = typeMeta.Levels()
            for (let i = 0; i < levels.length; i++) {
                if (parseInt(levels[i], 10) === meta.Id()) {
                    return i
                }
            }
            return -1
        }

        for (let i = 0; i < this.node.children.length; i++) {
            let child = this.node.children[i]
            let mergeItem = child.getComponent(MergeItem)
            if (!mergeItem) continue
            if (mergeItem.GetEnvStatus() !== -1 || mergeItem.GetAddtionId() !== -1 || mergeItem.IsBubble()) continue

            let mergeId = mergeItem.GetMergeId()
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId)
            if (!meta) continue

            let funcType = meta.FunctionType()
            if (funcType && funcType !== MergeTypes.MergeFunctionType.Normal) continue
            if (Meta.MergeGeneraterMeta && Meta.MergeGeneraterMeta.GetGenerateByMergeId(mergeId)) continue

            let level = getPieceLevel(meta)
            if (level > bestLevel) {
                bestLevel = level
                bestMergeItem = mergeItem
            }
        }

        return bestMergeItem
    }


    playBubbleBrokenThenApply(broken?: any) {
        return new Promise<void>((resolve) => {
            if (!broken || !broken.cellKey) {
                resolve()
                return
            }
            let itemNode = this.node.getChildByName(broken.cellKey)
            let mergeItem = itemNode ? itemNode.getComponent(MergeItem) : null
            if (!mergeItem || !mergeItem.playBubbleBrokenOnce) {
                if (GameKit.SoundManager && GameKit.SoundManager.playBubbleBreakSound) {
                    GameKit.SoundManager.playBubbleBreakSound()
                }
                this.applyBubbleBrokenResult(broken)
                resolve()
                return
            }
            if (GameKit.SoundManager && GameKit.SoundManager.playBubbleBreakSound) {
                GameKit.SoundManager.playBubbleBreakSound()
            }
            mergeItem.playBubbleBrokenOnce(() => {
                this.applyBubbleBrokenResult(broken)
                resolve()
            })
        })
    }

    ClaimBubble(tx?: any, ty?: any, method?: any) {
        let cellKey = tx + "_" + ty
        if (this._breakingBubbleByCellKey[cellKey]) return
        let bubbleData = Game.SUserMerge.GetBubbleByTilePos(tx, ty)
        if (!bubbleData) return

        this._breakingBubbleByCellKey[cellKey] = true
        return this.updateMergeMapEvent({
            actionType: "bubbleClaim",
            cellKey: cellKey,
            bubbleId: bubbleData.bubbleId,
            method: method || "free",
            serverCallback: (res) => {
                
            }
        }).then((result) => {
            let claimed = result && result.bubbleClaimed
            if (claimed) {
                this.applyBubbleClaimedResult(claimed)
            }
        }).catch((err) => {
            console.error(err, "updateMergeMapEvent_BubbleClaim")
        }).then(() => {
            delete this._breakingBubbleByCellKey[cellKey]
        })
    }

    BrokenBubble(tx?: any, ty?: any, options?: any) {
        let cellKey = tx + "_" + ty
        if (this._breakingBubbleByCellKey[cellKey]) return
        let bubbleData = Game.SUserMerge.GetBubbleByTilePos(tx, ty)
        if (!bubbleData) return

        

        let createdAt = parseFloat(bubbleData.createdAt)
        let endtime=parseFloat(G.GameConstance.bubbleLifetime)+createdAt

        
        let handledBroken = false
        let brokenAnimPromise = null
        let handleBroken = (broken) => {
            if (!broken || handledBroken) return brokenAnimPromise
            handledBroken = true
            brokenAnimPromise = this.playBubbleBrokenThenApply(broken)
            return brokenAnimPromise
        }

        this._breakingBubbleByCellKey[cellKey] = true
        return this.updateMergeMapEvent({
            actionType: "bubbleBreak",
            cellKey: cellKey,
            bubbleId: bubbleData.bubbleId,
            serverCallback: (res) => {
                if (res && res.errorCode === 0 && res.bubbleBroken) {
                    handleBroken(res.bubbleBroken)
                }
            }
        }).then((result) => {
            let broken = result && result.bubbleBroken
            if (broken) {
                return handleBroken(broken)
            }
            return brokenAnimPromise
        }).catch((err) => {
            console.error(err, "updateMergeMapEvent_BubbleBreak")
            return brokenAnimPromise
        }).then(() => {
            delete this._breakingBubbleByCellKey[cellKey]
        })
    }
    /**获取到气泡棋子 */
    GetBubbleItem(tx,ty,mergeDataStr){

    }
    /**
     * 服务器确认后的本地产出：更新地图、播跳跃、处理一次性生成器销毁或刷新冷却。
     */
    _createGeneratedItemByData(generateTilePos?: any, frompos?: any, mergeDataStr?: any, options?: any, cb?: any) {
        if (typeof options === 'function') {
            cb = options
            options = {}
        }
        options = options || {}
        let boardLayout = this.getMergeBoardLayout()
        let pos = GameKit.MergeUtil.tile2px(generateTilePos.x, generateTilePos.y, boardLayout)
        let newNode = this.getItem();
        this.node.addChild(newNode);
        newNode.setPosition(frompos.x, frompos.y, 0)
        let item = newNode.getComponent(MergeItem);
        item.InitMergeItem(generateTilePos.x, generateTilePos.y, mergeDataStr)
        this.playItemJumpAnim(newNode, frompos, pos, {}, () => {
            if (options.playLandingSound && GameKit.SoundManager && GameKit.SoundManager.playItemLandingSound) {
                GameKit.SoundManager.playItemLandingSound()
            }
            if (cb) cb()
        });
        return newNode
    }

    generateNewItem(gid?: any, generateTilePos?: any, fromtilepos?: any, instanceId?: any, remainingCount?: any) {
        let onetimeDestroy = Game.SUserMerge.IfOnetimeDestroyGenerator(instanceId)
        /**为true时一次性销毁生成器，进入冷却时间，不用生成棋子 */

        let boardLayout = this.getMergeBoardLayout()
        let frompos = GameKit.MergeUtil.tile2px(fromtilepos.x, fromtilepos.y, boardLayout)

        let generateNode = this.node.getChildByName(fromtilepos.x + '_' + fromtilepos.y);
        let generateData = generateNode.getComponent(MergeItem).GetMergeData()


        let newMergeDataStr = gid + "_-1_-1"
        // let tm=new Date().getTime();
        // UIRoot.instance.ShowToast("开始生成");

        let targetCellKey = generateTilePos.x + '_' + generateTilePos.y
        if (!this._reserveGeneratedCell(targetCellKey)) {
            return
        }

        this.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.GENERATE, instanceId: instanceId, generatedPieceId: gid, remainingCount: remainingCount, targetCellKey: targetCellKey, generatedPieceData: newMergeDataStr, fromGid: generateNode.getComponent(MergeItem).GetMergeId() }).then((result) => {
            if (!onetimeDestroy && result && result.produced) {
                if (GameKit.SoundManager && GameKit.SoundManager.playGeneratorManualSpawnSound) {
                    GameKit.SoundManager.playGeneratorManualSpawnSound()
                }
                let resultPieceData = result.generatedPieceData || newMergeDataStr
                let resultCellKey = result.generatedCellKey || targetCellKey
                let targetPos = this._parseTileKey(resultCellKey)
                let targetTilePos = new Vec2(targetPos.tx, targetPos.ty)
                this._createGeneratedItemByData(targetTilePos, frompos, resultPieceData, { playLandingSound: true })
                if (result.bubbleCreated) {
                    this.applyBubbleCreatedResult(resultCellKey, result.bubbleCreated)
                }
                this.updateOrderStatus()
                if (Game.MergeTutorialManager) {
                    Game.MergeTutorialManager.Emit('generator_click', { tile: fromtilepos.x + '_' + fromtilepos.y })
                }
            } else {
                console.warn("one-time generator entered cooldown", onetimeDestroy);
            }

            //判断生成器还在吗，不在则删除
            let ifCanDeleteGenerator = Game.SUserMerge.GetGeneratorInstanceIdByMergeTilePos(fromtilepos.x, fromtilepos.y)


            if (!ifCanDeleteGenerator) {
                //不在则生成器爆炸销毁
                //删除生成器
                this.DeleteSelectMergeItem(generateNode, fromtilepos.x + '_' + fromtilepos.y, false, { showAnim: true });
                //此处强制更新服务器
                SR.SRMerge.AutoSendSaveMapLite()
            } else {
                generateNode.getComponent(MergeItem).InitMergeItem(fromtilepos.x, fromtilepos.y, generateData)

            }

        }).catch((err) => {
            console.error(targetCellKey, "generateNewItem failed", err);
        }).then(() => {
            this._releaseGeneratedCell(targetCellKey)
        });
    }

    generateCookingResultItems(toolCellKey?: any) {
        let { tx, ty } = this._parseTileKey(toolCellKey)
        let boardLayout = this.getMergeBoardLayout()
        let frompos = GameKit.MergeUtil.tile2px(tx, ty, boardLayout)
        let toolNode = this.node.getChildByName(toolCellKey)
        let generateTilePos = toolNode ? this.getEmptyTilePosByOrder(toolNode.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())) : this.getEmptyTilePos()
        if (!generateTilePos) {
            this._vibrate(160)
            if (toolNode) GameKit.ShakeAnimTool.Shake(toolNode, 3)
            setTimeout(() => {
                GamePlay.instance.mergeRoot.mergeNodeUI.PlayAdditionDscAnim("没有空格子了，不能产出！");
            }, 0)
            return
        }

        this.updateMergeMapEvent({ actionType: "func", funcAction: "cookingClaim",forceServer:true, toolCellKey: toolCellKey, targetCellKey: generateTilePos.x + '_' + generateTilePos.y }).then((result) => {
            let toolItem = toolNode && toolNode.getComponent(MergeItem)
            if (toolItem) toolItem.showCooking()
            let outputs = result && result.cookingOutput ? result.cookingOutput : []
            for (let i = 0; i < outputs.length; i++) {
                let output = outputs[i]
                if (!output || !output.cellKey || !output.pieceData) continue
                let targetTilePos = this._parseTileKey(output.cellKey)
                this._createGeneratedItemByData(new Vec2(targetTilePos.tx, targetTilePos.ty), frompos, output.pieceData)
            }
            this.updateOrderStatus()
            GamePlay.instance.mergeRoot.mergeNodeUI.ShowMergeDes(null)
        }).catch((err) => {
            console.error(err, "updateMergeMapEvent_CookingClaim");
        });
    }
    /**
     * 体力箱子
     * 描述面板「开启」或双击 OPEN_MERGE_GENERATOR：一次性生成器进入冷却等，由 saveMap(GENERATE) 同步。
     */
    OpenGenerator(gid?: any, instanceId?: any, onetimeDestroy?: any, remainingCount?: any, generatedCellKey?: any, generateNode?: any, cb?: any) {
        let newMergeDataStr = gid + "_-1_-1"
        let { tx, ty } = this._parseTileKey(generatedCellKey)

        this.updateMergeMapEvent({ actionType: MergeTypes.MergeActionType.GENERATE, instanceId: instanceId, remainingCount: remainingCount, generatedCellKey: generatedCellKey, targetCellKey: generatedCellKey, generatedPieceData: newMergeDataStr }).then(() => {
            if (onetimeDestroy) {
                //一次性生成器，进入冷却时间，不用生成棋子
                console.warn("generator entered cooldown without producing an item");
                generateNode.getComponent(MergeItem).InitMergeItem(tx, ty, newMergeDataStr)
                if (cb) cb();
            }
        }).catch((err) => {
            console.error("OpenGenerator failed", err);
        });

    }
    /**提取临时数据到空格子 */
    /** 临时奖励飞到棋盘格并落位，再 MOVE 存档 */
    ExtractTempData(mergeDataStr?: any, posName?: any, globalPos?: any, cb?: any) {
        let { tx, ty } = this._parseTileKey(posName)
        let cellKey = tx + '_' + ty

        let mergeNode = this.getItem();
        let localPos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(globalPos.x, globalPos.y, globalPos.z || 0), new Vec3())
        mergeNode.setPosition(localPos)
        this.node.addChild(mergeNode)
        let mergeItem = mergeNode.getComponent(MergeItem);

        mergeItem.InitMergeItem(tx, ty, mergeDataStr)

        let pos = GameKit.MergeUtil.tile2px(tx, ty, this.getMergeBoardLayout())
        let startPos = mergeItem.node.getPosition()
        this.updateOrderStatus()

        // 使用封装的跳跃动画方法，保持节点当前缩放；与存档都结束后再回调，避免未播完即可点下一次提取
        this.playItemJumpAnim(
            mergeItem.node,
            startPos,
            pos,
            {
                startScale: 0,
                maxScale: 1.2,
            },
            () => {
                let mergeNodeUI = GamePlay.instance.mergeRoot.mergeNodeUI
                if (mergeNodeUI && mergeNodeUI.PlayQiZiLuoDiEnter && isValid(mergeItem.node)) {
                    let worldPos = mergeItem.node.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0), new Vec3())
                    mergeNodeUI.PlayQiZiLuoDiEnter(worldPos)
                }
                if (cb) cb()
            }
        )
    }
}

export default LevelMergeNode;
