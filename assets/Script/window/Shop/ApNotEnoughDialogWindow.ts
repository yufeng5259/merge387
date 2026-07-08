import { _decorator, find, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('ApNotEnoughDialogWindow')
export default class ApNotEnoughDialogWindow extends UIWindow {
    static windowPath = 'Shop/ApNotEnoughDialogWindow';

    @property(Label)
    labelAp: Label | null = null;

    @property(Label)
    labelPrice: Label | null = null;

    @property(Node)
    adNode: Node | null = null;

    @property(Node)
    noAdNode: Node | null = null;

    @property(Node)
    acitivityNode: Node | null = null;

    sdata: any = {};

    onShow(showParams: any) {
        LoadingWindow.Show();
        this.showActivityNode();
        this.sdata = {};
        let req = SR.SRShop.GetCashBuyInfo();
        req.SetCallBack((res) => {
            this.sdata = res || {};
            this.refrshUI();
        });
        req.Send();
    }

    refrshUI() {
        LoadingWindow.Hide();
        if (this.adNode) this.adNode.active = false;
        if (this.noAdNode) this.noAdNode.active = false;
        if (!AppKit.ADWrap.AdEnabled()) {
            this.showADNode();
            return;
        }
        this.showBuyNode();
    }

    showADNode() {
        if (this.adNode) {
            this.adNode.active = true;
            this.setApPriceLabels(this.adNode, true);
        }
        this.setFallbackLabels();
    }

    showBuyNode() {
        if (this.noAdNode) {
            this.noAdNode.active = true;
            this.setApPriceLabels(this.noAdNode, false);
        }
        this.setFallbackLabels();
    }

    showActivityNode() {
        if (this.acitivityNode) this.acitivityNode.active = false;
    }

    setApPriceLabels(root: Node, includeAdLabel: boolean) {
        const apLbl = GameKit.ControllerTable.GetNode(root, 'apLbl')?.getComponent(Label);
        const apPrice = GameKit.ControllerTable.GetNode(root, 'apPrice')?.getComponent(Label);
        const apLblAD = includeAdLabel ? GameKit.ControllerTable.GetNode(root, 'apLblAD')?.getComponent(Label) : null;
        if (apLbl) apLbl.string = '+' + (this.sdata.count || 0);
        if (apLblAD) apLblAD.string = '+' + (this.sdata.count || 0);
        if (apPrice) apPrice.string = String(this.sdata.price || 0);
    }

    setFallbackLabels() {
        if (this.labelAp) this.labelAp.string = '+' + (this.sdata.count || 0);
        if (this.labelPrice) this.labelPrice.string = String(this.sdata.price || 0);
    }

    onClose() {
    }

    callClose() {
        this.closeAnim();
    }

    callBuy() {
        if (Game.ContentCheck.CheckCash(this.sdata.price)) {
            this.lockMainApBeforeBuy();
            let req = SR.SRShop.CashBuyContent();
            req.SetCallBack((res) => {
                this.closeAnim(() => {
                    this.playApRewardFly(res);
                });
            });
            req.Send();
        } else {
            this.callClose();
        }
    }

    callAD() {
        console.log('ad reward pending');
    }

    callActivity() {
        console.log('activity reward pending');
    }

    getApRewardTotal(rewards: any[]) {
        let total = 0;
        if (!rewards || !Array.isArray(rewards)) return total;

        rewards.forEach((rewardData) => {
            if (!rewardData) return;
            let reward = Game.Content.FromContent(rewardData);
            if (reward && reward.Type() === Game.Content.Types.Ap) {
                total += reward.Count();
            }
        });
        return total;
    }

    getMainApIconNode() {
        if (typeof GameMainWindow === 'undefined' || !GameMainWindow.instance || !GameMainWindow.instance.userinfo) return null;
        let userInfo = GameMainWindow.instance.userinfo;
        const apIconNode = find('spinbar/icon', userInfo.node);
        if (apIconNode) return apIconNode;
        if (userInfo.labelAp && userInfo.labelAp.node) return userInfo.labelAp.node;
        if (userInfo.labelApFull && userInfo.labelApFull.node) return userInfo.labelApFull.node;
        return null;
    }

    getWorldPos(node: Node) {
        const transform = node.getComponent(UITransform);
        return transform ? transform.convertToWorldSpaceAR(Vec3.ZERO) : node.worldPosition.clone();
    }

    playApRewardFly(res: any, cb?: any) {
        let apTotal = this.getApRewardTotal(res && res.rewards);
        let mainWindow = typeof GameMainWindow !== 'undefined' ? GameMainWindow.instance : null;
        let flyAnim = mainWindow && mainWindow.coinFlyToTargetAnim;
        let targetNode = this.getMainApIconNode();
        if (apTotal <= 0 || !flyAnim || !targetNode) {
            this.refreshMainAp();
            if (cb) cb();
            return;
        }

        let userInfo = mainWindow.userinfo;
        if (userInfo && userInfo.stopApAt && !userInfo.apDisplayLocked && Game.SUser && Game.SUser.Ap) {
            userInfo.stopApAt(Math.max(0, Game.SUser.Ap() - apTotal));
        }

        let fromWorldPos = this.getWorldPos(this.node);
        let toWorldPos = this.getWorldPos(targetNode);
        let sprite = targetNode.getComponent(Sprite);
        let animCount = Math.max(1, Math.min(8, Math.ceil(apTotal / 20)));
        let finish = () => {
            this.refreshMainAp();
            if (cb) cb();
        };

        if (sprite && sprite.spriteFrame && flyAnim.PlayCollectAnim) {
            flyAnim.PlayCollectAnim(sprite.spriteFrame, fromWorldPos, toWorldPos, animCount, finish);
        } else {
            flyAnim.PlayAnim(fromWorldPos, toWorldPos, 1.0, 0.15, animCount, null, finish);
        }
    }

    lockMainApBeforeBuy() {
        if (typeof GameMainWindow === 'undefined' || !GameMainWindow.instance || !GameMainWindow.instance.userinfo) return;
        let userInfo = GameMainWindow.instance.userinfo;
        if (!Game.SUser || !Game.SUser.Ap) return;
        if (userInfo.lockApDisplay) {
            userInfo.lockApDisplay(Game.SUser.Ap());
        } else if (userInfo.stopApAt) {
            userInfo.stopApAt(Game.SUser.Ap());
        }
    }

    refreshMainAp() {
        if (typeof GameMainWindow === 'undefined' || !GameMainWindow.instance || !GameMainWindow.instance.userinfo) return;
        let userInfo = GameMainWindow.instance.userinfo;
        if (userInfo.unlockApDisplay) userInfo.unlockApDisplay();
        else userInfo.apStop = false;
        if (userInfo._setAp) userInfo._setAp();
    }
}
