import { UserItems } from '../../game/items/UserItems';
﻿// fengyong-2019-6-5
// @ts-check
//let isActive=Game.SUserItems.ToolIsActive(UserItems.ToolType.CardsBoom) 鍒ゅ畾鏄惁寮€鍚?0%鍗＄墝濂栧姳

import { _decorator, instantiate, Label, Layout, Node, Sprite, SpriteFrame, tween, UITransform, v3, Vec3, view } from 'cc';
import { UIWindow } from '../../GameKit/ui/UIWindow';
import CardModel from "./CardModel";

const { ccclass, property } = _decorator
const C = {
    ITEM_CARD_SCALE_BIG: 0.8,       // 涓€琛?寮犲崱鐗屾椂瀵瑰簲鐨刬tem-card-scale 0.8
    ITEM_CARD_SCALE_MEDIUM: 0.6,    // 4寮犲崱鐗屾椂瀵瑰簲鐨刬tem-card-scale 0.6
    ITEM_CARD_SCALE_MEDIUM2: 0.5,   // 涓€琛?寮犲崱鐗屾椂瀵瑰簲鐨刬tem-card-scale 0.5
    ITEM_CARD_SCALE_SMALL: 0.42,    // 涓€琛?寮犲崱鐗屾椂瀵瑰簲鐨刬tem-card-scale 0.42
    SHOW_CARD_INTERVAL: 0,        // 鏄剧ず鍗曞紶鍗＄墖鐨勬椂闂撮棿闅?0.3

    SOUND_FALL: "chest_fall",
    SOUND_OPEN: "chest_open",
    SOUND_CARD: "chest_card",
    SOUND_CARD_NEW: "chest_card_new",
    SOUND_CARD_GOLDEN: "chest_card_golden",

    itemsPos: {
        1: [{x:0, y:0}],
        2: [{x:-100, y:0}, {x:100, y:0}],
        3: [{x:-160, y:0}, {x:0, y:0}, {x:160, y:0}],
        4: [{x:-100, y:80}, {x:100, y:80}, {x:-100, y:-80}, {x:100, y:-80}],
    }
}

var IsChestShow=false
var IsAutoChestQueued=false

/**
 * 鍗＄墝瀹濈鎵撳紑椤甸潰
 * - [娉ㄦ剰] 鏆傛椂鏀寔鐨?鐣岄潰鍚堢悊鐨?鎵撳紑涓暟:1,2,4,6,8
 */
@ccclass('CardChestOpenWindow')
export default class CardChestOpenWindow extends UIWindow {

    static windowPath = "Card/CardChestOpenWindow";
    userChest_Source = null
    chestId = null
    randomPackReward = null
    closeCallback = null
    chest_meta = null
    chest_index = null
    card_meta_id_list = null
    card_meta_count = null
    randomPackId = null
    showItems: Node[] = []

    private getNodeWidth(node: Node) {
        return node.getComponent(UITransform)?.width || 0
    }

    private setNodeWidth(node: Node, width: number) {
        const transform = node.getComponent(UITransform)
        if (transform) transform.setContentSize(width, transform.height)
    }

    static enqueueShow = function(closeCallback=null,chestId=null) {
        if (IsAutoChestQueued) return true
        if (!this.hasPendingChest()) return false

        IsAutoChestQueued = true
        GameKit.AutoWindowQueue.enqueue("CardChestOpenWindow", {}, {
            stage: "runtime_reward",
            source: "card_chest",
            preshowCallback: function() {
                IsAutoChestQueued = false
                let showParams = CardChestOpenWindow.takeAutoShowParams(closeCallback, chestId)
                if (!showParams) return false

                IsChestShow = true
                return showParams
            }
        })
        return true
    }

    static hasPendingChest = function() {
        let chestArr = GameKit.DataCache.GetData("UserCardChestArr")||[]
        let randomPackArr = GameKit.DataCache.GetData("UserRandomPackArr")||[]
        return chestArr.length > 0 || randomPackArr.length > 0
    }

