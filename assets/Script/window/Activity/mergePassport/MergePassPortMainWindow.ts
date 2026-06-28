import { _decorator, Button, Color, Component, Label, Node, ProgressBar, Sprite, SpriteAtlas, tween, UITransform, Vec3, view } from 'cc';
import { UIWindow } from '../../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

const shopId = 1401;
const type = 1;
const subType = 13;

function getTransform(node: Node | null) {
    return node ? node.getComponent(UITransform) : null;
}

function getNodeHeight(node: Node | null) {
    return getTransform(node)?.height || 0;
}

function convertToWorldSpaceAR(node: Node, localPosition: Vec3) {
    const transform = getTransform(node);
    return transform ? transform.convertToWorldSpaceAR(localPosition) : localPosition;
}

function convertToNodeSpaceAR(node: Node, worldPosition: Vec3) {
    const transform = getTransform(node);
    return transform ? transform.convertToNodeSpaceAR(worldPosition) : worldPosition;
}

@ccclass('MergePassPortMainWindow')
export default class MergePassPortMainWindow extends UIWindow {
    public static windowPath = 'Activity/mergePassport/MergePassPortMainWindow';

    @property(Label)
    labelLevel1: Label | null = null;

    @property(ProgressBar)
    exp_progress: ProgressBar | null = null;

    @property(Button)
    buyLevelButton: Button | null = null;

    @property(Node)
    hoverBg: Node | null = null;

    @property(Node)
    hoverLine: Node | null = null;

    @property(Label)
    labelActive: Label | null = null;

    @property(Node)
    maxRewardItem: Node | null = null;

    @property(Button)
    buyPassportButton: Button | null = null;

    @property(Node)
    reward_item: Node | null = null;

    @property(Component)
    svt_reward: Component | null = null;

    @property(Label)
    labelTimer: Label | null = null;

    @property(Node)
    animFlagFly: Node | null = null;

    @property(Node)
    taskContainer: Node | null = null;

    @property(Component)
    svt_task: Component | null = null;

    @property(Sprite)
    activityTitlebg: Sprite | null = null;

    @property(Sprite)
    bottomBg: Sprite | null = null;

    @property(Sprite)
    currentlvBg: Sprite | null = null;

    @property(Sprite)
    nextlvBg: Sprite | null = null;

    @property(Sprite)
    next10lvBg: Sprite | null = null;

    @property(Sprite)
    next10ItemBg: Sprite | null = null;

    @property(Sprite)
    activityBg: Sprite | null = null;

    @property(Sprite)
    buyTitleBg: Sprite | null = null;

    @property(Sprite)
    buy_item: Sprite | null = null;

    @property(Sprite)
    freeTitleBg: Sprite | null = null;

    @property(Sprite)
    free_item: Sprite | null = null;

    activityMeta: any = null;
    activityId: any = null;
    subjectName = '';
    atlas: SpriteAtlas | null = null;
    rewardMetas: any = null;
    rewardIds: string[] = [];
    taskMetasArr: any[] = [];
    unlockLevel = 0;
    leftTime: number | null = null;
    content: any = null;

    onShow(showParams: any) {
        this.activityMeta = showParams.meta;
        this.activityId = this.activityMeta.Id();
        this.subjectName = this.activityMeta.ShortName();

        let atlasPath = 'res/Activity/newpassort/' + this.subjectName + '/atlas';
        cce.loadRes(atlasPath, SpriteAtlas, (err: any, atlas: SpriteAtlas) => {
            if (err) {
                Logs.Warning(err);
                return;
            }
            this.atlas = atlas;
            this.initBg(() => {});
        });

        setTimeout(() => {
            this.setRewardListAndTaskList();
        }, 10);

        if (this.hoverBg) {
            const visibleSize = view.getVisibleSize();
            let transform = this.hoverBg.getComponent(UITransform) || this.hoverBg.addComponent(UITransform);
            transform.setContentSize(visibleSize.width, visibleSize.height);
            this.hoverBg.setPosition(0, this.hoverBg.position.y, this.hoverBg.position.z);
        }

        if (this.exp_progress) {
            this.exp_progress.node.on(Node.EventType.TOUCH_END, (e: any) => {
                let parent = this.exp_progress?.node.parent;
                if (!parent) return;
                let dpos = convertToNodeSpaceAR(this.node, convertToWorldSpaceAR(parent, Vec3.ZERO));
                PassPortDesWindow.Show(this.content, { parent: this.node, pos: dpos, height: getNodeHeight(parent) });
                e.stopPropagation();
            }, this);
        }

        this.leftTime = 0;
    }

