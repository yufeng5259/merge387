import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { UserInfoModel } from '../UserInfoModel';
/**
 * @author fengyong
 * @version 2018-8-16
 */

let UIRoot = window.UIRoot

const { ccclass, property, executeInEditMode } = cc._decorator

/** 界面配置参数 */
const C = {
    /** 默认的spin_add */
    DEFAULT_SPIN_ADD: 1,
}

/**
 * WatchGetSpin界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class WatchGetSpinWindow extends UIWindow {

    static windowPath = "Other/WatchGetSpinWindow"

    /** @type {cc.Label} 增加的数值lable */
    @property(cc.Label)
    add_label = null

    onShow() {
        this.add_label.string = String.format(GameKit.i18n.t("watch_spin"), this.get_spin_add_number())
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /** 点击事件：watch */
    event_watch() {
        this.closeAnim()
        AppKit.ADWrap.ShowVideo(() => {
            let req = SR.SRUserData.finishVideoAp()
            req.SetCallBack(() => {
                let adSpinTime = GameKit.PlayerPrefs.GetInt("adSpinTime", 0)
                if (GameKit.TimeUtil.getCurrentHalfDay() !== adSpinTime) {
                    GameKit.PlayerPrefs.SetInt("adSpinCount", 0)
                    GameKit.PlayerPrefs.SetInt("adSpinTime", GameKit.TimeUtil.getCurrentHalfDay())
                }
                let adSpinCount = GameKit.PlayerPrefs.GetInt("adSpinCount", 0)
                GameKit.PlayerPrefs.SetInt("adSpinCount", adSpinCount + 1)
                if (GameMainWindow.instance) GameMainWindow.instance.updateSpinAd()

                let slot = GamePlay.instance.slotNode
                slot.getComponent("UserInfoModel").stopApAt(Game.SUser.Ap() - 1)
                GamePlay.instance.scheduleOnce(() => {
                    slot.getComponent("UserInfoModel").stopApAt(Game.SUser.Ap() -1)
                    slot.isSpining = true
                    slot.getComponent("UserInfoModel").playApAnim(function(){
                        slot.makeIdle()
                    })
                    slot.showSpinAddNumAnim(1)
                }, 0.5)
            })
            req.Send()
        }, "WatchGetSpinWindow")
    }

    /** 获取spin_add的值 */
    get_spin_add_number() {
        // 目前默认为1；未来可能会根据当前用户状态来获取meta数据
        this.spin_add_number = C.DEFAULT_SPIN_ADD
        return this.spin_add_number
    }

}