    static takeAutoShowParams = function(closeCallback=null,chestId=null) {
        if(IsChestShow){
            console.log('姝ｅ湪鏄剧ず绠卞瓙锛屽緟浼氬啀鏉?')
            return null
        }

        let chestCard = null
        let randomPack = null
        let chestArr = GameKit.DataCache.GetData("UserCardChestArr")||[]
        let randomPackArr = GameKit.DataCache.GetData("UserRandomPackArr")||[]
        if(chestArr.length==0&&randomPackArr.length==0){
            console.log('娌℃湁绠卞瓙')
            return null
        }

        if(!chestId){
            if(randomPackArr.length>0){
                randomPack=randomPackArr[0]
                chestId=this.findChestIdInRandomPack(randomPack)
                chestCard=this.findChestByChestId(chestArr,chestId)
            }else{
                if(chestArr&&chestArr.length>0){
                    chestCard=chestArr[0]
                }
            }
        }else{
            if(chestArr&&chestArr.length>0){
                chestCard=this.findChestByChestId(chestArr,chestId)
            }
        }

        console.log("randomPack:",randomPack,'chestCard:',chestCard,'chestId',chestId)

        if (randomPack || chestCard) {
            if(chestCard){
                this.deleteChestById(GameKit.DataCache.GetData("UserCardChestArr")||[],chestCard.type)
            }
            if(randomPack){
                this.deleteRandomPackByChestId(GameKit.DataCache.GetData("UserRandomPackArr")||[],randomPack.id)
            }
            chestArr = GameKit.DataCache.GetData("UserCardChestArr")||[]
            randomPackArr = GameKit.DataCache.GetData("UserRandomPackArr")||[]
            console.log("鍓╀綑鏅€氱瀛?",chestArr.length,"鍓╀綑闅忔満绠卞瓙:",randomPackArr.length)
            return {chest: chestCard, randomPack: randomPack,closeCallback:closeCallback}
        }
        return null
    }

    static tryShow = function(closeCallback=null,chestId=null) {
        // chestId  鍗＄墝绠卞瓙鐨刬d
        // randomPack閲屽寘鍚玞hestCard鐨勫€? 鍒犻櫎randomPack鐨勫€兼椂瑕佸悓鏃跺垹闄hestCard
        if(IsChestShow){
            console.log('姝ｅ湪鏄剧ず绠卞瓙锛屽緟浼氬啀鏉?'); 
            return false
        }
        let chest = null
        let chestCard = null
        let randomPack = null
        let chestArr = GameKit.DataCache.GetData("UserCardChestArr")||[]
        let randomPackArr = GameKit.DataCache.GetData("UserRandomPackArr")||[]
        if(chestArr.length==0&&randomPackArr.length==0){
            console.log('娌℃湁绠卞瓙');
            //娌℃湁绠卞瓙
            return false   //true灏辨槸缁撴潫浜?        }
        if(!chestId){
            //鏈煡绠卞瓙id鍒欎粠鏁版嵁閲岀涓€涓彇
            if(randomPackArr.length>0){
                randomPack=randomPackArr[0]
                chestId=this.findChestIdInRandomPack(randomPack)
                chestCard=this.findChestByChestId(chestArr,chestId)
            }else{
                if(chestArr&&chestArr.length>0){
                    chestCard=chestArr[0]
                }
            }
            // console.log("randomPack:",randomPack,'chestCard:',chestCard,'chestId',chestId);
        }else{
            //宸茬煡绠卞瓙id,鏅€氬崱鐗岀瀛?            if(chestArr&&chestArr.length>0){
                chestCard=this.findChestByChestId(chestArr,chestId)        //绠卞瓙鏁版嵁
            }
        }

        console.log("randomPack:",randomPack,'chestCard:',chestCard,'chestId',chestId);
        
        if (randomPack || chest || chestCard) {
            IsChestShow=true
            UIRoot.instance.openChildWindow("CardChestOpenWindow", {chest: chestCard, randomPack: randomPack,closeCallback:closeCallback})
            if(chestCard){
                // [{type: 14, cards: Array(4)}]
                this.deleteChestById(GameKit.DataCache.GetData("UserCardChestArr")||[],chestCard.type)
            }
            if(randomPack){
                this.deleteRandomPackByChestId(GameKit.DataCache.GetData("UserRandomPackArr")||[],randomPack.id)
            }
            chestArr = GameKit.DataCache.GetData("UserCardChestArr")||[]
            randomPackArr = GameKit.DataCache.GetData("UserRandomPackArr")||[]
            console.log("闄愭椂娲诲姩"+CardLimitSkinAssetsSetting.isActive+"鍓╀綑鏅€氱瀛?",chestArr.length,"鍓╀綑闅忔満绠卞瓙:",randomPackArr.length);
            return true
        }
        return false
    }
    //鏌ョ湅RandomPakc涓槸鍚︽湁绠卞瓙锛屽苟杩斿洖绠卞瓙id
    static findChestIdInRandomPack(randomPack){
        let rewards=randomPack.rewards||randomPack.randomPack.rewards
        for (let j = 0; j < rewards.length; j++) {
            const reward = rewards[j];
            if(reward.type==Game.Content.Types.CardChest){
                return reward.cid
            }
        }
        return null
    }

