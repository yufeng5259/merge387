import { _decorator, find, instantiate, Label, Layout, Node, Prefab, ScrollView, UITransform } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';

const { ccclass, property } = _decorator;

@ccclass('StoryWindow')
export default class StoryWindow extends UIWindow {
    public static windowPath = 'Story/StoryWindow';

    @property(Label)
    titleText: Label | null = null;

    @property(Prefab)
    leftNode: Prefab | null = null;

    @property(Prefab)
    rightNode: Prefab | null = null;

    @property(Prefab)
    chapterNode: Prefab | null = null;

    @property(Prefab)
    chapterEnd: Prefab | null = null;

    @property(Prefab)
    talkUpgradeNode: Prefab | null = null;

    @property(ScrollView)
    talkScr: ScrollView | null = null;

    @property(Node)
    tapNode: Node | null = null;

    @property(Node)
    tapLablNode: Node | null = null;

    @property(Node)
    chapterParent: Node | null = null;

    meta: any = null;
    record: any = null;
    level: any = null;
    stage: any = null;
    skipRewards: any = null;
    msgList: any[] = [];
    tapCount = 0;
    preId = '0000';
    curId = '0000';
    preLeft = true;
    chapterImageNode: any = null;

    onShow(showParams: any) {
        //MapStoryMeta
        UIRoot.instance.closeChildWindow('GetRewardWindow');
        console.log(showParams, 'StoryWindow', showParams.level, showParams.stage);

        this.meta = showParams.meta;
        this.record = showParams.record;
        this.level = showParams.level;
        this.stage = showParams.stage;
        this.skipRewards = showParams.skipRewards;
        if (this.talkScr && this.talkScr.content) this.talkScr.content.removeAllChildren();
        this.msgList = [];
        this.tapCount = 0;
        this.preId = '0000';
        this.curId = '0000';
        this.preLeft = true;
        this.chapterImageNode = null;
        this.loadStoryThenInit();
    }

    loadStoryThenInit() {
        if (!this.meta || !Game.SUserStory || !Game.SUserStory.loadStory) {
            this.init();
            return;
        }
        let mbid = this.meta.MBId();
        let url = G.GameConfig.storyPortal + mbid + '.txt';
        Game.SUserStory.loadStory(url, mbid, function(this: StoryWindow, success: boolean) {
            if (!this.node || !this.node.isValid) return;
            if (!success) {
                Logs.Warning('StoryWindow load story failed', mbid);
                UIRoot.instance.CloseCantClick();
                this.closeAnim();
                return;
            }
            this.init();
        }.bind(this));
    }

    refreshTalkContentLayout() {
        if (!this.talkScr || !this.talkScr.content) return;
        let content = this.talkScr.content;
        let contentTransform = this.getOrAddUITransform(content);
        let talkTransform = this.talkScr.node.getComponent(UITransform);
        if (talkTransform) contentTransform.setContentSize(talkTransform.width, contentTransform.height);
        let layout = content.getComponent(Layout);
        if (layout && layout.updateLayout) {
            layout.updateLayout();
        }
        if (talkTransform && contentTransform.height < talkTransform.height) {
            contentTransform.setContentSize(contentTransform.width, talkTransform.height);
        }
    }

    setTapVisible(active: boolean) {
        if (this.tapLablNode) this.tapLablNode.active = active;
        if (this.tapNode) this.tapNode.active = active;
    }

    setContinueVisible(active: boolean) {
        let continueBtn = find('bg/btn_1', this.node);
        if (continueBtn) continueBtn.active = active;
    }

    bindTapNode() {
        if (!this.tapNode) return;
        this.tapNode.off(Node.EventType.TOUCH_END, this.onTapNodeTouchEnd, this);
        this.tapNode.on(Node.EventType.TOUCH_END, this.onTapNodeTouchEnd, this);
    }

    onTapNodeTouchEnd() {
        this.showTapmsg();
    }

    onClose() {
        if (this.tapNode) {
            this.tapNode.off(Node.EventType.TOUCH_END, this.onTapNodeTouchEnd, this);
        }
    }

    init() {
        this.setTapVisible(false);
        this.setContinueVisible(false);
        let langKey = 'Chapter_Title_' + this.meta.MapId() + '_' + this.meta.BuildID();
        if (this.titleText) this.titleText.string = GameKit.i18n.t(langKey);

        if (this.record) {
            this.msgList = Game.SUserStory.getContenListAll(this.meta.MBId());
            if (!this.hasStoryContent()) return;
            this.onCreateChapterImage(this.msgList[0]);
            this.showRecord();
        } else {
            this.msgList = Game.SUserStory.getContentList(this.meta.MapId(), this.meta.BuildID(), this.level, this.stage);
            if (!this.hasStoryContent()) return;
            this.onCreateChapterImage(this.msgList[0]);
            this.setTapVisible(true);
            this.showTapmsg();
            this.bindTapNode();
        }
        UIRoot.instance.CloseCantClick();
    }

    hasStoryContent() {
        if (this.msgList && this.msgList.length > 0) return true;
        Logs.Warning('StoryWindow no story content', this.meta && this.meta.MBId && this.meta.MBId(), this.level, this.stage);
        this.closeAnim();
        UIRoot.instance.CloseCantClick();
        return false;
    }

