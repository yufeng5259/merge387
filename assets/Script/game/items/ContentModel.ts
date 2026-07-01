import { _decorator, Color, Component, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
import { bindGuardedClick, unbindGuardedClick } from '../../GameKit/ui/TouchClickGuard';
const { ccclass, property } = _decorator;

function getNodeHeight (node: Node | null) {
    return node?.getComponent(UITransform)?.height || 0;
}

function getTouchPos (parent: Node, target: Node) {
    const parentTransform = parent.getComponent(UITransform);
    const targetTransform = target.getComponent(UITransform);
    if (!parentTransform || !targetTransform) return Vec3.ZERO;
    return parentTransform.convertToNodeSpaceAR(targetTransform.convertToWorldSpaceAR(Vec3.ZERO));
}

function getWindowClass (name: string) {
    return (globalThis as any)[name] || (window as any)[name] || (global as any)[name];
}

function setSpriteGray (sprite: Sprite | null, gray: boolean) {
    if (!sprite || !sprite.node) return;
    const spriteGray = sprite.node.getComponent('SpriteGray') || sprite.node.addComponent('SpriteGray');
    (spriteGray as any).gray = gray;
}

function parseColorCode (code: string) {
    const match = code.match(/#(......)/);
    if (!match) return new Color(255, 255, 255, 255);
    const hex = match[1];
    return new Color(
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
        255,
    );
}

@ccclass('ContentModel')
export class ContentModel extends Component {
    @property(Sprite)
    public icon: Sprite | null = null;
    @property(Label)
    public count: Label | null = null;
    @property(Label)
    public countBignum: Label | null = null;
    @property(Label)
    public countX: Label | null = null;
    @property(Label)
    public countXX: Label | null = null;
    @property(Label)
    public countWithColor: Label | null = null;
    @property(Label)
    public labelName: Label | null = null;
    @property(Label)
    public desc: Label | null = null;
    @property(Node)
    public infoBtn: Node | null = null;
    @property
    public oneUseName = false;
    @property
    public oneHide = false;

    public content: any = null;
    public params: any = null;
    public noCountGray = false;
    public randomPackParent: Node | null = null;

    show (content: any, params: any = null) {
        if (!content) return;
        this.content = content.Contents()[0];
        if (!this.content) return;
        this.params = params;

        if (this.infoBtn) {
            this.infoBtn.active = false;
            unbindGuardedClick(this.infoBtn, this);
        }

        if (this.icon) {
            this.icon.node.off(Node.EventType.TOUCH_END);
            unbindGuardedClick(this.icon.node, this);
            this.content.Icon(this.icon, () => {
                if (this.noCountGray && this.content.Count() <= 0) {
                    setSpriteGray(this.icon, true);
                } else if (this.noCountGray) {
                    setSpriteGray(this.icon, false);
                }
            });
            this.bindIconTouch(params);
        }

        this.updateLabels();
    }

    private bindIconTouch (params: any) {
        if (!this.icon || !this.content) return;
        if (this.content.Type() === Game.Content.Types.RandomPack) {
            if (this.infoBtn) this.infoBtn.active = true;
            bindGuardedClick(this.icon.node, this, (e: any) => {
                const parent = UIRoot.instance.node;
                const pos = getTouchPos(parent, this.icon!.node);
                getWindowClass('RandomChestPanel')?.Show?.(this.content.Id(), {
                    parent,
                    pos,
                    height: getNodeHeight(this.icon!.node),
                });
                e.stopPropagation();
            });
        } else if (this.content.Type() === Game.Content.Types.Gift) {
            if (this.infoBtn) this.infoBtn.active = true;
            bindGuardedClick(this.icon.node, this, (e: any) => {
                const window = CCTools.getComponentInParent(this.node, 'UIWindow');
                if (!window) return;
                const parent = this.randomPackParent || (window as any).node || this.icon!.node.parent;
                const pos = getTouchPos(parent, this.icon!.node);
                getWindowClass('GiftContentDesWindow')?.Show?.(this.content, {
                    parent,
                    pos,
                    height: getNodeHeight(this.icon!.node),
                });
                e.stopPropagation();
            });
        } else if (this.content.Type() === Game.Content.Types.CardChest) {
            if (this.content.Id() === 14 || this.content.Id() === 15) {
                if (this.infoBtn) this.infoBtn.active = true;
                bindGuardedClick(this.icon.node, this, (e: any) => {
                    const window = CCTools.getComponentInParent(this.node, 'UIWindow');
                    if (!window) return;
                    const parent = this.randomPackParent || (window as any).node || this.icon!.node.parent;
                    const pos = getTouchPos(parent, this.icon!.node);
                    getWindowClass('LimitCardDesWindow')?.Show?.(this.content, {
                        parent,
                        pos,
                        height: getNodeHeight(this.icon!.node),
                    });
                    e.stopPropagation();
                });
            }
        } else if (this.content.Type() === Game.Content.Types.MergeIcon) {
            this.bindMergeIconTouch(params);
        }
    }

    private bindMergeIconTouch (params: any) {
        if (!this.icon || !this.content) return;
        const infoBtnParams = (params && params.infoBtnParams) || {};
        if (this.infoBtn && infoBtnParams.showInfoBtn) {
            this.infoBtn.active = infoBtnParams.showInfoBtn;
        }
        if (this.infoBtn && infoBtnParams.canTouch && this.infoBtn.active) {
            this.infoBtn.off(Node.EventType.TOUCH_END);
            unbindGuardedClick(this.infoBtn, this);
            bindGuardedClick(this.infoBtn, this, (e: any) => {
                if (infoBtnParams.callback) {
                    infoBtnParams.callback({ content: this.content, contentModel: this });
                }
                e.stopPropagation();
            });
        }

        const iconParams = (params && params.iconParams) || {};
        if (iconParams.dontTouch === true) return;
        bindGuardedClick(this.icon.node, this, (e: any) => {
            if (!iconParams.onlyCallback && ((this.infoBtn && this.infoBtn.active) || iconParams.forceTouch === true)) {
                UIRoot.instance.openChildWindow('MergeTypeWindow', { mergeId: this.content.Id() });
            }
            if (iconParams.callback) {
                iconParams.callback({ content: this.content, contentModel: this });
            }
            e.stopPropagation();
        }, { shouldEnd: () => iconParams.forceTouch !== false });
    }

    private updateLabels () {
        const content = this.content;
        if (!content) return;
        const countText = GameKit.StringUtil.formatNumber(content.Count());
        const bigCountText = BigNumber.format(content.Count());
        const giftText = content.Type() === Game.Content.Types.Gift ? content.Count() * 5 + 'min' : null;

        if (this.count) {
            this.count.string = giftText || countText;
            if (this.oneUseName && content.Count() === 1) this.count.string = content.Name();
            if (this.oneHide && content.Count() === 1) this.count.string = '';
        }
        if (this.countXX) {
            this.countXX.string = countText;
            if (this.oneUseName && content.Count() === 1) this.countXX.string = content.Name();
            if (this.oneHide && content.Count() === 1) this.countXX.string = '';
            if (content.Type() === Game.Content.Types.Coin) this.countXX.string = content.Count() + '/' + Game.SUser.Coin();
        }
        if (this.countBignum) {
            this.countBignum.string = giftText || bigCountText;
            if (this.oneUseName && content.Count() === 1) this.countBignum.string = content.Name();
            if (this.oneHide && content.Count() === 1) this.countBignum.string = '';
        }
        if (this.countX) {
            this.countX.string = GameKit.i18n.t('multiplyx') + bigCountText;
            if (this.oneUseName && content.Count() === 1) this.countX.string = content.Name();
            if (this.oneHide && content.Count() === 1) this.countX.string = '';
        }
        if (this.countWithColor) {
            const labelTwoColor = this.countWithColor.node.getComponent('LabelTwoColor') || this.countWithColor.node.addComponent('LabelTwoColor');
            (labelTwoColor as any).offset = 0.15;
            (labelTwoColor as any).colorTo = parseColorCode(content.ColorCode());
            this.countWithColor.string = giftText || bigCountText;
            if (this.oneUseName && content.Count() === 1) this.countWithColor.string = content.Name();
            if (this.oneHide && content.Count() === 1) this.countWithColor.string = '';
        }
        if (this.labelName) this.labelName.string = content.Name();
        if (this.desc) this.desc.string = content.Desc();
    }

    onClose () {
        if (!this.icon) return;
        cce.releaseSpriteFrame(this.icon);
        this.icon.node.getComponentsInChildren('CardModel').forEach((x: any) => x.onClose?.());
    }

    clear () {
        if (this.icon) {
            this.icon.spriteFrame = null;
            unbindGuardedClick(this.icon.node, this);
            this.icon.node.targetOff(this);
        }
        if (this.infoBtn) unbindGuardedClick(this.infoBtn, this);
        if (this.count) this.count.string = '';
        if (this.countBignum) this.countBignum.string = '';
        if (this.countX) this.countX.string = '';
        if (this.countXX) this.countXX.string = '';
        if (this.countWithColor) this.countWithColor.string = '';
        if (this.labelName) this.labelName.string = '';
        if (this.desc) this.desc.string = '';
    }

    setNoCountGray (enable: any) {
        this.noCountGray = enable;
        if (this.noCountGray && this.content && this.content.Count() <= 0) {
            setSpriteGray(this.icon, true);
        } else if (this.noCountGray) {
            setSpriteGray(this.icon, false);
        }
    }
}

export default ContentModel;
