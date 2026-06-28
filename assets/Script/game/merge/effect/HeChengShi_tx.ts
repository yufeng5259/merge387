import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HeChengShiTx')
export class HeChengShiTx extends Component {
    @property(sp.Skeleton)
    public heChengShi_tx_01: sp.Skeleton | null = null;

    @property(sp.Skeleton)
    public heChengShi_tx_02: sp.Skeleton | null = null;

    public _isEntered = false;
    public _isLeaving = false;

    onLoad () {
        this._isEntered = false;
        this._isLeaving = false;
        this.node.active = false;
    }

    start () {
    }

    PlayEnter () {
        if (!this.heChengShi_tx_01 || !this.heChengShi_tx_02) return;
        if (this._isEntered && !this._isLeaving) return;

        this._isEntered = true;
        this._isLeaving = false;
        this.heChengShi_tx_01.setCompleteListener(null);

        this.node.active = true;
        this.heChengShi_tx_02.node.active = true;
        this.heChengShi_tx_01.node.active = true;
        this.heChengShi_tx_02.setAnimation(0, 'HeChengShi_gs_dh', true);
        this.heChengShi_tx_01.setAnimation(0, 'HeChengShi_gq_dh_chuxian', false);
    }

    PlayLeave () {
        if (!this.heChengShi_tx_01 || !this.heChengShi_tx_02) return;
        if (!this._isEntered && !this._isLeaving) {
            this.heChengShi_tx_02.node.active = false;
            this.heChengShi_tx_01.node.active = false;
            this.node.active = false;
            return;
        }

        this._isEntered = false;
        this._isLeaving = true;
        this.node.active = true;
        this.heChengShi_tx_02.node.active = false;
        this.heChengShi_tx_01.node.active = true;

        this.heChengShi_tx_01.setCompleteListener(() => {
            if (!this._isLeaving || !this.heChengShi_tx_01) return;
            this._isLeaving = false;
            this.heChengShi_tx_01.node.active = false;
            this.node.active = false;
            this.heChengShi_tx_01.setCompleteListener(null);
        });
        this.heChengShi_tx_01.setAnimation(0, 'HeChengShi_gq_dh_xiaoshi', false);
    }
}

export default HeChengShiTx;
