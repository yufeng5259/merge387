// 音频管理

import { AudioClip, AudioSource, director, game, Game as CocosGame, instantiate, Node, Prefab, resources, sys } from 'cc';

type ManagedSound = AudioSource | any;

const soundRoot = new Node('SoundManager');
soundRoot.addComponent(AudioSource);

const SoundManager: any = {};

SoundManager.SoundNames = {
    BGM_Menu: "bgm1",
    BGM_Attack: "bgm_attack",
    BGM_Raid: "bgm_raid",
    BGM_VikingBonus: "bgm_vikingbonus",
};

SoundManager.SoundExts = {
    MP3: ".mp3",
    WAV: ".wav",
};

SoundManager.SoundPaths = {
    MergeLevelPrefix: "audio/hebing/SfxMergelv",
    GeneratorManualSpawn: "audio/dianji/SfxMergeSpawnManual",
    GeneratorExtraSpawn: "audio/dianji/sfxShoppingBreakShow",
    ItemLanding: "audio/dianji/sfxItemLanding",
    GeneratorBoardFull: "audio/youjian/SfxColdingClick",
    OrderNew: "audio/dingdan/sfxOrderCompleteNew",
    OrderComplete: "audio/dingdan/sfxOrderComplete",
    BpCoinFly: "audio/dingdan/SfxBpCoinFly",
    CollectCoins: "audio/dingdan/SfxMergeCollectCoins",
    CollectDiamond: "audio/dingdan/SfxMergeCollectDiamond",
    CollectExperience: "audio/dingdan/SfxMergeCollectExperience",
    CollectEnergy: "audio/dingdan/SfxMergeCollectEnergy",
    WarehousePut: "audio/caozuo/sfxMoveToTepository",
    WarehouseTakeOut: "audio/caozuo/SfxMergeSpawnManual2",
    CommonDelete: "audio/caozuo/sfxCommonDelete",
    WindowClose: "audio/caozuo/sfxStoryOut",
    WindowOpen: "audio/caozuo/sfxWindowPop",
    RestaurantLevelUp: "audio/caozuo/SfxLevelUp",
    NewAreaUnlock: "audio/xinzeng/SfxNewAreaUnlock",
    GhostReward: "audio/xinzeng/SfxGhostReward",
    BreakEggFin: "audio/xinzeng/sfxBreakEggFin",
    BuildHammer1: "audio/jianzhu/SfxBuildHammer1",
    BuildHammer2: "audio/jianzhu/SfxBuildHammer2",
    Renovate: "audio/jianzhu/sfxRenovate",
    DialoguePop: "audio/jianzhu/sfxDialoguePop",
    DailyFreeChestOpen: "audio/youjian/SfxOpenRandomBox",
    MailRewardCollect: "audio/youjian/sfxRewardCollect",
    ShopBuy: "audio/youjian/SfxShopBuy",
    PurchaseNotEnough: "audio/youjian/SfxColdingClick",
    SceneSwitch: "audio/ditu/SfxScenesSwitch",
    SceneSwitch2: "audio/ditu/SfxScenesSwitch2",
    SeaWave: "audio/ditu/sfxSeaWave",
    BubbleSpawn: "audio/paopao/SfxMergeBubbleSpawn",
    BubbleOpen: "audio/paopao/SfxMergeBubbleOpen",
    BubbleBreak: "audio/paopao/SfxMergeBubbleBreak",
};

SoundManager.SoundAliases = {
    se_open: { path: "WindowOpen", ext: SoundManager.SoundExts.WAV, minInterval: 350 },
    se_back: { path: "WindowClose", ext: SoundManager.SoundExts.WAV, minInterval: 350 },
    item_purchased: { path: "ShopBuy", ext: SoundManager.SoundExts.WAV },
    swipe_clouds: { path: "SceneSwitch", ext: SoundManager.SoundExts.WAV },
    swipe_clouds_open: { path: "SceneSwitch2", ext: SoundManager.SoundExts.WAV },
};

