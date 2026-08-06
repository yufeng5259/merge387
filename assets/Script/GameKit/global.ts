//全局变量 函数
const G = {

    // Returns a random integer between min (included) and max (excluded)
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    },
    getRandomFloat: function (min, max) {
        return Math.random() * (max - min) + min
    },
    
    /** 获取数组中的随机一项，概率相同 */
    getRandomArrayObejct: function(array){
        return array[this.getRandomInt(0,array.length)]
    },

    _rseed: 10,
    setSeed: function(s) {
        G._rseed = s
    },
    getSeededRandom: function(min = 0, max = 1) {
        min = min || 0
        max = max || 1
        G._rseed = (G._rseed * 9301 + 49297) % 233280
        var rnd = G._rseed / 233280.0
        return min + rnd * (max - min)
    },
    getSeededRandomInt: function(min = 0, max = 1) {
        return Math.floor(G.getSeededRandom() * (max - min)) + min
    },

    generateUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },

    Try: function(func) {
        try{
            func()
        }catch(e){}
    },

    IsMergeTutorialFinished: function() {
        return !!(Game && Game.MergeTutorialManager && Game.MergeTutorialManager.IsFinished && Game.MergeTutorialManager.IsFinished())
    },

    ObjectCopy(o) {
        let no = {}
        for (let key in o) {
            no[key] = o[key]
        }
        return no
    },

    GameConstance: {
        
    },

    Constance: {
        loadingTime: 30,
        AndroidBundleCall: "com/goldaxe/merge/",
    },

    GameConfig: {
        //portal: "http://172.16.7.22:3005/app_info",
        // portal: "http://172.16.7.22:8080/app_info",//罗成
        // portal: "http://47.239.214.182:10002/app_info",
        // portal: "http://172.16.9.95:10002/app_info",//李长海
        portal: "http://mq-mergegame.magicvision.tech/test/app_info.txt",//测试服
        // portal: "http://47.239.214.182:3005/app_info",//测试服
        RemoteDownloadServer: "http://mq-mergegame.magicvision.tech/test/hotupdate/",
        storyPortal:"http://mq-mergegame.magicvision.tech/test/storyData/mapstory",
        appId: "1484360103",
        version: "0.0.1",
        huversion: "99",

        useYzAd: true,
        adSpinCount: 10,
        adCoinCount: 10,

        leastRateStar: 5,
    },
    
    SKYFOXGAME: "SKYFOXGAME",
};

(window as any).G = G

export default G
