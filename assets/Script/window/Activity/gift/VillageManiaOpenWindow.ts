import { _decorator, Button, Label } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('VillageManiaOpenWindow')
export default class VillageManiaOpenWindow extends UIWindow {
    public static windowPath = 'Activity/gift/VillageManiaOpenWindow';

    @property(Button)
    goButton: Button | null = null;

    @property(Label)
    timeLabel: Label | null = null;

    meta: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        if (this.timeLabel) this.timeLabel.node.active = true;
        if (this.goButton) this.goButton.interactable = true;
        this.leftTime = 0;
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;
            if (this.timeLabel) {
                this.timeLabel.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
            }
            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Village, () => { Logs.Warning('VillageManiaOpenWindow:47 callGo'); }); });
    }
}
