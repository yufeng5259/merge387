import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { RandomChestPanel } from '../Item/RandomChestPanel';
const { ccclass, property } = cc._decorator
const C = {
    FAKE_DATA: false,   // 是否使用伪数据用来测试界面，不与服务器交互
    MONTH_DAYS: 28,
    BAR_MIN: 0,
    BAR_MAX: 444,
}
let monthDays = [8, 15, 22, 28]

@ccclass
export default class SignWindow extends UIWindow {

    static windowPath = "Quest/SignWindow";

    /** @type {cc.Node[]} month进度的宝箱，4个 */
    @property(cc.Node)
    month_box = []

    /** @type {cc.Node} month进度条，考虑层级关系不使用自带pb，使用一个矩形替代，参数在C中 */
    @property(cc.Node)
    month_pb = null

    /** @type {cc.Node} month进度条开始图标 */
    @property(cc.Node)
    month_StartSp = null

    /** @type {cc.Node[]} daily界面week签到的单个框 */
    @property(cc.Node)
    week_box = []

    /** @type {cc.Button} */
    @property(cc.Button)
    btn = null

    /** @type {cc.Label} */
    @property(cc.Label)
    totalLab = null

    data = null

    onShow() {
        if (C.FAKE_DATA) { cc.warn("注意：check-page 正在使用fake-data模式") }
        this.get_data().then(v => {
            if (!this.node) return
            this.node.active = true
            this.needSign = v.signWeekRewards < v.signWeekDay
            this.update_page(v)
        }, e =>{})
    }

    /** 获取check-page所依赖的数据 */
    get_data() {
        return new Promise((res, rej) => {
            // old_data
            if (this.data) { res(this.data); return }
            if (C.FAKE_DATA) {
                // fake-data-test
                let data = {
                    signWeekDay: 2,                 // 周签到可以领取到的天
                    signWeekRewards: 1,             // 周签到已经领取到的天
                    signMonthDay: 27,               // 月签到可以领取到的天
                    signMonthRewards: [7],           // 月签到已经领取过的天
                }
                res(data)
            } else {
                // real-data
                //let sr = SR.SRSign.getSignData()
                //sr.SetCallBack(v => { res(v.sign) })
                //sr.SetErrorCallBack(() => { rej() })
                //sr.Send()
                res(GameKit.DataCache.GetData("signData"))
            }
        })
    }

