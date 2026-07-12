import '../../LegacyGlobals';
class MergeElementsMeta {
    _data: any = {}

    constructor() { }

    static MakeEntity(data: any) {
        let meta = new MergeElementsMeta()
        meta.UpdateData(data)
        return meta
    }

    static GetIdByIconName(iconName: any) {
        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeElements)
        let keys = Object.keys(metas)
        let meta = null
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index]
            meta = metas[key];
            if (meta.Icon() == iconName) {
                return meta.Id()
            }
        }
        return -1
    }

    UpdateData(data: any) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }
    _getFirst(keys: any[], def: any) {
        let normalizedKeys: any = {}
        for (let i = 0; i < keys.length; i++) {
            normalizedKeys[this._normalizeFieldName(keys[i])] = true
        }
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            if (this._data[key] !== undefined && this._data[key] !== null && this._data[key] !== '') {
                return this._data[key]
            }
        }
        for (let key in this._data) {
            let value = this._data[key]
            if (normalizedKeys[this._normalizeFieldName(key)] && value !== undefined && value !== null && value !== '') {
                return value
            }
        }
        return def
    }
    _normalizeFieldName(key: any) {
        return String(key || '').replace(/[\s_\-]/g, '').toLowerCase()
    }
    Id() {
        return this._data.id
    }
    /**
     * 鍥炬爣璺緞
     * @returns 
     */
    Icon() {
        return this._data.icon
    }
    /**
     * 鍥炬爣spine璺緞
     * @returns 
     */
    Iconspine() {   
        return this._data.iconspine
    }
    /**
     * 鍚堟垚绫诲瀷
     * @returns {number} 鍚堟垚绫诲瀷
     */
    Type() {
        return this._data.type
    }
    Series() {
        return this._getFirst(['series', 'Series'], null)
    }
    GoldPrice() {
        return this._getFirst(['GoldPrice', 'goldPrice', 'goldprice'], 0)
    }
    OrderScore() {
        return this._getFirst(['OrderScore', 'orderScore', 'orderscore'], 0)
    }
    OrderLv() {
        return this._getFirst(['OrderLv', 'orderLv', 'orderlv'], 0)
    }
    /**
     * 鍚堟垚绫诲瀷鍚嶇О
     * @returns {string} 鍚堟垚绫诲瀷鍚嶇О
     */
    Name() {
        return GameKit.i18n.sel(this._data.name)
    }
    /**
     * 涓嬩竴涓猧d
     * @returns {number} 涓嬩竴涓猧d
     */
    NextId() {
        return this._data.nextid
    }
    /**鏄惁鏄渶楂樼骇 */
    IsMaxLevel() {
        return this._data.nextid < 0
    }
    /**
     * 涓婁竴涓猧d
     * @returns {number} 涓婁竴涓猧d
     */
    PrevId() {
        return this._data.preid
    }
    /**鏄惁鍙互鍑哄敭 */
    IfCanSell() {
        return this._data.ifCanSell;
    }
    /**
     * 鍑哄敭浠锋牸锛屽鏋滃嚭鍞环鏍间负0鍒欐槸鍒犻櫎鐗╁搧1=0=1
     * @returns {number} 鍑哄敭浠锋牸
     */
    SellPrice() {
        return this._data.sellPrice
    }
    /**
     * 鏄惁鏈夊嚭鍞暟閲?
     * @returns {number} 鍑哄敭鏁伴噺
     */
    HasSellCount() {
        return this._data.sellPrice == "0" ? false : true;
    }
    /**鍑哄敭绫诲瀷 */
    SellType() {
        return this._getFirst(['selltype', 'sellType'], undefined);
    }
    /**鏄惁绋€鏈?*/
    IsRare() {
        return this._data.israre;
    }
    /**鏄惁鍙互琚壀 */
    IfCanCut() {
        return this._data.ifCanCut;
    }
    /**
     * 鎻忚堪
     * @returns {string} 鎻忚堪
     */
    Description() {
        return GameKit.i18n.sel(this._data.des)
    }
    /**鍚堟垚鍔熻兘绫诲瀷 */
    FunctionType() {
        return this._data.funcType;
    }
    /**鍚堟垚鍔熻兘鍙傛暟 */
    FunctionParams() {
        return this._data.funcParam;
    }
    /**姘旀场浜х敓姒傜巼 */
    BubbleRate(){
        // return 100
        return this._getFirst([
            'bubbleRate', 'bubblerate', 'BubbleRate', 'bubble_rate',
            'bubbleProbability', 'BubbleProbability', 'bubbleProb', 'BubbleProb',
            'bubbleChance', 'BubbleChance', 'bubbleCreateRate', 'bubbleSpawnRate'
        ], undefined)
    }
    /**姘旀场妫嬪瓙鍙傛暟 */
    BubbleParam(){
        let param = this._getFirst(['bubbleParam', 'bubbleparam', 'BubbleParam', 'bubble_param'], {})
        if (typeof param === 'string') {
            try {
                return JSON.parse(param)
            } catch (e) {
                return param
            }
        }
        return param || {}
    }
    /**姘旀场妫嬪瓙鑾峰彇娑堣€?*/
    BubbleCost(){
        return this._getFirst(['bubbleCost', 'bubblecost', 'BubbleCost', 'bubble_cost'], '')
    }
}

global.Meta.MergeElementsMeta = MergeElementsMeta

export default MergeElementsMeta
