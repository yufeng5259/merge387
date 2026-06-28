import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
/** @author fengyong-2019-2-19 */

const { ccclass, property } = cc._decorator
const C = {
    FAKE_DATA: false,       // 是否使用伪数据用来测试界面，不与服务器交互
}

@ccclass
class QuestDailyPage extends cc.Component {

    /** @type {ScrollViewTool} */
    @property(ScrollViewTool)
    svt = null

    /** @type {cc.SpriteFrame} 按钮样式-go */
    @property(cc.SpriteFrame)
    sp_btn_received = null

    /** @type {cc.SpriteFrame} 按钮样式-get */
    @property(cc.SpriteFrame)
    sp_btn_get = null

    /** @type {cc.SpriteAtlas} 剩余时间 */
    @property(cc.SpriteAtlas)
    atlas_taskIcons = null;

    data = null

    show() {
        if (C.FAKE_DATA) { cc.warn("注意：daily-page 正在使用fake-data模式") }
        this.get_data().then(v => {
            if (!this.node) return
            this.node.active = true
            this.update_page(v)
            UIRoot.instance.GetWindow("NewCollectFlagMainWindow").UpdateCollectButton()
        }, e =>{})
        
        /*var date1 = new Date();
        date1.setDate(date1.getDate()+1)
        date1.setHours(0)
        date1.setMinutes(0)
        date1.setSeconds(0)
        date1.setMilliseconds(0)
        this.remainTime = date1.getTime() / 1000 - GameKit.TimeUtil.getCurrentTime()
        this.label_time.string = String.format(
            GameKit.i18n.t("quest_center_window_refreshin"),
            GameKit.TimeUtil.FormatRemainTimeSimple(this.remainTime, false)
        )*/
    }

    update(dt) {
        let cTime = GameKit.TimeUtil.getCurrentTime()
        dt = this.lastUpdateTime ? cTime - this.lastUpdateTime : dt
        this.lastUpdateTime = cTime

        this.remainTime -= dt
        /*this.label_time.string = String.format(
            GameKit.i18n.t("quest_center_window_refreshin"),
            GameKit.TimeUtil.FormatRemainTimeSimple(this.remainTime, false)
        )*/
    }

    /** 获取daily-page依赖的数据 */
    get_data() {
        return new Promise((res, rej) => {
            // old_data
            if (this.data) { res(this.data); return }
            if (C.FAKE_DATA) {
                // fake-data
                let data = []
                for (let i = 0; i < 10; i += 1) {
                    data.push({
                        id: 1002,            // 任务id
                        userCount: 100,      // 任务完成计数
                        received: false,     // 任务奖励是否收取
                    })
                }
                res(data)
            } else {
                // real-data
                let sr = SR.SRTask.getTaskList()
                sr.SetCallBack(v => { res(v.list) })
                sr.SetErrorCallBack(() => { rej() })
                sr.Send()
            }
        })
    }

