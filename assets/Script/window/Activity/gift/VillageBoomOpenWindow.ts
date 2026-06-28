import { _decorator, Button, instantiate, Label, Node, Vec3 } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';
import { ContentModel } from '../../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('VillageBoomOpenWindow')
export default class VillageBoomOpenWindow extends UIWindow {
    public static windowPath = 'Activity/gift/VillageBoomOpenWindow';

    @property(Node)
    reward_layout: Node | null = null;

    @property(Node)
    item: Node | null = null;

    @property(Button)
    goButton: Button | null = null;

    @property(Label)
    timeLabel: Label | null = null;

    meta: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        let contents: any[] = [];
        this.reward_layout?.destroyAllChildren();
        contents = Game.Content.FromStrings(Meta.BuildingItemPackMeta.GetValueByLevel(Game.SUserVillage.MapId()).reward);
        for (let i = 0; i < contents.length; i++) {
            let content = Game.Content.FromContent(contents[i]);
            if (!this.item || !this.reward_layout) continue;
            let newItem = instantiate(this.item);
            newItem.parent = this.reward_layout;
            newItem.setPosition(new Vec3(newItem.position.x, 0, newItem.position.z));
            newItem.active = true;
            newItem.getComponent(ContentModel)?.show(content, null);
        }
        if (this.timeLabel) this.timeLabel.node.active = true;
        if (this.goButton) this.goButton.interactable = true;
        this.leftTime = 0;
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;
            if (this.timeLabel) {
                this.timeLabel.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);
            }
            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callGo() {
        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Village); });
    }
}
