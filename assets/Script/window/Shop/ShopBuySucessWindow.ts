import { _decorator, instantiate, isValid, Layout, Node, ScrollView, sp, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('ShopBuySucessWindow')
export default class ShopBuySucessWindow extends UIWindow {
    public static windowPath = 'Shop/ShopBuySucessWindow';

    @property(Node)
    rewardNodeParent: Node | null = null;

    @property(ScrollView)
    rewardNodeScrollView: ScrollView | null = null;

    @property(Node)
    rewardNode: Node | null = null;

    @property(Node)
    SpineTop: Node | null = null;

    data: any = null;
    nextWindow: string | null = 'ShopWindow';
    private _rewardLayoutPaddingTop: number | null = null;
    private _rewardLayoutPaddingBottom: number | null = null;
    private rewards: any[] = [];
    private _resourceRewardNodes: Record<string, Node> = {};
    private _resourceGainPlans: any[] = [];
    private _closingResourceRewardFlow = false;
    private _waitingResourceRewardFly = false;
    private _resourceRewardFinished = false;

    onShow(showParams: any) {
        showParams = showParams || {};
        this.nextWindow = showParams.nextWindow || 'ShopWindow';
        this.data = showParams.rewards;
        this._closingResourceRewardFlow = false;
        this._waitingResourceRewardFly = false;
        this._resourceRewardFinished = false;
        console.log('璐拱鎴愬姛', this.data);
        if (GameKit.SoundManager && GameKit.SoundManager.playBreakEggFinSound) {
            GameKit.SoundManager.playBreakEggFinSound();
        }
        this.playTopSpine();
        this.initNode();
        this.prepareResourceRewardDisplays();
    }

    findNodeByName(root: Node | null, nodeName: string): Node | null {
        if (!root) return null;
        if (root.name === nodeName) return root;

        for (let i = 0; i < root.children.length; i++) {
            let found = this.findNodeByName(root.children[i], nodeName);
            if (found) return found;
        }
        return null;
    }

    playTopSpine() {
        let spineNode = this.SpineTop;
        if (!spineNode) return;

        let skeleton = spineNode.getComponent(sp.Skeleton);
        if (!skeleton) return;

        if (skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }

        let entry = null;
        try {
            entry = skeleton.setAnimation(0, 'show', false);
        } catch (e) {
            skeleton.setAnimation(0, 'idel', true);
            return;
        }

        if (!entry) {
            skeleton.setAnimation(0, 'idel', true);
            return;
        }

        if (skeleton.setCompleteListener) {
            skeleton.setCompleteListener(() => {
                if (!isValid(this.node) || !isValid(spineNode)) return;
                skeleton.setCompleteListener(null);
                skeleton.setAnimation(0, 'idel', true);
            });
        }
    }

    initNode() {
        if (!this.rewardNode) return;
        const parent = this.rewardNodeScrollView && this.rewardNodeScrollView.content
            ? this.rewardNodeScrollView.content
            : this.rewardNodeParent;
        if (!parent) return;
        this.clearRewardNodes();
        this.rewardNode.active = false;
        this.rewards = Game.Content.FromContents(this.data) || [];
        this._resourceRewardNodes = {};
        this.rewards.forEach((reward: any) => {
            let reward_node = instantiate(this.rewardNode!);
            reward_node.parent = parent;
            reward_node.active = true;
            let contentModel = reward_node.getComponent(ContentModel);
            if (contentModel) contentModel.show(reward);
            let type = reward.Type();
            if (type === Game.Content.Types.ShopCoin) type = Game.Content.Types.Coin;
            if (!this._resourceRewardNodes[type]) this._resourceRewardNodes[type] = reward_node;
        });
        this.updateRewardContentAlign();
    }

    getMainUserInfo() {
        return typeof GameMainWindow !== 'undefined' && GameMainWindow.instance
            ? GameMainWindow.instance.userinfo || null
            : null;
    }

    prepareResourceRewardDisplays() {
        const userInfo = this.getMainUserInfo();
        this._resourceGainPlans = userInfo?.prepareResourceGains
            ? userInfo.prepareResourceGains(this.rewards, { hold: true })
            : [];
    }

    clearRewardNodes() {
        const content = this.rewardNodeScrollView?.content;
        if (!content || !this.rewardNode) return;
        for (let i = content.children.length - 1; i >= 0; i--) {
            const child = content.children[i];
            if (child === this.rewardNode) continue;
            child.removeFromParent();
            child.destroy();
        }
    }

    updateRewardContentAlign() {
        let scrollView = this.rewardNodeScrollView;
        if (!scrollView || !scrollView.content) return;

        let content = scrollView.content;
        let view = scrollView.node.getChildByName('view');
        let scrollBar = scrollView.verticalScrollBar;
        if (!view) return;

        let layout = content.getComponent(Layout);
        if (!layout) return;

        if (this._rewardLayoutPaddingTop == null) {
            this._rewardLayoutPaddingTop = layout.paddingTop;
            this._rewardLayoutPaddingBottom = layout.paddingBottom;
        }

        layout.paddingTop = this._rewardLayoutPaddingTop;
        layout.paddingBottom = this._rewardLayoutPaddingBottom || 0;
        layout.updateLayout();

        let viewTransform = view.getComponent(UITransform);
        let contentTransform = content.getComponent(UITransform);
        if (!viewTransform || !contentTransform) return;

        let viewHeight = viewTransform.height;
        let contentHeight = contentTransform.height;
        if (contentHeight < viewHeight) {
            let offset = Math.floor((viewHeight - contentHeight) / 2);
            layout.paddingTop = this._rewardLayoutPaddingTop + offset;
            layout.paddingBottom = (this._rewardLayoutPaddingBottom || 0) + offset;
            contentTransform.setContentSize(contentTransform.width, viewHeight);
            layout.updateLayout();
            scrollView.vertical = false;
            if (scrollBar) scrollBar.node.active = false;
        } else {
            scrollView.vertical = true;
            if (scrollBar) scrollBar.node.active = true;
        }
    }

    onClose() {
        let spineNode = this.findNodeByName(this.node, 'SpineTop');
        let skeleton = spineNode && spineNode.getComponent(sp.Skeleton);
        if (skeleton && skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }
        if (!this._waitingResourceRewardFly && !this._resourceRewardFinished) {
            this.playResourceRewardFlies(this.captureResourceRewardPlans());
        }
    }

    callClose() {
        if (this._closingResourceRewardFlow) return;
        this._closingResourceRewardFlow = true;
        if (this.nextWindow && this.nextWindow !== 'none') {
            UIRoot.instance.openChildWindow('ShopWindow');
        }
        const plans = this.captureResourceRewardPlans();
        this._waitingResourceRewardFly = plans.length > 0;
        this.closeAnim(() => {
            this._waitingResourceRewardFly = false;
            this.playResourceRewardFlies(plans);
        });
    }

    captureResourceRewardPlans() {
        return this._resourceGainPlans.map(plan => {
            const fromNode = this._resourceRewardNodes[plan.contentType];
            return {
                contentType: plan.contentType,
                count: plan.count,
                from: plan.from,
                to: plan.to,
                fromWorldPos: fromNode && isValid(fromNode)
                    ? fromNode.worldPosition.clone()
                    : (isValid(this.node) ? this.node.worldPosition.clone() : null),
            };
        });
    }

    playResourceRewardFlies(plans: any[]) {
        if (this._resourceRewardFinished) return;
        this._resourceRewardFinished = true;
        const userInfo = this.getMainUserInfo();
        if (!userInfo?.playResourceGainAnim || !plans?.length) return;

        let index = 0;
        const playNext = () => {
            if (index >= plans.length) return;
            const plan = plans[index++];
            userInfo.playResourceGainAnim(plan.contentType, { ...plan, cb: playNext });
        };
        playNext();
    }
}
