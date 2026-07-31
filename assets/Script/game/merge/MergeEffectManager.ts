import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
import { HeChengShiTx } from './effect/HeChengShi_tx';
import { JueSeWanChengTx } from './effect/JueSeWanCheng_tx';
import { QiZiHeChengTx } from './effect/QiZiHeCheng_tx';
import { QiZiLuoDiTx } from './effect/QiZiLuoDi_tx';
import { ShaGePoSuiTx } from './effect/ShaGePoSui_tx';
import { ShouJiJinBiTx } from './effect/ShouJiJinBi_tx';
import { TiShiTx } from './effect/TiShi_tx';
import { CangKuTx } from './effect/CangKu_tx';
import { ShengChanQiTiShiTx } from './effect/ShengChanQiTiShi_tx';

const { ccclass, property } = _decorator;

function toParentLocalPosition (effectNode: Node, worldPos: Vec3) {
    const parent = effectNode.parent;
    const parentTransform = parent && parent.getComponent(UITransform);
    return parentTransform ? parentTransform.convertToNodeSpaceAR(worldPos) : worldPos;
}

function positionEffectNode (effectComponent: Component | null, worldPos: Vec3 | null) {
    if (!effectComponent || !worldPos) return false;
    const effectNode = effectComponent.node;
    if (effectNode && effectNode.parent) {
        effectNode.setPosition(toParentLocalPosition(effectNode, worldPos));
    }
    return true;
}

function prepareEffectOptions (effectComponent: Component | null, worldPos: Vec3 | null, options?: any) {
    if (!effectComponent || !worldPos) return null;
    const resolvedOptions = options || {};
    if (resolvedOptions.parent) return resolvedOptions;
    const effectNode = effectComponent.node;
    if (effectNode && effectNode.parent) {
        resolvedOptions.parent = effectNode.parent;
        resolvedOptions.position = toParentLocalPosition(effectNode, worldPos);
    }
    return resolvedOptions;
}

@ccclass('MergeEffectManager')
export class MergeEffectManager extends Component {
    @property(HeChengShiTx)
    public heChengShi_tx: HeChengShiTx | null = null;

    @property(JueSeWanChengTx)
    public JueSeWanCheng_tx: JueSeWanChengTx | null = null;

    @property(ShouJiJinBiTx)
    public ShouJiJinBi_tx: ShouJiJinBiTx | null = null;

    @property(TiShiTx)
    public TiShi_tx: TiShiTx | null = null;

    @property(ShaGePoSuiTx)
    public ShaGePoSui_tx: ShaGePoSuiTx | null = null;

    @property(QiZiLuoDiTx)
    public QiZiLuoDi_tx: QiZiLuoDiTx | null = null;

    @property(QiZiHeChengTx)
    public QiZiHeCheng_tx: QiZiHeChengTx | null = null;

    @property(CangKuTx)
    public CangKu_tx: CangKuTx | null = null;

    @property(ShengChanQiTiShiTx)
    public ShengChanQiTiShi_tx: ShengChanQiTiShiTx | null = null;

    onLoad () {
    }

    start () {
    }

    PlayHeChengShiEnter (worldPos: Vec3 | null) {
        if (!positionEffectNode(this.heChengShi_tx, worldPos)) return;
        this.heChengShi_tx!.PlayEnter();
    }

    PlayHeChengShiLeave () {
        if (!this.heChengShi_tx) return;
        this.heChengShi_tx.PlayLeave();
    }

    PlayJueSeWanChengEnter (worldPos: Vec3 | null) {
        if (!positionEffectNode(this.JueSeWanCheng_tx, worldPos)) return;
        this.JueSeWanCheng_tx!.PlayEnter();
    }

    PlayShouJiJinBiEnter (worldPos: Vec3 | null, options?: any) {
        if (!this.ShouJiJinBi_tx || !worldPos) return;
        if (options && options.parent) {
            this.ShouJiJinBi_tx.PlayEnter(options);
            return;
        }
        positionEffectNode(this.ShouJiJinBi_tx, worldPos);
        this.ShouJiJinBi_tx.PlayEnter(options);
    }

    PlayTiShiEnter (worldPos: Vec3 | null, options?: any) {
        const resolvedOptions = prepareEffectOptions(this.TiShi_tx, worldPos, options);
        if (!resolvedOptions || !this.TiShi_tx) return;
        this.TiShi_tx.PlayEnter(resolvedOptions);
    }

    PlayShaGePoSuiEnter (worldPos: Vec3 | null, options?: any) {
        const resolvedOptions = prepareEffectOptions(this.ShaGePoSui_tx, worldPos, options);
        if (!resolvedOptions || !this.ShaGePoSui_tx) return;
        this.ShaGePoSui_tx.PlayEnter(resolvedOptions);
    }

    PlayQiZiLuoDiEnter (worldPos: Vec3 | null, options?: any) {
        const resolvedOptions = prepareEffectOptions(this.QiZiLuoDi_tx, worldPos, options);
        if (!resolvedOptions || !this.QiZiLuoDi_tx) return;
        this.QiZiLuoDi_tx.PlayEnter(resolvedOptions);
    }

    PlayQiZiHeChengEnter (worldPos: Vec3 | null, options?: any) {
        const resolvedOptions = prepareEffectOptions(this.QiZiHeCheng_tx, worldPos, options);
        if (!resolvedOptions || !this.QiZiHeCheng_tx) return;
        this.QiZiHeCheng_tx.PlayEnter(resolvedOptions);
    }

    PlayCangKuPutEnter (worldPos: Vec3 | null) {
        if (!positionEffectNode(this.CangKu_tx, worldPos)) return;
        this.CangKu_tx!.PlayPutEnter();
    }

    PlayCangKuPutLeave () { this.CangKu_tx?.PlayPutLeave(); }
    CancelCangKuPutPreview () { this.CangKu_tx?.CancelPutPreview(); }

    PlayCangKuTakeOut (worldPos: Vec3 | null) {
        const options = prepareEffectOptions(this.CangKu_tx, worldPos);
        if (options && this.CangKu_tx) this.CangKu_tx.PlayTakeOut(options);
    }

    PlayShengChanQiTiShiEnter (worldPos: Vec3 | null) {
        const options = prepareEffectOptions(this.ShengChanQiTiShi_tx, worldPos);
        if (options && this.ShengChanQiTiShi_tx) this.ShengChanQiTiShi_tx.PlayEnter(options);
    }
}

export default MergeEffectManager;
