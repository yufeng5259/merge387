import { _decorator, Label, Sprite } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('FirstPurchaseWindow')
export default class FirstPurchaseWindow extends UIWindow {
    public static windowPath = 'Shop/FirstPurchaseWindow';

    @property(Sprite)
    icon1: Sprite | null = null;

    @property(Label)
    num1: Label | null = null;

    @property(Sprite)
    icon2: Sprite | null = null;

    @property(Label)
    num2: Label | null = null;

    @property(Sprite)
    icon3: Sprite | null = null;

    @property(Label)
    num3: Label | null = null;

    onShow() {
        let rewards = Game.Content.Merge(Game.Content.FromStrings(G.GameConstance.firstPurchaseReward));

        if (this.icon1 && this.num1) {
            rewards[0].Icon(this.icon1);
            this.num1.string = this.formatNum(rewards[0].Count());
            this.icon1.node.on('click', function(this: FirstPurchaseWindow) {
                UIRoot.instance.openChildWindow('ContentDesWindow', { content: rewards[0] });
            }.bind(this), this);
        }

        if (this.icon2 && this.num2) {
            rewards[1].Icon(this.icon2);
            this.num2.string = this.formatNum(rewards[1].Count());
            this.icon2.node.on('click', function(this: FirstPurchaseWindow) {
                UIRoot.instance.openChildWindow('ContentDesWindow', { content: rewards[1] });
            }.bind(this), this);
        }

        if (this.icon3 && this.num3) {
            rewards[2].Icon(this.icon3);
            this.num3.string = this.formatNum(rewards[2].Count());
            this.icon3.node.on('click', function(this: FirstPurchaseWindow) {
                UIRoot.instance.openChildWindow('ContentDesWindow', { content: rewards[2] });
            }.bind(this), this);
        }

        AppKit.LogEventWrap.logEvent('window_firstpurchase');
    }

    formatNum(num: any) {
        if (num < 1000) {
            return GameKit.i18n.t('multiplyx') + num.toString();
        }
        return BigNumber.format(num);
    }

    callBuy() {
        this.closeAnim(() => {
            UIRoot.instance.openChildWindow('ShopWindow');

            AppKit.LogEventWrap.logEvent('openshop_firstpurchase');
        });
    }

    close_window() {
        this.closeAnim();
    }
}