    initBg(onDone?: () => void) {
        const queue: Array<[string, Sprite | null]> = [
            ['activityTitlebg', this.activityTitlebg],
            ['bottomBg', this.bottomBg],
            ['lvbg', this.currentlvBg],
            ['lvbg', this.nextlvBg],
            ['lvbg', this.next10lvBg],
            ['next10ItemBg', this.next10ItemBg],
            ['activityBg', this.activityBg],
            ['buyTitleBg', this.buyTitleBg],
            ['buy_item', this.buy_item],
            ['freeTitleBg', this.freeTitleBg],
            ['free_item', this.free_item],
        ];
        const loadNext = (index: number) => {
            if (index >= queue.length) {
                if (onDone) onDone();
                return;
            }
            const [imgName, sprite] = queue[index];
            this.loadBg(imgName, sprite, () => loadNext(index + 1));
        };
        loadNext(0);
    }

    loadBg(imgName: string, sprite: Sprite | null, onDone?: () => void) {
        let frame = this.atlas?.getSpriteFrame(imgName);
        if (frame && sprite) {
            sprite.spriteFrame = frame;
        }
        if (onDone) onDone();
    }

    event_buy_level() {
    }

    event_buy_passport() {
    }

    event_open_Info() {
    }

    event_open_Help() {
        UIRoot.instance.openChildWindow('PassPortHelpWindow');
    }

    onClose() {
    }

    setRewardListAndTaskList() {
        let userActivityData = Game.SUserActivity.GetActivityData(this.activityId);
        let received_free = userActivityData.received_free || [];

        this.rewardMetas = Meta.MetaManager.GetMetas(Meta.MetaType.NewpassPort);
        this.rewardIds = Object.keys(this.rewardMetas);

        this.setTotalLevel();
        if (this.svt_reward) (this.svt_reward as any).numItems = this.rewardIds.length;

        let rewardIndex = 0;
        for (let index = 0; index < this.unlockLevel; index++) {
            if (index <= this.unlockLevel) {
                rewardIndex = index;
                if (received_free.indexOf(index) < 0) {
                    break;
                }
            }
        }

        if (this.svt_reward) (this.svt_reward as any).scrollTo(rewardIndex);

        let dailyTask = userActivityData.dailyTask;
        this.taskMetasArr = Meta.NewPassPortTaskMeta.GetTaskByType(userActivityData.dailyTask.type);
        this.taskMetasArr = this.taskMetasArr.filter(meta => !dailyTask.received.includes(meta.Id()));
        this.taskMetasArr.push(null);
        this.taskMetasArr.push(Meta.MetaManager.GetMeta(Meta.MetaType.NewpassPortTask, 0));
        if (this.svt_task) (this.svt_task as any).numItems = this.taskMetasArr.length;
    }

    setTotalLevel() {
        let userActivityData = Game.SUserActivity.GetActivityData(this.activityId);
        let levelExp = userActivityData.exp;
        let lv = 1;
        let meta: any = null;
        for (let i = 0; i < this.rewardIds.length; i++) {
            const id = this.rewardIds[i];
            meta = this.rewardMetas[id];
            if (levelExp >= meta._data.exp) {
                levelExp -= meta._data.exp;
                lv++;
            }
        }
        if (!meta) return;

        let maxLevel = meta._data.level;
        while (levelExp >= meta._data.exp) {
            levelExp -= meta._data.exp;
            lv++;
        }

        let currentLevel = Math.min(lv, maxLevel);
        let nextLevel = Math.min(currentLevel + 1, maxLevel);
        if (this.labelLevel1) this.labelLevel1.string = nextLevel.toString();

        let nextLevelTotalMeta = Meta.NewPassPortMeta.GetMetaByLevel(currentLevel);
        let progress = levelExp / nextLevelTotalMeta.Exp();
        let questProgressString = this.exp_progress?.node.getChildByName('quest-progress-string')?.getComponent(Label);
        if (questProgressString) questProgressString.string = levelExp + '/' + nextLevelTotalMeta.Exp();
        if (this.exp_progress) this.exp_progress.progress = progress;

        this.unlockLevel = Math.max(currentLevel, userActivityData.buyLevel);
    }

