var BigNumber = {}

/** 数字单位 千进制 */
BigNumber.formatUnit_i18n = { //多语言
    "en": ['', 'K', 'M', 'B', 'T', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    "de": ['', 'Tsd', 'Mio', 'Mrd', 'Bio', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    "es": ['', 'K', 'M', 'MRD', 'B', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    "fr": ['', 'k', 'M', 'Md', 'Bn', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    "zh": ['', 'K', 'M', 'B', 'T', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    "ar": ['', 'ألف', 'مليو', 'مليا', 'ترليو', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'], // String.fromCharCode(8235) String.fromCharCode(8236)
}
BigNumber.formatUnit = BigNumber.formatUnit_i18n["en"]

BigNumber.dot_i18n = { //多语言
    "en": '.',
    "de": ',',
    "es": ',',
    "fr": ',',
    "zh": '.',
    "ar": '٫',
}
BigNumber.dot = BigNumber.dot_i18n["en"]

BigNumber.setLanguage = function() {
    if (!GameKit || !GameKit.i18n) return
    let lang = GameKit.i18n.getLang()
    BigNumber.formatUnit = BigNumber.formatUnit_i18n[lang] || BigNumber.formatUnit_i18n["en"]
    BigNumber.dot = BigNumber.dot_i18n[lang] || BigNumber.dot_i18n["en"]
}
setTimeout(() => {
    BigNumber.setLanguage()
}, 100);

/** 转为简单字符串（100K, 10K, 1K）*/
BigNumber.format = function(a) {
    if (typeof a !== 'string') a = a.toString()
    let len = a.length
    if (len < 4) return a
    let unitId = Math.floor((len - 1) / 3)
    let lenHigh = len - unitId * 3
    let sa = a.substr(0, 3);
    if(lenHigh < 3) sa = sa.insert(lenHigh, BigNumber.dot)
    if (sa.endsWith(BigNumber.dot + "00")) sa = sa.replace(BigNumber.dot + "00", "")
    else if (sa.endsWith(BigNumber.dot + "0")) sa = sa.replace(BigNumber.dot + "0", "")
    else if (sa.contains(BigNumber.dot) && sa.endsWith("0")) sa = sa.substr(0, sa.length - 1)
    //if (GameKit.i18n.isLangRight()) return this.formatUnit[unitId] + sa
    return sa + this.formatUnit[unitId]
}
/** 转为三位简单字符串（100K, 10.0K, 1.00K）*/
BigNumber.formatThree = function(a) {
    if (typeof a !== 'string') a = a.toString()
    let len = a.length
    if (len < 4) return a
    let unitId = Math.floor((len - 1) / 3)
    let lenHigh = len - unitId * 3
    let sa = a.substr(0, 3);
    if(lenHigh < 3) sa = sa.insert(lenHigh, BigNumber.dot)
    //if (GameKit.i18n.isLangRight()) return this.formatUnit[unitId] + sa
    return sa + this.formatUnit[unitId]
}
/** 转为完整数字字符串 */
BigNumber.fromFormat = function(a) {
    if (typeof a !== 'string') a = a.toString()
    let unitId = 0
    let unit = '__'
    for (let i = 1;i<this.formatUnit.length;i++) {
        if (a.contains(this.formatUnit[i])) {
            unit = this.formatUnit[i]
            unitId = i
            break
        }
    }
    let sa = a.replace(unit, '')
    sa = sa.replace(BigNumber.dot, '.')
    let nsa = Number(sa)
    let zeroNum = unitId * 3
    while (!Number.isInteger(nsa) && zeroNum > 0) {
        nsa *= 10
        zeroNum--
    }
    sa = nsa.toString()
    for (let i = 0; i < zeroNum; i++) sa += '0'
    return sa
}

/** 是否是负数 */
BigNumber.isMinus = function(a) {
    if (typeof a !== 'string') a = a.toString()
    if (a == '-0') return false
    return a[0] === '-'
}

/** 求负数 */
BigNumber.makeMinus = function(a) {
    if (typeof a !== 'string') a = a.toString()
    if (a == '-0' || a == "0") return "0"
    if (a[0] === '-') return a.replace('-', '')
    return '-' + a
}

/** 比较 大于返回1 等于返回0 小于返回-1 */
BigNumber.compare = function(a, b) {
    if (typeof a !== 'string') a = a.toString()
    if (typeof b !== 'string') b = b.toString()
    if (a === b) return 0
    if (this.isMinus(a) && !this.isMinus(b)) return -1
    if (!this.isMinus(a) && this.isMinus(b)) return 1
    if (this.isMinus(a) && this.isMinus(b)) return -this._compare(a.replace('-', ''), b.replace('-', ''))
    return this._compare(a, b)
}
BigNumber._compare = function(a, b) {
    const lena = a.length;
    const lenb = b.length;
    if (lena > lenb) return 1
    if (lena < lenb) return -1
    for (let i = 0; i < lena; i++) {
        if (parseInt(a[i]) > parseInt(b[i])) return 1
        if (parseInt(a[i]) < parseInt(b[i])) return -1
    }
    return 0
}

/** 相加 */
BigNumber.add = function(a, b) {
    if (typeof a !== 'string') a = a.toString()
    if (typeof b !== 'string') b = b.toString()
    let minusa = this.isMinus(a)
    let minusb = this.isMinus(b)
    if(minusa && !minusb){
        a = a.substr(1);
        return this.minus(b,a);
    }
    else if(!minusa && minusb){
        b = b.substr(1);
        return this.minus(a,b);
    }
    var sign = "";
    if (minusa && minusb) sign = "-"
    if(minusa) a=a.substr(1);
    if(minusb) b=b.substr(1);
    var res='', c=0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c){
        c += ~~a.pop() + ~~b.pop();
        res = c % 10 + res;
        c = c>9;
    }
    if (res == 0) return "0"
    return sign + res.replace(/^0+/,'');
}

/** 相减 */
BigNumber.minus = function (a, b) {
    let minusa = this.isMinus(a)
    let minusb = this.isMinus(b)
    if(minusa && !minusb){
        return this.add(a, this.makeMinus(b));
    }
    else if(!minusa && minusb){
        b = b.substr(1);
        return this.add(a,b);
    }
    var sign = "";
    if(this.compare(a,b) < 0){
        var temp = b;
        b = a;
        a = temp;
        sign = "-";
    }
    var borrow = 0; /*借位值*/
    var minusArr = [];
    var len = Math.max(a.length, b.length); /*取得位数较大的一个数的位数*/
    var aArr = a.split('').reverse();
    var bArr = b.split('').reverse(); /*利用倒序数组存储*/
    var digMinus;
    var digA = 0
    var digB = 0
    for(var i=0;i<=len-1;i++){
        digA = parseInt(aArr[i]) || 0;
        digB = parseInt(bArr[i]) || 0;
        if(i == len-1){
            if(digA - borrow <= digB){ /*最高位不够减直接跳出循环*/
                break;
            }
        }
        digMinus = digA - digB - borrow;
        borrow = 0;
        if(digMinus < 0){
            digMinus += 10
            borrow = 1;
        }
        minusArr.unshift(digMinus);
    }
    return sign + minusArr.join('').replace(/^0+/,'');
}

/** 相乘 */
BigNumber.mul = function(a, b) {
    if (typeof a !== 'string') a = a.toString()
    if (typeof b !== 'string') b = b.toString()
    let minusa = this.isMinus(a)
    let minusb = this.isMinus(b)
    var sign = "";
    if (minusa || minusb) sign = "-"
    if (minusa && minusb) sign = ""
    if(minusa) a=a.substr(1);
    if(minusb) b=b.substr(1);
    var str1,str2,len1,len2,maxlen,result = [];
    str1 = a.split("").reverse(); 
    str2 = b.split("").reverse();
    len1 = str1.length;
    len2 = str2.length;

    //因为要在下一步做累加，如果不初始化为0,result[]中的值会变为NaN
    //因为未初始化的数组中的值为undefined
    for(var i = 0;i < len1;i++)
        for(var j = 0;j < len2;j++)
            result[i + j] = 0;
    for(var i = 0;i < len1;i++)
        for(var j = 0;j < len2;j++)
            //根据乘法的手动计算方式，在上下相同位上会有相加
            result[i + j] += parseInt(str1[i]) * parseInt(str2[j]);
    var n = result.length;
    for(var k = 0;k < n;k++)
    {
        var temp = result[k];
        if(temp >= 10)
        {
            result[k] = temp % 10;
            //JS中的"/"不是除法取整，会取得小数，所以要用Math.floor()
			if (result[k + 1] == null) result[k + 1] = 0
            result[k + 1] +=  Math.floor(temp / 10);
        }
    }
    return sign + result.reverse().join("");
}

global.BigNumber = BigNumber