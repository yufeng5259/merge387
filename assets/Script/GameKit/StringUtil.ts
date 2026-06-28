import { v2 } from 'cc';

var StringUtil: any = {}


StringUtil.getRandomString = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oO,9gq,Vv,Uu,LlI1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

var dot_i18n: any = { //多语言 千分符
    "en": ',',
    "de": '.',
    "es": '.',
    "fr": ' ',
    "zh": ',',
    "ar": '٬',
}
//add ',' per 3 numbers
StringUtil.formatNumber = function(n) {
    let dot = dot_i18n[GameKit.i18n.getLang()]
    let str = n.toString()
    let dotPos = str.indexOf('.')
    if (str.length > 3) {
        for (let i = (dotPos>=0?dotPos:str.length) - 3; i > 0; i-=3) {
            str = str.insert(i, dot)
        }
    }
    return str
}

//string <=> Vec2
StringUtil.Vec2ToString = function(p) {
    return "(" + p.x.toString() + "," + p.y.toString() + ")"
}
StringUtil.Vec2FromString = function(s) {
    let st = s.substr(1, s.length - 2)
    let sts = st.split(",")
    let px = Number(sts[0])
    let py = Number(sts[1])
    return v2(px, py)
}

StringUtil.VersionOver = function(ver1, ver2) {
    ver1 = ver1 || "0"
    ver2 = ver2 || "0"
    let s = ver1.split('.')
    let v = ver2.split('.')
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

export default StringUtil
