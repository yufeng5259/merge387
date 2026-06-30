import { _decorator, Button, Component, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
import { SpriteGray } from '../../GameKit/render/SpriteGray';
import { LabelGray } from '../../GameKit/render/LabelGray';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';
import { fitByHeight } from '../../GameKit/render/fixedSizeRatio';
import RandomChestPanel from '../Item/RandomChestPanel';

const { ccclass, property } = _decorator;

@ccclass('ShopJockerChestItem')
export class ShopJockerChestItem extends Component {
    @property(Sprite)
    public icon: Sprite | null = null;

    @property(Label)
    public itemName: Label | null = null;

    @property(Label)
    public itemNameGray: Label | null = null;

    @property(Label)
    public price: Label | null = null;

    @property(Node)
    public soldOutNode: Node | null = null;

    @property(Label)
    public gailv: Label | null = null;

    @property(Node)
    public gailvNode: Node | null = null;

    @property(Node)
    public hot: Node | null = null;

    public meta: any = null;

    public start() {
    }

    public updatePanel(meta: any, index: number, icon: any, isHot: boolean) {
        this.meta = meta;

        const transform = this.icon.node.getComponent(UITransform);
        if (transform) {
            transform.height *= 1 - 0.05 * (3 - index);
        }
        this.icon.spriteFrame = icon;
        this.icon.node.setScale(index / 5 * 0.1 + 0.6, index / 5 * 0.1 + 0.6, this.icon.node.scale.z);
        fitByHeight(this.icon);

        const chestMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, this.meta.RawCount());
        this.itemName.string = chestMeta.Name();
        this.itemNameGray.string = chestMeta.Name();

        this.itemNameGray.node.active = false;
        this.soldOutNode.active = false;
        SpriteGray.SetGray(this.icon, false);
        this.getButton('buttonEnabled').interactable = true;
        this.getButton('Button - Info').interactable = true;

        this.hot.active = isHot;
        this.gailvNode.active = chestMeta.JokerChestGuar() === 1;

        this.node.getComponentsInChildren(SpriteGray).forEach((cp) => {
            cp.gray = false;
        });
        this.node.getComponentsInChildren(LabelGray).forEach((cp) => {
            cp.gray = false;
        });

        this.price.string = this.meta.PriceString();
        this.node.setSiblingIndex(index + 1);
        this.checkSoldOut();
    }

    public checkSoldOut() {
        const chestId = this.meta.RawCount();
        const chestMeta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId);
        if (Game.SUserCard.jokerCountData(chestId) >= chestMeta.JokerChestCount()) {
            this.soldOut();
        }
    }

    public soldOut() {
        this.itemName.node.active = true;
        this.itemNameGray.node.active = true;
        this.soldOutNode.active = true;
        EnterCloseAnim.playEnter(this.soldOutNode);
        SpriteGray.SetGray(this.icon, true);
        this.getButton('buttonEnabled').interactable = false;
        this.getButton('Button - Info').interactable = false;

        this.node.getComponentsInChildren(SpriteGray).forEach((cp) => {
            cp.gray = true;
        });
        this.node.getComponentsInChildren(LabelGray).forEach((cp) => {
            cp.gray = true;
        });
    }

    public onInfo(e: any) {
        const idStr = this.meta.Id().toString();
        const packId = parseInt(idStr.charAt(idStr.length - 1), 10);
        const parent = this.node.parent.parent.parent.parent.parent.parent;
        const targetTransform = e.target.getComponent(UITransform);
        const parentTransform = parent.getComponent(UITransform);
        const dpos = parentTransform.convertToNodeSpaceAR(targetTransform.convertToWorldSpaceAR(Vec3.ZERO));
        RandomChestPanel.Show(packId, { parent, pos: dpos, height: 70 });
    }

    public onBuyJocker() {
        if (GamePlay.instance.isBusy()) {
            return;
        }
        AppKit.PaymentWrap.Pay(this.meta.Name(), (ok: boolean) => {
            if (ok) {
                const sr = SR.SRCard.recordJokerCountData(this.meta.RawCount(), () => {
                    UIRoot.instance.openChildWindow('PaySuccessWindow', { from: 'card' });
                    GameKit.SoundManager.playSound('item_purchased');
                    this.checkSoldOut();
                    AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'chest', name: this.meta.Name(), phase: 1 });
                });
                sr.Send();
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'chest', name: this.meta.Name(), phase: -1 });
            }
        });

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'chest', name: this.meta.Name(), phase: 0 });
    }

    private getButton(name: string) {
        return this.node.getChildByName('bg').getChildByName(name).getComponent(Button);
    }
}
