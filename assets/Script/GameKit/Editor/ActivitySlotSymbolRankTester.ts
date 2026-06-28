import { _decorator, Component, Node } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('ActivitySlotSymbolRankTester')
@menu('Editor-Tools/ActivitySlotSymbolRankTester')
@executeInEditMode
export class ActivitySlotSymbolRankTester extends Component {
    @property(Node)
    public spTitle: Node | null = null;

    @property
    public readStr = '';

    @property
    public reset = false;

    @property
    public isClearStage = false;

    @property
    public showSymbolId = 0;

    @property
    public titleUrl = '';

    @property
    public checkUpdate = false;

    @property
    public newStr = '';

    clearStage() {
    }

    checkAndUpdate() {
    }

    showImg(url: any, node: any) {
    }

    readStrShow() {
    }

    getParams() {
    }

    GetNodeParam(node: any, dt: any) {
    }

    start() {
    }
}

export default ActivitySlotSymbolRankTester;
