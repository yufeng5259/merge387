import '../../../LegacyGlobals';
var SRMergeTutorial = {}

SRMergeTutorial.getData = function() {
    let req = new GameKit.ServerRequest("getUserTutorial")
    req.SetCallBack(function(res) {
        if (Game.SUserMergeTutorial && Game.SUserMergeTutorial.updateData) {
            Game.SUserMergeTutorial.updateData(res.userTutorial)
        }
    })
    return req
}

SRMergeTutorial.finishStep = function(id) {
    let req = new GameKit.ServerRequest("finishStep")
    req.SetSilence(true)
    req.SetRequestBody("tutorialId", id)
    return req
}

SR.SRMergeTutorial = SRMergeTutorial
