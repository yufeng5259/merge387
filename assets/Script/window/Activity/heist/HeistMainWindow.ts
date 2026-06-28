import { UIWindow } from '../../../GameKit/ui/UIWindow';
import ContentModel from '../../../game/items/ContentModel';
// fengyong-2019-9-5
// @ts-check

import HeistData from "./HeistData";

const { ccclass, property } = cc._decorator
const ItemYs = [280, 0, -280, -560]

@ccclass
export default class HeistMainWindow extends UIWindow {

    static windowPath = "Activity/heist/HeistMainWindow";

    /** @type {cc.Label} */
    @property({ tooltip: "", type: cc.Label })
    labelTimer = null

    onShow(params) {
        let activityMeta = params.meta

        HeistData.load_data(activityMeta)

        this.create_buy_item()

        this.update_ui()
        this.bind_ui()

        this.leftTime = 0
        this.update()

        this.init()
    }

    onClose() {
        this.unbind_ui()
        this.buy_item_list.forEach((v, i) => {
            v.reward_layout.getComponentsInChildren(ContentModel).forEach(x => x.onClose())
        })
    }

    update() {
        if (this.leftTime != null) {

            let currentTime = GameKit.TimeUtil.getCurrentTime()

            this.leftTime = HeistData.get_activity_meta().EndTime() - currentTime

            this.labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false)

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }
    }

    bind_ui() {
        //GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ActivityEvent, "HeistMainWindow", () => {
            //this.update_ui()
        //})
    }

    unbind_ui() {
        //GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ActivityEvent, "HeistMainWindow")
    }

    update_ui(isAnim, skipReward) {
        this.buy_item_list.forEach((v, i) => {
            v.btn_buy.interactable = HeistData.get_buy_state(i) === "able-to-buy" || HeistData.get_buy_state(i) === "no-able-to-buy"
            v.buy_lock.active = HeistData.get_buy_state(i) === "buy-enough" || HeistData.get_buy_state(i) === "no-able-to-buy"
            v.bkg2.active = HeistData.get_buy_state(i) === "buy-enough" || HeistData.get_buy_state(i) === "no-able-to-buy"
            if (!v.bkg2.active && isAnim) {
                v.bkg2.active = true
                v.bkg2.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(() => {
                    v.bkg2.opacity = 255
                    v.bkg2.active = false
                })))
            }

            if (!skipReward) {
                v.reward_layout.destroyAllChildren()
                HeistData.get_buy_item_reward_list(i).forEach(reward => {
                    let reward_node = cc.instantiate(v.reward_item)
                    reward_node.parent = v.reward_layout
                    reward_node.active = true
                    reward_node.getComponent(ContentModel).show(reward)
                    if (reward.Type() == Game.Content.Types.RandomPack) reward_node.getChildByName("info").active = true
                })
            }

            v.label_buy_cost.string = HeistData.get_buy_item_price_str(i)
            v.label_buy_cost.node.color = v.btn_buy.interactable?cc.color(255, 255, 255):cc.color(226, 226, 226)
            v.label_buy_cost.node.x = (HeistData.get_buy_item_type(i) === "coin") ? 20 : 0
            v.buy_use_coin.active = HeistData.get_buy_item_type(i) === "coin"
        })
    }

    /** @type {cc.Node[]} */
    @property({ tooltip: "单个购买项目的item", type: cc.Node })
    buy_item = []

    /** @type {{ reward_layout: cc.Node; reward_item: cc.Node; label_buy_cost: cc.Label; label_buy_count: cc.Label; buy_lock: cc.Node; buy_use_coin: cc.Node; bkg2: cc.Node; btn_buy: cc.Button; cannot_buy: cc.Node; }[]} */
    buy_item_list = []

    /** 创建所有的购买项目(一般是3个) */
    create_buy_item() {
        //this.buy_item.active = false
        this.buy_item_list = []
        for (let i = 0; i < 3; i += 1) {
            let n = this.buy_item[i]
            //n.parent = this.buy_item.parent
            n.active = true
            n.y = ItemYs[i]
            let data = {
                node: n,
                reward_layout: GameKit.ControllerTable.GetNode(n, "reward-layout"),
                reward_item: GameKit.ControllerTable.GetNode(n, "reward-item"),
                label_buy_cost: GameKit.ControllerTable.GetNode(n, "label-buy-cost").getComponent(cc.Label),
                label_buy_count: GameKit.ControllerTable.GetNode(n, "label-buy-count").getComponent(cc.Label),
                buy_lock: GameKit.ControllerTable.GetNode(n, "buy-lock"),
                buy_use_coin: GameKit.ControllerTable.GetNode(n, "buy-use-coin"),
                bkg2: GameKit.ControllerTable.GetNode(n, "bkg2"),
                btn_buy: GameKit.ControllerTable.GetNode(n, "btn-buy").getComponent(cc.Button),
                cannot_buy: GameKit.ControllerTable.GetNode(n, "cannot-buy"),
            }
            this.buy_item_list.push(data)
            data.cannot_buy.active = false
            data.btn_buy.clickEvents[0].customEventData = `${i}` // 保存按钮对应的buy-item-index
        }
    }

    /** @type {cc.Node} */
    @property(cc.Node)
    touch_area = null

    init() {
        this.touch_area.on(cc.Node.EventType.TOUCH_START, () => {
            this.buy_item_list.forEach(v => v.cannot_buy.active = false)
            this.touch_area.active = false
        })
        this.touch_area.active = false
    }

    event_close() {
        this.closeAnim()
    }

    event_buy(e, index) {
        index = Number.parseInt(index)
        // 不允许购买
        if (!HeistData.is_buy(index)) {
            this.buy_item_list[index].cannot_buy.active = true
            this.touch_area.active = true
            return
        }

        if (HeistData.get_buy_item_type(index) === "free") {
            GameKit.DataCache.SetData("HijackGetReward", (rewards) => {
                UIRoot.instance.openChildWindow("GetRewardWindow", {contents: rewards, showCallback: (wnd) => {
                    wnd.addOnCloseFunc(this.showNext.bind(this))
                }})
            })
            let sr = SR.SRActivityHeist.activityHeistFreeBuy(HeistData.get_activity_meta_id())
            //sr.SetCallBack(() => {})
            sr.Send()
        } else if (HeistData.get_buy_item_type(index) === "coin") {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, HeistData.get_buy_item_shop_id(index))
            let price = meta.Price()
            if (!Game.ContentCheck.CheckCoin(price, true)) {
                if (this.childWindowChain) {
                    this.clearOnCloseFunc()
                    this.childWindowChain.end()
                }
                this.closeAnim()
                return
            }

            let req = SR.SRShop.payFor(meta.Id())
            req.SetCallBack(function () {
                let sr = SR.SRActivityHeist.activityHeistAddBuyCount(HeistData.get_activity_meta_id())
                sr.SetCallBack(() => {
                    UIRoot.instance.openChildWindow("PaySuccessWindow", { from: "pack", showCallback: (wnd) => {
                        wnd.addOnCloseFunc(this.showNext.bind(this))
                    }})
                    GameKit.SoundManager.playSound("item_purchased")
                })
                sr.Send()
            }.bind(this))
            req.Send()
        } else {
            let shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, HeistData.get_buy_item_shop_id(index))
            AppKit.PaymentWrap.Pay(shopmeta.Name(), function (ok) {
                if (ok) {
                    let sr = SR.SRActivityHeist.activityHeistAddBuyCount(HeistData.get_activity_meta_id())
                    sr.SetCallBack(() => {
                        UIRoot.instance.openChildWindow("PaySuccessWindow", { from: "pack", showCallback: (wnd) => {
                            wnd.addOnCloseFunc(this.showNext.bind(this))
                        } })
                        GameKit.SoundManager.playSound("item_purchased")
                    })
                    sr.Send()

                    AppKit.LogEventWrap.logEvent("ShopDetail", { itemType: "pack", name: shopmeta.Name(), phase: 1 })
                } else {
                    AppKit.LogEventWrap.logEvent("ShopDetail", { itemType: "pack", name: shopmeta.Name(), phase: -1 })
                }
            }.bind(this))

            AppKit.LogEventWrap.logEvent("ShopDetail", { itemType: "pack", name: shopmeta.Name(), phase: 0 })
        }
    }

    showNext() {
        if (HeistData.get_buy_count() > HeistData.get_buy_item_length() - 3) {
            this.update_ui(true, true)
            return
        }
        this.buy_item[0].runAction(cc.sequence(cc.scaleTo(0.3, 0), cc.callFunc(() => {
            this.buy_item[0].scale = 1
            this.buy_item[0].y = ItemYs[1]
            this.buy_item[1].y = ItemYs[2]
            this.buy_item[2].y = ItemYs[3]
            this.update_ui(true)

            this.buy_item[0].runAction(cc.moveTo(0.3, 0, ItemYs[0]))
            this.buy_item[1].runAction(cc.moveTo(0.3, 0, ItemYs[1]))
            this.buy_item[2].runAction(cc.moveTo(0.3, 0, ItemYs[2]))
        })))
    }

}
