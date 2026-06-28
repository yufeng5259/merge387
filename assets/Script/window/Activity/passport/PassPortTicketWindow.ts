import { _decorator, Button, Label, Node } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('PassPortTicketWindow')
export default class PassPortTicketWindow extends UIWindow {
    static windowPath = 'Activity/passport/PassPortTicketWindow';

    @property([Node])
    items: Node[] = [];

    buy_item_list: any[] = [];

    onShow(showParams: any) {
        let metas = Meta.PassPortShopMeta.GetMetasByType(Meta.PassPortShopMeta.Type.Ticket);
        this.buy_item_list = [];
        for (let i = 0; i < this.items.length; i += 1) {
            let n = this.items[i];
            let m = metas[i];
            n.active = true;
            let data = {
                node: n,
                btn_buy: GameKit.ControllerTable.GetNode(n, 'Button - Pay').getComponent(Button),
                label_buy_cost: GameKit.ControllerTable.GetNode(n, 'Label').getComponent(Label),
                m: m,
            };
            let shopID = m.ShopID();
            let smeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopID);
            data.label_buy_cost.string = smeta.PriceString();

            this.buy_item_list.push(data);
            data.btn_buy.clickEvents[0].customEventData = `${i}`;
        }
    }

    callBuy(e: any, index: any) {
        if (GamePlay.instance.isBusy()) return;
        let data = this.buy_item_list[index];
        let shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, data.m.ShopID());
        AppKit.PaymentWrap.Pay(shopmeta.Name(), function(ok, res) {
            if (ok) {
                GameKit.SoundManager.playSound('item_purchased');
                let sr = SR.SRActivityPassport.buyPassport(data.m.AddLevel());
                sr.SetCallBack((res) => {
                    UIRoot.instance.GetWindow('PassPortMainWindow').callPurchaseOver();
                    GameKit.SoundManager.playSound('item_purchased');

                    this.call_close();
                });
                sr.Send();

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'Passport', name: shopmeta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'Passport', name: shopmeta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'Passport', name: shopmeta.Name(), phase: 0 });
    }

    call_close() {
        this.closeAnim();
    }
}
