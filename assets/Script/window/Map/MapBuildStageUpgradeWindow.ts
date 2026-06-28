import { _decorator, Button, Component, find, instantiate, isValid, Label, Node, ProgressBar, RichText, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass } = _decorator;

@ccclass('MapBuildStageUpgradeWindow')
export default class MapBuildStageUpgradeWindow extends UIWindow {
    public static windowPath = 'Map/MapBuildStageUpgradeWindow';

    namelbl: Label | null = null;
    levelLabel: Label | null = null;
    costLabel: RichText | null = null;
    btnLevelUp: Button | null = null;
    btnInfo: Button | null = null;
    btnClose: Button | null = null;
    buildDisplayNode: Node | null = null;
    rewardsNode: Node | null = null;
    rewardItem: Node | null = null;
    stageRewardLabel: Label | null = null;
    stageProgressBar: ProgressBar | null = null;
    stageCoin1Label: Label | null = null;
    stageCoin2Label: Label | null = null;
    bigRewardModel: any = null;
    meta: any = null;
    mapID: any = null;
    buildID: any = null;
    mNode: Node | null = null;
    mbid: any = null;
    context: any = null;
    buildData: any = null;
    state: any = null;

    onLoad() {
        this.cacheNodes();
        this.bindButtons();
    }

