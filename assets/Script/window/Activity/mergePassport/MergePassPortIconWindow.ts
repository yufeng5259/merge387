import { _decorator, Component, Label, Node, ParticleSystem, Sprite, UIOpacity } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';
import { bindGuardedClick, unbindGuardedClick } from '../../../GameKit/ui/TouchClickGuard';

const { ccclass, property } = _decorator;

function getOpacity(node: Node) {
    return node.getComponent(UIOpacity)?.opacity ?? 255;
}

function setOpacity(node: Node, opacity: number) {
    let uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
    uiOpacity.opacity = opacity;
}

@ccclass('MergePassPortIconWindow')
export default class MergePassPortIconWindow extends UIWindow {
    public static windowPath = 'Activity/mergePassport/MergePassPortIconWindow';

    @property(Component)
    svt_reward: Component | null = null;

    @property(Node)
    rewardsLayout: Node | null = null;

    @property(Label)
    des_label: Label | null = null;

    showParams: any = null;
    rewards: any[] = [];
    selectedId = -1;
    rewardsSelectIndex = 0;
    id_list: number[] = [];
    listIndex = 0;
    lastSelectFrame: Node | null = null;

    onShow(showParams: any) {
        this.showParams = showParams;
        this.rewards = showParams.rewards || [];
        this.selectedId = showParams.mergeId || -1;
        this.rewardsSelectIndex = this.rewards.findIndex(x => x.Id() == this.selectedId);
        if (this.rewardsSelectIndex == -1) this.rewardsSelectIndex = 0;

        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeElements);
        this.id_list = [];
        let setokCount = 0;
        let setNoCount = 0;
        let ids = Object.keys(metas);
        for (let i = 0; i < ids.length; i++) {
            let metaId = parseInt(ids[i]);
            this.id_list.push(metaId);
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, metaId);
            if (meta.Name() == 'Grenades') {
                setNoCount++;
            } else {
                let generateMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(metaId);
                if (generateMeta) {
                    if (generateMeta.Output().length > 0) setokCount++;
                    else setNoCount++;
                } else {
                    setokCount++;
                }
            }
        }

        if (this.des_label) {
            this.des_label.string = 'total ' + this.id_list.length + ', configured ' + setokCount + ', missing ' + setNoCount;
        }

        if (this.svt_reward) (this.svt_reward as any).numItems = this.id_list.length;

        this.updateRewards();

        this.listIndex = this.id_list.findIndex(x => x == this.selectedId) || 0;
        if (this.svt_reward) (this.svt_reward as any).scrollTo(this.listIndex);
    }

    logEvent() {
        let contents: string[] = [];
        if (!this.rewardsLayout) return;
        this.rewardsLayout.children.forEach(child => {
            if (child.active) {
                let icon = (child.getComponent('ContentModel') as any).icon;
                if (getOpacity(icon.node) == 255) {
                    let iconname = icon.spriteFrame.name;
                    let cid = Meta.MergeElementsMeta.GetIdByIconName(iconname);
                    if (cid != -1) {
                        contents.push('9=' + cid + '=1');
                    }
                }
            }
        });
        if (contents.length > 0) {
            console.log('contentsString:', contents.join(';'));
        }

        this.rewards = Game.Content.FromStrings(contents.join(';'));

        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.MergeElements);
        let setokCount = 0;
        let setNoCount = 0;
        let ids = Object.keys(metas);
        for (let i = 0; i < ids.length; i++) {
            let metaId = parseInt(ids[i]);
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, metaId);
            if (meta.Name() == 'Grenades') {
                setNoCount++;
            } else {
                let generateMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(metaId);
                if (generateMeta) {
                    if (generateMeta.Output().length > 0) setokCount++;
                    else setNoCount++;
                } else {
                    setokCount++;
                }
            }
        }

        if (this.des_label) {
            this.des_label.string = 'total ' + this.id_list.length + ', configured ' + setokCount + ', missing ' + setNoCount;
        }
    }

    completeEvent() {
        this.logEvent();
        this.closeAnim();
    }

    itemRender(node: Node, index: number) {
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, this.id_list[index]);
        let mergeId = meta.Id();
        let icon = GameKit.ControllerTable.GetComponent(node, 'icon', Sprite);
        let infoBtn = GameKit.ControllerTable.GetNode(node, 'info');
        let title = GameKit.ControllerTable.GetComponent(node, 'text-count', Label);
        let okbtn = GameKit.ControllerTable.GetNode(node, 'ok_tb');
        title.string = mergeId;
        let spf = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon());
        icon.spriteFrame = spf;

        let shiningAnim = GameKit.ControllerTable.GetComponent(node, 'particle_texture1', ParticleSystem);

        let generateMeta = Meta.MergeGeneraterMeta.GetGenerateByMergeId(mergeId);
        if (generateMeta) {
            this.ShowShiningAnim(shiningAnim);
        } else {
            this.HideShiningAnim(shiningAnim);
        }

        let itemName = meta.Name();
        if (itemName == 'Grenades') {
            okbtn.active = false;
        } else {
            if (generateMeta) {
                okbtn.active = generateMeta.Output().length > 0;
            } else {
                okbtn.active = true;
            }
        }

        setOpacity(icon.node, this.selectedId == mergeId ? 255 : 128);

        icon.node.targetOff(this);
        unbindGuardedClick(icon.node, this);
        bindGuardedClick(icon.node, this, () => {
            this.selectedId = mergeId;
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId);
            this.changeSelectRewards(meta);
            if (this.svt_reward) (this.svt_reward as any).updateAll();
        });

        infoBtn.targetOff(this);
        unbindGuardedClick(infoBtn, this);
        bindGuardedClick(infoBtn, this, () => {
            UIRoot.instance.openChildWindow('MergeTypeWindow', { mergeId: mergeId });
        });
    }

    ShowShiningAnim(shiningAnim: ParticleSystem | null) {
        if (shiningAnim) {
            shiningAnim.duration = -1;
            shiningAnim.node.active = true;
            (shiningAnim as any).resetSystem();
        }
    }

    HideShiningAnim(shiningAnim: ParticleSystem | null) {
        if (!shiningAnim) return;
        (shiningAnim as any).stopSystem();
        shiningAnim.node.active = false;
    }

    changeSelectRewards(meta: any) {
        if (this.rewardsSelectIndex == -1 || !this.rewardsLayout) return;
        let contentModel = this.rewardsLayout.children[this.rewardsSelectIndex].getComponent('ContentModel') as any;
        contentModel.icon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon());
        this.logEvent();
    }

    updateRewards() {
        if (!this.rewardsLayout) return;
        this.rewardsLayout.children.forEach((child, index) => {
            let selectFrame = GameKit.ControllerTable.GetNode(child, 'picframe');
            let icon1 = (child.getComponent('ContentModel') as any).icon;
            setOpacity(icon1.node, 128);
            if (selectFrame) {
                selectFrame.active = false;
            }
            this.registerRewardsItem(child, index);
        });
    }

    registerRewardsItem(child: Node, index: number) {
        let contentModel = child.getComponent('ContentModel') as any;
        let icon1 = contentModel.icon;
        let infoBtn = contentModel.infoBtn;
        let selectFrame = GameKit.ControllerTable.GetNode(child, 'picframe');

        unbindGuardedClick(infoBtn, this);
        bindGuardedClick(infoBtn, this, () => {
            setOpacity(icon1.node, getOpacity(icon1.node) == 255 ? 128 : 255);
        });

        unbindGuardedClick(icon1.node, this);
        bindGuardedClick(icon1.node, this, () => {
            if (this.lastSelectFrame) {
                this.lastSelectFrame.active = false;
            }
            this.lastSelectFrame = selectFrame;
            if (this.lastSelectFrame) this.lastSelectFrame.active = true;
            this.rewardsSelectIndex = index;
            let iconname = icon1.spriteFrame.name;
            let cid = Meta.MergeElementsMeta.GetIdByIconName(iconname);
            this.selectedId = cid;
            if (this.svt_reward) (this.svt_reward as any).updateAll();
            this.listIndex = this.id_list.findIndex(x => x == this.selectedId) || 0;
            if (this.svt_reward) (this.svt_reward as any).scrollTo(this.listIndex);
        });
    }

    call_close() {
        this.closeAnim();
    }
}
