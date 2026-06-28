import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopIconNode')
export class ShopIconNode extends Component {
    @property([SpriteFrame])
    public spinIcons: SpriteFrame[] = [];
    @property([SpriteFrame])
    public coinIcons: SpriteFrame[] = [];
    @property([SpriteFrame])
    public chestIcons: SpriteFrame[] = [];
    @property([SpriteFrame])
    public treatIcons: SpriteFrame[] = [];
    @property([SpriteFrame])
    public gemIcons: SpriteFrame[] = [];
    @property([SpriteFrame])
    public saleIcons: SpriteFrame[] = [];
    @property([SpriteFrame])
    public hotIcons: SpriteFrame[] = [];

    onLoad () {
    }

    getSpinSprite (index: number) {
        return this.spinIcons[index];
    }

    getCoinSprite (index: number) {
        return this.coinIcons[index];
    }

    getChestSprite (index: number) {
        return this.chestIcons[index];
    }

    getTreatSprite (index: number) {
        return this.treatIcons[index];
    }

    getGemSprite (index: number) {
        return this.gemIcons[index];
    }

    getSaleSprite (index: number) {
        return this.saleIcons[index];
    }

    getHotSprite (index: number) {
        return this.hotIcons[index];
    }
}
