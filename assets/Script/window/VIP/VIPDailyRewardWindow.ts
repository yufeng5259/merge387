import { _decorator, instantiate, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('VIPDailyRewardWindow')
export default class VIPDailyRewardWindow extends UIWindow {
    static windowPath = 'VIP/VIPDailyRewardWindow';

    @property(ContentModel)
    spDailyItem: ContentModel | null = null;

    @property(Node)
    spDailyItemParent: Node | null = null;

    onShow(showParams: any) {
        this.spDailyItemParent.destroyAllChildren();
        let rewards = Game.Content.FromStrings(G.GameConstance.vipDailyReward);
        rewards.forEach((reward) => {
            let itemHandle = instantiate(this.spDailyItem.node);
            itemHandle.active = true;
            itemHandle.parent = this.spDailyItemParent;
            itemHandle.getComponent(ContentModel).show(reward, null);
        });

        this.scheduleOnce(() => {
            let chest = showParams.vipDailyReward.UserCardChest;
            if (chest) {
                if (chest.cards.length == 1) {
                    UIRoot.instance.openChildWindow('CardCollectWindow', { id: chest.cards[0], nogo: true, isVip: true });
                } else {
                    UIRoot.instance.openChildWindow('CardChestOpenWindow', { chest: chest });
                }
            }
        }, 0.2);
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }
}
