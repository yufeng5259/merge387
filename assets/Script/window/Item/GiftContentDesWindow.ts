import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import ContentModel from '../../game/items/ContentModel';
import { fitByHeight } from '../../GameKit/render/fixedSizeRatio';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';

import { UserItems } from '../../game/items/UserItems';
const { ccclass, property } = _decorator;

const width4 = 586;
const bgY = 19;

@ccclass('GiftContentDesWindow')
export class GiftContentDesWindow extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public arrow: Node = null;
    @property([SpriteFrame])
    public bgsSpriteFrames: SpriteFrame[] = [];
    @property(Node)
    public reward_layout: Node = null;
    @property(Node)
    public item: Node = null;
    @property(Sprite)
    public bg1: Sprite = null;
    @property(Node)
    public boomCards: Node = null;
    @property(Label)
    public boomCardsLabel: Label = null;

    public pheight = 0;
    private closing = false;

    show(reward: any) {
        let contents: any[] = [];
        this.reward_layout.destroyAllChildren();
        this.bg1.node.active = true;

        if (reward.ContentId() === UserItems.ToolType.ShiChui) {
            contents = Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward);
        } else if (reward.ContentId() === UserItems.ToolType.CardsBoom) {
            this.bg1.node.active = false;
            if (this.boomCards) this.boomCards.active = true;
            const str = this.boomCardsLabel.string;
            this.boomCardsLabel.string = str.format(reward.Count() * 5 + 'min');
        }

        if (this.bg1.node.active) {
            this.bg1.spriteFrame = this.bgsSpriteFrames[reward.ContentId() - 1];
        }

        const height = this.bg1.node.getComponent(UITransform).height;
        fitByHeight(this.bg1, height);

        for (let i = 0; i < contents.length; i++) {
            const content = Game.Content.FromContent(contents[i]);
            const newItem = instantiate(this.item);
            newItem.parent = this.reward_layout;
            newItem.setPosition(newItem.position.x, 0, newItem.position.z);
            newItem.active = true;
            newItem.getComponent(ContentModel).show(content);
        }

        const itemsCount = contents.length;
        let maxW = 180;
        if (itemsCount >= 4) {
            this.bg.getComponent(UITransform).width = width4;
            maxW = 250;
        }

        let px = 0;
        const nx = this.node.getWorldPosition().x;
        if (nx > maxW) px = nx - maxW;
        else if (nx < -maxW) px = nx + maxW;

        this.bg.setWorldPosition(new Vec3(px, 0, this.bg.worldPosition.z));
        this.bg.setPosition(this.bg.position.x, bgY, this.bg.position.z);

        const bgTransform = this.bg.getComponent(UITransform);
        if (this.node.getWorldPosition().y + bgY + bgTransform.height - 20 > UIRoot.instance.winSize.height / 2) {
            this.arrow.setScale(this.arrow.scale.x, -this.arrow.scale.y, this.arrow.scale.z);
            this.arrow.setPosition(this.arrow.position.x, -this.arrow.position.y, this.arrow.position.z);
            this.bg.setPosition(this.bg.position.x, -this.bg.position.y - bgTransform.height, this.bg.position.z);
            this.node.setPosition(this.node.position.x, this.node.position.y - this.pheight - this.pheight / 5, this.node.position.z);
        }

        this.scheduleOnce(() => {
            this.callClose();
        }, 5);
    }

    callClose() {
        if (this.closing) return;
        this.closing = true;
        EnterCloseAnim.playClose(this.node);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.5);
    }

    static Show(content: any, params: any, x?: any, y?: any) {
        UIRoot.instance.ShowCantClick();
        const resName = 'window/Item/GiftContentDesWindow';
        cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err) {
                Logs.Error('openModelWindow windowPath:' + resName + (err.message || err));
                DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                    GiftContentDesWindow.Show(content, params, x, y);
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
            const panel = wnd.getComponent(GiftContentDesWindow);
            panel.pheight = params.height;
            panel.show(content);
            UIRoot.instance.CloseCantClick();
        });
    }
}

export default GiftContentDesWindow;
