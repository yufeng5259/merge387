import { _decorator, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

function createSpriteFrame(imageAsset: ImageAsset) {
    const texture = new Texture2D();
    texture.image = imageAsset;
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    return spriteFrame;
}

@ccclass('ActivityCenterWindow')
export default class ActivityCenterWindow extends UIWindow {
    public static windowPath = 'Activity/ActivityCenterWindow';

    @property(Component)
    tab_node_array: Component | null = null;

    @property(Component)
    tab_scv: Component | null = null;

    @property(Sprite)
    page_image: Sprite | null = null;

    @property(Label)
    page_labelTime: Label | null = null;

    @property(Component)
    page_help: Component | null = null;

    @property(Label)
    page_name: Label | null = null;

    @property(Label)
    page_des: Label | null = null;

    @property(Node)
    page_extra: Node | null = null;

    activities: any[] = [];
    leftTimeList: Array<{ meta: any, labelTimer: Label }> = [];
    lastUpdateTime = 0;
    leftTime: number | null = null;

    onShow(showParams?: any) {
        this.node.setPosition(Vec3.ZERO);

        this.activities = Game.ActivityManager.GetActiveGameActivities()
        this.activities = this.activities.filter(meta => meta.Param().showInCenter !== false)
        


        let GoldTradeMeta = Game.ActivityManager.GetActiveOtherActivityByType(Meta.ActivityMeta.SubTypes.GoldTrade)
        if (GoldTradeMeta) this.activities.push(GoldTradeMeta)

        let HugeSpinsMeta = Game.ActivityManager.GetActiveOtherActivityByType(Meta.ActivityMeta.SubTypes.HugeSpins)
        if (HugeSpinsMeta) this.activities.push(HugeSpinsMeta)


        
        this.activities.sort((a,b) => {

            //return a.Activity_sorting()-b.Activity_sorting();
            return Meta.ActivityMeta.GameSubTypesOrder[a.Type() * 100 + a.SubType()] - Meta.ActivityMeta.GameSubTypesOrder[b.Type() * 100 + b.SubType()]
        })

        let ids = []
        this.leftTimeList = []
        this.activities.forEach((meta, index) => {
            ids.push(meta.Id())
        })
        ;(this.tab_scv as any).setItem(ids, (index: number, id: any, node: Node) => {
            let meta = this.activities[index]

            let img = meta.Icon()
            if (img.startsWith("http")) {
                cce.loaderLoad({url: img, type: "png"}, (err: any, v: ImageAsset) => {
                    if (err != null) { Logs.Warning(err); return }
                    if (!node || !this.node) return
                    let spf = createSpriteFrame(v)
                    GameKit.ControllerTable.GetComponent(node, "icon1", Sprite).spriteFrame = spf
                    //GameKit.ControllerTable.GetComponent(node, "icon2", Sprite).spriteFrame = spf
                })
            } else {
                let resName = 'res/Activity/icons/' + img
                cce.loadRes(resName, SpriteFrame, (err: any, v: SpriteFrame) => {
                    if (err != null) { Logs.Warning(err); return }
                    if (!node || !this.node) return
                    GameKit.ControllerTable.GetComponent(node, "icon1", Sprite).spriteFrame = v
                    //GameKit.ControllerTable.GetComponent(node, "icon2", Sprite).spriteFrame = v
                })
            }

            let btn = GameKit.ControllerTable.GetNode(node, "btn")
            btn.on("click", () => {
                this.click_Go(meta)
            }, this)
            
            this.updateBadge(index, node)

            let spTimer = GameKit.ControllerTable.GetNode(node, "spTimer")
            let labelTimer = GameKit.ControllerTable.GetComponent(node, "labelTimer", Label)
            this.leftTimeList.push({meta:meta, labelTimer:labelTimer})

            spTimer.active = true
        }, {noLazy:true})


        AppKit.LogEventWrap.logEvent("window_activitycenter")
    }

    update(dt: number) {
        this.updateTime(dt)
    }

    close_window() {
        this.closeAnim()
    }

    updateTime(dt: number) {
        let cTime = GameKit.TimeUtil.getCurrentTime()
        dt = this.lastUpdateTime ? cTime - this.lastUpdateTime : dt
        this.lastUpdateTime = cTime
        
        this.leftTimeList.forEach(x => {
            let leftTime = x.meta.EndTime() - cTime
            if (leftTime <= 0) leftTime = 0
            x.labelTimer.string = String.format(GameKit.i18n.t("ActivityCenterTime2"), GameKit.TimeUtil.FormatRemainTimeSimple(leftTime, false))
        })
        if (this.leftTime != null) {
            this.leftTime -= dt
            if (this.leftTime <= 0) this.leftTime = 0
            this.page_labelTime
        }
    }

    click_Go(meta: any) {
        //let meta = this.activities[this.activityIndex]
        if (!meta.IsActive()) {
            DialogWindow.Show(GameKit.i18n.t("ActivityCenterTimeEnd"), nullFunction)
            return
        }
        let icon_goto = meta.IconGoto()
        if (icon_goto == "panel") {
            this.closeAnim(() => {UIRoot.instance.openChildWindow(meta.Panel(), {meta: meta})})
        } else if (icon_goto == "slot") {
            this.closeAnim(() => {GamePlay.instance.changeScene(GamePlay.Scenes.Slot)})
        } else if (icon_goto == "village") {
            this.closeAnim(() => {GamePlay.instance.changeScene(GamePlay.Scenes.Village)})
        } else if (icon_goto == "window") {
            this.closeAnim(() => {UIRoot.instance.openChildWindow(meta.Panel(), {meta: meta})})
        } else {
            this.closeAnim(() => {UIRoot.instance.openChildWindow(icon_goto, {meta: meta})})
        }
    }

    updateBadge(index: number, tab: Node) {
        let meta = this.activities[index]
        GameKit.ControllerTable.GetNode(tab, "badge").active = Game.SUserActivity.GetGameActivityBadgeStateByType(meta.SubType())
    }
}
