import { _decorator, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('PaySuccessWindow')
export default class PaySuccessWindow extends UIWindow {
    public static windowPath = 'Shop/PaySuccessWindow';

    @property(Node)
    spCoin: Node | null = null;

    @property(Node)
    spSpin: Node | null = null;

    @property(Node)
    spPack: Node | null = null;

    @property(Node)
    spTreat: Node | null = null;

    @property(Node)
    spShield: Node | null = null;

    @property(Node)
    spCard: Node | null = null;

    onShow(showParams: any) {
        if (this.spCoin) this.spCoin.active = showParams.from == 'coin';
        if (this.spSpin) this.spSpin.active = showParams.from == 'spin';
        if (this.spPack) this.spPack.active = showParams.from == 'pack';
        if (this.spTreat) this.spTreat.active = showParams.from == 'treat';
        if (this.spShield) this.spShield.active = showParams.from == 'shield';
        if (this.spCard) this.spCard.active = showParams.from == 'card';

        CardChestOpenWindow.tryShow();
    }

    onClose() {

    }

    callClose() {
        this.closeAnim();
    }
}
