
export default class GiftData{
    /** @type {GiftGetMeta} */
    // 当前活动的数据
    static activityMeta = null;
    // 当前活动的数据
    static _giftMeta = null;
    // 当前活动的礼包数据
    static _packrewardMeta=null;
    // 当前活动的建造奖励
    static buildingItemPackMeta=null;

    // 当前活动的物品数据
    static buy_items_data=[]

    static load_data(giftGetMeta) {
        this.activityMeta = giftGetMeta
        
        this.parse_active_data()
    }
    /**
     * 获取当前购买项的类型
     * @param {number} index
     * @returns {"coin"|"money"|"free"}
     */
    //  static get_buy_item_type(index) {
    //     let mt=this.get_meta_by_index(index)
    //     return mt.price>0?"money":"free"
    //     // let i = this.get_items_index(index)
    //     // let s = this.get_activity_meta().Param().items[i]
    //     // return s.shopId
    //     //     ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, s.shopId).Type() === Meta.ShopMeta.Types.CoinPack ? "coin" : "money"
    //     //     : "free"
    // }
    static is_buy(index){

    }
    static parse_active_data(){
        this.buy_items_data=[]
        this._giftMeta=Meta.giftActivityMeta.GetValueByAciveID(this.get_active_id());
        for (let index = 0; index < 6; index++) {
            let pnm="pack"+(index+1)
            let pack1Arr=this.format_string_2_array(this._giftMeta[pnm],',',/\[|]/g);
            let obj: any = {}
            obj.packid=parseInt(pack1Arr[0])
            obj.shopId=parseFloat(pack1Arr[1]);
            Meta.packrewardMeta.GetValueByPackIDAndLevel(obj.packid,this.get_map_level(),obj)
            this.buy_items_data.push(obj)
        }
    }
    static format_string_2_array(str,splitStr,ignorStr){
        let reg=ignorStr;
        //let nStr=str.replaceAll(reg,'');
        let nStr=str.substr(1,str.length-2);
        let ar=nStr.split(splitStr);
        return ar;
    }
    // 地图等级
    static get_map_level(){
        return Game.SUserVillage.MapId()
    }
    /** @returns {GiftGetMeta} */
    static get_activity_meta() {
        return this.activityMeta
    }
    static get_active_id(){
        // return '350020'
        return this.activityMeta.Id()
    }
    /**
     * 获取当前购买项的价格字符串
     * @param {number} shopId
     * @returns {string}}
     */
     static get_buy_price_str(shopId) {
        return shopId
            ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId).PriceString()
            : GameKit.i18n.t("heist_main_window_free")
    }
    /**
     * 获取当前购买项的类型
     * @param {number} shopId
     * @returns {"coin"|"money"|"free"}
     */
     static get_buy_item_type(shopId) {
        return shopId
            ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId).Type() === Meta.ShopMeta.Types.CoinPack ? "coin" : "money"
            : "free"
    }
    static check_reward_contentId(rewards){
        for (let index = 0; index < rewards.length; index++) {
            const Content = rewards[index];
            if(Content.Type()==21){
                return Content.ContentId()
            }
        }
        return -1
    }
    /**
     * 获取当前购买项的购买内容列表
     * @param {number} index
     * @returns {Game.Content[]}
     */
    //  static get_buy_item_reward_list(index) {
    //     let i = this.get_items_index(index)
    //     let s = this.get_activity_meta().Param().items[i]
    //     return s.shopId
    //         ? Meta.MetaManager.GetMeta(Meta.MetaType.Shop, s.shopId).Content().Contents()
    //         : Meta.MetaManager.GetMeta(Meta.MetaType.PackItem, s.packId).Contents()
    // }
    static get_meta_by_index(index){
        return this.get_active_buy_items()[index];
    }
    static get_active_buy_items(){
        return this.buy_items_data;
    }
    static check_active_item_unlock(i){
        
    }
}
