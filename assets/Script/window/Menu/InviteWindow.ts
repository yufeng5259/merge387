import { UIWindow } from '../../GameKit/ui/UIWindow';
import { _decorator, Label, Node, RichText, Sprite, SpriteFrame, tween, UIOpacity, UITransform, Vec3 } from 'cc';
/**
 * @author fengyong
 * @version 2018-8-9
 */

const { ccclass, property, executeInEditMode } = _decorator

/** 界面配置参数 */
const C = {
    /** 默认增加值 */
    DEFAULT_INVITE_ADD: 35,

    bg_1: 715,
    bg_2: 835,

    btn0_1: -250,
    btn0_2: -210,
    INVITE_GOAL: 30,
    REWARD_BUBBLE_OFFSET_Y: -62,
    REWARD_BUBBLE_BORDER: 24,
    GIFT_REWARDS: [
        { nodeName: 'reward_gift_2', amount: 100, bubbleOffsetX: -4 },
        { nodeName: 'reward_gift_5', amount: 200, bubbleOffsetX: 0 },
        { nodeName: 'reward_gift_10', amount: 300, bubbleOffsetX: 0 },
        { nodeName: 'big_gift', amount: 400, bubbleOffsetX: 0 },
    ],
    PROGRESS: {
        nodes: [
            { count: 2, amountDotShowAt: 10 },
            { count: 5, amountDotShowAt: 20 },
            { count: 10, amountDotShowAt: 30 },
        ],
    },
}
/**
 * Invite界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class InviteWindow extends UIWindow {
    
    static windowPath = "Menu/InviteWindow"

    /** @type {Label} */
    @property(Label)
    label_add_type0 = []

    /** @type {Label} */
    @property(RichText)
    label_add_type1 = []

    /** @type {Label} */
    @property(Label)
    label_note = null

    /** @type {Node} */
    @property(Node)
    bg = null
    /** @type {Node} */
    @property(Node)
    btn0 = null
    /** @type {Node} */
    @property(Node)
    btn1 = null

    private _inviteRewardBubble: Node | null = null
    private _inviteRewardBubbleTarget: Node | null = null
    private _inviteRewardGiftNodes: Node[] = []
    private _inviteRewardBubbleBound = false

    onShow() {
        this.update_addnumber()
        const progress = this.getInviteProgress()
        this.updateInviteProgress(progress)
        this.bindInviteRewardBubbleEvents()
        this.hideInviteRewardBubble()
    }

    updateInviteProgress(progress: any) {
        if (!this.bg) return
        const group = this.bg.getChildByName('new_invite_progress')
        const bar = group?.getChildByName('bar_bg')
        const fill = group?.getChildByName('bar_fill')
        const barTransform = bar?.getComponent(UITransform)
        const fillTransform = fill?.getComponent(UITransform)
        if (barTransform && fillTransform) fillTransform.setContentSize(Math.max(0, (barTransform.width - 24) * progress.rate), fillTransform.height)
        const friendsLabel = this.bg.getChildByName('new_invite_friends_label')?.getComponent(Label)
        if (friendsLabel) friendsLabel.string = String.format(GameKit.i18n.t('invite_friends_progress'), progress.current, progress.target)
        if (!group) return
        for (const item of C.PROGRESS.nodes) {
            const check = group.getChildByName('reward_check_' + item.count)
            const amountDotSprite = group.getChildByName('reward_amount_dot_' + item.count)?.getComponent(Sprite)
            if (check) check.active = progress.current >= item.count
            if (amountDotSprite) amountDotSprite.enabled = progress.current >= item.amountDotShowAt
        }
    }

    bindInviteRewardBubbleEvents() {
        if (this._inviteRewardBubbleBound || !this.bg || !this.node) return
        const group = this.bg.getChildByName('new_invite_progress')
        if (!group) return
        this._inviteRewardGiftNodes = []
        for (const config of C.GIFT_REWARDS) {
            const gift = group.getChildByName(config.nodeName)
            if (!gift) continue
            const giftData = gift as any
            giftData._inviteRewardAmount = config.amount
            giftData._inviteRewardBubbleOffsetX = config.bubbleOffsetX
            gift.on(Node.EventType.TOUCH_END, this.onInviteRewardGiftTouchEnd, this)
            this._inviteRewardGiftNodes.push(gift)
        }
        this.setupInviteRewardBubble(this.getInviteRewardBubble())
        this.node.on(Node.EventType.TOUCH_END, this.onInviteRewardBubbleOutsideTouchEnd, this, true)
        this._inviteRewardBubbleBound = true
    }

    getInviteRewardBubble() {
        if (this._inviteRewardBubble?.isValid) return this._inviteRewardBubble
        this._inviteRewardBubble = this.bg?.getChildByName('invite_reward_bubble') || null
        return this._inviteRewardBubble
    }

    setupInviteRewardBubble(bubble: Node | null) {
        if (!bubble) return
        if (bubble.parent) bubble.setSiblingIndex(bubble.parent.children.length - 1)
        const sprite = bubble.getComponent(Sprite)
        if (sprite) {
            sprite.type = Sprite.Type.SLICED
            sprite.sizeMode = Sprite.SizeMode.CUSTOM
            this.setInviteRewardBubbleInsets(sprite.spriteFrame)
        }
        const bubbleData = bubble as any
        if (!bubbleData._inviteRewardTouchBound) {
            bubbleData._inviteRewardTouchBound = true
            bubble.on(Node.EventType.TOUCH_START, this.stopInviteRewardBubbleTouchPropagation, this)
            bubble.on(Node.EventType.TOUCH_END, this.stopInviteRewardBubbleTouchPropagation, this)
            bubble.on(Node.EventType.TOUCH_CANCEL, this.stopInviteRewardBubbleTouchPropagation, this)
        }
    }

    setInviteRewardBubbleInsets(spriteFrame: SpriteFrame | null) {
        if (!spriteFrame) return
        const frame = spriteFrame as any
        if (frame._inviteRewardBubbleInsetReady) return
        frame._inviteRewardBubbleInsetReady = true
        frame.insetLeft = C.REWARD_BUBBLE_BORDER
        frame.insetRight = C.REWARD_BUBBLE_BORDER
        frame.insetTop = C.REWARD_BUBBLE_BORDER
        frame.insetBottom = C.REWARD_BUBBLE_BORDER
    }

    onInviteRewardGiftTouchEnd(e: any) {
        e?.stopPropagation?.()
        const target = this.getInviteRewardGiftNode(e ? e.currentTarget || e.target : null)
        const bubble = this.getInviteRewardBubble()
        if (!target || !bubble) return
        if (bubble.active && this._inviteRewardBubbleTarget === target) {
            this.hideInviteRewardBubble(true)
            return
        }
        const countLabel = bubble.getChildByName('reward-icon')?.getChildByName('reward-count')?.getComponent(Label)
        if (countLabel) countLabel.string = String((target as any)._inviteRewardAmount || 0)
        this._inviteRewardBubbleTarget = target
        this.setInviteRewardBubblePosition(bubble, target)
        this.showInviteRewardBubble(bubble)
    }

    getInviteRewardGiftNode(target: Node | null) {
        let node = target
        while (node) {
            if (this._inviteRewardGiftNodes.indexOf(node) >= 0) return node
            node = node.parent
        }
        return null
    }

    setInviteRewardBubblePosition(bubble: Node, target: Node) {
        if (!bubble.parent) return
        const parentTransform = bubble.parent.getComponent(UITransform)
        const bubbleTransform = bubble.getComponent(UITransform)
        if (!parentTransform || !bubbleTransform) return
        const localPos = parentTransform.convertToNodeSpaceAR(target.getWorldPosition())
        let bubbleX = localPos.x + ((target as any)._inviteRewardBubbleOffsetX || 0)
        if (parentTransform.width > bubbleTransform.width + 24) {
            const minX = -parentTransform.anchorX * parentTransform.width + bubbleTransform.width / 2 + 12
            const maxX = (1 - parentTransform.anchorX) * parentTransform.width - bubbleTransform.width / 2 - 12
            bubbleX = Math.max(minX, Math.min(maxX, bubbleX))
        }
        bubble.setPosition(bubbleX, localPos.y + C.REWARD_BUBBLE_OFFSET_Y, bubble.position.z)
        const arrow = bubble.getChildByName('bubble-arrow')
        if (arrow) arrow.setPosition(localPos.x - bubbleX, arrow.position.y, arrow.position.z)
    }

    showInviteRewardBubble(bubble: Node) {
        this.setupInviteRewardBubble(bubble)
        const opacity = bubble.getComponent(UIOpacity) || bubble.addComponent(UIOpacity)
        tween(bubble).stop()
        tween(opacity).stop()
        bubble.active = true
        opacity.opacity = 0
        bubble.setScale(0.82, 0.82, 1)
        tween(opacity).to(0.12, { opacity: 255 }).start()
        tween(bubble).to(0.14, { scale: new Vec3(1.05, 1.05, 1) }, { easing: 'backOut' }).to(0.08, { scale: Vec3.ONE }, { easing: 'sineOut' }).start()
    }

    hideInviteRewardBubble(withAnim = false) {
        const bubble = this.getInviteRewardBubble()
        this._inviteRewardBubbleTarget = null
        if (!bubble || !bubble.active) return
        const opacity = bubble.getComponent(UIOpacity) || bubble.addComponent(UIOpacity)
        tween(bubble).stop()
        tween(opacity).stop()
        if (!withAnim) {
            bubble.active = false
            opacity.opacity = 255
            bubble.setScale(Vec3.ONE)
            return
        }
        tween(opacity).to(0.12, { opacity: 0 }).start()
        tween(bubble).to(0.12, { scale: new Vec3(0.92, 0.92, 1) }, { easing: 'sineIn' }).call(() => {
            bubble.active = false
            opacity.opacity = 255
            bubble.setScale(Vec3.ONE)
        }).start()
    }

    onInviteRewardBubbleOutsideTouchEnd(e: any) {
        const bubble = this.getInviteRewardBubble()
        if (!bubble?.active || this.getInviteRewardGiftNode(e?.target || null)) return
        const pos = e?.getUILocation?.() || e?.getLocation?.()
        const bounds = bubble.getComponent(UITransform)?.getBoundingBoxToWorld()
        if (pos && bubble.activeInHierarchy && bounds?.contains(pos)) return
        this.hideInviteRewardBubble(true)
    }

    stopInviteRewardBubbleTouchPropagation(e: any) {
        e?.stopPropagation?.()
    }

    getInviteProgress() {
        let current = Number(Game?.SUser?.data?.invitationNum || Game?.SUser?.data?.inviteNum || Game?.SUser?.data?.inviteCount || 0)
        if (isNaN(current)) current = 0
        current = Math.max(0, Math.min(C.INVITE_GOAL, Math.floor(current)))
        return { current, target: C.INVITE_GOAL, rate: C.INVITE_GOAL > 0 ? current / C.INVITE_GOAL : 0 }
    }

    getInviteRewardAmountText(inviteCount: number) {
        const defaultText = '200'
        const meta = Meta?.InviteRewardsMeta?.GetContentByInviteCount?.(inviteCount)
        const content = meta?.Contents?.()?.[0]
        if (content?.FormatCount) return content.FormatCount()
        if (content?.Count) return GameKit.StringUtil.formatNumber(content.Count())
        return defaultText
    }

    /** 获取新增的体力值 */
    update_addnumber() {
        let add_number = this.get_add_number()
        for (let label of this.label_add_type0) {
            label.string = String.format(GameKit.i18n.t("invite_addnumber_type0"), add_number)
        }
        for (let label of this.label_add_type1) {
            let key = "invite_lineA"
            if (AppKit.SdkManager.IsNative()) key = "invite_lineApp"
            label.string = String.format(GameKit.i18n.t(key), add_number)
        }
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /** 点击事件：默认分享按钮 */
    event_share_default() {
        let img = 'tex/sh01.png'
        if (AppKit.SdkManager.IsNative()) img = null
        AppKit.ShareWrap.share(GameKit.i18n.t("ShareInviteNew"), img, {intent:"INVITE", type:"spain_invite", 
            url:"https://getcoingang.com/?inviteId="+Game.SUser.UserId()}, null, "spain_invite")
        //AppKit.LogEventWrap.logAppAnalytic("invite")
        AppKit.NativeWrap.callAdjustTrackEvent("点邀请好友按钮");
    }

    /** 点击事件：facebook分享按钮 */
    event_share_facebook() {
        //this.event_share_default()
        if (AppKit.SdkManager.IsNative()) {
            if (Game.SUser.IsGuest()) {
                UIRoot.instance.openChildWindow("AccountBindWindow")
            } else {
                //AppKit.LogEventWrap.logAppAnalytic("invite")
                AppKit.ShareWrap.inviteNew(GameKit.i18n.t("ShareInviteNew"), 'tex/sh01.png', {intent:"INVITE", type:"spain_invite"}, null, "spain_invite")
            }
            return
        } 
        AppKit.ShareWrap.share(GameKit.i18n.t("ShareInviteNew"), 'tex/sh01.png', {intent:"INVITE", type:"spain_invite"}, null, "spain_invite")
    }

    /** 获取增加的值（meta数据or服务器数据） */
    get_add_number() {
        let data = G.GameConstance.spinsPerInvite
        let mapId = Game.SUserVillage.MapId()
        let is = 0
        for (let mid in data) {
            if (mapId >= parseInt(mid)) {
                is = data[mid]
            } else {
                break
            }
        }
        return is
    }

    onClose() {
        this.node?.off(Node.EventType.TOUCH_END, this.onInviteRewardBubbleOutsideTouchEnd, this, true)
        for (const gift of this._inviteRewardGiftNodes) {
            if (gift?.isValid) gift.off(Node.EventType.TOUCH_END, this.onInviteRewardGiftTouchEnd, this)
        }
        const bubble = this.getInviteRewardBubble()
        if (bubble?.isValid) {
            bubble.off(Node.EventType.TOUCH_START, this.stopInviteRewardBubbleTouchPropagation, this)
            bubble.off(Node.EventType.TOUCH_END, this.stopInviteRewardBubbleTouchPropagation, this)
            bubble.off(Node.EventType.TOUCH_CANCEL, this.stopInviteRewardBubbleTouchPropagation, this)
            ;(bubble as any)._inviteRewardTouchBound = false
        }
        this._inviteRewardBubbleBound = false
        this.hideInviteRewardBubble()
    }
}
