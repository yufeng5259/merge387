import { UIWindow } from '../../GameKit/ui/UIWindow';
import { UITabContainer } from '../../GameKit/ui/UITabContainer';
import QuestCheckPage from './QuestCheckPage';
import QuestDailyPage from './QuestDailyPage';
import QuestInvitePage from './QuestInvitePage';
/** @author fengyong-2019-2-18 */

const { ccclass, property } = cc._decorator
const C = {
    DEFAULT_INDEX: 0,
}

@ccclass
class QuestCenterWindow extends UIWindow {

    static windowPath = "Quest/QuestCenterWindow"

    @property(UITabContainer)
    tab_node_array = null

    @property('QuestDailyPage')
    daily_page = null

    @property('QuestInvitePage')
    invite_page = null

    @property('QuestCheckPage')
    check_page = null

    /** @type {cc.Node} 签到红点 */
    @property(cc.Node)
    signBadge = null

    /** @type {cc.Node} 任务红点 */
    @property(cc.Node)
    taskBadge = null

    onShow() {
        this.tab_node_array.onShow((index, tab, first) => {
            if (first) {
                setTimeout(() => {this.event_change_to_tab(index)},300)
            } else {
                this.event_change_to_tab(index)
            }
        }, C.DEFAULT_INDEX)

        this.signBadge.active = false
        let signData = GameKit.DataCache.GetData("signData")
        if (signData) {
            let canSignWeek = false
            let canSignMonth = false
            canSignWeek = signData.signWeekDay > signData.signWeekRewards
            for (let i = 7; i <= 28; i+=7) {
                if (signData.signMonthDay >= i && !signData.signMonthRewards.includes(i)) {
                    canSignMonth = true
                    break
                }
            }
            this.signBadge.active = canSignWeek || canSignMonth
        }

        this.taskBadge.active = false
        let taskCount = GameKit.DataCache.GetData("UserTaskCompleteCount") || 0
        //this.taskBadge.active = taskCount > 0

        AppKit.LogEventWrap.logEvent("window_questcenter")
    }

    onClose() {
        // 手动清理1次缓存数据，js垃圾回收的延迟可能会导致一些bug
        this.daily_page.data = null
        this.check_page.data = null
        // 清理任务刷新回调
        this.unscheduleAllCallbacks()
    }

    // 各界面的show\hide逻辑，在show逻辑中进行初始化操作

    show_daily_page() { this.daily_page.show();this.taskBadge.active = false }
    show_invite_page() { this.invite_page.show() }
    show_check_page() { this.check_page.show();this.signBadge.active = false }
    hide_daily_page() { this.daily_page.node.active = false }
    hide_invite_page() { this.invite_page.node.active = false }
    hide_check_page() { this.check_page.node.active = false }
    hide_all() {
        this.hide_daily_page()
        this.hide_invite_page()
        this.hide_check_page()
    }

    /** 界面关闭按钮 */
    event_close() {
        this.closeAnim()
    }

    /** tab按钮 */
    event_change_to_tab(index) {
        this.hide_all()
        switch (index) {
            default: case 0: this.show_check_page(); break;
            case 1: this.show_check_page(); break;
            case 2: this.show_check_page(); break;
        }
    }
}
