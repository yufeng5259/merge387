import { UIWindow } from '../../GameKit/ui/UIWindow';
import { ScrollViewTool } from '../../GameKit/ui/ScrollViewTool';
import { UITabContainer } from '../../GameKit/ui/UITabContainer';
import { UserInfoModel } from '../UserInfoModel';
import { _decorator, Button, Color, find, game, instantiate, Label, LabelOutline, Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, tween, Tween, UITransform, Vec2, Vec3, v2, Widget, sp } from 'cc';
/**
 * @author fengyong
 * @version 2018-8-13
 */

 const { ccclass, property, executeInEditMode } = _decorator
 
 /** 界面配置参数 */
 const C = {
     /** 伪数据长度 */
     FAKE_DATA_LENGTH: 4,
     /** 伪等待时间 */
     FAKE_WAIT_TIME: 1,
     /** 载入sprite旋转一圈的时间 */
     LOADING_ROTATION_TIME: 0.5,
     /** 字体颜色：可点击 */
     FONT_COLOR_ABLE_SEND: new Color(255, 255, 255),
     FONT_COLOR_ABLE_COLLECT: new Color(255, 255, 255),
     /** 字体颜色：不可点击 */
     FONT_COLOR_UNABLE: new Color(60, 60, 60),
     // 一些测试默认值（以后需要从服务器/配置表中读取）
     DEFAULR_SPIN_SEND: 1,
     DEFAULR_SPIN_COLLECT: 1,
     DEFAULR_COIN_SEND: "15K",
     DEFAULR_COIN_COLLECT: "15K",
     /** 显示状态枚举 */
     TYPE: {
         SEND: "send",
         SENDED: "sended",
         COLLECT: "collect",
         COLLECTED: "collected",
     },
     /** 默认邀请时增加的 */
     DEFAULT_INVITE_ADD: 35,
 }
 /**
  * Gifts界面
  * - 包含各类按钮的点击事件处理
  * @class
  */
 @ccclass
 class GiftsWindow extends UIWindow {
 
     static windowPath = "Menu/GiftsWindow"

     choose_tab: any = null
     data_array: any = null
 
     /** @type {SpriteFrame} 选中的时候的图标 */
     //@property(SpriteFrame)
     //choose_sf = null
 
     /** @type {SpriteFrame} 未选中的时候的图标 */
     //@property(SpriteFrame)
     //unchoose_sf = null
 
     /** @type {SpriteFrame} 默认头像 */
     @property(SpriteFrame)
     default_avatar_sf = null
 
     /** @type {[Node]} tab node数组 */
     @property(UITabContainer)
     tab_node_array = null
 
     /** @type {ScrollViewTool} ScrollViewTool组件 */
     @property(ScrollViewTool)
     svt = null
 
     /** @type {Node} 加载数据的动画圈 */
     @property(Node)
     loading_circle = null
 
     /** @type {Label} */
     @property(Label)
     collect_progress_note = null
 
     /** @type {Button} */
     @property(Button)
     btn_collect_all = null
 
     /** @type {Label} */
     @property(Label)
     label_collect_all = null
 
     /** @type {Node} */
     @property(Node)
     anim_spin = null
 
     /** @type {Node} */
     @property(Node)
     anim_coin = null
     
     /** @type {Node} */
     @property(Node)
     limit_send = null
     /** @type {Node} */
     @property(Node)
     cant_collect = null
     /** @type {Label} */
     @property(Label)
     cant_collect_des = null
 
     /** @type {Node} */
     @property(Node)
     gift_tip = null
 
     /** @type {Node} */
     @property(Node)
     aMoreNode=null
 
     /** @type {RichText} */
     @property(RichText)
     aMoreText=null
     onShow() {
         
         this.svt.setItem([], () => {})
 
         //this.event_change_to_tab()
         this.tab_node_array.onShow((index, tab, first) => {
             if (first) {
                 setTimeout(() => {this.event_change_to_tab(index)},300)
             } else {
                 this.event_change_to_tab(index)
             }
         })
 
         this.label_collect_all.string = GameKit.i18n.t("gifts_collect_all")
         if (fbInTools.usefbIn) this.label_collect_all.string = GameKit.i18n.t("gifts_collect_all2")
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
         //this.able_btn(this.btn_collect_all, true)
         // 加载动画
         this.open_loading_anima()
 
         this.setData()
     }
 
     setData() {
         // 更改内部数据
         switch (Number(this.choose_tab)) {
             case 0:
                 this.get_spins_data().then(v => {
                     if (!this.node || !this.node.isValid)return
                     this.update_all_item(v)
                     this.update_collect_progress()
                     this.close_loading_anima()
                 }, e =>{})
                 break;
             case 1:
                 this.get_coins_data().then(v => {
                     if (!this.node || !this.node.isValid)return
                     this.update_all_item(v)
                     this.update_collect_progress()
                     this.close_loading_anima()
                 }, e =>{})
                 break;
             case 2:
                 this.get_cards_data().then(v => {
                     if (!this.node || !this.node.isValid)return
                     this.update_card_item(v)
                     this.update_collect_progress()
                     this.close_loading_anima()
                 }, e =>{})
                 break;
             default: break;
         }
     }
 
     /** 点击事件：打开invite界面 */
     event_invite() {
         if (this.childWindowChain) {
             this.clearOnCloseFunc()
             this.childWindowChain.end()
         }
         UIRoot.instance.openChildWindow("InviteWindow")
     }
 
     /** 点击事件：send
      */
     event_send(e) {
         // send交互
         // e.target为被点击的按钮
         //this.able_btn(e.target.getComponent(Button), false)
     }
 
     /** 点击事件：collect */
     event_collect(e) {
         //this.able_btn(e.target.getComponent(Button), false)
         //this.update_collect_progress()
     }
 
     /** 点击事件：collect & send all */
     event_collect_all() {
 
         if (!this.data_array) return
         
         let sendList = []
         let collectList = []
 
         let req = null
 
         let setList = function(list, max) {
             let count = 0
             for (let uid in list) {
                 if (list[uid].sended) {
                     //count++
                 }
                 if (list[uid].collected) {
                     count++
                 }
             }
             for (let uid in list) {
                 if (!list[uid].sended) {
                     if (!fbInTools.usefbIn) {
                         sendList.push(parseInt(uid))
                         //count++
                     }
                 }
                 if (!list[uid].collected && list[uid].canCollect && count < max) {
                     collectList.push(parseInt(uid))
                     count++
                 }
                 if (count > max) return
             }
         }
 
         if (this.choose_tab === 0) {
             setList(this.data_array.spinList, G.GameConstance.giftSpinMax)
             if (sendList.length + collectList.length <= 0) return
             req = SR.SRSocial.giftsSpinAll(sendList, collectList)
         } else {
             setList(this.data_array.coinList, G.GameConstance.giftCoinMax)
             if (sendList.length + collectList.length <= 0) return
             req = SR.SRSocial.giftsCoinAll(sendList, collectList)
         }
 
         req.SetCallBack(() => {
             if (this.choose_tab === 0) {
                 sendList.forEach( x => this.data_array.spinList[x].sended = true )
                 collectList.forEach( x => this.data_array.spinList[x].collected = true )
             } else {
                 sendList.forEach( x => this.data_array.coinList[x].sended = true )
                 collectList.forEach( x => this.data_array.coinList[x].collected = true )
             }
 
             if (collectList.length > 0) {
                 let anim = null
                 let giftGetMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftGet, Game.SUserVillage.MapId())
                 if (this.choose_tab === 0) {
                     anim = instantiate(this.anim_spin)
                     GameKit.ControllerTable.GetNode(anim, "label").getComponent(Label).string = "+" + (giftGetMeta.Spin() * (collectList.length)).toString()
                 } else {
                     anim = instantiate(this.anim_coin)
                     GameKit.ControllerTable.GetNode(anim, "label").getComponent(Label).string = "+" + BigNumber.format(giftGetMeta.Coin() * (collectList.length))
                 }
                 anim.parent = this.anim_spin.parent
                 anim.setWorldPosition(this.btn_collect_all.node.getWorldPosition())
                 anim.active = true
             }
 
             this.update_collect_progress()
             this.svt.flushData()
             
             AppKit.LogEventWrap.logEvent("gift_all")
         })
         if (sendList.length > 0 && AppKit.SdkManager.IsNative() && Game.SUser.IsFacebook()) {
             if (G.GameConfig.closeGiftFbShare) {
                 req.Send()
             } else {
                 let ids = []
                 sendList.forEach(id => {
                     ids.push(Game.SUser.FriendsList()[id].ThirdId())
                 })
                 let sstr = String.format(GameKit.i18n.t("ShareInviteSendCoins"), Game.SUser.Name())
                 if (this.choose_tab === 0) sstr = String.format(GameKit.i18n.t("ShareInviteSendSpin"), Game.SUser.Name())
                 AppKit.ShareWrap.chooseOne(ids, sstr, this.choose_tab === 0?'Texture/share_spin.png':'Texture/share_coin.png', {type:this.choose_tab === 0?"send_spins_all":"send_coins_all"}, () => {
                     req.Send()
                 }, this.choose_tab === 0?"send_spins":"send_coins", true)
             }
         } else {
             req.Send()
         }
     }
 
     /** 更新tab选择样式 */
     update_tab_choose(choose_tab = 0) {
         this.choose_tab = choose_tab
         /*for (let i = 0; i < this.tab_node_array.length; i++) {
             let n = this.tab_node_array[i]
             if (i === choose_tab) {
                 // 选中
                 n.getComponent(Sprite).spriteFrame = this.choose_sf
             } else {
                 // 未选中
                 n.getComponent(Sprite).spriteFrame = this.unchoose_sf
             }
         }*/
         // if(choose_tab==2){
         //     this.aMoreNode.node.active =false;
         // }else{
         //     this.aMoreNode.node.active =true;
         // }
     }
 
     update_collect_progress() {
         if (!this.data_array) return
         // 还需要从服务器获取数据
         switch (this.choose_tab) {
             case 0: {
                 this.collect_progress_note.node.active = true
                 this.btn_collect_all.node.active = true
                 this.gift_tip.active = true
                 let count = 0
                 for (let uid in this.data_array.spinList) {
                     if (this.data_array.spinList[uid].collected) {
                         count++
                     }
                     if (this.data_array.spinList[uid].sended) {
                         //count++
                     }
                 }
                 this.collect_progress_note.string = String.format(GameKit.i18n.t("gifts_collect_spins"), count, G.GameConstance.giftSpinMax);
                 break;
             }
             case 1: {
                 this.collect_progress_note.node.active = true
                 this.btn_collect_all.node.active = true
                 this.gift_tip.active = true
                 let count = 0
                 for (let uid in this.data_array.coinList) {
                     if (this.data_array.coinList[uid].collected) {
                         count++
                     }
                     if (this.data_array.coinList[uid].sended) {
                         //count++
                     }
                 }
                 this.collect_progress_note.string = String.format(GameKit.i18n.t("gifts_collect_coins"), count, G.GameConstance.giftCoinMax);
                 break;
             }
             case 2: {
                 this.collect_progress_note.node.active = false
                 this.btn_collect_all.node.active = false
                 this.gift_tip.active = false
                 break;
             }
             default: break;
         }
     }
 
     /** 刷新所有的item
      * @param {[{}]} data_array
      */
     update_all_item(data_array) {
         
         for (let id in Game.SUser.FriendsList()) {
             let data = data_array[id]
             if (data == null) {
                 data_array[id] = {sended: false, collected: false, canCollect: false}
             }
         }
         
         //this.svt.scrollView.scrollToTop(0.1)
         //this.svt.clear()
         let ranks = []
         //let item_count = Object.keys(data_array).length + 1
         //for (let i = 0; i < item_count; i++) { ranks.push(i) }
         for (let uid in Game.SUser.FriendsList()) {
             ranks.push(uid)
         }
         ranks.sort((a, b) => {
             if (data_array[a].canCollect && !data_array[a].collected && (!data_array[b].canCollect || data_array[b].collected)) return -1
             if (data_array[b].canCollect && !data_array[b].collected && (!data_array[a].canCollect || data_array[a].collected)) return 1
             if (!data_array[a].sended && data_array[b].sended) return -1
             if (!data_array[b].sended && data_array[a].sended) return 1
             return a-b
         })
         if (!G.GameConfig.closeShare) {
             ranks.push(0)
         }
         if(SR.SRShop.AmoreStart()){
             ranks.unshift(-1)
 
         }
         this.svt.reuseSetInitFunc((index, id, itemHandle) => {this.setItem(data_array[id], index, id, itemHandle)})
         this.svt.reuseSetData(ranks)
     }
 
     setItem(data, index, id, itemHandle) {
         // 获取对应组件（node）
         // 注意各个子节点的名称正确
         // 注意要把对应的节点拖入ControllerTables下面
         let userinfo = GameKit.ControllerTable.GetNode(itemHandle, "userinfo").getComponent(UserInfoModel)
         let avatar = GameKit.ControllerTable.GetNode(itemHandle, "avatar").getComponent(Sprite)
         let add = GameKit.ControllerTable.GetNode(itemHandle, "add")
         let name = GameKit.ControllerTable.GetNode(itemHandle, "name").getComponent(Label)
         let explain = GameKit.ControllerTable.GetNode(itemHandle, "explain").getComponent(Label)
         let btn_invite = GameKit.ControllerTable.GetNode(itemHandle, "btn_invite")
         let btn_send = GameKit.ControllerTable.GetNode(itemHandle, "btn_send")
         let btn_collect = GameKit.ControllerTable.GetNode(itemHandle, "btn_collect")
         let invite_add = GameKit.ControllerTable.GetNode(itemHandle, "icon_label").getComponent(Label)
         let card = GameKit.ControllerTable.GetNode(itemHandle, "card")
         let collectLock = GameKit.ControllerTable.GetNode(itemHandle, "collectLock")
         let aMore = GameKit.ControllerTable.GetNode(itemHandle, "aMore")
         let aMoreT = GameKit.ControllerTable.GetNode(itemHandle, "Atitle").getComponent(RichText)
         aMore.active = false;
         // 根据数据写入
         if (id == 0) {
             // 邀请
             avatar.spriteFrame = this.default_avatar_sf
             add.active = true
             name.string = GameKit.i18n.t("gifts_default_name")
             explain.string = GameKit.i18n.t("gifts_default_explain")
             card.active = false
             avatar.node.active = true
             name.node.active = true
             explain.node.active = true
             btn_invite.active = true
             btn_send.active = false
             btn_collect.active = false
             collectLock.active = false
             invite_add.string = String.format(GameKit.i18n.t("invite_addnumber_type0"), this.get_add_number())
         } else {
             if(id==-1){
                 console.log("活动开启--------------------------------------------");
                 aMore.active = true;
                 aMoreT.string = String.format(GameKit.i18n.t("shopWindow6More3"), SR.SRShop.GetBet(),GameKit.TimeUtil.FormatRemainTimeSimple(SR.SRShop.SixTime()-GameKit.TimeUtil.getCurrentTime(), false))
             }else{
                 // 采用User信息数据域的方式显示
             userinfo.show(Game.SUser.FriendsList()[id])
             // 不同界面的信息域内容不同，因此要根据界面调整User信息域与界面信息的处理
             add.active = false
             btn_invite.active = false
             card.active = false
             avatar.node.active = true
             name.node.active = true
             explain.node.active = true
             collectLock.active = false
             
             let self = this
             let updateItem = function()
             {
                 let giftGetMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftGet, Game.SUserVillage.MapId())
                 switch (self.get_type(data["sended"], data["collected"], data["canCollect"])) {
                     case C.TYPE.SEND:
                         [btn_send.active, btn_collect.active] = [true, false]
                         btn_send.getComponent(Button).interactable = true
                         GameKit.ControllerTable.GetNode(btn_send, "title").color = C.FONT_COLOR_ABLE_SEND
                         if (self.choose_tab === 0) {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_spin_send"), C.DEFAULR_SPIN_SEND)
                         } else {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_coin_send"), C.DEFAULR_COIN_SEND)
                         }
                         break;
                     case C.TYPE.SENDED:
                         [btn_send.active, btn_collect.active] = [true, false]
                         btn_send.getComponent(Button).interactable = false
                         GameKit.ControllerTable.GetNode(btn_send, "title").color = C.FONT_COLOR_UNABLE
                         if (self.choose_tab === 0) {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_spin_send"), C.DEFAULR_SPIN_SEND)
                         } else {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_coin_send"), C.DEFAULR_COIN_SEND)
                         }
                         break;
                     case C.TYPE.COLLECT:
                         [btn_send.active, btn_collect.active] = [false, true]
                         btn_collect.getComponent(Button).interactable = true
                         GameKit.ControllerTable.GetNode(btn_collect, "title").color = C.FONT_COLOR_ABLE_COLLECT
                         if (self.choose_tab === 0) {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_spin_collect"), giftGetMeta.Spin())
                         } else {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_coin_collect"), BigNumber.format(giftGetMeta.Coin()))
                         }
                         break;
                     case C.TYPE.COLLECTED:
                         [btn_send.active, btn_collect.active] = [false, true]
                         btn_collect.getComponent(Button).interactable = false
                         GameKit.ControllerTable.GetNode(btn_collect, "title").color = C.FONT_COLOR_UNABLE
                         if (self.choose_tab === 0) {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_spin_collect"), giftGetMeta.Spin())
                         } else {
                             explain.string = String.format(GameKit.i18n.t("gifts_explain_coin_collect"), BigNumber.format(giftGetMeta.Coin()))
                         }
                         break;
                     default:
                         break;
                 }
             }
             updateItem()
 
             btn_send.targetOff(this)
             btn_send.on("click", () => {
                 let sstr = String.format(GameKit.i18n.t("ShareInviteSendCoins"), Game.SUser.Name())
                 if (this.choose_tab === 0) sstr = String.format(GameKit.i18n.t("ShareInviteSendSpin"), Game.SUser.Name())
                 var sfunc = () => {
                     let req = null
                     if (this.choose_tab === 0) {
                         req = SR.SRSocial.giftsSpinSend(id)
                     } else {
                         req = SR.SRSocial.giftsCoinSend(id)
                     }
                     req.SetCallBack(() => {
                         data.sended = true
                         this.update_collect_progress()
                         this.svt.flushData()
 
                         /*let anim = null
                         let giftGetMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftGet, Game.SUserVillage.MapId())
                         if (this.choose_tab === 0) {
                             anim = instantiate(this.anim_spin)
                             GameKit.ControllerTable.GetNode(anim, "label").getComponent(Label).string = "+" + giftGetMeta.Spin().toString()
                         } else {
                             anim = instantiate(this.anim_coin)
                             GameKit.ControllerTable.GetNode(anim, "label").getComponent(Label).string = "+" + BigNumber.format(giftGetMeta.Coin())
                         }
                         anim.parent = this.anim_spin.parent
                         anim.setWorldPosition(btn_send.getWorldPosition())
                         anim.active = true*/
                         
                         AppKit.LogEventWrap.logEvent("gift_send")
                     })
                     req.Send()
                 }
                 if (G.GameConfig.closeGiftFbShare) {
                     sfunc()
                 } else {
                     AppKit.ShareWrap.chooseOne(Game.SUser.FriendsList()[id].ThirdId(), sstr, this.choose_tab === 0?'Texture/share_spin.png':'Texture/share_coin.png', {type:this.choose_tab === 0?"send_spins":"send_coins"}, () => {
                         sfunc()
                     }, this.choose_tab === 0?"send_spins":"send_coins", true)
                 }
             }, this)
 
             btn_collect.targetOff(this)
             btn_collect.on("click", () => {
                 let req = null
                 if (this.choose_tab === 0) {
                     req = SR.SRSocial.giftsSpinCollect(id)
                 } else {
                     req = SR.SRSocial.giftsCoinCollect(id)
                 }
                 req.SetCallBack(() => {
                     data.collected = true
                     this.update_collect_progress()
                     this.svt.flushData()
 
                     let anim = null
                     let giftGetMeta = Meta.MetaManager.GetMeta(Meta.MetaType.GiftGet, Game.SUserVillage.MapId())
                     if (this.choose_tab === 0) {
                         anim = instantiate(this.anim_spin)
                         GameKit.ControllerTable.GetNode(anim, "label").getComponent(Label).string = "+" + giftGetMeta.Spin().toString()
                     } else {
                         anim = instantiate(this.anim_coin)
                         GameKit.ControllerTable.GetNode(anim, "label").getComponent(Label).string = "+" + BigNumber.format(giftGetMeta.Coin())
                     }
                     anim.parent = this.anim_spin.parent
                     anim.setWorldPosition(btn_send.getWorldPosition())
                     anim.active = true
 
                     AppKit.LogEventWrap.logEvent("gift_collect")
                 })
                 req.Send()
             }, this)
             }
             
         }
     }
 
     /** 刷新卡片的item
      * @param {[{}]} data_array
      */
     update_card_item(data_array) {
         
         let ranks = []
         if(SR.SRShop.AmoreStart()){
             ranks.unshift(-1)
 
         }
         ranks.push(-2)
         for (let i = 0; i < data_array.length; i++) { ranks.push(i) }
 
         this.svt.reuseSetInitFunc((index, id, itemHandle) => {this.setCardItem(data_array, index, id, itemHandle)})
         this.svt.reuseSetData(ranks)
     }
 
     setCardItem(data_array, index, id, itemHandle) {
         let data = data_array[id]
         let avatar = GameKit.ControllerTable.GetNode(itemHandle, "avatar")
         let name = GameKit.ControllerTable.GetNode(itemHandle, "name")
         let userinfo = GameKit.ControllerTable.GetNode(itemHandle, "userinfo").getComponent(UserInfoModel)
         let add = GameKit.ControllerTable.GetNode(itemHandle, "add")
         let explain = GameKit.ControllerTable.GetNode(itemHandle, "explain").getComponent(Label)
         let btn_invite = GameKit.ControllerTable.GetNode(itemHandle, "btn_invite")
         let btn_send = GameKit.ControllerTable.GetNode(itemHandle, "btn_send")
         let btn_collect = GameKit.ControllerTable.GetNode(itemHandle, "btn_collect")
         let card = GameKit.ControllerTable.GetNode(itemHandle, "card")
         let collectLock = GameKit.ControllerTable.GetNode(itemHandle, "collectLock")
         let aMore = GameKit.ControllerTable.GetNode(itemHandle, "aMore")
         let aMoreT = GameKit.ControllerTable.GetNode(itemHandle, "Atitle").getComponent(RichText)
         aMore.active = false;
         // 根据数据写入
         if (id ==-2) {
             add.active = false
             btn_invite.active = false
             card.active = true
             avatar.node.active = false
             name.node.active = false
             explain.node.active = false
 
             btn_collect.targetOff(this)
             btn_collect.active = false
             btn_send.active = true
             btn_send.getComponent(Button).interactable = true
             btn_send.targetOff(this)
             btn_send.on("click", () => {
                 //达到每日上限
                 if (!Game.SUserCard.CheckDailyLimit()) {
                     this.limit_send.active = true
                     this.limit_send.setWorldPosition(btn_send.getWorldPosition())
                     return
                 }
                 UIRoot.instance.openChildWindow("CardSelectFriendWindow")
             }, this)
         }  else if (id ==-1) {
             aMore.active = true;
             aMoreT.string = String.format(GameKit.i18n.t("shopWindow6More3"), SR.SRShop.GetBet(),GameKit.TimeUtil.FormatRemainTimeSimple(SR.SRShop.SixTime()-GameKit.TimeUtil.getCurrentTime(), false))
            
         }else {
 
             // 采用User信息数据域的方式显示
             userinfo.show(Game.SUser.FriendsList()[data.userId])
             // 不同界面的信息域内容不同，因此要根据界面调整User信息域与界面信息的处理
             add.active = false
             btn_invite.active = false
             card.active = false
             avatar.node.active = true
             name.node.active = true
             explain.node.active = true
 
             explain.string = GameKit.i18n.t("gifts_explain_card_collect")
 
             let cardId = data.cardId
             let cardMeta = Meta.MetaManager.GetMeta(Meta.MetaType.Card, cardId)
             collectLock.active = cardMeta.MinVillage() > Game.SUserVillage.MapId()
 
             btn_collect.active = true
             btn_collect.getComponent(Button).interactable = true
             btn_send.active = false
             
             btn_send.targetOff(this)
             btn_collect.targetOff(this)
             btn_collect.on("click", () => {
                 if (cardMeta.MinVillage() > Game.SUserVillage.MapId()) {
                     this.cant_collect.active = true
                     this.cant_collect.setWorldPosition(btn_send.getWorldPosition())
                     this.cant_collect_des.string = String.format(GameKit.i18n.t("gifts_explain_card_cantcollect"), cardMeta.MinVillage().toString())
                     return
                 }
 
                 let req = SR.SRSocial.giftsCardCollect(id)
                 req.SetCallBack(() => {
                     data_array.removeAt(id)
                     let ranks = []
                     ranks.push(-2)
                     for (let i = 0; i < data_array.length; i++) { ranks.push(i) }
 
                     this.svt.reuseSetData(ranks)
                     UIRoot.instance.openChildWindow("CardCollectWindow", {id: data.cardId})
                 })
                 req.Send()
             }, this)
         }
     }
 
     click_cant() {
         this.cant_collect.active = false
         this.limit_send.active = false
     }
 
     /**
      * 根据三种状态判定显示状态
      * - 三种初始状态分别对应三个参数
      * - 显示状态有3种：显示SEND按钮，显示COLLECT按钮，显示等待时间（或者不显示）；使用C.TYPE进行封装
      * - 优先collect
      * @param {boolean} sended 
      * @param {boolean} collected 
      * @param {boolean} canCollect 
      * @return {string} C.TYPE
      */
     get_type(sended, collected, canCollect) {
         // test
         // return C.TYPE.SEND
         if (!collected && canCollect) { 
             let isfull = false
             if (this.choose_tab === 0) {
                 let count = 0
                 for (let uid in this.data_array.spinList) {
                     if (this.data_array.spinList[uid].collected) {
                         count++
                     }
                 }
                 if (count >= G.GameConstance.giftSpinMax) {
                     isfull = true
                 }
             } else {
                 let count = 0
                 for (let uid in this.data_array.coinList) {
                     if (this.data_array.coinList[uid].collected) {
                         count++
                     }
                 }
                 if (count >= G.GameConstance.giftCoinMax) {
                     isfull = true
                 }
             }
             if (!isfull) return C.TYPE.COLLECT 
         }
 
         if (!sended) {
             return C.TYPE.SEND
         }
         else if (!collected && !canCollect) {
             return C.TYPE.SENDED 
         }
         return C.TYPE.COLLECTED
     }
 
     /** 获取free spins的数据 */
     get_spins_data() {
         return new Promise<any>((resolve, reject) => {
             if (this.data_array) {
                 resolve(this.data_array.spinList)
                 return
             }
             let sr = SR.SRSocial.getGifts()
             sr.SetCallBack(res => {
                 // 保存数据
                 this.data_array = res
                 if(SR.SRShop.AmoreStart()){
                     this.data_array.spinList[-1] = {sended: false, collected: false, canCollect: false}
                 }
                 resolve(this.data_array.spinList)
 
                 GameKit.DataCache.RemoveData("GiftsNum")
                 GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.GiftEvent, null)
             })
             sr.SetErrorCallBack(() => {
                 reject()
             })
             sr.Send()
         })
         /** 备注：消息格式 
         res.spinList = [
             // 单条消息
             {
                 userId: 0,
                 sended: false,                  // 是否送过了
                 collected: false,               // 是否收过了
                 canCollect: false,              // 是否有东西可以收集
             },
             // 一个消息列表
             {}, {}, {},
         ]*/
     }
 
     /** 获取free coins的数据 */
     get_coins_data() {
         return new Promise<any>((resolve, reject) => {
             if (this.data_array) {
                 resolve(this.data_array.coinList)
                 return
             }
             let sr = SR.SRSocial.getGifts()
             sr.SetCallBack(res => {
                 // 保存数据
                 this.data_array = res
                 
                 resolve(this.data_array.coinList)
 
                 GameKit.DataCache.RemoveData("GiftsNum")
                 GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.GiftEvent, null)
             })
             sr.SetErrorCallBack(() => {
                 reject()
             })
             sr.Send()
         })
         /** 备注：消息格式
         res.coinList = [
             // 单条消息
             {
                 userId: 0,
                 sended: false,                  // 是否送过了
                 collected: false,               // 是否收过了
                 canCollect: false,              // 是否有东西可以收集
             },
             // 一个消息列表
             {}, {}, {},
         ] */
     }
 
     get_cards_data() {
         return new Promise<any[]>((resolve, reject) => {
             if (this.data_array) {
                 resolve(this.data_array.cardList)
                 return
             }
             let sr = SR.SRSocial.getGifts()
             sr.SetCallBack(res => {
                 // 保存数据
                 this.data_array = res
                 
                 resolve(this.data_array.cardList)
 
                 GameKit.DataCache.RemoveData("GiftsNum")
                 GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.GiftEvent, null)
             })
             sr.SetErrorCallBack(() => {
                 reject()
             })
             sr.Send()
         })
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
 
     /** 
      * 修改按钮禁用状态
      * - 请保证btn下的文字节点名称为title
      * - 请保证给btn添加ControllerTable组件并拖入title节点（必须，否则会直接报错）
      * @param {Button} btn
      * @param {boolean} is_able
      */
     able_btn(btn, is_able) {
         btn.enableAutoGrayEffect = true // 注册变灰事件
         btn.interactable = is_able
         if (is_able) {
             GameKit.ControllerTable.GetNode(btn.node, "title").color = C.FONT_COLOR_ABLE_SEND
         } else {
             GameKit.ControllerTable.GetNode(btn.node, "title").color = C.FONT_COLOR_UNABLE
         }
     }
     onGotoShop(){
         UIRoot.instance.openChildWindow("ShopWindow")
          this.event_close();
     }
     /** 获取增加的值（meta数据or服务器数据）
      * @returns {number}
      */
     get_add_number() {
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
 
 }
 
