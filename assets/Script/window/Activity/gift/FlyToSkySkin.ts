import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('FlyToSkySkin')
export class FlyToSkySkin extends Component {
    public meta: any = null;

    public onLoad() {
        this.meta = Game.ActivityManager.GetMeta(Game.SUser.data.flytoskyActivityId);
        const badgeName = this.meta.Icon();
        if (badgeName === 'flytoSky') {
            this.setSkin(true, false, false);
            return;
        }
        if (badgeName === 'dreamgarden') {
            this.setSkin(false, true, true);
            return;
        }

        this.setSkin(true, false, false);
    }

    public start() {
    }

    private setSkin(showRibbon: boolean, showDreamCover: boolean, showDreamRibbon: boolean) {
        const bg = this.node.getChildByName('bg');
        bg.getChildByName('bd_red_ribbon').active = showRibbon;
        bg.getChildByName('cover_dream').active = showDreamCover;
        bg.getChildByName('bd_red_ribbon_dream').active = showDreamRibbon;
    }
}
