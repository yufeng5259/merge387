import { UIWindow } from '../../GameKit/ui/UIWindow';
import FriendsModel from '../Common/FriendsModel';
const { ccclass, property } = cc._decorator
@ccclass
export default class CardSelectFriendWindow extends UIWindow {

    static windowPath = "Card/CardSelectFriendWindow";

    onShow(showParams) {
        this.type = showParams.type
        this.card_meta = showParams.card_meta
        this.load_page()
    }

    load_page() {
        this.friends_model.init((index, id, node, friend_data) => {
            // 保存dot
            let dot = GameKit.ControllerTable.GetNode(node, "selectDot")
            dot.active = false
            this.dot_list.push(dot)
            // 点击事件
            node.on("click", () => {
                this.hide_all_dot()
                dot.active = true
                this.selected_friend_userid = friend_data.UserId()
                this.btn_select.interactable = true
            })
        }, Game.SUser.FriendsList())
        // 无选择
        this.hide_all_dot()
        this.selected_friend_userid = null
        this.btn_select.interactable = false
    }

    /** @type {"ask"|"send"} 界面类型;ask/send; */
    type;
    /** @type {CardMeta} */
    card_meta;
    /** @type {cc.Node[]} */
    dot_list = []
    /** 当前选择的friend-userid */
    selected_friend_userid = null

    /** @type {FriendsModel} friend搜索model */
    @property(FriendsModel)
    friends_model = null

    /** @type {cc.Button} */
    @property(cc.Button)
    btn_select = null

    /** 隐藏所有的choose-dot */
    hide_all_dot() {
        this.dot_list.forEach(v => {
            v.active = false
        })
    }

    event_close() {
        this.closeAnim()
    }

    event_select_card() {
        if (!this.selected_friend_userid) { return }
        this.closeAnim()
        UIRoot.instance.openChildWindow("CardSelectCardWindow", {
            friend_userid: this.selected_friend_userid,
            default_card_meta_id: this.card_meta?this.card_meta.Id():null,
        })
    }

}