/*let version = AppKit.NativeWrap.getVersion()
let lastVersion = GameKit.PlayerPrefs.GetString("LAST_APP_VERSION", version)
if (GameKit.StringUtil.VersionOver(version, lastVersion) > 0) {
jsb.fileUtils.removeDirectory(this._storagePath)
}
GameKit.PlayerPrefs.SetString("LAST_APP_VERSION", version)*/
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('HotUpdate')
export class HotUpdate extends Component {
    private _updating = false;
    private _canRetry = false;
    private _storagePath = '';

    SetCallBack (func: any) {
        // this.overCallback = func 
    }

    SetUpdatingCallBack (func: any) {
        // this.updatingCallback = func 
    }

    SetErrorCallBack (func: any) {
        // this.errorCallback = func 
    }

    CallOver () {
        // if (this.overCallback) this.overCallback() 
    }

    CallUpdating (n: any) {
        // if (this.updatingCallback) this.updatingCallback(n) 
    }

    CallError (e: any) {
        // if (this.errorCallback) this.errorCallback(e) 
    }

    checkUpdate (rversion: any, func: any, ndunc: any, errfunc: any) {
        // this.rversion = rversion 
        // if (!AppKit.SdkManager.IsNative()) { 
            // return; 
        // } 
        // this.SetCallBack(func) 
        // this.SetUpdatingCallBack(ndunc) 
        // this.SetErrorCallBack(errfunc) 
        // if (!this._am) { 
            // this.hotUpdate() 
            // return 
        // } 
        // if (this._updating) { 
            // Logs.Log('Checking or uping ...'); 
            // return; 
        // } 
        // if (this._am.getState() === jsb.AssetsManager.State.UNINITED) { 
            // this._am.loadLocalManifest("./project.manifest"); 
        // } 
        // if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) { 
            // Logs.Log('Failed to load local manifest ...'); 
            // this.CallOver() 
            // return; 
        // } 
        // let localVersion = this._am.getLocalManifest().getVersion(); 
        // if (GameKit.StringUtil.VersionOver(rversion, localVersion) <= 0) { 
            // Logs.Log("Already latest by rversion."); 
            // this.CallOver() 
            // return 
        // } 
        // this._am.setEventCallback(this.checkCb.bind(this)); 
        // this._am.checkUpdate(); 
        // this._updating = true; 
    }

    checkCb (event: any) {
        // switch (event.getEventCode()) 
        // { 
            // case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: 
                // Logs.Log("No local manifest file found, up skipped."); 
                // this.CallOver() 
                // break; 
            // case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: 
            // case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST: 
                // Logs.Log("Fail to download manifest file, up skipped."); 
                // this.CallError("Fail to download manifest file, up skipped.") 
                // break; 
            // case jsb.EventAssetsManager.ALREADY_UP_TO_DATE: 
                // Logs.Log("Already latest."); 
                // this.CallOver() 
                // break; 
            // case jsb.EventAssetsManager.NEW_VERSION_FOUND: 
                // Logs.Log('New up found, please try.'); 
                // this._am.setEventCallback(null); 
                // this._checkListener = null; 
                // this._updating = false; 
                // this.hotUpdate() 
                // this.CallUpdating(-1) 
                // return; 
            // default: 
                // return; 
        // } 
        // this._am.setEventCallback(null); 
        // this._checkListener = null; 
        // this._updating = false; 
    }

    hotUpdate () {
        // if (!this._am) { 
            // this.CallOver() 
            // return 
        // } 
        // if (!this._updating) { 
            // this._am.setEventCallback(this.updateCb.bind(this)); 
            // if (this._am.getState() === jsb.AssetsManager.State.UNINITED) { 
                // this._am.loadLocalManifest("./project.manifest"); 
            // } 
            // this._failCount = 0; 
            // this._am.update(); 
            // this._updating = true; 
        // } 
    }

    updateCb (event: any) {
        // var needRestart = false; 
        // var failed = false; 
        // switch (event.getEventCode()) 
        // { 
            // case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: 
                // Logs.Log('No local manifest file found, up skipped.'); 
                // failed = 'No local manifest file found, up skipped.'; 
                // break; 
            // case jsb.EventAssetsManager.UPDATE_PROGRESSION: 
                // this.CallUpdating(event.getDownloadedBytes() / event.getTotalBytes()) 
                // var msg = event.getMessage(); 
                // if (msg) { 
                // } 
                // break; 
            // case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: 
            // case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST: 
                // Logs.Log('Fail to download manifest file, skipped.'); 
                // failed = 'Fail to download manifest file, skipped.'; 
                // break; 
            // case jsb.EventAssetsManager.ALREADY_UP_TO_DATE: 
                // Logs.Log('Already latest.'); 
                // failed = true; 
                // break; 
            // case jsb.EventAssetsManager.UPDATE_FINISHED: 
                // Logs.Log('up finished. ' + event.getMessage()); 
                // needRestart = true; 
                // break; 
            // case jsb.EventAssetsManager.UPDATE_FAILED: 
                // Logs.Log('up failed. ' + event.getMessage()); 
                // this._updating = false; 
                // this._canRetry = true; 
                // DialogWindow.Show(GameKit.i18n.t("AppHotUpdateFail"), () => {this.retry()}, () => {AppMain.RestartApp()}) 
                // break; 
            // case jsb.EventAssetsManager.ERROR_UPDATING: 
                // Logs.Log('Asset u error: ' + event.getAssetId() + ', ' + event.getMessage()); 
                // break; 
            // case jsb.EventAssetsManager.ERROR_DECOMPRESS: 
                // Logs.Log(event.getMessage()); 
                // break; 
            // default: 
                // break; 
        // } 
        // if (failed) { 
            // this._am.setEventCallback(null); 
            // this._updateListener = null; 
            // this._updating = false; 
            // if (failed === true) { 
                // this.CallOver() 
            // } else { 
                // this.CallError(failed) 
            // } 
        // } 
        // if (needRestart) { 
            // this._am.setEventCallback(null); 
            // this._updateListener = null; 
            // var newPaths = this._am.getLocalManifest().getSearchPaths(); 
            // jsb.fileUtils.addSearchPath(newPaths, true); 
            // AppMain.RestartApp(); 
        // } 
    }

    retry () {
        // if (!this._updating && this._canRetry) { 
            // this._canRetry = false; 
            // Logs.Log('Retry failed Assets...'); 
            // this._am.downloadFailedAssets(); 
        // } 
    }

    show () {
        // if (this.updateUI.active === false) { 
            // this.updateUI.active = true; 
        // } 
    }

    onLoad () {
        // if (!AppKit.SdkManager.IsNative()) { 
            // return; 
        // } 
        // this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'hot_res'); 
        // this._am = new jsb.AssetsManager('./project.manifest', this._storagePath, GameKit.StringUtil.VersionOver); 
        // this._am.setVerifyCallback(function (path, asset) { 
            // return true; 
        // }); 
        // Logs.Log('up is ready, please check or directly u.'); 
        // this._am.setMaxConcurrentTask(2); 
        // Logs.Log("Max concurrent tasks count have been limited to 2"); 
    }

    onDestroy () {
        // if (this._updateListener) { 
            // this._am.setEventCallback(null); 
            // this._updateListener = null; 
        // } 
    }

}

