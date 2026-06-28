import { _decorator, instantiate, Label, Node, SpriteFrame } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewItem } from '../../GameKit/ui/ScrollViewItem';

const { ccclass, property } = _decorator;

@ccclass('CardChangeWindow')
export default class CardChangeWindow extends UIWindow {
    public static windowPath = 'Card/CardChangeWindow';

    @property(Label)
    starsNumLabel: Label | null = null;

    @property(Node)
    starChestItem: Node | null = null;

    @property(Node)
    starChestPageNode: Node | null = null;

    @property([SpriteFrame])
    chestIconNode: SpriteFrame[] = [];

    params: any = null;
    item: Node | null = null;

    onShow(showParams: any) {
        this.params = showParams.res;
        this.onShowStarsNum();
        this.onstarCardButton();
    }

    get_card_Allstar() {
        let all_card_meta_id_list = Object.keys(Meta.MetaManager.GetMetas(Meta.MetaType.Card)).map((v) => { return parseInt(v); });
        let StarNum = 0;
        all_card_meta_id_list.filter(v => {
            let card_meta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, v);
            if (Game.SUserCard.CardNum(card_meta.Id()) <= 1) { return false; }
            StarNum += ((Game.SUserCard.CardNum(card_meta.Id()) - 1) * (card_meta.Rare()));
            return true;
        });
        return StarNum;
    }

    onShowStarsNum() {
        if (this.starsNumLabel) this.starsNumLabel.string = this.get_card_Allstar() + 'card star';
    }

    onstarCardButton() {
        let starSVData = new Array();
        for (let i = 0; i < 3; i++) {
            starSVData.push(i + 1);
        }
        this.setItem(starSVData, this.initStarChest.bind(this), this.starChestItem, this.starChestPageNode);
    }

    initStarChest(id: number, node: Node) {
        let starItem = node.getComponent('CardChestItem') as any;
        let icon = this.chestIconNode[id - 1];
        starItem.onShow(id, icon, this.params);
    }

    setItem(data: any[], initFunc: Function, items: Node | null, parent: Node | null) {
        this.item = items;
        if (this.item) this.item.active = false;
        if (!this.item || !parent) return;

        let index = 0;
        data.forEach(function (this: CardChangeWindow, id: any) {
            let itemHandle = instantiate(this.item!);
            itemHandle.active = true;
            itemHandle.parent = parent;

            let scItem = itemHandle.getComponent(ScrollViewItem);
            if (!scItem) return;
            scItem.index = index;
            scItem.id = id;
            scItem.registerInit(initFunc);
            if (initFunc) initFunc(scItem.id, scItem.node);
            index++;
        }.bind(this));
    }

    onClose() {

    }

    callClose() {
        this.closeAnim();
    }
}
