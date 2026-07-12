import { UIWindow } from '../../GameKit/ui/UIWindow';
import { RandomChestPanel } from '../Item/RandomChestPanel';
import {
    _decorator,
    BlockInputEvents,
    Button,
    Color,
    instantiate,
    Label,
    Node,
    Size,
    Sprite,
    SpriteFrame,
    tween,
    Tween,
    UIOpacity,
    UITransform,
    Vec3,
    sp,
} from 'cc';

const { ccclass, property } = _decorator;

const C = {
    FAKE_DATA: false,
    MONTH_DAYS: 28,
    BAR_MIN: 0,
    BAR_MAX: 360,
    MONTH_BUBBLE_BG: 'QuestCenterWindow/SignWindow/sign_btn_white',
    MONTH_BUBBLE_ARROW: 'QuestCenterWindow/SignWindow/sanjiao',
    MONTH_BUBBLE_WIDTH_ONE: 126,
    MONTH_BUBBLE_WIDTH_TWO: 186,
    MONTH_BUBBLE_HEIGHT: 82,
    MONTH_BUBBLE_OFFSET_Y: -62,
    MONTH_BUBBLE_BORDER: 24,
    MONTH_BUBBLE_REWARD_Y: -35,
    REWARD_FLOAT_SCALE: 0.6,
    REWARD_FLOAT_MOVE_Y: 75,
    REWARD_FLOAT_GAP: 56,
    REWARD_FLOAT_DURATION: 0.8,
    DEBUG_SIGN_MONTH_DAY: null,
};

const monthDays = [8, 15, 22, 28];
const legacyMonthDays = [7, 14, 21, 28];

@ccclass('SignWindow')
export default class SignWindow extends UIWindow {
    static windowPath = 'Quest/SignWindow';

    @property([Node])
    month_box: Node[] = [];

    @property(Node)
    month_pb: Node | null = null;

    @property(Node)
    month_StartSp: Node | null = null;

    @property([Node])
    week_box: Node[] = [];

    @property(Button)
    btn: Button | null = null;

    @property(Label)
    totalLab: Label | null = null;

    data: any = null;
    needSign = false;

    private _clickTxNode: Node | null = null;
    private _monthBubbleOutsideTouchBinded = false;
    private _monthBubbleLoading = false;
    private _monthBubbleBg: SpriteFrame | null = null;
    private _monthBubbleArrow: SpriteFrame | null = null;
    private _monthRewardBubbleNode: Node | null = null;
    private _currentMonthBubbleTarget: Node | null = null;
    private _weekDayLabelDefaultColors = new WeakMap<Node, Color>();

    onLoad() {
        this.hideClickTx();
        this.hideAllClaimedNodes();
        this.bindMonthBubbleOutsideTouch();
    }

    onShow() {
        this.hideClickTx();
        this.hideAllClaimedNodes();
        this.hideMonthRewardBubbles();
        this.loadMonthBubbleSpriteFrames();
        if (C.FAKE_DATA) console.warn('SignWindow is using fake data');
        this.get_data().then((v: any) => {
            if (!this.node) return;
            v = this.applyDebugSignData(v);
            this.node.active = true;
            this.needSign = v.signWeekRewards < v.signWeekDay;
            this.update_page(v);
        }, () => {});
    }

    getClickTxNode() {
        if (!this._clickTxNode && this.node) {
            this._clickTxNode = this.node.getChildByName('ClickTx');
            this.setupClickTxNode(this._clickTxNode);
        }
        return this._clickTxNode;
    }

    setupClickTxNode(clickTx: Node | null) {
        if (!clickTx || (clickTx as any)._signWindowClickTxReady) return;
        (clickTx as any)._signWindowClickTxReady = true;
        const button = clickTx.getComponent(Button);
        if (button) button.enabled = false;
        const blockInput = clickTx.getComponent(BlockInputEvents);
        if (blockInput) blockInput.enabled = false;
        clickTx.off(Node.EventType.TOUCH_START);
        clickTx.off(Node.EventType.TOUCH_MOVE);
        clickTx.off(Node.EventType.TOUCH_END);
        clickTx.off(Node.EventType.TOUCH_CANCEL);
    }

    getWeekDayLabelDefaultColor(label: Label) {
        let color = this._weekDayLabelDefaultColors.get(label.node);
        if (!color) {
            const labelColor = label.color;
            color = new Color(labelColor.r, labelColor.g, labelColor.b, labelColor.a);
            this._weekDayLabelDefaultColors.set(label.node, color);
        }
        return color;
    }

    setWeekDayLabelColor(label: Label, claimed: boolean) {
        if (claimed) {
            label.color = new Color(180, 180, 180);
            return;
        }
        const color = this.getWeekDayLabelDefaultColor(label);
        label.color = new Color(color.r, color.g, color.b, color.a);
    }

    getWeekClickTxNode(index: number) {
        const box = this.week_box && this.week_box[index];
        if (!box) return null;
        const clickTx = box.getChildByName('ClickTx');
        this.setupClickTxNode(clickTx);
        return clickTx;
    }

    hideClickTx() {
        const clickTx = this.getClickTxNode();
        if (clickTx) clickTx.active = false;
        if (!this.week_box) return;
        for (let i = 0; i < this.week_box.length; i += 1) {
            const weekClickTx = this.getWeekClickTxNode(i);
            if (weekClickTx) weekClickTx.active = false;
        }
    }

    getClickTxClaimIndex() {
        if (!this.data || !this.week_box || this.data.signWeekDay <= this.data.signWeekRewards) return -1;
        const weekDay = Number(this.data.signWeekDay);
        if (Number.isFinite(weekDay) && weekDay > 0) return Math.min(this.week_box.length - 1, weekDay - 1);
        const currentDay = Number(this.data.signMonthDay);
        if (!Number.isFinite(currentDay) || currentDay <= 0) return -1;
        return (Math.max(1, currentDay) - 1) % this.week_box.length;
    }

