const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "INICIO", // 【未找到预制】-【脚本或动态使用】
  "Score": "Puntuación", // 【未找到预制】-【脚本或动态使用】
  "Restart": "Reinicio", // 【未找到预制】-【脚本或动态使用】
  "Loading": "Cargando", // 【DownloadingWindow】-【New Label】
  "Cancel": "Cancelar", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "Confirmar", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "Reintentar", // 【未找到预制】-【脚本或动态使用】
  "Back": "Atrás", // 【未找到预制】-【脚本或动态使用】
  "Accept": "Aceptar", // 【未找到预制】-【脚本或动态使用】
  "Level": "Nivel", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "Rango", // 【未找到预制】-【脚本或动态使用】
  "Rank": "Rango", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "Puntos", // 【未找到预制】-【脚本或动态使用】
  "OK": "Vale", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "SÍ", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "NO", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "Sí", // 【未找到预制】-【脚本或动态使用】
  "No": "No", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "Recoger", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "¡Enhorabuena!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "y", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "REINTENTO", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "FUERA", // 【未找到预制】-【脚本或动态使用】
  "MORE": "MÁS", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "Esta función aún no está disponible.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "Jugador", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "¡El pago está deshabilitado!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "¡El pago solo está habilitado en Android!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "¡El pago está deshabilitado en iOS!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "Lo siento, la función de pago es actualmente incompatible con tu sistema. Por favor, introduce Coin Gang a través de Instant Games en un ordenador para completar tu compra.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "¡Gracias por tu compra!", // 【PaySuccessWindow】-【label】
  "PayFail": "¡Compra fallida!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "¡Tu compra está pendiente! Tras completar el pago, reinicia el juego para recibir tus objetos.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\nFUERA", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "¡El vídeo no está listo!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "Necesito acceso", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "Necesitamos tu información", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "Permitir el acceso", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "Esta función es actualmente incompatible con tu versión cliente. Por favor, actualiza WeChat.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "¡Oye, este es realmente un juego increíble! Juguemos juntos:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "¡Oye, este es realmente un juego increíble! Juguemos juntos:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} solo te he dado unas vueltas:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} te acabo de dar unas monedas:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "¡Acabo de construir un nuevo reino! Ven a visitar:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "¡VAYA! ¡Acabo de robar {0} monedas! Qué guay:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "¡VAYA! ¡Acabo de atacar otro reino! Qué guay:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "Compartir", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "Invitación", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "Envía", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} solo te dio tarjetas:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "¿No se ha conseguido conectar al servidor, intentarlo de nuevo?", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "No se ha podido conectar al servidor.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "Pérdida de conexión al servidor.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "Éxito", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "Compra fallida", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "No se pudo cargar {0}de recursos. ¿Intentarlo de nuevo?", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} años", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} meses", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} días", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} horas", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} minutos", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} segundos", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": "{0}hace un año", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": " Hace{0}mes", // 【未找到预制】-【脚本或动态使用】
  "PastDay": "{0}", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": "{0}h atrás", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": "{0}hace un minuto", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": "{0}hace años", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "Ahora", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}mo", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}h", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}s", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "Ahora", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "OBRA", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "Invitado", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "Hay algunas novedades.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "Carga", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "Iniciar sesión con el invitado", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "Inicia sesión con Apple", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "Inicia sesión con Facebook", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "Inicia sesión con Google Play", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "Monedas", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "Tiradas", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "Escudo", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "Carta", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "Cofre de madera", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "Cofre de plata", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "Cofre de oro", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "¡PECHO LIBRE!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "Elementos", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "Punto", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "Cañón", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "Envía", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} gira en {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "Auto", // 【slot】-【New Label】
  "ToRaidUserBet": "VICTORIA X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "TODOS GANAN X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "APUESTA", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "Completo", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} Giros", // 【未找到预制】-【脚本或动态使用】
  "Shield": "ESCUDO", // 【未找到预制】-【脚本或动态使用】
  "Attack": "ATAQUE", // 【未找到预制】-【脚本或动态使用】
  "Spins": "TIRADAS+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "ASALTO", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "JAJA", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. Puedes obtener mensualmente\n     Recompensas de inicio de sesión cada\n     7 días en un mes.\n2. Las recompensas mensuales de inicio de sesión serán\n     Actualiza el mes que viene.\n3. Puedes conseguir semanalmente\n     Recompensas de inicio de sesión todos los días\n     En una semana.\n4. Las recompensas semanales de inicio de sesión serán\n     Actualiza la semana que viene.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "Mira un vídeo y consigue monedas", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "GIRO GRATIS", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "Gira para {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "Giro libre en\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "¡Diez veces mejor!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "COBRAR", // 【dailyBonus】-【text】
  "DailyBonusLevel": "Nivel {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "¡Al menos 25 millones de monedas la primera vez!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "COMPRA", // 【btnBuild】-【New Label】
  "BuildButtonFix": "ARREGLAR", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "¿Sin monedas?", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "¿Se te acabaron los giros?", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} Giros", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "o esperar {1} {0} giros", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "Espera {1} {0} giros", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\nMÁS", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "MENÚ", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "OBRA", // 【MenuWindow】-【name】
  "menu_1_village": "REINO", // 【MenuWindow】-【name】
  "menu_2_buy": "COMPRA MONEDAS/GIROS", // 【MenuWindow】-【name】
  "menu_3_daily": "BONIFICACIÓN DIARIA", // 【MenuWindow】-【name】
  "menu_4_shop": "EVOLUCIÓN DEL REINO", // 【MenuWindow】-【name】
  "menu_5_news": "MENSAJE", // 【MenuWindow】-【name】
  "menu_6_gifts": "REGALO", // 【MenuWindow】-【name】
  "menu_7_card": "TARJETA", // 【MenuWindow】-【name】
  "menu_8_map": "MAPA", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "CLASIFICACIÓN", // 【MenuWindow】-【name】
  "menu_10_invite": "INVITACIÓN", // 【MenuWindow】-【name】
  "menu_11_setting": "AMBIENTACIONES", // 【MenuWindow】-【name】
  "setting_title": "Escenarios", // 【SettingWindow】-【New Label】
  "setting_sound": "Sonido", // 【SettingWindow】-【New Label】
  "setting_music": "Música", // 【SettingWindow】-【New Label】
  "setting_notifications": "Notificaciones", // 【SettingWindow】-【title】
  "setting_raid": "Incursión y Ataque", // 【SettingWindow】-【New Label】
  "setting_general": "General", // 【SettingWindow】-【New Label】
  "setting_language": "Idioma", // 【SettingWindow】-【title】
  "setting_english": "Inglés", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "Gustábanos y no te lo pierdas\nEventos y regalos increíbles", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "COMO", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "Tutorial", // 【SettingWindow】-【New Label】
  "setting_support": "Apoyo", // 【SettingWindow】-【New Label】
  "setting_privacy": "Términos y privacidad", // 【SettingWindow】-【New Label】
  "setting_terms": "Términos y Condiciones", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "Contáctanos", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "Desconectarse", // 【SettingWindow】-【Txt】
  "setting_change": "Cambio", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "Borrar caché", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "Configuración de privacidad", // 【SettingWindow】-【New Label】
  "setting_language_title": "Idioma", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "Inglés", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "Chino", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "Español", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "Deutsch", // 【SettingLanguageWindow】-【label】
  "invite_title": "¿Quieres más vueltas?", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>Invita a amigos y consigue</color><color=#ff99f9><outline color=#471f01 width=3>{0}</outline></color><color=#f1edff> de tiradas gratis para cada amigo que se desbloqueen\n¡Reino 2!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>¡Invita a tus amigos y consigue</color><color=#ff99f9><outline color=#471f01 width=3>{0} tiradas gratis</outline></color><color=#f1edff> por cada amigo que participe en el juego!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "INVITACIÓN", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* Recibirás una recompensa después de tu amigo\nse conecta a través de Facebook", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "Conéctate con Facebook", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "CONECTA", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "No publicaremos en tu nombre", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "Inicia sesión y recibe tiradas gratis", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "¿Estás seguro?", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "Los invitados no pueden jugar con amigos", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "Juego como invitado", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "Amigos", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "País", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "Global", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "Donaciones", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "Giros Gratis", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "Monedas Libres", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "Cartas", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "Invitación", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "Envía", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "Cobrar", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "Recoger / Enviar todo", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "Colecciona todo", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "Invita a amigos", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "Obtén tiradas gratis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "Giros diarios recogidos {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "Monedas recogidas diariamente {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "Regalo de giro gratis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "Te mandaré {0} spin", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "Monedas de regalo", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "Te enviaré {0} monedas", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "Envía tarjetas\nA tus amigos", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "Te mando una tarjeta", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "Debes llegar a Kingdom {0} para recoger esta carta", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "Tienda", // 【ShopWindow】-【title_label】
  "ShopSpins": "Tiradas", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "Monedas", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "Cofres", // 【ShopWindow】-【New Label】
  "ShopTreats": "Premios", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} GIROS", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}% más", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": " Activación{0}h", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "Tienda de monedas", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "Nivel {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\nMÁS", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "VENTA", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "Cofres se desbloquean en Kingdom {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "Premios desbloqueados en Kingdom {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "Populares", // 【ShopWindow】-【New Label】
  "ShopBestValue": "Mejor relación calidad-precio", // 【ShopWindow】-【New Label】
  "village_news_title": "Mensaje", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> atacado tu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> no atacaste tu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> te robó {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> se unió a Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> no logró robarte {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "Reino", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "Correo", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>Caduca en </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "Caduca en {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "LOS NUEVOS REINOS SON\nPRÓXIMAMENTE", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "¡Venganza!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "¡Ataca a tu amigo!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "Aleatorio", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "Venganza", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "Ataque", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "Mira un vídeo y consigue", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} GIRAS", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} MONEDAS", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "RELOJ", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "¡Reino completo!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "Siguiente", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "RECOMPENSA DE AMIGO", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} desbloqueado un nuevo reino! Tienes\n{1} TIRADAS GRATIS", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": " ¡{0} entrado en el juego! Tienes\n{1} GIROS GRATIS", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "Sube de nivel un objeto para conseguir una estrella.\n\nRecoge 25 estrellas para desbloquear el siguiente reino.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "No tienes suficientes monedas...\n\nDesliza hacia abajo para ganar más monedas.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "Usa la máquina tragaperras para girar, atacar y atacar a otros.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "Ataca los reinos de otros jugadores para conseguir monedas.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "Los escudos protegerán tu reino de ataques.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "¡Asaltad el reino del rey y robad sus monedas!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "Este es el Rey\n¡Vamos a asaltarlo!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "TU PRIMER REINO", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "¡Bienvenido, amigo mío!\n\nPulsa el botón para empezar a trabajar.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "Objetivo", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "¡Éxito!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "Tus recompensas:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "¡200 vueltas!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "¡20 vueltas!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "¡1 millón de monedas!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "¡Guarda el progreso!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "¡Juega con tus amigos!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "GIRO AUTOMÁTICO", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "Mantén pulsado el botón para empezar", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "¡Inténtalo!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "Oferta sorpresa", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "Tiempo restante", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} Monedas", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} Giros", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "Queda tiempo de venta {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>Ataque {0} veces para conseguir\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>Cuantos más compases completes, mayores serán las</color></outline><outline color=#b74800 width=2><color=#fff000>RECOMPENSAS!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "Premio final del bar:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} ¡Monedas!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "¡Apuesta más alto y consíguelo más rápido!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "¡ENTENDIDO!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "Termina en {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>Raid {0} tiempos para conseguir\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "¡Completa para conseguir recompensas!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "Ataque", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "Ataque bloqueado", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "Excelente incursión", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "Golpea 3 símbolos", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>Has recibido recompensas\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "TARJETA\nCOLECCIÓN", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "Completado", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "Desbloqueos en\nReino {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* Toca una tarjeta duplicada para enviarla a un amigo", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- CONJUNTO COMPLETADO -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "Completa el set para ganar", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "Pregunta", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "Envía", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "No se puede pedir a amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "Esta tarjeta es dorada, no se puede pedir a amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "No se puede enviar a amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "Esta tarjeta es dorada, no se puede enviar a amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "Has alcanzado el límite diario de tarjetas que puedes enviar", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "Necesitas más de una tarjeta para enviar", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "¡GENIAL!", // 【CardCollectWindow】-【title】
  "CardCollectDes": "Tarjeta {0}\nse añadió a tu álbum", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "Échale un vistazo", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "ENVIAR TARJETAS", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "¡Elige a un amigo!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "Seleccionar carta", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "ENVIAR TARJETAS", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "¡Selecciona hasta {0} cartas!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "Tus cartas seleccionadas:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "¡Tarjeta enviada con éxito!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "Información de las cartas", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "Recoge cartas a través de cofres", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "También puedes comprar cofres en la tienda", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "Los cofres se pueden encontrar durante las incursiones y al desbloquear un nuevo reino", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "Tener 2 o más tarjetas iguales te permite enviarlas como regalo a tus amigos", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "Toca la tarjeta para regalarla", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "También puedes preguntar a tus amigos por las cartas que faltan", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "Puedes enviar hasta 5 tarjetas en un día", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "Las estrellas indican la rareza de las cartas", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "Cada estrella de rareza en una nueva carta recopilada te da 1 estrella", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "¡Completa sets de cartas y recibe recompensas increíbles!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "Común", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "Raro", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "Cofre de madera", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "Cofre de Plata", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "Cofre de Oro", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "Alta probabilidad de:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "Nuevo", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>Colecciona cartas para conseguir más monedas <color=#fff000></color> y <color=#77e7ff>giros</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>Colecciona cartas para conseguir más monedas <color=#b85b00></color> y <color=#0073d4>giros</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "Buscar nombre de amigo", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "Sin amigos", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang te ha regalado Monedas y Giros!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "Centro de Misiones", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "Las tareas se actualizan en un nuevo día. Por favor, vuelve a abrir la ventana.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "Diario", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "Invitación", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "Signo", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8 días", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15 días", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22 días", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28 días", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "Día 1", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "Día 2", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "Día 3", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "Día 4", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "Día 5", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "Día 6", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "Día 7", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "SIGNO", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "FIRMADO", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "Misión principal: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "Gol: {0}\nRecompensa: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "Cobrar", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "VETE", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": "Actualizar en {0}", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "Centro de Actividades", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "Tiempo restante: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "Termina en: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "La actividad ha terminado", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "MISIÓN", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "ACTIVIDAD", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "¡Tienes giros completos!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "¡Tenemos suficientes giros para jugar y conseguir más monedas!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "¡Ya hay bonificación diaria!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "¡Ven a jugar a diario a la Rueda de la Fortuna!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "¡Vengémonos!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "¡Alguien ha invadido tu reino!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "¡La actividad terminará!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} terminará en una hora.", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "¡Cuánto tiempo sin verte!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "Hay muchos eventos nuevos. ¡Y preparamos un gran regalo para ti!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "¡Ven a jugar conmigo!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "¡Vuelve! ¡Preparamos un gran regalo para ti!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "Nueva actualización", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "Hemos arreglado la función de compra dentro de la app y añadido más eventos nuevos.\nTodos los demás jugadores han descargado y jugado la nueva versión. Todos tus datos han sido transferidos a la nueva versión.\nGracias.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "ACTUALIZACIÓN", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "No, gracias", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "¿Te encanta Coin Gang?", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "Toca una estrella para valorarlo en la tienda.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "ENVIAR", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "AHORA NO", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "Falló la carga de recursos. ¿Intentarlo de nuevo?", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "¡VAMOS!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "Haz cualquier compra para", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "¡CONSIGUE RECOMPENSAS EXTRA!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "¡COMPRA AHORA!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "¡Bienvenido a Coin Gang!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>Preparamos un\n<color=#ffe62b>GRAN REGALO</c> para ti~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "Actualización", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "Seleccionar", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "Aumenta la recompensa de las incursiones", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● Aumenta la recompensa en: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "Aumenta la recompensa de los ataques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● Aumenta la recompensa en: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "Protege contra ataques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● Probabilidad de protección: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "Protege de incursiones", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● Probabilidad de protección: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● Siguiente nivel: {0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>Contrata sirvientes para conseguir más monedas <color=#ffe615></color> y <color=#0ce4fe>Giros</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>Contrata sirvientes para conseguir más monedas <color=#e67b07></color> y <color=#006fd7>giros</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "Actualización:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "Cada giro de máquina tragaperras = 1 sirviente EXP. Puedes usar pociones para conseguir más EXPde sirviente. Cuando la barra de EXP del sirviente esté llena, pulsa el botón de Mejorar para mejorar a tu sirviente. Cada mejora de sirviente aumentará tu estrella de juego.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "Habilidad:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "La habilidad del sirviente mejora con cada mejora de nivel", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "Activación:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "Alimenta a tu sirviente para activarlo. Consigue Comida de Sirviente mientras hilas y construyes.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "Gira para ganar hasta", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "por un {0}adicional ", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "¡Tengo un regalo para ti!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "¡El loro Peter te traerá un regalo al azar!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "¡Solo toca a Peter para recibir el regalo cuando venga!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "¡Que te salga el escudo gratis!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "¡Dame de comer!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "Gratis", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "TOMA CADA MANO PARA REVELAR MÁS", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "Desbloquear comprando una oferta anterior", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "Límite de apuesta aumentado", // 【slot】-【Label - Msg】
  "SlotBetSuper": "SUPER", // 【slot】-【New Label】
  "I18N_BUY_NOW": "COMPRA AHORA", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>hasta un 20% MÁS de monedas y giros</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>hasta un 20% MÁS de monedas y giros</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>¡Apuesta más alto para multiplicar todo lo que recojas! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>¡Apuesta más alto para multiplicar todo lo que recojas! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "La carta comodín está disponible para reemplazar la carta de la limitada.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "DISFRUTANDO DE COIN GANG", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "Introduce el texto aquí...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>CONSIGUE <color=#ffffff>{0}% DE RECOMPENSAS EXTRA</color> por cada colección de cartas que completes.</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "ÚNETE AL GRUPO", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "Únete a nuestro", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>¡Saca las cartas de estos cofres! ¡Estos cofres solo están disponibles durante el evento! Puedes conseguir estos cofres especiales en la tienda y en otros eventos.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>Conjuntos de tarjetas de tiempo limitado</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "¡Vamos!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>Usa cupón para comprar sobres y conseguir un 100% más de monedas, cofres y giros.</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "Borrar", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "¡Introduce \"Eliminar\" para confirmar que has eliminado tu cuenta!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "Sigue la cuenta oficial para las últimas noticias", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "¡Introduce el código de invitación de un amigo para recibir una recompensa!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "Consulta el código de invitación", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "Código de invitación", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "¡Compra un Big Pack y recibe dos gratis!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "Ayuda", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "¡Completa las tareas limitadas de hoy para desbloquear tareas con mayor puntuación!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "Activar", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "Comprar nivel", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "Recibir", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "Gratis", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "Paso", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "Etapa {0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "Nivel: Max", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "Sube de nivel", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "Bonificación de Fase", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "Mejoras de edificios", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*Solo puedes comprar un paquete.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>CARTA COMODÍN</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "ÉXITO", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "TOCA PARA CONTINUAR", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "Recompensas diarias", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "Descripción de la característica", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "¡Únete junto a la arena para desbloquear recompensas!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3 días de prueba gratuita, luego 16,99 dólares al mes", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "Nombre del edificio", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "Vista previa de recompensas", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "Recompensas finales", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "RECOPILADO", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "¿Tienes problemas para comprar?", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "Contacta con el soporte", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "Mira demasiados vídeos hoy", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "Dólares", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "Carta aleatoria", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "Tarjeta Dorada", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "Cofre Mágico", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "Servidor", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "PROTEGIDO POR RADIO", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "ICE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "BALL", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "¡BIENVENIDO!", // 【dailyBonus】-【Text】
  "menu_12_sign": "CALENDARIO DE RECOMPENSAS", // 【MenuWindow】-【name】
  "setting_lowbattery": "Modo de bajo consumo", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "Activar el Modo de Bajo Consumo reducirá el consumo pero disminuirá el rendimiento.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "Restaurar Compra", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "Show VIP Crown", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "Para jugar Coin Gangster,\nPor favor, confirma", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    Al continuar, reconozco que Happy Donut puede almacenar y procesar mis datos de acuerdo con la <color=#ffffff><u><on click='privacyHandler'>Política de privacidad</on></u></color>.\n\nHe leído y acepto los <color=#ffffff><u><on click='termHandler'>Términos y condiciones</on></u></color>, que establecen un contrato e incluyen una renuncia a demandas colectivas y una cláusula de arbitraje.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "Francés", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "Chino tradicional", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "Japonés", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "Italiano", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "Portugués", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*Actualiza en 10 minutos", // 【LeaderboardWindow】-【note】
  "ShopShield": "Super\nEscudo", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "ESCUDOS DE PLATA", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "ESCUDOS DORADOS", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "Protege tu reino", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "Protégete contra:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>Ataques y <color=#288bdf>Raids</color> (exclusivo)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "Super Shield protege tu reino de ataques y incursiones durante mucho tiempo.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> atacado tu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> fallado en atacar tu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> te robó {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> se unió a Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> no logró robarte {1}</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "Toca para abrir", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> te eliminó como amigo</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>¡Recoge {0} <img src='{1}_s'/> para ganar!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>Apuesta más alto para conseguir más <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>¡Recoge <img src='{0}_s'/> para escalar en la clasificación!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>Apuesta más alto para multiplicar cada <img src='{0}_s'/> que recojas!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "Empieza a jugar para coleccionar", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2>conseguir que <img src='{0}_s' /> se unan a</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "¡GANADOR!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "Esto es lo que ganaste:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "El torneo ha terminado", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "Esta vez no ganaste, ¡pero aún así te llevas un premio!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "Regalos recogidos", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "Alcance", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "GRAN PREMIO", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "Al menos una:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "Intercambiable", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "¡A HACER EL INTERCAMBIO!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "¡AHORA SON INTERCAMBIABLES!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "Grupo de Intercambio de Cartas", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "Publica las tarjetas que te faltan", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "Intercambia cartas duplicadas", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "¡Gana grandes recompensas!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "Haz nuevos amigos", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "¡Tienes un cupón!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>Usa cupones para comprar sobres y conseguir un {0}% más de monedas <color=#fefe28></color>, cofres y <color=#64ebff>giros</color>!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*¡Nuevos usuarios, solo una vez!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "SPIN", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "Recompensas", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "Consigue más giros y monedas en el juego de tragaperras", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "Recompensas diarias", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "Límite de RECUPERACIÓN", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>Look brillante con <color=#fed400>nombre rojo</color> y <color=#fed400>corona</color></color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "AÑO", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "MES", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "SEMANA", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP al precio especificado ofrece una suscripción y ofrece giros, comida y cartas todos los días. Esta es una <color=#203d9b><u><on click=\"handle\" param=\"sub\">de suscripción que se renova automáticamente</on></u></c>. El pago se carga a tu cuenta telefónica en el momento de la confirmación. <color=#5e2802>La suscripción se renueva a menos que se desactive 24 horas antes de que termine el periodo, y se te cobrará la renovación de la cuenta.</c> Puedes desactivarlo en la configuración de tu cuenta. Cualquier parte no utilizada del periodo de prueba gratuito, si se ofrece, se perderá cuando el usuario adquiera una suscripción, cuando corresponda. <color=#203d9b><u><on click=\"handle\" param=\"pri\">Política de Privacidad y Términos de Uso</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "CALIENTE", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "Empieza gratis", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3 días de prueba gratuita, luego {0} al mes", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "¡Cómpralos TODOS LOS DÍAS!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "CONSIGUE TODO", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "Desbloquea VIP para conseguir TODO el BONO acumulado", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "Banco del Dinero", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "Desbloquear\nNivel {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "Intercambio\nNivel {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "Intercambio", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "Desbloquear nivel {0} para abrir", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "Intercambio", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "¡Se acabaron los dólares!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "Gratis", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "Ver vídeo", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "Aprovecha la oportunidad", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>30</color></size> extra\n¡Totalmente <size=46><color=#7ee0f4>5000+</color></size> giros!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "¡Consigue muchas recompensas de spin después de comprar el pase de nivel!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "Por el reino {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "Carta comodín", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "¡Elige una carta, cualquiera!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "Set\nPremio", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "COMPLETA EL CONJUNTO", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "Solo las tarjetas de exposición que no tengo", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "¡Me lo llevo!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "Caduca en", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "Tu carta comodín está esperando.\n¡Elige la carta que quieres antes de que se acabe el tiempo!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "Elige ahora", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "Elegiste la carta {0} ", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "CONJUNTOS COMPLETOS", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*Serás recompensado por cualquier conjunto de cartas que completes durante el evento", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": "1 de {0} cofres contiene un", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) ¡garantizado uno!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "Se puede comprar {0}o{1} veces por semana", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "INTERCAMBIA TUS CARTAS DUPLICADAS\nPARA EMOCIONANTE", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "DESBLOQUEA EN\nREINO {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "Equipo", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "Amigos", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "Crear", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "Explorar", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "Cancelar", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "Nombre del equipo:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "Insignia", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "Descripción:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "Tipo de equipo:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "Estrellas obligatorias:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "Editor", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "Abierto", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "Cerrado", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "Salir", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "Únete", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "Equipo de visualización", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "Visita", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "Eliminar", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "Invita a amigos", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "Recomendación de equipo principal", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "Elegir insignia de equipo", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "Ayuda", // 【HelpWindow】-【title_label】
  "Guild_Request": "Petición", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "Elige una carta para pedir a tus compañeros", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "Tarjeta de Solicitud", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": " ¡{0} ha dejado el equipo!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": " ¡{0} se ha unido al equipo!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "Miembros:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "¡No es suficiente ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "¡Solo puedes introducir cartas!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "¡El nombre del equipo debería tener al menos 3 personajes!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} da una carta x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "Añadir amigos", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "ELIMINAR CUENTA Y DATOS", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "ADVERTENCIA", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "Estás a punto de eliminar tu cuenta y todos los datos.\n  No puede restaurarse tras la eliminación.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "AMIGOS", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "Eliminar cuenta", // 【MenuWindow】-【name】
  "setting_delete": "Eliminar cuenta", // 【SettingWindow】-【New Label】
  "BindTitle": "Cuenta", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "Cuenta de cambio", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "Después de vincular tu cuenta,\nPuedes jugar en otros dispositivos", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "Esta cuenta de redes sociales está vinculada\n a una cuenta de juego.\n Puedes volver a\n Tu cuenta original del juego\n o contacta con nosotros para desvincularlo.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "Toca [Cambiar de cuenta] para iniciar sesión", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "Contáctanos para desvincular", // 【AccountHintWindow】-【tip】
  "ShopDaily": "Especiales diarios", // 【ShopWindow】-【subtitle】
  "ShopGem": "Gem", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "Punto", // 【ShopWindow】-【New Label】
  "ShopHot": "Caliente", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "La cantidad de cofres del Joker\nA la venta semanal es limitada", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "¿Nombrarle nuevo administrador?", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>COUPON</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> MÁS GIROS</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>TU DESCUENTO</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Para un</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}% extra</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> Giros o Monedas</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Tiempo restante:  {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "¡Tienes un cupón!\n Para más {0}\nEspines o monedas", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "Solicita", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>Mientras todo el equipo <img src='bossyucha'/>\n Junta, puedes conseguir el\n '¡Equipo Cofre del Tesoro'!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "Premio Definitivo", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "Por los tesoros de las profundidades,\n¡Todo el equipo debe derrotar al monstruo marino!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "La leyenda dice que el vasto océano\nesconde tesoros infinitos, y a\nSi los obtienes, hay que sumergirse en ellos\nlas profundidades infinitas y la derrota\nlos monstruos que custodian el abismo.\nRecoge arpones con tu equipo\n¡y derrota a todos los monstruos!\n1. Para conseguir un arpón, tienes que atacar y saquear.\n2. Usa el arpón para derrotar al monstruo, luego toca al monstruo para recibir recompensas.\n3. Puedes entrar en la clasificación tras infligir mucho daño a monstruos.\n4. Cuanto mayor sea el daño infligido al monstruo, mayor será la recompensa.\n5. Las recompensas de la tabla de clasificación se enviarán al buzón tras el evento.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "Tienes:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "El intercambio de cartas no disminuirá tu progreso en el juego", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "Seleccionar cartas para", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "Selecciona cartas para mí", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "COMERCIO", // 【CardTradeWindow】-【Label】
  "JackT_depart": "Salida", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "Gran premio:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "Fondo de premios", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "¡Juguemos y consigamos recompensas!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "¡Rendirse hará perder todos tus premios!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "¡Dos niveles más serán niveles extra!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "Dejarlo", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "Renacimiento", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "¿Estás seguro de que quieres irte?", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "¡Vete sin nada!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "Consejos", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "Jack coge un billete de avión para un viaje y se ve perseguido por la policía. Evita a la policía y elige la tarjeta adecuada para obtener la recompensa.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "Se añadirán premios al fondo de premios. Los jugadores pueden elegir salir del juego en cualquier momento y recibir la recompensa actual.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "Tras ser arrestados por la policía, los jugadores pueden revivir viendo un anuncio o pagando. Puedes dejar el juego sin recompensa.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "Paga para revivir y consigue billetes de avión y recompensas SUPER RICAS.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "Los niveles extra se visualizarán en el juego.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "Continúa", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "¡Recoged todas las recompensas!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "¡Tiempo fuera!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "IR A", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "¡Recibe recompensa!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "Tienes que dejar tu equipo actual para unirte a uno nuevo.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "Clasificación", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "Rango", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "¡Únete a un equipo, haz amigos y consigue más giros y cartas con tus compañeros!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "ÚNETE AHORA", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff> completado el set de </color><color=#FFBC06>{1}</color><color=#ffffff>! ¡Enhorabuena!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff> comprado un </color><color=#FFBC06>{1}</color><color=#ffffff>! ¡Ahora son muy ricos!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff> comprado un </color><color=#FFBC06>{1}</color><color=#ffffff>. ¡Bendigamos!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff> tiene un </color><color=#FFBC06>{1}</color><color=#ffffff>! ¡Enhorabuena!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>¡Increíble!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> acaba de terminar todos los mapas!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "Subir de nivel", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "Puntos de Tareas", // 【脚本】-【game/items/Content.js】
  "story1": "Paso completado", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "Haz clic para continuar.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "Mapa 1 Edificio 1 Título del capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "Mapa 1 Edificio 2 Título del capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "Mapa 1 Edificio 3 Título del capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "Mapa 1 Edificio 4 Título del capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "Mapa 1 Edificio 5 Título del capítulo", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "Información del jugador", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "Avatar", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "Avatar Frame", // 【AvatarWindow】-【New Label】
  "Button_Save": "Salvar", // 【AvatarWindow】-【New Label】
  "EditNickName": "Editar tu apodo", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "Nivel {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>Toca una pieza para ver los detalles aquí</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "Generado de", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "Generación adicional tras la actualización", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "Puede generar", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "Sabe cocinar", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "Almacenamiento", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "Añadir", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "Cuadro de Selección Abierto", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "Selecciona una de las siguientes recompensas", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "Método de producción", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "Golpea los utensilios para recoger el producto terminado.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "Pista", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "Si ya tienes una cuenta vinculada,\n Puedes iniciar sesión en esa cuenta\n para seguir jugando.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "Esta cuenta contiene datos de juegos", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "Fallo en la vinculación/conmutación", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "La cuenta corriente ya está vinculada a estos datos del juego", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "Bienvenido", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "Fusiona estas piezas", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "Toca el generador", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "Pedido completado", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "¿Reventarlo?", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "Romper", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "Cancelar", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "Restante", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "Intervalo de actualización", // 【ShopWindow】-【New Label】
  "ShopOver": "Agotado", // 【ShopWindow】-【price】
  "ShopFree": "Gratis", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "Completado", // 【mergeUI】-【New Label】
  "ShopSpin": "Comprar energía", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "Esta tarjeta es dorada.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "Has alcanzado el límite diario de cartas que puedes enviar.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
