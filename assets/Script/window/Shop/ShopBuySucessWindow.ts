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

    onShow(showParams: any) {
        this.nextWindow = showParams.nextWindow || 'ShopWindow';
        this.data = showParams.rewards;
        console.log('璐拱鎴愬姛', this.data);
        if (GameKit.SoundManager && GameKit.SoundManager.playBreakEggFinSound) {
            GameKit.SoundManager.playBreakEggFinSound();
        }
        this.playTopSpine();
        this.initNode();
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
        this.rewardNode.active = false;
        let rewards = Game.Content.FromContents(this.data);
        rewards.forEach((reward: any) => {
            let reward_node = instantiate(this.rewardNode!);
            reward_node.parent = parent;
            reward_node.active = true;
            let contentModel = reward_node.getComponent(ContentModel);
            if (contentModel) contentModel.show(reward);
        });
        this.updateRewardContentAlign();
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
    }

    callClose() {
        if (this.nextWindow && this.nextWindow !== 'none') {
            UIRoot.instance.openChildWindow('ShopWindow');
        }
        this.closeAnim();
    }
}
