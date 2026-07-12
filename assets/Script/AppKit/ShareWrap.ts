//鍒嗕韩
import { Camera, Node, RenderTexture, director, error, find, game, sys, view } from 'cc';
import { JSB } from 'cc/env';

type NativeBridge = typeof jsb & {
    fileUtils?: {
        getWritablePath(): string;
    };
    saveImageData?: (data: Uint8Array, width: number, height: number, filePath: string) => boolean;
};
type ShareObject = Record<string, unknown>;
type WxCanvas = HTMLCanvasElement & {
    toTempFilePathSync(options: Record<string, number>): string;
};
type SnapshotCamera = Camera & {
    render?: () => void;
};
type ShareWrapper = Record<string, any>;

function getNativeBridge(): NativeBridge | null {
    return JSB && typeof jsb !== 'undefined' ? jsb as NativeBridge : null;
}

var ShareWrap: ShareWrapper = {}

ShareWrap.getBase64 = function (img, withUserAvatar = false) {
    let getBase64Image = function(img: any, width?: any, height?: any, img2?: any, posx?: any, posy?: any, width2?: any, height2?: any) {//width銆乭eight璋冪敤鏃朵紶鍏ュ叿浣撳儚绱犲€硷紝鎺у埗澶у皬 ,涓嶄紶鍒欓粯璁ゅ浘鍍忓ぇ灏?
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;

        var ctx = canvas.getContext("2d");
        if (!ctx) return "";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (img2) ctx.drawImage(img2, posx, posy, width2 || img2.width, height2 || img2.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    }
    return new Promise(function(resolve, reject) {
        if (img) {
            var image = new Image();
            image.crossOrigin = '';
            image.src = img;
            image.onload =function (){
                if (withUserAvatar) {
                    var image2 = new Image();
                    image2.crossOrigin = '';
                    image2.src = Game.SUser.Avatar();
                    image2.onload =function (){
                        resolve(getBase64Image(image, null, null, image2, 45, 90, 140, 140));//灏哹ase64浼犵粰done涓婁紶澶勭悊
                    }
                } else {
                    resolve(getBase64Image(image));//灏哹ase64浼犵粰done涓婁紶澶勭悊
                }
            }
        } else {
            reject("no img")
        }
    })
}

ShareWrap.arrayBufferToBase64 = function( raw ) {
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var bytes = raw;
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 4;
    var mainLength = byteLength - byteRemainder;
    var a, b, c, d;
    var chunk;  
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 4) {
     // Combine the three bytes into a single integer
     chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
     // Use bitmasks to extract 6-bit segments from the triplet
     a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
     b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
     c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
     d = chunk & 63; // 63 = 2^6 - 1
     // Convert the raw binary segments to the appropriate ASCII encoding
     base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
     chunk = bytes[mainLength];
     a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2;
     // Set the 4 least significant bits to zero
     b = (chunk & 3) << 4 // 3 = 2^2 - 1;
     base64 += encodings[a] + encodings[b] + '==';
    }
    else if (byteRemainder == 2) {
     chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
     a = (chunk & 16128) >> 8 // 16128 = (2^6 - 1) << 8;
     b = (chunk & 1008) >> 4 // 1008 = (2^6 - 1) << 4;
     // Set the 2 least significant bits to zero
     c = (chunk & 15) << 2 // 15 = 2^4 - 1;
     base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
    return "data:image/jpeg;base64," + base64;
}

ShareWrap.getScreen = function(rect) {
    var node = new Node();
    node.parent = director.getScene();
    var snapCameraNode = find("Canvas/SnapCamera")
    if (!snapCameraNode) return null
    var camera = snapCameraNode.getComponent(Camera) as SnapshotCamera | null
    if (!camera) return null
    var snapCameraWasActive = snapCameraNode.active
    var oldVisibility = camera.visibility
    var oldTargetTexture = camera.targetTexture
    snapCameraNode.active = false

    // 璁剧疆浣犳兂瑕佺殑鎴浘鍐呭鐨?cullingMask
    camera.visibility = 0xffffffff;

    // 鏂板缓涓€涓?RenderTexture锛屽苟涓旇缃?camera 鐨?targetTexture 涓烘柊寤虹殑 RenderTexture锛岃繖鏍?camera 鐨勫唴瀹瑰皢浼氭覆鏌撳埌鏂板缓鐨?RenderTexture 涓€?
    var texture = new RenderTexture();
    var visibleSize = view.getVisibleSize();
    // 濡傛灉鎴浘鍐呭涓笉鍖呭惈 Mask 缁勪欢锛屽彲浠ヤ笉鐢ㄤ紶閫掔涓変釜鍙傛暟
    texture.reset({width: visibleSize.width, height: visibleSize.height});
    camera.targetTexture = texture;

    // 娓叉煋涓€娆℃憚鍍忔満锛屽嵆鏇存柊涓€娆″唴瀹瑰埌 RenderTexture 涓?
    var data = null
    snapCameraNode.active = true
    try {
        camera.render?.();

        // 杩欐牱鎴戜滑灏辫兘浠?RenderTexture 涓幏鍙栧埌鏁版嵁浜?
        data = texture.readPixels(visibleSize.width/2+rect.x-rect.width/2, visibleSize.height/2+rect.y-rect.height/2, rect.width, rect.height);
    } finally {
        snapCameraNode.active = false
        camera.targetTexture = oldTargetTexture
        camera.visibility = oldVisibility
        snapCameraNode.active = snapCameraWasActive
    }
    if (!data) return null

    var filpYImage = function (data, width, height) {
        // create the data array
        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        return picData;
    }
    if (sys.isNative) {
        let nativeBridge = getNativeBridge()
        if (!nativeBridge) return null
        let filePath = (nativeBridge.fileUtils ? nativeBridge.fileUtils.getWritablePath() : '') + 'render_to_sprite_image.png';

        data = filpYImage(data, rect.width, rect.height)
        let success = nativeBridge.saveImageData ? nativeBridge.saveImageData(data, rect.width, rect.height, filePath) : false
        if (success) {
            return filePath;
        }
        else {
            error("save image data failed!");
        }
        return null
    }

    // 鎺ヤ笅鏉ュ氨鍙互瀵硅繖浜涙暟鎹繘琛屾搷浣滀簡
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return null
    var width = rect.width
    var height = rect.height
    canvas.width = width;
    canvas.height = height;

    var rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
        let srow = height - 1 - row;
        let imageData = ctx.createImageData(width, 1);
        let start = srow*width*4;
        for (let i = 0; i < rowBytes; i++) {
            imageData.data[i] = data[start+i];
        }

        ctx.putImageData(imageData, 0, row);
    }

    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
}
ShareWrap.FacebookInvite=function(msg,callback, failcallback = null){
    console.log(msg,'FacebookInvite')
    if (AppKit.SdkManager.IsNative()&&Game.SUser.IsFacebook()){
        AppKit.NativeWrap.call("ShareClass", "FacebookInvite", msg, function(info) {
            if (info.success) {
                if (callback != null) callback()
            } else {
                if (failcallback != null) failcallback()
            }
        })
    }
}
ShareWrap.share = function(title, imageurl, data, callback, source, withUserAvatar = false, failcallback = null) {
    data = data || {}
    data.inviteId = Game.SUser.UserId()
    if (wxTools.usewx) {
        wxTools.ShareCommon({
            title: title,
            imageUrl: wxTools.PathToWxPath(imageurl),
            query: wxTools.QueryObjectToString(data),
        })
        if (callback != null) callback()
    } else if (fbInTools.usefbIn) {
        ShareWrap.getBase64(fbInTools.PathToFBInPath(imageurl), withUserAvatar).then(function(base64Picture){
            //console.log(base64);//澶勭悊鎴愬姛鎵撳嵃鍦ㄦ帶鍒跺彴
            FBInstant.shareAsync({
                intent: data.intent || "SHARE",
                image: base64Picture,
                text: title,
                data: data,
            }).then(function(res) {
                if (callback != null) callback()

                AppKit.LogEventWrap.logEvent("ShareDetail", {source:source, result:1})
            }).catch(function() {
                AppKit.LogEventWrap.logEvent("ShareDetail", {source:source, result:0})
                if (failcallback != null) failcallback()
            });
        }).catch(function(err){
            Logs.Warning("getBase64 error", err);//鎵撳嵃寮傚父淇℃伅
            if (failcallback != null) failcallback()
        });  
    } else if (AppKit.SdkManager.IsNative()) {
        let obj: ShareObject = {}
        obj.title = title
        if (data.url) obj.url = data.url
        if (imageurl) obj.imagePath = "res/raw-assets/" + imageurl
        AppKit.NativeWrap.call("ShareClass", "ShareObject", obj, function(info) {
            if (info.success) {
                if (callback != null) callback()
            } else {
                if (failcallback != null) failcallback()
            }
        })
    } else {
        Logs.Info("share", title, imageurl, data)
        if (callback != null) callback()
    }
    AppKit.LogEventWrap.logEvent("game_share", {source:source})
    //AppKit.LogEventWrap.logAppAnalytic("share")
}
//rect:{x:center_x, y:center_y, width:width, height:height}
ShareWrap.shareScreen = function(title, rect, data, callback, source, withUserAvatar = false, failcallback = null) {
    data = data || {}
    data.inviteId = Game.SUser.UserId()
    if (wxTools.usewx) {
        let canvas = game.canvas as WxCanvas | null
        if (!canvas) return
        let winSize = view.getVisibleSize()
        let ra = canvas.width / winSize.width
        wxTools.ShareCommon({
            title: title,
            imageUrl: canvas.toTempFilePathSync({
                x: canvas.width / 2 + (rect.x - rect.width/2) * ra,
                y: canvas.height / 2 - (rect.y + rect.height/2) * ra,
                width: rect.width * ra,
                height: rect.height * ra,
                destWidth: 500,
                destHeight: 400,
            }),
            query: wxTools.QueryObjectToString(data),
        })
        if (callback != null) callback()
    } else if (fbInTools.usefbIn) {
        FBInstant.shareAsync({
            intent: data.intent || "SHARE",
            image: ShareWrap.getScreen(rect),
            text: title,
            data: data,
        }).then(function() {
            if (callback != null) callback()

            AppKit.LogEventWrap.logEvent("ShareDetail", {source:source, result:1})
        }).catch(function() {
            AppKit.LogEventWrap.logEvent("ShareDetail", {source:source, result:0})
            if (failcallback != null) failcallback()
        });
    } else if (AppKit.SdkManager.IsNative()) {
        if (Game.SUser.IsFacebook()) {
            let obj: ShareObject = {}
            obj.message = title
            obj.title = GameKit.i18n.t("ShareDialogTitle")
            obj.imagePath = ShareWrap.getScreen(rect)
            obj.data = JSON.stringify({inviteId: Game.SUser.UserId()})
            if (data.url) obj.url = data.url
            AppKit.NativeWrap.call("FBSdk", "shareImage", obj, function(info) {
                if (info.success) {
                    if (callback != null) callback()
                } else {
                    if (failcallback != null) failcallback()
                }
            })
        } else {
            let obj: ShareObject = {}
            obj.title = title
            if (data.url) obj.url = data.url
            obj.imagePath = ShareWrap.getScreen(rect)
            AppKit.NativeWrap.call("ShareClass", "ShareObject", obj, function(info) {
                if (info.success) {
                    if (callback != null) callback()
                } else {
                    if (failcallback != null) failcallback()
                }
            })
        }
    } else {
        console.log(ShareWrap.getScreen(rect))
        Logs.Info("share", title, rect, data)
        if (callback != null) callback()
    }
    AppKit.LogEventWrap.logEvent("game_share", {source:source})
    //AppKit.LogEventWrap.logAppAnalytic("share")
}

