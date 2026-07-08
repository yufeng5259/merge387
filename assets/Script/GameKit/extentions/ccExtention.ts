import { Asset, assetManager, ImageAsset, native, resources, SpriteFrame } from 'cc';
import type { Constructor } from 'cc';
import { DEV, JSB } from 'cc/env';
import { cce } from '../../LegacyGlobals';

type AssetType<T extends Asset = Asset> = Constructor<T> | null;
type LoadCallback<T extends Asset = Asset> = (err: Error | null, asset: T | null) => void;
type ProgressCallback = (finished: number, total: number, item: unknown) => void;
type Bundle = typeof resources;
type PointLike = { x?: number; y?: number };
type LegacyWindowConfig = Record<string, unknown>;

type TrackedAsset = Asset & {
    _resName?: string;
    _loadResName?: string;
    _bundleName?: string;
    _rawUrl?: string;
};

type SpriteLike = {
    spriteFrame: (SpriteFrame & Partial<TrackedAsset>) | null;
};

type RemoteRequest = {
    url?: string;
    type?: string;
    [key: string]: unknown;
};

type LoadAnyRequest = Parameters<typeof assetManager.loadAny>[0];
type RemoteCallback = (err: unknown, asset?: unknown) => void;

type CceRuntime = {
    DepList: Record<string, number>;
    loading: number;
    pDistance: (p1: PointLike | null | undefined, p2: PointLike | null | undefined) => number;
    Window: <T extends LegacyWindowConfig>(config?: T) => T;
    loadRes: <T extends Asset>(
        resName: string,
        type: AssetType<T> | undefined,
        cb?: LoadCallback<T>,
        onProgress?: ProgressCallback | null,
    ) => void;
    releaseRes: <T extends Asset>(resName: string, type?: AssetType<T>) => void;
    releaseSpriteFrame: (sprite: SpriteLike | null | undefined, res?: Partial<TrackedAsset> | null) => void;
    loaderLoad: (res: RemoteRequest | LoadAnyRequest, cb?: RemoteCallback, nologerror?: boolean) => void;
};

type CardContentInfo = {
    bundlePath: string;
    defaultResourcesPath: string | null;
};

const cceRuntime = cce as CceRuntime;

const CARD_ROOT = 'Card/';
const DEFAULT_CARD_RES = 'Playing cards';
const SPRITE_FRAME_SUFFIX = '/spriteFrame';
const CARD_UI_DIRS: Record<string, true> = {
    atlas: true,
    Change: true,
    chest: true,
    chestOpen: true,
    common: true,
    raw: true,
    subject: true,
};

function getCoordinate(point: PointLike | null | undefined, key: 'x' | 'y'): number {
    const value = point ? point[key] : 0;
    return typeof value === 'number' ? value : 0;
}

function isSpriteFrameType(type: AssetType | undefined): boolean {
    return type === SpriteFrame as unknown as AssetType;
}

function normalizeSpriteFrameResName<T extends Asset>(resName: string, type: AssetType<T> | undefined): string {
    if (!isSpriteFrameType(type)) {
        return resName;
    }

    let loadResName = resName.replace(/\.(png|jpg|jpeg)(?=\/spriteFrame$)/i, '');
    if (loadResName.endsWith(SPRITE_FRAME_SUFFIX)) {
        return loadResName;
    }

    loadResName = loadResName.replace(/\.(png|jpg|jpeg)$/i, '');
    return `${loadResName}${SPRITE_FRAME_SUFFIX}`;
}

function getCardContentInfo(resName: string): CardContentInfo | null {
    if (!resName || resName.indexOf(CARD_ROOT) !== 0) {
        return null;
    }

    const cardPath = resName.substring(CARD_ROOT.length);
    const slashIndex = cardPath.indexOf('/');
    if (slashIndex < 0) {
        return null;
    }

    const firstDir = cardPath.substring(0, slashIndex);
    if (CARD_UI_DIRS[firstDir]) {
        return null;
    }

    return {
        bundlePath: cardPath,
        defaultResourcesPath: firstDir === DEFAULT_CARD_RES ? `res/${resName}` : null,
    };
}

function normalizeError(err: unknown, fallback: string): Error {
    if (err instanceof Error) {
        return err;
    }
    if (typeof err === 'string' && err.length > 0) {
        return new Error(err);
    }
    return new Error(fallback);
}

function getErrorCode(err: Error | null): string | number {
    return err ? err.name : '0';
}

function getErrorMessage(err: Error | null, fallback: string): string {
    return err && err.message ? err.message : fallback;
}

function logLoadFailure(resName: string, err: Error | null): void {
    if (typeof AppKit !== 'undefined' && AppKit.LogEventWrap && AppKit.LogEventWrap.logEvent) {
        AppKit.LogEventWrap.logEvent('http_res_fail', {
            res: resName,
            code: getErrorCode(err),
            msg: getErrorMessage(err, 'load failed'),
        });
    }
}

