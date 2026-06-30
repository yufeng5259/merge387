import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { UITabContainer } from '../../GameKit/ui/UITabContainer';
import { UserInfoModel } from '../UserInfoModel';
import { _decorator, Button, Color, find, game, instantiate, Label, LabelOutline, Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, tween, Tween, UITransform, Vec2, Vec3, v2, Widget, sp } from 'cc';
import { User } from '../../game/user/User';
/**
 * @author fengyong
 * @version 2018-8-9
 */

const { ccclass, property, executeInEditMode } = _decorator

/** 界面配置参数 */
const C = {
    /** item个数 */
    ITEM_COUNT: 25,
    /** item显示个数最小值 */
    ITEM_SHOW_MIN: 3,
    /** item显示个数最大值 */
    ITEM_SHOW_MAX: 25,
    /** 伪数据长度 */
    FAKE_DATA_LENGTH: 4,
    /** 伪等待时间 */
    FAKE_WAIT_TIME: 1,
    /** 载入sprite旋转一圈的时间 */
    LOADING_ROTATION_TIME: 0.5,
    /** 默认邀请时增加的 */
    DEFAULT_INVITE_ADD: 35,
}
var fakeVipList = [22359,203107,18352,24408,31663,86638,44921,55207,61811,86707,27283,25296,195677,63532,85235,92884,68579,145861,119596,391362,23810,37934,25987,52585,88820,56885,118227,36265,49393,53526]
/**
 * Leaderboard界面
 * - 包含各类按钮的点击事件处理
 * @class
 */
@ccclass
class LeaderboardWindow extends UIWindow {

    static windowPath = "Menu/LeaderboardWindow"

    choose_tab: any = null
    data_array_friends: any = null
    data_array_country: any = null
    data_array_global: any = null

    /** @type {SpriteFrame} 选中的时候的图标 */
    @property(SpriteFrame)
    choose_sf = null

    /** @type {SpriteFrame} 未选中的时候的图标 */
    @property(SpriteFrame)
    unchoose_sf = null

    /** @type {SpriteFrame} 默认头像 */
    @property(SpriteFrame)
    default_avatar_sf = null

    /** @type {[Sprite]} cup sf数组 */
    @property(SpriteFrame)
    cup_sf_array = []

    /** @type {UITabContainer} tab node数组 */
    @property(UITabContainer)
    tab_node_array = null

    /** @type {ScrollViewTool} ScrollViewTool组件 */
    @property(ScrollViewTool)
    svt = null

    /** @type {Node} 加载数据的动画圈 */
    @property(Node)
    loading_circle = null

    /** @type {[Node]}  */
    @property(Node)
    itemsfirst = []

    onShow() {
        
        this.tab_node_array.onShow((index, tab, first) => {
            if (first) {
                setTimeout(() => {this.event_change_to_tab(index)},300)
            } else {
                this.event_change_to_tab(index)
            }
        })
    }

    /** 点击事件：close */
    event_close() {
        this.closeAnim()
    }

    /**
     * 点击事件：修改language
     * @param {number} index CustomEventData 需要在编辑器中指定
     */
    event_change_to_tab(index = 0) {
        // 避免重复点击
        if (this.choose_tab === Number(index)) { return }
        // 更改tab样式
        this.update_tab_choose(Number(index))
        // 加载动画
        this.open_loading_anima()
        // 更改内部数据
        let data_array
        let nindex = index
        switch (Number(index)) {
            case 0:
                this.get_friends_data().then(v => {
                    if (!this.node || !this.node.isValid) return
                    if (this.choose_tab != nindex) return
                    this.update_all_item(v)
                    this.close_loading_anima()
                }, e =>{})
                break;
            case 1:
                this.get_county_data().then(v => {
                    if (!this.node || !this.node.isValid) return
                    if (this.choose_tab != nindex) return
                    this.update_all_item(v)
                    this.close_loading_anima()
                }, e =>{})
                break;
            case 2:
                this.get_global_data().then(v => {
                    if (!this.node || !this.node.isValid) return
                    if (this.choose_tab != nindex) return
                    this.update_all_item(v)
                    this.close_loading_anima()
                    
                }, e =>{})
                break;
            default: break;
        }
    }

    /** 点击事件：打开invite界面 */
    event_invite() {
        UIRoot.instance.openChildWindow("InviteWindow")
    }
    /** 更新tab选择样式 */
    update_tab_choose(choose_tab = 0) {
        this.choose_tab = choose_tab
        /*for (let i = 0; i < this.tab_node_array.length; i++) {
            let n = this.tab_node_array[i]
            if (i === choose_tab) {
                // 选中
                //n.getComponent(Sprite).spriteFrame = this.choose_sf
                n.getComponent(Sprite).enabled = true
            } else {
                // 未选中
                //n.getComponent(Sprite).spriteFrame = null // this.unchoose_sf
                n.getComponent(Sprite).enabled = false
            }
        }*/
    }

