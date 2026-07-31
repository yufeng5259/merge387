import {
    _decorator,
    Color,
    easing,
    instantiate,
    isValid,
    Label,
    Layout,
    Node,
    Prefab,
    Sprite,
    SpriteFrame,
    tween,
    Tween,
    UITransform,
    Vec3,
} from 'cc';
import StoryWindow from './StoryWindow';

const { ccclass } = _decorator;

@ccclass('GeneralStotyWindow')
export default class GeneralStotyWindow extends StoryWindow {
    public static windowPath = 'Story/GeneralStotyWindow';

    public showParams: any = {};
    public storyKey = '';
    public leftPosX = -300;
    public leftTargetPosX = 0;
    public rightPosX = 350;
    public rightTargetPosX = 0;
    public roleLoadTokens: Record<'left' | 'right', number> = { left: 0, right: 0 };
    public currentRoleIds: Record<'left' | 'right', any> = { left: null, right: null };
    public currentBodyResNames: Record<'left' | 'right', string | null> = { left: null, right: null };
    public talkPaddingTop = 40;
    public talkPaddingBottom = 110;
    private loadGeneration = 0;

    public onShow(showParams: any) {
        this.loadGeneration++;
        this.showParams = showParams || {};
        this.storyKey = this.showParams.key || '';
        this.resetRuntimeState();
        this.prepareTemplateNodes();
        this.initView();
        this.bindTapNode();
        this.loadStoryList(this.storyKey);
        this.startStory();
    }

    public onClose() {
        this.loadGeneration++;
        this.unbindTapNode();
        const leftRole = this.getChapterRoleTarget(true);
        const rightRole = this.getChapterRoleTarget(false);
        if (leftRole) Tween.stopAllByTarget(leftRole);
        if (rightRole && rightRole !== leftRole) Tween.stopAllByTarget(rightRole);
    }

    public resetRuntimeState() {
        this.msgList = [];
        this.tapCount = 0;
        this.preId = '0000';
        this.curId = '0000';
        this.preLeft = true;
        this.chapterImageNode = null;
        this.leftPosX = -300;
        this.leftTargetPosX = 0;
        this.rightPosX = 350;
        this.rightTargetPosX = 0;
        this.roleLoadTokens = { left: 0, right: 0 };
        this.currentRoleIds = { left: null, right: null };
        this.currentBodyResNames = { left: null, right: null };
        this.talkPaddingTop = 40;
        this.talkPaddingBottom = 110;
    }

    public prepareTemplateNodes() {
        this.setTemplateActive(this.leftNode, false);
        this.setTemplateActive(this.rightNode, false);
        this.setTemplateActive(this.chapterNode, false);
    }

    public setTemplateActive(templateNode: Prefab | Node | null, active: boolean) {
        if (templateNode instanceof Node) templateNode.active = active;
    }

    public initView() {
        if (this.talkScr?.content) {
            this.talkScr.content.removeAllChildren();
            this.applyTalkContentPadding();
        }
        this.chapterParent?.removeAllChildren();
        if (this.titleText) this.titleText.string = '';
        this.setTapVisible(false);
        this.setContinueVisible(false);
    }

    public loadStoryList(key: string) {
        this.msgList = [];
        if (!key) {
            Logs.Warning('GeneralStotyWindow missing story key');
            return this.msgList;
        }
        const metas = Meta.MetaManager.GetMetas(Meta.MetaType.Story);
        if (!metas) {
            Logs.Warning('GeneralStotyWindow no Story meta', key);
            return this.msgList;
        }
        Object.keys(metas).forEach((id) => {
            const meta = metas[id];
            if (meta?.BlID?.() === key) this.msgList.push(meta);
        });
        this.msgList.sort((a, b) => this.getStorySortId(a) - this.getStorySortId(b));
        console.log('GeneralStotyWindow loadStoryList', key, this.msgList.length);
        return this.msgList;
    }

    public getStorySortId(storyMeta: any) {
        const id = Number(storyMeta?.Id?.());
        return Number.isFinite(id) ? id : 0;
    }

