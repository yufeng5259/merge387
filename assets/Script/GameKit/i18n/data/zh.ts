const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "開始", // 【未找到预制】-【脚本或动态使用】
  "Score": "分數", // 【未找到预制】-【脚本或动态使用】
  "Restart": "重啟", // 【未找到预制】-【脚本或动态使用】
  "Loading": "載入中", // 【DownloadingWindow】-【New Label】
  "Cancel": "取消", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "確認", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "重試", // 【未找到预制】-【脚本或动态使用】
  "Back": "返回", // 【未找到预制】-【脚本或动态使用】
  "Accept": "接受", // 【未找到预制】-【脚本或动态使用】
  "Level": "等級", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "排名", // 【未找到预制】-【脚本或动态使用】
  "Rank": "排名", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "點數", // 【未找到预制】-【脚本或动态使用】
  "OK": "好", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "是的", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "不", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "是的", // 【未找到预制】-【脚本或动态使用】
  "No": "不", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "領取", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "恭喜！", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "以及", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "重試", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "關掉", // 【未找到预制】-【脚本或动态使用】
  "MORE": "更多", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "此功能尚未開放。", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "球員生涯", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "付款被停用！", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "付款功能只在 Android 上啟用！", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "iOS 上的付款被停用了！", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "抱歉，目前付款功能與你的系統不相容。請在電腦上輸入 Coin Gang 至 Instant Games 以完成購買。", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "感謝您的購買！", // 【PaySuccessWindow】-【label】
  "PayFail": "購買失敗！", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "您的購買正在等待中！完成付款後，重新啟動遊戲以領取物品。", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\n關掉", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "影片還沒準備好！", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "需要存取權", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "我們需要你的資訊", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "允許進入", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "這個函式目前與你的客戶端版本不相容。請更新 WeChat。", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "嘿，這真的是一款超棒的遊戲！我們一起玩吧 ：-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "嘿，這真的是一款超棒的遊戲！我們一起玩吧 ：-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} 剛剛只是讓你轉了幾圈:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} 剛給你一些硬幣:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "我剛建立了一個新王國！來拜訪:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "哇！我剛偷了 {0} 硬幣！超酷的：-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "哇！我剛剛攻擊了另一個王國！真酷:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "分享", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "邀請", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "發送", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} 剛給你卡片:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "連線失敗，請再試一次？", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "無法連接到伺服器。", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "伺服器連線中斷。", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "成功", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "購買失敗", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "無法載入資源 {0}。再試一次？", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} 年", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} 個月", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} 天", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} 小時", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} 分鐘", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} 秒", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": "{0}年前", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": "{0}個月前", // 【未找到预制】-【脚本或动态使用】
  "PastDay": "{0}d 前", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": "{0}小時前", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": "{0}m 前", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": "{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "現在", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "現在", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "遊戲", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "來賓", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "有一些更新。", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "裝填", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "以訪客登入", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "請以 Apple登入", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "請用 Facebook登入", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "請以 Google Play登入", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "金幣", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "轉動", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "護盾", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "卡牌", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "木製寶箱", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "銀寶箱", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "金寶箱", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "空箱！", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "物品", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "項目", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "砲彈", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "發送", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} 在 {1}旋轉", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "自動", // 【slot】-【New Label】
  "ToRaidUserBet": "WIN X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "全勝 X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "BET", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "全額", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} 旋轉", // 【未找到预制】-【脚本或动态使用】
  "Shield": "護盾", // 【未找到预制】-【脚本或动态使用】
  "Attack": "攻擊", // 【未找到预制】-【脚本或动态使用】
  "Spins": "轉動+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "掠奪", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "蘿莉", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. 你可以按月獲得\n     登入獎勵\n     一個月七天。\n2. 每月登入獎勵將\n     下個月再刷新。\n3. 你可以每週一次\n     每日登入獎勵\n     一週後。\n4. 每週簽到獎勵\n     下週再刷新。", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "看影片就能拿到硬幣", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "自由旋轉", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "旋轉一下 {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "自由自旋\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "好十倍！", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "收帳", // 【dailyBonus】-【text】
  "DailyBonusLevel": " {0}級", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "第一次至少有2500萬枚硬幣！", // 【dailyBonus】-【label】
  "BuildButtonBuy": "購買", // 【btnBuild】-【New Label】
  "BuildButtonFix": "修正", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "硬幣用完了？", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "旋轉用完了？", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} 旋轉", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "或者等{1}{0}旋轉", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "等{1}{0}旋轉", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\n更多", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "菜單", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "遊戲", // 【MenuWindow】-【name】
  "menu_1_village": "王國", // 【MenuWindow】-【name】
  "menu_2_buy": "購買硬幣/旋轉", // 【MenuWindow】-【name】
  "menu_3_daily": "每日獎金", // 【MenuWindow】-【name】
  "menu_4_shop": "王國進化", // 【MenuWindow】-【name】
  "menu_5_news": "訊息", // 【MenuWindow】-【name】
  "menu_6_gifts": "禮物", // 【MenuWindow】-【name】
  "menu_7_card": "卡片", // 【MenuWindow】-【name】
  "menu_8_map": "地圖", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "排行榜", // 【MenuWindow】-【name】
  "menu_10_invite": "邀請", // 【MenuWindow】-【name】
  "menu_11_setting": "場景設定", // 【MenuWindow】-【name】
  "setting_title": "場景設定", // 【SettingWindow】-【New Label】
  "setting_sound": "音效", // 【SettingWindow】-【New Label】
  "setting_music": "音樂", // 【SettingWindow】-【New Label】
  "setting_notifications": "通知", // 【SettingWindow】-【title】
  "setting_raid": "突襲與攻擊", // 【SettingWindow】-【New Label】
  "setting_general": "概述", // 【SettingWindow】-【New Label】
  "setting_language": "語言", // 【SettingWindow】-【title】
  "setting_english": "英文", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "喜歡我們，別錯過什麼\n精彩活動與禮物", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "像是", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "教學", // 【SettingWindow】-【New Label】
  "setting_support": "支持", // 【SettingWindow】-【New Label】
  "setting_privacy": "條款與隱私", // 【SettingWindow】-【New Label】
  "setting_terms": "條款與條件", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "聯絡我們", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "登出", // 【SettingWindow】-【Txt】
  "setting_change": "變化", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "清除快取", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "隱私設定", // 【SettingWindow】-【New Label】
  "setting_language_title": "語言", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "英文", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "中文", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "西班牙語", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "德意志", // 【SettingLanguageWindow】-【label】
  "invite_title": "想要更多旋轉？", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>邀請朋友，每解鎖一個朋友就能獲得</color><color=#ff99f9><outline color=#471f01 width=3>{0}次免費</outline></color><color=#f1edff>\n王國2！</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>邀請朋友，每位加入遊戲的朋友都能獲得</color><color=#ff99f9><outline color=#471f01 width=3>{0}免費</outline></color><color=#f1edff>旋轉！</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "邀請", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* 你朋友之後會有獎勵\n透過Facebook連接", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "與Facebook聯繫", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "連結", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "我們不會代表你發文", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "登入並獲得免費旋轉", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "你確定嗎？", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "賓客不能和朋友一起玩", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "扮演嘉賓", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "朋友們", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "鄉村", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "全球", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "禮物", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "自由旋轉", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "免費硬幣", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "卡片", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "邀請", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "發送", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "收取", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "全部收集/寄送", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "全部收集", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "邀請朋友", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "獲得免費旋轉", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "每日收集的旋轉次數 {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "每日收集的硬幣 {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "禮物免費旋轉", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "讓你 {0} 旋轉", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "免費贈幣", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "寄{0}硬幣給你", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "寄卡片\n對你的朋友們", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "寄張卡片給你", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "你必須到達{0}王國才能收集這張卡", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "商店", // 【ShopWindow】-【title_label】
  "ShopSpins": "轉動", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "金幣", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "寶箱", // 【ShopWindow】-【New Label】
  "ShopTreats": "零食", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0}旋轉", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": " 多出{0}%", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": "{0}氫能活化", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "硬幣商店", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "{0}級", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\n更多", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "出售", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "寶箱可在王國{0}解鎖", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "Treats 在 Kingdom {0}解鎖", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "受歡迎", // 【ShopWindow】-【New Label】
  "ShopBestValue": "最佳價值", // 【ShopWindow】-【New Label】
  "village_news_title": "訊息", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>攻擊了你的王國</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>沒能攻擊你的王國</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>偷走了你的{1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>加入Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>沒能從你那裡偷走{1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "王國", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "郵件", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#F64037>{0}</color><color=#464646>到期</c>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "{0}到期", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "新王國\n敬請期待", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "復仇！", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "攻擊你的朋友！", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "隨機", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "復仇", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "攻擊", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "看影片並取得", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0}旋轉", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0}枚硬幣", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "觀看", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "王國完成！", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "下一篇", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "朋友獎勵", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0}解鎖了一個新王國！你有\n{1} 自由旋轉", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0}加入了遊戲！你有\n{1} 自由旋轉", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "升級一件物品以獲得一星。\n\n收集25顆星星即可解鎖下一個王國。", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "你沒有足夠的硬幣......\n\n往下滑即可賺取更多硬幣。", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "利用老虎機旋轉、攻擊和突襲他人。", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "攻擊其他玩家的王國來獲得金幣。", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "盾牌會保護你的王國免受攻擊。", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "襲擊國王的王國，搶走他的錢幣！", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "這是國王\n我們去突襲他！", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "你的第一個王國", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "歡迎，我的朋友！\n\n按下按鈕開始你的工作。", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "目標", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "成功！", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "你的獎勵：", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200圈！", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20圈！", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "100萬枚硬幣！", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "存檔！", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "和朋友一起玩！", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "自動旋轉", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "長按按鈕啟動", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "試試看！", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "驚喜邀約", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "剩餘時間", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} 硬幣", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0}旋轉", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "銷售時間剩{0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>攻擊{0}次才能獲得\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>完成的條越多，</color></outline><outline color=#b74800 width=2><color=#fff000>獎勵就越豐厚！</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "最終酒吧獎品：", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} 金幣！", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "下注更高，更快拿到！", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "明白了！", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "結尾為{0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>突襲{0}次數可獲得\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "完成即可獲得獎勵！", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "攻擊", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "攻擊被阻擋", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "突襲", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "優秀突襲", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "按3個符號", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>你有獎勵\n{0}！</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "卡片\n收藏", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "完成", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "解鎖資訊請見\n王國{0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* 點擊重複卡片可寄給朋友", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- 組隊完成 -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "完成這組勝利", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "詢問", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "發送", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "不能向朋友提出要求", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "這張卡是金色的，不能向朋友索要", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "不能寄給朋友", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "這張卡是金色的，不能寄給朋友", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "你已達到每日可寄卡片的上限", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "你需要不只一張卡片才能寄出", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "太棒了！", // 【CardCollectWindow】-【title】
  "CardCollectDes": "卡片 {0}\n被加入你的專輯", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "快去看看", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "寄卡片", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "選一個朋友！", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "選擇卡", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "寄卡片", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "選擇最多 {0} 張卡片！", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "你選擇的卡牌：", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "卡片成功寄出！", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "卡片資訊", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "透過寶箱收集卡片", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "你也可以在商店買寶箱", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "寶箱可以在團隊副本中或解鎖新王國時找到", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "擁有兩張或以上同款卡，可以將它們作為禮物送給朋友", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "點擊卡片即可贈送", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "你也可以向朋友詢問遺失的卡片", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "一天最多可以寄出5張卡片", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "星星表示牌的稀有度", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "新收集卡牌上的稀有度星會給你1顆星", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "完成卡牌組，獲得驚人獎勵！", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "常見", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "稀有", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "木箱", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "銀箱", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "金箱", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "高機率：", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "新", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>收集卡片以獲得更多<color=#fff000>幣</color>和<color=#77e7ff>旋轉</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>收集卡片以獲得更多<color=#b85b00>幣</color>和<color=#0073d4>旋轉</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "搜尋好友名稱", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "沒有朋友", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang送給你金幣和旋轉！", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "任務中心", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "任務會在新的一天重新整理。請重新打開窗戶。", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "每日", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "邀請", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "標誌", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8天", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15天", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22天", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28天", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "第一天", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "第二天", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "第三天", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "第四天", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "第五天", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "第六天", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "第七天", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "標誌", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "簽名", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "主線任務： {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "進球： {0}\n獎勵： {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "收取", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "走吧", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": " {0}更新", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "活動中心", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "剩餘時間： {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "結尾： {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "活動已結束", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "任務", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "活動", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "你有滿旋轉！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "我們有足夠的旋轉次數來玩，還能拿到更多硬幣！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "每日獎勵現已開放！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "來玩每日的幸運輪吧！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "我們來報仇吧！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "有人入侵了你的王國！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "活動將結束！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} 一小時後結束！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "好久不見！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "有許多新活動。我們還準備了一份大禮物給你！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "來跟我玩！", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "回來！我們準備了一份大禮物給你！", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "新更新", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "我們修正了應用程式內購買功能，並新增了更多活動。\n其他玩家都已下載並遊玩過新版本。你所有的資料都已轉移到新版本。\n謝謝你。", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "更新", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "不用了，謝謝", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "愛 Coin Gang？", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "點選星號即可在商店評分。", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "提交", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "現在不行", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "資源載入失敗。再試一次？", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "走！", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "購買任何東西", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "獲得額外獎勵！", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "立即購買！", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "歡迎來到 Coin Gang！", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>我們準備了\n<color=#ffe62b>大禮物</c> 給你~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "升級", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "精選", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "提升團隊副本獎勵", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● 獎勵增加：{0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "增加攻擊獎勵", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● 獎勵提升：{0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "防護攻擊", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● 保護機率：{0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "防禦襲擊", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● 保護機率：{0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● 下一階段：{0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>雇用僕人以獲得更多<color=#ffe615>幣</color>並<color=#0ce4fe>旋轉</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>雇用僕人以獲得更多<color=#e67b07>幣</color>並<color=#006fd7>旋轉</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "升級：", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "每台老虎機旋轉 = 1 僕人EXP。你可以用藥水來獲得更多從者EXP。當從者EXP條滿時，點擊升級按鈕升級你的從者。每次從者升級都會提升你的遊戲星。", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "技能：", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "從者的技能會隨著等級提升而提升", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "啟動：", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "餵食你的僕人來啟動它。在旋轉和建造時獲得從者食物。", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "旋轉以贏得最高", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "額外一{0}", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "我有禮物給你！", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "鸚鵡彼得會帶給你隨機禮物！", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "只要輕觸彼得，他來時就能收到禮物！", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "免費護盾！", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "餵我吃東西！", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "免費", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "每發交易都能揭露更多", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "購買先前優惠可解鎖", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "投注上限提高", // 【slot】-【Label - Msg】
  "SlotBetSuper": "超級", // 【slot】-【New Label】
  "I18N_BUY_NOW": "立即購買", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>最多增加20%的硬幣和旋轉</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>最多增加20%的硬幣和旋轉次數</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>下注更高，能讓你收集的每一項都乘以！<img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>下注更高，能讓你收集的每一個都乘以！<img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "小丑牌可用來取代限定牌。", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "享受《金幣幫》", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "請在此輸入文字......", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>完成任一卡牌套組即可獲得 <color=#ffffff>{0}% 額外獎勵</color>！</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "加入群組", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "加入我們的", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>從這些箱子裡拿卡！這些寶箱只在活動期間開放！你可以在商店和其他活動中獲得這些特殊寶箱。</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>限時卡組</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "走！", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>使用優惠券購買包包，獲得 100% 更多的金幣、寶箱和旋轉獎勵！</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "刪除", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "輸入「刪除」即可確認刪除您的帳號！", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "請追蹤官方帳號以獲得最新消息", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "輸入朋友的邀請碼即可獲得獎勵！", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "請檢查邀請碼", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "邀請代碼", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "買一大包，送兩包！", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "救命", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "完成今天的限時任務，解鎖更高點數獎勵任務！", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "啟動", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "購買等級", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "接收", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "免費", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "隘口", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "舞台{0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "等級：最高等級", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "升級", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "相位獎勵", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "升級建築", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*你只能購買一包。", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>小說卡</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "成功", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "點擊繼續", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "每日獎勵", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "功能描述", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "在沙灘旁合流即可解鎖獎勵！", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "三天免費試用，然後每月16.99美元", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "建築名稱", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "獎勵預覽", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "最終獎勵", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "收錄", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "購買有困難嗎？", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "聯絡客服", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "今天看太多影片了", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "美元", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "隨機卡", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "金卡", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "魔法寶箱", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "僕人", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "RAID 保護", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "冰", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "球", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "歡迎！", // 【dailyBonus】-【Text】
  "menu_12_sign": "獎勵行事曆", // 【MenuWindow】-【name】
  "setting_lowbattery": "低功耗模式", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "開啟低功耗模式會降低功耗，但效能會下降。", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "恢復購買", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "VIP皇冠秀", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "玩 Coin Gangster，\n請確認", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    繼續即表示我知悉 Happy Donut 可能會依據<color=#ffffff><u><on click='privacyHandler'>隱私權政策</on></u></color>儲存並處理我的資料。\n\n我已閱讀並同意<color=#ffffff><u><on click='termHandler'>條款與條件</on></u></color>，其構成合約，並包含集體訴訟放棄與仲裁條款。</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "法蘭西", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "繁體中文", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "日本語", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "義大利語", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "葡萄牙人", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*10分鐘後刷新", // 【LeaderboardWindow】-【note】
  "ShopShield": "超級\n盾牌", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "銀盾", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "金盾", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "保護你的王國", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "防範：", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>攻擊與<color=#288bdf>襲擊</color>（獨家）</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "超級護盾能長時間保護你的王國免受攻擊和突襲。", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>攻擊了你的王國</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>未能攻擊你的王國</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>偷走了你的{1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>加入Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff>沒能從你那裡偷走{1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "輕觸開啟", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff>把你從朋友名單上移除了</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>收集{0} <img src='{1}_s'/>即可獲勝！</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>下注較高以獲得更多<img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>收集<img src='{0}_s'/>就能爬上排行榜！</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>投注更高，能讓你收集的每<img src='{0}_s'/>倍數！</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "開始玩來收集", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2><img src='{0}_s' />加入</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "贏家！", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "以下是你贏得的獎品：", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "比賽結束", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "這次你沒贏，但還是有獎品！", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "所收集的禮物", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "河邊", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "大獎", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "至少有一個：", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "可交易", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "去交換吧！", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "現在可以交易了！", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "卡牌交易小組", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "請貼出你缺少哪些卡牌", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "交換重複卡牌", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "贏得豐厚獎勵！", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "結交新朋友", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "你有優惠券！", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>使用優惠券購買包包，並獲得多{0}%的<color=#fefe28>幣</color>、寶箱和<color=#64ebff>旋轉</color>！</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*新用戶，僅限一次！", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "旋轉", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "獎勵", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "在老虎機活動中獲得額外的旋轉次數和金幣", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "每日獎勵", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "回收上限", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>閃耀的造型，<color=#fed400>紅色的名字</color>和<color=#fed400>皇冠</color>！</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "年份", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "月份", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "一週", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP 在指定價格下提供訂閱服務，每天提供旋轉、食物和卡片。這是一個<color=#203d9b><u><on click=\"handle\" param=\"sub\">的自動續約訂閱</on></u></c>。付款會在確認時記入您的手機帳戶。<color=#5e2802>除非在期限結束前24小時關閉訂閱，否則訂閱會持續續約，且你的帳戶將被收取續約費用。</c> 你可以在帳號設定裡關閉它。若提供免費試用期未使用的部分，當用戶購買訂閱時（適用情況）將被沒收。<color=#203d9b><u><on click=\"handle\" param=\"pri\">隱私政策與使用條款</on></u></c>。</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "熱", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "免費開始", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3天免費試用，然後每月{0}", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "每天都要買這些！", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "全部取得", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "解鎖VIP就能獲得所有累積的加成", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "錢庫", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "解鎖\n{0}級", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "交換\n{0}級", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "交換", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "解鎖{0}關以開啟", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "交換", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "沒錢了！", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "免費", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "觀看影片", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "抓住機會", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>30</color></size>倍額外獎勵\n絕對<size=46><color=#7ee0f4>5000+</color></size>旋轉！</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "購買關卡通行證後，還能獲得大量旋轉獎勵！", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "為了王國 {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "鬼牌", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "隨便選一張牌！", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "場景\n獎項", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "完成這套", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "只有我沒有的展牌", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "我要了！", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "到期於", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "你的鬼牌正在等待。\n在時間結束前，選擇你想要的卡牌！", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "現在就選", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "你選了 {0} 卡", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "完整套組", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*活動期間完成的任何卡牌組合都會獲得獎勵", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": " {0} 箱中有1個包含", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "（{0}/{1}）保證有！", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "每週可購買 {0}至{1} 次", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "交換你的重複卡牌\n為了刺激", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "解鎖地點\n王國 {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "球隊", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "朋友們", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "創作", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "瀏覽", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "取消", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "隊伍名稱：", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "徽章", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "說明：", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "隊伍類型：", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "必修星級：", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "主編", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "開場", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "已關閉", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "離開", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "加入", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "查看團隊", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "參觀", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "移除", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "邀請朋友", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "最佳球隊推薦", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "選擇隊徽", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "救命", // 【HelpWindow】-【title_label】
  "Guild_Request": "請求", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "選擇一張卡片向隊友請求", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "申請卡", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID：", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} 已經離開球隊了！", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} 已經加入團隊了！", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "成員：{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "不夠 ☆！", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "你只能輸入推薦信！", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "隊伍名稱至少要有3個角色！", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0}會給出一張牌 x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "新增好友", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "刪除帳號與資料", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "警告", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "你即將刪除你的帳號和所有資料。\n  刪除後無法恢復。", // 【DeleteWindow】-【des】
  "menu_13_Friends": "朋友們", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "刪除帳號", // 【MenuWindow】-【name】
  "setting_delete": "刪除帳號", // 【SettingWindow】-【New Label】
  "BindTitle": "帳號", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "切換帳號", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "連結你的帳號後，\n你可以在其他裝置上遊玩", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "這個社群媒體帳號是連結的\n 轉到遊戲帳號。\n 你可以切回去\n 你的原始遊戲帳號\n 或聯絡我們解除連結。", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "點擊[切換帳號]以登入", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "聯絡我們解綁", // 【AccountHintWindow】-【tip】
  "ShopDaily": "每日特價", // 【ShopWindow】-【subtitle】
  "ShopGem": "寶石", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "項目", // 【ShopWindow】-【New Label】
  "ShopHot": "熱", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "小丑寶箱的數量\n每週特賣有限", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "任命他為新管理員？", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>優惠券</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>更多旋轉</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>您的折扣</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>可獲得額外</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4></color></outline><outline color=#6a01ba width=1><color=#9d2cf4>剩餘時間的旋轉或硬幣： {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "你有優惠券！\n 為了額外{0}\n旋轉或硬幣", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "申請", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>只要整個團隊都<img src='bossyucha'/>\n 收集起來，你可以獲得\n 「寶箱隊」！</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "終極獎", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "為了深海的寶藏，\n全隊必須擊敗海怪！", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "傳說那浩瀚的海洋\n藏著無盡的寶藏，還有\n取得它們，必須深入探討\n無盡的深淵與失敗\n守護深淵的怪物。\n和你的隊伍一起收集魚叉\n擊敗所有怪物！\n1. 要拿到魚叉，你必須先攻擊和突襲。\n2. 用魚叉擊敗怪物，然後點擊怪物以獲得獎勵。\n3. 你在對怪物造成高傷害後可以進入排行榜。\n4. 對怪物造成的傷害越高，獎勵越高。\n5. 排行榜獎勵會在活動結束後寄送到信箱。", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "你有：", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "卡牌交易不會降低你的遊戲進度", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "選擇牌至", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "幫我挑選卡片", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "貿易", // 【CardTradeWindow】-【Label】
  "JackT_depart": "離開", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "大獎：", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "獎金池", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "我們一起玩，拿獎勵吧！", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "放棄會失去所有獎品！", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "再多兩級就是額外關卡！", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "辭職", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "復興", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "你確定要離開嗎？", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "什麼都沒帶走！", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "小技巧", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "傑克買了張機票準備去旅行，卻被警方追捕。避開警察，選擇正確的卡牌以獲得獎勵。", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "獎品將加入獎金池。玩家可以隨時選擇退出遊戲，並獲得目前的獎勵。", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "被警方逮捕後，玩家可透過觀看廣告或付費復活。你可以在沒有獎勵的情況下退出遊戲。", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "付費復活並獲得機票和超級豐厚的獎勵。", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "遊戲中會預覽額外關卡。", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "繼續", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "收集所有獎勵！", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "暫停！", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "前往", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "拿獎勵！", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "你需要離開現有團隊，加入新的團隊。", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "排行榜", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "軍階", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "加入團隊，結交朋友，和隊友一起獲得更多旋轉和卡牌！", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "立即加入", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff>完成了</color><color=#FFBC06>{1}</color><color=#ffffff>組！恭喜！</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff>買了一台</color><color=#FFBC06>{1}</color><color=#ffffff>！他們現在非常富有！</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff>買了</color><color=#FFBC06>{1}</color><color=#ffffff>。讓我們祝福他們吧！</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff>有個</color><color=#FFBC06>{1}</color><color=#ffffff>！恭喜！</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>太棒了！</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff>剛完成了所有地圖！</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "升級", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "任務重點", // 【脚本】-【game/items/Content.js】
  "story1": "步驟完成", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "點擊繼續。", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "地圖1 建築1 章節標題", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "地圖1 建築2 章節標題", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "地圖1 建築3 章節標題", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "地圖1 建築4 章節標題", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "地圖1 建築5 章節標題", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "球員資訊", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "阿凡達", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "阿凡達框架", // 【AvatarWindow】-【New Label】
  "Button_Save": "存檔", // 【AvatarWindow】-【New Label】
  "EditNickName": "編輯你的暱稱", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": " {0}級", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>点击棋子以在此处阅读详细信息</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "生成於", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "升級後的後續世代", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "可以產生", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "會煮飯", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "儲存", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "新增", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "開放選拔箱", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "請選擇以下獎勵之一", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "生產方法", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "敲擊炊具以收集成品。", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "提示", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "如果你已經有連結帳號，\n 你可以登入那個帳號\n 繼續玩遊戲。", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "這個帳號有遊戲資料", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "綁定/切換失敗", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "活期帳戶已經綁定在這個遊戲資料上", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "歡迎", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "合成這些棋子", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "點擊生成器", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "訂單完成", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "是否扎破", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "扎破", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "取消", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "剩餘", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "刷新間隔", // 【ShopWindow】-【New Label】
  "ShopOver": "售罄", // 【ShopWindow】-【price】
  "ShopFree": "免費", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "完成", // 【mergeUI】-【New Label】
  "ShopSpin": "購買體力", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "這張卡是金色的。", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "你已經達到每日可寄出的卡片上限。", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP", // 【未找到预制】-【脚本或动态使用】
  "BuyEnergy":"Buy Energy",
  "BuyEnergy1":"Producing items costs Energy,you can buy more here.",
  "BuyEnergy2":"Get fabulous prizes!",
  "BuyEnergy3":"SUPER PASS"
};

export default phrases;
