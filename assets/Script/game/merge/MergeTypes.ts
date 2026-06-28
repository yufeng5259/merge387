
const MergeTypes: any = {

}
MergeTypes.MergeActionType = {
    MOVE: "move",
    MERGE: "merge",
    GENERATE: "generate",//生成合并物品
    COLLECT: "collect",//双击领取，如金币，体力瓶子等
    SELL: "sell",//出售合并物品
    DELETE: "delete",//删除合并物品
    UNDO: "undo",//还原卖出合并物品
    OPEN: "open",//需要先解锁的，点击开始解锁合并物品
    THREE_TO_ONE: "3to1",//3合1
    CLAIM_ORDER: "claimOrder",//领取订单
    CLAIM_REWARD: "claimReward",//提取临时棋子
    
}

/** 棋子功能类型 */
MergeTypes.MergeFunctionType = {
    Normal: "normal",//正常合成
    ThreeToOneType: "threeToOneType",//3合1类型
    ThreeToOneOrder: "threeToOneOrder",//3合1订单
    Hourglass: "hourglass",//沙漏
    SCISSORS:"scissors",//剪刀
    COOKING: "cooking",//烹饪
}

/** 同格第二次点击（双击）时 MergeItem.resolveSameCellDoubleTap 的决策结果，由棋盘执行副作用 */
MergeTypes.MergeDoubleTapIntent = {
    NONE: 'none',//无操作
    OPEN_THREE_TO_ONE: 'open_three_to_one',//打开3合1窗口
    /** 一次性生成器等：未开启时双击等同描述面板里点「开启」，走 OpenGenerator */
    OPEN_MERGE_GENERATOR: 'open_merge_generator',
    GENERATE_ITEM: 'generate_item',//生成物品
    GENERATE_CONSUME_FAIL: 'generate_consume_fail',//生成失败
    NO_EMPTY_TILE: 'no_empty_tile',//没有空格
    COOKING_DONE: 'cooking_done',//烹饪完成
    USE_HOURGLASS: 'use_hourglass',//使用沙漏
    COLLECT_SELL: 'collect_sell',//收集出售
    BROKEN_BUBBLE: 'broken_bubble',//打破气泡
}
MergeTypes.MergeTypeToContentTypes = {
    "16": 7,//Game.Content.Types.Cash
    "11": 2,//Game.Content.Types.Ap
    "5": 1,//Game.Content.Types.Coin
}
export default MergeTypes;

// 目前参数定义:
// //open是3 选 1 开箱
// saveMap({type: "func", cellKey: "3_4", funcAction: "open" })

// 返回:{
//   errorCode: 0,
//   mergeMapData: { "棋盘数据" },
//   funcOptions: ["26_-1_-1", "31_-1_-1", "28_-1_-1"],//3选一棋子
//   funcInstanceId: "f_258_1731234567_123456"//3选一棋子的唯一后缀,格式:pieceId_-1_-1=f_pieceId_timestamp_random
// }

// // 3 选 1 确认,pickPieceData选中棋子的pickPieceData
// saveMap({ type: "func", cellKey: "3_4", funcAction: "pick", pickPieceData: "26_-1_-1", targetCellKey: "2_5" })

// pickPieceData: "26_-1_-1",   // 从 funcOptions 中选一个
// targetCellKey: "2_5"         // 放置到的空格子



// // 沙漏使用
// saveMap({type: "func", cellKey: "4_6", funcAction: "use" })



// funcAction:
// 1."use"=>(使用沙漏)
// 2."open"=>(点开3选一棋子)
// 3."pick"=>(消耗掉3选一棋子,并且在targetCellKey放置棋子)
// 暴击棋子
// 1.随机生成一个棋子
// 2.通过钻石或者广告后获取棋子，戳破气泡后则获取1枚金币
