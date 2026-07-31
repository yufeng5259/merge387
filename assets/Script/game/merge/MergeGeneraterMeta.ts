import '../../LegacyGlobals';
import MergeContentUtil from './MergeContentUtil'

class MergeGeneraterMeta {
    static GetOutputIdsByMergeId: any
    static GetAllMetaIdsByMergeId: any
    static GetGenerateByMergeId: any
    static GetGenerateItemId: any
    static IsReady: any

    _data: any = {}

    constructor() {}

    static MakeEntity(data: any) {
        let meta = new MergeGeneraterMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data: any) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }
    Id() {
        return this._data.id
    } 
    MergeId() {
        return this._data.mergeId
    } 
    Series() {
        return this.GetFieldValue(["Series", "series"], null)
    }
    UnlockElementsType() {
        const value = this.GetFieldValue(["unlockElementsType", "UnlockElementsType"], [])
        if (Array.isArray(value)) return value
        if (value == null || value === "") return []
        if (typeof value === "string") {
            const text = value.trim()
            if (!text) return []
            try {
                const parsed = JSON.parse(text)
                if (Array.isArray(parsed)) return parsed
            } catch (e) {}
            return text.split(/[;,\uFF0C\uFF1B\s]+/).filter(item => item !== "")
        }
        return [value]
    }
    /**
     * 下一等级产出物品id
     * @returns {array} 下一个产出物品id
     */
    NextAdditionOutput() {
        return this._data.nextAdditionOutput||[];
    }
    /**
     * 消耗物品数�?
     * @returns {string} 消耗物品数�?
     */
    ConsumeCount() {
        return this._data.consumeCount
    }
    /**
     * 
     * @returns {Game.Content} 消耗物品数�?
     */
    ConsumeCountContent(){
        // console.log(this._data.consumeCount,'ConsumeCountContent',Game.Content.FromString(this._data.consumeCount));
        return Game.Content.FromString(MergeContentUtil.toContentString(this._data.consumeCount))
    }
    /**
     * 产出物品id和概�?
     * @returns {array} 产出物品id和概�?
     */
    Output() {
        return this._data.output||[];
    }
    GetFieldValue(keys: any[], defaultValue: any) {
        let normalizedKeys: any = {}
        for (let i = 0; i < keys.length; i++) {
            normalizedKeys[this.NormalizeFieldName(keys[i])] = true
        }
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            if (this._data[key] !== undefined && this._data[key] !== null) return this._data[key]
        }
        for (let key in this._data) {
            if (normalizedKeys[this.NormalizeFieldName(key)] && this._data[key] !== undefined && this._data[key] !== null) {
                return this._data[key]
            }
        }
        return defaultValue
    }
    NormalizeFieldName(key: any) {
        return String(key || '').replace(/[\s_\-]/g, '').toLowerCase()
    }
    /**
     * 产出方式�?=固定产出 2=非重置随�?3=PRD随机 4=完全重置随机，空=默认完全重置随机
     * @returns {number|null} 产出方式
     */
    SpawnType() {
        return this.GetFieldValue(["SpawnType", "spawnType"], null)
    }
    /**
     * PRD随机中可保底的重点物品ID（仅 SpawnType=3 使用�?
     * @returns {number|null} 重点物品ID
     */
    PrdId() {
        return this.GetFieldValue(["PrdId", "prdId"], null)
    }
    /**
     * PRD随机重点物品每次未命中时的概率增量（�?SpawnType=3 使用�?
     * @returns {number} 概率增量
     */
    PrdChangeRate() {
        return this.GetFieldValue(["PrdChangeRate", "prdChangeRate"], 0) || 0
    }
    /**
     * 初始产出序列（出现时优先产出的固定序列，ID共享、合成继承）
     * @returns {array} 初始序列物品id数组
     */
    InitialSequence() {
        return this.GetFieldValue(["InitialSequence", "initialSequence"], []) || []
    }
    /**
     * 生成器点击产出后生成气泡的概率；优先读取生成器表配置�?
     * @returns {number|string|null} 气泡概率
     */
    Interval() {
        return this.GetFieldValue(["interval", "Interval", "string", "String"], "") || ""
    }
    BubbleRate() {
        return this.GetFieldValue([
            "BubbleRate", "bubbleRate", "bubblerate", "bubble_rate",
            "GeneratorBubbleRate", "generatorBubbleRate", "generateBubbleRate",
            "BubbleProbability", "bubbleProbability", "BubbleProb", "bubbleProb",
            "BubbleChance", "bubbleChance", "BubbleCreateRate", "bubbleCreateRate",
            "BubbleSpawnRate", "bubbleSpawnRate"
        ], null)
    }
    /**
     * 生成器气泡参数；没有配置时由产出棋子的元素表兜底�?
     * @returns {*}
     */
    BubbleParam() {
        return this.GetFieldValue([
            "BubbleParam", "bubbleParam", "bubbleparam", "bubble_param",
            "GeneratorBubbleParam", "generatorBubbleParam"
        ], null)
    }
    /**
     * 生成器气泡领取消耗；没有配置时由产出棋子的元素表兜底�?
     * @returns {string|null}
     */
    BubbleCost() {
        return this.GetFieldValue([
            "BubbleCost", "bubbleCost", "bubblecost", "bubble_cost",
            "GeneratorBubbleCost", "generatorBubbleCost"
        ], null)
    }
    /**
     * 最大产出数�?没有值则是无限产�?
     * @returns {number} 最大产出数�?
     */
    MaxOutputCount() {
        return this._data.maxOutputCount
    }
    /**
     * 是否需要充�?
     * @returns {boolean} 是否需要充�?
     */
    NeedCharge() {
        return this._data.needCharge
    }
    /**
     * 
     * 充电时间
     * @returns {number} 充电时间
     */
    ChargeTime() {
        return this._data.chargeTime
    }
    /**
     * 延迟时间
     * @returns {number} 延迟时间
     */
    DelayTime() {
        return this._data.delaytime
    }
    OnetimeDestroy() {
        return this._data.onetimeDestroy
    }
    Des(){
        return GameKit.i18n.sel(this._data.des)
    }
}
/**
 * 根据id获取自身能产出的物品id
 * @param {*} mergeId 
 * @returns 
 */
