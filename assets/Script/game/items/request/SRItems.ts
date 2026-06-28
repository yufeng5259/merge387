import '../../../LegacyGlobals';
var SRItems = {}

//获取用户道具数据
SRItems.getUserItems = function() {
    let req = new GameKit.ServerRequest("getUserItems")
    req.SetCallBack(function(res) {
        Game.SUserItems.updateData(res.userdata)
    })
    return req
}



SR.SRItems = SRItems

var SRInvitationUser = {}
SR.SRInvitationUser = SRInvitationUser
SRInvitationUser.invitationUser = function(inviteCode,cb) {
    console.log("sssss",inviteCode)
    // let req = new GameKit.ServerRequest("invitationUser")
    // req.SetRequestBody("namerrrrrr", inviteCode)
    // req.SetCallBack(function(res) {
    //     cb(res);
    // })
    // return req

    let sr = new GameKit.ServerRequest("invitationUser")
    sr.SetRequestBody("code", inviteCode)
    sr.SetCallBack(function(res) {
        cb(res);
    })
    return sr;
}