    /** 刷新所有的item
     * @param {[{}]} data_array
     */
    update_all_item(data_array = []) {
        this.svt.scrollView.scrollToTop(0.1)
        this.svt.clear()
        
        let item_count = data_array.length
        if (this.choose_tab === 0 && !G.GameConfig.closeShare) item_count = data_array.length + 2
        let ranks = []
        let haveSelf = false
        for (let i = 0; i < item_count; i++) { 
            if (i > 2) ranks.push(i) 
            if (data_array[i] && data_array[i].UserId() == Game.SUser.UserId()) {
                haveSelf = true
            }
        }
        if (!haveSelf) ranks.push(item_count)

        this.svt.setItem(
            ranks,
            /**
             * @param {Node} itemHandle item节点
             */
            (_index, id, itemHandle) => {
                // 获取对应组件（node）
                // 注意各个子节点的名称正确
                // 注意要把对应的节点拖入ControllerTables下面
                let userinfo = GameKit.ControllerTable.GetNode(itemHandle, "userinfo").getComponent(UserInfoModel)
                let cup = GameKit.ControllerTable.GetNode(itemHandle, "cup").getComponent(Sprite)
                let index_label = GameKit.ControllerTable.GetNode(itemHandle, "index_label").getComponent(Label)
                let avatar = GameKit.ControllerTable.GetNode(itemHandle, "avatar").getComponent(Sprite)
                let name = GameKit.ControllerTable.GetNode(itemHandle, "name").getComponent(Label)
                let level_label = GameKit.ControllerTable.GetNode(itemHandle, "level_label").getComponent(Label)
                let invite = GameKit.ControllerTable.GetNode(itemHandle, "btn_invite")
                let invite_add = GameKit.ControllerTable.GetNode(itemHandle, "icon_label").getComponent(Label)
                let bgSelf = GameKit.ControllerTable.GetNode(itemHandle, "bgSelf")
                let btn_bg = GameKit.ControllerTable.GetNode(itemHandle, "btn_bg")
                btn_bg.vdata = null;
                // 根据数据写入
                let index = _index// + 3
                let data = data_array[index]; ///? index?id?
                if (data && data.UserId() != Game.SUser.UserId() && fakeVipList.contains(data.UserId()) && !Object.keys(Game.SUser.FriendsList()).contains(data.UserId())) {
                    data.data.isVip = true
                }
                if (data === undefined && index != item_count) {
                    // 无数据
                    cup.spriteFrame = null
                    index_label.string = index + 1
                    avatar.spriteFrame = this.default_avatar_sf
                    name.string = ""
                    level_label.string = ""
                    level_label.node.parent.active = false
                    invite.active = true
                    invite_add.string = String.format(GameKit.i18n.t("invite_addnumber_type0"), this.get_add_number())
                    bgSelf.active = false
                } else if (index == item_count) {
                    data = Game.SUser
                    userinfo.show(data)
                    cup.spriteFrame = null 
                    index_label.string = ""
                    level_label.string = data.Star()
                    level_label.node.parent.active = true
                    invite.active = false
                    bgSelf.active = true
                } else {
                    // 有数据
                    // 采用User信息数据域的方式显示
                    userinfo.show(data)
                    // 不同界面的信息域内容不同，因此要根据界面调整User信息域与界面信息的处理
                    if (index === 0) { cup.spriteFrame = this.cup_sf_array[0] }
                    else if (index === 1) { cup.spriteFrame = this.cup_sf_array[1] }
                    else if (index === 2) { cup.spriteFrame = this.cup_sf_array[2] }
                    else { cup.spriteFrame = null }
                    cup.node.active = false;
                    if(index<3){
                        cup.node.active = true;
                    }
                    index_label.string = index + 1
                    level_label.string = data.Star()
                    level_label.node.parent.active = true
                    invite.active = false
                    bgSelf.active = data.UserId() == Game.SUser.UserId()
                    
                }
                if (btn_bg) {
                    btn_bg.vdata = data;
                    btn_bg.node.on(Node.EventType.TOUCH_END,function() {
                        if(this.svt.scrollView.isScrolling()){
                            // console.log("???");
                            return;
                        }
                        if (data) {
                            // console.log("click:="+data);
                            UIRoot.instance.openChildWindow("OtherPlayerWindow",btn_bg.vdata);
                        }
                        
                    },this)
                }
               
               
            }
        )
        // let execFirst = (index) => {
        //     let itemHandle = this.itemsfirst[index]
        //     let userinfo = GameKit.ControllerTable.GetNode(itemHandle, "userinfo").getComponent(UserInfoModel)
        //     let avatar = GameKit.ControllerTable.GetNode(itemHandle, "avatar").getComponent(Sprite)
        //     let name = GameKit.ControllerTable.GetNode(itemHandle, "name").getComponent(Label)
        //     let level_label = GameKit.ControllerTable.GetNode(itemHandle, "level_label").getComponent(Label)
        //     avatar.spriteFrame = this.default_avatar_sf
        //     name.string = ""
        //     level_label.string = "0"
        //     userinfo.spVip.active = false

        //     let data = data_array[index]
        //     if (data) {
        //         avatar.vdata = data;
        //         userinfo.show(data)
        //         name.string = `${index + 1}.${data.Name()}`
        //         level_label.string = data.Star();
        //         avatar.node.resumeSystemEvents(true);
        //         avatar.node.on(Node.EventType.TOUCH_END,function(){
        //             if(data){
        //                 //  console.log("click:="+avatar.vdata);
        //                  UIRoot.instance.openChildWindow("OtherPlayerWindow",avatar.vdata);
        //             }
                   
        //         })
        //     }else{
        //         avatar.vdata = null;
        //         avatar.node.pauseSystemEvents(true);
        //     }
        // }
        // execFirst(0)
        // execFirst(1)
        // execFirst(2)
    }

