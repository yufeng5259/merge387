// 音频管理

import { AudioClip, AudioSource, director, game, Game, Node, resources, sys } from 'cc';

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

SoundManager.aVolume = 1;
SoundManager.soundVolume = 1;

const usewx = false && wxTools.usewx;

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

function removeSound(soundName: string, sound: ManagedSound) {
    const list = SoundManager.SEs[soundName];
    if (!list) return;
    const index = list.indexOf(sound);
    if (index >= 0) list.splice(index, 1);
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

    game.on(Game.EVENT_HIDE, function() {
        if (usewx) {
        } else {
            forEachAudioSource(source => source.pause());
        }
    });

    game.on(Game.EVENT_SHOW, function() {
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
    if (usewx) {
        if (SoundManager.bgm != null) {
            SoundManager.bgm.stop();
            SoundManager.bgm.destroy();
        }
        SoundManager.bgm = wx.createInnerAudioContext();
        SoundManager.bgm.autoplay = true;
        SoundManager.bgm.loop = true;
        SoundManager.bgm.volume = 0.7 * SoundManager.aVolume;
        SoundManager.bgm.src = AppKit.SdkManager.AssetsPathToRealPath('audio/bgm/bgm' + bgmIndex.toString() + ".mp3");
    } else {
        SoundManager.stopAllAudioSources();
        const resName = 'audio/bgm/bgm' + bgmIndex.toString();
        loadAudioClip(resName, function(err, audio) {
            if (err || !audio) return;
            SoundManager.bgmSource = createAudioSource(audio, true, 0.3 * SoundManager.aVolume);
            SoundManager.bgmSource.play();
        });
    }
};

SoundManager.playBgmByName = function(bgmName) {
    this.bgmName = bgmName;
    if (SoundManager.aVolume <= 0) return;
    if (usewx) {
        if (SoundManager.bgm != null) {
            SoundManager.bgm.stop();
            SoundManager.bgm.destroy();
        }
        SoundManager.bgm = wx.createInnerAudioContext();
        SoundManager.bgm.autoplay = true;
        SoundManager.bgm.loop = true;
        SoundManager.bgm.volume = 0.3 * SoundManager.aVolume;
        SoundManager.bgm.src = AppKit.SdkManager.AssetsPathToRealPath('audio/bgm/' + bgmName + ".mp3");
    } else {
        SoundManager.stopAllAudioSources();
        const resName = 'audio/bgm/' + bgmName;
        loadAudioClip(resName, function(err, audio) {
            if (err || !audio) return;
            SoundManager.bgmSource = createAudioSource(audio, true, 0.3 * SoundManager.aVolume);
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

SoundManager.playSound = function(soundName, loop = false) {
    if (SoundManager.soundVolume <= 0) return;
    if (!SoundManager.SEs.hasOwnProperty(soundName)) SoundManager.SEs[soundName] = [];
    if (usewx) {
        const sound = wx.createInnerAudioContext();
        sound.loop = loop;
        sound.volume = 1 * SoundManager.soundVolume;
        sound.src = AppKit.SdkManager.AssetsPathToRealPath('audio/fx/' + soundName + ".mp3");
        sound.onStop(function() {
            sound.destroy();
            removeSound(soundName, sound);
        });
        sound.play();
        SoundManager.SEs[soundName].push(sound);
    } else {
        const playSound = function(audio: AudioClip) {
            const source = createAudioSource(audio, loop, 1 * SoundManager.soundVolume);
            source.play();
            SoundManager.SEs[soundName].push(source);
            if (!loop) {
                source.node.once(AudioSource.EventType.ENDED, function() {
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

SoundManager.preloadSound = function() {
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
            SoundManager.bgm.volume = 0.25 * SoundManager.aVolume;
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
};

SoundManager.getBGMSwitch = function() {
    return SoundManager.aVolume > 0;
};

SoundManager.getSoundSwitch = function() {
    return SoundManager.soundVolume > 0;
};

export default SoundManager;
