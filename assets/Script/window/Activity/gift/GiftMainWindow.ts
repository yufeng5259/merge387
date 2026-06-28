import { UIWindow } from '../../../GameKit/ui/UIWindow';
import SpriteGray from '../../../GameKit/render/SpriteGray';
import ContentModel from '../../../game/items/ContentModel';
import GiftData from './GiftData';

const { ccclass, property } = cc._decorator

const tipPosY=[ -156,-429,-210]
const arrowY=[295,295,-38]

@ccclass
export default class GiftMainWindow extends UIWindow {

    static windowPath = "Activity/gift/GiftMainWindow";
    

    /** @type {cc.Label} */
    @property({ tooltip: "", type: cc.Label })
    labelTimer = null

    @property(cc.SpriteFrame)
    mysprites=[]

    @property(cc.Node)
    items=[]

    // @property(cc.Node)
    // desItems=[]

    @property(cc.Node)
    giftDes=null

    onShow(params) {
        let activityMeta = params.meta
        GiftData.load_data(activityMeta)

        this.meta = params.meta

        Game.SUser.data.flytoskyActivityId=activityMeta.Id()


        this.leftTime = 0
        if(params.showNextAnim){
            this.showNextAnim=params.showNextAnim
        }
        this.create_buy_item()
        this.update_ui()
        this.update()
    }

    buy_item_list = []
    /** 创建所有的购买项目 */
    create_buy_item() {
        this.giftDes.active=false
        this.buy_item_list = []
        for (let i = 0; i < this.items.length; i += 1) {
            let n = this.items[i]
            
            //n.parent = this.buy_item.parent
            n.active = true
            // n.y = ItemYs[i]
            let data = {
                node: n,
                reward_layout: GameKit.ControllerTable.GetNode(n, "reward-layout"),
                reward_item: GameKit.ControllerTable.GetNode(n, "reward-item"),
                label_buy_cost: GameKit.ControllerTable.GetNode(n, "label-buy-cost").getComponent(cc.Label),
                label_buy_count: GameKit.ControllerTable.GetNode(n, "label-buy-count").getComponent(cc.Label),
                buy_lock: GameKit.ControllerTable.GetNode(n, "buy-lock"),
                buy_use_coin: GameKit.ControllerTable.GetNode(n, "buy-use-coin"),
                bkg2: GameKit.ControllerTable.GetNode(n, "bkg2").getComponent(cc.Sprite),
                btn_buy: GameKit.ControllerTable.GetNode(n, "btn-buy").getComponent(cc.Button),
                cannot_buy: GameKit.ControllerTable.GetNode(n, "cannot-buy"),
                arrow: GameKit.ControllerTable.GetNode(n, "arrow"),
                buy_lock_particle:GameKit.ControllerTable.GetNode(n, "buy_lock_particle").getComponent(cc.ParticleSystem),
            }
            if(i==5){
                data.arrow.active=false
            }
            data.buy_lock_particle.node.active=false
            data.reward_item.active=false;
            let seq=cc.repeatForever(cc.sequence(cc.scaleTo(1,1.5,1),cc.scaleTo(1,1,1)));
            if(data.arrow&&data.arrow.active){
                data.arrow.runAction(seq)
            }
            // data.bkg2.active=false
            this.buy_item_list.push(data)
            data.cannot_buy.active = false
            data.btn_buy.clickEvents[0].customEventData = `${i}` // 保存按钮对应的buy-item-index
            
        }
    }
    // 已经购买的按钮隐藏，底背景置灰,箭头隐藏
    hasBuyItem(data,i){
        SpriteGray.SetGray(data.node.getComponent(cc.Sprite), true)
        data.btn_buy.node.active=false
        data.btn_buy.interactable=false
        data.buy_lock.active=false
        data.bkg2.node.active=false
        data.arrow.active=false
        
    }
    //可以购买的对象，免费则隐藏锁，表面背景隐藏，显示底背景，按钮可以点击
    curBuyItem(data,i){
        SpriteGray.SetGray(data.node.getComponent(cc.Sprite), false)
        data.btn_buy.interactable=true
        data.btn_buy.node.active=true
        data.bkg2.node.active=false

        // let packItem=GiftData.get_meta_by_index(i);
        data.buy_lock.active=false
        // if(GiftData.get_buy_item_type(packItem.shopId) === "free"){
        //     data.buy_lock.active=false
        // }else{
        //     data.buy_lock.active=true
        // }

        if(i>=5){
            data.arrow.active=false
        }

    }
    //没有购买则显示bkg2
    noBuyItem(data,i){
        SpriteGray.SetGray(data.node.getComponent(cc.Sprite), false)
        data.bkg2.node.active=true
        data.btn_buy.interactable=false
        data.buy_lock.active=true
        data.btn_buy.node.active=true
        
        if(i>=5){
            data.arrow.active=false
        }
    }
    update_ui(){
        let dt= Game.SUserActivity.getData().activityData[GiftData.get_active_id()];
        // let itemsMeta=GiftData.get_active_buy_items();
        this.buy_item_list.forEach((data,i) => {
            // let meta=itemsMeta[i];
            let idx=i%3
            data.bkg2.spriteFrame=this.mysprites[idx]
            if(i==2){
                data.bkg2.spriteFrame=this.mysprites[0]
            }else if(i==3){
                data.bkg2.spriteFrame=this.mysprites[2]
            }

            if(i<dt.index){
                this.hasBuyItem(data,i)
            }else if(i==dt.index){
                this.curBuyItem(data,i)
            }else{
                this.noBuyItem(data,i)
            }

            data.reward_layout.destroyAllChildren()
            let packItem=GiftData.get_meta_by_index(i);
            data.label_buy_cost.string = GiftData.get_buy_price_str(packItem.shopId)
            let currentGet = Game.Content.FromStrings(Meta.packrewardMeta.GetValue(packItem.bounce.id).Item())
            // console.log(data.node,currentGet);
            currentGet.forEach((reward,idx) => {
                let reward_node = cc.instantiate(data.reward_item)
                reward_node.parent = data.reward_layout
                reward_node.active = true
                reward_node.getComponent(ContentModel).show(reward)
                // reward_node.getComponent(cc.Button).clickEvents[0].customEventData = `reward||${i}_${idx}`
                reward_node.name="item_"+(i)+"_"+idx
                if(reward.type== Game.Content.Types.RandomPack||reward.type==Game.Content.Types.Gift){
                    reward_node.getChildByName("info").active=true
                }else{
                    reward_node.getChildByName("info").active=false
                }
            });
        });

        this.scheduleOnce(() => {
            this.playCurrentItemAni()
        }, 0.1)
    }
    event_buy(e, index) {
        if (GamePlay.instance.isBusy()) return
        let data=this.buy_item_list[index]
        let packItem=GiftData.get_meta_by_index(index);
        index = Number.parseInt(index)
        
        // console.log(index,'iiii',packItem);
        let dt= Game.SUserActivity.getData().activityData[GiftData.get_active_id()];
        // console.log(dt.index,dt,index);

        if(data.buy_lock.active)return;
        if(dt.index!=index)return;
        
        // data.btn_buy.interactable
        let shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, packItem.shopId)
        
