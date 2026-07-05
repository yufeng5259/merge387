import { _decorator, Component, Enum } from 'cc';

const { ccclass, property } = _decorator;

export const SoundVolumeType = Enum({
    BGM: 0,
    SFX: 1,
}) as any;

@ccclass('SoundVolumeItem')
export default class SoundVolumeItem extends Component {
    static Type = SoundVolumeType;

    @property({
        type: SoundVolumeType,
        tooltip: 'BGM=background music, SFX=sound effect',
    })
    type = SoundVolumeType.SFX;

    @property({
        tooltip: 'Unique sound key, usually a SoundManager.SoundPaths field or audio file name',
    })
    key = '';

    @property({
        tooltip: 'Audio path under resources without extension, for example audio/jianzhu/SfxBuildHammer1',
    })
    path = '';

    @property({
        range: [0, 1, 0.01],
        slide: true,
        tooltip: 'Volume multiplier for this sound. 0=mute, 1=original volume',
    })
    volume = 1;

    @property({
        tooltip: 'Designer-facing description; ignored at runtime',
    })
    desc = '';

    @property({
        tooltip: 'When off, ignore this item and use default volume',
    })
    useConfig = true;

    @property({
        tooltip: 'Set during editor sync when the matching asset is missing; ignored at runtime',
    })
    missing = false;

    getVolumeScale(): number | null {
        if (!this.useConfig || this.missing) return null;
        const volume = Number(this.volume);
        if (!isFinite(volume)) return 1;
        return Math.max(0, Math.min(1, volume));
    }
}
