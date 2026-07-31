import { _decorator, Component, native, Node, sys } from 'cc';

const { ccclass, property } = _decorator;

type CompleteCallback = () => void;
type UpdatingCallback = (progress: number, info?: HotUpdateProgress) => void;
type ErrorCallback = (error: unknown) => void;

interface HotUpdateProgress {
    downloadedBytes: number;
    totalBytes: number;
    speedBytes: number;
}

interface HotUpdateStats {
    startTime: number;
    endTime: number;
    totalFiles: number;
    downloadedFiles: number;
    totalBytes: number;
    downloadedBytes: number;
    errorCount: number;
}

@ccclass('HotUpdate')
export class HotUpdate extends Component {
    @property(Node)
    updateUI: Node | null = null;

    private _updating = false;
    private _canRetry = false;
    private _storagePath = '';
    private _am: any = null;
    private _checkListener: unknown = null;
    private _updateListener: unknown = null;
    private _failCount = 0;
    private _lastDownloadBytes: number | null = null;
    private _lastDownloadTime = 0;
    private _downloadSpeedBytes = 0;
    private _hotUpdateStats: HotUpdateStats | null = null;
    private rversion = '';
    private overCallback: CompleteCallback | null = null;
    private updatingCallback: UpdatingCallback | null = null;
    private errorCallback: ErrorCallback | null = null;

    SetCallBack (func?: CompleteCallback) {
        this.overCallback = func || null;
    }

    SetUpdatingCallBack (func?: UpdatingCallback) {
        this.updatingCallback = func || null;
    }

    SetErrorCallBack (func?: ErrorCallback) {
        this.errorCallback = func || null;
    }

    CallOver () {
        if (this.overCallback) this.overCallback();
    }

    CallUpdating (progress: number, info?: HotUpdateProgress) {
        if (this.updatingCallback) this.updatingCallback(progress, info);
    }

    CallError (error: unknown) {
        if (this.errorCallback) this.errorCallback(error);
    }

    checkUpdate (rversion: string, func?: CompleteCallback, ndunc?: UpdatingCallback, errfunc?: ErrorCallback) {
        this.rversion = rversion;
        this.SetCallBack(func);
        this.SetUpdatingCallBack(ndunc);
        this.SetErrorCallBack(errfunc);

        if (!AppKit.SdkManager.IsNative()) {
            this.CallOver();
            return;
        }
        if (!this._am) {
            this.hotUpdate();
            return;
        }
        if (this._updating) {
            Logs.Log('Checking or updating ...');
            return;
        }
        if (this._am.getState() === native.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest('./project.manifest');
        }
        const localManifest = this._am.getLocalManifest();
        if (!localManifest || !localManifest.isLoaded()) {
            Logs.Log('Failed to load local manifest ...');
            this.CallOver();
            return;
        }

        const localVersion = localManifest.getVersion();
        if (GameKit.StringUtil.VersionOver(rversion, localVersion) <= 0) {
            Logs.Log('Already latest by rversion.');
            this.CallOver();
            return;
        }

        this._checkListener = this.checkCb.bind(this);
        this._am.setEventCallback(this._checkListener);
        this._am.checkUpdate();
        this._updating = true;
    }

    checkCb (event: any) {
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                Logs.Log('No local manifest file found, update skipped.');
                this.CallOver();
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                Logs.Log('Fail to download manifest file, update skipped.');
                this.CallError('Fail to download manifest file, update skipped.');
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                Logs.Log('Already latest.');
                this.CallOver();
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                Logs.Log('New update found.');
                this.clearEventCallback();
                this._updating = false;
                this.hotUpdate();
                this.CallUpdating(-1);
                return;
            default:
                return;
        }

