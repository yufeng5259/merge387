import '../../../LegacyGlobals';
import { sys } from 'cc';
import MergeContentUtil from '../MergeContentUtil';

const SRMerge: any = {}

SRMerge.DebugMergeOrder = true

SRMerge.DebugClone = (value) => {
    try {
        return JSON.parse(JSON.stringify(value))
    } catch (e) {
        return value
    }
}

SRMerge.DebugCountPieces = (boardData, warehouseData) => {
    let counts = {}
    let addPiece = (dataStr) => {
        if (!dataStr || typeof dataStr !== "string") return
        let base = dataStr.split("=")[0]
        let parts = base.split("_")
        let pieceId = parseInt(parts[0])
        let status = parseInt(parts[1])
        if (isNaN(pieceId) || status !== -1) return
        counts[pieceId] = (counts[pieceId] || 0) + 1
    }
    if (boardData) {
        for (let cellKey in boardData) {
            addPiece(boardData[cellKey])
        }
    }
    if (warehouseData) {
        for (let key in warehouseData) {
            addPiece(warehouseData[key])
        }
    }
    return counts
}

SRMerge.DebugLogClaimOrder = (phase, payload) => {
    if (!SRMerge.DebugMergeOrder) return
    try {
        console.log("[MergeOrderDebug][SRMerge." + phase + "]", payload)
    } catch (e) { }
}

SRMerge.ShouldBlockMergeTutorialSave = () => {
    return !!(
        Game &&
        Game.MergeTutorialManager &&
        Game.MergeTutorialManager.ShouldBlockMergeSave &&
        Game.MergeTutorialManager.ShouldBlockMergeSave()
    )
}

SRMerge.ClearPendingOps = () => {
    SRMerge.ops = []
    SRMerge.pendingConsumeContents = []
    SRMerge.pendingContentDeltas = []
}

SRMerge.LocalSnapshotStoragePrefix = "coinbeach24.mergeMapSnapshot.v1"

SRMerge.GetCurrentUserIdForLocalSnapshot = () => {
    try {
        if (Game && Game.SUser && Game.SUser.UserId) return Game.SUser.UserId()
        if (Game && Game.SUser && Game.SUser.Id) return Game.SUser.Id()
    } catch (e) { }
    try {
        if (Game && Game.SUserMerge && Game.SUserMerge.Data) return Game.SUserMerge.Data().userId
    } catch (e2) { }
    return "0"
}

SRMerge.GetLocalMergeSnapshotKey = () => {
    return SRMerge.LocalSnapshotStoragePrefix + "." + SRMerge.GetCurrentUserIdForLocalSnapshot()
}

SRMerge.GetLocalStorage = () => {
    try {
        if (sys && sys.localStorage) return sys.localStorage
    } catch (e) { }
    try {
        if (typeof localStorage !== "undefined") return localStorage
    } catch (e2) { }
    return null
}

SRMerge.IsUsableLocalMergeSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return false
    let hasObjectData = (value) => {
        return !!(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0)
    }
    if (hasObjectData(snapshot.data)) return true
    if (hasObjectData(snapshot.warehouse)) return true
    if (hasObjectData(snapshot.pendingRewards)) return true
    if (hasObjectData(snapshot.generatorStates)) return true
    if (hasObjectData(snapshot.initialSequences)) return true
    if (hasObjectData(snapshot.cookingStates)) return true
    if (hasObjectData(snapshot.bubblePieces)) return true
    if (snapshot.orderData && Array.isArray(snapshot.orderData.orders) && snapshot.orderData.orders.length > 0) return true
    return false
}

SRMerge.LoadLocalMergeSnapshot = () => {
    let storage = SRMerge.GetLocalStorage()
    if (!storage) return null
    let raw = null
    try {
        raw = storage.getItem(SRMerge.GetLocalMergeSnapshotKey())
    } catch (e) {
        return null
    }
    if (!raw) return null
    try {
        let parsed = JSON.parse(raw)
        let snapshot = parsed && parsed.snapshot ? parsed.snapshot : parsed
        return SRMerge.IsUsableLocalMergeSnapshot(snapshot) ? snapshot : null
    } catch (e2) {
        return null
    }
}

SRMerge.SaveLocalMergeSnapshot = (reason, snapshot) => {
    let storage = SRMerge.GetLocalStorage()
    if (!storage) return false
    if (!snapshot && SRMerge.SyncResourceShadow) {
        try { SRMerge.SyncResourceShadow() } catch (e) { }
    }
    try {
        snapshot = snapshot || (Game && Game.SUserMerge && Game.SUserMerge.Data ? Game.SUserMerge.Data() : null)
    } catch (e) {
        snapshot = null
    }
    if (!SRMerge.IsUsableLocalMergeSnapshot(snapshot)) return false
    let cloned = SRMerge.DebugClone(snapshot)
    if (!cloned || typeof cloned !== "object") return false
    cloned.userId = cloned.userId || SRMerge.GetCurrentUserIdForLocalSnapshot()
    let payload = {
        version: 1,
        userId: String(SRMerge.GetCurrentUserIdForLocalSnapshot()),
        savedAt: Date.now(),
        reason: reason || "",
        snapshot: cloned
    }
    try {
        storage.setItem(SRMerge.GetLocalMergeSnapshotKey(), JSON.stringify(payload))
        return true
    } catch (e2) {
        console.log("SaveLocalMergeSnapshot error", reason, e2)
        return false
    }
}

SRMerge.ClearLocalMergeSnapshot = () => {
    let storage = SRMerge.GetLocalStorage()
    if (!storage) return false
    try {
        storage.removeItem(SRMerge.GetLocalMergeSnapshotKey())
        return true
    } catch (e) {
        return false
    }
}

SRMerge.GetCurrentApRecoverLast = () => {
    try {
        if (typeof GameKit !== "undefined" && GameKit.TimeUtil && GameKit.TimeUtil.getCurrentTime) {
            return GameKit.TimeUtil.getCurrentTime() - 1
        }
    } catch (e) { }
    return Math.floor(Date.now() / 1000)
}

SRMerge.GetValidNumber = (value, defaultValue) => {
    let num = Number(value)
    return isFinite(num) ? num : defaultValue
}

SRMerge.GetApMax = () => {
    try {
        if (typeof Game !== "undefined" && Game.SUser && Game.SUser.GetApRuntimeConfig) {
            let config = Game.SUser.GetApRuntimeConfig()
            return SRMerge.GetValidNumber(config && config.apMax, null)
        }
    } catch (e) { }
    if (typeof G !== "undefined" && G.GameConstance) {
        return SRMerge.GetValidNumber(G.GameConstance.apMax, null)
    }
    return null
}

SRMerge.BuildApUpdateData = (apValue) => {
    try { if (Game.SUser && Game.SUser.UpdateApTime) Game.SUser.UpdateApTime() } catch (e) { }

    let nextAp = Math.max(0, SRMerge.GetValidNumber(apValue, 0))
    let apMax = SRMerge.GetApMax()
    let now = SRMerge.GetCurrentApRecoverLast()
    let data: any = { ap: nextAp }
    if (apMax == null || apMax <= 0 || typeof Game === "undefined" || !Game.SUser) return data

    let beforeAp = SRMerge.GetValidNumber(Game.SUser.Ap && Game.SUser.Ap(), 0)
    if (nextAp >= apMax) {
        data.apRecover = 0
        data.apRecoverLast = now
    } else if (beforeAp < apMax) {
        data.apRecover = SRMerge.GetValidNumber(Game.SUser.ApRecover && Game.SUser.ApRecover(), 0)
        data.apRecoverLast = SRMerge.GetValidNumber(Game.SUser.ApRecoverLast && Game.SUser.ApRecoverLast(), now)
    } else {
        data.apRecover = 0
        data.apRecoverLast = now
    }
    return data
}
SRMerge.ApplyResourceShadowToUser = (snapshot) => {
    if (typeof Game === "undefined" || !Game.SUser || !Game.SUser.updateData || !snapshot) return false
    let resources = snapshot.resources
    if (!resources || typeof resources !== "object" || Array.isArray(resources)) return false
    let data: any = {}
    if (resources["1_0"] != null) data.coin = Number(resources["1_0"]) || 0
    if (resources["2_0"] != null) {
        let resourceState = snapshot.resourceState || {}
        data.ap = Number(resources["2_0"]) || 0
        data.apRecover = Number(resourceState.apRecover) || 0
        data.apRecoverLast = Number(resourceState.apRecoverLast) || SRMerge.GetCurrentApRecoverLast()
    }
    if (resources["7_0"] != null) data.cash = Number(resources["7_0"]) || 0
    if (resources["8_0"] != null) data.exp = Number(resources["8_0"]) || 0
    if (Object.keys(data).length === 0) return false
    Game.SUser.updateData(data)
    return true
}

SRMerge.ApplyLatestLocalResourceShadow = (reason) => {
    let snapshot = SRMerge.LoadLocalMergeSnapshot()
    if (!snapshot) return false
    let applied = SRMerge.ApplyResourceShadowToUser(snapshot)
    if (!applied) return false
    if (SRMerge.SyncResourceShadow) {
        try { SRMerge.SyncResourceShadow() } catch (e) { }
    }
    if (reason) {
        try { SRMerge.SaveLocalMergeSnapshot("resourceShadow:" + reason) } catch (e2) { }
    }
    return true
}

SRMerge.ApplyLocalMergeSnapshot = (snapshot, reason) => {
    if (!SRMerge.IsUsableLocalMergeSnapshot(snapshot)) return false
    if (typeof Game === "undefined" || !Game.SUserMerge || !Game.SUserMerge.updateData) return false
    let cloned = SRMerge.DebugClone(snapshot)
    Game.SUserMerge.updateData(cloned)
    SRMerge.ApplyResourceShadowToUser(cloned)
    SRMerge.SyncResourceShadow()
    SRMerge.SyncLocalOrders("localSnapshot:" + (reason || "load"))
    return true
}

