import { _decorator, Component, Label, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('StoryRole')
export class StoryRole extends Component {
    @property(Node)
    public levelNode: Node | null = null;

    @property(Label)
    public nameLab: Label | null = null;

    public meta: any = null;
    public roleMeta: any = null;

    public start() {
    }

    public init() {
        for (let i = 1; i < 6; i++) {
            const element = this.levelNode.getChildByName(i + '');
            element.active = false;
            if (this.roleMeta.EType() === i) {
                element.active = true;
            }
        }
        this.nameLab.string = GameKit.i18n.sel(this.roleMeta.Name());
    }

    public showInfo(data: any) {
        this.meta = data;
        this.roleMeta = this.meta.GetRoleMeata(this.meta.EId());
        this.init();
    }
}