SoundManager.aVolume = 1;
SoundManager.soundVolume = 1;
SoundManager.volumeConfig = null;
SoundManager.VolumeConfigRes = "config/SoundVolumeConfig";
SoundManager._currentBgmConfigKey = "";
SoundManager._seaWaveLoopEnabled = false;
SoundManager._seaWaveLoopPlaying = false;

const usewx = false && wxTools.usewx;

function clampVolume(value: any, defaultValue = 1) {
    const num = Number(value);
    if (!isFinite(num)) return defaultValue;
    return Math.max(0, Math.min(1, num));
}

SoundManager.setVolumeConfig = function(config) {
    SoundManager.volumeConfig = config || null;
    if (SoundManager.volumeConfig && SoundManager.volumeConfig.rebuildCache) {
        SoundManager.volumeConfig.rebuildCache();
    }
    if (SoundManager.bgm != null && usewx) {
        SoundManager.bgm.volume = SoundManager.getBgmEngineVolume(SoundManager.getCurrentBgmConfigKey());
    } else if (SoundManager.bgmSource != null && !usewx) {
        SoundManager.bgmSource.volume = SoundManager.getBgmEngineVolume(SoundManager.getCurrentBgmConfigKey());
    }
};

SoundManager.getCurrentBgmConfigKey = function() {
    return SoundManager._currentBgmConfigKey || SoundManager.bgmName || "";
};

SoundManager.getBgmVolumeScale = function(bgmName) {
    if (SoundManager.volumeConfig && SoundManager.volumeConfig.getBgmVolume) {
        return clampVolume(SoundManager.volumeConfig.getBgmVolume(bgmName), 1);
    }
    return 1;
};

SoundManager.getSoundVolumeScale = function(soundKey) {
    if (SoundManager.volumeConfig && SoundManager.volumeConfig.getSoundVolume) {
        return clampVolume(SoundManager.volumeConfig.getSoundVolume(soundKey), 1);
    }
    return 1;
};

SoundManager.getBgmEngineVolume = function(bgmName, baseVolume = 0.3) {
    return clampVolume(baseVolume, 0.3) * SoundManager.aVolume * SoundManager.getBgmVolumeScale(bgmName);
};

SoundManager.getSoundEngineVolume = function(soundKey) {
    return SoundManager.soundVolume * SoundManager.getSoundVolumeScale(soundKey);
};

SoundManager.loadVolumeConfig = function() {
    if (SoundManager.volumeConfig) return;
    const typedResources = resources as any;
    if (!typedResources.getInfoWithPath) return;
    const configInfo = typedResources.getInfoWithPath(SoundManager.VolumeConfigRes, Prefab) || typedResources.getInfoWithPath(SoundManager.VolumeConfigRes);
    if (!configInfo) return;

    resources.load(SoundManager.VolumeConfigRes, Prefab, function(err, prefab) {
        if (err || !prefab || SoundManager.volumeConfig) return;
        const node = instantiate(prefab);
        node.name = "SoundVolumeConfig";
        if (typeof AppMain !== "undefined" && AppMain.instance && AppMain.instance.node) {
            node.parent = AppMain.instance.node;
        } else {
            const scene = director.getScene();
            if (scene) {
                scene.addChild(node);
                const persistDirector = director as any;
                if (persistDirector.addPersistRootNode) persistDirector.addPersistRootNode(node);
            }
        }
    });
};

function ensureSoundRoot() {
    if (!soundRoot.parent) {
        const scene = director.getScene();
        if (scene) {
            scene.addChild(soundRoot);
        }
    }
}

function createAudioSource(clip: AudioClip, loop: boolean, volume: number) {
    ensureSoundRoot();
    const source = soundRoot.addComponent(AudioSource);
    source.clip = clip;
    source.loop = loop;
    source.volume = volume;
    return source;
}

function destroyAudioSource(source: AudioSource) {
    source.stop();
    source.destroy();
}

function removeSound(soundKey: string, sound: ManagedSound) {
    const list = SoundManager.SEs[soundKey];
    if (!list) return;
    const index = list.indexOf(sound);
    if (index >= 0) list.splice(index, 1);
}