    //鏍规嵁绠卞瓙id鑾峰彇绠卞瓙鏁版嵁
    // [{type: 14, cards: Array(4)}]
    static findChestByChestId(chestArr,chestId){
        for (let index = 0; index < chestArr.length; index++) {
            const chest = chestArr[index].chest||chestArr[index];
            if(chest.type==chestId){
                return chest
            }
        }
        return null
    }
    //鍒犻櫎鍗＄墝绠卞瓙
    static deleteChestById(chestArr,chestId){
        for (let index = 0; index < chestArr.length; index++) {
            const chest = chestArr[index].chest||chestArr[index];
            if(chest.type==chestId){
                chestArr.splice(index,1)
                GameKit.DataCache.SetData("UserCardChestArr", chestArr)
                return
            }
        }
    }
    //鏍规嵁id鍒犻櫎RandomPack
    static deleteRandomPackByChestId(array,id){
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.id==id){
                array.splice(index,1)
                GameKit.DataCache.SetData("UserRandomPackArr", array)
                return
            }
            
        }
        return null
    }
    //鏍规嵁绠卞瓙id鏌ユ壘RandomPack
    static findRandomPackByChestId(array,chestId){
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            for (let j = 0; j < element.rewards.length; j++) {
                const reward = element.rewards[j];
                if(reward.type==Game.Content.Types.CardChest){
                    if(reward.cid==chestId){
                        return element
                    }
                }
            }
            
        }
        return null
    }
    static getCardByType(chestArr,type){
        for (let index = 0; index < chestArr.length; index++) {
            const element = chestArr[index].chest||chestArr[index];
            if(element.type==type){
                chestArr.splice(index,1)
                GameKit.DataCache.SetData("UserCardChestArr", chestArr)
                return element
            }
        }
        return null
    }
    getSourceByType(chestArr,type,tname){
        for (let index = 0; index < chestArr.length; index++) {
            const element = chestArr[index]
            if(element.id==type){
                chestArr.splice(index,1)
                GameKit.DataCache.SetData(tname, chestArr)
                return element.source
            }
        }
        return null
    }
    logRandomPack(chest){
        if(!chest)return
        this.userChest_Source=null
        let tname="UserRandomPack_Source"
        let userChest_Source = this.getSourceByType(GameKit.DataCache.GetData(tname)||[],this.chestId,tname)
        if(userChest_Source&&chest){
            this.userChest_Source=userChest_Source
            let obj:any={chest_id:this.chestId,chest_source:userChest_Source}
            this.randomPackReward.forEach(x => {
                let con = Game.Content.FromContent(x)
                if (con.Type() == Game.Content.Types.CardChest){
                    obj.chest_reward_card_list=chest.cards
                }else if(con.Type() == Game.Content.Types.Coin){
                    obj.chest_reward_coin=con.Count()
                }else if(con.Type() == Game.Content.Types.Ap){
                    obj.chest_reward_spin=con.Count()
                }else if(con.Type() == Game.Content.Types.Item){
                    let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Item, con.ContentId())
                    if(meta){
                        if(meta.Icon()=='pet_xpPotion'){
                            obj.chest_reward_petexp=con.Count()
                        }else if(meta.Icon()=='pet_food'){
                            obj.chest_reward_petfood=con.Count()
                        }
                    }
                }
            })
//            AppMain.instance.ta.track('chest_sp',obj)
        //     // AppMain.instance.ta.track('chest_sp',{chest_id:this.chestId,
        //     //     chest_source:userChest_Source,chest_reward_spin:0,chest_reward_coin:0,chest_reward_petfood:0,chest_reward_petexp:0,
        //     //     chest_reward_card_list:[],chest_reward_card_joker:0})
        }
    }
    logChest(chest){
        let tname="UserChest_Source"
        let userChest_Source = this.getSourceByType(GameKit.DataCache.GetData(tname)||[],this.chestId,tname)
        this.userChest_Source=null
        if(userChest_Source){
            this.userChest_Source=userChest_Source
            let obj:any={chest_id:this.chestId,chest_source:userChest_Source}
            obj.chest_reward_card_list=chest.cards
//            AppMain.instance.ta.track('chest',obj)
        }
        
    }
    onShow(showParams) {
        GameKit.BackKeyManager.registerBackEvent()
        this.closeCallback=showParams.closeCallback
        
        // console.log(showParams,'aa');
        // 棰勫厛鑾峰彇涓€浜涙暟鎹?
        let chest = showParams.chest
        if (chest) {
            this.chestId = chest.type
            this.chest_meta = Meta.MetaManager.GetMeta(Meta.MetaType.CardChest, this.chestId)
            this.chest_index = this.chest_meta.Id() - 1 // 褰撳墠chest鐨刬ndex
            this.card_meta_id_list = chest.cards
            this.card_meta_count = {}
            this.card_meta_id_list.forEach(metaId => {
                this.card_meta_count[metaId] = this.card_meta_count[metaId] || 0
                this.card_meta_count[metaId]++
            })
            //澧炲姞鏁伴噺
            this.label_card_count.string = `${this.card_meta_id_list.length}`

            if(!showParams.randomPack){
                //鏅€氱瀛?                this.logChest(chest)
            }

            //鐢ㄦ埛鍙嶅簲璐拱绠卞瓙娌℃湁鍗＄墝鐩存帴鏄剧ず闆?娌℃硶鍥哄畾澶嶇幇__鑰佹澘鍐冲畾涓嶇璐拱鐨勪粈涔堢瀛愮洿鎺ユ斁鍏ュ叓寮犲崱鐗?23_02_03)
            //涓€瀹氳鎵惧埌鏍规湰闂鍦ㄦ敼,涓嶈兘鑰佹澘璁╁姞灏卞姞,鍙嶈€屽鑷撮棶棰樻洿涓ラ噸
            if(this.card_meta_id_list.length <= 0 )
            {
                // let card_data = Object.keys(Game.SUserCard.CardData())
                // for (let i = 0; i < 8; i++) {
                //     const rIndex = ~~(Math.random() * card_data.length);
                //     console.log("rIndex============="+rIndex); 
                //     this.card_meta_id_list.push(card_data[rIndex]);
                //     card_data.splice(rIndex, 1);
                // }
                console.log("绠卞瓙涓虹┖")
            }
        }
        let randomPack = showParams.randomPack
        if (randomPack) {
            this.randomPackId = randomPack.id
            this.randomPackReward = randomPack.rewards
            this.logRandomPack(chest)  //灏忎笐绠卞瓙
        }

        this.item_card.active = false
        this.card_count.setScale(0, 0, 0)
        
        let isActive = Game.SUserItems.ToolIsActive(UserItems.ToolType.CardsBoom)
        this.cardsBoom.active = isActive
        // console.log("isActive"+isActive);        

        // 鍒涘缓骞舵樉绀哄姩鐢?
        Promise.all([
            this.create_all_card(),
            this.create_all_items(),
            this.anima_show_chest(),
        ]).then(() => {
            this.state = "show"
            this.scheduleOnce(() => {
                this.anima_open_chest().then(() => {
                    this.scheduleOnce(() => {
                        if (this.randomPackReward) {
                            this.anima_show_all_items().then(() => { this.state = "itemsOver" })
                        } else {
                            this.anima_show_all_card().then(() => { this.state = "end" })
                        }
                    }, 0.3)
                })
            }, 0.3)
        })

    }

    onClose() {
        if (GameMainWindow.instance) GameMainWindow.instance.showStar()
        GameKit.BackKeyManager.unregisterBackEvent()

        if(this.closeCallback!=null){
            this.closeCallback()
            this.closeCallback=null
        }
        

        this.layout_card.getComponentsInChildren(CardModel).forEach(v => v.onClose())
        IsChestShow=false
        CardChestOpenWindow.enqueueShow()
    }

    /**
     * 鐣岄潰鐘舵€?     * @type {"pre"|"show"|"end"|"itemsOver"}
     * - pre:鍑嗗鐘舵€?鍑嗗濂芥墍鏈夌殑鏁版嵁,鏄剧ず瀹濈鎺夎惤鍔ㄧ敾
     * - show:鏄剧ず鐘舵€?鍗＄墝鏄剧ず鍔ㄧ敾涓?     * - end:鎵€鏈夊姩鐢荤粨鏉?     */
    state = "pre"
    /** 鍒ゆ柇鏄惁澶勪簬鏌愪竴鐘舵€?     * @param {Array<"pre"|"show"|"end"|"itemsOver">} state_list
     */
    is_state(...state_list) {
        return state_list.indexOf(this.state) >= 0
    }

    /** @type {Layout}  */
    @property({ tooltip: "card鎵€鍦ㄧ殑layout", type: Layout })
    layout_card: Layout = null

    /** @type {Node} */
    @property({ tooltip: "card-item", type: Node })
    item_card: Node = null

    /** @type {Node} */
    @property({ tooltip: "card-item", type: Node })
    cardsBoom: Node = null

    /** 鍒涘缓鎵€鏈夌殑card
     * - 缁檒ayout鍒嗕负2绾?鍗曡鏄剧ず1~2涓?鍗曡鏄剧ず4涓彲鏄剧ず澶氳
     */
    create_all_card() {
        if (this.card_meta_id_list) {
            // 鏍规嵁count,璁惧畾layout鍜宨tem鐨勯厤缃俊鎭?
            let count = this.card_meta_id_list.length
            if (count <= 2) {
                this.item_card.setScale(C.ITEM_CARD_SCALE_BIG, C.ITEM_CARD_SCALE_BIG, C.ITEM_CARD_SCALE_BIG)
                this.layout_card.type = Layout.Type.HORIZONTAL
            } else if (count <= 4) {
                this.item_card.setScale(C.ITEM_CARD_SCALE_MEDIUM, C.ITEM_CARD_SCALE_MEDIUM, C.ITEM_CARD_SCALE_MEDIUM)
                this.layout_card.type = Layout.Type.GRID
                this.setNodeWidth(this.layout_card.node, Math.min(count, 2) * this.getNodeWidth(this.item_card) * this.item_card.scale.x)
            } else if (count <= 6) {
                this.item_card.setScale(C.ITEM_CARD_SCALE_MEDIUM2, C.ITEM_CARD_SCALE_MEDIUM2, C.ITEM_CARD_SCALE_MEDIUM2)
                this.layout_card.type = Layout.Type.GRID
                this.setNodeWidth(this.layout_card.node, Math.min(count, 3) * this.getNodeWidth(this.item_card) * this.item_card.scale.x)
            } else {
                this.item_card.setScale(C.ITEM_CARD_SCALE_SMALL, C.ITEM_CARD_SCALE_SMALL, C.ITEM_CARD_SCALE_SMALL)
                this.layout_card.type = Layout.Type.GRID
                this.setNodeWidth(this.layout_card.node, Math.min(count, 4) * this.getNodeWidth(this.item_card) * this.item_card.scale.x)
            }
            // 鍒涘缓
            this.card_meta_id_list.forEach(card_meta_id => {
                let n = instantiate(this.item_card)
                n.parent = this.layout_card.node
                n.setPosition(Vec3.ZERO)
                n.active = true
                // 淇敼鏄剧ず
                let sp_light = GameKit.ControllerTable.GetNode(n, "sp-light")       // 鑳屾櫙鍏夋晥
                let sp_light_Golden = GameKit.ControllerTable.GetNode(n, "sp-light-golden")       // 閲戝崱鑳屾櫙鍏夋晥
                let card_back = GameKit.ControllerTable.GetNode(n, "card-back")     // 鍗＄墝鑳岄潰
                let card_front = GameKit.ControllerTable.GetNode(n, "card-front")   // 鍗＄墝姝ｉ潰
                let sp_new = GameKit.ControllerTable.GetNode(n, "sp-new")           // 鏄惁涓烘柊鍗＄墝鏍囪
                sp_light.setScale(0, 0, 0)
                card_back.setScale(0, 0, 0)
                card_front.setScale(0, 0, 0)
                sp_light_Golden.setScale(0, 0, 0)
                card_front.getComponent(CardModel).show(card_meta_id, "no-check")
                let isNew = Game.SUserCard.CardNum(card_meta_id) <= this.card_meta_count[card_meta_id]
                if (isNew) { this.card_meta_count[card_meta_id] = 0 }
                if (card_meta_id == Game.Content.JokerCardId) isNew = false
                sp_new.active = isNew
                if(card_front.getComponent(CardModel).card_meta&&card_front.getComponent(CardModel).card_meta.Golden()&&isNew){
                    if(this.userChest_Source){
                        let obj={card_id:card_meta_id,gold_card_source:2,random_gold_card_source:this.userChest_Source}
//                        AppMain.instance.ta.track('random_gold_card',obj)
                    }
                }
            })
            if(this.cardsBoom.active){
                this.layout_card.node.setPosition(this.layout_card.node.position.x, 125, this.layout_card.node.position.z)
            }
            else{
                this.layout_card.node.setPosition(this.layout_card.node.position.x, 200, this.layout_card.node.position.z)
            }
            // console.log("this.cardsBoom.active"+this.cardsBoom.active);
            // console.log("this.layout_card.y"+this.layout_card.y);
        }
    }

    /** @type {Sprite} */
    @property({ tooltip: "瀹濈缁勪欢", type: Sprite })
    sp_chest: Sprite = null

    /** @type {Node} */
    @property(Node)
    card_count: Node = null

    /** @type {Label} */
    @property(Label)
    label_card_count: Label = null

    /** 鍔ㄧ敾:鎺夎惤绠卞瓙 */
    anima_show_chest() {
        return new Promise(res => {
            GameKit.SoundManager.playSound(C.SOUND_FALL)
            let sp = null
            if (this.randomPackId != null) {
                sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.RandomPack, this.randomPackId)
            } else if (this.chest_index != null&&this.spf_chest_close_list[this.chest_index]) {
                sp = this.spf_chest_close_list[this.chest_index]
            } else if (this.chest_index != null&&[15,16,17,18,19].indexOf(this.chest_index) >= 0) {
                sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.CardChest, this.chest_meta.Icon())
            }else{
                //闄愭椂鍗＄墝绠卞瓙
                if(CommonAssets.instance.cardLimitSkinAssets){
                    let spName=CardLimitSkinAssetsSetting.box[this.chest_meta.Id().toString()]
                    sp=CommonAssets.instance.cardLimitSkinAssets[spName]
                }
                
            }
            this.sp_chest.spriteFrame = sp
            let chest_position = this.sp_chest.node.position.clone()
            tween(this.sp_chest.node)
                .set({ position: chest_position.clone().add(v3(0, view.getVisibleSize().height, 0)) })
                .to(1, { position: chest_position }, { easing: "bounceOut" })
                .call(res)
                .start()
        })
    }

    /** 鍔ㄧ敾:鎵撳紑box,鏄剧ずcard-count */
    anima_open_chest() {
        return new Promise(res => {
            GameKit.SoundManager.playSound(C.SOUND_OPEN)
            let sp = null
            if (this.randomPackId != null) {
                sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.RandomPack, this.randomPackId.toString() + "_open")
            } else if (this.chest_index != null&&this.spf_chest_open_list[this.chest_index]) {
                sp = this.spf_chest_open_list[this.chest_index]
            }else if (this.chest_index != null&&[15,16,17,18,19].indexOf(this.chest_index) >= 0) {
                sp = CommonAssets.instance.getByAtlas(CommonAssets.Atlases.CardChest, this.chest_meta.Icon()+ "_open")
            }else{
                //闄愭椂鍗＄墝绠卞瓙
                if(CommonAssets.instance.cardLimitSkinAssets){
                    let spName=CardLimitSkinAssetsSetting.box[this.chest_meta.Id().toString()+'_open']
                    sp=CommonAssets.instance.cardLimitSkinAssets[spName]
                }
                
            }
            this.sp_chest.spriteFrame = sp
            if (this.randomPackId) {
                res(null)
            } else {
                let card_count_position = this.card_count.position.clone()
                tween(this.card_count)
                    .set({ position: Vec3.ZERO, scale: Vec3.ZERO })
                    .to(0.3, { position: card_count_position, scale: Vec3.ONE })
                    .call(res)
                    .start()
            }
        })
    }

    /** 鍔ㄧ敾:鏄剧ず鎵€鏈夌殑鍗＄墝
     * - [鐗瑰埆娉ㄦ剰] 鍗曞紶鍗＄墖鍦ㄥ垱寤烘椂鍒濆鍖杝cale=0,杩欓噷闇€瑕侀噸鏂拌祴鍊煎垵濮嬬姸鎬?     * - 鍗曞紶鍗＄墝鐨勫姩鐢?浠庝笅鏂归鍏?鏄剧ずback,鍙嶈浆,鏄剧ずfront/light
     */
    anima_show_all_card() {
        let count = this.layout_card.node.children.length
        this.layout_card.node.children.forEach((n, index) => {
            let sp_light = GameKit.ControllerTable.GetNode(n, "sp-light")       // 鑳屾櫙鍏夋晥
            let sp_light_Golden = GameKit.ControllerTable.GetNode(n, "sp-light-golden")       // 閲戝崱鑳屾櫙鍏夋晥
            let card_back = GameKit.ControllerTable.GetNode(n, "card-back")     // 鍗＄墝鑳岄潰
            let card_front = GameKit.ControllerTable.GetNode(n, "card-front")   // 鍗＄墝姝ｉ潰
            let sp_new = GameKit.ControllerTable.GetNode(n, "sp-new")           // 鏄惁涓烘柊鍗＄墝鏍囪
            // card-back鍔ㄧ敾
            let anima_card_back = () => new Promise<void>(res => {
                tween(card_back)
                    .delay(C.SHOW_CARD_INTERVAL * index)
                    .call(() => {
                        count -= 1
                        this.label_card_count.string = `${count}`
                        // 澹伴煶
                        if (card_front.getComponent(CardModel).joker || card_front.getComponent(CardModel).card_meta.Golden()) {
                            GameKit.SoundManager.playSound(C.SOUND_CARD_GOLDEN)
                        } else if (sp_new.active) {
                            GameKit.SoundManager.playSound(C.SOUND_CARD_NEW)
                        } else {
                            GameKit.SoundManager.playSound(C.SOUND_CARD)
                        }
                    })
                    .set({ position: v3(n.getComponent(UITransform)!.convertToNodeSpaceAR(this.card_count.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))), scale: new Vec3(0.25, 0.25, 0.25), })
                    .to(0.5, { position: Vec3.ZERO, scale: Vec3.ONE }, { easing: "expoOut" })
                    .to(0.1, { scaleX: 0 })
                    .call(() => {
                        if (card_front.getComponent(CardModel).joker) {
                            tween(card_front)
                                .repeatForever(
                                    tween()
                                        .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: "sineOut" })
                                        .to(0.3, { scale: Vec3.ONE }, { easing: "sineIn" })
                                )
                                .start()
                        }
                    })
                    .call(res)
                    .start()
            })
            // card-front鍔ㄧ敾
            let anima_card_front = () => new Promise<void>(res => {
                tween(card_front)
                    .set({ scaleX: 0, scaleY: 1 })
                    .to(0.1, { scaleX: 1 })
                    .call(() => {
                        res()
                        sp_light.setScale(1, 1, 1)
                        tween(sp_light).repeatForever(tween().by(5, { rotation: 360 })).start()
                        if (card_front.getComponent(CardModel).joker || card_front.getComponent(CardModel).card_meta.Golden()) {
                            sp_light_Golden.setScale(1, 1, 1)
                            sp_light.setScale(0, 0, 0)
                            tween(sp_light_Golden).repeatForever(tween().by(5, { rotation: 360 })).start()
                            tween(sp_light_Golden)
                                .repeatForever(
                                    tween()
                                        .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
                                        .to(0.3, { scale: Vec3.ONE })
                                )
                                .start()
                        }
                    })
                    .start()
            })
            // 椤哄簭鎵ц2涓姩鐢?
            anima_card_back().then(() => {
                anima_card_front()
            })
        })
        return new Promise(res => { this.scheduleOnce(res, C.SHOW_CARD_INTERVAL * this.layout_card.node.children.length + 1) })
    }

    /** @type {SpriteFrame[]} */
    @property({ tooltip: "鍏叡璧勬簮:chest-open", type: SpriteFrame })
    spf_chest_open_list = []

    /** @type {SpriteFrame[]} */
    @property({ tooltip: "鍏叡璧勬簮:chest-close", type: SpriteFrame })
    spf_chest_close_list = []

    /** 鐐瑰嚮浜嬩欢:鏄剧ず鎴栬€呭叧闂晫闈?*/
    event_show() {
        if (this.is_state("itemsOver")) {
            let card_count_position = this.card_count.position.clone()
            tween(this.card_count)
                .set({ position: Vec3.ZERO, scale: Vec3.ZERO })
                .to(0.3, { position: card_count_position, scale: Vec3.ONE })
                .call(() => {
                    this.anima_show_all_card().then(() => { this.state = "end" })
                })
                .start()

            this.showItems.forEach((n, index) => {
                tween(n).to(0.25, { scale: Vec3.ZERO }).start()
            })
            this.state = "show"
        }
        else if (this.is_state("end")) {
            this.closeAnim()
        }
    }

    /** @type {Node} */
    @property({ tooltip: "contentItem", type: Node })
    contentItem = null
    /** 
     * 寤虹珛閬撳叿
    */
    create_all_items() {
        if (this.randomPackReward) {
            let allCount = this.randomPackReward.length
            if (this.chestId) allCount -= 1
            let count = 0
            this.showItems = []
            this.randomPackReward.forEach(x => {
                let con = Game.Content.FromContent(x)
                if (con.Type() == Game.Content.Types.CardChest) return
                let item = instantiate(this.contentItem)
                item.parent = this.contentItem.parent
                item.active = true
                let pos = C.itemsPos[allCount][count]
                item.setPosition(pos.x, pos.y, item.position.z)
                item.getComponent("ContentModel").show(con)
                item.setScale(0, 0, 0)
                this.showItems.push(item)
                count ++
            })
        }
    }

    anima_show_all_items() {
        this.showItems.forEach((n, index) => {
            let dp = n.getWorldPosition().subtract(this.sp_chest.node.getWorldPosition())
            n.setWorldPosition(this.sp_chest.node.getWorldPosition())
            tween(n).delay(0.15 * index).by(0.3, { position: dp }, { easing: "sineOut" }).start()
            tween(n).delay(0.15 * index).to(0.3, { scale: Vec3.ONE }).start()
        })
        return new Promise(res => { this.scheduleOnce(res, 0.15 * this.showItems.length + 0.5) })
    }
}
