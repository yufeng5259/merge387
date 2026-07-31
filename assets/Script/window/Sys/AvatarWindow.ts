import { _decorator, assetManager, Color, Component, EditBox, Font, instantiate, Label, LabelOutline, Node, ProgressBar, resources, Sprite, SpriteFrame, sys, UITransform, UIOpacity, Vec2 } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { bindGuardedClick, unbindGuardedClick } from '../../GameKit/ui/TouchClickGuard';

const { ccclass, property } = _decorator;
const GIFT_ICON = 'AvatarWindow/avatar_window_gift_icon';
const GIFT_DOT = 'AvatarWindow/avatar_window_page_dot';
const GIFT_DOT_FONT_BUNDLE = 'LiveData';
const GIFT_DOT_FONT = 'PoetsenOne-Regular';
const BUBBLE_BG = 'QuestCenterWindow/SignWindow/sign_btn_white';
const BUBBLE_ARROW = 'QuestCenterWindow/SignWindow/sanjiao';
const GIFT_DOT_SIZE = 25;
const BUBBLE_BORDER = 24;
const BUBBLE_REWARD_SIZE = 40;
const BUBBLE_COUNT_WIDTH = 50;
const BUBBLE_COUNT_HEIGHT = 20;
const BUBBLE_COUNT_Y = -26;
const BUBBLE_COUNT_FONT_SIZE = 16;
const BUBBLE_COUNT_OUTLINE_WIDTH = 2;

@ccclass('AvatarWindow')
export default class AvatarWindow extends UIWindow {
    public static windowPath = 'Sys/AvatarWindow';

    @property(Label)
    nameLabel: Label | null = null;

    @property(EditBox)
    editNameInput: EditBox | null = null;

    @property(Label)
    idLabel: Label | null = null;

    @property(Label)
    levelLabel: Label | null = null;

    @property(ProgressBar)
    expProgress: ProgressBar | null = null;

    @property(ProgressBar)
    expProgress1: ProgressBar | null = null;

    @property(Label)
    expLabel: Label | null = null;

    @property(Node)
    giftRewardsLayout: Node | null = null;

    @property(Node)
    avatarNode: Node | null = null;

    /** @type {UITabContainer} tab node鏁扮粍 */
    @property(Component)
    tab_node_array: any = null;

    @property(Component)
    list: any = null;

    showParams: any = null;
    MAX_AVATAR_FRAME_COUNT = 4;
    tab_index = 0;
    selectedAvatarFrameName: any = '1';
    selectedAvatarName = '';
    avatarArrData: any[] = [];
    avatarList: Array<{ name: string; resPath: string; spriteFrame: SpriteFrame }> = [];
    avatarFrameList: Array<{ name: string; resPath: string; spriteFrame: SpriteFrame }> = [];
    private giftRewards: any[] = [];
    private giftBubble: Node | null = null;
    private giftChest: Node | null = null;
    private giftDotFont: Font | null = null;
    private giftDotFontLoading = false;
    private giftBubbleLoading = false;
    private giftIconSpriteFrame: SpriteFrame | null = null;
    private giftDotSpriteFrame: SpriteFrame | null = null;
    private giftBubbleBg: SpriteFrame | null = null;
    private giftBubbleArrow: SpriteFrame | null = null;

