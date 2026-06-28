import '../../../LegacyGlobals';
var SRGuild = {}

//新增军团消息msg.type=0,创建 1=编辑
/**
 *  legionId: legionId,//军团id
 * legionName:"",//军团名称
 *   legionBadge:"",//军团徽章
 *   legionExplain:"",//军团说明
    legionType:0,//军团类型
    legionDemand:0,//军团需求星星数
    legionStarsNumber:0,//军团总星星数
    legionLevel:1,//军团等级
    legionNumber:[],//军团人数列表 [userId1,userId2...] userId1:默认下标�?的是团长
    establishEstablish:G.getCurrentTimeInt(),//军团创建时间
    type = 0创建�?编辑
 * 
 */
SRGuild.createGuild = function(msg) {
    let req = new GameKit.ServerRequest("AddLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//加入
SRGuild.joinGuild = function(msg) {
    let req = new GameKit.ServerRequest("joinLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//离开
SRGuild.leaveGuild = function(msg) {
    let req = new GameKit.ServerRequest("jsignOutLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//搜索军团
//msg=“”获取军团列�?
//msg = "adad"模糊查询军团列表
SRGuild.searchGuild = function(msg) {
    let req = new GameKit.ServerRequest("searchLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//查看军团信息-军团ID
SRGuild.checkGuildInfo = function(msg) {
    let req = new GameKit.ServerRequest("getLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//删除好友 uid
SRGuild.deleteUserFriend = function(msg) {
    let req = new GameKit.ServerRequest("deleteUserFriend")
    req.SetRequestBody("msg",msg)
    return req
}
////////////////////////////////聊天/////////////////////////////
//发送消�?msg{type:0,tID:军团ID}
//1加入,2推出,3体力,4卡片,5正常
SRGuild.SendChatRequest = function(msg) {
    let req = new GameKit.ServerRequest("SendChat")
    req.SetRequestBody("msg",msg)
    return req
}
//获取消息msg{tid:军团ID}
SRGuild.GetChatsRequest = function(msg) {
    let req = new GameKit.ServerRequest("GetChats")
    req.SetRequestBody("msg",msg)
    return req
}
//帮助(增加)msg{msgID:1,lid:军团ID,type:SRGuild.MsgType}
SRGuild.HelpGiftRequest = function(msg) {
    let req = new GameKit.ServerRequest("HelpGift")
    req.SetRequestBody("msg",msg)
    return req
}
//添加好友
SRGuild.addUserFriends = function(msg) {
    let req = new GameKit.ServerRequest("addUserFriends")
    req.SetRequestBody("msg",msg)
    return req
}
//确定添加好友
SRGuild.determineAddUserFriends = function(msg) {
    let req = new GameKit.ServerRequest("determineAddUserFriends")
    req.SetRequestBody("msg",msg)
    return req
}
//拒绝添加好友
SRGuild.refuseAddUserFriends = function(msg) {
    let req = new GameKit.ServerRequest("refuseAddUserFriends")
    req.SetRequestBody("msg",msg)
    return req
}
//踢出军团
SRGuild.kickLegion = function(msg) {
    let req = new GameKit.ServerRequest("kickLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//验证是否有军�?防止被提出军团消息及时问�?
SRGuild.verificationLegion = function(msg) {
    let req = new GameKit.ServerRequest("verificationLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//手动领取奖励
SRGuild.bossReward = function(msg) {
    let req = new GameKit.ServerRequest("bossReward")
    req.SetRequestBody("msg",msg)
    return req
}
//禅让会长
SRGuild.changeLegionRequest = function(msg) {
    let req = new GameKit.ServerRequest("changeLegion")
    req.SetRequestBody("msg",msg)
    return req
}
//军团排名
SRGuild.legionRanksRequest = function(msg) {
    let req = new GameKit.ServerRequest("legionRanks")
    req.SetRequestBody("msg",msg)
    return req
}
//广播
SRGuild.obtain = function() {
    let req = new GameKit.ServerRequest("obtain")
    return req
}
/**
 * @returns 1加入
 * @returns 2退出公�?
 * @returns 3体力
 * @returns 4卡片
 * @returns 5正常 
 */
 SRGuild.MsgType ={
    MsgIn:1,
    MsgOut:2,
    MsgAp:3,
    MsgCard:4,
    MsgStr:5
}
SRGuild.Mine =null;
SRGuild.BossCount=0;
SR.SRGuild = SRGuild