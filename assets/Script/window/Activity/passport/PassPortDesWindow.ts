import { _decorator, Component, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function fitByHeight(sprite: Sprite, height: number) {
    const spriteFrame = sprite.spriteFrame;
    if (!spriteFrame || height <= 0) return;
    const rect = spriteFrame.rect;
    if (!rect.height) return;
    const transform = sprite.node.getComponent(UITransform) || sprite.node.addComponent(UITransform);
    transform.setContentSize(rect.width * height / rect.height, height);
}

@ccclass('PassPortDesWindow')
export default class PassPortDesWindow extends UIWindow {
    public static windowPath = 'Activity/passport/PassPortDesWindow';

    @property(Component)
    svt_reward: Component | null = null;

    @property(Node)
    arrow: Node | null = null;

    @property(SpriteFrame)
    icon_raid: SpriteFrame | null = null;

    data: any = null;
    closing = false;
    pheight = 0;

    show(showParams: any) {
        this.node.active = false;
        this.get_data().then((v: any) => {
            if (!this.node) return;
            this.node.active = true;
            this.update_page(v);
        }, (e: any) => {});

        this.scheduleOnce(() => {
            this.callClose();
        }, 5);
    }

    update_page(data: any) {
        let id_list: number[] = [];
        let ids = Object.keys(data);
        for (let i = 0; i < ids.length; i++) {
            let metaId = parseInt(ids[i]);
            id_list.push(metaId);
        }

        if (!this.svt_reward) return;
        (this.svt_reward as any).setItem(id_list, (index: number, id: any, node: Node) => {
            let da = data[id];
            let meta = Meta.PassPortTaskMeta.GetById(id);
            let icon = GameKit.ControllerTable.GetComponent(node, 'icon', Sprite);
            let title = GameKit.ControllerTable.GetComponent(node, 'title', Label);
            let expTitle = GameKit.ControllerTable.GetComponent(node, 'exp', Label);
            let height = icon.node.getComponent(UITransform)?.height || 0;
            if ((this as any)[meta.Icon()]) {
                icon.spriteFrame = (this as any)[meta.Icon()];
            } else {
                icon.spriteFrame = CommonAssets.instance[meta.Icon()];
            }
            fitByHeight(icon, height);
            title.string = meta.Des() + ' ' + da['compCount'] + '/' + meta.MaxCount();
            expTitle.string = meta.Exp().toString();
        });
    }

    get_data() {
        return new Promise((res, rej) => {
            if (this.data) { res(this.data); return; }
            let sr = SR.SRActivityPassport.getTaskList();
            sr.SetCallBack((v: any) => { res(v.list); });
            sr.SetErrorCallBack(() => { rej(); });
            sr.Send();
        });
    }

    callClose() {
        if (this.closing) return;
        this.closing = true;
        this.closeAnim(() => {
            if (this.node) this.node.destroy();
        });
    }

    public static Show(content: any, params: any, x?: any, y?: any) {
        UIRoot.instance.ShowCantClick();
        let resName = 'window/' + PassPortDesWindow.windowPath;
        resources.load(resName, Prefab, (err: any, winPre: Prefab) => {
            if (err) {
                Logs.Error('openModelWindow windowPath:' + resName + (err.message || err));
                DialogWindow.Show(GameKit.i18n.t('loadResError'), () => {
                    PassPortDesWindow.Show(content, params, x, y);
                }, nullFunction);
                UIRoot.instance.CloseCantClick();
                return;
            }
            if (winPre == null) {
                UIRoot.instance.CloseCantClick();
                return;
            }

            let wnd = instantiate(winPre);
            wnd.parent = params.parent;
            wnd.setPosition(params.pos.x, params.pos.y + params.height / 2 + params.height / 10, wnd.position.z);
            let panel = wnd.getComponent(PassPortDesWindow);
            if (panel) {
                panel.pheight = params.height;
                panel.show(content);
            }
            UIRoot.instance.CloseCantClick();
        });
    }
}
