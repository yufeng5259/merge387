import { _decorator, instantiate, isValid, Node, sp } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ContentModel } from '../../game/items/ContentModel';

const { ccclass, property } = _decorator;

@ccclass('ShopBuySucessWindow')
export default class ShopBuySucessWindow extends UIWindow {
    public static windowPath = 'Shop/ShopBuySucessWindow';

    @property(Node)
    rewardNodeParent: Node | null = null;

    @property(Node)
    rewardNode: Node | null = null;

    @property(Node)
    SpineTop: Node | null = null;

    data: any = null;

    onShow(showParams: any) {
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
        if (!this.rewardNode || !this.rewardNodeParent) return;
        let rewards = Game.Content.FromContents(this.data);
        rewards.forEach((reward: any) => {
            let reward_node = instantiate(this.rewardNode!);
            reward_node.parent = this.rewardNodeParent;
            reward_node.active = true;
            let contentModel = reward_node.getComponent(ContentModel);
            if (contentModel) contentModel.show(reward, null);
        });
    }

    onClose() {
        let spineNode = this.findNodeByName(this.node, 'SpineTop');
        let skeleton = spineNode && spineNode.getComponent(sp.Skeleton);
        if (skeleton && skeleton.setCompleteListener) {
            skeleton.setCompleteListener(null);
        }
    }

    callClose() {
        UIRoot.instance.openChildWindow('ShopWindow');
        this.closeAnim();
    }
}
