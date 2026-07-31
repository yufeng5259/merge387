import { _decorator, Label, Node, Sprite, SpriteFrame } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('CashTaskWindow')
export default class CashTaskWindow extends UIWindow {
    public static windowPath = 'Quest/CashTaskWindow';

    @property
    svt: any = null;

    @property(Label)
    labelCash: Label | null = null;

    @property([SpriteFrame])
    imgs: SpriteFrame[] = [];

    @property(Node)
    modelCantOpen: Node | null = null;

    @property(Label)
    modelCantOpenLabel: Label | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    images: Record<string, SpriteFrame> = {};
    showItems: any = {};
    leftTime: number | null = null;

    onShow(showParams?: any) {
        this.images = {};
        this.imgs.forEach(img => {
            this.images[img.name] = img;
        });

        if (this.labelCash) this.labelCash.string = (Math.floor(Game.SUser.Cash() * 100) / 100).toFixed(2);

        const taskOver = [0];
        this.showItems = {};
        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.CashTask);
        let lastShop = null;
        for (const id in metas) {
            const meta = metas[id];
            if (Game.SUserVillage.MapId() >= meta.MapId()) taskOver.push(parseInt(id));
            if ((taskOver.indexOf(parseInt(id)) < 0 || meta.Item().toString().includes('shop')) && taskOver.indexOf(meta.NeedId()) >= 0) this.showItems[id] = meta;
            if (Game.SUserVillage.MapId() >= meta.MapId() && meta.Item().toString().includes('shop')) {
                if (lastShop) {
                    delete this.showItems[lastShop];
                }
                lastShop = id;
            }
        }

        const ids = Object.keys(this.showItems);
        if (this.svt) this.svt.setItem(ids, (index: number, id: any, itemHandle: Node) => {
            const icon = GameKit.ControllerTable.GetComponent(itemHandle, 'icon', Sprite);
            const btn = GameKit.ControllerTable.GetNode(itemHandle, 'btn');
            const labelDesc = GameKit.ControllerTable.GetComponent(itemHandle, 'labelDesc', Label);
            const badge = GameKit.ControllerTable.GetNode(itemHandle, 'badge');
            const labelbadge = GameKit.ControllerTable.GetComponent(itemHandle, 'labelbadge', Label);
            const badgeShop = GameKit.ControllerTable.GetNode(itemHandle, 'badgeShop');
            const labelbadgeShop = GameKit.ControllerTable.GetComponent(itemHandle, 'labelbadgeShop', Label);

            const meta = this.showItems[id];
            icon.spriteFrame = this.images[meta.Img()];
            btn.targetOff(this);
            btn.active = false;
            labelDesc.string = GameKit.i18n.sel(meta.Description());
            badge.active = !meta.Item().toString().includes('shop');
            labelbadge.string = String.format(GameKit.i18n.t('CashTaskBadge1'), meta.MapId());
            badgeShop.active = meta.Item().toString().includes('shop') && meta.MapId() > Game.SUserVillage.MapId();
            labelbadgeShop.string = String.format(GameKit.i18n.t('CashTaskBadgeShop'), meta.MapId());
        });

        this.leftTime = 0;
        this.update(0);
    }

    onClose() {
    }

    update(dt: number) {
        if (this.leftTime != null) {
            const currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = 1604376000 - currentTime;

            if (this.labelTimer) this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);

            if (this.leftTime <= 0) {
                this.leftTime = null;
                this.close();
            }
        }
    }

    callClose() {
        this.closeAnim();
    }

    callCloseModel() {
        if (this.modelCantOpen) this.modelCantOpen.active = false;
    }
}