SRMerge.LocalServerRequest = (method, result) => {
    let callbacks = []
    let errorCallbacks = []
    let successCode = (typeof ErrorCode !== "undefined" && ErrorCode.SUCCESS != null) ? ErrorCode.SUCCESS : 0
    return {
        localOnly: true,
        data: { method: method, localOnly: true },
        localResult: { method: method, errorCode: successCode, result: result || {}, events: {} },
        SetRequestBody: function (key, body) { this.data[key] = body; return this },
        SetCallBack: function (fn) { callbacks.push(fn); return this },
        SetErrorCallBack: function (fn) { errorCallbacks.push(fn); return this },
        SetNetErrorCallBack: function () { return this },
        SetSilence: function (value) { this.silence = value; return this },
        okCallback: function (res) {
            res = res || this.localResult
            if (res.errorCode !== successCode) {
                for (let i = 0; i < errorCallbacks.length; i++) {
                    if (errorCallbacks[i]) errorCallbacks[i](res)
                }
                return false
            }
            let payload = res.result || {}
            for (let j = 0; j < callbacks.length; j++) {
                if (callbacks[j]) callbacks[j](payload)
            }
            return true
        },
        Send: function () {
            this.okCallback(this.localResult)
            return this
        }
    }
}

// 获取地图
SRMerge.TrackSaveMapLitePromise = (promise) => {
    if (!promise || typeof promise.then !== "function") return promise

    let trackingPromise = promise.catch((err) => {
        return err
    }).then((result) => {
        if (SRMerge._saveMapLiteInFlightPromises) {
            let index = SRMerge._saveMapLiteInFlightPromises.indexOf(trackingPromise)
            if (index >= 0) {
                SRMerge._saveMapLiteInFlightPromises.splice(index, 1)
            }
        }
        return result
    })
    if (!SRMerge._saveMapLiteInFlightPromises) {
        SRMerge._saveMapLiteInFlightPromises = []
    }
    SRMerge._saveMapLiteInFlightPromises.push(trackingPromise)
    return promise
}

SRMerge.GetSaveMapLiteInFlightPromise = () => {
    if (!SRMerge._saveMapLiteInFlightPromises || SRMerge._saveMapLiteInFlightPromises.length === 0) return null
    return Promise.all(SRMerge._saveMapLiteInFlightPromises.slice())
}

/**
 * 单机架构：直接把整盘 mergemap 快照上报服务器保存（服务器不校验，只存）
 * 在关键节点调用：完成订单、领取资源奖励、切换场景、退后台�?
 * @param {string} reason 触发原因（仅日志�?
 * @returns {Promise|null}
 */
SRMerge.saveMergeSnapshot = (reason) => {
    if (SRMerge.ShouldBlockMergeTutorialSave()) {
        SRMerge.ClearPendingOps()
        return null
    }
    SRMerge.SyncResourceShadow()
    let snapshot = Game.SUserMerge.Data()
    if (!snapshot) return null
    SRMerge.SaveLocalMergeSnapshot(reason || "saveMergeMap", snapshot)
    let req = new GameKit.ServerRequest("saveMergeMap")
    req.SetRequestBody("mapData", snapshot)
    let promise = new Promise((resolve, reject) => {
        req.SetCallBack(res => { resolve(res) })
        req.SetErrorCallBack(function (error) {
            console.log('saveMergeMap error', reason, error)
            reject(error || new Error('saveMergeMap error'))
        })
        req.SetNetErrorCallBack(function () {
            console.log('saveMergeMap net error', reason)
            reject(new Error('saveMergeMap net error'))
        })
    })
    req.SetSilence(true)
    req.Send()
    SRMerge.TrackSaveMapLitePromise(promise)
    return promise
}

/**
 * 构造一个「本地结果」的链式请求 stub，兼容旧�?req.SetCallBack().Send() 调用方式�?
 * 公共代码已在本地完成运算，这里同步把本地结果回调给调用方，并在后台上报整盘快照�?
 * @param {Object} localRes 传给 SetCallBack 的本地结�?
 * @param {string} reason 快照上报原因
 */
SRMerge.LocalResultRequest = (localRes, reason, options) => {
    options = options || {}
    let cb = null
    let errCb = null
    let stub = {
        SetRequestBody: function () { return this },
        SetCallBack: function (fn) { cb = fn; return this },
        SetErrorCallBack: function (fn) { errCb = fn; return this },
        SetNetErrorCallBack: function () { return this },
        SetSilence: function () { return this },
        Send: function () {
            if (localRes && localRes.success === false) {
                if (typeof errCb === "function") errCb(localRes)
            } else {
                if (localRes && SRMerge.ApplyResultSideEffects) {
                    SRMerge.ApplyResultSideEffects(localRes, reason)
                }
                SRMerge.SaveLocalMergeSnapshot(reason || "localResult")
                if (typeof cb === "function") cb(localRes || {})
                if (options.persist !== false) {
                    let promise = SRMerge.PersistMergeSnapshot(reason)
                    if (localRes && SRMerge.AttachServerPromise) {
                        SRMerge.AttachServerPromise(localRes, promise, "LocalResultRequest persist error")
                    }
                    if (promise && typeof promise.catch === "function") {
                        promise.catch((err) => { console.error(err, "LocalResultRequest persist error") })
                    }
                }
            }
            return this
        }
    }
    return stub
}

SRMerge.GetLocalOrderSeedKey = () => {
    let userId = 'orders'
    try {
        if (Game.SUser && Game.SUser.Id) {
            userId = Game.SUser.Id()
        } else if (Game.SUserMerge && Game.SUserMerge.Data && Game.SUserMerge.Data().userId) {
            userId = Game.SUserMerge.Data().userId
        }
    } catch (e) { }
    return String(userId) + '_orders'
}

SRMerge.GetLocalPlayerLevel = () => {
    try {
        if (Game.SUser && Game.SUser.Level) {
            return Game.SUser.Level()
        }
    } catch (e) { }
    try {
        if (Game.SUserMerge && Game.SUserMerge.GetPlayerLevel) {
            return Game.SUserMerge.GetPlayerLevel()
        }
    } catch (e) { }
    return 1
}

SRMerge.SyncLocalOrders = (reason) => {
    if (typeof Game === 'undefined' || !Game.SUserMerge || !Game.MergeOrderLogic) return null
    if (!Game.MergeOrderLogic.syncOrdersForPlayerLevel) return null

    let orderState = Game.SUserMerge.GetOrderData ? Game.SUserMerge.GetOrderData() : null
    if (!orderState) return null

    let result = null
    try {
        result = Game.MergeOrderLogic.syncOrdersForPlayerLevel(
            orderState,
            SRMerge.GetLocalPlayerLevel(),
            SRMerge.MergeOrderLogiConfigProvider(),
            SRMerge.GetLocalOrderSeedKey(),
            Game.SUserMerge.GetMergeMapData ? Game.SUserMerge.GetMergeMapData() : {},
            Game.SUserMerge.GetStoreData ? Game.SUserMerge.GetStoreData() : {}
        )
        if (Game.MergeOrderLogic.checkAllOrderProgress) {
            Game.MergeOrderLogic.checkAllOrderProgress(
                Game.SUserMerge.GetMergeMapData ? Game.SUserMerge.GetMergeMapData() : {},
                Game.SUserMerge.GetStoreData ? Game.SUserMerge.GetStoreData() : {},
                orderState
            )
        }
        if (Game.SUserMerge.UpdateOrders) {
            Game.SUserMerge.UpdateOrders(orderState)
        }
        SRMerge.SaveLocalMergeSnapshot("syncOrders:" + (reason || ""))
    } catch (e) {
        console.log('SyncLocalOrders error', reason, e)
    }
    return result
}

SRMerge.InitLocalMergeMap = (mapData) => {
    if (!mapData || typeof Game === "undefined" || !Game.SUserMerge) return null
    let snapshot = Game.SUserMerge.Data()
    snapshot.data = SRMerge.DebugClone(mapData) || {}
    if (!snapshot.warehouse || typeof snapshot.warehouse !== "object") snapshot.warehouse = {}
    if (!snapshot.pendingRewards || typeof snapshot.pendingRewards !== "object") snapshot.pendingRewards = {}
    if (!snapshot.generatorStates || typeof snapshot.generatorStates !== "object") snapshot.generatorStates = {}
    if (!snapshot.initialSequences || typeof snapshot.initialSequences !== "object") snapshot.initialSequences = {}
    if (Game.MergeBoardLogic && Game.MergeBoardLogic.initBoard) {
        Game.MergeBoardLogic.initBoard(snapshot, SRMerge.MergeBoardLogicConfigProvider)
    }
    Game.SUserMerge.updateData(snapshot)
    SRMerge.SaveLocalMergeSnapshot("initLocalMergeMap", snapshot)
    return snapshot
}

SRMerge.SyncResourceShadow = () => {
    if (typeof Game === "undefined" || !Game.SUserMerge || !Game.SUser) return null
    let resources: any = {}
    let resourceState: any = {}
    try { if (Game.SUser.Coin) resources["1_0"] = Game.SUser.Coin() } catch (e) { }
    try {
        if (Game.SUser.Ap) {
            if (Game.SUser.UpdateApTime) Game.SUser.UpdateApTime()
            resources["2_0"] = Game.SUser.Ap()
            if (Game.SUser.ApRecover) resourceState.apRecover = Game.SUser.ApRecover()
            if (Game.SUser.ApRecoverLast) resourceState.apRecoverLast = Game.SUser.ApRecoverLast()
        }
    } catch (e) { }
    try { if (Game.SUser.Cash) resources["7_0"] = Game.SUser.Cash() } catch (e) { }
    try { if (Game.SUser.Exp) resources["8_0"] = Game.SUser.Exp() } catch (e) { }
    try { if (Game.SUser.Shield) resources["3_0"] = Game.SUser.Shield() } catch (e) { }
    Game.SUserMerge.SetData("resources", resources)
    Game.SUserMerge.SetData("resourceState", resourceState)
    Game.SUserMerge.SetData("playerLevel", SRMerge.GetLocalPlayerLevel())
    return resources
}