function ensureSoundList(soundKey: string) {
    if (!SoundManager.SEs.hasOwnProperty(soundKey)) SoundManager.SEs[soundKey] = [];
    return SoundManager.SEs[soundKey];
}

function onceAudioEnded(source: AudioSource, callback: () => void) {
    const eventType = (AudioSource as any).EventType?.ENDED;
    if (eventType && source.node && typeof source.node.once === "function") {
        source.node.once(eventType, callback);
    }
}

function loadAudioClip(path: string, callback: (err: Error | null, audio?: AudioClip) => void) {
    resources.load(path, AudioClip, (err, audio) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, audio);
    });
}

function forEachAudioSource(callback: (source: AudioSource) => void) {
    if (SoundManager.bgmSource) callback(SoundManager.bgmSource);
    Object.keys(SoundManager.SEs || {}).forEach(soundName => {
        SoundManager.SEs[soundName].forEach(source => {
            if (source instanceof AudioSource) callback(source);
        });
    });
}

SoundManager.init = function() {
    SoundManager.loadVolumeConfig();

    SoundManager.aVolume = parseFloat(sys.localStorage.getItem("BGMSwitch"));
    if (SoundManager.aVolume !== 0 && !SoundManager.aVolume) {
        SoundManager.aVolume = 1;
        sys.localStorage.setItem("BGMSwitch", SoundManager.aVolume);
    }

    SoundManager.soundVolume = parseFloat(sys.localStorage.getItem("SoundSwitch"));
    if (SoundManager.soundVolume !== 0 && !SoundManager.soundVolume) {
        SoundManager.soundVolume = 1;
        sys.localStorage.setItem("SoundSwitch", SoundManager.soundVolume);
    }

    game.on(CocosGame.EVENT_HIDE, function() {
        if (usewx) {
        } else {
            forEachAudioSource(source => source.pause());
        }
    });

    game.on(CocosGame.EVENT_SHOW, function() {
        if (usewx) {
            if (SoundManager.bgm != null) SoundManager.bgm.play();
        } else {
            forEachAudioSource(source => source.play());
            if (SoundManager.bgmSource != null && !SoundManager.bgmSource.playing) {
                SoundManager.playBgm();
            }
        }
    });

    this.soundMp3LoopIds = {};
};

// bgm
SoundManager.BgmNum = 1;
SoundManager.playBgm = function() {
    if (this.bgmName) {
        SoundManager.playBgmByName(this.bgmName);
        return;
    }
    if (SoundManager.aVolume <= 0) return;
    const bgmIndex = G.getRandomInt(1, SoundManager.BgmNum + 1);
    const bgmKey = 'bgm' + bgmIndex.toString();
    SoundManager._currentBgmConfigKey = bgmKey;
    if (usewx) {
        if (SoundManager.bgm != null) {
            SoundManager.bgm.stop();
            SoundManager.bgm.destroy();
        }
        SoundManager.bgm = wx.createInnerAudioContext();
        SoundManager.bgm.autoplay = true;
        SoundManager.bgm.loop = true;
        SoundManager.bgm.volume = SoundManager.getBgmEngineVolume(bgmKey, 0.7);
        SoundManager.bgm.src = AppKit.SdkManager.AssetsPathToRealPath('audio/bgm/' + bgmKey + ".mp3");
    } else {
        SoundManager.stopAllAudioSources();
        const resName = 'audio/bgm/' + bgmKey;
        loadAudioClip(resName, function(err, audio) {
            if (err || !audio) return;
            SoundManager.bgmSource = createAudioSource(audio, true, SoundManager.getBgmEngineVolume(bgmKey, 0.3));
            SoundManager.bgmSource.play();
        });
    }
};

