import { _decorator, instantiate, Label, Node, tween, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const MultipleList = [4, 3, 2, 8, 3, 4, 2, 5, 4, 3, 2, 8, 3, 5, 2, 10];

@ccclass('MultiplePurchaseWindow')
export default class MultiplePurchaseWindow extends UIWindow {
    public static windowPath = 'Shop/MultiplePurchaseWindow';

    @property(Node)
    spWheel: Node | null = null;

    @property(Node)
    labelTimesItem: Node | null = null;

    @property(Label)
    labelDesPay: Label | null = null;

    @property(Node)
    spLabel: Node | null = null;

    @property(Node)
    btnSpin: Node | null = null;

    @property(Node)
    spResultClick: Node | null = null;

    @property(Node)
    spResult: Node | null = null;

    @property(Label)
    labelResult: Label | null = null;

    @property(Node)
    animRibbon: Node | null = null;

    meta: any = null;
    indexRotation: Record<number, { min: number; max: number }> = {};
    spinTimes = 0;
    w_rot = 0;
    w_spining = false;
    w_targetRot = 0;
    speed = 0;
    soundCount = 0;
    times = 1;

    onShow(showParams: any) {
        this.meta = showParams.meta;

        if (this.labelDesPay) this.labelDesPay.string = String.format(GameKit.i18n.t('MultiplePurchaseDes3'), this.meta.PriceString());

        this.indexRotation = {};

        if (this.labelTimesItem) {
            for (let i = 0; i < MultipleList.length; i++) {
                let labelItem = instantiate(this.labelTimesItem);
                labelItem.active = true;
                labelItem.parent = this.labelTimesItem.parent;
                labelItem.setPosition(0, 0);
                labelItem.angle = (0.5 + i) * -22.5;
                let label = labelItem.getComponent(Label);
                if (label) label.string = GameKit.i18n.t('multiplyx') + MultipleList[i];

                this.indexRotation[i] = { min: i * 22.5 + 5, max: (i + 1) * 22.5 - 5 };
            }
        }

        this.spinTimes = 0;
        this.w_rot = 0;

        GameKit.BackKeyManager.registerBackEvent(() => {
            this.callClose();
        });
    }

    onClose() {
        GameKit.BackKeyManager.unregisterBackEvent();
    }

    update(dt: number) {
        this.updateWheel(dt);
    }

    callClose() {
        if (this.w_spining) return;
        this.closeAnim();
    }

    callSpin() {
        if (this.w_spining) return;

        this.scaleNodeTo(this.spResult, 0.3, 0.001);

        GameKit.DataCache.SetData('MultiplePurchase', true);
        AppKit.PaymentWrap.Pay(this.meta.Name(), function(this: MultiplePurchaseWindow, ok: boolean, res: any) {
            if (ok) {
                this.spinTimes++;
                this.scaleNodeTo(this.spLabel, 0.3, 0.001);
                this.scaleNodeTo(this.btnSpin, 0.3, 0.001);

                GameKit.SoundManager.playSound('item_purchased');

                this.times = res.times || 1;
                let index = -1;
                let start = G.getRandomInt(0, MultipleList.length);
                while (index < 0) {
                    if (start < 0) {
                        index = 2;
                        break;
                    }
                    index = MultipleList.indexOf(this.times, start);
                    start--;
                }

                this.ShowWheel(index);

                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'multi', name: this.meta.Name(), phase: 1 });
            } else {
                AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'multi', name: this.meta.Name(), phase: -1 });
            }
        }.bind(this));

        AppKit.LogEventWrap.logEvent('ShopDetail', { itemType: 'multi', name: this.meta.Name(), phase: 0 });
    }

    ShowWheel(index: number) {
        this.w_targetRot = G.getRandomFloat(this.indexRotation[index].min, this.indexRotation[index].max) + 6 * 360;
        this.StartWheel();
    }

    updateWheel(dt: number) {
        if (!this.w_spining) return;
        if (this.w_rot >= this.w_targetRot - 6) {
            this.speed = Math.max(2, this.speed - 5 * dt);
        } else if (this.w_rot >= this.w_targetRot - 18) {
            this.speed = Math.max(3, this.speed - 1 * dt);
        } else if (this.w_rot >= this.w_targetRot - 1200) {
            this.speed = (this.w_targetRot - this.w_rot) / 2;
        } else {
            this.speed += dt * 450;
            if (this.speed > 600) this.speed = 600;
        }

        this.w_rot += this.speed * dt;
        if (this.w_rot >= this.w_targetRot) {
            this.w_rot = this.w_targetRot;
            this.StopWheel();
        }
        if (this.spWheel) this.spWheel.angle = this.w_rot % 360;

        let soundCount = Math.floor(this.w_rot / 45);
        if (soundCount > this.soundCount) {
            GameKit.SoundManager.playSound('multi_spin');
            this.soundCount = soundCount;
        }
    }

    StartWheel() {
        this.w_spining = true;
        this.speed = 0;
        this.w_rot %= 360;
        this.soundCount = Math.floor(this.w_rot / 50) - 1;
    }

    StopWheel() {
        this.w_spining = false;
        this.speed = 0;

        if (this.times > 1 && this.animRibbon) {
            let ar = instantiate(this.animRibbon);
            ar.active = true;
            ar.parent = this.animRibbon.parent;
            ar.setPosition(this.animRibbon.position);
        }

        if (this.times > 1) {
            this.scaleNodeTo(this.spResult, 0.3, 1);
            GameKit.SoundManager.playSound('multi_spin_over');
        } else {
            GameKit.SoundManager.playSound('chest_card');
        }
        if (this.labelResult) this.labelResult.string = GameKit.i18n.t('multiplyX') + this.times;
        if (this.spinTimes < G.GameConstance.multiPurchaseMaxUse) {
            this.scaleNodeTo(this.spLabel, 0.3, 1);
            this.scaleNodeTo(this.btnSpin, 0.3, 1);
        }
    }

    closeResult() {
        this.scaleNodeTo(this.spResult, 0.3, 0.001);

        if (this.spinTimes >= G.GameConstance.multiPurchaseMaxUse) {
            this.scheduleOnce(() => {
                this.closeAnim();
            }, 0.5);
        }
    }

    public static OpenMulti() {
        let activities = Game.ActivityManager.GetAllActiveActivityList();
        for (let i = 0; i < activities.length; i++) {
            let meta = activities[i];
            if (meta.Type() === Meta.ActivityMeta.Types.Pay && meta.SubType() === Meta.ActivityMeta.SubTypes.Lucky10) return true;
        }

        return false;
    }

    private scaleNodeTo(node: Node | null, duration: number, scale: number) {
        if (!node) return;
        tween(node).to(duration, { scale: new Vec3(scale, scale, node.scale.z) }).start();
    }
}

(global as any).MultiplePurchaseWindow = MultiplePurchaseWindow;
