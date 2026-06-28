import '../../../LegacyGlobals';
import { sys } from 'cc';

const SRLogin: any = {}

//登陆
SRLogin.login = function(accountId, from) {
    let version = AppKit.NativeWrap.getVersion()
    let req = new GameKit.ServerRequest("login")
    req.SetRequestBody("accountId", accountId)
    req.SetRequestBody("from", from)
    req.SetRequestBody("platform", sys.os)
    req.SetRequestBody("deviceId", global.deviceId)
    req.SetRequestBody("versionNumber",version)
    return req
}

//清除数据
SRLogin.clearProgress = function() {
    let req = new GameKit.ServerRequest("clearProgress")
    req.SetCallBack(function(res) {
        AppGame.instance.logout()
        AppKit.NativeWrap.deleteAppleAuthorization();
    })
    return req
}
//**切换账号 */
SRLogin.switchChannels = function() {
    //switch bind
    console.log(Game.SUser.accountId,Game.SUser.from);
    
    let req = new GameKit.ServerRequest("switchChannels")
    req.SetRequestBody("accountId", Game.SUser.accountId)
    req.SetRequestBody("from", Game.SUser.from)
    req.SetRequestBody("type", "switch")
    req.SetRequestBody("platform", sys.os)
    req.SetRequestBody("deviceId", global.deviceId)
    return req
}
//**绑定账号 */
SRLogin.bindChannels = function() {
    //switch bind
    console.log(Game.SUser.accountId,Game.SUser.from);
    let req = new GameKit.ServerRequest("switchChannels")
    req.SetRequestBody("accountId", Game.SUser.accountId)
    req.SetRequestBody("from", Game.SUser.from)
    req.SetRequestBody("type", "bind")
    req.SetRequestBody("platform", sys.os)
    req.SetRequestBody("deviceId", global.deviceId)
    return req
}

SR.SRLogin = SRLogin

export default SRLogin
