import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';
import CardModel from './CardModel';

const { ccclass, property } = _decorator;

const cardsNormalY = -162;
const cardsSetsY = -133;

@ccclass('JokerCardWindow')
export default class JokerCardWindow extends UIWindow {
    public static windowPath = 'Card/JokerCardWindow';

    @property(Label)
    labelTimer: Label | null = null;

    @property(Label)
    labelTimer2: Label | null = null;

    @property(Button)
    btnChange: Button | null = null;

    @property(Component)
    svt: any = null;

    @property(Node)
    spChooseOnly_off: Node | null = null;

    @property(Node)
    spChooseOnly: Node | null = null;

    @property(Node)
    panelClose: Node | null = null;

    @property(Node)
    panelChose: Node | null = null;

    @property(CardModel)
    choseCard: CardModel | null = null;

    @property(Node)
    choseCardNew: Node | null = null;

    @property(Label)
    choseCardLabel: Label | null = null;

    chooseId: any = null;
    chooseIndex: any = null;
    chooseItemHandle: Node | null = null;
    showOnly = false;
    leftTime: number | null = null;
    CardThemeMeta: any = null;
    Card_issue: any = null;

    onShow(showParams: any) {
        this.chooseId = null;
        this.chooseIndex = null;
        this.chooseItemHandle = null;

        this.showOnly = false;
        if (this.spChooseOnly) this.spChooseOnly.active = this.showOnly;
        if (this.spChooseOnly_off) this.spChooseOnly_off.active = !this.showOnly;

        this.updateChangeButton();
        this.updateView();

        this.leftTime = 1;
        if (this.panelClose) this.panelClose.active = false;
        if (this.panelChose) this.panelChose.active = false;
    }

    onClose() {

    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = Game.SUserCard.JokerTime() - currentTime;

            if (this.labelTimer) this.labelTimer.string = GameKit.i18n.t('JokerCardTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
            if (this.labelTimer2) this.labelTimer2.string = GameKit.i18n.t('JokerCardTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);

            if (this.leftTime <= 0) {
                this.leftTime = null;
                this.closeAnim();
            }
        }
    }

    updateView() {
        this.CardThemeMeta = Game.ActivityManager.GetActiveGameActivityByType(Meta.ActivityMeta.SubTypes.CardTheme);

        this.Card_issue = this.CardThemeMeta.Card_issue();
        let cardMetas = Meta.CardSetsMeta.getCardMetasByIssue(this.Card_issue);
        let ids = Object.keys(cardMetas);
        let data: any[] = [];
        let c = 0;
        ids.forEach(cid => {
            if (this.showOnly && Game.SUserCard.HaveCard(cid)) return;
            let cardMeta = cardMetas[cid];
            if (cardMeta.MinVillage() > Game.SUserVillage.MapId() || cardMeta.SetMeta().MinVillage() > Game.SUserVillage.MapId()) return;
            if (data.length > 0 && cardMeta.SetId() != data[data.length - 1].setId) c = 0;
            if (c == 0) data.push({});
            data[data.length - 1].setId = cardMeta.SetId();
            if (data[data.length - 1].cards == null) data[data.length - 1].cards = [];
            data[data.length - 1].cards.push(cardMeta);
            c++;
            if (c == 3) c = 0;
        });

        let svtids = [];
        for (let i = 0; i < data.length; i++) {
            svtids.push(i);
        }

        this.svt.setItem(svtids, (index: number, id: any, node: Node) => {
            let bar = GameKit.ControllerTable.GetNode(node, 'bar');
            let labelSetName = GameKit.ControllerTable.GetComponent(node, 'labelSetName', Label);
            let reward1 = GameKit.ControllerTable.GetComponent(node, 'reward1', 'ContentModel');
            let spPlus = GameKit.ControllerTable.GetNode(node, 'spPlus');
            let reward2 = GameKit.ControllerTable.GetComponent(node, 'reward2', 'ContentModel');
            let card1 = GameKit.ControllerTable.GetNode(node, 'card1');
            let card2 = GameKit.ControllerTable.GetNode(node, 'card2');
            let card3 = GameKit.ControllerTable.GetNode(node, 'card3');
            let cards = [card1, card2, card3];
            let setcomp1 = GameKit.ControllerTable.GetNode(node, 'setcomp1');
            let setcomp2 = GameKit.ControllerTable.GetNode(node, 'setcomp2');
            let setcomp3 = GameKit.ControllerTable.GetNode(node, 'setcomp3');
            let setcomps = [setcomp1, setcomp2, setcomp3];
            let cardNew1 = GameKit.ControllerTable.GetNode(node, 'cardNew1');
            let cardNew2 = GameKit.ControllerTable.GetNode(node, 'cardNew2');
            let cardNew3 = GameKit.ControllerTable.GetNode(node, 'cardNew3');
            let cardNews = [cardNew1, cardNew2, cardNew3];
            let cardChoose1 = GameKit.ControllerTable.GetNode(node, 'cardChoose1');
            let cardChoose2 = GameKit.ControllerTable.GetNode(node, 'cardChoose2');
            let cardChoose3 = GameKit.ControllerTable.GetNode(node, 'cardChoose3');
            let cardChooses = [cardChoose1, cardChoose2, cardChoose3];

            let da = data[index];
            let shc = Game.SUserCard.SetHaveCards(da.setId);
            if (index > 0 && data[index - 1].setId == da.setId) {
                bar.active = false;
                card1.setPosition(card1.position.x, cardsSetsY, card1.position.z);
                card2.setPosition(card2.position.x, cardsSetsY, card2.position.z);
                card3.setPosition(card3.position.x, cardsSetsY, card3.position.z);
            } else {
                bar.active = true;
                card1.setPosition(card1.position.x, cardsNormalY, card1.position.z);
                card2.setPosition(card2.position.x, cardsNormalY, card2.position.z);
                card3.setPosition(card3.position.x, cardsNormalY, card3.position.z);

                let setMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardSets, da.setId);
                cce.loadRes(`Card/common/jc_bar_${setMeta.Color()}`, SpriteFrame, (err: any, res: SpriteFrame) => {
                    if (!err && bar) {
                        bar.getComponent(Sprite).spriteFrame = res;
                    }
                });
                labelSetName.string = `${setMeta.Name()} ${shc.length}/9`;
                let rewards = setMeta.Reward();
                reward1.show(rewards[0]);
                spPlus.active = rewards.length > 1;
                reward2.node.active = rewards.length > 1;
                if (rewards[1]) reward2.show(rewards[1]);
            }

            let includeChoose = false;
            for (let i = 0; i < 3; i++) {
                cards[i].active = false;
                if (da.cards[i]) {
                    let cardMeta = da.cards[i];
                    cards[i].active = true;
                    const cardModel = cards[i].getComponent(CardModel);
                    if (cardModel) {
                        cardModel.show(cardMeta.Id(), 'no-check');
                        cardModel.show_more_count('check');
                    }
                    setcomps[i].active = shc.length == 8 && shc.indexOf(cardMeta.Id()) < 0;
                    cardNews[i].active = Game.SUserCard.CardNum(cardMeta.Id()) <= 0;
                    cardChooses[i].active = this.chooseId == cardMeta.Id();

                    cards[i].targetOff(this);
                    cards[i].on('click', function (this: JokerCardWindow) {
                        this.updateChooseCard(cardMeta.Id(), i + 1, node);
                        cardChooses[i].active = this.chooseId == cardMeta.Id();
                    }.bind(this), this);

                    if (cardMeta.Id() == this.chooseId) {
                        includeChoose = true;
                        this.chooseItemHandle = node;
                    }
                }
            }
            if (this.chooseItemHandle == node && !includeChoose) this.chooseItemHandle = null;
        });
    }

