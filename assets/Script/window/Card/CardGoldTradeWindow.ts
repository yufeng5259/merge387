import { _decorator, Label, Node } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import CardModel from './CardModel';

const { ccclass, property } = _decorator;

@ccclass('CardGoldTradeWindow')
export default class CardGoldTradeWindow extends UIWindow {
    public static windowPath = 'Card/CardGoldTradeWindow';

    @property(CardModel)
    card1: CardModel | null = null;

    @property(Node)
    cardNew1: Node | null = null;

    @property(CardModel)
    card2: CardModel | null = null;

    @property(Node)
    cardNew2: Node | null = null;

    @property(Label)
    labelName: Label | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    meta: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;

        let cardId1 = this.meta.Param().cardId1;
        if (this.card1) {
            this.card1.show(cardId1, 'no-check');
            this.card1.show_more_count('check');
        }
        let cardMeta1 = Meta.MetaManager.GetMeta(Meta.MetaType.Card, cardId1);
        if (this.cardNew1) this.cardNew1.active = Game.SUserCard.CardNum(cardId1) <= 0;

        let cardId2 = this.meta.Param().cardId2;
        if (this.card2) {
            this.card2.show(cardId2, 'no-check');
            this.card2.show_more_count('check');
        }
        let cardMeta2 = Meta.MetaManager.GetMeta(Meta.MetaType.Card, cardId2);
        if (this.cardNew2) this.cardNew2.active = Game.SUserCard.CardNum(cardId2) <= 0;

        if (this.labelName) this.labelName.string = cardMeta1.Name() + ' & ' + cardMeta2.Name();

        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        this.closeAnim(() => {
            if (!this.childWindowChain) {
                UIRoot.instance.openChildWindow('CardAllSetWindow');
            }
        });
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = this.meta.EndTime() - currentTime;

            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
            }

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }
}