    showTapmsg() {
        if (this.tapCount >= this.msgList.length) {
            this.setTapVisible(false);
            this.setContinueVisible(!this.record);
            //this.onCreateUpgrad();
            //this.onCreateEnd();
        } else {
            this.setTapVisible(true);
            this.setContinueVisible(false);
            let element = this.msgList[this.tapCount];
            this.onCreateMsg(element);
            this.tapCount++;
        }
    }

    showRecord() {
        this.preId = '0000';
        this.curId = '0000';
        this.preLeft = true;
        this.msgList.forEach(element => {
            this.onCreateMsg(element);
        });
    }

    onCreateMsg(element: any) {
        this.curId = element.StoryUserID();
        if (this.curId !== this.preId) {
            this.preLeft = !this.preLeft;
            this.preId = this.curId;
        }

        let prefab = this.preLeft ? this.leftNode : this.rightNode;
        if (!prefab || !this.talkScr || !this.talkScr.content) return;
        let cNode = instantiate(prefab);
        cNode.parent = this.talkScr.content;
        let sMsg: any = cNode.getComponent('ChapterTalkNode');
        if (sMsg) sMsg.showInfo(element, this.preLeft);
        if (this.chapterImageNode && this.chapterImageNode.showTalkRole) {
            this.chapterImageNode.showTalkRole(element, this.preLeft);
        }
        this.refreshTalkContentLayout();
        this.talkScr.scrollToBottom(0.1);
        // this.talkScr.content.sortAllChildren()
    }

    //鍒涘缓绔犺妭鍥剧墖
    onCreateChapterImage(element: any) {
        if (this.chapterParent) {
            this.chapterParent.removeAllChildren();
        }
        if (!this.chapterNode || !this.chapterParent) return;
        let cNode = instantiate(this.chapterNode);
        cNode.parent = this.chapterParent;
        let sMsg: any = cNode.getComponent('ChapterImageNode');
        this.chapterImageNode = sMsg;
        if (sMsg) sMsg.showInfo(element);
        //this.talkScr.scrollToPercentVertical(0,0.1);
        // this.talkScr.content.sortAllChildren()
    }

    //鍒涘缓end
    onCreateEnd() {
        if (!this.chapterEnd || !this.talkScr || !this.talkScr.content) return;
        let cNode = instantiate(this.chapterEnd);
        cNode.parent = this.talkScr.content;
        this.talkScr.scrollToPercentVertical(0, 0.1);
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.RefreshCurrentWindow) {
            Game.MergeTutorialManager.RefreshCurrentWindow();
        }
        // this.talkScr.content.sortAllChildren()
    }

    onCreateUpgrad() {
        if (!this.talkUpgradeNode || !this.talkScr || !this.talkScr.content) return;
        let cNode = instantiate(this.talkUpgradeNode);
        cNode.parent = this.talkScr.content;
        let sMsg: any = cNode.getComponent('TalkUpgradeNode');
        if (sMsg) sMsg.showWindow(this.meta, this.level);
        this.talkScr.scrollToPercentVertical(0, 0.1);
        // this.talkScr.content.sortAllChildren()
    }

    showToTop() {
        if (this.talkScr) this.talkScr.scrollToTop(0.1);
    }

    checkRewards() {
        if (this.skipRewards) {
            this.close_window();
            return;
        }
        if (Game.MergeTutorialManager && Game.MergeTutorialManager.EmitNodeClick) {
            Game.MergeTutorialManager.EmitNodeClick('level_reward_button');
        }

        let getrewards = GameKit.DataCache.GetData('LevelUPGetReward');
        console.log('濂栧姳', getrewards);
        if (getrewards != null) {
            let rewards: any[] = [];
            getrewards.forEach((x: any) => {
                let c = Game.Content.FromContent(x);
                rewards.push(c);
            });
            GameKit.DataCache.RemoveData('LevelUPGetReward');
            UIRoot.instance.openChildWindow('LevelUpGetRewardWindow', { contents: rewards, showCallback: (wnd: any) => {
                wnd.addOnCloseFunc(() => {
                    console.log('checkRewards 濂栧姳缁撴潫,鏍规嵁閬撳叿鏉ユ簮妯″潡杩涜鍚庣画鎿嶄綔');
                });
            } });
        }
        this.close_window();
    }

    close_window() {
        if (this.skipRewards) {
            this.closeAnim();
            return;
        }
        let rewards = GameKit.DataCache.GetData('GET_EXP');
        GameKit.DataCache.RemoveData('GET_EXP');
        if (rewards) {
            UIRoot.instance.openChildWindow('GetRewardWindow', { contents: [rewards], showCallback: (wnd: any) => {
                wnd.addOnCloseFunc(() => {
                    console.log('濂栧姳缁撴潫,鏍规嵁閬撳叿鏉ユ簮妯″潡杩涜鍚庣画鎿嶄綔');
                });
            } });
        }
        this.closeAnim();
    }

    private getOrAddUITransform(node: Node) {
        return node.getComponent(UITransform) || node.addComponent(UITransform);
    }
}
