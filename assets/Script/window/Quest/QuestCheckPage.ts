import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
/** @author fengyong-2019-2-20 */

const { ccclass, property } = cc._decorator
const C = {
    FAKE_DATA: false,   // 是否使用伪数据用来测试界面，不与服务器交互
    MONTH_DAYS: 28,
    BAR_MIN: 43,
    BAR_MAX7: 120,
    BAR_MAX: 425,
}

@ccclass
export default class QuestCheckPage extends cc.Component {

    /** @type {cc.Node[]} month进度的宝箱，4个 */
    @property(cc.Node)
    month_box = []

    /** @type {cc.Node} month进度条，考虑层级关系不使用自带pb，使用一个矩形替代，参数在C中 */
    @property(cc.Node)
    month_pb = null

    /** @type {cc.Node[]} daily界面week签到的单个框 */
    @property(cc.Node)
    week_box = []

    /** @type {cc.Button} */
    @property(cc.Button)
    btn = null

    /** @type {cc.Label} */
    @property(cc.Label)
    btn_string = null

    @property(cc.SpriteFrame)
    spf_week_box_normal = null

    @property(cc.SpriteFrame)
    spf_week_box_golden = null

    data = null

    show() {
        if (C.FAKE_DATA) { cc.warn("注意：check-page 正在使用fake-data模式") }
        this.get_data().then(v => {
            if (!this.node) return
            this.node.active = true
            this.update_page(v)
        }, e =>{})
    }

    /** 获取check-page所依赖的数据 */
    get_data() {
        return new Promise((res, rej) => {
            // old_data
            if (this.data) { res(this.data); return }
            if (C.FAKE_DATA) {
                // fake-data
                let data = {
                    signWeekDay: 2,                 // 周签到可以领取到的天
                    signWeekRewards: 1,             // 周签到已经领取到的天
                    signMonthDay: 27,               // 月签到可以领取到的天
                    signMonthRewards: [7],           // 月签到已经领取过的天
                }
                res(data)
            } else {
                // real-data
                let sr = SR.SRSign.getSignData()
                sr.SetCallBack(v => { res(v.sign) })
                sr.SetErrorCallBack(() => { rej() })
                sr.Send()
            }
        })
    }

