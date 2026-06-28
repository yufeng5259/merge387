import { _decorator, instantiate, Label, Node, sys } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

const shopIdVIPWeek = 1101;
const shopIdVIPMonth = 1102;
const shopIdVIPYear = 1103;

@ccclass('VIPGetWindow')
export default class VIPGetWindow extends UIWindow {
    public static windowPath = 'VIP/VIPGetWindow';

    @property(Label)
    labelReward100M: Label | null = null;

    @property(Label)
    labelRewardRate: Label | null = null;

    @property(ContentModel)
    spDailyItem: ContentModel | null = null;

    @property(Node)
    spDailyItemParent: Node | null = null;

    @property(Label)
    labelDailyApMax1: Label | null = null;

    @property(Label)
    labelDailyApMax2: Label | null = null;

    @property(Label)
    labelDailyApRec1: Label | null = null;

    @property(Label)
    labelDailyApRec2: Label | null = null;

    @property(Node)
    spButtonNormal: Node | null = null;

    @property(Node)
    spButtonTrial: Node | null = null;

    @property(Label)
    labelPriceWeek: Label | null = null;

    @property(Label)
    labelPriceMonth: Label | null = null;

    @property(Label)
    labelPriceYear: Label | null = null;

    @property(Label)
    labelPriceWeek2: Label | null = null;

    @property(Label)
    labelPriceMonth2: Label | null = null;

    @property(Label)
    labelPriceYear2: Label | null = null;

    shopMetaWeek: any = null;
    shopMetaMonth: any = null;
    shopMetaYear: any = null;

    onShow(showParams: any) {
        if (this.labelReward100M) this.labelReward100M.string = BigNumber.format(100000000);
        if (this.labelRewardRate) this.labelRewardRate.string = '+' + Math.round(G.GameConstance.vipSlotActivityAdd * 100) + '%';

        if (this.spDailyItemParent) this.spDailyItemParent.destroyAllChildren();
        let rewards = Game.Content.FromStrings(G.GameConstance.vipDailyReward);
        rewards.forEach((reward: any) => {
            if (!this.spDailyItem || !this.spDailyItemParent) return;
            let itemHandle = instantiate(this.spDailyItem.node);
            itemHandle.parent = this.spDailyItemParent;
            let contentModel = itemHandle.getComponent(ContentModel);
            if (contentModel) contentModel.show(reward, null);
        });
        if (this.labelDailyApMax1) this.labelDailyApMax1.string = G.GameConstance.apMax.toString();
        if (this.labelDailyApMax2) this.labelDailyApMax2.string = G.GameConstance.vipApMax.toString();
        if (this.labelDailyApRec1) this.labelDailyApRec1.string = G.GameConstance.apRecoverSpins.toString();
        if (this.labelDailyApRec2) this.labelDailyApRec2.string = G.GameConstance.vipApRecoverSpins.toString();

        this.shopMetaWeek = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopIdVIPWeek);
        this.shopMetaMonth = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopIdVIPMonth);
        this.shopMetaYear = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopIdVIPYear);
        if (this.labelPriceWeek) this.labelPriceWeek.string = this.shopMetaWeek.PriceString();
        if (this.labelPriceMonth) this.labelPriceMonth.string = this.shopMetaMonth.PriceString();
        if (this.labelPriceYear) this.labelPriceYear.string = this.shopMetaYear.PriceString();
        if (this.labelPriceWeek2) this.labelPriceWeek2.string = this.shopMetaWeek.PriceString();
        if (this.labelPriceMonth2) this.labelPriceMonth2.string = String.format(GameKit.i18n.t('VipGetTrialButtonDes2'), this.shopMetaMonth.PriceString());
        if (this.labelPriceYear2) this.labelPriceYear2.string = this.shopMetaYear.PriceString();

        if (!AppKit.SdkManager.IsNative() || !AppKit.SdkManager.IsAndroid() || Game.SUserStatus.data.trial || (Game.SUserStatus.data.vipToken != null && Game.SUserStatus.data.vipToken != '')) {
            if (this.spButtonNormal) this.spButtonNormal.active = true;
            if (this.spButtonTrial) this.spButtonTrial.active = false;
        } else {
            if (this.spButtonNormal) this.spButtonNormal.active = false;
            if (this.spButtonTrial) this.spButtonTrial.active = true;
        }
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    onClickInfoSub() {
        if (AppKit.SdkManager.IsIos()) {
            sys.openURL('https://getcoingang.com/scription_ios.html');
        } else {
            sys.openURL('https://getcoingang.com/scription_and.html');
        }
    }

    onClickInfoPri() {
        sys.openURL('https://getcoingang.com/privacy.html');
    }

    onClickWeek() {
        this.BuySubscription(this.shopMetaWeek.Name());
    }

    onClickMonth() {
        this.BuySubscription(this.shopMetaMonth.Name());
    }

    onClickYear() {
        this.BuySubscription(this.shopMetaYear.Name());
    }

    BuySubscription(id: any) {
        AppKit.PaymentWrap.Pay(id, function(this: VIPGetWindow, ok: boolean, res: any) {
            if (ok) {
                GameKit.SoundManager.playSound('item_purchased');

                this.closeAnim();
                if (res.vipDailyReward) {
                    UIRoot.instance.openChildWindow('VIPDailyRewardWindow', { vipDailyReward: res.vipDailyReward });
                }

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'vip', name: id, phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'vip', name: id, phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'vip', name: id, phase: 0 });
    }
}
