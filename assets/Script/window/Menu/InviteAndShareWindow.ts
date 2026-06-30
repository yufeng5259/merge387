import { UIWindow } from '../../GameKit/ui/UIWindow';
import { InviteRewardsPanel } from '../Item/InviteRewardsPanel';
import { _decorator, Button, Color, find, game, instantiate, Label, LabelOutline, Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, tween, Tween, UITransform, Vec2, Vec3, v2, Widget, sp } from 'cc';
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

    @property(Button)
    bounceButton=null;

    @property(Label)
    invitationLabel=null;

    @property(Label)
    progressBarLabel=null;

    @property(ProgressBar)
    progressBar=null;


    inviteCount=0;
    label_add_type0 = []
    label_add_type1 = []
    randomPackParent = null
    onShow() {

        this.invitationLabel.string="Your code:"+Game.SUser.data.invitationCode
        this.progressBar.progress=Game.SUser.data.invitationNum/10;
        this.progressBarLabel.string=Game.SUser.data.invitationNum+"/10";
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
        let dpos = parent.getComponent(UITransform)!.convertToNodeSpaceAR(this.bounceButton.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO, new Vec3()), new Vec3())
        InviteRewardsPanel.Show(meta, {parent:parent, pos:dpos, height:this.bounceButton.node.getComponent(UITransform)!.height})
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
                AppKit.ShareWrap.FacebookInvite(templeteStr,()=>{});
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