    onShow(showParams: any) {
        this.showParams = showParams;
        // this.parseAvatarName(showParams.user.Avatar());

        if (this.nameLabel) this.nameLabel.string = showParams.user.Name();
        if (this.idLabel) this.idLabel.string = 'ID:' + showParams.user.Id().toString();
        if (this.levelLabel) this.levelLabel.string = showParams.user.Level().toString();
        let expInfo = showParams.user.GetLevelExpInfo ? showParams.user.GetLevelExpInfo() : null;
        let levelExp = Meta.MetaManager.GetMeta(Meta.MetaType.Level, showParams.user.Level()).Exp();
        let expProgress = expInfo ? expInfo.progress : showParams.user.Exp() / levelExp;
        if (this.expProgress) this.expProgress.progress = expProgress;
        if (this.expProgress1) this.expProgress1.progress = expProgress;
        if (this.expLabel) this.expLabel.string = expInfo ? expInfo.current.toString() + '/' + expInfo.need.toString() : showParams.user.Exp().toString() + '/' + levelExp.toString();
        if (this.editNameInput) {
            this.editNameInput.string = '';
            this.setNodeOpacity(this.editNameInput.node, 0);
            this.editNameInput.placeholder = GameKit.i18n.t('EditNickName');
        }

        this.MAX_AVATAR_FRAME_COUNT = 4;
        this.tab_index = 0;

        let avatarArrData = showParams.user.Avatar().split(';');
        let avatarIcon = GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite);
        let avatarFrame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
        this.selectedAvatarFrameName = this.normalizeFrame((avatarArrData.length > 1) ? avatarArrData[1] : '');
        this.selectedAvatarName = this.normalizeAvatar(avatarArrData[0]);

        this.SetAvatarFrame(avatarFrame, this.selectedAvatarFrameName);
        this.SetAvatar(avatarIcon, this.selectedAvatarName);
        this.loadAvatarAssets();
        // console.log(this.selectedAvatarName);

        if (this.tab_node_array) {
            this.tab_node_array.onShow((index: number, tab: any, first: boolean) => {
                console.log(first, 'index:', index);
                this.tab_index = index;
                if (index == 0) {
                    this.list.numItems = this.avatarList.length;
                } else {
                    this.list.numItems = this.avatarFrameList.length;
                }
            }, this.tab_index);
        }

        let showLevelAndReward = () => {
            let giftRewards = Game.Content.FromStrings(Meta.MetaManager.GetMeta(Meta.MetaType.Level, this.showParams.user.Level()).Rewards());
            this.setupGiftRewardChest(giftRewards);
            if (!this.giftRewardsLayout) return;
            this.giftRewardsLayout.children.forEach((child, index) => {
                if (index < giftRewards.length) {
                    child.active = true;
                    let contentModel: any = child.getComponent('ContentModel');
                    if (contentModel) contentModel.show(giftRewards[index], { infoBtnParams: { canTouch: false, showInfoBtn: true } });
                    //姝ゅ濂栧姳鍙兘鐪嬶紝鍗囩骇鍚庤嚜鍔ㄥ彂閫佸鍔?
                } else {
                    child.active = false;
                }
            });
        };

