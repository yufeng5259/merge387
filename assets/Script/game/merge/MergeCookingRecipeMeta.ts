import '../../LegacyGlobals';
class MergeCookingRecipeMeta {
    constructor() { }

    static MakeEntity(data) {
        let meta = new MergeCookingRecipeMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (var key in data) {
            this._data[key] = data[key]
        }
    }

    Id() {
        return this._data.id
    }

    /**
     * 配方名称
     * @returns {string} 多语言后的配方名称
     */
    Name() {
        return GameKit.i18n.sel(this._data.name)
    }

    /**
     * 制作工具id
     * @returns {number} mergeElements表中的工具id
     */
    ToolId() {
        return this._data.toolId
    }

    /**
     * 制作工具名称
     * @returns {string} 多语言后的工具名称
     */
    ToolName() {
        return GameKit.i18n.sel(this._data.toolName)
    }

    /**
     * 材料id列表
     * @returns {array} mergeElements表中的材料id列表
     */
    IngredientIds() {
        return this._data.ingredientIds || []
    }

    /**
     * 材料名称列表
     * @returns {array} 多语言材料名称配置
     */
    IngredientNames() {
        return this._data.ingredientNames || []
    }

    /**
     * 产物id
     * @returns {number} mergeElements表中的产物id
     */
    ResultId() {
        return this._data.resultId
    }

    /**
     * 产物名称
     * @returns {string} 多语言后的产物名称
     */
    ResultName() {
        return GameKit.i18n.sel(this._data.resultName)
    }

    /**
     * 产物数量
     * @returns {number} 制作完成后获得的产物数量
     */
    ResultCount() {
        return this._data.resultCount
    }

    /**
     * 制作时间
     * @returns {number} 制作耗时，单位秒
     */
    MakeTime() {
        return this._data.makeTime
    }

    /**
     * 消耗体�?
     * @returns {number} 开始制作需要消耗的体力
     */
    EnergyCost() {
        return this._data.energyCost
    }
    /**
     * 
     * @returns {number} 取消制作的消耗体�?
     */
    CancelCost(){
        return this._data.cancelCost
    }

    /**
     * 解锁等级
     * @returns {number} 配方解锁等级
     */
    UnlockLevel() {
        return this._data.unlockLevel
    }

    /**
     * 匹配key
     * @returns {string} 工具类型和材料组合生成的配方匹配key
     */
    RecipeKey() {
        return this._data.recipeKey
    }

    /**
     * 优先�?
     * @returns {number} 同工具下配方排序优先�?
     */
    Priority() {
        return this._data.priority
    }

    /**
     * 配方描述
     * @returns {string} 多语言后的配方描述
     */
    Des() {
        return GameKit.i18n.sel(this._data.desc)
    }
    /**快速跳过的消�?*/
    QuickCost() {
        return this._data.quickCost
    }
}

/**
 * 根据匹配key获取烹饪配方
 * @param {string} recipeKey 工具类型和材料组合生成的配方匹配key
 * @returns {MergeCookingRecipeMeta} 配方Meta数据，没有则返回null
 */
MergeCookingRecipeMeta.GetRecipeByKey = (recipeKey) => {
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeCookingRecipe)
    if (!metas) return null
    let keys = Object.keys(metas)
    for (let i = 0; i < keys.length; i++) {
        let meta = metas[keys[i]]
        if (meta.RecipeKey() == recipeKey) {
            return meta
        }
    }
    return null
}

/**
 * 根据制作工具id获取所有配�?
 * @param {number} toolId 制作工具id
 * @returns {array} 按优先级排序后的配方Meta列表
 */
MergeCookingRecipeMeta.GetRecipesByToolId = (toolId) => {
    let metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeCookingRecipe)
    if (!metas) return []
    let keys = Object.keys(metas)
    let list = []
    for (let i = 0; i < keys.length; i++) {
        let meta = metas[keys[i]]
        if (meta.ToolId() == toolId) {
            list.push(meta)
        }
    }
    list.sort((a, b) => a.Priority() - b.Priority())
    return list
}

global.Meta.MergeCookingRecipeMeta = MergeCookingRecipeMeta