    public startStory() {
        if (!this.hasStoryContent()) {
            Logs.Warning('GeneralStotyWindow no story content', this.storyKey);
            this.close_window();
            return;
        }
        this.createChapterNode(this.msgList[0]);
        this.setTapVisible(true);
        this.showNext();
    }

    public hasStoryContent() {
        return this.msgList.length > 0;
    }

    public bindTapNode() {
        if (!this.tapNode) return;
        this.tapNode.off(Node.EventType.TOUCH_END, this.onTapNodeTouchEnd, this);
        this.tapNode.on(Node.EventType.TOUCH_END, this.onTapNodeTouchEnd, this);
    }

    public unbindTapNode() {
        this.tapNode?.off(Node.EventType.TOUCH_END, this.onTapNodeTouchEnd, this);
    }

    public onTapNodeTouchEnd() {
        this.showNext();
    }

    public showNext() {
        if (this.tapCount >= this.msgList.length) {
            this.setTapVisible(false);
            this.setContinueVisible(true);
            return;
        }
        this.setTapVisible(true);
        this.setContinueVisible(false);
        const storyMeta = this.msgList[this.tapCount];
        this.createTalkNode(storyMeta);
        this.showTalkRole(storyMeta, this.preLeft);
        this.tapCount++;
    }

    public createTalkNode(storyMeta: any) {
        if (!storyMeta || !this.talkScr?.content) return null;
        this.curId = storyMeta.StoryUserID?.() || '';
        if (this.curId !== this.preId) {
            this.preLeft = !this.preLeft;
            this.preId = this.curId;
        }
        const template = this.preLeft ? this.leftNode : this.rightNode;
        if (!template) {
            Logs.Warning('GeneralStotyWindow missing talk template', this.preLeft ? 'leftNode' : 'rightNode');
            return null;
        }
        const talkNode = instantiate(template);
        talkNode.active = true;
        talkNode.parent = this.talkScr.content;
        this.setupTalkNode(talkNode, storyMeta, this.preLeft);
        this.refreshTalkContentLayout();
        this.updateTalkScrollPosition();
        return talkNode;
    }

    public setupTalkNode(talkNode: Node, storyMeta: any, isLeft: boolean) {
        const roleMeta = this.getRoleMeta(storyMeta);
        const msgLabel = this.getLabelInNode(talkNode, 'msgLbl');
        const nameLabel = this.getLabelInNode(talkNode, 'nameLbl');
        const bgNode = this.getNodeInNode(talkNode, 'bgNode');
        const sex = this.getRoleSex(roleMeta);
        const colors = ['#D55482', '#349DE7', '#7D6FE3'];
        for (let i = 0; i < 3; i++) {
            const bg = bgNode?.getChildByName(`bg${i}`);
            if (bg) bg.active = i === sex;
        }
        if (msgLabel) {
            msgLabel.string = storyMeta?.StoryContent ? GameKit.i18n.sel(storyMeta.StoryContent()) : '';
            if (colors[sex]) msgLabel.color = new Color().fromHEX(colors[sex]);
        }
        if (nameLabel) nameLabel.node.active = false;
        GameKit.SoundManager?.playDialoguePopSound?.();
        this.createTalkRoleNode(talkNode, storyMeta, roleMeta, isLeft);
    }

    public createTalkRoleNode(talkNode: Node, storyMeta: any, roleMeta: any, isLeft: boolean) {
        const userNode = this.getNodeInNode(talkNode, 'userNode');
        if (!userNode || !roleMeta) return;
        const faceNode = this.getNodeInNode(userNode, 'faceNode');
        const face = faceNode?.getChildByName('face');
        if (!faceNode || !face) {
            Logs.Warning('GeneralStotyWindow missing faceNode or face');
            return;
        }
        const expressionType = Number(roleMeta.EType?.() || 1);
        let faceItem: Node | null = null;
        for (let i = 1; i < 6; i++) {
            const stateNode = face.getChildByName(String(i));
            if (stateNode) {
                stateNode.active = expressionType === i;
                if (stateNode.active) faceItem = stateNode;
            }
        }
        this.loadTalkAvatarSprite(faceItem || face.getChildByName('1'), roleMeta, isLeft);
        const nameLabel = this.getLabelInNode(faceNode, 'name');
        if (nameLabel && roleMeta.Name) nameLabel.string = GameKit.i18n.sel(roleMeta.Name());
        this.updateTalkGenderStyle(faceNode, this.getRoleSex(roleMeta));
    }