function logRemoteFailure(res: RemoteRequest | LoadAnyRequest, err: unknown, nologerror?: boolean): void {
    if (nologerror || typeof AppKit === 'undefined' || !AppKit.LogEventWrap || !AppKit.LogEventWrap.logEvent) {
        return;
    }

    const error = normalizeError(err, 'remote load failed');
    AppKit.LogEventWrap.logEvent('http_res_fail', {
        res: JSON.stringify(res),
        code: error.name || '-1',
        msg: error.message || String(err),
    });
}

function getBundleName(bundle: Bundle): string {
    return bundle.name || 'resources';
}

function getTypeName(type: AssetType | undefined): string {
    return type ? type.name : '';
}

function getDepKey(bundle: Bundle, path: string, type: AssetType | undefined): string {
    return `${getBundleName(bundle)}:${path}:${getTypeName(type)}`;
}

function addDep(bundle: Bundle, path: string, type: AssetType | undefined): void {
    const key = getDepKey(bundle, path, type);
    cceRuntime.DepList[key] = (cceRuntime.DepList[key] || 0) + 1;
}

function keepExistingDep(bundle: Bundle, path: string, type: AssetType | undefined): boolean {
    const key = getDepKey(bundle, path, type);
    const count = cceRuntime.DepList[key] || 0;
    if (count > 1) {
        cceRuntime.DepList[key] = count - 1;
        return true;
    }
    if (count === 1) {
        delete cceRuntime.DepList[key];
    }
    return false;
}

function trackLoadedAsset<T extends Asset>(asset: T, resName: string, loadResName: string, bundle: Bundle, type: AssetType<T>): void {
    const tracked = asset as TrackedAsset;
    tracked._resName = resName;
    tracked._loadResName = loadResName;
    tracked._bundleName = getBundleName(bundle);
    addDep(bundle, loadResName, type);
}

function finishLoadError<T extends Asset>(resName: string, cb: LoadCallback<T> | undefined, err: unknown, message: string): void {
    cceRuntime.loading--;
    const error = normalizeError(err, message);
    cb?.(error, null);
}

function loadFromBundle<T extends Asset>(
    bundleName: string,
    loadResName: string,
    type: AssetType<T>,
    onProgress: ProgressCallback | null | undefined,
    onMiss: ((err: Error | null) => void) | null,
    cb: LoadCallback<T> | undefined,
    originalResName: string,
): void {
    const runLoad = (bundle: Bundle): void => {
        const onComplete = (err: Error | null, asset: T | null): void => {
            if (!err && asset) {
                handleResourceLoaded(err, asset, bundle, loadResName, type, cb, originalResName);
                return;
            }

            if (onMiss) {
                onMiss(err);
            } else {
                finishLoadError(originalResName, cb, err, `resource not found in ${bundleName} bundle`);
            }
        };

        try {
            if (onProgress) {
                bundle.load<T>(loadResName, type, onProgress, onComplete);
            } else {
                bundle.load<T>(loadResName, type, onComplete);
            }
        } catch (error) {
            if (onMiss) {
                onMiss(normalizeError(error, `${bundleName} bundle load failed`));
            } else {
                finishLoadError(originalResName, cb, error, `${bundleName} bundle load failed`);
            }
        }
    };

    const bundle = assetManager.getBundle(bundleName);
    if (bundle) {
        runLoad(bundle);
        return;
    }

    assetManager.loadBundle(bundleName, (err, loadedBundle) => {
        if (err || !loadedBundle) {
            if (onMiss) {
                onMiss(err);
            } else {
                finishLoadError(originalResName, cb, err, `${bundleName} bundle load failed`);
            }
            return;
        }

        runLoad(loadedBundle);
    });
}

function loadFromResources<T extends Asset>(
    loadResName: string,
    type: AssetType<T>,
    onProgress: ProgressCallback | null | undefined,
    onMiss: ((err: Error | null) => void) | null,
    cb: LoadCallback<T> | undefined,
    originalResName: string,
): void {
    const onComplete = (err: Error | null, asset: T | null): void => {
        if (!err && asset) {
            handleResourceLoaded(err, asset, resources, loadResName, type, cb, originalResName);
            return;
        }

        if (onMiss) {
            onMiss(err);
        } else {
            finishLoadError(originalResName, cb, err, 'resource not found in resources');
        }
    };

    try {
        if (onProgress) {
            resources.load<T>(loadResName, type, onProgress, onComplete);
        } else {
            resources.load<T>(loadResName, type, onComplete);
        }
    } catch (error) {
        if (onMiss) {
            onMiss(normalizeError(error, 'resources load failed'));
        } else {
            finishLoadError(originalResName, cb, error, 'resources load failed');
        }
    }
}

