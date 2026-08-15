import { _decorator, Component, instantiate, isValid, Label, Node, RichText, Sprite, SpriteFrame, tween, Tween, UITransform, UIOpacity, Vec2, Vec3, sp } from 'cc';
import { UIWindow } from '../GameKit/ui/UIWindow';
import { UserInfoModel } from './UserInfoModel';
import { EnterCloseAnim } from '../GameKit/ui/EnterCloseAnim';
import { BadgeItem } from '../GameKit/Editor/BadgeItem';
import LevelUpDisplayLock from '../game/user/LevelUpDisplayLock';

import { User } from '../game/user/User';
import Guild from '../game/guild/Guild';
import ChildWindowChain from '../GameKit/ui/ChildWindowChain';
import VillageNewsWindow from './Menu/VillageNewsWindow';
import LevelBonusWindow from './Quest/LevelBonusWindow';
const { ccclass, property } = _decorator;

const ENABLE_FIRST_PURCHASE_AUTO_POPUP = false;
const ENABLE_FIRST_PURCHASE_ENTRY = false;


let shieldPosx = {
    3: [-117.7, -75, -29.9],
    4: [-135.2, -100.8, -64.3, -29.8],
    5: [-142.1, -114.4, -85.5, -56.9, -30.7],
}

const MAIN_BUTTON2A_BADGE = {
    boneName: "Gua_01",
    idleAnimation: "idle",
    stillAnimation: "still",
    stillDelay: 1.5,
    idleDuration: 0.9,
}

@ccclass('GameMainWindow')
export default class GameMainWindow extends UIWindow {
    public static windowPath = 'GameMainWindow';
    public static instance: GameMainWindow | null = null;
    public static isFirstEnter = false;

    @property(UserInfoModel) userinfo: any = null;
    @property(Node) spPublics: Node | null = null;
    @property(Node) spVillages: Node | null = null;
    @property(Node) spSlots: Node | null = null;
    @property(Node) spDailyBonuses: Node | null = null;
    @property(Node) btnAdSpin: Node | null = null;
    @property(Node) btnAdCoin: Node | null = null;
    @property(Label) labelAdCoin: Label | null = null;
    @property(Node) animAddCoin: Node | null = null;
    @property(Label) labelStar: Label | null = null;
    @property(EnterCloseAnim) spMessage: EnterCloseAnim | null = null;
    @property(UserInfoModel) spriteMessageUser: any = null;
    @property(RichText) labelMessageMsg: RichText | null = null;
    @property(Node) btnMenu: Node | null = null;
    @property(BadgeItem) menuBadge: any = null;
    @property(Node) btnCard: Node | null = null;
    @property(Node) subMenu: Node | null = null;
    @property(Node) btnActivityCenter: Node | null = null;
    @property(Node) activityBadge: Node | null = null;
    @property(Node) questBadge: Node | null = null;
    @property(Component) spQuestAnim: any = null;
    @property(BadgeItem) cardBadge: any = null;
    @property(Node) btnCash: Node | null = null;
    @property(Label) labelCashTimer: Label | null = null;
    @property(Node) spJokerCard: Node | null = null;
    @property([Node]) shieldsBgs: Node[] = [];
    @property([Node]) adshields: Node[] = [];
    @property(Node) btnADShiled: Node | null = null;
    @property(Component) adshieldAnim: any = null;
    @property(Node) adshieldTip: Node | null = null;
    @property(Node) btnNewPlayerPack: Node | null = null;
    @property(Label) labelNewPlayerPack: Label | null = null;
    @property(Node) btnCongrats: Node | null = null;
    @property(Label) labelCongrats: Label | null = null;
    @property(Node) activityLeft: Node | null = null;
    @property(Node) activityRight: Node | null = null;
    @property(Node) btnDaoju1: Node | null = null;
    @property(Label) labelDaoju1: Label | null = null;
    @property(Node) btnDaoju2: Node | null = null;
    @property(Label) labelDaoju2: Label | null = null;
    @property(Node) btnDaoju3: Node | null = null;
    @property(Label) labelDaoju3: Label | null = null;
    @property(Node) flytoSkyBtn: Node | null = null;
    @property(Label) labelFlytoSky: Label | null = null;
    @property(Node) spSuperShield: Node | null = null;
    @property(Node) spSuperShieldGold: Node | null = null;
    @property(Label) labelSuperShieldTime: Label | null = null;
    @property(Node) btnVip: Node | null = null;
    @property(Node) btnInviteReward: Node | null = null;
    @property(Node) btnLuckyDraw: Node | null = null;
    @property(Label) labelLuckyDrawTime: Label | null = null;
    @property(Node) btnLevelBonus: Node | null = null;
    @property(Label) labelLevelBonus: Label | null = null;
    @property(Node) slotCollectRankActivityBar: Node | null = null;
    @property(SpriteFrame) btnGuilds: SpriteFrame | null = null;
    @property(SpriteFrame) btnGuilds1: SpriteFrame | null = null;
    @property(Sprite) btnGuildSp: Sprite | null = null;
    @property(Component) spinAnim: any = null;
    @property(Node) spinAddNumAnim: Node | null = null;
    @property(sp.SkeletonData) mainButton2aSkeletonData: sp.SkeletonData | null = null;
    @property(SpriteFrame) mainButton2aGantanhao: SpriteFrame | null = null;
    @property(Label) levelLbl: Label | null = null;
    @property(Component) coinFlyToTargetAnim: any = null;