SRMerge.NormalizeContentPayload = (content) => {
    if (!content) return null
    if (typeof content === "string") return content
    if (Array.isArray(content)) {
        let contents = []
        for (let i = 0; i < content.length; i++) {
            let item = SRMerge.NormalizeContentPayload(content[i])
            if (item) contents.push(item)
        }
        return contents
    }
    let type = content.type
    let cid = content.cid
    let count = content.count
    try { if (type == null && content.Type) type = content.Type() } catch (e) { }
    try { if (cid == null && content.Id) cid = content.Id() } catch (e) { }
    try { if (cid == null && content.ContentId) cid = content.ContentId() } catch (e) { }
    try { if (count == null && content.Count) count = content.Count() } catch (e) { }
    try { if (count == null && content.ContentCount) count = content.ContentCount() } catch (e) { }
    type = Number(type)
    cid = Number(cid)
    count = Number(count)
    if (!isFinite(type) || !isFinite(cid) || !isFinite(count) || count <= 0) return null
    return { type: type, cid: cid, count: count }
}

SRMerge.GetResultConsumeStr = (result) => {
    if (!result || !result.resourceRequired) return null
    let consumeStr = result.resourceRequired.consumeStr
    if (consumeStr == null || String(consumeStr).trim() === "" || String(consumeStr).trim() === "0") return null
    return String(consumeStr)
}

SRMerge.pendingConsumeContents = []

SRMerge.NormalizeContentList = (content) => {
    if (!content) return []
    if (typeof content === "string") {
        let str = String(content).trim()
        if (!str || str === "0") return []
        let normalizedCost = MergeContentUtil.toContentString(str)
        if (normalizedCost && normalizedCost !== str) {
            str = normalizedCost
        }
        let parsed = []
        if (typeof Game !== "undefined" && Game.Content) {
            try {
                parsed = str.indexOf(";") >= 0 ? Game.Content.FromStrings(str) : [Game.Content.FromString(str)]
            } catch (e) {
                parsed = []
            }
        }
        if (parsed && parsed.length > 0) {
            let result = []
            for (let i = 0; i < parsed.length; i++) {
                let item = SRMerge.NormalizeContentPayload(parsed[i])
                if (item) result.push(item)
            }
            return result
        }
        let result = []
        let parts = str.split(";")
        for (let i = 0; i < parts.length; i++) {
            let item = SRMerge.NormalizeContentPayload(parts[i])
            if (item && typeof item !== "string") result.push(item)
        }
        return result
    }
    if (Array.isArray(content)) {
        let result = []
        for (let i = 0; i < content.length; i++) {
            result = result.concat(SRMerge.NormalizeContentList(content[i]))
        }
        return result
    }
    let payload = SRMerge.NormalizeContentPayload(content)
    if (!payload) return []
    if (typeof payload === "string") return SRMerge.NormalizeContentList(payload)
    return [payload]
}

SRMerge.MergeContentList = (contents) => {
    let merged = {}
    let list = SRMerge.NormalizeContentList(contents)
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let key = item.type + "_" + item.cid
        if (!merged[key]) merged[key] = { type: item.type, cid: item.cid, count: 0 }
        merged[key].count += item.count
    }
    let result = []
    for (let key in merged) {
        if (merged[key].count > 0) result.push(merged[key])
    }
    return result
}

SRMerge.NormalizeContentDeltaPayload = (content) => {
    if (!content) return null
    if (typeof content === "string") {
        let str = String(content).trim()
        if (!str || str === "0") return null
        if (str.indexOf(";") >= 0) return SRMerge.NormalizeContentDeltaList(str)
        let parts = str.split("=")
        if (parts.length !== 3) return null
        let item = {
            type: Number(parts[0]),
            cid: Number(parts[1]),
            count: Number(parts[2])
        }
        if (!isFinite(item.type) || !isFinite(item.cid) || !isFinite(item.count) || item.count === 0) return null
        return item
    }
    if (Array.isArray(content)) {
        let contents = []
        for (let i = 0; i < content.length; i++) {
            let item = SRMerge.NormalizeContentDeltaPayload(content[i])
            if (!item) continue
            if (Array.isArray(item)) contents = contents.concat(item)
            else contents.push(item)
        }
        return contents
    }
    let type = content.type
    let cid = content.cid
    let count = content.count
    try { if (type == null && content.Type) type = content.Type() } catch (e) { }
    try { if (cid == null && content.Id) cid = content.Id() } catch (e) { }
    try { if (cid == null && content.ContentId) cid = content.ContentId() } catch (e) { }
    try { if (count == null && content.Count) count = content.Count() } catch (e) { }
    try { if (count == null && content.ContentCount) count = content.ContentCount() } catch (e) { }
    type = Number(type)
    cid = Number(cid)
    count = Number(count)
    if (!isFinite(type) || !isFinite(cid) || !isFinite(count) || count === 0) return null
    return { type: type, cid: cid, count: count }
}

SRMerge.NormalizeContentDeltaList = (content) => {
    if (!content) return []
    if (typeof content === "string") {
        let result = []
        let parts = String(content).split(";")
        for (let i = 0; i < parts.length; i++) {
            let item = SRMerge.NormalizeContentDeltaPayload(parts[i])
            if (!item) continue
            if (Array.isArray(item)) result = result.concat(item)
            else result.push(item)
        }
        return result
    }
    if (Array.isArray(content)) {
        let result = []
        for (let i = 0; i < content.length; i++) {
            result = result.concat(SRMerge.NormalizeContentDeltaList(content[i]))
        }
        return result
    }
    let payload = SRMerge.NormalizeContentDeltaPayload(content)
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    return [payload]
}

SRMerge.MergeContentDeltaList = (contents) => {
    let merged = {}
    let list = SRMerge.NormalizeContentDeltaList(contents)
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let key = item.type + "_" + item.cid
        if (!merged[key]) merged[key] = { type: item.type, cid: item.cid, count: 0 }
        merged[key].count += item.count
    }
    let result = []
    for (let key in merged) {
        if (merged[key].count !== 0) result.push(merged[key])
    }
    return result
}

SRMerge.IsUserResourceContent = (content) => {
    if (!content) return false
    return content.type === 1 || content.type === 2 || content.type === 3 || content.type === 7 || content.type === 8
}

SRMerge.ShouldSyncContentDeltaToServer = (content, reason) => {
    if (!SRMerge.IsUserResourceContent(content)) return false
    // Board AP is local snapshot state; syncing it as server economy delta causes 1204.
    if (content.type === 2) return false
    return true
}

SRMerge.FilterServerContentDeltas = (content, reason) => {
    return SRMerge.MergeContentDeltaList(content).filter(item => SRMerge.ShouldSyncContentDeltaToServer(item, reason))
}

SRMerge.GetUserResourceValue = (content) => {
    if (typeof Game === "undefined" || !Game.SUser || !content) return null
    try {
        if (content.type === 1 && Game.SUser.Coin) return Game.SUser.Coin()
        if (content.type === 2 && Game.SUser.Ap) {
            if (Game.SUser.UpdateApTime) Game.SUser.UpdateApTime()
            return Game.SUser.Ap()
        }
        if (content.type === 7 && Game.SUser.Cash) return Game.SUser.Cash()
        if (content.type === 8 && Game.SUser.data) return Game.SUser.data.exp || 0
        if (content.type === 3 && Game.SUser.Shield) return Game.SUser.Shield()
    } catch (e) { }
    return null
}

SRMerge.SetUserResourceValue = (content, value) => {
    if (typeof Game === "undefined" || !Game.SUser || !Game.SUser.updateData || !content) return
    let data = null
    if (content.type === 1) data = { coin: value }
    else if (content.type === 2) {
        if (Game.ContentCheck && Game.ContentCheck.BuildApUpdateData) {
            data = Game.ContentCheck.BuildApUpdateData(value)
        } else {
            data = SRMerge.BuildApUpdateData(value)
        }
    }
    else if (content.type === 7) data = { cash: value }
    else if (content.type === 8) data = { exp: value }
    else if (content.type === 3) data = { shield: value }
    if (data) Game.SUser.updateData(data)
}

SRMerge.ApplyLocalConsume = (content) => {
    let contents = SRMerge.MergeContentList(content)
    for (let i = 0; i < contents.length; i++) {
        let item = contents[i]
        let before = SRMerge.GetUserResourceValue(item)
        if (typeof Game !== "undefined" && Game.ContentCheck && Game.ContentCheck.ClientUseConten) {
            Game.ContentCheck.ClientUseConten(item)
        }
        let after = SRMerge.GetUserResourceValue(item)
        if (before != null && after === before) {
            SRMerge.SetUserResourceValue(item, Math.max(0, before - item.count))
        }
    }
    SRMerge.SyncResourceShadow()
    return contents
}

