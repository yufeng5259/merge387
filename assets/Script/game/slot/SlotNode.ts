import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SlotNode')
export class SlotNode extends Component {
    @property(Component)
    public spinAnim: any = null;
    @property([Component])
    public shieldAnims: any[] = [];
    @property(Node)
    public spinAddNumAnim: Node | null = null;
    @property(Component)
    public activityRoot: any = null;
    @property(Component)
    public coinFlyToTargetAnim: any = null;

    public inited = false;
    public isSpining = false;
    public oldTimeLimt = 0;
    public userinfo: any = null;
    public mergeNodeUI: any = null;
    public mergeLevelNode: any = null;
    private _cleared = false;

    ctor () {
        this.inited = false;
        this.isSpining = false;
        this.oldTimeLimt = (typeof GameKit !== 'undefined' && GameKit.TimeUtil) ? GameKit.TimeUtil.getCurrentTime() : 0;
    }

    onLoad () {
        (this.node as any).slotNode = this;
        this.showUserInfoAndActivity();
    }

    onstart () {
        this.showUserInfoAndActivity();
    }

    showStoreAddSpinAnim (value: any, posX = 20, posY = -250, waitTime = 0.5, cb?: () => void) {
        const spinAnim = GameMainWindow.instance && GameMainWindow.instance.spinAnim;
        if (!spinAnim) {
            this.showSpinAddNumAnim(value);
            if (cb) cb();
            return;
        }

        spinAnim.play(posX, posY, waitTime, () => {
            if (this.userinfo && this.userinfo.playApAnim) {
                this.userinfo.playApAnim(() => {
                    this.makeIdle();
                    if (cb) cb();
                });
            } else {
                this.showSpinAddNumAnim(value);
                if (cb) cb();
            }
        });
    }

    onDestroy () {
        this.Clear();
    }

    Clear () {
        if (this._cleared) return;
        this._cleared = true;

        if (this.mergeNodeUI) {
            if (this.mergeNodeUI.ClearAll) {
                this.mergeNodeUI.ClearAll();
            }
            if (this.mergeNodeUI.node) {
                this.mergeNodeUI.node.destroy();
            }
            this.mergeNodeUI = null;
            this.mergeLevelNode = null;
        }
        if (this.activityRoot && this.activityRoot.hideAll) {
            this.activityRoot.hideAll();
        }
        this.stopOldSlotAnims();
        if (this.userinfo) {
            if (this.userinfo.onClose) {
                this.userinfo.onClose();
            }
            this.userinfo = null;
        }
        if (this.node) {
            (this.node as any).slotNode = null;
        }
    }

    stopOldSlotAnims () {
        this.stopAnim(this.spinAnim);
        this.stopAnimList(this.shieldAnims);
    }

    stopAnim (anim: any) {
        if (anim && anim.stop) {
            anim.stop();
        }
    }

    stopAnimList (anims: any[] | null | undefined) {
        if (!anims) return;
        for (let i = 0; i < anims.length; i++) {
            this.stopAnim(anims[i]);
        }
    }

    makeIdle () {
        this.isSpining = false;
    }

    showSpinAddNumAnim (num: any, noUpdate?: any) {
        this.spinAddNumAnim = GameMainWindow.instance && GameMainWindow.instance.spinAddNumAnim;
        if (!this.spinAddNumAnim) {
            this.updateApIfNeeded(noUpdate);
            return;
        }

        const spinAddNumAnim = this.spinAddNumAnim;
        const label = spinAddNumAnim.getComponent(Label);
        spinAddNumAnim.active = true;
        if (label) {
            label.string = `+${num.toString()}`;
        }
        spinAddNumAnim.setPosition(0, 0, 0);
        spinAddNumAnim.setScale(0.001, 0.001, 1);
        tween(spinAddNumAnim)
            .to(0.2, { position: new Vec3(158, -68, 0), scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .delay(1)
            .to(0.3, { position: new Vec3(0, 0, 0), scale: new Vec3(0.001, 0.001, 1) })
            .call(() => {
                if (label) {
                    label.string = '';
                }
                spinAddNumAnim.active = false;
                this.updateApIfNeeded(noUpdate);
            })
            .start();
    }

    private showUserInfoAndActivity () {
        this.userinfo = this.getComponent('UserInfoModel');
        if (this.userinfo) {
            this.userinfo.show(Game.SUser);
        }
        if (this.activityRoot && this.activityRoot.showActivity) {
            this.activityRoot.showActivity();
        }
    }

    private updateApIfNeeded (noUpdate?: any) {
        if (!noUpdate && this.userinfo && this.userinfo._setAp) {
            this.userinfo._setAp();
        }
    }
}

export default SlotNode;
