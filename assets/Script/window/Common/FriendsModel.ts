import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { UserInfoModel } from '../UserInfoModel';
const { ccclass, property } = cc._decorator
const C = {

}

/**
 * friends-model,根据JigsawFriendsWindow改编
 * - [使用方式] 直接复制prefab,修改实例node;或者挂载此脚本,拖入对应的资源;调用init方法传入2个参数:附加的svt初始化函数,friend列表
 * - [注意] 依赖UserInfoModel来实现对friend-user的显示
 */
@ccclass
export default class FriendsModel extends cc.Component {

    /**
     * 初始化
     * @param {(index:number,id:number,node:cc.Node,friend_data:Game.User)=>void} f_svt svt的初始化附加函数
     * @param {Game.User[]} friend_list friend列表;默认为Game.SUser.FriendsList()
     */
    init(f_svt, friend_list = Game.SUser.FriendsList()) {
        // 保存数据
        this.f_svt = f_svt
        this.friend_list = friend_list
        for (let id in this.friend_list) {
            this.name_list.push(this.friend_list[id].Name())
        }
        // 刷新样式
        this.sp_search_end.active = false
        this.create_svt()
    }

    /** @type {{[key:string]:Game.User}} friends列表 */
    friend_list = []

    /** @type {string[]} friend-name列表,供搜索使用 */
    name_list = []

    /** @type {ScrollViewTool} */
    @property(ScrollViewTool)
    svt = null

    /** @type {cc.Node} */
    @property(cc.Node)
    no_friends = null

    /** 创建svt */
    create_svt() {
        let id_list = []
        for (let id in this.friend_list) {
            id_list.push(id)
        }
        this.no_friends.active = this.name_list.length === 0
        this.svt.setItem(id_list, (index, id, node) => {
            // 获取数据
            let friend_data = this.friend_list[id]
            // 基础初始化
            let userinfo = GameKit.ControllerTable.GetNode(node, "userinfo").getComponent(UserInfoModel)
            userinfo.show(friend_data)
            // 附加初始化
            this.f_svt(index, id, node, friend_data)
        })
    }

    // search-box,需要在编辑器中挂载两个event

    /** @type {cc.EditBox} */
    @property(cc.EditBox)
    edit_box = null

    /** @type {cc.Node} */
    @property(cc.Node)
    sp_search_end = null

    /** editbox中的字符串改变调用，表示正在输入中 */
    event_search_change_key() {
        this.sp_search_end.active = false
    }

    event_search() {
        // 搜索结果
        let key = this.edit_box.string
        // 根据结果重新渲染;考虑name和items一一对应
        let count = 0
        this.name_list.forEach((v, index) => {
            let item = this.svt.items[index]
            if (item) {
                // 大小写敏感
                // item.active = v.includes(key)
                // 大小写不敏感
                item.active = new RegExp(`${key}`, "i").test(v)
                count += 1
            }
        })
        this.no_friends.active = count === 0
        // search成功动画
        this.sp_search_end.scale = 0
        this.sp_search_end.active = true
        this.sp_search_end.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()))
    }

}
