import { _decorator, Button, Color, instantiate, Label, Node, Prefab, ProgressBar, RichText, Sprite, SpriteFrame, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import CardModel from "./CardModel";

/** @author fengyong-2019-6-4 */

const { ccclass, property } = _decorator
const C = {
    SET_COUNT: 9,
    CARD_COUNT: 9,
}

@ccclass
export default class CardSelectCardWindow extends UIWindow {

    static windowPath = "Card/CardSelectCardWindow";

    friend_userid: any = null
    default_card_meta_id: any = null

    onShow(params) {
        this.friend_userid = params.friend_userid
        this.default_card_meta_id = params.default_card_meta_id
        this.load_page()
    }

    onClose() {
        this.select_card_model_list.forEach(x=>{
            x.onClose()
        })
    }

    load_page() {
        this.label_info.string = String.format(GameKit.i18n.t("CardSelectCardWindowInfo"), this.get_max_select_count())
        this.create_select_card()
        this.btn_send.interactable = false
        if (this.default_card_meta_id) {
            this.select_card(this.default_card_meta_id)
        }
        this.create_all_card()
    }

    /** @type {Label} */
    @property({ tooltip: "当前可以选择多少张卡片的info", type: Label })
    label_info = null

    @property(ScrollViewTool)
    card_svt = null

    /** @type {CardSetsMeta} */
    set_meta = null

    /**
     * 获取可以send的card-list
     * @returns {number[]}
     */
    get_card_list() {
        // 获取所有的card-meta-id
        let all_card_meta_id_list = Object.keys(Meta.MetaManager.GetMetas(Meta.MetaType.Card)).map((v) => {return parseInt(v)})
        // 过滤:非金卡,个数>1
        let able_card_meta_id_list = all_card_meta_id_list.filter(v => {
            /** @type {CardMeta} */
            let card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, v)
            let set_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, card_meta.SetId())
            if (card_meta.Golden()) { return false }
            if (set_meta.IsActivityCard()) { return false }
            if (Game.SUserCard.CardNum(card_meta.Id()) <= 1) { return false }
            return true
        })
        return able_card_meta_id_list
    }

    /** 创建全部的待选择卡片 */
    create_all_card() {
        let source_id_list = this.get_card_list()
        let id_list = []        // 默认的idlist,没有用到
        let id_list_list = []   // 实际的card_id_list
        for (let i = 0; i < source_id_list.length; i += 3) {
            id_list.push(0)
            id_list_list.push([source_id_list[i], source_id_list[i + 1], source_id_list[i + 2]])
        }
        this.card_svt.setItem(id_list, (index, id, node) => {
            this.create_single_card(GameKit.ControllerTable.GetNode(node, "item-card-1"), id_list_list[index][0])
            this.create_single_card(GameKit.ControllerTable.GetNode(node, "item-card-2"), id_list_list[index][1])
            this.create_single_card(GameKit.ControllerTable.GetNode(node, "item-card-3"), id_list_list[index][2])
        })
    }

    /** 创建单个卡片 */
    create_single_card(node, card_meta_id) {
        if (!card_meta_id) {
            node.active = false
            return
        }
        node.active = true
        GameKit.ControllerTable.GetNode(node, "CardModel").getComponent(CardModel).show(card_meta_id)
        node.getComponent(Button).clickEvents[0].customEventData = card_meta_id
        // 如果已经是被选择的,则不允许点击
        let f = this.select_card_meta_id_list.includes(card_meta_id)
        let v2 = GameKit.ControllerTable.GetNode(node, "v2")
        v2.active = f
        // 保存v2
        v2.card_meta_id = card_meta_id
        this.select_card_v2[card_meta_id] = v2
    }

    /** @type {Node} 5个选择的card */
    @property(Node)
    item_select_card = null

    /** @type {number[]} 已经选择的card的meta-id数组,与CardModel一一对应 */
    select_card_meta_id_list = []
    /** @type {CardModel[]} 下面:已经选择的card的CardModel组件数组 */
    select_card_model_list = []
    /** @type {{[key:number]:Node}} card-meta-id与v2的一一对应 */
    select_card_v2 = {}

    /** @type {number} 最大可以选择的card个数 */
    max_select_count = null

    /** 获取最大可以选择的card个数 */
    get_max_select_count() {
        if (!this.max_select_count) {
            this.max_select_count = Game.SUserCard.GetDailyCount()
        }
        return this.max_select_count
    }

    /** 创建n个已经选择的card */
    create_select_card() {
        this.select_card_meta_id_list = new Array(this.get_max_select_count()).fill(null)
        this.item_select_card.active = false
        for (let i = 0; i < this.get_max_select_count(); i += 1) {
            let n = instantiate(this.item_select_card)
            n.parent = this.item_select_card.parent
            n.active = true
            n.getComponent(Button).clickEvents[0].customEventData = ""
            let card_model = GameKit.ControllerTable.GetNode(n, "CardModel").getComponent(CardModel)
            card_model.node.active = false
            this.select_card_model_list.push(card_model)
        }
    }

    /** @type {Button} */
    @property({ tooltip: "send按钮", type: Button })
    btn_send = null

    /** 选择一个card
     * @returns {boolean}
     */
    select_card(card_meta_id) {
        // 判断是否可以被选择,不允许选择时直接return
        if (this.select_card_meta_id_list.includes(card_meta_id)) { return true }
        if (!this.select_card_meta_id_list.includes(null)) { return false }
        // 允许选择时,修改数据,上面打勾,下面显示,下面按钮绑定新的meta-id
        let index = this.select_card_meta_id_list.findIndex(v => v === null)
        this.select_card_meta_id_list[index] = card_meta_id
        this.select_card_model_list[index].node.active = true
        this.select_card_model_list[index].show(card_meta_id)
        this.select_card_model_list[index].node.parent.getComponent(Button).clickEvents[0].customEventData = card_meta_id
        // 修改btn-send样式
        this.btn_send.interactable = true
        return true
    }

    /** 释放一个card */
    release_card(card_meta_id) {
        // 判断是否可以被选择,不允许被选择时直接return
        if (!this.select_card_meta_id_list.includes(card_meta_id)) { return }
        // 允许,修改数据,下面修改显示,下面修改按钮绑定数据
        let index = this.select_card_meta_id_list.findIndex(v => v === card_meta_id)
        this.select_card_meta_id_list[index] = null
        this.select_card_model_list[index].node.parent.getComponent(Button).clickEvents[0].customEventData = ""
        this.select_card_model_list[index].node.active = false
        // 释放v2
        let v2 = this.select_card_v2[card_meta_id]
        if (v2 && v2.card_meta_id === card_meta_id) { v2.active = false }
        // 修改btn样式
        this.btn_send.interactable = !this.select_card_meta_id_list.every(v => v === null)
    }

    /** 点击事件:上面:选择/释放一个card */
    event_select_or_release_card(e, str_card_meta_id) {
        let card_meta_id = Number.parseInt(str_card_meta_id)
        if (this.select_card_meta_id_list.includes(card_meta_id)) {
            this.release_card(card_meta_id)
            GameKit.ControllerTable.GetNode(e.target, "v2").active = false
        } else {
            let f = this.select_card(card_meta_id)
            GameKit.ControllerTable.GetNode(e.target, "v2").active = f
        }
    }

    /** 点击事件:不选择一个card */
    event_release_card(e, str_card_meta_id) {
        let card_meta_id = Number.parseInt(str_card_meta_id)
        this.release_card(card_meta_id)
    }

    event_send() {
        // 清理select_card_meta_id_list, [101,null,null,null,null] => [101]
        let card_id_list = this.select_card_meta_id_list.filter(v => !!v)
        // 通知服务器
        let sr = SR.SRCard.cardSend(this.friend_userid, card_id_list)
        sr.SetCallBack(() => {
            // 修改本地数据,用于计算每日的送卡片数目限制
            let sendCardTime = GameKit.PlayerPrefs.GetInt("sendCardTime", 0)
            if (GameKit.TimeUtil.getCurrentDay() !== sendCardTime) {
                GameKit.PlayerPrefs.SetInt("sendCardCount", 0)
                GameKit.PlayerPrefs.SetInt("sendCardTime", GameKit.TimeUtil.getCurrentDay())
            }
            let count = GameKit.PlayerPrefs.GetInt("sendCardCount", 0)
            GameKit.PlayerPrefs.SetInt("sendCardCount", count + card_id_list.length)
            // 修改临时数据
            card_id_list.forEach(v => {
                //Game.SUserCard.DeleteCard(v)
            })
            // 刷新页面
            let w = UIRoot.instance.GetWindow("CardSingleSetWindow")
            if (w) w.load_page(w.single_set_meta)
            // 显示send成功并关闭页面
            DialogWindow.Show(GameKit.i18n.t("CardSelectCardWindowSuccess"), () => {
                AppKit.NativeWrap.callAdjustTrackEvent("送好友卡牌");
                this.closeAnim()
            })
            
            AppKit.LogEventWrap.logEvent("card_send", {num: card_id_list.length})
        })
        if (G.GameConfig.closeGiftFbShare) {
            sr.Send()
        } else {
            AppKit.ShareWrap.chooseOne(Game.SUser.FriendsList()[this.friend_userid].ThirdId(), String.format(GameKit.i18n.t("ShareSendCard"), Game.SUser.Name()), 'tex/sh01.png', {type:"send_cards"}, () => {
                sr.Send()
            }, "send_cards", false)
        }
    }

    event_ask() {
        if (!this.friend_userid) { return }
        // 通知服务器
        // 未写
    }

    event_close() {
        this.closeAnim()
    }
}