    updateClickTx() {
        this.hideClickTx();
        const index = this.getClickTxClaimIndex();
        const clickTx = this.getWeekClickTxNode(index);
        if (!clickTx) return;
        clickTx.active = true;
        if (clickTx.parent) clickTx.setSiblingIndex(clickTx.parent.children.length - 1);
        const skeleton = clickTx.getComponent(sp.Skeleton);
        if (skeleton) {
            skeleton.paused = false;
            if (skeleton.animation !== 'QianDao_tx') {
                skeleton.setAnimation(0, 'QianDao_tx', true);
            }
        }
    }

    hideAllClaimedNodes() {
        if (!this.week_box) return;
        for (let i = 0; i < this.week_box.length; i += 1) {
            const box = this.week_box[i];
            if (!box) continue;
            this.setClaimedNode(box.getChildByName('Claimed'), false);
        }
    }

    setClaimedNode(node: Node | null, show: boolean, withAnim = false) {
        if (!node) return;
        Tween.stopAllByTarget(node);
        node.active = show;
        const opacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        opacity.opacity = show ? 255 : 0;
        if (!show) {
            node.setScale(0, 0, node.scale.z);
            return;
        }
        if (!withAnim) {
            node.setScale(1, 1, node.scale.z);
            return;
        }
        node.setScale(0.2, 0.2, node.scale.z);
        opacity.opacity = 0;
        tween(opacity).to(0.18, { opacity: 255 }).start();
        tween(node)
            .to(0.18, { scale: new Vec3(1.2, 1.2, node.scale.z) }, { easing: 'backOut' })
            .to(0.12, { scale: new Vec3(0.96, 0.96, node.scale.z) }, { easing: 'quadOut' })
            .to(0.1, { scale: new Vec3(1, 1, node.scale.z) }, { easing: 'quadOut' })
            .start();
    }

    setMonthDotNode(node: Node | null, show: boolean, withAnim = false) {
        if (!node) return;
        if (!show) {
            Tween.stopAllByTarget(node);
            node.active = false;
            node.setScale(1, 1, node.scale.z);
            const opacity = node.getComponent(UIOpacity);
            if (opacity) opacity.opacity = 255;
            return;
        }
        const needAnim = withAnim && !node.active;
        node.active = true;
        if (!needAnim) {
            node.setScale(1, 1, node.scale.z);
            return;
        }
        Tween.stopAllByTarget(node);
        node.setScale(0.2, 0.2, node.scale.z);
        tween(node).to(0.12, { scale: new Vec3(1, 1, node.scale.z) }, { easing: 'quadOut' }).start();
    }

    getMonthDotNode(monthBox: Node | null) {
        if (!monthBox) return null;
        const dot = monthBox.getChildByName('quest-30dayBar-dot');
        if (dot) return dot;
        return GameKit.ControllerTable.GetNode(monthBox, 'dotComp');
    }

    bindMonthBubbleOutsideTouch() {
        if (!this.node || this._monthBubbleOutsideTouchBinded) return;
        this._monthBubbleOutsideTouchBinded = true;
        this.node.on(Node.EventType.TOUCH_END, this.onMonthBubbleOutsideTouchEnd, this, true);
    }

    onMonthBubbleOutsideTouchEnd(e: any) {
        if (!this._monthRewardBubbleNode || !this._monthRewardBubbleNode.active) return;
        if (this.isMonthBoxTouchTarget(e ? e.target : null)) return;
        const pos = e && e.getLocation ? e.getLocation() : null;
        if (pos && this.isWorldPosInNode(this._monthRewardBubbleNode, pos)) return;
        this.hideMonthRewardBubbles(null, true);
    }

    isMonthBoxTouchTarget(target: any) {
        if (!target || !this.month_box) return false;
        for (let i = 0; i < this.month_box.length; i += 1) {
            const box = this.month_box[i];
            let node = target;
            while (node) {
                if (node === box) return true;
                node = node.parent;
            }
        }
        return false;
    }

    isWorldPosInNode(node: Node | null, worldPos: any) {
        const transform = node ? node.getComponent(UITransform) : null;
        if (!node || !node.activeInHierarchy || !transform || !worldPos) return false;
        return transform.getBoundingBoxToWorld().contains(worldPos);
    }