SoundManager.playBgmByName = function(bgmName) {
    this.bgmName = bgmName;
    SoundManager._currentBgmConfigKey = bgmName || "";
    if (SoundManager.aVolume <= 0) return;
    if (usewx) {
        if (SoundManager.bgm != null) {
            SoundManager.bgm.stop();
            SoundManager.bgm.destroy();
        }
        SoundManager.bgm = wx.createInnerAudioContext();
        SoundManager.bgm.autoplay = true;
        SoundManager.bgm.loop = true;
        SoundManager.bgm.volume = SoundManager.getBgmEngineVolume(bgmName, 0.3);
        SoundManager.bgm.src = AppKit.SdkManager.AssetsPathToRealPath('audio/bgm/' + bgmName + ".mp3");
    } else {
        SoundManager.stopAllAudioSources();
        const resName = 'audio/bgm/' + bgmName;
        loadAudioClip(resName, function(err, audio) {
            if (err || !audio) return;
            SoundManager.bgmSource = createAudioSource(audio, true, SoundManager.getBgmEngineVolume(bgmName, 0.3));
            SoundManager.bgmSource.play();
        });
    }
};

SoundManager.SetBgmLoop = function(lo) {
    if (usewx) {
        if (SoundManager.bgm != null) {
            SoundManager.bgm.loop = lo;
        }
    } else {
        if (SoundManager.bgmSource) SoundManager.bgmSource.loop = lo;
    }
};

// 音效
SoundManager.SEs = {};
SoundManager.SECache = {};
SoundManager.soundMp3LoopIds = {};
SoundManager.LastPlayAt = {};
SoundManager.DebugPlayLogNames = {};
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.CommonDelete] = "sfxCommonDelete.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.RestaurantLevelUp] = "SfxLevelUp.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.NewAreaUnlock] = "SfxNewAreaUnlock.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.GhostReward] = "SfxGhostReward.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.BreakEggFin] = "sfxBreakEggFin.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.BuildHammer1] = "SfxBuildHammer1.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.BuildHammer2] = "SfxBuildHammer2.wav";
SoundManager.DebugPlayLogNames[SoundManager.SoundPaths.Renovate] = "sfxRenovate.wav";

SoundManager.logDebugSoundPlay = function(soundPath) {
    const soundName = SoundManager.DebugPlayLogNames[soundPath];
    if (soundName) console.log("play sound: " + soundName);
};

SoundManager.playSoundByPath = function(soundPath, loop = false, wxExt = SoundManager.SoundExts.MP3, minInterval = 0, canPlay?: () => boolean) {
    if (SoundManager.soundVolume <= 0 || !soundPath) return;
    if (canPlay && !canPlay()) return;
    if (!loop && minInterval > 0) {
        const now = Date.now();
        const lastPlayAt = SoundManager.LastPlayAt[soundPath] || 0;
        if (now - lastPlayAt < minInterval) return;
        SoundManager.LastPlayAt[soundPath] = now;
    }

    if (usewx) {
        const sound = wx.createInnerAudioContext();
        sound.loop = loop;
        sound.volume = SoundManager.getSoundEngineVolume(soundPath);
        sound.src = AppKit.SdkManager.AssetsPathToRealPath(soundPath + wxExt);
        sound.onStop(function() {
            sound.destroy();
            removeSound(soundPath, sound);
        });
        SoundManager.logDebugSoundPlay(soundPath);
        sound.play();
        ensureSoundList(soundPath).push(sound);
    } else {
        const playSound = function(audio: AudioClip) {
            if (canPlay && !canPlay()) return;
            const source = createAudioSource(audio, loop, SoundManager.getSoundEngineVolume(soundPath));
            SoundManager.logDebugSoundPlay(soundPath);
            source.play();
            ensureSoundList(soundPath).push(source);
            if (!loop) {
                onceAudioEnded(source, function() {
                    removeSound(soundPath, source);
                    destroyAudioSource(source);
                });
            }
        };
        if (SoundManager.SECache[soundPath] != null) {
            playSound(SoundManager.SECache[soundPath]);
        } else {
            loadAudioClip(soundPath, (err, audio) => {
                if (err || !audio) return;
                if (canPlay && !canPlay()) return;
                SoundManager.SECache[soundPath] = audio;
                playSound(audio);
            });
        }
    }
};

SoundManager.playMergeSoundByLevel = function(level) {
    let soundLevel = Math.floor(Number(level) || 0);
    if (soundLevel < 2) soundLevel = 2;
    if (soundLevel > 9) soundLevel = 9;
    SoundManager.playSoundByPath(SoundManager.SoundPaths.MergeLevelPrefix + soundLevel, false, SoundManager.SoundExts.WAV);
};

SoundManager.playGeneratorManualSpawnSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.GeneratorManualSpawn, false, SoundManager.SoundExts.WAV);
};

SoundManager.playGeneratorExtraSpawnSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.GeneratorExtraSpawn, false, SoundManager.SoundExts.WAV);
};

SoundManager.playBubbleSpawnSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BubbleSpawn, false, SoundManager.SoundExts.WAV, 120);
};

SoundManager.playBubbleOpenSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BubbleOpen, false, SoundManager.SoundExts.WAV, 120);
};

SoundManager.playBubbleBreakSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BubbleBreak, false, SoundManager.SoundExts.WAV, 120);
};

SoundManager.playItemLandingSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.ItemLanding, false, SoundManager.SoundExts.WAV);
};

SoundManager.playGeneratorBoardFullSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.GeneratorBoardFull, false, SoundManager.SoundExts.WAV);
};

SoundManager.playOrderNewSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.OrderNew, false, SoundManager.SoundExts.WAV);
};

SoundManager.playOrderCompleteSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.OrderComplete, false, SoundManager.SoundExts.WAV);
};

SoundManager.playBpCoinFlySound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BpCoinFly, false, SoundManager.SoundExts.WAV);
};

SoundManager.playRewardCollectSoundByContentType = function(contentType) {
    if (typeof Game === "undefined" || !Game.Content || !Game.Content.Types) return;
    if (contentType === Game.Content.Types.Coin || contentType === Game.Content.Types.ShopCoin) {
        SoundManager.playSoundByPath(SoundManager.SoundPaths.CollectCoins, false, SoundManager.SoundExts.WAV);
    } else if (contentType === Game.Content.Types.Cash) {
        SoundManager.playSoundByPath(SoundManager.SoundPaths.CollectDiamond, false, SoundManager.SoundExts.WAV);
    } else if (contentType === Game.Content.Types.Exp) {
        SoundManager.playSoundByPath(SoundManager.SoundPaths.CollectExperience, false, SoundManager.SoundExts.WAV);
    } else if (contentType === Game.Content.Types.Ap) {
        SoundManager.playSoundByPath(SoundManager.SoundPaths.CollectEnergy, false, SoundManager.SoundExts.WAV);
    }
};

SoundManager.playWarehousePutSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.WarehousePut, false, SoundManager.SoundExts.WAV);
};

SoundManager.playWarehouseTakeOutSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.WarehouseTakeOut, false, SoundManager.SoundExts.WAV);
};

SoundManager.playCommonDeleteSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.CommonDelete, false, SoundManager.SoundExts.WAV);
};

SoundManager.playWindowCloseSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.WindowClose, false, SoundManager.SoundExts.WAV, 350);
};

SoundManager.playWindowOpenSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.WindowOpen, false, SoundManager.SoundExts.WAV, 350);
};

SoundManager.playRestaurantLevelUpSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.RestaurantLevelUp, false, SoundManager.SoundExts.WAV);
};

SoundManager.playNewAreaUnlockSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.NewAreaUnlock, false, SoundManager.SoundExts.WAV);
};

SoundManager.playGhostRewardSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.GhostReward, false, SoundManager.SoundExts.WAV);
};

SoundManager.playBreakEggFinSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BreakEggFin, false, SoundManager.SoundExts.WAV);
};

SoundManager.playBuildLevelUpSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.RestaurantLevelUp, false, SoundManager.SoundExts.WAV);
};

SoundManager.playBuildHammer1Sound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BuildHammer1, false, SoundManager.SoundExts.WAV);
};

SoundManager.playBuildHammer2Sound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.BuildHammer2, false, SoundManager.SoundExts.WAV);
};

SoundManager.playRenovateSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.Renovate, false, SoundManager.SoundExts.WAV);
};

SoundManager.playDialoguePopSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.DialoguePop, false, SoundManager.SoundExts.WAV, 120);
};

SoundManager.playDailyFreeChestOpenSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.DailyFreeChestOpen, false, SoundManager.SoundExts.WAV);
};

