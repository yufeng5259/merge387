import { UIWindow } from '../../GameKit/ui/UIWindow';
import SpinAnim from '../../game/slot/anim/SpinAnim';
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
 * 新用户来自好友邀请获取奖励窗口
 * @class
 */
@ccclass
class GetInviteRewardsWindow extends UIWindow {
    
    static windowPath = "Menu/GetInviteRewardsWindow"

    @property(cc.Node)
    bg=null;

    @property(cc.Node)
    alertLabel=null;

    @property(cc.EditBox)
    editbox=null;

    @property(SpinAnim)
    spinAnim=null;

    // spinAnim:require('SpinAnim'),

    onShow() {
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
    event_get(){
        if (GamePlay.instance.isBusy()) return
        // console.log(this.editbox.string,'+++'+this.editbox)
        let code=this.editbox.string;
        if(code.length<=1){
            this.errorHandler();
            return;
        }

        // this.successHandler()
        // Game.SUser.data.inviteId=1

        let sr =SR.SRInvitationUser.invitationUser(this.editbox.string,(res)=>{
            if(res.dataCode!=0){
                Game.SUser.updateData(res.userData.data)
                this.successHandler()
            }else{
                this.errorHandler()
            }
            console.log(res,'res');            
        });
        sr.Send();


        // SR.SRInvitationUser.invitationUser(this.editbox.String,(res)=>{
        //     console.log("xxkkkkxs"+res);
        //     // if(res.isWrong==1){
        //     //     //验证码错误
        //     //     errorHandler();
        //     // }else{
        //     //     //验证码正确，关闭窗口并播放增加体力动画
        //     //     
        //     // }
        // }).Send();
    }
    successHandler(){
        this.spinAnim.play(0, -340, 0.5, ()=>{
            this.closeAnim(()=>{});
        })
    }
    errorHandler(){
        this.ScreenShake();
        this.alertLabel.active = true;
        setTimeout(() => {
            this.alertLabel.active = false;
        }, 3000);
    }
    ScreenShake() {
        let t = 0.03
        let d = 6

        this.bg.node.runAction(cc.sequence(cc.moveBy(t, d, -d),cc.moveBy(t, -d, -d),cc.moveBy(t, -d, d),cc.moveBy(t, d, d),cc.moveBy(t, d, -d),cc.moveBy(t, -d, -d),cc.moveBy(t, -d, d),cc.moveBy(t, d, d),cc.moveBy(t, d, -d),cc.moveBy(t, -d, -d),cc.moveBy(t, -d, d),cc.moveBy(t, d, d),cc.moveBy(t, d, -d),cc.moveBy(t, -d, -d),cc.moveBy(t, -d, d),cc.moveBy(t, d, d)))
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }
}
