import { _decorator, Label } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ApNotEnoughDialogWindow')
export default class ApNotEnoughDialogWindow extends UIWindow {
    static windowPath = 'Shop/ApNotEnoughDialogWindow';

    @property(Label)
    labelAp: Label | null = null;

    @property(Label)
    labelPrice: Label | null = null;

    onShow(showParams: any) {
        let req = SR.SRShop.GetCashBuyInfo();
        req.SetCallBack((res) => {
            console.log('cash buy info', res);
            this.labelAp.string = '+' + 100;
            this.labelPrice.string = '20';
        });
        req.Send();
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callBuy() {
        console.log('buy protocol');
    }
}
