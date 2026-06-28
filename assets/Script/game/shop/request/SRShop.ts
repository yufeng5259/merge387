import '../../../LegacyGlobals';

var SRShop = {}

//支付成功
SRShop.paySuccess = function(shopId) {
    let req = new GameKit.ServerRequest("paySuccess")
    req.SetRequestBody("shopId", shopId)
    req.SetSilence(false)
    return req
} 

//金币支付
SRShop.payFor = function(shopId) {
    let req = new GameKit.ServerRequest("payFor")
    req.SetRequestBody("shopId", shopId)
    req.SetSilence(false)
    return req
} 

//获取商城道具标签的所有数�?
SRShop.shopGetInfo = function() {
    let req = new GameKit.ServerRequest("shopGetInfo")
    req.SetSilence(false)
    return req
}
SRShop.Bets=[0,100,200,300,400,500,600]
SRShop.GetBet = function(){
    return SRShop.Bets[SRShop.CurIndex()]
}
//传shopId和shopName（shop表name�?
SRShop.BuyByShop = function(shopId,shopName) {
    let req = new GameKit.ServerRequest("BuyByShop")
    req.SetRequestBody("shopId", shopId)
    req.SetRequestBody("shopName", shopName)
    req.SetSilence(false)
    return req
} 
// 前端主动刷新热卖 6 个格子，服务端扣除刷新所需钻石�?
SRShop.RefreshHot = function() {
    let req = new GameKit.ServerRequest("RefreshHot")
    req.SetSilence(false)
    return req
} 
//////////////体力不足,购买体力/////////////////////
//获取信息
SRShop.GetCashBuyInfo = function() {
    let req = new GameKit.ServerRequest("getCashBuyInfo")
    req.SetRequestBody("type", 2)
    req.SetSilence(false)
    return req
} 
//购买
SRShop.CashBuyContent = function() {
    let req = new GameKit.ServerRequest("cashBuyContent")
    req.SetRequestBody("type", 2)
    req.SetSilence(false)
    return req
} 
SR.SRShop = SRShop