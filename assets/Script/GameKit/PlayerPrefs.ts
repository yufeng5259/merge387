import { sys } from 'cc';

var PlayerPrefs: any = {}

PlayerPrefs.SetString = function(key, data) {
    let codeKey = Game.SUser.Id().toString() + (key);
    let codeData = (data);
    sys.localStorage.setItem(codeKey, codeData);
}

PlayerPrefs.GetString = function(key, defaultValue = "") {
    let codeKey = Game.SUser.Id().toString() + (key);
    let str = sys.localStorage.getItem(codeKey);
    if (str == null) str = defaultValue
    return (str);
}

PlayerPrefs.SetInt = function(key, data) {
    let codeData = (data.toString());
    PlayerPrefs.SetString(key, codeData);
}

PlayerPrefs.GetInt = function(key, defaultValue = 0) {
    let str = PlayerPrefs.GetString(key, (defaultValue.toString()));
    str = (str);
    let result = defaultValue;
    if (!isNaN(parseInt(str))) {
        result = parseInt(str);
    }
    else {
        result = defaultValue;
    }
    return result;
}

PlayerPrefs.SetFloat = function(key, data) {
    let codeData = (data.toString());
    PlayerPrefs.SetString(key, codeData);
}

PlayerPrefs.GetFloat = function(key, defaultValue = 0) {
    let str = PlayerPrefs.GetString(key, (defaultValue.toString()));
    str = (str);
    let result = defaultValue;
    if (!isNaN(parseFloat(str))) {
        result = parseFloat(str);
    }
    else {
        result = defaultValue;
    }
    return result;
}

PlayerPrefs.SetBool = function(key, data) {
    PlayerPrefs.SetInt(key, data?1:0);
}

PlayerPrefs.GetBool = function(key, defaultValue = false) {
    if (PlayerPrefs.GetInt(key, -1) === -1) {
        return defaultValue;
    }
    return PlayerPrefs.GetInt(key, 0) > 0;
}

PlayerPrefs.SetObject = function(key, data) {
    let codeData = (JSON.stringify(data));
    PlayerPrefs.SetString(key, codeData);
}

PlayerPrefs.GetObject = function(key, defaultValue = null) {
    let str = null;
    if(defaultValue){
        str = PlayerPrefs.GetString(key, (JSON.stringify(defaultValue)));
    }
    str = (str);
    let result = defaultValue;
    if (str) {
        result = JSON.parse(str);
    }
    return result;
}

PlayerPrefs.DeleteKey = function(key) {
    let codeKey = Game.SUser.Id().toString() + (key);
    sys.localStorage.removeItem(codeKey);
}

PlayerPrefs.HasKey = function(key) {
    let codeKey = Game.SUser.Id().toString() + (key);
    return Object.prototype.hasOwnProperty.call(sys.localStorage, codeKey);
}

PlayerPrefs.SetLastString = function(key, data) {
    let codeKey = key;
    let codeData = (data);
    sys.localStorage.setItem(codeKey, codeData);
}

PlayerPrefs.GetLastString = function(key, defaultValue = "") {
    let codeKey = key;
    let str = sys.localStorage.getItem(codeKey);
    if (str == null) str = defaultValue
    return (str);
}

export default PlayerPrefs
