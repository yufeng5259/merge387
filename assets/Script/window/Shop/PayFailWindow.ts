import { _decorator, sys } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('PayFailWindow')
export default class PayFailWindow extends UIWindow {
    static windowPath = 'Shop/PayFailWindow';

    data: any = null;

    onShow(showParams: any) {
        this.data = showParams.data;
        this.data.platform = sys.os;
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        let url = 'https://getcoingang.com/PurchaseContact/index.html?userId=' + Game.SUser.Id();
        for (let key in this.data) {
            url += '&' + encodeURI(key) + '=' + encodeURI(this.data[key] || 'null');
        }
        sys.openURL(url);
    }
}