    /** 初始化任务页面 */
    update_page(data) {
        
        this.data = data
        let id_list = []
        let ids = Object.keys(this.data)
        for (let i = 0; i < ids.length; i++) { 
            let metaId = parseInt(ids[i])
            let meta = Meta.TaskMeta.GetById(metaId)
            if (meta.Before() <= 0 || (meta.Before() > 0 && this.data[meta.Before()].received)) {
                id_list.push(metaId)
            }
        }
        id_list.sort((a, b) => {
            if (this.data[a].received && !this.data[b].received) return 1
            if (this.data[b].received && !this.data[a].received) return -1
            if (this.data[b].received && this.data[a].received) return a - b
            let metaa = Meta.TaskMeta.GetById(a)
            let metab = Meta.TaskMeta.GetById(b)
            if (this.data[a].userCount >= metaa.Count() && this.data[b].userCount < metab.Count()) return -1
            if (this.data[a].userCount < metaa.Count() && this.data[b].userCount >= metab.Count()) return 1
            return a - b
        })

        this.svt.setItem(id_list, (index, id, node) => {
            let da = data[id]
            // 获取对应的meta数据
            let meta = Meta.TaskMeta.GetById(id)
            // 修改样式
            let task_icon = GameKit.ControllerTable.GetNode(node, 'task-icon').getComponent(cc.Sprite)
            let award_icon = GameKit.ControllerTable.GetNode(node, 'award-icon').getComponent(cc.Sprite)
            let award_value = GameKit.ControllerTable.GetNode(node, 'award-value').getComponent(cc.Label)
            let name = GameKit.ControllerTable.GetNode(node, 'quest-name').getComponent(cc.Label)
            let geted = GameKit.ControllerTable.GetNode(node, 'geted')
            let progress = GameKit.ControllerTable.GetNode(node, 'quest-progress').getComponent(cc.ProgressBar)
            let progress_string = GameKit.ControllerTable.GetNode(node, 'quest-progress-string').getComponent(cc.Label)
            let btn = GameKit.ControllerTable.GetNode(node, 'quest-btn')
            meta.Reward()[0].Icon(award_icon);
            task_icon.spriteFrame=this.atlas_taskIcons.getSpriteFrame(meta.TaskIcon())
            award_value.string = BigNumber.format(meta.Reward()[0].Count())
            name.string = meta.Name()
            //describe.string = meta.Description()
            progress.progress = Math.min(da.userCount, meta.Count()) / meta.Count()
            progress_string.string = `${BigNumber.format(Math.min(da.userCount, meta.Count()))} / ${BigNumber.format(meta.Count())}`
            
            if(da.userCount >= meta.Count()){
                progress.node.active = false;
                if(da.received){
                    btn.active = false;
                    geted.active = true;
                }else{
                    geted.active = false;
                    btn.active=true;
                    btn.getComponent(cc.Button).clickEvents[0].handler = "evnet_get"
                    btn.getComponent(cc.Button).clickEvents[0].customEventData = meta.Id()
                }
            }else{
                progress.node.active = true;
                geted.active = false;
                btn.active = false;
            }
        })
    }


    /** 点击事件：get */
    evnet_get(e, id) {
        new Promise((res, rej) => {
            // old-data
            this.data[id].received = true
            if (C.FAKE_DATA) {
                // fake-data
                res()
            } else {
                // real-data
                let sr = SR.SRTask.receiveTaskReward(Number.parseInt(id))
                sr.SetCallBack(v => { 
                    res(v)
                })
                sr.SetErrorCallBack(() => { rej() })
                sr.Send()
            }
        }).then(() => {
            // 界面变动
            //e.target.active = false
            this.update_page(this.data)

            // 获取奖励
            // UIRoot.instance.openChildWindow("GetRewardWindow", {
            //     contents: Meta.TaskMeta.GetById(id).Reward()
            // })

            this.scheduleOnce(() => {
                if (UIRoot.instance.GetWindow("GetRewardWindow") != null) {
                    UIRoot.instance.GetWindow("GetRewardWindow").addOnCloseFunc(() => {
                        UIRoot.instance.GetWindow("NewCollectFlagMainWindow").GetOneFlag()
                    })
                } else {
                    UIRoot.instance.GetWindow("NewCollectFlagMainWindow").GetOneFlag()
                }
            }, 0.5)
        }, e =>{})
    }

    haveCollect() {
        let ids = []

        for (let id in this.data) {
            let da = this.data[id]
            let meta = Meta.TaskMeta.GetById(id)
            if (!da.received && da.userCount >= meta.Count()) {
                ids.push(Number.parseInt(id))
            }
        }
        
        return ids.length > 0

    }

    collectAll() {
        let ids = []

        for (let id in this.data) {
            let da = this.data[id]
            let meta = Meta.TaskMeta.GetById(id)
            if (!da.received && da.userCount >= meta.Count()) {
                ids.push(Number.parseInt(id))
            }
        }
        
        let req = SR.SRTask.receiveTasksReward(ids)
        req.SetCallBack(v => { 
            ids.forEach(x => this.data[x].received = true)
            this.update_page(this.data)
        })

        return req

    }

}