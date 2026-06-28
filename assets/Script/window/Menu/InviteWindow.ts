import { UIWindow } from '../../GameKit/ui/UIWindow';
/**
 * @author fengyong
 * @version 2018-8-9
 */

const UIRoot = window.UIRoot
const { ccclass, property, executeInEditMode } = cc._decorator

/** 界面配置参数 */
const C = {
    /** 默认增加值 */
    DEFAULT_INVITE_ADD: 35,

    bg_1: 715,
    bg_2: 835,

    btn0_1: -250,
    btn0_2: -210,
}
/**
 * Invite界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class InviteWindow extends UIWindow {
    
    static windowPath = "Menu/InviteWindow"

    /** @type {cc.Label} */
    @property(cc.Label)
    label_add_type0 = []

    /** @type {cc.Label} */
    @property(cc.RichText)
    label_add_type1 = []

    /** @type {cc.Label} */
    @property(cc.Label)
    label_note = null

    /** @type {cc.Node} */
    @property(cc.Node)
    bg = null
    /** @type {cc.Node} */
    @property(cc.Node)
    btn0 = null
    /** @type {cc.Node} */
    @property(cc.Node)
    btn1 = null

    onShow() {
        this.update_addnumber()

        this.label_note.node.active = AppKit.SdkManager.IsNative()

        if (wxTools.usewx) {
            this.btn0.active = true
            this.btn1.active = false
            this.bg.height = C.bg_1
            this.btn0.y = C.btn0_1
        } else if (fbInTools.usefbIn) {
            this.btn0.active = false
            this.btn1.active = true
            this.bg.height = C.bg_1
        } else if (AppKit.SdkManager.IsNative() && false) {
            this.btn0.active = true
            this.btn1.active = true
            this.bg.height = C.bg_2
            this.btn0.y = C.btn0_2
        } else {
            this.btn0.active = true
            this.btn1.active = false
            this.bg.height = C.bg_1
            this.btn0.y = C.btn0_1
        }
        this.bg.getComponentsInChildren(cc.Widget).forEach((x) => {
            x.enabled = true
        })
        CCTools.WidgetsUpdateAlignment(this.bg)
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
}
