import { _decorator, assetManager, Component, game, SpriteFrame } from 'cc';
import { DEV } from 'cc/env';
import SoundManager from './GameKit/SoundManager';

const { ccclass, property } = _decorator;

type ErrorLog = {
    msg?: string;
    url?: string;
    line?: string;
};

let lastErrorLog: ErrorLog = {};

@ccclass('AppMain')
export class AppMain extends Component {
    @property([SpriteFrame])
    public spriteLoad: SpriteFrame[] = [];

    public static instance: AppMain | null = null;
    public static inited = false;

    public HasError = false;

    onLoad () {
        if (AppMain.inited) return;

        AppMain.instance = this;
        global.AppMain = AppMain;

        Game.OUser = new Game.User();
        Game.SUser = new Game.User();
        Game.SUserStory = new Game.UserStory(Game.SUser.UserId());
        Game.SUserMap = new Game.UserMap(Game.SUser.UserId());

        Logs.m_Level = Logs.Level.Log;
        Logs.enableDebug = false;

        if (!DEV) {
            this.registerErrorHandlers();
        }

        global.deviceId = GameKit.PlayerPrefs.GetString('deviceId', 'unknown');
        AppKit.NativeWrap.call('SDKHandleClass', 'GetDeviceId', null, function(info) {
            global.deviceId = info.deviceId || 'unknown';
            GameKit.PlayerPrefs.SetString('deviceId', info.deviceId);
        });
    }

    private registerErrorHandlers () {
        if (AppKit.SdkManager.IsNative()) {
            window.__errorHandler = function(url, line, msg, stack) {
                if (this.HasError) return;
                if (msg && msg.contains && msg.contains('fullscreen')) return;

                console.log('~~## ERROR ##~~', 'onerror', Game.SUser != null ? Game.SUser.UserId() : '', msg, url, line);
                this.logerror({ msg: JSON.stringify(msg), url: url, line: line, stack: stack });

                if (!url || !url.contains('cocos2d')) {
                    UIRoot.instance.openChildWindow('DialogWindow', {
                        msg: GameKit.i18n.t('ErrorNormal'),
                        confirmFunc: function() {
                            AppGame.instance.logout();
                        },
                    });
                }

                this.HasError = true;
            }.bind(this);
            return;
        }

        window.onerror = function(msg, url, line) {
            if (!this.HasError) {
                if (msg && msg.contains && msg.contains('fullscreen')) return true;

                console.log('~~## ERROR ##~~', 'onerror', Game.SUser != null ? Game.SUser.UserId() : '', msg, url, line);
                this.logerror({ msg: JSON.stringify(msg), url: url, line: line });
                UIRoot.instance.openChildWindow('DialogWindow', {
                    msg: GameKit.i18n.t('ErrorNormal'),
                    confirmFunc: function() {
                        AppGame.instance.logout();
                    },
                });
                this.HasError = true;
            }

            return true;
        }.bind(this);

        window.onunhandledrejection = function(event) {
            console.log(event);
            let reason = event.reason || {};
            let msg = reason.stack || reason.message || '';
            let url = '';
            let line = 0;

            if (!this.HasError) {
                if (msg && msg.contains && msg.contains('fullscreen')) return true;

                console.log('~~## ERROR ##~~', 'onerror unhandledrejection', Game.SUser != null ? Game.SUser.UserId() : '', msg, url, line);
                this.logerror({ msg: JSON.stringify(msg), url: url, line: line });
                UIRoot.instance.openChildWindow('DialogWindow', {
                    msg: GameKit.i18n.t('ErrorNormal'),
                    confirmFunc: function() {
                        AppGame.instance.logout();
                    },
                });
                this.HasError = true;
            }

            return true;
        }.bind(this);
    }

    logerror (msg: any) {
        if (!msg) return;

        const nextLog = {
            msg: (msg.msg || '').toString(),
            url: (msg.url || '').toString(),
            line: (msg.line || '').toString(),
            stack: (msg.stack || '').toString(),
        };

        if (
            lastErrorLog.msg === nextLog.msg &&
            lastErrorLog.url === nextLog.url &&
            lastErrorLog.line === nextLog.line
        ) {
            return;
        }

        if (wxTools.usewx) {
            let req = new GameKit.NetRequest(G.GameConfig.server + '/logerror');
            req.SetSilence(true);
            req.SetRequestBody('userId', Game.SUser.UserId());
            req.SetRequestBody('msg', nextLog.msg);
            req.SetRequestBody('url', nextLog.url);
            req.SetRequestBody('line', nextLog.line);
            req.Send();
        }

        AppKit.LogEventWrap.logEvent('logerror', nextLog);

        lastErrorLog.msg = nextLog.msg;
        lastErrorLog.url = nextLog.url;
        lastErrorLog.line = nextLog.line;
    }

    start () {
        if (AppMain.inited) return;

        AppMain.inited = true;
        AppKit.LogEventWrap.logEvent('app_start');
        GameKit.SoundManager.init();
        GameKit.BackKeyManager.init();
        AppGame.instance.logout();
    }

    onDestroy () {
        if (AppMain.instance === this) {
            AppMain.instance = null;
        }
    }

    public static RestartApp() {
        AppMain.inited = false;
        SoundManager.stopAllAudioSources();
        clearAllTimeout();
        clearAllInterval();
        assetManager.releaseAll();
        game.restart();
    }
}
