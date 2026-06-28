import { _decorator, CCInteger, Component, Enum, Sprite, SpriteAtlas, SpriteFrame } from 'cc';
import { EDITOR } from 'cc/env';
import LevelMergeItemEditor from './LevelMergeItemEditor';
import MergeItem from '../../game/merge/MergeItem';

const { ccclass, executeInEditMode, menu, property } = _decorator;

const FrameEnum = Enum({ None: 0 }) as any;

type FrameListKey = '_frameNames_iconAtlas' | '_frameNames_envIconAtlas' | '_frameNames_additionIconAtlas';

@ccclass('MergeItemEditor')
@executeInEditMode
@menu('Editor-Tools/MergeItemEditor')
export class MergeItemEditor extends Component {
    @property
    public iconId = 0;

    @property
    public doIdChange = false;

    @property(Sprite)
    public iconSprite: Sprite | null = null;

    @property(SpriteAtlas)
    public iconAtlas: SpriteAtlas | null = null;

    @property({ type: FrameEnum })
    public iconFrames = 0;

    @property
    public showEnv = false;

    @property(CCInteger)
    public envStatus = -1;

    @property(Sprite)
    public envIconSprite: Sprite | null = null;

    @property(SpriteAtlas)
    public envIconAtlas: SpriteAtlas | null = null;

    @property({ type: FrameEnum })
    public envIconFrames = 0;

    @property
    public showAddition = false;

    @property
    public additionId = 0;

    @property
    public doAdditionIdChange = false;

    @property(Sprite)
    public additionIconSprite: Sprite | null = null;

    @property(SpriteAtlas)
    public additionIconAtlas: SpriteAtlas | null = null;

    @property({ type: FrameEnum })
    public additionIconFrames = 0;

    private _frameNames_iconAtlas: string[] = [];
    private _frameNames_envIconAtlas: string[] = [];
    private _frameNames_additionIconAtlas: string[] = [];
    private _suppressMergeItemSync = false;
    private _skipInitialEditorRefresh = false;

    start() {
        if (!EDITOR) return;

        setTimeout(() => {
            if (this._skipInitialEditorRefresh || this._suppressMergeItemSync) return;

            if (this.iconAtlas) {
                this._rebuildFrameEnumForAtlas('iconAtlas', 'iconFrames');
                this._applySelectedFrameForAtlas('iconAtlas', 'iconFrames', 'iconSprite');
            }

            if (this.envIconAtlas) {
                this._rebuildFrameEnumForAtlas('envIconAtlas', 'envIconFrames');
                if (this.showEnv) {
                    this._applySelectedFrameForAtlas('envIconAtlas', 'envIconFrames', 'envIconSprite');
                }
            }

            if (this.additionIconAtlas) {
                this._rebuildFrameEnumForAtlas('additionIconAtlas', 'additionIconFrames');
                if (this.showEnv && this.showAddition) {
                    this._applySelectedFrameForAtlas('additionIconAtlas', 'additionIconFrames', 'additionIconSprite');
                }
            }

            if (this.envIconSprite) {
                this.envIconSprite.node.active = this.showEnv;
            }

            if (!this.showEnv) {
                this.showAddition = false;
                this.envStatus = -1;
                this._syncMergeItemComponent('envStatus', -1);
                this.additionId = -1;
                this._syncMergeItemComponent('additionId', -1);
            } else {
                this._updateEnvStatusFromSelectedFrame('envIconAtlas', 'envIconFrames', 'envStatus');
            }

            if (this.additionIconSprite) {
                this.additionIconSprite.node.active = this.showEnv && this.showAddition;
            }

            if (!this.showAddition) {
                this.additionId = -1;
                this._syncMergeItemComponent('additionId', -1);
            } else {
                this._updateIdFromSelectedFrame('additionIconAtlas', 'additionIconFrames', 'additionId');
            }
        }, 150);
    }

