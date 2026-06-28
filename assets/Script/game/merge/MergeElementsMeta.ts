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
     * 图标路径
     * @returns 
     */
    Icon() {
        return this._data.icon
    }
    /**
     * 图标spine路径
     * @returns 
     */
    Iconspine() {   
        return this._data.iconspine
    }
    /**
     * 合成类型
     * @returns {number} 合成类型
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
    /**
     * 合成类型名称
     * @returns {string} 合成类型名称
     */
    Name() {
        return GameKit.i18n.sel(this._data.name)
    }
    /**
     * 下一个id
     * @returns {number} 下一个id
     */
    NextId() {
        return this._data.nextid
    }
    /**是否是最高级 */
    IsMaxLevel() {
        return this._data.nextid < 0
    }
    /**
     * 上一个id
     * @returns {number} 上一个id
     */
    PrevId() {
        return this._data.preid
    }
    /**是否可以出售 */
    IfCanSell() {
        return this._data.ifCanSell;
    }
    /**
     * 出售价格，如果出售价格为0则是删除物品1=0=1
     * @returns {number} 出售价格
     */
    SellPrice() {
        return this._data.sellPrice
    }
    /**
     * 是否有出售数�?
     * @returns {number} 出售数量
     */
    HasSellCount() {
        return this._data.sellPrice == "0" ? false : true;
    }
    /**出售类型 */
    SellType() {
        return this._getFirst(['selltype', 'sellType'], undefined);
    }
    /**是否稀�?*/
    IsRare() {
        return this._data.israre;
    }
    /**是否可以被剪 */
    IfCanCut() {
        return this._data.ifCanCut;
    }
    /**
     * 描述
     * @returns {string} 描述
     */
    Description() {
        return GameKit.i18n.sel(this._data.des)
    }
    /**合成功能类型 */
    FunctionType() {
        return this._data.funcType;
    }
    /**合成功能参数 */
    FunctionParams() {
        return this._data.funcParam;
    }
    /**气泡产生概率 */
    BubbleRate(){
        // return 100
        return this._getFirst([
            'bubbleRate', 'bubblerate', 'BubbleRate', 'bubble_rate',
            'bubbleProbability', 'BubbleProbability', 'bubbleProb', 'BubbleProb',
            'bubbleChance', 'BubbleChance', 'bubbleCreateRate', 'bubbleSpawnRate'
        ], undefined)
    }
    /**气泡棋子参数 */
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
    /**气泡棋子获取消�?*/
    BubbleCost(){
        return this._getFirst(['bubbleCost', 'bubblecost', 'BubbleCost', 'bubble_cost'], '')
    }
}

global.Meta.MergeElementsMeta = MergeElementsMeta

export default MergeElementsMeta
