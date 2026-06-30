import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { _decorator, Button, Color, Component, Label, LabelOutline, Node, Sprite, SpriteFrame, tween, Tween, UITransform, Vec3 } from 'cc';
/** @author fengyong-2019-2-20 */

const { ccclass, property } = _decorator
const C = {
    FAKE_DATA: false,   // 是否使用伪数据用来测试界面，不与服务器交互
    MONTH_DAYS: 28,
    BAR_MIN: 43,
    BAR_MAX7: 120,
    BAR_MAX: 425,
}

@ccclass
export default class QuestCheckPage extends Component {

    @property([Node])
    month_box = []

    @property(Node)
    month_pb = null

    @property([Node])
    week_box = []

    @property(Button)
    btn = null

    @property(Label)
    btn_string = null

    @property(SpriteFrame)
    spf_week_box_normal = null

    @property(SpriteFrame)
    spf_week_box_golden = null

    data = null

    show() {
        if (C.FAKE_DATA) { console.warn("注意：check-page 正在使用fake-data模式") }
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
        let monthPbTransform = this.month_pb.getComponent(UITransform)
        let monthPbWidth = data.signMonthDay <= 7
            ? C.BAR_MIN + (C.BAR_MAX7 - C.BAR_MIN) * data.signMonthDay / 7
            : Math.min(C.BAR_MAX, C.BAR_MAX7 + (C.BAR_MAX - C.BAR_MAX7) * (data.signMonthDay-7) / (C.MONTH_DAYS-7))
        monthPbTransform.setContentSize(monthPbWidth, monthPbTransform.height)
        for (let i = 0; i < this.month_box.length; i += 1) {
            let btn = this.month_box[i].getComponent(Button)
            let light = GameKit.ControllerTable.GetNode(this.month_box[i], "light")
            let sp_box = GameKit.ControllerTable.GetNode(this.month_box[i], "sp-box").getComponent(Sprite)
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
                    Tween.stopAllByTarget(sp_box.node)
                    const startPos = sp_box.node.position.clone()
                    tween(sp_box.node)
                        .repeatForever(
                            tween()
                                .to(0.3, { position: new Vec3(startPos.x, startPos.y + 5, startPos.z) }, { easing: 'quadOut' })
                                .to(0.5, { position: startPos }, { easing: 'bounceOut' })
                                .to(0.3, { position: new Vec3(startPos.x, startPos.y + 5, startPos.z) }, { easing: 'quadOut' })
                                .to(0.5, { position: startPos }, { easing: 'bounceOut' })
                                .delay(1)
                        )
                        .start()
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
            let sp = this.week_box[i].getComponent(Sprite)
            let day_string = GameKit.ControllerTable.GetNode(this.week_box[i],"day-string").getComponent(Label)
            let award_icon = GameKit.ControllerTable.GetNode(this.week_box[i], 'award-icon').getComponent(Sprite)
            let award_value = GameKit.ControllerTable.GetNode(this.week_box[i], 'award-value-string').getComponent(Label)
            let received = GameKit.ControllerTable.GetNode(this.week_box[i], 'received')
            // 更改样式:normal状态,golden状态
            meta.Reward()[0].Icon(award_icon)
            award_value.string = BigNumber.format(meta.Reward()[0].Count())
            if (i === data.signWeekRewards && data.signWeekDay > data.signWeekRewards) {
                // golden
                received.active = false
                sp.spriteFrame = this.spf_week_box_golden
                day_string.color = Color.WHITE
                award_value.color = Color.WHITE
                award_value.getComponent(LabelOutline).enabled = true
            } else {
                // normal
                received.active = i < data.signWeekRewards
                sp.spriteFrame = this.spf_week_box_normal
                day_string.color = new Color().fromHEX("#ab5e33")
                award_value.color = new Color().fromHEX("#692c0a")
                award_value.getComponent(LabelOutline).enabled = false
            }
        }
        // sign-btn
        this.btn.interactable = data.signWeekDay > data.signWeekRewards
        this.btn_string.string = data.signWeekDay > data.signWeekRewards ? GameKit.i18n.t("quest_center_window_check_do") : GameKit.i18n.t("quest_center_window_check_done")
    }

    /** 点击事件：获取月签到奖励宝箱 */
    event_get_month_box_reward(e, days) {
        if (this.data.signMonthDay >= days) {
            new Promise<void>((res, rej) => {
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
                e.target.getComponent(Button).interactable = false
                GameKit.ControllerTable.GetNode(e.target, "sp-box").getComponent(Sprite).setState(1)
                GameKit.ControllerTable.GetNode(e.target, "quest-bubble").active = false
                GameKit.ControllerTable.GetNode(e.target, "bubble-award").active = false
                // 取消抖动动画
                Tween.stopAllByTarget(GameKit.ControllerTable.GetNode(e.target, "sp-box"))
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
                reward.setScale(0.001, 0.001, reward.scale.z)
                Tween.stopAllByTarget(reward)
                tween(reward).to(0.15, { scale: new Vec3(1, 1, reward.scale.z) }).start()
            }
        }
    }

    /** 点击事件：当前签到 */
    event_sign() {
        new Promise<void>((res, rej) => {
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
            n.setScale(0, 0, n.scale.z)
            // n.opacity = 0
            let i = this.data.signWeekDay - 1
            let sp = this.week_box[i].getComponent(Sprite)
            let day_string = GameKit.ControllerTable.GetNode(this.week_box[i], "day-string").getComponent(Label)
            let award_value = GameKit.ControllerTable.GetNode(this.week_box[i], 'award-value-string').getComponent(Label)
            sp.spriteFrame = this.spf_week_box_normal
            day_string.color = new Color().fromHEX("#ab5e33")
            award_value.color = new Color().fromHEX("#692c0a")
            award_value.getComponent(LabelOutline).enabled = false
            Tween.stopAllByTarget(n)
            tween(n)
                .to(0.5, { scale: new Vec3(1, 1, n.scale.z) }, { easing: 'expoOut' })
                .call(() => {
                    // UIRoot.instance.openChildWindow("GetRewardWindow", {
                    //     contents: Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, this.data.signWeekDay).Reward()
                    // })
                })
                .start()
        }, e =>{})
    }
}
