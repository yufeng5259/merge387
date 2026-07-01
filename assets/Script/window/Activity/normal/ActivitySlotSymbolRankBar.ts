import { _decorator, Component, instantiate, Label, Node, ProgressBar, Sprite, tween, UITransform, Vec2, Vec3 } from 'cc';
import { ContentModel } from '../../../game/items/ContentModel';
import { bindGuardedClick, unbindGuardedClick } from '../../../GameKit/ui/TouchClickGuard';
import { fitByHeight, fitSpriteInRange2 } from '../../../GameKit/render/fixedSizeRatio';

const { ccclass } = _decorator;

const spXstart = 30;
const spXlength = 430;
const w2WidthBase = 782;
const w2WidthAdd = 308;

function getCTComponentSafe(root: Node, key: string, type: any) {
    const node = GameKit.ControllerTable.GetNode(root, key, Node);
    return node ? node.getComponent(type) : null;
}

@ccclass('ActivitySlotSymbolRankBar')
export class ActivitySlotSymbolRankBar extends Component {
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
    public w1: Node | null = null;
    public w2: Node | null = null;
    public sm: Node | null = null;
    public currentGiftCount = 0;
    public rankList: any[] = [];
    public maxTotal = 1;
    public w1init = false;

    public start() {
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

    public setMeta(meta: any, data: any) {
        this.init();
        this.meta = meta;
        this.rankData = data;
        this.userData = Game.SUser;
        this.lastScore = this.getMyRankScore();
        this.currentData = this.getsRankMetaBySocre();
        this.w1 = GameKit.ControllerTable.GetNode(this.node, 'w1', Node);
        this.w2 = GameKit.ControllerTable.GetNode(this.node, 'w2', Node);
        this.sm = GameKit.ControllerTable.GetNode(this.node, 'sm', Node);
        if (this.sm) {
            this.sm.active = false;
        }
        this.onCloseReward();
        this.level = this.currentData ? this.currentData.rank : 1;
        this.currentGiftCount = this.currentData ? (this.currentData.id - 1) : 0;

        this.rankList = this.getMetasByRank(this.level);
        this.maxTotal = this.rankList[this.rankList.length - 1] ? (this.rankList[this.rankList.length - 1].score - this.rankList[0].score) : 1;

        let symbolId = 1;
        if (this.meta) {
            symbolId = this.meta.Param().symbolId || this.meta.Param().showSymbolId;
        } else {
            symbolId = this.rankData.symbolId;
        }
        const spSymbol = getCTComponentSafe(this.node, 'activityIcon', Sprite);
        const sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.SlotSymbol, symbolId.toString());
        const probar = getCTComponentSafe(this.node, 'progressBar', ProgressBar);
        const tNumCount = getCTComponentSafe(this.node, 'numCount', Label);
        const giftCount = getCTComponentSafe(this.node, 'giftCount', Label);
        const barNode = GameKit.ControllerTable.GetNode(this.node, 'barFrame', Node);
        const maxB = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, this.currentData.id + 1);
        this.currentGiftCount = maxB ? this.currentGiftCount : this.data.length;
        if (giftCount) {
            giftCount.string = this.currentGiftCount + '/' + this.data.length;
        }
        if (tNumCount) {
            tNumCount.string = '';
        }
        if (spSymbol) {
            spSymbol.spriteFrame = sp;
        }
        if (spSymbol && sp) {
            const rect = sp.getRect();
            fitSpriteInRange2(spSymbol, new Vec2(70, 70), new Vec2(rect.width, rect.height));
        }
        if (barNode) {
            unbindGuardedClick(barNode, this);
            bindGuardedClick(barNode, this, this.onClickShowReward1, { passBoundTarget: true });
            (barNode as any).data = this.data[this.data.length - 1];
        }
        let pre0 = Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.SlotCollectRankPoint, (this.rankList[0].id - 1) <= 0 ? 1 : (this.rankList[0].id - 1));
        if ((this.rankList[0].id - 1) <= 0) {
            pre0 = 0;
        }

        const maxScore = this.rankList[this.rankList.length - 1].score - pre0;
        if (probar) {
            probar.progress = (this.lastScore - pre0) / maxScore;
        }
        for (let index = 0; index < this.rankList.length; index++) {
            const element = this.rankList[index];
            const dis = element.score - pre0;
            const tx = spXstart + spXlength * (dis / maxScore);
            const rNode = GameKit.ControllerTable.GetNode(this.node, 'rewardNode' + (index + 1), Node);
            if (!rNode) {
                continue;
            }
            (rNode as any).data = element;
            (rNode as any).isOpen = false;
            const coinNode = rNode.getChildByName('Sprite - coin');
            const rSp = coinNode ? coinNode.getComponent(Sprite) : null;
            let indexStr = element.id;
            if (element.id > 10) {
                indexStr = 5 + ((element.id - 10) % 5 === 0 ? 5 : (element.id - 10) % 5);
            }
            if (this.lastScore >= element.score) {
                indexStr = indexStr + '_open';
                element.isOpen = true;
            }
            if (rSp) {
                rSp.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.PresentPack, indexStr);
            }
            rNode.setPosition(tx, rNode.position.y, rNode.position.z);
            unbindGuardedClick(rNode, this);
            bindGuardedClick(rNode, this, this.onClickShowReward, { passBoundTarget: true });
        }

        const w2SpSymbol = getCTComponentSafe(this.node, 'w2SpSymbol', Sprite);
        if (w2SpSymbol) {
            w2SpSymbol.spriteFrame = sp;
            fitByHeight(w2SpSymbol);
        }
    }

    public onClickShowReward1(event: any) {
        if (!this.w1 || !this.sm) {
            return;
        }
        const target = event.boundTarget || event.target;
        if (!this.w1init) {
            const w1item = GameKit.ControllerTable.GetNode(this.node, 'w1Item');
            if (!w1item) {
                return;
            }
            const rewards = target.data.content;
            for (let i = 0; i < rewards.length; i++) {
                const n1 = instantiate(w1item);
                n1.parent = w1item.parent;
                n1.active = true;
                n1.getComponent(ContentModel).show(rewards[i]);
            }
            this.w1init = true;
        }

        this.showRNode(this.w1);
        this.sm.active = true;
    }

    public onClickShowReward(event: any) {
        if (!this.w2 || !this.sm) {
            return;
        }
        const target = event.boundTarget || event.target;
        const cArr = target.data.content;
        const w2item1 = GameKit.ControllerTable.GetNode(this.node, 'w2Item1');
        const itemNode = GameKit.ControllerTable.GetNode(this.node, 'itemNode');
        const w2bg = GameKit.ControllerTable.GetNode(this.node, 'w2bg');
        if (!w2item1 || !itemNode || !w2bg) {
            return;
        }
        w2item1.active = false;
        itemNode.destroyAllChildren();
        for (let index = 0; index < cArr.length; index++) {
            const element = cArr[index];
            const newItem = instantiate(w2item1);
            newItem.parent = itemNode;
            newItem.setPosition(newItem.position.x, 0, newItem.position.z);
            newItem.active = true;
            const contentModel = newItem.getComponent(ContentModel);
            contentModel.show(element);
        }
        const w2bgTransform = w2bg.getComponent(UITransform);
        if (w2bgTransform) {
            w2bgTransform.width = w2WidthBase + w2WidthAdd * Math.max(0, cArr.length - 2);
        }
        const needLbl = getCTComponentSafe(this.node, 'needLbl', Label);
        if (needLbl) {
            needLbl.string = target.data.score;
        }
        this.w2.setPosition(target.position.x, this.w2.position.y, this.w2.position.z);
        this.showRNode(this.w2);
        this.sm.active = true;
    }

    public getsRankMetaBySocre() {
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
            if (this.getMyRankScore() < element.score) {
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

    public onCloseReward() {
        if (this.w1 && this.w1.active) {
            this.hideRNode(this.w1);
            if (this.sm) {
                this.sm.active = false;
            }
        }
        if (this.w2 && this.w2.active) {
            this.hideRNode(this.w2);
            if (this.sm) {
                this.sm.active = false;
            }
        }
    }

    public showRNode(rNode: Node) {
        if (!rNode) {
            return;
        }
        rNode.active = true;
        rNode.setScale(0.001, 0.001, rNode.scale.z);
        tween(rNode).to(0.2, { scale: new Vec3(1, 1, rNode.scale.z) }).start();
    }

    public hideRNode(rNode: Node) {
        if (!rNode) {
            return;
        }
        tween(rNode)
            .to(0.2, { scale: new Vec3(0.001, 0.001, rNode.scale.z) })
            .call(() => {
                rNode.active = false;
            })
            .start();
    }
}
