//*
function closure(method, ...args) {
    return (...params) => method.apply(null, [...args, ...params]);
}

function wait(duration:number, callBack ? ) {
    return new Promise((resolve, reject) => {
        let time = null;
        time = setTimeout(() => {
            clearTimeout(time);
            resolve();
            if (callBack) callBack();
        }, duration)
    });
}

class Emiter {
    static CONST = {
        break: {}
    };

    private maps = {};
    private uid = 0;

    private add(name, handler, thisObject, priority, isOnce) {
        thisObject = thisObject || null;
        priority = priority || 0;
        let queue_id = this.uid++;
        let item = this.maps[name] || [];
        item.push([queue_id, handler, thisObject, priority, isOnce]);
        this.maps[name] = item;

        //倒序
        item.sort((a, b) => a[3] < b[3]);

        return queue_id;
    }

    on(name, handler, thisObject ? , priority ? ) {
        return this.add(name, handler, thisObject, priority, false);
    }
    once(name, handler, thisObject ? , priority ? ) {
        return this.add(name, handler, thisObject, priority, true);
    }

    private _duringEmit = false;
    rm(id, name ? ) {
        let names = name ? [name] : Object.keys(this.maps);
        for (let name of names) {
            let handlers = this.maps[name];
            if (!handlers) continue;

            if (this._duringEmit) {
                this.maps[name] = handlers = handlers.concat();
            }

            let index = 0;
            while (index < handlers.length) {
                let [queue_id, handler, thisObject, priority, isOnce] = handlers[index];
                if (queue_id == id) {
                    handlers.splice(index, 1)
                    return true;
                } else {index++;}
            }
        }
        return false;
    }

    rmall(name ? ) {
        if (name == undefined)
            this.maps = {};
        else
            delete this.maps[name];
    }

    emit(name, data ? ) {
        let handlers = this.maps[name];
        if (handlers && handlers.length > 0) {
            let index = 0;
            while (index < handlers.length) {
                let [queue_id, handler, thisObject, priority, isOnce] = handlers[index];
                isOnce ? handlers.splice(index, 1) : index++;
                this._duringEmit = true;
                let result = handler.call(thisObject, data)
                this._duringEmit = false;
                if (result == Emiter.CONST.break)break
            }
            return true;
        }
        return false;
    }
}

class Advertise extends Emiter {
    constructor(private iads: string[], private rads: string[], autoPreload = true) {
        super();
        this.suportAD() && autoPreload &&(/*this.preloadIAD(),*/this.preloadRAD());
    }

    suportAD() {
        let apis = FBInstant.getSupportedAPIs();
        return apis.indexOf("getRewardedVideoAsync") > -1 && apis.indexOf("getInterstitialAdAsync") > -1
    }

    private _intersitialAd: FBInstant.AdInstance = null
    hasIAD() {
        return !!this._intersitialAd
    }

    private async preloadIAD() {
        let arr = this.iads.concat();

        let i = 0;
        while (true) {
            let index = i++ % arr.length;
            try {
                let inst = await FBInstant.getInterstitialAdAsync(arr[index]);
                await inst.loadAsync()
                this._intersitialAd = inst;
                this.emit("iad_ready");
                break;
            } catch (e) {
                if (e.code == "ADS_FREQUENT_LOAD") {
                    await wait(2 * 60 * 1000)
                } else if (e.code == "ADS_TOO_MANY_INSTANCES") {
                    await wait(10 * 60 * 1000)
                }
            }
            await wait(index == 2 ? 2 * 60 * 1000 : 5e3);
        }
    }

    async showIAD() {
        let inst = this._intersitialAd;
        if (!inst) {
            await new Promise((resolve, reject) => {
                this.once("iad_ready", resolve)
            })
            inst = this._intersitialAd
        }
        this._intersitialAd = null;
        await inst.showAsync();
        this.preloadIAD();
    }

    private _rewardVideo: FBInstant.AdInstance = null;
    hasRAD() {
        return !!this._rewardVideo
    }

