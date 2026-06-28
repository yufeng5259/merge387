import { _decorator, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SpriteItem')
export class SpriteItem {
    @property
    public key = '';

    @property(SpriteFrame)
    public spriteframe: SpriteFrame | null = null;
}

export default SpriteItem;
