import { _decorator, instantiate, Label, Node, Sprite, tween, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const poses: Record<number, number[]> = {
    1: [0],
    2: [-120, 120],
    3: [-160, 0, 160],
};

@ccclass('SimpleRewardWindow')
export default class SimpleRewardWindow extends UIWindow {
    public static windowPath = 'Common/SimpleRewardWindow';

    @property(Node)
    item: Node | null = null;

    @property(Label)
    labelTime: Label | null = null;

    @property(Node)
    btnOk: Node | null = null;

    time = 0;
    cashItem: Node | null = null;
    activityItems: Node[] = [];
    _icons: Sprite[] = [];

    private fitByHeight(sprite: Sprite, height: number) {
        const spriteFrame = sprite.spriteFrame;
        if (!spriteFrame || height <= 0) return;
        const rect = spriteFrame.rect;
        if (!rect.height) return;
        const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
        transform.setContentSize(rect.width * height / rect.height, height);
    }

    private flyToTarget(sourceItem: Node, targetNode: Node, onComplete?: () => void) {
        if (!GameMainWindow.instance) return;

        const newItem = instantiate(sourceItem);
        newItem.parent = GameMainWindow.instance.node;
        newItem.setWorldPosition(sourceItem.getWorldPosition());

        const countLabel = GameKit.ControllerTable.GetComponent(newItem, 'count', Label);
        countLabel.string = '';

        const startPos = newItem.position.clone();
        const endPos = startPos.clone().add(targetNode.getWorldPosition().subtract(newItem.getWorldPosition()));
        const state = { t: 0 };

        tween(newItem).delay(0.3).to(0.7, { scale: new Vec3(0.1, 0.1, 0.1) }).start();
        tween(state)
            .delay(0.3)
            .to(0.7, { t: 1 }, {
                onUpdate: () => {
                    const t = state.t;
                    const x = startPos.x + (endPos.x - startPos.x) * t;
                    const y = startPos.y + (endPos.y - startPos.y) * t + 120 * 4 * t * (1 - t);
                    newItem.setPosition(x, y, startPos.z + (endPos.z - startPos.z) * t);
                },
            })
            .call(() => {
                newItem.destroy();
                if (onComplete) onComplete();
            })
            .start();
    }

    private shakeNode(node: Node) {
        const baseAngle = node.angle;
        tween(node)
            .by(0.08, { angle: -10 })
            .by(0.08, { angle: 10 })
            .by(0.08, { angle: -10 })
            .by(0.08, { angle: 10 })
            .call(() => {
                node.angle = baseAngle;
            })
            .start();
    }

    onShow(showParams: any) {
        let contents = showParams.contents;
        contents = Game.Content.Merge(contents);

        if (!this.item || !this.labelTime) return;
        this.item.active = false;

        let count = Math.min(3, contents.length);

        this._icons = [];
        this.activityItems = [];
        this.cashItem = null;
        for (let i = 0; i < count; i++) {
            let content = Game.Content.FromContent(contents[i]);
            let newItem = instantiate(this.item);
            newItem.parent = this.item.parent;
            newItem.setPosition(poses[count][i], newItem.position.y, newItem.position.z);
            newItem.active = true;

            let newIcon = GameKit.ControllerTable.GetComponent(newItem, 'icon', Sprite);
            let newCount = GameKit.ControllerTable.GetComponent(newItem, 'count', Label);
            content.Icon(newIcon, () => {
                if (!newIcon || !newIcon.node) return;
                this.fitByHeight(newIcon, 125);
            });
            this._icons.push(newIcon);
            let countstr = GameKit.StringUtil.formatNumber(content.Count());
            newCount.string = GameKit.i18n.t('multiplyx') + countstr;

            if (content.Type() == Game.Content.Types.Cash) {
                this.cashItem = newItem;
                countstr = (Math.floor(content.Count() * 100) / 100).toFixed(2);
                newCount.string = GameKit.i18n.t('multiplyx') + countstr;
            } else if (content.Type() == Game.Content.Types.ActivityItem) {
                this.activityItems.push(newItem);
            }
        }

        this.time = showParams.time || 1;
        this.labelTime.string = '(' + Math.ceil(this.time) + ')';

        GameKit.SoundManager.playSound('se_ok');
    }

    onClose() {
        this._icons.forEach(x => { cce.releaseSpriteFrame(x); });
    }

    update(dt: number) {
        if (this.time <= 0 || !this.labelTime) return;
        this.time -= dt;

        this.labelTime.string = '(' + Math.ceil(this.time) + ')';
        if (this.time <= 0) {
            this.close_window();
        }
    }

    close_window() {
        if (this.cashItem && GameMainWindow.instance) {
            this.flyToTarget(this.cashItem, GameMainWindow.instance.btnCash, () => {
                this.shakeNode(GameMainWindow.instance.btnCash);
            });
        }

        if (this.activityItems.length > 0 && GameMainWindow.instance) {
            this.activityItems.forEach(activityItem => {
                this.flyToTarget(activityItem, GameMainWindow.instance.btnActivityCenter);
            });
        }
        this.closeAnim();
    }
}
