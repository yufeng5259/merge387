import '../../LegacyGlobals';

export class UserMerge {
    public data: any;
    constructor() {
        this.data = {
            bubblePieces:{},//
            bubbleStats:{},//
            mapId: 0,//地图id
            // Merge map data
            data: {},//初始化数�?舞台上的
            // Warehouse data
            warehouse: {},//仓库数据，仓库里�?
            /** 仓库容量*/
            warehouseCapacity: 0,//仓库容量
            /** 临时数据，没有领取的临时数据*/
            pendingRewards: {},//临时数据，没有领取的临时数据
            // Generator state
            generatorStates: null,//生成状态，生成状�?
            // Order data
            orderData: {},//订单
            userId: 0,//用户id
            lastRemovedPiece: null,//上一次撤销的棋�?
            resources: {},
            playerLevel:0,//玩家等级
            obtainedPieces:[],//已经获取过的棋子id[10001,100002]


        }

        // 字段:generatorStates{

        //     generatorId: 26,                   // 生成器棋子ID
        //     maxOutputCount: 5,            // 每次充能的最大产出次�?
        //     remainingCount: 5,              // 当前剩余次数
        //     queue: [1, 2, 3, 4, 5],            // 预生成的队列
        //     needCharge: true,               // 是否可充�?
        //     chargeTime: 100,                // 充能时长（秒�?
        //     coolingStartTime: 1234567890,    // 冷却开始时间戳
        //     nextRefillTime: 0,                // 下次刷新时间戳（0=未开始计时）
        //     lastRefillTime: 1234567890    // 上次刷新时间�?

        // }

        // 目前设计的数据结构是:

        // {
        //     orders: [                           // 订单槽位
        //         {
        //             orderId: 1,                 // 订单ID（订单表id�?
        //             slotIndex: 0,               // 槽位索引
        //             requiredPieces: {           // 需要的棋子
        //                 "1": 1,                 // 比如是棋子id"1"的棋�?�?
        //                 "5": 1,
        //                 "7": 1
        //             },
        //             matchedCells: {             //匹配的位�?
        //                 "1": ["3_4"],           // 棋盘位置
        //                 "5": ["warehouse_0"],   // 仓库位置(比如仓库有这个棋�?
        //                 "7": []                 // 未找�?目前没有这个棋子)
        //             },
        //             completed: false,           // 是否完成
        //             claimed: false,             // 是否已领�?
        //             rewards: [                  // 存放奖励的rewards(这个目前还没定下�?看是字符串还是对�?
        //                 {type: 1, cid: 0, count: 50},      // 基础：金�?0
        //                 {type: 102, cid: 1, count: 5},     // 活动：收集道�?�?
        //                 {type: 101, cid: 3, count: 1}      // 活动：拼图碎�?�?
        //             ],
        //             roleName: "bear"            // 角色名称�?
        //         }
        //     ],
        //     completedOrderIds: [2, 5, 7],       // 今日已完成的订单ID(记录每日完成订单�?
        //     lastRefreshDay: 19810               // 上次刷新日期（天数）
        // }


    }
    //终生气泡棋子免费次数
    BubbleFreeCount(){
        this.NormalizeSnapshotData()
        let config = typeof G !== 'undefined' ? G.GameConfig : null
        let consts = typeof G !== 'undefined' ? G.GameConstance : null
        let limit = parseInt((config && config.bubbleFreeCount) || (consts && consts.bubbleFreeCount)) || 0
        let used = parseInt(this.data.bubbleStats.freeUsedTotal) || 0
        return Math.max(limit - used, 0)
    }
    //每日气泡棋子广告次数
    BubbleAdCount(){
        this.NormalizeSnapshotData()
        let config = typeof G !== 'undefined' ? G.GameConfig : null
        let consts = typeof G !== 'undefined' ? G.GameConstance : null
        let limit = parseInt((config && config.bubbleADCount) || (consts && consts.bubbleADCount)) || 0
        let used = parseInt(this.data.bubbleStats.adUsedToday) || 0
        return Math.max(limit - used, 0)
    }

