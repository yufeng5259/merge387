import { UIWindow } from '../../GameKit/ui/UIWindow';
// fengyong-2019-6-24
//// @ts-check

import CardModel from "./CardModel";

const { ccclass, property } = cc._decorator
const C = {

}

@ccclass
export default class CardCollectWindow extends UIWindow {

    static windowPath = "Card/CardCollectWindow";

    /** @type {CardModel} */
    @property(CardModel)
    card_model = null

    /** @type {cc.Label} */
    @property(cc.Label)
    label_des = null

    /** @type {cc.Node} */
    @property(cc.Node)
    btn_go = null

    /** @type {cc.Node} */
    @property(cc.Node)
    sp_vip = null
    
    onShow(showParams) {
        this.id = showParams.id
        this.meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, this.id)

        if (showParams.nogo) this.btn_go.active = false
        this.sp_vip.active = !!showParams.isVip

        this.load_page()
    }

    onClose() {
        this.card_model.onClose()
    }

    load_page() {
        this.card_model.show(this.id, "no-check")
        this.label_des.string = String.format(GameKit.i18n.t("CardCollectDes"), this.meta.Name())
    }

    event_close() {
        this.closeAnim()
    }

    event_go() {
        this.closeAnim(() => {
            UIRoot.instance.closeChildWindow("GiftsWindow")
            if (UIRoot.instance.GetWindow("CardAllSetWindow") != null) {
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.meta.SetId())
                UIRoot.instance.openChildWindow("CardSingleSetWindow", { single_set_meta: meta })
            } else {
                UIRoot.instance.openChildWindow("CardAllSetWindow", {setId: this.meta.SetId()})
            }
        })
    }

}
