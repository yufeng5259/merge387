import { _decorator, Component, Label, Node, ParticleSystem2D } from 'cc';
const { ccclass, property } = _decorator;

const goldShopItemName = 'is.goldbonus';
const goldShopItemNameFirst = 'is.goldbonusfirst';
const SE_coin_loop = 'db_coin_loop';
const SE_collect = 'db_collect_coins';
const SE_number = 'db_win_number';
const SE_number_big = 'db_win_number_big';

@ccclass('DailyBonusNode')
export class DailyBonusNode extends Component {
    @property(Component)
    public normalWheelNode: any = null;
    @property(Component)
    public goldWheelNode: any = null;
    @property(Node)
    public normalWheelSpinBtn: Node | null = null;
    @property(Label)
    public labelNormalDis: Label | null = null;
    @property(Node)
    public goldWheelSpinBtn: Node | null = null;
    @property(Label)
    public goldWheelSpinBtnLabel: Label | null = null;
    @property(Node)
    public centerNode: Node | null = null;
    @property(Node)
    public frontNode: Node | null = null;
    @property(Label)
    public freeSpinDesLabel: Label | null = null;
    @property(Node)
    public normalBadge: Node | null = null;
    @property(Label)
    public levelLabel: Label | null = null;
    @property(Label)
    public resultCoin: Label | null = null;
    @property(Node)
    public collectBtn: Node | null = null;
    @property([ParticleSystem2D])
    public coinAnim1: ParticleSystem2D[] = [];
    @property(Component)
    public coinAnim2: any = null;
    @property(Component)
    public starAnim: any = null;
    @property(Node)
    public firstGoldTip: Node | null = null;
    @property(Node)
    public btnNormalToGold: Node | null = null;
    @property(Node)
    public btnGoldToNormal: Node | null = null;

    public hidden = true;
    public isGold: boolean | null = null;
    public changeAnim = false;
    public isShowResult = false;
    public freeRemainTime = 0;
    public normalOverTimer: ReturnType<typeof setTimeout> | null = null;
    public oldCoin = 0;

    onLoad() {
        this.hideAllWheel();
        this.stopCoinAnim1();

        const ssize = UIRoot.instance.winSize;
        const dis2left = 60;
        let dis2top = ssize.height / 2 - 20;
        if (ssize.height / ssize.width > 1250 / 640) dis2top -= 44;
        if (this.coinAnim2?.node) {
            this.coinAnim2.node.setPosition(-ssize.width / 2 + dis2left, dis2top, this.coinAnim2.node.position.z);
        }

        this.setActive(this.btnNormalToGold, AppKit.PaymentWrap.PayVisiable() && !AppKit.NativeWrap.isNewApp());
        this.setActive(this.btnGoldToNormal, AppKit.ADWrap.AdEnabled());
    }

    onstart() {
        if (this.levelLabel) {
            this.levelLabel.string = (String as any).format(GameKit.i18n.t('DailyBonusLevel'), Game.SUserVillage.MapId());
        }
        this.normalWheelNode?.start?.();
        this.goldWheelNode?.start?.();
        this.setActive(this.firstGoldTip, Game.SUserSlot.IsFirstGoldBonus());
        this.setPayButton();
    }

    setPayButton() {
        let payname = goldShopItemName;
        if (Game.SUserSlot.IsFirstGoldBonus()) payname = goldShopItemNameFirst;
        const goldPayItem = AppKit.PaymentWrap.GetItem(payname);
        if (goldPayItem && this.goldWheelSpinBtnLabel) {
            this.goldWheelSpinBtnLabel.string = (String as any).format(GameKit.i18n.t('DailyBonusGoldSpinBtn'), goldPayItem.PriceString());
        }
    }

    update(dt: any) {
        this.updateFreeSpinTime(dt);
    }

