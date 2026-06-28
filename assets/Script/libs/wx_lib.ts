var wxTools = {}
//是微信小游戏平台
wxTools.usewx = cc.sys.platform === cc.sys.Platform.WECHAT_GAME

if (wxTools.usewx) {
    //比较版本号
    wxTools.SdkVersionOver = function(ver) {
        let s = wx.getSystemInfoSync().SDKVersion.split('.')
        let v = ver.split('.')
        let index = 0
        while(true) {
            if (s.length > index && v.length > index) {
                if (parseInt(s[index]) > parseInt(v[index])) return 1;
                if (parseInt(s[index]) < parseInt(v[index])) return -1;
            } else if (s.length > index && v.length <= index)
                return 1;
            else if (s.length <= index && v.length > index)
                return -1;
            else 
                break;

            index ++;
        }
        return 0
    }
    //开放域发送信息
    wxTools.OpenDataPostMessage = function(obj) {
        try{
            wx.triggerGC()
            wx.getOpenDataContext().postMessage(obj)
        } catch(e) {}
    }
    //获取开放域的sharedcanvas
    wxTools.OpenDataCanvas = function() {
        try{
            return wx.getOpenDataContext().canvas
        } catch(e) {}
        return null
    }
    //将Query object转为string（微信某些方法要求）
    wxTools.QueryObjectToString = function(obj) {
        let str = ""
        let index = 0
        for (let key in obj) {
            if (index !== 0) str += '&'
            str += key.toString() + '=' + obj[key].toString()
            index += 1
        }
        return str
    }

    wxTools.ShareCommon = function(res) {
        let func = String.fromCharCode(115,104,97,114,101,65,112,112,77,101,115,115,97,103,101)
        wx[func](res)
    }

    wxTools.PathToWxPath = function(path) {
        return "res/raw-assets/" + path
    }

} else {
    
}
global.wxTools = wxTools
