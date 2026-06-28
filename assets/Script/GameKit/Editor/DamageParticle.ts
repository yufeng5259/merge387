import { _decorator, Component, ParticleSystem } from 'cc';

const { ccclass } = _decorator;

@ccclass('DamageParticle')
export class DamageParticle extends Component {
    private particle: ParticleSystem | null = null;

    onLoad() {
        this.particle = this.getComponent(ParticleSystem);
    }

    start() {
    }

    onEnable() {
        if (this.particle != null) {
            this.scheduleOnce(() => {
            }, 0.25);
        }
    }

    onDisable() {
        if (this.particle != null) {
        }
    }

    stopParticle() {
        if (this.particle != null) {
        }
    }
}

export default DamageParticle;