    onEnable() {
        if (!this.hidden) return;
        this.centerNode?.setScale(1, 1, this.centerNode.scale.z);
        this.frontNode?.setScale(1, 1, this.frontNode.scale.z);

        this.isGold = this.isGold != null ? this.isGold : !Game.SUserSlot.CanGetDailyBonus();
        if (!this.isGold) {
            this.scheduleOnce(() => this.showNormalWheel(), 0.25);
        } else {
            this.scheduleOnce(() => this.showGoldWheel(), 0.25);
        }
        this.updateNormalTime();
    }

    onDisable() {
        this.hideAllWheel();
    }

    Clear() {
        this.normalWheelNode?.Clear?.();
        this.goldWheelNode?.Clear?.();
        this.hideResult();
        this.isShowResult = false;
    }

    isRunning() {
        return !!(this.normalWheelNode?.isRunning?.() || this.goldWheelNode?.isRunning?.() || this.isShowResult);
    }

    showNormalWheel() {
        if (!AppKit.ADWrap.AdEnabled()) {
            this.showGoldWheel();
            return;
        }
        this.normalWheelNode?.showWheel?.();
        this.showNormalWheelUI();
        this.updateNormalTime();
    }

    showNormalWheelUI() {
        this.setActive(this.normalWheelSpinBtn, true);
        this.normalWheelSpinBtn?.setScale(1, 1, this.normalWheelSpinBtn.scale.z);
        this.playEnter(this.normalWheelSpinBtn);

        if (Game.SUserSlot.DailyBonusDid() > 0 && this.freeSpinDesLabel) {
            this.freeSpinDesLabel.node.setScale(1, 1, this.freeSpinDesLabel.node.scale.z);
            this.playEnter(this.freeSpinDesLabel.node);
        }

        this.setActive(this.btnNormalToGold, !AppKit.NativeWrap.isNewApp());
        this.setActive(this.btnGoldToNormal, false);
        this.isGold = false;
        this.hidden = false;
    }

    updateNormalTime() {
        Game.SUserSlot.UpdateDailyBonus();
        if (this.labelNormalDis) {
            this.labelNormalDis.string = `(${G.GameConstance.dailybonusMaxCount - Game.SUserSlot.DailyBonusDid()} / ${G.GameConstance.dailybonusMaxCount})`;
        }
        const flash = this.normalWheelSpinBtn?.getChildByName('flash');
        if (flash) flash.active = Game.SUserSlot.CanGetDailyBonus();
        this.freeRemainTime = Math.max(0, Game.SUserSlot.DailyBonusRemainTime());
        this.setActive(this.normalBadge, Game.SUserSlot.DailyBonusDid() < G.GameConstance.dailybonusMaxCount);

        if (!this.normalOverTimer) {
            const t = Game.SUserSlot.DailyBonusRemainTime();
            if (t > 0) {
                this.normalOverTimer = setTimeout(() => {
                    if (GameMainWindow.instance) GameMainWindow.instance.setMenuBadge();
                    this.normalOverTimer = null;
                }, t * 1000);
            }
        }
    }

    showGoldWheel() {
        if (AppKit.ADWrap.AdEnabled() && !AppKit.PaymentWrap.PayVisiable()) {
            this.showNormalWheel();
            return;
        }
        this.goldWheelNode?.showWheel?.();
        this.showGoldWheelUI();
    }

    showGoldWheelUI() {
        this.setActive(this.goldWheelSpinBtn, true);
        this.goldWheelSpinBtn?.setScale(1, 1, this.goldWheelSpinBtn.scale.z);
        this.playEnter(this.goldWheelSpinBtn);
        this.setActive(this.btnNormalToGold, false);
        this.setActive(this.btnGoldToNormal, true);
        this.isGold = true;
        this.hidden = false;
    }

    changeGoldToNormal() {
        if (this.isRunning() || this.changeAnim || !this.isGold) return;
        this.changeAnim = true;
        this.setActive(this.btnNormalToGold, false);
        this.setActive(this.btnGoldToNormal, false);
        this.setActive(this.goldWheelSpinBtn, false);

        const normal = this.normalWheelNode?.node as Node | undefined;
        const gold = this.goldWheelNode?.node as Node | undefined;
        if (normal) {
            normal.active = true;
            normal.setPosition(0, normal.position.y, normal.position.z);
        }
        if (gold) {
            gold.setPosition(0, gold.position.y, gold.position.z);
            gold.active = false;
        }
        this.showNormalWheelUI();
        this.changeAnim = false;
    }