    updateChangeButton() {
        if (this.btnChange) this.btnChange.interactable = this.chooseId != null;
    }

    updateChooseCard(id: any, index: any, itemHandle: Node) {
        if (this.chooseId == id) {
            if (this.chooseItemHandle != null) {
                let cardChoose = GameKit.ControllerTable.GetNode(this.chooseItemHandle, 'cardChoose' + this.chooseIndex);
                cardChoose.active = false;
            }
            this.chooseId = null;
            this.chooseIndex = null;
            this.chooseItemHandle = null;
        } else {
            if (this.chooseItemHandle != null) {
                let cardChoose = GameKit.ControllerTable.GetNode(this.chooseItemHandle, 'cardChoose' + this.chooseIndex);
                cardChoose.active = false;
            }
            this.chooseId = id;
            this.chooseIndex = index;
            this.chooseItemHandle = itemHandle;
        }
        this.updateChangeButton();
    }

    callClose() {
        this.closeAnim();
    }

    callWantClose() {
        if (!this.panelClose) return;
        this.panelClose.active = true;
        EnterCloseAnim.playEnter(this.panelClose);
    }

    callWantContinue() {
        if (this.panelClose) this.panelClose.active = false;
    }

    callChange() {
        if (!this.panelChose || !this.choseCard || !this.choseCardNew || !this.choseCardLabel) return;
        this.panelChose.active = true;
        EnterCloseAnim.playEnter(this.panelChose);
        this.choseCard.show(this.chooseId, 'no-check');
        this.choseCard.show_more_count('check');
        this.choseCardNew.active = !Game.SUserCard.HaveCard(this.chooseId);
        let cardMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, this.chooseId);
        if (!cardMeta) {

        }
        this.choseCardLabel.string = String.format(GameKit.i18n.t('JokerCardChoseDes'), cardMeta.Name());
    }

    callChangeConfirm() {
        let req = SR.SRCard.changeJoker(this.chooseId);
        req.SetCallBack(() => {
            this.closeAnim();
            UIRoot.instance.openChildWindow('CardCollectWindow', { id: this.chooseId });
        });
        req.Send();
    }

    callChangeCancel() {
        if (this.panelChose) this.panelChose.active = false;
    }

    callOnly() {
        this.showOnly = !this.showOnly;
        if (this.spChooseOnly) this.spChooseOnly.active = this.showOnly;
        if (this.spChooseOnly_off) this.spChooseOnly_off.active = !this.showOnly;

        this.chooseItemHandle = null;
        this.updateView();
        this.svt.ScrollToIndexByTime(0, 0.3);
    }
}
