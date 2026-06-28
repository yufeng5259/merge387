import { _decorator, Button, Label, Node, RichText } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const levelIds: Record<number, [number, number]> = {
    1: [1, 49],
    2: [50, 99],
    3: [100, 149],
    4: [150, 199],
    5: [200, 249],
    6: [250, 299],
    7: [300, 349],
};

@ccclass('LevelBonusWindow')
export default class LevelBonusWindow extends UIWindow {
    public static windowPath = 'Quest/LevelBonusWindow';

    @property
    svt: any = null;

    @property(Node)
    btnBuy: Node | null = null;

    @property(Label)
    labelBuy: Label | null = null;

    @property(Label)
    labelLevel: Label | null = null;

    @property([Node])
    spTitles: Node[] = [];

    showLevel = 0;
    shopMeta: any = null;

    onShow(showParams?: any) {
        this.showLevel = LevelBonusWindow.getShowLevel();

        this.shopMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, 1300 + this.showLevel);

        if (this.labelBuy) this.labelBuy.string = this.shopMeta.PriceString();
        if (this.btnBuy) this.btnBuy.active = Game.SUserStatus.LevelBonusOpens() < this.showLevel;
        if (this.labelLevel) this.labelLevel.string = `${GameKit.i18n.t('village_news_tab1')} ${LevelBonusWindow.getShowLevelString()}`;

        this.spTitles.forEach((x, i) => {
            x.active = this.showLevel === i + 1;
        });

        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.LevelBonus);
        const ids = [];
        for (const id in metas) {
            const meta = metas[id];
            if (meta.Level() === this.showLevel) {
                ids.push(id);
            }
        }
        if (this.svt) this.svt.setItem(ids, (index: number, _id: any, itemHandle: Node) => {
            const labelDes = GameKit.ControllerTable.GetComponent(itemHandle, 'labelDes', Label);
            const content = GameKit.ControllerTable.GetComponent(itemHandle, 'content', 'ContentModel');
            const btn = GameKit.ControllerTable.GetComponent(itemHandle, 'btn', Button);
            const labelLevel = GameKit.ControllerTable.GetComponent(itemHandle, 'labelLevel', RichText);
            const spCollected = GameKit.ControllerTable.GetNode(itemHandle, 'spCollected');

            const id = parseInt(_id);
            const meta = Meta.MetaManager.GetMeta(Meta.MetaType.LevelBonus, id);
            const needMapId = meta.MapId();
            labelDes.string = String.format(GameKit.i18n.t('LevelBonusItemDes'), needMapId);
            content.show(meta.Reward());
            btn.interactable = Game.SUserStatus.LevelBonusOpens() >= meta.Level() && (Game.SUserVillage.MapId() >= needMapId) && Game.SUserStatus.LevelBonusGet().indexOf(id) < 0;
            btn.node.targetOff(this);
            btn.node.on('click', () => {
                const req = SR.SRStatus.getLevelBonusReward(id);
                req.SetCallBack(() => {
                    btn.node.active = false;
                    labelLevel.string = '';
                    spCollected.active = true;

                    if (LevelBonusWindow.getShowLevel() !== this.showLevel) {
                        this.onShow();
                    }
                });
                req.Send();
            }, this);
            btn.node.active = Game.SUserStatus.LevelBonusGet().indexOf(id) < 0;
            labelLevel.string = `(<color=f74430>${Game.SUserVillage.MapId()}</color>/${needMapId} )`;
            if (Game.SUserVillage.MapId() >= needMapId) labelLevel.string = `(<color=f74430>${Game.SUserVillage.MapId()}</color>/${needMapId} )`;
            if (Game.SUserStatus.LevelBonusGet().indexOf(id) >= 0) labelLevel.string = '';
            spCollected.active = Game.SUserStatus.LevelBonusGet().indexOf(id) >= 0;
        });
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callBuy() {
        const id = this.shopMeta.Name();
        AppKit.PaymentWrap.Pay(id, function(this: LevelBonusWindow, ok: boolean, res: any) {
            if (ok) {
                GameKit.SoundManager.playSound('item_purchased');

                if (this.btnBuy) this.btnBuy.active = false;
                if (this.svt) this.svt.flushData();

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'levelBonus', name: id, phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'levelBonus', name: id, phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'levelBonus', name: id, phase: 0 });
    }

    public static getShowLevel() {
        let showLevel = 1;
        while (1) {
            if (Game.SUserStatus.LevelBonusOpens() < showLevel) break;
            let fullGet = true;
            const range = levelIds[showLevel];
            if (!range) break;
            for (let i = range[0]; i <= range[1]; i++) {
                if (Game.SUserStatus.LevelBonusGet().indexOf(i) < 0) {
                    fullGet = false;
                    break;
                }
            }
            if (fullGet) {
                showLevel++;
            } else {
                break;
            }
        }
        return showLevel;
    }

    public static getShowLevelString() {
        const range = levelIds[LevelBonusWindow.getShowLevel()];
        return `${Meta.MetaManager.GetMeta(Meta.MetaType.LevelBonus, range[0]).MapId()}-${Meta.MetaManager.GetMeta(Meta.MetaType.LevelBonus, range[1]).MapId()}`;
    }
}

(global as any).LevelBonusWindow = LevelBonusWindow;