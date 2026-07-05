const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "Démarrer", // 【未找到预制】-【脚本或动态使用】
  "Score": "Score", // 【未找到预制】-【脚本或动态使用】
  "Restart": "Redémarrage", // 【未找到预制】-【脚本或动态使用】
  "Loading": "Chargement", // 【DownloadingWindow】-【New Label】
  "Cancel": "Annuler", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "Confirmer", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "Réessayer", // 【未找到预制】-【脚本或动态使用】
  "Back": "Retour", // 【未找到预制】-【脚本或动态使用】
  "Accept": "Accepter", // 【未找到预制】-【脚本或动态使用】
  "Level": "Niveau", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "Rang", // 【未找到预制】-【脚本或动态使用】
  "Rank": "Rang", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "Points", // 【未找到预制】-【脚本或动态使用】
  "OK": "OK", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "OUI", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "NON", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "Oui", // 【未找到预制】-【脚本或动态使用】
  "No": "Non", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "Collecter", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "Félicitations!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "et", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "RÉESSAI", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "OFF", // 【未找到预制】-【脚本或动态使用】
  "MORE": "PLUS", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "Cette fonctionnalité n’est pas encore disponible.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "Joueur", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "Le paiement est désactivé!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "Le paiement n’est activé que sur Android!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "Le paiement est désactivé sur iOS!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "Désolé, la fonction de paiement est actuellement incompatible avec votre système. Veuillez entrer Coin Gang via Instant Games sur un ordinateur pour finaliser votre achat.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "Merci pour votre achat!", // 【PaySuccessWindow】-【label】
  "PayFail": "Achat échoué!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "Votre achat est en attente! Après avoir effectué le paiement, redémarrez le jeu pour recevoir vos objets.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\nOFF", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "La vidéo n’est pas prête!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "Besoin d’accès", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "Nous avons besoin de vos informations", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "Autoriser l’accès", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "Cette fonction est actuellement incompatible avec votre version client. Merci de mettre à jour WeChat.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "Hé, c’est vraiment un jeu génial! Jouons ensemble:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "Hé, c’est vraiment un jeu génial! Jouons ensemble:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} vous a juste fait tourner:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} t’a juste donné quelques pièces:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "Je viens de construire un nouveau royaume! Viens nous rendre visite:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "WAOUH! Je viens de voler {0} pièces! Trop cool:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "WAOUH! Je viens d’attaquer un autre royaume! Trop cool:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "Partager", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "Invitation", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "Envoyer", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} t’a juste donné des cartes:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "Échec de la connexion au serveur, réessayer?", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "Échec de connexion au serveur.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "Connexion perdue au serveur.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "Succès", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "Achat raté", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "Échec de charger les ressources {0}. Réessayer?", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} ans", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} mois", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} jours", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} heures", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} minutes", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} secondes", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": " Il y a{0}", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": " Il y a{0}mois", // 【未找到预制】-【脚本或动态使用】
  "PastDay": " Il y a{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": " Il y a{0}h", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": " Il y a{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": " Il y a{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "Maintenant", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}y", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}mo", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}h", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}s", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "Maintenant", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "JEU", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "Invité", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "Il y a quelques mises à jour.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "Chargement", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "Connexion avec l’invité", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "Connectez-vous avec Apple", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "Connectez-vous avec Facebook", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "Connectez-vous avec Google Play", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "Pièces", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "Tours", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "Bouclier", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "Carte", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "Coffre en bois", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "Coffre d'argent", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "Coffre d'or", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "COFFRE GRATUIT!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "Objets", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "Objet", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "Cannonball", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "Envoyer", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} tourne dans {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "Auto", // 【slot】-【New Label】
  "ToRaidUserBet": "VICTOIRE X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "TOUS GAGNENT X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "PARIER", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "Plein", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} Tourne", // 【未找到预制】-【脚本或动态使用】
  "Shield": "BOUCLIER", // 【未找到预制】-【脚本或动态使用】
  "Attack": "ATTAQUE", // 【未找到预制】-【脚本或动态使用】
  "Spins": "TOURS+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "RAID", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "LOLLI", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. Vous pouvez en recevoir chaque mois\n     Récompenses de connexion\n     7 jours dans un mois.\n2. Les récompenses mensuelles d’inscription seront\n     Actualisez le mois prochain.\n3. Tu peux en avoir chaque semaine\n     Récompenses de connexion chaque jour\n     Dans une semaine.\n4. Les récompenses hebdomadaires d’inscription seront\n     Actualise la semaine prochaine.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "Regardez une vidéo et obtenez des pièces", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "TOURNAGE GRATUIT", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "Tourne pour {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "Rotation libre dans\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "Dix fois mieux!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "COLLECTER", // 【dailyBonus】-【text】
  "DailyBonusLevel": "Niveau {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "Au moins 25 millions de pièces la première fois!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "ACHETER", // 【btnBuild】-【New Label】
  "BuildButtonFix": "FIX", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "À court de pièces?", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "Tu n’as plus de vrilles?", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} Tournes", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "Ou attendre {1} {0} tours", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "Attendez {1} {0} tours", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\nPLUS", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "MENU", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "JEU", // 【MenuWindow】-【name】
  "menu_1_village": "ROYAUME", // 【MenuWindow】-【name】
  "menu_2_buy": "ACHETER DES PIÈCES/SPINS", // 【MenuWindow】-【name】
  "menu_3_daily": "BONUS QUOTIDIEN", // 【MenuWindow】-【name】
  "menu_4_shop": "ÉVOLUTION DU ROYAUME", // 【MenuWindow】-【name】
  "menu_5_news": "MESSAGE", // 【MenuWindow】-【name】
  "menu_6_gifts": "CADEAU", // 【MenuWindow】-【name】
  "menu_7_card": "CARTE", // 【MenuWindow】-【name】
  "menu_8_map": "CARTE", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "CLASSEMENT", // 【MenuWindow】-【name】
  "menu_10_invite": "INVITATION", // 【MenuWindow】-【name】
  "menu_11_setting": "UNIVERS", // 【MenuWindow】-【name】
  "setting_title": "Décors", // 【SettingWindow】-【New Label】
  "setting_sound": "Son", // 【SettingWindow】-【New Label】
  "setting_music": "Musique", // 【SettingWindow】-【New Label】
  "setting_notifications": "Notifications", // 【SettingWindow】-【title】
  "setting_raid": "Raid & Attaque", // 【SettingWindow】-【New Label】
  "setting_general": "Généralités", // 【SettingWindow】-【New Label】
  "setting_language": "Langue", // 【SettingWindow】-【title】
  "setting_english": "Anglais", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "Aimez-nous et ne ratez pas ça\nDes événements et des cadeaux incroyables", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "COMME", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "Tutoriel", // 【SettingWindow】-【New Label】
  "setting_support": "Soutien", // 【SettingWindow】-【New Label】
  "setting_privacy": "Conditions générales et confidentialité", // 【SettingWindow】-【New Label】
  "setting_terms": "Conditions générales", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "Contactez-nous", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "Déconnectez-vous", // 【SettingWindow】-【Txt】
  "setting_change": "Changement", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "Effacer le cache", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "Paramètres de confidentialité", // 【SettingWindow】-【New Label】
  "setting_language_title": "Langue", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "Anglais", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "Chinois", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "Espagnol", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "Deutsch", // 【SettingLanguageWindow】-【label】
  "invite_title": "Vous voulez plus de tours?", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>Invitez des amis et obtenez</color><color=#ff99f9><outline color=#471f01 width=3>{0}</outline></color><color=#f1edff> de tours gratuits pour chaque ami qui se débloque\nRoyaume 2!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>Invitez des amis et obtenez</color><color=#ff99f9><outline color=#471f01 width=3>{0} tours gratuits</outline></color><color=#f1edff> pour chaque ami qui participe au jeu!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "INVITATION", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* Tu auras une récompense après ton ami\nse connecte via Facebook", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "Connectez-vous avec Facebook", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "CONNECTER", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "Nous ne publierons pas en votre nom", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "Connectez-vous et profitez de tours gratuits", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "Tu es sûr?", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "Les invités ne peuvent pas jouer avec des amis", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "Jeu en tant qu’invité", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "Amis", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "Pays", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "Mondial", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "Dons", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "Tours gratuits", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "Pièces libres", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "Cartes", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "Invitation", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "Envoyer", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "Collectez", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "Collecter / Envoyer tout", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "Collectez tout", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "Invitez des amis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "Obtenez des tours gratuits", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "Tours quotidiens collectés {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "Pièces quotidiennes collectées {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "Cadeau de tour gratuit", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "Te faire {0} tour", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "Pièces gratuites", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "Je t’envoie {0} pièces", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "Envoyer des cartes\nÀ tes amis", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "Je t’envoie une carte", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "Tu dois atteindre Kingdom {0} pour récupérer cette carte", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "Boutique", // 【ShopWindow】-【title_label】
  "ShopSpins": "Tours", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "Pièces", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "Coffres", // 【ShopWindow】-【New Label】
  "ShopTreats": "Friandises", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} TOURNE", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}% de plus", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": " Activation{0}h", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "Boutique de pièces", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "Niveau {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\nPLUS", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "VENTE", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "Coffres déverrouillés à Kingdom {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "Récompenses Débloquer au Kingdom {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "Populaire", // 【ShopWindow】-【New Label】
  "ShopBestValue": "Meilleur rapport qualité-prix", // 【ShopWindow】-【New Label】
  "village_news_title": "Message", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> attaqué ton royaume</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> n’a pas attaqué ton royaume</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> t'{1} volé</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> rejoint Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> n’a pas réussi à te voler {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "Royaume", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "Courrier", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>Expirer dans </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "Expirer dans {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "LES NOUVEAUX ROYAUMES SONT\nBIENTÔT", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "Vengeance!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "Attaquez votre ami!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "Aléatoire", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "Vengeance", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "Attaque", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "Regardez une vidéo et obtenez", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} TOURS", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} PIÈCES", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "REGARDEZ", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "Royaume complet!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "Suivant", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "RÉCOMPENSE D’AMI", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} débloqué un nouveau royaume! Tu as\n{1} TOURS GRATUITS", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0} rejoint le jeu! Tu as\n{1} TOURS GRATUITS", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "Monte un objet de niveau pour obtenir une étoile.\n\nCollectez 25 étoiles pour débloquer le prochain royaume.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "Tu n’as pas assez de pièces...\n\nGlissez vers le bas pour gagner plus de pièces.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "Utilisez la machine à sous pour tourner, attaquer et attaquer les autres.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "Attaquez les royaumes des autres joueurs pour obtenir des pièces.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "Les boucliers protégeront votre royaume des attaques.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "Pillez le royaume du roi et volez ses pièces!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "Voici le Roi\nAttaquons-le!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "TON PREMIER ROYAUME", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "Bienvenue, mon ami!\n\nAppuyez sur le bouton pour commencer votre travail.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "Cible", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "Succès!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "Vos récompenses:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200 tours!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20 tours!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "1 million de pièces!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "Sauve la progression!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "Jouez avec vos amis!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "ROTATION AUTOMATIQUE", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "Maintenez le bouton pour démarrer", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "Essaie!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "Offre surprise", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "Temps restant", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} Pièces", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} Spins", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "Il reste du temps de vente {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>Attaque {0} fois pour obtenir\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>Plus vous terminez de barres, plus les</color></outline><outline color=#b74800 width=2><color=#fff000>RÉCOMPENSES SONT importantes!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "Prix final du barreau:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} Des pièces!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "Misez plus haut et obtenez plus vite!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "COMPRIS!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "Ça se termine par {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>Raid {0} temps pour obtenir\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "Complète pour recevoir des récompenses!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "Attaque", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "Attaque bloquée", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "Excellent Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "Touchez 3 symboles", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>Tu as des récompenses\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "CARTE\nCOLLECTION", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "Achèvement", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "Déblocages à\nRoyaume {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* Touchez sur une carte en double pour l’envoyer à un ami", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- ENSEMBLE TERMINÉ -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "Terminez la série pour gagner", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "Demandez", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "Envoyer", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "On ne peut pas demander cela à des amis", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "Cette carte est en or, impossible à demander à des amis", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "Il ne peut pas être envoyé à des amis", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "Cette carte est en or, ne peut pas être envoyée à des amis", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "Vous avez atteint la limite quotidienne de cartes que vous pouvez envoyer", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "Il faut plus d’une carte pour envoyer", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "GÉNIAL!", // 【CardCollectWindow】-【title】
  "CardCollectDes": "Carte {0}\na été ajouté à votre album", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "Regarde ça", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "ENVOIE DES CARTES", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "Sélectionnez un ami!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "Sélection de carte", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "ENVOIE DES CARTES", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "Choisissez jusqu’à {0} cartes!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "Vos cartes sélectionnées:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "Carte envoyée avec succès!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "Informations sur les cartes", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "Collectez des cartes via les coffres", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "Vous pouvez aussi acheter des coffres dans la boutique", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "On peut trouver des coffres lors des raids et lors du déblocage d’un nouveau royaume", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "Posséder deux cartes ou plus de la même carte vous permet de les offrir à vos amis", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "Tapez sur la carte pour l’offrir", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "Vous pouvez aussi demander à vos amis des cartes manquantes", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "Vous pouvez envoyer jusqu’à 5 cartes en une journée", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "Les étoiles indiquent la rareté des cartes", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "Chaque étoile de rareté sur une nouvelle carte collectée vous donne 1 étoile", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "Complétez les ensembles de cartes et obtenez des récompenses incroyables!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "Commun", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "Rare", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "Coffre en bois", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "Coffre d’Argent", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "Coffre d’Or", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "Risque élevé de:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "Nouveau", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>Collectez des cartes pour obtenir plus de pièces <color=#fff000></color> et <color=#77e7ff>de tours</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>Collectez des cartes pour obtenir plus de pièces <color=#b85b00></color> et <color=#0073d4>Spins</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "Rechercher le nom de l’ami", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "Pas d’amis", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang t’a offert des pièces et des spins!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "Centre de Quête", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "Les tâches se rafraîchissent un nouveau jour. Veuillez rouvrir la fenêtre.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "Quotidien", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "Invitation", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "Signe", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8 jours", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15 jours", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22 jours", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28 jours", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "Jour 1", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "Jour 2", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "Jour 3", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "Jour 4", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "Jour 5", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "Jour 6", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "Jour 7", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "SIGNE", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "SIGNÉ", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "Quête principale: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "But: {0}\nRécompense: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "Collectez", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "GO", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": "Rafraîchissement dans {0}", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "Centre d’activités", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "Temps restant: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "Fin dans: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "L’activité est terminée", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "QUÊTE", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "ACTIVITÉ", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "Vous avez des tours complets!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "Nous avons assez de tours pour jouer et gagner plus de pièces!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "Un bonus quotidien est disponible dès maintenant!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "Venez jouer à Wheel of Fortune tous les jours!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "Vengeons-nous!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "Quelqu’un a envahi ton royaume!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "L’activité va se terminer!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} se termine dans une heure!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "Ça fait longtemps!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "Il y a beaucoup de nouveaux événements. Et nous avons préparé un grand cadeau pour vous!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "Viens jouer avec moi!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "Reviens! Nous avons préparé un grand cadeau pour vous!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "Nouvelle mise à jour", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "Nous avons corrigé la fonction d’achat intégré à l’application et ajouté de nouveaux événements.\nTous les autres joueurs ont téléchargé et joué à la nouvelle version. Toutes vos données ont été transférées vers la nouvelle version.\nMerci.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "MISE À JOUR", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "Non, merci", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "Tu aimes Coin Gang?", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "Appuyez sur une étoile pour l’évaluer en magasin.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "SOUMETTRE", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "PAS MAINTENANT", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "Chargement de ressource échoué. Réessayer?", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "ALLEZ!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "Effectuez n’importe quel achat pour", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "OBTENEZ DES RÉCOMPENSES SUPPLÉMENTAIRES!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "ACHETEZ MAINTENANT!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "Bienvenue à Coin Gang!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>Nous avons préparé un\n<color=#ffe62b>GRAND CADEAU</c> pour toi~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "Mise à niveau", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "Sélectionner", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "Augmente la récompense des raids", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● Augmente la récompense de: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "Augmente la récompense des attaques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● Augmente la récompense de: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "Protège contre les attaques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● Chance de protection: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "Protège contre les raids", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● Chance de protection: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● Niveau suivant: {0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>Engagez des domestiques pour obtenir plus de pièces <color=#ffe615></color> et <color=#0ce4fe>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>Engagez des domestiques pour obtenir plus de pièces <color=#e67b07></color> et <color=#006fd7>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "Mise à niveau:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "Chaque tour de machine à sous = 1 serviteur EXP. Tu peux utiliser des potions pour obtenir plus de EXPde Servant. Quand la barre de EXP Servant est pleine, appuyez sur le bouton Upgrade pour améliorer votre servant. Chaque amélioration de serviteur augmentera votre étoile de jeu.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "Compétence:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "La compétence du Serviteur s’améliore à chaque amélioration de niveau", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "Activation:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "Nourrissez votre serviteur pour l’activer. Obtenez de la nourriture de serviteur en filant et en construisant.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "Tourne pour gagner jusqu’à", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "pour une {0}supplémentaire ", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "J’ai un cadeau pour toi!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "Le perroquet Peter t’apportera un cadeau au hasard!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "Il suffit de toucher Peter pour recevoir le cadeau quand il viendra!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "Obtenez un bouclier gratuit!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "Donne-moi à manger!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "Gratuit", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "PRENEZ CHAQUE OFFRE POUR EN RÉVÉLER DAVANTAGE", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "Débloquez en achetant une offre précédente", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "Limite de mise augmentée", // 【slot】-【Label - Msg】
  "SlotBetSuper": "SUPER", // 【slot】-【New Label】
  "I18N_BUY_NOW": "ACHETER MAINTENANT", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>jusqu’à 20 % de pièces et de spins en plus</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>jusqu’à 20 % de pièces et de spins en plus</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>Pariez plus haut pour multiplier tout ce que vous collectez! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>Pariez plus haut pour multiplier tout ce que vous collectez! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "La carte Joker est disponible pour remplacer la carte limitée.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "PROFITER DE COIN GANG", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "Saisissez le texte ici...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>OBTENEZ <color=#ffffff>{0}% DE RÉCOMPENSES SUPPLÉMENTAIRES</color> POUR N’IMPORTE QUEL ENSEMBLE DE CARTES QUE VOUS COMPLÉTEZ!</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "REJOINDRE LE GROUPE", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "Rejoignez notre", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>Prenez les cartes dans ces coffres! Ces coffres ne sont disponibles que pendant l’événement! Vous pouvez obtenir ces coffres spéciaux en boutique et dans d’autres événements.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>Ensembles de cartes à temps limité</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "Vas-y!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>Utilisez un coupon pour acheter des packs et obtenir 100 % de pièces en plus, coffres et tours!</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "Supprimer", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "Saisissez « Supprimer » pour confirmer la suppression de votre compte!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "Suivez le compte officiel pour les dernières actualités", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "Entrez le code d’invitation d’un ami pour recevoir une récompense!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "Vérifie le code d’invitation", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "Code d’invitation", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "Achetez un Big Pack, recevez-en deux gratuits!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "À l’aide", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "Terminez les tâches limitées du jour pour débloquer des missions à plus de points!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "Activez", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "Niveau d’achat", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "Recevoir", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "Gratuit", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "Pass", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "Stage {0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "Niveau: Max", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "Monter de niveau", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "Phase Bonus", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "Moderniser les bâtiments", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*Vous ne pouvez acheter qu’un seul paquet.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>CARTE JOKER</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "SUCCÈS", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "APPUYEZ POUR CONTINUER", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "Récompenses quotidiennes", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "Description de la fonctionnalité", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "Fusionnez à côté du sable pour débloquer des récompenses!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3 jours d’essai gratuit, puis 16,99 $ par mois", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "Nom du bâtiment", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "Aperçu des récompenses", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "Récompenses finales", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "COLLECTÉ", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "Des problèmes d’achat?", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "Contactez le support", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "Regardez trop de vidéos aujourd’hui", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "Dollars", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "Carte aléatoire", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "Carte d’or", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "Coffre Magique", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "Servante", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "PROTECTION PAR LA ROUTE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "ICE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "BALL", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "BIENVENUE!", // 【dailyBonus】-【Text】
  "menu_12_sign": "CALENDRIER DE RÉCOMPENSES", // 【MenuWindow】-【name】
  "setting_lowbattery": "Mode basse consommation", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "Activer le mode basse consommation réduit la consommation d’énergie mais diminue les performances.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "Restaurer l’achat", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "Exposition VIP Couronne", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "Pour jouer Coin Gangster,\nVeuillez confirmer", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    En continuant, je reconnais que Happy Donut peut stocker et traiter mes données conformément à la <color=#ffffff><u><on click='privacyHandler'>Politique de confidentialité</on></u></color>.\n\nJ'ai lu et j'accepte les <color=#ffffff><u><on click='termHandler'>Conditions générales</on></u></color>, qui établissent un contrat et incluent une renonciation aux recours collectifs et une clause d'arbitrage.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "Français", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "Chinois traditionnel", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "Japonais", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "Italien", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "Portugais", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*Mise à jour dans 10 minutes", // 【LeaderboardWindow】-【note】
  "ShopShield": "Super\nBouclier", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "BOUCLIERS D’ARGENT", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "BOUCLIERS D’OR", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "Protégez votre royaume", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "Protégez-vous contre:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>Attaques et <color=#288bdf>Raids</color> (exclusif)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "Super Bouclier protège votre royaume des attaques et raids pendant longtemps.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> attaqué ton royaume</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> échoué à attaquer ton royaume</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> t'{1} volé</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> rejoint Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> n’a pas réussi à te voler {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "Appuyez pour ouvrir", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> t’a retiré de ton amie</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>Collectez {0} <img src='{1}_s'/> pour gagner!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>Pariez plus cher pour gagner plus <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>Collectez <img src='{0}_s'/> pour grimper au classement!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>Pariez plus haut pour multiplier chaque <img src='{0}_s'/> que vous collectez!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "Commencez à jouer pour collectionner", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2>faire <img src='{0}_s' /> rejoindre</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "GAGNANT!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "Voici ce que vous avez gagné:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "Le tournoi est terminé", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "Tu n’as pas gagné cette fois, mais tu as quand même un prix!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "Dons recueillis", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "Portée", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "GRAND PRIX", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "Au moins un:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "Échangeables", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "ALLEZ FAIRE UN ÉCHANGE!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "SONT MAINTENANT ÉCHANGEABLES!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "Groupe de Trading de Cartes", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "Affiche les cartes qui te manquent", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "Échangez des cartes en double", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "Gagnez de superbes récompenses!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "Fais-toi de nouveaux amis", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "Vous avez un coupon!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>Utilisez un coupon pour acheter des packs et obtenir {0}% de pièces <color=#fefe28>en plus</color>, coffres et <color=#64ebff>tours</color>!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*Nouveaux utilisateurs, une seule fois!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "SPIN", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "Récompenses", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "Obtenez des tours et des pièces supplémentaires dans le jeu de machines à sous", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "Récompenses quotidiennes", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "Limite de récupération", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>look brillant avec <color=#fed400></color> rouge et <color=#fed400>couronne</color>!</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "ANNÉE", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "MOIS", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "SEMAINE", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP au prix spécifié propose un abonnement et propose des tours, de la nourriture et des cartes chaque jour. Il s’agit d’un <color=#203d9b><u><on click=\"handle\" param=\"sub\">d’abonnement à renouvellement automatique</on></u></c>. Le paiement est facturé sur votre compte téléphonique lors de la confirmation. <color=#5e2802>L’abonnement est renouvelé à moins d’être désactivé 24 heures avant la fin de la période, et votre compte sera facturé pour le renouvellement.</c> Vous pouvez le désactiver dans les paramètres de votre compte. Toute partie inutilisée d’une période d’essai gratuite, si proposée, sera perdue lorsque l’utilisateur achète un abonnement, le cas échéant. <color=#203d9b><u><on click=\"handle\" param=\"pri\">Politique de confidentialité et Conditions d’utilisation</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "CHAUD", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "Commencez gratuitement", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3 jours d’essai gratuit, puis {0} par mois", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "Recevez-les TOUS LES JOURS!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "GET ALL", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "Débloquez VIP pour obtenir TOUT le BONUS accumulé", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "Banque d’argent", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "Déverrouiller\nNiveau {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "Échange\nNiveau {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "Échange", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "Débloquer le niveau {0} à ouvrir", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "Échange", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "Plus de dollars!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "Gratuit", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "Regarder la vidéo", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "Get Chance", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>30</color></size> bonus supplémentaires\nJe prends tout à fait <size=46><color=#7ee0f4>5000+</color></size> tournées!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "Obtenez beaucoup de récompenses de spin après avoir acheté le pass de niveau!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "Pour le royaume {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "Carte Joker", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "Choisis une carte, n’importe laquelle!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "Décor\nPrix", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "COMPLÉTEZ LA SÉRIE", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "Seulement des cartes de présentation que je n’ai pas", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "Je le prends!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "Expire en", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "Ta carte Joker t’attend.\nChoisissez la carte que vous voulez qu’elle soit avant la fin du temps!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "Choisissez maintenant", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "Tu as choisi la carte {0} ", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "ENSEMBLES COMPLETS", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*Vous serez récompensé pour tout ensemble de cartes complété pendant l’événement", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": "1 des {0} coffres contient un", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) un garanti!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "Peut être acheté {0}/{1} fois par semaine", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "ÉCHANGEZ VOS CARTES EN DOUBLE\nPOUR EXCITER", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "DÉVERROUILLE À\nROYAUME {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "Équipe", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "Amis", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "Créer", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "Parcourez", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "Annuler", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "Nom de l’équipe:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "Insigne", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "Description:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "Type d’équipe:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "Étoiles obligatoires:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "Rédacteur en chef", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "Ouvre", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "Fermé", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "Partez", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "Rejoignez", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "Équipe de visionnement", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "Visite", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "Retirer", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "Invitez des amis", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "Meilleure recommandation d’équipe", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "Choisir l’insigne d’équipe", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "À l’aide", // 【HelpWindow】-【title_label】
  "Guild_Request": "Demande", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "Choisissez une carte à demander à vos coéquipiers", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "Carte de demande", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} a quitté l’équipe!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} a rejoint l’équipe!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "Membres:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "Pas assez ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "Vous pouvez seulement entrer des lettres!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "Le nom de l’équipe doit comporter au moins 3 personnages!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} donne une carte x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "Ajouter des amis", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "SUPPRIMER COMPTE & DONNÉES", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "AVERTISSEMENT", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "Vous êtes sur le point de supprimer votre compte et toutes vos données.\n  Il ne peut pas être restauré après suppression.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "AMIS", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "Supprimer le compte", // 【MenuWindow】-【name】
  "setting_delete": "Supprimer le compte", // 【SettingWindow】-【New Label】
  "BindTitle": "Compte", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "Compte de changement", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "Après avoir lié votre compte,\nVous pouvez jouer sur d’autres appareils", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "Ce compte de réseau social est lié\n vers un compte de jeu.\n Vous pouvez revenir à\n Votre compte de jeu original\n ou contactez-nous pour le délier.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "Appuyez sur [Changer de compte] pour vous connecter", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "Contactez-nous pour délier", // 【AccountHintWindow】-【tip】
  "ShopDaily": "Spéciaux du jour", // 【ShopWindow】-【subtitle】
  "ShopGem": "Gem", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "Objet", // 【ShopWindow】-【New Label】
  "ShopHot": "Chaud", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "Le nombre de coffres du Joker\nEn vente hebdomadaire est limitée", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "Le nommer nouvel admin?", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>COUPON</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> PLUS DE TOURS</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>VOTRE REMISE</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Pour un</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}% supplémentaire</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> Tours ou Pièces</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Temps restant:  {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "Vous avez un coupon!\n Pour un {0}supplémentaire \nÉpis ou pièces", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "Postulez", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>Tant que toute l’équipe <img src='bossyucha'/>\n collecte, vous pouvez obtenir le\n 'Coffre au trésor' de l’équipe!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "Prix ultime", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "Pour les trésors des profondeurs,\nToute l’équipe doit vaincre le monstre marin!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "La légende raconte que l’immense océan\ncache des trésors sans fin, et à\nObtenez-les, il faut s’y plonger\nLes profondeurs sans fin et la défaite\nLes monstres gardant l’abîme.\nCollectez des harpons avec votre équipe\nEt vaincre tous les monstres!\n1. Pour obtenir un harpon, il faut attaquer et attaquer.\n2. Utiliser le harpon pour vaincre le monstre, puis le taper pour recevoir des récompenses.\n3. Vous pouvez entrer dans le classement après avoir infligé de gros dégâts aux monstres.\n4. Plus les dégâts infligés au monstre sont élevés, plus la récompense est élevée.\n5. Les récompenses du classement seront envoyées à la boîte aux lettres après l’événement.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "Vous avez:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "Le trading de cartes ne diminuera pas votre progression dans la partie", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "Sélectionner les cartes pour", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "Sélectionnez des cartes pour moi", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "COMMERCE", // 【CardTradeWindow】-【Label】
  "JackT_depart": "Départ", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "Grand Prix:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "Cagnotte", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "Jouons et recevons des récompenses!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "Abandonner fera perdre tous vos prix!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "Deux niveaux supplémentaires seront des niveaux bonus!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "Arrête", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "Renaissance", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "Tu es sûr de vouloir partir?", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "Pars sans rien!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "Conseils", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "Jack prend un billet d’avion pour partir en voyage et se retrouve traqué par la police. Évitez la police et choisissez la bonne carte pour obtenir la récompense.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "Des prix seront ajoutés à la cagnotte. Les joueurs peuvent choisir de quitter le jeu à tout moment et recevoir la récompense actuelle.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "Après avoir été arrêtés par la police, les joueurs peuvent ressusciter en regardant une publicité ou en payant en payant une annonce. Vous pouvez quitter le jeu sans récompense.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "Payer pour la réanimation, obtenir des billets d’avion et des récompenses SUPER RICHES.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "Les niveaux bonus seront présentés en avant-première dans le jeu.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "Continuez", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "Collectez toutes les récompenses!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "Temps mort!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "ALLEZ À", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "Obtenez une récompense!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "Vous devez quitter votre équipe actuelle pour en rejoindre une nouvelle.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "Classement", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "Grade", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "Rejoignez une équipe, faites-vous des amis, et faites plus de tours et de cartes avec vos coéquipiers!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "REJOIGNEZ-VOUS MAINTENANT", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff> terminé le </color><color=#FFBC06>{1}</color><color=#ffffff> set! Félicitations!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff> acheté un </color><color=#FFBC06>{1}</color><color=#ffffff>! Ils sont très riches maintenant!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff> acheté un </color><color=#FFBC06>{1}</color><color=#ffffff>. Bénissons-les!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff> a un </color><color=#FFBC06>{1}</color><color=#ffffff>! Félicitations!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>Incroyable!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> vient de finir toutes les cartes!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "Monte de niveau", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "Points de tâche", // 【脚本】-【game/items/Content.js】
  "story1": "Étape terminée", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "Cliquez pour continuer.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "Carte 1 Bâtiment 1 Titre du chapitre", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "Carte 1 Bâtiment 2 Titre du chapitre", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "Carte 1 Bâtiment 3 Titre du chapitre", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "Carte 1 Bâtiment 4 Titre du chapitre", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "Carte 1 Bâtiment 5 Titre du chapitre", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "Informations sur les joueurs", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "Avatar", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "Avatar Frame", // 【AvatarWindow】-【New Label】
  "Button_Save": "Sauvegarder", // 【AvatarWindow】-【New Label】
  "EditNickName": "Modifier votre surnom", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "Niveau {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>Touchez une pièce pour lire les détails ici</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "Généré à partir de", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "Génération supplémentaire après mise à niveau", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "Peut générer", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "Sait cuisiner", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "Stockage", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "Ajouter", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "Boîte de sélection ouverte", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "Sélectionnez l’une des récompenses suivantes", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "Méthode de production", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "Tapez sur la batterie pour récupérer le produit fini.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "Indice", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "Si vous avez déjà un compte lié,\n Vous pouvez vous connecter à ce compte\n pour continuer à jouer.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "Ce compte contient des données de jeu", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "Échec de la liaison/commutation", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "Le compte courant est déjà lié à ces données de jeu", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "Bienvenue", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "Fusionne ces pièces", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "Touchez le générateur", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "Commande terminée", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "Le faire éclater ?", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "Casser", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "Annuler", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "Restant", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "Intervalle d'actualisation", // 【ShopWindow】-【New Label】
  "ShopOver": "Épuisé", // 【ShopWindow】-【price】
  "ShopFree": "Gratuit", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "Terminé", // 【mergeUI】-【New Label】
  "ShopSpin": "Acheter de l'énergie", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "Cette carte est en or.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "Vous avez atteint la limite quotidienne de cartes que vous pouvez envoyer.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