MergeGeneraterMeta.GetOutputIdsByMergeId = (mergeId) => {
    let meta=MergeGeneraterMeta.GetGenerateByMergeId(mergeId)
    if(!meta)return [];
    let outputArr=meta.Output()
    let metaIds=[]
    for(let i=0;i<outputArr.length;i++){
        let item=outputArr[i]
        let parts=item.split('-')
        if(parts.length===2){
            let itemId=parseInt(parts[0])
            if(metaIds.indexOf(itemId) < 0){
                metaIds.push(itemId)
            }
        }
    }
    return metaIds;
}
/**
 * 根据id获取自身是由谁产生的
 * @param {*} mergeId 
 * @returns 
 */
MergeGeneraterMeta.GetAllMetaIdsByMergeId = (mergeId) => {
    let metas=Meta.MetaManager.GetMetas(Meta.MetaType.MergeGenerater)
    let keys=Object.keys(metas)
    let metaIds=[]
    for(let i=0;i<keys.length;i++){
        let key=keys[i]
        let meta=metas[key]
        let gid=meta.MergeId();
        let outputArr=meta.Output()  
        for(let j=0;j<outputArr.length;j++){
            let item=outputArr[j]
            let parts=item.split('-')
            if(parts.length===2){
                let itemId=parseInt(parts[0])
                if(itemId===mergeId){
                    if(metaIds.indexOf(gid) < 0){
                        metaIds.push(gid)
                    }
                }
            }
        }
    }
    return metaIds;
}
/**
 * 根据合成id获取产出Meta数据
 * @param {number} mergeId 合成id
 * @returns {MergeGeneraterMeta} 产出Meta数据，没有则返回null
 */
MergeGeneraterMeta.GetGenerateByMergeId = (mergeId) => {
    let metas=Meta.MetaManager.GetMetas(Meta.MetaType.MergeGenerater)
    let keys=Object.keys(metas)
    for(let i=0;i<keys.length;i++){
        let key=keys[i]
        let meta=metas[key]
        if(meta.MergeId()==mergeId){
            return meta
        }   
    }
    return null;
}

MergeGeneraterMeta.IsReady = () => {
    const metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeGenerater)
    return !!metas && Object.keys(metas).length > 0
}

/**
 * 根据合成id获取产出物品id
 * @param {number} mergeId 合成id
 * @returns {number} 产出物品id，没有则返回null
 */
MergeGeneraterMeta.GetGenerateItemId = (mergeId) => {
    let meta=MergeGeneraterMeta.GetGenerateByMergeId(mergeId)
    if(!meta)return null;
    // ['3-0.9', '4-0.1']
    let outputArr=meta.Output()
    if(!outputArr)return null;
    
    // 解析id和概�?
    let items = []
    for (let i = 0; i < outputArr.length; i++) {
        let item = outputArr[i].trim()
        let parts = item.split('-')
        if (parts.length === 2) {
            let itemId = parseInt(parts[0])
            let probability = parseFloat(parts[1])
            items.push({ id: itemId, probability: probability })
        }
    }
    
    // 根据概率随机选择
    let random = Math.random()
    let cumulative = 0
    for (let i = 0; i < items.length; i++) {
        cumulative += items[i].probability
        if (random <= cumulative) {
            return items[i].id
        }
    }
    
    // 如果所有概率都不匹配（理论上不应该发生），返回最后一个id
    return items.length > 0 ? items[items.length - 1].id : null
}
global.Meta.MergeGeneraterMeta = MergeGeneraterMeta

export default MergeGeneraterMeta
