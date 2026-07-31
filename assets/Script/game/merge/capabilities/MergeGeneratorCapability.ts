import MergeTypes from '../MergeTypes'
import MergeTileFunctionUtil from '../MergeTileFunctionUtil'
import MergeTileCapabilityKeys from './MergeTileCapabilityKeys'
import { SpriteGray } from '../../../GameKit/render/SpriteGray'

class MergeGeneratorCapability {
    key = MergeTileCapabilityKeys.GENERATOR
    tile: any = null
    starttime = 0
    endtime = 0
    generatorInstanceId: any = null

    bind(tile: any) {
        this.tile = tile
    }

    refreshEnergyIcon() {
        if (!this.tile || !this.tile.energyicon) return
        let generatorMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(this.tile.mergeId)
        let consumeCount = generatorMeta ? generatorMeta.ConsumeCount() : null
        let hasConsume = consumeCount !== undefined && consumeCount !== null && String(consumeCount).trim() !== '' && String(consumeCount).trim() !== '0'
        this.tile.energyicon.node.active = !!hasConsume && this.tile.IfCanMerge()
    }

    onTileDataChanged() {
        if (!this.tile) return
        let generatorMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(this.tile.mergeId)
        if (!generatorMeta) {
            this.generatorInstanceId = null
            if (this.tile.clock) this.tile.clock.node.active = false
            if (this.tile.energyicon) this.tile.energyicon.node.active = false
            this.tile.HideShiningAnim()
            SpriteGray.SetGray(this.tile.icon, false)
            return
        }
        this.generatorInstanceId = Game.SUserMerge.GetGeneratorInstanceIdByMergeTilePos(this.tile.tx, this.tile.ty)
        this.refreshEnergyIcon()
        if (this.generatorInstanceId == null) {
            if (this.tile.clock) this.tile.clock.node.active = false
            this.tile.HideShiningAnim()
            SpriteGray.SetGray(this.tile.icon, false)
            return
        }
        let generatorData = Game.SUserMerge.GetGeneratorByInstanceId(this.generatorInstanceId)
        if (!generatorData) {
            if (this.tile.clock) this.tile.clock.node.active = false
            this.tile.HideShiningAnim()
            SpriteGray.SetGray(this.tile.icon, false)
            return
        }
        let nextRefillTime = generatorData.nextRefillTime
        let coolingStartTime = generatorData.coolingStartTime
        let currentTime = GameKit.TimeUtil.getCurrentTime() * 1000
        if (nextRefillTime != 0 && currentTime < (nextRefillTime * 1000)) {
            this.tile.clock.node.active = true
            this.tile.clock.progress = 0
            SpriteGray.SetGray(this.tile.icon, true)
            this.endtime = nextRefillTime * 1000
            this.starttime = coolingStartTime * 1000
            this.tile.HideShiningAnim()
        } else {
            this.tile.clock.node.active = false
            SpriteGray.SetGray(this.tile.icon, false)
            if (this.IfCanGenerate()) {
                this.tile.ShowShiningAnim()
            } else {
                this.tile.HideShiningAnim()
            }
        }
    }

    update(dt: number) {
        if (!this.tile || !this.tile.clock || !this.tile.clock.node.active) return
        let currentTime = GameKit.TimeUtil.getCurrentTime() * 1000
        if (currentTime >= this.endtime) {
            this.tile.clock.node.active = false
            SpriteGray.SetGray(this.tile.icon, false)
            this.onTileDataChanged()
            return
        }
        let totalTime = this.endtime - this.starttime
        let elapsedTime = currentTime - this.starttime
        let progress = totalTime > 0 ? elapsedTime / totalTime : 0
        progress = Math.max(0, Math.min(1, progress))
        this.tile.clock.progress = progress
    }

    blocksTouch() {
        return !!(this.tile && this.tile.clock && this.tile.clock.node.active)
    }

    shouldUpdate() {
        return !!(this.tile && this.tile.clock && this.tile.clock.node.active)
    }

