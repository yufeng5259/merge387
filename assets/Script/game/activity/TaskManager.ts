import '../../LegacyGlobals';
const TaskManager: any = {
    Constance: {},
}
TaskManager.Types = {
    CompleteOrders:"completeOrders",//完成订单数量
    MergeCount:"mergeCount",//合成次数
    CollectCoin:"collectCoin",//收集金币
    CollectGem:"collectGem",//收集钻石
    CollectAp:"collectAp",//收集体力
    SpendCoin:"spendCoin",//消耗金�?
    SpendGem:"spendGem",//消耗钻�?
    SpendAp:"spendAp",//消耗体�?
    CollectCard1:"collectCard1",//获得卡牌1�?
    CollectCard2:"collectCard2",//获得卡牌2�?
    CollectCard3:"collectCard3",//获得卡牌3�?
    CollectCard4:"collectCard4",//获得卡牌4�?
    CollectCard5:"collectCard5",//获得卡牌5�?
    CollectCardTotal:"collectCardTotal",//获得卡牌总数
    LoginDays:"loginDays",//活动开启累积登�?
}
Game.TaskManager = TaskManager
