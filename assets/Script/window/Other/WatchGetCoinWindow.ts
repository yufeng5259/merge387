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
    DEFAULT_COIN_ADD: 210000,
}

/**
 * WatchGetSpin界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class WatchGetCoinWindow extends UIWindow {

    static windowPath = "Other/WatchGetCoinWindow"

    /** @type {cc.Label} 增加的数值lable */
    @property(cc.Label)
    add_label = null

    onShow() {
        this.add_label.string = String.format(GameKit.i18n.t("watch_coin"), GameKit.StringUtil.formatNumber(this.get_coin_add_number()))
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /** 点击事件：watch */
    event_watch() {
        this.closeAnim()
        Logs.Warning("WatchGetCoinWindow:45 event_watch")
        AppKit.ADWrap.ShowVideo(() => {
            let oldCoin = Game.SUser.Coin()
            let req = SR.SRUserData.finishVideoCoin(true)
            req.SetCallBack(() => {
                let adCoinTime = GameKit.PlayerPrefs.GetInt("adCoinTime", 0)
                if (GameKit.TimeUtil.getCurrentHalfDay() !== adCoinTime) {
                    GameKit.PlayerPrefs.SetInt("adCoinCount", 0)
                    GameKit.PlayerPrefs.SetInt("adCoinTime", GameKit.TimeUtil.getCurrentHalfDay())
                }
                let adCoinCount = GameKit.PlayerPrefs.GetInt("adCoinCount", 0)
                GameKit.PlayerPrefs.SetInt("adCoinCount", adCoinCount + 1)
                GameKit.PlayerPrefs.SetInt("adCoinTipCount", -5)

                if (GameMainWindow.instance) {
                    GameMainWindow.instance.updateCoinAd()

                    GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin, 0)
                    GameMainWindow.instance.playAddCoinAnim()
                    GameMainWindow.instance.scheduleOnce(() => {
                        GameMainWindow.instance.userinfo.changeCoin(oldCoin, Game.SUser.Coin(), 0.8)
                    }, 1)
                }
            })
            req.Send()
        }, "WatchGetCoinWindow")
    }

    /** 获取coin_add的值
     * @returns {number}
     */
    get_coin_add_number() {
        let adGetCoinMeta = Meta.MetaManager.GetMeta(Meta.MetaType.AdGetCoin, Game.SUserVillage.MapId())
        return adGetCoinMeta.CoinByTip()
    }

}
