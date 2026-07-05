import { UIWindow } from '../../../GameKit/ui/UIWindow';
import ContentModel from '../../../game/items/ContentModel';
import { _decorator, Button, instantiate, Label, Node, ParticleSystem2D, Sprite } from 'cc';

import { UserItems } from '../../../game/items/UserItems';
const { ccclass, property } = _decorator

const tipPosY=[ -156,-429,-210]
const arrowY=[295,295,-38]

@ccclass
export default class OptionalGiftPackWindow extends UIWindow {

    static windowPath = "Activity/optionalGiftPack/OptionalGiftPackWindow";
    
    meta = null
    leftTime = null


    @property({ tooltip: "", type: Label })
    labelTimer = null

    @property([Node])
    items=[]

    onShow(params) {
        this.meta = params.meta
        this.create_buy_item()
        this.update_ui()
        this.update()


        let sr = SR.SRActivityFlytoSky._getActivityChoosePackData(this.meta.Id())
        sr.SetCallBack((res) => {
            console.log(res);
        })
        sr.Send()

        this.leftTime = 0
    }
    

    buy_item_list = []
    /** 创建所有的购买项目 */
    create_buy_item() {
        let isCanBy=true
        if(Game.SUserActivity.data.activityData[this.meta.Id()]){
            isCanBy=Game.SUserActivity.data.activityData[this.meta.Id()].isBuy
        }
        this.buy_item_list = []
        for (let i = 0; i < this.items.length; i += 1) {
            let n = this.items[i]
            
            //n.parent = this.buy_item.parent
            n.active = true
            let data = {
                node: n,
                reward_layout: GameKit.ControllerTable.GetNode(n, "reward-layout"),
                reward_item: GameKit.ControllerTable.GetNode(n, "reward-item"),
                label_buy_cost: GameKit.ControllerTable.GetNode(n, "label-buy-cost").getComponent(Label),
                buy_use_coin: GameKit.ControllerTable.GetNode(n, "buy-use-coin"),
                bkg2: GameKit.ControllerTable.GetNode(n, "bkg2").getComponent(Sprite),
                btn_buy: GameKit.ControllerTable.GetNode(n, "btn-buy").getComponent(Button),
                buy_lock_particle:GameKit.ControllerTable.GetNode(n, "buy_lock_particle").getComponent(ParticleSystem2D),
            }
            
            data.buy_lock_particle.node.active=false
            data.reward_item.active=false;
            this.buy_item_list.push(data)
            data.btn_buy.clickEvents[0].customEventData = `${i}` // 保存按钮对应的buy-item-index
            data.btn_buy.interactable=isCanBy
        }

        
    }
    update_ui(){
        let activityChoosePackItem=Meta.ActivityChoosePackMeta.getActivityChoosePackItem(this.meta.Id())
        this.buy_item_list.forEach((data,i) => {
            let it=activityChoosePackItem[i]
            let packId=it[0]
            let shopId=it[1]
            data.label_buy_cost.string = Meta.ActivityChoosePackMeta.get_buy_price_str(shopId)
            let packRewardMeta=Meta.ChoosePackRewardPackMeta.getChoosePackRewardsByLevel(packId,Game.SUserVillage.MapId())
            let rewards=Game.Content.FromStrings(packRewardMeta.Item())
            rewards.forEach(reward => {
                let reward_node = instantiate(data.reward_item)
                reward_node.parent = data.reward_layout
                reward_node.active = true
                reward_node.getComponent(ContentModel).show(reward)
                if(reward.type== Game.Content.Types.RandomPack||reward.type==Game.Content.Types.Gift){
                    reward_node.getChildByName("info").active=true
                }else{
                    reward_node.getChildByName("info").active=false
                }
            });
        });
    }
    event_buy(e, index) {
        if (GamePlay.instance.isBusy()) return
        let data=this.buy_item_list[index]
        let activityChoosePackItem=Meta.ActivityChoosePackMeta.getActivityChoosePackItem(this.meta.Id())[index]
        let packId=activityChoosePackItem[0]
        let shopId=activityChoosePackItem[1]
        
        let shopmeta = Meta.MetaManager.GetMeta(Meta.MetaType.Shop, shopId)
        // console.log(shopmeta);
        
        if (Meta.ShopMeta.get_buy_item_type(shopId) === "free") {
            
        } else if (Meta.ShopMeta.get_buy_item_type(shopId) === "coin") {
            
        } else {
            let packRewardMeta=Meta.ChoosePackRewardPackMeta.getChoosePackRewardsByLevel(packId,Game.SUserVillage.MapId())
            let rewards=Game.Content.FromStrings(packRewardMeta.Item())
            console.log(rewards);

            AppKit.PaymentWrap.Pay(shopmeta.Name(), function (ok) {
                if (ok) {
                    let sr = SR.SRActivityFlytoSky._getActivityChoosePackBuy(this.meta.Id(),packId,packRewardMeta.Item())
                    sr.SetCallBack(() => {
                        UIRoot.instance.openChildWindow("PaySuccessWindow", { from: "pack", showCallback: (wnd) => {
                            wnd.addOnCloseFunc(()=>{
                                this.showNext(rewards)
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

            
            this.leftTime = this.meta.EndTime() - currentTime

            this.labelTimer.string = GameKit.i18n.t("ActivityTimeleft") + " " + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, false)

            if (this.leftTime <= 0) {
                this.leftTime = null
            }
        }
    }
    // 该物品已经获取则按钮隐藏动画，背景显示为灰色
    //如存在下一个对象则下一个对象背景为金黄色，如是免费则动画隐藏锁
    //如全部获取时播放下庆祝动画
    showNext(rewards) {
        this.closeAnim(()=>{
            rewards.forEach(reward => {
                if(reward.Type()==Game.Content.Types.Gift){
                    if(reward.ContentId()==UserItems.ToolType.GoldEgg){
                        this.nextStep()
                    }
                }
            });

            // 购买后则关闭活动
            Game.ActivityManager.ActivityOver(this.meta.Id())
            Game.ActivityManager.AddLocalDymicActiveToolList()
        })
    }
    nextStep(){
        if(GamePlay.instance.currentScene!=GamePlay.Scenes.Slot){
            GamePlay.instance.changeScene(GamePlay.Scenes.Slot)
        }
    }

}