ShareWrap.inviteNew = function(title, imageurl, data, callback, source, withUserAvatar = false, failcallback = null) {
    data = data || {}
    data.inviteId = Game.SUser.UserId()
    
    if (wxTools.usewx) {
        ShareWrap.share(title, imageurl, data, callback, source, withUserAvatar, failcallback)
    } else if (fbInTools.usefbIn) {
        var _inviteNew = function() {
            Logs.Log("after context", FBInstant.context.getID());
            AppKit.ShareWrap.getBase64(fbInTools.PathToFBInPath(imageurl), withUserAvatar)
            .then(function(base64Picture){
                //console.log(base64Picture);//澶勭悊鎴愬姛鎵撳嵃鍦ㄦ帶鍒跺彴
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    template: source || "play_turn",
                    image: base64Picture,
                    text: title,
                    data: data,
                    //strategy: 'IMMEDIATE',
                    notification: 'PUSH',
                }).then(function() {
                    Logs.Info("Invite Over")
                })
                .catch(function(e) {
                    Logs.Warning("ShareWrap.inviteNew3", e)
                });
                if (callback != null) callback()
            })
            .catch(function(e) {
                Logs.Warning("ShareWrap.inviteNew2", e)
                if (failcallback != null) failcallback()
            })

            AppKit.LogEventWrap.logEvent("ChooseDetail", {source:source, result:1})
        }
        FBInstant.context.chooseAsync({ filters:['NEW_PLAYERS_ONLY'] })
        .then(function() {
            _inviteNew()
        })
        .catch(function(e) {
            if (e.code === "SAME_CONTEXT") {
                _inviteNew()
            } else if(e.code === "USER_INPUT") {
                AppKit.LogEventWrap.logEvent("ChooseDetail", {source:source, result:0})
                if (failcallback != null) failcallback()
            } else {
                Logs.Warning("ShareWrap.inviteNew1", e)
                AppKit.LogEventWrap.logEvent("ChooseDetail", {source:source, result:0})
                if (failcallback != null) failcallback()
            }
        });
    } else if (AppKit.SdkManager.IsNative()) {
        if (Game.SUser.IsFacebook() && false) {
            let obj: ShareObject = {}
            obj.message = title
            obj.title = GameKit.i18n.t("ShareInviteDialogTitle")
            obj.data = JSON.stringify({inviteId: Game.SUser.UserId()})
            AppKit.NativeWrap.call("FBSdk", "shareInvite", obj, function(info) {
                if (info.success) {
                    if (callback != null) callback()
                } else {
                    if (failcallback != null) failcallback()
                }
            })
        } else {
            ShareWrap.share(title, imageurl, data, callback, source, withUserAvatar, failcallback)
        }
    } else {
        if (callback != null) callback()
    }
}

