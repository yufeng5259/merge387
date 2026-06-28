import { _decorator, Component, Node } from 'cc';
import CardModel from '../../../window/Card/CardModel';
const { ccclass, property } = _decorator;

@ccclass('CardGoldTradeExtra')
export class CardGoldTradeExtra extends Component {
    @property(CardModel)
    public card1: CardModel | null = null;
    @property(Node)
    public cardNew1: Node | null = null;
    @property(CardModel)
    public card2: CardModel | null = null;
    @property(Node)
    public cardNew2: Node | null = null;

    Show (centerWindow: any, activityMeta: any) {
        const meta = activityMeta;
        const cardId1 = meta.Param().cardId1;
        if (this.card1) {
            this.card1.show(cardId1, "no-check");
            this.card1.show_more_count("check");
        }
        if (this.cardNew1) this.cardNew1.active = Game.SUserCard.CardNum(cardId1) <= 0;

        const cardId2 = meta.Param().cardId2;
        if (this.card2) {
            this.card2.show(cardId2, "no-check");
            this.card2.show_more_count("check");
        }
        if (this.cardNew2) this.cardNew2.active = Game.SUserCard.CardNum(cardId2) <= 0;
    }

}
