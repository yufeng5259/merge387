/** @author fengyong-2019-5-15 */

import CardModel from "./CardModel";
import { _decorator, Button, Label, Node } from 'cc';
import { UIWindow } from "../../GameKit/ui/UIWindow";

const { ccclass, property } = _decorator
const C = {

}

@ccclass('CardAskSendWindow')
export default class CardAskSendWindow extends UIWindow {

    static windowPath = "Card/CardAskSendWindow"

    /** @type {CardMeta} */
    card_meta = null

    /** @type {CardMeta} */
    set_meta = null

    onShow(showParams) {
        // 获取数据
        this.card_meta = showParams.card_meta
        // 更新样式
        this.card.show(this.card_meta.Id())
        this.btn_ask.node.active = Game.SUserCard.CardNum(this.card_meta.Id()) <= 0
        this.btn_send.node.active = Game.SUserCard.CardNum(this.card_meta.Id()) > 0
        this.cannot.active = false
        this.set_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.card_meta.SetId())
    }

    onClose() {
        this.card.onClose()
    }

    /** @type {CardModel} */
    @property(CardModel)
    card = null

    /** @type {Button} */
    @property(Button)
    btn_ask = null

    /** @type {Button} */
    @property(Button)
    btn_send = null

    /** @type {Node} */
    @property(Node)
    cannot = null

    /** @type {Label} */
    @property(Label)
    label_cannot_reason = null

    event_close() {
        this.closeAnim()
    }

    event_ask() {
        if (this.card_meta.CantSend()) {
            this.cannot.active = true
            this.label_cannot_reason.string = GameKit.i18n.t("CardAskCannot")
            if (this.card_meta.Golden()) { this.label_cannot_reason.string = GameKit.i18n.t("CardAskCannotGolden") }
            return
        }
        //活动卡牌不能索取
        if (this.set_meta.IsActivityCard()) {
            this.cannot.active = true
            this.label_cannot_reason.string = GameKit.i18n.t("CardAskCannot")
            return 
        }
        // this.closeAnim()
        AppKit.ShareWrap.shareScreen(GameKit.i18n.t("ShareJigsawTitle"), {x:0, y:0, width:640, height:1136}, {}, null, "cardask")
    }

    event_send() {
        if (this.card_meta.CantSend()) {
            this.cannot.active = true
            this.label_cannot_reason.string = GameKit.i18n.t("CardSendCannot")
            if (this.card_meta.Golden()) { this.label_cannot_reason.string = GameKit.i18n.t("CardSendCannotGolden") }
            return
        }
        if (!Game.SUserCard.CheckDailyLimit()) {
            this.cannot.active = true
            this.label_cannot_reason.string = GameKit.i18n.t("CardSendCannotLimit")
            return
        }
        if (Game.SUserCard.CardNum(this.card_meta.Id()) <= 1) {
            this.cannot.active = true
            this.label_cannot_reason.string = GameKit.i18n.t("CardSendCannotLeast")
            return
        }
        //活动卡牌不能赠送
        if (this.set_meta.IsActivityCard()) {
            this.cannot.active = true
            this.label_cannot_reason.string = GameKit.i18n.t("CardSendCannot")
            return 
        }
        this.closeAnim()
        UIRoot.instance.openChildWindow("CardSelectFriendWindow", { card_meta: this.card_meta })
    }
}
