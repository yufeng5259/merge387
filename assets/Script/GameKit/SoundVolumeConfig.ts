import { _decorator, Component, Node } from 'cc';
import SoundManager from './SoundManager';
import SoundVolumeItem, { SoundVolumeType } from './SoundVolumeItem';

const { ccclass, executeInEditMode, menu, property } = _decorator;

type SoundDefinition = {
    type: any;
    key: string;
    path: string;
    desc?: string;
    missing?: boolean;
};

const editorRoot = globalThis as any;
const isEditor = !!editorRoot.CC_EDITOR;
const editorRequire = isEditor
    ? (editorRoot.__non_webpack_require__ || editorRoot.require || ((name: string) => null))
    : null;
const fs = editorRequire ? editorRequire('fs') : null;
const pathModule = editorRequire ? editorRequire('path') : null;

function clamp01(value: any, defaultValue = 1): number {
    const num = Number(value);
    if (!isFinite(num)) return defaultValue;
    return Math.max(0, Math.min(1, num));
}

function getProjectPath(): string {
    const Editor = editorRoot.Editor;
    if (!isEditor || !Editor) return '';
    if (Editor.remote && Editor.remote.projectPath) return Editor.remote.projectPath;
    if (Editor.Project && Editor.Project.path) return Editor.Project.path;
    if (Editor.projectPath) return Editor.projectPath;
    return '';
}

function walkAudioFiles(dir: string, out: string[]): void {
    if (!fs || !pathModule || !fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        const fullPath = pathModule.join(dir, files[i]);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkAudioFiles(fullPath, out);
        } else if (/\.(mp3|wav|ogg|m4a)$/i.test(fullPath)) {
            out.push(fullPath);
        }
    }
}

function normalizeAudioPath(resPath: any): string {
    return String(resPath || '').replace(/\\/g, '/').replace(/\.(mp3|wav|ogg|m4a)$/i, '');
}

