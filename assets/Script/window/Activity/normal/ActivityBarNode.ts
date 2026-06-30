import { _decorator, Component, Label, Mask, Node, ProgressBar, Sprite, tween, Vec3 } from 'cc';
import { fitByHeight } from '../../../GameKit/render/fixedSizeRatio';
import { UserInfoModel } from '../../UserInfoModel';
import GameMainWindow from '../../GameMainWindow';

const { ccclass, property } = _decorator;

@ccclass('ActivityBarNode')
export class ActivityBarNode extends Component {
    @property(Node)
    public barNode: Node | null = null;

    public playing = false;
    public oldScore = 0;
    public time = 0.5;
    public delay = 1.5;
    public disx = -220;
    public showRewards = false;
    public giftCountArr: number[] = [];
    public currentID = 1;
    public nextId = 2;
    public level = 1;
    public data: any[] = [];
    public meta: any = null;
    public rankData: any = null;
    public userData: any = null;
    public lastScore = 0;
    public currentData: any = null;
    public currentGiftCount = 0;
    public rankList: any[] = [];
    public maxTotal = 1;

    public onEnable() {
        const mask = this.node.children[0]?.getComponent(Mask);
        if (mask) {
            mask.enabled = true;
        }
    }

    public playAmin(meta: any, data: number, callback: any) {
        if (this.playing) {
            return;
        }
        this.oldScore = data;
        this.setMeta(meta);
        this.time = 0.5;
        this.playing = true;
        this.delay = 1.5;
        this.disx = -220;
        this.scheduleOnce(() => {
            const startPos = this.barNode.position.clone();
            const firstPos = new Vec3(startPos.x + this.disx, startPos.y, startPos.z);
            const secondPos = new Vec3(firstPos.x - (this.disx - 10), firstPos.y, firstPos.z);

            tween(this.barNode)
                .to(this.time, { position: firstPos }, { easing: 'quadInOut' })
                .delay(0.9)
                .call(() => {
                    const oldConnets = this.getContents();
                    this.showRewards = false;
                    if (oldConnets.length > 0) {
                        const showR = () => {
                            const rewards = oldConnets.shift();
                            UIRoot.instance.openChildWindow('GetRewardWindow', {
                                contents: rewards,
                                showCallback: (wnd: any) => {
                                    wnd.addOnCloseFunc(() => {
                                        const rs = Game.Content.Merge(rewards);
                                        rs.forEach((fReward: any) => {
                                            if (fReward.Type() === Game.Content.Types.Coin) {
                                                if (GamePlay.instance.slotNode.activityRoot.oldCoin != null && GameMainWindow.instance) {
                                                    GameMainWindow.instance.playAddCoinAnim();
                                                    GameMainWindow.instance.scheduleOnce(() => {
                                                        GameMainWindow.instance.userinfo.changeCoin(GamePlay.instance.slotNode.activityRoot.oldCoin, GamePlay.instance.slotNode.activityRoot.oldCoin + fReward.Count(), 0.8);
                                                        GamePlay.instance.slotNode.activityRoot.oldCoin += fReward.Count();
                                                    }, 1);
                                                }
                                            } else if (fReward.Type() === Game.Content.Types.Ap) {
                                                if (GamePlay.instance.slotNode.activityRoot.oldAp != null && GamePlay.instance.slotNode) {
                                                    const slot = GamePlay.instance.slotNode;
                                                    slot.isSpining = true;
                                                    slot.getComponent(UserInfoModel).playApAnim(() => {
                                                        slot.makeIdle();
                                                    });
                                                    slot.showSpinAddNumAnim(fReward.Count());
                                                    GamePlay.instance.slotNode.activityRoot.oldAp += fReward.Count();
                                                    const animTime = 1.5;
                                                    this.scheduleOnce(() => {
                                                        if (GamePlay.instance) {
                                                            GamePlay.instance.slotNode.userinfo.stopApAt(GamePlay.instance.slotNode.activityRoot.oldAp);
                                                        }
                                                    }, animTime);
                                                }
                                            }
                                        });

                                        if (oldConnets.length > 0) {
                                            showR();
                                        } else {
                                            this.playing = false;
                                            if (callback) callback();
                                        }
                                    });
                                },
                            });
                        };
                        showR();
                        this.showRewards = true;
                    }
                })
                .delay(0.6)
                .to(this.time, { position: secondPos }, { easing: 'quadInOut' })
                .call(() => {
                    if (!this.showRewards) {
                        this.playing = false;
                        if (callback) callback();
                    }
                })
                .start();
        }, 0.2);
    }

