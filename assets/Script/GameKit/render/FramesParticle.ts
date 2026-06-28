import { _decorator, Component, ParticleSystem2D, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FramesParticle')
export class FramesParticle extends Component {
    @property
    public texturesSpaceTime = 0;

    @property([SpriteFrame])
    public textures: SpriteFrame[] = [];

    private texturesIndex = 0;
    private cTexturesSpaceTime = 0;
    private particle: ParticleSystem2D | null = null;

    onLoad(): void {
        this.resetFrameIndex();
        this.cTexturesSpaceTime = this.texturesSpaceTime;
        this.particle = this.getComponent(ParticleSystem2D);
    }

    onEnable(): void {
        this.resetFrameIndex();
    }

    update(dt: number): void {
        if (!this.particle || this.textures.length === 0) {
            return;
        }

        this.cTexturesSpaceTime += dt;
        if (this.cTexturesSpaceTime > this.texturesSpaceTime) {
            this.cTexturesSpaceTime = 0;
            this.texturesIndex = (this.texturesIndex + 1) % this.textures.length;
            this.particle.spriteFrame = this.textures[this.texturesIndex];
        }
    }

    private resetFrameIndex(): void {
        if (this.textures.length === 0) {
            this.texturesIndex = 0;
            return;
        }

        this.texturesIndex = G.getRandomInt(0, this.textures.length);
    }
}

export default FramesParticle;