function makeSafeNodeName(text: any): string {
    return String(text || 'Sound').replace(/[\\/:*?"<>|]/g, '_');
}

@ccclass('SoundVolumeConfig')
@executeInEditMode(true)
@menu('Editor-Tools/SoundVolumeConfig')
export default class SoundVolumeConfig extends Component {
    static instance: SoundVolumeConfig | null = null;

    @property({
        range: [0, 1, 0.01],
        slide: true,
        tooltip: 'Background music master volume multiplier',
    })
    musicMasterVolume = 1;

    @property({
        range: [0, 1, 0.01],
        slide: true,
        tooltip: 'Sound effect master volume multiplier',
    })
    soundMasterVolume = 1;

    @property({
        range: [0, 1, 0.01],
        slide: true,
        tooltip: 'Default background music multiplier when no item config exists',
    })
    defaultMusicVolume = 1;

    @property({
        range: [0, 1, 0.01],
        slide: true,
        tooltip: 'Default sound effect multiplier when no item config exists',
    })
    defaultSoundVolume = 1;

    @property({
        tooltip: 'Register this component to SoundManager at runtime',
    })
    autoRegisterOnLoad = true;

    private _bgmByKey: Record<string, number> | null = null;
    private _bgmByPath: Record<string, number> | null = null;
    private _sfxByKey: Record<string, number> | null = null;
    private _sfxByPath: Record<string, number> | null = null;

    @property({
        tooltip: 'Editor-only: scan project audio assets and sync child item configs without overwriting existing volumes',
    })
    get syncSoundConfig(): boolean {
        return false;
    }

    set syncSoundConfig(value: boolean) {
        if (isEditor && value) this.syncInEditor();
    }

    onLoad(): void {
        if (this.autoRegisterOnLoad) this.registerToSoundManager();
    }

    onEnable(): void {
        if (this.autoRegisterOnLoad) this.registerToSoundManager();
    }

    onDisable(): void {
        if (SoundVolumeConfig.instance === this) SoundVolumeConfig.instance = null;
    }

    registerToSoundManager(): void {
        SoundVolumeConfig.instance = this;
        const manager = (globalThis as any).GameKit?.SoundManager || SoundManager;
        if (manager && manager.setVolumeConfig) {
            manager.setVolumeConfig(this);
        }
    }

    rebuildCache(): void {
        this._bgmByKey = {};
        this._bgmByPath = {};
        this._sfxByKey = {};
        this._sfxByPath = {};

        const items = this.node.getComponentsInChildren(SoundVolumeItem);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item || !item.enabled) continue;
            const volume = item.getVolumeScale();
            if (volume == null) continue;
            const isBgm = item.type === SoundVolumeType.BGM;
            const byKey = isBgm ? this._bgmByKey : this._sfxByKey;
            const byPath = isBgm ? this._bgmByPath : this._sfxByPath;
            if (item.key) byKey[item.key] = volume;
            if (item.path) byPath[normalizeAudioPath(item.path)] = volume;
        }
    }

    getBgmVolume(keyOrPath: any): number {
        if (!this._bgmByKey || !this._bgmByPath) this.rebuildCache();
        const key = String(keyOrPath || '');
        const resPath = key.indexOf('audio/') === 0 ? normalizeAudioPath(key) : normalizeAudioPath('audio/bgm/' + key);
        let volume = this._bgmByKey![key];
        if (volume == null) volume = this._bgmByPath![resPath];
        if (volume == null) volume = clamp01(this.defaultMusicVolume, 1);
        return clamp01(this.musicMasterVolume, 1) * clamp01(volume, 1);
    }

    getSoundVolume(keyOrPath: any): number {
        if (!this._sfxByKey || !this._sfxByPath) this.rebuildCache();
        const key = String(keyOrPath || '');
        const resPath = normalizeAudioPath(key.indexOf('audio/') === 0 ? key : 'audio/fx/' + key);
        let volume = this._sfxByKey![key];
        if (volume == null) volume = this._sfxByPath![resPath];
        if (volume == null) volume = clamp01(this.defaultSoundVolume, 1);
        return clamp01(this.soundMasterVolume, 1) * clamp01(volume, 1);
    }

    getOrCreateGroup(name: string): Node {
        let group = this.node.getChildByName(name);
        if (!group) {
            group = new Node(name);
            group.parent = this.node;
        }
        return group;
    }

    findItemNode(group: Node, itemKey: string): Node | null {
        for (let i = 0; i < group.children.length; i++) {
            const child = group.children[i];
            const item = child.getComponent(SoundVolumeItem);
            if (item && item.key === itemKey) return child;
        }
        return null;
    }

    upsertItem(group: Node, data: SoundDefinition): SoundVolumeItem {
        let node = this.findItemNode(group, data.key);
        if (!node) {
            node = new Node(makeSafeNodeName(data.key));
            node.parent = group;
        }
        node.name = makeSafeNodeName(data.key);
        const item = node.getComponent(SoundVolumeItem) || node.addComponent(SoundVolumeItem);
        item.type = data.type;
        item.key = data.key;
        item.path = data.path;
        item.desc = data.desc || data.key;
        item.missing = !!data.missing;
        if (item.volume == null) item.volume = 1;
        return item;
    }

    collectSoundDefinitions(): SoundDefinition[] {
        const defs: SoundDefinition[] = [];
        if (!isEditor || !fs || !pathModule) return defs;
        const projectPath = getProjectPath();
        const Editor = editorRoot.Editor;
        if (!projectPath) {
            if (Editor) Editor.warn('[SoundVolumeConfig] project path not found; cannot sync audio config');
            return defs;
        }

        const audioRoot = pathModule.join(projectPath, 'assets', 'resources', 'audio');
        const files: string[] = [];
        walkAudioFiles(audioRoot, files);
        for (let i = 0; i < files.length; i++) {
            const rel = pathModule.relative(pathModule.join(projectPath, 'assets', 'resources'), files[i]).replace(/\\/g, '/');
            const resPath = normalizeAudioPath(rel);
            const name = pathModule.basename(resPath);
            const type = resPath.indexOf('audio/bgm/') === 0 ? SoundVolumeType.BGM : SoundVolumeType.SFX;
            defs.push({ type, key: name, path: resPath, desc: resPath });
        }

        const names = SoundManager.SoundNames || {};
        Object.keys(names).forEach(key => {
            defs.push({
                type: SoundVolumeType.BGM,
                key: names[key],
                path: 'audio/bgm/' + names[key],
                desc: key,
            });
        });

        const paths = SoundManager.SoundPaths || {};
        Object.keys(paths).forEach(key => {
            defs.push({
                type: SoundVolumeType.SFX,
                key,
                path: normalizeAudioPath(paths[key]),
                desc: paths[key],
            });
        });

        const aliases = SoundManager.SoundAliases || {};
        Object.keys(aliases).forEach(key => {
            const alias = aliases[key] || {};
            const soundPath = paths[alias.path] || alias.path || key;
            defs.push({
                type: SoundVolumeType.SFX,
                key,
                path: normalizeAudioPath(String(soundPath).indexOf('audio/') === 0 ? soundPath : 'audio/fx/' + key),
                desc: 'alias -> ' + (alias.path || key),
            });
        });

        return defs;
    }

    syncInEditor(): void {
        if (!isEditor) return;
        const Editor = editorRoot.Editor;
        if (!fs || !pathModule) {
            if (Editor) Editor.warn('[SoundVolumeConfig] file scanning is unavailable in this environment');
            return;
        }

        const oldItems = this.node.getComponentsInChildren(SoundVolumeItem);
        for (let oldIndex = 0; oldIndex < oldItems.length; oldIndex++) {
            oldItems[oldIndex].missing = true;
        }

        const defs = this.collectSoundDefinitions();
        const bgmGroup = this.getOrCreateGroup('BGM');
        const sfxGroup = this.getOrCreateGroup('SFX');
        const seen: Record<string, boolean> = {};
        for (let i = 0; i < defs.length; i++) {
            const def = defs[i];
            if (!def.key || !def.path) continue;
            const mapKey = def.type + '|' + def.key + '|' + def.path;
            if (seen[mapKey]) continue;
            seen[mapKey] = true;
            this.upsertItem(def.type === SoundVolumeType.BGM ? bgmGroup : sfxGroup, def);
        }
        this.rebuildCache();
        if (Editor) {
            Editor.log('[SoundVolumeConfig] sync complete, count=' + Object.keys(seen).length);
            if (Editor.Ipc) Editor.Ipc.sendToMain('scene:dirty');
        }
    }
}
