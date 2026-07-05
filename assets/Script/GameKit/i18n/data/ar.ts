const C8235=String.fromCharCode(8235); const C8236=String.fromCharCode(8236); const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "ابدأ", // 【未找到预制】-【脚本或动态使用】
  "Score": "النقاط", // 【未找到预制】-【脚本或动态使用】
  "Restart": "إعادة التشغيل", // 【未找到预制】-【脚本或动态使用】
  "Loading": "جارٍ التحميل", // 【DownloadingWindow】-【New Label】
  "Cancel": "إلغاء", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "تأكيد", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "إعادة المحاولة", // 【未找到预制】-【脚本或动态使用】
  "Back": "رجوع", // 【未找到预制】-【脚本或动态使用】
  "Accept": "قبول", // 【未找到预制】-【脚本或动态使用】
  "Level": "المستوى", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "الترتيب", // 【未找到预制】-【脚本或动态使用】
  "Rank": "الترتيب", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "النقاط", // 【未找到预制】-【脚本或动态使用】
  "OK": "حسنا", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "نعم", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "لا", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "نعم", // 【未找到预制】-【脚本或动态使用】
  "No": "لا", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "اجمع", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "مبروك!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "و", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "إعادة المحاولة", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "إيقاف", // 【未找到预制】-【脚本或动态使用】
  "MORE": "المزيد", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "هذه الميزة غير متوفرة بعد.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "اللاعب", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "الدفع معطل!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "الدفع مفعل فقط على أندرويد!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "الدفع معطل على iOS!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "عذرا، وظيفة الدفع حاليا غير متوافقة مع نظامك. يرجى إدخال Coin Gang عبر Instant Games على الكمبيوتر لإكمال عملية الشراء.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "شكرا على شرائك!", // 【PaySuccessWindow】-【label】
  "PayFail": "فشل الشراء!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "شرائك قيد الانتظار! بعد إكمال الدفع، أعد تشغيل اللعبة لاستلام أغراضك.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}٪\nإيقاف", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "الفيديو غير جاهز!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "حاجة للوصول", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "نحتاج معلوماتك", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "السماح بالوصول", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "هذه الوظيفة حاليا غير متوافقة مع إصدار العميل الخاص بك. يرجى تحديث WeChat.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "مرحبا، هذه لعبة رائعة حقا! لنلعب معا:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "مرحبا، هذه لعبة رائعة حقا! لنلعب معا:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} أعطاك بعض الحركات:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} أعطيتك بعض العملات:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "لقد بنيت مملكة جديدة للتو! تعال وقم بزيارة:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "واو! لقد سرقت {0} العملات! رائع جدا:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "واو! لقد هاجمت مملكة أخرى للتو! رائع جدا:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "شارك", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "دعوة", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "أرسلني", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} أعطاك بطاقات:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "فشل الاتصال بالخادم، هل أحاول مرة أخرى؟", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "فشل الاتصال بالخادم.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "فقدت الاتصال بالخادم.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "النجاح", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "فشل الشراء", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "فشل في تحميل {0}الموارد. أحاول مرة أخرى؟", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} سنة", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} شهور", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} أيام", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} ساعات", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} دقيقة", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} ثانية", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": "{0}منذ", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": " منذ{0}أشهر", // 【未找到预制】-【脚本或动态使用】
  "PastDay": "{0}قبل", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": " منذ{0}ساعة", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": " منذ{0}دقيقة", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": " منذ{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "الآن", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}y", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}مو", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}د", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}ح", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}م", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}s", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "الآن", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "اللعب", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "ضيف", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "هناك بعض التحديثات.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "التحميل", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "تسجيل الدخول مع الضيف", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "سجل الدخول عبر Apple", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "سجل الدخول عبر Facebook", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "سجل الدخول عبر Google Play", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "العملات", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "اللفات", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "درع", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "بطاقة", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "صندوق خشبي", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "صندوق فضي", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "صندوق ذهبي", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "صدر حر!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "العناصر", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "العنصر", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "كانونبول", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "أرسلني", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} يدور في {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "أوتو", // 【slot】-【New Label】
  "ToRaidUserBet": "WIN X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "الجميع يفوز X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "BET", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "كامل", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} الدوران", // 【未找到预制】-【脚本或动态使用】
  "Shield": "درع", // 【未找到预制】-【脚本或动态使用】
  "Attack": "هجوم", // 【未找到预制】-【脚本或动态使用】
  "Spins": "لفات+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "غارة", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "هههه", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. يمكنك الحصول عليها شهريا\n     مكافآت تسجيل الدخول في كل\n     7 أيام في الشهر.\n2. مكافآت تسجيل الدخول الشهرية ستستم\n     تحديث الشهر القادم.\n3. يمكنك الحصول على أسبوع\n     مكافآت تسجيل الدخول يوميا\n     خلال أسبوع.\n4. مكافآت تسجيل الدخول الأسبوعية ستمنح\n     تحديث الأسبوع القادم.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "شاهد فيديو واجمع العملات", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "الدوران الحر", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "استدروا {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "الدوران الحر في\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "أفضل بعشر مرات!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "جمع", // 【dailyBonus】-【text】
  "DailyBonusLevel": "المستوى {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "على الأقل 25 مليون عملة في المرة الأولى!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "اشتر", // 【btnBuild】-【New Label】
  "BuildButtonFix": "الإصلاح", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "نفدت العملات؟", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "انتهت الدورانات؟", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} الدورانات", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "أو انتظر {1} لدورات {0} ", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "انتظر {1} {0} الدوران", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}٪\nالمزيد", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "القائمة", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "اللعب", // 【MenuWindow】-【name】
  "menu_1_village": "المملكة", // 【MenuWindow】-【name】
  "menu_2_buy": "شراء العملات/الدورانات", // 【MenuWindow】-【name】
  "menu_3_daily": "المكافأة اليومية", // 【MenuWindow】-【name】
  "menu_4_shop": "تطور المملكة", // 【MenuWindow】-【name】
  "menu_5_news": "الرسالة", // 【MenuWindow】-【name】
  "menu_6_gifts": "الهدية", // 【MenuWindow】-【name】
  "menu_7_card": "بطاقة", // 【MenuWindow】-【name】
  "menu_8_map": "الخريطة", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "لوحة المتصدرين", // 【MenuWindow】-【name】
  "menu_10_invite": "دعوة", // 【MenuWindow】-【name】
  "menu_11_setting": "الإعدادات", // 【MenuWindow】-【name】
  "setting_title": "الإعدادات", // 【SettingWindow】-【New Label】
  "setting_sound": "الصوت", // 【SettingWindow】-【New Label】
  "setting_music": "الموسيقى", // 【SettingWindow】-【New Label】
  "setting_notifications": "الإشعارات", // 【SettingWindow】-【title】
  "setting_raid": "غارة وهجوم", // 【SettingWindow】-【New Label】
  "setting_general": "عام", // 【SettingWindow】-【New Label】
  "setting_language": "اللغة", // 【SettingWindow】-【title】
  "setting_english": "الإنجليزية", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "أعجبك بنا ولا تفوت فرصا\nفعاليات وهدايا مذهلة", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "مثل", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "الدرس التعليمي", // 【SettingWindow】-【New Label】
  "setting_support": "الدعم", // 【SettingWindow】-【New Label】
  "setting_privacy": "الشروط والخصوصية", // 【SettingWindow】-【New Label】
  "setting_terms": "الشروط والأحكام", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "تواصل معنا", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "تسجيل الخروج", // 【SettingWindow】-【Txt】
  "setting_change": "التغيير", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "مسح الذاكرة المؤقتة", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "إعدادات الخصوصية", // 【SettingWindow】-【New Label】
  "setting_language_title": "اللغة", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "الإنجليزية", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "الصينية", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "الإسبانيول", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "دويتش", // 【SettingLanguageWindow】-【label】
  "invite_title": "هل تريد المزيد من الدورانات؟", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>ادع الأصدقاء واحصل على</color><color=#ff99f9><outline color=#471f01 width=3>{0} دورات مجانية</outline></color><color=#f1edff> لكل صديق يتم فتحها\nالمملكة 2!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>ادع الأصدقاء واحصل على</color><color=#ff99f9><outline color=#471f01 width=3>{0} دورات مجانية</outline></color><color=#f1edff> لكل صديق يدخل اللعبة!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "دعوة", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* ستحصل على مكافأة بعد صديقك\nيتصل عبر Facebook", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "تواصل مع Facebook", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "الاتصال", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "لن ننشر نيابة عنك", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "تسجيل الدخول والحصول على دورات مجانية", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "هل أنت متأكد؟", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "الضيوف لا يمكنهم اللعب مع الأصدقاء", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "العزف كضيف", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "الأصدقاء", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "كانتري", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "عالمي", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "الهدايا", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "الدورانات الحرة", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "العملات المجانية", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "البطاقات", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "دعوة", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "أرسلني", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "جمع", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "جمع / إرسال الجميع", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "جمع الجميع", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "ادع الأصدقاء", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "احصل على دورات مجانية", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "الدورات اليومية التي جمعت {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "العملات اليومية التي جمعت {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "دوران مجاني", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "أرسل لك {0} الدوران", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "عملات مجانية", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "أرسل لك {0} عملات", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "إرسال البطاقات\nلأصدقائك", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "أرسل لك بطاقة", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "يجب أن تصل إلى Kingdom {0} لجمع هذه البطاقة", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "المتجر", // 【ShopWindow】-【title_label】
  "ShopSpins": "اللفات", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "العملات", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "الصناديق", // 【ShopWindow】-【New Label】
  "ShopTreats": "الحلويات", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} سبينز", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}٪ أكثر", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": " تفعيل{0}ساعة", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "محل العملات", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "المستوى {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}٪\nالمزيد", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "البيع", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "فتح الصناديق في مملكة {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "مكافآت تفتح في مملكة {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "الشعبية", // 【ShopWindow】-【New Label】
  "ShopBestValue": "أفضل قيمة", // 【ShopWindow】-【New Label】
  "village_news_title": "الرسالة", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> هاجمت مملكتك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> فشلت في مهاجمة مملكتك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "سرق <outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> {1} منك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": " انضم<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": " فشلت<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> في سرقة {1} منك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "المملكة", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "البريد", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>انتهت صلاحيته في </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "انتهت صلاحيته في {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "الممالك الجديدة هي\nقريبا", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "الانتقام!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "هاجم صديقك!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "عشوائي", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "الانتقام", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "الهجوم", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "شاهد فيديو واحصل على", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} الدوران", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} عملات", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "شاهد", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "المملكة الكاملة!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "التالي", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "مكافأة الصديق", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} فتح مملكة جديدة! لديك\n{1} الدوران المجاني", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0} انضممت إلى اللعبة! لديك\n{1} الدوران المجاني", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "ارفع مستوى عنصر لتحصل على نجمة واحدة.\n\nاجمع 25 نجمة لفتح المملكة التالية.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "ليس لديك ما يكفي من العملات...\n\nاسحب للأسفل لكسب المزيد من العملات.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "استخدم ماكينة القمار للدوران والهجوم ومهاجمة الآخرين.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "هاجم ممالك لاعبين آخرين للحصول على العملات.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "الدروع ستحمي مملكتك من الهجمات.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "اقتحموا مملكة الملك وسرقوا عملاته!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "هذا هو الملك\nلننهب عليه!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "مملكتك الأولى", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "مرحبا بك يا صديقي!\n\nاضغط على الزر لبدء عملك.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "الهدف", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "نجاح!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "مكافآتك:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200 دورة!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20 لفة!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "مليون عملة!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "احتفظ بالتقدم!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "العب مع أصدقائك!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "الدوران الذاتي", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "اضغط على الزر لتبدأ", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "حاول!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "عرض مفاجئ", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "الوقت المتبقي", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} عملات", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} الدوران", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "وقت البيع المتبقي {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>هاجم {0} مرات للحصول على\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>كلما أكملت المزيد من المقاطع الموسيقية، زادت مكافآت</color></outline><outline color=#b74800 width=2><color=#fff000>!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "جائزة البار النهائية:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} عملات!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "راهن بسعر أعلى واحصل عليه أسرع!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "فهمت!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "ينتهي في {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>غارة {0} مرات للحصول عليها\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "أكمل للحصول على المكافآت!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "الهجوم", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "الهجوم تم صد", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "الغارة", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "غارة ممتازة", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "اضرب 3 رموز", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>لديك مكافآت\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "بطاقة\nالمجموعة", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "اكتمل", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "يفتح عند\nمملكة {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* اضغط على بطاقة مكررة لإرسالها إلى صديق", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- اكتمل الديكور -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "أكمل المجموعة للفوز", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "اسأل", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "أرسلني", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "لا يمكن أن تطلب ذلك من الأصدقاء", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "هذه البطاقة ذهبية، لا يمكن طلبها من الأصدقاء", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "لا يمكن إرساله للأصدقاء", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "هذه البطاقة ذهبية، لا يمكن إرسالها للأصدقاء", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "وصلت إلى الحد اليومي للبطاقات التي يمكنك إرسالها", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "تحتاج إلى أكثر من بطاقة واحدة لإرسالها", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "رائع!", // 【CardCollectWindow】-【title】
  "CardCollectDes": " {0}البطاقة \nتمت إضافتها إلى ألبومك", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "اطلع عليها", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "إرسال البطاقات", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "اختر صديقا واحدا!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "سيلكت كارد", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "إرسال البطاقات", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "اختر حتى {0} بطاقة!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "بطاقاتك المختارة:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "تم إرسال البطاقة بنجاح!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "معلومات البطاقات", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "اجمع البطاقات من خلال الصناديق", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "يمكنك أيضا شراء الصناديق من المتجر", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "يمكن العثور على الصناديق أثناء الغارات وعند فتح مملكة جديدة", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "امتلاك بطاقتين أو أكثر من نفس البطاقة يسمح لك بإرسالها كهدية لأصدقائك", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "انقر على البطاقة لإهداءها", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "يمكنك أيضا أن تطلب من الأصدقاء عن بطاقات مفقودة", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "يمكنك إرسال ما يصل إلى 5 بطاقات في يوم واحد", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "النجوم تشير إلى ندرة البطاقات", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "كل نجمة نادرة على بطاقة جديدة تمنحك نجمة واحدة", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "أكمل مجموعات البطاقات واحصل على مكافآت مذهلة!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "شائع", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "نادر", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "الصندوق الخشبي", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "الصندوق الفضي", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "الصندوق الذهبي", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "فرصة عالية ل:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "الجديد", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>جمع البطاقات للحصول على المزيد من <color=#fff000>العملات</color> و<color=#77e7ff>الدوران</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>جمع البطاقات للحصول على المزيد من <color=#b85b00>العملات</color> و<color=#0073d4>الدورانات</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "ابحث عن اسم الصديق", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "لا أصدقاء", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang أهدتك عملات ولف!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "مركز كويست", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "المهام تتجدد في يوم جديد. يرجى إعادة فتح النافذة.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "يوميا", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "دعوة", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "الإشارة", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8 أيام", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15 يوما", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22 يوما", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28 يوما", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "اليوم الأول", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "اليوم الثاني", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "اليوم الثالث", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "اليوم الرابع", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "اليوم الخامس", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "اليوم السادس", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "اليوم السابع", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "توقيع", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "تم التوقيع", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "المهمة الرئيسية: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "الهدف: {0}\nالمكافأة: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "جمع", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "انطلق", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": "تحديث في {0}", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "مركز النشاط", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "الوقت المتبقي: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "تنتهي في: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "انتهى النشاط", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "كويست", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "النشاط", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "لديك دورانات كاملة!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "لدينا ما يكفي من الدورات للعب وجمع المزيد من العملات!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "المكافأة اليومية متاحة الآن!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "تعال ولعب لعبة Wheel of Fortune يوميا!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "لننتقم منها!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "شخص ما غزا مملكتك!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "النشاط سينتهي!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} سينتهي خلال ساعة!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "لم أرك منذ زمن!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "هناك العديد من الأحداث الجديدة. وقد أعددنا لك هدية كبيرة!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "تعال والعب معي!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "ارجع! لقد أعددنا لك هدية كبيرة!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "تحديث جديد", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "قمنا بإصلاح خاصية الشراء داخل التطبيق وأضفنا المزيد من الأحداث الجديدة.\nجميع اللاعبين الآخرين قاموا بتحميل ولعب النسخة الجديدة. تم نقل جميع بياناتك إلى النسخة الجديدة.\nشكرا لك.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "تحديث", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "لا، شكرا", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "هل تحب Coin Gang؟", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "اضغط على نجمة لتقييمها في المتجر.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "التقديم", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "ليس الآن", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "فشل تحميل المورد. أحاول مرة أخرى؟", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "انطلق!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "قم بأي عملية شراء إلى", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "احصل على مكافآت إضافية!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "اشتر الآن!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "مرحبا بك في Coin Gang!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>لقد أعددنا\n<color=#ffe62b>هدية كبيرة</c> لك~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "الترقية", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "سيلكت", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "يزيد من مكافأة الغارات", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● يزيد المكافأة بمقابل: {0}٪", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "يزيد من مكافأة الهجمات", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● يزيد المكافأة بمقابل: {0}٪", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "يحمي من الهجمات", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● فرصة الحماية: {0}٪", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "الحماية من الغارات", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● فرصة الحماية: {0}٪", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● المستوى التالي: {0}٪ +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>استئجار خدم للحصول على المزيد من <color=#ffe615>العملات</color> و<color=#0ce4fe>الدوران</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>توظيف خدم للحصول على المزيد من العملات <color=#e67b07></color> و<color=#006fd7>الدوران</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "الترقية:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "كل دوران في ماكينة القمار = 1 خادم EXP. يمكنك استخدام الجرعات للحصول على المزيد من EXPالخدم. عندما يمتلئ شريط EXP الخدم، اضغط على زر الترقية لترقية خادمك. كل ترقية للخادم ستزيد من نجمة لعبتك.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "المهارة:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "تتحسن مهارة الخادم مع كل ترقية في المستوى", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "التفعيل:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "أطعم خادمك لتفعيله. احصل على طعام الخادم أثناء الغزل والبناء.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "الدوران للفوز حتى", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "لإضافة {0}", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "لدي هدية لك!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "ببغاء بيتر سيجلب لك هدية عشوائية!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "فقط اضغط على بيتر ليستلم الهدية عندما يأتي!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "احصل على درع مجاني!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "أطعمني الطعام!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "مجاني", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "خذ كل صفقة لتكشف المزيد", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "افتح اللعبة عن طريق شراء الصفقة السابقة", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "زيادة حد الرهان", // 【slot】-【Label - Msg】
  "SlotBetSuper": "رائع", // 【slot】-【New Label】
  "I18N_BUY_NOW": "اشتر الآن", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>حتى 20٪ المزيد من العملات والسبينات</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>حتى 20٪ زيادة في العملات والدورانات</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>تراهن بمبلغ أعلى لتمكب كل ما تجمعه! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>تراهن بمبلغ أعلى لتضربها في كل ما تجمعه! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "بطاقة الجوكر متاحة لتحل محل البطاقة المحدودة.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "الاستمتاع بعصابة العملات", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "أدخل النص هنا...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>تحصل على <color=#ffffff>{0}٪ مكافآت إضافية</color> عن أي مجموعة بطاقات تكملها!</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "انضم إلى المجموعة", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "انضم إلى فريقنا", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>أحضر البطاقات من هذه الصناديق! هذه الصناديق متوفرة فقط خلال الحدث! يمكنك الحصول على هذه الصناديق الخاصة في المتجر وفي فعاليات أخرى.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>مجموعات بطاقات محدودة الوقت</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "انطلق!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>استخدم القسائم لشراء الحزم والحصول على عملات وصناديق ودورات أكثر بنسبة 100٪!</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "حذف", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "أدخل \"حذف\" لتأكيد حذف حسابك!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "تابع الحساب الرسمي للحصول على آخر الأخبار", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "أدخل رمز دعوة صديقك لتحصل على مكافأة!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "تحقق من رمز الدعوة", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "رمز الدعوة", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "اشتر عبوة كبيرة واحدة، واحصل على اثنين مجانا!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "المساعدة", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "أكمل مهام اليوم المحدودة لفتح مهام مكافآت ذات نقاط عالية!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "تفعيل", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "مستوى الشراء", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "استلام", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "مجاني", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "تجاوز", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "{0}المرحلة /{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "المستوى: الحد الأقصى", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "ارتق في المستوى", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "مكافأة المرحلة", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "مباني الترقية", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*يمكنك شراء حزمة واحدة فقط.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>بطاقة جوكر</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "النجاح", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "اضغط للمتابعة", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "المكافآت اليومية", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "وصف المعالم", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "ادمجوا بجانب الرمل لفتح المكافآت!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3 أيام تجربة مجانية، ثم 16.99 دولار شهريا", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "اسم المبنى", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "معاينة المكافآت", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "المكافآت النهائية", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "المجموعة", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "هل تواجه مشاكل في الشراء؟", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "تواصل مع الدعم", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "شاهد الكثير من الفيديوهات اليوم", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "الدولارات", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "بطاقة عشوائية", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "البطاقة الذهبية", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "الصندوق السحري", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "الخادم", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "حماية من الخلف", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "آيس", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "بول", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "مرحبا بكم!", // 【dailyBonus】-【Text】
  "menu_12_sign": "تقويم المكافآت", // 【MenuWindow】-【name】
  "setting_lowbattery": "وضع الطاقة المنخفضة", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "تفعيل وضع الطاقة المنخفضة سيقلل من استهلاك الطاقة لكنه يقلل من الأداء.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "استعادة الشراء", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "شو VIP كراون", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "للعب Coin Gangster،\nيرجى التأكيد", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    بالمتابعة، أقر بأن Happy Donut قد تخزن بياناتي وتعالجها وفقًا لـ <color=#ffffff><u><on click='privacyHandler'>سياسة الخصوصية</on></u></color>.\n\nلقد قرأت وأوافق على <color=#ffffff><u><on click='termHandler'>الشروط والأحكام</on></u></color>، التي تنشئ عقدًا وتتضمن تنازلاً عن الدعاوى الجماعية وبند تحكيم.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "فرانسيس", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "الصينية التقليدية", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "ياباني", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "إيطاليانو", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "البرتغاليون", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*يتم التحديث خلال 10 دقائق", // 【LeaderboardWindow】-【note】
  "ShopShield": "سوبر\nالدرع", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "الدروع الفضية", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "الدرع الذهبي", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "احم مملكتك", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "الحماية من:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "هجمات <color=#874423>وغارات <color=#288bdf></color> (حصري)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "الدرع الخارق يحمي مملكتك من الهجمات والغارات لفترة طويلة.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> هاجمت مملكتك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> فشلت في مهاجمة مملكتك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "سرق <outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> {1} منك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "انضم <outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "فشلت <outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> في سرقة {1} منك</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "انقر لفتح", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> أزالتك كصديق</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>اجمع {0} <img src='{1}_s'/> للفوز!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>تراهن بسعر أعلى لتحصل على المزيد من <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>اجمع <img src='{0}_s'/> لتسلق لوحة المتصدرين!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>راهن أعلى لتضاعف كل <img src='{0}_s'/> تجمعه!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "ابدأ اللعب لجمع التبرعات", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2><img src='{0}_s' /> للانضمام إلى</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "الفائز!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "إليك ما فزت به:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "انتهت البطولة", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "لم تفز هذه المرة، لكنك تحصل على جائزة!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "الهدايا التي جمعت", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "الانتشار", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "الجائزة الكبرى", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "على الأقل واحدة:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "قابل للتداول", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "اذهب وتبادل!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "أصبحت الآن قابلة للتداول!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "مجموعة تداول البطاقات", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "ضع البطاقات التي تفتقدك", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "تداول البطاقات المكررة", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "اربح مكافآت رائعة!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "كون صداقات جديدة", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "لديك قسيمة!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>تستخدم القسائم لشراء الحزم وتحصل على {0}٪ إضافية <color=#fefe28>العملات</color>والصناديق والدوران <color=#64ebff></color>!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*مستخدمون جدد، مرة واحدة فقط!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "دوران", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "المكافآت", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "احصل على دورات وعملات إضافية في لعبة السلوت.", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "المكافآت اليومية", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "حد الاسترداد", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>المظهر المتلألئ <color=#fed400></color> الاسم الأحمر وتاج <color=#fed400></color>!</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "السنة", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "الشهر", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "الأسبوع", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": " تقدم<color=#5e2802>VIP بالسعر المحدد اشتراكا وتقدم الدورات والطعام والبطاقات يوميا. هذه اشتراك <color=#203d9b><u><on click=\"handle\" param=\"sub\">يتم تجديده تلقائيا</on></u></c>. يتم خصم الدفع من حساب هاتفك عند التأكيد. <color=#5e2802>يتم تجديد الاشتراك ما لم يتم إيقافه قبل 24 ساعة من انتهاء الفترة، وسيتم خصم التجديد من حسابك.</c> يمكنك إيقافه في إعدادات حسابك. أي جزء غير مستخدم من فترة التجربة المجانية، إذا تم توفيره، سيتم استبعاده عند شراء المستخدم للاشتراك، حيثما ينطبق. <color=#203d9b><u><on click=\"handle\" param=\"pri\">سياسة الخصوصية وشروط الاستخدام</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "حار", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "ابدأ مجانا", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3 أيام تجربة مجانية، ثم {0} شهريا", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "احصل على هذه كل يوم!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "احصل على الجميع", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "افتح VIP لتحصل على كل المكافأة المتراكمة", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "بنك المال", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "فتح\nالمستوى {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "التبادل\nالمستوى {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "التبادل", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "فتح {0} المستوى لفتحه", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "التبادل", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "نفد المال!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "مجاني", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "شاهد الفيديو", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "احصل على فرصة", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>مكافأة إضافية ب 30</color></size> مرة\nاحصل <size=46><color=#7ee0f4>5000+</color></size> سبينات!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "احصل على الكثير من مكافآت الدوران بعد شراء تذكرة المستوى!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "من أجل المملكة {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "بطاقة الجوكر", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "اختر بطاقة، أي بطاقة!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "المجموعة\nالجائزة", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "أكمل المجموعة", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "فقط بطاقات العرض التي لا أملكها", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "سآخذها!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "ينتهي في", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "بطاقة الجوكر الخاصة بك تنتظرك.\nاختر البطاقة التي تريدها قبل انتهاء الوقت!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "اختر الآن", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "أنت اخترت بطاقة {0} ", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "المجموعات الكاملة", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*سيتم مكافأتك على أي مجموعة بطاقات تكملها خلال الحدث", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": "واحد من {0} الصناديق يحتوي على", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) مضمون!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "يمكن شراؤه {0}/{1} مرة في الأسبوع", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "تبادل بطاقاتك المكررة\nمن أجل الإثارة", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "يفتح عند\nمملكة {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "الفريق", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "الأصدقاء", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "اصنع", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "تصفح", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "إلغاء", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "اسم الفريق:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "الشارة", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "الوصف:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "نوع الفريق:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "النجوم المطلوبة:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "محرر", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "مفتوح", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "مغلق", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "غادر", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "انضم", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "عرض الفريق", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "الزيارة", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "إزالة", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "ادع الأصدقاء", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "توصية الفريق الأفضل", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "اختر شارة الفريق", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "المساعدة", // 【HelpWindow】-【title_label】
  "Guild_Request": "طلب", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "اختر بطاقة لطلبها من زملائك الفريق", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "بطاقة الطلب", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "المعرف:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} غادر الفريق!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} انضم للفريق!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "الأعضاء:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "ليس كافيا ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "يمكنك إدخال الحروف فقط!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "يجب أن يكون اسم الفريق على الأقل 3 شخصيات!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} تعطي بطاقة x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "إضافة الأصدقاء", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "حذف الحساب & البيانات", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "تحذير", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "أنت على وشك حذف حسابك وكل بياناتك.\n  لا يمكن استعادته بعد الحذف.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "الأصدقاء", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "حذف الحساب", // 【MenuWindow】-【name】
  "setting_delete": "حذف الحساب", // 【SettingWindow】-【New Label】
  "BindTitle": "الحساب", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "حساب السويتش", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "بعد ربط حسابك،\nيمكنك اللعب على أجهزة أخرى", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "هذا الحساب على وسائل التواصل الاجتماعي مرتبط\n إلى حساب لعبة.\n يمكنك العودة إلى\n حسابك الأصلي في اللعبة\n أو تواصل معنا لفصل الرابط.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "اضغط على [تبديل الحساب] لتسجيل الدخول", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "تواصل معنا لفك الربط", // 【AccountHintWindow】-【tip】
  "ShopDaily": "العروض اليومية الخاصة", // 【ShopWindow】-【subtitle】
  "ShopGem": "جوهرة", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "العنصر", // 【ShopWindow】-【New Label】
  "ShopHot": "حار", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "عدد صناديق الجوكر\nالتخفيضات الأسبوعية محدودة", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "تعيينه كمسؤول جديد؟", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>كوبون</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}٪</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> المزيد من الدورات</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>خصمك</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>للحصول على</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}٪ إضافية</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> اللفات أو العملات</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>الوقت المتبقي:  {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "لديك قسيمة!\n لمزيد من {0}\nاللف أو العملات", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "قدم", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>طالما أن الفريق كله <img src='bossyucha'/>\n تجمع معا، يمكنك الحصول على\n 'صندوق الكنز الجماعي'!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "الجائزة النهائية", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "من أجل كنوز الأعماق،\nيجب على الفريق بأكمله هزيمة وحش البحر!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "تقول الأسطورة إن المحيط الواسع\nيخفي كنوز لا تنتهي، و إلى\nالحصول عليها، يجب الغوص فيها\nالأعماق اللامتناهية والهزيمة\nالوحوش التي تحرس الهاوية.\nاجمع الرماح مع فريقك\nوهزم كل الوحوش!\n1. للحصول على رمح، عليك الهجوم والغارة.\n2. استخدم الرمح لهزيمة الوحش، ثم اضغط على الوحش لتحصل على المكافآت.\n3. يمكنك دخول لوحة المتصدرين بعد إلحاق ضرر كبير بالوحوش.\n4. كلما زاد الضرر الذي يلحق بالوحش، زادت المكافأة.\n5. سيتم إرسال مكافآت لوحة المتصدرين إلى صندوق البريد بعد انتهاء الحدث.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "لديك:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "تداول البطاقات لن يقلل من تقدمك في اللعبة", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "اختر البطاقات إلى", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "اختر البطاقات لي", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "التجارة", // 【CardTradeWindow】-【Label】
  "JackT_depart": "المغادرة", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "الجائزة الكبرى:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "مجموعة الجوائز", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "لنلعب ونحصل على المكافآت!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "الاستسلام سيفقد كل جوائزك!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "مستويان إضافيان سيكونان مستويات إضافية!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "استقال", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "الإحياء", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "هل أنت متأكد أنك تريد المغادرة؟", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "غادر بلا شيء!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "نصائح", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "يحصل جاك على تذكرة طيران للذهاب في رحلة ويجد نفسه مطاردا من قبل الشرطة. تجنب الشرطة واختر البطاقة المناسبة للحصول على المكافأة.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "سيتم إضافة الجوائز إلى قائمة الجوائز. يمكن للاعبين اختيار الخروج من اللعبة في أي وقت والحصول على المكافأة الحالية.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "بعد اعتقالهم من قبل الشرطة، يمكن للاعبين أن ينتعشوا بمشاهدة إعلان أو بالدفع. يمكنك الخروج من اللعبة بدون مكافأة.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "ادفع للحياة والحصول على تذاكر الطيران ومكافآت SUPER RICH.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "سيتم عرض المراحل الإضافية في اللعبة.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "تابع", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "اجمع جميع المكافآت!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "وقت مستقطع!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "اذهب إلى", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "احصل على المكافأة!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "تحتاج إلى مغادرة فريقك الحالي للانضمام إلى فريق جديد.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "لوحة المتصدرين", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "الرتبة", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "انضم إلى فريق، كون صداقات، واحصل على المزيد من اللفات والبطاقات مع زملائك!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "انضم الآن", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff> أكمل مجموعة </color><color=#FFBC06>{1}</color><color=#ffffff>! مبروك!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff> اشتريت </color><color=#FFBC06>{1}</color><color=#ffffff>! هم أغنياء جدا الآن!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff> اشتريت </color><color=#FFBC06>{1}</color><color=#ffffff>. لنباركهم!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff></color><color=#FFBC06>{1}</color><color=#ffffff>! مبروك!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>مذهل!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> أنهى للتو جميع الخرائط!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "المستوى", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "نقاط المهام", // 【脚本】-【game/items/Content.js】
  "story1": "الخطوة مكتملة", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "انقر للمتابعة.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "الخريطة 1 المبنى 1 عنوان الفصل", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "الخريطة 1 المبنى 2 عنوان الفصل", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "الخريطة 1 المبنى 3 عنوان الفصل", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "الخريطة 1 المبنى 4 عنوان الفصل", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "الخريطة 1 المبنى 5 عنوان الفصل", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "معلومات اللاعبين", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "الأفاتار", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "إطار الأفاتار", // 【AvatarWindow】-【New Label】
  "Button_Save": "حفظ", // 【AvatarWindow】-【New Label】
  "EditNickName": "عدل لقبك", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "المستوى {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>اضغط على قطعة لقراءة التفاصيل هنا</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "تم الإنشاء من", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "جيل إضافي بعد الترقية", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "يمكنه توليد", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "يستطيع الطهي", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "التخزين", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "إضافة", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "صندوق الاختيار المفتوح", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "اختر واحدة من المكافآت التالية", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "طريقة الإنتاج", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "انقر على أواني الطهي لجمع المنتج النهائي.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "تلميح", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "إذا كان لديك حساب مرتبط بالفعل،\n يمكنك تسجيل الدخول إلى ذلك الحساب\n لمواصلة لعب اللعبة.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "هذا الحساب يحتوي على بيانات اللعبة", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "فشل الربط/التبديل", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "الحساب الحالي مرتبط بالفعل ببيانات هذه اللعبة", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "مرحبًا", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "ادمج هذه القطع", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "اضغط على المولد", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "اكتمل الطلب", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "هل تريد فرقعته؟", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "اكسر", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "إلغاء", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "المتبقي", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "فاصل التحديث", // 【ShopWindow】-【New Label】
  "ShopOver": "نفد", // 【ShopWindow】-【price】
  "ShopFree": "مجاني", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "مكتمل", // 【mergeUI】-【New Label】
  "ShopSpin": "شراء الطاقة", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "هذه البطاقة ذهبية.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "لقد وصلت إلى الحد اليومي لعدد البطاقات التي يمكنك إرسالها.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
