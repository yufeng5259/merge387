import { _decorator, Button, Component, Label, Node, Sprite, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import CardChangeStarItem from './CardChangeStarItem';

const { ccclass, property } = _decorator;

@ccclass('CardTradeWindow')
export default class CardTradeWindow extends UIWindow {
    public static windowPath = 'Card/CardTradeWindow';

    @property(Node)
    carditem: Node | null = null;

    @property(Node)
    itemParent: Node | null = null;

    @property(Sprite)
    ProgressBar: Sprite | null = null;

    @property(Label)
    ProgressBarLabel: Label | null = null;

    @property(Sprite)
    ChestICon: Sprite | null = null;

    @property(Node)
    SelectIcon: Node | null = null;

    @property(Button)
    TradeButton: Button | null = null;

    @property(Component)
    Scroll: any = null;

    showAuto = false;
    ID: any = null;
    changeNum = 0;
    CardNum = 0;
    CardItem: Record<string, number> = {};
    autoSelectList: any[] = [];
    aloneCardList: any[] = [];
    ManuallyCardList: any[] = [];
    surplusCardList: any[] = [];
    id_list: any[] = [];
    newArray: any[][] = [];

    private fitByHeight(sprite: Sprite | null, height?: number) {
        if (!sprite || !sprite.spriteFrame) return;
        const rect = sprite.spriteFrame.rect;
        const targetHeight = height || rect.height;
        if (!rect.height || !targetHeight) return;
        const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
        transform.setContentSize(rect.width * targetHeight / rect.height, targetHeight);
    }

    onShow(showParams: any) {
        this.showAuto = false;
        this.ID = showParams.id;
        if (this.ChestICon) {
            this.ChestICon.spriteFrame = showParams.icon;
            this.fitByHeight(this.ChestICon);
        }
        this.changeNum = showParams.changeNum;
        this.CardNum = 0;
        this.CardItem = {};
        this.autoSelectList = [];
        this.aloneCardList = [];
        this.ManuallyCardList = [];
        this.onCardPage();
        this.onAutoSelect();
        this.onShowCard();

        if (this.ProgressBarLabel) this.ProgressBarLabel.string = `${this.CardNum}/${this.changeNum}`;
        if (this.ProgressBar) this.ProgressBar.fillRange = this.CardNum / this.changeNum;
    }

    get_card_AllSurplus() {
        let all_card_meta_id_list = Object.keys(Meta.MetaManager.GetMetas(Meta.MetaType.Card)).map((v) => { return parseInt(v); });
        let able_card_meta_id_list = all_card_meta_id_list.filter(v => {
            let card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, v);
            if (Game.SUserCard.CardNum(card_meta.Id()) <= 1) return false;
            return true;
        });
        able_card_meta_id_list.sort(function (a, b) {
            let card_meta_a = Meta.MetaManager.GetMeta(Meta.MetaType.Card, a);
            let card_meta_b = Meta.MetaManager.GetMeta(Meta.MetaType.Card, b);
            return card_meta_a.Rare() - card_meta_b.Rare();
        });
        return able_card_meta_id_list;
    }

    onCardPage() {
        this.surplusCardList = this.get_card_AllSurplus();
        let j = 0;
        this.surplusCardList.forEach(x => {
            this.CardItem[x] = 0;
            let card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, x);
            for (let i = 0; i < Game.SUserCard.CardNum(card_meta.Id()) - 1; i++) {
                this.aloneCardList[j] = x;
                j++;
            }
        });
        this.aloneCardList.sort(function (a, b) {
            let card_meta_a = Meta.MetaManager.GetMeta(Meta.MetaType.Card, a);
            let card_meta_b = Meta.MetaManager.GetMeta(Meta.MetaType.Card, b);
            return card_meta_a.Rare() - card_meta_b.Rare();
        });
    }

    deleteRepetition() {
        let deleteRepetitionList = this.aloneCardList.slice();
        this.ManuallyCardList.forEach(x => {
            if (deleteRepetitionList.indexOf(x) >= 0) {
                let pos = deleteRepetitionList.indexOf(x);
                deleteRepetitionList.splice(pos, 1);
            }
        });
        deleteRepetitionList.sort(function (a, b) {
            let card_meta_a = Meta.MetaManager.GetMeta(Meta.MetaType.Card, a);
            let card_meta_b = Meta.MetaManager.GetMeta(Meta.MetaType.Card, b);
            return card_meta_a.Rare() - card_meta_b.Rare();
        });
        return deleteRepetitionList;
    }

    onAutoSelect() {
        this.showAuto = !this.showAuto;
        if (this.SelectIcon) this.SelectIcon.active = this.showAuto;
        let add = 0;
        if (this.showAuto) this.autoSelect();
        this.autoSelectList.forEach(x => {
            if (this.showAuto) {
                add = 1;
            } else {
                add = -1;
            }
            this.onManualSelect(add, x);
        });
        if (!this.showAuto) {
            this.autoSelectList = [];
        }
        this.Scroll.flushData();
    }

    autoSelect() {
        let surplusCard = this.deleteRepetition();
        let needStar = this.changeNum - this.CardNum;
        let num = 0;
        let i = 0;
        while ((num < needStar) && (i < surplusCard.length)) {
            let id = surplusCard[i];
            let cardmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, id);
            let cardRare = num + cardmeta.Rare();
            num = cardRare;
            this.autoSelectList.push(id);
            i++;
            if (cardRare >= needStar) {
                return;
            }
        }
    }

    onManuallyClick() {
        this.showAuto = false;
        if (this.SelectIcon) this.SelectIcon.active = this.showAuto;
        this.autoSelectList = [];
    }

    onShowCard() {
        this.id_list = [];
        this.Scroll.clear();
        let index = 0;
        this.newArray = [];

        while (index < this.surplusCardList.length) {
            this.newArray.push(this.surplusCardList.slice(index, index += 3));
        }
        for (let i = 0; i < this.newArray.length; i++) {
            this.id_list.push(i);
        }
        this.Scroll.setItem(this.id_list, this.initItem.bind(this));
    }

    initItem(index: any, id: any, node: Node) {
        let meta = this.newArray[id];
        for (let i = 0; i < 3; i++) {
            let spinItem = GameKit.ControllerTable.GetNode(node, 'item' + (i + 1).toString());
            if (!meta[i]) {
                spinItem.active = false;
                return;
            }
            spinItem.active = true;
            let meta_item = meta[i];
            const cardItem = spinItem.getComponent(CardChangeStarItem);
            if (cardItem) cardItem.show(meta_item, this.CardItem[meta_item]);
        }
    }

    onManualSelect(num: number, id: any) {
        this.CardNum += num * Meta.MetaManager.GetMeta(Meta.MetaType.Card, id).Rare();
        if (this.ProgressBarLabel) this.ProgressBarLabel.string = `${this.CardNum}/${this.changeNum}`;
        if (this.ProgressBar) this.ProgressBar.fillRange = this.CardNum / this.changeNum;
        let pos = this.ManuallyCardList.indexOf(id);
        if (num > 0) {
            this.ManuallyCardList.push(id);
        } else {
            this.ManuallyCardList.splice(pos, 1);
        }
        this.CardItem[id] += num;
        if (this.TradeButton) this.TradeButton.interactable = !(this.CardNum < this.changeNum);
    }

    onBuy() {
        let self = this;
        let req = SR.SRCard.changeStar(this.ID, this.ManuallyCardList);
        req.SetCallBack(function (res: any) {
            CardChestOpenWindow.tryShow();
            self.callClose();
        });
        req.Send();
    }

    onClose() {

    }

    callClose() {
        this.closeAnim();
    }
}
