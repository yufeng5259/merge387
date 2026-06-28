import '../../../LegacyGlobals';
var SRSlot = {}

SRSlot.getUserSlot = function() {
    let req = new GameKit.ServerRequest("getUserSlot")
    req.SetCallBack(function(res) {
        Game.SUserSlot.updateData(res.userSlot)
    })
    return req
}

SR.SRSlot = SRSlot
