import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('PassPortBadge')
export class PassPortBadge extends Component {
    public activityData: any = null;
    public curLv = 0;
    public unReceive_freeLevels: number[] = [];
    public unReceive_buyLevels: number[] = [];

    public onLoad() {
        this.UpdateActiveButton();
        GameKit.GameEvent.RegisterEvent('passortCollect', 'Game', (data: any) => {
            this.node.active = data;
        });
    }

    public onDestroy() {
        GameKit.GameEvent.UnRegisterEvent('passortCollect', 'Game');
    }

    public UpdateActiveButton() {
        this.activityData = Game.SUserActivity.GetPassportCollectFlagData();
        if (!this.activityData) {
            return;
        }

        this.curLv = Math.max(this.activityData.freeLevel, this.activityData.buyLevel);
        this.unReceive_freeLevels = [];
        for (let index = 0; index <= this.curLv; index++) {
            if (!this.activityData.received_free.contains(index)) {
                this.unReceive_freeLevels.push(index);
            }
        }

        this.unReceive_buyLevels = [];
        for (let index = 0; index <= this.curLv; index++) {
            if (!this.activityData.received_passport.contains(index)) {
                this.unReceive_buyLevels.push(index);
            }
        }

        this.node.active = this.unReceive_freeLevels.length > 0 || this.unReceive_buyLevels.length > 0;
    }
}