SRMerge.ApplyLocalContentDelta = (content) => {
    let contents = SRMerge.MergeContentDeltaList(content)
    for (let i = 0; i < contents.length; i++) {
        let item = contents[i]
        if (!SRMerge.IsUserResourceContent(item)) continue
        let before = SRMerge.GetUserResourceValue(item)
        if (before == null) continue
        let next = before + item.count
        if (item.count < 0) next = Math.max(0, next)
        SRMerge.SetUserResourceValue(item, next)
        if (typeof GameKit !== "undefined" && GameKit.WebEvent && GameKit.WebEvent.EventName) {
            let eventName = null
            let data = null
            if (item.type === 1) {
                eventName = GameKit.WebEvent.EventName.CoinEvent
                data = { coin: next }
            } else if (item.type === 2) {
                eventName = GameKit.WebEvent.EventName.ApEvent
                data = { ap: next }
            } else if (item.type === 7) {
                eventName = GameKit.WebEvent.EventName.CashEvent
                data = { cash: next }
            } else if (item.type === 8) {
                eventName = GameKit.WebEvent.EventName.ExpEvent
                data = { exp: next }
            } else if (item.type === 3) {
                eventName = GameKit.WebEvent.EventName.ShieldEvent
                data = { shield: next }
            }
            if (eventName && data) {
                GameKit.WebEvent.DispatcherEvent(eventName, data)
            }
        }
    }
    SRMerge.SyncResourceShadow()
    return contents
}

SRMerge.BuildNegativeDelta = (content) => {
    let contents = SRMerge.MergeContentList(content)
    for (let i = 0; i < contents.length; i++) {
        contents[i] = { type: contents[i].type, cid: contents[i].cid, count: -Math.abs(contents[i].count) }
    }
    return SRMerge.MergeContentDeltaList(contents)
}

SRMerge.AddPendingConsume = (content, reason) => {
    return SRMerge.AddPendingSpendDelta(content, reason)
}

SRMerge.pendingContentDeltas = []

SRMerge.AddPendingContentDelta = (content, reason) => {
    let contents = SRMerge.FilterServerContentDeltas(content, reason)
    if (contents.length === 0) return []
    if (!SRMerge.pendingContentDeltas) SRMerge.pendingContentDeltas = []
    for (let i = 0; i < contents.length; i++) {
        SRMerge.pendingContentDeltas.push({ content: contents[i], reason: reason || "" })
    }
    return contents
}

SRMerge.AddPendingSpendDelta = (content, reason) => {
    return SRMerge.AddPendingContentDelta(SRMerge.BuildNegativeDelta(content), reason)
}

SRMerge.FlushPendingContentDeltas = (reason) => {
    if (SRMerge._pendingContentDeltaFlushPromise) return SRMerge._pendingContentDeltaFlushPromise

    let flushNext = () => {
        if (!SRMerge.pendingContentDeltas || SRMerge.pendingContentDeltas.length === 0) return Promise.resolve(null)
        let batch = SRMerge.pendingContentDeltas.slice()
        let contents = SRMerge.FilterServerContentDeltas(batch.map(item => item.content), reason)
        if (contents.length === 0) {
            SRMerge.pendingContentDeltas = []
            return Promise.resolve(null)
        }
        return SRMerge.applyContentDelta(contents, reason || "mergeContentDelta").then(res => {
            SRMerge.pendingContentDeltas.splice(0, batch.length)
            if (SRMerge.pendingContentDeltas.length > 0) return flushNext()
            return res
        })
    }

    SRMerge._pendingContentDeltaFlushPromise = flushNext().then(res => {
        SRMerge._pendingContentDeltaFlushPromise = null
        return res
    }, err => {
        SRMerge._pendingContentDeltaFlushPromise = null
        throw err
    })
    return SRMerge._pendingContentDeltaFlushPromise
}

SRMerge.FlushPendingConsumes = (reason) => {
    return SRMerge.FlushPendingContentDeltas(reason)
}

SRMerge.PersistMergeSnapshot = (reason) => {
    if (SRMerge.ShouldBlockMergeTutorialSave()) {
        SRMerge.ClearPendingOps()
        return null
    }
    return SRMerge.FlushPendingConsumes(reason || "saveMergeMap").then(() => {
        return SRMerge.saveMergeSnapshot(reason)
    })
}

SRMerge.consumeContent = (content, reason) => {
    let payload = SRMerge.NormalizeContentPayload(content)
    if (!payload || (Array.isArray(payload) && payload.length === 0)) return Promise.resolve(null)
    let req = new GameKit.ServerRequest("consumeContent")
    if (Array.isArray(payload)) {
        req.SetRequestBody("contents", payload)
    } else {
        req.SetRequestBody("content", payload)
    }
    req.SetRequestBody("reason", reason || "")
    req.SetSilence(true)
    return new Promise((resolve, reject) => {
        req.SetCallBack(res => {
            SRMerge.SyncResourceShadow()
            resolve(res)
        })
        req.SetErrorCallBack(error => {
            reject(error || new Error("consumeContent error"))
        })
        req.SetNetErrorCallBack(() => {
            reject(new Error("consumeContent net error"))
        })
        req.Send()
    })
}

SRMerge.applyContentDelta = (content, reason) => {
    let payload = SRMerge.FilterServerContentDeltas(content, reason)
    if (!payload || payload.length === 0) return Promise.resolve(null)
    let req = new GameKit.ServerRequest("applyContentDelta")
    req.SetRequestBody("contents", payload)
    req.SetRequestBody("reason", reason || "")
    req.SetSilence(true)
    return new Promise((resolve, reject) => {
        req.SetCallBack(res => {
            SRMerge.SyncResourceShadow()
            resolve(res)
        })
        req.SetErrorCallBack(error => {
            reject(error || new Error("applyContentDelta error"))
        })
        req.SetNetErrorCallBack(() => {
            reject(new Error("applyContentDelta net error"))
        })
        req.Send()
    })
}

SRMerge.applyContentReward = (content, reason) => {
    let payload = SRMerge.MergeContentList(content)
    if (!payload || payload.length === 0) return Promise.resolve(null)
    let req = new GameKit.ServerRequest("applyContentReward")
    req.SetRequestBody("contents", payload)
    req.SetRequestBody("reason", reason || "")
    req.SetSilence(true)
    return new Promise((resolve, reject) => {
        req.SetCallBack(res => {
            SRMerge.SyncResourceShadow()
            resolve(res)
        })
        req.SetErrorCallBack(error => {
            reject(error || new Error("applyContentReward error"))
        })
        req.SetNetErrorCallBack(() => {
            reject(new Error("applyContentReward net error"))
        })
        req.Send()
    })
}

SRMerge.WaitResultRequest = (localRes, promise) => {
    let cb = null
    let errCb = null
    let netErrCb = null
    let stub = {
        SetRequestBody: function () { return this },
        SetCallBack: function (fn) { cb = fn; return this },
        SetErrorCallBack: function (fn) { errCb = fn; return this },
        SetNetErrorCallBack: function (fn) { netErrCb = fn; return this },
        SetSilence: function () { return this },
        Send: function () {
            if (localRes && localRes.success === false) {
                if (typeof errCb === "function") errCb(localRes)
                return this
            }
            Promise.resolve(promise).then(() => {
                if (typeof cb === "function") cb(localRes || {})
            }).catch((error) => {
                if (typeof errCb === "function") errCb(error)
                if (typeof netErrCb === "function" && error && error.message && error.message.indexOf("net error") >= 0) {
                    netErrCb(error)
                }
            })
            return this
        }
    }
    return stub
}

SRMerge.ShouldCapturePaidRollback = (actionType, args) => {
    if (actionType === "generate" || actionType === "bubbleClaim") return true
    if (actionType === "func" && args) {
        return args.funcAction === "cookingQuickFinish" || args.funcAction === "cookingBackToLoaded"
    }
    return false
}

SRMerge.consumeResultResources = (result, actionType, beforeSnapshot) => {
    let consumeStr = SRMerge.GetResultConsumeStr(result)
    if (!consumeStr) return null
    SRMerge.ApplyLocalConsume(consumeStr)
    SRMerge.AddPendingSpendDelta(consumeStr, actionType || "merge")
    return null
}

SRMerge.GetSideEffectContentDeltas = (result) => {
    if (!result || !result.sideEffects || !Array.isArray(result.sideEffects)) return []
    let deltas = []
    for (let i = 0; i < result.sideEffects.length; i++) {
        let sideEffect = result.sideEffects[i]
        if (!sideEffect || !sideEffect.type) continue
        let params = sideEffect.params || {}
        if (sideEffect.type === "addReward" && params.sellPrice) {
            deltas = deltas.concat(SRMerge.NormalizeContentDeltaList(params.sellPrice))
        } else if (sideEffect.type === "deductReward" && params.sellPrice) {
            deltas = deltas.concat(SRMerge.BuildNegativeDelta(params.sellPrice))
        } else if ((sideEffect.type === "giveOrderBaseRewards" || sideEffect.type === "giveOrderActivityRewards") && params.rewards) {
            deltas = deltas.concat(SRMerge.NormalizeContentDeltaList(params.rewards))
        }
    }
    return SRMerge.MergeContentDeltaList(deltas).filter(item => SRMerge.IsUserResourceContent(item))
}

SRMerge.GetPendingRewardContents = (result) => {
    if (!result || !result.sideEffects || !Array.isArray(result.sideEffects)) return []
    let rewards = []
    for (let i = 0; i < result.sideEffects.length; i++) {
        let sideEffect = result.sideEffects[i]
        if (!sideEffect || !sideEffect.type) continue
        if (sideEffect.type !== "claimPendingContent" && sideEffect.type !== "claimPendingCardChest") continue
        let params = sideEffect.params || {}
        if (params.content) rewards = rewards.concat(SRMerge.NormalizeContentList(params.content))
    }
    return SRMerge.MergeContentList(rewards)
}

SRMerge.ApplyPendingRewardSideEffects = (result, actionType) => {
    if (!result || result.__pendingRewardSideEffectsApplied) return null
    let rewards = SRMerge.GetPendingRewardContents(result)
    Object.defineProperty(result, "__pendingRewardSideEffectsApplied", {
        value: true,
        configurable: true
    })
    if (rewards.length === 0) return null
    return SRMerge.applyContentReward(rewards, actionType || "mergePendingReward")
}