    changeNormalToGold() {
        if (this.isRunning() || this.changeAnim || this.isGold) return;
        this.changeAnim = true;
        this.setActive(this.btnNormalToGold, false);
        this.setActive(this.btnGoldToNormal, false);
        this.setActive(this.normalWheelSpinBtn, false);
        this.freeSpinDesLabel?.node.setScale(0.001, 0.001, this.freeSpinDesLabel.node.scale.z);

        const normal = this.normalWheelNode?.node as Node | undefined;
        const gold = this.goldWheelNode?.node as Node | undefined;
        if (gold) {
            gold.active = true;
            gold.setPosition(0, gold.position.y, gold.position.z);
        }
        if (normal) {
            normal.setPosition(0, normal.position.y, normal.position.z);
            normal.active = false;
        }
        this.showGoldWheelUI();
        this.changeAnim = false;
    }

    onNormalSpinComplete() {
        this.updateNormalTime();
        if (Game.SUserSlot.CanGetDailyBonus()) {
            this.playEnter(this.normalWheelSpinBtn);
            if (Game.SUserSlot.DailyBonusDid() > 0) this.playEnter(this.freeSpinDesLabel?.node || null);
        } else {
            this.changeNormalToGold();
        }
    }

    onGoldSpinComplete() {
        this.playEnter(this.goldWheelSpinBtn);
    }

    hideAllWheel() {
        this.hidden = true;
        this.normalWheelNode?.stopMove?.();
        this.setActive(this.normalWheelNode?.node || null, false);
        this.goldWheelNode?.stopMove?.();
        this.setActive(this.goldWheelNode?.node || null, false);
        this.setActive(this.normalWheelSpinBtn, false);
        this.setActive(this.goldWheelSpinBtn, false);
        this.freeSpinDesLabel?.node.setScale(0.001, 0.001, this.freeSpinDesLabel.node.scale.z);
    }

