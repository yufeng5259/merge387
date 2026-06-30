import { _decorator, Component, instantiate, Node, Sprite, SpriteFrame } from 'cc';
import { ContentModel } from '../../../game/items/ContentModel';

import { UserItems } from '../../../game/items/UserItems';
const { ccclass, property } = _decorator;

@ccclass('GiftDes')
export class GiftDes extends Component {
    @property([SpriteFrame])
    public bgsSpriteFrames: SpriteFrame[] = [];

    @property(Node)
    public reward_layout: Node | null = null;

    @property(Node)
    public item: Node | null = null;

    @property(Sprite)
    public bg: Sprite | null = null;

    public show(reward: any) {
        let contents: any[] = [];
        this.reward_layout.destroyAllChildren();
        if (reward.ContentId() === UserItems.ToolType.Muchui) {
            contents = Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward);
        }
        this.bg.spriteFrame = this.bgsSpriteFrames[reward.ContentId() - 1];

        for (let i = 0; i < contents.length; i++) {
            const content = Game.Content.FromContent(contents[i]);
            const newItem = instantiate(this.item);
            newItem.parent = this.reward_layout;
            newItem.setPosition(newItem.position.x, 0, newItem.position.z);
            newItem.active = true;
            newItem.getComponent(ContentModel).show(content);
        }
    }
}
