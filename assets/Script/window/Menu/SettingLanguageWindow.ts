import { UIWindow } from '../../GameKit/ui/UIWindow';
/**
 * @author fengyong
 * @version 2018-8-8
 */

const UIRoot = window.UIRoot
const { ccclass, property, executeInEditMode } = cc._decorator

/** 界面配置参数 */
const C = {
    /** 选中时的字体颜色颜色 */
    COLOR_CHOOSE: cc.color(255,255,187),
    /** 未选中时的字体颜色 */
    COLOR_UNCHOOSE: cc.color(255,255,187),
    /** 选中时的字体描边颜色 */
    COLOR_CHOOSEMB: cc.color(183,105,35),
    /** 未选中时的字体描边颜色 */
    COLOR_UNCHOOSEMB: cc.color(37,165,49),
    
    langs: ["en", "es", "de", "fr", "zh_tw", "ja", "ko", "it", "pt", "he"],
}
/**
 * SettingLanguage界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class SettingLanguageWindow extends UIWindow {

    static windowPath = "Menu/SettingLanguageWindow"

    /** @type {cc.SpriteFrame} 选中的时候的图标 */
    @property(cc.SpriteFrame)
    choose_sf = null

    /** @type {cc.SpriteFrame} 未选中的时候的图标 */
    @property(cc.SpriteFrame)
    unchoose_sf = null

    /** @type {[cc.Node]} language node，需要在编辑器中按照顺序放入 */
    @property(cc.Node)
    language_node_array = []

    onShow() {
        // 更新语言选择
        // 实际需要传入本地存储的参数
        this.update_language_choose(Math.max(0, C.langs.indexOf(GameKit.i18n.getLang())))
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /**
     * 点击事件：修改language
     * @param {cc.EventTouch}} e EventTouch                 
     * @param {number} index CustomEventData 需要在编辑器中指定
     */
    event_change_to_language(e, index = 0) {
        index = Number(index)
        if (index < 0 || index >= C.langs.length) return
        GameKit.i18n.changeto(C.langs[index])
        this.update_language_choose(index)

        BigNumber.setLanguage()
        let settingWindow = UIRoot.instance.GetWindow("SettingWindow")
        if (settingWindow) settingWindow.onShow()
        if (GamePlay.instance) {
            GamePlay.instance.slotNode.getComponent('UserInfoModel')._setAp()
        }
    }

    /** 更新language选择样式 */
    update_language_choose(choose_language = 0) {
        for (let i = 0; i < this.language_node_array.length; i++) {
            let n = this.language_node_array[i]
            if (i === choose_language) {
                // 选中
                n.getComponent(cc.Sprite).spriteFrame = this.choose_sf
                n.getChildByName("label").color = C.COLOR_CHOOSE
                n.getChildByName("label").getComponent(cc.LabelOutline).color = C.COLOR_CHOOSEMB

                
                n.getChildByName("choose_icon").active = true
            } else {
                // 未选中
                n.getComponent(cc.Sprite).spriteFrame = this.unchoose_sf
                n.getChildByName("label").color = C.COLOR_UNCHOOSE
                n.getChildByName("label").getComponent(cc.LabelOutline).color = C.COLOR_UNCHOOSEMB
                n.getChildByName("choose_icon").active = false
            }
        }
    }

}