SoundManager.playMailRewardCollectSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.MailRewardCollect, false, SoundManager.SoundExts.WAV);
};

SoundManager.playShopBuySuccessSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.ShopBuy, false, SoundManager.SoundExts.WAV);
};

SoundManager.playPurchaseNotEnoughSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.PurchaseNotEnough, false, SoundManager.SoundExts.WAV, 250);
};

SoundManager.playSceneSwitchSound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.SceneSwitch, false, SoundManager.SoundExts.WAV);
};

SoundManager.playSceneSwitch2Sound = function() {
    SoundManager.playSoundByPath(SoundManager.SoundPaths.SceneSwitch2, false, SoundManager.SoundExts.WAV);
};

SoundManager.setSeaWaveLoopEnabled = function(enabled) {
    SoundManager._seaWaveLoopEnabled = !!enabled;
    if (SoundManager._seaWaveLoopEnabled) {
        SoundManager.playSeaWaveLoopSound();
    } else {
        SoundManager.stopSeaWaveLoopSound();
    }
};

SoundManager.playSeaWaveLoopSound = function() {
    if (SoundManager._seaWaveLoopPlaying || SoundManager.soundVolume <= 0) return;
    SoundManager._seaWaveLoopPlaying = true;
    SoundManager.playSoundByPath(SoundManager.SoundPaths.SeaWave, true, SoundManager.SoundExts.WAV, 0, function() {
        return SoundManager._seaWaveLoopEnabled && SoundManager._seaWaveLoopPlaying;
    });
};

SoundManager.stopSeaWaveLoopSound = function() {
    SoundManager._seaWaveLoopPlaying = false;
    SoundManager.stopSound(SoundManager.SoundPaths.SeaWave);
};

SoundManager.playSound = function(soundName, loop = false) {
    if (SoundManager.soundVolume <= 0) return;
    const alias = SoundManager.SoundAliases[soundName];
    if (alias) {
        const soundPath = SoundManager.SoundPaths[alias.path] || alias.path;
        SoundManager.playSoundByPath(soundPath, loop, alias.ext || SoundManager.SoundExts.WAV, alias.minInterval || 0);
        return;
    }

    if (usewx) {
        const sound = wx.createInnerAudioContext();
        sound.loop = loop;
        sound.volume = SoundManager.getSoundEngineVolume(soundName);
        sound.src = AppKit.SdkManager.AssetsPathToRealPath('audio/fx/' + soundName + ".mp3");
        sound.onStop(function() {
            sound.destroy();
            removeSound(soundName, sound);
        });
        sound.play();
        ensureSoundList(soundName).push(sound);
    } else {
        const playSound = function(audio: AudioClip) {
            const source = createAudioSource(audio, loop, SoundManager.getSoundEngineVolume(soundName));
            source.play();
            ensureSoundList(soundName).push(source);
            if (!loop) {
                onceAudioEnded(source, function() {
                    removeSound(soundName, source);
                    destroyAudioSource(source);
                });
            }
        };
        if (SoundManager.SECache[soundName] != null) {
            playSound(SoundManager.SECache[soundName]);
        } else {
            const resName = 'audio/fx/' + soundName;
            loadAudioClip(resName, (err, audio) => {
                if (err || !audio) return;
                SoundManager.SECache[soundName] = audio;
                playSound(audio);
            });
        }
    }
};

SoundManager.stopSound = function(soundName) {
    if (!SoundManager.SEs.hasOwnProperty(soundName)) SoundManager.SEs[soundName] = [];

    for (let i = 0; i < SoundManager.SEs[soundName].length; i++) {
        if (usewx) {
            const sound = SoundManager.SEs[soundName][i];
            if (sound != null) {
                sound.stop();
                sound.destroy();
            }
        } else {
            const source = SoundManager.SEs[soundName][i];
            if (source != null) {
                destroyAudioSource(source);
            }
        }
    }

    SoundManager.SEs[soundName] = [];
};

