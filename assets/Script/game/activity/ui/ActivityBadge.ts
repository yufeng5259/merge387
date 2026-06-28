import { _decorator, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D, UITransform } from 'cc';
const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivityBadge')
export class ActivityBadge extends Component {
    @property(Node)
    public btn: Node | null = null;
    @property(Node)
    public dot: Node | null = null;
    @property(Label)
    public labelCountDown: Label | null = null;
    @property(Sprite)
    public icon: Sprite | null = null;
    @property
    public isleft = true;

    public meta: any = null;
    public leftTime: number | null = null;

    updateMeta(meta: any) {
        this.meta = meta;
    }

    setMeta(meta: any, cpcb?: any) {
        this.meta = meta;

        if (this.btn) {
            this.btn.on("click", () => {
                if (GamePlay.instance.isBusy()) return;
                const icon_goto = this.meta.IconGoto();
                if (icon_goto == "panel") {
                    UIRoot.instance.openChildWindow(this.meta.Panel(), { meta: this.meta });
                } else if (icon_goto == "window") {
                    const panelClass = (globalThis as any)[this.meta.Panel()];
                    if (panelClass && panelClass.Show) panelClass.Show(this.meta);
                } else {
                    UIRoot.instance.openChildWindow(icon_goto, { meta: this.meta });
                }
            }, this);
        }

        if (this.labelCountDown) {
            this.leftTime = 0;
            this.update(0);
        }

        const icon = this.meta.Icon();
        const metaParam = this.meta.Param();
        if (icon && icon.startsWith("http")) {
            cce.loaderLoad({ url: icon, type: "png" }, (err: any, v: ImageAsset) => {
                if (err != null) {
                    Logs.Warning(err);
                    return;
                }
                if (!this.btn || !this.node) return;

                const sprite = this.btn.getComponent(Sprite);
                if (!sprite) return;

                sprite.spriteFrame = createSpriteFrame(v);
                CCTools.ResizeSprite(sprite);
                this.btn.setPosition(0, -this.getNodeHeight(this.btn) / 2, this.btn.position.z);
                const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
                transform.height = this.getNodeHeight(this.btn) + 10;

                CCTools.SetNodeByParam(this.labelCountDown, metaParam.badgeTime);

                if (cpcb) cpcb();
            });
        }
    }

    update(dt: any) {
        if (this.leftTime != null && this.meta && this.labelCountDown) {
            const currentTime = GameKit.TimeUtil.getCurrentTime();

            if (this.meta.IsUserTime()) {
                this.leftTime = this.meta.UserTime() - currentTime + Game.ActivityManager.GetLocalData()[this.meta.Id()].startTime;
            } else {
                this.leftTime = this.meta.EndTime() - currentTime;
            }

            this.labelCountDown.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false);

            if (this.leftTime <= 0) {
                Game.ActivityManager.ActivityOver(this.meta.Id());
                this.leftTime = null;
            }
        }
    }

    private getNodeHeight(node: Node) {
        return node.getComponent(UITransform)?.height || 0;
    }
}
