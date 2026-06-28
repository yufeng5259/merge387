/**
 * 合并棋子 meta.FunctionType() 相关工具，集中处理历史大小写不一致的标记。
 */
import MergeTypes from './MergeTypes'

function _ft(meta) {
    if (!meta || !meta.FunctionType) return null
    return meta.FunctionType()
}

const MergeTileFunctionUtil = {
    /**
     * 双击即弹三合一窗（原 meta.FunctionType().contains("threeToOne")）
     */
    opensThreeToOneImmediately(meta) {
        let ft = _ft(meta)
        return !!(ft && ft.contains('threeToOne'))
    },

    /**
     * 有产出能力时，用三合一窗替代直接生成棋子（原 contains("ThreeToOne")）
     */
    useThreeToOneInsteadOfSpawn(meta) {
        let ft = _ft(meta)
        return !!(ft && ft.contains('ThreeToOne'))
    },

    /** 是否属于三合一类（含配置里的类型名，便于扩展） */
    isThreeToOneFamily(meta) {
        if (this.opensThreeToOneImmediately(meta) || this.useThreeToOneInsteadOfSpawn(meta)) return true
        let ft = _ft(meta)
        if (!ft) return false
        return (
            ft.contains(MergeTypes.MergeFunctionType.ThreeToOneType) ||
            ft.contains(MergeTypes.MergeFunctionType.ThreeToOneOrder)
        )
    },
}

export { MergeTileFunctionUtil }
export default MergeTileFunctionUtil
