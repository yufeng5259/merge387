import { _decorator, Button, Component, find, instantiate, isValid, Label, Node, RichText, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import BuildingFocusEffect from '../../game/map/BuildingFocusEffect';

const { ccclass } = _decorator;

@ccclass('MapBuildUpgradeWindow')
export default class MapBuildUpgradeWindow extends UIWindow {
    public static windowPath = 'Map/MapBuildUpgradeWindow';

    namelbl: Label | null = null;
    levelLabel: Label | null = null;
    costLabel: RichText | null = null;
    btnLevelUp: Button | null = null;
    btnInfo: Button | null = null;
    btnClose: Button | null = null;
    buildDisplayNode: Node | null = null;
    focusEffect: BuildingFocusEffect | null = null;
    rewardsNode: Node | null = null;
    rewardItem: Node | null = null;
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
        this.showFocusBuild();
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
        this.focusEffect = this.getComponentByPath('BuildingFocusEffect', BuildingFocusEffect);
        this.rewardsNode = find('bg/upgradeNode/noStage/rewards', this.node);
        this.rewardItem = find('bg/upgradeNode/noStage/exp', this.node);
    }

    getComponentByPath<T extends Component>(path: string, type: new (...args: any[]) => T): T | null {
        const node = find(path, this.node);
        return node ? node.getComponent(type) : null;
    }

    getLabel(path: string) {
        return this.getComponentByPath(path, Label);
    }

    getRichText(path: string) {
        return this.getComponentByPath(path, RichText);
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
        this.updateCost(price, isLocked);
        this.updateButton(price, isLocked);
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
            console.log('MapBuildUpgradeWindow: no map node');
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

    showFocusBuild() { if (this.focusEffect && this.mNode) this.focusEffect.show(this.mNode); }
    clearFocusBuild() { this.focusEffect?.clear(); }
    onClose() { this.clearFocusBuild(); }

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
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('building_upgrade_button', {
                mapId: this.mapID,
                buildId: this.buildID,
            });
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