function handleResourceLoaded<T extends Asset>(
    err: Error | null,
    asset: T | null,
    bundle: Bundle,
    loadResName: string,
    type: AssetType<T>,
    cb: LoadCallback<T> | undefined,
    originalResName: string,
): void {
    if (err) {
        logLoadFailure(originalResName, err);
    }

    if ((err || !asset) && !DEV) {
        cceRuntime.loading--;
        console.log('cce.loadRes-Error:', originalResName);
        cb?.(err, asset);
        return;
    }

    if (asset) {
        trackLoadedAsset(asset, originalResName, loadResName || originalResName, bundle, type);
    }

    cceRuntime.loading--;
    cb?.(err, asset);
}

function getReleaseCandidates(resName: string): Array<{ bundle: Bundle; path: string }> {
    const candidates: Array<{ bundle: Bundle; path: string }> = [{ bundle: resources, path: resName }];
    const cardContentInfo = getCardContentInfo(resName);

    if (cardContentInfo && cardContentInfo.defaultResourcesPath) {
        candidates.push({ bundle: resources, path: cardContentInfo.defaultResourcesPath });
    }

    const textureBundle = assetManager.getBundle('Texture');
    if (textureBundle) {
        candidates.push({ bundle: textureBundle, path: resName });
    }

    const cardBundle = assetManager.getBundle('Card');
    if (cardBundle && cardContentInfo) {
        candidates.push({ bundle: cardBundle, path: cardContentInfo.bundlePath });
    }

    return candidates;
}

function releaseFromBundle<T extends Asset>(bundle: Bundle, path: string, type: AssetType<T> | undefined): boolean {
    const asset = bundle.get(path, type || null);
    if (keepExistingDep(bundle, path, type)) {
        return true;
    }

    if (!asset) {
        return false;
    }

    bundle.release(path, type || null);
    return true;
}

function performRelease<T extends Asset>(resName: string, type?: AssetType<T>): void {
    let released = false;
    const candidates = getReleaseCandidates(resName);

    candidates.forEach((candidate) => {
        if (releaseFromBundle(candidate.bundle, candidate.path, type)) {
            released = true;
        }
    });

    if (!released) {
        resources.release(resName, type || null);
    }
}

function normalizeRemoteExt(type: unknown, url: string): string {
    if (typeof type === 'string' && type.length > 0) {
        return type.startsWith('.') ? type : `.${type}`;
    }

    const cleanUrl = url.split('?')[0].split('#')[0];
    const dotIndex = cleanUrl.lastIndexOf('.');
    if (dotIndex >= 0 && dotIndex < cleanUrl.length - 1) {
        return cleanUrl.substring(dotIndex);
    }

    return '.png';
}

