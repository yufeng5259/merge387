import { _decorator, instantiate, Label, Node, RichText, Sprite, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const poses: Record<number, number[]> = {
    1: [0],
    2: [-120, 120],
    3: [-160, 0, 160],
};

@ccclass('GetRewardWindow')
export default class GetRewardWindow extends UIWindow {
    public static windowPath = 'Common/GetRewardWindow';

    @property(Node)
    item: Node | null = null;

    @property(RichText)
    labelDes: RichText | null = null;

    oldCoin: any = null;
    oldAp: any = null;
    noChest: any = null;
    chestCard: any[] = [];
    randomPackChest: any[] = [];
    _icons: Sprite[] = [];

    private fitByHeight(sprite: Sprite, height: number) {
        const spriteFrame = sprite.spriteFrame;
        if (!spriteFrame || height <= 0) return;
        const rect = spriteFrame.rect;
        if (!rect.height) return;
        const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
        transform.setContentSize(rect.width * height / rect.height, height);
    }

    onShow(showParams: any) {
        let contents = showParams.contents;
        contents = Game.Content.Merge(contents);
        this.oldCoin = showParams.oldCoin;
        this.noChest = showParams.noChest;

        if (!this.item || !this.labelDes) return;
        this.item.active = false;

        let rewardStr = '';
        let count = Math.min(3, contents.length);

        this.chestCard = [];
        this.randomPackChest = [];

        this._icons = [];
        for (let i = 0; i < count; i++) {
            let content = Game.Content.FromContent(contents[i]);
            let newItem = instantiate(this.item);
            newItem.parent = this.item.parent;
            newItem.setPosition(poses[count][i], newItem.position.y, newItem.position.z);
            newItem.active = true;

            let newIcon = GameKit.ControllerTable.GetComponent(newItem, 'icon', Sprite);
            let newCount = GameKit.ControllerTable.GetComponent(newItem, 'count', Label);
            content.Icon(newIcon, () => {
                this.fitByHeight(newIcon, 125);
            });
            this._icons.push(newIcon);
            newCount.string = GameKit.StringUtil.formatNumber(content.Count());
            if (content.Type() == Game.Content.Types.CardChest) {
                this.chestCard.push(content.Id());
            } else if (content.Type() == Game.Content.Types.RandomPack) {
                this.randomPackChest.push(content.Id());
            }

            let nameadd = '';
            if (i != 0) {
                if (i == count - 1) nameadd = ' ' + GameKit.i18n.t('and') + ' ';
                else nameadd = ', ';
            }
            rewardStr += nameadd + content.ColorCode() + content.Name() + '</color>';
        }

        this.labelDes.string = String.format(GameKit.i18n.t('GetRewardWindowDes'), rewardStr);

        GameKit.BackKeyManager.registerBackEvent();

        if (GameKit.SoundManager && GameKit.SoundManager.playGhostRewardSound) {
            GameKit.SoundManager.playGhostRewardSound();
        } else {
            GameKit.SoundManager.playSound('slot_item_win');
        }
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();

        this._icons.forEach(x => { cce.releaseSpriteFrame(x); });

        if (this.oldCoin != null) {
            if (GameMainWindow.instance) GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, Game.SUser.Coin(), 0.8);
        }
    }

    update() {
    }

    close_window() {
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('level_reward_button');
        }
        if (this.chestCard.length > 0) {
            if (!this.noChest && CardChestOpenWindow.tryShow(null, this.chestCard && this.chestCard.length > 0 ? this.chestCard.shift() : null)) {
                return;
            }
        } else if (this.randomPackChest.length > 0) {
            if (!this.noChest && CardChestOpenWindow.tryShow()) {
                this.randomPackChest = [];
                return;
            }
        }

        this.closeAnim();
    }
}
