import { _decorator, Component, Node } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('ActivitySlotSymbolShowTester')
@menu('Editor-Tools/ActivitySlotSymbolShowTester')
@executeInEditMode
export class ActivitySlotSymbolShowTester extends Component {
    @property([Node])
    public nodes: Node[] = [];

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

    @property(Node)
    public imgNode: Node | null = null;

    @property
    public imageUrl = '';

    @property
    public checkUpdate = false;

    @property
    public newStr = '';

    clearStage() {
    }

    checkAndUpdate() {
    }

    showImg2(url: any, node: any) {
    }

    showImg(url: any, node: any) {
    }

    readStrShow() {
    }

    getParams() {
    }

    GetNodeParam(node: any, obj: any, dt: any) {
    }
}

export default ActivitySlotSymbolShowTester;