    onNormalSpinBtnClick() {
        if (!Game.SUserSlot.CanGetDailyBonus() || this.normalWheelNode?.isRunning?.()) return;
        this.oldCoin = Game.SUser.Coin();

        AppKit.ADWrap.ShowVideo(() => {
            const req = SR.SRDailyBonus.doDailyBonus();
            req.SetCallBack((res: any) => {
                if (GameMainWindow.instance) GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin, 0);
                this.recordSpin(0);
                this.normalWheelNode?.stopAt?.(res.index);
            });
            req.Send();

            this.normalWheelNode?.startRun?.((coinNum: any) => this.showResult(coinNum));
            this.playClose(this.normalWheelSpinBtn);
            if (Game.SUserSlot.DailyBonusDid() > 0) this.playClose(this.freeSpinDesLabel?.node || null);
            this.moveToNear();
        }, 'watchDailyBonusAd');
    }

    onGoldSpinBtnClick() {
        if (this.goldWheelNode?.isRunning?.()) return;
        let payname = goldShopItemName;
        if (Game.SUserSlot.IsFirstGoldBonus()) payname = goldShopItemNameFirst;
        this.oldCoin = Game.SUser.Coin();

        AppKit.PaymentWrap.Pay(payname, (ok: boolean, res: any) => {
            if (!ok) return;
            Game.SUserSlot.data.slotData.dailyBonusCount.gold = Game.SUserSlot.data.slotData.dailyBonusCount.gold || 0;
            Game.SUserSlot.data.slotData.dailyBonusCount.gold += 1;
            if (GameMainWindow.instance) GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin, 0);
            this.recordSpin(1);

            setTimeout(() => {
                this.goldWheelNode?.stopAt?.(res.index);
                this.setActive(this.firstGoldTip, false);
                this.setPayButton();
            }, 2000);

            this.goldWheelNode?.startRun?.((coinNum: any) => this.showResult(coinNum));
            this.playClose(this.goldWheelSpinBtn);
            this.playClose(this.freeSpinDesLabel?.node || null);
            this.moveToNear();
        });
    }

    moveToNear() {
    }

    moveToFar() {
    }

    updateFreeSpinTime(dt: any) {
        if (!this.freeRemainTime || !this.freeSpinDesLabel) return;
        this.freeRemainTime = Math.max(0, Game.SUserSlot.DailyBonusRemainTime());
        this.freeSpinDesLabel.string = (String as any).format(GameKit.i18n.t('DailyBonusFreeSpinDes'), GameKit.TimeUtil.FormatRemainTimeSimple(this.freeRemainTime));
        if (this.freeRemainTime <= 0) {
            this.freeRemainTime = 0;
            this.updateNormalTime();
            if (Game.SUserSlot.DailyBonusDid() === 0) this.playClose(this.freeSpinDesLabel.node);
        }
    }

    showResult(coinNum: any) {
        this.isShowResult = true;
        if (this.resultCoin) {
            this.resultCoin.string = GameKit.StringUtil.formatNumber(coinNum);
            this.resultCoin.node.active = true;
            this.playEnter(this.resultCoin.node);
        }
        this.setActive(this.collectBtn, true);
        this.playEnter(this.collectBtn);
        this.playCoinAnim1();
        this.starAnim?.playLoop?.('animation');
        GameKit.SoundManager.playSound(SE_coin_loop, true);
        GameKit.SoundManager.playSound(this.isGold ? SE_number_big : SE_number);
    }

    onCollectBtnClick() {
        if (!this.isShowResult) return;
        this.hideResult();
        this.moveToFar();
        this.coinAnim2?.playOnce?.('animation', () => {});

        if (GameMainWindow.instance) {
            this.scheduleOnce(() => {
                GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, Game.SUser.Coin(), 0.8);
                this.isShowResult = false;
                if (!this.isGold) {
                    this.scheduleOnce(() => this.onNormalSpinComplete(), 0.1);
                } else {
                    this.scheduleOnce(() => this.onGoldSpinComplete(), 0.1);
                }
            }, 1);
        }

        GameKit.SoundManager.playSound(SE_collect);
        GameKit.SoundManager.stopSound(SE_coin_loop);
        const appCommentWindow = (globalThis as any).AppCommentWindow;
        if (appCommentWindow?.TryShow) appCommentWindow.TryShow();
    }

    hideResult() {
        this.playClose(this.resultCoin?.node || null, () => {
            if (this.resultCoin) this.resultCoin.node.active = false;
        });
        this.playClose(this.collectBtn);
        this.stopCoinAnim1();
        this.starAnim?.stop?.();
        GameKit.SoundManager.stopSound(SE_coin_loop);
    }

    playCoinAnim1() {
        this.coinAnim1.forEach((x) => x.resetSystem());
    }

    stopCoinAnim1() {
        this.coinAnim1.forEach((x) => x.stopSystem());
    }

    private recordSpin(operation: number) {
        let spinCount = GameKit.DataCache.GetData('bonus_count');
        spinCount = spinCount || 0;
        spinCount++;
        GameKit.DataCache.SetData('bonus_count', spinCount);
        AppKit.LogEventWrap.logEvent('CoinSpinDetail', { result: spinCount, operation });
    }

    private playEnter(node: Node | null, cb?: () => void) {
        if (!node) {
            if (cb) cb();
            return;
        }
        const anim = node.getComponent('EnterCloseAnim') as any;
        if (anim?.enterAnim) {
            anim.enterAnim(cb);
        } else if (cb) {
            cb();
        }
    }

    private playClose(node: Node | null, cb?: () => void) {
        if (!node) {
            if (cb) cb();
            return;
        }
        const anim = node.getComponent('EnterCloseAnim') as any;
        if (anim?.closeAnim) {
            anim.closeAnim(cb);
        } else if (cb) {
            cb();
        }
    }

    private setActive(node: Node | null, active: boolean) {
        if (node) node.active = active;
    }
}