SRMerge.ApplyResultSideEffects = (result, actionType) => {
    if (!result || result.__resourceSideEffectsApplied) return []
    let deltas = SRMerge.GetSideEffectContentDeltas(result)
    if (deltas.length > 0) {
        SRMerge.ApplyLocalContentDelta(deltas)
        SRMerge.AddPendingContentDelta(deltas, actionType || "mergeSideEffect")
    }
    Object.defineProperty(result, "__resourceSideEffectsApplied", {
        value: true,
        configurable: true
    })
    return deltas
}

SRMerge.AttachServerPromise = (result, promise, label) => {
    if (!result || !promise || typeof promise.then !== "function") return
    Object.defineProperty(result, "__serverPromise", {
        value: promise.catch((err) => {
            console.error(err, label || "__serverPromise error")
            throw err
        }),
        configurable: true
    })
}

SRMerge.ShouldPersistAfterLocalAction = (actionType, args, result) => {
    if (!actionType) return false
    if (actionType === "generate") return false
    if (actionType === "claimOrder" || actionType === "claimReward") return true
    if (actionType === "sell" || actionType === "collect" || actionType === "delete" || actionType === "undo") return true
    if (actionType === "bubbleClaim" || actionType === "bubbleBreak") return true
    if (actionType === "func") {
        let funcAction = args && args.funcAction
        if (args && (args.forceSend || args.forceServer)) return true
        return funcAction === "pick" ||
            funcAction === "use" ||
            funcAction === "cookingStart" ||
            funcAction === "cookingQuickFinish" ||
            funcAction === "cookingBackToLoaded" ||
            funcAction === "cookingClaim"
    }
    return !!(args && (args.forceSend || args.forceServer))
}


SRMerge.getMergeMap = () => {
    let localSnapshot = SRMerge.LoadLocalMergeSnapshot()
    if (localSnapshot && SRMerge.ApplyLocalMergeSnapshot(localSnapshot, "getMergeMap")) {
        console.log('getMergeMap localSnapshot', localSnapshot)
        return SRMerge.LocalServerRequest("getMergeMap", { userTown: Game.SUserMerge.Data(), source: "local" })
    }

    let req = new GameKit.ServerRequest("getMergeMap")
    req.SetCallBack(res => {
        // GameKit.DataCache.SetData("signData", res.sign)
        // Game.SUserMerge.UpdateMergeMap(res.userTown.data)
        // Game.SUserMerge.UpdateMergePendingRewards(res.userTown.pendingRewards)
        // Game.SUserMerge.UpdateGeneratorStates(res.userTown.generatorStates)
        // Game.SUserMerge.UpdateOrders(res.userTown.orderData)
        // Game.SUserMerge.UpdateMergeWharehouse(res.userTown.warehouse,res.userTown.warehouseCapacity)
        Game.SUserMerge.updateData(res.userTown)
        SRMerge.SyncLocalOrders('getMergeMap')
        SRMerge.SaveLocalMergeSnapshot("getMergeMap", Game.SUserMerge.Data())
        console.log('getMergeMap', res);
    })
    return req
}

// // 保存地图
SRMerge.saveMap = (args) => {
    // let req = new GameKit.ServerRequest("saveMap")
    let { actionType, fromGid, slotIndex, orderId, cellKey, cellKey1, fromKey, toKey, cellKey2, instanceId, remainingCount, generatedCellKey, generatedPieceData, toolCellKey, ingredientCellKeys, ingredientIndex, targetCellKeys, recipeId, funcAction, pickPieceData, targetCellKey, forceServer, method, rewardIndex, opId, bubbleId } = args
    let result = null;
    let meta = null;
    var MergeOrderLogicConfigProvider = SRMerge.MergeOrderLogiConfigProvider();
    var MergeBoardLogicConfigProvider = SRMerge.MergeBoardLogicConfigProvider;
    let beforePaidSnapshot = null

    if (actionType) {
        if (!SRMerge.ops) {
            SRMerge.ops = []
        }
        SRMerge.SyncResourceShadow()
        if (SRMerge.ShouldCapturePaidRollback(actionType, args)) {
            beforePaidSnapshot = SRMerge.DebugClone(Game.SUserMerge.Data())
        }
        // console.log(actionType);
        if (actionType == "move") {
            result = Game.MergeBoardLogic.move(Game.SUserMerge.Data(), fromKey, toKey)
        } else if (actionType == "merge") {
            result = Game.MergeBoardLogic.merge(Game.SUserMerge.Data(), cellKey1, cellKey2, MergeBoardLogicConfigProvider)
        } else if (actionType == "generate") {
            result = Game.MergeBoardLogic.generate(Game.SUserMerge.Data(), args, MergeBoardLogicConfigProvider)
            if (result.success) {
                //在没有给服务器发送之前先同步�?
            }
            // console.log(result,"result++++++++++++++++++");
            // console.log(Game.SUser.Ap(), "aaa");
            // if (Game.SUser.Ap() <= 0) {
            //     forceServer = true
            // }

        } else if (actionType == "delete") {
            result = Game.MergeBoardLogic.removePiece(Game.SUserMerge.Data(), cellKey, "delete", MergeBoardLogicConfigProvider)
        } else if (actionType == "undo") {
            result = Game.MergeBoardLogic.undo(Game.SUserMerge.Data(), MergeBoardLogicConfigProvider)
        } else if (actionType == "sell") {
            result = Game.MergeBoardLogic.removePiece(Game.SUserMerge.Data(), cellKey, "sell", MergeBoardLogicConfigProvider)
        }
        else if (actionType == "collect") {
            result = Game.MergeBoardLogic.removePiece(Game.SUserMerge.Data(), cellKey, "collect", MergeBoardLogicConfigProvider)
        } else if (actionType == "func") {
            if (funcAction == "open") {
                result = Game.MergeBoardLogic.funcOpen(Game.SUserMerge.Data(), cellKey, MergeBoardLogicConfigProvider)
            } else if (funcAction == "pick") {
                result = Game.MergeBoardLogic.funcPick(Game.SUserMerge.Data(), cellKey, pickPieceData, targetCellKey, MergeBoardLogicConfigProvider)
            } else if (funcAction == "use") {
                result = Game.MergeBoardLogic.funcHourglass(Game.SUserMerge.Data(), cellKey, MergeBoardLogicConfigProvider)
            } else if (funcAction == "cookingPut") {
                result = Game.MergeBoardLogic.cookingPut(Game.SUserMerge.Data(), toolCellKey, ingredientCellKeys, MergeBoardLogicConfigProvider)
            } else if (funcAction == "cookingTakeBack") {
                result = Game.MergeBoardLogic.cookingTakeBack(Game.SUserMerge.Data(), toolCellKey, targetCellKeys, MergeBoardLogicConfigProvider, ingredientIndex)
            } else if (funcAction == "cookingStart") {
                result = Game.MergeBoardLogic.cookingStart(Game.SUserMerge.Data(), toolCellKey, recipeId, MergeBoardLogicConfigProvider)
            } else if (funcAction == "cookingClaim") {
                result = Game.MergeBoardLogic.cookingClaim(Game.SUserMerge.Data(), toolCellKey, targetCellKey, MergeBoardLogicConfigProvider)
            } else if (funcAction == "cookingQuickFinish") {
                //跳过烹饪
                result = Game.MergeBoardLogic.cookingQuickFinish(Game.SUserMerge.Data(), toolCellKey, MergeBoardLogicConfigProvider)
            } else if (funcAction == "cookingBackToLoaded") {
                result = Game.MergeBoardLogic.cookingBackToLoaded(Game.SUserMerge.Data(), toolCellKey, MergeBoardLogicConfigProvider)
            }
        } else if (actionType == "claimOrder") {
            SRMerge.SyncLocalOrders('claimOrder')
            let orderState = Game.SUserMerge.GetOrderData()
            let boardData = Game.SUserMerge.GetMergeMapData()
            let warehouseData = Game.SUserMerge.GetStoreData()
            let orderBefore = orderState && orderState.orders
                ? orderState.orders.find(item => orderId != null ? String(item.orderId) === String(orderId) : item.slotIndex == slotIndex)
                : null
            // SRMerge.DebugLogClaimOrder("claimOrder.before", {
            //     slotIndex: slotIndex,
            //     slotIndexType: typeof slotIndex,
            //     orderBefore: SRMerge.DebugClone(orderBefore),
            //     pieceCounts: SRMerge.DebugCountPieces(boardData, warehouseData),
            //     boardData: SRMerge.DebugClone(boardData),
            //     warehouseData: SRMerge.DebugClone(warehouseData),
            //     playerLevel: Game.SUser.Level()          //增加人物等级
            // })
            result = Game.MergeOrderLogic.claimOrder(orderState, { slotIndex: slotIndex, orderId: orderId }, boardData, warehouseData, MergeOrderLogicConfigProvider, Game.SUser.Level())
            // let orderAfter = orderState && orderState.orders ? orderState.orders.find(item => item.slotIndex == slotIndex) : null
            // SRMerge.DebugLogClaimOrder("claimOrder.after", {
            //     slotIndex: slotIndex,
            //     result: SRMerge.DebugClone(result),
            //     orderAfter: SRMerge.DebugClone(orderAfter),
            //     pieceCounts: SRMerge.DebugCountPieces(boardData, warehouseData),
            // })

            // console.log('[client claim input]', {
            //     slotIndex: slotIndex,
            //     playerLevel: Game.SUser && Game.SUser.Level ? Game.SUser.Level() : null,

            //     mode: orderState && orderState.mode,
            //     orderStateLevel: orderState && orderState.playerLevel,
            //     completedOrderIds: orderState && orderState.completedOrderIds,

            //     beforeOrders: orderState && orderState.orders && orderState.orders.map(function (o) {
            //         return {
            //             id: o.orderId,
            //             slot: o.slotIndex,
            //             completed: o.completed,
            //             claimed: o.claimed,
            //             mapId: o.mapId,
            //             mode: o.mode,
            //             requiredPieces: o.requiredPieces,
            //             matchedCells: o.matchedCells
            //         };
            //     }),

            //     allStoryMetas: MergeOrderLogicConfigProvider &&
            //         MergeOrderLogicConfigProvider.getAllOrderMetas
            //         ? MergeOrderLogicConfigProvider.getAllOrderMetas()
            //             .filter(function (m) { return m && m.mapId >= 1 && m.mapId <= 5; })
            //             .map(function (m) {
            //                 return {
            //                     id: m.id,
            //                     mapId: m.mapId,
            //                     content: m.content,
            //                     reward: m.reward,
            //                     additionReward: m.additionReward
            //                 };
            //             })
            //         : null,

            //     order1006: MergeOrderLogicConfigProvider &&
            //         MergeOrderLogicConfigProvider.getOrderMeta
            //         ? MergeOrderLogicConfigProvider.getOrderMeta(1006)
            //         : null,

            //     order1007: MergeOrderLogicConfigProvider &&
            //         MergeOrderLogicConfigProvider.getOrderMeta
            //         ? MergeOrderLogicConfigProvider.getOrderMeta(1007)
            //         : null
            // });

            // result = Game.MergeOrderLogic.claimOrder(
            //     orderState,
            //     slotIndex,
            //     boardData,
            //     warehouseData,
            //     MergeOrderLogicConfigProvider,
            //     Game.SUser.Level()
            // );

            // console.log('[client claim result]', {
            //     success: result && result.success,
            //     errorCode: result && result.errorCode,
            //     errorMsg: result && result.errorMsg,
            //     newOrder: result && result.newOrder
            //         ? {
            //             id: result.newOrder.orderId,
            //             slot: result.newOrder.slotIndex,
            //             completed: result.newOrder.completed,
            //             claimed: result.newOrder.claimed,
            //             mapId: result.newOrder.mapId,
            //             mode: result.newOrder.mode,
            //             requiredPieces: result.newOrder.requiredPieces
            //         }
            //         : null,
            //     removedPieces: result && result.removedPieces,

            //     afterOrders: orderState && orderState.orders && orderState.orders.map(function (o) {
            //         return {
            //             id: o.orderId,
            //             slot: o.slotIndex,
            //             completed: o.completed,
            //             claimed: o.claimed,
            //             mapId: o.mapId,
            //             mode: o.mode,
            //             requiredPieces: o.requiredPieces,
            //             matchedCells: o.matchedCells
            //         };
            //     }),
            //     completedOrderIds: orderState && orderState.completedOrderIds
            // });

            // console.log(result, "order");


        } else if (actionType == "claimReward") {
            result = Game.MergeBoardLogic.claimPendingReward(Game.SUserMerge.Data(), rewardIndex, cellKey || targetCellKey, MergeBoardLogicConfigProvider)
            if (result.success) {
                result.opId = opId
                if (typeof GameKit !== 'undefined' && GameKit.GameEvent && GameKit.GameEvent.EventName) {
                    GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.PendingRewardsUpdated, {
                        pendingRewards: Game.SUserMerge.GetPendingRewards()
                    })
                }
            }
        } else if (actionType == "bubbleClaim") {
            // 领取
            result = Game.MergeBoardLogic.bubbleClaim(Game.SUserMerge.Data(), bubbleId || cellKey, method, MergeBoardLogicConfigProvider)
        } else if (actionType == "bubbleBreak") {
            // 打破
            result = Game.MergeBoardLogic.bubbleBreak(Game.SUserMerge.Data(), bubbleId || cellKey, MergeBoardLogicConfigProvider)
        }
        // console.log(actionType, result, "args", args);

        // console.log(args);


        // console.log(args,"result", result);
        if (result.success) {
            if (SRMerge.ShouldBlockMergeTutorialSave()) {
                SRMerge.ClearPendingOps()
                return result
            }
            SRMerge.ApplyResultSideEffects(result, actionType)
            let consumePromise = SRMerge.consumeResultResources(result, actionType, beforePaidSnapshot)
            let rewardPromise = SRMerge.ApplyPendingRewardSideEffects(result, actionType)
            SRMerge.SaveLocalMergeSnapshot(actionType || "localAction")
            let savePromise = null
            let beforeSavePromise = consumePromise || rewardPromise
            if (consumePromise && rewardPromise) {
                beforeSavePromise = consumePromise.then(() => rewardPromise)
            }
            if (beforeSavePromise) {
                savePromise = beforeSavePromise.then(() => {
                    let promise = SRMerge.sendSaveMapLite(actionType, args)
                    if (!promise || typeof promise.then !== "function") return promise
                    return promise.catch((err) => {
                        console.error(err, "sendSaveMapLite after consume error")
                        return err
                    })
                })
            } else {
                savePromise = SRMerge.sendSaveMapLite(actionType, args)
            }
            SRMerge.AttachServerPromise(result, savePromise || beforeSavePromise, "saveMap server promise error")
            return result

        } else {

            console.error(result, "args", args);
        }

    }

    return null
}
//最大操作次数（保留字段，单机不再批量上报）
SRMerge.MaxOpsCount = 5
// 关键操作类型：完成订�?/ 领取奖励 等节点立即上报快�?
SRMerge.KeyActionTypes = {
    claimOrder: 1,
    claimReward: 1,
    sell: 1,
    collect: 1,
    delete: 1,
    undo: 1,
    bubbleClaim: 1,
    bubbleBreak: 1
}
/**
 * 单机架构下的保存：公共代码已把操作写入本�?Game.SUserMerge�?
 * 仅在关键节点（强制保�?forceSend/forceServer，或完成订单/领取奖励）直接上报整盘快照；
 * 普通操作（拖动/合成等）只留在本地，由切场景 / 退后台 / 关键节点统一落盘�?
 * @param {*} actionType
 * @param {*} args
 * @returns {Promise|null}
 */
