import '../../../LegacyGlobals';
var SRActivity = {}

//获取用户数据
SRActivity.getUserActivity = function() {
    let req = new GameKit.ServerRequest("getUserActivity")
    req.SetCallBack(function(res) {
        Game.SUserActivity.updateData(res.userdata)
    })
    return req
}
SRActivity.activityCouponBuyRequest = function(msg) {
    
    if(global.loadEditorTemp){
        let req = new GameKit.ServerRequest("activityCouponBuy")
        return req
    }
    return null
    
}

SR.SRActivity = SRActivity