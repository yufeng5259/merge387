import { UIWindow } from '../../GameKit/ui/UIWindow';
/** @author fengyong 2019-5-14 */

import CardModel from "./CardModel";
const { ccclass, property } = cc._decorator
const C = {
    BASE_PATH: "Card",
    SET_BG_FILENAME: "set-bg",
    CARD_COUNT: 9,  // 固定值,应该配置在这里
}

/**
 * 单个卡片集合中的9张卡片列表界面
 */
@ccclass
export default class CardSingleSetWindow extends UIWindow {

    static windowPath = "Card/CardSingleSetWindow"

    /** @type {CardSetsMeta}  当前的card-set-meta */
    single_set_meta;

    /** 
     * 9个card的meta数据
     * - CardMeta,参考CardMeta.js
     * - id
     * - setId  系列id
     * - index  序号
     * - min_village  开放需要的村庄等级
     * - rare  稀有度（1~5）
     * - golden 是否金卡
     * @type {CardMeta[]}
     */
    card_meta_list = []

    /** @type {CardModel[]} */
    card_list = []

    @property(cc.Button)
    bt_goShop = null

    onShow(showParams) {
        // 获取在min-village限制下的最大set-id
        let all_set_meta = Meta.MetaManager.GetMetas(Meta.MetaType.CardSets)
        /*this.max_set_id = 1
        let i = 0
        while (true) {
            i += 1
            if (!all_set_meta[i]) { break }
            if (all_set_meta[i].MinVillage() > Game.SUserVillage.MapId()) { break }
        }
        this.max_set_id = i - 1*/
        let meta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)

        this.CardThemeMeta=Game.ActivityManager.GetActiveGameActivityByType(Meta.ActivityMeta.SubTypes.CardTheme)
        this.Card_issue = this.CardThemeMeta.Card_issue()
        this.setIds = []
        for (let id in all_set_meta) {
            let count = 0
            for (let i = 1; i <= 9; i++) {
                count += Game.SUserCard.HaveCard(id * 100 + i) ? 1 : 0
            }
            if (Game.SUserVillage.MapId() >= all_set_meta[id].MinVillage() || count > 0){
                if(meta){
                    ///限时卡牌活动开启
                    if(all_set_meta[id].IsActivityCard()){
                        if(meta.Param().sets.indexOf(parseInt(id))>-1){
                            //是限时卡牌并且是开放的才加入队列
                            this.setIds.push(parseInt(id))
                        }
                    }else{
                        if(all_set_meta[id].Card_issue()==this.Card_issue){
                            this.setIds.push(parseInt(id))
                        }else{
                            //console.log("当前卡牌未开启",id);
                        }
                    }
                }else{
                    //未开启
                    if(!all_set_meta[id].IsActivityCard()){
                        if(all_set_meta[id].Card_issue()==this.Card_issue){
                            this.setIds.push(parseInt(id))
                        }else{
                            //console.log("当前卡牌未开启",id);
                        }
                        
                    }
                }
                
            }
             
        }
        this.setIdIndex = this.setIds.indexOf(showParams.single_set_meta.Id())

        // 刷新页面
        this.load_page(showParams.single_set_meta)

        //主题卡活动开启时显示去商店购买按钮
        