ShareWrap.chooseOne = function(id, title, imageurl, data, callback, source, withUserAvatar = false, failcallback = null) {
    data = data || {}
    data.inviteId = Game.SUser.UserId()
    
    if (wxTools.usewx) {
        //ShareWrap.share(null, title, imageurl, data, callback, source)
        if (callback != null) callback()
    } else if (fbInTools.usefbIn) {
        LoadingWindow.Show()
        var __chooseOne = function(cName, cPhoto) {
            AppKit.ShareWrap.getBase64(fbInTools.PathToFBInPath(imageurl), withUserAvatar)
            .then(function(base64Picture){
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    template: source || "play_turn",
                    image: base64Picture,
                    text: title,
                    data: data,
                    //strategy: 'IMMEDIATE',
                    notification: 'PUSH',
                }).then(function() {
                    Logs.Info("Choose Over")
                })
                .catch(function(e) {
                    Logs.Warning("ShareWrap.chooseOne3", e)
                });
                if (callback != null) callback()
            })
            .catch(function(e) {
                Logs.Warning("ShareWrap.chooseOne2", e)
                LoadingWindow.Hide()
                if (failcallback != null) failcallback()
            })
        }
        var _chooseOne = function() {
            Logs.Log("after context", FBInstant.context.getID());
            FBInstant.context.getPlayersAsync()
            .then(function(players) {
                let findOne = false
                for (let i = 0; i < players.length; i++) {
                    if (players[i].getID() == id) {
                        let cName = players[i].getName()
                        let cPhoto = players[i].getPhoto()
                        __chooseOne(cName, cPhoto)
                        findOne = true
                        break
                    }
                }
                if (!findOne) {
                    __chooseOne(null, null)
                }
            })
            .catch(e => {
                LoadingWindow.Hide()
                if (failcallback != null) failcallback()
            })
            AppKit.LogEventWrap.logEvent("CreateDetail", {source:source, result:1})
        }
        FBInstant.context.createAsync(id)
        .then(function() {
            _chooseOne()
        })
        .catch(function(e) {
            if (e.code === "SAME_CONTEXT") {
                _chooseOne()
            } else if(e.code === "USER_INPUT") {
                AppKit.LogEventWrap.logEvent("CreateDetail", {source:source, result:0})
                LoadingWindow.Hide()
                if (failcallback != null) failcallback()
            } else {
                Logs.Warning("ShareWrap.chooseOne1", e)
                AppKit.LogEventWrap.logEvent("CreateDetail", {source:source, result:0})
                LoadingWindow.Hide()
                if (failcallback != null) failcallback()
            }
        });
    } else if (AppKit.SdkManager.IsNative()) {
        if (Game.SUser.IsFacebook() && false) {
            let obj: ShareObject = {}
            obj.message = title
            obj.title = GameKit.i18n.t("ShareChooseDialogTitle")
            obj.data = JSON.stringify({inviteId: Game.SUser.UserId()})
            if (typeof id == "string") id = [id]
            obj.ids = id
            AppKit.NativeWrap.call("FBSdk", "sharePlayers", obj, function(info) {
                if (info.success) {
                    if (callback != null) callback()
                } else {
                    if (failcallback != null) failcallback()
                }
            })
        } else {
            if (callback != null) callback()
        }
    } else {
        if (callback != null) callback()
    }
}

ShareWrap.shareFbUrl = function(url, source, callback, failcallback) {
    AppKit.NativeWrap.call("FBSdk", "share", {url: url}, function(info) {
        if (info.success) {
            if (callback != null) callback()
        } else {
            if (failcallback != null) failcallback()
        }
    })
    AppKit.LogEventWrap.logEvent("game_share", {source:source})
    //AppKit.LogEventWrap.logAppAnalytic("share")
}

export default ShareWrap