    /** 获取friends的排行榜数据
     * - 包括自身数据Game.SUser
     */
    get_friends_data() {
        return new Promise<any[]>((resolve, reject) => {
            if (this.data_array_friends != null) {
                resolve(this.data_array_friends)
                return
            }
            let sr = SR.SRSocial.getFriendsRank()
            sr.SetCallBack(res => {
                let list = []
                let data = res.list

                let friends = Game.SUser.FriendsList()
                for (let i = 0; i < data.length; i++) {
                    friends[data[i].userId].updateData(data[i])
                    list.push(friends[data[i].userId])
                }

                // 个人数据
                list.push(Game.SUser)

                list.sort(function(a, b) {
                    return b.Star() - a.Star()
                })

                // 保存数据
                this.data_array_friends = list
                resolve(this.data_array_friends)
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
                userId: 0,
                name: "friend_name" + i.toString(), // 名字
                avatar: "",                         // 头像
                star: 0,                            // 等级（star个数）             
            },
            // 一个消息列表
            {}, {}, {},
        ]*/
    }

    /** 获取country的排行榜数据 */
    get_county_data() {
        return new Promise<any[]>((resolve, reject) => {
            if (this.data_array_country != null) {
                resolve(this.data_array_country)
                return
            }
            let sr = SR.SRSocial.getCountryRank()
            sr.SetCallBack(res => {
                let list = []
                let data = res.list

                for (let i = 0; i < data.length; i++) {
                    list.push(new User().updateData(data[i]))
                }

                list.sort(function(a, b) {
                    return b.Star() - a.Star()
                })
                // 保存数据
                this.data_array_country = list
                resolve(this.data_array_country)
            })
            sr.SetErrorCallBack(() => {
                reject()
            })
            sr.Send()
        })
        // 消息格式同get_friends_data()
    }

    /** 获取global的排行榜数据 */
    get_global_data() {
        return new Promise<any[]>((resolve, reject) => {
            if (this.data_array_global != null) {
                resolve(this.data_array_global)
                return
            }
            let sr = SR.SRSocial.getGlobalRank()
            sr.SetCallBack(res => {
                let list = []
                let data = res.list

                for (let i = 0; i < data.length; i++) {
                    list.push(new User().updateData(data[i]))
                }

                list.sort(function(a, b) {
                    return b.Star() - a.Star()
                })
                // 保存数据
                this.data_array_global = list
                resolve(this.data_array_global)
            })
            sr.SetErrorCallBack(() => {
                reject()
            })
            sr.Send()
        })
        // 消息格式同get_friends_data()
    }

    /** 获取增加的值（meta数据or服务器数据）
     * @returns {number}
     */
    get_add_number() {
        //return C.DEFAULT_INVITE_ADD
        let data = G.GameConstance.spinsPerInvite
        let mapId = Game.SUserVillage.MapId()
        let is = 0
        for (let mid in data) {
            if (mapId >= parseInt(mid)) {
                is = data[mid]
            } else {
                break
            }
        }
        return is
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