    _rebuildFrameEnumForAtlas(atlasPropName: any, framesPropName: any) {
        if (!EDITOR) return;

        const atlas = (this as any)[atlasPropName] as SpriteAtlas | null;
        if (!atlas) return;

        const spriteFrames = atlas.getSpriteFrames() || [];
        const names: string[] = [];
        for (let i = 0; i < spriteFrames.length; i++) {
            const spriteFrame = spriteFrames[i] as SpriteFrame | null;
            const name = spriteFrame ? spriteFrame.name : '';
            if (name) names.push(name);
        }
        names.sort();

        const frameNamesKey = ('_frameNames_' + atlasPropName) as FrameListKey;
        (this as any)[frameNamesKey] = names;

        const hasNone = framesPropName !== 'envIconFrames';
        const currentValue = Number((this as any)[framesPropName]);
        const maxValue = hasNone ? names.length : names.length - 1;
        const valueValid = !Number.isNaN(currentValue) && currentValue >= 0 && currentValue <= maxValue;

        if (!valueValid) {
            (this as any)[framesPropName] = hasNone && names.length > 0 ? 1 : 0;
        } else if (hasNone && currentValue === 0 && names.length > 0) {
            (this as any)[framesPropName] = 1;
        }
    }

    _applySelectedFrameForAtlas(atlasPropName: any, framesPropName: any, spritePropName: any) {
        if (!EDITOR) return;

        const atlas = (this as any)[atlasPropName] as SpriteAtlas | null;
        const sprite = (this as any)[spritePropName] as Sprite | null;
        if (!sprite) return;
        if (!atlas) {
            sprite.spriteFrame = null;
            return;
        }

        const frameNamesKey = ('_frameNames_' + atlasPropName) as FrameListKey;
        const names = ((this as any)[frameNamesKey] || []) as string[];
        if (names.length === 0) {
            sprite.spriteFrame = null;
            return;
        }

        const framesWithoutNone = ['envIconFrames'];
        const hasNone = framesWithoutNone.indexOf(framesPropName) === -1;

        const enumValue = (this as any)[framesPropName] | 0;
        let index;
        if (!hasNone) {
            if (enumValue < 0 || enumValue >= names.length) {
                sprite.spriteFrame = null;
                return;
            }
            index = enumValue;
        } else {
            if (enumValue <= 0) {
                sprite.spriteFrame = null;
                return;
            }
            index = enumValue - 1;
            if (index < 0 || index >= names.length) {
                sprite.spriteFrame = null;
                return;
            }
        }

        sprite.spriteFrame = atlas.getSpriteFrame(names[index]);
    }

    _refreshInspectorSafely() {
        const editor = (globalThis as any).Editor;
        if (editor && editor.Utils && editor.Utils.refreshInspector) {
            editor.Utils.refreshInspector();
        }
    }

    _findMergeIdByIconName(iconName: any) {
        if (!EDITOR || !iconName) return 0;

        const id = LevelMergeItemEditor.findIdByIconName(iconName);
        return id || 0;
    }

    _findIconNameById(iconId: any) {
        if (!EDITOR || !iconId || iconId <= 0) return null;

        const iconToIdMap = LevelMergeItemEditor.getIconToIdMap();
        if (!iconToIdMap) return null;

        for (const iconName in iconToIdMap) {
            if (Object.prototype.hasOwnProperty.call(iconToIdMap, iconName) && iconToIdMap[iconName] === iconId) {
                return iconName;
            }
        }
        return null;
    }

    _applyIconFromId() {
        if (!EDITOR || !this.iconId || this.iconId <= 0 || !this.iconAtlas) return;

        this._ensureLevelMergeDataLoaded();
        this._applyFrameFromId(this.iconId, 'iconAtlas', 'iconFrames');
    }

    _applyAdditionIconFromId() {
        if (!EDITOR || !this.additionId || this.additionId <= 0 || !this.additionIconAtlas) return;

        this._ensureLevelMergeDataLoaded();
        this._applyFrameFromId(this.additionId, 'additionIconAtlas', 'additionIconFrames');
    }

