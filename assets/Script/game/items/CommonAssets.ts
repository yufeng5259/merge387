import { _decorator, Component, SpriteAtlas, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KeySprite')
export class KeySprite {
    @property
    public key = '';

    @property(SpriteFrame)
    public sprite: SpriteFrame | null = null;
}

@ccclass('SpineAnimation')
export class SpineAnimation {
    @property
    public spineUrl: any = null;

    @property
    public animalName = '';
}

@ccclass('CommonAssets')
export class CommonAssets extends Component {
    @property(SpriteFrame)
    public avatar_default: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_TaskPoint: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_exp: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_coin: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_coinB: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_cash: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_spin: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_spinB: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_shield: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_pack: SpriteFrame | null = null;
    @property(SpriteFrame)
    public sp_cardmodel: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_share: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_raid: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_attack: SpriteFrame | null = null;
    @property(SpriteFrame)
    public icon_build: SpriteFrame | null = null;

    @property(SpriteAtlas)
    public atlas_item: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_symbol: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_activity_item: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_cardchest: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_randomPack: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_presentPack: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_guildBadge: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_mergeIcon: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public atlas_mergeIconBg: SpriteAtlas | null = null;

    @property(SpriteFrame)
    public type_20_1: SpriteFrame | null = null;
    @property(SpriteFrame)
    public type_20_2: SpriteFrame | null = null;
    @property(SpriteFrame)
    public type_20_3: SpriteFrame | null = null;
    @property([SpineAnimation])
    public toolSpineAnimation: SpineAnimation[] = [];
    @property(SpriteAtlas)
    public toolSpineAtlas: SpriteAtlas | null = null;
    @property(SpriteFrame)
    public bossRankIcon: SpriteFrame | null = null;
    @property(SpriteAtlas)
    public avatarFrames: SpriteAtlas | null = null;
    @property(SpriteAtlas)
    public avatars: SpriteAtlas | null = null;

    public static instance: CommonAssets | null = null;

    public static Atlases = {
        Item: 'atlas_item',
        SlotSymbol: 'atlas_symbol',
        ActivityItem: 'atlas_activity_item',
        CardChest: 'atlas_cardchest',
        RandomPack: 'atlas_randomPack',
        PresentPack: 'atlas_presentPack',
        GuildBadge: 'atlas_guildBadge',
        toolSpineAtlas: 'toolSpineAtlas',
        MergeIcon: 'atlas_mergeIcon',
        MergeIconBg: 'atlas_mergeIconBg',
        AvatarFrames: 'avatarFrames',
    };

    onLoad () {
        CommonAssets.instance = this;
    }

    onDestroy () {
        if (CommonAssets.instance === this) CommonAssets.instance = null;
    }

    update () {
    }

    getByAtlas (atlas: any, name: any) {
        const spriteAtlas = (this as any)[atlas] as SpriteAtlas | null;
        if (!spriteAtlas) return null;
        return spriteAtlas.getSpriteFrame(String(name));
    }

    getToolSpineAnimationByKey (key: any) {
        for (let index = 0; index < this.toolSpineAnimation.length; index++) {
            const toolAnim = this.toolSpineAnimation[index];
            const nameArr = toolAnim.animalName.split('=');
            if (nameArr.indexOf(key.toString()) > -1) {
                return toolAnim;
            }
        }
        return null;
    }
}

class IconType {
    type_2 = 'icon_coin';
}

(global as any).CommonAssets = CommonAssets;
export default CommonAssets;
