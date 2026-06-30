import { _decorator, Component, instantiate, Label, Node, Prefab, tween, Tween, UITransform, Vec3 } from 'cc';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';

const { ccclass, property } = _decorator;

const width3 = 450;
const width4 = 586;
const heightHave = 330;
const heightNo = 224;

@ccclass('RandomChestPanel')
export class RandomChestPanel extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public arrow: Node = null;
    @property(Node)
    public spJoker: Node = null;
    @property(Label)
    public labelJokerDes: Label = null;
    @property(Label)
    public labelJokerBack: Label = null;
    @property(Label)
    public labelJokerPurchase: Label = null;
    @property(Node)
    public spCard: Node = null;
    @property(Node)
    public spSpin: Node = null;
    @property(Node)
    public spCoin: Node = null;
    @property(Node)
    public spSerExp: Node = null;
    @property(Node)
    public spSerFood: Node = null;

    public pheight = 0;
    private closing = false;
    private bgInitPos: Vec3 = null;
    private arrowInitPos: Vec3 = null;

    onLoad() {
        if (this.bg) this.bgInitPos = this.bg.position.clone();
        if (this.arrow) this.arrowInitPos = this.arrow.position.clone();
    }

    show(packId: any) {
        const bgTransform = this.bg.getComponent(UITransform);
        if (!this.bgInitPos) this.bgInitPos = this.bg.position.clone();
        this.bg.setPosition(this.bgInitPos);
        bgTransform.setContentSize(width3, heightHave);

        if (this.arrow && this.arrowInitPos) {
            this.arrow.setPosition(this.arrowInitPos);
            this.arrow.setScale(this.arrow.scale.x, 1, this.arrow.scale.z);
        }

        this.spSpin.active = false;
        this.spCoin.active = false;
        this.spSerFood.active = false;
        this.spSerExp.active = false;
        this.spCard.active = false;
        this.spJoker.active = true;
        if (this.labelJokerBack && this.labelJokerBack.node) {
            Tween.stopAllByTarget(this.labelJokerBack.node);
            this.labelJokerBack.node.setScale(1, 1, 1);
        }

        const items = Meta.RandomPackMeta.FindItemsRange(packId);
        let haveJoker = false;
        let itemsCount = 0;
        for (const type in items) {
            if (type == Meta.RandomPackMeta.Types.Spin) {
                this.spSpin.active = true;
                this.setRangeLabels(this.spSpin, items[type], new Game.Content(Game.Content.Types.Ap, 0, 1).Name());
                itemsCount++;
            } else if (type == Meta.RandomPackMeta.Types.Coin) {
                this.spCoin.active = true;
                this.setRangeLabels(this.spCoin, items[type], new Game.Content(Game.Content.Types.Coin, 0, 1).Name());
                itemsCount++;
            } else if (type == Meta.RandomPackMeta.Types.ServantFood) {
                this.spSerFood.active = true;
                this.setRangeLabels(this.spSerFood, items[type], new Game.Content(Game.Content.Types.Item, 3, 1).Name());
                itemsCount++;
            } else if (type == Meta.RandomPackMeta.Types.ServantExp) {
                this.spSerExp.active = true;
                this.setRangeLabels(this.spSerExp, items[type], new Game.Content(Game.Content.Types.Item, 2, 1).Name());
                itemsCount++;
            } else if (type == Meta.RandomPackMeta.Types.ChestId) {
                this.spCard.active = true;
                const labelCount = GameKit.ControllerTable.GetComponent(this.spCard, 'labelCount', Label);
                const labelName = GameKit.ControllerTable.GetComponent(this.spCard, 'labelName', Label);
                const chestId = items[type].min;
                const chestMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId);
                labelCount.string = `${chestMeta.CardNum()}x`;
                labelName.string = GameKit.i18n.t('ContentNameCard');
                itemsCount++;

                if (chestMeta.JokerChestCount() > 0) {
                    haveJoker = true;
                    this.labelJokerDes.string = String.format(GameKit.i18n.t('RandomChestRate'), chestMeta.JokerChestCount());
                    this.labelJokerBack.string = String.format(GameKit.i18n.t('RandomChestBack'), Game.SUserCard.JokerGuarData(chestId), chestMeta.JokerChestGuar());
                    this.labelJokerPurchase.string = String.format(GameKit.i18n.t('RandomJockerChest'), Game.SUserCard.jokerCountData(chestId), chestMeta.JokerChestCount());
                    if (chestMeta.JokerChestCount() == 1) this.labelJokerDes.string = '';
                    if (chestMeta.JokerChestGuar() == 1) {
                        this.labelJokerBack.string = 'x 1';
                        labelCount.string = `${chestMeta.CardNum() - 1}x`;
                    }
                    if (chestMeta.JokerChestGuar() - Game.SUserCard.JokerGuarData(chestId) == 1) {
                        tween(this.labelJokerBack.node)
                            .repeatForever(tween<Node>().to(0.3, { scale: new Vec3(1.05, 1.05, 1) }).to(0.3, { scale: Vec3.ONE }))
                            .start();
                    }
                }
            }
        }

        if (!haveJoker) {
            this.spJoker.active = false;
            bgTransform.height = heightNo;
        }
        if (itemsCount >= 4) {
            bgTransform.width = width4;
        }

        if (UIRoot.instance && UIRoot.instance.winSize) {
            const margin = 20;
            const halfW = UIRoot.instance.winSize.width / 2;
            const panelHalfW = bgTransform.width / 2;
            const minX = -halfW + margin + panelHalfW;
            const maxX = halfW - margin - panelHalfW;
            const oldNodeX = this.node.position.x;
            let x = oldNodeX;
            if (x < minX) x = minX;
            else if (x > maxX) x = maxX;
            this.node.setPosition(x, this.node.position.y, this.node.position.z);

            const deltaX = x - oldNodeX;
            if (this.arrow && deltaX !== 0) {
                this.arrow.setPosition(this.arrow.position.x - deltaX, this.arrow.position.y, this.arrow.position.z);
            }
        }
    }

    private setRangeLabels(node: Node, item: any, name: string) {
        const labelCount = GameKit.ControllerTable.GetComponent(node, 'labelCount', Label);
        const labelName = GameKit.ControllerTable.GetComponent(node, 'labelName', Label);
        const min = BigNumber.format(item.min);
        const max = BigNumber.format(item.max);
        labelCount.string = min == max ? `${min}` : `${min}-${max}`;
        labelName.string = name;
    }

    callClose() {
        if (this.closing) return;
        this.closing = true;
        EnterCloseAnim.playClose(this.node);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.5);
    }

    static Show(packId: any, params: any, x?: any, y?: any) {
        UIRoot.instance.ShowCantClick();
        const resName = 'window/Item/RandomChestPanel';
        cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err) {
                Logs.Error('openModelWindow windowPath:' + resName + (err.message || err));
                DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                    RandomChestPanel.Show(packId, params, x, y);
                }, nullFunction);
                UIRoot.instance.CloseCantClick();
                return;
            }
            if (winPre == null) {
                UIRoot.instance.CloseCantClick();
                return;
            }

            const wnd = instantiate(winPre);
            wnd.parent = params.parent;
            wnd.setPosition(params.pos.x, params.pos.y + params.height / 2 + params.height / 10, wnd.position.z);
            const panel = wnd.getComponent(RandomChestPanel);
            panel.pheight = params.height;
            panel.show(packId);
            UIRoot.instance.CloseCantClick();
        });
    }
}

export default RandomChestPanel;
