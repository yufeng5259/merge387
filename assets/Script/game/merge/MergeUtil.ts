import { Node, UITransform, Vec2, view } from 'cc';

/**
 * 棋盘像素 ↔ tile 索引、可合并对查找等纯函数工具。
 * 像素换算必须传入 layout（谁用谁传），避免多套棋盘共用一套写死的 nodeSize/itemSize。
 *
 * @typedef {{ nodeSize: Vec2, itemSize: Vec2, offset?: number }} MergeBoardLayout
 */

const MergeUtil: any = {}

MergeUtil.DEFAULT_GRID_SIZE = new Vec2(7, 9)

/**
 * 当前项目主合成棋盘的默认布局（与历史硬编码一致）。编辑器 / 其它界面可显式引用，勿在工具函数内隐式兜底。
 * @type {MergeBoardLayout}
 */
MergeUtil.DEFAULT_BOARD_LAYOUT = {
    nodeSize: new Vec2(602, 774),
    itemSize: new Vec2(86, 86),
    offset: 0,
}

/**
 * @param {Vec2} nodeSize
 * @param {Vec2} itemSize
 * @param {number} [offset=0]
 * @returns {MergeBoardLayout}
 */
MergeUtil.createBoardLayout = function (nodeSize, itemSize, offset) {
    return {
        nodeSize: nodeSize,
        itemSize: itemSize,
        offset: offset != null ? offset : 0,
    }
}

/**
 * @param {number} x
 * @param {number} y 棋盘节点本地像素
 * @param {MergeBoardLayout} layout
 * @returns {Vec2} tile 下标
 */
MergeUtil.px2tile = function (x, y, layout) {
    let ns = layout.nodeSize
    let is = layout.itemSize
    let off = layout.offset != null ? layout.offset : 0
    let tx = (x + ns.x / 2) / (is.x + off)
    let ty = (y + ns.y / 2) / (is.y + off)
    return new Vec2(Math.floor(tx), Math.floor(ty))
}

/**
 * @param {number} tx
 * @param {number} ty tile 下标
 * @param {MergeBoardLayout} layout
 * @returns {Vec2} 棋盘本地像素（格中心）
 */
MergeUtil.tile2px = function (tx, ty, layout) {
    let ns = layout.nodeSize
    let is = layout.itemSize
    let off = layout.offset != null ? layout.offset : 0
    let x = tx * (is.x + off) - ns.x / 2 + is.x / 2
    let y = ty * (is.y + off) - ns.y / 2 + is.y / 2
    return new Vec2(x, y)
}

MergeUtil.isSame = function (id1, id2) {
    return id1 == id2
}

MergeUtil.getSize = function () {
    const rootTransform = UIRoot.instance && UIRoot.instance.node
        ? UIRoot.instance.node.getComponent(UITransform)
        : null
    const rootHeight = rootTransform ? rootTransform.height : 0
    const winHeight = UIRoot.instance && UIRoot.instance.winSize
        ? UIRoot.instance.winSize.height
        : view.getVisibleSize().height
    return Math.max(0, 44 - Math.max(0, (rootHeight - winHeight) / 2))
}

MergeUtil.isLongScreen = function () {
    const size = view.getVisibleSize()
    return size.height / size.width > 1250 / 640
}

/**
 * 在 mapData 中找一对可两两合成的格键（同 iconId，且 env 为净地 -1 或半沙 4；双 4 不配）。
 * 若传入 ifCanMergeByKey，则要求两个格键本身都满足可合成（与 MergeItem.IfCanMerge 一致，由回调实现）。
 * 若传入 ifCanDragByKey，则要求这一对中至少有一个格键满足可拖（与 MergeItem.IfCanDrag 一致，由回调实现）。
 * @param {Object.<string,string|number>} mapData 键为 "tx_ty"
 * @param {(key: string) => boolean} [ifCanMergeByKey] 格键是否当前可合成；不传则只按 mapData/env 判断
 * @param {(key: string) => boolean} [ifCanDragByKey] 格键是否当前可拖；不传则不做此约束
 * @returns {string[]|Node[]} 两个格键或节点，找不到返回 []
 */
MergeUtil.GetCanMergeItems = function (mapData, ifCanMergeByKey, ifCanDragByKey) {
    let parseMergeVal = (val) => {
        if (val == null) return null
        if (typeof val === 'number') {
            if (val < 0) return null
            return { iconId: val, envId: -1 }
        }
        if (typeof val !== 'string') return null
        let clientStr = val.split('=')[0]
        let parts = clientStr.split('_')
        if (parts.length < 2) return null
        let iconId = parseInt(parts[0])
        if (isNaN(iconId)) return null
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, iconId)
        if (!meta || meta.NextId() < 0) {
            return null
        }
        let envId = parseInt(parts[1])
        if (isNaN(envId)) return null
        return { iconId, envId }
    }

    let firstInfoByIconId = {}
    for (let key in mapData) {
        let info = parseMergeVal(mapData[key])
        if (!info) continue
        if (info.envId !== -1 && info.envId !== 4) continue
        if (ifCanMergeByKey && !ifCanMergeByKey(key)) continue

        let firstInfo = firstInfoByIconId[info.iconId]
        if (firstInfo) {
            if (firstInfo.envId === 4 && info.envId === 4) {
                continue
            }
            if (
                ifCanDragByKey &&
                !ifCanDragByKey(firstInfo.key) &&
                !ifCanDragByKey(key)
            ) {
                continue
            }
            return [firstInfo.key, key]
        }
        firstInfoByIconId[info.iconId] = { key, envId: info.envId }
    }
    return []
}
//
//检查是否可以合并
/**
 * 检查是否可以合并
 * @param {MergeItem} startMergeItem 起始格子
 * @param {MergeItem} dropMergeItem 目标格子
 * @param {Meta.Meta} meta 元数据
 * @returns {boolean} 是否可以合并
 */
MergeUtil.CheckIfCanMerge = function (startMergeItem, dropMergeItem,meta) {
    return GameKit.MergeUtil.isSame(dropMergeItem.mergeId, startMergeItem.mergeId) && meta.NextId() > -1 && startMergeItem.IfCanMerge() && dropMergeItem.IfCanMerge()
}

export default MergeUtil
