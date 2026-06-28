import { _decorator, Component, Sprite } from 'cc';

const { ccclass, executeInEditMode, property, requireComponent } = _decorator;

@ccclass('SpriteGray')
@requireComponent(Sprite)
@executeInEditMode
export class SpriteGray extends Component {
    @property({ visible: false })
    private _gray = false;

    @property
    get gray(): boolean {
        return this._gray;
    }

    set gray(value: boolean) {
        this._gray = value;
        this.applyGray();
    }

    static SetGray(sprite: Sprite | null | undefined, gray: boolean): void {
        if (!sprite || !sprite.node) {
            return;
        }

        let spriteGray = sprite.node.getComponent(SpriteGray);
        if (!spriteGray) {
            spriteGray = sprite.node.addComponent(SpriteGray);
        }
        spriteGray.gray = gray;
    }

    onLoad(): void {
        this.applyGray();
    }

    private applyGray(): void {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.grayscale = this._gray;
        }
    }
}

export default SpriteGray;