    public getRoleSex(roleMeta: any) {
        const sex = Number(roleMeta?.Sex?.());
        return Number.isFinite(sex) && sex >= 0 && sex <= 2 ? sex : 0;
    }

    public updateTalkGenderStyle(faceNode: Node, sex: number) {
        this.loadGenderSprite(faceNode.getChildByName('avatar_frame'), `res/Town/FreeAvatarFrame_ui/nameBG${sex}`, 'nameBG');
        this.loadGenderSprite(faceNode.getChildByName('BG'), `res/Town/FreeAvatarFrame_ui/avatar_frame_free${sex}`, 'avatar frame');
    }

    public loadGenderSprite(node: Node | null, resName: string, logName: string) {
        if (!node || !resName) return;
        const sprite = node.getComponent(Sprite);
        if (!sprite) {
            Logs.Warning(`GeneralStotyWindow missing ${logName} sprite`);
            return;
        }
        (node as any)._storyGenderResName = resName;
        this.loadSprite(resName, (frame) => {
            if (!isValid(node) || (node as any)._storyGenderResName !== resName) return;
            if (frame) sprite.spriteFrame = frame;
        });
    }

    public loadTalkAvatarSprite(faceItem: Node | null, roleMeta: any, isLeft: boolean) {
        const resName = this.getAvatarResName(roleMeta?.Avatar?.());
        const sprite = faceItem?.getComponent(Sprite);
        if (!faceItem || !sprite || !resName) return;
        this.updateTalkAvatarDirection(faceItem, isLeft);
        (faceItem as any)._storyAvatarResName = resName;
        sprite.spriteFrame = null;
        this.loadSprite(resName, (frame) => {
            if (!isValid(faceItem) || (faceItem as any)._storyAvatarResName !== resName) return;
            if (frame) sprite.spriteFrame = frame;
        });
    }

    public updateTalkAvatarDirection(faceItem: Node, isLeft: boolean) {
        faceItem.setScale(isLeft ? Math.abs(faceItem.scale.x) : -Math.abs(faceItem.scale.x), faceItem.scale.y, faceItem.scale.z);
    }

    public getAvatarResName(avatar: any) {
        let resName = String(avatar || '').replace(/\\/g, '/').replace(/\.(png|jpg|jpeg)$/i, '');
        if (!resName || resName.startsWith('res/')) return resName;
        return resName.includes('/') ? `res/${resName}` : `res/Town/avatar/${resName}`;
    }

    public createChapterNode(storyMeta: any) {
        if (!this.chapterNode || !this.chapterParent) return null;
        this.chapterParent.removeAllChildren();
        const chapterNode = instantiate(this.chapterNode);
        chapterNode.active = true;
        chapterNode.parent = this.chapterParent;
        this.chapterImageNode = chapterNode;
        this.setupChapterNode(chapterNode, storyMeta);
        return chapterNode;
    }

    public setupChapterNode(chapterNode: Node, storyMeta: any) {
        const titleLabel = this.getLabelInNode(chapterNode, 'ChapterNameLbl');
        const imageSprite = this.getSpriteInNode(chapterNode, 'sp');
        if (titleLabel) {
            const title = this.showParams.title || storyMeta?.ChapterName?.() || '';
            titleLabel.string = title ? GameKit.i18n.sel(title) : '';
        }
        const chapterImage = storyMeta?.ChapterImage?.() || '';
        if (!chapterImage || !imageSprite) return;
        this.loadSprite(`res/Story/chapterImage/${chapterImage}`, (frame) => {
            if (isValid(this.node) && frame) imageSprite.spriteFrame = frame;
        });
    }

