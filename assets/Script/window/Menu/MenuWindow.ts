import { UIWindow } from '../../GameKit/ui/UIWindow';
import BadgeItem from '../../GameKit/Editor/BadgeItem';
import { UserInfoModel } from '../UserInfoModel';
import VillageNewsWindow from './VillageNewsWindow';
import { _decorator, Button, Color, find, game, instantiate, Label, LabelOutline, Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, tween, Tween, UITransform, Vec2, Vec3, v2, Widget, sp } from 'cc';
import Guild from '../../game/guild/Guild';
/**
 * @author fengyong
 * @version 2018-8-7
 */

const { ccclass, property, executeInEditMode } = _decorator

/** 界面配置参数 */
const C = {
    /** 进入动画时间 */
    IN_ANIMATION_TIME: 0.4,
}

const MAIN_BUTTON2A_BADGE = {
    boneName: "Gua_01",
    idleAnimation: "idle",
    stillAnimation: "still",
    stillDelay: 1.5,
    idleDuration: 0.9,
}
/**
 * Menu界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class MenuWindow extends UIWindow {

    static windowPath = "Menu/MenuWindow"

    _shopFreeBadgeReqPending = false
    _shopFreeBadgeReqing = false
    _shopBadgeNode: Node = null
    _shopBadgeLabel: Label = null
    _menuBadgeItems: any[] = []
    is_back_click: any = undefined

    /** @type {Node} */
    @property(Node)
    btn_back = null

    @property(BadgeItem)
    badge_dailybonus = null
    @property(BadgeItem)
    badge_villagenews = null
    @property(BadgeItem)
    badge_gifts = null
    
    @property([Node])
    purchaseItems = []
    @property([Node])
    dailyItems = []
    @property([Node])
    shareItems = []

    @property([Node])
    giftsItems = []

    @property(Node)
    bindItem = null
    @property(UserInfoModel)
    userinfo = null

    // Bind main_button2a SkeletonData for animated numeric badges in this menu.
    @property(sp.SkeletonData)
    mainButton2aSkeletonData = null

    /** UIWindow.unShow() */
    onShow() {
        this.userinfo.show(Game.SUser)
        this.node.setPosition(Vec3.ZERO)
        this.btn_back.active = true
        this.update_badge_array()
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, "MenuWindow", function() {
            this.request_shop_free_badge_count()
        }.bind(this))
        //this.node.once(Node.EventType.TOUCH_START, () => {
        //this.bg.active = false
        //this.event_back()
        //})
        if (!AppKit.PaymentWrap.PayVisiable()) {
            this.purchaseItems.forEach(x => {x.active = false})
        }
        if (G.GameConfig.closeShare) {
            this.shareItems.forEach(x => {x.active = false})
        }
        if (Game.SUser.IsGuest()) {
            this.giftsItems.forEach(x => {x.active = false})
            //this.bindItem.active = true
        }
        if (AppKit.NativeWrap.isNewApp()) {
            this.purchaseItems.forEach(x => {x.active = false})
            this.dailyItems.forEach(x => {x.active = false})
        }
    }

    onClose() {
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, "MenuWindow")
        this._shopFreeBadgeReqPending = false
        this.stop_all_main_button2a_badges()
    }

    /** 更新所有的badge
     * - 未来需要传入相应的参数
     */
    lateUpdate() {
        this.sync_all_main_button2a_badges()
        this.update_main_button2a_badge_attachments()
    }

    update_badge_array() {
        this.badge_dailybonus.SetNum(G.GameConstance.dailybonusMaxCount-Game.SUserSlot.DailyBonusDid())

        let NewMessageNum = GameKit.DataCache.GetData("NewMessageNum")
        if (NewMessageNum == null) NewMessageNum = 0
        let presentNum = VillageNewsWindow.getPresentNum()
        this.badge_villagenews.SetNum(NewMessageNum + presentNum)

        let GiftsNum = GameKit.DataCache.GetData("GiftsNum")
        if (GiftsNum == null) GiftsNum = 0
        this.badge_gifts.SetNum(GiftsNum)

        this.update_shop_free_badge(0)
        this.request_shop_free_badge_count()
    }

    request_shop_free_badge_count() {
        if (this._shopFreeBadgeReqing) {
            this._shopFreeBadgeReqPending = true
            return
        }
        if (typeof SR === "undefined" || !SR.SRShop || !SR.SRShop.shopGetInfo) {
            this.update_shop_free_badge(0)
            return
        }

        this._shopFreeBadgeReqing = true
        this._shopFreeBadgeReqPending = false

        let req = SR.SRShop.shopGetInfo()
        if (req.SetSilence) req.SetSilence(true)
        req.SetCallBack(function(res) {
            if (this.node && this.node.isValid) {
                this.update_shop_free_badge(this.get_shop_free_reward_count(res && res.data))
            }
            this.finish_shop_free_badge_request()
        }.bind(this))
        if (req.SetErrorCallBack) {
            req.SetErrorCallBack(function() {
                if (this.node && this.node.isValid) {
                    this.update_shop_free_badge(0)
                }
                this.finish_shop_free_badge_request()
            }.bind(this))
        }
        req.Send()
    }

    finish_shop_free_badge_request() {
        this._shopFreeBadgeReqing = false
        if (!this._shopFreeBadgeReqPending) return

        this._shopFreeBadgeReqPending = false
        this.request_shop_free_badge_count()
    }

    get_shop_free_reward_count(shopData) {
        if (!shopData || !Array.isArray(shopData.daily) || !Array.isArray(shopData.dailyState)) return 0
        if (typeof Meta === "undefined" || !Meta.MetaManager || !Meta.MetaType) return 0

        let count = 0
        for (let i = 0; i < shopData.daily.length; i++) {
            let meta = Meta.MetaManager.GetMeta(Meta.MetaType.ShopDaily, shopData.daily[i])
            if (this.is_shop_free_meta_available(meta, shopData.dailyState[i])) count++
        }
        return count
    }

    is_shop_free_meta_available(meta, state) {
        if (!meta || !state || !meta.CurrencyType) return false

        let leftNum = Number(state.leftNum)
        if (isNaN(leftNum) || leftNum <= 0) return false

        return Number(meta.CurrencyType()) === 0
    }

    update_shop_free_badge(count) {
        count = Number(count) || 0

        let badge = this.get_shop_badge_node()
        if (!badge) return

        let badgeItem = badge.getComponent(BadgeItem)
        if (badgeItem && badgeItem.SetNum) {
            badgeItem.SetNum(count)
            return
        }

        let label = this.get_shop_badge_label()
        if (label) label.string = count.toString()
        badge.active = count > 0
    }

    get_shop_badge_node() {
        if (this._shopBadgeNode && this._shopBadgeNode.isValid) return this._shopBadgeNode

        this._shopBadgeNode = find("content_window/line_layout/line_buy/badge", this.node)
        return this._shopBadgeNode
    }

    get_shop_badge_label() {
        if (this._shopBadgeLabel && this._shopBadgeLabel.node && this._shopBadgeLabel.node.isValid) return this._shopBadgeLabel

        let badge = this.get_shop_badge_node()
        let labelNode = badge ? badge.getChildByName("badge_number") : null
        this._shopBadgeLabel = labelNode ? labelNode.getComponent(Label) : null
        return this._shopBadgeLabel
    }

    /** 点击事件：back_btn */
    get_menu_badge_items() {
        if (this._menuBadgeItems && this._menuBadgeItems.length > 0 && this._menuBadgeItems[0].badge && this._menuBadgeItems[0].badge.isValid) {
            return this._menuBadgeItems
        }

        let lineLayout = find("content_window/line_layout", this.node)
        this._menuBadgeItems = []
        if (!lineLayout) return this._menuBadgeItems

        lineLayout.children.forEach(function(lineNode) {
            let badge = lineNode.getChildByName("badge")
            let labelNode = badge ? badge.getChildByName("badge_number") : null
            if (!badge || !labelNode) return

            let label = labelNode.getComponent(Label)
            if (!label) return

            this._menuBadgeItems.push({
                badge: badge,
                label: label,
                labelNode: labelNode,
            })
        }.bind(this))
        return this._menuBadgeItems
    }

    sync_all_main_button2a_badges() {
        let items = this.get_menu_badge_items()
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            if (!item || !item.badge || !item.badge.isValid) continue

            let num = item.label ? Number(item.label.string) : 0
            if (item.badge.active && item.badge.activeInHierarchy && item.labelNode && item.labelNode.active && num > 0) {
                this.ensure_main_button2a_badge(item.badge, item.labelNode)
            } else {
                this.stop_main_button2a_badge(item.badge._mainButton2aBadge)
            }
        }
    }

    ensure_main_button2a_badge(badgeNode, labelNode) {
        if (!badgeNode || !badgeNode.isValid || !labelNode || !labelNode.isValid) return

        let state = this.ensure_main_button2a_badge_state(badgeNode)
        if (!state) return

        state.attachNode = labelNode
        labelNode.active = true
        this.set_node_top_sibling(labelNode)
        this.start_main_button2a_badge(state)
    }

    ensure_main_button2a_badge_state(badgeNode) {
        if (!badgeNode || !badgeNode.isValid) return null

        let state = badgeNode._mainButton2aBadge
        if (state) return state

        state = {
            badgeNode: badgeNode,
            spineNode: null,
            skeleton: null,
            bone: null,
            attachNode: null,
            originalSprite: badgeNode.getComponent(Sprite),
            delayCallback: null,
            idleFallbackCallback: null,
            playToken: 0,
            started: false,
        }
        badgeNode._mainButton2aBadge = state
        return state
    }

    start_main_button2a_badge(state) {
        if (!state || !state.badgeNode || !state.badgeNode.isValid) return

        state.badgeNode.active = true

        let skeletonData = this.mainButton2aSkeletonData
        if (!skeletonData) {
            if (state.originalSprite) state.originalSprite.enabled = true
            return
        }

        if (state.originalSprite) state.originalSprite.enabled = false

        if (state.started && state.skeleton) return
        state.started = true

        let spineNode = state.spineNode
        if (!spineNode || !spineNode.isValid) {
            spineNode = new Node("main_button2a")
            spineNode.parent = state.badgeNode
            spineNode.setPosition(Vec3.ZERO)
            state.spineNode = spineNode
        }
        spineNode.active = true

        let skeleton = spineNode.getComponent(sp.Skeleton) || spineNode.addComponent(sp.Skeleton)
        skeleton.skeletonData = skeletonData
        skeleton.defaultAnimation = MAIN_BUTTON2A_BADGE.stillAnimation
        skeleton.loop = true
        skeleton.premultipliedAlpha = false

        let badgeTransform = state.badgeNode.getComponent(UITransform)
        let baseSize = Math.max(badgeTransform ? badgeTransform.width : 30, badgeTransform ? badgeTransform.height : 30)
        spineNode.setScale(baseSize / 30, baseSize / 30, spineNode.scale.z)

        state.skeleton = skeleton
        state.bone = this.find_main_button2a_bone(skeleton)
        this.set_node_bottom_sibling(spineNode)
        this.set_node_top_sibling(state.attachNode)
        this.play_main_button2a_badge_loop(state)
    }

    play_main_button2a_badge_loop(state) {
        if (!state || !state.skeleton || !state.badgeNode || !state.badgeNode.isValid) return

        state.playToken++
        let token = state.playToken
        let skeleton = state.skeleton

        this.clear_main_button2a_badge_callbacks(state)
        if (skeleton.setCompleteListener) skeleton.setCompleteListener(null)
        if (skeleton.clearTracks) skeleton.clearTracks()

        let finishIdle = function() {
            if (state.playToken !== token) return
            if (!this.node || !this.node.isValid || !state.badgeNode.isValid) return
            this.play_main_button2a_still(state)

            state.delayCallback = function() {
                state.delayCallback = null
                if (state.playToken !== token) return
                if (!this.node || !this.node.isValid || !state.badgeNode.isValid) return
                this.play_main_button2a_badge_loop(state)
            }.bind(this)
            this.scheduleOnce(state.delayCallback, MAIN_BUTTON2A_BADGE.stillDelay)
        }.bind(this)

        let entry = null
        try {
            entry = skeleton.setAnimation(0, MAIN_BUTTON2A_BADGE.idleAnimation, false)
        } catch (e) {
            this.play_main_button2a_still(state)
            return
        }

        if (skeleton.setTrackCompleteListener && entry) {
            skeleton.setTrackCompleteListener(entry, finishIdle)
        } else {
            state.idleFallbackCallback = finishIdle
            this.scheduleOnce(state.idleFallbackCallback, this.get_main_button2a_animation_duration(skeleton, MAIN_BUTTON2A_BADGE.idleAnimation, MAIN_BUTTON2A_BADGE.idleDuration))
        }
    }

    play_main_button2a_still(state) {
        if (!state || !state.skeleton) return

        try {
            state.skeleton.setAnimation(0, MAIN_BUTTON2A_BADGE.stillAnimation, true)
        } catch (e) {}
    }

    stop_main_button2a_badge(state) {
        if (!state) return

        let spineActive = state.spineNode && state.spineNode.isValid && state.spineNode.active
        if (!state.started && !spineActive) {
            if (state.originalSprite) state.originalSprite.enabled = true
            return
        }

        state.playToken++
        state.started = false
        this.clear_main_button2a_badge_callbacks(state)
        if (state.skeleton) {
            if (state.skeleton.setCompleteListener) state.skeleton.setCompleteListener(null)
            if (state.skeleton.clearTracks) state.skeleton.clearTracks()
        }
        if (state.spineNode && state.spineNode.isValid) {
            state.spineNode.active = false
        }
        if (state.originalSprite) state.originalSprite.enabled = true
    }

    stop_all_main_button2a_badges() {
        let items = this.get_menu_badge_items()
        for (let i = 0; i < items.length; i++) {
            let badge = items[i] && items[i].badge
            if (badge && badge.isValid) this.stop_main_button2a_badge(badge._mainButton2aBadge)
        }
    }

    clear_main_button2a_badge_callbacks(state) {
        if (!state) return
        if (state.delayCallback) {
            this.unschedule(state.delayCallback)
            state.delayCallback = null
        }
        if (state.idleFallbackCallback) {
            this.unschedule(state.idleFallbackCallback)
            state.idleFallbackCallback = null
        }
    }

    update_main_button2a_badge_attachments() {
        let items = this.get_menu_badge_items()
        for (let i = 0; i < items.length; i++) {
            let badge = items[i] && items[i].badge
            this.update_main_button2a_badge_attachment(badge && badge._mainButton2aBadge)
        }
    }

    update_main_button2a_badge_attachment(state) {
        if (!state || !state.skeleton || !state.bone || !state.attachNode) return
        if (!state.spineNode || !state.spineNode.isValid || !state.attachNode.isValid) return
        if (!state.attachNode.parent) return

        if (state.skeleton.updateWorldTransform) {
            state.skeleton.updateWorldTransform()
        }

        let bonePos = new Vec3(state.bone.worldX || 0, state.bone.worldY || 0, 0)
        let worldPos = state.spineNode.getComponent(UITransform)!.convertToWorldSpaceAR(bonePos, new Vec3())
        let localPos = state.attachNode.parent.getComponent(UITransform)!.convertToNodeSpaceAR(worldPos, new Vec3())
        state.attachNode.setPosition(localPos)
    }

    find_main_button2a_bone(skeleton) {
        if (!skeleton || !skeleton.findBone) return null
        if (skeleton.updateWorldTransform) skeleton.updateWorldTransform()
        return skeleton.findBone(MAIN_BUTTON2A_BADGE.boneName)
    }

    get_main_button2a_bone_position(bone) { return bone ? new Vec3(bone.worldX || 0, bone.worldY || 0, 0) : null }

    get_main_button2a_animation_duration(skeleton, animName, defaultDuration) {
        if (!skeleton || !skeleton.findAnimation) return defaultDuration
        let anim = skeleton.findAnimation(animName)
        if (anim && anim.duration > 0) return anim.duration
        return defaultDuration
    }

    set_node_top_sibling(node) {
        if (!node || !node.isValid || !node.parent) return
        node.setSiblingIndex(node.parent.childrenCount - 1)
    }

    set_node_bottom_sibling(node) {
        if (!node || !node.isValid) return
        node.setSiblingIndex(0)
    }

    event_back(e, cb, delayTime = 0) {
        if (this.is_back_click !== undefined) { return }
        this.is_back_click = 0
        this.closeAnim(cb)
    }

    /** 点击事件： */
    event_0_play() {
        this.event_back(null, () => { GamePlay.instance.changeScene(GamePlay.Scenes.Slot) }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_play")
    }

    /** 点击事件： */
    event_1_village() {
        this.event_back(null, () => { GamePlay.instance.changeScene(GamePlay.Scenes.Village) }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_village")
    }

    /** 点击事件： */
    event_2_buy() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("ShopWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_shop")
    }

    /** 点击事件： */
    event_3_bonus() {
        this.event_back(null, () => { GamePlay.instance.changeScene(GamePlay.Scenes.DailyBonus) }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_dailybonus")
    }

    /** 点击事件： */
    event_5_news() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("VillageNewsWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_news")
    }

    /** 点击事件： */
    event_6_gifts() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("GiftsWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_gift")
    }

    /** 点击事件： */
    event_7_card() {
        if (Game.IsCardFeatureClosed && Game.IsCardFeatureClosed()) return
        this.event_back(null, () => { UIRoot.instance.openChildWindow("CardAllSetWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_card")
    }

    /** 点击事件： */
    event_8_map() {
        if (Game.MergeTutorialManager && !Game.MergeTutorialManager.CanOperate('back_map')) {
            return
        }
    }

    /** 点击事件： */
    event_9_leaderboard() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("LeaderboardWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_leaderboard")
    }

    /** 点击事件： */
    event_10_invite() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("InviteWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_invite")

        // this.event_back(null, () => { UIRoot.instance.openChildWindow("InviteAndShareWindow") }, C.IN_ANIMATION_TIME * 1000)
        // AppKit.LogEventWrap.logEvent("menu_InviteAndShareWindow")
    }

    /** 点击事件： */
    event_11_setting() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("SettingWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_setting")
    }
    /** 点击事件： */
    event_13_friends() {
        this.event_back(null, () => { 
            // UIRoot.instance.openChildWindow("SettingWindow") 
            if(!Game.SUser.IsGuest()){
                let req = SR.SRGuild.verificationLegion({"userId":Game.SUser.UserId()});
                req.SetCallBack(function(res) {
                // console.log("验证",res.legionId);
               if(res.legionId>0){
                let req = SR.SRGuild.checkGuildInfo(Game.SUser.GuildId());
                req.SetCallBack(function(res) {
                    // console.log("进入我的军团",res);
                    Guild.askList={};
                    res.user.forEach((ele)=>{
                        Game.SGuild.guildInfo[ele.userId] = ele;
                    })
                    Game.SGuild.updateData(res.legion)
                    UIRoot.instance.openChildWindow("GuildGameMainWindow","1")
                }.bind(this))
                req.Send();
               }else{
                    Game.SUser.setData("legionId",0)
                    UIRoot.instance.openChildWindow("GuildGameMainWindow","1")
               }
            }.bind(this))
            req.Send();

            }else{
                console.log("绑定FB");
                UIRoot.instance.openChildWindow("AccountBindWindow")
            }
        }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_friends")
    }
    /** 点击事件： */
    event_sign() {
        this.event_back(null, () => { UIRoot.instance.openChildWindow("SignWindow") }, C.IN_ANIMATION_TIME * 1000)
        AppKit.LogEventWrap.logEvent("menu_sign")
    }

    connectFacebook() {
        UIRoot.instance.openChildWindow("AccountBindWindow")
        // AppKit.UserWrap.NativeFBLogin(() => {
        //     let req = SR.SRLogin.bindAccount(Game.SUser.accountId, Game.SUser.from)
        //     req.SetCallBack(() => {
        //         this.close()
        //         AppGame.instance.logout()
        //     })
        //     req.Send()
        // })
        // AppKit.LogEventWrap.logEvent("menu_connect_Facebook")
    }
}
