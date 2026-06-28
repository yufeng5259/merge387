
var TimeUtil = {
    serverdelta: 0,
    
    //从0时间开始的第几秒
    _getCurrentTime: function () {
        let d = new Date()
        return d.getTime() / 1000
    },
    getCurrentTime: function () {
        return this._getCurrentTime() + this.serverdelta
    },
    UpdateServerTime: function(st) {
        this.serverdelta = st - this._getCurrentTime()
    },

    //从0时间开始的第几天
    getCurrentDay: function (t) {
        t = t || this.getCurrentTime()
        let day = Math.floor((t + this.TimeZoneInSecond) / this.DayInSecond)
        return day
    },

    //从0时间开始的第几个半天
    getCurrentHalfDay: function (t) {
        t = t || this.getCurrentTime()
        let hfday = Math.floor((t + this.TimeZoneInSecond) / (this.DayInSecond / 2))
        return hfday
    },

    //从0时间开始的第几周
    getCurrentWeek: function(t) {
        t = t || this.getCurrentTime()
        let week = Math.floor((t - 4 * this.DayInSecond + this.TimeZoneInSecond) / this.WeekInSecond)
        return week
    },

    //从0时间开始的第几月
    getCurrentMonth: function(t) {
        let date = new Date()
        return (date.getFullYear() - 1970) * 12 + date.getMonth()
    },
}

TimeUtil.MinuteInSecond = 60
TimeUtil.HourInSecond = 60 * TimeUtil.MinuteInSecond
TimeUtil.DayInSecond = 24 * TimeUtil.HourInSecond
TimeUtil.WeekInSecond = 7 * TimeUtil.DayInSecond

TimeUtil.TimeZoneInSecond = -(new Date()).getTimezoneOffset() / 60 * TimeUtil.HourInSecond
TimeUtil.specialUItime = [53, 89, 121, 109, 53, 76, 113, 69, 53, 52, 117, 51, 53, 76, 105, 67, 53, 54, 105, 90, 53, 54, 97, 89, 53, 111, 113, 52, 53, 112, 50, 112, 54, 90]

//补0
var pad = function() {  
    var tbl = [];  
    return function(num, n) {  
      var len = n-num.toString().length;  
      if (len <= 0) return num;  
      if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');  
      return tbl[len] + num;  
    }  
}();

TimeUtil.FormatTime = function(t) {
    t = t || this.getCurrentTime()
    let date = new Date((t + new Date().getTimezoneOffset() * this.MinuteInSecond + TimeUtil.TimeZoneInSecond) * 1000)
    let y = date.getFullYear()
    let mo = date.getMonth()
    let d = date.getDate()
    let h = date.getHours()
    let mi = date.getMinutes()
    let s = date.getSeconds()
    let ms = date.getMilliseconds()
    return {year:y, month:mo, day:d, hour:h, minute:mi, second:s, millisecond:ms}
}

TimeUtil.GetRemainTimeTable = function(rem) {
    if (rem < 0) rem = 0
    rem = rem || 0
    let day = Math.floor(rem / this.DayInSecond)
    rem -= day * this.DayInSecond
    let hour = Math.floor(rem / this.HourInSecond)
    rem -= hour * this.HourInSecond
    let minute = Math.floor(rem / this.MinuteInSecond)
    rem -= minute * this.MinuteInSecond
    let second = Math.floor(rem)
    return {day:day,hour:hour,minute:minute,second:second}
}

//格式化剩余时间 eg:1天 12:12:12
//fullhour 为 true 时 保留小时数
TimeUtil.FormatRemainTimeSimple = function(rem, withday = true, fullhour = false) {
    let table = this.GetRemainTimeTable(rem)
    if (table.day > 0 && withday) {
        return String.format(GameKit.i18n.t("CountDay"), table.day) + " " + pad(table.hour, 2) + ":" + pad(table.minute, 2) + ":" + pad(table.second, 2)
    } else {
        if (fullhour || table.hour > 0 || (!withday && table.day > 0)) {
            return pad(withday?table.hour:table.day * 24 + table.hour, 2) + ":" + pad(table.minute, 2) + ":" + pad(table.second, 2)
        } else {
            if (table.minute > 0) {
                return pad(table.minute, 2) + ":" + pad(table.second, 2)
            } else {
                return "0:" + pad(table.second, 2)
            }
        }
    }
}

//格式化过去时间 eg:1天前, 12小时前
TimeUtil.FormatPastTime = function(rem, withMinute, withSecond) {
    let table = this.GetRemainTimeTable(rem)
    if (table.day > 0) {
        return String.format(GameKit.i18n.t("PastDay"), table.day)
    } else if (table.hour > 0) {
        return String.format(GameKit.i18n.t("PastHour"), table.hour)
    } else if (table.minute > 0 && withMinute) {
        return String.format(GameKit.i18n.t("PastMinute"), table.minute)
    } else if (table.second > 0 && withSecond) {
        return String.format(GameKit.i18n.t("PastSecond"), table.second)
    }
    return GameKit.i18n.t("PastZero")
}

//格式化时间段 eg:1天, 12小时
TimeUtil.FormatSomeTime = function(rem, withMinute, withSecond) {
    let table = this.GetRemainTimeTable(rem)
    if (table.day > 0) {
        return String.format(GameKit.i18n.t("SomeDay"), table.day)
    } else if (table.hour > 0) {
        return String.format(GameKit.i18n.t("SomeHour"), table.hour)
    } else if (table.minute > 0 && withMinute) {
        return String.format(GameKit.i18n.t("SomeMinute"), table.minute)
    } else if (table.second > 0 && withSecond) {
        return String.format(GameKit.i18n.t("SomeSecond"), table.second)
    }
    return GameKit.i18n.t("SomeZero")
}

// 将秒数转换为格式化的时间文字，如 "1天 12小时 30分 15秒"
TimeUtil.FormatSecondsToText = function(seconds) {
    if (seconds === undefined || seconds === null || seconds < 0) seconds = 0
    let table = this.GetRemainTimeTable(seconds)
    let parts = []
    if (table.day > 0) parts.push(String.format(GameKit.i18n.t("SomeDay"), table.day))
    if (table.hour > 0) parts.push(String.format(GameKit.i18n.t("SomeHour"), table.hour))
    if (table.minute > 0) parts.push(String.format(GameKit.i18n.t("SomeMinute"), table.minute))
    parts.push(String.format(GameKit.i18n.t("SomeSecond"), table.second))
    return parts.join(' ')
}

export default TimeUtil