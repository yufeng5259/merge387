import { sp } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import { InviteRewardsPanel } from '../Item/InviteRewardsPanel';
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
    
    static windowPath = "Menu/InviteAndShareWindow"

    @property(sp.Skeleton)
    ani=null;

    @property(cc.Button)
    bounceButton=null;

    @property(cc.Label)
    invitationLabel=null;

    @property(cc.Label)
    progressBarLabel=null;

    @property(cc.ProgressBar)
    progressBar=null;


    inviteCount=0;
    onShow() {

        this.invitationLabel.string="Your code:"+Game.SUser.data.invitationCode
        this.progressBar.progress=Game.SUser.data.invitationNum/10;
        this.progressBarLabel.string=Game.SUser.data.invitationNum+"/10";
        // this.update_addnumber()

        // this.label_note.node.active = AppKit.SdkManager.IsNative()

        // if (wxTools.usewx) {
        //     this.btn0.active = true
        //     this.btn1.active = false
        //     this.bg.height = C.bg_1
        //     this.btn0.y = C.btn0_1
        // } else if (fbInTools.usefbIn) {
        //     this.btn0.active = false
        //     this.btn1.active = true
        //     this.bg.height = C.bg_1
        // } else if (AppKit.SdkManager.IsNative() && false) {
        //     this.btn0.active = true
        //     this.btn1.active = true
        //     this.bg.height = C.bg_2
        //     this.btn0.y = C.btn0_2
        // } else {
        //     this.btn0.active = true
        //     this.btn1.active = false
        //     this.bg.height = C.bg_1
        //     this.btn0.y = C.btn0_1
        // }
        // this.bg.getComponentsInChildren(cc.Widget).forEach((x) => {
        //     x.enabled = true
        // })
        // CCTools.WidgetsUpdateAlignment(this.bg)
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
    //点击显示奖励
    event_show_bounce(){
        let count=Game.SUser.data.invitationNum;
        if(count<1)count=1
        if(count>10)count=10
        var meta=Meta.InviteRewardsMeta.GetContentByInviteCount(count)
        let window = CCTools.getComponentInParent(this.node, "UIWindow")
        let windowBg = null
        if (window) {
            windowBg = window.node
            let ecas = windowBg.getComponentsInChildren("EnterCloseAnim")
            for (let i = 0; i < ecas.length; i++) {
                if (ecas[i].node.name != "sprite - model") {
                    windowBg = ecas[i].node
                    break
                }
            }
        }
        let parent = this.randomPackParent||windowBg||this.bounceButton.node.parent
        let dpos = parent.convertToNodeSpaceAR(this.bounceButton.node.convertToWorldSpaceAR(cc.Vec2.ZERO))
        InviteRewardsPanel.Show(meta, {parent:parent, pos:dpos, height:this.bounceButton.node.height})
    }
    // /** 点击事件：默认分享按钮 */
    event_share_default() {
        let img = 'tex/sh01.png'
        if (AppKit.SdkManager.IsNative()) img = null
        AppKit.ShareWrap.share(GameKit.i18n.t("ShareInviteNew"), img, {intent:"INVITE", type:"spain_invite", 
            url:"https://getcoinbeach.com/?inviteId="+Game.SUser.UserId()}, null, "spain_invite")
        //AppKit.LogEventWrap.logAppAnalytic("invite")
    }
    event_invite_facebook() {
        let code=Game.SUser.invitationCode;
        let templeteStr="Fill in the invitation code "+code+" for additional rewards.";
        if (AppKit.SdkManager.IsNative()) {
            if (Game.SUser.IsGuest()) {
                UIRoot.instance.openChildWindow("AccountBindWindow")
            } else {
                ShareWrap.FacebookInvite(templeteStr,()=>{});
            }
            return
        } 
    }

    /** 点击事件：facebook分享按钮 */
    // event_share_facebook() {
    //     //this.event_share_default()
    //     if (AppKit.SdkManager.IsNative()) {
    //         if (Game.SUser.IsGuest()) {
    //             UIRoot.instance.openChildWindow("AccountBindWindow")
    //         } else {
    //             //AppKit.LogEventWrap.logAppAnalytic("invite")
    //             AppKit.ShareWrap.inviteNew(GameKit.i18n.t("ShareInviteNew"), 'tex/sh01.png', {intent:"INVITE", type:"spain_invite"}, null, "spain_invite")
    //         }
    //         return
    //     } 
    //     AppKit.ShareWrap.share(GameKit.i18n.t("ShareInviteNew"), 'tex/sh01.png', {intent:"INVITE", type:"spain_invite"}, null, "spain_invite")
    // }

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
