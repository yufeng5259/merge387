import { _decorator, Label, Node, Sprite, Tween, tween } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('LuckyDrawWindow')
export default class LuckyDrawWindow extends UIWindow {
    public static windowPath = 'Other/LuckyDrawWindow';

    @property([Node])
    items: Node[] = [];

    rewards: any[] = [];
    selects: Node[] = [];
    lastSelectId = -1;
    loopIndex: number | null = null;
    loopCount = 0;
    stopIndex: number | null = null;
    oldCoin: any = null;
    private loopTween: Tween<Node> | null = null;

    onShow(showParams?: any) {
        this.rewards = Game.Content.FromStrings('2=0=15;11=37=0.2;11=37=0.4;11=37=0.1;2=0=2;3=0=1;2=0=3;11=37=0.8;6=2=100;2=0=10;6=3=1;2=0=1');
        this.selects = [];
        let i = 0;
        this.items.forEach(item => {
            const icon = GameKit.ControllerTable.GetComponent(item, 'icon', Sprite);
            const label = GameKit.ControllerTable.GetComponent(item, 'label', Label);
            const spSelect = GameKit.ControllerTable.GetNode(item, 'spSelect');
            this.selects.push(spSelect);
            this.rewards[i].Icon(icon);
            label.string = this.rewards[i].Contents()[0].FormatCount().toString();
            i++;
        });
        this.lastSelectId = -1;
    }

    onClose() {
        this.stopLoopTween();
    }

    callClose() {
        this.closeAnim();
    }

    callPlay() {
        if (this.loopIndex != null) return;
        AppKit.ADWrap.ShowVideo(() => {
            this.oldCoin = Game.SUser.Coin();
            const req = SR.SRUserData.finishVideoLuckyDraw();
            req.SetSilence(true);
            req.SetCallBack((res: any) => {
                this.stopIndex = res.drawIndex;
                if (GameMainWindow.instance) GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin, 0);
            });
            req.Send();
            this.startLoop();
        }, 'LuckyDraw');
    }

    startLoop() {
        this.loopIndex = -1;
        this.loopCount = 0;
        this.loopNext();
        this.runDelayCallbacks([
            { delay: 0.6, callback: () => this.loopNext() },
            { delay: 0.4, callback: () => this.loopNext() },
            { delay: 0.3, callback: () => this.loopNext() },
            { delay: 0.1, callback: () => this._loop() },
        ]);
    }

    _loop() {
        const steps: Array<{ delay: number; callback: () => void }> = [];
        for (let i = 0; i < 12; i++) {
            steps.push({ delay: 0.1, callback: () => this.loopNext() });
        }
        steps.push({
            delay: 0,
            callback: () => {
                this.loopCount++;
                if (this.loopCount < 3 || this.stopIndex == null) {
                    this._loop();
                } else {
                    this.endLoop();
                }
            }
        });
        this.runDelayCallbacks(steps);
    }

    endLoop() {
        const steps: Array<{ delay: number; callback: () => void }> = [];
        let seqsCount = (this.stopIndex || 0) - 4 - (this.loopIndex || 0);
        if (seqsCount < 0) seqsCount += 12;
        for (let i = 0; i < seqsCount; i++) {
            steps.push({ delay: 0.1 + i * 0.2 / seqsCount, callback: () => this.loopNext() });
        }
        steps.push({ delay: 0.3, callback: () => this.loopNext() });
        steps.push({ delay: 0.4, callback: () => this.loopNext() });
        steps.push({ delay: 0.5, callback: () => this.loopNext() });
        steps.push({ delay: 0.6, callback: () => this.loopNext() });
        steps.push({ delay: 0.8, callback: () => this.drawEnd() });

        this.runDelayCallbacks(steps);
    }

    loopNext() {
        if (this.loopIndex == null) this.loopIndex = -1;
        this.loopIndex++;
        if (this.loopIndex >= 12) this.loopIndex -= 12;
        this.showSelect(this.loopIndex);
    }

    drawEnd() {
        const rewards = [];
        rewards.push(this.rewards[this.stopIndex || 0]);
        UIRoot.instance.openChildWindow('GetRewardWindow', { contents: rewards, oldCoin: this.oldCoin });
        if (GameMainWindow.instance) GameMainWindow.instance.updateLuckyDraw(true);
        this.closeAnim();
    }

    showSelect(index: number) {
        if (this.lastSelectId > -1) this.selects[this.lastSelectId].active = false;
        this.selects[index].active = true;
        this.lastSelectId = index;
        GameKit.SoundManager.playSound('luckydraw_step');
    }

    private runDelayCallbacks(steps: Array<{ delay: number; callback: () => void }>) {
        this.stopLoopTween();
        let chain = tween(this.node);
        steps.forEach(step => {
            if (step.delay > 0) chain = chain.delay(step.delay);
            chain = chain.call(step.callback);
        });
        this.loopTween = chain;
        chain.start();
    }

    private stopLoopTween() {
        if (!this.loopTween) return;
        this.loopTween.stop();
        this.loopTween = null;
    }
}