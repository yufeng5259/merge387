import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, UITransform } from 'cc';
import { fitByHeight } from '../../GameKit/render/fixedSizeRatio';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';

const { ccclass, property } = _decorator;

const width3 = 450;
const width4 = 586;
const bgY = 19;

@ccclass('LimitCardDesWindow')
export class LimitCardDesWindow extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public arrow: Node = null;
    @property(Sprite)
    public bg1: Sprite = null;
    @property(Label)
    public limitLabel: Label = null;
    @property(Label)
    public countLabel: Label = null;

    public pheight = 0;
    public chest_meta: any = null;
    private closing = false;
    private bgInitPos: any = null;
    private arrowInitPos: any = null;

    onLoad() {
        if (this.bg) this.bgInitPos = this.bg.position.clone();
        if (this.arrow) this.arrowInitPos = this.arrow.position.clone();
    }

    show(reward: any) {
        const contents: any[] = [];
        const chestId = reward && typeof reward.ContentId === 'function' ? reward.ContentId() : (reward ? reward.cid : 0);
        this.chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, chestId);
        const str = this.countLabel.string;
        if (this.chest_meta) {
            this.countLabel.string = str.format(this.chest_meta.CardNum());
        }

        if (CommonAssets.instance.cardLimitSkinAssets && CommonAssets.instance.cardLimitSkinAssets.desItemBg) {
            this.bg1.spriteFrame = CommonAssets.instance.cardLimitSkinAssets.desItemBg;
        }

        const height = this.bg1.node.getComponent(UITransform).height;
        fitByHeight(this.bg1, height);
        const itemsCount = contents.length;

        const bgTransform = this.bg.getComponent(UITransform);
        if (this.bgInitPos) this.bg.setPosition(this.bgInitPos);
        bgTransform.width = width3;
        if (this.arrow && this.arrowInitPos) {
            this.arrow.setPosition(this.arrowInitPos);
            this.arrow.setScale(this.arrow.scale.x, 1, this.arrow.scale.z);
        }

        if (itemsCount >= 4) {
            bgTransform.width = width4;
        }

        this.bg.setPosition(this.bg.position.x, bgY, this.bg.position.z);

        if (UIRoot.instance && UIRoot.instance.winSize) {
            const margin = 20;
            const halfW = UIRoot.instance.winSize.width / 2;
            const panelHalfW = bgTransform.width / 2;
            const minX = -halfW + margin + panelHalfW;
            const maxX = halfW - margin - panelHalfW;
            const oldX = this.node.position.x;
            let x = oldX;
            if (x < minX) x = minX;
            else if (x > maxX) x = maxX;
            this.node.setPosition(x, this.node.position.y, this.node.position.z);

            const deltaX = x - oldX;
            if (this.arrow && deltaX !== 0) {
                this.arrow.setPosition(this.arrow.position.x - deltaX, this.arrow.position.y, this.arrow.position.z);
            }
        }

        if (this.node.getWorldPosition().y + bgY + bgTransform.height - 20 > UIRoot.instance.winSize.height / 2) {
            this.arrow.setScale(this.arrow.scale.x, -1, this.arrow.scale.z);
            this.arrow.setPosition(this.arrow.position.x, -this.arrow.position.y, this.arrow.position.z);
            this.bg.setPosition(this.bg.position.x, -this.bg.position.y - bgTransform.height, this.bg.position.z);
            this.node.setPosition(this.node.position.x, this.node.position.y - this.pheight - this.pheight / 5, this.node.position.z);
        }

        this.scheduleOnce(() => {
            this.callClose();
        }, 5);
    }

    callClose() {
        if (this.closing) return;
        this.closing = true;
        EnterCloseAnim.playClose(this.node);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.5);
    }

    static Show(content: any, params: any, x?: any, y?: any) {
        UIRoot.instance.ShowCantClick();
        const resName = 'window/Item/LimitCardDesWindow';
        cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err) {
                Logs.Error('openModelWindow windowPath:' + resName + (err.message || err));
                DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                    LimitCardDesWindow.Show(content, params, x, y);
                }, nullFunction);
                UIRoot.instance.CloseCantClick();
                return;
            }
            if (winPre == null) {
                UIRoot.instance.CloseCantClick();
                return;
            }

            const wnd = instantiate(winPre);
            wnd.parent = params.parent || UIRoot.instance.node;
            wnd.setPosition(params.pos.x, params.pos.y + params.height / 2 + params.height / 10, wnd.position.z);
            const panel = wnd.getComponent(LimitCardDesWindow);
            panel.pheight = params.height;
            panel.show(content);
            UIRoot.instance.CloseCantClick();
        });
    }
}

export default LimitCardDesWindow;
