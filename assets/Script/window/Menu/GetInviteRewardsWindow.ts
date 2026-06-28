import { _decorator, EditBox, Node, tween, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import SpinAnim from '../../game/slot/anim/SpinAnim';

const { ccclass, property } = _decorator;

@ccclass('GetInviteRewardsWindow')
export default class GetInviteRewardsWindow extends UIWindow {
    public static windowPath = 'Menu/GetInviteRewardsWindow';

    @property(Node)
    public bg: Node | null = null;

    @property(Node)
    public alertLabel: Node | null = null;

    @property(EditBox)
    public editbox: EditBox | null = null;

    @property(SpinAnim)
    public spinAnim: SpinAnim | null = null;

    public onShow(): void {
        // this.update_addnumber()
    }

    public event_get(): void {
        if (GamePlay.instance.isBusy() || !this.editbox) return;

        const code = this.editbox.string;
        if (code.length <= 1) {
            this.errorHandler();
            return;
        }

        const sr = SR.SRInvitationUser.invitationUser(code, (res: any) => {
            if (res.dataCode != 0) {
                Game.SUser.updateData(res.userData.data);
                this.successHandler();
            } else {
                this.errorHandler();
            }
            console.log(res, 'res');
        });
        sr.Send();
    }

    public successHandler(): void {
        if (!this.spinAnim) {
            this.closeAnim(() => {});
            return;
        }

        this.spinAnim.play(0, -340, 0.5, () => {
            this.closeAnim(() => {});
        });
    }

    public errorHandler(): void {
        this.ScreenShake();
        if (!this.alertLabel) return;

        this.alertLabel.active = true;
        setTimeout(() => {
            if (this.alertLabel) this.alertLabel.active = false;
        }, 3000);
    }

    public ScreenShake(): void {
        if (!this.bg) return;

        const t = 0.03;
        const d = 6;
        const steps = [
            new Vec3(d, -d, 0),
            new Vec3(-d, -d, 0),
            new Vec3(-d, d, 0),
            new Vec3(d, d, 0),
        ];

        let shakeTween = tween(this.bg);
        for (let i = 0; i < 4; i++) {
            steps.forEach((step) => {
                shakeTween = shakeTween.by(t, { position: step });
            });
        }
        shakeTween.start();
    }

    public event_close(): void {
        this.closeAnim();
    }
}