SRMerge.sendSaveMapLite = (actionType, args) => {
    if (SRMerge.ShouldBlockMergeTutorialSave()) {
        SRMerge.ClearPendingOps()
        return null
    }
    if (!SRMerge.ShouldPersistAfterLocalAction(actionType, args)) return null

    let promise = SRMerge.PersistMergeSnapshot(actionType)
    if (args && typeof args.serverCallback === "function" && promise) {
        promise.then(res => { args.serverCallback(res) }).catch(() => { })
    }
    return promise
}
SRMerge.AutoSendSaveMapLite = () => {
    if (SRMerge.ShouldBlockMergeTutorialSave()) {
        SRMerge.ClearPendingOps()
        return null
    }
    // 单机：场景切�?/ 退后台等节点上报整盘快�?
    return SRMerge.PersistMergeSnapshot("auto")
}
/**
 * 保存地图lite请求（单机：改为上报整盘快照；保留链式接口兼容旧调用�?
 * @param {*} actionType
 * @param {*} args
 * @returns {Object} 链式请求 stub
 */
SRMerge.saveMapLite = (actionType, args) => {
    if (SRMerge.ShouldBlockMergeTutorialSave()) {
        SRMerge.ClearPendingOps()
    }
    // 公共代码已在本地处理，直接上报整盘快�?
    if (actionType === "init" && args && args.mapData) {
        SRMerge.InitLocalMergeMap(args.mapData)
    }
    return SRMerge.LocalResultRequest({ success: true }, actionType || "saveMapLite")
}

// // 增加金币
SRMerge.addCoin = (coin) => {
    let req = new GameKit.ServerRequest("addCoin")
    req.SetRequestBody("coin", coin)
    req.SetCallBack(res => {
        // GameKit.DataCache.SetData("signData", res.sign)
        console.log('coin', res);
    })
    return req
}

// id:-1 为添加格�?-2为空�?-3为锁定格�?>0为合并格�?
// 获取仓库数据（单机：直接读取本地，不再请求服务器�?
SRMerge.GetStoreData = () => {
    return SRMerge.LocalResultRequest({
        success: true,
        warehouse: Game.SUserMerge.GetStoreData ? Game.SUserMerge.GetStoreData() : null
    }, "getWarehouse", { persist: false })
}
//解锁仓库数据（单机：本地扩容 + 快照；钻石消耗由调用方在调用前校�?扣除�?
SRMerge.UpgradeWarehouse = (priceContent) => {
    let beforeSnapshot = SRMerge.DebugClone(Game.SUserMerge.Data())
    let res = Game.MergeBoardLogic.upgradeWarehouseCapacity(Game.SUserMerge.Data())
    if (Game.SUserMerge.UpdateWarehouseCapacity) {
        Game.SUserMerge.UpdateWarehouseCapacity(res.warehouseCapacity)
    }
    if (!res || res.success === false) {
        return SRMerge.LocalResultRequest(res, "upgradeWarehouse")
    }
    SRMerge.ApplyLocalConsume(priceContent)
    SRMerge.AddPendingSpendDelta(priceContent, "upgradeWarehouse")
    let promise = Promise.resolve()
        .then(() => {
            return SRMerge.PersistMergeSnapshot("upgradeWarehouse")
        })
        .catch((err) => {
            if (beforeSnapshot && typeof Game !== "undefined" && Game.SUserMerge && Game.SUserMerge.updateData) {
                Game.SUserMerge.updateData(beforeSnapshot)
            }
            SRMerge.SyncResourceShadow()
            throw err
        })
    return SRMerge.WaitResultRequest(res, promise)
}
/**
 * 棋盘格子移动到仓库（单机：本地公共代�?+ 快照�?
 * @param {*} pieceData 是tile坐标 "1_0"
 */