    public init() {
        this.giftCountArr = [2, 3, 3, 3, 3];
        this.currentID = 1;
        this.nextId = 2;
        this.level = 1;
        this.data = [];
        let index = 1;
        while (true) {
            const rewards = Game.Content.FromStrings(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPointReward, index));
            const score = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, index);
            if (score != null) {
                const rank = index < 2 ? 1 : Math.ceil((index - 2) / 3 + 1);
                this.data.push({ id: index, isOpen: false, rank, content: rewards, score });
            } else {
                break;
            }
            index++;
        }
    }

    public setMeta(meta: any) {
        this.init();
        this.meta = meta;
        this.rankData = Game.SUserActivity.GetSymbolRankData();
        this.userData = Game.SUser;
        this.lastScore = this.getMyRankScore();
        this.currentID = this.meta.id || 1;
        this.nextId = this.currentID + 1;
        this.currentData = this.getsRankMetaBySocre();
        this.level = this.currentData ? this.currentData.rank : 1;
        this.currentGiftCount = this.currentData ? this.currentData.id : 0;
        this.rankList = this.getMetasByRank(this.level);
        this.maxTotal = this.rankList[this.rankList.length - 1] ? this.rankList[this.rankList.length - 1].score : 1;

        const symbolId = this.meta.Param().symbolId || this.meta.Param().showSymbolId;
        const spSymbol = GameKit.ControllerTable.GetComponent(this.node, 'activityIcon', Sprite);
        const sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString() + '_s');
        const probar = GameKit.ControllerTable.GetComponent(this.node, 'progressBar', ProgressBar);
        const tNumCount = GameKit.ControllerTable.GetComponent(this.node, 'numCount', Label);

        spSymbol.spriteFrame = sp;
        fitByHeight(spSymbol);
        let maxS = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, (this.rankList[0].id - 1) <= 0 ? 1 : (this.rankList[0].id - 1));
        if ((this.rankList[0].id - 1) <= 0) {
            maxS = 0;
        }

        const maxScore = this.rankList[this.rankList.length - 1].score - maxS;
        const per = Math.max(0, (this.oldScore - maxS) / maxScore);
        tNumCount.string = this.lastScore + '/' + maxScore;
        probar.progress = per;
        this.scheduleOnce(() => {
            this.tweenProgress(probar, 0.7, (p) => {
                const nextPer = Math.max(0, (this.oldScore + (this.lastScore - this.oldScore) * p - maxS) / maxScore);
                probar.progress = nextPer;
            });
        }, 0.7);

        for (let index = 0; index < this.rankList.length; index++) {
            const element = this.rankList[index];
            const dis = element.score - maxS;
            const tx = 22 + 188 * (dis / maxScore);
            const rNode = GameKit.ControllerTable.GetNode(this.node, 'rewardNode' + (index + 1), Node);
            const rSp = rNode.getChildByName('Sprite - coin').getComponent(Sprite);
            let indexStr = element.id;
            if (element.id > 10) {
                indexStr = 5 + ((element.id - 10) % 5 === 0 ? 5 : (element.id - 10) % 5);
            }
            if (this.lastScore >= element.score) {
                indexStr = indexStr + '_open';
            }
            rSp.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.PresentPack, indexStr);
            rNode.setPosition(tx, rNode.position.y, rNode.position.z);
        }
    }

    public getsRankMetaBySocre() {
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
            if (this.getMyRankScore() <= element.score) {
                return element;
            }
        }
        return this.data[this.data.length - 1];
    }

    public getMyRankScore() {
        const myData = this.rankData.rank[this.userData.data.userId];
        return myData ? myData.score : 0;
    }

    public getMetaById(id: any) {
        let ele: any;
        this.data.forEach((element) => {
            if (element.id === id) {
                ele = element;
            }
        });
        return ele;
    }

    public getMetasByRank(rank: any) {
        const dataList: any[] = [];
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
            if (element.rank === rank) {
                dataList.push(element);
            }
        }
        return dataList;
    }

    public getsRankMetaByOldSocre() {
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
            if (this.oldScore <= element.score) {
                return element;
            }
        }
        return null;
    }

    public getContents() {
        const rewards: any[] = [];
        const oldData = this.getsRankMetaByOldSocre();
        const currtentS = this.getMyRankScore();
        if (oldData == null) {
            return rewards;
        }
        for (let index = oldData.id - 1; index < this.data.length; index++) {
            const element = this.data[index];
            if (currtentS >= element.score) {
                rewards.push(element.content);
            }
        }
        return rewards;
    }

    private tweenProgress(probar: ProgressBar, duration: number, updater: (progress: number) => void) {
        const state = { p: 0 };
        tween(state)
            .to(duration, { p: 1 }, {
                onUpdate: (target: any) => updater(target.p),
            })
            .start();
    }
}