    _updateIdFromSelectedFrame(atlasPropName: any, framesPropName: any, idPropName: any) {
        if (!EDITOR || this._suppressMergeItemSync) return;

        const atlas = (this as any)[atlasPropName] as SpriteAtlas | null;
        if (!atlas) {
            (this as any)[idPropName] = -1;
            return;
        }

        const frameNamesKey = ('_frameNames_' + atlasPropName) as FrameListKey;
        const names = ((this as any)[frameNamesKey] || []) as string[];
        if (names.length === 0) {
            (this as any)[idPropName] = -1;
            return;
        }

        const enumValue = Number((this as any)[framesPropName]) | 0;
        if (enumValue <= 0) {
            (this as any)[idPropName] = -1;
            return;
        }

        const index = enumValue - 1;
        if (index < 0 || index >= names.length) {
            (this as any)[idPropName] = -1;
            return;
        }

        this._ensureLevelMergeDataLoaded();
        const foundId = this._findMergeIdByIconName(names[index]);
        const value = foundId > 0 ? foundId : -1;
        (this as any)[idPropName] = value;
        this._syncMergeItemComponent(idPropName, value);
    }

    _syncMergeItemComponent(idPropName: any, idValue: any) {
        if (!EDITOR || !this.node || this._suppressMergeItemSync) return;

        const mergeItem = this.node.getComponent(MergeItem);
        if (!mergeItem) return;

        if (idPropName === 'iconId') {
            mergeItem.mergeId = idValue;
        } else if (idPropName === 'additionId') {
            mergeItem.addtionId = idValue;
        } else if (idPropName === 'envStatus') {
            mergeItem.envStatus = idValue;
        }
    }

    _updateEnvStatusFromSelectedFrame(atlasPropName: any, framesPropName: any, statusPropName: any) {
        if (!EDITOR) return;

        if (!this.showEnv) {
            (this as any)[statusPropName] = -1;
            this._syncMergeItemComponent(statusPropName, -1);
            return;
        }

        const frameNamesKey = ('_frameNames_' + atlasPropName) as FrameListKey;
        const names = ((this as any)[frameNamesKey] || []) as string[];
        const enumValue = Number((this as any)[framesPropName]) | 0;
        if (names.length === 0 || enumValue < 0 || enumValue >= names.length) {
            (this as any)[statusPropName] = -1;
            this._syncMergeItemComponent(statusPropName, -1);
            return;
        }

        (this as any)[statusPropName] = enumValue;
        this._syncMergeItemComponent(statusPropName, enumValue);
    }

    private _applyFrameFromId(id: number, atlasPropName: 'iconAtlas' | 'additionIconAtlas', framesPropName: 'iconFrames' | 'additionIconFrames') {
        const iconName = this._findIconNameById(id);
        if (!iconName) return;

        const frameNamesKey = ('_frameNames_' + atlasPropName) as FrameListKey;
        let names = ((this as any)[frameNamesKey] || []) as string[];
        if (names.length === 0) {
            this._rebuildFrameEnumForAtlas(atlasPropName, framesPropName);
            names = ((this as any)[frameNamesKey] || []) as string[];
        }

        for (let i = 0; i < names.length; i++) {
            if (names[i] === iconName) {
                (this as any)[framesPropName] = i + 1;
                this._applySelectedFrameForAtlas(atlasPropName, framesPropName, atlasPropName === 'iconAtlas' ? 'iconSprite' : 'additionIconSprite');
                return;
            }
        }
    }

    private _ensureLevelMergeDataLoaded() {
        if (LevelMergeItemEditor.isDataLoaded()) return;

        const loader = LevelMergeItemEditor.getInstance();
        if (loader && loader.jsonFilePath) {
            loader.loadJsonFile();
        }
    }
}

export default MergeItemEditor;
