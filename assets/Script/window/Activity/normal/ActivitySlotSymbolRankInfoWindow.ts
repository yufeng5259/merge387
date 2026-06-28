import { _decorator, Component, Label, Node, RichText } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ActivitySlotSymbolRankInfoWindow')
export default class ActivitySlotSymbolRankInfoWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivitySlotSymbolRankInfoWindow';

    @property([Node])
    nodes: Node[] = [];

    @property(Node)
    spDecoration: Node | null = null;

    @property(RichText)
    labelDes1: RichText | null = null;

    @property(RichText)
    labelDes2: RichText | null = null;

    @property(Component)
    extra: Component | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    meta: any = null;
    metaParam: any = null;
    showParam: any = null;
    activityId: any = null;
    symbolId: any = null;
    leftTime: number | null = null;
    childWindowChain: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.metaParam = this.meta.Param();
        this.showParam = this.metaParam.__info;
        this.activityId = this.meta.Id();

        this.symbolId = this.metaParam.symbolId || this.metaParam.showSymbolId;

        let rawNames: string[] = [];
        this.nodes.forEach(x => {
            CCTools.SetNodeByParam(x, this.showParam[x.name]);
            rawNames.push(x.name);
        });
        for (let name in this.showParam) {
            if (rawNames.indexOf(name) >= 0) continue;
            if (name == 'badgeTime' || name == 'oldPriceShopId') continue;
            let nnode = new Node(name);
            if (this.spDecoration) nnode.parent = this.spDecoration;
            CCTools.SetNodeByParam(nnode, this.showParam[name]);
        }

        if (this.labelDes1) this.labelDes1.string = String.format(GameKit.i18n.t('ActivitySlotCollectRankInfoLabel1'), this.symbolId);
        if (this.labelDes2) this.labelDes2.string = String.format(GameKit.i18n.t('ActivitySlotCollectRankInfoLabel2'), this.symbolId);

        if (this.extra) (this.extra as any).Show(null, this.meta);

        this.leftTime = 0;
        this.update(0);

        setTimeout(() => {
            SR.SRActivity.getUserActivity().Send();
        }, (this.meta.EndTime() - GameKit.TimeUtil.getCurrentTime()) * 1000 + 2000);
    }

    onClose() {
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = 0;

            this.leftTime = this.meta.EndTime() - currentTime;

            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            }

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    close_window() {
        this.closeAnim();
    }

    callBuy() {
        if (this.childWindowChain) {
            this.clearOnCloseFunc();
            this.childWindowChain.end();
        }
        this.closeAnim(() => { UIRoot.instance.openChildWindow('ActivitySlotSymbolRankWindow', { meta: this.meta }); });
    }
}
