import { _decorator, Button, ImageAsset, Label, Node, ProgressBar, Sprite, SpriteFrame, Texture2D } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const C = {
    BASE_PATH: 'Card',
    SET_ICON_FILENAME: 'set-icon',
};

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('CardLimitSubjectOpenWindow')
export default class CardLimitSubjectOpenWindow extends UIWindow {
    public static windowPath = 'Card/CardLimitSubjectOpenWindow';

    @property([Node])
    nodes: Node[] = [];

    @property(Label)
    labelTimer: Label | null = null;

    @property(Node)
    content: Node | null = null;

    @property(Sprite)
    spBg: Sprite | null = null;

    meta: any = null;
    leftTime: number | null = null;
    all_set_meta: any = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.leftTime = 0;

        this.nodes.forEach(x => {
            CCTools.SetNodeByParam(x, this.meta.Param().ui[x.name]);
        });

        let img = this.meta.Image();
        if (!img || img === '') return;
        if (img.startsWith('http')) {
            cce.loaderLoad({ url: img, type: 'png' }, (err: any, v: ImageAsset) => {
                if (err != null) { Logs.Warning(err); return; }
                if (!this.spBg || !this.node) return;
                this.spBg.spriteFrame = createSpriteFrame(v);
            });
        } else {
            let resName = 'res/Activity/images/' + img;
            cce.loadRes(resName, SpriteFrame, (err: any, v: SpriteFrame) => {
                if (err != null) { Logs.Warning(err); return; }
                if (!this.spBg || !this.node) return;
                this.spBg.spriteFrame = v;
            });
        }

        this.all_set_meta = Meta.MetaManager.GetMetas(Meta.MetaType.CardSets);

        let arr = this.meta.Param().sets;
        let cont = this.content;
        if (!cont) return;
        for (let index = 0; index < 3; index++) {
            let node = cont.getChildByName('item' + index);
            if (!node) continue;
            node.active = true;

            let id = arr[index];
            let sp_icon = GameKit.ControllerTable.GetNode(node, 'icon').getComponent(Sprite);
            let label_set_name = GameKit.ControllerTable.GetNode(node, 'label-set-name').getComponent(Label);
            let pb = GameKit.ControllerTable.GetNode(node, 'progress').getComponent(ProgressBar);
            let label_pb = GameKit.ControllerTable.GetNode(node, 'label-progress').getComponent(Label);
            let sp_lock = GameKit.ControllerTable.GetNode(node, 'lock').getComponent(Sprite);
            let label_lock = GameKit.ControllerTable.GetNode(node, 'label-lock').getComponent(Label);

            let meta = this.all_set_meta[id];
            if (label_set_name) label_set_name.string = id.toString() + '.' + meta.Name();
            cce.loadRes(`${C.BASE_PATH}/${meta.Res()}/${C.SET_ICON_FILENAME}`, SpriteFrame, (err: any, res: SpriteFrame) => {
                if (!err && sp_icon) {
                    sp_icon.spriteFrame = res;
                }
            });
            let count = 0;
            for (let i = 1; i <= 9; i++) {
                count += Game.SUserCard.HaveCard(id * 100 + i) ? 1 : 0;
            }
            if (pb) pb.progress = count / 9;
            if (label_pb) label_pb.string = `${count} / 9`;
            if (label_lock) label_lock.string = (String as any).format(GameKit.i18n.t('CardAllSetWindowLock'), meta.MinVillage());
            let flag_lock = Game.SUserVillage.MapId() < meta.MinVillage() && count <= 0;
            if (sp_lock) sp_lock.node.active = false;
            let button = node.getComponent(Button);
            if (button) button.interactable = false;
            if (label_set_name) label_set_name.node.active = !flag_lock;
        }
    }

    onClose() {
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.meta.EndTime() - currentTime;
            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            }
            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    callClose() {
        this.closeAnim(() => {
        });
    }

    callGo() {
        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }

        this.closeAnim();
        UIRoot.instance.openChildWindow('CardAllSetWindow', {
            showCallback: () => {
                if (UIRoot.instance.GetWindow('ShopWindow')) {
                    UIRoot.instance.closeChildWindow('ShopWindow');
                }
            },
        });
    }
}
