import { _decorator } from 'cc';
import { ResourceTextureLoader } from './ResourceTextureLoader';

const { ccclass, property } = _decorator;

@ccclass('VillageTextureLoader')
export class VillageTextureLoader extends ResourceTextureLoader {
    @property
    public village = '';

    onEnable() {
        this.vload();
    }

    vload() {
        this.path = 'res/village/' + this.village + '/res/' + this.node.name;
        this.load();
    }
}

export default VillageTextureLoader;
