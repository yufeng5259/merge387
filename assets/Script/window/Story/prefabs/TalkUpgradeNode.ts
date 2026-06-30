import { _decorator, Button, Component, Label, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TalkUpgradeNode')
export class TalkUpgradeNode extends Component {
    @property(Label)
    public costLbl: Label | null = null;

    @property(Button)
    public btnUp: Button | null = null;

    @property(Node)
    public infoNode: Node | null = null;

    public meta: any = null;
    public level = 0;

    public start() {
        this.init();
    }

    public init() {
    }

    public showWindow(data: any, l: number) {
        this.meta = data;
        this.level = l;
        this.init();
        this.costLbl.string = Game.SUser.Coin() + '/' + this.meta.Price(this.level);
        this.btnUp.interactable = this.meta.isCanUp(l);
        (this.btnUp as any).enableAutoGrayEffect = !this.meta.isCanUp(l);
        this.meta.isCanUp(l);
    }

    public onlevelUp() {
        const req = SR.SRVillage.levelUpElement(this.meta.MapId(), this.meta.BuildID());
        req.SetCallBack(() => {
            this.upvillage();
        });
        req.Send();
    }

    public upvillage() {
        const reqV = SR.SRVillage.getUserVillage();
        reqV.SetCallBack(() => {
            Game.SUserMap.initMapData();
            GameKit.GameEvent.DispatcherEvent(GameKit.GameEvent.EventName.MapElementLevelUp, {
                buildID: this.meta.BuildID(),
                level: Number(this.level + 1),
            });
        });
        reqV.Send();
    }

    public onShowInfo() {
        this.infoNode.active = !this.infoNode.active;
    }
}