SoundManager.stopSoundOne = function(soundName) {
    if (!SoundManager.SEs.hasOwnProperty(soundName)) SoundManager.SEs[soundName] = [];

    const i = 0;
    if (SoundManager.SEs[soundName].length <= 0) return;

    if (usewx) {
        const sound = SoundManager.SEs[soundName][i];
        if (sound != null) {
            sound.stop();
            sound.destroy();
        }
        removeSound(soundName, sound);
    } else {
        const source = SoundManager.SEs[soundName][i];
        if (source != null) {
            destroyAudioSource(source);
        }
        removeSound(soundName, source);
    }
};

// 设置 mp3 格式音效循环。3.x AudioSource 原生 loop 已处理循环。
SoundManager.SetSoundLoop = function(soundName) {
    if (!SoundManager.SEs.hasOwnProperty(soundName)) SoundManager.SEs[soundName] = [];

    for (let i = 0; i < SoundManager.SEs[soundName].length; i++) {
        const source = SoundManager.SEs[soundName][i];
        if (source != null && !usewx) {
            source.loop = true;
        }
    }
};

SoundManager.loadSound = function(soundName) {
    if (usewx) {
    } else if (SoundManager.SECache[soundName] == null) {
        const resName = 'audio/fx/' + soundName;
        loadAudioClip(resName, (err, audio) => {
            if (err || !audio) return;
            SoundManager.SECache[soundName] = audio;
        });
    }
};

SoundManager.loadSoundByPath = function(soundPath) {
    if (usewx || !soundPath) return;
    if (SoundManager.SECache[soundPath] != null) return;
    loadAudioClip(soundPath, (err, audio) => {
        if (err || !audio) return;
        SoundManager.SECache[soundPath] = audio;
    });
};

SoundManager.preloadSound = function() {
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.BpCoinFly);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.RestaurantLevelUp);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.NewAreaUnlock);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.GhostReward);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.BreakEggFin);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.BuildHammer1);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.BuildHammer2);
    SoundManager.loadSoundByPath(SoundManager.SoundPaths.Renovate);

    if (AppKit.SdkManager.IsNative()) return;
    if (usewx) {
    } else {
        resources.loadDir('audio/fx', AudioClip, (err, audios) => {
            if (err) return;
            audios.forEach(audio => {
                SoundManager.SECache[audio.name] = audio;
            });
        });

        resources.load('audio/bgm/' + SoundManager.SoundNames.BGM_Attack, AudioClip, function() {
        });

        resources.load('audio/bgm/' + SoundManager.SoundNames.BGM_Raid, AudioClip, function() {
        });
    }
};

SoundManager.stopAllAudioSources = function() {
    if (SoundManager.bgmSource) {
        destroyAudioSource(SoundManager.bgmSource);
        SoundManager.bgmSource = null;
    }
    Object.keys(SoundManager.SEs || {}).forEach(soundName => {
        SoundManager.stopSound(soundName);
    });
};

// 开关
SoundManager.changeBGMSwitch = function() {
    SoundManager.aVolume = 1 - SoundManager.aVolume;
    sys.localStorage.setItem("BGMSwitch", SoundManager.aVolume);

    if (usewx) {
        if (SoundManager.bgm != null) {
            SoundManager.bgm.volume = SoundManager.getBgmEngineVolume(SoundManager.getCurrentBgmConfigKey(), 0.25);
        } else {
            SoundManager.playBgm();
        }
    } else if (SoundManager.aVolume <= 0) {
        SoundManager.stopAllAudioSources();
    } else {
        SoundManager.playBgm();
    }
};

SoundManager.changeSoundSwitch = function() {
    SoundManager.soundVolume = 1 - SoundManager.soundVolume;
    sys.localStorage.setItem("SoundSwitch", SoundManager.soundVolume);
    if (SoundManager.soundVolume <= 0) {
        SoundManager.stopSeaWaveLoopSound();
    } else if (SoundManager._seaWaveLoopEnabled) {
        SoundManager.playSeaWaveLoopSound();
    }
};

SoundManager.getBGMSwitch = function() {
    return SoundManager.aVolume > 0;
};

SoundManager.getSoundSwitch = function() {
    return SoundManager.soundVolume > 0;
};

export default SoundManager;