        showLevelAndReward();
    }

    parseAvatarName(avatarName: any) {
        // this.avatarArrData=["avatarUrl","frameName"];
        let avatar = this.showParams.user.Avatar();
        this.avatarArrData = avatar.split(';');
        if (this.avatarArrData.length == 1) {
            this.avatarArrData[1] = '1';
        }
    }

    onItemRender(node: Node, index: number) {
        const dynamicItem = this.tab_index === 0 ? this.avatarList[index] : this.avatarFrameList[index];
        if (dynamicItem) {
            const avatarSprite = GameKit.ControllerTable.GetComponent(node, 'icon', Sprite);
            const frameSprite = GameKit.ControllerTable.GetComponent(node, 'frame', Sprite);
            const selectedNode = GameKit.ControllerTable.GetNode(node, 'selectFrame');
            const checkSprite = GameKit.ControllerTable.GetComponent(node, 'gou', Sprite);
            const selected = this.tab_index === 0 ? dynamicItem.resPath === this.selectedAvatarName : dynamicItem.resPath === this.selectedAvatarFrameName;
            if (selectedNode) selectedNode.active = selected;
            if (checkSprite) checkSprite.node.active = selected;
            this.SetAvatar(avatarSprite, this.tab_index === 0 ? dynamicItem.resPath : this.selectedAvatarName);
            this.SetAvatarFrame(frameSprite, this.tab_index === 0 ? this.selectedAvatarFrameName : dynamicItem.resPath);
            unbindGuardedClick(node, this);
            bindGuardedClick(node, this, () => {
                if (this.tab_index === 0) {
                    this.selectedAvatarName = dynamicItem.resPath;
                    this.SetAvatar(GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite), dynamicItem.resPath);
                } else {
                    this.selectedAvatarFrameName = dynamicItem.resPath;
                    this.SetAvatarFrame(GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite), dynamicItem.resPath);
                }
                this.list.updateAll?.();
                this.saveAvatarInfo();
            });
            return;
        }
        // console.log(node,index);
        let avatarSprite = GameKit.ControllerTable.GetComponent(node, 'icon', Sprite);
        let avatarFrameSprite = GameKit.ControllerTable.GetComponent(node, 'frame', Sprite);
        let selectFrameRect = GameKit.ControllerTable.GetNode(node, 'selectFrame');
        let gouSprite = GameKit.ControllerTable.GetComponent(node, 'gou', Sprite);
        selectFrameRect.active = false;
        gouSprite.node.active = false;
        let avatarFrameName: any = index + 1;
        let avatarName = '';
        this.SetAvatar(avatarSprite, avatarName);
        if (this.tab_index == 0) {
            //澶村儚
            //鑾峰彇澶村儚
            // avatarFrameName="1";
            // avatarFrameSprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, avatarFrameName);
            this.SetAvatar(avatarSprite, avatarName);
        } else {
            //澶村儚妗?
            avatarSprite.spriteFrame = CommonAssets.instance.avatar_default;

            if (avatarFrameName == this.selectedAvatarFrameName) {
                selectFrameRect.active = true;
                gouSprite.node.active = true;
            } else {
                selectFrameRect.active = false;
                gouSprite.node.active = false;
            }
            avatarFrameSprite.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, avatarFrameName);
        }
        unbindGuardedClick(node, this);
        bindGuardedClick(node, this, () => {
            if (this.tab_index == 0) {

            } else {
                this.selectedAvatarFrameName = index + 1;
                let avatarFrame = GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite);
                avatarFrame.spriteFrame = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.AvatarFrames, this.selectedAvatarFrameName);
                this.list.updateAll();
            }
        });
    }

    SetAvatar(sprite: any, avatar: any) {
        if (sprite == null) return;
        try {
            const requestAvatar = this.normalizeAvatar(avatar);
            sprite._avatar = requestAvatar;
            sprite.spriteFrame = CommonAssets.instance.avatar_default;

            // 鍙鐞嗙綉缁滃ご鍍?
            if (requestAvatar.startsWith('res/profile_role/')) {
                resources.load(requestAvatar, SpriteFrame, (err, frame) => {
                    if (!err && sprite._avatar === requestAvatar) sprite.spriteFrame = frame;
                });
            } else if (requestAvatar.length > 0) {
                // 灏介噺鏍规嵁 url 鑷姩鎺ㄦ柇绫诲瀷锛岄伩鍏嶅啓姝?jpg 瀵艰嚧瑙ｆ瀽寮傚父
                cce.loaderLoad({ url: requestAvatar, type: 'jpg' }, function(err: any, tex: any) {
                    if (err == null && tex != null && sprite._avatar == tex._rawUrl) {
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = tex;
                        if (sprite.node) sprite.spriteFrame = spriteFrame;
                    }
                }, true);
            }
        } catch (e) {}
    }

    SetAvatarFrame(sprite: Sprite, frameName: any) {
        if (!sprite) return;
        const path = this.normalizeFrame(frameName);
        resources.load(path, SpriteFrame, (err, frame) => {
            if (!err && sprite && frame) sprite.spriteFrame = frame;
        });
    }

    private normalizeAvatar(value: any) {
        const name = String(value || 'Ava');
        if (/^https?:/.test(name) || name.startsWith('res/profile_role/')) return name;
        return `res/profile_role/${name}`;
    }

    private normalizeFrame(value: any) {
        const name = String(value || 'profile frame_1');
        if (name.startsWith('res/profileframe/')) return name;
        if (/^\d+$/.test(name)) return `res/profileframe/profile-frame_${name}`;
        return `res/profileframe/${name}`;
    }

    private loadAvatarAssets() {
        let finished = 0;
        const done = () => {
            if (++finished !== 2) return;
            this.MAX_AVATAR_FRAME_COUNT = this.avatarFrameList.length;
            if (this.list) {
                this.list.numItems = this.tab_index === 0 ? this.avatarList.length : this.avatarFrameList.length;
                this.list.updateAll?.();
            }
        };
        resources.loadDir('res/profile_role', SpriteFrame, (err, frames) => {
            this.avatarList = err ? [] : frames.map(frame => ({ name: frame.name, resPath: `res/profile_role/${frame.name}`, spriteFrame: frame }));
            done();
        });
        resources.loadDir('res/profileframe', SpriteFrame, (err, frames) => {
            this.avatarFrameList = err ? [] : frames.map(frame => ({ name: frame.name, resPath: `res/profileframe/${frame.name}`, spriteFrame: frame }));
            done();
        });
    }

    getVisibleGiftRewards(rewards: any[]) { return (rewards || []).filter(Boolean).slice(0, 3); }
    getGiftRewardChestNode() { return this.giftChest || this.giftRewardsLayout?.children[0] || null; }
    getGiftRewardTemplateNode() { return this.giftRewardsLayout?.children.find(child => child !== this.getGiftRewardChestNode() && !!child.getComponent('ContentModel')) || null; }
    onGiftRewardChestTouchEnd(event: any) { this.onGiftChestTouch(event); }
    _normalizeAvatarName(value: any) { return this.normalizeAvatar(value); }
    _normalizeAvatarFrameName(value: any) { return this.normalizeFrame(value); }
    _loadAvatarAssets() { this.loadAvatarAssets(); }
    _refreshList() {
        if (!this.list) return;
        this.list.numItems = this.tab_index === 0 ? this.avatarList.length : this.avatarFrameList.length;
        this.list.updateAll?.();
    }
    _findAvatarSpriteFrame(value: any) { return this.avatarList.find(item => item.resPath === this.normalizeAvatar(value))?.spriteFrame || null; }
    _findAvatarFrameSpriteFrame(value: any) { return this.avatarFrameList.find(item => item.resPath === this.normalizeFrame(value))?.spriteFrame || null; }
    _getDefaultAvatarPath() { return 'res/profile_role/Ava'; }
    _getDefaultFramePath() { return 'res/profileframe/profile frame_1'; }
    _getAvatarFrameIndex(value: any) { return Number(String(value || '').match(/(\d+)$/)?.[1] || 9999); }
    _makeAssetItem(frame: SpriteFrame, dir: string) { return frame ? { name: frame.name, resPath: `${dir}/${frame.name}`, spriteFrame: frame } : null; }
    _setupAvatarSprite(sprite: Sprite, frame?: SpriteFrame) { if (sprite && frame) sprite.spriteFrame = frame; }
    _setupAvatarNodeSprites(node: Node) { const sprite = node && GameKit.ControllerTable.GetComponent(node, 'icon', Sprite); if (sprite) this._setupAvatarSprite(sprite); }
    _applySelectedAvatar() { this.SetAvatar(GameKit.ControllerTable.GetComponent(this.avatarNode, 'icon', Sprite), this.selectedAvatarName); this.SetAvatarFrame(GameKit.ControllerTable.GetComponent(this.avatarNode, 'frame', Sprite), this.selectedAvatarFrameName); }
    bindGiftBubbleOutsideTouch() { this.node.off(Node.EventType.TOUCH_END, this.onGiftOutsideTouch, this, true); this.node.on(Node.EventType.TOUCH_END, this.onGiftOutsideTouch, this, true); }
    bindGiftBubbleTouch(bubble: Node) { bubble?.on(Node.EventType.TOUCH_END, this.stopGiftBubbleTouchPropagation, this); }
    stopGiftBubbleTouchPropagation(event: any) { event?.stopPropagation?.(); }
    onGiftBubbleOutsideTouchEnd(event: any) { this.onGiftOutsideTouch(event); }
    isGiftBubbleTouchTarget(target: Node) { for (let node = target; node; node = node.parent) if (node === this.giftChest || node === this.giftBubble) return true; return false; }
    isWorldPosInNode(node: Node, worldPos: any) { return !!node?.getComponent(UITransform)?.getBoundingBoxToWorld().contains(worldPos); }
    getOrCreateGiftRewardBubble() { if (!this.giftBubble) { this.giftBubble = new Node('avatar-gift-reward-bubble'); this.giftBubble.parent = this.giftRewardsLayout; } return this.giftBubble; }
    getOrCreateGiftBubbleRewardNode(bubble: Node, index: number) { return bubble?.children[index] || null; }
    setupGiftBubbleRewardDisplay(rewardNode: Node) {
        if (!rewardNode) return;
        (rewardNode.getComponent(UITransform) || rewardNode.addComponent(UITransform))
            .setContentSize(BUBBLE_REWARD_SIZE, BUBBLE_REWARD_SIZE);

        const iconNode = rewardNode.getChildByName('icon');
        if (!iconNode) return;
        iconNode.setPosition(0, 0);
        const fitSize: any = iconNode.getComponent('SpriteFitSize');
        if (fitSize) {
            fitSize.type = 3;
            fitSize.maxSize = new Vec2(BUBBLE_REWARD_SIZE, BUBBLE_REWARD_SIZE);
            fitSize.updateSize?.();
        }

        const countNode = iconNode.getChildByName('text-count');
        if (!countNode) return;
        (countNode.getComponent(UITransform) || countNode.addComponent(UITransform))
            .setContentSize(BUBBLE_COUNT_WIDTH, BUBBLE_COUNT_HEIGHT);
        countNode.setPosition(0, BUBBLE_COUNT_Y);
        const countLabel = countNode.getComponent(Label);
        if (countLabel) {
            countLabel.fontSize = BUBBLE_COUNT_FONT_SIZE;
            countLabel.lineHeight = BUBBLE_COUNT_HEIGHT;
        }
        const countOutline = countNode.getComponent(LabelOutline);
        if (countOutline) countOutline.width = BUBBLE_COUNT_OUTLINE_WIDTH;
    }
    layoutGiftRewardBubble(rewards: any[], _bubble?: Node) { this.giftRewards = this.getVisibleGiftRewards(rewards); this.showGiftRewardBubble(); }
    setGiftRewardBubblePosition(bubble: Node, target: Node) { if (bubble && target) bubble.setPosition(target.position.x, target.position.y - 82); }
    setupGiftChestDisplay(chest: Node) {
        if (!chest) return;
        chest.active = this.giftRewards.length > 0;
        const icon = chest.getChildByName('icon')?.getComponent(Sprite);
        if (icon) icon.spriteFrame = this.giftIconSpriteFrame;
    }
    setupGiftChestDot(chest: Node) {
        if (!chest) return;
        let dot = chest.getChildByName('avatar-gift-dot');
        if (!dot) {
            dot = new Node('avatar-gift-dot');
            dot.parent = chest;
            dot.addComponent(Sprite);
            const labelNode = new Node('Label');
            labelNode.parent = dot;
            labelNode.addComponent(UITransform).setContentSize(GIFT_DOT_SIZE, GIFT_DOT_SIZE);
            const label = labelNode.addComponent(Label);
            label.string = '!';
            label.fontSize = 20;
            label.lineHeight = 20;
            label.color = Color.WHITE;
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
        }
        dot.active = true;
        (dot.getComponent(UITransform) || dot.addComponent(UITransform)).setContentSize(GIFT_DOT_SIZE, GIFT_DOT_SIZE);
        dot.setPosition(20, 20);
        dot.setSiblingIndex(chest.children.length - 1);
        const sprite = dot.getComponent(Sprite);
        if (sprite) { sprite.sizeMode = Sprite.SizeMode.CUSTOM; sprite.trim = false; if (this.giftDotSpriteFrame) sprite.spriteFrame = this.giftDotSpriteFrame; }
        const label = dot.getChildByName('Label')?.getComponent(Label);
        if (label) { label.string = '!'; if (this.giftDotFont) label.font = this.giftDotFont; }
    }
    setupGiftRewardBubble(bubble: Node) { this.bindGiftBubbleTouch(bubble); }
    loadGiftBubbleSpriteFrames() {
        if (this.giftBubbleLoading) return;
        this.giftBubbleLoading = true;
        const load = (url: string, apply: (frame: SpriteFrame) => void) => resources.load(url, SpriteFrame, (error, frame) => {
            if (!error && frame) apply(frame);
        });
        load(GIFT_ICON, frame => { this.giftIconSpriteFrame = frame; if (this.giftChest) this.setupGiftChestDisplay(this.giftChest); });
        load(GIFT_DOT, frame => { this.giftDotSpriteFrame = frame; if (this.giftChest) this.setupGiftChestDot(this.giftChest); });
        load(BUBBLE_BG, frame => { this.giftBubbleBg = frame; if (this.giftBubble) this.setupGiftRewardBubble(this.giftBubble); });
        load(BUBBLE_ARROW, frame => { this.giftBubbleArrow = frame; if (this.giftBubble) this.setupGiftRewardBubble(this.giftBubble); });
    }
    loadGiftDotFont() {
        if (this.giftDotFont || this.giftDotFontLoading) return;
        this.giftDotFontLoading = true;
        const loadFromBundle = (bundle: any) => bundle?.load(GIFT_DOT_FONT, Font, (error: Error | null, font: Font) => {
            if (error || !font) return;
            this.giftDotFont = font;
            const label = this.giftChest?.getChildByName('avatar-gift-dot')?.getChildByName('Label')?.getComponent(Label);
            if (label) label.font = font;
        });
        const bundle = assetManager.getBundle(GIFT_DOT_FONT_BUNDLE);
        if (bundle) loadFromBundle(bundle);
        else assetManager.loadBundle(GIFT_DOT_FONT_BUNDLE, (error, loadedBundle) => { if (!error) loadFromBundle(loadedBundle); });
    }
    setBubbleSpriteFrameInsets(frame: SpriteFrame) {
        if (!frame || (frame as any)._avatarWindowInsetReady) return;
        (frame as any)._avatarWindowInsetReady = true;
        frame.insetLeft = BUBBLE_BORDER;
        frame.insetRight = BUBBLE_BORDER;
        frame.insetTop = BUBBLE_BORDER;
        frame.insetBottom = BUBBLE_BORDER;
    }

    onEditNameBegin() {
        if (!this.editNameInput || !this.nameLabel) return;
        this.editNameInput.string = this.nameLabel.string;
        this.nameLabel.node.active = false;
    }

    onEditNameEnd() {
        if (!this.editNameInput || !this.nameLabel) return;
        if (this.editNameInput.string.length > 0) {
            this.nameLabel.string = this.editNameInput.string;
        } else {
            console.log('璇疯緭鍏ュ悕瀛?');
        }
        this.nameLabel.node.active = true;
        this.editNameInput.string = '';
        this.setNodeOpacity(this.editNameInput.node, 0);
    }

    onClickSave() {
        this.saveAvatarInfo();
    }

    saveAvatarInfo() {
        let avatarInfo = this.selectedAvatarName + ';' + this.selectedAvatarFrameName;
        let sr = SR.SRUserData.saveAvatarInfo(avatarInfo, this.nameLabel ? this.nameLabel.string : '');
        sr.SetCallBack(function(res: any) {
            Game.SUser.updateData(res);
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.UserInfoEvent);
            console.log('saveAvatarInfo', res);
        });
        sr.Send();
    }

    private setupGiftRewardChest(rewards: any[]) {
        if (!this.giftRewardsLayout) return;
        this.giftRewards = (rewards || []).filter(Boolean).slice(0, 3);
        this.giftChest = this.giftRewardsLayout.children[0] || null;
        if (!this.giftChest) return;
        this.setupGiftChestDisplay(this.giftChest);
        this.setupGiftChestDot(this.giftChest);
        this.loadGiftBubbleSpriteFrames();
        this.loadGiftDotFont();
        this.giftRewardsLayout.children.forEach((child, index) => { if (index > 0) child.active = false; });
        this.giftChest.targetOff(this);
        this.giftChest.on(Node.EventType.TOUCH_END, this.onGiftChestTouch, this);
        this.node.off(Node.EventType.TOUCH_END, this.onGiftOutsideTouch, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onGiftOutsideTouch, this, true);
    }

    private onGiftChestTouch(event: any) {
        event?.stopPropagation?.();
        if (this.giftBubble?.active) this.hideGiftRewardBubble();
        else this.showGiftRewardBubble();
    }

    private showGiftRewardBubble() {
        if (!this.giftRewardsLayout || !this.giftChest || !this.giftRewards.length) return;
        if (!this.giftBubble) {
            this.giftBubble = new Node('avatar-gift-reward-bubble');
            this.giftBubble.parent = this.giftRewardsLayout;
        }
        this.giftBubble.removeAllChildren();
        const template = this.giftRewardsLayout.children.find(child => child !== this.giftChest && child.getComponent('ContentModel'));
        this.giftRewards.forEach((reward, index) => {
            if (!template) return;
            const item = instantiate(template);
            item.parent = this.giftBubble;
            item.active = true;
            item.setPosition((index - (this.giftRewards.length - 1) / 2) * 68, 0);
            (item.getComponent('ContentModel') as any)?.show(reward, { infoBtnParams: { canTouch: false, showInfoBtn: true } });
            this.setupGiftBubbleRewardDisplay(item);
        });
        this.giftBubble.setPosition(this.giftChest.position.x, this.giftChest.position.y - 82);
        this.giftBubble.active = true;
    }

    private hideGiftRewardBubble() { if (this.giftBubble) this.giftBubble.active = false; }
    private onGiftOutsideTouch(event: any) {
        if (!this.giftBubble?.active || event?.target === this.giftChest || event?.target === this.giftBubble) return;
        this.hideGiftRewardBubble();
    }

    /**
     * Web 鍏滃簳锛氶殣钘?textarea + execCommand('copy')
     * @param {string} text
     * @returns {boolean}
     */
    _copyTextExecCommand(text: string) {
        if (typeof document === 'undefined') return false;
        try {
            let ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', 'readonly');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, text.length);
            let ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (e) {
            return false;
        }
    }

    /**
     * @param {string} text
     * @param {function(boolean)} [done] 鏄惁澶嶅埗鎴愬姛
     */
    _copyTextToClipboard(text: any, done?: any) {
        if (text == null || text === '') {
            if (done) done(false);
            return;
        }
        text = String(text);
        let clipboard = (sys as any).clipboard;
        if ((sys as any).isNative && clipboard && typeof clipboard.setString === 'function') {
            clipboard.setString(text);
            if (done) done(true);
            return;
        }
        if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(function() {
                if (done) done(true);
            }).catch(function(this: AvatarWindow) {
                if (this._copyTextExecCommand(text)) {
                    if (done) done(true);
                } else {
                    if (done) done(false);
                }
            }.bind(this));
            return;
        }
        if (this._copyTextExecCommand(text)) {
            if (done) done(true);
        } else {
            if (done) done(false);
        }
    }

    onClickCopyId() {
        let idStr = this.showParams && this.showParams.user
            ? String(this.showParams.user.Id())
            : (this.idLabel ? this.idLabel.string.replace(/^ID\s*:/i, '').trim() : '');
        this._copyTextToClipboard(idStr, function(ok: boolean) {
            if (ok) {
                console.log('宸插鍒?ID:', idStr);
            } else {
                console.warn('澶嶅埗 ID 澶辫触');
            }
        });
    }

    close_window() {
        this.hideGiftRewardBubble();
        this.node.off(Node.EventType.TOUCH_END, this.onGiftOutsideTouch, this, true);
        this.giftChest?.off(Node.EventType.TOUCH_END, this.onGiftChestTouch, this);
        this.closeAnim();
    }

    private setNodeOpacity(node: Node, opacity: number) {
        let uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        uiOpacity.opacity = opacity;
    }
}
