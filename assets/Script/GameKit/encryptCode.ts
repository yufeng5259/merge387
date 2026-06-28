window.encryptCode = {}

encryptCode.encrypt = function(code){ //对字符串进行加密
    if (code.length < 0) return ""
    var c=String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++)
    {
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }
    return c;   
}  

encryptCode.decrypt = function(code){
    if (code.length < 0) return "" 
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++)
    {
     c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
    return c;
}  

encryptCode.stringToBytes = function(str) {  
    var bytes = [];  
    var len, c;  
    len = str.length;  
    for(var i = 0; i < len; i++) {  
        c = str.charCodeAt(i);  
        bytes.push(c)
    }  
    return bytes;  
}  
encryptCode.stringToArrayBuffer = function(str) {  
    var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
    }
    return buf;
}  
encryptCode.stringToUint8Array = function(str, by16bit = false) {
    var bytes = [];  
    var len, c;  
    len = str.length;  
    for(var i = 0; i < len; i++) {  
        c = str.charCodeAt(i);  
        if (by16bit) bytes.push((c & 0xff00) >> 8);
        bytes.push(c & 0x00ff);
    }  

    var uint8Array = new Uint8Array(bytes);
    return uint8Array
}

encryptCode.bytesToString = function(arr) {  
    if(typeof arr === 'string') {  
        return arr;  
    }  
    var str = '',  
        _arr = arr;  
    for(var i = 0; i < _arr.length; i++) {  
        str += String.fromCharCode(_arr[i]); 
    }  
    return str;  
}  
encryptCode.arrayBufferToString = function(arr) {  
    let array = new Uint16Array(arr)
    var res = '';
    var chunk = 8 * 1024;
    var i;
    for (i = 0; i < array.length / chunk; i++) {
    res += String.fromCharCode.apply(null, array.subarray(i * chunk, (i + 1) * chunk));
    }
    res += String.fromCharCode.apply(null, array.subarray(i * chunk));
    return res;
}
encryptCode.Uint8ArrayToString = function(arr, by16bit = false){
    var dataString = "";
    if (by16bit) {
        for (var i = 0; i < arr.length-1; i+=2) {
            dataString += String.fromCharCode((arr[i] << 8) + arr[i+1]);
        }
    } else {
        for (var i = 0; i < arr.length; i++) {
            dataString += String.fromCharCode(arr[i]);
        }
    }
    return dataString
}

let simplecodeKey = [0x3d, 0x25, 0x97, 0x29, 0x74, 0x4a, 0xe3, 0xc0, 0x92, 0x31, 0x84, 0x2e, 0x3a];
encryptCode.simplecode = function(str) {
    let bytes = this.stringToBytes(str)
    if (bytes == null) {
        return null;
    }
    let len = bytes.length;
    for (let i = 0; i < len; i++) {
        bytes[i] ^= simplecodeKey[i%simplecodeKey.length];
    }
    return this.bytesToString(bytes);
}
encryptCode.simbas = function(r) {return encryptCode.simplecode(Base64.decode(r))}

encryptCode.getCodedId = function(id) {
    var re = ""
    var i=1
    id.toString().split("").forEach(x=>{re+=String.fromCharCode(parseInt(x)*i+33);i++})
    return re;
}
encryptCode.decodedId = function(codedId) {
    var re = ""
    for (let i = 0; i < codedId.length; i++) {re += ((codedId.charCodeAt(i)-33)/(i+1)).toString()}
    return parseInt(re);
}