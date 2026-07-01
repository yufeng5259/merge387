import { _decorator, Color, Component, instantiate, Label, Node, Prefab } from 'cc';
import { StoryRole } from './StoryRole';

const { ccclass, property } = _decorator;

@ccclass('ChapterTalkNode')
export class ChapterTalkNode extends Component {
    @property(Node)
    public msgLbl: Node | Label | null = null;

    public nameLbl: Label | null = null;
    public userNode: Node | null = null;
    public bgsp: Node | null = null;
    public colorList: Color[] = [new Color().fromHEX('#D55482'), new Color().fromHEX('#349DE7'), new Color().fromHEX('#7D6FE3')];
    public storyMeta: any = null;
    public eid: any = null;
    public roleMeta: any = null;

    public start() {
        this.init();
    }

    public init() {
        this.msgLbl = GameKit.ControllerTable.GetNode(this.node, 'msgLbl').getComponent(Label);
        this.nameLbl = GameKit.ControllerTable.GetNode(this.node, 'nameLbl').getComponent(Label);
        this.userNode = GameKit.ControllerTable.GetNode(this.node, 'userNode');
        this.bgsp = GameKit.ControllerTable.GetNode(this.node, 'bgNode');
        this.userNode.removeAllChildren();
        this.colorList = [new Color().fromHEX('#D55482'), new Color().fromHEX('#349DE7'), new Color().fromHEX('#7D6FE3')];
    }

    public showInfo(data: any) {
        this.init();
        if (GameKit.SoundManager && GameKit.SoundManager.playDialoguePopSound) {
            GameKit.SoundManager.playDialoguePopSound();
        }
        this.storyMeta = data;
        this.eid = this.storyMeta.EId();
        this.roleMeta = this.storyMeta.GetRoleMeata(this.eid);

        this.bgsp.getChildByName('bg0').active = false;
        this.bgsp.getChildByName('bg1').active = false;
        this.bgsp.getChildByName('bg2').active = false;
        this.bgsp.getChildByName('bg' + this.roleMeta.Sex()).active = true;

        const msgLabel = this.msgLbl as Label;
        msgLabel.color = this.colorList[this.roleMeta.Sex()];
        this.nameLbl.string = GameKit.i18n.sel(this.roleMeta.Name());
        msgLabel.string = GameKit.i18n.sel(this.storyMeta.StoryContent());
        this.loadUrlPrefab();
    }

    public loadUrlPrefab() {
        const resName = 'res/Story/role/' + this.roleMeta.ResName();
        cce.loadRes(resName, Prefab, (err: any, vPre: Prefab | null) => {
            if (err || vPre == null) {
                if (CC_DEV) {
                    global.loadEditorTemp = true;
                    return;
                }
                DialogWindow.Show((String as any).format(GameKit.i18n.t('loadResError'), resName), () => {
                });
                return;
            }
            this.scheduleOnce(() => {
                const roleNode = instantiate(vPre);
                roleNode.parent = this.userNode;
                const storyRole = roleNode.getComponent(StoryRole);
                roleNode.setPosition(0, 0, roleNode.position.z);
                storyRole.showInfo(this.storyMeta);
            }, 0.1);
        });
    }
}
