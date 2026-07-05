const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "시작", // 【未找到预制】-【脚本或动态使用】
  "Score": "점수", // 【未找到预制】-【脚本或动态使用】
  "Restart": "재시작", // 【未找到预制】-【脚本或动态使用】
  "Loading": "로딩 중", // 【DownloadingWindow】-【New Label】
  "Cancel": "취소", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "확인", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "다시 시도", // 【未找到预制】-【脚本或动态使用】
  "Back": "뒤로", // 【未找到预制】-【脚本或动态使用】
  "Accept": "수락", // 【未找到预制】-【脚本或动态使用】
  "Level": "레벨", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "순위", // 【未找到预制】-【脚本或动态使用】
  "Rank": "순위", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "포인트", // 【未找到预制】-【脚本或动态使用】
  "OK": "알겠어", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "네", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "아니야", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "네", // 【未找到预制】-【脚本或动态使用】
  "No": "아니", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "받기", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "축하해요!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "그리고", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "재도전", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "꺼", // 【未找到预制】-【脚本或动态使用】
  "MORE": "더 보기", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "이 기능은 아직 제공되지 않습니다.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "선수", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "결제가 비활성화되었습니다!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "결제는 안드로이드에서만 활성화되어 있습니다!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "iOS에서 결제가 비활성화되었습니다!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "죄송하지만, 결제 기능이 현재 시스템과 호환되지 않습니다. 구매를 완료하려면 컴퓨터에서 Instant Games Coin Gang을 입력해 주세요.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "구매해 주셔서 감사합니다!", // 【PaySuccessWindow】-【label】
  "PayFail": "구매 실패!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "구매가 대기 중입니다! 결제를 완료한 후 게임을 재시작해 아이템을 받으세요.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\n꺼", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "영상이 준비되지 않았습니다!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "접근 필요", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "네 정보가 필요해", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "접근 허용", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "이 기능은 현재 클라이언트 버전과 호환되지 않습니다. WeChat업데이트해 주세요.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "이거 정말 멋진 게임이야! 같이 플레이하자:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "이거 정말 멋진 게임이야! 같이 플레이하자:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} 방금 몇 번 돌려줬:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} 동전 몇 개 줬어:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "나는 방금 새로운 왕국을 세웠다! 방문해 보세요:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "와! 나 방금 {0} 동전을 훔쳤어! 정말 멋지다:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "와! 나는 방금 또 다른 왕국을 공격했다! 정말 멋지:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "공유하기", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "초대", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "보내세요", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} 방금 카드 줬:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "서버에 연결에 실패했는데, 다시 시도해보시나요?", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "서버에 연결되지 않았습니다.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "서버 연결이 끊겼습니다.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "성공", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "구매 실패", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "리소스 로드에 실패 {0}. 다시 시도할까요?", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} 년", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} 개월", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} 일", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} 시간", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} 분", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} 초", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": "{0}년 전", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": "{0}모 전", // 【未找到预制】-【脚本或动态使用】
  "PastDay": "{0}전", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": "{0}시간 전", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": "{0}년 전", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": "{0}전", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "지금", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}y", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}모", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "지금", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "연극", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "게스트", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "몇 가지 업데이트가 있습니다.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "로딩", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "게스트로 로그인하기", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": " Apple로 로그인하세요 ", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": " Facebook로 로그인하세요 ", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": " Google Play로 로그인하세요 ", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "코인", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "스핀", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "방패", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "카드", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "나무 상자", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "은 상자", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "황금 상자", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "무료 가슴!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "항목", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "항목", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "캐논볼", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "보내세요", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "자동차", // 【slot】-【New Label】
  "ToRaidUserBet": "WIN X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "모든 이기기 X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "BET", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "완전", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} 스핀", // 【未找到预制】-【脚本或动态使用】
  "Shield": "방패", // 【未找到预制】-【脚本或动态使用】
  "Attack": "공격", // 【未找到预制】-【脚本或动态使用】
  "Spins": "스핀+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "레이드", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "롤리", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. 월 구독 가능\n     로그인 보상은 모든\n     한 달에 7일.\n2. 월간 로그인 보상은\n     다음 달에 새로고침하세요.\n3. 주간 요금을 받을 수 있습니다\n     로그인 보상 매일\n     일주일 후에.\n4. 주간 로그인 보상\n     다음 주에 다시 시작하세요.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "영상을 보고 동전을 받으세요", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "프리 스핀", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": " {0}스핀 ", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "자유 스핀\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "10배는 더 좋아!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "수집", // 【dailyBonus】-【text】
  "DailyBonusLevel": "레벨 {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "처음에는 최소 2,500만 코인이 필요했어요!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "구매", // 【btnBuild】-【New Label】
  "BuildButtonFix": "수정", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "동전이 다 떨어졌나요?", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "스핀이 다 떨어졌나요?", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} 스핀", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "아니면 {0} 스핀을 기다려야 {1}", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "{0} 회전 {1} 기다려", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\n더 보기", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "메뉴", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "연극", // 【MenuWindow】-【name】
  "menu_1_village": "왕국", // 【MenuWindow】-【name】
  "menu_2_buy": "코인/스핀 구매", // 【MenuWindow】-【name】
  "menu_3_daily": "일일 보너스", // 【MenuWindow】-【name】
  "menu_4_shop": "킹덤 이볼브", // 【MenuWindow】-【name】
  "menu_5_news": "메시지", // 【MenuWindow】-【name】
  "menu_6_gifts": "선물", // 【MenuWindow】-【name】
  "menu_7_card": "카드", // 【MenuWindow】-【name】
  "menu_8_map": "지도", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "리더보드", // 【MenuWindow】-【name】
  "menu_10_invite": "초대", // 【MenuWindow】-【name】
  "menu_11_setting": "설정", // 【MenuWindow】-【name】
  "setting_title": "설정", // 【SettingWindow】-【New Label】
  "setting_sound": "사운드", // 【SettingWindow】-【New Label】
  "setting_music": "음악", // 【SettingWindow】-【New Label】
  "setting_notifications": "알림", // 【SettingWindow】-【title】
  "setting_raid": "습격과 공격", // 【SettingWindow】-【New Label】
  "setting_general": "일반", // 【SettingWindow】-【New Label】
  "setting_language": "언어", // 【SettingWindow】-【title】
  "setting_english": "영어", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "우리를 좋아하고 놓치지 마세요\n놀라운 행사와 선물", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "예를 들어", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "튜토리얼", // 【SettingWindow】-【New Label】
  "setting_support": "지원", // 【SettingWindow】-【New Label】
  "setting_privacy": "이용 약관 및 개인정보 보호", // 【SettingWindow】-【New Label】
  "setting_terms": "이용 약관", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "문의해 주세요", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "로그아웃", // 【SettingWindow】-【Txt】
  "setting_change": "변화", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "캐시 삭제", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "개인정보 보호 설정", // 【SettingWindow】-【New Label】
  "setting_language_title": "언어", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "영어", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "중국어", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "에스파뇰", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "독일어", // 【SettingLanguageWindow】-【label】
  "invite_title": "더 많은 회전을 원하시나요?", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>친구를 초대하고</color>\n<color=#ff99f9><outline color=#471f01 width=3>{0} 무료 스핀</outline></color><color=#f1edff>을 받으세요. 친구가\n왕국 2를 잠금 해제할 때마다 지급됩니다!</color></outline> ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>친구를 초대하고</color>\n<color=#ff99f9><outline color=#471f01 width=3>{0} 무료 스핀</outline></color><color=#f1edff>을 받으세요. 친구가 게임에 들어올 때마다 지급됩니다!</color></outline> ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "초대", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* 친구 끝나면 보상 받을 거야\nFacebook를 통해 연결됩니다", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "Facebook와 연결해", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "연결", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "저희는 여러분을 대신해 게시하지 않을 것입니다", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "로그인하고 무료 스핀 받으세요", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "확실해?", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "손님들은 친구들과 함께 플레이할 수 없습니다", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "게스트로 플레이하기", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "친구들", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "국가", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "글로벌", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "선물", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "프리 스핀", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "무료 코인", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "카드", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "초대", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "보내세요", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "콜렉트", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "모두 수령 / 보내기", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "모두 수집하기", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "친구 초대하기", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "무료 스핀 받기", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "일일 스핀 수집 {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "일일 수집 코인 {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "선물 무료 스핀", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": " {0} 회전 보내", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "선물 무료 코인", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "동전 {0} 보내", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "카드 보내기\n친구들에게", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "카드 보내줄게요", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "이 카드를 받으려면 왕국 {0}에 도달해야 합니다", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "상점", // 【ShopWindow】-【title_label】
  "ShopSpins": "스핀", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "코인", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "상자", // 【ShopWindow】-【New Label】
  "ShopTreats": "간식", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} 스핀", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}% 더", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": "{0}h 활성화", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "코인 샵", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "레벨 {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\n더 보기", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "매각", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "왕국 {0}에서 상자 잠금 해제 ", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "간식 해제 시 왕국 {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "인기", // 【ShopWindow】-【New Label】
  "ShopBestValue": "최고의 가치", // 【ShopWindow】-【New Label】
  "village_news_title": "메시지", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 왕국을 공격했</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 왕국을 공격하지 못했</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 합류Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 {1}을 훔치지 못했</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "왕국", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "우편", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>만료 </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "만료 {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "새로운 왕국들은\n곧 공개됩니다", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "복수!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "친구를 공격해!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "랜덤", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "복수", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "공격", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "영상을 보고 다음을 얻어", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} 스핀", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} 코인", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "시청", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "킹덤 컴플렉트!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "다음", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "친구 보상", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} 새로운 왕국을 열었어! 너는\n{1} 프리 스핀", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0} 게임에 합류했어요! 너는\n{1} 프리 스핀", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "아이템을 레벨업하면 별 하나 얻고,\n\n25개의 별을 모으면 다음 왕국을 잠금 해제할 수 있습니다.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "동전이 부족하잖아...\n\n아래로 스와이프하면 더 많은 코인을 얻을 수 있습니다.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "슬롯머신을 사용해 돌리고, 공격하며, 다른 사람들을 습격하세요.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "다른 플레이어의 왕국을 공격해 동전을 얻으세요.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "방패는 왕국을 공격으로부터 보호해 줍니다.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "왕의 왕국을 습격해 동전을 훔쳐라!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "이분은 왕이십니다\n그를 습격하자!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "당신의 첫 번째 왕국", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "환영합니다, 친구!\n\n버튼을 눌러 작업을 시작하세요.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "목표", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "성공!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "보상:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200회 회전!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20회 회전!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "100만 코인!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "진행 상황을 저장하세요!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "친구들과 함께 놀아라!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "오토 스핀", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "버튼을 누르고 있으면 시작하세요", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "시도해 보세요!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "깜짝 제안", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "남은 시간", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} 코인", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} 스핀", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "판매 기간이 {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>{0}번 공격해서 얻으세요\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>더 많은 바를 완료할수록 보상</color></outline><outline color=#b74800 width=2><color=#fff000>더 커집니다!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "최종 바 상품:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} 코인!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "더 높은 베팅을 하고 더 빨리 받으세요!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "알겠어!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "끝나는 {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>습격 {0} 번 해야 얻을 수 있습니다\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "완료하면 보상을 받을 수 있습니다!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "공격", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "공격 차단", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "습격", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "훌륭한 습격", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "3개의 심볼을 입력하세요", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>보상을 받았어요\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "카드\n소장품", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "완성됨", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "잠금 해제 정보는\n왕국 {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* 중복 카드를 탭해 친구에게 보내세요", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- 세트 완료 -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "세트를 완성해 승리하세요", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "물어보세요", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "보내세요", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "친구에게 부탁할 수 없어", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "이 카드는 금색이라 친구에게 부탁할 수 없어요", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "친구에게는 보낼 수 없습니다", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "이 카드는 금색이며, 친구에게 보낼 수 없습니다", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "하루 보낼 수 있는 카드 한도에 도달하셨습니다", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "카드를 보내려면 여러 장이 필요합니다", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "멋지다!", // 【CardCollectWindow】-【title】
  "CardCollectDes": "카드 {0}\n앨범에 추가되었습니다", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "한번 확인해 보세요", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "카드 보내기", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "친구 한 명을 선택하세요!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "셀렉트 카드", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "카드 보내기", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "최대 {0} 장의 카드를 선택하세요!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "선택한 카드:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "카드가 성공적으로 전송되었습니다!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "카드 정보", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "상자를 통해 카드를 수집하세요", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "상점에서 상자도 구매할 수 있습니다", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "상자는 레이드 중이나 새로운 왕국을 해금할 때 찾을 수 있습니다", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "같은 카드를 2장 이상 소유하면 친구들에게 선물로 보낼 수 있습니다", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "카드를 탭해서 선물하세요", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "친구들에게 잃어버린 카드에 대해 물어볼 수도 있습니다", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "하루에 최대 5장까지 카드를 보낼 수 있습니다", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "별은 카드 희귀도를 나타냅니다", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "새로 수집한 카드의 희귀도 별은 1개를 줍니다", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "카드 세트를 완성하고 놀라운 보상을 받으세요!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "공통", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "희귀", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "나무 상자", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "은상자", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "황금 상자", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "높은 확률:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "신규", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>더 많은 <color=#fff000>코인을 얻기 위해 카드를 수집하고</color><color=#77e7ff>스핀을</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>카드를 수집해 더 많은 <color=#b85b00>코인을 얻</color> 스핀<color=#0073d4></color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "친구 이름 검색", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "친구 없음", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang가 당신에게 코인과 스핀을 선물했습니다!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "퀘스트 센터", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "작업은 새로운 하루에 새로고침됩니다. 창문을 다시 열어 주세요.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "일일", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "초대", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "징후", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8일", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15일", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22일", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28일", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "1일차", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "2일차", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "3일차", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "4일차", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "5일차", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "6일차", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "7일차", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "간판", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "서명됨", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "메인 퀘스트: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "골: {0}\n보상: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "콜렉트", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "가세요", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": " {0}새로고침 ", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "활동 센터", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "남은 시간: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "끝음: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "활동은 종료되었습니다", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "퀘스트", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "활동", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "당신은 풀 스핀을 가지고 있습니다!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "우리는 충분히 돌려서 더 많은 코인을 얻을 수 있습니다!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "일일 보너스가 지금 이용 가능합니다!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "매일 Wheel of Fortune을 하러 오세요!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "복수하자!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "누군가 네 왕국을 침략했어!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "활동은 끝납니다!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} 한 시간 후에 끝나요!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "오랜만이네요!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "새로운 이벤트가 많이 생겼습니다. 그리고 큰 선물도 준비했어요!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "나랑 놀자!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "돌아와! 큰 선물을 준비했어!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "새로운 업데이트", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "인앱 구매 기능을 수정하고 새로운 이벤트도 추가했습니다.\n다른 모든 플레이어는 새 버전을 다운로드하고 플레이했습니다. 모든 데이터가 새 버전으로 전송되었습니다.\n감사합니다.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "업데이트", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "아니요, 괜찮아요", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "사랑해 Coin Gang?", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "별을 탭하면 매장에서 평가를 받으세요.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "제출", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "지금은 안 돼", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "자원 로드 실패. 다시 시도할까요?", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "가!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "어떤 구매든", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "추가 보상을 받으세요!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "지금 구매하세요!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": " Coin Gang에 오신 것을 환영합니다!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>우리는 준비했어\n<color=#ffe62b>큰 선물</c> 너한~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "업그레이드", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "선택", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "레이드 보상 증가", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● 보상 증가: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "공격 보상 증가", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● 보상 증가: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "공격으로부터 보호합니다", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● 보호 확률: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "습격으로부터의 보호", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● 보호 확률: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● 다음 단계: {0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>더 많은 <color=#ffe615>코인을 얻기 위해 하인을 고용하세요</color><color=#0ce4fe>스핀</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>더 많은 <color=#e67b07>코인을 얻기 위해 하인을 고용</color><color=#006fd7>스핀</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "업그레이드:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "각 슬롯머신은 스핀 = 1 서번트 EXP. 포션을 사용해 더 많은 서번트 EXP을 얻을 수 있습니다. 서번트 EXP 바가 가득 차면 업그레이드 버튼을 눌러 서번트를 업그레이드하세요. 서번트 업그레이드마다 게임 별이 올라갑니다.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "기술:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "서번트의 스킬은 레벨 업그레이드가 올라갈 때마다 향상됩니다", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "활성화:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "하인에게 먹여서 활성화하세요. 회전과 건설을 하면서 서번트 음식을 얻으세요.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "스핀으로 승리할 수 있습니다.", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "추가 {0}", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "선물이 있어!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "앵무새 피터가 무작위 선물을 가져다줄 거예요!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "피터가 올 때 선물을 받으려면 그냥 탭하세요!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "방패를 무료로 얻어!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "밥 줘!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "무료", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "각 거래를 통해 더 많은 정보를 드러내세요", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "이전 딜을 구매하면 잠금 해제", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "베팅 한도 증가", // 【slot】-【Label - Msg】
  "SlotBetSuper": "슈퍼", // 【slot】-【New Label】
  "I18N_BUY_NOW": "지금 구매", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": " 코인과 스핀<color=#ffffff>최대 20% 더</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>최대 20% 더 많은 코인과 회전</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>모은 모든 것을 곱하려면 더 높은 베팅을 하세요! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>모은 모든 것을 곱하기 위해 더 높은 베팅을 하세요! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "조커 카드는 한정판 카드를 대체할 수 있습니다.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "코인 갱을 즐기고 있습니다", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "여기에 텍스트를 입력하세요...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>완성한 카드 세트마다 <color=#ffffff>{0}% 추가 보상</color>을 받으세요!</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "그룹 가입", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "저희 가입하세요", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>이 상자에서 카드를 꺼내! 이 상자들은 이벤트 기간에만 사용할 수 있습니다! 이 특별한 상자들은 상점이나 다른 이벤트에서 얻을 수 있습니다.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>한정 카드 세트</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "가!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>쿠폰을 사용해 팩을 구매하고 100% 더 많은 코인, 상자, 스핀을 받을 수 있습니다!</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "삭제", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "계정 삭제를 확인하려면 \"삭제\"를 입력하세요!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "최신 소식은 공식 계정을 팔로우하세요", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "친구의 초대 코드를 입력하면 보상을 받을 수 있습니다!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "초대 코드를 확인해", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "초대 코드", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "빅팩 하나 사면 두 개 공짜로 드립니다!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "도와주세요", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "오늘 한정 시간 과제를 완료하면 더 높은 포인트 보상 과제를 잠금 해제하세요!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "활성화", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "레벨 매수", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "수신", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "무료", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "고개", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "스테이지 {0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "레벨: 최대치", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "레벨업", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "페이즈 보너스", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "건물 업그레이드", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*한 팩만 구매할 수 있습니다.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>조커 카드</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "성공", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "계속 누르기", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "일일 보상", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "특징 설명", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "모래 옆에 합류하면 보상을 잠금 해제할 수 있습니다!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3일 무료 체험, 그 후에는 월 16.99달러", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "건물 이름", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "보상 미리보기", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "최종 보상", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "수집", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "구매에 어려움이 있으신가요?", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "지원 담당자에게 연락하세요", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "오늘 영상을 너무 많이 봤어요", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "달러", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "랜덤 카드", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "골든 카드", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "마법 상자", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "하인", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "RAID 보호", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "얼음", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "공", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "환영합니다!", // 【dailyBonus】-【Text】
  "menu_12_sign": "보상 달력", // 【MenuWindow】-【name】
  "setting_lowbattery": "저전력 모드", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "저전력 모드를 켜면 전력 소비는 줄지만 성능은 떨어집니다.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "구매 복원", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "크라운 VIP 쇼", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "Coin Gangster플레이하기 위해,\n확인해 주세요", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    계속하면 Happy Donut이 <color=#ffffff><u><on click='privacyHandler'>개인정보 처리방침</on></u></color>에 따라 내 데이터를 저장하고 처리할 수 있음을 인정합니다.\n\n나는 <color=#ffffff><u><on click='termHandler'>이용 약관</on></u></color>을 읽고 동의했으며, 해당 약관은 계약을 성립시키고 집단 소송 포기 및 중재 조항을 포함합니다.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "프랑스", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "전통 중국어", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "일본어", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "이탈리아노", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "포르투게스", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*10분 후 갱신", // 【LeaderboardWindow】-【note】
  "ShopShield": "슈퍼\n방패", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "실버 실즈", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "골든 쉴즈", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "왕국을 지키세요", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "예방 방법:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>공격 및 <color=#288bdf>습격</color> (독점)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "슈퍼 쉴드는 오랜 시간 동안 왕국을 공격과 습격으로부터 보호합니다.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 왕국을 공격했</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 왕국을 공격하지 못했</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 {1} 도둑맞았</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> 네 {1}을 빼앗는 데 실패했</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "탭 투 오픈", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> 친구에서 삭제했</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>{0} <img src='{1}_s'/> 모으면 당첨됩니다!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>더 높은 베팅을 하면 더 많은 <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff><img src='{0}_s'/> 모으면 리더보드를 오르세요!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>모은 모든 <img src='{0}_s'/>을 곱하기 위해 더 높은 베팅을 하세요!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "수집을 위해 플레이를 시작하세요", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2><img src='{0}_s' /> 가입하게</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "승자!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "여러분이 받은 상품은 다음과 같습니다:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "토너먼트는 종료되었습니다", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "이번에는 이기지 못했지만, 그래도 상은 받을 수 있어!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "모은 선물", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "리치", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "그랜드 프라이즈", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "적어도 한 명은:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "거래 가능", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "가서 교환하세요!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "이제 거래가 가능합니다!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "카드 트레이딩 그룹", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "어떤 카드가 빠졌는지 게시하세요", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "중복 카드 교환", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "멋진 보상을 받으세요!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "새로운 친구 사귀기", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "쿠폰 있어!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>쿠폰으로 팩을 구매하고 <color=#fefe28>{0}% 더 많은 코인</color>, 상자, <color=#64ebff>스핀</color>을 받으세요!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*신규 사용자, 단 한 번만!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "스핀", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "보상", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "슬롯 활동에서 추가 스핀과 코인을 얻으세요", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "일일 보상", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "회수 제한", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF><color=#fed400>빨간 이름</color>과 <color=#fed400>왕관</color>으로 빛나는 외형!</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "연도", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "월간", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "한 주", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP 정해진 가격에 구독을 제공하며 매일 스핀, 음식, 카드를 제공합니다. 이것은 <color=#203d9b><u><on click=\"handle\" param=\"sub\">자동 갱신 구독</on></u></c>입니다. 결제는 확인 시 휴대폰 계정으로 결제됩니다. <color=#5e2802>구독은 기간 종료 24시간 전에 종료되지 않는 한 갱신되며, 갱신 시 계정이 청구됩니다.</c> 계정 설정에서 꺼도 됩니다. 무료 체험 기간 중 사용하지 않은 부분은 구독 구매 시 해당 시 상실됩니다. <color=#203d9b><u><on click=\"handle\" param=\"pri\">개인정보처리방침 및 이용 약관</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "뜨거워", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "무료로 시작하세요", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3일 무료 체험, 그 다음에는 한 달에 {0} 번", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "이걸 매일 받아!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "모두 가져오기", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "VIP 잠금 해제하면 누적된 모든 보너스를 받을 수 있습니다", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "머니뱅크", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "잠금 해제\n레벨 {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "교환\n레벨 {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "교환", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "열기 위한 레벨 {0} 잠금 해제", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "교환", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "달러 다 떨어졌어!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "무료", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "영상 보기", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "기회를 얻어", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>30</color></size>배 추가 보너스\n총 <size=46><color=#7ee0f4>5000+</color></size> 스핀 획득!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "레벨 패스를 구매하면 많은 스핀 보상을 받을 수 있습니다!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "킹덤 {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "조커 카드", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "카드를 골라, 아무 카드든!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "세트\n상금", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "세트 완성", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "제가 갖고 있지 않은 유일한 쇼 카드들", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "내가 가져갈게!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "만료", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "네 조커 카드가 기다리고 있어.\n시간이 다 되기 전에 원하는 카드를 선택하세요!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "지금 선택하세요", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": " {0} 카드를 선택했죠", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "완전 세트", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*이벤트 기간 동안 완성한 카드 세트에 대해 보상을 받게 됩니다", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": " {0} 상자 중 1개에는", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) 확실해!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "주 {0}회에서{1} 회 구매 가능", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "중복 카드를 교환하세요\n흥미진진하네요", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "잠금 해제 시\n킹덤 {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "팀", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "친구들", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "창조", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "둘러보기", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "취소", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "팀 이름:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "배지", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "설명:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "팀 유형:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "필수 별:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "편집자", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "오픈", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "폐쇄", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "떠나세요", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "가입하세요", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "팀 보기", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "방문", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "제거", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "친구 초대하기", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "최고의 팀 추천", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "팀 배지를 선택하세요", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "도와주세요", // 【HelpWindow】-【title_label】
  "Guild_Request": "요청", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "팀원에게 요청할 카드를 선택하세요", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "요청 카드", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} 팀을 떠났어!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} 팀에 합류했어!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "회원:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "부족해 ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "편지만 출품할 수 있습니다!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "팀 이름은 최소 3개의 캐릭터여야 합니다!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} 카드 x1을 줍니다", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "친구 추가", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "계정 및 데이터 삭제", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "경고", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "계정과 모든 데이터를 삭제하려고 합니다.\n  삭제 후에는 복원할 수 없습니다.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "친구들", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "계정 삭제", // 【MenuWindow】-【name】
  "setting_delete": "계정 삭제", // 【SettingWindow】-【New Label】
  "BindTitle": "계정", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "스위치 계정", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "계정을 연결한 후,\n다른 기기에서도 플레이할 수 있습니다", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "이 소셜 미디어 계정은 연결되어 있습니다\n 게임 계정으로.\n 다시 전환할 수 있습니다\n 당신의 원래 게임 계정\n 또는 저희에게 연락해서 연결 해제를 요청하세요.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "[계정 전환]을 눌러 로그인하세요", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "저희에게 연락하여 구속 해제 문의", // 【AccountHintWindow】-【tip】
  "ShopDaily": "일일 스페셜", // 【ShopWindow】-【subtitle】
  "ShopGem": "젬", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "항목", // 【ShopWindow】-【New Label】
  "ShopHot": "뜨거워", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "조커 상자의 양\n매주 한정 세일", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "그를 새 관리자로 임명할까?", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>쿠폰</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}더 많은 스핀</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> %</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>내 할인</color></outline>\n<outline color=#6a01ba width=1><color=#9d2cf4>추가</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> 스핀 또는 코인</color></outline>\n<outline color=#6a01ba width=1><color=#9d2cf4>남은 시간: {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "쿠폰 있어!\n 추가 {0}\n스핀 또는 코인", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "지원", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>팀 전체가 함께하는 한<img src='bossyucha'/>\n 함께 수집하면\n '팀 보물상자'!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "얼티밋 상금", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "깊은 곳의 보물을 위해,\n팀 전체가 바다 괴물을 물리쳐야 해!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "전설에 따르면 광활한 바다는\n끝없는 보물을 숨기고 있으며,\n그것들을 얻으려면 반드시 뛰어들어야 합니다\n끝없는 심연과 패배\n심연을 지키는 괴물들.\n팀과 함께 작살을 모으세요\n그리고 모든 괴물을 물리쳐라!\n1. 작살을 얻으려면 공격과 습격을 해야 합니다.\n2. 작살을 사용해 몬스터를 쓰러뜨린 후, 몬스터를 탭하면 보상을 받는다.\n3. 몬스터에게 높은 피해를 입히면 리더보드에 진입할 수 있습니다.\n4. 몬스터에게 가하는 피해량이 높을수록 보상도 더 커집니다.\n5. 리더보드 보상은 이벤트 후 우편함으로 발송됩니다.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "당신은 다음과 같은 상황을 가지고 있습니다:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "카드 거래는 게임 진행 상황을 줄이지 않습니다", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "카드를 선택해", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "나를 위해 카드를 선택해", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "무역", // 【CardTradeWindow】-【Label】
  "JackT_depart": "출발", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "대상 상금:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "상금 풀", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "같이 놀면서 보상을 받자!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "포기하면 모든 상을 잃게 돼!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "두 레벨만 더 보너스 레벨이 될 거예요!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "그만둬", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "부활", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "정말 떠나고 싶은 거야?", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "아무것도 없이 떠나!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "팁", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "잭은 여행을 떠나기 위해 비행기 표를 구하다가 경찰에게 쫓기게 된다. 경찰을 피하고 보상을 받을 수 있는 카드를 선택하세요.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "상금은 상금에 추가됩니다. 플레이어는 언제든지 게임을 종료할 수 있고 현재 보상을 받을 수 있습니다.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "경찰에 체포된 후에는 광고를 보거나 비용을 지불하여 부활할 수 있습니다. 보상 없이 게임을 그만둘 수도 있습니다.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "부활을 위해 비용을 지불하고 항공권과 슈퍼 리워드 혜택을 받으세요.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "보너스 레벨은 게임에서 미리 공개됩니다.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "계속", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "모든 보상을 받아라!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "타임아웃!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "가기", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "보상을 받으세요!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "현재 팀을 떠나 새 팀에 합류해야 합니다.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "리더보드", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "계급", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "팀에 가입하고, 친구를 사귀고, 팀원들과 함께 더 많은 스핀과 카드를 받으세요!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "지금 가입하세요", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff></color><color=#FFBC06>{1}</color><color=#ffffff> 세트를 완성했어요! 축하해요!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff></color><color=#FFBC06>{1}</color><color=#ffffff>를 샀어요! 지금은 아주 부자네요!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff></color><color=#FFBC06>{1}</color><color=#ffffff>를 샀어요. 그들에게 축복을 베풀자!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff></color><color=#FFBC06>{1}</color><color=#ffffff>있어! 축하해요!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>놀라워!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> 모든 지도를 막 다 끝냈어요!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "레벨업", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "과제 포인트", // 【脚本】-【game/items/Content.js】
  "story1": "단계 완료", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "클릭하여 계속하세요.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "지도 1 건물 1 챕터 제목", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "지도 1 건물 2 챕터 제목", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "지도 1 건물 3 챕터 제목", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "지도 1 건물 4 챕터 제목", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "지도 1 건물 5 챕터 제목", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "선수 정보", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "아바타", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "아바타 프레임", // 【AvatarWindow】-【New Label】
  "Button_Save": "저장", // 【AvatarWindow】-【New Label】
  "EditNickName": "별명 수정하기", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "레벨 {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>조각을 탭하면 여기에서 자세한 정보를 볼 수 있습니다</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "생성됨", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "업그레이드 후 추가 발전", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "생성할 수 있습니다", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "요리할 줄 알아요", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "저장", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "추가", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "오픈 셀렉션 박스", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "다음 보상 중 하나를 선택하세요", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "생산 방법", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "조리기구를 두드려 완성된 제품을 모으세요.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "힌트", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "이미 연결된 계정이 있다면,\n 그 계정에 로그인할 수 있습니다\n 게임을 계속하기 위해서였다.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "이 계정에는 게임 데이터가 포함되어 있습니다", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "결속/전환 실패", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "현재 계좌는 이미 이 게임 데이터에 묶여 있습니다", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "환영합니다", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "이 조각들을 합치세요", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "생성기를 탭하세요", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "주문 완료", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "터뜨릴까요?", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "깨기", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "취소", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "남음", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "새로고침 간격", // 【ShopWindow】-【New Label】
  "ShopOver": "매진", // 【ShopWindow】-【price】
  "ShopFree": "무료", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "완료", // 【mergeUI】-【New Label】
  "ShopSpin": "에너지 구매", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "이 카드는 황금색이에요.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "일일 카드 발송 한도에 도달했습니다.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