    //更新数据
    DefaultOrderData() {
        return {
            orders: [],
            completedOrderIds: [],
            orderSeed: 1,
            mode: 'newbie',
            newbieNextOrderId: 0,
            hardSequenceIndex: 0,
            nextRandomOrderId: 100000000,
            nextRecycleOrderId: 200000000,
            slotChargePolicyVersion: 2,
            slotStates: {},
            slotTypeStates: {},
            waitingForLevelUpgrade: false,
            levelOrderAllCompleteNotified: {},
            lastCompletedOrder: null
        }
    }
    NormalizeOrderData(orderData) {
        if (!orderData || typeof orderData !== 'object' || Array.isArray(orderData)) {
            orderData = this.DefaultOrderData()
        }
        if (!Array.isArray(orderData.orders)) {
            orderData.orders = []
        }
        if (!Array.isArray(orderData.completedOrderIds)) {
            orderData.completedOrderIds = []
        }
        if (orderData.orderSeed == null || isNaN(parseInt(orderData.orderSeed))) {
            orderData.orderSeed = 1
        }
        if (!orderData.mode) {
            orderData.mode = 'newbie'
        }
        if (orderData.newbieNextOrderId == null || isNaN(parseInt(orderData.newbieNextOrderId))) {
            orderData.newbieNextOrderId = 0
        }
        if (orderData.hardSequenceIndex == null || isNaN(parseInt(orderData.hardSequenceIndex))) {
            orderData.hardSequenceIndex = 0
        }
        if (orderData.nextRandomOrderId == null || isNaN(parseInt(orderData.nextRandomOrderId))) {
            orderData.nextRandomOrderId = 100000000
        }
        if (orderData.nextRecycleOrderId == null || isNaN(parseInt(orderData.nextRecycleOrderId))) {
            orderData.nextRecycleOrderId = 200000000
        }
        if (!orderData.slotStates || typeof orderData.slotStates !== 'object' || Array.isArray(orderData.slotStates)) {
            orderData.slotStates = {}
        }
        if (orderData.lastCompletedOrder != null && (typeof orderData.lastCompletedOrder !== 'object' || Array.isArray(orderData.lastCompletedOrder))) {
            orderData.lastCompletedOrder = null
        }
        return orderData
    }
    NormalizeSnapshotData() {
        if (!this.data.data || typeof this.data.data !== 'object' || Array.isArray(this.data.data)) {
            this.data.data = {}
        }
        if (!this.data.warehouse || typeof this.data.warehouse !== 'object' || Array.isArray(this.data.warehouse)) {
            this.data.warehouse = {}
        }
        if (!this.data.generatorStates || typeof this.data.generatorStates !== 'object' || Array.isArray(this.data.generatorStates)) {
            this.data.generatorStates = {}
        }
        if (!this.data.initialSequences || typeof this.data.initialSequences !== 'object' || Array.isArray(this.data.initialSequences)) {
            this.data.initialSequences = {}
        }
        if (!this.data.cookingStates || typeof this.data.cookingStates !== 'object' || Array.isArray(this.data.cookingStates)) {
            this.data.cookingStates = {}
        }
        if (!this.data.bubblePieces || typeof this.data.bubblePieces !== 'object' || Array.isArray(this.data.bubblePieces)) {
            this.data.bubblePieces = {}
        }
        if (!this.data.bubbleStats || typeof this.data.bubbleStats !== 'object' || Array.isArray(this.data.bubbleStats)) {
            this.data.bubbleStats = {}
        }
        if (!this.data.resources || typeof this.data.resources !== 'object' || Array.isArray(this.data.resources)) {
            this.data.resources = {}
        }
        if (!this.data.pendingRewards || typeof this.data.pendingRewards !== 'object') {
            this.data.pendingRewards = {}
        } else if (Array.isArray(this.data.pendingRewards)) {
            let map = {}
            for (let i = 0; i < this.data.pendingRewards.length; i++) {
                let reward = this.data.pendingRewards[i]
                if (reward !== undefined && reward !== null) {
                    map[i] = typeof reward === 'string' ? { t: 'piece', d: reward } : reward
                }
            }
            this.data.pendingRewards = map
        } else {
            for (let key in this.data.pendingRewards) {
                if (typeof this.data.pendingRewards[key] === 'string') {
                    this.data.pendingRewards[key] = { t: 'piece', d: this.data.pendingRewards[key] }
                }
            }
        }
        if (!Array.isArray(this.data.obtainedPieces)) {
            this.data.obtainedPieces = []
        }
        let warehouseCapacity = parseInt(this.data.warehouseCapacity)
        if (this.data.warehouseCapacity == null || isNaN(warehouseCapacity) || warehouseCapacity <= 0) {
            warehouseCapacity = 5
        }
        this.data.warehouseCapacity = warehouseCapacity
        this.data.orderData = this.NormalizeOrderData(this.data.orderData)
    }
    updateData(data) {
        if (!data || typeof data !== 'object') {
            this.NormalizeSnapshotData()
            return this
        }
        let prevPendingRewards = Object.prototype.hasOwnProperty.call(data, 'pendingRewards')
            ? this.ClonePendingRewardsForTutorial(this.data.pendingRewards)
            : null
        for (var key in data) {
            this.data[key] = data[key]
        }
        this.NormalizeSnapshotData()
        if (prevPendingRewards) this.NotifyPendingRewardsUpdatedForTutorial(prevPendingRewards)
        return this
    }
    Data() {
        this.NormalizeSnapshotData()
        return this.data
    }
    SetData(key, value) {
        this.data[key] = value
        return this
    }
    /**更新任务 */
    UpdateOrders(orders) {
        this.data.orderData = this.NormalizeOrderData(orders)
    }
    /**获取订单数据 */
    GetOrderData() {
        this.data.orderData = this.NormalizeOrderData(this.data.orderData)
        return this.data.orderData
    }
    /**获取订单数据 */
    GetOrders() {
        return this.GetOrderData().orders
    }
    /**根据槽位索引获取订单数据 */
    GetOrderDataBySlotIndex(slotIndex) {
        return this.GetOrderData().orders.find(item => item.slotIndex == slotIndex) || null
    }
    GetOrderDataByOrderId(orderId) {
        return this.GetOrderData().orders.find(item => String(item.orderId) === String(orderId)) || null
    }
    /**更新生成状�?*/
    UpdateGeneratorStates(generatorStates) {
        this.data.generatorStates = generatorStates
    }
    /**
     * 设置仓库数据
     * @param {*} warehouse 仓库数据
     * @param {*} unlockCount 已解锁数�?
     */
    UpdateMergeWharehouse(warehouse, warehouseCapacity) {
        this.UpdateWarehouseCapacity(warehouseCapacity)
        this.data.warehouse = warehouse
    }
    /**更新仓库容量 */
    UpdateWarehouseCapacity(warehouseCapacity) {
        warehouseCapacity = parseInt(warehouseCapacity)
        this.data.warehouseCapacity = isNaN(warehouseCapacity) || warehouseCapacity <= 0 ? 5 : warehouseCapacity
    }

