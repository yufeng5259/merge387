import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { UITabContainer } from '../../GameKit/ui/UITabContainer';
import { UserInfoModel } from '../UserInfoModel';
import { _decorator, Button, Color, find, game, instantiate, Label, LabelOutline, Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, tween, Tween, UITransform, Vec2, Vec3, v2, Widget, sp } from 'cc';
import { User } from '../../game/user/User';
/**
 * @author fengyong
 * @version 2018-8-14
 */

const { ccclass, property, executeInEditMode } = _decorator

/** 界面配置参数 */
const C = {
    /** 伪数据长度 */
    FAKE_DATA_LENGTH: 0,
    /** 伪等待时间 */
    FAKE_WAIT_TIME: 1,
    /** 载入sprite旋转一圈的时间 */
    LOADING_ROTATION_TIME: 0.5,
    /** 伪偷取金币 */
    FAKE_STOLE_COIN: "15K",

    /** news类型枚举 */
    NEWS_TYPE: {
        ATTACK: "attack",    // 锤子
        SHIELD: "shield",    // 盾牌
        RAID: "raid",      // 猪
        INVITE: "invited",   // 邀请

        SuperShield: "superShield",
        SuperShieldGold: "superShieldGold",
    }
}

/**
 * VillageNews界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
export default class VillageNewsWindow extends UIWindow {

    static windowPath = "Menu/VillageNewsWindow"
    static getPresentNum: () => number

    kingdomMessageLoaded = false
    mailMessageLoaded = false
    data_array: any = null
    presentList: any = null

    /** @type {SpriteFrame} 默认头像 */
    @property(SpriteFrame)
    default_avatar_sf = null

    @property(SpriteFrame)
    type_icon_hammer = null

    @property(SpriteFrame)
    type_icon_sheild = null

    @property(SpriteFrame)
    type_icon_pig = null

    @property(SpriteFrame)
    type_icon_invite = null
    @property(SpriteFrame)
    type_icon_supershield = null
    @property(SpriteFrame)
    type_icon_supershieldGold = null

    /** @type {UITabContainer} tab node数组 */
    @property(UITabContainer)
    tab_node_array = null

    /** @type {ScrollViewTool} ScrollViewTool组件 */
    @property(ScrollViewTool)
    svt = null
    /** @type {ScrollViewTool} ScrollViewTool组件 */
    @property(ScrollViewTool)
    svtMail = null
    /** @type {Node} */
    @property(Node)
    mailBadge = null

    /** @type {Node} 加载数据的动画圈 */
    @property(Node)
    loading_circle = null

    onShow(showParams) {
        let defIndex = 0
        if (showParams.mail) defIndex = 1

        this.tab_node_array.onShow((index, tab, first) => {
            if (first) {
                setTimeout(() => {this.event_change_to_tab(index)},300)
            } else {
                this.event_change_to_tab(index)
            }
        }, defIndex)

        this.updateMailBadge()
    }

    event_change_to_tab(index = 0) {
        if (index == 0) {
            this.event_update_data()
        } else if (index == 1) {
            this.event_get_mails()
        }
    }

    //////////////////////////////////////////////////
    // Kingdom
    /** 事件，动态更新数据
     * - 可以供给外部调用
     */
    event_update_data() {
        this.svt.node.active = true
        this.svtMail.node.active = false
        if (this.kingdomMessageLoaded) return
        // 加载动画
        this.open_loading_anima()
        this.get_news_data().then(v => {
            if (!this.node || !this.node.isValid)return
            //console.time("VillageNewsWindow")
            this.update_all_item(v)
            //console.timeEnd("VillageNewsWindow")
            this.close_loading_anima()
            this.kingdomMessageLoaded = true
        }, e =>{})
    }

    /** 刷新所有的item
     * @param {[{}]} data_array
     */
    update_all_item(data_array = []) {
        this.svt.scrollView.scrollToTop(0.1)
        this.svt.clear()
        let item_count = data_array.length
        let ranks = []
        for (let i = 0; i < item_count; i++) { ranks.push(i) }
        this.svt.setItem(
            ranks,
            /**
             * @param {Node} itemHandle item节点
             */
            (index, id, itemHandle) => {
                // 获取对应组件（node）
                // 注意各个子节点的名称正确
                // 注意要把对应的节点拖入ControllerTables下面
                let userinfo = GameKit.ControllerTable.GetNode(itemHandle, "userinfo").getComponent(UserInfoModel)
                let avatar = GameKit.ControllerTable.GetNode(itemHandle, "avatar").getComponent(Sprite)
                let log = GameKit.ControllerTable.GetNode(itemHandle, "log").getComponent(RichText)
                let type_icon = GameKit.ControllerTable.GetNode(itemHandle, "type_icon").getComponent(Sprite)
                let time = GameKit.ControllerTable.GetNode(itemHandle, "time").getComponent(Label)
                let vip_nameIcon = GameKit.ControllerTable.GetNode(itemHandle, "vip_nameIcon")
                // 根据数据写入
                let data = data_array[index] ///? index?id?
                if (data === undefined) {
                    // 无数据
                    // 本界面内，无数据则不显示
                } else {
                    // 有数据
                    userinfo.show(new User().updateData(data["user"]))
                    // 不同界面的信息域内容不同，因此要根据界面调整User信息域与界面信息的处理
                    // avatar.spriteFrame = this.default_avatar_sf
                    let isVip = data["user"]["isVip"] && !G.GameConfig.closeVIP && AppKit.SdkManager.IsNative()
                    vip_nameIcon.active = isVip;
                    switch (data["type"]) {
                        case C.NEWS_TYPE.ATTACK:
                            log.string = String.format(GameKit.i18n.t("village_news_log_hammer"), data["user"]["name"])
                            if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_hammer_vip"), data["user"]["name"])
                            type_icon.spriteFrame = this.type_icon_hammer;
                            break;
                        case C.NEWS_TYPE.SHIELD:
                            log.string = String.format(GameKit.i18n.t("village_news_log_shield"), data["user"]["name"])
                            if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_shield_vip"), data["user"]["name"])
                            type_icon.spriteFrame = this.type_icon_sheild;
                            break;
                        case C.NEWS_TYPE.RAID:
                            log.string = String.format(GameKit.i18n.t("village_news_log_pig"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                            if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_pig_vip"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                            type_icon.spriteFrame = this.type_icon_pig;
                            break;
                        case C.NEWS_TYPE.INVITE:
                            log.string = String.format(GameKit.i18n.t("village_news_log_invite"), data["user"]["name"])
                            if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_invite_vip"), data["user"]["name"])
                            type_icon.spriteFrame = this.type_icon_invite;
                            break;
                        case C.NEWS_TYPE.SuperShield:
                            log.string = String.format(GameKit.i18n.t("village_news_log_shield"), data["user"]["name"])
                            if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_shield_vip"), data["user"]["name"])
                            type_icon.spriteFrame = this.type_icon_supershield;
                            break;
                        case C.NEWS_TYPE.SuperShieldGold:
                            if (data["number"] > 1)
                                log.string = String.format(GameKit.i18n.t("village_news_log_noraid"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                                if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_noraid_vip"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                            else 
                                log.string = String.format(GameKit.i18n.t("village_news_log_shield"), data["user"]["name"])
                                if (isVip) log.string = String.format(GameKit.i18n.t("village_news_log_shield_vip"), data["user"]["name"])
                            type_icon.spriteFrame = this.type_icon_supershieldGold;
                            break;
                        default: break;
                    }
                    time.string = GameKit.TimeUtil.FormatPastTime(GameKit.TimeUtil.getCurrentTime() - data["time"], true)
                }
                // 绑定2个点击事件
                //*/
            }
        )
    }

    /** 获取village_news的数据 */
    get_news_data() {
        return new Promise<any[]>((resolve, reject) => {
            let sr = SR.SRVillage.getVillageNews()
            sr.SetSilence(true)
            sr.SetCallBack(res => {
                let data = res.list
                // 真实数据处理过程
                //// 等待服务器模块写完

                /*/ 伪数据处理过程
                for (let i = 0; i < C.FAKE_DATA_LENGTH; i++) {
                    data.push({
                        user: { name: "TestName", avatar: "" },
                        type: [C.NEWS_TYPE.ATTACK, C.NEWS_TYPE.SHIELD, C.NEWS_TYPE.RAID, C.NEWS_TYPE.INVITE][i % 4],
                        number: C.FAKE_STOLE_COIN,
                        time: i + 1, // 新增时间
                    })
                }//*/

                for (let i = 0; i < data.length; i++) {
                    if (data[i].isFriend && !data[i].user && Game.SUser.FriendsList()[data[i].userId]) {
                        data[i].user = Game.SUser.FriendsList()[data[i].userId].getUserInfo()
                    }
                }

                data.sort((a, b) => {
                    return b.time - a.time
                })

                // 保存数据
                this.data_array = data
                resolve(data)

                GameKit.DataCache.RemoveData("NewMessageNum")
                GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MessageEvent, null)
            })
            sr.SetErrorCallBack(() => {
                reject()
            })
            sr.Send()
        })
        /** 备注：消息格式 
        res = [
            // 单条消息
            {
                user: { name: "", avatar: "" }, // user信息，暂时只包括name和avatar
                type: "",                       // news类型，string格式，C.NEWS_TYPE进行封装
                number: 0,                      // 附加数值，目前仅仅适用于C.NEW_TYPE.RAID类型
                time: 0,                        // 消息时间-格式还未定
            },
            // 一个消息列表
            {}, {}, {},
        ]*/
    }

    /////////////////////////////////////////////////
    // Mail
    event_get_mails() {
        this.svt.node.active = false
        this.svtMail.node.active = true
        if (this.mailMessageLoaded) return
        // 加载动画
        this.open_loading_anima()
        this.get_mail_data().then(v => {
            if (!this.node || !this.node.isValid)return
            //console.time("VillageNewsWindow")
            this.update_mail_item(v)
            //console.timeEnd("VillageNewsWindow")
            this.close_loading_anima()
            this.mailMessageLoaded = true
        }, e =>{})
    }
    
    update_mail_item(data_array = []) {
        this.svtMail.scrollView.scrollToTop(0.1)
        this.svtMail.clear()
        let ranks = []
        for (let id in data_array) {
            if (id == "cid") continue
            ranks.push(id)
        }
        ranks.sort((a, b) => {return b - a})
        this.svtMail.setItem(
            ranks,
            /**
             * @param {Node} itemHandle item节点
             */
            (index, id, itemHandle) => {
                let present = data_array[id]
                let title = GameKit.ControllerTable.GetComponent(itemHandle, "title", Label)
                let reward = GameKit.ControllerTable.GetNode(itemHandle, "reward")
                let rewardParent = GameKit.ControllerTable.GetNode(itemHandle, "rewardParent")
                let btnCollect = GameKit.ControllerTable.GetComponent(itemHandle, "btnCollect", Button)
                let btnCollectLabel = GameKit.ControllerTable.GetNode(itemHandle, "btnCollectLabel")
                let time = GameKit.ControllerTable.GetComponent(itemHandle, "time", Label)
                let spCongrats = GameKit.ControllerTable.GetNode(itemHandle, "spCongrats")

                title.string = present.title

                rewardParent.destroyAllChildren()
                Game.Content.FromStrings(present.rewards).forEach(content => {
                    let rewardIns = instantiate(reward)
                    rewardIns.parent = rewardParent
                    rewardIns.active = true
                    rewardIns.getComponent("ContentModel").show(content)
                })

                btnCollect.node.targetOff(this)
                btnCollectLabel.color = new Color(6, 92, 17)
                if (present.received) {
                    btnCollect.interactable = false
                    btnCollect.inScrollView = true
                    btnCollectLabel.color = new Color(88, 88, 88)
                } else {
                    setTimeout(()=>{btnCollect.inScrollView = false}, 100)
                    btnCollect.interactable = true
                    btnCollect.node.on("click", ()=>{
                        let req = SR.SRVillage.collectPresent(id)
                        req.SetCallBack(function(res) {
                            present.received = true
                            btnCollect.interactable = false
                            btnCollect.inScrollView = true
                            btnCollectLabel.color = new Color(88, 88, 88)

                            this.updateMailBadge()
                        }.bind(this))
                        req.Send()
                    }, this)
                }

                time.node.active = present.expire > 0
                time.string = String.format(GameKit.i18n.t("village_news_expire"), GameKit.TimeUtil.FormatSomeTime(present.expire - GameKit.TimeUtil.getCurrentTime(), true))

                spCongrats.active = !!present.congrats

                itemHandle.node.targetOff(this)
                itemHandle.node.on("click", () => {
                    UIRoot.instance.openChildWindow("MessageMailDetailWindow", {present:present})
                }, this)
            }
        )
    }

    /** 获取village_news的数据 */
    get_mail_data() {
        return new Promise<any>((resolve, reject) => {
            let presentList = GameKit.DataCache.GetData("UserPresentList")
            if (presentList) {
                let currentTime = GameKit.TimeUtil.getCurrentTime()
                let exIds = []
                for (let id in presentList) {
                    if (id == "cid") continue
                    let present = presentList[id]
                    if (present.expire > 0 && currentTime > present.expire) exIds.push(id)
                }
                exIds.forEach(x => {delete presentList[x]})
                if (exIds.length > 0) GameKit.DataCache.SetData("UserPresentList", presentList)
            }
            this.presentList = presentList || {}
            resolve(this.presentList)
        })
    }

    updateMailBadge() {
        this.mailBadge.active = VillageNewsWindow.getPresentNum() > 0
    }

    /////////////////////////////////////////////////
    // Public

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /** 打开loading动画 */
    open_loading_anima() {
        Tween.stopAllByTarget(this.loading_circle)
        this.loading_circle.active = true
        tween(this.loading_circle)
            .repeatForever(tween<Node>().by(C.LOADING_ROTATION_TIME, { angle: 360 }))
            .start()
    }

    /** 关闭loading动画 */
    close_loading_anima() {
        Tween.stopAllByTarget(this.loading_circle)
        this.loading_circle.active = false
    }
}

VillageNewsWindow.getPresentNum = function() {
    let presentNum = 0
    let presentList = GameKit.DataCache.GetData("UserPresentList")
    if (presentList) {
        let currentTime = GameKit.TimeUtil.getCurrentTime()
        for (let id in presentList) {
            if (id == "cid") continue
            let present = presentList[id]
            if (present.expire > 0 && currentTime > present.expire) continue
            if (!present.received) presentNum++
        }
    }
    return presentNum
}
