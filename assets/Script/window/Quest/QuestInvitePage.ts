/** @author fengyong-2019-2-19 */

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestInvitePage extends cc.Component {

    show() {
        this.get_data().then(v => {
            this.update_page(v)
            this.node.active = true
        })
    }

    /** 获取invite-page依赖的数据 */
    get_data() {
        return new Promise((res, rej) => {
            res()
        })
    }

    /** 初始化任务页面 */
    update_page(data) {

    }

}