    /** 更新签到页面 */
    update_page(data) {
        this.data = data
        // 界面修改
        // month
        if (data.signMonthDay <= 7) this.month_pb.width = C.BAR_MIN + (C.BAR_MAX7 - C.BAR_MIN) * data.signMonthDay / 7
        else this.month_pb.width = Math.min(C.BAR_MAX, C.BAR_MAX7 + (C.BAR_MAX - C.BAR_MAX7) * (data.signMonthDay-7) / (C.MONTH_DAYS-7))
        for (let i = 0; i < this.month_box.length; i += 1) {
            let btn = this.month_box[i].getComponent(cc.Button)
            let light = GameKit.ControllerTable.GetNode(this.month_box[i], "light")
            let sp_box = GameKit.ControllerTable.GetNode(this.month_box[i], "sp-box").getComponent(cc.Sprite)
            let quest_bubble = GameKit.ControllerTable.GetNode(this.month_box[i], "quest-bubble")
            let bubble_award = GameKit.ControllerTable.GetNode(this.month_box[i], "bubble-award")
            let reward1 = GameKit.ControllerTable.GetComponent(this.month_box[i], "reward1", "ContentModel")
            let reward2 = GameKit.ControllerTable.GetComponent(this.month_box[i], "reward2", "ContentModel")
            light.active = false
            let days = 7 + i * 7
            if (data.signMonthRewards.includes(days)) {
                // 已经领取
                btn.interactable = false
                sp_box.setState(1)
                quest_bubble.active = false
            } else {
                // 还未领取
                let canreceive = data.signMonthDay >= days
                sp_box.setState(0)
                quest_bubble.active = true
                // 可以领取，+抖动动画
                if (canreceive) {
                    sp_box.node.runAction(cc.sequence(
                        cc.moveBy(0.3, 0, 5).easing(cc.easeOut(2)),
                        cc.moveBy(0.5, 0, -5).easing(cc.easeBounceOut()),
                        cc.moveBy(0.3, 0, 5).easing(cc.easeOut(2)),
                        cc.moveBy(0.5, 0, -5).easing(cc.easeBounceOut()),
                        cc.delayTime(1),
                    ).repeatForever())
                    light.active = true
                }
            }
            let rewards = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days).Reward()
            reward1.show(rewards[0])
            reward2.show(rewards[1])
            bubble_award.active = false
        }
        // week
        for (let i = 0; i < this.week_box.length; i += 1) {
            let meta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, i + 1)
            let sp = this.week_box[i].getComponent(cc.Sprite)
            let day_string = GameKit.ControllerTable.GetNode(this.week_box[i],"day-string").getComponent(cc.Label)
            let award_icon = GameKit.ControllerTable.GetNode(this.week_box[i], 'award-icon').getComponent(cc.Sprite)
            let award_value = GameKit.ControllerTable.GetNode(this.week_box[i], 'award-value-string').getComponent(cc.Label)
            let received = GameKit.ControllerTable.GetNode(this.week_box[i], 'received')
            // 更改样式:normal状态,golden状态
            meta.Reward()[0].Icon(award_icon)
            award_value.string = BigNumber.format(meta.Reward()[0].Count())
            if (i === data.signWeekRewards && data.signWeekDay > data.signWeekRewards) {
                // golden
                received.active = false
                sp.spriteFrame = this.spf_week_box_golden
                day_string.node.color = cc.Color.WHITE
                award_value.node.color = cc.Color.WHITE
                award_value.getComponent(cc.LabelOutline).enabled = true
            } else {
                // normal
                received.active = i < data.signWeekRewards
                sp.spriteFrame = this.spf_week_box_normal
                day_string.node.color = cc.color().fromHEX("#ab5e33")
                award_value.node.color = cc.color().fromHEX("#692c0a")
                award_value.getComponent(cc.LabelOutline).enabled = false
            }
        }
        // sign-btn
        this.btn.interactable = data.signWeekDay > data.signWeekRewards
        this.btn_string.string = data.signWeekDay > data.signWeekRewards ? GameKit.i18n.t("quest_center_window_check_do") : GameKit.i18n.t("quest_center_window_check_done")
    }

    /** 点击事件：获取月签到奖励宝箱 */
    event_get_month_box_reward(e, days) {
        if (this.data.signMonthDay >= days) {
            new Promise((res, rej) => {
                // old-data，本地缓存变动
                this.data.signMonthRewards.push(days)
                if (C.FAKE_DATA) {
                    // fake-data
                    res()
                } else {
                    // real-data
                    let sr = SR.SRSign.receiveSignMonthReward(Number.parseInt(days))
                    sr.SetCallBack(v => { res(v) })
                    sr.SetErrorCallBack(() => { rej() })
                    sr.Send()
                }
            }).then(() => {
                // 界面变动
                e.target.getComponent(cc.Button).interactable = false
                GameKit.ControllerTable.GetNode(e.target, "sp-box").getComponent(cc.Sprite).setState(1)
                GameKit.ControllerTable.GetNode(e.target, "quest-bubble").active = false
                GameKit.ControllerTable.GetNode(e.target, "bubble-award").active = false
                // 取消抖动动画
                GameKit.ControllerTable.GetNode(e.target, "sp-box").stopAllActions()
                GameKit.ControllerTable.GetNode(e.target, "light").active = false
                // 获取奖励
                // UIRoot.instance.openChildWindow("GetRewardWindow", {
                //     contents: Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days).Reward()
                // })
            }, e =>{})
        } else {
            let reward = GameKit.ControllerTable.GetNode(e.target, "bubble-award")
            if (reward.active) {
                reward.active = false
            } else {
                reward.active = true
                reward.scale = 0.001
                reward.stopAllActions()
                reward.runAction(cc.scaleTo(0.15, 1, 1))
            }
        }
    }

    /** 点击事件：当前签到 */
    event_sign() {
        new Promise((res, rej) => {
            // old-data，本地缓存变动
            this.data.signWeekRewards += 1
            if (C.FAKE_DATA) {
                // fake-data
                res()
            } else {
                // real-data
                let sr = SR.SRSign.receiveSignWeekReward(this.data.signWeekDay)
                sr.SetCallBack(v => { res(v) })
                sr.SetErrorCallBack(() => { rej() })
                sr.Send()
            }
        }).then(() => {
            // 样式修改
            this.btn.interactable = false
            this.btn_string.string = GameKit.i18n.t("quest_center_window_check_done")
            // received动画
            let n = GameKit.ControllerTable.GetNode(this.week_box[this.data.signWeekDay - 1], 'received')
            n.active = true
            n.scale = 0
            // n.opacity = 0
            n.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.5, 1).easing(cc.easeExponentialOut()),
                    // cc.fadeIn(0.5),
                    cc.callFunc(() => {
                        let i = this.data.signWeekDay - 1
                        let sp = this.week_box[i].getComponent(cc.Sprite)
                        let day_string = GameKit.ControllerTable.GetNode(this.week_box[i], "day-string").getComponent(cc.Label)
                        let award_value = GameKit.ControllerTable.GetNode(this.week_box[i], 'award-value-string').getComponent(cc.Label)
                        sp.spriteFrame = this.spf_week_box_normal
                        day_string.node.color = cc.color().fromHEX("#ab5e33")
                        award_value.node.color = cc.color().fromHEX("#692c0a")
                        award_value.getComponent(cc.LabelOutline).enabled = false
                    }),
                ),
                // cc.delayTime(0.5),
                cc.callFunc(() => {
                    // UIRoot.instance.openChildWindow("GetRewardWindow", {
                    //     contents: Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, this.data.signWeekDay).Reward()
                    // })
                }),
            ))
        }, e =>{})
    }
}