    private async preloadRAD() {
        let arr = this.rads.concat()

        let i = 0;
        while (true) {
            let index = i++ % arr.length;
            try {
                let inst = await FBInstant.getRewardedVideoAsync(arr[index]);
                await inst.loadAsync()
                this._rewardVideo = inst;
                this.emit("rad_ready");
                break;
            } catch (e) {
                console.log("ad error", e)
                if (e.code == "ADS_FREQUENT_LOAD") {
                    await wait(2 * 60 * 1000)
                } else if (e.code == "ADS_TOO_MANY_INSTANCES") {
                    await wait(10 * 60 * 1000)
                }
            }
            await wait(index == 2 ? 2 * 60 * 1000 : 5e3);
        }
    }

    async showRAD() {
        let inst = this._rewardVideo;
        if (!inst) {
            await new Promise((resolve, reject) => {
                this.once("rad_ready", resolve)
            })
            inst = this._rewardVideo
        }
        this._rewardVideo = null;
        await inst.showAsync();
        this.preloadRAD();
    }
}
window['yzad_Advertise'] = Advertise;
//*/
/*
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

Object.defineProperty(exports, "__esModule", { value: true });
function closure(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return method.apply(null, args.concat(params));
    };
}
function wait(duration, callBack) {
    return new Promise(function (resolve, reject) {
        var time = null;
        time = setTimeout(function () {
            clearTimeout(time);
            resolve();
            if (callBack)
                callBack();
        }, duration);
    });
}
var Emiter = (function () {
    function Emiter() {
        this.maps = {};
        this.uid = 0;
        this._duringEmit = false;
    }
    Emiter.prototype.add = function (name, handler, thisObject, priority, isOnce) {
        thisObject = thisObject || null;
        priority = priority || 0;
        var queue_id = this.uid++;
        var item = this.maps[name] || [];
        item.push([queue_id, handler, thisObject, priority, isOnce]);
        this.maps[name] = item;
        //倒序
        item.sort(function (a, b) { return a[3] < b[3]; });
        return queue_id;
    };
    Emiter.prototype.on = function (name, handler, thisObject, priority) {
        return this.add(name, handler, thisObject, priority, false);
    };
    Emiter.prototype.once = function (name, handler, thisObject, priority) {
        return this.add(name, handler, thisObject, priority, true);
    };
    Emiter.prototype.rm = function (id, name) {
        var names = name ? [name] : Object.keys(this.maps);
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var handlers = this.maps[name_1];
            if (!handlers)
                continue;
            if (this._duringEmit) {
                this.maps[name_1] = handlers = handlers.concat();
            }
            var index = 0;
            while (index < handlers.length) {
                var _a = handlers[index], queue_id = _a[0], handler = _a[1], thisObject = _a[2], priority = _a[3], isOnce = _a[4];
                if (queue_id == id) {
                    handlers.splice(index, 1);
                    return true;
                }
                else {
                    index++;
                }
            }
        }
        return false;
    };
    Emiter.prototype.rmall = function (name) {
        if (name == undefined)
            this.maps = {};
        else
            delete this.maps[name];
    };
    Emiter.prototype.emit = function (name, data) {
        var handlers = this.maps[name];
        if (handlers && handlers.length > 0) {
            var index = 0;
            while (index < handlers.length) {
                var _a = handlers[index], queue_id = _a[0], handler = _a[1], thisObject = _a[2], priority = _a[3], isOnce = _a[4];
                isOnce ? handlers.splice(index, 1) : index++;
                this._duringEmit = true;
                var result = handler.call(thisObject, data);
                this._duringEmit = false;
                if (result == Emiter.CONST.break)
                    break;
            }
            return true;
        }
        return false;
    };
    Emiter.CONST = {
        break: {}
    };
    return Emiter;
}());
var Advertise = (function (_super) {
    __extends(Advertise, _super);
    function Advertise(iads, rads, autoPreload) {
        if (autoPreload === void 0) { autoPreload = true; }
        var _this = _super.call(this) || this;
        _this.iads = iads;
        _this.rads = rads;
        _this._intersitialAd = null;
        _this._rewardVideo = null;
        _this.suportAD() && autoPreload && (_this.preloadRAD());
        return _this;
    }
    Advertise.prototype.suportAD = function () {
        var apis = FBInstant.getSupportedAPIs();
        return apis.indexOf("getRewardedVideoAsync") > -1 && apis.indexOf("getInterstitialAdAsync") > -1;
    };
    Advertise.prototype.hasIAD = function () {
        return !!this._intersitialAd;
    };
    Advertise.prototype.preloadIAD = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arr, i, index, inst, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = this.iads.concat();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 , 12];
                        index = i++ % arr.length;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 10]);
                        return [4 , FBInstant.getInterstitialAdAsync(arr[index])];
                    case 3:
                        inst = _a.sent();
                        return [4 , inst.loadAsync()];
                    case 4:
                        _a.sent();
                        this._intersitialAd = inst;
                        this.emit("iad_ready");
                        return [3 , 12];
                    case 5:
                        e_1 = _a.sent();
                        if (!(e_1.code == "ADS_FREQUENT_LOAD")) return [3 , 7];
                        return [4 , wait(2 * 60 * 1000)];
                    case 6:
                        _a.sent();
                        return [3 , 9];
                    case 7:
                        if (!(e_1.code == "ADS_TOO_MANY_INSTANCES")) return [3 , 9];
                        return [4 , wait(10 * 60 * 1000)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 , 10];
                    case 10: return [4 , wait(index == 2 ? 2 * 60 * 1000 : 5e3)];
                    case 11:
                        _a.sent();
                        return [3 , 1];
                    case 12: return [2 ];
                }
            });
        });
    };
    Advertise.prototype.showIAD = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inst;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inst = this._intersitialAd;
                        if (!!inst) return [3 , 2];
                        return [4 , new Promise(function (resolve, reject) {
                                _this.once("iad_ready", resolve);
                            })];
                    case 1:
                        _a.sent();
                        inst = this._intersitialAd;
                        _a.label = 2;
                    case 2:
                        this._intersitialAd = null;
                        return [4 , inst.showAsync()];
                    case 3:
                        _a.sent();
                        this.preloadIAD();
                        return [2 ];
                }
            });
        });
    };
    Advertise.prototype.hasRAD = function () {
        return !!this._rewardVideo;
    };
    Advertise.prototype.preloadRAD = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arr, i, index, inst, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = this.rads.concat();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 , 12];
                        index = i++ % arr.length;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 10]);
                        return [4 , FBInstant.getRewardedVideoAsync(arr[index])];
                    case 3:
                        inst = _a.sent();
                        return [4 , inst.loadAsync()];
                    case 4:
                        _a.sent();
                        this._rewardVideo = inst;
                        this.emit("rad_ready");
                        return [3 , 12];
                    case 5:
                        e_2 = _a.sent();
                        console.log("ad error", e_2)
                        if (!(e_2.code == "ADS_FREQUENT_LOAD")) return [3 , 7];
                        return [4 , wait(2 * 60 * 1000)];
                    case 6:
                        _a.sent();
                        return [3 , 9];
                    case 7:
                        if (!(e_2.code == "ADS_TOO_MANY_INSTANCES")) return [3 , 9];
                        return [4 , wait(10 * 60 * 1000)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 , 10];
                    case 10: return [4 , wait(index == 2 ? 2 * 60 * 1000 : 5e3)];
                    case 11:
                        _a.sent();
                        return [3 , 1];
                    case 12: return [2 ];
                }
            });
        });
    };
    Advertise.prototype.showRAD = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inst;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inst = this._rewardVideo;
                        if (!!inst) return [3 , 2];
                        return [4 , new Promise(function (resolve, reject) {
                                _this.once("rad_ready", resolve);
                            })];
                    case 1:
                        _a.sent();
                        inst = this._rewardVideo;
                        _a.label = 2;
                    case 2:
                        this._rewardVideo = null;
                        return [4 , inst.showAsync()];
                    case 3:
                        _a.sent();
                        this.preloadRAD();
                        return [2 ];
                }
            });
        });
    };
    return Advertise;
}(Emiter));

//*/
/*
function closure(method, ...args) {
    return (params) => method.apply(null, [args, params]);
}

function wait(duration, callBack) {
    return new Promise((resolve, reject) => {
        let time = null;
        time = setTimeout(() => {
            clearTimeout(time);
            resolve();
            if (callBack) callBack();
        }, duration)
    });
}

class Emiter {

    constructor() {
        this.maps = {};
        this.uid = 0;
        this._duringEmit = false;
    }

    add(name, handler, thisObject, priority, isOnce) {
        thisObject = thisObject || null;
        priority = priority || 0;
        let queue_id = this.uid++;
        let item = this.maps[name] || [];
        item.push([queue_id, handler, thisObject, priority, isOnce]);
        this.maps[name] = item;

        //倒序
        item.sort((a, b) => a[3] < b[3]);

        return queue_id;
    }

    on(name, handler, thisObject , priority ) {
        return this.add(name, handler, thisObject, priority, false);
    }
    once(name, handler, thisObject , priority ) {
        return this.add(name, handler, thisObject, priority, true);
    }

    rm(id, name ) {
        let names = name ? [name] : Object.keys(this.maps);
        for (let name of names) {
            let handlers = this.maps[name];
            if (!handlers) continue;

            if (this._duringEmit) {
                this.maps[name] = handlers = handlers.concat();
            }

            let index = 0;
            while (index < handlers.length) {
                let [queue_id, handler, thisObject, priority, isOnce] = handlers[index];
                if (queue_id == id) {
                    handlers.splice(index, 1)
                    return true;
                } else {index++;}
            }
        }
        return false;
    }

    rmall(name ) {
        if (name == undefined)
            this.maps = {};
        else
            delete this.maps[name];
    }

    emit(name, data ) {
        let handlers = this.maps[name];
        if (handlers && handlers.length > 0) {
            let index = 0;
            while (index < handlers.length) {
                let [queue_id, handler, thisObject, priority, isOnce] = handlers[index];
                isOnce ? handlers.splice(index, 1) : index++;
                this._duringEmit = true;
                let result = handler.call(thisObject, data)
                this._duringEmit = false;
                if (result == Emiter.CONST.break)break
            }
            return true;
        }
        return false;
    }
}
Emiter.CONST = {
    break: {}
};

class Advertise extends Emiter {
    constructor(iads, rads, autoPreload = true) {
        super();

        this.iads = iads
        this.rads = rads

        this._intersitialAd = null
        this._rewardVideo = null

        this.suportAD() && autoPreload &&(this.preloadRAD());
    }

    suportAD() {
        let apis = FBInstant.getSupportedAPIs();
        return apis.indexOf("getRewardedVideoAsync") > -1 && apis.indexOf("getInterstitialAdAsync") > -1
    }

    hasIAD() {
        return !!this._intersitialAd
    }

    async preloadIAD() {
        let arr = this.iads.concat();

        let i = 0;
        while (true) {
            let index = i++ % arr.length;
            try {
                let inst = await FBInstant.getInterstitialAdAsync(arr[index]);
                await inst.loadAsync()
                this._intersitialAd = inst;
                this.emit("iad_ready");
                break;
            } catch (e) {
                if (e.code == "ADS_FREQUENT_LOAD") {
                    await wait(2 * 60 * 1000)
                } else if (e.code == "ADS_TOO_MANY_INSTANCES") {
                    await wait(10 * 60 * 1000)
                }
            }
            await wait(index == 2 ? 2 * 60 * 1000 : 5e3);
        }
    }

    async showIAD() {
        let inst = this._intersitialAd;
        if (!inst) {
            await new Promise((resolve, reject) => {
                this.once("iad_ready", resolve)
            })
            inst = this._intersitialAd
        }
        this._intersitialAd = null;
        await inst.showAsync();
        this.preloadIAD();
    }

    hasRAD() {
        return !!this._rewardVideo
    }

    async preloadRAD() {
        let arr = this.rads.concat()

        let i = 0;
        while (true) {
            let index = i++ % arr.length;
            try {
                let inst = await FBInstant.getRewardedVideoAsync(arr[index]);
                await inst.loadAsync()
                this._rewardVideo = inst;
                this.emit("rad_ready");
                break;
            } catch (e) {
                console.log("ad error", e)
                if (e.code == "ADS_FREQUENT_LOAD") {
                    await wait(2 * 60 * 1000)
                } else if (e.code == "ADS_TOO_MANY_INSTANCES") {
                    await wait(10 * 60 * 1000)
                }
            }
            await wait(index == 2 ? 2 * 60 * 1000 : 5e3);
        }
    }

    async showRAD() {
        let inst = this._rewardVideo;
        if (!inst) {
            await new Promise((resolve, reject) => {
                this.once("rad_ready", resolve)
            })
            inst = this._rewardVideo
        }
        this._rewardVideo = null;
        await inst.showAsync();
        this.preloadRAD();
    }
}*/

//window.yzad_Advertise = Advertise;
//export default Advertise