    /** 更新签到页面 */
    update_page(data) {
        this.data = data
        // 界面修改
        
        // month
        if (this.needSign) this.data.signMonthDay--
        this.totalLab.string =this.data.signMonthDay;
        this.month_pb.width = C.BAR_MAX * (Math.max(0, Math.min(1, this.data.signMonthDay / 8)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 8) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 15) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 22) / 6))) / 4
        for (let i = 0; i < this.month_box.length; i += 1) {
            let btn = this.month_box[i].getComponent(cc.Button)
            let light = GameKit.ControllerTable.GetNode(this.month_box[i], "light")
            let sp_box = GameKit.ControllerTable.GetNode(this.month_box[i], "sp-box").getComponent(cc.Sprite)
            let dotComp = GameKit.ControllerTable.GetNode(this.month_box[i], "dotComp")
            let bubble_award = GameKit.ControllerTable.GetNode(this.month_box[i], "bubble-award")
            let reward1 = GameKit.ControllerTable.GetComponent(this.month_box[i], "reward1", "ContentModel")
            let reward2 = GameKit.ControllerTable.GetComponent(this.month_box[i], "reward2", "ContentModel")
            let sp_box_open = GameKit.ControllerTable.GetNode(this.month_box[i], "sp-box_open")
            light.active = false
            let days = monthDays[i]
            if (this.data.signMonthRewards.includes(days)||data.signMonthDay > days) {
                // 已经领取
                //btn.interactable = false
                sp_box.node.active = false
                dotComp.active = true
                sp_box_open.active = true
                sp_box_open.getComponent(cc.Sprite).setState(1)
            } else {
                // 还未领取
                let canreceive = this.data.signMonthDay >= days
                sp_box.node.active = true
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
                sp_box_open.active = false
                dotComp.active = false
            }
            let rewards = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days).Reward()
            if (rewards[0]) reward1.show(rewards[0])
            if (rewards[1]) reward2.show(rewards[1])
            bubble_award.active = false
        }
        // week
        for (let i = 0; i < this.week_box.length; i += 1) {
            let meta = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, i + 1)
            let spAnim = GameKit.ControllerTable.GetNode(this.week_box[i], 'spAnim')
            let spCurrent = GameKit.ControllerTable.GetNode(this.week_box[i], 'spCurrent')
            let labelDay = GameKit.ControllerTable.GetComponent(this.week_box[i], 'labelDay', cc.Label)
            let reward = GameKit.ControllerTable.GetComponent(this.week_box[i], 'reward', "ContentModel")
            let spMonth = GameKit.ControllerTable.GetNode(this.week_box[i], 'spMonth')
            // 更改样式:normal状态,golden状态
            if (meta.Reward()[1]) {
                let r2 = cc.instantiate(reward.node)
                r2.parent = reward.node.parent
                reward.node.x = -40
                r2.x = 40
                r2.setSiblingIndex(reward.node.getSiblingIndex() + 1)
                r2.getComponent("ContentModel").show(meta.Reward()[1])
                if (i < this.data.signWeekRewards) {
                    r2.getComponent("ContentModel").icon.node.opacity = 180
                    r2.getComponent("ContentModel").countWithColor.node.active = false
                }
                if (meta.Reward()[2]) r2.x = -60
            }
            if (meta.Reward()[2] && meta.Reward()[3]) {
                let r3 = cc.instantiate(reward.node)
                r3.parent = reward.node.parent
                r3.x = 60
                r3.setSiblingIndex(reward.node.getSiblingIndex() + 2)
                r3.getComponent("ContentModel").show(meta.Reward()[2])
                let r4 = cc.instantiate(reward.node)
                r4.parent = reward.node.parent
                r4.x = 180
                r4.setSiblingIndex(reward.node.getSiblingIndex() + 3)
                r4.getComponent("ContentModel").show(meta.Reward()[3])
                
                reward.node.x = -180
            }
            reward.show(meta.Reward()[0])
            if (i < this.data.signWeekRewards) {
                labelDay.node.color = cc.color(180,180,180)
                reward.icon.node.opacity = 180
                reward.countWithColor.node.active = false
            }
            spMonth.active = false
            spAnim.active = i >= this.data.signWeekRewards
            spCurrent.active = i == this.data.signWeekDay - 1 && this.data.signWeekDay > this.data.signWeekRewards
        }
    }

    /** 点击事件：获取月签到奖励宝箱 */
    event_get_month_box_reward(e, days) {
        let ePos = cc.Vec2(e.target.node.x,e.target.node.y);
        ePos = e.target.getWorldPosition()
        console.log(monthDays[3],"days",days,ePos);
        
        if (days == monthDays[3]) {
            let rewards = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days).Reward()
            RandomChestPanel.Show(rewards[0].Id(), {parent:this.btn.node.parent, pos:ePos, height:60})
            return
        }
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

    /** 点击事件：当前签到 */
    event_sign() {
        this.btn.interactable = false
        
        if (!this.needSign) {
            this.closeAnim()
            return
        }
        let DD = this.data.signMonthDay+1;
        let metaT = Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, this.data.signWeekDay).Id();
        let metaDD =  Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, DD)
        let metaD =metaDD?metaDD.Id():0;

        new Promise((res, rej) => {
            // old-data，本地缓存变动
            if (C.FAKE_DATA) {
                // fake-data
                res()
            } else {
                // real-data
               
                let sr = SR.SRSign.receiveSignWeekReward(this.data.signWeekDay,metaT,metaD)
                sr.SetCallBack(v => { 
                    if (v.chest1) {
                        // GameKit.DataCache.SetData("UserCardChest", v.chest1)
                        let chestArr = GameKit.DataCache.GetData("UserCardChestArr")
                        if(!chestArr){
                            chestArr=[]
                        }
                        chestArr=chestArr.concat(v.chest1)
                        GameKit.DataCache.SetData("UserCardChestArr", chestArr)
                    }
                    if (v.chest2) {
                        GameKit.DataCache.SetData("UserCardChestN", v.chest2)
                    }
                    if (v.randomPack1) {
                        GameKit.DataCache.SetData("UserRandomPack", v.randomPack1)
                    }
                    if (v.randomPack2) {
                        GameKit.DataCache.SetData("UserRandomPackN", v.randomPack2)
                    }
                    //this.data.signWeekRewards += 1
                    res(v) 
                })
                sr.SetErrorCallBack(() => { rej() })
                sr.Send()
            }
        }).then(() => {
            // received动画
            let n = GameKit.ControllerTable.GetNode(this.week_box[this.data.signWeekDay - 1], 'spAnim')
            // n.opacity = 0
            n.runAction(cc.sequence(
                cc.spawn(
                    cc.rotateTo(0.3, -10),
                    cc.fadeOut(0.5),
                    cc.moveBy(0.5, 30, -50)
                ),
                cc.callFunc(() => {
                    UIRoot.instance.openChildWindow("GetRewardWindow", {
                        contents: Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Week, this.data.signWeekDay).Reward(),
                        showCallback: (wnd) => {
                            wnd.addOnCloseFunc(() => {
                                if (this.data.signMonthDay >= monthDays[3]) { 
                                    this.scheduleOnce(() => {
                                        this.closeAnim()
                                    }, 0.5)
                                    return
                                }
                                let spMonth = GameKit.ControllerTable.GetNode(this.week_box[this.data.signWeekDay - 1], 'spMonth')
                                spMonth.active = true
                                
                                spMonth.scale = 1.2/2
                                spMonth.runAction(cc.sequence( 
                                    cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1/2).easing(cc.easeBounceOut())),
                                    cc.delayTime(0.3),
                                    cc.spawn(
                                        cc.sequence(cc.scaleTo(0.15, 0, 1.5/2),cc.scaleTo(0.15, -1, 1),cc.scaleTo(0.15, 0, 1.5/2),cc.scaleTo(0.15, 1, 1)),
                                        //cc.sequence(cc.delayTime(0.55), cc.fadeOut(0.05)),
                                        cc.moveBy(0.6, this.month_StartSp.getWorldPosition().sub(spMonth.getWorldPosition()))
                                    ),
                                    cc.callFunc(() => {
                                        //月签增加
                                        this.data.signMonthDay++
                                        this.totalLab.string = this.data.signMonthDay
                                        let width = C.BAR_MAX * (Math.max(0, Math.min(1, this.data.signMonthDay / 8)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 8) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 15) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 22) / 6))) / 4
                                        this.month_pb.runAction(cc.sequence(cce.sizeTo(0.5, width, this.month_pb.height), cc.callFunc(() => {
                                            spMonth.active = false
                                            let days = 0
                                            if (this.data.signMonthDay == monthDays[0]) days = monthDays[0]
                                            else if (this.data.signMonthDay == monthDays[1]) days = monthDays[1]
                                            else if (this.data.signMonthDay == monthDays[2]) days = monthDays[2]
                                            else if (this.data.signMonthDay == monthDays[3]) days = monthDays[3]
                                            if (days > 0) {
                                                let signData = GameKit.DataCache.GetData("signData")
                                                signData.signMonthRewards.push(days)
                                                GameKit.DataCache.SetData("signData", signData)
                                                let e = this.month_box[monthDays.indexOf(days)]
                                                let sp_box = GameKit.ControllerTable.GetNode(e, "sp-box")
                                                sp_box.runAction(cc.sequence(
                                                    cc.rotateTo(0.1, 5),
                                                    cc.rotateTo(0.2, -5),
                                                    cc.rotateTo(0.2, 5),
                                                    cc.rotateTo(0.1, 0),
                                                ))
                                                GameKit.ControllerTable.GetNode(e, "light").active = true

                                                //let sr = SR.SRSign.receiveSignMonthReward(Number.parseInt(days))
                                                //sr.SetCallBack(v => { 
                                                this.scheduleOnce(() => {
                                                    this.data.signMonthRewards.push(days)
                                                    // 界面变动
                                                    GameKit.ControllerTable.GetNode(e, "dotComp").active = true
                                                    sp_box.runAction(cc.fadeOut(0.3))
                                                    let sbo = GameKit.ControllerTable.GetNode(e, "sp-box_open")
                                                    sbo.active = true
                                                    sbo.opacity = 0
                                                    sbo.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(0.5), cc.callFunc(() => {
                                                        let ccn = GameKit.DataCache.GetData("UserCardChestN")
                                                        if (ccn) {
                                                            let chestArr = GameKit.DataCache.GetData("UserCardChestArr")
                                                            if(!chestArr){
                                                                chestArr=[]
                                                            }
                                                            chestArr=chestArr.concat(ccn)
                                                            GameKit.DataCache.SetData("UserCardChestArr", chestArr)
                                                            // GameKit.DataCache.SetData("UserCardChest", ccn)
                                                            GameKit.DataCache.RemoveData("UserCardChestN")
                                                        }
                                                        let rpn = GameKit.DataCache.GetData("UserRandomPackN")
                                                        if (rpn) {
                                                            GameKit.DataCache.SetData("UserRandomPack", rpn)
                                                            GameKit.DataCache.RemoveData("UserRandomPackN")
                                                        }
                                                        UIRoot.instance.openChildWindow("GetRewardWindow", {
                                                            contents: Meta.SignMeta.GetByTypeDay(Meta.SignMeta.Types.Month, days).Reward(),
                                                            showCallback: (wnd) => {
                                                                wnd.addOnCloseFunc(() => {
                                                                    this.scheduleOnce(() => {
                                                                        this.closeAnim()
                                                                    }, 0.5)
                                                                })
                                                            }
                                                        })
                                                    })))
                                                    GameKit.ControllerTable.GetNode(e, "light").active = false
                                                }, 0.5)
                                                //})
                                                //sr.Send()
                                            } else {
                                                this.scheduleOnce(() => {
                                                    this.closeAnim()
                                                }, 0.5)
                                            }
                                        })))
                                    })
                                ))
                            })
                        }
                    })
                }),
            ))
            GameKit.ControllerTable.GetNode(this.week_box[this.data.signWeekDay - 1], 'spCurrent').runAction(cc.fadeOut(0.4))

            
        }, e =>{})
    }
}