        this.clearEventCallback();
        this._updating = false;
    }

    hotUpdate () {
        if (!this._am) {
            this.CallOver();
            return;
        }
        if (this._updating) return;

        this._updateListener = this.updateCb.bind(this);
        this._am.setEventCallback(this._updateListener);
        if (this._am.getState() === native.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest('./project.manifest');
        }

        this._failCount = 0;
        this._resetDownloadSpeedStats();
        this._resetHotUpdateStats();
        this._am.update();
        this._updating = true;
    }

    _resetDownloadSpeedStats () {
        this._lastDownloadBytes = null;
        this._lastDownloadTime = 0;
        this._downloadSpeedBytes = 0;
    }

    _resetHotUpdateStats () {
        this._hotUpdateStats = {
            startTime: Date.now(),
            endTime: 0,
            totalFiles: 0,
            downloadedFiles: 0,
            totalBytes: 0,
            downloadedBytes: 0,
            errorCount: 0,
        };
    }

    _updateHotUpdateStats (event: any) {
        if (!this._hotUpdateStats) return;
        this._hotUpdateStats.downloadedBytes = event.getDownloadedBytes();
        this._hotUpdateStats.totalBytes = event.getTotalBytes();
        this._hotUpdateStats.downloadedFiles = event.getDownloadedFiles();
        this._hotUpdateStats.totalFiles = event.getTotalFiles();
    }

    _formatHotUpdateSpeed (bytesPerSecond: number) {
        if (!bytesPerSecond || bytesPerSecond <= 0) return '0 KB/s';
        if (bytesPerSecond >= 1024 * 1024) {
            return `${(bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s`;
        }
        return `${Math.max(1, Math.round(bytesPerSecond / 1024)).toString()} KB/s`;
    }

    _logHotUpdateStats (result: string, message?: string) {
        if (!this._hotUpdateStats || this._hotUpdateStats.endTime > 0) return;
        const stats = this._hotUpdateStats;
        stats.endTime = Date.now();
        const durationMs = Math.max(0, stats.endTime - stats.startTime);
        const elapsedSeconds = durationMs / 1000;
        const avgSpeedBytes = elapsedSeconds > 0 ? stats.downloadedBytes / elapsedSeconds : 0;
        Logs.Log('hot_update_stats', JSON.stringify({
            result,
            durationMs,
            durationSec: Math.round(elapsedSeconds * 10) / 10,
            downloadedFiles: stats.downloadedFiles,
            totalFiles: stats.totalFiles,
            downloadedBytes: stats.downloadedBytes,
            totalBytes: stats.totalBytes,
            avgSpeed: this._formatHotUpdateSpeed(avgSpeedBytes),
            avgSpeedBytes: Math.round(avgSpeedBytes),
            errorCount: stats.errorCount,
            message: message || '',
        }));
    }

    _updateDownloadSpeed (downloadedBytes: number) {
        const now = Date.now();
        if (this._lastDownloadBytes == null) {
            this._lastDownloadBytes = downloadedBytes;
            this._lastDownloadTime = now;
            return 0;
        }

        const deltaTime = now - this._lastDownloadTime;
        if (deltaTime < 500) return this._downloadSpeedBytes;

        const deltaBytes = downloadedBytes - this._lastDownloadBytes;
        if (deltaBytes >= 0 && deltaTime > 0) {
            const instantSpeed = deltaBytes * 1000 / deltaTime;
            this._downloadSpeedBytes = this._downloadSpeedBytes > 0
                ? this._downloadSpeedBytes * 0.6 + instantSpeed * 0.4
                : instantSpeed;
        }
        this._lastDownloadBytes = downloadedBytes;
        this._lastDownloadTime = now;
        return this._downloadSpeedBytes;
    }

    updateCb (event: any) {
        let needRestart = false;
        let failed: string | true | false = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                Logs.Log('No local manifest file found, update skipped.');
                failed = 'No local manifest file found, update skipped.';
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION: {
                const downloadedBytes = event.getDownloadedBytes();
                const totalBytes = event.getTotalBytes();
                const progress = totalBytes > 0 ? downloadedBytes / totalBytes : event.getPercent();
                this._updateHotUpdateStats(event);
                this.CallUpdating(progress, {
                    downloadedBytes,
                    totalBytes,
                    speedBytes: this._updateDownloadSpeed(downloadedBytes),
                });
                break;
            }
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                Logs.Log('Fail to download manifest file, skipped.');
                failed = 'Fail to download manifest file, skipped.';
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                Logs.Log('Already latest.');
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                Logs.Log(`Update finished. ${event.getMessage()}`);
                this._updateHotUpdateStats(event);
                this._logHotUpdateStats('finished', event.getMessage());
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                Logs.Log(`Update failed. ${event.getMessage()}`);
                this._updateHotUpdateStats(event);
                this._logHotUpdateStats('failed', event.getMessage());
                this._updating = false;
                this._canRetry = true;
                DialogWindow.Show(
                    GameKit.i18n.t('AppHotUpdateFail'),
                    () => this.retry(),
                    () => AppMain.RestartApp(),
                );
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                Logs.Log(`Asset update error: ${event.getAssetId()}, ${event.getMessage()}`);
                if (this._hotUpdateStats) this._hotUpdateStats.errorCount++;
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                Logs.Log(event.getMessage());
                if (this._hotUpdateStats) this._hotUpdateStats.errorCount++;
                break;
            default:
                break;
        }

        if (failed) {
            this._logHotUpdateStats('failed', failed === true ? event.getMessage() : failed);
            this.clearEventCallback();
            this._updating = false;
            if (failed === true) this.CallOver();
            else this.CallError(failed);
        }

        if (needRestart) {
            this.clearEventCallback();
            this._updating = false;
            const newPaths = this._am.getLocalManifest().getSearchPaths();
            sys.localStorage.setItem('HotUpdateSearchPath', JSON.stringify(newPaths));
            sys.localStorage.setItem('HotUpdateVersion', this.rversion);
            native.fileUtils.addSearchPath(newPaths, true);
            AppMain.RestartApp();
        }
    }

    retry () {
        if (this._updating || !this._canRetry || !this._am) return;
        this._canRetry = false;
        this._updating = true;
        this._resetDownloadSpeedStats();
        this._resetHotUpdateStats();
        Logs.Log('Retry failed assets ...');
        this._am.downloadFailedAssets();
    }

    show () {
        if (this.updateUI) this.updateUI.active = true;
    }

    onLoad () {
        if (!AppKit.SdkManager.IsNative()) return;

        this._storagePath = `${native.fileUtils?.getWritablePath() || '/'}hot_res`;
        this._am = new native.AssetsManager(
            './project.manifest',
            this._storagePath,
            GameKit.StringUtil.VersionOver,
        );
        Logs.Log('Hot update is ready.');

        if (sys.os === sys.OS.ANDROID) {
            this._am.setMaxConcurrentTask(4);
            Logs.Log('Max concurrent tasks count has been limited to 4.');
        }
    }

    onDestroy () {
        this.clearEventCallback();
        this._updating = false;
    }

    private clearEventCallback () {
        if (this._am && (this._checkListener || this._updateListener)) {
            this._am.setEventCallback(null);
        }
        this._checkListener = null;
        this._updateListener = null;
    }
}
