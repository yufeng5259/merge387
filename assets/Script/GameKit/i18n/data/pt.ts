const phrases = {
  "APPNAME": "Coin Gang", // 【未找到预制】-【脚本或动态使用】
  "START": "INICIAR", // 【未找到预制】-【脚本或动态使用】
  "Score": "Pontuação", // 【未找到预制】-【脚本或动态使用】
  "Restart": "Reinício", // 【未找到预制】-【脚本或动态使用】
  "Loading": "Carregando", // 【DownloadingWindow】-【New Label】
  "Cancel": "Cancelar", // 【JokerCardWindow】-【New Label】；【MergeCookingConfirmWindow】-【New Label】；【ScissorsWindow】-【New Label】
  "Confirm": "Confirmar", // 【JokerCardWindow】-【New Label】；【MergePassPortIconWindow】-【New Label】；【PrivacyWindow】-【New Label】
  "Retry": "Tentar novamente", // 【未找到预制】-【脚本或动态使用】
  "Back": "Voltar", // 【未找到预制】-【脚本或动态使用】
  "Accept": "Aceitar", // 【未找到预制】-【脚本或动态使用】
  "Level": "Nível", // 【未找到预制】-【脚本或动态使用】
  "ScoreRank": "Classificação", // 【未找到预制】-【脚本或动态使用】
  "Rank": "Classificação", // 【未找到预制】-【脚本或动态使用】
  "ScorePoint": "Pontos", // 【未找到预制】-【脚本或动态使用】
  "OK": "OK", // 【ApNotEnoughWindow】-【_LabelShadow_child_Label - Price】；【ApNotEnoughWindow】-【Label - Price】；【HowToWindow】-【New Label】；【MainTutorialFinishWindow】-【Label】；【MergeCookingConfirmWindow】-【New Label】；【MergeTutorialWindow】-【New Label】；【还有3处】-【同Key】
  "YES": "SIM", // 【MergeDialogWindow】-【New Label】；【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "NO": "NÃO", // 【CountDownWindow】-【New Label】；【DialogWindow】-【New Label】；【WatchDoubleSpinCoinWindow】-【New Label】
  "Yes": "Sim", // 【未找到预制】-【脚本或动态使用】
  "No": "Não", // 【未找到预制】-【脚本或动态使用】
  "COLLECT": "Coletar", // 【slot】-【_LabelShadow_child_Label】；【slot】-【Label】；【ActivitySlotSymbolRankRewardWindow】-【labelButton】；【CongratsWindow】-【Label - Price】；【GetRewardWindow】-【Label】；【InvitedNewUserWindow】-【Label - Price】；【还有5处】-【同Key】
  "facebookF": "f", // 【未找到预制】-【脚本或动态使用】
  "Congratulation": "Parabéns!", // 【slot】-【Label - title】；【GetRewardWindow】-【title_label】；【LevelUpGetRewardWindow】-【title_label】
  "and": "e", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "Reconnect": "RETRY", // 【脚本】-【window/LoginWindow.js】；【脚本】-【game/merge/MergeDes.js】；【脚本】-【Web/ServerRequest.js】
  "OFF": "DESLIGADO", // 【未找到预制】-【脚本或动态使用】
  "MORE": "MAIS", // 【ActivitySalePackWindow】-【label_Off】；【NewPlayerPackWindow】-【Label - off2】
  "multiplyx": "x", // 【脚本】-【window/Common/SimpleRewardWindow.js】；【脚本】-【game/items/ContentModel.js】；【脚本】-【window/Item/ContentDesWindow.js】；【脚本】-【window/Shop/FirstPurchaseWindow.js】；【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "multiplyX": "X", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "setting_feature_not_open": "Esse recurso ainda não está disponível.", // 【脚本】-【window/Menu/SettingWindow.js】
  "PlayerDefaultName": "Jogador", // 【脚本】-【game/slot/UserSlot.js】；【脚本】-【game/user/User.js】
  "PayDisable": "O pagamento está desativado!", // 【ShopWindow】-【PayDisable】
  "PayEnabledAndroid": "O pagamento só está ativado no Android!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableIos": "O pagamento está desativado no iOS!", // 【未找到预制】-【脚本或动态使用】
  "PayDisableFBIn": "Desculpe, a função de pagamento atualmente é incompatível com seu sistema. Por favor, insira Coin Gang através do Instant Games em um computador para concluir sua compra.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PaySuccess": "Obrigado pela sua compra!", // 【PaySuccessWindow】-【label】
  "PayFail": "Compra falhada!", // 【脚本】-【AppKit/PaymentWrap.js】
  "PayPending": "Sua compra está pendente! Após completar o pagamento, reinicie o jogo para receber seus itens.", // 【脚本】-【AppKit/PaymentWrap.js】
  "PriceSymbol": "$", // 【脚本】-【AppKit/PaymentWrap.js】
  "ShopOff": "{0}%\nDESLIGADO", // 【未找到预制】-【脚本或动态使用】
  "AdNotReady": "O vídeo não está pronto!", // 【脚本】-【AppKit/ADWrap.js】
  "wxUserinfoDenyTitle": "Preciso de acesso", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyDes": "Precisamos das suas informações", // 【脚本】-【AppKit/UserWrap.js】
  "wxUserinfoDenyConfirm": "Permitir acesso", // 【脚本】-【AppKit/UserWrap.js】
  "wxVersionNoSupport": "Essa função atualmente é incompatível com a versão do seu cliente. Por favor, atualize WeChat.", // 【脚本】-【window/Menu/SettingWindow.js】
  "ShareTitle": "Ei, esse é realmente um jogo incrível! Vamos brincar juntos:-P", // 【脚本】-【AppKit/SdkManager.js】
  "ShareInviteNew": "Ei, esse é realmente um jogo incrível! Vamos brincar juntos:-P", // 【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【AppKit/ADWrap.js】
  "ShareInviteSendSpin": "{0} te dei umas voltas:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteSendCoins": "{0} te deram algumas moedas:)", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShareInviteFinishVillage": "Acabei de construir um novo reino! Venha visitar:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteRaid": "UAU! Acabei de roubar {0} moedas! Muito legal:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareInviteAttack": "UAU! Acabei de atacar outro reino! Muito legal:-D", // 【未找到预制】-【脚本或动态使用】
  "ShareDialogTitle": "Compartilhe", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareInviteDialogTitle": "Convite", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareChooseDialogTitle": "Enviar", // 【脚本】-【AppKit/ShareWrap.js】
  "ShareSendCard": "{0} te deram cartões:)", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "ErrorRetry": "Falhou ao conectar ao servidor, tentar novamente?", // 【脚本】-【Web/ServerRequest.js】
  "ErrorLogin": "Falhou a conexão ao servidor.", // 【脚本】-【window/LoginWindow.js】；【脚本】-【AppKit/UserWrap.js】；【脚本】-【game/merge/MergeDes.js】
  "ErrorNormal": "Perdi a conexão com o servidor.", // 【脚本】-【AppMain.js】；【脚本】-【AppKit/PaymentWrap.js】；【脚本】-【Web/BatchRequest.js】；【脚本】-【Web/ServerRequest.js】
  "ErrorMsg0": "Sucesso", // 【未找到预制】-【脚本或动态使用】
  "ErrorMsg1703": "Compra falhada", // 【未找到预制】-【脚本或动态使用】
  "loadResError": "Falhou ao carregar {0}de recursos. Tentar de novo?", // 【脚本】-【UIRoot.js】；【脚本】-【game/GamePlay.js】；【脚本】-【window/Activity/passport/PassPortDesWindow.js】；【脚本】-【window/Item/GiftContentDesWindow.js】；【脚本】-【window/Item/InviteRewardsPanel.js】；【脚本】-【window/Item/LimitCardDesWindow.js】；【还有2处】-【同Key】
  "CountYear": "{0} anos", // 【未找到预制】-【脚本或动态使用】
  "CountMonth": "{0} meses", // 【未找到预制】-【脚本或动态使用】
  "CountDay": "{0} dias", // 【脚本】-【game/activity/ui/ActivityBox.js】；【脚本】-【game/items/Content.js】；【脚本】-【GameKit/TimeUtil.js】
  "CountHour": "{0} horas", // 【未找到预制】-【脚本或动态使用】
  "CountMinute": "{0} minutos", // 【未找到预制】-【脚本或动态使用】
  "CountSecond": "{0} segundos", // 【未找到预制】-【脚本或动态使用】
  "FormatYear": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatMonth": "/", // 【未找到预制】-【脚本或动态使用】
  "FormatDay": "33", // 【未找到预制】-【脚本或动态使用】
  "FormatHour": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatMinute": ":", // 【未找到预制】-【脚本或动态使用】
  "FormatSecond": "33", // 【未找到预制】-【脚本或动态使用】
  "PastYear": "{0}anos atrás", // 【未找到预制】-【脚本或动态使用】
  "PastMonth": "{0}mês atrás", // 【未找到预制】-【脚本或动态使用】
  "PastDay": "{0}atrás", // 【脚本】-【GameKit/TimeUtil.js】
  "PastHour": "{0}h atrás", // 【脚本】-【GameKit/TimeUtil.js】
  "PastMinute": "{0}m atrás", // 【脚本】-【GameKit/TimeUtil.js】
  "PastSecond": "{0}anos atrás", // 【脚本】-【GameKit/TimeUtil.js】
  "PastZero": "Agora", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeYear": "{0}y", // 【未找到预制】-【脚本或动态使用】
  "SomeMonth": "{0}mo", // 【未找到预制】-【脚本或动态使用】
  "SomeDay": "{0}d", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeHour": "{0}h", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeMinute": "{0}m", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeSecond": "{0}s", // 【脚本】-【GameKit/TimeUtil.js】
  "SomeZero": "Agora", // 【脚本】-【GameKit/TimeUtil.js】
  "LoginWindowPlay": "PEÇA", // 【Button - FB】-【Label】；【LoginWindow】-【Label】
  "LoginWindowGuest": "Convidado", // 【LoginWindow】-【Label】
  "LoginWindowNeedUpdate": "Há algumas atualizações.", // 【脚本】-【window/LoginWindow.js】
  "LoginWindowUpdating": "Carregamento", // 【LoginWindow】-【Label - updating】
  "SignInWithGuest": "Faça login com o Convidado", // 【未找到预制】-【脚本或动态使用】
  "SignInWithApple": "Faça login com Apple", // 【AccountBindWindow】-【lab】
  "SignInWithFacebook": "Faça login com Facebook", // 【AccountBindWindow】-【lab】
  "SignInWithGooglePlay": "Faça login com Google Play", // 【AccountBindWindow】-【lab】
  "ContentNameCoin": "Moedas", // 【脚本】-【game/items/Content.js】
  "ContentNameAp": "Giros", // 【脚本】-【game/items/Content.js】
  "ContentNameShield": "Escudo", // 【脚本】-【game/items/Content.js】
  "ContentNameCard": "Carta", // 【脚本】-【window/Item/RandomChestPanel.js】
  "ContentNameChest1": "Baú de madeira", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest2": "Baú de prata", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest3": "Baú dourado", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest4": "BAÚ GRÁTIS!", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNamePack": "Itens", // 【脚本】-【game/items/Content.js】
  "ContentNameActivityItemCommon": "Item", // 【未找到预制】-【脚本或动态使用】
  "ContentNameActivityItem6": "Cannonball", // 【未找到预制】-【脚本或动态使用】
  "ContentNameUnknown": "???", // 【脚本】-【game/items/Content.js】
  "ChatSend": "Enviar", // 【未找到预制】-【脚本或动态使用】
  "ApRecoverIn": "{0} gira em {1}", // 【脚本】-【window/UserInfoModel.js】
  "AutoSpining": "Auto", // 【slot】-【New Label】
  "ToRaidUserBet": "VITÓRIA X{0}", // 【未找到预制】-【脚本或动态使用】
  "BetRibbonText": "TODOS VENCEM X{0}", // 【未找到预制】-【脚本或动态使用】
  "Bet": "BET", // 【未找到预制】-【脚本或动态使用】
  "ApFull": "Cheio", // 【未找到预制】-【脚本或动态使用】
  "ApPlus": "+{0} Giros", // 【未找到预制】-【脚本或动态使用】
  "Shield": "ESCUDO", // 【未找到预制】-【脚本或动态使用】
  "Attack": "ATAQUE", // 【未找到预制】-【脚本或动态使用】
  "Spins": "GIROS+{0}", // 【未找到预制】-【脚本或动态使用】
  "Raid": "RAIDE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol1": "LOLLI", // 【未找到预制】-【脚本或动态使用】
  "Help_sign": "1. Você pode receber mensalmente\n     O login recompensa todo\n     7 dias em um mês.\n2. Recompensas mensais de login serão\n     Atualize no próximo mês.\n3. Você pode receber semanalmente\n     Recompensas de login todos os dias\n     em uma semana.\n4. Recompensas semanais de login serão\n     Atualize na próxima semana.", // 【未找到预制】-【脚本或动态使用】
  "SlotCoin6Video": "Assista a um vídeo e ganhe moedas", // 【WatchDoubleSpinCoinWindow】-【msg】
  "DailyBonusNormalSpinBtn": "FIAÇÃO GRÁTIS", // 【dailyBonus】-【text】
  "DailyBonusGoldSpinBtn": "Gire para {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusFreeSpinDes": "Giro livre em\n{0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "Now10XBetter": "Dez vezes melhor!", // 【dailyBonus】-【Text】
  "DailyBonusCollect": "COLLECT", // 【dailyBonus】-【text】
  "DailyBonusLevel": "Nível {0}", // 【脚本】-【game/dailyBonus/DailyBonusNode.js】
  "DailyBonusGoldFirst": "Pelo menos 25 milhões de moedas na primeira vez!", // 【dailyBonus】-【label】
  "BuildButtonBuy": "COMPRE", // 【btnBuild】-【New Label】
  "BuildButtonFix": "CONSERTAR", // 【btnFix】-【New Label】
  "NotEnoughCoinDes": "Sem moedas?", // 【CoinNotEnoughWindow】-【des】
  "NotEnoughApDes": "Sem giros?", // 【ApNotEnoughWindow】-【des】
  "NotEnoughApAdd": "+{0} Giros", // 【未找到预制】-【脚本或动态使用】
  "NotEnoughApWait": "ou esperar {1} por {0} giros", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughApWait2": "Espere {1} {0} giros", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】
  "NotEnoughOff": "{0}%\nMAIS", // 【脚本】-【window/Shop/ApNotEnoughWindow.js】；【脚本】-【window/Shop/CoinNotEnoughWindow.js】
  "menu_title": "CARDÁPIO", // 【未找到预制】-【脚本或动态使用】
  "menu_0_play": "PEÇA", // 【MenuWindow】-【name】
  "menu_1_village": "REINO", // 【MenuWindow】-【name】
  "menu_2_buy": "COMPRE MOEDAS/SPINS", // 【MenuWindow】-【name】
  "menu_3_daily": "BÔNUS DIÁRIO", // 【MenuWindow】-【name】
  "menu_4_shop": "EVOLUÇÃO DO REINO", // 【MenuWindow】-【name】
  "menu_5_news": "MENSAGEM", // 【MenuWindow】-【name】
  "menu_6_gifts": "DOAÇÃO", // 【MenuWindow】-【name】
  "menu_7_card": "CARD", // 【MenuWindow】-【name】
  "menu_8_map": "MAPA", // 【MenuWindow】-【name】
  "menu_9_leaderboard": "TABELA", // 【MenuWindow】-【name】
  "menu_10_invite": "CONVITE", // 【MenuWindow】-【name】
  "menu_11_setting": "CONFIGURAÇÕES", // 【MenuWindow】-【name】
  "setting_title": "Configurações", // 【SettingWindow】-【New Label】
  "setting_sound": "Som", // 【SettingWindow】-【New Label】
  "setting_music": "Música", // 【SettingWindow】-【New Label】
  "setting_notifications": "Notificações", // 【SettingWindow】-【title】
  "setting_raid": "Ataque e Ataque", // 【SettingWindow】-【New Label】
  "setting_general": "Geral", // 【SettingWindow】-【New Label】
  "setting_language": "Idioma", // 【SettingWindow】-【title】
  "setting_english": "Inglês", // 【未找到预制】-【脚本或动态使用】
  "setting_likeus": "Como a gente e não perca nada\nEventos e presentes incríveis", // 【SettingWindow】-【_LabelShadow_child_title】；【SettingWindow】-【title】
  "setting_like": "TIPO", // 【SettingWindow】-【New Label】；【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【shadow】
  "setting_tutorial": "Tutorial", // 【SettingWindow】-【New Label】
  "setting_support": "Apoio", // 【SettingWindow】-【New Label】
  "setting_privacy": "Termos e Privacidade", // 【SettingWindow】-【New Label】
  "setting_terms": "Termos e Condições", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_uuid": "33", // 【未找到预制】-【脚本或动态使用】
  "setting_contactus": "Entre em contato conosco", // 【SettingWindow】-【New Label】；【SettingWindow】-【Txt】
  "setting_signout": "Sair", // 【SettingWindow】-【Txt】
  "setting_change": "Mudança", // 【SettingWindow】-【New Label】
  "setting_clear_cache": "Limpar cache", // 【SettingWindow】-【New Label】
  "setting_privacy_settings": "Configurações de privacidade", // 【SettingWindow】-【New Label】
  "setting_language_title": "Idioma", // 【SettingLanguageWindow】-【New Label】
  "setting_language_en": "Inglês", // 【SettingLanguageWindow】-【label】
  "setting_language_zh": "Chinês", // 【未找到预制】-【脚本或动态使用】
  "setting_language_es": "Espanhol", // 【SettingLanguageWindow】-【label】
  "setting_language_de": "Deutsch", // 【SettingLanguageWindow】-【label】
  "invite_title": "Quer mais giros?", // 【InviteWindow】-【title_label】
  "invite_addnumber_type0": "+{0}", // 【脚本】-【window/Menu/GiftsWindow.js】；【脚本】-【window/Menu/InviteAndShareWindow.js】；【脚本】-【window/Menu/InviteWindow.js】；【脚本】-【window/Menu/LeaderboardWindow.js】
  "invite_lineA": "<outline color=#180147 width=2><color=#f1edff>Convide amigos e ganhe</color><color=#ff99f9><outline color=#471f01 width=3>{0} rodadas grátis</outline></color><color=#f1edff> para cada amigo que desbloquear\nReino 2!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_lineApp": "<outline color=#180147 width=2><color=#f1edff>Convide amigos e ganhe</color><color=#ff99f9><outline color=#471f01 width=3>{0} rodadas grátis</outline></color><color=#f1edff> para cada amigo que entrar no jogo!</color></outline>\n ", // 【未找到预制】-【脚本或动态使用】
  "invite_invite": "CONVITE", // 【InviteAndShareWindow】-【title】；【InviteWindow】-【title】；【LeaderboardWindow】-【title】
  "invite_note": "* Você vai receber uma recompensa depois do seu amigo\nconecta-se por Facebook", // 【GetInviteRewardsWindow】-【note】；【InviteWindow】-【note】
  "BindFacebookTitle": "Conecte-se com Facebook", // 【FacebookBindWindow】-【title_label】
  "BindFacebookBtn": "CONECTE", // 【FacebookBindWindow】-【Label】；【GuestConfirmWindow】-【Label】；【MenuWindow】-【Label】
  "BindFacebookTip": "Não vamos postar em seu nome", // 【FacebookBindWindow】-【tip】；【GuestConfirmWindow】-【tip】；【MenuWindow】-【New Label】
  "BindFacebookFreespin": "Faça login e ganhe rodadas grátis", // 【MenuWindow】-【New Label】
  "GuestConfirmTitle": "Tem certeza?", // 【GuestConfirmWindow】-【title】
  "GuestConfirmDes": "Convidados não podem brincar com amigos", // 【GuestConfirmWindow】-【des】
  "GuestConfirmGuest": "Jogo como Convidado", // 【GuestConfirmWindow】-【Label】
  "LeaderBoardWindowTabFriends": "Amigos", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabCountry": "País", // 【LeaderboardWindow】-【New Label】
  "LeaderBoardWindowTabGlobal": "Global", // 【LeaderboardWindow】-【New Label】
  "gifts_title": "Presentes", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab0": "Giros Livres", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab1": "Moedas Grátis", // 【未找到预制】-【脚本或动态使用】
  "gifts_tab2": "Cartas", // 【未找到预制】-【脚本或动态使用】
  "gifts_invite": "Convite", // 【未找到预制】-【脚本或动态使用】
  "gifts_send": "Enviar", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect": "Colete", // 【未找到预制】-【脚本或动态使用】
  "gifts_note": "33", // 【未找到预制】-【脚本或动态使用】
  "gifts_collect_all": "Coletar / Enviar Tudo", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_all2": "Colecionar Todos", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_name": "Convide Amigos", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_default_explain": "Ganhe Giros Grátis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_spins": "Giros diários coletados {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_collect_coins": "Moedas coletadas diariamente {0}/{1}", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_send": "Presente giro grátis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_spin_collect": "Te mandar {0} rotação", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_send": "Moedas grátis", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_coin_collect": "Vou te enviar {0} moedas", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_send": "Envie cartões\nAos seus amigos", // 【未找到预制】-【脚本或动态使用】
  "gifts_explain_card_collect": "Vou te enviar um cartão", // 【脚本】-【window/Menu/GiftsWindow.js】
  "gifts_explain_card_cantcollect": "Você deve chegar ao reino {0} para coletar esta carta", // 【脚本】-【window/Menu/GiftsWindow.js】
  "ShopTitle": "Loja", // 【ShopWindow】-【title_label】
  "ShopSpins": "Giros", // 【ShopWindow】-【name】；【ShopWindow】-【subtitle】
  "ShopCoins": "Moedas", // 【ShopWindow】-【name】；【ShopWindow】-【New Label】
  "ShopChests": "Baús", // 【ShopWindow】-【New Label】
  "ShopTreats": "Petiscos", // 【ShopWindow】-【New Label】
  "ShopSpinNum": "{0} GIRA", // 【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】
  "ShopAddPercent": "{0}% a mais", // 【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【脚本】-【window/Shop/ShopTreatItem.js】
  "ShopSpinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopCoinPrice": "${0}", // 【未找到预制】-【脚本或动态使用】
  "ShopTreatFoodTime": " Ativação{0}h", // 【脚本】-【window/Shop/ShopTreatItem.js】
  "CoinStore": "Loja de Moedas", // 【ShopWindow】-【coin_shop_text】
  "CoinShopLevel": "Nível {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "OffText": "{0}%\nMAIS", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】；【脚本】-【window/Shop/ShopCoinItem.js】；【脚本】-【window/Shop/ShopGemItem.js】；【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】；【脚本】-【window/Shop/ShopSpinItem.js】；【还有1处】-【同Key】
  "SaleMark": "VENDA", // 【dailyBonus】-【New Label】
  "ShopChestDisable": "Baús desbloqueados no reino {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopTreatDisable": "Petiscos Desbloqueados no Kingdom {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ShopPopular": "Populares", // 【ShopWindow】-【New Label】
  "ShopBestValue": "Melhor Custo-Benefício", // 【ShopWindow】-【New Label】
  "village_news_title": "Mensagem", // 【VillageNewsWindow】-【title_label】
  "village_news_log_hammer": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> atacou seu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> falhou em atacar seu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> roubou {1} de você</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> se juntou à Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid": "<outline color=#382681 width=2><color=#b3f9ff>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> não conseguiu roubar {1} de você</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_fox": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tiger": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_rhino": "33", // 【未找到预制】-【脚本或动态使用】
  "village_news_tab1": "Reino", // 【VillageNewsWindow】-【New Label】
  "village_news_tab2": "Correspondência", // 【VillageNewsWindow】-【New Label】；【MessageMailDetailWindow】-【title_label】
  "MessageMailDetailWindow_claim": "Claim", // 【MessageMailDetailWindow】-【Label_des】
  "MessageMailDetailWindow_confirm": "Confirm", // 【MessageMailDetailWindow】-【Label_des】
  "MessageInBoxWindow_expire": "<color=#464646>Expira em </c><color=#F64037>{0}</color>", // 【脚本】-【window/Message/MessageInBoxWindow.js】
  "village_news_expire": "Expira em {0}", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "map_title": "{0}. {1}", // 【未找到预制】-【脚本或动态使用】
  "map_comming_soon": "OS NOVOS REINOS SÃO\nEM BREVE", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_revenge": "Vingança!", // 【未找到预制】-【脚本或动态使用】
  "revenge_title_attack": "Ataque seu amigo!", // 【未找到预制】-【脚本或动态使用】
  "revenge_random": "Aleatório", // 【未找到预制】-【脚本或动态使用】
  "revenge_revenge": "Vingança", // 【未找到预制】-【脚本或动态使用】
  "revenge_attack": "Ataque", // 【未找到预制】-【脚本或动态使用】
  "watch_get": "Assista a um vídeo e fique", // 【WatchGetCoinWindow】-【label_watch】；【WatchGetSpinWindow】-【label_watch】
  "watch_spin": "+{0} GIROS", // 【脚本】-【window/Other/WatchGetSpinWindow.js】
  "watch_coin": "+{0} MOEDAS", // 【脚本】-【window/Other/WatchGetCoinWindow.js】
  "watch_watch": "ASSISTA", // 【WatchGetCoinWindow】-【New Label】；【WatchGetSpinWindow】-【New Label】
  "VillageCompleteTitle": "Reino Completo!", // 【未找到预制】-【脚本或动态使用】
  "VillageCompleteNext": "Próximo", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedTitle": "RECOMPENSA DE AMIGO", // 【InvitedNewUserWindow】-【New Label】
  "NewUserInvitedDes": "{0} desbloqueou um novo reino! Você tem\n{1} GIROS GRÁTIS", // 【未找到预制】-【脚本或动态使用】
  "NewUserInvitedDesApp": "{0} entrou no jogo! Você tem\n{1} GIROS GRÁTIS", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogStar": "Evolua um item para conseguir uma estrela.\n\nColete 25 estrelas para desbloquear o próximo reino.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogGoSpin": "Você não tem moedas suficientes...\n\nDeslize para baixo para ganhar mais moedas.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogDoSpin": "Use a máquina caça-níqueis para girar, atacar e atacar outros.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotAttack": "Ataque os reinos de outros jogadores para conseguir moedas.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotShield": "Escudos vão proteger seu reino de ataques.", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaid": "Invada o reino do rei e roube suas moedas!", // 【未找到预制】-【脚本或动态使用】
  "TutorialDialogSlotRaidMaster": "Este é o Rei\nVamos atacá-lo!", // 【未找到预制】-【脚本或动态使用】
  "TutorialStartTitle": "SEU PRIMEIRO REINO", // 【MergeTutorialWindow】-【New Label】
  "TutorialStartDes": "Bem-vindo, meu amigo!\n\nAperte o botão para começar seu trabalho.", // 【MergeTutorialWindow】-【New Label】
  "TutorialTargetName": "Alvo", // 【未找到预制】-【脚本或动态使用】
  "TutorialFinishTitle": "Sucesso!", // 【MainTutorialFinishWindow】-【New Label】；【PaySuccessWindow】-【title_label】
  "TutorialFinishDes0": "Suas recompensas:", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1": "200 giros!", // 【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes1bind": "20 giros!", // 【FacebookBindWindow】-【New Label】
  "TutorialFinishDes2": "1 milhão de moedas!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes3": "Salve o progresso!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialFinishDes4": "Brinque com seus amigos!", // 【FacebookBindWindow】-【New Label】；【MainTutorialFinishWindow】-【New Label】
  "TutorialTargetName1": "Brittney", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar1": "https://cb-cdn.goldaxe.net/coingang/icons/Brittney.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName2": "Tina", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetAvatar2": "https://cb-cdn.goldaxe.net/coingang/icons/Tina.jpg", // 【未找到预制】-【脚本或动态使用】
  "TutorialTargetName3": "Jordan", // 【脚本】-【window/LoginWindow.js】
  "TutorialTargetAvatar3": "https://cb-cdn.goldaxe.net/coingang/icons/Jordan.jpg", // 【脚本】-【window/LoginWindow.js】
  "AutoSpinTipWindowTitle": "GIRO AUTOMÁTICO", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowDes": "Segure o botão para começar", // 【未找到预制】-【脚本或动态使用】
  "AutoSpinTipWindowButton": "Tente!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySpecialOfferTitle": "Oferta Surpresa", // 【未找到预制】-【脚本或动态使用】
  "ActivityTimeleft": "Tempo Restante", // 【ActivitySpecialOfferWindow】-【des】
  "ActivitySpecialOfferCoin": "{0} Moedas", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivitySpecialOfferSpin": "{0} Giros", // 【脚本】-【window/Activity/ActivitySpecialOfferWindow.js】
  "ActivityShopDes": "Tempo de venda restante {0}", // 【脚本】-【window/Shop/ShopWindow.js】
  "ActivityAttackMasterDes": "<outline color=#552C00 width=2>Ataque {0} vezes para conseguir\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】
  "ActivityAttackMasterDesMore": "<outline color=#76332e width=2><color=#ffffff>Quanto mais barras você completa, maiores as</color></outline><outline color=#b74800 width=2><color=#fff000>RECOMPENSAS!</color></outline>", // 【ActivityAttackMasterWindow】-【Label - DesMore】；【ActivityCollectSymbolWindow】-【Label - DesMore】；【ActivityRaidMasterWindow】-【Label - DesMore】
  "ActivityAttackMasterFinal1": "Prêmio final da ordem:", // 【ActivityAttackMasterWindow】-【New Label】；【ActivityCollectSymbolWindow】-【New Label】；【ActivityRaidMasterWindow】-【New Label】
  "ActivityAttackMasterFinal2": "{0} Moedas!", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityAttackMasterButtonTip": "Aposte mais alto e consiga mais rápido!", // 【ActivityAttackMasterWindow】-【Label - Button Tip】；【ActivityCollectSymbolWindow】-【Label - Button Tip】；【ActivityRaidMasterWindow】-【Label - Button Tip】
  "ActivityAttackMasterButton": "ENTENDIDO!", // 【ActivityAttackMasterWindow】-【Label - Price】；【ActivityCollectSymbolWindow】-【Label - Price】；【ActivityRaidMasterWindow】-【Label - Price】；【ActivitySlotSymbolRankInfoWindow】-【labelButton】；【ActivitySlotSymbolShowWindow】-【labelButton】
  "ActivityAttackMasterTimeleft": "Termina em {0}", // 【脚本】-【window/Activity/mergeCollect/ActivityCollectSymbolWindow.js】；【脚本】-【window/Activity/normal/ActivityAttackMasterWindow.js】；【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityRaidMasterDes": "<outline color=#552C00 width=2>Raid {0} tempos para conseguir\n{1} {2}</color></outline>", // 【脚本】-【window/Activity/normal/ActivityRaidMasterWindow.js】
  "ActivityBuildKingDes": "Complete para ganhar recompensas!", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectDes1": "Ataque", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes2": "Ataque Bloqueado", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes3": "Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes4": "Excelente Raid", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "ActivitySlotCollectDes5": "Acerte 3 Símbolos", // 【ActivitySlotSymbolRankInfoWindow】-【New Label】；【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】；【ActivitySlotSymbolShowTester】-【New Label】；【ActivitySlotSymbolShowWindow】-【New Label】
  "GetRewardWindowDes": "<outline color=#333333 width=2><color=#ffffff>Você tem recompensas\n{0}!</color></outline>", // 【脚本】-【window/Common/GetRewardWindow.js】；【脚本】-【window/Common/LevelUpGetRewardWindow.js】
  "CardAllSetWindowTitle": "CARD\nCOLEÇÃO", // 【CardAllSetWindow】-【title_label】
  "CardAllSetWindowCompleted": "Concluído", // 【alien】-【label-completed】；【CardLimitSubjectOpenWindow】-【label-completed】；【CardLimitSubjectOpenWindowTester】-【label-completed】；【circus】-【label-completed】；【coin】-【label-completed】；【film】-【label-completed】；【还有9处】-【同Key】
  "CardAllSetWindowLock": "Desbloqueios em\nReino {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardLimitSubjectOpenWindow.js】；【脚本】-【window/Card/CardModel.js】；【脚本】-【window/Card/CardSubjectSet.js】
  "CardAllSetWindowBottom": "- Coin Gang -", // 【CardAllSetWindow】-【label-bottom】
  "CardSingleSetWindowTip": "* Toque em um cartão duplicado para enviá-lo a um amigo", // 【CardSingleSetWindow】-【label-tip】
  "CardSingleSetWindowCompleted": "- CONJUNTO CONCLUÍDO -", // 【CardSingleSetWindow】-【label-set-done】
  "CardSingleSetWindowReward": "Complete o conjunto para vencer", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "CardAsk": "Pergunte", // 【CardAskSendWindow】-【Label】；【CardInfoWindow】-【Label】
  "CardSend": "Enviar", // 【CardAskSendWindow】-【Label】；【CardSelectCardWindow】-【Label】
  "CardAskCannot": "Não pode ser pedido a amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardAskCannotGolden": "Este cartão é dourado, não pode ser pedido aos amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannot": "Não pode ser enviado para amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotGolden": "Este cartão é dourado, não pode ser enviado para amigos", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLimit": "Você atingiu o limite diário de cartões que pode enviar", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardSendCannotLeast": "Você precisa de mais de um cartão para enviar", // 【脚本】-【window/Card/CardAskSendWindow.js】
  "CardCollectTitle": "INCRÍVEL!", // 【CardCollectWindow】-【title】
  "CardCollectDes": "Carta {0}\nfoi adicionado ao seu álbum", // 【脚本】-【window/Card/CardCollectWindow.js】
  "CardCollectButton": "Confira", // 【CardCollectWindow】-【Label】
  "CardSelectFriendWindowTitle": "ENVIE CARTÕES", // 【CardSelectFriendWindow】-【label-title】
  "CardSelectFriendWindowInfo": "Selecione 1 amigo!", // 【CardSelectFriendWindow】-【label-info】
  "CardSelectFriendWindowBtn": "Cartão Select", // 【CardSelectFriendWindow】-【Label】
  "CardSelectCardWindowTitle": "ENVIE CARTÕES", // 【CardSelectCardWindow】-【label-title】
  "CardSelectCardWindowInfo": "Selecione até {0} cartões!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardSelectCardWindowSelected": "Suas cartas selecionadas:", // 【CardSelectCardWindow】-【label-info copy】
  "CardSelectCardWindowSuccess": "Cartão enviado com sucesso!", // 【脚本】-【window/Card/CardSelectCardWindow.js】
  "CardInfoWindowTitle": "Informações sobre os Cards", // 【CardInfoWindow】-【label-title】
  "CardInfoWindowPage0_0": "Colete cartas através dos baús", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_1": "Você também pode comprar baús na loja", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage0_2": "Baús podem ser encontrados durante raids e ao desbloquear um novo reino", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_0": "Ter 2 ou mais cartões iguais permite enviá-los de presente para seus amigos", // 【CardInfoWindow】-【label1】
  "CardInfoWindowPage1_1": "Toque no cartão para presenteá-lo", // 【CardInfoWindow】-【label2】
  "CardInfoWindowPage1_2": "Você também pode pedir cartões faltando aos amigos", // 【CardInfoWindow】-【label3】
  "CardInfoWindowPage1_3": "Você pode enviar até 5 cartões em um dia", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_0": "Estrelas indicam a raridade das cartas", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_2": "Cada estrela de raridade em uma nova carta coletada te dá 1 estrela", // 【CardInfoWindow】-【label】
  "CardInfoWindowPage2_3": "Complete conjuntos de cartas e ganhe recompensas incríveis!", // 【CardInfoWindow】-【label】
  "CardInfoWindowCommon": "Comum", // 【CardInfoWindow】-【label1】
  "CardInfoWindowRare": "Raro", // 【CardInfoWindow】-【label2】
  "CardChestInfoWindowTitle_1": "Baú de Madeira", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_2": "Baú de Prata", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowTitle_3": "Baú de Ouro", // 【未找到预制】-【脚本或动态使用】
  "CardChestInfoWindowHigh": "Alta chance de:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardChestOpenWindowNew": "Novo", // 【JokerCardWindow】-【label-name】；【CardGoldTradeWindow】-【label-name】；【CardChestOpenWindow】-【label-name】
  "CardOpenDes": "<color=#ffffff>Colete cartas para conseguir mais moedas <color=#fff000></color> e <color=#77e7ff>rodadas</color></color>", // 【CardSystemOpenWindow】-【Message】；【CardThemeOpenWindow】-【Message】
  "CardOpenDesS": "<color=#791400>Colete cartas para conseguir mais moedas <color=#b85b00></color> e <color=#0073d4>Spins</color></color>", // 【CardSystemOpenWindow】-【Message_shadow】；【CardThemeOpenWindow】-【Message_shadow】
  "FriendsModelPlaceHolder": "Pesquisar nome do amigo", // 【CardSelectFriendWindow】-【PLACEHOLDER_LABEL】；【FriendsModel】-【PLACEHOLDER_LABEL】
  "FriendsModelNoResult": "Sem Amigos", // 【CardSelectFriendWindow】-【no-friends】；【FriendsModel】-【no-friends】
  "ExtraRewardDes": "Coin Gang te presenteou com Moedas e Giros!", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_title": "Centro de Missões", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_refresh_dialog": "As tarefas são atualizadas em um novo dia. Por favor, abra a janela.", // 【脚本】-【game/AppGame.js】
  "quest_center_window_daily": "Diário", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_invite": "Convite", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_check": "Placa", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_7": "8 dias", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_14": "15 dias", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_21": "22 dias", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_month_box_28": "28 dias", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_day_1": "Dia 1", // 【SignWindow】-【day-string】
  "quest_center_window_day_2": "Dia 2", // 【SignWindow】-【day-string】
  "quest_center_window_day_3": "Dia 3", // 【SignWindow】-【day-string】
  "quest_center_window_day_4": "Dia 4", // 【SignWindow】-【day-string】
  "quest_center_window_day_5": "Dia 5", // 【SignWindow】-【day-string】
  "quest_center_window_day_6": "Dia 6", // 【SignWindow】-【day-string】
  "quest_center_window_day_7": "Dia 7", // 【SignWindow】-【day-string】
  "quest_center_window_check_do": "PLACA", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_check_done": "ASSINADO", // 【脚本】-【window/Quest/QuestCheckPage.js】
  "quest_center_window_main_quest_name": "Missão Principal: {0}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_main_quest_goal_reward": "Gol: {0}\nRecompensa: {1}", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_get": "Colete", // 【未找到预制】-【脚本或动态使用】
  "quest_center_window_daily_go": "VAI", // 【CardLimitSubjectOpenWindow】-【Label - Price】；【CardLimitSubjectOpenWindowTester】-【Label - Price】；【CardSystemOpenWindow】-【Label - Price】；【CardThemeOpenWindow】-【Label - Price】
  "quest_center_window_refreshin": "Atualize em {0}", // 【脚本】-【window/Quest/QuestDailyPage.js】
  "ActivityCenterTitle": "Centro de Atividades", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime": "Tempo restante: {0}", // 【未找到预制】-【脚本或动态使用】
  "ActivityCenterTime2": "Termina em: {0}", // 【脚本】-【window/Activity/ActivityCenterWindow.js】
  "ActivityCenterTimeEnd": "A atividade terminou", // 【脚本】-【window/Activity/ActivityCenterWindow.js】；【脚本】-【window/Activity/ActivityGameShowWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "GameMainWindowQuest": "MISSÃO", // 【GameMainWindow】-【New Label】
  "GameMainWindowActivity": "ATIVIDADE", // 【GameMainWindow】-【New Label】
  "NotificationTitleApFull": "Você tem giro completo!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesApFull": "Temos rodadas suficientes para jogar e ganhar mais moedas!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleDailyBonus": "O bônus diário já está disponível!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesDailyBonus": "Venha jogar diariamente na Roda da Fortuna!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleAttack": "Vamos nos vingar!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesAttack": "Alguém invadiu seu reino!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleActivity": "A atividade vai acabar!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesActivity": "{0} vai acabar em uma hora!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack": "Quanto tempo!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack": "Há muitos eventos novos. E preparamos um grande presente para você!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationTitleBack2": "Venha brincar comigo!", // 【脚本】-【AppKit/NotificationWrap.js】
  "NotificationDesBack2": "Volte! Preparamos um grande presente para você!", // 【脚本】-【AppKit/NotificationWrap.js】
  "AppUpdateTitle": "Nova Atualização", // 【AppUpdateWindow】-【Label -Title】
  "AppUpdateDes": "Corrigimos a função de compra dentro do aplicativo e adicionamos mais novos eventos.\nTodos os outros jogadores baixaram e jogaram a nova versão. Todos os seus dados foram transferidos para a nova versão.\nObrigado.", // 【AppUpdateWindow】-【Label - Des】
  "AppUpdateBtn": "ATUALIZAÇÃO", // 【AppUpdateWindow】-【Label】
  "AppUpdateNo": "Não, obrigado", // 【AppUpdateWindow】-【Label】
  "AppCommentTitle": "Ama Coin Gang?", // 【未找到预制】-【脚本或动态使用】
  "AppCommentDes": "Toque uma estrela para avaliar na loja.", // 【AppCommentWindow】-【Label - Des】
  "AppCommentBtn": "ENVIAR", // 【AppCommentWindow】-【Label】
  "AppCommentNo": "AGORA NÃO", // 【AppCommentWindow】-【Label】
  "AppHotUpdateFail": "Carregar recurso falhou. Tentar de novo?", // 【脚本】-【AppKit/HotUpdate.js】
  "FirstPurchaseButton": "VAI!", // 【FirstPurchaseWindow】-【Label】
  "FirstPurchaseDes1": "Faça qualquer compra para", // 【FirstPurchaseWindow】-【Label - Des1】
  "FirstPurchaseDes2": "GANHE RECOMPENSAS EXTRAS!", // 【FirstPurchaseWindow】-【Label - Des2】
  "NewPlayerPackButton": "COMPRE AGORA!", // 【NewPlayerPackWindow】-【Label】；【SuperShieldOpenWindow】-【Label - Price】
  "NewPlayerPackDes1": "Bem-vindo à Coin Gang!", // 【NewPlayerPackWindow】-【Label - Des1】
  "NewPlayerPackDes2": "<outline color=#12345c width=2>Preparamos um\n<color=#ffe62b>GRANDE PRESENTE</c> para você~</outline>", // 【NewPlayerPackWindow】-【Label - Des2】
  "ServantUpgrade": "Atualização", // 【TalkUpgradeNode】-【title】
  "ServantSelect": "Selecionar", // 【ThreeToOneWindow】-【New Label】
  "ServantEffectDes1": "Aumenta a recompensa das raids", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum1": "● Aumenta a recompensa em: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes2": "Aumenta a recompensa dos ataques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum2": "● Aumenta a recompensa em: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes3": "Protege contra ataques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum3": "● Chance de proteção: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectDes4": "Protege contra ataques", // 【未找到预制】-【脚本或动态使用】
  "ServantEffectNum4": "● Chance de proteção: {0}%", // 【未找到预制】-【脚本或动态使用】
  "ServantNextLevel": "● Próximo nível: {0}% +", // 【未找到预制】-【脚本或动态使用】
  "ServantName1": "Jack", // 【未找到预制】-【脚本或动态使用】
  "ServantName2": "Billy", // 【未找到预制】-【脚本或动态使用】
  "ServantName3": "Doge", // 【未找到预制】-【脚本或动态使用】
  "ServantName4": "Pigy", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDes": "<color=#ffffff>Contrate servos para conseguir mais moedas <color=#ffe615></color> e <color=#0ce4fe>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantOpenDesS": "<color=#10265f>Contratar servos para conseguir mais moedas <color=#e67b07></color> e <color=#006fd7>Spins</color></color>", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo1": "Atualização:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo2": "Cada giro de máquina caça-níqueis = 1 Servo EXP. Você pode usar poções para conseguir mais EXPde Servo. Quando a barra de EXP do Servo estiver cheia, toque o botão de Upgrade para melhorar seu servo. Cada melhoria de servo aumenta sua estrela de jogo.", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo3": "Habilidade:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo4": "A habilidade do servo melhora a cada melhoria de nível", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo5": "Ativação:", // 【未找到预制】-【脚本或动态使用】
  "ServantInfo6": "Alimente seu servo para ativá-lo. Pegue Comida de Servo enquanto gira e constrói.", // 【未找到预制】-【脚本或动态使用】
  "MultiplePurchaseDes1": "Gire para vencer até", // 【MultiplePurchaseWindow】-【Label - Des1】
  "MultiplePurchaseDes2": "x10", // 【MultiplePurchaseWindow】-【Label - Des2】
  "MultiplePurchaseDes3": "para um {0}adicional ", // 【脚本】-【window/Shop/MultiplePurchaseWindow.js】
  "SlotPeterDesAd": "Tenho um presente para você!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes1": "O papagaio Peter vai trazer um presente aleatório para você!", // 【未找到预制】-【脚本或动态使用】
  "PeterOpenDes2": "É só tocar no Peter para receber o presente quando ele chegar!", // 【未找到预制】-【脚本或动态使用】
  "adShieldTip": "Ganhe escudo grátis!", // 【GameMainWindow】-【New Label】；【slot】-【New Label】
  "slotServantAdTip": "Me dê comida!", // 【未找到预制】-【脚本或动态使用】
  "heist_main_window_free": "Grátis", // 【脚本】-【window/Activity/gift/GiftData.js】；【脚本】-【window/Activity/heist/HeistData.js】；【脚本】-【window/Activity/optionalGiftPack/meta/ActivityChoosePackMeta.js】
  "heist_main_window_title": "APROVEITE CADA DISTRIBUIÇÃO PARA REVELAR MAIS", // 【CastleGardenMainWindow】-【Label - Msg】；【GiftMainWindow】-【Label - Msg】；【HeistMainWindow】-【Label - Msg】；【RocketMainWindow】-【Label - Msg】
  "heist_main_window_cannot_buy": "Desbloqueie comprando a oferta anterior", // 【GiftMainWindow】-【label-cannot-reason】；【CastleGardenMainWindow】-【label-cannot-reason】；【HappyGiftPackWindow】-【label-cannot-reason】；【HappyVacationWindow】-【label-cannot-reason】；【HeistMainWindow】-【label-cannot-reason】；【OptionalGiftPackWindow】-【label-cannot-reason】；【还有1处】-【同Key】
  "SlotBetNewMax": "Limite de aposta aumentado", // 【slot】-【Label - Msg】
  "SlotBetSuper": "SUPER", // 【slot】-【New Label】
  "I18N_BUY_NOW": "COMPRE AGORA", // 【ActivityDaysSaleWindow】-【Label - Price】；【ActivityGameShowWindow】-【labelButton】；【ActivitySalePackWindow】-【labelButton】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE": "<color=#ffffff>até 20% MAIS Moedas e Spins</color>", // 【ActivityDaysSaleWindow】-【Message】
  "I18N_ACTIVITY_DAYS_SALE_MESSAGE_SHADOW": "<color=#308ae6>até 20% MAIS moedas e giros</color>", // 【ActivityDaysSaleWindow】-【Message_shadow】
  "I18N_SLOT_SYMBOL_BET_HIGHER_INFO": "<outline color=#4f3c97 width= 3>Aposte mais alto para multiplicar tudo o que você colecionar! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankInfoWindow】-【Label - Des2】
  "I18N_SLOT_SYMBOL_BET_HIGHER_WINDOW": "<outline color=#2d1771 width= 3>Aposte mais alto para multiplicar tudo o que você colecionar! <img src='1_s'/></outline>", // 【ActivitySlotSymbolRankWindow】-【Label - Des2】
  "I18N_JOKER_CARD_REPLACE_LIMITED": "A carta curinga está disponível para substituir a carta limitada.", // 【alien】-【des】；【circus】-【des】；【coin】-【des】；【film】-【des】；【music】-【des】；【pilot】-【des】；【还有6处】-【同Key】
  "I18N_APP_COMMENT_ENJOYING": "CURTINDO O COIN GANG", // 【AppCommentWindow】-【New Label】
  "I18N_PLACEHOLDER_ENTER_TEXT": "Digite o texto aqui...", // 【AvatarWindow】-【PLACEHOLDER_LABEL】；【DeleteWindow】-【PLACEHOLDER_LABEL】
  "CardCrazySetDes": "<outline color=#5f2210 width=2><color=#ffe300>GANHE <color=#ffffff>{0}% DE RECOMPENSAS EXTRAS</color> por cada conjunto de cartas que completar!</color></outline>", // 【CardCrazySetWindow】-【message】
  "I18N_CARD_JOIN_GROUP_BUTTON": "JUNTE-SE AO GRUPO", // 【CardJoinGroupWindow】-【Label】
  "I18N_CARD_JOIN_OUR": "Junte-se a nós", // 【CardJoinGroupWindow】-【txt_JoinOur】
  "I18N_CARD_LIMIT_SUBJECT_MESSAGE": "<outline color=#0a39a3 width=2>Pegue as cartas desses baús! Esses baús só estão disponíveis durante o evento! Você pode conseguir esses baús especiais na loja e em outros eventos.</outline>", // 【CardLimitSubjectOpenWindow】-【Message】
  "I18N_CARD_LIMIT_SUBJECT_TITLE": "<outline color=#0a39a3 width=2>Conjuntos de cartões de tempo limitado</outline>", // 【CardLimitSubjectOpenWindow】-【Message_shadow】
  "I18N_GO_EXCLAMATION": "Vai!", // 【CoinNotEnoughWindow】-【Label - Price】
  "I18N_CONGRATS_COUPON_MESSAGE": "<outline color=#8a2800 width=3>Use cupom para comprar pacotes e conseguir 100% mais moedas, baús e giros!</outline>", // 【CongratsWindow】-【Message】
  "I18N_DELETE_BUTTON_SHORT": "Excluir", // 【DeleteWindow】-【Label】
  "I18N_DELETE_ENTER_CONFIRM": "Digite \"Excluir\" para confirmar a exclusão da sua conta!", // 【DeleteWindow】-【New Label】
  "I18N_FOLLOW_LATEST_NEWS": "Siga a conta oficial para as últimas notícias", // 【FollowWindow】-【New Label】
  "I18N_INVITE_REWARD_ENTER_CODE": "Digite o código de convite de um amigo para ganhar uma recompensa!", // 【GetInviteRewardsWindow】-【New RichText】
  "I18N_INVITE_REWARD_CHECK_CODE": "Confira o código do convite", // 【GetInviteRewardsWindow】-【New RichText copy】
  "I18N_INVITE_CODE_PLACEHOLDER": "Código de convite", // 【GetInviteRewardsWindow】-【PLACEHOLDER_LABEL】
  "I18N_BUY_ONE_GET_TWO_PACK": "Compre um Big Pack, ganhe dois grátis!", // 【HappyGiftPackWindow】-【Label】；【HappyVacationWindow】-【Label】
  "I18N_HELP": "Ajuda", // 【PassPortHelpWindow】-【title_label】；【MergePassPortIconWindow】-【des_label】；【MergePassPortIconWindow】-【title_label】
  "I18N_MERGE_PASSPORT_LIMIT_TASK_TIP": "Complete as tarefas de tempo limitado de hoje para desbloquear tarefas de recompensa com pontos mais altos!", // 【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_ACTIVATE": "Ativar", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_BUY_LEVEL": "Nível de Compra", // 【MergePassPortMainWindow】-【Label】
  "I18N_MERGE_PASSPORT_RECEIVE": "Receber", // 【MergePassPortMainWindow】-【Label】；【MergePassPortMainWindow】-【New Label】
  "I18N_MERGE_PASSPORT_FREE": "Grátis", // 【MergePassPortMainWindow】-【label - pay】
  "I18N_MERGE_PASSPORT_PASS": "Passe", // 【MergePassPortMainWindow】-【label - pay】
  "Chapter_Stage": "Stage {0}/{1}", // 【MapBuildStageUpgradeWindow】-【reward】
  "EXP": "EXP", // 【MapBuildStageUpgradeWindow】-【count】；【MapBuildUpgradeWindow】-【count】；【MapBuyBuildWindow】-【count】
  "MAP_BUILD_LEVEL_MAX": "Nível: Max", // 【MapBuildMaxLevelWindow】-【New Label】
  "MAP_BUILD_LEVEL_UP": "Suba de nível", // 【0】-【Txt】；【1】-【Txt】；【10】-【Txt】；【11】-【Txt】；【12】-【Txt】；【13】-【Txt】；【还有35处】-【同Key】
  "MAP_BUILD_PHASE_BONUS": "Bônus de Fase", // 【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "MAP_BUILD_UPGRADE_TITLE": "Melhorem edifícios", // 【MapBuildMaxLevelWindow】-【Title】；【MapBuildStageUpgradeWindow】-【Title】；【MapBuildUpgradeWindow】-【Title】；【MapBuyBuildWindow】-【Title】
  "I18N_OPTIONAL_GIFT_ONLY_ONE": "*Você só pode comprar um pacote.", // 【OptionalGiftPackWindow】-【Label】
  "I18N_RANDOM_CHEST_JOKER_CARD": "<color=#FF4423><outline color = #302468 width=2>CARTA CORINGA</outline></c>", // 【RandomChestPanel】-【New RichText】
  "I18N_SUCCESS": "SUCESSO", // 【ShopBuySucessWindow】-【New Label】
  "I18N_TAP_TO_CONTINUE": "TOQUE PARA CONTINUAR", // 【ShopBuySucessWindow】-【New Label】
  "I18N_DAILY_REWARDS": "Recompensas Diárias", // 【SignWindow】-【title】
  "I18N_FEATURE_DESCRIPTION": "Descrição da Funcionalidade", // 【TalkUpgradeNode】-【New Label】
  "I18N_MERGE_SAND_UNLOCK_REWARD": "Junte-se ao lado da areia para desbloquear recompensas!", // 【ToastWindow】-【dsc】
  "I18N_VIP_FREE_TRIAL_MONTH": "3 dias de teste grátis, depois $16,99 por mês", // 【VIPGetWindow】-【Label2】
  "MAP_BUILD_BUILDING_NAME": "Nome do edifício", // 【MapBuildMaxLevelWindow】-【nameTitle】；【MapBuildStageUpgradeWindow】-【nameTitle】；【MapBuildUpgradeWindow】-【nameTitle】；【MapBuyBuildWindow】-【nameTitle】
  "I18N_ACTIVITY_SLOT_SYMBOL_REWARD_PREVIEW": "Prévia de Recompensas", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "I18N_ACTIVITY_SLOT_SYMBOL_FINAL_REWARDS": "Recompensas Finais", // 【ActivitySlotSymbolPreviewWindow】-【txt】
  "COLLECTED": "COLETADO", // 【未找到预制】-【脚本或动态使用】
  "PayFailWindowDes": "Está tendo problemas para comprar?", // 【PayFailWindow】-【label】
  "PayFailWindowBtn": "Contate o Suporte", // 【PayFailWindow】-【New Label】
  "ErrorMsg1114": "Assista a muitos vídeos hoje", // 【未找到预制】-【脚本或动态使用】
  "ContentNameCash": "Dólares", // 【脚本】-【game/items/Content.js】
  "ContentNameChest5": "Carta aleatória", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest6": "Cartão Dourado", // 【未找到预制】-【脚本或动态使用】
  "ContentNameChest7": "Baú Mágico", // 【脚本】-【window/Shop/ShopChestItem.js】
  "ContentNameServant": "Servo", // 【脚本】-【window/Card/CardSingleSetWindow.js】
  "RaidProtect": "PROTEÇÃO POR ROUA", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol2": "ICE", // 【未找到预制】-【脚本或动态使用】
  "SlotSymbol3": "BOLA", // 【未找到预制】-【脚本或动态使用】
  "DailyNowWelcome": "BEM-VINDO!", // 【dailyBonus】-【Text】
  "menu_12_sign": "CALENDÁRIO DE RECOMPENSAS", // 【MenuWindow】-【name】
  "setting_lowbattery": "Modo de Baixa Potência", // 【SettingWindow】-【New Label】
  "setting_lowbattery_tip": "Ativar o Modo de Baixo Consumo reduz o consumo de energia, mas diminui o desempenho.", // 【脚本】-【window/Menu/SettingWindow.js】
  "setting_restore": "Restaurar Compra", // 【SettingWindow】-【_LabelShadow_child_New Label】；【SettingWindow】-【New Label】
  "setting_vipCrown": "Show VIP Crown", // 【未找到预制】-【脚本或动态使用】
  "privacy_title": "Para tocar Coin Gangster,\nPor favor, confirme", // 【PrivacyWindow】-【label_watch】
  "privacy_des": "<color=#d3b8ff>    Ao continuar, reconheço que a Happy Donut pode armazenar e processar meus dados de acordo com a <color=#ffffff><u><on click='privacyHandler'>Política de Privacidade</on></u></color>.\n\nLi e concordo com os <color=#ffffff><u><on click='termHandler'>Termos e Condições</on></u></color>, que estabelecem um contrato e incluem uma renúncia a ações coletivas e uma cláusula de arbitragem.</color>", // 【PrivacyWindow】-【New RichText】
  "setting_language_fr": "Francês", // 【SettingLanguageWindow】-【label】
  "setting_language_zh_tw": "Chinês tradicional", // 【SettingLanguageWindow】-【label】
  "setting_language_ja": "Japonês", // 【SettingLanguageWindow】-【label】
  "setting_language_ko": "한국어", // 【SettingLanguageWindow】-【label】
  "setting_language_it": "Italiano", // 【SettingLanguageWindow】-【label】
  "setting_language_pt": "Português", // 【SettingLanguageWindow】-【label】
  "setting_language_he": "עברית", // 【SettingLanguageWindow】-【label】
  "LeaderBoardWindowTip": "*Atualiza em 10 minutos", // 【LeaderboardWindow】-【note】
  "ShopShield": "Super\nEscudo", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes1": "ESCUDOS DE PRATA", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes2": "ESCUDOS DOURADOS", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes3": "Proteja Seu Reino", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes4": "Proteja-se contra:", // 【未找到预制】-【脚本或动态使用】
  "ShopShieldDes5": "<color=#874423>Ataques e <color=#288bdf>Raids</color> (exclusivo)</color>", // 【未找到预制】-【脚本或动态使用】
  "SuperShieldOpenDes": "Super Shield protege seu reino de ataques e ataques por muito tempo.", // 【SuperShieldOpenWindow】-【Label2】
  "village_news_log_hammer_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> atacou seu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_shield_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> falhou em atacar seu reino</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_pig_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> roubou {1} de você</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_invite_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> entrou para Coin Gang</color></outline>", // 【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_log_noraid_vip": "<outline color=#984800 width=2><color=#ffd800>{0}</color></outline><outline color=#382681 width=2><color=#ffffff> não conseguiu roubar {1} de você</color></outline>", // 【脚本】-【window/GameMainWindow.js】；【脚本】-【window/Menu/VillageNewsWindow.js】
  "village_news_taptoopen": "Toque para abrir", // 【VillageNewsWindow】-【Label - tap】
  "village_news_deleteFriends": "<outline color=#692F39 width=2><color=#FFFFFF>{0}</color></outline><color=#ffffff> te removi como amigo</color>", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectLabel1": "<outline color=#a32f2f width= 2><color=#ffffff>Colecionar {0} <img src='{1}_s'/> para ganhar!</color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectLabel2": "<outline color=#a32f2f width= 2><color=#ffffff>Aposte mais alto para ganhar mais <img src='{0}_s'/></color></outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolShowWindow.js】
  "ActivitySlotCollectRankInfoLabel1": "<color=#ffffff>Colete <img src='{0}_s'/> para subir no ranking!</color>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】
  "ActivitySlotCollectRankInfoLabel2": "<outline color=#2d1771 width= 3>Aposte mais alto para multiplicar cada <img src='{0}_s'/> que você receber!</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankInfoWindow.js】；【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankGetStart": "Comece a jogar para colecionar", // 【未找到预制】-【脚本或动态使用】
  "ActivitySlotCollectRankGetJoin": "<outline color=#5E2301 width=2>fazer <img src='{0}_s' /> entrar na</outline>", // 【脚本】-【window/Activity/normal/ActivitySlotSymbolRankWindow.js】
  "ActivitySlotCollectRankRewardWinner": "VENCEDOR!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - Win】
  "ActivitySlotCollectRankRewardDes": "Aqui está o que você ganhou:", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankRewardEnd": "O torneio terminou", // 【ActivitySlotSymbolRankRewardWindow】-【Label - end】
  "ActivitySlotCollectRankRewardDesLose": "Você não ganhou desta vez, mas ainda assim ganha um prêmio!", // 【ActivitySlotSymbolRankRewardWindow】-【Label - des】
  "ActivitySlotCollectRankGiftsCollected": "Presentes Coletados", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankReach": "Alcance", // 【ActivitySlotSymbolRankTester】-【New Label】；【ActivitySlotSymbolRankWindow】-【New Label】
  "ActivitySlotCollectRankGRANDPRIZE": "GRANDE PRÊMIO", // 【ActivitySlotSymbolRankTester】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankTester】-【Label - Title】；【ActivitySlotSymbolRankWindow】-【_LabelShadow_child_Label - Title】；【ActivitySlotSymbolRankWindow】-【Label - Title】
  "CardChestInfoWindowLeast": "Pelo menos um:", // 【CardChestInfoWindow】-【label-high-chance】
  "CardTradeTradable": "Negociável", // 【CardSingleSetWindow】-【goldTrade】
  "CardTradeButton": "VAI TROCAR!", // 【CardGoldTradeWindow】-【labelButton】
  "CardTradeDes": "AGORA SÃO NEGOCIÁVEIS!", // 【CardGoldTradeWindow】-【Label - Des】
  "CardJoinGroupTitle": "Grupo de Troca de Cartas", // 【CardJoinGroupWindow】-【New Label】
  "CardJoinGroupDes1": "Poste quais cartões você está perdendo", // 【CardJoinGroupWindow】-【New Label1】
  "CardJoinGroupDes2": "Troque cartas duplicadas", // 【CardJoinGroupWindow】-【New Label2】
  "CardJoinGroupDes3": "Ganhe grandes recompensas!", // 【CardJoinGroupWindow】-【New Label3】
  "CardJoinGroupDes4": "Faça novos amigos", // 【CardJoinGroupWindow】-【New Label4】
  "NewPlayerCongratsDes1": "Você tem um cupom!", // 【CongratsWindow】-【Label - tip】
  "NewPlayerCongratsDes2": "<outline color=#8a2800 width=3>Use cupom para comprar pacotes e ganhar {0}% a mais moedas <color=#fefe28></color>, baús e rodadas <color=#64ebff></color>!</outline>", // 【脚本】-【window/Shop/CongratsWindow.js】
  "NewPlayerTip": "*Novos usuários, só uma vez!", // 【NewPlayerPackWindow】-【New Label】
  "MultiplePurchaseBtn": "SPIN", // 【MultiplePurchaseWindow】-【Label】
  "VipGetWindowRewardRewards": "Recompensas", // 【VIPGetWindow】-【Label - Rewards】
  "VipGetWindowRewardDes": "Ganhe rodadas e moedas extras no jogo Slot", // 【VIPGetWindow】-【Label - Des】
  "VipGetWindowDailyTitle": "Recompensas Diárias", // 【VIPGetWindow】-【Label - Title】
  "VipGetWindowDailyRecovery": "Limite de RECUPERAÇÃO", // 【VIPGetWindow】-【Label - rec】
  "VipGetWindowDailySpe": "<color=#FFB8BF>Look brilhante com <color=#fed400>nome vermelho</color> e <color=#fed400>coroa</color>!</color>", // 【VIPGetWindow】-【New RichText】
  "VipGetWindowButtonYear": "ANO", // 【VIPGetWindow】-【Label - year】
  "VipGetWindowButtonMonth": "MÊS", // 【VIPGetWindow】-【Label - month】
  "VipGetWindowButtonWeek": "SEMANA", // 【VIPGetWindow】-【Label - week】
  "VipGetWindowPolicy": "<color=#5e2802>VIP, pelo preço especificado, oferece assinatura e oferece Giros, Comida e Cartões todos os dias. Esta é uma <color=#203d9b><u><on click=\"handle\" param=\"sub\">de renovação automática da assinatura</on></u></c>. O pagamento é cobrado na sua conta telefônica na confirmação. <color=#5e2802>A assinatura é renovada, a menos que seja desligada 24 horas antes do término do período, e sua conta será cobrada pela renovação.</c> Você pode desativá-lo nas configurações da sua conta. Qualquer parte não utilizada do período experimental gratuito, se oferecida, será perdida quando o usuário adquirir uma assinatura, quando aplicável. <color=#203d9b><u><on click=\"handle\" param=\"pri\">Política de Privacidade e Termos de Uso</on></u></c>.</c>", // 【VIPGetWindow】-【label】
  "VipGetWindowHot": "QUENTE", // 【VIPGetWindow】-【Label - Hot】
  "VipGetTrialButtonDes1": "Comece de graça", // 【VIPGetWindow】-【Label】
  "VipGetTrialButtonDes2": "3 dias de teste gratuito, depois {0} por mês", // 【脚本】-【window/VIP/VIPGetWindow.js】
  "VipDailyRewardDes": "Receba isso TODO DIA!", // 【VIPDailyRewardWindow】-【Label - Des】
  "VipExtraRewardButton": "GET ALL", // 【VIPExtraRewardWindow】-【Label - Price】
  "VipExtraRewardDes": "Desbloqueie VIP para conseguir TODO o BÔNUS acumulado", // 【VIPExtraRewardWindow】-【Label - Des】
  "CashTaskWindowTitle": "Banco do Dinheiro", // 【未找到预制】-【脚本或动态使用】
  "CashTaskBadge1": "Desbloquear\nNível {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskBadgeShop": "Troca\nNível {0}", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashTaskShopButton": "Troca", // 【未找到预制】-【脚本或动态使用】
  "CashTaskShopTip": "Desbloquear o nível {0} para abrir", // 【脚本】-【window/Quest/CashTaskWindow.js】
  "CashShopWindowTitle": "Troca", // 【CashShopWindow】-【titleText】
  "CashShopNotEnough": "Sem dinheiro!", // 【脚本】-【window/Shop/CashShopWindow.js】
  "LuckyDrawFree": "Grátis", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes1": "Assista ao vídeo", // 【未找到预制】-【脚本或动态使用】
  "LuckyDrawDes2": "Get Chance", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes1": "<outline color=#7d3d2f width=3><size=46><color=#fffe00>bônus de 30</color></size> vezes extra\nCom certeza <size=46><color=#7ee0f4>5000+</color></size> giros!</outline>", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusDes2": "Ganhe muitas recompensas de giro depois de comprar o passe de nível!", // 【未找到预制】-【脚本或动态使用】
  "LevelBonusItemDes": "Para o reino {0}", // 【脚本】-【window/Quest/LevelBonusWindow.js】
  "JokerCard": "Carta Coringa", // 【脚本】-【game/items/Content.js】
  "JokerCardDes": "Escolha uma carta, qualquer carta!", // 【JokerCardWindow】-【Label - Des】
  "JokerCardPrize": "Cenário\nPrêmio", // 【JokerCardWindow】-【Label - choose】
  "JokerCardComp": "COMPLETE O CONJUNTO", // 【JokerCardWindow】-【New Label】
  "JokerCardChoose": "Só mostro cartões que não tenho", // 【JokerCardWindow】-【Label - choose】
  "JokerCardBtnOK": "Eu aceito!", // 【JokerCardWindow】-【Label - Price】
  "JokerCardTimeleft": "Expira em", // 【脚本】-【window/Card/JokerCardWindow.js】
  "JokerCardTimeTip": "Sua carta Curinga está esperando.\nEscolha a carta que quer que seja antes que o tempo acabe!", // 【JokerCardWindow】-【label】
  "JokerCardChooseNow": "Escolha agora", // 【JokerCardWindow】-【New Label】
  "JokerCardChoseDes": "Você escolheu a carta {0} ", // 【脚本】-【window/Card/JokerCardWindow.js】
  "CardCrazySetBtn": "CONJUNTOS COMPLETOS", // 【CardCrazySetWindow】-【labelButton】
  "CardCrazySetTip": "*Você será recompensado por qualquer conjunto de cartas que completar durante o evento", // 【CardCrazySetWindow】-【tip】
  "RandomChestRate": "1 de {0} baús contém um", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomChestBack": "({0}/{1}) garantido!", // 【脚本】-【window/Item/RandomChestPanel.js】
  "RandomJockerChest": "Pode ser comprado {0}/{1} vezes por semana", // 【脚本】-【window/Item/RandomChestPanel.js】
  "CardChangeWindowTip": "TROQUE SUAS CARTAS DUPLICADAS\nPARA EMPOLGAR", // 【CardChangeWindow】-【tip_Label】
  "CardChangeWindowLouckButton": "DESBLOQUEIA EM\nREINO {0}", // 【脚本】-【window/Card/CardAllSetWindow.js】；【脚本】-【window/Card/CardChestItem.js】
  "Guild_Team": "Equipe", // 【未找到预制】-【脚本或动态使用】
  "Guild_Friends": "Amigos", // 【未找到预制】-【脚本或动态使用】
  "Guild_Create": "Criar", // 【未找到预制】-【脚本或动态使用】
  "Guild_Browse": "Navegar", // 【未找到预制】-【脚本或动态使用】
  "Guild_Cancel": "Cancelar", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamName": "Nome da Equipe:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Badge": "Distintivo", // 【未找到预制】-【脚本或动态使用】
  "Guild_Description": "Descrição:", // 【未找到预制】-【脚本或动态使用】
  "Guild_TeamType": "Tipo de Equipe:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Required": "Estrelas Obrigatórias:", // 【未找到预制】-【脚本或动态使用】
  "Guild_Editor": "Editor", // 【未找到预制】-【脚本或动态使用】
  "Guild_Open": "Aberto", // 【未找到预制】-【脚本或动态使用】
  "Guild_Closed": "Fechado", // 【未找到预制】-【脚本或动态使用】
  "Guild_Leave": "Vá embora", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join": "Junte-se", // 【未找到预制】-【脚本或动态使用】
  "Guild_View": "Equipe de Visualização", // 【未找到预制】-【脚本或动态使用】
  "Guild_Visit": "Visita", // 【未找到预制】-【脚本或动态使用】
  "Guild_Remove": "Remover", // 【未找到预制】-【脚本或动态使用】
  "Guild_invite_friends": "Convide Amigos", // 【未找到预制】-【脚本或动态使用】
  "Guild_Top": "Recomendação principal de equipe", // 【未找到预制】-【脚本或动态使用】
  "Guild_Choose_Badge": "Escolha o Distintivo do Time", // 【未找到预制】-【脚本或动态使用】
  "Guild_Help": "Ajuda", // 【HelpWindow】-【title_label】
  "Guild_Request": "Pedido", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card": "Escolha uma carta para solicitar aos companheiros de equipe", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_Title": "Cartão de Solicitação", // 【未找到预制】-【脚本或动态使用】
  "Guild_FID": "ID:", // 【未找到预制】-【脚本或动态使用】
  "Guild_left": "{0} saiu do time!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Joined": "{0} entrou para o time!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Members": "Membros:{0}/{1}", // 【未找到预制】-【脚本或动态使用】
  "Guild_Not_enough": "Não é suficiente ☆!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter": "Você só pode inserir cartas!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Can_Letter1": "O nome do time deve ter pelo menos 3 caracteres!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Card_count": "{0} dá uma carta x1", // 【未找到预制】-【脚本或动态使用】
  "Guild_AddFriends": "Adicionar Amigos", // 【未找到预制】-【脚本或动态使用】
  "Delete_Button": "EXCLUIR CONTA E DADOS", // 【未找到预制】-【脚本或动态使用】
  "Delete_Title": "AVISO", // 【DeleteWindow】-【title_lable】
  "Delete_warning": "Você está prestes a excluir sua conta e todos os dados.\n  Não pode ser restaurado após a exclusão.", // 【DeleteWindow】-【des】
  "menu_13_Friends": "AMIGOS", // 【未找到预制】-【脚本或动态使用】
  "menu_14_delete": "Excluir Conta", // 【MenuWindow】-【name】
  "setting_delete": "Excluir Conta", // 【SettingWindow】-【New Label】
  "BindTitle": "Conta", // 【AccountBindWindow】-【title_label】
  "BindSwitchTitle": "Conta Trocada", // 【AccountBindWindow】-【Label】；【AccountSwitchWindow】-【title_label】
  "BindFacebookTip1": "Depois de vincular sua conta,\nVocê pode jogar em outros dispositivos", // 【AccountBindWindow】-【tip】
  "BindFacebookTip2": "Esta conta de rede social está vinculada\n Para uma conta de jogo.\n Você pode voltar para\n sua conta original do jogo\n Ou entre em contato conosco para desvinculá-lo.", // 【AccountHintWindow】-【tip】
  "BindFacebookTip3": "Toque em [Mudar de Conta] para fazer login", // 【AccountHintWindow】-【tip】
  "BindFacebookTip4": "Entre em contato conosco para desvincular a ligação", // 【AccountHintWindow】-【tip】
  "ShopDaily": "Especiais Diários", // 【ShopWindow】-【subtitle】
  "ShopGem": "Gem", // 【ShopWindow】-【New Label】；【ShopWindow】-【subtitle】
  "ShopItem": "Item", // 【ShopWindow】-【New Label】
  "ShopHot": "Quente", // 【ShopWindow】-【subtitle】
  "JokerChestDes": "A quantidade de baús do Coringa\nÀ venda semanal é limitado", // 【未找到预制】-【脚本或动态使用】
  "Appoint": "Nomeá-lo como novo administrador?", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More1": "<outline color=#6a01ba width=1><color=#9d2cf4>COUPON</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}%</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> MAIS RODADAS</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More2": "<color=#ffffff>{0}</color>", // 【未找到预制】-【脚本或动态使用】
  "shopWindow6More3": "<outline color=#6a01ba width=1><color=#63fe46>SEU DESCONTO</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Para</color></outline><outline color=#6a01ba width=1><color=#63fe46>{0}% extra</color></outline><outline color=#6a01ba width=1><color=#9d2cf4> Giros ou Moedas</color></outline><outline color=#6a01ba width=1><color=#9d2cf4>Tempo restante:  {1}</color></outline>", // 【脚本】-【window/Menu/GiftsWindow.js】
  "CongRats1": "Você tem um cupom!\n Para mais {0}\nSpins ou Moedas", // 【未找到预制】-【脚本或动态使用】
  "CongRats2": "Candidate-se", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss1": "<outline color=#000000 width= 2><color=#FFFFFF>Desde que toda a equipe <img src='bossyucha'/>\n coleta junto, você pode conseguir o\n 'Time Baú do Tesouro'!</color></outline>", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss2": "Prêmio Supremo", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss3": "Pelos tesouros das profundezas,\nA equipe toda deve derrotar o monstro marinho!", // 【未找到预制】-【脚本或动态使用】
  "ActivityOpenBoss4": "Diz a lenda que o vasto oceano\nesconde tesouros infinitos, e para\nObtê-los, é preciso mergulhar\nAs profundezas infinitas e a derrota\nos monstros guardando o abismo.\nColete arpões com seu time\ne derrotar todos os monstros!\n1. Para conseguir um arpão, você precisa atacar e atacar.\n2. Use o arpão para derrotar o monstro, depois toque nele para receber recompensas.\n3. Você pode entrar no ranking após causar alto dano aos monstros.\n4. Quanto maior o dano causado ao monstro, maior a recompensa.\n5. Recompensas do ranking serão enviadas para a caixa de correio após o evento.", // 【未找到预制】-【脚本或动态使用】
  "CardChangeWindowHave": "Você tem:", // 【CardChangeWindow】-【label】
  "CardChangeWindowDown": "A troca de cartas não vai diminuir seu progresso no jogo", // 【CardChangeWindow】-【explain】
  "CardTradeWindowSelect": "Selecione cartas para", // 【CardTradeWindow】-【Label】
  "CardTradeWindowAutoSelect": "Selecione cartas para mim", // 【CardTradeWindow】-【Label】
  "CardTradeWindowTradeButton": "COMÉRCIO", // 【CardTradeWindow】-【Label】
  "JackT_depart": "Partida", // 【未找到预制】-【脚本或动态使用】
  "JackT_grand": "Grande Prêmio:", // 【未找到预制】-【脚本或动态使用】
  "JackT_prize": "Prêmio", // 【未找到预制】-【脚本或动态使用】
  "JackT_ticket": "Vamos brincar e ganhar recompensas!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_give": "Desistir vai perder todos os seus prêmios!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_two": "Mais dois níveis serão níveis bônus!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_quit": "Desista", // 【未找到预制】-【脚本或动态使用】
  "JACKT_revival": "Renascimento", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level": "Tem certeza que quer sair?", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Level1": "Vá embora sem nada!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips": "Dicas", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips1": "Jack pega uma passagem aérea para uma viagem e acaba sendo perseguido pela polícia. Evite a polícia e escolha o cartão certo para receber a recompensa.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips2": "Prêmios serão adicionados ao prêmio. Os jogadores podem escolher sair do jogo a qualquer momento e receber a recompensa atual.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips3": "Após serem presos pela polícia, os jogadores podem reviver assistindo a um anúncio ou pagando. Você pode sair do jogo sem recompensa.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips4": "Pague para reviver e consiga passagens aéreas e recompensas SUPER RICAS.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Tips5": "Níveis bônus serão visualizados no jogo.", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Continue": "Continue", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "JACKT_All": "Colete todas as recompensas!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Out": "Tempo!", // 【未找到预制】-【脚本或动态使用】
  "JACKT_goto": "IR A", // 【未找到预制】-【脚本或动态使用】
  "JACKT_Over": "Receba Recompensa!", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join1": "Você precisa deixar seu time atual para entrar em um novo.", // 【未找到预制】-【脚本或动态使用】
  "Guild_Join2": "Tabela de Líderes", // 【未找到预制】-【脚本或动态使用】
  "Guild_Ranks": "Patente", // 【未找到预制】-【脚本或动态使用】
  "GuildOpenWindow": "Entre para um time, faça amigos e faça mais giros e cartas com seus companheiros!", // 【未找到预制】-【脚本或动态使用】
  "Guild_joinNow": "JUNTE-SE AGORA", // 【未找到预制】-【脚本或动态使用】
  "cards": "<color=#ff0000>{0}</color><color=#ffffff> completou o conjunto </color><color=#FFBC06>{1}</color><color=#ffffff>! Parabéns!</color>", // 【未找到预制】-【脚本或动态使用】
  "package": "<color=#ff0000>{0}</color><color=#ffffff> comprei um </color><color=#FFBC06>{1}</color><color=#ffffff>! Eles são muito ricos agora!</color>", // 【未找到预制】-【脚本或动态使用】
  "box": "<color=#ff0000>{0}</color><color=#ffffff> comprei um </color><color=#FFBC06>{1}</color><color=#ffffff>. Vamos abençoá-los!</color>", // 【未找到预制】-【脚本或动态使用】
  "jokerCard": "<color=#ff0000>{0}</color><color=#ffffff> tem um </color><color=#FFBC06>{1}</color><color=#ffffff>! Parabéns!</color>", // 【未找到预制】-【脚本或动态使用】
  "lev": "<color=#ffffff>Incrível!</color><color=#ff0000>{0}</color><color=#FFBC06>{1}</color><color=#ffffff> acabou de terminar todos os mapas!</color>", // 【未找到预制】-【脚本或动态使用】
  "Town_level": "Nível Superior", // 【1】-【lvlbl】；【2】-【lvlbl】；【0】-【lvlbl】；【10】-【lvlbl】；【11】-【lvlbl】；【12】-【lvlbl】；【还有35处】-【同Key】
  "TaskPoint": "Pontos de Tarefa", // 【脚本】-【game/items/Content.js】
  "story1": "Etapa concluída", // 【ChapterEnd】-【title】；【StoryWindow】-【title】
  "story2": "Clique para continuar.", // 【GeneralStotyWindow】-【title】；【StoryWindow】-【title】
  "Chapter_Title_1_1": "Mapa 1 Edifício 1 Título do Capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_2": "Mapa 1 Edifício 2 Título do Capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_3": "Título do Capítulo do Prédio 3 do Mapa 1", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_4": "Mapa 1 Edifício 4 Título do Capítulo", // 【未找到预制】-【脚本或动态使用】
  "Chapter_Title_1_5": "Mapa 1 Edifício 5 Título do Capítulo", // 【未找到预制】-【脚本或动态使用】
  "AvatarWindow_title": "Informações sobre o jogador", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar": "Avatar", // 【AvatarWindow】-【New Label】
  "AvatarWindow_avatar_frame": "Avatar Frame", // 【AvatarWindow】-【New Label】
  "Button_Save": "Salvar", // 【AvatarWindow】-【New Label】
  "EditNickName": "Editar seu apelido", // 【脚本】-【window/Sys/AvatarWindow.js】
  "Merge_Level_Name": "Nível {0}", // 【脚本】-【window/Merge/MergeTypeWindow.js】
  "Merge_Default_Des": "<color=#A06E6E>Toque em uma peça para ver os detalhes aqui</color>", // 【未找到预制】-【脚本或动态使用】
  "Merge_Generate_From": "Gerado a partir de", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Additional_Des": "Geração adicional após a atualização", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Generate": "Pode gerar", // 【MergeTypeWindow】-【New Label】
  "Merge_Generate_Can_Cook": "Sabe cozinhar", // 【MergeTypeWindow】-【New Label】
  "Merge_Warehouse_title": "Armazenamento", // 【StoreWindow】-【New Label】
  "Merge_Warehouse_addbtn": "Adicionar", // 【StoreWindow】-【Label_name】
  "Merge_Three_To_One_Window_Title": "Caixa de Seleção Aberta", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Three_To_One_Window_Des": "Selecione uma das seguintes recompensas", // 【ScissorsWindow】-【New Label】；【ThreeToOneWindow】-【New Label】
  "Merge_Cooking_method": "Método de produção", // 【MergeCookingConfirmWindow】-【methodLabel】；【MergeCookingRecipeWindow】-【methodLabel】
  "Merge_Cooking_Finish_Des": "Bata nos utensílios para coletar o produto final.", // 【脚本】-【game/merge/MergeDes.js】
  "BindFacebookTip5": "Dica", // 【AccountHintWindow】-【title_label】
  "BindFacebookTip6": "Se você já tem uma conta vinculada,\n Você pode fazer login nessa conta\n para continuar jogando.", // 【AccountSwitchWindow】-【tip】
  "ErrorCode1121": "Esta conta tem dados do jogo", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1122": "Vinculação/Troca falhou", // 【未找到预制】-【脚本或动态使用】
  "ErrorCode1123": "A conta corrente já está vinculada a esses dados do jogo", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeWelcome": "Boas-vindas", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeDragMerge": "Mescle estas peças", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeClickgenerator": "Toque no gerador", // 【未找到预制】-【脚本或动态使用】
  "TutorialMergeOrderCom": "Pedido concluído", // 【未找到预制】-【脚本或动态使用】
  "Merge_Broken_Des": "Estourar?", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Break": "Quebrar", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "Merge_Cancel": "Cancelar", // 【脚本】-【game/merge/MergeBubbleDes.js】
  "ShopLeft": "Restante", // 【脚本】-【window/Shop/ShopHotItem.js】；【脚本】-【window/Shop/ShopSaleItem.js】
  "ShopRefresh": "Intervalo de atualização", // 【ShopWindow】-【New Label】
  "ShopOver": "Esgotado", // 【ShopWindow】-【price】
  "ShopFree": "Grátis", // 【ShopWindow】-【New Label】；【ShopWindow】-【price】
  "Merge_Order_Complete": "Concluído", // 【mergeUI】-【New Label】
  "ShopSpin": "Comprar energia", // 【ApNotEnoughDialogWindow】-【des】
  "CardGoldenCannot": "Esse cartão é dourado.", // 【未找到预制】-【脚本或动态使用】
  "CardSendLimit": "Você atingiu o limite diário de cartões que pode enviar.", // 【未找到预制】-【脚本或动态使用】
  "CardInfoWindowPage2_1": "= 1 XP" // 【未找到预制】-【脚本或动态使用】
};

export default phrases;