    loadMonthBubbleSpriteFrames() {
        if (this._monthBubbleLoading) return;
        this._monthBubbleLoading = true;
        cce.loadRes(C.MONTH_BUBBLE_BG, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            if (!err && spriteFrame) {
                this._monthBubbleBg = spriteFrame;
                this.refreshMonthBubbleSpriteFrames();
            }
        });
        cce.loadRes(C.MONTH_BUBBLE_ARROW, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            if (!err && spriteFrame) {
                this._monthBubbleArrow = spriteFrame;
                this.refreshMonthBubbleSpriteFrames();
            }
        });
    }

    refreshMonthBubbleSpriteFrames() {
        if (!this.month_box) return;
        for (let i = 0; i < this.month_box.length; i += 1) {
            const bubble = GameKit.ControllerTable.GetNode(this.month_box[i], 'bubble-award');
            this.setupMonthRewardBubble(bubble);
        }
        this.setupMonthRewardBubble(this._monthRewardBubbleNode);
    }

    setupMonthRewardBubble(bubble: Node | null) {
        if (!bubble) return;
        const transform = bubble.getComponent(UITransform) || bubble.addComponent(UITransform);
        transform.setAnchorPoint(0.5, 1);
        if (!transform.width || !transform.height) {
            transform.setContentSize(C.MONTH_BUBBLE_WIDTH_TWO, C.MONTH_BUBBLE_HEIGHT);
        }
        const opacity = bubble.getComponent(UIOpacity) || bubble.addComponent(UIOpacity);
        opacity.opacity = 255;

        const bg = bubble.getComponent(Sprite) || bubble.addComponent(Sprite);
        bg.type = Sprite.Type.SLICED;
        bg.sizeMode = Sprite.SizeMode.CUSTOM;
        if (this._monthBubbleBg) {
            this.setMonthBubbleSpriteFrameInsets(this._monthBubbleBg);
            bg.spriteFrame = this._monthBubbleBg;
        }

        const reward1 = bubble.getChildByName('reward1');
        const reward2 = bubble.getChildByName('reward2');
        let arrow = bubble.getChildByName('bubble-arrow');
        if (!arrow) {
            arrow = new Node('bubble-arrow');
            arrow.parent = bubble;
            arrow.addComponent(Sprite);
            arrow.addComponent(UITransform);
        }
        const arrowTransform = arrow.getComponent(UITransform) || arrow.addComponent(UITransform);
        arrowTransform.setAnchorPoint(0.5, 0.5);
        arrowTransform.setContentSize(36, 26);
        arrow.setPosition(0, 6, arrow.position.z);
        arrow.active = true;

        const arrowSprite = arrow.getComponent(Sprite) || arrow.addComponent(Sprite);
        arrowSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        if (this._monthBubbleArrow) arrowSprite.spriteFrame = this._monthBubbleArrow;
        if (reward1) reward1.setSiblingIndex(1);
        if (reward2) reward2.setSiblingIndex(2);
        arrow.setSiblingIndex(3);
        this.bindMonthBubbleTouch(bubble);
    }

    bindMonthBubbleTouch(bubble: Node | null) {
        if (!bubble || (bubble as any)._signWindowTouchBinded) return;
        (bubble as any)._signWindowTouchBinded = true;
        bubble.on(Node.EventType.TOUCH_START, this.stopMonthBubbleTouchPropagation, this);
        bubble.on(Node.EventType.TOUCH_END, this.stopMonthBubbleTouchPropagation, this);
        bubble.on(Node.EventType.TOUCH_CANCEL, this.stopMonthBubbleTouchPropagation, this);
    }

    stopMonthBubbleTouchPropagation(e: any) {
        if (e && e.stopPropagation) e.stopPropagation();
    }

    setMonthBubbleSpriteFrameInsets(spriteFrame: SpriteFrame | null) {
        const frame = spriteFrame as any;
        if (!frame || frame._signWindowInsetReady) return;
        frame._signWindowInsetReady = true;
        if (frame.setInsetLeft) {
            frame.setInsetLeft(C.MONTH_BUBBLE_BORDER);
            frame.setInsetRight(C.MONTH_BUBBLE_BORDER);
            frame.setInsetTop(C.MONTH_BUBBLE_BORDER);
            frame.setInsetBottom(C.MONTH_BUBBLE_BORDER);
            return;
        }
        if (frame.insetLeft !== undefined) {
            frame.insetLeft = C.MONTH_BUBBLE_BORDER;
            frame.insetRight = C.MONTH_BUBBLE_BORDER;
            frame.insetTop = C.MONTH_BUBBLE_BORDER;
            frame.insetBottom = C.MONTH_BUBBLE_BORDER;
        }
    }

    getVisibleMonthRewards(rewards: any[]) {
        const visibleRewards: any[] = [];
        if (!rewards) return visibleRewards;
        for (let i = 0; i < rewards.length && visibleRewards.length < 2; i += 1) {
            if (rewards[i]) visibleRewards.push(rewards[i]);
        }
        return visibleRewards;
    }

    getMonthBoxDay(target: Node | null, days: any) {
        const day = Number.parseInt(days);
        if (monthDays.indexOf(day) >= 0) return day;

        if (target && this.month_box) {
            const index = this.month_box.indexOf(target);
            if (index >= 0 && monthDays[index]) return monthDays[index];
        }

        const legacyIndex = legacyMonthDays.indexOf(day);
        if (legacyIndex >= 0 && monthDays[legacyIndex]) return monthDays[legacyIndex];
        return day;
    }

    getMonthRewardMeta(days: any) {
        const meta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days);
        if (!meta) console.warn('SignWindow month reward config missing:', days);
        return meta;
    }

    pushUnique(array: any[], value: any) {
        if (!array) return;
        if (array.indexOf(value) < 0) array.push(value);
    }

    setMonthBoxDayText(monthBox: Node | null, days: any) {
        if (!monthBox) return;
        const bubble = GameKit.ControllerTable.GetNode(monthBox, 'quest-bubble');
        if (!bubble) return;
        const labelNode = bubble.getChildByName('text');
        const label = labelNode ? labelNode.getComponent(Label) : null;
        if (label) label.string = String(days);
    }

    layoutMonthRewardBubble(rewards: any[], reward1: any, reward2: any, bubble: Node | null = null) {
        if (!reward1 || !reward1.node) return;
        const visibleRewards = this.getVisibleMonthRewards(rewards);
        const hasReward1 = !!visibleRewards[0];
        const hasReward2 = !!visibleRewards[1];
        const width = hasReward2 ? C.MONTH_BUBBLE_WIDTH_TWO : C.MONTH_BUBBLE_WIDTH_ONE;
        if (bubble) {
            const transform = bubble.getComponent(UITransform) || bubble.addComponent(UITransform);
            transform.setContentSize(width, C.MONTH_BUBBLE_HEIGHT);
            const bg = bubble.getComponent(Sprite);
            if (bg) bg.sizeMode = Sprite.SizeMode.CUSTOM;
        }
        reward1.node.active = hasReward1;
        if (reward2 && reward2.node) reward2.node.active = hasReward2;

        if (hasReward1 && hasReward2) {
            reward1.node.setPosition(-42, C.MONTH_BUBBLE_REWARD_Y, reward1.node.position.z);
            reward2.node.setPosition(42, C.MONTH_BUBBLE_REWARD_Y, reward2.node.position.z);
        } else {
            reward1.node.setPosition(0, C.MONTH_BUBBLE_REWARD_Y, reward1.node.position.z);
        }
    }

    hideMonthRewardBubbleNode(bubble: Node | null, withAnim = false) {
        if (!bubble || !bubble.active) return;
        Tween.stopAllByTarget(bubble);
        const opacity = bubble.getComponent(UIOpacity) || bubble.addComponent(UIOpacity);
        Tween.stopAllByTarget(opacity);
        if (!withAnim) {
            bubble.active = false;
            opacity.opacity = 255;
            bubble.setScale(1, 1, bubble.scale.z);
            return;
        }
        tween(opacity).to(0.12, { opacity: 0 }).start();
        tween(bubble)
            .to(0.12, { scale: new Vec3(0.92, 0.92, bubble.scale.z) }, { easing: 'quadIn' })
            .call(() => {
                bubble.active = false;
                opacity.opacity = 255;
                bubble.setScale(1, 1, bubble.scale.z);
            })
            .start();
    }

    hideMonthRewardBubbles(exceptBubble: Node | null = null, withAnim = false) {
        if (!this.month_box) return;
        if (this._monthRewardBubbleNode && this._monthRewardBubbleNode !== exceptBubble) {
            this.hideMonthRewardBubbleNode(this._monthRewardBubbleNode, withAnim);
            this._currentMonthBubbleTarget = null;
        }
        for (let i = 0; i < this.month_box.length; i += 1) {
            const bubble = GameKit.ControllerTable.GetNode(this.month_box[i], 'bubble-award');
            if (!bubble || bubble === exceptBubble) continue;
            this.hideMonthRewardBubbleNode(bubble, false);
        }
    }

    getMonthBubbleTemplate() {
        if (!this.month_box) return null;
        for (let i = 0; i < this.month_box.length; i += 1) {
            const bubble = GameKit.ControllerTable.GetNode(this.month_box[i], 'bubble-award');
            if (bubble) return bubble;
        }
        return null;
    }

    getOrCreateMonthRewardBubble() {
        if (this._monthRewardBubbleNode && this._monthRewardBubbleNode.isValid) {
            if (this._monthRewardBubbleNode.parent) {
                this._monthRewardBubbleNode.setSiblingIndex(this._monthRewardBubbleNode.parent.children.length - 1);
            }
            return this._monthRewardBubbleNode;
        }
        const template = this.getMonthBubbleTemplate();
        if (!template) return null;
        const bubble = instantiate(template);
        bubble.name = 'month-reward-bubble';
        bubble.parent = this.node;
        bubble.active = false;
        bubble.setSiblingIndex(bubble.parent.children.length - 1);
        this._monthRewardBubbleNode = bubble;
        this.setupMonthRewardBubble(bubble);
        return bubble;
    }

    setMonthRewardBubblePosition(bubble: Node | null, target: Node | null) {
        if (!bubble || !target || !bubble.parent) return;
        const targetTransform = target.getComponent(UITransform);
        const parentTransform = bubble.parent.getComponent(UITransform);
        const bubbleTransform = bubble.getComponent(UITransform);
        if (!targetTransform || !parentTransform || !bubbleTransform) return;

        const worldPos = targetTransform.convertToWorldSpaceAR(Vec3.ZERO);
        const localPos = parentTransform.convertToNodeSpaceAR(worldPos);
        let bubbleX = localPos.x;
        if (parentTransform.width > bubbleTransform.width + 24) {
            const minX = -parentTransform.anchorX * parentTransform.width + bubbleTransform.width / 2 + 12;
            const maxX = (1 - parentTransform.anchorX) * parentTransform.width - bubbleTransform.width / 2 - 12;
            bubbleX = Math.max(minX, Math.min(maxX, bubbleX));
        }
        bubble.setPosition(bubbleX, localPos.y + C.MONTH_BUBBLE_OFFSET_Y, bubble.position.z);
        const arrow = bubble.getChildByName('bubble-arrow');
        if (arrow) arrow.setPosition(localPos.x - bubbleX, arrow.position.y, arrow.position.z);
    }

    showMonthRewardBubble(bubble: Node | null) {
        if (!bubble) return;
        this.setupMonthRewardBubble(bubble);
        Tween.stopAllByTarget(bubble);
        const opacity = bubble.getComponent(UIOpacity) || bubble.addComponent(UIOpacity);
        Tween.stopAllByTarget(opacity);
        bubble.active = true;
        opacity.opacity = 0;
        bubble.setScale(0.82, 0.82, bubble.scale.z);
        tween(opacity).to(0.12, { opacity: 255 }).start();
        tween(bubble)
            .to(0.14, { scale: new Vec3(1.05, 1.05, bubble.scale.z) }, { easing: 'backOut' })
            .to(0.08, { scale: new Vec3(1, 1, bubble.scale.z) }, { easing: 'quadOut' })
            .start();
    }

    showMonthRewardBubbleByTarget(target: Node | null, rewards: any[]) {
        const bubble = this.getOrCreateMonthRewardBubble();
        if (!bubble) return;
        const visibleRewards = this.getVisibleMonthRewards(rewards);
        const reward1 = bubble.getChildByName('reward1');
        const reward2 = bubble.getChildByName('reward2');
        const reward1Comp = reward1 ? reward1.getComponent('ContentModel') : null;
        const reward2Comp = reward2 ? reward2.getComponent('ContentModel') : null;
        if (reward1Comp && visibleRewards[0]) reward1Comp.show(visibleRewards[0]);
        if (reward2Comp && visibleRewards[1]) reward2Comp.show(visibleRewards[1]);
        this.layoutMonthRewardBubble(visibleRewards, reward1Comp, reward2Comp, bubble);
        this._currentMonthBubbleTarget = target;
        this.showMonthRewardBubble(bubble);
        this.setMonthRewardBubblePosition(bubble, target);
    }

    applyDebugSignData(data: any) {
        if (!C.FAKE_DATA || !data || C.DEBUG_SIGN_MONTH_DAY == null) return data;
        let debugDay = Number(C.DEBUG_SIGN_MONTH_DAY);
        if (!Number.isFinite(debugDay)) return data;
        debugDay = Math.max(0, Math.min(C.MONTH_DAYS, Math.floor(debugDay)));
        data.signMonthDay = debugDay;

        const weekLength = this.week_box && this.week_box.length > 0 ? this.week_box.length : 7;
        const signedWeekDay = debugDay % weekLength;
        data.signWeekRewards = signedWeekDay;
        data.signWeekDay = signedWeekDay + 1;

        if (!data.signMonthRewards) data.signMonthRewards = [];
        return data;
    }

    getAwardValueStyle(contentModel: any) {
        if (!contentModel || !contentModel.countWithColor || !contentModel.countWithColor.node) return null;
        const label = contentModel.countWithColor;
        const node = label.node;
        const nodeTransform = node.getComponent(UITransform);
        return {
            position: node.position.clone(),
            scale: node.scale.clone(),
            color: node.color ? node.color.clone() : null,
            width: nodeTransform ? nodeTransform.width : 0,
            height: nodeTransform ? nodeTransform.height : 0,
            fontSize: label.fontSize,
            lineHeight: label.lineHeight,
            horizontalAlign: label.horizontalAlign,
            verticalAlign: label.verticalAlign,
            overflow: label.overflow,
            enableWrapText: label.enableWrapText,
            outlineEnabled: label.enableOutline,
            outlineColor: label.outlineColor ? label.outlineColor.clone() : null,
            outlineWidth: label.outlineWidth,
        };
    }

    restoreAwardValueStyle(contentModel: any, style: any) {
        if (!style || !contentModel || !contentModel.countWithColor || !contentModel.countWithColor.node) return;
        const label = contentModel.countWithColor;
        const node = label.node;
        const twoColor = node.getComponent('LabelTwoColor');
        if (twoColor) {
            twoColor.enabled = false;
            twoColor.destroy();
        }
        const twoColorChild = node.getChildByName('_TwoColor_child');
        if (twoColorChild) twoColorChild.destroy();
        node.setPosition(style.position);
        node.setScale(style.scale);
        if (style.color) node.color = style.color.clone();
        const nodeTransform = node.getComponent(UITransform) || node.addComponent(UITransform);
        nodeTransform.setContentSize(style.width, style.height);
        label.fontSize = style.fontSize;
        label.lineHeight = style.lineHeight;
        label.horizontalAlign = style.horizontalAlign;
        label.verticalAlign = style.verticalAlign;
        label.overflow = style.overflow;
        label.enableWrapText = style.enableWrapText;
        if (style.outlineEnabled != null) {
            label.enableOutline = style.outlineEnabled;
            if (style.outlineColor) label.outlineColor = style.outlineColor.clone();
            label.outlineWidth = style.outlineWidth;
        }
    }

    showWeekReward(contentModel: any, content: any) {
        if (!contentModel || !content) return;
        const awardValueStyle = this.getAwardValueStyle(contentModel);
        contentModel.show(content);
        this.restoreAwardValueStyle(contentModel, awardValueStyle);
    }

    getRewardFloatTemplate() {
        if (!this.week_box || !this.week_box.length) return null;
        for (let i = 0; i < this.week_box.length; i += 1) {
            const reward = GameKit.ControllerTable.GetNode(this.week_box[i], 'reward');
            if (reward) return reward;
        }
        return null;
    }

    getRewardFloatParent() {
        const root = typeof UIRoot !== 'undefined' && UIRoot.instance && UIRoot.instance.node ? UIRoot.instance.node : null;
        if (root && root.getComponent(UITransform)) return root;
        return this.node;
    }

    getRewardFloatSourceNode(sourceNode: Node | null) {
        if (!sourceNode) return null;
        let rewardNode: Node | null = null;
        if (sourceNode.getChildByName) {
            rewardNode = sourceNode.getChildByName('reward') || sourceNode.getChildByName('reward1');
        }
        if (!rewardNode) {
            rewardNode = GameKit.ControllerTable.GetNode(sourceNode, 'reward') || GameKit.ControllerTable.GetNode(sourceNode, 'reward1');
        }
        return rewardNode || sourceNode;
    }

    showRewardFloat(contents: any[], sourceNode: Node | null, onComplete?: () => void) {
        contents = Game.Content.Merge(contents || []);
        if (!contents || contents.length <= 0) {
            if (onComplete) onComplete();
            return;
        }

        const template = this.getRewardFloatTemplate();
        const parent = this.getRewardFloatParent();
        const parentTransform = parent ? parent.getComponent(UITransform) : null;
        const floatSourceNode = this.getRewardFloatSourceNode(sourceNode);
        const sourceTransform = floatSourceNode ? floatSourceNode.getComponent(UITransform) : null;
        if (!template || !parent || !parentTransform || !sourceNode || !sourceTransform) {
            if (onComplete) this.scheduleOnce(onComplete, 0.2);
            return;
        }

        const count = Math.min(3, contents.length);
        const startX = -(count - 1) * C.REWARD_FLOAT_GAP / 2;
        const worldPos = sourceTransform.convertToWorldSpaceAR(Vec3.ZERO);
        const localPos = parentTransform.convertToNodeSpaceAR(worldPos);
        let finished = 0;

        for (let i = 0; i < count; i += 1) {
            const content = Game.Content.FromContent(contents[i]);
            const item = instantiate(template);
            item.name = 'sign-reward-float';
            item.parent = parent;
            item.active = true;
            item.setSiblingIndex(parent.children.length - 1);
            item.setPosition(localPos.x + startX + i * C.REWARD_FLOAT_GAP, localPos.y, item.position.z);
            item.setScale(C.REWARD_FLOAT_SCALE * 0.86, C.REWARD_FLOAT_SCALE * 0.86, item.scale.z);

            const opacity = item.getComponent(UIOpacity) || item.addComponent(UIOpacity);
            opacity.opacity = 0;

            const contentModel = item.getComponent('ContentModel');
            if (contentModel) {
                this.showWeekReward(contentModel, content);
                if (contentModel.icon && contentModel.icon.node) {
                    const iconOpacity = contentModel.icon.node.getComponent(UIOpacity) || contentModel.icon.node.addComponent(UIOpacity);
                    iconOpacity.opacity = 255;
                    contentModel.icon.node.targetOff(contentModel);
                }
                if (contentModel.countWithColor && contentModel.countWithColor.node) {
                    contentModel.countWithColor.node.active = true;
                    const countOpacity = contentModel.countWithColor.node.getComponent(UIOpacity) || contentModel.countWithColor.node.addComponent(UIOpacity);
                    countOpacity.opacity = 255;
                    if (contentModel.countWithColor.string && contentModel.countWithColor.string.indexOf('+') !== 0) {
                        contentModel.countWithColor.string = `+${contentModel.countWithColor.string}`;
                    }
                }
            }

            Tween.stopAllByTarget(item);
            Tween.stopAllByTarget(opacity);
            tween(opacity)
                .to(0.08, { opacity: 255 })
                .delay(0.32)
                .to(C.REWARD_FLOAT_DURATION - 0.4, { opacity: 0 })
                .start();
            tween(item)
                .to(C.REWARD_FLOAT_DURATION, {
                    position: new Vec3(item.position.x, item.position.y + C.REWARD_FLOAT_MOVE_Y, item.position.z),
                }, { easing: 'sineOut' })
                .call(() => {
                    item.destroy();
                    finished += 1;
                    if (finished >= count && onComplete) onComplete();
                })
                .start();
            tween(item)
                .to(0.12, { scale: new Vec3(C.REWARD_FLOAT_SCALE * 1.08, C.REWARD_FLOAT_SCALE * 1.08, item.scale.z) }, { easing: 'backOut' })
                .to(0.16, { scale: new Vec3(C.REWARD_FLOAT_SCALE, C.REWARD_FLOAT_SCALE, item.scale.z) }, { easing: 'sineOut' })
                .start();
        }
    }

    get_data() {
        return new Promise<any>((res) => {
            if (this.data) {
                res(this.data);
                return;
            }
            if (C.FAKE_DATA) {
                res({
                    signWeekDay: 2,
                    signWeekRewards: 1,
                    signMonthDay: 27,
                    signMonthRewards: [7],
                });
            } else {
                res(GameKit.DataCache.GetData('signData'));
            }
        });
    }

    update_page(data: any) {
        this.data = data;
        if (!this.data) return;
        if (!this.data.signMonthRewards) this.data.signMonthRewards = [];

        if (this.needSign) this.data.signMonthDay--;
        if (this.totalLab) this.totalLab.string = String(this.data.signMonthDay);
        this.setMonthProgressWidth(this.getMonthProgressWidth(this.data.signMonthDay));

        for (let i = 0; i < this.month_box.length; i += 1) {
            const monthBox = this.month_box[i];
            const light = GameKit.ControllerTable.GetNode(monthBox, 'light');
            const spBox = GameKit.ControllerTable.GetNode(monthBox, 'sp-box');
            const spBoxSprite = spBox ? spBox.getComponent(Sprite) : null;
            const dotComp = this.getMonthDotNode(monthBox);
            const questBubble = GameKit.ControllerTable.GetNode(monthBox, 'quest-bubble');
            const bubbleAward = GameKit.ControllerTable.GetNode(monthBox, 'bubble-award');
            const reward1 = GameKit.ControllerTable.GetComponent(monthBox, 'reward1', 'ContentModel');
            const reward2 = GameKit.ControllerTable.GetComponent(monthBox, 'reward2', 'ContentModel');
            const spBoxOpen = GameKit.ControllerTable.GetNode(monthBox, 'sp-box_open');
            const days = monthDays[i];
            const received = this.data.signMonthRewards.includes(days) || data.signMonthDay > days;

            if (light) light.active = false;
            this.setupMonthRewardBubble(bubbleAward);
            if (spBoxSprite) this.setSpriteState(spBoxSprite, false);

            if (received) {
                if (spBox) spBox.active = false;
                this.setMonthDotNode(dotComp, true, true);
                if (spBoxOpen) {
                    spBoxOpen.active = true;
                    this.setSpriteState(spBoxOpen.getComponent(Sprite), true);
                }
            } else {
                const canReceive = this.data.signMonthDay >= days;
                if (spBox) {
                    spBox.active = true;
                    Tween.stopAllByTarget(spBox);
                    if (canReceive) {
                        const startPos = spBox.position.clone();
                        tween(spBox)
                            .repeatForever(
                                tween()
                                    .to(0.3, { position: new Vec3(startPos.x, startPos.y + 5, startPos.z) }, { easing: 'quadOut' })
                                    .to(0.5, { position: startPos }, { easing: 'bounceOut' })
                                    .to(0.3, { position: new Vec3(startPos.x, startPos.y + 5, startPos.z) }, { easing: 'quadOut' })
                                    .to(0.5, { position: startPos }, { easing: 'bounceOut' })
                                    .delay(1),
                            )
                            .start();
                    }
                }
                if (canReceive && light) light.active = true;
                if (spBoxOpen) spBoxOpen.active = false;
                this.setMonthDotNode(dotComp, canReceive, true);
            }

            this.setMonthBoxDayText(monthBox, days);
            if (questBubble) questBubble.active = !received;
            const meta = this.getMonthRewardMeta(days);
            const rewards = meta ? meta.Reward() : [];
            const visibleRewards = this.getVisibleMonthRewards(rewards);
            if (reward1 && visibleRewards[0]) reward1.show(visibleRewards[0]);
            if (reward2 && visibleRewards[1]) reward2.show(visibleRewards[1]);
            this.layoutMonthRewardBubble(visibleRewards, reward1, reward2, bubbleAward);
            if (bubbleAward) bubbleAward.active = false;
        }

        for (let i = 0; i < this.week_box.length; i += 1) {
            const weekBox = this.week_box[i];
            const meta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, i + 1);
            if (!meta) continue;
            const spAnim = GameKit.ControllerTable.GetNode(weekBox, 'spAnim');
            const spCurrent = GameKit.ControllerTable.GetNode(weekBox, 'spCurrent');
            const labelDay = GameKit.ControllerTable.GetComponent(weekBox, 'labelDay', Label);
            const reward = GameKit.ControllerTable.GetComponent(weekBox, 'reward', 'ContentModel');
            const spMonth = GameKit.ControllerTable.GetNode(weekBox, 'spMonth');
            const claimed = weekBox.getChildByName('Claimed');
            const weekRewards = meta.Reward();

            this.populateWeekRewards(reward, weekRewards, i < this.data.signWeekRewards);

            const showNotReceived = i >= this.data.signWeekRewards;
            if (labelDay) {
                labelDay.node.active = showNotReceived;
                const labelOpacity = labelDay.node.getComponent(UIOpacity) || labelDay.node.addComponent(UIOpacity);
                labelOpacity.opacity = 255;
                this.setWeekDayLabelColor(labelDay, i < this.data.signWeekRewards);
            }
            if (spMonth) spMonth.active = false;
            if (spAnim) spAnim.active = i >= this.data.signWeekRewards;
            if (spCurrent) {
                spCurrent.active = showNotReceived;
                const opacity = spCurrent.getComponent(UIOpacity) || spCurrent.addComponent(UIOpacity);
                opacity.opacity = 255;
            }
            this.setClaimedNode(claimed, i < this.data.signWeekRewards);
        }
        this.updateClickTx();
    }

    populateWeekRewards(reward: any, weekRewards: any[], received: boolean) {
        if (!reward || !weekRewards || !weekRewards[0]) return;
        this.showWeekReward(reward, weekRewards[0]);
        this.setRewardReceivedStyle(reward, received);

        const parent = reward.node ? reward.node.parent : null;
        if (!parent) return;
        const oldExtra = parent.children.filter((child: Node) => child.name === 'sign-week-extra-reward');
        oldExtra.forEach((child: Node) => child.destroy());

        const rewardCount = Math.min(4, weekRewards.filter((item: any) => !!item).length);
        const positions = rewardCount >= 4
            ? [-180, -60, 60, 180]
            : rewardCount === 3
                ? [-80, 0, 80]
                : rewardCount === 2
                    ? [-40, 40]
                    : [0];
        reward.node.setPosition(positions[0], reward.node.position.y, reward.node.position.z);

        for (let i = 1; i < weekRewards.length && i < 4; i += 1) {
            if (!weekRewards[i]) continue;
            const item = instantiate(reward.node);
            item.name = 'sign-week-extra-reward';
            item.parent = parent;
            item.setPosition(positions[i] ?? item.position.x, item.position.y, item.position.z);
            item.setSiblingIndex(reward.node.getSiblingIndex() + i);
            const model = item.getComponent('ContentModel');
            this.showWeekReward(model, weekRewards[i]);
            this.setRewardReceivedStyle(model, received);
        }
    }

    setRewardReceivedStyle(contentModel: any, received: boolean) {
        if (!contentModel) return;
        if (contentModel.icon && contentModel.icon.node) {
            const opacity = contentModel.icon.node.getComponent(UIOpacity) || contentModel.icon.node.addComponent(UIOpacity);
            opacity.opacity = received ? 180 : 255;
        }
        if (contentModel.countWithColor && contentModel.countWithColor.node) {
            contentModel.countWithColor.node.active = !received;
        }
    }

    getMonthProgressTransform() {
        if (!this.month_pb) return null;
        return this.month_pb.getComponent(UITransform) || this.month_pb.addComponent(UITransform);
    }

    getMonthProgressWidth(signMonthDay: number) {
        return C.BAR_MAX * (
            Math.max(0, Math.min(1, signMonthDay / 8))
            + Math.max(0, Math.min(1, (signMonthDay - 8) / 7))
            + Math.max(0, Math.min(1, (signMonthDay - 15) / 7))
            + Math.max(0, Math.min(1, (signMonthDay - 22) / 6))
        ) / 4;
    }

    setMonthProgressWidth(width: number) {
        const transform = this.getMonthProgressTransform();
        if (!transform) return;
        transform.setContentSize(width, transform.contentSize.height);
    }

    setSpriteState(sprite: Sprite | null, gray: boolean) {
        if (!sprite) return;
        const legacySprite = sprite as any;
        if (typeof legacySprite.setState === 'function') {
            legacySprite.setState(gray ? 1 : 0);
            return;
        }
        if ('grayscale' in sprite) {
            (sprite as any).grayscale = gray;
        }
    }

    event_get_month_box_reward(e: any, days: any) {
        const target = e && e.target ? e.target : null;
        if (!target) return;
        if (e && e.stopPropagation) e.stopPropagation();
        days = this.getMonthBoxDay(target, days);
        const meta = this.getMonthRewardMeta(days);
        if (!meta) return;
        const ePos = target.getWorldPosition();

        if (days === monthDays[3]) {
            this.hideMonthRewardBubbles();
            const rewards = meta.Reward();
            RandomChestPanel.Show(rewards[0].Id(), { parent: this.btn?.node.parent, pos: ePos, height: 60 });
            return;
        }

        const reward = this._monthRewardBubbleNode;
        if (reward && reward.active && this._currentMonthBubbleTarget === target) {
            this.hideMonthRewardBubbles(null, true);
        } else {
            this.hideMonthRewardBubbles();
            this.showMonthRewardBubbleByTarget(target, meta.Reward());
        }
    }

    event_sign() {
        if (this.btn) this.btn.interactable = false;
        this.hideClickTx();

        if (!this.needSign) {
            this.closeAnim();
            return;
        }

        const DD = this.data.signMonthDay + 1;
        const weekMeta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, this.data.signWeekDay);
        const monthMeta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, DD);
        const metaT = weekMeta ? weekMeta.Id() : 0;
        const metaD = monthMeta ? monthMeta.Id() : 0;

        new Promise<void>((res, rej) => {
            if (C.FAKE_DATA) {
                res();
            } else {
                const sr = SR.SRSign.receiveSignWeekReward(this.data.signWeekDay, metaT, metaD);
                sr.SetCallBack((v: any) => {
                    if (v.chest1) {
                        let chestArr = GameKit.DataCache.GetData('UserCardChestArr') || [];
                        chestArr = chestArr.concat(v.chest1);
                        GameKit.DataCache.SetData('UserCardChestArr', chestArr);
                    }
                    if (v.chest2) GameKit.DataCache.SetData('UserCardChestN', v.chest2);
                    if (v.randomPack1) GameKit.DataCache.SetData('UserRandomPack', v.randomPack1);
                    if (v.randomPack2) GameKit.DataCache.SetData('UserRandomPackN', v.randomPack2);
                    res(v);
                });
                sr.SetErrorCallBack(() => {
                    if (this.btn) this.btn.interactable = true;
                    rej();
                });
                sr.Send();
            }
        }).then(() => {
            const currentWeekBox = this.week_box[this.data.signWeekDay - 1];
            const spAnim = GameKit.ControllerTable.GetNode(currentWeekBox, 'spAnim');
            const nStartPos = spAnim ? spAnim.position.clone() : new Vec3();
            const nOpacity = spAnim ? spAnim.getComponent(UIOpacity) || spAnim.addComponent(UIOpacity) : null;
            if (spAnim) {
                Tween.stopAllByTarget(spAnim);
                tween(spAnim).to(0.3, { angle: -10 }).start();
                tween(spAnim)
                    .to(0.5, { position: new Vec3(nStartPos.x + 30, nStartPos.y - 50, nStartPos.z) })
                    .call(() => this.showWeekRewardFloatAndContinue(currentWeekBox))
                    .start();
            } else {
                this.showWeekRewardFloatAndContinue(currentWeekBox);
            }
            if (nOpacity) {
                Tween.stopAllByTarget(nOpacity);
                tween(nOpacity).to(0.5, { opacity: 0 }).start();
            }
            const spCurrent = GameKit.ControllerTable.GetNode(currentWeekBox, 'spCurrent');
            this.fadeNode(spCurrent, 0.4, 0);
            const labelDay = GameKit.ControllerTable.GetNode(currentWeekBox, 'labelDay');
            this.fadeNode(labelDay, 0.4, 0);
            this.setClaimedNode(currentWeekBox.getChildByName('Claimed'), true, true);
        }, () => {});
    }

    showWeekRewardFloatAndContinue(currentWeekBox: Node) {
        const weekMeta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, this.data.signWeekDay);
        this.showRewardFloat(weekMeta ? weekMeta.Reward() : [], currentWeekBox, () => {
            if (this.data.signMonthDay >= monthDays[3]) {
                this.scheduleOnce(() => this.closeAnim(), 0.2);
                return;
            }
            const spMonth = GameKit.ControllerTable.GetNode(currentWeekBox, 'spMonth');
            if (spMonth) {
                Tween.stopAllByTarget(spMonth);
                spMonth.active = false;
            }
            this.continueMonthProgressAfterWeekReward();
        });
    }

    continueMonthProgressAfterWeekReward() {
        this.data.signMonthDay++;
        if (this.totalLab) this.totalLab.string = String(this.data.signMonthDay);
        const width = this.getMonthProgressWidth(this.data.signMonthDay);
        const monthPbTransform = this.getMonthProgressTransform();
        if (!monthPbTransform) {
            this.finishMonthBoxReward(0);
            return;
        }
        Tween.stopAllByTarget(monthPbTransform);
        const height = monthPbTransform.contentSize.height;
        tween(monthPbTransform)
            .to(0.5, { contentSize: new Size(width, height) })
            .call(() => {
                let days = 0;
                if (this.data.signMonthDay === monthDays[0]) days = monthDays[0];
                else if (this.data.signMonthDay === monthDays[1]) days = monthDays[1];
                else if (this.data.signMonthDay === monthDays[2]) days = monthDays[2];
                else if (this.data.signMonthDay === monthDays[3]) days = monthDays[3];
                this.finishMonthBoxReward(days);
            })
            .start();
    }

    finishMonthBoxReward(days: number) {
        if (days <= 0) {
            this.scheduleOnce(() => this.closeAnim(), 0.5);
            return;
        }

        const signData = GameKit.DataCache.GetData('signData');
        if (signData) {
            if (!signData.signMonthRewards) signData.signMonthRewards = [];
            this.pushUnique(signData.signMonthRewards, days);
            GameKit.DataCache.SetData('signData', signData);
        }

        const monthBox = this.month_box[monthDays.indexOf(days)];
        const spBox = GameKit.ControllerTable.GetNode(monthBox, 'sp-box');
        const light = GameKit.ControllerTable.GetNode(monthBox, 'light');
        if (spBox) {
            Tween.stopAllByTarget(spBox);
            tween(spBox)
                .to(0.1, { angle: 5 })
                .to(0.2, { angle: -5 })
                .to(0.2, { angle: 5 })
                .to(0.1, { angle: 0 })
                .start();
        }
        if (light) light.active = true;

        this.scheduleOnce(() => {
            if (!this.data.signMonthRewards) this.data.signMonthRewards = [];
            this.pushUnique(this.data.signMonthRewards, days);
            this.setMonthDotNode(this.getMonthDotNode(monthBox), true, true);
            if (spBox) this.fadeNode(spBox, 0.3, 0);
            const spBoxOpen = GameKit.ControllerTable.GetNode(monthBox, 'sp-box_open');
            if (spBoxOpen) {
                spBoxOpen.active = true;
                const spBoxOpenOpacity = spBoxOpen.getComponent(UIOpacity) || spBoxOpen.addComponent(UIOpacity);
                spBoxOpenOpacity.opacity = 0;
                this.fadeNode(spBoxOpen, 0.5, 255);
            }
            if (light) light.active = false;
            this.scheduleOnce(() => {
                this.moveDelayedRewardCache();
                const monthMeta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days);
                this.showRewardFloat(monthMeta ? monthMeta.Reward() : [], monthBox, () => {
                    this.scheduleOnce(() => {
                        this.closeAnim();
                    }, 0.2);
                });
            }, 1);
        }, 0.5);
    }

    moveDelayedRewardCache() {
        const ccn = GameKit.DataCache.GetData('UserCardChestN');
        if (ccn) {
            let chestArr = GameKit.DataCache.GetData('UserCardChestArr') || [];
            chestArr = chestArr.concat(ccn);
            GameKit.DataCache.SetData('UserCardChestArr', chestArr);
            GameKit.DataCache.RemoveData('UserCardChestN');
        }
        const rpn = GameKit.DataCache.GetData('UserRandomPackN');
        if (rpn) {
            GameKit.DataCache.SetData('UserRandomPack', rpn);
            GameKit.DataCache.RemoveData('UserRandomPackN');
        }
    }

    fadeNode(node: Node | null, duration: number, opacityValue: number) {
        if (!node) return;
        const opacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        if (opacityValue > 0) opacity.opacity = 0;
        Tween.stopAllByTarget(opacity);
        tween(opacity).to(duration, { opacity: opacityValue }).start();
    }

    onClose() {
        if (this.node) this.node.off(Node.EventType.TOUCH_END, this.onMonthBubbleOutsideTouchEnd, this, true);
        this._monthBubbleOutsideTouchBinded = false;
        this.hideMonthRewardBubbles();
        this.hideClickTx();
    }
}