        if(meta&&showParams.single_set_meta.IsActivityCard()){
            this.bt_goShop.node.active=true
        }else{
            this.bt_goShop.node.active=false
        }
    }

    onClickSubjectButton(){
        this.event_close()
        UIRoot.instance.closeChildWindow("CardAllSetWindow")
        UIRoot.instance.openChildWindow("ShopWindow")
    }

    onClose() {
        this.releaseMeta()
        this.card_list.forEach(x => {
            x.onClose()
        })
    }

    /**
     * 载入界面,可以反复使用
     * @param {CardSetsMeta} set_meta
     */
    load_page(set_meta) {
        //主题卡活动开启时显示去商店购买按钮
        let meta=Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay,Meta.ActivityMeta.SubTypes.SubjectCard)
        if(meta&&set_meta.IsActivityCard()){
            this.bt_goShop.node.active=true
        }else{
            this.bt_goShop.node.active=false
        }
        // 获取奖励
        this.get_set_reward(set_meta)
        // 重新获取数据
        this.single_set_meta = set_meta
        for (let i = 0; i < 9; i += 1) {
            this.card_meta_list[i] = Meta.MetaManager.GetMeta(Meta.MetaType.Card, this.single_set_meta.Id() * 100 + i + 1)
        }
        // 刷新页面
        this.sp_set_name.spriteFrame = null
        cce.loadRes(`${C.BASE_PATH}/common/${C.SET_BG_FILENAME}_${set_meta.Color()}`, cc.SpriteFrame, (err, res) => {
            this.releaseMeta(res)
            if (!err && this.sp_set_name) {
                this.sp_set_name.spriteFrame = res
            }
        })
        //this.label_set_name.string = this.single_set_meta.Id().toString() + "." + this.single_set_meta.Name();
        this.label_set_name.string = this.single_set_meta.Name();
        // 刷新9个card
        this.create_card()
        // 刷新process
        if (Game.SUserCard.HasgotSetsReward(this.single_set_meta.Id())) {
            this.label_set_done.node.parent.active = true
            this.label_reward.node.parent.active = false
        } else {
            this.label_set_done.node.parent.active = false
            this.label_reward.node.parent.active = true
            let reward_string_list = []
            let contents = Game.Content.Merge(this.single_set_meta.Reward())
            contents.forEach(v => {
                reward_string_list.push(`${v.ColorCode()}${v.Count() == 1 ? "" : v.Count()}${v.Type() == Game.Content.Types.Servant ? GameKit.i18n.t("ContentNameServant") : ""} ${v.Name()}</c>`)
            })
            this.label_reward.string = '<outline color=#444444width=2>' + GameKit.i18n.t("CardSingleSetWindowReward") + "\n" + reward_string_list.join(", ") + '</outline>'
        }
    }

    releaseMeta(res) {
        cce.releaseSpriteFrame(this.sp_set_name, res)
    }

    /**
     * 判定并获取set的奖励
     * @param {CardSetsMeta} set_meta 
     */
    get_set_reward(set_meta) {
        // 是否领过
        if (Game.SUserCard.HasgotSetsReward(set_meta.Id())) { return }
        // 是否满足领的条件
        for (let i = 1; i <= 9; i += 1) {
            if (!Game.SUserCard.HaveCard(100 * set_meta.Id() + i)) { return }
        }
        // 领奖
        let sr = SR.SRCard.getCardReward(set_meta.Id())
        sr.SetSilence(false)
        sr.SetCallBack(() => {
            Game.SUserCard.GetSetsReward(set_meta.Id())
            let all_set_window = UIRoot.instance.GetWindow("CardAllSetWindow")
            if (all_set_window) {
                all_set_window.update_compelete()
            }

            AppKit.LogEventWrap.logEvent("card_reward", {id: set_meta.Id()})
        })
        sr.Send()
    }

    /** @type {cc.Sprite} */
    @property(cc.Sprite)
    sp_set_name = null

    /** @type {cc.Label} */
    @property(cc.Label)
    label_set_name = null

    /** @type {cc.Node} */
    @property(cc.Node)
    item_card = null

    /** 创建9个card-item */
    create_card() {
        // 如果已经创建,则直接刷新
        if (this.card_list.length != 0) {
            this.card_list.forEach((v, i) => {
                v.show(this.card_meta_list[i].Id())
                // 如果被锁住则不可点击
                v.node.parent.getComponent(cc.Button).interactable = Game.SUserVillage.MapId() >= this.card_meta_list[i].MinVillage() || Game.SUserCard.HaveCard(this.card_meta_list[i].Id())
                v.goldTrade.active = this.card_meta_list[i].Golden() && !this.card_meta_list[i].CantSend()
            })
            return
        }
        // 创建
        this.item_card.active = false
        for (let i = 0; i < 9; i += 1) {
            // 创建新node
            let node = cc.instantiate(this.item_card)
            node.parent = this.item_card.parent
            node.active = true
            // 刷新显示
            let card_model = GameKit.ControllerTable.GetNode(node, "CardModel").getComponent(CardModel)
            card_model.show(this.card_meta_list[i].Id())
            card_model.goldTrade = GameKit.ControllerTable.GetNode(node, "goldTrade")
            card_model.goldTrade.active = this.card_meta_list[i].Golden() && !this.card_meta_list[i].CantSend()
            node.getComponent(cc.Button).interactable = Game.SUserVillage.MapId() >= this.card_meta_list[i].MinVillage() || Game.SUserCard.HaveCard(this.card_meta_list[i].Id())
            this.card_list.push(card_model)
            // 绑定点击事件
            node.on("click", () => {
                UIRoot.instance.openChildWindow("CardAskSendWindow", { card_meta: this.card_meta_list[i] })
            })
        }
    }

    /** @type {cc.Label} */
    @property(cc.RichText)
    label_reward = null

    /** @type {cc.Label} */
    @property(cc.Label)
    label_set_done = null

    /** 点击事件:上一个set */
    event_left() {
        this.setIdIndex -= 1
        if (this.setIdIndex < 0) this.setIdIndex += this.setIds.length
        this.load_page(Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.setIds[this.setIdIndex]))
    }

    /** 点击事件:下一个set */
    event_right() {
        this.setIdIndex += 1
        if (this.setIdIndex >= this.setIds.length) this.setIdIndex -= this.setIds.length
        this.load_page(Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, this.setIds[this.setIdIndex]))
    }

    event_close() {
        this.closeAnim()
    }

}