    //获得数据
    getData() {
        let data = {}
        for (var key in this.data) {
            data[key] = this.data[key]
        }
        return data
    }

    //设置某项数据
    setData(key, value) {
        this.data[key] = value
        return this
    }
    /**玩家的等�?*/
    UpDatePlayerLevel(playerLevel){
        this.data.playerLevel=playerLevel;
    }
    GetPlayerLevel(){   
        return this.data.playerLevel;
    }
    /**
     * 地图id
     * @returns {number} 地图id
     */
    MapId() {
        return this.data.mapId
    }
    /**更新合并地图 */
    UpdateMergeMap(mergeMapData) {
        this.data.data = mergeMapData
    }
    /**获取合并地图数据 */
    GetMergeMapData() {
        return this.data.data
    }
    /**判断tile坐标是否为空 */
    CheckTilePosIsEmpty(cellKey) {
        let dataStr = this.data.data[cellKey]
        if (dataStr) {
            return false
        }
        return true
    }
    /**
     * 获取空格子数量（仅统计，无序�?
     * @returns 
     */
    GetEmptyTileCount(gridSizeW, gridSizeH) {
        let count = 0
        for (let x = 0; x < gridSizeW; x++) {
            for (let y = 0; y < gridSizeH; y++) {
                let cellKey = `${x}_${y}`
                if (this.CheckTilePosIsEmpty(cellKey)) {
                    count++
                }
            }
        }

        return count
    }
    /**
     * "44_-1_-1=44_1774591838_770958"
     * 返回 "44_1774591838_770958"
     * @param {number} tx 行坐�?
     * @param {number} ty 列坐�?
     * @returns {string} 生成器id
     * 根据tile坐标获取生成器id 
     * */
    getGeneratorIdByMergeTilePos(tx, ty) {
        let cellKey = `${tx}_${ty}`
        let dataStr = this.data.data[cellKey]
        // console.log(tx,ty,"dataStr",dataStr);
        if (dataStr) {
            let dtArr = dataStr.split('=')
            if (dtArr.length > 1) {
                return dtArr[1]
            }
        }
        return null
    }
    /**
     * "44_-1_-1=44_1774591838_770958"
     * 返回 "44_-1_-1"
     * @param {string} dataStr 合并地图数据
     * @returns {string} 解析后的合并地图数据
     */
    ParseMergeMapData(dataStr) {
        let dtArr = dataStr.split('=')
        if (dtArr.length > 1) {
            return dtArr[0]
        }
        return dataStr
    }

