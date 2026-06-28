import '../../../LegacyGlobals';
var SRRecord = {}

//获取身份标记
//getUserRecord
SRRecord.getUserRecord = function() {
    let req = new GameKit.ServerRequest("getUserRecord")
    req.SetCallBack(function(res) {
        Game.SUserRecord.updateData(res.userdata)
    })
    return req
}


SR.SRRecord = SRRecord