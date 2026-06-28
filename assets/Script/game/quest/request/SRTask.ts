import '../../../LegacyGlobals';
var SRTask = {}

// 获取任务列表
SRTask.getTaskList = () => {
    let req = new GameKit.ServerRequest("getTaskList")
    req.SetCallBack((res) => {
        GameKit.DataCache.SetData("UserTask", res.list)
        if (GameMainWindow.instance) GameMainWindow.instance.updateQuestBadge()
    })
    return req
}

// 领取任务奖励
SRTask.receiveTaskReward = id => {
    let req = new GameKit.ServerRequest("receiveTaskReward")
    req.SetRequestBody("taskId", id)
    return req
}

// 领取多个任务奖励
SRTask.receiveTasksReward = ids => {
    let req = new GameKit.ServerRequest("receiveTasksReward")
    req.SetRequestBody("taskIds", ids)
    return req
}

SRTask.clientCountTask = (target, count) => {
    let req = new GameKit.ServerRequest("clientCountTask")
    req.SetRequestBody("target", target)
    req.SetRequestBody("count", count)
    req.SetSilence(true)
    return req
}
SR.SRTask = SRTask