    GetGeneratorInstanceId() {
        return this.generatorInstanceId
    }

    IfCanGenerate() {
        let generatorMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(this.tile.mergeId)
        if (!generatorMeta) {
            return false
        }
        if (this.generatorInstanceId == null || this.tile.envStatus != -1) {
            return false
        }
        let generatorData = Game.SUserMerge.GetGeneratorByInstanceId(this.generatorInstanceId)
        if (!generatorData) return false
        if (this.IfNeedOpen()) {
            return false
        }
        return true
    }

    IfNeedOpen() {
        if (this.generatorInstanceId == null || this.tile.envStatus != -1) {
            return false
        }
        let generatorData = Game.SUserMerge.GetGeneratorByInstanceId(this.generatorInstanceId)
        if (!generatorData) return false
        let onetimeDestroy = generatorData.onetimeDestroy
        let nextRefillTime = generatorData.nextRefillTime
        let remainingCount = generatorData.remainingCount
        let maxOutputCount = generatorData.maxOutputCount
        if (onetimeDestroy == 1 && nextRefillTime === 0 && remainingCount === maxOutputCount) {
            return true
        }
        return false
    }

    GetOpenTime() {
        let generateMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(this.tile.mergeId)
        return GameKit.TimeUtil.FormatSecondsToText(generateMeta.DelayTime())
    }

    tryResolveDoubleTapProduce(ctx: any) {
        if (!this.tile) return null
        let tx = this.tile.tx
        let ty = this.tile.ty
        if (!Game.SUserMerge.IfHasGeneratorDataByMergeTilePos(tx, ty)) {
            return null
        }
        if (this.IfNeedOpen()) {
            let generatorData = Game.SUserMerge.GetGeneratorByInstanceId(this.GetGeneratorInstanceId())
            if (!generatorData) return null
            return {
                intent: MergeTypes.MergeDoubleTapIntent.OPEN_MERGE_GENERATOR,
                mergeId: this.tile.GetMergeId(),
                instanceId: this.GetGeneratorInstanceId(),
                onetimeDestroy: generatorData.onetimeDestroy,
                remainingCount: generatorData.remainingCount,
                cellKey: tx + '_' + ty,
            }
        }

        let generateTilePos = ctx.getEmptyTilePos()
        if (!generateTilePos) {
            return { intent: MergeTypes.MergeDoubleTapIntent.NO_EMPTY_TILE }
        }
        let generatorMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(this.tile.GetMergeId())
        let canAfford = Game.ContentCheck.CheckContent(generatorMeta.ConsumeCountContent())

        console.log("tryResolveDoubleTapProduce_Ap():", Game.SUser.Ap(), "resources", generatorMeta.ConsumeCountContent(), "canAfford", canAfford);

        if (!canAfford || !this.IfCanGenerate()) {
            return { intent: MergeTypes.MergeDoubleTapIntent.GENERATE_CONSUME_FAIL }
        }
        let gidArr = Game.SUserMerge.GetGeneratorGidByMergeTilePos(tx, ty)
        if (!gidArr || gidArr[0] == null) {
            return { intent: MergeTypes.MergeDoubleTapIntent.GENERATE_CONSUME_FAIL }
        }
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.tile.mergeId)
        if (MergeTileFunctionUtil.useThreeToOneInsteadOfSpawn(meta)) {
            return { intent: MergeTypes.MergeDoubleTapIntent.OPEN_THREE_TO_ONE, mergeId: this.tile.GetMergeId() }
        }
        return {
            intent: MergeTypes.MergeDoubleTapIntent.GENERATE_ITEM,
            gid: gidArr[0],
            generateTilePos: generateTilePos,
            fromTilePos: { x: tx, y: ty },
            instanceId: gidArr[1],
            remainingCount: gidArr[2],
        }
    }
}

export { MergeGeneratorCapability }
export default MergeGeneratorCapability
