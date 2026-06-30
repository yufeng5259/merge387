import { _decorator, Component, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CardLimitSkinAssets')
export class CardLimitSkinAssets extends Component {
    @property(SpriteFrame)
    public shopItemBg: SpriteFrame | null = null;

    @property(SpriteFrame)
    public desItemBg: SpriteFrame | null = null;

    @property(SpriteFrame)
    public cardBg: SpriteFrame | null = null;

    @property(SpriteFrame)
    public cardDiBg: SpriteFrame | null = null;

    @property(SpriteFrame)
    public subject_4_image: SpriteFrame | null = null;

    @property(SpriteFrame)
    public subject_4_image_open: SpriteFrame | null = null;

    @property(SpriteFrame)
    public subject_8_image: SpriteFrame | null = null;

    @property(SpriteFrame)
    public subject_8_image_open: SpriteFrame | null = null;
}

const CardLimitSkinAssetsSetting = {
    isActive: false,
    box: {
        '14': 'subject_4_image',
        '14_open': 'subject_4_image_open',
        '15': 'subject_8_image',
        '15_open': 'subject_8_image_open',
    },
};

global.CardLimitSkinAssetsSetting = CardLimitSkinAssetsSetting;
