const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "INIZIA", // 【未找到预制】-【脚本或动态使用】
  "Score": "Punteggio", // 【未找到预制】-【脚本或动态使用】
  "Restart": "Riavvio", // 【未找到预制】-【脚本或动态使用】
  "Loading": "Caricamento", // 【DownloadingWindow】-【New Label】
  "Cancel": "Annulla", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "Conferma", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "Riprova", // 【未找到预制】-【脚本或动态使用】
  "Back": "Indietro", // 【未找到预制】-【脚本或动态使用】
  "Accept": "Accetta", // 【未找到预制】-【脚本或动态使用】
  "Level": "Livello", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "Classifica", // 【未找到预制】-【脚本或动态使用】
  "Rank": "Classifica", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "Punti", // 【未找到预制】-【脚本或动态使用】
  "OK": "OK", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "SÌ", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "NO", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "Sì", // 【未找到预制】-【脚本或动态使用】
  "No": "No", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "Raccogli", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "Congratulazioni!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "e", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "NUOVO TENTATIVO", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "OFF", // 【未找到预制】-【脚本或动态使用】
  "MORE": "ALTRO", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "Questa funzione non è ancora disponibile.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "Giocatore", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "Il pagamento è disabilitato!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "Il pagamento è abilitato solo su Android!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "Il pagamento è disabilitato su iOS!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "Mi dispiace, la funzione di pagamento attualmente non è compatibile con il tuo sistema. Si prega di inserire Coin Gang tramite Instant Games su un computer per completare il tuo acquisto.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "Grazie per l'acquisto!", // 【PaySuccessWindow】-【label】
  "PayFail": "Acquisto fallito!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "Il tuo acquisto è in attesa! Dopo aver completato il pagamento, riavvia il gioco per ricevere i tuoi oggetti.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\nOFF", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "Il video non è pronto!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "Necessita di accesso", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "Abbiamo bisogno delle tue informazioni", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "Consentire l'accesso", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "Questa funzione è attualmente incompatibile con la versione client. Per favore, aggiorna WeChat.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "Ehi, questo è davvero un gioco fantastico! Giochiamo insieme:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "Ehi, questo è davvero un gioco fantastico! Giochiamo insieme:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} appena fatto qualche prova:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} appena dato delle monete:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "Ho appena costruito un nuovo regno! Vieni a fare visita:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "WOW! Ho appena rubato {0} monete! Che figo:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "WOW! Ho appena attaccato un altro regno! Che bello:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "Condividi", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "Invito", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "Invia", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} ti ha solo dato delle cartoline:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "Non sono riuscito a connettersi al server, riprova?", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "Non è riuscito a connettersi al server.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "Connessione persa al server.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "Successo", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "Acquisto fallito", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "Non è riuscito a caricare le risorse {0}. Riprovare?", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} anni", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} mesi", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} giorni", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} ore", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} minuti", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} secondi", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": "{0}anni fa", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": "{0}mo fa", // 【未找到预制】-【脚本或动态使用】
  "PastDay": "{0}fa", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": "{0}h fa", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": "{0}m fa", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": "{0}anni fa", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "Ora", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}y", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}mo", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}h", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}s", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "Ora", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "OPERA", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "Ospite", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "Ci sono alcuni aggiornamenti.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "Caricamento", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "Accedi con l'ospite", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "Accedi con Apple", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "Accedi con Facebook", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "Accedi con Google Play", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "Monete", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "Giri", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "Scudo", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "Carta", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "Forziere di legno", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "Forziere d'argento", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "Forziere d'oro", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "FORZIERE LIBERO!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "Oggetti", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "Voce", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "Cannonball", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "Invia", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} gira in {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "Auto", // 【slot】-【New Label】
  "ToRaidUserBet": "VITTORIA X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "TUTTI VINCONO X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "BET", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "Pieno", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} Giri", // 【未找到预制】-【脚本或动态使用】
  "Shield": "SCUDO", // 【未找到预制】-【脚本或动态使用】
  "Attack": "ATTACCO", // 【未找到预制】-【脚本或动态使用】
  "Spins": "GIRI+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "RAID", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "LOLLI", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. Puoi ricevere una mense.\n     Premi per accedere ogni\n     7 giorni in un mese.\n2. Le ricompense mensili per l'accesso saranno\n     Aggiorna il mese prossimo.\n3. Puoi avere una settimana\n     Premi per accedere ogni giorno\n     Tra una settimana.\n4. Le ricompense settimanali per l'accesso saranno\n     Aggiorna la prossima settimana.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "Guarda un video e ottieni monete", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "GIRAZIONE GRATUITA", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "Gira per {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "Rotazione libera in\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "Dieci volte meglio!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "RISCUOTE", // 【dailyBonus】-【text】
  "DailyBonusLevel": "Livello {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "Almeno 25 milioni di monete la prima volta!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "COMPRA", // 【btnBuild】-【New Label】
  "BuildButtonFix": "FIX", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "A corto di monete?", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "Senza spin?", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} Giri", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "oppure aspettare {1} {0} rotazioni", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "Aspetta {1} {0} giri", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\nALTRO", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "MENÙ", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "OPERA", // 【MenuWindow】-【name】
  "menu_1_village": "REGNO", // 【MenuWindow】-【name】
  "menu_2_buy": "ACQUISTA MONETE/SPIN", // 【MenuWindow】-【name】
  "menu_3_daily": "BONUS GIORNALIERO", // 【MenuWindow】-【name】
  "menu_4_shop": "EVOLVERSI DEL REGNO", // 【MenuWindow】-【name】
  "menu_5_news": "MESSAGGIO", // 【MenuWindow】-【name】
  "menu_6_gifts": "DONO", // 【MenuWindow】-【name】
  "menu_7_card": "CARD", // 【MenuWindow】-【name】
  "menu_8_map": "MAPPA", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "CLASSIFICA", // 【MenuWindow】-【name】
  "menu_10_invite": "INVITO", // 【MenuWindow】-【name】
  "menu_11_setting": "IMPOSTAZIONI", // 【MenuWindow】-【name】
  "setting_title": "Impostazioni", // 【SettingWindow】-【New Label】
  "setting_sound": "Audio", // 【SettingWindow】-【New Label】
  "setting_music": "Musica", // 【SettingWindow】-【New Label】
  "setting_notifications": "Notifiche", // 【SettingWindow】-【title】
  "setting_raid": "Incursione e Attacco", // 【SettingWindow】-【New Label】
  "setting_general": "Generale", // 【SettingWindow】-【New Label】
  "setting_language": "Lingua", // 【SettingWindow】-【title】
  "setting_english": "Inglese", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "Come noi e non perderti nulla\nEventi e regali straordinari", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "TIPO", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "Tutorial", // 【SettingWindow】-【New Label】
  "setting_support": "Supporto", // 【SettingWindow】-【New Label】
  "setting_privacy": "Termini e Privacy", // 【SettingWindow】-【New Label】
  "setting_terms": "Termini e Condizioni", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "Contattaci", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "Disconnettiti", // 【SettingWindow】-【Txt】
  "setting_change": "Cambiamento", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "Svuota la cache", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "Impostazioni sulla privacy", // 【SettingWindow】-【New Label】
  "setting_language_title": "Lingua", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "Inglese", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "Cinese", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "Español", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "Deutsch", // 【SettingLanguageWindow】-【label】
  "invite_title": "Vuoi più giri?", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>Invita amici e ricevi</color><color=#ff99f9><outline color=#471f01 width=3>{0} giri gratuiti</outline></color><color=#f1edff> per ogni amico che si sblocca\nRegno 2!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>Invita gli amici e ricevi</color><color=#ff99f9><outline color=#471f01 width=3>{0} giri gratuiti</outline></color><color=#f1edff> per ogni amico che partecipa al gioco!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "INVITO", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* Riceverai una ricompensa dopo il tuo amico\nsi collega tramite Facebook", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "Connettiti con Facebook", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "CONNETTITI", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "Non pubblicheremo per tuo conto", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "Accedi e ricevi Giri Gratuiti", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "Sei sicuro?", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "Gli ospiti non possono giocare con gli amici", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "Gioca come ospite", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "Amici", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "Paese", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "Globale", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "Doni", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "Giri Gratuiti", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "Monete Libere", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "Carte", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "Invito", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "Invia", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "Riscuotere", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "Raccogli / Invia tutto", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "Colleziona tutto", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "Invita gli amici", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "Ottieni giri gratis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "Tiri giornalieri raccolti {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "Monete raccolte quotidianamente {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "Regalo giro gratuito", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "Ti mando {0} giro", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "Monete regalo", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "Ti mando {0} monete", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "Invia biglietti\nai tuoi amici", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "Ti mando un biglietto", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "Devi raggiungere il regno {0} per raccogliere questa carta", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "Negozio", // 【ShopWindow】-【title_label】
  "ShopSpins": "Giri", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "Monete", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "Forzieri", // 【ShopWindow】-【New Label】
  "ShopTreats": "Premi", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} GIRA", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}% in più", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": " Attivazione{0}h", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "Negozio di monete", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "Livello {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\nALTRO", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "VENDITA", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "Forzieri si sbloccano al regno {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "Premi sbloccati a Kingdom {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "Popolare", // 【ShopWindow】-【New Label】
  "ShopBestValue": "Miglior rapporto qualità-prezzo", // 【ShopWindow】-【New Label】
  "village_news_title": "Messaggio", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> attaccato il tuo regno</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> fallito nell'attacco del tuo regno</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> rubato {1} da te</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> si è unito Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> fallito nel rubarti {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "Regno", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "Posta", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>Scadere tra </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "Scadere tra {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "I NUOVI REGNI SONO\nIN ARRIVO", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "Vendetta!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "Attacca il tuo amano!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "Casuale", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "Vendetta", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "Attacco", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "Guarda un video e ottieni", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} GIRI", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} MONETE", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "OROLOGIO", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "Regno completo!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "Prossimo", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "RICOMPENSA DELL'AMICO", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} sbloccato un nuovo regno! Hai\n{1} GIRI GRATUITI", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0} entrato nel gioco! Hai\n{1} GIRI GRATUITI", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "Fai salire di livello un oggetto per ottenere una stella.\n\nRaccogli 25 stelle per sbloccare il prossimo regno.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "Non hai abbastanza monete...\n\nScorri verso il basso per guadagnare più monete.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "Usa la slot machine per girare, attaccare e razziare gli altri.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "Attacca i regni degli altri giocatori per ottenere monete.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "Gli scudi proteggeranno il tuo regno dagli attacchi.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "Razziate il regno del re e rubate le sue monete!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "Questo è il Re\nFacciamolo irruzione!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "IL TUO PRIMO REGNO", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "Benvenuto, amico mio!\n\nPremi il pulsante per iniziare a lavorare.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "Bersaglio", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "Successo!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "Le tue ricompense:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200 giri!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20 giri!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "1 milione di monete!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "Salva i progressi!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "Gioca con i tuoi amici!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "AUTO SPIN", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "Tieni premuto il pulsante per iniziare", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "Prova!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "Offerta a sorpresa", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "Tempo rimasto", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} Monete", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} Giri", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "Tempo di vendita {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>Attacca {0} volte per ottenere\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>Più battute complete, maggiori sono le</color></outline><outline color=#b74800 width=2><color=#fff000>RICOMPENSE!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "Premio finale all'esame:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} Monete!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "Scommetti più in alto e ottieni più velocemente!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "RICEVUTO!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "Finisce con {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>Raid {0} orari per ottenere\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "Completa per ottenere delle ricompense!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "Attacco", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "Attacco bloccato", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "Eccellente incursione", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "Colpisci 3 simboli", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>Hai ricevuto delle ricompense\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "CARD\nCOLLEZIONE", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "Completato", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "Sblocchi su\nRegno {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* Tocca una carta duplicata per inviarla a un amico", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- SET COMPLETATO -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "Completa il set per vincere", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "Chiedi", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "Invia", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "Non può essere chiesto agli amici", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "Questa carta è d'oro, non può essere richiesta agli amici", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "Non può essere inviato agli amici", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "Questa carta è d'oro, non può essere inviata agli amici", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "Hai raggiunto il limite giornaliero di carte che puoi inviare", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "Serve più di una cartolina per inviare", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "FANTASTICO!", // 【CardCollectWindow】-【title】
  "CardCollectDes": " {0}carta \nè stato aggiunto al tuo album", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "Dai un'occhiata", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "INVIA CARTOLINE", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "Seleziona un amico!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "Seleziona carta", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "INVIA CARTOLINE", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "Seleziona fino a {0} carte!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "Le tue carte selezionate:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "Biglietto inviato con successo!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "Informazioni sulle carte", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "Raccogli carte tramite forzieri", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "Puoi anche comprare forzieri nel negozio", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "I forzieri si trovano durante le incursioni e quando si sblocca un nuovo regno", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "Possedere 2 o più cartoline identiche ti permette di inviarle come regalo ai tuoi amici", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "Tocca la carta per regalarla", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "Puoi anche chiedere agli amici se mancante le carte", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "Puoi inviare fino a 5 biglietti in un solo giorno", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "Le stelle indicano la rarità delle carte", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "Ogni stella di rarità su una nuova carta raccolta ti dà 1 stella", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "Completa set di carte e ottieni ricompense fantastiche!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "Comune", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "Raro", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "Baule di legno", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "Forziere d'Argento", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "Forziere d'Oro", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "Alta probabilità di:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "Nuovo", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>Colleziona carte per ottenere più <color=#fff000>Monete</color> e <color=#77e7ff>Spins</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>Colleziona carte per ottenere più <color=#b85b00>Monete</color> e <color=#0073d4>Giri</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "Cerca nome amico", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "Nessun amico", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang ti ha regalato Monete e Spin!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "Centro Quest", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "I compiti si aggiornano in un nuovo giorno. Per favore, riapri la finestra.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "Quotidiano", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "Invito", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "Insegna", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8 giorni", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15 giorni", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22 giorni", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28 giorni", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "Giorno 1", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "Giorno 2", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "Giorno 3", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "Giorno 4", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "Giorno 5", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "Giorno 6", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "Giorno 7", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "FIRMA", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "FIRMATO", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "Missione principale: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "Gol: {0}\nRicompensa: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "Riscuotere", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "VAI", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": "Aggiorna in {0}", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "Centro Attività", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "Tempo rimasto: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "Finisce in: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "L'attività è terminata", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "QUEST", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "ATTIVITÀ", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "Hai giri completi!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "Abbiamo abbastanza giri per giocare e prendere più monete!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "Il bonus giornaliero è disponibile ora!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "Vieni a giocare ogni giorno a Wheel of Fortune!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "Vendichiamoci!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "Qualcuno ha invaso il tuo regno!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "L'attività finirà!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} finirà tra un'ora!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "È passato tanto che non ci vediamo!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "Ci sono molti nuovi eventi. E abbiamo preparato un grande regalo per te!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "Vieni a giocare con me!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "Torna indietro! Abbiamo preparato un grande regalo per te!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "Nuovo aggiornamento", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "Abbiamo sistemato la funzione di acquisto in-app e aggiunto altri nuovi eventi.\nTutti gli altri giocatori hanno scaricato e giocato la nuova versione. Tutti i tuoi dati sono stati trasferiti nella nuova versione.\nGrazie.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "AGGIORNAMENTO", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "No, grazie", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "Ti piace Coin Gang?", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "Tocca una stella per valutarlo in negozio.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "INVIA", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "NON ORA", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "Caricamento risorsa fallito. Riprovare?", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "VAI!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "Effettua qualsiasi acquisto per", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "OTTIENI RICOMPENSE EXTRA!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "ACQUISTA ORA!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "Benvenuto in Coin Gang!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>Abbiamo preparato un\n<color=#ffe62b>GRANDE REGALO</c> per te~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "Aggiornamento", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "Seleziona", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "Aumenta la ricompensa delle raid", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● Aumenta la ricompensa di: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "Aumenta la ricompensa degli attacchi", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● Aumenta la ricompensa di: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "Protegge dagli attacchi", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● Probabilità di protezione: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "Protegge dalle incursioni", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● Probabilità di protezione: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● Livello successivo: {0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>Assumere servitori per ottenere più monete <color=#ffe615></color> e <color=#0ce4fe>giri</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>Assumere servitori per ottenere più monete <color=#e67b07></color> e <color=#006fd7>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "Aggiornamento:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "Ogni giro della slot machine = 1 servitore EXP. Puoi usare le pozioni per ottenere più EXPServitore. Quando la barra EXP Servant è piena, premi il pulsante Upgrade per potenziare il tuo servant. Ogni potenziamento servitore aumenterà la tua stella di gioco.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "Abilità:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "L'abilità del Servitore migliora ad ogni upgrade di livello", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "Attivazione:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "Dai da mangiare al tuo servitore per attivarlo. Prendi cibo da servitore mentre fili e costruisci.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "Gira per vincere fino a", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "per un ulteriore {0}", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "Ho un regalo per te!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "Parrot Peter ti porterà un regalo a caso!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "Basta toccare Peter per ricevere il regalo quando arriva!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "Prendi scudo gratis!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "Dammi da mangiare!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "Gratis", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "PRENDI OGNI AFFARE PER RIVELARE DI PIÙ", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "Sblocca acquistando l'offerta precedente", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "Limite di puntata aumentato", // 【slot】-【Label - Msg】
  "SlotBetSuper": "SUPER", // 【slot】-【New Label】
  "I18N_BUY_NOW": "ACQUISTA ORA", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>fino al 20% in più di monete e spin</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>fino al 20% in più di monete e spin</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>Scommetti di più per moltiplicare tutto ciò che raccogli! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>Scommetti di più per moltiplicare tutto ciò che raccogli! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "È disponibile una carta jolly per sostituire la carta limitata.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "GODENDOSI COIN GANG", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "Inserisci il testo qui...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>OTTIENI <color=#ffffff>{0}% DI RICOMPENSE EXTRA</color> per ogni set di carte completato!</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "UNISCITI AL GRUPPO", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "Unisciti a noi", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>Prendi le carte da questi forzieri! Questi forzieri sono disponibili solo durante l'evento! Puoi ottenere questi forzieri speciali in Store e in altri eventi.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>Set di carte a tempo limitato</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "Vai!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>Usa il coupon per comprare pacchetti e ottenere il 100% in più di monete, forzieri e spin!</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "Elimina", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "Inserisci \"Elimina\" per confermare la cancellazione del tuo account!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "Segui l'account ufficiale per le ultime notizie", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "Inserisci il codice invito di un amico per ricevere una ricompensa!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "Controlla il codice invito", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "Codice invito", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "Compra un Big Pack, ricevi due gratis!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "Aiuto", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "Completa le attività a tempo limitato di oggi per sbloccare compiti con ricompense con punti più alti!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "Attiva", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "Acquista il livello", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "Ricevi", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "Gratis", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "Passo", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "Stage {0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "Livello: Max", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "Sale di livello", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "Bonus di Fase", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "Edifici di aggiornamento", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*Puoi acquistare solo un pacchetto.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>CARTA JOLLY</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "SUCCESSO", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "TOCCA PER CONTINUARE", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "Ricompense giornaliere", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "Descrizione della caratteristica", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "Unisciti accanto alla sabbia per sbloccare le ricompense!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3 giorni di prova gratuita, poi 16,99 dollari al mese", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "Nome dell'edificio", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "Anteprima ricompensa", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "Ricompense finali", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "RACCOLTO", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "Hai problemi ad acquistare?", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "Contatta il supporto", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "Guarda troppi video oggi", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "Dollari", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "Carta casuale", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "Carta d'oro", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "Forziere Magico", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "Servitore", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "PROTEZIONE DA RADIO", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "ICE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "PALLA", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "BENVENUTI!", // 【dailyBonus】-【Text】
  "menu_12_sign": "CALENDARIO DELLE RICOMPENSE", // 【MenuWindow】-【name】
  "setting_lowbattery": "Modalità a basso consumo", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "Attivare la modalità Low Power riduce il consumo ma le prestazioni.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "Ripristina l'acquisto", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "Corona VIP Mostra", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "Per giocare Coin Gangster,\nPer favore conferma", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    Continuando, riconosco che Happy Donut può archiviare e trattare i miei dati in conformità con l'<color=#ffffff><u><on click='privacyHandler'>Informativa sulla privacy</on></u></color>.\n\nHo letto e accetto i <color=#ffffff><u><on click='termHandler'>Termini e condizioni</on></u></color>, che stabiliscono un contratto e includono una rinuncia alle azioni collettive e una clausola arbitrale.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "Francese", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "Cinesi tradizionale", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "Giapponese", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "Italiano", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "Portoghese", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*Aggiorna tra 10 minuti", // 【LeaderboardWindow】-【note】
  "ShopShield": "Super\nScudo", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "SCUDI D'ARGENTO", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "SCUDI DORATI", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "Proteggi il tuo regno", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "Proteggi contro:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>Attacchi e <color=#288bdf>Raid</color> (esclusivo)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "Super Scudo protegge il tuo regno da attacchi e razzie per molto tempo.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> attaccato il tuo regno</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> fallito nell'attacco del tuo regno</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> rubato {1} da te</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> si è unito Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> fallito nel rubarti {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "Tocca per aprire", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> rimosso come amico</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>Colleziona {0} <img src='{1}_s'/> per vincere!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>Scommetti di più per ottenere più <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>Raccogli <img src='{0}_s'/> per scalare la classifica!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>Scommetti più alto per moltiplicare ogni <img src='{0}_s'/> che raccogli!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "Inizia a giocare per collezionare", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2>far entrare <img src='{0}_s' /></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "VINCITORE!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "Ecco cosa hai vinto:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "Il torneo è finito", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "Questa volta non hai vinto, ma hai comunque un premio!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "Doni raccolti", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "Portata", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "GRANDE PREMIO", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "Almeno una:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "Scambiabile", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "VAI A FARE IL COMMERCIO!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "ORA SONO SCAMBIABILI!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "Gruppo di Scambio di Carte", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "Pubblica quali cartoline ti mancano", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "Scambia carte duplicate", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "Vinci grandi ricompense!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "Fai nuove amicizie", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "Hai un coupon!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>Usa il coupon per comprare pacchetti e ottenere il {0}% in più di monete <color=#fefe28></color>, forzieri e giri <color=#64ebff></color>!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*Nuovi utenti, una sola volta!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "SPIN", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "Ricompense", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "Ottieni giri extra e monete nel gioco Slot", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "Ricompense giornaliere", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "Limite di recupero", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>look splendente con <color=#fed400></color> rosso e <color=#fed400>corona</color>!</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "ANNO", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "MESE", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "SETTIMANA", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP al prezzo specificato offre un abbonamento e offre Spin, Cibo e Carte ogni giorno. Questo è un abbonamento <color=#203d9b><u><on click=\"handle\" param=\"sub\">che si rinnova automaticamente</on></u></c>. Il pagamento viene addebitato al tuo account telefonico al momento della conferma. <color=#5e2802>L'abbonamento viene rinnovato a meno che non venga disattivato 24 ore prima della fine del periodo, e il tuo account verrà addebitato per il rinnovo.</c> Puoi disattivarlo nelle impostazioni del tuo account. Qualsiasi parte non utilizzata del periodo di prova gratuito, se offerta, verrà perduta quando l'utente acquista un abbonamento, dove applicabile. <color=#203d9b><u><on click=\"handle\" param=\"pri\">Informativa sulla privacy e Termini di utilizzo</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "CALDO", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "Inizia gratis", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3 giorni di prova gratuita, poi {0} al mese", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "Prendi questi OGNI GIORNO!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "GET ALL", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "Sblocca VIP per ottenere TUTTO il BONUS accumulato", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "Banca dei soldi", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "Sblocca\nLivello {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "Scambio\nLivello {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "Scambio", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "Sblocca il livello {0} da aprire", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "Scambio", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "Finiscono i soldi!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "Gratis", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "Guarda il video", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "Prendi Chance", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>30</color></size> bonus extra\nPrendi <size=46><color=#7ee0f4>5000+</color></size> giri!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "Ottieni molte ricompense di spin dopo aver acquistato il pass di livello!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "Per il regno {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "Carta jolly", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "Scegli una carta, qualsiasi carta!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "Set\nPremio", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "COMPLETA LA SERIE", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "Solo le carte da mostra che non ho", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "Lo prendo io!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "Scade in", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "La tua carta Jolly ti aspetta.\nScegli la carta che vuoi che sia prima che scada il tempo!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "Scegli ora", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "Hai scelto la carta {0} ", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "SET COMPLETI", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*Verrai ricompensato per qualsiasi set di carte completato durante l'evento", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": "1 su {0} forzieri contiene un", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) garantito uno!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "Può essere acquistato {0}o{1} volte a settimana", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "SCAMBIA LE TUE CARTE DUPLICATE\nPER ENTUSIASMO", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "SBLOCCA A\nREGNO {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "Squadra", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "Amici", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "Crea", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "Sfoglia", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "Cancella", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "Nome della squadra:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "Distintivo", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "Descrizione:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "Tipo di squadra:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "Stelle obbligatorie:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "Direttore", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "Open", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "Chiuso", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "Lascia", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "Unisciti", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "Squadra di visualizzazione", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "Visita", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "Rimuovere", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "Invita gli amici", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "Raccomandazione principale della squadra", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "Scegli il distintivo della squadra", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "Aiuto", // 【HelpWindow】-【title_label】
  "Guild_Request": "Richiesta", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "Scegli una carta da richiedere ai compagni di squadra", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "Scheda Richiesta", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} ha lasciato la squadra!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} si è unito al team!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "Membri:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "Non abbastanza ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "Puoi inserire solo le lettere!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "Il nome della squadra dovrebbe essere almeno 3 personaggi!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} dà una carta x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "Aggiungi amici", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "ELIMINA ACCOUNT E DATI", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "ATTENZIONE", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "Stai per cancellare il tuo account e tutti i dati.\n  Non può essere ripristinata dopo la cancellazione.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "AMICI", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "Elimina account", // 【MenuWindow】-【name】
  "setting_delete": "Elimina account", // 【SettingWindow】-【New Label】
  "BindTitle": "Account", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "Cambio conto", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "Dopo aver collegato il tuo account,\nPuoi giocare su altri dispositivi", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "Questo account social è collegato\n A un account di gioco.\n Puoi tornare a\n Il tuo account di gioco originale\n oppure contattaci per scollegarlo.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "Tocca [Cambia account] per accedere", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "Contattaci per liberarci", // 【AccountHintWindow】-【tip】
  "ShopDaily": "Speciali giornalieri", // 【ShopWindow】-【subtitle】
  "ShopGem": "Gem", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "Voce", // 【ShopWindow】-【New Label】
  "ShopHot": "Caldo", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "La quantità di forzieri Joker\nIn vendita settimanale è limitata", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "Nominarlo nuovo amministratore?", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>COUPON</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> PIÙ SPIN</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>TUO SCONTO</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Per un</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}% extra</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> Giri o Monete</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Tempo rimasto:  {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "Hai un coupon!\n Per {0}extra \nSpin o Monete", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "Candidati", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>Finché tutta la squadra <img src='bossyucha'/>\n raccoglie insieme, puoi ottenere il\n 'Squadra Forziere del Tesoro'!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "Premio Supremo", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "Per i tesori dell'abisso,\nTutta la squadra deve sconfiggere il mostro marino!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "La leggenda narra che l'immenso oceano\nnasconde tesori infiniti, e a\nottenerli, bisogna immergersi\nle profondità infinite e la sconfitta\nI mostri che sorvegliano l'abisso.\nRaccogli arpioni con la tua squadra\ne sconfiggi tutti i mostri!\n1. Per ottenere un arpione, devi attaccare e razziare.\n2. Usa l'arpione per sconfiggere il mostro, poi tocca il mostro per ricevere ricompense.\n3. Puoi entrare in classifica dopo aver inflitto danni elevati ai mostri.\n4. Più alto è il danno inflitto al mostro, maggiore è la ricompensa.\n5. Le ricompense della classifica verranno inviate alla cassetta postale dopo l'evento.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "Hai:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "Lo scambio di carte non ridurrà i tuoi progressi di gioco", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "Seleziona le carte per", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "Seleziona le carte per me", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "COMMERCIO", // 【CardTradeWindow】-【Label】
  "JackT_depart": "Partire", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "Gran Premio:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "Monte montepremi", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "Giochiamo e prendiamo delle ricompense!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "Rinunciare farà perdere tutti i premi!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "Altri due livelli saranno livelli bonus!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "Smettila", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "Rinascita", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "Sei sicuro di voler andartene?", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "Andate via senza nulla!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "Consigli", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "Jack prende un biglietto aereo per partire per un viaggio e si ritrova braccato dalla polizia. Evita la polizia e scegli la carta giusta per ottenere la ricompensa.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "I premi verranno aggiunti al montepremi. I giocatori possono scegliere di uscire dal gioco in qualsiasi momento e ricevere la ricompensa corrente.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "Dopo essere stati arrestati dalla polizia, i giocatori possono rianimarsi guardando una pubblicità o pagando. Puoi uscire dal gioco senza una ricompensa.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "Paga per rianimare e ottieni biglietti aerei e ricompense SUPER RICH.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "I livelli bonus verranno visualizzati in anteprima nel gioco.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "Continua", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "Raccogliete tutte le ricompense!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "Time out!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "VAI A", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "Ottieni una ricompensa!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "Devi lasciare la tua squadra attuale per unirti a una nuova.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "Classifica", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "Grado", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "Unisciti a una squadra, fatti amicizia e fai più giri e carte con i tuoi compagni!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "ISCRIVITI ORA", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff> completato il set </color><color=#FFBC06>{1}</color><color=#ffffff>! Congratulazioni!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff> comprato un </color><color=#FFBC06>{1}</color><color=#ffffff>! Ora sono molto ricchi!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff> comprato un </color><color=#FFBC06>{1}</color><color=#ffffff>. Benediamoli!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff> un </color><color=#FFBC06>{1}</color><color=#ffffff>! Congratulazioni!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>Incredibile!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> ha appena finito tutte le mappe!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "Sale di livello", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "Punti Compito", // 【脚本】-【game/items/Content.js】
  "story1": "Passaggio completato", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "Fai clic per continuare.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "Mappa 1 Edificio 1 Titolo del Capitolo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "Mappa 1 Edificio 2 Titolo del Capitolo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "Mappa 1 Edificio 3 Titolo del Capitolo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "Mappa 1 Edificio 4 Titolo del Capitolo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "Mappa 1 Edificio 5 Titolo del Capitolo", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "Informazioni sui giocatori", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "Avatar", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "Avatar Frame", // 【AvatarWindow】-【New Label】
  "Button_Save": "Salva", // 【AvatarWindow】-【New Label】
  "EditNickName": "Modifica il tuo soprannome", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "Livello {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>Tocca un pezzo per leggere i dettagli qui</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "generato da", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "Generazione aggiuntiva dopo l'aggiornamento", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "Può generare", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "Sa cucinare", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "Stoccaggio", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "Aggiungi", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "Scatola di selezione aperta", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "Seleziona una delle seguenti ricompense", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "Metodo di produzione", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "Tocca le pentole per raccogliere il prodotto finito.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "Suggerimento", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "Se hai già un account collegato,\n Puoi accedere a quell'account\n per continuare a giocare.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "Questo account contiene i dati di gioco", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "Collegamento/commutazione fallito", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "Il conto corrente è già vincolato a questi dati di partita", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "Benvenuto", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "Unisci questi pezzi", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "Tocca il generatore", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "Ordine completato", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "Farlo scoppiare?", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "Rompi", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "Annulla", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "Rimanenti", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "Intervallo di aggiornamento", // 【ShopWindow】-【New Label】
  "ShopOver": "Esaurito", // 【ShopWindow】-【price】
  "ShopFree": "Gratis", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "Completato", // 【mergeUI】-【New Label】
  "ShopSpin": "Acquista energia", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "Questa carta è d'oro.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "Hai raggiunto il limite giornaliero di carte che puoi inviare.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
