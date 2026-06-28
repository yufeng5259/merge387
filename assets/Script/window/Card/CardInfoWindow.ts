import { UIWindow } from '../../GameKit/ui/UIWindow';
/** @author fengyong-2019-6-3 */

const { ccclass, property } = cc._decorator
const C = {
    TIME: 0.3,
}

@ccclass
export default class CardInfoWindow extends UIWindow {

    static windowPath = "Card/CardInfoWindow";

    onShow() {
        // 初始化,显示第0页
        this.page_index = 0
        this.page_list.forEach((v, i) => {
            v.active = i === this.page_index
            this.page_dot_list[i].active = v.active
        })
    }

    /** @type {cc.Node[]} */
    @property(cc.Node)
    page_list = []

    /** @type {cc.Node[]} */
    @property(cc.Node)
    page_dot_list = []

    /** 当前page */
    page_index = 0

    /**
     * 带动画的换页
     * @param {number} index 页面index
     */
    change_to_index(index) {
        let old_index = this.page_index
        let new_index = (index + this.page_list.length) % this.page_list.length // 防止负数求模时计算错误
        if (old_index === new_index) { return }
        this.page_index = new_index
        // page-list,此处可以修改自定义动画
        this.page_list[old_index].active = false
        this.page_list[new_index].active = true
        // page-dot-list
        this.page_dot_list.forEach((v, i) => {
            v.active = i === new_index
        })
    }

    /** 下一页 */
    event_next() {
        this.change_to_index(this.page_index + 1)
    }

    /** 上一页 */
    event_before() {
        this.change_to_index(this.page_index - 1)
    }

    event_close() {
        this.closeAnim()
    }

}