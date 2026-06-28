import { _decorator, Component, Label, Node, ProgressBar, RichText } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ActivityCollectSymbolWindow')
export default class ActivityCollectSymbolWindow extends UIWindow {
    public static windowPath = 'Activity/normal/ActivityCollectSymbolWindow';

    @property(RichText)
    labelDes: RichText | null = null;

    @property(Label)
    labelProgress: Label | null = null;

    @property(ProgressBar)
    spProgress: ProgressBar | null = null;

    @property(Label)
    labelReward: Label | null = null;

    @property(Label)
    labelFinalReward: Label | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Component)
    reward: Component | null = null;

    @property(Component)
    addItem: Component | null = null;

    @property(Node)
    barNode: Node | null = null;

    @property(Node)
    barTiaoNode: Node | null = null;

    meta: any = null;
    userdata: any = null;
    leftTime: number | null = null;

    onShow(showParams: any) {
        this.meta = showParams.meta
        this.userdata = Game.SUserActivity.GetActivityData(this.meta.Id())||{}
        
        let currentCount = this.userdata.currentCount || 0
        let currentId = this.userdata.currentId || 1
        let currentNeed = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMaster, currentId)
        let currentGet = Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMasterReward, currentId))
        //let maxGet = Meta.MetaManager.GetMeta(Meta.MetaType.ActivityAttackMasterGet, Game.SUserVillage.MapId()).GetCoin(Game.ActivityManager.Constance.attackMasterMaxId)
        let currentGetLimt =Game.Content.FromString(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.AttackMasterLimitedReward, currentId));
        let currentLimtTime = this.userdata.limitedTime||0
        let limtTime = currentLimtTime-GameKit.TimeUtil.getCurrentTime()

        if (this.labelDes) this.labelDes.string = String.format(GameKit.i18n.t("ActivityAttackMasterDes"), currentNeed, currentGet.ColorCode() + BigNumber.format(currentGet.Contents()[0].Count()), currentGet.Name())
        if (this.labelProgress) this.labelProgress.string = currentCount.toString() + "/" + currentNeed
        if (this.spProgress) this.spProgress.progress = currentCount/currentNeed
        if (this.reward) (this.reward as any).show(currentGet)
        if(currentGetLimt&&limtTime>0){
            if (this.barNode) this.barNode.setPosition(0, this.barNode.position.y, this.barNode.position.z);
            if (this.addItem) (this.addItem as any).setAttackMeta(this.meta)
        }else{
            if (this.barNode) this.barNode.setPosition(45, this.barNode.position.y, this.barNode.position.z);
            // this.barNode.x = 0;
            if (this.addItem) (this.addItem as any).setAttackMeta(this.meta)
        }
        
        //this.labelFinalReward.string = String.format(GameKit.i18n.t("ActivityAttackMasterFinal2"), BigNumber.format(maxGet))
        
        this.leftTime = 0
        this.update(0)
    }

    update(dt?: number) {
        if (this.leftTime != null) {

            let currentTime = GameKit.TimeUtil.getCurrentTime()
            this.leftTime = 0
            
            this.leftTime = 1//this.meta.EndTime() - currentTime

            if (this.labelTimer) this.labelTimer.string = String.format(GameKit.i18n.t("ActivityAttackMasterTimeleft"), GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false))

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }
    }

    close_window() {
        this.closeAnim()
    }

    callGo() {
        this.closeAnim(() => { GamePlay.instance.changeScene(GamePlay.Scenes.Slot) })
    }
}
