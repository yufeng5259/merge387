export default class ClockUtil {
    private static _data: Record<string, any> = {};
    private static intervalID: any = null;

    static Clear() {
        ClockUtil._data = {};
        if (ClockUtil.intervalID) {
            clearInterval(ClockUtil.intervalID);
            ClockUtil.intervalID = null;
        }
    }

    static init() {
        var TimeUtil = GameKit.TimeUtil;
        var callb = function() {
            let ctime = TimeUtil.FormatTime();
            let hour = ctime.hour;
            let minute = ctime.minute;
            for (let key in ClockUtil._data) {
                let d = ClockUtil._data[key];
                if (d.hour == hour && d.minute == minute) {
                    if (d.callback) d.callback();
                }
            }
        };
        setTimeout(() => {
            ClockUtil.intervalID = setInterval(function() {
                callb();
            }, TimeUtil.MinuteInSecond * 1000);
            callb();
        }, (TimeUtil.MinuteInSecond - TimeUtil.FormatTime().second) * 1000 + 300);
    }

    static RegisterClock(key: string, hour: number, minute: number, callback: any) {
        ClockUtil._data[key] = ({ key: key, hour: hour, minute: minute, callback: callback });
    }

    static UnRegister(key: string) {
        ClockUtil._data[key] = null;
        delete ClockUtil._data[key];
    }
}