    update(dt?: number) {
        if (this.leftTime != null) {
            let currentTime = GameKit.TimeUtil.getCurrentTime();

            this.leftTime = this.activityMeta.EndTime() - currentTime;

            if (this.labelTimer) {
                this.labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ': ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);
            }

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }

    callClose() {
        this.closeAnim();
    }

    onTaskItemRender(node: Node, index: number) {
        const meta = this.taskMetasArr[index];
        let des = GameKit.ControllerTable.GetNode(node, 'des');
        if (!meta) {
            des.active = true;
            return;
        }
        let taskId = meta.Id();
        let taskType = meta.Type();

        des.active = false;
        let userActivityData = Game.SUserActivity.GetActivityData(this.activityId);
        let dailyTask = userActivityData.dailyTask;
        let round = dailyTask.round;

        let icon = GameKit.ControllerTable.GetComponent(node, 'icon', Sprite);
        icon.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon());
        let timelabel = GameKit.ControllerTable.GetComponent(node, 'timelabel', Label);
        let deslabel = GameKit.ControllerTable.GetComponent(node, 'deslabel', Label);
        let progressbar = GameKit.ControllerTable.GetComponent(node, 'progressbar', ProgressBar);
        let progresslabel = GameKit.ControllerTable.GetComponent(node, 'progresslabel', Label);
        let rewardModel = GameKit.ControllerTable.GetComponent(node, 'rewardModel', Component) as any;
        let completebtn = GameKit.ControllerTable.GetNode(node, 'completebtn');
        let bg = GameKit.ControllerTable.GetNode(node, 'bg');
        bg.setScale(1, 1, 1);
        timelabel.string = GameKit.i18n.t('ActivityTimeleft') + ': ' + GameKit.TimeUtil.FormatRemainTimeSimple(meta.RemainingTime(), true);

        let expValue = 0;
        let progress = 0;
        let currentCount = 0;
        let maxCount = 0;

        if (taskId == 0) {
            timelabel.node.active = false;
            round = 1;
            maxCount = meta.Count() * round;
            currentCount = Math.min(dailyTask.fixedStats[taskType], maxCount);
        } else {
            timelabel.node.active = true;
            maxCount = meta.Count() * round;
            currentCount = Math.min(dailyTask.typeCount, maxCount);
        }

        expValue = meta.ExpValue() * round;

        deslabel.string = String.format(meta.Name(), maxCount);
        let countWithColorLabel = rewardModel.countWithColor;
        countWithColorLabel.string = BigNumber.format(expValue);

        progress = currentCount / maxCount;
        progressbar.progress = progress;
        progresslabel.string = currentCount.toString() + '/' + maxCount.toString();

        if (progress >= 1) {
            progressbar.node.active = false;
            completebtn.active = true;
            (bg as any).color = new Color().fromHEX('#7EF783');
        } else {
            progressbar.node.active = true;
            completebtn.active = false;
            (bg as any).color = new Color().fromHEX('#FFFFFF');
        }

        completebtn.once(Node.EventType.TOUCH_END, () => {
            let req = SR.SRActivityPassport.NewPassportCollectTask(meta.Id());
            req.SetCallBack((res: any) => {
                console.log(res, 'res');
                tween(bg)
                    .to(0.5, { scale: new Vec3(0, 0, 0) })
                    .call(() => {
                        this.setRewardListAndTaskList();
                    })
                    .start();
            });
            req.Send();
        }, this);
    }