    public showTalkRole(storyMeta: any, isLeft: boolean) {
        const roleMeta = this.getRoleMeta(storyMeta);
        const body = roleMeta?.Body?.();
        if (!body) return;
        const targetNode = this.getChapterRoleTarget(isLeft);
        if (!targetNode) return;
        const sideKey: 'left' | 'right' = isLeft ? 'left' : 'right';
        const roleId = storyMeta.StoryUserID?.() || storyMeta.EId?.();
        const token = ++this.roleLoadTokens[sideKey];
        const resName = this.getBodyResName(body);
        const sameRole = this.currentRoleIds[sideKey] === roleId && this.hasRoleSprite(targetNode);
        const sameBody = this.currentBodyResNames[sideKey] === resName && sameRole;
        if (sameBody) {
            Tween.stopAllByTarget(targetNode);
            targetNode.setPosition(isLeft ? this.leftTargetPosX : this.rightTargetPosX, targetNode.position.y, targetNode.position.z);
            this.updateRoleDirection(targetNode, isLeft);
            return;
        }
        this.loadSprite(resName, (frame) => {
            if (token !== this.roleLoadTokens[sideKey] || !isValid(this.node) || !isValid(targetNode) || !frame) return;
            this.currentRoleIds[sideKey] = roleId;
            this.currentBodyResNames[sideKey] = resName;
            this.showRoleSprite(targetNode, frame, isLeft, sameRole);
        });
    }

    public getChapterRoleTarget(isLeft: boolean) {
        if (!this.chapterImageNode) return null;
        const namedTarget = this.getNodeInNode(this.chapterImageNode, isLeft ? 'leftTalkNode' : 'rightTalkNode');
        if (namedTarget) return namedTarget;
        const roleNodes = this.getNodesInNode(this.chapterImageNode, 'roleNode');
        return roleNodes[isLeft ? 0 : 1] || roleNodes[0] || null;
    }

    public getBodyResName(body: any) {
        let resName = String(body || '').replace(/\\/g, '/').replace(/\.(png|jpg|jpeg)$/i, '');
        if (resName.startsWith('res/')) return resName;
        return resName.includes('/') ? `res/${resName}` : `res/Town/body/${resName}`;
    }

    public showRoleSprite(targetNode: Node, spriteFrame: SpriteFrame, isLeft: boolean, noMove: boolean) {
        Tween.stopAllByTarget(targetNode);
        targetNode.active = true;
        const targetX = isLeft ? this.leftTargetPosX : this.rightTargetPosX;
        targetNode.setPosition(noMove ? targetX : (isLeft ? this.leftPosX : this.rightPosX), targetNode.position.y, targetNode.position.z);
        const roleNode = this.getRoleSpriteNode(targetNode);
        this.clearGeneratedRoleChildren(targetNode, roleNode);
        roleNode.active = true;
        this.updateRoleDirection(targetNode, isLeft);
        if (roleNode !== targetNode) roleNode.setPosition(0, 0, roleNode.position.z);
        (roleNode.getComponent(Sprite) || roleNode.addComponent(Sprite)).spriteFrame = spriteFrame;
        if (!noMove) {
            tween(targetNode).to(0.25, { position: new Vec3(targetX, targetNode.position.y, targetNode.position.z) }, { easing: easing.backOut }).start();
        }
    }

    public updateRoleDirection(targetNode: Node, isLeft: boolean) {
        const roleNode = this.getRoleSpriteNode(targetNode);
        roleNode.setScale(isLeft ? Math.abs(roleNode.scale.x) : -Math.abs(roleNode.scale.x), roleNode.scale.y, roleNode.scale.z);
    }

    public hasRoleSprite(targetNode: Node) {
        return !!this.getRoleSpriteNode(targetNode).getComponent(Sprite)?.spriteFrame;
    }

