import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import ContentModel from '../../game/items/ContentModel';
import { EnterCloseAnim } from '../../GameKit/ui/EnterCloseAnim';

const { ccclass, property } = _decorator;

const width4 = 586;
const bgY = 19;

@ccclass('InviteRewardsPanel')
export class InviteRewardsPanel extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public arrow: Node = null;
    @property(Node)
    public reward_layout: Node = null;
    @property(Node)
    public item: Node = null;

    public pheight = 0;
    private closing = false;

    show(meta: any) {
        const contents = meta.Contents();
        for (let i = 0; i < contents.length; i++) {
            const content = Game.Content.FromContent(contents[i]);
            const newItem = instantiate(this.item);
            newItem.parent = this.reward_layout;
            newItem.setPosition(newItem.position.x, 0, newItem.position.z);
            newItem.active = true;
            newItem.getComponent(ContentModel).show(content);
        }

        const itemsCount = contents.length;
        let maxW = 180;
        if (itemsCount >= 4) {
            this.bg.getComponent(UITransform).width = width4;
            maxW = 250;
        }

        let px = 0;
        const nx = this.node.getWorldPosition().x;
        if (nx > maxW) px = nx - maxW;
        else if (nx < -maxW) px = nx + maxW;

        this.bg.setWorldPosition(new Vec3(px + 100, 0, this.bg.worldPosition.z));
        this.bg.setPosition(this.bg.position.x, bgY - 30, this.bg.position.z);
        this.arrow.setPosition(this.arrow.position.x, this.arrow.position.y - 30, this.arrow.position.z);

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

    static Show(packId: any, params: any, x?: any, y?: any) {
        UIRoot.instance.ShowCantClick();
        const resName = 'window/Item/InviteRewardsPanel';
        cce.loadRes(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err) {
                Logs.Error('openModelWindow windowPath:' + resName + (err.message || err));
                DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                    InviteRewardsPanel.Show(packId, params, x, y);
                }, nullFunction);
                UIRoot.instance.CloseCantClick();
                return;
            }
            if (winPre == null) {
                UIRoot.instance.CloseCantClick();
                return;
            }

            const wnd = instantiate(winPre);
            wnd.parent = params.parent;
            wnd.setPosition(params.pos.x, params.pos.y + params.height / 2 + params.height / 10, wnd.position.z);
            const panel = wnd.getComponent(InviteRewardsPanel);
            panel.pheight = params.height;
            panel.show(packId);
            UIRoot.instance.CloseCantClick();
        });
    }
}

export default InviteRewardsPanel;
