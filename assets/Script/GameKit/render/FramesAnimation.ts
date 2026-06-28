import { _decorator, Animation, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FramesAnimation')
export class FramesAnimation extends Component {
    @property
    public texturesSpaceTime = 0;

    @property(Sprite)
    public sprite: Sprite | null = null;

    @property([SpriteFrame])
    public textures: SpriteFrame[] = [];

    private texturesIndex = 0;
    private cTexturesSpaceTime = 0;
    private animation: Animation | null = null;

    onLoad(): void {
        this.resetFrameIndex();
        this.cTexturesSpaceTime = this.texturesSpaceTime;
        this.animation = this.getComponent(Animation);

        if (!this.sprite && this.animation) {
            this.sprite = this.findChildSprite();
        }
    }

    onEnable(): void {
        this.resetFrameIndex();
    }

    SetTextures(textures: SpriteFrame[]): void {
        if (!textures || textures.length === 0) {
            return;
        }

        this.textures = textures;
        this.resetFrameIndex();
        this.cTexturesSpaceTime = 0;
        this.applyCurrentFrame();
    }

    update(dt: number): void {
        if (!this.canUpdateFrames() || !this.isAnimationPlaying()) {
            return;
        }

        this.cTexturesSpaceTime += dt;
        if (this.cTexturesSpaceTime >= this.texturesSpaceTime) {
            this.cTexturesSpaceTime = 0;
            this.texturesIndex = (this.texturesIndex + 1) % this.textures.length;
        }
    }

    lateUpdate(): void {
        if (this.canUpdateFrames() && this.isAnimationPlaying()) {
            this.applyCurrentFrame();
        }
    }

    private canUpdateFrames(): this is this & { sprite: Sprite } {
        return !!this.sprite && this.textures.length > 0 && !!this.animation && this.node.active;
    }

    private resetFrameIndex(): void {
        if (this.textures.length === 0) {
            this.texturesIndex = 0;
            return;
        }

        this.texturesIndex = G.getRandomInt(0, this.textures.length);
    }

    private findChildSprite(): Sprite | null {
        for (const child of this.animation!.node.children) {
            const sprite = child.getComponent(Sprite);
            if (sprite) {
                return sprite;
            }
        }
        return null;
    }

    private isAnimationPlaying(): boolean {
        if (!this.animation) {
            return false;
        }

        const defaultClip = this.animation.defaultClip;
        if (defaultClip) {
            const state = this.animation.getState(defaultClip.name);
            if (state?.isPlaying) {
                return true;
            }
        }

        for (const clip of this.animation.clips) {
            if (!clip) {
                continue;
            }
            const state = this.animation.getState(clip.name);
            if (state?.isPlaying) {
                return true;
            }
        }

        return false;
    }

    private applyCurrentFrame(): void {
        if (!this.sprite || this.textures.length === 0) {
            return;
        }

        const frame = this.textures[this.texturesIndex];
        if (frame) {
            this.sprite.spriteFrame = frame;
        }
    }
}

export default FramesAnimation;
