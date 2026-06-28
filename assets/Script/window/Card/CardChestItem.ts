import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import '../../LegacyGlobals';

const { ccclass, property } = _decorator;

const changeNums: Record<number, number> = {
    1: 100,
    2: 200,
    3: 400,
};

@ccclass('CardChestItem')
export class CardChestItem extends Component {
    @property(Sprite)
    public itemIcon: Sprite | null = null;

    @property(Node)
    public reset: Node | null = null;

    @property(Label)
    public resetLabel: Label | null = null;

    @property(Node)
    public change: Node | null = null;

    @property(Label)
    public changeLabel: Label | null = null;

    @property(Node)
    public countDown: Node | null = null;

    @property(Label)
    public countDown_label: Label | null = null;

    @property(Node)
    public UnLock: Node | null = null;

    @property(Label)
    public UnLockLabel: Label | null = null;

    @property(Sprite)
    public UnLockIcon: Sprite | null = null;

    private ID = 0;
    private Icon: SpriteFrame | null = null;
    private cardChangeNum = 0;
    private changeCount = 0;
    private isChange = false;
    private time = 0;

    private setButtonInteractable(node: Node | null, interactable: boolean) {
        const button = node ? node.getComponent(Button) : null;
        if (button) button.interactable = interactable;
    }

    private formatRemainTime(time: number) {
        const timeUtil = (globalThis as any).GameKit?.TimeUtil;
        return timeUtil && timeUtil.FormatRemainTimeSimple
            ? timeUtil.FormatRemainTimeSimple(time, true)
            : String(Math.max(0, Math.floor(time)));
    }

    onShow(id: any, icon: any, params: any) {
        this.ID = Number(id) || 0;
        this.Icon = icon || null;
        this.time = Number(params && params.time && params.time[id]) || 0;
        this.changeCount = Number(params && params.reset && params.reset[id]) || 0;
        this.isChange = !!(params && params.buy && params.buy[id]);
        this.cardChangeNum = changeNums[this.ID] || 0;
        if (this.itemIcon) this.itemIcon.spriteFrame = this.Icon;
        if (this.changeLabel) this.changeLabel.string = String(this.cardChangeNum);
        this.updatePanel();
    }

    onReset() {
        if (this.changeCount <= 0) return;
        const request = (globalThis as any).SR?.SRCard?.changeStarRefresh?.(this.ID, this.changeCount);
        if (!request) return;
        request.SetCallBack?.((res: any) => {
            const params = res || {};
            if (params.time) this.time = Number(params.time[this.ID]) || 0;
            if (params.reset) this.changeCount = Number(params.reset[this.ID]) || 0;
            if (params.buy) this.isChange = !!params.buy[this.ID];
            this.updatePanel();
        });
        request.Send?.();
    }

    onChange() {
        const root = (globalThis as any).UIRoot || (globalThis as any).window?.UIRoot;
        if (!root || !root.instance) return;
        root.instance.openChildWindow('CardTradeWindow', {
            id: this.ID,
            changeNum: this.cardChangeNum,
            icon: this.Icon,
        });
        root.instance.closeChildWindow?.('CardChangeWindow');
    }

    updatePanel() {
        const unlockLevel = this.getUnlockLevel();
        const currentLevel = this.getCurrentVillageLevel();
        const locked = unlockLevel > 0 && currentLevel > 0 && currentLevel < unlockLevel;
        if (this.UnLock) this.UnLock.active = locked;
        if (this.UnLockIcon) this.UnLockIcon.node.active = locked;
        if (this.UnLockLabel && locked) {
            const template = (globalThis as any).GameKit?.i18n?.t?.('CardChangeWindowLouckButton') || 'UNLOCKS AT\nVILLAGE {0}';
            this.UnLockLabel.string = String.format ? String.format(template, unlockLevel) : template.replace('{0}', String(unlockLevel));
        }
        this.onRefresh();
    }

    onRefresh() {
        const locked = !!(this.UnLock && this.UnLock.active);
        const cooling = !locked && this.time > 0;
        const canReset = !locked && cooling && this.changeCount > 0;
        const canChange = !locked && !cooling && this.isChange;

        if (this.change) this.change.active = canChange;
        this.setButtonInteractable(this.change, canChange);
        if (this.reset) this.reset.active = canReset;
        this.setButtonInteractable(this.reset, canReset);
        if (this.countDown) this.countDown.active = cooling;
        if (this.countDown_label) {
            this.countDown_label.node.active = cooling;
            if (cooling) this.countDown_label.string = this.formatRemainTime(this.time);
        }
        if (this.resetLabel) this.resetLabel.string = canReset ? String(this.changeCount) : '';
        if (this.itemIcon) this.itemIcon.node.active = true;
        if (this.UnLockIcon) this.UnLockIcon.node.active = locked;
    }

    private getUnlockLevel() {
        const meta = (globalThis as any).Meta?.MetaManager?.GetMeta?.((globalThis as any).Meta?.MetaType?.CardChest, this.ID);
        const rawLevel = meta?.UnlockLevel?.() ?? meta?.Unlock?.() ?? meta?.Level?.() ?? 0;
        return Number(rawLevel) || 0;
    }

    private getCurrentVillageLevel() {
        const userVillage = (globalThis as any).Game?.SUserVillage;
        return Number(userVillage?.MapId?.() ?? userVillage?.Level?.() ?? 0) || 0;
    }

    update() {
    }
}

export default CardChestItem;