    onRewardItemRender(node: Node, index: number) {
        const id = this.rewardIds[index];
        let meta = this.rewardMetas[id];
        let userActivityData = Game.SUserActivity.GetActivityData(this.activityId);

        let level = meta._data.level;
        let reward_item = GameKit.ControllerTable.GetNode(node, 'reward-item');
        reward_item.active = false;
        let labelLevel = GameKit.ControllerTable.GetComponent(node, 'labelLevel', Label);
        labelLevel.string = level.toString();

        let buyItem = GameKit.ControllerTable.GetNode(node, 'buy_item');
        let buy_reward_layout = GameKit.ControllerTable.GetNode(buyItem, 'reward-layout');
        let buyRewards = Game.Content.FromStrings(meta._data.buyContents);

        buy_reward_layout.children.forEach((child, index) => {
            if (index < buyRewards.length) {
                child.active = true;
                (child.getComponent('ContentModel') as any).show(buyRewards[index], { infoBtnParams: { canTouch: false, showInfoBtn: true } });
            } else {
                child.active = false;
            }
        });
        let n = buyRewards.length;
        let scale = 1.9 - 0.3 * n;
        if (scale < 1) scale = 1;
        buy_reward_layout.setScale(scale, scale, scale);

        let buy_lock = GameKit.ControllerTable.GetNode(buyItem, 'buy-lock');
        let buy_quest_btn = GameKit.ControllerTable.GetNode(buyItem, 'quest-btn');
        let buy_icon_state = GameKit.ControllerTable.GetNode(buyItem, 'icon_state');
        buy_quest_btn.targetOff(this);
        buy_quest_btn.off(Node.EventType.TOUCH_END);
        buy_quest_btn.on(Node.EventType.TOUCH_END, () => {
            let req = SR.SRActivityPassport.NewPassportCollectBuy(level);
            req.SetCallBack((res: any) => {
                console.log(res, 'res');
                if (this.svt_reward) (this.svt_reward as any).updateAll();
            });
            req.Send();
        }, this);

        if ((userActivityData.received_passport || []).indexOf(level) >= 0) {
            buy_lock.active = false;
            buy_quest_btn.active = false;
            buy_icon_state.active = true;
        } else {
            if (userActivityData.buyPassport) {
                buy_lock.active = false;
                buy_quest_btn.active = true;
                buy_icon_state.active = false;
            } else {
                buy_lock.active = true;
                buy_quest_btn.active = false;
                buy_icon_state.active = false;
            }
        }

        let freeItem = GameKit.ControllerTable.GetNode(node, 'free_item');
        let free_reward_layout = GameKit.ControllerTable.GetNode(freeItem, 'reward-layout');
        let freeRewards = Game.Content.FromStrings(meta._data.contents);

        free_reward_layout.children.forEach((child, index) => {
            if (index < freeRewards.length) {
                child.active = true;
                (child.getComponent('ContentModel') as any).show(freeRewards[index], { infoBtnParams: { canTouch: false, showInfoBtn: true } });
            } else {
                child.active = false;
            }
        });

        let n1 = freeRewards.length;
        let scale1 = 1.9 - 0.3 * n1;
        if (scale1 < 1) scale1 = 1;
        free_reward_layout.setScale(scale1, scale1, scale1);

        let free_lock = GameKit.ControllerTable.GetNode(freeItem, 'buy-lock');
        let free_quest_btn = GameKit.ControllerTable.GetNode(freeItem, 'quest-btn');
        let free_icon_state = GameKit.ControllerTable.GetNode(freeItem, 'icon_state');

        if ((userActivityData.received_free || []).indexOf(level) >= 0) {
            free_lock.active = false;
            free_quest_btn.active = false;
            free_icon_state.active = true;
        } else {
            if (level <= this.unlockLevel) {
                free_lock.active = false;
                free_quest_btn.active = true;
                free_icon_state.active = false;
            } else {
                free_lock.active = true;
                free_quest_btn.active = false;
                free_icon_state.active = false;
            }
        }

        free_quest_btn.targetOff(this);
        free_quest_btn.off(Node.EventType.TOUCH_END);
        free_quest_btn.on(Node.EventType.TOUCH_END, () => {
            let req = SR.SRActivityPassport.NewPassportCollectFree(level);
            req.SetCallBack((res: any) => {
                if (this.svt_reward) (this.svt_reward as any).updateAll();
            });
            req.SetErrorCallBack((res: any) => {
                console.log(res, 'error');
            });
            req.Send();
        }, this);
    }

    changeAndLogReward(layout: Node, contentModel: any, mergeId: any) {
        let meta = Meta.MetaManager.GetMeta(Meta.MetaType.MergeElements, mergeId);
        let spf = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.MergeIcon, meta.Icon());
        layout.children.forEach(child => {
            if (child.active) {
                let contentModel1 = child.getComponent('ContentModel') as any;
                if (contentModel.uuid == contentModel1.uuid) {
                    contentModel1.icon.spriteFrame = spf;
                }
            }
        });
    }

    public static SetSkin(meta: any) {
        let skin = meta.ShortName();
        let object = (MergePassPortMainWindow as any)[skin];
        if (!object) return;
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                const win = (global as any)[key];
                if (win) win.windowPath = element;
            }
        }
    }
}
