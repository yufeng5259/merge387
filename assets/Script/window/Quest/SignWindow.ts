import { UIWindow } from '../../GameKit/ui/UIWindow';
import { RandomChestPanel } from '../Item/RandomChestPanel';
import { _decorator, Button, Color, instantiate, Label, Node, Size, Sprite, tween, Tween, UIOpacity, UITransform, Vec3 } from 'cc';

const { ccclass, property } = _decorator
const C = {
    FAKE_DATA: false,   // 是否使用伪数据用来测试界面，不与服务器交互
    MONTH_DAYS: 28,
    BAR_MIN: 0,
    BAR_MAX: 444,
}
let monthDays = [8, 15, 22, 28]

@ccclass('SignWindow')
export default class SignWindow extends UIWindow {

    static windowPath = "Quest/SignWindow";

    @property([Node])
    month_box = []

    @property(Node)
    month_pb = null

    @property(Node)
    month_StartSp = null

    @property([Node])
    week_box = []

    @property(Button)
    btn = null

    @property(Label)
    totalLab = null

    data = null
    needSign = false

    onShow() {
        if (C.FAKE_DATA) { console.warn("注意：check-page 正在使用fake-data模式") }
        this.get_data().then(v => {
            if (!this.node) return
            this.node.active = true
            this.needSign = v.signWeekRewards < v.signWeekDay
            this.update_page(v)
        }, e =>{})
    }

