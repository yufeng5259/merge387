import { _decorator, Component, ScrollBar } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScrollbarSize')
export class ScrollbarSize extends Component {
    @property(ScrollBar)
    public scrollbar: ScrollBar | null = null;

    public onLoad(): void {}

    public start(): void {}
}

export default ScrollbarSize;
