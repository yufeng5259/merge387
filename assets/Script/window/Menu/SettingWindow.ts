import { UIWindow } from '../../GameKit/ui/UIWindow';
import { _decorator, Button, Color, find, game, instantiate, Label, LabelOutline, Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, tween, Tween, UITransform, Vec2, Vec3, v2, Widget, sp } from 'cc';
/**
 * @author fengyong
 * @version 2018-8-8
 */

const { ccclass, property, executeInEditMode } = _decorator

/** 界面配置参数 */
const C = {
    SWITCH_LINGSHENG_KEY: "SettingSwitch_lingsheng",
    SWITCH_TIXING_KEY: "SettingSwitch_tixing",
    SWITCH_ZHENDONG_KEY: "SettingSwitch_zhendong",
}
/**
 * Setting界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class SettingWindow extends UIWindow {

    static windowPath = "Menu/SettingWindow"

    /** @type {SpriteFrame} 开关开状态 */
    @property(SpriteFrame)
    on_sf = null

    /** @type {SpriteFrame} 开关关状态 */
    @property(SpriteFrame)
    off_sf = null

    /** @type {Sprite} 开关-sound */
    @property(Sprite)
    switch_sound = null

    /** @type {Sprite} 开关-music */
    @property(Sprite)
    switch_music = null
    
    /** @type {Sprite} 开关-lingsheng */
    @property(Sprite)
    switch_lingsheng = null
    
    /** @type {Sprite} 开关-tixing */
    @property(Sprite)
    switch_tixing = null
    
    /** @type {Sprite} 开关-zhendong */
    @property(Sprite)
    switch_zhendong = null

    /** @type {Sprite} 开关-raid */
    @property(Sprite)
    switch_raid = null

    /** @type {Sprite} 开关-general */
    @property(Sprite)
    switch_general = null

    /** @type {Label} userId */
    @property(Label)
    label_userId = null

    /** @type {Label} version */
    @property(Label)
    label_version = null

    /** @type {Label} currentLanguage */
    @property(Label)
    label_currentLanguage = null

    /** @type {Node} LowBattery */
    @property(Node)
    spLowBattery = null
    /** @type {Sprite} 开关-LowBattery */
    @property(Sprite)
    switch_LowBattery = null

    /** @type {Node} btn_restore */
    @property(Node)
    btn_restore = null

    /** @type {Node} btn_delete删除账号 */
    @property(Node)
    btn_delete = null

    //默认隐藏，显示服务器地址，app版本，game版本
    @property(Label)
    label_dev = null

    onShow() {
        this.updateDevLabel()
        this.label_dev.node.active=false
        

        // 未来需要传入本地存储进行更新
        this.update_choose()

        this.label_userId.string = "uid:" + Game.SUser.UserId()
        this.label_version.string = "v" + G.GameConfig.version

        this.label_currentLanguage.string = GameKit.i18n.t("setting_language_" + GameKit.i18n.getLang())
        
        this.spLowBattery.active = (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos())
        this.btn_restore.active = (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos())
    }
    event_toggleDev(){
        if (!this.label_dev || !this.label_dev.node) return
        if (!this.label_dev.node.active) {
            this.updateDevLabel()
        }
        this.label_dev.node.active=!this.label_dev.node.active
    }

    updateDevLabel() {
        if (!this.label_dev) return

        let appVersion = "0"
        try {
            appVersion = AppKit.NativeWrap.getVersion()
        } catch (e) {}

        this.label_dev.string =
            "portal: " + G.GameConfig.portal + "\n" +
            "app: " + appVersion + "\n" +
            "game: " + G.GameConfig.version + "\n" +
            "hu: " + G.GameConfig.huversion
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /** 点击事件：language */
    event_change_language() {
        UIRoot.instance.openChildWindow("SettingLanguageWindow")
    }

    /** 点击事件：更改sound */
    event_change_sound() {
        // 更改本地数据
        GameKit.SoundManager.changeSoundSwitch()
        // 更改样式
        this.update_choose()
    }

    /** 点击事件：更改music */
    event_change_music() {
        // 更改本地数据
        GameKit.SoundManager.changeBGMSwitch()
        // 更改样式
        this.update_choose()
    }

    /** 点击事件：更改notify_raid */
    event_change_notify_raid() {
        // 更改本地数据
        AppKit.NotificationWrap.changeRaidSwitch()
        // 更改样式
        this.update_choose()
    }

    /** 点击事件：更改notify_general */
    event_change_notify_general() {
        // 更改本地数据
        AppKit.NotificationWrap.changeGeneralSwitch()
        // 更改样式
        this.update_choose()
    }
    
    static getSettingSwitch = function(key) {
        let sw = sys.localStorage.getItem(key)
        if (sw == null) return true
        return sw == "true" || sw > 0
    }

    static setSettingSwitch = function(key, value) {
        sys.localStorage.setItem(key, value ? 1 : 0)
    }

    static getLingshengSwitch = function() {
        return SettingWindow.getSettingSwitch(C.SWITCH_LINGSHENG_KEY)
    }

    static getTixingSwitch = function() {
        return SettingWindow.getSettingSwitch(C.SWITCH_TIXING_KEY)
    }

    static getZhendongSwitch = function() {
        return SettingWindow.getSettingSwitch(C.SWITCH_ZHENDONG_KEY)
    }

    event_change_lingsheng() {
        SettingWindow.setSettingSwitch(C.SWITCH_LINGSHENG_KEY, !SettingWindow.getLingshengSwitch())
        this.update_choose()
    }

    event_change_tixing() {
        SettingWindow.setSettingSwitch(C.SWITCH_TIXING_KEY, !SettingWindow.getTixingSwitch())
        this.update_choose()
    }

    event_change_zhendong() {
        SettingWindow.setSettingSwitch(C.SWITCH_ZHENDONG_KEY, !SettingWindow.getZhendongSwitch())
        this.update_choose()
    }

    static getLowBatterySwitch = function() {
        let sw = sys.localStorage.getItem("LowBatterySwitch")
        if (sw == null) sw = false
        else {
            if (sw == "false") sw = false
            else sw = true
        }
        return sw
    }
    event_change_lowBattery() {
        let sw = SettingWindow.getLowBatterySwitch()

        sw = !sw
        sys.localStorage.setItem("LowBatterySwitch", sw)
        if (sw) { this.switch_LowBattery.spriteFrame = this.on_sf } else { this.switch_LowBattery.spriteFrame = this.off_sf }
        if (sw && !GameKit.PlayerPrefs.GetBool("LowBatteryTip", false)) {
            GameKit.PlayerPrefs.SetBool("LowBatteryTip", true)
            DialogWindow.Show(GameKit.i18n.t("setting_lowbattery_tip"))
        }
        
        if (sw) game.setFrameRate(30)
        else game.setFrameRate(60)
    }

    /** 更新4个位置的选中状态 */
    update_choose(sound = true, music = true, raid = true, general = true) {
        sound = GameKit.SoundManager.getSoundSwitch()
        music = GameKit.SoundManager.getBGMSwitch()
        raid = AppKit.NotificationWrap.getRaidSwitch()
        general = AppKit.NotificationWrap.getGeneralSwitch()
        let lingsheng = SettingWindow.getLingshengSwitch()
        let tixing = SettingWindow.getTixingSwitch()
        let zhendong = SettingWindow.getZhendongSwitch()
        if (sound) { this.switch_sound.spriteFrame = this.on_sf } else { this.switch_sound.spriteFrame = this.off_sf }
        if (music) { this.switch_music.spriteFrame = this.on_sf } else { this.switch_music.spriteFrame = this.off_sf }
        if (this.switch_lingsheng) { this.switch_lingsheng.spriteFrame = lingsheng ? this.on_sf : this.off_sf }
        if (this.switch_tixing) { this.switch_tixing.spriteFrame = tixing ? this.on_sf : this.off_sf }
        if (this.switch_zhendong) { this.switch_zhendong.spriteFrame = zhendong ? this.on_sf : this.off_sf }
        if (raid) { this.switch_raid.spriteFrame = this.on_sf } else { this.switch_raid.spriteFrame = this.off_sf }
        if (general) { this.switch_general.spriteFrame = this.on_sf } else { this.switch_general.spriteFrame = this.off_sf }
        
        let sw_lb = SettingWindow.getLowBatterySwitch()
        if (sw_lb) { this.switch_LowBattery.spriteFrame = this.on_sf } else { this.switch_LowBattery.spriteFrame = this.off_sf }
    }

    on_click_follow() {
        if (fbInTools.usefbIn) {
            if (window.open) window.open("https://www.facebook.com/SlotsVille-1962616787117495/");
        } else if (wxTools.usewx) {
            UIRoot.instance.openChildWindow("FollowWindow") 
        }
    }

    on_click_tutorial() {
        //let req = SR.SRLogin.clearProgress()
        //req.Send()
    }

    on_click_support() {
        if (wxTools.usewx) {
            if (wxTools.SdkVersionOver('2.0.3') >= 0) {
                wx.openCustomerServiceConversation({})
            } else {
                DialogWindow.Show(GameKit.i18n.t("wxVersionNoSupport"), () => {
                    UIRoot.instance.openChildWindow("FollowWindow") 
                })
            }
        } else if (AppKit.SdkManager.IsNative()) {
            sys.openURL("mailto:coingangster@163.com?subject=Help&body=uid:" + Game.SUser.UserId())
        } else {
            if (window.open) window.open("https://getcoingang.com/");
        }
    }

    on_click_feature_not_open() {
        DialogWindow.Show(GameKit.i18n.t("setting_feature_not_open"))
    }

    on_click_privacyPolicy() {
        if (AppKit.SdkManager.IsNative()) {
            sys.openURL("https://getcoingang.com/privacy.html")
        } else if (window.open) window.open("https://getcoingang.com/privacy.html");
    }

    on_click_team() {
        if (window.open) window.open("https://getcoingang.com/");
    }

    on_click_restore() {
        AppKit.PaymentWrap.Restore()
    }

    on_click_delete() {
        this.event_close()
        UIRoot.instance.openChildWindow("DeleteWindow")
    }
}


/* 界面相关数据（根据截图获取）

背景大小：530*930
标题大小：310*95
0-子背景：490*140
1-子背景：490*180
2-子背景：490*127
3-子背景：490*176
背景间隔：10
小按钮大小：240*60
内部背景大小：n*490
按钮大小：56*233
字颜色RGB：102,44,28
字描边颜色RGB：102,47,57
语言字体颜色RGB：41,84,0
uuid字体颜色：164,108,87

*/
