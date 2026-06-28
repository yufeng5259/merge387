import { _decorator, Button, Component, instantiate, isValid, Label, Node, ProgressBar, RichText, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('MapElementWindow')
export default class MapElementWindow extends UIWindow {
    public static windowPath = 'Map/MapElementWindow';

    @property(Label)
    namelbl: Label | null = null;

    @property(Label)
    levelLabel: Label | null = null;

    @property(RichText)
    costLabel: RichText | null = null;

    @property(Button)
    btnLevelUp: Button | null = null;

    @property(Node)
    allComNode: Node | null = null;

    @property(Node)
    upgradeNode: Node | null = null;

    @property(Node)
    buildDisplayNode: Node | null = null;

    @property(Node)
    rewardsNode: Node | null = null;

    @property(Node)
    rewardItem: Node | null = null;

    @property(Node)
    talkNode: Node | null = null;

    @property(Node)
    stageNode: Node | null = null;

    @property(Node)
    noStageNode: Node | null = null;

    @property(Node)
    levelNode: Node | null = null;

    meta: any = null;
    mapID: any = null;
    buildID: any = null;
    mNode: Node | null = null;
    mbid: any = null;
    buildData: any = null;
    currentLevelStage: any = null;
    StageShow: any = null;

    onShow(showParams: any) {
        this.meta = showParams.meta;
        this.mapID = Game.SUserVillage.MergeMapId();
        this.buildID = this.meta.BuildID() || 0;
        this.mNode = showParams.mNode;
        this.mbid = this.mapID + '_' + this.buildID;

        if (this.talkNode) this.talkNode.active = Game.SUserMap.IsFullLevel(this.meta.MBId());
        this.buildData = Game.SUserMap.getElement(this.mbid);
        if (!this.buildData) {
            console.log('Error' + this.buildID);
            return;
        }
        this.currentLevelStage = this.buildData.stage;
        this.StageShow = this.buildData.stageShow;
        console.log('map=', this.mapID, 'buildID=', this.buildID, 'level=', this.buildData.level, 'stage=', this.currentLevelStage, 'stageShow=', this.buildData.stageShow);

        const url = G.GameConfig.storyPortal + this.meta.MBId() + '.txt';
        Game.SUserStory.loadStory(url, this.meta.MBId(), () => {
            console.log('数据加载完成', this.meta.MBId());
        });

        this.showReward();
        this.showBuildNode();
        this.updatePanel();
    }

    updatePanel() {
        this.updateLevelNode();
        const currentLevel = this.buildData.level + 1;
        const isMaxLevel = Game.SUserMap.IsFullLevel(this.mbid);
        if (this.allComNode) {
            this.allComNode.active = isMaxLevel;
        }
        if (this.upgradeNode) this.upgradeNode.active = !isMaxLevel;
        if (isMaxLevel) {
            if (this.stageNode) this.stageNode.active = !isMaxLevel;
            if (this.noStageNode) this.noStageNode.active = !isMaxLevel;
            return;
        }
        if (this.levelLabel) {
            this.levelLabel.string = 'lv.' + this.buildData.level + '/' + this.buildData.maxLv;
        }
        const priceList = this.meta.Price(currentLevel);
        const rewardList = this.meta.Reward(currentLevel);
        if (this.stageNode) this.stageNode.active = priceList.length > 1;
        if (this.noStageNode) this.noStageNode.active = priceList.length === 1;
        if (priceList.length > 1 && this.stageNode) {
            const pb = GameKit.ControllerTable.GetComponent(this.stageNode, 'progressBar', ProgressBar);
            const scLab = GameKit.ControllerTable.GetComponent(this.stageNode, 'stageCount', Label);
            const itemModel1 = GameKit.ControllerTable.GetComponent(this.stageNode, 'rewardNode1', 'ContentModel');
            const itemModel2 = GameKit.ControllerTable.GetComponent(this.stageNode, 'rewardNode2', 'ContentModel');

            const totalS = this.meta.GetPriceMaxStage(currentLevel);
            pb.progress = this.meta.PricePre(currentLevel, this.currentLevelStage);
            scLab.string = String.format(GameKit.i18n.t('Chapter_Stage'), this.StageShow, totalS);
            const xxx = this.meta.PricePre(currentLevel, this.StageShow) * 328;
            const xx = 22 + xxx;
            itemModel1.node.setPosition(xx, 6);
            itemModel2.show(Game.Content.FromString(rewardList[rewardList.length - 1]));
            itemModel1.node.active = true;
            if ((rewardList.length - this.StageShow) !== 1) {
                itemModel1.show(Game.Content.FromString(rewardList[this.StageShow]));
            } else {
                itemModel1.node.active = false;
            }
        }

        if (this.namelbl) this.namelbl.string = GameKit.i18n.sel(this.meta.Showname());

        const upgradeCost = this.meta.Price(currentLevel);
        if (this.costLabel) {
            this.costLabel.string = "<outline color=#76320E width= 3><img src='1'/> " + upgradeCost + ' </outline>';
        }

        if (this.btnLevelUp) {
            const canUpgrade = this.meta.isCanUp(currentLevel, this.StageShow);
            this.btnLevelUp.interactable = canUpgrade;
            (this.btnLevelUp as any).enableAutoGrayEffect = !canUpgrade;
        }
    }

    showReward() {
        if (!this.rewardsNode || !this.rewardItem) return;
        this.rewardsNode.removeAllChildren();
        const isMaxLevel = Game.SUserMap.IsFullLevel(this.mbid);
        if (isMaxLevel) {
            if (this.stageNode) this.stageNode.active = !isMaxLevel;
            if (this.noStageNode) this.noStageNode.active = !isMaxLevel;
            return;
        }
        const reward = Game.Content.FromStrings(this.meta.Reward(this.buildData.level + 1));
        const rewards = Game.Content.Merge(reward);
        for (let index = 0; index < rewards.length; index++) {
            const element = rewards[index];
            const expNode = instantiate(this.rewardItem);
            expNode.parent = this.rewardsNode;
            const cm: any = expNode.getComponent('ContentModel');
            expNode.active = true;
            cm.show(element);
        }
        const rewardItemTransform = this.rewardItem.getComponent(UITransform);
        const rewardsTransform = this.rewardsNode.getComponent(UITransform) || this.rewardsNode.addComponent(UITransform);
        const itemWidth = rewardItemTransform ? rewardItemTransform.width : 0;
        rewardsTransform.setContentSize(rewards.length * itemWidth, rewardsTransform.height);
    }

    onLevelUp() {
        const element = Game.SUserMap.getElement(this.mbid);
        if (!element || !element.unlocked) {
            return;
        }
        const nextLevel = element.level + 1;
        const curS = this.currentLevelStage === -1 ? 0 : this.currentLevelStage;
        if (!this.meta.isCanUp(nextLevel, curS)) {
            Game.ContentCheck.CheckCoin(this.meta.Price(nextLevel, curS));
            return;
        }
        console.log('升级前等级', element.level);
        const oldLevel = element.level;
        const req = SR.SRVillage.levelUpElement(this.mapID, this.buildID);
        req.SetCallBack(() => {
            upvillage();
        });
        req.Send();
        const upvillage = () => {
            const reqV = SR.SRVillage.getUserVillage();
            reqV.SetCallBack(() => {
                Game.SUserMap.initMapData();
                GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MapElementLevelUp, {
                    buildID: this.buildID,
                    level: element.level,
                    stage: element.stage,
                    oldLv: oldLevel,
                });
                console.log('升级后等级', element.level);
            });
            this.close_window();
            reqV.Send();
        };
    }

    showBuildNode() {
        if (!this.buildDisplayNode) return;

        this.buildDisplayNode.removeAllChildren();

        if (!this.mNode) {
            console.log('MapElementWindow: 找不到MapNode');
            return;
        }
        const buildNodeCopy = instantiate(this.mNode);
        buildNodeCopy.parent = this.buildDisplayNode;
        (buildNodeCopy as any).groupIndex = 0;
        buildNodeCopy.setPosition(0, 0, 0);
        buildNodeCopy.setScale(0.5, 0.5, 0.5);
        const mapElrmentNode = this.getMapElementNode(buildNodeCopy);
        if (mapElrmentNode) mapElrmentNode.hideNode();
    }

    getMapElementNode(node: Node | null) {
        if (!isValid(node)) return null;
        const mapElrmentNode: any = node.getComponent('MapElementNode');
        if (mapElrmentNode) {
            return mapElrmentNode;
        }

        const components = node.getComponents(Component);
        for (let i = 0; i < components.length; i++) {
            const component: any = components[i];
            if (component && component.initData && component.updateElement && component.showLevelInfo) {
                return component;
            }
        }

        return null;
    }

    updateLevelNode() {
        if (!this.levelNode) return;
        const pb = GameKit.ControllerTable.GetComponent(this.levelNode, 'progressBar', ProgressBar);
        const lvLbl = GameKit.ControllerTable.GetComponent(this.levelNode, 'labelLV', Label);
        const expLab = GameKit.ControllerTable.GetComponent(this.levelNode, 'expLab', Label);
        const itemModel1 = GameKit.ControllerTable.GetNode(this.levelNode, 'rewardNode1');
        const lvMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Level, Game.SUser.Level());
        pb.progress = Game.SUser.Exp() / lvMeta.Exp();
        lvLbl.string = Game.SUser.Level();
        expLab.string = Game.SUser.Exp() + '/' + lvMeta.Exp();

        const giftRewards = Game.Content.FromStrings(Meta.MetaManager.GetMeta(Meta.MetaType.Level, Game.SUser.Level()).Rewards());
        itemModel1.children.forEach((child: Node, index: number) => {
            if (index < giftRewards.length) {
                child.active = true;
                (child.getComponent('ContentModel') as any).show(giftRewards[index], { infoBtnParams: { canTouch: false, showInfoBtn: true } });
            } else {
                child.active = false;
            }
        });
    }

    onTalkWindow() {
        const obj = { level: this.buildData.level, meta: this.meta, record: true };
        UIRoot.instance.openChildWindow('StoryWindow', obj);
        this.close_window();
    }

    onInfo() {
        UIRoot.instance.openChildWindow('HowToWindow');
    }

    close_window() {
        this.closeAnim();
    }
}