        if (GiftData.get_buy_item_type(packItem.shopId) === "free") {
            GameKit.DataCache.SetData("HijackGetReward", (rewards) => {
                UIRoot.instance.openChildWindow("GetRewardWindow", {contents: rewards, showCallback: (wnd) => {
                    wnd.addOnCloseFunc(()=>{
                        this.showNext('free',rewards)
                    })
                }})
            })
            let sr = SR.SRActivityFlytoSky.activityFlytoSkyFree(GiftData.get_active_id(),packItem.bounce.id)

            sr.Send()
        } else if (GiftData.get_buy_item_type(packItem.shopId) === "coin") {
            // let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, packItem.shopId)
            // let price = meta.Price()
            // if (!Game.ContentCheck.CheckCoin(price, true)) {
            //     if (this.childWindowChain) {
            //         this.clearOnCloseFunc()
            //         this.childWindowChain.end()
            //     }
            //     this.closeAnim()
            //     return
            // }

            // let req = SR.SRShop.payFor(meta.Id())
            // req.SetCallBack(function () {
            //     let sr = SR.SRActivityHeist.activityHeistAddBuyCount(HeistData.get_activity_meta_id())
            //     sr.SetCallBack(() => {
            //         UIRoot.instance.openChildWindow("PaySuccessWindow", { from: "pack", showCallback: (wnd) => {
            //             wnd.addOnCloseFunc(this.showNext.bind(this))
            //         }})
            //         GameKit.SoundManager.playSound("item_purchased")
            //     })
            //     sr.Send()
            // }.bind(this))
            // req.Send()
        } else {
            let rewards = Game.Content.FromStrings(Meta.packrewardMeta.GetValue(packItem.bounce.id).Item())
            AppKit.PaymentWrap.Pay(shopmeta.Name(), function (ok) {
                if (ok) {
                    let sr = SR.SRActivityFlytoSky.activityFlytoSkyBuy(GiftData.get_active_id(),packItem.bounce.id)
                    sr.SetCallBack(() => {
                        UIRoot.instance.openChildWindow("PaySuccessWindow", { from: "pack", showCallback: (wnd) => {
                            wnd.addOnCloseFunc(()=>{
                                this.showNext('money',rewards)
                            })
                        } })
                        GameKit.SoundManager.playSound("item_purchased")
                    })
                    sr.Send()

                    AppKit.LogEventWrap.logEvent("ShopDetail", { itemType: "pack", name: shopmeta.Name(), phase: 1 })
                } else {
                    AppKit.LogEventWrap.logEvent("ShopDetail", { itemType: "pack", name: shopmeta.Name(), phase: -1 })
                }
            }.bind(this))

            AppKit.LogEventWrap.logEvent("ShopDetail", { itemType: "pack", name: shopmeta.Name(), phase: 0 })
        }
    }

    onClose() {
        // this.unbind_ui();
        this.showNextAnim=false
        this.buy_item_list.forEach(function (v, i) {
            v.reward_layout.getComponentsInChildren(ContentModel).forEach(function (x) {
                return x.onClose();
            });
        });
    }
    event_close() {
        this.closeAnim()
    }

    update() {
        if (this.leftTime != null) {

            let currentTime = GameKit.TimeUtil.getCurrentTime()

            this.leftTime = GiftData.get_activity_meta().EndTime() - currentTime

            this.labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false)

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }
    }
    playCurrentItemAni(){
        if(!this.showNextAnim)return;
        let dt= Game.SUserActivity.getData().activityData[GiftData.get_active_id()];
        let index=dt.index-1;
        
        if(index>=6)return;
        // console.log(index,'已经购买的按钮');
        let data=this.buy_item_list[index];
        let self=this
        this.scaleNode(data.btn_buy.node,0.3,0,0,()=>{
            self.hasBuyItem(data,index)
            self.playNextItemAni()
        })

        // console.log("xxxx");
    }
    playNextItemAni(){
        if(!this.showNextAnim){
            this.showNextAnim=false
            return
        }

        
        let dt= Game.SUserActivity.getData().activityData[GiftData.get_active_id()];
        let index=dt.index;
        
        if(index>=6)return;
        // console.log("准备购买的按钮",index);
        let data=this.buy_item_list[index];
        let self=this
        data.buy_lock_particle.node.active=true
        data.buy_lock_particle.resetSystem()
        data.buy_lock_particle.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
            data.buy_lock_particle.node.active=false
        })))
        this.alphaNode(data.buy_lock,0.5,0,()=>{
            self.curBuyItem(data,index)
        })
    }
    alphaNode(node,time,alpha,callback){
        let req=cc.sequence(cc.fadeTo(time,alpha).easing(cce.CCEaseTypes.GetEasing(cce.CCEaseTypes.Types.easeInOut)),cc.callFunc(()=>{
            if(callback){
                callback()
            }
        }))
        node.runAction(req)
    }
    scaleNode(node,time,scaleX,scaleY,callback){
        let req=cc.sequence(cc.scaleTo(time, scaleX, scaleY).easing(cce.CCEaseTypes.GetEasing(cce.CCEaseTypes.Types.easeInOut)),cc.callFunc(()=>{
            if(callback){
                callback()
            }
        }))
        node.runAction(req)
    }
    // 该物品已经获取则按钮隐藏动画，背景显示为灰色
    //如存在下一个对象则下一个对象背景为金黄色，如是免费则动画隐藏锁
    //如全部获取时播放下庆祝动画
    showNext(type,rewards) {
        for (let index = 0; index < rewards.length; index++) {
            const reward = rewards[index];
            if(reward.ContentId()==Game.UserItems.ToolType.GoldEgg){
                Game.ActivityManager.AddLocalDymicActiveToolList()
                this.nextStep()
                return
            }
        }

        this.showNextAnim=true
        this.playCurrentItemAni()

        // // console.log(type,rewards);
        // let contentId=GiftData.check_reward_contentId(rewards)
        // if(contentId==-1){
        //     this.showNextAnim=true
        //     this.playCurrentItemAni()
        // }else{
        //     if(contentId==Game.UserItems.ToolType.GoldEgg){
        //         //金蛋
        //         this.closeAnim(()=>{
        //             if(GamePlay.instance.currentScene!=GamePlay.Scenes.Slot){
        //                 GamePlay.instance.changeScene(GamePlay.Scenes.Slot,()=>{
        //                     GameKit.WebEvent.DispatcherEvent(GameKit.GameEvent.EventName.FlytoSkyToolEvent, {contentId:3,'eventName':'playEggAnim'})
        //                 })
        //             }else{
        //                 GameKit.WebEvent.DispatcherEvent(GameKit.GameEvent.EventName.FlytoSkyToolEvent, {contentId:3,'eventName':'playEggAnim'})
        //             }
        //         })
        //     }else{
        //         this.showNextAnim=true
        //         this.playCurrentItemAni()
        //     }
        // }

        Game.ActivityManager.AddLocalDymicActiveToolList()
    }

    nextStep(){
        let meta=this.meta
        this.closeAnim(()=>{
            if(GamePlay.instance.currentScene!=GamePlay.Scenes.Slot){
                GamePlay.instance.changeScene(GamePlay.Scenes.Slot,()=>{
                    UIRoot.instance.openChildWindow("GiftMainWindow",{meta:meta,showNextAnim:true})
                })
            }else{
                UIRoot.instance.openChildWindow("GiftMainWindow",{meta:meta,showNextAnim:true})
            }
        })
        
    }

}
