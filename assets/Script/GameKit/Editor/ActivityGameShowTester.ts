import { _decorator, Component, Node } from 'cc';

const { ccclass, menu, executeInEditMode, property } = _decorator;

@ccclass('ActivityGameShowTester')
@menu('Editor-Tools/ActivityGameShowTester')
@executeInEditMode
export class ActivityGameShowTester extends Component {
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
    public updateSymbol = false;

    @property
    public ImageURL = '';

    @property
    public checkUpdate = false;

    @property
    public newStr = '';

    clearStage() {
    }

    onLoad() {
    }

    checkAndUpdate() {
    }

    updateSymbolHandler() {
    }

    showBg() {
    }

    readStrShow() {
    }

    parserLabelNodeParam(node: any, dt: any) {
    }

    readLabelString(node: any, dt: any) {
    }

    getParams() {
    }

    GetNodeParam(node: any, dt: any) {
    }

    parserText(dt: any, node: any) {
    }
}

export default ActivityGameShowTester;
