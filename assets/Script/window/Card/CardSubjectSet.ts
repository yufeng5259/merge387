import { _decorator, Button, Color, Component, Label, ProgressBar, Sprite, SpriteFrame } from 'cc';
import SpriteGray from '../../GameKit/render/SpriteGray';

const { ccclass, property } = _decorator;

const C = {
    BASE_PATH: 'Card',
    SET_ICON_FILENAME: 'set-icon',
};

@ccclass('CardSubjectSet')
export class CardSubjectSet extends Component {
    @property(Label)
    public labelSubject: Label | null = null;

    public subjectMeta: any = null;
    public leftTime: number | null = null;
    public activity_id_list: any[] = [];
    public all_set_meta: any = null;

    public event_info_subject() {
        UIRoot.instance.openChildWindow(this.subjectMeta.Panel(), { meta: this.subjectMeta });
    }

    public createActivityCard(all_set_meta: any) {
        this.subjectMeta = Game.ActivityManager.GetActiveActivity(Meta.ActivityMeta.Types.Pay, Meta.ActivityMeta.SubTypes.SubjectCard);
        this.leftTime = 0;

        const arr = this.subjectMeta.Param().sets;
        this.activity_id_list = arr;
        this.all_set_meta = all_set_meta;

        const cont = this.node.getChildByName('content');
        if (!cont) {
            return;
        }

        for (let index = 0; index < 3; index++) {
            const node = cont.children[index];
            if (index < arr.length) {
                node.active = true;

                const id = arr[index];
                const sp_icon = GameKit.ControllerTable.GetNode(node, 'icon').getComponent(Sprite);
                const label_set_name = GameKit.ControllerTable.GetNode(node, 'label-set-name').getComponent(Label);
                const pb = GameKit.ControllerTable.GetNode(node, 'progress').getComponent(ProgressBar);
                const label_pb = GameKit.ControllerTable.GetNode(node, 'label-progress').getComponent(Label);
                const sp_lock = GameKit.ControllerTable.GetNode(node, 'lock').getComponent(Sprite);
                const label_lock = GameKit.ControllerTable.GetNode(node, 'label-lock').getComponent(Label);
                const meta = this.all_set_meta[id];

                label_set_name.string = meta.Name();
                cce.loadRes(`${C.BASE_PATH}/${meta.Res()}/${C.SET_ICON_FILENAME}`, SpriteFrame, (err: any, res: SpriteFrame) => {
                    if (!err && sp_icon) {
                        sp_icon.spriteFrame = res;
                    }
                });

                let count = 0;
                for (let i = 1; i <= 9; i++) {
                    count += Game.SUserCard.HaveCard(id * 100 + i) ? 1 : 0;
                }

                pb.progress = count / 9;
                label_pb.string = `${count} / 9`;
                label_lock.string = (String as any).format(GameKit.i18n.t('CardAllSetWindowLock'), meta.MinVillage());

                const flag_lock = Game.SUserVillage.MapId() < meta.MinVillage() && count <= 0;
                sp_lock.node.active = flag_lock;
                node.getComponent(Button).interactable = !flag_lock;
                SpriteGray.SetGray(sp_icon, flag_lock);
                sp_icon.node.color = flag_lock ? new Color(50, 50, 50) : Color.WHITE;
                label_set_name.node.active = !flag_lock;

                node.on('click', () => {
                    UIRoot.instance.openChildWindow('CardSingleSetWindow', { single_set_meta: meta });
                });
            } else {
                node.active = false;
            }
        }
    }

    public update_compelete() {
        const cont = this.node.getChildByName('content');
        if (!cont) {
            return;
        }

        const len = this.activity_id_list.length;
        for (let index = 0; index < len; index++) {
            const node = cont.children[index];
            if (node.active) {
                const id = this.activity_id_list[index];
                const meta = this.all_set_meta[id];
                const pb = GameKit.ControllerTable.GetNode(node, 'progress').getComponent(ProgressBar);
                const completed = GameKit.ControllerTable.GetNode(node, 'label-completed');
                let is_get_reward = Game.SUserCard.HasgotSetsReward(meta.Id());
                is_get_reward = pb.progress === 1;
                pb.node.active = !is_get_reward;
                completed.active = is_get_reward;
            }
        }
    }

    public update() {
        this.updateTime(this.labelSubject);
    }

    public updateTime(labelTimer: Label | null) {
        if (this.leftTime != null && labelTimer) {
            const currentTime = GameKit.TimeUtil.getCurrentTime();
            this.leftTime = this.subjectMeta.EndTime() - currentTime;
            labelTimer.string = GameKit.i18n.t('ActivityTimeleft') + ' ' + GameKit.TimeUtil.FormatRemainTimeSimple(this.leftTime, true);

            if (this.leftTime <= 0) {
                this.leftTime = null;
            }
        }
    }
}