function hashString(value: string): string {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function getCachePath(url: string, type: unknown): string {
    const ext = normalizeRemoteExt(type, url);
    return `${native.fileUtils.getWritablePath()}temp_res/${hashString(url)}${ext}`;
}

function ensureCacheDirectory(): void {
    const cacheDir = `${native.fileUtils.getWritablePath()}temp_res`;
    if (!native.fileUtils.isDirectoryExist(cacheDir)) {
        native.fileUtils.createDirectory(cacheDir);
    }
}

function markRawUrl(asset: unknown, url: string): void {
    if (asset && typeof asset === 'object') {
        (asset as Partial<TrackedAsset>)._rawUrl = url;
    }
}

function loadRemoteImage(url: string, type: unknown, rawUrl: string, cb?: RemoteCallback): void {
    assetManager.loadRemote<ImageAsset>(url, { ext: normalizeRemoteExt(type, url) }, (err, imageAsset) => {
        if (!err && imageAsset) {
            markRawUrl(imageAsset, rawUrl);
        }
        cb?.(err, imageAsset);
    });
}

function isNativeLoaderEnabled(): boolean {
    return JSB
        && typeof AppKit !== 'undefined'
        && AppKit.SdkManager
        && AppKit.SdkManager.IsNative
        && AppKit.SdkManager.IsNative();
}

function loadNativeCachedRemote(res: RemoteRequest, url: string, cb?: RemoteCallback, nologerror?: boolean): void {
    const localUrl = getCachePath(url, res.type);

    const loadCached = (): void => {
        loadRemoteImage(localUrl, res.type, url, cb);
    };

    if (native.fileUtils.isFileExist(localUrl)) {
        loadCached();
        return;
    }

    ensureCacheDirectory();

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = (event) => {
        if (req.readyState === 4 && req.status >= 200 && req.status < 400 && req.response) {
            const buffer = req.response as ArrayBuffer;
            if (!native.fileUtils.writeDataToFile(buffer, localUrl)) {
                const error = new Error(`write cache failed: ${localUrl}`);
                logRemoteFailure(res, error, nologerror);
                cb?.(error);
                return;
            }
            loadCached();
            return;
        }

        const error = normalizeError(event, `http status ${req.status}`);
        logRemoteFailure(res, error, nologerror);
        cb?.(error);
    };
    req.ontimeout = (event) => {
        const error = normalizeError(event, 'remote image request timeout');
        logRemoteFailure(res, error, nologerror);
        cb?.(error);
    };
    req.onerror = (event) => {
        const error = normalizeError(event, 'remote image request error');
        logRemoteFailure(res, error, nologerror);
        cb?.(error);
    };
    req.send();
}

cceRuntime.pDistance = function (p1: PointLike | null | undefined, p2: PointLike | null | undefined): number {
    const dx = getCoordinate(p1, 'x') - getCoordinate(p2, 'x');
    const dy = getCoordinate(p1, 'y') - getCoordinate(p2, 'y');
    return Math.sqrt(dx * dx + dy * dy);
};

cceRuntime.Window = function <T extends LegacyWindowConfig>(config?: T): T {
    return config || ({} as T);
};

cceRuntime.DepList = cceRuntime.DepList || {};
cceRuntime.loading = cceRuntime.loading || 0;

cceRuntime.loadRes = function <T extends Asset>(
    resName: string,
    type: AssetType<T> | undefined,
    cb?: LoadCallback<T>,
    onProgress?: ProgressCallback | null,
): void {
    if (!resName) {
        cb?.(new Error('empty resource name'), null);
        return;
    }

    const assetType = type || null;
    const normalizedResName = normalizeSpriteFrameResName(resName, assetType);
    cceRuntime.loading++;

    const loadResourceChain = (loadResName: string, allowOriginalFallback: boolean): void => {
        const cardContentInfo = getCardContentInfo(loadResName);
        const loadOriginalIfNeeded = allowOriginalFallback && loadResName !== resName
            ? (): void => loadResourceChain(resName, false)
            : null;

        const loadFromTextureBundle = (): void => {
            loadFromBundle('Texture', loadResName, assetType, onProgress, loadOriginalIfNeeded, cb, resName);
        };

        const loadFromFallbacks = (): void => {
            if (cardContentInfo && cardContentInfo.defaultResourcesPath) {
                loadFromResources(cardContentInfo.defaultResourcesPath, assetType, onProgress, loadFromTextureBundle, cb, resName);
                return;
            }

            if (cardContentInfo) {
                loadFromBundle('Card', cardContentInfo.bundlePath, assetType, onProgress, loadFromTextureBundle, cb, resName);
                return;
            }

            loadFromTextureBundle();
        };

        loadFromResources(loadResName, assetType, onProgress, loadFromFallbacks, cb, resName);
    };

    loadResourceChain(normalizedResName, normalizedResName !== resName);
};

cceRuntime.releaseRes = function <T extends Asset>(resName: string, type?: AssetType<T>): void {
    if (!resName) {
        return;
    }

    const assetType = type || null;
    const loadResName = normalizeSpriteFrameResName(resName, assetType);

    const releaseWhenIdle = (): void => {
        setTimeout(() => {
            if (cceRuntime.loading) {
                releaseWhenIdle();
                return;
            }

            performRelease(loadResName, assetType);
            if (loadResName !== resName) {
                performRelease(resName, assetType);
            }
        }, 100);
    };

    releaseWhenIdle();
};

cceRuntime.releaseSpriteFrame = function (sprite: SpriteLike | null | undefined, res?: Partial<TrackedAsset> | null): void {
    if (!sprite || !sprite.spriteFrame) {
        return;
    }

    const spriteFrame = sprite.spriteFrame as SpriteFrame & Partial<TrackedAsset>;
    if (res && spriteFrame._resName === res._resName) {
        return;
    }

    const loadResName = spriteFrame._loadResName || spriteFrame._resName;
    if (!loadResName) {
        return;
    }

    sprite.spriteFrame = null;
    cceRuntime.releaseRes(loadResName, SpriteFrame);
};

cceRuntime.loaderLoad = function (res: RemoteRequest | LoadAnyRequest, cb?: RemoteCallback, nologerror?: boolean): void {
    const request = res as RemoteRequest;
    const url = request && typeof request.url === 'string' ? request.url : '';

    if (url && url.startsWith('http')) {
        if (isNativeLoaderEnabled()) {
            loadNativeCachedRemote(request, url, cb, nologerror);
            return;
        }

        loadRemoteImage(url, request.type, url, cb);
        return;
    }

    assetManager.loadAny(res as LoadAnyRequest, (err, asset) => {
        if (!err && asset) {
            markRawUrl(asset, url);
        }
        console.log(res, 'cce.loaderLoad-callback:', asset);
        if (err) {
            logRemoteFailure(res, err, nologerror);
        }
        cb?.(err, asset);
    });
};
