import { _decorator, sys } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import CardModel from './CardModel';

const { ccclass, property } = _decorator;

@ccclass('CardJoinGroupWindow')
export default class CardJoinGroupWindow extends UIWindow {
    public static windowPath = 'Card/CardJoinGroupWindow';

    @property(CardModel)
    card1: CardModel | null = null;

    @property(CardModel)
    card2: CardModel | null = null;

    onShow(showParams?: any) {
        if (this.card1) {
            this.card1.show(607, 'no-check');
            this.card1.show_more_count('reset');
        }
        if (this.card2) {
            this.card2.show(407, 'no-check');
            this.card2.show_more_count('reset');
        }
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callOpen() {
        sys.openURL('https://www.facebook.com/groups/1146240922885406/');
        this.closeAnim();
    }

    static TryShow() {
        if (!G.GameConfig.fbGroupCard) return;
        if (!Game.SUser.IsFacebook()) return;
        let c = GameKit.DataCache.GetData('CardJoinGroupWindow_count');
        if (c == null) c = 2;
        c++;
        if (c >= 5) {
            setTimeout(() => {
                UIRoot.instance.openChildWindow('CardJoinGroupWindow');
            }, 100);
            c = 0;
        }
        GameKit.DataCache.SetData('CardJoinGroupWindow_count', c);
    }
}
