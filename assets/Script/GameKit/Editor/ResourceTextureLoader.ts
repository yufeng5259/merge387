import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ResourceTextureLoader')
export class ResourceTextureLoader extends Component {
    @property
    public path = '';

    onEnable() {
        this.load();
    }

    load() {
        const sprite = this.getComponent(Sprite);
        if (!sprite) return;
        if (sprite.spriteFrame) return;

        cce.loadRes(this.path, SpriteFrame, (err: any, spriteFrame: SpriteFrame | null) => {
            if (!err && spriteFrame != null && sprite) {
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    onDestroy() {
        const sprite = this.getComponent(Sprite);
        cce.releaseSpriteFrame(sprite);
    }
}

export default ResourceTextureLoader;
