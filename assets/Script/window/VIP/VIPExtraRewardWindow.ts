import { _decorator, instantiate, Label, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('VIPExtraRewardWindow')
export default class VIPExtraRewardWindow extends UIWindow {
    static windowPath = 'VIP/VIPExtraRewardWindow';

    @property(ContentModel)
    spDailyItem: ContentModel | null = null;

    @property(Node)
    spDailyItemParent: Node | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    leftTime: number | null = null;

    onShow(showParams: any) {
        this.spDailyItemParent.destroyAllChildren();
        let rewards = Game.SUserStatus.VipExtraReward();
        rewards.forEach((reward) => {
            let itemHandle = instantiate(this.spDailyItem.node);
            itemHandle.parent = this.spDailyItemParent;
            itemHandle.getComponent(ContentModel).show(reward, null);
        });

        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = Game.SUserStatus.VipExtraTime() - currentTime + Game.SUserStatus.VipExtraTimeLast();

            this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);

            if (this.leftTime <= 0) {
                this.leftTime = null;
                this.closeAnim();
            }
        }
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        this.closeAnim();
        UIRoot.instance.openChildWindow('VIPGetWindow');
    }
}