    /** 获取check-page所依赖的数据 */
    get_data() {
        return new Promise<any>((res, rej) => {
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
        let monthPbWidth = C.BAR_MAX * (Math.max(0, Math.min(1, this.data.signMonthDay / 8)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 8) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 15) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 22) / 6))) / 4
        this.setMonthProgressWidth(monthPbWidth)
        for (let i = 0; i < this.month_box.length; i += 1) {
            let btn = this.month_box[i].getComponent(Button)
            let light = GameKit.ControllerTable.GetNode(this.month_box[i], "light")
            let sp_box = GameKit.ControllerTable.GetNode(this.month_box[i], "sp-box").getComponent(Sprite)
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
                sp_box_open.getComponent(Sprite).setState(1)
            } else {
                // 还未领取
                let canreceive = this.data.signMonthDay >= days
                sp_box.node.active = true
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
            let labelDay = GameKit.ControllerTable.GetComponent(this.week_box[i], 'labelDay', Label)
            let reward = GameKit.ControllerTable.GetComponent(this.week_box[i], 'reward', "ContentModel")
            let spMonth = GameKit.ControllerTable.GetNode(this.week_box[i], 'spMonth')
            // 更改样式:normal状态,golden状态
            if (meta.Reward()[1]) {
                let r2 = instantiate(reward.node)
                r2.parent = reward.node.parent
                reward.node.setPosition(-40, reward.node.position.y, reward.node.position.z)
                r2.setPosition(40, r2.position.y, r2.position.z)
                r2.setSiblingIndex(reward.node.getSiblingIndex() + 1)
                r2.getComponent("ContentModel").show(meta.Reward()[1])
                if (i < this.data.signWeekRewards) {
                    let iconNode = r2.getComponent("ContentModel").icon.node
                    let opacity = iconNode.getComponent(UIOpacity) || iconNode.addComponent(UIOpacity)
                    opacity.opacity = 180
                    r2.getComponent("ContentModel").countWithColor.node.active = false
                }
                if (meta.Reward()[2]) r2.setPosition(-60, r2.position.y, r2.position.z)
            }
            if (meta.Reward()[2] && meta.Reward()[3]) {
                let r3 = instantiate(reward.node)
                r3.parent = reward.node.parent
                r3.setPosition(60, r3.position.y, r3.position.z)
                r3.setSiblingIndex(reward.node.getSiblingIndex() + 2)
                r3.getComponent("ContentModel").show(meta.Reward()[2])
                let r4 = instantiate(reward.node)
                r4.parent = reward.node.parent
                r4.setPosition(180, r4.position.y, r4.position.z)
                r4.setSiblingIndex(reward.node.getSiblingIndex() + 3)
                r4.getComponent("ContentModel").show(meta.Reward()[3])
                
                reward.node.setPosition(-180, reward.node.position.y, reward.node.position.z)
            }
            reward.show(meta.Reward()[0])
            if (i < this.data.signWeekRewards) {
                labelDay.color = new Color(180, 180, 180)
                let opacity = reward.icon.node.getComponent(UIOpacity) || reward.icon.node.addComponent(UIOpacity)
                opacity.opacity = 180
                reward.countWithColor.node.active = false
            }
            spMonth.active = false
            spAnim.active = i >= this.data.signWeekRewards
            spCurrent.active = i == this.data.signWeekDay - 1 && this.data.signWeekDay > this.data.signWeekRewards
        }
    }

    /** 点击事件：获取月签到奖励宝箱 */
    private getMonthProgressTransform() {
        return this.month_pb.getComponent(UITransform) || this.month_pb.addComponent(UITransform);
    }

    private setMonthProgressWidth(width: number) {
        const transform = this.getMonthProgressTransform();
        const { height } = transform.contentSize;
        transform.setContentSize(width, height);
    }

    event_get_month_box_reward(e, days) {
        let ePos = e.target.getWorldPosition()
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
            reward.setScale(0.001, 0.001, reward.scale.z)
            Tween.stopAllByTarget(reward)
            tween(reward).to(0.15, { scale: new Vec3(1, 1, reward.scale.z) }).start()
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

        new Promise<void>((res, rej) => {
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
            let nStartPos = n.position.clone()
            let nOpacity = n.getComponent(UIOpacity) || n.addComponent(UIOpacity)
            Tween.stopAllByTarget(n)
            Tween.stopAllByTarget(nOpacity)
            tween(n).to(0.3, { angle: -10 }).start()
            tween(n)
                .to(0.5, { position: new Vec3(nStartPos.x + 30, nStartPos.y - 50, nStartPos.z) })
                .call(() => {
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
                                spMonth.setScale(1.2 / 2, 1.2 / 2, spMonth.scale.z)

                                let spMonthOpacity = spMonth.getComponent(UIOpacity) || spMonth.addComponent(UIOpacity)
                                Tween.stopAllByTarget(spMonth)
                                Tween.stopAllByTarget(spMonthOpacity)
                                tween(spMonthOpacity).to(0.3, { opacity: 255 }).start()
                                tween(spMonth)
                                    .to(0.3, { scale: new Vec3(1 / 2, 1 / 2, spMonth.scale.z) }, { easing: 'bounceOut' })
                                    .delay(0.3)
                                    .call(() => {
                                        let targetWorld = this.month_StartSp.getWorldPosition()
                                        let currentWorld = spMonth.getWorldPosition()
                                        let moveTarget = new Vec3(
                                            spMonth.position.x + targetWorld.x - currentWorld.x,
                                            spMonth.position.y + targetWorld.y - currentWorld.y,
                                            spMonth.position.z,
                                        )
                                        tween(spMonth)
                                            .to(0.15, { scale: new Vec3(0, 1.5 / 2, spMonth.scale.z) })
                                            .to(0.15, { scale: new Vec3(-1, 1, spMonth.scale.z) })
                                            .to(0.15, { scale: new Vec3(0, 1.5 / 2, spMonth.scale.z) })
                                            .to(0.15, { scale: new Vec3(1, 1, spMonth.scale.z) })
                                            .start()
                                        tween(spMonth)
                                            .to(0.6, { position: moveTarget })
                                            .call(() => {
                                                this.data.signMonthDay++
                                                this.totalLab.string = this.data.signMonthDay
                                                let width = C.BAR_MAX * (Math.max(0, Math.min(1, this.data.signMonthDay / 8)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 8) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 15) / 7)) + Math.max(0, Math.min(1, (this.data.signMonthDay - 22) / 6))) / 4
                                                let monthPbTransform = this.getMonthProgressTransform()
                                                Tween.stopAllByTarget(monthPbTransform)
                                                let { height } = monthPbTransform.contentSize
                                                tween(monthPbTransform)
                                                    .to(0.5, { contentSize: new Size(width, height) })
                                                    .call(() => {
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
                                                            Tween.stopAllByTarget(sp_box)
                                                            tween(sp_box)
                                                                .to(0.1, { angle: 5 })
                                                                .to(0.2, { angle: -5 })
                                                                .to(0.2, { angle: 5 })
                                                                .to(0.1, { angle: 0 })
                                                                .start()
                                                            GameKit.ControllerTable.GetNode(e, "light").active = true

                                                            this.scheduleOnce(() => {
                                                                this.data.signMonthRewards.push(days)
                                                                GameKit.ControllerTable.GetNode(e, "dotComp").active = true
                                                                let spBoxOpacity = sp_box.getComponent(UIOpacity) || sp_box.addComponent(UIOpacity)
                                                                Tween.stopAllByTarget(spBoxOpacity)
                                                                tween(spBoxOpacity).to(0.3, { opacity: 0 }).start()
                                                                let sbo = GameKit.ControllerTable.GetNode(e, "sp-box_open")
                                                                sbo.active = true
                                                                let sboOpacity = sbo.getComponent(UIOpacity) || sbo.addComponent(UIOpacity)
                                                                sboOpacity.opacity = 0
                                                                Tween.stopAllByTarget(sboOpacity)
                                                                tween(sboOpacity)
                                                                    .to(0.5, { opacity: 255 })
                                                                    .delay(0.5)
                                                                    .call(() => {
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
                                                                    })
                                                                    .start()
                                                                GameKit.ControllerTable.GetNode(e, "light").active = false
                                                            }, 0.5)
                                                        } else {
                                                            this.scheduleOnce(() => {
                                                                this.closeAnim()
                                                            }, 0.5)
                                                        }
                                                    })
                                                    .start()
                                            })
                                            .start()
                                    })
                                    .start()
                            })
                        }
                    })
                })
                .start()
            tween(nOpacity).to(0.5, { opacity: 0 }).start()
            let spCurrent = GameKit.ControllerTable.GetNode(this.week_box[this.data.signWeekDay - 1], 'spCurrent')
            let spCurrentOpacity = spCurrent.getComponent(UIOpacity) || spCurrent.addComponent(UIOpacity)
            Tween.stopAllByTarget(spCurrentOpacity)
            tween(spCurrentOpacity).to(0.4, { opacity: 0 }).start()

            
        }, e =>{})
    }
}
