// fengyong-2019-9-5
// @ts-check

export default class HeistData {

    /** @type {ActivityMeta} */
    static activityMeta = null;

    static load_data(activityMeta) {
        this.activityMeta = activityMeta
    }

    /** @returns {ActivityMeta} */
    static get_activity_meta() {
        return this.activityMeta
    }

    /** @returns {number} */
    static get_activity_meta_id() {
        return this.activityMeta.Id()
    }

    /** @returns {number} 获取总的购买次数 */
    static get_buy_count() {
        return Game.SUserActivity.GetActivityData(this.get_activity_meta_id()).buyCount || 0
    }

    /** @returns {number} 获取购买项index */
    static get_items_index(index) {
        let buyCount = this.get_buy_count()
        buyCount = Math.min(buyCount, this.get_buy_item_length() - 3)
        buyCount += index
        return buyCount
    }

    /**
     * 获取当前项目的购买状态
     * @param {number} index
     * @returns {"able-to-buy"|"buy-enough"|"no-able-to-buy"} 分别代表的含义是:允许购买,购买过,还不允许购买
     */
    static get_buy_state(index) {
        let i = this.get_items_index(index)
        let count = this.get_buy_count() - i
        if (count < 0) {
            return "no-able-to-buy"
        } else if (count == 0) {
            return "able-to-buy"
        } else {
            return "buy-enough"
        }
    }

    /**
     * 判断是否允许购买
     * @param {number} index
     * @returns {boolean} */
    static is_buy(index) {
        let i = this.get_items_index(index)
        let count = this.get_buy_count() - i
        return count == 0 
    }

    /**
     * 获取所有购买项的个数
     * @returns {number}
     */
    static get_buy_item_length() {
        return this.get_activity_meta().Param().items.length
    }

    /**
     * 获取当前购买项的shopId
     * @param {number} index
     * @returns {number}
     */
    static get_buy_item_shop_id(index) {
        let i = this.get_items_index(index)
        let s = this.get_activity_meta().Param().items[i]
        return s.shopId
    }

    /**
     * 获取当前购买项的packId
     * @param {number} index
     * @returns {number}
     */
    static get_buy_item_pack_id(index) {
        let i = this.get_items_index(index)
        let s = this.get_activity_meta().Param().items[i]
        return s.packId
    }

    /**
     * 获取当前购买项的价格字符串
     * @param {number} index
     * @returns {string}}
     */
    static get_buy_item_price_str(index) {
        let i = this.get_items_index(index)
        let s = this.get_activity_meta().Param().items[i]
        return s.shopId
            ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, s.shopId).PriceString()
            : GameKit.i18n.t("heist_main_window_free")
    }

    /**
     * 获取当前购买项的购买内容列表
     * @param {number} index
     * @returns {Game.Content[]}
     */
    static get_buy_item_reward_list(index) {
        let i = this.get_items_index(index)
        let s = this.get_activity_meta().Param().items[i]
        return s.shopId
            ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, s.shopId).Content().Contents()
            : Meta.MetaManager.GetMeta(Meta.MetaType.PackItem, s.packId).Contents()
    }

    /**
     * 获取当前购买项的类型
     * @param {number} index
     * @returns {"coin"|"money"|"free"}
     */
    static get_buy_item_type(index) {
        let i = this.get_items_index(index)
        let s = this.get_activity_meta().Param().items[i]
        return s.shopId
            ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, s.shopId).Type() === Meta.ShopMeta.Types.CoinPack ? "coin" : "money"
            : "free"
    }

}