    public getRoleSpriteNode(targetNode: Node) {
        return targetNode.getChildByName('roleNode') || targetNode;
    }

    public clearGeneratedRoleChildren(targetNode: Node, keepNode: Node) {
        targetNode.children.slice().forEach((child) => {
            if (child !== keepNode && child.name === 'story_body') child.destroy();
        });
    }

    public getRoleMeta(storyMeta: any) {
        if (!storyMeta?.EId || !storyMeta?.GetRoleMeata) return null;
        return storyMeta.GetRoleMeata(storyMeta.EId());
    }

    public loadSprite(resName: string, callback?: (spriteFrame: SpriteFrame | null) => void) {
        const generation = this.loadGeneration;
        if (!resName) {
            callback?.(null);
            return;
        }
        cce.loadRes(resName, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            if (generation !== this.loadGeneration) return;
            if (err || !spriteFrame) {
                Logs.Warning(err || `GeneralStotyWindow load sprite failed: ${resName}`);
                callback?.(null);
                return;
            }
            callback?.(spriteFrame);
        });
    }

    public getNodeInNode(root: Node | null, nodeName: string): Node | null {
        if (!root || !nodeName) return null;
        if (root.name === nodeName) return root;
        const tableNode = this.getNodeFromControllerTable(root, nodeName);
        if (tableNode) return tableNode;
        for (const child of root.children) {
            const found = this.getNodeInNode(child, nodeName);
            if (found) return found;
        }
        return null;
    }

    public getNodeFromControllerTable(root: Node, nodeName: string): Node | null {
        return GameKit?.ControllerTable?.GetNode?.(root, nodeName) || null;
    }

    public getNodesInNode(root: Node | null, nodeName: string, result: Node[] = []): Node[] {
        if (!root || !nodeName) return result;
        if (root.name === nodeName) result.push(root);
        root.children.forEach((child) => this.getNodesInNode(child, nodeName, result));
        return result;
    }

    public getLabelInNode(root: Node, nodeName: string) {
        return this.getNodeInNode(root, nodeName)?.getComponent(Label) || null;
    }

    public getSpriteInNode(root: Node, nodeName: string) {
        return this.getNodeInNode(root, nodeName)?.getComponent(Sprite) || null;
    }

    public refreshTalkContentLayout() {
        if (!this.talkScr?.content) return;
        const content = this.talkScr.content;
        const contentTransform = content.getComponent(UITransform) || content.addComponent(UITransform);
        const talkTransform = this.talkScr.node.getComponent(UITransform);
        if (talkTransform) contentTransform.setContentSize(talkTransform.width, contentTransform.height);
        content.getComponent(Layout)?.updateLayout();
        if (talkTransform && contentTransform.height < talkTransform.height) {
            contentTransform.setContentSize(contentTransform.width, talkTransform.height);
        }
    }

    public applyTalkContentPadding() {
        const layout = this.talkScr?.content?.getComponent(Layout);
        if (!layout) return;
        layout.paddingTop = Math.max(layout.paddingTop || 0, this.talkPaddingTop);
        layout.paddingBottom = Math.max(layout.paddingBottom || 0, this.talkPaddingBottom);
    }

    public updateTalkScrollPosition() {
        if (!this.talkScr?.content) return;
        const contentTransform = this.talkScr.content.getComponent(UITransform);
        const talkTransform = this.talkScr.node.getComponent(UITransform);
        if (contentTransform && talkTransform && contentTransform.height <= talkTransform.height + 1) {
            this.talkScr.scrollToTop(0);
            return;
        }
        this.talkScr.scrollToBottom(0.1);
    }

    public setTapVisible(active: boolean) {
        if (this.tapLablNode) this.tapLablNode.active = active;
        if (this.tapNode) this.tapNode.active = active;
    }

    public setContinueVisible(active: boolean) {
        const continueBtn = this.getNodeInNode(this.node, 'btn_1');
        if (continueBtn) continueBtn.active = active;
    }

    public close_window() {
        this.closeAnim();
    }
}
