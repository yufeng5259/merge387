// 自动弹窗队列
//
// 使用范围：
// 1. 服务器推送、奖励结算、活动结算这类“系统自动弹出”的窗口。
// 2. 不用于玩家主动点击打开的窗口，例如商店、建造、卡牌详情等。
//
// 调用示例：
// GameKit.AutoWindowQueue.enqueue("SimpleRewardWindow", {contents: rewards}, {
//     stage: "runtime_reward",
//     source: "get_reward",
// })
//
// 执行规则：
// - enqueue 只负责入队，不保证立即弹出。
// - 当前有子窗口打开时会等待，避免自动奖励弹窗打断玩家正在操作的窗口。
// - 队列会根据 windowOrder 表里的 priority 排序，数字越小越先弹。
// - UIWindow.close() 后会调用 drainLater()，继续尝试弹出下一个自动窗口。
let AutoWindowQueue = {
    // 待弹出的自动窗口列表
    pending: [],
    // 当前是否正在展示由本队列打开的窗口
    showing: false,
}

// 添加一个自动弹窗请求。
// windowName: 窗口脚本名，例如 "GetRewardWindow"
// params: 传给 UIRoot.openChildWindow 的参数
// options.stage: 弹窗场景，用于匹配 windowOrder.stage，例如 "runtime_reward"
// options.source: 来源标记，只用于排查日志和后续扩展
AutoWindowQueue.enqueue = function(windowName, params, options) {
    if (!windowName) return
    options = options || {}
    this.pending.push({
        windowName: windowName,
        params: params || {},
        stage: options.stage || "",
        source: options.source || "",
        preshowCallback: options.preshowCallback || null,
    })
    this.sortPending()
    this.drain()
}

// 尝试从队列中弹出下一个窗口。
// 如果当前已经有队列窗口在展示，或者玩家还有其他子窗口打开，则暂不弹出。
AutoWindowQueue.drain = function() {
    if (this.showing) return
    if (this.isBlocked()) return
    if (this.pending.length <= 0) return

    let item = this.pending.shift()
    let params = item.params || {}
    if (item.preshowCallback) {
        let preshowParams = item.preshowCallback(item)
        if (preshowParams === false) {
            this.drainLater()
            return
        }
        if (preshowParams) params = preshowParams
    }

    let showCallback = params.showCallback
    this.showing = true

    params.showCallback = function(wnd) {
        wnd.addOnCloseFunc(function() {
            AutoWindowQueue.showing = false
            AutoWindowQueue.drainLater()
        })
        if (showCallback) showCallback(wnd)
    }

    UIRoot.instance.openChildWindow(item.windowName, params)
}

// 延后一帧再 drain，避免在窗口 close/destroy 的同步流程中立即打开下一个窗口。
AutoWindowQueue.drainLater = function() {
    setTimeout(function() {
        AutoWindowQueue.drain()
    }, 0)
}

// 按 windowOrder 表排序待弹窗口。
// 未配置的窗口使用默认大优先级，排在已配置窗口后面。
AutoWindowQueue.sortPending = function() {
    this.pending.sort(function(a, b) {
        let pa = AutoWindowQueue.getPriority(a.windowName, a.stage)
        let pb = AutoWindowQueue.getPriority(b.windowName, b.stage)
        if (pa != pb) return pa - pb
        return 0
    })
}

// 获取窗口优先级。
// 优先使用 stage 精确匹配；如果当前 stage 未配置，则退回到任意包含该窗口的配置行。
AutoWindowQueue.getPriority = function(windowName, stage) {
    if (typeof Meta === "undefined" || !Meta.MetaManager || !Meta.MetaType) return 999999

    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.WindowOrder) || {}
    let fallback = 999999
    let anyStagePriority = fallback

    for (let id in metas) {
        let meta = metas[id]
        if (!meta || !meta.Enabled() || !meta.ContainsWindow(windowName)) continue
        if (stage && meta.Stage() == stage) return meta.Priority()
        if (anyStagePriority == fallback) anyStagePriority = meta.Priority()
    }

    return anyStagePriority
}

// 判断当前是否应该暂停自动弹窗。
// 只要已有子窗口打开，就认为玩家正在处理其他弹窗，自动队列需要等待。
AutoWindowQueue.isBlocked = function() {
    if (typeof UIRoot === "undefined" || !UIRoot.instance || !UIRoot.instance.currentWindow) return true
    if (UIRoot.instance.currentWindowName == "LoginWindow") return true

    let instances = UIRoot.instance.windowInstance || {}
    for (let key in instances) {
        let wnd = instances[key]
        if (!wnd || wnd.isFake) continue
        if (wnd.isChild) return true
    }

    return false
}

// 清空队列。一般用于退出登录、切场景重置或调试。
AutoWindowQueue.clear = function() {
    this.pending = []
    this.showing = false
}

export default AutoWindowQueue
