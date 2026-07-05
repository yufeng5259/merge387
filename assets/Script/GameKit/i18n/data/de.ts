const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "START", // 【未找到预制】-【脚本或动态使用】
  "Score": "Punktzahl", // 【未找到预制】-【脚本或动态使用】
  "Restart": "Neustart", // 【未找到预制】-【脚本或动态使用】
  "Loading": "Lädt", // 【DownloadingWindow】-【New Label】
  "Cancel": "Abbrechen", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "Bestätigen", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "Wiederholen", // 【未找到预制】-【脚本或动态使用】
  "Back": "Zurück", // 【未找到预制】-【脚本或动态使用】
  "Accept": "Akzeptieren", // 【未找到预制】-【脚本或动态使用】
  "Level": "Level", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "Rang", // 【未找到预制】-【脚本或动态使用】
  "Rank": "Rang", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "Punkte", // 【未找到预制】-【脚本或动态使用】
  "OK": "OK", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "JA", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "NEIN", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "Ja", // 【未找到预制】-【脚本或动态使用】
  "No": "Nein", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "Sammeln", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "Herzlichen Glückwunsch!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "und", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "NACHVERSUCH", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "OFF", // 【未找到预制】-【脚本或动态使用】
  "MORE": "MEHR", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "Diese Funktion ist noch nicht verfügbar.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "Spieler", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "Zahlung ist deaktiviert!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "Die Bezahlung ist nur auf Android aktiviert!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "Die Zahlung ist auf iOS deaktiviert!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "Entschuldigung, die Zahlungsfunktion ist derzeit nicht mit deinem System kompatibel. Bitte geben Sie Coin Gang über Instant Games am Computer ein, um Ihren Kauf abzuschließen.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "Vielen Dank für Ihren Kauf!", // 【PaySuccessWindow】-【label】
  "PayFail": "Kauf fehlgeschlagen!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "Ihr Kauf steht noch aus! Nach Abschluss der Zahlung starte du das Spiel neu, um deine Gegenstände zu erhalten.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\nOFF", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "Das Video ist noch nicht fertig!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "Zugang benötigt", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "Wir brauchen Ihre Informationen", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "Zugang erlauben", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "Diese Funktion ist derzeit nicht mit deiner Client-Version kompatibel. Bitte aktualisieren Sie WeChat.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "Hey, das ist wirklich ein großartiges Spiel! Lass uns zusammen spielen:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "Hey, das ist wirklich ein großartiges Spiel! Lass uns zusammen spielen:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} hast dir gerade ein paar Spins gegeben:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} dir gerade ein paar Münzen gegeben:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "Ich habe gerade ein neues Königreich gebaut! Kommen Sie vorbei und besuchen Sie:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "WOW! Ich habe gerade {0} Münzen gestohlen! So cool:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "WOW! Ich habe gerade ein anderes Königreich angegriffen! So cool:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "Teilen", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "Einladung", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "Senden", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} hast dir gerade Karten gegeben:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "Keine Verbindung zum Server geschafft, nochmal versuchen?", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "Ich konnte mich nicht mit dem Server verbinden.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "Verbindung zum Server verloren.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "Erfolg", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "Käufer fehlgeschlagen", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "Resource {0}nicht geladen. Nochmal versuchen?", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} Jahre", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} Monate", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} Tage", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} Stunden", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} Minuten", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} Sekunden", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": " Vor{0}Jahren", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": " Vor{0}Monaten", // 【未找到预制】-【脚本或动态使用】
  "PastDay": " Vor{0}D", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": " Vor{0}Uhr", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": " Vor{0}Uhr", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": " Vor{0}Jahren", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "Jetzt", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}y", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}mo", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}h", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}s", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "Jetzt", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "SPIEL", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "Gast", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "Es gibt einige Neuigkeiten.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "Beladung", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "Melden Sie sich mit Gast an", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "Melden Sie sich bei Apple", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "Melden Sie sich bei Facebook", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "Melden Sie sich mit Google Playan ", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "Münzen", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "Drehungen", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "Schild", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "Karte", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "Holztruhe", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "Silbertruhe", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "Goldtruhe", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "FREIE TRUHE!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "Artikel", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "Gegenstand", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "Kanonenkugel", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "Senden", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} dreht sich in {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "Auto", // 【slot】-【New Label】
  "ToRaidUserBet": "WIN X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "ALLE GEWINNE X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "BET", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "Voll", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} Spins", // 【未找到预制】-【脚本或动态使用】
  "Shield": "SCHILD", // 【未找到预制】-【脚本或动态使用】
  "Attack": "ANGRIFF", // 【未找到预制】-【脚本或动态使用】
  "Spins": "DREHUNGEN+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "RAID", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "LOLLI", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. Sie können monatlich erhalten\n     Das Anmelden belohnt jeden\n     7 Tage im Monat.\n2. Monatliche Anmeldeprämien werden\n     Aktualisieren Sie nächsten Monat.\n3. Du kannst wöchentlich bekommen\n     Anmeldungsbelohnungen täglich\n     In einer Woche.\n4. Wöchentliche Anmeldebelohnungen werden\n     Aktualisieren Sie nächste Woche.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "Sehen Sie sich ein Video an und erhalten Sie Münzen", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "FREIER SPIN", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "Dreh dich für {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "Freidrehung in\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "Zehnmal besser!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "SAMMELT", // 【dailyBonus】-【text】
  "DailyBonusLevel": "Level {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "Mindestens 25 Millionen Münzen beim ersten Mal!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "KAUFEN", // 【btnBuild】-【New Label】
  "BuildButtonFix": "KORREKTUR", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "Keine Münzen mehr?", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "Keine Drehungen mehr?", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} Spins", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "Oder warte {1} auf {0} Drehungen", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "Warte {1} auf {0} Drehungen", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\nMEHR", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "MENÜ", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "SPIEL", // 【MenuWindow】-【name】
  "menu_1_village": "KÖNIGREICH", // 【MenuWindow】-【name】
  "menu_2_buy": "KAUFEN SIE MÜNZEN/SPINS", // 【MenuWindow】-【name】
  "menu_3_daily": "TÄGLICHER BONUS", // 【MenuWindow】-【name】
  "menu_4_shop": "KÖNIGREICHE ENTWICKELN SICH WEITER", // 【MenuWindow】-【name】
  "menu_5_news": "NACHRICHT", // 【MenuWindow】-【name】
  "menu_6_gifts": "GESCHENK", // 【MenuWindow】-【name】
  "menu_7_card": "KARTE", // 【MenuWindow】-【name】
  "menu_8_map": "KARTE", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "BESTENLISTE", // 【MenuWindow】-【name】
  "menu_10_invite": "EINLADUNG", // 【MenuWindow】-【name】
  "menu_11_setting": "EINSTELLUNGEN", // 【MenuWindow】-【name】
  "setting_title": "Einstellungen", // 【SettingWindow】-【New Label】
  "setting_sound": "Klang", // 【SettingWindow】-【New Label】
  "setting_music": "Musik", // 【SettingWindow】-【New Label】
  "setting_notifications": "Benachrichtigungen", // 【SettingWindow】-【title】
  "setting_raid": "Raid & Angriff", // 【SettingWindow】-【New Label】
  "setting_general": "Allgemeines", // 【SettingWindow】-【New Label】
  "setting_language": "Sprache", // 【SettingWindow】-【title】
  "setting_english": "Englisch", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "Mag uns und verpasse nichts\nErstaunliche Veranstaltungen und Geschenke", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "WIE", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "Tutorial", // 【SettingWindow】-【New Label】
  "setting_support": "Unterstützung", // 【SettingWindow】-【New Label】
  "setting_privacy": "Bedingungen und Datenschutz", // 【SettingWindow】-【New Label】
  "setting_terms": "Geschäfts- und Geschäftsbedingungen", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "Kontaktieren Sie uns", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "Abmelden", // 【SettingWindow】-【Txt】
  "setting_change": "Veränderung", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "Cache löschen", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "Datenschutzeinstellungen", // 【SettingWindow】-【New Label】
  "setting_language_title": "Sprache", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "Englisch", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "Chinesisch", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "Español", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "Deutsch", // 【SettingLanguageWindow】-【label】
  "invite_title": "Willst du mehr Drehungen?", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>Lade Freunde ein und bekomme</color><color=#ff99f9><outline color=#471f01 width=3>{0} kostenlosen Spins</outline></color><color=#f1edff> für jeden freigeschalteten Freund\nKingdom 2!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>Lade Freunde ein und erhalte</color><color=#ff99f9><outline color=#471f01 width=3>{0} Gratis-Spins</outline></color><color=#f1edff> für jeden Freund, der das Spiel betritt!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "EINLADUNG", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* Du bekommst eine Belohnung nach deinem Freund\nVerbindung über Facebook", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "Verbinde dich mit Facebook", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "CONNECT", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "Wir werden nicht in deinem Namen posten.", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "Melden Sie sich an und erhalten Sie kostenlose Spins", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "Bist du sicher?", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "Gäste dürfen nicht mit Freunden spielen", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "Spiel als Gast", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "Freunde", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "Land", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "Global", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "Geschenke", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "Freie Spins", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "Kostenlose Münzen", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "Karten", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "Einladung", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "Senden", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "Sammeln", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "Sammeln / Alles absenden", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "Sammle alles", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "Freunde einladen", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "Erhalten Sie kostenlose Spins", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "Täglich gesammelte Spins {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "Täglich gesammelte Münzen {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "Geschenkfreie Drehung", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "Ich schicke dir {0} Dreh", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "Geschenkfreie Münzen", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "Ich schicke dir {0} Münzen", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "Karten senden\nAn deine Freunde", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "Ich schicke dir eine Karte", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "Du musst Kingdom {0} erreichen, um diese Karte zu sammeln", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "Shop", // 【ShopWindow】-【title_label】
  "ShopSpins": "Drehungen", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "Münzen", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "Truhen", // 【ShopWindow】-【New Label】
  "ShopTreats": "Leckereien", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} SPINS", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}% mehr", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": "{0}H-Aktivierung", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "Münzgeschäft", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "Level {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\nMEHR", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "VERKAUF", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "Truhen werden im Kingdom {0}freigeschaltet ", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "Leckerlis werden im Kingdom {0}freigeschaltet ", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "Beliebt", // 【ShopWindow】-【New Label】
  "ShopBestValue": "Bestes Preis-Leistungs-Verhältnis", // 【ShopWindow】-【New Label】
  "village_news_title": "Botschaft", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> dein Königreich</color></outline>angegriffen ", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> es nicht geschafft, dein Königreich</color></outline> anzugreifen", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> {1} dir gestohlen</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> es nicht geschafft, dir {1} zu stehlen</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "Königreich", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "Post", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>Ablauf in </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "Ablauf in {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "NEUE KÖNIGREICHE SIND\nDEMNÄCHST ERSCHEINT", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "Rache!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "Greif deinen Freund an!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "Zufällig", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "Rache", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "Angriff", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "Schau dir ein Video an und hol dir", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} SPINS", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} MÜNZEN", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "SCHAUEN SIE", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "Königreich vollendet!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "Als Nächstes", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "FREUND-BELOHNUNG", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} ein neues Königreich freigeschaltet! Du hast\n{1} KOSTENLOSE DREHUNGEN", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0} sind dem Spiel beigetreten! Du hast\n{1} KOSTENLOSE SPINS", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "Level einen Gegenstand auf, um einen Stern zu bekommen.\n\nSammle 25 Sterne, um das nächste Königreich freizuschalten.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "Du hast nicht genug Münzen...\n\nWische nach unten, um mehr Münzen zu verdienen.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "Nutze den Spielautomaten, um andere zu drehen, anzugreifen und zu überfallen.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "Greift die Königreiche anderer Spieler an, um Münzen zu bekommen.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "Schilde schützen dein Königreich vor Angriffen.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "Plündert das Königreich des Königs und stiehlt seine Münzen!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "Das ist der König\nLasst uns ihn überfallen!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "DEIN ERSTES KÖNIGREICH", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "Willkommen, mein Freund!\n\nDrücke den Knopf, um mit der Arbeit zu beginnen.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "Ziel", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "Erfolg!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "Ihre Belohnungen:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200 Drehungen!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20 Drehungen!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "1 Millionen Münzen!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "Speichere den Fortschritt!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "Spiel mit deinen Freunden!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "AUTO SPIN", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "Halte den Knopf gedrückt, um zu starten", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "Versuch es!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "Überraschungsangebot", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "Zeit übrig", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} Münzen", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} Spins", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "Verkaufszeit verbleibend {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>Greifen Sie {0} Mal an, um zu gelangen\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>Je mehr Balken du abschließt, desto größer sind die</color></outline><outline color=#b74800 width=2><color=#fff000>BELOHNUNGEN!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "Letzter Bar-Preis:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} Münzen!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "Setze höher und hol es schneller!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "VERSTANDEN!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "Endet in {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>Raid ist es {0} Fälle, um sie zu bekommen\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "Abschließen, um Belohnungen zu erhalten!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "Angriff", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "Angriff blockiert", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "Überfall", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "Ausgezeichneter Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "Treffe 3 Symbole", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>Du hast Belohnungen bekommen\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "KARTE\nSAMMLUNG", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "Abgeschlossen", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "Freischaltungen bei\nKönigreich {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* Tippe auf eine doppelte Karte, um sie an einen Freund zu senden", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- SET ABGESCHLOSSEN -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "Vervollständigen Sie den Satz, um zu gewinnen", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "Fragen Sie", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "Senden", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "Es darf nicht von Freunden verlangt werden", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "Diese Karte ist golden, kann nicht von Freunden gefragt werden", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "Es kann nicht an Freunde geschickt werden", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "Diese Karte ist golden, kann nicht an Freunde gesendet werden", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "Du hast das tägliche Limit an Karten erreicht, die du senden kannst.", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "Du brauchst mehr als eine Karte zum Versenden", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "SUPER!", // 【CardCollectWindow】-【title】
  "CardCollectDes": "Karte {0}\nwurde zu deinem Album hinzugefügt", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "Schau es dir an", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "KARTEN SENDEN", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "Wähle einen Freund aus!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "Karte auswählen", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "KARTEN SENDEN", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "Wählen Sie bis zu {0} Karten aus!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "Deine ausgewählten Karten:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "Karte erfolgreich verschickt!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "Karteninformationen", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "Sammle Karten durch Truhen", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "Du kannst auch Truhen im Shop kaufen", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "Truhen können während Überfälle und beim Freischalten eines neuen Königreichs gefunden werden", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "Wenn du zwei oder mehr derselben Karte besitzt, kannst du sie als Geschenk an deine Freunde schicken", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "Tippen Sie auf die Karte, um sie zu verschenken", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "Du kannst Freunde auch nach fehlenden Karten fragen", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "Du kannst bis zu 5 Karten an einem Tag verschicken", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "Sterne zeigen die Seltenheit der Karten an", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "Jeder Seltenheitsstern auf einer neuen gesammelten Karte gibt dir 1 Stern", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "Vervollständige Kartensets und erhalte großartige Belohnungen!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "Gemeinsam", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "Selten", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "Holzkiste", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "Silberne Truhe", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "Goldene Truhe", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "Hohe Wahrscheinlichkeit für:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "Neu", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>Sammle Karten, um mehr <color=#fff000>Münzen</color> und <color=#77e7ff>Spins</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>Sammle Karten, um mehr <color=#b85b00>Münzen</color> und <color=#0073d4>Spins</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "Suchname des Freundes", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "Keine Freunde", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang hat dir Münzen und Spins geschenkt!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "Quest Center", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "Aufgaben werden an einem neuen Tag aktualisiert. Bitte öffnen Sie das Fenster wieder.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "Täglich", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "Einladung", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "Zeichen", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8 Tage", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15 Tage", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22 Tage", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28 Tage", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "Tag 1", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "Tag 2", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "Tag 3", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "Tag 4", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "Tag 5", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "Tag 6", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "Tag 7", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "ZEICHEN", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "UNTERSCHRIEBEN", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "Hauptquest: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "Tor: {0}\nBelohnung: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "Sammeln", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "LOS", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": "Aktualisieren Sie in {0}", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "Aktivitätszentrum", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "Verbleibende Zeit: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "Endet mit: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "Die Aktivität ist beendet", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "QUEST", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "TÄTIGKEIT", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "Du hast volle Drehungen!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "Wir haben genug Drehungen, um zu spielen und mehr Münzen zu bekommen!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "Der tägliche Bonus ist jetzt verfügbar!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "Kommt und spielt täglich Wheel of Fortune!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "Lasst uns Rache nehmen!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "Jemand hat dein Königreich überfallen!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "Die Aktivität wird enden!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} endet in einer Stunde!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "Lange nicht gesehen!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "Es gibt viele neue Veranstaltungen. Und wir haben ein großes Geschenk für Sie vorbereitet!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "Komm, spiel mit mir!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "Komm zurück! Wir haben ein großes Geschenk für Sie vorbereitet!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "Neues Update", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "Wir haben die In-App-Kauffunktion behoben und weitere neue Events hinzugefügt.\nAlle anderen Spieler haben die neue Version heruntergeladen und gespielt. Alle Ihre Daten wurden in die neue Version übertragen.\nDanke.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "AKTUALISIERUNG", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "Nein, danke", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "Liebst du Coin Gang?", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "Tippe auf einen Stern, um es im Shop zu bewerten.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "ABSENDEN", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "NICHT JETZT", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "Lade-Ressource fehlgeschlagen. Nochmal versuchen?", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "LOS!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "Tätigen Sie jeden Kauf", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "ERHALTE ZUSÄTZLICHE BELOHNUNGEN!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "JETZT KAUFEN!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "Willkommen bei Coin Gang!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>Wir haben eine vorbereitet\n<color=#ffe62b>GROSSES GESCHENK</c> für dich~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "Aufrüstung", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "Auswahl", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "Erhöht die Belohnung von Raids", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● Erhöht die Belohnung um: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "Erhöht die Belohnung der Angriffe", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● Erhöht die Belohnung um: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "Schützt vor Angriffen", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● Schutzchance: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "Schützt vor Überfällen", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● Schutzchance: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● Nächste Stufe: {0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>Stellen Sie Diener ein, um mehr <color=#ffe615>Münzen</color> und <color=#0ce4fe>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>Stellen Sie Diener an, um mehr <color=#e67b07>Münzen</color> und <color=#006fd7>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "Upgrade:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "Jeder Spielautomatendreher = 1 Servant EXP. Du kannst Tränke verwenden, um mehr Servant EXPzu bekommen. Wenn die Diener-EXP-Leiste voll ist, tippe auf die Upgrade-Taste, um deinen Diener aufzuwerten. Jedes Servant-Upgrade erhöht deinen Spielstern.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "Fertigkeit:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "Die Fähigkeiten des Dieners verbessern sich mit jedem Level-Upgrade", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "Aktivierung:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "Füttere deinen Diener, um es zu aktivieren. Hol dir Servant Food beim Spinnen und Bauen.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "Dreh, um zu gewinnen bis", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "für einen zusätzlichen {0}", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "Ich habe ein Geschenk für dich!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "Papagei Peter bringt dir ein zufälliges Geschenk mit!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "Tipp einfach auf Peter, um das Geschenk zu bekommen, wenn er kommt!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "Hol dir kostenlosen Schild!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "Füttere mich mit Essen!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "Kostenlos", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "NUTZE JEDEN DEAL, UM MEHR ZU ENTDECKEN", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "Freischalten durch den Kauf eines vorherigen Angebots", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "Erhöhtes Einsatzlimit", // 【slot】-【Label - Msg】
  "SlotBetSuper": "SUPER", // 【slot】-【New Label】
  "I18N_BUY_NOW": "JETZT KAUFEN", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>bis zu 20 % MEHR Münzen und Spins</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>bis zu 20 % MEHR Münzen und Spins</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>setzen Sie höher, um alles, was Sie sammeln, zu vervielfachen! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>setzen Sie höher, um alles zu vervielfachen, was Sie sammeln! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "Die Joker-Karte ist verfügbar, um die begrenzte Karte zu ersetzen.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "GENIESSEN SIE COIN GANG", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "Hier Text eingeben...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>ERHALTE <color=#ffffff>{0}% ZUSÄTZLICHE BELOHNUNGEN</color> für jedes Kartenset, das du abschließt!</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "TRITT DER GRUPPE BEI.", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "Treten Sie bei", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>Holt die Karten aus diesen Truhen! Diese Truhen sind nur während des Events verfügbar! Diese speziellen Truhen kannst du im Store und bei anderen Events bekommen.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>Zeitlimitierte Kartensets</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "Los!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>Nutze den Gutschein, um Packs zu kaufen und 100 % mehr Münzen, Truhen und Spins zu bekommen!</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "Löschen", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "Geben Sie \"Löschen\" ein, um das Löschen Ihres Kontos zu bestätigen!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "Folgen Sie dem offiziellen Account für die neuesten Nachrichten", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "Gib den Einladungscode eines Freundes ein, um eine Belohnung zu erhalten!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "Überprüfen Sie den Einladungscode", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "Einladungscode", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "Kaufe ein Big Pack, bekomm zwei gratis!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "Hilfe", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "Erledige die heutigen zeitlich begrenzten Aufgaben, um Aufgaben mit höheren Punkten freizuschalten!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "Aktivieren", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "Kaufen Level", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "Empfangen", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "Kostenlos", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "Pass", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "Phase {0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "Stufe: Max", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "Level Up", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "Phasenbonus", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "Aufbau von Gebäuden", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*Du kannst nur ein Paket kaufen.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>JOKER-KARTE</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "ERFOLG", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "TIPPEN, UM FORTZUFAHREN", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "Tägliche Belohnungen", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "Funktionsbeschreibung", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "Verschmelze neben dem Sand, um Belohnungen freizuschalten!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3 Tage kostenlose Testphase, dann 16,99 $ im Monat", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "Name des Gebäudes", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "Belohnungsvorschau", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "Endgültige Belohnungen", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "GESAMMELT", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "Probleme beim Kauf?", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "Kontakt zum Support", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "Schau dir heute zu viele Videos an", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "Dollar", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "Zufallskarte", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "Goldene Karte", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "Magische Truhe", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "Diener", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "RAID GESCHÜTZT", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "ICE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "BALL", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "WILLKOMMEN!", // 【dailyBonus】-【Text】
  "menu_12_sign": "BELOHNUNGSKALENDER", // 【MenuWindow】-【name】
  "setting_lowbattery": "Energiesparmodus", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "Das Einschalten des Energiesparmodus reduziert den Stromverbrauch, verringert aber die Leistung.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "Wiederherstellen des Kaufs", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "Show VIP Crown", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "Um Coin Gangsterzu spielen,\nBitte bestätigen Sie", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    Indem ich fortfahre, bestätige ich, dass Happy Donut meine Daten gemäß der <color=#ffffff><u><on click='privacyHandler'>Datenschutzerklärung</on></u></color> speichern und verarbeiten darf.\n\nIch habe die <color=#ffffff><u><on click='termHandler'>Allgemeinen Geschäftsbedingungen</on></u></color> gelesen und akzeptiere sie. Sie stellen einen Vertrag dar und enthalten einen Verzicht auf Sammelklagen sowie eine Schiedsklausel.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "Français", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "Traditionelles Chinesisch", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "Japanisch", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "Italiano", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "Português", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*Aktualisiert in 10 Minuten", // 【LeaderboardWindow】-【note】
  "ShopShield": "Super\nSchild", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "SILBERNE SCHILDE", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "GOLDENE SCHILDE", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "Schütze dein Königreich", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "Schützen gegen:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>Attacks & <color=#288bdf>Raids</color> (exklusiv)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "Super Shield schützt dein Königreich lange vor Angriffen und Überfällen.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> dein Königreich</color></outline>angegriffen ", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> es nicht geschafft, dein Königreich</color></outline>anzugreifen ", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> {1} dir</color></outline>gestohlen ", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> es nicht geschafft, dir {1} zu stehlen</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "Tippen zum Öffnen", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> dich als Freund entfernt</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>Sammle {0} <img src='{1}_s'/> und gewinne!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>Setzen Sie höher, um mehr <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>Sammle <img src='{0}_s'/>, um in der Bestenliste aufzusteigen!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>setzen Sie höher, um jede <img src='{0}_s'/> zu multiplizieren, die Sie sammeln!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "Fang an zu spielen, um zu sammeln", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2><img src='{0}_s' /> dazu bringen,</outline>beizutreten ", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "GEWINNER!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "Das hast du gewonnen:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "Das Turnier ist vorbei", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "Diesmal hast du nicht gewonnen, aber du bekommst trotzdem einen Preis!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "Gesammelte Geschenke", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "Reichweite", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "GRAND-PREIS", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "Mindestens eines:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "Handelbar", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "GEHT HANDELN!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "SIND JETZT HANDELBAR!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "Kartenhandelsgruppe", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "Posten Sie, welche Karten Ihnen fehlen", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "Tausche doppelte Karten", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "Gewinne großartige Belohnungen!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "Finde neue Freunde", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "Du hast einen Gutschein!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>Verwenden Sie den Gutschein, um Packs zu kaufen und erhalten {0}% mehr <color=#fefe28>Münzen</color>, Truhen und <color=#64ebff>Spins</color>!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*Neue Nutzer, nur einmal!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "SPIN", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "Belohnungen", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "Erhalte zusätzliche Spins und Münzen im Slot-Spiel", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "Tägliche Belohnungen", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "ERHOLUNGSGRENZE", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>Shining-Look mit <color=#fed400>roten Namen</color> und <color=#fed400>Krone</color>!</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "JAHR", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "MONAT", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "WOCHE", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP bietet zum angegebenen Preis ein Abonnement an und gibt täglich Spins, Essen und Karten. Dies ist ein <color=#203d9b><u><on click=\"handle\" param=\"sub\">automatisch verlängerndes Abo</on></u></c>. Die Zahlung wird bei der Bestätigung auf Ihr Handykonto belastet. <color=#5e2802>Das Abonnement verlängert sich, es sei denn, es wird 24 Stunden vor Ablauf des Zeitraums deaktiviert, und dann wird dein Konto für die Verlängerung belastet.</c> Du kannst es in deinen Kontoeinstellungen deaktivieren. Jeder ungenutzte Teil einer kostenlosen Testphase, falls angeboten, verfällt, wenn der Nutzer ein Abonnement kauft, sofern zutreffend. <color=#203d9b><u><on click=\"handle\" param=\"pri\">Datenschutzrichtlinie und Nutzungsbedingungen</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "HEISS", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "Start kostenlos", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3 Tage kostenlose Testphase, dann {0} pro Monat", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "Hol dir diese JEDEN TAG!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "HOL ALLE", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "Schalte VIP frei, um DEN gesamten angesammelten BONUS zu bekommen", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "Money Bank", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "Freischalten\nLevel {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "Austausch\nStufe {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "Austausch", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "Schalte Level {0} frei, um es zu öffnen", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "Austausch", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "Aus den Dollarn!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "Kostenlos", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "Video ansehen", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "Get Chance", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>30</color></size> Bonusbonus\nDefinitiv <size=46><color=#7ee0f4>5000+</color></size> Drehungen bekommen!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "Erhalte viele Spin-Belohnungen nach dem Kauf des Levelpasses!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "Für das Königreich {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "Joker-Karte", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "Zieh eine Karte, irgendeine Karte!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "Set\nPreis", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "VERVOLLSTÄNDIGEN SIE DAS SET", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "Zeige nur Karten, die ich nicht habe", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "Ich nehme es!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "Läuft ab in", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "Deine Joker-Karte wartet.\nWähle die Karte, die du haben möchtest, bevor die Zeit abläuft!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "Wähle jetzt", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "Du hast die {0} Karte gewählt", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "VOLLSTÄNDIGE MENGEN", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*Du wirst für jedes Kartenset, das du während des Events abschließt, belohnt", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": "1 von {0} Truhen enthält eine", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) garantiert eins!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "Kann {0}/{1} Mal pro Woche gekauft werden", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "TAUSCHEN SIE IHRE DOPPELTEN KARTEN\nFÜR AUFREGUNG", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "ENTSPERRT BEI\nKÖNIGREICH {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "Team", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "Freunde", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "Erstellen Sie", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "Durchstöbern", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "Stornieren", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "Teamname:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "Abzeichen", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "Beschreibung:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "Teamtyp:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "Erforderliche Sterne:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "Herausgeber", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "Offen", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "Geschlossen", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "Gehen Sie", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "Tritt bei.", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "Team ansehen", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "Besuch", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "Entfernen", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "Freunde einladen", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "Top-Team-Empfehlung", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "Wählen Sie das Teamabzeichen", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "Hilfe", // 【HelpWindow】-【title_label】
  "Guild_Request": "Anfrage", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "Wähle eine Karte, die du von Teamkollegen anfordern möchtest", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "Anforderungskarte", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} hat das Team verlassen!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} ist dem Team beigetreten!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "Mitglieder:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "Nicht genug ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "Du kannst nur Briefe einreichen!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "Der Teamname sollte mindestens 3 Zeichen sein!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} gibt eine Karte x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "Freunde hinzufügen", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "KONTO UND DATEN LÖSCHEN", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "WARNUNG", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "Du wirst kurz davor, dein Konto und alle Daten zu löschen.\n  Sie kann nach der Löschung nicht wiederhergestellt werden.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "FREUNDE", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "Konto löschen", // 【MenuWindow】-【name】
  "setting_delete": "Konto löschen", // 【SettingWindow】-【New Label】
  "BindTitle": "Konto", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "Konto wechseln", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "Nachdem Sie Ihr Konto verknüpft haben,\nDu kannst auf anderen Geräten spielen", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "Dieser Social-Media-Account ist verknüpft\n auf einen Spiele-Account.\n Du kannst zurück zu wechseln\n Dein ursprüngliches Spielkonto\n Oder kontaktieren Sie uns, um die Verbindung zu entkoppeln.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "Tippen Sie [Konto wechseln], um sich anzumelden", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "Kontaktieren Sie uns, um die Bindung zu entbinden", // 【AccountHintWindow】-【tip】
  "ShopDaily": "Tagesangebote", // 【ShopWindow】-【subtitle】
  "ShopGem": "Gem", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "Gegenstand", // 【ShopWindow】-【New Label】
  "ShopHot": "Heiß", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "Die Anzahl der Joker-Truhen\nDer wöchentliche Sale ist limitiert", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "Ihn zum neuen Administrator ernennen?", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>GUTSCHEIN</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> MEHR DREHUNGEN</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>IHR RABATT</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Für mehr</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> Spins oder Münzen</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>verbleibende Zeit:  {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "Du hast einen Gutschein!\n Für zusätzliche {0}\nSpins oder Münzen", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "Bewerben Sie sich", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>Solange das ganze Team <img src='bossyucha'/>\n sammelt sich zusammen, du kannst die\n 'Team Schatztruhe'!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "Ultimativer Preis", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "Für die Schätze der Tiefe,\nDas ganze Team muss das Seeungeheuer besiegen!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "Der Legende nach ist der weite Ozean\nVerbirgt endlose Schätze, und\nSie zu bekommen, muss man wirklich eintauchen\nDie endlosen Tiefen und Niederlage\nDie Monster, die den Abgrund bewachen.\nSammle Harpunen mit deinem Team\nUnd besiege alle Monster!\n1. Um eine Harpune zu bekommen, musst du angreifen und plündern.\n2. Benutze die Harpune, um das Monster zu besiegen, und tippe dann auf das Monster, um Belohnungen zu erhalten.\n3. Du kannst in die Bestenliste einsteigen, nachdem du hohen Schaden an Monstern verursacht hast.\n4. Je höher der Schaden, der dem Monster zugefügt wird, desto höher ist die Belohnung.\n5. Bestenliste-Belohnungen werden nach dem Event an den Postfach gesendet.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "Sie haben:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "Kartentausch wird deinen Spielfortschritt nicht verringern", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "Karten auswählen", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "Wähle Karten für mich aus", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "HANDEL", // 【CardTradeWindow】-【Label】
  "JackT_depart": "Abfahren", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "Hauptpreis:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "Preispool", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "Lasst uns spielen und Belohnungen bekommen!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "Wenn du aufgibst, verlierst du all deine Preise!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "Zwei weitere Level werden Bonuslevel sein!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "Kündige", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "Wiederbelebung", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "Bist du sicher, dass du gehen willst?", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "Geh mit nichts davon!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "Tipps", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "Jack schnappt sich ein Flugticket für eine Reise und wird von der Polizei gejagt. Meide die Polizei und wähle die richtige Karte, um die Belohnung zu erhalten.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "Preise werden dem Preispool hinzugefügt. Spieler können das Spiel jederzeit beenden und erhalten die aktuelle Belohnung.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "Nach einer Festnahme durch die Polizei können Spieler durch das Anschauen einer Werbung oder durch Bezahlen wiederbeleben. Du kannst das Spiel ohne Belohnung beenden.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "Bezahle für die Wiederbelebung und bekomme Flugtickets sowie SUPER REICHE Prämien.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "Bonuslevel werden im Spiel vorgestellt.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "Weitermachen", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "Sammle alle Belohnungen!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "Auszeit!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "GEHE ZU", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "Belohnt euch!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "Du musst dein aktuelles Team verlassen, um einem neuen beizutreten.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "Bestenliste", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "Rang", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "Tritt einem Team bei, schließe Freunde und erhalte mehr Spins und Karten mit deinen Teamkollegen!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "JETZT BEITRETEN", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff> das </color><color=#FFBC06>{1}</color><color=#ffffff> Set komplettiert! Herzlichen Glückwunsch!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff> einen </color><color=#FFBC06>{1}</color><color=#ffffff>gekauft! Sie sind jetzt sehr reich!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff> eine </color><color=#FFBC06>{1}</color><color=#ffffff>gekauft. Lasst uns sie segnen!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff> habe eine </color><color=#FFBC06>{1}</color><color=#ffffff>! Herzlichen Glückwunsch!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>Unglaublich!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> hat gerade alle Karten abgeschlossen!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "Level Up", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "Aufgabenpunkte", // 【脚本】-【game/items/Content.js】
  "story1": "Schritt abgeschlossen", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "Zum Fortfahren klicken.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "Karte 1 Gebäude 1 Kapiteltitel", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "Karte 1 Gebäude 2 Kapiteltitel", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "Karte 1 Gebäude 3 Kapiteltitel", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "Karte 1 Gebäude 4 Kapiteltitel", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "Karte 1 Gebäude 5 Kapiteltitel", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "Spielerinformationen", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "Avatar", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "Avatar-Rahmen", // 【AvatarWindow】-【New Label】
  "Button_Save": "Speichern", // 【AvatarWindow】-【New Label】
  "EditNickName": "Bearbeite deinen Spitznamen", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "Level {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>Tippe auf ein Teil, um hier Details zu lesen</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "Generiert aus", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "Zusätzliche Generation nach dem Upgrade", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "Kann generieren", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "Kann kochen", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "Lagerung", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "Hinzufügen", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "Offene Auswahlbox", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "Wählen Sie eine der folgenden Belohnungen aus", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "Produktionsmethode", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "Klopfen Sie auf das Kochgeschirr, um das fertige Produkt zu sammeln.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "Hinweis", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "Wenn Sie bereits ein verknüpftes Konto haben,\n Du kannst dich in dieses Konto einloggen\n um das Spiel weiterzuspielen.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "Dieser Account enthält Spieldaten", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "Bindung/Umschalten fehlgeschlagen", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "Das aktuelle Konto ist bereits an diese Spieldaten gebunden", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "Willkommen", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "Kombiniere diese Teile", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "Tippe auf den Generator", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "Auftrag abgeschlossen", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "Platzen lassen?", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "Zerbrechen", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "Abbrechen", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "Verbleibend", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "Aktualisierungsintervall", // 【ShopWindow】-【New Label】
  "ShopOver": "Ausverkauft", // 【ShopWindow】-【price】
  "ShopFree": "Kostenlos", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "Abgeschlossen", // 【mergeUI】-【New Label】
  "ShopSpin": "Energie kaufen", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "Diese Karte ist golden.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "Du hast das tägliche Limit an Karten erreicht, die du schicken kannst.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