    gamePlay: any = null;
    spScenes: any[] = [];
    currentScene = -1;
    firstChain: any = null;
    updateActivityInterval: any = null;
    spinadShowBtnI: any = null;
    coinadShowBtnI: any = null;
    CashLeftTime: any = null;
    NewPlayerPackLeftTime: any = null;
    CongratsLeftTime: any = null;
    mapId: any = null;
    haveJokerCard = false;
    shopRedNode: any = null;
    shopEntryButton: any = null;
    private _shopFreeRewardCount = 0;
    btnFirstPurchase: Node | null = null;
    coinAdCache: any = null;
    spinAdCache: any = null;
    oldCoin: any = null;
    oldAp: any = null;
    oldADShield: any = null;
    adshieldTipSTI: any = null;
    shieldLastUpdateTime: any = null;
    luckyDrawActiveI: any = null;
    luckyDrawShowBtnI: any = null;
    luckyDrawTimer: any = null;
    shichuiActive: any = null;
    _isFirstEnter = false;
    oldStar: any = null;
    _shopFreeRewardReqing = false;
    _shopFreeRewardReqPending = false;
    hasShowMessage = false;
    activityBadgeData: any = null;
    onLoad(){
        if(AppKit.NativeWrap.isNewApp())
        {
            this.setNodeScale(this.btnAdSpin, 0)
            this.setNodeScale(this.btnAdCoin, 0)
            this.setNodeScale(this.labelAdCoin.node, 0)
            this.setNodeScale(this.btnADShiled, 0)
            this.setNodeScale(this.btnNewPlayerPack, 0)
            this.setNodeScale(this.labelNewPlayerPack.node, 0)
            this.setNodeScale(this.btnCongrats, 0)
            this.setNodeScale(this.btnLevelBonus, 0)
            this.setNodeScale(this.labelCongrats.node, 0)
            this.setNodeScale(this.btnVip, 0)
            this.setNodeHeight(this.btnActivityCenter, 0)
            this.setNodeOpacity(this.btnActivityCenter, 0)
            this.setNodeScale(this.btnLuckyDraw, 0)
            this.setNodeScale(this.labelLuckyDrawTime.node, 0)
        }
    }
    onShow() {
        GameMainWindow.instance = this

        this.gamePlay = GamePlay.instance

        //每个场景的ui
        this.spScenes = [this.spVillages, this.spSlots, this.spDailyBonuses]
        this.currentScene = -1
        this.spScenes.forEach(function (x) {
            EnterCloseAnim.playCloseImmediately(x)
        })
        EnterCloseAnim.playCloseImmediately(this.spMessage.node)
        EnterCloseAnim.playCloseImmediately(this.activityLeft)
        EnterCloseAnim.playCloseImmediately(this.activityRight)

        //用户信息
        this.userinfo.show(Game.SUser)

        if(GamePlay.instance.slotNode){
            // this.userinfo.shields=GamePlay.instance.slotNode.mergeNodeUI.shields
            // this.userinfo.setShield()

            // this.adshields=GamePlay.instance.slotNode.mergeNodeUI.adshields
            // this.btnADShiled=GamePlay.instance.slotNode.mergeNodeUI.btnADShiled
        }

        this.updateInfo()

        if (!AppKit.PaymentWrap.PayVisiable()) {
            this.btnNewPlayerPack.active = false
            this.btnCongrats.active = false
            this.btnVip.active = false
        } else {
            this.refreshNewPlayerPackEntry()
            this.btnCongrats.active = false
            this.btnVip.active = false
        }
        this.refreshFirstPurchaseEntry()
        this.adshieldAnim.stop()
        this.updateADShieldTip(true)
        this.updateSuperShield()

        this.btnCash.active = GameKit.TimeUtil.getCurrentTime() < 1604376000
        this.CashLeftTime = 1604376000 - GameKit.TimeUtil.getCurrentTime()
        
        UIRoot.instance.preloadWindow("MenuWindow")
        this.clearCardEntryBadge()

        
        
    }
    onClose() {
        GameMainWindow.instance = null
        this.userinfo.onClose()
        if (this.firstChain) this.firstChain.end()

        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.CoinEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ApEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.VillageEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.MessageEvent, "GameMainWindow")
        GameKit.WebEvent.UnRegisterEvent(GameKit.GameEvent.EventName.MessageEventInvitedUnlock, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.GiftEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ActivityEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.StatusEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.PresentEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ShieldEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.CardEvent, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.TaskCompleteCount, "GameMainWindow")
        GameKit.GameEvent.UnRegisterEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, "GameMainWindow")
        this.stopMainButton2aBadges()
        if (this.updateActivityInterval) {
            clearInterval(this.updateActivityInterval)
            this.updateActivityInterval = null
        }

        if (this.spinadShowBtnI) {
            clearInterval(this.spinadShowBtnI)
            this.spinadShowBtnI = null
        }
        if (this.coinadShowBtnI) {
            clearInterval(this.coinadShowBtnI)
            this.coinadShowBtnI = null
        }
        this.updateADShieldTip(true)
    }
    update(dt) {
        /*let msgs = Game.ChatMgr.getLastMessages()
        if (!!msgs) {
            this.labelChatBar.string = msgs.Message()
        }*/
        this.updateNewPlayerPackTime()
        this.updateCongratsTime()
        this.updateSuperShield()
        this.updateLuckyDrawTimer(dt)
        
        if (this.CashLeftTime) {

            this.CashLeftTime = 1604376000 - GameKit.TimeUtil.getCurrentTime()

            this.labelCashTimer.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.CashLeftTime, false)

            if (this.CashLeftTime <= 0) {
                this.btnCash.active = false
                this.CashLeftTime = null
            }
        }
    }
    lateUpdate() {
        this.updateMainButton2aBadgeAttachments()
    }
    //切换场景
    enterScene(mo) {
        if (this.currentScene === mo) return

        let ameta = Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Other,Meta.ActivityMeta.SubTypes.GuildBoss)
        // let a=null;
        // if(this.btnGuildSp.parent){
        //     a = this.btnGuildSp.parent.node.getComponent("ShakeAnim")
        //     if(a){
        //         a.active = false;
        //     }
        // }
        // this.btnGuildSp.spriteFrame = ameta?this.btnGuilds1:this.btnGuilds;
        // if(a){
        //     a.active = ameta?true:false;
        // }
        // if(Game.SUser.GuildId()!=0){
        //     let req = SR.SRGuild.checkGuildInfo(Game.SUser.GuildId());
        //     req.SetCallBack(function(res) {
        //         // console.log("进入我的军团",res);
        //         Guild.askList={};
        //         res.user.forEach((ele)=>{
        //             Game.SGuild.guildInfo[ele.userId] = ele;
        //         })
        //         Game.SGuild.updateData(res.legion)
        //         this.btnGuildSp.spriteFrame = Game.SGuild.getActivityActive()?this.btnGuilds1:this.btnGuilds;
        //         if(a){
        //             a.active = Game.SGuild.getActivityActive()?true:false;
        //         }
        //     }.bind(this))
        //     req.Send();
        // }
        

        this.changePlayAnim(mo)
        this.currentScene = mo

        console.log("enterScene", mo);

        if (this.currentScene === GamePlay.Scenes.Village) {

            if (Game.SUserRecord.GetPurchaseMoney() <= 0 && Game.SUserVillage.MapId() >= G.GameConfig.adFullPageLevel) {
                let currentTime = GameKit.TimeUtil.getCurrentTime()
                let fullpageTimer = GameKit.DataCache.GetData("fullpageTimer") || (currentTime - G.GameConfig.adFullPageInterval)
                if (currentTime - fullpageTimer >= G.GameConfig.adFullPageInterval) {
                    setTimeout(() => {
                        AppKit.ADWrap.ShowFullPage(null, "village")
                    }, 2000);
                    GameKit.DataCache.SetData("fullpageTimer", currentTime)
                }
            }
        }
        if (!this._isFirstEnter) {
            this._isFirstEnter = true
        
            Game.ActivityManager.logined()
            EnterCloseAnim.playEnter(this.activityLeft)
            EnterCloseAnim.playEnter(this.activityRight)

            if (GameMainWindow.isFirstEnter) {
                GameMainWindow.instance.updateADShieldTip(false)
            }
        }

        if (!GameMainWindow.isFirstEnter) {
            this.firstEnter()
        }

        let showActivities = this.currentScene !== GamePlay.Scenes.Slot
        this.activityLeft.active = showActivities
        this.activityRight.active = showActivities
        this.refreshFirstPurchaseEntry()
        if (Game.MergeGuideHooks && Game.MergeGuideHooks.RefreshMainForcedTutorialHiddenControls) {
            Game.MergeGuideHooks.RefreshMainForcedTutorialHiddenControls()
        }
    }
    changePlayAnim(mo) {
        if (this.currentScene >= 0) {
            EnterCloseAnim.playClose(this.spScenes[this.currentScene])
        }
        EnterCloseAnim.playEnter(this.spScenes[mo])
    }
    firstEnter() {

        GameMainWindow.isFirstEnter = true

        this.checkTutorial()
        if (!Game.MergeGuideHooks.IsFinished()) return
        if (Game.MergeGuideHooks.ShouldBlockForceGuideGlobalUi &&
            Game.MergeGuideHooks.ShouldBlockForceGuideGlobalUi()) return
        

        let activityList = Game.ActivityManager.GetAllActiveActivityList()
        let payActivities = []
        let otherActivities = []
        let gameActivities = []
        activityList.forEach(activityMeta => {
            if (activityMeta.Type() == Meta.ActivityMeta.Types.Pay) {
                payActivities.push(activityMeta)
            } else if (activityMeta.Type() == (Meta.ActivityMeta.Types.Game||Meta.ActivityMeta.Types.Game2)) {
                if (activityMeta.SubType() == Meta.ActivityMeta.SubTypes.JackTravel||activityMeta.SubType() == Meta.ActivityMeta.SubTypes.Minigame || activityMeta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollect || activityMeta.SubType() == Meta.ActivityMeta.SubTypes.SlotCollectRank || activityMeta.SubType() == Meta.ActivityMeta.SubTypes.AttackMaster || activityMeta.SubType() == Meta.ActivityMeta.SubTypes.RaidMaster || activityMeta.SubType() == Meta.ActivityMeta.SubTypes.CoinSlot) {
                    gameActivities.push(activityMeta)
                }
            } else {
                otherActivities.push(activityMeta)
                
            }
        })
            
        let cd = GameKit.TimeUtil.getCurrentDay()
        let chain = new ChildWindowChain()
        this.firstChain = chain

        // 额外奖励
        chain.add("GetRewardWindow", () => {
            return Game.SUser.data.backReward != null && Game.SUser.data.backReward.length > 0
        }, {contents: Game.SUser.data.backReward, noChest: true})

        chain.add("VIPDailyRewardWindow", () => {
            return GameKit.DataCache.GetData("vipDailyReward") != null
        }, {vipDailyReward: GameKit.DataCache.GetData("vipDailyReward")})

        chain.add("FirstPurchaseWindow", () => {
            return ENABLE_FIRST_PURCHASE_AUTO_POPUP && this.canShowFirstPurchase()
        })

        //收集排行
        if (GameKit.DataCache.GetData("SlotCollectRankEnd")) {
            let addAps = 0
            let addCoins = 0

            let userdata = Game.SUserActivity.GetSymbolRankData()
            let uids = Object.keys(userdata.rank)
            uids.sort((a,b) => {
                return userdata.rank[b].score - userdata.rank[a].score
            })
            let selfRank = uids.indexOf(Game.SUser.UserId().toString())
            let rewards = Meta.ActivityParamsMeta.GetValue("slotCollectRankReward", selfRank+1)
            rewards = Game.Content.Merge(Game.Content.FromStrings(rewards))
            rewards.forEach(reward => {
                if (reward.Type() == Game.Content.Types.Ap) {
                    addAps += reward.Count()
                } else if (reward.Type() == Game.Content.Types.Coin) {
                    addCoins += reward.Count()
                }
            })
            let randomPack = GameKit.DataCache.GetData("UserRandomPack")
            if (randomPack) {
                let randomPackReward = randomPack.rewards || []
                randomPackReward.forEach(x => {
                    let reward = Game.Content.FromContent(x)
                    if (reward.Type() == Game.Content.Types.Ap) {
                        addAps += reward.Count()
                    } else if (reward.Type() == Game.Content.Types.Coin) {
                        addCoins += reward.Count()
                    }
                })
            }
            if (addCoins > 0 && GameMainWindow.instance) {
                this.oldCoin = Game.SUser.Coin() - addCoins
                GameMainWindow.instance.userinfo.changeCoin(this.oldCoin, this.oldCoin, 0)
            }
            if (addAps > 0 && GamePlay.instance.slotNode) {
                this.oldAp = Game.SUser.Ap() - addAps
                GamePlay.instance.slotNode.getComponent("UserInfoModel").stopApAt(this.oldAp)
            }

            chain.add("ActivitySlotSymbolRankWindow")
            chain.add("ActivitySlotSymbolRankRewardWindow")
        }

        chain.add("SignWindow", () => this.canAutoOpenSignWindow())

        // 新系统开放
        /*chain.add("CardSystemOpenWindow", () => {
            if (CLOSE_Card || Game.SUserVillage.MapId() < G.GameConstance.cardSystemStartLevel) return false
            let cardSystemOpen = GameKit.PlayerPrefs.GetBool("NewSystemOpen_Card")
            if (!cardSystemOpen) {
                GameKit.PlayerPrefs.SetBool("NewSystemOpen_Card", true)
                return true
            }
            return false
        })
        */
        

        // 支付活动
        chain.add("NewPlayerPackWindow", () => this.canAutoOpenNewPlayerPack())

        payActivities.sort((a,b) => {
            return a.SubType() - b.SubType()
        })
        payActivities.forEach(x => {
            chain.add(x.Panel(), () => {
                let activityMeta = x;
                let activityId = activityMeta.Id()
                if(activityMeta.SubType()==Meta.ActivityMeta.SubTypes.PayFlyToSky){
                    Game.SUser.data.flytoskyActivityId=activityId
                    
                    //限制只显示3次
                    let showTimes = GameKit.PlayerPrefs.GetInt("Startshow_Activity_" + activityId.toString(), 0)
                    if (showTimes < 3) {
                        showTimes ++
                        GameKit.PlayerPrefs.SetInt("Startshow_Activity_" + activityId.toString(), showTimes)
                        return true
                    }
                    return false    
                }else{
                    return false;
                }
                return x.Panel() != null && x.Panel() != ""
            }, {meta: x})
        })
        

        // 其他活动
        otherActivities.forEach(x => {
            if (x.SubType() == Meta.ActivityMeta.SubTypes.CollectFlag) {
                chain.add('ActivityGameShowWindow', () => {
                    if (GameKit.PlayerPrefs.GetInt("LastCollectFlagId", 0) == x.Id()) return false
                    GameKit.PlayerPrefs.SetInt("LastCollectFlagId", x.Id())
                    return true
                }, {meta: x})
                return
            }
            chain.add(x.Panel(), () => {
                let activityMeta = x

                let activityId = activityMeta.Id()
                let showTimes = GameKit.PlayerPrefs.GetInt("Startshow_Activity_" + activityId.toString(), 0)
                if (showTimes < 3) {
                    showTimes ++
                    GameKit.PlayerPrefs.SetInt("Startshow_Activity_" + activityId.toString(), showTimes)
                    return true
                }
                return false
            }, {meta: x})
        })

        // console.log(payActivities)
        // console.log(gameActivities);
        // console.log(other);
        // 游戏活动
        gameActivities.forEach(x => {
            let winName = x.IconGoto() == "panel" ? x.Panel() : null
            if (winName == null || winName == "") winName = "ActivityGameShowWindow"
            if (x.SubType() == Meta.ActivityMeta.SubTypes.SlotCollectRank) winName = "ActivityGameShowWindow"
            chain.add(winName, () => {
                let activityMeta = x
                let activityId = activityMeta.Id()
                let showTimes = GameKit.PlayerPrefs.GetInt("Startshow_Activity_" + activityId.toString(), 0)
                if (showTimes < 3) {
                    showTimes ++
                    GameKit.PlayerPrefs.SetInt("Startshow_Activity_" + activityId.toString(), showTimes)
                    return true
                }
                return false
            }, {meta: x})
            
            if (x.SubType() == Meta.ActivityMeta.SubTypes.SlotCollectRank) {
                chain.add("ActivitySlotSymbolRankInfoWindow", () => {
                    let showTimes = GameKit.PlayerPrefs.GetInt("Startshow_Activity_" + x.Id().toString(), 0)
                    if (showTimes < 3) { return true }
                    return false
                }, {meta: x})
            }
        })

        
        // 消息列表
        let NewMessageNum = GameKit.DataCache.GetData("NewMessageNum")
        if (NewMessageNum == null) NewMessageNum = 0
        NewMessageNum = 0 //隐藏
        // let presentNum = 0
        // chain.add("VillageNewsWindow", () => {
        //     return NewMessageNum > 0 || presentNum > 0
        // }, presentNum>0?{mail:true}:{} )
        /*
        // 邀请
        chain.add("InviteWindow", () => {
            let rd = GameKit.PlayerPrefs.GetInt("Startshow_InviteWindow", 0)
            if (cd <= rd) return false
            GameKit.PlayerPrefs.SetInt("Startshow_InviteWindow", cd)
            return !G.GameConfig.closeShare
        })
        */
        // 礼物
        chain.add("GiftsWindow", () => {
            let rd = GameKit.PlayerPrefs.GetInt("Startshow_GiftsWindow", 0)
            if (cd <= rd) return false
            GameKit.PlayerPrefs.SetInt("Startshow_GiftsWindow", cd)
            return wxTools.usewx || fbInTools.usefbIn || (AppKit.SdkManager.IsNative() && !Game.SUser.IsGuest())
        })
        
        //走完
        chain.setFinishFunc(() => {
        })
        //结束 包括中止
        chain.setCompleteFunc(() => {
            this.firstChain = null
            GameKit.DataCache.RemoveData("vipDailyReward")
            if (!this.node) return
            this.updateADShieldTip(false)
        })

        // this.btnInviteReward.active=(Game.SUser.data.inviteId==0)
        // this.btnInviteReward.active=false

        UIRoot.instance.ShowCantClick(true)
        setTimeout(() => {
            UIRoot.instance.CloseCantClick()
            chain.start()
        }, 500)

    }
    updateInfo() {

        //当前地图id
        this.mapId = Game.SUserVillage.MapId()

        //广告获取金币数
        this.updateCoinAd()

        //广告获取体力
        this.updateSpinAd()

        this.updateLuckyDraw()

        //显示星星数
        this.showStar()

        //菜单badge
        this.setMenuBadge()
        //GameEvent
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.CoinEvent, "GameMainWindow", function(data) {
            this.setMenuBadge()
        }.bind(this))
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ApEvent, "GameMainWindow", function(data) {
            this.updateSpinAd()
        }.bind(this))
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.VillageEvent, "GameMainWindow", function(data) {
            this.showStar()
            this.setMenuBadge()
        }.bind(this))
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.MessageEvent, "GameMainWindow", function(data) {
            this.showMessage(data)
            this.setMenuBadge()
        }.bind(this))
        GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.MessageEventInvitedUnlock, "GameMainWindow", function(data) {
            this.showMessage(data)
        }.bind(this))
        //经验值
        GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.ExpEvent, "GameMainWindow", function(data) {
            Game.SUser.updateData(data)
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.UserInfoEvent);
        }.bind(this))
        //等级
        GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.LevelUpEvent, "GameMainWindow", function(data) {
            const oldLevel = Game.SUser.Level()
            const oldExpInfo = Game.SUser.GetLevelExpInfo()
            const levelRewards = data.rewards || []
            const levelRewardTotals = {}
            const heldResourceValues = {}
            const oldResourceValues = {}
            if (levelRewards.length > 0) {
                const resourceTypes = [Game.Content.Types.Coin, Game.Content.Types.Ap, Game.Content.Types.Cash]
                resourceTypes.forEach(function(type) {
                    let heldValue = this.userinfo && this.userinfo.getResourceGainHoldValue
                        ? this.userinfo.getResourceGainHoldValue(type)
                        : null
                    if (heldValue == null && type === Game.Content.Types.Ap && this.userinfo && this.userinfo.apDisplayLocked) {
                        heldValue = Number(this.userinfo.lockedShowAp)
                    }
                    heldResourceValues[type] = heldValue
                    if (heldValue != null) oldResourceValues[type] = heldValue
                    else if (type === Game.Content.Types.Coin) oldResourceValues[type] = Game.SUser.Coin()
                    else if (type === Game.Content.Types.Ap) oldResourceValues[type] = Game.SUser.Ap()
                    else if (type === Game.Content.Types.Cash) oldResourceValues[type] = Game.SUser.Cash()
                }.bind(this))
                levelRewards.forEach(function(reward) {
                    const content = Game.Content.FromContent(reward)
                    let type = content.Type()
                    if (type === Game.Content.Types.ShopCoin) type = Game.Content.Types.Coin
                    if (type !== Game.Content.Types.Coin && type !== Game.Content.Types.Ap && type !== Game.Content.Types.Cash) return
                    levelRewardTotals[type] = (levelRewardTotals[type] || 0) + (Number(content.Count()) || 0)
                })
            }
            Game.SUser.updateData(data)
            const newLevel = Game.SUser.Level()
            if (levelRewards.length > 0) {
                for (const type in levelRewardTotals) {
                    const numericType = Number(type)
                    const heldValue = Number(heldResourceValues[type])
                    const newValue = numericType === Game.Content.Types.Coin ? Number(Game.SUser.Coin()) :
                        (numericType === Game.Content.Types.Ap ? Number(Game.SUser.Ap()) : Number(Game.SUser.Cash()))
                    if (heldResourceValues[type] != null && isFinite(heldValue)) {
                        oldResourceValues[type] = heldValue
                    } else if (isFinite(newValue)) {
                        oldResourceValues[type] = Math.max(0, newValue - levelRewardTotals[type])
                    }
                }
                LevelUpDisplayLock.Begin({ oldLevel, newLevel, oldExpInfo, rewards: levelRewards, oldResourceValues })
            }
            if (typeof SR !== 'undefined' && SR.SRMerge && SR.SRMerge.SyncLocalOrders) {
                SR.SRMerge.SyncLocalOrders('LevelUpEvent')
            }
            if (GamePlay.instance && GamePlay.instance.mergeRoot && GamePlay.instance.mergeRoot.mergeNodeUI) {
                GamePlay.instance.mergeRoot.mergeNodeUI.InitOrderList()
            }
            GameKit.DataCache.SetData("LevelUPGetReward", data.rewards)
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.UserInfoEvent)
            console.log("人物升级=",data);
        }.bind(this))
        GameKit.WebEvent.RegisterEvent(GameKit.WebEvent.EventName.UnlockBuildingsEvent, "GameMainWindow", function(data) {
            
            console.log("解锁地图",data);
        }.bind(this))
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.GiftEvent, "GameMainWindow", function(data) {
            this.setMenuBadge()
        }.bind(this))

        //任务badge
        this.updateQuestBadge()
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.TaskCompleteCount, "GameMainWindow", function(data) {
            this.updateQuestBadge()
        }.bind(this))

        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ActivityEvent, "GameMainWindow", function(data) {
            //活动badge
            this.updateActivityBadge()
        }.bind(this))
        this.updateActivityBadge()

        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.StatusEvent, "GameMainWindow", function() {
            this.refreshFirstPurchaseEntry()
            this.refreshNewPlayerPackEntry()
        }.bind(this))
        
        //礼物事件
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.PresentEvent, "GameMainWindow", function(data) {
            this.setMenuBadge()
        }.bind(this))

        if (Game.SUserCard.JokerCount() > 0) {
            this.haveJokerCard = true
            this.spJokerCard.active = !this.isCardFeatureClosed()
        } else {
            this.haveJokerCard = false
            this.spJokerCard.active = false
        }
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.CardEvent, "GameMainWindow", function(data) {
            if (this.isCardFeatureClosed()) {
                this.clearCardEntryBadge()
                return
            }
            this.updateCardBadge()
            if (!this.haveJokerCard && Game.SUserCard.JokerCount() > 0) {
                this.haveJokerCard = true
                EnterCloseAnim.playClose(this.btnCard)
                this.scheduleOnce(() => {
                    this.spJokerCard.active = true
                    EnterCloseAnim.playEnter(this.btnCard)
                }, 0.3)
            } else if (this.haveJokerCard && Game.SUserCard.JokerCount() <= 0) {
                this.spJokerCard.active = false
                this.haveJokerCard = false
            }
        }.bind(this))
        this.updateCardBadge()

        // 商店入口红点：有免费商品可领时显示，领完或无库存时隐藏。
        this.setShopFreeRewardRed(false)
        this.requestShopFreeRewardState()
        this.refreshShopEntryVisibility()
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ShopWindowrefresh, "GameMainWindow", function() {
            this.requestShopFreeRewardState()
        }.bind(this))

        //活动图标
        this.updateActivityButton()
        this.updateActivityInterval = setInterval(function() {
            this.updateActivityButton()
            Game.ActivityManager.logined()
        }.bind(this), 600000)
        
        // ADShiled
        this.updateADShield()
        GameKit.GameEvent.RegisterEvent(GameKit.GameEvent.EventName.ShieldEvent, "GameMainWindow", function() {
            this.updateADShield()
        }.bind(this))
        if (!AppKit.ADWrap.AdEnabled() || G.GameConfig.closeAdShield || Game.SUserVillage.MapId() < G.GameConfig.AdShieldLevel) this.adshields[0].parent.parent.active = false

        this.btnLevelBonus.active = false
        this.labelLevelBonus.string = LevelBonusWindow.getShowLevelString()

        //Shield
        
    }
    //隐藏
    hideUI(anim) {

        if (!anim) {
            console.log("close gamemain");
            
            this.spPublics.active = false
            this.spScenes.forEach(function(x) {x.active = false})
            this.activityLeft.active = false
            this.activityRight.active = false
            this.scaleNodeTo(this.adshieldTip, 0.01, 0.001)
        } else {
            EnterCloseAnim.playClose(this.spPublics)
            EnterCloseAnim.playClose(this.spScenes[this.currentScene])
            EnterCloseAnim.playClose(this.activityLeft)
            EnterCloseAnim.playClose(this.activityRight)
            this.scaleNodeTo(this.adshieldTip, 0.3, 0.001)
        }
    }
    showUI(anim) {
        let showActivities = this.currentScene === GamePlay.Scenes.Village
        if (!anim) {
            this.spPublics.active = true
            this.spScenes.forEach(function(x) {x.active = true})
            this.activityLeft.active = showActivities
            this.activityRight.active = showActivities
        } else {
            EnterCloseAnim.playEnter(this.spPublics)
            EnterCloseAnim.playEnter(this.spScenes[this.currentScene])
            if (showActivities) {
                this.activityLeft.active = true
                this.activityRight.active = true
                EnterCloseAnim.playEnter(this.activityLeft)
                EnterCloseAnim.playEnter(this.activityRight)
            } else {
                this.activityLeft.active = false
                this.activityRight.active = false
            }
        }
    }
    showStar(fst = null) {
        if (fst) {
            let star = fst
            this.labelStar.string = GameKit.StringUtil.formatNumber(star)
            Tween.stopAllByTarget(this.labelStar.node)
            this.setNodeScale(this.labelStar.node, 1)
            this.oldStar = star
            return
        }
        let star = Game.SUser.Star()
        this.labelStar.string = GameKit.StringUtil.formatNumber(star)
        if (this.oldStar && this.oldStar < star) {
            this.pulseNode(this.labelStar.node)
        }
        this.oldStar = star
        AppKit.LeaderBoardWrap.setScore("User_Star", star)
    }
    openFlyToSkyWindow(e,winName){
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow(winName)
    }
    //回调
    openMenu() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("MenuWindow")
    }
    setMenuBadge() {
        let num = this.getShopFreeRewardBadgeCount()
        let NewMessageNum = GameKit.DataCache.GetData("NewMessageNum")
        if (NewMessageNum == null) NewMessageNum = 0
        num += NewMessageNum
        num += VillageNewsWindow.getPresentNum()

        this.menuBadge.SetNum(num)
        if (AppKit.SdkManager.IsNative() && AppKit.SdkManager.IsIos()) {
            this.setNodeScale(this.menuBadge.node, 0.6)
        }
        this.updateMenuMainButton2aBadge(num)
    }
    openInviteRewards(){
        if (GamePlay.instance.isBusy()) return
        // UIRoot.instance.openChildWindow("GetInviteRewardsWindow")
        // AppKit.LogEventWrap.logEvent("GetInviteRewardsWindow")
    }
    openSpinShop() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (!this.canOperateMergeTutorialNodeClick('shop_entry')) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("ShopWindow")
        if (Game.MergeGuideHooks && Game.MergeGuideHooks.EmitNodeClick) {
            Game.MergeGuideHooks.EmitNodeClick('shop_entry')
        }

        AppKit.LogEventWrap.logEvent("openshop_spin")
    }
    requestShopFreeRewardState() {
        if (this._shopFreeRewardReqing) {
            this._shopFreeRewardReqPending = true
            return
        }
        if (typeof SR === "undefined" || !SR.SRShop || !SR.SRShop.shopGetInfo) {
            this.setShopFreeRewardRed(false)
            return
        }

        this._shopFreeRewardReqing = true
        this._shopFreeRewardReqPending = false

        let req = SR.SRShop.shopGetInfo()
        if (req.SetSilence) req.SetSilence(true)
        req.SetCallBack(function(res) {
            if (this.node && this.node.isValid) {
                this.setShopFreeRewardRed(this.getShopFreeRewardCount(res && res.data))
            }
            this.finishShopFreeRewardRequest()
        }.bind(this))
        if (req.SetErrorCallBack) {
            req.SetErrorCallBack(function() {
                this.finishShopFreeRewardRequest()
            }.bind(this))
        }
        req.Send()
    }
    finishShopFreeRewardRequest() {
        this._shopFreeRewardReqing = false
        if (!this._shopFreeRewardReqPending) return

        this._shopFreeRewardReqPending = false
        this.requestShopFreeRewardState()
    }
    getShopFreeRewardBadgeCount() {
        return Number(this._shopFreeRewardCount) || 0
    }
    getShopFreeRewardCount(shopData) {
        if (!shopData || !shopData.daily || !shopData.dailyState || typeof Meta === "undefined") return 0
        let count = 0
        for (let i = 0; i < shopData.daily.length; i++) {
            const meta = Meta.MetaManager.GetMeta(Meta.MetaType.ShopDaily, shopData.daily[i])
            if (this.isFreeShopMetaAvailable(meta, shopData.dailyState[i])) count++
        }
        return count
    }
    isFreeShopMetaAvailable(meta, state) {
        if (!meta || !state || !meta.CurrencyType) return false

        let leftNum = Number(state.leftNum)
        if (isNaN(leftNum) || leftNum <= 0) return false

        return Number(meta.CurrencyType()) === 0
    }
    setShopFreeRewardRed(count) {
        count = Number(count) || 0
        this._shopFreeRewardCount = count
        this.setMenuBadge()

        let red = this.getShopRedNode()
        if (!red) return
        let active = count > 0
        red.active = active
        if (active) this.ensureShopMainButton2aBadge(red)
        else this.stopMainButton2aBadge(red._mainButton2aBadge)
    }
    getShopRedNode() {
        if (this.shopRedNode && this.shopRedNode.isValid) return this.shopRedNode

        let shopBtn = this.findChildByName(this.node, "btnShop")
        this.shopRedNode = shopBtn ? shopBtn.getChildByName("red") : null
        return this.shopRedNode
    }
    getShopEntryButton() {
        if (this.shopEntryButton && isValid(this.shopEntryButton)) return this.shopEntryButton
        this.shopEntryButton = this.findChildByName(this.node, "btnShop")
        return this.shopEntryButton
    }
    canShowShopEntry() {
        const manager = Game.MergeGuideHooks
        return !(manager?.ShouldShowShopEntryButton && !manager.ShouldShowShopEntryButton())
    }
    refreshShopEntryVisibility() {
        const button = this.getShopEntryButton()
        if (button) button.active = this.canShowShopEntry()
    }
    findChildByName(root, name) {
        if (!root) return null
        if (root.name === name) return root

        for (let i = 0; i < root.children.length; i++) {
            let child = this.findChildByName(root.children[i], name)
            if (child) return child
        }
        return null
    }
    ensureShopMainButton2aBadge(badgeNode) {
        if (!badgeNode || !isValid(badgeNode)) return

        let state = this.ensureMainButton2aBadgeState(badgeNode, "shop")
        if (!state) return

        let spriteFrame = this.mainButton2aGantanhao
        if (!spriteFrame) {
            if (state.originalSprite) state.originalSprite.enabled = true
            return
        }

        let iconNode = state.attachNode
        if (!iconNode || !isValid(iconNode)) {
            iconNode = new Node("gantanhao")
            iconNode.parent = badgeNode
            state.attachNode = iconNode
        }

        let sprite = iconNode.getComponent(Sprite) || iconNode.addComponent(Sprite)
        sprite.spriteFrame = spriteFrame
        iconNode.active = true
        if (spriteFrame.getRect) {
            let { width, height } = spriteFrame.getRect()
            this.setNodeContentSize(iconNode, width, height)
        }
        this.setNodeTopSibling(iconNode)
        this.startMainButton2aBadge(state)
    }
    updateMenuMainButton2aBadge(num) {
        if (!this.menuBadge || !this.menuBadge.node) return

        let badgeNode = this.menuBadge.node
        if (num <= 0) {
            this.stopMainButton2aBadge(badgeNode._mainButton2aBadge)
            return
        }

        if (this.menuBadge.label && this.menuBadge.label.node) {
            this.menuBadge.label.node.active = true
        }

        let state = this.ensureMainButton2aBadgeState(badgeNode, "menu")
        if (!state) return

        state.attachNode = this.menuBadge.label ? this.menuBadge.label.node : null
        this.setNodeTopSibling(state.attachNode)
        this.startMainButton2aBadge(state)
    }
    ensureMainButton2aBadgeState(badgeNode, type) {
        if (!badgeNode || !isValid(badgeNode)) return null

        let state = badgeNode._mainButton2aBadge
        if (state) return state

        state = {
            type: type,
            badgeNode: badgeNode,
            spineNode: null,
            skeleton: null,
            bone: null,
            attachNode: null,
            delayCallback: null,
            idleFallbackCallback: null,
            playToken: 0,
            started: false,
        }
        badgeNode._mainButton2aBadge = state

        let sprite = badgeNode.getComponent(Sprite)
        if (sprite) {
            state.originalSprite = sprite
        }

        return state
    }
    startMainButton2aBadge(state) {
        if (!state || !state.badgeNode || !isValid(state.badgeNode)) return
        state.badgeNode.active = true
        if (state.originalSprite) state.originalSprite.enabled = false

        if (state.started && state.skeleton) return
        state.started = true

        let skeletonData = this.mainButton2aSkeletonData
        if (!skeletonData) {
            if (state.originalSprite) state.originalSprite.enabled = true
            return
        }

        let spineNode = state.spineNode
        if (!spineNode || !isValid(spineNode)) {
            spineNode = new Node("main_button2a")
            spineNode.parent = state.badgeNode
            spineNode.setPosition(Vec2.ZERO)
            state.spineNode = spineNode
        }
        spineNode.active = true

        let skeleton = spineNode.getComponent(sp.Skeleton) || spineNode.addComponent(sp.Skeleton)
        skeleton.skeletonData = skeletonData
        skeleton.defaultAnimation = MAIN_BUTTON2A_BADGE.stillAnimation
        skeleton.loop = true
        skeleton.premultipliedAlpha = false

        let { width: badgeWidth, height: badgeHeight } = this.getNodeContentSize(state.badgeNode)
        let baseSize = Math.max(badgeWidth || 30, badgeHeight || 30)
        this.setNodeScale(spineNode, baseSize / 30)

        state.skeleton = skeleton
        state.bone = this.findMainButton2aBone(skeleton)
        this.setNodeBottomSibling(spineNode)
        this.setNodeTopSibling(state.attachNode)
        this.playMainButton2aBadgeLoop(state)
    }
    playMainButton2aBadgeLoop(state) {
        if (!state || !state.skeleton || !isValid(state.badgeNode)) return

        state.playToken++
        let token = state.playToken
        let skeleton = state.skeleton

        this.clearMainButton2aBadgeCallbacks(state)
        if (skeleton.setCompleteListener) skeleton.setCompleteListener(null)
        if (skeleton.clearTracks) skeleton.clearTracks()

        let finishIdle = function() {
            if (state.playToken !== token) return
            if (!isValid(this.node) || !isValid(state.badgeNode)) return
            this.playMainButton2aStill(state)

            state.delayCallback = function() {
                state.delayCallback = null
                if (state.playToken !== token) return
                if (!isValid(this.node) || !isValid(state.badgeNode)) return
                this.playMainButton2aBadgeLoop(state)
            }.bind(this)
            this.scheduleOnce(state.delayCallback, MAIN_BUTTON2A_BADGE.stillDelay)
        }.bind(this)

        let entry = null
        try {
            entry = skeleton.setAnimation(0, MAIN_BUTTON2A_BADGE.idleAnimation, false)
        } catch (e) {
            this.playMainButton2aStill(state)
            return
        }

        if (skeleton.setTrackCompleteListener && entry) {
            skeleton.setTrackCompleteListener(entry, finishIdle)
        } else {
            state.idleFallbackCallback = finishIdle
            this.scheduleOnce(state.idleFallbackCallback, this.getMainButton2aAnimationDuration(skeleton, MAIN_BUTTON2A_BADGE.idleAnimation, MAIN_BUTTON2A_BADGE.idleDuration))
        }
    }
    playMainButton2aStill(state) {
        if (!state || !state.skeleton) return

        try {
            state.skeleton.setAnimation(0, MAIN_BUTTON2A_BADGE.stillAnimation, true)
        } catch (e) {}
    }
    stopMainButton2aBadge(state) {
        if (!state) return

        state.playToken++
        state.started = false
        this.clearMainButton2aBadgeCallbacks(state)
        if (state.skeleton) {
            if (state.skeleton.setCompleteListener) state.skeleton.setCompleteListener(null)
            if (state.skeleton.clearTracks) state.skeleton.clearTracks()
        }
        if (state.spineNode && isValid(state.spineNode)) {
            state.spineNode.active = false
        }
        if (state.attachNode && isValid(state.attachNode) && state.type === "shop") {
            state.attachNode.active = false
        }
        if (state.originalSprite) state.originalSprite.enabled = true
    }
    stopMainButton2aBadges() {
        this.stopMainButton2aBadge(this.shopRedNode && this.shopRedNode._mainButton2aBadge)
        this.stopMainButton2aBadge(this.menuBadge && this.menuBadge.node && this.menuBadge.node._mainButton2aBadge)
    }
    clearMainButton2aBadgeCallbacks(state) {
        if (!state) return
        if (state.delayCallback) {
            this.unschedule(state.delayCallback)
            state.delayCallback = null
        }
        if (state.idleFallbackCallback) {
            this.unschedule(state.idleFallbackCallback)
            state.idleFallbackCallback = null
        }
    }
    updateMainButton2aBadgeAttachments() {
        this.updateMainButton2aBadgeAttachment(this.shopRedNode && this.shopRedNode._mainButton2aBadge)
        this.updateMainButton2aBadgeAttachment(this.menuBadge && this.menuBadge.node && this.menuBadge.node._mainButton2aBadge)
    }
    updateMainButton2aBadgeAttachment(state) {
        if (!state || !state.skeleton || !state.bone || !state.attachNode) return
        if (!isValid(state.spineNode) || !isValid(state.attachNode)) return
        if (!state.attachNode.parent) return

        if (state.skeleton.updateWorldTransform) {
            state.skeleton.updateWorldTransform()
        }

        let spineTransform = state.spineNode.getComponent(UITransform)
        let parentTransform = state.attachNode.parent.getComponent(UITransform)
        if (!spineTransform || !parentTransform) return

        let bonePos = new Vec3(state.bone.worldX || 0, state.bone.worldY || 0, 0)
        let worldPos = spineTransform.convertToWorldSpaceAR(bonePos, new Vec3())
        let localPos = parentTransform.convertToNodeSpaceAR(worldPos, new Vec3())
        state.attachNode.setPosition(localPos)
    }
    findMainButton2aBone(skeleton) {
        if (!skeleton || !skeleton.findBone) return null
        if (skeleton.updateWorldTransform) skeleton.updateWorldTransform()
        return skeleton.findBone(MAIN_BUTTON2A_BADGE.boneName)
    }
    getMainButton2aBonePosition(bone) {
        if (!bone) return null
        try {
            return new Vec2(bone.worldX || 0, bone.worldY || 0)
        } catch (e) {
            return null
        }
    }
    getMainButton2aAnimationDuration(skeleton, animName, defaultDuration) {
        if (!skeleton || !skeleton.findAnimation) return defaultDuration
        let anim = skeleton.findAnimation(animName)
        if (anim && anim.duration > 0) return anim.duration
        return defaultDuration
    }
    setNodeTopSibling(node) {
        if (!node || !isValid(node) || !node.parent || !node.setSiblingIndex) return
        node.setSiblingIndex(node.parent.children.length - 1)
    }
    setNodeBottomSibling(node) {
        if (!node || !isValid(node) || !node.setSiblingIndex) return
        node.setSiblingIndex(0)
    }
    canOperateMergeTutorialNodeClick(nodeKey: string) {
        const tutorialManager = Game.MergeGuideHooks
        return tutorialManager?.CanOperateNodeClick ? tutorialManager.CanOperateNodeClick(nodeKey) : true
    }
    canAutoOpenSignWindow() {
        const tutorialManager = Game.MergeGuideHooks
        if (tutorialManager?.CanAutoOpenSignWindow && !tutorialManager.CanAutoOpenSignWindow()) return false
        if (tutorialManager?.ShouldBlockForceGuideGlobalUi?.()) return false
        const signData = GameKit.DataCache.GetData("signData")
        return !!(signData && signData.signWeekDay > signData.signWeekRewards)
    }
    canOperateGuideGlobalUi() {
        if (Game.TownUpgradeFlow && Game.TownUpgradeFlow.isRunning && Game.TownUpgradeFlow.isRunning()) return false
        const tutorialManager = Game.MergeGuideHooks
        if (tutorialManager?.ShouldBlockForceGuideGlobalUi?.()) return false
        return true
    }
    getFirstPurchaseButton() {
        if (!this.btnFirstPurchase || !isValid(this.btnFirstPurchase)) {
            this.btnFirstPurchase = this.activityLeft?.getChildByName("FirstPurchase") || null
        }
        return this.btnFirstPurchase
    }
    canShowFirstPurchase() {
        const tutorialManager = Game.MergeGuideHooks
        return !!(ENABLE_FIRST_PURCHASE_ENTRY && AppKit.PaymentWrap.PayVisiable() && Game.SUserStatus && !Game.SUserStatus.IsFirstPurchased())
    }
    refreshFirstPurchaseEntry() {
        const button = this.getFirstPurchaseButton()
        if (button) button.active = this.canShowFirstPurchase()
    }
    canAutoOpenNewPlayerPack() {
        if (!this.canShowNewPlayerPack()) return false
        const manager = Game.MergeGuideHooks
        if (!manager) return true
        if (manager.IsFinished?.() === false) return false
        return !manager.ShouldBlockForceGuideGlobalUi?.()
    }
    canShowNewPlayerPack() {
        return !!(AppKit.PaymentWrap.PayVisiable() && Game.SUserStatus && Game.SUserStatus.GetNewPlayerLeftTime() > 0)
    }
    refreshNewPlayerPackEntry() {
        if (!this.btnNewPlayerPack || !Game.SUserStatus) return
        this.NewPlayerPackLeftTime = Game.SUserStatus.GetNewPlayerLeftTime()
        this.btnNewPlayerPack.active = this.canShowNewPlayerPack()
    }
    formatNewPlayerPackEntryTime(remain) {
        const value = GameKit.TimeUtil.GetRemainTimeTable(remain)
        if (value.day > 0) return value.day + "d " + value.hour + "h"
        if (value.hour > 0) return value.hour + "h " + value.minute + "min"
        if (value.minute > 0) return value.minute + "min"
        return value.second + "s"
    }
    openMerge(){
        if (!this.canOperateMergeTutorialNodeClick('back_to_board_button')) return false
        if (Game.TownUpgradeFlow && Game.TownUpgradeFlow.isRunning && Game.TownUpgradeFlow.isRunning()) return false
        GamePlay.instance.changeScene(GamePlay.Scenes.Slot)
        if (Game.MergeGuideHooks && Game.MergeGuideHooks.LogGeneratorRewardFly) {
            Game.MergeGuideHooks.LogGeneratorRewardFly('GameMainWindow.openMerge:afterChangeSceneToSlot', {
                targetNode: 'back_to_board_button',
                scene: GamePlay.Scenes.Slot,
            })
        }
        if (Game.MergeGuideHooks && Game.MergeGuideHooks.EmitNodeClick) {
            Game.MergeGuideHooks.EmitNodeClick('back_to_board_button')
        }
    }
    openCard(parmas) {
        if (!this.canOperateGuideGlobalUi()) return
        if (GamePlay.instance.isBusy()) return
        if (this.isCardFeatureClosed()) return
        UIRoot.instance.openChildWindow("CardAllSetWindow",parmas)
    }
    isCardFeatureClosed() {
        if (typeof Game !== "undefined" && Game.IsCardFeatureClosed) return Game.IsCardFeatureClosed()
        return typeof CLOSE_Card !== "undefined" && CLOSE_Card
    }
    clearCardEntryBadge() {
        if (!this.isCardFeatureClosed()) return
        this.haveJokerCard = false
        if (this.btnCard) this.btnCard.active = false
        let slotNode = GamePlay && GamePlay.instance ? GamePlay.instance.slotNode : null
        let slotCardButton = slotNode && slotNode.getChildByName ? slotNode.getChildByName("Button - Card") : null
        if (slotCardButton) slotCardButton.active = false
        if (this.spJokerCard) this.spJokerCard.active = false
        if (this.cardBadge) this.cardBadge.SetNum(0)
    }
    updateCardBadge() {
        if (this.isCardFeatureClosed()) {
            this.clearCardEntryBadge()
            return
        }
        let n = G.GameConstance.dailyFreeChestCount - Game.SUserCard.data.freeCount
        if ((Game.SUserVillage.MapId() < G.GameConstance.cardSystemStartLevel) || !AppKit.ADWrap.AdEnabled() || Game.SUserVillage.MapId() < G.GameConfig.FreeChestLevel) {
            n = 0
        }
        n += Game.SUserCard.JokerCount()
        this.cardBadge.SetNum(n)
    }
    watchCoinAd() {
        if (GamePlay.instance.isBusy()) return

        AppKit.ADWrap.ShowVideo(() => {
            let oldCoin = Game.SUser.Coin()
            let req = SR.SRUserData.finishVideoCoin()
            req.SetCallBack(() => {
                let adCoinTime = GameKit.PlayerPrefs.GetInt("adCoinTime", 0)
                if (GameKit.TimeUtil.getCurrentHalfDay() !== adCoinTime) {
                    GameKit.PlayerPrefs.SetInt("adCoinCount", 0)
                    GameKit.PlayerPrefs.SetInt("adCoinTime", GameKit.TimeUtil.getCurrentHalfDay())
                }
                let adCoinCount = GameKit.PlayerPrefs.GetInt("adCoinCount", 0)
                GameKit.PlayerPrefs.SetInt("adCoinCount", adCoinCount + 1)
                this.updateCoinAd()

                if (GameMainWindow.instance) {
                    GameMainWindow.instance.userinfo.changeCoin(oldCoin, oldCoin, 0)
                    GameMainWindow.instance.playAddCoinAnim()
                    GameMainWindow.instance.scheduleOnce(() => {
                        GameMainWindow.instance.userinfo.changeCoin(oldCoin, Game.SUser.Coin(), 0.8)
                    }, 1)
                }
            })
            req.Send()
        }, "watchCoinAd")
    }
    playAddCoinAnim() {
        let animBuild = instantiate(this.animAddCoin)
        animBuild.parent = this.animAddCoin.parent
        animBuild.setPosition(0, 0, animBuild.position.z); animBuild.active = true
        GameKit.SoundManager.playSound("steal_money")
    }
    watchSpinAd() {
        if (GamePlay.instance.isBusy()) return

        AppKit.ADWrap.ShowVideo(() => {
            let req = SR.SRUserData.finishVideoAp()
            req.SetCallBack(() => {
                let adSpinTime = GameKit.PlayerPrefs.GetInt("adSpinTime", 0)
                if (GameKit.TimeUtil.getCurrentHalfDay() !== adSpinTime) {
                    GameKit.PlayerPrefs.SetInt("adSpinCount", 0)
                    GameKit.PlayerPrefs.SetInt("adSpinTime", GameKit.TimeUtil.getCurrentHalfDay())
                }
                let adSpinCount = GameKit.PlayerPrefs.GetInt("adSpinCount", 0)
                GameKit.PlayerPrefs.SetInt("adSpinCount", adSpinCount + 1)
                this.updateSpinAd()

                let slot = GamePlay.instance.slotNode
                slot.getComponent("UserInfoModel").stopApAt(Game.SUser.Ap() - 1)
                GamePlay.instance.scheduleOnce(() => {
                    slot.getComponent("UserInfoModel").stopApAt(Game.SUser.Ap() -1)
                    slot.isSpining = true
                    slot.getComponent("UserInfoModel").playApAnim(function(){
                        slot.makeIdle()
                    })
                    slot.showSpinAddNumAnim(1)
                }, 0.5)
            })
            req.Send()
        }, "watchSpinAd")
    }
    updateSpinAd() {
        if (this.spinadShowBtnI) {
            clearInterval(this.spinadShowBtnI)
            this.spinadShowBtnI = null
        }
        this.btnAdSpin.active = false
    }
    updateCoinAd() {
        let old_active = this.btnAdCoin.active
        this.btnAdCoin.active = false
        if (!AppKit.ADWrap.AdEnabled()) return
        if (!Game.MergeGuideHooks.IsFinished()) return

        if (this.coinadShowBtnI) {
            clearInterval(this.coinadShowBtnI)
            this.coinadShowBtnI = null
        }

        let adGetCoinMeta = Meta.MetaManager.GetMeta(Meta.MetaType.AdGetCoin, this.mapId)
        this.labelAdCoin.string = BigNumber.format(adGetCoinMeta.Coin())

        let adCoinTime = GameKit.PlayerPrefs.GetInt("adCoinTime", 0)
        if (GameKit.TimeUtil.getCurrentHalfDay() !== adCoinTime) {
            GameKit.PlayerPrefs.SetInt("adCoinCount", 0)
            GameKit.PlayerPrefs.SetInt("adCoinTime", GameKit.TimeUtil.getCurrentHalfDay())
        }
    }
    gotoPlay() {
        if (GamePlay.instance.isBusy()) return

    }
    gotoVillage() {
        if (GamePlay.instance.isBusy()) return

    }
    //显示下方消息
    showMessage(data) {
        if (data == null) return
        if (this.hasShowMessage) return
        this.hasShowMessage = true

        this.spriteMessageUser.show(new User().updateData(data["user"]))
        // 不同界面的信息域内容不同，因此要根据界面调整User信息域与界面信息的处理
        // avatar.spriteFrame = this.default_avatar_sf
        let isVip = data["user"]["isVip"] && !G.GameConfig.closeVIP && AppKit.SdkManager.IsNative()
        switch (data["type"]) {
            case "attack":
                this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_hammer"), data["user"]["name"])
                if (isVip) this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_hammer_vip"), data["user"]["name"])
                break;
            case "shield":
                this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_shield"), data["user"]["name"])
                if (isVip) this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_shield_vip"), data["user"]["name"])
                break;
            case "raid":
                this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_pig"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                if (isVip) this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_pig_vip"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                break;
            case "invitedUnlock":
                UIRoot.instance.openChildWindow("InvitedNewUserWindow", {data:data})
                this.hasShowMessage = false
                return
                break;
            case "superShield":
                this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_shield"), data["user"]["name"])
                if (isVip) this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_shield_vip"), data["user"]["name"])
                break;
            case "superShieldGold":
                if (data["number"] > 1)
                    this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_noraid"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                    if (isVip) this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_noraid_vip"), data["user"]["name"], GameKit.StringUtil.formatNumber(data["number"]))
                else 
                    this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_shield"), data["user"]["name"])
                    if (isVip) this.labelMessageMsg.string = String.format(GameKit.i18n.t("village_news_log_shield_vip"), data["user"]["name"])
                break;
            default: this.hasShowMessage = false;return;break;
        }
        
        UIRoot.instance.ScreenShake()

        this.spMessage.enterAnim(() => {
            this.scheduleOnce(() => {
                this.spMessage.closeAnim(() => {
                    this.hasShowMessage = false
                })
            }, 3)
        })
    }
    checkTutorial() {
        if (Game.MergeGuideHooks && !Game.MergeGuideHooks.IsFinished()) {
            this.btnMenu.active = false
            this.subMenu.active = false
            Tween.stopAllByTarget(this.btnAdCoin.parent)
            this.btnAdCoin.parent.active = false
            Tween.stopAllByTarget(this.btnAdSpin.parent)
            this.btnAdSpin.parent.active = false
            Tween.stopAllByTarget(this.btnLuckyDraw.parent)
            this.btnLuckyDraw.parent.active = false
            if (!CLOSE_Card) this.btnCard.active = false
            this.btnNewPlayerPack.active = false
            this.btnCongrats.active = false
            this.btnVip.active = false
            this.activityLeft.active = false
            this.activityRight.active = false
            this.adshields[0].parent.parent.active = false
            if (Game.MergeGuideHooks.RefreshMainForcedTutorialHiddenControls) {
                Game.MergeGuideHooks.RefreshMainForcedTutorialHiddenControls()
            }

            Game.MergeGuideHooks.SetFinishCallback(function(){
                if (Game.MergeGuideHooks.RefreshMainForcedTutorialHiddenControls) {
                    Game.MergeGuideHooks.RefreshMainForcedTutorialHiddenControls()
                }
                this.btnMenu.active = this.spVillages.active
                this.subMenu.active = true
                EnterCloseAnim.playEnter(this.subMenu)
                this.btnAdSpin.parent.active = true
                this.btnLuckyDraw.parent.active = true
                this.updateSpinAd()
                this.updateCoinAd()
                this.updateLuckyDraw()
                EnterCloseAnim.playEnter(this.btnAdSpin.parent)
                EnterCloseAnim.playCloseImmediately(this.btnAdCoin.parent)
                EnterCloseAnim.playCloseImmediately(this.btnLuckyDraw.parent)
                if (!CLOSE_Card) this.btnCard.active = true
                this.clearCardEntryBadge()

                Game.ActivityManager.logined()
                if (AppKit.PaymentWrap.PayVisiable()) {
                    this.refreshNewPlayerPackEntry()
                    this.btnVip.active = false
                }
                if (this.currentScene === GamePlay.Scenes.Village) {
                    this.activityLeft.active = true
                    EnterCloseAnim.playEnter(this.activityLeft)
                    this.activityRight.active = true
                    EnterCloseAnim.playEnter(this.activityRight)
                } else {
                    this.activityLeft.active = false
                    this.activityRight.active = false
                }
                this.refreshFirstPurchaseEntry()
                if (AppKit.ADWrap.AdEnabled() && !G.GameConfig.closeAdShield && Game.SUserVillage.MapId() >= G.GameConfig.AdShieldLevel) this.adshields[0].parent.parent.active = true

                if (false && AppKit.SdkManager.IsNative() && Game.SUser.IsGuest()) {
                    UIRoot.instance.openChildWindow("AccountBindWindow")
                } else {
                    let chain = new ChildWindowChain()
                    chain.add("SignWindow", () => this.canAutoOpenSignWindow())
                    chain.add("CardSystemOpenWindow", () => !this.isCardFeatureClosed())
                }

                if (ENABLE_FIRST_PURCHASE_AUTO_POPUP && this.canShowFirstPurchase()) {
                    UIRoot.instance.openChildWindow("FirstPurchaseWindow")
                }
                AppKit.LogEventWrap.logEvent("tutorial_completion")
            }.bind(this))

            Game.MergeGuideHooks.init()
            this.schedule(() => {
                if (Game.MergeGuideHooks.mainWindow) {
                    this.unscheduleAllCallbacks()
                    if (Game.MergeGuideHooks.mainWindow.arrow1) Game.MergeGuideHooks.mainWindow.arrow1.active = false
                    if (Game.MergeGuideHooks.mainWindow.arrow2) Game.MergeGuideHooks.mainWindow.arrow2.active = false
                    if (Game.MergeGuideHooks.mainWindow.arrow3) Game.MergeGuideHooks.mainWindow.arrow3.active = false
                }
            }, 0.1)
        } else if (Game.MergeGuideHooks && Game.MergeGuideHooks.init) {
            Game.MergeGuideHooks.init()
        }
    }
    SetActivityBadge(badge) {
        if (AppKit.NativeWrap.isNewApp()) {return}
        this.activityBadgeData = this.activityBadgeData || {}
        if (this.activityBadgeData[badge.meta.Id()]) return
        //if (!badge.isleft) return

        let isleft = badge.isleft
        this.activityBadgeData[badge.meta.Id()] = badge
        if (isleft) {
            badge.node.parent = this.activityLeft
        } else {
            badge.node.parent = this.activityRight
        }
        badge.node.setPosition(0, badge.node.position.y, badge.node.position.z)

        if (badge.node.name == "KingPassportBadge") {
            this.updateQuestBadge()
        }
    }
    //更新badge的数据
    UpdateActivityBadge(meta){
        if (this.activityBadgeData && this.activityBadgeData[meta.Id()]) {
            const badge=this.activityBadgeData[meta.Id()]
            if(badge&&badge.meta.EndTime()!=meta.EndTime()){
                badge.updateMeta(meta)
            }
        }
    }
    RemoveActivityBadge(id) {
        if (this.activityBadgeData && this.activityBadgeData[id]) {
            this.activityBadgeData[id].node.removeFromParent()
            this.activityBadgeData[id].node.destroy()
            this.activityBadgeData[id] = null
        }
    }
    openQuestWindow() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("QuestCenterWindow")
    }
    updateQuestBadge() {
        this.questBadge.active = false

        //Sign
        let signData = GameKit.DataCache.GetData("signData")
        let canSignWeek = false
        let canSignMonth = false
        if (signData) {
            canSignWeek = signData.signWeekDay > signData.signWeekRewards
            for (let i = 7; i <= 28; i+=7) {
                if (signData.signMonthDay >= i && !signData.signMonthRewards.includes(i)) {
                    canSignMonth = true
                    break
                }
            }
        }

        let act = canSignWeek || canSignMonth
        
        if (act && !this.questBadge.active) {
            this.questBadge.active = act
            this.spQuestAnim.start()
        } else if (!act && this.questBadge.active) {
            this.questBadge.active = act
            this.spQuestAnim.stop()
        }
        
        //Task
        if (GameKit.DataCache.GetData("UserTaskCompleteCount") == null && GameKit.DataCache.GetData("UserTask") != null) {
            let taskList = GameKit.DataCache.GetData("UserTask") || []
            let count = 0
            for (let i in taskList) {
                let task = taskList[i]
                let meta = Meta.MetaManager.GetMeta(Meta.MetaType.Task, task.id)
                if (meta && task.userCount >= meta.Count() && !task.received) {
                    count++
                }
            }
            GameKit.DataCache.SetData("UserTaskCompleteCount", count)
        }
        let taskCount = GameKit.DataCache.GetData("UserTaskCompleteCount") || 0
        let canReceiveTask = taskCount > 0

        let badge = this.activityRight.getChildByName("KingPassportBadge")
        if (badge) {
            badge.getChildByName("badge").active = canReceiveTask
        }
    }
    openActivityWindow(parmas) {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("ActivityCenterWindow",parmas)
    }
    updateActivityBadge() {
        if (!this.activityBadge || !isValid(this.activityBadge)) return

        let showBadge = !!Game.SUserActivity.GetGameActivityBadgeState()
        if (showBadge === this.activityBadge.active) return

        this.activityBadge.active = showBadge

        let rotateAnim = this.btnActivityCenter && (this.btnActivityCenter.getComponentInChildren("RotateAnim") as any)
        if (!rotateAnim) return

        if (showBadge) {
            if (typeof rotateAnim.start === "function") {
                rotateAnim.start()
            }
        } else if (typeof rotateAnim.stop === "function") {
            rotateAnim.stop()
        }
    }
    updateActivityButton() {
        if (!this.node || !this.btnActivityCenter) return
        this.btnActivityCenter.active = false
        return;
        let activities = Game.ActivityManager.GetActiveGameActivities()
        if (activities.length <= 0) {
            this.btnActivityCenter.active = true
        } else {
            if (!this.btnActivityCenter.active) this.activityBadge.active = true
            this.btnActivityCenter.active = true
        }
        if (!this.isCardFeatureClosed()) Game.ActivityManager.checkSubjectCard()
    }
    openFirstPurchase() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (!this.canShowFirstPurchase()) {
            this.refreshFirstPurchaseEntry()
            return
        }
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("FirstPurchaseWindow")
    }
    // NewPlayerPack
    openNewPlayerPack() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (!this.canShowNewPlayerPack()) {
            this.refreshNewPlayerPackEntry()
            return
        }
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("NewPlayerPackWindow")
    }
    updateNewPlayerPackTime() {
        if (this.NewPlayerPackLeftTime && !AppKit.NativeWrap.isNewApp()) {

            this.NewPlayerPackLeftTime = Game.SUserStatus.GetNewPlayerLeftTime()

            let timeText = this.formatNewPlayerPackEntryTime(this.NewPlayerPackLeftTime)
            if (this.labelNewPlayerPack.string !== timeText) this.labelNewPlayerPack.string = timeText

            if (this.NewPlayerPackLeftTime <= 0) {
                this.btnNewPlayerPack.active = false
                this.labelNewPlayerPack.string = GameKit.i18n.t("NewPlayerPackButton")
                this.NewPlayerPackLeftTime = null
            }
        }
    }
    // NewPlayer Congrats
    openCongrats() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("CongratsWindow")
    }
    updateCongratsTime() {
        if (this.CongratsLeftTime) {

            this.CongratsLeftTime = Game.SUserStatus.DoubleTicketTime() - GameKit.TimeUtil.getCurrentTime()

            this.labelCongrats.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.CongratsLeftTime, false)

            if (this.CongratsLeftTime <= 0) {
                this.btnCongrats.active = false
                this.CongratsLeftTime = null
            }
        }
    }
    //Cash
    openCashWindow() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("CashTaskWindow")
    }
    openLevelBonus() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        UIRoot.instance.openChildWindow("LevelBonusWindow")
    }
    // ADShield
    updateADShield() {
        if (this.oldADShield != null && Game.SUser.ADShield() > this.oldADShield) {
        } else {
            for (var i = 0; i < 3; i++) {
                this.adshields[i].active = i < Game.SUser.ADShield()
            }
        }
        this.oldADShield = Game.SUser.ADShield()
        this.adshields[0].parent.getChildByName("flash").active = Game.SUser.ADShield() < G.GameConstance.shieldMax[0]
    }
    watchADShield() {
        if (GamePlay.instance.isBusy()) return
        if (Game.SUser.ADShield() >= G.GameConstance.shieldMax[0]) return

        AppKit.ADWrap.ShowVideo(() => {
            let req = SR.SRUserData.finishVideoShield()
            req.SetCallBack(() => {
                let parentPos = this.adshieldAnim.node.parent.position
                let sourcePos = this.adshieldAnim.node.position
                let x = -47.1 + 35 * Game.SUser.ADShield() - parentPos.x
                let y = -1.3 - parentPos.y
                let adshieldAnimNode = instantiate(this.adshieldAnim.node)
                adshieldAnimNode.parent = this.adshieldAnim.node.parent; adshieldAnimNode.setPosition(sourcePos.x, sourcePos.y, sourcePos.z);
                let adshieldAnim = adshieldAnimNode.getComponent("ShieldAnim")
                let adsd = Game.SUser.ADShield()
                adshieldAnim.play(x, y, 1, () => {
                    let sh = this.adshields[adsd - 1]
                    sh.active = true
                    this.setNodeScale(sh, 0.001)
                    this.scaleNodeTo(sh, 0.2, 1, 'backOut')
                    GameKit.SoundManager.playSound("shiled_added")
                    setTimeout(() => { adshieldAnim.destroy() }, 100)
                })
                this.oldADShield = adsd
            })
            req.Send()
            
            this.updateADShieldTip(true)
            this.adshieldTipSTI = setTimeout(() => {
                this.adshieldTipSTI = null
                this.updateADShieldTip()
            }, 150000)
        }, "watchShieldAd")
    }
    updateADShieldTip(onlyCancel = false) {
       // if (AppKit.NativeWrap.isNewApp())return
        if (!this.node) return
        if (!AppKit.ADWrap.AdEnabled() || G.GameConfig.closeAdShield || Game.SUserVillage.MapId() < G.GameConfig.AdShieldLevel) return
        if (this.adshieldTip.scale.x != 0.001) {
            GameKit.DataCache.SetData("ADTipsBubblePopup", false)
        }
        this.setNodeScale(this.adshieldTip, 0.001)
        Tween.stopAllByTarget(this.adshieldTip)
        if (this.adshieldTipSTI != null) {
            clearTimeout(this.adshieldTipSTI)
            this.adshieldTipSTI = null
        }
        if (onlyCancel) {
            return
        }
        if (Game.SUser.ADShield() >= G.GameConstance.shieldMax[0]) {
            this.scheduleOnce(() => {
                this.updateADShieldTip(false)
            }, 3600);
            return
        }
        if (AppKit.ADWrap.IsVideoPrepared() && !GameKit.DataCache.GetData("ADTipsBubblePopup")) {
            GameKit.DataCache.SetData("ADTipsBubblePopup", true)
            tween(this.adshieldTip)
                .to(0.3, { scale: new Vec3(1, 1, this.adshieldTip.scale.z) })
                .delay(10)
                .to(0.3, { scale: new Vec3(0.001, 0.001, this.adshieldTip.scale.z) })
                .call(() => {
                    GameKit.DataCache.SetData("ADTipsBubblePopup", false)
                    this.adshieldTipSTI = setTimeout(() => {
                        this.adshieldTipSTI = null
                        this.updateADShieldTip(false)
                    }, 150000)
                })
                .start()
        } else {
            this.scheduleOnce(() => {
                this.updateADShieldTip(false)
            }, 3);
        }
    }
    updateSuperShield() {
        
        if (!this.node) return
        let cTime = GameKit.TimeUtil.getCurrentTime()
        if (!this.shieldLastUpdateTime || cTime - this.shieldLastUpdateTime > 1) {
            this.shieldLastUpdateTime = cTime

            Game.SUser.superTimeShieldLeft = Game.SUser.SuperTimeShield()
            Game.SUser.UpdateSuperTimeShield()
            Game.SUser.UpdateTimeShield()

            this.spSuperShield.active = Game.SUser.TimeShield() > 0 && Game.SUser.SuperTimeShield() <= 0
            this.spSuperShieldGold.active = Game.SUser.SuperTimeShield() > 0
            this.labelSuperShieldTime.string = Game.SUser.SuperTimeShield() > 0 ? (GameKit.TimeUtil.FormatRemainTimeSimple(Game.SUser.SuperTimeShield(), false, true)) : (Game.SUser.TimeShield() > 0 ? (GameKit.TimeUtil.FormatRemainTimeSimple(Game.SUser.TimeShield(), false, true)) : "")
        }
    }
    OpenSuperShield() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("ShopWindow", {showShield: true})
    }
    /*openChatRoom() {
        UIRoot.instance.openChildWindow("ChatRoomWindow")
    },*/

    // VIP
    openVipWindow() {
        if (!this.canOperateGuideGlobalUi()) return false
        if (GamePlay.instance.isBusy()) return
        Game.SUserStatus.UpdateExtraTime()
        if (Game.SUserStatus.VipExtraReward() && Game.SUserStatus.VipExtraReward().length > 0) {
            UIRoot.instance.openChildWindow("VIPExtraRewardWindow")
        } else {
            UIRoot.instance.openChildWindow("VIPGetWindow")
        }
    }
    //LuckyDraw
    updateLuckyDraw(show = false) {
        if (!this.btnLuckyDraw) return
        let ct = GameKit.TimeUtil.getCurrentTime()
        if (show) {
            this.btnLuckyDraw.active = false
            GameKit.DataCache.SetData("updateLuckyDrawTime", ct + 300)
        }

        let old_active = this.btnLuckyDraw.active
        this.btnLuckyDraw.active = false
        if (!AppKit.ADWrap.AdEnabled()) return
        if (!Game.MergeGuideHooks.IsFinished()) return

        if (this.luckyDrawActiveI) {
            clearTimeout(this.luckyDrawActiveI)
            this.luckyDrawActiveI = null
        }
        let rt = (GameKit.DataCache.GetData("updateLuckyDrawTime") || (ct + 300)) - ct
        if (rt > 0) {
            this.luckyDrawActiveI = setTimeout(() => {
                this.updateLuckyDraw()
                this.luckyDrawActiveI = null
            }, rt * 1000);
            return
        }

        if (this.luckyDrawShowBtnI) {
            clearInterval(this.luckyDrawShowBtnI)
            this.luckyDrawShowBtnI = null
        }

        var showBtn = () => {
            if (!this.node || !this.btnLuckyDraw) return
            this.btnLuckyDraw.active = true
            if (!old_active) {
                EnterCloseAnim.playEnter(this.btnLuckyDraw)
                this.luckyDrawTimer = 300
            }
        }
        if (AppKit.ADWrap.IsVideoPrepared()) {
            showBtn()
        } else {
            old_active = false
            this.luckyDrawShowBtnI = setInterval(() => {
                if (AppKit.ADWrap.IsVideoPrepared()) {
                    showBtn()
                    clearInterval(this.luckyDrawShowBtnI)
                    this.luckyDrawShowBtnI = null
                }
            }, 3000)
        }
    }
    openLuckyDraw() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("LuckyDrawWindow")
    }
    updateLuckyDrawTimer(dt) {
        if (this.luckyDrawTimer) {

            this.luckyDrawTimer -= dt

            this.labelLuckyDrawTime.string = GameKit.TimeUtil.FormatRemainTimeSimple(this.luckyDrawTimer, false)

            if (this.luckyDrawTimer <= 0) {
                this.luckyDrawTimer = null
                this.updateLuckyDraw(true)
            }
        }
    }
    //Shields
    updateShieldMax() {
        let shieldMax = Game.SUser.GetShieldMax()
        for (let i = 0; i < this.shieldsBgs.length; i++) {
            this.shieldsBgs[i].active = i == shieldMax - G.GameConstance.shieldMax[0]
        }
        for (let i = 0; i < this.userinfo.shields.length; i++) {
            this.userinfo.shields[i].setPosition(shieldPosx[shieldMax][i], this.userinfo.shields[i].position.y, this.userinfo.shields[i].position.z)
        }
        
    }
    // Helper
    OnNewMapStart() {
        let chain = new ChildWindowChain()
        let chest = this.isCardFeatureClosed() ? null : GameKit.DataCache.GetData("UserCardChestArr").pop()
        chain.add("CardChestOpenWindow", () => {
            if (this.isCardFeatureClosed()) return false
            if (chest) {
               // GameKit.DataCache.RemoveData("UserCardChestArr")
                return true
            }
            return false
        }, {chest: chest})

        //cash
        /*let ctmetas = Meta.MetaManager.GetMetas(Meta.MetaType.CashTask)
        let ctget = 0
        for (let id in ctmetas) {
            let meta = ctmetas[id]
            if (meta.MapId() == Game.SUserVillage.MapId() && (typeof meta.Item() == "number")) {
                ctget += meta.Item()
            }
        }
        chain.add("SimpleRewardWindow", () => {
            return ctget > 0
        }, {contents:new Game.Content(Game.Content.Types.Cash, 0, ctget)})*/

        //build king
        chain.add("GetRewardWindow", () => {
            Game.SUserVillage.data.mapId--
            let BuildMasterActivityMeta = Game.ActivityManager.GetActiveGameActivityByType(Meta.ActivityMeta.SubTypes.BuildMaster)
            Game.SUserVillage.data.mapId++
            return !!BuildMasterActivityMeta
        }, {contents:Game.Content.Merge(Game.Content.FromStrings(Meta.ActivityParamsMeta.GetValue(Meta.ActivityParamsMeta.Types.BuildMaster, Game.SUserVillage.MapId())))})

        /*chain.add("CardSystemOpenWindow", () => {
            return !CLOSE_Card && Game.SUserVillage.MapId() == G.GameConstance.cardSystemStartLevel
        })*/

        chain.start()

        this.updateActivityButton()
        Game.ActivityManager.logined()
        this.btnLevelBonus.active = Game.SUserVillage.MapId() >= 2
        this.labelLevelBonus.string = LevelBonusWindow.getShowLevelString()
    }
     // 打开公会
    onOpenGuild(parmas){
        // if (GamePlay.instance.isBusy()) return
        // // console.log("打开工会");
        // if(!Game.SUser.IsGuest()){
        //     let req = SR.SRGuild.verificationLegion({"userId":Game.SUser.UserId()});
        //     req.SetCallBack(function(res) {
        //         // console.log("验证",res.legionId);
        //        if(res.legionId>0){
        //         let req = SR.SRGuild.checkGuildInfo(Game.SUser.GuildId());
        //         req.SetCallBack(function(res) {
        //             // console.log("进入我的军团",res);
        //             Guild.askList={};
        //             res.user.forEach((ele)=>{
        //                 Game.SGuild.guildInfo[ele.userId] = ele;
        //             })
        //             Game.SGuild.updateData(res.legion)
        //             UIRoot.instance.openChildWindow("GuildGameMainWindow",parmas)
        //         }.bind(this))
        //         req.Send();
        //        }else{
        //             Game.SUser.setData("legionId",0)
        //             UIRoot.instance.openChildWindow("GuildGameMainWindow",parmas)
        //        }
        //     }.bind(this))
        //     req.Send();
            
        // }else{
        //     // console.log("绑定FB");
        //     UIRoot.instance.openChildWindow("AccountBindWindow")
        // }
        
        // GameKit.SoundManager.playSound("se_open")
    }
    openGuildBoss(){
        // if (GamePlay.instance.isBusy()) return
        // // console.log("打开工会");
        // if(!Game.SUser.IsGuest()){
        //     let req = SR.SRGuild.verificationLegion({"userId":Game.SUser.UserId()});
        //     req.SetCallBack(function(res) {
        //         // console.log("验证",res.legionId);
        //        if(res.legionId>0){
        //         let req = SR.SRGuild.checkGuildInfo(Game.SUser.GuildId());
        //         req.SetCallBack(function(res) {
        //             // console.log("进入我的军团",res);
        //             Guild.askList={};
        //             res.user.forEach((ele)=>{
        //                 Game.SGuild.guildInfo[ele.userId] = ele;
        //             })
        //             Game.SGuild.updateData(res.legion)
        //             UIRoot.instance.openChildWindow("GuildGameMainWindow")
        //         }.bind(this))
        //         req.Send();
        //        }else{
        //             Game.SUser.setData("legionId",0)
        //             UIRoot.instance.openChildWindow("GuildGameMainWindow")
        //        }
        //     }.bind(this))
        //     req.Send();
            
        // }else{
        //     // console.log("绑定FB");
        //     UIRoot.instance.openChildWindow("AccountBindWindow")
        // }
        
        // GameKit.SoundManager.playSound("se_open")
    }
    openAmore(){
        if (GamePlay.instance.isBusy()) return
    }
    /** 点击事件： */
    event_5_news() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("VillageNewsWindow");
    }
    /** 点击事件： */
    event_6_gifts() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("GiftsWindow");
    }
    /** 点击事件： */
    event_9_leaderboard() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("LeaderboardWindow");
    }
    /** 点击事件： */
    event_10_invite() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("InviteWindow")//
    }
    /** 点击事件： */
    event_11_setting() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("SettingWindow");
    }
    /** 点击事件： */
    event_13_friends() {
        if (!this.canOperateGuideGlobalUi()) return false
        if(!Game.SUser.IsGuest()){
            let req = SR.SRGuild.verificationLegion({"userId":Game.SUser.UserId()});
            req.SetCallBack(function(res) {
            // console.log("验证",res.legionId);
           if(res.legionId>0){
            let req = SR.SRGuild.checkGuildInfo(Game.SUser.GuildId());
            req.SetCallBack(function(res) {
                // console.log("进入我的军团",res);
                Guild.askList={};
                res.user.forEach((ele)=>{
                    Game.SGuild.guildInfo[ele.userId] = ele;
                })
                Game.SGuild.updateData(res.legion)
                UIRoot.instance.openChildWindow("GuildGameMainWindow","1")
            }.bind(this))
            req.Send();
           }else{
                Game.SUser.setData("legionId",0)
                UIRoot.instance.openChildWindow("GuildGameMainWindow","1")
           }
        }.bind(this))
        req.Send();

        }else{
            // console.log("绑定FB");
            UIRoot.instance.openChildWindow("AccountBindWindow")
        }
    }
    /** 点击事件： */
    event_sign() {
        if (!this.canOperateGuideGlobalUi()) return false
        UIRoot.instance.openChildWindow("SignWindow");
    }
    private getOrAddTransform(node: Node | null) {
        if (!node) return null;
        return node.getComponent(UITransform) || node.addComponent(UITransform);
    }

    private getOrAddOpacity(node: Node | null) {
        if (!node) return null;
        return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
    }

    private setNodeHeight(node: Node | null, height: number) {
        const transform = this.getOrAddTransform(node);
        if (transform) {
            const { width } = transform.contentSize;
            transform.setContentSize(width, height);
        }
    }

    private setNodeContentSize(node: Node | null, width: number, height: number) {
        const transform = this.getOrAddTransform(node);
        if (transform) transform.setContentSize(width, height);
    }

    private getNodeContentSize(node: Node | null) {
        const transform = node ? node.getComponent(UITransform) : null;
        return transform ? transform.contentSize : { width: 0, height: 0 };
    }

    private setNodeOpacity(node: Node | null, opacity: number) {
        const comp = this.getOrAddOpacity(node);
        if (comp) comp.opacity = opacity;
    }

    private setNodeScale(node: Node | null, scale: number) {
        if (node) node.setScale(scale, scale, node.scale.z);
    }

    private scaleNodeTo(node: Node | null, duration: number, scale: number, easing?: string) {
        if (!node) return;
        tween(node).to(duration, { scale: new Vec3(scale, scale, node.scale.z) }, easing ? { easing: easing as any } : undefined).start();
    }

    private pulseNode(node: Node | null) {
        if (!node) return;
        const base = node.scale.clone();
        tween(node)
            .to(0.15, { scale: new Vec3(base.x * 1.2, base.y * 1.2, base.z) })
            .to(0.15, { scale: base })
            .start();
    }

    private getLevelBonusShowLevel() {
        const levelIds: Record<number, [number, number]> = {
            1: [1, 49],
            2: [50, 99],
            3: [100, 149],
            4: [150, 199],
            5: [200, 249],
            6: [250, 299],
            7: [300, 349],
        };
        let showLevel = 1;
        while (levelIds[showLevel]) {
            if (Game.SUserStatus.LevelBonusOpens() < showLevel) break;
            let fullGet = true;
            for (let i = levelIds[showLevel][0]; i <= levelIds[showLevel][1]; i++) {
                if (!Game.SUserStatus.LevelBonusGet().includes(i)) {
                    fullGet = false;
                    break;
                }
            }
            if (fullGet) showLevel++;
            else break;
        }
        return levelIds[showLevel] ? showLevel : 7;
    }

    private getLevelBonusShowLevelString() {
        const levelIds: Record<number, [number, number]> = {
            1: [1, 49],
            2: [50, 99],
            3: [100, 149],
            4: [150, 199],
            5: [200, 249],
            6: [250, 299],
            7: [300, 349],
        };
        const ids = levelIds[this.getLevelBonusShowLevel()];
        return `${Meta.MetaManager.GetMeta(Meta.MetaType.LevelBonus, ids[0]).MapId()}-${Meta.MetaManager.GetMeta(Meta.MetaType.LevelBonus, ids[1]).MapId()}`;
    }
}

(global as any).GameMainWindow = GameMainWindow;