    /**获取生成数据 */
    GetGeneratorData() {
        return this.data.generatorStates
    }
    _callGeneratorMeta(meta, methodName, defaultValue) {
        try {
            if (meta && typeof meta[methodName] === 'function') {
                return meta[methodName]()
            }
        } catch (e) { }
        return defaultValue
    }
    _getGeneratorConfigForPreview(generatorId) {
        try {
            if (typeof SR !== 'undefined' && SR.SRMerge && SR.SRMerge.MergeBoardLogicConfigProvider && SR.SRMerge.MergeBoardLogicConfigProvider.getGeneratorByMergeId) {
                let cfg = SR.SRMerge.MergeBoardLogicConfigProvider.getGeneratorByMergeId(generatorId)
                if (cfg) return cfg
            }
        } catch (e) { }
        try {
            if (typeof Meta === 'undefined' || !Meta.MergeGeneraterMeta || !Meta.MergeGeneraterMeta.GetGenerateByMergeId) return null
            let meta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(generatorId)
            if (!meta) return null
            return {
                maxOutputCount: this._callGeneratorMeta(meta, 'MaxOutputCount', 0),
                needCharge: this._callGeneratorMeta(meta, 'NeedCharge', false),
                chargeTime: this._callGeneratorMeta(meta, 'ChargeTime', 0),
                delayTime: this._callGeneratorMeta(meta, 'DelayTime', 0),
                onetimeDestroy: this._callGeneratorMeta(meta, 'OnetimeDestroy', 0),
                output: this._callGeneratorMeta(meta, 'Output', []),
                consumeCount: this._callGeneratorMeta(meta, 'ConsumeCount', ''),
                spawnType: this._callGeneratorMeta(meta, 'SpawnType', null),
                prdId: this._callGeneratorMeta(meta, 'PrdId', null),
                prdChangeRate: this._callGeneratorMeta(meta, 'PrdChangeRate', 0),
                initialSequence: this._callGeneratorMeta(meta, 'InitialSequence', []),
                interval: this._callGeneratorMeta(meta, 'Interval', '')
            }
        } catch (e) {
            return null
        }
    }
    _getCurrentTimeForPreview() {
        try {
            if (typeof GameKit !== 'undefined' && GameKit.TimeUtil && GameKit.TimeUtil.getCurrentTime) {
                return GameKit.TimeUtil.getCurrentTime()
            }
        } catch (e) { }
        return Math.floor(Date.now() / 1000)
    }
    _isNeedChargeForPreview(generatorState, generatorConfig) {
        try {
            if (typeof Game !== 'undefined' && Game.MergeBoardLogic && Game.MergeBoardLogic.parseNeedCharge) {
                return Game.MergeBoardLogic.parseNeedCharge(generatorConfig ? generatorConfig.needCharge : generatorState.needCharge)
            }
        } catch (e) { }
        let value = generatorConfig ? generatorConfig.needCharge : generatorState.needCharge
        return value === true || value === 'TRUE' || value === 'true' || value === 1 || value === '1'
    }
    _refreshGeneratorStateForPreview(generatorState, generatorConfig?: any, currentTime?: any) {
        if (!generatorState) return generatorState
        let boardLogic = (typeof Game !== 'undefined') ? Game.MergeBoardLogic : null
        if (!boardLogic) return generatorState
        generatorConfig = generatorConfig || this._getGeneratorConfigForPreview(generatorState.generatorId)
        currentTime = currentTime || this._getCurrentTimeForPreview()
        if (boardLogic.syncGeneratorRecoverConfig && generatorConfig) {
            boardLogic.syncGeneratorRecoverConfig(generatorState, generatorConfig)
        }
        if (boardLogic.applyGeneratorSmallRecover && generatorConfig) {
            boardLogic.applyGeneratorSmallRecover(generatorState, generatorConfig, currentTime)
        }
        return generatorState
    }
    _ensureGeneratorPreviewQueue(generatorState) {
        if (!generatorState) return false
        if (!Array.isArray(generatorState.queue)) {
            generatorState.queue = []
        }
        let boardLogic = (typeof Game !== 'undefined') ? Game.MergeBoardLogic : null
        let generatorConfig = this._getGeneratorConfigForPreview(generatorState.generatorId)
        let currentTime = this._getCurrentTimeForPreview()
        this._refreshGeneratorStateForPreview(generatorState, generatorConfig, currentTime)

        if (boardLogic && boardLogic.ensureInitialSequence && generatorConfig) {
            boardLogic.ensureInitialSequence(this.data, generatorState.generatorId, generatorConfig)
        }

        let nextRefillTime = parseInt(generatorState.nextRefillTime) || 0
        let needCharge = this._isNeedChargeForPreview(generatorState, generatorConfig)
        let onetimeDestroy = parseInt(generatorState.onetimeDestroy != null ? generatorState.onetimeDestroy : (generatorConfig && generatorConfig.onetimeDestroy)) === 1
        let delayTime = parseInt(generatorState.delayTime != null ? generatorState.delayTime : (generatorConfig && generatorConfig.delayTime)) || 0
        let delayCountdownJustFinished = false
        if (nextRefillTime > 0) {
            if (currentTime < nextRefillTime) {
                return false
            }
            if (needCharge && boardLogic && boardLogic.refillGeneratorQueue && generatorConfig) {
                boardLogic.refillGeneratorQueue(generatorState, generatorConfig)
                generatorState.remainingCount = parseInt(generatorState.maxOutputCount) || parseInt(generatorConfig.maxOutputCount) || parseInt(generatorState.remainingCount) || 0
            } else if (!needCharge && onetimeDestroy && delayTime > 0) {
                delayCountdownJustFinished = true
            }
            generatorState.lastRefillTime = currentTime
            generatorState.nextRefillTime = 0
            generatorState.coolingStartTime = 0
            generatorState.lastSmallRecoverTime = 0
        }

        if ((!generatorState.queue || generatorState.queue.length <= 0) && boardLogic && boardLogic.refillGeneratorQueue && generatorConfig) {
            boardLogic.refillGeneratorQueue(generatorState, generatorConfig)
        }

        let remainingCount = parseInt(generatorState.remainingCount)
        if (isNaN(remainingCount)) remainingCount = 0
        if (remainingCount <= 0) {
            if (onetimeDestroy) {
                return false
            }
            if (needCharge) {
                return false
            }
            if (boardLogic && boardLogic.refillGeneratorQueue && generatorConfig) {
                boardLogic.refillGeneratorQueue(generatorState, generatorConfig)
                generatorState.remainingCount = parseInt(generatorState.maxOutputCount) || parseInt(generatorConfig.maxOutputCount) || 0
            }
        }

        if (!delayCountdownJustFinished && !needCharge && onetimeDestroy && delayTime > 0 &&
            generatorState.nextRefillTime === 0 && remainingCount === (parseInt(generatorState.maxOutputCount) || 0)) {
            return true
        }

        if (boardLogic && boardLogic.peekInitialSequence && boardLogic.peekInitialSequence(this.data, generatorState.generatorId) != null) {
            return true
        }
        return !!(generatorState.queue && generatorState.queue.length > 0)
    }
    /**根据tile坐标判断是否有生成数�?
     * @returns {boolean} 是否有生成数�?
     */
    IfHasGeneratorDataByMergeTilePos(tx, ty) {
        let instanceId = this.getGeneratorIdByMergeTilePos(tx, ty)
        if (!instanceId) {
            return false
        }
        let data = this.data.generatorStates[instanceId]
        if (data) {
            return this._ensureGeneratorPreviewQueue(data)
        }
        return false
    }
    /**根据tile坐标判断是否可以删除生成数据
     * @returns {boolean} 是否可以删除生成数据
     */
    IfCanDeleteGeneratorDataByMergeTilePos(tx, ty) {
        let instanceId = this.getGeneratorIdByMergeTilePos(tx, ty)
        if (!instanceId) {
            return false
        }
        let data = this.data.generatorStates[instanceId]
        console.log(data, "data");
        if (data) {
            return data.remainingCount == 0 && data.needCharge == false
        }
        return false
    }
    /**根据tile坐标获取生成gid
     * @returns {array} [gid,queue.length]
     */
    GetGeneratorGidByMergeTilePos(tx, ty) {
        let instanceId = this.getGeneratorIdByMergeTilePos(tx, ty)
        if (!instanceId) {
            return null
        }
        let data = this.data.generatorStates[instanceId]
        if (data) {
            this._ensureGeneratorPreviewQueue(data)
            // 初始序列优先（与公共代码 generate 的消费顺序一致）
            let gid = null
            if (Game.MergeBoardLogic && Game.MergeBoardLogic.peekInitialSequence) {
                gid = Game.MergeBoardLogic.peekInitialSequence(this.data, data.generatorId)
            }
            if (gid == null) gid = data.queue[0]
            if (gid == null) return null
            return [gid, instanceId, data.remainingCount]
        }
        return null
    }
    /**判断是否是一次性销毁生成器，如体力箱子，第一次点击会先启动冷却，然后才能生成棋子 */
    IfOnetimeDestroyGenerator(instanceId) {
        let data = this.data.generatorStates[instanceId]
        if (data) {
            return data.onetimeDestroy == 1 && data.nextRefillTime === 0 && data.remainingCount === data.maxOutputCount
        }
        return false
    }
    /**根据tile坐标获取生成instanceId */
    GetGeneratorInstanceIdByMergeTilePos(tx, ty) {
        return this.getGeneratorIdByMergeTilePos(tx, ty)
    }
    /**根据instanceId获取生成数据 */
    GetGeneratorByInstanceId(instanceId) {
        let data = this.data.generatorStates[instanceId]
        if (data) this._refreshGeneratorStateForPreview(data)
        return data
    }
    /**判断是否可以产出 */
    CheckCanGenerate(instanceId) {
        let data = this.data.generatorStates[instanceId]
        if (data) {
            this._refreshGeneratorStateForPreview(data)
            return data.nextRefillTime == 0
        }
        return false
    }
    /**
     * item:null||"1_-1_-1"
     * null:空格 //空格�?
     * "1_-1_-1":格子数据
     * "add"：添加按�?
     * "unlock"：未解锁
     * 数据结构：[{item:null||"1_-1_-1"}]
     * 获取仓库数据
     * @returns {array} 仓库数据
     */
    GetStoreData() {
        return this.data.warehouse
    }
    /**获取仓库容量 */
    GetWarehouseCapacity() {
        this.NormalizeSnapshotData()
        return this.data.warehouseCapacity
    }
    /**获取仓库数据Id */
    GetWarehouseDataId() {
        let ids = []
        let store = this.GetStoreData();
        let storeData = Object.keys(store).map((key) => store[key]);
        storeData.forEach(element => {
            if (element) {
                let item = element.split('_')
                ids.push(parseInt(item[0]))
            }
        });
        return ids
    }
    /**
     * 判断仓库是否有空位置可以放置
     * @returns {boolean} 是否有空位置可以放置
     */
    GetStoreCanPut() {
        this.NormalizeSnapshotData()
        return Object.keys(this.data.warehouse).length < this.data.warehouseCapacity;
    }
    /**更新临时数据 */
    UpdateMergePendingRewards(pendingRewards) {
        let prevPendingRewards = this.ClonePendingRewardsForTutorial(this.data.pendingRewards)
        if (pendingRewards !== undefined && pendingRewards !== null) {
            this.data.pendingRewards = pendingRewards
        }
        this.NormalizeSnapshotData()
        this.NotifyPendingRewardsUpdatedForTutorial(prevPendingRewards)
    }
    NotifyPendingRewardsUpdatedForTutorial(prevPendingRewards) {
        if (global.Game && Game.MergeTutorialManager && Game.MergeTutorialManager.NotifyPendingRewardsUpdated) {
            Game.MergeTutorialManager.NotifyPendingRewardsUpdated(this.data.pendingRewards, prevPendingRewards)
        }
    }
    ClonePendingRewardsForTutorial(pendingRewards) {
        let clone = {}
        if (!pendingRewards || typeof pendingRewards !== 'object') return clone
        for (let key in pendingRewards) {
            if (!Object.prototype.hasOwnProperty.call(pendingRewards, key)) continue
            let reward = pendingRewards[key]
            clone[key] = reward && typeof reward === 'object' ? Object.assign({}, reward) : reward
        }
        return clone
    }
    /**
     * "1_-1_-1"
     * 获取最后一个临时数�?
     * @returns {number} 最后一个临时数�?
     */
    GetLastPendingRewards() {
        if (Object.keys(this.data.pendingRewards).length == 0) {
            return null
        }
        let keys = Object.keys(this.data.pendingRewards)
        let key = keys[keys.length - 1]
        return this.data.pendingRewards[key]
    }
    /**
     * 
     * @returns {array} 临时数据
     */
    GetPendingRewards() {
        return this.data.pendingRewards
    }
    /**获取临时数据数量 */
    GetPendingRewardsCount() {
        return Object.keys(this.data.pendingRewards).length
    }
    /**
     * 根据value返回key值获取最后一个临时数据key�?
    * pendingRewards:{0: '3_-1_-1', 1: '19_-1_-1'}
    * 返回 key�?
     * */
    GetLastPendingRewardsKey(dataStr) {
        let keys = Object.keys(this.data.pendingRewards)
        for (let i = keys.length - 1; i >= 0; i--) {
            let key = keys[i]
            let reward = this.data.pendingRewards[key]
            let rewardData = typeof reward === 'string' ? reward : reward && reward.d
            if (rewardData == dataStr) {
                return key
            }
        }
        return undefined
    }
    /**
     *  根据cookingId值获取烹饪数�?
     * @param {*} cookingId 
     * @returns 
     */
    GetCookingState(cookingId){
        return this.data.cookingStates[cookingId]

    }

    /**获取气泡棋子数据 */
    GetBubbleByTilePos(tx, ty){
        let bubbleId=this.getGeneratorIdByMergeTilePos(tx,ty)
        return this.data.bubblePieces[bubbleId]
    }
}