SRMerge.MovePieceFromGridToWarehouse = (pieceData) => {
    let res = Game.MergeBoardLogic.movePieceFromGridToWarehouse(Game.SUserMerge.Data(), pieceData)
    if (res && res.success) res.mergeMapData = Game.SUserMerge.Data()
    return SRMerge.LocalResultRequest(res, "movePieceFromGridToWarehouse")
}
SRMerge.MovePieceToWarehouse = (pieceData) => {
    let res = Game.MergeBoardLogic.movePieceDataToWarehouse(Game.SUserMerge.Data(), pieceData)
    if (res && res.success) res.mergeMapData = Game.SUserMerge.Data()
    return SRMerge.LocalResultRequest(res, "movePieceToWarehouse")
}
SRMerge.movePieceToWarehouse = SRMerge.MovePieceToWarehouse
/**
 * 仓库数据移动到格子（单机：本地公共代�?+ 快照�?
 * @param {*} warehouseIndex
 */
SRMerge.MovePieceFromWarehouseToGrid = (warehouseIndex) => {
    let res = Game.MergeBoardLogic.movePieceFromWarehouseToGrid(Game.SUserMerge.Data(), warehouseIndex, SRMerge.MergeBoardLogicConfigProvider)
    if (res && res.success) res.mergeMapData = Game.SUserMerge.Data()
    return SRMerge.LocalResultRequest(res, "movePieceFromWarehouseToGrid")
}
SRMerge.BatchMoveFromWarehouse = (pieceDatas) => {
    let res = Game.MergeBoardLogic.batchMoveFromWarehouseByData(Game.SUserMerge.Data(), pieceDatas, SRMerge.MergeBoardLogicConfigProvider)
    if (res && res.success) res.mergeMapData = Game.SUserMerge.Data()
    return SRMerge.LocalResultRequest(res, "batchMoveFromWarehouse")
}
SRMerge.batchMoveFromWarehouse = SRMerge.BatchMoveFromWarehouse
SRMerge.GetPendingRewards = () => {
    let pendingRewards = Game.SUserMerge.GetPendingRewards ? Game.SUserMerge.GetPendingRewards() : {}
    return SRMerge.LocalResultRequest({
        success: true,
        pendingRewards: pendingRewards,
        rewardCount: pendingRewards ? Object.keys(pendingRewards).length : 0
    }, "getPendingRewards", { persist: false })
}
SRMerge.getPendingRewards = SRMerge.GetPendingRewards
SRMerge.AddToPendingRewards = (entries) => {
    let res = Game.MergeBoardLogic.addPendingRewards(Game.SUserMerge.Data(), entries)
    if (res && res.success) res.mergeMapData = Game.SUserMerge.Data()
    return SRMerge.LocalResultRequest(res, "addToPendingRewards")
}
SRMerge.addToPendingRewards = SRMerge.AddToPendingRewards
/**
 * 领取临时奖励
 * index:奖励索引
 */
// SRMerge.ExtractMergeClaimReward = (rewardIndex, cellKey) => {
//     let req = new GameKit.ServerRequest("claimReward")
//     req.SetRequestBody("rewardIndex", rewardIndex)
//     req.SetRequestBody("cellKey", cellKey)
//     req.SetCallBack(res => {
//         console.log('领取临时奖励', res);
//         Game.SUserMerge.updateData(res.mergeMapData)
//         // Game.SUserMerge.UpdateMergeMap(res.mergeMapData.data)
//         // Game.SUserMerge.UpdateMergePendingRewards(res.mergeMapData.pendingRewards)
//         // Game.SUserMerge.UpdateOrders(res.mergeMapData.orderData)
//         // Game.SUserMerge.UpdateMergeWharehouse(res.mergeMapData.warehouse,res.mergeMapData.warehouseCapacity)
//         // Game.SUserMerge.UpdateGeneratorStates(res.mergeMapData.generatorStates)
//     })
//     // console.log('ExtractMergeClaimReward',req);

//     return req
// }
/**
 * 获取任务列表
 * [deprecated]这个接口已经废弃了，前端不再调用，后端保留一段时间后也会删除
 * @returns 
 */
// SRMerge.getOrders = () => {
//     let req = new GameKit.ServerRequest("getOrders")
//     req.SetCallBack(res => {
//         console.log('getOrders', res);
//     })
//     return req;
// }
/**
 * 领取任务奖励
 * [deprecated]这个接口已经废弃了，前端不再调用，后端保留一段时间后也会删除
 * @param {*} taskId 
 * @returns 
 */
/**
 * 领取任务奖励
 * [deprecated]前端�?saveMap(actionType:"claimOrder") 本地公共代码处理；此处保留兼容，改为本地快照
 * @param {*} slotIndex
 * @returns
 */
SRMerge.GetClaimOrderReward = (slotIndex) => {
    SRMerge.SyncLocalOrders('GetClaimOrderReward')
    let claimTarget = slotIndex
    if (slotIndex && typeof slotIndex === "object") {
        claimTarget = { slotIndex: slotIndex.slotIndex, orderId: slotIndex.orderId }
    }
    let res = Game.MergeOrderLogic.claimOrder(
        Game.SUserMerge.GetOrderData(),
        claimTarget,
        Game.SUserMerge.GetMergeMapData(),
        Game.SUserMerge.GetStoreData(),
        SRMerge.MergeOrderLogiConfigProvider(),
        Game.SUser.Level()
    )
    return SRMerge.LocalResultRequest(res, "claimOrder")
}

SRMerge._getConstValue = (key, def) => {
    let keys = Array.isArray(key) ? key : [key]
    let v
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i]
        if (G.GameConstance && G.GameConstance[k] !== undefined && G.GameConstance[k] !== null) {
            v = G.GameConstance[k]
            break
        }
    }
    if (v === undefined || v === null) return def
    if (typeof v === 'object') {
        if (v.value !== undefined) v = v.value
        else if (v.v !== undefined) v = v.v
        else if (v.num !== undefined) v = v.num
        else if (v.default !== undefined) v = v.default
    }
    return (v === undefined || v === null || v === '') ? def : v
}

/**公共面板 */
SRMerge.MergeBoardLogicConfigProvider = {
    getBubbleConfig() {
        return {
            lifeTime: SRMerge._getConstValue(['bubbleLifetime', 'bubbleLifeTime'], 0),
            freeCount: SRMerge._getConstValue('bubbleFreeCount', 0),
            adCount: SRMerge._getConstValue('bubbleADCount', 3),
            adMaxLevel: SRMerge._getConstValue('bubbleAdMaxLevel', 'N'),
            openLevel: SRMerge._getConstValue('bubbleOpenLevel', 0),
            expireCoinPieceId: SRMerge._getConstValue('bubbleExpireCoinPieceId', 51),
            expireGraceSeconds: SRMerge._getConstValue('bubbleExpireGraceSeconds', 3)
        }
    },
    getPlayerLevel() {
        return SRMerge.GetLocalPlayerLevel()
    },
    getPieceLevel(pieceId) {
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, pieceId)
        return SRMerge._getPieceLevel(meta)
    },
    getElementMeta: function (pieceId) {
        var cfg = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, pieceId);
        if (!cfg) return null;
        return {
            id: cfg.Id(),
            nextId: cfg.NextId(),
            preId: cfg.PrevId(),
            ifCanSell: cfg.IfCanSell(),
            ifCanCut: cfg.IfCanCut ? cfg.IfCanCut() : false,
            sellPrice: cfg.SellPrice(),
            sellType: cfg.SellType(),
            funcType: cfg.FunctionType(),
            funcParam: cfg.FunctionParams(),
            type: cfg.Type(),
            bubbleRate: cfg.BubbleRate(),
            bubbleParam: cfg.BubbleParam(),
            bubbleCost: cfg.BubbleCost(),
        };
    },
    getCookingRecipe(recipeId) {
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeCookingRecipe, recipeId)
        if (!meta) return null
        try {
            return {
                id: meta.Id(),
                name: meta.Name(),
                toolId: meta.ToolId(),
                toolName: meta.ToolName(),
                ingredientIds: meta.IngredientIds(),
                ingredientNames: meta.IngredientNames(),
                resultId: meta.ResultId(),
                resultName: meta.ResultName(),
                resultCount: meta.ResultCount(),
                makeTime: meta.MakeTime(),
                energyCost: meta.EnergyCost(),
                cancelCost: meta.CancelCost(),
                quickCost: meta.QuickCost(),
                unlockLevel: meta.UnlockLevel(),
                recipeKey: meta.RecipeKey(),
                priority: meta.Priority(),
                desc: meta.Des()
            }
        } catch (e) { return null }
    },
    getGeneratorByMergeId: function (mergeId) {
        var g = Meta.MergeGeneraterMeta.GetGenerateByMergeId(mergeId);
        if (!g) return null;
        return {
            maxOutputCount: g.MaxOutputCount(),
            needCharge: g.NeedCharge(),
            chargeTime: g.ChargeTime(),
            delayTime: g.DelayTime(),
            onetimeDestroy: g.OnetimeDestroy(),
            output: g.Output(),
            consumeCount: g.ConsumeCount(),
            spawnType: g.SpawnType(),
            prdId: g.PrdId(),
            prdChangeRate: g.PrdChangeRate(),
            initialSequence: g.InitialSequence(),
            interval: g.Interval ? g.Interval() : '',
            bubbleRate: g.BubbleRate ? g.BubbleRate() : null,
            bubbleParam: g.BubbleParam ? g.BubbleParam() : null,
            bubbleCost: g.BubbleCost ? g.BubbleCost() : null
        };
    },
    getCandidatePieceIds(typeId, level) {
        let allMetas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeElements)
        if (!allMetas) return []
        let candidates = []
        for (let id in allMetas) {
            let m = allMetas[id]
            let mTypeId = 0
            try { mTypeId = m.Type ? m.Type() : 0 } catch (e) { continue }
            if (mTypeId != typeId) continue
            if (SRMerge._getPieceLevel(m) !== level) continue
            candidates.push(m.Id ? m.Id() : parseInt(id))
        }
        return candidates
    },
    getCurrentTime: function () {
        return GameKit.TimeUtil.getCurrentTime()
    }
}
SRMerge._getPieceLevel = (meta) => {

    if (!meta) return 0
    let level = 1
    let preId = meta.PrevId()
    let allMetas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeElements)
    if (!allMetas) return level
    let visited = new Set()
    let pid = meta.Id()
    while (preId != null && preId !== -1 && preId !== '-1' && !visited.has(pid)) {
        visited.add(pid)
        level++
        let prev = allMetas[String(preId)]
        if (!prev) break
        pid = preId
        preId = prev.PreId ? prev.PreId : prev.PrevId()
    }
    return level
}



