import { _decorator, Component, Sprite } from 'cc';

const { ccclass } = _decorator;

@ccclass('CardSubjectBgImage')
export class CardSubjectBgImage extends Component {
    public start() {
        const subjectMeta = Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay, Meta.ActivityMeta.SubTypes.SubjectCard);
        if (!subjectMeta) {
            return;
        }

        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = CommonAssets.instance.cardLimitSkinAssets.cardBg;
        }
    }
}
