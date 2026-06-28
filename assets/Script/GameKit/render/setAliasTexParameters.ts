import { _decorator, Component, Sprite, SpriteFrame, Texture2D } from 'cc';

const { ccclass, executeInEditMode } = _decorator;

function applyNearestFilter(spriteFrame: SpriteFrame | null | undefined): void {
    if (!spriteFrame) {
        return;
    }

    spriteFrame.texture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
}

@ccclass('SetAliasTexParameters')
@executeInEditMode
export class SetAliasTexParameters extends Component {
    start(): void {
        const sprite = this.getComponent(Sprite);
        if (!sprite || !sprite.spriteFrame) {
            return;
        }

        SetAliasTexParameters.setSpriteFrame(sprite.spriteFrame);
        sprite._onTextureLoaded?.();
    }

    static setSpriteFrame(spriteFrame: SpriteFrame | null | undefined): void {
        applyNearestFilter(spriteFrame);
    }
}

export const setSpriteFrame = SetAliasTexParameters.setSpriteFrame;

export default SetAliasTexParameters;