/**公共訂單 */
SRMerge.MergeOrderLogiConfigProvider = () => {
    let userId = Game.SUser.Id()
    let activeGameActivities = Game.ActivityManager.GetActiveGameActivities(userId)

    let collectMeta = null
    try {
        collectMeta = Game.ActivityManager.GetActiveOtherActivityByType(userId, Meta.ActivityMeta.SubTypes.CollectFlag)
    } catch (e) { }
    let collectFlagScore = 0
    if (collectMeta) {
        try {
            let params = collectMeta.Param()
            collectFlagScore = (params && params.orderTaskScore != null) ? params.orderTaskScore : 0
        } catch (e) { }
    }

    let newCollectActivities = []
    try {
        let ncList = Game.ActivityManager.GetActiveNewCollectActivities()
        for (let i = 0; i < ncList.length; i++) {
            newCollectActivities.push({ activityId: ncList[i].Id() })
        }
    } catch (e) {
        Logs.Error("_createOrderConfigProvider GetActiveNewCollectActivities", userId, e)
    }
    let collectCoefficient = G.GameConstance.collectCoefficient || 0

    let getPieceIdFromData = (dataStr) => {
        if (!dataStr || typeof dataStr !== "string") return null
        let base = dataStr.split("=")[0]
        let parts = base.split("_")
        let pieceId = parseInt(parts[0])
        return isNaN(pieceId) ? null : pieceId
    }

    return {
        getAllNewbieOrderMetas() {
            return this.getAllOrderMetas()
        },

        getOrderLevelConfig(playerLevel) {
            let level = parseInt(playerLevel) || 1
            let metas = Meta.MetaManager.GetMetas(Meta.MetaType.Order)
            if (!metas) return null
            let exact = Meta.MetaManager.GetMeta(Meta.MetaType.Order, level)
            if (exact) {
                return {
                    lv: exact.Lv(),
                    orderMax: exact.OrderMax(),
                    hardSequence: exact.HardSequence(),
                    itemNumRate: exact.ItemNumRate(),
                    hard4ChestLv: exact.Hard4ChestLv(),
                    hard4Plan: exact.Hard4Plan(),
                    hard3Plan: exact.Hard3Plan(),
                    hard2Plan: exact.Hard2Plan(),
                    hard1Plan: exact.Hard1Plan()
                }
            }
            let best = null
            for (let id in metas) {
                let meta = metas[id]
                let lv = meta && meta.Lv ? parseInt(meta.Lv()) : parseInt(id)
                if (isNaN(lv) || lv > level) continue
                if (!best || lv > best.lv) best = { lv: lv, meta: meta }
            }
            if (!best) return null
            let meta = best.meta
            return {
                lv: meta.Lv(),
                orderMax: meta.OrderMax(),
                hardSequence: meta.HardSequence(),
                itemNumRate: meta.ItemNumRate(),
                hard4ChestLv: meta.Hard4ChestLv(),
                hard4Plan: meta.Hard4Plan(),
                hard3Plan: meta.Hard3Plan(),
                hard2Plan: meta.Hard2Plan(),
                hard1Plan: meta.Hard1Plan()
            }
        },

        getOrderSlots(playerLevel) {
            let level = parseInt(playerLevel) || 1
            let metas = Meta.MetaManager.GetMetas(Meta.MetaType.OrderSlot)
            if (!metas) return []
            let result = []
            for (let id in metas) {
                let meta = metas[id]
                try {
                    let lv = parseInt(meta.Lv())
                    if (!isNaN(lv) && lv <= level) {
                        result.push({
                            id: meta.Id(),
                            lv: lv,
                            slotType: meta.SlotType(),
                            cdTime: meta.CdTime()
                        })
                    }
                } catch (e) { }
            }
            result.sort((a, b) => a.id - b.id)
            return result
        },

        getElementMeta(pieceId) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, pieceId)
            if (!meta) return null
            try {
                return {
                    id: meta.Id(),
                    type: meta.Type ? meta.Type() : null,
                    series: meta.Series ? meta.Series() : null,
                    goldPrice: meta.GoldPrice ? meta.GoldPrice() : 0,
                    orderScore: meta.OrderScore ? meta.OrderScore() : 0,
                    orderLv: meta.OrderLv ? meta.OrderLv() : 0,
                    preId: meta.PrevId ? meta.PrevId() : null,
                    prevId: meta.PrevId ? meta.PrevId() : null,
                    nextId: meta.NextId ? meta.NextId() : null
                }
            } catch (e) { return null }
        },

        getAllElementMetas() {
            let metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeElements)
            if (!metas) return []
            let result = []
            for (let id in metas) {
                let item = this.getElementMeta(id)
                if (item) result.push(item)
            }
            result.sort((a, b) => a.id - b.id)
            return result
        },

        isGeneratorPiece(pieceId) {
            return !!(Meta.MergeGeneraterMeta && Meta.MergeGeneraterMeta.GetGenerateByMergeId &&
                Meta.MergeGeneraterMeta.GetGenerateByMergeId(pieceId))
        },

        getUnlockedSeries(playerLevel) {
            let seen = {}
            let addByPieceId = (pieceId) => {
                if (pieceId == null) return
                let element = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, pieceId)
                if (element && element.Series && element.Series() != null && element.Series() !== "") {
                    seen[String(element.Series())] = element.Series()
                }
                if (Meta.MergeGeneraterMeta && Meta.MergeGeneraterMeta.GetGenerateByMergeId) {
                    let generator = Meta.MergeGeneraterMeta.GetGenerateByMergeId(pieceId)
                    if (generator && generator.Series && generator.Series() != null && generator.Series() !== "") {
                        seen[String(generator.Series())] = generator.Series()
                    }
                }
            }
            try {
                let snapshot = Game.SUserMerge.Data()
                let board = snapshot.data || {}
                let warehouse = snapshot.warehouse || {}
                for (let key in board) addByPieceId(getPieceIdFromData(board[key]))
                for (let key in warehouse) addByPieceId(getPieceIdFromData(warehouse[key]))
                let obtained = snapshot.obtainedPieces || []
                for (let i = 0; i < obtained.length; i++) addByPieceId(obtained[i])
            } catch (e) { }
            let result = []
            for (let key in seen) result.push(seen[key])
            result.sort((a, b) => Number(a) - Number(b))
            return result
        },

        getRandomOrderRoleName(rng) {
            let metas = this.getAllOrderMetas()
            let roles = []
            let seen = {}
            for (let i = 0; i < metas.length; i++) {
                let roleName = metas[i].roleName
                if (!roleName || seen[roleName]) continue
                seen[roleName] = true
                roles.push(roleName)
            }
            if (roles.length <= 0) return "Ava"
            let index = Math.floor((rng ? rng() : Math.random()) * roles.length)
            if (index < 0) index = 0
            if (index >= roles.length) index = roles.length - 1
            return roles[index]
        },

        getCurrentTime() {
            return GameKit.TimeUtil.getCurrentTime()
        },

        getAllOrderMetas() {
            let allMetas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeOrders)
            if (!allMetas) return []
            let result = []
            for (let id in allMetas) {
                let meta = allMetas[id]
                try {
                    result.push({
                        id: meta.Id(),
                        mapId: meta.MapId(),
                        content: meta.Content(),
                        reward: meta.Reward(),
                        additionReward: meta.AdditionReward(),
                        difficulty: meta.Difficulty() || 1,
                        maxItemReward: meta.MaxItemReward() || 1,
                        roleName: meta.RoleName()
                    })
                } catch (e) { }
            }
            result.sort((a, b) => a.id - b.id)
            return result
        },

        getOrderMeta(orderId) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeOrders, orderId)
            if (!meta) return null
            try {
                return {
                    id: meta.Id(),
                    content: meta.Content(),
                    reward: meta.Reward(),
                    additionReward: meta.AdditionReward(),
                    difficulty: meta.Difficulty() || 1,
                    maxItemReward: meta.MaxItemReward() || 1,
                    roleName: meta.RoleName()
                }
            } catch (e) { return null }
        },

        getActiveOrderBonusActivities() {
            let result = []
            for (let i = 0; i < activeGameActivities.length; i++) {
                let meta = activeGameActivities[i]
                try {
                    let params = meta.Param()
                    if (!params || !params.orderTaskBonus) continue
                    let bonusStr = (params.orderTaskBonus || '').trim()
                    if (!bonusStr) continue
                    let bonusList = MergeOrderLogic.parseRewardString(bonusStr)
                    if (bonusList.length === 0) continue
                    result.push({ id: meta.Id(), bonusList: bonusList })
                } catch (e) { continue }
            }
            result.sort((a, b) => a.id - b.id)
            return result
        },

        getCollectFlagOrderScore() {
            return collectFlagScore
        },
        getCollectRewardsData() {
            if (newCollectActivities.length === 0 || !collectCoefficient) return null
            return { activities: newCollectActivities, collectCoefficient: collectCoefficient }
        }
    }
}
SR.SRMerge = SRMerge

export default SRMerge
