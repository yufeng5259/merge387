import { _decorator, Label, Sprite, SpriteFrame, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function fitByHeight(sprite: Sprite | null, height?: number) {
    if (!sprite || !sprite.spriteFrame) return;
    const rect = sprite.spriteFrame.rect;
    const targetHeight = height || sprite.node.getComponent(UITransform)?.height || rect.height;
    if (!rect.height || !targetHeight) return;
    const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
    transform.setContentSize(rect.width * targetHeight / rect.height, targetHeight);
}

@ccclass('CashShopWindow')
export default class CashShopWindow extends UIWindow {
    public static windowPath = 'Shop/CashShopWindow';

    @property(Label)
    labelCash: Label | null = null;

    @property
    shopSVTool: any = null;

    @property([SpriteFrame])
    icons: SpriteFrame[] = [];

    shopItems: Record<string, any> = {};

    onShow(showParams: any) {
        this.shopItems = {};
        let metas = Meta.MetaManager.GetMetas(Meta.MetaType.CashShop);
        for (let id in metas) {
            let meta = metas[id];
            if (Game.SUserVillage.MapId() >= meta.MapId()) this.shopItems[id] = meta;
        }

        this.SetCashNum();

        this.initShopPage();
    }

    onClose() {
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.CashEvent, 'CashShopWindow');
    }

    update(dt: number) {

    }

    callClose() {
        this.closeAnim();
    }

    initShopPage() {
        let ids = Object.keys(this.shopItems);
        if (this.shopSVTool) this.shopSVTool.setItem(ids, this.initShopItem.bind(this));
    }

    initShopItem(index: number, id: any, itemHandle: any) {
        id = parseInt(id);
        let meta = this.shopItems[id];

        let icon = GameKit.ControllerTable.GetComponent(itemHandle, 'icon', Sprite);
        let label = GameKit.ControllerTable.GetComponent(itemHandle, 'label', Label);
        let labelPrice = GameKit.ControllerTable.GetComponent(itemHandle, 'labelPrice', Label);
        let btnBuy = GameKit.ControllerTable.GetNode(itemHandle, 'btnBuy');

        icon.spriteFrame = this.icons[id - 1];
        fitByHeight(icon);

        let item = Game.Content.Merge(meta.Item())[0];
        if (item.Type() == Game.Content.Types.Ap) label.string = `${item.Count().toString()} ${item.Name()}`;
        else if (item.Type() == Game.Content.Types.Coin) label.string = `${GameKit.StringUtil.formatNumber(item.Count())}`;

        labelPrice.string = meta.Price().toString();

        btnBuy.on('click', () => {
            let price = meta.Price();
            if (Game.SUser.Cash() < price) {
                if (GameKit.SoundManager && GameKit.SoundManager.playPurchaseNotEnoughSound) {
                    GameKit.SoundManager.playPurchaseNotEnoughSound();
                }
                DialogWindow.Show(GameKit.i18n.t('CashShopNotEnough'), nullFunction);
                return;
            }

            let req = SR.SRUserData.cashExchange(meta.Id());
            req.SetCallBack(function(this: CashShopWindow) {
                GameKit.SoundManager.playSound('item_purchased');
            }.bind(this));
            req.Send();
        }, this);
    }

    SetCashNum() {
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.CashEvent, 'CashShopWindow', function(this: CashShopWindow, data: any) {
            this.UpdateCashNum();
        }.bind(this));
        this.UpdateCashNum();
    }

    UpdateCashNum() {
        if (this.labelCash) this.labelCash.string = (Math.floor(Game.SUser.Cash() * 100) / 100).toFixed(2);
    }
}