    onShow(showParams: any) {
        showParams = showParams || {};
        this.meta = showParams.meta;
        if (!this.meta) return;

        this.mapID = Game.SUserVillage.MergeMapId();
        this.buildID = this.meta.BuildID() || 0;
        this.mNode = showParams.mNode;
        this.mbid = this.mapID + '_' + this.buildID;

        this.cacheNodes();
        this.bindButtons();
        this.loadStory();
        this.showBuildNode();
        this.updatePanel();

        if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshCurrentWindow) {
            Game.MergeTutorialManager.RefreshCurrentWindow();
        }
    }

    cacheNodes() {
        if (!this.node) return;
        this.namelbl = this.getLabel('bg/bg/nameTitle');
        this.levelLabel = this.getLabel('bg/upgradeNode/levelLabel');
        this.costLabel = this.getRichText('bg/upgradeNode/btnLevelUp/costLabel');
        this.btnLevelUp = this.getComponentByPath('bg/upgradeNode/btnLevelUp', Button);
        this.btnInfo = this.getComponentByPath('bg/upgradeNode/btninfo', Button);
        this.btnClose = this.getComponentByPath('bg/close', Button);
        this.buildDisplayNode = find('bg/buildNode', this.node);
        this.rewardsNode = find('bg/upgradeNode/noStage/rewards', this.node);
        this.rewardItem = find('bg/upgradeNode/noStage/exp', this.node);
        const stageRewardLabel = this.getLabel('bg/upgradeNode/Stage/reward');
        if (stageRewardLabel) this.stageRewardLabel = stageRewardLabel;
        this.stageProgressBar = this.getComponentByPath('bg/upgradeNode/Stage/StageBarNode/bar/progressBar', ProgressBar);
        this.stageCoin1Label = this.getLabel('bg/upgradeNode/Stage/StageBarNode/bar/Sprite - coin1/New Label');
        this.stageCoin2Label = this.getLabel('bg/upgradeNode/Stage/StageBarNode/bar/Sprite - coin2/New Label');
        this.bigRewardModel = this.getComponentByPath('bg/upgradeNode/Stage/StageBarNode/bar/Sprite - coin2', 'ContentModel');
    }

    getComponentByPath(path: string, type: any): any {
        const node = find(path, this.node);
        return node ? node.getComponent(type) : null;
    }

    getLabel(path: string) {
        return this.getComponentByPath(path, Label) as Label | null;
    }

    getRichText(path: string) {
        return this.getComponentByPath(path, RichText) as RichText | null;
    }

    updateNameTitle() {
        if (!this.namelbl || !this.meta) return;
        const showname = this.meta.Showname();
        const localized: any = this.namelbl.getComponent('LabelLocalized');
        if (localized) {
            if (localized.setTextData) {
                localized.setTextData(showname);
                return;
            }
            localized.textKey = GameKit.i18n.sel(showname);
            localized.onLoad();
            return;
        }
        this.namelbl.string = GameKit.i18n.sel(showname);
    }

    bindButtons() {
        if (this.btnLevelUp && this.btnLevelUp.node) {
            this.btnLevelUp.clickEvents = [];
            this.btnLevelUp.node.off('click', this.onLevelUp, this);
            this.btnLevelUp.node.on('click', this.onLevelUp, this);
        }
        if (this.btnInfo && this.btnInfo.node) {
            this.btnInfo.clickEvents = [];
            this.btnInfo.node.off('click', this.onInfo, this);
            this.btnInfo.node.on('click', this.onInfo, this);
        }
        if (this.btnClose && this.btnClose.node) {
            this.btnClose.clickEvents = [];
            this.btnClose.node.off('click', this.close_window, this);
            this.btnClose.node.on('click', this.close_window, this);
        }
    }

    loadStory() {
        if (!this.meta || !Game.SUserStory) return;
        const url = G.GameConfig.storyPortal + this.meta.MBId() + '.txt';
        Game.SUserStory.loadStory(url, this.meta.MBId(), function() {});
    }

    updatePanel() {
        this.context = Game.SUserMap.GetBuildActionContext(this.mbid);
        this.buildData = this.context.element;
        this.state = this.context.state;
        this.updateNameTitle();

        const isLocked = this.context.isLocked;
        const price = this.context.price;

        if (this.levelLabel) this.levelLabel.string = 'lv.' + this.buildData.level + '/' + this.buildData.maxLv;

        this.showReward(this.context.displayRewards);
        this.showBigReward(this.context.bigReward);
        this.updateStagePanel(this.context);
        this.updateCost(price, isLocked);
        this.updateButton(price, isLocked);
    }

    updateStagePanel(context: any) {
        const maxStage = context.maxStage;
        const currentStage = context.currentStage;

        if (this.stageRewardLabel) this.updateStageText(currentStage, maxStage);
        if (this.stageProgressBar) this.stageProgressBar.progress = maxStage > 0 ? currentStage / maxStage : 0;
        if (this.stageCoin1Label) this.stageCoin1Label.string = this.formatNum(context.stagePaidPrice);
    }

    updateStageText(currentStage: any, maxStage: any) {
        if (!this.stageRewardLabel || !this.stageRewardLabel.node) return;
        this.stageRewardLabel.node.active = true;
        const barNode = this.stageProgressBar && this.stageProgressBar.node;
        this.stageRewardLabel.string = currentStage + '/' + maxStage;
        if (!barNode || !barNode.parent) return;
        const labelNode = this.stageRewardLabel.node;
        labelNode.parent = barNode.parent;
        const barTransform = barNode.getComponent(UITransform);
        const barWidth = barTransform ? barTransform.width : 0;
        labelNode.setPosition(barNode.position.x + barWidth * 0.5, barNode.position.y, labelNode.position.z);
    }

    updateCost(price: any, isLocked: boolean) {
        if (!this.costLabel) return;
        if (isLocked) {
            this.costLabel.string = '<outline color=#76320E width= 3>LV.' + this.meta.LimitLv() + '</outline>';
            return;
        }
        this.costLabel.string = "<outline color=#76320E width= 3><img src='1'/> " + this.formatNum(price) + ' </outline>';
    }

    updateButton(price: any, isLocked: boolean) {
        if (!this.btnLevelUp) return;
        const canAction = this.context ? this.context.canAction : !isLocked && Game.SUser.Coin() >= price;
        this.btnLevelUp.interactable = canAction;
        (this.btnLevelUp as any).enableAutoGrayEffect = !canAction;
    }

    showBigReward(reward: any) {
        if (!this.bigRewardModel || !this.bigRewardModel.node) return;
        if (!reward) {
            if (this.bigRewardModel.clear) this.bigRewardModel.clear();
            this.bigRewardModel.node.active = false;
            return;
        }
        this.bigRewardModel.node.active = true;
        this.bigRewardModel.show(reward);
    }

    showReward(rewards: any[]) {
        if (!this.rewardsNode || !this.rewardItem) return;
        this.rewardsNode.removeAllChildren();
        this.rewardItem.active = false;

        rewards = rewards || [];
        for (let i = 0; i < rewards.length; i++) {
            const rewardNode = instantiate(this.rewardItem);
            rewardNode.parent = this.rewardsNode;
            rewardNode.active = true;
            const cm: any = rewardNode.getComponent('ContentModel');
            if (cm) cm.show(rewards[i]);
        }
        const rewardItemTransform = this.rewardItem.getComponent(UITransform);
        const rewardsTransform = this.rewardsNode.getComponent(UITransform) || this.rewardsNode.addComponent(UITransform);
        const itemWidth = rewardItemTransform ? rewardItemTransform.width : 50;
        rewardsTransform.setContentSize(rewards.length * itemWidth, rewardsTransform.height);
    }

    showBuildNode() {
        if (!this.buildDisplayNode) return;
        this.buildDisplayNode.removeAllChildren();
        if (!this.mNode) {
            console.log('MapBuildStageUpgradeWindow: no map node');
            return;
        }
        const buildNodeCopy = instantiate(this.mNode);
        buildNodeCopy.parent = this.buildDisplayNode;
        (buildNodeCopy as any).groupIndex = 0;
        buildNodeCopy.setPosition(0, 0, 0);
        buildNodeCopy.setScale(0.5, 0.5, 0.5);
        const mapElementNode = this.getMapElementNode(buildNodeCopy);
        if (mapElementNode) mapElementNode.hideNode();
    }

    getMapElementNode(node: Node | null) {
        if (!isValid(node)) return null;
        const mapElementNode: any = node.getComponent('MapElementNode');
        if (mapElementNode) return mapElementNode;

        const components = node.getComponents(Component);
        for (let i = 0; i < components.length; i++) {
            const component: any = components[i];
            if (component && component.initData && component.updateElement && component.showLevelInfo) {
                return component;
            }
        }
        return null;
    }

    onLevelUp() {
        const context = Game.SUserMap.GetBuildActionContext(this.mbid);
        const price = context.price;
        if (context.isLocked) return;
        if (Game.SUser.Coin() < price) {
            Game.ContentCheck.CheckCoin(price);
            return;
        }
        const fromNode = this.getRewardFlyFromNode();
        Game.TownUpgradeFlow.start({
            meta: this.meta,
            mapID: this.mapID,
            buildID: this.buildID,
            window: this,
            fromNode: fromNode,
            fromWorldPos: fromNode ? this.convertToWorldSpaceAR(fromNode) : null,
        });
    }

    getRewardFlyFromNode() {
        return find('pos', this.node) || this.node;
    }

    convertToWorldSpaceAR(node: Node) {
        const transform = node.getComponent(UITransform);
        return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone();
    }

    formatNum(num: any) {
        if (GameKit && GameKit.StringUtil && GameKit.StringUtil.formatNumber) {
            return GameKit.StringUtil.formatNumber(num);
        }
        return String(num || 0);
    }

    onInfo() {
        UIRoot.instance.openChildWindow('HowToWindow');
    }

    close_window() {
        this.closeAnim();
    }
}
